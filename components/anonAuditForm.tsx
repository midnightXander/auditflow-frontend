'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const API     = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'
const PRIMARY = '#00A4C6'
const ACCENT  = '#0DD3B6'

function cls(...a: (string | false | null | undefined)[]) { return a.filter(Boolean).join(' ') }

// ── Logo ───────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill={PRIMARY} />
        <path d="M6 20 L11 12 L16 16 L21 8" stroke="white" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21" cy="8" r="2.5" fill={ACCENT} />
      </svg>
      <span className="text-base font-black tracking-tight text-gray-900">AuditFlow</span>
    </div>
  )
}

// ── Animated progress bar ──────────────────────────────────────────────────────
function ProgressBar({ progress, label }: { progress: number; label: string }) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color: PRIMARY }}>{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-700 ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
          }}
        />
      </div>
    </div>
  )
}

// ── Stage icon pill ────────────────────────────────────────────────────────────
function StagePill({ active, done, label, icon }: {
  active: boolean; done: boolean; label: string; icon: string
}) {
  return (
    <div className={cls(
      'flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold border transition-all',
      done  ? 'bg-[#0DD3B6]/10 border-[#0DD3B6]/30 text-[#0DD3B6]'
      : active ? 'bg-[#00A4C6]/10 border-[#00A4C6]/30 text-[#00A4C6]'
      : 'bg-gray-50 border-gray-200 text-gray-400'
    )}>
      <span>{icon}</span>
      {label}
      {active && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {done  && <span className="ml-1">✓</span>}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AnonAuditForm() {
  const router = useRouter()
  const [url, setUrl]           = useState('')
  const [phase, setPhase]       = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [stageLabel, setStageLabel] = useState('')
  const [stage, setStage]       = useState<'audit' | 'crawl' | 'done'>('audit')
  const [error, setError]       = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const pollRef  = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    return () => { if (pollRef.current) clearTimeout(pollRef.current) }
  }, [])

  const start = async () => {
    const raw = url.trim()
    if (!raw) return

    setPhase('running')
    setProgress(0)
    setStageLabel('Starting analysis…')
    setStage('audit')
    setError('')

    try {
      const res = await fetch(`${API}/anon/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
      })
      if (!res.ok) throw new Error('Failed to start')
      const { session_token } = await res.json()

      // Persist so the results page + sign-up flow can claim it
      localStorage.setItem('anon_token', session_token)

      // Poll
      const poll = async () => {
        try {
          const s = await fetch(`${API}/anon/status/${session_token}`)
          const data = await s.json()

          setProgress(data.progress ?? 0)
          setStageLabel(data.stage_label ?? '')
          setStage(data.stage ?? 'audit')

          if (data.status === 'completed') {
            setPhase('done')
            setProgress(100)
            // Small pause so user sees 100% before redirect
            setTimeout(() => router.push(`/results/${session_token}`), 600)
          } else if (data.status === 'failed') {
            setPhase('error')
            setError('The analysis failed. Please check the URL and try again.')
          } else {
            pollRef.current = setTimeout(poll, 1500)
          }
        } catch {
          pollRef.current = setTimeout(poll, 2000)
        }
      }

      pollRef.current = setTimeout(poll, 1000)
    } catch (e: any) {
      setPhase('error')
      setError(e.message ?? 'Something went wrong')
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') start()
  }

  const reset = () => {
    if (pollRef.current) clearTimeout(pollRef.current)
    setPhase('idle')
    setProgress(0)
    setUrl('')
    setError('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // ── Trust signals ────────────────────────────────────────────────────────────
  const trustItems = [
    // 'Powered by Google Lighthouse',
    'No sign-up required',
    'Results in ~60 seconds',
    '50-page deep crawl included',
  ]


  return (
      <div className="w-full max-w-[600px] mx-auto px-4 pt-20 pb-16 text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00A4C6]/10 border border-[#00A4C6]/20 text-xs font-semibold text-[#00A4C6] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0DD3B6] inline-block" />
          Free · No account needed · Instant results
        </div>

        {/* ── Input / progress card ──────────────────────────────── */}
        <div className="bg-transparent rounded py-6">

          {phase === 'idle' && (
            <>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Enter your website URL (e.g., https://example.com)"
                  className="flex-1 px-4 py-3 rounded border border-[#374c63] bg-[#1a2a38] text-white placeholder-[#44576a] focus:outline-none focus:border-[#00a4c6] focus:ring-2 focus:ring-[rgba(0,164,198,0.2)] transition-all duration-200 text-sm sm:text-base"
                />
                <button
                  onClick={start}
                  disabled={!url.trim()}
                  className="px-6 py-3 rounded text-sm font-bold text-white bg-[#00A4C6] hover:bg-[#0093B2] disabled:opacity-40 transition-colors whitespace-nowrap"
                >
                  Try Free Audit →
                </button>
              </div>
              {/* <p className="text-xs text-gray-400 mt-3">
                Free audit + 50-page crawl. No login. Results in ~60 seconds.
              </p> */}
            </>
          )}

          {phase === 'running' && (
            <div className="space-y-5">
              {/* Stage pills */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <StagePill
                  icon="⚡"
                  label="Lighthouse audit"
                  active={stage === 'audit'}
                  done={stage === 'crawl' || stage === 'done'}
                />
                <span className="text-gray-300 text-sm">→</span>
                <StagePill
                  icon="🗺️"
                  label="50-page crawl"
                  active={stage === 'crawl'}
                  done={stage === 'done'}
                />
              </div>

              <ProgressBar progress={progress} label={stageLabel} />

              <p className="text-xs text-gray-400">
                Analyzing{' '}
                <span className="font-medium text-gray-600">
                  {url.replace(/^https?:\/\//, '').split('/')[0]}
                </span>
                — this takes about 90 seconds
              </p>
            </div>
          )}

          {phase === 'done' && (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-10 h-10 rounded border-2 border-[#0DD3B6] flex items-center justify-center text-[#0DD3B6] text-lg font-bold">
                ✓
              </div>
              <p className="text-sm font-semibold text-gray-700">Analysis complete — loading your report…</p>
            </div>
          )}

          {phase === 'error' && (
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded px-4 py-3 text-sm text-red-600">
                {error}
              </div>
              <button onClick={reset}
                className="text-sm text-[#00A4C6] hover:underline font-medium">
                ← Try again
              </button>
            </div>
          )}
        </div>


        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
          {trustItems.map(t => (
            <span key={t} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span style={{ color: ACCENT }}>✓</span> {t}
            </span>
          ))}
        </div>
      </div>

  )
}
'use client'
import { useEffect, useRef, useState } from 'react'
import Logo from '@/components/logo'
import Footer2 from '@/components/sections/footer2'
import Link from 'next/link'
const API     = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const PRIMARY = '#00A4C6'
const ACCENT  = '#00A4C6'

// ── tiny helpers ───────────────────────────────────────────────────────────────
function cls(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(' ')
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED BROWSER MOCKUP
// Shows an "agency site" with the widget embedded, a ghost cursor types, runs.
// ─────────────────────────────────────────────────────────────────────────────
function BrowserMockup() {
  const [phase, setPhase] = useState<'idle' | 'typing' | 'analyzing' | 'done'>('idle')
  const [typedUrl, setTypedUrl]   = useState('')
  const [progress, setProgress]   = useState(0)
  const [score, setScore]         = useState(0)
  const timerRef = useRef<NodeJS.Timeout[]>([])

  const TARGET_URL = 'https://myclientsite.com'

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
  }

  const schedule = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timerRef.current.push(t)
  }

  const runAnimation = () => {
    setPhase('idle'); setTypedUrl(''); setProgress(0); setScore(0)
    clearTimers()

    // Start typing after a pause
    schedule(() => {
      setPhase('typing')
      let i = 0
      const typeNext = () => {
        i++
        setTypedUrl(TARGET_URL.slice(0, i))
        if (i < TARGET_URL.length) {
          schedule(typeNext, 55 + Math.random() * 40)
        } else {
          // Pause then click
          schedule(() => {
            setPhase('analyzing')
            // Fill progress
            let p = 0
            const tick = () => {
              p += Math.random() * 8 + 3
              if (p >= 100) {
                setProgress(100)
                schedule(() => {
                  setPhase('done')
                  setScore(74)
                  // Loop after showing result
                  schedule(runAnimation, 5000)
                }, 400)
              } else {
                setProgress(Math.min(p, 97))
                schedule(tick, 160 + Math.random() * 120)
              }
            }
            schedule(tick, 300)
          }, 600)
        }
      }
      schedule(typeNext, 60)
    }, 1200)
  }

  useEffect(() => {
    runAnimation()
    return clearTimers
  }, [])

  const barColor = `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`

  return (
    <div className="relative  w-full max-w-[680px] mx-auto select-none">

      {/* Glow beneath */}
      <div
        className="absolute -inset-4 rounded-2xl blur-3xl opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${PRIMARY}, transparent 70%)` }}
      />

      {/* Browser chrome */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl"
           style={{ background: '#1A2035' }}>
        {/* Tab bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5"
             style={{ background: '#111827' }}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 mx-3">
            <div className="bg-white/5 rounded-md px-3 py-1.5 flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke={ACCENT} strokeWidth="1.2" opacity=".6"/>
                <path d="M4 6h4M6 4v4" stroke={ACCENT} strokeWidth="1" opacity=".6"/>
              </svg>
              <span className="text-xs text-white/40 font-mono">acme-digital.agency/free-seo-check</span>
            </div>
          </div>
        </div>

        {/* Fake agency site */}
        <div className="p-6" style={{ background: '#0F172A' }}>

          {/* Agency nav bar */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                   style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>A</div>
              <span className="text-white font-bold text-sm tracking-tight">Acme Digital</span>
            </div>
            <div className="flex items-center gap-5 text-xs text-white/40">
              <span>Services</span><span>Work</span><span>Contact</span>
              <span className="px-3 py-1 rounded border border-white/10 text-white/60">Hire us</span>
            </div>
          </div>

          {/* Agency headline */}
          <div className="text-center mb-6">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Free tool</p>
            <h3 className="text-white text-2xl font-black leading-tight mb-2">
              Is your website<br/>
              <span style={{ color: ACCENT }}>losing rankings?</span>
            </h3>
            <p className="text-white/40 text-sm">Run a free audit. Results in 90 seconds.</p>
          </div>

          {/* The embedded widget card */}
          <div className="rounded-xl border border-white/10 overflow-hidden"
               style={{ background: '#1A2035' }}>

            {/* Widget header */}
            <div className="px-5 pt-5 pb-4">
              <p className="text-xs text-white/30 mb-3 uppercase tracking-widest">
                Enter your website URL
              </p>

              {/* URL input with ghost cursor */}
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border border-white/10 px-3 py-2.5 flex items-center gap-2 relative"
                     style={{ background: '#111827' }}>
                  <span className="text-white/20 text-xs">
                    {phase === 'idle' && (
                      <span className="text-white/20">https://yourwebsite.com</span>
                    )}
                    {(phase === 'typing' || phase === 'analyzing' || phase === 'done') && (
                      <span className="text-white/80 font-mono text-xs">{typedUrl}</span>
                    )}
                    {phase === 'typing' && (
                      <span className="inline-block w-0.5 h-3 align-middle ml-0.5 animate-pulse"
                            style={{ background: PRIMARY }} />
                    )}
                  </span>
                </div>
                <button
                  className="px-4 py-2.5 rounded-lg text-xs font-bold text-white whitespace-nowrap transition-all"
                  style={{
                    background: phase === 'analyzing'
                      ? 'rgba(0,164,198,0.3)'
                      : `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                    opacity: phase === 'idle' ? 0.4 : 1,
                  }}
                >
                  {phase === 'analyzing' ? 'Analyzing…' : 'Analyze →'}
                </button>
              </div>

              {/* Progress */}
              {phase === 'analyzing' && (
                <div className="mt-3">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: '#ffffff10' }}>
                    <div className="h-full rounded-full transition-all duration-300"
                         style={{ width: `${progress}%`, background: barColor }} />
                  </div>
                  <p className="text-xs text-white/30 mt-1.5">
                    Running Lighthouse audit + crawling pages…
                  </p>
                </div>
              )}
            </div>

            {/* Lead capture field — shown before analysis */}
            {(phase === 'idle' || phase === 'typing') && (
              <div className="px-5 pb-5">
                <div className="rounded-lg border border-white/5 px-3 py-2.5 flex items-center gap-2"
                     style={{ background: '#111827' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <rect x="1" y="3" width="10" height="7" rx="1.5" stroke="white" strokeOpacity=".2" strokeWidth="1"/>
                    <path d="M1 5l5 3 5-3" stroke="white" strokeOpacity=".2" strokeWidth="1"/>
                  </svg>
                  <span className="text-white/20 text-xs">your@email.com (get results in inbox)</span>
                </div>
              </div>
            )}

            {/* Result preview */}
            {phase === 'done' && (
              <div className="px-5 pb-5">
                <div className="rounded-lg border border-white/10 p-4" style={{ background: '#111827' }}>
                  <div className="flex items-center gap-4">
                    {/* Score ring mini */}
                    <div className="relative w-14 h-14 shrink-0">
                      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="white" strokeOpacity=".1" strokeWidth="5"/>
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#F59E0B" strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={`${138.2 * 0.74} 138.2`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-base font-black text-amber-400">{score}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold mb-1">acme-digital.agency</p>
                      <div className="flex gap-1.5">
                        {[
                          { l: 'SEO', s: 68, c: '#F59E0B' },
                          { l: 'Perf', s: 71, c: '#F59E0B' },
                          { l: 'Access', s: 88, c: '#0DD3B6' },
                        ].map(item => (
                          <span key={item.l} className="text-xs px-1.5 py-0.5 rounded"
                                style={{ background: item.c + '22', color: item.c }}>
                            {item.l} {item.s}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs mt-2" style={{ color: PRIMARY }}>
                        View full report + 12 issues found →
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lead captured indicator */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
                  <span className="text-xs" style={{ color: ACCENT }}>
                    Lead captured → your dashboard
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Agency footer copy */}
          <p className="text-center text-white/20 text-xs mt-4">
            Powered by Acme Digital · Free · No account needed
          </p>
        </div>
      </div>

      {/* Label arrow */}
      <div className="absolute -right-4 top-1/3 hidden xl:flex flex-col items-start gap-1 translate-x-full pl-6">
        <div className="flex items-center gap-2">
          <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
            <path d="M0 8h36M30 2l8 6-8 6" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: ACCENT }}>
            Your widget
          </span>
        </div>
        <span className="text-xs text-white/30 pl-10">on your agency site</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE WIDGET (functional — hits the real API)
// ─────────────────────────────────────────────────────────────────────────────
function LiveWidget() {
  const [url, setUrl]             = useState('')
  const [email, setEmail]         = useState('')
  const [phase, setPhase]         = useState<'idle'|'running'|'done'|'error'>('idle')
  const [progress, setProgress]   = useState(0)
  const [stageLabel, setStageLabel] = useState('')
  const [token, setToken]         = useState('')
  const [error, setError]         = useState('')
  const pollRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => () => { if (pollRef.current) clearTimeout(pollRef.current) }, [])

  const start = async () => {
    const raw = url.trim()
    if (!raw) return
    setPhase('running'); setProgress(0); setStageLabel('Starting…'); setError('')

    try {
      const res = await fetch(`${API}/anon/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
      })
      if (!res.ok) throw new Error('Failed to start audit')
      const { session_token } = await res.json()
      setToken(session_token)
      localStorage.setItem('anon_token', session_token)

      const poll = async () => {
        const s = await fetch(`${API}/anon/status/${session_token}`)
        const d = await s.json()
        setProgress(d.progress ?? 0)
        setStageLabel(d.stage_label ?? '')
        if (d.status === 'completed') {
          setPhase('done'); setProgress(100)
        } else if (d.status === 'failed') {
          setPhase('error'); setError('Audit failed — please try again')
        } else {
          pollRef.current = setTimeout(poll, 1500)
        }
      }
      pollRef.current = setTimeout(poll, 1000)
    } catch (e: any) {
      setPhase('error'); setError(e.message ?? 'Something went wrong')
    }
  }

  const reset = () => {
    if (pollRef.current) clearTimeout(pollRef.current)
    setPhase('idle'); setProgress(0); setUrl(''); setEmail(''); setError('')
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-xl border border-white/10 overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #1A2035 0%, #111827 100%)' }}>

        {/* Widget header */}
        <div className="px-6 pt-6 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: ACCENT }} />
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Live demo — fully functional
            </span>
          </div>
          <h3 className="text-white text-xl font-black leading-tight mb-1">
            Free Website SEO Audit
          </h3>
          <p className="text-white/40 text-sm">
            Enter any URL — we'll run a real Lighthouse audit + 50-page crawl.
          </p>
        </div>

        <div className="px-6 py-5 space-y-3">
          {phase === 'idle' && (
            <>
              <div className="rounded-lg border border-white/10 px-4 py-3 flex items-center gap-3 focus-within:border-[#00A4C6] transition-colors"
                   style={{ background: '#0A0E1A' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="white" strokeOpacity=".2" strokeWidth="1.5"/>
                  <path d="M4 7h6M7 4v6" stroke="white" strokeOpacity=".2" strokeWidth="1.5"/>
                </svg>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && start()}
                  placeholder="https://yourwebsite.com"
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
                />
              </div>

              <div className="rounded-lg border border-white/10 px-4 py-3 flex items-center gap-3 focus-within:border-[#00A4C6] transition-colors"
                   style={{ background: '#0A0E1A' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="3.5" width="12" height="8" rx="1.5" stroke="white" strokeOpacity=".2" strokeWidth="1.5"/>
                  <path d="M1 6l6 3.5L13 6" stroke="white" strokeOpacity=".2" strokeWidth="1.5"/>
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com (get results in inbox)"
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
                />
              </div>

              <button
                onClick={start}
                disabled={!url.trim()}
                className="w-full py-3.5 rounded-lg text-sm font-black text-white disabled:opacity-30 transition-all hover:scale-[1.01] active:scale-[.99]"
                style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}
              >
                Analyze website →
              </button>

              <p className="text-center text-xs text-white/25">
                No account needed · 90 seconds · 100% free
              </p>
            </>
          )}

          {phase === 'running' && (
            <div className="py-4 space-y-5">
              <div className="flex items-center justify-center gap-3">
                {[
                  { label: 'Light Speed', icon: '⚡', active: progress < 45, done: progress >= 45 },
                  { label: '50-page crawl', icon: '🗺️', active: progress >= 45 && progress < 100, done: progress >= 100 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <div className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />}
                    <div className={cls(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                      s.done ? 'border-[#0DD3B6]/40 text-[#0DD3B6]'
                      : s.active ? 'border-[#00A4C6]/40 text-[#00A4C6]'
                      : 'border-white/10 text-white/30'
                    )}>
                      <span>{s.icon}</span>
                      {s.label}
                      {s.active && <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: PRIMARY }} />}
                      {s.done && <span className="text-[10px]">✓</span>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                       style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})` }} />
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-white/30">{stageLabel}</span>
                  <span className="text-xs font-bold tabular-nums" style={{ color: PRIMARY }}>{progress}%</span>
                </div>
              </div>

              <p className="text-center text-xs text-white/20">
                Analyzing {url.replace(/^https?:\/\//, '').split('/')[0]}
              </p>
            </div>
          )}

          {phase === 'done' && (
            <div className="py-3 space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border border-[#0DD3B6]/20"
                   style={{ background: 'rgba(13,211,182,0.05)' }}>
                <div className="w-10 h-10 rounded-lg border border-[#0DD3B6]/30 flex items-center justify-center text-lg shrink-0"
                     style={{ background: 'rgba(13,211,182,0.1)' }}>✓</div>
                <div>
                  <p className="text-white text-sm font-bold">Analysis complete!</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Full report + crawl issues ready to view
                  </p>
                </div>
              </div>

              <a href={`/results/${token}`}
                 className="block w-full py-3.5 rounded-lg text-sm font-black text-white text-center transition-all hover:scale-[1.01]"
                 style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>
                View your full report →
              </a>

              <button onClick={reset} className="block w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors">
                Run another audit
              </button>
            </div>
          )}

          {phase === 'error' && (
            <div className="space-y-3 py-2">
              <div className="p-3 rounded-lg border border-red-500/20 text-sm text-red-400"
                   style={{ background: 'rgba(239,68,68,0.05)' }}>
                {error}
              </div>
              <button onClick={reset} className="text-sm font-semibold" style={{ color: PRIMARY }}>
                ← Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LEAD DASHBOARD MOCKUP (animated)
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_LEADS = [
  { email: 'james@renovatepro.com',    site: 'renovatepro.com',    score: 58,  time: 'just now', fresh: true  },
  { email: 'sara@bloomfloral.co',      site: 'bloomfloral.co',     score: 71,  time: '4m ago',   fresh: false },
  { email: 'mike@atlantisrealty.io',   site: 'atlantisrealty.io',  score: 43,  time: '12m ago',  fresh: false },
  { email: 'priya@sunsetspas.net',     site: 'sunsetspas.net',     score: 86,  time: '28m ago',  fresh: false },
  { email: 'dan@truckprosfl.com',      site: 'truckprosfl.com',    score: 61,  time: '1h ago',   fresh: false },
]

function LeadDashboardMockup() {
  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []
    MOCK_LEADS.forEach((_, i) => {
      if (i === 0) return
      timers.push(setTimeout(() => setVisibleCount(i + 1), i * 1400))
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  const scoreColor = (s: number) => s >= 80 ? ACCENT : s >= 60 ? '#F59E0B' : '#EF4444'

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl"
         style={{ background: '#111827' }}>

      {/* Dashboard header */}
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-bold">Lead Dashboard</p>
          <p className="text-white/30 text-xs mt-0.5">Acme Digital Agency</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
             style={{ background: 'rgba(13,211,182,0.1)', color: ACCENT }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: ACCENT }} />
          Live
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5">
        {[
          { label: 'This month', value: '23' },
          { label: 'Avg score',  value: '64'  },
          { label: 'Converted',  value: '4'   },
        ].map(s => (
          <div key={s.label} className="px-4 py-3 text-center">
            <p className="text-xl font-black text-white">{s.value}</p>
            <p className="text-xs text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Lead rows */}
      <div className="divide-y divide-white/5">
        {MOCK_LEADS.slice(0, visibleCount).map((lead, i) => (
          <div
            key={lead.email}
            className="flex items-center gap-3 px-5 py-3.5 transition-all duration-500"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i === visibleCount - 1 && lead.fresh ? 'translateY(-2px)' : 'none',
              background: lead.fresh && i === 0 ? 'rgba(13,211,182,0.04)' : 'transparent',
            }}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                 style={{ background: `hsl(${(lead.email.charCodeAt(0) * 17) % 360}, 40%, 30%)` }}>
              {lead.email[0].toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate flex items-center gap-1.5">
                {lead.email}
                {i === 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(13,211,182,0.15)', color: ACCENT }}>
                    New
                  </span>
                )}
              </p>
              <p className="text-white/30 text-xs truncate">{lead.site}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-black tabular-nums"
                    style={{ color: scoreColor(lead.score) }}>
                {lead.score}
              </span>
              <span className="text-xs text-white/20">{lead.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/5">
        <p className="text-xs text-white/20 text-center">
          Each audit = one lead captured automatically
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CODE SNIPPET with copy
// ─────────────────────────────────────────────────────────────────────────────
function CodeSnippet({ apiKey = 'af_embed_••••••••••••' }: { apiKey?: string }) {
  const [copied, setCopied] = useState(false)
  const code = `<script src="https://api.auditflow.com/api/embed/widget.js?api_key=${apiKey}"></script>\n<div id="auditflow-widget"></div>`

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden"
         style={{ background: '#0A0E1A' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <span className="text-xs text-white/20 font-mono">embed.html</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded transition-all"
          style={{
            color: copied ? ACCENT : 'rgba(255,255,255,0.4)',
            background: copied ? 'rgba(13,211,182,0.1)' : 'transparent',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-xs leading-relaxed overflow-x-auto">
        <code>
          <span className="text-white/30">&lt;script </span>
          <span style={{ color: PRIMARY }}>src</span>
          <span className="text-white/30">=</span>
          <span style={{ color: ACCENT }}>"https://api.auditflow.com/api/embed/widget.js</span>
          <span className="text-white/30">?</span>
          <span style={{ color: PRIMARY }}>api_key</span>
          <span className="text-white/30">=</span>
          <span style={{ color: ACCENT }}>{apiKey}"</span>
          <span className="text-white/30">&gt;&lt;/script&gt;</span>
          {'\n'}
          <span className="text-white/30">&lt;div </span>
          <span style={{ color: PRIMARY }}>id</span>
          <span className="text-white/30">="</span>
          <span style={{ color: ACCENT }}>auditflow-widget</span>
          <span className="text-white/30">"&gt;&lt;/div&gt;</span>
        </code>
      </pre>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM LOGOS
// ─────────────────────────────────────────────────────────────────────────────
const PLATFORMS = ['WordPress', 'Shopify', 'Wix', 'Webflow', 'Squarespace', 'Any HTML']

// ─────────────────────────────────────────────────────────────────────────────
// ANNOTATION CALLOUT
// ─────────────────────────────────────────────────────────────────────────────
function Annotation({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cls('absolute pointer-events-none', className)}>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <div className="w-1.5 h-1.5 rounded-full border-2"
             style={{ borderColor: ACCENT, background: ACCENT }} />
        <span className="text-xs font-semibold" style={{ color: ACCENT }}>{text}</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DemoPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0A0E1A', color: 'white' }}>

      {/* ── Sticky nav ──────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,14,26,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm text-white"
                 style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>A</div>
            <span className="font-black text-sm tracking-tight">AuditFlow</span>
            <span className="hidden sm:block text-xs text-white/30 ml-1">/ Embed demo</span>
          </a> */}
          <Logo />
          <div className="flex items-center gap-4">
            {/* <a href="/dashboard/embed"
               className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors">
              For agencies
            </a> */}
            <Link href="/register"
               className="px-4 py-2 rounded text-sm font-bold text-white transition-all hover:opacity-90"
               style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>
              Get your embed code →
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          The mockup IS the hero. No H1 above the fold.
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">

        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               backgroundImage: `linear-gradient(rgba(0,164,198,0.03) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(0,164,198,0.03) 1px, transparent 1px)`,
               backgroundSize: '48px 48px',
             }} />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
             style={{ background: `radial-gradient(ellipse at center top, rgba(0,164,198,0.12), transparent 70%)` }} />

        <div className="max-w-6xl pb-10 overflow-y-hidden  mx-auto">

          {/* Eyebrow */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-semibold"
                 style={{
                   borderColor: `${PRIMARY}40`,
                   background: `${PRIMARY}0D`,
                   color: PRIMARY,
                 }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: ACCENT }} />
              Live embed widget demo — fully functional
            </div>
          </div>

          {/* Main animated mockup */}
          <BrowserMockup />

          {/* Hero copy — BELOW the mockup intentionally */}
          <div className="text-center mt-14 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-5">
              This widget lives on{' '}
              <span style={{
                background: `linear-gradient(135deg, ${PRIMARY}, #0DD3B6)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                your agency site.
              </span>
              <br />
              Every audit is a lead.
            </h1>
            <p className="text-white/40 text-lg leading-relaxed mb-8">
              One line of code. Your branding. Your colors. Your CTA.
              Visitors audit their site — you capture their email and score
              automatically.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a href="/register"
                 className="px-7 py-3.5 rounded text-sm font-black text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                 style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>
                Get your free embed code →
              </a>
              <a href="#try-it"
                 className="px-7 py-3.5 rounded text-sm font-semibold border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all">
                Try it live ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — LIVE WIDGET (functional)
          ══════════════════════════════════════════════════════════════════════ */}
      <section id="try-it" className="py-24 px-6 relative"
               style={{ background: 'linear-gradient(180deg, #0A0E1A 0%, #111827 100%)' }}>
        <div className="max-w-6xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* <div className="space-y-16 items-center"> */}

            {/* Left: copy */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
                Try it yourself
              </p>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-5">
                This is exactly what your clients see.
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-8">
                Enter your own website URL below. The same audit runs, the same results
                appear, the same email gets captured — except in your version, the lead
                goes straight to your dashboard.
              </p>

              {/* <div className="space-y-4">
                {[
                  { icon: '⚡', title: 'Light speed audit',    sub: 'Performance, SEO, accessibility, best practices' },
                  { icon: '🗺️', title: '50-page deep crawl',  sub: 'Missing H1s, broken links, thin content, duplicate titles' },
                  { icon: '📋', title: 'Branded results page', sub: 'Your logo, colors, and CTA — not ours' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                         style={{ background: 'rgba(0,164,198,0.1)', border: `1px solid ${PRIMARY}30` }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-white/30 mt-0.5 leading-snug">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>

            {/* Right: live widget */}
            <div>
              <LiveWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3 — WHAT CLIENTS SEE (annotated result preview)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#F4F6FA' }}>
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: PRIMARY }}>
              The results page
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
              What your client sees after the audit
            </h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              Every element carries your branding. Your logo. Your accent color.
              Your CTA button linking to your services.
            </p>
          </div>

          {/* Annotated preview */}
          <div className="relative max-w-3xl mx-auto">
            <div className="rounded-xl border border-gray-200 shadow-xl overflow-hidden bg-white">

              {/* Fake results nav */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-black text-white"
                       style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>A</div>
                  <span className="text-sm font-black text-gray-900">Acme Digital</span>
                </div>
                <button className="px-4 py-1.5 rounded text-xs font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>
                  Save this report →
                </button>
              </div>

              <div className="p-6">
                {/* Score + domain header */}
                <div className="flex items-center gap-6 p-4 rounded-xl border border-gray-100 mb-5"
                     style={{ background: '#F9FAFB' }}>
                  <div className="relative w-20 h-20 shrink-0">
                    <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#E5E7EB" strokeWidth="7"/>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#F59E0B" strokeWidth="7"
                        strokeLinecap="round" strokeDasharray={`${201 * 0.68} 201`}/>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-amber-500">68</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base">myclientsite.com</h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {[
                        { l: '14 pages crawled', c: PRIMARY },
                        { l: '5 critical issues', c: '#EF4444' },
                        { l: '3 warnings', c: '#F59E0B' },
                      ].map(b => (
                        <span key={b.l} className="text-xs px-2 py-0.5 rounded font-semibold"
                              style={{ background: b.c + '15', color: b.c }}>{b.l}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Issue list preview */}
                <div className="space-y-2 mb-5">
                  {[
                    { sev: '#EF4444', label: 'Pages missing H1 tag', count: '6 pages' },
                    { sev: '#EF4444', label: 'Pages missing meta description', count: '4 pages' },
                    { sev: '#F59E0B', label: 'Duplicate page titles', count: '3 pages' },
                    { sev: '#00A4C6', label: 'Pages with multiple H1 tags', count: '1 page' },
                  ].map(issue => (
                    <div key={issue.label} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: issue.sev }} />
                        <span className="text-sm text-gray-800">{issue.label}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded"
                            style={{ background: issue.sev + '15', color: issue.sev }}>
                        {issue.count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Agency CTA */}
                <div className="rounded-xl p-5 text-center"
                     style={{ background: `linear-gradient(135deg, ${PRIMARY}15, ${ACCENT}10)`,
                              border: `1px solid ${PRIMARY}30` }}>
                  <p className="text-sm font-black text-gray-900 mb-1">Ready to fix these issues?</p>
                  <p className="text-xs text-gray-500 mb-4">Acme Digital can fix every issue above in 1 week.</p>
                  <button className="px-6 py-2.5 rounded text-sm font-black text-white"
                          style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>
                    Get a free consultation →
                  </button>
                </div>
              </div>
            </div>

            {/* Annotations */}
            <div className="hidden lg:block">
              <div className="absolute -left-52 top-4 flex items-center gap-2">
                <span className="text-xs font-semibold text-right whitespace-nowrap" style={{ color: ACCENT }}>Your agency logo</span>
                <div className="flex items-center gap-1">
                  <div className="w-10 h-px" style={{ background: ACCENT + '50' }}/>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }}/>
                </div>
              </div>
              <div className="absolute -right-48 top-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: PRIMARY }}/>
                  <div className="w-10 h-px" style={{ background: PRIMARY + '50' }}/>
                </div>
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: PRIMARY }}>Your brand colors</span>
              </div>
              <div className="absolute -right-48 bottom-20 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: PRIMARY }}/>
                  <div className="w-10 h-px" style={{ background: PRIMARY + '50' }}/>
                </div>
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: PRIMARY }}>Your CTA + link</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4 — LEAD CAPTURE PROOF (animated dashboard)
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: animated dashboard */}
            <div>
              <LeadDashboardMockup />
            </div>

            {/* Right: copy */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
                Every audit = a lead
              </p>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-5">
                Visitors audit.
                <br />
                You capture.
                <br />
                <span style={{ color: ACCENT }}>Automatically.</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-8">
                When someone uses your embedded widget and enters their email,
                they appear instantly in your lead dashboard — with their website,
                SEO score, and every issue we found.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { stat: '100%', label: 'of audits capture an email (when required)' },
                  { stat: '23×',  label: 'average new leads per agency per month' },
                  { stat: '<30s', label: 'to set up on any website' },
                ].map(item => (
                  <div key={item.stat} className="flex items-baseline gap-3">
                    <span className="text-2xl font-black tabular-nums shrink-0"
                          style={{ color: PRIMARY }}>{item.stat}</span>
                    <span className="text-sm text-white/40 leading-snug">{item.label}</span>
                  </div>
                ))}
              </div>

              <a href="/register"
                 className="inline-flex items-center gap-2 px-6 py-3 rounded text-sm font-black text-white transition-all hover:opacity-90"
                 style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>
                Start capturing leads →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5 — EMBED CODE + PLATFORMS
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ background: '#0A0E1A' }}>
        <div className="max-w-3xl mx-auto text-center">

          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: PRIMARY }}>
            Integration
          </p>
          <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-4">
            Two lines. Works everywhere.
          </h2>
          <p className="text-white/40 text-base mb-10">
            Paste this where you want the widget to appear. No plugins, no npm, no build step.
          </p>

          <div className="mb-10">
            <CodeSnippet />
          </div>

          {/* Platform grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {PLATFORMS.map(p => (
              <div key={p}
                   className="px-4 py-2 rounded border text-sm font-semibold text-white/40 transition-colors hover:text-white/70 hover:border-white/20"
                   style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                {p}
              </div>
            ))}
          </div>

          <p className="text-white/20 text-sm">
            Already have a dashboard account?{' '}
            <a href="/dashboard/embed" className="underline transition-colors hover:text-white/40">
              Generate your API key →
            </a>
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6 — SECOND WIDGET + FINAL CTA
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden"
               style={{ background: `linear-gradient(135deg, #0A1628, #0A0E1A)` }}>

        {/* Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
             style={{ background: `radial-gradient(ellipse at center bottom, ${ACCENT}15, transparent 70%)` }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: CTA copy */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-5">
                Ready to embed this{' '}
                <span style={{ color: ACCENT }}>on your site?</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-8">
                Get your free API key, paste two lines of code, and start capturing
                qualified leads from your own traffic — starting today.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Free on all plans',
                  'Your branding on everything',
                  'Leads appear in your dashboard instantly',
                  'Works on any website or CMS',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                         style={{ background: `${ACCENT}20` }}>
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="text-sm text-white/60">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <a href="/register"
                   className="px-7 py-3.5 rounded text-sm font-black text-white transition-all hover:opacity-90"
                   style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>
                  Get your embed code →
                </a>
                <a href="/signin"
                   className="text-sm font-semibold text-white/40 hover:text-white/70 transition-colors">
                  I have an account
                </a>
              </div>
            </div>

            {/* Right: second live widget */}
            <div>
              <LiveWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <Footer2 />
    </div>
  )
}
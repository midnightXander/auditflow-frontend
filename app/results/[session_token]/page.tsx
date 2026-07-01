'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Download, Search } from 'lucide-react'
import Logo from '@/components/logo'
import GoogleSignInButton from '@/components/googleSigninButton'

const API     = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'
const PRIMARY = '#00A4C6'
const ACCENT  = '#0DD3B6'

function cls(...a: (string | false | null | undefined)[]) { return a.filter(Boolean).join(' ') }



// ── Score ring ─────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 52
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? ACCENT : score >= 50 ? '#F59E0B' : '#EF4444'

  return (
    <div className="relative inline-flex items-center justify-center w-36 h-36">
      <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10"/>
        <circle cx="72" cy="72" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black tabular-nums" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400 -mt-0.5">/100</span>
      </div>
    </div>
  )
}

// ── Category bar ───────────────────────────────────────────────────────────────
function CategoryBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? ACCENT : score >= 50 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
        <div className="h-full rounded transition-all duration-700"
          style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums w-8 text-right" style={{ color }}>
        {score}
      </span>
    </div>
  )
}

// ── Issue row ──────────────────────────────────────────────────────────────────
type Severity = 'critical' | 'warning' | 'info'

function IssueRow({ sev, label, count, urls }: {
  sev: Severity; label: string; count: number; urls?: string[]
}) {
  const [open, setOpen] = useState(false)
  const dot: Record<Severity, string> = {
    critical: 'bg-red-500',
    warning:  'bg-amber-400',
    info:     'bg-[#00A4C6]',
  }
  const pill: Record<Severity, string> = {
    critical: 'bg-red-50 text-red-600 border border-red-200',
    warning:  'bg-amber-50 text-amber-700 border border-amber-200',
    info:     'bg-[#00A4C6]/10 text-[#00A4C6] border border-[#00A4C6]/20',
  }
  const hasUrls = urls && urls.length > 0

  return (
    <div
      className={cls('p-3 rounded border bg-white', hasUrls ? 'cursor-pointer' : '')}
      onClick={() => hasUrls && setOpen(o => !o)}
    >
      <div className="flex items-center gap-3">
        <div className={cls('w-2 h-2 rounded-full shrink-0', dot[sev])} />
        <span className="flex-1 text-sm text-gray-800">{label}</span>
        <span className={cls('text-xs font-bold px-2 py-0.5 rounded', pill[sev])}>
          {count} page{count !== 1 ? 's' : ''}
        </span>
        {hasUrls && (
          <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
        )}
      </div>

      {open && urls && (
        <div className="mt-2 pt-2 border-t border-gray-100 space-y-1 pl-5">
          {urls.slice(0, 8).map(u => (
            <p key={u} className="text-xs text-gray-500 truncate font-mono">{u}</p>
          ))}
          {urls.length > 8 && (
            <p className="text-xs text-gray-400">+{urls.length - 8} more pages</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Signup gate modal ──────────────────────────────────────────────────────────
function SignupGate({ url, token }: { url: string; token: string }) {
  const router = useRouter()
  const [fullName, setFullName]       = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [err, setErr]           = useState('')

  const register = async () => {
    if (!email || !password) return setErr('Email and password required')
    if (password.length < 8) return setErr('Password must be at least 8 characters')

    setLoading(true); setErr('')
    try {
      // Register
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, 'full_name' : fullName }),
      })
      if (!res.ok) {
        const e = await res.json()
        throw new Error(e.detail ?? 'Registration failed')
      }
      const { access_token, refresh_token } = await res.json()
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      // Claim the anonymous audit
      await fetch(`${API}/anon/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ session_token: token }),
      })

      localStorage.removeItem('anon_token')
      router.push('/dashboard')
    } catch (e: any) {
      setErr(e.message ?? 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded border border-gray-200 shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 text-center">
          <div className="inline-flex w-10 h-10 rounded bg-[#00A4C6]/10 items-center justify-center mb-3 text-lg">
            <Download className='h-8 w-8 text-[#00A4C6]' />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Save your report & fix these issues</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create a free account to keep this report, track progress, and monitor rankings.
          </p>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-3">
          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</div>
          )}
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A4C6] transition-colors"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A4C6] transition-colors"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#00A4C6] transition-colors"
          />
          <button
            onClick={register}
            disabled={loading}
            className="w-full py-3 rounded text-sm font-bold text-white bg-[#00A4C6] hover:bg-[#0093B2] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating account…' : 'Save my free report →'}
          </button>

          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"/>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">or</span>
            </div>
          </div>
          <GoogleSignInButton className='w-full rounded-2xl mt-4' />
          <a href="/signin"
            className="block w-full py-2.5 rounded text-sm font-semibold text-center text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
            Sign in to existing account
          </a>
        </div>

        <p className="px-6 pb-5 text-center text-xs text-gray-400">
          Free forever · No credit card · Your report stays saved for 30 days
        </p>
      </div>
    </div>
  )
}

// ── Main results page ──────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { session_token } = useParams() as { session_token: string }
  console.log(session_token)

  const [data, setData]           = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [showGate, setShowGate]   = useState(false)
  const [error, setError]         = useState('')
  const gateTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/anon/results/${session_token}`)
        if (!res.ok) throw new Error('Results not found or expired')
        const json = await res.json()
        setData(json)
        console.log(json)

        // Show signup gate after 8 seconds — user has had time to see value
        if (!json.claimed) {
          gateTimerRef.current = setTimeout(() => setShowGate(true), 8000)
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { if (gateTimerRef.current) clearTimeout(gateTimerRef.current) }
  }, [session_token])

  // ── Helpers ────────────────────────────────────────────────────────────────
  const auditCategories = (data?.audit_results?.lighthouse?.categories ?? {})
  const crawlIssues     = data?.crawl_results?.issues ?? {}
  const crawlSummary    = data?.crawl_results?.summary ?? {}

  // Collect crawl issues into a flat display list
  const crawlIssueList: { sev: 'critical' | 'warning' | 'info'; label: string; count: number; urls: string[] }[] = []

  if (crawlIssues.missing_h1?.length) {
    crawlIssueList.push({
      sev: 'critical',
      label: 'Pages missing H1 tag',
      count: crawlIssues.missing_h1.length,
      urls: crawlIssues.missing_h1,
    })
  }
  if (crawlIssues.missing_meta_description?.length) {
    crawlIssueList.push({
      sev: 'critical',
      label: 'Pages missing meta description',
      count: crawlIssues.missing_meta_description.length,
      urls: crawlIssues.missing_meta_description,
    })
  }
  if (crawlIssues.broken_pages?.length) {
    crawlIssueList.push({
      sev: 'critical',
      label: 'Broken pages (4xx / 5xx)',
      count: crawlIssues.broken_pages.length,
      urls: crawlIssues.broken_pages.map((p: any) => p.url ?? p),
    })
  }
  if (crawlIssues.duplicate_titles && Object.keys(crawlIssues.duplicate_titles).length) {
    const dupes = Object.keys(crawlIssues.duplicate_titles)
    crawlIssueList.push({
      sev: 'warning',
      label: 'Duplicate page titles',
      count: dupes.length,
      urls: dupes,
    })
  }
  if (crawlIssues.thin_content?.length) {
    crawlIssueList.push({
      sev: 'warning',
      label: 'Thin content pages (<300 words)',
      count: crawlIssues.thin_content.length,
      urls: crawlIssues.thin_content.map((p: any) => p.url ?? p),
    })
  }
  if (crawlIssues.orphan_pages?.length) {
    crawlIssueList.push({
      sev: 'warning',
      label: 'Orphan pages (no internal links)',
      count: crawlIssues.orphan_pages.length,
      urls: crawlIssues.orphan_pages.map((p: any) => p.url ?? p),
    })
  }
  if (crawlIssues.multiple_h1?.length) {
    crawlIssueList.push({
      sev: 'info',
      label: 'Pages with multiple H1 tags',
      count: crawlIssues.multiple_h1.length,
      urls: crawlIssues.multiple_h1.map((p: any) => p.url ?? p),
    })
  }
  if (crawlIssues.slow_pages?.length) {
    crawlIssueList.push({
      sev: 'warning',
      label: 'Slow loading pages (>3s)',
      count: crawlIssues.slow_pages.length,
      urls: crawlIssues.slow_pages.map((p: any) => p.url ?? p),
    })
  }

  const totalCrawlIssues = crawlIssueList.reduce((s, i) => s + i.count, 0)
  const criticalCount    = crawlIssueList.filter(i => i.sev === 'critical').reduce((s, i) => s + i.count, 0)

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[#00A4C6] rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Loading your report…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#141e27] flex items-center justify-center">
      <div className="bg-white rounded border border-gray-200 p-8 max-w-sm text-center space-y-4">
        <div  className='flex w-full justify-center mx-auto'>
          <Search className="w-10 h-10 text-[#00A4C6] text-3xl" />
        </div>
       
        <h2 className="text-base font-bold text-gray-900">Report not found</h2>
        <p className="text-sm text-gray-500">{error}</p>
        <a href="/" className="inline-block px-5 py-2 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors">
          Run a new audit
        </a>
      </div>
    </div>
  )

  const domain = (data.url ?? '').replace(/^https?:\/\//, '').split('/')[0]

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans">

      {/* ── Nav ───────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
          <Logo variant={'dark'} />
          <div className="flex items-center gap-3">
            {!data.claimed && (
              <button
                onClick={() => setShowGate(true)}
                className="px-4 py-1.5 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors"
              >
                Save this report →
              </button>
            )}
            {data.claimed && (
              <a href="/dashboard"
                className="px-4 py-1.5 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors">
                Go to dashboard →
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[960px] mx-auto px-6 py-8 space-y-6">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="bg-white rounded border border-gray-200 px-6 py-5 flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Website analyzed</p>
            <h1 className="text-xl font-black text-gray-900 truncate">{domain}</h1>
            <p className="text-xs text-gray-400 mt-1">{data.url}</p>
          </div>
          {data.audit_score != null && <ScoreRing score={data.audit_score} />}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#0DD3B6]"/>
              <span className="text-gray-600">
                <strong className="text-gray-900">{data.pages_crawled ?? 0}</strong> pages crawled
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-red-400"/>
              <span className="text-gray-600">
                <strong className="text-gray-900">{criticalCount}</strong> critical issues
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400"/>
              <span className="text-gray-600">
                <strong className="text-gray-900">{totalCrawlIssues}</strong> total issues found
              </span>
            </div>
          </div>
        </div>

        {/* ── Two-column body ──────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* LEFT — crawl issues */}
          <div className="space-y-5">

            {/* Summary numbers */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Pages crawled',  value: data.pages_crawled ?? 0, accent: true },
                { label: 'Critical issues', value: criticalCount, red: criticalCount > 0 },
                { label: 'Warnings',        value: crawlIssueList.filter(i => i.sev === 'warning').reduce((s, i) => s + i.count, 0) },
              ].map(s => (
                <div key={s.label} className="bg-white rounded border border-gray-200 px-4 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">{s.label}</span>
                  <span className={cls(
                    'text-3xl font-black tabular-nums',
                    s.accent ? 'text-[#00A4C6]' : (s as any).red ? 'text-red-500' : 'text-gray-900'
                  )}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Crawl issues list */}
            <div className="bg-white rounded border border-gray-200">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  🗺️ Crawl issues
                  {crawlIssueList.length > 0 && (
                    <span className="text-xs bg-red-50 text-red-500 border border-red-200 px-2 py-0.5 rounded font-semibold">
                      {crawlIssueList.length} types found
                    </span>
                  )}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Based on {data.pages_crawled ?? 0} pages crawled across {domain}
                </p>
              </div>
              <div className="p-4 space-y-2">
                {crawlIssueList.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-400">
                    <span className="text-2xl block mb-2">🎉</span>
                    No crawl issues found — great work!
                  </div>
                ) : (
                  crawlIssueList.map((issue, i) => (
                    <IssueRow key={i} {...issue} />
                  ))
                )}
              </div>
            </div>

            {/* Crawl site stats */}
            {crawlSummary.total_pages_crawled && (
              <div className="bg-white rounded border border-gray-200 px-5 py-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">📊 Site overview</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Internal links', value: crawlSummary.total_internal_links?.toLocaleString() },
                    { label: 'External links', value: crawlSummary.total_external_links?.toLocaleString() },
                    { label: 'Avg word count', value: crawlSummary.avg_word_count?.toLocaleString() },
                    { label: 'Avg load time',  value: crawlSummary.avg_load_time_ms ? `${crawlSummary.avg_load_time_ms}ms` : '—' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-gray-500 text-xs">{s.label}</span>
                      <span className="font-semibold text-gray-800 text-xs">{s.value ?? '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Lighthouse scores */}
          <div className="space-y-5">
            {/* Category scores */}
            <div className="bg-white rounded border border-gray-200 px-5 py-4">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                ⚡ Lighthouse scores
              </h2>
              {Object.keys(auditCategories).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(auditCategories).map(([key, cat]: [string, any]) => {
                    const score = typeof cat === 'object' ? Math.round((cat.score ?? 0)) : Math.round(cat ?? 0)
                    const label = key.split(/[-_]/).map((w: string) => w[0].toUpperCase() + w.slice(1)).join(' ')
                    return <CategoryBar key={key} label={label} score={score} />
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Lighthouse data unavailable</p>
              )}
            </div>

            {/* Signup CTA box */}
            {!data.claimed && (
              <div
                className="rounded border-2 border-[#00A4C6] bg-[#00A4C6]/5 px-5 py-5 cursor-pointer"
                onClick={() => setShowGate(true)}
              >
                <p className="text-sm font-bold text-gray-900 mb-1">
                  Fix these issues with OUTAUDITS
                </p>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Save this report, track your fixes over time, monitor rankings, and get
                  notified the moment something breaks — for free.
                </p>
                <button className="w-full py-2.5 rounded text-sm font-bold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors">
                  Create free account →
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">
                  No credit card · Takes 30 seconds
                </p>
              </div>
            )}

            {/* Expiry notice */}
            {data.expires_at && !data.claimed && (
              <p className="text-xs text-center text-gray-400">
                This report expires {new Date(data.expires_at).toLocaleDateString()} —
                save it by creating a free account.
              </p>
            )}
          </div>
        </div>

        {/* ── Bottom CTA strip ──────────────────────────────────────── */}
        {!data.claimed && (
          <div className="bg-gray-900 rounded border border-gray-800 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-sm">You've seen your issues. Ready to fix them?</p>
              <p className="text-gray-400 text-xs mt-0.5">
                OUTAUDITS tracks your progress, monitors new issues, and compares you to competitors — free.
              </p>
            </div>
            <button
              onClick={() => setShowGate(true)}
              className="px-6 py-2.5 rounded text-sm font-bold text-gray-900 bg-[#0DD3B6] hover:bg-[#0BC4A8] transition-colors whitespace-nowrap"
            >
              Save report & get started →
            </button>
          </div>
        )}
      </div>

      {/* ── Signup gate ─────────────────────────────────────────────── */}
      {showGate && (
        <SignupGate
          url={data.url}
          token={session_token}
        />
      )}
    </div>
  )
}
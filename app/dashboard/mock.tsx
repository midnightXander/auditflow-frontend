'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const API     = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const PRIMARY = '#00A4C6'
const ACCENT  = '#0DD3B6'

function cls(...a: (string | false | null | undefined)[]) { return a.filter(Boolean).join(' ') }

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
  }
}

// ── Score colour ───────────────────────────────────────────────────────────────
function scoreColor(s: number | null | undefined) {
  if (s == null) return '#9CA3AF'
  return s >= 80 ? ACCENT : s >= 50 ? '#F59E0B' : '#EF4444'
}

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-[#0DD3B6]/10 text-[#0DD3B6] border border-[#0DD3B6]/30',
    running:   'bg-[#00A4C6]/10 text-[#00A4C6] border border-[#00A4C6]/30',
    pending:   'bg-amber-50 text-amber-600 border border-amber-200',
    failed:    'bg-red-50 text-red-500 border border-red-200',
  }
  return (
    <span className={cls('inline-block px-2 py-0.5 rounded text-xs font-medium capitalize',
      map[status] ?? map.pending)}>
      {status === 'running'
        ? <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A4C6] animate-pulse inline-block"/>running
          </span>
        : status}
    </span>
  )
}

// ── Credits bar ────────────────────────────────────────────────────────────────
function CreditsBar({ used, limit }: { used: number; limit: number }) {
  const remaining = used
  const pct       = Math.min((remaining / limit) * 100, 100)
  const low       = pct < 20
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">Credits remaining</span>
        <span className={cls('font-bold tabular-nums', low ? 'text-red-500' : 'text-gray-700')}>
          {remaining} / {limit}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: low
              ? '#EF4444'
              : `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
          }}
        />
      </div>
    </div>
  )
}

// ── Time ago ───────────────────────────────────────────────────────────────────
function timeAgo(iso: string | null) {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Quick action card ──────────────────────────────────────────────────────────
function QuickAction({ icon, label, sub, href, accent }: {
  icon: string; label: string; sub: string; href: string; accent?: boolean
}) {
  return (
    <a href={href}
      className={cls(
        'bg-white rounded border px-4 py-4 flex items-start gap-3 hover:border-[#00A4C6]/40 hover:shadow-sm transition-all group',
        accent ? 'border-[#00A4C6]' : 'border-gray-200'
      )}>
      <span className="text-2xl">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-[#00A4C6] transition-colors">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5 leading-snug">{sub}</p>
      </div>
      <span className="text-gray-300 group-hover:text-[#00A4C6] text-sm transition-colors ml-auto shrink-0">→</span>
    </a>
  )
}

// ── Recent item row ────────────────────────────────────────────────────────────
function RecentRow({ icon, label, sub, score, status, href, time }: {
  icon: string; label: string; sub?: string; score?: number | null
  status: string; href: string; time: string
}) {
  return (
    <a href={href}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors rounded group">
      <span className="text-lg shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#00A4C6] transition-colors">
          {label}
        </p>
        {sub && <p className="text-xs text-gray-400 truncate">{sub}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {score != null && (
          <span className="text-base font-black tabular-nums" style={{ color: scoreColor(score) }}>
            {score}
          </span>
        )}
        <StatusBadge status={status} />
        <span className="text-xs text-gray-400 hidden sm:block">{time}</span>
      </div>
    </a>
  )
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</h2>
      <a href={href} className="text-xs text-[#00A4C6] hover:underline font-medium">View all →</a>
    </div>
  )
}

// ── Empty card ─────────────────────────────────────────────────────────────────
function EmptyCard({ icon, label, href, cta }: { icon: string; label: string; href: string; cta: string }) {
  return (
    <a href={href}
      className="flex flex-col items-center justify-center gap-2 py-8 text-center hover:bg-gray-50 rounded border border-dashed border-gray-200 transition-colors">
      <span className="text-2xl">{icon}</span>
      <p className="text-xs text-gray-500">{label}</p>
      <span className="text-xs text-[#00A4C6] font-semibold">{cta} →</span>
    </a>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth()
  const router   = useRouter()
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/dashboard/summary`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const startAudit = () => router.push('/audit')

  if (loading) return (
    <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-[#00A4C6] rounded-full animate-spin"/>
    </div>
  )

  const u         = data?.user
  const audits    = data?.recent_audits    ?? []
  const crawls    = data?.recent_crawls    ?? []
  const comps     = data?.recent_comparisons ?? []
  const checklist = data?.checklist

  const name = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there'

  // Compute what's "new" since account creation (just today for greeting variant)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Plan display
  const planColors: Record<string, string> = {
    free:   'text-gray-500',
    pro:    'text-[#00A4C6]',
    agency: 'text-[#0DD3B6]',
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-gray-900">{greeting}, {name}</h1>
          <p className="text-xs text-gray-400">
            {u && (
              <>
                <span className={cls('font-semibold capitalize', planColors[u.plan] ?? planColors.free)}>
                  {u.plan}
                </span>
                {' '}plan ·{' '}
                <span className="font-semibold text-gray-600">{u.credits_remaining}</span> credits left
              </>
            )}
          </p>
        </div>
        <button
          onClick={startAudit}
          className="px-4 py-1.5 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors"
        >
          + New audit
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-8">

        {/* ── Credits + plan ───────────────────────────────────────── */}
        {u && (
          <div className="grid sm:grid-cols-3 gap-3">
            {/* Credits card */}
            <div className="bg-white rounded border border-gray-200 px-5 py-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Usage this month</p>
              <CreditsBar used={u.credits_remaining} limit={u.credits_limit} />
              {u.credits_remaining <= 2 && (
                <a href="/dashboard/billing"
                  className="inline-block mt-3 text-xs text-white bg-[#00A4C6] hover:bg-[#0093B2] px-3 py-1.5 rounded font-semibold transition-colors">
                  Upgrade for more credits →
                </a>
              )}
            </div>

            {/* Plan card */}
            <div className="bg-white rounded border border-gray-200 px-5 py-4 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Current plan</p>
                <p className={cls('text-2xl font-black capitalize', planColors[u.plan] ?? planColors.free)}>
                  {u.plan}
                </p>
              </div>
              {u.plan === 'free' && (
                <a href="/dashboard/billing"
                  className="mt-3 text-xs text-[#00A4C6] hover:underline font-semibold">
                  Upgrade to Pro →
                </a>
              )}
            </div>
          </div>
        )}

        {/* ── Quick actions ────────────────────────────────────────── */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <QuickAction icon="⚡" label="New audit"      sub="Lighthouse + SEO check"       href="/audit"         accent />
            <QuickAction icon="🗺️" label="Deep crawl"     sub="Up to 500 pages"              href="/crawl"         />
            <QuickAction icon="📊" label="Compare"        sub="vs up to 3 competitors"        href="/compare"       />
            <QuickAction icon="🎯" label="Track rankings" sub="Daily Google & Bing checks"    href="/rank-tracking" />
          </div>
        </div>

        {/* ── Recent activity two-column ───────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Audits */}
          <div>
            <SectionHeader label="Recent audits" href="/audits" />
            <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
              {audits.length === 0 ? (
                <EmptyCard icon="⚡" label="No audits yet" href="/audit" cta="Run your first audit" />
              ) : (
                audits.map((a: any) => (
                  <RecentRow
                    key={a.job_id}
                    icon="⚡"
                    label={a.url.replace(/^https?:\/\//, '').split('/')[0]}
                    sub={a.url}
                    score={a.overall_score}
                    status={a.status}
                    href={`/audit/${a.job_id}`}
                    time={timeAgo(a.created_at)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Crawls */}
          <div>
            <SectionHeader label="Recent crawls" href="/crawl" />
            <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
              {crawls.length === 0 ? (
                <EmptyCard icon="🗺️" label="No crawls yet" href="/crawl" cta="Run your first crawl" />
              ) : (
                crawls.map((c: any) => (
                  <RecentRow
                    key={c.job_id}
                    icon="🗺️"
                    label={c.url.replace(/^https?:\/\//, '').split('/')[0]}
                    sub={c.pages_crawled != null ? `${c.pages_crawled} pages crawled` : c.url}
                    status={c.status}
                    href={`/crawl/${c.job_id}`}
                    time={timeAgo(c.created_at)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Comparisons ──────────────────────────────────────────── */}
        <div>
          <SectionHeader label="Recent comparisons" href="/compare" />
          {comps.length === 0 ? (
            <EmptyCard icon="📊" label="No comparisons yet" href="/compare" cta="Compare a competitor" />
          ) : (
            <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
              {comps.map((c: any) => {
                const gap     = c.score_gap
                const winning = gap != null && gap > 0
                return (
                  <RecentRow
                    key={c.job_id}
                    icon="📊"
                    label={c.name ?? c.target_url?.replace(/^https?:\/\//, '')}
                    sub={
                      gap != null
                        ? `Score gap: ${winning ? '+' : ''}${gap} (${winning ? 'you\'re ahead' : 'behind'})`
                        : undefined
                    }
                    score={c.target_score}
                    status={c.status}
                    href={`/compare/${c.job_id}`}
                    time={timeAgo(c.created_at)}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* ── Onboarding nudge banner (visible until all done) ─────── */}
        {checklist && !checklist.all_done && !checklist.dismissed && (
          <div className="bg-gray-900 rounded border border-gray-800 px-6 py-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold">
                {[
                  checklist.audit_done,
                  checklist.crawl_done,
                  checklist.compare_done,
                  checklist.tracking_done,
                ].filter(Boolean).length} of 4 steps complete
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                Complete the checklist in the bottom-right corner to unlock the full potential of AuditFlow.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {!checklist.audit_done && (
                <a href="/audit"
                  className="px-4 py-2 rounded text-xs font-bold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors whitespace-nowrap">
                  Run audit →
                </a>
              )}
              {checklist.audit_done && !checklist.crawl_done && (
                <a href="/crawl"
                  className="px-4 py-2 rounded text-xs font-bold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors whitespace-nowrap">
                  Run crawl →
                </a>
              )}
              {checklist.audit_done && checklist.crawl_done && !checklist.compare_done && (
                <a href="/compare"
                  className="px-4 py-2 rounded text-xs font-bold text-gray-900 bg-[#0DD3B6] hover:bg-[#0BC4A8] transition-colors whitespace-nowrap">
                  Compare a competitor →
                </a>
              )}
              {checklist.audit_done && checklist.crawl_done && checklist.compare_done && !checklist.tracking_done && (
                <a href="/rank-tracking"
                  className="px-4 py-2 rounded text-xs font-bold text-gray-900 bg-[#0DD3B6] hover:bg-[#0BC4A8] transition-colors whitespace-nowrap">
                  Set up rank tracking →
                </a>
              )}
            </div>
          </div>
        )}

        {/* ── All done celebration ──────────────────────────────────── */}
        {checklist?.all_done && (
          <div className="bg-white rounded border border-[#0DD3B6] px-6 py-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#0DD3B6]/10 flex items-center justify-center text-xl shrink-0">
              🎉
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">You're all set!</p>
              <p className="text-xs text-gray-500 mt-0.5">
                You've completed all onboarding steps. AuditFlow is fully configured for your workflow.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboardLayout'

const API     = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const PRIMARY = '#00A4C6'
const ACCENT  = '#0DD3B6'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
  }
}
async function apiFetch(path: string, opts?: RequestInit) {
  const r = await fetch(`${API}${path}`, { ...opts, headers: authHeaders() })
  if (!r.ok) throw new Error(await r.text())
  return r.json()
}
function cls(...a: (string | false | null | undefined)[]) { return a.filter(Boolean).join(' ') }

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-[#0DD3B6]/10 text-[#0DD3B6] border border-[#0DD3B6]/30',
    running:   'bg-[#00A4C6]/10 text-[#00A4C6] border border-[#00A4C6]/30',
    pending:   'bg-amber-50 text-amber-600 border border-amber-200',
    failed:    'bg-red-50 text-red-500 border border-red-200',
  }
  return (
    <span className={cls('inline-block px-2 py-0.5 rounded text-xs font-medium capitalize', map[status] ?? map.pending)}>
      {status === 'running' ? (
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A4C6] animate-pulse inline-block" />
          running
        </span>
      ) : status}
    </span>
  )
}

// ── KPI card ───────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent, highlight }: {
  label: string; value: string | number; sub?: string; accent?: boolean; highlight?: boolean
}) {
  return (
    <div className={cls(
      'rounded bg-white border p-5 flex flex-col gap-1 min-w-0',
      highlight ? 'border-[#00A4C6] shadow-[0_0_0_1px_#00A4C6]' : 'border-gray-200'
    )}>
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className={cls('text-3xl font-black tabular-nums leading-none', accent ? 'text-[#00A4C6]' : 'text-gray-900')}>
        {value}
      </span>
      {sub && <span className="text-xs text-gray-400 truncate">{sub}</span>}
    </div>
  )
}

// ── Score pill (target vs competitor) ───────────────────────────────────────────
function ScorePill({ label, score, isWinner }: { label: string; score: number | null; isWinner?: boolean }) {
  const color = score == null ? '#9CA3AF' : score >= 80 ? ACCENT : score >= 50 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cls(
          'w-14 h-14 rounded flex items-center justify-center text-lg font-black tabular-nums border-2',
          isWinner ? 'border-[#0DD3B6]' : 'border-gray-100'
        )}
        style={{ color }}
      >
        {score ?? '—'}
      </div>
      <span className="text-xs text-gray-400 truncate max-w-[80px] text-center">{label}</span>
    </div>
  )
}

// ── New Comparison modal ────────────────────────────────────────────────────────
function NewComparisonModal({ onClose, onCreated }: { onClose(): void; onCreated(jobId: string): void }) {
  const [name, setName]           = useState('')
  const [target, setTarget]       = useState('')
  const [competitors, setCompetitors] = useState<string[]>([''])
  const [loading, setLoading]     = useState(false)
  const [err, setErr]             = useState('')

  const addCompetitor = () => competitors.length < 3 && setCompetitors([...competitors, ''])
  const removeCompetitor = (i: number) => setCompetitors(competitors.filter((_, idx) => idx !== i))
  const updateCompetitor = (i: number, val: string) => {
    const next = [...competitors]; next[i] = val; setCompetitors(next)
  }

  const submit = async () => {
    const validCompetitors = competitors.map(c => c.trim()).filter(Boolean)

    if (!target.trim()) return setErr('Target URL is required')
    if (!validCompetitors.length) return setErr('Add at least one competitor URL')
    if (validCompetitors.length > 3) return setErr('Maximum 3 competitors allowed')

    setLoading(true); setErr('')
    try {
      const data = await apiFetch('/comparisons', {
        method: 'POST',
        body: JSON.stringify({
          target_url: target.trim(),
          competitor_urls: validCompetitors,
          name: name.trim() || undefined,
        }),
      })
      onCreated(data.job_id)
    } catch (e: any) {
      setErr(e.message ?? 'Failed to start comparison')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded border border-gray-200 shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">New competitor comparison</h2>
            <p className="text-xs text-gray-400 mt-0.5">2 credits · up to 3 competitors</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comparison name</label>
            <input
              className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6] transition-colors"
              placeholder="e.g. Q3 competitor check"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your website (target) *</label>
            <input
              className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6] transition-colors"
              placeholder="https://yoursite.com"
              value={target}
              onChange={e => setTarget(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Competitor websites * <span className="normal-case font-normal text-gray-400">— up to 3</span>
            </label>
            {competitors.map((c, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6] transition-colors"
                  placeholder={`https://competitor${i + 1}.com`}
                  value={c}
                  onChange={e => updateCompetitor(i, e.target.value)}
                />
                {competitors.length > 1 && (
                  <button
                    onClick={() => removeCompetitor(i)}
                    className="px-3 rounded border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  >✕</button>
                )}
              </div>
            ))}
            {competitors.length < 3 && (
              <button
                onClick={addCompetitor}
                className="text-xs font-semibold text-[#00A4C6] hover:underline text-left"
              >
                + Add another competitor
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Starting…' : 'Run comparison'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew(): void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded border-2 border-dashed border-gray-200 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="3" y="14" width="6" height="11" rx="1" fill={PRIMARY} opacity=".3"/>
          <rect x="11" y="6" width="6" height="19" rx="1" fill={ACCENT} opacity=".5"/>
          <rect x="19" y="10" width="6" height="15" rx="1" fill={PRIMARY} opacity=".3"/>
        </svg>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">No comparisons yet</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Compare your site against up to 3 competitors to see where you win and where you need to catch up.
      </p>
      <button
        onClick={onNew}
        className="px-5 py-2 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors"
      >
        + New comparison
      </button>
    </div>
  )
}

// ── Comparison card ──────────────────────────────────────────────────────────────
function ComparisonCard({ c, onClick }: { c: any; onClick(): void }) {
  const gap = c.score_gap
  const isWinning = gap != null && gap > 0
  const timeAgo = (iso: string | null) => {
    if (!iso) return '—'
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded border border-gray-200 hover:border-[#00A4C6]/40 hover:shadow-sm transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#00A4C6] transition-colors">
              {c.name || c.target_domain}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{c.target_domain}</p>
          </div>
          <StatusBadge status={c.status} />
        </div>

        {c.status === 'running' && (
          <div className="w-full h-1 bg-gray-100 rounded overflow-hidden mb-3">
            <div className="h-full bg-[#00A4C6] transition-all rounded" style={{ width: `${c.progress ?? 0}%` }} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-[#00A4C6]/10 text-[#00A4C6] text-xs font-semibold">
            vs {c.competitor_domains?.length ?? 0} competitor{c.competitor_domains?.length !== 1 ? 's' : ''}
          </span>
          {c.competitor_domains?.slice(0, 2).map((d: string) => (
            <span key={d} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-500 truncate max-w-[110px]">
              {d}
            </span>
          ))}
          {c.competitor_domains?.length > 2 && (
            <span className="text-xs text-gray-400">+{c.competitor_domains.length - 2} more</span>
          )}
        </div>
      </div>

      {/* Score comparison */}
      {c.status === 'completed' ? (
        <div className="px-5 py-4 flex items-center justify-center gap-6">
          <ScorePill label="You" score={c.target_score} isWinner={isWinning} />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-gray-300 text-xl">vs</span>
            {gap != null && (
              <span className={cls(
                'text-xs font-bold tabular-nums px-2 py-0.5 rounded',
                isWinning ? 'bg-[#0DD3B6]/10 text-[#0DD3B6]' : 'bg-red-50 text-red-500'
              )}>
                {isWinning ? '+' : ''}{gap}
              </span>
            )}
          </div>
          <ScorePill label={c.best_competitor_domain ?? 'Best rival'} score={c.best_competitor_score} isWinner={!isWinning} />
        </div>
      ) : (
        <div className="px-5 py-8 flex items-center justify-center text-sm text-gray-400">
          {c.status === 'failed' ? 'Comparison failed' : 'Analysis in progress…'}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">{timeAgo(c.completed_at || c.created_at)}</span>
        <span className="text-xs text-[#00A4C6] font-semibold group-hover:underline">
          View full report →
        </span>
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function ComparisonsIndexPage() {
  const router = useRouter()
  const [kpis, setKpis]           = useState<any>(null)
  const [comparisons, setComparisons] = useState<any[]>([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [kpiData, listData] = await Promise.all([
        apiFetch('/comparisons/kpis'),
        apiFetch('/comparisons?page=1&page_size=50'),
      ])
      setKpis(kpiData)
      setComparisons(listData.comparisons)
      setTotal(listData.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // Poll while anything is running/pending
  useEffect(() => {
    const hasActive = comparisons.some(c => c.status === 'running' || c.status === 'pending')
    if (!hasActive) return
    const t = setTimeout(load, 3000)
    return () => clearTimeout(t)
  }, [comparisons])

  const visible = filterStatus ? comparisons.filter(c => c.status === filterStatus) : comparisons
  const statusCounts = comparisons.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const strongest = kpis?.strongest_win
  const weakest   = kpis?.biggest_gap

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-[#F4F6FA] font-sans">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-gray-900">Competitor Comparison</span>
            {total > 0 && (
              <span className="text-xs bg-[#00A4C6]/10 text-[#00A4C6] px-2 py-0.5 rounded font-semibold">
                {total} comparison{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-1.5 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors"
          >
            + New comparison
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

        {/* ── Stat cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KpiCard label="Total comparisons" value={kpis?.total_comparisons ?? '—'} accent />
          <KpiCard label="Domains analyzed"  value={kpis?.domains_analyzed ?? '—'} />
          <KpiCard
            label="Avg score gap"
            value={kpis?.avg_score_gap != null ? `${kpis.avg_score_gap > 0 ? '+' : ''}${kpis.avg_score_gap}` : '—'}
            sub={kpis?.avg_score_gap != null ? (kpis.avg_score_gap >= 0 ? 'Ahead on average' : 'Behind on average') : undefined}
            accent={kpis?.avg_score_gap >= 0}
            highlight
          />
          <KpiCard
            label="Strongest win"
            value={strongest ? `+${strongest.gap}` : '—'}
            sub={strongest ? `${strongest.target_domain} vs ${strongest.competitor_domain}` : 'No wins yet'}
            accent
          />
          <KpiCard
            label="Biggest gap to close"
            value={weakest ? `${weakest.gap}` : '—'}
            sub={weakest ? `${weakest.target_domain} vs ${weakest.competitor_domain}` : 'No gaps yet'}
          />
        </div>

        {/* ── Filter strip ─────────────────────────────────────────── */}
        {comparisons.length > 0 && (
          <div className="flex items-center gap-2">
            {['', 'completed', 'running', 'pending', 'failed'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cls(
                  'px-3 py-1.5 rounded text-xs font-semibold border transition-colors capitalize',
                  filterStatus === s
                    ? 'bg-[#00A4C6] border-[#00A4C6] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#00A4C6]/50'
                )}
              >
                {s === '' ? 'All' : s}
                {s && statusCounts[s] ? ` (${statusCounts[s]})` : ''}
              </button>
            ))}
          </div>
        )}

        {/* ── Grid or empty ────────────────────────────────────────── */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded border border-gray-200 h-56 animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState onNew={() => setShowModal(true)} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map(c => (
              <ComparisonCard
                key={c.job_id}
                c={c}
                onClick={() => router.push(`/compare/${c.job_id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NewComparisonModal
          onClose={() => setShowModal(false)}
          onCreated={(jobId) => {
            setShowModal(false)
            router.push(`/compare/${jobId}`)
          }}
        />
      )}
    </div>
    </DashboardLayout>
  )
}
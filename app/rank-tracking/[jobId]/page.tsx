'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import DashboardLayout from '@/components/dashboardLayout'
import { formatTime } from '@/lib/utils'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const PRIMARY = '#00A4C6'
const ACCENT = '#0DD3B6'
const PALETTE = [PRIMARY, ACCENT, '#7C3AED', '#F59E0B', '#EF4444', '#10B981']

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

// ── Sparkline SVG ──────────────────────────────────────────────────────────────
function Sparkline({ data, trend }: { data: { position: number | null }[]; trend: string }) {
  const pts = data.map(d => d.position).filter((p): p is number => p != null)
  if (pts.length < 2) return <span className="text-xs text-gray-300">No data</span>
  const min = Math.min(...pts), max = Math.max(...pts)
  const range = max - min || 1
  const W = 80, H = 28
  const coords = pts.map((p, i) => `${(i / (pts.length - 1)) * W},${H - ((p - min) / range) * H}`)
  const stroke = trend === 'up' ? ACCENT : trend === 'down' ? '#EF4444' : '#94A3B8'
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={coords.join(' ')} fill="none" stroke={stroke}
        strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── Change badge ───────────────────────────────────────────────────────────────
function ChangeBadge({ v }: { v: number | null }) {
  if (v == null) return <span className="text-gray-300 text-sm">—</span>
  const up = v > 0, zero = v === 0
  return (
    <span className={cls(
      'inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums',
      zero ? 'text-gray-400' : up ? 'text-[#0DD3B6]' : 'text-red-500'
    )}>
      {zero ? '—' : up ? '▲' : '▼'}{zero ? '' : Math.abs(v)}
    </span>
  )
}

// ── Trend pill ─────────────────────────────────────────────────────────────────
function TrendPill({ trend }: { trend: string }) {
  const map: Record<string, string> = {
    up: 'bg-[#0DD3B6]/10 text-[#0DD3B6] border border-[#0DD3B6]/30',
    down: 'bg-red-50 text-red-500 border border-red-200',
    stable: 'bg-gray-100 text-gray-500 border border-gray-200',
    new: 'bg-[#00A4C6]/10 text-[#00A4C6] border border-[#00A4C6]/30',
  }
  const label: Record<string, string> = { up: '↑ Rising', down: '↓ Falling', stable: '→ Stable', new: '✦ New' }
  return (
    <span className={cls('inline-block px-2 py-0.5 rounded text-xs font-medium', map[trend] ?? map.stable)}>
      {label[trend] ?? trend}
    </span>
  )
}

// ── KPI card ───────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent = false, highlight = false }: {
  label: string; value: string | number; sub?: string; accent?: boolean; highlight?: boolean
}) {
  return (
    <div className={cls(
      'rounded bg-white border p-5 flex flex-col gap-1 min-w-0',
      highlight ? 'border-[#00A4C6] shadow-[0_0_0_1px_#00A4C6]' : 'border-gray-200'
    )}>
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className={cls(
        'text-3xl font-black tabular-nums leading-none',
        accent ? 'text-[#00A4C6]' : 'text-gray-900'
      )}>{value}</span>
      {sub && <span className="text-xs text-gray-400 truncate">{sub}</span>}
    </div>
  )
}

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-[#0DD3B6]/10 text-[#0DD3B6] border border-[#0DD3B6]/30',
    running: 'bg-[#00A4C6]/10 text-[#00A4C6] border border-[#00A4C6]/30',
    pending: 'bg-amber-50 text-amber-600 border border-amber-200',
    failed: 'bg-red-50 text-red-500 border border-red-200',
  }
  return (
    <span className={cls('inline-block px-2 py-0.5 rounded text-xs font-medium capitalize',
      map[status] ?? map.pending)}>
      {status === 'running'
        ? <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A4C6] animate-pulse inline-block" />
          running
        </span>
        : status}
    </span>
  )
}

// ── Custom chart tooltip ───────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white rounded px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold mb-1 text-gray-400">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>#{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function CampaignDetailPage() {
  const { jobId } = useParams() as { jobId: string }
  const router = useRouter()

  const [campaign, setCampaign] = useState<any>(null)
  const [kpis, setKpis] = useState<any>(null)
  const [keywords, setKeywords] = useState<any[]>([])
  const [kwMeta, setKwMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [sparklines, setSparklines] = useState<any[]>([])
  const [chartSeries, setChartSeries] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [chartDays, setChartDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Filters
  const [engine, setEngine] = useState('')
  const [group, setGroup] = useState('')
  const [sortBy, setSortBy] = useState('position_change')
  const [sortOrd, setSortOrd] = useState('desc')
  const [page, setPage] = useState(1)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadAll = async () => {
    try {
      const params = new URLSearchParams({
        job_id: jobId, sort_by: sortBy, order: sortOrd,
        page: String(page), page_size: '50',
      })
      if (engine) params.set('engine', engine)
      if (group) params.set('group_name', group)

      const [camp, kpiData, kwData, spData] = await Promise.all([
        apiFetch(`/rank-tracking/${jobId}`),
        apiFetch(`/rank-tracking/kpis?job_id=${jobId}`),
        apiFetch(`/rank-tracking/keywords?${params}`),
        apiFetch(`/rank-tracking/sparklines?job_id=${jobId}&points=10&limit=12`),
      ])


      setCampaign(camp)
      setKpis(kpiData)
      setKeywords(kwData.keywords)
      setKwMeta({ total: kwData.total, page: kwData.page, totalPages: kwData.total_pages })
      setSparklines(spData.sparklines)

      // Auto-poll while running
      if (camp.status === 'running') {
        pollRef.current = setTimeout(loadAll, 3000)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const loadChart = async () => {
    if (!selectedIds.length) { setChartSeries([]); return }
    try {
      const data = await apiFetch(
        `/rank-tracking/chart?keyword_ids=${selectedIds.join(',')}&days=${chartDays}`
      )
      setChartSeries(data.series)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    loadAll()
    return () => { if (pollRef.current) clearTimeout(pollRef.current) }
  }, [jobId, engine, group, sortBy, sortOrd, page])

  useEffect(() => { loadChart() }, [selectedIds, chartDays])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await apiFetch(`/rank-tracking/${jobId}/refresh`, { method: 'POST' })
      await loadAll()
    } finally {
      setRefreshing(false)
    }
  }

  const toggleKeyword = (id: number) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 6 ? [...prev, id] : prev)

  const exportCsv = () => {
    const header = 'keyword,domain,engine,current_position,previous_position,change,search_volume,difficulty,trend'
    const rows = keywords.map(k =>
      [k.keyword, k.domain, k.engine, k.current_position ?? '', k.previous_position ?? '',
      k.position_change ?? '', k.search_volume ?? '', k.difficulty ?? '', k.trend].join(',')
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${campaign?.domain ?? 'rankings'}.csv`
    a.click()
  }

  const gainer = kpis?.biggest_gainer
  const loser = kpis?.biggest_loser

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans">
      <div className="bg-white border-b border-gray-200 h-14 flex items-center px-6">
        <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded border border-gray-200 animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-white rounded border border-gray-200 animate-pulse" />
      </div>
    </div>
  )

  // ── Running / pending state (show progress) ───────────────────────────────────
  const isRunning = campaign?.status === 'running' || campaign?.status === 'pending'

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F4F6FA] font-sans">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center gap-3">

            {/* Breadcrumb */}
            <button
              onClick={() => router.push('/rank-tracking')}
              className="text-gray-400 hover:text-gray-700 text-sm transition-colors"
            >
              ← Campaigns
            </button>
            <span className="text-gray-200">/</span>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">
                {campaign?.name || campaign?.domain}
              </span>
              <StatusBadge status={campaign?.status ?? 'pending'} />
              {campaign?.engines?.map((eng: string) => (
                <span key={eng} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded capitalize font-medium hidden sm:inline">
                  {eng}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={exportCsv}
                className="px-3 py-1.5 rounded text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing || isRunning}
                className="px-4 py-1.5 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] disabled:opacity-50 transition-colors"
              >
                {refreshing ? 'Refreshing…' : '↻ Refresh'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

          {/* ── Progress bar if running ─────────────────────────────── */}
          {isRunning && (
            <div className="bg-white rounded border border-[#00A4C6]/30 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Checking rankings… {campaign?.progress ?? 0}%
                </span>
                <span className="text-xs text-gray-400">Updates automatically</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{
                    width: `${campaign?.progress ?? 0}%`,
                    background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`,
                  }}
                />
              </div>
            </div>
          )}

          {/* ── KPI row ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <KpiCard label="Keywords" value={kpis?.total_keywords ?? '—'} accent />
            <KpiCard label="Top 3" value={kpis?.top3 ?? '—'} highlight
              sub={kpis ? `${Math.round((kpis.top3 / Math.max(kpis.total_keywords, 1)) * 100)}% of total` : undefined} />
            <KpiCard label="Top 10" value={kpis?.top10 ?? '—'}
              sub={kpis ? `${Math.round((kpis.top10 / Math.max(kpis.total_keywords, 1)) * 100)}% of total` : undefined} />
            <KpiCard label="Top 100" value={kpis?.top100 ?? '—'} />
            <KpiCard label="Not ranking" value={kpis?.not_ranking ?? '—'} />
            <KpiCard label="Biggest gainer"
              value={gainer ? `▲${gainer.change}` : '—'}
              sub={gainer?.keyword}
              accent />
            <KpiCard label="Biggest loser"
              value={loser ? `▼${Math.abs(loser.change)}` : '—'}
              sub={loser?.keyword} />
          </div>

          {/* ── Filters bar ─────────────────────────────────────────── */}
          <div className="bg-white rounded border border-gray-200 px-4 py-3 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Filters</span>

            <select
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#00A4C6]"
              value={engine}
              onChange={e => { setEngine(e.target.value); setPage(1) }}
            >
              <option value="">All engines</option>
              <option value="brave">Brave</option>
              <option disabled value="google">Google</option>
              <option disabled value="bing">Bing</option>
            </select>

            <input
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#00A4C6] w-36"
              placeholder="Group"
              value={group}
              onChange={e => { setGroup(e.target.value); setPage(1) }}
            />

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">Sort</span>
              <select
                className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#00A4C6]"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="position_change">Change</option>
                <option value="current_position">Rank</option>
                <option value="search_volume">Volume</option>
                <option value="keyword">A–Z</option>
              </select>
              <button
                onClick={() => setSortOrd(o => o === 'desc' ? 'asc' : 'desc')}
                className="border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
              >
                {sortOrd === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

          {/* ── Main two-column layout ───────────────────────────────── */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-5 items-start">

            {/* Keyword table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="w-6 px-4 py-3" />
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Keyword</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Rank</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Prev</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Δ</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Volume</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">KD</th>
                      <th className="text-center px-3 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.length === 0
                      ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-16 text-center text-sm text-gray-400">
                            {isRunning ? 'Checking rankings, results will appear here…' : 'No keywords yet'}
                          </td>
                        </tr>
                      )
                      : keywords.map(kw => {
                        const sel = selectedIds.includes(kw.id)
                        return (
                          <tr
                            key={kw.id}
                            onClick={() => toggleKeyword(kw.id)}
                            className={cls(
                              'border-b border-gray-50 hover:bg-gray-50/60 cursor-pointer transition-colors',
                              sel && 'bg-[#00A4C6]/5'
                            )}
                          >
                            <td className="px-4 py-3">
                              <div className={cls(
                                'w-3.5 h-3.5 rounded border-2 transition-colors',
                                sel ? 'bg-[#00A4C6] border-[#00A4C6]' : 'border-gray-300'
                              )} />
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900 truncate max-w-[180px]">{kw.keyword}</div>
                              <div className="text-xs text-gray-400 truncate">{kw.engine} · {kw.country}</div>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className={cls(
                                'font-bold tabular-nums',
                                kw.current_position <= 3 ? 'text-[#0DD3B6]'
                                  : kw.current_position <= 10 ? 'text-[#00A4C6]'
                                    : 'text-gray-700'
                              )}>
                                {kw.current_position ? `#${kw.current_position}` : <span className="text-gray-300">—</span>}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center text-gray-400 tabular-nums text-sm">
                              {kw.previous_position ? `#${kw.previous_position}` : '—'}
                            </td>
                            <td className="px-3 py-3 text-center"><ChangeBadge v={kw.position_change} /></td>
                            <td className="px-3 py-3 text-center text-gray-600 tabular-nums text-xs">
                              {kw.search_volume != null ? kw.search_volume.toLocaleString() : '—'}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {kw.difficulty != null
                                ? <span className={cls(
                                  'text-xs font-semibold',
                                  kw.difficulty >= 70 ? 'text-red-500'
                                    : kw.difficulty >= 40 ? 'text-amber-500'
                                      : 'text-[#0DD3B6]'
                                )}>{Math.round(kw.difficulty)}</span>
                                : <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-3 py-3 text-center"><TrendPill trend={kw.trend} /></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {kwMeta.totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>{kwMeta.total} keywords</span>
                  <div className="flex items-center gap-1">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                      className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30">←</button>
                    <span className="px-3">{page} / {kwMeta.totalPages}</span>
                    <button disabled={page >= kwMeta.totalPages} onClick={() => setPage(p => p + 1)}
                      className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30">→</button>
                  </div>
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="bg-white rounded border border-gray-200 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Position over time</h3>
                  {!selectedIds.length && (
                    <p className="text-xs text-gray-400 mt-0.5">Click rows to overlay keywords</p>
                  )}
                </div>
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#00A4C6]"
                  value={chartDays}
                  onChange={e => setChartDays(Number(e.target.value))}
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                </select>
              </div>

              {/* Selected chips */}
              {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {chartSeries.map((s, i) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border"
                      style={{
                        borderColor: PALETTE[i % PALETTE.length] + '60',
                        background: PALETTE[i % PALETTE.length] + '15',
                        color: PALETTE[i % PALETTE.length],
                      }}
                    >
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: PALETTE[i % PALETTE.length] }} />
                      {s.keyword}
                      <button onClick={e => { e.stopPropagation(); toggleKeyword(s.id) }} className="ml-1 opacity-50 hover:opacity-100">✕</button>
                    </span>
                  ))}
                </div>
              )}

              {chartSeries.length > 0 ? (
                <ResponsiveContainer width="100%" height={270}>
                  <LineChart margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} allowDuplicatedCategory={false} />
                    <YAxis reversed tick={{ fontSize: 10, fill: '#94A3B8' }} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip content={<ChartTooltip />} />
                    {chartSeries.map((s, i) => (
                      <Line key={s.id} data={s.data} dataKey="position" name={s.keyword}
                        stroke={PALETTE[i % PALETTE.length]} strokeWidth={2}
                        dot={false} activeDot={{ r: 4 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[270px] flex flex-col items-center justify-center text-gray-300">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M6 38 L18 22 L28 30 L40 10" stroke={PRIMARY} strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" opacity=".3" />
                  </svg>
                  <span className="text-sm mt-3">Select keywords from the table</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Sparkline cards ──────────────────────────────────────── */}
          {sparklines.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent activity</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {sparklines.map(s => (
                  <div
                    key={s.id}
                    onClick={() => toggleKeyword(s.id)}
                    className={cls(
                      'bg-white rounded border cursor-pointer transition-all hover:border-[#00A4C6]/40 hover:shadow-sm p-3',
                      selectedIds.includes(s.id)
                        ? 'border-[#00A4C6] shadow-[0_0_0_1px_#00A4C6]'
                        : 'border-gray-200'
                    )}
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <p className="text-xs font-semibold text-gray-900 truncate">{s.keyword}</p>
                      <ChangeBadge v={s.position_change} />
                    </div>
                    <div className="flex items-end justify-between">
                      <Sparkline data={s.sparkline} trend={s.trend} />
                      <span className={cls(
                        'text-lg font-black tabular-nums leading-none',
                        (s.current_position ?? 999) <= 3 ? 'text-[#0DD3B6]'
                          : (s.current_position ?? 999) <= 10 ? 'text-[#00A4C6]'
                            : 'text-gray-700'
                      )}>
                        {s.current_position ? `#${s.current_position}` : '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Campaign info footer ─────────────────────────────────── */}
          <div className="bg-white rounded border border-gray-200 px-5 py-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-gray-500">
            <span><strong className="text-gray-700">Domain</strong> {campaign?.domain}</span>
            <span><strong className="text-gray-700">Schedule</strong> {campaign?.is_scheduled ? campaign?.frequency : 'Manual'}</span>
            <span><strong className="text-gray-700">Engines</strong> {campaign?.engines?.join(', ')}</span>
            {campaign?.last_checked && (
              <span><strong className="text-gray-700">Last checked</strong> {formatTime(campaign.last_checked)}</span>
            )}
            {campaign?.next_check && (
              <span><strong className="text-gray-700">Next check</strong> {formatTime(campaign.next_check)}</span>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
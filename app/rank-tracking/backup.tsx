'use client'

import DashboardLayout from '@/components/dashboardLayout'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Eye, RefreshCw, Loader2, Download } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { fetchWithAuth } from '@/lib/auth-context'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const PRIMARY = '#00A4C6'
const ACCENT = '#0DD3B6'
const PALETTE = [PRIMARY, ACCENT, '#7C3AED', '#F59E0B', '#EF4444', '#10B981']

// ─── tiny helpers ─────────────────────────────────────────────────────────────

function authHeaders() {
  console.log(`Bearer ${localStorage.getItem('access_token') ?? ''}`)
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
  }
}

async function apiFetch(path: string, opts?: RequestInit) {
  const r = await fetch(`${API}${path}`, { ...opts, headers: authHeaders() })
  console.log(r)
  if (!r.ok) throw new Error(await r.text())

  return r.json()
}

function cls(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(' ')
}

// ─── Sparkline (inline SVG, no recharts overhead) ─────────────────────────────

function Sparkline({ data, trend }: { data: { position: number | null }[]; trend: string }) {
  const pts = data.map(d => d.position).filter((p): p is number => p != null)
  if (pts.length < 2) return <span className="text-xs text-gray-400">No data</span>

  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const range = max - min || 1
  const W = 80, H = 28

  const coords = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * W
    const y = H - ((p - min) / range) * H   // invert: lower rank = higher on chart
    return `${x},${y}`
  })

  const stroke = trend === 'up' ? ACCENT : trend === 'down' ? '#EF4444' : '#94A3B8'

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Change badge ──────────────────────────────────────────────────────────────

function ChangeBadge({ v }: { v: number | null }) {
  if (v == null) return <span className="text-gray-400 text-sm">—</span>
  const up = v > 0
  const zero = v === 0
  return (
    <span className={cls(
      'inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums',
      zero ? 'text-gray-500' : up ? 'text-[#0DD3B6]' : 'text-red-500'
    )}>
      {zero ? '—' : up ? '▲' : '▼'}{zero ? '' : Math.abs(v)}
    </span>
  )
}

// ─── Trend pill ────────────────────────────────────────────────────────────────

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

// ─── KPI Card ──────────────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, accent = false, highlight = false
}: {
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
      )}>
        {value}
      </span>
      {sub && <span className="text-xs text-gray-500 truncate">{sub}</span>}
    </div>
  )
}

// ─── New Tracking Modal ────────────────────────────────────────────────────────

function NewTrackingModal({ onClose, onCreated }: { onClose(): void; onCreated(): void }) {
  const [domain, setDomain] = useState('')
  const [name, setName] = useState('')
  const [rawKws, setRawKws] = useState('')
  const [engines, setEngines] = useState<string[]>(['brave'])
  const [country, setCountry] = useState('us')
  const [freq, setFreq] = useState('daily')
  const [scheduled, setScheduled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const toggleEngine = (e: string) =>
    setEngines(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])

  const submit = async () => {
    const keywords = rawKws
      .split(/[\n,]+/)
      .map(k => k.trim().toLowerCase())
      .filter(Boolean)
      .map(k => ({ keyword: k }))

    if (!domain) return setErr('Domain is required')
    if (!keywords.length) return setErr('Add at least one keyword')
    if (!engines.length) return setErr('Select at least one search engine')

    setLoading(true); setErr('')
    try {
      await apiFetch('/rank-tracking', {
        method: 'POST',
        body: JSON.stringify({ domain, name, keywords, engines, country, frequency: freq, is_scheduled: scheduled }),
      })
      onCreated()
      onClose()
    } catch (e: any) {
      setErr(e.message ?? 'Failed to create tracking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded border border-gray-200 shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">New rank tracking campaign</h2>
            <p className="text-xs text-gray-500 mt-0.5">1 credit per campaign run</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Domain *</label>
              <input
                className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6]"
                placeholder="example.com"
                value={domain}
                onChange={e => setDomain(e.target.value)}
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Campaign name</label>
              <input
                className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6]"
                placeholder="e.g. Q3 SEO push"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Keywords * <span className="text-gray-400 font-normal normal-case">(one per line or comma-separated)</span>
            </label>
            <textarea
              className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6] resize-none"
              rows={5}
              placeholder={"seo tools\nwebsite audit\nrank tracker\nfree seo checker"}
              value={rawKws}
              onChange={e => setRawKws(e.target.value)}
            />
            <span className="text-xs text-gray-400">
              {rawKws.split(/[\n,]+/).filter(k => k.trim()).length} keywords
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Engines */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Search engines</label>
              <div className="flex gap-2">
                {['brave', 'google', 'bing'].map(eng => (
                  <button
                    key={eng}
                    type="button"
                    onClick={() => toggleEngine(eng)}
                    disabled={eng == 'google' || eng == 'bing'}
                    className={cls(
                      'flex-1 py-1.5 rounded text-xs font-semibold border transition-colors capitalize',
                      engines.includes(eng)
                        ? 'bg-[#00A4C6] border-[#00A4C6] text-white'
                        : 'border-gray-200 text-gray-600 hover:border-[#00A4C6]',
                      eng == 'google' ? 'opacity-50' : eng == 'bing' ? 'opacity-50' : ""
                    )}
                  >
                    {eng}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Check frequency</label>
              <select
                className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6]"
                value={freq}
                onChange={e => setFreq(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Schedule toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setScheduled(s => !s)}
              className={cls(
                'relative w-10 h-5 rounded-full transition-colors',
                scheduled ? 'bg-[#00A4C6]' : 'bg-gray-200'
              )}
            >
              <div className={cls(
                'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                scheduled ? 'translate-x-5' : 'translate-x-0.5'
              )} />
            </div>
            <span className="text-sm text-gray-700">Enable automatic scheduled checks</span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded text-sm text-gray-600 border border-gray-200 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Starting…' : 'Start tracking'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Custom chart tooltip ──────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 text-white rounded px-3 py-2 text-xs shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>#{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function RankTrackingPage() {
  const [kpis, setKpis] = useState<any>(null)
  const [keywords, setKeywords] = useState<any[]>([])
  const [kwMeta, setKwMeta] = useState({ total: 0, page: 1, totalPages: 1 })
  const [sparklines, setSparklines] = useState<any[]>([])
  const [chartSeries, setChartSeries] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [chartDays, setChartDays] = useState(30)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)


  // Filters
  const [domain, setDomain] = useState('')
  const [engine, setEngine] = useState('')
  const [group, setGroup] = useState('')
  const [sortBy, setSortBy] = useState('position_change')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)

  const load = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ sort_by: sortBy, order: sortOrder, page: String(page), page_size: '50' })
      if (domain) params.set('domain', domain)
      if (engine) params.set('engine', engine)
      if (group) params.set('group_name', group)

      const [kpiData, kwData, spData] = await Promise.all([
        apiFetch(`/rank-tracking/kpis${domain ? `?domain=${domain}` : ''}`),
        apiFetch(`/rank-tracking/keywords?${params}`),
        apiFetch(`/rank-tracking/sparklines?points=10&limit=12${domain ? `&domain=${domain}` : ''}`),
      ])



      setKpis(kpiData)
      setKeywords(kwData.keywords)
      setKwMeta({ total: kwData.total, page: kwData.page, totalPages: kwData.total_pages })
      setSparklines(spData.sparklines)
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
      const rt = await apiFetch('/rank-tracking')
      console.log(rt)

      setChartSeries(data.series)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { load() }, [domain, engine, group, sortBy, sortOrder, page])
  useEffect(() => { loadChart() }, [selectedIds, chartDays])

  const toggleKeyword = (id: number) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 6 ? [...prev, id] : prev
    )

  const exportCsv = () => {
    const header = 'keyword,domain,engine,current_position,previous_position,change,search_volume,difficulty,trend'
    const rows = keywords.map(k =>
      [k.keyword, k.domain, k.engine, k.current_position ?? '', k.previous_position ?? '',
      k.position_change ?? '', k.search_volume ?? '', k.difficulty ?? '', k.trend].join(',')
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'rank-tracking.csv'; a.click()
  }

  const gainer = kpis?.biggest_gainer
  const loser = kpis?.biggest_loser

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F4F6FA] font-sans">

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div className="bg-white  sticky top-0 z-30">
          <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-gray-900">Rank Tracking</span>
              {kpis && (
                <span className="text-xs bg-[#00A4C6]/10 text-[#00A4C6] px-2 py-0.5 rounded font-semibold">
                  {kpis.total_keywords} keywords
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCsv}
                className="px-3 py-1.5 rounded text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-1.5 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors"
              >
                + New tracking
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] rounded-t-lg border border-gray-200 mx-auto px-6 py-6 space-y-6">

          {/* ── KPI Cards ────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <KpiCard label="Keywords" value={kpis?.total_keywords ?? '—'} accent />
            <KpiCard label="Domains" value={kpis?.total_domains ?? '—'} />
            <KpiCard
              label="Top 3"
              value={kpis?.top3 ?? '—'}
              sub={kpis ? `${Math.round((kpis.top3 / kpis.total_keywords) * 100) || 0}% of total` : undefined}
              highlight
            />
            <KpiCard
              label="Top 10"
              value={kpis?.top10 ?? '—'}
              sub={kpis ? `${Math.round((kpis.top10 / kpis.total_keywords) * 100) || 0}% of total` : undefined}
            />
            <KpiCard label="Top 100" value={kpis?.top100 ?? '—'} />
            <KpiCard
              label="Biggest gainer"
              value={gainer ? `▲ ${gainer.change}` : '—'}
              sub={gainer?.keyword}
              accent
            />
            <KpiCard
              label="Biggest loser"
              value={loser ? `▼ ${Math.abs(loser.change)}` : '—'}
              sub={loser?.keyword}
            />
          </div>

          {/* ── Filters ─────────────────────────────────────────────── */}
          <div className="bg-white rounded border border-gray-200 px-4 py-3 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Filters</span>

            <input
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#00A4C6] w-40"
              placeholder="Domain"
              value={domain}
              onChange={e => { setDomain(e.target.value); setPage(1) }}
            />

            <select
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#00A4C6]"
              value={engine}
              onChange={e => { setEngine(e.target.value); setPage(1) }}
            >
              <option value="">All engines</option>
              <option value="google">Google</option>
              <option value="bing">Bing</option>
            </select>

            <input
              className="border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#00A4C6] w-36"
              placeholder="Group"
              value={group}
              onChange={e => { setGroup(e.target.value); setPage(1) }}
            />

            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-400">Sort by</span>
              <select
                className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#00A4C6]"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="position_change">Change</option>
                <option value="current_position">Rank</option>
                <option value="search_volume">Volume</option>
                <option value="keyword">Keyword A–Z</option>
              </select>
              <button
                onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
                className="border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>

          {/* ── Two-column layout: table + chart ─────────────────────── */}
          <div className="grid lg:grid-cols-[1fr_400px] gap-5 items-start">

            {/* Keyword table */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide w-6"></th>
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
                    {loading
                      ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50 animate-pulse">
                          {Array.from({ length: 8 }).map((_, j) => (
                            <td key={j} className="px-4 py-3">
                              <div className="h-3 bg-gray-100 rounded w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                      : keywords.map(kw => {
                        const sel = selectedIds.includes(kw.id)
                        return (
                          <tr
                            key={kw.id}
                            className={cls(
                              'border-b border-gray-50 hover:bg-gray-50/60 cursor-pointer transition-colors',
                              sel && 'bg-[#00A4C6]/5'
                            )}
                            onClick={() => toggleKeyword(kw.id)}
                          >
                            <td className="px-4 py-3">
                              <div className={cls(
                                'w-3.5 h-3.5 rounded border-2 transition-colors',
                                sel ? 'bg-[#00A4C6] border-[#00A4C6]' : 'border-gray-300'
                              )} />
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900 truncate max-w-[180px]">{kw.keyword}</div>
                              <div className="text-xs text-gray-400 truncate">{kw.domain} · {kw.engine}</div>
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
                            <td className="px-3 py-3 text-center text-gray-400 tabular-nums">
                              {kw.previous_position ? `#${kw.previous_position}` : '—'}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <ChangeBadge v={kw.position_change} />
                            </td>
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
                                : <span className="text-gray-300">—</span>
                              }
                            </td>
                            <td className="px-3 py-3 text-center">
                              <TrendPill trend={kw.trend} />
                            </td>
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
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >←</button>
                    <span className="px-3">{page} / {kwMeta.totalPages}</span>
                    <button
                      disabled={page >= kwMeta.totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                    >→</button>
                  </div>
                </div>
              )}
            </div>

            {/* Chart panel */}
            <div className="bg-white rounded border border-gray-200 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Position over time</h3>
                  {selectedIds.length === 0 && (
                    <p className="text-xs text-gray-400 mt-0.5">Click rows to overlay keywords</p>
                  )}
                </div>
                <select
                  className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#00A4C6]"
                  value={chartDays}
                  onChange={e => setChartDays(Number(e.target.value))}
                >
                  <option value={7}>Last 7d</option>
                  <option value={30}>Last 30d</option>
                  <option value={90}>Last 90d</option>
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
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ background: PALETTE[i % PALETTE.length] }}
                      />
                      {s.keyword}
                      <button onClick={() => toggleKeyword(s.id)} className="ml-1 opacity-60 hover:opacity-100">✕</button>
                    </span>
                  ))}
                </div>
              )}

              {chartSeries.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={[]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis reversed tick={{ fontSize: 10, fill: '#94A3B8' }} domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip content={<ChartTooltip />} />
                      {chartSeries.map((s, i) => {
                        // Merge all series data by date
                        const color = PALETTE[i % PALETTE.length]
                        return (
                          <Line
                            key={s.id}
                            data={s.data}
                            dataKey="position"
                            name={s.keyword}
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, fill: color }}
                          />
                        )
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-end gap-2 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid #e4e9ed' }}>
                    <Link href={`/crawl/`}>
                      <button className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>
                        <Eye className="w-4 h-4" />
                        View Details</button>
                    </Link>

                    {chartSeries[0].status === 'failed' && (
                      <button className="px-4 py-2 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90" style={{ backgroundColor: '#00a4c6' }}>
                        <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                        Refresh
                      </button>
                    )}
                    {chartSeries[0].status != 'failed' && (
                      <button
                        onClick={() => {
                          // handleExport();
                        }}
                        disabled={exporting}
                        className="px-4 py-2 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90   flex items-center gap-2"
                        style={{ backgroundColor: '#00a4c6' }}
                      >
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export Report
                      </button>
                    )}
                  </div>
                </>

              ) : (
                <div className="h-[260px] flex flex-col items-center justify-center text-gray-300">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M6 38 L18 22 L28 30 L40 10" stroke={PRIMARY} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".3" />
                  </svg>
                  <span className="text-sm mt-3">Select keywords from the table</span>
                </div>
              )}
            </div>

          </div>

          {/* ── Mini sparkline cards ──────────────────────────────────── */}
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
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">{s.keyword}</p>
                        <p className="text-xs text-gray-400 truncate">{s.domain}</p>
                      </div>
                      <ChangeBadge v={s.position_change} />
                    </div>
                    <div className="flex items-end justify-between">
                      <Sparkline data={s.sparkline} trend={s.trend} />
                      <span className={cls(
                        'text-lg font-black tabular-nums leading-none',
                        s.current_position <= 3 ? 'text-[#0DD3B6]'
                          : s.current_position <= 10 ? 'text-[#00A4C6]'
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
        </div>

        {/* ── Modal ────────────────────────────────────────────────── */}
        {showModal && (
          <NewTrackingModal
            onClose={() => setShowModal(false)}
            onCreated={() => { load(); setShowModal(false) }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
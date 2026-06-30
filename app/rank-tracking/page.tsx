'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboardLayout'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'
const PRIMARY = '#00A4C6'
const ACCENT = '#0DD3B6'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
  }
}
async function apiFetch(path: string, opts?: RequestInit) {
  const r = await fetch(`${API}${path}`, { ...opts, headers: authHeaders() })
  if (!r.ok) throw new Error(await r.text())
  console.log(r)
  return r.json()
}
function cls(...a: (string | false | null | undefined)[]) { return a.filter(Boolean).join(' ') }

// ── Status badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-[#0DD3B6]/10 text-[#0DD3B6] border border-[#0DD3B6]/30',
    running: 'bg-[#00A4C6]/10 text-[#00A4C6] border border-[#00A4C6]/30',
    pending: 'bg-amber-50 text-amber-600 border border-amber-200',
    failed: 'bg-red-50 text-red-500 border border-red-200',
  }
  return (
    <span className={cls('inline-block px-2 py-0.5 rounded text-xs font-medium capitalize', map[status] ?? map.pending)}>
      {status === 'running' ? (
        <span className="inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A4C6] animate-pulse inline-block" />
          {status}
        </span>
      ) : status}
    </span>
  )
}

// ── Mini stat pill ─────────────────────────────────────────────────────────────
function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={cls('text-sm font-bold tabular-nums', accent ? 'text-[#00A4C6]' : 'text-gray-800')}>
        {value}
      </span>
    </div>
  )
}

// ── New tracking modal (same as before, self-contained) ────────────────────────
function NewTrackingModal({ onClose, onCreated }: { onClose(): void; onCreated(jobId: string): void }) {
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

  const kwCount = rawKws.split(/[\n,]+/).filter(k => k.trim()).length

  const submit = async () => {
    const keywords = rawKws
      .split(/[\n,]+/)
      .map(k => k.trim().toLowerCase())
      .filter(Boolean)
      .map(k => ({ keyword: k }))

    if (!domain.trim()) return setErr('Domain is required')
    if (!keywords.length) return setErr('Add at least one keyword')
    if (!engines.length) return setErr('Select at least one search engine')

    setLoading(true); setErr('')
    try {
      const data = await apiFetch('/rank-tracking', {
        method: 'POST',
        body: JSON.stringify({ domain: domain.trim(), name: name.trim() || domain.trim(), keywords, engines, country, frequency: freq, is_scheduled: scheduled }),
      })
      onCreated(data.job_id)
    } catch (e: any) {
      setErr(e.message ?? 'Failed to create tracking')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded border border-gray-200 shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">New tracking campaign</h2>
            <p className="text-xs text-gray-400 mt-0.5">1 credit · checks rankings on {freq} schedule</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {err && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{err}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Domain *</label>
              <input
                className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6] transition-colors"
                placeholder="example.com"
                value={domain}
                onChange={e => setDomain(e.target.value)}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Campaign name</label>
              <input
                className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6] transition-colors"
                placeholder="e.g. Q3 SEO push"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Keywords * <span className="normal-case font-normal text-gray-400">— one per line or comma-separated</span>
            </label>
            <textarea
              className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00A4C6] resize-none transition-colors"
              rows={5}
              placeholder={"seo tools\nwebsite audit\nrank tracker"}
              value={rawKws}
              onChange={e => setRawKws(e.target.value)}
            />
            <span className="text-xs text-gray-400">{kwCount} keyword{kwCount !== 1 ? 's' : ''}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search engines</label>
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
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Frequency</label>
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

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setScheduled(s => !s)}
              className={cls('relative w-9 h-5 rounded-full transition-colors', scheduled ? 'bg-[#00A4C6]' : 'bg-gray-200')}
            >
              <div className={cls('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', scheduled ? 'translate-x-4' : 'translate-x-0.5')} />
            </div>
            <span className="text-sm text-gray-700">Enable automatic scheduled checks</span>
          </label>
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
            {loading ? 'Starting…' : 'Start tracking'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew(): void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded border-2 border-dashed border-gray-200 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M4 22 L10 14 L16 18 L22 8" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".4" />
          <circle cx="22" cy="8" r="2.5" fill={ACCENT} opacity=".6" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">No campaigns yet</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Create your first tracking campaign to start monitoring keyword rankings across Google and Bing.
      </p>
      <button
        onClick={onNew}
        className="px-5 py-2 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors"
      >
        + New tracking campaign
      </button>
    </div>
  )
}

// ── Campaign card ──────────────────────────────────────────────────────────────
function CampaignCard({ c, onClick }: { c: any; onClick(): void }) {
  const avgPos = c.avg_position ? Math.round(c.avg_position) : null
  const top10 = c.top10_count ?? 0
  const kwCount = c.keyword_count ?? 0

  const timeAgo = (iso: string | null) => {
    if (!iso) return 'Never'
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
      {/* Top row */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-[#00A4C6] transition-colors">
              {c.name || c.domain}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{c.domain}</p>
          </div>
          <StatusBadge status={c.status} />
        </div>

        {/* Progress bar if running */}
        {c.status === 'running' && (
          <div className="w-full h-1 bg-gray-100 rounded overflow-hidden mb-3">
            <div
              className="h-full bg-[#00A4C6] transition-all rounded"
              style={{ width: `${c.progress ?? 0}%` }}
            />
          </div>
        )}

        {/* Engine chips */}
        <div className="flex items-center gap-1.5">
          {(c.engines ?? ['google']).map((eng: string) => (
            <span key={eng} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-500 capitalize font-medium">
              {eng}
            </span>
          ))}
          <span className="text-xs text-gray-300 mx-1">·</span>
          <span className="text-xs text-gray-400 capitalize">{c.frequency}</span>
          {c.is_scheduled && (
            <span className="ml-auto text-xs bg-[#0DD3B6]/10 text-[#0DD3B6] border border-[#0DD3B6]/20 px-2 py-0.5 rounded font-medium">
              Scheduled
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 py-4 grid grid-cols-4 gap-3">
        <Stat label="Keywords" value={kwCount} accent />
        <Stat label="Avg rank" value={avgPos ? `#${avgPos}` : '—'} />
        <Stat label="Top 10" value={top10} accent={top10 > 0} />
        <Stat label="Checked" value={timeAgo(c.last_checked)} />
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {c.next_check
            ? `Next check ${new Date(c.next_check).toLocaleDateString()}`
            : 'Manual checks only'}
        </span>
        <span className="text-xs text-[#00A4C6] font-semibold group-hover:underline">
          View details →
        </span>
      </div>
    </div>

  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function RankTrackingIndexPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await apiFetch('/rank-tracking?page=1&page_size=50')
      setCampaigns(data.campaigns)
      setTotal(data.total)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const visible = filterStatus
    ? campaigns.filter(c => c.status === filterStatus)
    : campaigns

  const statusCounts = campaigns.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#F4F6FA] font-sans">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-gray-900">Rank Tracking</span>
              {total > 0 && (
                <span className="text-xs bg-[#00A4C6]/10 text-[#00A4C6] px-2 py-0.5 rounded font-semibold">
                  {total} campaign{total !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 rounded text-sm font-semibold text-white bg-[#00A4C6] hover:bg-[#0093B2] transition-colors"
            >
              + New tracking
            </button>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">

          {/* Summary stat strip */}
          {campaigns.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total campaigns', value: total, accent: true },
                { label: 'Running now', value: statusCounts['running'] ?? 0 },
                { label: 'Scheduled', value: campaigns.filter(c => c.is_scheduled).length },
                { label: 'Total keywords', value: campaigns.reduce((s, c) => s + (c.keyword_count ?? 0), 0), accent: true },
              ].map(s => (
                <div key={s.label} className="bg-white rounded border border-gray-200 px-5 py-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">{s.label}</span>
                  <span className={cls('text-3xl font-black tabular-nums', s.accent ? 'text-[#00A4C6]' : 'text-gray-900')}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Filter strip */}
          {campaigns.length > 0 && (
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

          {/* Grid or empty */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded border border-gray-200 h-52 animate-pulse" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState onNew={() => setShowModal(true)} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map(c => (
                <CampaignCard
                  key={c.job_id}
                  c={c}
                  onClick={() => router.push(`/rank-tracking/${c.job_id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <NewTrackingModal
            onClose={() => setShowModal(false)}
            onCreated={(jobId) => {
              setShowModal(false)
              router.push(`/rank-tracking/${jobId}`)
            }}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
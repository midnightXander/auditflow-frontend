'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/ui/progress'
import { CircularScore } from '@/components/circularScore'
import { ScoreBar } from '@/components/scoreBar'
import { WhiteLabelModal } from '@/components/whiteLabelModal'
import { useWhiteLabel } from '@/lib/whitelabel'
import { exportAuditPDF } from '@/lib/pdf-export'
import {
  ArrowLeft, Zap, Search, Shield, Link2,
  ImageIcon, FileJson, FileText,
  CheckCircle2, AlertTriangle, XCircle,
  Download, Settings2, Loader2,
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { ca } from 'date-fns/locale'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditResults {
  url: string
  audit_date: string
  overall_score: number
  lighthouse: {
    categories: Record<string, { title: string; score: number; description: string }>
    metrics: {
      coreWebVitals?: Record<string, { displayValue: string; score: number; rating: string }>
      performance?: Record<string, { displayValue: string; score: number }>
    }
    opportunities?: Array<{ title: string; description: string; savings?: { ms: number } }>
  }
  broken_links: { total_checked: number; broken_count: number; status: string; broken_links: any[] }
  image_optimization: { total_images: number; score: number; issues: any; recommendations: string[] }
  structured_data: { score: number; status: string; has_json_ld: boolean; has_open_graph: boolean; has_twitter_card: boolean; has_microdata: boolean; json_ld_types: string[]; open_graph_properties: string[]; twitter_card_type: string; recommendations: string[] }
  content_quality: { score: number; status: string; word_count: number; paragraph_count: number; avg_sentence_length: number; avg_paragraph_length: number; content_to_code_ratio: number; reading_ease_score: number; reading_level: string; heading_structure: Record<string, number>; recommendations: string[] }
  technical_seo: { title: any; meta_description: any; canonical: any; robots_txt: boolean; sitemap_xml: boolean; headings: Record<string, number> }
  security: { https: boolean; security_headers: Record<string, boolean> }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const scoreHex = (s: number) =>
  s >= 90 ? '#10B981' : s >= 70 ? '#06B6D4' : s >= 50 ? '#F59E0B' : '#EF4444'

const scoreBadge = (s: number): 'success' | 'info' | 'warning' | 'destructive' =>
  s >= 90 ? 'success' : s >= 70 ? 'info' : s >= 50 ? 'warning' : 'destructive'

function Tick({ ok }: { ok: boolean }) {
  return ok
    ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
    : <XCircle      className="w-5 h-5 text-red-400    shrink-0" />
}

function Row({ label, ok, note }: { label: string; ok: boolean; note?: string }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors
      ${ok ? 'bg-emerald-50/70 border-emerald-100' : 'bg-red-50/70 border-red-100'}`}>
      <Tick ok={ok} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {note && <p className="text-xs text-gray-500 font-mono truncate mt-0.5">{note}</p>}
      </div>
    </div>
  )
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingScreen({ progress }: { progress: number }) {
  const steps = [
    'Running Lighthouse audit',
    'Checking broken links',
    'Analysing images',
    'Validating structured data',
    'Scoring content quality',
    'Compiling report',
  ]
  const active = Math.min(Math.floor(progress / 17), steps.length - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">

        {/* ring */}
        <div className="relative inline-block mb-8">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="7" fill="none"/>
            <circle cx="50" cy="50" r="42"
              stroke="url(#lg)" strokeWidth="7" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2.64 * progress} 264`}
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#0075FF"/>
                <stop offset="100%" stopColor="#8766FF"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white tabular-nums">{progress}</span>
            <span className="text-xs text-blue-400 font-semibold">%</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">Analysing your site</h2>
        <p className="text-sm text-slate-400 mb-8">Usually 30–60 seconds</p>

        <div className="space-y-2 text-left">
          {steps.map((s, i) => (
            <div key={s}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                i < active  ? 'bg-emerald-500/10 text-emerald-400' :
                i === active ? 'bg-blue-500/20   text-blue-300 ring-1 ring-blue-500/30' :
                               'bg-white/5        text-slate-600'
              }`}
            >
              {i < active   ? <CheckCircle2 className="w-4 h-4 shrink-0"/> :
               i === active ? <Loader2      className="w-4 h-4 shrink-0 animate-spin"/> :
                              <div className="w-4 h-4 rounded-full border-2 border-slate-700 shrink-0"/>}
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AuditResultsPage() {
  const params    = useParams()
  const router    = useRouter()
  const { config } = useWhiteLabel()

  const [results,   setResults]   = useState<AuditResults | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [progress,  setProgress]  = useState(0)
  const [error,     setError]     = useState<string | null>(null)
  const [showWL,    setShowWL]    = useState(false)
  const [exporting, setExporting] = useState(false)

  /* poll backend */
  useEffect(() => {
    let dead = false
    const poll = async () => {
      try {
        const r    = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/audit/${params.jobId}`)
        const data = await r.json()
        if (data.status === 'completed' && data.results) { console.log(data.results); setResults(data.results); setLoading(false) }
        else if (data.status === 'failed')                { setError(data.error || 'Audit failed'); setLoading(false) }
        else { setProgress(data.progress || 0); if (!dead) setTimeout(poll, 2000) }
      } catch { setError('Cannot reach server'); setLoading(false) }
    }
    poll()
    return () => { dead = true }
  }, [params.jobId])

  const handleExport = async () => {
    if (!results) return
    setExporting(true)
    try { await exportAuditPDF(results, config) }
    finally { setExporting(false) }
  }

  if (loading) return <LoadingScreen progress={progress} />

  if (error || !results) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center shadow-xl">
        <CardHeader>
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2"/>
          <CardTitle>Audit Failed</CardTitle>
          <CardDescription>{error || 'Unknown error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/')} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2"/> Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const { lighthouse, broken_links: bl, image_optimization: img, structured_data: sd,
          content_quality: cq, technical_seo: seo, security: sec } = results

  const cats  = lighthouse?.categories ?? {}
  const cwv   = lighthouse?.metrics?.coreWebVitals ?? {}
  const perf  = lighthouse?.metrics?.performance   ?? {}
  const opps  = lighthouse?.opportunities ?? []
  const secH  = sec?.security_headers ?? {}
  

  // Quick-wins alerts
  const alerts = [
    bl?.broken_count > 0        && { label: `${bl.broken_count} broken link${bl.broken_count > 1 ? 's' : ''}`,   color: 'bg-red-50    border-red-200    text-red-700',    icon: <Link2      className="w-4 h-4 shrink-0"/> },
    img?.issues?.missing_alt_count > 0 && { label: `${img.issues.missing_alt_count} images missing alt text`,  color: 'bg-amber-50  border-amber-200  text-amber-700',  icon: <ImageIcon  className="w-4 h-4 shrink-0"/> },
    !sd?.has_json_ld             && { label: 'No JSON-LD structured data',                                       color: 'bg-blue-50   border-blue-200   text-blue-700',   icon: <FileJson   className="w-4 h-4 shrink-0"/> },
    (cq?.word_count ?? 0) < 300  && { label: `Only ${cq?.word_count ?? 0} words of content`,                    color: 'bg-purple-50 border-purple-200 text-purple-700', icon: <FileText   className="w-4 h-4 shrink-0"/> },
  ].filter(Boolean) as { label: string; color: string; icon: React.ReactNode }[]

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {showWL && <WhiteLabelModal onClose={() => setShowWL(false)} />}

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4"/><span className="text-sm font-medium hidden sm:inline">Back</span>
          </Link>

          <div className="flex-1 min-w-0 text-center">
            <p className="text-xs text-gray-400 font-mono truncate hidden md:block">{results.url}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setShowWL(true)} className="text-gray-600 gap-1.5">
              <Settings2 className="w-4 h-4"/>
              <span className="hidden sm:inline text-sm">Agency Settings</span>
            </Button>
            <Button size="sm"  onClick={handleExport} disabled={exporting} className="gap-1.5">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">

        {/* ── Hero card ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* accent stripe — uses agency colour */}
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${config.accentColor}, #8766FF)` }}/>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

              <CircularScore score={results.overall_score} size="lg"/>

              <div className="flex-1 text-center sm:text-left">
                {/* agency / client badge */}
                {(config.agencyName !== 'AuditFlow' || config.clientName) && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                      style={{ background: config.accentColor }}>
                      {config.agencyName}
                    </span>
                    {config.clientName && (
                      <span className="text-xs text-gray-400">Report for <strong className="text-gray-700">{config.clientName}</strong></span>
                    )}
                  </div>
                )}

                <h1 className="text-lg font-bold text-gray-900 break-all">{results.url}</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Audited {new Date(results.audit_date).toLocaleString()}
                  {config.preparedBy && <> · Prepared by <span className="text-gray-600">{config.preparedBy}</span></>}
                </p>

                {/* category pills */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                  {Object.entries(cats).map(([k, cat]) => (
                    <div key={k} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
                      <span className="text-sm font-bold" style={{ color: scoreHex(cat.score) }}>{cat.score}</span>
                      <span className="text-xs text-gray-500">{cat.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CWV snapshot (desktop) */}
              <div className="hidden lg:flex flex-col gap-2.5 shrink-0 border-l border-gray-100 pl-6">
                {(['lcp','cls','tbt'] as const).map(k => {
                  const v = cwv[k]; if (!v) return null
                  const s = Math.round(v.score * 100)
                  return (
                    <div key={k} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 uppercase w-8">{k}</span>
                      <span className="text-sm font-bold" style={{ color: scoreHex(s) }}>{v.displayValue}</span>
                      <Badge variant={scoreBadge(s)} className="text-[10px]">{v.rating}</Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Quick-wins / all-clear ─────────────────────────────────────── */}
        {alerts.length === 0 ? (
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 shrink-0"/>
            <span className="text-sm font-semibold">No critical issues found — excellent work!</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {alerts.map((a, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium ${a.color}`}>
                {a.icon}{a.label}
              </div>
            ))}
          </div>
        )}

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 bg-white border border-gray-100 shadow-sm rounded-xl p-1 gap-1 h-auto">
            {[
              { v: 'overview',    l: 'Overview',    i: <Zap      className="w-3.5 h-3.5"/> },
              { v: 'performance', l: 'Performance', i: <Zap      className="w-3.5 h-3.5"/> },
              { v: 'seo',        l: 'SEO',          i: <Search   className="w-3.5 h-3.5"/> },
              { v: 'images',     l: 'Images',       i: <ImageIcon className="w-3.5 h-3.5"/> },
              { v: 'content',    l: 'Content',      i: <FileText  className="w-3.5 h-3.5"/> },
              { v: 'security',   l: 'Security',     i: <Shield    className="w-3.5 h-3.5"/> },
            ].map(t => (
              <TabsTrigger key={t.v} value={t.v}
                className="flex items-center gap-1.5 text-xs py-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                {t.i}<span className="hidden sm:inline">{t.l}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-3"><CardTitle className="text-base">Lighthouse Scores</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(cats).map(([k, cat]) => (
                    <ScoreBar key={k} label={cat.title} score={cat.score} showBadge/>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-3"><CardTitle className="text-base">Core Web Vitals</CardTitle></CardHeader>
                <CardContent className="space-y-2.5">
                  {[
                    { k: 'lcp', label: 'Largest Contentful Paint', goal: '≤ 2.5 s' },
                    { k: 'cls', label: 'Cumulative Layout Shift',  goal: '≤ 0.1' },
                    { k: 'tbt', label: 'Total Blocking Time',      goal: '≤ 200 ms' },
                  ].map(({ k, label, goal }) => {
                    const v = cwv[k]; if (!v) return null
                    const s = Math.round(v.score * 100)
                    return (
                      <div key={k} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50">
                        <div><p className="text-sm font-semibold text-gray-800">{label}</p><p className="text-xs text-gray-400">Goal: {goal}</p></div>
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: scoreHex(s) }}>{v.displayValue}</p>
                          <Badge variant={scoreBadge(s)} className="text-[10px] mt-0.5">{v.rating?.replace('-', ' ')}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* All-checks grid */}
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3"><CardTitle className="text-base">All Checks at a Glance</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {[
                    { l: 'HTTPS',             ok: !!sec?.https },
                    { l: 'Title tag',         ok: !!seo?.title?.present },
                    { l: 'Meta description',  ok: !!seo?.meta_description?.present },
                    { l: 'Robots.txt',        ok: !!seo?.robots_txt },
                    { l: 'Sitemap.xml',       ok: !!seo?.sitemap_xml },
                    { l: 'JSON-LD',           ok: !!sd?.has_json_ld },
                    { l: 'Open Graph',        ok: !!sd?.has_open_graph },
                    { l: 'Twitter Card',      ok: !!sd?.has_twitter_card },
                    { l: 'Image alt text',    ok: (img?.issues?.missing_alt_count ?? 1) === 0 },
                    { l: 'Image dimensions',  ok: (img?.issues?.missing_dimensions_count ?? 1) === 0 },
                    { l: 'No broken links',   ok: (bl?.broken_count ?? 1) === 0 },
                    { l: 'Content ≥ 300w',    ok: (cq?.word_count ?? 0) >= 300 },
                  ].map(({ l, ok }) => (
                    <div key={l} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold
                      ${ok ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                      {ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0"/> : <XCircle className="w-3.5 h-3.5 shrink-0"/>}
                      {l}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="mt-4">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Improvement Opportunities</CardTitle>
                <CardDescription>Ordered by potential time savings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {opps.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-6">No significant opportunities found. Your performance is great!</p>
                )}
                {opps.slice(0, 8).map((o, i) => (
                  <div key={i} className="p-4 rounded-xl border border-amber-100 bg-amber-50/40">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-800">{o.title}</p>
                      {o.savings?.ms && (
                        <Badge variant="warning" className="text-xs whitespace-nowrap shrink-0">
                          ~{Math.round(o.savings.ms)} ms
                        </Badge>
                      )}
                    </div>
                    {/* <p className="text-xs text-gray-600">{o.description?.substring(0, 160)}</p> */}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        a: ({node, ...props}) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
                        ),
                        p: ({node, ...props}) => <p className="text-xs text-gray-600" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) =>
                          inline ? <code className="bg-gray-100 px-1 rounded text-sm" {...props}>{children}</code> :
                          <code className="block p-2 bg-gray-100 rounded overflow-x-auto" {...props}>{children}</code>
                      }}
                    >
                      {o.description || ''}
                    </ReactMarkdown>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO */}
          <TabsContent value="seo" className="mt-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="">
                  <CardTitle className="text-base flex gap-2 items-center"><Search className="w-4 h-4"/>Technical SEO</CardTitle>
                </CardHeader>
                <CardDescription  className='px-4 text-xs text-gray-600'>
                  <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        a: ({node, ...props}) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
                        ),
                        p: ({node, ...props}) => <p className="text-xs text-gray-600" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) =>
                          inline ? <code className="bg-gray-100 px-1 rounded text-sm" {...props}>{children}</code> :
                          <code className="block p-2 bg-gray-100 rounded overflow-x-auto" {...props}>{children}</code>
                      }}
                    >
                      {cats.seo && cats.seo.description || ''}
                    </ReactMarkdown>
                </CardDescription>
                <CardContent className="space-y-2">
                  {[
                    { label: 'Title tag',         ok: !!seo?.title?.present,            note: seo?.title?.content?.substring(0, 55) },
                    { label: 'Meta description',  ok: !!seo?.meta_description?.present, note: `${seo?.meta_description?.length ?? 0} chars` },
                    { label: 'Canonical URL',     ok: !!seo?.canonical?.present },
                    { label: 'Robots.txt',        ok: !!seo?.robots_txt },
                    { label: 'Sitemap.xml',       ok: !!seo?.sitemap_xml },
                    { label: 'Single H1 tag',     ok: (seo?.headings?.h1 ?? 0) === 1,   note: `${seo?.headings?.h1 ?? 0} found` },
                  ].map(({ label, ok, note }) => <Row key={label} label={label} ok={ok} note={note}/>)}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex gap-2 items-center"><FileJson className="w-4 h-4"/>Structured Data</CardTitle>
                    <CircularScore score={sd?.score ?? 0} size="sm" showLabel={false}/>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: 'JSON-LD',      ok: !!sd?.has_json_ld,      note: sd?.json_ld_types?.join(', ') },
                    { label: 'Open Graph',   ok: !!sd?.has_open_graph,   note: `${sd?.open_graph_properties?.length ?? 0} properties` },
                    { label: 'Twitter Card', ok: !!sd?.has_twitter_card, note: sd?.twitter_card_type },
                    { label: 'Microdata',    ok: !!sd?.has_microdata },
                  ].map(({ label, ok, note }) => <Row key={label} label={label} ok={ok} note={note}/>)}
                  {sd?.recommendations?.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-blue-700 pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0"/>{r}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Images */}
          <TabsContent value="images" className="mt-4">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex gap-2 items-center"><ImageIcon className="w-4 h-4"/>Image Optimisation</CardTitle>
                  <CircularScore score={img?.score ?? 0} size="sm" showLabel={false}/>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { l: 'Total images',    v: img?.total_images ?? 0,                       bad: false },
                    { l: 'Missing alt',     v: img?.issues?.missing_alt_count ?? 0,          bad: (img?.issues?.missing_alt_count ?? 0) > 0 },
                    { l: 'No dimensions',   v: img?.issues?.missing_dimensions_count ?? 0,   bad: (img?.issues?.missing_dimensions_count ?? 0) > 0 },
                    { l: 'Old format',      v: img?.issues?.old_format_count ?? 0,           bad: (img?.issues?.old_format_count ?? 0) > 0 },
                  ].map(({ l, v, bad }) => (
                    <div key={l} className={`rounded-xl p-4 text-center ${bad && v > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                      <p className={`text-2xl font-black ${bad && v > 0 ? 'text-red-600' : 'text-gray-900'}`}>{v}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
                <Progress value={img?.score ?? 0}
                  className={`h-2 ${((img?.score ?? 0) >= 80
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    : (img?.score ?? 0) >= 50
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                      : 'bg-gradient-to-r from-red-400 to-red-500')}`}/>
                {img?.recommendations?.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-100">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"/>
                    <p className="text-sm text-amber-800">{r}</p>
                  </div>
                ))}

                {/* ── Missing alt images ───────────────────────────────────────────── */}
                {img.issues && img?.issues.missing_alt_examples.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-800">Images missing alt text</h3>
                    <p className="text-xs text-gray-500">Examples of images without alt attributes (showing up to 12).</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {img.issues && img?.issues.missing_alt_examples.slice(0, 12).map((it: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100">
                          <div className="w-20 h-14 bg-gray-50 rounded overflow-hidden flex items-center justify-center shrink-0">
                            {it.startsWith('http') ? <img src={it} alt="" className="object-cover w-full h-full"/> : <img src={results.url + it} alt="" className="object-cover w-full h-full"/>}
                            {!it ? <div className="text-xs text-gray-400">No preview</div> : ""}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{it || it.src || it.path || '—'}</p>
                            <p className="text-xs text-gray-500 mt-1">Alt: <span className="text-red-600 font-medium">missing</span></p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {it.size && <span className="text-xs text-gray-500">{it.size}</span>}
                            <a href={it.startsWith('http') ? it : results.url + it} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Open</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Missing dimensions images ─────────────────────────────────────── */}
                {img.issues && img?.issues.missing_dimensions_examples.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-800">Images missing width/height</h3>
                    <p className="text-xs text-gray-500">Images without explicit dimensions can cause layout shifts. Showing up to 12.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {img.issues && img?.issues.missing_dimensions_examples.slice(0, 12).map((it: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100">
                          <div className="w-20 h-14 bg-gray-50 rounded overflow-hidden flex items-center justify-center shrink-0">
                           {it.startsWith('http') ? <img src={it} alt="" className="object-cover w-full h-full"/> : <img src={results.url + it} alt="" className="object-cover w-full h-full"/>}
                            {!it ? <div className="text-xs text-gray-400">No preview</div> : ""}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{it.url || it.src || it.path || '—'}</p>
                            <p className="text-xs text-gray-500 mt-1">Dimensions: <span className="text-gray-700">{(it.width && it.height) ? `${it.width}×${it.height}` : 'missing'}</span></p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {it.size && <span className="text-xs text-gray-500">{it.size}</span>}
                            <a href={it.startsWith('http') ? it : results.url + it} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Open</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Old format images (e.g. JPEG/PNG that could be WebP/AVIF) ───────── */}
                {img.issues && img?.issues.old_format_examples.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-800">Images in old/inefficient formats</h3>
                    <p className="text-xs text-gray-500">Images that may benefit from modern formats (WebP/AVIF). Showing up to 12.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {img.issues && img?.issues.old_format_examples.slice(0, 12).map((it: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100">
                          <div className="w-20 h-14 bg-gray-50 rounded overflow-hidden flex items-center justify-center shrink-0">
                            {it.startsWith('http') ? <img src={it} alt="" className="object-cover w-full h-full"/> : <img src={results.url + it} alt="" className="object-cover w-full h-full"/>}
                            {!it ? <div className="text-xs text-gray-400">No preview</div> : ""}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{it.url || it.src || it.path || '—'}</p>
                            <p className="text-xs text-gray-500 mt-1">Format: <span className="text-gray-700 font-medium">{it.type || it.format || 'unknown'}</span></p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {it.originalSize && <span className="text-xs text-gray-500">{it.originalSize}</span>}
                            <a href={it.startsWith('http') ? it : results.url + it} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">Open</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                


              </CardContent>
            </Card>
          </TabsContent>

          {/* Content */}
          <TabsContent value="content" className="mt-4">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex gap-2 items-center"><FileText className="w-4 h-4"/>Content Quality</CardTitle>
                  <CircularScore score={cq?.score ?? 0} size="sm" showLabel={false}/>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { l: 'Word count',       v: cq?.word_count ?? 0,                              good: (cq?.word_count ?? 0) >= 500 },
                    { l: 'Paragraphs',       v: cq?.paragraph_count ?? 0,                         good: (cq?.paragraph_count ?? 0) > 2 },
                    { l: 'Avg sentence',     v: `${cq?.avg_sentence_length ?? 0}w`,               good: (cq?.avg_sentence_length ?? 0) <= 20 },
                    { l: 'Content ratio',    v: `${cq?.content_to_code_ratio?.toFixed(1) ?? 0}%`, good: (cq?.content_to_code_ratio ?? 0) >= 15 },
                    { l: 'Reading ease',     v: cq?.reading_ease_score?.toFixed(0) ?? '—',        good: (cq?.reading_ease_score ?? 0) >= 60 },
                    { l: 'H2 headings',      v: cq?.heading_structure?.h2 ?? 0,                   good: (cq?.heading_structure?.h2 ?? 0) > 0 },
                  ].map(({ l, v, good }) => (
                    <div key={l} className={`rounded-xl p-4 ${good ? 'bg-emerald-50' : 'bg-red-50'}`}>
                      <p className={`text-xl font-black ${good ? 'text-emerald-700' : 'text-red-600'}`}>{v}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-600 font-medium">Reading Level</span>
                  <span className="text-sm font-bold text-gray-900">{cq?.reading_level ?? '—'}</span>
                </div>
                {cq?.recommendations?.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-blue-50 border border-blue-100">
                    <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5"/>
                    <p className="text-sm text-blue-800">{r}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="mt-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-3"><CardTitle className="text-base flex gap-2 items-center"><Shield className="w-4 h-4"/>Security Headers</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: 'HTTPS / SSL',             ok: !!sec?.https },
                    { label: 'HSTS',                    ok: !!secH?.strict_transport_security },
                    { label: 'X-Frame-Options',         ok: !!secH?.x_frame_options },
                    { label: 'X-Content-Type-Options',  ok: !!secH?.x_content_type_options },
                    { label: 'Content-Security-Policy', ok: !!secH?.content_security_policy },
                  ].map(({ label, ok }) => <Row key={label} label={label} ok={ok}/>)}
                </CardContent>
              </Card>

              <Card className="shadow-sm  border-gray-100">
                <CardHeader className="pb-3"><CardTitle className="text-base flex gap-2 items-center"><Link2 className="w-4 h-4"/>Broken Links</CardTitle></CardHeader>
                <CardContent className="max-h-96 overflow-y-auto space-y-3">
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                    bl?.status === 'pass' ? 'bg-emerald-50 border-emerald-100' :
                    bl?.status === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      bl?.status === 'pass' ? 'bg-emerald-500' :
                      bl?.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}/>
                    <div>
                      <p className="text-sm font-bold text-gray-800 capitalize">{bl?.status ?? '—'}</p>
                      <p className="text-xs text-gray-500">{bl?.total_checked ?? 0} links checked · {bl?.broken_count ?? 0} broken</p>
                    </div>
                  </div>
                  {(bl?.broken_links ?? []).map((link: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-red-50 border border-red-100 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="text-xs">{link.status_code ?? 'Error'}</Badge>
                        <span className="text-xs text-gray-500 capitalize">{link.type}</span>
                      </div>
                      <p className="text-xs font-mono text-gray-700 break-all">{link.url?.substring(0, 80)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Bottom export CTA ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 rounded-2xl bg-slate-900 text-white">
          <div>
            <p className="font-bold">Ready to share with your client?</p>
            <p className="text-sm text-slate-400 mt-0.5">
              Export a fully branded PDF report.{' '}
              <button onClick={() => setShowWL(true)} className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2">
                Update agency branding →
              </button>
            </p>
          </div>
          <Button onClick={handleExport} disabled={exporting} size="lg"
            className="bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white shrink-0 gap-2 shadow-lg">
            {exporting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Download className="w-5 h-5"/>}
            Export PDF Report
          </Button>
        </div>

      </div>
    </div>
  )
}
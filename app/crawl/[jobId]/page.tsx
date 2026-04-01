'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft, Globe, FileText, Link2, AlertTriangle, CheckCircle2,
  XCircle, Loader2, Clock, Database, TrendingUp, Search, Layers, Share2, Settings2, Download
} from 'lucide-react'
import Link from 'next/link'
import { fetchWithAuth } from '@/lib/auth-context'
import ShareAuditModal from '@/components/share-audit-modal'
import { WhiteLabelModal } from '@/components/whiteLabelModal'
import { useWhiteLabel } from '@/lib/whitelabel'
import { exportCrawlPDF } from '@/lib/pdf-export'


interface CrawlResults {
  summary: {
    start_url: string
    domain: string
    total_pages_crawled: number
    total_internal_links: number
    total_external_links: number
    unique_external_domains: number
    avg_word_count: number
    avg_load_time_ms: number
    crawl_duration_sec: number
    crawl_date: string
  }
  issues: {
    duplicate_titles: Record<string, string[]>
    duplicate_content: Array<{ urls: string[]; count: number }>
    thin_content: Array<{ url: string; word_count: number }>
    orphan_pages: Array<{ url: string; word_count: number }>
    broken_pages: Array<{ url: string; status_code: number; error?: string }>
    missing_meta_description: string[]
    missing_h1: string[]
    multiple_h1: Array<{ url: string; h1_count: number; h1_tags: string[] }>
    slow_pages: Array<{ url: string; load_time_ms: number }>
    large_pages: Array<{ url: string; size_kb: number }>
  }
  site_structure: Record<string, Array<{ url: string; title: string; word_count: number }>>
  top_pages: {
    most_linked: any[]
    longest_content: any[]
    slowest: any[]
  }
  pages: any[]
}

function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="relative inline-block mb-8">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="6" fill="none"/>
            <circle cx="50" cy="50" r="42"
              stroke="url(#cg)" strokeWidth="6" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2.64 * progress} 264`}
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-1"/>
            <span className="text-2xl font-black text-white tabular-nums">{progress}%</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Crawling your site</h2>
        <p className="text-slate-400 text-sm mb-8">This may take 3-10 minutes depending on site size</p>

        <div className="space-y-2 text-left">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <Globe className="w-5 h-5 text-indigo-400 shrink-0"/>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Discovering pages</p>
              <p className="text-xs text-slate-400">Following internal links</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <FileText className="w-5 h-5 text-purple-400 shrink-0"/>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Analyzing content</p>
              <p className="text-xs text-slate-400">Titles, meta tags, word counts</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0"/>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Detecting issues</p>
              <p className="text-xs text-slate-400">Duplicates, orphans, broken links</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CrawlResultsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string
  const { config } = useWhiteLabel()

  const [results, setResults] = useState<CrawlResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showWL,    setShowWL]    = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [shareClient, setShareClient] = useState('')
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [isGeneratingShare, setIsGeneratingShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let stopped = false
    const poll = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/'}/crawl/${jobId}`)
        const data = await res.json()
        
        if (data.status === 'completed' && data.results) {
          setResults(data.results)
          setLoading(false)
        } else if (data.status === 'failed') {
          setError(data.error || 'Crawl failed')
          setLoading(false)
        } else {
          setProgress(data.progress || 0)
          if (!stopped) setTimeout(poll, 2000)
        }
      } catch {
        setError('Could not reach server')
        setLoading(false)
      }
    }
    poll()
    return () => { stopped = true }
  }, [jobId])

  const handleExport = async () => {
      if (!results) return
      setExporting(true)
      
      try { await exportCrawlPDF(results, config) }
      finally { setExporting(false) }
    }
  
    const generateShareLink = async () => {
      if (!params?.jobId) return
      setIsGeneratingShare(true)
      setShareLink(null)
      try {
        // Try backend share endpoint
        const api = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/crawl/${params.jobId}/share`
        const res = await fetchWithAuth(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_name: shareClient || undefined }),
        })
        if (res.ok) {
          const data = await res.json()
          setShareLink(data.share_url || data.url || null)
        } else {
          const origin = typeof window !== 'undefined' ? window.location.origin : ''
          const q = shareClient ? `?client=${encodeURIComponent(shareClient)}` : ''
          setShareLink(`${origin}/share/audit/${params.jobId}${q}`)
        }
      } catch (err) {
        console.error('Share link generation failed', err)
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        const q = shareClient ? `?client=${encodeURIComponent(shareClient)}` : ''
        setShareLink(`${origin}/share/audit/${params.jobId}${q}`)
      } finally {
        setIsGeneratingShare(false)
      }
    }
  
    const copyShareLink = async () => {
      if (!shareLink) return
      try {
        await navigator.clipboard.writeText(shareLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Copy failed', err)
        alert('Unable to copy link')
      }
    }
  

  if (loading) return <LoadingScreen progress={progress} />

  if (error || !results) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center shadow-xl">
        <CardHeader>
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2"/>
          <CardTitle>Crawl Failed</CardTitle>
          <CardDescription>{error || 'Unknown error'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/')} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2"/> Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const { summary, issues, site_structure } = results
  const totalIssues = Object.values(issues).reduce((acc, val) => 
    acc + (Array.isArray(val) ? val.length : Object.keys(val).length), 0
  )

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {showWL && <WhiteLabelModal onClose={() => setShowWL(false)} />}
      
            {showShare && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <ShareAuditModal
                    open={showShare}
                    onClose={() => setShowShare(false)}
                    clientName={shareClient}
                    setClientName={setShareClient}
                    shareLink={shareLink}
                    isGenerating={isGeneratingShare}
                    generate={generateShareLink}
                    copy={copyShareLink}
                    copied={copied}
                  />
                </div>
              </div>
            )}
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4"/>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-mono truncate">{summary.start_url}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => setShowShare(true)} className="text-gray-600 gap-1.5">
                        <Share2 className="w-4 h-4"/>
                        <span className="hidden sm:inline text-sm">Share</span>
                      </Button>
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

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Hero stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-indigo-600"/>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{summary.total_pages_crawled}</p>
                  <p className="text-sm text-gray-500">Pages Crawled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <Link2 className="w-6 h-6 text-purple-600"/>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{summary.total_internal_links}</p>
                  <p className="text-sm text-gray-500">Internal Links</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  totalIssues === 0 ? 'bg-emerald-50' : 'bg-amber-50'
                }`}>
                  {totalIssues === 0 
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-600"/>
                    : <AlertTriangle className="w-6 h-6 text-amber-600"/>
                  }
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{totalIssues}</p>
                  <p className="text-sm text-gray-500">Issues Found</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-blue-600"/>
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900">{Math.round(summary.avg_load_time_ms)}</p>
                  <p className="text-sm text-gray-500">Avg Load (ms)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issues grid */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Duplicate titles */}
          {Object.keys(issues.duplicate_titles).length > 0 && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500"/>
                  Duplicate Titles
                  <Badge variant="warning" className="ml-auto">{Object.keys(issues.duplicate_titles).length}</Badge>
                </CardTitle>
                <CardDescription>Multiple pages share the same title tag</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(issues.duplicate_titles).slice(0, 5).map(([title, urls]) => (
                  <div key={title} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
                    <p className="text-xs text-gray-500">{urls.length} pages with this title</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Thin content */}
          {issues.thin_content.length > 0 && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500"/>
                  Thin Content
                  <Badge variant="warning" className="ml-auto">{issues.thin_content.length}</Badge>
                </CardTitle>
                <CardDescription>Pages with fewer than 300 words</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {issues.thin_content.slice(0, 5).map((page, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-orange-50">
                    <p className="text-xs font-mono text-gray-700 truncate flex-1">{page.url}</p>
                    <Badge variant="destructive" className="text-xs ml-2">{page.word_count}w</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Orphan pages */}
          {issues.orphan_pages.length > 0 && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-500"/>
                  Orphan Pages
                  <Badge variant="warning" className="ml-auto">{issues.orphan_pages.length}</Badge>
                </CardTitle>
                <CardDescription>Pages with no internal links pointing to them</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {issues.orphan_pages.slice(0, 5).map((page, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-purple-50 text-xs font-mono text-gray-700 truncate">
                    {page.url}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Broken pages */}
          {issues.broken_pages.length > 0 && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500"/>
                  Broken Pages
                  <Badge variant="destructive" className="ml-auto">{issues.broken_pages.length}</Badge>
                </CardTitle>
                <CardDescription>Pages returning 4xx or 5xx errors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {issues.broken_pages.slice(0, 5).map((page, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-red-50">
                    <p className="text-xs font-mono text-gray-700 truncate flex-1">{page.url}</p>
                    <Badge variant="destructive" className="text-xs ml-2">{page.status_code}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Missing meta */}
          {issues.missing_meta_description.length > 0 && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-500"/>
                  Missing Meta Description
                  <Badge variant="info" className="ml-auto">{issues.missing_meta_description.length}</Badge>
                </CardTitle>
                <CardDescription>Pages without meta description tags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {issues.missing_meta_description.slice(0, 5).map((url, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-blue-50 text-xs font-mono text-gray-700 truncate">
                    {url}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Slow pages */}
          {issues.slow_pages.length > 0 && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500"/>
                  Slow Pages
                  <Badge variant="destructive" className="ml-auto">{issues.slow_pages.length}</Badge>
                </CardTitle>
                <CardDescription>Pages taking longer than 3 seconds to load</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {issues.slow_pages.slice(0, 5).map((page, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-red-50">
                    <p className="text-xs font-mono text-gray-700 truncate flex-1">{page.url}</p>
                    <Badge variant="destructive" className="text-xs ml-2">{Math.round(page.load_time_ms)}ms</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        </div>

        {/* Site structure */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4"/>
              Site Structure
            </CardTitle>
            <CardDescription>Pages organized by URL depth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(site_structure).slice(0, 5).map(([depth, pages]) => (
                <div key={depth} className="border-l-2 border-indigo-200 pl-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">{depth.replace('depth_', 'Level ')}: {pages.length} pages</p>
                  <div className="space-y-1">
                    {pages.slice(0, 3).map((page, i) => (
                      <p key={i} className="text-xs text-gray-500 font-mono truncate">{page.url}</p>
                    ))}
                    {pages.length > 3 && (
                      <p className="text-xs text-gray-400 italic">+ {pages.length - 3} more</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
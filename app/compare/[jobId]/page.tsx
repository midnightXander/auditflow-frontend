'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/badge'
import { Progress } from '@/components/progress'
import { CircularScore } from '@/components/circularScore'
import {
  ArrowLeft, Trophy, AlertTriangle, TrendingUp, TrendingDown,
  Zap, Shield, FileText, Search, Award, XCircle, Loader2, Target
} from 'lucide-react'
import Link from 'next/link'

interface ComparisonResults {
  target_url: string
  competitor_urls: string[]
  comparison_date: string
  overall_scores: {
    target: { url: string; score: number }
    competitors: Array<{ url: string; score: number }>
  }
  categories: Record<string, {
    name: string
    scores: Array<{ url: string; score: number }>
    winner: string
    winner_score: number
    target_score: number
    target_position: number
  }>
  performance: Record<string, any>
  seo: any
  content: any
  security: any
  gaps: Array<{
    type: string
    severity: string
    metric: string
    message: string
    recommendation: string
  }>
  winners: {
    overall: string
    performance: string
    seo: string
    accessibility: string
    best_practices: string
    content: string
    security: string
    win_counts: Record<string, number>
  }
}

function LoadingScreen({ progress, status }: { progress: number; status: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-950 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="relative inline-block mb-8">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" stroke="#1e1b4b" strokeWidth="6" fill="none"/>
            <circle cx="50" cy="50" r="42"
              stroke="url(#vg)" strokeWidth="6" fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2.64 * progress} 264`}
              className="transition-all duration-500 ease-out"
            />
            <defs>
              <linearGradient id="vg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7"/>
                <stop offset="100%" stopColor="#ec4899"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin mb-1"/>
            <span className="text-2xl font-black text-white tabular-nums">{progress}%</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Analyzing competitors</h2>
        <p className="text-violet-300 text-sm mb-2">{status || 'Running audits in parallel'}</p>
        <p className="text-violet-400 text-xs">This takes 1-2 minutes</p>
      </div>
    </div>
  )
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

export default function ComparisonResultsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string

  const [results, setResults] = useState<ComparisonResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stopped = false
    const poll = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/compare/${jobId}`)
        const data = await res.json()
        
        if (data.status === 'completed' && data.results) {
          setResults(data.results)
          setLoading(false)
        } else if (data.status === 'failed') {
          setError(data.error || 'Comparison failed')
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

  if (loading) return <LoadingScreen progress={progress} status={status} />

  if (error || !results) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center shadow-xl">
        <CardHeader>
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2"/>
          <CardTitle>Comparison Failed</CardTitle>
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

  const { overall_scores, categories, gaps, winners } = results
  const allSites = [overall_scores.target, ...overall_scores.competitors]

  // Determine if target is winning
  const targetIsWinner = overall_scores.target.url === winners.overall
  const targetWins = winners.win_counts[overall_scores.target.url] || 0

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4"/>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 truncate">
              {getDomain(results.target_url)} vs {results.competitor_urls.length} competitors
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Overall winner banner */}
        <div className={`rounded-2xl p-6 ${targetIsWinner ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'} text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {targetIsWinner ? (
                  <Trophy className="w-6 h-6"/>
                ) : (
                  <Target className="w-6 h-6"/>
                )}
                <h2 className="text-2xl font-black">
                  {targetIsWinner ? 'You\'re Winning!' : 'Opportunity for Growth'}
                </h2>
              </div>
              <p className="text-white/90">
                {targetIsWinner 
                  ? `You won ${targetWins} out of 7 categories`
                  : `${getDomain(winners.overall)} is leading with ${winners.win_counts[winners.overall]} wins`
                }
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-black">{overall_scores.target.score}</p>
              <p className="text-sm text-white/80">Your Score</p>
            </div>
          </div>
        </div>

        {/* Overall scores comparison */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4"/>
              Overall Score Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allSites.map((site, i) => (
                <div key={i} className={`p-4 rounded-xl border-2 ${
                  site.url === overall_scores.target.url 
                    ? 'border-indigo-300 bg-indigo-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {site.url === overall_scores.target.url && (
                      <Target className="w-4 h-4 text-indigo-600"/>
                    )}
                    <p className="text-xs font-semibold text-gray-600 truncate">
                      {getDomain(site.url)}
                    </p>
                  </div>
                  <CircularScore score={site.score} size="md"/>
                  {site.url === winners.overall && (
                    <Badge variant="success" className="mt-2">Winner</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category winners */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Category-by-Category Results</CardTitle>
            <CardDescription>Who wins in each audit category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(categories).map(([key, cat]) => {
              const targetScore = cat.scores.find(s => s.url === overall_scores.target.url)?.score || 0
              const isWinner = cat.winner === overall_scores.target.url
              
              return (
                <div key={key} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {key === 'performance' && <Zap className="w-4 h-4 text-yellow-600"/>}
                      {key === 'seo' && <Search className="w-4 h-4 text-blue-600"/>}
                      {key === 'accessibility' && <Shield className="w-4 h-4 text-green-600"/>}
                      {key === 'best-practices' && <FileText className="w-4 h-4 text-purple-600"/>}
                      <span className="text-sm font-bold text-gray-800">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{targetScore}</span>
                      {isWinner ? (
                        <Trophy className="w-4 h-4 text-yellow-500"/>
                      ) : cat.target_position === 2 ? (
                        <Badge variant="info" className="text-xs">2nd</Badge>
                      ) : cat.target_position === 3 ? (
                        <Badge variant="warning" className="text-xs">3rd</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">#{cat.target_position}</Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress bars for all sites */}
                  <div className="space-y-1.5">
                    {cat.scores.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-32 truncate">
                          {getDomain(s.url)}
                        </span>
                        <div className="flex-1">
                          <Progress value={s.score} className="h-2"
                            indicatorClassName={s.url === overall_scores.target.url ? 'bg-indigo-600' : 'bg-gray-300'}/>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-8 text-right">{s.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Competitive gaps */}
        {gaps.length > 0 && (
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500"/>
                Competitive Gaps
                <Badge variant="warning" className="ml-auto">{gaps.length}</Badge>
              </CardTitle>
              <CardDescription>Areas where competitors are beating you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {gaps.map((gap, i) => {
                const severityColor = {
                  critical: 'bg-red-50 border-red-200',
                  high: 'bg-orange-50 border-orange-200',
                  medium: 'bg-amber-50 border-amber-200',
                  low: 'bg-yellow-50 border-yellow-200',
                }[gap.severity] || 'bg-gray-50 border-gray-200'
                
                const severityBadge = {
                  critical: 'destructive',
                  high: 'destructive',
                  medium: 'warning',
                  low: 'warning',
                }[gap.severity] as any || 'warning'
                
                return (
                  <div key={i} className={`p-4 rounded-xl border ${severityColor}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={severityBadge} className="text-xs uppercase">
                            {gap.severity}
                          </Badge>
                          <span className="text-xs text-gray-500">{gap.type}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">{gap.message}</p>
                        <div className="flex items-start gap-2 text-xs text-gray-700">
                          <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0 text-green-600"/>
                          <span>{gap.recommendation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Win summary */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Category Win Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {allSites.map((site, i) => {
                const wins = winners.win_counts[site.url] || 0
                const isTarget = site.url === overall_scores.target.url
                
                return (
                  <div key={i} className={`p-4 rounded-xl text-center ${
                    isTarget ? 'bg-indigo-50 border-2 border-indigo-300' : 'bg-gray-50'
                  }`}>
                    <p className="text-xs font-semibold text-gray-600 mb-2 truncate">
                      {getDomain(site.url)}
                    </p>
                    <p className="text-4xl font-black text-gray-900 mb-1">{wins}</p>
                    <p className="text-xs text-gray-500">Category {wins === 1 ? 'Win' : 'Wins'}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
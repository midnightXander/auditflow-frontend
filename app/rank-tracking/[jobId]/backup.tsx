'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/badge'
import { fetchWithAuth } from '@/lib/auth-context'
import {
    ArrowLeft, TrendingUp, TrendingDown, Minus, Target, Calendar,
    RefreshCw, Loader2, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface RankingResult {
    domain: string
    checked_at: string
    results: Record<string, Record<string, {
        found: boolean
        position: number | null
        url: string
        title: string
    }>>
    summary: {
        total_keywords: number
        found_count: number
        avg_position: number
    }
    alerts?: Array<{
        severity: string
        type: string
        keyword: string
        engine: string
        message: string
    }>
}

function LoadingScreen({ progress, status }: { progress: number; status: string }) {
    return (
        <div className="min-h-screen bg-[#141e27] flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <div className="relative inline-block mb-8">
                    <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="#40424b" strokeWidth="6" fill="none" />
                        <circle cx="50" cy="50" r="42"
                            stroke="url(#gradient)" strokeWidth="6" fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2.64 * progress} 264`}
                            className="transition-all duration-500 ease-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Target className="w-8 h-8 text-blue-400 mb-1 animate-pulse" />
                        <span className="text-2xl font-black text-white tabular-nums">{progress}%</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Checking rankings</h2>
                <p className="text-blue-300 text-sm mb-2">{status || 'Scanning search results'}</p>
                <p className="text-blue-400 text-xs">This may take a few minutes</p>
            </div>
        </div>
    )
}

export default function RankTrackingPage() {
    const params = useParams()
    const router = useRouter()
    const jobId = params.jobId as string

    const [results, setResults] = useState<RankingResult | null>(null)
    const [history, setHistory] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [selectedKeyword, setSelectedKeyword] = useState<string>('')

    useEffect(() => {
        let stopped = false
        const poll = async () => {
            try {
                const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/rank-tracking/${jobId}`)
                const data = await res.json()

                if (data.status === 'completed' && data.results) {
                    setResults(data.results)
                    // Fetch history
                    const historyRes = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/rank-tracking/${jobId}/history?days=30`)
                    const historyData = await historyRes.json()
                    setHistory(historyData)
                    setLoading(false)
                } else if (data.status === 'failed') {
                    setError(data.error || 'Tracking failed')
                    setLoading(false)
                } else {
                    setProgress(data.progress || 0)
                    setStatus(data.current_status || '')
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
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                    <CardTitle>Tracking Failed</CardTitle>
                    <CardDescription>{error || 'Unknown error'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/rank-tracking')} className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Button>
                </CardContent>
            </Card>
        </div>
    )

    const { summary, alerts } = results

    // Prepare chart data
    const chartData = selectedKeyword && history?.history
        ? history.history.find((h: any) => h.keyword === selectedKeyword)?.data.map((d: any) => ({
            date: new Date(d.date).toLocaleDateString(),
            position: d.position
        })) || []
        : []

    return (
        <div className="min-h-screen bg-[#F7F8FC]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
                    <Link href="/rank-tracking" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 truncate">Rank Tracking: {results.domain}</p>
                    </div>
                    <Button size="sm" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

                {/* Summary Stats */}
                <div className="grid sm:grid-cols-3 gap-4">
                    <Card className="shadow-sm border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-gray-900">{summary.found_count}/{summary.total_keywords}</p>
                                    <p className="text-sm text-gray-500">Keywords Ranking</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-gray-900">
                                        {summary.avg_position ? `#${Math.round(summary.avg_position)}` : 'N/A'}
                                    </p>
                                    <p className="text-sm text-gray-500">Avg Position</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-gray-100">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {new Date(results.checked_at).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">Last Checked</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts */}
                {alerts && alerts.length > 0 && (
                    <Card className="shadow-sm border-yellow-200 bg-yellow-50/30">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                Ranking Alerts
                                <Badge variant="warning" className="ml-auto">{alerts.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {alerts.map((alert, i) => (
                                <div key={i} className={`p-3 rounded-lg border ${alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                                        alert.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                                            alert.severity === 'positive' ? 'bg-green-50 border-green-200' :
                                                'bg-blue-50 border-blue-200'
                                    }`}>
                                    <div className="flex items-start gap-2">
                                        <Badge variant={alert.severity === 'positive' ? 'success' : 'destructive'} className="text-xs">
                                            {alert.engine}
                                        </Badge>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{alert.keyword}</p>
                                            <p className="text-xs text-gray-700">{alert.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Historical Chart */}
                {history && history.history.length > 0 && (
                    <Card className="shadow-sm border-gray-100">
                        <CardHeader>
                            <CardTitle className="text-base">Position History</CardTitle>
                            <CardDescription>
                                <select
                                    className="mt-2 px-3 py-2 border rounded-lg text-sm"
                                    value={selectedKeyword}
                                    onChange={(e) => setSelectedKeyword(e.target.value)}
                                >
                                    <option value="">Select keyword...</option>
                                    {history.history.map((h: any) => (
                                        <option key={`${h.keyword}_${h.engine}`} value={h.keyword}>
                                            {h.keyword} ({h.engine})
                                        </option>
                                    ))}
                                </select>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis reversed domain={[1, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="position" stroke="#3b82f6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center text-gray-500 py-12">Select a keyword to view chart</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Rankings Table */}
                <Card className="shadow-sm border-gray-100">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Current Rankings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {Object.entries(results.results).map(([keyword, engines]) => (
                            <div key={keyword} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <h3 className="font-semibold text-gray-900 mb-3">{keyword}</h3>
                                <div className="space-y-2">
                                    {Object.entries(engines).map(([engine, data]) => (
                                        <div key={engine} className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <Badge variant="outline" className="text-xs">{engine}</Badge>
                                                {data.found ? (
                                                    <>
                                                        <span className="text-2xl font-bold text-blue-600">#{data.position}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">{data.title}</p>
                                                            <p className="text-xs text-gray-500 truncate">{data.url}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-gray-500">Not found in top 100</span>
                                                )}
                                            </div>
                                            {data.found && 1 <= 10 && (
                                                <Badge variant="success">Top 10</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
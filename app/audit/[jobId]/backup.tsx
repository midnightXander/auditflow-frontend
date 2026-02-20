'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/badge'
import { CircularScore } from '@/components/circularScore'
import { ScoreBar } from '@/components/scoreBar'
import {
  ArrowLeft,
  Zap,
  Eye,
  Code,
  Search,
  Smartphone,
  Shield,
  Link as LinkIcon,
  Image,
  FileJson,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { WhiteLabelModal } from '@/components/whiteLabelModal'
import { useWhiteLabel } from '@/lib/whitelabel'
import { exportAuditPDF } from '@/lib/pdf-export'

interface AuditResults {
  url: string
  audit_date: string
  overall_score: number
  lighthouse: any
  broken_links: any
  image_optimization: any
  structured_data: any
  content_quality: any
  technical_seo: any
  security: any,
}

export default function AuditResultsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string
  
  const [results, setResults] = useState<AuditResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const pollResults = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/audit/${jobId}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch audit results')
        }

        const data = await response.json()
        
        if (data.status === 'completed' && data.results) {
          console.log(data.results)
          setResults(data.results)
          setLoading(false)
        } else if (data.status === 'failed') {
          setError(data.error || 'Audit failed')
          setLoading(false)
        } else {
          // Still running, update progress
          setProgress(data.progress || 0)
          setTimeout(pollResults, 2000)
        }
      } catch (err) {
        setError('Failed to load audit results')
        setLoading(false)
      }
    }

    pollResults()
  }, [jobId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Analyzing Your Website</CardTitle>
            <CardDescription className="text-center">
              This usually takes 30-60 seconds...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                <svg className="animate-spin w-32 h-32" viewBox="0 0 50 50">
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="#E5E7EB"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 1.26} 126`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0075FF" />
                      <stop offset="100%" stopColor="#8766FF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{progress}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-center text-sm text-gray-600">
              <p>✓ Running Lighthouse audit</p>
              <p>✓ Checking broken links</p>
              <p>✓ Analyzing images</p>
              <p>✓ Validating structured data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-error-600">Audit Failed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">{error || 'Unable to load results'}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const lighthouseCategories = results.lighthouse?.categories || {}
  const metrics = results.lighthouse?.metrics || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Re-audit
              </Button>
              <Button size="sm" 
            //   variant="gradient"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Card */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Audit Results</CardTitle>
                <CardDescription className="text-base">
                  <span className="font-mono text-sm">{results.url}</span>
                </CardDescription>
                <p className="text-xs text-gray-500 mt-1">
                  Audited on {new Date(results.audit_date).toLocaleString()}
                </p>
              </div>
              <CircularScore score={results.overall_score} size="lg" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(lighthouseCategories).map(([key, cat]: [string, any]) => (
                <div key={key} className="text-center p-4 rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold mb-1" style={{
                    color: cat.score >= 90 ? '#10B981' : cat.score >= 70 ? '#06B6D4' : cat.score >= 50 ? '#F59E0B' : '#EF4444'
                  }}>
                    {cat.score}
                  </div>
                  <div className="text-xs text-gray-600">{cat.title}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Lighthouse Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary-500"/>
                    Lighthouse Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(lighthouseCategories).map(([key, cat]: [string, any]) => (
                    <ScoreBar
                      key={key}
                      label={cat.title}
                      score={cat.score}
                      showBadge
                    />
                  ))}
                </CardContent>
              </Card>

              {/* Quick Wins */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Quick Wins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.image_optimization?.issues?.missing_alt_count > 0 && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Add Alt Text to Images</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {results.image_optimization.issues.missing_alt_count} images missing alt text
                          </p>
                        </div>
                      </div>
                    )}
                    {results.broken_links?.broken_count > 0 && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Fix Broken Links</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {results.broken_links.broken_count} broken links found
                          </p>
                        </div>
                      </div>
                    )}
                    {!results.structured_data?.has_json_ld && (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                        <FileJson className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Add Structured Data</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Implement JSON-LD for better search visibility
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Core Web Vitals */}
            {metrics.coreWebVitals && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary-500" />
                    Core Web Vitals
                  </CardTitle>
                  <CardDescription>
                    Critical metrics for user experience and SEO
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {metrics.coreWebVitals.lcp && (
                      <div className="text-center p-6 rounded-lg bg-gray-50">
                        <div className="text-3xl font-bold mb-2" style={{
                          color: metrics.coreWebVitals.lcp.rating === 'good' ? '#10B981' : 
                                 metrics.coreWebVitals.lcp.rating === 'needs-improvement' ? '#F59E0B' : '#EF4444'
                        }}>
                          {metrics.coreWebVitals.lcp.displayValue}
                        </div>
                        <div className="text-sm font-medium mb-1">Largest Contentful Paint</div>
                        <Badge variant={
                          metrics.coreWebVitals.lcp.rating === 'good' ? 'success' : 
                          metrics.coreWebVitals.lcp.rating === 'needs-improvement' ? 'warning' : 'destructive'
                        }>
                          {metrics.coreWebVitals.lcp.rating}
                        </Badge>
                      </div>
                    )}
                    {metrics.coreWebVitals.cls && (
                      <div className="text-center p-6 rounded-lg bg-gray-50">
                        <div className="text-3xl font-bold mb-2" style={{
                          color: metrics.coreWebVitals.cls.rating === 'good' ? '#10B981' : 
                                 metrics.coreWebVitals.cls.rating === 'needs-improvement' ? '#F59E0B' : '#EF4444'
                        }}>
                          {metrics.coreWebVitals.cls.displayValue}
                        </div>
                        <div className="text-sm font-medium mb-1">Cumulative Layout Shift</div>
                        <Badge variant={
                          metrics.coreWebVitals.cls.rating === 'good' ? 'success' : 
                          metrics.coreWebVitals.cls.rating === 'needs-improvement' ? 'warning' : 'destructive'
                        }>
                          {metrics.coreWebVitals.cls.rating}
                        </Badge>
                      </div>
                    )}
                    {metrics.coreWebVitals.tbt && (
                      <div className="text-center p-6 rounded-lg bg-gray-50">
                        <div className="text-3xl font-bold mb-2" style={{
                          color: metrics.coreWebVitals.tbt.rating === 'good' ? '#10B981' : 
                                 metrics.coreWebVitals.tbt.rating === 'needs-improvement' ? '#F59E0B' : '#EF4444'
                        }}>
                          {metrics.coreWebVitals.tbt.displayValue}
                        </div>
                        <div className="text-sm font-medium mb-1">Total Blocking Time</div>
                        <Badge variant={
                          metrics.coreWebVitals.tbt.rating === 'good' ? 'success' : 
                          metrics.coreWebVitals.tbt.rating === 'needs-improvement' ? 'warning' : 'destructive'
                        }>
                          {metrics.coreWebVitals.tbt.rating}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Optimization</CardTitle>
                <CardDescription>
                  Opportunities to improve page load speed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.lighthouse?.opportunities?.length > 0 ? (
                  <div className="space-y-4">
                    {results.lighthouse.opportunities.slice(0, 5).map((opp: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg border bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{opp.title}</h4>
                          {opp.savings?.ms && (
                            <Badge variant="warning">
                              Save {Math.round(opp.savings.ms)}ms
                            </Badge>
                          )}
                        </div>
                        {/* <p className="text-sm text-gray-600">{opp.description}</p> */}
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
                            ),
                            p: ({node, ...props}) => <p className="mb-2 text-sm text-gray-700" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            code: ({node, inline, className, children, ...props}: any) =>
                              inline ? <code className="bg-gray-100 px-1 rounded text-sm" {...props}>{children}</code> :
                              <code className="block p-2 bg-gray-100 rounded overflow-x-auto" {...props}>{children}</code>
                          }}
                        >
                          {opp.description || ''}
                        </ReactMarkdown>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No major optimization opportunities found!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Technical SEO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-sm">Title Tag</span>
                      {results.technical_seo?.title?.present ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-sm">Meta Description</span>
                      {results.technical_seo?.meta_description?.present ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-sm">Robots.txt</span>
                      {results.technical_seo?.robots_txt ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-sm">Sitemap.xml</span>
                      {results.technical_seo?.sitemap_xml ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileJson className="w-5 h-5" />
                    Structured Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Score</span>
                        <CircularScore score={results.structured_data?.score || 0} size="sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm">JSON-LD</span>
                        {results.structured_data?.has_json_ld ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm">Open Graph</span>
                        {results.structured_data?.has_open_graph ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <span className="text-sm">Twitter Card</span>
                        {results.structured_data?.has_twitter_card ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Image Optimization
                </CardTitle>
                <CardDescription>
                  Score: {results.image_optimization?.score || 0}/100
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-gray-50">
                      <div className="text-2xl font-bold mb-1">
                        {results.image_optimization?.total_images || 0}
                      </div>
                      <div className="text-xs text-gray-600">Total Images</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-red-50">
                      <div className="text-2xl font-bold mb-1 text-red-600">
                        {results.image_optimization?.issues?.missing_alt_count || 0}
                      </div>
                      <div className="text-xs text-gray-600">Missing Alt</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-yellow-50">
                      <div className="text-2xl font-bold mb-1 text-yellow-600">
                        {results.image_optimization?.issues?.missing_dimensions_count || 0}
                      </div>
                      <div className="text-xs text-gray-600">No Dimensions</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-blue-50">
                      <div className="text-2xl font-bold mb-1 text-blue-600">
                        {results.image_optimization?.issues?.old_format_count || 0}
                      </div>
                      <div className="text-xs text-gray-600">Old Formats</div>
                    </div>
                  </div>

                  {results.image_optimization?.recommendations?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recommendations:</h4>
                      {results.image_optimization.recommendations.map((rec: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Offscreen Images
                </CardTitle>
                <CardDescription>
                  Total: {results.lighthouse?.audits?.offscreen_images?.items.length || 0}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* iterate through the items list and display images  */}
                    {results.lighthouse?.audits?.offscreen_images?.items.map((item: any, key: number) => (
                      <div key={key} className="text-center px-4">
                        <img src={item.url} alt={item.url} className="mx-auto mb-2 max-h-32 object-contain" />
                        <div className="text-xs text-gray-600 mb-1">Size: {(item.totalBytes / 1024).toFixed(1)} KB</div>
                        <Badge variant="warning">
                          Wasted: {(item.wastedBytes / 1024).toFixed(1)} KB
                        </Badge>
                        <div>
                        Code Snippet : 
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          components={{
                            a: ({node, ...props}) => (
                              <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
                            ),
                            p: ({node, ...props}) => <p className="mb-2 text-sm text-gray-700" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                            em: ({node, ...props}) => <em className="italic" {...props} />,
                            code: ({node, inline, className, children, ...props}: any) =>
                              inline ? <code className="bg-gray-100 px-1 rounded text-sm" {...props}>{children}</code> :
                              <code className="block p-2 bg-gray-100 rounded overflow-x-auto" {...props}>{children}</code>
                          }}
                        >
                          {item.node.snippet || 'no code snippet'}
                        </ReactMarkdown>
                      </div>
                      </div>
                      
                    ))}
                  </div>

                  
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Content Quality
                </CardTitle>
                <CardDescription>
                  Score: {results.content_quality?.score || 0}/100 ({results.content_quality?.status})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-gray-50">
                    <div className="text-2xl font-bold mb-1">
                      {results.content_quality?.word_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Words</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-50">
                    <div className="text-2xl font-bold mb-1">
                      {results.content_quality?.content_to_code_ratio?.toFixed(1) || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Content Ratio</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-50">
                    <div className="text-sm font-bold mb-1">
                      {results.content_quality?.reading_level || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600">Reading Level</div>
                  </div>
                </div>

                {results.content_quality?.recommendations?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recommendations:</h4>
                    {results.content_quality.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">HTTPS</div>
                        <div className="text-xs text-gray-600">Secure connection</div>
                      </div>
                    </div>
                    {results.security?.https ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">HSTS Header</div>
                        <div className="text-xs text-gray-600">Force HTTPS</div>
                      </div>
                    </div>
                    {results.security?.security_headers?.strict_transport_security ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">X-Frame-Options</div>
                        <div className="text-xs text-gray-600">Clickjacking protection</div>
                      </div>
                    </div>
                    {results.security?.security_headers?.x_frame_options ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>

                  {results.broken_links && (
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <LinkIcon className="w-5 h-5" />
                        <div>
                          <div className="font-medium text-sm">Broken Links</div>
                          <div className="text-xs text-gray-600">
                            {results.broken_links.broken_count} of {results.broken_links.total_checked} checked
                          </div>
                        </div>
                      </div>
                      {results.broken_links.status === 'pass' ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : results.broken_links.status === 'warning' ? (
                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
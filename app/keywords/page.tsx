'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import {
  KeySquare,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react'

export default function KeywordAnalysisPage() {
  const { user } = useAuth()
  const [url, setUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  if (!user) {
    router.push('/signin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!url) {
      setError('Please enter your website URL')
      return
    }

    if (!keyword) {
      setError('Please enter a keyword to analyze')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/keywords`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: url.startsWith('http') ? url : `https://${url}`,
            seed_keyword: keyword,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to analyze keywords')
      }

      const data = await response.json()
      setSuccess('Analysis started!')
      
      setTimeout(() => {
        router.push(`/keywords/${data.job_id}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze keywords')
      setIsLoading(false)
    }
  }

  const suggestedKeywords = [
    'SEO tools',
    'website optimization',
    'digital marketing',
    'keyword research',
    'link building',
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 h-screen overflow-y-auto lg:ml-0 pt-16 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <KeySquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Keyword Analysis</h1>
            </div>
            <p className="text-gray-600">Discover keywords and opportunities for your website content.</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Analyze keywords</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <Input
                  type="text"
                  placeholder="example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seed Keyword</label>
                <Input
                  type="text"
                  placeholder="Enter a keyword to analyze..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700">{success}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <KeySquare className="w-4 h-4 mr-2" />
                    Analyze Keywords
                  </>
                )}
              </Button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-4">Analysis includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Related keywords',
                  'Search volume data',
                  'Keyword difficulty',
                  'CPC analysis',
                  'Content opportunities',
                  'Competitor keywords',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Keywords */}
          <div className="bg-pink-50 rounded-xl border border-pink-200 p-6">
            <h3 className="font-semibold text-pink-900 mb-3">💡 Try these seed keywords:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setKeyword(kw)}
                  className="px-3 py-2 bg-white border border-pink-200 rounded-lg text-sm text-pink-700 hover:bg-pink-50 transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

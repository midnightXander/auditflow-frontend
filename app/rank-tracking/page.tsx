'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader,
  Plus,
  X,
} from 'lucide-react'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function RankTrackingPage() {
  const { user } = useAuth()
  const [website, setWebsite] = useState('')
  const [keywords, setKeywords] = useState([''])
  const [country, setCountry] = useState('US')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  if (!user) {
    router.push('/signin')
    return null
  }

  const handleAddKeyword = () => {
    if (keywords.length < 50) {
      setKeywords([...keywords, ''])
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords]
    newKeywords[index] = value
    setKeywords(newKeywords)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!website) {
      setError('Please enter your website URL')
      return
    }

    const validKeywords = keywords.filter((k) => k.trim())
    if (validKeywords.length === 0) {
      setError('Please add at least one keyword')
      return
    }

    setIsLoading(true)

    try {
      // API call would go here
      setSuccess(`Tracking ${validKeywords.length} keywords for ${website}`)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking')
      setIsLoading(false)
    }
  }

  const filledKeywords = keywords.filter((k) => k.trim()).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 h-screen overflow-y-auto lg:ml-0 pt-16 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Rank Tracking</h1>
            </div>
            <p className="text-gray-600">Track your keyword rankings in search engines over time.</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add keywords to track</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <Input
                  type="text"
                  placeholder="example.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="US">🇺🇸 United States</option>
                  <option value="GB">🇬🇧 United Kingdom</option>
                  <option value="DE">🇩🇪 Germany</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="AU">🇦🇺 Australia</option>
                </select>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords to track ({filledKeywords}/50)
                </label>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {keywords.map((keyword, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder={`Keyword ${index + 1}`}
                        value={keyword}
                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      {keywords.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(index)}
                          className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {keywords.length < 50 && (
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="mt-3 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add keyword
                  </button>
                )}
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
                    Starting Tracking...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Start Tracking
                  </>
                )}
              </Button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-4">Tracking features:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Daily rank updates',
                  'Historical data',
                  'Search volume data',
                  'Keyword difficulty',
                  'SERP features',
                  'Competitor tracking',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <h3 className="font-semibold text-green-900 mb-2">📈 Pro Tip</h3>
            <p className="text-sm text-green-800">
              Track 15-20 keywords to start. Focus on keywords with high commercial intent and search volume for better ROI.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchWithAuth } from '@/lib/auth-context'
import {
  Trello,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader,
  X,
} from 'lucide-react'

export default function CompetitorComparePage() {
  const [primaryUrl, setPrimaryUrl] = useState('')
  const [competitors, setCompetitors] = useState(['', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleAddCompetitor = () => {
    if (competitors.length < 5) {
      setCompetitors([...competitors, ''])
    }
  }

  const handleRemoveCompetitor = (index: number) => {
    setCompetitors(competitors.filter((_, i) => i !== index))
  }

  const handleCompetitorChange = (index: number, value: string) => {
    const newCompetitors = [...competitors]
    newCompetitors[index] = value
    setCompetitors(newCompetitors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!primaryUrl) {
      setError('Please enter a website URL')
      return
    }

    const validCompetitors = competitors.filter((c) => c.trim())
    if (validCompetitors.length === 0) {
      setError('Please enter at least one competitor URL')
      return
    }

    if (validCompetitors.length < 2) {
      setError('Please enter at least two competitor URLs')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/compare`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target_url: primaryUrl.startsWith('http') ? primaryUrl : `https://${primaryUrl}`,
            competitor_urls: validCompetitors.map((c) =>
              c.startsWith('http') ? c : `https://${c}`
            ),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to start comparison')
      }

      const data = await response.json()
      setSuccess('Comparison started!')
      
      setTimeout(() => {
        router.push(`/compare/${data.job_id}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start comparison')
      setIsLoading(false)
    }
  }

  const filledCompetitors = competitors.filter((c) => c.trim()).length

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 h-screen overflow-y-auto lg:ml-0 pt-16  px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trello className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Competitor Compare</h1>
            </div>
            <p className="text-gray-600">Compare your website performance against your competitors.</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Setup comparison</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Primary URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Website URL</label>
                <Input
                  type="text"
                  placeholder="example.com"
                  value={primaryUrl}
                  onChange={(e) => setPrimaryUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Competitor URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competitor URLs ({filledCompetitors}/5)
                </label>
                <div className="space-y-3">
                  {competitors.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder={`Competitor ${index + 1} (optional)`}
                        value={url}
                        onChange={(e) => handleCompetitorChange(index, e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      {competitors.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCompetitor(index)}
                          className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {competitors.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddCompetitor}
                    className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Add another competitor
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
                    Starting Comparison...
                  </>
                ) : (
                  <>
                    <Trello className="w-4 h-4 mr-2" />
                    Start Comparison
                  </>
                )}
              </Button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-4">Comparison metrics:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Performance scores',
                  'SEO rankings',
                  'Page speed',
                  'Lighthouse scores',
                  'Mobile friendliness',
                  'Security ratings',
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
          <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
            <h3 className="font-semibold text-purple-900 mb-2">📊 Comparison Report</h3>
            <p className="text-sm text-purple-800">
              Get a detailed side-by-side comparison of your website versus your competitors. Identify where you excel and where you need improvement.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

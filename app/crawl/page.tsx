'use client'

// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Deep Crawl - OUTAudits',
//   description: 'Crawl and analyze up to 500 pages of your website. Discover broken links, duplicate content, and technical SEO issues.',
// }

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import { useWhiteLabel, WhiteLabelConfig } from '@/lib/whitelabel'
import {
  Globe,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader,
  Settings,
} from 'lucide-react'

export default function DeepCrawlPage() {
  const { user } = useAuth()
  const [url, setUrl] = useState('')
  const [clientName, setClientName] = useState('')
  const { config, setConfig } = useWhiteLabel()
  const [form, setForm] = useState<WhiteLabelConfig>({ ...config })
  const [maxPages, setMaxPages] = useState('50')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [advancedSettings, setAdvancedSettings] = useState(false)
  const router = useRouter()

  if (!user) {
    router.push('/signin')
    return null
  }

  const handleInputChange = (field: keyof WhiteLabelConfig, value: string) => {
      setClientName(value)
      setForm((prev) => ({ ...prev, [field]: value }))
      setConfig({ ...form, [field]: value })
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!url) {
      setError('Please enter a valid URL')
      return
    }

    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/crawl`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: url.startsWith('http') ? url : `https://${url}`,
            max_pages: parseInt(maxPages),
            client_name: clientName || undefined 
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to start crawl')
      }

      const data = await response.json()
      setSuccess('Deep crawl started!')
      
      setTimeout(() => {
        router.push(`/crawl/${data.job_id}`)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start crawl')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 h-screen overflow-y-auto lg:ml-0 pt-16  px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Deep Crawl</h1>
            </div>
            <p className="text-gray-600">Crawl your entire website and analyze every page for issues.</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Configure your crawl</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client/Business Name</label>
                <Input
                  type="text"
                  placeholder="Enter client/business name"
                  value={form.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {/* URL Input */}
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

              {/* Max Pages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum pages to crawl</label>
                <Input
                  type="number"
                  min="1"
                  max="500"
                  value={maxPages}
                  onChange={(e) => setMaxPages(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Limit crawl scope to save credits</p>
              </div>

              {/* Advanced Settings */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setAdvancedSettings(!advancedSettings)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <Settings className="w-4 h-4" />
                  Advanced Settings
                </button>

                {advancedSettings && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <input type="checkbox" id="follow-redirects" className="rounded" defaultChecked />
                      <label htmlFor="follow-redirects" className="text-sm text-gray-700">
                        Follow redirects
                      </label>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <input type="checkbox" id="check-external" className="rounded" />
                      <label htmlFor="check-external" className="text-sm text-gray-700">
                        Check external links
                      </label>
                    </div>
                  </div>
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
                    Starting Crawl...
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 mr-2" />
                    Start Deep Crawl
                  </>
                )}
              </Button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-4">Crawl analysis includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Broken links detection',
                  'SEO metadata analysis',
                  'Page structure mapping',
                  'Duplicate content detection',
                  'Internal linking analysis',
                  'Page speed metrics',
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
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
            <p className="text-sm text-blue-800">
              Crawling fewer pages uses fewer credits. Start with 50-100 pages to get an overview of your site.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

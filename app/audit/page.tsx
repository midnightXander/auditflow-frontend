'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import { useWhiteLabel, WhiteLabelConfig } from '@/lib/whitelabel'
import {
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader,
} from 'lucide-react'


export default function WebsiteAuditPage() {
  const { user } = useAuth()
  const [url, setUrl] = useState('')
  const [clientName, setClientName] = useState('')
  const { config, setConfig } = useWhiteLabel()
  const [form, setForm] = useState<WhiteLabelConfig>({ ...config })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // Redirect to login if not authenticated
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

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`)
    } catch {
      setError('Please enter a valid URL (e.g., example.com or https://example.com)')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/audit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.startsWith('http') ? url : `https://${url}`, client_name: clientName || undefined }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to start audit')
      }

      const data = await response.json()
      setSuccess('Audit started! Redirecting to results...')
      
      if (data.job_id) {
        router.push(`/audit/${data.job_id}`)
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start audit')
      setIsLoading(false)
    }
  }

  const exampleUrls = [
    'google.com',
    'github.com',
    'vercel.com',
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 h-screen overflow-y-auto lg:ml-0 pt-16 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Website Audit</h1>
            </div>
            <p className="text-gray-600">Analyze your website performance, SEO, and accessibility in minutes.</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Enter website URL</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client/Business Name</label>
                <Input
                  type="text"
                  placeholder="Enter client/business name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="example.com or https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                    className="pr-12"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
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
                    Starting Audit...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Audit
                  </>
                )}
              </Button>
            </form>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-4">Audit includes:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Performance analysis',
                  'SEO optimization',
                  'Accessibility check',
                  'Best practices',
                  'Security audit',
                  'Mobile compatibility',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Try with an example:</p>
            <div className="flex flex-wrap gap-2">
              {exampleUrls.map((exampleUrl) => (
                <button
                  key={exampleUrl}
                  onClick={() => setUrl(exampleUrl)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {exampleUrl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

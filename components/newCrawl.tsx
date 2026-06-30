'use client'


import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import { useProtectedRoute } from '@/lib/protected-route'
import { useWhiteLabel, WhiteLabelConfig } from '@/lib/whitelabel'
import { toast } from 'sonner' 
import {
  CheckCircle,
  AlertCircle,
  Loader,
  Globe,
  UserRound, Settings
} from 'lucide-react'
import DashboardLayout from '@/components/dashboardLayout'
interface NewCrawlModalProps {
  onClose: () => void
}

export default function NewCrawlModal({ onClose }: NewCrawlModalProps) {
  const { user } = useAuth()
  const [url, setUrl] = useState('')
  const [clientName, setClientName] = useState('')
  const { config, setConfig } = useWhiteLabel()
  const [form, setForm] = useState<WhiteLabelConfig>({ ...config })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [maxPages, setMaxPages] = useState('50')
  const [advancedSettings, setAdvancedSettings] = useState(false)
  const router = useRouter()


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
        `${process.env.NEXT_PUBLIC_API_URL}/crawl`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url: url.startsWith('http') ? url : `https://${url}`,
            max_pages: parseInt(maxPages),
            client_name: clientName || undefined }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to start audit')
      }

      const data = await response.json()
      setSuccess('Crawl started! Redirecting to results...')
      
      if (data.job_id) {
        //router.push(`/audit/${data.job_id}`)
        toast.success("Crawl started! Check Notifications for results.")
        resetCrawlFlow()
        onClose()
        
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start audit')
      setIsLoading(false)
    }
  }

  const resetCrawlFlow = () => {
    // setShowNewAudit(false);
    setUrl('');
    setIsLoading(false);
    onClose()
  };

  return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={resetCrawlFlow} />
        <div className="relative w-full max-w-md bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
            {!isLoading && (
            <>
                <h3 className="text-lg font-semibold" style={{ color: '#141e27' }}>Deep Crawl</h3>
                <p className="text-sm mt-1" style={{ color: '#44576a' }}>Crawl your entire website and analyze every page for issues.</p>
                <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed' }}>
                <UserRound className="w-4 h-4 flex-shrink-0" style={{ color: '#8896a4' }} />
                <input
                    type="text" placeholder="CLient/Busiess Name" value={clientName} onChange={(e) => setClientName(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full" style={{ color: '#141e27' }}
                    autoFocus
                />
                </div>
                <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed' }}>
                <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#8896a4' }} />
                <input
                    type="text" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full" style={{ color: '#141e27' }}
                    autoFocus
                />
                </div>
                
                <div  className=''>
                <label className="block text-sm font-medium text-gray-700 my-2">Maximum pages to crawl </label>
                <input
                className="bg-transparent border-none outline-none text-sm w-full" style={{ color: '#141e27' }}
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
              <div className="pt-6">
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

                <div className="flex items-center gap-2 mt-4">
                <button onClick={resetCrawlFlow} className="px-4 py-2.5 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>Cancel</button>
                <button onClick={handleSubmit} disabled={!url} className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#00a4c6' }}>
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
                </button>
                </div>
            </>
            )}

            {isLoading && (
            <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full border-3 border-[#e4e9ed] border-t-[#00a4c6] animate-spin mx-auto" />
                <p className="text-sm font-medium mt-4" style={{ color: '#141e27' }}>Analyzing {url}...</p>
                <p className="text-xs mt-1" style={{ color: '#8896a4' }}>Crawling pages, checking technical issues, scoring performance</p>
            </div>
            )}
            <div className="bg-blue-50 rounded border border-blue-200 my-4 p-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
            <p className="text-sm text-blue-800">
              Crawling fewer pages uses fewer credits. Start with 50-100 pages to get an overview of your site.
            </p>
          </div>
            
        </div>
        </div>
  )
}

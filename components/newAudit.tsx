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
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader,
  Globe,
  UserRound
  
} from 'lucide-react'
import DashboardLayout from '@/components/dashboardLayout'
interface NewAuditModalProps {
  onClose: () => void
}

export default function NewAuditModal({ onClose }: NewAuditModalProps) {
  const { user } = useAuth()
  const { isProtected } = useProtectedRoute()
  const [url, setUrl] = useState('')
  const [clientName, setClientName] = useState('')
  const { config, setConfig } = useWhiteLabel()
  const [form, setForm] = useState<WhiteLabelConfig>({ ...config })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
        //router.push(`/audit/${data.job_id}`)
        toast.success("Audit started")
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start audit')
      setIsLoading(false)
    }
  }

  const resetAuditFlow = () => {
    // setShowNewAudit(false);
    setUrl('');
    setIsLoading(false);
    onClose()
  };

  return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={resetAuditFlow} />
        <div className="relative w-full max-w-md bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
            {!isLoading && (
            <>
                <h3 className="text-lg font-semibold" style={{ color: '#141e27' }}>Start New Audit</h3>
                <p className="text-sm mt-1" style={{ color: '#44576a' }}>Enter a URL to generate a comprehensive SEO audit report.</p>
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
                <div className="flex items-center gap-2 mt-4">
                <button onClick={resetAuditFlow} className="px-4 py-2.5 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>Cancel</button>
                <button onClick={handleSubmit} disabled={!url} className="px-5 py-2.5 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#00a4c6' }}>Start Audit</button>
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
            {/* {auditComplete && (
            <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#f0fdf4' }}>
                <CheckCircle2 className="w-7 h-7 text-[#34d399]" />
                </div>
                <p className="text-lg font-semibold mt-4" style={{ color: '#141e27' }}>Audit Complete!</p>
                <p className="text-sm mt-1" style={{ color: '#44576a' }}>Overall Score: <strong style={{ color: '#00a4c6' }}>78/100</strong></p>
                <div className="flex items-center gap-2 mt-5">
                <button onClick={resetAuditFlow} className="px-4 py-2.5 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>Close</button>
                <button onClick={() => { resetAuditFlow(); setSelectedAudit(allAudits[0]); }} className="px-5 py-2.5 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90" style={{ backgroundColor: '#00a4c6' }}>View Results</button>
                </div>
            </div>
            )} */}
        </div>
        </div>
  )
}

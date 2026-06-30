'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { useWhiteLabel } from '@/lib/whitelabel'
import { Bell, Settings2,Settings, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardHeader() {
  const { user } = useAuth()
  const { config } = useWhiteLabel()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!panelRef.current) return
      if (open && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  useEffect(() => {
    if (!open) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, { method: 'GET' })
        if (!res.ok) return
        const data = await res.json()
        if (mounted) setNotifications(data.notifications || [])
      } catch (e) {
        console.error('Failed to load notifications', e)
      }
    })()
    return () => { mounted = false }
  }, [open])

  const creditsDisplay = user ? (user.plan === 'pro' || user.plan === 'agency' ? 'Unlimited' : user.credits_remaining) : '-'

  return (
    <div className="w-full bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
              <img src={config.agencyLogo || user?.agency_logo || '/logo.svg'} alt="Agency logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{config.agencyName || user?.agency_name || 'OUTAudits'}</div>
              <div className="text-xs text-gray-500 truncate">{config.agencyUrl || user?.agency_url}</div>
            </div>
          </Link>
        </div>
        

        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden sm:flex items-center bg-gray-50 border border-gray-100 rounded-full px-3 py-1 gap-2">
            <CreditCard className="w-4 h-4 text-amber-500" />
            <div className="text-xs text-gray-700">Credits</div>
            <div className="text-sm font-medium text-gray-900">{creditsDisplay}</div>
          </div>

          <div className="relative" ref={panelRef}>
            <button aria-label="Notifications" onClick={() => setOpen(v => !v)} className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold">Notifications</div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} className="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{n.title || n.message}</div>
                        <div className="text-xs text-gray-500 mt-1">{n.subtitle || new Date(n.created_at).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-3 py-2 border-t border-gray-100 text-center">
                  <Link href="/notifications" className="text-sm text-primary-600">View all</Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/dashboard/settings">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <Settings2 className="w-4 h-4 mr-2" /> Settings
            </Button>
          </Link>

          <Link href="/account">
            <div className="sm:hidden inline-flex items-center p-2 rounded-md hover:bg-gray-100">
              <Settings className="w-5 h-5 text-gray-700" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

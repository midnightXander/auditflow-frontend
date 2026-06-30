'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import DashboardHeader from '@/components/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ActivateTrialPage() {
  const { user } = useAuth()
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const activateTrial = async (planTier: string) => {
    if (!user) {
      router.push('/signin')
      return
    }
    setProcessing(true)
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/billing/activate-trial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_tier: planTier })
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.detail || 'Failed to activate trial')
        return
      }
      toast.success('Trial activated')
      // refresh
      
      if (typeof window !== "undefined") {
        console.log("trial")
        window.location.reload()
    }
    } catch (e) {
      console.error(e)
      toast.error('Failed to activate trial')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Activate Free Trial</h1>
            <div>
              <Link href="/account/billing">
                <Button variant="ghost" size="sm">Back</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold">Available Trials</h3>
                  <p className="text-sm text-gray-500 mt-2">Activate a free trial for a specific plan. Trials are limited to one per account.</p>

                  <div className="mt-4 space-y-3">
                    {[
                      { tier: 'pro', label: 'Pro - $9/mo', desc: 'All Pro features for 14 days' },
                      { tier: 'agency', label: 'Agency - $99/mo', desc: 'Full agency features for 14 days' },
                    ].map((p) => (
                      <div key={p.tier} className="flex items-center justify-between p-3 border rounded-lg border-gray-200">
                        <div>
                          <div className="font-semibold">{p.label}</div>
                          <div className="text-xs text-gray-500">{p.desc}</div>
                        </div>
                        <div>
                          <Button disabled={processing} onClick={() => activateTrial(p.tier)} size="sm">Activate</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold">Trial Terms</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-2">
                    <li>One trial per account</li>
                    <li>14-day trial period</li>
                    <li>Cancel anytime before trial ends to avoid charges</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold">Need help?</h3>
                  <p className="text-sm text-gray-600">Contact sales if you have questions about trials or billing.</p>
                  <div className="mt-4">
                    <Link href="/contact">
                      <Button variant="outline" size="sm">Contact Sales</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold">Your account</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardHeader from '@/components/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { formatDate } from '@/lib/utils'
import { Check, CreditCard, Truck, X } from 'lucide-react'
import DashboardLayout from '@/components/dashboardLayout'

export default function BillingManagementPage() {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const resSub = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/billing/subscription`)
      if (resSub.ok) {
        const sub = await resSub.json()
        setSubscriptions([sub])
      }
      const resInv = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/billing/invoices`)
      if (resInv.ok) {
        const inv = await resInv.json()
        setInvoices(inv.invoices || [])
      }
    } catch (e) {
      console.error('Failed to fetch billing data', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
    <div className="flex min-h-screen bg-gray-50">
      
      <div className="flex-1">
        
        <main className="p-6 max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Billing & Subscription</h1>
            <div className="flex items-center gap-3">
              <Link href="/account/billing/portal">
                <Button variant="outline" size="sm">Open Billing Portal</Button>
              </Link>
              <Link href="/account/billing/trial">
                <Button size="sm">Activate Free Trial</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold">Active Subscription</h3>
                  {loading ? (
                    <p className="text-sm text-gray-500 mt-2">Loading...</p>
                  ) : subscriptions.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-2">No active subscription</p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {subscriptions.map((s, i) => (
                        <div key={i} className="flex items-start justify-between p-4 border rounded-lg border-gray-200">
                          <div>
                            <div className="text-sm text-gray-500">Plan</div>
                            <div className="font-semibold text-gray-900">{s.plan || 'Pro'}</div>
                            <div className="text-xs text-gray-500 mt-1">Next billing: {formatDate(s.next_billing_date)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Status</div>
                            <div className="font-semibold text-green-600 flex items-center gap-2"><Check className="w-4 h-4" /> Active</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold">Recent Invoices</h3>
                  {invoices.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-2">No invoices found</p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {invoices.map((inv:any, i:number) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg border-gray-200">
                          <div>
                            <div className="text-sm font-medium">Invoice #{inv.id}</div>
                            <div className="text-xs text-gray-500">{formatDate(inv.date)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">${inv.amount}</div>
                            <Link href={inv.pdf_url} target="_blank" className="text-sm text-primary-600">Download</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            <div className="space-y-4">
              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold">Billing Summary</h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Current Plan</div>
                      <div className="font-semibold">{subscriptions[0]?.plan || 'Free'}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Next Invoice</div>
                      <div className="font-semibold">{invoices[0] ? `$${invoices[0].amount}` : '-'}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Billing email</div>
                      <div className="font-semibold">{user?.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h3 className="text-lg font-semibold">Payment Method</h3>
                  <div className="mt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Visa •••• 4242</div>
                        <div className="text-xs text-gray-400">Expires 10/2026</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link href="/account/billing/portal">
                        <Button variant="outline" size="sm">Manage Payment Methods</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
    </DashboardLayout>
  )
}

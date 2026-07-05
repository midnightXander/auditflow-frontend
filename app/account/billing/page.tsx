'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { formatDate, formatDateDistanceToNow } from '@/lib/utils'
import { Check, Download, ArrowUpRight, ArrowDownRight, CreditCard, Calendar, TrendingUp, FileText } from 'lucide-react'
import DashboardLayout from '@/components/dashboardLayout'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Subscription {
  plan: string
  status: string
  credits_remaining?: number
  next_billing_date?: string
  current_period_start?: string
  current_period_end?: string
}

interface Invoice {
  id: string
  amount: number
  date: string
  pdf_url?: string
  status?: string
}

export default function BillingManagementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSpent: 0,
    invoiceCount: 0,
  })

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const resSub = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/billing/subscription`)
      if (resSub.ok) {
        const sub = await resSub.json()
        setSubscription(sub)
      }
      const resInv = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/billing/invoices`)
      if (resInv.ok) {
        const inv = await resInv.json()
        const invoiceList = inv.invoices || []
        setInvoices(invoiceList)
        setStats({
          totalSpent: invoiceList.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
          invoiceCount: invoiceList.length,
        })
      }
    } catch (e) {
      console.error('Failed to fetch billing data', e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planTier: string) => {
      if (!user || currentPlan === planTier) {
        // Redirect to login
        router.push('/signin');
        return;
      }
  
      setLoading(true);
      try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/billing/checkout-link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan_tier: planTier })
        });
  
        if (!response.ok) {
          const error = await response.json();
          toast.error(`Error: ${error.detail}`,{ position: "top-center"  });
          return;
        }
  
        const data = await response.json();
        toast.success("You are being redirected to checkout")
        // Redirect to Whop checkout
        router.push(data.checkout_url);
      } catch (error) {
        console.error('Error creating checkout:', error);
        alert('Failed to create checkout. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  const planDetails: Record<string, { color: string; features: string[]; price: number }> = {
    free: {
      color: '#44576a',
      features: [
        '5 audits per month',
        'Up to 100 pages crawl',
        'Basic SEO analysis',
        'Community support',
      ],
      price: 0,
    },
    pro: {
      color: '#00a4c6',
      features: [
        'Unlimited audits',
        'Unlimited crawls',
        'Competitor analysis',
        'Rank tracking (500+ keywords)',
        'Lead capture widget',
        'API access',
        'Email support',
        'White-label options',
      ],
      price: 13,
    },
    agency: {
      color: '#0dd3b6',
      features: [
        'Everything in Pro',
        'Unlimited team members',
        'Custom integrations',
        'Dedicated account manager',
        'Priority support',
        'Advanced white-label',
        'API rate limit increased',
      ],
      price: 99,
    },
  }

  const currentPlan = (subscription?.plan?.toLowerCase() || 'free') as keyof typeof planDetails
  const planConfig = planDetails[currentPlan] || planDetails.free
  const maxCredits = user?.plan === 'free' ? 10 : user?.plan === 'pro' ? 100 : user?.plan === 'agency' ? 1000 : 10
  const creditsRemaining = user?.credits_remaining || 0

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-8" style={{ backgroundColor: '#ffffff' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 style={{ fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 700, color: '#141e27' }}>
              Billing & Subscription
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#44576a' }}>
              Manage your subscription, view invoices, and track usage
            </p>
          </div>
          <Link href="/start-trial">
            <button
              className="px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#00a4c6', color: '#ffffff' }}
            >
              Activate Free Trial
            </button>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Plan */}
          <div
            className="p-5 rounded border transition-all duration-300"
            style={{ backgroundColor: '#f5f7fa', borderColor: '#e4e9ed' }}
          >
            <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#44576a' }}>
              Current Plan
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-2xl font-bold capitalize mb-1"
                  style={{ color: planConfig.color }}
                >
                  {currentPlan}
                </p>
                <p className="text-xs" style={{ color: '#44576a' }}>
                  {subscription?.status || 'active'}
                </p>
              </div>
              {currentPlan !== 'free' && (
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#44576a' }}>Monthly</p>
                  <p className="text-lg font-bold" style={{ color: '#141e27' }}>
                    ${planConfig.price}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Credits Remaining */}
          <div
            className="p-5 rounded border transition-all duration-300"
            style={{ backgroundColor: '#f5f7fa', borderColor: '#e4e9ed' }}
          >
            <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#44576a' }}>
              Credits Remaining
            </p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold" style={{ color: '#141e27' }}>
                  {creditsRemaining}
                </p>
                <p className="text-xs" style={{ color: '#44576a' }}>
                  of {maxCredits} total
                </p>
              </div>
              <CreditCard className="w-5 h-5" style={{ color: '#00a4c6' }} />
            </div>
            <div className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e4e9ed' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(creditsRemaining / maxCredits) * 100}%`,
                  backgroundColor: creditsRemaining > maxCredits * 0.3 ? '#00a4c6' : '#ef4444',
                }}
              />
            </div>
          </div>

          {/* Next Payment Date */}
          <div
            className="p-5 rounded border transition-all duration-300"
            style={{ backgroundColor: '#f5f7fa', borderColor: '#e4e9ed' }}
          >
            <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#44576a' }}>
              Next Payment Date
            </p>
            <div className="flex items-end justify-between">
              <div>
                {subscription?.next_billing_date ? (
                  <>
                    <p className="text-sm font-bold" style={{ color: '#141e27' }}>
                      {formatDate(subscription.next_billing_date)}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#44576a' }}>
                      {formatDateDistanceToNow(subscription.next_billing_date)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm" style={{ color: '#44576a' }}>No active subscription</p>
                )}
              </div>
              <Calendar className="w-5 h-5" style={{ color: '#00a4c6' }} />
            </div>
          </div>

          {/* Total Spend & Invoice Count */}
          <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
            <div
              className="p-5 rounded border transition-all duration-300"
              style={{ backgroundColor: '#f5f7fa', borderColor: '#e4e9ed' }}
            >
              <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#44576a' }}>
                Total Spent
              </p>
              <p className="text-xl font-bold" style={{ color: '#141e27' }}>
                ${stats.totalSpent.toFixed(2)}
              </p>
            </div>
            <div
              className="p-5 rounded border transition-all duration-300"
              style={{ backgroundColor: '#f5f7fa', borderColor: '#e4e9ed' }}
            >
              <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: '#44576a' }}>
                Invoices
              </p>
              <Link href="#invoices">
                <button className="text-xl font-bold hover:underline" style={{ color: '#00a4c6' }}>
                  {stats.invoiceCount}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Details - Left Column */}
          <div
            className="lg:col-span-2 p-6 rounded border"
            style={{ backgroundColor: '#ffffff', borderColor: '#e4e9ed' }}
          >
            <h2 className="text-lg font-bold mb-6" style={{ color: '#141e27' }}>
              Plan Details & Features
            </h2>

            {loading ? (
              <p style={{ color: '#44576a' }}>Loading subscription details...</p>
            ) : (
              <div className="space-y-6">
                {/* Current Plan Section */}
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#44576a' }}>
                    Your Current Plan
                  </p>
                  <div
                    className="p-4 rounded border mb-4"
                    style={{
                      backgroundColor: `${planConfig.color}15`,
                      borderColor: planConfig.color,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold capitalize" style={{ color: planConfig.color }}>
                          {currentPlan} Plan
                        </p>
                        <p className="text-sm mt-1" style={{ color: '#44576a' }}>
                          {subscription?.status === 'active' && 'Renewal: ' + formatDate(subscription?.next_billing_date || '')}
                        </p>
                      </div>
                      {subscription?.status === 'active' && (
                        <Check className="w-6 h-6" style={{ color: '#34d399' }} />
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {planConfig.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#34d399' }} />
                        <span className="text-sm" style={{ color: '#141e27' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Management */}
                <div
                  className="p-4 rounded border"
                  style={{ backgroundColor: '#f5f7fa', borderColor: '#e4e9ed' }}
                >
                  <p className="text-sm font-semibold mb-3" style={{ color: '#141e27' }}>
                    Manage Your Plan
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {currentPlan === 'free' && (
                      // <Link href="/dashboard/billing" className="flex-1">
                        <button
                         onClick={()=>{handleUpgrade('pro')}}
                          className="w-full px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 hover:opacity-90"
                          style={{ backgroundColor: '#00a4c6', color: '#ffffff' }}
                        >
                          Upgrade to Pro
                        </button>
                      // </Link>
                    )}
                    {currentPlan === 'pro' && (
                      <a href="mailto:sales@outaudits.com" className="flex-1">
                        <button
                          className="w-full px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 hover:opacity-90"
                          style={{ backgroundColor: '#0dd3b6', color: '#ffffff' }}
                        >
                          Upgrade to Agency
                        </button>
                      </a>
                    )}
                    {currentPlan !== 'free' && (
                      <button
                        className="flex-1 px-4 py-2.5 rounded text-sm font-medium border transition-all duration-200 hover:bg-gray-50"
                        style={{ borderColor: '#e4e9ed', color: '#44576a' }}
                      >
                        Downgrade Plan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Billing Info - Right Column */}
          <div
            className="p-6 rounded border"
            style={{ backgroundColor: '#ffffff', borderColor: '#e4e9ed' }}
          >
            <h2 className="text-lg font-bold mb-6" style={{ color: '#141e27' }}>
              Billing Information
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#44576a' }}>
                  Billing Email
                </p>
                <p className="text-sm" style={{ color: '#141e27' }}>
                  {user?.email}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #e4e9ed' }} className="pt-4">
                <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#44576a' }}>
                  Billing Period
                </p>
                <p className="text-sm" style={{ color: '#141e27' }}>
                  {subscription?.current_period_start
                    ? `${formatDate(subscription.current_period_start)} - ${formatDate(
                        subscription.current_period_end || ''
                      )}`
                    : 'No active billing period'}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #e4e9ed' }} className="pt-4">
                <p className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: '#44576a' }}>
                  Quick Links
                </p>
                <div className="space-y-2">
                  <button
                    className="w-full text-left text-sm font-medium transition-colors duration-200 hover:underline"
                    style={{ color: '#00a4c6' }}
                  >
                    Download Invoice
                  </button>
                  <button
                    className="w-full text-left text-sm font-medium transition-colors duration-200 hover:underline"
                    style={{ color: '#00a4c6' }}
                  >
                    Update Payment Method
                  </button>
                  <button
                    className="w-full text-left text-sm font-medium transition-colors duration-200 hover:underline"
                    style={{ color: '#ef4444' }}
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div id="invoices"
          className="p-6 rounded border"
          style={{ backgroundColor: '#ffffff', borderColor: '#e4e9ed' }}
        >
          <h2 className="text-lg font-bold mb-6" style={{ color: '#141e27' }}>
            Billing History
          </h2>

          {loading ? (
            <p style={{ color: '#44576a' }}>Loading invoices...</p>
          ) : invoices.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-10 h-10 mx-auto mb-3" style={{ color: '#8896a4' }} />
              <p style={{ color: '#44576a' }}>No invoices yet</p>
              <p className="text-sm mt-1" style={{ color: '#8896a4' }}>
                Your invoices will appear here once you activate a paid plan
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid #e4e9ed' }}>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#44576a' }}>
                      Invoice
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#44576a' }}>
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#44576a' }}>
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#44576a' }}>
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-semibold" style={{ color: '#44576a' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e4e9ed' }}>
                      <td className="py-3 px-4" style={{ color: '#141e27' }}>
                        Invoice #{inv.id}
                      </td>
                      <td className="py-3 px-4" style={{ color: '#44576a' }}>
                        {formatDate(inv.date)}
                      </td>
                      <td className="py-3 px-4 font-semibold" style={{ color: '#141e27' }}>
                        ${typeof inv.amount === 'number' ? inv.amount.toFixed(2) : inv.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: inv.status === 'paid' ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)',
                            color: inv.status === 'paid' ? '#34d399' : '#f59e0b',
                          }}
                        >
                          {inv.status === 'paid' ? <Check className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                          {inv.status || 'paid'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.pdf_url ? (
                          <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer">
                            <button
                              className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:underline"
                              style={{ color: '#00a4c6' }}
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download
                            </button>
                          </a>
                        ) : (
                          <span style={{ color: '#8896a4' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
                          
  )
}

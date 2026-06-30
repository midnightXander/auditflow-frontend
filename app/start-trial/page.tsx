'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import BaseHeader from '@/components/base-header'
import Footer from '@/components/footer'
import { useAuth } from '@/lib/auth-context'
import { CheckCircle } from 'lucide-react'

export default function StartTrialPage() {
  const router = useRouter()
  const search = useSearchParams()
  const planParam = search?.get('plan') || 'pro'
  const plan = (planParam || 'pro').toLowerCase()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // If user is logged in, attempt to auto-start trial
    if (user && !success && !loading) {
      startTrial()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function startTrial() {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
        credentials: 'include',
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || 'Unable to start trial')
      }
      setSuccess(true)
      // small delay to show success then redirect to dashboard
      setTimeout(() => router.push('/dashboard'), 900)
    } catch (err: any) {
      setError(err?.message || 'Failed to start trial')
    } finally {
      setLoading(false)
    }
  }

  const plans: Record<string, any> = {
    pro: {
      name: 'Professional',
      price: '$49/mo',
      trial: '14-day free trial',
      bullets: [
        'Unlimited audits',
        'White-label reports',
        'PDF export & scheduling',
        'Priority support',
      ],
    },
    agency: {
      name: 'Agency',
      price: '$149/mo',
      trial: '14-day free trial',
      bullets: [
        'Everything in Pro',
        'Team seats & roles',
        'API access',
        'Custom domain',
      ],
    },
    starter: {
      name: 'Starter',
      price: '$0',
      trial: 'Free forever',
      bullets: ['5 audits / month', 'Basic reports', 'Community support'],
    },
  }

  const p = plans[plan] || plans.pro

  return (
    <div className="min-h-screen relative bg-white text-slate-900">
      <BaseHeader />

      <main className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[#141e27]">Start your free trial</h1>
            <p className="mt-4 text-lg text-slate-600">Activate the {p.name} plan and try OUTAudits risk-free.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 rounded-lg p-8 border border-gray-200 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#141e27]">{p.name} — <span className="text-[#00a4c6]">{p.price}</span></h2>
                  <p className="mt-2 text-sm text-slate-600">{p.trial}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Recommended</span>
                </div>
              </div>

              <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {p.bullets.map((b: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <CheckCircle className="w-5 h-5 text-[#00a4c6] flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-[#141e27]">Why agencies choose OUTAudits</h3>
                <p className="mt-2 text-slate-600">Build trust with white-label reports, generate qualified leads with our embeddable widget, and scale reporting across teams.</p>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-md border bg-white">
                    <div className="text-sm font-semibold text-slate-700">Fast audits</div>
                    <div className="text-sm text-slate-600 mt-1">Generate full audits in ~30 seconds.</div>
                  </div>
                  <div className="p-4 rounded-md border bg-white">
                    <div className="text-sm font-semibold text-slate-700">White-label</div>
                    <div className="text-sm text-slate-600 mt-1">Brand the reports with your logo and domain.</div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-lg p-6 bg-[#141e27] text-white border border-[#263747]">
              <div className="text-center">
                <div className="text-sm uppercase text-[#00a4c6] font-semibold">Selected plan</div>
                <div className="mt-3 text-2xl font-extrabold">{p.name}</div>
                <div className="mt-1 text-xl text-[#00a4c6]">{p.price}</div>
                <div className="mt-4 text-sm text-[#c1cfda]">{p.trial}</div>

                {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
                {success && <div className="mt-4 text-sm text-emerald-400">Trial activated — redirecting…</div>}

                {!user && (
                  <div className="mt-6">
                    <Link href={`/register?next=/start-trial?plan=${encodeURIComponent(plan)}`} className="inline-block w-full text-center px-4 py-3 rounded-lg bg-[#00a4c6] text-[#072026] font-semibold">Create account & start trial</Link>
                    <Link href="/signin" className="block mt-3 text-sm text-[#c1cfda]">Already have an account? Sign in</Link>
                  </div>
                )}

                {user && (
                  <button onClick={startTrial} disabled={loading || success} className={`mt-6 inline-flex items-center justify-center w-full px-4 py-3 rounded-lg font-semibold ${loading || success ? 'opacity-60 cursor-not-allowed' : 'bg-[#00a4c6] hover:bg-[#0dd3b6]'}`}>
                    {loading ? 'Starting trial…' : success ? 'Activated' : 'Start Free Trial'}
                  </button>
                )}

                <div className="mt-4 text-xs text-[#8896a4]">No credit card required. Terms apply.</div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, AlertCircle, TrendingDown, Search } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import BaseHeader from '@/components/base-header'
import Footer from '@/components/footer'
import { trackVisitor } from '@/lib/tracking'

interface Plan {
  name: string;
  price: number;
  credits: number;
}

export default function Pricing() {
  const [daysUntilPriceChange, setDaysUntilPriceChange] = useState(0)
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const {user} = useAuth();
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const today = new Date()
    const priceChangeDate = new Date(2026, 7, 20) // July 1, 2026
    const diffTime = priceChangeDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setDaysUntilPriceChange(diffDays)
    trackVisitor()
  }, [])

  

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/billing/plans');
      const data = await response.json();
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchCurrentPlan = async () => {
    if (!user) return;
    try {
      const response = await fetchWithAuth(`${API_URL}/billing/subscription`);
      const data = await response.json();
      setCurrentPlan(data.plan);
    } catch (error) {
      console.error('Error fetching subscription :', error);
    }
  };

  const handleUpgrade = async (planTier: string) => {
    if (!user || currentPlan === planTier) {
      // Redirect to login
      router.push('/signin');
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/billing/checkout-link`, {
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

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for freelancers and small teams',
      credits: 20,
      features: [
        'Basic website audits',
        'Performance scoring',
        'SEO recommendations',
        'Custom PDF export',
        'Deep crawl analysis',
        'Competitor comparison',
        'Community support',
        'Limited to 1 user',

      ],
      cta: 'Start Free',
      highlighted: false,
      link: '/register',
    },
    {
      name: 'Pro',
      price: '$19',
      originalPrice: '$39',
      period: '/month',
      description: 'For agencies scaling their SEO services',
      credits: 'Unlimited',
      features: [
        'Everything in Free',
        'Embeddable Widget',
        'Rank tracking',
        // 'Backlink analysis',
        'Keyword research',
        'Custom branding',
        // 'Up to 5 team members',
        'Advanced PDF customization',
        'Monthly reports',
        'Priority Support'
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      link: '/register',
      badge: `Save $20/mo until July 20th`,
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      name: 'Agency',
      price: '$99',
      period: '/month',
      description: 'For agencies offering white-label solutions',
      credits: 'Unlimited',
      features: [
        'Everything in Pro',
        'Client portal access',
        'Custom domain',
        'Unlimited team members',
        'REST API access',
        'Webhooks & integrations',
        'Self-hosted option',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'Advanced analytics',
      ],
      cta: 'Contact Sales',
      highlighted: false,
      link: 'mailto:sales@outaudits.com',
    },
  ]

  const features = [
    {
      name: 'Price',
      free: '$0',
      pro: '$19/mo*',
      agency: '$99/mo',
      category: 'pricing',
    },
    {
      name: 'Monthly Credits',
      free: '20',
      pro: 'Unlimited',
      agency: 'Unlimited',
      category: 'pricing',
    },
    {
      name: 'White-Label Solution',
      free: false,
      pro: true,
      agency: true,
      category: 'features',
    },
    {
      name: 'Self-Hosted Option',
      free: false,
      pro: false,
      agency: true,
      category: 'features',
    },
    {
      name: 'API Access',
      free: false,
      pro: false,
      agency: true,
      category: 'features',
    },
    {
      name: 'Webhook Integration',
      free: false,
      pro: false,
      agency: true,
      category: 'features',
    },
    {
      name: 'Deep Crawl Analysis',
      free: false,
      pro: true,
      agency: true,
      category: 'features',
    },
    {
      name: 'Competitor Comparison',
      free: false,
      pro: true,
      agency: true,
      category: 'features',
    },
    {
      name: 'Rank Tracking',
      free: false,
      pro: true,
      agency: true,
      category: 'features',
    },
    {
      name: 'Backlink Analysis',
      free: false,
      pro: true,
      agency: true,
      category: 'features',
    },
    {
      name: 'Keyword Research',
      free: false,
      pro: true,
      agency: true,
      category: 'features',
    },
    {
      name: 'Advanced PDF Export',
      free: false,
      pro: true,
      agency: true,
      category: 'features',
    },
    {
      name: 'Team Members',
      free: '1',
      pro: '5',
      agency: 'Unlimited',
      category: 'features',
    },
    {
      name: 'Priority Support',
      free: false,
      pro: true,
      agency: true,
      category: 'support',
    },
    {
      name: 'Dedicated Support',
      free: false,
      pro: false,
      agency: true,
      category: 'support',
    },
    {
      name: 'SLA Guarantee',
      free: false,
      pro: false,
      agency: true,
      category: 'support',
    },
  ]

  const competitors = [
    {
      feature: 'Price',
      auditflow: '$0-$99/mo',
      ahrefs: '$99-$999/mo',
      semrush: '$19-$449/mo',
      moz: '$99-$599/mo',
    },
    {
      feature: 'White-Label',
      auditflow: true,
      ahrefs: false,
      semrush: false,
      moz: false,
    },
    {
      feature: 'API Access',
      auditflow: true,
      ahrefs: '$899+',
      semrush: '$449+',
      moz: '$299+',
    },
    {
      feature: 'Self-Hosted',
      auditflow: true,
      ahrefs: false,
      semrush: false,
      moz: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <BaseHeader />

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Simple, Transparent{' '}
            <span className="text-[#00a4c6]">
              Pricing
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free. Scale as you grow. No credit card required.
          </p>
          
          {/* Promotional Banner */}
          {daysUntilPriceChange > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#141e27] text-white text-sm font-medium mb-8">
              <TrendingDown className="w-4 h-4" />
              <span>
                Pro plan is <strong className="text-[#00a4c6]">$19/month</strong> until July 20th (then $39/month). Save $20/mo while you can!
              </span>
            </div>
          )}

          <p className="text-gray-600">
            All plans include 14-day free trial. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative`}>
                {plan.badge && (
                  <div className={`absolute -top-4 left-0 right-0 flex justify-center`}>
                    <span className={`${plan.badgeColor} px-4 py-2  rounded-full text-xs font-bold`}>
                      {plan.badge}
                    </span>
                  </div>
                )}
                
                <Card
                  className={`flex flex-col h-full transition-all duration-300 ${
                    plan.highlighted
                      ? 'md:scale-105 shadow-2xl border-2 border-[#00a4c6] bg-[#00a4c6]  text-white'
                      : 'shadow-lg hover:shadow-xl border-gray-200'
                  }`}
                >
                  <CardContent className="p-8 flex flex-col h-full">
                    {/* Plan Name */}
                    <div className="mb-6">
                      <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                        {plan.name}
                      </h3>
                      <p className={`${plan.highlighted ? 'text-[#e6f9f8]' : 'text-gray-600'} text-sm`}>
                        {plan.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className={`${plan.highlighted ? 'text-white text-5xl font-extrabold' : 'text-5xl font-extrabold text-gray-900'}`}>{plan.price}</span>
                        <span className={`${plan.highlighted ? 'text-[#e6f9f8]' : 'text-gray-600'}`}>{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <p className={`${plan.highlighted ? 'text-[#e6f9f8] opacity-80' : 'text-sm text-gray-500'} mt-2`}>
                          Regular price: <span className="line-through">{plan.originalPrice}</span>
                        </p>
                      )}
                    </div>

                    {/* Credits */}
                    <div className={`mb-8 p-4 rounded-lg border ${plan.highlighted ? 'bg-white/10 border-white/20' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`${plan.highlighted ? 'text-[#e6f9f8]' : 'text-sm text-gray-600'}`}>Monthly Credits</p>
                      <p className={`text-2xl font-bold ${plan.highlighted ? 'text-white' : 'text-[#00a4c6]'}`}>
                        {plan.credits}
                      </p>
                    </div>

                    {/* CTA */}
                      <Button onClick={()=>{handleUpgrade(plan.name.toLocaleLowerCase())}} disabled={loading} size="lg"
                        className={`w-full h-12 mb-8 text-base font-semibold ${
                          plan.highlighted
                            ? 'bg-white text-[#072026] hover:opacity-95'
                            : 'bg-[#00a4c6] hover:bg-[#00a4c6cc] text-white'
                        }`}
                      >
                        {plan.cta}
                      </Button>

                    {/* Features */}
                    <div className="space-y-4 flex-1">
                      <p className={`${plan.highlighted ? 'text-[#e6f9f8]' : 'font-semibold text-gray-900 text-sm'} uppercase tracking-wide`}>
                        Includes:
                      </p>
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className={`w-5 h-5 ${plan.highlighted ? 'text-white' : 'text-green-500'} shrink-0 mt-0.5`} />
                            <span className={`${plan.highlighted ? 'text-[#e6f9f8]' : 'text-gray-700'} text-sm`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Info Text */}
          <div className="text-center mt-12">
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              * Pro plan pricing: <strong>$19/month until July 20th, 2026</strong>, then increases to $39/month.
              Lock in the special price now and keep it forever if you subscribe before July 20th!
            </p>
          </div>
        </div>
      </section>
      

      {/* Features Comparison Table */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Detailed Feature Comparison</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about each plan
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto max-w-6xl mx-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 font-bold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-900">Pro</th>
                  <th className="text-center py-4 px-6 font-bold text-gray-900">Agency</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 ${
                      feature.category === 'pricing' ? 'bg-gray-50 font-semibold' : ''
                    }`}>
                    <td className="py-4 px-6 text-gray-900">{feature.name}</td>
                    <td className="text-center py-4 px-6">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-[#00a4c6] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 font-medium">{feature.free}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-[#00a4c6] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 font-medium">{feature.pro}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-6">
                      {typeof feature.agency === 'boolean' ? (
                        feature.agency ? (
                          <Check className="w-5 h-5 text-[#00a4c6] mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-900 font-medium">{feature.agency}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Comparison */}
          <div className="lg:hidden space-y-8 max-w-2xl mx-auto">
            {['Free', 'Pro', 'Agency'].map((planType) => (
              <div key={planType} className="border-2 border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">{planType}</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => {
                    const value =
                      planType === 'Free'
                        ? feature.free
                        : planType === 'Pro'
                          ? feature.pro
                          : feature.agency

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between py-2 ${
                          feature.category === 'pricing' ? 'font-semibold' : ''
                        }`}
                      >
                        <span className="text-gray-700">{feature.name}</span>
                        <span>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="w-5 h-5 text-[#00a4c6]" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300" />
                            )
                          ) : (
                            <span className="font-semibold text-gray-900">{value}</span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Key Advantage */}
            <div className="mt-8 bg-white rounded-2xl p-6 border-2 border-[#00a4c6]">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-7 h-7 text-[#00a4c6] shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    🎯 Key Advantage
                  </h3>
                  <p className="text-sm text-gray-700 font-semibold mb-1">
                    White-label + self-hosted at a fraction of the cost
                  </p>
                  <p className="text-gray-600 text-sm">
                    Unlike Ahrefs, SEMrush, and Moz, AuditFlow offers full white-label and self-hosted capabilities starting at just
                    $99/month. Competitors charge $299-$999/month and don't provide white-label options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose AuditFlow?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get more features at a fraction of the cost
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-4 px-6 font-bold text-gray-900">Feature</th>
                    <th className="text-center py-4 px-6 font-bold">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          AF
                        </div>
                        <span className="text-gray-900">AuditFlow</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 font-bold text-gray-900">Ahrefs</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-900">SEMrush</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-900">Moz</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((comp, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {comp.feature}
                      </td>
                      <td className="text-center py-4 px-6">
                        {typeof comp.auditflow === 'boolean' ? (
                          comp.auditflow ? (
                            <Check className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-primary-600">{comp.auditflow}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6 text-gray-700">
                        {typeof comp.ahrefs === 'boolean' ? (
                          comp.ahrefs ? (
                            <Check className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span>{comp.ahrefs}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6 text-gray-700">
                        {typeof comp.semrush === 'boolean' ? (
                          comp.semrush ? (
                            <Check className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span>{comp.semrush}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-6 text-gray-700">
                        {typeof comp.moz === 'boolean' ? (
                          comp.moz ? (
                            <Check className="w-6 h-6 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-gray-300 mx-auto" />
                          )
                        ) : (
                          <span>{comp.moz}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Competitor Comparison */}
            <div className="lg:hidden space-y-6">
              {competitors.map((comp, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-4">{comp.feature}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-2">AUDITFLOW</p>
                      <p className="font-semibold text-primary-600">
                        {typeof comp.auditflow === 'boolean' ? (
                          comp.auditflow ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-5 h-5" /> Yes
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gray-400">
                              <X className="w-5 h-5" /> No
                            </span>
                          )
                        ) : (
                          comp.auditflow
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold mb-2">OTHERS</p>
                      <div className="space-y-1 text-xs text-gray-700">
                        <p>Ahrefs: {typeof comp.ahrefs === 'boolean' ? (comp.ahrefs ? '✓' : '✗') : comp.ahrefs}</p>
                        <p>SEMrush: {typeof comp.semrush === 'boolean' ? (comp.semrush ? '✓' : '✗') : comp.semrush}</p>
                        <p>Moz: {typeof comp.moz === 'boolean' ? (comp.moz ? '✓' : '✗') : comp.moz}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Advantage */}
          <div className="mt-16 bg-white rounded-2xl p-8 border-2 border-[#00a4c6] max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-[#00a4c6] shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  🎯 Key Advantage
                </h3>
                <p className="text-lg text-gray-700 font-semibold mb-2">
                  White-label + self-hosted at a fraction of the cost
                </p>
                <p className="text-gray-600">
                  Unlike Ahrefs, SEMrush, and Moz, AuditFlow offers full white-label and self-hosted capabilities starting at just
                  $99/month. Competitors charge $299-$999/month and don't provide white-label options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our plans?
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'Can I change plans anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'Do you offer a free trial?',
                a: 'All plans include a 14-day free trial with full feature access. No credit card required to get started.',
              },
              {
                q: 'What happens if I run out of credits?',
                a: 'Your account will be paused until the next billing cycle. You can also purchase additional credits anytime.',
              },
              {
                q: 'Can I export my data?',
                a: 'Yes! All plans allow you to export audit reports as PDF. Agency plan includes API access for programmatic data access.',
              },
              {
                q: 'Is there a contract or commitment?',
                a: 'No contracts or long-term commitments. Cancel your subscription at any time with no cancellation fees.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, American Express) and offer monthly billing.',
              },
            ].map((item, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">{item.q}</h3>
                  <p className="text-gray-600">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#141e27] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to start auditing websites?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
            Join thousands of agencies using AuditFlow to win more clients
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-[#00a4c6] text-[#072026] hover:opacity-95 font-semibold">
                Start Free Trial
              </Button>
            </Link>
            <Link href="mailto:sales@outaudits.com">
              <Button
                size="lg"
                variant="outline"
                className="border-[#00a4c6] bg-[#00a4c6] text-black hover:bg-[#00a4c6]/10 font-semibold"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-75">
            No credit card required. Full access for 14 days.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

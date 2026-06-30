'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Zap, Globe, Search, Code, Tag, Lock, BarChart3, FileText, Star, ChevronDown, Users, Shield, ArrowRight, Menu, X, CheckCircle, AlertCircle, ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import  Header from '@/components/sections/header'
import ClientLogos from '@/components/sections/clientLogos'
import FeatureGrid from '@/components/sections/featureGrid'
import Testimonies from '@/components/sections/testimonies'
import FAQ from '@/components/sections/faq'
import CTA from '@/components/sections/cta'
import Footer from '@/components/sections/footer'
import Hero from '@/components/sections/hero'
import Pricing from '@/components/sections/pricing'
import WidgetHighlight from '@/components/sections/embed-widget'
import InteractivePreview from '@/components/sections/interactive-preview'
import HowItWorks from '@/components/sections/how-it-works'
import './page2.style.css'

export default function Page2() {
  const { user } = useAuth()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => { if (user) router.push('/dashboard') }, [user, router])
  useEffect(() => {
    const h = () => setScrolled(typeof window !== 'undefined' && window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const faqs = [
    { q: 'Can I really white-label everything?', a: 'Yes — your logo, colors, domain, and messaging throughout. Clients will think it\'s your proprietary tool.' },
    { q: 'How does the embeddable widget work?', a: 'Copy a single script tag into your website. Visitors enter a URL, receive an instant audit preview, and you capture their contact info as a qualified lead.' },
    { q: 'What\'s included in the API?', a: 'Full REST API with endpoints for audits, crawls, keyword tracking, and report generation. Webhooks for real-time notifications.' },
    { q: 'Can I change plans or cancel anytime?', a: 'Absolutely. Upgrade, downgrade, or cancel at any time. No contracts, no cancellation fees.' },
    { q: 'How accurate are the audits?', a: 'Our audits are powered by Google Lighthouse and proprietary crawlers. Results are industry-standard and continuously updated.' },
    { q: 'Is there a free trial?', a: 'Yes! Start with our free tier or try Professional free for 14 days. No credit card required.' },
  ]

  const navLinks = (
    <>
      <Link href="#features" className="text-sm text-slate-200 hover:text-white px-3 py-2" onClick={() => setMobileOpen(false)}>Features</Link>
      <Link href="/pricing" className="text-sm text-slate-200 hover:text-white px-3 py-2" onClick={() => setMobileOpen(false)}>Pricing</Link>
      <Link href="/platform" className="text-sm text-slate-200 hover:text-white px-3 py-2" onClick={() => setMobileOpen(false)}>API Docs</Link>
      <Link href="/blog" className="text-sm text-slate-200 hover:text-white px-3 py-2" onClick={() => setMobileOpen(false)}>Blog</Link>
      <Link href="/signin" className="ml-2 inline-flex items-center px-4 py-2 rounded-md bg-white text-slate-900 font-semibold shadow-sm" onClick={() => setMobileOpen(false)}>Start Free Audit</Link>
      <Link href="/signin" className="ml-2 text-sm text-slate-200 hover:text-white px-3 py-2" onClick={() => setMobileOpen(false)}>Sign In</Link>
    </>
  )

  function ScreenshotPlaceholder({ label = 'Screenshot', size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = size === 'lg' ? 'w-full h-64 md:h-96' : size === 'sm' ? 'w-40 h-24' : 'w-full h-48'
    return (
      <div className={`rounded-lg border-2 border-dashed border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 flex items-center justify-center ${sizeClasses}`}>
        <div className="text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-white text-slate-900">
      {/* NAV */}
      {/* <nav className={`fixed w-full z-30 transition-all ${scrolled ? 'bg-slate-900 shadow-lg' : 'bg-transparent'} `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight">OUTAudits</span>
              <span style={{ color: '#0dd3b6' }} className="font-extrabold">·</span>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              {navLinks}
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu" className="p-2 rounded-md text-slate-100 bg-transparent hover:bg-slate-800">
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        <div className={`${mobileOpen ? 'block' : 'hidden'} md:hidden bg-slate-900`}>{navLinks}</div>
      </nav> */}
      <Header />

      <main className="pt-">
        {/* HERO */}
        {/* <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col-reverse lg:flex-row items-center gap-10">
            <div className="w-full lg:w-1/2">
              <span className="inline-block bg-white/10 text-slate-100 text-xs font-semibold px-3 py-1 rounded-full">Agency-Grade SEO Audits</span>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">White-Label SEO Audits That Win Clients</h1>
              <p className="mt-4 text-slate-200 max-w-2xl">Generate comprehensive, branded SEO reports in 30 seconds. No coding required. Impress prospects, retain clients, and scale your agency.</p>
              <div className="mt-6 flex items-center gap-4">
                <Link href="/signin" className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg shadow">Start Your Free Audit</Link>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="flex items-center -space-x-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f5a623" color="#f5a623" />)}
                  </div>
                  <span>4.9/5 from 2,400+ reviews</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center">
              <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-center text-teal-300 mb-4">
                  <BarChart3 size={48} color="#0dd3b6" />
                </div>
                <p className="text-slate-200 text-center">Interactive report preview</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <ChevronDown size={28} className="text-slate-400" />
          </div>
        </section> */}
        <Hero />

        {/* TRUSTED BY */}
        {/* <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-sm text-slate-500">Trusted by 15,000+ Agencies Worldwide</div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-slate-700">
              {['Pulse Media','Nexus Digital','Vantage SEO','Elevate Group','Sparkline','Meridian'].map(n => (
                <span key={n} className="px-3 py-2 bg-slate-50 rounded-md border border-slate-100">{n}</span>
              ))}
            </div>
          </div>
        </section> */}
        <ClientLogos />

        {/* FEATURES */}
        {/* <section id="features" className="py-16 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-sm font-semibold text-teal-600">Platform Features</span>
            <h2 className="mt-2 text-3xl font-bold">Everything You Need to Deliver Premium Audits</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">Generate reports, track rankings, analyze competitors, and embed audits — all under your brand.</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Zap size={20} className="text-white" />, title: 'Instant SEO Reports', desc: 'Comprehensive audits generated in 30 seconds with actionable recommendations and priority fixes.' },
                { icon: <Tag size={20} className="text-white" />, title: 'White-Label Branding', desc: 'Add your logo, colors, and custom domain. Every report looks like it was built by your team.' },
                { icon: <Globe size={20} className="text-white" />, title: 'Deep Site Crawls', desc: 'Analyze up to 10,000 pages per project. Uncover technical issues, broken links, and optimization opportunities.' },
                { icon: <Search size={20} className="text-white" />, title: 'Keyword Tracking', desc: 'Monitor rankings across 50+ locations. Track your clients\' visibility with precision.' },
                { icon: <Users size={20} className="text-white" />, title: 'Competitor Analysis', desc: 'Compare side-by-side against competitors. Identify gaps and opportunities in their strategy.' },
                { icon: <FileText size={20} className="text-white" />, title: 'PDF Export', desc: 'Download polished PDF reports ready for client presentations. No formatting needed.' },
                { icon: <Code size={20} className="text-white" />, title: 'Embeddable Widget', desc: 'Add an audit form to any website. Capture leads with a branded SEO checker.' },
                { icon: <Shield size={20} className="text-white" />, title: 'API Access', desc: 'Integrate audits into your workflow. Generate reports programmatically via REST API.' },
              ].map((f, i) => (
                <div key={i} className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-lg p-5 shadow">
                  <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center mb-3">{f.icon}</div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-slate-200">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}
        <FeatureGrid />

        {/* SEE IT IN ACTION */}
        <InteractivePreview />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* LEAD GENERATION */}
        {/* <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-sm font-semibold text-teal-600">Lead Generation</span>
              <h2 className="mt-2 text-3xl font-bold">Turn Your Website Into a Lead Magnet</h2>
              <p className="mt-4 text-slate-600 max-w-xl">Embed a white-label SEO audit form on any website. Visitors enter their URL, receive an instant audit preview, and you capture a qualified lead. It&apos;s the highest-converting tool in our platform.</p>
              <div className="mt-6 space-y-3">
                {['Custom branding & colors','Works on any CMS or page builder','Auto-delivers full report via email','Captures lead info before showing results'].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle size={18} color="#0dd3b6" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/audit/embed" className="inline-flex items-center px-5 py-3 border rounded-md text-teal-600 border-teal-300 hover:bg-teal-50">Learn More</Link>
              </div>
            </div>
            <div>
              <div className="max-w-md bg-white rounded-2xl shadow p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Search size={18} color="#0dd3b6" />
                  <div className="font-semibold">SEO Audit</div>
                </div>
                <div className="flex gap-2">
                  <input className="flex-1 border rounded-lg px-4 py-3 text-sm" placeholder="Enter your website URL..." />
                  <button className="bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold">Analyze</button>
                </div>
              </div>
            </div>
          </div>
        </section> */}
        <WidgetHighlight />

        {/* TESTIMONIALS */}
        {/* <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-sm font-semibold text-teal-600">Agency Stories</span>
            <h2 className="mt-2 text-3xl font-bold">Trusted by Agencies Like Yours</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { text: '"OUTAudits transformed how we onboard clients. Instead of spending 4 hours on manual audits, we generate branded reports in 30 seconds. Our close rate jumped 40%."', name: 'Sarah Mitchell', role: 'Founder, Pulse Media', initials: 'SM' },
                { text: '"The white-label feature is incredible. Our clients think we built the audit tool ourselves. The API integration let us automate our entire reporting workflow."', name: 'David Chen', role: 'Director, Nexus Digital', initials: 'DC' },
                { text: '"We switched from SEMrush and never looked back. OUTAudits is built for agencies — the embeddable widget alone generates 50+ qualified leads per month."', name: 'Elena Rodriguez', role: 'CMO, Vantage SEO', initials: 'ER' },
              ].map((t, i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-6 text-left">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#f5a623" color="#f5a623" />)}
                  </div>
                  <p className="text-sm text-slate-700">{t.text}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">{t.initials}</div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Differentiation Section - Why OUTAudits? */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-50">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-[#00a4c6] mb-4">
                      Why Agencies Choose OUTAudits
                    </h2>
                    <p className="text-xl text-gray-600">Over SEMrush, Moz, Ahrefs, and other enterprise tools</p>
                  </div>
        
                  {/* Comparison Table */}
                  <div className="max-w-6xl mx-auto overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-lg border border-gray-200">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                          <th className="px-6 py-4 text-left font-bold">Feature</th>
                          <th className="px-6 py-4 text-center font-bold text-[#00a4c6]">OUTAudits</th>
                          <th className="px-6 py-4 text-center font-bold">SEMrush</th>
                          <th className="px-6 py-4 text-center font-bold">Moz</th>
                          <th className="px-6 py-4 text-center font-bold">Ahrefs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">White-Label Reports</td>
                          <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">Full</span></td>
                          <td className="px-6 py-4 text-center"><AlertCircle className="w-5 h-5 text-amber-600 inline" /> <span className="text-xs text-amber-600 font-semibold">Limited</span></td>
                          <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">Full</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">Embeddable Lead Gen Widget</td>
                          <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">Yes</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">Audit Speed</td>
                          <td className="px-6 py-4 text-center"><Zap className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">30 sec</span></td>
                          <td className="px-6 py-4 text-center">3–5 min</td>
                          <td className="px-6 py-4 text-center">2–3 min</td>
                          <td className="px-6 py-4 text-center">5–10 min</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">Agency-Friendly Pricing</td>
                          <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">Affordable</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">Expensive</span></td>
                          <td className="px-6 py-4 text-center"><AlertCircle className="w-5 h-5 text-amber-600 inline" /> <span className="text-xs text-amber-600 font-semibold">Mid-range</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">Expensive</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">Self-Hosting Option</td>
                          <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">Yes</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">API for Integrations</td>
                          <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">Yes</span></td>
                          <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">Yes</span></td>
                          <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                          <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-[#00a4c6] inline" /> <span className="text-xs text-[#00a4c6] font-semibold">Yes</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
        
                  {/* Key Message */}
                  <div className="text-center mt-12">
                    <Card className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200">
                      <CardContent className="p-8">
                        <p className="text-2xl font-black text-gray-900 mb-2">
                          You don't need an enterprise tool.
                        </p>
                        <p className="text-xl font-bold text-gray-700">
                          You need an <span className="text-emerald-600">agency tool</span>.
                        </p>
                        <p className="text-gray-600 mt-4">
                          Designed for YOUR workflow. Priced for YOUR budget. Built for YOUR clients.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

        {/* PRICING */}
        {/* <section id="pricing" className="py-16 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-sm font-semibold text-teal-600">Simple Pricing</span>
            <h2 className="mt-2 text-3xl font-bold">Plans That Scale With Your Agency</h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">Start free, upgrade when you&apos;re ready. No hidden fees.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="border rounded-lg p-6 text-left">
                <div className="text-sm font-medium text-slate-500">Starter</div>
                <div className="text-2xl font-extrabold mt-2">$0</div>
                <div className="text-sm text-slate-500">Free forever</div>
                <ul className="mt-4 text-sm space-y-1 text-slate-600">
                  <li>5 audits per month</li>
                  <li>Basic SEO reports</li>
                  <li>Single user</li>
                  <li>Community support</li>
                </ul>
                <Link href="/register" className="mt-4 inline-block px-4 py-2 border rounded-md text-slate-700 hover:bg-slate-100">Get Started</Link>
              </div>

              <div className="relative border-2 border-teal-300 rounded-lg p-6 text-left">
                <div className="absolute -top-3 left-4 bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-semibold">Most Popular</div>
                <div className="text-sm font-medium text-slate-500">Professional</div>
                <div className="text-2xl font-extrabold mt-2">$49</div>
                <div className="text-sm text-slate-500">per month</div>
                <ul className="mt-4 text-sm space-y-1 text-slate-600">
                  <li>Unlimited audits</li>
                  <li>White-label reports</li>
                  <li>Deep site crawls</li>
                  <li>PDF export</li>
                  <li>Priority support</li>
                </ul>
                <Link href="/register" className="mt-4 inline-block w-full text-center px-4 py-3 bg-teal-600 text-white rounded-md">Start Free Trial</Link>
              </div>

              <div className="border rounded-lg p-6 text-left">
                <div className="text-sm font-medium text-slate-500">Agency</div>
                <div className="text-2xl font-extrabold mt-2">$149</div>
                <div className="text-sm text-slate-500">per month</div>
                <ul className="mt-4 text-sm space-y-1 text-slate-600">
                  <li>Everything in Pro</li>
                  <li>API access</li>
                  <li>Embeddable widget</li>
                  <li>Team collaboration</li>
                  <li>Custom domain</li>
                </ul>
                <Link href="/register" className="mt-4 inline-block px-4 py-2 border rounded-md text-slate-700 hover:bg-slate-100">Contact Sales</Link>
              </div>
            </div>
          </div>
        </section> */}
        <Pricing />

        <Testimonies />

        {/* FAQ */}
        {/* <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-sm font-semibold text-teal-600">FAQ</span>
            <h2 className="mt-2 text-3xl font-bold">Questions? Answered.</h2>
            <div className="mt-8 grid grid-cols-1 gap-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <button className="w-full text-left flex items-center justify-between" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-medium">{faq.q}</span>
                    <ChevronDown size={20} className={`${openFaq === i ? 'transform rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && <p className="mt-3 text-sm text-slate-600">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section> */}
        <FAQ />

        {/* FINAL CTA */}
        {/* <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white/5 rounded-2xl p-8">
              <h2 className="text-2xl font-bold">Ready to Impress Your Clients?</h2>
              <p className="mt-3 text-slate-200">Join 15,000+ agencies using OUTAudits to deliver premium SEO reports. Start your free 14-day trial today.</p>
              <div className="mt-6">
                <Link href="/register" className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-md">Start Your Free Audit</Link>
              </div>
              <p className="mt-2 text-xs text-slate-400">No credit card required. 14-day free trial.</p>
            </div>
          </div>
        </section> */}
        <CTA />

        {/* FOOTER */}
        {/* <footer className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <div className="text-xl font-bold">OUTAudits<span style={{ color: '#0dd3b6' }}>·</span></div>
              <p className="mt-2 text-sm text-slate-600">White-label SEO audit platform built for agencies. Generate reports in 30 seconds.</p>
              <div className="mt-4 flex gap-3 text-sm text-slate-500">
                {['X','in','GH','YT'].map(icon => (
                  <span key={icon} className="px-2 py-1 bg-slate-50 rounded-md">{icon}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Product</div>
              <div className="flex flex-col gap-1 text-sm text-slate-600">
                <Link href="#features">Features</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/platform">API Docs</Link>
                <Link href="/blog">Changelog</Link>
                <Link href="/audit/embed">Integrations</Link>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Resources</div>
              <div className="flex flex-col gap-1 text-sm text-slate-600">
                <Link href="/blog">Blog</Link>
                <Link href="mailto:support@outaudits.io">Help Center</Link>
                <Link href="/use-cases">Community</Link>
                <Link href="/blog">Webinars</Link>
                <Link href="/use-cases">Case Studies</Link>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Company</div>
              <div className="flex flex-col gap-1 text-sm text-slate-600">
                <Link href="/blog">About</Link>
                <Link href="/blog">Careers</Link>
                <Link href="/terms">Legal</Link>
                <Link href="mailto:support@outaudits.io">Contact</Link>
                <Link href="/blog">Press Kit</Link>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Compare</div>
              <div className="flex flex-col gap-1 text-sm text-slate-600">
                <Link href="/blog">vs SEMrush</Link>
                <Link href="/blog">vs Moz</Link>
                <Link href="/blog">vs Ahrefs</Link>
                <Link href="/blog">vs Screaming Frog</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm text-slate-500">
            <span>© {new Date().getFullYear()} OUTAudits. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="hover:underline">Cookie Policy</Link>
            </div>
            <span>Made with ♥ for agencies worldwide</span>
          </div>
        </footer> */}
        <Footer />
      </main>
    </div>
  )
}

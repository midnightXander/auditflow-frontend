'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  TrendingUp, Calendar, Clock, BarChart3, Star, ChevronDown, Check,
  LineChart, Eye, Search, FileText, ArrowRight, ShieldCheck, Mail, Sparkles, Plus,
  MapPin, RefreshCw, Layers
} from 'lucide-react'
import BaseHeader from '@/components/base-header'
import Footer from '@/components/footer'

gsap.registerPlugin(ScrollTrigger)

/* ————————————————————————————————————————
   DATA
   ———————————————————————————————————————— */
const rankTrackerStats = [
  { value: 'Daily', label: 'Rank updates frequency', icon: Clock },
  { value: '100%', label: 'White-labeled reports', icon: FileText },
  { value: 'Multi-Engine', label: 'Google, Brave & more', icon: Layers },
  { value: 'Local SEO', label: 'Geo-targeted precision', icon: MapPin },
]

const features = [
  {
    icon: LineChart,
    title: 'Automated Daily Rank Tracking',
    desc: 'Monitor target keywords daily without manual lifting. Keep tabs on search engine result modifications as they occur.'
  },
  {
    icon: FileText,
    title: 'Stunning Client Reporting',
    desc: 'Generate automated ranking updates. Customize layouts and style reports with your agency logos, brand colors, and domains.'
  },
  {
    icon: MapPin,
    title: 'Precise Local Rank Tracking',
    desc: 'Run keyword queries at the country level. Retrieve exact search positions tailored for local target audiences.'
  },
  {
    icon: Sparkles,
    title: 'Competitor Share of Voice',
    desc: 'Compare visibility against top search contenders. Detect target opportunities and traffic trends before they pass by.'
  }
]

const reportingSteps = [
  {
    num: '01',
    icon: Plus,
    title: 'Input Domain & Keywords',
    desc: 'Enter your client website domain, configure keywords, choose target countries, and map out daily tracking intervals in under a minute.'
  },
  {
    num: '02',
    icon: RefreshCw,
    title: 'Monitor Rank Trajectories',
    desc: 'Our automated tracking engine crawls search engines daily, populating database tables with accurate rankings, search volumes, and ranking shifts.'
  },
  {
    num: '03',
    icon: FileText,
    title: 'Brand the Reports',
    desc: 'Upload agency logos, link your brand subdomain, pick tailored color palettes, and configure custom notification alerts.'
  },
  {
    num: '04',
    icon: Mail,
    title: 'Auto-Send to Clients',
    desc: 'Schedule automated ranking updates to send directly to your client inboxes. Build constant visibility and client retention.'
  }
]

const comparativeMetrics = [
  { feature: 'Daily Rank Tracking Refresh', us: true, others: 'Weekly only' },
  { feature: 'Fully Custom Subdomain & Logos', us: true, others: 'Extra Add-on' },
  { feature: 'Geo-targeted Precision', us: true, others: 'Country-only' },
  { feature: 'Brave & Alternative Search Engines', us: true, others: 'Google Only' },
  { feature: 'Automated Report Dispatch', us: true, others: 'Manual Exports' },
  { feature: 'Integrated Site SEO Auditing', us: true, others: 'Siloed Tools' }
]

const faqData = [
  { q: 'How accurate is the Rank Tracker?', a: 'Our rank tracker simulates search queries from clean geo-targeted networks and monitors top results across Google, Brave, and other search engines daily to ensure extreme accuracy.' },
  { q: 'Can I send white-labeled emails directly to clients?', a: 'Yes! The agency plan lets you upload your custom logo, connect your domain/subdomain, configure email notification templates, and automate daily or weekly dispatch under your brand.' },
  { q: 'Is there a limit on keywords tracked?', a: 'Tracked keywords depend on your active plan tier. Upgrading your subscription expands keyword limits to support dozens of concurrent campaigns.' },
  { q: 'Can we track rankings in specific countries?', a: 'Absolutely. You can track position details in the US, UK, Canada, Germany, France, Australia, and many others, pinpointing local results precisely.' }
]

const clientSuccess = {
  agency: 'Apex Peak SEO',
  quote: "Rank Tracking on OUTAudits has transformed our client conversations. Sending automated, white-labeled daily reports directly from the platform has increased client retention by 35%. Our clients love the transparency, and we love the time saved.",
  author: 'Marcus Vance',
  role: 'Director of Growth',
  avatar: '/images/case-study-avatar.jpg',
  metrics: [
    { label: 'Time Spent on Reporting', before: '14 hrs', after: '20 mins', unit: '-97%' },
    { label: 'Retention Rate Increase', before: '72%', after: '97%', unit: '+35%' },
    { label: 'Keyword Queries Tracked', before: '150', after: '2,500', unit: '+1,566%' }
  ]
}

/* ————————————————————————————————————————
   COMPONENT
   ———————————————————————————————————————— */
export default function RankTrackerLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  /* Refs for GSAP scroll triggers */
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const caseStudyRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero Animation */
      const heroTl = gsap.timeline({ delay: 0.2 })
      heroTl
        .fromTo('.rt-hero-label', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
        .fromTo('.rt-hero-headline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.35')
        .fromTo('.rt-hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
        .fromTo('.rt-hero-cta', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
        .fromTo('.rt-hero-preview', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, '-=0.25')

      /* Stats Counters */
      gsap.fromTo('.rt-stat', { y: 25, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%' }
      })

      /* Key Features Grid */
      gsap.fromTo('.rt-feature-card', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' }
      })

      /* Reporting Steps timeline */
      gsap.fromTo('.rt-step-card', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: stepsRef.current, start: 'top 80%' }
      })

      /* Case Study */
      gsap.fromTo('.rt-case-story', { x: -30, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: caseStudyRef.current, start: 'top 80%' }
      })
      gsap.fromTo('.rt-case-metric', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: caseStudyRef.current, start: 'top 75%' }
      })

      /* Comparison Rows */
      gsap.fromTo('.rt-compare-row', { x: -15, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out',
        scrollTrigger: { trigger: comparisonRef.current, start: 'top 82%' }
      })

      /* FAQ Items */
      gsap.fromTo('.rt-faq-item', { y: 15, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: 'power2.out',
        scrollTrigger: { trigger: faqRef.current, start: 'top 85%' }
      })

      /* CTA bottom */
      gsap.fromTo('.rt-cta-content', { y: 25, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' }
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#141e27', color: '#ffffff' }}>
      <BaseHeader />

      <main>
        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{ paddingTop: 160, paddingBottom: 100, background: 'linear-gradient(180deg, #141e27 0%, #0f1a24 100%)' }}
        >
          {/* Subtle radial glow */}
          <div style={{
            position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
            width: 1000, height: 1000, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,164,198,0.06) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div className="container mx-auto px-4 relative z-[1]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
              {/* Copy */}
              <div>
                <p className="rt-hero-label text-[#00a4c6] uppercase tracking-wider font-semibold text-xs mb-5 opacity-0">
                  AUTOMATED RANK TRACKER
                </p>
                <h1
                  className="rt-hero-headline opacity-0"
                  style={{
                    fontSize: 'clamp(36px, 4.5vw, 54px)',
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: '-1.2px',
                  }}
                >
                  Beautiful Daily Ranking Reports{' '}
                  <span className="text-[#00a4c6] bg-gradient-to-r from-[#00a4c6] to-[#0dd3b6] bg-clip-text text-transparent">On Autopilot</span>
                </h1>
                <p
                  className="rt-hero-sub mt-6 opacity-0"
                  style={{ fontSize: 18, lineHeight: '28px', color: '#c1cfda', maxWidth: 540 }}
                >
                  Track keyword rankings daily across Google, Brave, and other engines. Deliver fully branded, custom subdomain reports directly to your client base to prove SEO value and boost account retention.
                </p>
                <div className="rt-hero-cta flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-10 opacity-0">
                  <Link href="/register" className="px-8 py-4 rounded font-semibold text-[#141e27] bg-[#00a4c6] hover:bg-[#0dd3b6] shadow-lg hover:shadow-[#00a4c6]/20 transition-all text-center">
                    Start Tracking Free
                  </Link>
                  <a href="#how-it-works" className="px-8 py-4 rounded font-semibold text-[#c1cfda] border border-[#374c63] hover:border-[#00a4c6] hover:text-white transition-all text-center">
                    See How It Works
                  </a>
                </div>
                <div className="mt-6 flex items-center gap-3 opacity-60 text-xs text-[#c1cfda]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Free 14-day trial
                  </span>
                  <span>·</span>
                  <span>White-label setup in minutes</span>
                </div>
              </div>

              {/* Graphic Mockup preview */}
              <div className="rt-hero-preview opacity-0">
                <div className="relative mx-auto max-w-[480px]" style={{
                  background: '#1a2a38', border: '1px solid #374c63', borderRadius: 12,
                  boxShadow: '0 20px 50px rgba(0,0,0,0.4)', overflow: 'hidden'
                }}>
                  {/* Top Bar */}
                  <div className="px-4 py-3 bg-[#141e27] border-b border-[#374c63] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-gray-500 font-mono">rankings.youragency.com</span>
                    <div className="w-6" />
                  </div>

                  {/* Mock Content */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Client Domain</p>
                        <p className="text-sm font-semibold text-white">clientwebsite.com</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                          +12 Positions (Avg)
                        </span>
                      </div>
                    </div>

                    {/* Chart simulation */}
                    <div className="h-32 border border-[#374c63]/40 rounded-lg p-3 relative flex items-end justify-between bg-[#141e27]/50 overflow-hidden">
                      <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-20 pointer-events-none">
                        <div className="w-full h-px bg-white" />
                        <div className="w-full h-px bg-white" />
                        <div className="w-full h-px bg-white" />
                      </div>
                      {/* Fake Chart Lines */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,80 L20,72 L40,48 L60,40 L80,25 L100,12" fill="none" stroke="#00a4c6" strokeWidth="3" />
                        <path d="M0,80 L20,72 L40,48 L60,40 L80,25 L100,12 L100,100 L0,100 Z" fill="url(#grad)" opacity="0.1" />
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00a4c6" />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="text-[10px] text-gray-500 absolute left-2 top-2 bg-[#1a2a38] px-1.5 py-0.5 rounded border border-[#374c63]">
                        Daily Trend
                      </div>
                    </div>

                    {/* Keywords List snippet */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] text-gray-500 border-b border-[#374c63] pb-1.5">
                        <span>Keyword</span>
                        <span>Rank</span>
                        <span>Change</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#c1cfda]">best local plumber</span>
                        <span className="font-semibold text-white">#3</span>
                        <span className="text-emerald-400 font-medium">+2</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#c1cfda]">affordable roof repair</span>
                        <span className="font-semibold text-white">#1</span>
                        <span className="text-emerald-400 font-medium">+5</span>
                      </div>
                      <div className="flex justify-between text-xs border-b border-[#374c63] pb-2">
                        <span className="text-[#c1cfda]">seo services near me</span>
                        <span className="font-semibold text-white">#8</span>
                        <span className="text-[#00a4c6] font-medium">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ STATS BAR ═══════════════ */}
        <section
          ref={statsRef}
          style={{ backgroundColor: '#0d1318', borderTop: '1px solid #374c63', borderBottom: '1px solid #374c63', padding: '60px 0' }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {rankTrackerStats.map((s, i) => {
                const Icon = s.icon
                return (
                  <div
                    key={i}
                    className="rt-stat text-center p-6 rounded-lg border border-[#374c63] bg-[#141e27]"
                    style={{ opacity: 0 }}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-3 text-[#00a4c6]" />
                    <div className="text-3xl font-bold" style={{ color: '#ffffff' }}>{s.value}</div>
                    <div className="text-sm mt-1 text-[#c1cfda]">{s.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ KEY FEATURES GRID ═══════════════ */}
        <section
          ref={featuresRef}
          style={{ backgroundColor: '#ffffff', padding: '120px 0' }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-[700px] mx-auto mb-20">
              <p className="text-[#00a4c6] font-bold text-xs uppercase tracking-wider mb-3">KEY CAPABILITIES</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#141e27',
              }}>
                Engineered Specifically for Agency Reporting
              </h2>
              <p className="mt-4 text-gray-500" style={{ fontSize: 16, lineHeight: '26px' }}>
                OUTAudits isn't just a tracking tool. It is a communication platform designed to align expectations, save reporting hours, and retain clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((f, i) => {
                const Icon = f.icon
                return (
                  <div
                    key={i}
                    className="rt-feature-card p-8 rounded-lg border border-gray-100 bg-white hover:border-[#00a4c6]/30 hover:shadow-lg transition-all duration-300 group"
                    style={{ opacity: 0, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)' }}
                  >
                    <div className="w-12 h-12 rounded bg-[#00a4c6] flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{f.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section
          id="how-it-works"
          ref={stepsRef}
          style={{ backgroundColor: '#141e27', padding: '120px 0' }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-[680px] mx-auto mb-20">
              <p className="text-[#00a4c6] font-bold text-xs uppercase tracking-wider mb-3">WORKFLOW PROGRESSION</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                Start Sending Branded Reports Instantly
              </h2>
              <p className="mt-4 text-[#c1cfda]" style={{ fontSize: 16, lineHeight: '26px' }}>
                Follow our effortless setup process to transition from custom keyword configuration to automated client deliveries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {reportingSteps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div
                    key={i}
                    className="rt-step-card border border-[#374c63] rounded-lg p-8 bg-[#1a2a38]"
                    style={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-bold text-[#00a4c6]/20" style={{ lineHeight: 1 }}>
                        {step.num}
                      </span>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00a4c6] text-white">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="font-bold text-md text-white mb-3">{step.title}</h4>
                    <p className="text-xs text-[#c1cfda] leading-relaxed">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ CASE STUDY SECTION ═══════════════ */}
        <section
          ref={caseStudyRef}
          style={{ backgroundColor: '#ffffff', padding: '120px 0' }}
        >
          <div className="container mx-auto px-4 max-w-[1000px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Story */}
              <div className="rt-case-story" style={{ opacity: 0 }}>
                <p className="text-xs font-semibold text-[#00a4c6] uppercase tracking-wider mb-3">
                  AGENCY CASE STUDY
                </p>
                <h2 style={{
                  fontSize: 'clamp(28px, 3.5vw, 40px)',
                  fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#141e27',
                }}>
                  {clientSuccess.agency}
                </h2>
                <blockquote
                  className="mt-8 p-6 border-l-4"
                  style={{
                    borderColor: '#00a4c6', background: '#f0f9fc', borderRadius: '0 8px 8px 0',
                  }}
                >
                  <p style={{ fontSize: 16, fontStyle: 'italic', lineHeight: '26px', color: '#141e27' }}>
                    &quot;{clientSuccess.quote}&quot;
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#141e27', marginTop: 16 }}>
                    {clientSuccess.author}
                  </p>
                  <p style={{ fontSize: 12, color: '#44576a' }}>{clientSuccess.role}</p>
                </blockquote>

                <div className="mt-12 space-y-4">
                  <p className="text-xs font-semibold text-[#44576a] tracking-wider">
                    THE METRICS
                  </p>
                  {clientSuccess.metrics.map((m, i) => (
                    <div key={i} className="rt-case-metric flex items-end gap-4" style={{ opacity: 0 }}>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-gray-400 text-line-through decoration-red-400">
                            {m.before}
                          </span>
                          <span style={{ fontSize: 24, fontWeight: 700, color: '#00a4c6' }}>
                            {m.after}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 mb-0.5">
                        {m.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphical Badge */}
              <div className="rt-case-story" style={{ opacity: 0 }}>
                <div style={{
                  borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg, #0dd3b6 0%, #00a4c6 100%)',
                  padding: 2,
                }}>
                  <div style={{ background: '#ffffff', borderRadius: 14, padding: 40, textAlign: 'center' }}>
                    <div className="flex justify-center gap-1 mb-4">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="w-5 h-5 fill-[#ffc107] text-[#ffc107]" />
                      ))}
                    </div>
                    <p style={{ fontSize: 36, fontWeight: 700, color: '#141e27', lineHeight: 1.2, marginBottom: 8 }}>
                      35%
                    </p>
                    <p className="text-sm text-gray-500 font-semibold mb-6">
                      Increase in Client Retention Rate
                    </p>
                    <div style={{ height: 1, backgroundColor: '#e4e9ed' }} />
                    <p className="text-xs font-bold text-[#00a4c6] uppercase tracking-wider mt-6 mb-2">
                      Trusted Reporting
                    </p>
                    <p className="text-xs text-gray-600">
                      Delivered dynamically on custom domains for agencies worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
        <section
          ref={comparisonRef}
          style={{ backgroundColor: '#141e27', padding: '120px 0', borderTop: '1px solid #374c63' }}
        >
          <div className="container mx-auto px-4 max-w-[800px]">
            <div className="text-center mb-16">
              <p className="text-[#00a4c6] font-bold text-xs uppercase tracking-wider mb-3">COMPETITIVE COMPARISON</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                Feature Breakdown
              </h2>
              <p className="mt-4 text-[#c1cfda]" style={{ fontSize: 16 }}>
                Unlike legacy rank trackers, we don't hide white-label features or custom domains behind expensive enterprise plans.
              </p>
            </div>

            <div className="border border-[#374c63] rounded-lg overflow-hidden" style={{ background: '#1a2a38' }}>
              <div className="grid grid-cols-3 px-6 py-4 border-b border-[#374c63] bg-[#141e27]">
                <span className="text-sm font-semibold text-[#c1cfda]">Capability</span>
                <span className="text-sm font-semibold text-center text-[#00a4c6]">OUTAudits</span>
                <span className="text-sm font-semibold text-center text-gray-500">Others</span>
              </div>
              {comparativeMetrics.map((row, i) => (
                <div
                  key={i}
                  className="rt-compare-row grid grid-cols-3 px-6 py-4 border-b border-[#374c63]/50 last:border-b-0 hover:bg-[#263747]/40 transition-colors"
                  style={{ opacity: 0 }}
                >
                  <span className="text-sm text-[#c1cfda]">{row.feature}</span>
                  <div className="flex justify-center items-center">
                    <Check className="w-5 h-5 text-[#00a4c6]" />
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="text-xs text-gray-500">{row.others}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ FAQ SECTION ═══════════════ */}
        <section
          ref={faqRef}
          style={{ backgroundColor: '#141e27', padding: '120px 0', borderTop: '1px solid #374c63' }}
        >
          <div className="container mx-auto px-4 max-w-[800px]">
            <div className="text-center mb-16">
              <p className="text-[#00a4c6] font-bold text-xs uppercase tracking-wider mb-3">FAQ</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqData.map((faq, i) => (
                <div
                  key={i}
                  className="rt-faq-item border border-[#374c63] rounded-lg overflow-hidden bg-[#1a2a38] transition-colors duration-200 hover:border-[#00a4c6]/40"
                  style={{ opacity: 0 }}
                >
                  <button
                    className="w-full text-left flex items-center justify-between p-5 bg-transparent border-none cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-sm text-white">{faq.q}</span>
                    <ChevronDown
                      className="w-5 h-5 text-gray-500 transition-transform duration-300"
                      style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openFaq === i ? 200 : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                  >
                    <p className="px-5 pb-5 text-sm text-[#c1cfda] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section
          ref={ctaRef}
          style={{ backgroundColor: '#0d1318', padding: '120px 0' }}
        >
          <div className="container mx-auto px-4 text-center max-w-[700px] rt-cta-content" style={{ opacity: 0 }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center bg-[#00a4c6]/10">
              <TrendingUp className="w-7 h-7 text-[#00a4c6]" />
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
            }}>
              Ready to Upgrade Your Agency Reporting?
            </h2>
            <p className="mt-5 text-sm text-[#c1cfda] leading-relaxed">
              Unlock precise rank tracking, white-labeled client-accessible reports, alternative engine indexing, and automated email campaigns today.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="inline-block px-10 py-4 rounded font-bold text-[#141e27] bg-[#00a4c6] hover:bg-[#0dd3b6] hover:shadow-lg transition-all"
              >
                Get Started Free
              </Link>
            </div>
            <p className="mt-5 text-xs text-gray-500">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}

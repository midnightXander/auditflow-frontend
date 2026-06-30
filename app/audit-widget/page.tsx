'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Code, Globe, Search, Users, ArrowRight, CheckCircle,
  Zap, BarChart3, Mail, Shield, Star, ChevronDown,
  Copy, Check, MousePointerClick, Palette, TrendingUp,
  Clock, Target, Settings, Eye,
} from 'lucide-react'
import BaseHeader from '@/components/base-header'
import Footer from '@/components/footer'


gsap.registerPlugin(ScrollTrigger)

/* ————————————————————————————————————————
   DATA
   ———————————————————————————————————————— */
const stats = [
  { value: '50+', label: 'Leads / month avg.', icon: Users },
  { value: '32%', label: 'Conversion rate', icon: TrendingUp },
  { value: '<30s', label: 'Audit delivery', icon: Clock },
  { value: '100%', label: 'White-labeled', icon: Palette },
]

const steps = [
  {
    num: '01',
    icon: Settings,
    title: 'Generate Your Embed Code',
    desc: 'Sign up, go to the Embed Widget dashboard, and generate your unique API key. Customize headline, CTA text, and branding colors to match your site.',
  },
  {
    num: '02',
    icon: Code,
    title: 'Paste Two Lines of Code',
    desc: 'Copy the script tag and container div, then paste them into any page on your website. Works with WordPress, Wix, Shopify, Squarespace, and custom HTML.',
  },
  {
    num: '03',
    icon: MousePointerClick,
    title: 'Visitors Run Audits',
    desc: 'Your website visitors enter their URL and email. They receive an instant audit preview while you capture a qualified lead with full contact details.',
  },
  {
    num: '04',
    icon: Mail,
    title: 'Close the Deal',
    desc: 'Review leads in your dashboard, send follow-up emails, track status from "new" to "converted", and attach notes — all from one place.',
  },
]

const benefits = [
  { icon: Target, title: 'Qualified Leads on Autopilot', desc: 'Every visitor who runs an audit is a warm prospect already interested in SEO.' },
  { icon: Palette, title: 'Fully Branded Experience', desc: 'Your logo, your colors, your domain. Clients never see our brand.' },
  { icon: Zap, title: '30-Second Audit Delivery', desc: 'Powered by Lighthouse and proprietary crawlers for instant, accurate results.' },
  { icon: Shield, title: 'Lead Capture Built In', desc: 'Require email before results, auto-deliver reports, and gate full data behind sign-up.' },
  { icon: Globe, title: 'Works on Any Platform', desc: 'WordPress, Wix, Shopify, Squarespace, Next.js, or plain HTML — just paste and go.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track total audits, leads captured, and conversion rates in real-time.' },
]

const comparisonRows = [
  { feature: 'Embeddable audit widget', us: true, them: false },
  { feature: 'White-label branding', us: true, them: 'Partial' },
  { feature: 'Lead capture form', us: true, them: false },
  { feature: 'Instant audit delivery', us: true, them: false },
  { feature: 'CRM-style lead management', us: true, them: false },
  { feature: 'Follow-up email from dashboard', us: true, them: false },
  { feature: 'Custom CTA & headline', us: true, them: false },
  { feature: 'Works on any CMS', us: true, them: 'Limited' },
]

const cmsLogos = ['WordPress', 'Wix', 'Shopify', 'Squarespace', 'Webflow', 'Next.js', 'HTML']

const caseStudy = {
  agency: 'Elite Digital Marketing',
  quote: 'The embeddable widget is the secret weapon behind our 300% lead growth this year. Our clients see an instant audit, they give us their email, and we convert them into retained clients. It\'s magical.',
  author: 'Jessica Thompson',
  role: 'Agency Owner',
  avatar: '/images/case-study-avatar.jpg',
  metrics: [
    { label: 'Leads/Month', before: '12', after: '50', unit: '+317%' },
    { label: 'Conversion Rate', before: '8%', after: '32%', unit: '+300%' },
    { label: 'Monthly Revenue Impact', before: '$5K', after: '$25K', unit: '+400%' },
  ],
}

const sampleLeads = [
  {
    id: 1,
    name: 'Michael Rodriguez',
    email: 'michael@techstartup.io',
    website: 'techstartup.io',
    status: 'new',
    date: '2 hours ago',
    score: 62,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.chen@ecomco.com',
    website: 'ecomco.com',
    status: 'contacted',
    date: '5 hours ago',
    score: 58,
  },
  {
    id: 3,
    name: 'James Whitmore',
    email: 'james@localplumbing.net',
    website: 'localplumbing.net',
    status: 'qualified',
    date: '1 day ago',
    score: 71,
  },
  {
    id: 4,
    name: 'Amanda Foster',
    email: 'amanda@foodblog.co',
    website: 'foodblog.co',
    status: 'new',
    date: '2 days ago',
    score: 54,
  },
  {
    id: 5,
    name: 'David Kim',
    email: 'david@fitnessstudio.com',
    website: 'fitnessstudio.com',
    status: 'converted',
    date: '3 days ago',
    score: 79,
  },
]

const faqs = [
  { q: 'How does the embeddable widget work?', a: 'Copy a single script tag and a container div into your website. Visitors enter a URL and email, receive an instant audit preview, and you capture their contact info as a qualified lead in your dashboard.' },
  { q: 'Does it work with my website platform?', a: 'Yes! The widget works on WordPress, Wix, Shopify, Squarespace, Webflow, Next.js, and any platform that supports custom HTML or embed codes.' },
  { q: 'Can I customize the look and feel?', a: 'Absolutely. You can change the headline, description, button text, and apply your agency\'s brand colors and logo through the dashboard settings.' },
  { q: 'Will visitors see your branding?', a: 'No. The widget is fully white-labeled. Your logo, colors, and domain are displayed. Our brand is completely invisible to your visitors.' },
  { q: 'How are leads captured?', a: 'When lead capture is enabled, visitors must enter their email before seeing audit results. You can also make the email field optional. All leads appear in your Leads dashboard with status tracking.' },
  { q: 'Is there a limit on the number of audits?', a: 'Free tier includes 5 audits/month. Professional ($49/mo) includes unlimited audits. Agency ($149/mo) adds API access and the embeddable widget feature.' },
]

const widgetTestimonials = [
  {
    quote: "The embeddable widget alone generates 50+ qualified leads per month for our agency. It's the single highest-ROI tool we've ever used.",
    name: 'Elena Rodriguez',
    role: 'CEO, Vantage SEO',
    avatar: '/images/testimonial-avatar-3.jpg',
  },
  {
    quote: "We embedded the widget on our homepage and saw a 40% increase in inbound leads within the first week. The lead management dashboard is a game-changer.",
    name: 'David Chen',
    role: 'Director, Nexus Digital',
    avatar: '/images/testimonial-avatar-2.jpg',
  },
  {
    quote: "Setting it up took 5 minutes. Our clients think we built it ourselves. The white-label branding is flawless.",
    name: 'Sarah Mitchell',
    role: 'Founder, Pulse Media',
    avatar: '/images/testimonial-avatar-1.jpg',
  },
]

/* ————————————————————————————————————————
   COMPONENT
   ———————————————————————————————————————— */
export default function AuditWidgetLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [demoInput, setDemoInput] = useState('')
  const [demoEmail, setDemoEmail] = useState('')
  const [demoLoading, setDemoLoading] = useState(false)
  const [demoResult, setDemoResult] = useState<any>(null)

  /* refs for GSAP */
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)
  const benefitsRef = useRef<HTMLDivElement>(null)
  const compareRef = useRef<HTMLDivElement>(null)
  const caseStudyRef = useRef<HTMLDivElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)
  const testimonialRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const sampleEmbed = `<!-- Add to any page on your website -->
<script src="https://app.outaudits.io/embed/widget.js?api_key=YOUR_API_KEY"></script>
<div id="auditflow-widget"></div>`

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleEmbed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!demoInput.trim() || !demoEmail.trim()) return

    // Simulate audit analysis
    setDemoLoading(true)
    setTimeout(() => {
      const domain = demoInput.includes('http') ? new URL(demoInput).hostname : demoInput
      setDemoResult({
        domain,
        email: demoEmail,
        score: 68,
        performance: 85,
        accessibility: 72,
        seo: 52,
        issues: [
          { type: 'error', count: 3, desc: 'Critical accessibility issues' },
          { type: 'warning', count: 8, desc: 'Missing meta descriptions' },
          { type: 'info', count: 12, desc: 'Optimization opportunities' },
        ],
      })
      setDemoLoading(false)
    }, 2000)
  }

  /* ——— GSAP animations ——— */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Hero */
      const heroTl = gsap.timeline({ delay: 0.3 })
      heroTl
        .fromTo('.aw-hero-label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .fromTo('.aw-hero-headline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
        .fromTo('.aw-hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45')
        .fromTo('.aw-hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
        .fromTo('.aw-hero-preview', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')

      /* Stats */
      gsap.fromTo('.aw-stat', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%' },
      })

      /* Steps */
      gsap.fromTo('.aw-step', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: stepsRef.current, start: 'top 80%' },
      })

      /* Benefits */
      gsap.fromTo('.aw-benefit', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: benefitsRef.current, start: 'top 80%' },
      })

      /* Comparison */
      gsap.fromTo('.aw-compare-row', { x: -20, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: compareRef.current, start: 'top 80%' },
      })

      /* Demo */
      gsap.fromTo('.aw-demo-content', { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: demoRef.current, start: 'top 80%' },
      })

      /* Case Study */
      gsap.fromTo('.aw-case-study-content', { x: -40, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: caseStudyRef.current, start: 'top 80%' },
      })
      gsap.fromTo('.aw-case-metric', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: caseStudyRef.current, start: 'top 75%' },
      })

      /* Dashboard */
      gsap.fromTo('.aw-dashboard-header', { y: -20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: dashboardRef.current, start: 'top 80%' },
      })
      gsap.fromTo('.aw-dashboard-row', { x: 20, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: dashboardRef.current, start: 'top 78%' },
      })

      /* Testimonials */
      gsap.fromTo('.aw-testimonial', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: testimonialRef.current, start: 'top 80%' },
      })

      /* FAQ */
      gsap.fromTo('.aw-faq-item', { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: faqRef.current, start: 'top 85%' },
      })

      /* CTA */
      gsap.fromTo('.aw-cta-content', { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#141e27', color: '#ffffff' }}>
      <BaseHeader />

      <main>
        {/* ═══════════════ HERO ═══════════════ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{ paddingTop: 160, paddingBottom: 100, background: 'linear-gradient(180deg, #141e27 0%, #0f1a24 100%)' }}
        >
          {/* Subtle radial glow */}
          <div style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: 900, height: 900, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,164,198,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="content-container relative z-[1]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left – Copy */}
              <div>
                <p className="aw-hero-label section-label mb-5 opacity-0">EMBEDDABLE AUDIT WIDGET</p>
                <h1
                  className="aw-hero-headline opacity-0"
                  style={{
                    fontSize: 'clamp(36px, 4.5vw, 54px)',
                    fontWeight: 700,
                    lineHeight: 1.07,
                    letterSpacing: '-1.2px',
                  }}
                >
                  Turn Your Website Into a{' '}
                  <span className="gradient-text">Lead Machine</span>
                </h1>
                <p
                  className="aw-hero-sub mt-6 opacity-0"
                  style={{ fontSize: 18, lineHeight: '28px', color: '#c1cfda', maxWidth: 520 }}
                >
                  Embed a white-label SEO audit form on your website. Visitors enter their URL,
                  get an instant audit — and you capture a qualified lead. Two lines of code. Zero development time.
                </p>
                <div className="aw-hero-cta flex flex-col sm:flex-row items-start gap-4 mt-10 opacity-0">
                  <Link href="/register" className="btn-primary glow-ring">
                    Start Free — Get Your Widget
                  </Link>
                  <a href="#how-it-works" className="btn-outline">
                    See How It Works
                  </a>
                </div>
                <div className="mt-6 flex items-center gap-3 opacity-70" style={{ fontSize: 13, color: '#44576a' }}>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                    <span>No credit card required</span>
                  </div>
                  <span>·</span>
                  <span>Setup in under 5 minutes</span>
                </div>
              </div>

              {/* Right – Widget Preview Mockup */}
              <div className="aw-hero-preview opacity-0">
                <div className="widget-preview-shell" style={{ maxWidth: 480, marginLeft: 'auto' }}>
                  <div className="browser-dots">
                    <span /><span /><span />
                    <div className="flex-1 mx-4 rounded bg-[#0a1017] h-5 flex items-center px-3">
                      <span style={{ fontSize: 10, color: '#44576a' }}>youragency.com/free-audit</span>
                    </div>
                  </div>
                  <div className="p-8">
                    {/* Simulated widget */}
                    <div className="rounded-lg border border-[#374c63] p-6" style={{ background: 'rgba(0,164,198,0.03)' }}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#00a4c6] flex items-center justify-center">
                          <Search className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-sm" style={{ color: '#ffffff' }}>Free Website SEO Audit</span>
                      </div>
                      <p className="text-xs mb-4" style={{ color: '#44576a' }}>Get a comprehensive SEO analysis in seconds</p>
                      <div className="flex gap-2">
                        <div
                          className="flex-1 rounded-md px-3 py-2 text-xs"
                          style={{ background: '#0a1017', border: '1px solid #374c63', color: '#44576a' }}
                        >
                          Enter your website URL...
                        </div>
                        <div
                          className="rounded-md px-4 py-2 text-xs font-semibold"
                          style={{ background: '#00a4c6', color: '#141e27' }}
                        >
                          Analyze
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: '#44576a' }}>
                        <Mail className="w-3 h-3" />
                        <span>Email required before results</span>
                      </div>
                    </div>

                    {/* Floating badges */}
                    <div className="relative mt-4 flex gap-3 justify-end">
                      <div
                        className="float-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(0,164,198,0.15)', color: '#00a4c6', border: '1px solid rgba(0,164,198,0.25)' }}
                      >
                        <Users className="w-3 h-3" /> +3 leads today
                      </div>
                      <div
                        className="float-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(40,200,64,0.12)', color: '#28c840', border: '1px solid rgba(40,200,64,0.25)', animationDelay: '0.5s' }}
                      >
                        <CheckCircle className="w-3 h-3" /> White-labeled
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
          <div className="content-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => {
                const Icon = s.icon
                return (
                  <div
                    key={i}
                    className="aw-stat stat-counter text-center p-6 rounded-lg border border-[#374c63]"
                    style={{ opacity: 0, background: '#141e27' }}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-3" style={{ color: '#00a4c6' }} />
                    <div className="text-3xl font-bold" style={{ color: '#ffffff' }}>{s.value}</div>
                    <div className="text-sm mt-1" style={{ color: '#44576a' }}>{s.label}</div>
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
          style={{ backgroundColor: '#141e27', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container">
            <div className="text-center max-w-[680px] mx-auto mb-20 max-md:mb-10">
              <p className="section-label mb-4">HOW IT WORKS</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                From Zero to Leads in Under 5 Minutes
              </h2>
              <p className="mt-4" style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}>
                No developers needed. No complex integrations. Just paste, publish, and start generating qualified leads.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <div
                    key={i}
                    className="aw-step step-card border border-[#374c63] rounded-lg p-8"
                    style={{ opacity: 0, background: '#1a2a38' }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span
                        className="text-4xl font-bold"
                        style={{ color: 'rgba(0,164,198,0.15)', lineHeight: 1 }}
                      >
                        {step.num}
                      </span>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#00a4c6' }}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h4 className="font-bold text-lg mb-3" style={{ color: '#ffffff' }}>{step.title}</h4>
                    <p className="text-sm" style={{ color: '#c1cfda', lineHeight: '22px' }}>{step.desc}</p>
                  </div>
                )
              })}
            </div>
            
          </div>
        </section>

        {/* ═══════════════ EMBED CODE PREVIEW ═══════════════ */}
        <section style={{ backgroundColor: '#0d1318', padding: '100px 0' }} className="max-md:!py-[60px]">
          <div className="content-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="section-label mb-4">DEAD SIMPLE SETUP</p>
                <h2 style={{
                  fontSize: 'clamp(26px, 3vw, 36px)',
                  fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.8px', color: '#ffffff',
                }}>
                  Two Lines of Code. That&apos;s It.
                </h2>
                <p className="mt-4" style={{ fontSize: 16, lineHeight: '26px', color: '#c1cfda', maxWidth: 480 }}>
                  Copy the embed snippet from your dashboard and paste it into any page. The widget automatically
                  inherits your brand settings and starts capturing leads instantly.
                </p>
                <div className="mt-8 space-y-3">
                  {['Works with any CMS or page builder', 'Async loading — zero performance impact', 'Responsive design out of the box', 'Auto-updates when you change settings'].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#00a4c6' }} />
                      <span className="text-sm" style={{ color: '#c1cfda' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="widget-code-block">
                  <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 w-8 h-8 rounded flex items-center justify-center border border-[#374c63] bg-[#141e27] hover:border-[#00a4c6] transition-colors cursor-pointer"
                    aria-label="Copy code"
                  >
                    {copied
                      ? <Check className="w-4 h-4" style={{ color: '#28c840' }} />
                      : <Copy className="w-4 h-4" style={{ color: '#44576a' }} />
                    }
                  </button>
                  <div>
                    <span className="code-comment">{'<!-- Add to any page on your website -->'}</span>
                  </div>
                  <div className="mt-2">
                    <span className="code-tag">{'<script'}</span>{' '}
                    <span className="code-attr">src</span>=<span className="code-string">&quot;https://app.outaudits.io/embed/widget.js?api_key=<span style={{ color: '#00a4c6' }}>YOUR_API_KEY</span>&quot;</span>
                    <span className="code-tag">{'>'}</span>
                    <span className="code-tag">{'</script>'}</span>
                  </div>
                  <div className="mt-1">
                    <span className="code-tag">{'<div'}</span>{' '}
                    <span className="code-attr">id</span>=<span className="code-string">&quot;auditflow-widget&quot;</span>
                    <span className="code-tag">{'>'}</span>
                    <span className="code-tag">{'</div>'}</span>
                  </div>
                </div>
                {copied && (
                  <div className="absolute -top-8 right-0 text-xs font-medium px-2 py-1 rounded" style={{ background: '#28c840', color: '#0a1017' }}>
                    Copied!
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CMS COMPATIBILITY ═══════════════ */}
        <section style={{ backgroundColor: '#141e27', padding: '80px 0', borderTop: '1px solid #374c63' }}>
          <div className="content-container text-center">
            <p className="section-label mb-4">PLATFORM COMPATIBILITY</p>
            <p className="text-sm" style={{ color: '#44576a' }}>Works seamlessly with every major website platform</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-10">
              {cmsLogos.map((name) => (
                <span
                  key={name}
                  className="cms-logo cursor-default"
                  style={{
                    fontSize: 'clamp(14px, 1.4vw, 18px)',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                    color: '#ffffff',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ BENEFITS GRID ═══════════════ */}
        <section
          ref={benefitsRef}
          style={{ backgroundColor: '#ffffff', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container">
            <div className="text-center max-w-[680px] mx-auto mb-20 max-md:mb-10">
              <p className="section-label mb-4">WHY AGENCIES LOVE IT</p>
              <h2
                style={{
                  fontSize: 'clamp(28px, 3.5vw, 40px)',
                  fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#141e27',
                }}
              >
                The Highest-Converting Tool in Your Stack
              </h2>
              <p className="mt-4" style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}>
                Stop chasing leads. Let them come to you with a branded audit experience that builds instant trust.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]">
              {benefits.map((b, i) => {
                const Icon = b.icon
                return (
                  <div
                    key={i}
                    className="aw-benefit bg-white border border-[#e4e9ed] rounded-md p-8 card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_19px_38px_rgba(0,0,0,0.12)] hover:border-[rgba(0,164,198,0.3)] group"
                    style={{ opacity: 0 }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: '#00a4c6' }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4
                      className="mt-6"
                      style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: '#141e27' }}
                    >
                      {b.title}
                    </h4>
                    <p className="mt-3" style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}>
                      {b.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
        <section
          ref={compareRef}
          style={{ backgroundColor: '#141e27', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container max-w-[800px] mx-auto">
            <div className="text-center mb-16 max-md:mb-10">
              <p className="section-label mb-4">COMPETITIVE EDGE</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                OUTAudits vs. The Rest
              </h2>
              <p className="mt-4" style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}>
                Most SEO tools don&apos;t offer embeddable widgets at all. Here&apos;s what you get with OUTAudits.
              </p>
            </div>

            <div className="border border-[#374c63] rounded-lg overflow-hidden" style={{ background: '#1a2a38' }}>
              {/* Header */}
              <div className="grid grid-cols-3 px-6 py-4" style={{ borderBottom: '1px solid #374c63' }}>
                <span className="text-sm font-semibold" style={{ color: '#c1cfda' }}>Feature</span>
                <span className="text-sm font-semibold text-center" style={{ color: '#00a4c6' }}>OUTAudits</span>
                <span className="text-sm font-semibold text-center" style={{ color: '#44576a' }}>Others</span>
              </div>
              {comparisonRows.map((row, i) => (
                <div
                  key={i}
                  className="aw-compare-row comparison-row grid grid-cols-3 px-6 py-4"
                  style={{ borderBottom: i < comparisonRows.length - 1 ? '1px solid #374c63' : 'none', opacity: 0 }}
                >
                  <span className="text-sm" style={{ color: '#c1cfda' }}>{row.feature}</span>
                  <div className="flex justify-center">
                    {row.us === true
                      ? <CheckCircle className="w-5 h-5" style={{ color: '#00a4c6' }} />
                      : <span className="text-sm" style={{ color: '#44576a' }}>{String(row.us)}</span>
                    }
                  </div>
                  <div className="flex justify-center">
                    {row.them === false
                      ? <span className="text-sm" style={{ color: '#44576a' }}>✕</span>
                      : <span className="text-sm" style={{ color: '#44576a' }}>{String(row.them)}</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ LIVE WIDGET DEMO ═══════════════ */}
        <section
          ref={demoRef}
          style={{ backgroundColor: '#0d1318', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container max-w-[900px] mx-auto">
            <div className="text-center mb-16 max-md:mb-10">
              <p className="section-label mb-4">TRY IT LIVE</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                See the Widget in Action
              </h2>
              <p className="mt-4" style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}>
                Enter your website URL below to get an instant SEO audit preview — exactly what your leads will see.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
              {/* Left – Form */}
              <div
                className="aw-demo-content"
                style={{ opacity: 0, background: '#1a2a38', borderRadius: 12, padding: 32, border: '1px solid #374c63' }}
              >
                <h3 style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', marginBottom: 20 }}>
                  Run Your Audit
                </h3>
                <form onSubmit={handleDemoSubmit} className="space-y-5">
                  <div>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#c1cfda', display: 'block', marginBottom: 8 }}>
                      Website URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://yourwebsite.com"
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 8,
                        border: '1px solid #374c63', background: '#141e27', color: '#ffffff',
                        fontSize: 14, transition: 'all 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#00a4c6'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,164,198,0.1)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#374c63'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      disabled={demoLoading}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 14, fontWeight: 500, color: '#c1cfda', display: 'block', marginBottom: 8 }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 8,
                        border: '1px solid #374c63', background: '#141e27', color: '#ffffff',
                        fontSize: 14, transition: 'all 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#00a4c6'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,164,198,0.1)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#374c63'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      disabled={demoLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={demoLoading}
                    className="w-full btn-primary"
                    style={{ marginTop: 20, opacity: demoLoading ? 0.7 : 1, cursor: demoLoading ? 'not-allowed' : 'pointer' }}
                  >
                    {demoLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </span>
                    ) : (
                      'Get Your Free Audit'
                    )}
                  </button>
                </form>
                <p className="mt-4 text-xs" style={{ color: '#44576a' }}>
                  Results are generated in ~30 seconds. We never spam — one email only.
                </p>
              </div>

              {/* Right – Result Preview */}
              <div
                className="aw-demo-content"
                style={{ opacity: 0, background: '#1a2a38', borderRadius: 12, padding: 32, border: '1px solid #374c63' }}
              >
                {demoResult ? (
                  <div className="space-y-6">
                    <div>
                      <p style={{ fontSize: 13, color: '#44576a', marginBottom: 4 }}>Domain</p>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>{demoResult.domain}</p>
                    </div>

                    <div className="space-y-3">
                      <p style={{ fontSize: 13, color: '#44576a' }}>SEO Score Breakdown</p>
                      {[
                        { label: 'Performance', value: demoResult.performance },
                        { label: 'Accessibility', value: demoResult.accessibility },
                        { label: 'SEO', value: demoResult.seo },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <span style={{ fontSize: 14, color: '#c1cfda', flex: 1 }}>{item.label}</span>
                          <div
                            style={{
                              height: 6, width: 120, background: '#263747', borderRadius: 3,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%', width: `${item.value}%`, background: '#00a4c6',
                                transition: 'width 0.6s ease',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#00a4c6', width: 40 }}>
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4" style={{ borderTop: '1px solid #374c63' }}>
                      <p style={{ fontSize: 13, color: '#44576a', marginBottom: 8 }}>Issues Found</p>
                      <div className="space-y-2">
                        {demoResult.issues.map((issue: any, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <span
                              style={{
                                width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: 12, fontWeight: 600,
                                background: issue.type === 'error' ? 'rgba(239,68,68,0.15)' : issue.type === 'warning' ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                                color: issue.type === 'error' ? '#ef4444' : issue.type === 'warning' ? '#f59e0b' : '#3b82f6',
                              }}
                            >
                              {issue.count}
                            </span>
                            <span style={{ fontSize: 14, color: '#c1cfda' }}>{issue.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #374c63', paddingTop: 16 }}>
                      <p style={{ fontSize: 13, color: '#44576a', marginBottom: 12 }}>Full report sent to:</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#00a4c6' }}>{demoResult.email}</p>
                      <p style={{ fontSize: 12, color: '#44576a', marginTop: 8 }}>
                        Check your inbox for the complete audit report with actionable recommendations.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center py-8">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                      style={{ background: 'rgba(0,164,198,0.15)' }}
                    >
                      <Search className="w-7 h-7" style={{ color: '#00a4c6' }} />
                    </div>
                    <p style={{ fontSize: 16, color: '#c1cfda' }}>
                      Enter your website URL to see real audit results instantly
                    </p>
                    <p style={{ fontSize: 13, color: '#44576a', marginTop: 8 }}>
                      No pressure — it&apos;s completely free and takes about 30 seconds
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ CASE STUDY ═══════════════ */}
        <section
          ref={caseStudyRef}
          style={{ backgroundColor: '#ffffff', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container max-w-[1000px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left – Story */}
              <div className="aw-case-study-content" style={{ opacity: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#00a4c6', marginBottom: 12, letterSpacing: '0.5px' }}>
                  CLIENT SUCCESS STORY
                </p>
                <h2 style={{
                  fontSize: 'clamp(28px, 3.5vw, 40px)',
                  fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#141e27',
                }}>
                  {caseStudy.agency}
                </h2>
                <blockquote
                  className="mt-8 p-6 border-l-4"
                  style={{
                    borderColor: '#00a4c6', background: '#f0f9fc', borderRadius: '0 8px 8px 0',
                  }}
                >
                  <p style={{ fontSize: 18, fontStyle: 'italic', lineHeight: '28px', color: '#141e27' }}>
                    &quot;{caseStudy.quote}&quot;
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#141e27', marginTop: 16 }}>
                    {caseStudy.author}
                  </p>
                  <p style={{ fontSize: 12, color: '#44576a' }}>{caseStudy.role}</p>
                </blockquote>

                <div className="mt-12 space-y-4">
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#44576a', letterSpacing: '0.5px' }}>
                    THE TRANSFORMATION
                  </p>
                  {caseStudy.metrics.map((m, i) => (
                    <div key={i} className="aw-case-metric flex items-end gap-4" style={{ opacity: 0 }}>
                      <div>
                        <p style={{ fontSize: 12, color: '#44576a', marginBottom: 4 }}>{m.label}</p>
                        <div className="flex items-baseline gap-2">
                          <span style={{ fontSize: 14, color: '#44576a', textDecoration: 'line-through' }}>
                            {m.before}
                          </span>
                          <span style={{ fontSize: 28, fontWeight: 700, color: '#00a4c6' }}>
                            {m.after}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#28c840', marginBottom: 4 }}>
                        {m.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right – Visual */}
              <div className="aw-case-study-content" style={{ opacity: 0 }}>
                <div
                  style={{
                    borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg, #0dd3b6 0%, #00a4c6 100%)',
                    padding: 2,
                  }}
                >
                  <div
                    style={{
                      background: '#ffffff', borderRadius: 14, padding: 40, textAlign: 'center',
                    }}
                  >
                    <div style={{ marginBottom: 32 }}>
                      <img
                        src={caseStudy.avatar}
                        alt={caseStudy.author}
                        style={{
                          width: 80, height: 80, borderRadius: '50%', margin: '0 auto',
                          objectFit: 'cover', background: '#e4e9ed',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} className="w-5 h-5 fill-[#ffc107] text-[#ffc107]" />
                      ))}
                    </div>
                    <p style={{
                      fontSize: 32, fontWeight: 700, color: '#141e27', lineHeight: 1.2,
                      marginBottom: 16,
                    }}>
                      300%
                    </p>
                    <p style={{ fontSize: 14, color: '#44576a' }}>
                      Lead growth in the first 12 months using the embeddable widget
                    </p>
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #e4e9ed' }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#00a4c6', marginBottom: 4 }}>
                        TRUSTED BY
                      </p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#141e27' }}>
                        Agencies in 40+ Countries
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ LEADS DASHBOARD MOCKUP ═══════════════ */}
        <section
          ref={dashboardRef}
          style={{ backgroundColor: '#0d1318', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container max-w-[1000px] mx-auto">
            <div className="text-center mb-16 max-md:mb-10">
              <p className="section-label mb-4">MANAGE LEADS EFFORTLESSLY</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                Your Lead Dashboard at a Glance
              </h2>
              <p className="mt-4" style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}>
                Every lead captured by your widget appears instantly in your dashboard.
                Track status, send emails, and convert prospects into paying clients.
              </p>
            </div>

            {/* Dashboard mockup */}
            <div
              style={{
                background: '#1a2a38', border: '1px solid #374c63', borderRadius: 12,
                overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              {/* Header */}
              <div
                className="aw-dashboard-header"
                style={{ opacity: 0, background: '#141e27', padding: '20px 24px', borderBottom: '1px solid #374c63' }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(0,164,198,0.15)' }}
                    >
                      <Users className="w-5 h-5" style={{ color: '#00a4c6' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>Leads Dashboard</p>
                      <p style={{ fontSize: 12, color: '#44576a' }}>All captured leads from your widget</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p style={{ fontSize: 12, color: '#44576a', marginBottom: 2 }}>Total Leads</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>143</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: 12, color: '#44576a', marginBottom: 2 }}>Converted</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#28c840' }}>45</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: 12, color: '#44576a', marginBottom: 2 }}>Conversion</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#00a4c6' }}>32%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #374c63', background: '#141e27' }}>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#44576a' }}>
                        Name
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#44576a' }}>
                        Email
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#44576a' }}>
                        Website
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#44576a' }}>
                        Score
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#44576a' }}>
                        Status
                      </th>
                      <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#44576a' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleLeads.map((lead, i) => (
                      <tr
                        key={lead.id}
                        className="aw-dashboard-row"
                        style={{
                          opacity: 0,
                          borderBottom: i < sampleLeads.length - 1 ? '1px solid #374c63' : 'none',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#263747'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#ffffff' }}>
                          {lead.name}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#c1cfda' }}>
                          {lead.email}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: 14, color: '#44576a' }}>
                          {lead.website}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#00a4c6' }}>
                          {lead.score}
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block', padding: '4px 12px', borderRadius: 6, fontSize: 12,
                              fontWeight: 600,
                              background: lead.status === 'new' ? 'rgba(59,130,246,0.15)' : lead.status === 'contacted' ? 'rgba(245,158,11,0.15)' : lead.status === 'qualified' ? 'rgba(34,197,94,0.15)' : 'rgba(0,164,198,0.15)',
                              color: lead.status === 'new' ? '#3b82f6' : lead.status === 'contacted' ? '#f59e0b' : lead.status === 'qualified' ? '#22c55e' : '#00a4c6',
                            }}
                          >
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: '16px 24px', textAlign: 'left' }}>
                          <div className="flex items-center gap-2">
                            <button
                              style={{
                                width: 32, height: 32, borderRadius: 6, border: '1px solid #374c63',
                                background: '#141e27', color: '#44576a', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#00a4c6'
                                e.currentTarget.style.color = '#00a4c6'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#374c63'
                                e.currentTarget.style.color = '#44576a'
                              }}
                              title="Send email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button
                              style={{
                                width: 32, height: 32, borderRadius: 6, border: '1px solid #374c63',
                                background: '#141e27', color: '#44576a', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#00a4c6'
                                e.currentTarget.style.color = '#00a4c6'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#374c63'
                                e.currentTarget.style.color = '#44576a'
                              }}
                              title="Add note"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA below table */}
            <div className="text-center mt-12">
              <p style={{ fontSize: 14, color: '#c1cfda', marginBottom: 12 }}>
                Manage all your leads in one intuitive dashboard
              </p>
              <Link href="/register" className="btn-primary glow-ring">
                Get Started Free
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section
          ref={testimonialRef}
          style={{ backgroundColor: '#0d1318', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container">
            <div className="text-center mb-20 max-md:mb-10">
              <p className="section-label mb-4">REAL RESULTS</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                Agencies Love the Widget
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
              {widgetTestimonials.map((t, i) => (
                <div
                  key={i}
                  className="aw-testimonial bg-[#263747] border border-[#374c63] rounded p-8 transition-colors duration-300 hover:border-[rgba(0,164,198,0.4)]"
                  style={{ opacity: 0 }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#ffc107] text-[#ffc107]" />
                    ))}
                  </div>
                  <p style={{ fontSize: 16, lineHeight: '26px', color: '#c1cfda', fontStyle: 'italic' }}>
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="my-6" style={{ height: 1, backgroundColor: '#374c63' }} />
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                      <p style={{ fontSize: 16, fontWeight: 600, lineHeight: '22px', color: '#ffffff' }}>{t.name}</p>
                      <p style={{ fontSize: 14, lineHeight: '20px', color: '#44576a' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ INLINE CTA ═══════════════ */}
        <section style={{ backgroundColor: '#141e27', padding: '100px 0', borderTop: '1px solid #374c63', borderBottom: '1px solid #374c63' }}>
          <div className="content-container text-center max-w-[700px] mx-auto">
            <h2 style={{
              fontSize: 'clamp(26px, 3vw, 36px)',
              fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.8px', color: '#ffffff',
            }}>
              Ready to Generate Leads While You Sleep?
            </h2>
            <p className="mt-4" style={{ fontSize: 18, lineHeight: '28px', color: '#c1cfda' }}>
              Join 15,000+ agencies already using the embeddable widget to turn visitors into clients.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary glow-ring">
                Get Started Free
              </Link>
              <Link href="/pricing" className="btn-outline">
                View Pricing
              </Link>
            </div>
            <p className="mt-4" style={{ fontSize: 13, color: '#44576a' }}>
              Free tier available. No credit card required.
            </p>
          </div>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section
          ref={faqRef}
          style={{ backgroundColor: '#141e27', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container max-w-[800px] mx-auto">
            <div className="text-center mb-16 max-md:mb-10">
              <p className="section-label mb-4">FAQ</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
              }}>
                Questions About the Widget?
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="aw-faq-item border border-[#374c63] rounded-lg overflow-hidden transition-colors duration-200 hover:border-[rgba(0,164,198,0.3)]"
                  style={{ opacity: 0, background: '#1a2a38' }}
                >
                  <button
                    className="w-full text-left flex items-center justify-between p-5 bg-transparent border-none cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium text-sm" style={{ color: '#ffffff' }}>{faq.q}</span>
                    <ChevronDown
                      className="w-5 h-5 flex-shrink-0 transition-transform duration-300"
                      style={{ color: '#44576a', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: openFaq === i ? 200 : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                  >
                    <p className="px-5 pb-5 text-sm" style={{ color: '#c1cfda', lineHeight: '22px' }}>
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
          style={{ backgroundColor: '#0d1318', padding: '140px 0' }}
          className="max-md:!py-[60px]"
        >
          <div className="content-container text-center max-w-[700px] mx-auto aw-cta-content" style={{ opacity: 0 }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-8 flex items-center justify-center" style={{ background: 'rgba(0,164,198,0.15)' }}>
              <Code className="w-7 h-7" style={{ color: '#00a4c6' }} />
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700, lineHeight: 1.1, letterSpacing: '-1.1px', color: '#ffffff',
            }}>
              Start Capturing Leads Today
            </h2>
            <p className="mt-5" style={{ fontSize: 18, lineHeight: '28px', color: '#c1cfda' }}>
              Set up your embeddable audit widget in under 5 minutes. No developers, no complexity —
              just qualified leads flowing into your dashboard.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="btn-primary inline-block"
                style={{ padding: '16px 40px', animation: 'glowRing 2s infinite' }}
              >
                Get Your Free Widget Now
              </Link>
            </div>
            <p className="mt-5" style={{ fontSize: 14, lineHeight: '22px', color: '#44576a' }}>
              No credit card required. Free tier includes 5 audits/month.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#ffc107] text-[#ffc107]" />
                ))}
              </div>
              <span className="text-sm" style={{ color: '#c1cfda' }}>4.9/5 from 2,400+ reviews</span>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { 
  Zap, Globe, Search, Code, Tag, Lock, BarChart3, FileText, Star, ChevronDown, 
  Users, Shield, ArrowRight, CheckCircle, AlertCircle, Sparkles, Bot, Cpu, 
  Mail, Calendar, Linkedin, Twitter, ExternalLink, MessageSquare, Check, 
  Layers, FileCheck, ShieldCheck, Eye, HelpCircle, UserCheck, RefreshCw
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import BaseHeader from '@/components/base-header' 
import FeatureGrid from '@/components/sections/featureGrid'
import HowItWorks from '@/components/sections/how-it-works'
import WidgetHighlight from '@/components/sections/embed-widget'
import Pricing from '@/components/sections/pricing'
import Footer2 from '@/components/sections/footer2'
import { trackVisitor } from '@/lib/tracking'
import AnonAuditForm from '@/components/anonAuditForm'

export default function NewLandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => { 
    if (user) router.push('/dashboard') 
  }, [user, router])

  useEffect(() => {
    trackVisitor()
  }, [])

  const transparentFaqs = [
    { 
      q: 'Why "Plain English" instead of technical metrics?', 
      a: 'Most clients don\'t know what LCP, TTFB, or Canonical Tag mismatches mean. When you send them a 40-page PDF full of technical jargon, they feel confused and tune out. OUTAudits translates technical health into clear business outcomes — showing what\'s broken, why it hurts revenue, and how to fix it in language any business owner understands.' 
    },
    { 
      q: 'What is the AI Visibility Audit and why do I need it?', 
      a: 'Modern buyers use ChatGPT, Claude, and Perplexity for product research. Our AI Visibility check verifies whether GPTBot (OpenAI), ClaudeBot (Anthropic), PerplexityBot, and Googlebot can crawl your client\'s site or if they\'re blocked by firewalls or robots.txt rules. It gives your agency a brand new service to sell: Generative Engine Optimization (GEO).' 
    },
    { 
      q: 'How does OUTAudits build trust without fake reviews?', 
      a: 'We just launched, so we refuse to post fake testimonials or pretend 15,000 enterprise brands use us. Instead, we offer radical transparency: real live audit demos, open technical specs (built on Google Lighthouse v12 & Puppeteer), direct access to the founder (Alex), and a 100% free tier so you can test every feature yourself before spending a dime.' 
    },
    { 
      q: 'Can I white-label everything under my agency brand?', 
      a: 'Yes! Add your agency logo, primary brand colors, custom domain, and custom report messaging. Your clients will only see your agency branding throughout the interactive dashboard and PDF exports.' 
    },
    { 
      q: 'How does the embeddable lead generation widget work?', 
      a: 'You get a single line of JavaScript to drop onto your agency website. Visitors enter their URL to get a free instant plain-English audit. To unlock the full report, they enter their name and email, sending a hot inbound lead directly to your dashboard.' 
    },
    { 
      q: 'What is your guarantee and trial policy?', 
      a: 'You can start completely free with 5 audits per month (no credit card required). Our Pro and Agency plans come with a 14-day free trial and a 30-day 100% money-back guarantee. If your clients don\'t love the reports, we refund you immediately.' 
    },
  ]

  return (
    <div className="min-h-screen relative bg-[#0f1a24] text-slate-100 font-sans">
      <BaseHeader />

      <main className="pt-16">
        {/* HERO SECTION - REPOSITIONED & FOUNDER TRUST */}
        <section 
          className="relative overflow-hidden pt-28 pb-20 border-b border-[#374c63]/50"
          style={{ background: 'linear-gradient(180deg, #141e27 0%, #0f1a24 100%)' }}
        >
          {/* Subtle radial glow background */}
          <div 
            style={{
              position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
              width: 1000, height: 1000, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,164,198,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} 
          />

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
            {/* Positioning Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00a4c6]/10 border border-[#00a4c6]/30 text-sm font-semibold text-[#00a4c6] mb-6">
              <Sparkles className="w-4 h-4 text-[#0dd3b6]" />
              <span>Plain-English Reports for Agencies</span>
              <span className="hidden sm:inline text-xs bg-[#0dd3b6]/20 text-[#0dd3b6] px-2 py-0.5 rounded font-mono ml-1">
                + AI Visibility Check
              </span>
            </div>

            {/* Core Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              Plain-English White-Label Reports That <span className="text-[#00a4c6]">Win & Retain</span> Clients
            </h1>

            {/* Subheadline focusing on jargon-free, business outcome focus */}
            <p className="mt-6 text-lg sm:text-xl text-[#c1cfda] max-w-3xl mx-auto leading-relaxed">
              Ditch the 40-page PDF bloat full of unexplained LCP &amp; TTFB metrics. Deliver 
              <strong className="text-white font-semibold"> jargon-free, business-focused audits</strong> that clients actually understand — including an all-new <strong className="text-[#0dd3b6] font-semibold">AI Search Visibility check</strong> (GPTBot, ClaudeBot, Perplexity).
            </p>

            {/* Live Interactive Hero Audit Form (Product-First Credibility) */}
            <div className="mt-8">
              <AnonAuditForm />
            </div>

            {/* Zero-Fake Trust Bar & Substitute Credibility Signals */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#8c9ba5] border-t border-[#263747] pt-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle className="w-4 h-4 text-[#0dd3b6]" />
                <span><strong>Radical Transparency:</strong> We just launched!</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#00a4c6]" />
                <span>Google Lighthouse v12 Engine</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>30-Sec Generation</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>100% Free Tier · No CC</span>
              </div>
            </div>
          </div>
        </section>

        {/* SUBSTITUTE CREDIBILITY & RADICAL TRANSPARENCY SECTION */}
        <section className="py-16 bg-[#141e27] border-b border-[#374c63]/40">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gradient-to-r from-[#1c2b38] to-[#162430] border border-[#374c63] rounded-2xl p-6 md:p-10 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 md:w-2/3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0dd3b6]/10 text-[#0dd3b6] text-xs font-bold uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" /> No Fake Social Proof Here
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    "We just launched. Here is exactly what we built and why."
                  </h2>
                  <p className="text-[#c1cfda] text-sm sm:text-base leading-relaxed">
                    Most SaaS landing pages show manufactured logos or vague "trusted by 10,000+ agencies" claims. 
                    We don't do that. We built OUTAudits because traditional SEO tools are built for technical analysts, 
                    leaving agency owners to manually rewrite bloated 50-page reports before meeting a client.
                  </p>
                </div>

                {/* Third-Party Validation Badges */}
                <div className="w-full md:w-1/3 flex flex-col gap-3">
                  <div className="bg-[#141e27] border border-[#374c63] p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#da552f]/20 border border-[#da552f]/40 flex items-center justify-center text-[#da552f] font-black text-lg">
                      P
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">Featured On</div>
                      <div className="text-sm font-bold text-white">Product Hunt Launch</div>
                    </div>
                  </div>

                  <div className="bg-[#141e27] border border-[#374c63] p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#4285f4]/20 border border-[#4285f4]/40 flex items-center justify-center text-[#4285f4]">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">Under The Hood</div>
                      <div className="text-sm font-bold text-white">Google Lighthouse &amp; Chromium</div>
                    </div>
                  </div>

                  <div className="bg-[#141e27] border border-[#374c63] p-4 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0dd3b6]/20 border border-[#0dd3b6]/40 flex items-center justify-center text-[#0dd3b6]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">AI Crawl Verification</div>
                      <div className="text-sm font-bold text-white">GPTBot, ClaudeBot, Perplexity</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE JARGON TRAP VS PLAIN ENGLISH COMPARISON */}
        <section className="py-20 bg-[#0f1a24]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#00a4c6] uppercase tracking-widest bg-[#00a4c6]/10 px-3 py-1 rounded-full">
                Why Plain English Matters
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
                The Jargon Trap: Technical Tools vs. Business Reports
              </h2>
              <p className="mt-3 text-[#c1cfda] max-w-2xl mx-auto text-base">
                Clients don't buy code parameters — they buy business outcomes, speed, and lead generation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bloated Tool Side */}
              <div className="bg-[#18232d] border border-red-500/30 rounded-2xl p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Traditional SEO Tools (SEMrush / Ahrefs)
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 font-bold">
                    ✕
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Confusing Jargon Bloat</h3>
                    <p className="text-xs text-slate-400">40-page PDFs clients never read</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm font-mono text-slate-300 bg-[#0f1a24] p-4 rounded-xl border border-slate-800">
                  <div className="text-red-400">⚠️ LCP: 4.8s (Largest Contentful Paint)</div>
                  <div className="text-red-400">⚠️ CLS: 0.32 (Cumulative Layout Shift)</div>
                  <div className="text-amber-400">⚠️ Missing rel="canonical" on 14 paginated URIs</div>
                  <div className="text-slate-400">⚠️ TTFB: 820ms from server origin</div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-300">
                  <strong>Client Reaction:</strong> "This looks too technical and complicated. I don't know what any of this means so I'll pause our marketing budget."
                </div>
              </div>

              {/* OUTAudits Plain English Side */}
              <div className="bg-[#18232d] border border-[#0dd3b6]/40 rounded-2xl p-7 relative overflow-hidden shadow-lg shadow-[#0dd3b6]/5">
                <div className="absolute top-0 right-0 bg-[#0dd3b6]/20 text-[#0dd3b6] text-xs font-bold px-3 py-1 rounded-bl-lg">
                  OUTAudits Plain-English Approach
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#0dd3b6]/10 flex items-center justify-center text-[#0dd3b6] font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Clear Business Revenue Impact</h3>
                    <p className="text-xs text-[#0dd3b6]">Executive summaries clients instantly sign off</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-200 bg-[#0f1a24] p-4 rounded-xl border border-[#00a4c6]/20 font-sans">
                  <div className="flex items-start gap-2">
                    <span className="text-[#0dd3b6] font-bold">🚀 Speed Impact:</span>
                    <span>Your site takes 4.8s to open on mobile. 53% of mobile visitors leave after 3s. Fixing image sizes recovers ~15 lost leads/month.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0dd3b6] font-bold">🤖 AI Search Check:</span>
                    <span>GPTBot is blocked by your firewall. ChatGPT cannot cite your services when buyers ask for local recommendations.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0dd3b6] font-bold">💡 Priority Fix:</span>
                    <span>Fix 3 high-impact items first to boost Google &amp; AI visibility within 14 days.</span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-[#00a4c6]/10 border border-[#00a4c6]/30 text-xs text-cyan-200">
                  <strong>Client Reaction:</strong> "Finally! An audit I can actually understand. Here is approval to start the fix package immediately."
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* NEW FEATURE HIGHLIGHT: AI VISIBILITY AUDIT */}
        <section id="ai-visibility" className="py-20 bg-gradient-to-b from-[#0f1a24] via-[#142330] to-[#0f1a24] border-t border-b border-[#374c63]/40">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
                <Bot className="w-4 h-4 text-[#0dd3b6]" />
                Brand New Feature Addition
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Is Your Client's Site Invisible to <span className="text-[#0dd3b6]">ChatGPT, Claude &amp; Perplexity?</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-[#c1cfda] max-w-3xl mx-auto">
                Modern buyers skip traditional search engines and ask AI assistants for vendor recommendations. 
                If AI bots can't crawl or parse your client's website, they don't exist in AI search results.
              </p>
            </div>

            {/* 4 Bot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* GPTBot */}
              <div className="bg-[#1b2a38] border border-[#374c63] hover:border-[#00a4c6] transition-all rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">GPTBot (OpenAI)</h3>
                  <p className="text-xs text-slate-400 mt-1">ChatGPT Search Crawlers</p>
                </div>
                <p className="text-xs text-[#c1cfda] leading-relaxed">
                  Checks if <code className="bg-[#0f1a24] px-1.5 py-0.5 rounded text-emerald-300">GPTBot</code> is blocked in robots.txt or Cloudflare WAF rules so your client stays eligible for ChatGPT recommendations.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <Check className="w-4 h-4" /> User-Agent Access Verification
                </div>
              </div>

              {/* ClaudeBot */}
              <div className="bg-[#1b2a38] border border-[#374c63] hover:border-[#00a4c6] transition-all rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">ClaudeBot (Anthropic)</h3>
                  <p className="text-xs text-slate-400 mt-1">Anthropic Model Crawlers</p>
                </div>
                <p className="text-xs text-[#c1cfda] leading-relaxed">
                  Audits whether Anthropic's <code className="bg-[#0f1a24] px-1.5 py-0.5 rounded text-amber-300">ClaudeBot</code> can access and digest site content, key products, and pricing pages.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <Check className="w-4 h-4" /> LLM Parsing Diagnostics
                </div>
              </div>

              {/* PerplexityBot */}
              <div className="bg-[#1b2a38] border border-[#374c63] hover:border-[#00a4c6] transition-all rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">PerplexityBot</h3>
                  <p className="text-xs text-slate-400 mt-1">Perplexity Citation Engine</p>
                </div>
                <p className="text-xs text-[#c1cfda] leading-relaxed">
                  Verifies if <code className="bg-[#0f1a24] px-1.5 py-0.5 rounded text-cyan-300">PerplexityBot</code> can scrape direct answers and attribute website links in AI research summaries.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                  <Check className="w-4 h-4" /> Citation Eligibility Test
                </div>
              </div>

              {/* Googlebot / Gemini */}
              <div className="bg-[#1b2a38] border border-[#374c63] hover:border-[#00a4c6] transition-all rounded-2xl p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Googlebot / Gemini</h3>
                  <p className="text-xs text-slate-400 mt-1">AI Overviews &amp; Snippets</p>
                </div>
                <p className="text-xs text-[#c1cfda] leading-relaxed">
                  Tests structured schema data and page rendering compatibility for Google's AI Overviews and SGE features.
                </p>
                <div className="pt-2 flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                  <Check className="w-4 h-4" /> AI Overview Readiness
                </div>
              </div>
            </div>

            {/* Upsell Callout for Agencies */}
            <div className="mt-12 bg-[#141e27] border border-[#00a4c6]/40 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00a4c6]/20 border border-[#00a4c6]/50 flex items-center justify-center text-[#0dd3b6] flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">New Agency Revenue Upsell: GEO Audits</h4>
                  <p className="text-xs text-[#c1cfda]">Offer Generative Engine Optimization (GEO) audits to your clients before competing agencies do.</p>
                </div>
              </div>
              <Link href="/register" className="px-5 py-2.5 rounded-lg bg-[#00a4c6] hover:bg-[#0093b2] text-white text-xs font-bold whitespace-nowrap transition-colors">
                Run Free AI Visibility Audit →
              </Link>
            </div>
          </div>
        </section>

        {/* FOUNDER-LED CREDIBILITY SECTION */}
        <section id="founder" className="py-20 bg-[#141e27] border-b border-[#374c63]/40">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-gradient-to-br from-[#192735] to-[#121d28] border border-[#374c63] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
                {/* Founder Photo / Avatar Placeholder */}
                <div className="flex flex-col items-center text-center flex-shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-[#00a4c6] to-[#0dd3b6] p-1 shadow-xl">
                    <div className="w-full h-full bg-[#141e27] rounded-[14px] flex flex-col items-center justify-center text-white p-2">
                      <UserCheck className="w-12 h-12 text-[#0dd3b6] mb-1" />
                      <span className="text-xs font-black tracking-wider text-white">ALEX</span>
                      <span className="text-[10px] text-slate-400">Founder &amp; Dev</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#0dd3b6]/10 text-[#0dd3b6] text-xs font-bold">
                      Directly Reachable
                    </span>
                  </div>
                </div>

                {/* Founder Story & Direct Contact */}
                <div className="space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00a4c6] uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Founder Story &amp; Commitment
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    "I got tired of sending 40-page PDFs my clients couldn't read."
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                    "As a web developer and SEO consultant, I spent hundreds of hours pulling data from enterprise SEO tools and manually rewriting bloated PDFs into plain English so my clients would actually understand what needed fixing. 
                    Enterprise tools are built for technical SEO nerds — not for agencies trying to explain value to non-technical business owners. So I built OUTAudits: fast, plain-English, white-label audits that close deals and drive action."
                  </p>
                  
                  {/* Direct Contact Levers */}
                  <div className="pt-4 border-t border-[#374c63] flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
                    <a 
                      href="mailto:alex@outaudits.io" 
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141e27] border border-[#374c63] hover:border-[#00a4c6] text-slate-200 hover:text-white transition-all"
                    >
                      <Mail className="w-4 h-4 text-[#0dd3b6]" />
                      <span>alex@outaudits.io</span>
                    </a>
                    <a 
                      href="https://calendly.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141e27] border border-[#374c63] hover:border-[#00a4c6] text-slate-200 hover:text-white transition-all"
                    >
                      <Calendar className="w-4 h-4 text-[#00a4c6]" />
                      <span>Book 15-min Call with Alex</span>
                    </a>
                    <a 
                      href="https://twitter.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141e27] border border-[#374c63] hover:border-[#00a4c6] text-slate-200 hover:text-white transition-all"
                    >
                      <Twitter className="w-4 h-4 text-sky-400" />
                      <span>@alex_outaudits</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE PLATFORM FEATURES */}
        <FeatureGrid />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* EMBEDDABLE LEAD GENERATION WIDGET */}
        <WidgetHighlight />

        {/* SPECIFICITY OVER HYPE: COMPARISON MATRIX */}
        <section className="py-20 bg-[#0f1a24] border-t border-b border-[#374c63]/40">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                How OUTAudits Compares to Enterprise SEO Tools
              </h2>
              <p className="mt-2 text-[#c1cfda] text-sm sm:text-base">
                Built specifically for agency client reporting, not 50-page complex data dumps.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-[#141e27] rounded-2xl border border-[#374c63] overflow-hidden">
                <thead>
                  <tr className="bg-[#1c2b38] border-b border-[#374c63] text-xs text-slate-300 uppercase tracking-wider">
                    <th className="p-4 sm:p-5">Feature &amp; Signal</th>
                    <th className="p-4 sm:p-5 text-[#00a4c6] font-extrabold text-sm">OUTAudits</th>
                    <th className="p-4 sm:p-5">SEMrush</th>
                    <th className="p-4 sm:p-5">Moz</th>
                    <th className="p-4 sm:p-5">Ahrefs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#263747] text-xs sm:text-sm text-slate-200">
                  <tr className="hover:bg-[#182633]">
                    <td className="p-4 font-semibold text-white">Plain-English Executive Summaries</td>
                    <td className="p-4 text-[#0dd3b6] font-bold">✓ Included</td>
                    <td className="p-4 text-slate-500">✕ No (Jargon)</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                  </tr>
                  <tr className="hover:bg-[#182633]">
                    <td className="p-4 font-semibold text-white">AI Search Crawl Check (GPTBot, Claude)</td>
                    <td className="p-4 text-[#0dd3b6] font-bold">✓ Included</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                  </tr>
                  <tr className="hover:bg-[#182633]">
                    <td className="p-4 font-semibold text-white">Embeddable Agency Lead Gen Widget</td>
                    <td className="p-4 text-[#0dd3b6] font-bold">✓ Included</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                  </tr>
                  <tr className="hover:bg-[#182633]">
                    <td className="p-4 font-semibold text-white">Audit Speed</td>
                    <td className="p-4 text-[#00a4c6] font-bold">~30 seconds</td>
                    <td className="p-4 text-slate-400">3–5 mins</td>
                    <td className="p-4 text-slate-400">2–3 mins</td>
                    <td className="p-4 text-slate-400">5–10 mins</td>
                  </tr>
                  <tr className="hover:bg-[#182633]">
                    <td className="p-4 font-semibold text-white">Full White-Label Branding</td>
                    <td className="p-4 text-[#0dd3b6] font-bold">✓ Included</td>
                    <td className="p-4 text-amber-400">$200+/mo add-on</td>
                    <td className="p-4 text-[#0dd3b6]">✓ Included</td>
                    <td className="p-4 text-slate-500">✕ No</td>
                  </tr>
                  <tr className="hover:bg-[#182633]">
                    <td className="p-4 font-semibold text-white">Free Plan Available</td>
                    <td className="p-4 text-[#0dd3b6] font-bold">✓ Free Forever (5/mo)</td>
                    <td className="p-4 text-slate-500">✕ Paid Trial</td>
                    <td className="p-4 text-slate-500">✕ Paid Trial</td>
                    <td className="p-4 text-slate-500">✕ Paid Trial</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PRICING WITH RISK REVERSAL */}
        <section id="pricing" className="py-20 bg-[#141e27]">
          <div className="max-w-6xl mx-auto px-4">
            <Pricing />
            
            {/* Risk Reversal Banner */}
            <div className="mt-12 max-w-3xl mx-auto bg-[#1b2a38] border border-[#00a4c6]/40 p-6 rounded-2xl text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-[#0dd3b6] font-bold text-sm">
                <ShieldCheck className="w-5 h-5" /> 100% Risk Reversal Guarantee
              </div>
              <p className="text-sm text-slate-300">
                Start completely free with no credit card. If you upgrade to Pro or Agency and your clients don't love the reports, we offer a <strong className="text-white">30-day 100% money-back guarantee</strong>. No questions asked.
              </p>
            </div>
          </div>
        </section>

        {/* TRANSPARENT FAQ */}
        <section id="faq" className="py-20 bg-[#0f1a24] border-t border-[#374c63]/40">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#00a4c6] uppercase tracking-widest bg-[#00a4c6]/10 px-3 py-1 rounded-full">
                FAQ
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {transparentFaqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-[#141e27] border border-[#374c63] rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="font-bold text-base sm:text-lg text-white pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#00a4c6] transform transition-transform duration-300 flex-shrink-0 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openFaq === i && (
                    <div className="px-6 pb-6 text-sm text-[#c1cfda] leading-relaxed border-t border-[#263747] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA WITH FOUNDER REACHABILITY */}
        <section className="py-20 bg-gradient-to-b from-[#141e27] to-[#0f1a24] text-center border-t border-[#374c63]/40">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0dd3b6]/10 text-[#0dd3b6] text-xs font-bold">
              <Sparkles className="w-4 h-4" /> Ready to impress your clients?
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Start Delivering Plain-English Audits Today
            </h2>
            <p className="text-[#c1cfda] text-base sm:text-lg max-w-2xl mx-auto">
              Join forward-thinking agencies delivering plain-English SEO &amp; AI visibility reports under their own brand.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#00a4c6] hover:bg-[#0093b2] text-white font-bold text-base shadow-lg shadow-[#00a4c6]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Free Audit (No Credit Card)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="mailto:alex@outaudits.io" 
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#1a2a38] border border-[#374c63] hover:border-[#00a4c6] text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5 text-[#0dd3b6]" />
                <span>Email Alex Directly</span>
              </a>
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Free 5 audits/month • 14-day Pro trial • 30-day money-back guarantee
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <Footer2 />
      </main>
    </div>
  )
}

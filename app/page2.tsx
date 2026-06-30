'use client'

import { use, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Zap, Shield, TrendingUp, CheckCircle, Globe, KeySquare, LinkIcon, BarChart3, Play, ArrowRight, AlertCircle, Sparkles, Lock, Users, Clock, Palette, Target, Image as ImageIcon, Code as CodeIcon, Mail as MailIcon, BookOpen, Star } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { ToolCarouselCard } from '@/components/tool-carousel'
import BaseHeader from '@/components/base-header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import './globals.css'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const [competitors, setCompetitors] = useState(['', '', ''])
  const [showVideoModal, setShowVideoModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // if (user){
  //   router.push('/dashboard')
  // }
  // Reusable screenshot / demo placeholder component
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

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    trackVisitor()
  }, [])

  const trackVisitor = async () => {

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/visitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_url: window.location.href,
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
        })
      });
    } catch (error) {
      console.error('Error tracking visitor:', error)
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if(response.status == 401){
        setIsLoading(false)
        //push to signin
        router.push('/signin')
      }
      const data = await response.json()
      
      if (data.job_id) {
        router.push(`/audit/${data.job_id}`)
      }
      
    } catch (error) {
      console.error('Error starting audit:', error)
      setIsLoading(false)
    }
  }

  const handleDeepCrawl = async () => {
    if (!url) return
 
    setIsCrawling(true)
    
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, max_pages: 500 }),
      })

      if(response.status == 401){
        setIsLoading(false)
        router.push('/signin')
      }
 
      const data = await response.json()
      
      if (data.job_id) {
        router.push(`/crawl/${data.job_id}`)
      }
    } catch (error) {
      console.error('Error starting crawl:', error)
      setIsCrawling(false)
    }
  }

  const handleCompare = async () => {
    if (!url) return
    const validCompetitors = competitors.filter(c => c.trim())
    if (validCompetitors.length === 0) return
 
    setIsComparing(true)
    
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          target_url: url, 
          competitor_urls: validCompetitors 
        }),
      })
 
      const data = await response.json()
      
      if (data.job_id) {
        router.push(`/compare/${data.job_id}`)
      }
    } catch (error) {
      console.error('Error starting comparison:', error)
      setIsComparing(false)
    }
  }

    const CompetitorInputs = () => (
    <>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">
          Competitor Websites (up to 3)
        </label>
        {competitors.map((comp, i) => (
          <Input
            key={i}
            type="url"
            placeholder={`https://competitor${i + 1}.com`}
            value={comp}
            onChange={(e) => {
              const newComps = [...competitors]
              newComps[i] = e.target.value
              setCompetitors(newComps)
            }}
            className="h-12"
          />
        ))}
      </div>
      
      <Button
        onClick={handleCompare}
        disabled={isComparing || !url || competitors.every(c => !c.trim())}
        // variant="gradient"
        size="lg"
        className="w-full h-14"
      >
        {isComparing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Starting comparison...
          </>
        ) : (
          <>
            <TrendingUp className="w-5 h-5 mr-2" />
            Compare Now
          </>
        )}
      </Button>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <BaseHeader user = {user} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-gray-50 opacity-60" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block animate-fade-in-down">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                The Agency-First Audit Tool
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-fade-in-down" style={{animationDelay: '0.1s'}}>
              Generate Client-Ready SEO Audits in
              <br />
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                30 Seconds
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-down" style={{animationDelay: '0.2s'}}>
              White-label everything. Embed on your site to capture leads. <br className="hidden md:inline"/>
              Stop wasting time juggling 5 different tools.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-down" style={{animationDelay: '0.3s'}}>
              <Link href="#audit-form">
                <Button size="lg" className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 h-14 text-base">
                  <Zap className="w-5 h-5 mr-2" />
                  Try Free Audit
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-slate-300 px-8 h-14 text-base"
                onClick={() => setShowVideoModal(true)}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo (30 sec)
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 pt-8 animate-fade-in-down" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>5+ Hours Saved Per Week</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>White-Label Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>2,000+ Agencies Using</span>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Audit Form */}
            <Card className="max-w-2xl mx-auto shadow-xl" id="audit-form">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Input
                    type="url"
                    placeholder="Enter website URL (e.g., https://example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-lg h-14"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="h-14 px-8 bg-gradient-to-r from-slate-900 to-slate-800 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Audit Now
                      </>
                    )}
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  No credit card required • Free tier available • Results in ~60 seconds
                </p>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>5+ Hours Saved Per Week</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>White-Label Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>2,000+ Agencies Using</span>
              </div>
            </div>
          {/* </div>
        </div>
      </section> */}

      {/* Core Problem Section - Emotional Hook */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                You're Spending Hours on Audits While Your Competitors Close Deals Faster
              </h2>
              <p className="text-xl text-gray-600">The Reality Agencies Face:</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white border-l-4 border-l-red-500 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-6 h-6 text-red-600" />
                    <p className="text-lg font-semibold text-gray-900">Time Drain</p>
                  </div>
                  <p className="text-gray-600">Manual crawls, spreadsheets, multiple tools. 10+ hours per client per month lost to repetitive work.</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                    <p className="text-lg font-semibold text-gray-900">Trust Gap</p>
                  </div>
                  <p className="text-gray-600">Your unbranded reports don't look like YOUR expertise. Prospects question if you're just reselling.</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6 text-yellow-600" />
                    <p className="text-lg font-semibold text-gray-900">No Lead Gen</p>
                  </div>
                  <p className="text-gray-600">You're not capturing contact info from prospects who use your tools. Leads slip through the cracks.</p>
                </CardContent>
              </Card>
            </div>

            <p className="text-gray-600 text-lg italic pt-4">
              Result? Your competitors close 2x more deals, charge more, and have better margins. You're stuck in the cycle of doing the work instead of building the business.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section - Quick Win */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Meet Your New Competitive Advantage
            </h2>
            <p className="text-xl text-gray-600">Three Ways OUTAudits Transforms Your Agency</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Speed */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Audits in 30 Seconds</h3>
                <p className="text-gray-600">No manual crawling. No spreadsheets. Professional, client-ready reports instantly.</p>
                <p className="text-sm font-semibold text-blue-600 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Save 5–10 hours/week per client</p>
              </CardContent>
            </Card>

            {/* Branding */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <Palette className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">100% White-Labeled</h3>
                <p className="text-gray-600">Your logo. Your colors. Your messaging. Clients think it's your proprietary tool.</p>
                <p className="text-sm font-semibold text-purple-600 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Differentiate from competitors</p>
              </CardContent>
            </Card>

            {/* Lead Gen */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Embed & Capture Leads</h3>
                <p className="text-gray-600">Add an audit form to your website. Every audit = a qualified lead tracked and owned by you.</p>
                <p className="text-sm font-semibold text-emerald-600 flex items-center gap-2"><Target className="w-4 h-4" /> Turn prospects into leads</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Three Steps to Your First Client-Ready Audit
            </h2>
            <p className="text-xl text-gray-600">It's ridiculously simple.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-6 items-start animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  <LinkIcon className="w-8 h-8" />
                </div>
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter a URL</h3>
                  <p className="text-gray-600">Paste any website URL into OUTAudits (or embed our form on your site)</p>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  <BarChart3 className="w-8 h-8" />
                </div>
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">We Audit in 30 Seconds</h3>
                  <p className="text-gray-600">Our crawler runs technical checks, competitor analysis, keyword research</p>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Deliver a Branded Report</h3>
                  <p className="text-gray-600">White-labeled PDF or live dashboard. You look like the expert. You close the deal.</p>
                </div>
              </div>
            </div>

            {/* CTA Below */}
            <div className="mt-12 text-center">
              <Link href="#audit-form">
                <Button size="lg" className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 h-14 text-base">
                  <Zap className="w-5 h-5 mr-2" />
                  Try Your First Audit Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Immediate Proof - Audit Preview Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              See What Your Clients Get
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional audit reports that impress prospects and close deals
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Report Preview Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Report visual placeholder */}
              
              {/* Report Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-12 text-white">
                <div className="max-w-2xl">
                  <div className="inline-block mb-4 px-4 py-2 bg-primary-500/20 border border-primary-400/50 rounded-lg text-sm font-medium text-primary-200">
                    ✓ SEO Audit Report
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Website Performance Audit</h3>
                  <p className="text-gray-300">example.com • March 18, 2026</p>
                </div>
              </div>
              <div className="p-6">
                <ScreenshotPlaceholder label="Report Screenshot" size="lg" />
              </div>
              {/* Report Content */}
              <div className="p-8 space-y-8">
                {/* Scores Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-6 text-center border border-emerald-200">
                    <div className="text-4xl font-black text-emerald-600 mb-2">92</div>
                    <p className="text-sm font-medium text-gray-700">Performance</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                    <div className="text-4xl font-black text-blue-600 mb-2">88</div>
                    <p className="text-sm font-medium text-gray-700">SEO</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-200">
                    <div className="text-4xl font-black text-purple-600 mb-2">95</div>
                    <p className="text-sm font-medium text-gray-700">Accessibility</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-6 text-center border border-orange-200">
                    <div className="text-4xl font-black text-orange-600 mb-2">90</div>
                    <p className="text-sm font-medium text-gray-700">Security</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="font-bold text-lg mb-4">Key Metrics</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Largest Contentful Paint</span>
                      <span className="font-semibold text-emerald-600">1.2s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">First Input Delay</span>
                      <span className="font-semibold text-emerald-600">45ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cumulative Layout Shift</span>
                      <span className="font-semibold text-emerald-600">0.05</span>
                    </div>
                  </div>
                </div>

                {/* SEO Opportunities */}
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="font-bold text-lg mb-4">SEO Opportunities</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Add missing meta descriptions</p>
                        <p className="text-sm text-gray-600">23 pages missing optimized meta tags</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Improve internal linking strategy</p>
                        <p className="text-sm text-gray-600">Strengthen topical authority with better links</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Fix broken backlinks</p>
                        <p className="text-sm text-gray-600">127 broken links detected - recover lost authority</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Sitemap & robots.txt optimized</p>
                        <p className="text-sm text-gray-600">Crawlability fully optimized</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Footer */}
                <div className="border-t border-gray-200 pt-8 bg-gradient-to-r from-primary-50 to-accent-50 -mx-8 -mb-8 px-8 py-8 rounded-b-2xl">
                  <p className="text-sm text-gray-700 mb-3">
                    This is exactly what you send to prospects. Professional, detailed, and ready to impress.
                  </p>
                  <p className="text-xs text-gray-600">
                    Generate unlimited reports instantly. Export as PDF and share with clients.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Proof under preview */}
            <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-black text-primary-600 mb-2">10K+</div>
                <p className="text-gray-600">Audits Run This Month</p>
              </div>
              <div>
                <div className="text-3xl font-black text-primary-600 mb-2">4.9/5</div>
                <p className="text-gray-600">Client Satisfaction</p>
              </div>
              <div>
                <div className="text-3xl font-black text-primary-600 mb-2">2M+</div>
                <p className="text-gray-600">Pages Analyzed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Lead Capture - Embedded Widget Showcase */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in-up">
              {/* Large demo placeholder showing the embedded widget in-context */}
              
              <ScreenshotPlaceholder label="Embedded Widget Preview" size="lg" />

              <div className="mt-4 grid grid-cols-3 gap-3">
                <ScreenshotPlaceholder label="Form – Step 1" size="sm" />
                <ScreenshotPlaceholder label="Form – Step 2" size="sm" />
                <ScreenshotPlaceholder label="Report Preview" size="sm" />
              </div>
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.15s'}}>
              <h2 className="text-3xl font-bold mb-3">Capture Qualified Leads with an Embedded Audit Widget</h2>
              <p className="text-gray-600 mb-4">Embed a lightweight audit form on any page, collect contact details, and automatically funnel prospects into your dashboard. One-line install, full ownership of leads.</p>

              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                  <span><strong>Intent signals:</strong> Visitors submitting audits are warm leads — prioritize outreach with context.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                  <span><strong>White-label:</strong> The widget adopts your branding so clients think it's your proprietary tool.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-1" />
                  <span><strong>Seamless flow:</strong> Leads land in your dashboard with full context — notes, status, and quick email follow-ups.</span>
                </li>
              </ul>

              <div className="mb-4">
              <Card className="bg-gray-50 min-w-0">
                <CardContent>
                  <div className="text-sm text-gray-700 mb-2 font-medium">Quick embed snippet</div>

                  {/* responsive code block: allows wrapping on very small screens, keeps horizontal scroll when necessary */}
                  <div className="w-full overflow-auto rounded border bg-white">
                    <pre className="m-0 p-3 text-sm font-mono whitespace-pre-wrap break-words max-w-full">
            {`<script src="${process.env.NEXT_PUBLIC_API_URL}/embed/widget.js?api_key=YOUR_KEY"></script>
            <div id="outaudits-widget"></div>`}
                    </pre>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Copy this snippet into your site header or footer to load the widget. Replace YOUR_KEY with your API key from the Embed settings.
                  </div>
                </CardContent>
              </Card>
            </div>

              <div className="flex gap-3">
                <Link href="/audit/embed" className="inline-block">
                  <Button className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">See Live Demo</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline">Start Capturing Leads</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Built for{' '}
              <span className="text-gradient">Digital Agencies</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to win clients and deliver results
            </p>
            <div className="p-6">
                <ScreenshotPlaceholder label="Report Screenshot" size="lg" />
            </div>
          </div>

          

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Zap className="w-6 h-6 text-slate-600" />,
                title: '30-Second Audits',
                description: 'Generate client-ready reports instantly'
              },
              {
                icon: <Shield className="w-6 h-6 text-slate-600" />,
                title: 'Professional Reports',
                description: 'White-label PDFs you can brand and send'
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-slate-600" />,
                title: 'Win More Clients',
                description: 'Impress prospects with data-driven insights'
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-slate-600" />,
                title: 'Track Everything',
                description: 'Deep crawls, rank tracking, competitor analysis'
              }
            ].map((feature, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          
        </div>
      </section>
 

      {/* Tools Carousel Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">
              Complete SEO Toolkit
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beyond audits — advanced tools to help your clients (and your agency) dominate search rankings
            </p>
          </div>

          <div className="max-w-7xl select-none mx-auto px-4">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 10000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="ml-0">
                {/* Deep Crawl */}
                <CarouselItem className="pl-0 md:basis-1/2 lg:basis-1/3">
                  <div className="px-2">
                    <ToolCarouselCard
                      icon={<Globe className="w-8 h-8 mb-3" />}
                      title="Deep Crawl"
                      description="Crawl every page of your website"
                      briefPoints={[
                        'Analyze 500+ pages instantly',
                        'Detect broken internal links',
                        'Find duplicate content issues',
                        'Identify crawl errors',
                      ]}
                      previewContent={
                        <div className="space-y-3 text-sm">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="font-semibold text-gray-900">Pages Crawled: 487</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-red-50 rounded p-2 border border-red-100">
                              <p className="text-xs text-red-600 font-semibold">23 Broken</p>
                              <p className="text-xs text-gray-600">Links</p>
                            </div>
                            <div className="bg-amber-50 rounded p-2 border border-amber-100">
                              <p className="text-xs text-amber-600 font-semibold">12 Duplicates</p>
                              <p className="text-xs text-gray-600">Found</p>
                            </div>
                          </div>
                        </div>
                      }
                      ctaText="Start Deep Crawl"
                      ctaHref="/crawl"
                      gradientFrom="from-cyan-500"
                      gradientTo="to-cyan-600"
                      accentColor="bg-cyan-500"
                    />
                  </div>
                </CarouselItem>

                {/* Competitor Comparison */}
                <CarouselItem className="pl-0 md:basis-1/2 lg:basis-1/3">
                  <div className="px-2">
                    <ToolCarouselCard
                      icon={<TrendingUp className="w-8 h-8 mb-3" />}
                      title="Competitor Compare"
                      description="See how you stack up against competitors"
                      briefPoints={[
                        'Compare up to 5 competitors',
                        'Side-by-side metrics analysis',
                        'Performance scoring',
                        'Identify quick wins',
                      ]}
                      previewContent={
                        <div className="space-y-3 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">Your Site</span>
                              <span className="font-bold text-purple-600">88</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Competitor A</span>
                              <span className="font-bold text-gray-600">72</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Competitor B</span>
                              <span className="font-bold text-gray-600">81</span>
                            </div>
                          </div>
                          <div className="bg-green-50 rounded p-2 border border-green-100 text-center">
                            <p className="text-xs text-green-700 font-semibold">You're ahead by 16 points</p>
                          </div>
                        </div>
                      }
                      ctaText="Compare Now"
                      ctaHref="/compare"
                      gradientFrom="from-purple-500"
                      gradientTo="to-purple-600"
                      accentColor="bg-purple-500"
                    />
                  </div>
                </CarouselItem>

                {/* Rank Tracking */}
                <CarouselItem className="pl-0 md:basis-1/2 lg:basis-1/3">
                  <div className="px-2">
                    <ToolCarouselCard
                      icon={<TrendingUp className="w-8 h-8 mb-3" />}
                      title="Rank Tracking"
                      description="Monitor keyword rankings daily"
                      briefPoints={[
                        'Daily rank updates',
                        'Track 50+ keywords',
                        'Historical trending data',
                        'Competitor rank tracking',
                      ]}
                      previewContent={
                        <div className="space-y-3 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-xs">SEO audit</span>
                              <span className="font-bold text-green-600">#5</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-xs">website auditor</span>
                              <span className="font-bold text-green-600">#12</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-xs">page speed test</span>
                              <span className="font-bold text-amber-600">#24</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="text-center">
                              <p className="text-xs text-green-600 font-semibold">↑ 3</p>
                              <p className="text-xs text-gray-600">Week</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-green-600 font-semibold">↑ 12</p>
                              <p className="text-xs text-gray-600">Month</p>
                            </div>
                          </div>
                        </div>
                      }
                      ctaText="Track Keywords"
                      ctaHref="/rank-tracking"
                      gradientFrom="from-green-500"
                      gradientTo="to-green-600"
                      accentColor="bg-green-500"
                    />
                  </div>
                </CarouselItem>

                {/* Backlink Analysis */}
                <CarouselItem className="pl-0 md:basis-1/2 lg:basis-1/3">
                  <div className="px-2">
                    <ToolCarouselCard
                      icon={<LinkIcon className="w-8 h-8 mb-3" />}
                      title="Backlink Analysis"
                      description="Discover link opportunities"
                      briefPoints={[
                        'Total backlink count analysis',
                        'Domain authority scoring',
                        'Link quality assessment',
                        'Competitor backlinks',
                      ]}
                      previewContent={
                        <div className="space-y-3 text-sm">
                          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                            <p className="text-xs text-orange-600 font-semibold mb-1">Total Backlinks</p>
                            <p className="text-2xl font-bold text-orange-600">1,247</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-xs text-gray-600">Domain Auth</p>
                              <p className="font-bold text-gray-900">42</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                              <p className="text-xs text-gray-600">Quality Score</p>
                              <p className="font-bold text-gray-900">7.8/10</p>
                            </div>
                          </div>
                        </div>
                      }
                      ctaText="Analyze Backlinks"
                      ctaHref="/backlinks"
                      gradientFrom="from-orange-500"
                      gradientTo="to-orange-600"
                      accentColor="bg-orange-500"
                    />
                  </div>
                </CarouselItem>

                {/* Keyword Analysis */}
                <CarouselItem className="pl-0 md:basis-1/2 lg:basis-1/3">
                  <div className="px-2">
                    <ToolCarouselCard
                      icon={<KeySquare className="w-8 h-8 mb-3" />}
                      title="Keyword Analysis"
                      description="Find winning keywords"
                      briefPoints={[
                        'Related keyword suggestions',
                        'Search volume data',
                        'Keyword difficulty scoring',
                        'CPC analysis',
                      ]}
                      previewContent={
                        <div className="space-y-3 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-xs">seo tools</span>
                              <span className="text-xs"><span className="font-bold text-gray-900">12K</span> vol</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-xs">free seo checker</span>
                              <span className="text-xs"><span className="font-bold text-gray-900">8.2K</span> vol</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 text-xs">site audit tool</span>
                              <span className="text-xs"><span className="font-bold text-gray-900">5.1K</span> vol</span>
                            </div>
                          </div>
                          <div className="bg-pink-50 rounded p-2 border border-pink-100">
                            <p className="text-xs text-pink-700 font-semibold">Avg Difficulty: 35</p>
                          </div>
                        </div>
                      }
                      ctaText="Find Keywords"
                      ctaHref="/keywords"
                      gradientFrom="from-pink-500"
                      gradientTo="to-pink-600"
                      accentColor="bg-pink-500"
                    />
                  </div>
                </CarouselItem>

                {/* Dashboard */}
                <CarouselItem className="pl-0 md:basis-1/2 lg:basis-1/3">
                  <div className="px-2">
                    <ToolCarouselCard
                      icon={<BarChart3 className="w-8 h-8 mb-3" />}
                      title="Dashboard"
                      description="Manage all your audits"
                      briefPoints={[
                        'Real-time activity tracking',
                        'Credit usage monitoring',
                        'Team collaboration settings',
                        'Advanced reporting',
                      ]}
                      previewContent={
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50 rounded p-2 border border-blue-100">
                              <p className="text-xs text-blue-600 font-semibold">Credits Left</p>
                              <p className="text-lg font-bold text-blue-600">2,450</p>
                            </div>
                            <div className="bg-indigo-50 rounded p-2 border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-semibold">This Month</p>
                              <p className="text-lg font-bold text-indigo-600">147</p>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded p-2 border border-gray-200">
                            <p className="text-xs text-gray-600 font-semibold mb-1">Recent Activity</p>
                            <div className="space-y-1 text-xs text-gray-600">
                              <p>✓ Audit completed - example.com</p>
                              <p>✓ Crawl finished - 487 pages</p>
                            </div>
                          </div>
                        </div>
                      }
                      ctaText="Go to Dashboard"
                      ctaHref="/dashboard"
                      gradientFrom="from-indigo-500"
                      gradientTo="to-indigo-600"
                      accentColor="bg-indigo-500"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>

              {/* Navigation Buttons */}
              <CarouselPrevious className="hidden md:flex -left-12 bg-gray-900 hover:bg-gray-800 text-white border-0" />
              <CarouselNext className="hidden md:flex -right-12 bg-gray-900 hover:bg-gray-800 text-white border-0" />
            </Carousel>

            {/* Mobile Indicator Dots */}
            <div className="flex justify-center gap-2 mt-8 md:hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation Section - Why OUTAudits? */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
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
                  <th className="px-6 py-4 text-center font-bold text-emerald-300">OUTAudits</th>
                  <th className="px-6 py-4 text-center font-bold">SEMrush</th>
                  <th className="px-6 py-4 text-center font-bold">Moz</th>
                  <th className="px-6 py-4 text-center font-bold">Ahrefs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">White-Label Reports</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">Full</span></td>
                  <td className="px-6 py-4 text-center"><AlertCircle className="w-5 h-5 text-amber-600 inline" /> <span className="text-xs text-amber-600 font-semibold">Limited</span></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">Full</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">Embeddable Lead Gen Widget</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">Yes</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">Audit Speed</td>
                  <td className="px-6 py-4 text-center"><Zap className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">30 sec</span></td>
                  <td className="px-6 py-4 text-center">3–5 min</td>
                  <td className="px-6 py-4 text-center">2–3 min</td>
                  <td className="px-6 py-4 text-center">5–10 min</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">Agency-Friendly Pricing</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">Affordable</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">Expensive</span></td>
                  <td className="px-6 py-4 text-center"><AlertCircle className="w-5 h-5 text-amber-600 inline" /> <span className="text-xs text-amber-600 font-semibold">Mid-range</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">Expensive</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">Self-Hosting Option</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">Yes</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">API for Integrations</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">Yes</span></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">Yes</span></td>
                  <td className="px-6 py-4 text-center"><Lock className="w-5 h-5 text-red-600 inline" /> <span className="text-xs text-red-600 font-semibold">No</span></td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-5 h-5 text-emerald-600 inline" /> <span className="text-xs text-emerald-600 font-semibold">Yes</span></td>
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

      {/* Testimonials - How They Use OUTAudits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">
              How They Use OUTAudits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals using OUTAudits to grow their business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Digital Marketer */}
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    JM
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Jessica Martinez</h4>
                    <p className="text-sm text-gray-600">Digital Marketing Manager</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "OUTAudits saves me hours every week. I run audits on all our client websites and use the reports to pitch additional services. The white-label PDFs make us look like we have a huge team."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0</span>
                </div>
              </CardContent>
            </Card>

            {/* SEO Consultant */}
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    RK
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Rajesh Kumar</h4>
                    <p className="text-sm text-gray-600">SEO Consultant</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The competitor comparison tool is incredible. I show clients exactly how they're losing to competitors. The rank tracking feature helps me prove ROI month over month."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0</span>
                </div>
              </CardContent>
            </Card>

            {/* Freelancer */}
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    AW
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Amy Wilson</h4>
                    <p className="text-sm text-gray-600">Freelance SEO Specialist</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "As a solo freelancer, OUTAudits makes me look like a full-service agency. I generate audits in seconds and deliver them to prospects. It's closed so many deals for me."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0</span>
                </div>
              </CardContent>
            </Card>

            {/* Web Developer */}
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    MC
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Marcus Chen</h4>
                    <p className="text-sm text-gray-600">Web Developer & Designer</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "I use OUTAudits to give my development clients ongoing recommendations. The deep crawl report shows technical issues I might have missed, and now I offer audits as a service."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0</span>
                </div>
              </CardContent>
            </Card>

            {/* Agency Owner */}
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    SL
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Sarah Lopez</h4>
                    <p className="text-sm text-gray-600">Digital Marketing Agency Owner</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "We white-labeled OUTAudits and now offer it as a standalone service to our clients. The API access lets us integrate audits directly into our platform. Game changer."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0</span>
                </div>
              </CardContent>
            </Card>

            {/* Content Strategist */}
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    TP
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Tanya Patel</h4>
                    <p className="text-sm text-gray-600">Content Strategist</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "I use the keyword analysis tool to validate content ideas and the rank tracking to monitor our blog performance. OUTAudits connects everything I need in one place."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">5.0</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-3xl font-black text-primary-600 mb-2">5K+</p>
              <p className="text-sm text-gray-600">Agencies</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-3xl font-black text-primary-600 mb-2">12K+</p>
              <p className="text-sm text-gray-600">Freelancers</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-3xl font-black text-primary-600 mb-2">8K+</p>
              <p className="text-sm text-gray-600">Consultants</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-3xl font-black text-primary-600 mb-2">4.9/5</p>
              <p className="text-sm text-gray-600">Avg Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* White-label & Integrations */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">White-label, API & Integrations</h2>
              <p className="text-lg text-gray-600 mb-6">
                Ship client-ready reports under your brand, automate workflows with our API, and connect the tools your agency already uses.
              </p>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center">W</div>
                  <div>
                    <p className="font-semibold text-gray-900">Full white-label PDFs</p>
                    <p className="text-sm text-gray-600">Customize logos, colors, and messaging so reports look like your product.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">API</div>
                  <div>
                    <p className="font-semibold text-gray-900">Programmatic access</p>
                    <p className="text-sm text-gray-600">Create audits, fetch results, and automate exports with our REST API and webhooks.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">S</div>
                  <div>
                    <p className="font-semibold text-gray-900">Self-hosting option</p>
                    <p className="text-sm text-gray-600">Run OUTAudits on your infrastructure for extra control and data residency.</p>
                  </div>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pricing">
                  <Button className="bg-primary-600 text-white">See Plans</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Request a Demo</Button>
                </Link>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Export & Brand</h4>
                  <p className="text-sm text-gray-600 mb-3">White-label PDF export with cover pages, custom intro, and client notes.</p>
                  <div className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded">PDF • White-label</div>
                </div>

                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">API & Webhooks</h4>
                  <p className="text-sm text-gray-600 mb-3">Trigger audits, receive completion webhooks, and sync results to your tools.</p>
                  <div className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded">REST • Webhooks</div>
                </div>

                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Team & Permissions</h4>
                  <p className="text-sm text-gray-600 mb-3">Invite teammates, set roles, and share projects with granular controls.</p>
                  <div className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded">Teams • Roles</div>
                </div>

                <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Integrations</h4>
                  <p className="text-sm text-gray-600 mb-3">Connect with Slack, Google Drive, and reporting platforms to automate delivery.</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs">G</div>
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs">S</div>
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs">Sl</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-600">
                <p><strong>Note:</strong> API access and self-hosted options are available on the Agency plan and higher. Contact sales for white-label onboarding.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Questions? We've Got Answers.
            </h2>
            <p className="text-xl text-gray-600">Everything you need to know about OUTAudits</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "How is OUTAudits different from SEMrush or Moz?",
                a: "OUTAudits is built specifically for agencies and freelancers. We focus on speed (30-second audits), white-labeling (full branding control), and lead generation (embeddable widget). Enterprise tools like SEMrush are overkill and expensive for agencies that need simple, fast, branded reports."
              },
              {
                q: "Can I really white-label everything?",
                a: "Yes, 100%. Your logo, colors, messaging, and branding throughout. Your clients will think it's your proprietary tool. You can even embed the widget on your website to capture leads directly."
              },
              {
                q: "Do you capture leads from the embedded widget?",
                a: "Yes! When you embed our audit form on your website, every person who runs an audit gets tracked with their email and website. You own those leads completely. No sharing, no middleman."
              },
              {
                q: "How much can I really save?",
                a: "Most agencies save 5–10 hours per week per client. No more manual crawls, spreadsheets, or jumping between tools. Generate professional reports in seconds."
              },
              {
                q: "Can I integrate OUTAudits with my other tools?",
                a: "Yes. We have a full REST API, webhooks, and integrations with popular platforms. You can automate audits, sync data, and build custom workflows."
              },
              {
                q: "What if I don't want to host it with you?",
                a: "We offer a self-hosted option on our Agency plan. Run OUTAudits on your own infrastructure for privacy, compliance, or data residency requirements."
              }
            ].map((faq, i) => (
              <Card key={i} className="border-l-4 border-l-primary-600 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <p className="font-bold text-gray-900 text-lg mb-3">{faq.q}</p>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="mailto:support@outaudits.io">
              <Button variant="outline" className="border-2">
                Email Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Optimized */}
      <section className="py-24 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                Stop Wasting Time.<br />
                Start Winning Deals.
              </h2>
              <p className="text-xl md:text-2xl text-white/90">
                Join 2,000+ agencies who audit faster, look smarter, capture qualified leads, and close more deals.
              </p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-lg p-8 backdrop-blur">
              <div>
                <p className="text-3xl font-black text-emerald-300">30 sec</p>
                <p className="text-sm text-white/80">Per Audit</p>
              </div>
              <div className="border-l border-r border-white/20">
                <p className="text-3xl font-black text-blue-300">5-10 hrs</p>
                <p className="text-sm text-white/80">Saved/Week</p>
              </div>
              <div>
                <p className="text-3xl font-black text-purple-300">100%</p>
                <p className="text-sm text-white/80">White-Labeled</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="#audit-form">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 font-bold px-8 h-14 text-base">
                  <Zap className="w-5 h-5 mr-2" />
                  Try Free for 14 Days
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 h-14 text-base">
                  View Plans
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Bottom Text */}
            <div className="text-white/80 text-sm space-y-1">
              <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success-400" /> No credit card required</p>
              <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success-400" /> Full features included</p>
              <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success-400" /> Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">OUTAudits</span>
              </div>
              <p className="text-sm text-gray-400">
                Professional website auditing powered by Google Lighthouse
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/audit" className="hover:text-primary-400 transition">Website Audit</Link></li>
                <li><Link href="/crawl" className="hover:text-primary-400 transition">Deep Crawl</Link></li>
                <li><Link href="/rank-tracking" className="hover:text-primary-400 transition">Rank Tracking</Link></li>
                <li><Link href="/keywords" className="hover:text-primary-400 transition">Keyword Research</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/dashboard" className="hover:text-primary-400 transition">Dashboard</Link></li>
                <li><Link href="#how-it-works" className="hover:text-primary-400 transition">How It Works</Link></li>
                <li><Link href="#features" className="hover:text-primary-400 transition">Features</Link></li>
                <li><Link href="mailto:support@outaudits.com" className="hover:text-primary-400 transition">Support</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="hover:text-primary-400 transition">Blog</Link></li>
                <li><Link href="/use-cases" className="hover:text-primary-400 transition">Use Cases</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-primary-400 transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary-400 transition">Privacy Policy</Link></li>
                <li><Link href="mailto:legal@outaudits.com" className="hover:text-primary-400 transition">Contact Legal</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-xs">
              © {new Date().getFullYear()} OutAudits. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
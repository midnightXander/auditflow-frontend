'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Zap, Shield, TrendingUp, CheckCircle, Globe } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/lib/auth-context'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const [competitors, setCompetitors] = useState(['', '', ''])
  const router = useRouter()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    console.log(`API URL: ${process.env.NEXT_PUBLIC_API_URL}`)
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

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

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Get comprehensive audit results in under 60 seconds'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '10 Audit Categories',
      description: 'Performance, accessibility, SEO, security, and more'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Actionable Insights',
      description: 'Clear recommendations with priority and impact estimates'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Google Lighthouse',
      description: 'Powered by the industry-standard auditing tool'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 " />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-ransparent">
              AuditFlow
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              How It Works
            </Link>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-accent-50 to-gray-50 opacity-60" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                <Zap className="w-4 h-4" />
                Powered by Google Lighthouse
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Professional{' '}
              <span className="bg-gradient-to-r from-gray-400 to-gray-900 bg-clip-text text-transparent">
                Website Auditing
              </span>
              <br />
              Made Simple
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Get comprehensive insights on performance, accessibility, SEO, and security in just 60 seconds
            </p>

            {/* Audit Form */}
            <Card className="max-w-2xl mx-auto shadow-xl">
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
                    className="h-14 px-8 text-lg"
                    disabled={isLoading}
                    // variant="gradient"
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
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <Button
                    onClick={handleDeepCrawl}
                    disabled={isCrawling || !url}
                    variant="outline"
                    size="lg"
                    className="w-full h-12 text-base border-2"
                  >
                    {isCrawling ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Starting deep crawl...
                      </>
                    ) : (
                      <>
                        <Globe className="w-5 h-5 mr-2" />
                        Deep Crawl (up to 500 pages)
                      </>
                    )}
                  </Button>
                  </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Free • No signup required • Results in ~60 seconds
                </p>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>10+ Audit Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>Google Lighthouse Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span>100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="text-gradient">Optimize Your Website</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade auditing with actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-green">
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

      {/* <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Compare Against{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Competitors
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                See how your site stacks up against the competition
              </p>
            </div>
 
            <Card className="shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Your Website
                  </label>
                  <Input
                    type="url"
                    placeholder="https://yoursite.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-12"
                  />
                </div>
                
                <CompetitorInputs />
                
                <p className="text-xs text-gray-500 text-center">
                  We'll audit all sites in parallel and show you who wins in each category
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get insights in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Enter URL', desc: 'Paste your website URL into the input field' },
              { step: '2', title: 'We Audit', desc: 'Our system runs 10+ comprehensive checks' },
              { step: '3', title: 'Get Results', desc: 'View detailed reports and recommendations' }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Tools Carousel Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold mb-4">
                    Complete SEO Toolkit
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Beyond audits — advanced tools to help your clients (and your agency) dominate search rankings
                  </p>
                </div>
      
                <div className="max-w-7xl mx-auto">
                  {/* Carousel Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Deep Crawl Card */}
                    <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 text-white h-48 flex flex-col justify-between">
                        <div>
                          <Globe className="w-8 h-8 mb-3" />
                          <h3 className="text-2xl font-bold">Deep Crawl</h3>
                        </div>
                        <p className="text-cyan-100">Crawl every page of your website</p>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-cyan-600" />
                            Analyze 500+ pages
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-cyan-600" />
                            Broken links detection
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-cyan-600" />
                            Duplicate content
                          </li>
                        </ul>
                        <Link href="/crawl">
                          <Button variant="outline" className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                            Try Now →
                          </Button>
                        </Link>
                      </div>
                    </div>
      
                    {/* Competitor Comparison Card */}
                    <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white h-48 flex flex-col justify-between">
                        <div>
                          <TrendingUp className="w-8 h-8 mb-3" />
                          <h3 className="text-2xl font-bold">Competitor Compare</h3>
                        </div>
                        <p className="text-purple-100">See how you stack up</p>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            Side-by-side analysis
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            Performance comparison
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            Up to 5 competitors
                          </li>
                        </ul>
                        <Link href="/compare">
                          <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                            Compare Now →
                          </Button>
                        </Link>
                      </div>
                    </div>
      
                    {/* Rank Tracking Card */}
                    <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white h-48 flex flex-col justify-between">
                        <div>
                          <TrendingUp className="w-8 h-8 mb-3" />
                          <h3 className="text-2xl font-bold">Rank Tracking</h3>
                        </div>
                        <p className="text-green-100">Monitor keyword rankings daily</p>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Daily rank updates
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Track 50+ keywords
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Historical data
                          </li>
                        </ul>
                        <Link href="/rank-tracking">
                          <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                            Track Keywords →
                          </Button>
                        </Link>
                      </div>
                    </div>
      
                    {/* Backlink Analysis Card */}
                    <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white h-48 flex flex-col justify-between">
                        <div>
                          {/* <LinkIcon className="w-8 h-8 mb-3" /> */}
                          <h3 className="text-2xl font-bold">Backlink Analysis</h3>
                        </div>
                        <p className="text-orange-100">Discover link opportunities</p>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-orange-600" />
                            Total backlink count
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-orange-600" />
                            Domain authority
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-orange-600" />
                            Link quality score
                          </li>
                        </ul>
                        <Link href="/backlinks">
                          <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50">
                            Analyze Backlinks →
                          </Button>
                        </Link>
                      </div>
                    </div>
      
                    {/* Keyword Analysis Card */}
                    <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 text-white h-48 flex flex-col justify-between">
                        <div>
                          {/* <KeySquare className="w-8 h-8 mb-3" /> */}
                          <h3 className="text-2xl font-bold">Keyword Analysis</h3>
                        </div>
                        <p className="text-pink-100">Find winning keywords</p>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-pink-600" />
                            Related keywords
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-pink-600" />
                            Search volume data
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-pink-600" />
                            Keyword difficulty
                          </li>
                        </ul>
                        <Link href="/keywords">
                          <Button variant="outline" className="w-full border-pink-600 text-pink-600 hover:bg-pink-50">
                            Find Keywords →
                          </Button>
                        </Link>
                      </div>
                    </div>
      
                    {/* Dashboard Card */}
                    <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 text-white h-48 flex flex-col justify-between">
                        <div>
                          {/* <BarChart3 className="w-8 h-8 mb-3" /> */}
                          <h3 className="text-2xl font-bold">Dashboard</h3>
                        </div>
                        <p className="text-indigo-100">Manage all your audits</p>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-indigo-600" />
                            Activity tracking
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-indigo-600" />
                            Credit management
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-indigo-600" />
                            Team settings
                          </li>
                        </ul>
                        <Link href="/dashboard">
                          <Button variant="outline" className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                            View Dashboard →
                          </Button>
                        </Link>
                      </div>
                    </div>
      
                  </div>
                </div>
              </div>
            </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">AuditFlow</span>
          </div>
          <p className="text-sm">
            Professional website auditing powered by Google Lighthouse
          </p>
          <p className="text-xs mt-4">
            © {new Date().getFullYear()} AuditFlow. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}
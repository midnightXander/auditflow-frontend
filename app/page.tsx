'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Zap, Shield, TrendingUp, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/audit`, {
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
'use client'

// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Dashboard - OUTAudits',
//   description: 'Manage your website audits, track credits, and view recent activity on your OUTAudits dashboard.',
// }

import { useState, useEffect } from 'react'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { useProtectedRoute } from '@/lib/protected-route'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import DashboardLayout from '@/components/dashboardLayout'
// import { differenceInDays, distanceInWordsToNow } from 'date-fns'
import { formatDate, formatDateDistanceToNow } from '@/lib/utils'
import { SunIcon, MoonIcon, ShadowIcon, Share1Icon } from "@radix-ui/react-icons"
import  { useRouter } from 'next/navigation'
import {
  BarChart3,
  TrendingUp,
  Zap,
  Globe,
  Trello,
  LinkIcon,
  KeySquare,
  ArrowRight,
  CalendarArrowUpIcon,
  Clock,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fail } from 'assert'
import { OnboardingModal } from '@/components/onboarding-modal'
import DashboardHeader from '@/components/dashboard-header'

interface QuickAction {
  label: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
}

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  created_at: string
  status: 'completed' | 'pending' | 'failed'
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { isProtected } = useProtectedRoute()
  const router = useRouter()
  const [activity, setActivity] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, completed: 0, failed: 0, by_type:{} })
  // const [leads, setLeads] = useState<any[]>([])
  // Banner visibility for promotional playbook
  const [showWorkflowsBanner, setShowWorkflowsBanner] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('outaudits_workflows_banner')
      if (!dismissed) setShowWorkflowsBanner(true)
    }
  }, [])

  const dismissWorkflowsBanner = (persist = true) => {
    setShowWorkflowsBanner(false)
    if (persist && typeof window !== 'undefined') localStorage.setItem('outaudits_workflows_banner', '1')
  }

  console.log(user)
  const maxCredits = user?.plan == 'free' ? 10 : user?.plan == 'pro' ? 100 : user?.plan == 'agency' ? 1000 : 10
  useEffect(() => {
    if (user) {
      // Load activity history from API
      fetchActivity()
      fetchStats()
      fetchLeads()
    }
  }, [user])

  const fetchActivity = async () => {
    try {
      
      const response = await fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/activities`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              },
            )
      
            if (!response.ok) {
              throw new Error('Failed to fetch activity')
            }
      
            const data = await response.json()
            // console.log('Fetched activity:', data)
      
      setActivity(data.activities || [])
    } catch (error) {
      console.error('Failed to fetch activity:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/activities/stats?current_month=true`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },

              }
            )
      
            if (!response.ok) {
              throw new Error('Failed to fetch activity')
            }
      
            const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/embed/leads`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) throw new Error('Failed to fetch leads')
      const data = await response.json()
      // API may return { leads: [...] } or an array directly
      const items = data.leads || data || []
      // Sort newest first
      items.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setLeads(items)
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    }
  }

  const quickActions: QuickAction[] = [
    {
      label: 'Website Audit',
      description: 'Analyze a website performance',
      icon: <Zap className="w-6 h-6" />,
      href: '/audit',
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Deep Crawl',
      description: 'Comprehensive site crawling',
      icon: <Globe className="w-6 h-6" />,
      href: '/crawl',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      label: 'Competitor Compare',
      description: 'Compare with competitors',
      icon: <Trello className="w-6 h-6" />,
      href: '/compare',
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Embed Audit',
      description: 'Install the lead capture widget',
      icon: <LinkIcon className="w-6 h-6" />,
      href: '/audit/embed',
      color: 'from-green-500 to-green-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the dashboard.</p>
          <Link href="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatTime = (timestamp: string) => {
    console.log('Formatting timestamp:', timestamp)
    const now = new Date()
    const date = new Date(timestamp)
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700'
      case 'pending':
        return 'bg-amber-100 text-amber-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <DashboardLayout>
    <div className="flex min-h-screen  bg-gray-50">
      <OnboardingModal />
      {/* Sidebar */}
      {/* <DashboardSidebar /> */}
      

      {/* Main content */}
      <main className="flex-1 h-screen overflow-y-auto lg:ml-0 ">
        {/* Header */}
        {/* <DashboardHeader /> */}
        <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-8 py-8">

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.full_name || user.email.split('@')[0]}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your tools</p>
          </div>

          

          {/* Promotional Banner: Proven Workflows Playbook */}
          {showWorkflowsBanner && (
            <div className="mb-8">
              <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 flex items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center text-2xl font-bold">💼</div>
                  <div>
                    <h3 className="text-2xl font-semibold">Proven Workflows to Win More Clients</h3>
                    <p className="text-sm text-white/90 mt-1 max-w-2xl">Read three actionable systems agencies and freelancers use to generate leads, retain clients, and create new revenue streams with OUTAudits.</p>
                    <div className="mt-4 flex gap-3">
                      <Link href="/blog/proven-workflows-to-win-more-clients-and-scale-revenue-with-outaudits" target="_blank">
                        <Button className="bg-white  text-slate-900 font-semibold">Read the Playbook</Button>
                      </Link>
                      <Button variant="outline" className="text-slate-900 border-white/30" onClick={() => dismissWorkflowsBanner()}>Remind me later</Button>
                      <Button variant="ghost" className="text-white/80" onClick={() => dismissWorkflowsBanner(true)}>Dismiss</Button>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block text-right text-sm text-white/80">
                  <div className="font-medium">Quick, repeatable workflows</div>
                  <div className="text-xs mt-2">30s audits • White-label PDF • Scalable playbooks</div>
                </div>
              </div>
            </div>
          )}

          {/* Credits & Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Credits Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Credits Remaining</p>
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{user.plan == 'free' ? user.credits_remaining : 'Unlimited'}</p>
              <p className="text-xs text-gray-500 mt-2">
                {user.plan === 'pro' ? 'Unlimited' :` Renews in ${formatDateDistanceToNow(user.credits_reset_date)} `}
              </p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full"
                  style={{ width: `${Math.min((user.credits_remaining / maxCredits) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Plan Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                <BarChart3 className="w-5 h-5 text-primary-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 capitalize">{user.plan}</p>
              <p className="text-xs text-gray-500 mt-2">
                {user.plan === 'pro' ? 'All features included' : 'Limited features'}
              </p>
              <Button size="sm" onClick={()=>{router.push('/pricing')}} className="w-full mt-4" variant="outline">
                Upgrade Plan
              </Button>
            </div>

            {/* Total Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total tasks</p>
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-2">All time</p>
            </div>

            {/* Activity Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <CalendarArrowUpIcon className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.total}
              </p>
              <p className="text-xs text-gray-500 mt-2">Tasks completed</p>
            </div>
          </div>

          {/* Leads Summary */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads captured</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-2">{leads.length}</h3>
                  <p className="text-xs text-gray-500 mt-1">Total leads captured</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">This month</p>
                  <div className="text-xl font-semibold text-gray-900">{leads.filter(l => {
                    const d = new Date(l.created_at)
                    const now = new Date()
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                  }).length}</div>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Recent lead alerts</div>
                {leads.length === 0 ? (
                  <p className="text-sm text-gray-500">No leads yet. Embed the audit widget to capture leads.</p>
                ) : (
                  <div className="space-y-3">
                    {leads.slice(0,3).map((lead, i) => (
                      <div key={i} className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{lead.name || lead.email || 'New lead'}</p>
                          <p className="text-xs text-gray-500">{lead.source || 'Embedded audit'}</p>
                        </div>
                        <div className="text-xs text-gray-500">{formatDateDistanceToNow(lead.created_at)}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-right">
                  <Link href="/embed/leads" className="text-sm text-primary-600 font-medium">View all leads</Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Lead alerts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{leads.filter(l => {
                const d = new Date(l.created_at)
                const now = new Date()
                // consider 'alerts' as leads in last 24h
                return (now.getTime() - d.getTime()) < (24 * 60 * 60 * 1000)
              }).length}</h3>
              <p className="text-xs text-gray-500 mt-1">New leads in last 24 hours</p>
              <div className="mt-4">
                {leads.slice(0,5).map((lead, i) => (
                  <div key={i} className="text-sm text-gray-600 py-1 border-b last:border-b-0">{lead.name || lead.email} <span className="text-xs text-gray-400">• {formatDateDistanceToNow(lead.created_at)}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <Link href="/audits" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                    <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                    <div className="flex items-center text-primary-600 text-sm font-medium">
                      Start Now
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <Link href="/history" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {activity.length === 0 ? (
                <div className="p-6 text-center">
                  <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No activity yet. Start by running an audit!</p>
                </div>
              ) : (
                activity.slice(0, 5).map((item) => (
                  <Link key={item.id} href= {"/"+item.type+"/"+item.activity_id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                  
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {item.status === 'completed' ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.title || item.type}</p>
                        <p className="text-sm text-gray-600">{item.summary || `Ran ${item.type} on ${item.target}` }</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className='flex space-x-2'>
                        {item.status == 'completed' ? 
                        <p className={`text-xs mx-2 font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700`}>
                        {item.type == 'audit' ? '1' : item.type=='crawl' ? '2' : '1'} credits
                        </p>
                        : ''}
                        
                        <p className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </p>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">{formatTime(item.created_at)}</p>
                    </div>
                  
                  </Link>
                  
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </DashboardLayout>
  )
}
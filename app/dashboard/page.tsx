'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { useProtectedRoute } from '@/lib/protected-route'

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
  Clock,
  User,
  FileText,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  User2Icon,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
  Download,
  RefreshCw,
  Plus,
  Users2,
  FileSearch
} from 'lucide-react'
import Link from 'next/link'
import { fail } from 'assert'
import { OnboardingModal } from '@/components/onboarding-modal'
import DashboardHeader from '@/components/dashboard-header'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Cell,

} from 'recharts';

import {
  auditTrendData,
  siteHealthData,
  keywordRankingData,
  recentAudits,
  activityFeed,
  competitorData,
} from '@/lib/dashboardData';
import RecentAudits from '@/components/recentAudits'

import EmptyState from '@/components/emptyState'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import NewAuditModal from '@/components/newAudit'

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  FileText,
  BarChart3,
  Globe,
  User,
  Search,
  User2Icon,
};


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

interface ComparisonSummary {
  vs_competitors: Competitor[];
  your_position: string;
  your_score: number;
  overall_scores: OverallScores;
  average_competitor_score: number;
  key_advantages: string[];
  key_disadvantages: string[];
  comparison_date: string;
}

interface Competitor {
  url: string;
  score: number;
}

interface OverallScores {
  target: Competitor;
  competitors: Competitor[];
}

const PRIMARY = '#00A4C6'
const ACCENT = '#0DD3B6'



export default function DashboardPage() {
  const { user, loading } = useAuth()
  const { isProtected } = useProtectedRoute()
  const router = useRouter()
  const [activity, setActivity] = useState<any[]>([])
  const [recentAudits, setRecentAudits] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [leadsChange, setLeadsChange] = useState(0)
  const [stats, setStats] = useState({ total: 0, completed: 0, failed: 0, percent_diff: 0, average_audit_score : { current : 0, previous:0, change:0}, by_type: {} as Record<string, number> })
  const [siteData, setSiteData] = useState<any>({})
  const [siteHealthData, setSiteHealthData] = useState<any[]>([])
  const [siteRecommandations, setSiteRecommandations] = useState<any[]>([])
  const [competitorData, setCompetitorData] = useState<ComparisonSummary | null>(null)
  const [keywordRankingData, setKeywordRankingData] = useState<any[]>([])
  // const [leads, setLeads] = useState<any[]>([])
  // Banner visibility for promotional playbook
  const [showWorkflowsBanner, setShowWorkflowsBanner] = useState(false)
  const pageRef = useRef<HTMLDivElement>(null);
  const [showNewAudit, setShowNewAudit] = useState(false);

  // selected site for the site-specific overview selector
  const [selectedSite, setSelectedSite] = useState<string | null>(
    (typeof window !== 'undefined' && localStorage.getItem('outaudits_selected_site')) || null
  );

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

  
  const maxCredits = user?.plan == 'free' ? 10 : user?.plan == 'pro' ? 100 : user?.plan == 'agency' ? 1000 : 10
  useEffect(() => {
    if (user) {
      // Load activity history from API
      fetchActivity()
      fetchStats()
      fetchLeads()
      fetchRecentAudits()
      fetchSiteData(selectedSite)
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
            console.log('Fetched activity:', data)
      
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

  const fetchRecentAudits = async () => {
    try {
      const response = await fetchWithAuth(
              `${process.env.NEXT_PUBLIC_API_URL}/audits?page_size=8`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              }
            )
            if (!response.ok) {
              throw new Error('Failed to fetch recent audits')
            }
      
            const data = await response.json()
      setRecentAudits(data.items)
      console.log(data)
    } catch (error) {
      console.error('Failed to fetch audits:', error)
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
      setLeadsChange(data.change)
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    }
  }

  const fetchSiteData = async (site:string | null) => {
      if(site) {
        //remove the "https://" protocol and trailing / if there is 
        const sanitizedSite = site.replace(/^https?:\/\//, '').replace(/\/$/, '')
        try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/sites/${sanitizedSite}/data`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) throw new Error('Failed to fetch site data')
        const data = await response.json()
        setSiteData(data)
        const healthData = [
          { name: 'On-Page SEO', value: data.health_overview.seo_score, fill: '#00a4c6' },
          { name: 'Accessibility', value: data.health_overview.accessibility_score, fill: '#6366f1' },
          { name: 'Performance', value: data.health_overview.performance_score, fill: '#34d399' },
          { name: 'Mobile/PWA', value: data.health_overview.pwa_score, fill: '#f59e0b' },
          // { name: 'Security', value: data.health_overview.security_score, fill: '#ef6644ff' },
          { name: 'Best Practices', value: data.health_overview.best_practices_score, fill: '#1900f7ffff' },
          // { name: 'Broken Links', value: data.health_overview.broken_links_count, fill: '#ef4444' }
        ]
        const recommandations = data.recommendations || []
        const compData = data.comparison_summary || {}
        setSiteHealthData(healthData)
        setSiteRecommandations(recommandations)
        setCompetitorData(compData)
        setKeywordRankingData(data.top_keywords)
        console.log(data.comparison_summary)
        
      } catch (error) {
        console.error('Failed to fetch site data:', error)
      }
    }
  }

  const handleSiteSelect = (site: string | null) => {
    if (typeof window !== 'undefined') {
      if (site) localStorage.setItem('outaudits_selected_site', site)
      else localStorage.removeItem('outaudits_selected_site')
    }
    setSelectedSite(site)
    fetchSiteData(site)
  }




  // Ensure GSAP effects are registered as hooks before any early returns so hook order remains stable
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dash-kpi-card',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        '.dash-chart-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2,
        }
      );

      gsap.fromTo(
        '.dash-table-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.4,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const formatTime = (timestamp: string) => {

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

  //new

  const iconMap: Record<string, React.ElementType> = {
  FileText,
  BarChart3,
  Globe,
  Search,
  User,
  User2Icon,
};

const scoreColor = (score: number) => {
  if (score >= 80) return '#34d399';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    case 'in-progress':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0,164,198,0.15)', color: '#00a4c6' }}>
          <RefreshCw className="w-3 h-3" /> In Progress
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
          <Clock className="w-3 h-3" /> Pending
        </span>
      );
  }
};



const activityIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />;
    case 'warning':
      return <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />;
    default:
      return <Zap className="w-3.5 h-3.5 text-[#00a4c6]" />;
  }
};

const kpiData = [
  {
    label: 'Total Audits',
    value: stats.total,
    change: (stats.percent_diff > 0 ? '+' : '')+String(stats.percent_diff)+'%',
    changeType: stats.percent_diff > 0 ? 'up' : 'down' as const,
    icon: 'FileText',
  },
  {
    label: 'Avg. Audit Score',
    value: stats.average_audit_score.current ? String(stats.average_audit_score.current)+'/100' : '0/100',
    change: (stats.average_audit_score.change > 0 ? '+' : '') + String(stats.average_audit_score.change) + '%',
    changeType: stats.average_audit_score.change > 0 ? 'up' : 'down' as const,
    icon: 'BarChart3',
  },
  {
    label: 'Sites Crawled',
    value: stats.by_type.crawl,
    change: (stats.by_type.crawl_percent_diff > 0 ? '+' : '')+String(stats.by_type.crawl_percent_diff)+'%',
    changeType: stats.by_type.crawl_percent_diff > 0 ? 'up' : 'down' as const,
    icon: 'Globe',
  },
  {
    label: 'Leads Captured',
    value: leads.length,
    change: (leadsChange > 0 ? '+' : '')+String(leadsChange)+'%',
    changeType: leadsChange > 0 ? 'up' : 'down' as const,
    icon: 'User',
  },
];



  

  return (
    <DashboardLayout>
    {showNewAudit && <NewAuditModal onClose = {()=> setShowNewAudit(false)} />}
    <div ref={pageRef} className="p-4 lg:p-8 space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              style={{
                fontSize: 'clamp(22px, 2.5vw, 28px)',
                fontWeight: 700,
                lineHeight: '36px',
                color: '#141e27',
              }}
            >
              Dashboard
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#44576a' }}>
              Overview of your SEO audit activity and performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#00a4c6', color: '#ffffff' }}
              onClick={() => { setShowNewAudit(true); }}
              >
              <Plus className="w-4 h-4" />
              New Audit
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-medium border transition-all duration-200 hover:bg-[#f5f7fa]"
              style={{ borderColor: '#e4e9ed', color: '#44576a' }}>
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiData.map((kpi, i) => {
            const Icon = iconMap[kpi.icon];
            const Arrow = kpi.changeType === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <div
                key={i}
                className="dash-kpi-card bg-white rounded p-5 transition-all duration-300 hover:shadow-[0px_14px_28px_rgba(0,0,0,0.06)]"
                style={{ border: '1px solid #e4e9ed', opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#44576a' }}>
                      {kpi.label}
                    </p>
                    <p
                      className="mt-1"
                      style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: '#141e27' }}
                    >
                      {kpi.value || 0}
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,164,198,0.1)' }}
                  >
                    {Icon && <Icon className="w-5 h-5 text-[#00a4c6]" />}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <Arrow
                    className={`w-3.5 h-3.5 ${
                      kpi.changeType === 'up' ? 'text-[#34d399]' : 'text-[#ef4444]'
                    }`}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: kpi.changeType === 'up' ? '#34d399' : '#ef4444' }}
                  >
                    {kpi.change || '0%'}
                  </span>
                  <span className="text-xs ml-1" style={{ color: '#44576a' }}>
                    vs last month
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Audit Trend */}
          <div
            className="dash-chart-card lg:col-span-2 bg-white rounded p-5"
            style={{ border: '1px solid #e4e9ed', opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#141e27' }}>
                  Audit Trend
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                  Audits generated & average SEO score over time
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#00a4c6' }} />
                  Audits
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#6366f1' }} />
                  Avg Score
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={auditTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="auditGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00a4c6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00a4c6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e9ed" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#44576a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#44576a' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e4e9ed',
                    borderRadius: 6,
                    fontSize: 12,
                    boxShadow: '0px 10px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="audits" stroke="#00a4c6" strokeWidth={2} fill="url(#auditGradient)" name="Audits" />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGradient)" name="Avg Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Lead Report (replaces Site Health) */}
          <div
            className="dash-chart-card bg-white rounded p-5"
            style={{ border: '1px solid #e4e9ed', opacity: 0 }}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#141e27' }}>
                  Recent Leads
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                  Leads captured via the embedded widget
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/audit/embed/leads">
                  <button className="text-xs font-medium text-[#44576a] hover:underline bg-transparent border-none cursor-pointer">View details</button>
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {leads && leads.length > 0 ? (
                leads.slice(0, 5).map((lead: any, idx: number) => {
                  return (
                    <div key={idx} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#141e27' }}>{lead.full_name  || lead.email.split('@')[0] }</p>
                        <p className="text-xs" style={{ color: '#44576a' }}>{lead.email || lead.contact || ''}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#8896a4' }}>
                          <a href={`${lead.website}`} target='_blank'>{lead.website ? (`${lead.website}`) : ''}</a>
                          {lead.country ? (` · ${lead.country}`) : ''}
                          {lead.created_at ? (` · ${formatTime(lead.created_at)} `) : ''}
                        </p>
                      </div>
                      <div className="text-xs text-right" style={{ color: '#44576a' }}>
                        <span className="block">{lead.score ? `Score: ${lead.score}` : ''}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-6 text-center">
                  <p className="text-sm" style={{ color: '#44576a' }}>No leads captured yet.</p>
                  <Link href="/audit/embed">
                    <button className="mt-3 px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: '#00a4c6', color: '#fff' }}>Embed the lead widget</button>
                  </Link>
                </div>
              )}
            </div>

            { !(user as any)?.embed_api_key ? (
                  <Link href="/audit/embed">
                    <button className="text-xs font-medium text-[#00a4c6] hover:underline bg-transparent border-none cursor-pointer">Embed widget</button>
                  </Link>
                ) : (
                  <Link href="/audit/embed">
                    <button className="text-xs font-medium text-[#00a4c6] hover:underline bg-transparent border-none cursor-pointer">Manage widget</button>
                  </Link>
                )}
          </div>
        </div>

        {/* Site selector to filter overview data */}
        <div className="flex items-center gap-3 mt-3">
          <label className="text-sm font-medium" style={{ color: '#44576a' }}>Show data for</label>
          <select
            value={selectedSite || ''}
            onChange={(e) => {handleSiteSelect(e.target.value || null)}}
            className="text-sm p-2 border rounded"
          >
            <option value="">All sites</option>
            {Array.from(new Set(recentAudits.map(a => a.url))).map((url) => (
              <option key={url} value={url}>{url}</option>
            ))}
          </select>

          <div className="ml-auto text-sm text-[#44576a]">Showing: {selectedSite || 'All sites'}</div>
        </div>

        {/* Site Health + Latest Recommendations row (moved down) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          {/* Site Health (moved) */}
          <div
            className="dash-chart-card bg-white rounded p-5"
            style={{ border: '1px solid #e4e9ed', opacity: 0 }}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#141e27' }}>
                  Site Health
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                  Breakdown by category for {selectedSite || 'your sites'}
                </p>
              </div>
              <Link href="/sites/health">
                <button className="text-xs font-medium text-[#00a4c6] hover:underline bg-transparent border-none cursor-pointer">View details</button>
              </Link>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={siteHealthData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#e4e9ed" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#44576a' }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: '#44576a' }} domain={[0, 100]} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#00a4c6"
                  fill="#00a4c6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
              {siteHealthData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                  <span className="text-xs" style={{ color: '#44576a' }}>{item.name}</span>
                  <span className="text-xs font-semibold ml-auto" style={{ color: '#141e27' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Recommendations for selected site */}
          <div
            className="dash-chart-card bg-white rounded p-5"
            style={{ border: '1px solid #e4e9ed', opacity: 0 }}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#141e27' }}>
                  Latest Recommendations
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                  Actionable suggestions from the latest audit{selectedSite ? ` for ${selectedSite}` : ''}
                </p>
              </div>
              <Link href="/audit">
                <button className="text-xs font-medium text-[#00a4c6] hover:underline bg-transparent border-none cursor-pointer">View details</button>
              </Link>
            </div>

            <div>
              {/* Derive latest audit for selectedSite if possible */}
              {(() => {
                const filtered = selectedSite ? recentAudits.filter(a => a.url === selectedSite) : recentAudits
                const latest = filtered && filtered.length ? filtered[0] : null
                const latestRecs = latest ? (latest as any).recommendations : null
                if (siteRecommandations.length === 0) {
                  return (
                    <div className="py-6 text-center">
                      <p className="text-sm" style={{ color: '#44576a' }}>No recommendations available yet.</p>
                      <Link href="/audit">
                        <button className="mt-3 px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: '#00a4c6', color: '#fff' }}>Run an audit</button>
                      </Link>
                    </div>
                  )
                }

                return siteRecommandations.slice(0,5).map((rec: any, ri: number) => (
                  <div key={ri} className="py-2 border-b last:border-b-0" style={{ borderColor: '#f5f7fa' }}>
                    <p className="text-sm font-medium" style={{ color: '#141e27' }}>{rec.title || rec.summary}</p>
                    {/* <p className="text-xs" style={{ color: '#44576a' }}>{rec.detail || rec.description}</p> */}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        a: ({node, ...props}) => (
                          <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
                        ),
                        p: ({node, ...props}) => <p className="text-xs text-gray-600" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                        em: ({node, ...props}) => <em className="italic" {...props} />,
                        code: ({node, inline, className, children, ...props}: any) =>
                          inline ? <code className="bg-gray-100 px-1 rounded text-sm" {...props}>{children}</code> :
                          <code className="block p-2 bg-gray-100 rounded overflow-x-auto" {...props}>{children}</code>
                      }}
                    >
                      {rec.detail || rec.description}
                    </ReactMarkdown>
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Keyword Rankings */}
          <div
            className="dash-chart-card bg-white rounded p-5"
            style={{ border: '1px solid #e4e9ed', opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold" style={{ color: '#141e27' }}>
                  Keyword Rankings
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                  Top tracked keywords by SERP position for {selectedSite}
                </p>
              </div>
              <TrendingUp className="w-4 h-4 text-[#34d399]" />
            </div>
            { keywordRankingData.length > 0 && (
              <ResponsiveContainer width="100%" height={240}>
              <BarChart data={[...keywordRankingData].reverse()} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e9ed" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#44576a' }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <YAxis dataKey="keyword" type="category" tick={{ fontSize: 11, fill: '#44576a' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e4e9ed',
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                  formatter={(value: any) => {
                    if (value === undefined || value === null) return ['', ''];
                    return [`Position: #${value}`, ''];
                  }}
                />
                <Bar dataKey="current_rank" fill="#34d399" radius={[4, 0, 0, 4]} />
              </BarChart>
            </ResponsiveContainer>
            )}

            { keywordRankingData.length == 0 && (
              <EmptyState 
              onNew={()=>{router.push('/rank-tracking')}}
              headline='No campaigns for this domain yet'
              subText={`Start a tracking campaign for ${selectedSite} to start monitoring keyword rankings for that domain.`}
              buttonText='New tracking campaign'
              icon={<TrendingUp className="w-8 h-8 text-[#34d399]" />}
               />
            )}
            
          </div>

          {/* Competitor Comparison */}
          <div
            className="dash-chart-card bg-white rounded p-5"
            style={{ border: '1px solid #e4e9ed', opacity: 0 }}
          >
            <div className="mb-5">
              <h3 className="text-base font-semibold" style={{ color: '#141e27' }}>
                Competitor Comparison
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                SEO score comparison with top competitors
                
              </p>
            </div>
            
            {(() => {
            if (competitorData?.overall_scores) {
                  return (
                    <>
                  <div className="space-y-4">
                  <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:  '#00a4c6',
                            }}
                          />
                          <span className="text-sm font-medium" style={{ color: '#141e27' }}>
                            {competitorData?.overall_scores?.target?.url}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: '#44576a' }}>
                          <span>Score: <strong className="text-[#141e27]">{competitorData?.overall_scores?.target?.score || ''}</strong></span>
                          <span>Traffic: <strong className="text-[#141e27]">{(5740 / 1000).toFixed(1)}k</strong></span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f7fa' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(competitorData?.overall_scores?.target?.score / 100) * 100}%`,
                            backgroundColor:  '#00a4c6',
                          }}
                        />
                      </div>
                    </div>
                  {Array.isArray(competitorData?.overall_scores?.competitors) && competitorData?.overall_scores?.competitors.map((comp, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: '#e4e9ed',
                            }}
                          />
                          <span className="text-sm font-medium" style={{ color: '#141e27' }}>
                            {comp?.url}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: '#44576a' }}>
                          <span>Score: <strong className="text-[#141e27]">{comp?.score}</strong></span>
                          <span>Traffic: <strong className="text-[#141e27]">{(7800 / 1000).toFixed(1)}k</strong></span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f7fa' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${(comp?.score / 100) * 100}%`,
                            backgroundColor: '#c1cfda',
                          }}
                        />
                      </div>
                </div>
              ))}
            </div>
            {/* Mini table */}
            {/* <div className="mt-5 pt-4" style={{ borderTop: '1px solid #e4e9ed' }}>
              <div className="grid grid-cols-4 gap-2 text-xs" style={{ color: '#44576a' }}>
                <span className="font-medium">Site</span>
                <span className="font-medium text-center">SEO Score</span>
                <span className="font-medium text-center">Traffic</span>
                <span className="font-medium text-center">Backlinks</span>
              </div>

              <div
                  className="grid grid-cols-4 gap-2 text-xs py-2 rounded-sm mt-1"
                  style={{ backgroundColor: 'rgba(0,164,198,0.05)' }}
                >
                  <span className="font-medium pl-2" style={{ color: '#141e27' }}>{competitorData?.overall_scores?.target?.url}</span>
                  <span className="text-center font-semibold" style={{ color: scoreColor(competitorData?.overall_scores?.target?.score || 0) }}>{competitorData?.overall_scores?.target?.score}</span>
                  <span className="text-center" style={{ color: '#44576a' }}>{(5007/ 1000).toFixed(1)}k</span>
                  <span className="text-center" style={{ color: '#44576a' }}>{'7800'.toLocaleString()}</span>
                </div>
              {competitorData?.overall_scores?.competitors.map((comp, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-2 text-xs py-2 rounded-sm mt-1"
                  style={{ backgroundColor: 'rgba(0,164,198,0.05)' }}
                >
                  <span className="font-medium pl-2" style={{ color: '#141e27' }}>{comp?.url}</span>
                  <span className="text-center font-semibold" style={{ color: scoreColor(comp?.score) }}>{comp?.score}</span>
                  <span className="text-center" style={{ color: '#44576a' }}>{(5007/ 1000).toFixed(1)}k</span>
                  <span className="text-center" style={{ color: '#44576a' }}>{'7800'.toLocaleString()}</span>
                </div>
              ))}
            </div> */}
              </>
                  )
                } else {
                  return (
                    <EmptyState 
                      onNew={()=>{router.push('/compare')}}
                      headline='No Comparison data yet.'
                      subText={`Add competitors for ${selectedSite} to compare SEO perfromance with competitors.`}
                      buttonText='New Comparison'
                      icon={<Users2 className="w-8 h-8 text-[#34d399]" />}
               />
                  )
                }
            })()}  
          </div>

        

        
      </div>
      {/* Bottom Row: Recent Audits + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Audits Table */}
          {recentAudits.length == 0 && (
            <div className='space-y-6 lg:col-span-2'>
                <EmptyState 
                        onNew={()=>{setShowNewAudit(true);}}
                        headline='No audits yet'
                        subText={`Start an audit to view recent audits details .`}
                        buttonText='New Audit'
                        icon={<FileSearch className="w-8 h-8 text-[#34d399]" />}
                         />
            </div>             
          )}
          {recentAudits.length > 0 && (
            <RecentAudits recentAudits={recentAudits} />      
          )}
          

          {/* Activity Feed */}
          <div
            className="dash-chart-card bg-white rounded p-5"
            style={{ border: '1px solid #e4e9ed', opacity: 1 }}
          >
            <div className="mb-5">
              <h3 className="text-base font-semibold" style={{ color: '#141e27' }}>
                Activity Feed
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                Recent actions and events
              </p>
            </div>
            <div className="space-y-0">
              {activity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3"
                  style={{
                    borderBottom: i < activity.length - 1 ? '1px solid #f5f7fa' : 'none',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor:
                        item.type === 'success'
                          ? 'rgba(52,211,153,0.1)'
                          : item.type === 'warning'
                          ? 'rgba(245,158,11,0.1)'
                          : 'rgba(0,164,198,0.1)',
                    }}
                  >
                    {activityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm" style={{ color: '#141e27' }}>
                      <span className="font-medium">{item.summary || `Ran ${item.type}`}</span>
                    </p>
                    <p className="text-xs truncate" style={{ color: '#44576a' }}>
                      {item.target}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: '#8896a4' }}>
                      {formatTime(item.completed_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
      
    </DashboardLayout>
  )
}
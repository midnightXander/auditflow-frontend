'use client'

// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Deep Crawl - OUTAudits',
//   description: 'Crawl and analyze up to 500 pages of your website. Discover broken links, duplicate content, and technical SEO issues.',
// }


import { useRouter } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import DashboardHeader from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import { useProtectedRoute } from '@/lib/protected-route'
import { useWhiteLabel, WhiteLabelConfig } from '@/lib/whitelabel'

import { useState, useEffect, useRef } from 'react';
import Link  from 'next/link';
import gsap from 'gsap';
import {
  ArrowRight,
  Globe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ChevronDown,
  Layers,
  Link2,
  FileCode,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader,
  Settings,
} from 'lucide-react';
import RecentSiteCrawls from '@/components/recentCrawls'

import DashboardLayout from '@/components/dashboardLayout'
import { Crawl } from '@/lib/crawlData'
import NewCrawlModal from '@/components/newCrawl'
import EmptyState from '@/components/emptyState'


const crawlData = [
  {
    id: 'CR-1024', url: 'acme-agency.com', status: 'completed', progress: 100, pagesCrawled: 482, totalPages: 482,
    issues: { broken: 3, redirect: 12, orphan: 8, duplicate: 5, missingMeta: 7 },
    started: '2 hours ago', duration: '4m 32s', depth: 4,
  },
  {
    id: 'CR-1023', url: 'client-site.io', status: 'completed', progress: 100, pagesCrawled: 1256, totalPages: 1256,
    issues: { broken: 18, redirect: 34, orphan: 22, duplicate: 14, missingMeta: 31 },
    started: '5 hours ago', duration: '12m 18s', depth: 5,
  },
  {
    id: 'CR-1022', url: 'ecommerce-store.net', status: 'in-progress', progress: 67, pagesCrawled: 2341, totalPages: 3500,
    issues: { broken: 9, redirect: 0, orphan: 0, duplicate: 0, missingMeta: 0 },
    started: '15 min ago', duration: '8m 45s (est. 15m)', depth: 3,
  },
  {
    id: 'CR-1021', url: 'blog-network.org', status: 'completed', progress: 100, pagesCrawled: 892, totalPages: 892,
    issues: { broken: 1, redirect: 6, orphan: 3, duplicate: 2, missingMeta: 4 },
    started: '1 day ago', duration: '7m 12s', depth: 4,
  },
  {
    id: 'CR-1020', url: 'local-business.com', status: 'failed', progress: 23, pagesCrawled: 45, totalPages: 200,
    issues: { broken: 0, redirect: 0, orphan: 0, duplicate: 0, missingMeta: 0 },
    started: '1 day ago', duration: '2m 10s (timed out)', depth: 2,
  },
];

const statusBadge = (status: string) => {
  switch (status) {
    case 'completed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#f0fdf4', color: '#34d399' }}><CheckCircle2 className="w-3 h-3" /> Complete</span>;
    case 'in-progress': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#eff6ff', color: '#6366f1' }}><RefreshCw className="w-3 h-3" /> Running</span>;
    case 'failed': return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}><XCircle className="w-3 h-3" /> Failed</span>;
    default: return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#fefce8', color: '#f59e0b' }}><Clock className="w-3 h-3" /> Queued</span>;
  }
};

const issueTypes = [
  { key: 'broken', label: 'Broken Links', icon: Link2, color: '#ef4444' },
  { key: 'redirect', label: 'Redirects', icon: RefreshCw, color: '#f59e0b' },
  { key: 'orphan', label: 'Orphan Pages', icon: FileCode, color: '#6366f1' },
  { key: 'duplicate', label: 'Duplicates', icon: Layers, color: '#00a4c6' },
  { key: 'missingMeta', label: 'Missing Meta', icon: FileCode, color: '#8896a4' },
];

export default function SiteCrawlsPage() {
  const { user } = useAuth()
  const [showNewCrawl, setShowNewCrawl] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'failed'>('all');
  const listRef = useRef<HTMLDivElement>(null);
  const [recentCrawls, setRecentCrawls] = useState<any[]>([])
  const [totalPagesCrawled, setTotalPagesCrawled] = useState(0)
  const [totalCrawls, setTotalCrawls] = useState(0)
  const [totalIssues, setTotalIssues] = useState(0)
   
  // const totalIssues = crawlData.reduce((acc, c) => acc + Object.values(c.issues).reduce((a, b) => a + b, 0), 0);


  useEffect(() => {
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.crawl-row', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
    }, listRef);
    return () => ctx.revert();
  }, [filter]);

  useEffect(() => {
        if (user) {
          fetchRecentCrawls()
        }
      }, [user])
  
    const fetchRecentCrawls = async () => {
        try {
          const response = await fetchWithAuth(
                  `${process.env.NEXT_PUBLIC_API_URL}/crawls?page_size=15`,
                  {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                  }
                )
                if (!response.ok) {
                  throw new Error('Failed to fetch recent crawls')
                }
          
          const data = await response.json()
          setRecentCrawls(data.items)
          setTotalCrawls(data.total)
          setTotalIssues(data.metadata.total_issues_found)
          setTotalPagesCrawled(data.metadata.total_pages_crawled)
        } catch (error) {
          console.error('Failed to fetch crawls:', error)
        }
      }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Link href="/dashboard" className="hover:underline" style={{ color: '#44576a' }}>Dashboard</Link>
              <ArrowRight className="w-3 h-3" style={{ color: '#8896a4' }} />
              <span style={{ color: '#141e27' }} className="font-medium">Site Crawls</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#141e27' }}>Site Crawls</h1>
          </div>
          <button
          onClick={() => { setShowNewCrawl(true);}}
          className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-medium text-white border-none cursor-pointer hover:opacity-90" style={{ backgroundColor: '#00a4c6' }}>
            <Globe className="w-4 h-4" />
            New Crawl
          </button>
        </div>

        {/* New Crawl Modal */}
        {showNewCrawl && <NewCrawlModal onClose = {()=> setShowNewCrawl(false)} />}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Crawls', value: totalCrawls, icon: Globe, color: '#00a4c6' },
            { label: 'Pages Crawled', value: totalPagesCrawled, icon: Layers, color: '#6366f1' },
            { label: 'Total Issues', value: totalIssues, icon: AlertTriangle, color: '#f59e0b' },
            { label: 'Avg Depth', value: '3.6', icon: BarChart3, color: '#34d399' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded p-4 flex items-center gap-3" style={{ border: '1px solid #e4e9ed' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}10` }}>
                <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: '#141e27' }}>{s.value}</p>
                <p className="text-[11px]" style={{ color: '#44576a' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

          {recentCrawls.length == 0 && (
              <EmptyState 
              onNew={()=>{setShowNewCrawl(true);}}
              headline='No Crawls yet'
              subText={`Start a deep crawl on a domain to view issues.`}
              buttonText='New Crawl'
              icon={<Globe className="w-8 h-8 text-[#34d399]" />}
                />            
            )}
          {recentCrawls.length > 0 && (
          <RecentSiteCrawls crawls={recentCrawls}/>                             
          )}          
        

        
      </div>
    </DashboardLayout>
  );
}

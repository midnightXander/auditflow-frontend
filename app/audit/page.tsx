'use client'

import { useState, useEffect, useRef } from 'react';
import Link  from 'next/link';
import gsap from 'gsap';
import {
  Search,
  Plus,
  ArrowUpDown,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Globe,
  Zap,
  ChevronDown,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboardLayout'
import ReportExport from '@/components/ReportExport';
import RecentAudits from '@/components/recentAudits';
import { auditReports } from '@/lib/auditData';
import type { AuditReport } from '@/lib/auditData';
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import NewAuditModal from '@/components/newAudit';
import EmptyState from '@/components/emptyState';


const allAudits = [
  ...auditReports,
  {
    id: 'AUD-2839', url: 'digital-marketing.co', date: '2025-06-14T18:00:00Z', overallScore: 84,
    scores: { onPage: 88, technical: 82, performance: 80, mobile: 86, security: 90 },
    summary: 'Good overall SEO health with room for improvement in technical areas.', keywords: [], competitors: [], issues: [],
  },
  {
    id: 'AUD-2838', url: 'ecommerce-store.net', date: '2025-06-14T15:30:00Z', overallScore: 71,
    scores: { onPage: 75, technical: 65, performance: 68, mobile: 74, security: 80 },
    summary: 'Moderate SEO score. Several technical issues need attention.', keywords: [], competitors: [], issues: [],
  },
  {
    id: 'AUD-2837', url: 'blog-network.org', date: '2025-06-13T11:00:00Z', overallScore: 88,
    scores: { onPage: 92, technical: 85, performance: 84, mobile: 90, security: 94 },
    summary: 'Strong SEO performance across all categories.', keywords: [], competitors: [], issues: [],
  },
  {
    id: 'AUD-2836', url: 'local-business.com', date: '2025-06-13T09:00:00Z', overallScore: 55,
    scores: { onPage: 60, technical: 48, performance: 52, mobile: 58, security: 68 },
    summary: 'Multiple critical issues found. Immediate action required.', keywords: [], competitors: [], issues: [],
  },
  {
    id: 'AUD-2835', url: 'saas-platform.io', date: '2025-06-12T16:00:00Z', overallScore: 91,
    scores: { onPage: 94, technical: 88, performance: 90, mobile: 93, security: 95 },
    summary: 'Excellent SEO health with only minor improvements needed.', keywords: [], competitors: [], issues: [],
  },
];

const scoreColor = (score: number) => {
  if (score >= 80) return '#34d399';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

export default function Audits() {
  const [search, setSearch] = useState('');
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [showNewAudit, setShowNewAudit] = useState(false);
  const [totalAudits, setTotalAudits] = useState(0)
  const [avgAuditScore, setAvgAuditScore] = useState(0)
  const [totalIssues, setTotalIssues] = useState(0)
  const [auditsThisMonth, setAuditsThisMonth] = useState(0)
  const [selectedAudit, setSelectedAudit] = useState<AuditReport | null>(null);
  const [exportAudit, setExportAudit] = useState<AuditReport | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [recentAudits, setRecentAudits] = useState<any[]>([])

  
  useEffect(() => {
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.audit-row', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out' });
    }, listRef);
    return () => ctx.revert();
  }, [search, sortBy]);

  

  useEffect(() => {
      if (user) {
        fetchRecentAudits()
      }
    }, [user])

  const fetchRecentAudits = async () => {
      try {
        const response = await fetchWithAuth(
                `${process.env.NEXT_PUBLIC_API_URL}/audits?page_size=15`,
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
        setTotalAudits(data.total)
      } catch (error) {
        console.error('Failed to fetch audits:', error)
      }
    }

  const resetAuditFlow = () => {
    // setShowNewAudit(false);
    setNewUrl('');
    setAuditComplete(false);
    setIsAuditing(false);
  };

  const fullAudit = auditReports.find((a) => a.id === selectedAudit?.id);

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Link href="/dashboard" className="hover:underline" style={{ color: '#44576a' }}>Dashboard</Link>
              <ArrowRight className="w-3 h-3" style={{ color: '#8896a4' }} />
              <span style={{ color: '#141e27' }} className="font-medium">Audits</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#141e27' }}>SEO Audits</h1>
          </div>
          <button
            onClick={() => { setShowNewAudit(true); resetAuditFlow(); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded text-sm font-medium text-white border-none cursor-pointer hover:opacity-90"
            style={{ backgroundColor: '#00a4c6' }}
          >
            <Plus className="w-4 h-4" />
            New Audit
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Audits', value: totalAudits.toString(), icon: FileSearch, color: '#00a4c6' },
            { label: 'Avg Score', value: recentAudits.length > 0 ? Math.round(recentAudits.reduce((a, b) => a + b.overall_score, 0) / recentAudits.length) : 0 , icon: CheckCircle2, color: '#34d399' },
            { label: 'Critical Issues', value: '6', icon: XCircle, color: '#ef4444' },
            { label: 'This Month', value: recentAudits.filter((a)=> new Date(a.created_at).getMonth() == new Date().getMonth()).length.toString(), icon: Zap, color: '#6366f1' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded p-4 flex items-center gap-3" style={{ border: '1px solid #e4e9ed' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}10` }}>
                <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-bold" style={{ color: '#141e27' }}>{stat.value}</p>
                <p className="text-[11px]" style={{ color: '#44576a' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        
        {recentAudits.length == 0 && (
            <EmptyState 
                    onNew={()=>{setShowNewAudit(true);}}
                    headline='No audits yet'
                    subText={`Start an audit to view recent audits details .`}
                    buttonText='New Audit'
                    icon={<FileSearch className="w-8 h-8 text-[#34d399]" />}
                      />        
        )}
        {recentAudits.length > 0 && (          
        <RecentAudits recentAudits={recentAudits} />         
          )}
        
        
      
      </div>

      {/* New Audit Modal */}
      {showNewAudit && <NewAuditModal onClose = {()=> setShowNewAudit(false)} />}

      {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedAudit(null)} />
          <div className="relative w-full max-w-[700px] max-h-[85vh] flex flex-col bg-white rounded overflow-hidden" style={{ border: '1px solid #e4e9ed' }}>
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #e4e9ed' }}>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#141e27' }}>Audit Report</h3>
                <p className="text-xs" style={{ color: '#8896a4' }}>{selectedAudit.id} &middot; {selectedAudit.url}</p>
              </div>
              <button onClick={() => setSelectedAudit(null)} className="p-1 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer">
                <span className="text-lg" style={{ color: '#44576a' }}>&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Score circle */}
              <div className="flex items-center gap-6 mb-8 p-5 rounded" style={{ backgroundColor: '#f9fafb' }}>
                <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center flex-shrink-0" style={{ border: `4px solid ${scoreColor(selectedAudit.overallScore)}` }}>
                  <span className="text-3xl font-bold" style={{ color: scoreColor(selectedAudit.overallScore) }}>{selectedAudit.overallScore}</span>
                  <span className="text-[10px] uppercase" style={{ color: '#8896a4' }}>/100</span>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: '#141e27' }}>
                    {selectedAudit.overallScore >= 80 ? 'Good' : selectedAudit.overallScore >= 60 ? 'Needs Work' : 'Critical'}
                  </p>
                  <p className="text-sm" style={{ color: '#44576a' }}>{selectedAudit.summary}</p>
                </div>
              </div>

              {/* Category scores */}
              <div className="grid grid-cols-5 gap-3 mb-8">
                {Object.entries(selectedAudit.scores).map(([key, val]) => (
                  <div key={key} className="text-center p-3 rounded" style={{ backgroundColor: '#f9fafb' }}>
                    <p className="text-lg font-bold" style={{ color: scoreColor(val) }}>{val}</p>
                    <p className="text-[10px] uppercase mt-0.5" style={{ color: '#8896a4' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>

              {/* Issues */}
              {fullAudit && fullAudit.issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#141e27' }}>Issues ({fullAudit.issues.length})</h4>
                  <div className="space-y-2">
                    {fullAudit.issues.map((issue) => (
                      <div key={issue.id} className="p-3 rounded" style={{ backgroundColor: '#f9fafb', borderLeft: `3px solid ${issue.severity === 'critical' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#00a4c6'}` }}>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded" style={{ backgroundColor: issue.severity === 'critical' ? '#fef2f2' : issue.severity === 'warning' ? '#fffbeb' : '#ecfeff', color: issue.severity === 'critical' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#00a4c6' }}>
                            {issue.severity}
                          </span>
                          <span className="text-xs" style={{ color: '#8896a4' }}>{issue.category}</span>
                        </div>
                        <p className="text-sm font-medium mt-1" style={{ color: '#141e27' }}>{issue.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>{issue.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid #e4e9ed' }}>
              <button onClick={() => setSelectedAudit(null)} className="px-4 py-2 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>Close</button>
              <button
                onClick={() => { setExportAudit(selectedAudit); setSelectedAudit(null); }}
                className="px-4 py-2 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90"
                style={{ backgroundColor: '#00a4c6' }}
              >
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

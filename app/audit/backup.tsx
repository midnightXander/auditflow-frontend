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
  const [selectedAudit, setSelectedAudit] = useState<AuditReport | null>(null);
  const [exportAudit, setExportAudit] = useState<AuditReport | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [recentAudits, setRecentAudits] = useState<any[]>([])

  const filtered = allAudits
    .filter((a) => !search || a.url.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'date' ? new Date(b.date).getTime() - new Date(a.date).getTime() : b.overallScore - a.overallScore);

  useEffect(() => {
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.audit-row', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out' });
    }, listRef);
    return () => ctx.revert();
  }, [search, sortBy]);

  const runAudit = () => {
    if (!newUrl) return;
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 2500);
  };

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
            { label: 'Total Audits', value: allAudits.length.toString(), icon: FileSearch, color: '#00a4c6' },
            { label: 'Avg Score', value: Math.round(allAudits.reduce((a, b) => a + b.overallScore, 0) / allAudits.length).toString(), icon: CheckCircle2, color: '#34d399' },
            { label: 'Critical Issues', value: '6', icon: XCircle, color: '#ef4444' },
            { label: 'This Month', value: allAudits.length.toString(), icon: Zap, color: '#6366f1' },
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

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-white w-full sm:w-80" style={{ border: '1px solid #e4e9ed' }}>
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#8896a4' }} />
            <input
              type="text" placeholder="Search by URL or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" style={{ color: '#141e27' }}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setSortBy(sortBy === 'date' ? 'score' : 'date')}
              className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium bg-white border cursor-pointer hover:bg-[#f9fafb]"
              style={{ borderColor: '#e4e9ed', color: '#44576a' }}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortBy === 'date' ? 'Newest' : 'Highest Score'}
            </button>
          </div>
        </div>

        {/* Audit list */}
        <div ref={listRef} className="bg-white rounded overflow-hidden" style={{ border: '1px solid #e4e9ed' }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ borderBottom: '1px solid #e4e9ed' }}>
                  {['ID', 'URL', 'Score', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider py-3 px-4" style={{ color: '#8896a4' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((audit) => {
                  const hasIssues = audit.overallScore < 80;
                  return (
                    <tr
                      key={audit.id}
                      className="audit-row group cursor-pointer transition-colors hover:bg-[#f9fafb]"
                      style={{ borderBottom: '1px solid #f5f7fa', opacity: 0 }}
                      onClick={() => setSelectedAudit(audit)}
                    >
                      <td className="py-3 px-4">
                        <span className="text-xs font-mono font-medium" style={{ color: '#00a4c6' }}>{audit.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8896a4' }} />
                          <span className="text-sm font-medium truncate max-w-[180px]" style={{ color: '#141e27' }}>{audit.url}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: `${scoreColor(audit.overallScore)}15`, color: scoreColor(audit.overallScore) }}
                          >
                            {audit.overallScore}
                          </div>
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f7fa' }}>
                            <div className="h-full rounded-full" style={{ width: `${audit.overallScore}%`, backgroundColor: scoreColor(audit.overallScore) }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {hasIssues ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                            <AlertTriangle className="w-3 h-3" /> Issues Found
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: '#f0fdf4', color: '#34d399' }}>
                            <CheckCircle2 className="w-3 h-3" /> Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: '#8896a4' }}>
                        {new Date(audit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedAudit(audit); }}
                            className="p-1.5 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer"
                            title="View details"
                          >
                            <FileSearch className="w-3.5 h-3.5" style={{ color: '#44576a' }} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setExportAudit(audit); }}
                            className="p-1.5 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer"
                            title="Export report"
                          >
                            <ChevronDown className="w-3.5 h-3.5" style={{ color: '#44576a' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Audit Modal */}
      {showNewAudit && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={resetAuditFlow} />
          <div className="relative w-full max-w-md bg-white rounded p-6" style={{ border: '1px solid #e4e9ed' }}>
            {!isAuditing && !auditComplete && (
              <>
                <h3 className="text-lg font-semibold" style={{ color: '#141e27' }}>Start New Audit</h3>
                <p className="text-sm mt-1" style={{ color: '#44576a' }}>Enter a URL to generate a comprehensive SEO audit report.</p>
                <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded" style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed' }}>
                  <Globe className="w-4 h-4 flex-shrink-0" style={{ color: '#8896a4' }} />
                  <input
                    type="text" placeholder="https://example.com" value={newUrl} onChange={(e) => setNewUrl(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full" style={{ color: '#141e27' }}
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button onClick={resetAuditFlow} className="px-4 py-2.5 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>Cancel</button>
                  <button onClick={runAudit} disabled={!newUrl} className="px-5 py-2.5 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: '#00a4c6' }}>Start Audit</button>
                </div>
              </>
            )}
            {isAuditing && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full border-3 border-[#e4e9ed] border-t-[#00a4c6] animate-spin mx-auto" />
                <p className="text-sm font-medium mt-4" style={{ color: '#141e27' }}>Analyzing {newUrl}...</p>
                <p className="text-xs mt-1" style={{ color: '#8896a4' }}>Crawling pages, checking technical issues, scoring performance</p>
              </div>
            )}
            {auditComplete && (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: '#f0fdf4' }}>
                  <CheckCircle2 className="w-7 h-7 text-[#34d399]" />
                </div>
                <p className="text-lg font-semibold mt-4" style={{ color: '#141e27' }}>Audit Complete!</p>
                <p className="text-sm mt-1" style={{ color: '#44576a' }}>Overall Score: <strong style={{ color: '#00a4c6' }}>78/100</strong></p>
                <div className="flex items-center gap-2 mt-5">
                  <button onClick={resetAuditFlow} className="px-4 py-2.5 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>Close</button>
                  <button onClick={() => { resetAuditFlow(); setSelectedAudit(allAudits[0]); }} className="px-5 py-2.5 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90" style={{ backgroundColor: '#00a4c6' }}>View Results</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

      {/* Export Modal */}
      {/* {exportAudit && <ReportExport audit={exportAudit} onClose={() => setExportAudit(null)} />} */}
    </DashboardLayout>
  );
}

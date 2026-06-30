'use client'

import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, RefreshCw, Clock, MoreHorizontal, Download, Eye, Search, ArrowUpDown, Loader2, FileSearch } from 'lucide-react'
import { formatTime } from '@/lib/utils'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import { fetchWithAuth, useAuth } from '@/lib/auth-context'
import gsap from 'gsap';
import { exportAuditPDF } from '@/lib/pdf-export'
import { useWhiteLabel } from '@/lib/whitelabel';
import ReportExport from '@/components/ReportExport';
import EmptyState from './emptyState';

interface AuditResults {
  url: string,
  client_name: string,
  audit_date: string
  overall_score: number
  lighthouse: {
    categories: Record<string, { title: string; score: number; description: string }>
    metrics: {
      coreWebVitals?: Record<string, { displayValue: string; score: number; rating: string }>
      performance?: Record<string, { displayValue: string; score: number }>
    }
    opportunities?: Array<{ title: string; description: string; savings?: { ms: number } }>
    audits : any
  }
  broken_links: { total_checked: number; broken_count: number; status: string; broken_links: any[] }
  image_optimization: { total_images: number; score: number; issues: any; recommendations: string[] }
  structured_data: { score: number; status: string; has_json_ld: boolean; has_open_graph: boolean; has_twitter_card: boolean; has_microdata: boolean; json_ld_types: string[]; open_graph_properties: string[]; twitter_card_type: string; recommendations: string[] }
  content_quality: { score: number; status: string; word_count: number; paragraph_count: number; avg_sentence_length: number; avg_paragraph_length: number; content_to_code_ratio: number; reading_ease_score: number; reading_level: string; heading_structure: Record<string, number>; recommendations: string[] }
  technical_seo: { title: any; meta_description: any; canonical: any; robots_txt: boolean; sitemap_xml: boolean; headings: Record<string, number> }
  security: { https: boolean; security_headers: Record<string, boolean> }
}

export default function RecentAudits({recentAudits}: {recentAudits: any[]}) {

  const router = useRouter()
  const { user } = useAuth()
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [showNewAudit, setShowNewAudit] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<AuditResults | null>(null);
  // const [exportAudit, setExportAudit] = useState<AuditReport | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { config } = useWhiteLabel()
  const [exporting, setExporting] = useState(false)
  const [exportAudit, setExportAudit] = useState<AuditResults | null>(null);

  const filtered = recentAudits
    .filter((a) => !search || a.url.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'date' ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : b.overall_score - a.overall_score);

  useEffect(() => {
      if (!listRef.current) return;
      const ctx = gsap.context(() => {
        gsap.fromTo('.audit-row', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out' });
      }, listRef);
      return () => ctx.revert();
    }, [search, sortBy]);

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

  const selectAudit = async (AuditId : string) => {
    try {
            const r    = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/audit/${AuditId}`)
            if(r.status == 404){
              // setError('Audit not found')
              // setLoading(false)
              return
            }
            const data = await r.json()
            console.log(data)
            setSelectedAudit(data.results)
            setSelectedAuditId(AuditId)
            // if (data.status === 'completed' && data.results) { setResults(data.results); setLoading(false) }
          } catch { 
            console.log("error");
            // setError('Cannot reach server'); setLoading(false) 
          }

  }

  const handleSelectAudit = (auditId: string) =>{
    selectAudit(auditId)
    

  }
  
  return (
    <>
    <div className='space-y-6 lg:col-span-2'>
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
      <div ref={listRef} className="dash-table-card bg-white rounded p-5" style={{ border: '1px solid #e4e9ed', opacity: 1 }}>
        <div className="flex items-center justify-between mb-5">
            <div>
            <h3 className="text-base font-semibold" style={{ color: '#141e27' }}>
                Recent Audits
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                Latest audits generated across your projects
            </p>
            </div>
            <button onClick={() => router.push('/history')} className="text-xs font-medium text-[#00a4c6] hover:underline bg-transparent border-none cursor-pointer">
            View All
            </button>
        </div>
        <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full min-w-[600px]">
            
            <thead>
                <tr style={{ borderBottom: '1px solid #e4e9ed' }}>
                  {['ID', 'URL', 'Score', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider py-3 px-4" style={{ color: '#8896a4' }}>{h}</th>
                  ))}
                </tr>
              </thead>
            <tbody>
                {filtered.map((audit, i) => { 
                const href = `/audit/${audit.job_id}`;
                return (
                <tr
                    key={i}
                    role="link"
                    tabIndex={0}
                    onClick={() => selectAudit(audit.job_id)}
                    onKeyDown={(e) => { if (e.key === 'Enter') selectAudit(audit.job_id) }}
                    className="audit-row group transition-colors hover:bg-[#f9fafb] cursor-pointer"
                    style={{ borderBottom: '1px solid #f5f7fa' }}
                >
                    
                    <td className="py-3 pr-4">
                    <span className="text-xs font-mono font-medium" style={{ color: '#00a4c6' }}>
                        AUD-{String(audit.job_id).slice(0, 4).toUpperCase()}
                    </span>
                    </td>
                    <td className="py-3 pr-4">
                    <span className="text-sm font-medium" style={{ color: '#141e27' }}>
                        {audit.url}
                    </span>
                    </td>
                    <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                        <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                            backgroundColor: `${scoreColor(audit.overall_score)}15`,
                            color: scoreColor(audit.overall_score || 0),
                        }}
                        >
                        {audit.overall_score || 0}
                        </div>
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f7fa' }}>
                        <div
                            className="h-full rounded-full"
                            style={{
                            width: `${audit.overall_score || 0}%`,
                            backgroundColor: scoreColor(audit.overall_score),
                            }}
                        />
                        </div>
                    </div>
                    </td>
                    <td className="py-3 pr-4">{statusBadge(audit.status)}</td>
                    {/* <td className="py-3 pr-4">
                    <div className="flex items-center gap-2 text-xs">
                        {audit.issues.critical > 0 && (
                        <span className="font-medium" style={{ color: '#ef4444' }}>
                            {audit.issues.critical}C
                        </span>
                        )}
                        <span className="font-medium" style={{ color: '#f59e0b' }}>
                        {audit.issues.warning}W
                        </span>
                        <span style={{ color: '#44576a' }}>
                        {audit.issues.info}I
                        </span>
                    </div>
                    </td> */}
                    <td className="py-3 text-xs" style={{ color: '#44576a' }}>
                    {/* {formatTime(audit.created_at)} */}
                    {new Date(audit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3">
                    <button className="p-1 rounded hover:bg-[#f5f7fa] opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer">
                        <MoreHorizontal className="w-4 h-4 text-[#44576a]" />
                    </button>
                    </td>
                </tr>
                )}
            )}
            </tbody>
            </table>
        </div>
    </div>
    
    </div>
    
    {/* Audit Detail Modal */}
      {selectedAudit && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedAudit(null)} />
          <div className="relative w-full max-w-[700px] max-h-[85vh] flex flex-col bg-white rounded overflow-hidden" style={{ border: '1px solid #e4e9ed' }}>
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #e4e9ed' }}>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: '#141e27' }}>Audit Report</h3>
                <p className="text-xs" style={{ color: '#8896a4' }}>{selectedAudit.url}</p>
              </div>
              <button onClick={() => setSelectedAudit(null)} className="p-1 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer">
                <span className="text-lg" style={{ color: '#44576a' }}>&times;</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Score circle */}
              <div className="flex items-center gap-6 mb-8 p-5 rounded" style={{ backgroundColor: '#f9fafb' }}>
                <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center flex-shrink-0" style={{ border: `4px solid ${scoreColor(selectedAudit.overall_score)}` }}>
                  <span className="text-3xl font-bold" style={{ color: scoreColor(selectedAudit.overall_score) }}>{selectedAudit.overall_score}</span>
                  <span className="text-[10px] uppercase" style={{ color: '#8896a4' }}>/100</span>
                </div>
                <div>
                  <p className="text-lg font-semibold" style={{ color: '#141e27' }}>
                    {selectedAudit.overall_score >= 80 ? 'Good' : selectedAudit.overall_score >= 60 ? 'Needs Work' : 'Critical'}
                  </p>
                  <p className="text-sm" style={{ color: '#44576a' }}>{}</p>
                </div>
              </div>

              {/* Category scores */}
              {(selectedAudit.lighthouse?.categories) && (
                 <div className="grid grid-cols-5 gap-3 mb-8">
                {Object.entries(selectedAudit.lighthouse.categories).map(([key, val]) => (
                  <div key={key} className="text-center p-3 rounded" style={{ backgroundColor: '#f9fafb' }}>
                    <p className="text-lg font-bold" style={{ color: scoreColor(val.score) }}>{val.score}</p>
                    <p className="text-[10px] uppercase mt-0.5" style={{ color: '#8896a4' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
              )}
             

              {/* Issues */}
              {/* {fullAudit && fullAudit.issues.length > 0 && (
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
              )} */}
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid #e4e9ed' }}>
              <Link href={`/audit/${selectedAuditId}`}>
              <button onClick={() => setSelectedAudit(null)} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>
                <Eye className="w-4 h-4" />
                View Details</button>
              </Link>
              <button
                onClick={() => { 
                  setExportAudit(selectedAudit); setSelectedAudit(null); 
                  //handleExport();
                }}
                // onClick={handleExport} disabled={exporting}
                className="px-4 py-2 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90   flex items-center gap-2"
                style={{ backgroundColor: '#00a4c6' }}
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}
    {/* Export Modal */}
    {exportAudit && <ReportExport audit={exportAudit} onClose={() => setExportAudit(null)} />}
    </>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, RefreshCw, Clock, MoreHorizontal, Search, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import gsap from 'gsap';

interface AiVisibilityAuditResults {
  job_id: string
  url: string
  status: string
  overall_score: number
  created_at: string
}

export default function RecentAiVisibilityAudits({ recentAudits }: { recentAudits: AiVisibilityAuditResults[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = recentAudits
    .filter((a) => !search || a.url.toLowerCase().includes(search.toLowerCase()) || a.job_id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'date' ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : b.overall_score - a.overall_score);

  useEffect(() => {
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.audit-row', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out' });
    }, listRef);
    return () => ctx.revert();
  }, [search, sortBy, recentAudits]);

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

  return (
    <div className='space-y-6 lg:col-span-2'>
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
              Recent AI Visibility Audits
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
              Latest AI visibility audits generated across your projects
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
                return (
                  <tr
                    key={i}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/ai-visibility/${audit.job_id}`)}
                    onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/ai-visibility/${audit.job_id}`) }}
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
                        {audit.url.replace(/^https?:\/\//, '').split('/')[0]}
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
                    <td className="py-3 text-xs" style={{ color: '#44576a' }}>
                      {new Date(audit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3">
                      <button className="p-1 rounded hover:bg-[#f5f7fa] opacity-0 group-hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer">
                        <MoreHorizontal className="w-4 h-4 text-[#44576a]" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

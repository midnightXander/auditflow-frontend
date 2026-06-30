'use client'


import { useWhiteLabel, WhiteLabelConfig } from '@/lib/whitelabel'
import { useState, useEffect, useRef } from 'react';
import Link  from 'next/link';
import gsap from 'gsap';
import {
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  Layers,
  Link2,
  FileCode,
  RefreshCw,Eye,Loader2, Download
} from 'lucide-react';
import { exportCrawlPDF } from '@/lib/pdf-export'

import { Crawl } from '@/lib/crawlData'



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
  { key: 'broken_pages', label: 'Broken Links', icon: Link2, color: '#ef4444' },
//   { key: 'redirect', label: 'Redirects', icon: RefreshCw, color: '#f59e0b' },
  { key: 'orphan_pages', label: 'Orphan Pages', icon: FileCode, color: '#6366f1' },
  { key: 'duplicate_titles', label: 'Duplicate Titles', icon: FileCode, color: '#04519e' },
  { key: 'duplicate_content', label: 'Duplicates', icon: Layers, color: '#00a4c6' },
  { key: 'missing_meta_description', label: 'Missing Meta Description', icon: FileCode, color: '#8b0785' },
  { key: 'thin_content', label: 'Thin Content', icon: FileCode, color: '#007bf7' },
  { key: 'missing_h1', label: 'Missing H1', icon: FileCode, color: '#e6f755' },
  { key: 'multiple_h1', label: 'Multiple H1', icon: FileCode, color: '#fd2205' },
  { key: 'slow_pages', label: 'Slow pages', icon: FileCode, color: '#1ce971' },
  { key: 'large_pages', label: 'Large Pages', icon: FileCode, color: '#f83973' },
  

];

export default function RecentSiteCrawls({crawls}: {crawls: Crawl[]}) {
  const [selectedCrawl, setSelectedCrawl] = useState<Crawl | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'failed'>('all');
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = crawls.filter((c) => filter === 'all' || c.status === filter);
  const [exporting, setExporting] = useState(false)
  const { config } = useWhiteLabel()

  useEffect(() => {
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.crawl-row', { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
    }, listRef);
    return () => ctx.revert();
  }, [filter]);

  function intIssues(issues:any){
    return { broken: issues.broken_pages.length, redirect: 0, orphan: issues.orphan_pages.length, duplicate: issues.duplicate_content.length, missingMeta: issues.missing_meta_description.length }
  }

  const handleExport = async () => {
        
        if (!selectedCrawl || !selectedCrawl.results) return
        setExporting(true)
        
        try { await exportCrawlPDF(selectedCrawl.results, {...config, clientName: selectedCrawl.results.client_name || ""}) }
        finally { setExporting(false) }
    }

  function crawlBreakdown(crawl:Crawl) {
    const breakdown = issueTypes.map(type => {
      // ensure proper typing when indexing issues by dynamic key
      const key = type.key as keyof typeof crawl.results.issues;
      const data = crawl.results.issues[key];
      let count = 0;

      if (Array.isArray(data)) {
        count = data.length;
      } else if (typeof data === "object" && data !== null) {
        count = Object.keys(data).length;
      }

      return {
        ...type,
        count,
      };
    });

    return breakdown;
  }
  

  return (
    <>
      <div className="space-y-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          {(['all', 'completed', 'in-progress', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded text-sm font-medium transition-all cursor-pointer border-none"
              style={{
                backgroundColor: filter === f ? '#00a4c6' : '#ffffff',
                color: filter === f ? '#ffffff' : '#44576a',
                border: filter === f ? 'none' : '1px solid #e4e9ed',
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Crawl list */}
        <div ref={listRef} className="bg-white rounded overflow-hidden" style={{ border: '1px solid #e4e9ed' }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr style={{ borderBottom: '1px solid #e4e9ed' }}>
                  {['ID', 'URL', 'Progress', 'Pages', 'Issues', 'Status', ''].map((h) => (
                    <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider py-3 px-4" style={{ color: '#8896a4' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((crawl) => (
                  <tr
                    key={crawl.id}
                    className="crawl-row group cursor-pointer transition-colors hover:bg-[#f9fafb]"
                    style={{ borderBottom: '1px solid #f5f7fa', opacity: 1 }}
                    onClick={() => setSelectedCrawl(crawl)}
                  >
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono font-medium" style={{ color: '#00a4c6' }}>CR-{String(crawl.job_id).slice(0,4)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#8896a4' }} />
                        <span className="text-sm font-medium truncate max-w-[160px]" style={{ color: '#141e27' }}>{crawl.url}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f7fa' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${crawl.progress?.toLocaleString() || 100}%`, backgroundColor: crawl.status === 'failed' ? '#ef4444' : 100 === 100 ? '#34d399' : '#6366f1' }} />
                        </div>
                        <span className="text-xs" style={{ color: '#8896a4' }}>{100}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ color: '#141e27' }}>
                      {crawl.pages_crawled.toLocaleString()}
                      <span className="text-xs" style={{ color: '#8896a4' }}> / {crawl.pages_crawled.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium" style={{ color: crawl.issues_found > 10 ? '#ef4444' : '#f59e0b' }}>
                        {crawl.issues_found}
                      </span>
                    </td>
                    <td className="py-3 px-4">{statusBadge(crawl.status)}</td>
                    <td className="py-3 px-4">
                      <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#8896a4' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Crawl Detail */}
        {selectedCrawl && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedCrawl(null)} />
            <div className="relative w-full max-w-[600px] max-h-[85vh] flex flex-col bg-white rounded overflow-hidden" style={{ border: '1px solid #e4e9ed' }}>
              <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #e4e9ed' }}>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#141e27' }}>Crawl Details</h3>
                  <p className="text-xs" style={{ color: '#8896a4' }}>{String(selectedCrawl.job_id).slice(0,4)} &middot; {selectedCrawl.url}</p>
                </div>
                <button onClick={() => setSelectedCrawl(null)} className="p-1 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer"><span className="text-lg" style={{ color: '#44576a' }}>&times;</span></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {/* Progress */}
                <div className="flex items-center gap-4 mb-6 p-4 rounded" style={{ backgroundColor: '#f9fafb' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: `3px solid ${selectedCrawl.status === 'completed' ? '#34d399' : selectedCrawl.status === 'failed' ? '#ef4444' : '#6366f1'}` }}>
                    <span className="text-lg font-bold" style={{ color: '#141e27' }}>{89}%</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e4e9ed' }}>
                      <div className="h-full rounded-full" style={{ width: `${89}%`, backgroundColor: selectedCrawl.status === 'completed' ? '#34d399' : selectedCrawl.status === 'failed' ? '#ef4444' : '#6366f1' }} />
                    </div>
                    <div className="flex justify-between mt-2 text-xs" style={{ color: '#8896a4' }}>
                      <span>{selectedCrawl.pages_crawled.toLocaleString()} pages crawled</span>
                      <span>Depth: {4}</span>
                      <span>{4}hours</span>
                    </div>
                  </div>
                </div>

                {/* Issues breakdown */}
                {selectedCrawl.status !== 'failed' && (
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#141e27' }}>Issues Found</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      
                      {crawlBreakdown(selectedCrawl).map((item) => {
                        // const count = selectedCrawl.results.issues[type.key as keyof typeof selectedCrawl.results.issues] || 0;
                        
                        
                        return (
                          <div key={item.key} className="p-3 rounded" style={{ backgroundColor: '#f9fafb' }}>
                            <item.icon className="w-4 h-4 mb-2" style={{ color: item.count > 0 ? item.color : '#c1cfda' }} />
                            <p className="text-lg font-bold" style={{ color: item.count > 0 ? item.color : '#c1cfda' }}>{item.count}</p>
                            <p className="text-[10px] uppercase" style={{ color: '#8896a4' }}>{item.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* {selectedCrawl.status === 'failed' && (
                  <div className="p-4 rounded" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                    <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Crawl Failed</p>
                    <p className="text-xs mt-1" style={{ color: '#44576a' }}>The crawl timed out after {selectedCrawl.duration}. This may be due to server restrictions, slow response times, or a large number of pages. Try reducing the crawl depth or running the crawl during off-peak hours.</p>
                  </div>
                )} */}
              </div>
              <div className="flex items-center justify-end gap-2 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid #e4e9ed' }}>
                <Link href={`/crawl/${selectedCrawl.job_id}`}>
                <button onClick={() => setSelectedCrawl(null)} className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f9fafb]" style={{ borderColor: '#e4e9ed', color: '#44576a' }}>
                    <Eye className="w-4 h-4" />
                    View Details</button>
                </Link>

                {selectedCrawl.status === 'failed' && (
                  <button className="px-4 py-2 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90" style={{ backgroundColor: '#00a4c6' }}>
                    <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                    Retry
                  </button>
                )}
                {selectedCrawl.status != 'failed' && (
                <button
                onClick={() => {  
                    handleExport();
                }}
                disabled={exporting}
                className="px-4 py-2 rounded text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90   flex items-center gap-2"
                style={{ backgroundColor: '#00a4c6' }}
                >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
                Export Report
                </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

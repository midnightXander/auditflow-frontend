'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
  FileText,
  Search,
  Zap,
  Clock,
  ShieldCheck,
  Bot
} from 'lucide-react';
import DashboardLayout from '@/components/dashboardLayout';
import { fetchWithAuth } from '@/lib/auth-context';

export default function AiVisibilityAuditResult() {
  const { jobId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const fetchData = async () => {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/ai-visibility/audit/${jobId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch audit results');
      }
      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <div className="w-12 h-12 rounded-full border-4 border-[#e4e9ed] border-t-[#00a4c6] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-[#ef4444] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#141e27]">Failed to load audit</h2>
          <p className="text-sm text-[#44576a] mt-2">{error}</p>
          <button onClick={() => router.push('/ai-visibility')} className="mt-4 px-4 py-2 bg-[#00a4c6] text-white rounded text-sm font-medium hover:opacity-90 transition-opacity">
            Go back to AI Visibility
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { results } = data;

  const scoreColor = (score: number | null) => {
    if (score === null) return '#8896a4';
    if (score >= 80) return '#34d399';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'excellent' || status === 'good') return <CheckCircle2 className="w-4 h-4 text-[#34d399]" />;
    if (status === 'fair' || status === 'needs_improvement') return <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />;
    return <XCircle className="w-4 h-4 text-[#ef4444]" />;
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <Link href="/ai-visibility" className="flex items-center gap-2 text-sm text-[#44576a] hover:underline mb-4 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Back to Audits
          </Link>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#141e27] mb-1">
                {data.url}
              </h1>
              <div className="flex items-center gap-3 text-sm text-[#8896a4]">
                <span>ID: {jobId}</span>
                <span>•</span>
                <span>{new Date(data.created_at).toLocaleString()}</span>
                {data.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0,164,198,0.15)', color: '#00a4c6' }}>
                    {data.status} ({data.progress}%)
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#e4e9ed] shadow-sm">
              <div className="text-right">
                <div className="text-xs font-medium text-[#8896a4] uppercase tracking-wider">Overall Score</div>
                <div className="text-3xl font-bold" style={{ color: scoreColor(data.overall_score) }}>
                  {data.overall_score ?? '--'}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-4" style={{ borderColor: `${scoreColor(data.overall_score)}30` }}>
                 <div className="text-xl font-bold" style={{ color: scoreColor(data.overall_score) }}>{data.overall_score ?? '-'}</div>
              </div>
            </div>
          </div>
        </div>

        {results && (
          <>
            {/* Top Fixes */}
            {results.top_fixes && results.top_fixes.length > 0 && (
              <div className="bg-[#fffbeb] border border-[#fcd34d] rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                  <h2 className="text-lg font-semibold text-[#92400e]">Top Recommendations</h2>
                </div>
                <ul className="space-y-2">
                  {results.top_fixes.map((fix: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#92400e]">
                      <span className="min-w-[4px] h-[4px] rounded-full bg-[#f59e0b] mt-2 flex-shrink-0" />
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sub-Scores Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { key: 'entity_clarity', label: 'Entity Clarity', icon: Globe, score: results.sub_scores?.entity_clarity },
                { key: 'eeat_signals', label: 'E-E-A-T Signals', icon: ShieldCheck, score: results.sub_scores?.eeat_signals },
                { key: 'content_structure', label: 'Content Structure', icon: FileText, score: results.sub_scores?.content_structure },
                { key: 'crawlability', label: 'Crawlability', icon: Bot, score: results.sub_scores?.crawlability },
              ].map((sub) => (
                <div key={sub.key} className="bg-white rounded-xl p-5 border border-[#e4e9ed] flex items-center justify-between shadow-sm transition-shadow hover:shadow-md">
                  <div>
                    <sub.icon className="w-5 h-5 text-[#8896a4] mb-2" />
                    <p className="text-sm font-medium text-[#44576a]">{sub.label}</p>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: scoreColor(sub.score) }}>
                    {sub.score ?? '--'}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              
              {/* Entity Clarity Section */}
              {results.entity_clarity && (
                <div className="bg-white border border-[#e4e9ed] rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-[#e4e9ed] bg-[#f9fafb] flex items-center justify-between">
                    <h3 className="font-semibold text-[#141e27] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#00a4c6]" /> Entity Clarity
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: scoreColor(results.entity_clarity.score) }}>
                        {results.entity_clarity.score}
                      </span>
                      {getStatusIcon(results.entity_clarity.status)}
                    </div>
                  </div>
                  <div className="p-5 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#f5f7fa] p-3 rounded">
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-1">Has JSON-LD</div>
                        <div className="font-medium text-[#141e27]">{results.entity_clarity.has_json_ld ? 'Yes' : 'No'}</div>
                      </div>
                      <div className="bg-[#f5f7fa] p-3 rounded">
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-1">Schema Types Found</div>
                        <div className="font-medium text-[#141e27]">{results.entity_clarity.schema_types_found?.length || 0}</div>
                      </div>
                    </div>
                    {results.entity_clarity.schema_types_found?.length > 0 && (
                       <div>
                          <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-1">Found Schemas</div>
                          <div className="flex flex-wrap gap-1">
                            {results.entity_clarity.schema_types_found.map((s:string, i:number) => (
                              <span key={i} className="px-2 py-1 bg-[#e0f2fe] text-[#0369a1] rounded text-xs">{s}</span>
                            ))}
                          </div>
                       </div>
                    )}
                    {results.entity_clarity.sameas_links?.length > 0 && (
                      <div>
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-2">SameAs Links (Knowledge Graph)</div>
                        <ul className="space-y-1">
                          {results.entity_clarity.sameas_links.map((link:any, i:number) => (
                            <li key={i} className="flex justify-between items-center bg-[#f9fafb] px-3 py-2 rounded text-[#44576a]">
                              <span className="font-medium">{link.domain}</span>
                              <a href={link.url} target="_blank" rel="noreferrer" className="text-[#00a4c6] hover:underline text-xs truncate max-w-[200px]">{link.url}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {results.entity_clarity.recommendations?.length > 0 && (
                      <div className="mt-4 border-t border-[#e4e9ed] pt-4">
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-2">Recommendations</div>
                        <ul className="list-disc pl-4 space-y-1 text-[#44576a]">
                          {results.entity_clarity.recommendations.map((rec:string, i:number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* E-E-A-T Signals Section */}
              {results.eeat_signals && (
                <div className="bg-white border border-[#e4e9ed] rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-[#e4e9ed] bg-[#f9fafb] flex items-center justify-between">
                    <h3 className="font-semibold text-[#141e27] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#00a4c6]" /> E-E-A-T Signals
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: scoreColor(results.eeat_signals.score) }}>
                        {results.eeat_signals.score}
                      </span>
                      {getStatusIcon(results.eeat_signals.status)}
                    </div>
                  </div>
                  <div className="p-5 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        { label: 'About Page', val: results.eeat_signals.about_page?.found },
                        { label: 'Contact Page', val: results.eeat_signals.contact_page?.found },
                        { label: 'Privacy Policy', val: results.eeat_signals.privacy_policy?.found },
                        { label: 'Terms of Service', val: results.eeat_signals.terms_of_service?.found },
                        { label: 'HTTPS', val: results.eeat_signals.https },
                        { label: 'Author Schema', val: results.eeat_signals.author_schema_present }
                      ].map((item, i) => (
                         <div key={i} className={`px-3 py-2 rounded flex items-center justify-between ${item.val ? 'bg-[#ecfdf5] text-[#065f46]' : 'bg-[#fef2f2] text-[#991b1b]'}`}>
                           <span>{item.label}</span>
                           {item.val ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                         </div>
                      ))}
                    </div>
                    {results.eeat_signals.recommendations?.length > 0 && (
                      <div className="mt-4 border-t border-[#e4e9ed] pt-4">
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-2">Recommendations</div>
                        <ul className="list-disc pl-4 space-y-1 text-[#44576a]">
                          {results.eeat_signals.recommendations.map((rec:string, i:number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content Structure Section */}
              {results.content_structure && (
                <div className="bg-white border border-[#e4e9ed] rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-[#e4e9ed] bg-[#f9fafb] flex items-center justify-between">
                    <h3 className="font-semibold text-[#141e27] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00a4c6]" /> Content Structure
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: scoreColor(results.content_structure.score) }}>
                        {results.content_structure.score}
                      </span>
                      {getStatusIcon(results.content_structure.status)}
                    </div>
                  </div>
                  <div className="p-5 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#f5f7fa] p-3 rounded">
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-1">FAQ Pattern</div>
                        <div className="font-medium text-[#141e27]">{results.content_structure.has_faq_pattern || results.content_structure.has_faq_schema ? 'Yes' : 'No'}</div>
                      </div>
                      <div className="bg-[#f5f7fa] p-3 rounded">
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-1">Citations/Stats</div>
                        <div className="font-medium text-[#141e27]">{results.content_structure.has_stats_or_citations ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    
                    {results.content_structure.heading_structure && (
                      <div>
                         <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-2">Heading Distribution</div>
                         <div className="flex gap-2">
                            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((hx) => (
                              <div key={hx} className="flex-1 text-center bg-[#f9fafb] border border-[#e4e9ed] py-2 rounded">
                                <div className="text-[10px] text-[#8896a4] font-bold uppercase">{hx}</div>
                                <div className="font-semibold text-[#141e27]">{results.content_structure.heading_structure[hx] || 0}</div>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}
                    
                    {results.content_structure.recommendations?.length > 0 && (
                      <div className="mt-4 border-t border-[#e4e9ed] pt-4">
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-2">Recommendations</div>
                        <ul className="list-disc pl-4 space-y-1 text-[#44576a]">
                          {results.content_structure.recommendations.map((rec:string, i:number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Crawlability Section */}
              {results.crawlability && (
                <div className="bg-white border border-[#e4e9ed] rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-[#e4e9ed] bg-[#f9fafb] flex items-center justify-between">
                    <h3 className="font-semibold text-[#141e27] flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#00a4c6]" /> AI Crawlability
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: scoreColor(results.crawlability.score) }}>
                        {results.crawlability.score}
                      </span>
                      {getStatusIcon(results.crawlability.status)}
                    </div>
                  </div>
                  <div className="p-5 space-y-4 text-sm">
                    {results.crawlability.bot_status && (
                      <div>
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-2">Bot Access Matrix</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-2">
                          {Object.entries(results.crawlability.bot_status).map(([botName, info]: [string, any]) => (
                            <div key={botName} className="flex items-center justify-between bg-[#f9fafb] p-2 rounded text-xs border border-[#e4e9ed]">
                              <span className="text-[#44576a] font-medium truncate max-w-[150px]" title={info.label}>{info.label}</span>
                              {info.allowed ? (
                                <span className="bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded font-semibold text-[10px]">ALLOWED</span>
                              ) : (
                                <span className="bg-[#fef2f2] text-[#dc2626] px-2 py-0.5 rounded font-semibold text-[10px]">BLOCKED</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {results.crawlability.recommendations?.length > 0 && (
                      <div className="mt-4 border-t border-[#e4e9ed] pt-4">
                        <div className="text-xs text-[#8896a4] uppercase tracking-wider mb-2">Recommendations</div>
                        <ul className="list-disc pl-4 space-y-1 text-[#44576a]">
                          {results.crawlability.recommendations.map((rec:string, i:number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

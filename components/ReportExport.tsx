import { useState } from 'react';
import { CheckCircle2, Download, FileText, Layers, Palette, X, Loader2 } from 'lucide-react';
import { reportTemplates } from '@/lib/auditData';
import type { AuditResults } from '@/lib/auditData';
import { exportAuditPDF } from '@/lib/pdf-export'
import { useWhiteLabel } from '@/lib/whitelabel';

interface ReportExportProps {
  audit: AuditResults;
  onClose: () => void;
}

export default function ReportExport({ audit, onClose }: ReportExportProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0].id);
  const { config } = useWhiteLabel()
  const [exporting, setExporting] = useState(false)
  const [branding, setBranding] = useState({
    companyName: config.agencyName,
    primaryColor: config.accentColor,
    clientName: audit.client_name,
    showLogo: true,
    preparedBy: config.preparedBy,
    reportFooter: config.reportFooter,
    includeCompetitors: true,
    includeKeywords: true,
    includeIssues: true,
  });
  const [step, setStep] = useState<'template' | 'branding' | 'preview'>('template');

  const scoreLabel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: '#34d399' };
    if (score >= 80) return { label: 'Good', color: '#00a4c6' };
    if (score >= 60) return { label: 'Needs Work', color: '#f59e0b' };
    return { label: 'Critical', color: '#ef4444' };
  };

  const sl = scoreLabel(audit.overall_score);
  // const criticalCount = audit.issues.filter((i) => i.severity === 'critical').length;
  // const warningCount = audit.issues.filter((i) => i.severity === 'warning').length;
  // const infoCount = audit.issues.filter((i) => i.severity === 'info').length;
  const criticalCount = 12;
  const warningCount = 7;
  const infoCount = 2;

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
      if (!audit) return
      setExporting(true)
      try { await exportAuditPDF(audit, {...config, clientName: audit.client_name || '',  }) }
      finally { setExporting(false) }
    }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative w-full max-w-[900px] max-h-[90vh] flex flex-col rounded-md overflow-hidden"
        style={{ backgroundColor: '#f5f7fa' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e4e9ed' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#141e27' }}>
            Export White-Label Report
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#f5f7fa] bg-transparent border-none cursor-pointer">
            <X className="w-5 h-5 text-[#44576a]" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-6 py-3 flex-shrink-0" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e4e9ed' }}>
          {[
            { key: 'template' as const, label: 'Template', icon: Layers },
            { key: 'branding' as const, label: 'Branding', icon: Palette },
            { key: 'preview' as const, label: 'Preview & Export', icon: FileText },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md bg-transparent border-none cursor-pointer transition-all"
              style={{
                color: step === s.key ? branding.primaryColor : '#44576a',
                backgroundColor: step === s.key ? `${branding.primaryColor}10` : 'transparent',
              }}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'template' && (
            <div className="space-y-4">
              <p className="text-sm" style={{ color: '#44576a' }}>
                Choose a report template that matches your client presentation style.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {reportTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className="text-left p-4 rounded-md border-2 transition-all cursor-pointer bg-white"
                    style={{
                      borderColor: selectedTemplate === t.id ? t.accentColor : '#e4e9ed',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${t.accentColor}15` }}
                      >
                        <FileText className="w-5 h-5" style={{ color: t.accentColor }} />
                      </div>
                      {selectedTemplate === t.id && (
                        <CheckCircle2 className="w-5 h-5" style={{ color: t.accentColor }} />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: '#141e27' }}>
                      {t.name}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: '#44576a' }}>
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'branding' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>
                  Company / Agency Name
                </label>
                <input
                  type="text"
                  value={branding.companyName}
                  onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-md text-sm outline-none"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e4e9ed', color: '#141e27' }}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>
                  Client/Target Name
                </label>
                <input
                  type="text"
                  value={branding.clientName}
                  onChange={(e) => setBranding({ ...branding, clientName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-md text-sm outline-none"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e4e9ed', color: '#141e27' }}
                />
              </div>

              

              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: '#141e27' }}>
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer border-none"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="px-3 py-2.5 rounded-md text-sm outline-none w-32"
                    style={{ backgroundColor: '#ffffff', border: '1px solid #e4e9ed', color: '#141e27' }}
                  />
                </div>
              </div>

              <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Prepared by</label>
                  <input
                    value={config.preparedBy}
                    onChange={e => setBranding(p => ({ ...p, preparedBy: e.target.value }))}
                    placeholder="Jane Smith, SEO Lead"
                  />
                </div>

                {/* Footer text */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    Report Footer
                  </div>
                  <textarea
                    value={config.reportFooter}
                    onChange={e => setBranding(p => ({ ...p, reportFooter: e.target.value }))}
                    rows={2}
                    className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    placeholder={`Report generated by ${branding.companyName} — fast website audits and seo tools.`}
                  />
                </section>

              <div className="space-y-3">
                <label className="text-sm font-medium block" style={{ color: '#141e27' }}>
                  Report Sections
                </label>
                {[
                  { key: 'showLogo' as const, label: 'Show company branding header' },
                  { key: 'includeCompetitors' as const, label: 'Include competitor comparison' },
                  { key: 'includeKeywords' as const, label: 'Include keyword rankings' },
                  { key: 'includeIssues' as const, label: 'Include all issue details' },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={branding[opt.key]}
                      onChange={(e) => setBranding({ ...branding, [opt.key]: e.target.checked })}
                      className="w-4 h-4 rounded accent-[#00a4c6]"
                    />
                    <span className="text-sm" style={{ color: '#44576a' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-4">
              {/* Print-only report preview */}
              <div
                id="report-preview"
                className="bg-white rounded-md overflow-hidden"
                style={{ border: '1px solid #e4e9ed' }}
              >

                {/* Report Header */}
                <section className="space-y-2 p-4">
                  <p className="text-sm font-semibold text-gray-700">Preview</p>
                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    {/* mini header */}
                    <div
                      className="flex items-center justify-between px-4 py-2"
                      style={{ background: config.accentColor }}
                    >
                      <div className="flex items-center gap-2">
                        {config.agencyLogo ? (
                          <img src={config.agencyLogo} alt="" className="h-5 w-auto" />
                        ) : (
                          <span className="text-white font-bold text-xs">{config.agencyName || 'Your Agency'}</span>
                        )}
                      </div>
                      <span className="text-white/70 text-[10px]">Page 1 of 5</span>
                    </div>
                    {/* mini cover */}
                    <div className="bg-gray-50 px-4 py-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Website Audit Report</p>
                      <p className="text-xs font-semibold text-gray-800">{config.clientName || 'Client Company'}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Prepared by {config.preparedBy || config.agencyName}</p>
                    </div>
                  </div>
                </section>

                {/* {branding.showLogo && (
                  <div className="px-8 py-6" style={{ borderBottom: `3px solid ${branding.primaryColor}` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold" style={{ color: '#141e27' }}>
                          {branding.companyName}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#44576a' }}>
                          Professional SEO Audit Report
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: '#44576a' }}>
                          Generated: {new Date(audit.audit_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-xs" style={{ color: '#44576a' }}>
                          Confidential
                        </p>
                      </div>
                    </div>
                  </div>
                )} */}

                <div className="px-8 py-6">
                  {/* Target */}
                  <div className="mb-8">
                    <p className="text-xs uppercase tracking-wider font-medium" style={{ color: '#44576a' }}>
                      Audit Target
                    </p>
                    <p className="text-lg font-semibold mt-1" style={{ color: '#141e27' }}>
                      {audit.url}
                    </p>
                  </div>

                  {/* Overall Score */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 rounded-md" style={{ backgroundColor: '#f9fafb' }}>
                    <div
                      className="w-24 h-24 rounded-full flex flex-col items-center justify-center flex-shrink-0"
                      style={{ border: `4px solid ${sl.color}` }}
                    >
                      <span className="text-2xl font-bold" style={{ color: sl.color }}>{audit.overall_score}</span>
                      <span className="text-[10px] uppercase" style={{ color: '#44576a' }}>/100</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-semibold" style={{ color: '#141e27' }}>
                        {sl.label}
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#44576a' }}>
                        {/* {audit.summary} */}
                      </p>
                    </div>
                  </div>

                  {/* Category Scores */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#141e27' }}>
                      Category Scores
                    </h3>
                    {(audit.lighthouse?.categories) && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {Object.entries(audit.lighthouse.categories).map(([key, val]) => (
                        <div key={key} className="text-center p-3 rounded-md" style={{ backgroundColor: '#f9fafb' }}>
                          <p className="text-xl font-bold" style={{ color: scoreLabel(val.score).color }}>{val.score}</p>
                          <p className="text-[10px] uppercase mt-1" style={{ color: '#44576a' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                    )}
                  </div>

                  {/* Issues Summary */}
                  {branding.includeIssues && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#141e27' }}>
                        Issues Found
                      </h3>
                      <div className="flex items-center gap-6 mb-4">
                        {criticalCount > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
                            <span className="text-sm" style={{ color: '#44576a' }}>{criticalCount} Critical</span>
                          </div>
                        )}
                        {warningCount > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                            <span className="text-sm" style={{ color: '#44576a' }}>{warningCount} Warnings</span>
                          </div>
                        )}
                        {infoCount > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#00a4c6]" />
                            <span className="text-sm" style={{ color: '#44576a' }}>{infoCount} Info</span>
                          </div>
                        )}
                      </div>

                      

                      {/* <div className="space-y-3">
                        {audit.issues.map((issue) => (
                          <div
                            key={issue.id}
                            className="p-4 rounded-md"
                            style={{
                              backgroundColor: '#f9fafb',
                              borderLeft: `3px solid ${
                                issue.severity === 'critical' ? '#ef4444' : issue.severity === 'warning' ? '#f59e0b' : '#00a4c6'
                              }`,
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded"
                                style={{
                                  backgroundColor:
                                    issue.severity === 'critical'
                                      ? '#fef2f2'
                                      : issue.severity === 'warning'
                                      ? '#fffbeb'
                                      : '#ecfeff',
                                  color:
                                    issue.severity === 'critical'
                                      ? '#ef4444'
                                      : issue.severity === 'warning'
                                      ? '#f59e0b'
                                      : '#00a4c6',
                                }}
                              >
                                {issue.severity}
                              </span>
                              <span className="text-xs" style={{ color: '#8896a4' }}>{issue.category}</span>
                            </div>
                            <p className="text-sm font-medium" style={{ color: '#141e27' }}>{issue.title}</p>
                            <p className="text-xs mt-1" style={{ color: '#44576a' }}>{issue.description}</p>
                            <p className="text-xs mt-2 font-medium" style={{ color: '#141e27' }}>
                              Fix: {issue.recommendation}
                            </p>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  )}

                  {/* Keywords */}
                  {/* {branding.includeKeywords && audit.keywords.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#141e27' }}>
                        Keyword Rankings
                      </h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e4e9ed' }}>
                            <th className="text-left py-2 text-xs font-medium uppercase" style={{ color: '#44576a' }}>Keyword</th>
                            <th className="text-center py-2 text-xs font-medium uppercase" style={{ color: '#44576a' }}>Position</th>
                            <th className="text-right py-2 text-xs font-medium uppercase" style={{ color: '#44576a' }}>Volume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {audit.keywords.map((k, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f5f7fa' }}>
                              <td className="py-2.5 font-medium" style={{ color: '#141e27' }}>{k.keyword}</td>
                              <td className="py-2.5 text-center font-semibold" style={{ color: k.position <= 3 ? '#34d399' : k.position <= 10 ? '#00a4c6' : '#f59e0b' }}>
                                #{k.position}
                              </td>
                              <td className="py-2.5 text-right" style={{ color: '#44576a' }}>{k.volume.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )} */}

                  {/* Competitors */}
                  {/* {branding.includeCompetitors && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#141e27' }}>
                        Competitor Comparison
                      </h3>
                      <div className="space-y-3">
                        {[{ name: audit.url, score: audit.overall_score }, ...audit.competitors].map((c, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <span className="text-sm w-32 truncate" style={{ color: '#141e27' }}>
                              {i === 0 ? 'Your Site' : c.name}
                            </span>
                            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#f5f7fa' }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${c.score}%`,
                                  backgroundColor: i === 0 ? branding.primaryColor : '#c1cfda',
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-10 text-right" style={{ color: '#141e27' }}>{c.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {/* Footer */}
                  <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid #e4e9ed' }}>
                    <p className="text-xs" style={{ color: '#8896a4' }}>
                      Report generated by {branding.companyName} 
                    </p>
                  </div>
                    
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e4e9ed' }}>
          <div className="flex gap-2">
            {step !== 'template' && (
              <button
                onClick={() => setStep(step === 'branding' ? 'template' : 'branding')}
                className="px-4 py-2.5 rounded-md text-sm font-medium bg-transparent border cursor-pointer hover:bg-[#f5f7fa]"
                style={{ borderColor: '#e4e9ed', color: '#44576a' }}
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {step !== 'preview' ? (
              <button
                onClick={() => setStep(step === 'template' ? 'branding' : 'preview')}
                className="px-5 py-2.5 rounded-md text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90"
                style={{ backgroundColor: branding.primaryColor }}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={() => { 
                  handleExport();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white border-none cursor-pointer hover:opacity-90"
                style={{ backgroundColor: branding.primaryColor }}
              >
                {exporting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
                Export PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #report-preview, #report-preview * { visibility: visible !important; }
          #report-preview { position: absolute; left: 0; top: 0; width: 100%; border: none !important; }
        }
      `}</style>
    </div>
  );
}

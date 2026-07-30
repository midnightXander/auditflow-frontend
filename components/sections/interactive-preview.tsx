'use client'

import { useState } from 'react'
import { Upload, Copy, Check, Palette, Building2 } from 'lucide-react'
import { ImageIcon } from 'lucide-react'
import Link from 'next/link'

const reportPages = [
  {
    title: 'Executive Summary',
    subtitle: 'A concise overview of the current site, growth opportunities, and what to prioritize first.',
    metrics: [
      { label: 'Overall SEO score', value: '72 / 100' },
      { label: 'Visibility opportunity', value: '+18%' },
      { label: 'Top priority', value: 'Content relevance & page speed' },
    ],
    bullets: [
      'Homepage and service pages have strong structure, but content lacks keyword focus.',
      'Technical setup is healthy overall; a few crawl issues are holding back rankings.',
      'Competitors are outpacing on local visibility and backlink-driven category pages.',
    ],
  },
  {
    title: 'Technical SEO',
    subtitle: 'Crawlability, indexing, speed, and secure delivery explained in plain language.',
    metrics: [
      { label: 'Crawl issues found', value: '12' },
      { label: 'Core Web Vitals', value: 'Good / Needs improvement' },
      { label: 'Broken links', value: '5' },
    ],
    bullets: [
      'Redirect chains and duplicate canonical tags are affecting page rankings.',
      'Mobile performance is strong, but desktop speed needs a 2s improvement.',
      'Sitemap and robots rules are correct, no major index blockers detected.',
    ],
  },
  {
    title: 'Content & Relevance',
    subtitle: 'How client messaging, page structure, and search intent compare to competitors.',
    metrics: [
      { label: 'Content quality score', value: '68 / 100' },
      { label: 'Keyword mix', value: 'Balanced brand + conversion' },
      { label: 'Missing page types', value: '3' },
    ],
    bullets: [
      'Service pages need clearer benefits, outcomes, and case study examples.',
      'Several landing pages are missing strong calls to action for sales-ready visitors.',
      'Competitors win on feature detail and keyword-rich subheaders.',
    ],
  },
  {
    title: 'Rankings & Competitors',
    subtitle: 'Search visibility, keyword position gaps, and where rivals are stronger.',
    table: {
      columns: ['Keyword', 'Your Rank', 'Top Competitor', 'Opportunity'],
      rows: [
        ['SEO audit agency', '5', '1', 'Improve page copy'],
        ['technical SEO services', '8', '2', 'Add case studies'],
        ['content audit tool', '12', '4', 'Build resource page'],
      ],
    },
  },
  {
    title: 'Recommendations',
    subtitle: 'Client-ready action steps that turn insight into faster wins.',
    bullets: [
      'Prioritize speed fixes on the homepage and two highest-traffic landing pages.',
      'Refresh service page content with clear outcomes and keywords the buyer uses.',
      'Use the competitor gap report to show clients where rivals are outperforming them.',
      'Deliver this report as a branded audit summary in every pitch.',
    ],
  },
]

export default function InteractivePreview() {
  const [agencyName, setAgencyName] = useState('Pulse Media Agency')
  const [brandColor, setBrandColor] = useState('#00a4c6')
  const [clientName, setClientName] = useState('Tech Startup Inc.')
  const [logoUrl, setLogoUrl] = useState('/logo.svg')
  const [copied, setCopied] = useState(false)
  const [activePage, setActivePage] = useState(0)

  const page = reportPages[activePage]

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCopyCode = () => {
    const embedCode = `<!-- Embed Widget Code -->\n<script src="https://app.outaudits.io/embed.js" data-api-key="YOUR_API_KEY"></script>\n<div id="outaudits-widget"></div>`
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#141e27] to-[#0d1318]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label text-[#00a4c6] font-semibold text-sm block mb-4">INTERACTIVE PREVIEW</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Agency-ready reports, ready to share</h2>
          <p className="text-lg text-[#c1cfda] max-w-2xl mx-auto">
            Preview a five-page audit report that combines technical SEO, content insight, rankings and competitor gaps in client-friendly language.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12">
          <div className="space-y-6">
            <div className="bg-[#1a2a38] border border-[#374c63] rounded p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Customize your report</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-[#c1cfda] mb-2">Agency logo</label>
                  <div className="flex items-center gap-4">
                    <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <label htmlFor="logo-upload" className="flex items-center gap-2 px-4 py-3 border border-[#374c63] rounded cursor-pointer hover:border-[#00a4c6] transition-colors bg-[#0f172a] text-[#c1cfda]">
                      <Upload className="w-4 h-4" /> Upload logo
                    </label>
                    <div className="w-16 h-16 rounded-lg bg-white/5 border border-[#374c63] flex items-center justify-center">
                      <img src={logoUrl} alt="Logo preview" className="w-14 h-14 object-contain" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#c1cfda] mb-2">Agency name</label>
                  <input
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full rounded-2xl border border-[#374c63] bg-[#0f172a] px-4 py-3 text-white focus:border-[#00a4c6] focus:outline-none"
                    placeholder="Pulse Media Agency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#c1cfda] mb-2">Client name</label>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-2xl border border-[#374c63] bg-[#0f172a] px-4 py-3 text-white focus:border-[#00a4c6] focus:outline-none"
                    placeholder="Tech Startup Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#c1cfda] mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Brand color
                  </label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-16 h-12 rounded-lg border border-[#374c63]" />
                    <input
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1 rounded-2xl border border-[#374c63] bg-[#0f172a] px-4 py-3 text-white focus:border-[#00a4c6] focus:outline-none"
                      placeholder="#00a4c6"
                    />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-6 gap-2">
                    {['#00a4c6', '#0dd3b6', '#00d9ff', '#7c3aed', '#ec4899', '#f59e0b'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setBrandColor(color)}
                        className="h-10 rounded-xl border transition-transform hover:-translate-y-0.5"
                        style={{
                          backgroundColor: color,
                          borderColor: brandColor === color ? '#ffffff' : '#334155',
                          borderWidth: brandColor === color ? '3px' : '1px',
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyCode}
                className="mt-8 w-full rounded-2xl px-5 py-3 font-semibold text-white transition-all"
                style={{ backgroundColor: brandColor }}
              >
                {copied ? 'Embed code copied' : 'Copy embed code'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded border border-[#334155] bg-[#0f172a] p-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#334155]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#94a3b8]">Preview report</p>
                  <h3 className="mt-3 text-3xl font-extrabold text-white">Five-page audit report</h3>
                  <p className="mt-3 text-sm leading-6 text-[#c1cfda] max-w-2xl">
                    This mock report follows the workflow agencies use to turn audit findings into a client-ready recommendation package.
                  </p>
                </div>
                <div className="rounded-full border border-[#334155] bg-[#111827] px-4 py-2 text-sm text-[#cbd5e1]">{clientName}</div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {reportPages.map((pageItem, index) => (
                  <button
                    key={pageItem.title}
                    onClick={() => setActivePage(index)}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${activePage === index ? 'bg-white text-slate-950' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
                  >
                    {index + 1}. {pageItem.title}
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded bg-[#111827] border border-[#334155] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#94a3b8]">Page {activePage + 1} of 5</p>
                    <h4 className="mt-2 text-2xl font-semibold text-white">{page.title}</h4>
                  </div>
                  <p className="text-sm text-[#cbd5e1] max-w-xl">{page.subtitle}</p>
                </div>

                <div className="mt-8 grid gap-4">
                  {page.metrics && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {page.metrics.map((metric) => (
                        <div key={metric.label} className="rounded bg-[#0f172a] border border-[#334155] p-4">
                          <p className="text-xs uppercase tracking-[0.25em] text-[#94a3b8]">{metric.label}</p>
                          <p className="mt-3 text-xl font-semibold text-white">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {page.bullets && (
                    <div className="space-y-3 rounded bg-[#0f172a] border border-[#334155] p-5 text-sm text-[#cbd5e1]">
                      {page.bullets.map((item) => (
                        <div key={item} className="flex gap-3">
                          <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#00a4c6]" />
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {page.table && (
                    <div className="overflow-hidden rounded border border-[#334155] bg-[#0f172a]">
                      <table className="w-full border-collapse text-sm text-[#cbd5e1]">
                        <thead className="bg-[#111827] text-[11px] uppercase tracking-[0.3em] text-[#94a3b8]">
                          <tr>
                            {page.table.columns.map((column) => (
                              <th key={column} className="px-4 py-3 text-left">{column}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {page.table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-[#121827]' : 'bg-[#0f172a]'}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-3">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-[#c1cfda] text-center">✨ Pages update instantly as you customize branding and client details.</p>
          </div>
        </div>

        <div className="mt-16 rounded border border-[#334155] bg-[#0f172a] p-8 shadow-2xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded bg-[#111827] border border-[#334155] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#94a3b8]">Technical SEO</p>
              <h4 className="mt-4 text-xl font-semibold text-white">Fix issues that hurt crawl and speed</h4>
              <p className="mt-3 text-sm text-[#cbd5e1]">Mocked findings include redirect cleanup, improved structured data, and faster page loads for the pages that matter most.</p>
            </div>
            <div className="rounded bg-[#111827] border border-[#334155] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#94a3b8]">Content</p>
              <h4 className="mt-4 text-xl font-semibold text-white">Make content more persuasive</h4>
              <p className="mt-3 text-sm text-[#cbd5e1]">Jargon-free recommendations highlight gaps in case studies, service messaging, and buying-stage content.</p>
            </div>
            <div className="rounded bg-[#111827] border border-[#334155] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#94a3b8]">Rankings</p>
              <h4 className="mt-4 text-xl font-semibold text-white">Spot keyword and competitor gaps</h4>
              <p className="mt-3 text-sm text-[#cbd5e1]">The mock report shows where competitors own the top spots and what to fix next.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-[#c1cfda] mb-6">Launch a client-ready competitor comparison and turn findings into a revenue-driving proposal.</p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-2xl bg-[#00a4c6] px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:bg-[#0093B2]"
          >
            Start creating reports
          </Link>
        </div>
      </div>
    </section>
  )
}

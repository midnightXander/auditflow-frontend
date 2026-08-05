'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, Palette } from 'lucide-react'
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
  const [showPreview, setShowPreview] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  const page = reportPages[activePage]

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

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

  const handleSaveBranding = () => setShowPreview(true)
  const handleEditBranding = () => setShowPreview(false)

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-[#141e27] to-[#0d1318]"
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-16">
          <span className="section-label text-[#00a4c6] font-semibold text-sm block mb-4">
            INTERACTIVE PREVIEW
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
           See Reports your way
          </h2>
          <p className="text-lg text-[#c1cfda] max-w-2xl mx-auto">
            Set your agency logo, client name, and primary color first. then hit
            save.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!showPreview ? (
            <div className="rounded-[2rem] border border-[#334155] bg-[#0f172a] p-10 shadow-2xl">
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-[#94a3b8]">
                  Agency branding
                </p>
                <h3 className="mt-4 text-3xl font-extrabold text-white">
                  Start with your agency identity
                </h3>
                <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
                  Enter Agency Settings
                </p>
              </div>

              <div className="mt-12 grid gap-6">
                <div className="rounded-3xl border border-[#334155] bg-[#111827] p-6">
                  <label className="block text-sm font-semibold text-[#c1cfda] mb-3">
                    Agency logo
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="inline-flex items-center gap-2 rounded-2xl border border-[#374c63] bg-[#0f172a] px-4 py-3 text-sm text-[#c1cfda] cursor-pointer transition hover:border-[#00a4c6]"
                    >
                      <Upload className="w-4 h-4" />
                      Upload logo
                    </label>
                    <div
                      className="w-20 h-20 rounded-3xl border border-[#374c63] bg-white/5 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: '#0f172a' }}
                    >
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo preview"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-[#6b7280]" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#334155] bg-[#111827] p-6">
                  <label className="block text-sm font-semibold text-[#c1cfda] mb-2">
                    Agency name
                  </label>
                  <input
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full rounded-2xl border border-[#374c63] bg-[#0f172a] px-4 py-3 text-white focus:border-[#00a4c6] focus:outline-none"
                    placeholder="Pulse Media Agency"
                  />
                </div>

                <div className="rounded-3xl border border-[#334155] bg-[#111827] p-6">
                  <label className="block text-sm font-semibold text-[#c1cfda] mb-2">
                    Client name
                  </label>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-2xl border border-[#374c63] bg-[#0f172a] px-4 py-3 text-white focus:border-[#00a4c6] focus:outline-none"
                    placeholder="Tech Startup Inc."
                  />
                </div>

                <div className="rounded-3xl border border-[#334155] bg-[#111827] p-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#c1cfda] mb-3">
                    <Palette className="w-4 h-4" />
                    Brand color
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-full max-w-[90px] h-12 rounded-2xl border border-[#374c63]"
                    />
                    <input
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1 rounded-2xl border border-[#374c63] bg-[#0f172a] px-4 py-3 text-white focus:border-[#00a4c6] focus:outline-none"
                      placeholder="#00a4c6"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {['#00a4c6', '#0dd3b6', '#00d9ff', '#7c3aed', '#ec4899', '#f59e0b'].map(
                    (color) => (
                      <button
                        key={color}
                        onClick={() => setBrandColor(color)}
                        className="h-10 rounded border transition duration-200 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: color,
                          borderColor: brandColor === color ? '#ffffff' : '#334155',
                          borderWidth: brandColor === color ? '3px' : '1px',
                        }}
                        title={color}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSaveBranding}
                  className="rounded-2xl bg-[#00a4c6] px-8 py-4 text-sm font-semibold text-slate-950 shadow-xl transition hover:bg-[#00c2dc]"
                >
                  Save branding
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="rounded-[2rem] border border-[#334155] bg-[#0f172a] p-6 shadow-2xl transition-all duration-700">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-16 w-16 rounded-3xl border border-white/10 bg-white/5 p-3"
                      style={{ backgroundColor: '#0f172a' }}
                    >
                      <img
                        src={logoUrl}
                        alt="Agency logo"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-[#94a3b8]">
                        Branded report
                      </p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {agencyName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleEditBranding}
                    className="rounded-2xl border border-[#334155] bg-[#111827] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20"
                  >
                    Modify agency branding
                  </button>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Branding preview
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {agencyName} · {clientName}
                  </p>
                </div>
                <div
                  className="rounded-2xl px-4 py-2 text-sm font-semibold text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  Primary brand color
                </div>
              </div>
            </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-xl transition-all duration-700">
            <div className="">
              <div className="space-y-6">
                <div className="bg-white p-6 shadow-md rounded-2xl border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        Preview report
                      </p>
                      <h3 className="mt-3 text-3xl font-extrabold text-slate-900">
                        Prioritized audit report
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600 max-w-2xl">
                        Upload your logo and enter agency name, brand colors and hit Save
                      </p>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700">
                      {clientName}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {reportPages.map((pageItem, index) => (
                      <button
                        key={pageItem.title}
                        onClick={() => setActivePage(index)}
                        className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                          activePage === index
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {index + 1}. {pageItem.title}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                          Page {activePage + 1} of 5
                        </p>
                        <h4 className="mt-2 text-2xl font-semibold text-slate-900">
                          {page.title}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 max-w-xl">{page.subtitle}</p>
                    </div>

                    <div className="mt-8 grid gap-4">
                      {page.metrics && (
                        <div className="grid gap-3 sm:grid-cols-3">
                          {page.metrics.map((metric) => (
                            <div
                              key={metric.label}
                              className="rounded bg-white border border-slate-200 p-4 shadow-sm"
                            >
                              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                {metric.label}
                              </p>
                              <p className="mt-3 text-xl font-semibold text-slate-900">
                                {metric.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {page.bullets && (
                        <div className="space-y-3 rounded bg-white border border-slate-200 p-5 text-sm text-slate-700 shadow-sm">
                          {page.bullets.map((item) => (
                            <div key={item} className="flex gap-3">
                              <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#00a4c6]" />
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {page.table && (
                        <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
                          <table className="w-full border-collapse text-sm text-slate-700">
                            <thead className="bg-slate-100 text-[11px] uppercase tracking-[0.3em] text-slate-500">
                              <tr>
                                {page.table.columns.map((column) => (
                                  <th key={column} className="px-4 py-3 text-left font-semibold">
                                    {column}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {page.table.rows.map((row, rowIndex) => (
                                <tr
                                  key={rowIndex}
                                  className={
                                    rowIndex % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'
                                  }
                                >
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-3 border-t border-slate-100">
                                      {cell}
                                    </td>
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

                <div className="text-center text-sm text-slate-500">
                  ✨ Pages update instantly as you customize branding and client details.
                </div>
              </div>
            </div>

            {/* <div className="mt-8 py-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Technical SEO</p>
                  <h4 className="mt-4 text-xl font-semibold text-slate-900">
                    Fix issues that hurt crawl and speed
                  </h4>
                  <p className="mt-3 text-sm text-slate-600">
                    Mocked findings include redirect cleanup, improved structured data, and faster page loads.
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Content</p>
                  <h4 className="mt-4 text-xl font-semibold text-slate-900">
                    Make content more persuasive
                  </h4>
                  <p className="mt-3 text-sm text-slate-600">
                    Jargon-free recommendations highlight gaps in case studies, service messaging, and buying-stage content.
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Rankings</p>
                  <h4 className="mt-4 text-xl font-semibold text-slate-900">
                    Spot keyword and competitor gaps
                  </h4>
                  <p className="mt-3 text-sm text-slate-600">
                    The mock report shows where competitors own the top spots and what to fix next.
                  </p>
                </div>
              </div>
            </div> */}

            <div className="text-center mt-8">
              <p className="text-slate-600 mb-4">
                {/* This preview is fully branded for agency positioning and built to feel like a polished client deliverable. */}
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-[#00a4c6] px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0093B2]"
              >
                Start creating reports
              </Link>
            </div>
          </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
'use client'

import { useState } from 'react'
import { Upload, Copy, Check, Palette, Building2 } from 'lucide-react'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function ScreenshotPlaceholder({ label = 'Report', size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = size === 'lg' ? 'w-full h-64 md:h-96' : size === 'sm' ? 'w-40 h-24' : 'w-full h-48'
  return (
    <div className={`rounded border-2 border-dashed border-[#374c63] bg-gradient-to-r from-[#1a2a38] to-[#263747] p-4 flex items-center justify-center ${sizeClasses}`}>
      <div className="text-center">
        <div className="mx-auto mb-3 w-12 h-12 rounded-md bg-[#263747] flex items-center justify-center text-[#44576a]">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div className="text-sm text-[#c1cfda]">{label}</div>
      </div>
    </div>
  )
}

export default function InteractivePreview() {
  const router = useRouter()
  const [agencyName, setAgencyName] = useState('Pulse Media Agency')
  const [brandColor, setBrandColor] = useState('#00a4c6')
  const [clientName, setClientName] = useState('Tech Startup Inc.')
  const [logoUrl, setLogoUrl] = useState('/logo.svg')
  const [copied, setCopied] = useState(false)

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
    const embedCode = `<!-- Embed Widget Code -->
<script src="https://app.outaudits.io/embed.js" data-api-key="YOUR_API_KEY"></script>
<div id="outaudits-widget"></div>`
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reportScreenshots = [
    { title: 'Executive Summary', desc: 'High-level overview' },
    { title: 'Performance Metrics', desc: 'Speed & Core Web Vitals' },
    { title: 'SEO Analysis', desc: 'On-page optimization' },
    { title: 'Technical Issues', desc: 'Crawl & indexability' },
    { title: 'Recommendations', desc: 'Prioritized fixes' },
    { title: 'Competitor Comparison', desc: 'Competitive analysis' },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-[#141e27] to-[#0d1318]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label text-[#00a4c6] font-semibold text-sm block mb-4">INTERACTIVE PREVIEW</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See Reports Your Way
          </h2>
          <p className="text-lg text-[#c1cfda] max-w-2xl mx-auto">
            Customize branding in real-time and preview how your audits look to clients
          </p>
        </div>

        {/* Main Preview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left - Customization Panel */}
          <div className="space-y-6">
            <div className="bg-[#1a2a38] border border-[#374c63] rounded p-8">
              <h3 className="text-xl font-bold text-white mb-6">Customize Your Branding</h3>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#c1cfda] mb-3">Agency Logo</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#374c63] rounded cursor-pointer hover:border-[#00a4c6] transition-colors bg-[#141e27]"
                  >
                    <Upload className="w-4 h-4 text-[#44576a]" />
                    <span className="text-sm text-[#c1cfda]">Upload logo</span>
                  </label>
                </div>
                {logoUrl && (
                  <div className="mt-3 flex items-center justify-center w-16 h-16 bg-white rounded border border-[#374c63]">
                    <img src={logoUrl} alt="Preview" className="w-14 h-14 object-contain" />
                  </div>
                )}
              </div>

              {/* Agency Name */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#c1cfda] mb-2">Agency Name</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#141e27] border border-[#374c63] rounded text-white placeholder-[#44576a] focus:border-[#00a4c6] focus:outline-none focus:ring-2 focus:ring-[#00a4c6]/20 transition-all"
                  placeholder="Your agency name"
                />
              </div>

              {/* Client Name */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#c1cfda] mb-2">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#141e27] border border-[#374c63] rounded text-white placeholder-[#44576a] focus:border-[#00a4c6] focus:outline-none focus:ring-2 focus:ring-[#00a4c6]/20 transition-all"
                  placeholder="Client company name"
                />
              </div>

              {/* Brand Color */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#c1cfda] mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-16 h-12 rounded cursor-pointer border border-[#374c63]"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141e27] border border-[#374c63] rounded text-white text-sm focus:border-[#00a4c6] focus:outline-none"
                      placeholder="#00a4c6"
                    />
                  </div>
                </div>
              </div>

              {/* Preset Colors */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#c1cfda] mb-3">Preset Colors</label>
                <div className="grid grid-cols-6 gap-2">
                  {['#00a4c6', '#0dd3b6', '#00d9ff', '#7c3aed', '#ec4899', '#f59e0b'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrandColor(color)}
                      className="w-full h-10 rounded border-2 transition-all hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: brandColor === color ? '#ffffff' : '#374c63',
                        borderWidth: brandColor === color ? '3px' : '2px',
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Copy Embed Code */}
              <button
                onClick={handleCopyCode}
                className="w-full px-4 py-3 rounded font-semibold flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: brandColor,
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Embed Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right - Live Preview */}
          <div className="space-y-4">
            <div className="bg-[#1a2a38] border border-[#374c63] rounded overflow-hidden shadow-2xl">
              {/* Header */}
              <div
                className="p-6 text-white"
                style={{ backgroundColor: brandColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <img src={logoUrl} alt={agencyName} className="w-10 h-10 object-contain" />
                    ) : (
                      <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}
                    <span className="font-bold text-lg">{agencyName}</span>
                  </div>
                  <span className="text-sm font-semibold opacity-90">SEO AUDIT REPORT</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                {/* Score Card */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">SEO Score</h2>
                  <div className="flex items-end gap-4">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#374c63"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={brandColor}
                          strokeWidth="8"
                          strokeDasharray={`${282 * 0.72} 282`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">72</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#c1cfda] text-sm">Good Performance</p>
                      <p className="text-white font-semibold mt-1">For: {clientName}</p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Mobile Ready', value: '85%' },
                    { label: 'Page Speed', value: '78%' },
                    { label: 'SEO', value: '72%' },
                    { label: 'Accessibility', value: '88%' },
                  ].map((metric) => (
                    <div key={metric.label} className="bg-[#263747] p-4 rounded">
                      <p className="text-sm text-[#c1cfda]">{metric.label}</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: brandColor }}>
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* SEO Opportunities */}
                <div className="border-t border-gray-200 pt-8">
                  <h4 className="font-bold text-white text-lg mb-4">SEO Opportunities</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-[#263747]  rounded border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-amber-100">Add missing meta descriptions</p>
                        <p className="text-sm text-[#c1cfda]">23 pages missing optimized meta tags</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[#263747]  rounded border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-amber-100">Improve internal linking strategy</p>
                        <p className="text-sm text-[#c1cfda]">Strengthen topical authority with better links</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[#263747]  rounded border border-amber-200">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-amber-100">Fix broken backlinks</p>
                        <p className="text-sm text-[#c1cfda]">127 broken links detected - recover lost authority</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-[#263747]  rounded border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold text-emerald-100">Sitemap & robots.txt optimized</p>
                        <p className="text-sm text-[#c1cfda]">Crawlability fully optimized</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#374c63]">
                  <p className="text-xs text-[#44576a]">Report generated by {agencyName} • {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-[#c1cfda] text-center">
              ✨ Changes update instantly • Your clients see branded reports
            </p>
          </div>
        </div>

        {/* Report Showcase Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-2">Report Examples</h3>
            <p className="text-[#c1cfda]">Your clients receive beautifully formatted, comprehensive audit reports</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportScreenshots.map((report, index) => (
              <div key={index} className="group">
                <ScreenshotPlaceholder label={report.title} size="md" />
                <div className="mt-3">
                  <h4 className="font-semibold text-white group-hover:text-[#00a4c6] transition-colors">
                    {report.title}
                  </h4>
                  <p className="text-sm text-[#c1cfda]">{report.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-[#c1cfda] mb-6">
            Try creating your own branded reports today
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded font-semibold text-white transition-all hover:scale-105"
            style={{
              backgroundColor: '#00a4c6',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00a4c6cc'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#00a4c6'
            }}
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </section>
  )
}

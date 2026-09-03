'use client'

import { useState, useRef, useEffect } from 'react'
import { useWhiteLabel, WhiteLabelConfig } from '@/lib/whitelabel'
 import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Building2, Upload, Palette, User, Briefcase } from 'lucide-react'
import { exportGlossary } from "@/lib/pdf-export";
interface WhiteLabelFormProps {
  onClose: () => void
}

export const terms = [
    {
        term: "Algorithm",
        definition: "Google’s secret recipe for ranking pages. You can’t see it, but you can make pages it likes: clear content, fast performance, and a trustworthy reputation.",
        businessImpact: "Understanding how algorithms work helps you create content that performs well in search results."
    },
    {
        term: "Authority",
        definition: "How much Google trusts your site for a topic. The more you’re seen as an expert, the more likely you are to appear for relevant searches.",
        businessImpact: "Building authority in your niche helps you rank higher and gain more visibility in search results."
    },
    {
        term: "Backlink",
        definition: "A link from another site to yours — a public vote. Links from reputable sites are one of the strongest signals that build trust and visibility.",
        businessImpact: "Quality backlinks are crucial for improving your site's credibility and search engine rankings."
    },
    {
        term: "Bounce Rate",
        definition: "The share of visitors who leave after viewing only one page. A high bounce usually means the page didn’t match user expectations.",
        businessImpact: "A high bounce rate can indicate that your content isn't engaging or relevant, which can negatively affect your search rankings."
    },
    {
        term: "Crawling",
        definition: "Google’s automated spiders reading your pages. If Google can’t crawl your site, it can’t rank it — blocked crawling is like a locked front door.",
        businessImpact: "Ensuring your site is crawlable is essential for search engines to index your content and improve visibility."
    },
    {
        term : "Domain Authority (DA)",
        definition : "A third-party score (0–100) estimating ranking strength. It’s a rough tool, not a Google metric — use it as a reference, not gospel.",
        businessImpact : "Monitoring your DA can help you gauge your site's overall SEO health and competitiveness in your industry."
    },
    {
        term: "Duplicate Content",
        definition: "Content that appears on multiple pages, either within your site or across the web. Search engines may penalize sites with excessive duplicate content.",
        businessImpact: "Avoiding duplicate content is crucial for maintaining your site's credibility and ensuring proper indexing by search engines."
    },
    {
        term : "Featured Snippet",
        definition : "The highlighted answer box at the top of search results. If you win it, you appear above the #1 result and get extra attention.",
        businessImpact : "Winning a featured snippet can significantly increase visibility and click-through rates."
    },
    {
        term : "Focus Keyword",
        definition : "The single phrase a page is meant to answer. Staying focused helps match searcher queries and avoids confusing the page’s purpose.",
        businessImpact : ""
    },
    {
    term: "Indexing",
    definition: "When Google adds a page to its searchable library. If a page isn’t indexed, it won’t show up in search at all.",
    businessImpact: "Ensuring important pages are indexed makes them discoverable in search and prevents potential traffic and revenue opportunities from being lost."
  },
  {
    term: "Internal Links",
    definition: "Links between your own pages. They help visitors find related content and tell Google which pages are connected and important.",
    businessImpact: "Strong internal linking improves navigation, distributes SEO authority, and helps important pages rank more effectively."
  },
  {
    term: "Jargon",
    definition: "Insider language that confuses clients. Plain explanations build trust and let clients understand value and results.",
    businessImpact: "Replacing SEO jargon with clear language improves client understanding, trust, and the perceived value of your services."
  },
  {
    term: "Keyword",
    definition: "A word or phrase people type into search. Ranking for the right keywords means showing up when potential customers are looking.",
    businessImpact: "Targeting the right keywords connects your business with relevant prospects who are actively searching for your products or services."
  },
  {
    term: "Link Building",
    definition: "Strategies to earn links from other sites. Done correctly it increases trust; spammy/paid links can cause penalties.",
    businessImpact: "High-quality backlinks can strengthen your website’s authority and improve rankings, increasing qualified organic traffic."
  },
  {
    term: "Local SEO",
    definition: "Optimizing to appear in local results, like “near me” searches. Essential for businesses serving a specific area — it brings ready-to-buy customers.",
    businessImpact: "Effective local SEO increases visibility among nearby customers and can drive more calls, visits, bookings, and local sales."
  },
  {
    term: "Long-Tail Keywords",
    definition: "Longer, specific searches (e.g., “CRM for small real estate agencies”). Lower volume but higher intent — often easier to convert.",
    businessImpact: "Targeting long-tail keywords can attract highly qualified prospects with specific needs and improve conversion rates."
  },
  {
    term: "Meta Description",
    definition: "The short text under a page title in search results. Think of it as free ad copy — a good one increases clicks even without higher rank.",
    businessImpact: "Compelling meta descriptions can improve click-through rates, bringing more potential customers to your site without requiring higher rankings."
  },
  {
    term: "On-Page vs Off-Page SEO",
    definition: "On-page: things you control on the site (content, titles, speed). Off-page: external factors (links, mentions). Both work together to earn visibility.",
    businessImpact: "Balancing on-page and off-page SEO builds stronger search visibility and creates more opportunities to attract qualified traffic."
  },
  {
    term: "Organic Traffic",
    definition: "Visitors from unpaid search results. High-value traffic because people came looking for something — no cost-per-click.",
    businessImpact: "Growing organic traffic can generate a steady stream of qualified prospects while reducing reliance on paid advertising."
  },
  {
    term: "Page Speed",
    definition: "How quickly a page loads. Slower pages frustrate users and reduce conversions — and search engines prefer fast pages.",
    businessImpact: "Improving page speed can reduce user drop-offs, increase conversions, and support stronger search performance."
  },
  {
    term: "Ranking",
    definition: "Your page’s position in search results. Page 1 captures most clicks — moving up even a few positions can greatly increase traffic.",
    businessImpact: "Higher rankings increase your brand’s visibility and can generate significantly more qualified traffic and potential customers."
  },
  {
    term: "Rank Tracking",
    definition: "Monitoring position changes over time. It’s how you show progress: \"We moved from #9 to #3\" is an easy-to-understand result.",
    businessImpact: "Rank tracking provides measurable evidence of SEO progress and helps businesses identify which strategies are driving growth."
  },
  {
    term: "Search Intent",
    definition: "The reason someone searches: to learn, buy, or find a site. Matching content to intent is how you both rank and convert visitors.",
    businessImpact: "Matching search intent helps attract visitors who are more likely to engage, take action, and become customers."
  },
  {
    term: "Sitemap",
    definition: "A file that lists your pages so search engines can crawl them more efficiently. Think of it as a map for Google.",
    businessImpact: "A well-structured sitemap helps search engines discover important pages faster, improving their chances of being crawled and indexed."
  },
  {
    term: "Technical SEO",
    definition: "Behind-the-scenes fixes: speed, mobile, broken links, crawlability. It’s the plumbing — if it’s broken, great content won’t perform well.",
    businessImpact: "Strong technical SEO removes barriers that prevent search engines and users from accessing your content, protecting traffic and conversions."
  },
  {
    term: "White-Hat SEO",
    definition: "SEO done by the rules: helpful content and honest tactics. It’s sustainable — shortcuts (black-hat) risk penalties and removal.",
    businessImpact: "Following sustainable SEO practices reduces penalty risk and creates long-term search visibility that can consistently generate business."
  },
  {
    term: "Zero-Click Searches",
    definition: "When Google answers the query on the results page so no click is needed. You still gain brand visibility if your content is quoted there.",
    businessImpact: "Appearing in zero-click results can increase brand awareness and establish authority even when users don’t visit your website."
  }

         

]

export function WhiteLabelForm() {
  const { config, setConfig } = useWhiteLabel()
  const { refreshUser } = useAuth()
  const [form, setForm] = useState<WhiteLabelConfig>({ ...config })
  const fileRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  

  // Sync form with config when it changes (e.g., after database load)
  useEffect(() => {
    setForm({ ...config })
  }, [config])
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, agencyLogo: ev.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const save = async () => {
    setConfig(form)
    // Refresh user so the header agency name/logo updates immediately
    await refreshUser()
    
  }

  const handleExport = async () => {
      setExporting(true)
      try { await exportGlossary(terms, form) }
      finally { setExporting(false) }
    }

  const presetColors = [
    '#0075FF', '#8766FF', '#10B981', '#F59E0B',
    '#EF4444', '#06B6D4', '#6366F1', '#EC4899',
    '#14B8A6', '#F97316', '#8B5CF6', '#1E293B',
  ]

  return (
    <div className="relative flex items-center justify-center">

      {/* Panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-lg w-full max-h-[80vh] overflow-hidden max-w-lg flex flex-col ">
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${form.accentColor}ee, ${form.accentColor}99)` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-none">Agency Branding</h2>
              <p className="text-white/70 text-xs mt-0.5">White-label report settings</p>
            </div>
          </div>
          <button
            // onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Agency details */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Building2 className="w-4 h-4" style={{ color: form.accentColor }} />
              Agency Details
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Agency Name *</label>
                <Input
                  value={form.agencyName}
                  onChange={e =>  setForm(p => ({ ...p, agencyName: e.target.value })) }
                  placeholder="Acme Digital Agency"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Agency Website</label>
                <Input
                  value={form.agencyUrl}
                  onChange={e => setForm(p => ({ ...p, agencyUrl: e.target.value }))}
                  placeholder="https://youragency.com"
                />
              </div>
            </div>
          </section>

          {/* Report recipients */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="w-4 h-4" style={{ color: form.accentColor }} />
              Report Recipients
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Client Name</label>
                <Input
                  value={form.clientName}
                  onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))}
                  placeholder="Client Company Ltd"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Prepared by</label>
                <Input
                  value={form.preparedBy}
                  onChange={e => setForm(p => ({ ...p, preparedBy: e.target.value }))}
                  placeholder="Jane Smith, SEO Lead"
                />
              </div>
            </div>
          </section>

          {/* Logo */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Upload className="w-4 h-4" style={{ color: form.accentColor }} />
              Agency Logo
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-gray-300 transition-colors flex items-center gap-4"
            >
              {form.agencyLogo ? (
                <>
                  <img
                    src={form.agencyLogo}
                    alt="Agency logo"
                    className="h-12 w-auto object-contain rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Logo uploaded</p>
                    <p className="text-xs text-gray-500">Click to replace</p>
                  </div>
                </>
              ) : (
                <div className="text-center w-full">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Click to upload logo</p>
                  <p className="text-xs text-gray-400">PNG, SVG, JPG — shown on PDF cover</p>
                </div>
              )}
            </div>
          </section>

          {/* Accent colour */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Palette className="w-4 h-4" style={{ color: form.accentColor }} />
              Brand Colour
            </div>
            
            {/* Preset Colors */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Preset colours:</p>
              <div className="grid grid-cols-6 gap-2">
                {presetColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setForm(p => ({ ...p, accentColor: color }))}
                    className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: form.accentColor === color ? '#1F2937' : 'transparent',
                      boxShadow: form.accentColor === color ? '0 0 0 2px white, 0 0 0 3px #1F2937' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Custom colour:</p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={e => setForm(p => ({ ...p, accentColor: e.target.value }))}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    title="Pick a custom color"
                  />
                </div>
                <Input
                  value={form.accentColor}
                  onChange={e => {
                    const v = e.target.value.toUpperCase()
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setForm(p => ({ ...p, accentColor: v }))
                  }}
                  placeholder="#0075FF"
                  className="font-mono text-sm flex-1"
                  maxLength={7}
                />
              </div>
            </div>
          </section>

          {/* Footer text */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              Report Footer
            </div>
            <textarea
              value={form.reportFooter}
              onChange={e => setForm(p => ({ ...p, reportFooter: e.target.value }))}
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Report generated by OUTAudits — fast website audits and seo tools."
            />
          </section>

          {/* Live preview strip */}
          <section className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Preview</p>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              {/* mini header */}
              <div
                className="flex items-center justify-between px-4 py-2"
                style={{ background: form.accentColor }}
              >
                <div className="flex items-center gap-2">
                  {form.agencyLogo ? (
                    <img src={form.agencyLogo} alt="" className="h-5 w-auto" />
                  ) : (
                    <span className="text-white font-bold text-xs">{form.agencyName || 'Your Agency'}</span>
                  )}
                </div>
                <span className="text-white/70 text-[10px]">Page 1 of 5</span>
              </div>
              {/* mini cover */}
              <div className="bg-gray-50 px-4 py-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Website Audit Report</p>
                <p className="text-xs font-semibold text-gray-800">{form.clientName || 'Client Company'}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Prepared by {form.preparedBy || form.agencyName}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 bg-gray-50">
          <Button
            onClick={handleExport}
            className="w-full text-white"
            style={{ background: form.accentColor }}
          >
            download PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
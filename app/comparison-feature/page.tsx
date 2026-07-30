import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Competitor Comparison — OUTAudits',
  description: 'See how you stack up vs competitors. Fast audits, clear gaps, and client-ready recommendations for agencies.'
}

export default function CompareLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="text-sm font-semibold text-primary-600 uppercase">Competitor Compare</p>
            <h1 className="mt-4 text-4xl font-extrabold text-slate-900">Know where you win — and where competitors are taking deals</h1>
            <p className="mt-4 text-lg text-slate-600">Run fast, agency-grade comparisons to show clients exactly which pages, keywords, and technical gaps matter. Translate findings into persuasive recommendations and win more retainers.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/compare" className="inline-flex items-center px-6 py-3 bg-[#00a4c6] text-white rounded-md font-semibold shadow">Start a comparison</Link>
              <Link href="/register" className="inline-flex items-center px-6 py-3 border border-gray-200 rounded-md text-sm text-slate-700">Start free trial</Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-bold">Fast audits</h3>
                <p className="text-sm text-slate-500 mt-2">Parallel crawling and scoring so you get answers, not waiting.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-bold">Clear wins</h3>
                <p className="text-sm text-slate-500 mt-2">Category-by-category winners, ready to present to clients without jargon.</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-bold">Actionable steps</h3>
                <p className="text-sm text-slate-500 mt-2">Prioritized fixes and copy suggestions that move the needle quickly.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-gray-100 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Live demo</p>
                <h3 className="text-lg font-semibold text-slate-900">Sample competitor summary</h3>
              </div>
              <div className="text-sm text-slate-500">3 competitors</div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Overall score</p>
                    <p className="text-xl font-black">72</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Top competitor</p>
                    <p className="font-semibold">competitor.com</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white border">
                <p className="text-xs text-slate-400">Top opportunities</p>
                <ul className="mt-2 text-sm text-slate-600 space-y-1">
                  <li>Improve service page copy to capture buyer intent</li>
                  <li>Reduce largest render-blocking scripts on landing pages</li>
                  <li>Recover high-value backlinks to category pages</li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-white border">
                <p className="text-xs text-slate-400">Why agencies use this</p>
                <p className="mt-2 text-sm text-slate-600">Turn side-by-side evidence into proposals that close. Use comparison reports in pitches and retainers.</p>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/compare" className="block w-full text-center px-4 py-2 rounded-md bg-[#00a4c6] text-white font-semibold">Try the demo comparison</Link>
            </div>
          </div>
        </div>

        <section className="mt-20">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="p-4 rounded-lg border bg-white">
              <h4 className="font-semibold">1. Add competitors</h4>
              <p className="text-sm text-slate-600 mt-2">Enter up to 3 competitor domains and start the analysis in minutes.</p>
            </div>
            <div className="p-4 rounded-lg border bg-white">
              <h4 className="font-semibold">2. We run audits</h4>
              <p className="text-sm text-slate-600 mt-2">Parallel audits collect speed, SEO, content, and backlink signals.</p>
            </div>
            <div className="p-4 rounded-lg border bg-white">
              <h4 className="font-semibold">3. Present results</h4>
              <p className="text-sm text-slate-600 mt-2">Use the client-ready summary and prioritized tasks to win and deliver work faster.</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

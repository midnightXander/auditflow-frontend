'use client'

import { useEffect, useState } from 'react'
import { Search, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const resultItems = [
  { label: 'SEO score', value: '84 / 100', accent: 'Strong technical setup' },
  { label: 'Content quality', value: 'High', accent: 'Clear service messaging' },
  { label: 'Rankings snapshot', value: 'Top 10 in 3 keywords' },
]

export default function AnimatedSearchDemo() {
  const [typedUrl, setTypedUrl] = useState('')
  const [phase, setPhase] = useState<'typing' | 'loading' | 'results'>('typing')

  useEffect(() => {
    const target = 'pulseagency.com'
    let index = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    if (phase === 'typing') {
      const typeNext = () => {
        setTypedUrl(target.slice(0, index + 1))
        index += 1
        if (index < target.length) {
          timers.push(setTimeout(typeNext, 70))
        } else {
          timers.push(setTimeout(() => setPhase('loading'), 700))
        }
      }
      timers.push(setTimeout(typeNext, 400))
    }

    if (phase === 'loading') {
      timers.push(setTimeout(() => setPhase('results'), 1400))
    }

    return () => timers.forEach(clearTimeout)
  }, [phase])

  return (
    <section className="py-20 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-6">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Live demo</span>
            <h2 className="text-4xl font-bold text-white">
              Animated audit preview: URL entered, results revealed
            </h2>
            <p className="max-w-2xl text-slate-300">
              Show agency clients how fast branded audits load. This demo animates a URL being entered, the report loading smoothly, and a five-page summary appearing with SEO, content, and rankings insight.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                'Mock audit data built for agencies',
                'Clear technical and content messaging',
                'Competitor gap summary included',
                'Smooth preview animation for demos',
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <p className="text-sm text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                    <Search size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Audit widget</p>
                    <p className="mt-1 text-sm text-slate-300">Branded lead capture and preview</p>
                  </div>
                </div>
                <div className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-400">
                  Agency demo
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3">
                  <span className="text-slate-500">https://</span>
                  <input
                    readOnly
                    value={typedUrl}
                    className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    placeholder="pulseagency.com"
                  />
                  <button className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">
                    Launch
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  {phase === 'typing' && (
                    <div className="text-sm text-slate-400">Typing URL…</div>
                  )}
                  {phase === 'loading' && (
                    <div className="flex items-center justify-between rounded-2xl border border-cyan-600/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
                      <span>Analyzing site performance</span>
                      <span className="animate-pulse">Loading…</span>
                    </div>
                  )}
                  {phase === 'results' && (
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-slate-950 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Report preview</p>
                            <p className="mt-1 text-lg font-semibold text-white">5-page audit summary ready to share</p>
                          </div>
                          <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Branded</div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          {resultItems.map((item) => (
                            <div key={item.label} className="rounded-2xl bg-slate-900 p-4">
                              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                              <p className="mt-3 font-semibold text-white">{item.value}</p>
                              {item.accent && <p className="mt-2 text-sm text-slate-400">{item.accent}</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {['Technical SEO', 'Content', 'Rankings', 'Competitor gaps'].map((tag) => (
                          <span key={tag} className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/compare-landing" className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg">
            View competitor compare landing
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white">
            Start branded reports
          </Link>
        </div>
      </div>
    </section>
  )
}
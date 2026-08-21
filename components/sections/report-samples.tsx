'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ImageIcon, Sparkles } from 'lucide-react'

const reportSamples = [
  {
    title: 'Enterprise Audit Snapshot',
    label: 'Performance + Visibility',
    score: '89',
    trend: '+12%',
    keyHighlights: ['Page speed priority', 'Structured data gaps', 'Backlink momentum'],
    accent: 'from-cyan-500 to-sky-500',
  },
  {
    title: 'Local Growth Brief',
    label: 'Conversion-focused roadmap',
    score: '94',
    trend: '+20%',
    keyHighlights: ['Local schema checks', 'Review listing health', 'Mobile experience boost'],
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'Content Authority Report',
    label: 'Keyword & intent signal',
    score: '77',
    trend: '+8%',
    keyHighlights: ['Content grouping', 'SERP gap map', 'Tone alignment'],
    accent: 'from-emerald-500 to-lime-500',
  },
]

function getCardTransform(index: number, active: number, length: number) {
  const prevIndex = (active - 1 + length) % length
  const nextIndex = (active + 1) % length

  if (index === active) {
    return {
      transform: 'translate3d(-50%, -50%, 0) scale(1) rotateY(0deg)',
      opacity: 1,
      zIndex: 30,
    }
  }

  if (index === prevIndex) {
    return {
      transform: 'translate3d(-100%, -50%, -80px) scale(0.85) rotateY(18deg)',
      opacity: 0.55,
      zIndex: 20,
    }
  }

  if (index === nextIndex) {
    return {
      transform: 'translate3d(0%, -50%, -80px) scale(0.85) rotateY(-18deg)',
      opacity: 0.55,
      zIndex: 20,
    }
  }

  return {
    transform: 'translate3d(-50%, -50%, 0) scale(0.65) rotateY(0deg)',
    opacity: 0,
    zIndex: 10,
  }
}

function ScreenshotPlaceholder({ label = 'Screenshot', src, size = 'md' }: { label?: string; src?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = size === 'lg' ? 'w-full h-64 md:h-96' : size === 'sm' ? 'w-40 h-24' : 'w-full h-48'
  
  if(src) {
    return (
      <img src={src} alt={label} className={`rounded-lg border-2 border-dashed border-gray-200 p-4 flex items-center justify-center ${sizeClasses}`} />
    )
  }
  return (
    <div className={`rounded-lg border-2 border-dashed border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 flex items-center justify-center ${sizeClasses}`}>
      <div className="text-center">
        <div className="mx-auto mb-3 w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  )
}


export default function ReportSamples() {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = reportSamples.length

  const prevIndex = useMemo(
    () => (activeIndex - 1 + total) % total,
    [activeIndex, total]
  )
  const nextIndex = useMemo(
    () => (activeIndex + 1) % total,
    [activeIndex, total]
  )

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total)
    }, 8000)
    return () => window.clearInterval(interval)
  }, [total])

  return (
    <section className="relative overflow-hidden py-20 bg-slate-950 text-white">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_45%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 ">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Report Samples
            </span>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Floating report previews that feel magnetic.
            </h2>
            <p className="max-w-xl text-slate-300 leading-8">
              Showcase your audit outputs with glass-like snapshots, layered depth, and intuitive swipe-ready navigation. These report samples blend an agency-grade design with playful motion so the outcome feels premium and alive.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveIndex(prevIndex)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous sample
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex(nextIndex)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-300/30 bg-teal-500/10 px-5 py-3 text-sm font-semibold text-teal-200 transition hover:border-teal-300/50 hover:bg-teal-500/20"
              >
                Next sample
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative isolate overflow-visible rounded-[3rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 rounded-[3rem] border border-white/10 opacity-40" />
            <div className="pointer-events-none absolute border  left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="pointer-events-none absolute border  left-1/3 top-16 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="pointer-events-none absolute border  right-12 top-28 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex justify-center items-center h-[540px] sm:h-[520px] md:h-[480px]">
              {reportSamples.map((sample, index) => {
                const style = getCardTransform(index, activeIndex, total)
                const isVisible = index === activeIndex || index === prevIndex || index === nextIndex

                return (
                  <article
                    key={sample.title}
                    className={`absolute top-1/2 left-1/2  max-w-full -translate-y-15 rounded-xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/40 transition-all duration-700 ease-out ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={style}
                  >

                    <ScreenshotPlaceholder label={sample.title} size="lg" />
                    {/* <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{sample.label}</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">{sample.title}</h3>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-slate-900 bg-gradient-to-r ${sample.accent}`}>
                        {sample.trend}
                      </span>
                    </div> */}

                    {/* <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-5 shadow-inner shadow-slate-900/30">
                      <div className="flex items-end justify-between gap-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Report score</p>
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-4xl font-semibold text-white">{sample.score}</span>
                            <span className="text-sm text-slate-500">/ 100</span>
                          </div>
                        </div>
                        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3 ring-1 ring-white/10">
                          <div className="relative flex h-full w-full items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-cyan-300">
                            Live
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        {sample.keyHighlights.map((highlight) => (
                          <div key={highlight} className="flex items-center gap-3 text-sm text-slate-300">
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div> */}

                    {/* <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-slate-500">
                        <span>Snapshot</span>
                        <span>Mobile + desktop</span>
                      </div>
                      <div className="mt-4 grid gap-3">
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className="h-full w-[78%] rounded-full bg-cyan-400" />
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className="h-full w-[62%] rounded-full bg-fuchsia-400" />
                        </div>
                        <div className="h-2 rounded-full bg-slate-800">
                          <div className="h-full w-[54%] rounded-full bg-emerald-400" />
                        </div>
                      </div>
                    </div> */}

                    {/* <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.32em] text-slate-500">
                      <span>Visual preview</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-200">Brand ready</span>
                    </div> */}
                  </article>
                )
              })}

              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {reportSamples.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Show sample ${index + 1}`}
                    aria-pressed={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      index === activeIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveIndex(prevIndex)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                
              </button>
              <button
                type="button"
                onClick={() => setActiveIndex(nextIndex)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-300/30 bg-teal-500/10 px-5 py-3 text-sm font-semibold text-teal-200 transition hover:border-teal-300/50 hover:bg-teal-500/20"
              >
                
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  )
}

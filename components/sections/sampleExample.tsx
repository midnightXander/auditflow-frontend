'use client'

import { useEffect, useRef, useMemo, useState } from 'react'
import { ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react'


const reportSamples = [
  {
    title: 'Enterprise Audit Snapshot',
    label: 'Performance + Visibility',
    src: "/images/reports/report1.png",
    alt:"Enterprise Audit Snapshot",
    accent: 'from-cyan-500 to-sky-500',
  },
  {
    title: 'Local Growth Brief',
    label: 'Conversion-focused roadmap',
    src: "/images/reports/report2.png",
    alt:"",
    score: '94',
    trend: '+20%',
    keyHighlights: ['Local schema checks', 'Review listing health', 'Mobile experience boost'],
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'Content Authority Report',
    label: 'Keyword & intent signal',
    src: "/images/reports/report3.png",
    alt:"",
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

function ScreenshotPlaceholder({ label = 'Screenshot', src,alt  }: { label?: string; src?: string; alt?: string }) {
  //const sizeClasses = size === 'lg' ? 'w-full h-64 md:h-96' : size === 'sm' ? 'w-40 h-24' : 'w-full h-48'
  
  if(src) {
    return (
      <img src={src} alt={alt || label} className={`rounded-lg border border-white/20 flex items-center justify-center w-full md:h-96 `} />
    )
  }
  return (
    <div className={`rounded-lg border-2 border-dashed border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 flex items-center justify-center w-full md:h-96 sm:h-48 `}>
      <div className="text-center">
        <div className="mx-auto mb-3 w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  )
}

export default function ExamplePreview() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

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

 


  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 bg-gradient-to-b from-[#141e27] to-[#0d1318]"
    >
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_45%)]" />

      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-16">
          <span className="section-label text-[#00a4c6] font-semibold text-sm block mb-4">
            Sample Report
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How Your Clients Will Experience Your Insights
          </h2>
          {/* <p className="text-lg text-[#c1cfda] max-w-2xl mx-auto">
            Explore our sample reports to see how your clients will experience the insights and recommendations you provide. Each report is designed to be clear, actionable, and visually appealing, ensuring your clients understand the value of your services.
          </p> */}
        </div>

        <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-[#141e27] p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
          
          <div className="relative  items-center h-[540px] sm:h-[520px] md:h-[480px]">
            
                <div
                  
                  className={`relative bottom-[-120px] max-w-1/2 -translate-y-0 -translate-x-0 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-2xl shadow-slate-950/40 transition-all duration-700 ease-out 
                `
                } >
                <img src="/images/reports/report2.png"  className={`rounded-3xl border border-white/20 flex items-center justify-center w-full md:h-96 `} />
                </div>
              

            {/* <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
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
            </div> */}
          </div>
          
          {/* <div className="flex justify-center flex-wrap gap-3">
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
          </div> */}
        </div>

      </div>
    </section>
  )
}
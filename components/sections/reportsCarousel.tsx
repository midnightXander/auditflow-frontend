// components/ReportCarousel.tsx
"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from 'next/link'
import { ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react'

interface ReportCarouselProps {
  reportImages: string[]; // array of image paths/URLs
}

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

const ReportCarousel: React.FC<ReportCarouselProps> = ({ reportImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)
  const total = reportImages.length

  const prevIndex = useMemo(
        () => (currentIndex - 1 + total) % total,
        [currentIndex, total]
      )
      const nextIndex = useMemo(
        () => (currentIndex + 1) % total,
        [currentIndex, total]
      )

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? reportImages.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === reportImages.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
      const interval = window.setInterval(() => {
        setCurrentIndex((current) => (current + 1) % total)
      }, 8000)
      return () => window.clearInterval(interval)
    }, [total])
  

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          console.log("Set visible")
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative pt-20 pb-32 items-center justify-center min-h-screen bg-gradient-to-b from-[#141e27] to-[#0d1318] overflow-hidden">
      
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_45%)]" />

      
      {/* Heading */}
      <div className={`relative opacity-0 text-center transition-all duration-700 mb-16
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}>
          <span className="section-label text-[#00a4c6] font-semibold text-sm block mb-4">
            Sample Reports
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience Your Insights
          </h2>
          <p className="text-lg text-[#c1cfda] max-w-2xl mx-auto">
            Explore our sample reports to see how your clients will experience the insights and recommendations you provide. Each report is designed to be clear, actionable, and visually appealing, ensuring your clients understand the value of your services.
          </p>
        </div>

      {/* Carousel container */}
      <div className={`relative top-4 py-4 pt-16 transition-all duration-700 w-[90%] max-w-4xl mx-auto
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} `}
      >
        <div className="relative rounded-3xl isolate overflow-visible rounded-[3rem] shadow-xl overflow-hidden">
          
          <div className="pointer-events-none absolute inset-0 rounded-[3rem] border border-white/10 opacity-40" />
          <div className="pointer-events-none absolute border  left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute border  left-1/3 top-16 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="pointer-events-none absolute border  right-12 top-28 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

          
          <div
            className="relative flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reportImages.map((src, idx) => {
            const style = getCardTransform(idx, currentIndex, total)
            const isVisible = idx === currentIndex || idx === prevIndex || idx === nextIndex

            return(
              <div key={idx} className="min-w-full shadow-2xl shadow-cyan-500/10 transition-all duration-700 border border-white/20 bg-white/10 backdrop-blur-md rounded-3xl mx-4 p-4">
                <Image
                  src={src}
                  alt={`Report ${idx + 1}`}
                  width={1200}
                  height={800}
                  className={`rounded-3xl 
                    ${isVisible ? 'opacity-100' : 'opacity-0'} 
                    `}
                //   style={style}  
                />
              </div>
            )}
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        
        {/* <button
              type="button"
              onClick={prevSlide}
              className="absolute left-[-80px] top-1/2 -translate-y-1/2 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              
            </button>
        
        <button
              type="button"
              onClick={nextSlide}
              className="absolute right-[-80px] top-1/2 -translate-y-1/2 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
            >
              <ArrowRight className="h-4 w-4" />
              
            </button> */}

        {/* Dots indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {reportImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-4 space-x-2" >
            <button
                type="button"
                onClick={prevSlide}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                >
                <ArrowLeft className="h-4 w-4" />
                
                </button>
        
                <button
                    type="button"
                    onClick={nextSlide}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-300/30 bg-teal-500/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                    >
                    <ArrowRight className="h-4 w-4" />
                    
                </button>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            Ready to get started? It only takes 5 minutes to set up.
          </p>
          
          <div className="mt-10">
          <Link
            href="/register"
            className="cta-button btn-primary inline-block"
            style={{
              padding: '16px 40px',
            }}
          >
            Start generating reports
          </Link>
        </div>

        </div>

      </div>
    </section>
  );
};

export default ReportCarousel;

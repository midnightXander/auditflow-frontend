import { useEffect, useRef, useState } from 'react';
import { HeroDistortion } from '@/lib/HeroDistortion';
import gsap from 'gsap';
import { ChevronDown, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation'
export default function Hero() {
  const router = useRouter()
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const distortionRef = useRef<HeroDistortion | null>(null);
  const heroRef = useRef<HTMLDivElement>(null)
  const [auditUrl, setAuditUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!auditUrl.trim()) return
    
    setIsLoading(true)
    // Simulate audit processing
    setTimeout(() => {
      // In a real app, redirect to audit results or open in modal
      router.push(`/audit?url=${encodeURIComponent(auditUrl.trim())}`)
      setIsLoading(false)
      setAuditUrl('')
    }, 1500)
  }

  useEffect(() => {
    if (canvasContainerRef.current && !distortionRef.current) {
      distortionRef.current = new HeroDistortion(canvasContainerRef.current, {
        center: { x: 0.5, y: 0.5 },
        scale: 1.0,
        waveSpeed: 0.2,
        waveAmplitude: 0.4,
        colorIntensity: 0.6,
        mixSpeed: 0.1,
      });
    }
    return () => {
      if (distortionRef.current) {
        distortionRef.current.destroy();
        distortionRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        '.hero-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      )
        .fromTo(
          '.hero-headline',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          '.hero-subheadline',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.45'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          '.hero-rating',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{ paddingTop: 160, paddingBottom: 100, background: 'linear-gradient(180deg, #141e27 0%, #0f1a24 100%)' }}
        >
          {/* Subtle radial glow */}
          <div style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: 900, height: 900, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,164,198,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
    {/* <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', minHeight: 600 }}
    >
      {/* WebGL Canvas Container 
      <div
        ref={canvasContainerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Radial gradient overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(20, 30, 39, 0.7) 100%)',
        }}
      /> 

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-[2] flex flex-col items-center justify-center h-full text-center px-4"
      >
        <p className="hero-label section-label mb-5 opacity-0">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full  text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                The Agency-First Audit Tool
              </span>
        </p>

        <h1
          className="hero-headline opacity-0"
          style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            lineHeight: '1.07',
            letterSpacing: '-1.2px',
            maxWidth: 700,
            color: '#ffffff',
          }}
        >
          White-Label SEO Audits That{' '}
          <span style={{ color: '#00a4c6' }}>Win</span> Clients
        </h1>

        <p
          className="hero-subheadline opacity-0"
          style={{
            fontSize: 18,
            lineHeight: '28px',
            color: '#c1cfda',
            maxWidth: 560,
            marginTop: 20,
          }}
        >
          Generate comprehensive, branded SEO reports in 30 seconds. No coding
          required. Impress prospects, retain clients, and scale your agency.
        </p>

        <form
          onSubmit={handleAuditSubmit}
          className="hero-cta mt-10 opacity- w-full max-w-[600px] mx-auto px-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <input
              type="url"
              placeholder="Enter your website URL (e.g., https://example.com)"
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded border border-[#374c63] bg-[#1a2a38] text-white placeholder-[#44576a] focus:outline-none focus:border-[#00a4c6] focus:ring-2 focus:ring-[rgba(0,164,198,0.2)] transition-all duration-200 text-sm sm:text-base"
              style={{
                minHeight: 48,
              }}
              required
            />
            <button
              type="submit"
              disabled={isLoading || !auditUrl.trim()}
              className="btn-primary whitespace-nowrap flex items-center justify-center gap-2 px-6 py-3 rounded"
              style={{
                minHeight: 48,
                opacity: isLoading || !auditUrl.trim() ? 0.6 : 1,
                cursor: isLoading || !auditUrl.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 mx-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Try Free Audit <ArrowRight className="inline-block w-4 h-4 mx-2" /></span>
                  
                  
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-[#44576a] text-center mt-3">
            Takes ~30 seconds • No credit card required
          </p>
        </form>
        

        <div
          className="hero-rating flex items-center gap-2 mt-8 opacity-0"
        >
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="star-icon w-4 h-4 fill-[#ffc107] text-[#ffc107]"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    rotation: 360,
                    duration: 0.6,
                    ease: 'power2.out',
                    delay: i * 0.1,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.set(e.currentTarget, { rotation: 0 });
                }}
              />
            ))}
          </div>
          <span className="text-sm" style={{ color: '#c1cfda' }}>
            4.7/5 from 650+ reviews
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]"
        style={{
          animation: 'bounce 1.5s ease-in-out infinite',
        }}
      >
        <ChevronDown className="w-6 h-6 text-[#c1cfda] opacity-60" />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}

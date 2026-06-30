import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-headline',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.cta-subtext',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.cta-button',
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#141e27', padding: '140px 0' }}
      className="max-md:!py-[60px]"
    >
      <div className="content-container text-center max-w-[700px] mx-auto">
        <h2
          className="cta-headline"
          style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 700,
            lineHeight: '1.1',
            letterSpacing: '-1.1px',
            color: '#ffffff',
            opacity: 0,
          }}
        >
          Ready to Impress Your Clients?
        </h2>
        <p
          className="cta-subtext mt-5"
          style={{
            fontSize: 18,
            lineHeight: '28px',
            color: '#c1cfda',
            opacity: 0,
          }}
        >
          Join 1k+ agencies using OUTAUDITS to deliver premium SEO reports.
          Start your free 14-day trial today.
        </p>
        <div className="mt-10">
          <Link
            href="/register"
            className="cta-button btn-primary inline-block"
            style={{
              padding: '16px 40px',
              animation: 'pulseGlow 2s infinite',
              opacity: 0,
            }}
          >
            Start Your Free Audit
          </Link>
        </div>
        <p
          className="mt-5"
          style={{ fontSize: 14, lineHeight: '22px', color: '#44576a' }}
        >
          No credit card required. 14-day free trial.
        </p>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 164, 198, 0.4);
          }
          50% {
            box-shadow: 0 0 0 12px rgba(0, 164, 198, 0);
          }
        }
      `}</style>
    </section>
  );
}

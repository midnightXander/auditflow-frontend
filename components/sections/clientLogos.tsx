import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const logos = ['Pulse Media', 'Nexus Digital', 'Vantage SEO', 'Elevate Group', 'Sparkline', 'Meridian'];

export default function ClientLogos() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.client-logo',
        { opacity: 0, y: 20 },
        {
          opacity: 0.4,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#141e27',
        padding: '60px 0',
        borderTop: '1px solid #374c63',
      }}
    >
      <div className="content-container">
        <p
          className="text-center section-label"
          style={{ letterSpacing: 1.5, color: '#44576a' }}
        >
          TRUSTED BY 15,000+ AGENCIES WORLDWIDE
        </p>
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4 mt-8 max-w-[1000px] mx-auto">
          {logos.map((name) => (
            <div
              key={name}
              className="client-logo text-white opacity-0 hover:opacity-80 transition-opacity duration-300 cursor-default"
              style={{
                fontSize: 'clamp(14px, 1.5vw, 18px)',
                fontWeight: 600,
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

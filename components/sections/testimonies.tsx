import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "OUTAudits transformed how we onboard clients. Instead of spending 4 hours on manual audits, we generate branded reports in 30 seconds. Our close rate jumped 40%.",
    name: "Sarah Mitchell",
    role: "Founder, Pulse Media",
    avatar: "/images/testimonial-avatar-1.jpg",
  },
  {
    quote:
      "The white-label feature is incredible. Our clients think we built the audit tool ourselves. The API integration let us automate our entire reporting workflow.",
    name: "David Chen",
    role: "Director, Nexus Digital",
    avatar: "/images/testimonial-avatar-2.jpg",
  },
  {
    quote:
      "We switched from SEMrush and never looked back. OUTAudits is built for agencies -- the embeddable widget alone generates 50+ qualified leads per month.",
    name: "Elena Rodriguez",
    role: "CEO, Vantage SEO",
    avatar: "/images/testimonial-avatar-3.jpg",
  },
];

const logos = ['Pulse Media', 'Nexus Digital', 'Vantage SEO', 'Elevate Group', 'Sparkline', 'Meridian'];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonial-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.testimonial-star',
        { scale: 0 },
        {
          scale: 1,
          stagger: 0.05,
          duration: 0.4,
          ease: 'back.out(1.7)',
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
      id="testimonials"
      ref={sectionRef}
      style={{ backgroundColor: '#141e27', padding: '140px 0' }}
      className="max-md:!py-[60px]"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20 max-md:mb-10">
          <p className="section-label mb-4">AGENCY STORIES</p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700,
              lineHeight: '1.1',
              letterSpacing: '-1.1px',
              color: '#ffffff',
            }}
          >
            Trusted by Agencies Like Yours
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card bg-[#263747] border border-[#374c63] rounded p-8 transition-colors duration-300 hover:border-[rgba(0,164,198,0.4)]"
              style={{ opacity: 0 }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    className="testimonial-star w-4 h-4 fill-[#ffc107] text-[#ffc107]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: 16,
                  lineHeight: '26px',
                  color: '#c1cfda',
                  fontStyle: 'italic',
                }}
              >
                "{t.quote}"
              </p>

              {/* Divider */}
              <div
                className="my-6"
                style={{ height: 1, backgroundColor: '#374c63' }}
              />

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      lineHeight: '22px',
                      color: '#ffffff',
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#44576a',
                    }}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logo bar */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mt-16 max-md:mt-10">
          {logos.map((name) => (
            <span
              key={name}
              className="text-white opacity-30 hover:opacity-60 transition-opacity duration-300 cursor-default"
              style={{
                fontSize: 'clamp(12px, 1.2vw, 16px)',
                fontWeight: 600,
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

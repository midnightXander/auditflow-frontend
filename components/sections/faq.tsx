import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: 'Can I really white-label everything?',
    a: 'Yes. Add your logo, custom colors, your own domain, and even customize report messaging. Your clients will never see the OUTAudits brand.',
  },
  {
    q: 'How does the embeddable widget work?',
    a: "You get a simple code snippet to add an audit form to any website. Visitors enter a URL and receive a preview audit. To see the full report, they enter their email -- capturing a lead for you.",
  },
  {
    q: "What's included in the API?",
    a: 'The REST API lets you generate audits, fetch reports, manage projects, and export PDFs programmatically. Perfect for integrating into custom dashboards or client portals.',
  },
  {
    q: 'Can I change plans or cancel anytime?',
    a: 'Absolutely. Upgrade, downgrade, or cancel with no penalties. Your data exports with you.',
  },
  {
    q: 'How accurate are the audits?',
    a: 'Our audits analyze 100+ technical SEO factors using industry-standard metrics. We crawl using the latest Google Lighthouse and PageSpeed Insights data.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Every plan includes a 14-day free trial with full feature access. No credit card required to start.',
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#ffffff', padding: '140px 0' }}
      className="max-md:!py-[60px]"
    >
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-16 max-md:mb-8">
          <p className="section-label mb-4">FAQ</p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700,
              lineHeight: '1.1',
              letterSpacing: '-1.1px',
              color: '#141e27',
            }}
          >
            Questions? Answered.
          </h2>
        </div>

        {/* Accordion */}
        <div className="max-w-[800px] mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-item"
              style={{
                borderBottom: '1px solid #e4e9ed',
                opacity: 0,
              }}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between py-6 text-left bg-transparent border-none cursor-pointer group"
              >
                <span
                  className="transition-colors duration-200 group-hover:text-[#00a4c6]"
                  style={{
                    fontSize: 'clamp(16px, 1.5vw, 20px)',
                    fontWeight: 700,
                    lineHeight: '28px',
                    color: openIndex === i ? '#00a4c6' : '#141e27',
                  }}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  className="w-5 h-5 flex-shrink-0 ml-4 transition-transform duration-300"
                  style={{
                    color: '#44576a',
                    transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-400"
                style={{
                  maxHeight: openIndex === i ? 200 : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
              >
                <p
                  className="pb-6"
                  style={{
                    fontSize: 16,
                    lineHeight: '26px',
                    color: '#44576a',
                    paddingTop: openIndex === i ? 0 : 0,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

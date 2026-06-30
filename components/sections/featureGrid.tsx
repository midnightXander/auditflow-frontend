import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Zap,
  Tag,
  Globe,
  Search,
  Users,
  FileText,
  Code,
  Layers,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Zap,
    title: 'Instant SEO Reports',
    description:
      'Comprehensive audits generated in 30 seconds with actionable recommendations and priority fixes.',
  },
  {
    icon: Tag,
    title: 'White-Label Branding',
    description:
      'Add your logo, colors, and custom domain. Every report looks like it was built by your team.',
  },
  {
    icon: Globe,
    title: 'Deep Site Crawls',
    description:
      'Analyze up to 10,000 pages per project. Uncover technical issues, broken links, and optimization opportunities.',
  },
  {
    icon: Search,
    title: 'Keyword Tracking',
    description:
      "Monitor rankings across 50+ locations. Track your clients' visibility with precision.",
  },
  {
    icon: Users,
    title: 'Competitor Analysis',
    description:
      'Compare side-by-side against competitors. Identify gaps and opportunities in their strategy.',
  },
  {
    icon: FileText,
    title: 'PDF Export',
    description:
      'Download polished PDF reports ready for client presentations. No formatting needed.',
  },
  {
    icon: Code,
    title: 'Embeddable Widget',
    description:
      'Add an audit form to any website. Capture leads with a branded SEO checker.',
  },
  {
    icon: Layers,
    title: 'API Access',
    description:
      'Integrate audits into your workflow. Generate reports programmatically via REST API.',
  },
];

export default function FeatureGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.feature-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
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

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{ backgroundColor: '#ffffff', padding: '140px 0' }}
      className="max-md:!py-[60px]"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-20 max-md:mb-10">
          <p className="section-label mb-4">PLATFORM FEATURES</p>
          <h2
            className="text-[#141e27]"
            style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700,
              lineHeight: '1.1',
              letterSpacing: '-1.1px',
            }}
          >
            Everything You Need to Deliver Premium Audits
          </h2>
          <p
            className="mt-4"
            style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}
          >
            Generate reports, track rankings, analyze competitors, and embed
            audits -- all under your brand.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[30px]">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="feature-card bg-white border border-[#e4e9ed] rounded p-8 card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_19px_38px_rgba(0,0,0,0.12)] hover:border-[rgba(0,164,198,0.3)] group"
                style={{ opacity: 0 }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: '#00a4c6' }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h4
                  className="mt-6 text-[#141e27]"
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    lineHeight: '28px',
                  }}
                >
                  {feature.title}
                </h4>
                <p
                  className="mt-3"
                  style={{
                    fontSize: 16,
                    lineHeight: '26px',
                    color: '#44576a',
                  }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

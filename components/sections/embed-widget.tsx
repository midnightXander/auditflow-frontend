import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import {
  Code, Globe, Search, Users, ArrowRight, CheckCircle,
  Zap, BarChart3, Mail, Shield, Star, ChevronDown,
  Copy, Check, MousePointerClick, Palette, TrendingUp,
  Clock, Target, Settings, Eye,
} from 'lucide-react';
import '@/app/audit-widget/audit-widget.css';


gsap.registerPlugin(ScrollTrigger);

const features = [
  'Custom branding & colors',
  'Works on any CMS or page builder',
  'Auto-delivers full report via email',
  'Captures lead info before showing results',
];

export default function WidgetHighlight() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.widget-left',
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.widget-right',
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
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
      id="api-widget"
      ref={sectionRef}
      style={{ backgroundColor: '#263747', padding: '140px 0' }}
      className="max-md:!py-[60px]"
    >
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-center">
          {/* Left column */}
          <div className="widget-left" style={{ opacity: 0 }}>
            <p className="section-label mb-4">LEAD GENERATION</p>
            <h2
              style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700,
                lineHeight: '1.1',
                letterSpacing: '-1.1px',
                color: '#ffffff',
              }}
            >
              Turn Your Website Into a Lead Magnet
            </h2>
            <p
              className="mt-5"
              style={{ fontSize: 16, lineHeight: '26px', color: '#c1cfda' }}
            >
              Embed a white-label SEO audit form on any website. Visitors enter
              their URL, receive an instant audit preview, and you capture a
              qualified lead. It's the highest-converting tool in our platform.
            </p>
            <ul className="mt-8 space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#34d399] flex-shrink-0" />
                  <span style={{ fontSize: 15, color: '#c1cfda' }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/audit-widget" className="btn-outline inline-block">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right column - Widget mockup */}
          {/* <div
            className="widget-right flex justify-center lg:justify-end"
            style={{ opacity: 0 }}
          >
            <img
              src="/images/widget-mockup.png"
              alt="Embeddable SEO Audit Widget"
              className="max-w-full"
              style={{
                maxWidth: 400,
                transform: 'rotate(5deg)',
                filter: 'drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.3))',
              }}
            />
          </div> */}
          <div className="aw-hero-preview ">
                          <div className="widget-preview-shell" style={{ maxWidth: 480, marginLeft: 'auto' }}>
                            <div className="browser-dots">
                              <span /><span /><span />
                              <div className="flex-1 mx-4 rounded bg-[#0a1017] h-5 flex items-center px-3">
                                <span style={{ fontSize: 10, color: '#44576a' }}>youragency.com/free-audit</span>
                              </div>
                            </div>
                            <div className="p-8">
                              {/* Simulated widget */}
                              <div className="rounded-lg border border-[#374c63] p-6" style={{ background: 'rgba(0,164,198,0.03)' }}>
                                <div className="flex items-center gap-2 mb-4">
                                  <div className="w-8 h-8 rounded-full bg-[#00a4c6] flex items-center justify-center">
                                    <Search className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="font-semibold text-sm" style={{ color: '#ffffff' }}>Free Website SEO Audit</span>
                                </div>
                                <p className="text-xs mb-4" style={{ color: '#44576a' }}>Get a comprehensive SEO analysis in seconds</p>
                                <div className="flex gap-2">
                                  <div
                                    className="flex-1 rounded-md px-3 py-2 text-xs"
                                    style={{ background: '#0a1017', border: '1px solid #374c63', color: '#44576a' }}
                                  >
                                    Enter your website URL...
                                  </div>
                                  <div
                                    className="rounded-md px-4 py-2 text-xs font-semibold"
                                    style={{ background: '#00a4c6', color: '#141e27' }}
                                  >
                                    Analyze
                                  </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: '#44576a' }}>
                                  <Mail className="w-3 h-3" />
                                  <span>Email required before results</span>
                                </div>
                              </div>
          
                              {/* Floating badges */}
                              <div className="relative mt-4 flex gap-3 justify-end">
                                <div
                                  className="float-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                                  style={{ background: 'rgba(0,164,198,0.15)', color: '#00a4c6', border: '1px solid rgba(0,164,198,0.25)' }}
                                >
                                  <Users className="w-3 h-3" /> +3 leads today
                                </div>
                                <div
                                  className="float-badge flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                                  style={{ background: 'rgba(40,200,64,0.12)', color: '#28c840', border: '1px solid rgba(40,200,64,0.25)', animationDelay: '0.5s' }}
                                >
                                  <CheckCircle className="w-3 h-3" /> White-labeled
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
        </div>
      </div>
    </section>
  );
}

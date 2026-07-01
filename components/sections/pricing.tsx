import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import Link from 'next/link';
gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Free',
    description: 'For solo freelancers just getting started.',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
        'Basic website audits',
        '20 audit and crawl credits per month',
        'Custom PDF export',
        'Deep crawl analysis',
        'Competitor comparison',
        'Community support',
        'Limited to 1 user',

      ],
    cta: 'Start Free ',
    featured: false,
    link: '/register',
  },
  {
    name: 'Pro',
    description: 'For growing agencies with multiple clients.',
    monthlyPrice: 19,
    annualPrice: 15,
    features: [
        'Everything in Free',
        'Unlimited Audits',
        'Unlimited Crawls',
        'Full white-label solution',
        'Priority support',
        'Embeddable Widget',
        'Rank tracking',

        // 'Up to 5 team members',
        'Advanced PDF customization',
        'Monthly reports',
      ],
    cta: 'Start Free Trial',
    featured: true,
    link: '/register',
  },
  {
    name: 'Agency',
    description: 'For large agencies needing unlimited scale.',
    monthlyPrice: 99,
    annualPrice: 59,
    features: [
      'Everything in Pro',
      'Backlink analysis',
      'Keyword research',
      'Customer portal',
      'Full white-label & custom domain',
      'All locations & keywords',
      'Full API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    featured: false,
    link: 'mailto:sales@outaudits.com',
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      const cards = gridRef.current?.querySelectorAll('.pricing-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 75%',
            },
          }
        );
      }

      // Hover parallax effect
      if (!gridRef.current) return;
      const allCards = gridRef.current.querySelectorAll('.pricing-card');
      const middleColumnIndex = 1;

      allCards.forEach((card, c) => {
        const columnIndex = c % 3;

        card.addEventListener('mouseenter', () => {
          allCards.forEach((otherCard, oc) => {
            if (otherCard === card) return;
            const otherCol = oc % 3;
            const isLeft = otherCol < columnIndex;
            const yDir =
              otherCol === middleColumnIndex
                ? isLeft
                  ? 1
                  : -1
                : otherCol < middleColumnIndex
                ? -1
                : 1;
            gsap.to(otherCard, {
              y: 10 * yDir,
              duration: 0.3,
              ease: 'power2',
              delay: 0.03 * Math.abs(otherCol - columnIndex),
            });
          });
        });

        card.addEventListener('mouseleave', () => {
          allCards.forEach((otherCard) => {
            if (otherCard === card) return;
            gsap.to(otherCard, {
              y: 0,
              duration: 0.3,
              ease: 'power2',
            });
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      style={{ backgroundColor: '#ffffff', padding: '140px 0' }}
      className="max-md:!py-[60px]"
    >
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-20 max-md:mb-10">
          <p className="section-label mb-4">SIMPLE PRICING</p>
          <h2
            style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              fontWeight: 700,
              lineHeight: '1.1',
              letterSpacing: '-1.1px',
              color: '#141e27',
            }}
          >
            Plans That Scale With Your Agency
          </h2>
          <p
            className="mt-4"
            style={{ fontSize: 16, lineHeight: '26px', color: '#44576a' }}
          >
            No per-audit fees. No hidden costs. Cancel anytime.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span
              className="text-sm"
              style={{
                color: !isAnnual ? '#141e27' : '#44576a',
                fontWeight: !isAnnual ? 600 : 400,
              }}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer border-none"
              style={{ backgroundColor: '#00a4c6' }}
              aria-label="Toggle annual billing"
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                style={{
                  left: 4,
                  transform: isAnnual ? 'translateX(22px)' : 'translateX(0)',
                }}
              />
            </button>
            <span
              className="text-sm"
              style={{
                color: isAnnual ? '#141e27' : '#44576a',
                fontWeight: isAnnual ? 600 : 400,
              }}
            >
              Annual <span style={{ color: '#00a4c6' }}>(save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-[30px] max-w-[1100px] mx-auto"
        >
          {plans.map((plan, i) => (
            <div
              key={i}
              className="pricing-column"
            >
              <div
                className="pricing-card relative bg-white border border-[#e4e9ed] rounded transition-all duration-300 cursor-pointer"
                style={{
                  padding: '40px 32px',
                  willChange: 'transform',
                  opacity: 0,
                  borderTop:
                    plan.featured ? '4px solid #00a4c6' : '1px solid #e4e9ed',
                }}
              >
                {/* Featured badge */}
                {plan.featured && (
                  <span
                    className="absolute -top-0 right-6 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white"
                    style={{
                      backgroundColor: '#00a4c6',
                      borderRadius: '0 0 4px 4px',
                      transform: 'translateY(0)',
                    }}
                  >
                    MOST POPULAR
                  </span>
                )}

                <h3
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    lineHeight: '36px',
                    letterSpacing: '-0.32px',
                    color: '#141e27',
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  className="mt-2"
                  style={{ fontSize: 14, lineHeight: '22px', color: '#44576a' }}
                >
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mt-6">
                  <span
                    style={{
                      fontSize: 18,
                      color: '#44576a',
                    }}
                  >
                    $
                  </span>
                  <span
                    style={{
                      fontSize: 56,
                      fontWeight: 700,
                      lineHeight: '60px',
                      color: '#141e27',
                    }}
                  >
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span
                    style={{
                      fontSize: 18,
                      color: '#44576a',
                    }}
                  >
                    /mo
                  </span>
                </div>

                <div
                  className="my-6"
                  style={{ height: 1, backgroundColor: '#e4e9ed' }}
                />

                <ul className="space-y-1">
                  {plan.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex items-center gap-2"
                      style={{ lineHeight: '36px', fontSize: 14, color: '#44576a' }}
                    >
                      <Check className="w-4 h-4 text-[#34d399] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              
              <Link href={plan.link}>
                <button
                  // href={plan.link}
                  className={`w-full mt-8 py-3.5 rounded text-base font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer border ${
                    plan.featured
                      ? 'bg-[#00a4c6] text-[#141e27] border-[#00a4c6] hover:bg-[#008fad]'
                      : 'bg-transparent text-[#00a4c6] border-[#00a4c6] hover:bg-[#00a4c6] hover:text-[#141e27]'
                  }`}
                >
                  {plan.cta}
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

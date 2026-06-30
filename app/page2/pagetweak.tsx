'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Zap, Globe, Search, Code, Tag, BarChart3, FileText, Star, ChevronDown, Users, Shield, ArrowRight, Menu, X, CheckCircle } from 'lucide-react'
import s from './page2.module.css'

export default function Page2() {
  const { user } = useAuth()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => { if (user) router.push('/dashboard') }, [user, router])
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const faqs = [
    { q: 'Can I really white-label everything?', a: 'Yes — your logo, colors, domain, and messaging throughout. Clients will think it\'s your proprietary tool.' },
    { q: 'How does the embeddable widget work?', a: 'Copy a single script tag into your website. Visitors enter a URL, receive an instant audit preview, and you capture their contact info as a qualified lead.' },
    { q: 'What\'s included in the API?', a: 'Full REST API with endpoints for audits, crawls, keyword tracking, and report generation. Webhooks for real-time notifications.' },
    { q: 'Can I change plans or cancel anytime?', a: 'Absolutely. Upgrade, downgrade, or cancel at any time. No contracts, no cancellation fees.' },
    { q: 'How accurate are the audits?', a: 'Our audits are powered by Google Lighthouse and proprietary crawlers. Results are industry-standard and continuously updated.' },
    { q: 'Is there a free trial?', a: 'Yes! Start with our free tier or try Professional free for 14 days. No credit card required.' },
  ]

  const navLinks = (
    <>
      <Link href="#features" className={s.navLink} onClick={() => setMobileOpen(false)}>Features</Link>
      <Link href="/pricing" className={s.navLink} onClick={() => setMobileOpen(false)}>Pricing</Link>
      <Link href="/platform" className={s.navLink} onClick={() => setMobileOpen(false)}>API Docs</Link>
      <Link href="/blog" className={s.navLink} onClick={() => setMobileOpen(false)}>Blog</Link>
      <Link href="/signin" className={s.navCta} onClick={() => setMobileOpen(false)}>Start Free Audit</Link>
      <Link href="/signin" className={s.navSignin} onClick={() => setMobileOpen(false)}>Sign In</Link>
    </>
  )

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className={`${s.nav} ${scrolled ? s.navScrolled : ''}`}>
        <div className={s.navInner}>
          <Link href="/" className={s.logo}>
            <span className={s.logoText}>OUTAudits</span>
            <span className={s.logoDot}>·</span>
          </Link>
          <div className={s.navLinks}>{navLinks}</div>
          <button className={s.burger} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
          </button>
        </div>
        <div className={`${s.mobileMenu} ${mobileOpen ? s.open : ''}`}>{navLinks}</div>
      </nav>

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroContent}>
          <span className={s.badge}>Agency-Grade SEO Audits</span>
          <h1 className={s.heroTitle}>White-Label SEO Audits That Win Clients</h1>
          <p className={s.heroSub}>Generate comprehensive, branded SEO reports in 30 seconds. No coding required. Impress prospects, retain clients, and scale your agency.</p>
          <Link href="/signin" className={s.btnPrimary}>Start Your Free Audit</Link>
          <div className={s.stars}>
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f5a623" color="#f5a623" />)}
            <span className={s.starsText}>4.9/5 from 2,400+ reviews</span>
          </div>
        </div>
        <div className={s.scrollHint}><ChevronDown size={28} color="#999" /></div>
      </section>

      {/* TRUSTED BY */}
      <section className={s.trusted}>
        <div className={s.trustedLabel}>Trusted by 15,000+ Agencies Worldwide</div>
        <div className={s.trustedLogos}>
          {['Pulse Media','Nexus Digital','Vantage SEO','Elevate Group','Sparkline','Meridian'].map(n => (
            <span key={n} className={s.trustedLogo}>{n}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className={s.features} id="features">
        <div className={s.featuresInner}>
          <span className={s.sectionBadge}>Platform Features</span>
          <h2 className={s.sectionTitle}>Everything You Need to Deliver Premium Audits</h2>
          <p className={s.sectionSub}>Generate reports, track rankings, analyze competitors, and embed audits — all under your brand.</p>
          <div className={s.featuresGrid}>
            {[
              { icon: <Zap size={20} color="#fff" />, title: 'Instant SEO Reports', desc: 'Comprehensive audits generated in 30 seconds with actionable recommendations and priority fixes.' },
              { icon: <Tag size={20} color="#fff" />, title: 'White-Label Branding', desc: 'Add your logo, colors, and custom domain. Every report looks like it was built by your team.' },
              { icon: <Globe size={20} color="#fff" />, title: 'Deep Site Crawls', desc: 'Analyze up to 10,000 pages per project. Uncover technical issues, broken links, and optimization opportunities.' },
              { icon: <Search size={20} color="#fff" />, title: 'Keyword Tracking', desc: 'Monitor rankings across 50+ locations. Track your clients\' visibility with precision.' },
              { icon: <Users size={20} color="#fff" />, title: 'Competitor Analysis', desc: 'Compare side-by-side against competitors. Identify gaps and opportunities in their strategy.' },
              { icon: <FileText size={20} color="#fff" />, title: 'PDF Export', desc: 'Download polished PDF reports ready for client presentations. No formatting needed.' },
              { icon: <Code size={20} color="#fff" />, title: 'Embeddable Widget', desc: 'Add an audit form to any website. Capture leads with a branded SEO checker.' },
              { icon: <Shield size={20} color="#fff" />, title: 'API Access', desc: 'Integrate audits into your workflow. Generate reports programmatically via REST API.' },
            ].map((f, i) => (
              <div key={i} className={s.featureCard}>
                <div className={s.featureIcon}>{f.icon}</div>
                <h3 className={s.featureTitle}>{f.title}</h3>
                <p className={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEE IT IN ACTION */}
      <section className={s.action}>
        <span className={s.sectionBadge}>See It In Action</span>
        <h2 className={s.actionTitle}>Audit Reports That Impress</h2>
        <p className={s.actionSub}>Beautiful, data-rich dashboards your clients will love.</p>
        <div style={{ maxWidth: 900, margin: '0 auto', background: '#1a2940', borderRadius: 16, border: '1px solid #253548', padding: 40, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <BarChart3 size={48} color="#0dd3b6" style={{ marginBottom: 16 }} />
            <p style={{ color: '#556677', fontSize: 14 }}>Interactive report preview</p>
          </div>
        </div>
      </section>

      {/* LEAD GENERATION */}
      <section className={s.leadGen}>
        <div className={s.leadGenInner}>
          <div>
            <span className={s.sectionBadge} style={{ textAlign: 'left' }}>Lead Generation</span>
            <h2 className={s.leadGenTitle}>Turn Your Website Into a Lead Magnet</h2>
            <p className={s.leadGenDesc}>Embed a white-label SEO audit form on any website. Visitors enter their URL, receive an instant audit preview, and you capture a qualified lead. It&apos;s the highest-converting tool in our platform.</p>
            {['Custom branding & colors','Works on any CMS or page builder','Auto-delivers full report via email','Captures lead info before showing results'].map((t, i) => (
              <div key={i} className={s.leadGenCheck}>
                <CheckCircle size={18} color="#0dd3b6" />
                <span>{t}</span>
              </div>
            ))}
            <div style={{ marginTop: 28 }}>
              <Link href="/audit/embed" className={s.btnOutline} style={{ borderColor: '#0dd3b6', color: '#0dd3b6' }}>Learn More</Link>
            </div>
          </div>
          <div className={s.leadGenWidget}>
            <div className={s.widgetCard}>
              <div className={s.widgetTitle}>
                <Search size={18} color="#0dd3b6" />
                SEO Audit
              </div>
              <div className={s.widgetInput}>
                <div className={s.widgetInputField}>Enter your website URL...</div>
                <button className={s.widgetBtn}>Analyze</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={s.testimonials}>
        <span className={s.sectionBadge}>Agency Stories</span>
        <h2 className={s.actionTitle}>Trusted by Agencies Like Yours</h2>
        <div style={{ height: 40 }} />
        <div className={s.testimonialGrid}>
          {[
            { text: '"OUTAudits transformed how we onboard clients. Instead of spending 4 hours on manual audits, we generate branded reports in 30 seconds. Our close rate jumped 40%."', name: 'Sarah Mitchell', role: 'Founder, Pulse Media', initials: 'SM' },
            { text: '"The white-label feature is incredible. Our clients think we built the audit tool ourselves. The API integration let us automate our entire reporting workflow."', name: 'David Chen', role: 'Director, Nexus Digital', initials: 'DC' },
            { text: '"We switched from SEMrush and never looked back. OUTAudits is built for agencies — the embeddable widget alone generates 50+ qualified leads per month."', name: 'Elena Rodriguez', role: 'CMO, Vantage SEO', initials: 'ER' },
          ].map((t, i) => (
            <div key={i} className={s.testimonialCard}>
              <div className={s.testimonialStars}>
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#f5a623" color="#f5a623" />)}
              </div>
              <p className={s.testimonialText}>{t.text}</p>
              <div className={s.testimonialAuthor}>
                <div className={s.testimonialAvatar}>{t.initials}</div>
                <div>
                  <div className={s.testimonialName}>{t.name}</div>
                  <div className={s.testimonialRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 48 }} />
        <div className={s.trustedLogos}>
          {['Pulse Media','Nexus Digital','Vantage SEO','Elevate Group','Sparkline','Meridian'].map(n => (
            <span key={n} className={s.trustedLogo}>{n}</span>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className={s.pricing} id="pricing">
        <span className={s.sectionBadge}>Simple Pricing</span>
        <h2 className={s.sectionTitle}>Plans That Scale With Your Agency</h2>
        <p className={s.sectionSub}>Start free, upgrade when you&apos;re ready. No hidden fees.</p>
        <div className={s.pricingGrid}>
          <div className={s.priceCard}>
            <div className={s.priceName}>Starter</div>
            <div className={s.priceAmount}>$0</div>
            <div className={s.pricePeriod}>Free forever</div>
            <ul className={s.priceFeatures}><li>5 audits per month</li><li>Basic SEO reports</li><li>Single user</li><li>Community support</li></ul>
            <Link href="/register" className={s.btnOutline}>Get Started</Link>
          </div>
          <div className={`${s.priceCard} ${s.popular}`}>
            <div className={s.popularLabel}>Most Popular</div>
            <div className={s.priceName}>Professional</div>
            <div className={s.priceAmount}>$49</div>
            <div className={s.pricePeriod}>per month</div>
            <ul className={s.priceFeatures}><li>Unlimited audits</li><li>White-label reports</li><li>Deep site crawls</li><li>PDF export</li><li>Priority support</li></ul>
            <Link href="/register" className={s.btnPrimary} style={{ justifyContent: 'center', width: '100%' }}>Start Free Trial</Link>
          </div>
          <div className={s.priceCard}>
            <div className={s.priceName}>Agency</div>
            <div className={s.priceAmount}>$149</div>
            <div className={s.pricePeriod}>per month</div>
            <ul className={s.priceFeatures}><li>Everything in Pro</li><li>API access</li><li>Embeddable widget</li><li>Team collaboration</li><li>Custom domain</li></ul>
            <Link href="/register" className={s.btnOutline}>Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={s.faq}>
        <div className={s.faqInner}>
          <span className={s.sectionBadge}>FAQ</span>
          <h2 className={s.sectionTitle}>Questions? Answered.</h2>
          <div style={{ height: 40 }} />
          {faqs.map((faq, i) => (
            <div key={i} className={s.faqItem}>
              <button className={s.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <ChevronDown size={20} className={`${s.faqChevron} ${openFaq === i ? s.faqChevronOpen : ''}`} />
              </button>
              {openFaq === i && <p className={s.faqAnswer}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={s.finalCta}>
        <div className={s.finalCtaCard}>
          <h2 className={s.finalCtaTitle}>Ready to Impress Your Clients?</h2>
          <p className={s.finalCtaSub}>Join 15,000+ agencies using OUTAudits to deliver premium SEO reports. Start your free 14-day trial today.</p>
          <Link href="/register" className={s.btnPrimary}>Start Your Free Audit</Link>
          <p className={s.finalCtaSmall}>No credit card required. 14-day free trial.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div>
            <div className={s.footerBrand}>OUTAudits<span style={{ color: '#0dd3b6' }}>·</span></div>
            <p className={s.footerDesc}>White-label SEO audit platform built for agencies. Generate reports in 30 seconds.</p>
            <div className={s.footerSocials}>
              {['X','in','GH','YT'].map(icon => (
                <span key={icon} className={s.socialIcon}>{icon}</span>
              ))}
            </div>
          </div>
          <div>
            <div className={s.footerHeading}>Product</div>
            <Link href="#features" className={s.footerLink}>Features</Link>
            <Link href="/pricing" className={s.footerLink}>Pricing</Link>
            <Link href="/platform" className={s.footerLink}>API Docs</Link>
            <Link href="/blog" className={s.footerLink}>Changelog</Link>
            <Link href="/audit/embed" className={s.footerLink}>Integrations</Link>
          </div>
          <div>
            <div className={s.footerHeading}>Resources</div>
            <Link href="/blog" className={s.footerLink}>Blog</Link>
            <Link href="mailto:support@outaudits.io" className={s.footerLink}>Help Center</Link>
            <Link href="/use-cases" className={s.footerLink}>Community</Link>
            <Link href="/blog" className={s.footerLink}>Webinars</Link>
            <Link href="/use-cases" className={s.footerLink}>Case Studies</Link>
          </div>
          <div>
            <div className={s.footerHeading}>Company</div>
            <Link href="/blog" className={s.footerLink}>About</Link>
            <Link href="/blog" className={s.footerLink}>Careers</Link>
            <Link href="/terms" className={s.footerLink}>Legal</Link>
            <Link href="mailto:support@outaudits.io" className={s.footerLink}>Contact</Link>
            <Link href="/blog" className={s.footerLink}>Press Kit</Link>
          </div>
          <div>
            <div className={s.footerHeading}>Compare</div>
            <Link href="/blog" className={s.footerLink}>vs SEMrush</Link>
            <Link href="/blog" className={s.footerLink}>vs Moz</Link>
            <Link href="/blog" className={s.footerLink}>vs Ahrefs</Link>
            <Link href="/blog" className={s.footerLink}>vs Screaming Frog</Link>
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>© {new Date().getFullYear()} OUTAudits. All rights reserved.</span>
          <div className={s.footerBottomLinks}>
            <Link href="/privacy" className={s.footerBottomLink}>Privacy Policy</Link>
            <Link href="/terms" className={s.footerBottomLink}>Terms of Service</Link>
            <Link href="/privacy" className={s.footerBottomLink}>Cookie Policy</Link>
          </div>
          <span>Made with ♥ for agencies worldwide</span>
        </div>
      </footer>
    </div>
  )
}

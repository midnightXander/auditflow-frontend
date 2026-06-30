import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Embed', href: '/audit-widget' },
  { label: 'Blog', href: '/blog' },
];

export default function Header() {
  const router = useRouter()
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const links = document.querySelectorAll('.mobile-nav-link');
      gsap.fromTo(
        links,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
        style={{
          height: 80,
          backgroundColor: scrolled ? 'rgba(20, 30, 39, 0.95)' : 'rgba(20, 30, 39, 0.95)',
          backdropFilter: scrolled ? 'blur(8px)' : 'none',
          borderBottom: scrolled ? '1px solid #374c63' : '1px solid transparent',
        }}
      >
        <div className="container flex items-center justify-between mx-auto h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 text-white text-xl">
            <span className="font-bold">OUT</span>
            <span className="font-normal">AUDITS</span>
            <span className="w-3 h-3 rounded-full bg-[#00a4c6] ml-0.5 mt-1"></span>
          </Link>

          {/* Center nav - desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="nav-link-btn text-sm text-[#c1cfda] hover:text-white transition-colors duration-200 relative group cursor-pointer bg-transparent border-none"
              >
                {link.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-[#00a4c6] transition-all duration-200 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right CTAs - desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => router.push('/register')}
              className="text-sm text-[#00a4c6] hover:underline bg-transparent border-none cursor-pointer"
            >
              Start Free Audit
            </button>
            <button
              onClick={() => router.push('/signin')}
              className="text-sm font-semibold text-[#00a4c6] border border-[#00a4c6] px-5 py-2 rounded hover:bg-[#00a4c6] hover:text-[#141e27] transition-all duration-200 cursor-pointer bg-transparent"
            >
              Sign In
            </button>
          </div>

          {/* Hamburger - mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-6 h-0.5 bg-white transition-transform duration-300"
              style={{
                transform: mobileOpen ? 'rotate(45deg) translateY(4px)' : 'none',
              }}
            />
            <span
              className="block w-6 h-0.5 bg-white transition-opacity duration-300"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="block w-6 h-0.5 bg-white transition-transform duration-300"
              style={{
                transform: mobileOpen ? 'rotate(-45deg) translateY(-4px)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8"
          style={{ backgroundColor: 'rgba(20, 30, 39, 0.98)' }}
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="mobile-nav-link text-3xl text-white font-medium bg-transparent border-none cursor-pointer hover:text-[#00a4c6] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => router.push('/register')}
            className="mobile-nav-link btn-primary mt-4"
          >
            Start Free Audit
          </button>
        </div>
      )}
    </>
  );
}

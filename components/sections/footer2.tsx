import Logo from '@/components/logo';
import Link from 'next/link';
const links = [
    {
    name: 'Blog',
    href: '/blog',
  },
  {
    name: 'Signin',
    href: '/signin',
  },
  {
    name: 'Register',
    href: '/register',
  },
  
];


export default function Footer2() {
  return (
    <footer className="border-t px-6 py-8" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0A0E1A' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <Logo />
          <div className="flex items-center gap-6 text-xs text-white/30">
            {links.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </footer>
  );
}

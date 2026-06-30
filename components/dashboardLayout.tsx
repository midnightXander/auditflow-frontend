import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import { useAuth, fetchWithAuth } from '@/lib/auth-context'
import { useProtectedRoute } from '@/lib/protected-route'
import { formatTime } from '@/lib/utils';
import {
  LayoutDashboard,
  FileSearch,
  Globe,
  Search,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  CreditCard,
  ChevronRight,
  Code,
  TrendingUp,
  createLucideIcon,
  LucideCreditCard
} from 'lucide-react';

import { Badge } from './badge';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileSearch, label: 'Audits', path: '/audit' },
  { icon: Globe, label: 'Site Crawls', path: '/crawl' },
  { icon: Users, label: 'Competitors', path: '/compare' },
  { icon: TrendingUp, label: 'Rank Tracking', path: '/rank-tracking', badge: 'New' },
  { icon: Code, label: 'Widget', path: '/audit/embed', badge: 'New' },
  { icon: BarChart3, label: 'Reports', path: '#' },
  { icon: LucideCreditCard, label: 'Billing', path: '/account/billing' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const panelRef = useRef<HTMLDivElement | null>(null)

  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const creditsDisplay = user ? (user.plan === 'pro' || user.plan === 'agency' ? 'Unlimited' : user.credits_remaining) : '-'

  useEffect(() => {
      function onClick(e: MouseEvent) {
        if (!panelRef.current) return
        if (open && !panelRef.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('click', onClick)
      return () => document.removeEventListener('click', onClick)
    }, [open])
  
    useEffect(() => {
      if (!open) return
      let mounted = true;
      (async () => {
        try {
          const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, { method: 'GET' })
          if (!res.ok) return
          const data = await res.json()
          if (mounted) setNotifications(data.items || [])
        } catch (e) {
          console.error('Failed to load notifications', e)
        }
      })()
      return () => { mounted = false }
    }, [open])

    const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#0d1318' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6" style={{ borderBottom: '1px solid #1a2633' }}>
          <Link href="/dashboard" className="flex items-center text-center gap-0 text-white text-lg">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#00a4c6] rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                OUTAUDITS
                </span>
            </div>
          </Link>
          <button
            className="lg:hidden text-[#44576a] hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#44576a' }}>
              Main
            </span>
          </div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path || pathname.startsWith(link.path + '/');
            return (
              <Link
                key={link.label}
                href={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 group ${
                  isActive
                    ? 'text-white'
                    : 'text-[#44576a] hover:text-[#c1cfda] hover:bg-[#141e27]'
                }`}
                style={isActive ? { backgroundColor: '#141e27' } : {}}
              >
                {isActive && (
                  <span className="absolute left-0 w-[3px] h-6 rounded-r bg-[#00a4c6]" />
                )}
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span className="font-medium">{link.label}</span>
                {link.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {link.badge}
                                </Badge>
                              )}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                
              </Link>
            );
          })}
        </nav>

        {/* Bottom: user */}
        <div className="p-3 space-y-3" style={{ borderTop: '1px solid #1a2633' }}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md" style={{ backgroundColor: '#141e27' }}>
            
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-white rounded-full flex items-center justify-center font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
             
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name || user?.email.split('@')[0]}</p>
              <p className="text-xs text-[#44576a] truncate">{user?.plan === 'pro' ? '⭐ Pro Plan' : user?.plan || 'Free Plan'}</p>
            </div>
            
            {/* <button
                className="w-full bg-white rounded text-black text-xs"
                onClick={() => router.push('/pricing')}
                >
                Upgrade plan
            </button> */}
          </div>
          <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-gray-300 bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 font-medium text-sm text-left">Logout</span>
            </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden" style={{ backgroundColor: '#f5f7fa' }}>
        {/* Top header */}
        <header
          className="flex items-center h-16 px-4 lg:px-8 flex-shrink-0"
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e4e9ed',
          }}
        >
          <button
            className="lg:hidden mr-3 p-1.5 rounded-md hover:bg-[#f5f7fa]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-[#44576a]" />
          </button>

          {/* Breadcrumb */}
          {/* <div className="flex items-center gap-2 text-sm">
            <Link href="/dashboard" className="text-[#44576a] hover:text-[#141e27] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#44576a]" />
            <span className="font-medium" style={{ color: '#141e27' }}>Dashboard</span>
          </div> */}

          <div className="flex items-center gap-3 min-w-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src={user?.agency_logo || user?.agency_logo || '/logo.svg'} alt="Agency logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{user?.agency_name || user?.agency_name || 'OUTAUDITS'}</div>
                <div className="text-xs text-gray-500 truncate">{user?.agency_url || 'https://myagency.com'}</div>
              </div>
            </Link>
          </div>
          

          <div className="ml-auto flex items-center gap-3">
            {/* <div className="flex items-center justify-between min-w-0"> */}
              {/* <div className="text-sm font-semibold text-gray-900 truncate">{user?.agency_name || 'OUTAudits'}</div>
              <div className="text-xs text-gray-500 truncate">{user?.agency_url || 'myagency.com'}</div> */}
            {/* </div> */}

            {/* Credits display*/}
            <div className="hidden sm:flex items-center bg-gray-50 border border-gray-100 rounded-full px-3 py-1 gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <div className="text-xs text-gray-700">Credits</div>
              <div className="text-sm font-medium text-gray-900">{creditsDisplay}</div>
            </div>
            
            {/* Search */}
            {/* <div
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded w-64"
              style={{ backgroundColor: '#f5f7fa', border: '1px solid #e4e9ed' }}
            >
              <SearchIcon className="w-4 h-4 text-[#44576a]" />
              <input
                type="text"
                placeholder="Search audits..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder-[#44576a]"
                style={{ color: '#141e27' }}
              />
            </div> */}

            

            {/* Notifications */}
            <div className="relative" ref={panelRef}>
            <button aria-label="Notifications" onClick={() => setOpen(v => !v)} className="relative p-2 rounded-md hover:bg-[#f5f7fa] transition-colors">
              <Bell className="w-5 h-5 text-[#44576a]" />
              
              {notifications.length > 0 ? <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00a4c6]" /> : ""}
            </button>
            {open && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold">Notifications</div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">No notifications</div>
                        ) : (
                          notifications.map((n, i) =>{
                            const href = ['audit','crawl','compare'].includes(n.type) ? `/${n.type}/${n.meta.job_id}`:"#" 
                            console.log(href, n.type)                            
                            return (
                            <Link key={i}  href={href}>
                            <div  className="relative px-4 py-3 hover:bg-gray-50 border-b z-50 last:border-b-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{n.title || n.message}</div>
                              <div className="text-xs text-gray-500 mt-1">{n.message || formatTime(n.created_at)}</div>
                            </div>
                            </Link>
                          )} 
                            )
                        )}
                      </div>
                      <div className="px-3 py-2 border-t border-gray-100 text-center">
                        <Link href="/notifications" className="text-sm text-primary-600">View all</Link>
                      </div>
                    </div>
                  )}
            </div>

            {/* Avatar */}
            
            {user?.agency_logo ?
            <img
              src={user?.agency_logo || '/logo.svg'}
              alt="User"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#e4e9ed] cursor-pointer"
            />
            :
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-accent-500 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
             }
            
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

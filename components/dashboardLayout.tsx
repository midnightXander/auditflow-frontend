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
  Settings2Icon,
  LucideCreditCard,
  Code2
} from 'lucide-react';

import { Badge } from './badge';

const PRIMARY = '#00A4C6'
const ACCENT  = '#0DD3B6'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
  }
}


// ── Checklist progress ring ────────────────────────────────────────────────────
function ChecklistRing({ done, total }: { done: number; total: number }) {
  const r   = 10
  const circ = 2 * Math.PI * r
  const pct  = total > 0 ? done / total : 0
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" className="-rotate-90">
      <circle cx="13" cy="13" r={r} fill="none" stroke="#E5E7EB" strokeWidth="3"/>
      <circle cx="13" cy="13" r={r} fill="none" stroke={ACCENT} strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - pct * circ}
        className="transition-all duration-500"/>
    </svg>
  )
}

// ── Floating checklist widget ──────────────────────────────────────────────────
interface ChecklistState {
  audit_done: boolean; crawl_done: boolean
  compare_done: boolean; tracking_done: boolean,
  settings_done: boolean, apikey_generated: boolean,
  dismissed: boolean; all_done: boolean
}

function cls(...a: (string | false | null | undefined)[]) { return a.filter(Boolean).join(' ') }

function Checklist({ state, onDismiss, onAction }: {
  state: ChecklistState
  onDismiss(): void
  onAction(href: string): void
}) {
  const [open, setOpen] = useState(true)
  const router          = useRouter()

  const steps = [
    {
      key:   'audit_done',
      done:  state.audit_done,
      label: 'Run your first audit',
      sub:   'Get your Lighthouse score & SEO issues',
      icon:  FileSearch,
      href:  '/audit',
    },
    {
      key:   'crawl_done',
      done:  state.crawl_done,
      label: 'Run your first crawl',
      sub:   'Find missing H1s, broken links & more',
      icon:  Globe,
      href:  '/crawl',
    },
    {
      key:   'compare_done',
      done:  state.compare_done,
      label: 'Compare a competitor',
      sub:   'See where you win and where you lag',
      icon:  Users,
      href:  '/compare',
    },
    {
      key:   'tracking_done',
      done:  state.tracking_done,
      label: 'Track your rankings',
      sub:   'Monitor keywords daily on Search Engines',
      icon:  TrendingUp,
      href:  '/rank-tracking',
    },
    {
      key:   'settings_done',
      done:  state.settings_done,
      label: 'Add your agency settings',
      sub:   'White label your reports for clients and team members',
      icon:  Settings2Icon,
      href:  '/settings',
    },
    {
      key:   'apikey_generated',
      done:  state.apikey_generated,
      label: 'Get your Embed Key',
      sub:   'Generate Qualified Leads with our Embedded Widget on your site',
      icon:  Code2,
      href:  '/audit/embed',
    },

  ]

  const doneCount = steps.filter(s => s.done).length
  const allDone   = doneCount === steps.length

  if (state.dismissed || allDone) return null

  return (
    <div className="fixed bottom-5 right-5 z-40 w-80 shadow-2xl">
      {/* Header bar */}
      <div
        className="bg-gray-900 rounded-t flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2.5">
          <ChecklistRing done={doneCount} total={steps.length} />
          <div>
            <p className="text-white text-xs font-bold leading-none">Get started</p>
            <p className="text-gray-400 text-xs mt-0.5">{doneCount}/{steps.length} complete</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={e => { e.stopPropagation(); onDismiss() }}
            className="text-gray-500 hover:text-gray-300 text-xs px-1 transition-colors"
            title="Dismiss checklist"
          >✕</button>
          <span className="text-gray-400 text-xs">{open ? '▼' : '▲'}</span>
        </div>
      </div>

      {/* Steps */}
      {open && (
        <div className="bg-white rounded-b border border-t-0 border-gray-200 divide-y divide-gray-100">
          {steps.map(step => {
          const Icon = step.icon
          return (
            <div
              key={step.key}
              onClick={() => !step.done && onAction(step.href)}
              className={cls(
                'flex items-start gap-3 px-4 py-3 transition-colors',
                step.done ? 'opacity-60' : 'hover:bg-gray-50 cursor-pointer'
              )}
            >
              {/* Checkbox */}
              <div className={cls(
                'mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                step.done
                  ? 'bg-[#0DD3B6] border-[#0DD3B6]'
                  : 'border-gray-300'
              )}>
                {step.done && (
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  <span className={cls(
                    'text-xs font-semibold',
                    step.done ? 'text-gray-400 line-through' : 'text-gray-900'
                  )}>{step.label}</span>
                </div>
                {!step.done && (
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{step.sub}</p>
                )}
              </div>

              {!step.done && (
                <span className="text-[#00A4C6] text-xs font-semibold shrink-0">Go →</span>
              )}
            </div>
          )
        })}
        </div>
      )}
    </div>
  )
}





const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileSearch, label: 'Audits', path: '/audit' },
  { icon: Globe, label: 'Site Crawls', path: '/crawl' },
  { icon: Users, label: 'Competitors', path: '/compare' },
  { icon: TrendingUp, label: 'Rank Tracking', path: '/rank-tracking', badge: 'New' },
  { icon: Code, label: 'Widget', path: '/audit/embed', badge: 'New' },
  // { icon: BarChart3, label: 'Reports', path: '#' },
  { icon: LucideCreditCard, label: 'Billing', path: '/account/billing' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, refreshToken, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [checklist, setChecklist] = useState<ChecklistState | null>(null)

  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const creditsDisplay = user ? (user.plan === 'pro' || user.plan === 'agency' ? 'Unlimited' : user.credits_remaining) : '-'

  // const loadUser = async () => {
  //   const token = localStorage.getItem('access_token')
    
  //   if (!token) {
  //     return
  //   }

  //   try {
  //     const response = await fetch(`${API_URL}/auth/me`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`
  //       }
  //     })

  //     if (response.ok) {
  //       const userData = await response.json()
  //       user = userData
  //       console.log(userData)
  //     } else {
  //       // Token invalid, try to refresh
  //       const refreshed = await refreshToken()
  //       if (!refreshed) {
  //         localStorage.removeItem('access_token')
  //         localStorage.removeItem('refresh_token')
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Failed to load user:', error)
  //   } finally {
      
  //   }
  // }
  
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
          const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/notifications?page_size=15`, { method: 'GET' })
          if (!res.ok) return
          const data = await res.json()
          // await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/notifications/mark-read-all`,
          //   {method: 'POST'})
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

  // Fetch notifications and Load checklist state
    useEffect(() => {

      if (!user) return
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/summary`, { headers: authHeaders() })
        .then(r => r.json())
        .then(d => setChecklist(d.checklist))
        .catch(() => {})

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications?unread=true`, { headers: authHeaders() })
        .then(r => r.json())
        .then(d => setNotifications(d.items || []))
        .catch(() => {})
      
        //loadUser()

    }, [user])

    const gotoFromNotificatiion = async (id: number, href:string) =>{
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/mark-read`, {
        method: 'POST', headers: authHeaders()
      }).catch(() => {})
      if(href) router.push(href)
    }
  
    const dismissChecklist = async () => {
      setChecklist(prev => prev ? { ...prev, dismissed: true } : prev)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/checklist/dismiss`, {
        method: 'POST', headers: authHeaders()
      }).catch(() => {})
    }
  
    const handleChecklistAction = (href: string) => {
      setSidebarOpen(false)
      router.push(href)
    }
  
    if (loading || !user) {
      return (
        <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-[#00A4C6] rounded-full animate-spin" />
        </div>
      )
    }

    const planColors: Record<string, string> = {
    free:   'bg-gray-100 text-gray-600',
    pro:    'bg-[#00A4C6]/10 text-[#00A4C6]',
    agency: 'bg-[#0DD3B6]/10 text-[#0DD3B6]',
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#0d1318' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6" style={{ borderBottom: '1px solid #1a2633' }}>
          <Link href="/dashboard" className="flex items-center text-center gap-0 text-white text-lg">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#00a4c6] rounded-lg flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect width="28" height="28" rx="6" fill="#00A4C6" />
                  <path d="M6 20 L11 12 L16 16 L21 8" stroke="white" strokeWidth="4"
                    strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="21" cy="8" r="3" fill='#0DD3B6' />
                </svg>
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
              {/* <p className="text-xs text-[#44576a] truncate">{user?.plan === 'pro' ? '⭐ Pro Plan' : user?.plan || 'Free Plan'}</p> */}
              <span className={cls(
                'inline-block text-xs px-1.5 py-0.5 rounded font-semibold capitalize',
                planColors[user.plan] ?? planColors.free
              )}>{user.plan}</span>
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
                    <div className="absolute z-40 right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold">Notifications</div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">No notifications</div>
                        ) : (
                          notifications.map((n, i) =>{
                            const href = ['audit','crawl','compare'].includes(n.type) ? `/${n.type}/${n.meta.job_id}`:"" 
                            console.log(href, n.type)                            
                            return (
                            
                            <div key= {i} onClick={() => gotoFromNotificatiion(n.id, href)}  className="relative cursor-pointer px-4 py-3 hover:bg-gray-50 border-b z-50 last:border-b-0"
                             style= {{ backgroundColor: `${n.read ? '': 'rgba(0,164,198,0.1)'}` }}
                            >
                              <div className="text-sm font-medium text-gray-900 truncate">{n.title || n.message}</div>
                              <div className="text-xs text-gray-500 mt-1">{n.message || formatTime(n.created_at)}</div>
                            </div>
                            
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
            
            {user?.avatar?
            <img
              src={user?.avatar}
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

      {/* ── Floating checklist ───────────────────────────────────── */}
      {checklist && 
      !checklist.dismissed &&
       (
        <Checklist
          state={checklist}
          onDismiss={dismissChecklist}
          onAction={handleChecklistAction}
        />
      )}
    </div>
  );
}

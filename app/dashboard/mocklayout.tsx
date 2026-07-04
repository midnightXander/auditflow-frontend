'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const PRIMARY = '#00A4C6'
const ACCENT  = '#0DD3B6'
const API     = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

function cls(...a: (string | false | null | undefined)[]) { return a.filter(Boolean).join(' ') }

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
  }
}

// ── Nav items ──────────────────────────────────────────────────────────────────
const NAV = [
  { href: '/dashboard',          icon: '⬛', label: 'Overview'    },
  { href: '/audit',              icon: '⚡', label: 'Audit'       },
  { href: '/crawl',              icon: '🗺️', label: 'Crawl'       },
  { href: '/compare',            icon: '📊', label: 'Compare'     },
  { href: '/rank-tracking',      icon: '🎯', label: 'Rank tracking'},
  { href: '/keywords',           icon: '🔑', label: 'Keywords'    },
  { href: '/backlinks',          icon: '🔗', label: 'Backlinks'   },
  { href: '/dashboard/embed',    icon: '🔌', label: 'Embed widget' },
]

// ── Logo ───────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill={PRIMARY}/>
        <path d="M6 20 L11 12 L16 16 L21 8" stroke="white" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="21" cy="8" r="2.5" fill={ACCENT}/>
      </svg>
      <span className="text-sm font-black tracking-tight text-gray-900">AuditFlow</span>
    </div>
  )
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
  compare_done: boolean; tracking_done: boolean
  dismissed: boolean; all_done: boolean
}

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
      icon:  '⚡',
      href:  '/audit',
    },
    {
      key:   'crawl_done',
      done:  state.crawl_done,
      label: 'Run your first crawl',
      sub:   'Find missing H1s, broken links & more',
      icon:  '🗺️',
      href:  '/crawl',
    },
    {
      key:   'compare_done',
      done:  state.compare_done,
      label: 'Compare a competitor',
      sub:   'See where you win and where you lag',
      icon:  '📊',
      href:  '/compare',
    },
    {
      key:   'tracking_done',
      done:  state.tracking_done,
      label: 'Track your rankings',
      sub:   'Monitor keywords daily on Google & Bing',
      icon:  '🎯',
      href:  '/rank-tracking',
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
          {steps.map(step => (
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
                  <span className="text-sm">{step.icon}</span>
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
          ))}
        </div>
      )}
    </div>
  )
}

// ── Layout ─────────────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()

  const [checklist, setChecklist] = useState<ChecklistState | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading])

  // Load checklist state
  useEffect(() => {
    if (!user) return
    fetch(`${API}/api/dashboard/summary`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setChecklist(d.checklist))
      .catch(() => {})
  }, [user])

  const dismissChecklist = async () => {
    setChecklist(prev => prev ? { ...prev, dismissed: true } : prev)
    await fetch(`${API}/api/dashboard/checklist/dismiss`, {
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
    <div className="min-h-screen bg-[#F4F6FA] font-sans flex">

      {/* ── Sidebar (desktop) ────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-200 shrink-0 fixed inset-y-0 left-0 z-20">
        <Logo />

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <a key={item.href} href={item.href}
                className={cls(
                  'flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#00A4C6]/10 text-[#00A4C6]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded bg-[#00A4C6] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(user.full_name ?? user.email)[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {user.full_name ?? user.email}
              </p>
              <span className={cls(
                'inline-block text-xs px-1.5 py-0.5 rounded font-semibold capitalize',
                planColors[user.plan] ?? planColors.free
              )}>{user.plan}</span>
            </div>
          </div>
          <div className="space-y-1">
            <a href="/dashboard/settings"
              className="block text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Settings
            </a>
            <button onClick={logout}
              className="block text-xs text-gray-500 hover:text-gray-900 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
        <Logo />
        <button onClick={() => setSidebarOpen(o => !o)}
          className="text-gray-600 hover:text-gray-900 transition-colors text-xl">
          ☰
        </button>
      </div>

      {/* Mobile slide-out */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}/>
          <aside className="relative w-56 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <Logo />
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {NAV.map(item => (
                <a key={item.href} href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cls(
                    'flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition-colors',
                    pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                      ? 'bg-[#00A4C6]/10 text-[#00A4C6]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}>
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-56 pt-14 lg:pt-0 min-w-0">
        {children}
      </main>

      {/* ── Floating checklist ───────────────────────────────────── */}
      {checklist && !checklist.dismissed && (
        <Checklist
          state={checklist}
          onDismiss={dismissChecklist}
          onAction={handleChecklistAction}
        />
      )}
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Badge } from './ui/badge'
import {
  BarChart3,
  Globe,
  Zap,
  Trello,
  TrendingUp,
  Link as LinkIcon,
  KeySquare,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles, Search
} from 'lucide-react'
import { UpdateIcon } from "@radix-ui/react-icons"
import { Button } from '@/components/ui/button'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <BarChart3 className="w-5 h-5" />,  },
  { label: 'Website Audit', href: '/audit', icon: <Zap className="w-5 h-5" /> },
  { label: 'Deep Crawl', href: '/crawl', icon: <Globe className="w-5 h-5" /> },
  { label: 'Competitor Compare', href: '/compare', icon: <Trello className="w-5 h-5" /> },
  { label: 'Rank Tracking', href: '#rt', icon: <TrendingUp className="w-5 h-5" />, badge: 'Soon' },
  { label: 'Backlink Analysis', href: '#ba', icon: <LinkIcon className="w-5 h-5" />, badge: 'Soon' },
  { label: 'Keyword Analysis', href: '#ka', icon: <KeySquare className="w-5 h-5" />, badge: 'Soon' },
  { label: 'Use Cases', href: '/use-cases', icon: <UpdateIcon className="w-5 h-5" /> },
]

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4  z-50 lg:hidden p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed h-screen overflow-y-hidden inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo/Branding */}
        <div className="p-6 border-b border-slate-700">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div> */}
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-600 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold group-hover:text-primary-400 transition">
                OUTAudits
              </h2>
              <p className="text-xs text-gray-400">White labeled SEO tools</p>
            </div>
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="px-4 py-4 border-b border-slate-700">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-accent-500 rounded-full flex items-center justify-center font-bold text-sm">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.email}</p>
                <p className="text-xs text-gray-400">
                  {user?.plan === 'premium' ? '⭐ Premium' : user?.plan || 'Free Plan'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-black text-xs"
              onClick={() => router.push('/pricing')}
            >
              Upgrade plan
            </Button>
            
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  isActive(item.href)
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-slate-800'
                }
              `}
            >
              {item.icon}
              <span className="flex-1 font-medium text-sm">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
          
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-800 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="flex-1 font-medium text-sm">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1 font-medium text-sm text-left">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search, LayoutDashboard } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#141e27]  flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-8">
        
        {/* Animated 404 */}
        <div className="relative">
          <div className="text-9xl font-black bg-clip-text text-transparent bg-[#00a4c6] animate-pulse">
            404
          </div>
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-blue-500/20 -z-10"/>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
          <p className="text-slate-300 text-base">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Search suggestions */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded p-6 space-y-4">
          <p className="text-sm text-slate-300 font-medium">Try visiting:</p>
          <div className="grid gap-2">
            <Link href="/" className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 transition-colors">
              <Home className="w-4 h-4 text-main" />
              <span className="text-sm text-slate-200">Home</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 transition-colors">
              <LayoutDashboard className="w-4 h-4 text-main" />
              <span className="text-sm text-slate-200">Dashboard</span>
            </Link>
            <Link href="/audit" className="flex items-center gap-3 p-3 rounded bg-white/5 hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4 text-main" />
              <span className="text-sm text-slate-200">New Audit</span>
            </Link>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 rounded border border-slate-600 hover:border-slate-400 hover:bg-white/5">
              ← Go Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-[#00a4c6] rounded">
              Dashboard →
            </Button>
          </Link>
        </div>

        {/* Footer text */}
        <p className="text-xs text-slate-500">
          Error Code: 404 | If you believe this is a mistake, <Link href="mailto:support@outaudits.com" className="text-blue-400 hover:underline">contact support</Link>
        </p>

      </div>
    </div>
  )
}

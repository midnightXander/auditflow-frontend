'use client'

import { Search, Zap, Shield, TrendingUp, CheckCircle, Globe, KeySquare, LinkIcon, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { fetchWithAuth, useAuth} from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import Logo from './logo'

export default function BaseHeader({user}:any){
    
    return (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Blog
            </Link>
            <Link href="/use-cases" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Use cases
            </Link>
            {user ? 
            <Link href="/dashboard">
                <Button variant="outline" className='border border-gray-300 text-gray-700 hover:bg-gray-100' size="sm">
              Go to dashboard
            </Button>
            </Link>
            : 
            <Link href="/signin">
            <Button variant="outline" className='border border-gray-300 text-gray-700 hover:bg-gray-100' size="sm">
              Sign In
            </Button>
            </Link>}
            
          </nav>
        </div>
      </header>
    )

}
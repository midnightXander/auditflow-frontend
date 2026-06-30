'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

/**
 * Hook to protect pages that require authentication
 * Automatically redirects to signin if user is not authenticated
 * @param redirectTo - Optional redirect path after signin (defaults to current path)
 */
export function useProtectedRoute(redirectTo?: string) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("checking protected route")
    if (loading) return // Still loading auth state

    if (!user) {
      // Not authenticated, redirect to signin
      const redirect = redirectTo || window.location.pathname
      router.push(`/signin?redirect=${encodeURIComponent(redirect)}`)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading, isProtected: !!user }
}

/**
 * Hook to check if user can access a route
 * Returns true if user is authenticated, false otherwise
 */
export function useCanAccess() {
  const { user, loading } = useAuth()
  return { canAccess: !!user && !loading, loading }
}

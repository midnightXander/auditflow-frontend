'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  email: string
  full_name: string | null
  plan: string
  credits_remaining: number
  credits_reset_date: string 
  agency_name: string
  is_active: boolean
  is_admin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  loginWithGoogle: (token: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])

  // Auto-refresh token every 25 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken()
    }, 25 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const loadUser = async () => {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Token invalid, try to refresh
        const refreshed = await refreshToken()
        if (!refreshed) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      }
    } catch (error) {
      console.error('Failed to load user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }

    const data = await response.json()
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    await loadUser()
    router.push('/dashboard')
  }

  const register = async (email: string, password: string, fullName?: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email, 
        password,
        full_name: fullName 
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Registration failed')
    }

    const data = await response.json()
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    await loadUser()
    router.push('/dashboard')
  }

  const loginWithGoogle = async (token: string) => {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Google login failed')
    }

    const data = await response.json()
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    await loadUser()
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    router.push('/')
  }

  const refreshToken = async (): Promise<boolean> => {
    const refresh = localStorage.getItem('refresh_token')
    
    if (!refresh) {
      return false
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refresh })
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access_token)
      
      return true
    } catch {
      return false
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function for authenticated API calls
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token')
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  }

  const response = await fetch(url, { ...options, headers })

  // If 401, try to refresh token and retry
  if (response.status === 401) {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh })
      })

      if (refreshResponse.ok) {
        const data = await refreshResponse.json()
        localStorage.setItem('access_token', data.access_token)
        
        // Retry original request
        headers['Authorization'] = `Bearer ${data.access_token}`
        return fetch(url, { ...options, headers })
      }
    }
  }

  return response
}
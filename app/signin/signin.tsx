'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Search, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import GoogleSignInButton from '@/components/googleSigninButton'
import Logo from '@/components/logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, loginWithGoogle } = useAuth()
  // const login = async (email: string, password: string) => {
  //   // Mock login function - replace with real API call
  //   return new Promise<void>((resolve, reject) => {
  //     setTimeout(() => {
  //       if (email === 'user@example.com' && password === 'password') {
  //         resolve()
  //       } else {
  //         reject(new Error('Invalid email or password'))
  //       }
  //     }, 1000)
  //   })
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141e27] via-[#0f1a24] to-[#0d1318] flex items-center justify-center p-4">
      {/* Radial glow background */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,164,198,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
            <div className="inline-flex items-center mb-4 gap-2">
              <Logo />
            </div>
          
          <p className="text-[#c1cfda]">Sign in to your account</p>
        </div>

        <Card className="shadow-xl border-[#374c63] bg-[#1a2a38]">
          <CardHeader>
            <CardTitle className="text-white">Welcome back</CardTitle>
            <CardDescription className="text-[#c1cfda]">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-500 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#c1cfda]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-[#44576a]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#141e27] border-[#374c63] text-white placeholder-[#44576a] focus:border-[#00a4c6] focus:ring-[#00a4c6]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#c1cfda]">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-[#00a4c6] hover:text-[#008fad]">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-[#44576a]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[#141e27] border-[#374c63] text-white placeholder-[#44576a] focus:border-[#00a4c6] focus:ring-[#00a4c6]"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#00a4c6] hover:bg-[#008fad] text-white font-semibold" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#374c63]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1a2a38] px-2 text-[#44576a]">Or continue with</span>
                </div>
              </div>

              <GoogleSignInButton className='w-full rounded-2xl mt-4' />
            </div>

            <p className="mt-6 text-center text-sm text-[#c1cfda]">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#00a4c6] hover:text-[#008fad] font-semibold">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-[#44576a]">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-[#c1cfda]">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-[#c1cfda]">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
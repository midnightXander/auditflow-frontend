'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Search, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import GoogleSignInButton from '@/components/googleSigninButton'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await register(email, password, fullName)
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // In production, use Google's official button/SDK
    setError('Google login requires Google OAuth setup')
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
          <Link href="/" className="inline-block mb-6">
            <div className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-[#00a4c6]  rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                OUTAUDITS
              </span>
            </div>
          </Link>
          <p className="text-[#c1cfda]">Create your free account</p>
        </div>

        <Card className="shadow-xl border-[#374c63] bg-[#1a2a38]">
          <CardHeader>
            <CardTitle className="text-white">Get started</CardTitle>
            <CardDescription className="text-[#c1cfda]">20 free audit credits every month for any domain, no credit card required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-500 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#c1cfda]">Full Name (Optional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-[#44576a]" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-[#141e27] border-[#374c63] text-white placeholder-[#44576a] focus:border-[#00a4c6] focus:ring-[#00a4c6]"
                  />
                </div>
              </div>

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
                <Label htmlFor="password" className="text-[#c1cfda]">Password</Label>
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
                <p className="text-xs text-[#44576a]">Minimum 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#c1cfda]">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-[#44576a]" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>

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
            </form>

            <p className="mt-6 text-center text-sm text-[#c1cfda]">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#00a4c6] hover:text-[#008fad] font-semibold">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-[#44576a]">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-[#c1cfda]">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-[#c1cfda]">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
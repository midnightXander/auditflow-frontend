import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - OUTAudits',
  description: 'Sign in to your OUTAudits account to access your audits and tools.',
}

import Login from "./signin"


export default function LoginPage() {
  return <Login />
}
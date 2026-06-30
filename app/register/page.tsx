import type { Metadata } from 'next'
import Register from './register'

export const metadata: Metadata = {
  title: 'Sign Up - OUTAudits',
  description: 'Create a free OUTAudits account. Get 10 free audits per month, no credit card required.',
}

export default function RegisterPage() {
  return <Register />
}
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Plans - OUTAudits',
  description: 'Choose the perfect plan for your SEO auditing needs. Free tier available, Pro and Agency plans for scaling your business.',
}


import Pricing from './pricing'

export default function PricingPage() {
  return <Pricing />
}

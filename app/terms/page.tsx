import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - OUTAudits',
  description: 'Read OUTAudits Terms of Service. Understand our policies, user rights, and service conditions.',
}

import Terms from './terms'

export default function TermsPage() {
  return <Terms />
}

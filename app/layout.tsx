import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { WhiteLabelProvider } from '@/lib/whitelabel'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'AuditFlow — White-Label Website Auditing',
  description: 'Professional website auditing for agencies. Powered by Google Lighthouse.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>
        <WhiteLabelProvider>
          {children}
        </WhiteLabelProvider>
      </body>
    </html>
  )
}
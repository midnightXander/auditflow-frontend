import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Lexend } from 'next/font/google'
import { WhiteLabelProvider } from '@/lib/whitelabel'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

// const montserrat = Montserrat({
//   subsets: ['latin'],
//   variable: '--font-montserrat',
// })

// const roboto = Roboto({
//   subsets: ['latin'],
//   variable: '--font-roboto',
// })

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
})

export const metadata: Metadata = {
  title: 'AuditFlow — White-Label Website Auditing',
  description: 'Professional website auditing for agencies. Powered by Google Lighthouse.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={lexend.className}>
        <AuthProvider>
          <WhiteLabelProvider>
            {children}
          </WhiteLabelProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
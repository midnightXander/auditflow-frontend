import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Lexend } from 'next/font/google'
import Script from 'next/script'
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
  title: 'OUTAudits — White-Label Website Auditing and SEO tools',
  description: 'Professional website auditing and SEO tools for agencies.',
  icons: {
    icon: '/logo.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}> 
      <head>
        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-5VPDD8M1GY`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5VPDD8M1GY');
            `,
          }}
        />
      </head>
      <body className={jetbrainsMono.className}>
        <AuthProvider>
          <WhiteLabelProvider>
            {children}
          </WhiteLabelProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
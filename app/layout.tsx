import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Lexend, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import { WhiteLabelProvider } from '@/lib/whitelabel'
import { AuthProvider } from '@/lib/auth-context'
// @ts-ignore: CSS imports are handled by Next.js
import './globals.css'
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
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
  title: 'OUTAUDITS — White-Label Website Auditing and SEO tools',
  description: 'Professional website auditing and SEO tools for agencies.',
  icons: {
    icon: '/logo2.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable}`}> 
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
      <body className={dmSans.className}>
        <AuthProvider>
          <WhiteLabelProvider>
            {children}
          </WhiteLabelProvider>
        </AuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
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

const siteUrl = 'https://outaudits.com'
const socialLinks = [
  'https://www.linkedin.com/company/outaudits/',
  'https://x.com/outaudits',
  'https://www.facebook.com/outaudits',
  'https://www.youtube.com/@outaudits',
]

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://outaudits.com/#organization',
      name: 'OUTAudits',
      url: siteUrl,
      logo: 'https://outaudits.com/logo2.svg',
      image: 'https://outaudits.com/logo2.svg',
      email: 'support@outaudits.com',
      sameAs: socialLinks,
      foundingDate: '2024',
      description:
        'OUTAudits helps agencies and businesses run branded website audits, technical SEO checks, and lead-generation workflows through white-labeled reporting tools.',
      areaServed: 'Worldwide',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US',
        addressLocality: 'Remote',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@outaudits.com',
          areaServed: 'Worldwide',
          availableLanguage: ['English'],
        },
      ],
      founder: {
        '@type': 'Person',
        '@id': 'https://outaudits.com/#person-alex',
        name: 'Alex',
        jobTitle: 'Founder',
        url: 'https://outaudits.com/about',
        sameAs: ['https://www.linkedin.com/in/ngaikam-alex-29760a387/'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://outaudits.com/#website',
      url: siteUrl,
      name: 'OUTAudits',
      description:
        'White-label website auditing, SEO analysis, and lead-generation tools for agencies and digital teams.',
      inLanguage: 'en-US',
      publisher: { '@id': 'https://outaudits.com/#organization' },
    },
    {
      '@type': 'Person',
      '@id': 'https://outaudits.com/#person-alex',
      name: 'Alex',
      jobTitle: 'Founder',
      worksFor: { '@id': 'https://outaudits.com/#organization' },
      url: 'https://outaudits.com/about',
      knowsAbout: ['SEO', 'website audits', 'technical SEO', 'agency operations'],
      sameAs: ['https://www.linkedin.com/in/ngaikam-alex-29760a387'],
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'OUTAudits',
  title: {
    default: 'OUTAudits — White-Label Website Auditing and SEO tools',
    template: '%s | OUTAudits',
  },
  description: 'Professional website auditing and SEO tools for agencies.',
  keywords: [
    'SEO audit tool',
    'website auditing',
    'white-label SEO reports',
    'technical SEO',
    'agency SEO tools',
    'OUTAudits',
  ],
  creator: 'OUTAudits',
  publisher: 'OUTAudits',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'OUTAudits',
    title: 'OUTAudits — White-Label Website Auditing and SEO tools',
    description: 'Professional website auditing and SEO tools for agencies.',
    images: [
      {
        url: 'https://outaudits.com/logo2.svg',
        width: 512,
        height: 512,
        alt: 'OUTAudits logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@outaudits',
    creator: '@outaudits',
    title: 'OUTAudits — White-Label Website Auditing and SEO tools',
    description: 'Professional website auditing and SEO tools for agencies.',
    images: ['https://outaudits.com/logo2.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  authors: [{ name: 'OUTAudits', url: siteUrl }],
  icons: {
    icon: '/logo2.svg',
    shortcut: '/logo2.svg',
    apple: '/logo2.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable}`}>
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
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
        {/* <Script 
              // src="http://localhost:8000/api/embed/widget.js?api_key=af_embed_adbcba82164245ed879ad52982363119"
              src="https://auditflow-backend-production-461d.up.railway.app/api/embed/widget.js?api_key=af_embed_8ead404d6ac44eebbcdeb8b37fe6740b">
        </Script> */}
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
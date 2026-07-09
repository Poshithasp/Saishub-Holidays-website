import './globals.css'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import ExternalLinkGate from '@/components/ExternalLinkGate'
import MobileSocialDock from '@/components/MobileSocialDock'
import HydrationCleanup from '@/components/HydrationCleanup'
import ForceDesktopViewport from '@/components/ForceDesktopViewport'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-cormorant', display: 'swap' })

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://travel-3d-cinema.preview.emergentagent.com'

export const metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Saishubh Holidays — Explore the World with Confidence',
    template: '%s · Saishubh Holidays',
  },
  description: 'Bengaluru-based luxury travel agency crafting unforgettable domestic, international and pilgrimage journeys. Explore the world with confidence.',
  keywords: ['Saishubh Holidays','luxury travel Bengaluru','pilgrimage tours','domestic tours India','Char Dham','Tirupati','Mysore Ooty package','travel agency Rajajinagar'],
  authors: [{ name: 'Saishubh Holidays' }],
  openGraph: {
    type: 'website',
    url: BASE,
    siteName: 'Saishubh Holidays',
    title: 'Saishubh Holidays — Explore the World with Confidence',
    description: 'Curated luxury journeys from Bengaluru — pilgrimage yatras, domestic escapes and international getaways.',
    images: [{ url: '/saishub-logo.png', width: 1200, height: 630, alt: 'Saishubh Holidays' }],
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saishubh Holidays',
    description: 'Explore the World with Confidence',
    images: ['/saishub-logo.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
}

export const viewport = {
  themeColor: '#1f6a3c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <head>
        <ForceDesktopViewport />
        <HydrationCleanup />
      </head>
      <body suppressHydrationWarning className="bg-[#eaf3ff] text-slate-900 antialiased overflow-x-hidden">
        {children}
        <ExternalLinkGate />
        <MobileSocialDock />
      </body>
    </html>
  )
}

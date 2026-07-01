import './globals.css'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import ExternalLinkGate from '@/components/ExternalLinkGate'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-cormorant', display: 'swap' })

export const metadata = {
  title: 'Saishub Holidays — Explore the World with Confidence',
  description: 'Luxury travel experiences from sacred pilgrimages to stunning international getaways. Journeys that stay forever.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="bg-[#eaf3ff] text-slate-900 antialiased overflow-x-hidden">
        {children}
        <ExternalLinkGate />
      </body>
    </html>
  )
}

'use client'
import { usePathname } from 'next/navigation'
import { Phone, MessageCircle, Mail, Instagram, Facebook } from 'lucide-react'
import { externalLinkProps, SOCIAL } from '@/lib/externalLink'

// Bottom sticky dock shown ONLY on mobile (< md).
// Provides one-tap access to WhatsApp / Call / Email / Instagram / Facebook.
export default function MobileSocialDock() {
  const pathname = usePathname()
  // Hide on admin pages
  if (pathname && pathname.startsWith('/admin')) return null

  const wa = SOCIAL.whatsapp('Hi Saishubh Holidays, I would like to enquire about a tour.')

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="glass rounded-full px-2 py-2 flex items-center justify-around shadow-2xl">
        <a {...externalLinkProps(wa)} className="group flex flex-col items-center gap-0.5 flex-1 py-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-md group-active:scale-95 transition"><MessageCircle className="w-4 h-4"/></div>
          <div className="text-[9px] font-semibold text-emerald-900">WhatsApp</div>
        </a>
        <a href="tel:+919945883774" className="group flex flex-col items-center gap-0.5 flex-1 py-1">
          <div className="w-10 h-10 rounded-full bg-white ring-1 ring-emerald-700/20 text-emerald-800 flex items-center justify-center shadow-md group-active:scale-95 transition"><Phone className="w-4 h-4"/></div>
          <div className="text-[9px] font-semibold text-emerald-900">Call</div>
        </a>
        <a href="mailto:saishubholidays@gmail.com" className="group flex flex-col items-center gap-0.5 flex-1 py-1">
          <div className="w-10 h-10 rounded-full bg-white ring-1 ring-emerald-700/20 text-emerald-800 flex items-center justify-center shadow-md group-active:scale-95 transition"><Mail className="w-4 h-4"/></div>
          <div className="text-[9px] font-semibold text-emerald-900">Email</div>
        </a>
        <a {...externalLinkProps(SOCIAL.instagram)} className="group flex flex-col items-center gap-0.5 flex-1 py-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-amber-500 text-white flex items-center justify-center shadow-md group-active:scale-95 transition"><Instagram className="w-4 h-4"/></div>
          <div className="text-[9px] font-semibold text-emerald-900">Instagram</div>
        </a>
        <a {...externalLinkProps(SOCIAL.facebook)} className="group flex flex-col items-center gap-0.5 flex-1 py-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center shadow-md group-active:scale-95 transition"><Facebook className="w-4 h-4"/></div>
          <div className="text-[9px] font-semibold text-emerald-900">Facebook</div>
        </a>
      </div>
    </div>
  )
}

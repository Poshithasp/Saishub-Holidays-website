'use client'
import Link from 'next/link'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import Logo from './Logo'
import { externalLinkProps, SOCIAL } from '@/lib/externalLink'

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"/>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="inline-block rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
            <Logo/>
          </div>
          <p className="mt-4 text-sm text-emerald-100/80 leading-relaxed">From sacred pilgrimages to stunning international getaways — we craft unforgettable journeys tailored just for you.</p>
          <div className="flex gap-3 mt-5">
            <a {...externalLinkProps(SOCIAL.instagram)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Instagram className="w-4 h-4"/></a>
            <a {...externalLinkProps(SOCIAL.facebook)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Facebook className="w-4 h-4"/></a>
            <a {...externalLinkProps(SOCIAL.whatsapp())} className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center transition" title="WhatsApp"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4h.1c6.6 0 11.9-5.3 11.9-11.9 0-3.2-1.2-6.2-3.5-8.3zM12 21.6a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4A9.7 9.7 0 0 1 2.3 12C2.3 6.6 6.7 2.2 12 2.2S21.7 6.6 21.7 12 17.3 21.6 12 21.6zm5.4-7.3c-.3-.1-1.7-.9-2-1s-.5-.1-.7.2-.7 1-1 1.2-.4.2-.7 0c-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.8-1.6-2.1s0-.5.1-.6l.5-.5.2-.4c.1-.1.1-.3 0-.4l-.9-2.1c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4s-.9.9-.9 2.2.9 2.6 1 2.7c.1.2 1.8 2.7 4.4 3.8l1.5.6c.6.2 1.2.2 1.6.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"/></svg></a>
          </div>
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-amber-300">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            {[['Home','/'],['About','/about'],['Domestic','/domestic'],['International','/international'],['Pilgrimage','/pilgrimage']].map(([l,h]) => (
              <li key={h}><Link href={h} className="text-emerald-100/80 hover:text-amber-300">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-amber-300">Company</div>
          <ul className="mt-4 space-y-2 text-sm">
            {[['Gallery','/gallery'],['Testimonials','/testimonials'],['Contact','/contact']].map(([l,h]) => (
              <li key={h}><Link href={h} className="text-emerald-100/80 hover:text-amber-300">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-display text-lg font-semibold text-amber-300">Reach Us</div>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-amber-300"/><span className="text-emerald-100/80">108/3 Dr Rajkumar Road, Near Navrang Theatre, Rajajinagar, Bengaluru, Karnataka 560010</span></li>
            <li className="flex gap-2 items-center"><Phone className="w-4 h-4 text-amber-300"/><a href="tel:9945883774" className="text-emerald-100/80 hover:text-amber-300">9945883774 / 9342196683</a></li>
            <li className="flex gap-2 items-center"><Mail className="w-4 h-4 text-amber-300"/><a href="mailto:saishubholidays@gmail.com" className="text-emerald-100/80 hover:text-amber-300">saishubholidays@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-emerald-100/60">
          <div suppressHydrationWarning>© {new Date().getFullYear()} Saishub Holidays. All rights reserved.</div>
          <div>Crafted with care · Explore the World with Confidence</div>
        </div>
      </div>
    </footer>
  )
}

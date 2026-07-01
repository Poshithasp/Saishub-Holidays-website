'use client'
import Link from 'next/link'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-emerald-50">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"/>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm text-emerald-100/80 leading-relaxed">From sacred pilgrimages to stunning international getaways — we craft unforgettable journeys tailored just for you.</p>
          <div className="flex gap-3 mt-5">
            <a href="https://www.instagram.com/saishubholidays2026/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Instagram className="w-4 h-4"/></a>
            <a href="https://www.facebook.com/profile.php?id=61590662553881" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><Facebook className="w-4 h-4"/></a>
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
          <div>© {new Date().getFullYear()} Saishub Holidays. All rights reserved.</div>
          <div>Crafted with care · Explore the World with Confidence</div>
        </div>
      </div>
    </footer>
  )
}

'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, MessageCircle, Menu, X, ArrowRight, ChevronDown } from 'lucide-react'
import Logo from './Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { externalLinkProps, SOCIAL } from '@/lib/externalLink'

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Domestic Tours', href: '/domestic', hasCaret: true },
  { label: 'Pilgrimage Tours', href: '/pilgrimage', hasCaret: true },
  { label: 'International Tours', href: '/international', hasCaret: true },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-auto max-w-[1400px] px-4 md:px-8 transition-all duration-500`}>
        <div className={`flex items-center justify-between gap-6 rounded-2xl px-4 md:px-6 py-3 ${scrolled ? 'glass' : 'bg-transparent'}`}>
          <Logo compact={scrolled} />
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className={`relative px-3 py-2 text-sm font-medium transition-colors ${active ? 'text-emerald-800' : 'text-slate-700 hover:text-emerald-800'}`}>
                  <span className="flex items-center gap-1">
                    {item.label}
                    {item.hasCaret && <ChevronDown className="w-3.5 h-3.5 opacity-60"/>}
                  </span>
                  {active && (
                    <motion.span layoutId="nav-underline" className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-emerald-700 rounded-full"/>
                  )}
                </Link>
              )
            })}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <a href="tel:9945883774" className="w-10 h-10 rounded-full bg-white ring-1 ring-emerald-700/20 shadow-sm flex items-center justify-center text-emerald-800 hover:scale-105 transition"><Phone className="w-4 h-4"/></a>
            <a {...externalLinkProps(SOCIAL.whatsapp())} className="w-10 h-10 rounded-full bg-white ring-1 ring-emerald-700/20 shadow-sm flex items-center justify-center text-emerald-800 hover:scale-105 transition"><MessageCircle className="w-4 h-4"/></a>
            <Link href="/contact" className="btn-primary rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2">Book Now <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <button onClick={() => setOpen(v => !v)} className="lg:hidden w-10 h-10 rounded-full glass flex items-center justify-center">
            {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} className="lg:hidden mx-4 mt-2">
            <div className="glass rounded-2xl p-4 flex flex-col gap-1">
              {NAV.map(item => (
                <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className={`px-3 py-3 rounded-xl text-sm font-medium ${pathname===item.href ? 'bg-emerald-700 text-white' : 'text-slate-700 hover:bg-white/60'}`}>{item.label}</Link>
              ))}
              <div className="flex gap-2 pt-2">
                <a href="tel:9945883774" className="flex-1 btn-outline rounded-full px-4 py-2.5 text-sm font-semibold text-center">Call</a>
                <a {...externalLinkProps(SOCIAL.whatsapp())} className="flex-1 btn-primary rounded-full px-4 py-2.5 text-sm font-semibold text-center">WhatsApp</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

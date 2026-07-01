'use client'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import SkyBackdrop from './SkyBackdrop'
import { motion } from 'framer-motion'

export default function PageShell({ children, title, subtitle, eyebrow }) {
  return (
    <div className="relative min-h-screen">
      <Navbar/>
      <FloatingActions/>
      <div className="relative pt-32 md:pt-40 pb-16">
        <SkyBackdrop/>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          {eyebrow && <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="tracking-[0.35em] text-xs md:text-sm text-amber-700 font-semibold uppercase">{eyebrow}</motion.div>}
          {title && (
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="mt-3 font-display text-5xl md:text-7xl font-bold hero-gradient-text leading-[1.05]">
              {title}
            </motion.h1>
          )}
          {subtitle && (
            <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="mt-5 max-w-2xl text-lg text-slate-700">{subtitle}</motion.p>
          )}
        </div>
      </div>
      <main className="relative">{children}</main>
      <Footer/>
    </div>
  )
}

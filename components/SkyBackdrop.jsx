'use client'
import { motion } from 'framer-motion'

function Cloud({ className = '', delay = 0, scale = 1, opacity = 0.9 }) {
  return (
    <div className={`absolute ${className}`} style={{ opacity }}>
      <svg viewBox="0 0 200 80" style={{ width: 240 * scale, height: 96 * scale, filter: 'drop-shadow(0 20px 40px rgba(80,120,180,0.15))' }}>
        <defs>
          <radialGradient id={`cg-${delay}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1"/>
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#dfeaf7" stopOpacity="0.5"/>
          </radialGradient>
        </defs>
        <path fill={`url(#cg-${delay})`} d="M30 55 C 12 55 12 30 30 30 C 34 14 62 14 66 28 C 82 20 106 30 104 44 C 122 40 138 54 128 66 C 146 68 148 80 130 80 L 40 80 C 18 80 14 66 30 55 Z"/>
      </svg>
    </div>
  )
}

export default function SkyBackdrop() {
  return (
    <div className="absolute inset-0 -z-10 sky-bg overflow-hidden">
      {/* Sun / aurora glow */}
      <div className="absolute top-0 right-[-10%] w-[900px] h-[900px] rounded-full bg-gradient-to-br from-amber-100/70 via-amber-200/30 to-transparent blur-3xl"/>
      <div className="absolute bottom-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-emerald-200/40 via-sky-200/20 to-transparent blur-3xl"/>

      {/* Mountain silhouettes */}
      <svg className="absolute bottom-0 inset-x-0 w-full h-[24vh] opacity-70" viewBox="0 0 1440 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="m1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8fb4d6"/><stop offset="100%" stopColor="#c8dcf6"/></linearGradient>
          <linearGradient id="m2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6a8fb8"/><stop offset="100%" stopColor="#a9c4e4"/></linearGradient>
        </defs>
        <path fill="url(#m1)" d="M0 220 L 160 120 L 280 200 L 420 90 L 560 200 L 700 130 L 860 210 L 1000 110 L 1160 200 L 1320 130 L 1440 200 L 1440 300 L 0 300 Z"/>
        <path fill="url(#m2)" opacity="0.85" d="M0 260 L 120 200 L 260 250 L 380 180 L 520 240 L 680 190 L 820 250 L 960 180 L 1100 240 L 1260 200 L 1440 260 L 1440 300 L 0 300 Z"/>
      </svg>

      {/* Drifting clouds */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] w-full animate-cloud"><Cloud delay={1} scale={1.2}/></div>
        <div className="absolute top-[25%] w-full animate-cloud-2"><Cloud delay={2} scale={0.9} opacity={0.75}/></div>
        <div className="absolute top-[50%] w-full animate-cloud" style={{ animationDuration: '90s' }}><Cloud delay={3} scale={1.4} opacity={0.8}/></div>
        <div className="absolute top-[70%] w-full animate-cloud-2" style={{ animationDuration: '110s' }}><Cloud delay={4} scale={1.0} opacity={0.6}/></div>
      </div>

      {/* Birds */}
      <svg className="absolute top-[18%] left-[15%] w-24 opacity-60" viewBox="0 0 100 30">
        <path d="M5 20 Q 15 5 25 20 Q 35 5 45 20" stroke="#345" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M55 22 Q 63 12 71 22" stroke="#345" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>

      {/* Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-white/70" style={{ left: `${(i*37)%100}%`, top: `${(i*23)%80}%` }} animate={{ y: [0, -15, 0], opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 6 + (i%5), repeat: Infinity, delay: i*0.2 }}/>
      ))}
    </div>
  )
}

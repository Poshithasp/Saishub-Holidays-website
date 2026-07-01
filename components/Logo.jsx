'use client'
import Link from 'next/link'

export default function Logo({ compact = false, light = false }) {
  return (
    <Link href="/" className="flex items-center gap-3 group select-none">
      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white ring-2 ring-emerald-700/30 shadow-lg overflow-hidden">
        <svg viewBox="0 0 64 64" className="w-9 h-9 md:w-10 md:h-10">
          <defs>
            <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1f6a3c"/>
              <stop offset="100%" stopColor="#0f3f22"/>
            </linearGradient>
            <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e6c368"/>
              <stop offset="100%" stopColor="#b58a2c"/>
            </linearGradient>
          </defs>
          <path d="M32 4 L36 14 L46 12 L42 22 L52 26 L42 30 L46 40 L36 38 L32 48 L28 38 L18 40 L22 30 L12 26 L22 22 L18 12 L28 14 Z" fill="url(#lg2)" opacity="0.9"/>
          <path d="M40 22 C 34 20, 26 22, 24 28 C 22 34, 28 36, 32 36 C 36 36, 42 38, 40 44 C 38 48, 30 48, 24 44" stroke="url(#lg1)" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="leading-none">
        <div className={`font-display font-extrabold tracking-wide ${light ? 'text-white' : 'text-emerald-900'} text-lg md:text-xl`}>SAISHUB</div>
        <div className={`font-display font-extrabold tracking-[0.2em] ${light ? 'text-white' : 'text-emerald-900'} text-sm md:text-base -mt-0.5`}>HOLIDAYS</div>
        {!compact && (
          <div className={`text-[9px] md:text-[10px] mt-1 tracking-[0.15em] uppercase ${light ? 'text-white/80' : 'text-emerald-800/70'}`}>Explore the World with Confidence</div>
        )}
      </div>
    </Link>
  )
}

'use client'
import Link from 'next/link'

export default function Logo({ compact = false, light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2 group select-none shrink-0">
      <img
        src="/saishub-logo.png"
        alt="Saishub Holidays — Explore the World with Confidence"
        className={`${compact ? 'h-10 md:h-12' : 'h-12 md:h-16'} w-auto object-contain drop-shadow-[0_6px_16px_rgba(15,60,120,0.15)]`}
        draggable={false}
      />
    </Link>
  )
}

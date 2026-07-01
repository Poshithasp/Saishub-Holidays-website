'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, Star, Crown } from 'lucide-react'
import PageShell from '@/components/PageShell'

const INTERNATIONAL = [
  { title: 'Swiss Alps Luxe', region: 'Switzerland', days: '8N / 9D', img: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Bali Bliss', region: 'Indonesia', days: '6N / 7D', img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Dubai Splendor', region: 'UAE', days: '5N / 6D', img: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Paris Romance', region: 'France', days: '6N / 7D', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwxfHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Maldives Overwater', region: 'Maldives', days: '5N / 6D', img: 'https://images.unsplash.com/photo-1523496922380-91d5afba98a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Tokyo Neon Nights', region: 'Japan', days: '7N / 8D', img: 'https://images.unsplash.com/photo-1642341185205-8e538ad2994c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHw0fHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
]

export default function InternationalPage() {
  return (
    <PageShell eyebrow="Beyond Borders" title={<>International <span className="gold-script font-serif-alt italic">Getaways</span></>} subtitle="Handpicked luxury journeys across the world — flights, five-star stays, private transfers and unforgettable experiences.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INTERNATIONAL.map((it, i) => (
          <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*0.08}} className="tilt-card group relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/50 bg-white h-[460px]">
            <img src={it.img} alt={it.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 via-emerald-950/30 to-transparent"/>
            <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-semibold text-emerald-900 flex items-center gap-1"><MapPin className="w-3 h-3"/>{it.region}</div>
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1"><Crown className="w-3 h-3"/> Luxe</div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="flex text-amber-400 mb-2">{Array.from({length:5}).map((_,k)=><Star key={k} className="w-3.5 h-3.5 fill-current"/>)}</div>
              <div className="font-display text-3xl font-semibold">{it.title}</div>
              <div className="mt-1 text-emerald-100/80 text-sm">A curated luxury experience</div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs opacity-90 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{it.days}</div>
                <Link href="/contact" className="btn-primary rounded-full text-xs font-semibold px-4 py-2 flex items-center gap-1">Enquire <ArrowRight className="w-3 h-3"/></Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}

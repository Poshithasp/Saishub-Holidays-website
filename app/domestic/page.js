'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, Star } from 'lucide-react'
import PageShell from '@/components/PageShell'

const DOMESTIC = [
  { title: 'Kashmir Paradise', region: 'North India', days: '6N / 7D', tag: 'Best Seller', img: 'https://images.unsplash.com/photo-1682686581264-c47e25e61d95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHw0fHxkZXN0aW5hdGlvbnxlbnwwfHx8fDE3ODI4OTcxODB8MA&ixlib=rb-4.1.0&q=85' },
  { title: 'Kerala Backwaters', region: 'South India', days: '5N / 6D', tag: 'Honeymoon', img: 'https://images.unsplash.com/photo-1523496922380-91d5afba98a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Rajasthan Royals', region: 'West India', days: '7N / 8D', tag: 'Heritage', img: 'https://images.unsplash.com/photo-1570814671169-ce8f91015ffe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwzfHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Himalayan Escape', region: 'North India', days: '5N / 6D', tag: 'Adventure', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwzfHxkZXN0aW5hdGlvbnxlbnwwfHx8fDE3ODI4OTcxODB8MA&ixlib=rb-4.1.0&q=85' },
  { title: 'Goa Coastal Bliss', region: 'West Coast', days: '4N / 5D', tag: 'Beach', img: 'https://images.pexels.com/photos/32609063/pexels-photo-32609063.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { title: 'North East Wonders', region: 'Assam & Meghalaya', days: '7N / 8D', tag: 'Nature', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwzfHxkZXN0aW5hdGlvbnxlbnwwfHx8fDE3ODI4OTcxODB8MA&ixlib=rb-4.1.0&q=85' },
  { title: 'Andaman Islands', region: 'Bay of Bengal', days: '5N / 6D', tag: 'Islands', img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Ladakh Expedition', region: 'North India', days: '8N / 9D', tag: 'Bucket List', img: 'https://images.pexels.com/photos/7079773/pexels-photo-7079773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
]

function Card({ item, i }) {
  return (
    <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay: (i%4)*0.08}} className="tilt-card group relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/50 bg-white h-[420px]">
      <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"/>
      <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-semibold text-emerald-900 flex items-center gap-1"><MapPin className="w-3 h-3"/>{item.region}</div>
      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">{item.tag}</div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="flex text-amber-400 mb-2">{Array.from({length:5}).map((_,k)=><Star key={k} className="w-3.5 h-3.5 fill-current"/>)}</div>
        <div className="font-display text-2xl font-semibold">{item.title}</div>
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs opacity-90 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{item.days}</div>
          <Link href="/contact" className="rounded-full bg-white text-emerald-900 text-xs font-semibold px-3 py-1.5 flex items-center gap-1">Enquire <ArrowRight className="w-3 h-3"/></Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function DomesticPage() {
  return (
    <PageShell eyebrow="Incredible India" title={<>Domestic <span className="gold-script font-serif-alt italic">Escapes</span></>} subtitle="Discover the diverse beauty of India — from snow-capped peaks to serene backwaters, from royal palaces to pristine islands. Curated with love.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DOMESTIC.map((it, i) => <Card key={i} item={it} i={i}/>)}
      </div>
    </PageShell>
  )
}

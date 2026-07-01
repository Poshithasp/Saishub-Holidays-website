'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, Star } from 'lucide-react'
import PageShell from '@/components/PageShell'
import api from '@/lib/api'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=srgb&fm=jpg&q=85'

function Card({ item, i }) {
  const img = (item.gallery && item.gallery[0]) || FALLBACK_IMG
  return (
    <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay: (i%4)*0.08}} className="tilt-card group relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/50 bg-white h-[420px]">
      <img src={img} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"/>
      <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-semibold text-emerald-900 flex items-center gap-1"><MapPin className="w-3 h-3"/>{item.startingLocation}</div>
      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">{item.category}</div>
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="flex text-amber-400 mb-2">{Array.from({length:5}).map((_,k)=><Star key={k} className="w-3.5 h-3.5 fill-current"/>)}</div>
        <div className="font-display text-2xl font-semibold">{item.name}</div>
        <div className="text-xs opacity-80 mt-1 line-clamp-1">Best time: {item.bestTimeToVisit}</div>
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs opacity-90 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{item.duration}</div>
          <Link href={`/packages/${item.id}`} className="rounded-full bg-white text-emerald-900 text-xs font-semibold px-3 py-1.5 flex items-center gap-1">View <ArrowRight className="w-3 h-3"/></Link>
        </div>
      </div>
    </motion.div>
  )
}

function CardSkeleton() {
  return <div className="h-[420px] rounded-3xl bg-white/60 animate-pulse shadow-xl"/>
}

export default function DomesticPage() {
  const [items, setItems] = useState(null)
  useEffect(() => {
    api.getPackages({ category: 'Domestic' }).then(d => setItems(d.packages || [])).catch(() => setItems([]))
  }, [])

  return (
    <PageShell eyebrow="Incredible India" title={<>Domestic <span className="gold-script font-serif-alt italic">Escapes</span></>} subtitle="Discover the diverse beauty of India — from snow-capped peaks to serene backwaters, from royal palaces to pristine islands. Curated with love.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items === null && Array.from({length:8}).map((_,i)=><CardSkeleton key={i}/>)}
        {items && items.length === 0 && <div className="col-span-full text-center text-slate-500 py-16">No packages available at the moment.</div>}
        {items && items.map((it, i) => <Card key={it.id} item={it} i={i}/>) }
      </div>
    </PageShell>
  )
}

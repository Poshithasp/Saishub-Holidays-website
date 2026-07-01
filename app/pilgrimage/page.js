'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, Flower } from 'lucide-react'
import PageShell from '@/components/PageShell'
import api from '@/lib/api'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?crop=entropy&cs=srgb&fm=jpg&q=85'

function Card({ item, i }) {
  const img = (item.gallery && item.gallery[0]) || FALLBACK_IMG
  return (
    <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*0.08}} className="group relative rounded-3xl overflow-hidden glass ring-1 ring-amber-200/60 shadow-xl">
      <div className="relative h-64">
        <img src={img} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-transparent to-transparent"/>
        <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-semibold text-amber-900 flex items-center gap-1"><MapPin className="w-3 h-3"/>{item.startingLocation}</div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-amber-700"><Flower className="w-4 h-4"/><div className="text-[11px] uppercase tracking-widest font-semibold">Sacred · Guided</div></div>
        <div className="mt-2 font-display text-2xl font-semibold text-emerald-950">{item.name}</div>
        <div className="mt-2 text-xs text-slate-600 line-clamp-2">{Array.isArray(item.highlights) ? item.highlights.slice(0,2).join(' · ') : ''}</div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-600 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{item.duration}</div>
          <Link href={`/packages/${item.id}`} className="btn-primary rounded-full text-xs font-semibold px-4 py-2 flex items-center gap-1">View <ArrowRight className="w-3 h-3"/></Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function PilgrimagePage() {
  const [items, setItems] = useState(null)
  useEffect(() => {
    api.getPackages({ category: 'Pilgrimage' }).then(d => setItems(d.packages || [])).catch(() => setItems([]))
  }, [])

  return (
    <PageShell eyebrow="Sacred Journeys" title={<>Pilgrimage <span className="gold-script font-serif-alt italic">Yatras</span></>} subtitle="A soulful travel experience with comfort and care. Our pilgrimage packages are designed with reverence, tradition and family in mind.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items === null && Array.from({length:6}).map((_,i)=><div key={i} className="h-[380px] rounded-3xl bg-white/60 animate-pulse"/>)}
          {items && items.length === 0 && <div className="col-span-full text-center text-slate-500 py-16">No pilgrimage packages available at the moment.</div>}
          {items && items.map((it, i) => <Card key={it.id} item={it} i={i}/>) }
        </div>
      </div>
    </PageShell>
  )
}

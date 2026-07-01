'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import PageShell from '@/components/PageShell'
import api from '@/lib/api'

export default function TestimonialsPage() {
  const [items, setItems] = useState(null)
  useEffect(() => {
    api.getTestimonials().then(d => setItems(d.testimonials || [])).catch(() => setItems([]))
  }, [])

  return (
    <PageShell eyebrow="Kind Words" title={<>Loved by <span className="gold-script font-serif-alt italic">Travellers</span></>} subtitle="Real stories from real families who trusted us with their most precious journeys.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 columns-1 md:columns-2 lg:columns-3 gap-6">
        {items === null && Array.from({length:6}).map((_,i)=><div key={i} className="mb-6 h-48 rounded-3xl bg-white/60 animate-pulse"/>)}
        {items && items.length === 0 && <div className="text-center text-slate-500 py-16">No testimonials yet.</div>}
        {items && items.map((r,i) => (
          <motion.div key={r.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*0.1}} className="glass rounded-3xl p-6 mb-6 break-inside-avoid relative">
            <Quote className="w-8 h-8 text-amber-500"/>
            <p className="mt-3 text-slate-700 leading-relaxed">“{r.message}”</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 text-white flex items-center justify-center font-semibold">{r.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
              <div>
                <div className="font-semibold text-emerald-900">{r.name}</div>
                <div className="text-xs text-slate-500">{r.location || ''}</div>
              </div>
              <div className="ml-auto flex text-amber-500">{Array.from({length: r.rating || 5}).map((_,k)=><Star key={k} className="w-3.5 h-3.5 fill-current"/>)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}

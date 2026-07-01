'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, Flower } from 'lucide-react'
import PageShell from '@/components/PageShell'

const YATRAS = [
  { title: 'Char Dham Yatra', region: 'Uttarakhand', days: '10N / 11D', img: 'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Tirupati Darshan', region: 'Andhra Pradesh', days: '2N / 3D', img: 'https://images.unsplash.com/photo-1603766806347-54cdf3745953?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Kashi Vishwanath', region: 'Varanasi', days: '3N / 4D', img: 'https://images.unsplash.com/photo-1524443169398-9aa1ceab67d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Vaishno Devi', region: 'Jammu', days: '2N / 3D', img: 'https://images.unsplash.com/photo-1554554497-0095c34db3ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHw0fHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Rameshwaram · Madurai', region: 'Tamil Nadu', days: '4N / 5D', img: 'https://images.pexels.com/photos/37936887/pexels-photo-37936887.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { title: 'Amarnath Yatra', region: 'Kashmir', days: '5N / 6D', img: 'https://images.pexels.com/photos/12752175/pexels-photo-12752175.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
]

export default function PilgrimagePage() {
  return (
    <PageShell eyebrow="Sacred Journeys" title={<>Pilgrimage <span className="gold-script font-serif-alt italic">Yatras</span></>} subtitle="A soulful travel experience with comfort and care. Our pilgrimage packages are designed with reverence, tradition and family in mind.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {YATRAS.map((it, i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*0.08}} className="group relative rounded-3xl overflow-hidden glass ring-1 ring-amber-200/60 shadow-xl">
              <div className="relative h-64">
                <img src={it.img} alt={it.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-transparent to-transparent"/>
                <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-semibold text-amber-900 flex items-center gap-1"><MapPin className="w-3 h-3"/>{it.region}</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-amber-700"><Flower className="w-4 h-4"/><div className="text-[11px] uppercase tracking-widest font-semibold">Sacred · Guided</div></div>
                <div className="mt-2 font-display text-2xl font-semibold text-emerald-950">{it.title}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-slate-600 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{it.days}</div>
                  <Link href="/contact" className="btn-primary rounded-full text-xs font-semibold px-4 py-2 flex items-center gap-1">Enquire <ArrowRight className="w-3 h-3"/></Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}

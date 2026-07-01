'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageShell from '@/components/PageShell'
import api from '@/lib/api'

const SPANS = ['row-span-2','row-span-1','row-span-1','row-span-2','row-span-1','row-span-2','row-span-1','row-span-1','row-span-2','row-span-1','row-span-1','row-span-2']

export default function GalleryPage() {
  const [items, setItems] = useState(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    api.getGallery().then(d => setItems((d.gallery || []).map(g => g.imageUrl))).catch(() => setItems([]))
  }, [])

  const list = items || []
  const next = () => setActive(a => (a+1) % list.length)
  const prev = () => setActive(a => (a-1+list.length) % list.length)

  return (
    <PageShell eyebrow="Moments" title={<>Our <span className="gold-script font-serif-alt italic">Gallery</span></>} subtitle="A visual diary of our travellers — sunlit peaks, sacred temples, ocean sunsets and starlit deserts.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {items === null && (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[180px] gap-4">
            {Array.from({length:12}).map((_,i)=><div key={i} className={`rounded-2xl bg-white/60 animate-pulse ${SPANS[i%SPANS.length]}`}/>)}
          </div>
        )}
        {items && items.length === 0 && <div className="text-center text-slate-500 py-16">Gallery is empty. Please check back soon.</div>}
        {items && items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[180px] gap-4">
            {list.map((src, i) => (
              <motion.button key={i} initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:(i%8)*0.05}} onClick={() => setActive(i)} className={`relative rounded-2xl overflow-hidden group ${SPANS[i%SPANS.length]} shadow-lg ring-1 ring-white/60`}>
                <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"/>
              </motion.button>
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {active !== null && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
            <button onClick={() => setActive(null)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><X/></button>
            <button onClick={prev} className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><ChevronLeft/></button>
            <button onClick={next} className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><ChevronRight/></button>
            <motion.img key={active} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} src={list[active]} className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"/>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}

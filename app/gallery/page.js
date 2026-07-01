'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageShell from '@/components/PageShell'

const IMAGES = [
  'https://images.unsplash.com/photo-1551918120-9739cb430c6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/32609063/pexels-photo-32609063.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1523496922380-91d5afba98a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/7079773/pexels-photo-7079773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1642341185205-8e538ad2994c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHw0fHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwxfHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1576542260349-626bf55262a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1570814671169-ce8f91015ffe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwzfHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1603766806347-54cdf3745953?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1524443169398-9aa1ceab67d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1554554497-0095c34db3ec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHw0fHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/37936887/pexels-photo-37936887.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/12752175/pexels-photo-12752175.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1682686581264-c47e25e61d95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHw0fHxkZXN0aW5hdGlvbnxlbnwwfHx8fDE3ODI4OTcxODB8MA&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwzfHxkZXN0aW5hdGlvbnxlbnwwfHx8fDE3ODI4OTcxODB8MA&ixlib=rb-4.1.0&q=85',
]

const SPANS = ['row-span-2','row-span-1','row-span-1','row-span-2','row-span-1','row-span-2','row-span-1','row-span-1','row-span-2','row-span-1','row-span-1','row-span-2','row-span-1','row-span-2','row-span-1','row-span-1','row-span-2','row-span-1']

export default function GalleryPage() {
  const [active, setActive] = useState(null)
  const next = () => setActive(a => (a+1) % IMAGES.length)
  const prev = () => setActive(a => (a-1+IMAGES.length) % IMAGES.length)
  return (
    <PageShell eyebrow="Moments" title={<>Our <span className="gold-script font-serif-alt italic">Gallery</span></>} subtitle="A visual diary of our travellers — sunlit peaks, sacred temples, ocean sunsets and starlit deserts.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[180px] gap-4">
          {IMAGES.map((src, i) => (
            <motion.button key={i} initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:(i%8)*0.05}} onClick={() => setActive(i)} className={`relative rounded-2xl overflow-hidden group ${SPANS[i%SPANS.length]} shadow-lg ring-1 ring-white/60`}>
              <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"/>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {active !== null && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
            <button onClick={() => setActive(null)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><X/></button>
            <button onClick={prev} className="absolute left-4 md:left-8 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><ChevronLeft/></button>
            <button onClick={next} className="absolute right-4 md:right-8 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"><ChevronRight/></button>
            <motion.img key={active} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} src={IMAGES[active]} className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"/>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}

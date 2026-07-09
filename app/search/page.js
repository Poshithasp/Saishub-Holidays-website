'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Search as SearchIcon, ArrowLeft } from 'lucide-react'
import PageShell from '@/components/PageShell'
import api from '@/lib/api'
import { externalLinkProps, SOCIAL } from '@/lib/externalLink'

const DEST_KEYWORDS = {
  'Mysore': ['mysore'],
  'Ooty': ['ooty','coonoor'],
  'Kerala': ['munnar','alleppey','cochin'],
  'Hyderabad': ['hyderabad','ramoji'],
  'Delhi • Agra • Jaipur': ['delhi','agra','jaipur'],
  'Tirupati': ['tirupati','srikalahasti'],
  'Rameshwaram': ['rameshwaram','madurai'],
  'Kanyakumari': ['kanyakumari'],
  'Shirdi • Nashik': ['shirdi','nashik','shani'],
  'Varanasi • Ayodhya': ['varanasi','gaya','prayagraj','ayodhya'],
}

function SearchResults() {
  const sp = useSearchParams()
  const destination = sp.get('destination') || ''
  const category = sp.get('category') || ''
  const date = sp.get('date') || ''
  const adults = Number(sp.get('adults') || 2)
  const kids = Number(sp.get('children') || 0)

  const [items, setItems] = useState(null)

  useEffect(() => {
    api.getPackages().then(d => {
      let list = d.packages || []
      if (category) list = list.filter(p => p.category === category)
      if (destination) {
        const kws = DEST_KEYWORDS[destination] || [destination.toLowerCase()]
        list = list.filter(p => {
          const hay = (p.name + ' ' + p.startingLocation).toLowerCase()
          return kws.some(k => hay.includes(k))
        })
      }
      setItems(list)
    }).catch(() => setItems([]))
  }, [destination, category, date])

  const buildBookMsg = (p) => `Hi Saishubh Holidays, I would like to book:\n\u2022 Package: ${p.name}\n\u2022 Duration: ${p.duration}${date ? `\n\u2022 Travel Date: ${date}` : ''}\n\u2022 Travellers: ${adults} Adult${adults!==1?'s':''}${kids ? ` + ${kids} Child${kids!==1?'ren':''}` : ''}\n\nPlease share the details and confirm availability.`

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-900"><ArrowLeft className="w-4 h-4"/> Back to home</Link>

      <div className="mt-4 glass rounded-2xl p-4 md:p-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-700"/><div><div className="text-[10px] uppercase tracking-widest text-slate-500">Destination</div><div className="font-semibold">{destination || 'Any'}</div></div></div>
        <div className="flex items-center gap-2"><SearchIcon className="w-4 h-4 text-emerald-700"/><div><div className="text-[10px] uppercase tracking-widest text-slate-500">Category</div><div className="font-semibold">{category || 'All'}</div></div></div>
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-700"/><div><div className="text-[10px] uppercase tracking-widest text-slate-500">Travel Date</div><div className="font-semibold">{date || 'Flexible'}</div></div></div>
        <div className="flex items-center gap-2"><Users className="w-4 h-4 text-emerald-700"/><div><div className="text-[10px] uppercase tracking-widest text-slate-500">Travellers</div><div className="font-semibold">{adults} Adult{adults!==1?'s':''}{kids ? ` · ${kids} Child${kids!==1?'ren':''}` : ''}</div></div></div>
      </div>

      <div className="mt-6">
        {items === null && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=><div key={i} className="h-96 rounded-3xl bg-white/60 animate-pulse"/>)}</div>}
        {items && items.length === 0 && (
          <div className="text-center glass rounded-3xl p-10">
            <div className="font-display text-2xl text-emerald-900 font-bold">No matches found</div>
            <p className="mt-2 text-slate-600">Try a different destination or category, or contact us directly for a custom itinerary.</p>
            <a {...externalLinkProps(SOCIAL.whatsapp('Hi Saishubh Holidays, I would like a custom itinerary.'))} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 mt-6">Chat with us on WhatsApp</a>
          </div>
        )}
        {items && items.length > 0 && (
          <>
            <div className="text-sm text-slate-600 mb-4">{items.length} package{items.length!==1?'s':''} found</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p, i) => {
                const img = (Array.isArray(p.gallery) && p.gallery[0]) || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=srgb&fm=jpg&q=85'
                return (
                  <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:(i%3)*0.06}} className="bg-white rounded-3xl overflow-hidden shadow-xl ring-1 ring-white/60">
                    <div className="relative h-56">
                      <img src={img} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                      <div className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">{p.category}</div>
                      <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 text-[10px] font-semibold text-emerald-900 flex items-center gap-1"><Calendar className="w-3 h-3"/>{p.duration}</div>
                    </div>
                    <div className="p-5">
                      <div className="font-display text-lg md:text-xl font-semibold text-emerald-900">{p.name}</div>
                      <div className="mt-1 text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/>{p.startingLocation}</div>
                      <div className="mt-4 flex items-center gap-2">
                        <Link href={`/packages/${p.id}`} className="flex-1 rounded-full text-center bg-white ring-1 ring-emerald-700/20 text-emerald-800 text-xs font-semibold px-3 py-2">View Details</Link>
                        <a {...externalLinkProps(SOCIAL.whatsapp(buildBookMsg(p)))} className="flex-1 btn-primary rounded-full text-xs font-semibold px-3 py-2 text-center">Book Now</a>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <PageShell eyebrow="Search" title={<>Find Your <span className="gold-script font-serif-alt italic">Perfect Trip</span></>} subtitle="Matching curated packages just for you.">
      <Suspense fallback={<div className="max-w-[1400px] mx-auto px-6 md:px-10 h-40 rounded-3xl bg-white/60 animate-pulse"/>}>
        <SearchResults/>
      </Suspense>
    </PageShell>
  )
}

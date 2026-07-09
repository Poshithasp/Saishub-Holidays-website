'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Calendar, MapPin, Users, ChevronDown, Sparkles, Search, ShieldCheck, HeartHandshake, Headphones, Wallet, Compass, Plane, Star, Quote, Minus, Plus, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingActions from '@/components/FloatingActions'
import AnimatedCounter from '@/components/AnimatedCounter'
import api from '@/lib/api'
import { externalLinkProps, openExternal, SOCIAL } from '@/lib/externalLink'

/* ---------------- Popular Package Card ---------------- */
function PackageCard({ pkg, i }) {
  const img = (Array.isArray(pkg.gallery) && pkg.gallery[0]) || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=srgb&fm=jpg&q=85'
  const highlights = Array.isArray(pkg.highlights) ? pkg.highlights.slice(0, 2) : []
  const bookMsg = `Hi Saishubh Holidays, I would like to book the ${pkg.name} (${pkg.duration}) package. Please share more details.`
  return (
    <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-8% 0px'}} transition={{delay:(i%4)*0.08}} className="tilt-card group relative rounded-3xl overflow-hidden bg-white shadow-xl ring-1 ring-white/60">
      <div className="relative h-56 overflow-hidden">
        <img src={img} alt={pkg.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"/>
        <div className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">{pkg.category}</div>
        <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 text-[10px] font-semibold text-emerald-900 flex items-center gap-1"><Calendar className="w-3 h-3"/>{pkg.duration}</div>
      </div>
      <div className="p-5">
        <div className="font-display text-lg md:text-xl font-semibold text-emerald-900 line-clamp-1">{pkg.name}</div>
        <div className="mt-1 text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3"/>{pkg.startingLocation}</div>
        {highlights.length > 0 && (
          <ul className="mt-3 space-y-1">
            {highlights.map((h, k) => <li key={k} className="text-xs text-slate-600 flex items-start gap-1.5"><span className="w-1 h-1 mt-1.5 rounded-full bg-amber-500 shrink-0"/><span className="line-clamp-1">{h}</span></li>)}
          </ul>
        )}
        <div className="mt-4 flex items-center gap-2">
          <Link href={`/packages/${pkg.id}`} className="flex-1 rounded-full text-center bg-white ring-1 ring-emerald-700/20 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold px-3 py-2">View Details</Link>
          <a {...externalLinkProps(SOCIAL.whatsapp(bookMsg))} className="flex-1 btn-primary rounded-full text-xs font-semibold px-3 py-2 text-center">Book Now</a>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------- Destination chip ---------------- */
function DestinationChip({ name, img, active, onClick }) {
  return (
    <button onClick={onClick} className={`shrink-0 relative w-40 md:w-48 h-56 md:h-64 rounded-3xl overflow-hidden ring-1 transition ${active ? 'ring-emerald-500 scale-[1.03]' : 'ring-white/60 hover:ring-amber-400'}`}>
      <img src={img} alt={name} loading="lazy" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/30 to-transparent"/>
      <div className="absolute bottom-3 inset-x-3 text-white font-display text-lg text-left">{name}</div>
      {active && <div className="absolute top-3 right-3 bg-amber-400 text-emerald-950 rounded-full text-[10px] font-bold px-2 py-0.5">FILTERED</div>}
    </button>
  )
}

const DESTINATIONS = [
  { name: 'Mysore', match: ['mysore'], img: 'https://images.unsplash.com/photo-1570814671169-ce8f91015ffe?crop=entropy&cs=srgb&fm=jpg&q=85' },
  { name: 'Ooty', match: ['ooty','coonoor'], img: 'https://images.pexels.com/photos/7079773/pexels-photo-7079773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { name: 'Kerala', match: ['munnar','alleppey','cochin'], img: 'https://images.unsplash.com/photo-1523496922380-91d5afba98a3?crop=entropy&cs=srgb&fm=jpg&q=85' },
  { name: 'Hyderabad', match: ['hyderabad','ramoji'], img: 'https://images.unsplash.com/photo-1570814671169-ce8f91015ffe?crop=entropy&cs=srgb&fm=jpg&q=85' },
  { name: 'Delhi • Agra • Jaipur', match: ['delhi','agra','jaipur'], img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?crop=entropy&cs=srgb&fm=jpg&q=85' },
  { name: 'Tirupati', match: ['tirupati','srikalahasti'], img: 'https://images.unsplash.com/photo-1603766806347-54cdf3745953?crop=entropy&cs=srgb&fm=jpg&q=85' },
  { name: 'Rameshwaram', match: ['rameshwaram','madurai'], img: 'https://images.pexels.com/photos/37936887/pexels-photo-37936887.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { name: 'Kanyakumari', match: ['kanyakumari'], img: 'https://images.pexels.com/photos/12752175/pexels-photo-12752175.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { name: 'Shirdi • Nashik', match: ['shirdi','nashik','shani'], img: 'https://images.unsplash.com/photo-1524443169398-9aa1ceab67d5?crop=entropy&cs=srgb&fm=jpg&q=85' },
  { name: 'Varanasi • Ayodhya', match: ['varanasi','gaya','prayagraj','ayodhya'], img: 'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?crop=entropy&cs=srgb&fm=jpg&q=85' },
]

/* ---------------- Traveller counter ---------------- */
function Stepper({ label, value, onChange, min = 0 }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="text-sm text-slate-700">{label}</div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={(e) => { e.stopPropagation(); onChange(Math.max(min, value - 1)) }} className="w-9 h-9 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center hover:bg-emerald-50 hover:ring-emerald-500 active:scale-95 transition disabled:opacity-30" disabled={value <= min} aria-label={`Decrease ${label}`}><Minus className="w-4 h-4"/></button>
        <div className="w-8 text-center font-semibold text-emerald-900 text-lg tabular-nums">{value}</div>
        <button type="button" onClick={(e) => { e.stopPropagation(); onChange(value + 1) }} className="w-9 h-9 rounded-full bg-white ring-1 ring-slate-200 flex items-center justify-center hover:bg-emerald-50 hover:ring-emerald-500 active:scale-95 transition" aria-label={`Increase ${label}`}><Plus className="w-4 h-4"/></button>
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDest, setActiveDest] = useState(null)

  const [dest, setDest] = useState('')
  const [cat, setCat] = useState('')
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [showTravellers, setShowTravellers] = useState(false)

  useEffect(() => {
    api.getPackages().then(d => { setPackages(d.packages || []); setLoading(false) }).catch(() => { setPackages([]); setLoading(false) })
  }, [])

  const search = (e) => {
    e && e.preventDefault && e.preventDefault()
    const params = new URLSearchParams()
    if (dest) params.set('destination', dest)
    if (cat) params.set('category', cat)
    if (date) params.set('date', date)
    params.set('adults', adults)
    params.set('children', children)
    router.push(`/search?${params.toString()}`)
  }

  // Unique destinations from packages for the search dropdown
  const allDestOptions = Array.from(new Set(DESTINATIONS.map(d => d.name)))

  // Filter packages by active destination chip
  const filteredPackages = activeDest
    ? packages.filter(p => {
        const dm = DESTINATIONS.find(d => d.name === activeDest)
        if (!dm) return false
        const hay = (p.name + ' ' + p.startingLocation).toLowerCase()
        return dm.match.some(kw => hay.includes(kw))
      })
    : packages

  const showPackages = filteredPackages.slice(0, 12)

  return (
    <div className="relative">
      <Navbar/>
      <FloatingActions/>

      {/* HERO with uploaded MP4 background */}
      {/* Use a viewport-independent height so the hero has the SAME aspect ratio on desktop and
          on mobile (where the forced-desktop viewport would otherwise inflate 100vh, making the
          16:9 video appear extremely zoomed in on the earth). */}
      <section className="relative min-h-[820px] overflow-hidden pt-28 md:pt-32">
        {/* Video background — uploaded MP4, unmodified */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
        />
        {/* Soft gradient so overlay text stays legible without hiding the video */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-black/10 to-black/40 pointer-events-none"/>

        <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-10 pt-6 md:pt-10">
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="max-w-3xl text-white drop-shadow-lg">
            <div className="flex items-center gap-3 text-amber-300 text-xs md:text-sm font-semibold tracking-[0.35em] uppercase">
              <span className="w-6 h-px bg-amber-400"/> Explore · Dream · Discover
            </div>
            <h1 className="mt-6 font-display font-bold leading-[1.02] text-5xl md:text-7xl lg:text-8xl text-white">Journeys That</h1>
            <h1 className="font-serif-alt italic font-semibold text-5xl md:text-7xl lg:text-8xl gold-script leading-[1.02] mt-1">Stay Forever</h1>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-16 bg-amber-400"/>
              <Plane className="w-5 h-5 text-amber-300"/>
              <div className="h-px w-16 bg-amber-400"/>
            </div>
            <p className="mt-6 max-w-lg text-white/95 text-lg leading-relaxed">From sacred pilgrimages to stunning getaways, we create unforgettable experiences crafted just for you.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#packages" className="btn-primary rounded-full px-7 py-4 text-sm font-semibold flex items-center gap-2">Explore Packages <ArrowRight className="w-4 h-4"/></a>
              <a {...externalLinkProps(SOCIAL.whatsapp('Hi Saishubh Holidays, I would like to plan a trip.'))} className="rounded-full px-7 py-4 text-sm font-semibold bg-white/95 text-emerald-900 flex items-center gap-2">WhatsApp Us</a>
            </div>
          </motion.div>

          {/* Functional Search Bar */}
          <motion.form onSubmit={search} initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.3, duration:0.7}} className="relative z-30 mt-8 md:mt-14 glass rounded-2xl p-3 md:p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
            <label className="flex items-center gap-3 px-3 py-2 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-emerald-800"/></div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Where to?</div>
                <select value={dest} onChange={e => setDest(e.target.value)} className="w-full text-sm font-semibold text-slate-800 bg-transparent outline-none cursor-pointer">
                  <option value="">Any Destination</option>
                  {allDestOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </label>
            <label className="flex items-center gap-3 px-3 py-2 md:border-l border-slate-200 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Compass className="w-4 h-4 text-emerald-800"/></div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Tour Type</div>
                <select value={cat} onChange={e => setCat(e.target.value)} className="w-full text-sm font-semibold text-slate-800 bg-transparent outline-none cursor-pointer">
                  <option value="">All Types</option>
                  <option>Domestic</option>
                  <option>International</option>
                  <option>Pilgrimage</option>
                </select>
              </div>
            </label>
            <label className="flex items-center gap-3 px-3 py-2 md:border-l border-slate-200 min-w-0">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Calendar className="w-4 h-4 text-emerald-800"/></div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Travel Date</div>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full text-sm font-semibold text-slate-800 bg-transparent outline-none"/>
              </div>
            </label>
            <div className="relative flex items-center gap-3 px-3 py-2 md:border-l border-slate-200 min-w-0">
              <button type="button" onClick={() => setShowTravellers(v => !v)} className="flex items-center gap-3 w-full hover:opacity-80 transition">
                <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center shrink-0"><Users className="w-4 h-4 text-emerald-800"/></div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">Travellers</div>
                  <div className="text-sm font-semibold text-slate-800 truncate">{adults} Adult{adults!==1?'s':''} · {children} Child{children!==1?'ren':''}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition ${showTravellers ? 'rotate-180' : ''}`}/>
              </button>
              {showTravellers && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowTravellers(false)} aria-hidden="true"/>
                  <div className="absolute z-40 top-full mt-2 left-0 right-0 md:left-auto md:right-0 md:w-[300px] bg-white rounded-2xl shadow-2xl p-5 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Who is travelling?</div>
                    <Stepper label="Adults" value={adults} min={1} onChange={setAdults}/>
                    <div className="border-t border-slate-100 my-1"/>
                    <Stepper label="Children" value={children} min={0} onChange={setChildren}/>
                    <button type="button" onClick={() => setShowTravellers(false)} className="mt-3 w-full btn-primary rounded-full py-2.5 text-xs font-semibold">Done</button>
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="btn-primary rounded-xl md:rounded-full px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2 col-span-2 md:col-span-1">Search Packages <Search className="w-4 h-4"/></button>
          </motion.form>

          {/* Feature strip */}
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="mt-4 glass rounded-2xl px-4 md:px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Wallet, t: 'Best Price Guarantee', s: 'Affordable & Transparent' },
              { icon: Headphones, t: '24/7 Customer Support', s: 'We are always here' },
              { icon: Compass, t: 'Expert Travel Guide', s: 'Professional & Friendly' },
              { icon: ShieldCheck, t: 'Safe & Secure Travel', s: 'Your safety is our priority' },
              { icon: HeartHandshake, t: 'Customized Packages', s: 'Tailor made for you' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white ring-1 ring-emerald-700/15 shadow-sm flex items-center justify-center text-emerald-800"><f.icon className="w-5 h-5"/></div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{f.t}</div>
                  <div className="text-[11px] text-slate-500">{f.s}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Counters */}
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.5}} className="mt-4 mb-16 glass rounded-2xl px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: Users, n: 2500, s: '+', l: 'Happy Customers' },
              { icon: Plane, n: 500, s: '+', l: 'Tours Completed' },
              { icon: MapPin, n: 80, s: '+', l: 'Destinations' },
              { icon: Sparkles, n: 5, s: '+', l: 'Years Experience' },
              { icon: Star, n: 4.9, s: '/5', l: 'Customer Rating' },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800"><c.icon className="w-5 h-5"/></div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold hero-gradient-text"><AnimatedCounter to={c.n} suffix={c.s}/></div>
                  <div className="text-[11px] text-slate-500">{c.l}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="relative py-16 sky-bg">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="tracking-[0.35em] text-xs text-amber-700 font-semibold uppercase">Discover</div>
              <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold hero-gradient-text">Iconic <span className="gold-script font-serif-alt italic">Destinations</span></h2>
              <p className="mt-2 text-slate-600">Tap a destination to see matching packages.</p>
            </div>
            {activeDest && (
              <button onClick={() => setActiveDest(null)} className="btn-outline rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-2"><X className="w-3.5 h-3.5"/> Clear filter</button>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
            {DESTINATIONS.map(d => (
              <DestinationChip key={d.name} name={d.name} img={d.img} active={activeDest === d.name} onClick={() => setActiveDest(activeDest === d.name ? null : d.name)}/>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PACKAGES */}
      <section id="packages" className="relative py-16 sky-bg">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <div className="tracking-[0.35em] text-xs text-amber-700 font-semibold uppercase">Handpicked</div>
              <h2 className="mt-3 font-display text-4xl md:text-6xl font-bold hero-gradient-text">Popular <span className="gold-script font-serif-alt italic">Packages</span></h2>
              {activeDest && <div className="mt-2 text-sm text-emerald-700">Showing packages for <b>{activeDest}</b> · <button onClick={() => setActiveDest(null)} className="underline">show all</button></div>}
            </div>
            <div className="flex gap-2">
              <Link href="/domestic" className="btn-outline rounded-full px-4 py-2 text-xs font-semibold">Domestic</Link>
              <Link href="/pilgrimage" className="btn-outline rounded-full px-4 py-2 text-xs font-semibold">Pilgrimage</Link>
              <Link href="/international" className="btn-outline rounded-full px-4 py-2 text-xs font-semibold">International</Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading && Array.from({length:8}).map((_,i) => <div key={i} className="h-96 rounded-3xl bg-white/60 animate-pulse"/>)}
            {!loading && showPackages.map((p, i) => <PackageCard key={p.id} pkg={p} i={i}/>) }
            {!loading && showPackages.length === 0 && (
              <div className="col-span-full glass rounded-3xl p-8 text-center text-slate-600">
                No packages match this destination. <button onClick={() => setActiveDest(null)} className="text-emerald-700 font-semibold underline">Show all</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative rounded-3xl overflow-hidden ring-1 ring-white/40 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=srgb&fm=jpg&q=85" loading="lazy" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-transparent"/>
            <div className="relative p-10 md:p-16 max-w-2xl text-white">
              <div className="tracking-[0.35em] text-xs text-amber-300 font-semibold uppercase">Your Journey Awaits</div>
              <h3 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-tight">Let’s craft your <span className="gold-script font-serif-alt italic">next story.</span></h3>
              <p className="mt-5 text-emerald-50/90 max-w-lg">Tell us where you dream, and we will design the itinerary, book the stays and be with you every mile of the way.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary rounded-full px-6 py-3.5 text-sm font-semibold flex items-center gap-2">Book Now <ArrowRight className="w-4 h-4"/></Link>
                <a {...externalLinkProps(SOCIAL.whatsapp('Hi Saishubh Holidays, I would like to plan a trip.'))} className="rounded-full px-6 py-3.5 text-sm font-semibold bg-white text-emerald-900 flex items-center gap-2">WhatsApp Us</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

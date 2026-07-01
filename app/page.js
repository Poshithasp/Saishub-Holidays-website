'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, MapPin, Users, ChevronDown, Sparkles, Search, ShieldCheck, HeartHandshake, Headphones, Wallet, Compass, Plane, Star, Quote } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingActions from '@/components/FloatingActions'
import SkyBackdrop from '@/components/SkyBackdrop'
import AnimatedCounter from '@/components/AnimatedCounter'

const EarthScene = dynamic(() => import('@/components/EarthScene'), { ssr: false, loading: () => null })

const DOMESTIC = [
  { title: 'Kashmir Paradise', region: 'North India', days: '6N / 7D', img: 'https://images.unsplash.com/photo-1682686581264-c47e25e61d95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHw0fHxkZXN0aW5hdGlvbnxlbnwwfHx8fDE3ODI4OTcxODB8MA&ixlib=rb-4.1.0&q=85' },
  { title: 'Kerala Backwaters', region: 'South India', days: '5N / 6D', img: 'https://images.unsplash.com/photo-1523496922380-91d5afba98a3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Rajasthan Royals', region: 'West India', days: '7N / 8D', img: 'https://images.unsplash.com/photo-1570814671169-ce8f91015ffe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwzfHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Himalayan Escape', region: 'North India', days: '5N / 6D', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwzfHxkZXN0aW5hdGlvbnxlbnwwfHx8fDE3ODI4OTcxODB8MA&ixlib=rb-4.1.0&q=85' },
]

const INTERNATIONAL = [
  { title: 'Swiss Alps Luxe', region: 'Europe', days: '8N / 9D', img: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Bali Bliss', region: 'Indonesia', days: '6N / 7D', img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Dubai Splendor', region: 'UAE', days: '5N / 6D', img: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Paris Romance', region: 'France', days: '6N / 7D', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwxfHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
]

const PILGRIMAGE = [
  { title: 'Char Dham Yatra', region: 'Uttarakhand', days: '10N / 11D', img: 'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Tirupati Darshan', region: 'Andhra Pradesh', days: '2N / 3D', img: 'https://images.unsplash.com/photo-1603766806347-54cdf3745953?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
  { title: 'Kashi Vishwanath', region: 'Varanasi', days: '3N / 4D', img: 'https://images.unsplash.com/photo-1524443169398-9aa1ceab67d5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHx0ZW1wbGV8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85' },
]

const TESTIMONIALS = [
  { name: 'Anjali & Rohit', trip: 'Swiss Alps Honeymoon', text: 'Absolutely magical. Every detail was handled beautifully — the best decision we made was choosing Saishub Holidays for our honeymoon.' },
  { name: 'Mr. & Mrs. Rao', trip: 'Char Dham Yatra', text: 'A once-in-a-lifetime spiritual journey. The team took care of us like family every step of the way.' },
  { name: 'The Menon Family', trip: 'Bali Family Escape', text: 'From kids to grandparents, everyone had a story to tell. Truly seamless, luxurious and heart-touching.' },
]

function TiltCard({ children, className='' }) {
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-y*8}deg) rotateY(${x*10}deg) translateY(-4px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = '' }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`transition-transform duration-300 will-change-transform ${className}`}>
      {children}
    </div>
  )
}

function DestinationCard({ item, gold=false }) {
  return (
    <TiltCard>
      <div className="relative rounded-3xl overflow-hidden group h-[380px] shadow-xl ring-1 ring-white/50 bg-white">
        <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"/>
        <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-[11px] font-semibold text-emerald-900 flex items-center gap-1"><MapPin className="w-3 h-3"/>{item.region}</div>
        {gold && <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">Premium</div>}
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="font-display text-2xl font-semibold">{item.title}</div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs opacity-80 flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/>{item.days}</div>
            <button className="rounded-full bg-white/90 text-emerald-900 text-xs font-semibold px-3 py-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition">Enquire <ArrowRight className="w-3 h-3"/></button>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

export default function Home() {
  const mouseRef = useRef({ x: 0, y: 0 })
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.35])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="relative">
      <Navbar/>
      <FloatingActions/>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100vh] overflow-hidden pt-28 md:pt-32">
        <SkyBackdrop/>

        {/* 3D Earth centerpiece */}
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[95vw] md:w-[70vw] lg:w-[55vw] h-[60vh] md:h-[85vh] translate-x-0 md:translate-x-[10%] translate-y-4">
              <EarthScene mouseRef={mouseRef}/>
            </div>
          </div>
        </motion.div>

        {/* Hero copy overlay */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-10 pt-6 md:pt-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
            <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
              <div className="flex items-center gap-3 text-amber-700 text-xs md:text-sm font-semibold tracking-[0.35em] uppercase">
                <span className="w-6 h-px bg-amber-500"/> Explore · Dream · Discover
              </div>
              <h1 className="mt-6 font-display font-bold leading-[1.02] text-5xl md:text-7xl lg:text-8xl hero-gradient-text">
                Journeys That
              </h1>
              <h1 className="font-serif-alt italic font-semibold text-5xl md:text-7xl lg:text-8xl gold-script leading-[1.02] mt-1">
                Stay Forever
              </h1>
              <div className="mt-6 flex items-center gap-3 text-emerald-900">
                <div className="h-px w-16 bg-amber-500"/>
                <Plane className="w-5 h-5 text-amber-600"/>
                <div className="h-px w-16 bg-amber-500"/>
              </div>
              <p className="mt-6 max-w-lg text-slate-700 text-lg leading-relaxed">
                From sacred pilgrimages to stunning getaways, we create unforgettable experiences crafted just for you.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/domestic" className="btn-primary rounded-full px-7 py-4 text-sm font-semibold flex items-center gap-2">Explore Packages <ArrowRight className="w-4 h-4"/></Link>
                <Link href="/contact" className="btn-outline rounded-full px-7 py-4 text-sm font-semibold flex items-center gap-2">Plan Your Trip <Calendar className="w-4 h-4"/></Link>
              </div>
            </motion.div>
            <div className="hidden lg:block"/>
          </div>

          {/* Search bar */}
          <motion.div initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.3, duration:0.7}} className="relative mt-8 md:mt-14 glass rounded-2xl p-3 md:p-4 grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center"><MapPin className="w-4 h-4 text-emerald-800"/></div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Where to?</div>
                <div className="text-sm font-semibold text-slate-800">Any Destination</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 md:border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center"><Compass className="w-4 h-4 text-emerald-800"/></div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Tour Type</div>
                <div className="text-sm font-semibold text-slate-800">All Types <ChevronDown className="inline w-3.5 h-3.5"/></div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 md:border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center"><Calendar className="w-4 h-4 text-emerald-800"/></div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Travel Date</div>
                <div className="text-sm font-semibold text-slate-800">Select Date</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 md:border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center"><Users className="w-4 h-4 text-emerald-800"/></div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-widest text-slate-500">Travellers</div>
                <div className="text-sm font-semibold text-slate-800">2 Adults · 0 Children</div>
              </div>
            </div>
            <Link href="/contact" className="btn-primary rounded-xl md:rounded-full px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2 col-span-2 md:col-span-1">Search Packages <Search className="w-4 h-4"/></Link>
          </motion.div>

          {/* Features strip */}
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
          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{ once: true }} transition={{delay:0.1}} className="mt-4 mb-16 glass rounded-2xl px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-5 gap-4">
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

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-emerald-900/70 flex flex-col items-center animate-bounce">
          <div className="text-[10px] tracking-widest uppercase">Scroll</div>
          <ChevronDown className="w-5 h-5"/>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="relative py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-center">
          <motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div className="tracking-[0.35em] text-xs text-amber-700 font-semibold uppercase">Why Saishub</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl font-bold hero-gradient-text">Luxury woven <br/><span className="gold-script font-serif-alt italic">into every detail.</span></h2>
            <p className="mt-5 text-slate-700 text-lg max-w-xl">We design cinematic journeys — sacred yatras, family holidays and international escapes — all with the same obsession for detail, care and comfort. From your first call to your last sunset, we are with you.</p>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                {t:'Handpicked stays', s:'Only the finest hotels and resorts'},
                {t:'Personal concierge', s:'A dedicated planner for your trip'},
                {t:'Seamless travel', s:'End-to-end logistics handled'},
                {t:'Local experts', s:'Insider access & cultural depth'},
              ].map((x,i)=>(
                <div key={i} className="glass rounded-2xl p-4">
                  <div className="font-semibold text-emerald-900">{x.t}</div>
                  <div className="text-sm text-slate-600 mt-1">{x.s}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,x:30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1642341185205-8e538ad2994c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHw0fHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85" className="h-56 md:h-72 w-full object-cover rounded-3xl shadow-xl"/>
              <img src="https://images.unsplash.com/photo-1576542260349-626bf55262a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxsYW5kbWFya3N8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85" className="h-56 md:h-72 w-full object-cover rounded-3xl shadow-xl mt-10"/>
              <img src="https://images.pexels.com/photos/7079773/pexels-photo-7079773.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" className="h-56 md:h-72 w-full object-cover rounded-3xl shadow-xl"/>
              <img src="https://images.pexels.com/photos/37936887/pexels-photo-37936887.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" className="h-56 md:h-72 w-full object-cover rounded-3xl shadow-xl mt-10"/>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DOMESTIC */}
      <SectionGrid eyebrow="Incredible India" title={<>Domestic <span className="gold-script font-serif-alt italic">Escapes</span></>} items={DOMESTIC} link="/domestic"/>

      {/* INTERNATIONAL */}
      <SectionGrid eyebrow="Beyond Borders" title={<>International <span className="gold-script font-serif-alt italic">Getaways</span></>} items={INTERNATIONAL} gold link="/international"/>

      {/* PILGRIMAGE */}
      <SectionGrid eyebrow="Sacred Journeys" title={<>Pilgrimage <span className="gold-script font-serif-alt italic">Yatras</span></>} items={PILGRIMAGE} link="/pilgrimage"/>

      {/* TESTIMONIALS */}
      <section className="relative py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="tracking-[0.35em] text-xs text-amber-700 font-semibold uppercase">Kind Words</div>
              <h2 className="mt-3 font-display text-4xl md:text-6xl font-bold hero-gradient-text">Loved by <span className="gold-script font-serif-alt italic">travelers</span></h2>
            </div>
            <Link href="/testimonials" className="btn-outline rounded-full px-5 py-3 text-sm font-semibold flex items-center gap-2">Read all <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i)=>(
              <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="glass rounded-3xl p-6 relative">
                <Quote className="w-8 h-8 text-amber-500"/>
                <p className="mt-3 text-slate-700 leading-relaxed">“{t.text}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 text-white flex items-center justify-center font-semibold">{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                  <div>
                    <div className="font-semibold text-emerald-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.trip}</div>
                  </div>
                  <div className="ml-auto flex text-amber-500">{Array.from({length:5}).map((_,k)=><Star key={k} className="w-3.5 h-3.5 fill-current"/>)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative rounded-3xl overflow-hidden ring-1 ring-white/40 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB0cmF2ZWx8ZW58MHx8fHwxNzgyODk3MTcxfDA&ixlib=rb-4.1.0&q=85" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-transparent"/>
            <div className="relative p-10 md:p-16 max-w-2xl text-white">
              <div className="tracking-[0.35em] text-xs text-amber-300 font-semibold uppercase">Your Journey Awaits</div>
              <h3 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-tight">Let’s craft your <span className="gold-script font-serif-alt italic">next story.</span></h3>
              <p className="mt-5 text-emerald-50/90 max-w-lg">Tell us where you dream, and we will design the itinerary, book the stays, arrange the flights and be with you every mile of the way.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary rounded-full px-6 py-3.5 text-sm font-semibold flex items-center gap-2">Book Now <ArrowRight className="w-4 h-4"/></Link>
                <a href="https://wa.me/919945883774" target="_blank" rel="noreferrer" className="rounded-full px-6 py-3.5 text-sm font-semibold bg-white text-emerald-900 flex items-center gap-2">WhatsApp Us</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer/>
    </div>
  )
}

function SectionGrid({ eyebrow, title, items, gold=false, link }) {
  return (
    <section className="relative py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="tracking-[0.35em] text-xs text-amber-700 font-semibold uppercase">{eyebrow}</div>
            <h2 className="mt-3 font-display text-4xl md:text-6xl font-bold hero-gradient-text">{title}</h2>
          </div>
          <Link href={link} className="btn-outline rounded-full px-5 py-3 text-sm font-semibold flex items-center gap-2">View all <ArrowRight className="w-4 h-4"/></Link>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <motion.div key={i} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true, margin:'-10% 0px'}} transition={{delay:i*0.08}}>
              <DestinationCard item={it} gold={gold}/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

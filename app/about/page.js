'use client'
import { motion } from 'framer-motion'
import { Plane, Sparkles, HeartHandshake, Compass, ShieldCheck, Award } from 'lucide-react'
import PageShell from '@/components/PageShell'

const MILESTONES = [
  { year: '2016', title: 'The Dream Begins', desc: 'Founded in Bengaluru with a mission to make travel personal and effortless for every family.' },
  { year: '2018', title: 'First 100 Journeys', desc: 'Curated over 100 memorable trips across India, from Himalayan escapes to coastal getaways.' },
  { year: '2020', title: 'Global Wings', desc: 'Launched international departures to Europe, Southeast Asia and the Middle East.' },
  { year: '2023', title: 'Sacred Yatras', desc: 'Dedicated pilgrimage division — Char Dham, Kashi, Tirupati, and more, with spiritual care.' },
  { year: '2026', title: '2500+ Happy Travellers', desc: 'A growing family of travellers who trust Saishub Holidays to craft their most beautiful memories.' },
]

export default function AboutPage() {
  return (
    <PageShell eyebrow="About Saishub Holidays" title={<>Crafting <span className="gold-script font-serif-alt italic">Journeys</span> Since 2016</>} subtitle="We are a Bengaluru-based luxury travel house on a simple mission — to design journeys that stay with you forever. Every itinerary is hand-woven with care.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-2 gap-14 items-center pt-6">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="glass rounded-3xl p-8">
          <div className="font-display text-3xl md:text-4xl text-emerald-900 font-bold">Our Story</div>
          <p className="mt-4 text-slate-700 leading-relaxed">Saishub Holidays was born out of a love for travel and a belief that every journey should feel like a story. From a small office in Rajajinagar, we set out to build a travel experience that combined trust, transparency and the warmth of family.</p>
          <p className="mt-4 text-slate-700 leading-relaxed">Today, we curate journeys across India and around the world — from sacred pilgrimages to luxury getaways — with a small, passionate team obsessed with the smallest details.</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              {icon: HeartHandshake, t: '2500+ Families', s: 'Have travelled with us'},
              {icon: ShieldCheck, t: 'Safe & Insured', s: 'Peace of mind travel'},
            ].map((v,i)=>(
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800"><v.icon className="w-5 h-5"/></div>
                <div>
                  <div className="font-semibold text-emerald-900 text-sm">{v.t}</div>
                  <div className="text-xs text-slate-500">{v.s}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/50">
          <img src="https://images.unsplash.com/photo-1682686581264-c47e25e61d95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHw0fHxkZXN0aW5hdGlvbnxlbnwwfHx8fDE3ODI4OTcxODB8MA&ixlib=rb-4.1.0&q=85" className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent"/>
          <div className="absolute bottom-6 left-6 text-white">
            <div className="font-display text-2xl">“We don’t sell trips — we design memories.”</div>
            <div className="text-sm opacity-80 mt-2">— The Saishub Team</div>
          </div>
        </motion.div>
      </div>

      {/* TIMELINE */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20">
        <div className="text-center">
          <div className="tracking-[0.35em] text-xs text-amber-700 font-semibold uppercase">Our Journey</div>
          <h2 className="mt-3 font-display text-4xl md:text-6xl font-bold hero-gradient-text">The <span className="gold-script font-serif-alt italic">Saishub</span> Timeline</h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-700/40 to-transparent"/>
          <div className="space-y-14">
            {MILESTONES.map((m, i) => (
              <motion.div key={i} initial={{opacity:0, x: i%2? 40:-40}} whileInView={{opacity:1, x:0}} viewport={{once:true, margin:'-20% 0px'}} className={`grid md:grid-cols-2 gap-8 items-center ${i%2 ? 'md:[direction:rtl]' : ''}`}>
                <div className="[direction:ltr] glass rounded-3xl p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg"><Sparkles className="w-5 h-5"/></div>
                    <div className="font-display text-3xl font-bold text-emerald-900">{m.year}</div>
                  </div>
                  <div className="mt-4 font-semibold text-xl text-emerald-900">{m.title}</div>
                  <div className="mt-2 text-slate-700">{m.desc}</div>
                </div>
                <div className="hidden md:flex justify-center [direction:ltr]">
                  <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-emerald-800"><Plane className="w-6 h-6"/></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

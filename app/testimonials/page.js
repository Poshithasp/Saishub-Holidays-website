'use client'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import PageShell from '@/components/PageShell'

const REVIEWS = [
  { name: 'Anjali & Rohit', trip: 'Swiss Alps Honeymoon', text: 'Absolutely magical. Every detail was handled beautifully — the best decision we made was choosing Saishub Holidays for our honeymoon.' },
  { name: 'Mr. & Mrs. Rao', trip: 'Char Dham Yatra', text: 'A once-in-a-lifetime spiritual journey. The team took care of us like family every step of the way.' },
  { name: 'The Menon Family', trip: 'Bali Family Escape', text: 'From kids to grandparents, everyone had a story to tell. Truly seamless, luxurious and heart-touching.' },
  { name: 'Priya Sharma', trip: 'Kashmir Paradise', text: 'The valleys looked like a dream. Hotels, transfers, food — everything was perfect. Highly recommended.' },
  { name: 'Vinod Kumar', trip: 'Dubai Splendor', text: 'Business-class experience end-to-end. Loved the desert safari and the personal concierge.' },
  { name: 'Neha & Family', trip: 'Kerala Backwaters', text: 'The houseboat stay was straight out of a movie. Thank you Saishub team!' },
  { name: 'Ramesh Iyer', trip: 'Tirupati Darshan', text: 'Fast darshan, comfortable stay, and warm hospitality. Very well organised.' },
  { name: 'Fatima & Zaid', trip: 'Paris Romance', text: 'A perfect anniversary gift. The little surprises in the itinerary made it unforgettable.' },
]

export default function TestimonialsPage() {
  return (
    <PageShell eyebrow="Kind Words" title={<>Loved by <span className="gold-script font-serif-alt italic">Travellers</span></>} subtitle="Real stories from real families who trusted us with their most precious journeys.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 columns-1 md:columns-2 lg:columns-3 gap-6">
        {REVIEWS.map((r,i) => (
          <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:(i%3)*0.1}} className="glass rounded-3xl p-6 mb-6 break-inside-avoid relative">
            <Quote className="w-8 h-8 text-amber-500"/>
            <p className="mt-3 text-slate-700 leading-relaxed">“{r.text}”</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 text-white flex items-center justify-center font-semibold">{r.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
              <div>
                <div className="font-semibold text-emerald-900">{r.name}</div>
                <div className="text-xs text-slate-500">{r.trip}</div>
              </div>
              <div className="ml-auto flex text-amber-500">{Array.from({length:5}).map((_,k)=><Star key={k} className="w-3.5 h-3.5 fill-current"/>)}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}

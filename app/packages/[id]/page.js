'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Calendar, Sparkles, Check, X as XIcon, ArrowLeft, ArrowRight, Compass } from 'lucide-react'
import PageShell from '@/components/PageShell'
import api from '@/lib/api'
import { externalLinkProps, SOCIAL } from '@/lib/externalLink'

export default function PackageDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [pkg, setPkg] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    api.getPackage(id).then(d => setPkg(d.package)).catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <PageShell eyebrow="404" title="Package not found" subtitle="The tour you’re looking for may have been removed or renamed.">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <Link href="/domestic" className="btn-primary rounded-full px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Back to tours</Link>
        </div>
      </PageShell>
    )
  }

  if (!pkg) {
    return (
      <PageShell eyebrow="Loading" title="Fetching itinerary…" subtitle=" ">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-4">
          <div className="h-72 rounded-3xl bg-white/60 animate-pulse"/>
          <div className="h-40 rounded-3xl bg-white/60 animate-pulse"/>
        </div>
      </PageShell>
    )
  }

  const cover = (pkg.gallery && pkg.gallery[0]) || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=srgb&fm=jpg&q=85'
  const highlights = Array.isArray(pkg.highlights) ? pkg.highlights : []
  const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : []
  const inclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions : []
  const exclusions = Array.isArray(pkg.exclusions) ? pkg.exclusions : []

  return (
    <PageShell eyebrow={pkg.category} title={pkg.name} subtitle={`${pkg.duration}  ·  Best time: ${pkg.bestTimeToVisit}  ·  From ${pkg.startingLocation}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 space-y-10">
        {/* Hero image */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="relative rounded-3xl overflow-hidden h-[420px] shadow-2xl ring-1 ring-white/50">
          <img src={cover} className="absolute inset-0 w-full h-full object-cover" alt={pkg.name}/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="glass rounded-full px-3 py-1 text-emerald-900 flex items-center gap-1"><MapPin className="w-3 h-3"/>{pkg.startingLocation}</span>
              <span className="glass rounded-full px-3 py-1 text-emerald-900 flex items-center gap-1"><Calendar className="w-3 h-3"/>{pkg.duration}</span>
              <span className="glass rounded-full px-3 py-1 text-emerald-900 flex items-center gap-1"><Compass className="w-3 h-3"/>{pkg.category}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: itinerary */}
          <div className="lg:col-span-2 space-y-8">
            {highlights.length > 0 && (
              <div className="glass rounded-3xl p-6">
                <div className="font-display text-2xl text-emerald-900 font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500"/>Highlights</div>
                <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                  {highlights.map((h,i) => <li key={i} className="flex items-start gap-2 text-slate-700 text-sm"><Check className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0"/>{h}</li>)}
                </ul>
              </div>
            )}
            {itinerary.length > 0 && (
              <div className="glass rounded-3xl p-6">
                <div className="font-display text-2xl text-emerald-900 font-bold">Day-wise Itinerary</div>
                <div className="mt-4 space-y-4">
                  {itinerary.map((d, i) => (
                    <div key={i} className="relative pl-10">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-800 text-white flex items-center justify-center text-xs font-bold">{d.day || i+1}</div>
                      <div className="font-semibold text-emerald-900">{d.title}</div>
                      {Array.isArray(d.activities) && (
                        <ul className="mt-2 space-y-1">
                          {d.activities.map((a,k) => <li key={k} className="text-sm text-slate-700 flex items-start gap-2"><Check className="w-3.5 h-3.5 mt-1 text-emerald-500 shrink-0"/>{a}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {inclusions.length > 0 && (
                <div className="glass rounded-3xl p-6">
                  <div className="font-display text-xl text-emerald-900 font-bold">Inclusions</div>
                  <ul className="mt-3 space-y-2">
                    {inclusions.map((x,i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><Check className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0"/>{x}</li>)}
                  </ul>
                </div>
              )}
              {exclusions.length > 0 && (
                <div className="glass rounded-3xl p-6">
                  <div className="font-display text-xl text-emerald-900 font-bold">Exclusions</div>
                  <ul className="mt-3 space-y-2">
                    {exclusions.map((x,i) => <li key={i} className="flex items-start gap-2 text-sm text-slate-700"><XIcon className="w-4 h-4 mt-0.5 text-red-500 shrink-0"/>{x}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right: CTA / booking */}
          <aside className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <div className="font-display text-xl text-emerald-900 font-bold">Interested?</div>
              <p className="text-sm text-slate-600 mt-2">Talk to our concierge for a personalized quote and travel plan.</p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href={`/contact?package=${encodeURIComponent(pkg.name)}`} className="btn-primary rounded-full px-5 py-3 text-sm font-semibold flex items-center justify-center gap-2">Send Enquiry <ArrowRight className="w-4 h-4"/></Link>
                <a {...externalLinkProps(SOCIAL.whatsapp('Hi, I would like to know more about the ' + pkg.name + ' package.'))} className="btn-outline rounded-full px-5 py-3 text-sm font-semibold text-center">WhatsApp Us</a>
                <a href="tel:9945883774" className="rounded-full px-5 py-3 text-sm font-semibold text-center bg-white text-emerald-900 ring-1 ring-emerald-700/15">Call: +91 99458 83774</a>
              </div>
            </div>
            {pkg.mapUrl && (
              <div className="glass rounded-3xl p-6">
                <div className="font-display text-lg text-emerald-900 font-bold">Location</div>
                <a href={pkg.mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-700 hover:underline"><MapPin className="w-4 h-4"/> View on Google Maps</a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </PageShell>
  )
}

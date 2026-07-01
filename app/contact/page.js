'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Instagram, Facebook, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import PageShell from '@/components/PageShell'
import api from '@/lib/api'
import { externalLinkProps, SOCIAL } from '@/lib/externalLink'

export default function ContactPage() {
  const [status, setStatus] = useState({ state: 'idle', message: '' }) // idle | sending | sent | error
  const [form, setForm] = useState({ name: '', phone: '', email: '', packageName: '', travelDate: '', message: '' })
  const [packages, setPackages] = useState([])

  useEffect(() => {
    api.getPackages().then(d => setPackages(d.packages || [])).catch(() => setPackages([]))
  }, [])

  const onChange = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ state: 'sending', message: '' })
    try {
      await api.postEnquiry(form)
      setStatus({ state: 'sent', message: 'Thank you! We will reach out to you shortly.' })
      setForm({ name: '', phone: '', email: '', packageName: '', travelDate: '', message: '' })
      setTimeout(() => setStatus({ state: 'idle', message: '' }), 5000)
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Something went wrong. Please try again.' })
    }
  }

  return (
    <PageShell eyebrow="Get in touch" title={<>Plan your <span className="gold-script font-serif-alt italic">next escape</span></>} subtitle="Tell us where you dream. Our concierge team will design a bespoke itinerary just for you.">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-5 gap-8">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="lg:col-span-2 glass rounded-3xl p-8 space-y-6">
          <div className="font-display text-2xl text-emerald-900 font-bold">Reach us anytime</div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800"><MapPin className="w-5 h-5"/></div>
            <div>
              <div className="font-semibold text-emerald-900">Our Office</div>
              <div className="text-sm text-slate-600 mt-1">108/3 Dr Rajkumar Road, Near Navrang Theatre, Rajajinagar, Bengaluru, Karnataka 560010</div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800"><Phone className="w-5 h-5"/></div>
            <div>
              <div className="font-semibold text-emerald-900">Call Us</div>
              <a href="tel:9945883774" className="block text-sm text-slate-600 mt-1 hover:text-emerald-800">+91 99458 83774</a>
              <a href="tel:9342196683" className="block text-sm text-slate-600 hover:text-emerald-800">+91 93421 96683</a>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-800"><Mail className="w-5 h-5"/></div>
            <div>
              <div className="font-semibold text-emerald-900">Email</div>
              <a href="mailto:saishubholidays@gmail.com" className="text-sm text-slate-600 mt-1 hover:text-emerald-800">saishubholidays@gmail.com</a>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <a {...externalLinkProps(SOCIAL.instagram)} className="w-11 h-11 rounded-full bg-white ring-1 ring-emerald-700/15 flex items-center justify-center text-emerald-800 hover:scale-110 transition"><Instagram className="w-5 h-5"/></a>
            <a {...externalLinkProps(SOCIAL.facebook)} className="w-11 h-11 rounded-full bg-white ring-1 ring-emerald-700/15 flex items-center justify-center text-emerald-800 hover:scale-110 transition"><Facebook className="w-5 h-5"/></a>
            <a {...externalLinkProps(SOCIAL.whatsapp('Hi Saishubh Holidays, I would like to enquire about a trip.'))} className="px-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-semibold hover:bg-emerald-800 transition">WhatsApp Us</a>
          </div>
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/60 shadow-lg">
            <iframe title="Saishub Holidays Location" src="https://www.google.com/maps?q=108,+Dr+Rajkumar+Rd,+near+Navrang+Theatre,+Rajajinagar,+Bengaluru,+Karnataka+560010&output=embed" className="w-full h-64 border-0" loading="lazy"/>
          </div>
        </motion.div>

        <motion.form initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} onSubmit={onSubmit} className="lg:col-span-3 glass rounded-3xl p-8 space-y-4">
          <div className="font-display text-2xl text-emerald-900 font-bold">Enquire about a trip</div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full name*" value={form.name} onChange={onChange('name')} placeholder="John Doe" required/>
            <Field label="Phone*" value={form.phone} onChange={onChange('phone')} placeholder="+91 —" required/>
            <Field label="Email" value={form.email} onChange={onChange('email')} type="email" placeholder="you@email.com"/>
            <label className="block">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Package Interested In</div>
              <select value={form.packageName} onChange={onChange('packageName')} className="w-full rounded-2xl bg-white/80 border border-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Any / Not sure</option>
                {packages.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </label>
            <Field label="Travel Date" value={form.travelDate} onChange={onChange('travelDate')} placeholder="MM/YYYY"/>
            <div/>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Your message</div>
            <textarea rows={5} value={form.message} onChange={onChange('message')} placeholder="Tell us about your dream trip…" className="w-full rounded-2xl bg-white/80 border border-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"/>
          </div>
          {status.state === 'error' && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle className="w-4 h-4"/>{status.message}</div>}
          {status.state === 'sent' && <div className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4"/>{status.message}</div>}
          <button type="submit" disabled={status.state === 'sending'} className="btn-primary rounded-full px-6 py-3.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-70">
            {status.state === 'sending' ? <>Sending <Loader2 className="w-4 h-4 animate-spin"/></> : status.state === 'sent' ? <>Sent! <CheckCircle2 className="w-4 h-4"/></> : <>Send Enquiry <Send className="w-4 h-4"/></>}
          </button>
        </motion.form>
      </div>
    </PageShell>
  )
}

function Field({ label, ...rest }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <input {...rest} className="w-full rounded-2xl bg-white/80 border border-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"/>
    </label>
  )
}

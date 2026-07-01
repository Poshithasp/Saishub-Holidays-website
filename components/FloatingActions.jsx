'use client'
import { MessageCircle, Phone, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function FloatingActions() {
  return (
    <div className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {[
        { icon: MessageCircle, label: 'WhatsApp\nEnquiry', href: 'https://wa.me/919945883774', color: 'from-emerald-500 to-emerald-700' },
        { icon: Phone, label: 'Call Us', href: 'tel:9945883774', color: 'from-emerald-600 to-emerald-800' },
        { icon: FileText, label: 'Brochure', href: '#', color: 'from-amber-500 to-amber-700' },
      ].map((a, i) => (
        <motion.a key={i} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay: 0.3 + i*0.1 }} href={a.href} target={a.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="group flex flex-col items-center">
          <div className={`w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${a.color} text-white flex items-center justify-center shadow-xl ring-4 ring-white/50 hover:scale-110 transition`}>
            <a.icon className="w-5 h-5"/>
          </div>
          <div className="mt-1 text-[9px] md:text-[10px] font-semibold text-emerald-900 text-center leading-tight whitespace-pre-line">{a.label}</div>
        </motion.a>
      ))}
    </div>
  )
}

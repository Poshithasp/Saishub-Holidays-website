'use client'
import { useEffect, useState } from 'react'
import { X, Copy, CheckCircle2, ExternalLink, MessageCircle, Instagram, Facebook, Phone } from 'lucide-react'

/**
 * Global fallback modal shown when an external link cannot be opened in a
 * new tab (typically inside a sandboxed preview iframe that blocks popups
 * and top-level navigation). Provides a click-through button (fresh user
 * gesture retries window.open) and a Copy Link button.
 */
export default function ExternalLinkGate() {
  const [url, setUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onEvent = (e) => setUrl(e.detail?.url || null)
    window.addEventListener('external-link-blocked', onEvent)
    return () => window.removeEventListener('external-link-blocked', onEvent)
  }, [])

  if (!url) return null

  const close = () => { setUrl(null); setCopied(false) }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback for older browsers / sandboxed clipboard
      const ta = document.createElement('textarea')
      ta.value = url; document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(ta)
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    }
  }
  const openManually = () => {
    // Fresh user gesture — retry window.open. Also try assigning to
    // window.top.location as a last resort, catching cross-origin errors.
    try {
      const w = window.open(url, '_blank', 'noopener,noreferrer')
      if (w) { try { w.opener = null } catch {} ; close(); return }
    } catch {}
    try { window.top.location.href = url; return } catch {}
    // If nothing worked, leave the modal open so the user can copy.
  }

  // Detect the service for a friendlier label
  const service = url.includes('wa.me') || url.includes('whatsapp') ? 'WhatsApp'
    : url.includes('instagram') ? 'Instagram'
    : url.includes('facebook') ? 'Facebook'
    : 'External link'
  const Icon = service === 'WhatsApp' ? MessageCircle : service === 'Instagram' ? Instagram : service === 'Facebook' ? Facebook : ExternalLink

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 md:p-7 max-w-md w-full shadow-2xl relative">
        <button onClick={close} className="absolute top-3 right-3 w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
          <X className="w-5 h-5"/>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 text-white flex items-center justify-center shadow-md">
            <Icon className="w-6 h-6"/>
          </div>
          <div>
            <div className="tracking-[0.3em] text-[10px] text-amber-700 font-semibold uppercase">Continue to</div>
            <div className="font-display text-xl font-bold text-emerald-900">{service}</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Your browser blocked the new tab from opening automatically. Tap the button below to continue, or copy the link and open it in a new browser tab.
        </p>
        <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2">
          <div className="text-xs text-slate-700 truncate flex-1">{url}</div>
          <button onClick={copy} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold bg-white ring-1 ring-slate-200 hover:bg-slate-50 flex items-center gap-1">
            {copied ? <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/> Copied</> : <><Copy className="w-3.5 h-3.5"/> Copy</>}
          </button>
        </div>
        <button onClick={openManually} className="btn-primary rounded-full px-5 py-3 text-sm font-semibold w-full mt-4 flex items-center justify-center gap-2">
          Continue to {service} <ExternalLink className="w-4 h-4"/>
        </button>
        {service === 'WhatsApp' && (
          <a href="tel:+919945883774" className="mt-2 rounded-full px-5 py-3 text-sm font-semibold w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-emerald-900">
            <Phone className="w-4 h-4"/> Or call +91 99458 83774
          </a>
        )}
      </div>
    </div>
  )
}

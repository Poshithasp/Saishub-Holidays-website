'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ to, suffix = '', duration = 1800, prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -5% 0px' })
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    // Fallback: if not triggered within 800ms after mount (element already visible on load), start anyway
    const t = setTimeout(() => setStarted(true), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!inView && !started) return
    const start = performance.now()
    const target = Number(to)
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, started, to, duration])

  const target = Number(to)
  const display = Number.isInteger(target) ? Math.max(0, Math.round(val)) : Math.max(0, val).toFixed(1)
  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

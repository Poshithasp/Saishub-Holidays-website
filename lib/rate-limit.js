// Lightweight in-memory rate limiter (per-key sliding window).
// Suitable for a single-instance MVP deployment. For multi-instance /
// serverless scale, replace the Map with a shared store (e.g. Redis).
//
// Usage:
//   import { rateLimit, getClientIp } from '@/lib/rate-limit'
//   const ip = getClientIp(request)
//   const rl = rateLimit(`login:${ip}`, { max: 10, windowMs: 60_000 })
//   if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

const buckets = new Map() // key -> number[] (timestamps ms)

// Periodically prune stale buckets so the Map doesn't grow unbounded.
let lastSweep = 0
function sweep(now, windowMs) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, hits] of buckets) {
    const fresh = hits.filter(t => now - t < windowMs)
    if (fresh.length === 0) buckets.delete(key)
    else buckets.set(key, fresh)
  }
}

export function rateLimit(key, { max = 30, windowMs = 60_000 } = {}) {
  const now = Date.now()
  sweep(now, windowMs)
  const hits = (buckets.get(key) || []).filter(t => now - t < windowMs)
  const ok = hits.length < max
  if (ok) {
    hits.push(now)
    buckets.set(key, hits)
  }
  const remaining = Math.max(0, max - hits.length)
  const resetMs = hits.length ? windowMs - (now - hits[0]) : windowMs
  return { ok, remaining, retryAfter: Math.ceil(resetMs / 1000) }
}

export function getClientIp(request) {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  )
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { notifyNewEnquiry } from '@/lib/notifications'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

// POST /api/enquiry  (public)
// Body: { name, phone, email?, message?, packageName?, travelDate? }
export async function POST(request) {
  try {
    // Abuse protection: max 5 enquiries / minute per IP (limits DB + paid
    // email/WhatsApp notification spam).
    const ip = getClientIp(request)
    const rl = rateLimit(`enquiry:${ip}`, { max: 5, windowMs: 60_000 })
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many enquiries. Please try again in a minute.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }

    const body = await request.json().catch(() => ({}))
    const { name, phone, email, message, packageName, travelDate } = body

    if (!name || String(name).trim().length < 2) {
      return NextResponse.json({ error: 'Name is required (min 2 chars)' }, { status: 400 })
    }
    if (!phone || !/^[+\d\s\-()]{7,20}$/.test(String(phone))) {
      return NextResponse.json({ error: 'A valid phone number is required' }, { status: 400 })
    }
    if (email && !/^\S+@\S+\.\S+$/.test(String(email))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        message: message ? String(message).trim() : null,
        packageName: packageName ? String(packageName).trim() : null,
        travelDate: travelDate ? String(travelDate).trim() : null,
      },
    })

    // Fire-and-forget notifications (email + WhatsApp).
    // Failures are logged but never block the user.
    notifyNewEnquiry(enquiry).catch(err => console.error('[notify] unhandled', err))

    return NextResponse.json({ ok: true, enquiry }, { status: 201 })
  } catch (e) {
    console.error('POST /api/enquiry error:', e)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}

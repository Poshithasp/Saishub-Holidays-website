import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/admin/testimonials  (protected)
export async function POST(request) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json().catch(() => ({}))
    const { name, rating, message, location, isActive } = body
    if (!name || !message) return NextResponse.json({ error: 'name and message are required' }, { status: 400 })
    const r = Number(rating)
    if (rating !== undefined && (!Number.isFinite(r) || r < 1 || r > 5)) {
      return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
    }

    const t = await prisma.testimonial.create({
      data: {
        name: String(name).trim(),
        rating: rating !== undefined ? r : 5,
        message: String(message).trim(),
        location: location ? String(location).trim() : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    })
    return NextResponse.json({ ok: true, testimonial: t }, { status: 201 })
  } catch (e) {
    console.error('POST /api/admin/testimonials error:', e)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}

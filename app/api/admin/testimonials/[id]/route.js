import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// PUT /api/admin/testimonials/:id  (protected)
export async function PUT(request, { params }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const data = {}
    if (body.name !== undefined) data.name = String(body.name).trim()
    if (body.message !== undefined) data.message = String(body.message).trim()
    if (body.location !== undefined) data.location = body.location ? String(body.location).trim() : null
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive)
    if (body.rating !== undefined) {
      const r = Number(body.rating)
      if (!Number.isFinite(r) || r < 1 || r > 5) return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
      data.rating = r
    }
    const t = await prisma.testimonial.update({ where: { id }, data })
    return NextResponse.json({ ok: true, testimonial: t })
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    console.error('PUT /api/admin/testimonials/:id error:', e)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

// DELETE /api/admin/testimonials/:id  (protected)
export async function DELETE(request, { params }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    await prisma.testimonial.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    console.error('DELETE /api/admin/testimonials/:id error:', e)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}

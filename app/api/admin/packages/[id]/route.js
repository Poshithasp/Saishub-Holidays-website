import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { isAllowedPackage, normalizeName } from '@/lib/allowed-packages'

export const dynamic = 'force-dynamic'

// PUT /api/admin/packages/:id  (protected)
export async function PUT(request, { params }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))

    // If name/category are being changed, they must remain in allowed list.
    if (body.name !== undefined || body.category !== undefined) {
      const current = await prisma.tourPackage.findUnique({ where: { id } })
      if (!current) return NextResponse.json({ error: 'Package not found' }, { status: 404 })
      const nextName = body.name !== undefined ? normalizeName(body.name) : current.name
      const nextCategory = body.category !== undefined ? body.category : current.category
      if (!isAllowedPackage(nextName, nextCategory)) {
        return NextResponse.json({ error: `Package name/category is not in the official allowed list` }, { status: 400 })
      }
      if (body.name !== undefined) body.name = nextName
    }

    const allowedFields = ['name', 'category', 'duration', 'startingLocation', 'bestTimeToVisit', 'highlights', 'itinerary', 'inclusions', 'exclusions', 'gallery', 'mapUrl', 'isActive']
    const data = {}
    for (const f of allowedFields) if (body[f] !== undefined) data[f] = body[f]

    const updated = await prisma.tourPackage.update({ where: { id }, data })
    return NextResponse.json({ ok: true, package: updated })
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    console.error('PUT /api/admin/packages/:id error:', e)
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

// DELETE /api/admin/packages/:id  (protected)
export async function DELETE(request, { params }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    await prisma.tourPackage.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    console.error('DELETE /api/admin/packages/:id error:', e)
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { isAllowedPackage, ALL_ALLOWED_PACKAGE_NAMES, normalizeName } from '@/lib/allowed-packages'

export const dynamic = 'force-dynamic'

// POST /api/admin/packages  (protected)
// Only allow creation of packages whose name is in the official allowed list.
export async function POST(request) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json().catch(() => ({}))
    const name = normalizeName(body.name)
    const category = body.category

    if (!name || !category) {
      return NextResponse.json({ error: 'name and category are required' }, { status: 400 })
    }
    if (!isAllowedPackage(name, category)) {
      return NextResponse.json({
        error: `Package name is not in the official allowed list for category '${category}'.`,
        allowedForCategory: ALL_ALLOWED_PACKAGE_NAMES,
      }, { status: 400 })
    }

    const data = {
      name,
      category,
      duration: String(body.duration || ''),
      startingLocation: String(body.startingLocation || ''),
      bestTimeToVisit: String(body.bestTimeToVisit || ''),
      highlights: body.highlights ?? [],
      itinerary: body.itinerary ?? [],
      inclusions: body.inclusions ?? [],
      exclusions: body.exclusions ?? [],
      gallery: body.gallery ?? [],
      mapUrl: body.mapUrl ? String(body.mapUrl) : null,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    }

    const created = await prisma.tourPackage.create({ data })
    return NextResponse.json({ ok: true, package: created }, { status: 201 })
  } catch (e) {
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'A package with this name already exists' }, { status: 409 })
    }
    console.error('POST /api/admin/packages error:', e)
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}

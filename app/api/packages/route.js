import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/packages
// Optional query params:
//   ?category=Domestic|Pilgrimage|International
//   ?active=true (default) | false | all
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const activeParam = (searchParams.get('active') || 'true').toLowerCase()

    const where = {}
    if (category) where.category = category
    if (activeParam === 'true') where.isActive = true
    else if (activeParam === 'false') where.isActive = false
    // 'all' → no filter

    const packages = await prisma.tourPackage.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ count: packages.length, packages })
  } catch (e) {
    console.error('GET /api/packages error:', e)
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}

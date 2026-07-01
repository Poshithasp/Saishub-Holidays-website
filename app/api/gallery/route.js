import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/gallery  (optional ?category=)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const gallery = await prisma.gallery.findMany({
      where: category ? { category } : {},
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ count: gallery.length, gallery })
  } catch (e) {
    console.error('GET /api/gallery error:', e)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

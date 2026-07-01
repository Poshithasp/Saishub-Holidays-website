import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/testimonials  (only active by default)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = (searchParams.get('all') || 'false').toLowerCase() === 'true'
    const testimonials = await prisma.testimonial.findMany({
      where: all ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ count: testimonials.length, testimonials })
  } catch (e) {
    console.error('GET /api/testimonials error:', e)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

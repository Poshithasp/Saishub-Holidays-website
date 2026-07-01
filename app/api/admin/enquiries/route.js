import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET /api/admin/enquiries  (protected)
// Query params: ?limit=50&skip=0
export async function GET(request) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit')) || 100, 500)
    const skip = Number(searchParams.get('skip')) || 0
    const [count, enquiries] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: limit, skip }),
    ])
    return NextResponse.json({ total: count, count: enquiries.length, enquiries })
  } catch (e) {
    console.error('GET /api/admin/enquiries error:', e)
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/packages/:id
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const pkg = await prisma.tourPackage.findUnique({ where: { id } })
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    return NextResponse.json({ package: pkg })
  } catch (e) {
    console.error('GET /api/packages/:id error:', e)
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 })
  }
}

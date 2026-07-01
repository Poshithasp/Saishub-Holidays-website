import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/admin/gallery  (protected)  Body: { imageUrl, category? }
export async function POST(request) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { imageUrl, category } = await request.json().catch(() => ({}))
    if (!imageUrl || !/^https?:\/\//i.test(String(imageUrl))) {
      return NextResponse.json({ error: 'imageUrl (http/https URL) is required' }, { status: 400 })
    }
    const g = await prisma.gallery.create({
      data: { imageUrl: String(imageUrl), category: category ? String(category) : null },
    })
    return NextResponse.json({ ok: true, gallery: g }, { status: 201 })
  } catch (e) {
    console.error('POST /api/admin/gallery error:', e)
    return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 })
  }
}

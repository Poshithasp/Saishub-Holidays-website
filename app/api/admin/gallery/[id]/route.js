import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// DELETE /api/admin/gallery/:id  (protected)
export async function DELETE(request, { params }) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const { id } = await params
    await prisma.gallery.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e?.code === 'P2025') return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    console.error('DELETE /api/admin/gallery/:id error:', e)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}

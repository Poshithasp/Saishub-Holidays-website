import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/admin/login  Body: { username, password }
export async function POST(request) {
  try {
    const { username, password } = await request.json().catch(() => ({}))
    if (!username || !password) {
      return NextResponse.json({ error: 'username and password are required' }, { status: 400 })
    }
    const admin = await prisma.admin.findUnique({ where: { username: String(username).trim() } })
    if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await verifyPassword(password, admin.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ sub: admin.id, username: admin.username, role: admin.role })
    return NextResponse.json({
      ok: true,
      token,
      admin: { id: admin.id, username: admin.username, role: admin.role },
    })
  } catch (e) {
    console.error('POST /api/admin/login error:', e)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

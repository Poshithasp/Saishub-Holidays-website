import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// POST /api/admin/login  Body: { username, password }
// On success: returns { token, admin } AND sets an `sh_token` cookie so
// the Next.js middleware can enforce auth on /admin/* server-side.
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

    const res = NextResponse.json({
      ok: true,
      token,
      admin: { id: admin.id, username: admin.username, role: admin.role },
    })

    // 7-day cookie — lets the middleware protect /admin/dashboard
    res.cookies.set('sh_token', token, {
      httpOnly: false, // needs to be readable by client for /api/admin calls with Bearer
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (e) {
    console.error('POST /api/admin/login error:', e)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

// POST /api/admin/logout — clears the cookie (optional endpoint)
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('sh_token', '', { path: '/', maxAge: 0 })
  return res
}

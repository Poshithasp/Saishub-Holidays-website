import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours (matches JWT_EXPIRES_IN default)

// POST /api/admin/login  Body: { username, password }
// On success: sets an HttpOnly `sh_token` cookie. The token is NEVER exposed to
// client-side JavaScript — the cookie is sent automatically on same-origin
// requests, and the Edge middleware enforces auth on /admin/* + /api/admin/*.
export async function POST(request) {
  try {
    // Brute-force protection: max 10 attempts / minute per IP.
    const ip = getClientIp(request)
    const rl = rateLimit(`login:${ip}`, { max: 10, windowMs: 60_000 })
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in a minute.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      )
    }

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
      admin: { id: admin.id, username: admin.username, role: admin.role },
    })

    // HttpOnly cookie — unreadable by JS, protects against XSS token theft.
    res.cookies.set('sh_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    })
    return res
  } catch (e) {
    console.error('POST /api/admin/login error:', e)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

// DELETE /api/admin/login — clears the cookie (logout)
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('sh_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}

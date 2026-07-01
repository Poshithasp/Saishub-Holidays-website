// Next.js Edge middleware — protects admin routes with JWT.
// - Runs BEFORE the request reaches the route handler.
// - Uses `jose` (Web Crypto) because `jsonwebtoken` isn't Edge-compatible.
// - For pages under /admin (except /admin itself, the login page), if the
//   user has no valid token cookie, we redirect to /admin.
// - For API routes under /api/admin/* (except /api/admin/login), we accept
//   either a Bearer token OR the sh_token cookie; on failure we return 401 JSON.

import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_dev_secret'
)

async function verify(token) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    if (payload?.role !== 'admin') return null
    return payload
  } catch {
    return null
  }
}

function getTokenFromRequest(request) {
  const auth = request.headers.get('authorization') || request.headers.get('Authorization')
  if (auth && auth.toLowerCase().startsWith('bearer ')) return auth.split(' ')[1]
  return request.cookies.get('sh_token')?.value || null
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Public endpoints inside /api/admin
  if (pathname === '/api/admin/login') return NextResponse.next()

  // API guard
  if (pathname.startsWith('/api/admin')) {
    const token = getTokenFromRequest(request)
    const payload = await verify(token)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Forward the verified admin id/role via request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-admin-id', payload.sub || '')
    requestHeaders.set('x-admin-username', payload.username || '')
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Page guard for the admin dashboard (login page /admin is public)
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get('sh_token')?.value || null
    const payload = await verify(token)
    if (!payload) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}

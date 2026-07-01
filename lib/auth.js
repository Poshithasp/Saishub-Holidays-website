import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

/**
 * Middleware helper for admin routes.
 * Reads Bearer token from Authorization header, verifies it, and returns
 * either { admin } payload or a NextResponse with 401.
 *
 * Usage in a route handler:
 *   const auth = requireAdmin(request)
 *   if (auth instanceof NextResponse) return auth
 *   // use auth.admin
 */
export function requireAdmin(request) {
  const header = request.headers.get('authorization') || request.headers.get('Authorization')
  if (!header || !header.toLowerCase().startsWith('bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: missing bearer token' }, { status: 401 })
  }
  const token = header.split(' ')[1]
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized: invalid or expired token' }, { status: 401 })
  }
  return { admin: payload }
}

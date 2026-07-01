import { NextResponse } from 'next/server'

// GET /api/health
export async function GET() {
  return NextResponse.json({ ok: true, service: 'saishubh-holidays-api', timestamp: new Date().toISOString() })
}

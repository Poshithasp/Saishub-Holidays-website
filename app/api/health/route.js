import { NextResponse } from 'next/server'
import prisma, { dbDiagnostics } from '@/lib/prisma'
import { ensureSeeded } from '@/lib/ensureSeed'

export const dynamic = 'force-dynamic'

// GET /api/health
// Reports service status + database connectivity and record counts.
// Useful to verify the PRODUCTION database target from the browser.
export async function GET() {
  const diag = dbDiagnostics()
  const result = {
    ok: true,
    service: 'saishubh-holidays-api',
    timestamp: new Date().toISOString(),
    db: {
      connected: false,
      source: diag.source, // DATABASE_URL | MONGO_URL(derived) | ...(local)
      host: diag.host,      // sanitized host (no credentials)
      isLocal: diag.isLocal,
    },
    counts: {},
  }

  try {
    // Trigger idempotent seeding on a fresh DB, then read counts.
    await ensureSeeded()
    const [packages, gallery, testimonials, admins] = await Promise.all([
      prisma.tourPackage.count(),
      prisma.gallery.count(),
      prisma.testimonial.count(),
      prisma.admin.count(),
    ])
    result.db.connected = true
    result.counts = { packages, gallery, testimonials, admins }
  } catch (e) {
    result.ok = false
    result.db.connected = false
    result.db.error = String(e?.message || e).slice(0, 300)
  }

  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}

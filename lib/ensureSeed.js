// Runtime lazy seeder — populates the database on first use if it is empty.
// This makes a freshly-provisioned PRODUCTION database self-populate (packages,
// gallery, testimonials, admin) on the first request, without a manual seed step.
// It is fully idempotent: it only inserts into a collection when that collection
// is empty, and never deletes anything. On preview (already seeded) it is a no-op.

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { PACKAGES, TESTIMONIALS, GALLERY } from '@/lib/seed-data'

let seeded = false
let seedPromise = null

async function doSeed() {
  // 1. Admin — created once from env; never reset. Skips silently if
  //    ADMIN_PASSWORD is not configured (so package seeding still proceeds).
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD
  const existingAdmin = await prisma.admin.findUnique({ where: { username: adminUsername } })
  if (!existingAdmin && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    await prisma.admin.create({ data: { username: adminUsername, passwordHash, role: 'admin' } })
    console.log(`[ensureSeed] admin '${adminUsername}' created`)
  }

  // 2. Packages — only when empty (upsert keyed on unique name is idempotent).
  const pkgCount = await prisma.tourPackage.count()
  if (pkgCount === 0) {
    for (const p of PACKAGES) {
      await prisma.tourPackage.upsert({
        where: { name: p.name },
        update: { ...p, isActive: true },
        create: { ...p, isActive: true },
      })
    }
    console.log(`[ensureSeed] ${PACKAGES.length} packages seeded`)
  }

  // 3. Testimonials — only when empty.
  const tCount = await prisma.testimonial.count()
  if (tCount === 0) {
    await prisma.testimonial.createMany({ data: TESTIMONIALS })
    console.log(`[ensureSeed] ${TESTIMONIALS.length} testimonials seeded`)
  }

  // 4. Gallery — only when empty.
  const gCount = await prisma.gallery.count()
  if (gCount === 0) {
    await prisma.gallery.createMany({ data: GALLERY })
    console.log(`[ensureSeed] ${GALLERY.length} gallery entries seeded`)
  }
}

// Runs at most once per server process. Concurrent callers share one promise.
// On failure it resets so a later request can retry; it never throws to callers.
export async function ensureSeeded() {
  if (seeded) return
  if (!seedPromise) {
    seedPromise = doSeed()
      .then(() => { seeded = true })
      .catch((e) => {
        console.error('[ensureSeed] failed:', e?.message || e)
        seedPromise = null
      })
  }
  try {
    await seedPromise
  } catch {
    // swallow — seeding must never break the caller's request
  }
}

export default ensureSeeded

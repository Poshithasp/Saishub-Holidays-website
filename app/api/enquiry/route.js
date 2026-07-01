import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST /api/enquiry  (public)
// Body: { name, phone, email?, message?, packageName?, travelDate? }
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { name, phone, email, message, packageName, travelDate } = body

    if (!name || String(name).trim().length < 2) {
      return NextResponse.json({ error: 'Name is required (min 2 chars)' }, { status: 400 })
    }
    if (!phone || !/^[+\d\s\-()]{7,20}$/.test(String(phone))) {
      return NextResponse.json({ error: 'A valid phone number is required' }, { status: 400 })
    }
    if (email && !/^\S+@\S+\.\S+$/.test(String(email))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: String(name).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        message: message ? String(message).trim() : null,
        packageName: packageName ? String(packageName).trim() : null,
        travelDate: travelDate ? String(travelDate).trim() : null,
      },
    })

    return NextResponse.json({ ok: true, enquiry }, { status: 201 })
  } catch (e) {
    console.error('POST /api/enquiry error:', e)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}

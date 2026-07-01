import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
const MAX_BYTES = 8 * 1024 * 1024 // 8MB

// POST /api/admin/upload  (multipart/form-data with field 'file')
export async function POST(request) {
  const auth = requireAdmin(request)
  if (auth instanceof NextResponse) return auth

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded (field name should be "file")' }, { status: 400 })
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `File too large. Max ${MAX_BYTES / 1024 / 1024}MB` }, { status: 400 })
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    const safeName = String(file.name || 'image').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-40)
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safeName}`
    const filepath = path.join(UPLOAD_DIR, filename)
    await writeFile(filepath, buffer)

    const publicUrl = `/uploads/${filename}`
    return NextResponse.json({ ok: true, url: publicUrl, size: file.size, type: file.type })
  } catch (e) {
    console.error('POST /api/admin/upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

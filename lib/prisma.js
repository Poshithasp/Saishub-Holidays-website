import { PrismaClient } from '@prisma/client'

// ---------------------------------------------------------------------------
// Resolve the MongoDB connection string at runtime.
//
// Why: Prisma's datasource is `env("DATABASE_URL")`, but on Emergent the
// managed PRODUCTION database is provided through the MONGO_URL env var (and
// the committed .env keeps a localhost DATABASE_URL for preview/dev). Without
// this, production would try to connect to localhost and return no data.
//
// Strategy:
//   1. Use DATABASE_URL if it is set AND points to a real (non-local) host
//      (i.e. Emergent already injected a production value).
//   2. Otherwise, if MONGO_URL points to a real (non-local) managed host,
//      build the connection string from MONGO_URL + DB_NAME (production).
//   3. Otherwise fall back to the explicit DATABASE_URL (preview/local dev,
//      which carries the correct replica-set params for the local mongo).
// ---------------------------------------------------------------------------
const isLocal = (u = '') => /localhost|127\.0\.0\.1|::1/.test(u)

function buildMongoUrl(mongoUrl, dbName) {
  if (!mongoUrl) return null
  const qIndex = mongoUrl.indexOf('?')
  const query = qIndex >= 0 ? mongoUrl.slice(qIndex) : ''
  const base = qIndex >= 0 ? mongoUrl.slice(0, qIndex) : mongoUrl
  const m = base.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/)
  if (!m) return null
  const scheme = m[1]
  const rest = m[2] // [user:pass@]host[,host...][/existingDb]
  const slash = rest.indexOf('/')
  const hostPart = slash >= 0 ? rest.slice(0, slash) : rest
  return `${scheme}${hostPart}/${dbName}${query}`
}

function resolveDatabaseUrl() {
  const dbName = process.env.DB_NAME || 'saishubh_holidays'
  const explicit = process.env.DATABASE_URL || ''
  const mongo = process.env.MONGO_URL || ''

  // 1. Emergent injected a real production DATABASE_URL.
  if (explicit && !isLocal(explicit)) return explicit
  // 2. Derive from the managed (non-local) MONGO_URL in production.
  if (mongo && !isLocal(mongo)) {
    const built = buildMongoUrl(mongo, dbName)
    if (built) return built
  }
  // 3. Preview / local dev — explicit DATABASE_URL has the right rs params.
  if (explicit) return explicit
  // 4. Last resort.
  return buildMongoUrl(mongo, dbName) || undefined
}

const globalForPrisma = globalThis

const databaseUrl = resolveDatabaseUrl()

// Sanitized diagnostics (NO credentials) — surfaced via GET /api/health so the
// production DB target can be verified from the browser without log access.
export function dbDiagnostics() {
  const explicit = process.env.DATABASE_URL || ''
  const mongo = process.env.MONGO_URL || ''
  let source = 'none'
  if (explicit && !isLocal(explicit)) source = 'DATABASE_URL'
  else if (mongo && !isLocal(mongo)) source = 'MONGO_URL(derived)'
  else if (explicit) source = 'DATABASE_URL(local)'
  else if (mongo) source = 'MONGO_URL(local,derived)'
  let host = 'unknown'
  try {
    const m = (databaseUrl || '').match(/^mongodb(?:\+srv)?:\/\/(?:[^@]*@)?([^/?]+)/)
    if (m) host = m[1]
  } catch { /* noop */ }
  return { source, host, isLocal: isLocal(databaseUrl || '') }
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    ...(databaseUrl ? { datasources: { db: { url: databaseUrl } } } : {}),
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

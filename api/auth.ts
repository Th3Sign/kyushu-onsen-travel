import { neon } from '@neondatabase/serverless'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const SESSION_COOKIE_NAME = 'travel_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14 // 14 days

// Helper to retrieve database connection string from environment or .env
function getDbConnectionString(): string | null {
  if (process.env.NEON_URL) return process.env.NEON_URL
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL

  for (const envFile of ['.env', '.env.local']) {
    try {
      const p = path.resolve(process.cwd(), envFile)
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf-8')
        const lines = content.split('\n')
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) continue
          const match = trimmed.match(/^(?:NEON_URL|DATABASE_URL|POSTGRES_URL)\s*=\s*(["']?)(.*?)\1$/)
          if (match && match[2]) {
            const url = match[2].trim()
            process.env.NEON_URL = url
            return url
          }
        }
      }
    } catch {
      // ignore
    }
  }

  return null
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {}
  const result: Record<string, string> = {}
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const val = part.slice(idx + 1).trim()
    if (key) result[key] = decodeURIComponent(val)
  }
  return result
}

function extractSessionToken(req: any): string | null {
  const headers = req?.headers || {}
  const authHeader = headers.authorization || headers.Authorization
  if (typeof authHeader === 'string' && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim()
    if (token) return token
  }
  const cookies = parseCookies(headers.cookie || headers.Cookie)
  return cookies[SESSION_COOKIE_NAME] || null
}

function setSessionCookie(req: any, res: any, token: string, maxAgeSeconds: number) {
  const proto = req?.headers?.['x-forwarded-proto'] || ''
  const isHttps = proto === 'https' || !!req?.socket?.encrypted
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ]
  if (isHttps) parts.push('Secure')
  res.setHeader('Set-Cookie', parts.join('; '))
}

async function createSession(sql: any, userId: number, email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  await sql`
    INSERT INTO travel_sessions (token, user_id, user_email, expires_at)
    VALUES (${token}, ${userId}, ${email}, NOW() + INTERVAL '14 days')
  `
  return token
}

async function getAuthenticatedUser(
  sql: any,
  req: any
): Promise<{ id: number; email: string; name: string } | null> {
  const token = extractSessionToken(req)
  if (!token) return null

  const rows = await sql`
    SELECT u.id, u.email, u.name
    FROM travel_sessions s
    JOIN travel_users u ON u.id = s.user_id
    WHERE s.token = ${token} AND s.expires_at > NOW()
    LIMIT 1
  `
  if (rows.length === 0) return null
  const row = rows[0]
  return {
    id: row.id,
    email: row.email,
    name: row.name || row.email.split('@')[0],
  }
}

// Vercel Serverless Function & Vite dev middleware handler
export default async function handler(req: any, res: any) {
  const reqOrigin = req?.headers?.origin
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', reqOrigin || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { action } = req.query || {}
  const dbUrl = getDbConnectionString()

  if (!dbUrl) {
    return res.status(500).json({
      ok: false,
      error: '데이터베이스 연결 설정이 없습니다. .env 파일에 NEON_URL 또는 DATABASE_URL을 확인해주세요.',
    })
  }

  let sql: any
  try {
    sql = neon(dbUrl)
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: 'Neon DB 클라이언트 초기화 실패: ' + err.message,
    })
  }

  // Ensure tables exist
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS travel_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS travel_sessions (
        token VARCHAR(128) PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES travel_users(id) ON DELETE CASCADE,
        user_email VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS travel_saved_plans (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        plan_name VARCHAR(100) DEFAULT '규슈 온천 가족 여행',
        region_id VARCHAR(50) NOT NULL,
        flight_id VARCHAR(50) NOT NULL,
        transport_id VARCHAR(50) NOT NULL,
        ryokan_id VARCHAR(50) NOT NULL,
        price_plan VARCHAR(50) NOT NULL,
        extra_budget INTEGER,
        notes TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  } catch (err: any) {
    console.warn('Notice ensuring tables:', err.message)
  }

  // 1. Status Check
  if (action === 'status' || (req.method === 'GET' && !action)) {
    try {
      const ping = await sql`SELECT NOW() as current_time;`
      return res.status(200).json({
        ok: true,
        connected: true,
        serverTime: ping[0].current_time,
        provider: 'Neon Serverless Postgres',
        message: 'Neon 데이터베이스에 성공적으로 연결되었습니다.',
      })
    } catch (err: any) {
      return res.status(500).json({
        ok: false,
        connected: false,
        error: 'DB 연결 확인 실패: ' + err.message,
      })
    }
  }

  // 2. Session Verification (me)
  if (action === 'me' && req.method === 'GET') {
    try {
      const authedUser = await getAuthenticatedUser(sql, req)
      if (!authedUser) {
        return res.status(401).json({
          ok: false,
          authenticated: false,
          user: null,
        })
      }
      return res.status(200).json({
        ok: true,
        authenticated: true,
        user: authedUser,
      })
    } catch (err: any) {
      return res.status(500).json({
        ok: false,
        authenticated: false,
        error: '세션 확인 실패: ' + err.message,
      })
    }
  }

  // 3. Register
  if (action === 'register' && req.method === 'POST') {
    const { email, password, name } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: '이메일과 비밀번호를 입력해주세요.' })
    }

    const cleanEmail = String(email).trim().toLowerCase()
    const cleanName = (name || cleanEmail.split('@')[0] || '여행자').trim()
    const passwordHash = hashPassword(password)

    try {
      const existing = await sql`SELECT id FROM travel_users WHERE email = ${cleanEmail}`
      if (existing.length > 0) {
        return res.status(400).json({ ok: false, error: '이미 등록된 이메일 계정입니다. 로그인해주세요.' })
      }

      const inserted = await sql`
        INSERT INTO travel_users (email, password_hash, name)
        VALUES (${cleanEmail}, ${passwordHash}, ${cleanName})
        RETURNING id, email, name
      `
      const createdUser = inserted[0]
      const token = await createSession(sql, createdUser.id, createdUser.email)
      setSessionCookie(req, res, token, SESSION_TTL_SECONDS)

      return res.status(200).json({
        ok: true,
        user: { id: createdUser.id, email: createdUser.email, name: createdUser.name },
        token,
        message: '회원가입이 완료되었습니다.',
      })
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: '회원가입 실패: ' + err.message })
    }
  }

  // 4. Login
  if (action === 'login' && req.method === 'POST') {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: '이메일과 비밀번호를 입력해주세요.' })
    }

    const cleanEmail = String(email).trim().toLowerCase()
    const passwordHash = hashPassword(password)

    try {
      const rows = await sql`
        SELECT id, email, name, password_hash FROM travel_users WHERE email = ${cleanEmail}
      `
      if (rows.length === 0) {
        return res.status(401).json({ ok: false, error: '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.' })
      }

      const userRow = rows[0]
      if (userRow.password_hash !== passwordHash && userRow.password_hash !== password) {
        return res.status(401).json({ ok: false, error: '비밀번호가 일치하지 않습니다.' })
      }

      const displayName = userRow.name || userRow.email.split('@')[0]
      const token = await createSession(sql, userRow.id, userRow.email)
      setSessionCookie(req, res, token, SESSION_TTL_SECONDS)

      return res.status(200).json({
        ok: true,
        user: { id: userRow.id, email: userRow.email, name: displayName },
        token,
        message: '로그인되었습니다.',
      })
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: '로그인 실패: ' + err.message })
    }
  }

  // 5. Logout
  if (action === 'logout' && req.method === 'POST') {
    try {
      const token = extractSessionToken(req)
      if (token) {
        await sql`DELETE FROM travel_sessions WHERE token = ${token}`
      }
      setSessionCookie(req, res, '', 0)
      return res.status(200).json({ ok: true, message: '로그아웃되었습니다.' })
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: '로그아웃 실패: ' + err.message })
    }
  }

  // 6. Save Travel Plan (Authenticated)
  if (action === 'save_plan' && req.method === 'POST') {
    try {
      const authedUser = await getAuthenticatedUser(sql, req)
      if (!authedUser) {
        return res.status(401).json({ ok: false, error: '로그인이 필요합니다. 다시 로그인해주세요.' })
      }

      const body = req.body || {}
      const regionVal = body.region_id ?? body.regionId ?? 'beppu-yufuin'
      const flightVal = body.flight_id ?? body.flightId ?? '7c-oit-direct'
      const transportVal = body.transport_id ?? body.transportId ?? 'oit-limousine-express-train'
      const ryokanVal = body.ryokan_id ?? body.ryokanId ?? 'yufuin-sansuikan|beppu-onyado-nono'
      const pricePlanVal = body.price_plan ?? body.pricePlan ?? 'confirmed'
      const extraBudgetVal = Number(body.extra_budget ?? body.extraBudget) || 650000
      const notesVal = body.notes || ''

      await sql`
        INSERT INTO travel_saved_plans (
          user_email, region_id, flight_id, transport_id, ryokan_id, price_plan, extra_budget, notes
        ) VALUES (
          ${authedUser.email}, ${regionVal}, ${flightVal}, ${transportVal}, ${ryokanVal}, ${pricePlanVal}, ${extraBudgetVal}, ${notesVal}
        )
      `
      return res.status(200).json({
        ok: true,
        message: 'Neon 데이터베이스에 여행 플랜이 성공적으로 저장되었습니다.',
      })
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: '플랜 저장 실패: ' + err.message })
    }
  }

  // 7. Get Saved Travel Plan (Authenticated)
  if (action === 'get_plan' && req.method === 'GET') {
    try {
      const authedUser = await getAuthenticatedUser(sql, req)
      if (!authedUser) {
        return res.status(401).json({ ok: false, error: '로그인이 필요합니다.' })
      }

      const rows = await sql`
        SELECT * FROM travel_saved_plans
        WHERE user_email = ${authedUser.email}
        ORDER BY updated_at DESC
        LIMIT 1
      `
      if (rows.length === 0) {
        return res.status(200).json({ ok: true, plan: null })
      }
      return res.status(200).json({ ok: true, plan: rows[0] })
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: '플랜 조회 실패: ' + err.message })
    }
  }

  return res.status(404).json({ ok: false, error: '지원되지 않는 요청입니다.' })
}

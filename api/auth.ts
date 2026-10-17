import { neon } from '@neondatabase/serverless'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

// Helper to retrieve database connection string from environment or .env
function getDbConnectionString(): string | null {
  if (process.env.NEON_URL) return process.env.NEON_URL
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL

  // Read .env or .env.local if running in local Node environment
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

// Vercel Serverless Function & Vite dev middleware handler
export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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

  // 2. Register
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

      await sql`
        INSERT INTO travel_users (email, password_hash, name)
        VALUES (${cleanEmail}, ${passwordHash}, ${cleanName})
      `

      return res.status(200).json({
        ok: true,
        user: { email: cleanEmail, name: cleanName },
        message: '회원가입이 완료되었습니다.',
      })
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: '회원가입 실패: ' + err.message })
    }
  }

  // 3. Login
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

      // Check hash or raw password (for legacy)
      const userRow = rows[0]
      if (userRow.password_hash !== passwordHash && userRow.password_hash !== password) {
        return res.status(401).json({ ok: false, error: '비밀번호가 일치하지 않습니다.' })
      }

      return res.status(200).json({
        ok: true,
        user: { email: userRow.email, name: userRow.name || userRow.email.split('@')[0] },
        message: '로그인되었습니다.',
      })
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: '로그인 실패: ' + err.message })
    }
  }

  // 4. Save Travel Plan
  if (action === 'save_plan' && req.method === 'POST') {
    const { userEmail, regionId, flightId, transportId, ryokanId, pricePlan, extraBudget, notes } =
      req.body || {}

    if (!userEmail) {
      return res.status(400).json({ ok: false, error: '로그인 사용자 정보가 필요합니다.' })
    }

    const cleanEmail = String(userEmail).trim().toLowerCase()

    try {
      await sql`
        INSERT INTO travel_saved_plans (
          user_email, region_id, flight_id, transport_id, ryokan_id, price_plan, extra_budget, notes
        ) VALUES (
          ${cleanEmail}, ${regionId}, ${flightId}, ${transportId}, ${ryokanId}, ${pricePlan}, ${extraBudget || 650000}, ${notes || ''}
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

  // 5. Get Saved Travel Plan
  if (action === 'get_plan' && req.method === 'GET') {
    const { email } = req.query || {}
    if (!email) {
      return res.status(400).json({ ok: false, error: '조회할 email 파라미터가 필요합니다.' })
    }

    const cleanEmail = String(email).trim().toLowerCase()

    try {
      const rows = await sql`
        SELECT * FROM travel_saved_plans
        WHERE user_email = ${cleanEmail}
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

import { neon } from '@neondatabase/serverless'

// Vercel Serverless Function handler
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

  // Determine database connection string:
  // 1. DATABASE_URL / POSTGRES_URL from Vercel environment
  // 2. Or custom connection string provided in request body/headers
  const connectionString =
    req.body?.connectionString ||
    req.headers['x-neon-database-url'] ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL

  const isNeonAvailable = Boolean(connectionString && connectionString.startsWith('postgres'))

  let sql: any = null
  if (isNeonAvailable) {
    try {
      sql = neon(connectionString)
      // Auto-create tables if they don't exist
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
      console.warn('Neon connection or table creation notice:', err.message)
    }
  }

  // 1. Check DB Status
  if (action === 'status' || req.method === 'GET' && !action) {
    return res.status(200).json({
      ok: true,
      provider: 'Neon Serverless Postgres (neon.tech)',
      connected: Boolean(sql),
      hasEnvUrl: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL),
      message: sql ? 'Neon DB 정상 연결됨' : 'DATABASE_URL 환경변수 설정 대기 중 (게스트 모드 지원)',
    })
  }

  // 2. User Registration
  if (action === 'register' && req.method === 'POST') {
    const { email, password, name } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: '이메일과 비밀번호를 입력해주세요.' })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = (name || cleanEmail.split('@')[0] || '가족 여행자').trim()

    if (sql) {
      try {
        const existing = await sql`SELECT id FROM travel_users WHERE email = ${cleanEmail}`
        if (existing.length > 0) {
          return res.status(400).json({ ok: false, error: '이미 등록된 이메일입니다.' })
        }
        await sql`
          INSERT INTO travel_users (email, password_hash, name)
          VALUES (${cleanEmail}, ${password}, ${cleanName})
        `
        return res.status(200).json({
          ok: true,
          user: { email: cleanEmail, name: cleanName },
          message: 'Neon DB에 계정이 성공적으로 등록되었습니다.',
          dbConnected: true,
        })
      } catch (e: any) {
        return res.status(500).json({ ok: false, error: 'DB 등록 실패: ' + e.message })
      }
    } else {
      // Mock / fallback registration for development without active Neon instance
      return res.status(200).json({
        ok: true,
        user: { email: cleanEmail, name: cleanName },
        message: '계정이 생성되었습니다 (게스트 세션 모드)',
        dbConnected: false,
      })
    }
  }

  // 3. User Login
  if (action === 'login' && req.method === 'POST') {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: '이메일과 비밀번호를 입력해주세요.' })
    }

    const cleanEmail = email.trim().toLowerCase()

    if (sql) {
      try {
        const rows = await sql`
          SELECT id, email, name, password_hash FROM travel_users WHERE email = ${cleanEmail}
        `
        if (rows.length === 0 || rows[0].password_hash !== password) {
          return res.status(401).json({ ok: false, error: '이메일 또는 비밀번호가 일치하지 않습니다.' })
        }
        return res.status(200).json({
          ok: true,
          user: { email: rows[0].email, name: rows[0].name },
          message: 'Neon DB 로그인 성공',
          dbConnected: true,
        })
      } catch (e: any) {
        return res.status(500).json({ ok: false, error: 'DB 조회 실패: ' + e.message })
      }
    } else {
      // Fallback demo login
      return res.status(200).json({
        ok: true,
        user: { email: cleanEmail, name: cleanEmail.split('@')[0] || '아기랑 온천가족' },
        message: '로그인되었습니다 (게스트 세션)',
        dbConnected: false,
      })
    }
  }

  // 4. Save Travel Plan
  if (action === 'save_plan' && req.method === 'POST') {
    const { userEmail, regionId, flightId, transportId, ryokanId, pricePlan, extraBudget, notes } =
      req.body || {}
    if (!userEmail) {
      return res.status(400).json({ ok: false, error: '로그인 정보(userEmail)가 필요합니다.' })
    }

    if (sql) {
      try {
        await sql`
          INSERT INTO travel_saved_plans (
            user_email, region_id, flight_id, transport_id, ryokan_id, price_plan, extra_budget, notes
          ) VALUES (
            ${userEmail}, ${regionId}, ${flightId}, ${transportId}, ${ryokanId}, ${pricePlan}, ${extraBudget || 650000}, ${notes || ''}
          )
        `
        return res.status(200).json({
          ok: true,
          message: 'Neon DB에 맞춤 여행 플랜이 성공적으로 저장되었습니다.',
          dbConnected: true,
        })
      } catch (e: any) {
        return res.status(500).json({ ok: false, error: '플랜 저장 실패: ' + e.message })
      }
    } else {
      return res.status(200).json({
        ok: true,
        message: '여행 플랜이 로컬 세션에 저장되었습니다.',
        dbConnected: false,
      })
    }
  }

  // 5. Get Saved Travel Plan
  if (action === 'get_plan' && req.method === 'GET') {
    const { email } = req.query || {}
    if (!email) {
      return res.status(400).json({ ok: false, error: 'email 파라미터가 필요합니다.' })
    }

    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM travel_saved_plans
          WHERE user_email = ${email}
          ORDER BY updated_at DESC
          LIMIT 1
        `
        if (rows.length === 0) {
          return res.status(200).json({ ok: true, plan: null })
        }
        return res.status(200).json({ ok: true, plan: rows[0], dbConnected: true })
      } catch (e: any) {
        return res.status(500).json({ ok: false, error: '플랜 조회 실패: ' + e.message })
      }
    } else {
      return res.status(200).json({ ok: true, plan: null, dbConnected: false })
    }
  }

  return res.status(404).json({ ok: false, error: '알 수 없는 요청 action 입니다.' })
}

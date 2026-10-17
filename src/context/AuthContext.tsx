import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { RegionId, PricePlanType } from '../data/travelData'

export interface UserProfile {
  email: string
  name: string
}

export interface SavedTravelPlan {
  id?: number
  user_email: string
  plan_name?: string
  region_id: RegionId
  flight_id: string
  transport_id: string
  ryokan_id: string
  price_plan: PricePlanType
  extra_budget: number
  notes?: string
  updated_at?: string
}

export interface DbStatus {
  connected: boolean
  provider: string
  message: string
  hasEnvUrl: boolean
}

interface AuthContextType {
  user: UserProfile | null
  dbStatus: DbStatus
  isLoading: boolean
  lastSavedAt: string | null
  customDbUrl: string
  setCustomDbUrl: (url: string) => void
  login: (email: string, password?: string) => Promise<{ ok: boolean; error?: string }>
  register: (email: string, password?: string, name?: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  quickDemoLogin: () => Promise<void>
  savePlan: (plan: Omit<SavedTravelPlan, 'user_email'>) => Promise<{ ok: boolean; message?: string; error?: string }>
  loadPlan: () => Promise<SavedTravelPlan | null>
  refreshDbStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY_USER = 'kyushu_travel_user'
const STORAGE_KEY_DB_URL = 'kyushu_travel_neon_url'
const STORAGE_KEY_LOCAL_PLAN = 'kyushu_travel_local_plan'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [customDbUrl, setCustomDbUrlState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_DB_URL) || ''
  })

  const [dbStatus, setDbStatus] = useState<DbStatus>({
    connected: false,
    provider: 'Neon Serverless Postgres',
    message: 'DB 상태 확인 중...',
    hasEnvUrl: false,
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  const setCustomDbUrl = (url: string) => {
    setCustomDbUrlState(url)
    if (url) {
      localStorage.setItem(STORAGE_KEY_DB_URL, url)
    } else {
      localStorage.removeItem(STORAGE_KEY_DB_URL)
    }
  }

  // Check Neon DB connection status
  const refreshDbStatus = useCallback(async () => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (customDbUrl) {
        headers['x-neon-database-url'] = customDbUrl
      }
      const res = await fetch('/api/auth?action=status', { headers })
      if (res.ok) {
        const data = await res.json()
        setDbStatus({
          connected: data.connected,
          provider: data.provider || 'Neon Serverless Postgres',
          message: data.message || (data.connected ? 'Neon DB 정상 연결됨' : '연결 대기중'),
          hasEnvUrl: !!data.hasEnvUrl,
        })
      }
    } catch {
      setDbStatus((prev) => ({
        ...prev,
        connected: false,
        message: '로컬/오프라인 모드 (게스트 세션 지원)',
      }))
    }
  }, [customDbUrl])

  useEffect(() => {
    refreshDbStatus()
  }, [refreshDbStatus])

  // Login handler
  const login = async (email: string, password = 'demo-password') => {
    setIsLoading(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (customDbUrl) headers['x-neon-database-url'] = customDbUrl

      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password, connectionString: customDbUrl || undefined }),
      })

      const data = await res.json()
      if (data.ok && data.user) {
        setUser(data.user)
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user))
        setIsLoading(false)
        await refreshDbStatus()
        return { ok: true }
      }
      setIsLoading(false)
      return { ok: false, error: data.error || '로그인에 실패했습니다.' }
    } catch (err: any) {
      // Fallback local demo login if API is completely unavailable
      const fallbackUser = { email, name: email.split('@')[0] || '온천가족' }
      setUser(fallbackUser)
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fallbackUser))
      setIsLoading(false)
      return { ok: true }
    }
  }

  // Register handler
  const register = async (email: string, password = 'demo-password', name?: string) => {
    setIsLoading(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (customDbUrl) headers['x-neon-database-url'] = customDbUrl

      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password, name, connectionString: customDbUrl || undefined }),
      })

      const data = await res.json()
      if (data.ok && data.user) {
        setUser(data.user)
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user))
        setIsLoading(false)
        await refreshDbStatus()
        return { ok: true }
      }
      setIsLoading(false)
      return { ok: false, error: data.error || '회원가입에 실패했습니다.' }
    } catch (err: any) {
      const fallbackUser = { email, name: name || email.split('@')[0] || '신규 여행자' }
      setUser(fallbackUser)
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(fallbackUser))
      setIsLoading(false)
      return { ok: true }
    }
  }

  // Quick Demo Login
  const quickDemoLogin = async () => {
    const demoEmail = 'family@kyushu-travel.kr'
    await login(demoEmail, 'travel2026')
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY_USER)
    setLastSavedAt(null)
  }

  // Save Travel Plan to Neon DB
  const savePlan = async (plan: Omit<SavedTravelPlan, 'user_email'>) => {
    if (!user) {
      return { ok: false, error: '로그인 후 저장할 수 있습니다.' }
    }

    setIsLoading(true)
    const payload = {
      ...plan,
      userEmail: user.email,
      connectionString: customDbUrl || undefined,
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (customDbUrl) credentialsHeader(headers, customDbUrl)

      const res = await fetch('/api/auth?action=save_plan', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      // Also persist to localStorage as backup
      localStorage.setItem(STORAGE_KEY_LOCAL_PLAN, JSON.stringify(payload))
      const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      setLastSavedAt(timeStr)
      setIsLoading(false)

      return {
        ok: true,
        message: data.dbConnected
          ? 'Neon DB에 맞춤 일정이 안전하게 저장되었습니다.'
          : '로컬 세션에 일정이 임시 저장되었습니다.',
      }
    } catch (err: any) {
      // Local backup fallback
      localStorage.setItem(STORAGE_KEY_LOCAL_PLAN, JSON.stringify(payload))
      const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      setLastSavedAt(timeStr)
      setIsLoading(false)
      return { ok: true, message: '오프라인 저장소에 보관되었습니다.' }
    }
  }

  // Load Travel Plan from Neon DB
  const loadPlan = async (): Promise<SavedTravelPlan | null> => {
    if (!user) return null

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (customDbUrl) headers['x-neon-database-url'] = customDbUrl

      const res = await fetch(`/api/auth?action=get_plan&email=${encodeURIComponent(user.email)}`, {
        headers,
      })
      if (res.ok) {
        const data = await res.json()
        if (data.plan) {
          return {
            user_email: data.plan.user_email,
            region_id: data.plan.region_id,
            flight_id: data.plan.flight_id,
            transport_id: data.plan.transport_id,
            ryokan_id: data.plan.ryokan_id,
            price_plan: data.plan.price_plan,
            extra_budget: Number(data.plan.extra_budget) || 650000,
            notes: data.plan.notes,
            updated_at: data.plan.updated_at,
          }
        }
      }
    } catch {
      // ignore
    }

    // Fallback to local storage if DB query returns null
    try {
      const local = localStorage.getItem(STORAGE_KEY_LOCAL_PLAN)
      if (local) return JSON.parse(local)
    } catch {
      // ignore
    }

    return null
  }

  function credentialsHeader(headers: Record<string, string>, url: string) {
    headers['x-neon-database-url'] = url
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        dbStatus,
        isLoading,
        lastSavedAt,
        customDbUrl,
        setCustomDbUrl,
        login,
        register,
        logout,
        quickDemoLogin,
        savePlan,
        loadPlan,
        refreshDbStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

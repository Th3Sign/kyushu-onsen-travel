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
}

interface AuthContextType {
  user: UserProfile | null
  dbStatus: DbStatus
  isLoading: boolean
  lastSavedAt: string | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (email: string, password: string, name?: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  savePlan: (plan: Omit<SavedTravelPlan, 'user_email'>) => Promise<{ ok: boolean; message?: string; error?: string }>
  loadPlan: () => Promise<SavedTravelPlan | null>
  refreshDbStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY_USER = 'kyushu_travel_user'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [dbStatus, setDbStatus] = useState<DbStatus>({
    connected: false,
    provider: 'Neon Serverless Postgres',
    message: 'DB 상태 확인 중...',
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  // Check Neon DB connection status
  const refreshDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth?action=status')
      if (res.ok) {
        const data = await res.json()
        setDbStatus({
          connected: data.connected,
          provider: data.provider || 'Neon Serverless Postgres',
          message: data.connected ? 'Neon DB 정상 연결됨' : (data.error || '연결 대기중'),
        })
      } else {
        const data = await res.json().catch(() => ({}))
        setDbStatus({
          connected: false,
          provider: 'Neon Serverless Postgres',
          message: data.error || 'DB 연결 실패',
        })
      }
    } catch {
      setDbStatus({
        connected: false,
        provider: 'Neon Serverless Postgres',
        message: '서버리스 API 응답 없음',
      })
    }
  }, [])

  useEffect(() => {
    refreshDbStatus()
  }, [refreshDbStatus])

  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
      setIsLoading(false)
      return { ok: false, error: '서버 통신 실패: ' + err.message }
    }
  }

  // Register handler
  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
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
      setIsLoading(false)
      return { ok: false, error: '서버 통신 실패: ' + err.message }
    }
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
      return { ok: false, error: '로그인 후 여행 플랜을 저장할 수 있습니다.' }
    }

    setIsLoading(true)
    const payload = {
      ...plan,
      userEmail: user.email,
    }

    try {
      const res = await fetch('/api/auth?action=save_plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (data.ok) {
        const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        setLastSavedAt(timeStr)
        setIsLoading(false)
        return {
          ok: true,
          message: data.message || 'Neon DB에 맞춤 플랜이 성공적으로 저장되었습니다.',
        }
      }

      setIsLoading(false)
      return { ok: false, error: data.error || '플랜 저장에 실패했습니다.' }
    } catch (err: any) {
      setIsLoading(false)
      return { ok: false, error: '서버 통신 오류: ' + err.message }
    }
  }

  // Load Travel Plan from Neon DB
  const loadPlan = async (): Promise<SavedTravelPlan | null> => {
    if (!user) return null

    try {
      const res = await fetch(`/api/auth?action=get_plan&email=${encodeURIComponent(user.email)}`)
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

    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        dbStatus,
        isLoading,
        lastSavedAt,
        login,
        register,
        logout,
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

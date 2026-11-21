import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { RegionId, PricePlanType } from '../data/travelData'

export interface UserProfile {
  id?: number
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
  isCheckingSession: boolean
  isLoading: boolean
  lastSavedAt: string | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (email: string, password: string, name?: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  savePlan: (plan: Omit<SavedTravelPlan, 'user_email'>) => Promise<{ ok: boolean; message?: string; error?: string }>
  loadPlan: () => Promise<SavedTravelPlan | null>
  refreshDbStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY_TOKEN = 'kyushu_travel_session_token'

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_TOKEN)
  } catch {
    return null
  }
}

function setStoredToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN)
    }
  } catch {
    // ignore
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true)

  const [dbStatus, setDbStatus] = useState<DbStatus>({
    connected: false,
    provider: 'Neon Serverless Postgres',
    message: 'DB 상태 확인 중...',
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  const refreshDbStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth?action=status', { credentials: 'include' })
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

  // Verify existing Neon DB session on mount (never trust unverified localStorage user object)
  useEffect(() => {
    try {
      localStorage.removeItem('kyushu_travel_user')
    } catch {
      // ignore
    }

    let cancelled = false
    const verifySession = async () => {
      try {
        const res = await fetch('/api/auth?action=me', {
          method: 'GET',
          headers: {
            ...getAuthHeaders(),
          },
          credentials: 'include',
        })

        if (!cancelled && res.ok) {
          const data = await res.json()
          if (data.authenticated && data.user) {
            setUser(data.user)
          } else {
            setStoredToken(null)
            setUser(null)
          }
        } else if (!cancelled) {
          setStoredToken(null)
          setUser(null)
        }
      } catch {
        if (!cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false)
        }
      }
    }

    refreshDbStatus()
    verifySession()

    return () => {
      cancelled = true
    }
  }, [refreshDbStatus])

  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok && data.ok && data.user) {
        if (data.token) setStoredToken(data.token)
        setUser(data.user)
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
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()
      if (res.ok && data.ok && data.user) {
        if (data.token) setStoredToken(data.token)
        setUser(data.user)
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

  // Logout handler (clears Neon DB session & cookie)
  const logout = async () => {
    try {
      await fetch('/api/auth?action=logout', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
      })
    } catch {
      // ignore network error on logout
    } finally {
      setStoredToken(null)
      setUser(null)
      setLastSavedAt(null)
    }
  }

  // Save Travel Plan to Neon DB
  const savePlan = async (plan: Omit<SavedTravelPlan, 'user_email'>) => {
    if (!user) {
      return { ok: false, error: '로그인 후 여행 플랜을 저장할 수 있습니다.' }
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth?action=save_plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify(plan),
      })
      const data = await res.json()

      if (res.ok && data.ok) {
        const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        setLastSavedAt(timeStr)
        setIsLoading(false)
        return {
          ok: true,
          message: data.message || 'Neon DB에 맞춤 플랜이 성공적으로 저장되었습니다.',
        }
      }

      if (res.status === 401) {
        setStoredToken(null)
        setUser(null)
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
      const res = await fetch('/api/auth?action=get_plan', {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
        credentials: 'include',
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

    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        dbStatus,
        isCheckingSession,
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

import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    user,
    dbStatus,
    isLoading,
    customDbUrl,
    setCustomDbUrl,
    login,
    register,
    logout,
    quickDemoLogin,
    refreshDbStatus,
  } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showDbConfig, setShowDbConfig] = useState(false)
  const [tempDbUrl, setTempDbUrl] = useState(customDbUrl)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email) {
      setErrorMsg('이메일을 입력해주세요.')
      return
    }

    if (mode === 'login') {
      const res = await login(email, password || 'default1234')
      if (res.ok) {
        onSuccess?.()
        onClose()
      } else {
        setErrorMsg(res.error || '로그인에 실패했습니다.')
      }
    } else {
      const res = await register(email, password || 'default1234', name)
      if (res.ok) {
        onSuccess?.()
        onClose()
      } else {
        setErrorMsg(res.error || '회원가입에 실패했습니다.')
      }
    }
  }

  const handleQuickDemo = async () => {
    setErrorMsg('')
    await quickDemoLogin()
    onSuccess?.()
    onClose()
  }

  const handleSaveDbUrl = async () => {
    setCustomDbUrl(tempDbUrl.trim())
    await refreshDbStatus()
    setShowDbConfig(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#F6F3EC] border-2 border-[#191816] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#78736A] hover:text-[#191816] font-mono text-xl cursor-pointer p-1"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 border-b border-[#DFD9CE] pb-4">
          <div className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
            Member & Cloud Sync · Neon Postgres
          </div>
          <h2 className="font-serif-kr text-xl sm:text-2xl font-normal text-[#191816]">
            {user ? '회원 정보 및 클라우드 동기화' : mode === 'login' ? '로그인' : '회원가입'}
          </h2>
          <p className="text-xs text-[#5C5852] leading-relaxed">
            {user
              ? `${user.name} (${user.email}) 님으로 로그인되어 있습니다.`
              : '나만의 온천 여정(선택한 숙소·교통편·예산)을 Neon DB에 영구 저장하고 언제든 불러올 수 있습니다.'}
          </p>
        </div>

        {/* Neon Database Status Badge */}
        <div className="p-3 bg-[#EFECE4] border border-[#DFD9CE] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus.connected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'
                }`}
              />
              <span className="font-semibold text-[#191816]">Neon Serverless DB</span>
            </div>
            <span
              className={`text-[11px] px-2 py-0.5 font-medium ${
                dbStatus.connected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {dbStatus.connected ? '정상 연결됨' : '대기중 (게스트 모드)'}
            </span>
          </div>
          <p className="text-[11px] text-[#78736A] leading-tight">
            {dbStatus.connected
              ? 'Vercel / Neon 클라우드 Postgres 테이블(travel_users, travel_saved_plans)과 실시간 연동 중입니다.'
              : 'DATABASE_URL 미연결 시에도 세션 로컬 스토리지로 저장 및 불러오기가 완벽 지원됩니다.'}
          </p>

          {/* Optional Direct Neon URL Config Toggle */}
          <div className="pt-2 border-t border-[#DFD9CE]/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowDbConfig(!showDbConfig)}
              className="text-[11px] text-[#8C5A3C] hover:underline cursor-pointer flex items-center gap-1 font-medium"
            >
              <span>{showDbConfig ? '▲ 연결 주소 설정 닫기' : '▼ 내 Neon DB 연결 주소 직접 입력'}</span>
            </button>
            {customDbUrl && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5">사용자 DB 지정됨</span>
            )}
          </div>

          {showDbConfig && (
            <div className="pt-2 space-y-2 text-xs">
              <input
                type="text"
                placeholder="postgresql://neondb_owner:***@ep-***.neon.tech/neondb?sslmode=require"
                value={tempDbUrl}
                onChange={(e) => setTempDbUrl(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#DFD9CE] text-[11px] font-mono text-[#191816] focus:outline-none focus:border-[#191816]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveDbUrl}
                  className="px-3 py-1 bg-[#191816] text-[#F6F3EC] text-[11px] cursor-pointer hover:bg-black font-medium"
                >
                  연결 주소 적용
                </button>
                {customDbUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setTempDbUrl('')
                      setCustomDbUrl('')
                      refreshDbStatus()
                    }}
                    className="px-2 py-1 text-[11px] text-rose-700 hover:underline cursor-pointer"
                  >
                    초기화 (기본값)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User is already logged in */}
        {user ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-white border border-[#DFD9CE] space-y-2">
              <div className="text-xs text-[#78736A]">현재 로그인 계정</div>
              <div className="text-sm font-semibold text-[#191816]">{user.name}</div>
              <div className="text-xs font-mono text-[#5C5852]">{user.email}</div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  logout()
                  setErrorMsg('')
                }}
                className="flex-1 py-2.5 border border-[#191816] text-xs font-medium text-[#191816] hover:bg-[#EFECE4] transition cursor-pointer"
              >
                로그아웃
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#191816] text-xs font-medium text-[#F6F3EC] hover:bg-black transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 border border-[#191816] divide-x divide-[#191816]">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setErrorMsg('')
                }}
                className={`py-2 text-xs font-medium transition cursor-pointer ${
                  mode === 'login' ? 'bg-[#191816] text-[#F6F3EC]' : 'bg-[#F6F3EC] text-[#5C5852] hover:bg-[#EFECE4]'
                }`}
              >
                기존 회원 로그인
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register')
                  setErrorMsg('')
                }}
                className={`py-2 text-xs font-medium transition cursor-pointer ${
                  mode === 'register' ? 'bg-[#191816] text-[#F6F3EC]' : 'bg-[#F6F3EC] text-[#5C5852] hover:bg-[#EFECE4]'
                }`}
              >
                새 계정 만들기
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed">
                ⚠️ {errorMsg}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#5C5852]">이름 (또는 닉네임)</label>
                <input
                  type="text"
                  placeholder="예: 민서네 가족"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DFD9CE] text-xs text-[#191816] focus:outline-none focus:border-[#191816]"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#5C5852]">이메일 주소</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-[#DFD9CE] text-xs text-[#191816] focus:outline-none focus:border-[#191816]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#5C5852]">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DFD9CE] text-xs text-[#191816] focus:outline-none focus:border-[#191816]"
              />
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#191816] text-[#F6F3EC] text-xs sm:text-sm font-medium hover:bg-black transition cursor-pointer disabled:opacity-50"
            >
              {isLoading
                ? '처리 중...'
                : mode === 'login'
                ? 'Neon DB로 로그인'
                : 'Neon DB에 계정 등록하고 시작하기'}
            </button>

            {/* Quick Demo Button */}
            <div className="pt-2 border-t border-[#DFD9CE] text-center space-y-2">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2 bg-[#E8E2D5] hover:bg-[#DFD9CE] text-[#191816] text-xs font-medium transition cursor-pointer border border-[#C5BDAF]"
              >
                ✨ 체험 계정으로 1초 로그인 (데모)
              </button>
              <div className="text-[11px] text-[#78736A]">
                계정이 없어도 클릭 한 번으로 모든 저장/불러오기 기능을 바로 테스트할 수 있습니다.
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

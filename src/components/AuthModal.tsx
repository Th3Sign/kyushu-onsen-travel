import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, dbStatus, isLoading, login, register, logout } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email.trim() || !password.trim()) {
      setErrorMsg('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    if (mode === 'login') {
      const res = await login(email.trim(), password)
      if (res.ok) {
        onSuccess?.()
        onClose()
      } else {
        setErrorMsg(res.error || '로그인에 실패했습니다.')
      }
    } else {
      const res = await register(email.trim(), password, name.trim())
      if (res.ok) {
        onSuccess?.()
        onClose()
      } else {
        setErrorMsg(res.error || '회원가입에 실패했습니다.')
      }
    }
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
            {user ? '회원 정보' : mode === 'login' ? '로그인' : '회원가입'}
          </h2>
          <p className="text-xs text-[#5C5852] leading-relaxed">
            {user
              ? `${user.name} (${user.email}) 님으로 로그인되어 있습니다.`
              : '로그인 후 선택한 맞춤 여정(숙소·교통편·예산)을 Neon DB에 안전하게 보관할 수 있습니다.'}
          </p>
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
                새 계정 회원가입
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs leading-relaxed">
                ⚠️ {errorMsg}
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#5C5852]">이름 (또는 가족 닉네임)</label>
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
                required
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
                ? 'Neon DB 통신 중...'
                : mode === 'login'
                ? 'Neon DB로 로그인'
                : 'Neon DB에 계정 등록하기'}
            </button>
          </form>
        )}

        {/* Clean Neon Database Status Indicator */}
        <div className="pt-3 border-t border-[#DFD9CE] flex items-center justify-between text-[11px] text-[#78736A]">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                dbStatus.connected ? 'bg-emerald-600 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="font-medium text-[#191816]">Neon Serverless Postgres</span>
          </div>
          <span className={dbStatus.connected ? 'text-emerald-700' : 'text-rose-600'}>
            {dbStatus.connected ? '데이터베이스 정상 연결됨' : '연결 확인 필요'}
          </span>
        </div>
      </div>
    </div>
  )
}

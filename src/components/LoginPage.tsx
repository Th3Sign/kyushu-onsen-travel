import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { HeroOnsenShader } from './ShaderBackgrounds'

interface LoginPageProps {
  onLoginSuccess?: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { dbStatus, isLoading, login, register } = useAuth()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

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
        onLoginSuccess?.()
      } else {
        setErrorMsg(res.error || '로그인에 실패했습니다.')
      }
    } else {
      const res = await register(email.trim(), password, name.trim())
      if (res.ok) {
        onLoginSuccess?.()
      } else {
        setErrorMsg(res.error || '회원가입에 실패했습니다.')
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-[#111110] text-[#F6F3EC] flex flex-col justify-between overflow-hidden">
      {/* Background WebGPU Ambient Shader */}
      <HeroOnsenShader mood="hinoki-wgsl" speedMultiplier={0.7} interactiveTrail={false} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85 pointer-events-none" />

      {/* Top Masthead */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between border-b border-white/15 pb-4">
        <div className="flex items-baseline gap-3">
          <span className="font-editorial text-lg sm:text-xl tracking-[0.2em] uppercase text-white">
            KYUSHU ONSEN JOURNAL
          </span>
          <span className="text-[11px] sm:text-xs tracking-widest uppercase text-white/60">
            No. 2026 — Winter
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              dbStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
            }`}
          />
          <span className="text-white/70 hidden sm:inline">Neon Serverless DB</span>
          <span className="text-[11px] text-[#E5C89B]">
            {dbStatus.connected ? '정상 연결' : '연결 확인 필요'}
          </span>
        </div>
      </header>

      {/* Center Auth Card & Welcome Intro */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-10 py-10 sm:py-16 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Left Editorial Overview */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="inline-block px-3 py-1 bg-[#E5C89B]/15 text-[#E5C89B] border border-[#E5C89B]/30 text-xs tracking-[0.15em] uppercase font-medium">
            Private Access · 회원 전용 열람
          </div>
          <h1 className="font-serif-kr text-2xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
            열세 달 아기와 어른 셋이 떠나는
            <br />
            <span className="text-[#E5C89B]">규슈 온천 여정 노트</span>
          </h1>
          <p className="text-xs sm:text-base text-white/75 font-light leading-relaxed max-w-lg">
            크리스마스 인파 전 12월 셋째 주, 짧은 비행과 온천 수질, 침대 낙상 방지 화양실, 
            그리고 렌터카·점보택시·신칸센 실시간 경로까지.
            로그인하시면 맞춤 여정 설계와 Neon DB 플랜 저장 기능을 이용하실 수 있습니다.
          </p>

          <div className="pt-2 grid grid-cols-3 gap-3 border-t border-white/15 text-xs text-white/70">
            <div>
              <div className="font-editorial text-[#E5C89B] text-base">01. 3 Regions</div>
              <div className="text-[11px] text-white/50 mt-0.5">벳푸 · 우레시노 · 유후인</div>
            </div>
            <div>
              <div className="font-editorial text-[#E5C89B] text-base">02. Routes</div>
              <div className="text-[11px] text-white/50 mt-0.5">교통수단별 실시간 동선</div>
            </div>
            <div>
              <div className="font-editorial text-[#E5C89B] text-base">03. Folio</div>
              <div className="text-[11px] text-white/50 mt-0.5">Neon DB 맞춤 플랜 저장</div>
            </div>
          </div>
        </div>

        {/* Right Auth Box */}
        <div className="lg:col-span-5 bg-[#F6F3EC] text-[#191816] p-6 sm:p-8 shadow-2xl border-2 border-[#191816] space-y-6">
          {/* Mode Tabs */}
          <div className="space-y-2 border-b border-[#DFD9CE] pb-4">
            <div className="grid grid-cols-2 border border-[#191816] divide-x divide-[#191816]">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setErrorMsg('')
                }}
                className={`py-2 text-xs font-semibold transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#191816] text-[#F6F3EC]'
                    : 'bg-[#F6F3EC] text-[#78736A] hover:bg-[#EFECE4]'
                }`}
              >
                회원 로그인
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register')
                  setErrorMsg('')
                }}
                className={`py-2 text-xs font-semibold transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#191816] text-[#F6F3EC]'
                    : 'bg-[#F6F3EC] text-[#78736A] hover:bg-[#EFECE4]'
                }`}
              >
                새 계정 가입
              </button>
            </div>
            <p className="text-[11px] text-[#5C5852] text-center pt-1">
              {mode === 'login'
                ? '등록된 이메일 계정으로 로그인하여 여정 노트를 확인하세요.'
                : '간단한 가입 후 나만의 맞춤 온천 여행 플랜을 생성하세요.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#5C5852]">이름 (또는 가족 닉네임)</label>
                <input
                  type="text"
                  placeholder="예: 민서네 가족"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#DFD9CE] text-xs text-[#191816] focus:outline-none focus:border-[#191816]"
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
                className="w-full px-3 py-2.5 bg-white border border-[#DFD9CE] text-xs text-[#191816] focus:outline-none focus:border-[#191816]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#5C5852]">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-white border border-[#DFD9CE] text-xs text-[#191816] focus:outline-none focus:border-[#191816]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#191816] text-[#F6F3EC] text-xs sm:text-sm font-semibold hover:bg-black transition cursor-pointer disabled:opacity-50 shadow-md"
            >
              {isLoading
                ? 'Neon DB 확인 중...'
                : mode === 'login'
                ? '로그인하고 여정 열람하기 →'
                : '회원가입 완료하고 시작하기 →'}
            </button>
          </form>

          {/* Neon DB Notice */}
          <div className="pt-2 border-t border-[#DFD9CE] flex items-center justify-between text-[11px] text-[#78736A]">
            <span>Database: Neon Serverless Postgres</span>
            <span className={dbStatus.connected ? 'text-emerald-700 font-medium' : 'text-rose-600'}>
              {dbStatus.connected ? '● 정상 작동 중' : '○ 연결 확인 필요'}
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/15 py-4 text-center text-xs text-white/50">
        © 2026 Kyushu Onsen Travel Journal · Powered by Neon Serverless Postgres
      </footer>
    </div>
  )
}

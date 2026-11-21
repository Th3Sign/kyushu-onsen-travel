import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold tracking-wide">
              TRAVEL PASS
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900">
              오이타 · 유후인 · 벳푸 가족 여행 대시보드
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span
              className={`w-2 h-2 rounded-full ${
                dbStatus.connected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span className="text-slate-600 hidden sm:inline">Neon DB:</span>
            <span className={dbStatus.connected ? 'text-emerald-700 font-semibold' : 'text-rose-600'}>
              {dbStatus.connected ? '연결 완료' : '연결 확인 중'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-8 py-10 sm:py-16 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center my-auto">
        {/* Left Trip Summary */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs sm:text-sm font-semibold">
            <span>🔒 Neon DB 회원 전용 · 로그인 후 확정 여행 일정 열람</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-snug">
              13개월 아기와 어른 셋이 떠나는
              <br />
              <span className="text-blue-600">유후인 · 벳푸 3박 4일 확정 여정</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              아기 식사·수면 루틴(08:00 · 13:00 · 18:00 · 20:00 취침)에 맞춘 분 단위 타임라인,
              유후인 산스이칸(1박) & 온야도 노노 벳푸(2박) 동선, 검증된 맛집과 시간표를 한눈에 확인하세요.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-semibold text-blue-600">확정 항공 (12/21–24)</div>
              <div className="text-sm font-bold text-slate-900">제주항공 오이타 직항</div>
              <div className="text-xs text-slate-500">10:50 출국 · 13:55 귀국</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-semibold text-emerald-600">확정 숙소 3박</div>
              <div className="text-sm font-bold text-slate-900">산스이칸 · 온야도 노노</div>
              <div className="text-xs text-slate-500">1박 조·석식 / 2박 조식 포함</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-xs font-semibold text-amber-600">13개월 아기 루틴</div>
              <div className="text-sm font-bold text-slate-900">08 · 13 · 18시 식사</div>
              <div className="text-xs text-slate-500">20:00 정시 취침 맞춤</div>
            </div>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
          <div className="space-y-3">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setErrorMsg('')
                }}
                className={`py-2.5 text-sm font-bold rounded-lg transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register')
                  setErrorMsg('')
                }}
                className={`py-2.5 text-sm font-bold rounded-lg transition cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                새 계정 등록
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 text-center">
              {mode === 'login'
                ? '등록된 이메일과 비밀번호로 로그인하세요.'
                : '가족 공유용 이메일 계정을 등록하고 일정을 확인하세요.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                  이름 (또는 가족 닉네임)
                </label>
                <input
                  type="text"
                  placeholder="예: 우리 가족"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                이메일 주소
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm sm:text-base font-bold transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isLoading
                ? 'Neon DB 확인 중...'
                : mode === 'login'
                ? '로그인하고 여행 일정 보기'
                : '계정 등록하고 시작하기'}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>인증 서버: Neon Serverless Postgres</span>
            <span className={dbStatus.connected ? 'text-emerald-600 font-semibold' : 'text-rose-600'}>
              {dbStatus.connected ? '● 세션 보호 활성' : '○ 연결 대기'}
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        2026. 12. 21 (월) – 12. 24 (목) 규슈 유후인·벳푸 가족 여행 패스
      </footer>
    </div>
  )
}

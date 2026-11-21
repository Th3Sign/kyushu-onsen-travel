import React, { useState, useMemo, useEffect } from 'react'
import {
  REGION_PLANS,
  CONFIRMED_FLIGHT,
  YUFUIN_RYOKANS,
  BEPPU_RYOKANS,
  CONFIRMED_TRANSIT_COST,
  BABY_CHECKLIST,
  OTA_BOOKING_GUIDE,
  MEAL_AND_BABY_SCHEDULE,
  RyokanOption,
} from './data/travelData'
import { DynamicRouteMap } from './components/DynamicRouteMap'
import { DayRouteVisualizer } from './components/DayRouteVisualizer'
import { LoginPage } from './components/LoginPage'
import { useAuth, SavedTravelPlan } from './context/AuthContext'

type MainTabId = 'schedule' | 'meals' | 'transit' | 'stays-folio'

export function App() {
  const { user, isCheckingSession } = useAuth()

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center gap-3 px-4">
        <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-700">
          Neon DB 로그인 세션 확인 중...
        </p>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <TravelJournal />
}

function TravelJournal() {
  const { user, dbStatus, savePlan, loadPlan, lastSavedAt, isLoading: isAuthLoading, logout } = useAuth()
  const [saveStatusMsg, setSaveStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [pendingSavedPlan, setPendingSavedPlan] = useState<SavedTravelPlan | null>(null)

  const [mainTab, setMainTab] = useState<MainTabId>('schedule')
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>(1)
  const [showRouteMap, setShowRouteMap] = useState<boolean>(true)

  const [selectedYufuinRyokanId, setSelectedYufuinRyokanId] = useState<string>('yufuin-sansuikan')
  const [selectedBeppuRyokanId, setSelectedBeppuRyokanId] = useState<string>('beppu-onyado-nono')
  const [extraFoodAndTicketKRW, setExtraFoodAndTicketKRW] = useState<number>(650000)

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'quarantine-meat': true,
    'transit-limousine-train': true,
    'stay-onsen-luggage-flow': true,
    'onsen-temp': true,
  })

  const currentRegion = REGION_PLANS[0]

  useEffect(() => {
    if (user) {
      loadPlan().then((plan) => {
        if (plan) {
          setPendingSavedPlan(plan)
        }
      })
    } else {
      setPendingSavedPlan(null)
    }
  }, [user])

  const applySavedPlan = (plan: SavedTravelPlan) => {
    if (plan.ryokan_id) {
      if (plan.ryokan_id.includes('|')) {
        const [yId, bId] = plan.ryokan_id.split('|')
        if (yId && YUFUIN_RYOKANS.some((r) => r.id === yId)) setSelectedYufuinRyokanId(yId)
        if (bId && BEPPU_RYOKANS.some((r) => r.id === bId)) setSelectedBeppuRyokanId(bId)
      } else if (BEPPU_RYOKANS.some((r) => r.id === plan.ryokan_id)) {
        setSelectedBeppuRyokanId(plan.ryokan_id)
      } else if (YUFUIN_RYOKANS.some((r) => r.id === plan.ryokan_id)) {
        setSelectedYufuinRyokanId(plan.ryokan_id)
      }
    }
    if (plan.extra_budget) setExtraFoodAndTicketKRW(plan.extra_budget)
    setPendingSavedPlan(null)
    setSaveStatusMsg({ text: '저장된 확정 플랜 설정을 불러왔습니다.', type: 'success' })
    setTimeout(() => setSaveStatusMsg(null), 4500)
  }

  const handleSaveCurrentPlan = async () => {
    if (!user) return

    const res = await savePlan({
      region_id: 'beppu-yufuin',
      flight_id: CONFIRMED_FLIGHT.id,
      transport_id: 'oit-limousine-express-train',
      ryokan_id: `${selectedYufuinRyokanId}|${selectedBeppuRyokanId}`,
      price_plan: 'ota-halfboard',
      extra_budget: extraFoodAndTicketKRW,
      notes: `오이타 직항 확정: 유후인 1박(${selectedYufuinRyokan.name}) + 벳푸 2박(${selectedBeppuRyokan.name})`,
    })

    if (res.ok) {
      setSaveStatusMsg({ text: res.message || 'Neon DB에 확정 플랜이 저장되었습니다.', type: 'success' })
    } else {
      setSaveStatusMsg({ text: res.error || '저장에 실패했습니다.', type: 'error' })
    }
    setTimeout(() => setSaveStatusMsg(null), 5000)
  }

  const selectedYufuinRyokan = useMemo(
    () => YUFUIN_RYOKANS.find((r) => r.id === selectedYufuinRyokanId) ?? YUFUIN_RYOKANS[0],
    [selectedYufuinRyokanId]
  )

  const selectedBeppuRyokan = useMemo(
    () => BEPPU_RYOKANS.find((r) => r.id === selectedBeppuRyokanId) ?? BEPPU_RYOKANS[0],
    [selectedBeppuRyokanId]
  )

  const yufuin1NightKRW = selectedYufuinRyokan.otaHalfBoardKRW
  const yufuin1NightJPY = selectedYufuinRyokan.otaHalfBoardJPY
  const beppu1NightKRW = selectedBeppuRyokan.otaBreakfastKRW
  const beppu1NightJPY = selectedBeppuRyokan.otaBreakfastJPY
  const beppu2NightsKRW = beppu1NightKRW * 2

  const totalStay3NightsKRW = yufuin1NightKRW + beppu2NightsKRW

  const totalBudgetKRW =
    CONFIRMED_FLIGHT.total3Adults1InfantKRW +
    totalStay3NightsKRW +
    CONFIRMED_TRANSIT_COST.totalKRW +
    extraFoodAndTicketKRW
  const perAdultKRW = Math.round(totalBudgetKRW / 3)

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const completedChecklistCount = BABY_CHECKLIST.filter((i) => !!checkedItems[i.id]).length

  if (!user) {
    return null
  }

  const renderRyokanCard = (
    r: RyokanOption,
    active: boolean,
    onSelect: () => void,
    stayLabel: string,
    nightsCount: number
  ) => {
    const isYufuin = r.stayZone === 'yufuin-1n'
    const currentNightKRW = isYufuin ? r.otaHalfBoardKRW : r.otaBreakfastKRW
    const currentNightJPY = isYufuin ? r.otaHalfBoardJPY : r.otaBreakfastJPY
    const stayPlanLabel = isYufuin ? '석식+조식 2식 포함' : '조식 포함 (석식 자유)'
    const totalZoneKRW = currentNightKRW * nightsCount

    const googleMapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      r.enSearchQuery + ' ' + r.jpName
    )}`

    return (
      <div
        key={r.id}
        onClick={onSelect}
        className={`rounded-2xl border bg-white shadow-xs transition flex flex-col justify-between overflow-hidden ${
          active ? 'border-blue-600 ring-2 ring-blue-600/15' : 'border-slate-200'
        }`}
      >
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold">
              {stayLabel}
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-semibold">{r.jpName}</span>
          </div>

          {r.planPriorityBadge && (
            <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-800">
              {r.planPriorityBadge}
            </div>
          )}

          <div>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900">{r.name}</h4>
            <p className="text-xs sm:text-sm text-blue-700 font-semibold mt-1">{r.tag}</p>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-blue-700 font-bold block text-xs sm:text-sm mb-0.5">
                🚉 역 · 리무진 접근성
              </span>
              <span className="font-medium text-slate-900">{r.stationAccess}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block">객실 구성 (성인 3인 + 13개월 아기)</span>
              <span className="font-semibold text-slate-900">{r.roomType}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block">온천 설비</span>
              <span className="font-semibold text-slate-900">{r.bathType}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block">신청 식사 조건</span>
              <span className="font-semibold text-emerald-700">{r.mealType}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 block">13개월 유아 요금 정책</span>
              <span className="font-semibold text-slate-900">{r.babyFeeNote}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3.5 space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="font-bold text-slate-900">💡 아기 & 가족 이용 핵심 포인트</div>
            {r.babyPerks.map((perk, idx) => (
              <p key={idx} className="leading-relaxed">
                • {perk}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 pt-4 border-t border-slate-200 space-y-4 bg-slate-50">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block">
                {nightsCount}박 합계 ({stayPlanLabel})
              </span>
              <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-0.5">
                {totalZoneKRW.toLocaleString()}원{' '}
                <span className="text-xs sm:text-sm font-medium text-slate-500">
                  (1박 ¥{currentNightJPY.toLocaleString()})
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
              예약 확정 ✅
            </span>
          </div>

          <div
            className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {r.officialUrl && (
              <a
                href={r.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl text-center bg-slate-900 text-white hover:bg-slate-800 transition font-bold"
              >
                공식 홈페이지 ↗
              </a>
            )}
            <a
              href={googleMapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${
                r.officialUrl ? '' : 'col-span-2'
              } py-2.5 px-3 rounded-xl text-center border border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition font-bold`}
            >
              Google 지도 위치 ↗
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 sm:pb-16">
      {/* =================================================================
          TOP BAR & COMPACT TRAVEL PASS HEADER
         ================================================================= */}
      <header className="bg-white border-b border-slate-200">
        {/* Top Utility Strip */}
        <div className="border-b border-slate-100 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-xs">
                확정 여정 패스
              </span>
              <span className="font-semibold text-slate-200">
                2026. 12. 21 (월) – 12. 24 (목) · 3박 4일
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="flex items-center gap-1.5 text-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <strong>{user.name}</strong> 님
              </span>
              <button
                onClick={handleSaveCurrentPlan}
                disabled={isAuthLoading}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer transition"
              >
                💾 {lastSavedAt ? `저장됨 (${lastSavedAt})` : 'DB 저장'}
              </button>
              <button
                onClick={logout}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium cursor-pointer transition"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {saveStatusMsg && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-3">
            <div
              className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between border ${
                saveStatusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              <span>{saveStatusMsg.text}</span>
              <button
                onClick={() => setSaveStatusMsg(null)}
                className="text-slate-500 hover:text-slate-900 font-bold ml-4 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {pendingSavedPlan && (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-3">
            <div className="px-4 py-3 rounded-xl bg-blue-50 text-slate-900 border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div>
                <strong className="text-blue-800">💡 이전 저장 플랜 발견:</strong>{' '}
                <span>Neon DB에 저장된 예산 설정이 있습니다.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => applySavedPlan(pendingSavedPlan)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer text-xs"
                >
                  불러오기
                </button>
                <button
                  onClick={() => setPendingSavedPlan(null)}
                  className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Summary Pass Header */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-blue-600">
                <span>✈️ 제주항공 오이타 직항</span>
                <span>·</span>
                <span>🏨 유후인 산스이칸 1박(석식+조식)</span>
                <span>·</span>
                <span>🏨 온야도 노노 벳푸 2박(조식)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
                오이타 ➔ 유후인(1박) ➔ 벳푸(2박) 가족 여정표
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
                성인 3인 · 13개월 아기 루틴(<strong className="text-slate-900">08:00 아침 · 13:00 점심 · 18:00 저녁 · 20:00 취침</strong>)에 맞춰 가볍고 편안하게 재설계한 타임라인과 맛집·교통 가이드입니다.
              </p>
            </div>

            {/* Quick Routine Pill Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 sm:p-4 shrink-0">
              <div className="text-xs font-bold text-amber-800 mb-1.5">
                🍼 13개월 아기 고정 루틴 (전 일정 기준)
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white px-2.5 py-1.5 rounded-xl border border-amber-200/80">
                  <div className="text-[11px] text-slate-500 font-medium">아침</div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">08:00</div>
                </div>
                <div className="bg-white px-2.5 py-1.5 rounded-xl border border-amber-200/80">
                  <div className="text-[11px] text-slate-500 font-medium">점심</div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">13:00</div>
                </div>
                <div className="bg-white px-2.5 py-1.5 rounded-xl border border-amber-200/80">
                  <div className="text-[11px] text-slate-500 font-medium">저녁</div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">18:00</div>
                </div>
                <div className="bg-slate-900 px-2.5 py-1.5 rounded-xl text-white">
                  <div className="text-[11px] text-amber-300 font-medium">밤잠</div>
                  <div className="text-xs sm:text-sm font-extrabold font-mono">20:00</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Card Summary Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">출국 · 귀국 직항</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                10:50 출국 / 13:55 귀국
              </div>
              <div className="text-xs text-blue-600 font-medium mt-0.5">제주항공 7C1512 · 7C1511</div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">Day 1 숙소 (12/21 월)</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                유후인 산스이칸 (1박)
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                석식(18:00) + 조식(08:00) 포함
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">Day 2–3 숙소 (12/22–24)</div>
              <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                온야도 노노 벳푸 (2박)
              </div>
              <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                조식(08:00) 포함 · 전세탕 7곳
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
              <div className="text-xs font-semibold text-blue-700">총 예상 비용 (성인3+유아1)</div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 tabular-nums mt-0.5">
                {totalBudgetKRW.toLocaleString()}원
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                성인 1인당 약 {Math.round(perAdultKRW / 10000)}만 원
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================================
          STICKY 4-TAB WORKBENCH NAVIGATION
         ================================================================= */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {(
              [
                { id: 'schedule', label: '📅 일자별 일정 & 지도' },
                { id: 'meals', label: '🍽️ 식사 · 맛집 · 아기 루틴' },
                { id: 'transit', label: '🚌 항공 · 교통 시간표' },
                { id: 'stays-folio', label: '🏨 숙소 · 예산 · 체크리스트' },
              ] as { id: MainTabId; label: string }[]
            ).map((tab) => {
              const active = mainTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setMainTab(tab.id)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* =================================================================
          MAIN WORKBENCH CONTENT
         ================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8">
        {/* ---------------------------------------------------------------
            TAB 1: DAY-BY-DAY SCHEDULE & INTERACTIVE ROUTE MAP
           --------------------------------------------------------------- */}
        {mainTab === 'schedule' && (
          <section className="space-y-6">
            {/* Day Selector Bar + Map Toggle */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    일자별 상세 타임라인
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    원하는 날짜를 선택해 하루 일정을 크고 선명하게 확인하세요.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRouteMap((prev) => !prev)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer self-start sm:self-auto ${
                    showRouteMap
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {showRouteMap ? '🗺️ 지도 접기' : '🗺️ 지도 펼치기'}
                </button>
              </div>

              {/* Day Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {currentRegion.days.map((d) => {
                  const active = activeDayFilter === d.day
                  return (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => setActiveDayFilter(d.day)}
                      className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Day 0{d.day}</span>
                        <span className={active ? 'text-blue-100' : 'text-slate-500'}>
                          {d.date}
                        </span>
                      </div>
                      <div
                        className={`text-xs sm:text-sm font-bold truncate mt-1 ${
                          active ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {d.stayBadge}
                      </div>
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setActiveDayFilter('all')}
                  className={`p-3 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    activeDayFilter === 'all'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">전체 4일 보기</div>
                  <div className="text-xs sm:text-sm font-bold mt-1">Day 1 ~ 4 연속</div>
                </button>
              </div>
            </div>

            {/* Collapsible Interactive Map */}
            {showRouteMap && (
              <DayRouteVisualizer
                activeDayFilter={activeDayFilter}
                onSelectDay={setActiveDayFilter}
                selectedYufuinRyokan={selectedYufuinRyokan}
                selectedBeppuRyokan={selectedBeppuRyokan}
              />
            )}

            {/* Day Schedule Cards */}
            <div className="space-y-8">
              {currentRegion.days
                .filter((d) => activeDayFilter === 'all' || d.day === activeDayFilter)
                .map((dayPlan) => {
                  const dayMeal = MEAL_AND_BABY_SCHEDULE.find((m) => m.day === dayPlan.day)

                  return (
                    <div
                      key={dayPlan.day}
                      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                    >
                      {/* Day Header Banner */}
                      <div className="bg-slate-900 text-white p-5 sm:p-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-extrabold">
                              Day 0{dayPlan.day}
                            </span>
                            <span className="text-sm sm:text-base font-bold text-slate-200">
                              {dayPlan.date}
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-white/15 text-amber-300 text-xs font-bold">
                              {dayPlan.stayBadge}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-slate-300 font-medium">
                            ⏱ 일일 대중교통·택시 탑승: 총 {dayPlan.totalTransitMinutes}분
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-snug">
                          {dayPlan.theme}
                        </h3>

                        <div className="text-xs sm:text-sm text-slate-300 bg-white/10 px-3.5 py-2.5 rounded-xl">
                          📍 <strong>동선 흐름:</strong> {dayPlan.routeSummary}
                        </div>
                      </div>

                      {/* Today's 3-Meal & Baby Bedtime Quick Strip */}
                      {dayMeal && (
                        <div className="bg-amber-50/70 border-b border-slate-200 p-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
                          <div className="bg-white p-3 rounded-xl border border-amber-200/80">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>🍼 조식 08:00</span>
                              {dayMeal.breakfast.included && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  숙소포함
                                </span>
                              )}
                            </div>
                            <div className="font-semibold text-slate-800 mt-1">
                              {dayMeal.breakfast.place}
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-amber-200/80">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>🍚 중식 13:00</span>
                              <span className="text-[11px] text-amber-800 font-semibold">
                                {dayMeal.lunch.time}
                              </span>
                            </div>
                            <div className="font-semibold text-blue-700 mt-1">
                              {dayMeal.lunch.primary}
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-amber-200/80">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>🍽️ 석식 18:00</span>
                              {dayMeal.dinner.included ? (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  숙소포함
                                </span>
                              ) : (
                                <span className="text-[11px] text-blue-700 font-semibold">
                                  외식 추천
                                </span>
                              )}
                            </div>
                            <div className="font-semibold text-slate-800 mt-1">
                              {dayMeal.dinner.primary}
                            </div>
                          </div>

                          <div className="bg-slate-900 text-white p-3 rounded-xl">
                            <div className="font-bold text-amber-300">😴 20:00 아기 취침 후</div>
                            <div className="text-xs text-slate-200 mt-1 leading-snug">
                              {dayMeal.bedtimeAndAdultTime}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Timeline Items */}
                      <div className="p-5 sm:p-7 divide-y divide-slate-200 space-y-6">
                        {dayPlan.items.map((item, idx) => (
                          <article
                            key={idx}
                            className={`${idx > 0 ? 'pt-6' : ''} space-y-3.5`}
                          >
                            {/* Time & Meta Row */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-sm sm:text-base font-extrabold text-white bg-blue-600 px-3 py-1 rounded-lg">
                                  {item.time}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                  📍 {item.place}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">
                                  유모차: {item.strollerFriendly}
                                </span>
                                {item.costKRW && (
                                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                                    {item.costKRW}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Title & Description */}
                            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                              {item.title}
                            </h4>

                            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                              {item.desc}
                            </p>

                            {/* Timetable & Luggage Info */}
                            {(item.timetableNote || item.luggageNote) && (
                              <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                                {item.timetableNote && (
                                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                                    <span className="font-bold text-blue-800 block mb-1">
                                      🕒 시간표 · 추천 식당 메모
                                    </span>
                                    <span className="text-slate-800 font-medium leading-relaxed">
                                      {item.timetableNote}
                                    </span>
                                  </div>
                                )}
                                {item.luggageNote && (
                                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                                    <span className="font-bold text-emerald-800 block mb-1">
                                      🧳 캐리어 3개 · 유모차 상태
                                    </span>
                                    <span className="text-slate-800 font-medium leading-relaxed">
                                      {item.luggageNote}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Baby & Adult Tips */}
                            <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm leading-relaxed">
                              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
                                <div className="font-bold text-amber-900 mb-1">
                                  👶 13개월 아기 케어 팁
                                </div>
                                <p className="text-slate-800">{item.babyTip}</p>
                              </div>

                              {item.adultTip && (
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                  <div className="font-bold text-slate-900 mb-1">
                                    👨‍👩‍👧 어른 3인 분담 & 힐링 포인트
                                  </div>
                                  <p className="text-slate-700">{item.adultTip}</p>
                                </div>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )
                })}
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------
            TAB 2: MEAL & BABY ROUTINE MASTER TABLE
           --------------------------------------------------------------- */}
        {mainTab === 'meals' && (
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Baby Routine & Verified Restaurant Guide
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                    🍼 아기 식사·수면 루틴(08·13·18·20시) & 4일 조·중·석식 맛집 총정리
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    산스이칸(석식+조식 포함)과 온야도 노노(조식만 포함) 조건에 맞춰 영업시간·휴무일까지 검증된 식당표입니다.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold">
                  12/21(월) ~ 12/24(목) 요일별 영업 확인 완료
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {MEAL_AND_BABY_SCHEDULE.map((m) => (
                  <div
                    key={m.day}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <span className="text-base sm:text-lg font-extrabold text-slate-900">
                        {m.dateLabel}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
                        {m.stayInfo}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm leading-relaxed">
                      {/* Breakfast */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white font-mono text-xs font-bold">
                            조식 08:00
                          </span>
                          {m.breakfast.included && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              숙소 포함 ✅
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 pt-1">{m.breakfast.place}</div>
                        <p className="text-xs sm:text-sm text-slate-600">{m.breakfast.note}</p>
                      </div>

                      {/* Lunch */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white font-mono text-xs font-bold">
                            중식 13:00
                          </span>
                          <span className="text-xs font-semibold text-amber-800">
                            {m.lunch.time}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 pt-1">
                          1순위: {m.lunch.primary}
                        </div>
                        <div className="text-xs font-semibold text-blue-700">
                          대안: {m.lunch.backup}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 pt-0.5">{m.lunch.babyNote}</p>
                      </div>

                      {/* Dinner */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-xs font-bold">
                            석식 18:00
                          </span>
                          {m.dinner.included ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              숙소 포함 ✅
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-blue-700">
                              벳푸역 인근 외식
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 pt-1">
                          1순위: {m.dinner.primary}
                        </div>
                        {!m.dinner.included && (
                          <div className="text-xs font-semibold text-blue-700">
                            대안: {m.dinner.backup}
                          </div>
                        )}
                        <p className="text-xs sm:text-sm text-slate-600 pt-0.5">{m.dinner.babyNote}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950">
                      <strong>😴 20:00 아기 취침 후:</strong> {m.bedtimeAndAdultTime}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------
            TAB 3: FLIGHT & TRANSIT TIMETABLE GUIDE
           --------------------------------------------------------------- */}
        {mainTab === 'transit' && (
          <section className="space-y-6">
            {/* Confirmed Flight Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                    항공권 확정 완료 ✅
                  </span>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                    제주항공 (Jeju Air) · 인천(T1) ↔ 오이타(OIT) 직항
                  </h2>
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-700">
                  성인 3인 + 13개월 유아 1인 (유모차 도어투도어 무료 위탁)
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-blue-700">
                    <span>🛫 출국편 · 2026. 12. 21 (월)</span>
                    <span className="font-mono bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                      편명: {CONFIRMED_FLIGHT.outboundFlight}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
                    10:50 인천(T1) 출발 ➔ 12:45 오이타 도착
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    • 08:00 아기 아침 식사 후 08:30 인천공항 T1 도착 · 교통약자 우대 출국통로 이용
                    <br />• 12:45 착륙 후 입국 15분 컷 ➔ 공항에서 아기 13:00 점심 후 <strong>13:25 유후인행 리무진 탑승</strong>
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-blue-700">
                    <span>🛬 귀국편 · 2026. 12. 24 (목)</span>
                    <span className="font-mono bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                      편명: {CONFIRMED_FLIGHT.inboundFlight}
                    </span>
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">
                    13:55 오이타 출발 ➔ 15:50 인천(T1) 도착
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    • 10:05경 벳푸역 앞([B]노선, 도보 1분) 또는 10:20 키타하마(전 노선) 에어라이너 탑승 ➔ 11:03~11:10 공항 도착
                    <br />• 공항 국내선 3층 「나나세」 중식(12:10) & 2층 수유실(아기 13:00 점심) · 1층 무료 족욕탕 후 출국
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                  <strong className="block mb-1 text-emerald-800">🧳 수하물 & 유모차 규정</strong>
                  {CONFIRMED_FLIGHT.baggageRule}
                </div>
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950">
                  <strong className="block mb-1 text-amber-900">👶 공항 & 기내 아기 케어 핵심</strong>
                  유아 별도 위탁수하물(10kg)은 없으므로 아기 기저귀·여벌옷은 성인 캐리어 3개(총 45kg)에 나누어 담으세요.
                </div>
              </div>
            </div>

            {/* 4-Stage Transit Master Guide */}
            <DynamicRouteMap />
          </section>
        )}

        {/* ---------------------------------------------------------------
            TAB 4: CONFIRMED STAYS, BUDGET FOLIO & CHECKLIST
           --------------------------------------------------------------- */}
        {mainTab === 'stays-folio' && (
          <section className="space-y-8">
            {/* Confirmed 2 Stays Cards */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Confirmed Stays Master Guide
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                  🏨 확정 숙소 2곳 상세 가이드 — 유후인 산스이칸(1박) & 온야도 노노 벳푸(2박)
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {YUFUIN_RYOKANS.map((r) =>
                  renderRyokanCard(
                    r,
                    r.id === selectedYufuinRyokanId,
                    () => setSelectedYufuinRyokanId(r.id),
                    'Day 1 · 유후인 1박 확정',
                    1
                  )
                )}
                {BEPPU_RYOKANS.map((r) =>
                  renderRyokanCard(
                    r,
                    r.id === selectedBeppuRyokanId,
                    () => setSelectedBeppuRyokanId(r.id),
                    'Day 2–3 · 벳푸 2박 연박 확정',
                    2
                  )
                )}
              </div>
            </div>

            {/* 3 Playbook Tips */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 border-b border-slate-200 pb-3">
                💡 유후인 산스이칸 · 온야도 노노 벳푸 200% 활용 실전 팁
              </h3>
              <div className="grid md:grid-cols-3 gap-5">
                {OTA_BOOKING_GUIDE.map((tip) => (
                  <div key={tip.step} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold">
                      Tip {tip.step}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug pt-1">
                      {tip.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist + Budget Folio */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left 7 Cols: Checklist & Transit Breakdown */}
              <div className="lg:col-span-7 space-y-6">
                {/* Checklist */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        ✅ 출국 전 필수 체크리스트
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500">
                        항목을 클릭해 준비 상태를 체크하세요.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm">
                      완료 {completedChecklistCount} / {BABY_CHECKLIST.length}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200">
                    {BABY_CHECKLIST.map((item) => {
                      const checked = !!checkedItems[item.id]
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          className="py-4 flex items-start gap-3.5 cursor-pointer group"
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border transition ${
                              checked
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-transparent border-slate-300 group-hover:border-blue-500'
                            }`}
                          >
                            ✓
                          </span>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-slate-500">
                                {item.category}
                              </span>
                              {item.critical && (
                                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                                  필수 확인
                                </span>
                              )}
                            </div>
                            <h4
                              className={`text-sm sm:text-base font-bold ${
                                checked ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                            >
                              {item.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Transit Cost Table */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      🚌 리무진 · JR 특급열차 · 벳푸 택시 실비 내역
                    </h3>
                    <span className="text-sm sm:text-base font-extrabold text-blue-700 tabular-nums">
                      총 ¥{CONFIRMED_TRANSIT_COST.totalJPY.toLocaleString()} (약{' '}
                      {CONFIRMED_TRANSIT_COST.totalKRW.toLocaleString()}원)
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 text-xs sm:text-sm">
                    {CONFIRMED_TRANSIT_COST.items.map((tItem, idx) => (
                      <div key={idx} className="py-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900">{tItem.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{tItem.note}</div>
                        </div>
                        <div className="text-right tabular-nums shrink-0">
                          <div className="font-bold text-slate-900">{tItem.krw.toLocaleString()}원</div>
                          <div className="text-xs text-slate-500">¥{tItem.jpy.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Budget Folio */}
              <div className="lg:col-span-5 lg:sticky lg:top-20 bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-6 shadow-md">
                <div className="border-b border-slate-700 pb-4 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-blue-400 font-bold">
                      Confirmed Travel Folio
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                      확정 여정 총 견적 명세서
                    </h3>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">성인 3 · 유아 1</span>
                </div>

                <div className="space-y-4 text-sm divide-y divide-slate-800">
                  <div className="pt-1 flex justify-between items-start gap-3">
                    <div>
                      <div className="text-white font-bold">01. 항공권 [예매 확정 ✅]</div>
                      <div className="text-xs text-blue-300 mt-0.5">
                        제주항공 오이타 직항 (7C1512 / 7C1511)
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        성인 {CONFIRMED_FLIGHT.adultFareKRW.toLocaleString()}원×3 + 유아{' '}
                        {CONFIRMED_FLIGHT.infantFareKRW.toLocaleString()}원
                      </div>
                    </div>
                    <div className="tabular-nums font-bold text-white whitespace-nowrap">
                      {CONFIRMED_FLIGHT.total3Adults1InfantKRW.toLocaleString()}원
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-start gap-3">
                    <div>
                      <div className="text-white font-bold">
                        02. 유후인 1박 + 벳푸 2박 확정 숙박
                      </div>
                      <div className="text-xs text-slate-300 mt-1.5 space-y-1">
                        <div>
                          • <strong>유후인 산스이칸 (1박 · 석식+조식):</strong>{' '}
                          <span className="text-amber-300 font-semibold">
                            {yufuin1NightKRW.toLocaleString()}원
                          </span>{' '}
                          <span className="text-slate-400">(¥{yufuin1NightJPY.toLocaleString()})</span>
                        </div>
                        <div>
                          • <strong>온야도 노노 벳푸 (2박 · 조식만):</strong>{' '}
                          <span className="text-amber-300 font-semibold">
                            {beppu2NightsKRW.toLocaleString()}원
                          </span>{' '}
                          <span className="text-slate-400">
                            (¥{beppu1NightJPY.toLocaleString()}×2박)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="tabular-nums font-bold text-white whitespace-nowrap">
                      {totalStay3NightsKRW.toLocaleString()}원
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-start gap-3">
                    <div>
                      <div className="text-white font-bold">03. 확정 이동수단 (4일 실비)</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        공항리무진 왕복 + JR 특급 유후 2호 + 벳푸 택시
                      </div>
                    </div>
                    <div className="tabular-nums font-bold text-white whitespace-nowrap">
                      {CONFIRMED_TRANSIT_COST.totalKRW.toLocaleString()}원
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-white font-bold">04. 중·석식 외식·입장권·쇼핑 예비비</span>
                      <span className="tabular-nums font-bold text-amber-300">
                        {extraFoodAndTicketKRW.toLocaleString()}원
                      </span>
                    </div>
                    <input
                      type="range"
                      min={300000}
                      max={1500000}
                      step={50000}
                      value={extraFoodAndTicketKRW}
                      onChange={(e) => setExtraFoodAndTicketKRW(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-5 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                      총 예상 견적 (KRW)
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 tabular-nums">
                      {totalBudgetKRW.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs sm:text-sm text-slate-300">
                    <span>성인 1인당 부담액 (÷3인)</span>
                    <span className="tabular-nums font-bold text-white">
                      약 {perAdultKRW.toLocaleString()}원
                    </span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <button
                      type="button"
                      onClick={handleSaveCurrentPlan}
                      disabled={isAuthLoading}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>💾</span>
                      <span>현재 견적 설정 Neon DB에 저장</span>
                    </button>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        <span>{dbStatus.connected ? 'Neon DB 정상 연동' : 'DB 상태 확인'}</span>
                      </span>
                      {lastSavedAt ? (
                        <span className="text-blue-300">최근 저장: {lastSavedAt}</span>
                      ) : (
                        <span>미저장 상태</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile Floating Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md text-slate-900 border-t border-slate-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg flex items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-blue-600 truncate font-bold">
            산스이칸(1박) + 온야도 노노(2박)
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-slate-900 tabular-nums">
              {totalBudgetKRW.toLocaleString()}원
            </span>
            <span className="text-xs text-slate-500">
              (1인 {Math.round(perAdultKRW / 10000)}만)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleSaveCurrentPlan}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs whitespace-nowrap transition cursor-pointer"
          >
            💾 저장
          </button>
          <button
            onClick={() => {
              setMainTab('stays-folio')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs whitespace-nowrap hover:bg-blue-700 transition shadow-xs cursor-pointer"
          >
            명세서 보기
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

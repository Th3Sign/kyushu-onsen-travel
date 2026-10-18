import React, { useState, useMemo, useEffect } from 'react'
import {
  HeroOnsenShader,
  DestinationShaderBanner,
  OnsenShaderMood,
} from './components/ShaderBackgrounds'
import {
  REGION_PLANS,
  CONFIRMED_FLIGHT,
  YUFUIN_RYOKANS,
  BEPPU_RYOKANS,
  CONFIRMED_TRANSIT_COST,
  BABY_CHECKLIST,
  OTA_BOOKING_GUIDE,
  PricePlanType,
  RyokanOption,
} from './data/travelData'
import { DynamicRouteMap } from './components/DynamicRouteMap'
import { LoginPage } from './components/LoginPage'
import { useAuth, SavedTravelPlan } from './context/AuthContext'

const SHADER_MOOD_META: {
  id: OnsenShaderMood
  label: string
}[] = [
  { id: 'hinoki-wgsl', label: 'Hinoki Wave' },
  { id: 'yufuin-mist', label: 'Yufuin Mist (1박)' },
  { id: 'beppu-steam', label: 'Beppu Steam (2박)' },
]

const PRICE_PLAN_OPTIONS: {
  id: PricePlanType
  shortLabel: string
  fullLabel: string
  subNote: string
}[] = [
  {
    id: 'ota-breakfast',
    shortLabel: '아고다·트립닷컴 특가 (조식포함)',
    fullLabel: '아고다·트립닷컴 프로모션가 (조식 포함 · 석식 자유)',
    subNote: '플랫폼에서 가장 흔히 보이는 26~43만 원대 요금 (성인 3인 1실 합산)',
  },
  {
    id: 'ota-halfboard',
    shortLabel: '아고다·라쿠텐 특가 (조·석식 2식)',
    fullLabel: '아고다·라쿠텐·자란 쿠폰 특가 (가이세키/뷔페 석식 + 조식 포함)',
    subNote: '정가 대비 25~30% 할인된 조·석식 2식 포함 실결제가 (성인 3인 1실 합산)',
  },
  {
    id: 'rack-rate',
    shortLabel: '공식 정가 (조·석식 2식)',
    fullLabel: '료칸 공식 홈페이지 정가 (가이세키 석식 + 조식 포함)',
    subNote: '할인 전 기준 요금',
  },
]

function getRyokanNightKRW(r: RyokanOption, plan: PricePlanType): number {
  if (plan === 'ota-breakfast') return r.otaBreakfastKRW
  if (plan === 'ota-halfboard') return r.otaHalfBoardKRW
  return r.pricePerNightKRW
}

function getRyokanNightJPY(r: RyokanOption, plan: PricePlanType): number {
  if (plan === 'ota-breakfast') return r.otaBreakfastJPY
  if (plan === 'ota-halfboard') return r.otaHalfBoardJPY
  return r.pricePerNightJPY
}

export function App() {
  const { user, dbStatus, savePlan, loadPlan, lastSavedAt, isLoading: isAuthLoading, logout } = useAuth()
  const [saveStatusMsg, setSaveStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [pendingSavedPlan, setPendingSavedPlan] = useState<SavedTravelPlan | null>(null)

  const [shaderMood, setShaderMood] = useState<OnsenShaderMood>('hinoki-wgsl')
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all')
  const [selectedYufuinRyokanId, setSelectedYufuinRyokanId] = useState<string>('yufuin-yufuintei')
  const [selectedBeppuRyokanId, setSelectedBeppuRyokanId] = useState<string>('seikai-p')
  const [pricePlan, setPricePlan] = useState<PricePlanType>('ota-halfboard')
  const [extraFoodAndTicketKRW, setExtraFoodAndTicketKRW] = useState<number>(650000)

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'quarantine-meat': true,
    'transit-limousine-train': true,
    'transit-chikki-luggage': true,
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
        if (yId) setSelectedYufuinRyokanId(yId)
        if (bId) setSelectedBeppuRyokanId(bId)
      } else if (BEPPU_RYOKANS.some((r) => r.id === plan.ryokan_id)) {
        setSelectedBeppuRyokanId(plan.ryokan_id)
      } else if (YUFUIN_RYOKANS.some((r) => r.id === plan.ryokan_id)) {
        setSelectedYufuinRyokanId(plan.ryokan_id)
      }
    }
    if (plan.price_plan) setPricePlan(plan.price_plan)
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
      price_plan: pricePlan,
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

  const yufuin1NightKRW = getRyokanNightKRW(selectedYufuinRyokan, pricePlan)
  const beppu1NightKRW = getRyokanNightKRW(selectedBeppuRyokan, pricePlan)
  const beppu2NightsKRW = beppu1NightKRW * 2

  const totalStay3NightsKRW = yufuin1NightKRW + beppu2NightsKRW
  const rackStay3NightsKRW =
    selectedYufuinRyokan.pricePerNightKRW + selectedBeppuRyokan.pricePerNightKRW * 2
  const savedOnStayKRW = Math.max(0, rackStay3NightsKRW - totalStay3NightsKRW)

  const totalBudgetKRW =
    CONFIRMED_FLIGHT.total3Adults1InfantKRW +
    totalStay3NightsKRW +
    CONFIRMED_TRANSIT_COST.totalKRW +
    extraFoodAndTicketKRW
  const perAdultKRW = Math.round(totalBudgetKRW / 3)

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (!user) {
    return <LoginPage />
  }

  const renderRyokanCard = (
    r: RyokanOption,
    active: boolean,
    onSelect: () => void,
    stayLabel: string,
    nightsCount: number,
    bannerMood: 'yufuin-fukuoka' | 'beppu-yufuin'
  ) => {
    const currentNightKRW = getRyokanNightKRW(r, pricePlan)
    const currentNightJPY = getRyokanNightJPY(r, pricePlan)
    const totalZoneKRW = currentNightKRW * nightsCount
    const discountPercent = Math.round(
      ((r.pricePerNightKRW - currentNightKRW) / r.pricePerNightKRW) * 100
    )

    const googleHotelsUrl = `https://www.google.com/travel/search?q=${encodeURIComponent(
      r.enSearchQuery + ' ' + r.jpName
    )}`
    const agodaSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      'site:agoda.com ' + r.enSearchQuery + ' ' + r.name
    )}`
    const tripComSearchUrl = `https://kr.trip.com/hotels/list?keyword=${encodeURIComponent(
      r.enSearchQuery
    )}`
    const rakutenSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      'site:travel.rakuten.com ' + r.enSearchQuery + ' ' + r.jpName
    )}`

    return (
      <div
        key={r.id}
        onClick={onSelect}
        className={`border-2 transition cursor-pointer flex flex-col justify-between ${
          active
            ? 'border-[#191816] bg-[#EFECE4] shadow-sm'
            : 'border-[#D8D1C5] bg-[#FAF8F4] hover:border-[#9E9689]'
        }`}
      >
        <div>
          <DestinationShaderBanner regionId={bannerMood} />
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="px-2 py-0.5 bg-[#191816] text-[#E5C89B] font-semibold">
                {stayLabel}
              </span>
              <span className="text-[#8C5A3C] font-medium">{r.jpName}</span>
            </div>

            <div>
              <h4 className="font-serif-kr text-lg font-semibold text-[#191816]">{r.name}</h4>
              <p className="text-xs text-[#8C5A3C] font-medium mt-1">{r.tag}</p>
            </div>

            <div className="border-t border-[#DFD9CE] pt-3 space-y-2 text-xs leading-relaxed text-[#3D3A35]">
              <div className="bg-[#FAF6EE] p-2.5 border border-[#E5DEC9]">
                <span className="text-[#8C5A3C] font-semibold block">🚉 공항리무진 · JR 특급열차 접근성</span>
                <span className="font-medium text-[#191816]">{r.stationAccess}</span>
              </div>
              <div>
                <span className="text-[#78736A] block">객실 구성 (성인 3인 + 13개월 아기 1실)</span>
                <span className="font-medium text-[#191816]">{r.roomType}</span>
              </div>
              <div>
                <span className="text-[#78736A] block">온천 설비</span>
                <span className="font-medium text-[#191816]">{r.bathType}</span>
              </div>
              <div>
                <span className="text-[#78736A] block">식사 구성</span>
                <span className="font-medium text-[#191816]">{r.mealType}</span>
              </div>
              <div>
                <span className="text-[#78736A] block">13개월 유아 요금 정책 (소이네)</span>
                <span className="font-medium text-[#8C5A3C]">{r.babyFeeNote}</span>
              </div>
            </div>

            <div className="border-t border-[#DFD9CE] pt-3 space-y-1.5 text-xs text-[#4A4742]">
              {r.babyPerks.map((perk, idx) => (
                <p key={idx} className="leading-relaxed">
                  • {perk}
                </p>
              ))}
            </div>

            {/* 3-Tier Price Comparison Mini Table */}
            <div className="border-t border-[#191816] pt-3 space-y-1.5 text-xs">
              <div className="text-[11px] uppercase tracking-wider text-[#78736A] mb-2">
                성인 3인 + 아기 1인 · 1박 기준 합산 요금 비교
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                  setPricePlan('ota-breakfast')
                }}
                className={`flex justify-between py-1 px-2 transition ${
                  pricePlan === 'ota-breakfast'
                    ? 'bg-[#191816] text-[#F6F3EC] font-medium'
                    : 'text-[#4A4742] hover:bg-[#E5DFD2]'
                }`}
              >
                <span>아고다·트립닷컴 (조식포함)</span>
                <span className="tabular-nums">{r.otaBreakfastKRW.toLocaleString()}원/박</span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                  setPricePlan('ota-halfboard')
                }}
                className={`flex justify-between py-1 px-2 transition ${
                  pricePlan === 'ota-halfboard'
                    ? 'bg-[#191816] text-[#F6F3EC] font-medium'
                    : 'text-[#4A4742] hover:bg-[#E5DFD2]'
                }`}
              >
                <span>아고다·라쿠텐 (석식+조식 2식)</span>
                <span className="tabular-nums">{r.otaHalfBoardKRW.toLocaleString()}원/박</span>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect()
                  setPricePlan('rack-rate')
                }}
                className={`flex justify-between py-1 px-2 transition ${
                  pricePlan === 'rack-rate'
                    ? 'bg-[#191816] text-[#F6F3EC] font-medium'
                    : 'text-[#78736A] line-through hover:bg-[#E5DFD2]'
                }`}
              >
                <span>공식 정가 (석식+조식 2식)</span>
                <span className="tabular-nums">{r.pricePerNightKRW.toLocaleString()}원/박</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 pt-4 border-t border-[#DFD9CE] space-y-4 bg-[#F3EFE6]/60">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-[#191816]">
                  {nightsCount}박 합계 ({nightsCount === 1 ? 'Day 1 유후인' : 'Day 2~3 벳푸 연박'})
                </span>
                {discountPercent > 0 && (
                  <span className="text-[11px] font-semibold text-[#8C5A3C]">
                    (-{discountPercent}%)
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-[#191816] tabular-nums mt-0.5">
                {totalZoneKRW.toLocaleString()}원{' '}
                <span className="text-xs font-normal text-[#78736A]">
                  (1박 ¥{currentNightJPY.toLocaleString()})
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 shrink-0 ${
                active ? 'bg-[#191816] text-[#E5C89B]' : 'border border-[#191816] text-[#191816]'
              }`}
            >
              {active ? '선택됨 ●' : '선택 ○'}
            </span>
          </div>

          <div
            className="pt-3 border-t border-[#DFD9CE] space-y-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] tracking-wider uppercase text-[#78736A]">
              실시간 최저가 조회 바로가기 (성인 3인 기준 검색 권장)
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <a
                href={googleHotelsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 py-2 px-2 text-center border border-[#191816] bg-[#191816] text-[#F6F3EC] hover:bg-[#33312E] transition font-medium"
              >
                Google 호텔 최저가 비교 ↗
              </a>
              <a
                href={agodaSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2 text-center border border-[#C8C1B4] bg-[#FAF8F4] text-[#191816] hover:border-[#191816] transition"
              >
                Agoda ↗
              </a>
              <a
                href={tripComSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2 text-center border border-[#C8C1B4] bg-[#FAF8F4] text-[#191816] hover:border-[#191816] transition"
              >
                Trip.com ↗
              </a>
              <a
                href={rakutenSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 py-1.5 px-2 text-center border border-[#C8C1B4] bg-[#FAF8F4] text-[#191816] hover:border-[#191816] transition"
              >
                Rakuten Travel (화양실 재고 최다) ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#191816] pb-32 sm:pb-20">
      {/* =================================================================
          COVER — FULL-BLEED CINEMATIC WEBGPU SHADER + CONFIRMED HEADER
         ================================================================= */}
      <header className="relative min-h-[68vh] sm:min-h-[75vh] flex flex-col justify-between bg-[#111110] text-[#F6F3EC] overflow-hidden">
        <HeroOnsenShader mood={shaderMood} speedMultiplier={0.9} interactiveTrail={true} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85 pointer-events-none" />

        {/* Top Masthead */}
        <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-10 pt-6 sm:pt-8 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-white/15 pb-4 sm:pb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="font-editorial text-lg sm:text-xl tracking-[0.2em] uppercase text-white">
                OITA · YUFUIN · BEPPU
              </span>
              <span className="px-2 py-0.5 text-[10px] sm:text-xs bg-[#E5C89B] text-[#191816] font-bold uppercase tracking-wider">
                확정 여정 마스터북
              </span>
            </div>

            <div className="flex items-center gap-1.5 md:hidden">
              <span className="text-[11px] text-[#E5C89B] truncate max-w-[85px] font-medium">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="px-2 py-1 text-[10px] bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer"
              >
                로그아웃
              </button>
              <button
                onClick={handleSaveCurrentPlan}
                className="px-2 py-1 text-[10px] bg-[#E5C89B] text-[#191816] font-semibold cursor-pointer"
              >
                💾 저장
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar py-0.5">
              <span className="text-white/50 mr-1 hidden lg:inline tracking-wider uppercase text-[11px] shrink-0">
                WebGPU:
              </span>
              {SHADER_MOOD_META.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setShaderMood(m.id)}
                  className={`px-2 py-1 transition cursor-pointer text-[10px] sm:text-xs shrink-0 ${
                    shaderMood === m.id
                      ? 'bg-white text-[#191816] font-medium'
                      : 'text-white/70 hover:text-white bg-white/10'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2.5 pl-2 border-l border-white/15">
              <span className="text-xs text-white/90 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  <strong className="text-white">{user.name}</strong> 님
                </span>
              </span>
              <button
                onClick={logout}
                className="px-2.5 py-1 text-[11px] sm:text-xs bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 cursor-pointer transition"
              >
                로그아웃
              </button>
              <button
                onClick={handleSaveCurrentPlan}
                disabled={isAuthLoading}
                className="px-2.5 py-1 text-[11px] sm:text-xs bg-[#E5C89B] hover:bg-[#d9b882] text-[#191816] font-semibold cursor-pointer transition shadow-xs flex items-center gap-1"
              >
                <span>💾</span>
                <span>{lastSavedAt ? `저장됨 (${lastSavedAt})` : '플랜 저장'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {saveStatusMsg && (
          <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-10 pt-3">
            <div
              className={`px-4 py-2 text-xs flex items-center justify-between border ${
                saveStatusMsg.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
                  : 'bg-rose-950/90 text-rose-200 border-rose-500/50'
              }`}
            >
              <span>{saveStatusMsg.text}</span>
              <button
                onClick={() => setSaveStatusMsg(null)}
                className="text-white/70 hover:text-white font-mono ml-4 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {pendingSavedPlan && (
          <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-10 pt-3">
            <div className="px-4 py-2.5 bg-[#E5C89B]/95 text-[#191816] border border-[#d9b882] flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
              <div className="flex items-center gap-2">
                <span className="font-bold">💡 이전 저장 플랜 발견:</span>
                <span>Neon DB에 저장된 숙소·예산 설정이 있습니다.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => applySavedPlan(pendingSavedPlan)}
                  className="px-3 py-1 bg-[#191816] text-[#F6F3EC] font-semibold hover:bg-black cursor-pointer text-xs"
                >
                  불러오기
                </button>
                <button
                  onClick={() => setPendingSavedPlan(null)}
                  className="px-2 py-1 text-[#191816]/70 hover:text-[#191816] text-xs cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Center Title */}
        <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-10 my-auto py-10 sm:py-14 pointer-events-none">
          <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/20 text-[11px] sm:text-xs text-[#E5C89B] mb-4">
            <span>✅ 제주항공 오이타 직항 예매 완료</span>
            <span>·</span>
            <span>🚌 공항리무진 (오이타→유후인)</span>
            <span>·</span>
            <span>🚆 JR 특급열차 (유후인→벳푸)</span>
          </div>
          <h1 className="font-serif-kr text-2xl sm:text-4xl lg:text-[48px] font-normal leading-[1.3] text-white max-w-4xl">
            오이타 공항 ➔ 유후인 1박 ➔ 벳푸 2박
            <br />
            성인 3인 · 13개월 아기 맞춤 확정 여정표
          </h1>
          <p className="mt-4 sm:mt-5 text-xs sm:text-base text-white/85 max-w-2xl leading-relaxed font-light">
            렌터카 없이 공항 리무진 버스와 JR 특급열차로 가장 편안하게 이동하는 3박 4일 실전 가이드.
            탑승 시각표, 유후인 치키 짐 배송, 무환승 직통 열차, 벳푸 2박 연박 동선만 세밀하게 담았습니다.
          </p>
        </div>

        {/* Bottom Metadata Strip */}
        <div className="relative z-10 border-t border-white/15 bg-black/60 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-10 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            <div className="py-3 sm:py-4 pr-3 sm:pr-6">
              <div className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-white/55">
                Confirmed Flight
              </div>
              <div className="text-xs sm:text-sm font-medium text-[#E5C89B] mt-0.5">
                제주항공 오이타 직항 (7C1512/1511)
              </div>
            </div>
            <div className="py-3 sm:py-4 pl-3 sm:px-6">
              <div className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-white/55">
                Confirmed Stay
              </div>
              <div className="text-xs sm:text-sm font-medium text-white mt-0.5">
                유후인 1박 + 벳푸 2박 연박
              </div>
            </div>
            <div className="py-3 sm:py-4 pr-3 sm:px-6">
              <div className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-white/55">
                Confirmed Transit
              </div>
              <div className="text-xs sm:text-sm font-medium text-white mt-0.5 truncate">
                공항리무진 + JR 특급열차 + 택시
              </div>
            </div>
            <div className="py-3 sm:py-4 pl-3 sm:pl-6">
              <div className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-white/55">
                Estimated Total (성인3+유아1)
              </div>
              <div className="text-xs sm:text-base font-semibold text-[#E5C89B] mt-0.5 tabular-nums">
                {totalBudgetKRW.toLocaleString()}원{' '}
                <span className="text-[11px] text-white/60 block sm:inline font-normal">
                  (1인 약 {Math.round(perAdultKRW / 10000)}만)
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================================
          STICKY NAVIGATION BAR
         ================================================================= */}
      <nav className="sticky top-0 z-40 bg-[#F6F3EC]/95 backdrop-blur-md border-b border-[#191816]">
        <div className="max-w-6xl mx-auto px-4 sm:px-10 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#8C5A3C]" />
            <span className="text-xs sm:text-sm font-serif-kr font-semibold text-[#191816]">
              확정 코스: 오이타공항 ➔ 유후인(1박) ➔ 벳푸(2박)
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-xs font-medium text-[#5C5852] shrink-0">
            <a href="#chapter-transit" className="hover:text-[#191816] transition">
              01 항공·리무진·특급열차 시간표
            </a>
            <a href="#chapter-timeline" className="hover:text-[#191816] transition">
              02 3박 4일 상세 일정표
            </a>
            <a href="#chapter-ryokan" className="hover:text-[#191816] transition">
              03 유후인(1박)·벳푸(2박) 숙소
            </a>
            <a href="#chapter-folio" className="hover:text-[#191816] transition">
              04 확정 견적·체크리스트
            </a>
          </div>
        </div>
      </nav>

      {/* =================================================================
          MAIN EDITORIAL CONTAINER
         ================================================================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-10 divide-y divide-[#D8D1C5]">
        {/* ---------------------------------------------------------------
            CHAPTER 01 — CONFIRMED FLIGHT & TRANSIT TIMETABLE MASTER GUIDE
           --------------------------------------------------------------- */}
        <section id="chapter-transit" className="py-12 sm:py-18 scroll-mt-14 space-y-10">
          <div className="space-y-3">
            <div className="text-xs tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
              Chapter 01 — Confirmed Flight & Transit Master Plan
            </div>
            <h2 className="font-serif-kr text-2xl sm:text-3xl font-normal text-[#191816]">
              예매 확정 제주항공 스케줄 & 리무진·특급열차 완벽 가이드
            </h2>
            <p className="text-sm text-[#5C5852] leading-relaxed">
              성인 3명과 13개월 아기가 캐리어 3개·유모차 1대를 가지고 가장 덜 걷고, 환승 없이 이동할 수 있도록 설계된 구간별 실전 매뉴얼입니다.
            </p>
          </div>

          {/* Confirmed Flight Summary Box */}
          <div className="bg-white border-2 border-[#191816] p-5 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFD9CE] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 bg-[#191816] text-[#E5C89B] text-xs font-bold">
                  항공권 확정 완료 ✅
                </span>
                <h3 className="font-serif-kr text-lg sm:text-xl font-semibold text-[#191816]">
                  제주항공 (Jeju Air) · 인천(T1) ↔ 오이타(OIT) 직항
                </h3>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#8C5A3C]">
                성인 3인 + 13개월 유아 1인 (무좌석 유아 · 유모차 도어투도어 무료 위탁)
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF8F4] border border-[#DFD9CE] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#8C5A3C] font-semibold">
                  <span>🛫 출국편 · 2026. 12. 21 (월)</span>
                  <span className="font-mono">편명: {CONFIRMED_FLIGHT.outboundFlight}</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-[#191816] font-mono">
                  10:50 인천(T1) 출발 ➔ 12:45 오이타 도착
                </div>
                <p className="text-xs text-[#5C5852]">
                  • 08:30 인천공항 T1 도착 권장 · 유아 동반 교통약자 우대 출국통로(패스트트랙) 이용
                  <br />• 12:45 착륙 후 입국심사 15분 컷 ➔ <strong>13:25 유후인행 리무진 버스 바로 탑승!</strong>
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F4] border border-[#DFD9CE] space-y-1.5">
                <div className="flex items-center justify-between text-xs text-[#8C5A3C] font-semibold">
                  <span>🛬 귀국편 · 2026. 12. 24 (목)</span>
                  <span className="font-mono">편명: {CONFIRMED_FLIGHT.inboundFlight}</span>
                </div>
                <div className="text-base sm:text-lg font-bold text-[#191816] font-mono">
                  13:55 오이타 출발 ➔ 15:50 인천(T1) 도착
                </div>
                <p className="text-xs text-[#5C5852]">
                  • 10:35경 벳푸(키타하마/롯카세이)에서 에어라이너 리무진 탑승 ➔ 11:25 오이타공항 도착
                  <br />• 공항 국내선 2층 식당가 점심 & 1층 무료 온천 족욕탕 체험 후 여유롭게 출국
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-[#F6FAF6] border border-[#D3E8D3] text-[#1F4A1F]">
                <strong className="block mb-0.5 text-[#2D662D]">🧳 수하물 & 유모차 규정</strong>
                {CONFIRMED_FLIGHT.baggageRule}
              </div>
              <div className="p-3 bg-[#FFFDF5] border border-[#F3E7C4] text-[#6D4C00]">
                <strong className="block mb-0.5 text-[#A66700]">👶 공항 & 기내 아기 케어 핵심</strong>
                유아 별도 위탁수하물(10kg)은 없으므로 아기 기저귀·여벌옷은 성인 캐리어 3개(총 45kg)에 나누어 담으세요.
              </div>
            </div>
          </div>

          {/* 4-Stage Transit Master Guide */}
          <DynamicRouteMap />
        </section>

        {/* ---------------------------------------------------------------
            CHAPTER 02 — CHRONOLOGICAL 4-DAY TIMELINE
           --------------------------------------------------------------- */}
        <section id="chapter-timeline" className="py-12 sm:py-18 scroll-mt-14 space-y-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Sticky Column */}
            <aside className="lg:col-span-4 lg:sticky lg:top-16 space-y-6">
              <div className="space-y-2">
                <div className="text-xs tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
                  Chapter 02 — Day-by-Day Schedule
                </div>
                <h2 className="font-serif-kr text-2xl sm:text-3xl font-normal text-[#191816] leading-snug">
                  유후인 1박 + 벳푸 2박
                  <br />
                  분 단위 실전 타임라인
                </h2>
                <p className="text-xs sm:text-sm text-[#5C5852] leading-relaxed">
                  오이타 공항 리무진과 JR 특급열차 실제 출발 시각, 캐리어 보관 시점, 13개월 아기 낮잠 및 어른 3인 교대 휴식 시간을 맞춘 일정표입니다.
                </p>
              </div>

              {/* Mobile Day Filter Pills */}
              <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <button
                  onClick={() => setActiveDayFilter('all')}
                  className={`px-3.5 py-2 text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
                    activeDayFilter === 'all'
                      ? 'bg-[#191816] text-[#F6F3EC] font-semibold'
                      : 'bg-[#EFECE4] text-[#78736A] border border-[#DFD9CE]'
                  }`}
                >
                  전체 일정 (Day 1–4)
                </button>
                {currentRegion.days.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveDayFilter(d.day)}
                    className={`px-3.5 py-2 text-xs transition cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      activeDayFilter === d.day
                        ? 'bg-[#191816] text-[#F6F3EC] font-semibold'
                        : 'bg-[#EFECE4] text-[#78736A] border border-[#DFD9CE]'
                    }`}
                  >
                    <span>Day 0{d.day}</span>
                    <span className="text-[10px] text-[#8C5A3C]">({d.stayBadge})</span>
                  </button>
                ))}
              </div>

              {/* Desktop Day Filter List */}
              <div className="hidden lg:block border-y border-[#191816] divide-y divide-[#DFD9CE]">
                <button
                  onClick={() => setActiveDayFilter('all')}
                  className={`w-full py-3 px-2 text-left flex items-center justify-between text-sm transition cursor-pointer ${
                    activeDayFilter === 'all'
                      ? 'font-semibold text-[#191816]'
                      : 'text-[#78736A] hover:text-[#191816]'
                  }`}
                >
                  <span>전체 일정 연속 보기 (Day 01 – 04)</span>
                  <span className="font-editorial italic">{activeDayFilter === 'all' ? '●' : '○'}</span>
                </button>
                {currentRegion.days.map((d) => (
                  <button
                    key={d.day}
                    onClick={() => setActiveDayFilter(d.day)}
                    className={`w-full py-3 px-2 text-left flex items-center justify-between text-sm transition cursor-pointer ${
                      activeDayFilter === d.day
                        ? 'font-semibold text-[#191816]'
                        : 'text-[#78736A] hover:text-[#191816]'
                    }`}
                  >
                    <span>
                      <strong className="font-editorial italic mr-2">Day 0{d.day}</strong>
                      {d.date}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-[#EFECE4] text-[#8C5A3C] font-medium">
                      {d.stayBadge}
                    </span>
                  </button>
                ))}
              </div>

              {/* Route Overview Box */}
              <div className="p-5 bg-[#EFECE4] border border-[#191816] space-y-4">
                <div className="text-xs tracking-[0.15em] uppercase text-[#191816] font-bold border-b border-[#D8D1C5] pb-2">
                  3박 4일 전체 동선 요약
                </div>
                <div className="relative pl-5 border-l border-[#8C5A3C] space-y-4">
                  {currentRegion.routeNodes.map((node) => (
                    <div key={node.step} className="relative text-xs">
                      <span className="absolute -left-[24px] top-1 w-2.5 h-2.5 rounded-full bg-[#191816]" />
                      <div className="font-semibold text-[#191816]">{node.place}</div>
                      <div className="text-[#5C5852] mt-0.5">{node.stayOrStop}</div>
                      {node.modeToNext && (
                        <div className="mt-1 inline-block px-2 py-0.5 bg-white border border-[#DFD9CE] text-[11px] font-medium text-[#8C5A3C]">
                          ↓ {node.modeToNext} ({node.durationToNext})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Column: Detailed Day Cards */}
            <div className="lg:col-span-8 space-y-12 sm:space-y-16">
              {currentRegion.days
                .filter((d) => activeDayFilter === 'all' || d.day === activeDayFilter)
                .map((dayPlan) => (
                  <div key={dayPlan.day} className="space-y-6 sm:space-y-8">
                    <div className="border-b-2 border-[#191816] pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-editorial text-3xl sm:text-4xl font-normal text-[#191816]">
                            Day 0{dayPlan.day}
                          </span>
                          <span className="text-xs sm:text-sm tracking-widest uppercase text-[#8C5A3C] font-semibold">
                            {dayPlan.date}
                          </span>
                          <span className="px-2.5 py-0.5 bg-[#191816] text-[#E5C89B] text-xs font-semibold">
                            {dayPlan.stayBadge}
                          </span>
                        </div>
                        <h3 className="font-serif-kr text-lg sm:text-2xl font-medium text-[#191816] mt-2">
                          {dayPlan.theme}
                        </h3>
                      </div>
                      <div className="text-xs text-[#5C5852] sm:text-right shrink-0">
                        <div className="font-semibold text-[#191816]">
                          일일 대중교통/택시 탑승: 총 {dayPlan.totalTransitMinutes}분
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#EFECE4] px-4 py-2.5 border border-[#DFD9CE] text-xs text-[#3D3A35] font-medium">
                      📍 동선 흐름: {dayPlan.routeSummary}
                    </div>

                    <div className="relative pl-5 sm:pl-8 border-l border-[#C8C1B4] space-y-10 sm:space-y-12">
                      {dayPlan.items.map((item, idx) => (
                        <article key={idx} className="relative space-y-3">
                          <span className="absolute -left-[25.5px] sm:-left-[37px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#191816] ring-4 ring-[#F6F3EC]" />

                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                              <span className="font-mono text-xs sm:text-sm font-bold tracking-tight text-[#8C5A3C] bg-[#EFECE4] px-2 py-0.5 border border-[#DFD9CE]">
                                {item.time}
                              </span>
                              <span className="text-xs font-semibold text-[#5C5852]">
                                📍 {item.place}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#5C5852]">
                              <span>유모차: {item.strollerFriendly}</span>
                              {item.costKRW && (
                                <>
                                  <span>|</span>
                                  <span className="font-semibold text-[#191816]">{item.costKRW}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <h4 className="font-serif-kr text-base sm:text-xl font-semibold text-[#191816]">
                            {item.title}
                          </h4>

                          <p className="text-sm sm:text-[15px] text-[#33312E] leading-[1.75]">
                            {item.desc}
                          </p>

                          {/* Timetable & Luggage Badges */}
                          {(item.timetableNote || item.luggageNote) && (
                            <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                              {item.timetableNote && (
                                <div className="p-2.5 bg-white border border-[#DFD9CE]">
                                  <span className="font-semibold text-[#8C5A3C] block mb-0.5">
                                    🕒 시간표 · 탑승 메모
                                  </span>
                                  <span className="text-[#191816] font-medium">{item.timetableNote}</span>
                                </div>
                              )}
                              {item.luggageNote && (
                                <div className="p-2.5 bg-white border border-[#DFD9CE]">
                                  <span className="font-semibold text-[#2D662D] block mb-0.5">
                                    🧳 캐리어 3개 · 유모차 상태
                                  </span>
                                  <span className="text-[#191816]">{item.luggageNote}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Baby & Adult Tips */}
                          <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs leading-relaxed">
                            <div className="p-3 bg-[#FFFDF5] border border-[#F3E7C4]">
                              <div className="text-[11px] uppercase text-[#A66700] font-semibold mb-1">
                                👶 13개월 아기 케어 팁
                              </div>
                              <p className="text-[#4A4742]">{item.babyTip}</p>
                            </div>

                            {item.adultTip && (
                              <div className="p-3 bg-[#F6F8FB] border border-[#D5E1F0]">
                                <div className="text-[11px] uppercase text-[#29527A] font-semibold mb-1">
                                  👨‍👩‍👧 어른 3인 분담 & 힐링 포인트
                                </div>
                                <p className="text-[#4A4742]">{item.adultTip}</p>
                              </div>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            CHAPTER 03 — YUFUIN (1N) + BEPPU (2N) RYOKAN SELECTION
           --------------------------------------------------------------- */}
        <section id="chapter-ryokan" className="py-12 sm:py-18 scroll-mt-14 space-y-12">
          <div className="space-y-3">
            <div className="text-xs tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
              Chapter 03 — Yufuin (1 Night) + Beppu (2 Nights) Stay Curation
            </div>
            <h2 className="font-serif-kr text-2xl sm:text-3xl font-normal text-[#191816]">
              [유후인 1박 숙소] + [벳푸 2박 연박 숙소] 맞춤 선택
            </h2>
            <p className="text-sm text-[#5C5852]">
              공식 홈페이지 정가 대비 25~35% 저렴한 아고다·트립닷컴·라쿠텐 특가를 비교하고, <strong>유후인 1박 숙소</strong>와 <strong>벳푸 2박 숙소</strong>를 각각 선택해 보세요.
            </p>
          </div>

          {/* Price Plan Switcher */}
          <div className="border-y border-[#191816] bg-[#EFECE4] grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D8D1C5]">
            {PRICE_PLAN_OPTIONS.map((plan) => {
              const active = pricePlan === plan.id
              return (
                <button
                  key={plan.id}
                  onClick={() => setPricePlan(plan.id)}
                  className={`p-4 sm:p-5 text-left transition cursor-pointer flex flex-col justify-between ${
                    active ? 'bg-[#191816] text-[#F6F3EC]' : 'hover:bg-[#E5DFD2] text-[#191816]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs tracking-wider uppercase font-semibold ${
                        active ? 'text-[#E5C89B]' : 'text-[#8C5A3C]'
                      }`}
                    >
                      {plan.shortLabel}
                    </span>
                    <span className="font-editorial text-sm">{active ? '● 적용중' : '○ 선택'}</span>
                  </div>
                  <div
                    className={`text-xs mt-2 leading-relaxed ${
                      active ? 'text-white/75' : 'text-[#5C5852]'
                    }`}
                  >
                    {plan.subNote}
                  </div>
                </button>
              )
            })}
          </div>

          {/* STEP 1: YUFUIN 1 NIGHT */}
          <div className="space-y-5">
            <div className="border-l-4 border-[#8C5A3C] pl-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C5A3C]">
                Step 01 · Day 1 (12월 21일 월요일 · 1박)
              </div>
              <h3 className="font-serif-kr text-xl sm:text-2xl font-medium text-[#191816] mt-0.5">
                유후인 1박 추천 료칸 6선 — 독채 별채 노천탕부터 역 도보·유노츠보 가성비 료칸까지 (성인 3인 1실 기준)
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {YUFUIN_RYOKANS.map((r) =>
                renderRyokanCard(
                  r,
                  r.id === selectedYufuinRyokanId,
                  () => setSelectedYufuinRyokanId(r.id),
                  '유후인 1박 (Day 1)',
                  1,
                  'yufuin-fukuoka'
                )
              )}
            </div>
          </div>

          {/* STEP 2: BEPPU 2 NIGHTS */}
          <div className="space-y-5 pt-4">
            <div className="border-l-4 border-[#191816] pl-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8C5A3C]">
                Step 02 · Day 2 ~ Day 3 (12월 22일 화 ~ 24일 목 · 2박 연박 확정)
              </div>
              <h3 className="font-serif-kr text-xl sm:text-2xl font-medium text-[#191816] mt-0.5">
                벳푸 2박 연박 확정 숙소 — 아마네 리조트 세이카이 P타입 「아사기리(朝霧)」 129㎡ 최상층 스위트 vs 일반 객실 비교
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {BEPPU_RYOKANS.map((r) =>
                renderRyokanCard(
                  r,
                  r.id === selectedBeppuRyokanId,
                  () => setSelectedBeppuRyokanId(r.id),
                  '벳푸 2박 연박 (Day 2–3)',
                  2,
                  'beppu-yufuin'
                )
              )}
            </div>
          </div>

          {/* Booking Insider Tips */}
          <div className="p-5 sm:p-8 bg-[#EFECE4] border-y border-[#191816] space-y-5">
            <div className="border-b border-[#D8D1C5] pb-3">
              <div className="text-xs tracking-[0.18em] uppercase text-[#8C5A3C] font-semibold">
                Booking & Train Reservation Insider Note
              </div>
              <h4 className="font-serif-kr text-base sm:text-lg font-medium text-[#191816] mt-1">
                유후인 1박 + 벳푸 2박 숙소 및 특급열차 예약 시 20만 원 아끼는 실전 팁
              </h4>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {OTA_BOOKING_GUIDE.map((tip) => (
                <div key={tip.step} className="space-y-1.5">
                  <div className="font-editorial italic text-base text-[#8C5A3C]">
                    Tip {tip.step}.
                  </div>
                  <h5 className="font-serif-kr text-sm sm:text-[15px] font-semibold text-[#191816] leading-snug">
                    {tip.title}
                  </h5>
                  <p className="text-xs sm:text-[13px] text-[#4A4742] leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            CHAPTER 04 — CONFIRMED FOLIO & CHECKLIST
           --------------------------------------------------------------- */}
        <section id="chapter-folio" className="py-12 sm:py-18 scroll-mt-14">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7 Cols: Checklist & Transit Breakdown */}
            <div className="lg:col-span-7 space-y-8">
              {/* Transit Cost Detailed Table */}
              <div className="bg-[#EFECE4] border border-[#191816] p-5 sm:p-6 space-y-4">
                <div className="flex items-baseline justify-between border-b border-[#D8D1C5] pb-3">
                  <div>
                    <div className="text-xs tracking-wider uppercase text-[#8C5A3C] font-semibold">
                      Transit Expense Breakdown
                    </div>
                    <h3 className="font-serif-kr text-lg font-semibold text-[#191816]">
                      리무진 · JR 특급열차 · 짐배송 · 택시 실비 상세 내역 (4인 합계)
                    </h3>
                  </div>
                  <span className="text-sm font-bold text-[#191816] tabular-nums">
                    총 ¥{CONFIRMED_TRANSIT_COST.totalJPY.toLocaleString()} (약 {CONFIRMED_TRANSIT_COST.totalKRW.toLocaleString()}원)
                  </span>
                </div>

                <div className="divide-y divide-[#DFD9CE] text-xs">
                  {CONFIRMED_TRANSIT_COST.items.map((tItem, idx) => (
                    <div key={idx} className="py-2.5 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-[#191816]">{tItem.label}</div>
                        <div className="text-[11px] text-[#5C5852] mt-0.5">{tItem.note}</div>
                      </div>
                      <div className="text-right tabular-nums shrink-0">
                        <div className="font-semibold text-[#191816]">{tItem.krw.toLocaleString()}원</div>
                        <div className="text-[11px] text-[#78736A]">¥{tItem.jpy.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-xs tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
                    Chapter 04 — Essential Checklist
                  </div>
                  <h2 className="font-serif-kr text-xl sm:text-2xl font-normal text-[#191816]">
                    출국 전 필수 점검 사항 (이유식 검역 · 리무진 · 온천 수칙)
                  </h2>
                </div>

                <div className="border-t border-[#191816] divide-y divide-[#DFD9CE]">
                  {BABY_CHECKLIST.map((item) => {
                    const checked = !!checkedItems[item.id]
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="py-4 flex items-start gap-3 sm:gap-4 cursor-pointer group active:bg-[#EFECE4]/70"
                      >
                        <span className="font-mono text-base mt-0.5 text-[#8C5A3C] shrink-0">
                          {checked ? '[✓]' : '[ ]'}
                        </span>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] sm:text-[11px] tracking-wider uppercase text-[#78736A]">
                              {item.category}
                            </span>
                            {item.critical && (
                              <span className="text-[10px] sm:text-[11px] tracking-wider uppercase text-[#A64B2A] font-semibold">
                                · 중요 필수
                              </span>
                            )}
                          </div>
                          <h3
                            className={`text-sm sm:text-base font-medium ${
                              checked ? 'line-through text-[#9E9689]' : 'text-[#191816]'
                            }`}
                          >
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#4A4742] leading-relaxed">{item.detail}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Bespoke Hotel Folio */}
            <div className="lg:col-span-5 lg:sticky lg:top-16 bg-[#191816] text-[#F6F3EC] p-5 sm:p-8 space-y-6">
              <div className="border-b border-white/15 pb-4 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-[#E5C89B]">
                    Confirmed Travel Folio
                  </div>
                  <h3 className="font-serif-kr text-lg sm:text-xl font-normal text-white mt-1">
                    확정 여정 총 견적 명세서
                  </h3>
                </div>
                <span className="text-xs text-white/60">성인 3 · 유아 1</span>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-white/60">
                  숙박 요금 플랜 선택 (클릭 시 즉시 반영)
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    onClick={() => setPricePlan('ota-breakfast')}
                    className={`py-2 px-1 text-center border transition cursor-pointer ${
                      pricePlan === 'ota-breakfast'
                        ? 'border-[#E5C89B] bg-[#E5C89B] text-[#191816] font-semibold'
                        : 'border-white/20 text-white/70 hover:text-white'
                    }`}
                  >
                    아고다 조식
                  </button>
                  <button
                    onClick={() => setPricePlan('ota-halfboard')}
                    className={`py-2 px-1 text-center border transition cursor-pointer ${
                      pricePlan === 'ota-halfboard'
                        ? 'border-[#E5C89B] bg-[#E5C89B] text-[#191816] font-semibold'
                        : 'border-white/20 text-white/70 hover:text-white'
                    }`}
                  >
                    아고다 2식
                  </button>
                  <button
                    onClick={() => setPricePlan('rack-rate')}
                    className={`py-2 px-1 text-center border transition cursor-pointer ${
                      pricePlan === 'rack-rate'
                        ? 'border-[#E5C89B] bg-[#E5C89B] text-[#191816] font-semibold'
                        : 'border-white/20 text-white/70 hover:text-white'
                    }`}
                  >
                    공식 정가
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm divide-y divide-white/10">
                <div className="pt-2 flex justify-between items-start gap-3">
                  <div>
                    <div className="text-white font-medium">01. 항공권 [예매 확정 ✅]</div>
                    <div className="text-xs text-[#E5C89B] mt-0.5">
                      제주항공 오이타 직항 (7C1512 / 7C1511)
                    </div>
                    <div className="text-[11px] text-white/45">
                      성인 {CONFIRMED_FLIGHT.adultFareKRW.toLocaleString()}원×3 + 유아{' '}
                      {CONFIRMED_FLIGHT.infantFareKRW.toLocaleString()}원
                    </div>
                  </div>
                  <div className="tabular-nums font-medium text-white whitespace-nowrap">
                    {CONFIRMED_FLIGHT.total3Adults1InfantKRW.toLocaleString()}원
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-start gap-3">
                  <div>
                    <div className="text-white font-medium">
                      02. 유후인 1박 + 벳푸 2박 숙박 합산
                    </div>
                    <div className="text-xs text-white/80 mt-1 space-y-1">
                      <div>
                        • <strong>[유후인 1박]</strong> {selectedYufuinRyokan.name.split(' (')[0]}:{' '}
                        <span className="text-[#E5C89B]">{yufuin1NightKRW.toLocaleString()}원</span>
                      </div>
                      <div>
                        • <strong>[벳푸 2박]</strong> {selectedBeppuRyokan.name.split(' (')[0]}:{' '}
                        <span className="text-[#E5C89B]">
                          {beppu2NightsKRW.toLocaleString()}원
                        </span>{' '}
                        ({beppu1NightKRW.toLocaleString()}×2박)
                      </div>
                    </div>
                    {savedOnStayKRW > 0 && (
                      <div className="text-[11px] text-emerald-300 mt-1.5">
                        → 공식 정가 대비 총 {savedOnStayKRW.toLocaleString()}원 절감!
                      </div>
                    )}
                  </div>
                  <div className="tabular-nums font-medium text-white whitespace-nowrap">
                    {totalStay3NightsKRW.toLocaleString()}원
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-start gap-3">
                  <div>
                    <div className="text-white font-medium">03. 확정 이동수단 (4일 실비 합산)</div>
                    <div className="text-xs text-white/65 mt-0.5">
                      공항리무진 왕복 + JR 특급열차(유후인→벳푸) + 짐배송 + 벳푸 택시
                    </div>
                  </div>
                  <div className="tabular-nums font-medium text-white whitespace-nowrap">
                    {CONFIRMED_TRANSIT_COST.totalKRW.toLocaleString()}원
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-white font-medium">04. 식비·입장권·쇼핑 예비비</span>
                    <span className="tabular-nums font-medium text-white">
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
                    className="w-full accent-[#E5C89B] cursor-pointer"
                  />
                </div>
              </div>

              <div className="border-t border-white/25 pt-5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/70">
                    Total Estimate (KRW)
                  </span>
                  <span className="font-serif-kr text-xl sm:text-3xl text-[#E5C89B] tabular-nums">
                    {totalBudgetKRW.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-white/65">
                  <span>성인 1인당 부담액 (÷3인)</span>
                  <span className="tabular-nums font-medium text-white">
                    약 {perAdultKRW.toLocaleString()}원
                  </span>
                </div>

                <div className="pt-4 border-t border-white/15 space-y-2">
                  <button
                    type="button"
                    onClick={handleSaveCurrentPlan}
                    disabled={isAuthLoading}
                    className="w-full py-3 bg-[#E5C89B] text-[#191816] font-semibold text-xs sm:text-sm hover:bg-[#d9b882] transition shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>💾</span>
                    <span>현재 숙소 조합 및 견적 Neon DB에 저장</span>
                  </button>
                  <div className="flex items-center justify-between text-[11px] text-white/50">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dbStatus.connected ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span>{dbStatus.connected ? 'Neon DB 정상 연동' : 'DB 연결 상태 확인'}</span>
                    </span>
                    {lastSavedAt ? (
                      <span className="text-[#E5C89B]">최근 저장: {lastSavedAt}</span>
                    ) : (
                      <span className="text-white/40">미저장 상태</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Floating Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#191816]/95 backdrop-blur-md text-[#F6F3EC] border-t border-white/15 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl flex items-center justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] text-[#E5C89B] truncate font-medium">
            {selectedYufuinRyokan.name.split(' (')[0]}(1박) + {selectedBeppuRyokan.name.split(' (')[0]}(2박)
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif-kr text-base font-semibold text-white tabular-nums">
              {totalBudgetKRW.toLocaleString()}원
            </span>
            <span className="text-[10px] text-white/60">
              (1인 {Math.round(perAdultKRW / 10000)}만)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleSaveCurrentPlan}
            className="px-3 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/25 font-medium text-xs whitespace-nowrap transition cursor-pointer"
          >
            💾 저장
          </button>
          <a
            href="#chapter-folio"
            className="px-3 py-2 bg-[#E5C89B] text-[#191816] font-semibold text-xs whitespace-nowrap hover:bg-[#d9b882] transition shadow cursor-pointer"
          >
            명세서 ↓
          </a>
        </div>
      </div>
    </div>
  )
}

export default App

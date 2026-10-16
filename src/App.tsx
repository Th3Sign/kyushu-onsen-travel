import React, { useState, useMemo } from 'react'
import {
  HeroOnsenShader,
  DestinationShaderBanner,
  OnsenShaderMood,
} from './components/ShaderBackgrounds'
import {
  REGION_PLANS,
  FLIGHT_OPTIONS,
  TRANSPORT_OPTIONS,
  BABY_CHECKLIST,
  OTA_BOOKING_GUIDE,
  RegionId,
  PricePlanType,
  RyokanOption,
} from './data/travelData'

const SHADER_MOOD_META: {
  id: OnsenShaderMood
  label: string
}[] = [
  { id: 'hinoki-wgsl', label: 'Hinoki Wave' },
  { id: 'beppu-steam', label: 'Beppu Steam' },
  { id: 'yufuin-mist', label: 'Yufuin Mist' },
  { id: 'ureshino-silk', label: 'Ureshino Silk' },
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
    subNote: '플랫폼에서 가장 흔히 보이는 25~43만 원대 요금 (성인 3인 1실 합산)',
  },
  {
    id: 'ota-halfboard',
    shortLabel: '아고다·라쿠텐 특가 (조·석식 2식)',
    fullLabel: '아고다·라쿠텐·자란 쿠폰 특가 (가이세키 석식 + 조식 포함)',
    subNote: '정가 대비 25~30% 할인된 가이세키 2식 포함 실결제가 (성인 3인 1실 합산)',
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

const REGION_COMPARISON_ROWS = [
  {
    criterion: '권장 우선순위',
    beppu: '01순위 — 리조트·수족관·사파리 올라운드',
    ureshino: '02순위 — 최단 이동시간 & 피부 저자극 온천',
    yufuin: '03순위 — 프라이빗 독채 료칸 & 시내 쇼핑',
  },
  {
    criterion: '이용 공항 및 이동시간',
    beppu: '오이타공항 35분 / 후쿠오카공항 1시간 40분',
    ureshino: '사가공항 50분 / 후쿠오카공항 1시간 10분',
    yufuin: '후쿠오카공항 1시간 35분',
  },
  {
    criterion: '온천수 천질 (13개월 아기)',
    beppu: '단순온천 · 나트륨 염화물천 (보온·무자극)',
    ureshino: '나트륨 탄산수소염천 (일본 3대 미인온천·약알칼리)',
    yufuin: '무색무취 단순온천 (눈·입 접촉 시에도 저자극)',
  },
  {
    criterion: '성인 3인 + 유아 1인 객실',
    beppu: '65~80㎡ 화양실 (침대 2 + 다다미 요이불 2 + 오션뷰 노천탕)',
    ureshino: '전통 다다미 화실/화양실 + 객실 내 조·석식(오헤야쇼쿠)',
    yufuin: '독립 별채(하나레) 화실 + 전용 정원 노천탕',
  },
  {
    criterion: '주요 유모차 동선',
    beppu: '우미타마고 수족관(무단차) · 아프리칸 사파리(자차 탑승)',
    ureshino: '다케오 어린이 도서관 · 우레시노 강변 평지 산책로',
    yufuin: '긴린코 호수 데크길 · 라라포트 후쿠오카(아카짱혼포)',
  },
]

export function App() {
  const [shaderMood, setShaderMood] = useState<OnsenShaderMood>('hinoki-wgsl')
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId>('beppu-yufuin')
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all')
  const [selectedFlightId, setSelectedFlightId] = useState<string>('ke-fuk-morning')
  const [selectedTransportId, setSelectedTransportId] = useState<string>('minivan-rental')
  const [selectedRyokanId, setSelectedRyokanId] = useState<string>('seikai')
  const [pricePlan, setPricePlan] = useState<PricePlanType>('ota-halfboard')
  const [extraFoodAndTicketKRW, setExtraFoodAndTicketKRW] = useState<number>(650000)

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'quarantine-meat': true,
    'onsen-temp': true,
  })

  const currentRegion = useMemo(
    () => REGION_PLANS.find((r) => r.id === selectedRegionId) ?? REGION_PLANS[0],
    [selectedRegionId]
  )

  const handleSelectRegion = (regionId: RegionId) => {
    setSelectedRegionId(regionId)
    const region = REGION_PLANS.find((r) => r.id === regionId)
    if (region && region.ryokans.length > 0) {
      setSelectedRyokanId(region.ryokans[0].id)
    }
    const matchingFlight = FLIGHT_OPTIONS.find((f) => f.targetRegionId === regionId)
    if (matchingFlight) {
      setSelectedFlightId(matchingFlight.id)
    }
    if (regionId === 'beppu-yufuin') setShaderMood('beppu-steam')
    if (regionId === 'ureshino-takeo') setShaderMood('ureshino-silk')
    if (regionId === 'yufuin-fukuoka') setShaderMood('yufuin-mist')
  }

  const selectedFlight = useMemo(
    () => FLIGHT_OPTIONS.find((f) => f.id === selectedFlightId) ?? FLIGHT_OPTIONS[0],
    [selectedFlightId]
  )

  const selectedTransport = useMemo(
    () => TRANSPORT_OPTIONS.find((t) => t.id === selectedTransportId) ?? TRANSPORT_OPTIONS[0],
    [selectedTransportId]
  )

  const allRyokans = useMemo(() => REGION_PLANS.flatMap((r) => r.ryokans), [])
  const selectedRyokan = useMemo(
    () => allRyokans.find((r) => r.id === selectedRyokanId) ?? currentRegion.ryokans[0],
    [allRyokans, selectedRyokanId, currentRegion]
  )

  const selectedNightKRW = getRyokanNightKRW(selectedRyokan, pricePlan)
  const totalStay3NightsKRW = selectedNightKRW * 3
  const rackStay3NightsKRW = selectedRyokan.pricePerNightKRW * 3
  const savedOnStayKRW = Math.max(0, rackStay3NightsKRW - totalStay3NightsKRW)

  const totalBudgetKRW =
    selectedFlight.total3Adults1InfantKRW +
    totalStay3NightsKRW +
    selectedTransport.totalCost4DaysKRW +
    extraFoodAndTicketKRW
  const perAdultKRW = Math.round(totalBudgetKRW / 3)
  const totalBudgetJPY = Math.round(totalBudgetKRW / 9.3)

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#191816] pb-20">
      {/* =================================================================
          COVER — FULL-BLEED CINEMATIC WEBGPU SHADER + EDITORIAL TITLE
         ================================================================= */}
      <header className="relative min-h-[78vh] flex flex-col justify-between bg-[#111110] text-[#F6F3EC] overflow-hidden">
        <HeroOnsenShader mood={shaderMood} speedMultiplier={0.9} interactiveTrail={true} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/85 pointer-events-none" />

        {/* Top Minimalist Masthead */}
        <div className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-10 pt-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-5">
          <div className="flex items-baseline gap-4">
            <span className="font-editorial text-xl tracking-[0.2em] uppercase text-white">
              KYUSHU ONSEN JOURNAL
            </span>
            <span className="text-xs tracking-widest uppercase text-white/60 hidden sm:inline">
              No. 2026 — Winter Issue
            </span>
          </div>

          {/* Subtle WebGPU Atmosphere Switcher */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-white/50 mr-2 hidden md:inline tracking-wider uppercase text-[11px]">
              WebGPU Canvas:
            </span>
            {SHADER_MOOD_META.map((m) => (
              <button
                key={m.id}
                onClick={() => setShaderMood(m.id)}
                className={`px-2.5 py-1 transition cursor-pointer ${
                  shaderMood === m.id
                    ? 'bg-white text-[#191816] font-medium'
                    : 'text-white/70 hover:text-white bg-white/5'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center Editorial Title */}
        <div className="relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-10 my-auto py-16 pointer-events-none">
          <p className="text-xs sm:text-sm tracking-[0.22em] uppercase text-[#E2D9C8] mb-5">
            2026. 12. 21 (MON) — 12. 24 (THU) · 3 NIGHTS 4 DAYS
          </p>
          <h1 className="font-serif-kr text-3xl sm:text-5xl lg:text-[54px] font-normal leading-[1.24] text-white max-w-3xl">
            열세 달 아기와 어른 셋이 떠나는
            <br />
            규슈 겨울 온천 여정 노트
          </h1>
          <p className="mt-6 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed font-light">
            크리스마스 인파가 몰리기 직전인 12월 셋째 주 평일. 짧은 비행과 자극 없는 온천수,
            침대 낙상 걱정 없는 넓은 화양실과 아기 낮잠 시간을 배려한 3박 4일간의 기록과 설계.
          </p>
        </div>

        {/* Bottom Architectural Metadata Strip */}
        <div className="relative z-10 border-t border-white/15 bg-black/45 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
            <div className="py-4 lg:pr-6">
              <div className="text-[11px] tracking-[0.15em] uppercase text-white/55">Date</div>
              <div className="text-sm sm:text-base font-medium text-white mt-1">
                2026. 12. 21 (월) – 12. 24 (목)
              </div>
            </div>
            <div className="py-4 lg:px-6 pl-4">
              <div className="text-[11px] tracking-[0.15em] uppercase text-white/55">Guests</div>
              <div className="text-sm sm:text-base font-medium text-white mt-1">
                성인 3인 · 13개월 유아 1인
              </div>
            </div>
            <div className="py-4 lg:px-6">
              <div className="text-[11px] tracking-[0.15em] uppercase text-white/55">
                Selected Destination
              </div>
              <div className="text-sm sm:text-base font-medium text-[#E5C89B] mt-1">
                {currentRegion.name}
              </div>
            </div>
            <div className="py-4 lg:pl-6 pl-4">
              <div className="text-[11px] tracking-[0.15em] uppercase text-white/55">
                Estimated Total
              </div>
              <div className="text-sm sm:text-base font-medium text-white mt-1 tabular-nums">
                {totalBudgetKRW.toLocaleString()}원{' '}
                <span className="text-xs text-white/60">
                  (성인 1인 {(perAdultKRW / 10000).toFixed(0)}만 원)
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================================
          STICKY ARCHITECTURAL INDEX & REGION SWITCHER BAR
         ================================================================= */}
      <nav className="sticky top-0 z-40 bg-[#F6F3EC]/95 backdrop-blur-md border-b border-[#D8D1C5]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-wrap items-center justify-between gap-4">
          {/* Left: Region Switcher Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto">
            {REGION_PLANS.map((r, i) => {
              const active = r.id === selectedRegionId
              return (
                <button
                  key={r.id}
                  onClick={() => handleSelectRegion(r.id)}
                  className={`py-4 text-left border-b-2 transition cursor-pointer whitespace-nowrap flex items-baseline gap-2 ${
                    active
                      ? 'border-[#191816] text-[#191816] font-semibold'
                      : 'border-transparent text-[#78736A] hover:text-[#191816]'
                  }`}
                >
                  <span className="font-editorial italic text-base">0{i + 1}.</span>
                  <span className="text-sm sm:text-[15px]">{r.name}</span>
                </button>
              )
            })}
          </div>

          {/* Right: Section Anchors */}
          <div className="hidden md:flex items-center gap-6 text-xs tracking-wider uppercase text-[#5C5852] font-medium">
            <a href="#chapter-curation" className="hover:text-[#191816] transition">
              01 지역 비교
            </a>
            <a href="#chapter-timeline" className="hover:text-[#191816] transition">
              02 여정 타임라인
            </a>
            <a href="#chapter-concierge" className="hover:text-[#191816] transition">
              03 항공·차량·숙소
            </a>
            <a href="#chapter-folio" className="hover:text-[#191816] transition">
              04 견적·체크리스트
            </a>
          </div>
        </div>
      </nav>

      {/* =================================================================
          MAIN EDITORIAL CONTAINER
         ================================================================= */}
      <main className="max-w-6xl mx-auto px-6 sm:px-10 divide-y divide-[#D8D1C5]">
        {/* ---------------------------------------------------------------
            CHAPTER 01 — DESTINATION CURATION & COMPARISON
           --------------------------------------------------------------- */}
        <section id="chapter-curation" className="py-16 sm:py-20 scroll-mt-14 space-y-12">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
                Chapter 01 — Destination Analysis
              </div>
              <h2 className="font-serif-kr text-2xl sm:text-3xl font-normal leading-snug text-[#191816]">
                {currentRegion.name}
              </h2>
              <p className="text-sm text-[#5C5852] font-medium">{currentRegion.subtitle}</p>
              <div className="pt-2 border-t border-[#E2DDD5] space-y-2 text-sm text-[#3D3A35]">
                <div className="flex justify-between py-1 border-b border-[#EBE6DD]">
                  <span className="text-[#78736A]">인접 공항</span>
                  <span className="font-medium">{currentRegion.airport}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#EBE6DD]">
                  <span className="text-[#78736A]">온천 천질</span>
                  <span className="font-medium">{currentRegion.waterType.split('(')[0]}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#78736A]">권장 입욕 온도</span>
                  <span className="font-medium">38.0°C – 38.5°C (객실 내 가수 조절)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <p className="text-base sm:text-[17px] text-[#2C2A26] leading-[1.8]">
                {currentRegion.summary}
              </p>

              <div className="border-t border-[#D8D1C5] pt-5">
                <div className="text-xs tracking-[0.15em] uppercase text-[#78736A] mb-4">
                  13개월 유아 및 성인 3인 동행 시 핵심 이점
                </div>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {currentRegion.whyBestFor13Month.map((reason, idx) => (
                    <div key={idx} className="flex items-baseline gap-3 text-sm leading-relaxed text-[#3D3A35]">
                      <span className="font-editorial italic text-base text-[#8C5A3C] shrink-0">
                        0{idx + 1}
                      </span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Architectural Comparison Table of the 3 Regions */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs tracking-[0.18em] uppercase text-[#78736A]">
                Regional Comparison Matrix (원하는 열을 클릭하면 여정이 전환됩니다)
              </span>
            </div>

            <div className="overflow-x-auto border-y border-[#191816]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#191816] bg-[#EFECE4]">
                    <th className="py-4 px-4 font-medium text-[#78736A] w-44">구분</th>
                    <th
                      onClick={() => handleSelectRegion('beppu-yufuin')}
                      className={`py-4 px-5 cursor-pointer transition ${
                        selectedRegionId === 'beppu-yufuin'
                          ? 'bg-[#E6DFD1] text-[#191816]'
                          : 'hover:bg-[#E8E3D9]'
                      }`}
                    >
                      <div className="font-editorial italic text-xs text-[#8C5A3C]">Option 01</div>
                      <div className="font-serif-kr text-base font-semibold mt-0.5">
                        벳푸 & 유후인 (오이타)
                      </div>
                    </th>
                    <th
                      onClick={() => handleSelectRegion('ureshino-takeo')}
                      className={`py-4 px-5 cursor-pointer transition border-l border-[#D8D1C5] ${
                        selectedRegionId === 'ureshino-takeo'
                          ? 'bg-[#E6DFD1] text-[#191816]'
                          : 'hover:bg-[#E8E3D9]'
                      }`}
                    >
                      <div className="font-editorial italic text-xs text-[#8C5A3C]">Option 02</div>
                      <div className="font-serif-kr text-base font-semibold mt-0.5">
                        우레시노 & 다케오 (사가)
                      </div>
                    </th>
                    <th
                      onClick={() => handleSelectRegion('yufuin-fukuoka')}
                      className={`py-4 px-5 cursor-pointer transition border-l border-[#D8D1C5] ${
                        selectedRegionId === 'yufuin-fukuoka'
                          ? 'bg-[#E6DFD1] text-[#191816]'
                          : 'hover:bg-[#E8E3D9]'
                      }`}
                    >
                      <div className="font-editorial italic text-xs text-[#8C5A3C]">Option 03</div>
                      <div className="font-serif-kr text-base font-semibold mt-0.5">
                        유후인 독채 & 후쿠오카
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD9CE]">
                  {REGION_COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-4 font-medium text-[#5C5852] bg-[#F2EFE8]/60">
                        {row.criterion}
                      </td>
                      <td
                        onClick={() => handleSelectRegion('beppu-yufuin')}
                        className={`py-4 px-5 cursor-pointer leading-relaxed ${
                          selectedRegionId === 'beppu-yufuin'
                            ? 'bg-[#EFECE4]/70 font-medium text-[#191816]'
                            : 'text-[#4A4742]'
                        }`}
                      >
                        {row.beppu}
                      </td>
                      <td
                        onClick={() => handleSelectRegion('ureshino-takeo')}
                        className={`py-4 px-5 cursor-pointer border-l border-[#DFD9CE] leading-relaxed ${
                          selectedRegionId === 'ureshino-takeo'
                            ? 'bg-[#EFECE4]/70 font-medium text-[#191816]'
                            : 'text-[#4A4742]'
                        }`}
                      >
                        {row.ureshino}
                      </td>
                      <td
                        onClick={() => handleSelectRegion('yufuin-fukuoka')}
                        className={`py-4 px-5 cursor-pointer border-l border-[#DFD9CE] leading-relaxed ${
                          selectedRegionId === 'yufuin-fukuoka'
                            ? 'bg-[#EFECE4]/70 font-medium text-[#191816]'
                            : 'text-[#4A4742]'
                        }`}
                      >
                        {row.yufuin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            CHAPTER 02 — ARCHITECTURAL SPLIT-COLUMN TIMELINE (DAY 01 – 04)
           --------------------------------------------------------------- */}
        <section id="chapter-timeline" className="py-16 sm:py-20 scroll-mt-14">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left Sticky Column: Day Filter & Route Sequence */}
            <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-8">
              <div className="space-y-3">
                <div className="text-xs tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
                  Chapter 02 — Chronological Itinerary
                </div>
                <h2 className="font-serif-kr text-2xl sm:text-3xl font-normal text-[#191816] leading-snug">
                  3박 4일 시간별 동선과
                  <br />
                  여정 타임라인
                </h2>
                <p className="text-sm text-[#5C5852] leading-relaxed">
                  13개월 아기의 오전·오후 낮잠 리듬과 성인 3인의 교대 휴식 시간을 맞춘 시간표입니다.
                </p>
              </div>

              {/* Day Filter Buttons */}
              <div className="border-y border-[#191816] divide-y divide-[#DFD9CE]">
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
                    <span className="text-xs text-[#78736A]">차량 {d.totalDriveMinutes}분</span>
                  </button>
                ))}
              </div>

              {/* Minimalist Route Flow Summary */}
              <div className="p-6 bg-[#EFECE4] border border-[#DFD9CE] space-y-4">
                <div className="text-xs tracking-[0.15em] uppercase text-[#5C5852] font-semibold">
                  Route Sequence · {currentRegion.name}
                </div>
                <div className="relative pl-5 border-l border-[#ABA396] space-y-5">
                  {currentRegion.routeNodes.map((node) => (
                    <div key={node.step} className="relative">
                      <span className="absolute -left-[24px] top-1.5 w-2 h-2 rounded-full bg-[#191816]" />
                      <div className="text-xs font-editorial italic text-[#8C5A3C]">
                        Step 0{node.step}
                      </div>
                      <div className="text-sm font-semibold text-[#191816]">{node.place}</div>
                      <div className="text-xs text-[#5C5852] mt-0.5">{node.stayOrStop}</div>
                      {node.durationToNext && (
                        <div className="text-xs text-[#8C5A3C] mt-1 font-medium">
                          ↓ {node.durationToNext}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Column: Editorial Timeline Track */}
            <div className="lg:col-span-8 space-y-16">
              {currentRegion.days
                .filter((d) => activeDayFilter === 'all' || d.day === activeDayFilter)
                .map((dayPlan) => (
                  <div key={dayPlan.day} className="space-y-8">
                    {/* Day Editorial Header */}
                    <div className="border-b-2 border-[#191816] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="font-editorial text-4xl sm:text-5xl font-normal text-[#191816]">
                            Day 0{dayPlan.day}
                          </span>
                          <span className="text-sm tracking-widest uppercase text-[#8C5A3C] font-medium">
                            {dayPlan.date}
                          </span>
                        </div>
                        <h3 className="font-serif-kr text-xl sm:text-2xl font-normal text-[#191816] mt-2">
                          {dayPlan.theme}
                        </h3>
                      </div>
                      <div className="text-xs text-[#5C5852] sm:text-right space-y-0.5">
                        <div>구간: {dayPlan.routeSummary}</div>
                        <div className="font-medium text-[#191816]">
                          일일 누적 차량 이동: 약 {dayPlan.totalDriveMinutes}분
                        </div>
                      </div>
                    </div>

                    {/* Vertical Hairline Timeline */}
                    <div className="relative pl-6 sm:pl-8 border-l border-[#C8C1B4] space-y-12">
                      {dayPlan.items.map((item, idx) => {
                        const isLast = idx === dayPlan.items.length - 1
                        return (
                          <article key={idx} className="relative space-y-3">
                            {/* Architectural Dot on Timeline Line */}
                            <span className="absolute -left-[29px] sm:-left-[37px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#191816] ring-4 ring-[#F6F3EC]" />

                            {/* Time & Metadata Line */}
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <div className="flex flex-wrap items-baseline gap-3">
                                <span className="font-mono text-sm font-semibold tracking-tight text-[#8C5A3C]">
                                  {item.time}
                                </span>
                                <span className="text-xs text-[#78736A]">·</span>
                                <span className="text-xs font-medium text-[#5C5852]">
                                  {item.place}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-[#5C5852]">
                                <span>유모차: {item.strollerFriendly}</span>
                                {item.costKRW && (
                                  <>
                                    <span>|</span>
                                    <span className="font-medium text-[#191816]">{item.costKRW}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Main Activity Title & Copy */}
                            <h4 className="font-serif-kr text-lg sm:text-xl font-medium text-[#191816]">
                              {item.title}
                            </h4>
                            <p className="text-[15px] text-[#33312E] leading-[1.75]">
                              {item.desc}
                            </p>

                            {/* Two-Column Hairline Footnote for Baby & Adult Tips */}
                            <div className="grid sm:grid-cols-2 gap-6 pt-3 mt-3 border-t border-[#E2DDD5] text-xs sm:text-[13px] leading-relaxed">
                              <div>
                                <div className="text-[11px] tracking-[0.14em] uppercase text-[#8C5A3C] font-semibold mb-1">
                                  Infant Care Note (13개월 아기)
                                </div>
                                <p className="text-[#4A4742]">{item.babyTip}</p>
                              </div>

                              {item.adultTip && (
                                <div>
                                  <div className="text-[11px] tracking-[0.14em] uppercase text-[#3D4F42] font-semibold mb-1">
                                    3 Adults Rotation (어른 3인 분담)
                                  </div>
                                  <p className="text-[#4A4742]">{item.adultTip}</p>
                                </div>
                              )}
                            </div>

                            {/* Subtle Transit Note Between Items */}
                            {!isLast && dayPlan.items[idx + 1]?.transport && (
                              <div className="pt-4 text-xs text-[#78736A] italic">
                                ↓ 다음 구간 이동: {dayPlan.items[idx + 1].transport}
                              </div>
                            )}
                          </article>
                        )
                      })}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            CHAPTER 03 — CONCIERGE: FLIGHTS, MINIVAN & RYOKAN CURATION
           --------------------------------------------------------------- */}
        <section id="chapter-concierge" className="py-16 sm:py-20 scroll-mt-14 space-y-16">
          <div className="space-y-3">
            <div className="text-xs tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
              Chapter 03 — Flight, Vehicle & Stay Curation
            </div>
            <h2 className="font-serif-kr text-2xl sm:text-3xl font-normal text-[#191816]">
              항공편 · 전용 차량 · 료칸 선택
            </h2>
            <p className="text-sm text-[#5C5852]">
              아래 표에서 항공편, 이동 수단, 숙소를 클릭하여 변경하면 하단 견적서에 즉시 반영됩니다.
            </p>
          </div>

          {/* 03-A. Clean Tabular Flight Timetable */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif-kr text-lg font-medium text-[#191816]">
                A. 12월 21일(월) 출국 – 12월 24일(목) 귀국 직항 항공편 비교
              </h3>
              <span className="text-xs text-[#5C5852]">
                * 생후 13개월 유아는 만 2세 미만 무좌석(성인 운임의 10%) 및 유모차 무료 위탁 적용
              </span>
            </div>

            <div className="overflow-x-auto border-y border-[#191816]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#191816] bg-[#EFECE4] text-xs uppercase tracking-wider text-[#5C5852]">
                    <th className="py-3.5 px-4 w-12">선택</th>
                    <th className="py-3.5 px-4">항공사 및 노선</th>
                    <th className="py-3.5 px-4">출국 (12.21 월) / 귀국 (12.24 목)</th>
                    <th className="py-3.5 px-4">수하물 및 유아 동반 지원</th>
                    <th className="py-3.5 px-4 text-right">4인 왕복 합계 (성인3+유아1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFD9CE]">
                  {FLIGHT_OPTIONS.map((f) => {
                    const active = f.id === selectedFlightId
                    return (
                      <tr
                        key={f.id}
                        onClick={() => setSelectedFlightId(f.id)}
                        className={`cursor-pointer transition ${
                          active ? 'bg-[#E8E2D5]' : 'hover:bg-[#EFECE4]/60'
                        }`}
                      >
                        <td className="py-4 px-4 align-top font-editorial text-lg text-[#8C5A3C]">
                          {active ? '●' : '○'}
                        </td>
                        <td className="py-4 px-4 align-top">
                          <div className="font-semibold text-[#191816]">{f.airline}</div>
                          <div className="text-xs text-[#5C5852] mt-0.5">
                            {f.routeCode} · {f.routeName} ({f.duration})
                          </div>
                        </td>
                        <td className="py-4 px-4 align-top text-xs sm:text-sm space-y-1 tabular-nums">
                          <div>
                            <span className="text-[#78736A] mr-2">출국 {f.outboundFlight}</span>
                            <span className="font-medium">{f.outboundTime}</span>
                          </div>
                          <div>
                            <span className="text-[#78736A] mr-2">귀국 {f.inboundFlight}</span>
                            <span className="font-medium">{f.inboundTime.split(' (')[0]}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 align-top text-xs text-[#4A4742] space-y-1 max-w-md leading-relaxed">
                          <div className="font-medium text-[#191816]">{f.baggageRule}</div>
                          <div>{f.pros}</div>
                        </td>
                        <td className="py-4 px-4 align-top text-right tabular-nums whitespace-nowrap">
                          <div className="text-base font-semibold text-[#191816]">
                            {f.total3Adults1InfantKRW.toLocaleString()}원
                          </div>
                          <div className="text-xs text-[#78736A] mt-0.5">
                            성인 {f.adultFareKRW.toLocaleString()}×3 + 유아 {f.infantFareKRW.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 03-B. Stayfolio-Style Ryokan Curation & OTA Price Comparison */}
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <h3 className="font-serif-kr text-lg sm:text-xl font-medium text-[#191816]">
                  B. [{currentRegion.name}] 성인 3인 + 13개월 유아 한 객실 숙박 료칸 & 예약 플랫폼별 실결제가 비교
                </h3>
                <p className="text-xs text-[#5C5852] leading-relaxed">
                  * 기존에 표시되던 금액은 「성인 3인 가이세키 석식+조식 포함 공식 정가」입니다. 아고다·트립닷컴·라쿠텐 쿠폰 특가 및 조식 포함 플랜으로 전환해 실제 예약 가격을 비교해 보세요.
                </p>
              </div>
            </div>

            {/* Architectural OTA Price Plan Switcher Bar */}
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

            {/* Ryokan Cards with 3-Tier OTA Price Breakdown & Direct Booking Search Links */}
            <div className="grid md:grid-cols-3 gap-6">
              {currentRegion.ryokans.map((r) => {
                const active = r.id === selectedRyokanId
                const currentNightKRW = getRyokanNightKRW(r, pricePlan)
                const currentNightJPY = getRyokanNightJPY(r, pricePlan)
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
                    onClick={() => setSelectedRyokanId(r.id)}
                    className={`border transition cursor-pointer flex flex-col justify-between ${
                      active
                        ? 'border-[#191816] bg-[#EFECE4]'
                        : 'border-[#D8D1C5] bg-[#FAF8F4] hover:border-[#9E9689]'
                    }`}
                  >
                    <div>
                      <DestinationShaderBanner regionId={currentRegion.id} />
                      <div className="p-6 space-y-4">
                        <div className="flex items-baseline justify-between text-xs text-[#8C5A3C]">
                          <span>{r.jpName}</span>
                          <span>{r.area}</span>
                        </div>
                        <div>
                          <h4 className="font-serif-kr text-lg font-medium text-[#191816]">
                            {r.name}
                          </h4>
                          <p className="text-xs text-[#5C5852] mt-1">{r.tag}</p>
                        </div>

                        <div className="border-t border-[#DFD9CE] pt-3 space-y-2 text-xs leading-relaxed text-[#3D3A35]">
                          <div>
                            <span className="text-[#78736A] block">객실 구성 (성인 3인 1실)</span>
                            <span className="font-medium text-[#191816]">{r.roomType}</span>
                          </div>
                          <div>
                            <span className="text-[#78736A] block">온천 설비</span>
                            <span className="font-medium text-[#191816]">{r.bathType}</span>
                          </div>
                          <div>
                            <span className="text-[#78736A] block">13개월 유아 요금 정책 (소이네)</span>
                            <span className="font-medium text-[#8C5A3C]">{r.babyFeeNote}</span>
                          </div>
                          <div>
                            <span className="text-[#78736A] block">최저가 추천 플랫폼</span>
                            <span className="text-[#191816]">{r.bestPlatform}</span>
                          </div>
                        </div>

                        <div className="border-t border-[#DFD9CE] pt-3 space-y-1.5 text-xs text-[#4A4742]">
                          {r.babyPerks.map((perk, idx) => (
                            <p key={idx} className="leading-relaxed">
                              — {perk}
                            </p>
                          ))}
                        </div>

                        {/* 3-Tier Price Comparison Mini Table inside Card */}
                        <div className="border-t border-[#191816] pt-3 space-y-1.5 text-xs">
                          <div className="text-[11px] uppercase tracking-wider text-[#78736A] mb-2">
                            성인 3인 + 아기 1인 · 1객실 1박 합산 요금 비교
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedRyokanId(r.id)
                              setPricePlan('ota-breakfast')
                            }}
                            className={`flex justify-between py-1 px-2 transition ${
                              pricePlan === 'ota-breakfast'
                                ? 'bg-[#191816] text-[#F6F3EC] font-medium'
                                : 'text-[#4A4742] hover:bg-[#E5DFD2]'
                            }`}
                          >
                            <span>아고다·트립닷컴 (조식포함)</span>
                            <span className="tabular-nums">{r.otaBreakfastKRW.toLocaleString()}원</span>
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedRyokanId(r.id)
                              setPricePlan('ota-halfboard')
                            }}
                            className={`flex justify-between py-1 px-2 transition ${
                              pricePlan === 'ota-halfboard'
                                ? 'bg-[#191816] text-[#F6F3EC] font-medium'
                                : 'text-[#4A4742] hover:bg-[#E5DFD2]'
                            }`}
                          >
                            <span>아고다·라쿠텐 (석식+조식 2식)</span>
                            <span className="tabular-nums">{r.otaHalfBoardKRW.toLocaleString()}원</span>
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedRyokanId(r.id)
                              setPricePlan('rack-rate')
                            }}
                            className={`flex justify-between py-1 px-2 transition ${
                              pricePlan === 'rack-rate'
                                ? 'bg-[#191816] text-[#F6F3EC] font-medium'
                                : 'text-[#78736A] line-through hover:bg-[#E5DFD2]'
                            }`}
                          >
                            <span>공식 정가 (석식+조식 2식)</span>
                            <span className="tabular-nums">{r.pricePerNightKRW.toLocaleString()}원</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Selected Price + Direct OTA Search Links */}
                    <div className="p-6 pt-4 border-t border-[#DFD9CE] space-y-4 bg-[#F3EFE6]/60">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#78736A]">선택 플랜 1박 합산</span>
                            {discountPercent > 0 && (
                              <span className="text-[11px] font-semibold text-[#8C5A3C]">
                                (정가 대비 -{discountPercent}%)
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-semibold text-[#191816] tabular-nums mt-0.5">
                            {currentNightKRW.toLocaleString()}원{' '}
                            <span className="text-xs font-normal text-[#78736A]">
                              (¥{currentNightJPY.toLocaleString()} · 성인 1인당 약{' '}
                              {Math.round(currentNightKRW / 30000)}만 원)
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#191816] underline underline-offset-4 shrink-0">
                          {active ? 'Selected ●' : 'Select ○'}
                        </span>
                      </div>

                      {/* External Platform Search Links */}
                      <div
                        className="pt-3 border-t border-[#DFD9CE] space-y-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-[10px] tracking-wider uppercase text-[#78736A]">
                          실시간 최저가 조회 바로가기 (구글 경유 아고다 시크릿가 적용)
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[11px]">
                          <a
                            href={googleHotelsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 border border-[#191816] bg-[#191816] text-[#F6F3EC] hover:bg-[#33312E] transition"
                          >
                            Google 호텔 최저가 비교 ↗
                          </a>
                          <a
                            href={agodaSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 border border-[#C8C1B4] bg-[#FAF8F4] text-[#191816] hover:border-[#191816] transition"
                          >
                            Agoda ↗
                          </a>
                          <a
                            href={tripComSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 border border-[#C8C1B4] bg-[#FAF8F4] text-[#191816] hover:border-[#191816] transition"
                          >
                            Trip.com ↗
                          </a>
                          <a
                            href={rakutenSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 border border-[#C8C1B4] bg-[#FAF8F4] text-[#191816] hover:border-[#191816] transition"
                          >
                            Rakuten ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Editorial Booking Guide: Why Agoda Looks Cheaper & How to Book for 3 Adults + 13m Baby */}
            <div className="p-6 sm:p-8 bg-[#EFECE4] border-y border-[#191816] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#D8D1C5] pb-4">
                <div>
                  <div className="text-xs tracking-[0.18em] uppercase text-[#8C5A3C] font-semibold">
                    Booking Platform Insider Note
                  </div>
                  <h4 className="font-serif-kr text-lg font-medium text-[#191816] mt-1">
                    숙소는 어디서 어떻게 예약해야 가장 저렴할까요? (아고다·트립닷컴·라쿠텐 실전 팁)
                  </h4>
                </div>
                <span className="text-xs text-[#5C5852]">
                  성인 3명 + 13개월 유아 동반 시 반드시 알아야 할 3가지 요금 구조
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {OTA_BOOKING_GUIDE.map((tip) => (
                  <div key={tip.step} className="space-y-2">
                    <div className="font-editorial italic text-lg text-[#8C5A3C]">
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
          </div>

          {/* 03-C. Vehicle Selection */}
          <div className="space-y-4">
            <h3 className="font-serif-kr text-lg font-medium text-[#191816]">
              C. 현지 이동 수단 (성인 3인 + 유아 카시트 1석 + 28인치 캐리어 3개 + 유모차 1대 기준)
            </h3>

            <div className="grid md:grid-cols-3 border-y border-[#191816] divide-y md:divide-y-0 md:divide-x divide-[#DFD9CE]">
              {TRANSPORT_OPTIONS.map((t) => {
                const active = t.id === selectedTransportId
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTransportId(t.id)}
                    className={`p-6 cursor-pointer transition flex flex-col justify-between space-y-4 ${
                      active ? 'bg-[#E8E2D5]' : 'hover:bg-[#EFECE4]/60'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#8C5A3C]">
                        <span>{t.vehicleModel.split(' (')[0]}</span>
                        <span>{active ? '● 선택됨' : '○ 선택'}</span>
                      </div>
                      <h4 className="font-serif-kr text-base font-medium text-[#191816]">
                        {t.name}
                      </h4>
                      <p className="text-xs text-[#4A4742] leading-relaxed">{t.luggageFit}</p>
                    </div>

                    <div className="pt-3 border-t border-[#D8D1C5] flex items-baseline justify-between text-sm">
                      <span className="text-xs text-[#78736A]">4일 전체 비용</span>
                      <span className="font-semibold text-[#191816] tabular-nums">
                        {t.totalCost4DaysKRW.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            CHAPTER 04 — FOLIO ESTIMATE & INFANT SAFETY CHECKLIST
           --------------------------------------------------------------- */}
        <section id="chapter-folio" className="py-16 sm:py-20 scroll-mt-14">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left 7 Cols: Quarantine & Onsen Checklist */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="text-xs tracking-[0.2em] uppercase text-[#8C5A3C] font-semibold">
                  Chapter 04 — Essential Notes for 13-Month Infant
                </div>
                <h2 className="font-serif-kr text-2xl sm:text-3xl font-normal text-[#191816]">
                  출국 전 필수 점검 사항 (검역 및 온천 수칙)
                </h2>
              </div>

              <div className="border-t border-[#191816] divide-y divide-[#DFD9CE]">
                {BABY_CHECKLIST.map((item) => {
                  const checked = !!checkedItems[item.id]
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className="py-5 flex items-start gap-4 cursor-pointer group"
                    >
                      <span className="font-mono text-sm mt-0.5 text-[#8C5A3C]">
                        {checked ? '[✓]' : '[ ]'}
                      </span>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] tracking-wider uppercase text-[#78736A]">
                            {item.category}
                          </span>
                          {item.critical && (
                            <span className="text-[11px] tracking-wider uppercase text-[#A64B2A] font-semibold">
                              · 중요 수칙
                            </span>
                          )}
                        </div>
                        <h3
                          className={`text-base font-medium ${
                            checked ? 'line-through text-[#9E9689]' : 'text-[#191816]'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#4A4742] leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right 5 Cols: Bespoke Hotel Folio / Cost Statement */}
            <div className="lg:col-span-5 bg-[#191816] text-[#F6F3EC] p-8 space-y-6">
              <div className="border-b border-white/15 pb-4 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-[#E5C89B]">
                    Travel Folio Estimate
                  </div>
                  <h3 className="font-serif-kr text-xl font-normal text-white mt-1">
                    3박 4일 여정 예상 명세서
                  </h3>
                </div>
                <span className="text-xs text-white/50">성인 3 · 유아 1</span>
              </div>

              {/* Quick OTA Rate Switcher inside Folio */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-white/60">
                  숙박 요금 기준 선택 (클릭 시 총액 즉시 변경)
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    onClick={() => setPricePlan('ota-breakfast')}
                    className={`py-2 px-2 text-center border transition cursor-pointer ${
                      pricePlan === 'ota-breakfast'
                        ? 'border-[#E5C89B] bg-[#E5C89B] text-[#191816] font-semibold'
                        : 'border-white/20 text-white/70 hover:text-white'
                    }`}
                  >
                    아고다 조식포함
                  </button>
                  <button
                    onClick={() => setPricePlan('ota-halfboard')}
                    className={`py-2 px-2 text-center border transition cursor-pointer ${
                      pricePlan === 'ota-halfboard'
                        ? 'border-[#E5C89B] bg-[#E5C89B] text-[#191816] font-semibold'
                        : 'border-white/20 text-white/70 hover:text-white'
                    }`}
                  >
                    아고다·라쿠텐 2식
                  </button>
                  <button
                    onClick={() => setPricePlan('rack-rate')}
                    className={`py-2 px-2 text-center border transition cursor-pointer ${
                      pricePlan === 'rack-rate'
                        ? 'border-[#E5C89B] bg-[#E5C89B] text-[#191816] font-semibold'
                        : 'border-white/20 text-white/70 hover:text-white'
                    }`}
                  >
                    공식 정가
                  </button>
                </div>
              </div>

              <div className="space-y-4 text-sm divide-y divide-white/10">
                <div className="pt-2 flex justify-between items-start gap-4">
                  <div>
                    <div className="text-white font-medium">01. 항공권 (왕복 4인)</div>
                    <div className="text-xs text-white/60 mt-0.5">
                      {selectedFlight.airline} · {selectedFlight.routeCode}
                    </div>
                    <div className="text-xs text-white/45">
                      성인 {selectedFlight.adultFareKRW.toLocaleString()}원×3 + 유아{' '}
                      {selectedFlight.infantFareKRW.toLocaleString()}원
                    </div>
                  </div>
                  <div className="tabular-nums font-medium text-white whitespace-nowrap">
                    {selectedFlight.total3Adults1InfantKRW.toLocaleString()}원
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-start gap-4">
                  <div>
                    <div className="text-white font-medium">
                      02. 숙박 3박 (
                      {pricePlan === 'ota-breakfast'
                        ? '아고다·트립닷컴 조식포함'
                        : pricePlan === 'ota-halfboard'
                        ? '아고다·라쿠텐 조·석식 2식'
                        : '공식 정가 조·석식 2식'}
                      )
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">{selectedRyokan.name}</div>
                    <div className="text-xs text-white/45">
                      1박 {selectedNightKRW.toLocaleString()}원 × 3박 (성인 3인 1실 합산)
                    </div>
                    {savedOnStayKRW > 0 && (
                      <div className="text-xs text-[#E5C89B] mt-1">
                        → 공식 정가 대비 3박 총 {savedOnStayKRW.toLocaleString()}원 절감
                      </div>
                    )}
                  </div>
                  <div className="tabular-nums font-medium text-white whitespace-nowrap">
                    {totalStay3NightsKRW.toLocaleString()}원
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-start gap-4">
                  <div>
                    <div className="text-white font-medium">03. 현지 전용 차량 (4일)</div>
                    <div className="text-xs text-white/60 mt-0.5">
                      {selectedTransport.name.split(' (')[0]}
                    </div>
                  </div>
                  <div className="tabular-nums font-medium text-white whitespace-nowrap">
                    {selectedTransport.totalCost4DaysKRW.toLocaleString()}원
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-white font-medium">04. 현지 식비·입장권·쇼핑 예비비</span>
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
                  <span className="text-xs uppercase tracking-wider text-white/70">
                    Total Estimate (KRW)
                  </span>
                  <span className="font-serif-kr text-2xl sm:text-3xl text-[#E5C89B] tabular-nums">
                    {totalBudgetKRW.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-white/65">
                  <span>성인 1인당 부담액 (÷3인 기준)</span>
                  <span className="tabular-nums font-medium text-white">
                    약 {perAdultKRW.toLocaleString()}원 (총액 약 ¥{totalBudgetJPY.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

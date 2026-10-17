import React from 'react'
import {
  RegionId,
  TRANSPORT_OPTIONS,
  getDynamicTransportRoute,
} from '../data/travelData'

interface DynamicRouteMapProps {
  regionId: RegionId
  selectedTransportId: string
  onSelectTransport: (transportId: string) => void
  regionName: string
}

export const DynamicRouteMap: React.FC<DynamicRouteMapProps> = ({
  regionId,
  selectedTransportId,
  onSelectTransport,
  regionName,
}) => {
  const dynamicRoute = getDynamicTransportRoute(regionId, selectedTransportId)

  return (
    <div className="bg-[#EFECE4] border-2 border-[#191816] p-5 sm:p-7 space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D8D1C5] pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8C5A3C]">
              Dynamic Navigation Route · {regionName}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#191816] text-[#F6F3EC]">
              선택 교통수단 연동
            </span>
          </div>
          <h3 className="font-serif-kr text-lg sm:text-2xl font-medium text-[#191816]">
            {dynamicRoute.modeBadge}
          </h3>
          <p className="text-xs sm:text-sm text-[#5C5852]">{dynamicRoute.routeTheme}</p>
        </div>

        {/* Comfort Score & Duration Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 bg-white border border-[#DFD9CE] text-right">
            <div className="text-[10px] tracking-wider uppercase text-[#78736A]">예상 소요시간</div>
            <div className="text-sm sm:text-base font-bold text-[#191816] tabular-nums">
              약 {dynamicRoute.totalMinutesOneWay}분
            </div>
          </div>
          <div className="px-3.5 py-2 bg-white border border-[#DFD9CE] text-right">
            <div className="text-[10px] tracking-wider uppercase text-[#78736A]">아기 편의도</div>
            <div className="text-sm sm:text-base font-bold text-[#8C5A3C] tabular-nums">
              ★ {dynamicRoute.babyComfortScore}점
            </div>
          </div>
        </div>
      </div>

      {/* Transportation Mode Switcher Pills */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-[#5C5852]">
          교통수단을 선택하면 이동 동선 및 정차지 정보가 실시간으로 변경됩니다:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TRANSPORT_OPTIONS.map((t) => {
            const isSelected = t.id === selectedTransportId
            return (
              <button
                key={t.id}
                onClick={() => onSelectTransport(t.id)}
                className={`p-3 text-left transition cursor-pointer border flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-[#191816] text-[#F6F3EC] border-[#191816] shadow-sm'
                    : 'bg-white hover:bg-[#F6F3EC] text-[#191816] border-[#DFD9CE]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{t.id === 'minivan-rental' ? '🚗 렌터카 미니밴' : t.id === 'private-jumbo-taxi' ? '🚐 프라이빗 점보택시' : '🚆 JR 관광열차/신칸센'}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-[#E5C89B]' : 'text-[#8C5A3C]'}`}>
                    {isSelected ? '● 활성' : '선택'}
                  </span>
                </div>
                <div className={`text-[11px] line-clamp-1 ${isSelected ? 'text-white/80' : 'text-[#78736A]'}`}>
                  {t.name}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Toll / Ticket & Scenic Highlight Bar */}
      <div className="grid sm:grid-cols-2 gap-3 text-xs bg-white/80 p-3.5 border border-[#DFD9CE]">
        <div>
          <span className="font-semibold text-[#191816]">톨게이트 / 교통 요금: </span>
          <span className="text-[#5C5852]">{dynamicRoute.tollOrFareNote}</span>
        </div>
        <div>
          <span className="font-semibold text-[#8C5A3C]">차창 풍경 & 뷰포인트: </span>
          <span className="text-[#5C5852]">{dynamicRoute.scenicHighlight}</span>
        </div>
      </div>

      {/* Dynamic Waypoints Flow */}
      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#191816] flex items-center justify-between">
          <span>경로 상세 순서도 (Waypoints)</span>
          <span className="text-[11px] text-[#78736A] font-normal">총 {dynamicRoute.waypoints.length}단계 구간</span>
        </div>

        <div className="space-y-4 relative">
          {dynamicRoute.waypoints.map((wp, idx) => {
            const isLast = idx === dynamicRoute.waypoints.length - 1
            return (
              <div
                key={wp.step}
                className="relative bg-white border border-[#DFD9CE] p-4 sm:p-5 transition hover:border-[#191816]"
              >
                {/* Step Marker & Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE4] pb-2.5 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#191816] text-[#F6F3EC] text-xs font-bold flex items-center justify-center font-mono">
                      {wp.step}
                    </span>
                    <h4 className="font-serif-kr text-sm sm:text-base font-semibold text-[#191816]">
                      {wp.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-[#8C5A3C] bg-[#F6F3EC] px-2 py-0.5 border border-[#DFD9CE]">
                      {wp.highwayOrLine}
                    </span>
                    <span className="text-xs font-semibold text-[#191816] tabular-nums">
                      ⏱ {wp.duration}
                    </span>
                  </div>
                </div>

                {/* Location & Action */}
                <div className="space-y-2 mb-3.5">
                  <div className="text-xs font-medium text-[#191816] flex items-baseline gap-1.5">
                    <span className="text-[#8C5A3C]">구간:</span>
                    <span>{wp.place}</span>
                  </div>
                  <p className="text-xs text-[#5C5852] leading-relaxed bg-[#FAF8F5] p-2.5 border-l-2 border-[#191816]">
                    {wp.action}
                  </p>
                </div>

                {/* Logistics Badges: Baby, Adults, Luggage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                  {/* Baby Point */}
                  <div className="p-2 bg-[#FFFDF5] border border-[#F3E7C4] rounded-xs space-y-0.5">
                    <div className="font-semibold text-[#A66700] flex items-center gap-1">
                      <span>👶 13개월 안심 포인트</span>
                    </div>
                    <div className="text-[#6D4C00] leading-snug">{wp.babyPoint}</div>
                  </div>

                  {/* Adult Comfort */}
                  <div className="p-2 bg-[#F6F8FB] border border-[#D5E1F0] rounded-xs space-y-0.5">
                    <div className="font-semibold text-[#29527A] flex items-center gap-1">
                      <span>👨‍👩‍👧 성인 3인 편의</span>
                    </div>
                    <div className="text-[#1D3E61] leading-snug">{wp.adultPoint}</div>
                  </div>

                  {/* Luggage Logistics */}
                  <div className="p-2 bg-[#F6FAF6] border border-[#D3E8D3] rounded-xs space-y-0.5">
                    <div className="font-semibold text-[#2D662D] flex items-center gap-1">
                      <span>🧳 짐 & 유모차 상태</span>
                    </div>
                    <div className="text-[#1F4A1F] leading-snug">{wp.luggageStatus}</div>
                  </div>
                </div>

                {/* Downward Connector Arrow for next step */}
                {!isLast && (
                  <div className="flex justify-center -mb-7 pt-2 text-[#ABA396]">
                    <span className="text-xs font-bold bg-[#EFECE4] px-2 py-0.5 rounded-full border border-[#DFD9CE]">
                      ▼ 다음 구간
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

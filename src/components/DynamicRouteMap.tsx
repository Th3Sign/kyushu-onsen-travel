import React, { useState } from 'react'
import {
  CONFIRMED_TRANSIT_SEGMENTS,
  CONFIRMED_TRANSIT_COST,
} from '../data/travelData'

export const DynamicRouteMap: React.FC = () => {
  const [activeSegId, setActiveSegId] = useState<string | 'all'>('all')

  const displayedSegments =
    activeSegId === 'all'
      ? CONFIRMED_TRANSIT_SEGMENTS
      : CONFIRMED_TRANSIT_SEGMENTS.filter((s) => s.id === activeSegId)

  return (
    <div className="bg-[#EFECE4] border-2 border-[#191816] p-5 sm:p-8 space-y-7">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D8D1C5] pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold text-[#8C5A3C]">
              Confirmed Transit Master Guide
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#191816] text-[#E5C89B]">
              렌터카 없이 이동하는 확정 동선
            </span>
          </div>
          <h3 className="font-serif-kr text-xl sm:text-2xl font-medium text-[#191816]">
            🚌 오이타공항 리무진(55분) ➔ 🚆 JR 특급열차(65분) ➔ 🚕 벳푸 택시 ➔ 🚌 에어라이너(45분)
          </h3>
          <p className="text-xs sm:text-sm text-[#5C5852]">
            성인 3명 + 13개월 유아 1명 + 28인치 캐리어 3개 + 휴대용 유모차 1대 기준 구간별 탑승 시각표·승강장·수하물 처리 완벽 가이드
          </p>
        </div>

        {/* Summary Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 bg-white border border-[#DFD9CE] text-right">
            <div className="text-[10px] tracking-wider uppercase text-[#78736A]">4일 대중교통·택시 총액</div>
            <div className="text-sm sm:text-base font-bold text-[#191816] tabular-nums">
              약 {CONFIRMED_TRANSIT_COST.totalKRW.toLocaleString()}원
            </div>
          </div>
          <div className="px-3.5 py-2 bg-white border border-[#DFD9CE] text-right">
            <div className="text-[10px] tracking-wider uppercase text-[#78736A]">13개월 유아 운임</div>
            <div className="text-sm sm:text-base font-bold text-[#8C5A3C]">
              전 구간 무료
            </div>
          </div>
        </div>
      </div>

      {/* Segment Filter Tabs */}
      <div className="space-y-2">
        <div className="text-[11px] font-medium text-[#5C5852]">
          구간별 상세 시간표 및 캐리어·유모차 이동 요령 보기:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveSegId('all')}
            className={`p-2.5 text-left transition cursor-pointer border text-xs font-semibold flex items-center justify-between ${
              activeSegId === 'all'
                ? 'bg-[#191816] text-[#F6F3EC] border-[#191816]'
                : 'bg-white hover:bg-[#F6F3EC] text-[#191816] border-[#DFD9CE]'
            }`}
          >
            <span>전체 4구간 연속 보기</span>
            <span className="text-[10px] font-mono text-[#E5C89B]">{activeSegId === 'all' ? '●' : '○'}</span>
          </button>
          {CONFIRMED_TRANSIT_SEGMENTS.map((seg, idx) => {
            const isSelected = activeSegId === seg.id
            return (
              <button
                key={seg.id}
                onClick={() => setActiveSegId(seg.id)}
                className={`p-2.5 text-left transition cursor-pointer border flex flex-col justify-between gap-1 ${
                  isSelected
                    ? 'bg-[#191816] text-[#F6F3EC] border-[#191816]'
                    : 'bg-white hover:bg-[#F6F3EC] text-[#191816] border-[#DFD9CE]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className={isSelected ? 'text-[#E5C89B]' : 'text-[#8C5A3C]'}>구간 0{idx + 1}</span>
                  <span>{seg.duration.split(' ')[1]}</span>
                </div>
                <div className="text-xs font-medium truncate">{seg.dayLabel}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Detailed Segment Cards */}
      <div className="space-y-6">
        {displayedSegments.map((seg, idx) => {
          const isLast = idx === displayedSegments.length - 1
          return (
            <div
              key={seg.id}
              className="relative bg-white border border-[#191816] p-5 sm:p-6 space-y-5 shadow-xs"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EFECE4] pb-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-[#191816] text-[#E5C89B] text-[10px] font-mono font-semibold tracking-wider">
                      {seg.stepBadge}
                    </span>
                    <span className="text-xs font-medium text-[#8C5A3C]">{seg.operatorAndName}</span>
                  </div>
                  <h4 className="font-serif-kr text-base sm:text-xl font-semibold text-[#191816]">
                    {seg.title}
                  </h4>
                  <p className="text-xs text-[#5C5852] mt-0.5">{seg.fromTo}</p>
                </div>

                <div className="bg-[#FAF8F4] border border-[#DFD9CE] px-3.5 py-2 sm:text-right">
                  <div className="text-[11px] text-[#78736A]">⏱ {seg.duration}</div>
                  <div className="text-xs sm:text-sm font-bold text-[#191816] mt-0.5">
                    {seg.fare3Adults1Infant}
                  </div>
                </div>
              </div>

              {/* Exact Timetable Comparison Box */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#191816]">
                    🕒 실제 운행 시간표 및 추천 차편
                  </span>
                  <span className="text-[#8C5A3C] font-medium">{seg.fareBreakdown}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {seg.schedules.map((sch, sIdx) => (
                    <div
                      key={sIdx}
                      className={`p-3.5 border ${
                        sch.recommended
                          ? 'bg-[#FAF6EE] border-[#8C5A3C]'
                          : 'bg-[#FAF8F5] border-[#DFD9CE]'
                      } space-y-1.5`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#191816]">{sch.label}</span>
                        {sch.recommended && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#8C5A3C] text-white font-semibold shrink-0">
                            추천
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs sm:text-sm font-bold text-[#8C5A3C] bg-white px-2.5 py-1.5 border border-[#E5DEC9]">
                        {sch.depart} ➔ {sch.arrive}
                      </div>
                      <p className="text-[11px] text-[#4A4742] leading-relaxed">{sch.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Column Logistics Breakdown: Boarding Spot / Luggage & Stroller / Baby Care */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-[#F6F8FB] border border-[#D5E1F0] space-y-1">
                  <div className="font-semibold text-[#29527A] flex items-center gap-1.5">
                    <span>📍 정확한 탑승 위치</span>
                  </div>
                  <p className="text-[#1D3E61] leading-relaxed whitespace-pre-line">{seg.boardingSpot}</p>
                </div>

                <div className="p-3.5 bg-[#F6FAF6] border border-[#D3E8D3] space-y-1">
                  <div className="font-semibold text-[#2D662D] flex items-center gap-1.5">
                    <span>🧳 캐리어 3개 & 유모차 처리법</span>
                  </div>
                  <p className="text-[#1F4A1F] leading-relaxed">{seg.luggageAndStrollerPlan}</p>
                </div>

                <div className="p-3.5 bg-[#FFFDF5] border border-[#F3E7C4] space-y-1">
                  <div className="font-semibold text-[#A66700] flex items-center gap-1.5">
                    <span>👶 13개월 아기 케어 포인트</span>
                  </div>
                  <p className="text-[#6D4C00] leading-relaxed">{seg.babyCarePoint}</p>
                </div>
              </div>

              {/* Actionable Pro Tips */}
              <div className="bg-[#F3EFE7] p-3.5 border-l-2 border-[#191816] space-y-1.5 text-xs">
                <div className="font-semibold text-[#191816]">💡 성인 3인 + 유아 1인 실전 탑승 팁</div>
                {seg.proTips.map((tip, tIdx) => (
                  <p key={tIdx} className="text-[#3D3A35] leading-relaxed">
                    • {tip}
                  </p>
                ))}
              </div>

              {!isLast && (
                <div className="flex justify-center -mb-9 pt-1 text-[#ABA396]">
                  <span className="text-xs font-bold bg-[#EFECE4] px-3 py-0.5 rounded-full border border-[#191816] text-[#191816]">
                    ▼ 다음 이동 구간
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              렌터카 없이 이동하는 확정 대중교통 가이드
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            🚌 공항리무진(55분) ➔ 🚆 JR 특급 유후(65분) ➔ 🚕 벳푸 단거리 택시 ➔ 🚌 에어라이너(50분)
          </h3>
          <p className="text-sm text-slate-600">
            성인 3명 + 13개월 아기 + 28인치 캐리어 3개 + 휴대용 유모차 1대 기준 탑승 시각표·승강장·짐 보관 매뉴얼
          </p>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-right">
            <div className="text-xs font-medium text-slate-500">4일 교통·택시 총액</div>
            <div className="text-base font-extrabold text-slate-900 tabular-nums">
              약 {CONFIRMED_TRANSIT_COST.totalKRW.toLocaleString()}원
            </div>
          </div>
          <div className="px-4 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-right">
            <div className="text-xs font-medium text-emerald-700">13개월 유아 운임</div>
            <div className="text-base font-extrabold text-emerald-800">
              전 구간 무료
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-2">
        <div className="text-xs sm:text-sm font-semibold text-slate-700">
          구간 선택:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveSegId('all')}
            className={`p-3 rounded-xl text-left transition cursor-pointer border text-xs sm:text-sm font-bold flex items-center justify-between ${
              activeSegId === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <span>전체 4구간 보기</span>
            <span>{activeSegId === 'all' ? '●' : '○'}</span>
          </button>
          {CONFIRMED_TRANSIT_SEGMENTS.map((seg, idx) => {
            const isSelected = activeSegId === seg.id
            return (
              <button
                key={seg.id}
                onClick={() => setActiveSegId(seg.id)}
                className={`p-3 rounded-xl text-left transition cursor-pointer border flex flex-col justify-between gap-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={isSelected ? 'text-blue-100' : 'text-blue-600'}>
                    구간 0{idx + 1}
                  </span>
                  <span className={isSelected ? 'text-white' : 'text-slate-500'}>
                    {seg.duration.split(' ')[1]}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold truncate">{seg.dayLabel}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Segment Cards */}
      <div className="space-y-5">
        {displayedSegments.map((seg) => (
          <div
            key={seg.id}
            className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5"
          >
            {/* Card Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 text-white text-xs font-mono font-bold">
                    {seg.stepBadge}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-blue-700">
                    {seg.operatorAndName}
                  </span>
                </div>
                <h4 className="text-base sm:text-xl font-bold text-slate-900 pt-0.5">
                  {seg.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">{seg.fromTo}</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 sm:text-right">
                <div className="text-xs font-medium text-slate-500">⏱ {seg.duration}</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  {seg.fare3Adults1Infant}
                </div>
              </div>
            </div>

            {/* Timetable */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="font-bold text-slate-900">
                  🕒 실제 운행 시간표 및 추천 차편
                </span>
                <span className="text-blue-700 font-semibold">{seg.fareBreakdown}</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {seg.schedules.map((sch, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-4 rounded-xl border ${
                      sch.recommended
                        ? 'bg-white border-blue-300 shadow-xs'
                        : 'bg-white/80 border-slate-200'
                    } space-y-2`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{sch.label}</span>
                      {sch.recommended && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold shrink-0">
                          추천
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-sm sm:text-base font-bold text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                      {sch.depart} ➔ {sch.arrive}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sch.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-Column Logistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="font-bold text-blue-800 text-xs sm:text-sm">
                  📍 정확한 탑승 위치
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {seg.boardingSpot}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="font-bold text-emerald-800 text-xs sm:text-sm">
                  🧳 캐리어 3개 & 유모차 처리
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {seg.luggageAndStrollerPlan}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                <div className="font-bold text-amber-900 text-xs sm:text-sm">
                  👶 13개월 아기 케어 포인트
                </div>
                <p className="text-amber-950 text-xs sm:text-sm leading-relaxed">
                  {seg.babyCarePoint}
                </p>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs sm:text-sm">
              <div className="font-bold text-slate-900">💡 실전 탑승 팁</div>
              {seg.proTips.map((tip, tIdx) => (
                <p key={tIdx} className="text-slate-600 leading-relaxed">
                  • {tip}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

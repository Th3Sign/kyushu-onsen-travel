import React, { useState, useEffect, useRef, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { RyokanOption } from '../data/travelData'

export interface MapStop {
  id: string
  day: number
  order: number
  time: string
  name: string
  jpName: string
  category: '공항' | '교통/정류장' | '관광/산책' | '식당/쇼핑' | '숙소(료칸)'
  lat: number
  lng: number
  summary: string
  babyPoint: string
  nextTransit?: {
    mode: string
    duration: string
    distance: string
    color: string
    dashed?: boolean
  }
  googleMapsQuery: string
}

interface DayRouteVisualizerProps {
  activeDayFilter: number | 'all'
  onSelectDay: (day: number | 'all') => void
  selectedYufuinRyokan: RyokanOption
  selectedBeppuRyokan: RyokanOption
}

const RYOKAN_COORDS: Record<string, { lat: number; lng: number; shortName: string }> = {
  'yufuin-yufuintei': { lat: 33.2662, lng: 131.3621, shortName: '오야도 유후인테이' },
  'yufuin-baien': { lat: 33.2582, lng: 131.3665, shortName: '유후인 바이엔' },
  'yufuin-hanayoshi': { lat: 33.2685, lng: 131.3452, shortName: '유후인 하나유' },
  'yufuin-sansuikan': { lat: 33.2606, lng: 131.3563, shortName: '유후인 산스이칸' },
  'yufuin-yadoya': { lat: 33.2654, lng: 131.3618, shortName: '야와라기노사토 야도야' },
  'yufuin-hoteiya': { lat: 33.2668, lng: 131.3662, shortName: '유후인 호테이야' },
  'seikai-p': { lat: 33.3077, lng: 131.5015, shortName: '아마네 리조트 세이카이 (P타입)' },
  seikai: { lat: 33.3077, lng: 131.5015, shortName: '아마네 리조트 세이카이' },
}

const DAY_META: Record<
  number,
  {
    badge: string
    title: string
    subtitle: string
    color: string
    totalDist: string
    totalTime: string
    googleDirModify?: string
  }
> = {
  1: {
    badge: 'Day 01 · 12/21(월)',
    title: '오이타 공항 ➔ 유후인역(치키 짐배송) ➔ 긴린코 호수 ➔ 유후인 료칸',
    subtitle: '공항 리무진 논스톱 55분 이동 후 짐 없이 유모차로 평지 호수 산책',
    color: '#8C5A3C',
    totalDist: '약 56km',
    totalTime: '리무진 55분 + 도보 산책',
  },
  2: {
    badge: 'Day 02 · 12/22(화)',
    title: '유후인 료칸 ➔ JR 유후인역 ➔ JR 벳푸역 ➔ 유메타운 ➔ 세이카이(2박)',
    subtitle: 'JR 특급 유후 직통열차(65분)로 무환승 이동 후 유메타운 장보기 & 오션뷰 체크인',
    color: '#29527A',
    totalDist: '약 48km',
    totalTime: '특급열차 65분 + 택시 13분',
  },
  3: {
    badge: 'Day 03 · 12/23(수)',
    title: '세이카이 ➔ 우미타마고 수족관 ➔ 칸나와(지옥찜·가마도지옥) ➔ 세이카이 복귀',
    subtitle: '2박 연박으로 짐 없이 택시 8~12분 단거리 순환! 오후 2시 반 복귀 후 아기 낮잠 & 교대 온천',
    color: '#2D662D',
    totalDist: '약 21km',
    totalTime: '택시 3구간 총 30분',
  },
  4: {
    badge: 'Day 04 · 12/24(목)',
    title: '세이카이 ➔ 롯카세이 정류장(도보 4분) ➔ 오이타 공항 출국',
    subtitle: '벳푸역에 되돌아갈 필요 없이 숙소 앞 해안 정류장에서 에어라이너로 45분 만에 공항 직행',
    color: '#A64B2A',
    totalDist: '약 36km',
    totalTime: '도보 4분 + 리무진 45분',
  },
}

export const DayRouteVisualizer: React.FC<DayRouteVisualizerProps> = ({
  activeDayFilter,
  onSelectDay,
  selectedYufuinRyokan,
  selectedBeppuRyokan,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'schematic'>('map')
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)

  const yufuinCoord = RYOKAN_COORDS[selectedYufuinRyokan.id] || RYOKAN_COORDS['yufuin-yufuintei']
  const beppuCoord = RYOKAN_COORDS[selectedBeppuRyokan.id] || RYOKAN_COORDS['seikai-p']

  const allStops: MapStop[] = useMemo(
    () => [
      // DAY 1
      {
        id: 'd1-1',
        day: 1,
        order: 1,
        time: '12:45 ~ 13:25',
        name: '오이타 공항 (국제선 리무진 승강장)',
        jpName: '大分空港 (Oita Airport)',
        category: '공항',
        lat: 33.4794,
        lng: 131.7372,
        summary: '제주항공 7C1512 도착 후 15분 입국심사 컷! 출구 왼편에서 13:25 유후인행 직행 리무진 탑승',
        babyPoint: '탑승 전 도착 로비 화장실 기저귀 교환대에서 기저귀 교체 시 55분 내내 낮잠 유도 가능',
        nextTransit: {
          mode: '🚌 유후인 패스트라이너 리무진',
          duration: '55분 (논스톱)',
          distance: '54km',
          color: '#8C5A3C',
        },
        googleMapsQuery: 'Oita Airport',
      },
      {
        id: 'd1-2',
        day: 1,
        order: 2,
        time: '14:20 ~ 14:35',
        name: '유후인역 앞 버스센터 & 유후인 치키',
        jpName: '由布院駅前バスセンター / ゆふいんチッキ',
        category: '교통/정류장',
        lat: 33.2625,
        lng: 131.3549,
        summary: '리무진 하차 즉시 맞은편 「유후인 치키」에 28인치 캐리어 3개를 맡겨 숙소로 당일 배송 위탁',
        babyPoint: '무거운 캐리어 3개를 먼저 보내고 유모차 1대만 밀고 산책을 시작해 부모님 체력 세이브',
        nextTransit: {
          mode: '🚶 평지 유모차 산책',
          duration: '도보 15~20분',
          distance: '1.4km',
          color: '#8C5A3C',
          dashed: true,
        },
        googleMapsQuery: 'Yufuin Station',
      },
      {
        id: 'd1-3',
        day: 1,
        order: 3,
        time: '14:35 ~ 15:40',
        name: '유노츠보 거리 & 긴린코 호수',
        jpName: '湯の坪街道 · 金鱗湖',
        category: '관광/산책',
        lat: 33.2665,
        lng: 131.3687,
        summary: '미르히 따뜻한 우유 푸딩·고로케 간식 타임 및 긴린코 호수 평지 산책로 가족 사진 촬영',
        babyPoint: '미르히 치즈케이크·우유 푸딩 윗부분과 군고구마는 13개월 아기 간식으로 최고',
        nextTransit: {
          mode: '🚕 택시 기본요금 또는 도보',
          duration: '4~7분',
          distance: '0.8km',
          color: '#8C5A3C',
        },
        googleMapsQuery: 'Kinrinko Lake Yufuin',
      },
      {
        id: 'd1-4',
        day: 1,
        order: 4,
        time: '15:45 ~ 익일 10:00',
        name: `[1박 숙소] ${yufuinCoord.shortName}`,
        jpName: selectedYufuinRyokan.jpName,
        category: '숙소(료칸)',
        lat: yufuinCoord.lat,
        lng: yufuinCoord.lng,
        summary: `${selectedYufuinRyokan.roomType} 체크인 · 첫 가족 온천욕(38.5°C) 및 분고규 가이세키 석식`,
        babyPoint: '유후인 단순온천은 무색무취 저자극 수질로 13개월 아기 첫 입욕에 가장 안전함',
        googleMapsQuery: selectedYufuinRyokan.enSearchQuery,
      },

      // DAY 2
      {
        id: 'd2-1',
        day: 2,
        order: 1,
        time: '10:00 ~ 10:15',
        name: `[체크아웃] ${yufuinCoord.shortName}`,
        jpName: selectedYufuinRyokan.jpName,
        category: '숙소(료칸)',
        lat: yufuinCoord.lat,
        lng: yufuinCoord.lng,
        summary: '아침 물안개 노천탕 입욕 및 일본식 조식(연두부·계란찜·김) 식사 후 체크아웃',
        babyPoint: '조식 연두부와 구운 김으로 아기 아침밥을 든든히 먹인 뒤 출발',
        nextTransit: {
          mode: '🚕 송영/택시 또는 도보',
          duration: '5~8분',
          distance: '1.1km',
          color: '#29527A',
        },
        googleMapsQuery: selectedYufuinRyokan.enSearchQuery,
      },
      {
        id: 'd2-2',
        day: 2,
        order: 2,
        time: '11:44 ~ 12:49',
        name: 'JR 유후인역 (1번 평지 승강장)',
        jpName: 'JR由布院駅',
        category: '교통/정류장',
        lat: 33.2623,
        lng: 131.3545,
        summary: '계단 없는 1번 홈에서 벳푸 직통 「JR 특급 유후 2호(11:44)」 또는 「유후 4호(14:16)」 탑승',
        babyPoint: '반드시 오이타역 환승이 없는 「벳푸역 종착 직통 특급」 맨 뒷자리(수하물 공간 앞) 3석 지정!',
        nextTransit: {
          mode: '🚆 JR 특급 유후 (무환승 직통)',
          duration: '65분',
          distance: '42km',
          color: '#29527A',
        },
        googleMapsQuery: 'Yufuin Station',
      },
      {
        id: 'd2-3',
        day: 2,
        order: 3,
        time: '12:49 ~ 13:00',
        name: 'JR 벳푸역 (동쪽 출구 택시 승강장)',
        jpName: 'JR別府駅',
        category: '교통/정류장',
        lat: 33.2794,
        lng: 131.5003,
        summary: '벳푸역 도착 후 엘리베이터로 내려와 동쪽 출구에서 대형 트렁크 택시(도요타 JPN TAXI) 탑승',
        babyPoint: '지붕 높은 왜건형 JPN TAXI를 타면 28인치 캐리어 3개와 유모차가 한 번에 적재됨',
        nextTransit: {
          mode: '🚕 도요타 JPN TAXI',
          duration: '5분 (약 ¥800)',
          distance: '1.2km',
          color: '#29527A',
        },
        googleMapsQuery: 'Beppu Station',
      },
      {
        id: 'd2-4',
        day: 2,
        order: 4,
        time: '13:00 ~ 14:45',
        name: '유메타운 벳푸 (점심 & 아기용품·마트 장보기)',
        jpName: 'ゆめタウン別府 (YouMe Town Beppu)',
        category: '식당/쇼핑',
        lat: 33.2752,
        lng: 131.5059,
        summary: '1층 대형 락커에 캐리어 보관 후 점심 식사 & 2박 동안 먹을 아기 이유식·딸기·우유·어른 야식 쇼핑',
        babyPoint: '3층 유아 휴게실에 70°C 조유 온수기, 이유식 전자레인지, 기저귀 교환대 완벽 구비',
        nextTransit: {
          mode: '🚕 해안도로 택시',
          duration: '8분 (약 ¥1,300)',
          distance: '3.8km',
          color: '#29527A',
        },
        googleMapsQuery: 'YouMe Town Beppu',
      },
      {
        id: 'd2-5',
        day: 2,
        order: 5,
        time: '15:00 ~ (2박 연박)',
        name: `[2박 연박] ${beppuCoord.shortName}`,
        jpName: selectedBeppuRyokan.jpName,
        category: '숙소(료칸)',
        lat: beppuCoord.lat,
        lng: beppuCoord.lng,
        summary: '하레노무네 5층 최상층 129㎡ P타입(또는 오션뷰 객실) 2박 연박 체크인! 짐 완전 정리 및 오션뷰 온천',
        babyPoint: '10조 다다미방에 아기를 재우고 미닫이문을 닫으면 13조 거실과 노천탕에서 어른 3인 자유시간!',
        googleMapsQuery: selectedBeppuRyokan.enSearchQuery,
      },

      // DAY 3
      {
        id: 'd3-1',
        day: 3,
        order: 1,
        time: '09:30 출발',
        name: `[연박 출발] ${beppuCoord.shortName}`,
        jpName: selectedBeppuRyokan.jpName,
        category: '숙소(료칸)',
        lat: beppuCoord.lat,
        lng: beppuCoord.lng,
        summary: '2박 연박이라 짐 쌀 필요 없이 유모차와 가벼운 기저귀 가방 1개만 들고 로비에서 택시 탑승',
        babyPoint: '오전 컨디션이 가장 좋을 때 수족관으로 바로 이동',
        nextTransit: {
          mode: '🚕 해안 택시 직행',
          duration: '8분 (약 ¥1,400)',
          distance: '3.9km',
          color: '#2D662D',
        },
        googleMapsQuery: selectedBeppuRyokan.enSearchQuery,
      },
      {
        id: 'd3-2',
        day: 3,
        order: 2,
        time: '09:40 ~ 12:00',
        name: '오이타 마린팰리스 수족관 「우미타마고」',
        jpName: 'うみたまご (Umitamago Aquarium)',
        category: '관광/산책',
        lat: 33.2591,
        lng: 131.5388,
        summary: '100% 무단차·유모차 친화형 수족관! 10:30 바다코끼리 쇼 & 11:00 돌고래 퍼포먼스 관람',
        babyPoint: '수조 통유리가 바닥까지 낮게 설계되어 13개월 아기가 유모차에 앉아서도 물고기와 눈맞춤 가능',
        nextTransit: {
          mode: '🚕 택시 이동',
          duration: '12분 (약 ¥1,800)',
          distance: '7.8km',
          color: '#2D662D',
        },
        googleMapsQuery: 'Umitamago Aquarium Beppu',
      },
      {
        id: 'd3-3',
        day: 3,
        order: 3,
        time: '12:15 ~ 14:30',
        name: '칸나와 지옥찜 공방 & 가마도 지옥',
        jpName: '地獄蒸し工房 鉄輪 · かまど地獄',
        category: '식당/쇼핑',
        lat: 33.3156,
        lng: 131.4701,
        summary: '천연 온천 증기로 쪄낸 지옥찜(또는 카메쇼 회전초밥) 점심 후 도보 3분 가마도 지옥 코발트 온천 관람',
        babyPoint: '소금 없이 순수 온천 증기로 쪄낸 단호박·고구마·계란·흰살생선은 13개월 아기 최고의 건강 특식',
        nextTransit: {
          mode: '🚕 택시 복귀',
          duration: '10분 (약 ¥1,500)',
          distance: '3.4km',
          color: '#2D662D',
        },
        googleMapsQuery: 'Kamado Jigoku Beppu',
      },
      {
        id: 'd3-4',
        day: 3,
        order: 4,
        time: '14:40 ~ 21:00',
        name: `[연박 복귀 & 교대 힐링] ${beppuCoord.shortName}`,
        jpName: selectedBeppuRyokan.jpName,
        category: '숙소(료칸)',
        lat: beppuCoord.lat,
        lng: beppuCoord.lng,
        summary: '오후 2시 40분 조기 복귀 후 아기 낮잠 2시간 & 어른 3명 「2:1 교대」 인피니티 대욕장·해변 카페 자유시간',
        babyPoint: '3일차 오후 피로를 연박 객실 낮잠으로 완벽히 풀어주어 저녁 만찬까지 컨디션 최상 유지',
        googleMapsQuery: selectedBeppuRyokan.enSearchQuery,
      },

      // DAY 4
      {
        id: 'd4-1',
        day: 4,
        order: 1,
        time: '08:00 ~ 10:15',
        name: `[체크아웃] ${beppuCoord.shortName}`,
        jpName: selectedBeppuRyokan.jpName,
        category: '숙소(료칸)',
        lat: beppuCoord.lat,
        lng: beppuCoord.lng,
        summary: '벳푸만 일출 노천 온천욕 & 오션뷰 조식 후 10:15 여유로운 체크아웃',
        babyPoint: '출발 직전 객실에서 새 기저귀로 갈아주고 아침 이유식/우유 완료',
        nextTransit: {
          mode: '🚶 해안 평지 인도 도보',
          duration: '4분',
          distance: '280m',
          color: '#A64B2A',
          dashed: true,
        },
        googleMapsQuery: selectedBeppuRyokan.enSearchQuery,
      },
      {
        id: 'd4-2',
        day: 4,
        order: 2,
        time: '10:39 ~ 11:25',
        name: '벳푸 롯카세이(六盛) 에어라이너 정류장',
        jpName: '六盛(別府上人ヶ浜) 空港バス停',
        category: '교통/정류장',
        lat: 33.3095,
        lng: 131.5008,
        summary: '벳푸역까지 되돌아갈 필요 없이 세이카이 도보 4분 정류장에서 오이타공항행 에어라이너 바로 탑승!',
        babyPoint: '1일차에 구매한 4매 회수권 잔여 1매를 여기서 알뜰하게 사용 (유아 무료)',
        nextTransit: {
          mode: '🚌 오이타공항 에어라이너',
          duration: '45분 (해안 고속도로)',
          distance: '35km',
          color: '#A64B2A',
        },
        googleMapsQuery: 'Shoningahama Park Beppu',
      },
      {
        id: 'd4-3',
        day: 4,
        order: 3,
        time: '11:25 ~ 13:55 출국',
        name: '오이타 공항 (족욕탕·수유실·제주항공 7C1511)',
        jpName: '大分空港 国際線ターミナル',
        category: '공항',
        lat: 33.4794,
        lng: 131.7372,
        summary: '체크인 수속 후 국내선 2층 토리텐·우동 점심 식사 & 1층 무료 온천 족욕탕 체험 후 13:55 인천행 탑승',
        babyPoint: '13:55 이륙 시간이 아기 오후 낮잠 시간과 딱 맞아 인천(15:50 도착)까지 편안하게 비행',
        googleMapsQuery: 'Oita Airport',
      },
    ],
    [selectedYufuinRyokan, selectedBeppuRyokan, yufuinCoord, beppuCoord]
  )

  const filteredStops = useMemo(() => {
    if (activeDayFilter === 'all') return allStops
    return allStops.filter((s) => s.day === activeDayFilter)
  }, [allStops, activeDayFilter])

  const activeSelectedStop = useMemo(() => {
    if (selectedStopId) {
      const found = filteredStops.find((s) => s.id === selectedStopId)
      if (found) return found
    }
    return filteredStops[0] || null
  }, [filteredStops, selectedStopId])

  // Build Google Maps Directions URL for current day or entire trip
  const googleMapsDirectionsUrl = useMemo(() => {
    if (filteredStops.length < 2) return 'https://www.google.com/maps'
    const origin = `${filteredStops[0].lat},${filteredStops[0].lng}`
    const destination = `${filteredStops[filteredStops.length - 1].lat},${
      filteredStops[filteredStops.length - 1].lng
    }`
    const waypoints = filteredStops
      .slice(1, -1)
      .map((s) => `${s.lat},${s.lng}`)
      .join('|')
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}${
      waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ''
    }&travelmode=driving`
  }, [filteredStops])

  // Initialize Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [33.34, 131.52],
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      layerGroupRef.current = L.layerGroup().addTo(map)
      mapInstanceRef.current = map
    }

    const map = mapInstanceRef.current
    const layerGroup = layerGroupRef.current
    if (!map || !layerGroup) return

    layerGroup.clearLayers()

    // Draw polylines per day
    const daysToDraw = activeDayFilter === 'all' ? [1, 2, 3, 4] : [activeDayFilter]

    daysToDraw.forEach((d) => {
      const dayStops = allStops.filter((s) => s.day === d)
      const dayColor = DAY_META[d]?.color || '#8C5A3C'

      for (let i = 0; i < dayStops.length - 1; i++) {
        const from = dayStops[i]
        const to = dayStops[i + 1]
        const isDashed = from.nextTransit?.dashed

        // Subtle outer glow line
        L.polyline(
          [
            [from.lat, from.lng],
            [to.lat, to.lng],
          ],
          {
            color: '#FFFFFF',
            weight: 7,
            opacity: 0.85,
          }
        ).addTo(layerGroup)

        // Main colored route line
        const poly = L.polyline(
          [
            [from.lat, from.lng],
            [to.lat, to.lng],
          ],
          {
            color: dayColor,
            weight: 4,
            opacity: 0.95,
            dashArray: isDashed ? '6, 8' : undefined,
          }
        ).addTo(layerGroup)

        // Add midpoint transit badge tooltip on map when viewing single day
        if (activeDayFilter !== 'all' && from.nextTransit) {
          const midLat = (from.lat + to.lat) / 2
          const midLng = (from.lng + to.lng) / 2
          const transitIcon = L.divIcon({
            className: 'custom-transit-pill',
            html: `<div style="background:#191816;color:#E5C89B;font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;border:1.5px solid #E5C89B;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.25);transform:translate(-50%,-50%);display:inline-block;">${from.nextTransit.mode.split(' ')[0]} ${from.nextTransit.duration.split(' ')[0]}</div>`,
            iconSize: [0, 0],
          })
          L.marker([midLat, midLng], { icon: transitIcon, interactive: false }).addTo(layerGroup)
        }

        void poly
      }
    })

    // Draw numbered markers
    const boundsPoints: [number, number][] = []

    filteredStops.forEach((stop) => {
      const dayColor = DAY_META[stop.day]?.color || '#191816'
      const isSelected = activeSelectedStop?.id === stop.id
      boundsPoints.push([stop.lat, stop.lng])

      const badgeLabel =
        activeDayFilter === 'all' ? `D${stop.day}-${stop.order}` : `${stop.order}`

      const markerHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${isSelected ? '34px' : '28px'};
          height: ${isSelected ? '34px' : '28px'};
          border-radius: 9999px;
          background: ${isSelected ? '#191816' : dayColor};
          color: ${isSelected ? '#E5C89B' : '#FFFFFF'};
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: ${activeDayFilter === 'all' ? '10px' : '12px'};
          font-weight: 800;
          border: ${isSelected ? '3px solid #E5C89B' : '2.5px solid #FFFFFF'};
          box-shadow: 0 3px 10px rgba(0,0,0,0.35);
          transform: translate(-50%, -50%);
          transition: all 0.2s ease;
        ">
          ${badgeLabel}
        </div>
      `

      const customIcon = L.divIcon({
        className: 'custom-stop-marker',
        html: markerHtml,
        iconSize: [0, 0],
      })

      const marker = L.marker([stop.lat, stop.lng], { icon: customIcon }).addTo(layerGroup)

      marker.bindPopup(
        `<div style="font-family:Pretendard,sans-serif;min-width:210px;padding:2px;">
          <div style="font-size:10px;font-weight:700;color:${dayColor};text-transform:uppercase;">
            Day 0${stop.day} · Stop 0${stop.order} (${stop.time})
          </div>
          <div style="font-size:13px;font-weight:700;color:#191816;margin-top:2px;">
            ${stop.name}
          </div>
          <div style="font-size:11px;color:#5C5852;margin-top:4px;line-height:1.4;">
            ${stop.summary}
          </div>
          ${
            stop.nextTransit
              ? `<div style="margin-top:6px;padding:4px 6px;background:#FAF6EE;border:1px solid #E5DEC9;font-size:10px;color:#8C5A3C;font-weight:600;">
                  다음 이동: ${stop.nextTransit.mode} (${stop.nextTransit.duration})
                </div>`
              : ''
          }
        </div>`,
        { closeButton: false, offset: [0, -10] }
      )

      marker.on('click', () => {
        setSelectedStopId(stop.id)
      })
    })

    if (boundsPoints.length > 0) {
      const bounds = L.latLngBounds(boundsPoints)
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14, animate: true })
    }

    setTimeout(() => {
      map.invalidateSize()
    }, 120)
  }, [viewMode, activeDayFilter, filteredStops, allStops, activeSelectedStop])

  // Focus map when user clicks a stop pill
  const handleSelectStop = (stop: MapStop) => {
    setSelectedStopId(stop.id)
    if (viewMode === 'map' && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([stop.lat, stop.lng], 13, {
        duration: 0.6,
      })
    }
  }

  const currentMeta = activeDayFilter === 'all' ? null : DAY_META[activeDayFilter]

  return (
    <div className="bg-white border-2 border-[#191816] shadow-xs overflow-hidden">
      {/* Top Bar: Day Route Tabs & View Switcher */}
      <div className="bg-[#191816] text-[#F6F3EC] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#E5C89B] text-[#191816] text-[10px] font-bold uppercase tracking-wider">
                Interactive Route Map
              </span>
              <span className="text-xs text-[#E5C89B] font-medium">
                숙소 변경 시 지도 핀 자동 연동
              </span>
            </div>
            <h3 className="font-serif-kr text-lg sm:text-2xl font-normal text-white mt-1.5">
              일자별 실제 지도 경로 & 스톱별 이동시간 시각화
            </h3>
          </div>

          {/* View Mode & Google Maps Full Route Link */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex border border-white/25 bg-white/5 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-[#E5C89B] text-[#191816]'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                🗺️ 실제 지도 경로
              </button>
              <button
                type="button"
                onClick={() => setViewMode('schematic')}
                className={`px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  viewMode === 'schematic'
                    ? 'bg-[#E5C89B] text-[#191816]'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                📐 노선도 다이어그램
              </button>
            </div>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#E5C89B] border border-[#E5C89B]/40 transition"
            >
              Google 지도 앱으로 경로 열기 ↗
            </a>
          </div>
        </div>

        {/* Day Selector Tabs (Synced with parent activeDayFilter) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onSelectDay('all')
              setSelectedStopId(null)
            }}
            className={`p-2.5 text-left border transition cursor-pointer ${
              activeDayFilter === 'all'
                ? 'bg-[#E5C89B] text-[#191816] border-[#E5C89B] font-bold'
                : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-80">All 4 Days</div>
            <div className="text-xs sm:text-sm mt-0.5">전체 3박 4일 광역 루트</div>
          </button>

          {[1, 2, 3, 4].map((d) => {
            const active = activeDayFilter === d
            const meta = DAY_META[d]
            return (
              <button
                key={d}
                type="button"
                onClick={() => {
                  onSelectDay(d)
                  setSelectedStopId(null)
                }}
                className={`p-2.5 text-left border transition cursor-pointer ${
                  active
                    ? 'bg-[#E5C89B] text-[#191816] border-[#E5C89B] font-bold'
                    : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: active ? '#191816' : meta.color }}
                    />
                    Day 0{d}
                  </span>
                  <span className="opacity-75">{meta.totalDist}</span>
                </div>
                <div className="text-xs sm:text-sm truncate mt-0.5">
                  {d === 1 && '공항 ➔ 유후인 산책·1박'}
                  {d === 2 && '유후인 ➔ 특급열차 ➔ 벳푸'}
                  {d === 3 && '수족관 ➔ 지옥찜 ➔ 리조트'}
                  {d === 4 && '벳푸 ➔ 에어라이너 ➔ 공항'}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sub-header Banner for Current Day Route Summary */}
      <div className="bg-[#EFECE4] border-b border-[#D8D1C5] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        {currentMeta ? (
          <>
            <div className="flex items-center gap-2 font-medium text-[#191816]">
              <span
                className="px-2 py-0.5 text-white text-[11px] font-bold"
                style={{ backgroundColor: currentMeta.color }}
              >
                {currentMeta.badge}
              </span>
              <span>{currentMeta.title}</span>
            </div>
            <div className="text-[#5C5852] flex items-center gap-3">
              <span>📏 이동 거리: <strong>{currentMeta.totalDist}</strong></span>
              <span>⏱ 차량/열차 탑승: <strong>{currentMeta.totalTime}</strong></span>
            </div>
          </>
        ) : (
          <>
            <div className="font-medium text-[#191816]">
              📍 <strong>3박 4일 전체 루트:</strong> 오이타공항(Day 1) ➔ 유후인 1박 ➔ JR 특급열차(Day 2) ➔ 벳푸 2박 연박(Day 2~3) ➔ 오이타공항 귀국(Day 4)
            </div>
            <div className="text-[#8C5A3C] font-semibold">
              총 4일 중 짐 들고 이동하는 날은 단 2번뿐! (유후인 치키 배송 + 벳푸 2박 연박)
            </div>
          </>
        )}
      </div>

      {/* Main Map or Schematic Canvas */}
      {viewMode === 'map' ? (
        <div className="grid lg:grid-cols-12">
          {/* Interactive Leaflet Map (7 cols) */}
          <div className="lg:col-span-7 relative border-b lg:border-b-0 lg:border-r border-[#D8D1C5]">
            <div
              ref={mapContainerRef}
              className="w-full h-[340px] sm:h-[430px] z-10 bg-[#E6E2D8]"
            />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-20 bg-[#191816]/90 backdrop-blur-xs text-white px-3 py-2 text-[11px] flex flex-wrap items-center gap-3 border border-white/15 shadow">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C5A3C] inline-block" /> Day 1 유후인
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#29527A] inline-block" /> Day 2 JR특급·벳푸
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D662D] inline-block" /> Day 3 수족관·지옥찜
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A64B2A] inline-block" /> Day 4 공항귀국
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Stop-by-Stop Route Chain (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#FAF8F4] max-h-[430px] overflow-y-auto">
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#DFD9CE] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C5A3C]">
                  📍 경유지 순서 (클릭 시 지도 포커스)
                </span>
                <span className="text-[11px] text-[#78736A]">총 {filteredStops.length}개 지점</span>
              </div>

              <div className="space-y-2">
                {filteredStops.map((stop) => {
                  const isSelected = activeSelectedStop?.id === stop.id
                  const dayColor = DAY_META[stop.day]?.color || '#191816'

                  return (
                    <div key={stop.id} className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectStop(stop)}
                        className={`w-full text-left p-3 border transition cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#191816] text-[#F6F3EC] border-[#191816] shadow-xs'
                            : 'bg-white hover:bg-[#EFECE4] text-[#191816] border-[#DFD9CE]'
                        }`}
                      >
                        <span
                          className="w-6 h-6 rounded-full text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor: isSelected ? '#E5C89B' : dayColor,
                            color: isSelected ? '#191816' : '#FFFFFF',
                          }}
                        >
                          {activeDayFilter === 'all' ? `D${stop.day}` : stop.order}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2 text-[11px]">
                            <span
                              className={`font-mono font-semibold ${
                                isSelected ? 'text-[#E5C89B]' : 'text-[#8C5A3C]'
                              }`}
                            >
                              {stop.time}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 text-[10px] ${
                                isSelected
                                  ? 'bg-white/15 text-white'
                                  : 'bg-[#EFECE4] text-[#5C5852]'
                              }`}
                            >
                              {stop.category}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm font-semibold truncate mt-0.5">
                            {stop.name}
                          </div>
                          <p
                            className={`text-[11px] mt-1 leading-relaxed ${
                              isSelected ? 'text-white/80' : 'text-[#5C5852]'
                            }`}
                          >
                            {stop.summary}
                          </p>
                        </div>
                      </button>

                      {/* Transit Connector Pill */}
                      {stop.nextTransit && (
                        <div className="pl-6 flex items-center gap-2 text-[11px] text-[#5C5852] py-0.5">
                          <span className="text-[#8C5A3C] font-bold">↓</span>
                          <span className="px-2 py-0.5 bg-[#EFECE4] border border-[#DFD9CE] font-medium text-[#191816]">
                            {stop.nextTransit.mode}
                          </span>
                          <span className="text-[#78736A]">
                            {stop.nextTransit.duration} · {stop.nextTransit.distance}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Schematic Step-by-Step Visual Diagram Mode */
        <div className="p-5 sm:p-8 bg-[#FAF8F4] space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredStops.map((stop, idx) => {
              const dayColor = DAY_META[stop.day]?.color || '#191816'
              return (
                <div
                  key={stop.id}
                  className="bg-white border border-[#191816] p-4 flex flex-col justify-between space-y-3 relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="px-2 py-0.5 text-[10px] font-mono font-bold text-white"
                        style={{ backgroundColor: dayColor }}
                      >
                        DAY {stop.day} · STEP 0{stop.order}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-[#8C5A3C]">
                        {stop.time}
                      </span>
                    </div>

                    <h4 className="font-serif-kr text-sm sm:text-base font-bold text-[#191816]">
                      {stop.name}
                    </h4>
                    <p className="text-xs text-[#4A4742] leading-relaxed">{stop.summary}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#EFECE4]">
                    <div className="p-2 bg-[#FFFDF5] border border-[#F3E7C4] text-[11px] text-[#6D4C00]">
                      <strong className="text-[#A66700]">👶 아기 팁:</strong> {stop.babyPoint}
                    </div>

                    {stop.nextTransit && idx < filteredStops.length - 1 && (
                      <div className="p-2 bg-[#EFECE4] text-[11px] font-semibold text-[#191816] flex items-center justify-between">
                        <span>➔ {stop.nextTransit.mode}</span>
                        <span className="text-[#8C5A3C]">{stop.nextTransit.duration}</span>
                      </div>
                    )}

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        stop.googleMapsQuery + ' ' + stop.jpName
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-1.5 text-[11px] border border-[#D8D1C5] hover:border-[#191816] text-[#191816] transition font-medium"
                    >
                      📍 구글맵 위치 보기 ↗
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom Selected Stop Detail Bar */}
      {activeSelectedStop && (
        <div className="bg-[#FAF6EE] border-t border-[#D8D1C5] px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-[#191816] text-[#E5C89B] font-mono text-[10px] font-bold">
                선택된 지점 · Day 0{activeSelectedStop.day} #{activeSelectedStop.order}
              </span>
              <strong className="text-sm text-[#191816]">{activeSelectedStop.name}</strong>
              <span className="text-[#78736A]">({activeSelectedStop.jpName})</span>
            </div>
            <p className="text-[#6D4C00] mt-1">
              <strong>👶 13개월 아기 동선 포인트:</strong> {activeSelectedStop.babyPoint}
            </p>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              activeSelectedStop.googleMapsQuery + ' ' + activeSelectedStop.jpName
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#191816] text-[#F6F3EC] font-semibold hover:bg-[#33312E] transition shrink-0 text-center"
          >
            📍 이 장소 Google 지도 열기 ↗
          </a>
        </div>
      )}
    </div>
  )
}

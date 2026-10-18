export type RegionId = 'beppu-yufuin' | 'ureshino-takeo' | 'yufuin-fukuoka'
export type PricePlanType = 'ota-halfboard' | 'ota-breakfast' | 'rack-rate'

export interface RyokanOption {
  id: string
  stayZone: 'yufuin-1n' | 'beppu-2n'
  nights: number
  name: string
  jpName: string
  enSearchQuery: string
  area: string
  stationAccess: string
  tag: string
  roomType: string
  bathType: string
  mealType: string
  babyPerks: string[]
  babyFeeNote: string
  // 성인 3명 + 13개월 아기(소이네 무료/현장소액) 1객실 1박 합산 가격 (단위: 원 / 엔)
  otaBreakfastKRW: number
  otaBreakfastJPY: number
  otaHalfBoardKRW: number
  otaHalfBoardJPY: number
  pricePerNightKRW: number
  pricePerNightJPY: number
  bestPlatform: string
  rating: number
  highlight: string
}

export interface TimelineItem {
  time: string
  title: string
  place: string
  desc: string
  transport?: string
  timetableNote?: string
  luggageNote?: string
  babyTip: string
  adultTip?: string
  costKRW?: string
  strollerFriendly: '최상 (평지/엘리베이터)' | '양호 (일부 경사)' | '폴딩 후 탑승'
}

export interface DayPlan {
  day: number
  date: string
  dayOfWeek: string
  stayBadge: string
  theme: string
  routeSummary: string
  totalTransitMinutes: number
  items: TimelineItem[]
}

export interface TransitSegmentDetail {
  id: string
  stepBadge: string
  dayLabel: string
  title: string
  fromTo: string
  operatorAndName: string
  duration: string
  fare3Adults1Infant: string
  fareBreakdown: string
  schedules: {
    label: string
    depart: string
    arrive: string
    note: string
    recommended?: boolean
  }[]
  boardingSpot: string
  luggageAndStrollerPlan: string
  babyCarePoint: string
  proTips: string[]
}

export interface FlightOption {
  id: string
  airline: string
  airlineType: 'LCC (저비용항공사)'
  routeCode: string
  routeName: string
  targetRegionId: RegionId
  outboundFlight: string
  outboundTime: string
  inboundFlight: string
  inboundTime: string
  duration: string
  adultFareKRW: number
  infantFareKRW: number
  total3Adults1InfantKRW: number
  baggageRule: string
  babyService: string[]
  pros: string
  cons: string
  recommended?: boolean
}

export const CONFIRMED_FLIGHT: FlightOption = {
  id: '7c-oit-direct',
  airline: '제주항공 (Jeju Air) · [예매 완료 ✅]',
  airlineType: 'LCC (저비용항공사)',
  routeCode: 'ICN ↔ OIT',
  routeName: '인천(T1) ↔ 오이타 공항 직항',
  targetRegionId: 'beppu-yufuin',
  outboundFlight: '7C1512',
  outboundTime: '10:50 인천(T1) 출발 → 12:45 오이타 도착',
  inboundFlight: '7C1511',
  inboundTime: '13:55 오이타 출발 → 15:50 인천(T1) 도착',
  duration: '1시간 55분',
  adultFareKRW: 235000,
  infantFareKRW: 23500,
  total3Adults1InfantKRW: 235000 * 3 + 23500,
  baggageRule: '성인 위탁수하물 15kg×3개 (총 45kg) + 기내수하물 10kg×3개 + 휴대용 유모차 1대 무료 위탁',
  babyService: [
    '인천공항 제1여객터미널 「교통약자 우대 출국통로(패스트트랙)」 성인 3명 + 유아 동반 전원 이용 가능',
    '휴대용 유모차 「도어 투 도어(Door-to-Door)」 서비스로 탑승 게이트 앞까지 끌고 가서 위탁 가능',
    '소규모 오이타 공항 단독 입국심사로 착륙 후 15~20분 내 수하물 수령 및 리무진 탑승장 직결',
    '기내 온수 제공 가능 (승무원에게 요청 시 분유/실온 이유식 중탕용 온수 지원)',
  ],
  pros: '후쿠오카 공항 대비 육로 이동 시간 왕복 2시간 이상 단축! 공항 출구 바로 앞에서 유후인행 리무진 탑승',
  cons: '유아 별도 무료 위탁수하물(10kg)은 미제공되므로 아기 짐은 성인 캐리어 3개(총 45kg)에 분산 수납 권장',
  recommended: true,
}

export const FLIGHT_OPTIONS: FlightOption[] = [CONFIRMED_FLIGHT]

export const CONFIRMED_TRANSIT_SEGMENTS: TransitSegmentDetail[] = [
  {
    id: 'seg-1-airport-to-yufuin',
    stepBadge: 'TRANSIT 01 · DAY 1 (12/21 월)',
    dayLabel: '1일차 공항 → 유후인 이동',
    title: '오이타 공항 → 유후인역 앞 버스센터 (직행 공항 리무진 버스)',
    fromTo: '오이타 공항 국제선 출구 앞 ➔ 유후인역 앞 버스센터 (논스톱)',
    operatorAndName: '오이타교통(大分交通) · 유후인 패스트라이너 (Yufuin Fastliner)',
    duration: '약 55분 소요 (환승 없음 · 고속도로 직행)',
    fare3Adults1Infant: '성인 3인 ¥4,200 ~ ¥4,800 (약 42,000원) · 유아 무료',
    fareBreakdown: '성인 단권 ¥1,600×3인 = ¥4,800 / ★4매 묶음 회수권(¥5,600) 구매 시 장당 ¥1,400으로 할인!',
    schedules: [
      {
        label: '1순위 (제주항공 7C1512 도착 연동편)',
        depart: '13:25 오이타공항 출발',
        arrive: '14:20 유후인역 앞 도착',
        note: '12:45 비행기 착륙 후 입국심사(15분) 마치고 나오면 바로 대기 중인 전용 연동 버스',
        recommended: true,
      },
      {
        label: '예비편 (수하물 지연/수유 시)',
        depart: '14:30 오이타공항 출발',
        arrive: '15:25 유후인역 앞 도착',
        note: '공항 2층 수유실에서 아기 이유식/수유 후 여유롭게 탑승 가능한 차편',
      },
    ],
    boardingSpot: '오이타 공항 국제선 수하물 수취대 통과 → 출구로 나와 왼쪽(국내선 방향 도보 1분) 야외 버스 승강장 매표기',
    luggageAndStrollerPlan:
      '대형 리무진 버스 하부 화물칸에 28인치 캐리어 3개 + 폴딩 유모차 1대를 기사님이 직접 적재. 유후인역 하차 즉시 도보 1분 거리 「유후인 치키」에 캐리어 3개를 맡겨 숙소로 먼저 배송(개당 ¥700~900) 보내면 두 손이 완전히 자유로워집니다!',
    babyCarePoint:
      '만 1세(13개월) 유아는 성인 무릎 탑승 시 무료입니다. 13:25 출발 시간이 아기 식후 낮잠 시간과 정확히 겹치므로 버스 탑승 전 기저귀를 갈아주면 55분 내내 푹 재우며 이동할 수 있습니다.',
    proTips: [
      '어른 1명은 수하물 벨트에서 캐리어 3개를 챙기고, 다른 어른 1명이 먼저 밖으로 나가 버스 매표기에서 티켓을 끊으면 줄 서지 않고 좋은 좌석(앞쪽 2~3열)을 선점할 수 있습니다.',
      '매표기에서 「4매 회수권(4枚綴り回数券, ¥5,600)」을 발권하면, 1일차 유후인행에서 3장을 쓰고 남은 1장은 4일차 벳푸→오이타공항 에어라이너에서 그대로 사용할 수 있어 총 ¥800이 절약됩니다.',
    ],
  },
  {
    id: 'seg-2-yufuin-to-beppu-train',
    stepBadge: 'TRANSIT 02 · DAY 2 (12/22 화)',
    dayLabel: '2일차 유후인 → 벳푸 이동',
    title: 'JR 유후인역 → JR 벳푸역 (JR 특급열차 직통 이동)',
    fromTo: 'JR 유후인역 1번 승강장 ➔ (오이타역 경유 직통) ➔ JR 벳푸역',
    operatorAndName: 'JR 규슈 특급 「유후(Yufu)」 또는 관광특급 「유후인노모리(Yufuin no Mori)」',
    duration: '약 1시간 05분 소요 (반드시 벳푸역 종착 직통편 탑승!)',
    fare3Adults1Infant: '성인 3인 지정석 약 ¥8,400 ~ ¥9,900 (약 80,000원) · 유아 무료',
    fareBreakdown: '성인 1인 편도 운임(¥950) + 특급권 지정석(약 ¥1,850~¥2,350) × 3석 / 13개월 유아 무릎 탑승 무료',
    schedules: [
      {
        label: '★추천 1순위: JR 특급 유후 2호 (Yufu 2 · 벳푸 직통)',
        depart: '11:44 JR 유후인역 출발',
        arrive: '12:49 JR 벳푸역 도착',
        note: '료칸 10:00 체크아웃 후 유후인역 주변 카페/기념품 구경 후 탑승! 환승 없이 벳푸역에 점심시간 맞춰 도착',
        recommended: true,
      },
      {
        label: '추천 2순위: JR 특급 유후 4호 (Yufu 4 · 벳푸 직통)',
        depart: '14:16 JR 유후인역 출발',
        arrive: '15:24 JR 벳푸역 도착',
        note: '유후인에서 점심 식사까지 여유롭게 즐긴 뒤 벳푸 리조트 체크인(15:00~) 시간에 맞춰 바로 이동하는 직통편',
        recommended: true,
      },
      {
        label: '감성 옵션: 관광특급 유후인노모리 (주의: 오이타행/하카타행 확인 필수)',
        depart: '유후인노모리 벳푸 연장 운행편 확인',
        arrive: '약 1시간 소요',
        note: '동계 시즌 다이어그램에 따라 유후인노모리가 벳푸까지 가는 날과 하카타로만 가는 날이 나뉘므로, 벳푸 직통은 「특급 유후 2호/4호」가 가장 확실하고 쾌적합니다!',
      },
    ],
    boardingSpot: 'JR 유후인역 개찰구 앞 (1번 승강장 — 역 입구와 평지로 바로 연결되어 계단이나 엘리베이터를 탈 필요가 전혀 없음!)',
    luggageAndStrollerPlan:
      '지정석 예매 시 각 호차의 「맨 뒷자리」 또는 「맨 앞자리(특대수하물 공간 인접석)」 3석을 예약하세요. 28인치 캐리어 3개와 폴딩한 유모차를 좌석 바로 뒤 수하물 공간에 나란히 세워둘 수 있습니다.',
    babyCarePoint:
      'JR 규슈 규정상 만 1세 유아는 무료(지정석 성인 무릎 탑승)입니다. 다만 「특급 유후」 자유석 칸이 여유로울 때는 성인 3명 옆 빈자리에 아기를 잠시 앉히기도 편하며, 열차 내 다목적 화장실에 기저귀 교환대가 설치되어 있습니다.',
    proTips: [
      '중요 체크! 유후인역에서 출발하는 일반 보통열차나 일부 특급은 「오이타역」까지만 가고 오이타역에서 벳푸행 열차로 환승해야 합니다. 아기와 캐리어 3개가 있으니 반드시 환승 없는 「벳푸행 직통 특급 유후 2호(11:44) 또는 4호(14:16)」를 타세요!',
      '유후인역 옆 「유후인 시노쿠라」 또는 역 앞 베이커리에서 유후인 사이다, 푸딩, 도시락(에키벤)을 사서 기차 안에서 먹으면 어른 3명 모두 기차 여행 낭만을 제대로 즐길 수 있습니다.',
    ],
  },
  {
    id: 'seg-3-beppu-local-taxi-shuttle',
    stepBadge: 'TRANSIT 03 · DAY 2~3 (12/22 화 ~ 12/23 수)',
    dayLabel: '2~3일차 벳푸 시내 이동',
    title: 'JR 벳푸역 ↔ 리조트(2박) ↔ 수족관·지옥순례 (택시 & 호텔 무료 셔틀)',
    fromTo: '벳푸역 · 유메타운 · 세이카이/스기노이 · 우미타마고 수족관 · 칸나와(가마도 지옥)',
    operatorAndName: '벳푸 역전 택시 (Uber / GO / 카카오T 호출 가능) & 스기노이 무료 셔틀버스',
    duration: '모든 핵심 구간 택시 5분 ~ 12분 이내 (단거리 도어투도어)',
    fare3Adults1Infant: '2일간 택시 총 4~5회 탑승 시 약 ¥6,500 (약 60,000원)',
    fareBreakdown: '성인 3명 + 유아 1명은 일반 중형 택시(승차 정원 4인, 유아는 인원 산정 유리) 1대에 탑승 가능! 트렁크에 캐리어 2개+유모차, 조수석 바닥/빈 공간에 캐리어 1개 수납 (또는 역에서 큰 택시/점보택시 승차)',
    schedules: [
      {
        label: '구간 A: JR 벳푸역 → 유메타운 벳푸 → 아마네 리조트 세이카이',
        depart: '택시 상시 대기',
        arrive: '역→유메타운 5분(¥800) / 유메타운→세이카이 8분(¥1,300)',
        note: '스기노이 호텔 선택 시에는 JR 벳푸역 서쪽 출구(니시구치)에서 15분 간격 무료 셔틀버스 탑승!',
        recommended: true,
      },
      {
        label: '구간 B (3일차 오전): 숙소 → 우미타마고 수족관',
        depart: '09:30 호텔 로비 콜택시 탑승',
        arrive: '09:38 수족관 정문 하차 (약 8분 · ¥1,400)',
        note: '세이카이에서 해안도로로 직진 8분 거리! 버스 기다릴 필요 없이 정문 앞에 바로 하차',
        recommended: true,
      },
      {
        label: '구간 C (3일차 점심/오후): 우미타마고 수족관 → 칸나와(지옥찜·가마도지옥) → 숙소',
        depart: '12:00 수족관 택시 승강장',
        arrive: '12:12 칸나와 온천가 도착 (약 12분 · ¥1,800)',
        note: '지옥찜 점심 & 가마도 지옥 관람 후 숙소까지 택시 10분(¥1,500) 복귀하여 아기 낮잠',
        recommended: true,
      },
    ],
    boardingSpot: 'JR 벳푸역 동쪽 출구(히가시구치) 택시 승강장 (세이카이/유메타운 방향) 또는 서쪽 출구(니시구치, 스기노이 무료 셔틀 승강장)',
    luggageAndStrollerPlan:
      '2일차 벳푸역 도착 시 캐리어 3개가 있으므로, 벳푸역 동쪽 출구 택시 승강장에서 차체가 높은 「도요타 JPN TAXI(왜건형 블랙캡 택시)」를 골라 타면 트렁크에 28인치 캐리어 3개와 유모차가 한 번에 실립니다!',
    babyCarePoint:
      '벳푸는 관광지 간 거리가 모두 차로 10분 내외로 매우 가깝습니다. 성인 3인이 노선버스 요금(1인 ¥260~420×3명 = 약 ¥1,000)을 내는 것과 택시 기본~중거리 요금(¥1,200~¥1,600) 차이가 거의 없으므로, 아기 컨디션을 위해 벳푸 시내에서는 무조건 택시 이동이 정답입니다.',
    proTips: [
      '일본 택시 중 승합차처럼 지붕이 높은 남색/검은색 「도요타 JPN TAXI」는 뒷문이 슬라이딩 도어이고 트렁크가 초대형이라 캐리어 3개 + 유모차 싣기에 최고입니다.',
      '호텔 로비 프런트에 말씀하시면 언제든 3분 내로 정문 앞까지 콜택시(JPN TAXI 지정 가능)를 불러줍니다.',
    ],
  },
  {
    id: 'seg-4-beppu-to-airport-airliner',
    stepBadge: 'TRANSIT 04 · DAY 4 (12/24 목 · 귀국)',
    dayLabel: '4일차 벳푸 → 오이타 공항 귀국',
    title: '벳푸(쇼닝가하마·키타하마·칸나와) → 오이타 공항 (에어라이너 리무진)',
    fromTo: '벳푸 해안/온천가 리무진 정류장 ➔ 오이타 공항 국제선 터미널 앞',
    operatorAndName: '오이타교통(大分交通) · 공항 리무진 에어라이너 (Airliner)',
    duration: '약 40 ~ 45분 소요 (해안 고속도로 직통)',
    fare3Adults1Infant: '성인 3인 ¥4,600 ~ ¥4,800 (약 44,000원) · 유아 무료',
    fareBreakdown: '1일차에 구매한 4매 회수권 잔여 1매 사용 + 성인 2매(¥1,600×2 = ¥3,200) 추가 발권 또는 왕복권 활용',
    schedules: [
      {
        label: '★추천 1순위 (제주항공 13:55 출발 맞춤편)',
        depart: '10:35 벳푸 키타하마 (10:39 롯카세이/세이카이 앞)',
        arrive: '11:25 오이타 공항 도착',
        note: '출발 2시간 30분 전 공항 도착! 수유실 이용, 면세점 쇼핑 및 공항 우동 점심 식사까지 가장 여유로운 시간대',
        recommended: true,
      },
      {
        label: '추천 2순위 (여유 체크아웃 편)',
        depart: '11:15 벳푸 키타하마 (11:19 롯카세이/세이카이 앞)',
        arrive: '12:03 오이타 공항 도착',
        note: '출발 1시간 50분 전 공항 도착! 소규모 오이타 공항 특성상 수속에 전혀 무리 없는 알짜 시간대',
        recommended: true,
      },
    ],
    boardingSpot:
      '• 아마네 리조트 세이카이 숙박 시: 호텔에서 해안 인도를 따라 도보 4분 거리 「롯카세이(六盛, Rokusei)」 정류장 탑승 (벳푸역까지 되돌아갈 필요 없음!)\n• 스기노이 숙박 시: 셔틀로 벳푸역 이동 후 「벳푸 키타하마(別府北浜)」 버스센터 탑승 또는 호텔에서 택시로 「관광항(Kankoko)」 정류장 이동',
    luggageAndStrollerPlan:
      '리무진 버스 하부 트렁크에 캐리어 3개와 유모차 적재 후 탑승하며, 오이타 공항 국제선 체크인 카운터 바로 앞 인도에 하차합니다.',
    babyCarePoint:
      '오이타 공항은 국내선 1층에 무료 온천 족욕탕이 있고, 2층 출발 로비에 깔끔한 아기 수유실(조유 온수기·기저귀 교환대)과 식당가가 있어 일찍 도착해도 아기와 시간 보내기 아주 좋습니다.',
    proTips: [
      '세이카이 투숙객 최고의 특권! 무거운 짐을 끌고 벳푸역까지 갈 필요 없이 호텔 바로 근처 「롯카세이(六盛)」 정류장에 오이타공항행 에어라이너가 정차합니다.',
      '만약 마지막 날 쇼핑 짐이 많이 늘어났다면, 세이카이 프런트에 요청해 오이타공항 직행 정액 택시(소요시간 35분, 약 ¥10,000~¥11,000)를 타는 것도 성인 3인 기준 훌륭한 대안입니다.',
    ],
  },
]

export const YUFUIN_RYOKANS: RyokanOption[] = [
  {
    id: 'yufuin-sansuikan',
    stayZone: 'yufuin-1n',
    nights: 1,
    name: '유후인 산스이칸 (Yufuin Sansuikan)',
    jpName: 'ゆふいん山水館',
    enSearchQuery: 'Yufuin Sansuikan',
    area: '유후인역·버스센터 도보 8분 (완전 평지)',
    stationAccess: '공항 리무진 하차장 및 JR 유후인역에서 유모차로 평지 도보 8분 (짐은 유후인 치키 배송 가능)',
    tag: '[유후인 1박 추천 1순위] 역세권 평지 · 유후다케 뷰 화양실 · 올인클루시브 라운지',
    roomType: '유후다케 뷰 화양실 (트윈베드 2 + 다다미 8조 · 성인 3인+유아 1인 최적)',
    bathType: '전세 가족탕 + 유후다케 파노라마 노천 대욕장',
    mealType: '오이타 로컬 프리미엄 뷔페 (아기 죽·우동·연두부·과일 풍성 & 어른 수제맥주/주류 무제한)',
    babyPerks: [
      '리무진 내리는 유후인역과 다음 날 벳푸행 특급열차 타는 역이 도보 8분 평지라 이동 피로가 가장 적음',
      '1층 라운지에서 우유·주스·커피·생맥주가 무료 무제한 제공되어 어른 3명 교대 휴식에 최고',
      '바로 근처에 대형 마트(맥스밸류 유후인점)와 드럭스토어가 있어 첫날 아기 우유·보리차·간식 조달 완벽',
    ],
    babyFeeNote: '만 1세(13개월) 유아 소이네 무료 (현장 시설사용료 약 ¥1,650 별도)',
    otaBreakfastKRW: 340000,
    otaBreakfastJPY: 36500,
    otaHalfBoardKRW: 480000,
    otaHalfBoardJPY: 51600,
    pricePerNightKRW: 640000,
    pricePerNightJPY: 68800,
    bestPlatform: '아고다 · 트립닷컴 · 라쿠텐 트래블',
    rating: 4.85,
    highlight: '공항 리무진 하차 후 도보 이동과 다음 날 JR 특급열차 탑승 동선이 가장 완벽한 유후인 대표 료칸',
  },
  {
    id: 'yufuin-hoteiya',
    stayZone: 'yufuin-1n',
    nights: 1,
    name: '유후인 호테이야 (Yufuin Hoteiya)',
    jpName: '湯布院 ほてい屋',
    enSearchQuery: 'Yufuin Hoteiya Ryokan',
    area: '긴린코 호수 인근 (유후인역 무료 송영 5분)',
    stationAccess: '유후인역 도착 후 전화 한 통이면 5분 만에 무료 송영밴 픽업 (다음 날 기차 시간 맞춰 역 드롭 제공)',
    tag: '[프라이빗 독채 1순위] 별채(하나레) 다다미방 + 무료 전세 가족탕',
    roomType: '독립 별채 화실 10~12조 또는 본관 화실 (성인 3~4인실)',
    bathType: '투숙객 무료 프라이빗 가족탕(전세탕 2곳) + 대형 노천탕',
    mealType: '분고규 화로구이 가이세키 석식 & 일본 전통 조식 (아기용 흰밥·김 무료 서비스)',
    babyPerks: [
      '독채(별채) 구조라 밤에 13개월 아기가 울거나 걸어 다녀도 옆방 눈치 볼 걱정이 전혀 없음',
      '매일 저녁 로비 화로에서 무료 군고구마와 우유를 제공해 아기 간식으로 인기 만점',
      '체크아웃 후 JR 특급열차 시간에 맞춰 유후인역까지 무료 송영버스로 편안하게 배웅',
    ],
    babyFeeNote: '만 1세 유아 침구 미사용 시 무료 또는 현장 시설료 소액',
    otaBreakfastKRW: 380000,
    otaBreakfastJPY: 40800,
    otaHalfBoardKRW: 540000,
    otaHalfBoardJPY: 58000,
    pricePerNightKRW: 750000,
    pricePerNightJPY: 80600,
    bestPlatform: '아고다 · 자란넷(Jalan)',
    rating: 4.9,
    highlight: '전통 별채 료칸의 고즈넉한 감성과 아기 동반 세심한 배려가 돋보이는 긴린코 명소',
  },
  {
    id: 'yufuin-yadoya',
    stayZone: 'yufuin-1n',
    nights: 1,
    name: '유후인 야와라기노사토 야도야 (Yawaraginosato Yadoya)',
    jpName: '湯布院 やわらぎの郷 やどや',
    enSearchQuery: 'Yawaraginosato Yadoya Yufuin',
    area: '유노츠보 거리 중심 평지 (유후인역 도보 12분 / 택시 3분)',
    stationAccess: '유후인 치키 짐 배송 지원 가맹 숙소 · 유노츠보 메인 산책로 바로 옆 평지 위치',
    tag: '[가족탕 4개 무료] 배리어프리 평지 설계 · 아기 용품 대여 완비',
    roomType: '배리어프리 화양실 (침대 2 + 다다미 6~8조 · 단차 없는 실내)',
    bathType: '4가지 테마의 프라이빗 전세 가족탕 무료 이용 + 대욕장',
    mealType: '개별 룸/세미프라이빗 다이닝 가이세키 석식 & 조식',
    babyPerks: [
      '관내 전체가 유모차·휠체어를 위해 단차 없는 배리어프리(Barrier-Free)로 설계되어 아기 걸음마에 안전',
      '4개의 서로 다른 전세 가족탕을 스마트폰으로 빈 시간 확인 후 무료로 이용 가능',
      '유노츠보 거리 한가운데 있어 어른 3명이 교대로 간식·소품샵 구경하고 오기 최적',
    ],
    babyFeeNote: '만 2세 미만 유아 소이네 무료',
    otaBreakfastKRW: 360000,
    otaBreakfastJPY: 38700,
    otaHalfBoardKRW: 510000,
    otaHalfBoardJPY: 54800,
    pricePerNightKRW: 700000,
    pricePerNightJPY: 75200,
    bestPlatform: '아고다 · 트립닷컴 · 라쿠텐 트래블',
    rating: 4.85,
    highlight: '유노츠보 거리 바로 옆에서 4개의 무료 전세 가족탕을 즐기는 배리어프리 료칸',
  },
]

export const BEPPU_RYOKANS: RyokanOption[] = [
  {
    id: 'seikai',
    stayZone: 'beppu-2n',
    nights: 2,
    name: '아마네 리조트 세이카이 (AMANE RESORT SEIKAI)',
    jpName: 'アマネリゾート晴海',
    enSearchQuery: 'AMANE RESORT SEIKAI Beppu',
    area: '벳푸 쇼닝가하마 해변 (공항리무진 정류장 도보 4분)',
    stationAccess: 'JR 벳푸역에서 택시 10분 / 귀국일 호텔 도보 4분 「롯카세이」 정류장에서 오이타공항 에어라이너 직승!',
    tag: '[벳푸 2박 연박 1순위] 전 객실 오션뷰 노천탕 · 65~80㎡ 초대형 화양실',
    roomType: '우미노무네(바다동) 화양실 (65~80㎡ · 트윈베드 2 + 다다미방 요이불 2)',
    bathType: '전 객실 바다 전망 프라이빗 반노천 온천탕 (찬물 가수 온도 조절 완비) + 인피니티 대욕장',
    mealType: '개별 다이닝 가이세키/해산물 요리 또는 조식 포함 플랜(연박 시 1박 석식+1박 외식 조합 추천)',
    babyPerks: [
      '방 안에 바다와 맞닿은 대형 노천탕이 있어 13개월 아기 온천 물놀이 후 바로 다다미에 눕히기 최고',
      '아기용 유카타·아기 욕조·기저귀 쓰레기통·침대가드 무료 대여 (사전 메시지 요청)',
      '4일차 귀국 날 벳푸역까지 갈 필요 없이 도보 4분 거리 정류장에서 오이타공항행 버스를 바로 탈 수 있음!',
    ],
    babyFeeNote: '만 1세(13개월) 유아 소이네(침구·식사 미신청) 시 무료 또는 현장 시설료 소액',
    otaBreakfastKRW: 430000,
    otaBreakfastJPY: 46200,
    otaHalfBoardKRW: 590000,
    otaHalfBoardJPY: 63400,
    pricePerNightKRW: 790000,
    pricePerNightJPY: 85000,
    bestPlatform: '아고다(구글맵 경유) · 라쿠텐 트래블',
    rating: 4.95,
    highlight: '파도 소리를 들으며 객실 내 대형 노천탕에서 아기 물놀이와 어른 3명 교대 힐링을 동시에',
  },
  {
    id: 'suginoi-sora',
    stayZone: 'beppu-2n',
    nights: 2,
    name: '벳푸 스기노이 호텔 소라관/니지관 (Suginoi Hotel)',
    jpName: '別府温泉 杉乃井ホテル',
    enSearchQuery: 'Suginoi Hotel Beppu',
    area: '벳푸 칸카이지 온천 (JR 벳푸역 무료 셔틀 15분 간격)',
    stationAccess: 'JR 벳푸역 서쪽 출구(니시구치)에서 무료 대형 셔틀버스 10분 (유후인에서 기차 도착 후 바로 환승!)',
    tag: '[웰컴베이비 끝판왕] 완료기 이유식 무료 제공 · JR 벳푸역 무료 셔틀',
    roomType: '소라관(Sora) 디럭스 화양실 또는 니지관(Niji) 패밀리룸 (성인 3~4인실)',
    bathType: '소라유/타나유 오션뷰 인피니티 노천탕 + 프라이빗 가족탕(유료 전세탕)',
    mealType: '테라스 석식·조식 월드 뷔페 (9개월/12개월+ 일본 완제품 이유식 파우치 무제한 무료)',
    babyPerks: [
      '유후인에서 JR 특급열차로 벳푸역에 내리자마자 호텔 무료 셔틀버스를 타고 로비까지 직행 가능',
      '뷔페 레스토랑 내 12개월+ 이유식 파우치, 아기 우유, 바나나, 찐 야채가 무제한 무료라 아기 식사 걱정 제로',
      '방수 기저귀 착용 시 아쿠아가든 온수풀 입수 가능하며 니지관 선택 시 1박 30만 원대 가성비 최고',
    ],
    babyFeeNote: '만 3세 미만 유아 숙박 및 조·석식 뷔페 완전 무료!',
    otaBreakfastKRW: 340000,
    otaBreakfastJPY: 36500,
    otaHalfBoardKRW: 510000,
    otaHalfBoardJPY: 54800,
    pricePerNightKRW: 720000,
    pricePerNightJPY: 77500,
    bestPlatform: '아고다 · 트립닷컴 (니지관/소라관 특가)',
    rating: 4.85,
    highlight: 'JR 벳푸역 무료 셔틀과 무료 이유식 코너로 13개월 아기 부모 만족도가 가장 높은 대형 리조트',
  },
  {
    id: 'rex-beppu',
    stayZone: 'beppu-2n',
    nights: 2,
    name: '렉스 호텔 벳푸 (REX HOTEL BEPPU)',
    jpName: 'ホテル別府パストラル / REX HOTEL BEPPU',
    enSearchQuery: 'REX HOTEL BEPPU',
    area: '벳푸만 해안 (유메타운 도보 10분 · 공항리무진 정류장 인근)',
    stationAccess: 'JR 벳푸역 택시 6분 / 유메타운 쇼핑몰 인접 / 오이타공항 리무진 정류장 도보 3분',
    tag: '[가성비 오션뷰 화양실] 전 객실 바다 전망 · 유메타운 인접',
    roomType: '오션뷰 재패니즈 웨스턴룸 화양실 (트윈베드 2 + 다다미 공간)',
    bathType: '오션뷰 노천 온천 대욕장 & 객실 내 배스룸',
    mealType: '조식 뷔페 또는 분고규 가이세키 2식 플랜',
    babyPerks: [
      '아고다/트립닷컴에서 성인 3인 1박 26~38만 원대에 예약 가능해 2박 연박 숙박비를 크게 절약 가능',
      '대형 쇼핑몰 유메타운 벳푸가 유모차 도보권(또는 택시 기본요금)이라 아기 용품·식사 해결이 매우 편함',
      '호텔 바로 근처 해안 도로 정류장에서 오이타공항행 에어라이너 리무진 탑승 가능',
    ],
    babyFeeNote: '미취학 유아 소이네(침구 미사용) 무료',
    otaBreakfastKRW: 260000,
    otaBreakfastJPY: 28000,
    otaHalfBoardKRW: 390000,
    otaHalfBoardJPY: 42000,
    pricePerNightKRW: 520000,
    pricePerNightJPY: 56000,
    bestPlatform: '아고다 · 트립닷컴',
    rating: 4.7,
    highlight: '합리적인 예산으로 벳푸만 오션뷰 화양실과 뛰어난 쇼핑·공항리무진 접근성을 누리는 실속 호텔',
  },
]

export const CONFIRMED_DAYS: DayPlan[] = [
  {
    day: 1,
    date: '12월 21일 (월)',
    dayOfWeek: 'Day 1 · 월요일',
    stayBadge: '유후인 1박',
    theme: '제주항공 오이타 공항 도착 → 공항 리무진으로 유후인 직행 & 첫 가족 온천욕',
    routeSummary: '인천 T1(10:50) ✈️ 오이타공항(12:45) 🚌 유후인 직행 리무진(13:25~14:20) 🚶 유후인 치키 짐배송 & 산책 ♨️ 유후인 료칸(1박)',
    totalTransitMinutes: 55,
    items: [
      {
        time: '08:30 ~ 10:50',
        title: '인천공항 제1터미널 유아 동반 패스트트랙 출국 & 제주항공 7C1512 탑승',
        place: '인천국제공항 T1 → 기내 (1시간 55분 비행)',
        desc: '체크인 카운터에서 위탁수하물(15kg×3개)을 부치고, 휴대용 유모차는 「도어 투 도어(Gate Delivery)」 태그를 부착해 탑승구 앞까지 끌고 갑니다. 만 2세 미만 유아 동반으로 성인 3명 전원 교통약자 우선출국통로를 통해 대기 없이 빠르게 보안검색을 통과합니다.',
        transport: '제주항공 7C1512 (10:50 출발)',
        timetableNote: '10:20 탑승 시작 · 10:50 출발 → 12:45 오이타 도착',
        luggageNote: '28인치 캐리어 3개 위탁 / 유모차는 게이트 앞 위탁 / 기내에는 아기 기저귀 가방·이유식·상비약 백팩만 휴대',
        babyTip: '비행기 이륙(10:50) 직전 아기에게 보리차 빨대컵이나 쪽쪽이, 떡뻥을 물려주면 귀 먹먹함(기압차) 없이 편안하게 오전 낮잠에 듭니다.',
        adultTip: '어른 3명이 한 줄(A·B·C 또는 D·E·F)로 나란히 앉으면 아기를 번갈아 안아주거나 이유식을 먹이기 훨씬 수월합니다.',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
      {
        time: '12:45 ~ 13:25',
        title: '오이타 공항 도착 · 초고속 입국심사(15분) & 유후인행 공항 리무진 탑승',
        place: '오이타 공항 국제선 도착 로비 → 야외 리무진 승강장',
        desc: '소규모 공항인 오이타 공항은 우리 비행기 승객만 입국 수속을 밟아 15~20분이면 밖으로 나옵니다. 국제선 출구를 나와 바로 왼쪽(국내선 방향 도보 1분) 버스 승강장에서 13:25 출발 유후인행 직행 리무진 버스에 탑승합니다.',
        transport: '오이타교통 공항 리무진 (55분 논스톱)',
        timetableNote: '★13:25 오이타공항 출발 → 14:20 유후인역 앞 버스센터 도착 (비행기 도착 연동 출발)',
        luggageNote: '리무진 버스 하부 대형 트렁크에 캐리어 3개 + 접은 유모차 기사님이 적재',
        babyTip: '리무진 탑승 전 공항 도착 로비 화장실 기저귀 교환대에서 기저귀를 갈아주면 55분 이동 내내 쾌적합니다.',
        adultTip: '역할 분담 필수! 어른 1명은 수하물 벨트에서 캐리어를 찾고, 어른 1명은 먼저 밖으로 나가 매표기에서 「4매 회수권(¥5,600)」을 끊고 버스 줄을 서세요.',
        costKRW: '리무진 성인 3인 약 42,000원 (회수권 활용 시 ¥4,200 · 유아 무료)',
        strollerFriendly: '폴딩 후 탑승',
      },
      {
        time: '14:20 ~ 15:45',
        title: '유후인역 앞 도착 → 「유후인 치키」 캐리어 배송 위탁 & 유노츠보·긴린코 산책',
        place: '유후인역 앞 버스센터 → 유후인 치키 → 유노츠보 거리 & 긴린코 호수',
        desc: '버스에서 내리자마자 바로 맞은편 「유후인 치키(Yufuin Chikki)」 수하물 서비스 센터에 캐리어 3개를 맡기면 우리가 묵을 유후인 료칸 객실까지 당일 배송해 줍니다! 무거운 짐 없이 유모차에 아기를 태우고 유노츠보 거리(미르히 따뜻한 우유 푸딩, 금상 고로케)와 긴린코 호수 평지 산책로를 거닙니다.',
        transport: '평지 도보 & 유모차 산책',
        timetableNote: '유후인 치키 짐 접수 마감 15:00 전후 (14:20 도착 즉시 접수 권장)',
        luggageNote: '캐리어 3개는 료칸으로 직배송 완료! 어른들은 가벼운 크로스백과 유모차만 이동',
        babyTip: '미르히(Milch)의 갓 구운 따뜻한 치즈케이크나 우유 푸딩 윗부분, 찐 고구마는 13개월 아기 오후 간식으로도 아주 좋습니다.',
        adultTip: '어른 1명이 아기와 호숫가 벤치에서 쉬는 동안, 나머지 어른 2명이 미피 모리노키친·스누피차야·지브리샵을 빠르게 구경하고 간식을 사 오는 분담 찬스!',
        costKRW: '짐 배송 3개 약 21,000원(¥2,400) + 간식·커피 약 30,000원',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
      {
        time: '15:45 ~ 21:00',
        title: '유후인 료칸 체크인 (1박) & 전세 가족탕 첫 온천욕 + 분고규 석식 만찬',
        place: '유후인 산스이칸 / 호테이야 / 야도야 (선택 숙소)',
        desc: '료칸 체크인 후 전세 가족탕(또는 객실탕)에 찬물을 미리 틀어 38.0~38.5°C 미지근한 온도로 맞춘 뒤, 13개월 아기와 첫 온천 입욕(5~8분)을 즐깁니다. 저녁에는 오이타 명물 분고규 가이세키 또는 로컬 프리미엄 뷔페로 첫날 만찬을 즐깁니다.',
        timetableNote: '석식 18:00 또는 18:30 권장 (아기 밤잠 시간 고려)',
        luggageNote: '내일 아침 JR 특급열차 이동을 위해 오늘 밤 쓸 물건만 담긴 작은 파우치 위주로 꺼내 쓰면 내일 패킹이 5분 만에 끝납니다.',
        babyTip: '유후인 온천수는 무색무취 단순온천이라 아기 피부에 자극이 전혀 없습니다. 목욕 직후 보리차를 충분히 먹이고 보습 로션을 듬뿍 발라주세요.',
        adultTip: '20:30 아기를 다다미 요이불에 재운 뒤, 어른 3명이 교대로 유후다케 별빛 노천 대욕장과 맥주 라운지를 즐기세요!',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
    ],
  },
  {
    day: 2,
    date: '12월 22일 (화)',
    dayOfWeek: 'Day 2 · 화요일',
    stayBadge: '벳푸 2박 연박 시작',
    theme: '유후인 아침 온천 → JR 특급열차(유후/유후인노모리)로 벳푸 이동 & 오션뷰 리조트 2박 체크인',
    routeSummary: '유후인 료칸 🚶 JR 유후인역(11:44 출발) 🚆 JR 특급열차 직통(65분) ➔ JR 벳푸역(12:49 도착) 🚕 유메타운 점심·장보기 🚕 벳푸 리조트(2박 연박)',
    totalTransitMinutes: 75,
    items: [
      {
        time: '08:00 ~ 10:15',
        title: '유후인 아침 물안개 온천욕 & 일본식 조식 후 체크아웃',
        place: '유후인 숙소 → JR 유후인역',
        desc: '유후다케 산자락에 피어오르는 아침 물안개를 보며 가벼운 아침 온천욕 후 조식을 먹습니다. 체크아웃 후 도보(산스이칸 8분) 또는 료칸 무료 송영버스(호테이야 5분)로 JR 유후인역으로 이동합니다.',
        transport: '도보 8분 또는 료칸 무료 송영 5분',
        timetableNote: '10:00 체크아웃 → 10:15 유후인역 도착',
        luggageNote: '유후인역 대합실 코인락커(또는 유후인 치키)에 캐리어를 1시간 잠시 맡기면 출발 전 역전 카페/기념품 거리를 편하게 구경할 수 있습니다.',
        babyTip: '료칸 조식에 나오는 따뜻한 연두부(유도후), 계란찜(차완무시), 조미 안 된 구운 김은 13개월 아기가 밥 한 공기 뚝딱 먹는 효자 반찬입니다.',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
      {
        time: '11:44 ~ 12:49',
        title: 'JR 유후인역 → JR 벳푸역 특급열차 직통 이동 (특급 유후 2호 / 유후인노모리)',
        place: 'JR 유후인역 1번 승강장 → JR 벳푸역',
        desc: '유후인역 1번 홈(계단 없는 평지 승강장)에서 벳푸역까지 환승 없이 한 번에 가는 「JR 특급 유후(Yufu) 2호 (11:44 출발 → 12:49 벳푸 도착)」에 탑승합니다! (오후 이동을 원할 경우 14:16 출발 유후 4호 직통편 선택 가능). 차창 밖으로 펼쳐지는 오이타의 전원 풍경과 벳푸만 바다를 감상하며 기차 여행의 낭만을 만끽합니다.',
        transport: 'JR 특급열차 지정석 3석 + 유아 무임 (65분)',
        timetableNote: '★직통 1순위: 특급 유후 2호 (11:44 유후인 → 12:49 벳푸) / 직통 2순위: 특급 유후 4호 (14:16 유후인 → 15:24 벳푸)',
        luggageNote: '각 호차 맨 뒷자리(또는 맨 앞자리) 특대수하물 공간 인접 좌석 3석을 지정해 캐리어 3개와 폴딩 유모차를 나란히 보관',
        babyTip: '가장 중요한 포인트! 오이타역 종착 열차를 타면 오이타역에서 계단/엘리베이터로 갈아타야 하므로, 반드시 「벳푸역 종착 직통 특급(유후 2호 또는 4호)」을 탑승하세요.',
        adultTip: '탑승 전 유후인역 앞 베이커리나 비스피크(B-Speak)에서 롤케이크, 에키벤 도시락, 유후인 사이다를 사서 기차 테이블에 펼쳐놓고 즐기세요!',
        costKRW: 'JR 특급 지정석 성인 3인 약 80,000원 (¥8,500 · 유아 무료)',
        strollerFriendly: '폴딩 후 탑승',
      },
      {
        time: '13:00 ~ 14:45',
        title: 'JR 벳푸역 도착 → 유메타운 벳푸(YouMe Town) 점심 식사 & 아기용품·과일 장보기',
        place: 'JR 벳푸역 동쪽 출구 → 유메타운 벳푸 (택시 5분)',
        desc: '벳푸역 엘리베이터로 내려와 동쪽 출구 택시 승강장에서 대형 트렁크 택시(도요타 JPN TAXI)를 타고 5분(약 ¥800) 거리인 유메타운 벳푸로 이동합니다. 1층 인포메이션 옆 대형 락커에 캐리어를 넣고, 회전초밥/함바그/우동 점심 식사 후 아카짱 코너 및 1층 대형 마트에서 2박 동안 먹을 아기 딸기·바나나·요거트·이유식과 어른 맥주·야식을 구매합니다.',
        transport: '벳푸역 → 유메타운 택시 5분 (약 ¥800)',
        timetableNote: '스기노이 호텔 숙박 시에는 벳푸역 서쪽 출구 무료 셔틀버스로 호텔에 먼저 짐을 맡긴 뒤 이동해도 좋습니다.',
        luggageNote: '유메타운 1층 대형 코인락커 또는 서비스 카운터 수하물 보관 활용',
        babyTip: '유메타운 3층 유아용품 코너 옆 베이비룸에는 기저귀 교환대, 70°C 조유 온수기, 이유식 데우기용 전자레인지가 완벽하게 갖춰져 있습니다.',
        adultTip: '여기서 일본 완제품 이유식(와코도 12개월+ 도시락 박형), 아기 보리차 페트병, 목욕 장난감을 사두면 남은 2박 3일이 정말 편해집니다.',
        costKRW: '택시 + 성인 3인 점심 + 마트 장보기 약 90,000원',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
      {
        time: '15:00 ~ 21:00',
        title: '벳푸 오션뷰 리조트(세이카이 / 스기노이) 2박 연박 체크인 & 바다 전망 노천탕',
        place: '아마네 리조트 세이카이 또는 벳푸 스기노이 호텔 (2박 연박)',
        desc: '유메타운에서 택시로 8분(약 ¥1,300) 이동해 벳푸 숙소에 체크인합니다! 오늘부터 귀국 날까지 2박 연박이므로 캐리어 짐을 완전히 풀어 정리해 둡니다. 탁 트인 벳푸만 바다를 바라보며 객실 프라이빗 노천탕(또는 인피니티 노천탕)에서 온천욕을 즐기고 해산물 가이세키/뷔페 석식을 만끽합니다.',
        transport: '택시 8분 (약 ¥1,300)',
        timetableNote: '15:00 체크인 · 2박 연박 시작으로 내일 아침 체크아웃 불필요!',
        luggageNote: '2박 연박 동안 모든 짐을 객실 옷장에 풀어두고 내일 외출 시에는 가벼운 기저귀 가방 1개만 들고 나갑니다.',
        babyTip: '세이카이 화양실은 침대 2개 구역과 넓은 다다미방이 나뉘어 있어, 다다미에 요이불 2채를 미리 깔아달라고 하면 13개월 아기가 낙상 걱정 없이 안전하게 뒹굴며 잘 수 있습니다.',
        adultTip: '연박 첫날 밤에는 마트에서 사 온 오이타 특산 가보스(유자) 하이볼과 사시미 야식을 곁들이며 여유로운 가족 시간을 보내세요.',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
    ],
  },
  {
    day: 3,
    date: '12월 23일 (수)',
    dayOfWeek: 'Day 3 · 수요일',
    stayBadge: '벳푸 2박 연박 (짐 이동 없음)',
    theme: '우미타마고 수족관(무단차) & 칸나와 지옥찜 점심 + 어른 3인 교대 지옥순례·온천 힐링',
    routeSummary: '벳푸 숙소 🚕 우미타마고 수족관(택시 8분) 🚕 칸나와 지옥찜 & 가마도 지옥(택시 12분) 🚕 숙소 복귀(낮잠 & 교대 온천)',
    totalTransitMinutes: 30,
    items: [
      {
        time: '09:30 ~ 12:00',
        title: '오이타 마린팰리스 수족관 「우미타마고(Umitamago)」 관람',
        place: '벳푸 우미타마고 수족관 (숙소에서 택시 8분)',
        desc: '연박이라 아침에 짐 쌀 필요 없이 느긋하게 조식 후, 호텔 로비에서 택시를 타고 8분(약 ¥1,400) 만에 우미타마고 수족관 정문 앞에 내립니다. 경사로와 엘리베이터가 완벽한 100% 유모차 친화형 수족관으로, 아기 눈높이에 맞춘 대형 산호초 수조와 돌고래·바다코끼리 퍼포먼스를 관람합니다.',
        transport: '호텔 → 수족관 택시 8분 (약 ¥1,400)',
        timetableNote: '09:00 오픈 · 10:30 바다코끼리 쇼 / 11:00 돌고래 퍼포먼스 관람 추천',
        luggageNote: '캐리어 없이 유모차 + 가벼운 기저귀 가방만 휴대',
        babyTip: '수조 통유리가 바닥까지 낮게 이어져 있어 13개월 아기가 유모차에 앉은 상태에서도 알록달록한 물고기와 돌고래를 눈앞에서 보고 손뼉 치며 좋아합니다.',
        adultTip: '수족관 바로 옆 다카사키야마(원숭이 공원) 모노레일 입구에서 어른 2명이 잠시 구경하거나 해안 전망 카페에서 커피 타임을 갖기 좋습니다.',
        costKRW: '성인 3인 입장료 약 72,000원(¥7,800 · 유아 무료) + 택시 약 13,000원',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
      {
        time: '12:15 ~ 13:45',
        title: '칸나와 「지옥찜 공방」 온천 스팀 요리 또는 「카메쇼 쿠루쿠루 스시」 점심',
        place: '벳푸 칸나와 온천지구 (수족관에서 택시 12분)',
        desc: '수족관 앞 택시 승강장에서 택시로 12분(약 ¥1,800) 이동해 칸나와 온천가로 갑니다. 100°C 천연 온천 증기로 쪄내는 지옥찜 공방(고구마·단호박·옥수수·계란·해산물·소고기) 또는 규슈 최고 인기 회전초밥집인 카메쇼 쿠루쿠루 스시에서 점심을 먹습니다.',
        transport: '수족관 → 칸나와 택시 12분 (약 ¥1,800)',
        babyTip: '소금이나 조미료 없이 순수 온천 증기로만 푹 쪄낸 고구마, 단호박, 계란, 흰살생선은 13개월 아기가 먹기에 세상에서 가장 안전하고 맛있는 특식입니다!',
        costKRW: '성인 3인 점심 식사 및 택시 약 75,000원',
        strollerFriendly: '양호 (일부 경사)',
      },
      {
        time: '13:45 ~ 16:45',
        title: '가마도 지옥 관람 후 리조트 복귀 → 아기 낮잠 & 어른 3인 2:1 교대 자유시간',
        place: '가마도 지옥(도보 3분) → 벳푸 리조트 복귀(택시 10분)',
        desc: '식당에서 도보 3분 거리인 「가마도 지옥(Kamado Jigoku)」에서 코발트빛 온천 연못과 온천 달걀·구슬 사이다를 맛본 뒤, 택시(10분, ¥1,500)로 숙소에 일찍 복귀합니다. 2박 연박의 최대 장점을 살려 오후 2시 반부터 아기를 우리 방 다다미에서 시원하게 낮잠 재우고, 어른 3명이 교대로 자유시간을 갖습니다.',
        transport: '칸나와 → 숙소 택시 10분 (약 ¥1,500)',
        babyTip: '여행 3일차 오후는 아기 피로가 누적되는 시점입니다. 무리하게 일정을 늘리지 않고 오후 2시 반에 연박 객실로 돌아와 2시간 푹 재우면 저녁까지 아기 컨디션이 완벽하게 회복됩니다.',
        adultTip: '★성인 3인 여행 최고의 특권! 어른 1명이 시원한 객실에서 아기 낮잠을 지키는 동안, 나머지 어른 2명은 8층 오션뷰 인피니티 대욕장이나 해변 카페·마사지를 다녀오는 2:1 교대 힐링을 즐기세요!',
        costKRW: '가마도 지옥 입장료·간식 및 택시 약 32,000원',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
      {
        time: '17:30 ~ 21:00',
        title: '마지막 밤 스페셜 해산물·와규 만찬 & 별빛 오션뷰 노천탕',
        place: '리조트 다이닝 레스토랑 & 객실 노천탕',
        desc: '분고수도 제철 해산물과 오이타 와규가 차려지는 마지막 밤 스페셜 석식을 즐긴 뒤, 객실 노천탕에 따뜻한 온천수를 받아 아기와 물놀이를 하며 여행 마지막 밤을 기념합니다.',
        luggageNote: '내일 오전 10:35 공항 리무진 탑승을 위해 오늘 밤 아기 잠든 후 위탁수하물 캐리어 3개를 90% 미리 패킹해 두세요.',
        babyTip: '일본에서 구매한 액체류(푸딩, 젤리, 과일주스, 로션 등 100ml 초과 물품)는 기내 반입이 불가하므로 오늘 밤 반드시 위탁수하물 캐리어 안에 넣으세요(기내용 아기 이유식/우유만 예외 반입 가능).',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
    ],
  },
  {
    day: 4,
    date: '12월 24일 (목)',
    dayOfWeek: 'Day 4 · 목요일 (크리스마스 이브 귀국)',
    stayBadge: '오이타 공항 직항 귀국',
    theme: '일출 오션뷰 온천욕 & 리조트 조식 → 에어라이너 리무진으로 오이타 공항 귀국',
    routeSummary: '벳푸 숙소(10:15 체크아웃) 🚌 에어라이너 공항 리무진(10:39~11:25) ➔ 오이타공항(13:55 출발) ✈️ 인천 T1(15:50 도착)',
    totalTransitMinutes: 45,
    items: [
      {
        time: '08:00 ~ 10:15',
        title: '벳푸만 일출 온천욕 & 리조트 조식 후 여유로운 체크아웃',
        place: '벳푸 숙소 (아마네 리조트 세이카이 / 스기노이)',
        desc: '바다 위로 떠오르는 일출을 바라보며 아침 노천 온천욕을 즐기고 조식을 먹습니다. 제주항공 귀국편이 13:55 출발이고 공항까지 리무진으로 45분밖에 걸리지 않아 아침 10시까지 여유롭게 준비할 수 있습니다.',
        timetableNote: '10:15 체크아웃 완료',
        babyTip: '출발 직전 객실에서 아기 기저귀를 새것으로 갈아주고 아침 이유식/우유를 든든히 먹여 출발하세요.',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
      {
        time: '10:35 ~ 11:25',
        title: '벳푸 → 오이타 공항 직통 리무진 「에어라이너(Airliner)」 탑승 (45분)',
        place: '벳푸 쇼닝가하마(롯카세이 정류장) / 키타하마 → 오이타 공항 국제선',
        desc: '세이카이 숙소에서 평지 인도로 도보 4분 거리인 「롯카세이(六盛)」 정류장(또는 벳푸 키타하마/칸나와 정류장)에서 오이타 공항행 에어라이너 리무진 버스에 탑승합니다! 해안 고속도로를 따라 환승 없이 45분 만에 오이타 공항 국제선 청사 바로 앞에 도착합니다.',
        transport: '오이타교통 에어라이너 리무진 (45분 논스톱)',
        timetableNote: '★1순위: 10:35 키타하마 출발 (10:39 롯카세이 경유) → 11:25 공항 도착 / 2순위: 11:15 키타하마 출발 → 12:03 공항 도착',
        luggageNote: '첫날 끊어둔 4매 회수권의 마지막 1장을 여기서 사용하고 성인 2매(¥3,200)만 추가 지불하면 됩니다.',
        babyTip: '세이카이 바로 앞 「롯카세이」 정류장에 공항 리무진이 서기 때문에 무거운 캐리어 3개를 끌고 벳푸역까지 되돌아갈 필요가 전혀 없습니다!',
        adultTip: '만약 기념품 쇼핑으로 짐이 많이 늘어나 정류장까지 걷기도 번거롭다면, 호텔 현관에서 오이타공항까지 정액 택시(약 ¥11,000, 35분 소요)를 타도 성인 3인 기준 매우 합리적입니다.',
        costKRW: '공항 리무진 성인 3인 약 44,000원 (회수권 잔여 1매 활용 시 ¥4,600)',
        strollerFriendly: '폴딩 후 탑승',
      },
      {
        time: '11:30 ~ 15:50',
        title: '오이타 공항 체크인·면세 쇼핑 & 제주항공 7C1511 인천 도착',
        place: '오이타 공항 국제선 터미널 → 인천국제공항 T1',
        desc: '오이타 공항 도착 후 위탁수하물(캐리어 3개)을 부치고, 국내선 청사 2층 식당가에서 오이타 명물 토리텐(닭튀김) 정식·우동으로 점심 식사를 합니다. 1층 무료 온천 족욕탕과 2층 유아 수유실을 이용한 뒤 13:55 제주항공 7C1511편으로 출발해 15:50 인천공항에 도착합니다!',
        transport: '제주항공 7C1511 (13:55 오이타 출발 → 15:50 인천 도착)',
        timetableNote: '11:55 체크인 수속 · 13:25 탑승 시작 · 13:55 출발 → 15:50 인천 도착',
        luggageNote: '휴대용 유모차는 출국 때와 동일하게 탑승 게이트 앞까지 끌고 간 뒤 도어사이드 위탁',
        babyTip: '오후 2시 출발 비행기라 아기 오후 낮잠 시간과 딱 맞아떨어집니다! 탑승 전 공항 수유실에서 기저귀를 갈아주고 이륙 시 보리차를 물려주며 편안하게 귀국하세요.',
        adultTip: '오후 3시 50분에 인천공항에 도착하므로 저녁 시간 전에 집에 도착해 여독을 풀 수 있는 최고의 귀국 스케줄입니다.',
        strollerFriendly: '최상 (평지/엘리베이터)',
      },
    ],
  },
]

export interface RegionPlan {
  id: RegionId
  rank: number
  badge: string
  name: string
  subtitle: string
  airport: string
  waterType: string
  waterTemp: string
  babySkinSafeScore: number
  mobilityScore: number
  threeAdultsRoomScore: number
  overallScore: number
  summary: string
  whyBestFor13Month: string[]
  routeNodes: {
    step: number
    place: string
    stayOrStop: string
    durationToNext?: string
    modeToNext?: string
  }[]
  ryokans: RyokanOption[]
  days: DayPlan[]
}

export const REGION_PLANS: RegionPlan[] = [
  {
    id: 'beppu-yufuin',
    rank: 1,
    badge: '확정 마스터플랜 ✅ · 제주항공 오이타 직항 · 유후인 1박 + 벳푸 2박',
    name: '오이타 공항 → 유후인 1박 → 벳푸 2박 (확정 여정)',
    subtitle: '공항 리무진(55분) · 유후인 1박 · JR 특급열차(65분) · 벳푸 오션뷰 2박 연박 · 에어라이너 귀국(45분)',
    airport: '오이타 공항(OIT) 제주항공 직항 확정 (출국 10:50→12:45 / 귀국 13:55→15:50)',
    waterType: '유후인 단순온천(무색무취 저자극) & 벳푸 나트륨 염화물천(보온·피부보호)',
    waterTemp: '원천 55~80°C → 가족탕/객실 노천탕 찬물 가수(물 섞기)로 38.0~38.5°C 세팅',
    babySkinSafeScore: 98,
    mobilityScore: 98,
    threeAdultsRoomScore: 99,
    overallScore: 99,
    summary:
      '성인 3명과 13개월 유아 1명을 위해 확정된 「제주항공 오이타 직항 + 유후인 1박(공항 리무진) + 벳푸 2박 연박(JR 특급열차)」 전용 마스터 가이드입니다. 불필요한 후보지를 모두 덜어내고, 오이타 공항 리무진 시간표·탑승장, 유후인 치키 짐 배송, 유후인→벳푸 무환승 직통 특급열차 시각표, 벳푸 2박 연박 동선만 빈틈없이 세밀하게 담았습니다.',
    whyBestFor13Month: [
      '1일차: 오이타 공항 입국심사 15분 컷 → 국제선 문 앞 리무진 버스로 환승 없이 55분 만에 유후인역 직행',
      '1일차: 유후인역 도착 즉시 「유후인 치키」로 캐리어 3개를 료칸에 먼저 보내고 유모차로 가볍게 호수 산책',
      '2일차: JR 유후인역 평지 1번 승강장에서 벳푸 직통 특급열차(특급 유후 2호/4호) 탑승으로 환승 없이 1시간 이동',
      '2~4일차: 벳푸 오션뷰 화양실 2박 연박으로 짐 싸는 스트레스 제로! 귀국 날 숙소 앞 정류장에서 에어라이너로 45분 만에 공항 도착',
    ],
    routeNodes: [
      {
        step: 1,
        place: '오이타 공항 (Day 1 · 12:45 도착)',
        stayOrStop: '입국 후 국제선 출구 옆 유후인행 리무진 탑승 (13:25 출발)',
        durationToNext: '55분 (논스톱 직행)',
        modeToNext: '오이타교통 공항 리무진 버스',
      },
      {
        step: 2,
        place: '유후인 온천 마을 (Day 1 · 1박)',
        stayOrStop: '유후인 치키 짐 배송 · 긴린코 산책 & 가족탕 료칸 1박',
        durationToNext: '65분 (직통 무환승)',
        modeToNext: 'JR 특급열차 (특급 유후 2호/4호)',
      },
      {
        step: 3,
        place: '벳푸 오션뷰 리조트 (Day 2~3 · 2박 연박)',
        stayOrStop: '세이카이 / 스기노이 2박 연박 · 우미타마고 수족관 & 가마도 지옥',
        durationToNext: '45분 (해안 고속도로 직통)',
        modeToNext: '오이타공항 에어라이너 리무진',
      },
      {
        step: 4,
        place: '오이타 공항 출국 (Day 4 · 13:55 출발)',
        stayOrStop: '공항 족욕탕 & 수유실 이용 후 인천 귀국 (15:50 도착)',
      },
    ],
    ryokans: [...YUFUIN_RYOKANS, ...BEPPU_RYOKANS],
    days: CONFIRMED_DAYS,
  },
]

export const OTA_BOOKING_GUIDE = [
  {
    step: '01',
    title: '유후인 1박 + 벳푸 2박 연박 예약 시 식사 플랜 황금 조합',
    desc: '유후인(1박)은 저녁 일찍 가게들이 문을 닫으므로 무조건 「석식(가이세키/뷔페)+조식 2식 포함」 플랜으로 예약하세요. 반면 벳푸(2박 연박)는 이틀 연속 가이세키가 물릴 수 있다면 1박은 조·석식 포함, 다른 1박은 「조식 포함」으로 예약해 유메타운이나 지옥찜·초밥 맛집을 이용하면 숙박비를 15~20만 원 아낄 수 있습니다.',
  },
  {
    step: '02',
    title: '13개월 아기 동반 시 15~20만 원 아끼는 검색 공식 (소이네·添い寝 활용)',
    desc: '아고다·트립닷컴 검색창에 「어린이 1명(만 1세)」을 넣으면 시스템이 아기를 성인 침구·가이세키 식사 인원으로 잘못 인식해 1박당 10~15만 원을 추가 부과합니다. 반드시 「성인 3명」으로만 검색해 최저가로 예약한 뒤, 예약 메시지로 "13개월 유아 1명 동반(식사·침구 불필요, 소이네)"라고 보내세요. 무료이거나 현장에서 시설료 1,100~1,650엔만 내면 됩니다.',
  },
  {
    step: '03',
    title: 'JR 특급열차 (유후인 → 벳푸) 예매 및 좌석 지정 꿀팁',
    desc: '유후인→벳푸 구간은 짧은 단일 구간이므로 비싼 JR 북큐슈 레일패스를 살 필요 없이, JR 규슈 공홈 또는 역 창구에서 구간권(성인 1인 약 ¥2,800)만 구매하는 것이 훨씬 저렴합니다. 예매 시 반드시 오이타역 환승이 없는 「벳푸행 직통 열차(특급 유후 2호 11:44 출발 또는 유후 4호 14:16 출발)」의 각 호차 맨 뒷자리(수하물 보관 공간 앞) 3석을 지정하세요.',
  },
]

export interface ChecklistItem {
  id: string
  category: '검역·이유식 필수주의' | '리무진·특급열차 이동 준비' | '13개월 온천 입욕 안전수칙' | '서류·상비약'
  title: string
  detail: string
  critical?: boolean
}

export const BABY_CHECKLIST: ChecklistItem[] = [
  {
    id: 'quarantine-meat',
    category: '검역·이유식 필수주의',
    title: '일본 입국 시 소고기·돼지고기·닭고기 함유 이유식 반입 절대 금지',
    detail:
      '일본 동물검역소 규정상 레토르트 멸균 파우치라도 육류(소·돼지·닭·육수 포함)가 들어간 이유식·아기과자(소고기 퍼프 등)는 반입 불가 및 압수 대상입니다. 한국에서는 흰살생선·연어·야채·전복·두부·단호박 베이스 이유식과 김·멸치자반만 챙기고, 소/닭고기 메뉴는 유후인 맥스밸류 마트나 유메타운 벳푸에서 와코도(Wakodo) 12개월+ 도시락을 구매하세요.',
    critical: true,
  },
  {
    id: 'transit-limousine-train',
    category: '리무진·특급열차 이동 준비',
    title: '오이타공항 리무진 4매 회수권(¥5,600) 구매 & JR 특급 유후 직통 시간표 캡처',
    detail:
      '오이타공항 도착 후 버스 매표기에서 성인 단권(¥1,600) 대신 4매 회수권(¥5,600)을 사면 첫날 유후인행 3매 + 마지막 날 벳푸→공항 에어라이너 1매로 바로 쓸 수 있습니다. 또한 2일차 유후인→벳푸 이동 시 오이타역 환승 없는 「특급 유후 2호(11:44) / 4호(14:16)」 시간표를 미리 체크하세요.',
    critical: true,
  },
  {
    id: 'transit-chikki-luggage',
    category: '리무진·특급열차 이동 준비',
    title: '1일차 유후인역 하차 즉시 「유후인 치키」에 캐리어 3개 숙소 배송 맡기기',
    detail:
      '렌터카 없는 대중교통 여행의 핵심! 유후인역 버스센터 바로 맞은편 「유후인 치키」에 캐리어 3개를 맡기면 료칸 방까지 배달해 주므로, 어른 3명이 무거운 짐 없이 유모차만 밀고 긴린코 호수를 산책할 수 있습니다.',
    critical: true,
  },
  {
    id: 'onsen-temp',
    category: '13개월 온천 입욕 안전수칙',
    title: '온천수 온도는 38~39°C 미지근하게, 입욕 시간은 1회 5~8분 이내, 직후 보리차·로션',
    detail:
      '13개월 아기는 체온 조절 능력이 미숙하므로 객실 노천탕이나 가족탕에 찬물(가수)을 미리 틀어 38.5°C 정도로 식힌 뒤 발부터 천천히 담가주세요. 목욕 직후 3분 이내에 고보습 로션을 바르고 빨대컵으로 보리차를 충분히 먹이세요.',
    critical: true,
  },
  {
    id: 'passport-docs',
    category: '서류·상비약',
    title: '아기 여권 + 영문 가족관계증명서 + 비짓재팬웹(동반가족 등록)',
    detail:
      '13개월 아기도 본인 여권이 필수이며, 제주항공 유아 확인 및 입국 대비 영문 가족관계증명서 1부를 챙기세요. 비짓재팬웹(Visit Japan Web)은 대표자 계정에 동반가족으로 아기를 추가하면 QR코드 하나로 빠르게 통과됩니다.',
  },
  {
    id: 'medicine-kit',
    category: '서류·상비약',
    title: '교차복용 해열제 2종(아세트아미노펜·이부프로펜) + 체온계 + 정장제 + 1회용 폴딩 유모차 커버',
    detail:
      '12월 겨울 여행이므로 아기 상비약(해열제 시럽 2종, 콧물약, 유산균/지사제, 밴드, 귀체온계)을 지퍼백에 담아 기내 수하물로 휴대하시고, 리무진·기차 짐칸 적재 시 유모차가 더러워지지 않도록 가벼운 유모차 보관 커버나 방풍 커버를 씌워주세요.',
  },
]

// Transit Cost Summary (성인 3인 + 13개월 유아 1인 · 3박 4일 전체 대중교통 및 현지 택시 실비 합산)
export const CONFIRMED_TRANSIT_COST = {
  totalKRW: 245000,
  totalJPY: 26300,
  items: [
    {
      label: '1일차: 오이타공항 → 유후인역 공항 리무진 버스 (성인 3인 · 유아 무료)',
      jpy: 4200,
      krw: 39000,
      note: '4매 회수권(¥5,600) 중 3매 사용 기준 (단권 구매 시 ¥4,800)',
    },
    {
      label: '1일차: 유후인역 「유후인 치키」 캐리어 3개 료칸 당일 배송',
      jpy: 2400,
      krw: 22000,
      note: '캐리어 1개당 약 ¥800 × 3개',
    },
    {
      label: '2일차: JR 유후인역 → JR 벳푸역 특급열차 지정석 3석 (유아 무임)',
      jpy: 8700,
      krw: 81000,
      note: 'JR 특급 유후(Yufu) 지정석 성인 1인 약 ¥2,900 × 3인',
    },
    {
      label: '2~3일차: 벳푸 시내 구간 택시 (벳푸역·유메타운·숙소·우미타마고·가마도지옥 4~5회)',
      jpy: 6400,
      krw: 60000,
      note: '도요타 JPN TAXI 기준 회당 ¥800~¥1,800 (스기노이 숙박 시 역↔호텔 셔틀 무료)',
    },
    {
      label: '4일차: 벳푸(롯카세이/키타하마) → 오이타공항 에어라이너 리무진 (성인 3인)',
      jpy: 4600,
      krw: 43000,
      note: '회수권 잔여 1매(¥1,400) + 성인 2매(¥3,200) 합산',
    },
  ],
}

export type RegionId = 'beppu-yufuin' | 'ureshino-takeo' | 'yufuin-fukuoka'
export type PricePlanType = 'ota-halfboard' | 'ota-breakfast' | 'rack-rate'

export interface RyokanOption {
  id: string
  name: string
  jpName: string
  enSearchQuery: string
  area: string
  tag: string
  roomType: string
  bathType: string
  mealType: string
  babyPerks: string[]
  babyFeeNote: string
  // 성인 3명 + 13개월 아기(소이네 무료/현장소액) 1객실 1박 합산 가격 (단위: 원 / 엔)
  otaBreakfastKRW: number // 아고다·트립닷컴 특가 (룸온리/조식포함 · 성인 3인 1실 합산)
  otaBreakfastJPY: number
  otaHalfBoardKRW: number // 아고다·라쿠텐·자란 특가 (석식+조식 2식 포함 · 성인 3인 1실 합산)
  otaHalfBoardJPY: number
  pricePerNightKRW: number // 공식 홈페이지/일반 정가 (석식+조식 포함)
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
  babyTip: string
  adultTip?: string
  costKRW?: string
  strollerFriendly: '최상 (평지/엘리베이터)' | '양호 (일부 경사)' | '아기띠 권장'
}

export interface DayPlan {
  day: number
  date: string
  dayOfWeek: string
  theme: string
  routeSummary: string
  totalDriveMinutes: number
  items: TimelineItem[]
}

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

export interface FlightOption {
  id: string
  airline: string
  airlineType: 'FSC (대형항공사)' | 'LCC (저비용항공사)'
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

export interface TransportOption {
  id: string
  name: string
  subtitle: string
  vehicleModel: string
  totalCost4DaysKRW: number
  luggageFit: string
  babyComfort: number
  pros: string[]
  cons: string[]
  recommended?: boolean
}

export const OTA_BOOKING_GUIDE = [
  {
    step: '01',
    title: '왜 아고다·트립닷컴에서 볼 때와 가격이 다를까요? (2인 vs 3인 & 식사 옵션)',
    desc: '일본 료칸은 호텔과 달리 「1인당 요금제」입니다. 플랫폼 기본 검색값(성인 2인·조식만 포함)에서는 20~30만 원대로 보이지만, 「성인 3인 + 석식(가이세키)·조식 포함」으로 옵션을 바꾸면 3번째 성인의 식사·침구 비용이 추가됩니다. 다만 공식 정가 대신 아고다·트립닷컴·라쿠텐 쿠폰가를 쓰면 정가 대비 25~35% 저렴해집니다.',
  },
  {
    step: '02',
    title: '13개월 아기 동반 시 15~20만 원 아끼는 검색 공식 (소이네·添い寝 활용)',
    desc: '아고다·부킹닷컴 검색창에 「어린이 1명(만 1세)」을 넣으면 시스템이 아기를 성인/소아 침구·식사 인원으로 잘못 인식해 10~20만 원을 추가 부과하거나 방이 안 뜨는 경우가 많습니다. 반드시 「성인 3명」으로만 검색해 최저가로 예약한 뒤, 예약 메시지로 "13개월 유아 1명 동반(식사·침구 불필요, 소이네)"라고 보내세요. 대부분 무료이거나 현장에서 시설사용료 1,100~2,200엔(약 1~2만 원)만 내면 됩니다.',
  },
  {
    step: '03',
    title: '플랫폼별 가장 싸게 예약하는 루트 (구글맵/네이버 경유 링크)',
    desc: '아고다 앱을 바로 여는 것보다 「구글 맵(Google Maps)이나 네이버 호텔에서 숙소 검색 → 아고다/트립닷컴 클릭」으로 접속하면 시크릿 경유 할인(10~18%)이 추가 적용됩니다. 또한 일본 현지 플랫폼인 「라쿠텐 트래블(Rakuten Travel)」과 「자란넷(Jalan)」은 성인 3인 화양실 재고가 가장 많습니다.',
  },
]

export const FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: 'ke-fuk-morning',
    airline: '대한항공 (Korean Air)',
    airlineType: 'FSC (대형항공사)',
    routeCode: 'ICN ↔ FUK',
    routeName: '인천 ↔ 후쿠오카',
    targetRegionId: 'beppu-yufuin',
    outboundFlight: 'KE787',
    outboundTime: '08:00 인천(T2) → 09:25 후쿠오카',
    inboundFlight: 'KE782',
    inboundTime: '21:05 후쿠오카 → 22:30 인천(T2) (또는 KE788 10:30 출발 선택 가능)',
    duration: '1시간 25분',
    adultFareKRW: 345000,
    infantFareKRW: 34500,
    total3Adults1InfantKRW: 345000 * 3 + 34500,
    baggageRule: '성인 23kg×3개 + 유아 위탁수하물 10kg 1개 추가 + 휴대용 유모차/카시트 무료 위탁',
    babyService: [
      '유아용 기내식(베이비밀/이유식 파우치) 사전 신청 무료 제공',
      '제2여객터미널 패밀리 라운지/유아 휴게실 및 교통약자 우대 출국통로 이용',
      '1열 배시넷(11kg 이하) 또는 넓은 앞좌석 배정 유리',
    ],
    pros: '수하물 여유(유아 10kg 추가)와 T2 교통약자 패스트트랙, 안정적인 스케줄로 13개월 아기 동반 만족도 1위',
    cons: 'LCC 대비 성인 1인당 약 10~12만 원 높은 운임',
    recommended: true,
  },
  {
    id: 'oz-fuk-midMorning',
    airline: '아시아나항공 (Asiana)',
    airlineType: 'FSC (대형항공사)',
    routeCode: 'ICN ↔ FUK',
    routeName: '인천 ↔ 후쿠오카',
    targetRegionId: 'yufuin-fukuoka',
    outboundFlight: 'OZ132',
    outboundTime: '09:50 인천(T1) → 11:10 후쿠오카',
    inboundFlight: 'OZ133',
    inboundTime: '16:00 후쿠오카 → 17:25 인천(T1)',
    duration: '1시간 20분',
    adultFareKRW: 338000,
    infantFareKRW: 33800,
    total3Adults1InfantKRW: 338000 * 3 + 33800,
    baggageRule: '성인 23kg×3개 + 유아 10kg 1개 + 유모차 도어투도어 무료 위탁',
    babyService: [
      '오전 9:50 출발 & 오후 16:00 귀국으로 13개월 아기 밤잠/아침잠 리듬을 깨지 않는 최고의 시간대',
      '기내 유아식(토들러밀/베이비밀) 사전 예약 지원',
    ],
    pros: '새벽 기상 없이 여유롭게 출발하고, 귀국일에도 저녁 식사 시간에 맞춰 귀가 가능한 아기 컨디션 맞춤형 스케줄',
    cons: '인기 시간대라 조기 발권 필수',
    recommended: true,
  },
  {
    id: '7c-oit-direct',
    airline: '제주항공 (Jeju Air)',
    airlineType: 'LCC (저비용항공사)',
    routeCode: 'ICN ↔ OIT',
    routeName: '인천 ↔ 오이타 (벳푸·유후인 직항)',
    targetRegionId: 'beppu-yufuin',
    outboundFlight: '7C1512',
    outboundTime: '10:50 인천(T1) → 12:45 오이타',
    inboundFlight: '7C1511',
    inboundTime: '13:55 오이타 → 15:50 인천(T1)',
    duration: '1시간 50분',
    adultFareKRW: 235000,
    infantFareKRW: 23500,
    total3Adults1InfantKRW: 235000 * 3 + 23500,
    baggageRule: 'FLY BAG 기준 성인 15kg×3개 + 유모차 1대 무료 위탁 (유아 별도 수하물 없음)',
    babyService: [
      '오이타 공항 도착 후 입국심사 15분 컷 (소규모 공항이라 대기줄이 거의 없음)',
      '오이타 공항에서 벳푸 숙소까지 차로 단 35분, 유후인까지 50분 소요',
    ],
    pros: '후쿠오카 대비 육로 이동 시간을 왕복 2시간 이상 단축! 공항 입출국 대기가 극도로 짧아 아기 피로도 최소화',
    cons: '귀국편이 13:55 출발이라 4일차 오전 일정이 짧음',
    recommended: true,
  },
  {
    id: 'lj-fuk-value',
    airline: '진에어 (Jin Air)',
    airlineType: 'LCC (저비용항공사)',
    routeCode: 'ICN ↔ FUK',
    routeName: '인천 ↔ 후쿠오카',
    targetRegionId: 'ureshino-takeo',
    outboundFlight: 'LJ263',
    outboundTime: '09:15 인천(T2) → 10:35 후쿠오카',
    inboundFlight: 'LJ266',
    inboundTime: '15:10 후쿠오카 → 16:35 인천(T2)',
    duration: '1시간 20분',
    adultFareKRW: 215000,
    infantFareKRW: 21500,
    total3Adults1InfantKRW: 215000 * 3 + 21500,
    baggageRule: '기본 운임에 성인 15kg×3개 무료 포함 + 유아 휴대용 유모차 무료 위탁 (인천공항 T2 출발)',
    babyService: [
      'LCC 중 유일하게 인천공항 제2터미널(T2)을 사용해 출국장이 쾌적하고 대한항공 계열 안정성 보유',
      '지니스트레치(맨 앞좌석) 사전 구매 시 성인 3명 한 줄 배정으로 아기 케어 매우 편리',
    ],
    pros: '가성비 최고 + 인천 T2 출발 + 기본 위탁수하물 15kg 포함으로 4인 총 항공권 66만 원대 완성',
    cons: '기내 유아식 미제공 (이유식 파우치 직접 반입 필요)',
  },
  {
    id: 'tw-hsg-direct',
    airline: '티웨이항공 (T’way Air)',
    airlineType: 'LCC (저비용항공사)',
    routeCode: 'ICN ↔ HSG',
    routeName: '인천 ↔ 사가 (우레시노 직항)',
    targetRegionId: 'ureshino-takeo',
    outboundFlight: 'TW285',
    outboundTime: '08:25 인천(T1) → 09:50 사가',
    inboundFlight: 'TW286',
    inboundTime: '10:50 사가 → 12:20 인천(T1)',
    duration: '1시간 25분',
    adultFareKRW: 198000,
    infantFareKRW: 20000,
    total3Adults1InfantKRW: 198000 * 3 + 20000,
    baggageRule: '스마트 운임 기준 성인 15kg×3개 + 유모차 무료 위탁',
    babyService: [
      '사가공항 내 렌터카 데스크 바로 연결 (대기 10분 이내 출발)',
      '사전 예약형 우레시노 온천 직행 합승 리무진 택시(1인 약 2,500엔) 운영',
    ],
    pros: '가장 저렴한 항공권(총 61만 원대)과 한산한 시골 공항의 초고속 입국, 우레시노 온천 마을까지 50분 직결',
    cons: '24일(목) 귀국편이 오전일 경우 체크아웃 직후 바로 공항으로 이동해야 함',
  },
]

export const TRANSPORT_OPTIONS: TransportOption[] = [
  {
    id: 'minivan-rental',
    name: '미니밴 렌터카 (6~7인승 도요타 시엔타 / 노아 / 복시)',
    subtitle: '성인 3명 + 13개월 아기(ISOFIX 카시트) + 캐리어 3개 + 유모차 완벽 수납',
    vehicleModel: 'Toyota Noah / Voxy / Sienta (자동 슬라이딩 도어 + 카시트 1개 대여 + 풀커버 보험 + ETC 프리패스)',
    totalCost4DaysKRW: 420000,
    luggageFit: '2열에 아기 카시트 + 성인 1명, 1열에 운전자 + 조수석 성인 1명, 3열 폴딩 시 28인치 캐리어 3개 + 유모차 여유 수납',
    babyComfort: 99,
    pros: [
      '아기가 낮잠 자거나 기저귀를 갈아야 할 때 언제든 우리 가족만의 프라이빗 이동 공간 확보',
      '버스/기차 시간표에 쫓기지 않고 아기 컨디션에 맞춰 일정 즉시 조절 가능',
      '12월 유후인·벳푸 산간도로 주행을 위한 스노우 타이어(스터드리스) 옵션 추가 시 안전 운행',
    ],
    cons: ['일본 우핸들/좌측통행 적응 필요 (고속도로 위주라 난이도는 낮음)'],
    recommended: true,
  },
  {
    id: 'private-jumbo-taxi',
    name: '프라이빗 밴 투어 / 공항↔료칸 전용 송영 택시 (알파드/하이에이스)',
    subtitle: '운전 부담 없이 도어 투 도어(Door-to-Door)로 이동하고 싶을 때',
    vehicleModel: 'Toyota Alphard (고급 의전 밴) 또는 HiAce 점보택시 + 유아 카시트 사전 장착',
    totalCost4DaysKRW: 780000,
    luggageFit: '대형 캐리어 4개 + 유모차 + 성인 3명 + 아기 카시트 넉넉하게 탑승',
    babyComfort: 97,
    pros: [
      '어른 3명 모두 운전 피로 없이 맥주/사케를 곁들인 식사 가능',
      '공항 입국장 앞에서 기사님 미팅 후 료칸 현관까지 논스톱 이동',
    ],
    cons: ['렌터카 대비 약 35~40만 원 비용 상승'],
  },
  {
    id: 'express-train-bus',
    name: '특급열차 (유후인노모리 / 카모메 릴레이) + 현지 택시 조합',
    subtitle: '기차 여행 감성을 원할 때 (단, 짐 배송 서비스 병행 권장)',
    vehicleModel: 'JR 특급열차 지정석 3석 + 유아 무임(무릎 탑승) + 역↔료칸 택시',
    totalCost4DaysKRW: 290000,
    luggageFit: '캐리어 3개 + 유모차 + 아기를 동시에 데리고 기차 환승 시 어른 3명 손이 모두 부족함',
    babyComfort: 72,
    pros: ['일본 특급열차(유후인노모리) 도시락 감성과 가장 저렴한 교통비'],
    cons: [
      '13개월 아기가 기차 안에서 보챌 경우 2시간 동안 달래기 부담스러움',
      '유모차 접고 펴기 및 캐리어 적재 피로도가 높음',
    ],
  },
]

export const REGION_PLANS: RegionPlan[] = [
  {
    id: 'beppu-yufuin',
    rank: 1,
    badge: '추천 1순위 · 웰컴베이비 인프라 완비',
    name: '벳푸 & 유후인 (오이타현)',
    subtitle: '오션뷰 객실 노천탕 화양실 + 유모차 100% 평지 수족관·호수 산책 코스',
    airport: '오이타공항(OIT, 35분) 또는 후쿠오카공항(FUK, 1시간 40분)',
    waterType: '나트륨 염화물천 & 단순온천 (무색투명·자극 없는 온천수 위주 선택)',
    waterTemp: '원천 55~80°C → 객실탕 가수(물 섞기) 온도 조절기로 38.5°C 세팅 가능',
    babySkinSafeScore: 95,
    mobilityScore: 98,
    threeAdultsRoomScore: 99,
    overallScore: 98,
    summary:
      '성인 3명 + 13개월 아기가 한 객실(침대 2 + 다다미 요이불 2)에서 넉넉하게 묵을 수 있는 대형 화양실 료칸이 가장 많고, 수족관·사파리·호수 산책 등 13개월 아기와 어른 3명 모두가 만족할 관광 코스가 완벽하게 갖춰진 1순위 지역입니다.',
    whyBestFor13Month: [
      '전 객실 오션뷰 반노천탕이 딸린 넓은 화양실(아마네 리조트 세이카이 등)이 있어 아기 재운 뒤 어른 3명이 교대로 온천욕 가능',
      '벳푸 우미타마고 수족관(실내·유모차 완비)과 아프리칸 사파리(렌터카 그대로 탑승 관람)가 숙소 20분 거리에 위치',
      '대형 마트(유메타운 벳푸)와 드럭스토어가 가까워 기저귀·아기보리차·바나나·요거트 조달이 매우 쉬움',
      '어른 3명 중 1명이 아기를 보는 동안 나머지 2명이 지옥순례나 노천 대욕장을 다녀오는 교대 코스에 최적',
    ],
    routeNodes: [
      {
        step: 1,
        place: '후쿠오카공항(또는 오이타공항)',
        stayOrStop: '미니밴 렌터카 픽업 (카시트 장착)',
        durationToNext: '오이타 35분 / 후쿠오카 1시간 35분',
        modeToNext: '고속도로 (중간 휴게소 수유실 완비)',
      },
      {
        step: 2,
        place: '유후인 온천 마을 (1박)',
        stayOrStop: '긴린코 호수 유모차 산책 & 별채 가족탕 료칸 숙박',
        durationToNext: '35분 (유후다케 드라이브 코스)',
        modeToNext: '미니밴 렌터카',
      },
      {
        step: 3,
        place: '벳푸 오션뷰 온천 리조트 (2박 연박)',
        stayOrStop: '아마네 리조트 세이카이 / 스기노이 연박 (짐 풀고 이동 스트레스 제로)',
        durationToNext: '1시간 40분 (오이타공항은 35분)',
        modeToNext: '미니밴 렌터카',
      },
      {
        step: 4,
        place: '공항 반납 & 귀국',
        stayOrStop: '라라포트 후쿠오카(아카짱혼포) 경유 후 출국',
      },
    ],
    ryokans: [
      {
        id: 'seikai',
        name: '아마네 리조트 세이카이 (AMANE RESORT SEIKAI)',
        jpName: 'アマネリゾート晴海',
        enSearchQuery: 'AMANE RESORT SEIKAI Beppu',
        area: '벳푸 쇼닝가하마 해변',
        tag: '성인3+아기1 만족도 1위 · 전 객실 오션뷰 노천탕',
        roomType: '우미노무네(바다동) 화양실 (65~80㎡ · 트윈베드 2 + 다다미방 요이불 2)',
        bathType: '전 객실 바다 전망 프라이빗 반노천 온천탕 (온도 조절 가능)',
        mealType: '개별 룸 다이닝 가이세키 또는 조식 포함 플랜 선택 가능',
        babyPerks: [
          '아기용 유카타·아기 욕조·기저귀 쓰레기통 무료 대여 (사전 메시지 요청)',
          '침대 2개 + 넓은 다다미 공간이 분리되어 아기는 다다미에서 안전하게 취침 가능',
          '체크인 후 유모차를 끌고 바로 앞 해변 산책로와 유메타운 쇼핑몰 이동 가능',
        ],
        babyFeeNote: '만 1세(13개월) 유아 소이네(침구·식사 미신청) 시 무료 또는 현장 시설료 소액',
        otaBreakfastKRW: 430000,
        otaBreakfastJPY: 46200,
        otaHalfBoardKRW: 590000,
        otaHalfBoardJPY: 63400,
        pricePerNightKRW: 790000,
        pricePerNightJPY: 85000,
        bestPlatform: '아고다(구글맵 경유) · 라쿠텐 트래블',
        rating: 4.9,
        highlight: '파도 소리를 들으며 객실 내 대형 노천탕에서 아기 물놀이와 어른 힐링을 동시에',
      },
      {
        id: 'suginoi-sora',
        name: '벳푸 스기노이 호텔 소라관/니지관 (Suginoi Hotel)',
        jpName: '別府温泉 杉乃井ホテル',
        enSearchQuery: 'Suginoi Hotel Beppu',
        area: '벳푸 칸카이지 온천 고지대',
        tag: '웰컴베이비 끝판왕 · 뷔페 이유식 코너 무료',
        roomType: '소라관 디럭스 화양실 또는 니지관 패밀리룸 (성인 3~4인실)',
        bathType: '소라유/타나유 인피니티 노천탕 + 프라이빗 가족탕(전세탕)',
        mealType: '테라스 석식·조식 뷔페 (9개월/12개월+ 시판 이유식 무료 제공)',
        babyPerks: [
          '레스토랑 내 완료기 일본 이유식 파우치 & 아기 식판·턱받이 무제한 무료 제공',
          '방수 기저귀 착용 시 아쿠아가든 온수풀 입수 가능, 실내 키즈 플레이존 완비',
          '니지관(조식포함) 선택 시 아고다에서 성인 3인 1박 30만 원대 초반에도 예약 가능!',
        ],
        babyFeeNote: '만 3세 미만 유아 숙박 및 뷔페 식사 완전 무료!',
        otaBreakfastKRW: 340000,
        otaBreakfastJPY: 36500,
        otaHalfBoardKRW: 510000,
        otaHalfBoardJPY: 54800,
        pricePerNightKRW: 720000,
        pricePerNightJPY: 77500,
        bestPlatform: '아고다 · 트립닷컴 (니지관/소라관 특가 자주 오픈)',
        rating: 4.8,
        highlight: '13개월 아기 먹거리(이유식·유아식·과일) 걱정을 100% 덜어주는 가족 친화 리조트',
      },
      {
        id: 'yufuin-hoteiya',
        name: '유후인 산스이칸 / 호테이야 (Yufuin Sansuikan / Hoteiya)',
        jpName: 'ゆふいん山水館 / ほてい屋',
        enSearchQuery: 'Yufuin Sansuikan Ryokan',
        area: '유후인 중심가 & 긴린코 인근',
        tag: '아고다 가성비 우수 · 전세 가족탕 완비',
        roomType: '화양실 또는 별채 화실 (성인 3~4인 정원)',
        bathType: '무료 전세 가족탕 + 유후다케 뷰 노천 대욕장',
        mealType: '조식 포함 플랜(유후인 외식) 또는 석·조식 포함 플랜 선택',
        babyPerks: [
          '조식 포함 플랜(성인 3인 36만 원대)으로 예약하고 저녁은 유후인 맛집/마트를 이용하면 경비를 크게 절약 가능',
          '다다미 공간이 넓어 13개월 아기가 기어 다니거나 걸어 다니기에 안전함',
        ],
        babyFeeNote: '만 1세 유아 침구 미사용 시 무료 (현장 시설료 약 1,650엔 별도 가능)',
        otaBreakfastKRW: 360000,
        otaBreakfastJPY: 38700,
        otaHalfBoardKRW: 520000,
        otaHalfBoardJPY: 55900,
        pricePerNightKRW: 740000,
        pricePerNightJPY: 79500,
        bestPlatform: '아고다 · 자란넷(Jalan)',
        rating: 4.85,
        highlight: '유후인에서 아고다 프로모션 할인율이 가장 좋은 가족 친화 료칸',
      },
    ],
    days: [
      {
        day: 1,
        date: '12월 21일 (월)',
        dayOfWeek: 'Day 1 · 월요일',
        theme: '설레는 출국 → 유후인 도착 & 독채 노천탕 첫 온천욕',
        routeSummary: '인천공항 → 후쿠오카(또는 오이타)공항 → 유후인 온천 마을 (체크인 & 호수 산책)',
        totalDriveMinutes: 95,
        items: [
          {
            time: '08:00 ~ 10:30',
            title: '인천 출발 → 후쿠오카/오이타 공항 도착 & 미니밴 렌터카 픽업',
            place: '국제선 터미널 & 렌터카 데스크',
            desc: '유아 동반 패스트트랙으로 빠르게 출국 후 비행(1시간 20분). 공항 도착 후 6~7인승 미니밴(ISOFIX 카시트 장착 확인) 인수.',
            transport: '비행기 1시간 20분',
            babyTip: '이착륙 시 귀 먹먹함 방지를 위해 쪽쪽이 또는 아기 보리차 빨대컵을 물려주세요.',
            adultTip: '어른 1명은 수하물/유모차를 찾고, 어른 1명은 렌터카 수속을 밟으면 20분 단축됩니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '11:30 ~ 13:00',
            title: '고속도로 이동 (아기 오전 낮잠 타임) & 야마다 SA 휴게소 점심',
            place: '오이타 자동차도 야마다 휴게소 (Yamada SA)',
            desc: '차 안에서 아기 첫 낮잠을 유도하며 이동. 친환경 휴게소인 야마다 SA에서 우동·소바·베이커리로 가벼운 점심 식사.',
            transport: '렌터카 1시간 20분',
            babyTip: '야마다 SA에는 깔끔한 개별 수유실, 온수 조유기, 기저귀 교환대가 완비되어 있습니다.',
            costKRW: '성인 3인 점심 약 35,000원',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '13:45 ~ 15:15',
            title: '긴린코 호수 평지 산책 & 유노츠보 거리 간식 타임',
            place: '유후인 긴린코 호수 주변 주차장',
            desc: '인파가 붐비는 메인 거리 대신 호수 바로 앞 주차장에 주차 후 평탄한 데크길을 따라 유모차 산책 및 미르히 푸딩/금상 고로케 시식.',
            transport: '렌터카 30분',
            babyTip: '미르히 따뜻한 우유 푸딩 윗부분이나 찐 고구마는 13개월 아기 간식으로도 좋습니다.',
            adultTip: '어른 3명 중 2명씩 번갈아 소품샵(미피 모리노키친 등) 구경 찬스!',
            costKRW: '주차 및 간식 약 28,000원',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '15:30 ~ 20:00',
            title: '유후인 독채 료칸 체크인 & 프라이빗 객실 온천 + 가이세키 석식',
            place: '유후인 호테이야 (또는 산스이칸)',
            desc: '체크인 후 객실 전용 노천탕에 찬물을 섞어 38.5도로 맞춘 뒤 아기 첫 온천 물놀이(5~8분). 저녁에는 개별 다이닝룸에서 분고규 가이세키 만찬.',
            babyTip: '아기 온천 후에는 수분 손실이 빠르므로 보리차와 아기 로션을 바로 발라주세요.',
            adultTip: '아기 취침(20:30) 후 어른 3명이 야외 대욕장과 맥주 타임을 여유롭게 즐기세요.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
        ],
      },
      {
        day: 2,
        date: '12월 22일 (화)',
        dayOfWeek: 'Day 2 · 화요일',
        theme: '아프리칸 사파리(자차 탑승) & 벳푸 오션뷰 리조트 연박 체크인',
        routeSummary: '유후인 → 규슈 자연동물공원 아프리칸 사파리 → 벳푸 유메타운 마트 → 아마네 리조트 세이카이',
        totalDriveMinutes: 55,
        items: [
          {
            time: '08:30 ~ 10:00',
            title: '료칸 조식 & 아침 물안개 온천욕 후 체크아웃',
            place: '유후인 숙소',
            desc: '구운 생선, 두부, 계란찜, 김(조미 안 된 구운 김)이 나오는 일본식 조식으로 아기 아침 식사까지 든든하게 해결.',
            babyTip: '료칸 조식의 연두부(유도후)와 계란찜(차완무시)은 13개월 아기가 정말 잘 먹습니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '10:30 ~ 12:30',
            title: '규슈 아프리칸 사파리 (우리 렌터카 그대로 탑승 관람)',
            place: '규슈 자연동물공원 아프리칸 사파리',
            desc: '유후인에서 단 25분 거리! 추운 겨울 바람을 맞거나 유모차를 끌 필요 없이 따뜻한 우리 미니밴 안에서 기린·코끼리·사자를 바로 눈앞에서 관람.',
            transport: '렌터카 25분',
            babyTip: '13개월 아기가 창밖으로 기린과 얼룩말을 보며 가장 신나하는 만족도 200% 코스입니다.',
            costKRW: '성인 3인 입장료 약 72,000원 (유아 무료)',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '13:00 ~ 15:00',
            title: '벳푸 이동 & 유메타운(YouMe Town) 점심 + 아기용품 쇼핑',
            place: '유메타운 벳푸 (대형 쇼핑몰)',
            desc: '무료 주차 완비 대형 몰에서 회전초밥/함바그 점심 식사 후, 아카짱 코너 및 마트에서 아기 과일(딸기·바나나), 우유, 간식 및 어른 야식 구매.',
            transport: '렌터카 30분',
            babyTip: '유메타운 3층 베이비룸에 전자레인지가 있어 완료기 이유식을 데워 먹이기 아주 편합니다.',
            costKRW: '점심 및 마트 장보기 약 85,000원',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '15:15 ~ 21:00',
            title: '벳푸 오션뷰 리조트(세이카이/스기노이) 2박 연박 체크인',
            place: '벳푸 쇼닝가하마 해변 (아마네 리조트 세이카이)',
            desc: '2박 연박이라 짐을 다시 쌀 필요가 없습니다! 바다와 맞닿은 객실 노천탕에서 일몰 온천욕을 즐기고 해산물 가이세키 석식.',
            babyTip: '화양실 다다미 공간에 요이불 2채를 미리 깔아달라고 요청하면 아기 놀이매트처럼 쓸 수 있습니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
        ],
      },
      {
        day: 3,
        date: '12월 23일 (수)',
        dayOfWeek: 'Day 3 · 수요일',
        theme: '우미타마고 수족관 & 어른 교대 가마도 지옥순례 + 온천 힐링 데이',
        routeSummary: '벳푸 숙소 → 우미타마고 수족관(차로 10분) → 숙소 낮잠 & 지옥순례 → 벳푸 온천 스팀 요리',
        totalDriveMinutes: 35,
        items: [
          {
            time: '09:30 ~ 12:00',
            title: '오이타 마린팰리스 수족관 「우미타마고」 관람',
            place: '벳푸 우미타마고 수족관 (숙소에서 차로 8분)',
            desc: '단차가 전혀 없는 100% 유모차 친화형 수족관! 유리창 너머 돌고래, 바다코끼리 공연과 산호초 수조가 아기 눈높이에 딱 맞춰져 있습니다.',
            transport: '렌터카 8분',
            babyTip: '수조 높이가 낮아 유모차에 앉은 상태에서도 13개월 아기가 물고기를 한눈에 볼 수 있습니다.',
            costKRW: '성인 3인 입장료 약 72,000원 (유아 무료)',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '12:15 ~ 13:45',
            title: '지옥찜 공방 칸나와 또는 회전초밥 카메쇼 쿠루쿠루 스시 점심',
            place: '벳푸 칸나와 온천지구',
            desc: '100도 온천 증기로 쪄낸 고구마·옥수수·계란·야채·소고기 지옥찜! 간이 세지 않아 13개월 아기와 어른 3명이 함께 먹기 최고의 건강식.',
            transport: '렌터카 12분',
            babyTip: '온천 증기로 찐 단호박, 고구마, 연어/흰살생선은 아기 유아식 반찬으로 완벽합니다.',
            costKRW: '성인 3인 식사 약 65,000원',
            strollerFriendly: '양호 (일부 경사)',
          },
          {
            time: '14:00 ~ 16:30',
            title: '가마도 지옥(유모차 가능) 관람 & 리조트 복귀 후 아기 낮잠 + 어른 교대 자유시간',
            place: '가마도 지옥 & 리조트 오션뷰 라운지',
            desc: '가마도 지옥에서 온천 달걀·사이다 맛보기 후 리조트로 복귀. 아기 오후 낮잠 시간 동안 어른 2명은 8층 대욕장/카페, 어른 1명은 객실 휴식 교대!',
            transport: '렌터카 15분',
            babyTip: '2박 연박의 최대 장점! 오후 2~4시 아기 낮잠 시간에 체크아웃 걱정 없이 객실에서 푹 재울 수 있습니다.',
            adultTip: '어른 3명 여행의 특권! 1명이 아기 낮잠을 지키는 동안 2명은 근처 카페·대욕장을 자유롭게 다녀오세요.',
            costKRW: '입장료 및 간식 약 22,000원',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '17:30 ~ 21:00',
            title: '마지막 밤 스페셜 석식 & 별빛 오션뷰 노천탕',
            place: '리조트 내 레스토랑 & 객실 노천탕',
            desc: '분고수도 제철 해산물과 와규 스테이크 석식 후, 크리스마스 이브 전야를 기념하는 가족 다과 타임.',
            babyTip: '내일 귀국 전 아기 짐과 기저귀·이유식 잔여 수량을 미리 정리해 두면 아침이 여유롭습니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
        ],
      },
      {
        day: 4,
        date: '12월 24일 (목)',
        dayOfWeek: 'Day 4 · 목요일 (크리스마스 이브 귀국)',
        theme: '아침 온천욕 → 라라포트 후쿠오카(아카짱혼포) 쇼핑 → 공항 귀국',
        routeSummary: '벳푸 체크아웃 → 후쿠오카 라라포트(점심 & 아기용품 쇼핑) → 후쿠오카공항 렌터카 반납 & 출국',
        totalDriveMinutes: 110,
        items: [
          {
            time: '08:30 ~ 10:00',
            title: '느긋한 리조트 조식 & 체크아웃',
            place: '벳푸 숙소',
            desc: '오션뷰 레스토랑에서 조식 후 체크아웃. (오이타 직항 이용 시에는 벳푸 해변 산책 후 11:30 공항 이동)',
            babyTip: '출발 직전 기저귀를 새것으로 갈아주고 차에 태우면 고속도로에서 1시간 반 푹 잡니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '11:40 ~ 14:00',
            title: '라라포트 후쿠오카 (아카짱혼포 면세 쇼핑 & 푸드코트 점심)',
            place: 'LaLaport Fukuoka (공항에서 차로 15분 거리)',
            desc: '후쿠오카 최대 규모 쇼핑몰! 3층 아카짱혼포에서 13개월 아기 빨대컵, 과자, 유아 칫솔, 목욕 장난감 면세 쇼핑 및 넓은 패밀리 푸드코트 점심.',
            transport: '렌터카 1시간 35분',
            babyTip: '라라포트 푸드코트에는 유아 전용 하이체어와 아기 식탁이 모여 있는 키즈 다이닝 존이 있습니다.',
            adultTip: '어른 1명이 아기와 키즈존에서 쉬는 동안 2명이 유니클로/칼디/건담 파크 쇼핑!',
            costKRW: '점심 및 쇼핑 예산 별도',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '14:15 ~ 17:30',
            title: '후쿠오카 공항 렌터카 반납 & 인천 도착',
            place: '후쿠오카 국제선 터미널 → 인천국제공항',
            desc: '공항 바로 앞 렌터카 지점 반납(셔틀 5분) 후 출국 수속 및 면세점 쇼핑 후 한국 귀국.',
            transport: '비행기 1시간 25분',
            babyTip: '일본에서 구매한 100ml 초과 액체류/젤리 형태 간식은 위탁수하물에 넣고, 기내용 분유/이유식만 휴대하세요.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
        ],
      },
    ],
  },
  {
    id: 'ureshino-takeo',
    rank: 2,
    badge: '추천 2순위 · 아기 피부 보습 1위 미인온천 & 최단 이동거리',
    name: '우레시노 & 다케오 (사가현)',
    subtitle: '후쿠오카에서 1시간! 일본 3대 미인온천의 실크 온천수와 객실 식사 료칸',
    airport: '후쿠오카공항(FUK, 1시간 10분) 또는 사가공항(HSG, 50분)',
    waterType: '나트륨 탄산수소염천 (일본 3대 미인온천 · 무색투명 알칼리성 실크 수질)',
    waterTemp: '원천 75°C → 객실 히노키탕/가족탕 38°C 맞춤 조절',
    babySkinSafeScore: 99,
    mobilityScore: 96,
    threeAdultsRoomScore: 93,
    overallScore: 95,
    summary:
      '이동 시간이 길면 힘들어하는 13개월 아기를 위해 이동 거리를 최소(1시간 내외)로 줄이고, 로션을 바른 듯 매끄러운 우레시노 미인온천수와 다다미 객실 내 식사(오헤야쇼쿠)로 온전히 휴식에 집중하는 프라이빗 힐링 코스입니다.',
    whyBestFor13Month: [
      '일본 3대 미인온천(나트륨 탄산수소염천)으로 유황 냄새나 산성 자극이 전혀 없어 아기 아토피·건조 피부에 최고',
      '우레시노 명물 「온천 유도후(온천수로 끓여 눈처럼 녹는 두부 전골)」가 간이 순해 13개월 아기 특식으로 완벽',
      '다다미 객실 내 식사(오헤야쇼쿠) 제공 료칸이 많아 아기가 방에서 뒹굴며 노는 동안 어른 3명이 편하게 가이세키 식사 가능',
      '다케오 시립도서관(어린이 그림책 도서관 + 스타벅스)과 녹차밭 테라스 등 조용하고 평화로운 유모차 동선',
    ],
    routeNodes: [
      {
        step: 1,
        place: '후쿠오카공항(또는 사가공항)',
        stayOrStop: '미니밴 렌터카 픽업',
        durationToNext: '55분 ~ 1시간 10분',
        modeToNext: '나가사키 자동차도 (평탄한 고속도로)',
      },
      {
        step: 2,
        place: '우레시노 온천 마을 (2박 연박)',
        stayOrStop: '미인온천 히노키 노천탕 & 온천 두부 전골',
        durationToNext: '25분',
        modeToNext: '렌터카',
      },
      {
        step: 3,
        place: '다케오 온천 & 어린이 도서관 → 후쿠오카 (1박)',
        stayOrStop: '다케오 그림책 도서관 & 후쿠오카 텐진/하카타 숙박',
        durationToNext: '15분',
        modeToNext: '공항 택시/렌터카',
      },
      {
        step: 4,
        place: '후쿠오카 공항 귀국',
        stayOrStop: '오전 쇼핑 후 여유로운 귀국',
      },
    ],
    ryokans: [
      {
        id: 'wataya-besso',
        name: '우레시노 와타야 벳소 (Wataya Besso)',
        jpName: '嬉野温泉 和多屋別荘',
        enSearchQuery: 'Wataya Besso Ureshino',
        area: '우레시노 강변 중심가',
        tag: '2만 평 정원 & 서점·티라운지 복합 료칸',
        roomType: '히노키탕 딸린 화양실 또는 넓은 다다미 화실 (성인 3인+유아 1인)',
        bathType: '객실 히노키탕 / 프라이빗 가족탕 + 미인온천 대욕장',
        mealType: '조식 포함(아고다 특가) 또는 사가규 가이세키 2식 포함 선택',
        babyPerks: [
          '관내에 피에르 에르메 카페와 책방(Books & Tea)이 있어 유모차로 실내 산책하기 최고',
          '아고다에서 조식 포함 플랜 선택 시 성인 3인 1박 35만 원대로 가성비 있게 숙박 가능',
        ],
        babyFeeNote: '만 2세 미만 유아 소이네(침구·식사 불필요) 무료',
        otaBreakfastKRW: 350000,
        otaBreakfastJPY: 37600,
        otaHalfBoardKRW: 540000,
        otaHalfBoardJPY: 58000,
        pricePerNightKRW: 760000,
        pricePerNightJPY: 81500,
        bestPlatform: '아고다 · 트립닷컴 · 라쿠텐 트래블',
        rating: 4.9,
        highlight: '우레시노 강을 바라보며 즐기는 실크 같은 미인온천과 모던한 문화 공간',
      },
      {
        id: 'ureshino-shoen',
        name: '우레시노 료칸 쇼엔 (Ryokan Shoen)',
        jpName: '嬉野温泉 旅館 松園',
        enSearchQuery: 'Ryokan Shoen Ureshino',
        area: '우레시노 온천교 인근',
        tag: '객실 내 식사(오헤야쇼쿠) + 무료 가족탕 가성비 1위',
        roomType: '전통 다다미 화실 12조+넓은 툇마루 (성인 3~4인실)',
        bathType: '투숙객 무료 프라이빗 가족탕(전세탕) + 노천 대욕장',
        mealType: '객실 내 식사(방으로 직접 서빙되는 가이세키 & 아침 온천 두부)',
        babyPerks: [
          '식당으로 이동할 필요 없이 우리가 묵는 다다미방 안에서 석식·조식을 모두 차려주어 13개월 아기 케어에 압도적으로 편리',
          '아기용 무료 흰쌀밥·김·계란찜 서비스 및 친절한 오카미상의 아기 맞이',
        ],
        babyFeeNote: '유아 침구 미사용 시 시설료 약 1,100엔 수준',
        otaBreakfastKRW: 290000,
        otaBreakfastJPY: 31200,
        otaHalfBoardKRW: 430000,
        otaHalfBoardJPY: 46200,
        pricePerNightKRW: 560000,
        pricePerNightJPY: 60000,
        bestPlatform: '자란넷(Jalan) · 아고다 · 라쿠텐 트래블',
        rating: 4.8,
        highlight: '방 안에서 아기 재우며 편안하게 사가규 가이세키를 즐기는 가성비 명품 료칸',
      },
    ],
    days: [
      {
        day: 1,
        date: '12월 21일 (월)',
        dayOfWeek: 'Day 1 · 월요일',
        theme: '최단 거리 이동! 우레시노 미인온천 도착 & 객실 가이세키',
        routeSummary: '인천 → 후쿠오카/사가공항 → 우레시노 온천 마을 (이동 1시간 컷)',
        totalDriveMinutes: 65,
        items: [
          {
            time: '10:30 ~ 12:30',
            title: '공항 도착 & 우레시노 온천 마을로 직행',
            place: '후쿠오카/사가공항 → 우레시노 IC',
            desc: '고속도로로 1시간이면 도착! 장거리 차 탑승을 싫어하는 13개월 아기에게 부담이 전혀 없는 최단 코스.',
            transport: '렌터카 1시간',
            babyTip: '이동 시간이 짧아 아기 컨디션이 첫날부터 최상으로 유지됩니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '12:45 ~ 14:15',
            title: '소안 요코초(宗庵よこ長) 원조 온천 유도후(온천 두부) 점심',
            place: '우레시노 온천 상점가',
            desc: '알칼리성 온천수로 끓여내어 순두부보다 더 부드럽게 풀어지는 우레시노 명물 두부 전골. 아기와 어른 모두에게 최고의 첫 끼.',
            babyTip: '양념 넣기 전 온천수에 끓인 따뜻한 두부와 국물을 덜어 아기 밥과 함께 먹이세요.',
            costKRW: '성인 3인 식사 약 42,000원',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '15:00 ~ 20:00',
            title: '우레시노 료칸 체크인 (2박 연박) & 미인온천 가족탕 + 객실 식사',
            place: '와타야 벳소 또는 쇼엔',
            desc: '미끈미끈한 화장수 같은 온천수에서 아기 목욕 후, 다다미 객실 안에서 여유롭게 사가규 가이세키 만찬.',
            babyTip: '우레시노 온천수는 보습 성분이 풍부해 목욕 후 아기 피부가 놀랍도록 보들보들해집니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
        ],
      },
      {
        day: 2,
        date: '12월 22일 (화)',
        dayOfWeek: 'Day 2 · 화요일',
        theme: '다케오 어린이 그림책 도서관 & 사가 녹차밭 힐링 산책',
        routeSummary: '우레시노 → 다케오 시립도서관 & 어린이 도서관 → 녹차 테라스 → 우레시노',
        totalDriveMinutes: 50,
        items: [
          {
            time: '10:30 ~ 13:00',
            title: '다케오 시립도서관 & 어린이 도서관(모리노 헤야) 나들이',
            place: '다케오 온천 (우레시노에서 차로 25분)',
            desc: '일본에서 가장 아름다운 츠타야 도서관과 바로 옆 아기 전용 어린이 그림책 도서관! 신발을 벗고 들어가는 잔디/마루 공간이 있어 13개월 아기가 마음껏 걸어 다닐 수 있습니다.',
            transport: '렌터카 25분',
            babyTip: '어린이 도서관 2층에 수유실과 아기 쉼터, 앞마당에 잔디 광장이 있어 유모차 끌기 최고입니다.',
            adultTip: '어른들은 츠타야 스타벅스에서 커피와 굿즈 쇼핑을 즐기세요.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '13:30 ~ 18:00',
            title: '우레시노 강변 족욕 공원 산책 & 료칸 연박 온천 휴식',
            place: '우레시노 시볼트 족욕탕 & 숙소',
            desc: '무료 온천 증기 족욕탕과 평탄한 우레시노 강변 산책로를 따라 유모차 산책 후, 료칸에서 오후 낮잠 및 어른 교대 마사지/대욕장 힐링.',
            babyTip: '강변 산책로가 차 없는 평지 위주라 아기 걸음마 연습과 유모차 산책에 안전합니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
        ],
      },
      {
        day: 3,
        date: '12월 23일 (수)',
        dayOfWeek: 'Day 3 · 수요일',
        theme: '도스 프리미엄 아울렛(베베/미키하우스) & 후쿠오카 시내 체크인',
        routeSummary: '우레시노 체크아웃 → 도스 프리미엄 아울렛 → 후쿠오카 하카타/텐진 호텔',
        totalDriveMinutes: 75,
        items: [
          {
            time: '10:30 ~ 14:30',
            title: '도스 프리미엄 아울렛 (미키하우스·갭베이비·폴로 아기옷 쇼핑)',
            place: 'Tosu Premium Outlets (고속도로 분기점 바로 옆)',
            desc: '단층 야외 스트리트 구조라 유모차 이동이 매우 편하며, 미키하우스(Miki House) 신발과 폴로 베이비 할인율이 높아 13개월 걸음마 신발 구매 성지!',
            transport: '렌터카 45분',
            babyTip: '수유실에 기저귀 자판기, 70도 조유 온수기, 이유식 전자레인지가 완벽히 갖춰져 있습니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '15:30 ~ 20:00',
            title: '후쿠오카 시내 호텔 체크인 & 크리스마스 마켓 산책',
            place: '하카타역 일루미네이션 & 시내 호텔',
            desc: '렌터카 반납 후 하카타역/텐진 패밀리 호텔 체크인. 저녁에는 화려한 하카타 크리스마스 일루미네이션 구경 및 모츠나베/야키니쿠 석식.',
            transport: '렌터카 30분',
            babyTip: '마지막 밤을 공항 10분 거리인 하카타에서 묵으면 다음 날 귀국이 정말 편안합니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
        ],
      },
      {
        day: 4,
        date: '12월 24일 (목)',
        dayOfWeek: 'Day 4 · 목요일',
        theme: '하카타 한큐 백화점 식품관 & 후쿠오카 공항 15분 출국',
        routeSummary: '하카타 호텔 → 백화점 디저트/기념품 쇼핑 → 후쿠오카 공항(택시 15분) → 인천',
        totalDriveMinutes: 15,
        items: [
          {
            time: '09:30 ~ 12:30',
            title: '하카타 한큐 백화점 & 아뮤플라자 브런치',
            place: 'JR 하카타 시티',
            desc: '백화점 유모차 대여 및 유아 휴게실을 이용하며 어른 선물과 아기 간식 쇼핑.',
            babyTip: '일본 백화점 유아휴게실(베이비살롱)은 이유식 먹이는 전용 의자와 키즈 공간이 호텔급입니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
          {
            time: '13:00 ~ 16:30',
            title: '택시로 15분 만에 후쿠오카 공항 도착 & 여유로운 귀국',
            place: '후쿠오카 국제선 터미널',
            desc: '하카타역에서 택시 요금 약 2,000엔(15분)이면 국제선 청사 바로 앞에 도착! 쾌적하게 출국.',
            babyTip: '후쿠오카 공항 출국장 안쪽에도 깨끗한 수유실과 뜨거운 물 조유기가 마련되어 있습니다.',
            strollerFriendly: '최상 (평지/엘리베이터)',
          },
        ],
      },
    ],
  },
  {
    id: 'yufuin-fukuoka',
    rank: 3,
    badge: '추천 3순위 · 유후인 감성 독채 2박 + 후쿠오카 쇼핑 1박',
    name: '유후인 집중 & 후쿠오카 (오이타·후쿠오카)',
    subtitle: '유후인 별채 료칸 2박으로 이동 최소화 + 마지막 날 후쿠오카 시내 쇼핑',
    airport: '후쿠오카공항(FUK)',
    waterType: '단순온천 (무색투명·무취·저자극 온천수)',
    waterTemp: '원천 60°C → 객실 노천탕 38°C 조절',
    babySkinSafeScore: 97,
    mobilityScore: 91,
    threeAdultsRoomScore: 94,
    overallScore: 92,
    summary:
      '일본 온천 마을의 대명사인 유후인에서 2박을 머물며 아기와 느긋하게 산책·온천을 즐기고, 3일차 오후에 후쿠오카 시내로 돌아와 백화점·쇼핑몰을 즐기는 클래식 감성 코스입니다.',
    whyBestFor13Month: [
      '유후인 온천수는 무색무취 단순천이라 생후 13개월 아기 눈이나 입에 살짝 닿아도 자극이 가장 적음',
      '별채형(하나레) 료칸이 발달해 성인 3명과 아기가 집처럼 넓게 쓰기 좋음',
      '마지막 날 후쿠오카 시내 숙박으로 아카짱혼포·백화점 쇼핑과 짧은 공항 이동을 동시에 해결',
    ],
    routeNodes: [
      {
        step: 1,
        place: '후쿠오카공항',
        stayOrStop: '미니밴 렌터카 또는 단독 밴 탑승',
        durationToNext: '1시간 35분',
        modeToNext: '고속도로',
      },
      {
        step: 2,
        place: '유후인 온천 마을 (2박 연박)',
        stayOrStop: '독채 노천탕 료칸 & 긴린코 호수·플로랄 빌리지',
        durationToNext: '1시간 30분',
        modeToNext: '고속도로',
      },
      {
        step: 3,
        place: '후쿠오카 라라포트 & 하카타 (1박)',
        stayOrStop: '아카짱혼포 쇼핑 & 일루미네이션',
        durationToNext: '15분',
        modeToNext: '공항 택시',
      },
      {
        step: 4,
        place: '후쿠오카 공항 귀국',
        stayOrStop: '인천 도착',
      },
    ],
    ryokans: [
      {
        id: 'sansuikan',
        name: '유후인 산스이칸 (Yufuin Sansuikan)',
        jpName: 'ゆふいん山水館',
        enSearchQuery: 'Yufuin Sansuikan',
        area: '유후인역 도보 8분 평지',
        tag: '유후다케 전망 화양실 & 올인클루시브 음료 라운지',
        roomType: '유후다케 뷰 화양실 (트윈베드 2 + 다다미 8조)',
        bathType: '전세 가족탕 + 유후다케 뷰 대욕장',
        mealType: '오이타 로컬 뷔페 (아기 죽·우동·과일·디저트 풍성, 주류/음료 무제한 포함)',
        babyPerks: [
          '1층 라운지에서 우유·주스·맥주가 무제한 무료 제공되어 어른 3명과 아기 모두 만족',
          '평지에 위치해 유모차를 끌고 유후인역과 마트(맥스밸류)까지 산책하기 가장 편함',
        ],
        babyFeeNote: '만 1세 유아 소이네 무료 (시설사용료 약 1,650엔 현장 지불)',
        otaBreakfastKRW: 340000,
        otaBreakfastJPY: 36500,
        otaHalfBoardKRW: 480000,
        otaHalfBoardJPY: 51600,
        pricePerNightKRW: 640000,
        pricePerNightJPY: 68800,
        bestPlatform: '아고다 · 트립닷컴 · 자란넷',
        rating: 4.75,
        highlight: '접근성 최고! 유후인 중심 평지에 위치한 가족 친화형 온천 호텔',
      },
      {
        id: 'fukuoka-oriental',
        name: '오리엔탈 호텔 후쿠오카 하카타 스테이션',
        jpName: 'オリエンタルホテル福岡 博多ステーション',
        enSearchQuery: 'Oriental Hotel Fukuoka Hakata Station',
        area: '하카타역 치쿠시구치 바로 앞 (엘리베이터 직결)',
        tag: '아고다 성인3인 20만 원대 · 공항 10분',
        roomType: '이그제큐티브 트리플 또는 디럭스 트윈+데이베드 (성인 3인 정원 + 침대가드)',
        bathType: '전 객실 욕조 및 건습식 분리 욕실',
        mealType: '큐슈 명물 조식 뷔페 (갓 구운 크루아상·미니 버거·과일·요거트)',
        babyPerks: [
          '침대 가드, 아기 욕조, 기저귀 쓰레기통 사전 요청 시 무료 세팅',
          '아고다/트립닷컴에서 성인 3인 1박 24~29만 원대에 예약 가능해 전체 여행 예산을 확 낮춰줌!',
        ],
        babyFeeNote: '초등학생 미만 동반 투숙(소이네) 완전 무료!',
        otaBreakfastKRW: 250000,
        otaBreakfastJPY: 26800,
        otaHalfBoardKRW: 290000,
        otaHalfBoardJPY: 31200,
        pricePerNightKRW: 360000,
        pricePerNightJPY: 38500,
        bestPlatform: '아고다 · 트립닷컴',
        rating: 4.8,
        highlight: '마지막 밤 쇼핑과 귀국 동선을 완벽하게 마무리해 주는 하카타역 1분 호텔',
      },
    ],
    days: [
      {
        day: 1,
        date: '12월 21일 (월)',
        dayOfWeek: 'Day 1 · 월요일',
        theme: '후쿠오카 입국 → 유후인 이동 & 별채 노천탕 체크인',
        routeSummary: '인천 → 후쿠오카공항 → 유후인 온천 마을 체크인',
        totalDriveMinutes: 95,
        items: [
          {
            time: '11:00 ~ 14:30',
            title: '후쿠오카 입국 & 유후인 이동 (휴게소 점심)',
            place: '후쿠오카공항 → 유후인',
            desc: '미니밴 픽업 후 야마다 휴게소에서 점심 식사 및 아기 수유 후 유후인 도착.',
            strollerFriendly: '최상 (평지/엘리베이터)',
            babyTip: '유후인 맥스밸류 마트에 들러 2박 동안 마실 아기 물과 과일을 먼저 사서 들어가세요.',
          },
          {
            time: '15:00 ~ 20:00',
            title: '유후인 료칸 체크인 & 가족 온천욕',
            place: '유후인 료칸',
            desc: '유후다케 산을 바라보는 노천탕에서 온천욕 후 저녁 만찬.',
            strollerFriendly: '최상 (평지/엘리베이터)',
            babyTip: '온천 후 아기 체온이 떨어지지 않도록 큰 바스타월을 미리 데워두세요.',
          },
        ],
      },
      {
        day: 2,
        date: '12월 22일 (화)',
        dayOfWeek: 'Day 2 · 화요일',
        theme: '유후인 긴린코 호수 & 플로랄 빌리지 감성 산책 데이',
        routeSummary: '긴린코 호수 → 카페 라루체(유모차 환영 카페) → 유노츠보 거리 → 료칸 휴식',
        totalDriveMinutes: 15,
        items: [
          {
            time: '10:00 ~ 13:00',
            title: '긴린코 호수 산책 & 호숫가 브런치 카페',
            place: '긴린코 호수 & 카페 라루체',
            desc: '평탄한 호숫가 산책로를 따라 물안개 구경 후, 야외 테라스가 넓은 카페에서 여유로운 티타임.',
            strollerFriendly: '최상 (평지/엘리베이터)',
            babyTip: '오전 10시 전후가 단체 관광객이 오기 전이라 유모차 끌기에 가장 한산합니다.',
          },
          {
            time: '14:00 ~ 18:00',
            title: '료칸 오후 낮잠 & 어른 교대 유노츠보 소품샵 투어',
            place: '유노츠보 거리 & 료칸',
            desc: '아기 낮잠 시간 동안 어른 2명이 지브리샵·스누피차야·미피샵을 구경하고 맛있는 간식을 포장해 복귀.',
            strollerFriendly: '최상 (평지/엘리베이터)',
            babyTip: '연박이라 낮 시간에 언제든 방으로 돌아와 아기를 눕힐 수 있어 정말 편합니다.',
          },
        ],
      },
      {
        day: 3,
        date: '12월 23일 (수)',
        dayOfWeek: 'Day 3 · 수요일',
        theme: '후쿠오카 복귀 & 라라포트 아카짱혼포 쇼핑 + 하카타 숙박',
        routeSummary: '유후인 체크아웃 → 라라포트 후쿠오카 → 하카타 시내 호텔 체크인',
        totalDriveMinutes: 95,
        items: [
          {
            time: '11:30 ~ 15:30',
            title: '라라포트 후쿠오카 (아카짱혼포 & 점심)',
            place: '라라포트 후쿠오카',
            desc: '후쿠오카로 돌아와 아카짱혼포에서 아기용품 쇼핑 및 키즈 다이닝 푸드코트 점심.',
            strollerFriendly: '최상 (평지/엘리베이터)',
            babyTip: '라라포트 유모차 대여소에서 캐릭터 카트형 유모차를 빌리면 아기가 아주 좋아합니다.',
          },
          {
            time: '16:30 ~ 20:30',
            title: '하카타 호텔 체크인 & 크리스마스 마켓',
            place: '하카타역 광장',
            desc: '렌터카 반납 후 하카타역 바로 앞 호텔 체크인. 역 광장 일루미네이션 감상 및 저녁 식사.',
            strollerFriendly: '최상 (평지/엘리베이터)',
            babyTip: '백화점 지하 식품관(데파치카)에서 사온 딸기와 도시락을 호텔 방에서 먹어도 훌륭합니다.',
          },
        ],
      },
      {
        day: 4,
        date: '12월 24일 (목)',
        dayOfWeek: 'Day 4 · 목요일',
        theme: '여유로운 호텔 조식 후 15분 만에 공항 이동 & 귀국',
        routeSummary: '하카타 호텔 → 후쿠오카 국제선 터미널 → 인천공항',
        totalDriveMinutes: 15,
        items: [
          {
            time: '09:00 ~ 14:00',
            title: '호텔 조식 & 공항 택시 이동 후 귀국',
            place: '하카타 → 후쿠오카공항',
            desc: '아침에 급하게 서두를 필요 없이 택시로 15분 만에 공항 도착 후 쾌적하게 출국.',
            strollerFriendly: '최상 (평지/엘리베이터)',
            babyTip: '공항 보안검색대 통과 후 탑승구 앞까지 휴대용 유모차를 끌고 가서 도어사이드 위탁하세요.',
          },
        ],
      },
    ],
  },
]

export interface ChecklistItem {
  id: string
  category: '검역·이유식 필수주의' | '13개월 온천 입욕 안전수칙' | '기내·이동 준비물' | '서류·상비약'
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
      '일본 동물검역소 규정상 레토르트 멸균 파우치라도 육류(소·돼지·닭·육수 포함)가 들어간 이유식·아기과자(소고기 퍼프 등)는 반입 불가 및 압수 대상입니다. 한국에서는 흰살생선·연어·야채·전복·두부·단호박 베이스 이유식과 김·멸치자반만 챙기고, 소/닭고기 메뉴는 현지 마트·아카짱혼포에서 와코도(Wakodo)/피죤 12개월+ 도시락을 구매하세요.',
    critical: true,
  },
  {
    id: 'onsen-temp',
    category: '13개월 온천 입욕 안전수칙',
    title: '온천수 온도는 38~39°C 미지근하게, 입욕 시간은 1회 5~8분 이내',
    detail:
      '13개월 아기는 체온 조절 능력이 미숙하므로 객실 노천탕이나 가족탕에 찬물(가수)을 미리 틀어 38.5°C 정도로 식힌 뒤 발부터 천천히 담가주세요. 유황/강산성 온천 대신 단순천(유후인/벳푸)이나 탄산수소염천(우레시노)이 아기 피부에 안전합니다.',
    critical: true,
  },
  {
    id: 'onsen-hydration',
    category: '13개월 온천 입욕 안전수칙',
    title: '온천 직후 아기 보리차 수분 보충 & 고보습 로션 즉시 도포',
    detail:
      '온천욕 직후 3분 이내에 평소 쓰던 고보습 크림을 듬뿍 발라주고 빨대컵으로 미지근한 물/보리차를 충분히 마시게 해주세요. 방수 기저귀(스윔팬츠)와 아기용 목욕 타월 2장을 넉넉히 준비하면 좋습니다.',
  },
  {
    id: 'passport-docs',
    category: '서류·상비약',
    title: '아기 여권 + 영문 가족관계증명서 + 비짓재팬웹(동반가족 등록)',
    detail:
      '13개월 아기도 본인 여권이 필수이며, 항공사 유아 나이 확인 및 입국 대비 영문 가족관계증명서 1부를 챙기세요. 비짓재팬웹(Visit Japan Web)은 대표자 계정에 동반가족으로 아기를 추가하면 QR코드 하나로 함께 통과됩니다.',
  },
  {
    id: 'medicine-kit',
    category: '서류·상비약',
    title: '교차복용 해열제 2종(아세트아미노펜·이부프로펜) + 체온계 + 정장제 + 비판텐',
    detail:
      '12월 겨울 여행이므로 아기 상비약(해열제 시럽 2종, 콧물약, 유산균/지사제, 밴드, 콧물흡입기, 귀체온계)을 지퍼백에 담아 기내 수하물로 휴대하세요.',
    critical: true,
  },
  {
    id: 'flight-stroller',
    category: '기내·이동 준비물',
    title: '기내 반입/도어사이드 위탁 휴대용 유모차 + 아기띠 + 이착륙 쪽쪽이/간식',
    detail:
      '유모차는 공항 게이트 앞까지 끌고 가고(Door-to-Door 태그 부착), 기내 탑승 및 료칸 정원 이동을 위해 가벼운 아기띠/힙시트를 함께 챙기면 어른 3명이 번갈아 안아주기에 최고입니다.',
  },
]

export interface DynamicRouteWaypoint {
  step: number
  title: string
  place: string
  action: string
  duration: string
  highwayOrLine: string
  babyPoint: string
  adultPoint: string
  luggageStatus: string
}

export interface DynamicTransportRoute {
  transportId: string
  transportName: string
  modeBadge: string
  routeTheme: string
  totalMinutesOneWay: number
  tollOrFareNote: string
  scenicHighlight: string
  babyComfortScore: number
  waypoints: DynamicRouteWaypoint[]
}

export const DYNAMIC_ROUTES: Record<string, DynamicTransportRoute> = {
  // ==========================================
  // BEPPU & YUFUIN
  // ==========================================
  'beppu-yufuin:minivan-rental': {
    transportId: 'minivan-rental',
    transportName: '8인승 프리미엄 미니밴 렌터카 (토요타 노아/알파드)',
    modeBadge: '🚗 고속도로 IC 직결 & 산간 파노라마 드라이브',
    routeTheme: '오이타 고속도로(ETC) ➔ 벳푸완 SA(수유실) ➔ 유후다케 하이웨이 직결 코스',
    totalMinutesOneWay: 95,
    tollOrFareNote: '고속도로 톨게이트 왕복 약 ¥6,400 (ETC 카드 자동 정산)',
    scenicHighlight: '유후다케 산간 설경과 벳푸만을 내려다보는 벳푸완 SA 전망대',
    babyComfortScore: 99,
    waypoints: [
      {
        step: 1,
        title: '공항 렌터카 픽업 & 카시트 장착',
        place: '후쿠오카/오이타 공항 렌터카 카운터',
        action: '공항 셔틀 3분 이동 ➔ ISOFIX 유아 카시트 1석 장착 ➔ 28인치 캐리어 3개 + 유모차 트렁크 적재',
        duration: '약 25분 소요 (인수 절차)',
        highwayOrLine: '공항 전용 픽업 존',
        babyPoint: '렌터카 데스크 바로 옆 수유실에서 출발 전 기저귀 교환 및 보리차 섭취',
        adultPoint: '성인 3명 중 운전자 면허 등록 및 일본 우핸들/내비게이션 조작 숙지',
        luggageStatus: '3열 폴딩 상태로 캐리어 3개 + 유모차 넉넉히 수납 (성인 3인 2열 분산 착석)',
      },
      {
        step: 2,
        title: '오이타 자동차도 고속도로 직결 주행',
        place: '다자이후 IC ➔ 유후인 IC (오이타 자동차도)',
        action: 'ETC 톨게이트 논스톱 통과 ➔ 고속도로 크루즈 주행 (규정속도 80~100km/h)',
        duration: '약 55분 소요',
        highwayOrLine: '오이타 자동차도 (大分自動車道)',
        babyPoint: '차량의 부드러운 진동으로 아기 오전 낮잠 유도 (암막 블라인드 전개)',
        adultPoint: '조수석 성인은 음악/내비 안내, 2열 성인은 아기 수면 상태 모니터링',
        luggageStatus: '트렁크 안전 고정망 체결로 주행 중 짐 쏠림 방지',
      },
      {
        step: 3,
        title: '고속도로 SA 휴게소 경유 & 수유 타임',
        place: '야마다 SA 또는 벳푸완 SA (Beppuwan SA)',
        action: '오션뷰 전망 휴게소 정차 ➔ 온수기 분유 수유 & 기저귀 교환 ➔ 따뜻한 우동/커피 테이크아웃',
        duration: '약 25분 휴식',
        highwayOrLine: 'SA 하이웨이 오아시스',
        babyPoint: '베이비룸 내 급탕기(70°C 온수), 개별 기저귀 교환대, 전자레인지 완비',
        adultPoint: '성인 3명 교대로 스트레칭 및 벳푸만 오션뷰 파노라마 감상',
        luggageStatus: '차량 잠금 후 가벼운 기저귀 가방만 휴대',
      },
      {
        step: 4,
        title: '야마나미 하이웨이 & 유후인 마을 진입',
        place: '유후다케 기슭 ➔ 긴린코 호수 공영 주차장',
        action: '완만한 산간 드라이브 ➔ 호수 바로 앞 평지 유료 주차장 주차 ➔ 유모차 전개',
        duration: '약 25분 소요',
        highwayOrLine: '현도 11호선 (야마나미 하이웨이)',
        babyPoint: '차내에서 따뜻한 아기 겉옷 착용 후 디럭스 유모차로 안락한 평지 산책 시작',
        adultPoint: '성인 3명이 번갈아 유모차를 밀며 유노츠보 거리 간식 쇼핑',
        luggageStatus: '호수 산책 중 캐리어 3개는 차량 트렁크에 안전하게 보관',
      },
      {
        step: 5,
        title: '벳푸 해안도로 ➔ 료칸 전용 주차장 도착',
        place: '국도 10호선 ➔ 아마네 리조트 세이카이 / 스기노이',
        action: '바다 전망 해안도로 주행 ➔ 료칸 전용 주차장 도착 (무단차 카트 체크인)',
        duration: '약 35분 소요',
        highwayOrLine: '국도 10호선 쇼닝가하마 해변로',
        babyPoint: '주차장에서 로비까지 단차가 전혀 없어 잠든 아기를 깨우지 않고 이동 가능',
        adultPoint: '발렛/지상 주차 완료 후 가이세키 석식 시간 확정 및 가족탕 예약',
        luggageStatus: '직원이 카트로 객실 화양실까지 캐리어 3개 및 짐 전체 원스톱 운반',
      },
    ],
  },
  'beppu-yufuin:private-jumbo-taxi': {
    transportId: 'private-jumbo-taxi',
    transportName: '프라이빗 점보택시 / 전용 밴 투어 (토요타 알파드/하이에이스)',
    modeBadge: '🚐 공항 입국장 미팅 & 료칸 현관 도어투도어(Door-to-Door) 직결',
    routeTheme: '운전 피로 제로! 입국장에서 료칸 로비 현관까지 비 한 방울 안 맞고 직행하는 럭셔리 송영',
    totalMinutesOneWay: 85,
    tollOrFareNote: '전용 기사님 인건비, 유류비, 고속도로 통행료 전체 포함',
    scenicHighlight: '성인 3명 모두 운전 부담 없이 차내에서 시원한 삿포로 맥주와 간식 즐기기',
    babyComfortScore: 98,
    waypoints: [
      {
        step: 1,
        title: '공항 국제선 입국장 네임피켓 미팅',
        place: '후쿠오카/오이타 공항 도착 로비 게이트',
        action: '기사님이 성함 피켓 들고 미팅 ➔ 캐리어 3개와 유모차를 기사님이 직접 수납',
        duration: '약 10분 소요 (대기 제로)',
        highwayOrLine: '공항 귀빈/전용차량 승차장',
        babyPoint: '공항 밖으로 나가지 않고 게이트 바로 앞 대기 차량으로 직행하여 겨울 찬바람 차단',
        adultPoint: '렌터카 서류 작성이나 길 찾기 스트레스 없이 곧바로 탑승',
        luggageStatus: '대형 밴 트렁크에 캐리어 3개 + 유모차를 기사님이 안전하게 테트리스 적재',
      },
      {
        step: 2,
        title: '고속도로 논스톱 리무진 드라이브',
        place: '도시고속도로 ➔ 오이타 자동차도 직행',
        action: '전용 기사님의 숙련된 안전 운행 ➔ 13개월 아기 수면을 배려한 부드러운 코너링',
        duration: '약 60분 논스톱 주행',
        highwayOrLine: '오이타 고속도로',
        babyPoint: '사전 요청된 고급 유아 카시트 장착 상태로 쾌적하게 차내 숙면',
        adultPoint: '성인 3명 전원 스마트폰을 보거나 차내에서 여유롭게 대화',
        luggageStatus: '트렁크 격벽 분리로 실내 소음 최소화',
      },
      {
        step: 3,
        title: '유후인 관광 스팟 정문 하차 & 픽업 대기',
        place: '긴린코 호수 입구 & 유노츠보 거리 앞',
        action: '관광 스팟 입구에 가족을 내려드리고, 기사님은 인근 전용 대기장에서 대기',
        duration: '약 1시간 30분 자유 관광',
        highwayOrLine: '유후인 중심가 전용 승하차 존',
        babyPoint: '주차장 찾느라 헤매지 않고 목적지 바로 앞에 내려 유모차로 즉시 산책 시작',
        adultPoint: '주차 요금 정산이나 주차권 챙길 필요 없이 카카오톡/전화로 기사님 호출',
        luggageStatus: '무거운 캐리어는 차량에 그대로 두고 가벼운 가방만 들고 관광',
      },
      {
        step: 4,
        title: '벳푸 료칸 로비 현관 정문 도어투도어 도착',
        place: '아마네 리조트 세이카이 / 스기노이 호텔 현관',
        action: '료칸 정문 처마 밑에 정차 ➔ 기사님이 짐 하차 ➔ 호텔 지배인이 영접',
        duration: '약 30분 소요',
        highwayOrLine: '벳푸 온천가 직결 도로',
        babyPoint: '차량에서 내리자마자 바로 실내 로비로 진입하여 아기 감기 완벽 예방',
        adultPoint: '어른 3명 모두 피로도 0% 상태로 체크인 및 온천 직행 가능',
        luggageStatus: '기사님과 료칸 직원이 객실 다다미방까지 모든 캐리어를 운반',
      },
    ],
  },
  'beppu-yufuin:express-train-bus': {
    transportId: 'express-train-bus',
    transportName: 'JR 특급열차 (소닉/유후인노모리) + 현지 점보택시 조합',
    modeBadge: '🚆 일본 특급열차 낭만 & 역 앞 점보택시 직결',
    routeTheme: '하카타역 에키벤 도시락 감성 ➔ JR 특급열차 살롱카 수유 ➔ 벳푸역 앞 점보택시',
    totalMinutesOneWay: 110,
    tollOrFareNote: 'JR 특급 열차 지정석 성인 3인 + 벳푸/유후인 현지 점보택시(약 ¥2,500/회)',
    scenicHighlight: '규슈 전원 풍경과 숲속을 달리는 클래식 목조 관광열차 유후인노모리 차창 뷰',
    babyComfortScore: 78,
    waypoints: [
      {
        step: 1,
        title: '공항 ➔ 하카타역 지하철 이동 (5분)',
        place: '후쿠오카공항역 ➔ 하카타역 (지하철 공항선)',
        action: '공항 국내선 터미널 직결 지하철 탑승 (단 2정거장, 5분)',
        duration: '지하철 5분 소요',
        highwayOrLine: '후쿠오카 시영 지하철 공항선',
        babyPoint: '후쿠오카 공항의 독보적 장점인 초단거리 도심 직결로 대중교통 피로 최소화',
        adultPoint: '성인 1명이 유모차 담당, 성인 2명이 28인치 캐리어 각자 운반',
        luggageStatus: '지하철 내 휠체어/유모차 전용 공간에 캐리어와 유모차 일렬 거치',
      },
      {
        step: 2,
        title: '하카타역 에키벤 구매 & JR 특급열차 승차',
        place: 'JR 하카타역 2번/3번 승강장',
        action: '규슈 명물 흑돼지/소고기 도시락 구매 ➔ JR 특급 [소닉 883계] 또는 [유후인노모리] 탑승',
        duration: '약 20분 환승 시간',
        highwayOrLine: 'JR 가고시마 본선 / 닛포 본선',
        babyPoint: '특급열차 4호차 다목적실(기저귀 교환대/유아 케어룸) 위치 사전 확인',
        adultPoint: '지정석 3석 나란히 앉아 차창 밖 낭만을 즐기며 도시락 식사',
        luggageStatus: '객실 뒤편 대형 수하물 보관석(사전 지정석 예약)에 캐리어 3개 보관',
      },
      {
        step: 3,
        title: '특급열차 차창 뷰 감상 & 차내 수유',
        place: '기타큐슈 ➔ 벳푸완 바닷길 구간',
        action: '푸른 바다가 보이는 철길 주행 ➔ 아기 보챌 때 살롱 라운지 칸으로 아기띠 이동',
        duration: '약 1시간 40분 열차 여행',
        highwayOrLine: 'JR 닛포 본선 (바다 인접 철도)',
        babyPoint: '열차 내 넓은 통로와 라운지칸이 있어 아기를 안고 서서 달래주기 매우 편리',
        adultPoint: '운전대를 잡지 않아 성인 3명 모두 함께 기차 맥주와 담소 만끽',
        luggageStatus: '보관석에 고정 체결되어 있어 이동 중 신경 쓸 필요 없음',
      },
      {
        step: 4,
        title: '벳푸역 도착 & 역 광장 점보택시 환승',
        place: 'JR 벳푸역 동쪽 출구 택시 승강장',
        action: '개찰구 엘리베이터 이동 ➔ 6인승 점보택시 탑승 ➔ 료칸으로 이동',
        duration: '약 10분 택시 이동',
        highwayOrLine: '역전 온천가 중심 도로',
        babyPoint: '기차역에서 료칸까지 짧은 10분 택시 구간으로 아기 피로 완벽 차단',
        adultPoint: '벳푸역 온천 손물(테유) 스팟에서 아기와 따뜻한 온천수 손 담그기 체험',
        luggageStatus: '점보택시 대형 트렁크에 캐리어 3개 + 유모차 한 번에 싣고 료칸 현관 도착',
      },
    ],
  },

  // ==========================================
  // URESHINO & TAKEO
  // ==========================================
  'ureshino-takeo:minivan-rental': {
    transportId: 'minivan-rental',
    transportName: '8인승 프리미엄 미니밴 렌터카 (토요타 노아/알파드)',
    modeBadge: '🚗 나가사키 자동차도 최단 IC 직결 & 평지 드라이브',
    routeTheme: '후쿠오카/사가공항 ➔ 우레시노 IC (최단 50~70분) ➔ 다케오 도서관 평지 주차장',
    totalMinutesOneWay: 65,
    tollOrFareNote: '고속도로 왕복 약 ¥4,200 (ETC 카드 정산)',
    scenicHighlight: '우레시노 녹차밭 언덕 파노라마와 다케오 녹나무 평지 숲길 드라이브',
    babyComfortScore: 99,
    waypoints: [
      {
        step: 1,
        title: '공항 렌터카 수령 & 카시트 장착',
        place: '후쿠오카공항 또는 사가공항 렌터카 데스크',
        action: '미니밴 수령 ➔ 유아 카시트 장착 ➔ 짐 적재 (사가공항 이용 시 단 10분 만에 출발)',
        duration: '약 20분 소요',
        highwayOrLine: '공항 렌터카 전용 구역',
        babyPoint: '규슈 내 최단 이동 거리 지역으로 카시트 탑승 시간 스트레스가 가장 적음',
        adultPoint: '우레시노까지 거의 전 구간 직선 고속도로라 일본 첫 운전자에게도 난이도 최하',
        luggageStatus: '3열 접고 캐리어 3개 + 유모차 여유롭게 평평하게 적재',
      },
      {
        step: 2,
        title: '나가사키 자동차도 직통 주행',
        place: '다자이후 IC ➔ 우레시노 IC',
        action: '산악 굽잇길 없는 완만한 평지 고속도로 ➔ 키야마 PA 휴게소 수유실 경유',
        duration: '약 45분 소요',
        highwayOrLine: '나가사키 자동차도 (長崎自動車道)',
        babyPoint: '급커브나 험로가 전혀 없어 아기 멀미 걱정 0%',
        adultPoint: '피로감 없는 45분 짧은 고속도로 드라이브',
        luggageStatus: '트렁크 안전 적재 유지',
      },
      {
        step: 3,
        title: '우레시노 온천마을 료칸 주차 & 온천두부 거리',
        place: '와라쿠엔 / 시바야 료칸 전용 주차장',
        action: '료칸 무료 주차 ➔ 유모차 전개 ➔ 우레시노 강변 무단차 산책로 산책',
        duration: '약 10분 이동',
        highwayOrLine: '우레시노 온천 중심로',
        babyPoint: '온천 마을 전체가 완전 평지 데크길이라 디럭스 유모차 밀기 최고',
        adultPoint: '부드러운 온천수 족욕탕(아시유)에서 어른 3명 교대 발 담그기',
        luggageStatus: '료칸 로비에 캐리어 3개 보관 후 가볍게 산책',
      },
    ],
  },
  'ureshino-takeo:private-jumbo-taxi': {
    transportId: 'private-jumbo-taxi',
    transportName: '프라이빗 점보택시 / 전용 밴 투어',
    modeBadge: '🚐 최단 이동시간 55분 도어투도어 리무진',
    routeTheme: '공항 게이트 ➔ 우레시노 료칸 정문 논스톱 55분 주파 (13개월 아기 이동 피로 제로)',
    totalMinutesOneWay: 55,
    tollOrFareNote: '전용 기사님 + 톨게이트 + 유류비 일체 포함',
    scenicHighlight: '차창 밖 사가 평야와 녹차 밭 풍경',
    babyComfortScore: 99,
    waypoints: [
      {
        step: 1,
        title: '공항 게이트 기사님 미팅',
        place: '공항 출구 전용 밴 탑승 구역',
        action: '기사님이 짐 싣고 즉시 출발 ➔ 우레시노 료칸으로 논스톱 직행',
        duration: '약 5분 탑승',
        highwayOrLine: '전용 승차장',
        babyPoint: '겨울 추위 노출 시간 1분 이내로 아기 컨디션 최상 유지',
        adultPoint: '출국 수속 끝나자마자 편안한 가죽 시트에 기대어 휴식',
        luggageStatus: '트렁크에 모든 짐 안전 수납',
      },
      {
        step: 2,
        title: '우레시노 료칸 현관 정문 직결 하차',
        place: '와라쿠엔 / 시바야 료칸 현관',
        action: '55분 만에 료칸 현관 정문 도착 ➔ 무단차 체크인',
        duration: '약 55분 소요',
        highwayOrLine: '고속도로 직행',
        babyPoint: '비행기 내린 뒤 1시간 만에 다다미방에 아기를 눕힐 수 있는 유일한 코스',
        adultPoint: '오후 2시 체크인 직후 바로 약알칼리 미인온천 가족탕 입욕',
        luggageStatus: '기사님과 직원이 객실로 짐 운반',
      },
    ],
  },
  'ureshino-takeo:express-train-bus': {
    transportId: 'express-train-bus',
    transportName: '서규슈 신칸센 + 릴레이 카모메 특급',
    modeBadge: '🚆 최신형 서규슈 신칸센 카모메 탑승 체험',
    routeTheme: '하카타역 릴레이 특급 ➔ 다케오온센역 신칸센 환승 ➔ 우레시노온센역 택시 5분',
    totalMinutesOneWay: 80,
    tollOrFareNote: 'JR 특급+신칸센 지정석 성인 3인 + 우레시노 현지 택시',
    scenicHighlight: '2022년 개통된 최신형 서규슈 신칸센 카모메의 모던한 원목 인테리어',
    babyComfortScore: 82,
    waypoints: [
      {
        step: 1,
        title: '하카타역 릴레이 카모메 특급 탑승',
        place: 'JR 하카타역 ➔ 다케오온센역',
        action: '특급열차 탑승 (50분 소요)',
        duration: '약 50분 소요',
        highwayOrLine: 'JR 나가사키 본선',
        babyPoint: '좌석 앞 공간이 넓어 유모차 거치 용이',
        adultPoint: '하카타역 도시락과 사가 명물 간식 시식',
        luggageStatus: '열차 내 수하물 선반 거치',
      },
      {
        step: 2,
        title: '다케오온센역 대면 환승 ➔ 신칸센 카모메',
        place: '다케오온센역 플랫폼 ➔ 우레시노온센역',
        action: '같은 승강장 바로 맞은편 열차로 걸어서 10초 대면 환승 ➔ 신칸센 5분 탑승',
        duration: '약 5분 탑승 (단 1정거장)',
        highwayOrLine: '서규슈 신칸센 (西九州新幹線)',
        babyPoint: '계단/엘리베이터 이동 없이 같은 플랫폼 맞은편으로 걸어가는 편리한 대면 환승',
        adultPoint: '최신형 신칸센 카모메 원목 시트 및 최첨단 설비 체험',
        luggageStatus: '평지 플랫폼 이동으로 캐리어 이동 수월',
      },
      {
        step: 3,
        title: '우레시노온센역 앞 택시 ➔ 료칸 도착',
        place: '우레시노온센역 앞 택시 승강장 ➔ 료칸',
        action: '역 앞 대기 택시 승차 ➔ 온천가 료칸 5분 만에 도착',
        duration: '택시 5분 (약 ¥1,000)',
        highwayOrLine: '우레시노 시내 도로',
        babyPoint: '역에서 료칸까지 단 5분 거리',
        adultPoint: '료칸 체크인 완료',
        luggageStatus: '택시 트렁크 보관',
      },
    ],
  },

  // ==========================================
  // YUFUIN & FUKUOKA
  // ==========================================
  'yufuin-fukuoka:minivan-rental': {
    transportId: 'minivan-rental',
    transportName: '8인승 프리미엄 미니밴 렌터카 (토요타 노아/알파드)',
    modeBadge: '🚗 유후인 숲길 드라이브 & 후쿠오카 도심 쇼핑 연계',
    routeTheme: '후쿠오카공항 ➔ 유후인 독채 료칸(2박) ➔ 후쿠오카 텐진/캐널시티 호텔(1박)',
    totalMinutesOneWay: 95,
    tollOrFareNote: '고속도로 왕복 약 ¥6,200 (ETC 카드 정산)',
    scenicHighlight: '유후인 전원 풍경과 후쿠오카 도심 나카스 야경 드라이브',
    babyComfortScore: 98,
    waypoints: [
      {
        step: 1,
        title: '공항 렌터카 인수 & 유후인 직행',
        place: '후쿠오카공항 렌터카 카운터 ➔ 오이타 고속도로',
        action: '카시트 장착 후 고속도로 진입 ➔ 야마다 SA 경유 ➔ 유후인 IC 하차',
        duration: '약 1시간 35분 소요',
        highwayOrLine: '오이타 고속도로',
        babyPoint: '중간 SA 수유실 이용 및 낮잠 리듬에 맞춘 편안한 이동',
        adultPoint: '유후인 별채 료칸 정원 내 전용 주차장 무료 주차',
        luggageStatus: '캐리어 3개 + 유모차 트렁크 적재',
      },
      {
        step: 2,
        title: '3일차 후쿠오카 도심 호텔 이동 & 쇼핑',
        place: '유후인 ➔ 텐진/캐널시티 호텔 주차장 ➔ 라라포트',
        action: '도심 호텔 체크인 후 라라포트 아카짱혼포 쇼핑 및 대형마트 장보기',
        duration: '약 1시간 30분 소요',
        highwayOrLine: '후쿠오카 도시고속도로',
        babyPoint: '라라포트 내 대규모 베이비파크, 전자레인지 수유실, 유아 휴게실 완비',
        adultPoint: '어른 3명 도심 쇼핑 및 모츠나베/하카타 라멘 저녁 식사',
        luggageStatus: '호텔 로비 벨데스크에 캐리어 보관 완료',
      },
    ],
  },
  'yufuin-fukuoka:private-jumbo-taxi': {
    transportId: 'private-jumbo-taxi',
    transportName: '프라이빗 점보택시 / 전용 밴 투어',
    modeBadge: '🚐 유후인 독채 료칸 현관 & 도심 호텔 프라이빗 송영',
    routeTheme: '후쿠오카공항 ➔ 유후인 독채 료칸 도어투도어 ➔ 3일차 후쿠오카 호텔 다이렉트 이동',
    totalMinutesOneWay: 90,
    tollOrFareNote: '전용 기사님, 톨비, 유류비 포함',
    scenicHighlight: '차창 밖 전원 뷰를 보며 성인 3명 모두 피로 없이 도심 복귀',
    babyComfortScore: 98,
    waypoints: [
      {
        step: 1,
        title: '공항 미팅 & 유후인 별채 료칸 직행',
        place: '후쿠오카공항 ➔ 유후인 료칸 로비 현관',
        action: '기사님이 짐 싣고 료칸 정문 앞까지 논스톱 도어투도어 이동',
        duration: '약 1시간 30분 직행',
        highwayOrLine: '오이타 자동차도',
        babyPoint: '카시트 안착 후 찬바람 없이 료칸 안방까지 직행',
        adultPoint: '운전 스트레스 제로',
        luggageStatus: '기사님이 전담 적재/운반',
      },
      {
        step: 2,
        title: '유후인 료칸 ➔ 후쿠오카 도심 호텔 픽업 & 이동',
        place: '유후인 체크아웃 ➔ 후쿠오카 시내 호텔 정문',
        action: '오전 10:30 료칸 현관에서 탑승 ➔ 후쿠오카 시내 호텔 로비 하차',
        duration: '약 1시간 30분 이동',
        highwayOrLine: '고속도로 직통',
        babyPoint: '짐 들고 대중교통 탈 필요 없이 차 안에서 아기 분유 수유',
        adultPoint: '호텔 도착 즉시 도심 관광 시작',
        luggageStatus: '호텔 로비 직결 하차',
      },
    ],
  },
  'yufuin-fukuoka:express-train-bus': {
    transportId: 'express-train-bus',
    transportName: 'JR 관광열차 유후인노모리 + 도심 지하철 조합',
    modeBadge: '🚆 명품 관광열차 유후인노모리 풀코스 탑승',
    routeTheme: '하카타역 ➔ 유후인노모리 전구간 승차 ➔ 3일차 하카타역 복귀 후 도심 쇼핑',
    totalMinutesOneWay: 125,
    tollOrFareNote: '유후인노모리 전 좌석 지정석 성인 3석 + 역세권 택시',
    scenicHighlight: '일본 최고 인기 관광열차 유후인노모리의 숲속 레일웨이 뷰와 기념 촬영',
    babyComfortScore: 80,
    waypoints: [
      {
        step: 1,
        title: '하카타역 ➔ 유후인노모리 클래식 열차 승차',
        place: 'JR 하카타역 ➔ JR 유후인역',
        action: '관광열차 탑승 ➔ 차내 기념 포토존 촬영 ➔ 유후인 사이다 시음',
        duration: '약 2시간 10분 소요',
        highwayOrLine: 'JR 규다이 본선',
        babyPoint: '아기 안고 열차 내 포토존에서 승무원 모자 쓰고 가족 기념사진 촬영',
        adultPoint: '유후인노모리 명물 롤케이크와 벤또 도시락 식사',
        luggageStatus: '열차 대형 수하물 보관 공간 이용',
      },
      {
        step: 2,
        title: '유후인역 ➔ 료칸 송영 차량 이동',
        place: 'JR 유후인역 광장 ➔ 료칸',
        action: '료칸 전용 셔틀버스(송영) 탑승 ➔ 5분 만에 료칸 도착',
        duration: '약 5분 셔틀',
        highwayOrLine: '유후인 역전 거리',
        babyPoint: '역세권 셔틀 직결로 이동 간편',
        adultPoint: '체크인 후 온천욕',
        luggageStatus: '셔틀 차량 수납',
      },
    ],
  },
}

export function getDynamicTransportRoute(
  regionId: RegionId,
  transportId: string
): DynamicTransportRoute {
  const key = `${regionId}:${transportId}`
  if (DYNAMIC_ROUTES[key]) return DYNAMIC_ROUTES[key]

  // Fallback to minivan-rental for this region if specific combination is missing
  const fallbackKey = `${regionId}:minivan-rental`
  return DYNAMIC_ROUTES[fallbackKey] || DYNAMIC_ROUTES['beppu-yufuin:minivan-rental']
}


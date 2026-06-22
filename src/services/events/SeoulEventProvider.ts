import { request } from "undici";
import type { AppConfig } from "../../config/env.js";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { formatSeoulIso, toSeoulDateString } from "../../utils/dates.js";
import { withTimeout } from "../../utils/timeout.js";
import { inferEnvironment } from "./environmentInference.js";
import { parsePriceText } from "./priceParser.js";
import type { ActivityCandidate, EventSearchRequest } from "./eventTypes.js";

interface SeoulEventRow {
  readonly CODENAME?: string;
  readonly TITLE?: string;
  readonly DATE?: string;
  readonly PLACE?: string;
  readonly ORG_NAME?: string;
  readonly USE_FEE?: string;
  readonly PLAYER?: string;
  readonly PROGRAM?: string;
  readonly ETC_DESC?: string;
  readonly ORG_LINK?: string;
  readonly MAIN_IMG?: string;
  readonly RGSTDATE?: string;
  readonly TICKET?: string;
  readonly STRTDATE?: string;
  readonly END_DATE?: string;
  readonly THEMECODE?: string;
  readonly LOT?: string;
  readonly LAT?: string;
  readonly IS_FREE?: string;
  readonly HMPG_ADDR?: string;
  readonly GUNAME?: string;
}

function parseIsoDate(value: string | undefined): string | null {
  if (!value) {
    return null;
  }
  const match = value.match(/\d{4}-\d{2}-\d{2}/);
  return match?.[0] ?? null;
}

function parseTime(value: string | undefined, fallback: string | null): string | null {
  if (!value) {
    return fallback;
  }
  const matches = value.match(/(\d{1,2}):(\d{2})/g);
  if (!matches || matches.length === 0) {
    return fallback;
  }
  return fallback === "18:00" ? matches[matches.length - 1] ?? fallback : matches[0] ?? fallback;
}

function mapCategory(code: string | undefined): ActivityCandidate["category"] {
  const text = code ?? "";
  if (/전시|미술/.test(text)) return "exhibition";
  if (/공연|콘서트|연극|음악/.test(text)) return "performance";
  if (/축제|행사/.test(text)) return "festival";
  if (/교육|체험|강좌/.test(text)) return "education";
  return "other";
}

export function parseSeoulEventRows(rows: readonly SeoulEventRow[]): ActivityCandidate[] {
  const fetchedAt = formatSeoulIso(new Date());
  return rows.map((row, index) => {
    const category = mapCategory(row.CODENAME);
    const price = parsePriceText(row.USE_FEE ?? row.IS_FREE ?? null);
    const venue = row.PLACE?.trim() || "장소 확인 필요";
    const startDate = parseIsoDate(row.STRTDATE ?? row.DATE);
    const endDate = parseIsoDate(row.END_DATE ?? row.DATE) ?? startDate;
    const latitude = row.LAT ? Number(row.LAT) : null;
    const longitude = row.LOT ? Number(row.LOT) : null;
    return {
      id: `seoul-event-${startDate ?? "unknown"}-${index}-${row.TITLE ?? "untitled"}`.replace(/\s+/g, "-"),
      title: row.TITLE?.trim() || "제목 확인 필요",
      category,
      venue,
      district: row.GUNAME?.trim() || null,
      address: venue,
      coordinates:
        latitude !== null && longitude !== null && Number.isFinite(latitude) && Number.isFinite(longitude)
          ? { latitude, longitude }
          : null,
      startDate,
      endDate,
      startTime: parseTime(row.DATE, "10:00"),
      endTime: parseTime(row.DATE, "18:00"),
      isFree: price.isFree,
      priceType: price.type,
      priceText: row.USE_FEE?.trim() || null,
      environment: inferEnvironment(category, venue, row.PROGRAM ?? null),
      requiresReservation: /사전|예약|예매/.test(`${row.TICKET ?? ""} ${row.ETC_DESC ?? ""}`),
      source: {
        provider: "Seoul Open Data",
        url: row.ORG_LINK ?? row.HMPG_ADDR ?? null,
        fetchedAt
      }
    };
  });
}

export class SeoulEventProvider {
  constructor(private readonly config: AppConfig) {}

  async searchEvents(searchRequest: EventSearchRequest): Promise<ActivityCandidate[]> {
    if (this.config.MOCK_PROVIDERS || !this.config.SEOUL_OPEN_DATA_API_KEY) {
      return getMockSeoulEvents(searchRequest);
    }
    const baseUrl = this.config.SEOUL_OPEN_DATA_BASE_URL ?? "http://openapi.seoul.go.kr:8088";
    const url = `${baseUrl.replace(/\/$/, "")}/${this.config.SEOUL_OPEN_DATA_API_KEY}/json/culturalEventInfo/1/100`;
    const response = await withTimeout(request(url, { method: "GET" }), 3000, "Seoul event request timed out");
    if (response.statusCode === 401 || response.statusCode === 403) {
      throw new AppError({ code: ERROR_CODES.AUTH_ERROR, provider: "Seoul Open Data", status: response.statusCode });
    }
    if (response.statusCode >= 500) {
      throw new AppError({ code: ERROR_CODES.EVENTS_UNAVAILABLE, provider: "Seoul Open Data", status: response.statusCode, retryable: true });
    }
    const body = (await response.body.json()) as { culturalEventInfo?: { row?: SeoulEventRow[] } };
    return parseSeoulEventRows(body.culturalEventInfo?.row ?? []);
  }
}

export function getMockSeoulEvents(searchRequest: EventSearchRequest): ActivityCandidate[] {
  const start = toSeoulDateString(searchRequest.start);
  const end = toSeoulDateString(searchRequest.end);
  const fetchedAt = formatSeoulIso(new Date());
  return [
    {
      id: "mock-seoul-museum-free",
      title: "서울역사박물관 기획전",
      category: "exhibition",
      venue: "서울역사박물관",
      district: "종로구",
      address: "서울특별시 종로구 새문안로 55",
      coordinates: { latitude: 37.5704, longitude: 126.9707 },
      startDate: start,
      endDate: end,
      startTime: "10:00",
      endTime: "18:00",
      isFree: true,
      priceType: "free",
      priceText: "무료",
      environment: "indoor",
      requiresReservation: false,
      source: { provider: "mock", url: "https://museum.seoul.go.kr", fetchedAt }
    },
    {
      id: "mock-library-program",
      title: "서울도서관 시민 강연",
      category: "library",
      venue: "서울도서관",
      district: "중구",
      address: "서울특별시 중구 세종대로 110",
      coordinates: { latitude: 37.5663, longitude: 126.9779 },
      startDate: start,
      endDate: end,
      startTime: "14:00",
      endTime: "20:00",
      isFree: true,
      priceType: "free",
      priceText: "무료",
      environment: "indoor",
      requiresReservation: false,
      source: { provider: "mock", url: "https://lib.seoul.go.kr", fetchedAt }
    },
    {
      id: "mock-hangang-market",
      title: "한강 야외 마켓",
      category: "market",
      venue: "여의도한강공원",
      district: "영등포구",
      address: "서울특별시 영등포구 여의동로 330",
      coordinates: { latitude: 37.5284, longitude: 126.9327 },
      startDate: start,
      endDate: end,
      startTime: "12:00",
      endTime: "21:00",
      isFree: null,
      priceType: "unknown",
      priceText: "입장료 없음, 일부 체험 유료",
      environment: "outdoor",
      requiresReservation: false,
      source: { provider: "mock", url: "https://hangang.seoul.go.kr", fetchedAt }
    },
    {
      id: "mock-family-museum",
      title: "어린이 과학 체험전",
      category: "education",
      venue: "서울시립과학관",
      district: "노원구",
      address: "서울특별시 노원구 한글비석로 160",
      coordinates: { latitude: 37.642, longitude: 127.0772 },
      startDate: start,
      endDate: end,
      startTime: "09:30",
      endTime: "17:30",
      isFree: false,
      priceType: "paid",
      priceText: "성인 2,000원",
      environment: "indoor",
      requiresReservation: false,
      source: { provider: "mock", url: "https://science.seoul.go.kr", fetchedAt }
    },
    {
      id: "mock-history-museum-free",
      title: "서울역사박물관 상설 전시",
      category: "museum",
      venue: "서울역사박물관",
      district: "종로구",
      address: "서울특별시 종로구 새문안로 55",
      coordinates: { latitude: 37.5701, longitude: 126.9708 },
      startDate: start,
      endDate: end,
      startTime: "09:00",
      endTime: "18:00",
      isFree: true,
      priceType: "free",
      priceText: "무료",
      environment: "indoor",
      requiresReservation: false,
      source: { provider: "mock", url: "https://museum.seoul.go.kr", fetchedAt }
    },
    {
      id: "mock-art-center-free-performance",
      title: "서울문화예술교육센터 공개 공연",
      category: "performance",
      venue: "서울문화예술교육센터",
      district: "용산구",
      address: "서울특별시 용산구 서빙고로 17",
      coordinates: { latitude: 37.5236, longitude: 126.9804 },
      startDate: start,
      endDate: end,
      startTime: "15:00",
      endTime: "21:00",
      isFree: true,
      priceType: "free",
      priceText: "무료",
      environment: "indoor",
      requiresReservation: false,
      source: { provider: "mock", url: "https://culture.seoul.go.kr", fetchedAt }
    },
    {
      id: "mock-forest-library-free",
      title: "서울도서관 열린 자료실",
      category: "library",
      venue: "서울도서관",
      district: "중구",
      address: "서울특별시 중구 세종대로 110",
      coordinates: { latitude: 37.5663, longitude: 126.9779 },
      startDate: start,
      endDate: end,
      startTime: "09:00",
      endTime: "21:00",
      isFree: true,
      priceType: "free",
      priceText: "무료",
      environment: "indoor",
      requiresReservation: false,
      source: { provider: "mock", url: "https://lib.seoul.go.kr", fetchedAt }
    },
    {
      id: "mock-relaxed-outdoor-walk-free",
      title: "[MOCK] Quiet riverside walk",
      category: "park",
      venue: "Mock Relaxed Riverside",
      district: "송파구",
      address: "Mock Seoul outdoor activity",
      coordinates: { latitude: 37.5148, longitude: 127.1042 },
      startDate: start,
      endDate: end,
      startTime: "06:00",
      endTime: "22:00",
      isFree: true,
      priceType: "free",
      priceText: "무료 (목업)",
      environment: "outdoor",
      requiresReservation: false,
      source: { provider: "mock", url: null, fetchedAt }
    },
    {
      id: "mock-crowded-outdoor-market",
      title: "[MOCK] Crowded outdoor market",
      category: "market",
      venue: "Mock Crowded Market",
      district: "중구",
      address: "Mock Seoul outdoor activity",
      coordinates: { latitude: 37.5665, longitude: 126.978 },
      startDate: start,
      endDate: end,
      startTime: "12:00",
      endTime: "22:00",
      isFree: true,
      priceType: "free",
      priceText: "무료 입장 (목업)",
      environment: "outdoor",
      requiresReservation: false,
      source: { provider: "mock", url: null, fetchedAt }
    },
    {
      id: "mock-far-outdoor-tour-paid",
      title: "[MOCK] Far outdoor guided tour",
      category: "festival",
      venue: "Mock Far Outdoor Park",
      district: "강서구",
      address: "Mock Seoul outdoor activity",
      coordinates: { latitude: 37.558, longitude: 126.835 },
      startDate: start,
      endDate: end,
      startTime: "10:00",
      endTime: "19:00",
      isFree: false,
      priceType: "paid",
      priceText: "15,000원 (목업)",
      environment: "outdoor",
      requiresReservation: true,
      source: { provider: "mock", url: null, fetchedAt }
    },
    {
      id: "mock-reservation-indoor-workshop",
      title: "[MOCK] Reservation-required indoor workshop",
      category: "education",
      venue: "Mock Indoor Workshop",
      district: "중구",
      address: "Mock Seoul indoor activity",
      coordinates: { latitude: 37.5658, longitude: 126.9784 },
      startDate: start,
      endDate: end,
      startTime: "10:00",
      endTime: "20:00",
      isFree: true,
      priceType: "free",
      priceText: "무료 (사전 예약, 목업)",
      environment: "indoor",
      requiresReservation: true,
      source: { provider: "mock", url: null, fetchedAt }
    }
  ];
}

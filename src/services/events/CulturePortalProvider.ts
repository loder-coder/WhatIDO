import type { AppConfig } from "../../config/env.js";
import { request } from "undici";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { formatSeoulIso } from "../../utils/dates.js";
import { toSeoulDateString } from "../../utils/dates.js";
import { withTimeout } from "../../utils/timeout.js";
import { inferEnvironment } from "./environmentInference.js";
import { parsePriceText } from "./priceParser.js";
import { filterEventsByLocation } from "./SeoulEventProvider.js";
import type { ActivityCandidate, EventSearchRequest } from "./eventTypes.js";

interface CulturePortalItem {
  readonly title?: string;
  readonly eventNm?: string;
  readonly place?: string;
  readonly placeNm?: string;
  readonly area?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly start_date?: string;
  readonly end_date?: string;
  readonly price?: string;
  readonly charge?: string;
  readonly gpsX?: string;
  readonly gpsY?: string;
  readonly url?: string;
  readonly realmName?: string;
}

interface CulturePortalResponse {
  readonly response?: { readonly body?: { readonly items?: { readonly item?: CulturePortalItem | readonly CulturePortalItem[] } } };
  readonly body?: { readonly items?: { readonly item?: CulturePortalItem | readonly CulturePortalItem[] } };
  readonly items?: readonly CulturePortalItem[];
}

function readCulturePortalItems(body: CulturePortalResponse): readonly CulturePortalItem[] {
  const items = body.response?.body?.items?.item ?? body.body?.items?.item ?? body.items;
  if (items === undefined) {
    throw new AppError({ code: ERROR_CODES.PROVIDER_ERROR, provider: "Culture Portal" });
  }
  return Array.isArray(items) ? items : [items as CulturePortalItem];
}

function parseDate(value: string | undefined): string | null {
  if (!value) return null;
  return value.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
}

function mapCategory(value: string | undefined): ActivityCandidate["category"] {
  const text = value ?? "";
  if (/전시|미술/.test(text)) return "exhibition";
  if (/공연|음악|연극/.test(text)) return "performance";
  if (/축제/.test(text)) return "festival";
  if (/교육|체험/.test(text)) return "education";
  return "other";
}

export function parseCulturePortalItems(items: readonly CulturePortalItem[]): ActivityCandidate[] {
  const fetchedAt = formatSeoulIso(new Date());
  return items.map((item, index) => {
    const title = item.title ?? item.eventNm ?? "제목 확인 필요";
    const venue = item.place ?? item.placeNm ?? "장소 확인 필요";
    const category = mapCategory(item.realmName);
    const price = parsePriceText(item.price ?? item.charge ?? null);
    const longitude = item.gpsX ? Number(item.gpsX) : null;
    const latitude = item.gpsY ? Number(item.gpsY) : null;
    return {
      id: `culture-portal-${index}-${title}`.replace(/\s+/g, "-"),
      title,
      category,
      venue,
      district: item.area ?? null,
      address: venue,
      coordinates:
        latitude !== null && longitude !== null && Number.isFinite(latitude) && Number.isFinite(longitude)
          ? { latitude, longitude }
          : null,
      startDate: parseDate(item.startDate ?? item.start_date),
      endDate: parseDate(item.endDate ?? item.end_date),
      startTime: "10:00",
      endTime: "18:00",
      isFree: price.isFree,
      priceType: price.type,
      priceText: item.price ?? item.charge ?? null,
      environment: inferEnvironment(category, venue, title),
      requiresReservation: /예약|예매/.test(`${item.price ?? ""} ${title}`),
      source: { provider: "Culture Portal", url: item.url ?? null, fetchedAt }
    };
  });
}

export class CulturePortalProvider {
  constructor(private readonly config: AppConfig) {}

  async searchEvents(searchRequest: EventSearchRequest): Promise<ActivityCandidate[]> {
    if (this.config.MOCK_PROVIDERS) {
      return [];
    }
    if (!this.config.CULTURE_PORTAL_SERVICE_KEY) {
      throw new AppError({ code: ERROR_CODES.EVENTS_UNAVAILABLE, provider: "Culture Portal" });
    }
    const baseUrl = this.config.CULTURE_PORTAL_BASE_URL ?? "https://www.culture.go.kr/openapi/rest/publicperformancedisplays/period";
    const url = new URL(baseUrl);
    url.searchParams.set("serviceKey", this.config.CULTURE_PORTAL_SERVICE_KEY);
    url.searchParams.set("from", toSeoulDateString(searchRequest.start).replaceAll("-", ""));
    url.searchParams.set("to", toSeoulDateString(searchRequest.end).replaceAll("-", ""));
    url.searchParams.set("cPage", "1");
    url.searchParams.set("rows", "100");
    url.searchParams.set("sido", "11");

    const response = await withTimeout(
      request(url, { method: "GET", headers: { accept: "application/json" } }),
      3000,
      "Culture Portal request timed out"
    );
    if (response.statusCode === 401 || response.statusCode === 403) {
      throw new AppError({ code: ERROR_CODES.AUTH_ERROR, provider: "Culture Portal", status: response.statusCode });
    }
    if (response.statusCode >= 500) {
      throw new AppError({ code: ERROR_CODES.EVENTS_UNAVAILABLE, provider: "Culture Portal", status: response.statusCode, retryable: true });
    }
    if (response.statusCode >= 400) {
      throw new AppError({ code: ERROR_CODES.EVENTS_UNAVAILABLE, provider: "Culture Portal", status: response.statusCode });
    }
    const items = parseCulturePortalItems(
      readCulturePortalItems((await response.body.json()) as CulturePortalResponse)
    );
    return filterEventsByLocation(items, searchRequest);
  }
}

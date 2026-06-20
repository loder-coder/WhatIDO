import type { AppConfig } from "../../config/env.js";
import { formatSeoulIso } from "../../utils/dates.js";
import { inferEnvironment } from "./environmentInference.js";
import { parsePriceText } from "./priceParser.js";
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

  async searchEvents(_request: EventSearchRequest): Promise<ActivityCandidate[]> {
    if (this.config.MOCK_PROVIDERS || !this.config.CULTURE_PORTAL_SERVICE_KEY) {
      return [];
    }
    // Culture Portal integrations vary by issued endpoint. Keep parsing isolated
    // and return an empty supplemental set until a concrete endpoint is configured.
    return [];
  }
}

import { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

export interface Coordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export const KoreaCoordinateSchema = z.object({
  latitude: z.number().min(33).max(39),
  longitude: z.number().min(124).max(132)
});

export const SEOUL_DISTRICT_CENTERS: Record<string, Coordinates> = {
  강남구: { latitude: 37.5172, longitude: 127.0473 },
  강동구: { latitude: 37.5301, longitude: 127.1238 },
  강북구: { latitude: 37.6396, longitude: 127.0257 },
  강서구: { latitude: 37.5509, longitude: 126.8495 },
  관악구: { latitude: 37.4784, longitude: 126.9516 },
  광진구: { latitude: 37.5385, longitude: 127.0823 },
  구로구: { latitude: 37.4955, longitude: 126.8877 },
  금천구: { latitude: 37.4569, longitude: 126.8958 },
  노원구: { latitude: 37.6542, longitude: 127.0568 },
  도봉구: { latitude: 37.6688, longitude: 127.0471 },
  동대문구: { latitude: 37.5744, longitude: 127.0396 },
  동작구: { latitude: 37.5124, longitude: 126.9393 },
  마포구: { latitude: 37.5663, longitude: 126.9016 },
  서대문구: { latitude: 37.5791, longitude: 126.9368 },
  서초구: { latitude: 37.4837, longitude: 127.0324 },
  성동구: { latitude: 37.5633, longitude: 127.0369 },
  성북구: { latitude: 37.5894, longitude: 127.0167 },
  송파구: { latitude: 37.5145, longitude: 127.1059 },
  양천구: { latitude: 37.5169, longitude: 126.8664 },
  영등포구: { latitude: 37.5264, longitude: 126.8963 },
  용산구: { latitude: 37.5326, longitude: 126.9905 },
  은평구: { latitude: 37.6027, longitude: 126.9291 },
  종로구: { latitude: 37.5735, longitude: 126.9788 },
  중구: { latitude: 37.5636, longitude: 126.9976 },
  중랑구: { latitude: 37.6063, longitude: 127.0925 }
};

const SEOUL_NEIGHBORHOOD_ALIASES: Record<string, string> = {
  강남역: "강남구",
  을지로: "중구",
  홍대: "마포구",
  홍대입구: "마포구",
  여의도: "영등포구",
  잠실: "송파구",
  서울숲: "성동구"
};

function compactLocationName(value: string): string {
  return value.trim().replace(/\s+/g, "").replace(/(?:근처|인근|주변)$/u, "");
}

export function normalizeSeoulDistrict(district: string | null | undefined): string | null {
  if (!district) return null;
  const compact = compactLocationName(district);
  if (!compact) return null;
  if (SEOUL_DISTRICT_CENTERS[compact]) return compact;
  if (SEOUL_NEIGHBORHOOD_ALIASES[compact]) return SEOUL_NEIGHBORHOOD_ALIASES[compact] ?? null;

  const withoutSeoul = compact.replace(/^(?:서울특별시|서울시|서울)/u, "");
  if (SEOUL_DISTRICT_CENTERS[withoutSeoul]) return withoutSeoul;
  const suffixed = withoutSeoul.endsWith("구") ? withoutSeoul : `${withoutSeoul}구`;
  if (SEOUL_DISTRICT_CENTERS[suffixed]) return suffixed;

  const partialMatches = Object.keys(SEOUL_DISTRICT_CENTERS).filter(
    (name) => withoutSeoul.includes(name) || name.replace(/구$/u, "") === withoutSeoul
  );
  return partialMatches.length === 1 ? partialMatches[0] ?? null : null;
}

export function validateCoordinates(coordinates: Coordinates): Coordinates {
  const parsed = KoreaCoordinateSchema.safeParse(coordinates);
  if (!parsed.success) {
    throw new AppError({
      code: ERROR_CODES.INVALID_INPUT,
      message: "Coordinates are outside supported Korea bounds"
    });
  }
  return parsed.data;
}

export function isSeoulDistrict(district: string | null | undefined): boolean {
  return normalizeSeoulDistrict(district) !== null;
}

export function getDistrictCenter(district: string | null | undefined): Coordinates | null {
  const normalized = normalizeSeoulDistrict(district);
  return normalized ? SEOUL_DISTRICT_CENTERS[normalized] ?? null : null;
}

export function calculateHaversineKm(origin: Coordinates, destination: Coordinates): number {
  const radiusKm = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRadians(destination.latitude - origin.latitude);
  const dLon = toRadians(destination.longitude - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(destination.latitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

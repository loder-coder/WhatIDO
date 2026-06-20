import type { PriceType } from "./eventTypes.js";

export interface ParsedPrice {
  readonly type: PriceType;
  readonly isFree: boolean | null;
}

export function parsePriceText(priceText: string | null | undefined): ParsedPrice {
  const normalized = priceText?.trim() ?? "";
  if (normalized === "" || /문의|확인|미정|상세|홈페이지/i.test(normalized)) {
    return { type: "unknown", isFree: null };
  }
  if (/(^|\s)(무료|free)(\s|$)|^0\s*원$/i.test(normalized) && !/부분|일부|유료/.test(normalized)) {
    return { type: "free", isFree: true };
  }
  if (/유료|원|₩|만원|입장료|관람료/i.test(normalized)) {
    return { type: "paid", isFree: false };
  }
  return { type: "unknown", isFree: null };
}

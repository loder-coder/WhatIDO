import type { Coordinates } from "../../utils/geo.js";

export type ActivityCategory =
  | "exhibition"
  | "performance"
  | "festival"
  | "education"
  | "library"
  | "museum"
  | "park"
  | "market"
  | "public_facility"
  | "other";

export type PriceType = "free" | "paid" | "unknown";
export type ActivityEnvironment = "indoor" | "outdoor" | "mixed" | null;

export interface SourceMetadata {
  readonly provider: "Seoul Open Data" | "Culture Portal" | "mock";
  readonly url: string | null;
  readonly fetchedAt: string;
}

export interface ActivityCandidate {
  readonly id: string;
  readonly title: string;
  readonly category: ActivityCategory;
  readonly venue: string;
  readonly district: string | null;
  readonly address: string | null;
  readonly coordinates: Coordinates | null;
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly startTime: string | null;
  readonly endTime: string | null;
  readonly isFree: boolean | null;
  readonly priceType: PriceType;
  readonly priceText: string | null;
  readonly environment: ActivityEnvironment;
  readonly requiresReservation: boolean;
  readonly source: SourceMetadata;
}

export interface EventSearchRequest {
  readonly start: Date;
  readonly end: Date;
  readonly district: string | null;
  readonly coordinates: Coordinates | null;
  readonly freePreferred: boolean;
  readonly intent: "today" | "tomorrow" | "weekend";
  readonly now: Date;
}

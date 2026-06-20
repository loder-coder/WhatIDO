import { createHash } from "node:crypto";
import type { Coordinates } from "../../utils/geo.js";
import { SCORING_VERSION } from "../scoring/scoringRules.js";

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

export function buildLocationHash(coordinates: Coordinates | null): string {
  if (!coordinates) {
    return "location:none";
  }
  return `loc:${hash(`${coordinates.latitude.toFixed(3)},${coordinates.longitude.toFixed(3)}`)}`;
}

export const CACHE_TTLS = {
  weatherCurrentSeconds: 10 * 60,
  weatherForecastSeconds: 30 * 60,
  eventsSeconds: 6 * 60 * 60,
  eventsStaleSeconds: 24 * 60 * 60,
  congestionSeconds: 3 * 60,
  distanceSeconds: 24 * 60 * 60,
  recommendationSeconds: 5 * 60
} as const;

export const CacheKeyBuilder = {
  weather(input: { mode: string; coordinates: Coordinates; hourKey: string }) {
    return `weather:${input.mode}:${buildLocationHash(input.coordinates)}:${input.hourKey}`;
  },
  events(input: { intent: string; district: string | null; dateKey: string; freePreferred: boolean }) {
    return `events:${input.intent}:${hash(input.district ?? "seoul")}:${input.dateKey}:${input.freePreferred}`;
  },
  congestion(areaName: string) {
    return `congestion:${hash(areaName)}`;
  },
  distance(input: { origin: Coordinates | null; destinationId: string }) {
    return `distance:${buildLocationHash(input.origin)}:${hash(input.destinationId)}`;
  },
  recommendation(input: { intent: string; contextKey: string }) {
    return `recommendation:${SCORING_VERSION}:${input.intent}:${hash(input.contextKey)}`;
  }
} as const;

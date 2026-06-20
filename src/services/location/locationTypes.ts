import type { Coordinates } from "../../utils/geo.js";

export type TransportMode = "walking" | "public_transit" | "driving";

export interface DistanceResult {
  readonly id: string;
  readonly distanceKm: number | null;
  readonly estimatedMinutes: number | null;
  readonly transportMode: TransportMode;
  readonly confidence: "high" | "medium" | "low";
}

export interface DistanceDestination {
  readonly id: string;
  readonly coordinates: Coordinates | null;
}

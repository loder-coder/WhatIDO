import type { ActivityCandidate } from "../events/eventTypes.js";
import type { CongestionResult, Confidence } from "../congestion/congestionTypes.js";
import type { DistanceResult } from "../location/locationTypes.js";
import type { WeatherSnapshot } from "../weather/weatherTypes.js";
import type { Intent } from "../../utils/dates.js";

export type ReasonCode =
  | "indoor"
  | "outdoor_weather_fit"
  | "weather_fit"
  | "rain_risk"
  | "high_discomfort"
  | "free"
  | "paid"
  | "price_unknown"
  | "nearby"
  | "reasonable_distance"
  | "far"
  | "low_congestion"
  | "high_congestion"
  | "congestion_unknown"
  | "reservation_required"
  | "time_fit";

export interface EnrichedCandidate {
  readonly candidate: ActivityCandidate;
  readonly weather: WeatherSnapshot;
  readonly distance: DistanceResult;
  readonly congestion: CongestionResult;
}

export interface ScoreComponents {
  readonly distance: number;
  readonly weather: number;
  readonly free: number;
  readonly congestion: number;
  readonly time: number;
}

export interface ScoreResult {
  readonly score: number;
  readonly components: ScoreComponents;
  readonly penalties: readonly string[];
  readonly reasonCodes: readonly ReasonCode[];
  readonly confidence: Confidence;
}

export interface RankedRecommendation {
  readonly id: string;
  readonly rank: number;
  readonly title: string;
  readonly category: string;
  readonly venue: string;
  readonly district: string | null;
  readonly address: string | null;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly is_indoor: boolean | null;
  readonly is_free: boolean | null;
  readonly price_text: string | null;
  readonly distance_km: number | null;
  readonly estimated_travel_minutes: number | null;
  readonly congestion: {
    readonly level: string;
    readonly score: number;
    readonly confidence: Confidence;
  };
  readonly weather_fit: {
    readonly score: number;
    readonly reason: string;
  };
  readonly score: number;
  readonly score_components: ScoreComponents;
  readonly reason_codes: readonly ReasonCode[];
  readonly explanation: string;
  readonly source: {
    readonly provider: string;
    readonly url: string | null;
    readonly fetched_at: string;
  };
}

export interface RecommendationRequest {
  readonly intent: Intent;
  readonly resultLimit: number;
  readonly freePreferred: boolean;
  readonly lowCrowdPreferred: boolean;
  readonly enrichedCandidates: readonly EnrichedCandidate[];
}

import type { Coordinates } from "../../utils/geo.js";
import type { Intent } from "../../utils/dates.js";

export type WeatherMode = Intent;
export type DiscomfortLevel = "unknown" | "low" | "moderate" | "high" | "very_high";
export type RecommendationBias = "unknown" | "indoor" | "outdoor" | "mixed";
export type WeatherRisk = "unknown" | "low" | "rain" | "heat" | "cold" | "high_discomfort";

export interface WeatherRequest {
  readonly mode: WeatherMode;
  readonly location: Coordinates;
  readonly start: Date;
  readonly end: Date;
}

export interface WeatherSourceMetadata {
  readonly provider: "KMA" | "mock";
  readonly fetchedAt: string;
  readonly cached: boolean;
}

export interface WeatherSnapshot {
  readonly temperatureC: number | null;
  readonly humidityPercent: number | null;
  readonly precipitationProbability: number | null;
  readonly precipitationType: "none" | "rain" | "snow" | "mixed" | "unknown";
  readonly sky: string | null;
  readonly windSpeedMs: number | null;
  readonly discomfortIndex: number | null;
  readonly discomfortLevel: DiscomfortLevel;
  readonly recommendationBias: RecommendationBias;
  readonly risk: WeatherRisk;
  readonly source: WeatherSourceMetadata;
}

export interface KmaForecastPoint {
  readonly temperatureC: number | null;
  readonly humidityPercent: number | null;
  readonly precipitationProbability: number | null;
  readonly precipitationType: WeatherSnapshot["precipitationType"];
  readonly sky: string | null;
  readonly windSpeedMs: number | null;
}

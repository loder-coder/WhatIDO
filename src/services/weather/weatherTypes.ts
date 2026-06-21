import type { Coordinates } from "../../utils/geo.js";
import type { Intent } from "../../utils/dates.js";

export type WeatherMode = Intent;
export type DiscomfortLevel = "unknown" | "low" | "moderate" | "high" | "very_high";
export type RecommendationBias = "unknown" | "indoor" | "outdoor" | "mixed";
export type WeatherRisk = "unknown" | "low" | "rain" | "heat" | "cold" | "high_discomfort";

// Legacy KMA parser types are kept at the provider boundary. They are not
// passed into the recommendation layer, which uses WeatherSnapshot instead.
export type PrecipitationType =
  | "none"
  | "rain"
  | "rain_snow"
  | "snow"
  | "shower"
  | "unknown";
export type SkyCondition = "clear" | "partly_cloudy" | "cloudy" | "unknown";
export type WeatherBias = RecommendationBias;

export interface KmaItem {
  readonly baseDate?: string;
  readonly baseTime?: string;
  readonly fcstDate?: string;
  readonly fcstTime?: string;
  readonly category?: string;
  readonly obsrValue?: string;
  readonly fcstValue?: string;
}

export interface KmaApiResponse {
  readonly response?: {
    readonly header?: { readonly resultCode?: string; readonly resultMsg?: string };
    readonly body?: { readonly items?: { readonly item?: KmaItem | readonly KmaItem[] } };
  };
}

export interface DiscomfortIndex {
  readonly value: number | null;
  readonly level: DiscomfortLevel;
}

export interface WeatherSuitability {
  readonly bias: WeatherBias;
  readonly indoorScore: number;
  readonly outdoorScore: number;
  readonly reasons: readonly string[];
}

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

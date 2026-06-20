import type { ActivityCandidate } from "../events/eventTypes.js";

export type CongestionLevel =
  | "relaxed"
  | "normal"
  | "slightly_crowded"
  | "crowded"
  | "very_crowded"
  | "unknown";

export type Confidence = "high" | "medium" | "low";

export interface CongestionRequest {
  readonly areaName: string;
}

export interface CongestionResult {
  readonly areaName: string | null;
  readonly level: CongestionLevel;
  readonly score: number;
  readonly confidence: Confidence;
  readonly populationMin: number | null;
  readonly populationMax: number | null;
  readonly message: string | null;
  readonly source: {
    readonly provider: "Seoul Realtime City Data" | "mock";
    readonly fetchedAt: string;
    readonly cached: boolean;
  } | null;
}

export interface CandidateCongestion {
  readonly candidate: ActivityCandidate;
  readonly congestion: CongestionResult;
}

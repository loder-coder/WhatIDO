import type { ActivityCandidate } from "../events/eventTypes.js";
import type { CongestionResult } from "../congestion/congestionTypes.js";
import type { DistanceResult } from "../location/locationTypes.js";
import type { WeatherSnapshot } from "../weather/weatherTypes.js";
import type { Intent } from "../../utils/dates.js";
import { RecommendationEngine } from "./RecommendationEngine.js";
import type { RankedRecommendation } from "./recommendationTypes.js";

export class RecommendationService {
  constructor(private readonly engine: RecommendationEngine) {}

  rank(input: {
    readonly intent: Intent;
    readonly resultLimit: number;
    readonly freePreferred: boolean;
    readonly lowCrowdPreferred: boolean;
    readonly weather: WeatherSnapshot;
    readonly candidates: readonly ActivityCandidate[];
    readonly distances: Map<string, DistanceResult>;
    readonly congestion: Map<string, CongestionResult>;
  }): RankedRecommendation[] {
    return this.engine.rank({
      intent: input.intent,
      resultLimit: input.resultLimit,
      freePreferred: input.freePreferred,
      lowCrowdPreferred: input.lowCrowdPreferred,
      enrichedCandidates: input.candidates.map((candidate) => ({
        candidate,
        weather: input.weather,
        distance: input.distances.get(candidate.id) ?? {
          id: candidate.id,
          distanceKm: null,
          estimatedMinutes: null,
          transportMode: "public_transit",
          confidence: "low"
        },
        congestion: input.congestion.get(candidate.id) ?? {
          areaName: null,
          level: "unknown",
          score: 60,
          confidence: "low",
          populationMin: null,
          populationMax: null,
          message: "혼잡도 정보는 확인 불가입니다.",
          source: null
        }
      }))
    });
  }
}

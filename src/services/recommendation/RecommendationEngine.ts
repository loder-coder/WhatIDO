import { ScoringService } from "../scoring/ScoringService.js";
import { toRankedRecommendation } from "./ResponseComposer.js";
import type { RecommendationRequest, RankedRecommendation } from "./recommendationTypes.js";

export class RecommendationEngine {
  constructor(private readonly scoringService: ScoringService) {}

  rank(request: RecommendationRequest): RankedRecommendation[] {
    const scored = request.enrichedCandidates
      .map((enriched) => {
        const score = this.scoringService.scoreCandidate({
          intent: request.intent,
          candidate: enriched.candidate,
          weather: enriched.weather,
          distance: enriched.distance,
          congestion: enriched.congestion,
          lowCrowdPreferred: request.lowCrowdPreferred
        });
        return { enriched, score };
      })
      .sort((a, b) => {
        if (Math.abs(b.score.score - a.score.score) >= 2) return b.score.score - a.score.score;
        const confidenceRank = { high: 3, medium: 2, low: 1 };
        if (confidenceRank[b.score.confidence] !== confidenceRank[a.score.confidence]) {
          return confidenceRank[b.score.confidence] - confidenceRank[a.score.confidence];
        }
        if (b.score.components.weather !== a.score.components.weather) return b.score.components.weather - a.score.components.weather;
        const aDistance = a.enriched.distance.estimatedMinutes ?? Number.POSITIVE_INFINITY;
        const bDistance = b.enriched.distance.estimatedMinutes ?? Number.POSITIVE_INFINITY;
        if (aDistance !== bDistance) return aDistance - bDistance;
        if (b.score.components.free !== a.score.components.free) return b.score.components.free - a.score.components.free;
        if (b.score.components.congestion !== a.score.components.congestion) return b.score.components.congestion - a.score.components.congestion;
        return a.enriched.candidate.id.localeCompare(b.enriched.candidate.id);
      });

    return diversify(scored)
      .slice(0, request.resultLimit)
      .map((entry, index) =>
        toRankedRecommendation({
          rank: index + 1,
          candidate: entry.enriched.candidate,
          weather: entry.enriched.weather,
          distance: entry.enriched.distance,
          congestion: entry.enriched.congestion,
          score: entry.score
        })
      );
  }
}

type ScoredEntry = {
  readonly enriched: RecommendationRequest["enrichedCandidates"][number];
  readonly score: ReturnType<ScoringService["scoreCandidate"]>;
};

function diversify(entries: readonly ScoredEntry[]): ScoredEntry[] {
  const output: ScoredEntry[] = [];
  const remaining = [...entries];
  while (remaining.length > 0) {
    const selected = remaining.shift()!;
    output.push(selected);
    const categories = new Set(output.map((entry) => entry.enriched.candidate.category));
    const nextDuplicateIndex = remaining.findIndex((entry) => categories.has(entry.enriched.candidate.category));
    if (nextDuplicateIndex === 0) {
      const duplicate = remaining[0]!;
      const alternativeIndex = remaining.findIndex(
        (entry) =>
          !categories.has(entry.enriched.candidate.category) &&
          duplicate.score.score - entry.score.score <= 8 &&
          entry.score.components.weather >= 60
      );
      if (alternativeIndex > 0) {
        const [alternative] = remaining.splice(alternativeIndex, 1);
        remaining.unshift(alternative!);
      }
    }
  }
  return output;
}

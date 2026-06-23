import type { CacheService } from "../cache/cacheTypes.js";
import { formatSeoulIso } from "../../utils/dates.js";
import { CACHE_TTLS, CacheKeyBuilder } from "../cache/cacheKeys.js";
import { mapCandidateToArea } from "./areaMapping.js";
import { SeoulCityDataProvider } from "./SeoulCityDataProvider.js";
import { scoreCongestion } from "./congestionScore.js";
import type { CongestionResult } from "./congestionTypes.js";
import type { ActivityCandidate } from "../events/eventTypes.js";

export class CongestionService {
  constructor(
    private readonly provider: SeoulCityDataProvider,
    private readonly cache: CacheService
  ) {}

  async enrichCandidates(candidates: readonly ActivityCandidate[]): Promise<Map<string, CongestionResult>> {
    const result = new Map<string, CongestionResult>();
    const areaCache = new Map<string, CongestionResult>();
    for (const candidate of candidates) {
      const mapping = mapCandidateToArea(candidate);
      if (!mapping.areaName) {
        result.set(candidate.id, this.createUnknownResult(null));
        continue;
      }
      let congestion = areaCache.get(mapping.areaName);
      if (!congestion) {
        congestion = await this.getCongestion(mapping.areaName);
        areaCache.set(mapping.areaName, congestion);
      }
      result.set(candidate.id, {
        ...congestion,
        confidence: mapping.confidence === "high" ? congestion.confidence : mapping.confidence
      });
    }
    return result;
  }

  async getCongestion(areaName: string): Promise<CongestionResult> {
    const cacheKey = CacheKeyBuilder.congestion(areaName);
    const cached = await this.cache.get<CongestionResult>(cacheKey);
    if (cached.hit) {
      return { ...cached.value, source: cached.value.source ? { ...cached.value.source, cached: true } : null };
    }
    try {
      const data = await this.provider.getCongestion(areaName);
      await this.cache.set(cacheKey, data, CACHE_TTLS.congestionSeconds, {
        staleTtlSeconds: CACHE_TTLS.congestionSeconds
      });
      return data;
    } catch {
      return this.createUnknownResult(areaName);
    }
  }

  createUnknownResult(areaName: string | null): CongestionResult {
    return {
      areaName,
      level: "unknown",
      score: scoreCongestion("unknown"),
      confidence: "low",
      populationMin: null,
      populationMax: null,
      message: "혼잡도 정보는 확인 불가입니다.",
      source: { provider: "fallback", fetchedAt: formatSeoulIso(new Date()), cached: false }
    };
  }
}

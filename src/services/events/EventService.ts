import type { CacheService } from "../cache/cacheTypes.js";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { CACHE_TTLS, CacheKeyBuilder } from "../cache/cacheKeys.js";
import { filterCandidatesByDate, deduplicateCandidates } from "./eventFilters.js";
import type { ActivityCandidate, EventSearchRequest } from "./eventTypes.js";
import { SeoulEventProvider } from "./SeoulEventProvider.js";
import { CulturePortalProvider } from "./CulturePortalProvider.js";

export class EventService {
  constructor(
    private readonly seoulProvider: SeoulEventProvider,
    private readonly cultureProvider: CulturePortalProvider,
    private readonly cache: CacheService
  ) {}

  async searchCandidates(request: EventSearchRequest): Promise<ActivityCandidate[]> {
    const cacheKey = CacheKeyBuilder.events({
      intent: request.intent,
      district: request.district,
      dateKey: `${request.start.toISOString().slice(0, 10)}:${request.end.toISOString().slice(0, 10)}`,
      freePreferred: request.freePreferred
    });
    const cached = await this.cache.get<ActivityCandidate[]>(cacheKey);
    if (cached.hit) {
      return cached.value;
    }

    const settled = await Promise.allSettled([
      this.seoulProvider.searchEvents(request),
      this.cultureProvider.searchEvents(request)
    ]);
    const successes = settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
    if (successes.length === 0 && settled.some((result) => result.status === "rejected")) {
      const stale = await this.cache.get<ActivityCandidate[]>(cacheKey, { allowStale: true });
      if (stale.hit) {
        return stale.value;
      }
      throw new AppError({ code: ERROR_CODES.EVENTS_UNAVAILABLE });
    }
    const filtered = filterCandidatesByDate(deduplicateCandidates(successes), request).filter((candidate) => {
      if (request.freePreferred) {
        return candidate.priceType === "free";
      }
      return true;
    });
    await this.cache.set(cacheKey, filtered, CACHE_TTLS.eventsSeconds, {
      staleTtlSeconds: CACHE_TTLS.eventsStaleSeconds
    });
    return filtered;
  }
}

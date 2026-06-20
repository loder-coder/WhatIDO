import type { CacheService } from "../cache/cacheTypes.js";
import { AppError, toAppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { formatSeoulIso } from "../../utils/dates.js";
import { withRetry } from "../../utils/timeout.js";
import { CACHE_TTLS, CacheKeyBuilder } from "../cache/cacheKeys.js";
import { calculateDiscomfortIndex, classifyDiscomfortLevel } from "./discomfortIndex.js";
import { classifyWeatherBias, classifyWeatherRisk } from "./weatherFit.js";
import { KmaWeatherProvider, createKmaSourceMetadata } from "./KmaWeatherProvider.js";
import type { WeatherRequest, WeatherSnapshot } from "./weatherTypes.js";

export class WeatherService {
  constructor(
    private readonly provider: KmaWeatherProvider,
    private readonly cache: CacheService
  ) {}

  async getWeatherSnapshot(request: WeatherRequest): Promise<WeatherSnapshot> {
    const cacheKey = CacheKeyBuilder.weather({
      mode: request.mode,
      coordinates: request.location,
      hourKey: request.start.toISOString().slice(0, 13)
    });
    const cached = await this.cache.get<WeatherSnapshot>(cacheKey);
    if (cached.hit) {
      return { ...cached.value, source: { ...cached.value.source, cached: true } };
    }
    try {
      const point = await withRetry(
        () => this.provider.getWeather(request),
        (error) => error instanceof AppError && error.retryable,
        1
      );
      const discomfortIndex = calculateDiscomfortIndex(point.temperatureC, point.humidityPercent);
      const discomfortLevel = classifyDiscomfortLevel(discomfortIndex);
      const recommendationBias = classifyWeatherBias({
        temperatureC: point.temperatureC,
        precipitationProbability: point.precipitationProbability,
        discomfortIndex
      });
      const snapshot: WeatherSnapshot = {
        ...point,
        discomfortIndex,
        discomfortLevel,
        recommendationBias,
        risk: classifyWeatherRisk({
          temperatureC: point.temperatureC,
          precipitationProbability: point.precipitationProbability,
          discomfortIndex
        }),
        source: createKmaSourceMetadata(false)
      };
      await this.cache.set(
        cacheKey,
        snapshot,
        request.mode === "today" ? CACHE_TTLS.weatherCurrentSeconds : CACHE_TTLS.weatherForecastSeconds,
        { staleTtlSeconds: CACHE_TTLS.weatherForecastSeconds }
      );
      return snapshot;
    } catch (error) {
      const stale = await this.cache.get<WeatherSnapshot>(cacheKey, { allowStale: true });
      if (stale.hit) {
        return { ...stale.value, source: { ...stale.value.source, cached: true } };
      }
      const appError = toAppError(error, ERROR_CODES.WEATHER_UNAVAILABLE);
      if (appError.code === ERROR_CODES.WEATHER_UNAVAILABLE || appError.code === ERROR_CODES.TIMEOUT) {
        throw appError;
      }
      throw new AppError({ code: ERROR_CODES.WEATHER_UNAVAILABLE, provider: "KMA", cause: error });
    }
  }

  getNeutralWeatherSnapshot(): WeatherSnapshot {
    return {
      temperatureC: null,
      humidityPercent: null,
      precipitationProbability: null,
      precipitationType: "unknown",
      sky: null,
      windSpeedMs: null,
      discomfortIndex: null,
      discomfortLevel: "unknown",
      recommendationBias: "unknown",
      risk: "unknown",
      source: { provider: "mock", fetchedAt: formatSeoulIso(new Date()), cached: false }
    };
  }
}

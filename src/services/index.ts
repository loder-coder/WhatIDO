import type { AppConfig } from "../config/env.js";
import { InMemoryCache } from "./cache/InMemoryCache.js";
import type { CacheService } from "./cache/cacheTypes.js";
import { CongestionService } from "./congestion/CongestionService.js";
import { SeoulCityDataProvider } from "./congestion/SeoulCityDataProvider.js";
import { CulturePortalProvider } from "./events/CulturePortalProvider.js";
import { EventService } from "./events/EventService.js";
import { SeoulEventProvider } from "./events/SeoulEventProvider.js";
import { LocationService } from "./location/LocationService.js";
import { RecommendationEngine } from "./recommendation/RecommendationEngine.js";
import { RecommendationService } from "./recommendation/RecommendationService.js";
import { ScoringService } from "./scoring/ScoringService.js";
import { KmaWeatherProvider } from "./weather/KmaWeatherProvider.js";
import { WeatherService } from "./weather/WeatherService.js";

export interface ServiceContainer {
  readonly phase: "phase-11-ready";
  readonly cache: CacheService;
  readonly weather: WeatherService;
  readonly events: EventService;
  readonly congestion: CongestionService;
  readonly location: LocationService;
  readonly recommendation: RecommendationService;
  readonly scoring: ScoringService;
}

export function createServiceContainer(config?: AppConfig): ServiceContainer {
  const effectiveConfig =
    config ??
    ({
      MOCK_PROVIDERS: false,
      NODE_ENV: "development",
      LOG_LEVEL: "silent",
      CACHE_BACKEND: "memory",
      PORT: 3000
    } as AppConfig);
  const cache = new InMemoryCache();
  const scoring = new ScoringService();
  return {
    phase: "phase-11-ready",
    cache,
    weather: new WeatherService(new KmaWeatherProvider(effectiveConfig), cache),
    events: new EventService(new SeoulEventProvider(effectiveConfig), new CulturePortalProvider(effectiveConfig), cache),
    congestion: new CongestionService(new SeoulCityDataProvider(effectiveConfig), cache),
    location: new LocationService(),
    recommendation: new RecommendationService(new RecommendationEngine(scoring)),
    scoring
  };
}

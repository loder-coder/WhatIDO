import { describe, expect, it } from "vitest";
import { RecommendationEngine } from "../../../src/services/recommendation/RecommendationEngine.js";
import { ScoringService } from "../../../src/services/scoring/ScoringService.js";
import type { ActivityCandidate } from "../../../src/services/events/eventTypes.js";
import type { WeatherSnapshot } from "../../../src/services/weather/weatherTypes.js";
import type { CongestionResult } from "../../../src/services/congestion/congestionTypes.js";
import type { DistanceResult } from "../../../src/services/location/locationTypes.js";

function candidate(overrides: Partial<ActivityCandidate>): ActivityCandidate {
  return {
    id: "candidate",
    title: "후보",
    category: "exhibition",
    venue: "서울역사박물관",
    district: "종로구",
    address: null,
    coordinates: { latitude: 37.57, longitude: 126.97 },
    startDate: "2026-06-20",
    endDate: "2026-06-20",
    startTime: "10:00",
    endTime: "18:00",
    isFree: true,
    priceType: "free",
    priceText: "무료",
    environment: "indoor",
    requiresReservation: false,
    source: { provider: "mock", url: null, fetchedAt: "2026-06-20T10:00:00+09:00" },
    ...overrides
  };
}

function weather(overrides: Partial<WeatherSnapshot>): WeatherSnapshot {
  return {
    temperatureC: 34,
    humidityPercent: 68,
    precipitationProbability: 20,
    precipitationType: "none",
    sky: null,
    windSpeedMs: null,
    discomfortIndex: 83,
    discomfortLevel: "very_high",
    recommendationBias: "indoor",
    risk: "high_discomfort",
    source: { provider: "mock", fetchedAt: "2026-06-20T10:00:00+09:00", cached: false },
    ...overrides
  };
}

function distance(minutes: number | null): DistanceResult {
  return {
    id: "candidate",
    distanceKm: minutes === null ? null : minutes / 6,
    estimatedMinutes: minutes,
    transportMode: "public_transit",
    confidence: minutes === null ? "low" : "medium"
  };
}

function congestion(score = 80, level: CongestionResult["level"] = "normal"): CongestionResult {
  return {
    areaName: "광화문·덕수궁",
    level,
    score,
    confidence: "high",
    populationMin: null,
    populationMax: null,
    message: null,
    source: null
  };
}

describe("ScoringService", () => {
  const scoring = new ScoringService();

  it("scores weather according to rain and discomfort rules", () => {
    expect(scoring.scoreWeather(candidate({ environment: "indoor" }), weather({ precipitationProbability: 70 }))).toBe(100);
    expect(scoring.scoreWeather(candidate({ environment: "outdoor" }), weather({ precipitationProbability: 70 }))).toBe(30);
    expect(scoring.scoreWeather(candidate({ environment: "outdoor" }), weather({ discomfortIndex: 83 }))).toBe(20);
    expect(
      scoring.scoreWeather(
        candidate({ environment: "outdoor" }),
        weather({ temperatureC: 22, precipitationProbability: 10, discomfortIndex: 66 })
      )
    ).toBe(100);
  });

  it("scores distance using travel minutes by intent", () => {
    expect(scoring.scoreDistance("today", 10)).toBe(86);
    expect(scoring.scoreDistance("tomorrow", 10)).toBe(90);
    expect(scoring.scoreDistance("weekend", 10)).toBe(93);
  });

  it("scores price and clamps final score", () => {
    expect(scoring.scoreFree(candidate({ priceType: "free", priceText: "무료" }))).toBe(100);
    expect(scoring.scoreFree(candidate({ priceType: "paid", priceText: "10,000원" }))).toBe(80);
    expect(scoring.scoreFree(candidate({ priceType: "paid", priceText: "40,000원" }))).toBe(25);
    expect(scoring.scoreFree(candidate({ priceType: "unknown", priceText: null }))).toBe(40);
    const result = scoring.scoreCandidate({
      intent: "today",
      candidate: candidate({ environment: "outdoor", requiresReservation: true }),
      weather: weather({ precipitationProbability: 90, discomfortIndex: 85 }),
      distance: distance(180),
      congestion: congestion(10, "very_crowded"),
      lowCrowdPreferred: true
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("applies penalties and reason codes", () => {
    const result = scoring.scoreCandidate({
      intent: "today",
      candidate: candidate({ environment: "outdoor", requiresReservation: true, priceType: "unknown", isFree: null }),
      weather: weather({ precipitationProbability: 70, discomfortIndex: 83 }),
      distance: distance(30),
      congestion: congestion(30, "crowded"),
      lowCrowdPreferred: true,
      now: new Date("2026-06-20T17:10:00+09:00")
    });
    expect(result.penalties).toContain("reservation_today_penalty");
    expect(result.penalties).toContain("rain_outdoor_penalty");
    expect(result.penalties).toContain("discomfort_outdoor_penalty");
    expect(result.penalties).toContain("ending_soon_penalty");
    expect(result.reasonCodes).toContain("price_unknown");
    expect(result.reasonCodes).toContain("high_congestion");
  });
});

describe("RecommendationEngine", () => {
  it("ranks indoor above outdoor in heat and rain", () => {
    const engine = new RecommendationEngine(new ScoringService());
    const ranked = engine.rank({
      intent: "today",
      resultLimit: 2,
      freePreferred: false,
      lowCrowdPreferred: false,
      enrichedCandidates: [
        {
          candidate: candidate({ id: "outdoor", title: "야외 축제", category: "festival", environment: "outdoor" }),
          weather: weather({ precipitationProbability: 70 }),
          distance: distance(10),
          congestion: congestion(80)
        },
        {
          candidate: candidate({ id: "indoor", title: "실내 전시", environment: "indoor" }),
          weather: weather({ precipitationProbability: 70 }),
          distance: distance(20),
          congestion: congestion(80)
        }
      ]
    });
    expect(ranked[0]?.id).toBe("indoor");
    expect(ranked[0]?.explanation).toContain("무료");
  });

  it("prefers free over unknown price and low congestion over crowded", () => {
    const engine = new RecommendationEngine(new ScoringService());
    const ranked = engine.rank({
      intent: "weekend",
      resultLimit: 3,
      freePreferred: true,
      lowCrowdPreferred: true,
      enrichedCandidates: [
        {
          candidate: candidate({ id: "unknown-price", priceType: "unknown", isFree: null }),
          weather: weather({ temperatureC: 22, precipitationProbability: 10, discomfortIndex: 66 }),
          distance: distance(30),
          congestion: congestion(80)
        },
        {
          candidate: candidate({ id: "free-crowded", priceType: "free", isFree: true }),
          weather: weather({ temperatureC: 22, precipitationProbability: 10, discomfortIndex: 66 }),
          distance: distance(30),
          congestion: congestion(10, "very_crowded")
        },
        {
          candidate: candidate({ id: "free-normal", priceType: "free", isFree: true }),
          weather: weather({ temperatureC: 22, precipitationProbability: 10, discomfortIndex: 66 }),
          distance: distance(30),
          congestion: congestion(80)
        }
      ]
    });
    expect(ranked[0]?.id).toBe("free-normal");
    expect(ranked.findIndex((item) => item.id === "unknown-price")).toBeGreaterThan(0);
    expect(ranked.findIndex((item) => item.id === "free-crowded")).toBeGreaterThan(0);
  });
});

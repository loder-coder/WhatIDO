import { describe, expect, it } from "vitest";
import { InMemoryCache } from "../../../src/services/cache/InMemoryCache.js";
import { mapCandidateToArea } from "../../../src/services/congestion/areaMapping.js";
import { CongestionService } from "../../../src/services/congestion/CongestionService.js";
import { normalizeCongestionLevel, scoreCongestion } from "../../../src/services/congestion/congestionScore.js";
import { parseCityDataResponse, SeoulCityDataProvider } from "../../../src/services/congestion/SeoulCityDataProvider.js";
import type { ActivityCandidate } from "../../../src/services/events/eventTypes.js";

function createCandidate(overrides: Partial<ActivityCandidate> = {}): ActivityCandidate {
  return {
    id: "candidate-1",
    title: "테스트 전시",
    category: "exhibition",
    venue: "서울역사박물관",
    district: "종로구",
    address: null,
    coordinates: null,
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

describe("Congestion Service", () => {
  it("maps congestion levels to deterministic scores", () => {
    expect(scoreCongestion("relaxed")).toBe(100);
    expect(scoreCongestion("normal")).toBe(80);
    expect(scoreCongestion("slightly_crowded")).toBe(55);
    expect(scoreCongestion("crowded")).toBe(30);
    expect(scoreCongestion("very_crowded")).toBe(10);
    expect(scoreCongestion("unknown")).toBe(60);
  });

  it("normalizes Korean provider labels", () => {
    expect(normalizeCongestionLevel("여유")).toBe("relaxed");
    expect(normalizeCongestionLevel("보통")).toBe("normal");
    expect(normalizeCongestionLevel("약간 붐빔")).toBe("slightly_crowded");
    expect(normalizeCongestionLevel("붐빔")).toBe("crowded");
    expect(normalizeCongestionLevel("매우 붐빔")).toBe("very_crowded");
    expect(normalizeCongestionLevel("무언가")).toBe("unknown");
  });

  it("parses Seoul city data fixture shape", () => {
    const parsed = parseCityDataResponse({
      CITYDATA: {
        AREA_NM: "광화문·덕수궁",
        LIVE_PPLTN_STTS: [
          {
            AREA_CONGEST_LVL: "보통",
            AREA_CONGEST_MSG: "방문 가능합니다.",
            AREA_PPLTN_MIN: "12000",
            AREA_PPLTN_MAX: "14000"
          }
        ]
      }
    });
    expect(parsed.level).toBe("normal");
    expect(parsed.score).toBe(80);
    expect(parsed.populationMin).toBe(12000);
  });

  it("maps venues to supported city data areas", () => {
    expect(mapCandidateToArea(createCandidate()).areaName).toBe("광화문·덕수궁");
    expect(mapCandidateToArea(createCandidate({ venue: "모르는 장소", district: "마포구" })).confidence).toBe("medium");
    expect(mapCandidateToArea(createCandidate({ venue: "모르는 장소", district: null })).areaName).toBeNull();
  });

  it("enriches candidates with mock congestion and unknown fallback", async () => {
    const service = new CongestionService(
      new SeoulCityDataProvider({
        NODE_ENV: "test",
        LOG_LEVEL: "silent",
        MOCK_PROVIDERS: true,
        CACHE_BACKEND: "memory",
        PORT: 3000
      }),
      new InMemoryCache()
    );
    const enriched = await service.enrichCandidates([
      createCandidate(),
      createCandidate({ id: "candidate-2", venue: "지원 안 됨", district: null })
    ]);
    expect(enriched.get("candidate-1")?.score).toBe(80);
    expect(enriched.get("candidate-2")?.level).toBe("unknown");
    expect(enriched.get("candidate-2")?.confidence).toBe("low");
  });
});

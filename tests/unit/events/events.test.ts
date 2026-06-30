import { describe, expect, it } from "vitest";
import { InMemoryCache } from "../../../src/services/cache/InMemoryCache.js";
import { CulturePortalProvider, parseCulturePortalItems } from "../../../src/services/events/CulturePortalProvider.js";
import { EventService } from "../../../src/services/events/EventService.js";
import { filterEventsByLocation, getMockSeoulEvents, parseSeoulEventRows, SeoulEventProvider } from "../../../src/services/events/SeoulEventProvider.js";
import { deduplicateCandidates, filterCandidatesByDate } from "../../../src/services/events/eventFilters.js";
import { inferEnvironment } from "../../../src/services/events/environmentInference.js";
import { parsePriceText } from "../../../src/services/events/priceParser.js";

describe("Event Service", () => {
  it("parses Korean price text safely", () => {
    expect(parsePriceText("무료")).toEqual({ type: "free", isFree: true });
    expect(parsePriceText("0원")).toEqual({ type: "free", isFree: true });
    expect(parsePriceText("10,000원")).toEqual({ type: "paid", isFree: false });
    expect(parsePriceText("문의")).toEqual({ type: "unknown", isFree: null });
    expect(parsePriceText("")).toEqual({ type: "unknown", isFree: null });
  });

  it("infers indoor and outdoor environments", () => {
    expect(inferEnvironment("exhibition", "서울역사박물관", "전시")).toBe("indoor");
    expect(inferEnvironment("park", "한강공원", "산책")).toBe("outdoor");
    expect(inferEnvironment("other", "알 수 없는 장소", null)).toBeNull();
  });

  it("parses Seoul Open Data rows into ActivityCandidate", () => {
    const candidates = parseSeoulEventRows([
      {
        TITLE: "무료 기획 전시",
        CODENAME: "전시/미술",
        PLACE: "서울역사박물관",
        GUNAME: "종로구",
        USE_FEE: "무료",
        STRTDATE: "2026-06-01",
        END_DATE: "2026-06-30",
        LAT: "37.5704",
        LOT: "126.9707",
        ORG_LINK: "https://example.com/event"
      }
    ]);
    expect(candidates[0]?.title).toBe("무료 기획 전시");
    expect(candidates[0]?.isFree).toBe(true);
    expect(candidates[0]?.coordinates?.latitude).toBe(37.5704);
  });

  it("parses Culture Portal supplemental rows", () => {
    const candidates = parseCulturePortalItems([
      {
        title: "문화포털 공연",
        place: "세종문화회관",
        area: "종로구",
        startDate: "2026-06-20",
        endDate: "2026-06-21",
        price: "유료",
        realmName: "공연",
        gpsX: "126.975",
        gpsY: "37.572"
      }
    ]);
    expect(candidates[0]?.category).toBe("performance");
    expect(candidates[0]?.priceType).toBe("paid");
  });

  it("filters expired events and deduplicates title venue date", () => {
    const [candidate] = parseSeoulEventRows([
      {
        TITLE: "중복 전시",
        CODENAME: "전시",
        PLACE: "서울역사박물관",
        USE_FEE: "무료",
        STRTDATE: "2026-06-01",
        END_DATE: "2026-06-30"
      }
    ]);
    const candidates = deduplicateCandidates([candidate!, candidate!]);
    const filtered = filterCandidatesByDate(candidates, {
      start: new Date("2026-06-20T10:00:00+09:00"),
      end: new Date("2026-06-20T23:59:59+09:00"),
      district: "종로구",
      freePreferred: false,
      intent: "today",
      now: new Date("2026-06-20T10:00:00+09:00")
    });
    expect(candidates).toHaveLength(1);
    expect(filtered).toHaveLength(1);
  });

  it("orchestrates mock providers and free preference", async () => {
    const service = new EventService(
      new SeoulEventProvider({
        NODE_ENV: "test",
        LOG_LEVEL: "silent",
        MOCK_PROVIDERS: true,
        CACHE_BACKEND: "memory",
        PORT: 3000
      }),
      new CulturePortalProvider({
        NODE_ENV: "test",
        LOG_LEVEL: "silent",
        MOCK_PROVIDERS: true,
        CACHE_BACKEND: "memory",
        PORT: 3000
      }),
      new InMemoryCache()
    );
    const candidates = await service.searchCandidates({
      start: new Date("2026-06-20T10:00:00+09:00"),
      end: new Date("2026-06-20T23:59:59+09:00"),
      district: "송파구",
      freePreferred: true,
      intent: "today",
      now: new Date("2026-06-20T10:00:00+09:00")
    });
    expect(candidates.length).toBeGreaterThan(0);
    expect(candidates.every((candidate) => candidate.priceType === "free")).toBe(true);
  });

  it("filters Seoul events to the user's district or five-kilometer radius", () => {
    const candidates = parseSeoulEventRows([
      { TITLE: "강남 행사", PLACE: "강남", GUNAME: "강남구", LAT: "37.5172", LOT: "127.0473" },
      { TITLE: "마포 행사", PLACE: "마포", GUNAME: "마포구", LAT: "37.5663", LOT: "126.9016" }
    ]);
    expect(filterEventsByLocation(candidates, { district: "강남", coordinates: null }).map((item) => item.title))
      .toEqual(["강남 행사"]);
    expect(filterEventsByLocation(candidates, {
      district: null,
      coordinates: { latitude: 37.5172, longitude: 127.0473 }
    }).map((item) => item.title)).toEqual(["강남 행사"]);
  });

  it("provides mock candidates for indoor, outdoor, price, distance, and congestion scenarios", () => {
    const candidates = getMockSeoulEvents({
      start: new Date("2026-06-20T10:00:00+09:00"),
      end: new Date("2026-06-20T23:59:59+09:00"),
      district: "송파구",
      freePreferred: false,
      intent: "today",
      now: new Date("2026-06-20T10:00:00+09:00")
    });

    expect(candidates).toHaveLength(11);
    expect(candidates.filter((candidate) => candidate.environment === "indoor")).not.toHaveLength(0);
    expect(candidates.filter((candidate) => candidate.environment === "outdoor")).toHaveLength(4);
    expect(candidates.some((candidate) => candidate.priceType === "free")).toBe(true);
    expect(candidates.some((candidate) => candidate.priceType === "paid")).toBe(true);
    expect(candidates.some((candidate) => candidate.priceType === "unknown")).toBe(true);
    expect(candidates.some((candidate) => candidate.id === "mock-crowded-outdoor-market")).toBe(true);
    expect(candidates.some((candidate) => candidate.id === "mock-relaxed-outdoor-walk-free")).toBe(true);
  });
});

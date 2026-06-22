import type { ActivityCandidate } from "../events/eventTypes.js";
import type { Confidence } from "./congestionTypes.js";

const VENUE_AREA_MAP: Record<string, string> = {
  서울역사박물관: "광화문·덕수궁",
  서울도서관: "광화문·덕수궁",
  여의도한강공원: "여의도",
  서울시립과학관: "노원역",
  동대문디자인플라자: "동대문 관광특구",
  남산서울타워: "남산공원"
};

const DISTRICT_AREA_MAP: Record<string, string> = {
  종로구: "광화문·덕수궁",
  중구: "명동 관광특구",
  영등포구: "여의도",
  노원구: "노원역",
  마포구: "홍대 관광특구",
  용산구: "이태원 관광특구"
};

export interface AreaMappingResult {
  readonly areaName: string | null;
  readonly confidence: Confidence;
}

export function mapCandidateToArea(candidate: ActivityCandidate): AreaMappingResult {
  if (candidate.id === "mock-crowded-outdoor-market") {
    return { areaName: "MOCK_CROWDED_AREA", confidence: "high" };
  }
  if (candidate.id === "mock-relaxed-outdoor-walk-free") {
    return { areaName: "MOCK_RELAXED_AREA", confidence: "high" };
  }
  if (VENUE_AREA_MAP[candidate.venue]) {
    return { areaName: VENUE_AREA_MAP[candidate.venue] ?? null, confidence: "high" };
  }
  if (candidate.district && DISTRICT_AREA_MAP[candidate.district]) {
    return { areaName: DISTRICT_AREA_MAP[candidate.district] ?? null, confidence: "medium" };
  }
  return { areaName: null, confidence: "low" };
}

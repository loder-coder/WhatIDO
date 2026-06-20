import { formatSeoulIso } from "../../utils/dates.js";
import type { Intent } from "../../utils/dates.js";
import type { RankedRecommendation } from "./recommendationTypes.js";

export function createFallbackRecommendations(intent: Intent): RankedRecommendation[] {
  const fetchedAt = formatSeoulIso(new Date());
  const title =
    intent === "weekend"
      ? "무료 실내 전시 또는 공공 박물관 카테고리"
      : "가까운 실내 공공시설 카테고리";
  return [
    {
      id: `fallback-${intent}-indoor-public`,
      rank: 1,
      title,
      category: "category_suggestion",
      venue: "실제 장소 확인 필요",
      district: "서울",
      address: null,
      latitude: null,
      longitude: null,
      is_indoor: true,
      is_free: null,
      price_text: "가격 확인 필요",
      distance_km: null,
      estimated_travel_minutes: null,
      congestion: {
        level: "unknown",
        score: 60,
        confidence: "low"
      },
      weather_fit: {
        score: 70,
        reason: "실제 후보가 없어 실내 공공 카테고리만 제안합니다."
      },
      score: 50,
      score_components: {
        distance: 50,
        weather: 70,
        free: 40,
        congestion: 60,
        time: 70
      },
      reason_codes: ["congestion_unknown", "price_unknown"],
      explanation:
        "조건에 맞는 실제 장소 후보를 찾지 못해 카테고리만 제안합니다. 가격과 혼잡도는 확인 불가이며 무료로 간주하지 않았습니다.",
      source: {
        provider: "fallback",
        url: null,
        fetched_at: fetchedAt
      }
    }
  ];
}

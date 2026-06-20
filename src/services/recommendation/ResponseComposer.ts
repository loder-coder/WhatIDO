import type { ActivityCandidate } from "../events/eventTypes.js";
import type { CongestionResult } from "../congestion/congestionTypes.js";
import type { DistanceResult } from "../location/locationTypes.js";
import type { WeatherSnapshot } from "../weather/weatherTypes.js";
import type { RankedRecommendation, ReasonCode, ScoreResult } from "./recommendationTypes.js";

function getWeatherReason(weather: WeatherSnapshot, candidate: ActivityCandidate): string {
  if (weather.recommendationBias === "unknown") {
    return "날씨 정보는 확인 불가라 날씨 적합성은 중립으로 반영했습니다.";
  }
  if (weather.precipitationProbability !== null && weather.precipitationProbability >= 60) {
    return candidate.environment === "indoor" ? "비 예보가 있어 실내 활동에 적합합니다." : "비 예보가 있어 야외 활동은 주의가 필요합니다.";
  }
  if (weather.discomfortIndex !== null && weather.discomfortIndex >= 80) {
    return candidate.environment === "indoor" ? "불쾌지수가 높아 실내 활동에 적합합니다." : "불쾌지수가 높아 야외 체류 부담이 있습니다.";
  }
  return candidate.environment === "outdoor" ? "날씨가 비교적 야외 활동에 무리가 없습니다." : "날씨 부담이 크지 않아 방문하기 좋습니다.";
}

export function composeExplanation(input: {
  readonly candidate: ActivityCandidate;
  readonly weather: WeatherSnapshot;
  readonly distance: DistanceResult;
  readonly congestion: CongestionResult;
  readonly reasonCodes: readonly ReasonCode[];
}): string {
  const weather = getWeatherReason(input.weather, input.candidate);
  const distance =
    input.distance.estimatedMinutes !== null
      ? `이동은 ${input.distance.transportMode === "public_transit" ? "대중교통" : input.distance.transportMode} 기준 약 ${input.distance.estimatedMinutes}분입니다.`
      : "거리 정보는 확인 불가라 confidence를 낮췄습니다.";
  const price =
    input.candidate.priceType === "free"
      ? "무료로 확인된 활동입니다."
      : input.candidate.priceType === "unknown"
        ? "가격은 확인 필요하며 무료로 간주하지 않았습니다."
        : `비용은 ${input.candidate.priceText ?? "유료"}로 확인됩니다.`;
  const congestion =
    input.congestion.level === "unknown"
      ? "혼잡도 정보는 현재 확인하지 못했습니다."
      : `혼잡도는 ${input.congestion.level} 수준으로 반영했습니다.`;
  return `${weather} ${price} ${distance} ${congestion}`;
}

export function toRankedRecommendation(input: {
  readonly rank: number;
  readonly candidate: ActivityCandidate;
  readonly weather: WeatherSnapshot;
  readonly distance: DistanceResult;
  readonly congestion: CongestionResult;
  readonly score: ScoreResult;
}): RankedRecommendation {
  return {
    id: input.candidate.id,
    rank: input.rank,
    title: input.candidate.title,
    category: input.candidate.category,
    venue: input.candidate.venue,
    district: input.candidate.district,
    address: input.candidate.address,
    latitude: input.candidate.coordinates?.latitude ?? null,
    longitude: input.candidate.coordinates?.longitude ?? null,
    is_indoor: input.candidate.environment === null ? null : input.candidate.environment === "indoor",
    is_free: input.candidate.isFree,
    price_text: input.candidate.priceText,
    distance_km: input.distance.distanceKm,
    estimated_travel_minutes: input.distance.estimatedMinutes,
    congestion: {
      level: input.congestion.level,
      score: input.congestion.score,
      confidence: input.congestion.confidence
    },
    weather_fit: {
      score: input.score.components.weather,
      reason: getWeatherReason(input.weather, input.candidate)
    },
    score: input.score.score,
    score_components: input.score.components,
    reason_codes: input.score.reasonCodes,
    explanation: composeExplanation({
      candidate: input.candidate,
      weather: input.weather,
      distance: input.distance,
      congestion: input.congestion,
      reasonCodes: input.score.reasonCodes
    }),
    source: {
      provider: input.candidate.source.provider,
      url: input.candidate.source.url,
      fetched_at: input.candidate.source.fetchedAt
    }
  };
}

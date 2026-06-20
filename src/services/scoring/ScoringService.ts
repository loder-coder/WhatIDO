import type { Intent } from "../../utils/dates.js";
import type { ActivityCandidate } from "../events/eventTypes.js";
import type { CongestionResult, Confidence } from "../congestion/congestionTypes.js";
import type { DistanceResult } from "../location/locationTypes.js";
import type { WeatherSnapshot } from "../weather/weatherTypes.js";
import type { ReasonCode, ScoreComponents, ScoreResult } from "../recommendation/recommendationTypes.js";
import { INTENT_WEIGHTS } from "./scoringRules.js";

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Number(score.toFixed(1))));
}

export class ScoringService {
  scoreDistance(intent: Intent, estimatedMinutes: number | null): number {
    if (estimatedMinutes === null) return 50;
    const decay = intent === "today" ? 1.4 : intent === "tomorrow" ? 1.0 : 0.7;
    return clampScore(100 - estimatedMinutes * decay);
  }

  scoreWeather(candidate: ActivityCandidate, weather: WeatherSnapshot): number {
    const isIndoor = candidate.environment === "indoor";
    const isOutdoor = candidate.environment === "outdoor";
    if (weather.precipitationProbability !== null && weather.precipitationProbability >= 60) {
      return isIndoor ? 100 : isOutdoor ? 30 : 70;
    }
    if (weather.discomfortIndex !== null && weather.discomfortIndex >= 80) {
      return isIndoor ? 100 : isOutdoor ? 20 : 60;
    }
    if (
      weather.temperatureC !== null &&
      weather.temperatureC >= 18 &&
      weather.temperatureC <= 26 &&
      (weather.precipitationProbability === null || weather.precipitationProbability < 30)
    ) {
      return isOutdoor ? 100 : 80;
    }
    return 70;
  }

  scoreFree(candidate: ActivityCandidate): number {
    if (candidate.priceType === "free") return 100;
    if (candidate.priceType === "unknown") return 40;
    const text = candidate.priceText ?? "";
    const match = text.replace(/,/g, "").match(/(\d+)\s*원/);
    if (!match) return 50;
    const price = Number(match[1]);
    if (price <= 10000) return 80;
    if (price <= 30000) return 50;
    return 25;
  }

  scoreTime(candidate: ActivityCandidate, intent: Intent, now: Date): number {
    if (!candidate.endTime || intent !== "today") return candidate.endTime ? 100 : 70;
    const dateText = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);
    const endAt = new Date(`${dateText}T${candidate.endTime}:00+09:00`);
    const minutesRemaining = (endAt.getTime() - now.getTime()) / 60000;
    if (minutesRemaining <= 0) return 0;
    if (minutesRemaining < 60) return 30;
    if (minutesRemaining < 120) return 70;
    return 100;
  }

  scoreCandidate(input: {
    readonly intent: Intent;
    readonly candidate: ActivityCandidate;
    readonly weather: WeatherSnapshot;
    readonly distance: DistanceResult;
    readonly congestion: CongestionResult;
    readonly lowCrowdPreferred: boolean;
    readonly now?: Date;
  }): ScoreResult {
    const components: ScoreComponents = {
      distance: this.scoreDistance(input.intent, input.distance.estimatedMinutes),
      weather: this.scoreWeather(input.candidate, input.weather),
      free: this.scoreFree(input.candidate),
      congestion: input.congestion.score,
      time: this.scoreTime(input.candidate, input.intent, input.now ?? new Date())
    };
    const weights = INTENT_WEIGHTS[input.intent];
    let score =
      components.distance * weights.distance +
      components.weather * weights.weather +
      components.congestion * weights.congestion +
      components.free * weights.free +
      components.time * weights.time;
    const penalties: string[] = [];
    const reasonCodes: ReasonCode[] = [];

    if (input.candidate.environment === "indoor") reasonCodes.push("indoor");
    if (components.weather >= 80) reasonCodes.push("weather_fit");
    if (input.weather.precipitationProbability !== null && input.weather.precipitationProbability >= 60 && input.candidate.environment === "outdoor") {
      score -= 25;
      penalties.push("rain_outdoor_penalty");
      reasonCodes.push("rain_risk");
    }
    if (input.weather.discomfortIndex !== null && input.weather.discomfortIndex >= 80 && input.candidate.environment === "outdoor") {
      score -= 20;
      penalties.push("discomfort_outdoor_penalty");
      reasonCodes.push("high_discomfort");
    }
    if (input.candidate.requiresReservation && input.intent === "today") {
      score -= 15;
      penalties.push("reservation_today_penalty");
      reasonCodes.push("reservation_required");
    }
    if (input.lowCrowdPreferred && input.congestion.score <= 30) {
      score -= 10;
      penalties.push("low_crowd_preference_penalty");
    }
    if (components.time === 30) {
      score -= 30;
      penalties.push("ending_soon_penalty");
    }
    if (input.candidate.priceType === "unknown") {
      score -= 5;
      penalties.push("price_unknown_penalty");
    }
    if (input.candidate.priceType === "free") reasonCodes.push("free");
    if (input.candidate.priceType === "paid") reasonCodes.push("paid");
    if (input.candidate.priceType === "unknown") reasonCodes.push("price_unknown");
    if (input.distance.distanceKm === null) reasonCodes.push("far");
    else if (input.distance.distanceKm <= 5) reasonCodes.push("nearby");
    else if (input.distance.distanceKm <= 15) reasonCodes.push("reasonable_distance");
    else reasonCodes.push("far");
    if (input.congestion.level === "unknown") reasonCodes.push("congestion_unknown");
    else if (input.congestion.score >= 80) reasonCodes.push("low_congestion");
    else if (input.congestion.score <= 30) reasonCodes.push("high_congestion");
    reasonCodes.push("time_fit");

    const confidence: Confidence =
      input.distance.confidence === "low" || input.congestion.confidence === "low" || input.weather.recommendationBias === "unknown"
        ? "low"
        : input.congestion.confidence === "medium" || input.distance.confidence === "medium"
          ? "medium"
          : "high";
    return {
      score: clampScore(score),
      components,
      penalties,
      reasonCodes: Array.from(new Set(reasonCodes)),
      confidence
    };
  }
}

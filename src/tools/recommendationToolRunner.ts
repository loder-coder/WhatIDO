import type { ToolContextFactoryDependencies } from "../server/toolContext.js";
import { createToolContext } from "../server/toolContext.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
import { getIntentDateWindow, type Intent } from "../utils/dates.js";
import { isSeoulDistrict } from "../utils/geo.js";
import type { RecommendationToolInput } from "./schemas.js";
import {
  createErrorEnvelope,
  createSuccessEnvelope,
  createWarning,
  toMcpTextResponse
} from "./toolResponse.js";
import type { TransportMode } from "../services/location/locationTypes.js";
import { createFallbackRecommendations } from "../services/recommendation/fallbackRecommendations.js";

export async function runRecommendationTool(
  intent: Intent,
  input: RecommendationToolInput,
  dependencies: ToolContextFactoryDependencies
) {
  const context = createToolContext(dependencies);
  context.logger.info({ tool: `${intent}_what_to_do` }, "MCP tool invoked");

  try {
    const now = input.requestedAt ? new Date(input.requestedAt) : new Date();
    const window = getIntentDateWindow(intent, now);
    const locationInput = input.location ?? {};
    const resolvedLocation = context.services.location.resolveLocation(locationInput);
    const warnings = [];
    const missingData: string[] = [];
    const locationLabel = resolvedLocation.district ?? locationInput.place_name ?? "서울";
    if (!resolvedLocation.coordinates) {
      warnings.push(createWarning(ERROR_CODES.LOCATION_MISSING));
      missingData.push("location");
    }
    if (resolvedLocation.district && !isSeoulDistrict(resolvedLocation.district)) {
      warnings.push(createWarning(ERROR_CODES.LOCATION_UNSUPPORTED));
    }

    let weather = context.services.weather.getNeutralWeatherSnapshot();
    if (resolvedLocation.coordinates) {
      try {
        weather = await context.services.weather.getWeatherSnapshot({
          mode: intent,
          location: resolvedLocation.coordinates,
          start: window.start,
          end: window.end
        });
      } catch {
        warnings.push(createWarning(ERROR_CODES.WEATHER_UNAVAILABLE));
        missingData.push("weather");
      }
    } else {
      warnings.push(createWarning(ERROR_CODES.WEATHER_UNAVAILABLE));
      missingData.push("weather");
    }

    const freePreferred = input.preferences?.free_preferred ?? input.freeOnly ?? /무료/.test(input.query ?? "");
    const lowCrowdPreferred = input.preferences?.low_crowd_preferred ?? /조용|사람 적|한적/.test(input.query ?? "");
    const candidates = await context.services.events.searchCandidates({
      start: window.start,
      end: window.end,
      district: resolvedLocation.district,
      freePreferred,
      intent,
      now
    });
    const transportMode: TransportMode = input.preferences?.transport_mode ?? "public_transit";
    const distances = context.services.location.calculateDistances(
      resolvedLocation.coordinates,
      candidates.map((candidate) => ({ id: candidate.id, coordinates: candidate.coordinates })),
      transportMode
    );
    const congestion = await context.services.congestion.enrichCandidates(candidates);
    if ([...congestion.values()].some((item) => item.level === "unknown")) {
      warnings.push(createWarning(ERROR_CODES.CONGESTION_UNAVAILABLE));
      missingData.push("congestion");
    }
    let recommendations = context.services.recommendation.rank({
      intent,
      resultLimit: Math.min(input.result_limit ?? 3, 5),
      freePreferred,
      lowCrowdPreferred,
      weather,
      candidates,
      distances,
      congestion
    });
    if (recommendations.length === 0) {
      warnings.push(createWarning(ERROR_CODES.NO_CANDIDATES, "조건에 맞는 후보가 없어 결과가 비어 있습니다. 무료/거리/실내 조건을 완화해 보세요."));
      recommendations = createFallbackRecommendations(intent);
      missingData.push("candidates");
    }
    return toMcpTextResponse(
      createSuccessEnvelope({
        intent,
        requestId: context.requestId,
        window,
        locationLabel,
        weather,
        recommendations,
        warnings,
        missingData: Array.from(new Set(missingData)),
        extra: getIntentExtra(intent, weather.risk)
      })
    );
  } catch (error) {
    return toMcpTextResponse(createErrorEnvelope({ intent, requestId: context.requestId, error }));
  }
}

function getIntentExtra(intent: Intent, weatherRisk: string) {
  if (intent === "today") {
    return {
      today_constraints: {
        requires_open_now_or_later_today: true,
        reservation_penalty_applied: true,
        distance_priority: "high"
      }
    };
  }
  if (intent === "tomorrow") {
    return {
      tomorrow_plan: {
        recommended_time_of_day: "afternoon",
        weather_risk: weatherRisk,
        reservation_risk: "medium"
      }
    };
  }
  const weekendPlan = {
    best_day: "weather_dependent",
    plan_b_recommended: weatherRisk === "rain" || weatherRisk === "heat" || weatherRisk === "high_discomfort",
    free_priority: "high"
  };
  return {
    weekend_plan: {
      ...weekendPlan
    },
    weekend_summary: weekendPlan
  };
}

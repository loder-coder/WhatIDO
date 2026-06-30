import { AppError, toAppError } from "../errors/AppError.js";
import { ERROR_CODES, USER_ERROR_MESSAGES, type ErrorCode, type UserFacingError } from "../errors/errorCodes.js";
import type { Intent, DateWindow } from "../utils/dates.js";
import { formatSeoulIso } from "../utils/dates.js";
import type { RankedRecommendation } from "../services/recommendation/recommendationTypes.js";
import type { WeatherSnapshot } from "../services/weather/weatherTypes.js";

export type ToolStatus = "success" | "partial_success" | "needs_location" | "error";

export interface ToolEnvelope {
  readonly status: ToolStatus;
  readonly intent: Intent;
  readonly summary: {
    readonly location_label: string;
    readonly time_window: {
      readonly start: string;
      readonly end: string;
    };
    readonly weather: {
      readonly temperature_c: number | null;
      readonly humidity_percent: number | null;
      readonly precipitation_probability: number | null;
      readonly discomfort_index: number | null;
      readonly discomfort_level: string;
      readonly recommendation_bias: string;
    };
    readonly recommendation_direction: string;
    readonly overview: string;
  };
  readonly recommendations: readonly RankedRecommendation[];
  readonly warnings: readonly UserFacingError[];
  readonly missing_data: readonly string[];
  readonly metadata: {
    readonly request_id: string;
    readonly generated_at: string;
    readonly data_freshness: Record<string, string>;
    readonly mock_data: {
      readonly enabled: boolean;
      readonly notice: string | null;
      readonly weather_scenario: string | null;
    };
  };
  readonly today_constraints?: Record<string, unknown>;
  readonly tomorrow_plan?: Record<string, unknown>;
  readonly weekend_plan?: Record<string, unknown>;
  readonly weekend_summary?: Record<string, unknown>;
}

export function createWarning(code: ErrorCode, message = USER_ERROR_MESSAGES[code]): UserFacingError {
  return { code, message };
}

export function createErrorEnvelope(input: {
  readonly intent: Intent;
  readonly requestId: string;
  readonly error: unknown;
}): ToolEnvelope {
  const appError = toAppError(input.error, ERROR_CODES.PROVIDER_ERROR);
  const now = new Date();
  return {
    status: "error",
    intent: input.intent,
    summary: {
      location_label: "서울",
      time_window: { start: formatSeoulIso(now), end: formatSeoulIso(now) },
      weather: {
        temperature_c: null,
        humidity_percent: null,
        precipitation_probability: null,
        discomfort_index: null,
        discomfort_level: "unknown",
        recommendation_bias: "unknown"
      },
      overview: "추천을 준비하지 못했습니다.",
      recommendation_direction: "입력 또는 외부 데이터 오류로 추천을 생성하지 못했습니다."
    },
    recommendations: [],
    warnings: [createWarning(appError.code, appError.userMessage)],
    missing_data: [],
    metadata: {
      request_id: input.requestId,
      generated_at: formatSeoulIso(now),
      data_freshness: {},
      mock_data: { enabled: false, notice: null, weather_scenario: null }
    }
  };
}

export function createNeedsLocationEnvelope(input: {
  readonly intent: Intent;
  readonly requestId: string;
  readonly window: DateWindow;
}): ToolEnvelope {
  return {
    status: "needs_location",
    intent: input.intent,
    summary: {
      location_label: "위치 확인 필요",
      time_window: { start: formatSeoulIso(input.window.start), end: formatSeoulIso(input.window.end) },
      weather: {
        temperature_c: null,
        humidity_percent: null,
        precipitation_probability: null,
        discomfort_index: null,
        discomfort_level: "unknown",
        recommendation_bias: "unknown"
      },
      overview: "서울 내 구체적인 동이나 구를 알려주시면 위치에 맞춰 추천해드릴게요.",
      recommendation_direction: "예: 강남구, 홍대, 잠실 또는 현재 좌표"
    },
    recommendations: [],
    warnings: [createWarning(ERROR_CODES.LOCATION_MISSING)],
    missing_data: ["location"],
    metadata: {
      request_id: input.requestId,
      generated_at: formatSeoulIso(new Date()),
      data_freshness: {},
      mock_data: { enabled: false, notice: null, weather_scenario: null }
    }
  };
}

export function createSuccessEnvelope(input: {
  readonly intent: Intent;
  readonly requestId: string;
  readonly window: DateWindow;
  readonly locationLabel: string;
  readonly weather: WeatherSnapshot;
  readonly recommendations: readonly RankedRecommendation[];
  readonly warnings: readonly UserFacingError[];
  readonly missingData: readonly string[];
  readonly isMockData: boolean;
  readonly mockWeatherScenario: string | undefined;
    readonly extra?: Partial<Pick<ToolEnvelope, "today_constraints" | "tomorrow_plan" | "weekend_plan" | "weekend_summary">>;
}): ToolEnvelope {
  const status: ToolStatus =
    input.warnings.length > 0 || input.missingData.length > 0 ? "partial_success" : "success";
  return {
    status,
    intent: input.intent,
    summary: {
      location_label: input.locationLabel,
      time_window: {
        start: formatSeoulIso(input.window.start),
        end: formatSeoulIso(input.window.end)
      },
      weather: {
        temperature_c: input.weather.temperatureC,
        humidity_percent: input.weather.humidityPercent,
        precipitation_probability: input.weather.precipitationProbability,
        discomfort_index: input.weather.discomfortIndex,
        discomfort_level: input.weather.discomfortLevel,
        recommendation_bias: input.weather.recommendationBias
      },
      recommendation_direction: getRecommendationDirection(input.weather.recommendationBias, input.intent),
      overview: buildNaturalLanguageOverview(input.locationLabel, input.weather, input.intent)
    },
    recommendations: input.recommendations,
    warnings: input.warnings,
    missing_data: input.missingData,
    metadata: {
      request_id: input.requestId,
      generated_at: formatSeoulIso(new Date()),
      data_freshness: {
        weather: input.isMockData ? "mock" : input.weather.source.provider === "fallback" ? "missing" : input.weather.source.cached ? "cached" : "fresh",
        events: input.missingData.includes("events") ? "missing" : input.isMockData ? "mock" : "fresh",
        congestion: input.missingData.includes("congestion") ? "missing" : input.isMockData ? "mock" : "fresh"
      },
      mock_data: {
        enabled: input.isMockData,
        notice: input.isMockData
          ? "\uD604\uC7AC \uACB0\uACFC\uB294 \uB370\uBAA8\uC6A9 \uBAA9\uC5C5 \uB370\uC774\uD130\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uB0A0\uC528\u00B7\uD589\uC0AC\u00B7\uD63C\uC7A1\uB3C4 \uC815\uBCF4\uAC00 \uC544\uB2D9\uB2C8\uB2E4."
          : null,
        weather_scenario: input.isMockData ? input.mockWeatherScenario ?? "intent_default" : null
      }
    },
    ...input.extra
  };
}

function getRecommendationDirection(bias: string, intent: Intent): string {
  if (bias === "indoor") return "날씨 부담을 줄이기 위해 실내 활동을 우선했습니다.";
  if (bias === "outdoor") return "쾌적한 날씨를 활용할 수 있는 야외 활동도 반영했습니다.";
  if (intent === "weekend") return "주말은 무료 여부와 날씨 안정성을 더 강하게 반영했습니다.";
  return "날씨, 거리, 무료 여부, 혼잡도를 균형 있게 반영했습니다.";
}

function buildNaturalLanguageOverview(location: string, weather: WeatherSnapshot, intent: Intent): string {
  const day = intent === "today" ? "오늘" : intent === "tomorrow" ? "내일" : "다가오는 주말";
  if (weather.temperatureC === null) {
    return `${day} ${location}의 날씨는 확인하지 못해, 행사 일정과 비용·혼잡도 정보를 중심으로 추천했습니다.`;
  }
  const rain = weather.precipitationProbability !== null && weather.precipitationProbability >= 60;
  const condition = rain ? "비 예보가 있어 실내 활동을 우선했습니다" : weather.recommendationBias === "outdoor" ? "야외 활동에 비교적 적합합니다" : "날씨 부담을 줄이는 활동을 우선했습니다";
  return `${day} ${location}은 ${weather.temperatureC}°C이며 ${condition}.`;
}

export function toMcpTextResponse(response: ToolEnvelope) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(response, null, 2)
      }
    ]
  };
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

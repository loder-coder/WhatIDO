import { describe, expect, it } from "vitest";
import { AppError } from "../../../src/errors/AppError.js";
import { ERROR_CODES } from "../../../src/errors/errorCodes.js";
import { createFallbackRecommendations } from "../../../src/services/recommendation/fallbackRecommendations.js";
import { withRetry, withTimeout } from "../../../src/utils/timeout.js";
import { createErrorEnvelope, createSuccessEnvelope, createWarning } from "../../../src/tools/toolResponse.js";
import type { WeatherSnapshot } from "../../../src/services/weather/weatherTypes.js";

const neutralWeather: WeatherSnapshot = {
  temperatureC: null,
  humidityPercent: null,
  precipitationProbability: null,
  precipitationType: "unknown",
  sky: null,
  windSpeedMs: null,
  discomfortIndex: null,
  discomfortLevel: "unknown",
  recommendationBias: "unknown",
  risk: "unknown",
  source: { provider: "mock", fetchedAt: "2026-06-20T10:00:00+09:00", cached: false }
};

describe("Error handling", () => {
  it("turns timeout into typed AppError", async () => {
    await expect(withTimeout(new Promise((resolve) => setTimeout(resolve, 20)), 1)).rejects.toMatchObject({
      code: ERROR_CODES.TIMEOUT,
      retryable: true
    });
  });

  it("retries retryable errors once but not auth errors", async () => {
    let calls = 0;
    await expect(
      withRetry(
        async () => {
          calls += 1;
          throw new AppError({ code: ERROR_CODES.AUTH_ERROR, retryable: false });
        },
        (error) => error instanceof AppError && error.retryable,
        1
      )
    ).rejects.toMatchObject({ code: ERROR_CODES.AUTH_ERROR });
    expect(calls).toBe(1);
  });

  it("creates partial_success envelope with warnings and missing data", () => {
    const envelope = createSuccessEnvelope({
      intent: "today",
      requestId: "req-1",
      window: {
        start: new Date("2026-06-20T10:00:00+09:00"),
        end: new Date("2026-06-20T23:59:59+09:00")
      },
      locationLabel: "서울",
      weather: neutralWeather,
      recommendations: [],
      warnings: [createWarning(ERROR_CODES.CONGESTION_UNAVAILABLE)],
      missingData: ["congestion"]
    });
    expect(envelope.status).toBe("partial_success");
    expect(envelope.missing_data).toContain("congestion");
  });

  it("creates sanitized error envelope without stack or secrets", () => {
    const envelope = createErrorEnvelope({
      intent: "today",
      requestId: "req-1",
      error: new AppError({
        code: ERROR_CODES.PROVIDER_ERROR,
        message: "failed with serviceKey=SECRET",
        userMessage: "외부 데이터 제공처 응답을 처리하지 못했습니다."
      })
    });
    const serialized = JSON.stringify(envelope);
    expect(serialized).not.toContain("SECRET");
    expect(serialized).not.toContain("stack");
  });

  it("creates no-candidate fallback without inventing a source URL", () => {
    const fallback = createFallbackRecommendations("weekend");
    expect(fallback[0]?.source.url).toBeNull();
    expect(fallback[0]?.venue).toBe("실제 장소 확인 필요");
    expect(fallback[0]?.explanation).toContain("카테고리");
  });
});

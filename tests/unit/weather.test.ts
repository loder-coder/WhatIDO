import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env.js";
import { calculateDiscomfortIndex, classifyDiscomfortIndex } from "../../src/services/weather/discomfortIndex.js";
import { convertWgs84ToKmaGrid } from "../../src/services/weather/kmaGrid.js";
import { parseUltraSrtNcstResponse, parseVilageFcstResponse } from "../../src/services/weather/kmaParser.js";
import { WeatherService } from "../../src/services/weather/WeatherService.js";
import { classifyWeatherSuitability } from "../../src/services/weather/weatherSuitability.js";
import { mockUltraSrtNcstResponse, mockVilageFcstResponse } from "../../src/services/weather/weatherFixtures.js";

describe("Weather Service Phase 2", () => {
  it("converts Seoul coordinates to KMA grid", () => {
    expect(convertWgs84ToKmaGrid(37.5665, 126.978)).toEqual({ nx: 60, ny: 127 });
  });

  it("rejects invalid coordinates", () => {
    expect(() => convertWgs84ToKmaGrid(10, 10)).toThrow();
  });

  it("calculates discomfort index and levels", () => {
    const result = calculateDiscomfortIndex(34, 68);

    expect(result.value).toBeGreaterThan(86);
    expect(result.value).toBeLessThan(88);
    expect(result.level).toBe("very_high");
    expect(classifyDiscomfortIndex(null)).toBe("unknown");
    expect(classifyDiscomfortIndex(66)).toBe("low");
    expect(classifyDiscomfortIndex(72)).toBe("moderate");
    expect(classifyDiscomfortIndex(78)).toBe("high");
    expect(classifyDiscomfortIndex(81)).toBe("very_high");
  });

  it("classifies indoor and outdoor weather suitability", () => {
    expect(
      classifyWeatherSuitability({
        temperatureC: 24,
        humidityPercent: 50,
        precipitationProbability: 20,
        precipitationType: "none",
        discomfortIndex: calculateDiscomfortIndex(24, 50)
      }).bias
    ).toBe("outdoor");

    expect(
      classifyWeatherSuitability({
        temperatureC: 27,
        humidityPercent: 70,
        precipitationProbability: 60,
        precipitationType: "rain",
        discomfortIndex: calculateDiscomfortIndex(27, 70)
      }).bias
    ).toBe("indoor");

    expect(
      classifyWeatherSuitability({
        temperatureC: 34,
        humidityPercent: 68,
        precipitationProbability: 20,
        precipitationType: "none",
        discomfortIndex: calculateDiscomfortIndex(34, 68)
      }).bias
    ).toBe("indoor");
  });

  it("parses KMA fixture responses", () => {
    expect(parseUltraSrtNcstResponse(mockUltraSrtNcstResponse)).toMatchObject({
      temperatureC: 34,
      humidityPercent: 68,
      precipitationType: "none"
    });

    expect(parseVilageFcstResponse(mockVilageFcstResponse)).toMatchObject({
      temperatureC: 24,
      humidityPercent: 55,
      precipitationProbability: 20,
      precipitationType: "none",
      skyCondition: "clear"
    });
  });

  it("returns WeatherSnapshot in mock mode", async () => {
    const config = loadEnv({
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      MOCK_PROVIDERS: "true"
    });
    const service = new WeatherService({ config });

    const snapshot = await service.getWeather({
      intent: "today",
      latitude: 37.5665,
      longitude: 126.978,
      now: new Date("2026-06-19T14:50:00+09:00")
    });

    expect(snapshot.temperatureC).toBe(34);
    expect(snapshot.discomfortIndex.level).toBe("very_high");
    expect(snapshot.suitability.bias).toBe("indoor");
    expect(snapshot.source.isMock).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { InMemoryCache } from "../../../src/services/cache/InMemoryCache.js";
import { calculateDiscomfortIndex, classifyDiscomfortLevel } from "../../../src/services/weather/discomfortIndex.js";
import { classifyWeatherBias } from "../../../src/services/weather/weatherFit.js";
import { convertWgs84ToKmaGrid } from "../../../src/services/weather/kmaGrid.js";
import { KmaWeatherProvider, parseKmaResponse } from "../../../src/services/weather/KmaWeatherProvider.js";
import { WeatherService } from "../../../src/services/weather/WeatherService.js";

describe("Weather intelligence", () => {
  it("calculates discomfort index and classifies boundaries", () => {
    expect(calculateDiscomfortIndex(34, 68)).toBeGreaterThan(82);
    expect(classifyDiscomfortLevel(67.9)).toBe("low");
    expect(classifyDiscomfortLevel(68)).toBe("moderate");
    expect(classifyDiscomfortLevel(75)).toBe("high");
    expect(classifyDiscomfortLevel(80)).toBe("very_high");
    expect(classifyDiscomfortLevel(null)).toBe("unknown");
  });

  it("classifies weather bias for rain, heat discomfort, and comfortable weather", () => {
    expect(
      classifyWeatherBias({
        temperatureC: 23,
        precipitationProbability: 70,
        discomfortIndex: 70
      })
    ).toBe("indoor");
    expect(
      classifyWeatherBias({
        temperatureC: 34,
        precipitationProbability: 20,
        discomfortIndex: 83
      })
    ).toBe("indoor");
    expect(
      classifyWeatherBias({
        temperatureC: 22,
        precipitationProbability: 10,
        discomfortIndex: 66
      })
    ).toBe("outdoor");
  });

  it("converts Seoul WGS84 coordinates to KMA grid near expected range", () => {
    const grid = convertWgs84ToKmaGrid({ latitude: 37.5145, longitude: 127.1059 });
    expect(grid.nx).toBeGreaterThanOrEqual(60);
    expect(grid.nx).toBeLessThanOrEqual(64);
    expect(grid.ny).toBeGreaterThanOrEqual(124);
    expect(grid.ny).toBeLessThanOrEqual(128);
  });

  it("parses KMA fixture response defensively", () => {
    const parsed = parseKmaResponse({
      response: {
        body: {
          items: {
            item: [
              { category: "T1H", obsrValue: "34" },
              { category: "REH", obsrValue: "68" },
              { category: "PTY", obsrValue: "0" },
              { category: "WSD", obsrValue: "1.2" }
            ]
          }
        }
      }
    });
    expect(parsed.temperatureC).toBe(34);
    expect(parsed.humidityPercent).toBe(68);
    expect(parsed.precipitationType).toBe("none");
  });

  it("returns a WeatherSnapshot in mock mode", async () => {
    const service = new WeatherService(
      new KmaWeatherProvider({
        NODE_ENV: "test",
        LOG_LEVEL: "silent",
        MOCK_PROVIDERS: true,
        CACHE_BACKEND: "memory",
        PORT: 3000
      }),
      new InMemoryCache()
    );
    const snapshot = await service.getWeatherSnapshot({
      mode: "today",
      location: { latitude: 37.5145, longitude: 127.1059 },
      start: new Date("2026-06-20T12:00:00+09:00"),
      end: new Date("2026-06-20T23:59:59+09:00")
    });
    expect(snapshot.temperatureC).toBe(34);
    expect(snapshot.discomfortLevel).toBe("very_high");
    expect(snapshot.recommendationBias).toBe("indoor");
  });
});

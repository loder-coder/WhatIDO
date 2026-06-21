import { describe, expect, it } from "vitest";
import { calculateDiscomfortIndex, classifyDiscomfortLevel } from "../../src/services/weather/discomfortIndex.js";
import { convertWgs84ToKmaGrid } from "../../src/services/weather/kmaGrid.js";
import { parseUltraSrtNcstResponse, parseVilageFcstResponse } from "../../src/services/weather/kmaParser.js";
import { classifyWeatherSuitability } from "../../src/services/weather/weatherSuitability.js";
import { mockUltraSrtNcstResponse, mockVilageFcstResponse } from "../../src/services/weather/weatherFixtures.js";

describe("Weather compatibility parsers", () => {
  it("converts Seoul coordinates to a KMA grid", () => {
    expect(convertWgs84ToKmaGrid({ latitude: 37.5665, longitude: 126.978 })).toEqual({ nx: 60, ny: 127 });
  });

  it("calculates and classifies discomfort boundaries", () => {
    expect(calculateDiscomfortIndex(34, 68)).toBeGreaterThan(82);
    expect(classifyDiscomfortLevel(81)).toBe("very_high");
    expect(classifyDiscomfortLevel(null)).toBe("unknown");
  });

  it("classifies rain and high-discomfort conditions as indoor", () => {
    const discomfortIndex = { value: 83, level: "very_high" as const };
    expect(
      classifyWeatherSuitability({
        temperatureC: 34,
        humidityPercent: 68,
        precipitationProbability: 60,
        precipitationType: "rain",
        discomfortIndex
      }).bias
    ).toBe("indoor");
  });

  it("parses KMA current and forecast fixtures defensively", () => {
    expect(parseUltraSrtNcstResponse(mockUltraSrtNcstResponse)).toMatchObject({
      temperatureC: 34,
      humidityPercent: 68,
      precipitationType: "none"
    });
    expect(parseVilageFcstResponse(mockVilageFcstResponse)).toMatchObject({
      temperatureC: 24,
      humidityPercent: 55,
      precipitationProbability: 20,
      skyCondition: "clear"
    });
  });
});

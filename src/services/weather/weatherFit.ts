import type { RecommendationBias, WeatherRisk } from "./weatherTypes.js";
import { classifyDiscomfortLevel } from "./discomfortIndex.js";

export interface WeatherFitInput {
  readonly temperatureC: number | null;
  readonly precipitationProbability: number | null;
  readonly discomfortIndex: number | null;
}

export function classifyWeatherBias(input: WeatherFitInput): RecommendationBias {
  if (input.precipitationProbability !== null && input.precipitationProbability >= 60) {
    return "indoor";
  }
  const discomfort = classifyDiscomfortLevel(input.discomfortIndex);
  if (discomfort === "high" || discomfort === "very_high") {
    return "indoor";
  }
  if (
    input.temperatureC !== null &&
    input.temperatureC >= 18 &&
    input.temperatureC <= 26 &&
    (input.precipitationProbability === null || input.precipitationProbability < 30)
  ) {
    return "outdoor";
  }
  return "mixed";
}

export function classifyWeatherRisk(input: WeatherFitInput): WeatherRisk {
  if (input.precipitationProbability !== null && input.precipitationProbability >= 60) {
    return "rain";
  }
  if (input.temperatureC !== null && input.temperatureC >= 33) {
    return "heat";
  }
  if (input.temperatureC !== null && input.temperatureC <= -5) {
    return "cold";
  }
  const discomfort = classifyDiscomfortLevel(input.discomfortIndex);
  if (discomfort === "high" || discomfort === "very_high") {
    return "high_discomfort";
  }
  if (input.temperatureC === null && input.precipitationProbability === null) {
    return "unknown";
  }
  return "low";
}

import type { DiscomfortLevel, RecommendationBias } from "./weatherTypes.js";

export function calculateDiscomfortIndex(
  temperatureC: number | null,
  humidityPercent: number | null
): number | null {
  if (temperatureC === null || humidityPercent === null) {
    return null;
  }
  return Number(
    (0.81 * temperatureC + 0.01 * humidityPercent * (0.99 * temperatureC - 14.3) + 46.3).toFixed(1)
  );
}

export function classifyDiscomfortLevel(index: number | null): DiscomfortLevel {
  if (index === null) {
    return "unknown";
  }
  if (index < 68) {
    return "low";
  }
  if (index < 75) {
    return "moderate";
  }
  if (index < 80) {
    return "high";
  }
  return "very_high";
}

export function getDiscomfortBias(level: DiscomfortLevel): RecommendationBias {
  if (level === "high" || level === "very_high") {
    return "indoor";
  }
  if (level === "low") {
    return "outdoor";
  }
  if (level === "moderate") {
    return "mixed";
  }
  return "unknown";
}

import type {
  DiscomfortIndex,
  PrecipitationType,
  WeatherBias,
  WeatherRisk,
  WeatherSuitability
} from "./weatherTypes.js";

export interface WeatherSuitabilityInput {
  readonly temperatureC: number | null;
  readonly humidityPercent: number | null;
  readonly precipitationProbability: number | null;
  readonly precipitationType: PrecipitationType;
  readonly discomfortIndex: DiscomfortIndex;
}

export function classifyWeatherSuitability(
  input: WeatherSuitabilityInput
): WeatherSuitability {
  const reasons: string[] = [];
  let indoorScore = 70;
  let outdoorScore = 70;

  if (
    input.precipitationProbability !== null &&
    input.precipitationProbability >= 60
  ) {
    indoorScore = 100;
    outdoorScore = 30;
    reasons.push("강수 확률이 높아 실내 활동을 우선합니다.");
  }

  if (input.precipitationType !== "none" && input.precipitationType !== "unknown") {
    indoorScore = Math.max(indoorScore, 100);
    outdoorScore = Math.min(outdoorScore, 25);
    reasons.push("비 또는 눈 정보가 있어 야외 활동을 감점합니다.");
  }

  if (
    input.discomfortIndex.value !== null &&
    input.discomfortIndex.value >= 80
  ) {
    indoorScore = Math.max(indoorScore, 100);
    outdoorScore = Math.min(outdoorScore, 20);
    reasons.push("불쾌지수가 매우 높아 냉방 가능한 실내 활동에 적합합니다.");
  }

  if (
    input.temperatureC !== null &&
    input.temperatureC >= 18 &&
    input.temperatureC <= 26 &&
    (input.precipitationProbability === null || input.precipitationProbability < 30)
  ) {
    outdoorScore = Math.max(outdoorScore, 100);
    indoorScore = Math.max(indoorScore, 80);
    reasons.push("기온과 강수 조건이 쾌적해 야외 활동도 적합합니다.");
  }

  return {
    bias: resolveBias(indoorScore, outdoorScore),
    indoorScore,
    outdoorScore,
    reasons: reasons.length > 0 ? reasons : ["날씨 신호가 중립적입니다."]
  };
}

export function classifyWeatherRisk(
  input: WeatherSuitabilityInput
): WeatherRisk {
  const codes: string[] = [];

  if (
    input.precipitationProbability !== null &&
    input.precipitationProbability >= 60
  ) {
    codes.push("rain_likely");
  }
  if (
    input.discomfortIndex.value !== null &&
    input.discomfortIndex.value >= 80
  ) {
    codes.push("high_discomfort");
  }
  if (input.temperatureC !== null && input.temperatureC >= 33) {
    codes.push("heat");
  }
  if (input.temperatureC !== null && input.temperatureC <= -5) {
    codes.push("cold");
  }

  return {
    level: codes.length >= 2 ? "high" : codes.length === 1 ? "moderate" : "low",
    codes
  };
}

function resolveBias(indoorScore: number, outdoorScore: number): WeatherBias {
  if (Math.abs(indoorScore - outdoorScore) <= 10) {
    return "mixed";
  }
  return indoorScore > outdoorScore ? "indoor" : "outdoor";
}

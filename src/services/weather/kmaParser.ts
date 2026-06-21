import type {
  KmaApiResponse,
  KmaItem,
  PrecipitationType,
  SkyCondition
} from "./weatherTypes.js";

export interface ParsedWeatherValues {
  readonly baseDate: string;
  readonly baseTime: string;
  readonly temperatureC: number | null;
  readonly humidityPercent: number | null;
  readonly precipitationProbability: number | null;
  readonly precipitationType: PrecipitationType;
  readonly skyCondition: SkyCondition;
  readonly windSpeedMps: number | null;
}

export function parseUltraSrtNcstResponse(
  response: KmaApiResponse
): ParsedWeatherValues {
  const items = normalizeItems(response);

  return {
    baseDate: firstDefined(items.map((item) => item.baseDate)) ?? "",
    baseTime: firstDefined(items.map((item) => item.baseTime)) ?? "",
    temperatureC: numberFromCategory(items, "T1H", "obsrValue"),
    humidityPercent: numberFromCategory(items, "REH", "obsrValue"),
    precipitationProbability: null,
    precipitationType: parsePrecipitationType(
      stringFromCategory(items, "PTY", "obsrValue")
    ),
    skyCondition: "unknown",
    windSpeedMps: numberFromCategory(items, "WSD", "obsrValue")
  };
}

export function parseVilageFcstResponse(
  response: KmaApiResponse
): ParsedWeatherValues {
  const items = normalizeItems(response);

  return {
    baseDate: firstDefined(items.map((item) => item.baseDate)) ?? "",
    baseTime: firstDefined(items.map((item) => item.baseTime)) ?? "",
    temperatureC:
      numberFromCategory(items, "TMP", "fcstValue") ??
      numberFromCategory(items, "T1H", "fcstValue"),
    humidityPercent: numberFromCategory(items, "REH", "fcstValue"),
    precipitationProbability: numberFromCategory(items, "POP", "fcstValue"),
    precipitationType: parsePrecipitationType(
      stringFromCategory(items, "PTY", "fcstValue")
    ),
    skyCondition: parseSkyCondition(stringFromCategory(items, "SKY", "fcstValue")),
    windSpeedMps: numberFromCategory(items, "WSD", "fcstValue")
  };
}

export function normalizeItems(response: KmaApiResponse): readonly KmaItem[] {
  const rawItems = response.response?.body?.items?.item;
  if (!rawItems) {
    return [];
  }

  return Array.isArray(rawItems) ? rawItems : [rawItems];
}

function numberFromCategory(
  items: readonly KmaItem[],
  category: string,
  field: "obsrValue" | "fcstValue"
): number | null {
  const rawValue = stringFromCategory(items, category, field);
  if (rawValue === null) {
    return null;
  }

  const value = Number(rawValue);
  return Number.isFinite(value) ? value : null;
}

function stringFromCategory(
  items: readonly KmaItem[],
  category: string,
  field: "obsrValue" | "fcstValue"
): string | null {
  return items.find((item) => item.category === category)?.[field] ?? null;
}

function firstDefined(values: readonly (string | undefined)[]): string | null {
  return values.find((value): value is string => Boolean(value)) ?? null;
}

function parsePrecipitationType(rawValue: string | null): PrecipitationType {
  switch (rawValue) {
    case "0":
      return "none";
    case "1":
    case "5":
      return "rain";
    case "2":
    case "6":
      return "rain_snow";
    case "3":
    case "7":
      return "snow";
    case "4":
      return "shower";
    default:
      return "unknown";
  }
}

function parseSkyCondition(rawValue: string | null): SkyCondition {
  switch (rawValue) {
    case "1":
      return "clear";
    case "3":
      return "partly_cloudy";
    case "4":
      return "cloudy";
    default:
      return "unknown";
  }
}

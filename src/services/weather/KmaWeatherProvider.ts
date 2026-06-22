import { request } from "undici";
import type { AppConfig } from "../../config/env.js";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { withTimeout } from "../../utils/timeout.js";
import { formatSeoulIso } from "../../utils/dates.js";
import { convertWgs84ToKmaGrid } from "./kmaGrid.js";
import type { KmaForecastPoint, WeatherRequest } from "./weatherTypes.js";

interface KmaItem {
  readonly category?: string;
  readonly obsrValue?: string;
  readonly fcstValue?: string;
}

function parseNumber(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parsePrecipitationType(value: string | undefined): KmaForecastPoint["precipitationType"] {
  if (value === "0" || value === undefined) {
    return "none";
  }
  if (value === "1" || value === "5") {
    return "rain";
  }
  if (value === "2" || value === "6") {
    return "mixed";
  }
  if (value === "3" || value === "7") {
    return "snow";
  }
  return "unknown";
}

export function parseKmaItems(items: readonly KmaItem[]): KmaForecastPoint {
  const values = new Map<string, string>();
  for (const item of items) {
    if (item.category) {
      values.set(item.category, item.obsrValue ?? item.fcstValue ?? "");
    }
  }
  return {
    temperatureC: parseNumber(values.get("T1H") ?? values.get("TMP")),
    humidityPercent: parseNumber(values.get("REH")),
    precipitationProbability: parseNumber(values.get("POP")) ?? (parseNumber(values.get("RN1")) && 80),
    precipitationType: parsePrecipitationType(values.get("PTY")),
    sky: values.get("SKY") ?? null,
    windSpeedMs: parseNumber(values.get("WSD"))
  };
}

export class KmaWeatherProvider {
  constructor(private readonly config: AppConfig) {}

  async getWeather(requestInput: WeatherRequest): Promise<KmaForecastPoint> {
    if (this.config.MOCK_PROVIDERS || !this.config.KMA_SERVICE_KEY) {
      return this.getMockWeather(requestInput);
    }
    const grid = convertWgs84ToKmaGrid(requestInput.location);
    const baseUrl = this.config.KMA_BASE_URL ?? "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";
    const endpoint = requestInput.mode === "today" ? "getUltraSrtNcst" : "getVilageFcst";
    const url = new URL(`${baseUrl.replace(/\/$/, "")}/${endpoint}`);
    url.searchParams.set("serviceKey", this.config.KMA_SERVICE_KEY);
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("numOfRows", "1000");
    url.searchParams.set("dataType", "JSON");
    url.searchParams.set("nx", String(grid.nx));
    url.searchParams.set("ny", String(grid.ny));

    const response = await withTimeout(
      request(url, { method: "GET" }),
      2500,
      "KMA weather request timed out"
    );
    if (response.statusCode === 401 || response.statusCode === 403) {
      throw new AppError({ code: ERROR_CODES.AUTH_ERROR, provider: "KMA", status: response.statusCode });
    }
    if (response.statusCode >= 500) {
      throw new AppError({ code: ERROR_CODES.WEATHER_UNAVAILABLE, provider: "KMA", status: response.statusCode, retryable: true });
    }
    const body = (await response.body.json()) as unknown;
    return parseKmaResponse(body);
  }

  private getMockWeather(requestInput: WeatherRequest): KmaForecastPoint {
    const scenario = this.config.MOCK_WEATHER_SCENARIO;
    if (scenario === "heat") {
      return {
        temperatureC: 34,
        humidityPercent: 68,
        precipitationProbability: 20,
        precipitationType: "none",
        sky: "hot",
        windSpeedMs: 1.2
      };
    }
    if (scenario === "rain") {
      return {
        temperatureC: 27,
        humidityPercent: 75,
        precipitationProbability: 70,
        precipitationType: "rain",
        sky: "rain",
        windSpeedMs: 1.8
      };
    }
    if (scenario === "pleasant") {
      return {
        temperatureC: 22,
        humidityPercent: 45,
        precipitationProbability: 10,
        precipitationType: "none",
        sky: "clear",
        windSpeedMs: 1.5
      };
    }
    if (scenario === "cold") {
      return {
        temperatureC: -7,
        humidityPercent: 40,
        precipitationProbability: 10,
        precipitationType: "none",
        sky: "clear",
        windSpeedMs: 2.8
      };
    }
    if (requestInput.mode === "weekend") {
      return {
        temperatureC: 29,
        humidityPercent: 78,
        precipitationProbability: 70,
        precipitationType: "rain",
        sky: "rain",
        windSpeedMs: 2.1
      };
    }
    if (requestInput.mode === "tomorrow") {
      return {
        temperatureC: 27,
        humidityPercent: 75,
        precipitationProbability: 65,
        precipitationType: "rain",
        sky: "cloudy",
        windSpeedMs: 1.8
      };
    }
    return {
      temperatureC: 34,
      humidityPercent: 68,
      precipitationProbability: 20,
      precipitationType: "none",
      sky: "hot",
      windSpeedMs: 1.2
    };
  }
}

export function parseKmaResponse(body: unknown): KmaForecastPoint {
  if (typeof body !== "object" || body === null) {
    throw new AppError({ code: ERROR_CODES.PROVIDER_ERROR, provider: "KMA" });
  }
  const response = (body as { response?: { body?: { items?: { item?: KmaItem[] } } } }).response;
  const items = response?.body?.items?.item;
  if (!Array.isArray(items)) {
    throw new AppError({ code: ERROR_CODES.PROVIDER_ERROR, provider: "KMA" });
  }
  return parseKmaItems(items);
}

export function createKmaSourceMetadata(cached = false) {
  return {
    provider: "KMA" as const,
    fetchedAt: formatSeoulIso(new Date()),
    cached
  };
}

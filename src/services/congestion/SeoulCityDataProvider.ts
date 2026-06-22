import { request } from "undici";
import type { AppConfig } from "../../config/env.js";
import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import { formatSeoulIso } from "../../utils/dates.js";
import { withTimeout } from "../../utils/timeout.js";
import { normalizeCongestionLevel, scoreCongestion } from "./congestionScore.js";
import type { CongestionResult } from "./congestionTypes.js";

interface CityDataResponse {
  readonly CITYDATA?: {
    readonly AREA_NM?: string;
    readonly LIVE_PPLTN_STTS?: readonly {
      readonly AREA_CONGEST_LVL?: string;
      readonly AREA_CONGEST_MSG?: string;
      readonly AREA_PPLTN_MIN?: string;
      readonly AREA_PPLTN_MAX?: string;
    }[];
  };
}

function parseNumber(value: string | undefined): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseCityDataResponse(body: CityDataResponse): CongestionResult {
  const status = body.CITYDATA?.LIVE_PPLTN_STTS?.[0];
  const level = normalizeCongestionLevel(status?.AREA_CONGEST_LVL);
  return {
    areaName: body.CITYDATA?.AREA_NM ?? null,
    level,
    score: scoreCongestion(level),
    confidence: level === "unknown" ? "low" : "high",
    populationMin: parseNumber(status?.AREA_PPLTN_MIN),
    populationMax: parseNumber(status?.AREA_PPLTN_MAX),
    message: status?.AREA_CONGEST_MSG ?? null,
    source: {
      provider: "Seoul Realtime City Data",
      fetchedAt: formatSeoulIso(new Date()),
      cached: false
    }
  };
}

export class SeoulCityDataProvider {
  constructor(private readonly config: AppConfig) {}

  async getCongestion(areaName: string): Promise<CongestionResult> {
    if (this.config.MOCK_PROVIDERS || !this.config.SEOUL_CITY_DATA_API_KEY) {
      return getMockCongestion(areaName);
    }
    const baseUrl = this.config.SEOUL_CITY_DATA_BASE_URL ?? "http://openapi.seoul.go.kr:8088";
    const url = `${baseUrl.replace(/\/$/, "")}/${this.config.SEOUL_CITY_DATA_API_KEY}/json/citydata/1/5/${encodeURIComponent(areaName)}`;
    const response = await withTimeout(request(url, { method: "GET" }), 2000, "Seoul city data request timed out");
    if (response.statusCode === 401 || response.statusCode === 403) {
      throw new AppError({ code: ERROR_CODES.AUTH_ERROR, provider: "Seoul Realtime City Data", status: response.statusCode });
    }
    if (response.statusCode >= 500) {
      throw new AppError({ code: ERROR_CODES.CONGESTION_UNAVAILABLE, provider: "Seoul Realtime City Data", status: response.statusCode, retryable: true });
    }
    return parseCityDataResponse((await response.body.json()) as CityDataResponse);
  }
}

function createScenarioCongestion(
  areaName: string,
  level: "crowded" | "relaxed"
): CongestionResult {
  const isCrowded = level === "crowded";
  return {
    areaName,
    level,
    score: scoreCongestion(level),
    confidence: "high",
    populationMin: isCrowded ? 28000 : 1000,
    populationMax: isCrowded ? 32000 : 3000,
    message: isCrowded ? "Mock crowded scenario" : "Mock relaxed scenario",
    source: { provider: "mock", fetchedAt: formatSeoulIso(new Date()), cached: false }
  };
}

export function getMockCongestion(areaName: string): CongestionResult {
  if (areaName === "MOCK_CROWDED_AREA") {
    return createScenarioCongestion(areaName, "crowded");
  }
  if (areaName === "MOCK_RELAXED_AREA") {
    return createScenarioCongestion(areaName, "relaxed");
  }
  const level = /여의도|홍대|명동/.test(areaName) ? "crowded" : "normal";
  return {
    areaName,
    level,
    score: scoreCongestion(level),
    confidence: "high",
    populationMin: level === "crowded" ? 28000 : 9000,
    populationMax: level === "crowded" ? 32000 : 12000,
    message: level === "crowded" ? "방문객이 많아 여유로운 일정이 필요합니다." : "방문 가능한 수준입니다.",
    source: { provider: "mock", fetchedAt: formatSeoulIso(new Date()), cached: false }
  };
}

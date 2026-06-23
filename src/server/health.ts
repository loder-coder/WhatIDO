import type { AppConfig } from "../config/env.js";
import { getSecretReadiness } from "../config/env.js";
import type { PublicToolDefinition } from "./registerTools.js";

export interface HealthStatus {
  readonly status: "ok" | "degraded";
  readonly service: "whatdowedo-mcp";
  readonly version: "0.1.0";
  readonly environment: AppConfig["NODE_ENV"];
  readonly mockProviders: boolean;
  readonly toolCount: number;
  readonly tools: readonly string[];
  readonly productionSecrets: ReturnType<typeof getSecretReadiness>;
  readonly missingConfiguration: readonly string[];
}

export function getHealthStatus(
  config: AppConfig,
  tools: readonly PublicToolDefinition[]
): HealthStatus {
  const productionSecrets = getSecretReadiness(config);
  const missingConfiguration: string[] = [];

  if (config.NODE_ENV === "production" && !config.MOCK_PROVIDERS) {
    if (!productionSecrets.kmaApiKey) missingConfiguration.push("KMA_SERVICE_KEY");
    if (!productionSecrets.seoulOpenDataApiKey) missingConfiguration.push("SEOUL_OPEN_DATA_API_KEY");
    if (!productionSecrets.seoulRealtimeCityDataApiKey) missingConfiguration.push("SEOUL_CITY_DATA_API_KEY");
    if (config.CACHE_BACKEND === "redis" && !config.REDIS_URL) {
      missingConfiguration.push("REDIS_URL");
    }
  }

  return {
    status: missingConfiguration.length > 0 ? "degraded" : "ok",
    service: "whatdowedo-mcp",
    version: "0.1.0",
    environment: config.NODE_ENV,
    mockProviders: config.MOCK_PROVIDERS,
    toolCount: tools.length,
    tools: tools.map((tool) => tool.name),
    productionSecrets,
    missingConfiguration
  };
}

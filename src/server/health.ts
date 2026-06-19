import type { AppConfig } from "../config/env.js";
import { getSecretReadiness } from "../config/env.js";
import type { PublicToolDefinition } from "./registerTools.js";

export interface HealthStatus {
  readonly status: "ok" | "fail";
  readonly service: "whatdowedo-mcp";
  readonly version: "0.1.0";
  readonly environment: AppConfig["NODE_ENV"];
  readonly mockProviders: boolean;
  readonly toolCount: number;
  readonly tools: readonly string[];
  readonly productionSecrets: ReturnType<typeof getSecretReadiness>;
}

export function getHealthStatus(
  config: AppConfig,
  tools: readonly PublicToolDefinition[]
): HealthStatus {
  const productionSecrets = getSecretReadiness(config);
  const missingProductionSecret =
    config.NODE_ENV === "production" &&
    Object.values(productionSecrets).some((isReady) => !isReady);

  return {
    status: missingProductionSecret ? "fail" : "ok",
    service: "whatdowedo-mcp",
    version: "0.1.0",
    environment: config.NODE_ENV,
    mockProviders: config.MOCK_PROVIDERS,
    toolCount: tools.length,
    tools: tools.map((tool) => tool.name),
    productionSecrets
  };
}

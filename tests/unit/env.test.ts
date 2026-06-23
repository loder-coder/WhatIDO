import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env.js";
import { getHealthStatus } from "../../src/server/health.js";

const productionProviderKeys = {
  KMA_SERVICE_KEY: "kma-key",
  CULTURE_PORTAL_SERVICE_KEY: "culture-key",
  SEOUL_OPEN_DATA_API_KEY: "open-data-key",
  SEOUL_CITY_DATA_API_KEY: "city-data-key"
};

describe("loadEnv", () => {
  it("allows local development without external API keys", () => {
    const config = loadEnv({
      NODE_ENV: "development",
      LOG_LEVEL: "debug",
      MOCK_PROVIDERS: "true"
    });

    expect(config.NODE_ENV).toBe("development");
    expect(config.LOG_LEVEL).toBe("debug");
    expect(config.MOCK_PROVIDERS).toBe(true);
  });

  it("keeps mock providers disabled unless explicitly opted in", () => {
    const config = loadEnv({ NODE_ENV: "development", LOG_LEVEL: "silent" });

    expect(config.MOCK_PROVIDERS).toBe(false);
  });

  it("does not require public-data keys in the MCP production runtime", () => {
    expect(loadEnv({ NODE_ENV: "production", LOG_LEVEL: "info", MOCK_PROVIDERS: "false" }).NODE_ENV).toBe("production");
  });

  it("rejects production mock mode", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        LOG_LEVEL: "info",
        MOCK_PROVIDERS: "true"
      })
    ).toThrow("MOCK_PROVIDERS must not be enabled in production");
  });

  it("requires REDIS_URL only when the production cache backend is redis", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        LOG_LEVEL: "info",
        MOCK_PROVIDERS: "false",
        CACHE_BACKEND: "memory",
        ...productionProviderKeys
      })
    ).not.toThrow();

    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        LOG_LEVEL: "info",
        MOCK_PROVIDERS: "false",
        CACHE_BACKEND: "redis",
        ...productionProviderKeys
      })
    ).toThrow("REDIS_URL is required when CACHE_BACKEND=redis");
  });

  it("provides a degraded configuration for the HTTP health safety net", () => {
    const config = loadEnv(
      {
        NODE_ENV: "production",
        LOG_LEVEL: "info",
        MOCK_PROVIDERS: "false",
        CACHE_BACKEND: "memory"
      },
      { allowMissingProductionSecrets: true }
    );

    const health = getHealthStatus(config, []);
    expect(health.status).toBe("degraded");
    expect(health.missingConfiguration).toEqual([
      "KMA_SERVICE_KEY",
      "SEOUL_OPEN_DATA_API_KEY",
      "SEOUL_CITY_DATA_API_KEY"
    ]);
  });
});

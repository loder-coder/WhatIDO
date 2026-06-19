import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env.js";

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

  it("requires external API keys in production", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        LOG_LEVEL: "info",
        MOCK_PROVIDERS: "false"
      })
    ).toThrow();
  });
});

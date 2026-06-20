import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env.js";
import { createLogger } from "../../src/observability/logger.js";
import { createServiceContainer } from "../../src/services/index.js";
import { todayWhatToDoHandler } from "../../src/tools/todayWhatToDo.js";

function deps() {
  const config = loadEnv({ NODE_ENV: "test", LOG_LEVEL: "silent", MOCK_PROVIDERS: "true" });
  return { config, logger: createLogger(config), services: createServiceContainer(config) };
}

function parse(response: Awaited<ReturnType<typeof todayWhatToDoHandler>>) {
  return JSON.parse(response.content[0]?.text ?? "{}") as {
    status: string;
    recommendations: Array<{
      id: string;
      is_indoor: boolean | null;
      is_free: boolean | null;
      congestion: { level: string };
      source: { url: string | null };
    }>;
    warnings: Array<{ code: string }>;
    missing_data: string[];
  };
}

describe("Recommendation quality and degraded scenarios", () => {
  it("returns partial_success with missing location warning", async () => {
    const body = parse(
      await todayWhatToDoHandler(
        {
          query: "오늘 뭐하지?",
          result_limit: 3,
          requestedAt: "2026-06-20T10:00:00+09:00"
        },
        deps()
      )
    );
    expect(body.status).toBe("partial_success");
    expect(body.warnings.some((warning) => warning.code === "LOCATION_MISSING")).toBe(true);
    expect(body.missing_data).toContain("location");
  });

  it("uses no-candidate fallback without invented source URL", async () => {
    const body = parse(
      await todayWhatToDoHandler(
        {
          query: "오늘 늦게 뭐하지?",
          location: { district: "송파구" },
          result_limit: 3,
          requestedAt: "2026-06-20T22:30:00+09:00"
        },
        deps()
      )
    );
    expect(body.status).toBe("partial_success");
    expect(body.warnings.some((warning) => warning.code === "NO_CANDIDATES")).toBe(true);
    expect(body.recommendations[0]?.source.url).toBeNull();
  });

  it("hot weather mock scenario favors indoor and free recommendations", async () => {
    const body = parse(
      await todayWhatToDoHandler(
        {
          query: "오늘 무료로 뭐하지?",
          location: { district: "송파구", latitude: 37.5145, longitude: 127.1059 },
          preferences: { free_preferred: true, low_crowd_preferred: true },
          result_limit: 3,
          requestedAt: "2026-06-20T10:00:00+09:00"
        },
        deps()
      )
    );
    expect(body.recommendations[0]?.is_indoor).toBe(true);
    expect(body.recommendations[0]?.is_free).toBe(true);
  });
});

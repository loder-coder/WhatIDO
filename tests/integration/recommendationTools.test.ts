import { describe, expect, it } from "vitest";
import { z } from "zod";
import { loadEnv } from "../../src/config/env.js";
import { createLogger } from "../../src/observability/logger.js";
import { createServiceContainer } from "../../src/services/index.js";
import type { ToolContextFactoryDependencies } from "../../src/server/toolContext.js";
import { RecommendationToolInputSchema } from "../../src/tools/schemas.js";
import { todayWhatToDoHandler } from "../../src/tools/todayWhatToDo.js";
import { tomorrowWhatToDoHandler } from "../../src/tools/tomorrowWhatToDo.js";
import { weekendWhatToDoHandler } from "../../src/tools/weekendWhatToDo.js";

const InputSchema = z.object(RecommendationToolInputSchema);

function dependencies(): ToolContextFactoryDependencies {
  const config = loadEnv({
    NODE_ENV: "test",
    LOG_LEVEL: "silent",
    MOCK_PROVIDERS: "true"
  });
  return {
    config,
    logger: createLogger(config),
    services: createServiceContainer(config)
  };
}

function parseToolResponse(response: Awaited<ReturnType<typeof todayWhatToDoHandler>>) {
  return JSON.parse(response.content[0]?.text ?? "{}") as {
    status: string;
    intent: string;
    recommendations: unknown[];
    tomorrow_plan?: unknown;
    weekend_summary?: unknown;
    metadata?: {
      request_id?: string;
      generated_at?: string;
      mock_data?: { enabled?: boolean; notice?: string | null; weather_scenario?: string | null };
    };
  };
}

describe("Recommendation public tools", () => {
  it("validates common input schema", () => {
    expect(InputSchema.safeParse({ location: { district: "송파구" } }).success).toBe(false);
    expect(
      InputSchema.safeParse({
        query: "오늘 뭐하지?",
        result_limit: 6,
        location: { latitude: 37.5, longitude: 127 }
      }).success
    ).toBe(false);
    expect(
      InputSchema.safeParse({
        query: "오늘 뭐하지?",
        location: { latitude: 40, longitude: 127 }
      }).success
    ).toBe(false);
    expect(
      InputSchema.safeParse({
        query: "오늘 뭐하지?",
        result_limit: 5,
        location: { district: "송파구", latitude: 37.5145, longitude: 127.1059 }
      }).success
    ).toBe(true);
  });

  it("today_what_to_do returns recommendations with envelope metadata", async () => {
    const response = await todayWhatToDoHandler(
      {
        query: "오늘 뭐하지?",
        location: { district: "송파구", latitude: 37.5145, longitude: 127.1059 },
        result_limit: 3,
        requestedAt: "2026-06-20T10:00:00+09:00"
      },
      dependencies()
    );
    const body = parseToolResponse(response);
    expect(body.intent).toBe("today");
    expect(body.recommendations.length).toBeGreaterThan(0);
    expect(body.metadata?.request_id).toBeTruthy();
    expect(body.metadata?.generated_at).toBeTruthy();
  });

  it("returns five mock recommendations when the requested result limit is five", async () => {
    const body = parseToolResponse(
      await todayWhatToDoHandler(
        {
          query: "오늘 무료로 뭐하지?",
          location: { district: "송파구", latitude: 37.5145, longitude: 127.1059 },
          preferences: { free_preferred: true },
          result_limit: 5,
          requestedAt: "2026-06-20T10:00:00+09:00"
        },
        dependencies()
      )
    );

    expect(body.recommendations).toHaveLength(5);
  });

  it("marks mock-provider responses as mock data", async () => {
    const body = parseToolResponse(
      await todayWhatToDoHandler(
        {
          query: "오늘 뭐하지?",
          location: { district: "송파구", latitude: 37.5145, longitude: 127.1059 },
          result_limit: 3,
          requestedAt: "2026-06-20T10:00:00+09:00"
        },
        dependencies()
      )
    );

    expect(body.metadata?.mock_data?.enabled).toBe(true);
    expect(body.metadata?.mock_data?.notice).toBeTruthy();
  });

  it("tomorrow_what_to_do returns tomorrow plan", async () => {
    const body = parseToolResponse(
      await tomorrowWhatToDoHandler(
        {
          query: "내일 뭐하지?",
          location: { district: "송파구" },
          preferred_time_of_day: "afternoon",
          result_limit: 3,
          requestedAt: "2026-06-20T10:00:00+09:00"
        },
        dependencies()
      )
    );
    expect(body.intent).toBe("tomorrow");
    expect(body.tomorrow_plan).toBeTruthy();
    expect(body.recommendations.length).toBeGreaterThan(0);
  });

  it("uses the Seoul default location to fetch weather when no location is supplied", async () => {
    const body = parseToolResponse(
      await tomorrowWhatToDoHandler(
        {
          query: "내일 뭐하지?",
          result_limit: 3,
          requestedAt: "2026-06-20T10:00:00+09:00"
        },
        dependencies()
      )
    ) as { summary?: { weather?: { temperature_c?: number | null } }; recommendations: unknown[] };

    expect(body.summary?.weather?.temperature_c).not.toBeNull();
    expect(body.recommendations.length).toBeGreaterThan(0);
  });

  it("weekend_what_to_do returns weekend summary and plan B flag", async () => {
    const body = parseToolResponse(
      await weekendWhatToDoHandler(
        {
          query: "이번 주말 무료 데이트 뭐하지?",
          location: { district: "마포구" },
          preferences: { free_preferred: true },
          result_limit: 3,
          requestedAt: "2026-06-20T10:00:00+09:00"
        },
        dependencies()
      )
    );
    expect(body.intent).toBe("weekend");
    expect(body.weekend_summary).toBeTruthy();
    expect(body.recommendations.length).toBeGreaterThan(0);
  });
});

import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env.js";
import { createLogger } from "../../src/observability/logger.js";
import { createServiceContainer } from "../../src/services/index.js";
import { createMcpServer } from "../../src/server/createMcpServer.js";
import { PUBLIC_TOOL_DEFINITIONS } from "../../src/server/registerTools.js";

describe("MCP tool discovery", () => {
  it("registers the three public Phase 1 tools", () => {
    const config = loadEnv({
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      MOCK_PROVIDERS: "true"
    });

    const created = createMcpServer({
      config,
      logger: createLogger(config),
      services: createServiceContainer()
    });

    expect(created.tools.map((tool) => tool.name)).toEqual([
      "today_what_to_do",
      "tomorrow_what_to_do",
      "weekend_what_to_do"
    ]);
    expect(PUBLIC_TOOL_DEFINITIONS).toHaveLength(3);
  });
});

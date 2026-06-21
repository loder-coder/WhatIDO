import { once } from "node:events";
import { describe, expect, it } from "vitest";
import { loadEnv } from "../../src/config/env.js";
import { createHttpServer } from "../../src/http/createHttpServer.js";
import { createLogger } from "../../src/observability/logger.js";
import { createServiceContainer } from "../../src/services/index.js";

const MCP_HEADERS = {
  accept: "application/json, text/event-stream",
  "content-type": "application/json",
  "mcp-protocol-version": "2025-11-25"
};

async function postMcp(baseUrl: string, body: object): Promise<Response> {
  return fetch(`${baseUrl}/mcp`, {
    method: "POST",
    headers: MCP_HEADERS,
    body: JSON.stringify(body)
  });
}

describe("Streamable HTTP MCP transport", () => {
  it("serves health, initialize, and tools/list without an MCP session", async () => {
    const config = loadEnv({
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      MOCK_PROVIDERS: "true"
    });
    const logger = createLogger(config);
    const server = createHttpServer({
      config,
      logger,
      services: createServiceContainer(config)
    });

    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (address === null || typeof address === "string") {
      throw new Error("Expected a TCP server address");
    }
    const baseUrl = `http://127.0.0.1:${address.port}`;

    try {
      const health = await fetch(`${baseUrl}/health`);
      expect(health.status).toBe(200);
      await expect(health.json()).resolves.toEqual({ status: "ok" });

      const initialize = await postMcp(baseUrl, {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-11-25",
          capabilities: {},
          clientInfo: { name: "transport-test", version: "1.0.0" }
        }
      });
      expect(initialize.status).toBe(200);
      const initializeBody = (await initialize.json()) as {
        result: { protocolVersion: string };
      };
      expect(initializeBody.result.protocolVersion).toBe("2025-11-25");

      const toolList = await postMcp(baseUrl, {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {}
      });
      expect(toolList.status).toBe(200);
      const toolListBody = (await toolList.json()) as {
        result: {
          tools: Array<{
            name: string;
            annotations: Record<string, unknown>;
          }>;
        };
      };

      expect(toolListBody.result.tools.map((tool) => tool.name)).toEqual([
        "today_what_to_do",
        "tomorrow_what_to_do",
        "weekend_what_to_do"
      ]);
      expect(
        toolListBody.result.tools.every(
          (tool) =>
            typeof tool.annotations.title === "string" &&
            tool.annotations.readOnlyHint === true &&
            tool.annotations.destructiveHint === false &&
            tool.annotations.openWorldHint === true &&
            tool.annotations.idempotentHint === true
        )
      ).toBe(true);
    } finally {
      server.close();
      await once(server, "close");
    }
  });
});

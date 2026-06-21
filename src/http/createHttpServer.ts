import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { AppConfig } from "../config/env.js";
import type { AppLogger } from "../observability/logger.js";
import type { ServiceContainer } from "../services/index.js";
import { createMcpServer } from "../server/createMcpServer.js";
import type { HealthStatus } from "../server/health.js";

const MCP_PATH = "/mcp";
const HEALTH_PATH = "/health";

export interface HttpServerDependencies {
  readonly config: AppConfig;
  readonly logger: AppLogger;
  readonly services: ServiceContainer;
  readonly health?: HealthStatus;
}

function writeJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

function writeJsonRpcError(response: ServerResponse): void {
  writeJson(response, 500, {
    jsonrpc: "2.0",
    error: { code: -32603, message: "Internal server error" },
    id: null
  });
}

function setCorsHeaders(response: ServerResponse): void {
  response.setHeader("access-control-allow-origin", "*");
  response.setHeader("access-control-allow-methods", "GET, POST, DELETE, OPTIONS");
  response.setHeader(
    "access-control-allow-headers",
    "content-type, mcp-protocol-version, mcp-session-id, last-event-id"
  );
}

async function handleMcpRequest(
  request: IncomingMessage,
  response: ServerResponse,
  dependencies: HttpServerDependencies
): Promise<void> {
  // New instances for every request keep the MCP endpoint stateless.
  const { server } = createMcpServer(dependencies);
  const transport = new StreamableHTTPServerTransport({
    enableJsonResponse: true
  });

  try {
    // SDK v1.13's transport declaration is not compatible with this project's
    // exactOptionalPropertyTypes setting, while its runtime implementation is.
    await server.connect(transport as unknown as Transport);
    await transport.handleRequest(request, response);
  } catch (error: unknown) {
    dependencies.logger.error({ error }, "MCP HTTP request failed");
    if (!response.headersSent) {
      writeJsonRpcError(response);
    }
  } finally {
    await transport.close();
    await server.close();
  }
}

export function createHttpServer(dependencies: HttpServerDependencies): Server {
  return createServer((request, response) => {
    setCorsHeaders(response);

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    if (request.method === "GET" && request.url === HEALTH_PATH) {
      writeJson(response, 200, dependencies.health ?? { status: "ok" });
      return;
    }

    if (request.url === MCP_PATH) {
      void handleMcpRequest(request, response, dependencies);
      return;
    }

    writeJson(response, 404, { error: "Not found" });
  });
}

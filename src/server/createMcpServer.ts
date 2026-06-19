import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { AppConfig } from "../config/env.js";
import type { AppLogger } from "../observability/logger.js";
import type { ServiceContainer } from "../services/index.js";
import { registerTools, type PublicToolDefinition } from "./registerTools.js";

export interface CreateMcpServerDependencies {
  readonly config: AppConfig;
  readonly logger: AppLogger;
  readonly services: ServiceContainer;
}

export interface CreatedMcpServer {
  readonly server: McpServer;
  readonly tools: readonly PublicToolDefinition[];
}

export function createMcpServer(
  dependencies: CreateMcpServerDependencies
): CreatedMcpServer {
  const server = new McpServer({
    name: "whatdowedo",
    version: "0.1.0"
  });

  const tools = registerTools(server, dependencies);
  dependencies.logger.info({ toolCount: tools.length }, "MCP tools registered");

  return {
    server,
    tools
  };
}

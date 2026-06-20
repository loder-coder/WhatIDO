import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadEnv } from "./config/env.js";
import { createLogger } from "./observability/logger.js";
import { createServiceContainer } from "./services/index.js";
import { createMcpServer } from "./server/createMcpServer.js";
import { getHealthStatus } from "./server/health.js";

async function main() {
  const config = loadEnv();
  const logger = createLogger(config);
  const services = createServiceContainer(config);
  const { server, tools } = createMcpServer({ config, logger, services });
  const health = getHealthStatus(config, tools);

  if (health.status === "fail") {
    logger.error({ health }, "MCP server health check failed");
    process.exitCode = 1;
    return;
  }

  const shutdown = (signal: NodeJS.Signals) => {
    logger.info({ signal }, "MCP server shutdown requested");
    process.exit(0);
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info(
    { toolCount: tools.length, tools: tools.map((tool) => tool.name) },
    "MCP server started"
  );
}

main().catch((error: unknown) => {
  const fallbackLogger = createLogger(loadEnv({ NODE_ENV: "development", LOG_LEVEL: "error", MOCK_PROVIDERS: "true" }));
  fallbackLogger.error({ error }, "MCP server failed to start");
  process.exit(1);
});

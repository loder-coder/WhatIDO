import { loadEnv } from "./config/env.js";
import { createHttpServer } from "./http/createHttpServer.js";
import { createLogger } from "./observability/logger.js";
import { createServiceContainer } from "./services/index.js";
import { createMcpServer } from "./server/createMcpServer.js";
import { getHealthStatus } from "./server/health.js";

async function main() {
  const config = loadEnv();
  const logger = createLogger(config);
  const services = createServiceContainer(config);
  const { tools } = createMcpServer({ config, logger, services });
  const health = getHealthStatus(config, tools);

  if (health.status === "fail") {
    logger.error({ health }, "MCP server health check failed");
    process.exitCode = 1;
    return;
  }

  const httpServer = createHttpServer({ config, logger, services });

  const shutdown = (signal: NodeJS.Signals) => {
    logger.info({ signal }, "MCP server shutdown requested");
    httpServer.close(() => process.exit(0));
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(config.PORT, "0.0.0.0", () => {
      httpServer.off("error", reject);
      resolve();
    });
  });

  logger.info(
    {
      host: "0.0.0.0",
      port: config.PORT,
      endpoint: "/mcp",
      toolCount: tools.length,
      tools: tools.map((tool) => tool.name)
    },
    "Streamable HTTP MCP server started"
  );
}

main().catch((error: unknown) => {
  const fallbackLogger = createLogger(loadEnv({ NODE_ENV: "development", LOG_LEVEL: "error", MOCK_PROVIDERS: "true" }));
  fallbackLogger.error({ error }, "MCP server failed to start");
  process.exit(1);
});

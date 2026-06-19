import { randomUUID } from "node:crypto";
import type { AppConfig } from "../config/env.js";
import type { AppLogger } from "../observability/logger.js";
import type { ServiceContainer } from "../services/index.js";

export interface ToolContext {
  readonly requestId: string;
  readonly logger: AppLogger;
  readonly config: AppConfig;
  readonly services: ServiceContainer;
}

export interface ToolContextFactoryDependencies {
  readonly logger: AppLogger;
  readonly config: AppConfig;
  readonly services: ServiceContainer;
}

export function createToolContext(
  dependencies: ToolContextFactoryDependencies
): ToolContext {
  const requestId = randomUUID();

  return {
    requestId,
    logger: dependencies.logger.child({ requestId }),
    config: dependencies.config,
    services: dependencies.services
  };
}

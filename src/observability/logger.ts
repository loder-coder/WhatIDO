import pino from "pino";
import type { AppConfig } from "../config/env.js";

export type AppLogger = pino.Logger;

export function createLogger(config: Pick<AppConfig, "LOG_LEVEL">): AppLogger {
  return pino(
    {
      level: config.LOG_LEVEL,
      base: {
        service: "whatdowedo-mcp"
      }
    },
    pino.destination(2)
  );
}

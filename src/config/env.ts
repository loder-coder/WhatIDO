import { config as loadDotEnv } from "dotenv";
import { z } from "zod";

loadDotEnv();

const BaseEnvSchema = z.object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
    MOCK_PROVIDERS: z
      .string()
      .optional()
      .transform((value) => value === undefined || value.toLowerCase() === "true"),
    MOCK_WEATHER_SCENARIO: z.enum(["heat", "rain", "pleasant", "cold"]).optional(),
    PORT: z.coerce.number().int().positive().default(8080),
    KMA_BASE_URL: z.string().url().optional(),
    KMA_SERVICE_KEY: z.string().optional(),
    KMA_API_KEY: z.string().optional(),
    CULTURE_PORTAL_BASE_URL: z.string().url().optional(),
    CULTURE_PORTAL_SERVICE_KEY: z.string().optional(),
    CULTURE_PORTAL_API_KEY: z.string().optional(),
    SEOUL_OPEN_DATA_BASE_URL: z.string().url().optional(),
    SEOUL_OPEN_DATA_API_KEY: z.string().optional(),
    SEOUL_CITY_DATA_BASE_URL: z.string().url().optional(),
    SEOUL_CITY_DATA_API_KEY: z.string().optional(),
    SEOUL_REALTIME_CITY_DATA_API_KEY: z.string().optional(),
    CACHE_BACKEND: z.enum(["memory", "redis"]).default("memory"),
    REDIS_URL: z.string().url().optional()
  });

const EnvSchema = BaseEnvSchema.superRefine((env, context) => {
    if (env.NODE_ENV !== "production" || env.MOCK_PROVIDERS) {
      return;
    }

    const requiredKeys = [
      "KMA_SERVICE_KEY",
      "CULTURE_PORTAL_SERVICE_KEY",
      "SEOUL_OPEN_DATA_API_KEY",
      "SEOUL_CITY_DATA_API_KEY"
    ] as const;

    for (const key of requiredKeys) {
      if (!env[key]) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: `${key} is required in production`
        });
      }
    }

    if (env.CACHE_BACKEND === "redis" && !env.REDIS_URL) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["REDIS_URL"],
        message: "REDIS_URL is required when CACHE_BACKEND=redis"
      });
    }
  });

export type AppConfig = z.infer<typeof BaseEnvSchema>;

export interface LoadEnvOptions {
  readonly allowMissingProductionSecrets?: boolean;
}

export function loadEnv(
  source: NodeJS.ProcessEnv = process.env,
  options: LoadEnvOptions = {}
): AppConfig {
  const parsed = options.allowMissingProductionSecrets
    ? BaseEnvSchema.parse(source)
    : EnvSchema.parse(source);
  return {
    ...parsed,
    KMA_SERVICE_KEY: parsed.KMA_SERVICE_KEY ?? parsed.KMA_API_KEY,
    CULTURE_PORTAL_SERVICE_KEY:
      parsed.CULTURE_PORTAL_SERVICE_KEY ?? parsed.CULTURE_PORTAL_API_KEY,
    SEOUL_CITY_DATA_API_KEY:
      parsed.SEOUL_CITY_DATA_API_KEY ?? parsed.SEOUL_REALTIME_CITY_DATA_API_KEY
  };
}

export function getSecretReadiness(config: AppConfig) {
  return {
    kmaApiKey: Boolean(config.KMA_SERVICE_KEY),
    culturePortalApiKey: Boolean(config.CULTURE_PORTAL_SERVICE_KEY),
    seoulOpenDataApiKey: Boolean(config.SEOUL_OPEN_DATA_API_KEY),
    seoulRealtimeCityDataApiKey: Boolean(
      config.SEOUL_CITY_DATA_API_KEY
    )
  };
}

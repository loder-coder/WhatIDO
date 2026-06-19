import { config as loadDotEnv } from "dotenv";
import { z } from "zod";

loadDotEnv();

const EnvSchema = z
  .object({
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
    KMA_API_KEY: z.string().optional(),
    CULTURE_PORTAL_API_KEY: z.string().optional(),
    SEOUL_OPEN_DATA_API_KEY: z.string().optional(),
    SEOUL_REALTIME_CITY_DATA_API_KEY: z.string().optional(),
    CACHE_BACKEND: z.enum(["memory", "redis"]).default("memory"),
    REDIS_URL: z.string().url().optional()
  })
  .superRefine((env, context) => {
    if (env.NODE_ENV !== "production") {
      return;
    }

    const requiredKeys = [
      "KMA_API_KEY",
      "CULTURE_PORTAL_API_KEY",
      "SEOUL_OPEN_DATA_API_KEY",
      "SEOUL_REALTIME_CITY_DATA_API_KEY"
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
  });

export type AppConfig = z.infer<typeof EnvSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppConfig {
  return EnvSchema.parse(source);
}

export function getSecretReadiness(config: AppConfig) {
  return {
    kmaApiKey: Boolean(config.KMA_API_KEY),
    culturePortalApiKey: Boolean(config.CULTURE_PORTAL_API_KEY),
    seoulOpenDataApiKey: Boolean(config.SEOUL_OPEN_DATA_API_KEY),
    seoulRealtimeCityDataApiKey: Boolean(
      config.SEOUL_REALTIME_CITY_DATA_API_KEY
    )
  };
}

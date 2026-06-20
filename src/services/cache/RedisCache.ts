import { AppError } from "../../errors/AppError.js";
import { ERROR_CODES } from "../../errors/errorCodes.js";
import type { CacheGetOptions, CacheHit, CacheResult, CacheService, CacheSetOptions } from "./cacheTypes.js";

export class RedisCache implements CacheService {
  constructor(private readonly redisUrl: string | undefined) {
    if (!redisUrl) {
      throw new AppError({
        code: ERROR_CODES.PROVIDER_ERROR,
        message: "REDIS_URL is required when CACHE_BACKEND=redis",
        provider: "redis"
      });
    }
  }

  async get<T>(_key: string, _options?: CacheGetOptions): Promise<CacheResult<T>> {
    throw this.unavailable();
  }

  async set<T>(_key: string, _value: T, _ttlSeconds: number, _options?: CacheSetOptions): Promise<void> {
    throw this.unavailable();
  }

  async getOrSet<T>(
    _key: string,
    _factory: () => Promise<T>,
    _ttlSeconds: number,
    _options?: CacheSetOptions
  ): Promise<CacheHit<T>> {
    throw this.unavailable();
  }

  async delete(_key: string): Promise<void> {
    throw this.unavailable();
  }

  private unavailable(): AppError {
    return new AppError({
      code: ERROR_CODES.PROVIDER_ERROR,
      message: "Redis adapter requires a Redis client dependency before production use",
      provider: "redis",
      retryable: false
    });
  }
}

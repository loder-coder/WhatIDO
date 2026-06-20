import type { CacheGetOptions, CacheHit, CacheResult, CacheService, CacheSetOptions } from "./cacheTypes.js";

interface CacheEntry<T> {
  readonly value: T;
  readonly expiresAt: number;
  readonly staleExpiresAt: number;
}

export class InMemoryCache implements CacheService {
  private readonly entries = new Map<string, CacheEntry<unknown>>();
  private readonly inFlight = new Map<string, Promise<CacheHit<unknown>>>();

  constructor(private readonly now: () => number = () => Date.now()) {}

  async get<T>(key: string, options: CacheGetOptions = {}): Promise<CacheResult<T>> {
    const entry = this.entries.get(key);
    if (!entry) {
      return { hit: false };
    }
    const now = this.now();
    const stale = now > entry.expiresAt;
    if (stale && now > entry.staleExpiresAt) {
      this.entries.delete(key);
      return { hit: false };
    }
    if (stale && !options.allowStale) {
      return { hit: false };
    }
    return { hit: true, value: entry.value as T, stale };
  }

  async set<T>(key: string, value: T, ttlSeconds: number, options: CacheSetOptions = {}): Promise<void> {
    const expiresAt = this.now() + ttlSeconds * 1000;
    this.entries.set(key, {
      value,
      expiresAt,
      staleExpiresAt: expiresAt + (options.staleTtlSeconds ?? ttlSeconds) * 1000
    });
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number,
    options: CacheSetOptions = {}
  ): Promise<CacheHit<T>> {
    const cached = await this.get<T>(key);
    if (cached.hit) {
      return cached;
    }
    const existing = this.inFlight.get(key);
    if (existing) {
      return (await existing) as CacheHit<T>;
    }
    const promise = (async (): Promise<CacheHit<T>> => {
      const value = await factory();
      await this.set(key, value, ttlSeconds, options);
      return { hit: true, value, stale: false };
    })();
    this.inFlight.set(key, promise);
    try {
      return await promise;
    } finally {
      this.inFlight.delete(key);
    }
  }

  async delete(key: string): Promise<void> {
    this.entries.delete(key);
  }
}

export interface CacheHit<T> {
  readonly hit: true;
  readonly value: T;
  readonly stale: boolean;
}

export interface CacheMiss {
  readonly hit: false;
}

export type CacheResult<T> = CacheHit<T> | CacheMiss;

export interface CacheGetOptions {
  readonly allowStale?: boolean;
}

export interface CacheSetOptions {
  readonly staleTtlSeconds?: number;
}

export interface CacheService {
  get<T>(key: string, options?: CacheGetOptions): Promise<CacheResult<T>>;
  set<T>(key: string, value: T, ttlSeconds: number, options?: CacheSetOptions): Promise<void>;
  getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number,
    options?: CacheSetOptions
  ): Promise<CacheHit<T>>;
  delete(key: string): Promise<void>;
}

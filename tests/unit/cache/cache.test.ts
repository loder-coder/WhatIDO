import { describe, expect, it } from "vitest";
import { InMemoryCache } from "../../../src/services/cache/InMemoryCache.js";
import { buildLocationHash, CacheKeyBuilder } from "../../../src/services/cache/cacheKeys.js";

describe("Cache layer", () => {
  it("supports ttl and stale ttl with controllable clock", async () => {
    let now = 1000;
    const cache = new InMemoryCache(() => now);
    await cache.set("key", { ok: true }, 1, { staleTtlSeconds: 2 });
    expect(await cache.get("key")).toMatchObject({ hit: true, stale: false });
    now += 1500;
    expect(await cache.get("key")).toEqual({ hit: false });
    const stale = await cache.get<{ ok: boolean }>("key", { allowStale: true });
    expect(stale.hit).toBe(true);
    expect(stale.hit ? stale.stale : false).toBe(true);
    now += 2500;
    expect(await cache.get("key", { allowStale: true })).toEqual({ hit: false });
  });

  it("coalesces same-key concurrent factory calls", async () => {
    const cache = new InMemoryCache();
    let calls = 0;
    const factory = async () => {
      calls += 1;
      return { value: calls };
    };
    const [first, second] = await Promise.all([
      cache.getOrSet("same", factory, 60),
      cache.getOrSet("same", factory, 60)
    ]);
    expect(first.value).toEqual(second.value);
    expect(calls).toBe(1);
  });

  it("builds cache keys without raw coordinates and includes scoring version", () => {
    const locationHash = buildLocationHash({ latitude: 37.5145, longitude: 127.1059 });
    expect(locationHash).not.toContain("37.5145");
    expect(CacheKeyBuilder.recommendation({ intent: "today", contextKey: "abc" })).toContain("v1");
  });
});

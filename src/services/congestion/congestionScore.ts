import type { CongestionLevel } from "./congestionTypes.js";

export function scoreCongestion(level: CongestionLevel): number {
  const scores: Record<CongestionLevel, number> = {
    relaxed: 100,
    normal: 80,
    slightly_crowded: 55,
    crowded: 30,
    very_crowded: 10,
    unknown: 60
  };
  return scores[level];
}

export function normalizeCongestionLevel(value: string | null | undefined): CongestionLevel {
  const text = value ?? "";
  if (/여유|relaxed/i.test(text)) return "relaxed";
  if (/보통|normal/i.test(text)) return "normal";
  if (/약간|slightly/i.test(text)) return "slightly_crowded";
  if (/매우|very/i.test(text)) return "very_crowded";
  if (/붐빔|crowded/i.test(text)) return "crowded";
  return "unknown";
}

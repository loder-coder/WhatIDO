import type { Intent } from "../../utils/dates.js";

export const SCORING_VERSION = "v1";

export const INTENT_WEIGHTS: Record<Intent, { distance: number; weather: number; congestion: number; free: number; time: number }> = {
  today: { distance: 0.3, weather: 0.25, congestion: 0.2, free: 0.15, time: 0.1 },
  tomorrow: { distance: 0.2, weather: 0.35, congestion: 0.15, free: 0.15, time: 0.15 },
  weekend: { distance: 0.15, weather: 0.35, congestion: 0.15, free: 0.25, time: 0.1 }
};

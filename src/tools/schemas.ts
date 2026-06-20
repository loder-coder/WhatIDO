import { z } from "zod";

export const ActivityModeSchema = z.enum(["solo", "couple", "family", "friends"]);
export const CompanionSchema = z.enum([
  "solo",
  "couple",
  "family",
  "friends",
  "tourist",
  "unknown"
]);
export const TransportModeSchema = z.enum(["walking", "public_transit", "driving"]);

export const PreferenceSchema = z
  .object({
    indoor_preferred: z.boolean().optional(),
    outdoor_preferred: z.boolean().optional(),
    free_preferred: z.boolean().optional(),
    low_crowd_preferred: z.boolean().optional(),
    family_friendly: z.boolean().optional(),
    date_friendly: z.boolean().optional(),
    tourist_friendly: z.boolean().optional(),
    max_budget_krw: z.number().int().min(0).max(300000).optional(),
    max_travel_minutes: z.number().int().min(5).max(180).optional(),
    transport_mode: TransportModeSchema.default("public_transit").optional()
  })
  .optional();

export const RecommendationToolInputSchema = {
  location: z
    .object({
      district: z
        .string()
        .min(1)
        .optional()
        .describe("서울 자치구 이름. 예: 송파구, 마포구, 중구"),
      place_name: z.string().optional(),
      latitude: z.number().min(33).max(39).optional(),
      longitude: z.number().min(124).max(132).optional(),
      lat: z.number().min(37).max(38).optional(),
      lng: z.number().min(126).max(128).optional()
    })
    .optional()
    .describe("사용자의 현재 또는 기준 위치"),
  query: z.string().min(1).max(300).describe("사용자 자연어 요청"),
  companions: CompanionSchema.default("unknown").optional(),
  preferences: PreferenceSchema,
  language: z.enum(["ko", "en"]).default("ko").optional(),
  result_limit: z.number().int().min(1).max(5).default(3).optional(),
  preferred_time_of_day: z
    .enum(["morning", "afternoon", "evening", "any"])
    .default("any")
    .optional(),
  preferredMode: ActivityModeSchema.optional().describe("동행 형태"),
  maxDistanceKm: z
    .number()
    .positive()
    .max(30)
    .optional()
    .describe("허용 가능한 최대 이동 거리(km)"),
  freeOnly: z.boolean().optional().describe("무료 활동만 추천할지 여부"),
  indoorPreferred: z
    .boolean()
    .optional()
    .describe("실내 활동 선호 여부"),
  requestedAt: z
    .string()
    .datetime()
    .optional()
    .describe("사용자 요청 시각. 없으면 서버 시각 사용")
} as const;

export type RecommendationToolInput = z.infer<
  z.ZodObject<typeof RecommendationToolInputSchema>
>;

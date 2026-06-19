import { z } from "zod";

export const ActivityModeSchema = z.enum(["solo", "couple", "family", "friends"]);

export const RecommendationToolInputSchema = {
  location: z
    .object({
      district: z
        .string()
        .min(1)
        .describe("서울 자치구 이름. 예: 송파구, 마포구, 중구"),
      lat: z.number().min(37).max(38).optional(),
      lng: z.number().min(126).max(128).optional()
    })
    .describe("사용자의 현재 또는 기준 위치"),
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

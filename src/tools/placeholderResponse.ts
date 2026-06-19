import type { RecommendationToolInput } from "./schemas.js";

export type IntentName =
  | "today_what_to_do"
  | "tomorrow_what_to_do"
  | "weekend_what_to_do";

export interface PlaceholderRecommendationResponse {
  readonly status: "success";
  readonly phase: "phase-1-placeholder";
  readonly intent: IntentName;
  readonly summary: string;
  readonly recommendations: [];
  readonly reasoning: string[];
  readonly warnings: string[];
  readonly metadata: {
    readonly requestId: string;
    readonly locationDistrict: string;
    readonly generatedAt: string;
  };
}

interface PlaceholderResponseOptions {
  readonly intent: IntentName;
  readonly input: RecommendationToolInput;
  readonly requestId: string;
}

export function createPlaceholderResponse(
  options: PlaceholderResponseOptions
): PlaceholderRecommendationResponse {
  return {
    status: "success",
    phase: "phase-1-placeholder",
    intent: options.intent,
    summary:
      "MCP 서버와 공개 도구 등록이 완료되었습니다. 실제 추천 로직은 Phase 2 이후 데이터 서비스와 함께 구현됩니다.",
    recommendations: [],
    reasoning: [
      "현재 단계는 Phase 0/1 범위이므로 외부 API 호출을 수행하지 않습니다.",
      "입력 스키마 검증, 요청 컨텍스트, 로깅, 도구 등록 경로만 검증합니다."
    ],
    warnings: [
      "추천 결과는 아직 생성하지 않습니다.",
      "날씨, 행사, 혼잡도, 거리 계산은 후속 Phase에서 연결됩니다."
    ],
    metadata: {
      requestId: options.requestId,
      locationDistrict: options.input.location.district,
      generatedAt: new Date().toISOString()
    }
  };
}

export function toMcpTextResponse(response: PlaceholderRecommendationResponse) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(response, null, 2)
      }
    ]
  };
}

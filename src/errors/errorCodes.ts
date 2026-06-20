export const ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  WEATHER_UNAVAILABLE: "WEATHER_UNAVAILABLE",
  EVENTS_UNAVAILABLE: "EVENTS_UNAVAILABLE",
  CONGESTION_UNAVAILABLE: "CONGESTION_UNAVAILABLE",
  DISTANCE_UNAVAILABLE: "DISTANCE_UNAVAILABLE",
  NO_CANDIDATES: "NO_CANDIDATES",
  LOCATION_MISSING: "LOCATION_MISSING",
  LOCATION_UNSUPPORTED: "LOCATION_UNSUPPORTED",
  TIMEOUT: "TIMEOUT",
  PROVIDER_ERROR: "PROVIDER_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  RATE_LIMITED: "RATE_LIMITED"
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface UserFacingError {
  readonly code: ErrorCode;
  readonly message: string;
}

export const USER_ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_INPUT: "입력값을 확인해 주세요.",
  WEATHER_UNAVAILABLE: "날씨 정보는 현재 확인하지 못했습니다.",
  EVENTS_UNAVAILABLE: "행사 정보는 현재 확인하지 못했습니다.",
  CONGESTION_UNAVAILABLE: "혼잡도 정보는 현재 확인하지 못했습니다.",
  DISTANCE_UNAVAILABLE: "이동 거리 정보는 추정값으로 계산했습니다.",
  NO_CANDIDATES: "조건에 맞는 추천 후보를 찾지 못했습니다.",
  LOCATION_MISSING: "위치 정보가 없어 서울 전체 기준으로 추천했습니다.",
  LOCATION_UNSUPPORTED: "서울 외 위치는 MVP 범위 밖이라 서울 기준으로 추천했습니다.",
  TIMEOUT: "외부 데이터 응답 시간이 초과되었습니다.",
  PROVIDER_ERROR: "외부 데이터 제공처 응답을 처리하지 못했습니다.",
  AUTH_ERROR: "외부 데이터 인증 설정을 확인해야 합니다.",
  RATE_LIMITED: "외부 데이터 호출 한도에 도달했습니다."
};

# AGENTS.md

# 프로젝트 미션

## 프로젝트명

**뭐하지?**

## 프로젝트 유형

**PlayMCP MCP Server**

## 핵심 사용자 의도

- 오늘 뭐하지?
- 내일 뭐하지?
- 이번 주말 뭐하지?

## 핵심 추천 요소

1. 날씨 / 불쾌지수
2. 거리
3. 무료 여부
4. 혼잡도

## 미션

뭐하지?의 미션은 사용자가 “오늘 뭐하지?”, “내일 뭐하지?”, “이번 주말 뭐하지?”라는 짧은 질문만으로 서울에서 지금 또는 가까운 미래에 실제로 실행 가능한 활동을 결정하도록 돕는 것이다.

이 서비스는 장소 검색 서비스가 아니다. 이 서비스는 사용자의 현재 맥락, 날씨, 불쾌지수, 거리, 무료 여부, 혼잡도, 시간, 동행자 조건을 종합하여 **행동 가능한 추천**을 제공하는 Agentic AI MCP Server이다.

사용자는 수많은 장소 목록을 원하지 않는다. 사용자는 실패 확률이 낮고, 이유가 명확하며, 지금 자신의 상황에 맞는 3~5개의 선택지를 원한다.

## 존재 이유

사람들은 여가 결정을 할 때 여러 앱을 오간다.

- 날씨 앱에서 날씨 확인
- 지도 앱에서 거리 확인
- 행사 사이트에서 이벤트 검색
- 블로그에서 후기 확인
- 공공 사이트에서 무료 여부 확인
- 실시간 도시데이터에서 혼잡도 추정

뭐하지?는 이 분산된 판단 과정을 MCP Tool과 추천 엔진으로 통합한다. 사용자는 한 문장을 입력하고, 시스템은 데이터 기반으로 추천하고 설명한다.

## 성공 기준

프로젝트는 다음 기준을 만족해야 성공이다.

- PlayMCP에서 MCP Tool이 정상 discover된다.
- `today_what_to_do`, `tomorrow_what_to_do`, `weekend_what_to_do`가 정상 동작한다.
- 추천은 날씨, 불쾌지수, 거리, 무료 여부, 혼잡도를 반영한다.
- 모든 추천에는 이유와 데이터 근거가 포함된다.
- 서울 외 장소를 기본 추천하지 않는다.
- 외부 API 일부 실패 시에도 partial success 응답을 제공한다.
- 사용자가 추천 결과를 보고 바로 행동할 수 있다.
- 공모전 기준인 창의성, 편의성, 안정성을 명확히 보여준다.

---

# 개발 철학

AI coding agent는 다음 원칙을 따라야 한다.

1. 사용자 맥락이 원시 데이터보다 중요하다.
2. 추천 개수보다 추천 품질이 중요하다.
3. 다양성을 위해 정확성을 희생하지 않는다.
4. 추천은 반드시 행동 가능해야 한다.
5. 날씨와 불쾌지수는 항상 추천에 반영한다.
6. 사용자에게 많은 선택지를 던지지 않는다.
7. 기본 추천 개수는 3개, 최대 5개를 넘지 않는다.
8. 무료 여부가 불명확하면 무료로 간주하지 않는다.
9. 혼잡도 정보가 없으면 없다고 말한다.
10. 외부 API 응답은 절대 신뢰하지 말고 검증한다.
11. 데이터가 없으면 추측하지 않는다.
12. 추천 설명은 실제 데이터와 reason code에서만 생성한다.
13. 공공 API 실패는 전체 서비스 실패가 아니다.
14. partial success는 정상적인 제품 경험이다.
15. MCP Tool은 사용자 의도 단위로 설계한다.
16. 내부 서비스는 단일 책임 원칙을 따른다.
17. Provider별 응답 형식은 adapter 내부에 격리한다.
18. Scoring logic은 deterministic해야 한다.
19. 테스트 없는 scoring 변경은 금지한다.
20. 위치 개인정보는 최소한으로 사용한다.
21. 정확한 좌표를 로그에 남기지 않는다.
22. API key는 코드나 로그에 노출하지 않는다.
23. 캐시는 공공 데이터 중심으로 사용한다.
24. 사용자 개인 데이터는 MVP에서 저장하지 않는다.
25. UX 메시지는 솔직해야 한다.
26. “확인 불가”는 좋은 fallback이다.
27. 에러를 숨기지 말고 사용자에게 이해 가능한 warning으로 변환한다.
28. 오늘 추천은 즉시성을 우선한다.
29. 내일 추천은 예보와 시간대 적합성을 우선한다.
30. 주말 추천은 서울 전역 탐색과 무료 여부를 더 강하게 반영한다.

---

# 필수 규칙

## 아키텍처 규칙

1. MCP Server가 프로젝트의 중심 실행 단위여야 한다.
2. public MCP Tool은 `today_what_to_do`, `tomorrow_what_to_do`, `weekend_what_to_do` 세 개를 기본으로 한다.
3. 저수준 외부 API 호출 기능을 public MCP Tool로 노출하지 않는다.
4. Weather, Event, Congestion, Location, Recommendation, Scoring, Cache Service를 분리한다.
5. 외부 API 호출은 반드시 Provider Adapter를 통해 수행한다.
6. Provider 응답 형식을 Recommendation Engine으로 직접 넘기지 않는다.
7. 내부 표준 타입인 `ActivityCandidate`, `WeatherSnapshot`, `CongestionResult`, `RankedRecommendation`을 사용한다.
8. Recommendation Engine은 네트워크 호출을 수행하지 않는다.
9. Scoring Service는 pure function에 가깝게 유지한다.
10. Response Composer는 scoring과 데이터 조회를 수행하지 않는다.
11. Tool handler는 오케스트레이션만 담당하고 세부 계산은 서비스에 위임한다.
12. 환경 변수 로딩과 검증은 `config/env.ts`에서 수행한다.
13. 모든 시간 계산은 `Asia/Seoul` 기준으로 한다.
14. 추천 캐시 key에는 scoring version을 포함할 수 있어야 한다.
15. future extension을 위해 공유, 캘린더, Plan B 자동 추천 서비스를 분리 가능한 구조로 둔다.

## 코딩 규칙

16. 언어는 TypeScript를 사용한다.
17. 런타임은 Node.js 22 LTS를 기준으로 한다.
18. any 사용은 금지한다. 불가피하면 이유를 주석으로 남긴다.
19. 외부 입력은 모두 Zod 또는 JSON Schema로 검증한다.
20. null 가능 필드는 타입에 명시한다.
21. 함수 이름은 동사로 시작한다.
22. 클래스와 타입 이름은 PascalCase를 사용한다.
23. 변수와 함수는 camelCase를 사용한다.
24. 상수는 UPPER_SNAKE_CASE 또는 명확한 const object를 사용한다.
25. 파일명은 역할이 드러나야 한다.
26. 한 파일에 여러 책임을 넣지 않는다.
27. provider-specific parsing logic은 provider 파일 안에 둔다.
28. scoring rule은 별도 파일로 분리한다.
29. 테스트 fixture는 `tests/fixtures`에 둔다.
30. console.log 대신 structured logger를 사용한다.

## MCP 구현 규칙

31. Tool 이름은 snake_case를 사용한다.
32. Tool 이름은 변경하지 않는다.
33. Tool 설명은 사용 시점과 intent 차이를 명확히 설명해야 한다.
34. Tool input schema는 required와 optional을 명확히 구분해야 한다.
35. Tool output은 항상 공통 envelope 구조를 따른다.
36. Tool은 정상 응답, partial success, error 응답을 모두 처리해야 한다.
37. Tool response에는 request_id가 포함되어야 한다.
38. Tool response에는 generated_at이 포함되어야 한다.
39. Tool response에는 warnings와 missing_data 배열이 포함되어야 한다.
40. Tool은 result_limit을 최대 5로 제한해야 한다.

## 추천 품질 규칙

41. 서울 외 장소는 기본 추천하지 않는다.
42. 사용자가 서울 외 위치를 제공하면 warning을 반환하고 서울 범위 추천 여부를 명확히 한다.
43. 종료된 행사는 추천하지 않는다.
44. 현재 시간이 지난 행사는 오늘 추천에서 제외한다.
45. 예약 필수 행사는 오늘 추천에서 감점한다.
46. 무료 요청 시 가격 정보 없음 후보를 무료로 취급하지 않는다.
47. 비 예보가 있으면 실외 후보를 감점한다.
48. 불쾌지수 높음 이상이면 실외 후보를 감점한다.
49. 폭염에서는 실내 후보를 우선한다.
50. 혼잡도 높음 후보는 감점한다.
51. 추천 이유는 반드시 실제 데이터에 기반해야 한다.
52. 후보 source URL이 있으면 보존한다.
53. 데이터 기준 시각을 응답 metadata에 포함한다.
54. 추천 점수는 0~100 사이로 clamp한다.
55. 동점 후보는 confidence, 날씨 적합도, 이동 시간, 무료 여부, 혼잡도 순으로 정렬한다.

## API 연동 규칙

56. 모든 외부 API 호출에는 timeout을 설정한다.
57. retry는 기본 1회만 수행한다.
58. auth error는 retry하지 않는다.
59. rate limit 발생 시 즉시 반복 호출하지 않는다.
60. malformed response는 provider 오류로 처리한다.
61. empty response는 provider 상태가 정상이라면 정상 empty로 처리한다.
62. API key가 포함된 URL을 로그에 남기지 않는다.
63. provider 응답은 fixture로 테스트한다.
64. provider schema 변경 가능성을 고려해 parser를 방어적으로 작성한다.
65. API 실패 시 캐시 fallback을 먼저 시도한다.

## 테스트 규칙

66. scoring 변경에는 반드시 unit test가 필요하다.
67. 날씨 분류 변경에는 경계값 테스트가 필요하다.
68. 무료 여부 파서 변경에는 한국어 요금 텍스트 테스트가 필요하다.
69. MCP Tool schema 변경에는 Tool validation test가 필요하다.
70. provider parser 변경에는 fixture test가 필요하다.
71. partial success는 integration test로 검증한다.
72. no candidate 상황은 반드시 테스트한다.
73. API key 누출 방지 테스트를 추가한다.
74. 추천 품질 테스트는 폭염, 비, 무료 요청, 혼잡 상황을 포함해야 한다.
75. 배포 전 `npm test`와 `npm run build`가 통과해야 한다.

## 배포 규칙

76. Dockerfile은 multi-stage build를 사용한다.
77. production image에는 dev dependency를 포함하지 않는다.
78. `.env` 파일은 image와 repository에 포함하지 않는다.
79. `.env.example`은 최신 상태를 유지한다.
80. PlayMCP in KC 배포 전 Tool discovery를 검증한다.
81. 배포 후 세 public Tool을 최소 1회 호출한다.
82. production secret 누락 시 서버는 명확히 실패해야 한다.
83. mock mode는 production에서 기본 활성화하면 안 된다.
84. release 전 README의 실행 방법이 실제와 일치해야 한다.
85. 배포 artifact에 API key가 포함되면 안 된다.

---

# 작업 실행 정책

AI coding agent는 작업 시작 전 반드시 다음 문서를 읽어야 한다.

1. `PRD.md`
2. `customer.md`
3. `architecture.md`
4. `tasks.md`
5. `AGENTS.md`

## 실행 원칙

- `tasks.md`의 Phase 순서를 따른다.
- 의존성이 완료되지 않은 Task를 시작하지 않는다.
- Acceptance Criteria를 만족하기 전 다음 Task로 넘어가지 않는다.
- P0 Task를 우선 수행한다.
- Nice-to-Have Task는 MVP Task가 완료된 뒤 수행한다.
- Technical Debt를 새로 만들면 `tasks.md` 또는 별도 debt 목록에 기록한다.
- 구현 중 아키텍처 변경이 필요하면 `architecture.md`와 `AGENTS.md`의 원칙을 우선한다.

## 작업 흐름

1. 현재 Task ID를 확인한다.
2. Task의 dependencies를 확인한다.
3. 관련 문서를 다시 읽는다.
4. 기존 코드 구조를 확인한다.
5. 최소 범위로 구현한다.
6. 관련 테스트를 작성한다.
7. 테스트를 실행한다.
8. Acceptance Criteria를 확인한다.
9. 문서 변경이 필요하면 함께 수정한다.
10. 변경 사항을 요약한다.

---

# MCP Tool 규칙

## 공통 규칙

- Tool 이름은 변경하지 않는다.
- Tool input은 JSON-compatible object여야 한다.
- Tool output은 JSON-compatible object여야 한다.
- Tool은 exception을 그대로 외부로 노출하지 않는다.
- Tool은 `success`, `partial_success`, `error` 상태를 명확히 반환한다.
- Tool 응답은 추천 결과가 없어도 구조가 유지되어야 한다.

## `today_what_to_do`

### 목적

오늘 바로 실행 가능한 활동을 추천한다.

### 규칙

- 현재 시각 이후 이용 가능한 후보만 추천한다.
- 거리 가중치를 가장 강하게 반영한다.
- 예약 필수 후보는 감점한다.
- 곧 종료되는 후보는 감점한다.
- 날씨가 나쁘면 실내 후보를 우선한다.
- 위치가 없으면 서울 전체 추천으로 degrade하고 warning을 포함한다.

## `tomorrow_what_to_do`

### 목적

내일 하루 또는 반나절 계획에 적합한 활동을 추천한다.

### 규칙

- 내일 날짜에 유효한 후보만 추천한다.
- 내일 예보를 사용한다.
- 사용자가 시간대를 지정하면 운영 시간과 겹쳐야 한다.
- 날씨 가중치를 높게 반영한다.
- 예약 필요 여부를 명시하거나 감점한다.

## `weekend_what_to_do`

### 목적

다가오는 주말에 적합한 활동을 추천한다.

### 규칙

- `Asia/Seoul` 기준 다가오는 토요일/일요일을 계산한다.
- 현재 날짜가 토요일이면 남은 토요일과 일요일을 포함한다.
- 서울 전역 후보를 허용한다.
- 무료 여부 가중치를 오늘/내일보다 높인다.
- 토/일 날씨를 비교해 best_day를 제안할 수 있다.
- 비 또는 폭염 위험이 있으면 Plan B 여부를 표시한다.

## 스키마 규칙

- `query`는 필수이다.
- `result_limit`은 1~5 사이이다.
- `language`는 MVP에서 `ko`, `en`만 허용한다.
- `companions`는 `solo`, `couple`, `family`, `friends`, `tourist`, `unknown` 중 하나이다.
- `transport_mode`는 `walking`, `public_transit`, `driving` 중 하나이다.
- 좌표는 합리적인 한국 주변 범위로 제한한다.

---

# 추천 규칙

## 기본 원칙

추천은 반드시 다음 요소를 반영한다.

1. Weather / Discomfort Index
2. Distance
3. Free Admission
4. Congestion

날씨는 모든 intent에서 강하게 반영한다. 단, today mode에서는 거리도 매우 중요하다. weekend mode에서는 서울 전역 추천이 가능하므로 거리 감점은 완만하게 적용한다.

## 날씨 규칙

- 강수 확률 60% 이상이면 실내 후보를 우선한다.
- 불쾌지수 80 이상이면 실내 후보를 우선한다.
- 폭염/한파에서는 긴 도보 이동 후보를 감점한다.
- 쾌적한 날씨에는 야외 후보를 가중할 수 있다.
- 날씨 데이터가 없으면 날씨 적합성을 주장하지 않는다.

## 거리 규칙

- 오늘은 이동 시간이 짧을수록 강하게 우대한다.
- 내일은 중간 거리까지 허용한다.
- 주말은 더 넓은 서울 전역 탐색을 허용한다.
- 거리 정보가 없으면 추천 confidence를 낮춘다.
- routing provider 실패 시 haversine fallback을 사용하고 warning을 표시한다.

## 무료 여부 규칙

- 무료 후보는 우대한다.
- 사용자가 무료를 명시하면 무료 후보를 우선한다.
- 가격 정보 없음은 무료가 아니다.
- 가격 정보 없음 후보는 “가격 확인 필요”로 표시한다.

## 혼잡도 규칙

- 혼잡도가 높은 장소는 감점한다.
- 혼잡도 정보가 없으면 score 60과 confidence low를 사용한다.
- 혼잡도 정보가 근사 매핑이면 confidence medium 또는 low를 사용한다.
- 사용자가 조용한 곳을 요청하면 혼잡도 감점을 강화한다.

## 예시

### 폭염 오늘 추천

- 실내 무료 전시: 높은 점수
- 야외 축제: 낮은 점수
- 가까운 실내 도서관 프로그램: 높은 점수

### 비 오는 주말 추천

- 실내 박물관: 높은 점수
- 한강 피크닉: 낮은 점수
- 실내 무료 공연: 높은 점수

### 무료 데이트 요청

- 무료 전시: 높은 점수
- 가격 미상 팝업: 중간 또는 낮은 점수
- 고가 공연: 낮은 점수

---

# 코딩 표준

## 언어와 런타임

- Language: TypeScript
- Runtime: Node.js 22 LTS
- Validation: Zod 또는 JSON Schema
- Test: Vitest

## 네이밍

- 파일명: 역할 중심 camelCase 또는 PascalCase
- 타입/클래스: PascalCase
- 함수/변수: camelCase
- 상수: UPPER_SNAKE_CASE 또는 const object
- MCP Tool: snake_case

## 폴더 규칙

```text
src/
  server/
  tools/
  services/
  config/
  errors/
  observability/
  utils/
tests/
  unit/
  integration/
  fixtures/
```

## 타입 규칙

- 외부 API 응답 타입과 내부 정규화 타입을 분리한다.
- null 가능성은 타입에 명시한다.
- unknown은 parsing boundary에서만 허용한다.
- any는 사용하지 않는다.
- public Tool input/output 타입은 테스트한다.

## 오류 처리 규칙

- provider 오류는 `AppError` 또는 typed error로 변환한다.
- 사용자에게 내부 stack trace를 노출하지 않는다.
- secret이 포함된 메시지를 error에 넣지 않는다.
- partial success는 정상 응답 경로로 처리한다.

---

# API Integration Rules

## Timeout

- Weather provider: 2.5초
- Event provider: 3초
- Congestion provider: 2초
- Distance provider: 2초
- 전체 Tool 실행: 8초

## Retry

- 기본 retry는 1회이다.
- timeout, network error, provider server error는 retry 가능하다.
- auth error, validation error는 retry하지 않는다.
- retry에는 짧은 jitter를 적용한다.

## Validation

- 모든 외부 응답은 parser를 통과해야 한다.
- 필수 필드 누락 시 null 또는 typed error로 처리한다.
- provider별 이상 응답은 fixture로 추가한다.

## Fallback

- provider 실패 시 fresh cache 조회
- fresh cache 실패 시 stale cache 조회
- stale cache 실패 시 중립 점수 또는 fallback 추천
- fallback 사용 시 warning과 metadata 표시

---

# Data Quality Rules

## 금지 사항

- 존재하지 않는 행사를 만들지 않는다.
- 가격을 추측하지 않는다.
- 혼잡도를 추측하지 않는다.
- 운영 시간을 추측하지 않는다.
- source가 없는 외부 링크를 만들지 않는다.
- 서울 외 장소를 서울 추천처럼 제시하지 않는다.

## 검증 요구사항

- 행사 날짜가 요청 날짜와 겹쳐야 한다.
- 오늘 추천은 현재 시각 이후 이용 가능해야 한다.
- 종료된 행사는 제외한다.
- 가격 텍스트는 원본을 보존한다.
- 좌표가 없으면 거리 confidence를 낮춘다.
- source timestamp를 metadata에 포함한다.
- URL이 있으면 원본 URL을 보존한다.
- broken link 여부를 검증할 수 없으면 링크 신뢰도를 과장하지 않는다.

---

# Testing Standards

## Unit Test Coverage

권장 최소 기준:

- Scoring Service: 90% 이상
- Weather Intelligence: 90% 이상
- Price Parser: 90% 이상
- Event Filtering: 85% 이상
- Congestion Mapping: 80% 이상

## Integration Test Requirements

통합 테스트는 mock provider를 사용한다.

필수 시나리오:

- 오늘 폭염 실내 추천
- 내일 비 예보 실내 추천
- 주말 무료 데이트 추천
- 혼잡도 API 실패 partial success
- 행사 API 실패 fallback
- 위치 없음 warning

## MCP Tool Testing

각 public Tool은 다음을 테스트한다.

- 정상 입력
- query 누락
- result_limit 초과
- 잘못된 좌표
- provider 실패
- no candidates
- partial success

## Recommendation Engine Validation

추천 품질 테스트는 순위를 검증해야 한다.

- 폭염에서는 실내 후보가 야외 후보보다 높아야 한다.
- 비 예보에서는 실내 후보가 야외 후보보다 높아야 한다.
- 무료 요청에서는 무료 후보가 가격 미상 후보보다 높아야 한다.
- 혼잡도 높음 후보는 보통 후보보다 낮아야 한다.
- 오늘 intent에서는 가까운 후보가 강하게 우대되어야 한다.

---

# Deployment Rules

## Target

**PlayMCP in KC**

## Docker Requirements

- multi-stage Dockerfile 사용
- Node.js 22 alpine 기반
- production image에는 dev dependency 제외
- `npm run build` 후 `node dist/index.js` 실행
- `.env`는 image에 포함하지 않음

## Environment Variable Policy

필수 환경 변수:

```text
NODE_ENV
PORT
LOG_LEVEL
CACHE_BACKEND
REDIS_URL
KMA_BASE_URL
KMA_SERVICE_KEY
SEOUL_OPEN_DATA_BASE_URL
SEOUL_OPEN_DATA_API_KEY
SEOUL_CITY_DATA_BASE_URL
SEOUL_CITY_DATA_API_KEY
CULTURE_PORTAL_BASE_URL
CULTURE_PORTAL_SERVICE_KEY
```

규칙:

- `.env.example`은 최신 상태 유지
- secret은 repository에 저장 금지
- production에서 secret 누락 시 fail fast
- local에서는 mock mode 허용

## Endpoint Validation

배포 후 다음을 검증한다.

- MCP Server 시작 성공
- Tool discovery 성공
- 세 public Tool 호출 성공
- 최소 1개 추천 또는 정상 fallback 반환
- 로그에 secret 없음

## Release Process

1. 모든 P0 테스트 통과
2. `npm run build` 성공
3. Docker build 성공
4. local MCP Tool smoke test 성공
5. PlayMCP in KC 배포
6. Tool discovery 확인
7. demo scenario 실행
8. submission checklist 확인

---

# Competition Rules

공모전에서는 모든 기능을 다음 세 기준으로 평가한다.

## 창의성

기능은 단순 검색이 아니라 Agentic AI 경험을 보여줘야 한다.

평가 질문:

- 이 기능이 사용자의 결정을 대신 구조화하는가?
- MCP Tool이 외부 데이터를 의미 있게 조합하는가?
- 단순 장소 목록보다 더 나은 판단을 제공하는가?

## 편의성

기능은 사용자의 검색 부담을 줄여야 한다.

평가 질문:

- 사용자가 한 문장으로 시작할 수 있는가?
- 결과가 바로 행동 가능하게 구성되는가?
- 추천 이유가 이해하기 쉬운가?
- 후속 조건 변경이 쉬운가?

## 안정성

기능은 API 실패와 불완전한 데이터를 견뎌야 한다.

평가 질문:

- 외부 API 실패 시 partial success가 가능한가?
- cache/fallback이 동작하는가?
- 데이터 누락을 솔직히 표시하는가?
- 테스트로 핵심 시나리오가 검증되는가?

---

# User Experience Rules

## 응답 구조

응답은 다음 순서를 따른다.

1. 현재 또는 대상 날짜 상태 요약
2. 날씨/불쾌지수 요약
3. 추천 방향
4. 추천 3~5개
5. 추천 이유
6. warning 또는 missing data
7. source/freshness metadata

## 추천 설명 형식

추천 설명은 다음 요소를 포함한다.

- 왜 날씨에 맞는지
- 왜 거리상 적합한지
- 무료 또는 비용 조건이 어떤지
- 혼잡도 상태가 어떤지
- 데이터가 누락되었는지

예시:

```text
현재 불쾌지수가 높아 실내 활동을 우선했습니다. 이 장소는 무료이며 대중교통으로 약 30분 거리입니다. 혼잡도는 보통으로 확인되어 오늘 방문하기 적합합니다.
```

## Fallback Messaging

fallback 메시지는 변명처럼 보이면 안 된다. 사용자가 이해할 수 있게 간결하게 말한다.

예시:

```text
혼잡도 정보는 현재 확인하지 못했습니다. 대신 날씨, 거리, 무료 여부를 기준으로 추천했습니다.
```

## Confidence Indicators

confidence는 다음처럼 사용한다.

- high: 정확한 source와 직접 매핑
- medium: 근사 매핑 또는 일부 필드 추론
- low: 데이터 누락 또는 fallback 사용

confidence가 낮으면 추천 설명에서 과장하지 않는다.

---

# Anti-Patterns

다음 패턴은 금지한다.

1. 거리만 기준으로 추천하기
   - 날씨와 혼잡도를 무시하면 실패 확률이 높다.

2. 날씨 경고를 무시하기
   - 폭염/비/한파에서 부적절한 추천을 만들 수 있다.

3. 불쾌지수를 계산하고도 랭킹에 반영하지 않기
   - PRD의 핵심 가치와 어긋난다.

4. 무료 요청에 가격 미상 장소를 무료로 추천하기
   - 사용자 신뢰를 손상한다.

5. 존재하지 않는 행사를 생성하기
   - 데이터 hallucination이다.

6. source 없는 URL 만들기
   - broken link와 허위 정보 위험이 있다.

7. 서울 외 장소를 기본 추천하기
   - MVP 범위를 벗어난다.

8. 종료된 행사를 추천하기
   - 실행 불가능한 추천이다.

9. 오늘 추천에 예약 필수 행사를 상위 노출하기
   - 즉시성 intent와 맞지 않는다.

10. 혼잡도 API 실패 시 조용하다고 말하기
    - 확인되지 않은 정보를 주장하는 것이다.

11. 모든 후보를 같은 카테고리로만 반환하기
    - 사용자 선택 경험이 단조로워진다.

12. 다양성을 위해 날씨 부적합 후보를 올리기
    - 다양성이 정확성을 이기면 안 된다.

13. Tool handler에 모든 로직을 넣기
    - 유지보수성과 테스트 가능성이 떨어진다.

14. provider 응답을 내부 전체에 퍼뜨리기
    - API schema 변경에 취약해진다.

15. scoring을 프롬프트로만 처리하기
    - 결정성과 테스트 가능성이 사라진다.

16. 테스트 없이 weight를 바꾸기
    - 추천 품질 회귀가 발생한다.

17. API key를 로그에 남기기
    - 보안 사고이다.

18. 정확 좌표를 로그에 남기기
    - 개인정보 위험이다.

19. timeout 없는 외부 호출
    - Tool 전체가 멈출 수 있다.

20. retry를 무제한 수행하기
    - rate limit과 장애를 악화한다.

21. partial success를 error로 취급하기
    - 대화형 UX를 망친다.

22. empty result를 무조건 provider 실패로 처리하기
    - 정상적으로 후보가 없을 수 있다.

23. no candidate 상황에서 빈 응답만 반환하기
    - 사용자가 다음 행동을 알 수 없다.

24. warning 없이 fallback 사용하기
    - 신뢰성을 해친다.

25. 오래된 캐시를 fresh처럼 표시하기
    - 데이터 품질을 속이는 것이다.

26. 주말 intent에 오늘 거리 기준을 적용하기
    - 주말 탐색성을 해친다.

27. 오늘 intent에 서울 전역 먼 장소를 우선 추천하기
    - 즉시성과 맞지 않는다.

28. 사용자 동행자 맥락을 무시하기
    - 가족/커플/혼자 상황에 부적합해진다.

29. 설명 없는 점수만 반환하기
    - 사용자가 추천을 신뢰하기 어렵다.

30. 문서와 다른 Tool 이름을 사용하기
    - PlayMCP discover와 호출이 깨진다.

31. result_limit을 제한하지 않기
    - 응답이 길어지고 결정 피로가 커진다.

32. 운영 시간 파싱 실패 시 방문 가능하다고 가정하기
    - 실행 불가능 추천 위험이 있다.

33. 공모전 데모를 실제 API만 믿고 준비하기
    - 네트워크 장애 시 시연 실패 가능성이 있다.

34. mock mode와 production mode를 구분하지 않기
    - 운영 신뢰성과 데모 안정성을 모두 해친다.

35. README와 실제 실행 방법이 다른 상태로 제출하기
    - 심사와 유지보수에 치명적이다.

---

# Agent Workflow

AI coding agent는 다음 순서로 작업한다.

## 1. 프로젝트 문서 읽기

작업 시작 전 다음 파일을 확인한다.

- `PRD.md`
- `customer.md`
- `architecture.md`
- `tasks.md`
- `AGENTS.md`

## 2. Task 선택

- `tasks.md`에서 가장 앞선 미완료 P0 Task를 선택한다.
- dependencies가 완료되었는지 확인한다.
- dependencies가 완료되지 않았으면 선행 Task를 먼저 수행한다.

## 3. 구현

- Task 범위 안에서만 구현한다.
- 관련 타입과 테스트를 함께 작성한다.
- 기존 architecture를 임의로 우회하지 않는다.

## 4. 테스트

- 해당 Task의 unit test를 실행한다.
- 관련 integration test가 있으면 실행한다.
- 전체 영향이 크면 `npm test`를 실행한다.

## 5. AGENTS.md 검증

다음 질문을 확인한다.

- 서울 범위를 지켰는가?
- 날씨와 불쾌지수가 반영되는가?
- 가격 미상 처리가 안전한가?
- API 실패 fallback이 있는가?
- 추천 이유가 데이터 기반인가?
- secret과 위치 정보가 안전한가?

## 6. 변경 정리

- 변경 파일을 확인한다.
- 불필요한 변경을 제거한다.
- 문서 수정이 필요하면 함께 반영한다.

## 7. 커밋

사용자가 커밋을 요청한 경우에만 커밋한다. 커밋 메시지는 Task ID를 포함한다.

예시:

```text
TASK-206 implement discomfort index calculation
```

## 8. 다음 Task로 이동

Acceptance Criteria가 모두 충족된 경우에만 다음 Task로 이동한다.

---

# Definition of Done

Task가 완료되려면 다음 조건을 모두 만족해야 한다.

## 공통 완료 조건

- Task의 Acceptance Criteria가 모두 충족되었다.
- 관련 코드가 TypeScript 컴파일을 통과한다.
- 관련 테스트가 통과한다.
- 새 public API 또는 Tool schema 변경 시 문서가 갱신되었다.
- 오류 처리 경로가 구현되었다.
- secret이 코드나 로그에 노출되지 않는다.
- raw 정확 좌표가 로그에 남지 않는다.
- lint 또는 typecheck가 통과한다.
- 구현이 architecture.md와 충돌하지 않는다.
- 구현이 AGENTS.md mandatory rules를 위반하지 않는다.

## MCP Tool 완료 조건

- Tool이 MCP Server에 등록되어 있다.
- Tool description이 명확하다.
- input schema가 검증된다.
- output envelope가 일관된다.
- success, partial_success, error 경로가 존재한다.
- Tool integration test가 있다.

## Service 완료 조건

- 입력/출력 타입이 정의되어 있다.
- provider 오류를 typed error로 변환한다.
- cache 또는 fallback 정책이 명확하다.
- fixture 또는 unit test가 있다.
- service가 단일 책임을 유지한다.

## Recommendation 완료 조건

- 점수 공식이 구현되어 있다.
- reason code가 생성된다.
- penalty가 적용된다.
- tie-break 또는 deterministic sort가 있다.
- 추천 설명이 실제 데이터 기반이다.
- ranking 품질 테스트가 있다.

## Deployment 완료 조건

- Docker build가 성공한다.
- production start가 성공한다.
- PlayMCP에서 Tool discovery가 가능하다.
- 세 Tool이 최소 smoke test를 통과한다.
- `.env.example`이 최신이다.

## Competition 완료 조건

- 창의성, 편의성, 안정성 관점에서 설명 가능하다.
- 데모 시나리오가 준비되어 있다.
- API 장애 시 fallback demo가 가능하다.
- 제출 체크리스트가 완료되어 있다.

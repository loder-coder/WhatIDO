# Phase 0 — 프로젝트 셋업

## Goal

`뭐하지?` PlayMCP MCP Server 프로젝트의 기본 개발 환경, repository 구조, 빌드/테스트 기반, 환경 변수 템플릿을 준비한다.

## Deliverables

- Node.js + TypeScript 기반 프로젝트
- 표준 디렉터리 구조
- package scripts
- TypeScript 설정
- lint/format/test 기반
- `.env.example`
- 기본 README

## Tasks

* [ ] TASK-001 프로젝트 기본 구조 생성
  - **Description**: `src`, `tests`, `config`, `services`, `tools`, `server`, `errors`, `observability`, `utils` 디렉터리를 생성한다.
  - **Priority**: P0
  - **Dependencies**: 없음
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - `src/index.ts`가 존재한다.
    - `src/server`, `src/tools`, `src/services` 하위 디렉터리가 존재한다.
    - 테스트 디렉터리 `tests/unit`, `tests/integration`, `tests/fixtures`가 존재한다.

* [ ] TASK-002 Node.js/TypeScript 프로젝트 초기화
  - **Description**: `package.json`, `tsconfig.json`, TypeScript 빌드 설정을 구성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-001
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - `npm run build`가 TypeScript 컴파일을 수행한다.
    - `dist/` 출력이 생성된다.
    - ES module 또는 CommonJS 설정이 MCP SDK 사용 방식과 일관된다.

* [ ] TASK-003 필수 dependency 설치
  - **Description**: MCP SDK, Zod, 테스트 도구, 로깅 도구, dotenv, fetch/http client를 설치한다.
  - **Priority**: P0
  - **Dependencies**: TASK-002
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - MCP SDK import가 가능하다.
    - Zod schema validation 테스트가 가능하다.
    - Vitest 기반 테스트 실행이 가능하다.

* [ ] TASK-004 package scripts 정의
  - **Description**: 개발, 빌드, 테스트, 타입체크, start script를 정의한다.
  - **Priority**: P0
  - **Dependencies**: TASK-002
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - `npm run build` 성공
    - `npm test` 성공
    - `npm run typecheck` 성공
    - `npm start`가 빌드된 서버를 실행

* [ ] TASK-005 환경 변수 관리 모듈 구현
  - **Description**: `src/config/env.ts`에서 환경 변수를 읽고 검증한다.
  - **Priority**: P0
  - **Dependencies**: TASK-003
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 필수 production secret 누락 시 명확한 오류 발생
    - local/mock mode에서는 외부 API key 없이 실행 가능
    - `.env.example`에 모든 필요한 키가 문서화됨

* [ ] TASK-006 기본 README 작성
  - **Description**: 설치, 실행, 테스트, 환경 변수, MCP Tool 목록을 README에 정리한다.
  - **Priority**: P1
  - **Dependencies**: TASK-004
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 신규 개발자가 README만 보고 로컬 실행 가능
    - Tool 이름과 목적이 명시됨

## Acceptance Criteria

- 로컬에서 `npm install`, `npm run build`, `npm test`가 동작한다.
- 프로젝트 구조가 architecture.md의 권장 구조와 일치한다.
- 환경 변수 누락 시 명확한 오류 또는 mock fallback이 동작한다.

## Dependencies

- Node.js 22 LTS
- npm
- TypeScript

## Estimated Complexity

S

---

# Phase 1 — MCP Foundation

## Goal

PlayMCP에서 discover 가능한 MCP Server 기반을 구현하고, Tool 등록과 health check를 준비한다.

## Deliverables

- MCP Server 생성 모듈
- Tool registry
- Health check
- 공통 Tool context
- 기본 public tool placeholder

## Tasks

* [ ] TASK-101 MCP Server entrypoint 구현
  - **Description**: `src/index.ts`에서 MCP Server를 생성하고 실행한다.
  - **Priority**: P0
  - **Dependencies**: TASK-005
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 서버가 정상 시작된다.
    - 시작 시 등록된 Tool 수를 로그로 출력한다.
    - process 종료 신호를 graceful하게 처리한다.

* [ ] TASK-102 `createMcpServer` 구현
  - **Description**: MCP SDK를 사용해 서버 인스턴스를 생성하는 factory를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-101
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 서버 이름이 `뭐하지?` 또는 `whatdowedo`로 설정된다.
    - 버전 정보가 포함된다.
    - MCP SDK 초기화 오류가 명확히 처리된다.

* [ ] TASK-103 Tool registration 모듈 구현
  - **Description**: `registerTools.ts`에서 public MCP Tool을 등록한다.
  - **Priority**: P0
  - **Dependencies**: TASK-102
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - `today_what_to_do`, `tomorrow_what_to_do`, `weekend_what_to_do`가 등록된다.
    - 각 Tool은 임시 placeholder 응답이라도 반환한다.
    - Tool 설명이 PlayMCP에서 이해 가능한 수준으로 작성된다.

* [ ] TASK-104 Tool Context 구현
  - **Description**: request id, logger, config, service container를 포함하는 Tool context를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-103
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 각 Tool 호출마다 고유 request id가 생성된다.
    - context에서 서비스 접근이 가능하다.
    - logs에 request id가 포함된다.

* [ ] TASK-105 Health check 구현
  - **Description**: 서버 상태, Tool 등록 상태, 필수 config 상태를 확인하는 health check를 구현한다.
  - **Priority**: P1
  - **Dependencies**: TASK-104
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - health check가 OK/FAIL 상태를 반환한다.
    - 등록된 Tool 목록을 확인할 수 있다.
    - production secret 누락 여부를 확인할 수 있다.

* [ ] TASK-106 MCP Tool discovery 검증 테스트
  - **Description**: MCP Server가 세 public tool을 discover 가능하게 노출하는지 테스트한다.
  - **Priority**: P0
  - **Dependencies**: TASK-103
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 테스트에서 세 Tool 이름이 확인된다.
    - Tool 설명이 비어 있지 않다.
    - Tool input schema가 존재한다.

## Acceptance Criteria

- MCP Server가 로컬에서 실행된다.
- PlayMCP 또는 MCP client가 Tool 목록을 discover할 수 있다.
- public Tool 세 개가 등록된다.

## Dependencies

- Phase 0
- MCP SDK

## Estimated Complexity

M

---

# Phase 2 — Weather Service

## Goal

기상청 API 연동, 날씨 정규화, 불쾌지수 계산, 실내/실외 적합도 분류를 구현한다.

## Deliverables

- `WeatherService`
- `KmaWeatherProvider`
- 기상청 격자 변환 유틸
- 불쾌지수 계산기
- 날씨 적합도 분류기
- 단위 테스트

## Tasks

* [ ] TASK-201 Weather 타입 정의
  - **Description**: `WeatherRequest`, `WeatherSnapshot`, `WeatherRisk`, `WeatherSourceMetadata` 타입을 정의한다.
  - **Priority**: P0
  - **Dependencies**: TASK-001
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - TypeScript 타입이 architecture.md의 출력 구조와 일치한다.
    - null 가능 필드가 명확히 정의된다.

* [ ] TASK-202 기상청 격자 변환 유틸 구현
  - **Description**: WGS84 위도/경도를 기상청 nx/ny 격자로 변환한다.
  - **Priority**: P0
  - **Dependencies**: TASK-201
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 서울 주요 좌표 변환 테스트가 통과한다.
    - 잘못된 좌표 입력 시 validation error를 반환한다.

* [ ] TASK-203 KMA Provider 기본 클라이언트 구현
  - **Description**: KMA API 호출 client를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-202, TASK-005
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - base URL과 service key를 env에서 읽는다.
    - timeout 2.5초가 적용된다.
    - API key가 로그에 노출되지 않는다.

* [ ] TASK-204 초단기실황 조회 구현
  - **Description**: `getUltraSrtNcst` 계열 API를 호출하고 현재 기온/습도/강수 정보를 추출한다.
  - **Priority**: P0
  - **Dependencies**: TASK-203
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - fixture 기반 응답 파싱 테스트가 통과한다.
    - 누락 필드는 null로 처리된다.

* [ ] TASK-205 단기예보 조회 구현
  - **Description**: `getVilageFcst` 또는 대응 API를 호출해 내일/주말 예보를 조회한다.
  - **Priority**: P0
  - **Dependencies**: TASK-203
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 시간대별 강수 확률, 기온, 습도 파싱 가능
    - base time 미존재 시 이전 base time fallback 가능

* [ ] TASK-206 불쾌지수 계산 구현
  - **Description**: `DI = 0.81T + 0.01H * (0.99T - 14.3) + 46.3` 공식을 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-201
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 기온 34도, 습도 68% 입력 시 예상 범위의 DI 반환
    - DI level이 low/moderate/high/very_high로 분류됨
    - null 입력 시 unknown 처리

* [ ] TASK-207 실내/실외 적합도 분류 구현
  - **Description**: 강수 확률, 불쾌지수, 기온을 기반으로 recommendation bias를 계산한다.
  - **Priority**: P0
  - **Dependencies**: TASK-206
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 강수 확률 60% 이상이면 indoor bias
    - DI 80 이상이면 indoor bias
    - 18~26도, 강수 낮음이면 outdoor bias 또는 mixed

* [ ] TASK-208 Weather Service orchestration 구현
  - **Description**: provider 호출, 캐시 조회, 정규화, 불쾌지수 계산을 하나의 service 메서드로 묶는다.
  - **Priority**: P0
  - **Dependencies**: TASK-204, TASK-205, TASK-206, TASK-207
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - today/tomorrow/weekend mode를 처리한다.
    - 실패 시 `WEATHER_UNAVAILABLE` 오류를 생성한다.
    - source metadata가 포함된다.

## Test Cases

* [ ] TASK-209 불쾌지수 단위 테스트
  - **Priority**: P0
  - **Dependencies**: TASK-206
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 낮음/보통/높음/매우 높음 경계값 테스트 통과

* [ ] TASK-210 날씨 적합도 테스트
  - **Priority**: P0
  - **Dependencies**: TASK-207
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 비/폭염/쾌적 날씨 시나리오별 bias 검증

* [ ] TASK-211 KMA fixture 파싱 테스트
  - **Priority**: P1
  - **Dependencies**: TASK-204, TASK-205
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - fixture 응답에서 필요한 필드가 정확히 추출됨

## Acceptance Criteria

- Weather Service가 `WeatherSnapshot`을 반환한다.
- 불쾌지수와 indoor/outdoor bias가 계산된다.
- API 실패 시 캐시 또는 오류 객체로 graceful하게 처리된다.

## Dependencies

- Phase 0
- Cache Service 일부 또는 mock cache

## Estimated Complexity

M

---

# Phase 3 — Event Service

## Goal

문화포털과 서울 열린데이터 API를 연동하고, 행사/시설 데이터를 내부 `ActivityCandidate`로 정규화한다.

## Deliverables

- `EventService`
- `SeoulEventProvider`
- `CulturePortalProvider`
- 이벤트 정규화 로직
- 무료 여부 파서
- 실내/실외 추론기
- 중복 제거 로직

## Tasks

* [ ] TASK-301 Event 타입 정의
  - **Description**: `ActivityCandidate`, `ActivityCategory`, `EventSearchRequest`, `SourceMetadata` 타입을 정의한다.
  - **Priority**: P0
  - **Dependencies**: TASK-001
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - architecture.md의 후보 스키마와 일치한다.
    - nullable 필드와 source metadata가 포함된다.

* [ ] TASK-302 서울 열린데이터 Provider 구현
  - **Description**: 서울 문화행사 API 호출 client를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-301, TASK-005
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - env 기반 base URL/API key 사용
    - timeout 3초 적용
    - API key 로그 노출 없음

* [ ] TASK-303 서울 문화행사 응답 파싱
  - **Description**: 행사명, 장소, 자치구, 날짜, 시간, 요금, 좌표, URL을 추출한다.
  - **Priority**: P0
  - **Dependencies**: TASK-302
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - fixture 기반 파싱 테스트 통과
    - 좌표 누락 시 null 처리
    - 날짜 범위가 ISO 형식으로 정규화됨

* [ ] TASK-304 문화포털 Provider 구현
  - **Description**: 문화포털 API 연동 provider를 구현한다.
  - **Priority**: P1
  - **Dependencies**: TASK-301, TASK-005
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 문화포털 응답을 후보 형태로 변환 가능
    - 실패 시 서울 열린데이터만으로 계속 가능

* [ ] TASK-305 무료 여부 파서 구현
  - **Description**: 요금 텍스트에서 무료/유료/가격 미상 여부를 추출한다.
  - **Priority**: P0
  - **Dependencies**: TASK-301
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - “무료”, “0원”은 free
    - “유료”, “10,000원”은 paid
    - 빈 문자열 또는 “문의”는 unknown

* [ ] TASK-306 실내/실외 추론 로직 구현
  - **Description**: 카테고리, 장소명, 설명 텍스트를 기반으로 indoor/outdoor를 추론한다.
  - **Priority**: P1
  - **Dependencies**: TASK-301
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 박물관/미술관/도서관/전시는 indoor로 추론
    - 공원/한강/축제/마켓은 outdoor 또는 mixed로 추론
    - 불확실한 경우 null

* [ ] TASK-307 날짜/운영 시간 필터 구현
  - **Description**: today/tomorrow/weekend 요청에 맞는 행사만 남긴다.
  - **Priority**: P0
  - **Dependencies**: TASK-303
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 종료된 행사 제외
    - 오늘 추천에서 현재 시각 이후 이용 가능한 후보만 포함
    - 내일/주말 날짜 범위 필터 정확

* [ ] TASK-308 중복 제거 구현
  - **Description**: 같은 행사/장소가 여러 source에서 들어올 때 deduplicate한다.
  - **Priority**: P1
  - **Dependencies**: TASK-303, TASK-304
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - title + venue + date 기반 중복 제거
    - source 우선순위 적용
    - 중복 제거 테스트 통과

* [ ] TASK-309 Event Service orchestration 구현
  - **Description**: 여러 provider 호출, 정규화, 필터링, dedup을 수행하는 service 메서드를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-302, TASK-303, TASK-305, TASK-307
  - **Estimated Effort**: L
  - **Acceptance Criteria**:
    - 날짜 범위와 자치구 기반 후보 검색 가능
    - 무료 선호 필터 적용 가능
    - provider 하나 실패 시 나머지 provider 결과로 계속

## Acceptance Criteria

- Event Service가 `ActivityCandidate[]`를 반환한다.
- 날짜와 가격, 실내/실외 정보가 정규화된다.
- 중복과 종료된 행사가 제거된다.

## Dependencies

- Phase 0
- Cache Service 또는 mock cache

## Estimated Complexity

L

---

# Phase 4 — Congestion Service

## Goal

서울 실시간 도시데이터 연동과 혼잡도 점수 계산을 구현한다.

## Deliverables

- `CongestionService`
- `SeoulCityDataProvider`
- venue-to-area 매핑
- 혼잡도 정규화
- 혼잡도 점수 계산

## Tasks

* [ ] TASK-401 Congestion 타입 정의
  - **Description**: `CongestionRequest`, `CongestionResult`, `CongestionLevel` 타입을 정의한다.
  - **Priority**: P0
  - **Dependencies**: TASK-301
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - level, score, confidence 필드 포함
    - source metadata optional 포함

* [ ] TASK-402 서울 실시간 도시데이터 Provider 구현
  - **Description**: Area 이름 기반 실시간 도시데이터 API 호출 provider를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-401, TASK-005
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - env 기반 API key 사용
    - timeout 2초 적용
    - 실패 시 typed error 반환

* [ ] TASK-403 혼잡도 응답 파싱
  - **Description**: provider 응답에서 혼잡도 level, 인구 범위, 메시지를 추출한다.
  - **Priority**: P0
  - **Dependencies**: TASK-402
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - fixture 기반 파싱 테스트 통과
    - 알 수 없는 값은 unknown 처리

* [ ] TASK-404 venue-to-area 매핑 테이블 작성
  - **Description**: 서울 주요 장소와 실시간 도시데이터 지원 Area를 매핑하는 정적 데이터를 작성한다.
  - **Priority**: P1
  - **Dependencies**: TASK-401
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 주요 관광/문화 지역 매핑 포함
    - 매핑 실패 시 nearest 또는 unknown 처리 가능

* [ ] TASK-405 혼잡도 점수 계산 구현
  - **Description**: relaxed/normal/slightly_crowded/crowded/very_crowded/unknown을 0~100 점수로 변환한다.
  - **Priority**: P0
  - **Dependencies**: TASK-401
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - relaxed=100
    - normal=80
    - slightly_crowded=55
    - crowded=30
    - very_crowded=10
    - unknown=60

* [ ] TASK-406 후보별 혼잡도 enrich 구현
  - **Description**: 후보 장소를 Area에 매핑하고 혼잡도 결과를 붙인다.
  - **Priority**: P0
  - **Dependencies**: TASK-402, TASK-404, TASK-405
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 정확 매핑 시 confidence high
    - 근사 매핑 시 confidence medium/low
    - 매핑 실패 시 unknown + score 60

## Edge Cases

* [ ] TASK-407 혼잡도 edge case 테스트
  - **Description**: API timeout, 지원하지 않는 Area, unknown level, 중복 Area 호출을 테스트한다.
  - **Priority**: P1
  - **Dependencies**: TASK-406
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - API 실패 시 중립 점수 반환
    - 같은 Area는 중복 호출하지 않음
    - unsupported venue는 confidence low

## Acceptance Criteria

- 후보별 혼잡도 점수와 confidence가 계산된다.
- API 실패 시 추천 pipeline이 중단되지 않는다.
- low crowd preference에 사용할 수 있는 점수가 제공된다.

## Dependencies

- Phase 3 후보 타입
- Cache Service 또는 mock cache

## Estimated Complexity

M

---

# Phase 5 — Recommendation Engine

## Goal

날씨, 거리, 무료 여부, 혼잡도를 우선순위에 맞게 반영하는 점수 계산, 랭킹, 추천 설명 생성을 구현한다.

## Deliverables

- `ScoringService`
- `RecommendationEngine`
- intent별 scoring rules
- reason code 생성
- tie-break
- 다양성 제어
- 단위 테스트

## Priority Order

1. Weather
2. Distance
3. Free Admission
4. Congestion

## Tasks

* [ ] TASK-501 추천 타입 정의
  - **Description**: `EnrichedCandidate`, `RankedRecommendation`, `ScoreResult`, `ScorePenalty`, `ReasonCode` 타입을 정의한다.
  - **Priority**: P0
  - **Dependencies**: TASK-201, TASK-301, TASK-401
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - score components 필드 포함
    - reason codes 포함
    - source metadata 유지

* [ ] TASK-502 날씨 점수 계산 구현
  - **Description**: 후보의 indoor/outdoor 속성과 날씨 조건을 기반으로 weather_score를 계산한다.
  - **Priority**: P0
  - **Dependencies**: TASK-207, TASK-501
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 강수 확률 60% 이상에서 indoor 후보 100, outdoor 후보 30
    - DI 80 이상에서 indoor 후보 100, outdoor 후보 20
    - 쾌적 날씨에서 outdoor 후보 우대

* [ ] TASK-503 거리 점수 계산 구현
  - **Description**: intent별 travel minutes 기반 distance_score를 계산한다.
  - **Priority**: P0
  - **Dependencies**: TASK-501
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - today: `max(0, 100 - minutes * 1.4)`
    - tomorrow: `max(0, 100 - minutes * 1.0)`
    - weekend: `max(0, 100 - minutes * 0.7)`

* [ ] TASK-504 무료 여부 점수 계산 구현
  - **Description**: 무료/저가/유료/가격 미상 값을 점수로 변환한다.
  - **Priority**: P0
  - **Dependencies**: TASK-305, TASK-501
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 무료=100
    - 1만원 이하=80
    - 3만원 이하=50
    - 3만원 초과=25
    - 가격 정보 없음=40

* [ ] TASK-505 혼잡도 점수 통합
  - **Description**: CongestionResult를 scoring component에 통합한다.
  - **Priority**: P0
  - **Dependencies**: TASK-405, TASK-501
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - unknown은 60점
    - confidence low는 penalty 가능
    - low crowd preference 시 crowded 이상 penalty

* [ ] TASK-506 intent별 최종 점수 공식 구현
  - **Description**: today/tomorrow/weekend별 가중치를 적용한다.
  - **Priority**: P0
  - **Dependencies**: TASK-502, TASK-503, TASK-504, TASK-505
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - today 공식 구현
    - tomorrow 공식 구현
    - weekend 공식 구현
    - 점수는 0~100 사이 clamp

* [ ] TASK-507 penalty 계산 구현
  - **Description**: 예약 필요, 실외 비, 실외 폭염, 곧 종료, 위치 누락, 가격 미상 penalty를 적용한다.
  - **Priority**: P0
  - **Dependencies**: TASK-506
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 오늘 예약 필수 penalty=15
    - 비 오는 날 실외 penalty=25
    - DI 높을 때 실외 penalty=20
    - 곧 종료 penalty=30

* [ ] TASK-508 reason code 생성 구현
  - **Description**: 점수 결과를 기반으로 추천 이유 코드를 생성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-506, TASK-507
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - `indoor`, `free`, `weather_fit`, `nearby`, `low_congestion` 생성 가능
    - negative reason 또는 warning도 생성 가능

* [ ] TASK-509 tie-break 구현
  - **Description**: 점수 차이 2점 미만 후보의 정렬 기준을 구현한다.
  - **Priority**: P1
  - **Dependencies**: TASK-506
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - confidence, weather fit, travel time, free, congestion 순서 적용
    - 마지막은 candidate id deterministic sort

* [ ] TASK-510 다양성 제어 구현
  - **Description**: 상위 추천이 같은 카테고리에 과도하게 몰리지 않도록 후처리한다.
  - **Priority**: P2
  - **Dependencies**: TASK-509
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 점수 차이 8점 이내 후보에서 카테고리 다양성 반영
    - 날씨 부적합 후보는 다양성만으로 승격하지 않음

* [ ] TASK-511 추천 설명 템플릿 구현
  - **Description**: reason code와 실제 데이터를 기반으로 한국어 설명을 생성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-508
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 날씨, 무료, 거리, 혼잡도 설명 문장 생성
    - 누락 데이터는 설명에서 명시
    - 임의 사실 생성 없음

## Formulas

오늘:

```text
today_score =
  weather_score * 0.25
+ distance_score * 0.30
+ free_score * 0.15
+ congestion_score * 0.20
+ time_fit_score * 0.10
- penalties
```

내일:

```text
tomorrow_score =
  weather_score * 0.35
+ distance_score * 0.20
+ free_score * 0.15
+ congestion_score * 0.15
+ time_fit_score * 0.15
- penalties
```

주말:

```text
weekend_score =
  weather_score * 0.35
+ distance_score * 0.15
+ free_score * 0.25
+ congestion_score * 0.15
+ time_fit_score * 0.10
- penalties
```

## Validation Tasks

* [ ] TASK-512 점수 공식 단위 테스트
  - **Priority**: P0
  - **Dependencies**: TASK-506
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - architecture.md의 예시 점수와 일치
    - 0~100 clamp 검증

* [ ] TASK-513 ranking 품질 테스트
  - **Priority**: P1
  - **Dependencies**: TASK-509
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 폭염에는 실내 후보가 야외 후보보다 높음
    - 무료 요청 시 가격 미상 후보가 무료 후보보다 낮음
    - 혼잡도 높음 후보가 낮은 후보보다 낮음

## Acceptance Criteria

- 후보 목록을 점수화하고 rank된 추천으로 반환한다.
- 추천 이유가 데이터 기반으로 생성된다.
- 테스트 fixture에서 기대 순위가 재현된다.

## Dependencies

- Weather Service
- Event Service
- Congestion Service
- Location Service 일부

## Estimated Complexity

L

---

# Phase 6 — MCP Public Tools

## Goal

세 개의 public MCP Tool을 실제 추천 pipeline에 연결한다.

## Deliverables

- `today_what_to_do`
- `tomorrow_what_to_do`
- `weekend_what_to_do`
- 각 Tool input/output schema
- Tool별 테스트

## Tasks

* [ ] TASK-601 공통 Tool input schema 구현
  - **Description**: query, location, companions, preferences, language, result_limit 스키마를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-103
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - Zod 또는 JSON Schema로 검증
    - result_limit 최대 5
    - 좌표 범위 검증

* [ ] TASK-602 공통 output envelope 구현
  - **Description**: status, intent, summary, recommendations, warnings, missing_data, metadata 구조를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-501
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - success/partial_success/error 모두 표현 가능
    - request_id와 generated_at 포함

* [ ] TASK-603 `today_what_to_do` 개발
  - **Description**: 오늘 intent 시간 범위 계산, 현재 날씨, 오늘 행사, 거리, 혼잡도, scoring pipeline을 연결한다.
  - **Priority**: P0
  - **Dependencies**: TASK-208, TASK-309, TASK-406, TASK-506, TASK-601, TASK-602
  - **Estimated Effort**: L
  - **Acceptance Criteria**:
    - 오늘 이용 가능한 후보만 추천
    - 거리 우선 가중치 적용
    - 예약 필수/곧 종료 penalty 적용
    - JSON 응답이 schema와 일치

* [ ] TASK-604 `tomorrow_what_to_do` 개발
  - **Description**: 내일 날짜, 시간대 예보, 내일 행사, 계획 적합도, scoring pipeline을 연결한다.
  - **Priority**: P0
  - **Dependencies**: TASK-603
  - **Estimated Effort**: L
  - **Acceptance Criteria**:
    - 내일 날짜 후보만 추천
    - preferred_time_of_day 반영
    - 날씨 우선 가중치 적용
    - recommended_time_of_day 포함

* [ ] TASK-605 `weekend_what_to_do` 개발
  - **Description**: 다가오는 토/일 날짜 계산, 서울 전역 후보 탐색, 주말 예보 비교, scoring pipeline을 연결한다.
  - **Priority**: P0
  - **Dependencies**: TASK-604
  - **Estimated Effort**: L
  - **Acceptance Criteria**:
    - 토/일 날짜 계산 정확
    - best_day 계산
    - 무료 여부 가중치 높게 적용
    - plan_b_recommended 여부 반환

* [ ] TASK-606 Tool schema validation 테스트
  - **Description**: 세 Tool의 정상/비정상 입력 검증 테스트를 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-601, TASK-603, TASK-604, TASK-605
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - query 누락 시 오류
    - result_limit 5 초과 시 오류 또는 clamp
    - 좌표 범위 오류 감지

* [ ] TASK-607 Tool integration 테스트
  - **Description**: mock provider를 사용해 각 Tool이 추천 응답을 생성하는지 테스트한다.
  - **Priority**: P0
  - **Dependencies**: TASK-603, TASK-604, TASK-605
  - **Estimated Effort**: L
  - **Acceptance Criteria**:
    - today Tool이 1개 이상 추천 반환
    - tomorrow Tool이 tomorrow_plan 반환
    - weekend Tool이 weekend_summary 반환

## Acceptance Criteria

- 세 public Tool이 실제 추천 결과를 반환한다.
- 입력 검증과 오류 응답이 안정적으로 동작한다.
- mock provider 기반 integration test가 통과한다.

## Dependencies

- Phase 1~5

## Estimated Complexity

L

---

# Phase 7 — Caching Layer

## Goal

외부 API 응답과 일부 계산 결과를 캐시하여 응답 속도와 안정성을 높인다.

## Deliverables

- `CacheService`
- `InMemoryCache`
- `RedisCache`
- TTL 정책
- stale fallback
- request coalescing

## Tasks

* [ ] TASK-701 Cache interface 정의
  - **Description**: `get`, `set`, `delete`, `getOrSet`, stale 지원 인터페이스를 정의한다.
  - **Priority**: P0
  - **Dependencies**: TASK-001
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - generic type 지원
    - hit/stale/value 반환 구조

* [ ] TASK-702 InMemoryCache 구현
  - **Description**: 로컬 개발과 테스트용 in-memory TTL cache를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-701
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - TTL 만료 동작
    - stale TTL 동작
    - 테스트에서 clock 제어 가능

* [ ] TASK-703 RedisCache 구현
  - **Description**: production용 Redis 기반 cache adapter를 구현한다.
  - **Priority**: P1
  - **Dependencies**: TASK-701, TASK-005
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - REDIS_URL로 연결
    - JSON serialize/deserialize
    - Redis unavailable 시 명확한 오류 또는 fallback

* [ ] TASK-704 Cache key builder 구현
  - **Description**: weather/events/congestion/distance/recommendation key builder를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-701
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 위치 key는 raw 좌표가 아닌 hash 사용
    - scoring version 포함 가능

* [ ] TASK-705 TTL 정책 적용
  - **Description**: namespace별 TTL을 service 호출에 적용한다.
  - **Priority**: P0
  - **Dependencies**: TASK-702, TASK-704
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - weather current 10분
    - forecast 30분
    - events 6~24시간
    - congestion 3분
    - distance 24시간

* [ ] TASK-706 stale fallback 구현
  - **Description**: provider 실패 시 stale cache를 반환할 수 있도록 구현한다.
  - **Priority**: P1
  - **Dependencies**: TASK-702, TASK-703
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - stale hit 여부가 응답 metadata에 반영됨
    - stale miss 시 degraded mode로 넘어감

* [ ] TASK-707 request coalescing 구현
  - **Description**: 동일 cache key의 동시 provider 호출을 하나로 합친다.
  - **Priority**: P2
  - **Dependencies**: TASK-701
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 동일 key 동시 호출 시 provider 호출 1회
    - 실패 시 대기 중인 요청 모두 동일 오류 수신

## Acceptance Criteria

- Cache Service가 모든 provider service에 통합된다.
- 캐시 hit/miss/stale가 metadata로 추적된다.
- API 실패 시 stale fallback이 동작한다.

## Dependencies

- Phase 2~4

## Estimated Complexity

M

---

# Phase 8 — Error Handling

## Goal

외부 API 실패, timeout, 데이터 누락, 후보 없음 상황에서도 MCP Tool이 안정적인 응답을 제공하도록 한다.

## Deliverables

- 공통 error code
- `AppError`
- retry wrapper
- timeout wrapper
- degraded response builder
- fallback recommendation logic

## Tasks

* [ ] TASK-801 Error code 정의
  - **Description**: `INVALID_INPUT`, `WEATHER_UNAVAILABLE`, `EVENTS_UNAVAILABLE`, `CONGESTION_UNAVAILABLE`, `NO_CANDIDATES` 등 공통 코드를 정의한다.
  - **Priority**: P0
  - **Dependencies**: TASK-001
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 오류 코드 enum 또는 const 정의
    - user-facing message와 internal message 구분

* [ ] TASK-802 AppError 구현
  - **Description**: retryable, provider, status, cause를 포함하는 오류 클래스를 구현한다.
  - **Priority**: P0
  - **Dependencies**: TASK-801
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - cause 보존
    - JSON 변환 시 secret 노출 없음

* [ ] TASK-803 timeout wrapper 구현
  - **Description**: provider 호출과 Tool 전체 실행에 timeout을 적용한다.
  - **Priority**: P0
  - **Dependencies**: TASK-802
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - provider별 timeout 적용 가능
    - timeout 시 typed error 발생

* [ ] TASK-804 retry wrapper 구현
  - **Description**: retryable error에 대해 1회 retry와 jitter를 적용한다.
  - **Priority**: P0
  - **Dependencies**: TASK-802
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - timeout/network/server error는 retry
    - auth error는 retry하지 않음
    - retry 로그에 secret 없음

* [ ] TASK-805 degraded mode builder 구현
  - **Description**: 누락 데이터와 warning을 포함하는 partial_success 응답을 생성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-602, TASK-801
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - missing_data 배열 포함
    - warnings 배열 포함
    - status가 partial_success로 설정됨

* [ ] TASK-806 fallback recommendation 구현
  - **Description**: 행사 후보가 없거나 API 실패 시 카테고리 기반 fallback 추천을 제공한다.
  - **Priority**: P1
  - **Dependencies**: TASK-309, TASK-805
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 실내/무료/공공시설 카테고리 fallback 가능
    - fallback은 실제 장소 정보가 없으면 “카테고리 제안”으로 표시
    - unsupported fact를 생성하지 않음

* [ ] TASK-807 no candidates 처리 구현
  - **Description**: 필터링 후 후보가 0개일 때 사용자에게 명확한 결과를 반환한다.
  - **Priority**: P0
  - **Dependencies**: TASK-805
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 빈 배열과 함께 이유 제공
    - 조건 완화 제안 포함
    - Tool이 throw로 종료되지 않음

## Acceptance Criteria

- 외부 API 실패에도 Tool 응답이 반환된다.
- partial_success와 error의 의미가 명확하다.
- 오류 응답에 secret이 포함되지 않는다.

## Dependencies

- Phase 6
- Phase 7 일부

## Estimated Complexity

M

---

# Phase 9 — Testing

## Goal

서비스의 핵심 계산, provider 파싱, MCP Tool 동작, 추천 품질을 자동 테스트로 검증한다.

## Deliverables

- Unit tests
- Integration tests
- MCP Tool tests
- Recommendation quality tests
- Fixture data

## Tasks

* [ ] TASK-901 테스트 fixture 설계
  - **Description**: 날씨, 행사, 혼잡도, 거리 후보 fixture를 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-201, TASK-301, TASK-401
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 폭염 fixture
    - 비 fixture
    - 무료/유료 행사 fixture
    - 혼잡/여유 fixture

* [ ] TASK-902 Weather unit tests
  - **Description**: 불쾌지수, 날씨 적합도, KMA 파싱 테스트를 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-208
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 모든 weather scoring 경계값 테스트 통과

* [ ] TASK-903 Event unit tests
  - **Description**: 가격 파서, 날짜 필터, 실내/실외 추론, dedup 테스트를 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-309
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 종료된 행사 제외
    - 무료 파싱 정확
    - 중복 제거 정확

* [ ] TASK-904 Congestion unit tests
  - **Description**: 혼잡도 파싱, score mapping, area mapping 테스트를 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-406
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - unknown fallback 검증
    - confidence 계산 검증

* [ ] TASK-905 Scoring unit tests
  - **Description**: scoring formula와 penalty를 검증한다.
  - **Priority**: P0
  - **Dependencies**: TASK-512
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - architecture.md 예시 점수 통과
    - 날씨/거리/무료/혼잡 우선순위 검증

* [ ] TASK-906 MCP Tool integration tests
  - **Description**: mock provider로 세 MCP Tool을 호출하는 통합 테스트를 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-607
  - **Estimated Effort**: L
  - **Acceptance Criteria**:
    - today/tomorrow/weekend 응답 생성
    - schema validation 통과
    - partial_success 시나리오 통과

* [ ] TASK-907 Recommendation quality tests
  - **Description**: 실제 사용자 시나리오 기반 추천 순위 테스트를 작성한다.
  - **Priority**: P1
  - **Dependencies**: TASK-905, TASK-906
  - **Estimated Effort**: L
  - **Acceptance Criteria**:
    - 폭염에는 실내 무료 전시가 야외 축제보다 높음
    - 비 예보에는 실내 활동이 높음
    - 무료 요청에는 무료 후보가 우선
    - 혼잡도 높음 후보는 감점

* [ ] TASK-908 Error handling tests
  - **Description**: provider timeout, API failure, cache stale fallback, no candidates를 테스트한다.
  - **Priority**: P0
  - **Dependencies**: TASK-805, TASK-806, TASK-807
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - Tool이 비정상 종료하지 않음
    - warning/missing_data 포함
    - secret 로그 노출 없음

## Acceptance Criteria

- `npm test`가 전체 테스트를 실행한다.
- 핵심 scoring과 Tool integration 테스트가 통과한다.
- provider 실패 시나리오가 테스트된다.

## Dependencies

- Phase 2~8

## Estimated Complexity

L

---

# Phase 10 — Deployment

## Goal

PlayMCP in KC에 Git Source Build 방식으로 MCP Server를 배포할 수 있도록 준비한다.

## Deliverables

- Dockerfile
- `.dockerignore`
- `.env.example`
- 배포 README
- production start script
- endpoint/tool discovery validation

## Tasks

* [ ] TASK-1001 Dockerfile 작성
  - **Description**: multi-stage Node.js 22 alpine Dockerfile을 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-004
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - image build 성공
    - production dependency만 runtime에 포함
    - `node dist/index.js` 실행

* [ ] TASK-1002 `.dockerignore` 작성
  - **Description**: node_modules, dist, logs, env 파일 등 제외 항목을 정의한다.
  - **Priority**: P0
  - **Dependencies**: TASK-1001
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - secret 파일이 image context에 포함되지 않음
    - build context 크기 최소화

* [ ] TASK-1003 환경 변수 템플릿 검증
  - **Description**: `.env.example`이 production에 필요한 모든 환경 변수를 포함하는지 확인한다.
  - **Priority**: P0
  - **Dependencies**: TASK-005
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - KMA/Seoul/Culture/Redis 관련 키 포함
    - mock mode 설명 포함

* [ ] TASK-1004 production build 검증
  - **Description**: clean install 후 build/start가 가능한지 검증한다.
  - **Priority**: P0
  - **Dependencies**: TASK-1001
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - `npm ci`
    - `npm run build`
    - `npm start`
    - container 실행 성공

* [ ] TASK-1005 PlayMCP in KC 배포 설정 문서화
  - **Description**: Git Source Build Deployment에 필요한 절차를 README에 정리한다.
  - **Priority**: P1
  - **Dependencies**: TASK-1004
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - repository 연결 절차
    - environment variable 설정
    - health check 확인 방법

* [ ] TASK-1006 MCP endpoint validation
  - **Description**: 배포 후 Tool discovery와 세 Tool 호출을 검증한다.
  - **Priority**: P0
  - **Dependencies**: TASK-1005
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 배포 환경에서 세 Tool discover 가능
    - mock 또는 실제 API로 최소 1개 추천 응답 반환

## Acceptance Criteria

- Docker image가 빌드되고 실행된다.
- PlayMCP in KC에서 Tool discovery가 가능하다.
- production 환경 변수 설정 문서가 완성된다.

## Dependencies

- Phase 1~9

## Estimated Complexity

M

---

# Phase 11 — Competition Submission

## Goal

PlayMCP 공모전 제출에 필요한 설명, 메타데이터, 데모 시나리오, 체크리스트를 준비한다.

## Deliverables

- MCP metadata
- Tool descriptions
- demo scenarios
- screenshots
- submission checklist
- fallback demo plan

## Tasks

* [ ] TASK-1101 MCP metadata 작성
  - **Description**: 프로젝트 이름, 설명, Tool 목록, 사용 데이터 소스, 핵심 가치 제안을 정리한다.
  - **Priority**: P0
  - **Dependencies**: TASK-103
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - 프로젝트명이 `뭐하지?`
    - PlayMCP MCP Server임을 명시
    - 세 Tool 설명 포함

* [ ] TASK-1102 Tool description 최종 다듬기
  - **Description**: PlayMCP Agent가 정확히 Tool을 선택할 수 있도록 설명을 개선한다.
  - **Priority**: P0
  - **Dependencies**: TASK-603, TASK-604, TASK-605
  - **Estimated Effort**: S
  - **Acceptance Criteria**:
    - today/tomorrow/weekend 차이가 명확
    - 입력 예시 포함
    - 출력 기대값 명확

* [ ] TASK-1103 데모 시나리오 작성
  - **Description**: 공모전 시연용 3개 핵심 시나리오를 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-607
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 폭염 오늘 추천
    - 비 오는 주말 실내 플랜
    - 무료 데이트 추천

* [ ] TASK-1104 스크린샷 준비
  - **Description**: PlayMCP에서 Tool 호출과 추천 결과 화면을 캡처한다.
  - **Priority**: P1
  - **Dependencies**: TASK-1006
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - Tool discovery 화면
    - today 추천 결과
    - weekend 추천 결과
    - partial_success 예시

* [ ] TASK-1105 fallback demo plan 작성
  - **Description**: 외부 API 장애 시 mock mode 또는 cached fixture로 시연하는 계획을 작성한다.
  - **Priority**: P0
  - **Dependencies**: TASK-805, TASK-806
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - API key 문제 시 대체 가능
    - 네트워크 장애 시 fixture demo 가능
    - degraded mode가 강점으로 설명됨

* [ ] TASK-1106 제출 전 최종 체크리스트 실행
  - **Description**: build, test, deployment, demo, 문서, secret 검사를 수행한다.
  - **Priority**: P0
  - **Dependencies**: TASK-1101, TASK-1102, TASK-1103, TASK-1104, TASK-1105
  - **Estimated Effort**: M
  - **Acceptance Criteria**:
    - 모든 P0 테스트 통과
    - PlayMCP 배포 URL 정상
    - Tool 호출 성공
    - secret 노출 없음

## Acceptance Criteria

- 공모전 제출에 필요한 자료가 준비된다.
- 핵심 시나리오가 안정적으로 시연된다.
- API 장애 상황에서도 대체 시연 가능하다.

## Dependencies

- Phase 10

## Estimated Complexity

M

---

# MVP Task List

MVP에 반드시 포함해야 하는 작업:

* [ ] TASK-001 프로젝트 기본 구조 생성
* [ ] TASK-002 Node.js/TypeScript 프로젝트 초기화
* [ ] TASK-003 필수 dependency 설치
* [ ] TASK-004 package scripts 정의
* [ ] TASK-005 환경 변수 관리 모듈 구현
* [ ] TASK-101 MCP Server entrypoint 구현
* [ ] TASK-102 `createMcpServer` 구현
* [ ] TASK-103 Tool registration 모듈 구현
* [ ] TASK-104 Tool Context 구현
* [ ] TASK-106 MCP Tool discovery 검증 테스트
* [ ] TASK-201 Weather 타입 정의
* [ ] TASK-202 기상청 격자 변환 유틸 구현
* [ ] TASK-203 KMA Provider 기본 클라이언트 구현
* [ ] TASK-204 초단기실황 조회 구현
* [ ] TASK-205 단기예보 조회 구현
* [ ] TASK-206 불쾌지수 계산 구현
* [ ] TASK-207 실내/실외 적합도 분류 구현
* [ ] TASK-208 Weather Service orchestration 구현
* [ ] TASK-301 Event 타입 정의
* [ ] TASK-302 서울 열린데이터 Provider 구현
* [ ] TASK-303 서울 문화행사 응답 파싱
* [ ] TASK-305 무료 여부 파서 구현
* [ ] TASK-307 날짜/운영 시간 필터 구현
* [ ] TASK-309 Event Service orchestration 구현
* [ ] TASK-401 Congestion 타입 정의
* [ ] TASK-402 서울 실시간 도시데이터 Provider 구현
* [ ] TASK-403 혼잡도 응답 파싱
* [ ] TASK-405 혼잡도 점수 계산 구현
* [ ] TASK-406 후보별 혼잡도 enrich 구현
* [ ] TASK-501 추천 타입 정의
* [ ] TASK-502 날씨 점수 계산 구현
* [ ] TASK-503 거리 점수 계산 구현
* [ ] TASK-504 무료 여부 점수 계산 구현
* [ ] TASK-505 혼잡도 점수 통합
* [ ] TASK-506 intent별 최종 점수 공식 구현
* [ ] TASK-507 penalty 계산 구현
* [ ] TASK-508 reason code 생성 구현
* [ ] TASK-511 추천 설명 템플릿 구현
* [ ] TASK-512 점수 공식 단위 테스트
* [ ] TASK-601 공통 Tool input schema 구현
* [ ] TASK-602 공통 output envelope 구현
* [ ] TASK-603 `today_what_to_do` 개발
* [ ] TASK-604 `tomorrow_what_to_do` 개발
* [ ] TASK-605 `weekend_what_to_do` 개발
* [ ] TASK-606 Tool schema validation 테스트
* [ ] TASK-607 Tool integration 테스트
* [ ] TASK-701 Cache interface 정의
* [ ] TASK-702 InMemoryCache 구현
* [ ] TASK-704 Cache key builder 구현
* [ ] TASK-705 TTL 정책 적용
* [ ] TASK-801 Error code 정의
* [ ] TASK-802 AppError 구현
* [ ] TASK-803 timeout wrapper 구현
* [ ] TASK-804 retry wrapper 구현
* [ ] TASK-805 degraded mode builder 구현
* [ ] TASK-807 no candidates 처리 구현
* [ ] TASK-901 테스트 fixture 설계
* [ ] TASK-902 Weather unit tests
* [ ] TASK-903 Event unit tests
* [ ] TASK-904 Congestion unit tests
* [ ] TASK-905 Scoring unit tests
* [ ] TASK-906 MCP Tool integration tests
* [ ] TASK-908 Error handling tests
* [ ] TASK-1001 Dockerfile 작성
* [ ] TASK-1002 `.dockerignore` 작성
* [ ] TASK-1003 환경 변수 템플릿 검증
* [ ] TASK-1004 production build 검증
* [ ] TASK-1006 MCP endpoint validation
* [ ] TASK-1101 MCP metadata 작성
* [ ] TASK-1102 Tool description 최종 다듬기
* [ ] TASK-1103 데모 시나리오 작성
* [ ] TASK-1105 fallback demo plan 작성
* [ ] TASK-1106 제출 전 최종 체크리스트 실행

---

# Nice-to-Have Task List

MVP 이후 또는 시간이 남으면 수행할 작업:

* [ ] TASK-006 기본 README 작성
* [ ] TASK-105 Health check 구현
* [ ] TASK-304 문화포털 Provider 구현
* [ ] TASK-306 실내/실외 추론 로직 구현 고도화
* [ ] TASK-308 중복 제거 구현 고도화
* [ ] TASK-404 venue-to-area 매핑 테이블 확장
* [ ] TASK-407 혼잡도 edge case 테스트
* [ ] TASK-509 tie-break 구현
* [ ] TASK-510 다양성 제어 구현
* [ ] TASK-513 ranking 품질 테스트
* [ ] TASK-703 RedisCache 구현
* [ ] TASK-706 stale fallback 구현
* [ ] TASK-707 request coalescing 구현
* [ ] TASK-806 fallback recommendation 구현
* [ ] TASK-907 Recommendation quality tests
* [ ] TASK-1005 PlayMCP in KC 배포 설정 문서화
* [ ] TASK-1104 스크린샷 준비

---

# Technical Debt List

향후 반드시 정리해야 할 기술 부채:

* [ ] TD-001 외부 API fixture를 실제 응답 기반으로 주기적 갱신
* [ ] TD-002 서울 실시간 도시데이터 Area 매핑 정확도 개선
* [ ] TD-003 가격 텍스트 파서 고도화
* [ ] TD-004 실내/실외 추론을 rule 기반에서 데이터 기반으로 개선
* [ ] TD-005 대중교통 실제 이동 시간 provider 연동
* [ ] TD-006 자치구 중심점 기반 추천의 거리 오차 개선
* [ ] TD-007 provider별 rate limit 모니터링 추가
* [ ] TD-008 추천 설명 템플릿 중복 제거 및 다국어 구조화
* [ ] TD-009 scoring weight를 config화하여 실험 가능하게 개선
* [ ] TD-010 no candidate fallback의 실제 장소 coverage 확장
* [ ] TD-011 Redis 장애 시 자동 in-memory fallback 안정화
* [ ] TD-012 로그 개인정보 마스킹 테스트 추가
* [ ] TD-013 MCP Tool output schema snapshot test 추가
* [ ] TD-014 공공 API schema 변경 감지 테스트 추가
* [ ] TD-015 Plan B 자동 추천을 위한 saved plan 모델 설계

---

# Competition Readiness Checklist

## 기능 준비

* [ ] 세 MCP Tool이 PlayMCP에서 discover된다.
* [ ] `today_what_to_do`가 실제 추천을 반환한다.
* [ ] `tomorrow_what_to_do`가 실제 추천을 반환한다.
* [ ] `weekend_what_to_do`가 실제 추천을 반환한다.
* [ ] 날씨, 불쾌지수, 거리, 무료 여부, 혼잡도가 추천에 반영된다.
* [ ] 추천 이유가 각 추천 카드에 포함된다.
* [ ] partial_success 응답이 정상 동작한다.
* [ ] 외부 API 실패 시 fallback 또는 warning이 제공된다.

## 품질 준비

* [ ] 모든 P0 unit test 통과
* [ ] MCP Tool integration test 통과
* [ ] recommendation quality test 핵심 시나리오 통과
* [ ] Docker build 성공
* [ ] production start 성공
* [ ] API key가 로그나 repository에 노출되지 않음

## 데모 준비

* [ ] 폭염 상황에서 실내 무료 전시 추천 시나리오 준비
* [ ] 비 오는 주말 실내 플랜 B 시나리오 준비
* [ ] 무료 데이트 추천 시나리오 준비
* [ ] 혼잡도 API 실패 partial_success 시나리오 준비
* [ ] mock mode 또는 fixture mode 준비
* [ ] PlayMCP 화면 캡처 준비
* [ ] 3분 데모 스크립트 준비
* [ ] 5분 Q&A용 기술 설명 준비

## 제출 준비

* [ ] README 최신화
* [ ] PRD.md 존재
* [ ] customer.md 존재
* [ ] architecture.md 존재
* [ ] tasks.md 존재
* [ ] MCP metadata 작성
* [ ] Tool description 최종 검수
* [ ] PlayMCP registration 완료
* [ ] 제출 링크와 실행 방법 검증

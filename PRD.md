# 뭐하지? PRD

## 1. Executive Summary

**뭐하지?**는 사용자의 현재 위치, 시간, 날씨, 체감 환경, 불쾌지수, 강수 가능성, 이동 거리, 무료 여부, 혼잡도를 종합 분석하여 “지금 당장” 또는 “가까운 미래”에 가장 적합한 활동과 장소를 추천하는 AI Agent 서비스이다.

사용자는 “오늘 뭐하지?”, “내일 뭐하지?”, “이번 주말 뭐하지?”처럼 자연어 한 문장만 입력하면 된다. 서비스는 사용자의 의도를 해석하고, MCP 기반 Tool을 통해 기상청 API, 서울 열린데이터, 서울 실시간 도시데이터, 문화행사 데이터 등을 호출한 뒤, 추천 엔진으로 후보 장소를 점수화한다. 이후 AI Agent는 단순 목록이 아니라 “왜 지금 이 장소가 적합한지”를 설명하고, 일정 저장, 공유, 대체 장소 추천, 우천 시 플랜 B까지 이어지는 행동 가능한 결과를 제공한다.

핵심 차별점은 단순 검색이 아니라 **상황 기반 의사결정**이다. 기존 서비스가 “장소를 찾는 도구”라면, 뭐하지?는 “사용자가 지금 할 일을 결정하도록 돕는 Agent”이다.

MVP는 서울 지역에 한정하여 구현한다. 1차 타겟은 서울 거주 20~40대 직장인, 연인, 가족, 혼자 활동하는 사용자이다. 주요 사용 맥락은 평일 저녁, 내일 하루 계획, 주말 여가 계획이다.

서비스의 핵심 가치는 다음과 같다.

- 사용자는 복잡한 검색 조건을 설정하지 않아도 된다.
- AI Agent가 현재 상황과 미래 예보를 종합 판단한다.
- 추천 결과는 거리, 날씨, 혼잡도, 무료 여부를 기반으로 설명 가능해야 한다.
- 추천 이후 일정 저장, 공유, 대체안 생성까지 자연스럽게 연결된다.
- 공공 데이터를 적극 활용해 공익성과 구현 가능성을 동시에 확보한다.

---

## 2. Problem Statement

사람들은 반복적으로 같은 질문을 한다.

- 오늘 뭐하지?
- 내일 뭐하지?
- 이번 주말 뭐하지?
- 더운데 어디 가지?
- 비 오면 뭐 하지?
- 돈 안 들고 갈 만한 곳 없나?
- 사람 너무 많지 않은 곳 없나?

그러나 이 질문에 답하기 위해 사용자는 여러 서비스를 오가야 한다.

날씨 앱에서 기온과 강수 확률을 확인하고, 지도 앱에서 이동 시간을 확인하고, 포털에서 전시나 행사를 검색하고, 개별 페이지에서 무료 여부와 운영 시간을 확인하고, 혼잡도는 별도로 추정해야 한다. 이 과정은 귀찮고 시간이 오래 걸리며, 결국 사용자는 “그냥 집에 있자”는 결론에 도달하기 쉽다.

기존 서비스의 한계는 명확하다.

**지도 서비스의 한계**

- 거리와 장소 정보는 강하지만 날씨, 불쾌지수, 무료 문화행사 맥락은 약하다.
- 사용자가 무엇을 하고 싶은지 모르는 상태에서는 탐색 부담이 크다.

**행사 검색 서비스의 한계**

- 행사 목록은 제공하지만 지금 가기 좋은지 판단하지 않는다.
- 현재 위치, 날씨, 혼잡도, 이동 가능성을 종합하지 않는다.

**날씨 서비스의 한계**

- 날씨 정보는 제공하지만 그 날씨에 적합한 행동을 추천하지 않는다.

**일반 AI 챗봇의 한계**

- 자연어 응답은 가능하지만 실시간 공공 데이터를 근거로 판단하지 않으면 추천의 신뢰도가 낮다.
- 장소 운영 여부, 행사 기간, 혼잡도 같은 실행 가능성을 검증하기 어렵다.

따라서 본 서비스가 해결하는 핵심 문제는 다음과 같다.

> 사용자의 짧은 질문을 실시간 도시 데이터와 연결하여, 지금 실제로 실행 가능한 활동을 추천하는 것.

---

## 3. User Persona

### Persona A. 퇴근 후 가볍게 움직이고 싶은 직장인

- 나이: 32세
- 거주/근무: 서울 송파구 거주, 강남권 근무
- 상황: 평일 저녁 퇴근 후 2~3시간 정도 가볍게 할 일을 찾음
- 니즈:
  - 너무 멀지 않은 곳
  - 예약 없이 갈 수 있는 곳
  - 더운 날에는 실내
  - 비용 부담이 적은 곳
- 대표 발화:
  - “오늘 퇴근하고 뭐하지?”
  - “지금 근처에서 갈 만한 곳 추천해줘.”

### Persona B. 주말 데이트를 계획하는 연인

- 나이: 20대 후반
- 상황: 주말 데이트 코스를 찾고 있음
- 니즈:
  - 날씨에 맞는 코스
  - 무료 또는 저비용 선택지
  - 사람이 너무 많지 않은 장소
  - 비 오면 대체 가능한 실내 장소
- 대표 발화:
  - “이번 주말 데이트 뭐하지?”
  - “비 안 오면 야외, 비 오면 실내로 추천해줘.”

### Persona C. 아이와 갈 곳을 찾는 가족 사용자

- 나이: 40대
- 상황: 주말에 아이와 외출 계획
- 니즈:
  - 아이와 함께 갈 수 있는 공공시설
  - 무료 또는 저렴한 프로그램
  - 혼잡도가 낮은 장소
  - 폭염/우천 시 실내 대안
- 대표 발화:
  - “내일 아이랑 뭐하지?”
  - “무료로 갈 만한 실내 프로그램 있어?”

### Persona D. 혼자 시간을 보내는 사용자

- 나이: 30대
- 상황: 혼자 전시, 산책, 도서관, 박물관 등을 즐김
- 니즈:
  - 혼자 가도 어색하지 않은 장소
  - 조용하고 혼잡하지 않은 곳
  - 날씨 영향을 덜 받는 곳
- 대표 발화:
  - “혼자 오늘 뭐하지?”
  - “사람 적고 조용한 곳 추천해줘.”

---

## 4. User Journey

### Journey 1. 오늘 뭐하지?

1. 사용자가 “오늘 뭐하지?”를 입력한다.
2. Agent는 intent를 `today`로 분류한다.
3. 위치 권한이 있으면 현재 좌표를 사용하고, 없으면 자치구 입력을 요청한다.
4. 현재 시간과 오늘 남은 시간대를 계산한다.
5. 기상청 API를 통해 현재 기온, 습도, 강수 확률, 하늘 상태를 조회한다.
6. 불쾌지수를 계산한다.
7. 현재 위치 반경 3~7km 내 문화행사, 공공시설, 실내 장소 후보를 조회한다.
8. 후보별 운영 시간, 무료 여부, 실내/실외 여부를 필터링한다.
9. 서울 실시간 도시데이터로 혼잡도를 조회하거나 근접 지역 혼잡도를 매핑한다.
10. 추천 엔진이 거리, 날씨, 혼잡도, 무료 여부를 점수화한다.
11. Agent가 상위 3~5개 추천을 생성한다.
12. 사용자는 “무료만”, “더 가까운 곳”, “실내만” 같은 후속 요청을 할 수 있다.

### Journey 2. 내일 뭐하지?

1. 사용자가 “내일 뭐하지?”를 입력한다.
2. Agent는 intent를 `tomorrow`로 분류한다.
3. 다음날 오전/오후/저녁 시간대별 날씨를 조회한다.
4. 하루 계획에 적합한 후보 장소와 행사를 탐색한다.
5. 예약 필요 여부와 운영 시간을 확인한다.
6. 비 예보가 있으면 실내 장소 가중치를 높인다.
7. 이동 거리와 혼잡도 예측 또는 최근 혼잡 정보를 반영한다.
8. 오전/오후/저녁 중 가장 적합한 추천안 또는 반나절 코스를 제안한다.

### Journey 3. 이번 주말 뭐하지?

1. 사용자가 “이번 주말 뭐하지?”를 입력한다.
2. Agent는 이번 주 토요일과 일요일 날짜를 계산한다.
3. 각 날짜의 날씨 예보와 강수 확률을 비교한다.
4. 검색 범위를 서울 전역으로 확장한다.
5. 무료 행사, 문화행사, 박물관, 미술관, 공공시설을 우선 탐색한다.
6. 혼잡도가 높을 가능성이 큰 지역은 감점한다.
7. 토요일 추천안과 일요일 추천안을 분리하거나, 더 적합한 날짜를 제안한다.
8. 비 예보가 있으면 실내 플랜 B를 함께 제공한다.

---

## 5. Functional Requirements

### FR-1. 자연어 의도 인식

서비스는 사용자의 입력에서 다음 정보를 추출해야 한다.

- 시간 의도: 오늘, 지금, 내일, 이번 주말, 특정 날짜
- 동행 맥락: 혼자, 연인, 가족, 아이, 친구
- 비용 조건: 무료, 저렴한, 유료 가능
- 환경 조건: 실내, 야외, 비 안 맞는 곳, 시원한 곳
- 이동 조건: 가까운 곳, 지하철로 갈 수 있는 곳
- 분위기 조건: 조용한 곳, 활기찬 곳, 사람 적은 곳

예시:

```json
{
  "raw_query": "이번 주말에 비 오면 실내 무료 데이트 코스 추천해줘",
  "intent": "weekend",
  "constraints": {
    "indoor": true,
    "free_preferred": true,
    "companion": "couple",
    "weather_sensitive": true
  }
}
```

### FR-2. 위치 기반 추천

- 사용자의 현재 위치 좌표를 사용할 수 있어야 한다.
- 위치 권한이 없는 경우 자치구 입력으로 대체해야 한다.
- 오늘 추천은 가까운 거리 우선이다.
- 내일 추천은 사용자가 하루 계획을 세울 수 있도록 중간 거리까지 허용한다.
- 주말 추천은 서울 전역으로 확장 가능해야 한다.

### FR-3. 날씨 분석

- 현재 기온, 습도, 강수 확률, 강수 형태, 하늘 상태를 조회한다.
- 내일과 주말은 예보 데이터를 사용한다.
- 불쾌지수를 계산한다.
- 날씨에 따라 실내/실외 추천 가중치를 조정한다.

### FR-4. 행사 및 장소 후보 수집

- 서울시 문화행사 데이터를 활용한다.
- 문화포털 데이터를 활용할 수 있다.
- 서울 공공시설, 도서관, 박물관, 미술관 등 공공성 높은 장소를 포함한다.
- 후보 장소는 표준 스키마로 정규화한다.

### FR-5. 혼잡도 반영

- 서울 실시간 도시데이터를 활용해 주요 장소의 혼잡도를 반영한다.
- 정확한 장소 매칭이 어려울 경우 인근 Area 기반으로 근사한다.
- 혼잡도 정보가 없으면 기본값과 낮은 confidence를 부여한다.

### FR-6. 추천 결과 제공

추천 결과는 다음 요소를 포함해야 한다.

- 장소명
- 활동 유형
- 위치
- 거리 또는 예상 이동 시간
- 비용
- 실내/실외 여부
- 혼잡도
- 날씨 적합도
- 추천 이유
- 주의 사항
- 데이터 기준 시각

### FR-7. Agentic Action

추천 이후 다음 행동을 지원해야 한다.

- 일정 저장용 텍스트 또는 ICS 생성
- 공유 메시지 생성
- 대체 장소 추천
- 우천 시 플랜 B 추천
- 폭염 시 실내 대안 추천
- 혼잡도 높을 때 덜 붐비는 장소 재추천
- 사용자의 후속 조건 반영

### FR-8. 설명 가능한 추천

모든 추천은 근거를 가져야 한다.

예시:

```text
현재 송파구 기준 기온은 34도이고 불쾌지수가 매우 높습니다.
따라서 야외 산책보다 실내 무료 전시를 우선 추천했습니다.
이 장소는 대중교통 이동 시간이 짧고 혼잡도가 보통 수준입니다.
```

---

## 6. Non Functional Requirements

### 성능

- 일반 추천 응답은 5초 이내 제공한다.
- 외부 API 일부 실패 시 3초 이내 부분 응답을 제공한다.
- 추천 후보 100개 기준 점수 계산은 500ms 이내 처리한다.

### 안정성

- Tool별 timeout을 적용한다.
- 외부 API 실패 시 retry를 1회 수행한다.
- 실패한 Tool이 있어도 가능한 범위에서 추천을 제공한다.
- 응답에 누락된 데이터와 신뢰도를 표시한다.

### 보안

- 위치 정보는 기본적으로 세션 단위로만 사용한다.
- 사용자 동의 없이 위치 이력을 저장하지 않는다.
- API Key는 환경변수 또는 Secret Manager에 저장한다.
- 로그에는 정확한 좌표 대신 자치구 단위로 마스킹한다.

### 정확성

- 종료된 행사는 추천하지 않는다.
- 현재 시각 이후 이용 가능한 장소만 오늘 추천에 포함한다.
- 가격 정보가 없는 후보를 무료로 간주하지 않는다.
- 데이터 기준 시각을 표시한다.

### 확장성

- MCP Tool은 독립 모듈로 구성한다.
- 신규 데이터 소스 추가 시 추천 엔진 변경을 최소화한다.
- 서울 외 지역 확장이 가능한 구조를 유지한다.

---

## 7. MCP Architecture

### 전체 구조

```text
User
  ↓
PlayMCP Client
  ↓
AI Agent Orchestrator
  ↓
MCP Server
  ├─ Weather Tool
  ├─ Discomfort Index Tool
  ├─ Culture Event Tool
  ├─ Seoul Facility Tool
  ├─ Seoul Realtime City Tool
  ├─ Distance Tool
  ├─ Recommendation Scoring Tool
  ├─ Plan B Tool
  ├─ Calendar Tool
  └─ Share Tool
  ↓
External APIs / Cache / Database
```

### Client Layer

- 사용자의 자연어 입력을 받는다.
- 추천 결과를 카드 UI로 표시한다.
- 위치 권한, 공유, 일정 저장 액션을 제공한다.

### Agent Layer

- 사용자 의도를 해석한다.
- 필요한 Tool 호출 순서를 결정한다.
- Tool 결과를 종합해 추천 응답을 생성한다.
- 후속 요청에 따라 재추천을 수행한다.

### MCP Server Layer

- 외부 API와 내부 계산 로직을 Tool로 노출한다.
- Tool Input/Output은 JSON Schema 기반으로 정의한다.
- Tool별 timeout, retry, error handling을 적용한다.

### Data Layer

- 기상청 API
- 서울 열린데이터 API
- 서울 실시간 도시데이터 API
- 문화행사 API
- Redis Cache
- PostgreSQL/PostGIS

### Recommendation Layer

- 후보 필터링
- 점수 계산
- 랭킹
- 추천 이유 생성
- confidence 계산

---

## 8. Tool Design

### Tool: `get_weather_forecast`

목적: 현재 또는 미래 날씨 정보를 조회한다.

Input:

```json
{
  "latitude": 37.5145,
  "longitude": 127.1059,
  "datetime_range": {
    "start": "2026-06-19T18:00:00+09:00",
    "end": "2026-06-19T23:00:00+09:00"
  },
  "mode": "today"
}
```

Output:

```json
{
  "temperature": 34,
  "humidity": 68,
  "precipitation_probability": 20,
  "precipitation_type": "none",
  "feels_like": 37,
  "wind_speed": 2.1,
  "weather_summary": "hot_humid",
  "source": "KMA",
  "fetched_at": "2026-06-19T17:45:00+09:00"
}
```

### Tool: `calculate_discomfort_index`

목적: 기온과 습도를 기반으로 불쾌지수를 계산한다.

Input:

```json
{
  "temperature_c": 34,
  "humidity_percent": 68
}
```

Output:

```json
{
  "discomfort_index": 83.2,
  "level": "very_high",
  "recommendation_bias": "indoor"
}
```

계산식:

```text
DI = 0.81T + 0.01H × (0.99T - 14.3) + 46.3
```

### Tool: `search_culture_events`

목적: 기간, 지역, 카테고리, 비용 조건에 맞는 문화행사를 검색한다.

Input:

```json
{
  "date_range": {
    "start": "2026-06-20",
    "end": "2026-06-21"
  },
  "district": "송파구",
  "category": ["exhibition", "performance", "festival", "education"],
  "price_filter": "free_or_low_cost",
  "indoor_preferred": true
}
```

Output:

```json
{
  "events": [
    {
      "id": "event-001",
      "title": "무료 기획 전시",
      "category": "exhibition",
      "venue": "서울역사박물관",
      "district": "종로구",
      "latitude": 37.5704,
      "longitude": 126.9707,
      "start_date": "2026-06-01",
      "end_date": "2026-06-30",
      "start_time": "10:00",
      "end_time": "18:00",
      "is_free": true,
      "price_text": "무료",
      "source": "Seoul Open Data"
    }
  ]
}
```

### Tool: `get_city_congestion`

목적: 서울 주요 장소의 실시간 혼잡도 정보를 조회한다.

Input:

```json
{
  "area_name": "광화문·덕수궁"
}
```

Output:

```json
{
  "area_name": "광화문·덕수궁",
  "congestion_level": "normal",
  "population_min": 12000,
  "population_max": 14000,
  "message": "방문 가능한 수준입니다.",
  "source": "Seoul Realtime City Data",
  "fetched_at": "2026-06-19T17:45:00+09:00"
}
```

### Tool: `calculate_distance`

목적: 사용자 위치와 후보 장소 간 거리 및 예상 이동 시간을 계산한다.

Input:

```json
{
  "origin": {
    "latitude": 37.5145,
    "longitude": 127.1059
  },
  "destinations": [
    {
      "id": "place-001",
      "latitude": 37.5704,
      "longitude": 126.9707
    }
  ],
  "transport_mode": "public_transit"
}
```

Output:

```json
{
  "distances": [
    {
      "id": "place-001",
      "distance_km": 12.4,
      "estimated_minutes": 38,
      "transport_mode": "public_transit"
    }
  ]
}
```

### Tool: `rank_recommendations`

목적: 후보 장소를 추천 점수 기준으로 정렬한다.

Input:

```json
{
  "intent": "today",
  "user_context": {
    "district": "송파구",
    "budget": "free_preferred",
    "companion": "solo"
  },
  "weather": {},
  "candidates": []
}
```

Output:

```json
{
  "recommendations": [
    {
      "rank": 1,
      "title": "서울역사박물관 무료 전시",
      "score": 87.5,
      "reason_codes": ["indoor", "free", "weather_fit", "low_congestion"],
      "explanation": "현재 불쾌지수가 높아 실내 활동을 우선했고, 무료 전시이며 혼잡도가 높지 않아 추천합니다."
    }
  ]
}
```

### Tool: `create_plan_b`

목적: 날씨나 혼잡도 변화에 따른 대체 장소를 추천한다.

Input:

```json
{
  "original_recommendation_id": "place-001",
  "risk_type": "rain",
  "user_context": {},
  "candidate_pool": []
}
```

Output:

```json
{
  "message": "비 예보가 확인되어 실내 대체 활동을 추천합니다.",
  "alternatives": []
}
```

### Tool: `create_share_card`

목적: 추천 결과를 공유 가능한 메시지로 변환한다.

Input:

```json
{
  "recommendation_ids": ["place-001", "place-002"],
  "format": "plain_text"
}
```

Output:

```json
{
  "share_text": "이번 주말 추천 코스: 서울역사박물관 무료 전시 → 광화문 산책",
  "share_url": "https://whatdowedo.app/share/abc123"
}
```

---

## 9. Agent Flow

### Today Flow

```text
1. Parse Intent
   - intent = today
   - priority = distance > weather > congestion > free

2. Resolve Location
   - 현재 위치 사용
   - 실패 시 자치구 입력 요청

3. Fetch Weather
   - get_weather_forecast 호출
   - calculate_discomfort_index 호출

4. Search Candidates
   - search_culture_events 호출
   - 공공시설 후보 조회

5. Enrich Candidates
   - calculate_distance 호출
   - get_city_congestion 호출
   - 운영 시간 검증

6. Rank
   - rank_recommendations 호출

7. Respond
   - 현재 상태 요약
   - 추천 3~5개
   - 추천 이유
   - 후속 액션 제공
```

### Tomorrow Flow

```text
1. intent = tomorrow
2. 다음날 날씨 예보 조회
3. 시간대별 추천 가능성 판단
4. 예약 불필요 후보 우선
5. 날씨 적합도 중심 랭킹
6. 하루 계획 또는 반나절 활동 추천
```

### Weekend Flow

```text
1. intent = weekend
2. 토요일/일요일 날짜 계산
3. 주말 예보 비교
4. 서울 전역 후보 확장
5. 무료 행사 가중치 상승
6. 혼잡도 높은 지역 감점
7. 우천 가능성 있으면 Plan B 포함
```

### Monitoring Flow

```text
1. 사용자가 추천을 저장한다.
2. Agent가 일정 시간과 장소를 기록한다.
3. 일정 6시간 전 날씨를 다시 조회한다.
4. 비, 폭염, 혼잡 증가를 감지한다.
5. create_plan_b를 호출한다.
6. 사용자에게 대체 장소를 제안한다.
```

---

## 10. Recommendation Engine

추천 엔진은 후보 필터링, 점수 계산, 랭킹, 설명 생성을 수행한다.

### 1차 필터링

다음 조건에 해당하는 후보는 제외하거나 감점한다.

- 서울 지역 밖 장소
- 날짜가 맞지 않는 행사
- 이미 종료된 행사
- 현재 시각 기준 방문이 어려운 장소
- 위치 정보가 없는 후보
- 가격 정보가 불명확한 후보
- 폭염/우천 상황에서 실외 중심 후보

### 최종 점수 공식

```text
Final Score =
  DistanceScore × W_distance
+ WeatherScore × W_weather
+ FreeScore × W_free
+ CongestionScore × W_congestion
+ TimeFitScore × W_time
+ PreferenceScore × W_preference
- RiskPenalty
```

### 시나리오별 가중치

| 시나리오 | 거리 | 날씨 | 혼잡도 | 무료 | 시간 적합성 |
|---|---:|---:|---:|---:|---:|
| 오늘 | 0.30 | 0.25 | 0.20 | 0.15 | 0.10 |
| 내일 | 0.20 | 0.35 | 0.15 | 0.15 | 0.15 |
| 주말 | 0.15 | 0.35 | 0.15 | 0.25 | 0.10 |

### 거리 점수

```text
오늘:
0~2km = 100
2~5km = 85
5~10km = 60
10km 초과 = 35

내일:
0~5km = 100
5~10km = 80
10~15km = 60
15km 초과 = 40

주말:
0~10km = 100
10~20km = 80
20km 초과 = 60
```

연속형 계산:

```text
DistanceScore = max(0, 100 - distance_km × distance_decay)
```

### 날씨 점수

```text
강수 확률 60% 이상:
- 실내 = 100
- 실외 = 30

불쾌지수 80 이상:
- 실내 = 100
- 그늘 있는 야외 = 50
- 일반 야외 = 20

기온 18~26도, 강수 확률 30% 미만:
- 야외 = 100
- 실내 = 80
```

### 무료 여부 점수

```text
무료 = 100
1만원 이하 = 80
3만원 이하 = 50
3만원 초과 = 25
가격 정보 없음 = 40
```

### 혼잡도 점수

```text
여유 = 100
보통 = 80
약간 붐빔 = 55
붐빔 = 30
매우 붐빔 = 10
정보 없음 = 60
```

### 시간 적합성 점수

```text
현재 이용 가능하고 2시간 이상 남음 = 100
1시간 이상 남음 = 70
곧 종료 = 30
현재 이용 불가 = 0
```

### 예시 알고리즘

```python
def rank_candidate(candidate, context):
    weights = {
        "today": {
            "distance": 0.30,
            "weather": 0.25,
            "crowd": 0.20,
            "free": 0.15,
            "time": 0.10
        },
        "tomorrow": {
            "distance": 0.20,
            "weather": 0.35,
            "crowd": 0.15,
            "free": 0.15,
            "time": 0.15
        },
        "weekend": {
            "distance": 0.15,
            "weather": 0.35,
            "crowd": 0.15,
            "free": 0.25,
            "time": 0.10
        }
    }[context.intent]

    score = (
        candidate.distance_score * weights["distance"] +
        candidate.weather_score * weights["weather"] +
        candidate.congestion_score * weights["crowd"] +
        candidate.free_score * weights["free"] +
        candidate.time_fit_score * weights["time"]
    )

    if candidate.requires_reservation and context.intent == "today":
        score -= 15

    if context.precipitation_probability >= 60 and candidate.is_outdoor:
        score -= 25

    if context.discomfort_level in ["high", "very_high"] and candidate.is_outdoor:
        score -= 20

    return max(0, min(100, score))
```

### 추천 설명 생성

추천 설명은 LLM이 임의로 생성하지 않고 reason code 기반으로 생성한다.

예시 reason code:

```json
["indoor", "free", "nearby", "low_congestion", "weather_fit"]
```

출력 예시:

```text
현재 기온과 습도를 기준으로 불쾌지수가 높아 실내 활동을 우선했습니다.
이 장소는 무료이며 현재 위치에서 비교적 가깝고 혼잡도도 높지 않아 오늘 방문하기 적합합니다.
```

---

## 11. Data Sources

### 기상청 API

- 기온
- 습도
- 강수 확률
- 강수 형태
- 풍속
- 하늘 상태
- 초단기실황
- 초단기예보
- 단기예보

활용 목적:

- 현재 날씨 판단
- 내일/주말 예보 판단
- 불쾌지수 계산
- 실내/실외 추천 가중치 조정

### 불쾌지수 계산

외부 API가 아니라 내부 Tool로 계산한다. 기온과 습도를 입력받아 불쾌지수를 산출하고, 추천 방향을 결정한다.

### 문화포털 API

- 전시
- 공연
- 문화행사
- 교육 프로그램
- 지역별 행사

활용 목적:

- 문화 활동 후보 확장
- 서울시 데이터 외 보조 행사 확보

### 서울 열린데이터

- 서울시 문화행사 정보
- 공공시설 정보
- 도서관/박물관/미술관 등 공공 장소 후보

활용 목적:

- 무료 또는 공공성 높은 추천 후보 확보
- 날짜, 장소, 이용요금, 위치 기반 필터링

### 서울 실시간 도시데이터

- 주요 장소 실시간 인구
- 혼잡도
- 교통/환경 정보
- 장소별 상태 메시지

활용 목적:

- 혼잡도 기반 추천 점수 계산
- 사람이 많은 장소 감점
- 쾌적한 대체 장소 추천

### 지도/거리 데이터

- 직선 거리
- 대중교통 예상 시간
- 도보 가능성
- 위치 좌표 정규화

활용 목적:

- 거리 점수 계산
- 오늘 추천의 즉시성 판단
- 주말 코스 구성

---

## 12. UX Design

### UX 원칙

- 첫 화면은 검색창이 아니라 질문 입력 중심이어야 한다.
- 사용자는 조건을 세세히 고르지 않아도 된다.
- 결과는 추천 카드로 제공한다.
- 각 추천은 이유를 포함해야 한다.
- 후속 행동은 버튼으로 제공한다.
- 데이터 불확실성은 숨기지 않는다.

### 기본 입력 예시

```text
오늘 뭐하지?
내일 뭐하지?
이번 주말 뭐하지?
비 오면 뭐하지?
무료로 갈 만한 곳 추천해줘.
혼자 가기 좋은 곳 알려줘.
```

### 결과 화면 예시

```text
오늘 송파구 기준 상태

기온: 33도
습도: 70%
불쾌지수: 높음
강수 확률: 20%
추천 방향: 실내, 무료, 가까운 곳 우선
```

추천 카드:

```text
1. 서울역사박물관 무료 전시

유형: 실내 전시
비용: 무료
이동: 대중교통 약 35분
혼잡도: 보통
추천 이유:
현재 불쾌지수가 높아 실내 활동이 적합합니다.
무료 전시이며 예약 없이 방문 가능해 오늘 일정으로 부담이 적습니다.

액션:
[일정 저장] [공유] [지도 보기] [비 오면 대안]
```

### 후속 대화 예시

사용자:

```text
더 가까운 곳만 보여줘
```

Agent:

```text
현재 위치 기준 이동 시간이 짧은 순서로 다시 정렬했습니다.
날씨가 더워 실내 장소는 유지했습니다.
```

사용자:

```text
무료만
```

Agent:

```text
무료 장소만 필터링했습니다.
가격 정보가 없는 장소는 제외했습니다.
```

사용자:

```text
비 오면?
```

Agent:

```text
비가 올 경우를 대비해 실내 대체 장소 3곳을 추천합니다.
```

---

## 13. Technical Stack

### Frontend

- PlayMCP Client
- React 또는 Next.js
- TypeScript
- Tailwind CSS
- 위치 권한 API
- 공유 Web API
- 추천 카드 UI

### Backend

- Node.js 또는 Python FastAPI
- MCP Server
- Agent Orchestrator
- Recommendation Engine
- Scheduler
- API Adapter Layer

### MCP

- MCP SDK
- Tool Registry
- JSON Schema 기반 Tool 정의
- Tool별 timeout/retry/fallback
- Observability middleware

### Data

- Redis: 캐시
- PostgreSQL: 추천 후보 저장
- PostGIS: 위치 기반 검색
- Object Storage: 원본 응답 샘플 저장
- Optional Vector DB: 장소 설명 및 사용자 선호 검색

### Infra

- Docker
- GitHub Actions
- Cloud Run, Render, Fly.io 등
- Secret Manager
- Sentry 또는 OpenTelemetry
- API Gateway

---

## 14. Development Roadmap

### Phase 0. 데이터 검증

기간: 1주

- API Key 발급
- 기상청 API 응답 샘플 확보
- 서울 문화행사 데이터 구조 분석
- 서울 실시간 도시데이터 장소명 매핑
- 추천 점수 정책 확정
- 대표 데모 시나리오 선정

### Phase 1. MCP Tool 구현

기간: 2주

- Weather Tool 구현
- Discomfort Index Tool 구현
- Culture Event Tool 구현
- City Congestion Tool 구현
- Distance Tool 구현
- Recommendation Tool 구현
- Tool Error Handling 구현

### Phase 2. Agent Flow 구현

기간: 1~2주

- intent parser 구현
- 오늘/내일/주말 flow 구현
- Tool 호출 orchestration 구현
- 추천 설명 생성
- 부분 실패 응답 구현

### Phase 3. UX 구현

기간: 1주

- PlayMCP UI 구성
- 추천 카드 구현
- 상태 요약 영역 구현
- 후속 액션 버튼 구현
- 공유 메시지 생성 구현

### Phase 4. Agentic Action 구현

기간: 1주

- 일정 저장 텍스트/ICS 생성
- 공유 링크 생성
- Plan B 추천
- 기상 변화 재조회 시나리오 구현

### Phase 5. 데모 품질 개선

기간: 1주

- 폭염 시나리오 테스트
- 우천 시나리오 테스트
- 혼잡도 높은 지역 테스트
- API 장애 fallback 테스트
- 발표용 시연 스크립트 제작

---

## 15. MVP Scope

### MVP 포함 범위

- 서울 지역 한정
- 현재 위치 또는 자치구 기반 추천
- 오늘/내일/이번 주말 시나리오
- 날씨 조회
- 불쾌지수 계산
- 문화행사 검색
- 공공시설 후보 추천
- 혼잡도 반영
- 추천 점수 계산
- 추천 이유 제공
- 플랜 B 추천
- 공유 메시지 생성

### MVP 제외 범위

- 결제
- 예약
- 로그인 기반 장기 개인화
- 전국 지역 확장
- 실시간 푸시 알림
- 복잡한 여행 일정 자동 생성
- 리뷰 기반 감성 분석

### MVP 성공 기준

- 사용자가 한 문장 입력 후 5초 내 추천 결과를 받는다.
- 추천 결과는 최소 3개 이상 제공된다.
- 각 추천은 최소 3개 이상의 근거를 포함한다.
- 날씨 조건에 따라 실내/실외 추천이 달라진다.
- 무료 필터가 정상 작동한다.
- 외부 API 일부 실패 시에도 부분 추천이 가능하다.

---

## 16. Future Expansion

### 지역 확장

- 서울에서 수도권으로 확장
- 전국 지자체 열린데이터 연동
- 한국관광공사 API 연동
- 지역 축제 및 관광지 추천

### 개인화

- 선호 활동 학습
- 예산 선호 저장
- 이동수단 선호 저장
- 혼잡도 민감도 반영
- 혼자/연인/가족 모드 자동 인식

### 코스 추천

- 단일 장소 추천에서 반나절 코스로 확장
- 전시 → 카페 → 산책 코스 구성
- 날씨 기반 동선 최적화
- 이동 시간이 과도한 코스 제외

### Proactive Agent

- 저장한 일정의 날씨 변화 감지
- 일정 전 혼잡도 재확인
- 우천/폭염/혼잡 증가 시 대체안 제안
- 사용자가 묻기 전에 필요한 정보 제공

### B2G/B2B 확장

- 지자체 문화행사 활성화
- 공공시설 방문 유도
- 도시 혼잡 분산 추천
- 관광 안내 Agent
- 지역 상권 연계

---

## 17. Competition Strategy

### 창의성

뭐하지?는 단순한 장소 검색이 아니라 도시 맥락을 이해하는 AI Agent이다. 날씨, 불쾌지수, 혼잡도, 무료 여부, 거리라는 현실적인 판단 요소를 결합해 사용자가 실제로 행동할 수 있는 추천을 제공한다.

차별화 포인트:

- 자연어 한 문장으로 시작
- MCP Tool 기반 실시간 데이터 호출
- 공공 API를 활용한 신뢰 가능한 추천
- 추천 이후 플랜 B까지 이어지는 Agentic 경험
- “지금 할 수 있는 것”에 집중한 즉시성

### 편의성

사용자는 검색 조건을 복잡하게 설정하지 않아도 된다. “오늘 뭐하지?”라고 입력하면 Agent가 위치, 시간, 날씨, 행사, 혼잡도, 비용을 자동으로 고려한다.

편의성 확보 전략:

- 입력 최소화
- 추천 이유 자동 설명
- 무료/실내/가까운 곳 재필터링
- 일정 저장과 공유 지원
- 우천 시 대체 추천 제공

### 안정성

공모전 데모에서 중요한 것은 안정적인 동작이다. 외부 API는 실패할 수 있으므로 MCP Tool 단위로 fallback을 설계한다.

안정성 확보 전략:

- Tool별 timeout
- Tool별 retry
- Redis 캐시
- 부분 성공 응답
- 데이터 기준 시각 표시
- confidence 표시

### 데모 시나리오

1. 사용자가 “오늘 뭐하지?” 입력
2. Agent가 현재 위치와 날씨를 확인
3. 불쾌지수가 높다고 판단
4. 실내 무료 전시와 공공시설 추천
5. 사용자가 “비 오면?” 입력
6. Agent가 실내 플랜 B 추천
7. 사용자가 “공유해줘” 입력
8. Agent가 공유 메시지 생성

이 흐름은 MCP, Agentic AI, 공공 데이터, 사용자 편의성을 모두 보여준다.

---

## 18. Risk Analysis

### Risk 1. 외부 API 장애

영향:

- 날씨, 행사, 혼잡도 데이터를 가져오지 못할 수 있다.

대응:

- Redis 캐시 사용
- 최근 조회 데이터 fallback
- 실패한 Tool만 제외하고 부분 추천
- 응답에 누락 데이터 명시

예시:

```json
{
  "status": "partial_success",
  "message": "혼잡도 데이터는 현재 확인할 수 없어 날씨와 거리 중심으로 추천했습니다.",
  "missing_tools": ["get_city_congestion"]
}
```

### Risk 2. 혼잡도 데이터 커버리지 제한

영향:

- 모든 장소에 정확한 혼잡도 정보를 제공하기 어렵다.

대응:

- 서울 주요 장소 Area와 추천 후보를 매핑
- 인근 Area 혼잡도 근사 사용
- 매핑 실패 시 기본 점수 부여
- confidence를 낮게 표시

### Risk 3. 행사 데이터 품질 문제

영향:

- 종료된 행사, 위치 누락, 가격 누락 가능성이 있다.

대응:

- 날짜 필터링 강화
- 위치 없는 후보 감점
- 가격 정보 없음은 무료로 처리하지 않음
- 원본 source URL 제공

### Risk 4. 날씨 예보 변동성

영향:

- 주말 추천의 정확도가 낮아질 수 있다.

대응:

- 예보 기준 시각 표시
- 일정 전 재조회
- 플랜 B 기본 제공
- 강수 확률이 애매하면 실내/실외 혼합 추천

### Risk 5. 개인정보 우려

영향:

- 사용자가 위치 권한을 거부할 수 있다.

대응:

- 자치구 입력 대체 제공
- 위치 저장 opt-in
- 세션 단위 위치 사용
- 로그 좌표 마스킹

### Risk 6. AI 설명의 환각

영향:

- 실제 데이터에 없는 추천 이유가 생성될 수 있다.

대응:

- reason code 기반 설명 생성
- Tool Output에 있는 값만 사용
- 불확실한 정보는 “확인 불가”로 표시
- 추천 근거 보기 제공

### Rate Limit Strategy

```text
weather:{nx}:{ny}:{base_time}        TTL 10~30분
events:{date}:{district}:{category}  TTL 6~24시간
congestion:{area_name}               TTL 3~5분
distance:{origin}:{destination}      TTL 24시간
recommendation:{intent}:{context}    TTL 5분
```

전략:

- 동일 세션 내 중복 Tool 호출 제거
- 날씨는 격자/시간 단위 캐싱
- 문화행사는 일 단위 캐싱
- 혼잡도는 짧은 TTL 유지
- 거리 계산은 긴 TTL 유지

### Caching Strategy

- Redis를 1차 캐시로 사용한다.
- PostgreSQL에는 정규화된 장소와 행사 정보를 저장한다.
- API 원본 응답은 디버깅과 데이터 품질 검증을 위해 제한적으로 저장한다.
- 캐시 데이터 사용 시 응답에 `cached: true`와 기준 시각을 표시한다.

### Error Handling

Tool 실패 응답 표준:

```json
{
  "tool": "get_city_congestion",
  "status": "error",
  "error_code": "TIMEOUT",
  "message": "서울 실시간 도시데이터 응답 시간이 초과되었습니다.",
  "fallback_available": true
}
```

사용자 응답 표준:

```text
혼잡도 정보는 현재 확인하지 못했습니다.
대신 날씨, 거리, 무료 여부를 기준으로 추천했습니다.
```

### 최종 제품 원칙

뭐하지?는 사용자가 검색을 잘하게 만드는 서비스가 아니다. 사용자가 더 쉽게 결정하게 만드는 서비스다. 성공적인 MVP는 많은 기능보다 명확한 Agent 경험에 집중해야 한다. 한 문장 입력, 실시간 데이터 호출, 상황 판단, 설명 가능한 추천, 그리고 플랜 B까지 이어지는 흐름이 제품의 핵심이다.

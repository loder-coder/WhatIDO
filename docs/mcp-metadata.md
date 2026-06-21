# MCP Metadata

## Project

- Name: 뭐하지?
- Type: PlayMCP MCP Server
- Runtime: Node.js 22 + TypeScript
- Primary region: Seoul
- Transport: Stateless MCP Streamable HTTP (`POST /mcp`)
- Health endpoint: `GET /health`

## Value proposition

뭐하지?는 사용자의 “오늘 뭐하지?”, “내일 뭐하지?”, “이번 주말 뭐하지?” 질문을 날씨, 불쾌지수, 거리, 무료 여부, 혼잡도 기반의 행동 가능한 추천으로 바꾸는 Agentic AI MCP Server이다.

이 서비스는 장소 검색이 아니라 여가 의사결정 지원에 집중한다.

## Public tools

Every public tool declares an English description containing WhatIDO(뭐하지?) and
the following MCP annotations: `title`, `readOnlyHint: true`,
`destructiveHint: false`, `openWorldHint: true`, and `idempotentHint: true`.

### `today_what_to_do`

오늘 바로 실행 가능한 서울 활동을 추천한다.

Uses:

- 현재 또는 기준 위치
- 현재 날씨와 불쾌지수
- 오늘 이용 가능한 행사/시설
- 거리와 예상 이동 시간
- 무료 여부
- 혼잡도

### `tomorrow_what_to_do`

내일 하루 또는 반나절 계획에 맞는 서울 활동을 추천한다.

Uses:

- 내일 날짜 범위
- 내일 예보
- 선호 시간대
- 운영 시간과 예약 리스크
- 거리, 무료 여부, 혼잡도

### `weekend_what_to_do`

다가오는 토요일/일요일 주말 활동을 추천한다.

Uses:

- Asia/Seoul 기준 다가오는 주말 날짜
- 주말 날씨 리스크
- 서울 전역 후보
- 무료 여부 가중치
- 혼잡도
- Plan B 필요 여부

## Data sources

- KMA weather forecast API
- Seoul Open Data cultural events
- Seoul Realtime City Data
- Culture Portal supplemental events
- Local Seoul district center table
- Internal mock providers for demos and fallback

## Stability design

- Public tools return common envelopes.
- Provider failures degrade to `partial_success` where possible.
- Missing data is reported through `warnings` and `missing_data`.
- Mock mode works without API keys.
- Secrets are loaded from environment variables only.
- Missing non-mock production secrets return a degraded health response instead
  of preventing the HTTP server from listening.

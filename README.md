# WhatIDO MCP

독립 실행형 PlayMCP Remote MCP 서버입니다. 공공 데이터 Provider를 MCP 서버에서
직접 호출하며, Next.js/Vercel API에 의존하지 않습니다.

## Public tools

- `today_what_to_do`
- `tomorrow_what_to_do`
- `weekend_what_to_do`

## Environment

```env
KMA_SERVICE_KEY=
SEOUL_OPEN_DATA_API_KEY=
SEOUL_CITY_DATA_API_KEY=
CULTURE_PORTAL_SERVICE_KEY=
```

`KMA_API_KEY`, `CULTURE_PORTAL_API_KEY`,
`SEOUL_REALTIME_CITY_DATA_API_KEY` aliases are supported. Culture Portal is
supplemental: its key may be omitted while Seoul Open Data recommendations remain available.

Production keeps the HTTP port open even if required provider keys are missing;
`GET /health` reports `degraded` with the missing configuration. API secrets are
never written to logs or tool responses.

## Local development

```bash
npm install
NODE_ENV=development MOCK_PROVIDERS=false CACHE_BACKEND=memory npm run dev
```

## Remote MCP deployment

The Remote MCP URL must be:

```text
https://<deployment-host>/mcp
```

`GET /health` is available for readiness checks. The server uses Streamable HTTP
and supports MCP initialize, tools/list, and tools/call at `/mcp`.

## UTF-8 provider safety

Seoul Open Data and Seoul realtime city responses are decoded from raw bytes as
UTF-8 before JSON parsing. Common UTF-8-as-Latin1 mojibake is corrected for
provider values, so fields such as `TITLE`, `PLACE`, `GUNAME`, `AREA_NM`, and
`AREA_CONGEST_LVL` remain readable Korean.

## Verification

```bash
npm run typecheck
npm test
npm run build
```

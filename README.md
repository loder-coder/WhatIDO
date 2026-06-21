# WhatIDO (뭐하지?)

WhatIDO is a PlayMCP MCP server that recommends actionable activities in Seoul for
“오늘 뭐하지?”, “내일 뭐하지?”, and “이번 주말 뭐하지?” requests. Recommendations
combine weather, discomfort index, distance, admission cost, and congestion data.

## Public MCP tools

| Tool | Use case |
| --- | --- |
| `today_what_to_do` | Activities available today; distance and immediacy are weighted most heavily. |
| `tomorrow_what_to_do` | Tomorrow’s plan; forecast, requested time of day, and availability are emphasized. |
| `weekend_what_to_do` | Upcoming weekend plan; compares weekend weather and favors free Seoul-wide options. |

Each tool accepts a required `query`, an optional Seoul location and preferences,
and `result_limit` from 1 through 5. Results use a common JSON envelope with
recommendations, warnings, missing data, request ID, and generation time.

## Transport and endpoints

The server uses stateless MCP Streamable HTTP only. It does not implement STDIO,
legacy SSE, or per-user MCP session storage.

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/mcp` | `POST` | MCP `initialize`, `tools/list`, and `tools/call` |
| `/health` | `GET` | Container readiness and missing-runtime-configuration details |

Set the PlayMCP Remote MCP URL to:

```text
https://<deployment-host>/mcp
```

The container listens on `0.0.0.0` and uses `PORT`, defaulting to `8080`.

## Run locally

Requirements: Node.js 22 LTS and npm.

```bash
npm install
MOCK_PROVIDERS=true CACHE_BACKEND=memory npm run dev
```

For the production artifact:

```bash
npm run build
npm start
```

## Environment configuration

Copy `.env.example` for local development. Never commit actual secrets.

| Variable | Required when | Notes |
| --- | --- | --- |
| `NODE_ENV` | Always | `development`, `test`, or `production` |
| `PORT` | Optional | Defaults to `8080` |
| `MOCK_PROVIDERS` | Optional | `true` uses deterministic mock providers; do not enable by default in production |
| `CACHE_BACKEND` | Optional | `memory` by default; set `redis` only when Redis is configured |
| `REDIS_URL` | `CACHE_BACKEND=redis` in production | Redis connection URL |
| `KMA_SERVICE_KEY` | production non-mock | KMA weather provider |
| `CULTURE_PORTAL_SERVICE_KEY` | production non-mock | Culture Portal provider |
| `SEOUL_OPEN_DATA_API_KEY` | production non-mock | Seoul event provider |
| `SEOUL_CITY_DATA_API_KEY` | production non-mock | Seoul congestion provider |

Compatibility aliases are supported: `KMA_API_KEY`, `CULTURE_PORTAL_API_KEY`,
and `SEOUL_REALTIME_CITY_DATA_API_KEY`.

If a required production secret is absent, the server still opens its HTTP port
and `GET /health` returns `200` with `status: "degraded"` and a
`missingConfiguration` array. This makes deployment misconfiguration visible
without turning it into an opaque platform 503.

## Docker and PlayMCP deployment

```bash
docker build -t whatdowedo-mcp .
docker run --env-file .env -p 8080:8080 whatdowedo-mcp
```

Before creating the PlayMCP MCP registration:

1. Add production values as runtime secrets, not build-time variables.
2. Redeploy and check the container log for configuration warnings or startup errors.
3. Confirm `GET /health` returns `status: "ok"`.
4. Use the Remote MCP URL ending in `/mcp` and run `initialize`, `tools/list`, and a tool call.

The Dockerfile starts the built artifact with `npm start`.

## Verification status

Targeted environment and Streamable HTTP transport tests pass. The repository
currently has unrelated weather-module type and test failures, so the full
`npm run typecheck`, `npm test`, and `npm run build` checks do not yet pass.
See [docs/deployment-validation.md](docs/deployment-validation.md) for the
current deployment validation checklist.

## Documentation

- [MCP metadata](docs/mcp-metadata.md)
- [Tool descriptions](docs/tool-descriptions.md)
- [Deployment validation](docs/deployment-validation.md)
- [Submission checklist](docs/submission-checklist.md)
- [Fallback demo plan](docs/fallback-demo-plan.md)

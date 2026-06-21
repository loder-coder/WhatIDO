# Environment variables

This file documents variable names only. Never commit actual secret values.

| Variable | Purpose | Required when |
| --- | --- | --- |
| `NODE_ENV` | Runtime mode: `development`, `test`, or `production` | Always; defaults to `development` |
| `PORT` | HTTP listen port | Optional; defaults to `8080` |
| `LOG_LEVEL` | Structured log level | Optional; defaults to `info` |
| `MOCK_PROVIDERS` | Enables deterministic mock providers | Optional; defaults to `true` when unset |
| `CACHE_BACKEND` | `memory` or `redis` | Optional; defaults to `memory` |
| `REDIS_URL` | Redis connection URL | `NODE_ENV=production` and `CACHE_BACKEND=redis` |
| `KMA_BASE_URL` | KMA API base URL | Provider configuration |
| `KMA_SERVICE_KEY` | KMA weather API key | Production non-mock mode |
| `SEOUL_OPEN_DATA_BASE_URL` | Seoul events API base URL | Provider configuration |
| `SEOUL_OPEN_DATA_API_KEY` | Seoul events API key | Production non-mock mode |
| `SEOUL_CITY_DATA_BASE_URL` | Seoul city data API base URL | Provider configuration |
| `SEOUL_CITY_DATA_API_KEY` | Seoul congestion API key | Production non-mock mode |
| `CULTURE_PORTAL_BASE_URL` | Culture Portal API base URL | Provider configuration |
| `CULTURE_PORTAL_SERVICE_KEY` | Culture Portal API key | Production non-mock mode |

Compatibility aliases accepted by the server:

| Alias | Canonical variable |
| --- | --- |
| `KMA_API_KEY` | `KMA_SERVICE_KEY` |
| `CULTURE_PORTAL_API_KEY` | `CULTURE_PORTAL_SERVICE_KEY` |
| `SEOUL_REALTIME_CITY_DATA_API_KEY` | `SEOUL_CITY_DATA_API_KEY` |

## Production readiness

For `NODE_ENV=production` with `MOCK_PROVIDERS` not set to `true`, the four
provider keys are required. `REDIS_URL` is required only with
`CACHE_BACKEND=redis`.

The server intentionally keeps its HTTP port open when these secrets are absent.
`GET /health` then returns `200`, `status: "degraded"`, and the exact names in
`missingConfiguration`. Add secrets as PlayMCP runtime secrets, redeploy, and
confirm the health status is `ok` before registering the Remote MCP URL.

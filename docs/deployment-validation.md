# Deployment Validation

## Local validation

Run these checks before release:

```text
npm ci
npm run typecheck
npm run build
npm test
```

Current repository status: targeted environment and Streamable HTTP tests pass,
but the full typecheck, build, and test suite are blocked by unrelated weather
module type/test failures. Do not mark the release ready until those failures are
resolved.

## Docker validation

Dockerfile and `.dockerignore` are prepared for PlayMCP in KC Git Source Build deployment.

Local Docker image build cannot run in this environment because the Docker CLI is not installed on the workstation.

Expected command in an environment with Docker:

```bash
docker build -t whatdowedo-mcp .
docker run -e NODE_ENV=production -p 8080:8080 whatdowedo-mcp
```

Before PlayMCP deployment, verify `GET /health` after the production container
starts. A missing runtime secret must return `200` with `status: "degraded"` and
`missingConfiguration`, rather than preventing the container from opening port
`8080`. With production runtime secrets present, `/health` must return
`status: "ok"` before MCP initialization and `tools/list` are checked.

## MCP endpoint validation

Local MCP discovery and public tool smoke behavior are covered by:

```text
tests/integration/toolDiscovery.test.ts
tests/integration/recommendationTools.test.ts
tests/integration/qualityScenarios.test.ts
tests/integration/streamableHttpTransport.test.ts
```

For an MCP client, send `Accept: application/json, text/event-stream` on MCP
POST requests, then verify `initialize`, `tools/list`, and one `tools/call`.

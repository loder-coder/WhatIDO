# Deployment Validation

## Local validation

The following checks passed in the local Windows development environment:

```text
npm ci
npm run typecheck
npm run build
npm test
```

Current automated test suite:

```text
10 test files
40 tests
```

## Docker validation

Dockerfile and `.dockerignore` are prepared for PlayMCP in KC Git Source Build deployment.

Local Docker image build was intentionally skipped in this environment by user instruction because Docker CLI is not installed on the workstation.

Expected command in an environment with Docker:

```bash
docker build -t whatdowedo-mcp .
```

## MCP endpoint validation

Local MCP discovery and public tool smoke behavior are covered by:

```text
tests/integration/toolDiscovery.test.ts
tests/integration/recommendationTools.test.ts
tests/integration/qualityScenarios.test.ts
```

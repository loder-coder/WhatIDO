# Submission Checklist

## Functionality

- [x] Three public tools are registered.
- [x] `today_what_to_do` returns ranked recommendations.
- [x] `tomorrow_what_to_do` returns `tomorrow_plan`.
- [x] `weekend_what_to_do` returns `weekend_plan` and `weekend_summary`.
- [x] Weather and discomfort index are included.
- [x] Distance, free admission, and congestion are scored.
- [x] Partial success response is implemented.
- [x] Mock provider mode works without API keys.

## Quality

- [x] `npm ci`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] `npm test`
- [x] Secret values are not committed.
- [x] Required env vars are documented in `.env.example` and `env_we_need.md`.

## Deployment

- [x] Dockerfile exists.
- [x] `.dockerignore` exists.
- [x] README includes PlayMCP in KC deployment steps.
- [x] Local MCP discovery and tool smoke tests are automated.
- [ ] Docker image build in a Docker-enabled environment.
- [ ] PlayMCP deployment URL.
- [ ] PlayMCP screenshots.

## Demo

- [x] Hot today scenario documented.
- [x] Rainy weekend scenario documented.
- [x] Free date scenario documented.
- [x] Fallback demo plan documented.

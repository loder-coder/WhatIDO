# Screenshot Checklist

Screenshots should be captured in PlayMCP after deployment.

Required captures:

- Tool discovery screen showing:
  - `today_what_to_do`
  - `tomorrow_what_to_do`
  - `weekend_what_to_do`
- `today_what_to_do` result for hot weather mock scenario
- `weekend_what_to_do` result with `weekend_plan.plan_b_recommended`
- `partial_success` result showing warning and missing data

Local Docker screenshot capture was not performed because Docker CLI is unavailable
in this environment. Capture `/health` with `status: "ok"` after a successful
PlayMCP deployment, and capture the `degraded` response only for configuration
troubleshooting; do not use degraded mode for the submission demo.

# Fallback Demo Plan

## When API keys are unavailable

Set:

```text
MOCK_PROVIDERS=true
CACHE_BACKEND=memory
```

The server uses deterministic mock weather, event, and congestion providers. This supports:

- hot today indoor recommendation
- rainy tomorrow/weekend recommendation
- free activity ranking
- congestion-aware ranking

## When a provider fails

Expected behavior:

- Weather failure: use neutral weather and add `WEATHER_UNAVAILABLE`.
- Event failure: use cache if available, otherwise fallback category suggestion.
- Congestion failure: use unknown congestion with score 60 and low confidence.
- Location missing: degrade to Seoul-wide recommendation and warn.

## Demo message

“외부 공공 API는 실패할 수 있기 때문에 뭐하지?는 실패를 숨기지 않습니다. 가능한 데이터로 `partial_success`를 반환하고, 어떤 데이터가 누락됐는지 `warnings`와 `missing_data`에 명확히 표시합니다.”

## Validation tests

```text
tests/integration/recommendationTools.test.ts
tests/integration/qualityScenarios.test.ts
tests/unit/errors/errorHandling.test.ts
```

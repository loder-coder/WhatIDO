# Demo Scenarios

## Scenario 1. 폭염 오늘 추천

Input:

```json
{
  "query": "오늘 무료로 뭐하지?",
  "location": {
    "district": "송파구",
    "latitude": 37.5145,
    "longitude": 127.1059
  },
  "preferences": {
    "free_preferred": true,
    "low_crowd_preferred": true
  },
  "result_limit": 3
}
```

Expected story:

- Mock weather returns hot, humid weather.
- Discomfort index is very high.
- Indoor free recommendations rank above outdoor candidates.
- Explanation mentions discomfort index, free admission, distance, and congestion.

## Scenario 2. 비 오는 주말 실내 플랜

Input:

```json
{
  "query": "이번 주말 비 오면 실내 데이트 뭐하지?",
  "location": {
    "district": "마포구"
  },
  "companions": "couple",
  "preferences": {
    "indoor_preferred": true,
    "free_preferred": true
  },
  "result_limit": 3
}
```

Expected story:

- Weekend mock forecast has rain risk.
- `weekend_plan.plan_b_recommended` is true.
- Indoor activities rank above outdoor market candidates.
- Missing or approximate data is visible instead of hidden.

## Scenario 3. 무료 데이트 추천

Input:

```json
{
  "query": "이번 주말 무료 데이트 뭐하지?",
  "location": {
    "district": "성동구"
  },
  "companions": "couple",
  "preferences": {
    "free_preferred": true,
    "date_friendly": true,
    "low_crowd_preferred": true
  },
  "result_limit": 5
}
```

Expected story:

- Free candidates are favored.
- Unknown price candidates are not treated as free.
- Crowded areas are penalized when low-crowd preference is present.

## Scenario 4. Partial success

Input:

```json
{
  "query": "오늘 뭐하지?",
  "result_limit": 3
}
```

Expected story:

- Location is missing.
- Response status is `partial_success`.
- Warning includes `LOCATION_MISSING`.
- The response shape remains stable.

# Tool Descriptions

## `today_what_to_do`

Use when the user wants something to do today, now, this evening, or after work.

Example input:

```json
{
  "query": "오늘 퇴근하고 뭐하지?",
  "location": {
    "district": "강남구"
  },
  "companions": "solo",
  "preferences": {
    "free_preferred": true,
    "low_crowd_preferred": true,
    "transport_mode": "public_transit"
  },
  "result_limit": 3
}
```

Expected output:

- `status`
- `intent: "today"`
- weather/discomfort summary
- 1~5 ranked recommendations
- reasons based on data
- warnings and missing data

## `tomorrow_what_to_do`

Use when the user wants to plan tomorrow or a half-day activity.

Example input:

```json
{
  "query": "내일 아이랑 뭐하지?",
  "location": {
    "district": "노원구"
  },
  "companions": "family",
  "preferred_time_of_day": "afternoon",
  "preferences": {
    "family_friendly": true,
    "indoor_preferred": true
  },
  "result_limit": 3
}
```

Expected output:

- `intent: "tomorrow"`
- tomorrow date window
- `tomorrow_plan`
- recommendations weighted toward weather and time fit

## `weekend_what_to_do`

Use when the user asks about this weekend or the upcoming Saturday/Sunday.

Example input:

```json
{
  "query": "이번 주말 무료 데이트 뭐하지?",
  "location": {
    "district": "마포구"
  },
  "companions": "couple",
  "preferences": {
    "free_preferred": true,
    "date_friendly": true
  },
  "result_limit": 5
}
```

Expected output:

- `intent: "weekend"`
- weekend date window
- `weekend_summary`
- `weekend_plan`
- plan B flag for rain/heat/high discomfort

## Location-first conversation

```text
User: 오늘 뭐하지?
Assistant: 서울 내 어느 동이나 구를 기준으로 찾아볼까요? 예: 송파구, 잠실
User: 송파구 잠실 근처
Assistant: (calls today_what_to_do with location.district = "잠실")
```

If location is omitted despite the tool description, the server returns
`status: "needs_location"` with no recommendations instead of silently using
Seoul City Hall.

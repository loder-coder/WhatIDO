# env_we_need.md

Phase 2~11 구현과 배포에 필요한 환경 변수 요구사항이다. 실제 secret 값은 이 파일에 기록하지 않는다.

| Name | Purpose | Issuer / Source | Mock Replacement |
|---|---|---|---|
| `KMA_SERVICE_KEY` | 기상청 초단기실황/단기예보 조회 | 기상청 / 공공데이터포털 | `MOCK_PROVIDERS=true`에서 mock weather 사용 |
| `SEOUL_OPEN_DATA_API_KEY` | 서울 문화행사 후보 조회 | 서울 열린데이터광장 | `MOCK_PROVIDERS=true`에서 mock event fixture 사용 |
| `SEOUL_CITY_DATA_API_KEY` | 서울 실시간 도시데이터 혼잡도 조회 | 서울 열린데이터광장 실시간 도시데이터 | `MOCK_PROVIDERS=true`에서 mock congestion 사용 |
| `CULTURE_PORTAL_SERVICE_KEY` | 문화포털 보조 행사 후보 조회 | 문화포털 / 공공데이터포털 | `MOCK_PROVIDERS=true`에서 provider 결과 없음으로 degrade |
| `REDIS_URL` | production Redis cache 연결 | 배포 환경 / Redis provider | `CACHE_BACKEND=memory`에서 InMemoryCache 사용 |

Compatibility aliases currently accepted by the app:

| Alias | Canonical Name |
|---|---|
| `KMA_API_KEY` | `KMA_SERVICE_KEY` |
| `CULTURE_PORTAL_API_KEY` | `CULTURE_PORTAL_SERVICE_KEY` |
| `SEOUL_REALTIME_CITY_DATA_API_KEY` | `SEOUL_CITY_DATA_API_KEY` |

# ENHANCEMENT_PLAN

# Section 1: Current MVP Assessment

## 현재 MVP 요약

**뭐하지?**의 현재 MVP는 사용자가 “오늘 뭐하지?”, “내일 뭐하지?”, “이번 주말 뭐하지?”라고 입력하면 서울 지역의 날씨, 불쾌지수, 거리, 무료 여부, 혼잡도를 종합해 활동을 추천하는 PlayMCP MCP Server이다.

현재 MVP의 강점은 명확하다. 사용자의 실제 의사결정 기준을 반영하고, MCP Tool을 통해 외부 공공 데이터를 호출하며, 단순 검색이 아니라 Agentic AI 추천 경험을 제공한다.

다만 공모전에서 수상 가능성을 높이려면 기능적 추천을 넘어 **기억에 남는 순간**, **공유하고 싶은 결과**, **다시 쓰고 싶은 루프**, **심사위원이 즉시 이해하는 Agentic 차별성**을 강화해야 한다.

## SWOT Analysis

### Strengths

- 사용자의 일상적인 질문인 “뭐하지?”를 직접적으로 해결한다.
- 서울 시민과 방문객 모두에게 직관적인 문제를 다룬다.
- 날씨, 불쾌지수, 거리, 무료 여부, 혼잡도를 결합한 추천은 실용성이 높다.
- MCP Server 구조가 명확하고 PlayMCP 공모전 취지와 잘 맞는다.
- 공공 API 기반이라 신뢰성과 공익성이 있다.
- “오늘/내일/주말”이라는 intent 구분이 명확하다.
- 추천 이유를 설명할 수 있어 일반 검색 서비스보다 신뢰를 만들 수 있다.
- partial success와 fallback 구조가 있어 안정성 어필이 가능하다.
- 무료 문화행사와 숨은 장소를 잘 연결하면 사용자 투표에 유리하다.

### Weaknesses

- MVP만으로는 장소 검색 서비스처럼 보일 위험이 있다.
- 추천 결과가 정적 목록에 머물면 Agentic 차별성이 약해진다.
- 실제 API 데이터 품질이 낮으면 추천 품질이 흔들릴 수 있다.
- 혼잡도 데이터는 모든 장소를 커버하지 못한다.
- 개인화가 없으면 재방문 동기가 약할 수 있다.
- 공유 기능이 없으면 바이럴 성장 가능성이 낮다.
- “재미있다”는 감정적 경험보다 “유용하다”에 치우칠 수 있다.
- 공모전 데모에서 시각적 임팩트가 부족할 수 있다.

### Opportunities

- “비 오면 플랜 B”, “폭염이면 실내 대체”, “혼잡하면 다른 곳” 같은 Agentic 행동을 강화할 수 있다.
- 카카오톡 공유 카드, 커플 데이트 카드, 가족 나들이 카드로 사용자 공유를 유도할 수 있다.
- 숨은 무료 전시, 덜 알려진 문화행사 추천으로 기존 지도 서비스와 차별화할 수 있다.
- 주간 추천 digest로 retention loop를 만들 수 있다.
- “오늘의 서울 컨디션” 같은 감성적 요약으로 기억에 남는 브랜드 경험을 만들 수 있다.
- 사용자가 투표하고 싶어지는 “아, 이거 진짜 쓸 만하다” 순간을 만들 수 있다.

### Risks

- 외부 API 장애가 데모 실패로 이어질 수 있다.
- 날씨와 행사 데이터가 실제와 다르면 신뢰를 잃는다.
- 추천 이유가 빈약하면 일반 챗봇과 차이가 없어 보인다.
- 너무 많은 기능을 넣으려다 안정성이 낮아질 수 있다.
- 사용자 위치 정보에 대한 우려가 생길 수 있다.
- 공모전 심사위원이 MCP Tool 구조보다 UI 결과만 보고 판단할 수 있다.
- 공유/개인화/알림 기능이 미완성 상태로 들어가면 오히려 완성도가 낮아 보인다.

---

# Section 2: Competition Evaluation

## 평가 기준별 현재 MVP 점수

| 평가 항목 | 현재 점수 | 목표 점수 | 평가 |
|---|---:|---:|---|
| 창의성 | 7.5/10 | 9/10 | 상황 기반 추천은 좋지만 Agentic 행동이 더 필요 |
| 편의성 | 8/10 | 9.5/10 | 한 문장 입력은 강점, 공유/저장/재추천 UX 필요 |
| 안정성 | 7/10 | 9/10 | fallback 설계는 있으나 실제 구현과 데모 검증 필요 |
| 사용자 투표 | 6.5/10 | 9/10 | 감정적 임팩트와 바이럴 요소 부족 |
| 재방문성 | 5.5/10 | 8.5/10 | 개인화/주간 루프/저장 기능 필요 |
| 바이럴 성장 | 4.5/10 | 8/10 | 공유 카드, 커플/가족 플랜 기능 필요 |

## Creativity

현재 MVP는 단순 장소 검색을 넘어 날씨, 불쾌지수, 거리, 혼잡도를 조합한다는 점에서 창의성이 있다. 그러나 공모전에서는 “추천했다”보다 “Agent가 상황을 감시하고 대체 행동을 제안했다”가 더 강하게 보인다.

약점:

- 추천 이후 행동이 제한적이다.
- Plan B가 핵심 기능으로 보이기보다 보조 기능처럼 보일 수 있다.
- 결과가 카드 목록이면 지도/포털 서비스와 유사해 보일 수 있다.

개선 방향:

- “서울 컨디션 분석 → 추천 → 위험 감지 → 대체안” 흐름을 데모의 핵심으로 만든다.
- Agent가 먼저 판단했다는 느낌을 강화한다.

## Convenience

한 문장 입력은 매우 강력하다. 사용자는 “오늘 뭐하지?”만 입력하면 된다.

약점:

- 추천 결과를 바로 공유하거나 저장하는 기능이 없다면 실제 사용 흐름이 끊긴다.
- 사용자가 후속 조건을 입력했을 때 이전 추천 맥락을 유지해야 한다.

개선 방향:

- 공유 카드
- 일정 저장
- 조건 재추천
- “무료만”, “더 가까운 곳”, “비 오면?” 같은 빠른 후속 액션

## Stability

architecture.md와 AGENTS.md 기준으로 안정성 설계는 좋다. 그러나 공모전에서는 설계보다 실제 시연 안정성이 중요하다.

약점:

- API key, API 장애, 네트워크 지연이 데모를 망칠 수 있다.
- 공공 API 응답 품질이 일정하지 않다.

개선 방향:

- mock mode와 fixture demo mode 필수
- partial success를 기능적 강점으로 보여주기
- 캐시와 fallback 테스트 자동화

---

# Section 3: Enhancement Roadmap

## Stage 1 - MVP

### Objectives

- MCP Server로 세 core intent를 처리한다.
- 날씨, 불쾌지수, 거리, 무료 여부, 혼잡도를 반영한다.
- 추천 이유를 제공한다.
- 외부 API 실패 시 partial success를 반환한다.

### Features

- `today_what_to_do`
- `tomorrow_what_to_do`
- `weekend_what_to_do`
- Weather Service
- Event Service
- Congestion Service
- Recommendation Engine
- Cache fallback
- Reason code 기반 설명

### Expected Impact

- 심사위원이 프로젝트의 핵심 문제 해결력을 이해한다.
- PlayMCP MCP Server로서 기본 기능을 입증한다.
- “검색이 아니라 판단”이라는 메시지를 전달한다.

### Implementation Complexity

Medium

## Stage 2 - Competition Ready

### Objectives

- 공모전 심사와 사용자 투표에 강한 데모 경험을 만든다.
- Agentic behavior를 전면에 드러낸다.
- 공유 가능한 결과물을 만든다.
- mock/fallback 데모 안정성을 확보한다.

### Features

- Plan B 추천
- 날씨 변화 감지 시뮬레이션
- 혼잡 회피 추천
- 공유 가능한 주말 플랜 카드
- 커플/가족/혼자 모드
- 오늘의 서울 컨디션 요약
- 데모용 fixture mode
- partial success 시각화

### Expected Impact

- 창의성과 안정성을 동시에 보여준다.
- 사용자에게 “이건 진짜 써보고 싶다”는 인상을 준다.
- 투표 가능성을 높인다.

### Implementation Complexity

Medium to High

## Stage 3 - Public Release

### Objectives

- 실제 사용자가 반복적으로 사용할 수 있는 제품으로 확장한다.
- retention loop를 만든다.
- 개인화의 초기 단계를 도입한다.

### Features

- 즐겨찾기 활동 유형
- 최근 선택 기반 추천
- 주간 추천 digest
- 저장한 계획
- 일정 캘린더 export
- 카카오톡 공유
- 사용자 피드백 수집
- 추천 품질 모니터링

### Expected Impact

- 재방문율 증가
- 사용자 피드백 기반 추천 품질 개선
- 바이럴 공유 증가

### Implementation Complexity

High

## Stage 4 - Ecosystem Expansion

### Objectives

- 서울을 넘어 수도권/전국으로 확장한다.
- 지자체, 공공기관, 문화행사 플랫폼과 연결한다.
- 도시 혼잡 분산과 문화행사 활성화 도구로 발전한다.

### Features

- 전국 지자체 데이터 연동
- 한국관광공사 API 연동
- 지역별 숨은 행사 추천
- B2G 대시보드
- 지역 축제 Agent
- 관광객 다국어 지원
- 파트너 이벤트 등록 도구

### Expected Impact

- 공공성과 확장성이 커진다.
- 단순 앱이 아니라 도시형 Agent 플랫폼으로 발전한다.

### Implementation Complexity

Very High

---

# Section 4: Agentic Features

## 1. 우천 Plan B 추천

- **User Value**: 비가 와도 계획이 무너지지 않는다.
- **Implementation Approach**: 강수 확률 50~60% 이상이면 실내 후보를 별도 ranking한다.
- **Competition Impact**: Agentic 행동이 직관적으로 드러난다.

## 2. 폭염 Plan B 추천

- **User Value**: 더운 날 무리한 야외 활동을 피한다.
- **Implementation Approach**: DI 80 이상이면 실내/지하철 접근성 높은 후보를 우선한다.
- **Competition Impact**: 불쾌지수 활용이 강하게 보인다.

## 3. 혼잡 회피 추천

- **User Value**: 붐비는 장소를 피하고 덜 피곤한 선택을 한다.
- **Implementation Approach**: congestion score가 낮은 후보를 감점하고 대체 후보 제공.
- **Competition Impact**: 실시간 도시데이터 활용성이 보인다.

## 4. 일정 전 날씨 재확인

- **User Value**: 저장한 계획이 날씨 변화에 대응한다.
- **Implementation Approach**: MVP에서는 시뮬레이션, 이후 scheduler로 확장.
- **Competition Impact**: “Agent가 계속 신경 써준다”는 느낌을 준다.

## 5. 행사 취소 감지

- **User Value**: 헛걸음을 줄인다.
- **Implementation Approach**: 저장된 event id를 재조회하고 상태 변경 감지.
- **Competition Impact**: 단순 추천을 넘어 사후 관리 Agent로 보인다.

## 6. 대체 장소 자동 생성

- **User Value**: 마음에 안 드는 추천을 빠르게 바꿀 수 있다.
- **Implementation Approach**: 기존 reason code를 유지하고 문제 속성만 교체한다.
- **Competition Impact**: 후속 대화의 품질을 높인다.

## 7. 오늘 남은 시간 기반 추천

- **User Value**: 지금 출발해도 가능한 활동만 본다.
- **Implementation Approach**: 현재 시각, 운영 종료 시각, 이동 시간을 계산한다.
- **Competition Impact**: 실용성이 높게 느껴진다.

## 8. 막차 위험 감지

- **User Value**: 늦은 시간 외출 위험을 줄인다.
- **Implementation Approach**: 야간 요청 시 귀가 가능성 warning 제공.
- **Competition Impact**: 현실적인 Agent로 보인다.

## 9. 동행자별 재추천

- **User Value**: 혼자/커플/가족 상황에 맞는 추천을 받는다.
- **Implementation Approach**: companion type별 preference boost 적용.
- **Competition Impact**: 개인화처럼 느껴진다.

## 10. 아이 동반 안전 추천

- **User Value**: 부모가 안전하고 편한 장소를 고를 수 있다.
- **Implementation Approach**: family_friendly, indoor, toilet/facility metadata 우선.
- **Competition Impact**: 가족 사용자에게 강한 공감 포인트.

## 11. 비슷하지만 더 가까운 곳 추천

- **User Value**: 마음에 드는 유형을 유지하면서 이동 부담을 줄인다.
- **Implementation Approach**: selected category를 유지하고 distance weight를 강화.
- **Competition Impact**: 후속 명령 대응력이 좋아 보인다.

## 12. 비슷하지만 더 조용한 곳 추천

- **User Value**: 붐비는 장소 대신 쾌적한 대안을 찾는다.
- **Implementation Approach**: category 유지, congestion score 강화.
- **Competition Impact**: 혼잡도 데이터 활용이 돋보인다.

## 13. 무료만 다시 보기

- **User Value**: 예산 부담 없이 선택한다.
- **Implementation Approach**: isFree true 후보만 filtering, unknown price 제외.
- **Competition Impact**: 대학생/가성비 사용자에게 즉시 유용.

## 14. 실내만 다시 보기

- **User Value**: 비/더위/추위 걱정을 줄인다.
- **Implementation Approach**: isIndoor true 후보만 filtering.
- **Competition Impact**: 날씨 기반 Agent임이 분명해진다.

## 15. 서울 컨디션 요약

- **User Value**: 오늘 서울에서 어떤 활동이 좋은지 한눈에 이해한다.
- **Implementation Approach**: 날씨, 불쾌지수, 혼잡도 평균을 요약.
- **Competition Impact**: 데모 첫 화면 임팩트가 강하다.

## 16. 추천 이유 비교

- **User Value**: 여러 추천 중 왜 1위인지 이해한다.
- **Implementation Approach**: score component를 간단한 표로 제공.
- **Competition Impact**: 투명성과 신뢰도 상승.

## 17. 위험 표시 배지

- **User Value**: 비, 혼잡, 가격 미상 같은 리스크를 즉시 본다.
- **Implementation Approach**: warnings를 UI-friendly badge로 변환.
- **Competition Impact**: 안정성 설계가 사용자 경험으로 보인다.

## 18. 데모용 상황 전환

- **User Value**: 실제 사용자 기능은 아니지만 데모에서 날씨 변화 대응을 보여준다.
- **Implementation Approach**: mock mode에서 “비 예보로 변경” fixture 제공.
- **Competition Impact**: Agentic behavior를 1분 안에 시연 가능.

## 19. 숨은 장소 우선 모드

- **User Value**: 뻔한 장소 대신 새롭고 덜 붐비는 활동을 발견한다.
- **Implementation Approach**: popularity 낮음, free, low congestion 후보 boost.
- **Competition Impact**: 기존 지도 서비스와 차별화.

## 20. 결정 요약 메시지

- **User Value**: 추천 결과를 바로 동행자에게 보낼 수 있다.
- **Implementation Approach**: top recommendation을 공유 문장으로 압축.
- **Competition Impact**: 바이럴 기능으로 이어진다.

---

# Section 5: Viral Features

## 1. 카카오톡 공유 카드

추천 결과를 카카오톡에 바로 공유할 수 있는 카드로 생성한다.

## 2. 커플 데이트 카드

“이번 주말 우리 데이트 후보 3개” 형태로 감성적인 공유 메시지를 만든다.

## 3. 가족 나들이 플랜 카드

아이와 갈 만한 장소, 이동 시간, 비용, 실내 여부를 한 장으로 요약한다.

## 4. 주말 플랜 이미지 카드

토/일 추천을 카드 이미지처럼 보여준다.

## 5. “비 오면 여기” 공유 카드

비 예보가 있을 때 실내 대체 장소 3개를 공유한다.

## 6. 무료 데이트 코스 공유

돈을 아끼고 싶은 커플/대학생에게 강한 공유 동기를 제공한다.

## 7. 오늘의 서울 컨디션 공유

“오늘 서울은 실내 활동 추천” 같은 요약을 공유 가능하게 만든다.

## 8. 친구 투표형 후보 카드

추천 3개를 공유하고 친구가 고를 수 있게 한다.

## 9. “우리 어디 갈래?” 링크

동행자가 링크에서 선호 후보를 선택할 수 있게 한다.

## 10. 숨은 전시 발견 카드

덜 알려진 무료 전시를 감성적으로 공유한다.

## 11. 혼잡 회피 인증 카드

“오늘은 붐비는 곳 피해서 여기” 같은 메시지를 만든다.

## 12. 여행자용 서울 하루 추천 카드

서울 방문객이 자신의 여행 플랜을 공유할 수 있게 한다.

## 13. 공강 시간 추천 카드

대학생이 “공강 3시간에 갈 곳”을 공유할 수 있게 한다.

## 14. 데이트 비용 절약 카드

예상 비용 0원 또는 저비용 플랜을 강조한다.

## 15. 추천 결과 짧은 URL

MCP 응답 결과를 저장하고 공유 가능한 URL로 만든다.

---

# Section 6: Retention Features

## 1. 주간 추천 Digest

매주 금요일 오전에 이번 주말 추천을 제공한다.

## 2. 선호 활동 프로필

사용자가 전시형, 산책형, 가족형, 무료형 같은 프로필을 선택한다.

## 3. 최근 선택 기반 추천

이전에 클릭하거나 저장한 카테고리를 반영한다.

## 4. 좋아요/싫어요 피드백

추천 품질을 개선하고 사용자가 서비스에 참여하게 만든다.

## 5. 저장한 장소

나중에 갈 장소를 저장한다.

## 6. 저장한 계획의 날씨 재확인

일정 전에 날씨 변화를 알려준다.

## 7. 자주 가는 지역 설정

집, 회사, 학교 기준 추천을 쉽게 전환한다.

## 8. 예산 선호 저장

무료, 1만원 이하, 상관없음 같은 예산 선호를 저장한다.

## 9. 혼잡도 민감도 저장

사람 많은 곳을 싫어하는 사용자를 기억한다.

## 10. 동행자 모드 저장

혼자/커플/가족 모드를 빠르게 선택한다.

## 11. 비 오는 날 자동 추천

비 예보가 있으면 실내 추천을 먼저 보여준다.

## 12. 계절별 추천

여름엔 실내/야간, 가을엔 산책/야외 중심 추천.

## 13. 무료 행사 알림

사용자 근처 무료 문화행사가 생기면 알려준다.

## 14. 숨은 장소 컬렉션

“이번 주 숨은 무료 전시” 같은 정기 큐레이션.

## 15. 사용 후 피드백 루프

방문 후 “괜찮았나요?”를 묻고 추천 품질을 개선한다.

---

# Section 7: Vote-Winning Features

## 1. “비 오면 자동 플랜 B”

- **Why Vote**: 누구나 겪는 문제를 매우 직관적으로 해결한다.

## 2. “오늘 서울 컨디션”

- **Why Vote**: 한눈에 서비스의 똑똑함이 보인다.

## 3. 무료 데이트 추천

- **Why Vote**: 실용적이고 공유 욕구가 강하다.

## 4. 혼잡 회피 추천

- **Why Vote**: 지도 서비스와 다르게 실시간 도시 맥락을 반영한다.

## 5. 불쾌지수 기반 실내 추천

- **Why Vote**: 한국 여름에 매우 공감되는 기능이다.

## 6. 가족 나들이 안전 추천

- **Why Vote**: 부모 사용자에게 강한 실용성과 감정적 가치가 있다.

## 7. 숨은 무료 전시 발굴

- **Why Vote**: “이런 것도 있었어?”라는 발견의 기쁨을 준다.

## 8. 친구 투표형 추천 링크

- **Why Vote**: 사용자가 직접 퍼뜨릴 이유가 생긴다.

## 9. 카카오톡 공유 카드

- **Why Vote**: 한국 사용자 일상에 맞는 공유 방식이다.

## 10. 주말 토/일 비교 추천

- **Why Vote**: 주말 계획 고민을 실질적으로 줄인다.

## 11. “더 가까운 곳만” 재추천

- **Why Vote**: 대화형 Agent의 편리함이 드러난다.

## 12. “더 조용한 곳” 재추천

- **Why Vote**: 혼잡도 활용이 체감된다.

## 13. 일정 저장

- **Why Vote**: 추천이 행동으로 이어진다.

## 14. 가격 미상 경고

- **Why Vote**: 솔직한 추천이라 신뢰가 생긴다.

## 15. 데이터 기준 시각 표시

- **Why Vote**: 안정성과 신뢰도가 보인다.

## 16. 여행자 모드

- **Why Vote**: 서울 방문객도 쓸 수 있어 확장성이 보인다.

## 17. 공강 시간 추천

- **Why Vote**: 대학생에게 즉시 유용하다.

## 18. 야간 안전 귀가 warning

- **Why Vote**: Agent가 현실적인 배려를 한다고 느껴진다.

## 19. 추천 이유 비교표

- **Why Vote**: 왜 1위인지 납득된다.

## 20. API 실패에도 추천 유지

- **Why Vote**: 안정적인 제품이라는 인상을 준다.

---

# Section 8: Differentiation Strategy

## Naver Places 대비

Naver Places는 장소 데이터와 리뷰가 강하다. 그러나 사용자가 “지금 뭐하지?”라고 물었을 때 날씨, 불쾌지수, 무료 여부, 혼잡도, 시간 맥락을 종합해 행동을 결정해주지는 않는다.

뭐하지?의 차별점:

- 장소 검색이 아니라 의사결정
- 날씨와 불쾌지수 기반 추천
- 무료 공공행사 큐레이션
- Plan B와 후속 행동

## Kakao Map 대비

Kakao Map은 이동과 지도 UX가 강하다. 그러나 사용자가 할 일을 모르는 상태에서는 탐색 부담이 크다.

뭐하지?의 차별점:

- 사용자는 검색어를 몰라도 된다.
- “오늘/내일/주말” intent로 시작한다.
- 이동 정보는 추천 요소 중 하나일 뿐이다.
- 공유 카드와 동행자 맥락으로 확장 가능하다.

## Google Maps 대비

Google Maps는 글로벌 장소 탐색이 강하지만 서울 공공 문화행사, 무료 행사, 실시간 도시 혼잡도와의 결합은 약하다.

뭐하지?의 차별점:

- 서울 특화
- 공공 데이터 기반
- 무료/공공 문화행사 발굴
- 한국 사용자 일상 질문에 최적화

## Event Recommendation Services 대비

행사 추천 서비스는 행사 목록은 제공하지만 사용자 위치, 날씨, 불쾌지수, 혼잡도까지 결합하지 않는다.

뭐하지?의 차별점:

- 행사 자체보다 “지금 나에게 맞는지” 판단
- 당일 실행 가능성 검증
- 비/폭염/혼잡 시 대체안 제공
- Agentic 후속 행동

## 핵심 차별화 문장

> 네이버와 카카오는 장소를 찾아준다. 뭐하지?는 지금 내가 실제로 할 수 있는 선택을 정리해준다.

---

# Section 9: Hidden Gems Strategy

## 목표

뭐하지?는 유명 장소만 반복 추천하지 않고, 덜 알려졌지만 현재 상황에 잘 맞는 무료/저비용 문화행사와 숨은 장소를 발굴해야 한다.

## Hidden Gem 후보 조건

- 무료 또는 저비용
- 혼잡도 낮음 또는 중간 이하
- 대형 유명 장소가 아님
- 현재 날씨에 적합
- 운영 중 또는 방문 가능
- 사용자 위치에서 지나치게 멀지 않음
- source 신뢰 가능

## Ranking Logic

Hidden Gem Score:

```text
hidden_gem_score =
  base_recommendation_score * 0.65
+ free_score * 0.15
+ low_congestion_score * 0.10
+ novelty_score * 0.05
+ public_value_score * 0.05
- popularity_penalty
```

## Novelty Score

다음 조건을 만족하면 novelty를 높인다.

- 이전 추천에 자주 나오지 않은 장소
- 유명 관광지 카테고리가 아닌 장소
- 소규모 전시/도서관/공공 프로그램
- 자치구 문화행사

## Popularity Penalty

다음 후보는 과도한 반복을 피한다.

- 항상 상위에 나오는 대표 관광지
- 혼잡도가 높은 지역
- 매우 유명한 축제

## UX 표현

추천 카드에 다음 배지를 붙일 수 있다.

- 숨은 무료 전시
- 덜 붐비는 선택
- 동네 문화행사
- 오늘 발견하기 좋은 곳

---

# Section 10: Hyper-Personalization Roadmap

## Phase 1: Request-Level Personalization

MVP 단계.

입력 기반 선호만 사용한다.

- companion
- free_preferred
- indoor_preferred
- low_crowd_preferred
- max_budget
- transport_mode

## Phase 2: Session Memory

같은 세션에서 사용자의 후속 요청을 기억한다.

예시:

- “무료만”
- “더 가까운 곳”
- “실내만”
- “사람 적은 곳”

구현:

- session context에 filters 저장
- 이전 추천 후보와 reason code 유지

## Phase 3: Explicit Preference Profile

사용자 동의를 받고 선호를 저장한다.

저장 항목:

- 선호 지역
- 예산
- 이동수단
- 혼잡도 민감도
- 관심 카테고리
- 동행자 유형

## Phase 4: Behavioral Learning

사용자 행동을 기반으로 추천을 개선한다.

신호:

- 클릭
- 저장
- 공유
- 싫어요
- 재추천 요청
- 실제 방문 피드백

## Phase 5: Predictive Agent

사용자가 묻기 전에 추천한다.

예시:

- 금요일 오전 주말 추천
- 비 오는 날 실내 추천
- 무료 행사 시작 알림
- 저장한 일정의 Plan B 알림

---

# Section 11: Competition Killer Features

| Rank | Feature | Creativity | Convenience | Stability Risk | Effort |
|---:|---|---:|---:|---:|---:|
| 1 | 비/폭염 Plan B 추천 | 10 | 9 | Medium | M |
| 2 | 오늘의 서울 컨디션 요약 | 9 | 9 | Low | S |
| 3 | 공유 가능한 주말 플랜 카드 | 9 | 10 | Medium | M |
| 4 | 혼잡 회피 추천 | 9 | 8 | Medium | M |
| 5 | 숨은 무료 전시 발굴 | 9 | 8 | Medium | M |
| 6 | 커플 무료 데이트 추천 | 8 | 10 | Low | S |
| 7 | 가족 나들이 모드 | 8 | 9 | Low | M |
| 8 | 날씨 변화 감지 시뮬레이션 | 10 | 7 | Low | M |
| 9 | 추천 이유 비교표 | 7 | 9 | Low | S |
| 10 | mock/fallback 데모 모드 | 7 | 8 | Low | M |

## Top 10 상세

### 1. 비/폭염 Plan B 추천

- **Creativity Score**: 10
- **Convenience Score**: 9
- **Stability Risk**: Medium
- **Estimated Effort**: M
- **Reason**: Agentic AI의 핵심을 가장 직관적으로 보여준다.

### 2. 오늘의 서울 컨디션 요약

- **Creativity Score**: 9
- **Convenience Score**: 9
- **Stability Risk**: Low
- **Estimated Effort**: S
- **Reason**: 데모 시작 10초 안에 제품 가치를 설명한다.

### 3. 공유 가능한 주말 플랜 카드

- **Creativity Score**: 9
- **Convenience Score**: 10
- **Stability Risk**: Medium
- **Estimated Effort**: M
- **Reason**: 사용자 투표와 바이럴 성장에 직접적이다.

### 4. 혼잡 회피 추천

- **Creativity Score**: 9
- **Convenience Score**: 8
- **Stability Risk**: Medium
- **Estimated Effort**: M
- **Reason**: 서울 실시간 도시데이터 활용이 명확히 드러난다.

### 5. 숨은 무료 전시 발굴

- **Creativity Score**: 9
- **Convenience Score**: 8
- **Stability Risk**: Medium
- **Estimated Effort**: M
- **Reason**: 기존 지도 서비스와 차별화된다.

### 6. 커플 무료 데이트 추천

- **Creativity Score**: 8
- **Convenience Score**: 10
- **Stability Risk**: Low
- **Estimated Effort**: S
- **Reason**: 사용자 공감과 공유 가능성이 높다.

### 7. 가족 나들이 모드

- **Creativity Score**: 8
- **Convenience Score**: 9
- **Stability Risk**: Low
- **Estimated Effort**: M
- **Reason**: 가족 사용자의 실제 문제를 해결한다.

### 8. 날씨 변화 감지 시뮬레이션

- **Creativity Score**: 10
- **Convenience Score**: 7
- **Stability Risk**: Low
- **Estimated Effort**: M
- **Reason**: 실제 proactive 기능이 없어도 데모에서 Agentic 미래를 보여준다.

### 9. 추천 이유 비교표

- **Creativity Score**: 7
- **Convenience Score**: 9
- **Stability Risk**: Low
- **Estimated Effort**: S
- **Reason**: 신뢰도를 높이고 심사위원에게 로직을 설명하기 쉽다.

### 10. mock/fallback 데모 모드

- **Creativity Score**: 7
- **Convenience Score**: 8
- **Stability Risk**: Low
- **Estimated Effort**: M
- **Reason**: 공모전 데모 안정성에 결정적이다.

---

# Section 12: Prioritization Matrix

## Must Have

반드시 구현해야 한다.

- 세 MCP Tool
- 날씨/불쾌지수 반영
- 거리 반영
- 무료 여부 반영
- 혼잡도 반영
- 추천 이유
- partial success
- mock/fallback demo mode
- 오늘의 서울 컨디션 요약
- Plan B 추천

이유:

- 공모전 핵심 평가 기준인 창의성, 편의성, 안정성을 모두 직접 강화한다.

## Should Have

가능하면 구현해야 한다.

- 공유 가능한 주말 플랜 카드
- 커플 무료 데이트 모드
- 가족 나들이 모드
- 숨은 무료 전시 발굴
- 추천 이유 비교표
- 혼잡 회피 재추천
- “더 가까운 곳”, “무료만”, “실내만” 후속 요청

이유:

- 사용자 투표와 데모 몰입도를 높인다.

## Nice to Have

시간이 남으면 구현한다.

- 카카오톡 실제 공유 연동
- 캘린더 ICS 생성
- 주간 추천 digest
- 즐겨찾기
- 사용자 피드백
- 여행자 모드
- 공강 추천

이유:

- retention과 바이럴에 좋지만 MVP 안정성보다 우선하지 않는다.

## Experimental

공모전 이후 실험한다.

- 자동 푸시 알림
- 행동 기반 개인화
- 친구 투표 링크
- B2G 대시보드
- 전국 확장
- AI 기반 감성 코스 설명

이유:

- 임팩트는 크지만 구현 복잡도와 운영 부담이 높다.

---

# Section 13: Final Recommendation

## 가장 작은 고효율 수상 전략

최소 개발 노력으로 예선 통과, 결선 진출, 사용자 투표, 수상 가능성을 높이려면 다음 feature set에 집중해야 한다.

## 핵심 Feature Set

1. 세 MCP Tool 완성
   - `today_what_to_do`
   - `tomorrow_what_to_do`
   - `weekend_what_to_do`

2. 오늘의 서울 컨디션 요약
   - 날씨
   - 불쾌지수
   - 추천 방향

3. Plan B 추천
   - 비 오면 실내 대체
   - 폭염이면 실내 대체

4. 혼잡 회피 추천
   - 실시간 도시데이터 활용
   - 혼잡도 없으면 솔직한 warning

5. 무료/숨은 행사 추천
   - 무료 전시
   - 공공시설
   - 동네 문화행사

6. 공유 가능한 추천 요약
   - 카카오 실제 연동 전이라도 공유 문구 생성
   - 커플/가족/혼자 모드별 메시지

7. mock/fallback demo mode
   - API 장애와 관계없이 데모 가능
   - partial success를 안정성 강점으로 보여줌

## 예선 통과 전략

예선에서는 “이 프로젝트가 명확한 문제를 해결하는가?”가 중요하다.

보여줄 것:

- 한 문장 입력
- 공공 데이터 기반 판단
- 설명 가능한 추천
- PlayMCP MCP Tool 구조

## 결선 진출 전략

결선에서는 “이 프로젝트가 Agentic한가?”가 중요하다.

보여줄 것:

- 비 예보 감지
- Plan B 추천
- 혼잡 회피
- 후속 조건 재추천
- partial success

## 사용자 투표 전략

사용자 투표에서는 “나도 이거 쓰고 싶다”가 중요하다.

보여줄 것:

- 무료 데이트 추천
- 이번 주말 공유 카드
- 숨은 무료 전시
- 가족 나들이 추천
- 오늘 너무 더우니 실내 추천

## 수상 전략

수상 가능성을 높이는 최종 데모 흐름:

1. “오늘 뭐하지?” 입력
2. 오늘의 서울 컨디션 표시
3. 불쾌지수 높음으로 실내 무료 전시 추천
4. “비 오면?” 입력
5. Plan B 실내 후보 3개 추천
6. “무료 데이트로 공유해줘” 입력
7. 공유 가능한 주말 플랜 카드 생성
8. 혼잡도 API 실패 상황을 보여주고 partial success 설명

이 흐름은 창의성, 편의성, 안정성을 모두 보여준다.

## 최종 로드맵 추천

### 1순위

- MVP MCP Tool 완성
- 추천 엔진 안정화
- Plan B 추천
- 오늘의 서울 컨디션
- fallback demo mode

### 2순위

- 공유 카드
- 커플/가족/혼자 모드
- 숨은 무료 행사 추천
- 혼잡 회피 재추천

### 3순위

- 캘린더 저장
- 카카오 실제 연동
- 주간 digest
- 개인화 선호 저장

## 최종 결론

뭐하지?가 수상 가능성을 높이려면 기능을 많이 늘리기보다 **Agentic 순간을 선명하게 보여주는 것**에 집중해야 한다.

가장 강한 메시지는 다음이다.

> 뭐하지?는 장소를 검색하는 서비스가 아니라, 서울의 현재 상태를 이해하고 사용자가 오늘 실제로 할 수 있는 선택을 대신 정리해주는 Agent입니다.

이 메시지를 데모, README, MCP Tool 설명, 추천 결과, 공유 카드 전반에 일관되게 반영해야 한다.

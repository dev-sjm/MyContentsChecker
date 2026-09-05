# 아키텍처 및 데이터 모델

## 실행 흐름

`index.html` → `demo-data.js` → `app.js`

현재는 의존성 없는 단일 스크립트 구조다. `app.js`는 읽기 쉬운 섹션(저장소, 공급자, 렌더링, 이벤트)으로 나뉜다. 규모가 커지면 아래 권장 리팩터링 구조로 분리한다.

## localStorage 키

| 키 | 데이터 |
| --- | --- |
| `mcc-library` | 등록 콘텐츠 ID와 시청/별점 상태 |
| `mcc-content-cache` | 공급자에서 정규화한 콘텐츠 메타데이터 |
| `mcc-comments` | `콘텐츠ID:에피소드ID` 키를 쓰는 댓글 배열 |
| `mcc-trash` | 삭제 시각을 포함한 라이브러리 항목 |
| `mcc-tmdb-token` | 사용자가 입력한 TMDB 읽기 토큰 |
| `mcc-demo-version` | 마지막으로 적용한 데모 데이터 버전 |

첫 방문에는 `demo-data.js`의 7개 샘플을 저장소에 복사한다. 샘플은 실제 작품의 공개 정보·전체 회차 수와 대표 회차를 저장한 경량 스냅샷이다. 이미 개인 라이브러리가 있으면 복사하지 않으며, 설정 화면의 명시적 초기화만 이를 덮어쓴다.

## 공급자 전략

1. 토큰이 있으면 TMDB `search/multi`를 `ko-KR`로 조회한다.
2. 선택한 TV 작품은 시즌 API를 순회해 회차를 수집한다.
3. 실패 또는 결과 없음이면 TVmaze 검색/상세 API를 조회한다.
4. 상세 조회도 실패하면 검색 결과를 단일 에피소드 콘텐츠로 저장한다.

## 권장 리팩터링

- `services/tmdb.js`, `services/tvmaze.js`, `storage/repository.js`, `ui/`로 분리
- 화면·저장소·공급자 모듈 간의 명시적 의존성 주입
- 콘텐츠·에피소드·댓글 스키마의 버전을 저장
- Vitest + Playwright 기반 단위/E2E 테스트 추가

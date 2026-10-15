# 구조·CSS 검수 기록

## 최신 검수: 2026-10-15

현재 소스 66개(CSS 24개)를 대상으로 정적 구조 검사와 브라우저 검사를 수행했습니다. GitHub 커밋·푸시는 수행하지 않았습니다.

### 현재 구조

| 경로 | 역할 및 검수 결과 |
| --- | --- |
| `index.html` → `src/js/main.js` | 실제 진입 경로, 화살표 초기화 함수, StrictMode, 전역 CSS 연결 확인 |
| `src/App.jsx` | 홈·메뉴·로그인 경로 및 전역 상세 창 관리. 불필요한 메뉴 데이터 전달 제거 |
| `src/pages/Home` | Hero → Menu → Gift → Picks → Event → Story → Store 구성 |
| `src/components/Home` | 섹션별 JSX·CSS. 메뉴는 중앙 카탈로그에서 직접 조회 |
| `src/components/common` | 헤더·푸터·버튼·상세 창·공통 카드 스타일 |
| `src/data/menuCatalog.js` | con1 6개 탭과 Gift의 공식 상품 분류를 연결하는 기준 |
| `src/data/official*.js` | Cake 77종, Roll Cake 7종, Gift Set 22종의 저장된 공식 제품 정보 |
| `src/styles` | 폰트 정의와 디자인 토큰, `src/index.css`에서 전역 연결 |
| `src/page`, 이전 Header·Footer·Button 경로 | 구현 복제가 아닌 호환용 재수출. 기존 미리보기/import 호환을 위해 유지 |
| `scripts` | 구조·화면·새로고침·상품 검증과 공식 목록 가져오기. 원본 HTML은 수집 시점의 작업 자료 |

### 정리한 항목

- Gift 설명의 모바일/태블릿 동일 선언을 `max-width: 1439px` 하나로 통합하고, Roll/Set의 동일 좌표 선언을 묶었습니다.
- Menu의 두 데스크톱 미디어쿼리를 하나로 모았습니다. Cake의 높은 선택자 우선순위와 기존 간격은 유지했습니다.
- Gift 탭 배경색과 상품 목록 콘텐츠 폭을 기존 디자인 토큰으로 연결했습니다.
- Footer의 한 줄 CSS를 선언별 두 칸 들여쓰기로 정리했습니다.
- Cake·Roll Cake·Gift Set이 공유하는 목록 스타일을 `detail-dialog__products`로 명명하고 검증 스크립트도 맞췄습니다.
- Menu의 사용하지 않는 products/picks props와 fallback 카탈로그 생성을 제거했습니다. App/Home의 불필요한 조회·전달도 제거했습니다.
- DetailDialog의 개별 메뉴 파일 6개 직접 import를 중앙 카탈로그 참조로 통합했습니다.
- 새로고침 검사의 오래된 `src/main.jsx` 경로를 `src/js/main.js`로 수정했습니다.
- 화면 검사의 개발 서버 URL을 `VERIFY_BASE_URL`로 지정할 수 있게 하고, 모달 종료를 기다린 뒤 다음 동작을 검사하도록 수정했습니다. 추천 스크롤 검사 대상도 실제 스크롤 요소인 `.picks__viewport`로 수정했습니다.
- `npm run verify:structure`와 JSON 검수 결과 저장 기능을 추가했습니다.

### 검증 결과

| 검사 | 결과 |
| --- | --- |
| 소스 import 80건·로컬 이미지/폰트 참조 238건 | 누락 0건 |
| 동일 조건의 반복 선택자·규칙 내 중복 속성·3개 이상 선언이 동일한 블록 | 모두 0건 |
| `/`, `/menu`, `/menu/products`, `/login` × 320~1920px 9개 폭 | 36개 화면 가로 넘침·깨진 이미지·실행 예외 없음 |
| 정리 전후 섹션 폭/높이·주요 글꼴/색상/텍스트 크기 비교 | 36개 화면 모두 동일 |
| 메뉴 키보드 전환·상품 창·Escape·검색·선물/이벤트 창·추천 스크롤·테스트 로그인 | 통과 |
| 카드/버튼 미리보기 6개 | 렌더링·이미지 정상 |
| 일반 모션 | Hero 자동 전환·캐릭터·Gift 잎 모션 정상 |
| 5개 URL 직접 접근 및 각 3회 새로고침 | 통과 |
| 공식 상품 모음 | 77/7/22개, 이미지 모두 로딩, 데스크톱 4열, 모바일 가로 넘침 없음, 상품 선택 정상 |
| `npm run build` | 통과 |

결과 파일: `artifacts/structure-audit.json`, `artifacts/css-audit-before.json`, `artifacts/css-audit-after.json`. 반응형 재정의, 서로 다른 컴포넌트의 유사한 선언은 단순 중복으로 보지 않고 유지했습니다. 상품 정보는 저장된 목록이며 실시간 동기화가 아니고, 로그인은 기존 테스트 기능입니다.

---

## 이전 검수 기록

검수일: 2026-10-06. 대상은 현재 React + Vite 프로젝트의 전체 `src`, 컴포넌트 미리보기, 로컬 이미지·폰트 경로와 개발 서버 설정입니다. 기존 작업 내용을 기반으로 정리했으며 커밋이나 배포는 하지 않았습니다.

## 구조

| 경로 | 역할 | 확인·정리 결과 |
| --- | --- | --- |
| `src/main.jsx` | StrictMode, 앱 진입, 전역 스타일 | 진입점 유지 |
| `src/App.jsx` | 경로 선택, 헤더·푸터·상세 창 조합 | 홈·메뉴·로그인 분기와 모달 상태 확인 |
| `src/pages/Home` | 홈 섹션 조합 | Hero → Menu → Gift → Picks → Event → Story → Store 순서 유지 |
| `src/pages/Login` | 테스트 로그인 | 테스트 로그인과 화면 전환 확인 |
| `src/components/Home` | 홈 섹션 | 섹션별 CSS 소유권 유지 |
| `src/components/common` | 헤더·푸터·버튼·상세 창 | 공통 구현을 단일 원본으로 사용 |
| `src/components/Card`, `MenuCard` | 상품 카드 | 동일한 제목·설명·버튼 스타일을 `common/CardContent.css`로 통합 |
| `src/components/Header`, `Footer`, `Button` | 이전 import 경로 | 공통 구현의 재수출로 통일. 빈 Footer와 중복 Header 구현 정리 |
| `src/page` | 이전 import 경로 | 빈 섹션 파일을 현재 섹션의 재수출로 연결. Main은 Home 재수출 |
| `src/styles` | 폰트·토큰 | 같은 폰트 파일의 별칭과 컴포넌트 내부 폰트 정의 통합 |
| `src/data`, `src/services` | 상품·이미지 데이터 | import 및 로컬 리소스 경로 확인 |
| `scripts` | 검증 | 경로별 새로고침 검사 수정, 전체 CSS·화면 검사 추가 |

## 발견 사항과 조치

| 항목 | 기존 문제 | 조치 |
| --- | --- | --- |
| 푸터 중복 | 동일한 마지막 문단 규칙과 데스크톱 위치 규칙 반복 | 중복 제거, 공통 문단 속성 통합, 미디어쿼리 묶음 정리 |
| 고정 폭 | 푸터 전체와 데스크톱 Store에 `1920px`, Store 내부에 `1600px` 고정 폭 | 화면 폭과 `.inner` 토큰을 사용하도록 변경 |
| 푸터 반응형 | 1024px부터 시안의 고정 좌표 사용, 연락처 위치·법적 링크 줄바꿈 제한 | 좁은 화면은 유연한 배치와 줄바꿈, 1920px 이상은 기존 시안 좌표 적용 |
| Gift 카드 | 같은 선택자에서 `overflow: visible`을 나중에 `hidden`으로 덮어씀 | 최종 유효 값을 한 규칙으로 통합 |
| Gift 장식 | 사용하지 않는 `.gift__illustration` 규칙 | 현재 JSX에 사용되지 않는 규칙 제거 |
| Gift 이미지 래퍼 | Cake/Roll/Set 래퍼의 동일 위치·크기 반복 | 공통 선언으로 묶고 Cake의 위치 차이만 유지 |
| Store 글자 | 개별 글자의 회전·폰트·색상 재선언 | JSX의 기존 글자별 CSS 변수 사용. 회전과 크기 유지 |
| 카드 스타일 | Card/MenuCard의 제목·설명·버튼 선언 반복 | 공통 CSS로 이동, 패딩·테두리·모서리 등 차이는 각 카드 CSS에 유지 |
| 포커스·모션 | 전역과 개별 버튼의 동일 포커스 선언, reduced-motion 선언 반복 | 전역 규칙 사용. 헤더 현재 페이지 스타일은 Header CSS로 이동 |
| 폰트 | Pretendard/MaruBuri의 별칭, EventCard 별도 폰트 정의 | 공통 폰트 정의로 통합. 실제 로컬 폰트 파일 유지 |
| 작은 화면 텍스트 | Hero·Gift·Store의 큰 글자, Gift 설명 잘림 | 작은 화면 제목 크기와 설명 줄바꿈 보완 |
| 추천 탐색 | JS의 smooth 스크롤이 reduced-motion 설정을 무시 | 사용자 모션 설정에 따라 자동/부드러운 스크롤 선택 |
| 새로고침 검사 | 메뉴 화면에도 Store 섹션이 나타나길 기다림 | 실제 공통 구조인 main/header 검사, 메뉴·로그인 경로 추가 |
| 개발 서버 | artifacts의 브라우저 잠긴 파일을 감시하다 서버 종료 | artifacts를 Vite 감시 대상에서 제외 |

전체 CSS를 두 칸 들여쓰기와 선언별 줄바꿈으로 정렬했습니다. 선택자 순서·우선순위와 반응형에서 필요한 재정의는 유지했습니다. 시안 좌표나 이미지 크롭 수치는 임의로 합치지 않았습니다.

## 검증 결과

- 소스: CSS 24개, JSX 30개, JS 2개 확인.
- 상대 import 누락, 사용된 CSS 토큰 누락, 문자열로 지정된 로컬 이미지·폰트 파일 누락 없음.
- 동일 컨테이너의 완전히 동일한 CSS 규칙과 동일 규칙 내부의 중복 선언 없음. 화면별로 필요한 override는 중복 오류로 취급하지 않음.
- 빈 구현 파일 없음. `.gitkeep`는 빈 디렉터리 유지용 파일로 정상.
- `/`, `/menu`, `/menu/products`, `/login`을 각각 320·375·390·768·960·1024·1280·1440·1920px에서 확인: 총 36개 조건, 실제 콘텐츠 뷰포트 기준 가로 넘침 없음.
- 위 화면의 이미지 로딩 실패와 검사 중 브라우저 실행 예외 없음.
- 메뉴 키보드 탭 이동, 상품 상세, Escape 닫기, 검색 창, 선물·이벤트 상세, 추천 스크롤, 테스트 로그인 확인.
- Button/Card/MenuCard/PickCard/GiftCard/EventCard 미리보기 6개 렌더링과 이미지 로딩 확인.
- 홈·해시·메뉴 두 경로·로그인: 각각 캐시 없이 3회 새로고침 통과.
- 390px/1920px 전체 화면 및 Hero/Gift/Store/Footer 스크린샷 생성. 1920px 화면의 섹션 순서·세로 위치·높이는 정리 전과 동일하며, Store/푸터 폭은 실제 콘텐츠 폭에 맞게 수정됨.
- 주요 문구의 실제 글자 크기·색·높이는 폰트 이름 통합 후에도 유지됨. 세로 스크롤바가 있는 1920px 화면에서 Store/푸터 중심은 고정 1920px 캔버스 대신 콘텐츠 뷰포트 중심을 따름.
- 프로덕션 빌드 통과. CSS 출력은 기존 약 30.48kB에서 약 27.27kB로 약 10.5% 감소.

재검증: 개발 서버와 Chrome 디버깅 포트 9333을 실행한 뒤 `npm run verify:css`, `npm run verify:refresh`, `npm run build`.

상세 결과와 스크린샷은 `artifacts/css-audit-after.json`, `artifacts/structure-audit.json`, `artifacts/css-audit-after-*.png`에 있습니다. artifacts는 Git 추적 대상에서 제외됩니다.

## 구현 범위와 남은 제약

- 이 검수는 현재 코드와 실제 렌더링에 대한 구조·CSS 검사입니다. 전체 화면을 새 Figma 컨텍스트와 대조하는 디자인 검수는 포함하지 않습니다.
- 라우팅은 `window.location.pathname` 분기 방식입니다. `/menu`, `/menu/products`, `/login` 외 경로는 홈을 표시합니다.
- 로그인은 테스트 상태만 변경하며 실제 회원 인증·서버 세션은 없습니다.
- 개인정보처리방침·이용약관 링크는 각각의 상세 정책 페이지가 아닌 공식 홈페이지로 연결됩니다.
- 공통 CSS 토큰에 없는 이미지 크롭 수치와 시안 전용 좌표는 의도적인 개별 값으로 유지했습니다.
- ESLint 및 전용 테스트 프레임워크는 현재 구성에 없습니다. 구조 검사·브라우저 검사·프로덕션 빌드로 확인했습니다.
- 이전 경로를 위한 재수출 파일은 호환성을 위해 유지합니다. 실제 화면 조합은 `pages`와 `components/Home`, 공통 UI는 `components/common`이 담당합니다.

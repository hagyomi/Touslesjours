# TOUS les JOURS Renewal 디자인 토큰 가이드

현재 구현된 CSS·JSX를 기준으로 색상, 서체, 레이아웃과 컴포넌트 스타일을 정리한 문서입니다. 코드의 기준 파일은 하위 프로젝트의 `src/styles/variables.css`, `src/styles/fonts.css`, `src/index.css`입니다. 피그마 이동 링크는 포함하지 않습니다.

이 문서는 실제 선언된 CSS 변수와 컴포넌트에 직접 작성된 값을 구분합니다. 아래의 크기·간격·모션 값을 모두 전역 토큰으로 제공하는 것은 아닙니다.

## 1. 디자인 방향과 적용 범위

- 크림·브라운·그린 중심의 베이커리 브랜드 표현.
- 아치형 상품 이미지와 둥근 카드·버튼.
- 영문 제목은 Playfair Display, 한글 제목은 MaruBuri, 본문은 Pretendard Variable.
- 상품 탐색, 브랜드 이야기, 제빵 영상과 스크롤 모션을 연결한 홈 구성.
- 일반 CSS와 BEM 방식 클래스, 페이지·컴포넌트 옆에 배치한 CSS 사용.

현재 화면은 홈, 메뉴(`/menu`, `/menu/products`), 테스트 로그인(`/login`), 매장찾기(`/store`)입니다. 헤더는 Menu·Store·Search·Login으로 구성하며 Membership은 제거했습니다. Search는 별도 페이지가 아니라 모달입니다.

회원가입·마이페이지·게시판·고객문의 상태 UI는 현재 없으므로 관련 디자인 토큰을 정의하지 않습니다.

## 2. 스타일 파일과 책임

아래 경로는 하위 npm 프로젝트 기준입니다.

| 파일·폴더 | 역할 |
| --- | --- |
| `src/styles/variables.css` | 실제 전역 CSS 변수 |
| `src/styles/fonts.css` | 로컬 폰트의 @font-face |
| `src/index.css` | 초기 스타일, 본문, 공통 컨테이너, 포커스, 본문 바로가기, 동작 줄이기 |
| `src/App.css` | 메뉴 전용 페이지의 소개 영역 |
| `src/components/common/` | Header·Footer·Button·DetailDialog·ScrollToTop 및 공통 카드 내용 |
| `src/components/Home/` | Menu·Gift·Picks·Event·Story·Store 섹션 |
| `src/components/Hero.css` | Hero 레이아웃·사진 전환 |
| `src/components/*Card.css` | 카드별 형태와 배치 |
| `src/pages/Home/`, `Login/`, `StoreFinder/` | 페이지 전용 스타일 |

전역 CSS는 `src/js/main.js`가 불러오는 `src/index.css`를 통해 연결됩니다. 별도 `reset.css`나 `global.css`는 없습니다. `src/page/`는 정리 과정에서 제거되었습니다.

## 3. 실제 컬러 토큰

### 브랜드·텍스트

| CSS 변수 | 실제 값 | 적용 역할 |
| --- | --- | --- |
| `--color-brand-green` | `#0b5a38` | 브랜드 강조, 활성 메뉴·탭, 로그인 기본 버튼, TOP 버튼 |
| `--color-brown` | `#403630` | 이벤트 카드 문자 |
| `--color-header-text` | `#321200` | 본문 기본·헤더·제목, Story 어두운 배경 |
| `--color-hero-description` | `#695147` | 보조 설명, 공통 버튼 문자 |
| `--color-menu-description` | `#6a5248` | Card·MenuCard 설명 |
| `--color-story-accent` | `#7c8161` | Story의 Meets 강조 |
| `--color-text-inverse` | `#fffcf2` | 어두운 배경의 문자, TOP 문자 |
| `--color-focus` | `#2563eb` | 키보드 포커스 |

### 배경·경계

| CSS 변수 | 실제 값 | 적용 역할 |
| --- | --- | --- |
| `--color-white` | `#ffffff` | 기본 배경, 카드·입력 표면 |
| `--color-hero-background` | `#fffbf0` | Hero 바탕, 로그인 배경·hover |
| `--color-menu-surface` | `#fff5f2` | 메뉴 섹션 |
| `--color-picks-surface` | `#fff5f1` | 추천 영역, Gift 메뉴 상태 |
| `--color-gift-surface` | `#e7e7d8` | 선물 카드, 버튼 hover, 매장 상세 패널 |
| `--color-story-surface` | `#f9f6ef` | Story·모달·매장찾기 배경, TOP hover |
| `--color-divider` | `#eeeae1` | 이벤트 구분선, 입력·패널 경계 |
| `--color-menu-button-border` | `rgba(174, 178, 102, 0.5)` | 공통 버튼·메뉴 카드 경계 |
| `--color-card-button-border` | `rgba(176, 180, 117, 0.5)` | 일반 카드 버튼 경계 |

로그인 오류의 `#a52b23`, 기본 로그인 버튼 hover의 `#08462b`는 `Login.css`에 직접 선언되어 있습니다. 전역 error·success·warning 팔레트는 현재 없습니다. 색상 토큰의 존재만으로 접근성 대비 검증을 완료했다고 보지 않습니다.

## 4. 서체와 실제 폰트 로딩

| CSS 변수·서체 | 실제 선언·파일 | 사용 |
| --- | --- | --- |
| `--font-family-base` | `'Pretendard Variable', sans-serif` | 본문·입력·버튼 |
| `--font-family-display-en` | `'Playfair Display', serif` | 영문 제목·이탤릭 |
| `--font-family-display-ko` | `'MaruBuri', serif` | 한글 제목·브랜드 설명 |
| IBM Plex Sans | 컴포넌트에 직접 선언 | 선물 카드 부제 |

| 폰트 파일 (`public/fonts/`) | 등록 weight·style |
| --- | --- |
| `PretendardVariable.woff2` | 100~900, normal |
| `PlayfairDisplay-Medium.woff2` | 500, normal |
| `PlayfairDisplay-Italic.ttf` | 400~900, italic |
| `MaruBuri-Light.woff2` | 300, normal |
| `MaruBuri-SemiBold.woff2` | 600, normal |
| `IBMPlexSans-Variable.ttf` | 100~700, normal |

모든 @font-face에 `font-display: swap`을 사용합니다. MaruBuri는 Light와 SemiBold가 모두 연결되어 있습니다. 등록된 weight 범위와 컴포넌트가 요청하는 굵기는 구분하며, 모든 숫자 굵기의 별도 원본 파일이 있는 것은 아닙니다.

### 대표 타이포그래피

아래는 전역 font-size 토큰이 아니라 실제 컴포넌트 값입니다.

| 요소 | 크기·굵기·행간 |
| --- | --- |
| 본문 | Pretendard Variable, 기본 행간 1.4 |
| 헤더 메뉴 | 18px / 300 / 1 |
| Hero 제목 | 70px / 500 / 1.1; 599px 이하에서 clamp(42px, 10vw, 60px) |
| Gift 제목 | 70px / 600 / 120%; 작은 화면에서는 clamp 적용 |
| Card·MenuCard 제목 | 20px / 600 / 1.4 |
| Card·MenuCard 설명 | 14px / 300 / normal |
| 매장찾기 제목 | 44px / 600 / 1.3; 767px 이하 34px |
| 매장찾기 매장명 | 20px / 600 |

## 5. 레이아웃·간격

실제 레이아웃 토큰은 다음 두 가지입니다.

| 변수 | 값 | 적용 |
| --- | --- | --- |
| `--layout-max-width` | `1600px` | 공통 .inner 최대 너비 |
| `--header-height` | `87px` | 960px 이상 헤더 높이 |

공통 컨테이너는 다음과 같습니다.

```css
.inner {
  width: min(var(--layout-max-width), calc(100% - 40px));
  margin-inline: auto;
}
```

화면 양옆에 기본 20px 여유를 두며 최대 1600px로 제한합니다. 본문은 기본 margin을 제거하고 모든 요소에 `box-sizing: border-box`를 적용합니다.

전역 spacing scale, radius scale, z-index scale은 없습니다. 다음 값은 각 컴포넌트 CSS가 관리합니다.

| 영역 | 실제 배치·간격 |
| --- | --- |
| 헤더 메뉴 | 기본 gap 8px 20px, 960px 이상 40px |
| 메뉴 그리드 | 기본 1열·gap 40px, 768px 이상 2열·gap 48px, 1200px 이상 4열 |
| Gift 그리드 | 기본 gap 32px, 1024px 이상 3열·gap 40px |
| 매장 검색 폼 | gap 16px, padding 28px; 모바일 padding 20px |
| 매장 목록·상세 | 1.2fr : 1fr, gap 32px; 767px 이하 1열·gap 20px |

디자인 좌표를 유지하는 이미지 crop, 아치형 문자, 장식의 비율·위치는 일반 간격 토큰으로 치환하지 않습니다.

## 6. 공통 컴포넌트 기준

### Button

`components/common/Button`은 href가 있으면 `<a>`, 없으면 `<button>`을 출력합니다.

- padding `10px 37px`, radius `50px`, border `1px`.
- 글자 `400 20px/1.2`, 자간 `0.6px`.
- 기본 배경 transparent, 보조 설명색 문자, 메뉴 버튼 경계색.
- hover는 선물 표면색, disabled는 opacity 0.5·기본 커서.
- 이벤트 `VIEW MORE`는 href와 클릭 동작 없이 hover만 유지합니다.
- Store의 매장찾기와 헤더 Store는 내부 `/store`로 연결합니다.

### Card·MenuCard

`common/CardContent.css`는 제목·설명·버튼의 공통 타이포그래피를 관리합니다. 카드별 크기·배경·테두리·모서리는 각 CSS에 둡니다.

- MenuCard 기준 너비 `337px`, 이미지 비율 `337 / 397`, 상단 radius `206px`.
- 메뉴 카드 본문은 `156px`, 하단 radius `30px`.
- 일반 Card 기준 너비 `372px`, 하단 radius `34px`, 흰색 배경.
- GiftCard는 기본 너비 `466px`, radius `22.562px`; 홈 Gift에서는 별도 크기·radius를 재정의합니다.
- 메뉴 이미지 hover·focus 확대는 GSAP으로 처리합니다.

### 입력과 매장 선택

- 로그인 입력·버튼: min-height `50px`, padding `12px 16px`, radius `8px`.
- 매장 검색 입력·선택: min-height `48px`, padding `12px`, radius `8px`.
- 매장 결과 카드: radius `16px`, 흰색 바탕, 구분선색 테두리.
- 매장 hover·선택 상태는 브랜드 그린 테두리.
- 매장 상세 패널: radius `24px`, 선물 표면색, 데스크톱 sticky top `24px`.

### DetailDialog

- 네이티브 `<dialog>`의 top layer를 사용합니다.
- 일반 너비 `min(640px, calc(100% - 32px))`, max-height `85vh`, radius `24px`.
- 확대 모드는 전체 화면 또는 카드 패널 형태로 별도 처리합니다.
- 기본 배경은 Story 표면색, 일반 backdrop은 `rgb(50 18 0 / .5)`.
- 확대 backdrop의 `--detail-backdrop-opacity`는 GSAP에서 주입하고 CSS 기본값도 제공합니다.
- 내부 레이어의 z-index 0·1·2는 모달 내부 순서이며 전역 z-index 토큰이 아닙니다.

### TOP·포커스

- TOP은 원형 `60px`, 599px 이하 `52px`; 오른쪽·아래 기본 24px, 모바일 16px과 safe-area를 고려합니다.
- TOP 배경은 브랜드 그린, 문자는 반전색. hover 시 Story 표면색으로 전환합니다.
- TOP의 z-index는 20, 본문 바로가기는 500입니다.
- 공통 focus-visible은 focus색 `2px` 외곽선·offset `4px`; TOP은 `3px` 외곽선입니다.

## 7. 그림자

| 토큰·직접 선언 | 실제 값·역할 |
| --- | --- |
| `--shadow-pick-card` | `10px 10px 20px 0 rgba(161, 161, 161, 0.25)`; 일반 카드·선물 hover |
| MenuCard 직접 선언 | `drop-shadow(10px 10px 10px rgba(161, 161, 161, 0.25))` |
| Store 사진 직접 선언 | `10px 10px 20px rgb(0 0 0 / .5)` |
| TOP 직접 선언 | `0 4px 16px rgb(50 18 0 / 15%)` |

## 8. 반응형 기준

브레이크포인트는 CSS 미디어 쿼리에 직접 작성되어 있으며 변수 토큰으로 제공하지 않습니다. 모든 페이지를 동일한 세 단계로 구분하지 않습니다.

| 조건 | 대표 적용 |
| --- | --- |
| 480px 이하 | 로그인 카드·페이지 여백 |
| 599px 이하 | Hero·Gift·Store 글자 크기, Event 일부 배치, TOP 크기 |
| 767px 이하 | 매장찾기 폼·목록·상세 1열 |
| 768px 이상 | 메뉴 2열, Footer 배치 |
| 960px 이상 | 헤더 가로 배치, Hero 2열 |
| 1024px 이상 | Gift·Event·Story·Store 데스크톱 배치, 일반 모션 Picks 고정 |
| 1200px 이상 | 메뉴 4열, Footer 배치 |
| 1440px 이상 | Story 대형 화면 배치 |
| 1920px 이상 | Footer 대형 화면 보정 |

Gift의 600~1439px·1439px 이하, DetailDialog의 700px 이하 조건 등도 별도로 존재합니다. 실제 수정 전 해당 파일의 조건·우선순위를 확인합니다.

## 9. 모션과 접근성

전역 duration·easing 토큰은 없으며 GSAP·CSS에 직접 지정합니다.

| 효과 | 실제 대표 값 |
| --- | --- |
| 메뉴 이미지 확대 | 0.35초, power2.out |
| 카테고리 등장 | 0.4초, power2.out |
| Hero 제목 등장 | 2초, power2.out |
| Hero 사진 전환 | CSS opacity 900ms ease-in-out |
| 카드 패널·전체 확대 | 0.7초·0.9초, power2.inOut |
| Story 레터링 | 1.2초, power2.inOut |
| Story 곡선 | 2.5초, power1.inOut |
| Gift 나뭇잎 | 개별 duration과 sine.inOut 반복 |

ScrollTrigger의 scrub 값은 재생 시간과 구분합니다. Hero 0.8, Picks 1, Story 캐릭터 1.8을 사용합니다.

전역 reduced-motion CSS는 스크롤·CSS animation·transition을 줄이고 여러 GSAP 효과도 matchMedia로 분기합니다. 카드 확대는 짧은 전환을 사용하고 TOP은 즉시 이동합니다. 모든 GSAP 효과·사진 자동 전환·제빵 영상이 완전히 정지하는 것은 아닙니다.

메뉴 탭은 키보드 방향키와 ARIA 상태, 모달은 Escape 닫기·포커스 복귀, 검색은 결과 안내를 제공합니다. 토큰 문서만으로 접근성 인증을 주장하지 않습니다.

## 10. 토큰·CSS 변경 규칙

1. 전역 의미가 같은 값은 기존 변수를 재사용합니다. 실제 필요가 없는 토큰 이름을 문서에 먼저 만들지 않습니다.
2. 컴포넌트 고유 값은 해당 CSS에 두고, 반복되는 값은 사용 맥락을 확인한 뒤 묶습니다.
3. 반응형·hover·focus·선택 상태 재정의를 단순 중복으로 제거하지 않습니다.
4. `CardContent.css` 등 기존 공통 영역을 우선 활용합니다. 무관한 컴포넌트에 같은 속성이 있다는 이유만으로 전역 규칙으로 합치지 않습니다.
5. `--letter-x` 등 Store 글자 배치 변수는 JSX에서, 모달 배경 변수는 GSAP에서 주입하므로 정적 CSS 선언만 보고 삭제하지 않습니다.
6. 이미지·폰트·동적 장식 참조와 폰트 라이선스 파일을 함께 확인합니다.
7. 변경 전후 구조 검사와 필요한 페이지 검증을 실행하고 검증한 범위를 기록합니다.

### 검증 명령

하위 프로젝트에서 실행합니다.

```sh
npm run verify:structure
npm run verify:layout
```

브라우저 검사는 개발 서버와 Chrome 원격 디버깅 환경이 필요합니다. CSS 변경 전 `node scripts/verify-layout.mjs before`, 변경 후 `node scripts/verify-layout.mjs after`로 주요 computed style을 비교할 수 있습니다. 기준 파일은 같은 검증 스크립트로 생성해야 합니다.

최근 레이아웃 검수는 5개 경로 × 8개 너비의 40개 조건을 동작 줄이기 환경에서 확인하고, 일반 모션의 Picks를 별도로 검사했습니다. 모든 스타일·애니메이션 프레임의 전체 조합을 검증한 것은 아닙니다. 상세 조건과 실행 방법은 아래 문서를 참고합니다.

## 관련 문서

- [프로젝트 소개·실행 안내](./README.md)
- [현재 개발 가이드](./PROJECT_BUILD_GUIDE.md)

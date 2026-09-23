# TOUS les JOURS Renewal 디자인 토큰 가이드

## 1. 문서 목적

이 문서는 TOUS les JOURS Renewal React 팀 프로젝트에서 사용하는 디자인 토큰과 적용 기준을 정의한다.

디자이너와 개발자가 동일한 색상, 글자 크기, 간격, 레이아웃, 모션 기준을 사용하도록 하고 페이지마다 임의의 값을 추가하는 문제를 방지한다.

### 참조 및 적용 범위

- [Figma 디자인 · 수정 프레임 509:4356](https://www.figma.com/design/VgDn8TpEInUTj3PxseLwwY/?node-id=509-4356)
- 확인일: 2026-09-23. 연결된 시안은 TOUS les JOURS(뚜레쥬르)이며 이 문서의 기존 ZARA 디자인 기준을 교체한다.
- Figma에서 확인한 값과 모바일·공통 UI 구현 제안값을 구분한다. 별도 모바일 프레임은 확인하지 않았다.
- 현재 작업 폴더에는 가이드 문서만 있다. 아래 CSS는 구현용 예시이며 실제 앱 적용·폰트 로딩 검증은 아직 수행하지 않았다.
- 색상·서체는 시안을 반영한다. 별도 근거를 명시하지 않은 상태 색상, 간격, 모션, 브레이크포인트는 기존 프로젝트 기준을 유지한다.

### 프로젝트 기본 기준

- React + Vite + JavaScript
- Pretendard Variable(본문), MaruBuri(한글 제목), Playfair Display(영문 제목), IBM Plex Sans(영문 라벨)
- CSS + BEM
- Mobile First
- 크림·브라운·그린 중심의 베이커리 브랜드 디자인
- 컴포넌트와 페이지 CSS는 해당 JSX 파일과 같은 폴더에 배치
- 공통 디자인 토큰은 `src/styles/variables.css`에서 관리

### 헤더 메뉴 정보구조

| 헤더 메뉴 | 페이지명 | pages 폴더 | components 폴더 |
|---|---|---|---|
| Menu | 메뉴 | `pages/Menu` | `components/Menu` |
| Store | 매장찾기 | `pages/Store` | `components/Store` |
| Search | 통합검색 | `pages/Search` | `components/Search` |
| Login | 로그인 | `pages/Login` | 동일 이름 폴더 생성 대상에서 제외 |
| Membership | 멤버십 | `pages/Membership` | `components/Membership` |

### 메인 페이지 섹션 구성

| # | 섹션 | 컴포넌트(예상) |
|---|---|---|
| 1 | Header | `Header` (글로벌) |
| 2 | Hero | `HeroSection` |
| 3 | Quick Category | `QuickCategorySection` |
| 4 | Recommended Menu | `RecommendedMenuSection` |
| 5 | Event | `EventSection` |
| 6 | Bakery Story | `BakeryStorySection` |
| 7 | Store / Service | `StoreServiceSection` |
| 8 | Footer | `Footer` (글로벌) |

`Header`와 `Footer`는 `components/common`에서 관리하는 글로벌 컴포넌트로 사용한다. 나머지 섹션은 `components/Home`에서 관리하고 `pages/Home/Home.jsx`에서 순서대로 조합한다.

### 페이지·컴포넌트 폴더 명명 규칙

- `src/pages`와 `src/components` 아래의 페이지별 폴더 이름은 대소문자까지 동일하게 작성한다. 예: `pages/Menu` ↔ `components/Menu`.
- 공통, 로그인, 회원가입은 이 일대일 폴더 생성 규칙에서 제외한다.
- 공통 컴포넌트는 `components/common`에서 관리하고, 대응하는 `pages/common` 폴더는 만들지 않는다.
- 로그인·회원가입은 페이지 폴더에서 관리하며, 대응하는 `components/Login`, `components/SignUp` 폴더는 만들지 않는다. 두 화면이 공유하는 인증 UI가 필요하면 `components/auth`에서 관리한다.
- 이후 추가되는 페이지도 위 예외를 제외하고 동일한 폴더 이름을 사용한다.
- 페이지 JSX·CSS는 `pages`의 해당 폴더에, 페이지 전용 컴포넌트 JSX·CSS는 `components`의 같은 이름 폴더에 배치한다.

### 프로젝트 폴더 구조

메인 페이지 폴더 이름은 `Home`으로 통일한다. 아래는 구현 시 사용할 구조이며, 아직 정하지 않은 하위 페이지 컴포넌트 이름은 추후 해당 폴더 안에 추가한다.

```text
public/
├── fonts/                       # 웹폰트 파일
└── images/
    ├── common/                  # 로고·공통 이미지
    ├── Home/
    ├── Menu/
    ├── Store/
    └── Membership/

src/
├── main.jsx                     # 앱 진입점·공통 CSS import
├── App.jsx                      # 공통 레이아웃·라우트 연결
├── pages/
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── Home.css
│   ├── Menu/
│   │   ├── Menu.jsx
│   │   └── Menu.css
│   ├── Store/
│   │   ├── Store.jsx
│   │   └── Store.css
│   ├── Search/
│   │   ├── Search.jsx
│   │   └── Search.css
│   ├── Membership/
│   │   ├── Membership.jsx
│   │   └── Membership.css
│   ├── Login/
│   │   ├── Login.jsx
│   │   └── Login.css
│   └── SignUp/
│       ├── SignUp.jsx
│       └── SignUp.css
├── components/
│   ├── common/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── auth/                    # 로그인·회원가입 공유 UI가 필요할 때 생성
│   ├── Home/
│   │   ├── HeroSection.jsx
│   │   ├── HeroSection.css
│   │   ├── QuickCategorySection.jsx
│   │   ├── QuickCategorySection.css
│   │   ├── RecommendedMenuSection.jsx
│   │   ├── RecommendedMenuSection.css
│   │   ├── EventSection.jsx
│   │   ├── EventSection.css
│   │   ├── BakeryStorySection.jsx
│   │   ├── BakeryStorySection.css
│   │   ├── StoreServiceSection.jsx
│   │   └── StoreServiceSection.css
│   ├── Menu/                    # 메뉴 페이지 전용 컴포넌트
│   ├── Store/                   # 매장찾기 페이지 전용 컴포넌트
│   ├── Search/                  # 통합검색 페이지 전용 컴포넌트
│   └── Membership/              # 멤버십 페이지 전용 컴포넌트
└── styles/
    ├── reset.css                # Meyer Reset v2.0
    ├── fonts.css                # @font-face 선언
    ├── variables.css            # 디자인 토큰·반응형 토큰
    └── global.css               # 본문 행간 1.4·전역 기본 스타일
```

- `Home`, `Menu`, `Store`, `Search`, `Membership`은 `pages`와 `components`에서 같은 폴더 이름을 사용한다.
- `Login`, `SignUp`은 `pages`에만 대응 폴더를 두며, 각 화면에서만 쓰는 폼은 해당 페이지 폴더에서 관리한다.
- `Header`와 `Footer`는 `App.jsx`의 공통 레이아웃에서 조합한다. `Home.jsx` 등 개별 페이지에 중복 배치하지 않는다.
- 컴포넌트는 자기 이름과 같은 CSS 파일을 직접 import한다. 예: `HeroSection.jsx` → `./HeroSection.css`.
- `public/images`의 페이지별 폴더는 해당 페이지 전용 이미지가 필요할 때 생성한다. 검색 결과는 기존 상품 이미지를 재사용한다.

---

## 2. 토큰 관리 원칙

### 토큰 단계

디자인 토큰은 다음 세 단계로 구분한다.

| 단계 | 역할 | 예시 |
|---|---|---|
| Primitive Token | 실제 원시 값 | `--color-gray-900` |
| Semantic Token | 의미와 역할 | `--color-text-primary` |
| Component Token | 특정 컴포넌트 역할 | `--button-primary-bg` |

컴포넌트 CSS에서는 가능하면 Primitive Token을 직접 사용하지 않고 Semantic Token 또는 Component Token을 사용한다.

```css
/* 지양 */
.product-card__name {
  color: #111111;
}

/* 권장 */
.product-card__name {
  color: var(--color-text-primary);
}
```

### 토큰 파일 위치

```text
src/
└── styles/
    ├── reset.css
    ├── variables.css
    ├── fonts.css
    └── global.css
```

- `variables.css`: 모든 디자인 토큰 선언
- `reset.css`: [Meyer Reset v2.0](https://meyerweb.com/eric/tools/css/reset/) 원문 사용
- `fonts.css`: 역할별 서체와 굵기·italic 파일 연결
- `global.css`: body, 공통 컨테이너, 접근성 유틸리티
- 컴포넌트별 실제 스타일: 해당 컴포넌트 폴더의 CSS

---

## 3. 컬러 토큰

## 3-1. Primitive Color

### Neutral

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-white` | `#FFFFFF` | 기본 밝은 배경 |
| `--color-black` | `#000000` | 가장 강한 텍스트·배경 |
| `--color-gray-50` | `#FAFAFA` | 보조 배경 |
| `--color-gray-100` | `#F5F5F5` | 카드·입력 배경 |
| `--color-gray-200` | `#E5E5E5` | 기본 테두리 |
| `--color-gray-300` | `#D4D4D4` | 비활성 테두리 |
| `--color-gray-400` | `#A3A3A3` | placeholder |
| `--color-gray-500` | `#737373` | 보조 텍스트 |
| `--color-gray-600` | `#525252` | 본문 보조 텍스트 |
| `--color-gray-700` | `#404040` | 강조 보조 텍스트 |
| `--color-gray-800` | `#262626` | 어두운 배경 |
| `--color-gray-900` | `#171717` | 기본 텍스트 |
| `--color-gray-950` | `#0A0A0A` | 가장 어두운 배경 |

### Brand · Figma 확인값

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-cream` | `#FFFCF2` | 히어로 배경 |
| `--color-cream-muted` | `#F8F8F2` | 반전 텍스트 |
| `--color-sage-light` | `#EDEEE3` | 브랜드 배경 |
| `--color-beige` | `#E9E5D6` | 보조 배경 |
| `--color-brown` | `#403630` | 주요 텍스트 |
| `--color-brown-secondary` | `#4C433C` | 내비게이션·보조 텍스트 |
| `--color-taupe` | `#807871` | 보조 버튼 텍스트 |
| `--color-sand` | `#D6D1C8` | 테두리 |
| `--color-green` | `#0B5A38` | 브랜드·멤버십 배경 |
| `--color-sage` | `#6D7F71` | 보조 강조 |
| `--color-sage-muted` | `#DEE3D3` | 매장찾기 배경 |

Neutral 팔레트는 흰 배경과 공통 UI 보조 용도로 유지한다. Brand 원시 값은 시안에서 추출했으며 아래 Semantic 연결은 구현 기준이다.

### Status

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-red-50` | `#FEF2F2` | 오류 배경 |
| `--color-red-600` | `#DC2626` | 오류·삭제 |
| `--color-green-50` | `#F0FDF4` | 성공 배경 |
| `--color-green-700` | `#15803D` | 성공 상태 |
| `--color-yellow-50` | `#FEFCE8` | 대기 배경 |
| `--color-yellow-700` | `#A16207` | 대기 상태 |
| `--color-blue-50` | `#EFF6FF` | 정보 배경 |
| `--color-blue-700` | `#1D4ED8` | 정보·확인 중 |

상태 컬러는 고객문의 상태, 폼 오류, 성공 알림 등에만 제한적으로 사용한다. 브랜드 화면은 크림·브라운·그린을 중심으로 구성한다.

## 3-2. Semantic Color

| 토큰 | 연결 값 | 역할 |
|---|---|---|
| `--color-bg-primary` | `--color-white` | 기본 화면 배경 |
| `--color-bg-secondary` | `--color-cream` | 보조 섹션 배경 |
| `--color-bg-inverse` | `--color-green` | 반전 배경 |
| `--color-surface` | `--color-white` | 카드·모달 표면 |
| `--color-surface-muted` | `--color-gray-100` | 비활성·보조 표면 |
| `--color-text-primary` | `--color-brown` | 제목·본문 기본색 |
| `--color-text-secondary` | `--color-brown-secondary` | 설명·메타 정보 |
| `--color-text-muted` | `--color-taupe` | placeholder·비활성 정보 |
| `--color-text-inverse` | `--color-cream-muted` | 어두운 배경의 텍스트 |
| `--color-border-default` | `--color-sand` | 기본 테두리 |
| `--color-border-strong` | `--color-brown` | 선택·강조 테두리 |
| `--color-action-primary` | `--color-green` | 기본 CTA |
| `--color-action-primary-hover` | `--color-brown` | CTA hover |
| `--color-action-disabled` | `--color-gray-300` | 비활성 버튼 |
| `--color-focus` | `#2563EB` | 키보드 포커스 링 |
| `--color-error` | `--color-red-600` | 오류·삭제 |
| `--color-success` | `--color-green-700` | 성공 |
| `--color-warning` | `--color-yellow-700` | 접수·대기 |
| `--color-info` | `--color-blue-700` | 정보·확인 중 |

시안의 옅은 텍스트·경계 색상은 배경 조합에 따라 대비를 확인한다. hover 색상 연결은 구현 제안이며 시안에서 상태 변형을 확인한 값은 아니다.

### 접근성 기준

- 일반 텍스트와 배경의 명도 대비는 최소 4.5:1을 목표로 한다.
- 큰 글자는 최소 3:1을 목표로 한다.
- 포커스 표시와 UI 경계는 주변 색상과 최소 3:1을 목표로 한다.
- 상태는 색상만으로 표현하지 않고 텍스트 또는 아이콘을 함께 제공한다.

---

## 4. 타이포그래피 토큰

## 4-1. 한글·영문 서체

| 토큰 | CSS 값 | 적용 |
|---|---|---|
| `--font-family-base` | `"Pretendard Variable", Pretendard, sans-serif` | 한글·영문 본문, 상품명, 버튼 |
| `--font-family-display-ko` | `"MaruBuri", "Pretendard Variable", serif` | 한글 브랜드 제목 |
| `--font-family-display-en` | `"Playfair Display", "MaruBuri", serif` | 영문 히어로·섹션 제목·내비게이션 |
| `--font-family-label-en` | `"IBM Plex Sans", "Pretendard Variable", sans-serif` | 영문 보조 라벨 |
| `--font-family-decorative` | `Inter, "Pretendard Variable", sans-serif` | 대형 장식 영문 전용 |

Figma의 `MaruBuriOTF`는 웹에서 `MaruBuri`라는 family 이름으로 연결한다. `fonts.css`의 실제 선언 이름과 토큰을 일치시킨다. 영문이라는 이유만으로 모든 텍스트에 Playfair Display를 적용하지 않는다. 영문 본문·버튼도 시안대로 Pretendard를 사용하고, 브랜드 제목과 내비게이션에만 display 서체를 지정한다.

- Pretendard: 본문 Light 300, 일반 UI Regular 400 / Medium 500, 상품명 SemiBold 600.
- MaruBuri: Regular 400 / SemiBold 600. 한글 제목에 사용한다.
- Playfair Display: Medium 500 및 실제 Italic 400 / 500 / 600 파일을 필요한 역할에 연결한다.
- IBM Plex Sans: Regular 400 / Medium 500. Inter: 장식 텍스트 ExtraBold 800.
- `@font-face`에는 실제 파일 경로, 정확한 weight/style, `font-display: swap`을 선언한다. 정적 폰트에 가변 weight 범위를 선언하지 않는다.
- 혼합 문구 “신선한 Bakery 2026”로 한글·영문·숫자의 실제 렌더링 서체와 누락 글리프를 확인한다. 문서만 수정한 상태이므로 폰트 파일 연결은 구현 체크 항목으로 남긴다.

## 4-2. Font Weight

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--font-weight-thin` | 100 | 시안의 장식·보조 문구 전용 |
| `--font-weight-light` | 300 | 본문·설명 |
| `--font-weight-regular` | 400 | 일반 UI |
| `--font-weight-medium` | 500 | 영문 제목·메뉴 |
| `--font-weight-semibold` | 600 | 한글 제목·상품명 |
| `--font-weight-bold` | 700 | 강조 |
| `--font-weight-extrabold` | 800 | 장식 영문 |
| `--font-weight-black` | 900 | 시안의 특정 강조 숫자 |

## 4-3. PC·모바일 Font Size

참조 노드는 1920px PC 시안이다. 모바일 시안은 이 노드에서 확인되지 않았으므로 아래 모바일 값은 구현 제안값이다. 태블릿은 모바일 값을 유지하고, 기존 프로젝트 분기인 1024px부터 PC 값을 적용한다. 1024px 부근 제목 줄바꿈은 구현 시 확인한다.

픽셀 환산은 기본 루트 16px 기준이며 `html { font-size: 100%; }`를 사용한다. 본문 기본은 기존 16px을 유지한다. 시안의 15px·17px 설명문과 25px 히어로 설명은 별도 역할로 구분한다.

| 역할 토큰 | Mobile < 1024px | PC ≥ 1024px | PC 근거 / 처리 |
|---|---:|---:|---|
| `--font-size-caption` | 0.75rem / 12px | 0.75rem / 12px | 시안 10.539~11.5px → 최소 12px으로 보정 |
| `--font-size-body-sm` | 0.875rem / 14px | 0.9375rem / 15px | 브랜드 설명 15px |
| `--font-size-body` | 1rem / 16px | 1rem / 16px | 프로젝트 기본 본문 |
| `--font-size-body-lg` | 1rem / 16px | 1.0625rem / 17px | 브랜드·멤버십 설명 17px |
| `--font-size-product` | 1rem / 16px | 1.125rem / 18px | 상품명 17.916px → 18px |
| `--font-size-button` | 0.875rem / 14px | 1.25rem / 20px | 주요 CTA 20px |
| `--font-size-nav` | 1rem / 16px | 1.25rem / 20px | 영문 내비게이션 20px |
| `--font-size-lead` | 1.125rem / 18px | 1.5625rem / 25px | 히어로 설명 25px |
| `--font-size-title-ko` | 1.75rem / 28px | 2.875rem / 46px | 매장찾기 제목 46px |
| `--font-size-title-en` | 1.75rem / 28px | 2.5rem / 40px | 브랜드 영문 제목 40px |
| `--font-size-hero` | 2.5rem / 40px | 4.6875rem / 75px | 영문 히어로·대형 한글 제목 75px |

시안의 소수점 크기는 공통 UI에서 역할별 정수 크기로 정리한다. 대형 장식 타이포는 컴포넌트에서 별도 관리하며 본문 크기로 재사용하지 않는다. 아래 원시 토큰은 기존 참조 호환용이며 실제 요소에는 위 역할 토큰을 우선 사용한다.

| 원시 토큰 | 값 |
|---|---:|
| `--font-size-100` | 0.75rem |
| `--font-size-200` | 0.875rem |
| `--font-size-300` | 1rem |
| `--font-size-400` | 1.125rem |
| `--font-size-500` | 1.25rem |
| `--font-size-600` | 1.5rem |
| `--font-size-700` | 2rem |
| `--font-size-800` | 2.5rem |
| `--font-size-900` | 3.5rem |
| `--font-size-1000` | 4.5rem |

## 4-4. Line Height

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--line-height-tight` | 1.1 | 대형 히어로 제목 |
| `--line-height-heading` | 1.2 | 일반 제목 |
| `--line-height-body` | 1.4 | 모든 본문·설명문 |

본문 행간은 한글·영문, PC·모바일 모두 단위 없는 `1.4`를 사용한다. 16px 본문은 22.4px, 17px 본문은 23.8px, 25px 설명은 35px 행간이다. 시안의 일부 설명문에 있는 1.2도 요청에 따라 1.4로 변경한다. 기존 `--line-height-relaxed`는 제거하고 본문 토큰으로 통일한다.

## 4-5. Letter Spacing

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--letter-spacing-tight` | -0.05em | PC 대형 제목 75px / -3.75px |
| `--letter-spacing-normal` | 0 | 본문·상품명 |
| `--letter-spacing-wide` | 0.03em | 히어로 CTA 20px / 0.6px |
| `--letter-spacing-wider` | 0.05em | 멤버십 제목 48px / 2.4px |

모바일 한글 제목은 자간 0을 기본으로 하며 영문 히어로에만 tight를 적용한다.

---

## 5. 간격 토큰

4px을 기본 단위로 사용한다.

| 토큰 | 값 | 픽셀 |
|---|---:|---:|
| `--space-0` | `0` | 0px |
| `--space-1` | `0.25rem` | 4px |
| `--space-2` | `0.5rem` | 8px |
| `--space-3` | `0.75rem` | 12px |
| `--space-4` | `1rem` | 16px |
| `--space-5` | `1.25rem` | 20px |
| `--space-6` | `1.5rem` | 24px |
| `--space-8` | `2rem` | 32px |
| `--space-10` | `2.5rem` | 40px |
| `--space-12` | `3rem` | 48px |
| `--space-16` | `4rem` | 64px |
| `--space-20` | `5rem` | 80px |
| `--space-24` | `6rem` | 96px |
| `--space-32` | `8rem` | 128px |

### 간격 적용 기준

- 아이콘과 텍스트: 8px
- 입력 label과 input: 8px
- 폼 필드 사이: 20px 또는 24px
- 카드 내부 여백: 모바일 16px, 데스크톱 24px
- 섹션 사이: 모바일 64px, 태블릿 80px, 데스크톱 96px 이상

---

## 6. 레이아웃 토큰

## 6-1. Container

| 토큰 | 값 | 역할 |
|---|---:|---|
| `--container-sm` | `640px` | 폼·인증 화면 |
| `--container-md` | `960px` | 게시판·고객문의 |
| `--container-lg` | `1200px` | 일반 콘텐츠 |
| `--container-xl` | `1440px` | 컬렉션·메인 화면 |

## 6-2. Page Padding

| 토큰 | 값 |
|---|---:|
| `--page-padding-mobile` | `16px` |
| `--page-padding-tablet` | `24px` |
| `--page-padding-desktop` | `40px` |

## 6-3. Grid Gap

| 토큰 | 값 |
|---|---:|
| `--grid-gap-sm` | `12px` |
| `--grid-gap-md` | `20px` |
| `--grid-gap-lg` | `32px` |

### 상품 그리드

- 모바일: 2열
- 태블릿: 3열
- 데스크톱: 4열

---

## 7. 반응형 기준

Mobile First 방식으로 기본 스타일을 작성한다.

| 구분 | 기준 |
|---|---:|
| Mobile | 기본값, 0px 이상 |
| Tablet | `768px` 이상 |
| Desktop | `1024px` 이상 |
| Wide | `1440px` 이상 |

CSS 변수는 미디어쿼리 안에서 필요한 값만 변경한다.

```css
:root {
  --page-padding: var(--page-padding-mobile);
  --section-space: var(--space-16);
}

@media (min-width: 768px) {
  :root {
    --page-padding: var(--page-padding-tablet);
    --section-space: var(--space-20);
  }
}

@media (min-width: 1024px) {
  :root {
    --font-size-caption: .75rem;
    --font-size-body-sm: .9375rem;
    --font-size-body: 1rem;
    --font-size-body-lg: 1.0625rem;
    --font-size-product: 1.125rem;
    --font-size-button: 1.25rem;
    --font-size-nav: 1.25rem;
    --font-size-lead: 1.5625rem;
    --font-size-title-ko: 2.875rem;
    --font-size-title-en: 2.5rem;
    --font-size-hero: 4.6875rem;
    --page-padding: var(--page-padding-desktop);
    --section-space: var(--space-24);
  }
}
```

---

## 8. 크기 토큰

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--size-touch-min` | `44px` | 최소 터치 영역 |
| `--size-button-sm` | `40px` | 작은 버튼 |
| `--size-button-md` | `48px` | 기본 버튼 |
| `--size-button-lg` | `56px` | 주요 CTA |
| `--size-input` | `48px` | 기본 입력 요소 |
| `--size-header-mobile` | `56px` | 모바일 헤더 |
| `--size-header-desktop` | `72px` | 데스크톱 헤더 |
| `--size-icon-sm` | `16px` | 작은 아이콘 |
| `--size-icon-md` | `20px` | 기본 아이콘 |
| `--size-icon-lg` | `24px` | 주요 아이콘 |

---

## 9. Border 토큰

## 9-1. Border Width

| 토큰 | 값 |
|---|---:|
| `--border-width-thin` | `1px` |
| `--border-width-medium` | `2px` |

## 9-2. Border Radius

시안의 둥근 CTA에는 pill radius를 사용하고, 이미지·카드의 곡률은 역할별로 적용한다.

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--radius-none` | `0` | 기본 영역 |
| `--radius-sm` | `2px` | 작은 상태 요소 |
| `--radius-md` | `4px` | 입력·일반 버튼 |
| `--radius-lg` | `8px` | 모달·보조 카드 |
| `--radius-full` | `9999px` | 프로필 이미지·배지 |

---

## 10. Shadow 토큰

그림자는 모달, 드롭다운 등 레이어 구분이 필요한 곳에만 사용한다.

| 토큰 | 값 |
|---|---|
| `--shadow-none` | `none` |
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.08)` |
| `--shadow-md` | `0 8px 24px rgb(0 0 0 / 0.12)` |
| `--shadow-lg` | `0 20px 48px rgb(0 0 0 / 0.18)` |

---

## 11. Z-index 토큰

임의의 큰 숫자를 사용하지 않는다.

| 토큰 | 값 | 대상 |
|---|---:|---|
| `--z-base` | `0` | 일반 콘텐츠 |
| `--z-sticky` | `100` | sticky 요소 |
| `--z-header` | `200` | 헤더 |
| `--z-dropdown` | `300` | 드롭다운 |
| `--z-overlay` | `400` | dimmed 배경 |
| `--z-modal` | `500` | 모달 |
| `--z-toast` | `600` | 토스트 |

---

## 12. Motion 토큰

모션은 `transform`과 `opacity`를 우선 사용한다.

## 12-1. Duration

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--duration-fast` | `120ms` | hover·즉시 피드백 |
| `--duration-normal` | `240ms` | 버튼·카드 전환 |
| `--duration-slow` | `480ms` | 메뉴·모달 |
| `--duration-section` | `800ms` | 섹션 등장 |

## 12-2. Easing

| 토큰 | 값 |
|---|---|
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--ease-emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |

### 모션 접근성

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

GSAP 애니메이션도 `prefers-reduced-motion`을 확인해 축소하거나 비활성화한다.

---

## 13. 투명도 토큰

| 토큰 | 값 | 용도 |
|---|---:|---|
| `--opacity-disabled` | `0.4` | 비활성 요소 |
| `--opacity-muted` | `0.64` | 보조 이미지·텍스트 |
| `--opacity-overlay` | `0.56` | 모달 배경 |
| `--opacity-hover` | `0.8` | 이미지 hover |

---

## 14. 컴포넌트 토큰

## 14-1. Button

| 토큰 | 연결 값 |
|---|---|
| `--button-primary-bg` | `--color-action-primary` |
| `--button-primary-text` | `--color-text-inverse` |
| `--button-primary-hover` | `--color-action-primary-hover` |
| `--button-secondary-bg` | `--color-white` |
| `--button-secondary-text` | `--color-text-primary` |
| `--button-secondary-border` | `--color-border-strong` |
| `--button-disabled-bg` | `--color-action-disabled` |
| `--button-height` | `--size-button-md` |
| `--button-radius` | `--radius-full` |

## 14-2. Input

| 토큰 | 연결 값 |
|---|---|
| `--input-bg` | `--color-white` |
| `--input-text` | `--color-text-primary` |
| `--input-placeholder` | `--color-text-muted` |
| `--input-border` | `--color-border-default` |
| `--input-border-focus` | `--color-border-strong` |
| `--input-border-error` | `--color-error` |
| `--input-height` | `--size-input` |
| `--input-radius` | `--radius-md` |

## 14-3. Card

| 토큰 | 연결 값 |
|---|---|
| `--card-bg` | `--color-surface` |
| `--card-border` | `--color-border-default` |
| `--card-radius` | `--radius-none` |
| `--card-padding` | `--space-4` |

## 14-4. Modal

| 토큰 | 연결 값 |
|---|---|
| `--modal-bg` | `--color-surface` |
| `--modal-radius` | `--radius-lg` |
| `--modal-shadow` | `--shadow-lg` |
| `--modal-z-index` | `--z-modal` |

---

## 15. 고객문의 상태 토큰

| 상태 | 배경 | 텍스트 |
|---|---|---|
| 접수 완료 `PENDING` | `--color-yellow-50` | `--color-warning` |
| 확인 중 `IN_REVIEW` | `--color-blue-50` | `--color-info` |
| 답변 완료 `ANSWERED` | `--color-green-50` | `--color-success` |

```css
.inquiry-status--pending {
  color: var(--color-warning);
  background-color: var(--color-yellow-50);
}

.inquiry-status--in-review {
  color: var(--color-info);
  background-color: var(--color-blue-50);
}

.inquiry-status--answered {
  color: var(--color-success);
  background-color: var(--color-green-50);
}
```

---

## 16. variables.css 전체 예시

```css
:root {
  /* Primitive Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e5e5e5;
  --color-gray-300: #d4d4d4;
  --color-gray-400: #a3a3a3;
  --color-gray-500: #737373;
  --color-gray-600: #525252;
  --color-gray-700: #404040;
  --color-gray-800: #262626;
  --color-gray-900: #171717;
  --color-gray-950: #0a0a0a;

  --color-red-50: #fef2f2;
  --color-red-600: #dc2626;
  --color-green-50: #f0fdf4;
  --color-green-700: #15803d;
  --color-yellow-50: #fefce8;
  --color-yellow-700: #a16207;
  --color-blue-50: #eff6ff;
  --color-blue-700: #1d4ed8;

  /* Brand Colors · Figma */
  --color-cream: #fffcf2;
  --color-cream-muted: #f8f8f2;
  --color-sage-light: #edeee3;
  --color-beige: #e9e5d6;
  --color-brown: #403630;
  --color-brown-secondary: #4c433c;
  --color-taupe: #807871;
  --color-sand: #d6d1c8;
  --color-green: #0b5a38;
  --color-sage: #6d7f71;
  --color-sage-muted: #dee3d3;

  /* Semantic Colors */
  --color-bg-primary: var(--color-white);
  --color-bg-secondary: var(--color-cream);
  --color-bg-inverse: var(--color-green);
  --color-surface: var(--color-white);
  --color-surface-muted: var(--color-gray-100);
  --color-text-primary: var(--color-brown);
  --color-text-secondary: var(--color-brown-secondary);
  --color-text-muted: var(--color-taupe);
  --color-text-inverse: var(--color-cream-muted);
  --color-border-default: var(--color-sand);
  --color-border-strong: var(--color-brown);
  --color-action-primary: var(--color-green);
  --color-action-primary-hover: var(--color-brown);
  --color-action-disabled: var(--color-gray-300);
  --color-focus: #2563eb;
  --color-error: var(--color-red-600);
  --color-success: var(--color-green-700);
  --color-warning: var(--color-yellow-700);
  --color-info: var(--color-blue-700);

  /* Typography */
  --font-family-base: "Pretendard Variable", Pretendard, sans-serif;
  --font-family-display-ko: "MaruBuri", "Pretendard Variable", serif;
  --font-family-display-en: "Playfair Display", "MaruBuri", serif;
  --font-family-label-en: "IBM Plex Sans", "Pretendard Variable", sans-serif;
  --font-family-decorative: Inter, "Pretendard Variable", sans-serif;
  --font-weight-thin: 100;
  --font-weight-light: 300;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
  --font-size-caption: .75rem;
  --font-size-body-sm: .875rem;
  --font-size-body: 1rem;
  --font-size-body-lg: 1rem;
  --font-size-product: 1rem;
  --font-size-button: .875rem;
  --font-size-nav: 1rem;
  --font-size-lead: 1.125rem;
  --font-size-title-ko: 1.75rem;
  --font-size-title-en: 1.75rem;
  --font-size-hero: 2.5rem;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-size-100: 0.75rem;
  --font-size-200: 0.875rem;
  --font-size-300: 1rem;
  --font-size-400: 1.125rem;
  --font-size-500: 1.25rem;
  --font-size-600: 1.5rem;
  --font-size-700: 2rem;
  --font-size-800: 2.5rem;
  --font-size-900: 3.5rem;
  --font-size-1000: 4.5rem;
  --line-height-tight: 1.1;
  --line-height-heading: 1.2;
  --line-height-body: 1.4;
  --letter-spacing-tight: -0.05em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.03em;
  --letter-spacing-wider: 0.05em;

  /* Spacing */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* Layout */
  --container-sm: 640px;
  --container-md: 960px;
  --container-lg: 1200px;
  --container-xl: 1440px;
  --page-padding-mobile: 16px;
  --page-padding-tablet: 24px;
  --page-padding-desktop: 40px;
  --page-padding: var(--page-padding-mobile);
  --section-space: var(--space-16);
  --grid-gap-sm: 12px;
  --grid-gap-md: 20px;
  --grid-gap-lg: 32px;

  /* Size */
  --size-touch-min: 44px;
  --size-button-sm: 40px;
  --size-button-md: 48px;
  --size-button-lg: 56px;
  --size-input: 48px;
  --size-header-mobile: 56px;
  --size-header-desktop: 72px;
  --size-icon-sm: 16px;
  --size-icon-md: 20px;
  --size-icon-lg: 24px;

  /* Border */
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.08);
  --shadow-md: 0 8px 24px rgb(0 0 0 / 0.12);
  --shadow-lg: 0 20px 48px rgb(0 0 0 / 0.18);

  /* Z-index */
  --z-base: 0;
  --z-sticky: 100;
  --z-header: 200;
  --z-dropdown: 300;
  --z-overlay: 400;
  --z-modal: 500;
  --z-toast: 600;

  /* Motion */
  --duration-fast: 120ms;
  --duration-normal: 240ms;
  --duration-slow: 480ms;
  --duration-section: 800ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  /* Opacity */
  --opacity-disabled: 0.4;
  --opacity-muted: 0.64;
  --opacity-overlay: 0.56;
  --opacity-hover: 0.8;

  /* Component */
  --button-primary-bg: var(--color-action-primary);
  --button-primary-text: var(--color-text-inverse);
  --button-primary-hover: var(--color-action-primary-hover);
  --button-secondary-bg: var(--color-white);
  --button-secondary-text: var(--color-text-primary);
  --button-secondary-border: var(--color-border-strong);
  --button-disabled-bg: var(--color-action-disabled);
  --button-height: var(--size-button-md);
  --button-radius: var(--radius-full);
  --input-bg: var(--color-white);
  --input-text: var(--color-text-primary);
  --input-placeholder: var(--color-text-muted);
  --input-border: var(--color-border-default);
  --input-border-focus: var(--color-border-strong);
  --input-border-error: var(--color-error);
  --input-height: var(--size-input);
  --input-radius: var(--radius-md);
  --card-bg: var(--color-surface);
  --card-border: var(--color-border-default);
  --card-radius: var(--radius-none);
  --card-padding: var(--space-4);
  --modal-bg: var(--color-surface);
  --modal-radius: var(--radius-lg);
  --modal-shadow: var(--shadow-lg);
  --modal-z-index: var(--z-modal);
}

@media (min-width: 768px) {
  :root {
    --page-padding: var(--page-padding-tablet);
    --section-space: var(--space-20);
    --card-padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  :root {
    --font-size-caption: .75rem;
    --font-size-body-sm: .9375rem;
    --font-size-body: 1rem;
    --font-size-body-lg: 1.0625rem;
    --font-size-product: 1.125rem;
    --font-size-button: 1.25rem;
    --font-size-nav: 1.25rem;
    --font-size-lead: 1.5625rem;
    --font-size-title-ko: 2.875rem;
    --font-size-title-en: 2.5rem;
    --font-size-hero: 4.6875rem;
    --page-padding: var(--page-padding-desktop);
    --section-space: var(--space-24);
  }
}
```

---

## 17. React 적용 방법

`main.jsx`에서 공통 CSS를 한 번만 불러온다.

```jsx
import "./styles/reset.css";
import "./styles/fonts.css";
import "./styles/variables.css";
import "./styles/global.css";
```

### reset.css 및 global.css

`reset.css`는 [Eric Meyer Reset CSS v2.0 원문](https://meyerweb.com/eric/tools/css/reset/reset.css)을 사용한다. 출처·버전·public domain 주석을 함께 보존한다. 상세 설명은 [공식 페이지](https://meyerweb.com/eric/tools/css/reset/)를 참조한다.

Meyer reset의 `body { line-height: 1; }` 뒤에 아래 프로젝트 기본값을 로드한다. box-sizing, 폼 서체 상속 등 프로젝트 보완 규칙은 `global.css`에 둔다.

```css
/* global.css */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-size: 100%;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-light);
  line-height: var(--line-height-body);
  letter-spacing: var(--letter-spacing-normal);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
}

input, select, textarea {
  font-size: var(--font-size-body);
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Meyer reset의 font: inherit 이후 의미를 복원한다. */
strong, b { font-weight: var(--font-weight-bold); }
em, i { font-style: italic; }

.hero__title {
  font-family: var(--font-family-display-en);
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

.store__title {
  font-family: var(--font-family-display-ko);
  font-size: var(--font-size-title-ko);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-heading);
}

.header__nav {
  font-family: var(--font-family-display-en);
  font-size: var(--font-size-nav);
  font-weight: var(--font-weight-medium);
  font-style: italic;
  line-height: var(--line-height-heading);
}

.hero__description {
  font-size: var(--font-size-lead);
  line-height: var(--line-height-body);
}
```

버튼 글자 크기는 컴포넌트에서 `--font-size-button`으로 지정한다. reset으로 제거된 목록 마커는 약관·본문 목록에서 별도로 복원하고, 제목에는 역할별 크기·굵기를 명시한다.

컴포넌트 CSS에서는 변수를 사용한다.

```css
.product-card {
  color: var(--color-text-primary);
  background-color: var(--card-bg);
}

.product-card__name {
  margin-top: var(--space-3);
  font-size: var(--font-size-product);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-heading);
}

.product-card__like-button {
  width: var(--size-touch-min);
  height: var(--size-touch-min);
  color: var(--color-text-primary);
}

.product-card__like-button:focus-visible {
  outline: var(--border-width-medium) solid var(--color-focus);
  outline-offset: 2px;
}
```

---

## 18. 토큰 사용 금지 기준

- 컴포넌트 CSS에 임의의 HEX 색상을 반복해서 작성하지 않는다.
- 역할 토큰에 없는 글자 크기를 임의로 반복하지 않는다. 17px 본문은 정의된 `--font-size-body-lg`를 사용한다.
- `z-index: 9999`를 사용하지 않는다.
- 비슷한 간격 값을 페이지마다 새로 만들지 않는다.
- 색상만으로 성공, 실패, 선택 상태를 표시하지 않는다.
- 그림자와 radius는 시안의 베이커리 브랜드 톤과 컴포넌트 역할에 맞게 사용한다.
- 전역 토큰을 특정 컴포넌트 하나만을 위해 무분별하게 추가하지 않는다.

새로운 토큰이 필요한 경우 팀원과 용도, 이름, 중복 여부를 확인한 후 `variables.css`와 이 문서를 함께 수정한다.

---

## 19. 디자인 토큰 완료 체크리스트

- [ ] Meyer Reset v2.0 원문과 출처 주석을 적용했다.
- [ ] reset → fonts → variables → global 순서로 로드한다.
- [ ] Pretendard, MaruBuri, Playfair Display, IBM Plex Sans와 사용 시 Inter가 연결되었다.
- [ ] 한글·영문·숫자 혼합 문구의 실제 서체와 fallback을 확인했다.
- [ ] 필요한 weight와 실제 italic 파일이 로드되었다.
- [ ] 모바일 제안 크기를 375px·390px·767px에서 검토했다.
- [ ] 768px·1023px·1024px·1440px·1920px에서 제목 줄바꿈과 넘침을 확인했다.
- [ ] 본문·설명문은 PC·모바일 모두 computed line-height가 글자 크기의 1.4배이다.
- [ ] 브라우저 글자 확대 시 고정 높이로 내용이 잘리지 않는다.
- [ ] `variables.css`에 공통 토큰이 선언되었다.
- [ ] 브랜드 컬러가 Figma의 크림·브라운·그린과 일치한다.
- [ ] 상태 컬러는 고객문의·알림 등 필요한 곳에만 사용한다.
- [ ] 본문 글자 크기가 기본 16px이다.
- [ ] 최소 터치 영역이 44px 이상이다.
- [ ] 간격은 4px 단위를 기준으로 사용한다.
- [ ] 모바일 퍼스트로 작성했다.
- [ ] 768px, 1024px, 1440px 기준을 사용한다.
- [ ] 컴포넌트가 Semantic Token을 우선 사용한다.
- [ ] 임의의 HEX와 z-index를 반복해서 사용하지 않는다.
- [ ] 포커스 표시가 분명하게 보인다.
- [ ] 텍스트 명도 대비를 확인했다.
- [ ] 상태를 색상만으로 구분하지 않는다.
- [ ] `prefers-reduced-motion`을 지원한다.
- [ ] 새 토큰 추가 시 문서와 `variables.css`를 함께 수정한다.

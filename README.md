# TOUS les JOURS Renewal | 뚜레쥬르 웹사이트 리뉴얼

**[배포 사이트 바로가기](https://hagyomi.github.io/Touslesjours/)**

## 1. 프로젝트 소개

뚜레쥬르의 빵과 선물, 브랜드 이야기를 소개하는 React 기반 반응형 웹사이트입니다. 크림·브라운·그린 색상과 아치형 상품 이미지, 세리프 타이포그래피를 활용하고, 스크롤 애니메이션과 카드 확대 인터랙션으로 콘텐츠를 탐색하도록 구성했습니다.

홈 페이지를 중심으로 메뉴 전용 페이지와 테스트 로그인 화면을 제공합니다. 상품과 이벤트는 프로젝트 내부의 정적 데이터로 표시하는 프런트엔드 데모입니다.

## 2. 기획 의도 및 목표

현재 구현은 다음 방향에 초점을 맞추고 있습니다.

- **브랜드 분위기 전달:** 빵·매장 사진, 제빵 영상, 일러스트와 브랜드 스토리를 하나의 흐름으로 구성합니다.
- **상품 탐색 경험 구성:** 카테고리 탭, 상품명 검색, 추천 상품 가로 탐색, 선물 컬렉션으로 다양한 탐색 경로를 제공합니다.
- **인터랙션 구현:** GSAP으로 첫 화면의 등장 효과, 스크롤에 반응하는 캐릭터, 상품 카드 확대 전환을 구현합니다.
- **화면 크기와 입력 방식 대응:** CSS 미디어 쿼리로 레이아웃을 조정하고 키보드 탭 이동, 모달 포커스 복귀, 일부 모션의 동작 줄이기 설정을 지원합니다.
- **화면과 데이터 분리:** 공통 UI, 홈 섹션, 상품 데이터를 분리하여 반복되는 카드와 버튼을 재사용합니다.

## 3. 사용 기술 및 라이브러리

버전 범위는 하위 프로젝트의 `package.json` 기준입니다.

| 기술 | 버전 / 형식 | 사용 내용 |
| --- | --- | --- |
| React / React DOM | ^19.2.8 | 함수형 컴포넌트, Hooks 기반 상태·DOM 관리 및 렌더링 |
| JavaScript | ES Modules, JSX | 화면 분기, 상품 검색, 데이터 구성, 사용자 이벤트 처리 |
| Vite | ^8.3.0 | 개발 서버, 프로덕션 빌드, 배포 경로 설정 |
| @vitejs/plugin-react | ^6.1.1 | Vite의 React 개발 환경 구성 |
| GSAP | ^3.15.0 | 타임라인, 이미지 확대, 등장 애니메이션 |
| GSAP ScrollTrigger / Flip | GSAP 플러그인 | 스크롤 연동·영역 고정, 카드 확대·복귀 전환 |
| CSS | 일반 CSS | BEM 방식 클래스, CSS 변수, 미디어 쿼리, 로컬 웹폰트 |

추천 상품의 가로 탐색은 GSAP과 직접 작성한 포인터·스크롤 처리로 구현했습니다.

폰트는 `public/fonts`의 Pretendard Variable, Playfair Display, MaruBuri, IBM Plex Sans를 `src/styles/fonts.css`에서 불러옵니다.

## 4. 주요 기능 및 인터랙션

### 페이지 구성

| 경로 | 화면 및 동작 |
| --- | --- |
| `/` | Hero → Menu → Gift → Picks → Event → Story → Store 순서의 홈 |
| `/menu`, `/menu/products` | 카테고리별 메뉴 탐색 |
| `/login` | 테스트 로그인 폼과 완료 화면 |
| `/store` | 지역·매장명·주소 검색과 매장 안내 |

`App.jsx`에서 `window.location.pathname`과 Vite의 `BASE_URL`로 화면을 구분합니다. 섹션 이동은 `#store`, `#event` 등의 해시 링크를 사용합니다. 헤더와 푸터는 공통으로 표시합니다.

### 상품 탐색

- **메뉴 탭:** Bread, Cake, Deli, Desserts, Drinks, Gift의 6개 카테고리를 전환합니다. 좌우 방향키로도 탭을 이동할 수 있습니다.
- **메뉴 카드:** 호버·포커스 시 상품 이미지를 확대하고, 선택하면 원래 카드에서 커지는 상세 모달을 표시합니다.
- **상품명 검색:** 헤더의 Search에서 검색 모달을 열고 로컬 상품명을 필터링합니다. 결과 수와 검색 결과 없음 안내를 제공합니다.
- **선물 컬렉션:** Cake, Roll Cake, Gift Set 선택 시 저장된 상품 목록을 표시하고, 개별 상품 상세로 이동합니다.
- **Daily Picks:** 데스크톱의 일반 모션 환경에서는 섹션을 고정하고 세로 스크롤을 상품의 가로 이동에 연결합니다. 마우스 드래그와 이전·다음 버튼도 지원하며, 작은 화면에서는 가로 스크롤로 탐색합니다.

### 브랜드 콘텐츠와 모션

- **Hero:** 제목·설명·이미지 등장 효과와 4개 사진의 자동 전환, 스크롤 연동 캐릭터 이동을 제공합니다.
- **Gift:** 화면 진입 여부에 따라 나뭇잎 장식 애니메이션을 재생·정지합니다.
- **Event:** 4개의 이벤트 안내와 상세 모달, 공식 홈페이지 링크를 제공합니다.
- **Story:** 자동 재생·음소거·반복 제빵 영상, 레터링 공개 효과, SVG 경로를 따라 걷는 캐릭터와 곡선 그리기 효과를 구현했습니다.
- **Store:** 매장 이미지와 소개 문구를 보여주고 내부 매장찾기 페이지로 연결합니다. 지역·매장명·주소 검색과 선택 매장 안내를 제공합니다. 공식 안내에서 확인한 일부 매장 6곳의 로컬 데이터이며 실시간 전체 매장 목록은 아닙니다.

### 테스트 로그인과 접근성

- `test / test1234` 입력 또는 **테스트용 로그인** 버튼으로 완료 화면을 표시합니다. 잘못된 계정 입력에는 오류 문구를 제공합니다.
- 본문 바로가기, 탭의 ARIA 속성, 검색 결과 알림, 네이티브 `<dialog>`를 사용합니다.
- 모달의 Escape 닫기, 배경 스크롤 잠금, 닫은 뒤 포커스 복귀를 처리합니다.
- 여러 GSAP 효과와 전역 CSS에서 `prefers-reduced-motion` 설정을 반영합니다.

### 구현 범위

상품 정보는 `src/data`에 저장된 목록이며 서버 API와 실시간 동기화하지 않습니다. `homeService.js`도 로컬 데이터를 반환합니다. 로그인 상태는 React 상태로만 관리하며 실제 회원 인증·결제는 연결되어 있지 않습니다. 이벤트 문구는 시안 콘텐츠이므로 실제 행사 진행 여부를 의미하지 않습니다.

## 5. 프로젝트 폴더 구조

Git 저장소 루트는 `리뉴얼md/`이며, npm 명령은 하위 프로젝트에서 실행합니다. 실제 Windows 폴더명은 `touslesjours-renewal`, Git 추적 경로와 HTML 진입 경로는 `Touslesjours-renewal`입니다. 아래 구조와 실행 명령은 Git 추적 경로 기준입니다.

```text
리뉴얼md/
├── README.md                       # 포트폴리오·실행 안내 통합 문서
├── .gitignore                      # 저장소 전체 캐시·임시 파일 제외
├── index.html                      # HTML 진입점
├── Design-token.md                 # 디자인 토큰 문서
├── PROJECT_BUILD_GUIDE.md          # 개발 기획·가이드
├── docs/                           # Vite 빌드 결과 / GitHub Pages 배포 폴더
└── Touslesjours-renewal/
    ├── .gitignore                  # 기존 하위 프로젝트 제외 규칙
    ├── .vercelignore
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js              # 상위 루트·빌드 출력·배포 경로 설정
    ├── vercel.json
    ├── *-preview.html              # 카드·버튼 미리보기 페이지
    ├── public/
    │   ├── fonts/                  # 로컬 폰트와 일부 폰트 라이선스
    │   ├── images/                 # Figma 이미지, 메뉴·선물 상품 이미지
    │   └── videos/                 # 제빵 영상
    ├── scripts/                    # 구조·브라우저 검증, 이미지 가져오기 스크립트
    └── src/
        ├── js/main.js              # React 렌더링 진입점
        ├── App.jsx                 # 경로별 화면·공통 레이아웃·모달 상태
        ├── App.css
        ├── index.css               # 전역 스타일
        ├── pages/
        │   ├── Home/               # 홈 섹션 조합과 스타일
        │   └── Login/              # 테스트 로그인 화면과 스타일
        ├── components/
        │   ├── common/             # Header, Footer, Button, DetailDialog 등
        │   ├── Home/               # Menu, Gift, Picks, Event, Story, Store
        │   ├── Hero.jsx
        │   └── ...                 # MenuCard, PickCard, GiftCard 등과 CSS
        ├── data/                   # 카테고리별 상품·선물 컬렉션·이미지 매핑
        ├── services/homeService.js # 홈의 로컬 상품 데이터 접근
        └── styles/                 # 폰트 정의·CSS 변수
```

상위 개발 가이드에는 구현 예정 기능도 포함되어 있습니다. 이 README의 기능·기술 설명은 현재 연결된 실제 코드 기준입니다.

## 6. 설치 및 실행 방법

### 실행 환경

Node.js와 npm이 필요합니다. 잠금 파일의 Vite 엔진 조건은 Node.js `^20.19.0 || >=22.12.0`입니다.

### 의존성 설치 및 개발 서버

저장소 루트(`리뉴얼md/`)에서 실행합니다.

```sh
cd Touslesjours-renewal
npm ci
npm run dev
```

개발 서버: **http://127.0.0.1:5173/**

`strictPort: true`로 설정되어 있어 5173 포트가 사용 중이면 다른 포트로 자동 이동하지 않습니다. 실행 중인 같은 프로젝트 서버가 있다면 해당 서버를 사용하거나 종료한 뒤 실행합니다.

### 프로덕션 빌드 및 미리보기

같은 하위 프로젝트 디렉터리에서 실행합니다.

```sh
npm run build
npm run preview
```

미리보기 주소는 터미널에 표시되는 URL을 사용하며, 기본 프로덕션 기준 경로는 `/Touslesjours/`입니다. 빌드 결과는 상위 폴더의 `docs/`에 생성되며 기존 출력 내용을 교체합니다.

### 검증 스크립트

```sh
npm run verify:structure
```

상대 import, 로컬 이미지·폰트 참조, CSS 중복 등을 검사합니다. 브라우저 검증 스크립트인 `npm run verify:refresh`, `npm run verify:css`, `node scripts/verify-home.mjs`도 포함되어 있습니다. 이들은 개발 서버와 로컬 Chrome 디버깅 포트 `9333`이 실행된 환경을 전제로 합니다.

## 7. 배포 사이트 링크

**[뚜레쥬르 리뉴얼 사이트 바로가기](https://hagyomi.github.io/Touslesjours/)**

기존 README에 기록된 GitHub Pages 주소이며, `vite.config.js`의 프로덕션 기준 경로(`/Touslesjours/`)와 일치합니다.

기존 문서의 GitHub Pages 배포 방식은 **Settings → Pages → Deploy from a branch → main /docs** 설정을 기준으로 합니다. 실제 GitHub 웹 설정은 별도로 확인해야 합니다. 소스 변경 후 `npm run build`로 생성한 `docs/`를 커밋·푸시하는 방식입니다. 빌드 설정은 `.nojekyll`과 메뉴·로그인 경로의 HTML 진입 파일도 생성합니다.


### 배포 및 저장소 관리 참고

- `docs/`는 GitHub Pages 배포 파일로 추적을 유지합니다. `node_modules`, `.vite`, `.npm-cache`, 검사 브라우저 프로필, 생성 산출물은 `.gitignore`로 관리합니다. 이미 추적 중인 파일은 ignore 규칙을 추가해도 추적이 해제되지 않습니다.
- 현재 `vercel.json`의 출력 폴더는 `dist`이지만 Vite의 실제 출력은 `../docs`입니다. Vercel 재배포 전 출력 폴더와 `VITE_BASE_PATH` 환경변수를 확인해야 합니다.
- `scripts/verify-home.mjs`에는 현재 구현과 맞지 않는 과거 Swiper·상품 정보 가정이 남아 있습니다.

### 관련 문서

- [디자인 토큰](./Design-token.md)
- [개발 기획·가이드](./PROJECT_BUILD_GUIDE.md): 구현 예정 항목도 포함합니다.

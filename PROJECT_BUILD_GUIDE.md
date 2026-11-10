# TOUS les JOURS Renewal 개발 가이드

이 문서는 TOUS les JOURS 리뉴얼 프로젝트의 실제 코드와 개발 환경을 기반으로 작성한 가이드입니다. 프로젝트 구조, 주요 기능 및 개발 설정을 정리하여 유지보수와 코드 관리를 돕습니다.

## 1. 프로젝트 범위

뚜레쥬르의 상품과 브랜드 이야기를 소개하는 React 기반 반응형 프런트엔드 데모입니다. 홈, 메뉴, 테스트 로그인, 매장찾기를 제공하며 정적 상품·매장 데이터를 사용합니다.

현재 회원가입, 실제 회원 인증, 카카오 로그인·주소검색, 마이페이지, 프로필 업로드, 장바구니, 좋아요, 최근 본 상품, 게시판, 고객문의 CRUD, 결제, 백엔드 API는 구현되어 있지 않습니다. 이 기능들을 현재 작업의 필수 완료 조건으로 취급하지 않습니다.

## 2. 기술 구성

버전 범위는 하위 프로젝트의 `package.json` 기준입니다.

| 기술 | 버전 | 역할 |
| --- | --- | --- |
| React / React DOM | ^19.2.8 | 함수형 컴포넌트, Hooks, 렌더링 |
| JavaScript / JSX | ES Modules | 화면 분기, 데이터와 이벤트 처리 |
| Vite | ^8.3.0 | 개발 서버, 빌드, 배포 경로 변환 |
| @vitejs/plugin-react | ^6.1.1 | React 개발 환경 |
| GSAP | ^3.15.0 | 애니메이션, ScrollTrigger, Flip |
| 일반 CSS | BEM 방식 클래스 | 반응형 레이아웃, 상태 스타일, CSS 변수 |

React Router, Zustand, Lucide React는 사용하지 않습니다. Swiper는 미사용 의존성 정리 과정에서 제거했습니다. 전역 초기 스타일은 `src/index.css`에 있으며 별도 `reset.css`는 없습니다. 앱 상태는 React 상태로 관리하며 로그인 상태를 localStorage에 저장하지 않습니다.

로컬 폰트는 Pretendard Variable, Playfair Display, MaruBuri, IBM Plex Sans입니다.

## 3. 저장소와 실행 진입점

Git 저장소 루트는 `리뉴얼md/`입니다. npm 프로젝트는 하위 폴더에 있고 Vite의 HTML 루트는 저장소 루트입니다.

실제 Windows 폴더명은 `touslesjours-renewal`, Git 추적 경로와 원본 HTML의 진입 경로는 `Touslesjours-renewal`입니다. 아래 구조와 명령은 Git 추적 경로 기준입니다. 대소문자를 구분하는 환경에서 경로를 임의로 바꾸지 않습니다.

```text
리뉴얼md/
├── README.md                       # 포트폴리오·설치·실행 안내
├── PROJECT_BUILD_GUIDE.md          # 현재 개발·유지보수 가이드
├── Design-token.md                 # 디자인 분석·토큰 문서
├── .gitignore                      # 저장소 전체 캐시·임시 파일 제외
├── index.html                      # 원본 HTML 진입점
├── docs/                           # GitHub Pages 생성 결과
└── Touslesjours-renewal/
    ├── .gitignore                  # 기존 하위 프로젝트 제외 규칙
    ├── .vercelignore
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── vercel.json
    ├── *-preview.html              # 카드·버튼 미리보기 6개
    ├── public/
    │   ├── fonts/
    │   ├── images/
    │   └── videos/
    ├── scripts/                    # 구조·브라우저 검사, 상품 자료 수집
    └── src/
        ├── js/main.js              # createRoot + StrictMode
        ├── App.jsx                 # 경로 분기·공통 레이아웃·모달 상태
        ├── App.css
        ├── index.css
        ├── components/
        │   ├── common/             # Header, Footer, Button, DetailDialog, ScrollToTop
        │   ├── Home/               # Menu, Gift, Picks, Event, Story, Store
        │   └── ...                 # Hero, 재사용 카드와 각 CSS
        ├── pages/
        │   ├── Home/
        │   ├── Login/
        │   └── StoreFinder/
        ├── data/                   # 상품·매장 데이터, 이미지 매핑
        ├── services/homeService.js # 홈의 로컬 데이터 접근
        └── styles/                 # fonts.css, variables.css
```

`src/page/`와 이전 Header·Footer 호환 파일은 미사용 정리로 제거했습니다. `src/components/Button.jsx`는 `button-preview.html`이 사용하는 재내보내기 파일이므로 유지합니다. README는 저장소 루트 하나로 통합했습니다.

실행 흐름은 `index.html` → `src/js/main.js` → `App.jsx`입니다.

## 4. 페이지와 공통 UI

`App.jsx`가 `window.location.pathname`에서 Vite의 `BASE_URL`을 제거한 뒤 화면을 선택합니다. 별도 라우터 라이브러리는 없습니다. 정의하지 않은 경로는 현재 홈으로 표시되며 별도 404 화면은 없습니다.

| 경로 | 구성 |
| --- | --- |
| `/` | 홈 섹션 조합 |
| `/menu`, `/menu/products` | 메뉴 전용 화면 |
| `/login` | 테스트 로그인 |
| `/store` | 내부 매장찾기 |

Header·Footer·TOP 버튼은 공통으로 배치합니다. 상품·검색·컬렉션·이벤트 상세는 `DetailDialog`로 표시합니다.

### 헤더와 TOP

- 헤더 메뉴는 Menu, Store, Search, Login입니다. Membership은 삭제했습니다.
- Store는 홈 해시나 공식 사이트가 아니라 내부 매장찾기로 이동합니다.
- Search는 로컬 상품 검색 모달을 엽니다.
- `ScrollToTop`은 스크롤이 400px을 넘으면 표시됩니다. 클릭하면 맨 위로 이동하고 헤더 로고로 포커스를 돌립니다.
- 동작 줄이기 환경에서는 TOP 이동을 즉시 처리합니다.

## 5. 홈 섹션과 인터랙션

| 순서 | 섹션 | 현재 구현 |
| --- | --- | --- |
| 1 | Hero | 제목·설명 등장, 사진 4개 자동 전환, 스크롤 연동 캐릭터 |
| 2 | Menu | Bread·Cake·Deli·Desserts·Drinks·Gift, 각 8개 상품, 이미지 확대·상세 |
| 3 | Gift | Cake·Roll Cake·Gift Set 컬렉션, 장식 모션 |
| 4 | Picks | 추천 상품, 데스크톱 스크롤 고정·가로 이동, 드래그·이전·다음 |
| 5 | Event | 이벤트 안내 4개와 상세 모달 |
| 6 | Story | 제빵 영상, 레터링·곡선·캐릭터 모션, 브랜드 이야기 |
| 7 | Store | 매장 이미지와 내부 매장찾기 연결 |

Picks의 고정·가로 이동은 1024px 이상이면서 일반 모션 환경일 때 적용합니다. 작은 화면과 동작 줄이기 환경에서는 가로 스크롤 방식으로 탐색합니다.

이벤트 영역의 `VIEW MORE`는 링크와 클릭 동작이 없는 버튼이며 hover 스타일만 유지합니다. 이벤트 상세의 공식 홈페이지 링크와 푸터의 외부 링크는 별도로 남아 있습니다. 이벤트 내용은 시안 콘텐츠이며 실제 진행 여부를 보장하지 않습니다.

## 6. 데이터와 자산 관리

### 데이터 접근

| 파일 | 역할 |
| --- | --- |
| `src/data/home.js` | 홈 이미지 매핑, 검색에 포함되는 기존 상품, 추천 상품 |
| `src/data/menuCatalog.js` | 카테고리 상품 연결, 선물 컬렉션 선택 |
| `src/data/bread.js` 등 | 카테고리별 메뉴 데이터 |
| `src/data/officialCakes.js` 등 | 저장된 케이크·롤케이크·선물 목록 |
| `src/data/stores.js` | 공식 안내에서 확인한 일부 매장 6곳의 정적 정보 |
| `src/services/homeService.js` | 로컬 홈 상품 반환 |

현재 데이터 접근은 서비스 함수와 직접 import가 함께 사용됩니다. 모든 데이터를 비동기 서비스로 가져오는 구조는 아닙니다. API 주소·API 키 없이 실행하며 외부 사이트의 목록을 실시간으로 요청하지 않습니다.

상품에는 `id`, `name`, `description`, `image` 등을 사용하고 일부 데이터에는 `category`, `collection`, `crop`, `sourceUrl` 등이 있습니다. 의류용 색상·사이즈·가격 모델을 적용하지 않습니다.

매장찾기는 지역 선택과 매장명·주소 검색, 초기화, 검색 결과 없음, 매장 상세, 전화 연결을 제공합니다. 지도·현재 위치·영업시간 실시간 조회는 구현하지 않았습니다. 화면의 일부 매장 안내 문구는 사용자 요청으로 제거했지만 데이터 범위는 여전히 로컬 6곳입니다.

### 자산 위치와 경로

- `public/images/figma`: Figma 원본 이미지·장식.
- `public/images/menu`: 카테고리별 메뉴와 기본 이미지.
- `public/images/common`, `picks`: 공통 일러스트·화살표와 카드 기본 이미지.
- `public/images/official-cakes`, `official-rolls`, `official-gifts`: 저장된 공식 상품 이미지.
- `public/fonts`: 로컬 폰트 및 일부 폰트 라이선스.
- `public/videos`: 제빵 영상.

기존 이미지 문자열은 `/images/...` 형식이며 Pages 빌드 플러그인이 배포 경로를 보정합니다. 새 내부 링크와 영상처럼 기준 경로가 필요한 경우 `${import.meta.env.BASE_URL}store`와 같은 형식을 사용합니다. `/store`는 기존 플러그인의 문자열 변환 대상이 아니므로 기준 경로를 직접 포함합니다.

장식은 ``assets[`imgObject${i}`]``처럼 동적으로 참조하기도 합니다. 단순 문자열 검색만으로 삭제하지 않습니다. 현재 화면에서 사용하지 않아도 `scripts/figma-assets.json`에 원본 기록이 있는 이미지 8개는 보존했습니다. 상세 목록은 정리 기록을 참고합니다.

## 7. 로그인·모달·접근성

테스트 계정은 **test / test1234**입니다. 테스트용 로그인 버튼은 입력 없이 완료 화면을 표시합니다. 잘못된 계정에는 오류를 안내합니다. 상태는 새로고침하면 초기화되며 실제 인증·사용자 정보 저장·로그인에 따른 헤더 변경은 없습니다.

`DetailDialog`는 네이티브 `<dialog>`와 GSAP Flip을 사용합니다. 메뉴 카드는 패널 확대, 선물 카드는 전체 화면 확대 전환을 사용합니다. Escape·닫기 버튼, 배경 스크롤 잠금과 해제, 닫은 뒤 포커스 복귀를 처리합니다.

현재 접근성 구성은 본문 바로가기, 포커스 표시, 메뉴 탭 ARIA 속성과 방향키 이동, 검색 결과 알림, 입력 label, 아이콘 버튼 설명을 포함합니다. 여러 모션에서 `prefers-reduced-motion`을 반영하지만 모든 모션과 영상이 완전히 정지하는 것은 아닙니다.

## 8. CSS 유지보수 기준

- 전역 초기 스타일은 `src/index.css`, 토큰과 폰트는 `src/styles`에서 관리합니다.
- 페이지·컴포넌트 전용 CSS는 해당 구현 옆에 둡니다.
- Card·MenuCard 공통 제목·설명·버튼은 `components/common/CardContent.css`에서 관리합니다.
- 같은 파일에서 반복되는 공통 선언은 그룹 선택자로 묶고, 개별 크기·상태는 각 선택자에 남깁니다.
- 미디어 쿼리·hover·focus·모달 상태별 재정의를 단순 중복으로 삭제하지 않습니다.
- 서로 다른 컴포넌트에 공통 속성이 있다는 이유만으로 무조건 전역 클래스로 합치지 않습니다.
- CSS 변수는 JSX·GSAP에서 주입할 수도 있으므로 CSS 파일만 보고 미정의로 판단하지 않습니다.
- GSAP context·matchMedia, 이벤트 리스너, 타이머는 종료 시 정리하는 기존 방식을 유지합니다.

반응형 기준은 컴포넌트별로 다릅니다. 480·599·768·960·1024·1200·1440·1920px 등의 조건이 있으므로 단일 공통 분기만 있다고 가정하지 않습니다.

## 9. 설치·실행

잠금 파일의 Vite 엔진 조건은 Node.js `^20.19.0 || >=22.12.0`입니다. 저장소 루트에서 실행합니다.

```sh
cd Touslesjours-renewal
npm ci
npm run dev
```

개발 주소는 **http://127.0.0.1:5173/** 입니다. IPv4 루프백과 `strictPort: true`를 사용하므로 포트 충돌 시 다른 포트로 자동 이동하지 않습니다.

PowerShell 실행 정책으로 `npm.ps1`이 차단되면 정책을 변경하는 대신 `npm.cmd ci`, `npm.cmd run dev`와 같이 실행할 수 있습니다.

화면이 수정 전 상태라면 현재 접속 주소와 서버의 모듈 응답을 확인합니다. 이 작업 환경에서는 서버가 이전 모듈을 제공한 적이 있으므로, 실제 응답을 확인한 뒤 필요하면 해당 개발 서버를 재시작합니다. 다른 프로젝트의 Node 프로세스를 일괄 종료하지 않습니다.

### 빌드·미리보기

```sh
npm run build
npm run preview
```

빌드는 하위 `dist/`가 아니라 저장소 루트 `docs/`를 교체합니다. 현재 기본 프로덕션 기준 경로는 `/Touslesjours/`이므로 미리보기 주소에도 이 경로를 포함합니다. 서버 주소·포트는 터미널 출력을 따릅니다. 검수만 필요한 경우 배포 폴더를 갱신하지 않는 임시 출력 방식과 배포 후처리의 쓰기 경로를 함께 고려합니다.

## 10. 검증 방법

하위 npm 프로젝트에서 실행합니다. 현재 lint 스크립트는 없습니다.

| 명령 | 확인 내용·전제 |
| --- | --- |
| `npm run verify:structure` | 소스 import, 로컬 이미지·폰트, CSS 중복. 보고서는 artifacts에 생성 |
| `npm run verify:layout` | 5개 경로·8개 너비, 미리보기·상호작용·이미지·일반 모션 검사 |
| `npm run verify:refresh` | 기존 직접 접근·새로고침 검사. 개발 서버와 디버깅 포트 9333 필요 |
| `npm run verify:css` | 기존 CSS 검사. 과거 검수 범위를 확인한 뒤 보조적으로 사용 |

`verify:layout`은 개발 서버와 Chrome 원격 디버깅 포트 9333이 실행된 상태를 전제로 합니다. 기존 사용자 탭 대신 별도 검사 탭을 만들고 종료합니다. 검사 프로필과 디버깅 서버는 별도로 준비해야 합니다.

다른 포트·서버는 PowerShell에서 다음처럼 지정할 수 있습니다.

```powershell
$env:VERIFY_BASE_URL = 'http://127.0.0.1:5173'
$env:VERIFY_DEBUG_PORT = '9444'
npm.cmd run verify:layout
```

CSS 전후 비교는 수정 전 `node scripts/verify-layout.mjs before`, 수정 후 `node scripts/verify-layout.mjs after`를 실행합니다. 기본 실행은 기준 파일 없이 현재 화면을 검사합니다. 비교 기준 파일은 같은 검증 스크립트·화면 조건으로 생성해야 합니다.

### 최신 검수 범위

- 홈·메뉴·메뉴/products·로그인·매장찾기 5개 경로.
- 너비 375·390·767·768·1023·1024·1440·1920px의 40개 조건에서 가로 넘침·이미지 누락 확인.
- 메뉴 6종, 상품 상세·Escape, 검색 결과 없음, 선물 컬렉션 3개, 이벤트 4개.
- 매장 검색·초기화, 테스트 로그인, TOP 이동, 내부 매장 링크, Membership 제거와 VIEW MORE 비연결 확인.
- 하위 프로젝트 경로의 카드·버튼 미리보기 6개.
- 일반 모션에서 GSAP Picks 고정·다음 상품 이동.
- 데스크톱·모바일 스크린샷 8개 생성 및 일부 화면 직접 확인.

40개 레이아웃 조건은 동작 줄이기 환경입니다. 일반 모션은 별도 대표 조건에서 확인했으며 모든 애니메이션 프레임·입력 상태 조합을 검증한 것은 아닙니다.

`verify-home.mjs`에는 과거 Swiper와 이전 상품 개수를 가정하는 부분이 남아 있습니다. 현재 구현의 정상 여부를 이 스크립트 전체의 통과로 판단하지 않습니다.

## 11. 배포 경로와 유지할 설정

### GitHub Pages

기존 문서의 배포 주소는 **https://hagyomi.github.io/Touslesjours/** 이며 배포 방식은 `main /docs`입니다. 실제 GitHub 웹 설정은 별도로 확인해야 합니다.

- Vite root: 저장소 루트.
- publicDir: 하위 프로젝트의 `public/`.
- outDir: 저장소 루트의 `docs/`.
- 기본 production base: `/Touslesjours/`.
- `VITE_BASE_PATH`로 기준 경로 재정의 가능.
- 빌드 플러그인이 이미지·일부 내부 링크 문자열을 보정합니다.
- `.nojekyll`, `menu/index.html`, `menu/products/index.html`, `login/index.html`, `store/index.html`을 생성합니다.

원본 `index.html`과 배포 경로별 HTML은 역할이 다릅니다. 생성 HTML을 수동 편집하지 않습니다. 소스 변경 후 배포가 필요하면 빌드 결과도 갱신해야 하며, 로컬 소스 수정만으로 공개 사이트가 바뀌지는 않습니다.

### Vercel

현재 `vercel.json`은 `npm run build`, `outputDirectory: dist`를 지정하고 메뉴·로그인·매장찾기를 `/index.html`로 rewrite합니다. **Vite 출력 `../docs`와 Vercel 출력 `dist`는 일치하지 않습니다.** Vercel 프로젝트의 Root Directory, 빌드 출력 및 `VITE_BASE_PATH` 환경변수를 확인한 뒤 별도 배포 작업에서 해결해야 합니다. 이 문서 수정으로 설정을 변경하지 않습니다.

`.vercelignore`는 scripts와 미리보기 HTML 등 개발 자료도 제외합니다. `dist/`가 남아 있다는 이유로 최신 빌드 결과라고 판단하지 않습니다.

## 12. 정리·Git 관리·완료 기준

- 루트와 하위 `.gitignore`를 유지합니다. 루트 규칙은 상위 `.vite/`도 제외합니다.
- `node_modules`, `.vite`, `.npm-cache`, `.vercel`, 검사 프로필, 생성 검증 결과는 제외 대상으로 관리합니다.
- `docs/`는 현재 Pages 배포 파일이므로 추적을 유지합니다.
- 이미 추적 중인 artifacts 스크린샷은 ignore 규칙만으로 추적 해제되지 않습니다.
- `artifacts/`에는 스크린샷·브라우저 프로필·보조 스크립트가 섞여 있으므로 전체를 캐시로 보고 삭제하지 않습니다.
- 미사용 여부는 앱 import, 미리보기, 동적 자산 참조, 검증·수집 도구와 원본 기록까지 확인합니다.
- 배포 파일·설정과 사용 중인 검사 프로필은 임의로 삭제·이동하지 않습니다.
- Git commit·push와 공개 배포는 별도 요청 범위에서 수행합니다.

작업 완료 시 변경 파일, 기능 변화, 실행한 검사와 결과, 검증하지 못한 범위, 배포 파일 갱신 여부를 보고합니다. 기존 변경사항을 되돌리거나 완료되지 않은 기능을 구현한 것으로 기록하지 않습니다.

## 관련 문서

- [README](./README.md)
- [디자인 토큰·분석](./Design-token.md)

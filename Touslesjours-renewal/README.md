# 뚜레쥬르 React 메인 페이지

## GitHub Pages deployment

Use **Deploy from a branch**, branch **main**, folder **/docs** in repository Settings > Pages. GitHub Actions is not used.

Run `npm run build` from `touslesjours-renewal/`. Vite writes the production site to the repository-root `docs/` directory, replacing its previous contents. This directory is generated output; do not edit it manually. Commit and push `docs/` after rebuilding whenever source changes.

Production base: `/Touslesjours/`. Site: https://hagyomi.github.io/Touslesjours/
Local development uses `/`. Other hosting can override the build base with `VITE_BASE_PATH=/`.

The build preserves existing image/link rebasing and menu/login entry pages, and adds `.nojekyll` for static Pages hosting.

[Figma 수정2 · 1:13](https://www.figma.com/design/0d10rUy86bgr3L5eQu03fq/?node-id=1-13)을 React + Vite + 일반 CSS로 구현했습니다.

## 실행

```sh
npm install
npm run dev
npm run build
```

개발 서버 주소는 `http://127.0.0.1:5173/`입니다. `vite.config.js`에서 IPv4 루프백과 포트를 고정하고 `strictPort: true`를 사용합니다. 포트가 사용 중이면 다른 포트로 이동하지 않고 오류를 표시합니다. 기존 개발 서버가 실행 중이라면 해당 서버를 사용하거나 기존 터미널에서 Ctrl+C로 종료한 뒤 다시 실행하세요. 개발 중에는 서버 터미널을 유지해야 합니다.

### 새로고침 문제 진단 및 검증

동일 프로젝트의 Vite가 5173과 5176에서 동시에 실행되어 의존성 최적화 캐시를 공유하고 있었습니다. 브라우저에서 React 모듈 요청이 `504 Outdated Optimize Dep`로 실패했습니다. 또한 기본 localhost 바인딩에서는 `127.0.0.1` 연결이 거부되었고, 포트 충돌 시 자동 이동으로 기존 브라우저 주소와 서버 주소가 달라졌습니다. 중복 서버를 종료하고 한 번 의존성을 재최적화했으며, 고정 주소와 포트 충돌 감지로 일반적인 중복 실행을 방지합니다. `--force`는 상시 실행 옵션으로 추가하지 않았습니다.

현재 앱은 React Router 없이 경로를 판별합니다. `/`는 홈, `/menu`와 `/menu/products`는 메뉴, `/login`은 테스트 로그인 화면입니다. 섹션 이동에는 해시 링크(`#store`, `#event` 등)를 사용하며, Vite의 기본 SPA fallback으로 하위 URL의 새로고침을 지원합니다. 그 외 경로는 홈으로 표시됩니다.

개발 서버와 Chrome의 로컬 디버깅 포트 9333이 실행 중인 상태에서 `npm run verify:refresh`로 검증합니다. 별도 검사 탭에서 `/`, `/#menu`, `/menu/products`에 직접 접근하고 각 주소를 캐시 없이 3회 새로고침하여 URL, React 화면 구성, 서버 응답, 실행 오류를 확인합니다. 검사 후 검사 탭만 닫습니다. 기존의 누락된 favicon 404는 이 검사의 실패 조건에서 제외합니다.

## 디자인 분석

1920px 시안의 콘텐츠 너비는 1600px입니다. 아치형 상품 이미지, 크림·브라운·그린 색상, 영문 세리프 제목이 디자인의 주요 요소입니다.

| 영역 | Figma 노드 | 데스크톱 높이 | 구현 |
| --- | --- | --- | --- |
| Header | 1:22 | 87px | 로고·섹션 이동·검색 |
| Hero | 1:14 | 836px | 영문 카피·빵 사진·캐릭터 |
| Menu | 카테고리별 con1 | 1458px | Bread·Cake·Deli·Desserts·Drinks·Gift 각 8개·상세 창 |
| Gift | 1:50 | 1202px | 선물 종류 3개·상품 모음 |
| Picks | 1:68 | 1063px | 추천 상품 6개·가로 탐색 |
| Event | 1:86 | 1394px | 이벤트 4개·상세 안내 |
| Story | 1:102 | 2008px | 브랜드 이야기·공간 소개 |
| Store | 72:1302 | 1460px | 매장 사진·공식 매장찾기 |
| Footer | 1:167 | 771px | 브랜드 카피·로고·정책 링크·전화 |

모바일 시안은 제공되지 않아 한 열 배치와 가로 상품 탐색으로 구성했습니다. 키보드 탭 전환, 모달 Escape 닫기, 검색 결과 안내, reduced-motion을 지원합니다.

`src/pages/Home`에서 화면을 조합하고, 섹션은 `src/components/Home`, 공통 요소는 `src/components/common`에 둡니다. 기존 Hero·MenuCard·PickCard·Card를 재사용합니다. `src/data/home.js`는 상품·이미지 매핑이며 `src/services/homeService.js`를 통해 상품 데이터에 접근합니다.

Login은 로컬 테스트 로그인 화면, Membership은 혜택 영역으로 연결됩니다. 실제 회원 인증·결제·회원 시스템은 연결되지 않았습니다. 이벤트 문구는 시안 콘텐츠이며 실제 진행 여부를 보장하지 않습니다. 매장 데이터 대신 공식 매장찾기로 이동합니다.

## 이미지와 서체

원본 이미지·SVG 47개를 Figma에서 받아 `public/images/figma`에 저장했습니다. 헤더·히어로·메뉴·추천·선물·스토리·매장·푸터의 해당 슬롯에 연결합니다. 전체 스크린샷을 UI 이미지로 사용하지 않습니다. `scripts/figma-assets.json`은 원본 식별자와 다운로드 당시 임시 URL 기록입니다. 앱은 로컬 파일만 사용합니다.

이탤릭은 [Google Fonts Playfair Display](https://github.com/google/fonts/tree/main/ofl/playfairdisplay), 선물 부제는 [IBM Plex Sans](https://github.com/google/fonts/tree/main/ofl/ibmplexsans) 원본 폰트로 연결하고 OFL 라이선스를 함께 보관했습니다. Pretendard Variable·Playfair Display Medium·MaruBuri Light와 SemiBold는 `src/styles/fonts.css`에서 공통으로 정의합니다.

## 검증

실제 진입점은 `src/js/main.js`입니다. `src/data/menuCatalog.js`가 con1과 Gift 상품 목록을 연결하며, Gift의 Cake/Roll Cake/Gift Set은 공식 제품 77/7/22종을 저장한 데이터로 표시합니다. 공식 목록은 실시간 동기화되지 않습니다.

`npm run verify:structure`는 전체 소스의 상대 import, 로컬 이미지·폰트 참조, CSS 중복을 검사합니다. 브라우저 검사 서버 주소는 `VERIFY_BASE_URL`로 지정할 수 있습니다(기본 `http://127.0.0.1:5173`). 최신 상세 검수는 [CSS_REVIEW.md](./CSS_REVIEW.md)에 기록했습니다.

`npm run build`로 프로덕션 번들을 검증합니다. 현재 lint 스크립트는 없습니다.

전체 구조·CSS 정리 결과는 [CSS_REVIEW.md](./CSS_REVIEW.md)에 기록했습니다. 개발 서버와 Chrome 디버깅 포트 9333이 실행 중이면 `npm run verify:css`로 홈·메뉴·로그인 36개 화면 조건, 주요 상호작용, 카드 미리보기 6개와 일반 모션을 확인합니다. `artifacts`는 Vite 파일 감시에서 제외하여 검사 파일과 브라우저 프로필 잠금이 서버를 중단하지 않도록 했습니다.

개발 서버와 Chrome의 로컬 디버깅 포트 9333이 실행된 상태에서 `node scripts/verify-home.mjs`를 실행합니다. 이미지 파일과 렌더링 슬롯, 이미지 로딩, 런타임 오류, 375·390·767·768·1023·1024·1440·1920px의 가로 넘침, 메뉴·검색·상품·선물·이벤트·Escape·추천 탐색을 확인합니다. 스크린샷과 JSON 결과는 `artifacts`에 생성됩니다.

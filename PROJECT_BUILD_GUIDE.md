# Touslesjours Renewal React 프로젝트 통합 개발 가이드

## 1. 프로젝트 개요

- 뚜레쥬르사이트 : https://www.tlj.co.kr/index.asp
- 프로젝트명: Touslesjours Renewal — Editorial Fashion Experience
- 목적: Touslesjours 브랜드 경험을 재해석한 반응형 베이커리 웹사이트 팀 프로젝트
- 형태: 쇼핑몰 결제 연동 전 단계의 프런트엔드 데모
- 핵심 범위: 컬렉션, 검색, 상품 상세, 장바구니, 좋아요, 게시판, 아이디·비밀번호 로그인, 회원가입, 카카오 소셜 로그인·최초 가입, 테스트 로그인, 마이페이지
- 기술 기준: React + Vite + JavaScript

외부 API 키나 백엔드가 없어도 테스트 로그인과 로컬 데이터로 모든 핵심 화면을 확인할 수 있어야 한다.

---

### 2-1. 메인 페이지 (`/`) — 섹션 순서

| # | 섹션 | 컴포넌트(예상) |
|---|---|---|
| 1 | Header | - |
| 2 | Hero | - |
| 3 | Menu | `menu` |
| 4 | Gift | `gift` |
| 5 | Picks | `pick`, `card` |
| 6 | Event | `event`, `button` |
| 7 | Story | - |
| 8 | Store | `button` |
| 9 | Footer | - |

`Header`와 `Footer`는 `components/common`에서 관리하고 `App.jsx`의 공통 레이아웃에 배치한다. 메인 콘텐츠는 `pages/Home/Home.jsx`에서 위 순서로 조합하며 페이지 전용 컴포넌트는 `components/Home`에 배치한다. 표의 `-`는 별도 하위 컴포넌트가 지정되지 않았음을 뜻한다.

React 컴포넌트와 JSX·CSS 파일명은 PascalCase(`Menu`, `Gift`, `Pick`, `Card`, `Event`, `Button`)로 작성한다. Event와 Store에서 공유하는 `Button`은 `components/common`에서 관리한다. 메인 페이지 폴더 구조는 `Design-token.md`의 구체적인 기준을 따른다.

## 2. 기술 스택

- React Vite, JavaScript
- React Router DOM
- Zustand + persist middleware
- CSS, BEM 네이밍, reset.css
- GSAP + ScrollTrigger
- Swiper
- Lucide React
- localStorage 기반 데모 데이터
- Kakao Login 기반 카카오 소셜 로그인
- Kakao 우편번호 서비스

Redux는 사용하지 않는다.

---

## 3. 공통 개발 원칙

- 모든 컴포넌트는 함수형 컴포넌트로 작성한다.
- CSS 클래스는 BEM 규칙을 사용한다.
- 컴포넌트 전용 CSS는 해당 컴포넌트와 같은 폴더에 작성한다.
- 페이지 전용 CSS는 해당 페이지와 같은 폴더에 작성한다.
- `src/styles`에는 reset, 디자인 토큰, 폰트, 전역 공통 스타일만 작성한다.
- 모바일 퍼스트로 작성하고 태블릿·데스크톱으로 확장한다.
- 반복 데이터는 배열과 `map()`으로 렌더링한다.
- 데이터, 상태 로직, UI 컴포넌트를 분리한다.
- 모든 버튼에 `type`을 명시한다.
- 아이콘 버튼에는 `aria-label`을 제공한다.
- 키보드 포커스가 보이도록 한다.
- 사용하지 않는 import, 변수, 콘솔 로그를 남기지 않는다.
- 이미지의 크기와 비율을 지정해 레이아웃 이동을 줄인다.
- GSAP, 이벤트 리스너, 타이머는 컴포넌트 종료 시 정리한다.
- 라우팅 경로는 한곳에서 관리한다.
- 새로고침해도 직접 접근한 경로가 정상 표시되어야 한다.

---

## 3-1. 이미지 저장 및 API 전환 기준

### 이미지 출처

- 상품 목록·상세, 컬렉션, 메인 히어로, 배너에 사용하는 이미지는 Touslesjours 공식 사이트(https://www.tlj.co.kr/index.asp)의 실제 상품·캠페인 이미지를 사용한다.
- 임의의 스톡 사진이나 AI 생성 이미지로 상품·배너 이미지를 대체하지 않는다.
- 사용할 이미지는 `public/images/products` 또는 `public/images/banners`에 저장하고, 상품 정보와 이미지가 일치하도록 연결한다.
- 이미지 원본 페이지 URL과 사용 위치를 README에 기록한다.
- 사용자 프로필 사진, 기본 캐릭터, 오류 대체 이미지는 각 항목의 별도 기준을 따른다.

### 이미지 저장 위치 (프로젝트에 맞게 이미지폴더 수정)

프로젝트에서 직접 관리하는 상품, 배너, 캐릭터, 대체 이미지는 `public/images`에 저장한다.

```text
public/
└── images/
    ├── products/
    ├── banners/
    ├── characters/
    ├── placeholders/
    └── common/
```

이미지는 React에서 import하지 않고 루트 기준 URL 문자열로 사용한다.

```js
const products = [
    {
        id: 1,
        name: '오버사이즈 재킷',
        image: '/images/products/jacket-01.webp',
    },
    {
        id: 2,
        name: '와이드 팬츠',
        image: '/images/products/pants-01.webp',
    },
];
```

```jsx
<img src={product.image} alt={product.name} width="600" height="800" />
```

`public` 폴더의 파일은 빌드 결과에서 루트 경로로 제공되므로 다음처럼 작성하지 않는다.

```text
잘못된 경로: public/images/products/jacket-01.webp
올바른 경로: /images/products/jacket-01.webp
```

### 이미지 폴더 역할

| 폴더           | 용도                         | 예시                    |
| -------------- | ---------------------------- | ----------------------- |
| `products`     | 상품 목록·상세 이미지        | `jacket-01.webp`        |
| `banners`      | 메인 히어로·프로모션 배너    | `hero-woman-01.webp`    |
| `characters`   | 마이페이지 기본 캐릭터       | `character-01.webp`     |
| `placeholders` | 이미지 없음·오류 대체 이미지 | `product-fallback.webp` |
| `common`       | 로고·공통 장식 이미지        | `logo-symbol.svg`       |

파일명은 영문 소문자와 하이픈을 사용한다.

### 이미지 오류 처리

- 상품 데이터의 이미지가 없으면 placeholder 이미지를 사용한다.
- 이미지 로드가 실패해도 무한 오류가 발생하지 않도록 한 번만 대체한다.
- 이미지에는 크기 또는 `aspect-ratio`를 지정한다.
- 상품 목록 하단 이미지는 `loading="lazy"`를 사용할 수 있다.
- 첫 화면 히어로와 LCP 이미지는 lazy loading을 사용하지 않는다.
- 사용자 업로드 이미지는 `public`에 저장할 수 없으므로 미리보기 URL 또는 서버 스토리지 URL을 사용한다.

### 가상 데이터와 API 데이터의 공통 모델

현재는 `src/data`의 가상 데이터를 사용하되 나중에 API 응답으로 교체할 수 있도록 같은 필드 구조를 유지한다.

```js
{
  id: 1,
  name: "오버사이즈 재킷",
  category: "WOMAN",
  price: 129000,
  image: "/images/products/jacket-01.webp",
  images: [
    "/images/products/jacket-01.webp",
    "/images/products/jacket-02.webp"
  ],
  colors: ["BLACK", "BEIGE"],
  sizes: ["S", "M", "L"],
  isNew: true
}
```

API도 같은 이미지 URL 필드를 반환한다. 외부 이미지 서버나 CDN을 사용하면 전체 URL을 반환해도 된다.

```json
{
    "id": 1,
    "name": "오버사이즈 재킷",
    "image": "/images/products/jacket-01.webp"
}
```

컴포넌트는 로컬 경로인지 외부 URL인지 구분하지 않고 `product.image`를 그대로 사용한다.

### 데이터 접근 계층

페이지와 컴포넌트에서 가상 데이터를 직접 import하지 않는다. `services`의 함수로 데이터를 가져오도록 구성해 API 전환 범위를 줄인다.

```js
// src/services/productService.js
import { products } from '../data/products';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProducts() {
    if (!API_BASE_URL) return products;

    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
        throw new Error('상품 목록을 불러오지 못했습니다.');
    }

    return response.json();
}
```

```env
VITE_API_BASE_URL=
```

같은 방식으로 `productService.js`, `boardService.js`, `inquiryService.js`, `authService.js`를 분리한다.

### API 전환 원칙

- UI 컴포넌트는 데이터 출처를 알지 못하게 한다.
- 데이터 요청, 로딩, 오류 처리는 서비스 또는 전용 Hook에서 담당한다.
- API 응답은 필요한 경우 adapter 함수로 화면 데이터 구조에 맞춘다.
- API 주소는 환경변수로 관리한다.
- 비밀키는 `VITE_` 환경변수에 저장하지 않는다.
- API가 없을 때 가상 데이터를 fallback으로 사용한다.
- API 연결 후 게시판과 고객문의의 localStorage CRUD를 서버 CRUD로 교체한다.

---

## 4. 프로젝트 생성 및 필수 명령

```bash
npm create vite@latest Touslesjours-renewal -- --template react
cd Touslesjours-renewal
npm install
npm install react-router-dom zustand gsap swiper lucide-react
npm run dev
```

최종 검증:

```bash
npm run lint
npm run build
npm run dev
```

오류가 발생하면 원인을 수정한 후 다시 검증한다.

---

## 5. 페이지 및 라우터

| 경로                         | 페이지            | 접근 권한 | 역할             |
| ---------------------------- | ----------------- | --------- | ---------------- |
| `/`                          | HomePage          | 전체      | 브랜드 메인      |
| `/collections`               | CollectionPage    | 전체      | 상품 컬렉션      |
| `/products/:productId`       | ProductDetailPage | 전체      | 상품 상세        |
| `/search`                    | SearchPage        | 전체      | 상품 검색        |
| `/cart`                      | CartPage          | 전체      | 장바구니         |
| `/login`                     | LoginPage         | 비로그인  | 로그인           |
| `/signup`                    | SignUpPage        | 비로그인  | 회원가입         |
| `/auth/kakao/callback`       | KakaoCallbackPage | 전체      | 카카오 인증 결과 |
| `/auth/error`                | AuthErrorPage     | 전체      | 인증 오류        |
| `/board`                     | BoardListPage     | 전체      | 게시글 목록      |
| `/board/:postId`             | BoardDetailPage   | 전체      | 게시글 상세      |
| `/board/write`               | BoardWritePage    | 로그인    | 글 작성          |
| `/board/:postId/edit`        | BoardEditPage     | 작성자    | 글 수정          |
| `/inquiries`                 | InquiryListPage   | 로그인    | 내 고객문의 목록 |
| `/inquiries/write`           | InquiryWritePage  | 로그인    | 고객문의 작성    |
| `/inquiries/:inquiryId`      | InquiryDetailPage | 작성자    | 고객문의 상세    |
| `/inquiries/:inquiryId/edit` | InquiryEditPage   | 작성자    | 고객문의 수정    |
| `/mypage`                    | MyPage            | 로그인    | 사용자 대시보드  |
| `/mypage/profile`            | ProfileEditPage   | 로그인    | 내 정보 수정     |
| `/mypage/posts`              | MyPostsPage       | 로그인    | 내가 작성한 글   |
| `*`                          | NotFoundPage      | 전체      | 404              |

보호 페이지는 `ProtectedRoute`로 감싼다. 비로그인 사용자는 `/login`으로 이동시키며 로그인 후 처음 접근했던 경로로 되돌린다.

---

## 6. 헤더 메뉴

### 비로그인

- 컬렉션
- 검색
- 게시판
- 고객문의
- 장바구니
- 로그인
- 회원가입

### 로그인

- 컬렉션
- 검색
- 게시판
- 고객문의
- 장바구니
- 마이페이지
- 로그아웃

좋아요는 상위 헤더 메뉴에 노출하지 않는다. 좋아요 상품과 최근 본 상품은 로그인 후 마이페이지에서 확인한다.

장바구니 메뉴에는 상품 개수 배지를 표시한다. 로그인 중 프로필 캐릭터가 설정되어 있으면 헤더의 마이페이지 아이콘에도 동일한 이미지를 표시한다.

---

## 7. 로그인 화면

로그인 화면은 아이디·비밀번호를 입력하는 일반 로그인, 카카오 소셜 로그인, 테스트 로그인 버튼을 함께 제공한다. `회원가입` 링크를 누르면 `/signup`으로 이동한다. 최초 카카오 로그인 성공 시 사용자 계정을 생성하고, 이후에는 동일한 카카오 계정으로 로그인한다.

로그인 화면에는 아래 순서로 입력 필드와 버튼을 배치한다.

```text
아이디 [아이디를 입력하세요]
비밀번호 [비밀번호를 입력하세요]
[로그인]

──────── 또는 ────────

[카카오로 시작하기]
[테스트 계정으로 로그인]
```

### 아이디·비밀번호 로그인

- 아이디 입력은 `type="text"`, `autoComplete="username"`을 사용한다.
- 비밀번호 입력은 `type="password"`, `autoComplete="current-password"`를 사용해 입력값을 가린다.
- 각 입력 필드에 연결된 `label`을 제공하고, 빈 값으로 제출하면 해당 필드 아래에 오류를 표시한다.
- `로그인` 버튼 또는 Enter 키로 제출하며, 처리 중에는 중복 제출을 막는다.
- `authService.js`를 통해 인증하고, 실패하면 오류 메시지를 표시한다.
- 서버가 없는 데모에서는 공개된 데모 계정 `demo` / `Touslesjours-demo-1234`로 일반 로그인 흐름을 확인할 수 있게 하고 README에 안내한다.
- 실제 계정의 비밀번호는 프런트엔드 데이터나 localStorage에 저장하지 않는다.
- 로그인 성공 시 이전 접근 경로가 있으면 그 경로로, 없으면 `/mypage`로 이동한다.

### 테스트 로그인 버튼

카카오 키와 서버가 없어도 프로젝트를 즉시 검토할 수 있도록 반드시 제공한다.

```js
export const TEST_USER = {
    id: 'test-user-001',
    name: '테스트 사용자',
    email: 'test@Touslesjours-renewal.com',
    profileImage: '/images/characters/character-01.webp',
    profileImageType: 'avatar',
    loginProvider: 'test',
    grade: 'MEMBER',
    interests: ['WOMAN', 'NEW'],
    address: {
        zonecode: '04524',
        roadAddress: '서울특별시 중구 세종대로 110',
        jibunAddress: '',
        detailAddress: '',
        extraAddress: '',
    },
};
```

테스트 로그인 동작:

- 아이디와 비밀번호 입력 없이 버튼만 눌러 즉시 로그인한다.
- 이전 접근 경로가 있으면 그 경로로, 없으면 `/mypage`로 이동한다.
- `테스트 계정으로 로그인되었습니다.` 토스트를 표시한다.
- 새로고침 후에도 로그인 상태를 유지한다.
- 게시글 작성, 좋아요, 최근 본 상품, 장바구니, 프로필 수정을 모두 테스트할 수 있다.
- 로그아웃하면 인증 상태를 제거한다.

```env
VITE_ENABLE_TEST_LOGIN=true
```

테스트 로그인 버튼 BEM 클래스:

```css
.login-form__test-button {
}
.login-form__test-description {
}
```

버튼 안내 문구:

```text
포트폴리오 기능을 바로 확인할 수 있는 테스트 계정입니다.
```

---

## 7-1. 회원가입 화면

`/signup`에서 아이디·비밀번호·이름 입력란과 카카오 로그인·가입·취소 버튼을 제공한다.

```text
아이디 [아이디를 입력하세요]
비밀번호 [비밀번호를 입력하세요]
이름 [이름을 입력하세요]

[카카오로 시작하기]

[가입] [취소]
```

### 입력 및 버튼 동작

- 아이디와 이름은 `type="text"`를 사용하고, 각각 `autoComplete="username"`, `autoComplete="name"`을 지정한다.
- 비밀번호는 `type="password"`, `autoComplete="new-password"`로 설정해 입력값을 가린다.
- 모든 입력 필드에 연결된 `label`을 제공하며 아이디·비밀번호·이름을 필수로 입력받는다.
- `가입` 버튼은 `type="submit"`으로 설정하고, Enter 키로도 제출할 수 있게 한다.
- 가입 시 필수 입력과 아이디 중복을 검사하고, 오류를 해당 필드 아래에 표시한다.
- `authService.js`를 통해 가입 처리하며, 처리 중에는 중복 제출을 막는다.
- 가입 성공 시 `회원가입이 완료되었습니다. 로그인해 주세요.` 토스트를 표시하고 `/login`으로 이동한다. 가입한 아이디·비밀번호로 일반 로그인할 수 있어야 한다.
- 서버가 없는 데모에서는 가상 계정을 메모리에서만 관리해 가입 후 로그인을 확인한다. 새로고침하면 가상 계정이 초기화됨을 안내하고 실제 비밀번호 입력을 요청하지 않는다.
- 실제 가입 정보는 서버에서 처리하며, 비밀번호를 localStorage나 Zustand `persist`에 저장하지 않는다.
- `카카오로 시작하기`는 `type="button"`으로 설정하고, 일반 가입 필드 입력 여부와 무관하게 기존 카카오 인증 흐름을 실행한다.
- `취소`는 `type="button"`으로 설정하고, 입력 내용을 저장하지 않고 비운 뒤 `/login`으로 이동한다.

---

## 8. 카카오 소셜 로그인

- 카카오 소셜 로그인은 아이디·비밀번호 로그인과 함께 제공한다. 카카오 계정의 최초 가입은 카카오 로그인 성공 시 처리한다.
- 테스트 로그인은 데모 검토용으로 유지한다.
- 프런트엔드는 카카오 인가 요청과 콜백 화면까지만 담당한다.
- 인가 코드로 토큰을 요청하고 사용자 정보를 조회하는 처리는 서버에서 담당한다.
- REST API 키, Client Secret, 액세스 토큰을 프런트엔드 코드나 localStorage에 저장하지 않는다.
- OAuth `state` 값을 생성하고 서버에서 검증한다.
- URL의 인가 코드는 처리 후 제거한다.
- 카카오 키 또는 서버가 없으면 앱을 중단하지 않고 테스트 로그인을 안내한다.

```env
VITE_KAKAO_JAVASCRIPT_KEY=
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/auth/kakao/callback
VITE_ENABLE_KAKAO_LOGIN=true
VITE_ENABLE_TEST_LOGIN=true
```

---

## 9. 인증 상태 관리

`src/store/useAuthStore.js`

```js
{
  user: null,
  isAuthenticated: false,
  authProvider: null,
  isAuthLoading: false,
  authError: null,
  signUp: ({ username, password, name }) => {},
  loginWithCredentials: (username, password) => {},
  loginWithKakao: () => {},
  handleKakaoCallback: () => {},
  loginAsTestUser: () => {},
  updateProfile: () => {},
  logout: () => {},
  clearAuthError: () => {}
}
```

테스트 프로젝트에서는 사용자 정보와 테스트 인증 상태를 Zustand `persist`로 유지한다. 실제 서비스 전환 시 HttpOnly 쿠키 기반 서버 세션으로 교체한다.

---

## 10. 마이페이지

마이페이지는 로그인한 사용자의 정보와 활동을 보여주는 대시보드로 구성한다.

### 프로필 영역

- 프로필 사진 또는 선택한 캐릭터
- 이름
- 이메일
- 회원 등급
- 로그인 방식
- `프로필 수정` 버튼
- 로그아웃 버튼

### 활동 요약

- 좋아요 상품 수
- 최근 본 상품 수
- 장바구니 상품 수
- 작성 게시글 수
- 받은 게시글 좋아요 수

좋아요와 최근 본 상품 요약 카드를 누르면 마이페이지 내부의 해당 섹션으로 스크롤 이동한다. 별도의 상위 메뉴나 독립 목록 페이지로 이동하지 않는다.

### 최근 본 상품 리스트

마이페이지에 `최근 본 상품` 섹션을 표시한다.

- 로그인 사용자가 상품 상세 페이지를 열었을 때 최근 본 상품에 추가한다.
- 동일한 상품을 다시 보면 중복으로 추가하지 않고 가장 앞으로 이동한다.
- 가장 최근에 본 상품부터 표시한다.
- 최대 10개까지만 저장한다.
- 상품 이미지, 상품명, 가격, 컬러, 신상품 여부를 표시한다.
- 상품을 선택하면 해당 상품 상세 페이지로 이동한다.
- `전체 삭제` 버튼으로 최근 본 기록을 비울 수 있다.
- 개별 상품 삭제 버튼을 제공한다.
- 새로고침 후에도 유지한다.
- 로그인 사용자별로 기록이 섞이지 않도록 사용자 ID를 기준으로 관리한다.

최근 본 상품이 없으면 다음 빈 상태를 표시한다.

```text
최근 본 상품이 없습니다.
새로운 컬렉션을 둘러보세요.

[컬렉션 둘러보기]
```

### 좋아요 상품 리스트

마이페이지에 `좋아요 상품` 섹션을 표시한다.

- 별도의 `/wishlist` 또는 `/mypage/likes` 페이지를 만들지 않는다.
- 좋아요 상품은 마이페이지 대시보드 안에서 직접 출력한다.
- 상품 이미지, 상품명, 가격, 컬러, 신상품 여부를 표시한다.
- 하트 버튼을 다시 누르면 좋아요 목록에서 즉시 제거한다.
- 상품을 선택하면 상품 상세 페이지로 이동한다.
- 장바구니 담기 버튼을 제공한다.
- 새로고침 후에도 목록을 유지한다.
- 로그인 사용자별로 좋아요 목록이 섞이지 않도록 사용자 ID를 기준으로 관리한다.

좋아요 상품이 없으면 다음 빈 상태를 표시한다.

```text
아직 좋아요를 누른 상품이 없습니다.
마음에 드는 상품을 저장해 보세요.

[컬렉션 둘러보기]
```

### 마이페이지 상품 섹션 배치

```text
프로필 영역
활동 요약
최근 본 상품
좋아요 상품
내가 작성한 글
고객문의 내역
```

- 모바일에서는 상품 카드를 가로 스크롤 또는 2열 그리드로 표시한다.
- 태블릿에서는 3열, 데스크톱에서는 4열 그리드를 사용할 수 있다.
- 각 섹션은 제목, 상품 수, 빈 상태, 상품 리스트를 포함한다.

---

## 11. 프로필 수정 및 이미지·캐릭터 변경

마이페이지에서 `프로필 수정` 버튼을 누르면 `/mypage/profile`로 이동한다. 이 화면에서 일반 회원정보와 프로필 이미지를 함께 수정할 수 있어야 한다.

### 수정 항목

- 이름
- 이메일
- 프로필 사진 또는 기본 캐릭터
- 관심 카테고리
- 주소
- 마케팅 수신 동의

### 이미지 선택 방식

다음 두 가지 방식을 제공한다.

1. 기기에서 사진 선택
2. 프로젝트에 포함된 기본 캐릭터 선택

화면 구성:

```text
프로필 이미지

        [현재 이미지 미리보기]

[사진 선택] [사진 삭제]

기본 캐릭터 선택
( 캐릭터 1 ) ( 캐릭터 2 ) ( 캐릭터 3 )
( 캐릭터 4 ) ( 캐릭터 5 ) ( 캐릭터 6 )

[취소] [변경사항 저장]
```

### 기본 캐릭터 데이터

`src/data/profileAvatars.js`

```js
export const PROFILE_AVATARS = [
    { id: 'character-01', name: '블랙 캣', src: '/images/characters/character-01.webp' },
    { id: 'character-02', name: '화이트 래빗', src: '/images/characters/character-02.webp' },
    { id: 'character-03', name: '브라운 베어', src: '/images/characters/character-03.webp' },
    { id: 'character-04', name: '레드 폭스', src: '/images/characters/character-04.webp' },
    { id: 'character-05', name: '그레이 울프', src: '/images/characters/character-05.webp' },
    { id: 'character-06', name: '크림 퍼피', src: '/images/characters/character-06.webp' },
];
```

캐릭터 이미지는 프로젝트용으로 직접 제작하거나 사용 권한이 명확한 에셋을 사용한다. 특정 브랜드·게임 캐릭터를 그대로 복제하지 않는다.

### 사진 업로드 기준

- 허용 형식: JPEG, PNG, WebP
- 최대 크기: 5MB
- 파일을 선택하는 즉시 원형 미리보기를 표시한다.
- 허용되지 않는 형식과 용량 초과 시 오류 메시지를 표시한다.
- 같은 파일을 다시 선택할 수 있도록 필요 시 input 값을 초기화한다.
- 데모 버전은 `FileReader` 또는 `URL.createObjectURL()`로 미리보기를 제공한다.
- `URL.createObjectURL()` 사용 시 이전 Object URL을 해제한다.
- 서버가 없는 데모에서 큰 원본 파일을 localStorage에 직접 저장하지 않는다.
- 저장이 꼭 필요하면 Canvas로 정사각형 리사이즈 후 WebP로 압축하고 500KB 이하인지 확인한다.
- 실제 서비스에서는 서버 또는 스토리지 업로드 URL만 사용자 정보에 저장한다.

### 캐릭터 선택 동작

- 캐릭터 카드는 버튼으로 구현한다.
- 선택된 카드에 테두리와 체크 아이콘을 표시한다.
- `aria-pressed`로 선택 상태를 전달한다.
- 키보드 Tab과 Enter/Space로 선택할 수 있어야 한다.
- 캐릭터를 선택하면 사진 업로드 선택은 해제한다.
- 사진을 선택하면 캐릭터 선택은 해제한다.
- 기본값은 현재 저장된 프로필 이미지다.

### 저장 및 취소

- `변경사항 저장`을 누를 때만 `useAuthStore.updateProfile()`을 실행한다.
- 저장 후 `/mypage`로 이동하고 성공 토스트를 표시한다.
- 마이페이지와 헤더의 프로필 이미지가 즉시 변경되어야 한다.
- 새로고침 후에도 선택한 기본 캐릭터 또는 압축된 데모 이미지가 유지되어야 한다.
- `취소`를 누르면 저장하지 않고 마이페이지로 돌아간다.
- 저장하지 않은 변경사항이 있을 때 페이지를 벗어나면 확인 안내를 제공한다.
- 사진 삭제 시 첫 번째 기본 캐릭터를 대체 이미지로 사용한다.

### 사용자 데이터 추가 필드

```js
{
  profileImage: "/images/characters/character-01.webp",
  profileImageType: "avatar",
  selectedAvatarId: "character-01"
}
```

`profileImageType` 값:

```text
avatar
upload
kakao
```

### 컴포넌트

```text
src/components/mypage/ProfileImageEditor.jsx
src/components/mypage/ProfileImagePreview.jsx
src/components/mypage/AvatarSelector.jsx
src/components/mypage/AvatarOption.jsx
src/components/mypage/ProfileEditForm.jsx
```

### BEM 클래스

```css
.profile-image-editor {
}
.profile-image-editor__preview {
}
.profile-image-editor__actions {
}
.profile-image-editor__upload-button {
}
.profile-image-editor__remove-button {
}
.avatar-selector {
}
.avatar-selector__list {
}
.avatar-selector__option {
}
.avatar-selector__option--selected {
}
.avatar-selector__image {
}
.avatar-selector__name {
}
.profile-edit-form__actions {
}
.profile-edit-form__cancel-button {
}
.profile-edit-form__submit-button {
}
```

---

## 12. 카카오 주소검색

카카오 최초 가입 후 추가 정보 입력, 마이페이지 프로필 수정, 배송지 입력에 재사용한다.

```js
{
  zonecode: "",
  roadAddress: "",
  jibunAddress: "",
  detailAddress: "",
  extraAddress: ""
}
```

- 우편번호와 기본 주소는 `readOnly`로 설정한다.
- `주소 검색` 버튼으로 우편번호 검색 창을 연다.
- 선택 완료 후 상세 주소 입력란으로 포커스를 이동한다.
- 스크립트는 한 번만 로드한다.
- 로드 실패, 네트워크 오류, 팝업 차단 상태를 안내한다.

공통 파일:

```text
src/components/common/AddressSearch.jsx
src/hooks/useKakaoPostcode.js
src/services/kakaoPostcode.js
```

---

## 13. 좋아요·최근 본 상품·장바구니

### 상품 좋아요

- 상품 좋아요는 `useWishlistStore`로 관리한다.
- 좋아요 메뉴를 Header에 표시하지 않는다.
- `/wishlist` 독립 페이지를 만들지 않는다.
- 로그인 사용자의 마이페이지 안에서 좋아요 리스트를 출력한다.
- 상품 카드, 상품 상세, 검색, 추천 상품에서 같은 좋아요 상태를 사용한다.
- 마이페이지에서 하트를 해제하면 모든 화면에 즉시 반영한다.
- 비로그인 사용자가 하트를 누르면 로그인 안내를 표시한다.
- 로그인 완료 후 처음 하트를 누른 상품 화면으로 돌아갈 수 있도록 경로를 저장한다.
- 좋아요 데이터는 사용자 ID별로 구분하고 Zustand persist로 유지한다.

### 최근 본 상품

- 최근 본 상품은 `useRecentlyViewedStore`로 관리한다.
- 로그인 사용자가 상품 상세 페이지에 들어가면 `addRecentlyViewed()`를 실행한다.
- 상품 ID가 이미 있으면 기존 항목을 제거한 후 목록 맨 앞에 추가한다.
- 최근 본 상품은 최대 10개까지 저장한다.
- `removeRecentlyViewed()`로 개별 기록을 삭제한다.
- `clearRecentlyViewed()`로 전체 기록을 삭제한다.
- 사용자 ID별로 기록을 분리한다.
- 상품 전체 객체를 반복 저장하지 않고 상품 ID와 조회 시간을 저장한다.
- 화면에서는 ID를 기준으로 최신 상품 데이터를 조회해 출력한다.

```js
{
  recentlyViewedByUser: {
    "test-user-001": [
      {
        productId: 1,
        viewedAt: "2026-09-17T12:00:00.000Z"
      }
    ]
  },
  addRecentlyViewed: () => {},
  removeRecentlyViewed: () => {},
  clearRecentlyViewed: () => {},
  getRecentlyViewed: () => {}
}
```

### 장바구니

- 장바구니는 `useCartStore`로 관리한다.
- 장바구니 개수만 Header 배지로 표시한다.
- Zustand persist로 새로고침 후에도 유지한다.

### 공통 빈 상태

좋아요 상품 또는 최근 본 상품이 없으면 설명과 컬렉션 이동 버튼을 표시한다.

---

## 14. 게시판

카테고리:

- NOTICE
- STYLE
- REVIEW
- Q&A

주요 기능:

- 목록, 상세, 작성, 수정, 삭제
- 제목 검색, 카테고리 필터
- 최신순, 조회순, 좋아요순 정렬
- 페이지네이션
- 게시글 좋아요
- 작성자만 수정·삭제 가능
- 삭제 전 확인 모달
- 모바일 목록은 표가 아니라 카드 레이아웃
- 기본 게시글 최소 10개
- `useBoardStore`와 localStorage 사용

게시글 작성·수정 유효성:

- 카테고리 필수
- 제목 2자 이상 100자 이하
- 내용 10자 이상

---

## 15. 고객문의 CRUD

고객문의는 로그인한 사용자가 문의를 등록하고 자신의 처리 현황을 확인하는 1:1 문의 기능으로 구현한다. 초기 프로젝트에서는 Zustand와 localStorage를 사용하며, 실제 서비스 전환 시 서버 데이터베이스와 인증 기반 API로 교체한다.

### 문의 카테고리

- PRODUCT: 상품 문의
- DELIVERY: 배송 문의
- RETURN: 교환·반품 문의
- ACCOUNT: 회원정보 문의
- ETC: 기타 문의

### 문의 상태

```text
PENDING    접수 완료
IN_REVIEW  확인 중
ANSWERED   답변 완료
```

상태는 사용자가 직접 변경할 수 없다. 데모 데이터에는 상태별 예시 문의를 포함하고, 실제 서비스에서는 관리자만 변경한다.

### 목록 조회 — Read

`/inquiries`에는 현재 로그인 사용자가 작성한 문의만 표시한다.

- 문의 번호
- 카테고리
- 제목
- 문의 상태
- 작성일
- 최종 수정일
- 상세 보기
- 새 문의 작성 버튼
- 상태 필터
- 제목 검색
- 최신순 정렬
- 페이지네이션

모바일에서는 표를 카드 레이아웃으로 변경한다. 문의가 없으면 다음 빈 상태를 표시한다.

```text
등록한 고객문의가 없습니다.
궁금한 내용을 문의해 주세요.

[문의 작성하기]
```

### 문의 작성 — Create

`/inquiries/write`에서 다음 정보를 입력한다.

- 문의 카테고리
- 제목
- 문의 내용
- 주문번호(선택)
- 첨부 이미지(선택, 최대 3개)
- 답변 알림 수신 동의

유효성 검사:

- 카테고리는 필수다.
- 제목은 2자 이상 100자 이하로 작성한다.
- 내용은 10자 이상 2,000자 이하로 작성한다.
- 주문번호를 입력한 경우 허용된 형식을 검사한다.
- 첨부 파일은 JPEG, PNG, WebP만 허용한다.
- 첨부 파일은 개별 5MB 이하, 최대 3개로 제한한다.
- 오류는 각 입력 요소 아래에 안내한다.
- 등록 완료 후 생성된 문의 상세 페이지로 이동하고 성공 토스트를 표시한다.

데모에서는 첨부 파일의 미리보기만 제공한다. 실제 문의 이미지나 개인정보가 포함된 파일을 localStorage에 저장하지 않는다.

### 문의 상세 — Read

`/inquiries/:inquiryId`에 다음 정보를 표시한다.

- 카테고리와 문의 상태
- 제목과 문의 내용
- 주문번호
- 첨부 이미지 미리보기
- 작성일과 수정일
- 고객센터 답변
- 답변 등록일
- 목록으로 이동
- 문의 수정 버튼
- 문의 삭제 버튼

작성자가 아닌 사용자가 URL로 직접 접근하면 권한 없음 화면을 표시하거나 `/inquiries`로 이동시킨다.

### 문의 수정 — Update

- 작성자만 자신의 문의를 수정할 수 있다.
- `PENDING`, `IN_REVIEW` 상태의 문의만 수정할 수 있다.
- 기존 값을 폼의 초기값으로 표시한다.
- 작성 화면과 같은 유효성 검사를 적용한다.
- 수정 시 `updatedAt`을 갱신한다.
- 수정 완료 후 문의 상세 페이지로 이동한다.
- `ANSWERED` 상태에서는 수정 버튼을 숨기고 `답변 완료 문의는 수정할 수 없습니다.`를 표시한다.

### 문의 삭제 — Delete

- 작성자만 자신의 문의를 삭제할 수 있다.
- `PENDING` 상태에서만 삭제할 수 있다.
- 삭제 버튼을 누르면 확인 모달을 표시한다.

```text
고객문의를 삭제하시겠습니까?
삭제한 문의는 복구할 수 없습니다.

[취소] [삭제]
```

- 삭제 완료 후 `/inquiries`로 이동하고 성공 토스트를 표시한다.
- `IN_REVIEW`, `ANSWERED` 상태에서는 삭제 버튼을 숨기고 고객센터 안내를 표시한다.
- 실제 서비스에서는 감사 기록과 분쟁 대응 정책에 따라 소프트 삭제를 적용한다.

### 고객센터 답변 표시

답변이 없으면 다음 문구를 표시한다.

```text
문의 내용을 확인하고 있습니다.
답변이 등록되면 이 화면에서 확인할 수 있습니다.
```

답변이 있으면 답변 내용, 담당 부서, 답변 등록일을 표시한다. 고객 화면에는 답변 작성 기능을 제공하지 않는다.

### 데이터 구조

`src/data/inquiries.js`에 테스트용 문의를 상태별로 최소 3개 작성한다.

```js
{
  id: "inquiry-001",
  userId: "test-user-001",
  category: "DELIVERY",
  title: "배송 예정일을 확인하고 싶습니다.",
  content: "주문한 상품의 배송 예정일을 알려주세요.",
  orderNumber: "ZR-20260917-001",
  attachments: [],
  status: "PENDING",
  answerNotification: true,
  answer: null,
  answeredBy: null,
  answeredAt: null,
  createdAt: "2026-09-17T10:00:00.000Z",
  updatedAt: null
}
```

### 상태 관리

`src/store/useInquiryStore.js`

```js
{
  inquiries: [],
  addInquiry: () => {},
  updateInquiry: () => {},
  deleteInquiry: () => {},
  getInquiryById: () => {},
  getMyInquiries: () => {},
  canEditInquiry: () => {},
  canDeleteInquiry: () => {}
}
```

- Zustand `persist`를 사용한다.
- 상태 변경 전 현재 로그인 사용자가 작성자인지 다시 검사한다.
- 컴포넌트에서 배열을 직접 수정하지 않는다.
- ID는 배열 index가 아니라 충돌하지 않는 고유값을 사용한다.
- 삭제 후 상세 URL에 다시 접근하면 404 또는 문의 없음 화면을 표시한다.

### 고객문의 컴포넌트

```text
src/components/inquiry/InquiryList.jsx
src/components/inquiry/InquiryCard.jsx
src/components/inquiry/InquiryFilter.jsx
src/components/inquiry/InquiryForm.jsx
src/components/inquiry/InquiryStatusBadge.jsx
src/components/inquiry/InquiryAnswer.jsx
src/components/inquiry/InquiryDeleteModal.jsx
src/pages/inquiry/InquiryListPage.jsx
src/pages/inquiry/InquiryWritePage.jsx
src/pages/inquiry/InquiryDetailPage.jsx
src/pages/inquiry/InquiryEditPage.jsx
```

### BEM 클래스

```css
.inquiry-list {
}
.inquiry-list__toolbar {
}
.inquiry-list__empty {
}
.inquiry-card {
}
.inquiry-card__category {
}
.inquiry-card__title {
}
.inquiry-card__meta {
}
.inquiry-status {
}
.inquiry-status--pending {
}
.inquiry-status--in-review {
}
.inquiry-status--answered {
}
.inquiry-form {
}
.inquiry-form__field {
}
.inquiry-form__error {
}
.inquiry-detail {
}
.inquiry-detail__answer {
}
.inquiry-delete-modal {
}
```

### 개인정보 및 보안

- 문의 데이터는 작성자 본인만 조회할 수 있다.
- 화면에서 숨기는 것만으로 권한 처리를 끝내지 않고 Store 함수에서도 작성자 ID를 확인한다.
- 실제 서버 연동 시 모든 CRUD API에서 인증과 리소스 소유권을 검증한다.
- 문의 내용, 주문번호, 주소, 연락처를 콘솔에 출력하지 않는다.
- 문의 내용에 HTML 문자열을 직접 삽입하지 않는다.
- 실제 서비스에서는 문의 데이터와 첨부 파일을 localStorage에 저장하지 않는다.

---

## 16. 권장 폴더 구조

```text
src/
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.jsx
│   │   ├── ProtectedRoute.css
│   │   ├── KakaoLoginButton.jsx
│   │   ├── KakaoLoginButton.css
│   │   ├── TestLoginButton.jsx
│   │   └── TestLoginButton.css
│   ├── board/
│   │   ├── BoardList.jsx
│   │   ├── BoardList.css
│   │   ├── BoardForm.jsx
│   │   └── BoardForm.css
│   ├── common/
│   │   ├── AddressSearch.jsx
│   │   ├── AddressSearch.css
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   ├── EmptyState.jsx
│   │   └── EmptyState.css
│   ├── inquiry/
│   │   ├── InquiryList.jsx
│   │   ├── InquiryList.css
│   │   ├── InquiryCard.jsx
│   │   ├── InquiryCard.css
│   │   ├── InquiryForm.jsx
│   │   ├── InquiryForm.css
│   │   ├── InquiryStatusBadge.jsx
│   │   ├── InquiryStatusBadge.css
│   │   ├── InquiryDeleteModal.jsx
│   │   └── InquiryDeleteModal.css
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── mypage/
│   │   ├── MyPageProfile.jsx
│   │   ├── MyPageProfile.css
│   │   ├── ProfileEditForm.jsx
│   │   ├── ProfileEditForm.css
│   │   ├── ProfileImageEditor.jsx
│   │   ├── ProfileImageEditor.css
│   │   ├── AvatarSelector.jsx
│   │   ├── AvatarSelector.css
│   │   ├── MyPageProductSection.jsx
│   │   ├── MyPageProductSection.css
│   │   ├── RecentlyViewedList.jsx
│   │   ├── RecentlyViewedList.css
│   │   ├── LikedProductList.jsx
│   │   └── LikedProductList.css
│   └── product/
│       ├── ProductCard.jsx
│       ├── ProductCard.css
│       ├── ProductList.jsx
│       └── ProductList.css
├── data/
│   ├── products.js
│   ├── posts.js
│   ├── inquiries.js
│   ├── profileAvatars.js
│   └── testUser.js
├── hooks/
│   ├── useKakaoPostcode.js
│   ├── useProducts.js
│   └── useImageFallback.js
├── pages/
│   ├── home/
│   │   ├── HomePage.jsx
│   │   └── HomePage.css
│   ├── auth/
│   │   ├── LoginPage.jsx
│   │   ├── LoginPage.css
│   │   ├── SignUpPage.jsx
│   │   └── SignUpPage.css
│   ├── board/
│   │   ├── BoardListPage.jsx
│   │   ├── BoardListPage.css
│   │   ├── BoardDetailPage.jsx
│   │   └── BoardDetailPage.css
│   ├── inquiry/
│   │   ├── InquiryListPage.jsx
│   │   ├── InquiryListPage.css
│   │   ├── InquiryDetailPage.jsx
│   │   └── InquiryDetailPage.css
│   ├── mypage/
│   │   ├── MyPage.jsx
│   │   ├── MyPage.css
│   │   ├── ProfileEditPage.jsx
│   │   └── ProfileEditPage.css
│   └── product/
│       ├── CollectionPage.jsx
│       ├── CollectionPage.css
│       ├── ProductDetailPage.jsx
│       └── ProductDetailPage.css
├── routes/
│   └── routePaths.js
├── services/
│   ├── authService.js
│   ├── kakaoAuth.js
│   ├── kakaoPostcode.js
│   ├── productService.js
│   ├── boardService.js
│   └── inquiryService.js
├── store/
│   ├── useAuthStore.js
│   ├── useBoardStore.js
│   ├── useCartStore.js
│   ├── useInquiryStore.js
│   ├── useRecentlyViewedStore.js
│   └── useWishlistStore.js
├── styles/
│   ├── reset.css
│   ├── variables.css
│   ├── fonts.css
│   └── global.css
├── utils/
├── App.jsx
└── main.jsx

public/
└── images/
    ├── products/
    │   ├── jacket-01.webp
    │   └── pants-01.webp
    ├── banners/
    │   └── hero-01.webp
    ├── characters/
    │   ├── character-01.webp
    │   ├── character-02.webp
    │   ├── character-03.webp
    │   ├── character-04.webp
    │   ├── character-05.webp
    │   └── character-06.webp
    ├── placeholders/
    │   └── product-fallback.webp
    └── common/
        └── logo-symbol.svg
```

### CSS 배치 규칙

컴포넌트와 페이지의 CSS는 사용하는 파일 옆에 배치하고 JSX 파일에서 직접 import한다.

```jsx
// src/components/product/ProductCard.jsx
import './ProductCard.css';
```

```jsx
// src/pages/mypage/MyPage.jsx
import './MyPage.css';
```

`src/styles`의 역할은 전역 공통 스타일로 제한한다.

| 파일            | 역할                                              |
| --------------- | ------------------------------------------------- |
| `reset.css`     | 브라우저 기본 스타일 초기화                       |
| `variables.css` | 색상·간격·타이포·레이어 디자인 토큰               |
| `fonts.css`     | Pretendard 폰트 연결                              |
| `global.css`    | body, 공통 컨테이너, 접근성 유틸리티 등 전역 규칙 |

특정 페이지 레이아웃, 카드, 마이페이지, 게시판, 고객문의 전용 스타일은 `global.css`에 작성하지 않는다.

공통화가 필요한 UI는 CSS만 전역으로 이동하지 않고 공통 컴포넌트와 해당 CSS를 `components/common`에 함께 만든다.

---

## 17. 반응형 기준

- 기본: 0px 이상, 모바일 퍼스트
- 태블릿: 768px 이상
- 데스크톱: 1024px 이상
- 와이드: 1440px 이상

모바일 프로필 캐릭터 목록은 3열, 태블릿 이상은 6열을 기본으로 한다. 터치 영역은 최소 44×44px를 확보한다.

---

## 18. 접근성

- 문서 언어를 한국어로 설정한다.
- 모든 이미지에 의미에 맞는 `alt`를 제공한다.
- 장식 이미지는 빈 `alt`를 사용한다.
- 폼 입력에는 연결된 `label`을 제공한다.
- 오류 메시지는 입력 요소와 연결한다.
- 색상만으로 선택 상태를 표현하지 않는다.
- 모달의 초점 이동과 ESC 닫기를 지원한다.
- `prefers-reduced-motion` 사용자는 과도한 모션을 줄인다.
- 프로필 캐릭터의 이름을 스크린 리더가 읽을 수 있어야 한다.

---

## 19. SEO 및 문서 정보

`index.html`에 다음 내용을 설정한다.

- `<html lang="ko">`
- 프로젝트 제목과 설명
- viewport
- theme-color
- favicon
- 기본 Open Graph 정보

제목 예시:

```text
Touslesjours Renewal — Editorial Fashion Experience
```

---

## 20. README 필수 내용

- 프로젝트 소개와 목적
- 주요 기능
- 기술 스택
- 폴더 구조
- 설치·실행·빌드 방법
- 테스트 로그인 사용 방법
- 아이디·비밀번호 로그인 사용 방법과 공개 데모 계정
- 회원가입 입력 항목, 가입·취소 동작, 데모 계정의 메모리 저장 및 초기화 기준
- 카카오 로그인 설정 방법과 서버 필요 범위
- 카카오 주소검색 설정
- 고객문의 CRUD와 상태·권한 정책
- 헤더에서 좋아요 메뉴를 제외하는 기준
- 마이페이지 최근 본 상품과 좋아요 상품 구성
- `useRecentlyViewedStore` 저장·삭제·최대 개수 기준
- 상태 관리 구조
- 반응형 기준
- GSAP과 Swiper 사용 위치
- 상품·캐릭터 이미지 교체 방법
- Touslesjours 공식 사이트 상품·캠페인 이미지의 원본 페이지 URL과 사용 위치
- `public/images` 폴더별 이미지 관리 방법
- 가상 데이터에서 API 데이터로 전환하는 방법
- 컴포넌트·페이지 CSS 인접 배치 규칙
- `src/styles`에 작성할 전역 공통 스타일 범위
- 프로필 사진 저장 방식과 데모 제약
- 팀 협업 규칙
- 추후 개선 사항

---

## 21. 완료 체크리스트

### 프로젝트 기본

- [ ] React + Vite + JavaScript 프로젝트가 생성되었다.
- [ ] React Router 이동과 새로고침이 정상 작동한다.
- [ ] Pretendard Variable과 reset.css가 적용되었다.
- [ ] 모든 CSS가 BEM 규칙을 따른다.
- [ ] 모바일 퍼스트 반응형이 구현되었다.
- [ ] 상품·배너·캐릭터 이미지가 `public/images`의 해당 폴더에 저장되었다.
- [ ] 상품·컬렉션·히어로·배너에 Touslesjours 공식 사이트 이미지를 사용하고 출처를 기록했다.
- [ ] 이미지 경로가 `/images/...` 형식으로 작성되었다.
- [ ] 가상 데이터와 API 응답이 같은 이미지 필드 구조를 사용한다.
- [ ] UI 컴포넌트가 가상 데이터를 직접 import하지 않고 service를 통해 전달받는다.
- [ ] 컴포넌트 전용 CSS가 해당 컴포넌트 폴더에 있다.
- [ ] 페이지 전용 CSS가 해당 페이지 폴더에 있다.
- [ ] `src/styles`에는 전역 공통 스타일만 있다.
- [ ] 콘솔 오류와 경고가 없다.

### 로그인 및 회원가입

- [ ] 아이디·비밀번호 입력 필드와 일반 로그인 버튼이 표시된다.
- [ ] 일반 로그인의 필수 입력 검사, 성공 이동, 실패 안내가 동작한다.
- [ ] 헤더와 로그인 화면에서 `/signup` 회원가입 화면으로 이동할 수 있다.
- [ ] 회원가입 화면에 아이디·비밀번호·이름 입력란과 카카오 로그인·가입·취소 버튼이 표시된다.
- [ ] 가입 시 필수 입력과 아이디 중복을 검사하고 오류를 안내한다.
- [ ] 가입 성공 후 로그인 화면으로 이동하며 가입한 계정으로 로그인할 수 있다.
- [ ] 회원가입의 카카오 로그인 버튼이 일반 입력 필드와 독립적으로 동작한다.
- [ ] 취소 시 입력 내용을 저장하지 않고 로그인 화면으로 이동한다.
- [ ] 최초 카카오 로그인 시 가입 처리되고, 이후 동일 계정으로 로그인된다.
- [ ] 카카오 로그인 버튼과 콜백 경로가 구현되었다.
- [ ] 카카오 키가 없어도 앱이 중단되지 않는다.
- [ ] 로그인 화면에 `테스트 계정으로 로그인` 버튼이 표시된다.
- [ ] 테스트 버튼만 눌러 즉시 마이페이지에 들어갈 수 있다.
- [ ] 테스트 로그인 상태가 새로고침 후 유지된다.
- [ ] 로그아웃이 정상 작동한다.

### 마이페이지 및 프로필

- [ ] 마이페이지에 사용자 정보와 활동 요약이 표시된다.
- [ ] Header에 좋아요 메뉴와 좋아요 개수 배지가 표시되지 않는다.
- [ ] 로그인 후 마이페이지에 최근 본 상품 리스트가 표시된다.
- [ ] 로그인 후 마이페이지에 좋아요 상품 리스트가 표시된다.
- [ ] `/wishlist`와 `/mypage/likes` 독립 페이지를 사용하지 않는다.
- [ ] 최근 본 상품이 최신순으로 표시된다.
- [ ] 동일 상품을 다시 보면 중복 없이 목록 맨 앞으로 이동한다.
- [ ] 최근 본 상품이 최대 10개로 제한된다.
- [ ] 최근 본 상품을 개별 삭제하거나 전체 삭제할 수 있다.
- [ ] 최근 본 상품과 좋아요 상품이 사용자별로 구분된다.
- [ ] 최근 본 상품과 좋아요 상품의 빈 상태가 구현되었다.
- [ ] `프로필 수정` 버튼으로 수정 화면에 이동한다.
- [ ] 사진 선택 후 미리보기가 표시된다.
- [ ] 허용 형식과 5MB 용량 제한을 검사한다.
- [ ] 6개의 기본 캐릭터가 표시된다.
- [ ] 캐릭터를 키보드로 선택할 수 있다.
- [ ] 선택한 캐릭터에 시각적 표시와 `aria-pressed`가 적용된다.
- [ ] 사진과 캐릭터 선택이 서로 충돌하지 않는다.
- [ ] 저장 후 마이페이지와 헤더 이미지가 즉시 변경된다.
- [ ] 새로고침 후에도 프로필 이미지가 유지된다.
- [ ] 취소 시 변경 내용이 저장되지 않는다.
- [ ] 사진 삭제 시 기본 캐릭터가 표시된다.
- [ ] 카카오 주소검색이 회원정보 수정 화면에서 작동한다.

### 상품·게시판

- [ ] 검색, 좋아요, 장바구니가 작동한다.
- [ ] 비로그인 사용자가 좋아요를 누르면 로그인 안내가 표시된다.
- [ ] 좋아요·최근 본 상품·장바구니가 새로고침 후 유지된다.
- [ ] 게시글 검색, 필터, 정렬, 페이지네이션이 작동한다.
- [ ] 로그인 사용자가 글을 작성할 수 있다.
- [ ] 작성자만 자신의 글을 수정·삭제할 수 있다.
- [ ] 모바일 게시판이 카드 레이아웃으로 표시된다.

### 고객문의 CRUD

- [ ] 로그인 사용자만 고객문의 페이지에 접근할 수 있다.
- [ ] 테스트 로그인으로 문의를 작성할 수 있다.
- [ ] 문의 작성 후 상세 페이지로 이동한다.
- [ ] 내 문의만 목록과 상세 화면에서 조회할 수 있다.
- [ ] 제목 검색, 상태 필터, 정렬, 페이지네이션이 작동한다.
- [ ] `PENDING`, `IN_REVIEW` 문의를 작성자가 수정할 수 있다.
- [ ] `ANSWERED` 문의는 수정할 수 없다.
- [ ] `PENDING` 문의만 작성자가 삭제할 수 있다.
- [ ] 삭제 전 확인 모달이 표시된다.
- [ ] 작성자가 아닌 사용자는 조회·수정·삭제할 수 없다.
- [ ] 문의 상태와 고객센터 답변이 올바르게 표시된다.
- [ ] 빈 목록과 존재하지 않는 문의 상태가 구현되었다.
- [ ] 모바일에서 문의 목록이 카드 형태로 표시된다.
- [ ] 문의 CRUD 결과가 새로고침 후에도 유지된다.

### 최종 검증

- [ ] 접근성 기본 검사를 통과한다.
- [ ] 빈 화면과 오류 상태가 구현되었다.
- [ ] `npm run lint`가 성공한다.
- [ ] `npm run build`가 성공한다.
- [ ] README가 작성되었다.

---

## 22. 작업 완료 보고 형식

```text
프로젝트 생성 완료

프로젝트명:
프로젝트 경로:
개발 서버 주소:

구현된 페이지:
구현된 주요 기능:
테스트 로그인 확인 결과:
프로필 사진·캐릭터 변경 확인 결과:
카카오 주소검색 확인 결과:
고객문의 CRUD 확인 결과:
반응형 확인 결과:
접근성 확인 결과:
ESLint 결과:
프로덕션 빌드 결과:

실행 명령:
cd Touslesjours-renewal
npm install
npm run dev
```

개발 서버가 정상 실행되고 프로덕션 빌드가 성공한 상태에서 작업을 완료한다.

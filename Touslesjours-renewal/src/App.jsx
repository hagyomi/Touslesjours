import {useEffect,lazy,Suspense} from 'react';
import {createBrowserRouter,RouterProvider,Outlet,Navigate,useLocation,useRouteError} from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import {Toast,Loading,EmptyState} from './components/common/UI';
import ProtectedRoute from './components/auth/ProtectedRoute';
import {paths} from './routes/routePaths';
import Home from './pages/Home/Home';
const Menu=lazy(()=>import('./pages/Menu/Menu'));
const Store=lazy(()=>import('./pages/Store/Store'));
const Search=lazy(()=>import('./pages/Search/Search'));
const Membership=lazy(()=>import('./pages/Membership/Membership'));
const Login=lazy(()=>import('./pages/Login/Login'));
const SignUp=lazy(()=>import('./pages/SignUp/SignUp'));
const ProductDetail=lazy(()=>import('./pages/ProductDetail/ProductDetail'));
const Cart=lazy(()=>import('./pages/Cart/Cart'));
const MyPage=lazy(()=>import('./pages/MyPage/MyPage'));
const Profile=lazy(()=>import('./pages/MyPage/Profile'));
const MyPosts=lazy(()=>import('./pages/MyPage/MyPosts'));
const Board=lazy(()=>import('./pages/Board/Board'));
const Inquiry=lazy(()=>import('./pages/Inquiry/Inquiry'));
const AuthCallback=lazy(()=>import('./pages/AuthCallback/AuthCallback'));
function Layout(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0);document.title='TOUS les JOURS · '+({'/':'매일 새로운 기쁨','/menu':'메뉴','/store':'매장찾기','/search':'통합검색','/login':'로그인','/signup':'회원가입','/membership':'멤버십','/mypage':'마이페이지','/board':'소식 & 커뮤니티','/inquiries':'고객문의'}[pathname]||'매일의 베이커리');},[pathname]);return <><a className="skip-link" href="#main">본문 바로가기</a><Header/><main id="main" tabIndex="-1"><Suspense fallback={<Loading/>}><Outlet/></Suspense></main><Footer/><Toast/></>;}
function RouteError(){const error=useRouteError();return <EmptyState title="화면을 불러오지 못했습니다." description={error?.status===404?'존재하지 않는 페이지입니다.':'새로고침 후 다시 시도해 주세요.'} to="/" action="홈으로"/>;}
const protectedPage=element=><ProtectedRoute>{element}</ProtectedRoute>;
const guestPage=element=><ProtectedRoute guest>{element}</ProtectedRoute>;
const router=createBrowserRouter([{element:<Layout/>,errorElement:<RouteError/>,children:[
 {path:paths.home,element:<Home/>},{path:paths.menu,element:<Menu/>},{path:'/collections',element:<Navigate to={paths.menu} replace/>},
 {path:paths.store,element:<Store/>},{path:paths.search,element:<Search/>},{path:paths.membership,element:<Membership/>},
 {path:paths.login,element:guestPage(<Login/>)},{path:paths.signup,element:guestPage(<SignUp/>)},
 {path:'/products/:productId',element:<ProductDetail/>},{path:paths.cart,element:<Cart/>},
 {path:paths.mypage,element:protectedPage(<MyPage/>)},{path:paths.profile,element:protectedPage(<Profile/>)},{path:paths.myposts,element:protectedPage(<MyPosts/>)},
 {path:paths.board,element:<Board/>},{path:paths.board+'/write',element:protectedPage(<Board mode="write"/>)},
 {path:paths.board+'/:postId',element:<Board mode="detail"/>},{path:paths.board+'/:postId/edit',element:protectedPage(<Board mode="edit"/>)},
 {path:paths.inquiries,element:protectedPage(<Inquiry/>)},{path:paths.inquiries+'/write',element:protectedPage(<Inquiry mode="write"/>)},
 {path:paths.inquiries+'/:inquiryId',element:protectedPage(<Inquiry mode="detail"/>)},{path:paths.inquiries+'/:inquiryId/edit',element:protectedPage(<Inquiry mode="edit"/>)},
 {path:paths.kakao,element:<AuthCallback/>},{path:paths.authError,element:<EmptyState title="인증을 완료하지 못했습니다." to="/login" action="다시 로그인"/>},
 {path:'*',element:<EmptyState title="페이지를 찾을 수 없습니다." description="주소를 확인하거나 홈으로 이동해 주세요." to="/" action="홈으로"/>}
]}]);
export default function App(){return <RouterProvider router={router}/>;}

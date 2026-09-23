import {API_BASE,request} from './api';
export async function startKakaoLogin(returnTo='/mypage'){
 if(!API_BASE||import.meta.env.VITE_ENABLE_KAKAO_LOGIN!=='true')throw Error('카카오 로그인 서버가 연결되지 않았습니다. 테스트 로그인을 이용해 주세요.');
 // 서버가 state 생성·세션 저장·인가 URL 생성과 허용된 returnTo 검증을 담당한다.
 const {url}=await request('/auth/kakao/start',{method:'POST',body:JSON.stringify({returnTo,redirectUri:import.meta.env.VITE_KAKAO_REDIRECT_URI})});
 const target=new URL(url);if(target.origin!=='https://kauth.kakao.com')throw Error('올바르지 않은 인증 주소입니다.');
 window.location.assign(url);
}
export async function finishKakaoLogin(search){
 const params=new URLSearchParams(search);
 if(params.get('error')||!params.get('code')||!params.get('state'))throw Error('카카오 인증이 취소되었거나 유효하지 않습니다.');
 if(!API_BASE)throw Error('카카오 인증 서버가 연결되지 않았습니다.');
 return request('/auth/kakao/callback',{method:'POST',body:JSON.stringify({code:params.get('code'),state:params.get('state')})});
}

let loading;
export function loadPostcode(){
 if((window.kakao?.Postcode || window.daum?.Postcode))return Promise.resolve((window.kakao?.Postcode || window.daum?.Postcode));
 if(loading)return loading;
 loading=new Promise((resolve,reject)=>{
 const script=document.createElement('script');script.src='https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
 const timer=setTimeout(()=>{script.remove();loading=null;reject(Error('주소 검색 연결 시간이 초과되었습니다. 다시 시도해 주세요.'));},15000);
 script.onload=()=>{clearTimeout(timer);if((window.kakao?.Postcode || window.daum?.Postcode))resolve((window.kakao?.Postcode || window.daum?.Postcode));else {loading=null;reject(Error('주소 검색을 불러오지 못했습니다.'));}};
 script.onerror=()=>{clearTimeout(timer);script.remove();loading=null;reject(Error('주소 검색 연결에 실패했습니다. 네트워크를 확인해 주세요.'));};document.head.append(script);
 });return loading;
}

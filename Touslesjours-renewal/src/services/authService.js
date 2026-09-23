import { TEST_USER } from '../data/testUser';
import { API_BASE, request } from './api';
const accounts = new Map();
export async function signUp({username,password,name}) {
 if(API_BASE) return request('/auth/signup',{method:'POST',body:JSON.stringify({username,password,name})});
 if(username==='demo'||accounts.has(username)) throw Object.assign(new Error('이미 사용 중인 아이디입니다.'),{field:'username'});
 accounts.set(username,{password,user:{...TEST_USER,id:crypto.randomUUID(),name,email:'',loginProvider:'credentials',address:{zonecode:'',roadAddress:'',jibunAddress:'',detailAddress:'',extraAddress:''}}});
}
export async function loginWithCredentials(username,password) {
 if(API_BASE) return request('/auth/login',{method:'POST',body:JSON.stringify({username,password})});
 if(username==='demo'&&password==='Touslesjours-demo-1234') return {...TEST_USER,loginProvider:'credentials'};
 const account=accounts.get(username);
 if(account?.password===password) return account.user;
 throw new Error('아이디 또는 비밀번호를 확인해 주세요.');
}
export const getTestUser = () => structuredClone(TEST_USER);
export async function logoutSession(){if(API_BASE) await request('/auth/logout',{method:'POST'});}


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as auth from '../services/authService';
export const useAuthStore = create(persist((set,get)=>({
 user:null, isAuthenticated:false, authProvider:null, profiles:{},
 acceptUser:(user)=>{const saved=get().profiles[user.id];set({user:{...user,...saved},isAuthenticated:true,authProvider:user.loginProvider});},
 loginAsTestUser:()=>get().acceptUser(auth.getTestUser()),
 loginWithCredentials:async(u,p)=>get().acceptUser(await auth.loginWithCredentials(u,p)),
 updateProfile:(patch)=>{const current=get().user;if(!current) throw Error('로그인이 필요합니다.');const allowed={name:patch.name,email:patch.email,profileImage:patch.profileImage,profileImageType:patch.profileImageType,selectedAvatarId:patch.selectedAvatarId,interests:patch.interests,address:patch.address,marketing:patch.marketing};const user={...current,...allowed};set({user,profiles:{...get().profiles,[user.id]:user}});},
 logout:async()=>{await auth.logoutSession();set({user:null,isAuthenticated:false,authProvider:null});}
}),{name:'tlj-auth',partialize:({user,isAuthenticated,authProvider,profiles})=>({user,isAuthenticated,authProvider,profiles})}));
export const currentUserId=()=>useAuthStore.getState().user?.id;


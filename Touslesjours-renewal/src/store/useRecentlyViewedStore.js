import {create} from 'zustand';import {persist} from 'zustand/middleware';import {currentUserId} from './useAuthStore';
export const useRecentlyViewedStore=create(persist((set)=>({byUser:{},
 add:productId=>{const id=currentUserId();if(id)set(s=>({byUser:{...s.byUser,[id]:[{productId,viewedAt:new Date().toISOString()},...(s.byUser[id]||[]).filter(p=>p.productId!==productId)].slice(0,10)}}));},
 remove:productId=>{const id=currentUserId();if(id)set(s=>({byUser:{...s.byUser,[id]:(s.byUser[id]||[]).filter(p=>p.productId!==productId)}}));},
 clear:()=>{const id=currentUserId();if(id)set(s=>({byUser:{...s.byUser,[id]:[]}}));}
}),{name:'tlj-recent'}));

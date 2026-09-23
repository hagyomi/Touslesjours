import {create} from 'zustand';
export const useToastStore=create(set=>({message:'',sequence:0,show:message=>set(s=>({message,sequence:s.sequence+1})),clear:()=>set({message:''})}));
export const notify=message=>useToastStore.getState().show(message);

import {create} from 'zustand';import {persist} from 'zustand/middleware';
export const useCartStore=create(persist((set)=>({items:[],
 add:(productId,quantity=1)=>set(s=>({items:s.items.some(i=>i.productId===productId)?s.items.map(i=>i.productId===productId?{...i,quantity:Math.min(99,i.quantity+quantity)}:i):[...s.items,{productId,quantity:Math.max(1,Math.min(99,quantity))}]})),
 update:(productId,quantity)=>set(s=>({items:s.items.map(i=>i.productId===productId?{...i,quantity:Math.max(1,Math.min(99,Number(quantity)||1))}:i)})),
 remove:productId=>set(s=>({items:s.items.filter(i=>i.productId!==productId)}))
}),{name:'tlj-cart'}));

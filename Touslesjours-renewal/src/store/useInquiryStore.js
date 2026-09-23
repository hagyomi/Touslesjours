import {create} from 'zustand';import {persist} from 'zustand/middleware';import {currentUserId} from './useAuthStore';import {initialInquiries,saveInquiryRemote,deleteInquiryRemote} from '../services/inquiryService';import {validateEntry} from '../utils/validation';
export const useInquiryStore=create(persist((set,get)=>({inquiries:initialInquiries(),
 getMine:()=>get().inquiries.filter(p=>p.userId===currentUserId()),
 getById:id=>get().inquiries.find(p=>p.id===id&&p.userId===currentUserId()),
 canEdit:id=>{const p=get().getById(id);return !!p&&['PENDING','IN_REVIEW'].includes(p.status);},
 canDelete:id=>get().getById(id)?.status==='PENDING',
 save:async(id,data)=>{const uid=currentUserId();if(!uid)throw Error('로그인이 필요합니다.');if(id&&!get().canEdit(id))throw Error('수정할 수 없는 문의입니다.');if(Object.keys(validateEntry(data,true)).length)throw Error('입력 내용을 확인해 주세요.');const safe={category:data.category,title:data.title.trim(),content:data.content.trim(),orderNumber:data.orderNumber?.trim()||'',answerNotification:!!data.answerNotification};const old=id?get().getById(id):null;const remote=await saveInquiryRemote(id,safe);const entry=remote||{...(old||{id:crypto.randomUUID(),userId:uid,status:'PENDING',answer:null,answeredBy:null,answeredAt:null,attachments:[],createdAt:new Date().toISOString()}),...safe,updatedAt:old?new Date().toISOString():null};set(s=>({inquiries:old?s.inquiries.map(p=>p.id===id?entry:p):[entry,...s.inquiries]}));return entry.id;},
 remove:async id=>{if(!get().canDelete(id))throw Error('삭제할 수 없는 문의입니다.');await deleteInquiryRemote(id);set(s=>({inquiries:s.inquiries.filter(p=>p.id!==id)}));}
}),{name:'tlj-inquiries'}));

import {inquiries} from '../data/inquiries';import {API_BASE,request} from './api';
export const initialInquiries=()=>structuredClone(inquiries);
export const saveInquiryRemote=(id,data)=>API_BASE?request(id?'/inquiries/'+id:'/inquiries',{method:id?'PATCH':'POST',body:JSON.stringify(data)}):Promise.resolve(null);
export const deleteInquiryRemote=id=>API_BASE?request('/inquiries/'+id,{method:'DELETE'}):Promise.resolve(null);


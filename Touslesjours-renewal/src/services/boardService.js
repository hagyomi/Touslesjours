import {posts} from '../data/posts';import {API_BASE,request} from './api';
export const initialPosts=()=>structuredClone(posts);
export const savePostRemote=(id,data)=>API_BASE?request(id?'/posts/'+id:'/posts',{method:id?'PATCH':'POST',body:JSON.stringify(data)}):Promise.resolve(null);
export const deletePostRemote=id=>API_BASE?request('/posts/'+id,{method:'DELETE'}):Promise.resolve(null);


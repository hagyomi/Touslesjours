import { products } from '../data/products';
import { API_BASE, request } from './api';
export const getProducts = () => API_BASE ? request('/products') : Promise.resolve(products);
export async function getProduct(id) { return (await getProducts()).find(p=>String(p.id)===String(id)); }
export const categories = ['All','Bread','Cake','Dessert','Gift'];
export const categoryNames = {All:'전체',Bread:'빵',Cake:'케이크',Dessert:'디저트',Gift:'선물'};


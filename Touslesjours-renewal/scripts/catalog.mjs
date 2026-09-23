import fs from 'node:fs/promises';
import path from 'node:path';
const get=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(url+' '+r.status);return r;};
const save=async(url,dest)=>{await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,Buffer.from(await (await get(url)).arrayBuffer()));};
const html=new TextDecoder('euc-kr').decode(await (await get('https://www.tlj.co.kr/index.asp')).arrayBuffer());
await fs.writeFile('scripts/cache/tlj.html',html);
const imgs=[...html.matchAll(/<img[^>]+src="([^"]*\/data\/product\/[^"]+)"[^>]+alt="([^"]+)"/g)];
const picked=imgs.filter(m=>!/카봇|토이스토리|핑|포차코|루피|주토피아/.test(m[2])).slice(0,30);
const products=[];
for(const [i,m] of picked.entries()){
 const url=new URL(m[1],'https://www.tlj.co.kr').href;
 const image='/images/products/product-'+(i+1)+path.extname(new URL(url).pathname);
 await save(url,'public'+image);
 const category=html.slice(m.index,m.index+1200).match(/class="txt_shape">([^<]+)</)?.[1]?.trim()||'Dessert';
 products.push({id:String(i+1),name:m[2],category,image,images:[image],price:category==='Cake'?29000+i*500:category==='Gift'?18000:3200+i*100,isNew:i<4,description:'매일의 순간에 달콤한 즐거움을 더하는 '+m[2]+'. 가까운 매장에서 만나보세요.',colors:[],sizes:['기본'],sourceUrl:'https://www.tlj.co.kr/index.asp',imageSource:url});
}
await fs.mkdir('src/data',{recursive:true});await fs.writeFile('src/data/products.js','export const products = '+JSON.stringify(products,null,2)+';\n');
await save('https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2','public/fonts/PretendardVariable.woff2');
let css='@font-face { font-family: "Pretendard Variable"; src: url("/fonts/PretendardVariable.woff2") format("woff2"); font-weight: 100 900; font-display: swap; }\n';
for (const [weight,file] of [[400,'MaruBuri-Regular'],[600,'MaruBuri-SemiBold']]){
 await save('https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/'+file+'.woff2','public/fonts/'+file+'.woff2');
 css+='@font-face { font-family: MaruBuri; src: url("/fonts/'+file+'.woff2") format("woff2"); font-weight: '+weight+'; font-display: swap; }\n';
}
const google=await (await get('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,400;1,500;1,600&family=IBM+Plex+Sans:wght@400;500&family=Inter:wght@800&display=swap')).text();
let local=google;let n=0;
for (const url of new Set([...google.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))){
 const name='font-'+(++n)+'.woff2';await save(url,'public/fonts/'+name);local=local.replaceAll(url,'/fonts/'+name);
}
await fs.writeFile('src/styles/fonts.css',css+local);
await fs.writeFile('scripts/cache/product-sources.json',JSON.stringify(products.map(({name,image,sourceUrl,imageSource})=>({name,image,sourceUrl,imageSource})),null,2));
console.log(products.length+' official product images and local fonts saved.');

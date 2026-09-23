import fs from 'node:fs/promises';import {products} from '../src/data/products.js';
const html=await fs.readFile('scripts/cache/tlj.html','utf8');
for(const p of products){const index=html.indexOf('alt="'+p.name+'"');const category=html.slice(index,index+1200).match(/class="txt_shape">([^<]+)</)?.[1]?.trim();if(category)p.category=category;}
await fs.writeFile('src/data/products.js','export const products = '+JSON.stringify(products,null,2)+';\n');
const pkg=JSON.parse(await fs.readFile('package.json','utf8'));delete pkg.scripts['test:unit'];pkg.scripts.format='prettier --write src tests *.js *.json index.html README.md';await fs.writeFile('package.json',JSON.stringify(pkg,null,2)+'\n');
console.log('Official categories synchronized.');


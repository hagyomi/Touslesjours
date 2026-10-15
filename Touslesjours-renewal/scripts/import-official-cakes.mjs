import { readFile, writeFile, mkdir } from 'node:fs/promises';
const decode = value => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const products = [];
for (const file of ['cake-source.html', ...Array.from({ length: 11 }, (_, i) => `cake-page-${i + 2}.html`)]) {
  const html = new TextDecoder('euc-kr').decode(await readFile(`scripts/${file}`));
  for (const match of html.matchAll(/<li class="item_wrap" id="p(\d+)">([\s\S]*?)<\/li>/g)) {
    const [, number, body] = match;
    if (products.some(item => item.id === `official-cake-${number}`)) continue;
    const detail = new TextDecoder('euc-kr').decode(await readFile(`scripts/cake-detail-${number}.html`));
    const name = decode(detail.match(/property="og:title" content="([^"]+)"/)[1].replace(/_신선함이 가득한 베이커리 뚜레쥬르$/, ''));
    const source = body.match(/<img src="([^"]+)"/)[1];
    const description = decode(detail.match(/property="og:description" content="([^"]+)"/)[1]);
    products.push({ id: `official-cake-${number}`, name, description: [description], image: `/images/official-cakes/${number}.${source.split('.').pop()}`, category: 'Cake', collection: 'Cake', crop: [100, 100, 0, 0], sourceImage: `https://www.tlj.co.kr${source}`, sourceUrl: `https://www.tlj.co.kr/product/detail.asp?prod_num=${number}` });
  }
}
await mkdir('public/images/official-cakes', { recursive: true });
await writeFile('scripts/official-cake-assets.json', JSON.stringify(products, null, 2));
await writeFile('scripts/official-cake-downloads.txt', products.map(item => `url = "${item.sourceImage}"\noutput = "public${item.image}"`).join('\n'));
await writeFile('src/data/officialCakes.js', '// Official cake catalog, retrieved 2026-10-15.\nexport const officialCakeProducts = ' + JSON.stringify(products.map(({ sourceImage, ...item }) => item), null, 2) + ';\n');
console.log(JSON.stringify({ count: products.length, names: products.map(item => item.name) }));

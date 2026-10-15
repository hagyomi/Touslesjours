import { readFile, writeFile, mkdir } from 'node:fs/promises';
const clean = value => value.replace(/<[^>]*>/g, '').replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const products = [];
for (const file of ['gift-source.html', 'gift-page-2.html', 'gift-page-3.html', 'gift-page-4.html']) {
  const html = new TextDecoder('euc-kr').decode(await readFile(`scripts/${file}`));
  for (const [, number, body] of html.matchAll(/<li class="item_wrap" id="p(\d+)">([\s\S]*?)<\/li>/g)) {
    if (products.some(product => product.id === `official-gift-${number}`)) continue;
    const image = body.match(/<img src="([^"]+)"[^>]*alt="([^"]+)"/);
    let name = clean(image[2]);

    let description = clean(body.match(/class="desc">([\s\S]*?)<\/span>/)?.[1] ?? '');
    try {
      const detail = new TextDecoder('euc-kr').decode(await readFile(`scripts/gift-detail-${number}.html`));
      name = clean(detail.match(/property="og:title" content="([^"]+)"/)[1].replace(/_신선함이 가득한 베이커리 뚜레쥬르$/, ''));
      description = clean(detail.match(/property="og:description" content="([^"]+)"/)[1]).split('※')[0].trim();
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    products.push({ id: `official-gift-${number}`, name, description: [description], image: `/images/official-gifts/${number}.${image[1].split('.').pop()}`, category: 'Gift', collection: 'Gift Set', crop: [100, 100, 0, 0], sourceUrl: `https://www.tlj.co.kr/product/detail.asp?prod_num=${number}`, sourceImage: `https://www.tlj.co.kr${image[1]}` });
  }
}
await mkdir('public/images/official-gifts', { recursive: true });
await writeFile('scripts/official-gift-downloads.txt', products.flatMap(product => [`url = "${product.sourceImage}"\noutput = "public${product.image}"`, `url = "${product.sourceUrl}"\noutput = "scripts/gift-detail-${product.id.replace('official-gift-', '')}.html"`]).join('\n'));
await writeFile('src/data/officialGifts.js', '// Official gift set category (ref=77, cg_num=79), retrieved 2026-10-15.\nexport const officialGiftProducts = ' + JSON.stringify(products.map(({ sourceImage, ...product }) => product), null, 2) + ';\n');
console.log(JSON.stringify({ count: products.length, names: products.map(product => product.name) }));


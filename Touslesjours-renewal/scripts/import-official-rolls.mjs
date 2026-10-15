import { readFile, writeFile, mkdir } from 'node:fs/promises';
const clean = value => value.replace(/<[^>]*>/g, '').replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const products = [];
for (const file of ['roll-source.html', 'roll-page-2.html']) {
  const html = new TextDecoder('euc-kr').decode(await readFile(`scripts/${file}`));
  for (const [, number, body] of html.matchAll(/<li class="item_wrap" id="p(\d+)">([\s\S]*?)<\/li>/g)) {
    if (products.some(product => product.id === `official-roll-${number}`)) continue;
    const image = body.match(/<img src="([^"]+)"[^>]*alt="([^"]+)"/);
    let name = clean(image[2]);
    if (!name.includes('롤케이크')) continue;
    let description = clean(body.match(/class="desc">([\s\S]*?)<\/span>/)?.[1] ?? '');
    try {
      const detail = new TextDecoder('euc-kr').decode(await readFile(`scripts/roll-detail-${number}.html`));
      name = clean(detail.match(/property="og:title" content="([^"]+)"/)[1].replace(/_신선함이 가득한 베이커리 뚜레쥬르$/, ''));
      description = clean(detail.match(/property="og:description" content="([^"]+)"/)[1]).split('※')[0].trim();
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    products.push({ id: `official-roll-${number}`, name, description: [description], image: `/images/official-rolls/${number}.${image[1].split('.').pop()}`, category: 'Gift', collection: 'Roll Cake', crop: [100, 100, 0, 0], sourceUrl: `https://www.tlj.co.kr/product/detail.asp?prod_num=${number}`, sourceImage: `https://www.tlj.co.kr${image[1]}` });
  }
}
await mkdir('public/images/official-rolls', { recursive: true });
await writeFile('scripts/official-roll-downloads.txt', products.flatMap(product => [`url = "${product.sourceImage}"\noutput = "public${product.image}"`, `url = "${product.sourceUrl}"\noutput = "scripts/roll-detail-${product.id.replace('official-roll-', '')}.html"`]).join('\n'));
await writeFile('src/data/officialRolls.js', '// Official roll cake category (ref=77, cg_num=78), retrieved 2026-10-15.\nexport const officialRollProducts = ' + JSON.stringify(products.map(({ sourceImage, ...product }) => product), null, 2) + ';\n');
console.log(JSON.stringify({ count: products.length, names: products.map(product => product.name) }));

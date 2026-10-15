import assert from 'node:assert/strict';
import { readdir, readFile, access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';

const walk = async directory => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
const exists = async file => { try { await access(file); return true; } catch { return false; } };
const files = (await walk('src')).filter(file => /\.(css|js|jsx)$/.test(file));
const report = { files: files.length, cssFiles: 0, imports: 0, localAssets: 0, errors: [], repeatedSelectors: [], identicalBlocks: [] };
const blocks = new Map();
for (const file of files) {
  const source = await readFile(file, 'utf8');
  for (const [, reference] of source.matchAll(/(?:from\s*|import\s*|@import\s*)['"](\.[^'"]+)['"]/g)) {
    report.imports++;
    const resolved = path.resolve(path.dirname(file), reference);
    if (!(await Promise.all(['', '.js', '.jsx', '.css', '/index.js', '/index.jsx'].map(suffix => exists(resolved + suffix)))).some(Boolean)) report.errors.push(`${file}: missing import ${reference}`);
  }
  for (const [, reference] of source.matchAll(/['"(](\/(?:images|fonts)\/[^'"\s)]+)['")]/g)) {
    report.localAssets++;
    if (!await exists('public' + reference)) report.errors.push(`${file}: missing asset ${reference}`);
  }
  if (!file.endsWith('.css')) continue;
  report.cssFiles++;
  const root = postcss.parse(source, { from: file });
  const selectors = new Set();
  root.walkRules(rule => {
    let context = '';
    for (let parent = rule.parent; parent.type !== 'root'; parent = parent.parent) context = `${parent.name}:${parent.params}/${context}`;
    const key = context + rule.selector;
    if (selectors.has(key)) report.repeatedSelectors.push(`${file}:${rule.source.start.line} ${key}`);
    selectors.add(key);
    const properties = new Set();
    const declarations = rule.nodes.filter(node => node.type === 'decl');
    for (const declaration of declarations) {
      if (properties.has(declaration.prop)) report.errors.push(`${file}:${declaration.source.start.line} repeated property ${declaration.prop}`);
      properties.add(declaration.prop);
    }
    if (declarations.length < 3) return;
    const signature = declarations.map(node => `${node.prop}:${node.value}`).join(';');
    const entries = blocks.get(signature) ?? [];
    entries.push(`${file}:${rule.source.start.line} ${rule.selector}`);
    blocks.set(signature, entries);
  });
}
report.identicalBlocks = [...blocks.values()].filter(entries => entries.length > 1);
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/structure-audit.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
assert.deepEqual(report.errors, [], 'Source structure audit failed');

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Pages uses /<repository>/; local development and Vercel keep the root path.
const base = process.env.VITE_BASE_PATH || '/';

const githubPagesPaths = {
  name: 'github-pages-paths',
  apply: 'build',
  enforce: 'pre',
  transform(code, id) {
    if (base === '/' || !id.includes('/src/') || !/\.[jt]sx?$/.test(id)) return null;
    // Rebase existing local image and navigation literals only in the Pages build.
    // CSS font/image URLs are handled by Vite's base option.
    const rebased = code.replace(/(['"\x60])\/(?=images\/|menu(?:\/|['"\x60])|login(?:\/|['"\x60])|#|['"\x60])/g, (_, quote) => quote + base);
    return rebased === code ? null : { code: rebased, map: null };
  },
  async closeBundle() {
    if (base === '/') return;
    const html = await readFile('dist/index.html', 'utf8');
    for (const route of ['menu', 'menu/products', 'login']) {
      const directory = path.join('dist', route);
      await mkdir(directory, { recursive: true });
      await writeFile(path.join(directory, 'index.html'), html);
    }
  },
};

export default defineConfig({
  base,
  plugins: [githubPagesPaths, react()],
  server: {
    // Use the same IPv4 loopback address as the browser verification scripts.
    host: '127.0.0.1',
    port: 5173,
    // Fail visibly on a conflict instead of leaving browser tabs on an old port.
    strictPort: true,
    watch: { ignored: ['**/artifacts/**', '**/.chrome-*/**'] },
  },
});

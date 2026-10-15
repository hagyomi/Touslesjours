import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), {
    name: 'static-page-entries',
    async closeBundle() {
      const html = await readFile('dist/index.html', 'utf8');
      for (const route of ['menu', 'menu/products', 'login']) {
        const directory = path.join('dist', route);
        await mkdir(directory, { recursive: true });
        await writeFile(path.join(directory, 'index.html'), html);
      }
    },
  }],
  server: {
    // Use the same IPv4 loopback address as the browser verification scripts.
    host: '127.0.0.1',
    port: 5173,
    // Fail visibly on a conflict instead of leaving browser tabs on an old port.
    strictPort: true,
    watch: { ignored: ['**/artifacts/**', '**/.chrome-*/**'] },
  },
});

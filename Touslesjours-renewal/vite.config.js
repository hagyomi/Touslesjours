import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Use the same IPv4 loopback address as the browser verification scripts.
    host: '127.0.0.1',
    port: 5173,
    // Fail visibly on a conflict instead of leaving browser tabs on an old port.
    strictPort: true,
    watch: { ignored: ['**/artifacts/**', '**/.chrome-*/**'] },
  },
});

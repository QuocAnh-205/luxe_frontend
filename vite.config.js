import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Dev: `npm run dev` proxy /api sang backend chạy ở cổng 5000 (giống Nginx khi chạy Docker)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: { '/api': process.env.VITE_PROXY_TARGET || 'http://localhost:5000' },
  },
});

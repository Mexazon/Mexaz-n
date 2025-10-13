import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ command }) => ({
  root: 'frontend',
  base: command === 'build' ? '/Mexaz-n/' : '/',  // base=/ in dev, /Mexaz-n/ in build
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'frontend/index.html'),
        feed: resolve(__dirname, 'frontend/feed.html'), 
        main: resolve(__dirname, 'frontend/hambre.html'),
        feed: resolve(__dirname, 'frontend/user_profile.html'),
        feed: resolve(__dirname, 'frontend/business_profile.html')// or 'frontend/pages/feed.html'
      },
    },
  },
  server: { open: true },
}));
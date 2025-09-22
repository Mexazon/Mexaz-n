import { defineConfig } from 'vite';

export default defineConfig({
  root: 'frontend',
  base: '/Mexaz-n/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: { open: true }
});

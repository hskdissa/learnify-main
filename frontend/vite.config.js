import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vitest configuration
export default defineConfig({
  server: {
    port: 5001
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'
  },
  esbuild: {
    jsx: 'automatic'
  }
});


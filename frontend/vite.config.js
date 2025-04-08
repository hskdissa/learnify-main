import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vitest configuration
export default defineConfig({
  server: {
    //changed port to avoid conflict
    port: 3000,
    // Added proxy for the backend api, so that it knows which port the backend is running on
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      }
    }
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


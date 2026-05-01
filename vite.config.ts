import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  define: {
    // Ensure environment variables are properly defined
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || ''),
  }
});

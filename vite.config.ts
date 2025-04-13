import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@ilp': path.resolve(__dirname, './src/features/ilp'),
      '@aac': path.resolve(__dirname, './src/features/aac'),
      '@games': path.resolve(__dirname, './src/features/games'),
      '@gamification': path.resolve(__dirname, './src/features/gamification'),
      '@feelings': path.resolve(__dirname, './src/features/feelings')
    }
  },
  optimizeDeps: {
    include: [
      '@hookform/resolvers/zod',
      'react-hook-inview',
      '@hello-pangea/dnd',
      'react-dropzone',
      'nanoid',
      'recharts',
      'zod'
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion', 'canvas-confetti'],
          'icons': ['lucide-react'],
          'i18n': ['i18next', 'react-i18next'],
          'web-vitals': ['web-vitals']
        }
      }
    },
    sourcemap: true,
    target: 'esnext'
  },
  server: {
    port: 5173,
    host: true
  }
});
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-ui': ['lucide-react'],
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          'vendor-ai': ['openai'],
          'vendor-security': ['dompurify', 'zod'],
          'vendor-supabase': ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    port: 3001,
    strictPort: false,
    host: true,
    proxy: {
      // Support direct calls to /consultations
      '/consultations': {
        target: 'http://localhost:8888/.netlify/functions/consultations',
        changeOrigin: true,
      },
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, ''),
      },
    },
  },
  preview: {
    port: 3001
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'chart.js',
      'react-chartjs-2',
      'openai',
      'dompurify',
      'zod',
      '@supabase/supabase-js'
    ]
  },
  test: {
    globals: true, // <- makes expect, describe, it global
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'dist']
  }
});
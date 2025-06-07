import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';



export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist/protax',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
  },
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'console.log': '()=>{}'
  }
});
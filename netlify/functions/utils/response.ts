import react from '@vitejs/plugin-react';
import { PluginOption } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/\.netlify\/functions/, ''),
      },
    },
  },
});
export const createsucessresponse = (statusCode: number, data: any) => ({
  statusCode,
  body: JSON.stringify(data)
}); 
const createErrorResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ error: message })
});

export { createErrorResponse };

function defineConfig(config: { plugins: PluginOption[]; server: { proxy: { '/.netlify/functions': { target: string; changeOrigin: boolean; rewrite: (path: string) => string; }; }; }; }) {
  return config;
}

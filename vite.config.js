import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Security plugin: strictly intercepts and blocks any client attempt to read backend files or secrets
const blockBackendAccessPlugin = () => ({
  name: 'block-backend-source-access',
  configureServer(server) {
    // Intercept all HTTP requests before Vite static/transform middleware
    server.middlewares.use((req, res, next) => {
      const rawUrl = req.url || '';
      const url = decodeURIComponent(rawUrl).toLowerCase().replace(/\\/g, '/');

      // Immediately terminate any request trying to access backend source code or environment secrets
      if (
        url.startsWith('/server') ||
        url.includes('/server/') ||
        url.includes('.env') ||
        url.endsWith('.log') ||
        url === '/server'
      ) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        return res.end('403 Forbidden: Access to backend server architecture and secrets is strictly prohibited.');
      }

      next();
    });
  },
});

export default defineConfig({
  plugins: [react(), blockBackendAccessPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    allowedHosts: true,
    fs: {
      strict: true,
      deny: [
        '**/server/**',
        '**/.env*',
      ],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // Disable source maps in production to prevent reverse-engineering source code
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});

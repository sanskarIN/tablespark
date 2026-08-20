import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const nativePlatform = process.env.TAURI_ENV_PLATFORM ?? 'web';
const nativeBuild = nativePlatform !== 'web';
const mobileDevHost = process.env.TAURI_DEV_HOST;

export default defineConfig({
  clearScreen: false,
  define: {
    __TABLESPARK_NATIVE__: JSON.stringify(nativeBuild),
    __TABLESPARK_PLATFORM__: JSON.stringify(nativePlatform),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg'],
      manifest: {
        name: 'TableSpark',
        short_name: 'TableSpark',
        description: 'Offline-first multiplication tables, drills, worksheets, and mastery tracking.',
        theme_color: '#5b5bd6',
        background_color: '#0f1020',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
    }),
  ],
  server: {
    host: mobileDevHost || false,
    port: 5173,
    strictPort: true,
    hmr: mobileDevHost
      ? {
          protocol: 'ws',
          host: mobileDevHost,
          port: 5174,
        }
      : undefined,
  },
  preview: { port: 4173, strictPort: true },
  build: { sourcemap: true, target: 'es2022' },
});

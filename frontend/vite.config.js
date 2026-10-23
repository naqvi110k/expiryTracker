import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (path) => path
        }
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      minify: 'terser',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom']
          }
        }
      }
    },
    plugins: [
      react(),
      viteCompression({ algorithm: 'brotliCompress' }),
      viteCompression({ algorithm: 'gzip' }),
      VitePWA({
        mode: 'production',
        base: '/',
        includeAssets: ['favicon.ico', 'pwa-icon.svg', 'robots.txt', 'sitemap.xml'],
        manifest: {
          name: 'Inventa - Smart Inventory Management',
          short_name: 'Inventa',
          description: 'Smart Inventory & Product Expiry Tracking',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-icon.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any'
            },
            {
              src: '/pwa-icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable'
            }
          ]
        },
        workbox: {
          // Commit 11: skipWaiting + clientsClaim — new SW activates instantly across all tabs
          clientsClaim: true,
          skipWaiting: true,
          // Commit 10: Fixed cacheId (v2) — forces replacement of old broken SW in production
          cacheId: 'inventa-v2',
          globPatterns: [
            '**/*.{js,css,html,ico,svg,png,jpg,jpeg,gif,webp,woff,woff2,eot,ttf,otf}'
          ],
          globIgnores: ['**/node_modules/**/*', '.git/**/*'],
          runtimeCaching: [
            // Commit 3: NetworkFirst for same-origin /api/ routes (your actual backend URL pattern)
            {
              urlPattern: /\/api\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'same-origin-api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 // 30 seconds — only used when offline
                }
              }
            },
            // Commit 4: Dead external api-cache rule removed (it matched https://api.* which
            // never matched this app's same-origin API calls — now deleted entirely)
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'image-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days — images don't change often
                }
              }
            },
            // Commit 2: StaleWhileRevalidate for JS/CSS (was CacheFirst 30 days — caused invisible deploys)
            {
              urlPattern: /\.(?:css|js)$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'asset-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 // 1 day — revalidates in background on every visit
                }
              }
            }
          ],
          // Commit 12: cleanupOutdatedCaches + file size guard prevent cache bloat
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024 // 10MB
        },
        devOptions: {
          enabled: false,
          navigateFallback: 'index.html',
          suppressWarnings: true
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});

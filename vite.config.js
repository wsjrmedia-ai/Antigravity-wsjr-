import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vendor chunking strategy:
 *
 * The pre-split bundle was a single 1.5 MB file that every page paid for
 * up-front. Splitting into named vendor chunks lets the browser:
 *  - cache react/three/gsap independently across deploys
 *  - load only what each page actually pulls in (combined with React.lazy
 *    routes in App.jsx)
 *
 * Keep the chunk count low — each new <script> tag adds a request and on
 * mobile India that latency matters more than the bytes saved.
 */
function manualChunks(id) {
  if (!id.includes('node_modules')) return undefined;
  if (id.includes('three') || id.includes('@react-three')) return 'three';
  if (id.includes('gsap')) return 'gsap';
  if (id.includes('framer-motion')) return 'motion';
  if (id.includes('lenis')) return 'lenis';
  if (id.includes('react-router-dom') || id.includes('@remix-run')) return 'router';
  if (id.includes('react-helmet-async') || id.includes('react-side-effect')) return 'helmet';
  if (id.includes('lucide-react')) return 'icons';
  if (id.includes('cobe')) return 'cobe';
  if (id.includes('lightweight-charts')) return 'charts';
  if (id.includes('react-ts-tradingview-widgets')) return 'tv-widgets';
  if (id.includes('react') || id.includes('scheduler')) return 'react';
  return 'vendor';
}

// Note: per-route prerendering (@prerenderer/rollup-plugin + puppeteer)
// was attempted here but Vercel's Linux build container is missing the
// shared libraries Chromium needs (libnspr4 et al.), so the build fails
// with "Failed to launch the browser process: Code 127". Removed for
// now — see Phase 4 follow-up for a jsdom-based renderer that doesn't
// need a real browser.

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: { manualChunks },
    },
  },
  server: {
    proxy: {
      // Forward all /api/* requests to the Express backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

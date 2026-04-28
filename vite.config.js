import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'

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

/**
 * Routes to prerender into static HTML at build time.
 *
 * Why prerender (Phase 4): Helmet writes meta via JS at runtime — Google
 * runs JS so it sees correct titles, but social crawlers (WhatsApp, FB,
 * LinkedIn, X) do NOT execute JS. Without prerender every shared link
 * shows the homepage OG card. Prerendering bakes per-route meta into the
 * static HTML so social previews are correct on every page.
 *
 * Skipped: /login, /signup (noindex anyway), /topstocx (separate product).
 */
const PRERENDER_ROUTES = [
  '/',
  '/programmes',
  '/school-of-finance',
  '/school-of-finance/syllabus',
  '/school-of-technology',
  '/school-of-management',
  '/school-of-design',
  '/who-we-are',
  '/enroll',
  '/blog',
  '/blog/real-financial-markets-education-2026',
  '/blog/ai-and-automation-in-finance-practical-guide',
  '/blog/multidisciplinary-education-beyond-a-single-subject',
];

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: PRERENDER_ROUTES,
      // Use puppeteer to spin up a headless Chrome and snapshot each
      // route's HTML after the SPA has rendered.
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        // Wait for Helmet + lazy chunks to settle. 2.5s is enough for
        // lazy route chunks + Helmet flush; the cost is build-time only.
        renderAfterTime: 2500,
        maxConcurrentRoutes: 4,
        skipThirdPartyRequests: false,
        headless: true,
      },
      // Helmet appends its per-route SEO meta tags AFTER the static ones
      // from index.html, so the page ends up with two of each og:title /
      // description / canonical. Keep the LAST occurrence (Helmet's) and
      // drop the static fallbacks — that gives us the correct page-
      // specific values for crawlers.
      // Note: <title> is special — Helmet replaces the element in the
      // DOM, so there's only one in the snapshot. The first-seen logic
      // works there but we use the same "keep last" pass for symmetry.
      postProcess(route) {
        // react-helmet-async (with prioritizeSeoTags) prepends <title>
        // to the head, so Helmet's title appears FIRST and the static
        // index.html title appears second. For meta tags + canonical
        // it's the opposite — Helmet appends them at the END of head,
        // after the modulepreload links.
        //
        // Browsers and crawlers honor the LAST occurrence of each. So
        // for <title> we keep FIRST (Helmet's), and for meta/canonical
        // we keep LAST (Helmet's).
        let html = route.html;

        const keepBy = (re, getKey, mode /* 'first' | 'last' */) => {
          const targets = new Map(); // key -> index to keep
          let i = 0;
          for (const m of html.matchAll(re)) {
            const key = getKey(m);
            if (mode === 'first') {
              if (!targets.has(key)) targets.set(key, i);
            } else {
              targets.set(key, i);
            }
            i += 1;
          }
          let idx = 0;
          html = html.replace(re, (full, ...rest) => {
            const m = [full, ...rest.slice(0, -2)];
            const key = getKey(m);
            const keep = targets.get(key) === idx;
            idx += 1;
            return keep ? full : '';
          });
        };

        keepBy(/<title>[^<]*<\/title>/g, () => '__title__', 'first');
        keepBy(/<meta\s+name="([^"]+)"[^>]*>/g, (m) => `n:${m[1]}`, 'last');
        keepBy(/<meta\s+property="([^"]+)"[^>]*>/g, (m) => `p:${m[1]}`, 'last');
        keepBy(/<link\s+rel="canonical"[^>]*>/g, () => '__canon__', 'last');

        route.html = html;
        return route;
      },
    }),
  ],
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

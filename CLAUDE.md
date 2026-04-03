# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend dev server (port 5173, proxies /api to :3001)
npm run dev

# Backend API server (port 3001) — run in a separate terminal
npm run server

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

There are no tests configured in this project.

## Environment Setup

Copy `.env.example` and populate required keys. The backend (`server.js`) requires:
- `PERPLEXITY_API_KEY` — for AI chat (sonar-pro model)
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — for payments
- `JWT_SECRET` — for auth tokens
- Redis URL (optional — falls back to mock in-memory store for dev)

The frontend uses `VITE_GEMINI_API_KEY` (via `@google/generative-ai`) for the client-side AI service in `src/services/aiService.js`.

## Architecture

### Two-Process Setup

The app runs as two separate processes:
- **Vite dev server** (`npm run dev`) — serves the React SPA
- **Express API server** (`npm run server`) — `server.js` at project root, handles auth/AI/payments

Vite proxies all `/api/*` requests to `localhost:3001` (configured in `vite.config.js`).

### Frontend (React + Vite)

**Routing** — `src/App.jsx` defines routes:
- `/` → `HomePage` — full-page scroll experience with stacked sections using GSAP ScrollTrigger
- `/school-of-finance` → `SchoolOfFinance`
- `/school-of-finance/syllabus` → `SyllabusPage`
- `/who-we-are` → `WhoWeArePage`
- `/topstocx` → `TopStocxPage` — trading platform UI
- `/login`, `/signup` → auth pages

**HomePage** is built from sequential section components rendered in `src/pages/HomePage.jsx`. Each section is a standalone component in `src/components/`.

**AI Chat** — There are two chat implementations: `ChatAssistant.jsx` (calls `/api/chat` backend) and `FinAIChatbot.jsx` (uses `src/services/aiService.js` directly with Gemini). The backend-powered one is the primary path for production.

**3D/Animation** — Heavy use of Three.js (`Globe3D.jsx`, `DynamicCore3D.jsx`, `ParticleSphere3D.jsx`), `cobe` (another globe lib), GSAP for scroll animations, Framer Motion for component transitions, and Lenis for smooth scrolling.

### Backend (`server.js`)

Single-file Express server with:
- **Auth**: JWT (30-day expiry), bcrypt, in-memory user store (no real DB — needs replacement for production)
- **AI Chat** (`POST /api/chat`): Enriches user messages with live Yahoo Finance + CoinGecko market data before sending to Perplexity sonar-pro. Includes greeting detection to avoid treating "HI" as a ticker symbol. Tier-based rate limiting: free=5/day, pro/ultimate=unlimited.
- **Payments** (`POST /api/payments/*`): Stripe checkout sessions and webhook handling for subscription lifecycle
- **Copy-trade feed** (`GET /api/copy-trade/feed`): Ultimate-tier only, uses mocked Redis cache

### AI System Prompts

`systemPrompts_v2.js` (project root) defines a 6-layer training framework for multiple bot personas:
- `manu` — personal/conversational assistant
- `atlas` — institutional assistant

`src/data/knowledge_base.md` documents the three platform verticals used in prompts:
1. **WSJr Investments** — portfolio advisory ($50k+ minimum)
2. **School of Finance** — 6-month FME education program
3. **Topstocx** — trading technology/execution platform

### Data

`src/data/branches.js` — Array of 6 office locations (UAE HQ, Chicago, Cochin, Bangalore, Mumbai, Delhi) with lat/lng coordinates. Used by map/globe components.

### Topstocx Sub-Platform

`src/components/topstocx/` contains a self-contained trading dashboard UI (Sidebar, TopBar, BottomPanel, TradingChart using `lightweight-charts`). Accessed via `/topstocx` route in `src/pages/TopStocxPage.jsx`.

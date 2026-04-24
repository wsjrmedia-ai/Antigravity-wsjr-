// ============================================================
// TOPSTOCKX — BACKEND API SERVER v2
// Powered by Perplexity AI (sonar-pro) — real-time finance
// Tier-gated | Gender+Age adaptive Manu | JP Morgan style
// FIXES: NaN price, greeting-as-ticker, citations
// ============================================================
// npm install express cors dotenv jsonwebtoken bcryptjs redis stripe axios

// Load env from both the root .env (for server-side keys) and the
// topstocx-platform/.env (where the VITE_*-prefixed keys live, so the
// backend can read the same Perplexity key the frontend already has).
// Order matters: root .env wins when both define the same var.
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: './topstocx-platform/.env', override: false });

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';
import axios from 'axios';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from 'redis';
import macroHandler from './topstocx-platform/api/macro.js';
import {
  getSystemPrompt,
  buildUserContext,
  createCopyTradeAlert
} from './systemPrompts_v2.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Clients
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_123');

// Mock redis for local dev without a real redis server
const redisMock = new Map();
const redis = {
  get: async (k) => redisMock.get(k) || null,
  set: async (k,v) => redisMock.set(k,v),
  setEx: async (k, ex, v) => redisMock.set(k,v),
  lPush: async (k, v) => { 
    if(!redisMock.has(k)) redisMock.set(k, []);
    redisMock.get(k).unshift(v);
  },
  lTrim: async (k, s, e) => {
    if(redisMock.has(k)) redisMock.set(k, redisMock.get(k).slice(s, e+1));
  },
  lRange: async (k, s, e) => {
    return redisMock.has(k) ? redisMock.get(k).slice(s, e+1) : [];
  },
  connect: async () => console.log('Mock Redis connected')
};
redis.connect();

// Perplexity config
// Fall back to the VITE_-prefixed key so a single source of truth in
// topstocx-platform/.env is enough to run both processes.
const PERPLEXITY_API_KEY =
  process.env.PERPLEXITY_API_KEY || process.env.VITE_PERPLEXITY_API_KEY;
if (!PERPLEXITY_API_KEY) {
  console.warn('[server] PERPLEXITY_API_KEY not set — /api/ai/analyze will fail.');
}
const PERPLEXITY_BASE    = 'https://api.perplexity.ai';

const PERPLEXITY_MODELS = {
  free:     'sonar',
  pro:      'sonar-pro',
  ultimate: 'sonar-pro',
};

// Per-session daily quota. Anon sessions identified by x-session-id
// header; logged-in users by userId. The "free" tier covers both the
// marketing chatbot AND the trading platform's auto-loading widgets
// (MarketBrief, ExplainChart, Trade ideas) — which fire on their own,
// so 5/day is far too tight. 100/day is comfortable for a full session
// without being abusable.
const TIER_LIMITS = {
  free:     { daily: 100,      maxTokens: 400  },
  pro:      { daily: Infinity, maxTokens: 2000 },
  ultimate: { daily: Infinity, maxTokens: 4000 },
};

const STRIPE_PLANS = {
  pro:      process.env.STRIPE_PRO_PRICE_ID,
  ultimate: process.env.STRIPE_ULTIMATE_PRICE_ID,
};

// ─────────────────────────────────────────────────────────────
// ANTHROPIC (CLAUDE) — powers the Supercharts AI palette.
//
// Why Claude for Supercharts: pure-reasoning intents (explain_chart,
// risk_check) are noticeably sharper; web-grounded intents
// (market_brief, why_moved, trade_idea) use Claude's server-side
// web_search tool so we keep one provider, one streaming contract,
// one key.
//
// Perplexity is kept for FinAIChatbot (homepage) where its always-on
// grounding + citations are the unique value for casual visitors.
// ─────────────────────────────────────────────────────────────
const ANTHROPIC_API_KEY =
  process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;
const ANTHROPIC_KEY_LOOKS_REAL =
  !!ANTHROPIC_API_KEY && !ANTHROPIC_API_KEY.startsWith('your_');
if (!ANTHROPIC_KEY_LOOKS_REAL) {
  console.warn(
    '[server] ANTHROPIC_API_KEY not set — Supercharts AI will fall back to Perplexity.'
  );
}
const anthropic = ANTHROPIC_KEY_LOOKS_REAL
  ? new Anthropic({ apiKey: ANTHROPIC_API_KEY })
  : null;

const CLAUDE_MODELS = {
  sonnet: process.env.CLAUDE_SONNET_MODEL || 'claude-sonnet-4-5',
  haiku:  process.env.CLAUDE_HAIKU_MODEL  || 'claude-haiku-4-5',
};

// Per-intent routing. Edit this map to rebalance providers without
// touching the request handler. `web: true` enables Claude's
// web_search_20250305 tool so the model grounds its answer in
// today's news.
const PROVIDER_MAP = {
  // Pure reasoning — Claude Sonnet, no web.
  explain_chart: { provider: 'claude', model: 'sonnet', web: false },
  risk_check:    { provider: 'claude', model: 'sonnet', web: false },
  // Cheap + fast JSON extraction — Claude Haiku, no web.
  parse_search:  { provider: 'claude', model: 'haiku',  web: false },
  // News-grounded — Claude Sonnet with web_search tool.
  market_brief:  { provider: 'claude', model: 'sonnet', web: true  },
  why_moved:     { provider: 'claude', model: 'sonnet', web: true  },
  trade_idea:    { provider: 'claude', model: 'sonnet', web: true  },
};

// ─────────────────────────────────────────────────────────────
// FIX 1: GREETING DETECTOR
// Prevents "hii", "hello", "hey" being parsed as tickers.
// HII is a real stock ticker — without this, every greeting
// would trigger a market data fetch and confuse the AI.
// ─────────────────────────────────────────────────────────────
const GREETING_REGEX = /^(hi+|hey+|hello+|hola|howdy|sup|what'?s up|good (morning|evening|afternoon)|greetings|yo+|hiya|heya|namaste)[^a-z]*$/i;

function isGreeting(text) {
  return GREETING_REGEX.test(text.trim());
}

// ─────────────────────────────────────────────────────────────
// FIX 2: MARKET DATA FETCH — Yahoo Finance v10 quoteSummary
// v8/finance/chart was returning undefined for regularMarketPrice
// causing NaN on the frontend. v10 quoteSummary/price is stable.
// Always returns null (never NaN) on any failure.
// ─────────────────────────────────────────────────────────────
async function fetchMarketData(message) {
  if (isGreeting(message)) return null;

  const cryptoMap = {
    bitcoin: 'bitcoin',   btc: 'bitcoin',
    ethereum: 'ethereum', eth: 'ethereum',
    solana: 'solana',     sol: 'solana',
    bnb: 'binancecoin',   xrp: 'ripple',
    dogecoin: 'dogecoin', doge: 'dogecoin',
    cardano: 'cardano',   ada: 'cardano',
    gold: null, oil: null, // commodities — skip crypto path
  };

  const lower = message.toLowerCase();
  const cryptoKey = Object.keys(cryptoMap).find(k =>
    cryptoMap[k] !== null && lower.includes(k)
  );

  try {
    if (cryptoKey) {
      const coinId = cryptoMap[cryptoKey];
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price` +
        `?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
        { timeout: 8000 }
      );
      const coin = data[coinId];
      if (!coin || coin.usd == null) return null;
      const changePct = coin.usd_24h_change || 0;
      return {
        type:      'CRYPTO',
        symbol:    coinId.toUpperCase().slice(0, 5),
        name:      coinId.charAt(0).toUpperCase() + coinId.slice(1),
        price:     parseFloat(coin.usd.toFixed(2)),
        change:    parseFloat((coin.usd * changePct / 100).toFixed(4)),
        changePct: parseFloat(changePct.toFixed(2)),
        marketCap: coin.usd_market_cap || null,
        volume:    coin.usd_24h_vol    || null,
        currency:  '$',
        exchange:  'CRYPTO',
      };
    }

    // Extract ticker symbol (2-5 uppercase letters)
    const tickerMatch = message.match(/\b([A-Z]{2,5})\b/);
    if (!tickerMatch) return null;
    const symbol = tickerMatch[1];

    // Blocklist: common words that look like tickers
    const blocklist = new Set([
      'THE','FOR','AND','ARE','NOT','YOU','ALL','CAN','HAS','GET',
      'NEW','ONE','USE','WAY','DAY','HOW','OIL','GAS','USD','EUR',
      'GBP','JPY','AUD','CHF','CAD','BUY','TOP','PRO','API','HII',
      'RSI','EMA','SMA','ETF','CEO','CFO','IPO','GDP','FED','SEC',
    ]);
    if (blocklist.has(symbol)) return null;

    // Yahoo Finance v10 quoteSummary — stable, returns clean numeric .raw fields
    const { data } = await axios.get(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,summaryDetail`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }
    );

    const result = data?.quoteSummary?.result?.[0];
    if (!result) return null;

    const p  = result.price;
    const sd = result.summaryDetail;

    const price = p?.regularMarketPrice?.raw;
    if (price == null || isNaN(price)) return null;

    return {
      type:      p?.quoteType  || 'STOCK',
      symbol:    p?.symbol     || symbol,
      name:      p?.longName   || p?.shortName || symbol,
      price:     parseFloat(price.toFixed(2)),
      change:    parseFloat((p?.regularMarketChange?.raw            || 0).toFixed(2)),
      changePct: parseFloat((p?.regularMarketChangePercent?.raw * 100 || 0).toFixed(2)),
      open:      p?.regularMarketOpen?.raw      || null,
      high:      p?.regularMarketDayHigh?.raw   || null,
      low:       p?.regularMarketDayLow?.raw    || null,
      volume:    p?.regularMarketVolume?.raw    || null,
      marketCap: p?.marketCap?.raw              || null,
      yearHigh:  sd?.fiftyTwoWeekHigh?.raw      || null,
      yearLow:   sd?.fiftyTwoWeekLow?.raw       || null,
      exchange:  p?.exchangeName                || null,
      currency:  p?.currency                    || 'USD',
    };
  } catch (err) {
    console.error('Market data fetch error:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// PERPLEXITY AI CALL
// ─────────────────────────────────────────────────────────────
async function callPerplexity({ systemPrompt, messages, tier = 'free', userContext = '' }) {
  const model     = PERPLEXITY_MODELS[tier] || PERPLEXITY_MODELS.free;
  const maxTokens = TIER_LIMITS[tier]?.maxTokens || 400;

  const enrichedMessages = messages.map((m, i) => {
    if (i === messages.length - 1 && m.role === 'user' && userContext) {
      return { ...m, content: userContext + m.content };
    }
    return m;
  });

  const payload = {
    model,
    max_tokens: maxTokens,
    temperature: 0.2,
    messages: [
      { role: 'system', content: systemPrompt },
      ...enrichedMessages,
    ],
    return_citations: tier !== 'free',
    search_domain_filter: [
      'finance.yahoo.com','bloomberg.com','reuters.com',
      'investing.com','tradingview.com','cnbc.com',
      'marketwatch.com','ft.com',
    ],
    search_recency_filter: 'day',
  };

  const response = await axios.post(
    `${PERPLEXITY_BASE}/chat/completions`,
    payload,
    {
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const r = response.data;
  return {
    text:      r.choices[0].message.content,
    citations: r.citations || [],
    model:     r.model,
    usage:     r.usage,
  };
}

// ─────────────────────────────────────────────────────────────
// STREAMING PERPLEXITY CALL
//
// Same inputs as callPerplexity; calls `onDelta(chunkText)` for every
// content delta Perplexity emits, and returns a summary object with
// the full text + citations + model after the stream ends.
//
// Why we own this in-process instead of letting the browser hit
// Perplexity directly: the API key stays server-side, tier-based
// rate limiting still applies, and we get one choke point to swap
// providers later without touching the frontend.
// ─────────────────────────────────────────────────────────────
async function streamPerplexity({ systemPrompt, messages, tier = 'free', userContext = '', onDelta }) {
  const model     = PERPLEXITY_MODELS[tier] || PERPLEXITY_MODELS.free;
  const maxTokens = TIER_LIMITS[tier]?.maxTokens || 400;

  const enrichedMessages = messages.map((m, i) => {
    if (i === messages.length - 1 && m.role === 'user' && userContext) {
      return { ...m, content: userContext + m.content };
    }
    return m;
  });

  const payload = {
    model,
    max_tokens: maxTokens,
    temperature: 0.2,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...enrichedMessages,
    ],
    return_citations: tier !== 'free',
    search_domain_filter: [
      'finance.yahoo.com','bloomberg.com','reuters.com',
      'investing.com','tradingview.com','cnbc.com',
      'marketwatch.com','ft.com',
    ],
    search_recency_filter: 'day',
  };

  const response = await axios.post(
    `${PERPLEXITY_BASE}/chat/completions`,
    payload,
    {
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      responseType: 'stream',
      timeout: 60000,
    }
  );

  let fullText = '';
  let citations = [];
  let finalModel = model;
  let usage = null;
  let buffer = '';

  // SSE frames are separated by a blank line. Each frame contains one
  // or more `data: ...` lines. We buffer chunks and split on `\n\n`.
  for await (const chunk of response.data) {
    buffer += chunk.toString('utf-8');
    let idx;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);

      for (const line of frame.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data) continue;
        if (data === '[DONE]') return { text: fullText, citations, model: finalModel, usage };

        let json;
        try { json = JSON.parse(data); } catch { continue; }

        // Perplexity's streamed frames carry the same top-level shape
        // as non-streamed: choices[0].delta.content, plus a citations
        // array and usage on the final frame.
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
          try { onDelta?.(delta); } catch {}
        }
        if (json.citations) citations = json.citations;
        if (json.model)     finalModel = json.model;
        if (json.usage)     usage = json.usage;
      }
    }
  }

  return { text: fullText, citations, model: finalModel, usage };
}

// ─────────────────────────────────────────────────────────────
// ANTHROPIC (CLAUDE) CALLS
//
// Mirror the Perplexity helpers above so /api/ai/analyze can dispatch
// without knowing which provider it's talking to. Both return the
// same shape: { text, citations, model, usage }.
//
// `web: true` flips on Claude's server-side web_search tool. The SDK
// transparently executes tool calls, waits for the result, and
// resumes generation — we only see the final text + citations from
// our streaming loop.
// ─────────────────────────────────────────────────────────────
function buildAnthropicTools(web) {
  if (!web) return undefined;
  return [
    {
      type: 'web_search_20250305',
      name: 'web_search',
      // Cap to keep billing predictable. 3 searches is enough for
      // "what drove this move" / "today's brief" — more is noise.
      max_uses: 3,
    },
  ];
}

// Flatten Claude's citation objects down to the plain URL array the
// rest of the app expects. Dedupe preserving first-seen order so the
// UI shows the most relevant source first.
function collectCitationUrl(citation, seen, out) {
  if (!citation) return;
  const url = citation.url || citation.source || null;
  if (!url || seen.has(url)) return;
  seen.add(url);
  out.push(url);
}

async function callAnthropic({ systemPrompt, messages, tier = 'free', modelKey = 'sonnet', web = false }) {
  if (!anthropic) throw new Error('Anthropic not configured');
  const model = CLAUDE_MODELS[modelKey] || CLAUDE_MODELS.sonnet;
  const maxTokens = TIER_LIMITS[tier]?.maxTokens || 400;

  const res = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
    tools: buildAnthropicTools(web),
  });

  let text = '';
  const citations = [];
  const seen = new Set();
  for (const block of res.content || []) {
    if (block.type === 'text') {
      text += block.text || '';
      for (const c of block.citations || []) collectCitationUrl(c, seen, citations);
    }
  }

  return { text, citations, model: res.model, usage: res.usage };
}

async function streamAnthropic({ systemPrompt, messages, tier = 'free', modelKey = 'sonnet', web = false, onDelta }) {
  if (!anthropic) throw new Error('Anthropic not configured');
  const model = CLAUDE_MODELS[modelKey] || CLAUDE_MODELS.sonnet;
  const maxTokens = TIER_LIMITS[tier]?.maxTokens || 400;

  const stream = anthropic.messages.stream({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
    tools: buildAnthropicTools(web),
  });

  let fullText = '';
  const citations = [];
  const seen = new Set();

  for await (const event of stream) {
    if (event.type !== 'content_block_delta') continue;
    const d = event.delta;
    if (!d) continue;
    if (d.type === 'text_delta' && d.text) {
      fullText += d.text;
      try { onDelta?.(d.text); } catch {}
    } else if (d.type === 'citations_delta' && d.citation) {
      collectCitationUrl(d.citation, seen, citations);
    }
  }

  const finalMessage = await stream.finalMessage();
  return {
    text: fullText,
    citations,
    model: finalMessage.model,
    usage: finalMessage.usage,
  };
}

// ─────────────────────────────────────────────────────────────
// Provider dispatch — one call site for both streaming and
// non-streaming paths. Falls back to Perplexity if Claude is
// mapped but the API key isn't configured yet, so the app stays
// functional while the user wires in a real key.
// ─────────────────────────────────────────────────────────────
function routeForIntent(intent) {
  return PROVIDER_MAP[intent] || { provider: 'perplexity', model: null, web: true };
}

async function callProvider({ intent, systemPrompt, messages, tier, userContext = '' }) {
  const route = routeForIntent(intent);
  if (route.provider === 'claude' && anthropic) {
    return callAnthropic({ systemPrompt, messages, tier, modelKey: route.model, web: route.web });
  }
  return callPerplexity({ systemPrompt, messages, tier, userContext });
}

async function streamProvider({ intent, systemPrompt, messages, tier, userContext = '', onDelta }) {
  const route = routeForIntent(intent);
  if (route.provider === 'claude' && anthropic) {
    return streamAnthropic({ systemPrompt, messages, tier, modelKey: route.model, web: route.web, onDelta });
  }
  return streamPerplexity({ systemPrompt, messages, tier, userContext, onDelta });
}

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE: Verify JWT
// ─────────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch {}
  }
  if (!req.user) {
    const sessionId = req.headers['x-session-id'] || `anon_${Date.now()}`;
    req.user = { userId: sessionId, tier: 'free', name: null, age: null, gender: null };
  }
  next();
}

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE: Rate limiting
// ─────────────────────────────────────────────────────────────
async function tierMiddleware(req, res, next) {
  const { userId, tier } = req.user;
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;

  if (tier === 'free') {
    const key   = `ratelimit:${userId}:${new Date().toDateString()}`;
    const count = parseInt(await redis.get(key) || '0');
    if (count >= limits.daily) {
      return res.status(429).json({
        error:      'Daily limit reached',
        code:       'UPGRADE_REQUIRED',
        message:    `You've used your ${limits.daily} free AI calls for today. Upgrade to Pro for unlimited access!`,
        remaining:  0,
        upgradeUrl: '/pricing',
      });
    }
    await redis.setEx(key, 86400, String(count + 1));
    req.remaining = limits.daily - count - 1;
  } else {
    req.remaining = null;
  }

  req.tierLimits = limits;
  next();
}

// ─────────────────────────────────────────────────────────────
// POST /api/chat
// ─────────────────────────────────────────────────────────────
app.post('/api/chat', optionalAuth, tierMiddleware, async (req, res) => {
  const { message, history = [], bot = 'manu' } = req.body;
  const { tier, name, age, gender } = req.user;
  const userProfile = { name, age, gender };

  const systemPrompt = getSystemPrompt(bot, tier, userProfile);
  const userContext  = buildUserContext(userProfile);

  // FIX: fetch live data — returns null for greetings, never NaN
  const marketData     = await fetchMarketData(message);
  const enrichedMsg    = marketData
    ? `[LIVE PRICE DATA: ${JSON.stringify(marketData)}]\n\n${message}`
    : message;

  const messages = [
    ...history.slice(-8).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: enrichedMsg },
  ];

  try {
    const result = await callPerplexity({ systemPrompt, messages, tier, userContext });
    res.json({
      text:       result.text,
      citations:  result.citations,
      marketData: marketData || null,
      bot,
      tier,
      model:     result.model,
      remaining: req.remaining,
      usage:     result.usage,
    });
  } catch (err) {
    console.error('Perplexity API error:', err?.response?.data || err.message);
    const fallback = bot === 'manu'
      ? "Sorry babe, I'm having trouble connecting right now 😔 Try again in a moment!"
      : "Connection error. Please retry.";
    res.status(500).json({ error: 'AI service error', text: fallback });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/analyze — intent-based AI for the trading platform.
//
// One endpoint powers every AI surface in Topstocx. The frontend
// sends { intent, context, query? } and we route to a tuned system
// prompt + sonar-pro call. Web-grounded, so every response reflects
// *today's* market, not stale training data.
//
// Supported intents:
//   explain_chart   — 3-sentence technical + fundamental read of the
//                     symbol the user is staring at
//   market_brief    — morning-brief style update personalised to the
//                     user's watchlist / selected symbol
//   trade_idea      — entry / stop / target with reasoning
//   risk_check      — given positions array, flag correlation &
//                     concentration risk
//   parse_search    — turn natural language ("crypto over 1000")
//                     into a structured filter the watchlist can run
//
// All intents are free for anon + free tier (counted against their
// daily budget). Pro / Ultimate unlimited.
// ─────────────────────────────────────────────────────────────
const AI_INTENT_PROMPTS = {
  explain_chart: ({ symbol, price, changePct, timeframe }) => `
You are Atlas, a senior institutional market strategist.
The user is looking at a ${timeframe || '15m'} chart of ${symbol}.
Current price: $${price ?? 'unknown'} (${changePct >= 0 ? '+' : ''}${changePct ?? 0}% today).

Give a DIRECT 3-sentence read. No filler. No disclaimers. No "as an AI".
Sentence 1: Market structure — what the chart is doing (trend, key level, momentum).
Sentence 2: Catalyst — what specifically is moving it today (news, macro, flow). Cite a source.
Sentence 3: What to watch next — the one level or event that decides direction.

Style: punchy, trader-desk tone. Use $ for price, % for moves. Never hedge.`,

  market_brief: ({ symbol, price, watchlist, timeOfDay }) => `
You are Atlas. Write a ${timeOfDay || 'morning'} briefing for a trader.
Their current focus: ${symbol} at $${price ?? 'n/a'}.
Their watchlist: ${(watchlist || []).join(', ')}.

Format — exactly 3 bullets, ≤ 20 words each:
• Market tone today (one line, data-grounded)
• What matters for their focus symbol (one line, today's catalyst)
• One opportunity or risk in their watchlist

No preamble. No sign-off. No emojis. Start directly with the first bullet.`,

  trade_idea: ({ symbol, price, timeframe }) => `
You are Atlas. Generate ONE trade idea for ${symbol} on ${timeframe || 'the daily'} timeframe.
Current price: $${price ?? 'unknown'}.

Return in this exact format, nothing else:

**${symbol} — [LONG/SHORT] setup**
Entry: $X
Stop: $Y (R: Z%)
Target 1: $A
Target 2: $B
Reasoning: [2 sentences grounded in today's price action and news.]

Use real levels from current price action. If setup isn't clean, say "No setup — wait."`,

  risk_check: ({ positions = [] }) => `
You are Atlas. A trader has these open positions:
${JSON.stringify(positions, null, 2)}

Analyze for:
1. Concentration (too much in one sector/asset class)
2. Correlation (positions that move together)
3. Proximity to stops

Return 2-3 bullets max. Each ≤ 15 words. Direct warnings, no fluff.
If the book looks clean, say so in one line.`,

  why_moved: ({ symbol, price, changePct, window: win }) => `
You are Atlas. ${symbol} moved ${changePct >= 0 ? '+' : ''}${changePct ?? '?'}% in the last ${win || 'hour'}.
Current price: $${price ?? 'unknown'}.

Explain WHY in ONE sentence. Grounded in today's news. Cite one source.
No hedging. No "it could be due to". State the specific catalyst.

If no clear catalyst exists, say "No clear catalyst — likely flow/positioning." and stop.`,

  parse_search: ({ query, availableSymbols = [] }) => `
You are a query parser. Turn the user's natural-language watchlist query into JSON.

User query: "${query}"
Available symbols: ${availableSymbols.join(', ')}

Return ONLY valid JSON, no markdown, no explanation:
{
  "type": "crypto" | "stock" | "forex" | "all",
  "priceMin": number | null,
  "priceMax": number | null,
  "changeMin": number | null,  // percent, e.g. 5 for +5%
  "changeMax": number | null,
  "symbols": string[]  // specific tickers mentioned, uppercase
}

Examples:
"crypto over 1000" → {"type":"crypto","priceMin":1000,"priceMax":null,"changeMin":null,"changeMax":null,"symbols":[]}
"biggest gainers" → {"type":"all","priceMin":null,"priceMax":null,"changeMin":2,"changeMax":null,"symbols":[]}
"nvidia and tesla" → {"type":"all","priceMin":null,"priceMax":null,"changeMin":null,"changeMax":null,"symbols":["NVDA","TSLA"]}`,
};

app.post('/api/ai/analyze', optionalAuth, tierMiddleware, async (req, res) => {
  const { intent, context = {}, query = '' } = req.body || {};
  const { tier } = req.user;

  if (!intent || !AI_INTENT_PROMPTS[intent]) {
    return res.status(400).json({
      error: 'Unknown intent',
      supported: Object.keys(AI_INTENT_PROMPTS),
    });
  }

  // parse_search: try local regex parse first — cheap, instant, no LLM cost.
  // Only fall back to LLM if the local parse didn't yield a meaningful filter.
  if (intent === 'parse_search') {
    const local = localParseSearch(query, context.availableSymbols || []);
    if (local) {
      return res.json({ structured: local, source: 'local', text: null });
    }
  }

  const systemPrompt = AI_INTENT_PROMPTS[intent](context);
  const userMessage  = query || 'Proceed.';

  // Stream mode: client asks for it via Accept header OR `?stream=1`.
  // We never stream parse_search — the whole value is the final JSON.
  const wantsStream =
    intent !== 'parse_search' &&
    (req.query.stream === '1' ||
     (req.headers.accept || '').includes('text/event-stream'));

  if (wantsStream) {
    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',   // disable proxy buffering (nginx)
    });

    // Heartbeat every 15s so idle intermediaries don't close the
    // connection mid-stream. Clients ignore comment-only frames.
    const heartbeat = setInterval(() => {
      try { res.write(`: ping\n\n`); } catch {}
    }, 15000);

    // Write helper — one SSE event per call.
    const sse = (event, data) => {
      try {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      } catch {}
    };

    // If the client disconnects, bail early so we don't keep billing
    // Perplexity for tokens no one will read.
    let clientGone = false;
    req.on('close', () => { clientGone = true; });

    try {
      const route = routeForIntent(intent);
      sse('meta', { intent, tier, provider: route.provider, web: route.web });

      const result = await streamProvider({
        intent,
        systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
        tier,
        userContext: '',
        onDelta: (delta) => {
          if (clientGone) return;
          sse('delta', { text: delta });
        },
      });

      sse('done', {
        text:      result.text,
        citations: result.citations,
        model:     result.model,
        usage:     result.usage,
        remaining: req.remaining,
      });
    } catch (err) {
      console.error('[/api/ai/analyze stream]', intent, err?.response?.data || err.message);
      sse('error', { error: 'AI service error' });
    } finally {
      clearInterval(heartbeat);
      res.end();
    }
    return;
  }

  // Non-streaming path (JSON response) — unchanged contract.
  try {
    const result = await callProvider({
      intent,
      systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      tier,
      userContext: '',
    });

    // For parse_search, extract JSON from the model's response.
    if (intent === 'parse_search') {
      const structured = extractJson(result.text);
      return res.json({
        structured: structured || null,
        source:     structured ? 'llm' : 'fallback',
        text:       result.text,
      });
    }

    res.json({
      text:      result.text,
      citations: result.citations,
      model:     result.model,
      usage:     result.usage,
      remaining: req.remaining,
    });
  } catch (err) {
    console.error('[/api/ai/analyze]', intent, err?.response?.data || err.message);
    res.status(500).json({
      error: 'AI service error',
      intent,
      text:  'AI temporarily unavailable. Try again in a moment.',
    });
  }
});

// Local parser — catches ~80% of watchlist queries without an LLM hop.
function localParseSearch(query, availableSymbols) {
  if (!query) return null;
  const q = query.toLowerCase();

  const out = {
    type: 'all',
    priceMin: null, priceMax: null,
    changeMin: null, changeMax: null,
    symbols: [],
  };

  if (/\b(crypto|coin|coins|btc|eth)\b/.test(q)) out.type = 'crypto';
  else if (/\b(stock|stocks|equit|share)/.test(q)) out.type = 'stock';
  else if (/\b(forex|fx|currency|currencies)\b/.test(q)) out.type = 'forex';

  // "over 100", "above 1000", ">500"
  const overMatch = q.match(/(?:over|above|>|more than)\s*\$?(\d+(?:\.\d+)?)/);
  if (overMatch) out.priceMin = parseFloat(overMatch[1]);
  const underMatch = q.match(/(?:under|below|<|less than)\s*\$?(\d+(?:\.\d+)?)/);
  if (underMatch) out.priceMax = parseFloat(underMatch[1]);

  // "up 5%", "gaining", "biggest gainers"
  if (/\b(gain|gainer|gaining|rallying|pump|mooning|up\b)/.test(q)) out.changeMin = 1;
  if (/\b(loser|losers|dumping|crash|down\b|red)/.test(q))           out.changeMax = -1;
  const pctMatch = q.match(/up\s+(\d+(?:\.\d+)?)\s*%/);
  if (pctMatch) out.changeMin = parseFloat(pctMatch[1]);

  // Direct symbol mentions from availableSymbols
  const upper = query.toUpperCase();
  out.symbols = (availableSymbols || []).filter(s => {
    const pat = new RegExp(`\\b${s}\\b`);
    return pat.test(upper);
  });

  const hasSignal =
    out.type !== 'all' ||
    out.priceMin !== null || out.priceMax !== null ||
    out.changeMin !== null || out.changeMax !== null ||
    out.symbols.length > 0;

  return hasSignal ? out : null;
}

function extractJson(text) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password, age, gender } = req.body;
  if (age && parseInt(age) < 18) {
    return res.status(400).json({ error: 'You must be 18 or older to register.' });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  // TODO: INSERT INTO users (...) VALUES (...)
  const userId = `user_${Date.now()}`;
  const tokenPayload = {
    userId, email, name,
    age:    age    ? parseInt(age)        : null,
    gender: gender ? gender.toLowerCase() : null,
    tier:   'free',
  };
  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '30d' });
  console.log('New user registered:', { name, email, phone, age, gender });
  res.json({ token, user: { userId, name, email, age, gender, tier: 'free' } });
});

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // TODO: real DB lookup + bcrypt.compare
  const mockUser = { userId: 'user_123', name: 'Demo User', email, age: 25, gender: 'male', tier: 'free' };
  const token = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: mockUser });
});

// ─────────────────────────────────────────────────────────────
// POST /api/lead
// ─────────────────────────────────────────────────────────────
app.post('/api/lead', async (req, res) => {
  const { name, phone, email, source = 'chatbot' } = req.body;
  // TODO: INSERT INTO leads (...)
  console.log('Lead captured:', { name, phone, email, source });
  res.json({ success: true });
});

// ─────────────────────────────────────────────────────────────
// POST /api/payments/create-checkout
// ─────────────────────────────────────────────────────────────
app.post('/api/payments/create-checkout', authMiddleware, async (req, res) => {
  const { plan } = req.body;
  const { email, userId } = req.user;
  const priceId = STRIPE_PLANS[plan];
  if (!priceId) return res.status(400).json({ error: 'Invalid plan' });
  const session = await stripe.checkout.sessions.create({
    mode:                 'subscription',
    payment_method_types: ['card'],
    customer_email:       email,
    line_items:           [{ price: priceId, quantity: 1 }],
    success_url:          `${process.env.FRONTEND_URL}/dashboard?upgraded=true&plan=${plan}`,
    cancel_url:           `${process.env.FRONTEND_URL}/pricing`,
    metadata:             { userId, plan },
  });
  res.json({ url: session.url });
});

// ─────────────────────────────────────────────────────────────
// POST /api/payments/webhook
// ─────────────────────────────────────────────────────────────
app.post('/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
      return res.status(400).send('Webhook signature failed');
    }
    if (event.type === 'checkout.session.completed') {
      const { userId, plan } = event.data.object.metadata;
      // TODO: UPDATE users SET tier = plan WHERE id = userId
      console.log(`Upgraded: user ${userId} to ${plan}`);
      await redis.set(`invalidate:${userId}`, '1', { EX: 86400 });
    }
    if (event.type === 'customer.subscription.deleted') {
      console.log('Subscription cancelled:', event.data.object.customer);
      // TODO: downgrade user to free
    }
    res.json({ received: true });
  }
);

// ─────────────────────────────────────────────────────────────
// POST /api/copy-trade/notify
// ─────────────────────────────────────────────────────────────
app.post('/api/copy-trade/notify', async (req, res) => {
  if (req.headers['x-internal-key'] !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { trade } = req.body;
  const alertMessage = createCopyTradeAlert(trade);
  await redis.lPush('copy_trade_feed', JSON.stringify({ ...trade, alertMessage, timestamp: Date.now() }));
  await redis.lTrim('copy_trade_feed', 0, 99);
  try {
    const explanation = await callPerplexity({
      systemPrompt: getSystemPrompt('atlas', 'ultimate', {}),
      messages: [{ role: 'user', content: alertMessage + '\n\nProvide the full institutional trade brief.' }],
      tier: 'ultimate',
    });
    await redis.set(
      `trade_brief:${trade.ticket}`,
      JSON.stringify({ trade, brief: explanation.text, citations: explanation.citations }),
      { EX: 86400 }
    );
  } catch (e) {
    console.error('Trade brief generation failed:', e.message);
  }
  res.json({ success: true });
});

// ─────────────────────────────────────────────────────────────
// GET /api/copy-trade/feed
// ─────────────────────────────────────────────────────────────
app.get('/api/copy-trade/feed', authMiddleware, async (req, res) => {
  if (req.user.tier !== 'ultimate') return res.status(403).json({ error: 'Ultimate tier required' });
  const trades = await redis.lRange('copy_trade_feed', 0, 9);
  res.json({ trades: trades.map(t => JSON.parse(t)) });
});

// ─────────────────────────────────────────────────────────────
// GET /api/copy-trade/brief/:ticket
// ─────────────────────────────────────────────────────────────
app.get('/api/copy-trade/brief/:ticket', authMiddleware, async (req, res) => {
  if (req.user.tier !== 'ultimate') return res.status(403).json({ error: 'Ultimate tier required' });
  const data = await redis.get(`trade_brief:${req.params.ticket}`);
  if (!data) return res.status(404).json({ error: 'Brief not found' });
  res.json(JSON.parse(data));
});

// ─────────────────────────────────────────────────────────────
// GET /api/macro (Local Dev Proxy)
// ─────────────────────────────────────────────────────────────
app.get('/api/macro', macroHandler);

// ─────────────────────────────────────────────────────────────
// LEVERATE API PROXY
// ─────────────────────────────────────────────────────────────
app.post(/^\/api\/leverate\/(.*)/, async (req, res) => {
  const path = req.params[0];
  const baseUrl = process.env.LEVERATE_BASE_URL || 'https://restapi-real.sirixtrader.com:443';
  const targetUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${path}`;

  console.log(`Leverate Proxy Request: ${targetUrl}`);
  
  try {
    const response = await axios.post(targetUrl, req.body, {
      headers: {
        'Authorization': `Bearer ${process.env.LEVERATE_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    res.json(response.data);
  } catch (err) {
    console.error(`Leverate Proxy Error [${path}]:`, err?.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: 'Leverate Proxy Error', message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/claude-stream — Perplexity financial analyst (SSE)
// ─────────────────────────────────────────────────────────────
const FINAI_BASE_PROMPT = `You are FinAI — the intelligent trading assistant built into TopStocx, powered by Wall Street Jr.
You combine the warmth of a trusted trading mentor with the precision of a senior institutional analyst.
Your goal is to make every trader feel informed, confident, and supported — whether they are a beginner or a seasoned pro.

━━━━━━━━━━━━━━━━━━━━━━━━━
PERSONALITY & TONE
━━━━━━━━━━━━━━━━━━━━━━━━━
- Be warm, approachable, and genuinely human. Never sound robotic or templated.
- Speak like a knowledgeable senior analyst who enjoys teaching — confident but never arrogant.
- Use plain, clear English. When you use technical terms, explain them in the same sentence naturally.
- Stay calm and measured — never hype a move, never panic about a drop.
- Acknowledge what the trader is asking about and make them feel heard before diving into data.

━━━━━━━━━━━━━━━━━━━━━━━━━
GREETING RULE — CRITICAL
━━━━━━━━━━━━━━━━━━━━━━━━━
If the user's message is only a greeting (hi, hey, hello, hii, heyy, good morning, etc.):
- STOP. Do NOT give market data, tickers, or trade ideas.
- Respond ONLY with a warm, human welcome like:
  "Hey! Welcome to TopStocx. I'm FinAI, your market analyst. What would you like to dig into today — Gold, Forex, Crypto, or a full market overview?"

━━━━━━━━━━━━━━━━━━━━━━━━━
SINGLE ASSET / SHORT QUERY RULE
━━━━━━━━━━━━━━━━━━━━━━━━━
If the user sends just an asset name or short phrase like:
"gold", "bitcoin", "EURUSD", "gold trend now?", "buy or sell gold?", "key levels?", "any news?", "best trade setup?"
→ Treat it as a full market analysis request for that asset.
→ Never explain what it is historically or scientifically — only give live trading context.

━━━━━━━━━━━━━━━━━━━━━━━━━
MARKET ANALYSIS FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━
For any market analysis question (asset, trend, signal, level), use this structure:

📊 [ASSET] — Market Snapshot

💰 Current Price: $XXXX | Change: +/-X% today

📈 Trend & Momentum:
- Short-term (M5/M15/H1): [Bullish/Bearish/Sideways] — [one-line reason]
- Medium-term (H4/Daily): [Bullish/Bearish/Sideways] — [one-line reason]
- Overall Bias: [Bullish / Bearish / Neutral]

🔑 Key Levels to Watch:
- Support: $XXXX | $XXXX
- Resistance: $XXXX | $XXXX

📰 What's Driving Price Right Now:
[4–6 lines in plain English — current catalyst, macro event, or sentiment. No citations, no brackets, no numbered references.]

⚡ Trader's Takeaway:
[2–3 lines — what to watch, what could trigger the next move, and key risk to be aware of]

📌 This is market analysis for educational purposes. Always define your stop loss and manage your risk before entering any trade.

━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL MARKET SUMMARY FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━
When asked for a global market summary, sentiment, or major news:

🌍 Global Market Snapshot — [Today's Date]

📊 Overall Sentiment: [Bullish / Bearish / Mixed] — [one-line reason]

🥇 Gold (XAUUSD): [price, trend, 1-line driver]
💵 US Dollar (DXY): [strength/weakness, 1-line reason]
🛢️ Oil (WTI): [price, trend, 1-line driver]
📈 US Indices (S&P500 / Nasdaq): [direction, 1-line driver]
₿ Crypto (BTC): [price, trend, 1-line driver]
💱 Key Forex (EURUSD / GBPUSD / USDJPY): [brief direction for each]

📰 Top Stories Moving Markets Today:
[3–5 bullet points of the key macro news — plain English, no citations]

⚡ What to Watch:
[Key events or data coming up that could shift sentiment]

━━━━━━━━━━━━━━━━━━━━━━━━━
SIGNAL FORMAT (when user asks for buy/sell signals)
━━━━━━━━━━━━━━━━━━━━━━━━━
When user asks for signals, entry, SL, TP, or "best trade setup":

⚡ Trade Setup — [ASSET]
- Direction: BUY / SELL / WAIT
- Entry Zone: $XXXX – $XXXX
- Stop Loss (SL): $XXXX
- Take Profit 1 (TP1): $XXXX
- Take Profit 2 (TP2): $XXXX
- Risk:Reward: X:X
- Confidence: High / Medium / Low

📖 Why This Setup:
[3–4 lines — the technical and/or fundamental reason for this setup in plain English]

📌 Educational purposes only. Always manage your risk with a predefined stop loss.

━━━━━━━━━━━━━━━━━━━━━━━━━
LOT SIZE & RISK MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━
When asked "what lot size should I use?" or similar risk management questions:
Explain it clearly using the 2% rule:
- Risk Amount = Account Balance × Risk %
- Pip Value and lot size depend on the asset and broker
- Example: $1000 account at 2% risk = $20 max risk per trade
- If SL is 20 pips and pip value is $1 per pip on 0.1 lot → use 0.1 lot
Always remind the user that risk management is the most important skill in trading.

━━━━━━━━━━━━━━━━━━━━━━━━━
ECONOMIC CALENDAR & NEWS
━━━━━━━━━━━━━━━━━━━━━━━━━
When asked about scheduled news, CPI, NFP, or economic events:
- List the high-impact events for today with their scheduled times
- Explain what the data measures in simple terms
- Describe how it typically affects Gold, USD, and related pairs
- Warn about volatility spikes during news releases
- Recommend waiting for the release before entering if close to a major event

━━━━━━━━━━━━━━━━━━━━━━━━━
TRAINED KNOWLEDGE BASE — HOW TO ANSWER COMMON QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━
Use the following as your base understanding for common trader questions.
Always enrich with live data, but the tone and logic should follow these patterns:

BASIC MARKET UNDERSTANDING:
Q: What is happening in Gold right now?
→ Gold is moving based on current market conditions. The main driver is usually changes in USD strength and global uncertainty. When uncertainty rises, Gold tends to get support as investors seek safety.

Q: Why is Gold going up?
→ Gold usually rises when investors look for safety. Right now, it's likely driven by a weaker USD, economic concerns, or rising geopolitical tensions. Any of these can push demand for Gold higher.

Q: Why is Gold falling?
→ Gold tends to fall when the USD strengthens or when interest rates rise. Higher rates increase the opportunity cost of holding Gold, which offers no yield, so investors move to dollar-denominated assets instead.

Q: Is the market bullish or bearish?
→ Assess the current price direction, moving average positions, and momentum, then give a clear Bullish / Bearish / Neutral bias with a one-line reason. Never leave the user without a clear directional view.

Q: Why is the market moving today?
→ Markets move due to news, economic data releases, and shifts in global sentiment. Always name the specific driver — don't just say "due to market conditions."

Q: Why is the market not moving?
→ Sometimes markets go quiet when there is no major news. Traders wait for new information or a catalyst before taking positions. This is normal, especially before big events like NFP or CPI.

Q: Who moves the market?
→ Large institutions, central banks, hedge funds, and major global investors move the market. Retail traders have a very small individual impact, but collectively can influence short-term moves.

WHY QUESTIONS:
Q: Why does USD affect Gold?
→ Gold and USD usually move in opposite directions because Gold is priced in USD. When USD becomes stronger, Gold becomes more expensive for foreign buyers, reducing global demand and pushing price lower.

Q: Why is the market volatile today?
→ Volatility rises when there is high-impact news, uncertainty, or when major economic data is released. Traders react quickly to new information, causing larger and faster price moves.

Q: Why did price suddenly reverse?
→ Reversals happen due to profit-taking at key levels, new information entering the market, or a shift in sentiment. They often occur near important support or resistance zones.

Q: Why is Gold not following the news?
→ Sometimes market expectations are already priced in before the news is released. If traders were already positioned for the news, the reaction can be muted or even opposite to what logic suggests.

Q: Why does the market move even without news?
→ Markets also move due to technical factors, institutional positioning, and algorithmic activity. Not every move needs a news catalyst — price respects key technical levels on its own.

FUNDAMENTALS:
Q: What is the Federal Reserve?
→ The Federal Reserve (the Fed) is the central bank of the United States. It controls interest rates and the money supply, making it one of the most powerful forces in global financial markets.

Q: Why do interest rates matter?
→ Higher interest rates make the USD more attractive to investors, which strengthens it. This typically puts downward pressure on Gold since a stronger USD makes Gold more expensive globally.

Q: How does inflation affect Gold?
→ Gold is traditionally seen as a hedge against inflation. When inflation rises, the purchasing power of money falls, and investors often buy Gold to preserve value — which supports its price.

Q: Why does USD become strong?
→ The USD strengthens when the US economy is performing well, when the Fed raises interest rates, or when global investors seek safety in dollar assets during times of uncertainty.

TECHNICAL BASICS:
Q: What is a trend?
→ A trend is the overall direction price is moving — upward (higher highs and higher lows), downward (lower highs and lower lows), or sideways (price ranging between levels). Identifying the trend is the first step before any trade.

Q: What is support?
→ Support is a price level where buying interest is strong enough to stop price from falling further. Think of it as a floor — price bounces up from support because buyers step in there.

Q: What is resistance?
→ Resistance is a price level where selling pressure is strong enough to stop price from rising. Think of it as a ceiling — price struggles to break above resistance because sellers are active there.

Q: Why is price stuck?
→ Price enters a range when buyers and sellers are equally matched — neither side has enough force to push price significantly in one direction. This is called a sideways or consolidating market, and a breakout is usually coming.

CORRELATIONS:
Q: Why does Gold fall when USD rises?
→ Gold is priced in US dollars. When the USD becomes stronger, it takes fewer dollars to buy the same amount of Gold internationally, making it effectively more expensive for foreign buyers. Less demand → lower price.

Q: How are markets connected?
→ Global markets are linked through capital flows, risk sentiment, and economic interdependence. When US stocks fall, investors often move into Gold as a safe haven. When the Fed raises rates, it affects currencies worldwide.

RISK & UNCERTAINTY:
Q: Why is the market unpredictable?
→ Markets are driven by millions of participants reacting to an endless flow of news, emotions, and global events. This makes exact prediction impossible. The goal is not to predict perfectly — it's to manage risk so that when you're wrong, it doesn't hurt badly.

Q: Can the market suddenly change direction?
→ Yes, absolutely. Unexpected events — a surprise central bank decision, geopolitical shock, or major data miss — can shift sentiment instantly. This is why stop losses are non-negotiable in trading.

TIME-BASED QUESTIONS:
Q: Will Gold go up today? / What should I expect today?
→ Always answer with a directional bias based on current data, then caveat it honestly. Example: "The current setup leans bullish for today, with price holding above key support and the USD under pressure. However, watch for the CPI release at 2:30 PM EST — that could shift the picture quickly."

Q: Is this move temporary?
→ Short-term moves can be temporary, especially if they happen without strong fundamental backing. A sustained trend needs both technical confirmation AND a macro driver behind it.

━━━━━━━━━━━━━━━━━━━━━━━━━
CONCEPT EXPLANATION FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━
When asked to explain indicators, strategies, or concepts (RSI, MACD, divergence, overbought, etc.):
- Open with one clear, plain-English sentence that defines it.
- Give a practical trading example — make it tangible.
- Explain how traders actually use it to make decisions.
- End with a pro tip or common mistake to avoid.
- Write like a great mentor, not a textbook.

━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━
1. NEVER show [1] [2] [3] or any numbered citations. Rewrite all web data in your own voice.
2. NEVER say "I cannot provide financial advice" — end every response with the educational disclaimer instead.
3. NEVER suggest a trade unless the user explicitly asked for one.
4. ALWAYS give detailed, substantive answers — minimum 6–8 lines for market questions.
5. When multiple sources show different prices, use only the most recent one.
6. If asked something unrelated to markets or trading, gently redirect with warmth.
7. Always write like a human expert — never like a search result or a generic disclaimer page.
8. For short quick questions ("gold trend now?", "buy or sell?", "key levels?") — still give a full structured answer, just more concise. Never reply with a single sentence to a market question.`;


app.post('/api/claude-stream', optionalAuth, async (req, res) => {
  const { message, history = [], ticker = null } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Inject ticker into system prompt so every response is contextualised
  const systemPrompt = ticker
    ? `${FINAI_BASE_PROMPT}\n\nCURRENT CONTEXT: The user is currently viewing ${ticker}. Unless they ask about something else, focus your analysis on ${ticker}.`
    : FINAI_BASE_PROMPT;

  const messages = [
    ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message },
  ];

  try {
    const axiosRes = await axios.post(
      `${PERPLEXITY_BASE}/chat/completions`,
      {
        model: 'sonar-pro',
        max_tokens: 1024,
        temperature: 0.2,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        search_domain_filter: [
          'finance.yahoo.com', 'bloomberg.com', 'reuters.com',
          'investing.com', 'tradingview.com', 'cnbc.com',
        ],
        search_recency_filter: 'day',
      },
      {
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
        timeout: 30000,
      }
    );

    let buf = '';
    axiosRes.data.on('data', (chunk) => {
      buf += chunk.toString();
      const lines = buf.split('\n');
      buf = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6).trim();
        if (raw === '[DONE]') { res.write('data: [DONE]\n\n'); return; }
        try {
          const parsed = JSON.parse(raw);
          const text = parsed.choices?.[0]?.delta?.content;
          if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
        } catch {}
      }
    });

    axiosRes.data.on('end', () => {
      res.write('data: [DONE]\n\n');
      res.end();
    });

    axiosRes.data.on('error', (err) => {
      console.error('Perplexity stream error:', err.message);
      res.write(`data: ${JSON.stringify({ error: 'Stream error. Please try again.' })}\n\n`);
      res.end();
    });

  } catch (err) {
    console.error('FinAI stream error:', err?.response?.data || err.message);
    res.write(`data: ${JSON.stringify({ error: 'AI service error. Please try again.' })}\n\n`);
    res.end();
  }
});

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_DEV) {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`TopstockX API (Perplexity sonar-pro) running on port ${process.env.PORT || 3001}`);
  });
}

export default app;

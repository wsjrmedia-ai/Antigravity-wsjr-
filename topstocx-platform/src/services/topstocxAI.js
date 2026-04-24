/**
 * topstocxAI — the single client for every AI feature in the app.
 *
 * All features funnel through POST /api/ai/analyze with an intent,
 * a context object, and an optional free-form query. Responses are
 * already grounded in today's market (Perplexity sonar-pro with
 * domain-filtered search).
 *
 * No mocks. No fallbacks to fake data. If the API fails we surface
 * the error so the UI can show a real state instead of lying.
 */

const API_BASE = import.meta.env.VITE_API_BASE || '';

// In-memory response cache so rapid re-asks of the same thing
// don't burn tokens. Keyed by intent + stable context hash.
// Entries expire after 60s — long enough for a user to click
// the button a few times, short enough that new price data gets
// a fresh answer.
const cache = new Map();
const CACHE_TTL_MS = 60_000;

function cacheKey(intent, context, query) {
  try {
    return `${intent}:${query || ''}:${JSON.stringify(context)}`;
  } catch {
    return `${intent}:${query || ''}`;
  }
}

function fromCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.t > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.v;
}

function putCache(key, value) {
  cache.set(key, { t: Date.now(), v: value });
}

/**
 * Call the AI analyze endpoint.
 *
 * @param {Object}  args
 * @param {string}  args.intent   — one of explain_chart | market_brief |
 *                                  trade_idea | risk_check | parse_search
 * @param {Object}  args.context  — intent-specific context (symbol, price,
 *                                  watchlist, positions, timeframe, etc.)
 * @param {string}  [args.query]  — optional free-form user text
 * @param {AbortSignal} [args.signal] — lets the UI cancel if the user
 *                                       switches away before the response
 *                                       arrives
 * @returns {Promise<{text?:string, structured?:object, citations?:string[],
 *                    model?:string, remaining?:number}>}
 */
export async function analyzeWithAI({ intent, context = {}, query = '', signal }) {
  const key = cacheKey(intent, context, query);
  const cached = fromCache(key);
  if (cached) return cached;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const sessionId =
    typeof window !== 'undefined'
      ? (window.__tsx_session_id ||= `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`)
      : 'server';

  const res = await fetch(`${API_BASE}/api/ai/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'x-session-id': sessionId,
    },
    body: JSON.stringify({ intent, context, query }),
    signal,
  });

  if (!res.ok) {
    // Surface the real error — do NOT fall back to fake text.
    let body;
    try { body = await res.json(); } catch { body = { error: `HTTP ${res.status}` }; }
    const err = new Error(body.error || `AI request failed: ${res.status}`);
    err.status = res.status;
    err.body   = body;
    throw err;
  }

  const data = await res.json();
  putCache(key, data);
  return data;
}

/** Convenience wrappers so components don't repeat intent strings. */
export const explainChart = (ctx, opts = {}) =>
  analyzeWithAI({ intent: 'explain_chart', context: ctx, ...opts });

export const marketBrief = (ctx, opts = {}) =>
  analyzeWithAI({ intent: 'market_brief', context: ctx, ...opts });

export const tradeIdea = (ctx, opts = {}) =>
  analyzeWithAI({ intent: 'trade_idea', context: ctx, ...opts });

export const riskCheck = (ctx, opts = {}) =>
  analyzeWithAI({ intent: 'risk_check', context: ctx, ...opts });

export const parseSearch = (query, availableSymbols, opts = {}) =>
  analyzeWithAI({
    intent: 'parse_search',
    context: { availableSymbols },
    query,
    ...opts,
  });

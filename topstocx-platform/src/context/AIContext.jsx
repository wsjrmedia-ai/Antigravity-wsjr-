/**
 * AIContext — the single source of truth for the AI layer.
 *
 * Every AI feature (Explain Chart, Market Brief, Trade Idea, Risk Check,
 * natural-language search) reads its context from here. That way we
 * guarantee:
 *
 *   • the price the model sees is the exact same one on the screen
 *   • the timeframe is consistent across features
 *   • the watchlist used for ranking matches what the user actually has
 *   • adding a new AI feature = one useAI() call, not a plumbing exercise
 *
 * This provider NEVER calls the AI itself. It only assembles context.
 * The AI call lives in services/topstocxAI.js. Separation of concerns:
 * providers = data, services = network.
 */

import { createContext, useContext, useMemo, useCallback } from 'react';
import { useLeverate } from './LeverateContext';
import { useMarketData } from './MarketDataContext';
import { usePlan } from './PlanContext';

const AIContext = createContext(null);

/**
 * Resolve a symbol like "BTCUSDT", "AAPL", "EURUSD" to a live quote
 * from whichever stream owns it (Binance WS for crypto, random-walk
 * seeds for stocks/forex/indices until the broker is wired).
 *
 * Returns null if we genuinely have no data — callers must handle
 * that instead of assuming a price.
 */
function resolveQuote(symbol, { cryptoPrices, stocks, forex, indices }) {
  if (!symbol) return null;
  const upper = symbol.toUpperCase();

  // Binance crypto (keyed lowercase)
  const cryptoKey = upper.toLowerCase();
  if (cryptoPrices[cryptoKey]) {
    const c = cryptoPrices[cryptoKey];
    return {
      symbol: c.symbol,
      price: c.price,
      change: c.change,
      changePct: c.changePct,
      high24h: c.high24h,
      low24h: c.low24h,
      volume: c.volume,
      assetClass: 'crypto',
    };
  }

  // Stocks
  const stock = stocks.find(s => s.symbol === upper);
  if (stock) {
    return {
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePct: stock.changePct,
      high24h: stock.high24h,
      low24h: stock.low24h,
      volume: stock.volume,
      sector: stock.sector,
      assetClass: 'stock',
    };
  }

  // Forex — stored as "EUR/USD" but symbol comes in as "EURUSD"
  const forexItem = forex.find(
    f => f.symbol.replace('/', '') === upper || f.symbol === upper
  );
  if (forexItem) {
    return {
      symbol: forexItem.symbol,
      price: forexItem.price,
      change: forexItem.change,
      changePct: forexItem.changePct,
      high24h: forexItem.high24h,
      low24h: forexItem.low24h,
      assetClass: 'forex',
    };
  }

  // Indices
  const idx = indices.find(i => i.symbol === upper);
  if (idx) {
    return {
      symbol: idx.symbol,
      name: idx.name,
      price: idx.price,
      change: idx.change,
      changePct: idx.changePct,
      assetClass: 'index',
    };
  }

  return null;
}

function timeOfDayLabel(date = new Date()) {
  // UTC hour used so results are consistent across users; the AI
  // uses this to phrase things like "pre-market" vs "after hours".
  const hUTC = date.getUTCHours();
  // US cash session in UTC: ~13:30–20:00 (EST), adjusts with DST —
  // we keep this as a coarse hint, not a trading decision.
  if (hUTC >= 13 && hUTC < 20) return 'us_session';
  if (hUTC >= 7 && hUTC < 13) return 'eu_session';
  if (hUTC >= 0 && hUTC < 7) return 'asia_session';
  return 'after_hours';
}

export function AIContextProvider({ children }) {
  const { selectedSymbol, selectedPeriod, positions, balance } = useLeverate();
  const { cryptoPrices, stocks, forex, indices } = useMarketData();
  const { userPlan } = usePlan();

  /**
   * Snapshot the world the AI should reason about.
   *
   * Why a function and not a memoized object? Because prices tick
   * multiple times per second via the Binance WS, and we don't want
   * to re-render every consumer on every tick. Consumers call this
   * at the moment of the AI request — that read is fresh, the rest
   * of the app stays calm.
   */
  const getAIContext = useCallback(
    (overrides = {}) => {
      const symbol = overrides.symbol || selectedSymbol;
      const quote = resolveQuote(symbol, { cryptoPrices, stocks, forex, indices });

      return {
        symbol,
        timeframe: overrides.timeframe || `${selectedPeriod}m`,
        quote,              // null if we don't have a price — caller must handle
        price: quote?.price ?? null,
        changePct: quote?.changePct ?? null,
        assetClass: quote?.assetClass ?? null,

        // Watchlist: the symbols the user has on their board right now.
        // parseSearch uses this to resolve "top gainer in my list" etc.
        watchlist: overrides.watchlist || [],

        // Portfolio context — drives risk_check and position-aware
        // trade ideas. Empty if the user hasn't connected a broker yet.
        positions: positions || [],
        balance: balance || null,

        // Session hint. Not authoritative — the AI can still pull the
        // real clock via Perplexity's web search when it matters.
        timeOfDay: timeOfDayLabel(),

        // Tier gates which intents get routed to the expensive model
        // and how detailed the answer is. The server also re-checks this.
        tier: userPlan,
      };
    },
    [selectedSymbol, selectedPeriod, cryptoPrices, stocks, forex, indices, positions, balance, userPlan]
  );

  /**
   * Stable wrapper exposed to consumers. We memoize the value object
   * itself so useAI() subscribers don't thrash — the freshness lives
   * inside the getAIContext closure, which is re-created only when
   * one of its deps actually changes (symbol, timeframe, tier).
   */
  const value = useMemo(() => ({ getAIContext }), [getAIContext]);

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used inside AIContextProvider');
  return ctx;
}

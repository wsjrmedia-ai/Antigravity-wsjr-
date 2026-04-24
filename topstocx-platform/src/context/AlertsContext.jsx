/**
 * AlertsContext — the proactive-alerts system.
 *
 * What it does:
 *   • Snapshots a baseline price for every symbol in the user's
 *     watchlist the first time we see a real quote for it.
 *   • On every market-data tick (Binance WS + random-walk seeds push
 *     updates through useMarketData), compares the live price to the
 *     baseline and fires an alert when |Δ%| ≥ threshold.
 *   • Dedupes: the same symbol can't fire again for COOLDOWN_MS after
 *     the last alert. When it does fire again, we reset its baseline
 *     so we track the *next* leg, not the same cumulative move.
 *   • Optionally asks the browser for Notification permission so the
 *     user can get a desktop push even when the tab isn't focused.
 *
 * What it does NOT do:
 *   • Call the AI. That's the AlertsCenter UI's job when the user
 *     clicks "Ask AI why" — we route that through the `why_moved`
 *     intent in topstocxAI.js.
 *   • Persist anything. Alerts are ephemeral — a session artifact.
 *     Rehydrating stale "SPX +4%" on tomorrow's login would be worse
 *     than useless.
 *
 * Tuning constants live at the top. 3% + 15-minute cooldown is the
 * sweet spot we landed on: tight enough to catch real news-driven
 * moves on liquid tickers, loose enough that a choppy crypto
 * doesn't spam the bell.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useMarketData } from './MarketDataContext';

const AlertsContext = createContext(null);

// The symbols we watch. Mirrors WatchlistWidget GROUPS — if a symbol
// isn't here, it won't trigger. We keep this explicit rather than
// watching the entire instrument universe; 10k tickers drifting
// through our comparison loop would be wasteful and noisy.
const WATCHED_SYMBOLS = [
  // Stocks
  'AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN',
  // Crypto (Binance stream keys — lowercase)
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT',
  // Forex
  'EURUSD', 'GBPUSD', 'USDJPY',
];

// Move threshold that triggers an alert. 3% is the "something happened"
// bar for liquid tickers — smaller than a typical intraday range on
// crypto, bigger than noise on blue-chip stocks.
const THRESHOLD_PCT = 3;

// How long after firing before the same symbol can fire again. 15 min
// stops one catalyst from spamming the bell as a stock rallies from
// +3% to +4% to +5% over the next few minutes.
const COOLDOWN_MS = 15 * 60 * 1000;

// Hard cap on the alerts list so an all-day volatility event can't
// balloon memory. Newest first; we drop the oldest.
const MAX_ALERTS = 25;

// Resolve the live quote for a watched symbol from whichever stream
// owns it. Returns { price, changePct } or null.
function resolveQuote(symbol, { cryptoPrices, stocks, forex }) {
  const upper = symbol.toUpperCase();
  const cryptoKey = upper.toLowerCase();
  if (cryptoPrices[cryptoKey]) {
    const c = cryptoPrices[cryptoKey];
    return { price: c.price, changePct: c.changePct, assetClass: 'crypto' };
  }
  const stock = stocks.find((s) => s.symbol === upper);
  if (stock) return { price: stock.price, changePct: stock.changePct, assetClass: 'stock' };
  const fx = forex.find(
    (f) => f.symbol.replace('/', '') === upper || f.symbol === upper
  );
  if (fx) return { price: fx.price, changePct: fx.changePct, assetClass: 'forex' };
  return null;
}

function uid() {
  return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function AlertsProvider({ children }) {
  const market = useMarketData();

  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // null = not yet asked, 'granted' | 'denied' | 'default' (after the ask)
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  // Baseline prices — { [symbol]: { price, at: epochMs } }. Seeded the
  // first time we see a live quote, re-seeded after an alert fires.
  const baselineRef = useRef({});
  // Last-fired timestamps for cooldown dedupe.
  const lastFiredRef = useRef({});

  // Ask the browser for notification permission. Intentionally NOT
  // auto-called — a modal prompt on app load is user-hostile. The
  // AlertsCenter UI exposes a button that triggers this.
  const requestNotifications = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'unsupported';
    if (Notification.permission === 'granted') {
      setNotificationPermission('granted');
      return 'granted';
    }
    if (Notification.permission === 'denied') {
      setNotificationPermission('denied');
      return 'denied';
    }
    try {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      return result;
    } catch {
      return 'denied';
    }
  }, []);

  const fireBrowserNotification = useCallback((alert) => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      // Don't double-notify when the user is already looking.
      return;
    }
    try {
      const n = new Notification(`${alert.symbol} ${alert.changePct >= 0 ? '+' : ''}${alert.changePct.toFixed(2)}%`, {
        body: `Moved from ${alert.basePrice.toFixed(2)} to ${alert.price.toFixed(2)} in ${alert.windowLabel}.`,
        tag: `topstocx-alert-${alert.symbol}`,
        icon: '/favicon.svg',
      });
      // Auto-close after 10s so the OS tray doesn't pile up.
      setTimeout(() => { try { n.close(); } catch {} }, 10_000);
    } catch {}
  }, []);

  // Core watcher. Runs on every market-data render (prices tick several
  // times per second on crypto, every 5s on stocks). Cheap: one pass
  // over WATCHED_SYMBOLS with arithmetic.
  useEffect(() => {
    const { cryptoPrices, stocks, forex } = market;
    const now = Date.now();

    for (const sym of WATCHED_SYMBOLS) {
      const q = resolveQuote(sym, { cryptoPrices, stocks, forex });
      if (!q || !Number.isFinite(q.price)) continue;

      // Seed baseline the first time we see a real quote.
      if (!baselineRef.current[sym]) {
        baselineRef.current[sym] = { price: q.price, at: now };
        continue;
      }

      const base = baselineRef.current[sym];
      const deltaPct = ((q.price - base.price) / base.price) * 100;
      if (Math.abs(deltaPct) < THRESHOLD_PCT) continue;

      // Cooldown dedupe.
      const lastFired = lastFiredRef.current[sym] || 0;
      if (now - lastFired < COOLDOWN_MS) continue;

      lastFiredRef.current[sym] = now;

      // Re-seed the baseline so the next alert tracks the *next* leg
      // rather than the same cumulative move.
      baselineRef.current[sym] = { price: q.price, at: now };

      const minutesSinceBase = Math.max(1, Math.round((now - base.at) / 60_000));
      const windowLabel =
        minutesSinceBase < 60
          ? `${minutesSinceBase}m`
          : `${Math.round(minutesSinceBase / 60)}h`;

      const alert = {
        id: uid(),
        symbol: sym,
        price: q.price,
        basePrice: base.price,
        changePct: deltaPct,
        assetClass: q.assetClass,
        windowLabel,
        at: now,
        read: false,
      };

      setAlerts((prev) => [alert, ...prev].slice(0, MAX_ALERTS));
      setUnreadCount((n) => n + 1);
      fireBrowserNotification(alert);
    }
    // We intentionally depend on the full market object so we re-run
    // on every tick. The loop body is bounded by WATCHED_SYMBOLS.length.
  }, [market, fireBrowserNotification]);

  const markAllRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => (a.read ? a : { ...a, read: true })));
    setUnreadCount(0);
  }, []);

  const dismiss = useCallback((id) => {
    setAlerts((prev) => {
      const was = prev.find((a) => a.id === id);
      const next = prev.filter((a) => a.id !== id);
      if (was && !was.read) setUnreadCount((n) => Math.max(0, n - 1));
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  const value = useMemo(
    () => ({
      alerts,
      unreadCount,
      notificationPermission,
      requestNotifications,
      markAllRead,
      dismiss,
      clearAll,
      threshold: THRESHOLD_PCT,
    }),
    [alerts, unreadCount, notificationPermission, requestNotifications, markAllRead, dismiss, clearAll]
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error('useAlerts must be used inside AlertsProvider');
  return ctx;
}

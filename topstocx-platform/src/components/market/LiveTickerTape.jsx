/**
 * LiveTickerTape — the scrolling price bar at the top of the workspace.
 *
 * Two jobs:
 *   1. Show live prices. Binance WS for crypto, seeded random-walk for
 *      stocks/forex/indices (until a broker WS is wired).
 *   2. For every ticker moving more than NOTABLE_PCT in either direction,
 *      render a ✨ sparkle icon after the number. Click it → popover
 *      that streams a one-sentence, news-grounded explanation via the
 *      `why_moved` intent.
 *
 * Implementation notes:
 *   • CSS `@keyframes marquee` for the scroll. We duplicate the list so
 *     the translation wraps seamlessly — no JS animation loop, no jank
 *     on tab-switch.
 *   • Hovering the tape pauses the scroll (`animation-play-state: paused`)
 *     so the user can actually click a sparkle without chasing a moving
 *     target.
 *   • Popover closes on outside click / Escape. Only one open at a time.
 *   • Click on the symbol itself selects it in the chart (LeverateContext).
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ExternalLink } from 'lucide-react';
import { useMarketData } from '../../context/MarketDataContext';
import { useLeverate } from '../../context/LeverateContext';
import { streamWhyMoved } from '../../services/topstocxAI';

// A move is "notable" if |changePct| ≥ this. We show the sparkle on
// these so the user knows a story is waiting. Chosen low enough to
// catch interesting intraday moves on liquid tickers, high enough
// to filter ordinary chop.
const NOTABLE_PCT = 2;

// How many items to render. The marquee duplicates internally so
// effective count is 2x — keep this modest to avoid a runaway row.
const MAX_ITEMS = 14;

function fmtPrice(p) {
  if (p == null || !Number.isFinite(p)) return '—';
  if (p >= 1000) return p.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(2);
  return p.toFixed(4);
}

function fmtPct(p) {
  if (p == null || !Number.isFinite(p)) return '';
  return `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;
}

export default function LiveTickerTape() {
  const { cryptoPrices, stocks, indices, forex } = useMarketData();
  const { setSelectedSymbol } = useLeverate();

  // Active popover: { symbol, anchor:DOMRect, explanation? }
  const [activeExplain, setActiveExplain] = useState(null);
  // explanation cache keyed by symbol — { text, citations, loading, error }
  const [explanationCache, setExplanationCache] = useState({});
  const abortRef = useRef(null);

  // Close active explain on Escape / outside click.
  const tapeRef = useRef(null);
  useEffect(() => {
    if (!activeExplain) return;
    const onKey = (e) => { if (e.key === 'Escape') setActiveExplain(null); };
    const onDoc = (e) => {
      // Clicks inside a rendered popover stay open.
      if (e.target.closest?.('[data-explain-popover]')) return;
      setActiveExplain(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDoc);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [activeExplain]);

  useEffect(() => () => { try { abortRef.current?.abort(); } catch {} }, []);

  // Build the displayed list. Mix crypto + stocks + indices; de-dupe by symbol.
  const items = useMemo(() => {
    const picks = [];
    const seen = new Set();
    const push = (obj) => {
      if (!obj || !obj.symbol || seen.has(obj.symbol)) return;
      seen.add(obj.symbol);
      picks.push(obj);
    };

    // Headline crypto first (most users care about BTC/ETH instantly).
    ['btcusdt', 'ethusdt', 'solusdt', 'bnbusdt', 'xrpusdt', 'dogeusdt'].forEach((k) => {
      const c = cryptoPrices[k];
      if (!c) return;
      push({
        symbol: c.symbol.replace('USDT', ''),
        canonical: c.symbol, // BTCUSDT — what we send to setSelectedSymbol
        price: c.price,
        changePct: c.changePct,
        kind: 'crypto',
      });
    });

    // Mega-cap stocks next.
    ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN'].forEach((sym) => {
      const s = stocks.find((x) => x.symbol === sym);
      if (!s) return;
      push({
        symbol: s.symbol,
        canonical: s.symbol,
        price: s.price,
        changePct: s.changePct,
        kind: 'stock',
      });
    });

    // Indices to round it out.
    ['SPX', 'NDX', 'DJI'].forEach((sym) => {
      const i = indices.find((x) => x.symbol === sym);
      if (!i) return;
      push({
        symbol: i.symbol,
        canonical: i.symbol,
        price: i.price,
        changePct: i.changePct,
        kind: 'index',
      });
    });

    return picks.slice(0, MAX_ITEMS);
  }, [cryptoPrices, stocks, indices]);

  // Duplicate items once so the marquee can translate -50% and wrap
  // without a visible seam.
  const tapeItems = useMemo(() => [...items, ...items], [items]);

  const handleSparkleClick = (e, item) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const key = item.canonical;

    // Toggle off if we're clicking the currently-active sparkle.
    if (activeExplain?.symbol === key) {
      setActiveExplain(null);
      return;
    }

    setActiveExplain({ symbol: key, displaySymbol: item.symbol, anchor: rect });

    // Skip network if we already have an explanation for this symbol
    // and the move hasn't materially changed since then. We accept
    // slightly stale text in exchange for no extra tokens on a double-tap.
    if (explanationCache[key]?.text && !explanationCache[key]?.error) {
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setExplanationCache((prev) => ({
      ...prev,
      [key]: { text: '', citations: [], loading: true, error: null },
    }));

    streamWhyMoved(
      {
        symbol: item.canonical,
        price: item.price,
        changePct: Number(item.changePct.toFixed(2)),
        window: 'session',
      },
      {
        signal: ctrl.signal,
        onDelta: (chunk) => {
          setExplanationCache((prev) => ({
            ...prev,
            [key]: {
              ...(prev[key] || {}),
              text: (prev[key]?.text || '') + chunk,
              loading: true,
              error: null,
            },
          }));
        },
      }
    )
      .then((final) => {
        if (ctrl.signal.aborted) return;
        setExplanationCache((prev) => ({
          ...prev,
          [key]: {
            text: final.text || prev[key]?.text || '',
            citations: final.citations || [],
            loading: false,
            error: null,
          },
        }));
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setExplanationCache((prev) => ({
          ...prev,
          [key]: {
            ...(prev[key] || {}),
            loading: false,
            error: err.message || 'Could not fetch.',
          },
        }));
      });
  };

  const current = activeExplain ? explanationCache[activeExplain.symbol] : null;

  return (
    <div
      ref={tapeRef}
      style={{
        position: 'relative',
        height: 28,
        background: 'rgba(0,0,0,0.25)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <div
        className="ts-tape-track"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: 'max-content',
          // Pause on hover so the sparkle is clickable.
          animation: 'tsTapeScroll 60s linear infinite',
          willChange: 'transform',
        }}
      >
        {tapeItems.map((item, i) => {
          const up = item.changePct >= 0;
          const color = up ? '#39B54A' : '#ff5468';
          const notable = Math.abs(item.changePct ?? 0) >= NOTABLE_PCT;
          return (
            <div
              key={`${item.symbol}-${i}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0 14px',
                fontSize: 12,
                whiteSpace: 'nowrap',
                borderRight: '1px solid rgba(255,255,255,0.04)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedSymbol(item.canonical)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#e6e9ef',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: 12,
                }}
                title={`Load ${item.symbol} chart`}
              >
                {item.symbol}
              </button>
              <span style={{ color: '#c8ced9' }}>{fmtPrice(item.price)}</span>
              <span style={{ color, fontWeight: 600 }}>{fmtPct(item.changePct)}</span>
              {notable && (
                <button
                  type="button"
                  onClick={(e) => handleSparkleClick(e, item)}
                  aria-label={`Why did ${item.symbol} move?`}
                  title="Ask AI why"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 18,
                    height: 18,
                    padding: 0,
                    background: 'rgba(0,132,255,0.12)',
                    border: '1px solid rgba(0,132,255,0.3)',
                    borderRadius: 4,
                    color: '#8bb4ff',
                    cursor: 'pointer',
                    animation: 'tsSparkPulse 2.5s ease-in-out infinite',
                  }}
                >
                  <Sparkles size={10} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeExplain && (
          <motion.div
            data-explain-popover
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: Math.min(
                window.innerHeight - 180,
                (activeExplain.anchor?.bottom ?? 0) + 6
              ),
              left: Math.max(
                8,
                Math.min(
                  window.innerWidth - 340,
                  (activeExplain.anchor?.left ?? 0) - 140
                )
              ),
              width: 320,
              background: 'rgba(16,18,26,0.98)',
              border: '1px solid rgba(0,132,255,0.3)',
              borderRadius: 8,
              padding: '10px 12px',
              boxShadow: '0 14px 36px rgba(0,0,0,0.55)',
              zIndex: 200,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={11} color="#8bb4ff" />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#8bb4ff',
                    letterSpacing: 0.3,
                    textTransform: 'uppercase',
                  }}
                >
                  Why {activeExplain.displaySymbol} moved
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveExplain(null)}
                aria-label="Close"
                style={{
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  color: '#8a93a6',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={12} />
              </button>
            </div>

            {current?.error ? (
              <div style={{ fontSize: 12, color: '#ffb4b4', lineHeight: 1.5 }}>
                {current.error}
              </div>
            ) : !current?.text && current?.loading ? (
              <ShimmerLines />
            ) : (
              <>
                <div
                  style={{
                    fontSize: 12.5,
                    lineHeight: 1.55,
                    color: '#d6dbe6',
                  }}
                >
                  {current?.text || '…'}
                </div>
                {Array.isArray(current?.citations) && current.citations.length > 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      paddingTop: 6,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    {current.citations.slice(0, 3).map((url, i) => {
                      let host = url;
                      try { host = new URL(url).hostname.replace('www.', ''); } catch {}
                      return (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            color: '#8bb4ff',
                            fontSize: 10.5,
                            textDecoration: 'none',
                          }}
                        >
                          <ExternalLink size={9} />
                          {host}
                        </a>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes tsTapeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ts-tape-track:hover {
          animation-play-state: paused !important;
        }
        @keyframes tsSparkPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,132,255,0.4); }
          50%      { box-shadow: 0 0 0 4px rgba(0,132,255,0); }
        }
      `}</style>
    </div>
  );
}

function ShimmerLines() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {[92, 78].map((w, i) => (
        <div
          key={i}
          style={{
            height: 8,
            width: `${w}%`,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
            backgroundSize: '200% 100%',
            borderRadius: 3,
            animation: 'tsShimmer 1.4s ease-in-out infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes tsShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

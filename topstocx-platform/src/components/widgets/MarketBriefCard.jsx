/**
 * MarketBriefCard — the first thing a user sees when /chart loads.
 *
 * Three bullets on what's driving markets right now. Live, web-grounded
 * (Perplexity sonar-pro with search_recency_filter='day' + finance
 * domain whitelist on the server). Auto-loads once per session; users
 * can tap the refresh button to re-ground.
 *
 * Lives in the right sidebar, above the watchlist. Keeps the cognitive
 * load low — a trader glances at it, sees "oh Fed minutes dropped,
 * dollar up, crypto bid", and moves on.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { streamMarketBrief } from '../../services/topstocxAI';

export default function MarketBriefCard() {
  const { getAIContext } = useAI();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const abortRef = useRef(null);

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    setData({ text: '', citations: [] });

    try {
      const ctx = getAIContext();
      const final = await streamMarketBrief(
        {
          // Brief doesn't need a specific symbol — it's market-wide.
          // We pass tier + timeOfDay so the prompt can be tuned.
          tier: ctx.tier,
          timeOfDay: ctx.timeOfDay,
        },
        {
          signal: ctrl.signal,
          onDelta: (chunk) => {
            setData(prev => ({
              ...(prev || {}),
              text: (prev?.text || '') + chunk,
            }));
          },
        }
      );
      if (ctrl.signal.aborted) return;
      setData(final);
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(e.message || 'Brief unavailable.');
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [getAIContext]);

  // Auto-load on mount. The 60s topstocxAI cache keeps repeat opens
  // (same session, same user flipping between tabs) from re-billing.
  useEffect(() => {
    run();
    return () => abortRef.current?.abort();
  }, [run]);

  // Parse the text into bullets. Server prompt asks for 3 short lines;
  // we split on newline and dash/bullet markers so either format works.
  const bullets = parseBullets(data?.text);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        padding: '12px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(180deg, rgba(0,90,255,0.06), rgba(0,90,255,0.01))',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Newspaper size={13} color="#0084FF" />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>
            AI Market Brief
          </span>
          <span
            style={{
              fontSize: 10,
              color: '#8a93a6',
              padding: '1px 5px',
              background: 'rgba(0,90,255,0.1)',
              border: '1px solid rgba(0,90,255,0.2)',
              borderRadius: 3,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            Live
          </span>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          aria-label="Refresh brief"
          title="Refresh"
          style={{
            width: 22,
            height: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: loading ? '#5a6578' : '#b0b8cc',
            cursor: loading ? 'default' : 'pointer',
            padding: 0,
            borderRadius: 3,
          }}
        >
          <RefreshCw
            size={12}
            style={loading ? { animation: 'spin 1s linear infinite' } : undefined}
          />
        </button>
      </header>

      {loading && !data?.text && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[90, 78, 85].map((w, i) => (
            <div
              key={i}
              style={{
                height: 9,
                width: `${w}%`,
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
                backgroundSize: '200% 100%',
                borderRadius: 3,
                animation: 'shimmer 1.4s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: 8,
            background: 'rgba(255,80,80,0.08)',
            border: '1px solid rgba(255,80,80,0.25)',
            borderRadius: 4,
            fontSize: 11.5,
            color: '#ffb4b4',
          }}
        >
          <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      {bullets.length > 0 && !error && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {bullets.map((b, i) => (
            <li
              key={i}
              style={{
                fontSize: 11.5,
                lineHeight: 1.5,
                color: '#d6dbe6',
                paddingLeft: 10,
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#0084FF',
                }}
              />
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* Sources — collapsed by default to keep the card compact. */}
      {Array.isArray(data?.citations) && data.citations.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8a93a6',
              fontSize: 10.5,
              padding: 0,
              cursor: 'pointer',
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            {expanded ? 'Hide sources' : `${data.citations.length} sources`}
          </button>
          {expanded && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {data.citations.slice(0, 6).map((url, i) => {
                let host = url;
                try { host = new URL(url).hostname.replace('www.', ''); } catch {}
                return (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        color: '#8bb4ff',
                        fontSize: 10.5,
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={9} />
                      {host}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </motion.div>
  );
}

function parseBullets(text) {
  if (!text || typeof text !== 'string') return [];
  // Split on newlines, strip leading bullet markers, drop empties,
  // cap at 4 so a chatty model can't blow out the card height.
  return text
    .split(/\r?\n/)
    .map(l => l.trim().replace(/^[-*•\d.]+\s*/, ''))
    .filter(Boolean)
    .slice(0, 4);
}

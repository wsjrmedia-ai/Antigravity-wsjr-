/**
 * TradeIdeaTab — full LONG/SHORT setup for the symbol on screen.
 *
 * Server returns a fixed format:
 *   **SYMBOL — LONG/SHORT setup**
 *   Entry: $X
 *   Stop: $Y (R: Z%)
 *   Target 1: $A
 *   Target 2: $B
 *   Reasoning: [...]
 *
 * We parse that into structured fields so we can render entry/stop/
 * targets as real cards with color-coded risk, rather than a blob.
 * If parsing fails we fall back to the raw text — never a lie.
 *
 * No caching beyond what the service already does. Refresh = one-tap.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, Sparkles, RefreshCw, TrendingUp, TrendingDown, Shield, ExternalLink } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { streamTradeIdea } from '../../services/topstocxAI';

export default function TradeIdeaTab() {
  const { getAIContext } = useAI();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // Remember which symbol the last idea was generated for so we can
  // nudge the user to refresh when they switch. We don't auto-refresh
  // on symbol change — a trade idea is a commitment, not a tooltip.
  const [generatedFor, setGeneratedFor] = useState(null);

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    // Reset so previous idea doesn't flash while the new one streams.
    setData({ text: '', citations: [] });

    try {
      const ctx = getAIContext();
      if (!ctx.price) {
        throw new Error('Waiting for live price. Try again shortly.');
      }

      const final = await streamTradeIdea(ctx, {
        signal: ctrl.signal,
        onDelta: (chunk) => {
          setData(prev => ({
            ...(prev || {}),
            text: (prev?.text || '') + chunk,
          }));
        },
      });
      if (ctrl.signal.aborted) return;
      setData(final);
      setGeneratedFor(ctx.symbol);
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(e.message || "Couldn't generate an idea.");
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [getAIContext]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ctx = getAIContext();
  const stale = generatedFor && generatedFor !== ctx.symbol;
  const parsed = data?.text ? parseTradeIdea(data.text) : null;

  return (
    <div style={{ padding: 20, height: '100%', overflowY: 'auto' }}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Sparkles size={14} color="#0084FF" />
          <span style={styles.title}>AI Trade Idea</span>
          <span style={styles.symbolChip}>
            {ctx.symbol} · {ctx.timeframe}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {data && (
            <button
              type="button"
              onClick={run}
              disabled={loading}
              style={styles.secondaryBtn}
            >
              <RefreshCw size={12} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
              Refresh
            </button>
          )}
          <button
            type="button"
            onClick={run}
            disabled={loading}
            style={styles.primaryBtn}
          >
            {loading ? 'Analyzing…' : data ? 'Regenerate' : 'Generate Idea'}
          </button>
        </div>
      </header>

      {stale && data && (
        <div style={styles.staleBanner}>
          <AlertTriangle size={12} />
          Idea was generated for {generatedFor}. Refresh for {ctx.symbol}.
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <AlertTriangle size={14} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>Couldn't generate</div>
            <div style={{ opacity: 0.9 }}>{error}</div>
          </div>
        </div>
      )}

      {!data?.text && !error && !loading && (
        <div style={styles.empty}>
          <Target size={18} style={{ opacity: 0.5 }} />
          <div style={{ marginTop: 10, fontSize: 13, color: '#9aa3b6' }}>
            Generate a ranked LONG/SHORT setup with entry, stop, and targets
            grounded in today's price action.
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: '#6a7285' }}>
            Powered by sonar-pro · live web-grounded
          </div>
        </div>
      )}

      {loading && !data?.text && (
        <div style={styles.skeletonGrid}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={styles.skeletonCard} />
          ))}
        </div>
      )}

      {parsed && data?.text && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div style={styles.directionBadge(parsed.direction)}>
            {parsed.direction === 'LONG' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {parsed.direction || 'SETUP'}
          </div>

          <div style={styles.grid}>
            <LevelCard
              label="Entry"
              value={parsed.entry}
              accent="#8a93a6"
              icon={<Target size={12} />}
            />
            <LevelCard
              label="Stop"
              value={parsed.stop}
              sub={parsed.riskPct ? `R: ${parsed.riskPct}` : null}
              accent="#ff5468"
              icon={<Shield size={12} />}
            />
            <LevelCard
              label="Target 1"
              value={parsed.target1}
              accent="#39B54A"
              icon={<TrendingUp size={12} />}
            />
            <LevelCard
              label="Target 2"
              value={parsed.target2}
              accent="#39B54A"
              icon={<TrendingUp size={12} />}
            />
          </div>

          {parsed.reasoning && (
            <div style={styles.reasonBox}>
              <div style={styles.reasonLabel}>Reasoning</div>
              <div style={styles.reasonText}>{parsed.reasoning}</div>
            </div>
          )}

          {/* If the model refused ("no setup — wait"), we still render
              the raw text. Traders need to see that the AI didn't force
              a bad entry. */}
          {!parsed.entry && (
            <div style={styles.rawText}>{data.text}</div>
          )}

          {Array.isArray(data?.citations) && data.citations.length > 0 && (
            <div style={styles.sources}>
              <div style={styles.sourcesLabel}>Sources</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {data.citations.slice(0, 5).map((url, i) => {
                  let host = url;
                  try { host = new URL(url).hostname.replace('www.', ''); } catch {}
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.sourceLink}
                    >
                      <ExternalLink size={10} />
                      {host}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div style={styles.disclaimer}>
            Not financial advice. Levels are AI-generated and should be
            validated against your own risk rules before execution.
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function LevelCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 8,
      padding: '12px 14px',
      borderLeft: `3px solid ${accent}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: '#8a93a6', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#f4f6fb', fontVariantNumeric: 'tabular-nums' }}>
        {value || '—'}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: '#8a93a6', marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}

/**
 * Parse the fixed server format into fields. The model sticks to the
 * template 95% of the time; when it doesn't we return partial data and
 * the UI falls back to showing the raw text.
 */
function parseTradeIdea(text) {
  if (!text) return null;
  const direction = /\b(LONG|SHORT)\b/i.exec(text)?.[1]?.toUpperCase() || null;
  const entry = extractLevel(text, /entry\s*[:\-]\s*\$?([\d.,]+)/i);
  const stop = extractLevel(text, /stop\s*(?:loss)?\s*[:\-]\s*\$?([\d.,]+)/i);
  const target1 = extractLevel(text, /target\s*1?\s*[:\-]\s*\$?([\d.,]+)/i);
  const target2 = extractLevel(text, /target\s*2\s*[:\-]\s*\$?([\d.,]+)/i);
  const riskPct = /R\s*:\s*([\d.]+\s*%)/i.exec(text)?.[1] || null;
  const reasoningMatch = /reasoning\s*[:\-]\s*([\s\S]+?)(?=\n\n|$)/i.exec(text);
  const reasoning = reasoningMatch ? reasoningMatch[1].trim() : null;

  return { direction, entry, stop, target1, target2, riskPct, reasoning };
}

function extractLevel(text, re) {
  const m = re.exec(text);
  if (!m) return null;
  return '$' + m[1].replace(/,$/, '');
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 10,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.3,
  },
  symbolChip: {
    fontSize: 11,
    color: '#8a93a6',
    padding: '2px 6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 4,
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: 'linear-gradient(135deg, #005AFF, #0084FF)',
    border: 'none',
    borderRadius: 6,
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.3,
    cursor: 'pointer',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '6px 10px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 6,
    color: '#b0b8cc',
    fontSize: 11.5,
    fontWeight: 600,
    cursor: 'pointer',
  },
  staleBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    padding: '6px 10px',
    background: 'rgba(255, 180, 0, 0.08)',
    border: '1px solid rgba(255, 180, 0, 0.25)',
    borderRadius: 6,
    fontSize: 11.5,
    color: '#ffc94d',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    background: 'rgba(255,80,80,0.08)',
    border: '1px solid rgba(255,80,80,0.25)',
    borderRadius: 8,
    color: '#ffb4b4',
    fontSize: 12.5,
  },
  empty: {
    textAlign: 'center',
    padding: '24px 20px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px dashed rgba(255,255,255,0.08)',
    borderRadius: 8,
  },
  skeletonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 10,
  },
  skeletonCard: {
    height: 72,
    background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s ease-in-out infinite',
    borderRadius: 8,
  },
  directionBadge: (dir) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    background: dir === 'SHORT'
      ? 'rgba(255, 84, 104, 0.15)'
      : 'rgba(57, 181, 74, 0.15)',
    border: `1px solid ${dir === 'SHORT' ? 'rgba(255,84,104,0.4)' : 'rgba(57,181,74,0.4)'}`,
    borderRadius: 999,
    color: dir === 'SHORT' ? '#ff8a96' : '#7de088',
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.5,
    marginBottom: 14,
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 10,
    marginBottom: 14,
  },
  reasonBox: {
    padding: 12,
    background: 'rgba(0, 90, 255, 0.05)',
    border: '1px solid rgba(0, 90, 255, 0.15)',
    borderRadius: 8,
    marginBottom: 10,
  },
  reasonLabel: {
    fontSize: 10.5,
    color: '#8a93a6',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 1.55,
    color: '#d6dbe6',
  },
  rawText: {
    padding: 12,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    fontSize: 13,
    lineHeight: 1.55,
    color: '#d6dbe6',
    whiteSpace: 'pre-wrap',
  },
  sources: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  sourcesLabel: {
    fontSize: 10.5,
    color: '#8a93a6',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  sourceLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    color: '#8bb4ff',
    fontSize: 11,
    textDecoration: 'none',
  },
  disclaimer: {
    marginTop: 12,
    fontSize: 10.5,
    color: '#6a7285',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
};

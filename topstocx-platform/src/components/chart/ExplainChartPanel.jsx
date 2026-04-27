/**
 * ExplainChartPanel — the first AI feature users touch on Supercharts.
 *
 * A single button sits on the chart. Tap it → we send the current
 * symbol + price + timeframe to /api/ai/analyze with intent=explain_chart.
 * The server returns a 3-sentence read (structure / catalyst / what to
 * watch) grounded in today's news via Perplexity sonar-pro.
 *
 * Design rules:
 *   • No demo text. If we haven't called the API yet, the panel is blank.
 *   • No fake loading — the spinner only spins while a request is live.
 *   • Errors surface as errors. We do NOT show a "friendly" fake answer.
 *   • One in-flight request at a time; re-tapping cancels the old one.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { streamExplainChart } from '../../services/topstocxAI';

export default function ExplainChartPanel() {
  const { getAIContext } = useAI();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);      // { text, citations, model }
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  // Re-run analysis. Streams tokens as they arrive so the panel fills
  // in word-by-word instead of sitting on a spinner. Cancels any
  // in-flight request first.
  const run = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    // Reset text so each run starts empty — otherwise the old answer
    // would stay visible while the new one streamed over it.
    setData({ text: '', citations: [], model: null });

    try {
      const ctx = getAIContext();
      if (!ctx.price) {
        throw new Error('Waiting for live price feed. Try again in a second.');
      }

      const final = await streamExplainChart(ctx, {
        signal: ctrl.signal,
        onDelta: (chunk) => {
          // Append each token as it arrives. Functional setState so
          // rapid deltas don't race on stale state.
          setData(prev => ({
            ...(prev || {}),
            text: (prev?.text || '') + chunk,
          }));
        },
      });

      if (ctrl.signal.aborted) return;
      // Final event carries citations + model, which only arrive at
      // the end of the stream.
      setData(final);
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(e.message || 'Something went wrong.');
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [getAIContext]);

  // Fire the first analysis the moment the panel opens. Subsequent
  // opens reuse the cached response from topstocxAI's 60s cache —
  // so the user doesn't burn tokens every time they close/reopen.
  useEffect(() => {
    if (open && !data && !loading) run();
  }, [open, data, loading, run]);

  // Tidy up on unmount — no zombie fetches after navigating away.
  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <>
      <style>{`
        .ep-btn { min-width: 34px; }
        .ep-btn-label { display: inline; }
        @media (max-width: 480px) {
          .ep-btn { padding: 0 8px !important; }
          .ep-btn-label { display: none; }
        }
        .ep-panel {
          position: absolute;
          top: 54px;
          right: 12px;
          z-index: 25;
          width: min(360px, calc(100vw - 24px));
          max-height: calc(100% - 70px);
          overflow-y: auto;
        }
        @media (max-width: 480px) {
          .ep-panel {
            top: 54px !important;
            right: 6px !important;
            left: 6px !important;
            width: calc(100vw - 12px) !important;
            max-height: calc(100vh - 140px) !important;
          }
        }
        @media (max-width: 360px) {
          .ep-panel {
            right: 4px !important;
            left: 4px !important;
            width: calc(100vw - 8px) !important;
          }
        }
      `}</style>

      {/* Trigger button — sits on the chart, top-right corner under fullscreen */}
      <motion.button
        type="button"
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.96 }}
        aria-label="Explain this chart with AI"
        title="AI read of the chart"
        className="ep-btn"
        style={{
          position: 'absolute',
          top: 10,
          right: 54,
          zIndex: 20,
          height: 34,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: open
            ? 'linear-gradient(135deg, #005AFF, #0084FF)'
            : 'rgba(19, 23, 34, 0.75)',
          border: `1px solid ${open ? 'rgba(0,132,255,0.8)' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 6,
          color: '#e6e9ef',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0.3,
          transition: 'background 0.15s ease, border-color 0.15s ease',
        }}
      >
        <Sparkles size={14} />
        <span className="ep-btn-label">Explain</span>
      </motion.button>

      {/* Slide-out panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="explain-panel"
            className="ep-panel"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              background: 'rgba(14, 18, 28, 0.96)',
              border: '1px solid rgba(0, 132, 255, 0.25)',
              borderRadius: 10,
              color: '#e6e9ef',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,90,255,0.15)',
            }}
          >
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={14} color="#0084FF" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>AI read</span>
                <span
                  style={{
                    fontSize: 11,
                    color: '#8a93a6',
                    padding: '2px 6px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 4,
                  }}
                >
                  {getAIContext().symbol} · {getAIContext().timeframe}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  onClick={() => { setData(null); run(); }}
                  aria-label="Refresh"
                  title="Refresh"
                  disabled={loading}
                  style={iconBtnStyle(loading)}
                >
                  <RefreshCw size={14} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={iconBtnStyle(false)}
                >
                  <X size={14} />
                </button>
              </div>
            </header>

            <div style={{ padding: '14px' }}>
              {/* Show skeleton only until the first token lands. After that,
                  the text itself is the progress indicator. */}
              {loading && !data?.text && <SkeletonLines />}

              {error && (
                <div
                  role="alert"
                  style={{
                    display: 'flex',
                    gap: 8,
                    padding: 10,
                    background: 'rgba(255, 80, 80, 0.08)',
                    border: '1px solid rgba(255, 80, 80, 0.25)',
                    borderRadius: 6,
                    fontSize: 12.5,
                    color: '#ffb4b4',
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>Couldn't analyze</div>
                    <div style={{ opacity: 0.85 }}>{error}</div>
                  </div>
                </div>
              )}

              {data?.text && !error && (
                <div style={{ fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                  {data.text}
                </div>
              )}

              {Array.isArray(data?.citations) && data.citations.length > 0 && (
                <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10.5, color: '#8a93a6', marginBottom: 6, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                    Sources
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {data.citations.slice(0, 4).map((url, i) => (
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
                            fontSize: 11.5,
                            textDecoration: 'none',
                            wordBreak: 'break-all',
                          }}
                        >
                          <ExternalLink size={10} />
                          {new URL(url).hostname.replace('www.', '')}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data?.model && (
                <div style={{ marginTop: 10, fontSize: 10, color: '#5a6578' }}>
                  {data.model}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Local spin keyframes — scoped by name only, but we're a leaf
          component so collision risk is nil. */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

function iconBtnStyle(disabled) {
  return {
    width: 26,
    height: 26,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    color: disabled ? '#5a6578' : '#b0b8cc',
    cursor: disabled ? 'default' : 'pointer',
    borderRadius: 4,
  };
}

function SkeletonLines() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {[88, 74, 92, 60].map((w, i) => (
        <div
          key={i}
          style={{
            height: 10,
            width: `${w}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
            backgroundSize: '200% 100%',
            borderRadius: 4,
            animation: 'shimmer 1.4s ease-in-out infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

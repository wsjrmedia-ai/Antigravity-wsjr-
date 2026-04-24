/**
 * RiskCheckChip — a compact AI risk audit for open positions.
 *
 * Only renders when the user actually has positions (no empty-state
 * noise). The chip shows a passive "Risk OK" / "⚠ Risk" state, and
 * on click opens a mini popover with the AI's read.
 *
 * Freshness rule: we memo the analysis against a fingerprint of the
 * positions array. If the book hasn't changed, we don't re-request —
 * even if the user closes and re-opens the popover.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, X, RefreshCw, AlertCircle } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';
import { riskCheck } from '../../services/topstocxAI';

// Serialize just the fields that matter for risk — symbol + size +
// side. Ignores floating P&L so ticking prices don't re-trigger.
function fingerprintPositions(positions) {
  if (!Array.isArray(positions) || positions.length === 0) return '';
  return positions
    .map(p => `${p.InstrumentName || p.Symbol}:${p.ActionType}:${p.Amount}`)
    .sort()
    .join('|');
}

export default function RiskCheckChip() {
  const { positions } = useLeverate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analyzedFp, setAnalyzedFp] = useState('');
  const abortRef = useRef(null);

  const fp = useMemo(() => fingerprintPositions(positions), [positions]);
  const hasPositions = positions.length > 0;

  // Heuristic severity. The real AI read drives copy; this just picks
  // the icon color before the request completes.
  const severity = classifyLocal(positions);

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);

    try {
      const res = await riskCheck(
        {
          positions: positions.map(p => ({
            symbol: p.InstrumentName || p.Symbol,
            side: p.ActionType === 0 ? 'LONG' : 'SHORT',
            size: p.Amount,
            entry: p.OpenRate,
            mark: p.CurrentRate,
            pnl: p.ProfitInAccountCurrency,
          })),
        },
        { signal: ctrl.signal }
      );
      if (ctrl.signal.aborted) return;
      setData(res);
      setAnalyzedFp(fp);
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(e.message || 'Risk check failed.');
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [positions, fp]);

  // Auto-fetch the first time the popover opens for a new fingerprint.
  useEffect(() => {
    if (open && hasPositions && analyzedFp !== fp && !loading) {
      run();
    }
  }, [open, hasPositions, analyzedFp, fp, loading, run]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!hasPositions) return null;

  const bullets = parseBullets(data?.text);

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label="AI risk check"
        title="AI risk check on open positions"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          padding: '4px 10px',
          height: 26,
          background: severity === 'warn'
            ? 'rgba(255, 180, 0, 0.1)'
            : 'rgba(57, 181, 74, 0.08)',
          border: `1px solid ${severity === 'warn' ? 'rgba(255,180,0,0.35)' : 'rgba(57,181,74,0.3)'}`,
          borderRadius: 999,
          color: severity === 'warn' ? '#ffc94d' : '#7de088',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.4,
          cursor: 'pointer',
        }}
      >
        {severity === 'warn' ? <ShieldAlert size={11} /> : <Shield size={11} />}
        {severity === 'warn' ? 'Risk' : 'Risk OK'}
        <span style={{ fontSize: 10, opacity: 0.75, marginLeft: 2 }}>
          · {positions.length}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              zIndex: 50,
              width: 320,
              maxWidth: 'calc(100vw - 24px)',
              background: 'rgba(14, 18, 28, 0.98)',
              border: '1px solid rgba(0, 132, 255, 0.25)',
              borderRadius: 8,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              color: '#e6e9ef',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldAlert size={13} color="#0084FF" />
                <span style={{ fontSize: 12, fontWeight: 700 }}>AI Risk Check</span>
                <span style={{ fontSize: 10.5, color: '#8a93a6' }}>
                  · {positions.length} position{positions.length === 1 ? '' : 's'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                <button
                  type="button"
                  onClick={run}
                  disabled={loading}
                  aria-label="Refresh"
                  style={iconBtn}
                >
                  <RefreshCw size={12} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={iconBtn}
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            <div style={{ padding: 12 }}>
              {loading && !data && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[88, 74, 82].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: 9,
                        width: `${w}%`,
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.10), rgba(255,255,255,0.04))',
                        backgroundSize: '200% 100%',
                        borderRadius: 3,
                        animation: 'shimmer 1.4s ease-in-out infinite',
                      }}
                    />
                  ))}
                </div>
              )}

              {error && (
                <div style={{
                  display: 'flex',
                  gap: 6,
                  padding: 8,
                  background: 'rgba(255,80,80,0.08)',
                  border: '1px solid rgba(255,80,80,0.25)',
                  borderRadius: 5,
                  fontSize: 11.5,
                  color: '#ffb4b4',
                }}>
                  <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              {bullets.length > 0 && !error && (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: 12,
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
                          background: severity === 'warn' ? '#ffc94d' : '#39B54A',
                        }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const iconBtn = {
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  color: '#b0b8cc',
  cursor: 'pointer',
  padding: 0,
  borderRadius: 3,
};

// Heuristic severity BEFORE the AI responds. Used only for chip color —
// the popover copy still comes from the AI. Three or more positions
// in the same "family" (all crypto, all tech, all USD pairs) flags warn.
function classifyLocal(positions) {
  if (positions.length < 3) return 'ok';
  const names = positions.map(p => (p.InstrumentName || p.Symbol || '').toUpperCase());
  const sameFamily = (predicate) => names.filter(predicate).length >= 3;

  if (sameFamily(n => /USDT|USD|BTC|ETH|SOL|BNB|XRP|ADA|DOGE/.test(n))) return 'warn';
  if (sameFamily(n => ['AAPL','MSFT','NVDA','GOOGL','META','AMD','TSLA','AMZN'].includes(n))) return 'warn';
  return 'ok';
}

function parseBullets(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .split(/\r?\n/)
    .map(l => l.trim().replace(/^[-*•\d.]+\s*/, ''))
    .filter(Boolean)
    .slice(0, 4);
}

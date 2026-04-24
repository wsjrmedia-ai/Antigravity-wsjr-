/**
 * AICommandPalette — the one-keystroke way to ask the AI anything.
 *
 * Trigger: ⌘K / Ctrl+K, or the floating "Ask AI" button (mobile).
 *
 * This is the feature that makes Topstocx feel AI-native rather than
 * "a trading dashboard with AI bolted on". The user types whatever
 * is in their head — "what's moving NVDA", "give me a setup for BTC",
 * "am I too concentrated" — and we route it to the right intent.
 *
 * Routing rules (client-side, zero API cost to decide):
 *   • explicit slash commands:  /idea, /brief, /risk, /switch SYM
 *   • "trade idea|setup|long|short" → trade_idea
 *   • "brief|what's happening|news|today" → market_brief
 *   • "risk|concentration|my positions" → risk_check
 *   • "switch|go to|chart" + symbol → setSelectedSymbol only (no AI)
 *   • anything else → explain_chart with the query as the user message
 *
 * Every routed call streams through the same /api/ai/analyze endpoint
 * so we don't duplicate grounding or prompt logic.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, CornerDownLeft, Command as CommandIcon, ExternalLink, AlertCircle } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useLeverate } from '../../context/LeverateContext';
import { analyzeWithAI } from '../../services/topstocxAI';

// Recognised symbols — kept in sync with the watchlist. If the user
// types "switch to TSLA" we match against this set.
const KNOWN_SYMBOLS = [
  'AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMZN', 'GOOGL', 'META', 'AMD',
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT',
  'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCHF', 'USDCAD',
];

// Colloquial → canonical map. Users say "bitcoin", we want "BTCUSDT".
const SYMBOL_ALIASES = {
  BITCOIN: 'BTCUSDT', BTC: 'BTCUSDT',
  ETHEREUM: 'ETHUSDT', ETH: 'ETHUSDT',
  SOLANA: 'SOLUSDT', SOL: 'SOLUSDT',
  DOGE: 'DOGEUSDT', DOGECOIN: 'DOGEUSDT',
  APPLE: 'AAPL',
  TESLA: 'TSLA',
  NVIDIA: 'NVDA',
  MICROSOFT: 'MSFT',
  AMAZON: 'AMZN',
  GOOGLE: 'GOOGL',
};

const QUICK_PROMPTS = [
  { label: "What's driving markets today?", route: 'brief' },
  { label: 'Give me a trade idea',           route: 'idea' },
  { label: 'Explain this chart',             route: 'explain' },
  { label: 'Check my risk',                  route: 'risk' },
];

function resolveSymbol(token) {
  if (!token) return null;
  const up = token.toUpperCase().replace(/[^A-Z]/g, '');
  if (KNOWN_SYMBOLS.includes(up)) return up;
  if (SYMBOL_ALIASES[up]) return SYMBOL_ALIASES[up];
  return null;
}

function routeQuery(q) {
  const trimmed = q.trim();
  if (!trimmed) return { intent: null };

  // Slash commands — explicit wins.
  if (/^\/brief\b/i.test(trimmed))   return { intent: 'market_brief', query: trimmed.replace(/^\/brief\s*/i, '') };
  if (/^\/idea\b/i.test(trimmed))    return { intent: 'trade_idea',   query: trimmed.replace(/^\/idea\s*/i, '') };
  if (/^\/risk\b/i.test(trimmed))    return { intent: 'risk_check',   query: trimmed.replace(/^\/risk\s*/i, '') };
  if (/^\/switch\b/i.test(trimmed) || /^\/go\b/i.test(trimmed)) {
    const rest = trimmed.replace(/^\/(switch|go)\s*/i, '');
    return { intent: 'switch', switchTo: resolveSymbol(rest.split(/\s+/)[0]) };
  }

  const low = trimmed.toLowerCase();

  // "switch to TSLA", "go to bitcoin", "show me eth"
  const switchM = low.match(/\b(?:switch(?:\s+to)?|go\s+to|show\s+me|open)\s+([a-z]+)/);
  if (switchM) {
    const sym = resolveSymbol(switchM[1]);
    if (sym) return { intent: 'switch', switchTo: sym };
  }

  if (/\b(trade\s*idea|setup|long\s*or\s*short|go\s+long|go\s+short|entry\s+for)\b/.test(low)) {
    return { intent: 'trade_idea', query: trimmed };
  }
  if (/\b(brief|what'?s\s+(happening|moving)|today'?s\s+market|market\s+today|news|catalyst)\b/.test(low)) {
    return { intent: 'market_brief', query: trimmed };
  }
  if (/\b(risk|concentrat|correlat|my\s+position|my\s+book|exposure)\b/.test(low)) {
    return { intent: 'risk_check', query: trimmed };
  }

  // Default: treat as a question about the current chart / symbol.
  return { intent: 'explain_chart', query: trimmed };
}

export default function AICommandPalette() {
  const { getAIContext } = useAI();
  const { setSelectedSymbol, positions } = useLeverate();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);    // { intent, text, citations }
  const [error, setError] = useState(null);
  const [routed, setRouted] = useState(null);    // preview of what we'll run
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Global keyboard shortcut. We listen on window, not a specific
  // element, so it works no matter which subtree has focus.
  useEffect(() => {
    const onKey = (e) => {
      // ⌘K / Ctrl+K toggles. Also '/' at the start if nothing is focused.
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isCmdK) {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Autofocus the input when the modal mounts. Tiny delay so the
  // motion transform doesn't interfere with iOS keyboard timing.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      // Close = reset transient state, but keep last result so re-opening
      // with the same query is instant.
      setError(null);
      setLoading(false);
      abortRef.current?.abort();
    }
  }, [open]);

  // Live route preview as the user types — helps them learn the grammar.
  useEffect(() => {
    const r = routeQuery(value);
    setRouted(r);
  }, [value]);

  const submit = useCallback(async (explicitQuery) => {
    const q = (explicitQuery ?? value).trim();
    if (!q) return;
    const r = routeQuery(q);

    // "switch" doesn't hit the AI — it's a local navigation command.
    if (r.intent === 'switch' && r.switchTo) {
      setSelectedSymbol(r.switchTo);
      setResult({ intent: 'switch', text: `Chart switched to ${r.switchTo}.` });
      setValue('');
      return;
    }
    if (r.intent === 'switch' && !r.switchTo) {
      setError("Couldn't find that symbol in your watchlist.");
      return;
    }
    if (!r.intent) return;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ctx = getAIContext();
      const body = {
        intent: r.intent,
        context: { ...ctx, watchlist: KNOWN_SYMBOLS, positions },
        query: r.query || q,
        signal: ctrl.signal,
      };
      const res = await analyzeWithAI(body);
      if (ctrl.signal.aborted) return;
      setResult({ intent: r.intent, ...res });
    } catch (e) {
      if (e.name === 'AbortError') return;
      setError(e.message || 'Something went wrong.');
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, [value, getAIContext, setSelectedSymbol, positions]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <>
      {/* Floating "Ask AI" button — always visible, bottom-right */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Open AI command palette"
        title="Ask AI  (⌘K)"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 18px',
          height: 46,
          background: 'linear-gradient(135deg, #005AFF, #0084FF)',
          border: '1px solid rgba(139, 180, 255, 0.4)',
          borderRadius: 999,
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.3,
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0, 90, 255, 0.35)',
        }}
      >
        <Sparkles size={15} />
        <span>Ask AI</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            padding: '2px 6px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 4,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
          className="fab-kbd"
        >
          <CommandIcon size={10} />K
        </span>
        <style>{`
          @media (max-width: 600px) { .fab-kbd { display: none !important; } }
        `}</style>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="cp-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                background: 'rgba(5, 7, 12, 0.6)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              key="cp-modal"
              role="dialog"
              aria-label="AI command palette"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              style={{
                position: 'fixed',
                top: '12vh',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 201,
                width: 'min(640px, calc(100vw - 24px))',
                maxHeight: '76vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(14, 18, 28, 0.98)',
                border: '1px solid rgba(0, 132, 255, 0.3)',
                borderRadius: 14,
                boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,90,255,0.2)',
                color: '#e6e9ef',
                overflow: 'hidden',
              }}
            >
              {/* Input row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 18px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <Sparkles size={16} color="#0084FF" />
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask anything — /brief · /idea · /risk · /switch BTC"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#f4f6fb',
                    fontSize: 15,
                    padding: 0,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8a93a6',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Route hint */}
              {value.trim() && routed?.intent && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 18px',
                  fontSize: 11,
                  color: '#8a93a6',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <CornerDownLeft size={11} />
                  <span>
                    Enter → <strong style={{ color: '#8bb4ff' }}>{labelFor(routed)}</strong>
                  </span>
                </div>
              )}

              {/* Body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
                {/* Empty state — quick prompts */}
                {!value && !result && !loading && (
                  <>
                    <div style={{ fontSize: 11, color: '#8a93a6', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                      Try asking
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {QUICK_PROMPTS.map(p => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => { setValue(p.label); submit(p.label); }}
                          style={{
                            textAlign: 'left',
                            padding: '10px 12px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 8,
                            color: '#d6dbe6',
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(0,90,255,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(0,90,255,0.3)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[92, 78, 88, 70].map((w, i) => (
                      <div
                        key={i}
                        style={{
                          height: 11,
                          width: `${w}%`,
                          background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                          backgroundSize: '200% 100%',
                          borderRadius: 4,
                          animation: 'shimmer 1.4s ease-in-out infinite',
                        }}
                      />
                    ))}
                  </div>
                )}

                {error && (
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    padding: 12,
                    background: 'rgba(255,80,80,0.08)',
                    border: '1px solid rgba(255,80,80,0.25)',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#ffb4b4',
                  }}>
                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{error}</span>
                  </div>
                )}

                {result && !loading && !error && (
                  <div>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: 'rgba(0,90,255,0.12)',
                      border: '1px solid rgba(0,90,255,0.3)',
                      borderRadius: 4,
                      fontSize: 10.5,
                      color: '#8bb4ff',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      marginBottom: 10,
                      fontWeight: 700,
                    }}>
                      {intentLabel(result.intent)}
                    </div>
                    <div style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: '#e6e9ef',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {result.text}
                    </div>

                    {Array.isArray(result.citations) && result.citations.length > 0 && (
                      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize: 10.5, color: '#8a93a6', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 }}>
                          Sources
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {result.citations.slice(0, 5).map((url, i) => {
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
                                  gap: 4,
                                  color: '#8bb4ff',
                                  fontSize: 11,
                                  textDecoration: 'none',
                                }}
                              >
                                <ExternalLink size={10} />
                                {host}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '8px 18px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                fontSize: 10.5,
                color: '#6a7285',
                display: 'flex',
                gap: 14,
                flexWrap: 'wrap',
              }}>
                <span><kbd style={kbdStyle}>Enter</kbd> run</span>
                <span><kbd style={kbdStyle}>Esc</kbd> close</span>
                <span style={{ marginLeft: 'auto' }}>Grounded by sonar-pro</span>
              </div>

              <style>{`
                @keyframes shimmer {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}</style>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const kbdStyle = {
  padding: '1px 5px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 3,
  fontFamily: 'inherit',
  fontSize: 10,
  color: '#b0b8cc',
};

function labelFor(r) {
  if (!r || !r.intent) return '';
  if (r.intent === 'switch') return r.switchTo ? `Switch chart to ${r.switchTo}` : 'Unknown symbol';
  return intentLabel(r.intent);
}

function intentLabel(intent) {
  switch (intent) {
    case 'explain_chart': return 'Explain chart';
    case 'market_brief':  return 'Market brief';
    case 'trade_idea':    return 'Trade idea';
    case 'risk_check':    return 'Risk check';
    case 'switch':        return 'Switch chart';
    default:              return 'AI answer';
  }
}

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "";

// Derive ticker from the current React Router location.
// Handles: /stock/AAPL, /stocks/AAPL, /ticker/AAPL, ?ticker=AAPL
function getTickerFromLocation(location) {
  const params = new URLSearchParams(location.search);
  if (params.get("ticker")) return params.get("ticker").toUpperCase();
  const stockMatch = location.pathname.match(/\/(?:stocks?|ticker)\/([A-Z]{1,5})/i);
  if (stockMatch) return stockMatch[1].toUpperCase();
  return null;
}

const QUICK_PROMPTS = [
  "Market overview today",
  "Best sectors to watch",
  "Explain RSI & MACD",
  "Gold vs Bitcoin",
  "Risk management tips",
];

// ── Typing dots ───────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "10px 14px", alignItems: "center" }}>
      <style>{`@keyframes cfc-bounce{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(-5px);opacity:1}}`}</style>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#00f5a0",
          animation: `cfc-bounce 0.8s ${i * 0.15}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Single message bubble ─────────────────────────────────────
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 10, gap: 8, alignItems: "flex-end",
      animation: "cfc-fadeUp .25s ease",
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#00f5a0,#00d4ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14,
        }}>📊</div>
      )}
      <div style={{
        maxWidth: "82%", padding: "10px 14px",
        borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
        background: isUser ? "linear-gradient(135deg,#00c853,#00e676)" : "rgba(255,255,255,0.05)",
        border: isUser ? "none" : "1px solid rgba(0,245,160,0.15)",
        color: isUser ? "#001a0a" : "#d0f0e0",
        fontSize: 13, lineHeight: 1.65,
        fontFamily: "'IBM Plex Mono', monospace",
        backdropFilter: "blur(8px)",
        whiteSpace: "pre-wrap",
      }}>
        {msg.content}
        {msg.streaming && <span style={{ opacity: 0.5, marginLeft: 2 }}>▌</span>}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function ClaudeFinanceChat() {
  const location = useLocation();
  const [isOpen, setIsOpen]     = useState(false);
  const [msgs, setMsgs]         = useState([]);
  const [history, setHistory]   = useState([]);
  const [input, setInput]       = useState("");
  const [streaming, setStreaming] = useState(false);

  const bottomRef = useRef(null);
  const abortRef  = useRef(null);
  const idRef     = useRef(0);

  // Derived from router location — reactive to navigation
  const ticker = getTickerFromLocation(location);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, streaming]);

  // Show welcome message when the panel first opens
  useEffect(() => {
    if (!isOpen || msgs.length > 0) return;
    const welcome = ticker
      ? `Hey! I'm your AI financial analyst.\n\nI can see you're viewing **${ticker}** — ask me anything about it, or any other market.`
      : `Hey! I'm your AI financial analyst powered by Perplexity.\n\nAsk me about any stock, crypto, forex pair, or market concept.`;
    setMsgs([{ id: idRef.current++, role: "assistant", content: welcome }]);
  }, [isOpen]);

  // If the user navigates to a stock page while the chat is open,
  // inject a silent context note (no visible bubble, just history context)
  const prevTickerRef = useRef(ticker);
  useEffect(() => {
    if (!isOpen) return;
    if (ticker && ticker !== prevTickerRef.current && msgs.length > 0) {
      setMsgs((prev) => [...prev, {
        id: idRef.current++, role: "assistant",
        content: `📍 Switched context to **${ticker}**. Ask me anything about it!`,
      }]);
    }
    prevTickerRef.current = ticker;
  }, [ticker, isOpen]);

  // ── Clear chat ──────────────────────────────────────────────
  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
    setMsgs([]);
    setHistory([]);
    idRef.current = 0;
    // Re-trigger welcome on next render cycle
    setTimeout(() => {
      const welcome = ticker
        ? `Chat cleared. Still on **${ticker}** — what do you want to know?`
        : `Chat cleared. Ask me anything about markets!`;
      setMsgs([{ id: idRef.current++, role: "assistant", content: welcome }]);
    }, 50);
  }, [ticker]);

  // ── Stop streaming ──────────────────────────────────────────
  const stopStream = () => {
    abortRef.current?.abort();
    setStreaming(false);
    setMsgs((prev) => prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)));
  };

  // ── Send message ────────────────────────────────────────────
  const sendMessage = useCallback(async (override) => {
    const text = (override ?? input).trim();
    if (!text || streaming) return;
    setInput("");

    setMsgs((prev) => [...prev, { id: idRef.current++, role: "user", content: text }]);
    setStreaming(true);

    const botId = idRef.current++;
    setMsgs((prev) => [...prev, { id: botId, role: "assistant", content: "", streaming: true }]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch(`${API_BASE}/api/claude-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({ message: text, history: history.slice(-10), ticker }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      let buf  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") break;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.text) {
              full += parsed.text;
              setMsgs((prev) =>
                prev.map((m) => (m.id === botId ? { ...m, content: full } : m))
              );
            }
          } catch {}
        }
      }

      setMsgs((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, content: full, streaming: false } : m))
      );
      setHistory((prev) =>
        [...prev, { role: "user", content: text }, { role: "assistant", content: full }].slice(-20)
      );
    } catch (err) {
      if (err.name === "AbortError") return;
      setMsgs((prev) =>
        prev.map((m) =>
          m.id === botId
            ? { ...m, content: "⚠️ Connection error. Please try again.", streaming: false }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, history, ticker]);

  const quickChips = ticker
    ? [`Analyse ${ticker}`, `${ticker} key levels`, `${ticker} latest news`, ...QUICK_PROMPTS.slice(0, 2)]
    : QUICK_PROMPTS;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        @keyframes cfc-fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes cfc-pop{from{opacity:0;transform:scale(.94) translateY(12px)}to{opacity:1;transform:none}}
        @keyframes cfc-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.6}}
        .cfc-fab{transition:all .3s cubic-bezier(.175,.885,.32,1.275)}
        .cfc-fab:hover{transform:scale(1.1)!important}
        .cfc-chip:hover{background:rgba(0,245,160,.12)!important;border-color:#00f5a0!important;color:#00f5a0!important}
        .cfc-send:hover:not(:disabled){transform:scale(1.08)}
        .cfc-clear:hover{background:rgba(255,77,109,.15)!important;color:#ff4d6d!important}
        @media (max-width: 480px) {
          .cfc-panel { width: calc(100vw - 24px) !important; right: 12px !important; left: 12px !important; bottom: 90px !important; height: 75vh !important; }
          .cfc-fab-wrap { bottom: 16px !important; right: 16px !important; }
        }
      `}</style>

      {/* ── FAB with pulsing online dot ── */}
      <div className="cfc-fab-wrap" style={{ position: "fixed", bottom: 90, right: 24, zIndex: 9000 }}>
        {/* Pulsing green online indicator */}
        {!isOpen && (
          <span style={{
            position: "absolute", top: 2, right: 2,
            width: 11, height: 11, borderRadius: "50%",
            background: "#00f5a0",
            border: "2px solid #06080a",
            animation: "cfc-pulse 2s ease-in-out infinite",
            zIndex: 1,
          }} />
        )}
        <button
          className="cfc-fab"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Financial analyst chat"
          style={{
            width: 56, height: 56, borderRadius: "50%", border: "none",
            cursor: "pointer", fontSize: 22,
            background: isOpen
              ? "linear-gradient(135deg,#ff4d6d,#c0003c)"
              : "linear-gradient(135deg,#00f5a0,#00c4ff)",
            boxShadow: isOpen
              ? "0 6px 24px rgba(255,77,109,.5)"
              : "0 6px 24px rgba(0,245,160,.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {isOpen ? "✕" : "📊"}
        </button>
      </div>

      {/* ── Chat panel ── */}
      {isOpen && (
        <div className="cfc-panel" style={{
          position: "fixed", bottom: 158, right: 20, zIndex: 8999,
          width: 400, height: "70vh", maxHeight: 620,
          display: "flex", flexDirection: "column",
          background: "rgba(6,14,22,0.88)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgba(0,245,160,0.18)",
          borderRadius: 20,
          boxShadow: "0 0 60px rgba(0,245,160,0.06),0 32px 80px rgba(0,0,0,0.9)",
          fontFamily: "'IBM Plex Mono','Courier New',monospace",
          overflow: "hidden",
          animation: "cfc-pop .28s cubic-bezier(.175,.885,.32,1.275)",
        }}>

          {/* Header */}
          <div style={{
            padding: "11px 14px",
            background: "rgba(0,245,160,0.04)",
            borderBottom: "1px solid rgba(0,245,160,0.12)",
            display: "flex", alignItems: "center", gap: 10, flexShrink: 0,
          }}>
            {/* Avatar with live pulse */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg,#00f5a0,#00c4ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17,
              }}>📊</div>
              <span style={{
                position: "absolute", bottom: 0, right: 0,
                width: 9, height: 9, borderRadius: "50%",
                background: "#00f5a0", border: "2px solid #06080a",
                animation: "cfc-pulse 2s ease-in-out infinite",
              }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e0fff4" }}>
                FinAI Analyst
              </div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#00f5a066" }}>
                ● ONLINE · {ticker ? `${ticker} CONTEXT` : "MARKET MODE"}
              </div>
            </div>

            {/* Ticker badge */}
            {ticker && (
              <div style={{
                padding: "3px 9px", borderRadius: 20,
                background: "rgba(0,245,160,0.12)",
                border: "1px solid rgba(0,245,160,0.3)",
                color: "#00f5a0", fontSize: 11, fontWeight: 700,
              }}>{ticker}</div>
            )}

            {/* Clear chat button */}
            <button
              className="cfc-clear"
              onClick={clearChat}
              title="Clear chat"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "4px 8px",
                color: "#4a7a6a", fontSize: 11,
                cursor: "pointer", transition: "all .2s",
                fontFamily: "'IBM Plex Mono',monospace",
              }}
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
            {msgs.map((msg) => <Message key={msg.id} msg={msg} />)}
            {streaming && msgs[msgs.length - 1]?.content === "" && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Quick chips */}
          <div style={{
            display: "flex", gap: 6, padding: "6px 10px",
            overflowX: "auto", borderTop: "1px solid rgba(0,245,160,0.08)",
            flexShrink: 0,
          }}>
            {quickChips.map((q) => (
              <button key={q} className="cfc-chip" onClick={() => sendMessage(q)} style={{
                flexShrink: 0, padding: "4px 10px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,245,160,0.15)",
                borderRadius: 20, color: "#4a9a7a", fontSize: 10,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s",
                fontFamily: "'IBM Plex Mono',monospace",
              }}>{q}</button>
            ))}
          </div>

          {/* Input row */}
          <div style={{
            padding: "10px 10px 14px",
            borderTop: "1px solid rgba(0,245,160,0.08)",
            background: "rgba(0,0,0,0.2)",
            display: "flex", alignItems: "flex-end", gap: 7, flexShrink: 0,
          }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
              }}
              placeholder="Ask about any stock, crypto, or market…"
              rows={1}
              style={{
                flex: 1,
                background: "rgba(0,245,160,0.04)",
                border: "1px solid rgba(0,245,160,0.2)",
                borderRadius: 12, padding: "10px 13px",
                color: "#c8f0df", fontSize: 13,
                resize: "none", lineHeight: 1.5, outline: "none",
                fontFamily: "'IBM Plex Mono',monospace",
                caretColor: "#00f5a0",
              }}
            />
            {streaming ? (
              <button onClick={stopStream} style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: "rgba(255,77,109,0.15)",
                border: "1px solid rgba(255,77,109,0.4)",
                color: "#ff4d6d", cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>⏹</button>
            ) : (
              <button
                className="cfc-send"
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: input.trim()
                    ? "linear-gradient(135deg,#00f5a0,#00c4ff)"
                    : "rgba(255,255,255,0.05)",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "default",
                  fontSize: 16, transition: "all .2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: input.trim() ? "#001a0a" : "#333",
                }}>➤</button>
            )}
          </div>

          <div style={{
            textAlign: "center", fontSize: 9, color: "rgba(0,245,160,0.2)",
            paddingBottom: 6, letterSpacing: 1,
          }}>
            Educational analysis only · Not financial advice
          </div>
        </div>
      )}
    </>
  );
}

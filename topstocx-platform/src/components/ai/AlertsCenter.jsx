/**
 * AlertsCenter — the bell in the TopBar.
 *
 * Shows a live-counted badge of unread proactive alerts (fed by
 * AlertsContext) and, on click, drops down a list of recent moves.
 * Each alert has an "Ask AI why" button that streams a one-sentence,
 * news-grounded explanation from the `why_moved` intent.
 *
 * Design choices:
 *   • Inline expansion rather than a modal — the bell is a glance-and-go
 *     surface; jumping to a modal for a single sentence is overkill.
 *   • The AI response streams in-place. No spinner, just real tokens.
 *   • We cache explanations on the alert object in local state so
 *     tapping "Ask AI why" twice doesn't re-bill.
 *   • Permission prompt lives behind a single discreet row. We never
 *     auto-request — surprise permission prompts are one of the
 *     fastest ways to lose a user.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Sparkles, ExternalLink, Check, Trash2, BellOff } from 'lucide-react';
import { useAlerts } from '../../context/AlertsContext';
import { streamWhyMoved } from '../../services/topstocxAI';

function timeAgo(ts) {
  const diffSec = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const m = Math.round(diffSec / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default function AlertsCenter() {
  const {
    alerts,
    unreadCount,
    notificationPermission,
    requestNotifications,
    markAllRead,
    dismiss,
    clearAll,
    threshold,
  } = useAlerts();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Per-alert local state: { [alertId]: { text, citations, loading, error } }
  const [explanations, setExplanations] = useState({});
  const abortsRef = useRef({});

  // Click-outside / Escape close.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Mark all read when the dropdown opens. Feels natural: the user
  // *saw* the badge, so the red dot resetting is the right signal.
  useEffect(() => {
    if (open && unreadCount > 0) {
      // Defer so the animate-in doesn't flash.
      const t = setTimeout(() => markAllRead(), 250);
      return () => clearTimeout(t);
    }
  }, [open, unreadCount, markAllRead]);

  // Abort all streams on unmount.
  useEffect(() => () => {
    Object.values(abortsRef.current).forEach((c) => { try { c.abort(); } catch {} });
  }, []);

  const askWhy = async (alert) => {
    if (explanations[alert.id]?.loading) return;
    if (explanations[alert.id]?.text) {
      // Already fetched — toggle-collapse by clearing
      setExplanations((prev) => {
        const next = { ...prev };
        delete next[alert.id];
        return next;
      });
      return;
    }

    const ctrl = new AbortController();
    abortsRef.current[alert.id] = ctrl;

    setExplanations((prev) => ({
      ...prev,
      [alert.id]: { text: '', citations: [], loading: true, error: null },
    }));

    try {
      const final = await streamWhyMoved(
        {
          symbol: alert.symbol,
          price: alert.price,
          changePct: Number(alert.changePct.toFixed(2)),
          window: alert.windowLabel,
        },
        {
          signal: ctrl.signal,
          onDelta: (chunk) => {
            setExplanations((prev) => ({
              ...prev,
              [alert.id]: {
                ...(prev[alert.id] || {}),
                text: (prev[alert.id]?.text || '') + chunk,
                loading: true,
                error: null,
              },
            }));
          },
        }
      );
      if (ctrl.signal.aborted) return;
      setExplanations((prev) => ({
        ...prev,
        [alert.id]: {
          text: final.text || prev[alert.id]?.text || '',
          citations: final.citations || [],
          loading: false,
          error: null,
        },
      }));
    } catch (e) {
      if (e.name === 'AbortError') return;
      setExplanations((prev) => ({
        ...prev,
        [alert.id]: {
          ...(prev[alert.id] || {}),
          loading: false,
          error: e.message || 'Could not fetch explanation.',
        },
      }));
    }
  };

  // Badge rendering — cap at 99+.
  const badgeText = useMemo(() => {
    if (unreadCount <= 0) return null;
    if (unreadCount > 99) return '99+';
    return String(unreadCount);
  }, [unreadCount]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Alerts"
        title={`Alerts${unreadCount ? ` (${unreadCount} unread)` : ''}`}
        style={{
          position: 'relative',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: unreadCount > 0 ? '#fff' : 'var(--text-muted)',
          cursor: 'pointer',
          borderRadius: 6,
          padding: 0,
        }}
      >
        <Bell size={18} />
        {badgeText && (
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              minWidth: 15,
              height: 15,
              padding: '0 4px',
              borderRadius: 10,
              background: '#ff3b5c',
              color: '#fff',
              fontSize: 9,
              fontWeight: 800,
              lineHeight: '15px',
              textAlign: 'center',
              boxShadow: '0 0 0 2px var(--bg-secondary)',
            }}
          >
            {badgeText}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 40,
              right: 0,
              width: 380,
              maxHeight: 520,
              background: 'rgba(16,18,26,0.98)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              zIndex: 100,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bell size={14} color="#0084FF" />
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>
                  Alerts
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
                  title={`Triggered at ≥${threshold}% moves`}
                >
                  ±{threshold}%
                </span>
              </div>
              {alerts.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'transparent',
                    border: 'none',
                    color: '#8a93a6',
                    fontSize: 11,
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: 4,
                  }}
                  title="Clear all"
                >
                  <Trash2 size={11} />
                  Clear
                </button>
              )}
            </header>

            {/* Permission nudge — single line, dismissible-by-granting. */}
            {notificationPermission === 'default' && (
              <button
                type="button"
                onClick={requestNotifications}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 14px',
                  background: 'rgba(0,90,255,0.08)',
                  border: 'none',
                  borderBottom: '1px solid rgba(0,90,255,0.2)',
                  color: '#8bb4ff',
                  fontSize: 11.5,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>Enable desktop notifications for big moves</span>
                <Check size={12} />
              </button>
            )}
            {notificationPermission === 'denied' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  background: 'rgba(255,80,80,0.06)',
                  borderBottom: '1px solid rgba(255,80,80,0.15)',
                  color: '#ffa0a0',
                  fontSize: 10.5,
                }}
              >
                <BellOff size={11} />
                Desktop notifications blocked in browser settings.
              </div>
            )}

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {alerts.length === 0 ? (
                <div
                  style={{
                    padding: '28px 14px',
                    textAlign: 'center',
                    color: '#6b7385',
                    fontSize: 12,
                    lineHeight: 1.6,
                  }}
                >
                  <Bell size={22} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <div>No alerts yet.</div>
                  <div style={{ marginTop: 4, fontSize: 10.5 }}>
                    You'll see a notification when a watched ticker moves<br />
                    more than {threshold}% from where it was.
                  </div>
                </div>
              ) : (
                alerts.map((a) => (
                  <AlertRow
                    key={a.id}
                    alert={a}
                    explanation={explanations[a.id]}
                    onAskWhy={() => askWhy(a)}
                    onDismiss={() => dismiss(a.id)}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AlertRow({ alert, explanation, onAskWhy, onDismiss }) {
  const up = alert.changePct >= 0;
  const color = up ? '#39B54A' : '#ff5468';

  return (
    <div
      style={{
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: alert.read ? 'transparent' : 'rgba(0,90,255,0.04)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f4f6fb' }}>
            {alert.symbol.replace('USDT', '')}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {up ? '+' : ''}
            {alert.changePct.toFixed(2)}%
          </span>
          <span
            style={{
              fontSize: 10.5,
              color: '#6b7385',
              marginLeft: 'auto',
              flexShrink: 0,
            }}
          >
            {alert.windowLabel} · {timeAgo(alert.at)}
          </span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            width: 18,
            height: 18,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: '#6b7385',
            cursor: 'pointer',
            borderRadius: 3,
            flexShrink: 0,
          }}
        >
          <X size={11} />
        </button>
      </div>

      <div
        style={{
          fontSize: 11,
          color: '#8a93a6',
          marginTop: 4,
          paddingLeft: 14,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {alert.basePrice.toFixed(alert.basePrice < 10 ? 4 : 2)} →{' '}
        {alert.price.toFixed(alert.price < 10 ? 4 : 2)}
      </div>

      <div style={{ marginTop: 8, paddingLeft: 14 }}>
        <button
          type="button"
          onClick={onAskWhy}
          disabled={explanation?.loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 9px',
            background:
              explanation?.text ? 'rgba(0,90,255,0.15)' : 'rgba(0,90,255,0.08)',
            border: '1px solid rgba(0,90,255,0.25)',
            borderRadius: 4,
            color: '#8bb4ff',
            fontSize: 11,
            fontWeight: 600,
            cursor: explanation?.loading ? 'default' : 'pointer',
            letterSpacing: 0.2,
          }}
        >
          <Sparkles size={10} />
          {explanation?.loading
            ? 'Thinking…'
            : explanation?.text
            ? 'Hide explanation'
            : 'Ask AI why'}
        </button>
      </div>

      {(explanation?.text || explanation?.error) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
          style={{
            marginTop: 8,
            marginLeft: 14,
            padding: '8px 10px',
            background: 'rgba(0,90,255,0.05)',
            border: '1px solid rgba(0,90,255,0.12)',
            borderRadius: 5,
            fontSize: 11.5,
            lineHeight: 1.5,
            color: explanation?.error ? '#ffb4b4' : '#d6dbe6',
          }}
        >
          {explanation?.error || explanation?.text}
          {Array.isArray(explanation?.citations) && explanation.citations.length > 0 && (
            <div
              style={{
                marginTop: 6,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {explanation.citations.slice(0, 3).map((url, i) => {
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
        </motion.div>
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Activity, Check, Trash2 } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';

// TradingView built-in study IDs accepted by the AdvancedRealTimeChart widget.
// These are the legacy `@tv-basicstudies` identifiers, which the embedded
// widget still honours and which are stable across versions.
export const INDICATOR_CATALOG = [
    { id: 'RSI@tv-basicstudies',            label: 'Relative Strength Index', short: 'RSI' },
    { id: 'MACD@tv-basicstudies',           label: 'MACD',                    short: 'MACD' },
    { id: 'BB@tv-basicstudies',             label: 'Bollinger Bands',         short: 'BB' },
    { id: 'MAExp@tv-basicstudies',          label: 'EMA',                     short: 'EMA' },
    { id: 'MASimple@tv-basicstudies',       label: 'Simple MA',               short: 'SMA' },
    { id: 'VWAP@tv-basicstudies',           label: 'VWAP',                    short: 'VWAP' },
    { id: 'Volume@tv-basicstudies',         label: 'Volume',                  short: 'VOL' },
    { id: 'StochasticRSI@tv-basicstudies',  label: 'Stochastic RSI',          short: 'STOCH RSI' },
    { id: 'IchimokuCloud@tv-basicstudies',  label: 'Ichimoku Cloud',          short: 'ICHI' },
    { id: 'PivotPointsStandard@tv-basicstudies', label: 'Pivot Points',       short: 'PIVOT' },
];

const IndicatorsMenu = () => {
    const { studies, toggleStudy, setStudies } = useLeverate();
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const count = studies?.length || 0;

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                title="Toggle chart indicators"
                style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 10px',
                    background: open || count ? 'rgba(0,90,255,0.10)' : 'transparent',
                    border: open ? '1px solid rgba(0,90,255,0.55)' : '1px solid transparent',
                    borderRadius: 6,
                    color: count ? 'var(--brand-blue)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: 14, fontWeight: 500,
                    transition: 'all .15s',
                }}
            >
                <Activity size={16} />
                <span>Indicators</span>
                {count > 0 && (
                    <span style={{
                        marginLeft: 2,
                        background: 'var(--brand-blue)',
                        color: '#fff',
                        fontSize: 10, fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: 999,
                        fontVariantNumeric: 'tabular-nums',
                    }}>{count}</span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                    width: 280,
                    background: '#1a1f2e',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
                    zIndex: 50,
                    overflow: 'hidden',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
                        color: '#8a93a6', textTransform: 'uppercase',
                    }}>
                        <span>Studies</span>
                        {count > 0 && (
                            <button type="button" onClick={() => setStudies([])}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#ef5350', fontSize: 11, fontWeight: 700, padding: 0 }}>
                                <Trash2 size={11} /> Clear
                            </button>
                        )}
                    </div>
                    <div className="custom-scrollbar" style={{ maxHeight: 360, overflowY: 'auto', padding: '4px 0' }}>
                        {INDICATOR_CATALOG.map(ind => {
                            const active = studies.includes(ind.id);
                            return (
                                <button key={ind.id}
                                    type="button"
                                    onClick={() => toggleStudy(ind.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        width: '100%',
                                        padding: '9px 12px',
                                        background: active ? 'rgba(0,90,255,0.10)' : 'transparent',
                                        border: 'none',
                                        color: 'inherit',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                    }}
                                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <span style={{
                                        width: 18, height: 18,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 4,
                                        border: active ? '1px solid #005AFF' : '1px solid rgba(255,255,255,0.18)',
                                        background: active ? '#005AFF' : 'transparent',
                                        flexShrink: 0,
                                    }}>
                                        {active && <Check size={12} color="#fff" strokeWidth={3} />}
                                    </span>
                                    <span style={{ flex: 1 }}>
                                        <span style={{ display: 'block', fontSize: 13, color: '#e6e9ef', fontWeight: 600 }}>{ind.label}</span>
                                        <span style={{ display: 'block', fontSize: 10, color: '#8a93a6', marginTop: 1, letterSpacing: '0.04em' }}>{ind.short}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <div style={{
                        padding: '8px 12px',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        fontSize: 10, color: '#666', lineHeight: 1.4,
                    }}>
                        Indicators reload the chart. Saved across sessions.
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndicatorsMenu;

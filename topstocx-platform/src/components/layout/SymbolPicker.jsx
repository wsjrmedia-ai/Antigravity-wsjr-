import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';
import { useMarketData } from '../../context/MarketDataContext';

const DOT_COLORS = {
    indices:     '#2196F3',
    stocks:      '#4CAF50',
    crypto:      '#FF9800',
    commodities: '#FFD700',
    forex:       '#9C27B0',
};

const GROUPS = [
    {
        id: 'indices', label: 'Indices',
        items: [
            { symbol: 'SPX',  name: 'S&P 500' },
            { symbol: 'NDX',  name: 'NASDAQ 100' },
            { symbol: 'DJI',  name: 'Dow Jones' },
            { symbol: 'VIX',  name: 'CBOE VIX' },
        ],
    },
    {
        id: 'stocks', label: 'Stocks',
        items: [
            { symbol: 'AAPL',  name: 'Apple' },
            { symbol: 'TSLA',  name: 'Tesla' },
            { symbol: 'NVDA',  name: 'NVIDIA' },
            { symbol: 'MSFT',  name: 'Microsoft' },
            { symbol: 'AMZN',  name: 'Amazon' },
            { symbol: 'GOOGL', name: 'Alphabet' },
            { symbol: 'META',  name: 'Meta' },
            { symbol: 'AMD',   name: 'AMD' },
        ],
    },
    {
        id: 'crypto', label: 'Crypto',
        items: [
            { symbol: 'BTCUSDT', name: 'Bitcoin' },
            { symbol: 'ETHUSDT', name: 'Ethereum' },
            { symbol: 'SOLUSDT', name: 'Solana' },
            { symbol: 'BNBUSDT', name: 'BNB' },
            { symbol: 'XRPUSDT', name: 'XRP' },
            { symbol: 'ADAUSDT', name: 'Cardano' },
            { symbol: 'DOGEUSDT',name: 'Dogecoin' },
        ],
    },
    {
        id: 'commodities', label: 'Commodities',
        items: [
            { symbol: 'XAUUSD', name: 'Gold' },
            { symbol: 'XAGUSD', name: 'Silver' },
            { symbol: 'USOIL',  name: 'WTI Oil' },
        ],
    },
    {
        id: 'forex', label: 'Forex',
        items: [
            { symbol: 'EURUSD', name: 'EUR / USD' },
            { symbol: 'GBPUSD', name: 'GBP / USD' },
            { symbol: 'USDJPY', name: 'USD / JPY' },
            { symbol: 'AUDUSD', name: 'AUD / USD' },
            { symbol: 'USDCAD', name: 'USD / CAD' },
            { symbol: 'USDCHF', name: 'USD / CHF' },
        ],
    },
];

const ALL = GROUPS.flatMap(g => g.items.map(i => ({ ...i, assetClass: g.id })));

function quoteFor(sym, market) {
    if (!sym) return null;
    const { stocks, indices, commodities, forex, cryptoPrices } = market;
    const upper = sym.toUpperCase();

    const inStocks = stocks.find(s => s.symbol === upper);
    if (inStocks) return { price: inStocks.price, changePct: inStocks.changePct, decimals: 2 };

    const inIndices = indices.find(i => i.symbol === upper);
    if (inIndices) return { price: inIndices.price, changePct: inIndices.changePct, decimals: 2 };

    const inCommods = (commodities || []).find(c => c.symbol === upper);
    if (inCommods) return { price: inCommods.price, changePct: inCommods.changePct, decimals: 2 };

    const inForex = forex.find(f => f.symbol.replace('/', '') === upper);
    if (inForex) return { price: inForex.price, changePct: inForex.changePct, decimals: upper === 'USDJPY' ? 3 : 5 };

    const c = cryptoPrices[upper.toLowerCase()];
    if (c) return { price: c.price, changePct: c.changePct, decimals: c.price < 10 ? 4 : 2 };

    return null;
}

const fmtPrice = (p, d = 2) => p == null ? '—' : p.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtPct = (p) => p == null ? '' : `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;

const SymbolPicker = () => {
    const { selectedSymbol, setSelectedSymbol } = useLeverate();
    const market = useMarketData();
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState('');
    const wrapRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onClick = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        // focus the input shortly after open animation
        setTimeout(() => inputRef.current?.focus(), 30);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const filtered = useMemo(() => {
        const term = q.trim().toUpperCase();
        if (!term) return GROUPS;
        return GROUPS
            .map(g => ({ ...g, items: g.items.filter(i => i.symbol.includes(term) || i.name.toUpperCase().includes(term)) }))
            .filter(g => g.items.length > 0);
    }, [q]);

    const headQuote = quoteFor(selectedSymbol, market);
    const up = (headQuote?.changePct ?? 0) >= 0;

    const pick = (sym) => {
        setSelectedSymbol(sym);
        setOpen(false);
        setQ('');
    };

    return (
        <div ref={wrapRef} style={{ position: 'relative' }}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                title="Change symbol"
                style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--bg-accent)',
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: open ? '1px solid rgba(0,90,255,0.55)' : '1px solid transparent',
                    cursor: 'pointer',
                    color: 'inherit',
                    flexShrink: 0,
                    transition: 'border-color .15s',
                }}
            >
                <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.5px' }}>{selectedSymbol}</span>
                {headQuote && (
                    <span style={{
                        fontSize: 11, fontWeight: 700,
                        color: up ? 'var(--brand-green)' : 'var(--brand-red)',
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        {fmtPct(headQuote.changePct)}
                    </span>
                )}
                <ChevronDown size={14} color="var(--text-muted)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
            </button>

            {open && (
                <div
                    role="listbox"
                    style={{
                        position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                        width: 360, maxHeight: 480,
                        background: '#1a1f2e',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
                        zIndex: 50,
                        display: 'flex', flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ padding: 10, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 6, padding: '6px 10px',
                        }}>
                            <Search size={13} color="#666" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search symbols (e.g. AAPL, BTC, EUR)"
                                style={{
                                    flex: 1, background: 'transparent', border: 'none',
                                    color: '#e6e9ef', fontSize: 13, outline: 'none',
                                }}
                            />
                            {q && (
                                <button type="button" onClick={() => setQ('')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', padding: 0 }}>
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="custom-scrollbar" style={{ overflowY: 'auto', flex: 1 }}>
                        {filtered.length === 0 ? (
                            <div style={{ padding: 24, textAlign: 'center', color: '#8a93a6', fontSize: 13 }}>
                                No instruments match “{q}”.
                            </div>
                        ) : filtered.map(group => (
                            <div key={group.id}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '8px 12px 4px',
                                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                                    color: '#8a93a6', textTransform: 'uppercase',
                                }}>
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: DOT_COLORS[group.id] }} />
                                    {group.label}
                                </div>
                                {group.items.map(item => {
                                    const qte = quoteFor(item.symbol, market);
                                    const isActive = item.symbol === selectedSymbol;
                                    const itemUp = (qte?.changePct ?? 0) >= 0;
                                    return (
                                        <button key={item.symbol}
                                            type="button"
                                            onClick={() => pick(item.symbol)}
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 80px 60px',
                                                alignItems: 'center', gap: 8,
                                                width: '100%',
                                                padding: '8px 12px',
                                                background: isActive ? 'rgba(0,90,255,0.10)' : 'transparent',
                                                borderLeft: isActive ? '2px solid #005AFF' : '2px solid transparent',
                                                border: 'none',
                                                color: 'inherit',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, fontSize: 13, color: '#e6e9ef' }}>
                                                    {item.symbol.replace('USDT', '')}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#8a93a6', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item.name}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', fontSize: 12, fontVariantNumeric: 'tabular-nums', color: '#e6e9ef' }}>
                                                {fmtPrice(qte?.price, qte?.decimals ?? 2)}
                                            </div>
                                            <div style={{
                                                textAlign: 'right', fontSize: 11, fontWeight: 700,
                                                color: '#fff',
                                                background: qte ? (itemUp ? '#26a69a' : '#ef5350') : 'transparent',
                                                borderRadius: 3, padding: '1px 4px',
                                                fontVariantNumeric: 'tabular-nums',
                                            }}>
                                                {fmtPct(qte?.changePct)}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SymbolPicker;

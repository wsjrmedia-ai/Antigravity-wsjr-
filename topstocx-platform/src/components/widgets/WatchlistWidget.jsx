import React, { memo, useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Search, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';
import { useMarketData } from '../../context/MarketDataContext';
import { parseSearch } from '../../services/topstocxAI';

// Asset-class icons (colored dots matching TradingView's style)
const DOT_COLORS = {
    indices:     '#2196F3',
    stocks:      '#4CAF50',
    crypto:      '#FF9800',
    commodities: '#FFD700',
    forex:       '#9C27B0',
};

const GROUPS = [
    {
        id: 'indices',
        label: 'Indices',
        items: [
            { symbol: 'SPX',  name: 'S&P 500',    source: 'indices' },
            { symbol: 'NDX',  name: 'NASDAQ 100', source: 'indices' },
            { symbol: 'DJI',  name: 'Dow Jones',  source: 'indices' },
            { symbol: 'VIX',  name: 'CBOE VIX',   source: 'indices' },
        ],
    },
    {
        id: 'stocks',
        label: 'Stocks',
        items: [
            { symbol: 'AAPL',  name: 'Apple',     source: 'stocks' },
            { symbol: 'TSLA',  name: 'Tesla',      source: 'stocks' },
            { symbol: 'NVDA',  name: 'NVIDIA',     source: 'stocks' },
            { symbol: 'MSFT',  name: 'Microsoft',  source: 'stocks' },
            { symbol: 'AMZN',  name: 'Amazon',     source: 'stocks' },
            { symbol: 'GOOGL', name: 'Alphabet',   source: 'stocks' },
            { symbol: 'META',  name: 'Meta',       source: 'stocks' },
        ],
    },
    {
        id: 'crypto',
        label: 'Crypto',
        items: [
            { symbol: 'BTCUSDT', name: 'Bitcoin',  source: 'crypto' },
            { symbol: 'ETHUSDT', name: 'Ethereum', source: 'crypto' },
            { symbol: 'SOLUSDT', name: 'Solana',   source: 'crypto' },
            { symbol: 'BNBUSDT', name: 'BNB',      source: 'crypto' },
            { symbol: 'XRPUSDT', name: 'XRP',      source: 'crypto' },
        ],
    },
    {
        id: 'commodities',
        label: 'Futures',
        items: [
            { symbol: 'XAUUSD', name: 'Gold',    source: 'commodities' },
            { symbol: 'XAGUSD', name: 'Silver',  source: 'commodities' },
            { symbol: 'USOIL',  name: 'WTI Oil', source: 'commodities' },
        ],
    },
    {
        id: 'forex',
        label: 'Forex',
        items: [
            { symbol: 'EURUSD', name: 'EUR/USD', source: 'forex' },
            { symbol: 'GBPUSD', name: 'GBP/USD', source: 'forex' },
            { symbol: 'USDJPY', name: 'USD/JPY', source: 'forex' },
            { symbol: 'AUDUSD', name: 'AUD/USD', source: 'forex' },
            { symbol: 'USDCAD', name: 'USD/CAD', source: 'forex' },
        ],
    },
];

const ALL_ITEMS = GROUPS.flatMap(g =>
    g.items.map(i => ({ ...i, assetClass: g.id }))
);

const fmt = (price, decimals = 2) => {
    if (price == null || Number.isNaN(price)) return '—';
    return price.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

const fmtChg = (chg, decimals = 2) => {
    if (chg == null || Number.isNaN(chg)) return '—';
    const sign = chg >= 0 ? '+' : '';
    return `${sign}${chg.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};

const fmtPct = (pct) => {
    if (pct == null || Number.isNaN(pct)) return '';
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
};

const SEMANTIC_HINTS = /\b(top|gainer|loser|above|over|under|below|best|worst|biggest|up|down|crypto|coin|stocks?|forex|my)\b/i;
function looksLikeNL(q) {
    if (!q || q.length < 3) return false;
    return q.trim().split(/\s+/).length >= 3 || SEMANTIC_HINTS.test(q);
}

function applyStructuredFilter(filter, quotes) {
    if (!filter || typeof filter !== 'object') return null;
    let rows = ALL_ITEMS.map(item => ({ ...item, quote: quotes[item.symbol] || null }));

    if (filter.type && filter.type !== 'all') {
        const t = String(filter.type).toLowerCase();
        rows = rows.filter(r => {
            if (t === 'crypto') return r.assetClass === 'crypto';
            if (t === 'stock')  return r.assetClass === 'stocks';
            if (t === 'forex')  return r.assetClass === 'forex';
            return true;
        });
    }
    if (Array.isArray(filter.symbols) && filter.symbols.length) {
        const wanted = new Set(filter.symbols.map(s => String(s).toUpperCase()));
        rows = rows.filter(r => wanted.has(r.symbol));
    }
    if (typeof filter.priceMin === 'number') rows = rows.filter(r => (r.quote?.price ?? -Infinity) >= filter.priceMin);
    if (typeof filter.priceMax === 'number') rows = rows.filter(r => (r.quote?.price ?? Infinity) <= filter.priceMax);
    if (typeof filter.changeMin === 'number') {
        rows = rows.filter(r => (r.quote?.changePct ?? -Infinity) >= filter.changeMin);
        if (filter.changeMin >= 0) rows.sort((a, b) => (b.quote?.changePct ?? -Infinity) - (a.quote?.changePct ?? -Infinity));
    }
    if (typeof filter.changeMax === 'number') {
        rows = rows.filter(r => (r.quote?.changePct ?? Infinity) <= filter.changeMax);
        if (filter.changeMax <= 0) rows.sort((a, b) => (a.quote?.changePct ?? Infinity) - (b.quote?.changePct ?? Infinity));
    }
    return rows.map(({ quote, ...rest }) => rest);
}

const WatchlistWidget = () => {
    const { selectedSymbol, setSelectedSymbol } = useLeverate();
    const { cryptoPrices, stocks, forex, indices, commodities } = useMarketData();
    const [query, setQuery] = useState('');
    const [collapsed, setCollapsed] = useState({});
    const [nlResult, setNlResult] = useState(null);
    const [nlLabel, setNlLabel] = useState(null);
    const [nlLoading, setNlLoading] = useState(false);
    const [nlError, setNlError] = useState(null);
    const abortRef = useRef(null);
    const debounceRef = useRef(null);

    // Build unified quotes lookup
    const quotes = useMemo(() => {
        const out = {};

        stocks.forEach(s => {
            out[s.symbol] = { price: s.price, change: s.change, changePct: s.changePct, decimals: 2 };
        });

        Object.values(cryptoPrices).forEach(c => {
            if (!c) return;
            out[c.symbol] = {
                price: c.price, change: c.change, changePct: c.changePct,
                decimals: c.price < 10 ? 4 : 2,
            };
        });

        forex.forEach(f => {
            const clean = f.symbol.replace('/', '');
            out[clean] = {
                price: f.price, change: f.change, changePct: f.changePct,
                decimals: clean === 'USDJPY' ? 3 : 5,
            };
        });

        indices.forEach(idx => {
            out[idx.symbol] = {
                price: idx.price, change: idx.change, changePct: idx.changePct,
                decimals: idx.symbol === 'VIX' ? 2 : 2,
            };
        });

        (commodities || []).forEach(c => {
            out[c.symbol] = { price: c.price, change: c.change, changePct: c.changePct, decimals: 2 };
        });

        return out;
    }, [cryptoPrices, stocks, forex, indices, commodities]);

    const cancelNL = useCallback(() => {
        abortRef.current?.abort();
        clearTimeout(debounceRef.current);
    }, []);

    useEffect(() => {
        cancelNL();
        const q = query.trim();
        if (!q) { setNlResult(null); setNlLabel(null); setNlError(null); setNlLoading(false); return; }
        if (!looksLikeNL(q)) { setNlResult(null); setNlLabel(null); setNlError(null); return; }

        debounceRef.current = setTimeout(async () => {
            const ctrl = new AbortController();
            abortRef.current = ctrl;
            setNlLoading(true);
            setNlError(null);
            try {
                const res = await parseSearch(q, ALL_ITEMS.map(i => i.symbol), { signal: ctrl.signal });
                if (ctrl.signal.aborted) return;
                const filtered = applyStructuredFilter(res?.structured || null, quotes);
                setNlResult(filtered);
                setNlLabel(res?.text || null);
            } catch (e) {
                if (e.name === 'AbortError') return;
                setNlError(e.message || 'Search failed');
                setNlResult(null);
            } finally {
                if (!ctrl.signal.aborted) setNlLoading(false);
            }
        }, 350);

        return cancelNL;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    useEffect(() => () => cancelNL(), [cancelNL]);

    const q = query.trim().toUpperCase();
    const isNL = looksLikeNL(query.trim());
    const renderAIResults = isNL && nlResult != null;

    const toggleGroup = (id) => setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#d1d4dc', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: 13 }}>
            {/* Search bar */}
            <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 5, padding: '5px 8px'
                }}>
                    {isNL
                        ? <Sparkles size={12} style={{ flexShrink: 0, color: '#0084FF' }} />
                        : <Search size={12} style={{ flexShrink: 0, color: '#666' }} />
                    }
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder='Search or ask "top crypto gainers"'
                        style={{ flex: 1, background: 'transparent', border: 'none', color: '#d1d4dc', fontSize: 12, padding: 0, outline: 'none' }}
                    />
                    {query && (
                        <button type="button" onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0, display: 'flex' }}>
                            <X size={11} />
                        </button>
                    )}
                </div>
                {isNL && (nlLoading || nlError || nlLabel) && (
                    <div style={{ marginTop: 5, fontSize: 11, color: nlError ? '#ff9b9b' : '#8a93a6', paddingLeft: 2 }}>
                        {nlLoading ? 'Thinking…' : nlError || nlLabel}
                    </div>
                )}
            </div>

            {/* Column header */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 72px 52px 56px',
                padding: '5px 10px', gap: 4,
                fontSize: 10, color: '#666', fontWeight: 600, letterSpacing: '0.04em',
                borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
                textTransform: 'uppercase',
            }}>
                <span>Symbol</span>
                <span style={{ textAlign: 'right' }}>Last</span>
                <span style={{ textAlign: 'right' }}>Chg</span>
                <span style={{ textAlign: 'right' }}>Chg%</span>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {renderAIResults ? (
                    <div>
                        <div style={groupHeaderStyle}>
                            AI match{nlResult.length === 1 ? '' : 'es'} ({nlResult.length})
                        </div>
                        {nlResult.length === 0
                            ? <div style={{ padding: '10px 14px', fontSize: 12, color: '#8a93a6' }}>Nothing matches.</div>
                            : nlResult.map(item => (
                                <Row key={item.symbol} item={item} quote={quotes[item.symbol]}
                                    active={selectedSymbol === item.symbol}
                                    onClick={() => setSelectedSymbol(item.symbol)} />
                            ))
                        }
                    </div>
                ) : (
                    GROUPS.map(group => {
                        const visible = q
                            ? group.items.filter(i => i.symbol.includes(q) || i.name.toUpperCase().includes(q))
                            : group.items;
                        if (visible.length === 0) return null;
                        const isCollapsed = collapsed[group.id];

                        return (
                            <div key={group.id}>
                                <button type="button" onClick={() => toggleGroup(group.id)} style={groupHeaderStyle}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: DOT_COLORS[group.id], flexShrink: 0, display: 'inline-block' }} />
                                        {group.label}
                                    </span>
                                    {isCollapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
                                </button>
                                {!isCollapsed && visible.map(item => (
                                    <Row key={item.symbol} item={item} quote={quotes[item.symbol]}
                                        active={selectedSymbol === item.symbol}
                                        onClick={() => setSelectedSymbol(item.symbol)} />
                                ))}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

function Row({ item, quote, active, onClick }) {
    const up = quote?.changePct >= 0;
    const chgColor = up ? '#26a69a' : '#ef5350';

    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 72px 52px 56px',
                alignItems: 'center',
                gap: 4,
                width: '100%',
                padding: '7px 10px',
                background: active ? 'rgba(0,90,255,0.1)' : 'transparent',
                border: 'none',
                borderLeft: active ? '2px solid #005AFF' : '2px solid transparent',
                color: 'inherit',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.1s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
        >
            {/* Symbol + name */}
            <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#d1d4dc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.symbol.replace('USDT', '')}
                </div>
                <div style={{ fontSize: 10, color: '#666', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                </div>
            </div>
            {/* Last price */}
            <div style={{ textAlign: 'right', fontSize: 12, fontVariantNumeric: 'tabular-nums', color: '#d1d4dc', fontWeight: 500 }}>
                {fmt(quote?.price, quote?.decimals ?? 2)}
            </div>
            {/* Abs change */}
            <div style={{ textAlign: 'right', fontSize: 11, fontVariantNumeric: 'tabular-nums', color: chgColor }}>
                {fmtChg(quote?.change, quote?.decimals ?? 2)}
            </div>
            {/* % change */}
            <div style={{
                textAlign: 'right', fontSize: 11, fontVariantNumeric: 'tabular-nums',
                color: '#fff', fontWeight: 600,
                background: chgColor, borderRadius: 3,
                padding: '1px 4px', display: 'inline-block',
            }}>
                {fmtPct(quote?.changePct)}
            </div>
        </button>
    );
}

const groupHeaderStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: '8px 10px 4px',
    background: 'transparent', border: 'none', color: '#666',
    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
    cursor: 'pointer', textAlign: 'left',
};

export default memo(WatchlistWidget);

import React, { memo, useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Search, X } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';
import { useMarketData } from '../../context/MarketDataContext';
import { parseSearch } from '../../services/topstocxAI';

// Groups render in the watchlist. `symbol` is the canonical key we send
// to the chart via setSelectedSymbol; AdvancedChart maps it to a TV symbol.
const GROUPS = [
    {
        label: 'Stocks',
        items: [
            { symbol: 'AAPL', name: 'Apple' },
            { symbol: 'TSLA', name: 'Tesla' },
            { symbol: 'NVDA', name: 'NVIDIA' },
            { symbol: 'MSFT', name: 'Microsoft' },
            { symbol: 'AMZN', name: 'Amazon' },
        ],
    },
    {
        label: 'Crypto',
        items: [
            { symbol: 'BTCUSDT', name: 'Bitcoin' },
            { symbol: 'ETHUSDT', name: 'Ethereum' },
            { symbol: 'SOLUSDT', name: 'Solana' },
            { symbol: 'BNBUSDT', name: 'BNB' },
        ],
    },
    {
        label: 'Forex',
        items: [
            { symbol: 'EURUSD', name: 'EUR / USD' },
            { symbol: 'GBPUSD', name: 'GBP / USD' },
            { symbol: 'USDJPY', name: 'USD / JPY' },
        ],
    },
];

// Every symbol the watchlist knows about — flat list, used both for the
// local asset-class lookup and as the `availableSymbols` context we hand
// to the AI parser so it can't hallucinate tickers that don't exist here.
const ALL_ITEMS = GROUPS.flatMap(g =>
    g.items.map(i => ({ ...i, assetClass: g.label.toLowerCase() }))
);

const fmtPrice = (price, decimals = 2) => {
    if (price == null || Number.isNaN(price)) return '—';
    return price.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

const fmtPct = (pct) => {
    if (pct == null || Number.isNaN(pct)) return '';
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
};

/**
 * Looks-like-natural-language heuristic.
 *
 * We only want to spend an API call when a plain local filter won't do.
 * A query like "AAPL" or "bitcoin" is obviously a symbol/name match —
 * the local `includes` check answers it in 0ms.
 *
 * But "crypto over 50k" or "biggest gainer" is semantic — that's where
 * we reach for parseSearch. Rule of thumb: more than 2 tokens OR a
 * clearly semantic keyword.
 */
const SEMANTIC_HINTS = /\b(top|gainer|loser|above|over|under|below|best|worst|biggest|up|down|crypto|coin|stocks?|forex|my)\b/i;
function looksLikeNL(q) {
    if (!q) return false;
    if (q.length < 3) return false;
    const tokens = q.trim().split(/\s+/);
    if (tokens.length >= 3) return true;
    return SEMANTIC_HINTS.test(q);
}

/**
 * Apply a structured filter returned from parseSearch to our local
 * ALL_ITEMS list. Matches the server's filter schema:
 *   { type: 'crypto'|'stock'|'forex'|'all',
 *     priceMin: number|null, priceMax: number|null,
 *     changeMin: number|null, changeMax: number|null,  // percent
 *     symbols: string[] }
 *
 * We apply it locally against live quotes so the ordering reflects
 * the prices the user is actually seeing on screen — and the AI
 * never has to hallucinate numbers.
 */
function applyStructuredFilter(filter, quotes) {
    if (!filter || typeof filter !== 'object') return null;

    let rows = ALL_ITEMS.map(item => ({
        ...item,
        quote: quotes[item.symbol] || null,
    }));

    // Asset class filter. Server uses singular ("crypto","stock","forex");
    // our ALL_ITEMS tag is plural lowercase ("stocks","crypto","forex")
    // since it comes from GROUPS[].label. Normalize.
    if (filter.type && filter.type !== 'all') {
        const t = String(filter.type).toLowerCase();
        rows = rows.filter(r => {
            if (t === 'crypto') return r.assetClass === 'crypto';
            if (t === 'stock')  return r.assetClass === 'stocks';
            if (t === 'forex')  return r.assetClass === 'forex';
            return true;
        });
    }

    // Specific symbol whitelist — if the parser extracted tickers, honor
    // them as an OR against the class filter above so a query like
    // "nvidia and tesla" works even without a class.
    if (Array.isArray(filter.symbols) && filter.symbols.length) {
        const wanted = new Set(filter.symbols.map(s => String(s).toUpperCase()));
        // If symbols were specified AND a type, narrow to intersection;
        // if ONLY symbols, rows starts from the full list already filtered.
        rows = rows.filter(r => wanted.has(r.symbol));
    }

    if (typeof filter.priceMin === 'number') {
        rows = rows.filter(r => (r.quote?.price ?? -Infinity) >= filter.priceMin);
    }
    if (typeof filter.priceMax === 'number') {
        rows = rows.filter(r => (r.quote?.price ?? Infinity) <= filter.priceMax);
    }

    if (typeof filter.changeMin === 'number') {
        rows = rows.filter(r => (r.quote?.changePct ?? -Infinity) >= filter.changeMin);
        // Sort gainers-first when a positive threshold is implied
        if (filter.changeMin >= 0) {
            rows.sort((a, b) => (b.quote?.changePct ?? -Infinity) - (a.quote?.changePct ?? -Infinity));
        }
    }
    if (typeof filter.changeMax === 'number') {
        rows = rows.filter(r => (r.quote?.changePct ?? Infinity) <= filter.changeMax);
        // Losers-first when threshold is negative
        if (filter.changeMax <= 0) {
            rows.sort((a, b) => (a.quote?.changePct ?? Infinity) - (b.quote?.changePct ?? Infinity));
        }
    }

    return rows.map(({ quote, ...rest }) => rest); // drop quote, caller re-reads
}

const WatchlistWidget = () => {
    const { selectedSymbol, setSelectedSymbol } = useLeverate();
    const { cryptoPrices, stocks, forex } = useMarketData();
    const [query, setQuery] = useState('');
    const [nlResult, setNlResult] = useState(null);   // null | array of items (AI-filtered)
    const [nlLabel, setNlLabel] = useState(null);     // human-readable interpretation
    const [nlLoading, setNlLoading] = useState(false);
    const [nlError, setNlError] = useState(null);
    const abortRef = useRef(null);
    const debounceRef = useRef(null);

    // Build a lookup resolving quote data for each symbol
    const quotes = useMemo(() => {
        const out = {};

        stocks.forEach((s) => {
            out[s.symbol] = {
                price: s.price,
                changePct: s.changePct,
                decimals: 2,
            };
        });

        Object.entries(cryptoPrices).forEach(([key, c]) => {
            if (!c) return;
            out[c.symbol] = {
                price: c.price,
                changePct: c.changePct,
                decimals: c.price < 10 ? 4 : 2,
            };
        });

        forex.forEach((f) => {
            const clean = f.symbol.replace('/', '');
            out[clean] = {
                price: f.price,
                changePct: f.changePct,
                decimals: clean === 'USDJPY' ? 2 : 4,
            };
        });

        return out;
    }, [cryptoPrices, stocks, forex]);

    // Cancel any pending NL request and clear timers.
    const cancelNL = useCallback(() => {
        abortRef.current?.abort();
        clearTimeout(debounceRef.current);
    }, []);

    // Debounced natural-language parse. Fires 350ms after the user stops
    // typing, only when the query looks semantic. Plain ticker queries
    // never hit the API.
    useEffect(() => {
        cancelNL();
        const q = query.trim();

        if (!q) {
            setNlResult(null);
            setNlLabel(null);
            setNlError(null);
            setNlLoading(false);
            return;
        }

        if (!looksLikeNL(q)) {
            // Plain local search — clear any previous AI state.
            setNlResult(null);
            setNlLabel(null);
            setNlError(null);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            const ctrl = new AbortController();
            abortRef.current = ctrl;
            setNlLoading(true);
            setNlError(null);

            try {
                const res = await parseSearch(
                    q,
                    ALL_ITEMS.map(i => i.symbol),
                    { signal: ctrl.signal }
                );
                if (ctrl.signal.aborted) return;

                const filter = res?.structured || null;
                const filtered = applyStructuredFilter(filter, quotes);
                setNlResult(filtered);
                setNlLabel(res?.text || describeFilter(filter));
            } catch (e) {
                if (e.name === 'AbortError') return;
                setNlError(e.message || 'Search failed');
                setNlResult(null);
            } finally {
                if (!ctrl.signal.aborted) setNlLoading(false);
            }
        }, 350);

        return cancelNL;
        // `quotes` intentionally not a dep — we re-apply locally on every render below
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    useEffect(() => () => cancelNL(), [cancelNL]);

    const q = query.trim().toUpperCase();
    const isNL = looksLikeNL(query.trim());

    // If we have an AI-parsed result, render a single flat list. Otherwise
    // render the grouped default view with plain substring filtering.
    const renderAIResults = isNL && nlResult != null;

    return (
        <div style={styles.container}>
            <div style={styles.searchWrap}>
                <div style={styles.searchBox}>
                    {isNL ? (
                        <Sparkles size={13} style={{ flexShrink: 0, color: '#0084FF' }} />
                    ) : (
                        <Search size={13} style={{ flexShrink: 0, color: '#8a93a6' }} />
                    )}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Try "crypto under 100" or "top gainers"'
                        style={styles.searchInput}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            aria-label="Clear"
                            style={styles.clearBtn}
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
                {isNL && (nlLabel || nlLoading || nlError) && (
                    <div style={styles.nlHint}>
                        {nlLoading && 'Thinking…'}
                        {!nlLoading && nlError && <span style={{ color: '#ff9b9b' }}>{nlError}</span>}
                        {!nlLoading && !nlError && nlLabel && <span>{nlLabel}</span>}
                    </div>
                )}
            </div>

            <div style={styles.scrollArea}>
                {renderAIResults ? (
                    <div style={styles.group}>
                        <div style={styles.groupHeader}>
                            AI match{nlResult.length === 1 ? '' : 'es'} ({nlResult.length})
                        </div>
                        {nlResult.length === 0 ? (
                            <div style={styles.empty}>Nothing in the watchlist matches.</div>
                        ) : (
                            nlResult.map((item) => (
                                <Row
                                    key={item.symbol}
                                    item={item}
                                    quote={quotes[item.symbol]}
                                    active={selectedSymbol === item.symbol}
                                    onClick={() => setSelectedSymbol(item.symbol)}
                                />
                            ))
                        )}
                    </div>
                ) : (
                    GROUPS.map((group) => {
                        const visible = q
                            ? group.items.filter(
                                  (i) =>
                                      i.symbol.includes(q) ||
                                      i.name.toUpperCase().includes(q)
                              )
                            : group.items;
                        if (visible.length === 0) return null;

                        return (
                            <div key={group.label} style={styles.group}>
                                <div style={styles.groupHeader}>{group.label}</div>
                                {visible.map((item) => (
                                    <Row
                                        key={item.symbol}
                                        item={item}
                                        quote={quotes[item.symbol]}
                                        active={selectedSymbol === item.symbol}
                                        onClick={() => setSelectedSymbol(item.symbol)}
                                    />
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
    const up = quote && quote.changePct >= 0;
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                ...styles.row,
                ...(active ? styles.rowActive : null),
            }}
        >
            <div style={styles.rowLeft}>
                <div style={styles.symbol}>{item.symbol}</div>
                <div style={styles.name}>{item.name}</div>
            </div>
            <div style={styles.rowRight}>
                <div style={styles.price}>
                    {fmtPrice(quote?.price, quote?.decimals ?? 2)}
                </div>
                <div
                    style={{
                        ...styles.pct,
                        color: up ? '#39B54A' : '#ff5468',
                    }}
                >
                    {fmtPct(quote?.changePct)}
                </div>
            </div>
        </button>
    );
}

// Fallback label when the model didn't include a `text` summary.
function describeFilter(f) {
    if (!f) return null;
    const parts = [];
    if (f.type && f.type !== 'all') parts.push(f.type);
    if (typeof f.priceMin === 'number') parts.push(`> $${f.priceMin}`);
    if (typeof f.priceMax === 'number') parts.push(`< $${f.priceMax}`);
    if (typeof f.changeMin === 'number' && f.changeMin >= 0) parts.push('gainers');
    if (typeof f.changeMax === 'number' && f.changeMax <= 0) parts.push('losers');
    if (Array.isArray(f.symbols) && f.symbols.length) parts.push(f.symbols.join(', '));
    return parts.length ? `Showing: ${parts.join(' · ')}` : null;
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: 'transparent',
        color: '#e6e9ef',
        fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    searchWrap: {
        padding: '10px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
    },
    searchBox: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
        padding: '6px 8px',
        boxSizing: 'border-box',
    },
    searchInput: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        color: '#e6e9ef',
        fontSize: 13,
        padding: 0,
        outline: 'none',
    },
    clearBtn: {
        width: 18,
        height: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: 'none',
        color: '#8a93a6',
        cursor: 'pointer',
        padding: 0,
    },
    nlHint: {
        marginTop: 6,
        fontSize: 11,
        color: '#8a93a6',
        paddingLeft: 4,
    },
    scrollArea: {
        flex: 1,
        overflowY: 'auto',
        padding: '6px 0',
    },
    group: {
        padding: '6px 0 10px',
    },
    groupHeader: {
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'rgba(230,233,239,0.45)',
        padding: '6px 14px',
        fontWeight: 600,
    },
    empty: {
        padding: '12px 14px',
        fontSize: 12,
        color: '#8a93a6',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '8px 14px',
        background: 'transparent',
        border: 'none',
        borderLeft: '2px solid transparent',
        color: 'inherit',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.12s ease, border-color 0.12s ease',
    },
    rowActive: {
        background: 'rgba(0,90,255,0.12)',
        borderLeft: '2px solid #005AFF',
    },
    rowLeft: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
    },
    rowRight: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    symbol: {
        fontSize: 13,
        fontWeight: 600,
        color: '#f4f6fb',
    },
    name: {
        fontSize: 11,
        color: 'rgba(230,233,239,0.5)',
        marginTop: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: 160,
    },
    price: {
        fontSize: 13,
        fontVariantNumeric: 'tabular-nums',
        color: '#f4f6fb',
    },
    pct: {
        fontSize: 11,
        fontVariantNumeric: 'tabular-nums',
        marginTop: 2,
    },
};

export default memo(WatchlistWidget);

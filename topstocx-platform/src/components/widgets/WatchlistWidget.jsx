import React, { memo, useState, useMemo } from 'react';
import { useLeverate } from '../../context/LeverateContext';
import { useMarketData } from '../../context/MarketDataContext';

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

const WatchlistWidget = () => {
    const { selectedSymbol, setSelectedSymbol } = useLeverate();
    const { cryptoPrices, stocks, forex } = useMarketData();
    const [query, setQuery] = useState('');

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

    const q = query.trim().toUpperCase();

    return (
        <div style={styles.container}>
            <div style={styles.searchWrap}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search watchlist…"
                    style={styles.searchInput}
                />
            </div>

            <div style={styles.scrollArea}>
                {GROUPS.map((group) => {
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
                            {visible.map((item) => {
                                const quote = quotes[item.symbol];
                                const isActive = selectedSymbol === item.symbol;
                                const up = quote && quote.changePct >= 0;

                                return (
                                    <button
                                        key={item.symbol}
                                        type="button"
                                        onClick={() => setSelectedSymbol(item.symbol)}
                                        style={{
                                            ...styles.row,
                                            ...(isActive ? styles.rowActive : null),
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
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

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
    searchInput: {
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
        color: '#e6e9ef',
        fontSize: 13,
        padding: '7px 10px',
        outline: 'none',
        boxSizing: 'border-box',
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

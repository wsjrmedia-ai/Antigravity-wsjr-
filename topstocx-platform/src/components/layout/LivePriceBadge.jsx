import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLeverate } from '../../context/LeverateContext';
import { useMarketData } from '../../context/MarketDataContext';

function resolveQuote(symbol, market) {
    if (!symbol) return null;
    const upper = symbol.toUpperCase();
    const { stocks, indices, commodities, forex, cryptoPrices } = market;

    const s = stocks.find(x => x.symbol === upper);
    if (s) return { price: s.price, change: s.change, changePct: s.changePct, decimals: 2, kind: 'stock' };

    const i = indices.find(x => x.symbol === upper);
    if (i) return { price: i.price, change: i.change, changePct: i.changePct, decimals: 2, kind: 'index' };

    const c = (commodities || []).find(x => x.symbol === upper);
    if (c) return { price: c.price, change: c.change, changePct: c.changePct, decimals: 2, kind: 'commodity' };

    const f = forex.find(x => x.symbol.replace('/', '') === upper);
    if (f) return {
        price: f.price, change: f.change, changePct: f.changePct,
        decimals: upper === 'USDJPY' ? 3 : 5, kind: 'forex'
    };

    // Crypto map is keyed by lowercase symbol
    const cr = cryptoPrices[upper.toLowerCase()];
    if (cr) return {
        price: cr.price, change: cr.change, changePct: cr.changePct,
        decimals: cr.price < 10 ? 4 : 2, kind: 'crypto'
    };

    return null;
}

const fmt = (v, d = 2) => v == null || Number.isNaN(v)
    ? '—'
    : v.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

const LivePriceBadge = () => {
    const { selectedSymbol } = useLeverate();
    const market = useMarketData();
    const quote = useMemo(() => resolveQuote(selectedSymbol, market), [selectedSymbol, market]);

    const lastPriceRef = useRef(null);
    const [flash, setFlash] = useState(null); // 'up' | 'down' | null

    useEffect(() => {
        const p = quote?.price;
        if (p == null) return;
        const prev = lastPriceRef.current;
        if (prev != null && p !== prev) {
            setFlash(p > prev ? 'up' : 'down');
            const t = setTimeout(() => setFlash(null), 450);
            lastPriceRef.current = p;
            return () => clearTimeout(t);
        }
        lastPriceRef.current = p;
    }, [quote?.price]);

    if (!quote) {
        return (
            <div className="topbar-liveprice" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 10px',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>—</span>
            </div>
        );
    }

    const up = (quote.changePct ?? 0) >= 0;
    const accent = up ? '#26a69a' : '#ef5350';
    const flashBg = flash === 'up' ? 'rgba(38,166,154,0.18)'
                  : flash === 'down' ? 'rgba(239,83,80,0.18)'
                  : 'rgba(255,255,255,0.03)';

    return (
        <div className="topbar-liveprice" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '4px 10px',
            borderRadius: 6,
            background: flashBg,
            border: '1px solid rgba(255,255,255,0.06)',
            transition: 'background .35s',
            fontVariantNumeric: 'tabular-nums',
        }}>
            <span style={{
                fontSize: 14, fontWeight: 800, color: '#fff',
                letterSpacing: '0.2px',
            }}>
                {fmt(quote.price, quote.decimals)}
            </span>
            <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 700, color: accent,
            }}>
                <span>{up ? '▲' : '▼'}</span>
                <span>{up ? '+' : ''}{fmt(quote.change, quote.decimals)}</span>
                <span style={{ opacity: 0.85 }}>
                    ({up ? '+' : ''}{quote.changePct?.toFixed(2)}%)
                </span>
            </span>
        </div>
    );
};

export default LivePriceBadge;

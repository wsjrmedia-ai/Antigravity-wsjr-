import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';
import ExplainChartPanel from './ExplainChartPanel';

const AdvancedChart = () => {
    const { selectedSymbol, selectedPeriod, setSelectedSymbol } = useLeverate();
    const wrapperRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Best-effort: intercept TradingView's postMessage events to keep our
    // context in sync when the user changes symbol inside the chart widget.
    useEffect(() => {
        const REVERSE_MAP = Object.fromEntries(
            Object.entries(SYMBOL_MAP).map(([k, v]) => [v, k])
        );
        const handleMsg = (e) => {
            try {
                if (!e.data || typeof e.data !== 'object') return;
                const name = e.data.name || e.data.type || '';
                const sym  = e.data.symbol || e.data.ticker || e.data.value || '';
                if (!sym) return;
                const isSymChange = /symbol/i.test(name) || name === 'change';
                if (!isSymChange) return;
                // "FX:EURUSD" → "EURUSD", or just "EURUSD"
                const canonical = REVERSE_MAP[sym] || (sym.includes(':') ? sym.split(':')[1] : sym);
                if (canonical && canonical !== selectedSymbol) {
                    setSelectedSymbol(canonical);
                }
            } catch {}
        };
        window.addEventListener('message', handleMsg);
        return () => window.removeEventListener('message', handleMsg);
    }, [selectedSymbol, setSelectedSymbol]);

    // Map Leverate periods to TradingView format
    const formatPeriod = (period) => {
        // Leverate provides ints like 1, 5, 15, 60
        // TradingView takes strings like "1", "5", "15", "60", "D", "W"
        return String(period);
    };

    // Map canonical symbols (as stored in LeverateContext / set by Watchlist)
    // to exchange-qualified TradingView symbols.
    const SYMBOL_MAP = {
        // Stocks
        AAPL: 'NASDAQ:AAPL',
        TSLA: 'NASDAQ:TSLA',
        NVDA: 'NASDAQ:NVDA',
        MSFT: 'NASDAQ:MSFT',
        AMZN: 'NASDAQ:AMZN',
        GOOGL: 'NASDAQ:GOOGL',
        META: 'NASDAQ:META',
        AMD: 'NASDAQ:AMD',
        // Crypto
        BTCUSD: 'BINANCE:BTCUSDT',
        BTCUSDT: 'BINANCE:BTCUSDT',
        ETHUSD: 'BINANCE:ETHUSDT',
        ETHUSDT: 'BINANCE:ETHUSDT',
        SOLUSDT: 'BINANCE:SOLUSDT',
        BNBUSDT: 'BINANCE:BNBUSDT',
        XRPUSDT: 'BINANCE:XRPUSDT',
        ADAUSDT: 'BINANCE:ADAUSDT',
        DOGEUSDT: 'BINANCE:DOGEUSDT',
        // Forex
        EURUSD: 'FX:EURUSD',
        GBPUSD: 'FX:GBPUSD',
        USDJPY: 'FX:USDJPY',
        AUDUSD: 'FX:AUDUSD',
        USDCHF: 'FX:USDCHF',
        USDCAD: 'FX:USDCAD',
        NZDUSD: 'FX:NZDUSD',
        EURGBP: 'FX:EURGBP',
        EURJPY: 'FX:EURJPY',
        GBPJPY: 'FX:GBPJPY',
        // Commodities
        XAUUSD: 'TVC:GOLD',
        GOLD: 'TVC:GOLD',
        XAGUSD: 'TVC:SILVER',
        SILVER: 'TVC:SILVER',
        USOIL: 'TVC:USOIL',
        OIL: 'TVC:USOIL',
        // Indices
        US30: 'TVC:DJI',
        NAS100: 'NASDAQ:NDX',
        SPX: 'SP:SPX',
        US500: 'SP:SPX',
        GER40: 'XETR:DAX',
        DAX: 'XETR:DAX',
        UK100: 'LSE:UKX',
    };

    const tvSymbol = useMemo(() => {
        if (!selectedSymbol) return 'FX:EURUSD';
        // Already prefixed with exchange? pass through.
        if (selectedSymbol.includes(':')) return selectedSymbol;
        return SYMBOL_MAP[selectedSymbol] || selectedSymbol;
    }, [selectedSymbol]);

    // Track native fullscreen state (user can also exit with Esc)
    useEffect(() => {
        const onChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };
        document.addEventListener('fullscreenchange', onChange);
        document.addEventListener('webkitfullscreenchange', onChange);
        return () => {
            document.removeEventListener('fullscreenchange', onChange);
            document.removeEventListener('webkitfullscreenchange', onChange);
        };
    }, []);

    const toggleFullscreen = useCallback(async () => {
        const el = wrapperRef.current;
        if (!el) return;

        try {
            if (!document.fullscreenElement) {
                if (el.requestFullscreen) await el.requestFullscreen();
                else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
            } else {
                if (document.exitFullscreen) await document.exitFullscreen();
                else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
            }
        } catch (err) {
            console.warn('[AdvancedChart] fullscreen toggle failed:', err);
        }
    }, []);

    return (
        <div
            ref={wrapperRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: '#131722',
            }}
        >
            <AdvancedRealTimeChart
                key={`${tvSymbol}-${selectedPeriod}`}
                theme="dark"
                symbol={tvSymbol}
                interval={formatPeriod(selectedPeriod)}
                timezone="Etc/UTC"
                style="1"
                locale="en"
                enable_publishing={false}
                hide_top_toolbar={false}
                hide_legend={false}
                save_image={false}
                allow_symbol_change={true}
                container_id="tv_advanced_chart"
                width="100%"
                height="100%"
            />

            {/* Fullscreen toggle overlay */}
            <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen chart'}
                style={{
                    position: 'absolute',
                    top: 10,
                    right: 12,
                    zIndex: 20,
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(19, 23, 34, 0.75)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 6,
                    color: '#e6e9ef',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 90, 255, 0.25)';
                    e.currentTarget.style.borderColor = 'rgba(0, 90, 255, 0.55)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(19, 23, 34, 0.75)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
            >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* AI "Explain" overlay — sits left of the fullscreen button.
                Lives inside the same wrapper so it follows into fullscreen. */}
            <ExplainChartPanel />
        </div>
    );
};

export default AdvancedChart;

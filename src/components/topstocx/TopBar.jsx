import { useState, useRef, useEffect } from 'react';
import topstocxLogo from '../../assets/topstocx-logo.png';

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', 'D'];

const TopBar = ({
    activeView,
    onViewChange,
    symbol = 'EURUSD',
    onSymbolChange,
    timeframe = '15m',
    onTimeframeChange,
    equity = null,
    connected = false,
}) => {
    const [productsOpen, setProductsOpen] = useState(false);
    const [symbolEditing, setSymbolEditing] = useState(false);
    const [symbolInput, setSymbolInput] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (symbolEditing && inputRef.current) inputRef.current.focus();
    }, [symbolEditing]);

    const commitSymbol = () => {
        const val = symbolInput.trim().toUpperCase();
        if (val) onSymbolChange?.(val);
        setSymbolInput('');
        setSymbolEditing(false);
    };

    const handleSymbolKey = (e) => {
        if (e.key === 'Enter') commitSymbol();
        if (e.key === 'Escape') { setSymbolInput(''); setSymbolEditing(false); }
    };

    return (
        <div className="topbar-root" style={{
            height: '48px',
            background: '#131722',
            borderBottom: '1px solid #2a2e39',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '16px',
            position: 'relative',
            zIndex: 100,
            overflowX: 'auto',
            overflowY: 'hidden',
        }}>
        <style>{`
            .topbar-root::-webkit-scrollbar { display: none; }
            .topbar-root { scrollbar-width: none; }
            @media (max-width: 768px) {
                .topbar-root { gap: 8px !important; padding: 0 8px !important; }
                .topbar-indicators { display: none !important; }
                .topbar-equity-label { display: none !important; }
                .topbar-divider { display: none !important; }
            }
            @media (max-width: 480px) {
                .topbar-timeframes { display: none !important; }
                .topbar-equity-value { font-size: 11px !important; }
                .topbar-avatar { width: 24px !important; height: 24px !important; font-size: 9px !important; }
            }
        `}</style>
            {/* Logo */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <img 
                    src={topstocxLogo} 
                    alt="TopStocX Logo" 
                    style={{ height: '36px', objectFit: 'contain', transform: 'translateY(2px)' }} 
                />
            </div>

            <div style={{ width: '1px', height: '24px', background: '#2a2e39' }} />

            {/* Symbol chip — click to edit */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
                {symbolEditing ? (
                    <input
                        ref={inputRef}
                        value={symbolInput}
                        onChange={e => setSymbolInput(e.target.value.toUpperCase())}
                        onKeyDown={handleSymbolKey}
                        onBlur={commitSymbol}
                        placeholder={symbol}
                        style={{
                            background: '#2a2e39',
                            border: '1px solid #2962ff',
                            color: '#fff',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            width: '110px',
                            outline: 'none',
                        }}
                    />
                ) : (
                    <div
                        onClick={() => setSymbolEditing(true)}
                        title="Click to change symbol"
                        style={{
                            background: '#2a2e39',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <span style={{ fontWeight: 'bold', color: '#fff' }}>{symbol}</span>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: connected ? '#26a69a' : '#868993',
                            background: connected ? 'rgba(38,166,154,0.15)' : 'rgba(134,137,147,0.15)',
                            padding: '1px 6px',
                            borderRadius: '3px',
                        }}>
                            {connected ? 'CONNECTED' : 'OFFLINE'}
                        </span>
                    </div>
                )}
            </div>

            {/* Timeframes */}
            {activeView !== 'copytrade' && (
                <>
                    <div className="topbar-timeframes" style={{ display: 'flex', gap: '4px' }}>
                        {TIMEFRAMES.map(tf => (
                            <div
                                key={tf}
                                onClick={() => onTimeframeChange?.(tf)}
                                style={{
                                    padding: '4px 8px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    borderRadius: '3px',
                                    color: tf === timeframe ? '#fff' : '#868993',
                                    background: tf === timeframe ? '#2962ff' : 'transparent',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {tf}
                            </div>
                        ))}
                    </div>

                    <div className="topbar-divider" style={{ width: '1px', height: '24px', background: '#2a2e39' }} />

                    <div className="topbar-indicators" style={{ fontSize: '14px', color: '#d1d4dc', cursor: 'pointer' }}>
                        Indicators
                    </div>
                </>
            )}

            <div style={{ flex: 1 }} />

            {/* Products dropdown */}
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setProductsOpen(o => !o)}
                    style={{
                        background: productsOpen ? '#2a2e39' : 'transparent',
                        border: '1px solid #2a2e39',
                        color: '#d1d4dc',
                        padding: '5px 14px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background 0.15s',
                    }}
                >
                    Products
                    <span style={{ fontSize: '10px', opacity: 0.7 }}>{productsOpen ? '▲' : '▼'}</span>
                </button>

                {productsOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '110%',
                        right: 0,
                        background: '#1e222d',
                        border: '1px solid #2a2e39',
                        borderRadius: '6px',
                        minWidth: '180px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                    }}>
                        <div
                            onClick={() => { onViewChange('chart'); setProductsOpen(false); }}
                            style={{
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: activeView === 'chart' ? '#d4af37' : '#d1d4dc',
                                background: activeView === 'chart' ? 'rgba(212,175,55,0.08)' : 'transparent',
                                borderBottom: '1px solid #2a2e39',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (activeView !== 'chart') e.currentTarget.style.background = '#2a2e39'; }}
                            onMouseLeave={e => { if (activeView !== 'chart') e.currentTarget.style.background = 'transparent'; }}
                        >
                            <span>📊</span> Trading Chart
                        </div>
                        <div
                            onClick={() => { onViewChange('copytrade'); setProductsOpen(false); }}
                            style={{
                                padding: '10px 16px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: activeView === 'copytrade' ? '#d4af37' : '#d1d4dc',
                                background: activeView === 'copytrade' ? 'rgba(212,175,55,0.08)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (activeView !== 'copytrade') e.currentTarget.style.background = '#2a2e39'; }}
                            onMouseLeave={e => { if (activeView !== 'copytrade') e.currentTarget.style.background = 'transparent'; }}
                        >
                            <span>👥</span> Copy Trade
                        </div>
                    </div>
                )}
            </div>

            <div className="topbar-divider" style={{ width: '1px', height: '24px', background: '#2a2e39' }} />

            {/* Account equity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                    <div className="topbar-equity-label" style={{ fontSize: '11px', color: '#868993' }}>EQUITY</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#26a69a' }}>
                        {equity != null
                            ? `$${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '—'}
                    </div>
                </div>
                <div className="topbar-avatar" style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#2962ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    color: '#fff',
                    flexShrink: 0,
                }}>
                    JD
                </div>
            </div>

            {/* Dismiss overlays */}
            {productsOpen && (
                <div
                    onClick={() => setProductsOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: -1 }}
                />
            )}
        </div>
    );
};

export default TopBar;

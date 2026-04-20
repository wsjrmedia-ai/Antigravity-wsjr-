import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Activity, Lightbulb, Bell, LayoutList } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';

const TopBar = ({ onToggleWatchlist, watchlistOpen }) => {
    const { balance, connected, selectedSymbol, selectedPeriod, setSelectedPeriod } = useLeverate();

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <>
        <style>{`
            @media (max-width: 768px) {
                .topbar-indicators, .topbar-tradeideas, .topbar-divider, .topbar-equity { display: none !important; }
                .topbar-timeframes { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; flex-shrink: 0; }
                .topbar-timeframes::-webkit-scrollbar { display: none; }
                .topbar-symbol .topbar-status { display: none; }
            }
            @media (max-width: 480px) {
                .topbar-symbol { max-width: 120px; }
            }
        `}</style>
        <div style={{
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '12px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            zIndex: 10
        }}>
            <Link to="/" style={{
                textDecoration: 'none',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 900,
                letterSpacing: '1.2px',
                display: 'flex',
                alignItems: 'center',
                fontFamily: "'Outfit', sans-serif",
                flexShrink: 0
            }}>
                TOP<span style={{ color: 'var(--brand-blue)' }}>STOCX</span>
            </Link>

            <div className="topbar-symbol" style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-accent)',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                gap: '10px',
                transition: 'all 0.2s',
                flexShrink: 0
            }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#363a45'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-accent)'}>
                <Search size={16} color="var(--text-muted)" />
                <span style={{ fontWeight: '700', fontSize: '14px' }}>{selectedSymbol}</span>
                <span className="topbar-status" style={{ color: connected ? 'var(--brand-green)' : 'var(--brand-red)', fontSize: '12px' }}>
                    {connected ? 'CONNECTED' : 'OFFLINE'}
                </span>
            </div>

            <div className="topbar-timeframes" style={{ display: 'flex', gap: '4px' }}>
                {[
                    { label: '1m', value: 1 },
                    { label: '5m', value: 5 },
                    { label: '15m', value: 15 },
                    { label: '1h', value: 60 },
                    { label: '4h', value: 240 },
                    { label: 'D', value: 1440 }
                ].map(tf => (
                    <div key={tf.label}
                        onClick={() => setSelectedPeriod(tf.value)}
                        style={{
                            padding: '6px 10px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                            color: selectedPeriod === tf.value ? 'var(--brand-blue)' : 'var(--text-secondary)',
                            backgroundColor: selectedPeriod === tf.value ? 'rgba(0, 90, 255, 0.1)' : 'transparent'
                        }} onMouseEnter={e => tf.value !== selectedPeriod && (e.currentTarget.style.backgroundColor = 'var(--bg-accent)')}
                            onMouseLeave={e => tf.value !== selectedPeriod && (e.currentTarget.style.backgroundColor = 'transparent')}>
                        {tf.label}
                    </div>
                ))}
            </div>

            <div className="topbar-divider" style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)' }} />

            <div className="topbar-indicators" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Indicators</span>
                <Activity size={16} />
            </div>

            <div className="topbar-divider" style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)', margin: '0 8px' }} />

            <div className="topbar-tradeideas" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Trade Ideas</span>
                <Lightbulb size={16} />
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="topbar-equity" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Equity</span>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--brand-green)' }}>{formatCurrency(balance.equity)}</span>
                </div>

                {/* Mobile watchlist toggle */}
                <div className="ws-mobile-toggle" onClick={onToggleWatchlist}
                    style={{ width: 40, height: 40, cursor: 'pointer', borderRadius: 8,
                        alignItems: 'center', justifyContent: 'center',
                        backgroundColor: watchlistOpen ? 'rgba(0, 90, 255,0.15)' : 'transparent' }}>
                    <LayoutList size={18} color={watchlistOpen ? 'var(--brand-blue)' : 'var(--text-muted)'} />
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Bell size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '12px',
                        cursor: 'pointer',
                        border: '2px solid rgba(255,255,255,0.1)'
                    }}>JD</div>
                </div>
            </div>
        </div>
        </>
    );
};

export default TopBar;

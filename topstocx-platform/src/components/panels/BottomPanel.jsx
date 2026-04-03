import React, { useState } from 'react';
import { TrendingUp, History, Bell, ClipboardList } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';

const BottomPanel = () => {
    const { positions } = useLeverate();
    const [activeTab, setActiveTab] = useState('Positions');
    const tabs = [
        { id: 'Positions', icon: <TrendingUp size={14} /> },
        { id: 'Orders', icon: <ClipboardList size={14} /> },
        { id: 'History', icon: <History size={14} /> },
        { id: 'Alerts', icon: <Bell size={14} /> },
    ];

    return (
        <div style={{
            height: '260px',
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 5
        }}>
            {/* Tab Header */}
            <div style={{
                height: '42px',
                display: 'flex',
                borderBottom: '1px solid var(--border-color)',
                padding: '0 12px',
                backgroundColor: 'rgba(255,255,255,0.01)'
            }}>
                {tabs.map(tab => (
                    <div key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '0 20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            color: activeTab === tab.id ? 'var(--brand-blue)' : 'var(--text-muted)',
                            borderBottom: activeTab === tab.id ? '2px solid var(--brand-blue)' : 'none',
                            transition: 'all 0.2s',
                            opacity: activeTab === tab.id ? 1 : 0.7
                        }}
                        onMouseEnter={e => !(activeTab === tab.id) && (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={e => !(activeTab === tab.id) && (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                        {tab.icon}
                        {tab.id}
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-secondary)', zIndex: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                        <tr style={{ color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '12px 20px', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Symbol</th>
                            <th style={{ padding: '12px 20px', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Side</th>
                            <th style={{ padding: '12px 20px', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Quantity</th>
                            <th style={{ padding: '12px 20px', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg. Entry</th>
                            <th style={{ padding: '12px 20px', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Mark Price</th>
                            <th style={{ padding: '12px 20px', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Unrealized P&L</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((pos, idx) => (
                            <tr key={idx} style={{
                                borderBottom: '1px solid var(--border-color)',
                                transition: 'background 0.2s'
                            }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <td style={{ padding: '16px 20px', fontWeight: '800', color: '#fff', fontSize: '14px' }}>{pos.InstrumentName || pos.Symbol}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{
                                        color: pos.ActionType === 0 ? 'var(--brand-green)' : 'var(--brand-red)',
                                        backgroundColor: pos.ActionType === 0 ? 'rgba(8, 153, 129, 0.12)' : 'rgba(242, 54, 69, 0.12)',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        textTransform: 'uppercase',
                                        border: pos.ActionType === 0 ? '1px solid rgba(8, 153, 129, 0.2)' : '1px solid rgba(242, 54, 69, 0.2)'
                                    }}>{pos.ActionType === 0 ? 'Buy' : 'Sell'}</span>
                                </td>
                                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '500' }}>{pos.Amount}</td>
                                <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: '500' }}>{pos.OpenRate}</td>
                                <td style={{ padding: '16px 20px', color: 'var(--text-primary)', fontWeight: '700' }}>{pos.CurrentRate}</td>
                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                    <div style={{ fontWeight: '800', color: (pos.ProfitInAccountCurrency || 0) >= 0 ? 'var(--brand-green)' : 'var(--brand-red)', fontSize: '14px' }}>
                                        { (pos.ProfitInAccountCurrency || 0) >= 0 ? '+' : '' }{pos.ProfitInAccountCurrency || '0.00'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BottomPanel;

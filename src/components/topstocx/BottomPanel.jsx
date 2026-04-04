import { useState } from 'react';

const SIDE_LABEL = { 0: 'BUY', 1: 'SELL' };

const SideBadge = ({ actionType }) => {
    const side = SIDE_LABEL[actionType] ?? (actionType === 0 ? 'BUY' : 'SELL');
    const isBuy = side === 'BUY';
    return (
        <span style={{
            background: isBuy ? 'rgba(8,153,129,0.15)' : 'rgba(242,54,69,0.15)',
            color: isBuy ? '#089981' : '#f23645',
            padding: '2px 8px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 'bold',
        }}>
            {side}
        </span>
    );
};

const EmptyRow = ({ cols, message }) => (
    <tr>
        <td colSpan={cols} style={{ padding: '20px 12px', textAlign: 'center', color: '#868993', fontSize: '13px' }}>
            {message}
        </td>
    </tr>
);

const BottomPanel = ({ positions = [], closedPositions = [] }) => {
    const [activeTab, setActiveTab] = useState('Positions');
    const tabs = ['Positions', 'Orders', 'History', 'Alerts'];

    return (
        <div className="bottom-panel-root" style={{
            height: '240px',
            background: '#131722',
            borderTop: '1px solid #2a2e39',
            display: 'flex',
            flexDirection: 'column',
        }}>
        <style>{`
            @media (max-width: 768px) {
                .bottom-panel-root { height: 160px !important; }
                .bottom-panel-th-hide { display: none !important; }
            }
        `}</style>
            {/* Tab bar */}
            <div style={{
                height: '36px',
                display: 'flex',
                borderBottom: '1px solid #2a2e39',
                padding: '0 12px',
                flexShrink: 0,
            }}>
                {tabs.map(tab => (
                    <div
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            color: tab === activeTab ? '#2962ff' : '#868993',
                            borderBottom: tab === activeTab ? '2px solid #2962ff' : 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {tab}
                        {tab === 'Positions' && positions.length > 0 && (
                            <span style={{
                                background: '#2962ff',
                                color: '#fff',
                                borderRadius: '10px',
                                fontSize: '10px',
                                padding: '1px 5px',
                                fontWeight: 'bold',
                            }}>
                                {positions.length}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>

                {activeTab === 'Positions' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ color: '#868993', textAlign: 'left', borderBottom: '1px solid #2a2e39' }}>
                                <th style={{ padding: '8px 12px' }}>SYMBOL</th>
                                <th style={{ padding: '8px 12px' }}>SIDE</th>
                                <th className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>QUANTITY</th>
                                <th className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>AVG. ENTRY</th>
                                <th className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>MARK PRICE</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.length === 0 ? (
                                <EmptyRow cols={6} message="No open positions" />
                            ) : positions.map((pos, i) => {
                                const pnl = pos.ProfitInAccountCurrency ?? 0;
                                return (
                                    <tr key={pos.OrderID ?? i} style={{ borderBottom: '1px solid #232731', color: '#d1d4dc' }}>
                                        <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>{pos.InstrumentName}</td>
                                        <td style={{ padding: '8px 12px' }}><SideBadge actionType={pos.ActionType} /></td>
                                        <td className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>{pos.Amount?.toLocaleString()}</td>
                                        <td className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>{pos.OpenRate?.toFixed(5)}</td>
                                        <td className="bottom-panel-th-hide" style={{ padding: '8px 12px', fontWeight: 'bold' }}>{pos.CurrentRate?.toFixed(5)}</td>
                                        <td style={{ padding: '8px 12px', textAlign: 'right', color: pnl >= 0 ? '#26a69a' : '#ef5350' }}>
                                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {activeTab === 'History' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ color: '#868993', textAlign: 'left', borderBottom: '1px solid #2a2e39' }}>
                                <th style={{ padding: '8px 12px' }}>SYMBOL</th>
                                <th style={{ padding: '8px 12px' }}>SIDE</th>
                                <th className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>QUANTITY</th>
                                <th className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>OPEN</th>
                                <th className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>CLOSE</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {closedPositions.length === 0 ? (
                                <EmptyRow cols={6} message="No closed positions in the last 24h" />
                            ) : closedPositions.map((pos, i) => {
                                const pnl = pos.ProfitInAccountCurrency ?? 0;
                                return (
                                    <tr key={pos.OrderID ?? i} style={{ borderBottom: '1px solid #232731', color: '#d1d4dc' }}>
                                        <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>{pos.InstrumentName}</td>
                                        <td style={{ padding: '8px 12px' }}><SideBadge actionType={pos.ActionType} /></td>
                                        <td className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>{pos.Amount?.toLocaleString()}</td>
                                        <td className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>{pos.OpenRate?.toFixed(5)}</td>
                                        <td className="bottom-panel-th-hide" style={{ padding: '8px 12px' }}>{pos.CloseRate?.toFixed(5)}</td>
                                        <td style={{ padding: '8px 12px', textAlign: 'right', color: pnl >= 0 ? '#26a69a' : '#ef5350' }}>
                                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {(activeTab === 'Orders' || activeTab === 'Alerts') && (
                    <div style={{ padding: '20px 12px', textAlign: 'center', color: '#868993', fontSize: '13px' }}>
                        No {activeTab.toLowerCase()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomPanel;

import { useState } from 'react';

const SIDE_LABEL = { 0: 'BUY', 1: 'SELL' };

const SideBadge = ({ side }) => {
    const isBuy = side === 'BUY';
    return (
        <span style={{
            background: isBuy ? 'rgba(8,153,129,0.15)' : 'rgba(242,54,69,0.15)',
            color: isBuy ? '#089981' : '#f23645',
            padding: '2px 8px', borderRadius: '3px',
            fontSize: '11px', fontWeight: 'bold',
        }}>{side}</span>
    );
};

const EmptyRow = ({ cols, message }) => (
    <tr>
        <td colSpan={cols} style={{ padding: '20px 12px', textAlign: 'center', color: '#868993', fontSize: '13px' }}>
            {message}
        </td>
    </tr>
);

const inputStyle = {
    background: '#0a0a0a', border: '1px solid #2a2e39', color: '#d1d4dc',
    padding: '5px 10px', borderRadius: '4px', fontSize: '12px', outline: 'none',
};

const btnStyle = (primary) => ({
    padding: '5px 14px', borderRadius: '4px', border: 'none',
    background: primary ? '#2962ff' : '#2a2e39',
    color: primary ? '#fff' : '#868993',
    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
});

const BottomPanel = ({ positions = [], closedPositions = [], symbol = 'EURUSD' }) => {
    const [activeTab, setActiveTab] = useState('Positions');

    /* Orders state */
    const [orders,      setOrders]      = useState([]);
    const [showOForm,   setShowOForm]   = useState(false);
    const [oForm, setOForm] = useState({ symbol: '', side: 'BUY', type: 'Limit', price: '', qty: '' });

    /* Alerts state */
    const [alerts,      setAlerts]      = useState([]);
    const [showAForm,   setShowAForm]   = useState(false);
    const [aForm, setAForm] = useState({ symbol: '', price: '', condition: 'above' });

    const submitOrder = () => {
        if (!oForm.price || !oForm.qty) return;
        setOrders(prev => [...prev, {
            id: Date.now(),
            symbol: (oForm.symbol || symbol).toUpperCase(),
            side: oForm.side, type: oForm.type,
            price: parseFloat(oForm.price),
            qty:   parseFloat(oForm.qty),
            status: 'Pending',
            time: new Date().toLocaleTimeString(),
        }]);
        setOForm({ symbol: '', side: 'BUY', type: 'Limit', price: '', qty: '' });
        setShowOForm(false);
    };

    const cancelOrder = (id) => setOrders(prev => prev.filter(o => o.id !== id));

    const submitAlert = () => {
        if (!aForm.price) return;
        setAlerts(prev => [...prev, {
            id: Date.now(),
            symbol: (aForm.symbol || symbol).toUpperCase(),
            price:     parseFloat(aForm.price),
            condition: aForm.condition,
            triggered: false,
            time: new Date().toLocaleTimeString(),
        }]);
        setAForm({ symbol: '', price: '', condition: 'above' });
        setShowAForm(false);
    };

    const removeAlert = (id) => setAlerts(prev => prev.filter(a => a.id !== id));

    const tabs = ['Positions', 'Orders', 'History', 'Alerts'];

    return (
        <div className="bp-root" style={{
            height: '240px', background: '#131722',
            borderTop: '1px solid #2a2e39',
            display: 'flex', flexDirection: 'column',
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .bp-root          { height: 200px !important; }
                    .bp-hide          { display: none !important; }
                    .bp-tab-bar       { gap: 0 !important; }
                    .bp-tab           { padding: 0 10px !important; font-size: 12px !important; }
                }
                @media (max-width: 480px) {
                    .bp-root          { height: 180px !important; }
                    .bp-tab           { padding: 0 8px !important; font-size: 11px !important; }
                }
                .bp-form-row { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; padding: 8px 12px; border-bottom: 1px solid #2a2e39; }
                .bp-form-row input, .bp-form-row select { background: #0a0a0a; border: 1px solid #2a2e39; color: #d1d4dc; padding: 4px 8px; border-radius: 4px; font-size: 12px; outline: none; }
                .bp-form-row select option { background: #131722; }
            `}</style>

            {/* Tab bar */}
            <div className="bp-tab-bar" style={{
                height: '36px', display: 'flex',
                borderBottom: '1px solid #2a2e39',
                padding: '0 12px', flexShrink: 0,
                overflowX: 'auto', overflowY: 'hidden',
            }}>
                {tabs.map(tab => {
                    const badge = tab === 'Positions' && positions.length > 0 ? positions.length
                                : tab === 'Orders'    && orders.length > 0    ? orders.length
                                : tab === 'Alerts'   && alerts.length > 0    ? alerts.length
                                : 0;
                    return (
                        <div key={tab} className="bp-tab" onClick={() => setActiveTab(tab)} style={{
                            padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px',
                            fontSize: '13px', whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                            color: tab === activeTab ? '#2962ff' : '#868993',
                            borderBottom: tab === activeTab ? '2px solid #2962ff' : 'none',
                        }}>
                            {tab}
                            {badge > 0 && (
                                <span style={{
                                    background: tab === 'Alerts' ? '#d4af37' : '#2962ff',
                                    color: '#fff', borderRadius: '10px',
                                    fontSize: '10px', padding: '1px 5px', fontWeight: 'bold',
                                }}>{badge}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'auto' }}>

                {/* ── Positions ── */}
                {activeTab === 'Positions' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ color: '#868993', textAlign: 'left', borderBottom: '1px solid #2a2e39' }}>
                                <th style={{ padding: '8px 12px' }}>SYMBOL</th>
                                <th style={{ padding: '8px 12px' }}>SIDE</th>
                                <th className="bp-hide" style={{ padding: '8px 12px' }}>QUANTITY</th>
                                <th className="bp-hide" style={{ padding: '8px 12px' }}>AVG. ENTRY</th>
                                <th className="bp-hide" style={{ padding: '8px 12px' }}>MARK PRICE</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.length === 0
                                ? <EmptyRow cols={6} message="No open positions" />
                                : positions.map((pos, i) => {
                                    const pnl = pos.ProfitInAccountCurrency ?? 0;
                                    return (
                                        <tr key={pos.OrderID ?? i} style={{ borderBottom: '1px solid #232731', color: '#d1d4dc' }}>
                                            <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>{pos.InstrumentName}</td>
                                            <td style={{ padding: '8px 12px' }}><SideBadge side={SIDE_LABEL[pos.ActionType] ?? 'BUY'} /></td>
                                            <td className="bp-hide" style={{ padding: '8px 12px' }}>{pos.Amount?.toLocaleString()}</td>
                                            <td className="bp-hide" style={{ padding: '8px 12px' }}>{pos.OpenRate?.toFixed(5)}</td>
                                            <td className="bp-hide" style={{ padding: '8px 12px', fontWeight: 'bold' }}>{pos.CurrentRate?.toFixed(5)}</td>
                                            <td style={{ padding: '8px 12px', textAlign: 'right', color: pnl >= 0 ? '#26a69a' : '#ef5350' }}>
                                                {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                )}

                {/* ── Orders ── */}
                {activeTab === 'Orders' && (
                    <>
                        {/* New order form */}
                        {showOForm ? (
                            <div className="bp-form-row">
                                <input
                                    placeholder={symbol} value={oForm.symbol}
                                    onChange={e => setOForm(p => ({ ...p, symbol: e.target.value.toUpperCase() }))}
                                    style={{ width: '80px', ...inputStyle }}
                                />
                                <select value={oForm.side} onChange={e => setOForm(p => ({ ...p, side: e.target.value }))} style={inputStyle}>
                                    <option>BUY</option><option>SELL</option>
                                </select>
                                <select value={oForm.type} onChange={e => setOForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                                    <option>Limit</option><option>Stop</option>
                                </select>
                                <input
                                    placeholder="Price" type="number" value={oForm.price}
                                    onChange={e => setOForm(p => ({ ...p, price: e.target.value }))}
                                    style={{ width: '90px', ...inputStyle }}
                                />
                                <input
                                    placeholder="Qty" type="number" value={oForm.qty}
                                    onChange={e => setOForm(p => ({ ...p, qty: e.target.value }))}
                                    style={{ width: '70px', ...inputStyle }}
                                />
                                <button onClick={submitOrder} style={btnStyle(true)}>Place</button>
                                <button onClick={() => setShowOForm(false)} style={btnStyle(false)}>Cancel</button>
                            </div>
                        ) : (
                            <div style={{ padding: '6px 12px', borderBottom: '1px solid #2a2e39' }}>
                                <button onClick={() => setShowOForm(true)} style={{ ...btnStyle(true), fontSize: '11px', padding: '4px 10px' }}>
                                    + New Order
                                </button>
                            </div>
                        )}

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ color: '#868993', textAlign: 'left', borderBottom: '1px solid #2a2e39' }}>
                                    <th style={{ padding: '6px 12px' }}>SYMBOL</th>
                                    <th style={{ padding: '6px 12px' }}>SIDE</th>
                                    <th style={{ padding: '6px 12px' }}>TYPE</th>
                                    <th className="bp-hide" style={{ padding: '6px 12px' }}>PRICE</th>
                                    <th className="bp-hide" style={{ padding: '6px 12px' }}>QTY</th>
                                    <th style={{ padding: '6px 12px' }}>STATUS</th>
                                    <th style={{ padding: '6px 12px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0
                                    ? <EmptyRow cols={7} message="No pending orders — place one above" />
                                    : orders.map(o => (
                                        <tr key={o.id} style={{ borderBottom: '1px solid #232731', color: '#d1d4dc' }}>
                                            <td style={{ padding: '6px 12px', fontWeight: 'bold' }}>{o.symbol}</td>
                                            <td style={{ padding: '6px 12px' }}><SideBadge side={o.side} /></td>
                                            <td style={{ padding: '6px 12px', color: '#868993' }}>{o.type}</td>
                                            <td className="bp-hide" style={{ padding: '6px 12px' }}>{o.price.toFixed(5)}</td>
                                            <td className="bp-hide" style={{ padding: '6px 12px' }}>{o.qty}</td>
                                            <td style={{ padding: '6px 12px' }}>
                                                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 600 }}>{o.status}</span>
                                            </td>
                                            <td style={{ padding: '6px 12px' }}>
                                                <button onClick={() => cancelOrder(o.id)} style={{
                                                    background: 'none', border: 'none', color: '#ef5350',
                                                    cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                                                }}>✕</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>
                )}

                {/* ── History ── */}
                {activeTab === 'History' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ color: '#868993', textAlign: 'left', borderBottom: '1px solid #2a2e39' }}>
                                <th style={{ padding: '8px 12px' }}>SYMBOL</th>
                                <th style={{ padding: '8px 12px' }}>SIDE</th>
                                <th className="bp-hide" style={{ padding: '8px 12px' }}>QUANTITY</th>
                                <th className="bp-hide" style={{ padding: '8px 12px' }}>OPEN</th>
                                <th className="bp-hide" style={{ padding: '8px 12px' }}>CLOSE</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {closedPositions.length === 0
                                ? <EmptyRow cols={6} message="No closed positions in the last 24h" />
                                : closedPositions.map((pos, i) => {
                                    const pnl = pos.ProfitInAccountCurrency ?? 0;
                                    return (
                                        <tr key={pos.OrderID ?? i} style={{ borderBottom: '1px solid #232731', color: '#d1d4dc' }}>
                                            <td style={{ padding: '8px 12px', fontWeight: 'bold' }}>{pos.InstrumentName}</td>
                                            <td style={{ padding: '8px 12px' }}><SideBadge side={SIDE_LABEL[pos.ActionType] ?? 'BUY'} /></td>
                                            <td className="bp-hide" style={{ padding: '8px 12px' }}>{pos.Amount?.toLocaleString()}</td>
                                            <td className="bp-hide" style={{ padding: '8px 12px' }}>{pos.OpenRate?.toFixed(5)}</td>
                                            <td className="bp-hide" style={{ padding: '8px 12px' }}>{pos.CloseRate?.toFixed(5)}</td>
                                            <td style={{ padding: '8px 12px', textAlign: 'right', color: pnl >= 0 ? '#26a69a' : '#ef5350' }}>
                                                {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                )}

                {/* ── Alerts ── */}
                {activeTab === 'Alerts' && (
                    <>
                        {showAForm ? (
                            <div className="bp-form-row">
                                <input
                                    placeholder={symbol} value={aForm.symbol}
                                    onChange={e => setAForm(p => ({ ...p, symbol: e.target.value.toUpperCase() }))}
                                    style={{ width: '80px', ...inputStyle }}
                                />
                                <select value={aForm.condition} onChange={e => setAForm(p => ({ ...p, condition: e.target.value }))} style={inputStyle}>
                                    <option value="above">Price above</option>
                                    <option value="below">Price below</option>
                                </select>
                                <input
                                    placeholder="Price level" type="number" value={aForm.price}
                                    onChange={e => setAForm(p => ({ ...p, price: e.target.value }))}
                                    style={{ width: '100px', ...inputStyle }}
                                />
                                <button onClick={submitAlert} style={btnStyle(true)}>Set Alert</button>
                                <button onClick={() => setShowAForm(false)} style={btnStyle(false)}>Cancel</button>
                            </div>
                        ) : (
                            <div style={{ padding: '6px 12px', borderBottom: '1px solid #2a2e39' }}>
                                <button onClick={() => setShowAForm(true)} style={{ ...btnStyle(true), fontSize: '11px', padding: '4px 10px', background: '#d4af37', color: '#000' }}>
                                    + New Alert
                                </button>
                            </div>
                        )}

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ color: '#868993', textAlign: 'left', borderBottom: '1px solid #2a2e39' }}>
                                    <th style={{ padding: '6px 12px' }}>SYMBOL</th>
                                    <th style={{ padding: '6px 12px' }}>CONDITION</th>
                                    <th style={{ padding: '6px 12px' }}>PRICE</th>
                                    <th className="bp-hide" style={{ padding: '6px 12px' }}>SET AT</th>
                                    <th style={{ padding: '6px 12px' }}>STATUS</th>
                                    <th style={{ padding: '6px 12px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.length === 0
                                    ? <EmptyRow cols={6} message="No alerts set — add one above" />
                                    : alerts.map(a => (
                                        <tr key={a.id} style={{ borderBottom: '1px solid #232731', color: '#d1d4dc' }}>
                                            <td style={{ padding: '6px 12px', fontWeight: 'bold' }}>{a.symbol}</td>
                                            <td style={{ padding: '6px 12px', color: '#868993', fontSize: '12px' }}>
                                                {a.condition === 'above' ? '↑ Above' : '↓ Below'}
                                            </td>
                                            <td style={{ padding: '6px 12px' }}>{a.price.toFixed(5)}</td>
                                            <td className="bp-hide" style={{ padding: '6px 12px', color: '#868993' }}>{a.time}</td>
                                            <td style={{ padding: '6px 12px' }}>
                                                <span style={{
                                                    color: a.triggered ? '#26a69a' : '#d4af37',
                                                    fontSize: '11px', fontWeight: 600,
                                                }}>
                                                    {a.triggered ? '✓ Triggered' : '⏳ Watching'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '6px 12px' }}>
                                                <button onClick={() => removeAlert(a.id)} style={{
                                                    background: 'none', border: 'none', color: '#ef5350',
                                                    cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                                                }}>✕</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default BottomPanel;

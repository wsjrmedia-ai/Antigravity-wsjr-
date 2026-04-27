import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/topstocx/Sidebar';
import TopBar from '../components/topstocx/TopBar';
import TradingChart from '../components/topstocx/TradingChart';
import BottomPanel from '../components/topstocx/BottomPanel';
import CopyTradePanel from '../components/topstocx/CopyTradePanel';
import ClaudeFinanceChat from '../components/ClaudeFinanceChat';
import { ping, getAccountBalance, getOpenPositions, getClosedPositions } from '../services/leverateApi';

const PERIOD_MAP = { '1m': 1, '5m': 5, '15m': 15, '1h': 60, '4h': 240, 'D': 1440 };
const USER_ID = import.meta.env.VITE_LEVERATE_USER_ID || '';

const TopStocxPage = () => {
    const location = useLocation();

    const [activeView,   setActiveView]   = useState('chart');
    const [symbol,       setSymbol]       = useState('EURUSD');
    const [timeframe,    setTimeframe]    = useState('15m');
    const [connected,    setConnected]    = useState(false);
    const [equity,       setEquity]       = useState(null);
    const [positions,    setPositions]    = useState([]);
    const [closedPositions, setClosedPositions] = useState([]);
    const [activeTool,   setActiveTool]   = useState('cursor');

    const periodMinutes = PERIOD_MAP[timeframe] || 15;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('view') === 'copytrade') setActiveView('copytrade');
    }, [location.search]);

    const refreshAccountData = useCallback(async () => {
        if (!USER_ID) return;
        const [balResult, openResult, closedResult] = await Promise.allSettled([
            getAccountBalance(USER_ID),
            getOpenPositions(USER_ID),
            getClosedPositions(USER_ID, 24),
        ]);
        if (balResult.status === 'fulfilled' && balResult.value)
            setEquity(balResult.value.Equity ?? balResult.value.Balance ?? null);
        if (openResult.status === 'fulfilled')  setPositions(openResult.value);
        if (closedResult.status === 'fulfilled') setClosedPositions(closedResult.value);
    }, []);

    useEffect(() => {
        ping()
            .then(() => { setConnected(true); refreshAccountData(); })
            .catch(() => setConnected(false));
        const interval = setInterval(refreshAccountData, 10_000);
        return () => clearInterval(interval);
    }, [refreshAccountData]);

    return (
        <div style={{
            width: '100vw', height: '100vh',
            background: '#0a0a0a', color: '#d1d4dc',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}>
            <style>{`
                @media (max-width: 768px) { .topstocx-sidebar { display: none !important; } }
            `}</style>

            <TopBar
                activeView={activeView}  onViewChange={setActiveView}
                symbol={symbol}          onSymbolChange={setSymbol}
                timeframe={timeframe}    onTimeframeChange={setTimeframe}
                equity={equity}          connected={connected}
            />

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {activeView === 'chart' && (
                    <div className="topstocx-sidebar">
                        <Sidebar activeTool={activeTool} onToolChange={setActiveTool} />
                    </div>
                )}

                {activeView === 'chart' ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <TradingChart
                                symbol={symbol}
                                periodMinutes={periodMinutes}
                                activeTool={activeTool}
                                onToolReset={() => setActiveTool('cursor')}
                            />
                        </div>
                        <BottomPanel
                            positions={positions}
                            closedPositions={closedPositions}
                            symbol={symbol}
                        />
                    </div>
                ) : (
                    <CopyTradePanel />
                )}
            </div>

            <ClaudeFinanceChat symbol={symbol} timeframe={timeframe} />
        </div>
    );
};

export default TopStocxPage;

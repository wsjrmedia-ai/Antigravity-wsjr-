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

// Set VITE_LEVERATE_USER_ID in your .env to enable live account data
const USER_ID = import.meta.env.VITE_LEVERATE_USER_ID || '';

const TopStocxPage = () => {
    const location = useLocation();

    const [activeView, setActiveView] = useState('chart');
    const [symbol, setSymbol] = useState('EURUSD');
    const [timeframe, setTimeframe] = useState('15m');
    const [connected, setConnected] = useState(false);
    const [equity, setEquity] = useState(null);
    const [positions, setPositions] = useState([]);
    const [closedPositions, setClosedPositions] = useState([]);

    const periodMinutes = PERIOD_MAP[timeframe] || 15;

    // Auto-switch to copy trade view if ?view=copytrade
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
        if (balResult.status === 'fulfilled' && balResult.value) {
            setEquity(balResult.value.Equity ?? balResult.value.Balance ?? null);
        }
        if (openResult.status === 'fulfilled') setPositions(openResult.value);
        if (closedResult.status === 'fulfilled') setClosedPositions(closedResult.value);
    }, []);

    // Ping for connection status, then load account data
    useEffect(() => {
        ping()
            .then(() => { setConnected(true); refreshAccountData(); })
            .catch(() => setConnected(false));

        // Refresh positions + balance every 10 seconds
        const interval = setInterval(refreshAccountData, 10_000);
        return () => clearInterval(interval);
    }, [refreshAccountData]);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: '#0a0a0a',
            color: '#d1d4dc',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}>
            <TopBar
                activeView={activeView}
                onViewChange={setActiveView}
                symbol={symbol}
                onSymbolChange={setSymbol}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                equity={equity}
                connected={connected}
            />

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {activeView === 'chart' && <Sidebar />}

                {activeView === 'chart' ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <TradingChart symbol={symbol} periodMinutes={periodMinutes} />
                        </div>
                        <BottomPanel positions={positions} closedPositions={closedPositions} />
                    </div>
                ) : (
                    <CopyTradePanel />
                )}
            </div>

            <ClaudeFinanceChat />
        </div>
    );
};

export default TopStocxPage;

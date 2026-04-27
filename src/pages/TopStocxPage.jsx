import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../components/topstocx/TopBar';
import TradingChart from '../components/topstocx/TradingChart';
import BottomPanel from '../components/topstocx/BottomPanel';
import CopyTradePanel from '../components/topstocx/CopyTradePanel';
import ClaudeFinanceChat from '../components/ClaudeFinanceChat';

const PERIOD_MAP = { '1m': 1, '5m': 5, '15m': 15, '1h': 60, '4h': 240, 'D': 1440 };

const TopStocxPage = () => {
    const location = useLocation();

    const [activeView,  setActiveView]  = useState('chart');
    const [symbol,      setSymbol]      = useState('EURUSD');
    const [timeframe,   setTimeframe]   = useState('15m');

    const periodMinutes = PERIOD_MAP[timeframe] || 15;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('view') === 'copytrade') setActiveView('copytrade');
    }, [location.search]);

    return (
        <div style={{
            width: '100vw', height: '100vh',
            background: '#0a0a0a', color: '#d1d4dc',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}>
            <TopBar
                activeView={activeView}   onViewChange={setActiveView}
                symbol={symbol}           onSymbolChange={setSymbol}
                timeframe={timeframe}     onTimeframeChange={setTimeframe}
            />

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {activeView === 'chart' ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <TradingChart
                                symbol={symbol}
                                periodMinutes={periodMinutes}
                            />
                        </div>
                        <BottomPanel
                            positions={[]}
                            closedPositions={[]}
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

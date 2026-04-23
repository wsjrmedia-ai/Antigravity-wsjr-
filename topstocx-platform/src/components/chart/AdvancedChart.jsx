import React, { useMemo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useLeverate } from '../../context/LeverateContext';

const AdvancedChart = () => {
    const { selectedSymbol, selectedPeriod } = useLeverate();

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
    };

    const tvSymbol = useMemo(() => {
        if (!selectedSymbol) return 'FX:EURUSD';
        // Already prefixed with exchange? pass through.
        if (selectedSymbol.includes(':')) return selectedSymbol;
        return SYMBOL_MAP[selectedSymbol] || selectedSymbol;
    }, [selectedSymbol]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#131722' }}>
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
                container_id="tv_advanced_chart"
                width="100%"
                height="100%"
            />
        </div>
    );
};

export default AdvancedChart;

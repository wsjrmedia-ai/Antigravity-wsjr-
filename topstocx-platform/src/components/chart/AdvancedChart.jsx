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

    // Sometimes Leverate provides non-TV standard symbols, we pass it down
    // TV handles standard forex (EURUSD) and cryptos gracefully.
    const tvSymbol = useMemo(() => {
        // Simple heuristic: if it's BTCUSDT, route to BINANCE:BTCUSDT for reliability, else raw.
        if (selectedSymbol === 'BTCUSD' || selectedSymbol === 'BTCUSDT') return 'BINANCE:BTCUSDT';
        if (selectedSymbol === 'ETHUSD' || selectedSymbol === 'ETHUSDT') return 'BINANCE:ETHUSDT';
        if (selectedSymbol === 'EURUSD') return 'FX:EURUSD';
        if (selectedSymbol === 'GBPUSD') return 'FX:GBPUSD';
        return selectedSymbol || 'NASDAQ:AAPL';
    }, [selectedSymbol]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#131722' }}>
            <AdvancedRealTimeChart
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

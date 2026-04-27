import { useMemo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

const SYMBOL_MAP = {
    // Stocks
    AAPL: 'NASDAQ:AAPL', TSLA: 'NASDAQ:TSLA', NVDA: 'NASDAQ:NVDA',
    MSFT: 'NASDAQ:MSFT', AMZN: 'NASDAQ:AMZN', GOOGL: 'NASDAQ:GOOGL',
    META: 'NASDAQ:META', AMD: 'NASDAQ:AMD', NFLX: 'NASDAQ:NFLX',
    // Crypto
    BTCUSD:   'BINANCE:BTCUSDT', BTCUSDT:  'BINANCE:BTCUSDT',
    ETHUSD:   'BINANCE:ETHUSDT', ETHUSDT:  'BINANCE:ETHUSDT',
    SOLUSDT:  'BINANCE:SOLUSDT', BNBUSDT:  'BINANCE:BNBUSDT',
    XRPUSDT:  'BINANCE:XRPUSDT', ADAUSDT: 'BINANCE:ADAUSDT',
    DOGEUSDT: 'BINANCE:DOGEUSDT',
    // Forex
    EURUSD: 'FX:EURUSD', GBPUSD: 'FX:GBPUSD', USDJPY: 'FX:USDJPY',
    AUDUSD: 'FX:AUDUSD', USDCHF: 'FX:USDCHF', USDCAD: 'FX:USDCAD',
    NZDUSD: 'FX:NZDUSD', EURGBP: 'FX:EURGBP', EURJPY: 'FX:EURJPY',
    GBPJPY: 'FX:GBPJPY',
    // Commodities / Indices
    XAUUSD: 'TVC:GOLD', XAGUSD: 'TVC:SILVER', USOIL: 'TVC:USOIL',
    US30: 'TVC:US30', SPX500: 'TVC:SPX', NAS100: 'TVC:NDX',
    GER40: 'TVC:DEU40', UK100: 'TVC:UK100',
};

function toTVSymbol(symbol) {
    if (!symbol) return 'FX:EURUSD';
    if (symbol.includes(':')) return symbol;
    return SYMBOL_MAP[symbol.toUpperCase()] || `FX:${symbol.toUpperCase()}`;
}

function toTVInterval(periodMinutes) {
    if (periodMinutes >= 1440) return 'D';
    if (periodMinutes >= 240)  return '240';
    return String(periodMinutes);
}

const TradingChart = ({ symbol = 'EURUSD', periodMinutes = 15 }) => {
    const tvSymbol   = useMemo(() => toTVSymbol(symbol),        [symbol]);
    const tvInterval = useMemo(() => toTVInterval(periodMinutes), [periodMinutes]);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <AdvancedRealTimeChart
                key={`${tvSymbol}-${tvInterval}`}
                theme="dark"
                symbol={tvSymbol}
                interval={tvInterval}
                timezone="Etc/UTC"
                style="1"
                locale="en"
                enable_publishing={false}
                allow_symbol_change={true}
                hide_top_toolbar={false}
                hide_legend={false}
                save_image={false}
                width="100%"
                height="100%"
            />
        </div>
    );
};

export default TradingChart;

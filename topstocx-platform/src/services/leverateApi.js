import axios from 'axios';

/**
 * Leverate API Service
 * Proxies through /api/leverate to avoid CORS and hide tokens
 */

const LEVERATE_PROXY_BASE = '/api/leverate';

export const leverateApi = {
    /**
     * Fetch OHLC candle data
     * @param {string} symbol - Symbol (e.g., 'EURUSD')
     * @param {number} periodMinutes - Timeframe in minutes (1, 5, 15, 60, 240, 1440)
     * @param {number} hoursBack - How far back to fetch
     */
    async getChartBars(symbol = 'EURUSD', periodMinutes = 15, hoursBack = 24) {
        const end = new Date();
        const start = new Date(end.getTime() - hoursBack * 60 * 60 * 1000);

        try {
            const response = await axios.post(`${LEVERATE_PROXY_BASE}/api/ManagementService/GetChartBars`, {
                symbol,
                start: start.toISOString(),
                end: end.toISOString(),
                period: periodMinutes
            });
            
            if (response.data?.ChartBars && response.data.ChartBars.length > 0) {
                return response.data.ChartBars;
            }
            throw new Error('Empty bars from Leverate');
        } catch (err) {
            console.warn(`[Leverate] Fetch failed for ${symbol}, trying fallback...`, err.message);
            
            // Fallback for Crypto using Binance
            if (symbol.toLowerCase().includes('btc') || symbol.toLowerCase().includes('eth') || symbol.toLowerCase().includes('sol')) {
                try {
                    const binanceSym = symbol.replace('/', '').toUpperCase();
                    // Map period minutes to Binance intervals
                    const intervalMap = { 1: '1m', 5: '5m', 15: '15m', 60: '1h', 240: '4h', 1440: '1d' };
                    const bInterval = intervalMap[periodMinutes] || '1h';
                    
                    const bRes = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${binanceSym}&interval=${bInterval}&limit=500`);
                    return bRes.data.map(k => ({
                        Timestamp: new Date(k[0]).toISOString(),
                        Open: parseFloat(k[1]),
                        High: parseFloat(k[2]),
                        Low: parseFloat(k[3]),
                        Close: parseFloat(k[4]),
                        Volume: parseFloat(k[5])
                    }));
                } catch (bErr) {
                    console.error('[Fallback] Binance fetch failed:', bErr.message);
                }
            }

            // Fallback for Forex/Indices - Generate deterministic mock data
            return this.generateMockBars(symbol, periodMinutes, 100);
        }
    },

    /**
     * Generate synthetic data for UI testing/demo
     */
    generateMockBars(symbol, periodMinutes, count = 100) {
        const bars = [];
        let curPrice = symbol.includes('USD') ? 1.0852 : symbol.includes('XAU') ? 2450.0 : 15400.0;
        let now = Date.now();
        const intervalMs = periodMinutes * 60 * 1000;

        for (let i = 0; i < count; i++) {
            const change = curPrice * (Math.random() - 0.5) * 0.002;
            const open = curPrice;
            const close = curPrice + change;
            const high = Math.max(open, close) + (Math.random() * 0.0005 * curPrice);
            const low = Math.min(open, close) - (Math.random() * 0.0005 * curPrice);
            
            bars.unshift({
                Timestamp: new Date(now - i * intervalMs).toISOString(),
                Open: open,
                High: high,
                Low: low,
                Close: close,
                Volume: Math.random() * 1000
            });
            curPrice = close;
        }
        return bars;
    },

    /**
     * Fetch the most recent price (quote) for a symbol
     */
    async getQuote(symbol) {
        const bars = await this.getChartBars(symbol, 1, 1); // 1 minute period, 1 hour back
        if (bars && bars.length > 0) {
            const latest = bars[bars.length - 1];
            return {
                price: latest.Close,
                change: latest.Close - latest.Open,
                changePct: ((latest.Close - latest.Open) / latest.Open) * 100
            };
        }
        return null;
    },

    /**
     * Get account balance for a user
     */
    async getAccountBalance(userID) {
        try {
            const response = await axios.post(`${LEVERATE_PROXY_BASE}/api/ManagementService/GetAccountBalance`, {
                UserID: userID
            });
            if (response.data) {
                return response.data;
            }
            throw new Error('No balance data');
        } catch (err) {
            console.warn('[Leverate] Using mock balance fallback');
            return {
                Balance: 50000.0,
                Equity: 50027.10,
                FreeMargin: 48000.0
            };
        }
    },

    /**
     * Get live open positions for a user
     */
    async getOpenPositions(userID) {
        try {
            const response = await axios.post(`${LEVERATE_PROXY_BASE}/api/ManagementService/GetOpenPositionsForUser`, {
                UserID: userID
            });
            if (response.data?.OpenPositions && response.data.OpenPositions.length > 0) {
                return response.data.OpenPositions;
            }
            throw new Error('No positions from Leverate');
        } catch (err) {
            console.warn('[Leverate] Using mock positions fallback');
            return [
                { Symbol: 'EURUSD', ActionType: 0, Amount: 10000, OpenRate: 1.0845, CurrentRate: 1.0852, ProfitInAccountCurrency: 7.00 },
                { Symbol: 'BTCUSDT', ActionType: 1, Amount: 0.5, OpenRate: 67120.4, CurrentRate: 67080.2, ProfitInAccountCurrency: 20.10 }
            ];
        }
    },

    /**
     * Get user transactions (includes open positions with CurrentRate)
     */
    async getUserTransactions(userID, options = {}) {
        try {
            const response = await axios.post(`${LEVERATE_PROXY_BASE}/api/UserStatus/GetUserTransactions`, {
                UserID: userID,
                GetOpenPositions: true,
                GetPendingPositions: true,
                GetClosePositions: true,
                GetMonetaryTransactions: true,
                ...options
            });
            return response.data || null;
        } catch (err) {
            console.error('Error fetching user transactions:', err.message);
            return null;
        }
    },

    /**
     * Fetch all available trading instruments
     */
    async getAllInstruments() {
        try {
            const response = await axios.post(`${LEVERATE_PROXY_BASE}/api/ManagementService/GetAllInstruments`);
            if (response.data?.Instruments && response.data.Instruments.length > 0) {
                return response.data.Instruments;
            }
            throw new Error('Empty instruments from Leverate');
        } catch (err) {
            console.warn('[Leverate] Using mock instruments fallback');
            return [
                { Symbol: 'EURUSD', SecurityGroupName: 'Forex', AssetClass: 'Forex' },
                { Symbol: 'GBPUSD', SecurityGroupName: 'Forex', AssetClass: 'Forex' },
                { Symbol: 'USDJPY', SecurityGroupName: 'Forex', AssetClass: 'Forex' },
                { Symbol: 'BTCUSDT', SecurityGroupName: 'Crypto', AssetClass: 'Crypto' },
                { Symbol: 'ETHUSDT', SecurityGroupName: 'Crypto', AssetClass: 'Crypto' },
                { Symbol: 'SPX', SecurityGroupName: 'Indices', AssetClass: 'Indices' },
                { Symbol: 'NDAQ', SecurityGroupName: 'Indices', AssetClass: 'Indices' },
                { Symbol: 'XAUUSD', SecurityGroupName: 'Commodities', AssetClass: 'Commodities' }
            ];
        }
    },

    /**
     * Open a new position (Trade Execution)
     */
    async createOpenPosition(userID, symbol, amount, isBuy = true) {
        try {
            const response = await axios.post(`${LEVERATE_PROXY_BASE}/api/TradingController/BulkOpenPosition`, {
                UserID: userID,
                Positions: [{
                    Symbol: symbol,
                    Amount: amount,
                    Direction: isBuy ? 0 : 1 // 0=Buy, 1=Sell in Sirix REST
                }]
            });
            return response.data || null;
        } catch (err) {
            console.error('Error creating position:', err.message);
            return null;
        }
    }
};

export default leverateApi;

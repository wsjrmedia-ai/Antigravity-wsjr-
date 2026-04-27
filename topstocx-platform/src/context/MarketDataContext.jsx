import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { leverateApi } from '../services/leverateApi';

const MarketDataContext = createContext(null);

// ── Seed data ──────────────────────────────────────────────────────────────
const STOCK_SEEDS = [
  { symbol: 'AAPL',  name: 'Apple Inc.',          price: 189.30, sector: 'Technology' },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',      price: 422.86, sector: 'Technology' },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',         price: 924.79, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',        price: 175.12, sector: 'Technology' },
  { symbol: 'META',  name: 'Meta Platforms',       price: 503.44, sector: 'Technology' },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',      price: 184.70, sector: 'Consumer' },
  { symbol: 'TSLA',  name: 'Tesla Inc.',           price: 251.42, sector: 'Automotive' },
  { symbol: 'JPM',   name: 'JPMorgan Chase',       price: 201.57, sector: 'Finance' },
  { symbol: 'V',     name: 'Visa Inc.',            price: 278.91, sector: 'Finance' },
  { symbol: 'BAC',   name: 'Bank of America',      price: 38.24,  sector: 'Finance' },
  { symbol: 'WMT',   name: 'Walmart Inc.',         price: 67.33,  sector: 'Consumer' },
  { symbol: 'XOM',   name: 'ExxonMobil Corp.',     price: 113.28, sector: 'Energy' },
  { symbol: 'JNJ',   name: 'Johnson & Johnson',    price: 147.93, sector: 'Healthcare' },
  { symbol: 'UNH',   name: 'UnitedHealth Group',   price: 491.20, sector: 'Healthcare' },
  { symbol: 'AMD',   name: 'Advanced Micro Devices', price: 162.34, sector: 'Technology' },
];

const FOREX_SEEDS = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar',        price: 1.0847, pip: 0.0001 },
  { symbol: 'GBP/USD', name: 'British Pound / USD',     price: 1.2651, pip: 0.0001 },
  { symbol: 'USD/JPY', name: 'US Dollar / Yen',         price: 149.82, pip: 0.01 },
  { symbol: 'AUD/USD', name: 'Australian Dollar / USD', price: 0.6523, pip: 0.0001 },
  { symbol: 'USD/CHF', name: 'US Dollar / Franc',       price: 0.9041, pip: 0.0001 },
  { symbol: 'USD/CAD', name: 'US Dollar / CAD',         price: 1.3621, pip: 0.0001 },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / USD',price: 0.5987, pip: 0.0001 },
  { symbol: 'EUR/GBP', name: 'Euro / British Pound',    price: 0.8573, pip: 0.0001 },
];

const INDEX_SEEDS = [
  { symbol: 'SPX',   name: 'S&P 500',       price: 5218.30, country: 'US' },
  { symbol: 'NDX',   name: 'NASDAQ 100',    price: 18247.60, country: 'US' },
  { symbol: 'DJI',   name: 'Dow Jones',     price: 38996.40, country: 'US' },
  { symbol: 'DAX',   name: 'DAX 40',        price: 18491.20, country: 'DE' },
  { symbol: 'FTSE',  name: 'FTSE 100',      price: 8287.30,  country: 'UK' },
  { symbol: 'N225',  name: 'Nikkei 225',    price: 38647.80, country: 'JP' },
  { symbol: 'HSI',   name: 'Hang Seng',     price: 17651.40, country: 'HK' },
  { symbol: 'VIX',   name: 'CBOE VIX',      price: 14.82,    country: 'US' },
];

const COMMODITY_SEEDS = [
  { symbol: 'XAUUSD', name: 'Gold',    price: 2340.00 },
  { symbol: 'XAGUSD', name: 'Silver',  price: 27.85 },
  { symbol: 'USOIL',  name: 'WTI Oil', price: 78.40 },
  { symbol: 'UKOIL',  name: 'Brent',   price: 82.10 },
];

const CRYPTO_SYMBOLS = [
  'btcusdt','ethusdt','bnbusdt','solusdt','xrpusdt',
  'adausdt','dogeusdt','avaxusdt','dotusdt','linkusdt',
  'maticusdt','ltcusdt','uniusdt','atomusdt','nearusdt',
];

// ── Helpers ────────────────────────────────────────────────────────────────
function seedItem(seed, decimals = 2) {
  const open24h = seed.price * (1 + (Math.random() - 0.52) * 0.03);
  const change = seed.price - open24h;
  const changePct = (change / open24h) * 100;
  return {
    ...seed,
    price: seed.price,
    open24h,
    change,
    changePct,
    high24h: seed.price * (1 + Math.random() * 0.025),
    low24h:  seed.price * (1 - Math.random() * 0.025),
    volume: Math.floor(Math.random() * 80_000_000 + 5_000_000),
    decimals,
    sparkline: Array.from({ length: 20 }, (_, i) => ({
      t: i,
      v: seed.price * (1 + (Math.random() - 0.5) * 0.04),
    })),
  };
}

function randomWalk(price, volatility = 0.0008) {
  return price * (1 + (Math.random() - 0.5) * volatility * 2);
}

// ── Provider ───────────────────────────────────────────────────────────────
export function MarketDataProvider({ children }) {
  const [cryptoPrices, setCryptoPrices] = useState({});
  const [stocks, setStocks]             = useState(() => STOCK_SEEDS.map(s => seedItem(s)));
  const [forex, setForex]               = useState(() => FOREX_SEEDS.map(s => seedItem(s, 4)));
  const [indices, setIndices]           = useState(() => INDEX_SEEDS.map(s => seedItem(s)));
  const [commodities, setCommodities]   = useState(() => COMMODITY_SEEDS.map(s => seedItem(s, 2)));
  const [allInstruments, setAllInstruments] = useState([]);
  const [wsStatus, setWsStatus]         = useState('connecting');

  const wsRef = useRef(null);

  // ── Binance WebSocket (crypto) ──────────────────────────────────────────
  useEffect(() => {
    const streams = CRYPTO_SYMBOLS.map(s => `${s}@miniTicker`).join('/');
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    let destroyed = false;

    function connect() {
      if (destroyed) return;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => setWsStatus('live');

      ws.onmessage = (e) => {
        try {
          const { data } = JSON.parse(e.data);
          if (!data) return;
          const sym = data.s.toLowerCase();
          setCryptoPrices(prev => ({
            ...prev,
            [sym]: {
              symbol: data.s,
              price: parseFloat(data.c),
              open24h: parseFloat(data.o),
              high24h: parseFloat(data.h),
              low24h: parseFloat(data.l),
              volume: parseFloat(data.v),
              change: parseFloat(data.c) - parseFloat(data.o),
              changePct: ((parseFloat(data.c) - parseFloat(data.o)) / parseFloat(data.o)) * 100,
            },
          }));
        } catch {}
      };

      ws.onerror = () => setWsStatus('error');
      ws.onclose = () => {
        setWsStatus('reconnecting');
        if (!destroyed) setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      destroyed = true;
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, []);

  // ── Gated Leverate initialization on mount ───────────────────────────────
  useEffect(() => {
    const hasToken = import.meta.env.VITE_LEVERATE_CONFIGURED === 'true';
    if (hasToken) {
      leverateApi.getAllInstruments().then(inst => {
        if (inst && inst.length > 0) {
          setAllInstruments(inst);
          setIndices(prev => prev.map(idx => {
            const match = inst.find(i => i.Name === idx.symbol || i.Name.includes(idx.symbol));
            return match ? { ...idx, leverate: match } : idx;
          }));
          setForex(prev => prev.map(f => {
            const clean = f.symbol.replace('/', '');
            const match = inst.find(i => i.Name === clean || i.Name === f.symbol);
            return match ? { ...f, leverate: match } : f;
          }));
        }
      });
    }
  }, []);

  // ── Simulate stock/forex/index updates (every 5s) ──────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      // ── Poll from Leverate only if a real token is configured ───────────────
      const hasToken = import.meta.env.VITE_LEVERATE_CONFIGURED === 'true';
      if (hasToken) {
        const topSymbols = ['EURUSD', 'GBPUSD', 'SPX'];
        topSymbols.forEach(async (sym) => {
          const quote = await leverateApi.getQuote(sym);
          if (quote) {
            if (sym === 'EURUSD' || sym === 'GBPUSD') {
              setForex(prev => prev.map(f => {
                const clean = f.symbol.replace('/', '');
                if (clean === sym) return { ...f, price: quote.price, change: quote.change, changePct: quote.changePct };
                return f;
              }));
            } else {
               setIndices(prev => prev.map(idx => {
                 if (idx.symbol === sym) return { ...idx, price: quote.price, change: quote.change, changePct: quote.changePct };
                 return idx;
               }));
            }
          }
        });
      }

      setStocks(prev => prev.map(s => {
        const price = randomWalk(s.price, 0.0006);
        const change = price - s.open24h;
        return { ...s, price, change, changePct: (change / s.open24h) * 100 };
      }));
      setForex(prev => prev.map(f => {
        const price = randomWalk(f.price, 0.0001); // Slower drift for forex if not updated by Leverate
        const change = price - f.open24h;
        return { ...f, price, change, changePct: (change / f.open24h) * 100 };
      }));
      setIndices(prev => prev.map(idx => {
        const price = randomWalk(idx.price, 0.0002);
        const change = price - idx.open24h;
        return { ...idx, price, change, changePct: (change / idx.open24h) * 100 };
      }));
      setCommodities(prev => prev.map(c => {
        const price = randomWalk(c.price, 0.0003);
        const change = price - c.open24h;
        return { ...c, price, change, changePct: (change / c.open24h) * 100 };
      }));
    }, 5000); // Poll every 5s
    return () => clearInterval(id);
  }, []);

  // ── Derived: top movers ────────────────────────────────────────────────
  const cryptoList = CRYPTO_SYMBOLS.map(sym => cryptoPrices[sym]).filter(Boolean);

  const allAssets = [
    ...stocks,
    ...cryptoList.map(c => ({ ...c, type: 'crypto' })),
    ...indices.map(i => ({ ...i, type: 'index' })),
  ];

  const topGainers = [...allAssets]
    .sort((a, b) => b.changePct - a.changePct)
    .slice(0, 5);

  const topLosers = [...allAssets]
    .sort((a, b) => a.changePct - b.changePct)
    .slice(0, 5);

  // ── Ticker tape items (mix of crypto + stocks) ─────────────────────────
  const tickerItems = [
    ...(['btcusdt','ethusdt','bnbusdt','solusdt','xrpusdt','adausdt','dogeusdt','avaxusdt']
      .map(sym => cryptoPrices[sym]).filter(Boolean)
      .map(c => ({ symbol: c.symbol.replace('USDT',''), price: c.price, changePct: c.changePct }))),
    ...stocks.slice(0, 8).map(s => ({ symbol: s.symbol, price: s.price, changePct: s.changePct })),
    ...indices.slice(0, 4).map(i => ({ symbol: i.symbol, price: i.price, changePct: i.changePct })),
  ];

  const value = {
    cryptoPrices, cryptoList,
    stocks, forex, indices, commodities,
    topGainers, topLosers,
    tickerItems,
    wsStatus,
    CRYPTO_SYMBOLS,
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const ctx = useContext(MarketDataContext);
  if (!ctx) throw new Error('useMarketData must be used inside MarketDataProvider');
  return ctx;
}

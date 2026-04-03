import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';

const SYMBOLS = [
  { label: 'BTC/USDT',  value: 'BTCUSDT' },
  { label: 'ETH/USDT',  value: 'ETHUSDT' },
  { label: 'BNB/USDT',  value: 'BNBUSDT' },
  { label: 'SOL/USDT',  value: 'SOLUSDT' },
  { label: 'XRP/USDT',  value: 'XRPUSDT' },
  { label: 'DOGE/USDT', value: 'DOGEUSDT' },
  { label: 'AVAX/USDT', value: 'AVAXUSDT' },
];

const INTERVALS = [
  { label: '1m',  value: '1m' },
  { label: '5m',  value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1h',  value: '1h' },
  { label: '4h',  value: '4h' },
  { label: '1D',  value: '1d' },
  { label: '1W',  value: '1w' },
];

const CHART_TYPES = ['Candles', 'Line'];

const THEME = {
  bg:       '#0a0a0a',
  text:     '#d1d4dc',
  grid:     'rgba(42,46,57,0.3)',
  up:       '#089981',
  down:     '#f23645',
  border:   '#1e2432',
  toolbar:  '#0d1117',
};

const fmt = (p) => {
  if (!p) return '—';
  if (p > 1000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p > 1)    return p.toFixed(4);
  return p.toFixed(6);
};

export default function MainChart() {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const candleRef    = useRef(null);
  const volumeRef    = useRef(null);
  const wsRef        = useRef(null);

  const [symbol,    setSymbol]    = useState('BTCUSDT');
  const [interval,  setInterval]  = useState('1h');
  const [chartType, setChartType] = useState('Candles');
  const [loading,   setLoading]   = useState(true);
  const [lastBar,   setLastBar]   = useState(null);
  const [wsStatus,  setWsStatus]  = useState('connecting');

  // ── Init chart ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: THEME.bg },
        textColor: THEME.text,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: THEME.grid },
        horzLines: { color: THEME.grid },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#555', labelBackgroundColor: '#1e2432' },
        horzLine: { color: '#555', labelBackgroundColor: '#1e2432' },
      },
      rightPriceScale: {
        borderColor: THEME.border,
        scaleMargins: { top: 0.05, bottom: 0.2 },
      },
      timeScale: {
        borderColor: THEME.border,
        timeVisible: true,
        secondsVisible: false,
      },
      width:  containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 500,
    });

    chartRef.current = chart;

    // Candlestick series
    const candle = chart.addSeries(CandlestickSeries, {
      upColor:       THEME.up,
      downColor:     THEME.down,
      borderVisible: false,
      wickUpColor:   THEME.up,
      wickDownColor: THEME.down,
    });
    candleRef.current = candle;

    // Volume series (scaled to bottom 18%)
    const volume = chart.addSeries(HistogramSeries, {
      priceFormat:    { type: 'volume' },
      priceScaleId:   'vol',
    });
    chart.priceScale('vol').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });
    volumeRef.current = volume;

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width:  containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current  = null;
      candleRef.current = null;
      volumeRef.current = null;
    };
  }, []);

  // ── Fetch historical klines ─────────────────────────────────────────────
  const loadHistory = useCallback(async (sym, itv) => {
    setLoading(true);
    try {
      const limit = 500;
      const url = `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=${itv}&limit=${limit}`;
      const res  = await fetch(url);
      const raw  = await res.json();

      if (!Array.isArray(raw)) return;

      const candles = raw.map((k) => ({
        time:  k[0] / 1000,
        open:  parseFloat(k[1]),
        high:  parseFloat(k[2]),
        low:   parseFloat(k[3]),
        close: parseFloat(k[4]),
      }));

      const volumes = raw.map((k) => ({
        time:  k[0] / 1000,
        value: parseFloat(k[5]),
        color: parseFloat(k[4]) >= parseFloat(k[1])
          ? 'rgba(8,153,129,0.4)'
          : 'rgba(242,54,69,0.4)',
      }));

      if (candleRef.current) candleRef.current.setData(candles);
      if (volumeRef.current) volumeRef.current.setData(volumes);
      if (chartRef.current)  chartRef.current.timeScale().fitContent();

      const last = candles[candles.length - 1];
      setLastBar(last);
    } catch (err) {
      console.error('Failed to load klines:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload on symbol / interval change
  useEffect(() => {
    loadHistory(symbol, interval);
  }, [symbol, interval, loadHistory]);

  // ── Live WebSocket updates ──────────────────────────────────────────────
  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const sym = symbol.toLowerCase();
    const ws  = new WebSocket(`wss://stream.binance.com:9443/ws/${sym}@kline_${interval}`);
    wsRef.current = ws;

    ws.onopen  = () => setWsStatus('live');
    ws.onerror = () => setWsStatus('error');
    ws.onclose = () => setWsStatus('closed');

    ws.onmessage = (e) => {
      try {
        const { k } = JSON.parse(e.data);
        if (!k) return;

        const bar = {
          time:  k.t / 1000,
          open:  parseFloat(k.o),
          high:  parseFloat(k.h),
          low:   parseFloat(k.l),
          close: parseFloat(k.c),
        };

        const vol = {
          time:  k.t / 1000,
          value: parseFloat(k.v),
          color: parseFloat(k.c) >= parseFloat(k.o)
            ? 'rgba(8,153,129,0.4)'
            : 'rgba(242,54,69,0.4)',
        };

        if (candleRef.current) candleRef.current.update(bar);
        if (volumeRef.current) volumeRef.current.update(vol);
        setLastBar(bar);
      } catch {}
    };

    return () => {
      ws.close();
    };
  }, [symbol, interval]);

  const up = lastBar ? lastBar.close >= lastBar.open : true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: THEME.bg }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        padding: '0 12px', height: 44,
        background: THEME.toolbar, borderBottom: `1px solid ${THEME.border}`,
        flexShrink: 0,
      }}>
        {/* Symbol selector */}
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          style={{
            background: '#1e2432', border: `1px solid ${THEME.border}`,
            color: '#e8f0fe', padding: '4px 8px', borderRadius: 4,
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          {SYMBOLS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Interval buttons */}
        <div style={{ display: 'flex', gap: 2 }}>
          {INTERVALS.map((iv) => (
            <button key={iv.value} onClick={() => setInterval(iv.value)} style={{
              padding: '3px 9px', borderRadius: 4, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: 'none', fontFamily: 'inherit',
              background: interval === iv.value ? '#2962ff' : 'transparent',
              color:      interval === iv.value ? '#fff'    : '#666',
              transition: 'all 0.15s',
            }}>
              {iv.label}
            </button>
          ))}
        </div>

        <div style={{ width: 1, height: 20, background: THEME.border }} />

        {/* Chart type */}
        <div style={{ display: 'flex', gap: 2 }}>
          {CHART_TYPES.map((t) => (
            <button key={t} onClick={() => setChartType(t)} style={{
              padding: '3px 9px', borderRadius: 4, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: `1px solid ${chartType === t ? '#2962ff' : 'transparent'}`,
              background: 'transparent',
              color: chartType === t ? '#2962ff' : '#666',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Last price display */}
        {lastBar && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
            {[
              ['O', lastBar.open],
              ['H', lastBar.high],
              ['L', lastBar.low],
              ['C', lastBar.close],
            ].map(([lbl, val]) => (
              <span key={lbl} style={{ color: '#555' }}>
                <span style={{ color: '#666', marginRight: 3 }}>{lbl}</span>
                <span style={{ color: up ? THEME.up : THEME.down, fontWeight: 600 }}>
                  {fmt(val)}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* WS status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
            background: wsStatus === 'live' ? '#00f5a0' : '#f59e0b',
            boxShadow:  wsStatus === 'live' ? '0 0 6px #00f5a0' : '0 0 6px #f59e0b',
          }} />
          <span style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 1 }}>
            {wsStatus}
          </span>
        </div>
      </div>

      {/* ── Chart area ── */}
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,10,10,0.7)', flexDirection: 'column', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '3px solid #1e2432',
              borderTopColor: '#2962ff',
              animation: 'chart-spin 0.8s linear infinite',
            }} />
            <span style={{ fontSize: 13, color: '#555' }}>Loading {symbol}…</span>
          </div>
        )}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      <style>{`
        @keyframes chart-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

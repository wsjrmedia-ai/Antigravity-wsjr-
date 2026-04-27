import { useEffect, useRef, useCallback, useState } from 'react';
import { createChart, ColorType, LineStyle } from 'lightweight-charts';
import { getChartBars } from '../../services/leverateApi';

/* Fibonacci retracement levels */
const FIB_LEVELS = [
    { pct: 0,     color: '#ef5350', label: '0%' },
    { pct: 0.236, color: '#f59e0b', label: '23.6%' },
    { pct: 0.382, color: '#d4af37', label: '38.2%' },
    { pct: 0.5,   color: '#26a69a', label: '50%' },
    { pct: 0.618, color: '#2962ff', label: '61.8%' },
    { pct: 1,     color: '#ef5350', label: '100%' },
];

const TradingChart = ({ symbol = 'EURUSD', periodMinutes = 15, activeTool = 'cursor', onToolReset }) => {
    const containerRef  = useRef(null);
    const chartRef      = useRef(null);
    const seriesRef     = useRef(null);
    const drawingsRef   = useRef([]);      // all added line series / price lines
    const drawStateRef  = useRef({ step: 0, start: null }); // drawing state machine

    const [status,   setStatus]   = useState('loading');
    const [errorMsg, setErrorMsg] = useState('');
    const [hint,     setHint]     = useState('');

    /* ── Create chart once ─────────────────────────────────── */
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const chart = createChart(container, {
            layout: { background: { type: ColorType.Solid, color: '#131722' }, textColor: '#d1d4dc' },
            grid:   { vertLines: { color: '#2a2e39' }, horzLines: { color: '#2a2e39' } },
            width:  container.clientWidth,
            height: container.clientHeight || 500,
            crosshair:      { mode: 0 },
            rightPriceScale:{ borderColor: '#2a2e39' },
            timeScale:      { borderColor: '#2a2e39', timeVisible: true, secondsVisible: false },
        });

        const series = chart.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });

        chartRef.current  = chart;
        seriesRef.current = series;

        const onResize = () => {
            if (container) chart.applyOptions({ width: container.clientWidth, height: container.clientHeight });
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
            chart.remove();
            chartRef.current  = null;
            seriesRef.current = null;
            drawingsRef.current = [];
        };
    }, []);

    /* ── Load / refresh data ────────────────────────────────── */
    const loadData = useCallback(async () => {
        if (!seriesRef.current) return;
        try {
            const bars = await getChartBars(symbol, periodMinutes);
            if (!seriesRef.current) return;
            if (!bars.length) { setStatus('error'); setErrorMsg(`No data for ${symbol}`); return; }

            const data = bars
                .map(b => ({
                    time:  Math.floor(new Date(b.StartTime).getTime() / 1000),
                    open:  b.Open, high: b.High, low: b.Low, close: b.Close,
                }))
                .sort((a, b) => a.time - b.time);

            seriesRef.current.setData(data);
            chartRef.current?.timeScale().fitContent();
            setStatus('ok');
        } catch {
            setStatus('error');
            setErrorMsg('Could not load chart data — check Leverate API connection');
        }
    }, [symbol, periodMinutes]);

    useEffect(() => {
        setStatus('loading');
        setErrorMsg('');
        if (seriesRef.current) seriesRef.current.setData([]);
        loadData();
        const iv = setInterval(loadData, 30_000);
        return () => clearInterval(iv);
    }, [loadData]);

    /* ── Drawing tools ──────────────────────────────────────── */
    useEffect(() => {
        const chart  = chartRef.current;
        const series = seriesRef.current;
        if (!chart || !series) return;

        /* Reset drawing state whenever tool changes */
        drawStateRef.current = { step: 0, start: null };
        setHint('');

        if (activeTool === 'cursor') { setHint(''); return; }

        if (activeTool === 'eraser') {
            /* Remove all drawings immediately */
            drawingsRef.current.forEach(d => {
                try {
                    if (d.type === 'series') chart.removeSeries(d.ref);
                    if (d.type === 'priceline') series.removePriceLine(d.ref);
                } catch {}
            });
            drawingsRef.current = [];
            onToolReset?.();
            return;
        }

        /* Hints for two-click tools */
        const hints = {
            trendline:  'Click start point',
            fibonacci:  'Click high point',
            text:       'Click to place annotation',
            shapes:     'Click start corner',
            measure:    'Click start point',
        };
        setHint(hints[activeTool] || '');

        const handleClick = (param) => {
            if (!param.point || !param.time) return;
            const price = series.coordinateToPrice(param.point.y);
            if (price == null) return;

            const state = drawStateRef.current;

            /* ── Trend Line ─────────────────────── */
            if (activeTool === 'trendline') {
                if (state.step === 0) {
                    drawStateRef.current = { step: 1, start: { time: param.time, price } };
                    setHint('Click end point');
                } else {
                    const { start } = drawStateRef.current;
                    /* Order times so lightweight-charts doesn't complain */
                    const pts = [
                        { time: start.time, value: start.price },
                        { time: param.time, value: price },
                    ].sort((a, b) => a.time - b.time);

                    const line = chart.addLineSeries({
                        color: '#d4af37', lineWidth: 2,
                        priceLineVisible: false, lastValueVisible: false,
                        crosshairMarkerVisible: false,
                    });
                    line.setData(pts);
                    drawingsRef.current.push({ type: 'series', ref: line });
                    drawStateRef.current = { step: 0, start: null };
                    setHint('Click start point');
                    onToolReset?.();
                }
                return;
            }

            /* ── Fibonacci Retracement ──────────── */
            if (activeTool === 'fibonacci') {
                if (state.step === 0) {
                    drawStateRef.current = { step: 1, start: { time: param.time, price } };
                    setHint('Click low point');
                } else {
                    const high = Math.max(state.start.price, price);
                    const low  = Math.min(state.start.price, price);
                    const range = high - low;

                    FIB_LEVELS.forEach(({ pct, color, label }) => {
                        const lvlPrice = high - range * pct;
                        const pl = series.createPriceLine({
                            price: lvlPrice, color,
                            lineWidth: 1, lineStyle: LineStyle.Dashed,
                            axisLabelVisible: true,
                            title: `Fib ${label}`,
                        });
                        drawingsRef.current.push({ type: 'priceline', ref: pl });
                    });

                    drawStateRef.current = { step: 0, start: null };
                    setHint('Click high point');
                    onToolReset?.();
                }
                return;
            }

            /* ── Text annotation (simple price line label) ── */
            if (activeTool === 'text') {
                const text = window.prompt('Annotation text:', '');
                if (!text) return;
                const pl = series.createPriceLine({
                    price, color: '#00c4ff',
                    lineWidth: 1, lineStyle: LineStyle.Dotted,
                    axisLabelVisible: true,
                    title: text,
                });
                drawingsRef.current.push({ type: 'priceline', ref: pl });
                onToolReset?.();
                return;
            }

            /* ── Shapes / Measure — two-click rectangles ── */
            if (activeTool === 'shapes' || activeTool === 'measure') {
                if (state.step === 0) {
                    drawStateRef.current = { step: 1, start: { time: param.time, price } };
                    setHint(activeTool === 'shapes' ? 'Click opposite corner' : 'Click end point');
                } else {
                    const high = Math.max(state.start.price, price);
                    const low  = Math.min(state.start.price, price);
                    /* Draw two horizontal price lines as a bounding box */
                    [high, low].forEach((p, i) => {
                        const pl = series.createPriceLine({
                            price: p, color: activeTool === 'shapes' ? '#2962ff' : '#868993',
                            lineWidth: 1, lineStyle: LineStyle.Solid,
                            axisLabelVisible: i === 0,
                            title: activeTool === 'measure'
                                ? `Δ ${(high - low).toFixed(5)}`
                                : '',
                        });
                        drawingsRef.current.push({ type: 'priceline', ref: pl });
                    });
                    drawStateRef.current = { step: 0, start: null };
                    setHint(activeTool === 'shapes' ? 'Click start corner' : 'Click start point');
                    onToolReset?.();
                }
                return;
            }
        };

        chart.subscribeClick(handleClick);
        return () => { chart.unsubscribeClick(handleClick); };
    }, [activeTool, onToolReset]);

    /* Cursor style when a drawing tool is active */
    const cursorStyle = activeTool !== 'cursor' && activeTool !== 'eraser' ? 'crosshair' : 'default';

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', cursor: cursorStyle }}>
            <div
                ref={containerRef}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            />

            {/* Active-tool hint bar */}
            {hint && (
                <div style={{
                    position: 'absolute', top: 8, left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(19,23,34,0.92)',
                    border: '1px solid #d4af37',
                    color: '#d4af37',
                    fontSize: '12px', fontWeight: 600,
                    padding: '4px 14px', borderRadius: 20,
                    pointerEvents: 'none',
                    zIndex: 10,
                }}>
                    {hint}
                </div>
            )}

            {status === 'loading' && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    color: '#868993', fontSize: '13px', pointerEvents: 'none',
                }}>
                    Loading {symbol}…
                </div>
            )}

            {status === 'error' && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    color: '#ef5350', fontSize: '13px',
                    textAlign: 'center', pointerEvents: 'none', maxWidth: '280px',
                }}>
                    {errorMsg}
                </div>
            )}
        </div>
    );
};

export default TradingChart;

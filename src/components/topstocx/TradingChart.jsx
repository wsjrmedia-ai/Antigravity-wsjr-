import React, { useEffect, useRef, useCallback, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { getChartBars } from '../../services/leverateApi';

const TradingChart = ({ symbol = 'EURUSD', periodMinutes = 15 }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error'
    const [errorMsg, setErrorMsg] = useState('');

    // Create the chart instance once
    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const chart = createChart(container, {
            layout: {
                background: { type: ColorType.Solid, color: '#131722' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: '#2a2e39' },
                horzLines: { color: '#2a2e39' },
            },
            width: container.clientWidth,
            height: container.clientHeight || 500,
            crosshair: { mode: 0 },
            rightPriceScale: { borderColor: '#2a2e39' },
            timeScale: {
                borderColor: '#2a2e39',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const series = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        chartRef.current = chart;
        seriesRef.current = series;

        const handleResize = () => {
            if (container) chart.applyOptions({ width: container.clientWidth });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
            chartRef.current = null;
            seriesRef.current = null;
        };
    }, []);

    const loadData = useCallback(async () => {
        if (!seriesRef.current) return;
        try {
            const bars = await getChartBars(symbol, periodMinutes);
            if (!seriesRef.current) return; // chart unmounted during fetch

            if (!bars.length) {
                setStatus('error');
                setErrorMsg(`No data for ${symbol}`);
                return;
            }

            const chartData = bars
                .map(b => ({
                    time: Math.floor(new Date(b.StartTime).getTime() / 1000),
                    open: b.Open,
                    high: b.High,
                    low: b.Low,
                    close: b.Close,
                }))
                .sort((a, b) => a.time - b.time);

            seriesRef.current.setData(chartData);
            chartRef.current?.timeScale().fitContent();
            setStatus('ok');
        } catch (err) {
            console.error('TradingChart load error:', err);
            setStatus('error');
            setErrorMsg('Could not load chart data — check Leverate API connection');
        }
    }, [symbol, periodMinutes]);

    // Reload + 30s refresh whenever symbol or timeframe changes
    useEffect(() => {
        setStatus('loading');
        setErrorMsg('');
        if (seriesRef.current) seriesRef.current.setData([]);
        loadData();
        const interval = setInterval(loadData, 30_000);
        return () => clearInterval(interval);
    }, [loadData]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div
                ref={chartContainerRef}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
            />

            {status === 'loading' && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#868993', fontSize: '13px', pointerEvents: 'none',
                }}>
                    Loading {symbol}...
                </div>
            )}

            {status === 'error' && (
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#ef5350', fontSize: '13px', textAlign: 'center',
                    pointerEvents: 'none', maxWidth: '280px',
                }}>
                    {errorMsg}
                </div>
            )}
        </div>
    );
};

export default TradingChart;

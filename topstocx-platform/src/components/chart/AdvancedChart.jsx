import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { leverateApi } from '../../services/leverateApi';
import { useLeverate } from '../../context/LeverateContext';

const AdvancedChart = () => {
    const { selectedSymbol: symbol, selectedPeriod: period } = useLeverate();
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const bars = await leverateApi.getChartBars(symbol, period);
        if (bars && bars.length > 0) {
            const formatted = bars.map(b => ({
                time: new Date(b.Timestamp).getTime() / 1000,
                open: b.Open,
                high: b.High,
                low: b.Low,
                close: b.Close
            }));
            
            // Sort by time just in case
            formatted.sort((a, b) => a.time - b.time);
            
            if (seriesRef.current) {
                seriesRef.current.setData(formatted);
            }
            setLoading(false);
        } else {
            console.warn('No bars returned for', symbol);
            setLoading(false);
        }
    }, [symbol, period]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const container = chartContainerRef.current;
        
        // Initialize Chart
        const chart = createChart(container, {
            layout: {
                background: { type: ColorType.Solid, color: '#131722' },
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: { color: '#2a2e39' },
                horzLines: { color: '#2a2e39' },
            },
            width: container.clientWidth || 800,
            height: container.clientHeight || 500,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderVisible: false,
            },
            rightPriceScale: {
                borderVisible: false,
            },
            crosshair: {
                mode: 0,
            },
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#089981',
            downColor: '#f23645',
            borderVisible: false,
            wickUpColor: '#089981',
            wickDownColor: '#f23645',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        fetchData();

        // Polling for live updates
        const interval = setInterval(fetchData, 30000);

        // Robust Resize Handler
        const resizeObserver = new ResizeObserver(entries => {
            if (entries.length === 0 || !chartRef.current) return;
            const { width, height } = entries[0].contentRect;
            chartRef.current.applyOptions({ width, height });
        });

        resizeObserver.observe(container);

        return () => {
            clearInterval(interval);
            resizeObserver.disconnect();
            chart.remove();
        };
    }, [fetchData]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#131722' }}>
            <div 
                ref={chartContainerRef} 
                className="chart-container" 
                style={{ width: '100%', height: '100%' }} 
            />
            {loading && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    color: '#2962ff',
                    background: 'rgba(19, 23, 34, 0.4)',
                    backdropFilter: 'blur(4px)'
                }}>
                   <div style={{ width: 40, height: 40, border: '3px solid rgba(41,98,255,0.1)', borderTop: '3px solid #2962ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                   <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>LOADING LIVE FEED...</span>
                   <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}
            
            {/* Symbol Badge Overlay */}
            <div style={{
                position: 'absolute',
                top: 16,
                left: 16,
                zIndex: 5,
                padding: '6px 14px',
                background: 'rgba(20, 24, 33, 0.85)',
                border: '1px solid #2a2e39',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backdropFilter: 'blur(8px)',
                pointerEvents: 'none'
            }}>
                <div style={{ 
                    width: 8, height: 8, borderRadius: '50%', background: '#00c979', 
                    boxShadow: '0 0 8px #00c979', animation: 'pulse 2s infinite' 
                }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{symbol}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#8b949e' }}>· {period}m</span>
                <style>{`@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }`}</style>
            </div>
        </div>
    );
};

export default AdvancedChart;

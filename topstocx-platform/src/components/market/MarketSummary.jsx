import React, { useMemo } from 'react';
import {
  AdvancedRealTimeChart,
  TechnicalAnalysis,
  Timeline,
  CompanyProfile
} from 'react-ts-tradingview-widgets';

export default function MarketSummary() {
  const dashboard = useMemo(() => (
    <>
      <style>{`
        .market-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: #2a2e39;
          border-radius: 12px;
          overflow: hidden;
        }
        .market-dashboard-grid > .md-cell {
          height: 450px;
          background: #131722;
          overflow: hidden;
        }
        /* Tablet — shrink the cells but keep 2 columns */
        @media (max-width: 900px) {
          .market-dashboard-grid > .md-cell { height: 300px; }
        }
        /* Phone — stay as 2x2 so all 4 are visible compact, no vertical stack */
        @media (max-width: 600px) {
          .market-dashboard-grid { gap: 1px; border-radius: 10px; }
          .market-dashboard-grid > .md-cell { height: 210px; }
        }
        @media (max-width: 380px) {
          .market-dashboard-grid > .md-cell { height: 180px; }
        }
      `}</style>
      <div className="market-dashboard-grid">
        <div className="md-cell">
          <AdvancedRealTimeChart
            container_id="tv_chart_main"
            theme="dark"
            symbol="NASDAQ:AAPL"
            interval="D"
            autosize
            hide_legend={true}
            hide_side_toolbar={true}
            allow_symbol_change={false}
            hide_top_toolbar={true}
          />
        </div>

        <div className="md-cell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TechnicalAnalysis colorTheme="dark" symbol="NASDAQ:AAPL" width="100%" height="100%" isTransparent={true} />
        </div>

        <div className="md-cell">
          <Timeline colorTheme="dark" feedMode="all_symbols" displayMode="regular" width="100%" height="100%" isTransparent={true} />
        </div>

        <div className="md-cell">
          <CompanyProfile colorTheme="dark" symbol="NASDAQ:AAPL" width="100%" height="100%" isTransparent={true} />
        </div>
      </div>
    </>
  ), []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <style>{`
        .ms-title { font-size: clamp(38px, 7vw, 72px); }
        .ms-sub   { font-size: clamp(15px, 2vw, 18px); }
        @media (max-width: 600px) {
          .ms-title { font-size: clamp(30px, 9vw, 42px) !important; letter-spacing: -1px !important; }
          .ms-sub   { font-size: 14px !important; margin-bottom: 1.5rem !important; }
          .ms-glow-frame { padding: 2px !important; border-radius: 12px !important; box-shadow: 0 0 20px rgba(0,90,255,0.3), 0 0 30px rgba(57,181,74,0.2) !important; }
        }
      `}</style>

      <h2 className="ms-title font-primary" style={{
        fontWeight: 900,
        margin: '0 0 0.75rem',
        color: '#fff',
        letterSpacing: '-2px',
        lineHeight: 1.05,
      }}>
        Where the world<br />does markets
      </h2>
      <p className="ms-sub" style={{
        color: '#c9d1d9',
        margin: '0 auto 2.5rem',
        maxWidth: 560,
        lineHeight: 1.6,
        padding: '0 1rem',
        fontWeight: 500,
      }}>
        Join 100 million traders and investors taking the future into their own hands.
      </p>

      {/* Glow-bordered dashboard container */}
      <div className="ms-glow-frame" style={{
        position: 'relative',
        maxWidth: 1200,
        margin: '0 auto',
        padding: 3,
        background: 'var(--primary-gradient)',
        borderRadius: 15,
        boxShadow: '0 0 30px 10px rgba(0, 90, 255, 0.4), 0 0 40px 15px rgba(57, 181, 74, 0.3)',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'var(--primary-gradient)',
          filter: 'blur(20px)', zIndex: -1, opacity: 0.8, borderRadius: 15,
        }} />
        <div style={{
          background: '#131722',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}>
          {dashboard}
        </div>
      </div>
    </div>
  );
}

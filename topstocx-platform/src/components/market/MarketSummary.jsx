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
        @media (max-width: 768px) {
          .market-dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="market-dashboard-grid">
        {/* 1. Primary Advanced Chart */}
        <div style={{ height: '450px', background: '#131722' }}>
          <AdvancedRealTimeChart container_id="tv_chart_main" theme="dark" symbol="NASDAQ:AAPL" interval="D" autosize hide_legend={false} hide_side_toolbar={true} allow_symbol_change={false} />
        </div>

        {/* 2. Technical Analysis Gauge */}
        <div style={{ height: '450px', background: '#131722', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TechnicalAnalysis colorTheme="dark" symbol="NASDAQ:AAPL" width="100%" height="100%" isTransparent={true} />
        </div>

        {/* 3. Market News Timeline */}
        <div style={{ height: '450px', background: '#131722' }}>
          <Timeline colorTheme="dark" feedMode="all_symbols" displayMode="regular" width="100%" height="100%" isTransparent={true} />
        </div>

        {/* 4. Company Profile Fundamentals */}
        <div style={{ height: '450px', background: '#131722' }}>
          <CompanyProfile colorTheme="dark" symbol="NASDAQ:AAPL" width="100%" height="100%" isTransparent={true} />
        </div>
      </div>
    </>
  ), []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      {/* Title block */}
      <h2 style={{ 
        fontSize: 'clamp(48px, 8vw, 80px)', 
        fontWeight: 900, 
        margin: '0 0 0.5rem', 
        color: '#fff', 
        letterSpacing: '-2px' 
      }}>
        markets
      </h2>
      <p style={{ 
        fontSize: '18px', 
        color: '#e8f0fe', 
        marginBottom: '4rem',
        fontWeight: 500
      }}>
        Join 100 million traders and investors taking the future into their own hands.
      </p>

      {/* Container with Green-Blue Gradient Background Glow */}
      <div style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3px', /* Spacing for the glowing gradient border */
        background: 'var(--primary-gradient)', /* The brand green-blue gradient */
        borderRadius: '15px',
        boxShadow: '0 0 30px 10px rgba(0, 90, 255, 0.4), 0 0 40px 15px rgba(57, 181, 74, 0.3)' 
      }}>
        {/* Intense blur behind for external glow */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--primary-gradient)',
          filter: 'blur(20px)',
          zIndex: -1,
          opacity: 0.8,
          borderRadius: '15px'
        }}></div>

        {/* Container for dashboard */}
        <div style={{
          background: '#131722',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1
        }}>
          {dashboard}
        </div>
      </div>
    </div>
  );
}

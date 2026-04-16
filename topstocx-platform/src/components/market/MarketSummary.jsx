import React from 'react';
import { MarketOverview } from 'react-ts-tradingview-widgets';
import { ChevronRight } from 'lucide-react';

export default function MarketSummary() {
  return (
    <div>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#fff' }}>Market overview</h2>
        <ChevronRight size={20} color="#555" />
      </div>

      {/* TradingView Market Data Embed */}
      <div style={{ height: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2e39', background: '#131722' }}>
          <MarketOverview 
              colorTheme="dark" 
              height="100%" 
              width="100%"
              showFloatingTooltip={true}
          />
      </div>
    </div>
  );
}

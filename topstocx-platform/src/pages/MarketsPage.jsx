import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import HomeHeader from '../components/layout/HomeHeader';
import { useMarketData } from '../context/MarketDataContext';
import { MarketOverview } from 'react-ts-tradingview-widgets';

// ── Helpers ───────────────────────────────────────────────────────────────
const fmtPrice = (p) => {
  if (!p && p !== 0) return '—';
  if (p > 1_000_000) return '$' + (p / 1_000_000).toFixed(2) + 'T';
  if (p > 10000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (p > 1)     return p.toFixed(2);
  return p.toFixed(4);
};

const fmtPct = (p) => {
  if (p == null) return '—';
  return `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;
};

const UP   = '#00c979';
const DOWN = '#f23645';

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MarketsPage() {
  const { stocks, cryptoList } = useMarketData();

  // Market summary stats
  const allChanges = [...stocks, ...cryptoList].map((r) => r.changePct).filter(Boolean);
  const advancing  = allChanges.filter((c) => c > 0).length;
  const declining  = allChanges.filter((c) => c < 0).length;
  const btc = cryptoList.find((c) => c.symbol === 'BTCUSDT');

  return (
    <div style={{ color: '#fff', minHeight: '100vh', background: '#03050e' }}>
      <HomeHeader />
      <style>{`
          @media (max-width: 480px) {
              .mk-main { padding-top: 80px !important; padding-left: 1rem !important; padding-right: 1rem !important; }
          }
      `}</style>

      <main className="mk-main" style={{ paddingTop: 110, maxWidth: 1400, margin: '0 auto', padding: '110px 1.5rem 4rem' }}>

        {/* Page title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 6px', color: '#e8f0fe' }}>
            Markets
          </h1>
          <p style={{ color: '#555', margin: 0, fontSize: 14 }}>
            Real-time prices, charts and data for global financial markets
          </p>
        </div>

        {/* Summary bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {[
            { label: 'Advancing',   value: advancing,    color: UP,   suffix: ' assets' },
            { label: 'Declining',   value: declining,    color: DOWN, suffix: ' assets' },
            { label: 'BTC Price',   value: btc ? `$${fmtPrice(btc.price)}` : '—', color: btc?.changePct >= 0 ? UP : DOWN },
            { label: 'BTC 24h',     value: btc ? fmtPct(btc.changePct) : '—',    color: btc?.changePct >= 0 ? UP : DOWN },
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#0d1117', border: '1px solid #1e2432', borderRadius: 10,
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>
                {stat.value}{stat.suffix || ''}
              </div>
            </div>
          ))}
        </div>

        {/* TradingView MarketOverview Embed */}
        <div style={{ height: '700px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2e39', background: '#131722' }}>
          {useMemo(() => (
            <MarketOverview 
                colorTheme="dark" 
                height="100%" 
                width="100%"
                showFloatingTooltip={true}
            />
          ), [])}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: '2rem', padding: '1.5rem 2rem',
          background: 'linear-gradient(135deg, rgba(0, 90, 255,0.08), rgba(0, 90, 255,0.02))',
          border: '1px solid rgba(0, 90, 255,0.2)', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              Want to trade any of these?
            </div>
            <div style={{ fontSize: 13, color: '#555' }}>
              Open a professional chart or start copy trading in seconds.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/chart" style={{
              padding: '0.65rem 1.5rem', background: 'var(--brand-gradient-blue)', color: '#fff',
              borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 700,
            }}>
              Open Chart
            </Link>
            <Link to="/copy-trade" style={{
              padding: '0.65rem 1.5rem', border: '1px solid #30363d', color: '#e8f0fe',
              borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600,
            }}>
              Copy Trade
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

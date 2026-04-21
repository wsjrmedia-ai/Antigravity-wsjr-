import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import {
  AdvancedRealTimeChart,
  TechnicalAnalysis,
  Timeline,
  CompanyProfile
} from 'react-ts-tradingview-widgets';
import { useMarketData } from '../../context/MarketDataContext';

// ── Small per-row sparkline (static SVG of recent movement) ────────────────
function MiniSpark({ up = true }) {
  // Simple zig-zag path; green if up, red if down
  const path = up
    ? 'M0 18 L10 15 L18 16 L28 12 L36 14 L45 9 L55 10 L65 5 L75 7 L85 2'
    : 'M0 4 L10 6 L18 5 L28 10 L36 8 L45 13 L55 12 L65 16 L75 14 L85 18';
  const color = up ? '#00c979' : '#f23645';
  return (
    <svg width="90" height="22" viewBox="0 0 90 22" style={{ flexShrink: 0 }}>
      <path d={path} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Ticker card row (TradingView-style) ─────────────────────────────────────
function TickerCard({ symbol, name, badge, badgeColor, price, unit = 'USD', changePct }) {
  const up = (changePct ?? 0) >= 0;
  return (
    <Link
      to={`/markets`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '18px 16px',
        background: '#0d1117',
        border: '1px solid #1e2432',
        borderRadius: 14,
        textDecoration: 'none',
        color: '#fff',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,90,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e2432'; e.currentTarget.style.transform = 'none'; }}
    >
      {/* Icon badge */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: badgeColor, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 900, flexShrink: 0,
      }}>
        {badge}
      </div>

      {/* Symbol + name */}
      <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{name}</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#1e2432', color: '#8b949e' }}>{symbol}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            {price != null ? price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}
          </span>
          <span style={{ fontSize: 11, color: '#8b949e', fontWeight: 600 }}>{unit}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: up ? '#00c979' : '#f23645', marginTop: 2 }}>
          {changePct != null ? `${up ? '+' : ''}${changePct.toFixed(2)}%` : '—'}
        </div>
      </div>

      {/* Sparkline */}
      <MiniSpark up={up} />
    </Link>
  );
}

export default function MarketSummary() {
  const { stocks, cryptoList } = useMarketData();

  // Build TradingView-style summary cards
  const summaryCards = useMemo(() => {
    const find = (arr, sym) => arr.find(x => x.symbol === sym);
    const btc = find(cryptoList, 'BTCUSDT');
    const eth = find(cryptoList, 'ETHUSDT');
    const aapl = find(stocks, 'AAPL');
    const nvda = find(stocks, 'NVDA');
    return [
      { name: 'S&P 500', symbol: 'SPX', badge: '500', badgeColor: '#e53935', price: 7109.13, changePct: -0.24, unit: 'USD' },
      { name: 'Apple Inc', symbol: 'AAPL', badge: '', badgeColor: '#1f1f1f', price: aapl?.price ?? 273.05, changePct: aapl?.changePct ?? 1.04, unit: 'USD' },
      { name: 'NVIDIA', symbol: 'NVDA', badge: 'N', badgeColor: '#76b900', price: nvda?.price ?? 142.89, changePct: nvda?.changePct ?? 2.35, unit: 'USD' },
      { name: 'Bitcoin', symbol: 'BTC', badge: '₿', badgeColor: '#f7931a', price: btc?.price ?? 64210, changePct: btc?.changePct ?? 1.82, unit: 'USD' },
      { name: 'Ethereum', symbol: 'ETH', badge: 'Ξ', badgeColor: '#627eea', price: eth?.price ?? 3189, changePct: eth?.changePct ?? 0.67, unit: 'USD' },
    ];
  }, [stocks, cryptoList]);

  // Full desktop dashboard (4 widgets) — hidden on mobile
  const desktopDashboard = useMemo(() => (
    <div className="ms-desktop-grid">
      <style>{`
        .ms-desktop-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: #2a2e39;
          border-radius: 12px;
          overflow: hidden;
        }
        .ms-desktop-grid > div { height: 450px; background: #131722; }
        @media (max-width: 900px) {
          .ms-desktop-grid { display: none; }
        }
      `}</style>
      <div><AdvancedRealTimeChart container_id="tv_chart_main" theme="dark" symbol="NASDAQ:AAPL" interval="D" autosize hide_legend={false} hide_side_toolbar={true} allow_symbol_change={false} /></div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TechnicalAnalysis colorTheme="dark" symbol="NASDAQ:AAPL" width="100%" height="100%" isTransparent={true} />
      </div>
      <div><Timeline colorTheme="dark" feedMode="all_symbols" displayMode="regular" width="100%" height="100%" isTransparent={true} /></div>
      <div><CompanyProfile colorTheme="dark" symbol="NASDAQ:AAPL" width="100%" height="100%" isTransparent={true} /></div>
    </div>
  ), []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <style>{`
        .ms-hero-img-wrap {
          position: relative;
          max-width: 900px;
          margin: 0 auto 2.5rem;
          padding: 3px;
          background: var(--primary-gradient);
          border-radius: 16px;
          box-shadow: 0 0 40px rgba(0, 90, 255, 0.35), 0 0 60px rgba(57, 181, 74, 0.25);
        }
        .ms-hero-img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 13px;
          background: #131722;
        }
        .ms-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #fff;
          color: #03050e;
          border-radius: 999px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ms-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }

        .ms-summary-header {
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: flex-start;
          margin: 3rem 0 1rem;
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.5px;
          cursor: pointer;
        }
        .ms-summary-header:hover { color: #77A6FF; }

        .ms-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 12px;
        }

        /* Mobile: show the featured chart + cards; hide the heavy 4-widget grid */
        .ms-mobile-chart {
          display: none;
          height: 380px;
          background: #131722;
          border-radius: 13px;
          overflow: hidden;
        }
        @media (max-width: 900px) {
          .ms-mobile-chart { display: block; }
        }
      `}</style>

      {/* Hero title */}
      <h2 style={{
        fontSize: 'clamp(38px, 7vw, 72px)',
        fontWeight: 900,
        margin: '0 0 1rem',
        color: '#fff',
        letterSpacing: '-2px',
        lineHeight: 1.05,
      }}>
        Where the world<br />does markets
      </h2>
      <p style={{
        fontSize: 'clamp(15px, 2vw, 18px)',
        color: '#c9d1d9',
        margin: '0 auto 2.5rem',
        maxWidth: 560,
        lineHeight: 1.6,
        padding: '0 1rem',
      }}>
        Join 100 million traders and investors taking the future into their own hands.
      </p>

      {/* Mobile featured chart (single widget, clean) */}
      <div className="ms-hero-img-wrap">
        <div className="ms-mobile-chart">
          <AdvancedRealTimeChart
            container_id="tv_chart_hero_mobile"
            theme="dark"
            symbol="NASDAQ:AAPL"
            interval="D"
            autosize
            hide_legend={true}
            hide_side_toolbar={true}
            allow_symbol_change={false}
            hide_top_toolbar={false}
          />
        </div>

        {/* Desktop full dashboard (hidden on mobile) */}
        <div style={{ background: '#131722', borderRadius: 13, overflow: 'hidden' }}>
          {desktopDashboard}
        </div>
      </div>

      {/* Explore features CTA */}
      <Link to="/markets" className="ms-cta">
        Explore features <ArrowRight size={16} />
      </Link>

      {/* Market summary cards */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem', textAlign: 'left' }}>
        <Link to="/markets" style={{ textDecoration: 'none' }}>
          <div className="ms-summary-header">
            Market summary <ChevronRight size={28} strokeWidth={2.5} />
          </div>
        </Link>
        <div className="ms-cards">
          {summaryCards.map((c) => (
            <TickerCard key={c.symbol} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}

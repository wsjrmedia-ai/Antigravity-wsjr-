import React, { useMemo, useRef, useState } from 'react';
import {
  AdvancedRealTimeChart,
  TechnicalAnalysis,
  Timeline,
  CompanyProfile
} from 'react-ts-tradingview-widgets';

/**
 * MarketSummary
 *
 * Desktop / Tablet  → original 2x2 widget dashboard (chart + technicals + news + profile)
 * Mobile (<=600px)  → TradingView-style hero video showcase
 *
 * To activate the mobile hero clip, drop one of these into /public:
 *   - /public/platform_demo.webm  (preferred — smaller)
 *   - /public/platform_demo.mp4
 * If neither file exists the mobile hero falls back to a live chart so
 * the area is never empty.
 */
export default function MarketSummary() {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  /* ───────────── Desktop / Tablet dashboard (unchanged) ───────────── */
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

  /* ───────────── Mobile hero video ───────────── */
  const mobileHero = useMemo(() => (
    <div className="ms-hero-media">
      {!videoFailed ? (
        <video
          ref={videoRef}
          className="ms-hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/topstocx.png"
          onError={() => setVideoFailed(true)}
        >
          <source src="/platform_demo.webm" type="video/webm" />
          <source src="/platform_demo.mp4" type="video/mp4" />
        </video>
      ) : (
        <div className="ms-hero-fallback">
          <AdvancedRealTimeChart
            theme="dark"
            symbol="NASDAQ:AAPL"
            interval="D"
            autosize
            hide_legend
            hide_side_toolbar
            allow_symbol_change={false}
            hide_top_toolbar
          />
        </div>
      )}
      <div aria-hidden className="ms-hero-vignette" />
    </div>
  ), [videoFailed]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <style>{`
        .ms-title { font-size: clamp(38px, 7vw, 72px); }
        .ms-sub   { font-size: clamp(15px, 2vw, 18px); }

        /* Default: show the dashboard grid, hide the mobile hero */
        .ms-desktop-dashboard { display: block; }
        .ms-mobile-hero       { display: none; }

        /* Glow frame used by both variants */
        .ms-glow-frame {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 3px;
          background: var(--primary-gradient);
          border-radius: 15px;
          box-shadow: 0 0 30px 10px rgba(0, 90, 255, 0.4),
                      0 0 40px 15px rgba(57, 181, 74, 0.3);
        }

        /* Hero media (mobile only) */
        .ms-hero-media { position: relative; width: 100%; height: 100%; }
        .ms-hero-video, .ms-hero-fallback {
          width: 100%; height: 100%;
          display: block; object-fit: cover;
          background: #0b0f17;
        }
        .ms-hero-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(120% 80% at 50% 0%, transparent 55%, rgba(0,0,0,0.35) 100%),
            linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(11,15,23,0.5) 100%);
        }

        /* Explore features CTA (shown only on mobile with the hero) */
        .ms-cta {
          display: inline-flex; align-items: center; gap: 8px;
          margin-top: 1.5rem;
          padding: 0.8rem 1.6rem;
          background: #ffffff; color: #0b0f17;
          border: none; border-radius: 999px;
          font-weight: 700; font-size: 14px;
          cursor: pointer; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .ms-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.45);
        }

        /* Phone — swap dashboard for hero video */
        @media (max-width: 600px) {
          .ms-desktop-dashboard { display: none !important; }
          .ms-mobile-hero       { display: block !important; }

          .ms-title { font-size: clamp(30px, 9vw, 42px) !important; letter-spacing: -1px !important; }
          .ms-sub   { font-size: 14px !important; margin-bottom: 1.5rem !important; }
          .ms-glow-frame {
            padding: 2px !important;
            border-radius: 14px !important;
            box-shadow: 0 0 20px rgba(0,90,255,0.3),
                        0 0 30px rgba(57,181,74,0.2) !important;
          }
          .ms-mobile-hero .ms-glow-frame-inner {
            background: #0b0f17;
            border-radius: 12px;
            overflow: hidden;
            position: relative;
            z-index: 1;
            aspect-ratio: 4 / 5;
          }
        }
        @media (max-width: 380px) {
          .ms-mobile-hero .ms-glow-frame-inner { aspect-ratio: 3 / 4; }
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

      {/* ── Desktop / Tablet: original 2x2 widget dashboard ── */}
      <div className="ms-desktop-dashboard">
        <div className="ms-glow-frame">
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

      {/* ── Mobile only: hero video showcase ── */}
      <div className="ms-mobile-hero">
        <div className="ms-glow-frame">
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'var(--primary-gradient)',
            filter: 'blur(20px)', zIndex: -1, opacity: 0.8, borderRadius: 15,
          }} />
          <div className="ms-glow-frame-inner">
            {mobileHero}
          </div>
        </div>

        <a href="/markets" className="ms-cta">
          Explore features
          <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>→</span>
        </a>
      </div>
    </div>
  );
}

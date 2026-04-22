import React, { useMemo, useRef, useState } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

/**
 * MarketSummary — TradingView-style hero section.
 *
 * To swap in your own demo clip, drop one of these into `/public`:
 *   - /public/platform_demo.mp4   (primary)
 *   - /public/platform_demo.webm  (optional better compression)
 *   - /public/platform_demo.gif   (fallback if no mp4/webm)
 *
 * If no file exists the component gracefully falls back to a live
 * TradingView chart so the hero area is never empty.
 */
export default function MarketSummary() {
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const handleVideoError = () => setVideoFailed(true);

  const hero = useMemo(() => (
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
          onError={handleVideoError}
        >
          <source src="/platform_demo.webm" type="video/webm" />
          <source src="/platform_demo.mp4" type="video/mp4" />
        </video>
      ) : (
        /* Fallback: live chart looks just as alive as a demo video */
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
      {/* Soft vignette overlay to match TradingView's hero */}
      <div aria-hidden className="ms-hero-vignette" />
    </div>
  ), [videoFailed]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <style>{`
        .ms-title { font-size: clamp(38px, 7vw, 72px); }
        .ms-sub   { font-size: clamp(15px, 2vw, 18px); }

        /* Glow frame (keeps the old branded look) */
        .ms-glow-frame {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          padding: 3px;
          background: var(--primary-gradient);
          border-radius: 18px;
          box-shadow:
            0 0 40px 10px rgba(0, 90, 255, 0.35),
            0 0 60px 20px rgba(57, 181, 74, 0.25),
            0 0 80px 30px rgba(255, 0, 180, 0.15);
        }
        .ms-glow-frame-inner {
          background: #0b0f17;
          border-radius: 15px;
          overflow: hidden;
          position: relative;
          z-index: 1;
          aspect-ratio: 16 / 9;
        }

        /* Hero media */
        .ms-hero-media {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .ms-hero-video,
        .ms-hero-fallback {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          background: #0b0f17;
        }
        .ms-hero-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(120% 80% at 50% 0%, transparent 50%, rgba(0,0,0,0.35) 100%),
            linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(11,15,23,0.5) 100%);
        }

        /* Explore features pill — TradingView-style */
        .ms-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 1.75rem;
          padding: 0.85rem 1.75rem;
          background: #ffffff;
          color: #0b0f17;
          border: none;
          border-radius: 999px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }
        .ms-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.45);
        }

        /* Tablet */
        @media (max-width: 900px) {
          .ms-glow-frame-inner { aspect-ratio: 16 / 10; }
        }

        /* Phone */
        @media (max-width: 600px) {
          .ms-title { font-size: clamp(30px, 9vw, 42px) !important; letter-spacing: -1px !important; }
          .ms-sub   { font-size: 14px !important; margin-bottom: 1.5rem !important; }
          .ms-glow-frame {
            padding: 2px !important;
            border-radius: 14px !important;
            box-shadow:
              0 0 20px rgba(0,90,255,0.3),
              0 0 30px rgba(57,181,74,0.2),
              0 0 40px rgba(255,0,180,0.15) !important;
          }
          .ms-glow-frame-inner {
            border-radius: 12px !important;
            aspect-ratio: 4 / 5;
          }
          .ms-cta { padding: 0.7rem 1.4rem; font-size: 14px; }
        }

        @media (max-width: 380px) {
          .ms-glow-frame-inner { aspect-ratio: 3 / 4; }
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

      {/* Glow-bordered hero video */}
      <div className="ms-glow-frame">
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'var(--primary-gradient)',
          filter: 'blur(24px)', zIndex: -1, opacity: 0.75, borderRadius: 18,
        }} />
        <div className="ms-glow-frame-inner">
          {hero}
        </div>
      </div>

      {/* Explore features CTA (TradingView parity) */}
      <a href="/markets" className="ms-cta" style={{ textDecoration: 'none' }}>
        Explore features
        <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>→</span>
      </a>
    </div>
  );
}

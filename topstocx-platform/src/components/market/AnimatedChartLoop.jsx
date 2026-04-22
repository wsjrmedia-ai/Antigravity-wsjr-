import React, { useMemo } from 'react';

/**
 * AnimatedChartLoop
 *
 * A pure-CSS/SVG animated "market GIF" — no live data, no interaction.
 * Used as the mobile hero in MarketSummary when no /public/platform_demo.* clip is present.
 *
 * Renders like a looping video:
 *   - candlestick series that slides left continuously
 *   - animated price line drawing across the chart
 *   - pulsing price dot at the leading edge
 *   - faint grid + glowing price label
 */
export default function AnimatedChartLoop() {
  // Deterministic pseudo-random candle series so it looks like real market action
  const candles = useMemo(() => {
    const n = 48;
    let price = 120;
    return Array.from({ length: n }, (_, i) => {
      const drift = Math.sin(i * 0.35) * 6 + Math.cos(i * 0.17) * 4;
      const vol = 4 + Math.abs(Math.sin(i * 0.7)) * 6;
      const open = price;
      price += drift * 0.35 + (Math.sin(i * 1.3) * 2);
      const close = price;
      const high = Math.max(open, close) + Math.abs(Math.sin(i * 0.9)) * vol;
      const low = Math.min(open, close) - Math.abs(Math.cos(i * 0.6)) * vol;
      return { open, close, high, low };
    });
  }, []);

  // Normalize to viewBox [0..400 x, 0..220 y]
  const W = 800, H = 360, PAD = 16;
  const prices = candles.flatMap(c => [c.high, c.low]);
  const min = Math.min(...prices) - 2;
  const max = Math.max(...prices) + 2;
  const y = (p) => PAD + (1 - (p - min) / (max - min)) * (H - PAD * 2);
  const cw = (W - PAD * 2) / candles.length;

  // Line path across closes (for the overlay price line)
  const linePath = candles
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${PAD + i * cw + cw / 2} ${y(c.close)}`)
    .join(' ');

  const last = candles[candles.length - 1];
  const lastX = PAD + (candles.length - 1) * cw + cw / 2;
  const lastY = y(last.close);

  return (
    <div className="acl-root">
      <style>{`
        .acl-root {
          position: relative;
          width: 100%;
          height: 100%;
          background: radial-gradient(140% 100% at 50% 0%, #0f1b2c 0%, #070d16 60%, #050a12 100%);
          overflow: hidden;
        }

        /* Scanning glow behind the candles */
        .acl-scan {
          position: absolute; inset: 0;
          background: radial-gradient(60% 40% at 30% 50%, rgba(0,90,255,0.25), transparent 70%);
          animation: acl-scan 6s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes acl-scan {
          0%, 100% { transform: translateX(-10%); opacity: 0.55; }
          50%      { transform: translateX(30%);  opacity: 0.9;  }
        }

        /* Candle group slides left so it feels like a live feed */
        .acl-candles {
          animation: acl-slide 14s linear infinite;
          transform-origin: left center;
        }
        @keyframes acl-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-6%); }
        }

        /* Price line draws itself continuously */
        .acl-line {
          stroke-dasharray: 2400;
          stroke-dashoffset: 2400;
          animation: acl-draw 6s ease-in-out infinite;
        }
        @keyframes acl-draw {
          0%   { stroke-dashoffset: 2400; opacity: 0.4; }
          50%  { stroke-dashoffset: 0;    opacity: 1;   }
          100% { stroke-dashoffset: -2400; opacity: 0.4; }
        }

        /* Pulsing dot at the leading edge */
        .acl-dot    { animation: acl-pulse 1.6s ease-in-out infinite; }
        .acl-dot-bg { animation: acl-ring 1.6s ease-out infinite; transform-origin: center; }
        @keyframes acl-pulse {
          0%, 100% { r: 4.5; filter: drop-shadow(0 0 6px #39B54A); }
          50%      { r: 6;   filter: drop-shadow(0 0 14px #39B54A); }
        }
        @keyframes acl-ring {
          0%   { r: 5;  opacity: 0.6; }
          100% { r: 22; opacity: 0;   }
        }

        /* Floating price label — changes like a ticker */
        .acl-label {
          position: absolute;
          top: 14px;
          left: 14px;
          display: flex;
          align-items: baseline;
          gap: 8px;
          color: #e8f0fe;
          font-family: 'Inter', system-ui, sans-serif;
          font-weight: 700;
          letter-spacing: 0.5px;
          pointer-events: none;
        }
        .acl-label .sym   { font-size: 12px; color: #7a9ab8; letter-spacing: 2px; }
        .acl-label .price { font-size: 18px; color: #39B54A; animation: acl-flicker 2.4s ease-in-out infinite; }
        .acl-label .chg   { font-size: 11px; color: #39B54A; opacity: 0.85; }
        @keyframes acl-flicker {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.65; }
        }

        /* Corner watermark so it reads as a demo clip */
        .acl-wm {
          position: absolute;
          right: 12px; bottom: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          pointer-events: none;
        }

        /* Soft vignette for a cinematic feel */
        .acl-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(120% 80% at 50% 0%, transparent 55%, rgba(0,0,0,0.45) 100%),
            linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(5,10,18,0.65) 100%);
        }

        @media (prefers-reduced-motion: reduce) {
          .acl-scan, .acl-candles, .acl-line, .acl-dot, .acl-dot-bg, .acl-label .price {
            animation: none !important;
          }
        }
      `}</style>

      <div className="acl-scan" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {/* Grid */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h${i}`} x1={0} x2={W} y1={PAD + ((H - PAD * 2) / 4) * i} y2={PAD + ((H - PAD * 2) / 4) * i} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} y1={0} y2={H} x1={(W / 8) * i} x2={(W / 8) * i} />
          ))}
        </g>

        {/* Candles */}
        <g className="acl-candles">
          {candles.map((c, i) => {
            const x = PAD + i * cw + cw / 2;
            const up = c.close >= c.open;
            const color = up ? '#39B54A' : '#ff4d6d';
            const bodyY = y(Math.max(c.open, c.close));
            const bodyH = Math.max(2, Math.abs(y(c.open) - y(c.close)));
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="1.2" opacity="0.75" />
                <rect
                  x={x - cw * 0.32}
                  y={bodyY}
                  width={cw * 0.64}
                  height={bodyH}
                  fill={color}
                  opacity={up ? 0.9 : 0.85}
                  rx="1"
                />
              </g>
            );
          })}

          {/* Area fill under the price line */}
          <defs>
            <linearGradient id="acl-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#005AFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#005AFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${linePath} L ${lastX} ${H - PAD} L ${PAD + cw / 2} ${H - PAD} Z`}
            fill="url(#acl-area)"
            opacity="0.85"
          />

          {/* Price line */}
          <path
            className="acl-line"
            d={linePath}
            fill="none"
            stroke="#77A6FF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Leading dot */}
        <g>
          <circle className="acl-dot-bg" cx={lastX} cy={lastY} r="8" fill="rgba(57,181,74,0.35)" />
          <circle className="acl-dot"    cx={lastX} cy={lastY} r="5" fill="#39B54A" />
        </g>
      </svg>

      {/* Ticker label */}
      <div className="acl-label">
        <span className="sym">NASDAQ:AAPL</span>
        <span className="price">${last.close.toFixed(2)}</span>
        <span className="chg">+{(Math.abs(last.close - last.open) / last.open * 100).toFixed(2)}%</span>
      </div>

      <div className="acl-wm">TOPSTOCX · LIVE</div>
      <div className="acl-vignette" />
    </div>
  );
}

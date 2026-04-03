import React, { useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLeverate } from '../../context/LeverateContext';
import { useMarketData } from '../../context/MarketDataContext';

// ── Helpers ──────────────────────────────────────────────────────────────────
const up   = '#089981';
const down = '#f23645';
const c    = (v) => (v >= 0 ? up : down);
const fmtP = (p, dec = 2) => {
  if (!p) return '—';
  if (p > 1000) return p.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return p.toFixed(dec);
};
const fmtPct = (v) => `${v >= 0 ? '+' : ''}${v?.toFixed(2) ?? '0.00'}%`;
const fmtBig = (v) => {
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9)  return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6)  return `${(v / 1e6).toFixed(1)}M`;
  return v?.toFixed(0) ?? '—';
};

// ── Interactive Main Chart ─────────────────────────────────────────────────────
function InteractiveChart({ series, color, height = 220 }) {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState(null);

  const W = 800, H = height;
  const PAD_L = 0, PAD_T = 8, PAD_B = 32;
  const chartW = W - PAD_L;
  const chartH = H - PAD_T - PAD_B;

  const vals = series.map(d => d.v);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const pts = vals.map((v, i) => ({
    x: PAD_L + (i / (vals.length - 1)) * chartW,
    y: PAD_T + chartH - ((v - min) / range) * chartH,
    v,
    d: series[i].d,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${H - PAD_B} L${pts[0].x},${H - PAD_B} Z`;

  // Time labels
  const labelCount = 7;
  const timeLabels = Array.from({ length: labelCount }, (_, i) => {
    const idx = Math.round((i / (labelCount - 1)) * (series.length - 1));
    const d = series[idx]?.d;
    if (!d) return { x: pts[idx]?.x ?? 0, label: '' };
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return { x: pts[idx]?.x ?? 0, label: `${h}:${m}` };
  });

  function formatTooltip(date) {
    if (!date) return { datePart: '', timePart: '' };
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const tzOff = -date.getTimezoneOffset() / 60;
    const tz = `UTC${tzOff >= 0 ? '+' : ''}${tzOff}`;
    return {
      datePart: `${date.getDate()} ${months[date.getMonth()]} '${date.getFullYear().toString().slice(2)}`,
      timePart: `${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')} ${tz}`,
    };
  }

  const handleMove = useCallback((clientX) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * W;
    const idx = Math.max(0, Math.min(pts.length - 1, Math.round(((relX - PAD_L) / chartW) * (pts.length - 1))));
    setCursor(idx);
  }, [pts]);

  const tip = cursor !== null ? pts[cursor] : null;
  const tipFmt = tip?.d ? formatTooltip(tip.d) : null;
  const tipX = tip ? (tip.x > W * 0.65 ? tip.x - 130 : tip.x + 10) : 0;
  const tipY = tip ? Math.max(PAD_T, Math.min(tip.y - 36, H - PAD_B - 72)) : 0;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height, display: 'block', cursor: 'crosshair' }}
      onMouseMove={e => handleMove(e.clientX)}
      onMouseLeave={() => setCursor(null)}
      onTouchMove={e => { e.preventDefault(); handleMove(e.touches[0].clientX); }}
      onTouchEnd={() => setCursor(null)}
    >
      <defs>
        <linearGradient id="igradmain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.40" />
          <stop offset="70%"  stopColor={color} stopOpacity="0.07" />
          <stop offset="100%" stopColor={color} stopOpacity="0.00" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill="url(#igradmain)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.8" />

      {/* Crosshair */}
      {tip && (
        <>
          <line x1={tip.x} y1={PAD_T} x2={tip.x} y2={H - PAD_B}
            stroke="rgba(255,255,255,0.30)" strokeWidth="1" />
          <circle cx={tip.x} cy={tip.y} r="7" fill={color} opacity="0.22" />
          <circle cx={tip.x} cy={tip.y} r="3.5" fill={color} />
        </>
      )}

      {/* Tooltip */}
      {tip && tipFmt && (
        <g>
          <rect x={tipX} y={tipY} width="122" height="62"
            rx="6" fill="#1a1f2e" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
          <text x={tipX + 11} y={tipY + 21} fontSize="14" fontWeight="800"
            fill="#e8f0fe" fontFamily="Inter,system-ui,sans-serif">
            {fmtP(tip.v, 2)}
          </text>
          <text x={tipX + 11} y={tipY + 38} fontSize="11"
            fill="#6b7280" fontFamily="Inter,system-ui,sans-serif">
            {tipFmt.datePart}
          </text>
          <text x={tipX + 11} y={tipY + 53} fontSize="11"
            fill="#6b7280" fontFamily="Inter,system-ui,sans-serif">
            {tipFmt.timePart}
          </text>
        </g>
      )}

      {/* X-axis time labels */}
      {timeLabels.map((lbl, i) => (
        <text key={i} x={lbl.x} y={H - 6}
          textAnchor={i === 0 ? 'start' : i === labelCount - 1 ? 'end' : 'middle'}
          fontSize="13" fill="#444" fontFamily="Inter,system-ui,sans-serif">
          {lbl.label}
        </text>
      ))}
    </svg>
  );
}

// ── Simple sparkline (for small cards) ───────────────────────────────────────
function AreaChart({ data, color = up, width = '100%', height = 80 }) {
  if (!data || data.length < 2) return <div style={{ height }} />;
  const W = 300, H = height;
  const vals = data.map(d => (typeof d === 'object' ? d.v : d));
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => [
    (i / (vals.length - 1)) * W,
    H - ((v - min) / range) * (H - 4) - 2,
  ]);
  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const areaPath = `${linePath} L${W},${H} L0,${H} Z`;
  const id = `sg-${color.replace('#','')}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      style={{ width, height, display: 'block' }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.20" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${id})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ── Bar Chart (for inflation rate) ───────────────────────────────────────────
function BarChart({ data, color = '#2962ff' }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <svg viewBox="0 0 300 60" preserveAspectRatio="none"
      style={{ width: '100%', height: 60, display: 'block' }}>
      {data.map((d, i) => {
        const barH = (d.v / max) * 48;
        const x = (i / data.length) * 300 + 2;
        const w = (300 / data.length) - 4;
        return (
          <g key={i}>
            <rect x={x} y={60 - barH - 6} width={w} height={barH}
              fill={color} opacity={0.7} rx="1" />
          </g>
        );
      })}
    </svg>
  );
}

// ── Static commodity data ─────────────────────────────────────────────────────
const COMMODITIES = [
  { icon: '🛢️', name: 'Crude oil',   code: 'CL1!', price: 87.15, unit: 'USD / barrel',     changePct: -5.63 },
  { icon: '🔥', name: 'Natural gas', code: 'NG1!', price: 2.893, unit: 'USD / million BTUs', changePct: -1.70 },
  { icon: '🪙', name: 'Gold',        code: 'GC1!', price: 4558.7, unit: 'USD / troy ounce', changePct: +3.56 },
];

const INFLATION_BARS = [
  { l: 'Jan', v: 3.1 }, { l: 'Feb', v: 3.2 }, { l: 'Mar', v: 3.5 },
  { l: 'Apr', v: 3.4 }, { l: 'May', v: 3.3 }, { l: 'Jun', v: 3.0 },
  { l: 'Jul', v: 2.9 }, { l: 'Aug', v: 2.6 }, { l: 'Sep', v: 2.4 },
  { l: 'Oct', v: 2.6 }, { l: 'Nov', v: 2.7 }, { l: 'Dec', v: 2.9 },
];

// Index icon badges
const INDEX_BADGES = {
  SPX:  { bg: '#c0392b', text: '500' },
  NDX:  { bg: '#2962ff', text: '100' },
  N225: { bg: '#27ae60', text: '225' },
  HSI:  { bg: '#e67e22', text: 'HSI' },
  DAX:  { bg: '#8e44ad', text: 'DAX' },
  FTSE: { bg: '#2c3e50', text: 'UK'  },
  DJI:  { bg: '#16a085', text: 'DOW' },
  VIX:  { bg: '#f39c12', text: 'VIX' },
};

// ── Simple sparkline series generator (no timestamp) ────────────────────────
function genSeries(seed, n = 60, vol = 0.0008) {
  const arr = [seed];
  for (let i = 1; i < n; i++) arr.push(arr[i - 1] * (1 + (Math.random() - 0.5) * vol * 2));
  return arr.map(v => ({ v }));
}

// ── Generate time-stamped series ───────────────────────────────────────────────
function genTimedSeries(seed, n = 120, vol = 0.0012) {
  const now = new Date();
  const start = new Date(now.getTime() - 8 * 60 * 60 * 1000);
  const intervalMs = (8 * 60 * 60 * 1000) / n;
  const arr = [seed];
  for (let i = 1; i < n; i++) arr.push(arr[i - 1] * (1 + (Math.random() - 0.5) * vol * 2));
  return arr.map((v, i) => ({ v, d: new Date(start.getTime() + i * intervalMs) }));
}

// ── Main SPX Chart Card ───────────────────────────────────────────────────────
function MainChartCard({ indices }) {
  const spx = indices.find(i => i.symbol === 'SPX') || indices[0];
  const series = useMemo(() => genTimedSeries(spx?.open24h ?? 5200, 120, 0.0015), []);
  if (!spx) return null;
  const isUp = spx.changePct >= 0;
  const chartColor = isUp ? up : down;

  return (
    <div style={{
      background: '#0d1117', border: '1px solid #1e2432', borderRadius: 12,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8, background: INDEX_BADGES['SPX'].bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 900, color: '#fff', flexShrink: 0,
        }}>500</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#e8f0fe' }}>S&amp;P 500</span>
            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#1e2432', color: '#555', fontWeight: 700 }}>SPX</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{fmtP(spx.price, 2)}</span>
            <span style={{ fontSize: 11, color: '#555' }}>USD</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: chartColor }}>{fmtPct(spx.changePct)}</span>
          </div>
        </div>
      </div>

      {/* Interactive Chart */}
      <div style={{ flex: 1 }}>
        <InteractiveChart series={series} color={chartColor} height={220} />
      </div>
    </div>
  );
}

// ── Major Indices Panel ───────────────────────────────────────────────────────
function MajorIndicesPanel({ indices }) {
  return (
    <div style={{
      background: '#0d1117', border: '1px solid #1e2432', borderRadius: 12, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '14px 16px', borderBottom: '1px solid #1e2432',
        fontSize: 14, fontWeight: 700, color: '#e8f0fe',
      }}>
        Major indices
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {indices.filter(i => i.symbol !== 'SPX').map((idx, i) => {
          const badge = INDEX_BADGES[idx.symbol] || { bg: '#2a2e39', text: idx.symbol.slice(0, 3) };
          const isUp  = idx.changePct >= 0;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 16px', borderBottom: '1px solid #1a1f2e',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#161b22'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: badge.bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px',
              }}>
                {badge.text}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e8f0fe' }}>{idx.name}</div>
                <div style={{ fontSize: 10, color: '#555', marginTop: 1 }}>{idx.symbol}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e8f0fe' }}>
                  {fmtP(idx.price, idx.symbol === 'VIX' ? 2 : 2)}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: c(idx.changePct) }}>
                  {fmtPct(idx.changePct)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '10px 16px', borderTop: '1px solid #1e2432' }}>
        <Link to="/markets" style={{
          fontSize: 12, color: '#2962ff', textDecoration: 'none', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          See all major indices <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}

// ── Crypto Market Cap Card ────────────────────────────────────────────────────
function CryptoCapCard({ cryptoList, cryptoPrices }) {
  const btc  = cryptoPrices['btcusdt'] || cryptoList.find(c => c.symbol === 'BTCUSDT');
  const eth  = cryptoPrices['ethusdt'] || cryptoList.find(c => c.symbol === 'ETHUSDT');

  const btcCap  = (btc?.price ?? 67000) * 19_700_000;
  const ethCap  = (eth?.price ?? 3800)  * 120_000_000;
  const totalCap = btcCap + ethCap + btcCap * 0.52; // rough others
  const btcDom   = (btcCap / totalCap * 100).toFixed(2);
  const ethDom   = (ethCap / totalCap * 100).toFixed(2);
  const otherDom = (100 - parseFloat(btcDom) - parseFloat(ethDom)).toFixed(2);

  const capChange = btc?.changePct ?? 2.1;
  const series    = useMemo(() => genSeries(totalCap * 0.97, 50, 0.001), []);

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1e2432', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 18 }}>₿</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#8b949e' }}>Crypto market cap</span>
          <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: '#1e2432', color: '#555', fontWeight: 700 }}>TOTAL</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '4px 0 1px' }}>
          {fmtBig(totalCap)} <span style={{ fontSize: 12, color: '#555', fontWeight: 400 }}>USD</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: c(capChange), marginBottom: 6 }}>
          {fmtPct(capChange)}
        </div>
      </div>

      <AreaChart data={series} color={capChange >= 0 ? up : down} height={72} />

      <div style={{ padding: '10px 16px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 6 }}>Bitcoin dominance</div>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 6 }}>
          {[['#2962ff', 'Bitcoin', btcDom], ['#089981', 'Ethereum', ethDom], ['#f23645', 'Others', otherDom]].map(([col, label, val]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, display: 'inline-block' }} />
              <span style={{ fontSize: 10, color: '#555' }}>{label}</span>
              <span style={{ fontSize: 10, color: '#e8f0fe', fontWeight: 700 }}>{val}%</span>
            </div>
          ))}
        </div>
        {/* Dominance bar */}
        <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
          <div style={{ width: `${btcDom}%`, background: '#2962ff' }} />
          <div style={{ width: `${ethDom}%`, background: '#089981' }} />
          <div style={{ flex: 1, background: '#f23645' }} />
        </div>
        {/* BTC / ETH rows */}
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { icon: '₿', name: 'Bitcoin',  code: 'BTCUSD', price: btc?.price ?? 67000, pct: btc?.changePct ?? 1.3 },
            { icon: 'Ξ', name: 'Ethereum', code: 'ETHUSD', price: eth?.price ?? 3800,  pct: eth?.changePct ?? 0.8 },
          ].map(row => (
            <div key={row.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, color: '#f59e0b', fontWeight: 900 }}>{row.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e8f0fe' }}>{row.name}</div>
                  <div style={{ fontSize: 9, color: '#444' }}>{row.code}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{fmtP(row.price, row.price > 1000 ? 0 : 2)} USD</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: c(row.pct) }}>{fmtPct(row.pct)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── USD Index + Commodities Card ──────────────────────────────────────────────
function USDCard({ forex }) {
  const dxy    = { price: 99.241, changePct: 1.59 };
  const series = useMemo(() => genSeries(96, 50, 0.0005), []);

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1e2432', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 15 }}>🇺🇸</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#8b949e' }}>US Dollar index</span>
          <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: '#1e2432', color: '#555', fontWeight: 700 }}>DXY</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '4px 0 1px' }}>
          {dxy.price} <span style={{ fontSize: 12, color: '#555', fontWeight: 400 }}>USD</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: c(dxy.changePct), marginBottom: 6 }}>
          {fmtPct(dxy.changePct)}
        </div>
      </div>

      <AreaChart data={series} color={up} height={72} />

      <div style={{ padding: '4px 16px 14px' }}>
        {COMMODITIES.map((com, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '7px 0',
            borderBottom: i < COMMODITIES.length - 1 ? '1px solid #1a1f2e' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>{com.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#e8f0fe' }}>
                  {com.name}
                  <span style={{ fontSize: 9, color: '#444', marginLeft: 5 }}>{com.code}</span>
                </div>
                <div style={{ fontSize: 10, color: '#444' }}>{com.unit}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{fmtP(com.price)} USD</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: c(com.changePct) }}>{fmtPct(com.changePct)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 10-Year Yield + Inflation Card ────────────────────────────────────────────
function YieldCard() {
  const yield10y = { price: 4.337, changePct: -0.46 };
  const series   = useMemo(() => genSeries(4.5, 50, 0.002), []);

  return (
    <div style={{ background: '#0d1117', border: '1px solid #1e2432', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 15 }}>🇺🇸</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#8b949e' }}>US 10-year yield</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '4px 0 1px' }}>
          {yield10y.price}% <span style={{ fontSize: 12, color: '#555', fontWeight: 400 }}></span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: c(yield10y.changePct), marginBottom: 6 }}>
          {fmtPct(yield10y.changePct)}
        </div>
      </div>

      <AreaChart data={series} color={yield10y.changePct >= 0 ? up : down} height={72} />

      <div style={{ padding: '10px 16px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8b949e' }}>US annual inflation rate</span>
          <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: '#1e2432', color: '#555', fontWeight: 700 }}>USIRRY</span>
        </div>
        <BarChart data={INFLATION_BARS} color="#2962ff" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: '#444' }}>2025</span>
          <span style={{ fontSize: 10, color: '#444' }}>Jun</span>
          <span style={{ fontSize: 10, color: '#444' }}>Nov</span>
          <span style={{ fontSize: 10, color: '#444' }}>2026</span>
        </div>

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: '#555' }}>US interest rate</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>5.33%</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: down }}>-0.08%</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#555' }}>CPI YoY</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>3.1%</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: down }}>-0.2%</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#555' }}>PPI YoY</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>1.6%</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: up }}>+0.3%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function MarketSummary() {
  const { indices, cryptoList, cryptoPrices } = useMarketData();

  return (
    <div>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Market summary</h2>
        <ChevronRight size={20} color="#555" />
      </div>

      {/* Top row: main chart + indices panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '1rem',
        marginBottom: '1rem',
      }}>
        <MainChartCard indices={indices} />
        <MajorIndicesPanel indices={indices} />
      </div>

      {/* Bottom row: 3 equal cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
      }}>
        <CryptoCapCard cryptoList={cryptoList} cryptoPrices={cryptoPrices} />
        <USDCard forex={[]} />
        <YieldCard />
      </div>
    </div>
  );
}

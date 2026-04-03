import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ── Data sets ────────────────────────────────────────────────────────────────
const INFLATION = {
  'United States of America': 3.1, 'Canada': 2.9, 'Mexico': 4.4,
  'United Kingdom': 4.0, 'Germany': 2.5, 'France': 2.9, 'Italy': 0.8,
  'Spain': 2.8, 'Netherlands': 3.2, 'Switzerland': 1.3, 'Sweden': 4.5,
  'Norway': 4.5, 'Poland': 3.9, 'Russia': 7.4, 'Ukraine': 4.7,
  'Turkey': 64.9, 'Romania': 7.2, 'Hungary': 3.8, 'Czechia': 2.0,
  'Austria': 4.5, 'Belgium': 1.7, 'Portugal': 2.1, 'Greece': 3.1,
  'Denmark': 0.9, 'Finland': 3.3, 'Ireland': 4.1, 'Bulgaria': 3.3,
  'China': 0.4, 'Japan': 2.2, 'India': 5.1, 'South Korea': 2.8,
  'Indonesia': 2.6, 'Saudi Arabia': 1.6, 'Australia': 4.1, 'New Zealand': 4.7,
  'Singapore': 3.1, 'Malaysia': 1.5, 'Thailand': 0.9, 'Vietnam': 3.8,
  'Philippines': 2.8, 'Pakistan': 28.3, 'Bangladesh': 9.8, 'Iran': 35.8,
  'Iraq': 4.5, 'United Arab Emirates': 2.5, 'Israel': 2.6, 'Kazakhstan': 9.5,
  'Brazil': 4.5, 'Argentina': 254.2, 'Colombia': 7.7, 'Chile': 4.5,
  'Peru': 3.0, 'Venezuela': 107.4, 'Ecuador': 1.3, 'Bolivia': 3.1,
  'South Africa': 5.3, 'Nigeria': 29.9, 'Egypt': 29.8, 'Kenya': 6.9,
  'Ethiopia': 28.7, 'Ghana': 23.5, 'Algeria': 7.8, 'Morocco': 2.3,
  'Angola': 20.0, 'Zimbabwe': 47.6, 'Sudan': 150.0,
};

const STOCKS = {
  'United States of America': 0.34, 'Canada': -0.12, 'Mexico': 0.85,
  'United Kingdom': 0.42, 'Germany': -0.55, 'France': -0.21, 'Italy': 1.2,
  'Spain': 0.15, 'Netherlands': 0.6, 'Switzerland': -0.3, 'Sweden': -1.2,
  'Norway': 0.9, 'Poland': 1.5, 'Russia': -2.4, 'Ukraine': -4.5,
  'Turkey': 2.8, 'China': -2.1, 'Japan': 1.85, 'India': 0.72, 'South Korea': 0.45,
  'Indonesia': -0.2, 'Saudi Arabia': 0.3, 'Australia': 0.1, 'New Zealand': -0.4,
  'Singapore': 0.25, 'Brazil': -1.4, 'Argentina': -3.5, 'South Africa': 0.55,
  'Nigeria': 1.2, 'Egypt': 2.4,
};

const GDP_GROWTH = {
  'United States of America': 2.5, 'Canada': 1.1, 'Mexico': 1.5,
  'United Kingdom': 0.3, 'Germany': -0.3, 'France': 1.1, 'Italy': 0.7,
  'Spain': 2.5, 'Netherlands': 0.6, 'Switzerland': 1.3, 'Sweden': -0.2,
  'Norway': 2.0, 'Poland': 2.9, 'Russia': 3.6, 'Ukraine': -1.0,
  'Turkey': 3.2, 'Romania': 2.4, 'Hungary': 0.4, 'Czechia': 0.9,
  'Austria': 0.3, 'Belgium': 1.4, 'Portugal': 2.0, 'Greece': 2.3,
  'China': 5.2, 'Japan': 1.9, 'India': 7.6, 'South Korea': 2.5,
  'Indonesia': 5.0, 'Saudi Arabia': 1.7, 'Australia': 2.0, 'New Zealand': 0.6,
  'Singapore': 1.7, 'Malaysia': 3.6, 'Thailand': 2.5, 'Vietnam': 5.0,
  'Philippines': 5.6, 'Bangladesh': 5.8, 'Pakistan': 2.4, 'Iran': 5.0,
  'Brazil': 2.9, 'Argentina': -1.6, 'Colombia': 1.6, 'Chile': 2.3,
  'Peru': 2.4, 'Venezuela': 4.0, 'Ecuador': 2.0, 'Bolivia': 2.5,
  'South Africa': 0.6, 'Nigeria': 3.4, 'Egypt': 3.8, 'Kenya': 5.0,
  'Ethiopia': 6.2, 'Ghana': 2.7, 'Algeria': 4.1, 'Morocco': 3.2,
  'Angola': 2.5,
};

const INTEREST_RATES = {
  'United States of America': 5.33, 'Canada': 5.0, 'Mexico': 11.25,
  'United Kingdom': 5.25, 'Germany': 4.5, 'France': 4.5, 'Italy': 4.5,
  'Spain': 4.5, 'Switzerland': 1.75, 'Sweden': 4.0, 'Norway': 4.5,
  'Poland': 5.75, 'Russia': 16.0, 'Turkey': 42.5, 'Hungary': 10.75,
  'Czechia': 5.25, 'Australia': 4.35, 'New Zealand': 5.5,
  'Japan': 0.1, 'China': 3.45, 'India': 6.5, 'South Korea': 3.5,
  'Indonesia': 6.0, 'Saudi Arabia': 6.0, 'Singapore': 3.68,
  'Brazil': 10.75, 'Argentina': 100.0, 'Colombia': 12.75, 'Chile': 7.25,
  'Peru': 6.75, 'Mexico': 11.25, 'South Africa': 8.25,
  'Egypt': 21.25, 'Nigeria': 18.75, 'Kenya': 13.0, 'Ghana': 29.0,
  'Pakistan': 22.0, 'Bangladesh': 8.0,
};

const TABS = [
  { id: 'stocks',         label: 'Markets',        unit: '%', desc: 'Major Stock Index Performance (24h)', data: STOCKS,
    scale: scaleLinear().domain([-3, 0, 3]).range(['#f23645', '#1a1f2e', '#089981']),
    legend: { min: '-3%', mid: '0%', max: '3%+' },
    gradient: 'linear-gradient(90deg, #f23645 0%, #1a1f2e 50%, #089981 100%)',
  },
  { id: 'inflation',      label: 'Inflation',      unit: '%', desc: 'Consumer Price Index YoY', data: INFLATION,
    scale: scaleLinear().domain([0, 4, 10, 30]).range(['#0d2820', '#089981', '#f59e0b', '#f23645']),
    legend: { min: '0%', mid: '10%', max: '30%+' },
    gradient: 'linear-gradient(90deg, #0d2820 0%, #089981 30%, #f59e0b 65%, #f23645 100%)',
  },
  { id: 'gdp',            label: 'GDP Growth',     unit: '%', desc: 'Real GDP Growth Rate YoY', data: GDP_GROWTH,
    scale: scaleLinear().domain([-2, 0, 3, 8]).range(['#f23645', '#1a1f2e', '#2962ff', '#089981']),
    legend: { min: '-2%', mid: '3%', max: '8%+' },
    gradient: 'linear-gradient(90deg, #f23645 0%, #1a1f2e 25%, #2962ff 60%, #089981 100%)',
  },
  { id: 'rates',          label: 'Interests',      unit: '%', desc: 'Central Bank Policy Rate', data: INTEREST_RATES,
    scale: scaleLinear().domain([0, 5, 15, 40]).range(['#0d1530', '#2962ff', '#7c3aed', '#f23645']),
    legend: { min: '0%', mid: '15%', max: '40%+' },
    gradient: 'linear-gradient(90deg, #0d1530 0%, #2962ff 35%, #7c3aed 65%, #f23645 100%)',
  },
];

const DEFAULT_VALS = { stocks: 0, inflation: 4.5, gdp: 1.5, rates: 3.5 };

export default function GlobalInflationMap() {
  const [mounted, setMounted]   = useState(false);
  const [tab, setTab]           = useState('stocks'); // Start with Markets
  const [tooltip, setTooltip]   = useState(null);
  const [mouse, setMouse]       = useState({ x: 0, y: 0 });

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const current = TABS.find(t => t.id === tab);

  return (
    <div
      onMouseMove={e => setMouse({ x: e.clientX, y: e.clientY })}
      style={{
        background: 'rgba(10, 10, 10, 0.4)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(30, 36, 50, 0.8)',
        borderRadius: 20,
        overflow: 'hidden',
        fontFamily: 'inherit',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* ── Header ── */}
      <div style={{
        padding: '24px 24px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
      }}>
        <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#e8f0fe', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
              Global {current.label} Intelligence
            </h3>
            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{current.desc}</p>
          </div>
          <div style={{
             padding: '4px 12px', borderRadius: 6, background: 'rgba(41, 98, 255, 0.1)',
             border: '1px solid rgba(41, 98, 255, 0.2)', fontSize: 11, color: '#2962ff', fontWeight: 700
          }}>
             LIVE DATA
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 8, paddingBottom: 1 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '10px 22px',
                background: tab === t.id ? 'rgba(41, 98, 255, 0.1)' : 'transparent',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                borderBottom: `2.5px solid ${tab === t.id ? '#2962ff' : 'transparent'}`,
                color: tab === t.id ? '#fff' : '#666',
                fontWeight: tab === t.id ? 800 : 500,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Map ── */}
      <div style={{ position: 'relative', padding: '16px 12px 12px' }}>
        <ComposableMap
          projectionConfig={{ scale: 165, center: [0, 8] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const name = geo.properties.name || '';
                const val  = current.data[name] ?? DEFAULT_VALS[tab];
                const fill = current.scale(val);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#0a0a0a"
                    strokeWidth={0.5}
                    onMouseEnter={() => setTooltip({ name, val })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      default: { outline: 'none', transition: 'fill 0.4s ease' },
                      hover:   { fill: '#7c3aed', outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* ── Legend ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          padding: '12px 0 20px',
        }}>
          <span style={{ fontSize: 12, color: '#444', fontWeight: 600 }}>{current.legend.min}</span>
          <div style={{ position: 'relative', width: 320 }}>
            <div style={{
              height: 8, borderRadius: 4,
              background: current.gradient,
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
            }} />
            {/* tick marks */}
            {[0, 50, 100].map(pct => (
              <div key={pct} style={{
                position: 'absolute', bottom: -8,
                left: `${pct}%`, transform: 'translateX(-50%)',
                width: 1.5, height: 6, background: 'rgba(255,255,255,0.1)',
              }} />
            ))}
          </div>
          <span style={{ fontSize: 12, color: '#444', fontWeight: 600 }}>{current.legend.max}</span>
        </div>
      </div>

      {/* ── Tooltip ── */}
      {tooltip && (
        <div style={{
          position: 'fixed',
          top: mouse.y + 18,
          left: mouse.x + 18,
          background: 'rgba(19, 23, 34, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          padding: '12px 18px',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 15px 45px rgba(0,0,0,0.8)',
          minWidth: 180,
        }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 6 }}>
            {tooltip.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ fontSize: 11, color: '#8b949e', fontWeight: 600, textTransform: 'uppercase' }}>{current.label}</span>
            <span style={{
              fontSize: 16, fontWeight: 900,
              color: current.id === 'gdp' || current.id === 'stocks'
                ? tooltip.val >= 0 ? '#00c979' : '#f23645'
                : tooltip.val > 10 ? '#f23645' : tooltip.val > 5 ? '#f59e0b' : '#00c979',
            }}>
              {tooltip.val > 0 && (current.id === 'stocks' || current.id === 'gdp') ? '+' : ''}
              {tooltip.val.toFixed(2)}{current.unit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

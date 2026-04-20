import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Search, ArrowUpDown } from 'lucide-react';
import HomeHeader from '../components/layout/HomeHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarketData } from '../context/MarketDataContext';

// ── Helpers ───────────────────────────────────────────────────────────────
const fmtPrice = (p) => {
  if (!p && p !== 0) return '—';
  if (p > 1_000_000) return '$' + (p / 1_000_000).toFixed(2) + 'T';
  if (p > 10000) return p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (p > 1)     return p.toFixed(2);
  return p.toFixed(4);
};

const fmtVol = (v) => {
  if (!v) return '—';
  if (v > 1_000_000_000) return '$' + (v / 1_000_000_000).toFixed(2) + 'B';
  if (v > 1_000_000)     return '$' + (v / 1_000_000).toFixed(2) + 'M';
  return '$' + (v / 1000).toFixed(0) + 'K';
};

const fmtPct = (p) => {
  if (p == null) return '—';
  return `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;
};

const UP   = '#00c979';
const DOWN = '#f23645';
const col  = (v) => (v >= 0 ? UP : DOWN);

// ── Mini Sparkline ─────────────────────────────────────────────────────────
function Spark({ data, up }) {
  if (!data?.length) return <div style={{ width: 80, height: 32 }} />;
  const vals = data.map((d) => d.v);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const W = 80, H = 32;
  const pts = vals
    .map((v, i) => `${(i / (vals.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`)
    .join(' ');
  return (
    <svg width={W} height={H}>
      <polyline points={pts} fill="none" stroke={up ? UP : DOWN} strokeWidth={1.5} />
    </svg>
  );
}

// ── Change Badge ───────────────────────────────────────────────────────────
function ChangeBadge({ value }) {
  if (value == null) return <span style={{ color: '#555' }}>—</span>;
  const up = value >= 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '3px 8px', borderRadius: 6,
      background: up ? 'rgba(0,201,121,0.1)' : 'rgba(242,54,69,0.1)',
      color: col(value), fontWeight: 700, fontSize: 13,
    }}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {fmtPct(value)}
    </span>
  );
}

// ── Sortable Table Header ──────────────────────────────────────────────────
function TH({ children, field, sortField, sortDir, onSort, align = 'left' }) {
  const active = sortField === field;
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding: '10px 14px', fontSize: 11, fontWeight: 700,
        letterSpacing: 1, textTransform: 'uppercase',
        color: active ? '#e8f0fe' : '#444',
        textAlign: align, cursor: 'pointer',
        userSelect: 'none', whiteSpace: 'nowrap',
        background: '#0d1117', borderBottom: '1px solid #1e2432',
        transition: 'color 0.15s',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children}
        <ArrowUpDown size={11} style={{ opacity: active ? 1 : 0.3 }} />
      </span>
    </th>
  );
}

// ── Data Table ─────────────────────────────────────────────────────────────
function DataTable({ rows, columns }) {
  const [sortField, setSortField] = useState('changePct');
  const [sortDir, setSortDir]     = useState('desc');
  const [query, setQuery]         = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows
      .filter((r) => !q || r.symbol?.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q))
      .sort((a, b) => {
        const av = a[sortField] ?? 0;
        const bv = b[sortField] ?? 0;
        return sortDir === 'asc' ? av - bv : bv - av;
      });
  }, [rows, query, sortField, sortDir]);

  return (
    <div>
      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px', borderBottom: '1px solid #1e2432',
        background: '#0d1117',
      }}>
        <Search size={15} color="#444" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by symbol or name…"
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: '#e8f0fe', fontSize: 13, flex: 1, fontFamily: 'inherit',
          }}
        />
        <span style={{ fontSize: 12, color: '#444' }}>{filtered.length} results</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <TH field="_idx" sortField={sortField} sortDir={sortDir} onSort={handleSort}>#</TH>
              {columns.map((c) => (
                <TH key={c.field} field={c.field} sortField={sortField} sortDir={sortDir}
                  onSort={handleSort} align={c.align || 'right'}>
                  {c.label}
                </TH>
              ))}
              <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 11, fontWeight: 700,
                letterSpacing: 1, textTransform: 'uppercase', color: '#444',
                background: '#0d1117', borderBottom: '1px solid #1e2432' }}>
                7D Chart
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}
                style={{ cursor: 'pointer', transition: 'background 0.12s', borderBottom: '1px solid #1a1f2e' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#161b22')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 14px', fontSize: 12, color: '#444' }}>{i + 1}</td>
                {columns.map((c) => (
                  <td key={c.field} style={{ padding: '12px 14px', textAlign: c.align || 'right', fontSize: 13 }}>
                    {c.render ? c.render(row[c.field], row) : (
                      <span style={{ color: '#c9d1d9' }}>{row[c.field] ?? '—'}</span>
                    )}
                  </td>
                ))}
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                  <Spark data={row.sparkline} up={row.changePct >= 0} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 2} style={{ padding: '3rem', textAlign: 'center', color: '#444', fontSize: 13 }}>
                No results found.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Column Configs ─────────────────────────────────────────────────────────
const STOCK_COLS = [
  { field: 'symbol', label: 'Symbol', align: 'left',
    render: (v, row) => (
      <div>
        <div style={{ fontWeight: 700, color: '#e8f0fe', fontSize: 14 }}>{v}</div>
        <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>{row.name}</div>
      </div>
    )
  },
  { field: 'price',     label: 'Price',    render: (v) => <span style={{ color: '#e8f0fe', fontWeight: 600 }}>{fmtPrice(v)}</span> },
  { field: 'changePct', label: '24h %',    render: (v) => <ChangeBadge value={v} /> },
  { field: 'change',    label: '24h Chg',  render: (v) => <span style={{ color: col(v), fontWeight: 600 }}>{v >= 0 ? '+' : ''}{v?.toFixed(2)}</span> },
  { field: 'high24h',   label: '24h High', render: (v) => <span style={{ color: '#e8f0fe' }}>{fmtPrice(v)}</span> },
  { field: 'low24h',    label: '24h Low',  render: (v) => <span style={{ color: '#e8f0fe' }}>{fmtPrice(v)}</span> },
  { field: 'volume',    label: 'Volume',   render: (v) => <span style={{ color: '#8b949e' }}>{fmtVol(v)}</span> },
  { field: 'sector',    label: 'Sector',   render: (v) => (
      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4,
        background: 'rgba(0, 90, 255,0.1)', color: '#005AFF', fontWeight: 600 }}>
        {v}
      </span>
    )
  },
];

const CRYPTO_COLS = [
  { field: 'symbol', label: 'Symbol', align: 'left',
    render: (v) => (
      <div style={{ fontWeight: 700, color: '#e8f0fe', fontSize: 14 }}>
        {String(v).replace('USDT', '')}
        <span style={{ fontSize: 11, color: '#444', marginLeft: 4 }}>/USDT</span>
      </div>
    )
  },
  { field: 'price',     label: 'Price',    render: (v) => <span style={{ color: '#e8f0fe', fontWeight: 600 }}>{fmtPrice(v)}</span> },
  { field: 'changePct', label: '24h %',    render: (v) => <ChangeBadge value={v} /> },
  { field: 'high24h',   label: '24h High', render: (v) => <span style={{ color: '#e8f0fe' }}>{fmtPrice(v)}</span> },
  { field: 'low24h',    label: '24h Low',  render: (v) => <span style={{ color: '#e8f0fe' }}>{fmtPrice(v)}</span> },
  { field: 'volume',    label: 'Volume',   render: (v) => <span style={{ color: '#8b949e' }}>{fmtVol(v * 50000)}</span> },
];

const FOREX_COLS = [
  { field: 'symbol', label: 'Pair', align: 'left',
    render: (v, row) => (
      <div>
        <div style={{ fontWeight: 700, color: '#e8f0fe', fontSize: 14 }}>{v}</div>
        <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>{row.name}</div>
      </div>
    )
  },
  { field: 'price',     label: 'Rate',    render: (v) => <span style={{ color: '#e8f0fe', fontWeight: 600 }}>{v?.toFixed(4)}</span> },
  { field: 'changePct', label: '24h %',   render: (v) => <ChangeBadge value={v} /> },
  { field: 'change',    label: '24h Chg', render: (v) => <span style={{ color: col(v) }}>{v >= 0 ? '+' : ''}{v?.toFixed(4)}</span> },
  { field: 'high24h',   label: 'High',    render: (v) => <span style={{ color: '#e8f0fe' }}>{v?.toFixed(4)}</span> },
  { field: 'low24h',    label: 'Low',     render: (v) => <span style={{ color: '#e8f0fe' }}>{v?.toFixed(4)}</span> },
];

const INDEX_COLS = [
  { field: 'symbol', label: 'Index', align: 'left',
    render: (v, row) => (
      <div>
        <div style={{ fontWeight: 700, color: '#e8f0fe', fontSize: 14 }}>{v}</div>
        <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>
          {row.name}
          <span style={{ marginLeft: 6, padding: '1px 5px', borderRadius: 3,
            background: 'rgba(255,255,255,0.05)', color: '#555', fontSize: 10 }}>
            {row.country}
          </span>
        </div>
      </div>
    )
  },
  { field: 'price',     label: 'Level',   render: (v) => <span style={{ color: '#e8f0fe', fontWeight: 600 }}>{fmtPrice(v)}</span> },
  { field: 'changePct', label: '24h %',   render: (v) => <ChangeBadge value={v} /> },
  { field: 'change',    label: '24h Chg', render: (v) => <span style={{ color: col(v) }}>{v >= 0 ? '+' : ''}{v?.toFixed(2)}</span> },
  { field: 'high24h',   label: 'High',    render: (v) => <span style={{ color: '#e8f0fe' }}>{fmtPrice(v)}</span> },
  { field: 'low24h',    label: 'Low',     render: (v) => <span style={{ color: '#e8f0fe' }}>{fmtPrice(v)}</span> },
];

// ── Tab config ─────────────────────────────────────────────────────────────
const TABS = [
  { key: 'stocks',  label: '🇺🇸 US Stocks' },
  { key: 'crypto',  label: '₿ Crypto' },
  { key: 'forex',   label: '💱 Forex' },
  { key: 'indices', label: '📊 Indices' },
];

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MarketsPage() {
  const [activeTab, setActiveTab] = useState('stocks');
  const { stocks, cryptoList, forex, indices } = useMarketData();

  const tableData = {
    stocks:  stocks,
    crypto:  cryptoList,
    forex:   forex,
    indices: indices,
  };

  const tableCols = {
    stocks:  STOCK_COLS,
    crypto:  CRYPTO_COLS,
    forex:   FOREX_COLS,
    indices: INDEX_COLS,
  };

  // Market summary stats
  const allChanges = [...stocks, ...cryptoList].map((r) => r.changePct).filter(Boolean);
  const advancing  = allChanges.filter((c) => c > 0).length;
  const declining  = allChanges.filter((c) => c < 0).length;
  const btc = cryptoList.find((c) => c.symbol === 'BTCUSDT');
  const sp  = stocks.find((s) => s.symbol === 'AAPL');

  return (
    <div style={{ color: '#fff' }}>
      <HomeHeader />
      <style>{`
          @media (max-width: 768px) {
              .mk-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
              .mk-tabs::-webkit-scrollbar { display: none; }
          }
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
            { label: 'Advancing',   value: advancing,    color: UP,   suffix: ' stocks' },
            { label: 'Declining',   value: declining,    color: DOWN, suffix: ' stocks' },
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

        {/* Table card */}
        <div style={{ background: '#0d1117', border: '1px solid #1e2432', borderRadius: 12, overflow: 'hidden' }}>
          {/* Tabs */}
          <div className="mk-tabs" style={{ display: 'flex', borderBottom: '1px solid #1e2432', background: '#0d1117', padding: '0 8px' }}>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
                padding: '14px 18px', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === t.key ? '#005AFF' : 'transparent'}`,
                color: activeTab === t.key ? '#fff' : '#555',
                fontWeight: activeTab === t.key ? 700 : 500,
                fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          <DataTable
            rows={tableData[activeTab] || []}
            columns={tableCols[activeTab] || STOCK_COLS}
          />
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
              padding: '0.65rem 1.5rem', background: '#005AFF', color: '#fff',
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

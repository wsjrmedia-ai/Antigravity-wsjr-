import { useState, Suspense, lazy, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowRight, ChevronRight, ChevronLeft,
  BarChart3, Users, Globe, Newspaper
} from 'lucide-react';
import { useMarketData } from '../context/MarketDataContext';
import HomeHeader from '../components/layout/HomeHeader';
import LearnEarnToggle from '../components/layout/LearnEarnToggle';
import { TickerTape } from 'react-ts-tradingview-widgets';

// ── Lazy loaded heavy components ─────────────────────────────────────────────
const GlobeSection       = lazy(() => import('../components/effects/GlobeSection'));
const FeatureCards3D     = lazy(() => import('../components/effects/FeatureCards3D'));
const MarketSummary      = lazy(() => import('../components/market/MarketSummary'));
const GlobalInflationMap = lazy(() => import('../components/GlobalInflationMap'));
const DNAFlowBackground  = lazy(() => import('../components/effects/DNAFlowBackground'));
const AuroraBackground   = lazy(() => import('../components/effects/AuroraBackground'));

const Fallback = ({ h = 200 }) => <div style={{ minHeight: h }} />;

// ── News Feed ─────────────────────────────────────────────────────────────────
const NEWS = [
  { time: '2h ago',  tag: 'Crypto',   title: 'Bitcoin consolidates above $64K as institutional demand remains strong' },
  { time: '3h ago',  tag: 'Stocks',   title: 'NVIDIA earnings beat expectations; stock surges in after-hours trading' },
  { time: '5h ago',  tag: 'Macro',    title: 'Fed signals potential rate cut as inflation data softens for third month' },
  { time: '6h ago',  tag: 'Forex',    title: 'USD weakens against major pairs ahead of PCE inflation data release' },
  { time: '8h ago',  tag: 'Stocks',   title: 'S&P 500 touches new all-time high amid strong tech earnings season' },
  { time: '10h ago', tag: 'Crypto',   title: 'Ethereum layer-2 networks record highest monthly transaction volumes' },
  { time: '12h ago', tag: 'Macro',    title: 'Global supply chain pressures ease as freight rates stabilize' },
  { time: '14h ago', tag: 'Forex',    title: 'Euro gains ground on ECB hawkish commentary' },
];
const tagColor = { Crypto: '#f59e0b', Stocks: '#005AFF', Macro: '#7c3aed', Forex: '#10b981' };

function NewsCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const { cryptoPrices, stocks, forex } = useMarketData();

  const getPrice = (tag) => {
    if (tag === 'Crypto') return cryptoPrices['btcusdt']?.price;
    if (tag === 'Stocks') return stocks.find(s => s.symbol === 'NVDA')?.price;
    if (tag === 'Forex') return forex.find(f => f.symbol === 'EUR/USD')?.price;
    return null;
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setIsPaused(true); 
    }
  };

  const longNews = [...NEWS, ...NEWS, ...NEWS, ...NEWS, ...NEWS];

  return (
    <div style={{ position: 'relative', width: '100%', padding: '2rem 0' }}>
      <div className="hide-on-mobile" style={{
        position: 'absolute', top: '50%', left: '2rem', zIndex: 10,
        transform: 'translateY(-50%)',
      }}>
        <button 
          onClick={() => scroll('left')}
          style={{
            width: 48, height: 48, borderRadius: '50%', background: 'rgba(13, 17, 23, 0.8)',
            border: '1px solid rgba(0, 90, 255, 0.3)', color: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.3s', backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#005AFF'; e.currentTarget.style.borderColor = '#005AFF'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13, 17, 23, 0.8)'; e.currentTarget.style.borderColor = 'rgba(0, 90, 255, 0.3)'; }}
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="hide-on-mobile" style={{
        position: 'absolute', top: '50%', right: '2rem', zIndex: 10,
        transform: 'translateY(-50%)',
      }}>
        <button 
          onClick={() => scroll('right')}
          style={{
            width: 48, height: 48, borderRadius: '50%', background: 'rgba(13, 17, 23, 0.8)',
            border: '1px solid rgba(0, 90, 255, 0.3)', color: '#fff', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.3s', backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#005AFF'; e.currentTarget.style.borderColor = '#005AFF'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(13, 17, 23, 0.8)'; e.currentTarget.style.borderColor = 'rgba(0, 90, 255, 0.3)'; }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div 
        ref={carouselRef}
        style={{ 
          overflowX: 'auto', 
          display: 'flex', 
          gap: '1.5rem', 
          padding: '0 2rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >


        <div style={{
          display: 'flex',
          gap: '1.5rem',
          animation: isPaused ? 'none' : 'scrollLeft 60s linear infinite',
          width: 'max-content'
        }}>
          {longNews.map((n, i) => (
            <div key={i} style={{
              width: '320px',
              flexShrink: 0,
              background: 'rgba(13, 17, 23, 0.45)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(30, 36, 50, 0.5)',
              borderRadius: 16,
              padding: '1.25rem',
              position: 'relative',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0, 90, 255, 0.5)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.background = 'rgba(13, 17, 23, 0.8)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(30, 36, 50, 0.5)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'rgba(13, 17, 23, 0.45)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
                    color: tagColor[n.tag] || '#888', padding: '3px 8px', borderRadius: 4,
                    background: `${tagColor[n.tag]}22`,
                  }}>
                    {n.tag}
                  </span>
                  <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>{n.time}</span>
                </div>
                {getPrice(n.tag) && (
                  <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--brand-green)' }}>
                    ${getPrice(n.tag)?.toLocaleString()}
                  </div>
                )}
              </div>
              <h4 style={{ fontSize: '1.05rem', color: '#e8f0fe', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                {n.title}
              </h4>
              
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: 11, color: '#444' }}>Read coverage</span>
                 <ChevronRight size={14} color="#005AFF" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [search, setSearch] = useState('');

  return (
    <div style={{ color: '#fff', overflowX: 'hidden', background: '#03050e', position: 'relative' }}>
      <HomeHeader />

      {/* ── Hero ── */}
      <section className="hp-hero responsive-padding" style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', padding: '110px 2rem 4rem',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse 60% 50% at 20% 25%, rgba(0,90,255,0.28) 0%, transparent 60%),
          radial-gradient(ellipse 55% 45% at 80% 75%, rgba(57,181,74,0.22) 0%, transparent 60%),
          radial-gradient(ellipse 40% 35% at 50% 50%, rgba(119,166,255,0.08) 0%, transparent 70%),
          #03050e
        `,
        position: 'relative', zIndex: 2
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(3,5,14,0.55) 70%, #03050e 100%)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 20,
                border: '1px solid rgba(0, 90, 255,0.3)',
                background: 'rgba(0, 90, 255,0.08)',
                fontSize: 13, color: '#005AFF', fontWeight: 600, marginBottom: '1.5rem',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#005AFF',
                boxShadow: '0 0 8px #005AFF', display: 'inline-block' }} />
              Real-time data.
            </motion.div>
            <LearnEarnToggle />
            <motion.h1
              className="font-primary"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '1.5rem' }}
            >
              TopStocX:<br />
              <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your edge at the summit.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{ fontSize: 18, color: '#8b949e', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}
            >
              Timeless thinking. Real-time data. For those who do not compromise being at the top.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="hp-search-bar"
              style={{ display: 'flex', alignItems: 'center', background: '#161b22', border: '1px solid #30363d', borderRadius: 10, overflow: 'hidden', maxWidth: 540, margin: '0 auto 3rem' }}
            >
              <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }}><Search size={18} color="#555" /></div>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search symbols — AAPL, BTC, EUR/USD…"
                style={{ flex: 1, padding: '14px 0', background: 'none', border: 'none', outline: 'none', color: '#e8f0fe', fontSize: 15, fontFamily: 'inherit' }}
              />
              <Link to="/chart" style={{ padding: '14px 22px', background: 'var(--primary-gradient)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>Search</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="hp-cta-buttons flex-stack-mobile"
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link to="/chart" style={{ padding: '0.75rem 2rem', background: 'var(--primary-gradient)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                Open Chart <ArrowRight size={16} />
              </Link>
              <Link to="/copy-trade" style={{ padding: '0.75rem 2rem', border: '1px solid #30363d', color: '#e8f0fe', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                Copy Trading <Users size={16} />
              </Link>
            </motion.div>
          </div>
        </section>

      <div style={{ background: '#131722', borderBottom: '1px solid rgba(255,255,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <TickerTape 
              colorTheme="dark" 
              displayMode="adaptive"
              symbols={[
                { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
                { proName: "FOREXCOM:NSXUSD", title: "US 100" },
                { proName: "FX_IDC:EURUSD", title: "EUR / USD" },
                { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
                { proName: "BITSTAMP:ETHUSD", title: "Ethereum" }
              ]}
          />
      </div>

      {/* ── Market Summary (brand aurora block) ── */}
      <Suspense fallback={<Fallback h={800} />}>
        <AuroraBackground style={{ padding: '4rem 0 3rem' }}>
          <section
            className="responsive-padding"
            style={{
              maxWidth: 1400,
              margin: '0 auto',
              padding: '0 2rem',
              position: 'relative',
              zIndex: 10,
            }}
          >
            <Suspense fallback={<Fallback h={600} />}>
              <MarketSummary />
            </Suspense>
          </section>
        </AuroraBackground>
      </Suspense>

      {/* ── Global Markets & Intelligence ── */}
      {/* ── Global Markets & Intelligence ── */}
      <section className="responsive-padding" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem 4rem' }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, margin: '0 0 8px', letterSpacing: '-1.5px' }}>
            International <span style={{ color: '#005AFF' }}>Market Intelligence</span>
          </h2>
          <p style={{ color: '#555', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
            Visualize global stock performance, inflation, and GDP growth in real-time across the world’s major economies.
          </p>
        </div>
        <Suspense fallback={<Fallback h={600} />}>
          <GlobalInflationMap />
        </Suspense>
      </section>

      {/* ── Globe Section ── */}
      <Suspense fallback={<Fallback h={700} />}>
        <GlobeSection />
      </Suspense>

      {/* ── Features — 3D Cards ── */}
      <section className="responsive-padding" style={{
        background: 'rgba(8, 11, 18, 0.6)',
        borderTop: '1px solid rgba(30, 36, 50, 0.8)',
        padding: '6rem 2rem',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 16px', borderRadius: 20,
              border: '1px solid rgba(0, 90, 255,0.3)',
              background: 'rgba(0, 90, 255,0.08)',
              fontSize: 12, color: '#005AFF', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '1.2rem',
            }}>
              ⚡ Platform Features
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-1px' }}>
              Everything you need to trade
            </h2>
            <p style={{ color: '#555', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
              Professional tools built for serious traders, accessible to everyone.
            </p>
          </motion.div>

          <Suspense fallback={<Fallback h={400} />}>
            <FeatureCards3D />
          </Suspense>
        </div>
      </section>

      {/* ── News — INFINITE CAROUSEL WITH CONTROLS ── */}
      <section style={{ padding: '6rem 0' }}>
        <div className="responsive-padding" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px' }}>Latest News</h2>
          <p style={{ color: '#555', margin: 0, fontSize: 14 }}>Breaking financial news and market analysis — scrolls to left</p>
        </div>
        <NewsCarousel />
      </section>

      {/* ── Footnotes / Quick Links ── */}
      <section className="responsive-padding" style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem 6rem' }}>
         <div style={{ background: 'rgba(13, 17, 23, 0.45)', border: '1px solid rgba(30, 36, 50, 0.5)', borderRadius: 16, padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem', fontSize: 18, fontWeight: 700, color: '#e8f0fe' }}>Quick Access</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Open Advanced Chart', to: '/chart',       color: '#005AFF', icon: <BarChart3 size={18} /> },
                { label: 'Copy Elite Traders',  to: '/copy-trade',  color: '#00c979', icon: <Users size={18} /> },
                { label: 'Browse Markets',       to: '/markets',     color: '#f59e0b', icon: <Globe size={18} /> },
                { label: 'Trade Ideas Feed',     to: '/trade-ideas', color: '#7c3aed', icon: <Newspaper size={18} /> },
              ].map(({ label, to, color: c, icon }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 12, textDecoration: 'none',
                  color: '#c9d1d9', fontSize: 15, fontWeight: 600,
                  transition: 'all 0.15s', border: '1px solid rgba(255,255,255,0.03)',
                  background: 'rgba(255,255,255,0.01)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; e.currentTarget.style.color = '#c9d1d9'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'; }}
                >
                  <span style={{ color: c }}>{icon}</span>
                  {label}
                  <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.3 }} />
                </Link>
              ))}
            </div>
         </div>
      </section>

      {/* ── CTA ── */}
      <section className="responsive-padding" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, margin: '0 0 1rem' }}>
              Start trading smarter today.
            </h2>
            <p style={{ color: '#555', fontSize: 16, marginBottom: '2.5rem', lineHeight: 1.7 }}>
              Join millions of traders using TopStocX to analyse markets,
              execute trades, and grow their portfolios.
            </p>
            <div className="flex-stack-mobile" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" style={{
                padding: '0.9rem 2.5rem', background: 'var(--primary-gradient)', color: '#fff',
                borderRadius: 8, textDecoration: 'none', fontSize: 16, fontWeight: 800, transition: 'all 0.2s',
              }}>
                Sign in — it's free
              </Link>
              <Link to="/chart" style={{
                padding: '0.9rem 2.5rem', border: '1px solid #30363d', color: '#e8f0fe',
                borderRadius: 8, textDecoration: 'none', fontSize: 16, fontWeight: 700, transition: 'all 0.2s',
              }}>
                View live charts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="responsive-padding" style={{ background: 'rgba(13, 17, 23, 0.45)', borderTop: '1px solid rgba(30,36,50,0.5)', padding: '3rem 2rem', color: '#555' }}>
        <div className="responsive-grid-4" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
          {[
            { heading: 'Products',  links: ['Supercharts', 'Copy Trade', 'Screener', 'Market Data'] },
            { heading: 'Company',   links: ['About', 'Careers', 'Blog', 'Press'] },
            { heading: 'Community', links: ['Trade Ideas', 'Chat', 'Indicators', 'Scripts'] },
            { heading: 'Legal',     links: ['Privacy Policy', 'Terms of Use', 'Risk Disclosure', 'Cookie Policy'] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#8b949e', marginBottom: 12 }}>
                {col.heading}
              </div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 13, marginBottom: 8, cursor: 'pointer', transition: 'color 0.15s' }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex-stack-mobile mobile-text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
          <span>TOP<span style={{ color: '#005AFF' }}>STOCX</span> — © 2024 TopStocX Ltd. All rights reserved.</span>
          <span>Wall Street Jr. Academy Platform</span>
        </div>
      </footer>
    </div>
  );
}

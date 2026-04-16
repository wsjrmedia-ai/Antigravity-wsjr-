import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, TrendingUp, Shield, Zap, Info, ArrowUpRight, Copy, CheckCircle } from 'lucide-react';
import HomeHeader from '../components/layout/HomeHeader';
import { TRADERS } from '../data/traders';

// Components for the Traders List
const TraderCard = ({ trader, isFollowing, onToggle }) => {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            style={{
                background: '#161b22',
                border: `1px solid ${isFollowing ? trader.accentColor + '55' : '#30363d'}`,
                borderRadius: 20,
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {isFollowing && (
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 12px', background: trader.accentColor, color: '#000', fontSize: '10px', fontWeight: 900, borderRadius: '0 0 0 8px' }}>
                    COPYING
                </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                    width: 54, height: 54, borderRadius: '50%', 
                    background: `linear-gradient(135deg, ${trader.accentColor}, ${trader.accentColor}44)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', fontWeight: 900, color: '#fff',
                    border: `2px solid ${trader.accentColor}33`
                }}>
                    {trader.initials}
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{trader.name} {trader.badge}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#8b949e' }}>{trader.tag}</p>
                </div>
            </div>

            <p style={{ margin: 0, fontSize: '14px', color: '#c9d1d9', lineHeight: 1.5, height: '42px', overflow: 'hidden' }}>
                {trader.bio}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#0d1117', padding: '8px', borderRadius: 12, border: '1px solid #30363d' }}>
                    <div style={{ fontSize: '10px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: 1 }}>Return</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#00f5a0' }}>+{trader.returnThisMonth}%</div>
                </div>
                <div style={{ background: '#0d1117', padding: '8px', borderRadius: 12, border: '1px solid #30363d' }}>
                    <div style={{ fontSize: '10px', color: '#8b949e', textTransform: 'uppercase', letterSpacing: 1 }}>Win Rate</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: trader.winRate > 70 ? '#00f5a0' : '#f59e0b' }}>{trader.winRate}%</div>
                </div>
            </div>

            <button 
                onClick={() => onToggle(trader.id)}
                style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: 12,
                    border: 'none',
                    background: isFollowing ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${trader.accentColor}, ${trader.accentColor}cc)`,
                    color: isFollowing ? trader.accentColor : '#000',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.2s'
                }}
            >
                {isFollowing ? <><CheckCircle size={16}/> Stop Copying</> : <><Copy size={16}/> Copy Trader</>}
            </button>
        </motion.div>
    );
};

// Main Page Component
export default function CopyTradePage() {
    const [followed, setFollowed] = useState([]);
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    // Toggle follow status (mock)
    const toggleFollow = (id) => {
        setFollowed(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    // Load mock trades
    useEffect(() => {
        const mockTrades = [
            { id: 1, trader: 'Marcus Chen', type: 'BUY', symbol: 'BTCUSD', price: '64,120.00', time: '2 mins ago', status: 'ACTIVE' },
            { id: 2, trader: 'Dmitri Volkov', type: 'SELL', symbol: 'NVDA', price: '924.50', time: '14 mins ago', status: 'CLOSED' },
            { id: 3, trader: 'Aisha Okonkwo', type: 'BUY', symbol: 'GOLD', price: '2,314.20', time: '45 mins ago', status: 'ACTIVE' },
            { id: 4, trader: 'James Osei', type: 'BUY', symbol: 'ETHUSD', price: '3,180.20', time: '1h ago', status: 'ACTIVE' },
        ];
        
        // Simulate fetch
        setTimeout(() => {
            setTrades(mockTrades);
            setLoading(false);
        }, 1200);
    }, []);

    return (
        <div style={{ backgroundColor: '#0d1117', minHeight: '100vh', color: '#e8f0fe', fontFamily: "'Inter', sans-serif" }}>
            <HomeHeader />
            <style>{`
                @media (max-width: 768px) {
                    .ct-layout { grid-template-columns: 1fr !important; }
                    .ct-live-feed > div { position: static !important; }
                    .ct-trader-grid { grid-template-columns: 1fr !important; }
                    .ct-hero-stats { flex-direction: column !important; gap: 0.75rem !important; align-items: center !important; }
                }
                @media (max-width: 480px) {
                    .ct-main { padding-top: 90px !important; padding-left: 1rem !important; padding-right: 1rem !important; }
                }
            `}</style>

            <main className="ct-main" style={{ paddingTop: '120px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                
                {/* Hero Section */}
                <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, margin: '0 0 1rem', background: 'linear-gradient(to right, #fff, #8b949e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Mirror Elite Performance.
                        </h1>
                        <p style={{ fontSize: '20px', color: '#8b949e', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                            Follow TopStocX verified traders and automatically replicate their high-conviction setups in real-time.
                        </p>
                        
                        <div className="ct-hero-stats" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Users size={20} color="#2962ff" />
                                <span style={{ fontWeight: 600 }}>10,000+ Active Copiers</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Shield size={20} color="#00f5a0" />
                                <span style={{ fontWeight: 600 }}>Verified Returns</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Zap size={20} color="#f59e0b" />
                                <span style={{ fontWeight: 600 }}>Instant Execution</span>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <div className="ct-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>
                    
                    {/* Left Column: Top Traders */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>Verified Master Traders</h2>
                                <p style={{ color: '#8b949e', margin: '4px 0 0' }}>Ranked by risk-adjusted monthly performance.</p>
                            </div>
                            <button style={{ color: '#2962ff', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                                View Methodology <Info size={16} />
                            </button>
                        </div>

                        <div className="ct-trader-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
                            {TRADERS.map(trader => (
                                <TraderCard 
                                    key={trader.id} 
                                    trader={trader} 
                                    isFollowing={followed.includes(trader.id)} 
                                    onToggle={toggleFollow}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Live Feed */}
                    <div className="ct-live-feed">
                        <div style={{ position: 'sticky', top: '100px' }}>
                            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 20, padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00f5a0', boxShadow: '0 0 10px #00f5a0' }}></div>
                                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Live Feed</h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {loading ? (
                                        <div style={{ color: '#8b949e', textAlign: 'center', padding: '2rem' }}>Scanning markets...</div>
                                    ) : (
                                        trades.map(trade => (
                                            <div key={trade.id} style={{ borderLeft: `3px solid ${trade.type === 'BUY' ? '#00f5a0' : '#ff4d6d'}`, paddingLeft: '1rem', position: 'relative' }}>
                                                <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: 4 }}>{trade.time}</div>
                                                <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: 2 }}>
                                                    <span style={{ color: trade.type === 'BUY' ? '#00f5a0' : '#ff4d6d' }}>{trade.type}</span> {trade.symbol} 
                                                </div>
                                                <div style={{ fontSize: '13px', color: '#c9d1d9' }}>
                                                    By <strong>{trade.trader}</strong> at {trade.price}
                                                </div>
                                                <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                                                    <ArrowUpRight size={18} color="#8b949e" />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <button style={{ width: '100%', marginTop: '2rem', padding: '0.9rem', borderRadius: 12, border: '1px solid #30363d', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', background: 'transparent' }}>
                                    Launch Copy-Trade Dashboard
                                </button>
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'linear-gradient(135deg, rgba(8,153,129,0.1), transparent)', border: '1px solid rgba(8,153,129,0.2)', borderRadius: 20 }}>
                                <h4 style={{ margin: '0 0 8px', color: '#00f5a0', fontSize: '15px' }}>TopStocX Guarantee</h4>
                                <p style={{ margin: 0, fontSize: '13px', color: '#8b949e', lineHeight: 1.5 }}>
                                    All performance stats are audited in real-time. Mirror trades are executed within 200ms of the master trader.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import topstocxLogo from '../../assets/topstocx-logo.png';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlan } from '../../context/PlanContext';
import LearnEarnToggle from './LearnEarnToggle';

const HomeHeader = () => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { userPlan, setShowPricing, isPro } = usePlan();

    const navLinks = [
        { name: 'Products', hasDropdown: true },
        { name: 'Markets', href: '/markets' },
        { name: 'Trade Ideas', href: '/trade-ideas' },
        { name: 'Copy Trade', href: '/copy-trade' },
    ];

    return (
        <header style={{
            height: '72px',
            backgroundColor: 'transparent',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            justifyContent: 'space-between'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <Link to="/" style={{
                    textDecoration: 'none',
                    color: '#ffffff',
                    fontSize: '24px',
                    fontWeight: 900,
                    letterSpacing: '1.5px',
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center'
                }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                        <img src={topstocxLogo} alt="TopStocX Logo" style={{ height: '50px', objectFit: 'contain' }} />
                        <span style={{ fontFamily: 'Cygre, sans-serif', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>TOPSTOCX</span>
                    </div>
                </Link>

                <nav className="hide-on-mobile" style={{ display: 'flex', gap: '2rem' }}>
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            style={{ position: 'relative' }}
                            onMouseEnter={() => link.hasDropdown && setIsProductsOpen(true)}
                            onMouseLeave={() => link.hasDropdown && setIsProductsOpen(false)}
                        >
                            <Link
                                to={link.href || '#'}
                                style={{
                                    color: '#d1d4dc',
                                    textDecoration: 'none',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    height: '72px'
                                }}
                            >
                                {link.name}
                                {link.hasDropdown && <ChevronDown size={14} />}
                            </Link>

                            {link.hasDropdown && (
                                <AnimatePresence>
                                    {isProductsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            style={{
                                                position: 'absolute',
                                                top: '72px',
                                                left: 0,
                                                width: '260px',
                                                backgroundColor: '#131722',
                                                border: '1px solid #2a2e39',
                                                borderRadius: '0 0 8px 8px',
                                                padding: '0.5rem',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                            }}
                                        >
                                            {[
                                                { title: 'Supercharts', desc: 'Market data for everyone', to: '/chart' },
                                                { title: 'Indicators & Strategies', desc: 'Powerful technical tools', to: '/indicators' },
                                                { title: 'Education', desc: 'Master the markets', href: 'https://wsjrschool.com/' },
                                                { title: 'Copy Trade', desc: 'Follow top performers', to: '/copy-trade' },
                                                { title: 'Investments', desc: 'WallStreet JR Investments', href: 'https://www.wallstreetjrinvestments.com/' },
                                            ].map((item, idx) => {
                                                const Component = item.href ? "a" : Link;

                                                return (
                                                    <Component
                                                        key={idx}
                                                        {...(item.href ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : { to: item.to })}
                                                        style={{
                                                            display: 'block',
                                                            color: '#fff',
                                                            textDecoration: 'none',
                                                            padding: '0.75rem 1rem',
                                                            borderRadius: '4px',
                                                            fontSize: '14px',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 90, 255, 0.15)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    >
                                                        <div style={{ fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            {item.title} 
                                                            {item.href && <span style={{fontSize: 10, color: '#005AFF', padding: '1px 4px', background: 'rgba(0, 90, 255,0.1)', borderRadius: 4}}>WSJR</span>}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#868993' }}>{item.desc}</div>
                                                    </Component>
                                                )
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 0.8, justifyContent: 'flex-end' }}>

                {/* Upgrade Button */}
                <button
                    id="upgrade-plan-btn"
                    onClick={() => setShowPricing(true)}
                    style={{
                        position: 'relative',
                        padding: '0.5rem 1.2rem',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.5px',
                        fontFamily: 'inherit',
                        transition: 'all 0.25s',
                        background: isPro
                            ? userPlan === 'ultimate'
                                ? 'linear-gradient(90deg, #d4af37, #f9e077, #d4af37)'
                                : 'linear-gradient(90deg, #005AFF, #00d2ff)'
                            : 'rgba(0, 90, 255, 0.12)',
                        color: userPlan === 'ultimate' ? '#0a0800' : '#fff',
                        boxShadow: isPro
                            ? userPlan === 'ultimate'
                                ? '0 0 18px #d4af3755'
                                : '0 0 18px #005AFF55'
                            : 'none',
                        border: isPro ? 'none' : '1px solid #005AFF66',
                    }}
                    onMouseEnter={e => { if (!isPro) { e.currentTarget.style.background = '#005AFF'; e.currentTarget.style.boxShadow = '0 0 18px #005AFF55'; } else { e.currentTarget.style.transform = 'scale(1.04)'; } }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        if (!isPro) { e.currentTarget.style.background = 'rgba(0, 90, 255, 0.12)'; e.currentTarget.style.boxShadow = 'none'; }
                    }}
                >
                    {isPro
                        ? userPlan === 'ultimate' ? '★ ULTIMATE' : '★ PRO'
                        : '⚡ Upgrade'}
                </button>



                <Link to="/login" style={{
                    backgroundColor: '#005AFF',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '4px',
                    fontSize: '15px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e4bd8'}
                >Sign in</Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="show-on-mobile" style={{ marginLeft: 'auto', cursor: 'pointer', zIndex: 1001, alignItems: 'center' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            position: 'absolute',
                            top: '72px',
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(19, 23, 34, 0.98)',
                            backdropFilter: 'blur(20px)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            zIndex: 999
                        }}
                    >
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.href || '#'} style={{ color: '#fff', fontSize: '18px', fontWeight: 600, textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                                {link.name}
                            </Link>
                        ))}
                        <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '0.5rem 0'}} />
                        <button onClick={() => { setIsMobileMenuOpen(false); setShowPricing(true); }} style={{ padding: '1rem', background: '#005AFF', border: 'none', color: '#fff', borderRadius: 8, fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}>
                            {isPro ? '★ Manage Plan' : '⚡ Upgrade'}
                        </button>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '1rem', background: 'transparent', border: '1px solid #30363d', color: '#fff', borderRadius: 8, fontSize: '16px', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default HomeHeader;

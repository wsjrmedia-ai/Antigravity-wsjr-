import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import topstocxLogo from '../../assets/topstocx-logo.png';
import { ChevronDown, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlan } from '../../context/PlanContext';
import LearnEarnToggle from './LearnEarnToggle';

const PRODUCTS_SUBMENU = [
    { title: 'Supercharts',           desc: 'Market data for everyone',   to: '/chart' },
    { title: 'Indicators & Strategies', desc: 'Powerful technical tools', to: '/indicators' },
    { title: 'Education',             desc: 'Master the markets',         href: 'https://wsjrschool.com/' },
    { title: 'Copy Trade',            desc: 'Follow top performers',      to: '/copy-trade' },
    { title: 'Investments',           desc: 'WallStreet JR Investments',  href: 'https://www.wallstreetjrinvestments.com/' },
];

const HomeHeader = () => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
    const { userPlan, setShowPricing, isPro } = usePlan();

    const navLinks = [
        { name: 'Products', hasDropdown: true },
        { name: 'Markets', href: '/markets' },
        { name: 'Trade Ideas', href: '/trade-ideas' },
        { name: 'Copy Trade', href: '/copy-trade' },
    ];

    // Lock the background scroll while the mobile drawer is open so the
    // landing page doesn't scroll behind it.
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const { body, documentElement: html } = document;
        const prev = {
            overflow: body.style.overflow,
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overscroll: html.style.overscrollBehavior,
        };
        const scrollY = window.scrollY || window.pageYOffset || 0;
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        html.style.overscrollBehavior = 'contain';
        return () => {
            body.style.overflow = prev.overflow;
            body.style.position = prev.position;
            body.style.top = prev.top;
            body.style.width = prev.width;
            html.style.overscrollBehavior = prev.overscroll;
            window.scrollTo(0, scrollY);
        };
    }, [isMobileMenuOpen]);

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
                    <div className="ts-logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                        <img src={topstocxLogo} alt="TopStocX Logo" style={{ height: '50px', objectFit: 'contain' }} />
                        <span className="ts-logo-word" style={{ fontFamily: 'Cygre, sans-serif', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>TOPSTOCX</span>
                    </div>
                    <style>{`
                        @media (max-width: 768px) {
                            .ts-logo-word { display: none !important; }
                            .ts-logo-wrap {
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                                margin-top: 0 !important;
                            }
                        }
                    `}</style>
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
                                ? 'linear-gradient(90deg, #005AFF, #39B54A)'
                                : 'linear-gradient(90deg, #005AFF, #77A6FF)'
                            : 'rgba(0, 90, 255, 0.12)',
                        color: '#fff',
                        boxShadow: isPro
                            ? userPlan === 'ultimate'
                                ? '0 0 18px #39B54A66'
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
                    background: 'var(--primary-gradient)',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '0.6rem 1.4rem',
                    borderRadius: '4px',
                    fontSize: '15px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    border: 'none'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-blue)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 90, 255, 0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-gradient)'; e.currentTarget.style.boxShadow = 'none'; }}
                >Sign in</Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="show-on-mobile" style={{ marginLeft: 'auto', cursor: 'pointer', zIndex: 1001, alignItems: 'center' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
            </div>

            {/* Mobile Drawer — rendered via portal to document.body so it
                escapes the <header> stacking context and reliably sits on
                top of the homepage hero, ticker and every other section. */}
            {typeof document !== 'undefined' && createPortal(
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-drawer"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mobile-drawer"
                        style={{
                            position: 'fixed',
                            top: '72px',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: '#0a111d',
                            backgroundImage: 'linear-gradient(180deg,#0b1220 0%,#0a111d 100%)',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            zIndex: 10000,
                            padding: '1.25rem 1.25rem 1.5rem',
                            overflowY: 'auto',
                            overscrollBehavior: 'contain',
                            WebkitOverflowScrolling: 'touch',
                            touchAction: 'pan-y',
                        }}
                    >
                        {navLinks.map((link) => {
                            if (link.hasDropdown) {
                                return (
                                    <div key={link.name} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <button
                                            onClick={() => setIsMobileProductsOpen(o => !o)}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                width: '100%', padding: '0.9rem 0.25rem',
                                                background: 'transparent', border: 'none', cursor: 'pointer',
                                                color: '#fff', fontSize: '17px', fontWeight: 700,
                                                borderBottom: '1px solid rgba(255,255,255,0.04)',
                                                fontFamily: 'inherit',
                                            }}
                                        >
                                            <span>{link.name}</span>
                                            <ChevronDown
                                                size={18}
                                                style={{
                                                    transition: 'transform 0.25s',
                                                    transform: isMobileProductsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    color: '#7a9ab8',
                                                }}
                                            />
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {isMobileProductsOpen && (
                                                <motion.div
                                                    key="products-sub"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.22 }}
                                                    style={{ overflow: 'hidden' }}
                                                >
                                                    <div style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem 0' }}>
                                                        {PRODUCTS_SUBMENU.map((item) => {
                                                            const Tag = item.href ? 'a' : Link;
                                                            const linkProps = item.href
                                                                ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
                                                                : { to: item.to };
                                                            return (
                                                                <Tag
                                                                    key={item.title}
                                                                    {...linkProps}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    style={{
                                                                        display: 'block',
                                                                        padding: '0.7rem 0.9rem',
                                                                        margin: '2px 0',
                                                                        borderRadius: 10,
                                                                        background: 'rgba(255,255,255,0.02)',
                                                                        border: '1px solid rgba(255,255,255,0.04)',
                                                                        textDecoration: 'none',
                                                                        color: '#fff',
                                                                    }}
                                                                >
                                                                    <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                        {item.title}
                                                                        {item.href && <span style={{ fontSize: 9, color: '#005AFF', padding: '1px 5px', background: 'rgba(0,90,255,0.12)', borderRadius: 4, letterSpacing: 0.5 }}>WSJR</span>}
                                                                    </div>
                                                                    <div style={{ fontSize: 12, color: '#7a8a9a', marginTop: 2 }}>{item.desc}</div>
                                                                </Tag>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            }
                            return (
                                <Link
                                    key={link.name}
                                    to={link.href || '#'}
                                    style={{
                                        color: '#fff',
                                        fontSize: '17px',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        padding: '0.9rem 0.25rem',
                                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                                    }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                            <button
                                onClick={() => { setIsMobileMenuOpen(false); setShowPricing(true); }}
                                style={{
                                    padding: '0.95rem', background: 'var(--primary-gradient)', border: 'none',
                                    color: '#fff', borderRadius: 10, fontSize: '15px', fontWeight: 800,
                                    cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.5,
                                }}
                            >
                                {isPro ? '★ Manage Plan' : '⚡ Upgrade'}
                            </button>
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    padding: '0.95rem', background: 'transparent',
                                    border: '1px solid #30363d', color: '#fff', borderRadius: 10,
                                    fontSize: '15px', fontWeight: 700, textAlign: 'center', textDecoration: 'none',
                                }}
                            >
                                Sign In
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body
            )}
        </header>
    );
};

export default HomeHeader;

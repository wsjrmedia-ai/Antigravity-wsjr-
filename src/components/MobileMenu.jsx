import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import LanguageDropdown from './LanguageDropdown';

const MobileMenu = ({ isOpen, onClose }) => {
    // Lock page scroll (native + Lenis) while the menu is open.
    // Uses the position:fixed + preserved scrollY pattern so iOS Safari
    // stops scrolling the page behind when the user drags inside the menu.
    useEffect(() => {
        if (!isOpen) return;
        const body = document.body;
        const html = document.documentElement;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const prev = {
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyWidth: body.style.width,
            bodyOverflow: body.style.overflow,
            htmlOverflow: html.style.overflow,
        };
        window.__lenis?.stop?.();
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';
        html.style.overflow = 'hidden';
        return () => {
            body.style.position = prev.bodyPosition;
            body.style.top = prev.bodyTop;
            body.style.width = prev.bodyWidth;
            body.style.overflow = prev.bodyOverflow;
            html.style.overflow = prev.htmlOverflow;
            window.scrollTo(0, scrollY);
            window.__lenis?.start?.();
        };
    }, [isOpen]);

    return (
        <>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="mobile-menu-panel"
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        width: '100vw',
                        height: '100dvh',
                        backgroundColor: 'var(--bg-primary)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '40px 60px',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {/* Header of Menu */}
                    <div className="mobile-menu-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div className="mobile-menu-lang" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LanguageDropdown variant="menu" />
                        </div>
                        <div onClick={onClose} className="mobile-menu-close" style={{ cursor: 'pointer', padding: '10px', margin: '-10px' }} aria-label="Close menu">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </div>

                    {/* Menu Links */}
                    <nav className="mobile-menu-nav" style={{
                        marginTop: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'flex-start'
                    }}>
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'School of Finance', path: '/school-of-finance' },
                            { name: 'Who We Are', path: '/who-we-are' },
                            { name: 'TopStocX Platform', path: '/topstocx' }
                        ].map((link, idx) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + idx * 0.1 }}
                            >
                                <Link
                                    to={link.path}
                                    onClick={onClose}
                                    className="mobile-menu-link"
                                    style={{
                                        fontFamily: 'var(--font-hero)',
                                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                                        color: '#FFF',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                        display: 'inline-block',
                                        padding: '4px 0'
                                    }}
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
        <style>{`
            /* Tablet / small laptop */
            @media (max-width: 768px) {
                .mobile-menu-panel { padding: 32px 40px !important; }
                .mobile-menu-nav { margin-top: 60px !important; gap: 32px !important; }
                .mobile-menu-link { font-size: clamp(1.8rem, 7vw, 2.6rem) !important; }
            }

            /* Phones */
            @media (max-width: 480px) {
                .mobile-menu-panel { padding: 22px 20px !important; }
                .mobile-menu-nav { margin-top: 40px !important; gap: 24px !important; }
                .mobile-menu-link { font-size: clamp(1.5rem, 7.5vw, 2rem) !important; }
                .mobile-menu-en { font-size: 1.2rem !important; }
                .mobile-menu-close svg { width: 32px !important; height: 32px !important; }
            }

            /* Short viewports (landscape phones, small screens) — keep content from overflowing */
            @media (max-height: 600px) {
                .mobile-menu-nav { margin-top: 30px !important; gap: 18px !important; }
                .mobile-menu-link { font-size: clamp(1.4rem, 5.5vw, 1.8rem) !important; }
            }
        `}</style>
        </>
    );
};

export default MobileMenu;

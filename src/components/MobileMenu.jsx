import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
    return (
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
                        height: '100vh',
                        backgroundColor: 'var(--bg-primary)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '40px 60px'
                    }}
                >
                    {/* Header of Menu */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 500, color: '#FFF' }}>EN</span>
                        </div>
                        <div onClick={onClose} style={{ cursor: 'pointer', padding: '10px' }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </div>

                    {/* Menu Links */}
                    <nav style={{
                        marginTop: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        alignItems: 'center'
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
                                    style={{
                                        fontFamily: 'var(--font-hero)',
                                        fontSize: 'clamp(2rem, 5vw, 4rem)',
                                        color: '#FFF',
                                        textDecoration: 'none',
                                        fontWeight: 500
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
            @media (max-width: 480px) {
                .mobile-menu-panel { padding: 30px 24px !important; }
            }
        `}</style>
    );
};

export default MobileMenu;

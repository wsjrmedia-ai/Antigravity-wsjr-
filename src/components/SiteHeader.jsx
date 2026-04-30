import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LanguageDropdown from './LanguageDropdown';
import MobileMenu from './MobileMenu';

/**
 * SiteHeader
 *
 * Global top nav for all standard layout pages except HomePage (which has
 * its own header baked into HeroSection). Mirrors the hero header's visual
 * language — language dropdown left, monogram center, hamburger right —
 * so navigation feels consistent across routes. Reuses MobileMenu.jsx
 * for the open state.
 */
const SiteHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 5%',
                    zIndex: 1000,
                    background: isScrolled ? 'rgba(10, 10, 10, 0.72)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(14px)' : 'none',
                    WebkitBackdropFilter: isScrolled ? 'blur(14px)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                    transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
                }}
            >
                <div className="site-header-lang">
                    <LanguageDropdown variant="hero" />
                </div>

                <Link
                    to="/"
                    aria-label="Wall Street Jr. Academy — home"
                    className="site-header-monogram-wrap"
                    style={{
                        position: 'absolute',
                        top: '14px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'block',
                    }}
                >
                    <img
                        className="site-header-monogram"
                        src="https://api.builder.io/api/v1/image/assets/TEMP/25031ebb293a7037f1fe8a947d41d183346733f4?width=464"
                        alt="Wall Street Jr. Academy"
                        style={{
                            width: '92px',
                            height: '92px',
                            filter: 'brightness(0) invert(1)',
                            display: 'block',
                        }}
                    />
                </Link>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={isMenuOpen}
                    className="site-header-hamburger"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: '10px',
                        margin: '-10px',
                    }}
                >
                    <div style={{ width: '46px', height: '3px', background: '#FFF', borderRadius: '4px' }} />
                    <div style={{ width: '46px', height: '3px', background: '#FFF', borderRadius: '4px' }} />
                    <div style={{ width: '46px', height: '3px', background: '#FFF', borderRadius: '4px' }} />
                </button>
            </header>

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <style>{`
                @media (max-width: 768px) {
                    .site-header-monogram { width: 72px !important; height: 72px !important; }
                    .site-header-hamburger > div { width: 36px !important; }
                }
                @media (max-width: 480px) {
                    .site-header-monogram { width: 56px !important; height: 56px !important; }
                    .site-header-hamburger > div { width: 30px !important; height: 2.5px !important; }
                }
            `}</style>
        </>
    );
};

export default SiteHeader;

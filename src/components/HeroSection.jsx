import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileMenu from './MobileMenu'
import LearnEarnToggle from './LearnEarnToggle'
import LanguageDropdown from './LanguageDropdown'

const HeroSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()

    return (
        <section className="hero-section" style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'var(--font-body)',
            backgroundColor: '#50000B'
        }}>
            {/* Absolute Background Columns Image */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                <img
                    className="hero-bg-columns"
                    src="https://api.builder.io/api/v1/image/assets/TEMP/bebe67a57cbec3535bac2521d32ecc1ba35224c3?width=4960"
                    alt="Background Columns"
                    style={{
                        position: 'absolute',
                        width: '2480px',
                        height: '1655px',
                        left: '-300px',
                        top: '-245px',
                        opacity: 0.75, // Increased visibility further
                        maxWidth: 'none'
                    }}
                />
            </div>

            {/* 1. Top Header Navigation */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 5%',
                position: 'relative',
                zIndex: 10,
                width: '100%'
            }}>
                {/* Left: Language dropdown */}
                <div className="header-en">
                    <LanguageDropdown variant="hero" />
                </div>

                {/* Center: Monogram - Refined position and size */}
                <div className="academy-monogram-wrap" style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                    <img
                        className="academy-monogram"
                        src="https://api.builder.io/api/v1/image/assets/TEMP/25031ebb293a7037f1fe8a947d41d183346733f4?width=464"
                        alt="Academy Monogram"
                        style={{ width: '130px', height: '130px', filter: 'brightness(0) invert(1)' }}
                    />
                </div>

                {/* Right: Hamburger Menu */}
                <div className="hamburger-menu" onClick={() => setIsMenuOpen(true)} style={{ display: 'flex', flexDirection: 'column', gap: '5px', cursor: 'pointer' }}>
                    <div className="hamburger-bar" style={{ width: '60px', height: '4px', background: '#FFF', borderRadius: '4px' }}></div>
                    <div className="hamburger-bar" style={{ width: '60px', height: '4px', background: '#FFF', borderRadius: '4px' }}></div>
                    <div className="hamburger-bar" style={{ width: '60px', height: '4px', background: '#FFF', borderRadius: '4px' }}></div>
                </div>
            </header>

            {/* 2. Main Content Section */}
            <div className="main-content-wrapper" style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1865px',
                margin: '0 auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 8%',
                marginTop: '60px' // Create space for the logo
            }}>
                
                {/* Earn Toggle - Routes to TopStocX */}
                <LearnEarnToggle />

                {/* Trust Line — visible above the fold */}
                <div className="hero-trust-line" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '14px',
                    flexWrap: 'wrap',
                    marginTop: '14px',
                    marginBottom: '8px',
                    padding: '0 8%',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.72rem, 1vw, 0.85rem)',
                    color: 'rgba(255,255,255,0.78)',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontWeight: 500
                }}>
                    <span style={{ color: '#F7AC41', fontWeight: 600 }}>5,000+ learners</span>
                    <span aria-hidden style={{ color: 'rgba(247,172,65,0.5)' }}>•</span>
                    <span>Global presence</span>
                    <span aria-hidden style={{ color: 'rgba(247,172,65,0.5)' }}>•</span>
                    <span>Real-world frameworks</span>
                </div>

                {/* Main Title */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-hero)', /* Libre Baskerville */
                        fontSize: 'clamp(2.5rem, 6vw, 96px)',
                        fontWeight: 500,
                        margin: 0,
                        paddingBottom: '20px', /* Fix WebkitBackgroundClip descender cutoff bug */
                        background: 'linear-gradient(101deg, #F7AC41 8.57%, #BC7E26 48.6%, #FFBD5F 85.66%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textAlign: 'center',
                        lineHeight: 1.2, /* Slightly increased to prevent clipping bounds */
                        letterSpacing: '-0.07em' /* -7% letter spacing */
                    }}>
                        WallStreet Jr. Academy
                    </h1>
                </div>

                {/* Content Structure */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '100%', margin: '0 auto' }}>
                    
                    {/* Top Row: Left Text, Center Button, Right Empty (3D Reserve) */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                        alignItems: 'center',
                        gap: '30px',
                        width: '100%'
                    }} className="hero-content-grid">
                        
                        {/* 1. Left: Subtitle H2 */}
                        <div className="hero-subtitle-wrap" style={{ paddingRight: '20px' }}>
                            <h2 className="hero-subtitle" style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 'clamp(1.5rem, 2.2vw, 34px)',
                                lineHeight: '1.25',
                                letterSpacing: '-0.3px',
                                margin: 0,
                                fontWeight: 400,
                                color: '#FFF'
                            }}>
                                <span style={{ fontFamily: 'var(--font-hero)', color: '#CC972B', fontStyle: 'italic', fontWeight: 600 }}>Dubai’s </span>
                                first <span style={{ fontFamily: 'var(--font-hero)', color: '#CC972B', fontStyle: 'italic', fontWeight: 600 }}>multidisciplinary </span>
                                <br />
                                <span style={{ fontFamily: 'var(--font-hero)', color: '#CC972B', fontStyle: 'italic', fontWeight: 600 }}>academy </span>
                                for finance, technology, design <br />
                                and management.
                            </h2>
                        </div>

                        {/* 2. Center: Enroll + Find Your Programme CTAs */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '14px'
                        }} className="enroll-button-container">
                            <motion.button
                                onClick={() => navigate('/enroll')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    display: 'flex',
                                    width: '220px',
                                    height: '55px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '12px',
                                    borderRadius: '100px',
                                    background: '#6A0715',
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                }}
                            >
                                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '18px', color: '#FFF' }}>ENROLL NOW</span>
                                <svg width="22" height="22" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.0947 0C23.4312 8.14387e-05 30.1894 6.75827 30.1895 15.0947C30.1894 23.4311 23.4311 30.1894 15.0947 30.1895C6.75827 30.1894 8.14334e-05 23.4312 0 15.0947C2.23237e-05 6.75823 6.75823 2.23252e-05 15.0947 0ZM15.0947 1.4375C7.55219 1.43752 1.43752 7.55219 1.4375 15.0947C1.43758 22.6372 7.55222 28.7519 15.0947 28.752C22.6372 28.7519 28.7519 22.6372 28.752 15.0947C28.7519 7.55222 22.6372 1.43758 15.0947 1.4375ZM21.5645 19.0449H20.127V11.0791L9.85254 21.3535L9.34473 20.8457L8.83691 20.3369L19.1104 10.0635H11.1455V8.62598H21.5645V19.0449Z" fill="white"/>
                                </svg>
                            </motion.button>
                            <motion.button
                                onClick={() => navigate('/programmes')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="find-programme-btn"
                                style={{
                                    display: 'flex',
                                    width: '220px',
                                    height: '48px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px',
                                    borderRadius: '100px',
                                    background: 'transparent',
                                    border: '1px solid rgba(247,172,65,0.6)',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '15px', color: '#F7AC41', letterSpacing: '0.3px' }}>FIND YOUR PROGRAMME</span>
                            </motion.button>
                        </div>

                        {/* 3. Right: Reserved Empty Space for 3D Element (1fr width matches exactly the left column width) */}
                        <div className="reserved-3d-space"></div>
                    </div>

                    {/* Bottom: Paragraphs strictly matching the Left 1fr column width */}
                    <div className="hero-paragraphs" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: '1.4',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        width: 'calc(50% - 140px)', /* A calculated match for the roughly 1fr space when button is 220px in center */
                        paddingRight: '20px'
                    }}>
                        <p style={{ margin: 0 }}>Four schools. One integrated institution. Part of a broader ecosystem shaped by leadership with experience across global financial institutions and technology systems.</p>
                        <p style={{ margin: 0 }}>Preparing you to think, interpret, and act with clarity in real-world environments.</p>
                    </div>

                </div>
            </div>

            {/* 3. Bottom Locked Action Buttons - Slimmed Down */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ 
                    background: '#50000B', 
                    width: '100%', 
                    borderTop: '0.5px solid rgba(255,255,255,0.4)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {/* Link 1 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '10px 0',
                        cursor: 'pointer'
                    }} className="hover-brightness">
                        <div style={{ 
                            width: '90%',
                            maxWidth: '1200px',
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                        }}>
                            <span className="explore-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'min(1.8vw, 24px)', fontWeight: 500, color: '#FFF', letterSpacing: '-0.5px' }}>
                                EXPLORE THE ACADEMY
                            </span>
                            <svg className="explore-arrow" width="min(30vw, 300px)" viewBox="0 0 381 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="0" y1="7" x2="380" y2="7" stroke="white" strokeWidth="1" />
                                <path d="M374 3 L380 7 L374 11" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                        </div>
                    </div>

                    <div style={{ width: '100%', borderTop: '0.5px solid rgba(255,255,255,0.4)' }}></div>

                    {/* Link 2 */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '10px 0',
                        cursor: 'pointer'
                    }} className="hover-brightness">
                        <div style={{ 
                            width: '90%',
                            maxWidth: '1200px',
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center'
                        }}>
                            <span className="explore-text" style={{ fontFamily: 'var(--font-body)', fontSize: 'min(1.8vw, 24px)', fontWeight: 500, color: '#FFF', letterSpacing: '-0.5px' }}>
                                VIEW OUR SCHOOLS
                            </span>
                            <svg className="explore-arrow" width="min(30vw, 300px)" viewBox="0 0 381 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="0" y1="7" x2="380" y2="7" stroke="white" strokeWidth="1" />
                                <path d="M374 3 L380 7 L374 11" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <style>{`
                .hover-brightness { transition: background-color 0.2s ease; }
                .hover-brightness:hover { background-color: #6A0715; }
                
                @media (max-width: 1200px) {
                    .hero-content-grid { grid-template-columns: 1fr !important; gap: 30px !important; }
                    .enroll-button-container { justify-content: center !important; }
                    .reserved-3d-space { display: none !important; }
                    .hero-paragraphs { 
                        display: flex !important; 
                        width: 100% !important; 
                        padding-right: 0 !important; 
                        align-items: center !important; 
                    }
                    .hero-paragraphs p { text-align: center !important; max-width: 80% !important; }
                }

                @media (max-width: 768px) {
                    /* Let the hero grow past the viewport so all content (incl. bottom links) is reachable */
                    .hero-section {
                        height: auto !important;
                        min-height: 100vh !important;
                        overflow: visible !important;
                    }

                    /* Subtitle: shrink so "multidisciplinary" fits the line, allow soft hyphen wrap */
                    .hero-subtitle-wrap { padding-right: 0 !important; }
                    .hero-subtitle {
                        font-size: clamp(1.1rem, 4.6vw, 1.5rem) !important;
                        text-align: center !important;
                        line-height: 1.3 !important;
                        word-break: normal !important;
                        hyphens: auto !important;
                        -webkit-hyphens: auto !important;
                    }
                    .hero-subtitle br { display: none !important; }

                    /* Main Page Spacing */
                    .main-content-wrapper { padding: 0 5% !important; margin-top: 30px !important; padding-bottom: 30px !important; }

                    /* Title adjustment */
                    h1 { font-size: clamp(2rem, 10vw, 3rem) !important; margin-bottom: 20px !important; }

                    /* Learn/Earn toggle spacing on phones (keep native 260px width so the internal slider + labels line up) */
                    .earn-toggle-container { margin-bottom: 15px !important; }

                    /* Header adjustments — logo centered, hamburger on the right, tight to the top */
                    header { padding: 6px 5% !important; min-height: 84px !important; align-items: center !important; }
                    .header-en { display: none !important; } /* Hide EN to free up space */
                    .academy-monogram-wrap {
                        position: absolute !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%) !important;
                    }
                    .academy-monogram { width: 76px !important; height: 76px !important; }

                    /* Hamburger shrink for mobile */
                    .hamburger-menu { gap: 4px !important; margin-left: auto !important; }
                    .hamburger-bar { width: 28px !important; height: 3px !important; }

                    /* Subtitle Adjustment */
                    h2 { font-size: clamp(1.2rem, 5vw, 1.5rem) !important; text-align: center !important; }
                    .hero-content-grid { text-align: center !important; }

                    /* Hero Paragraphs */
                    .hero-paragraphs { padding: 0 10px !important; }
                    .hero-paragraphs p { max-width: 100% !important; font-size: 14px !important; }

                    /* Bottom Actions */
                    .explore-text { font-size: 14px !important; }
                    .explore-arrow { width: 80px !important; }
                }

                @media (max-width: 768px) {
                    .hero-trust-line {
                        gap: 8px !important;
                        font-size: 0.62rem !important;
                        letter-spacing: 0.14em !important;
                        padding: 0 4% !important;
                        margin-top: 10px !important;
                    }
                }

                @media (max-width: 480px) {
                    .main-content-wrapper { padding: 0 4% !important; margin-top: 20px !important; }
                    .enroll-button-container button { width: 180px !important; height: 48px !important; }
                    .hero-paragraphs { display: none !important; } /* Hide long text on very small screens */
                    .hero-trust-line { font-size: 0.55rem !important; gap: 6px !important; }
                }

                @media (max-width: 768px) {
                    .hero-bg-columns {
                        width: 220vw !important;
                        height: auto !important;
                        left: -60vw !important;
                        top: -10vh !important;
                        opacity: 0.35 !important;
                    }
                    .explore-text { font-size: 13px !important; letter-spacing: 0 !important; }
                    .explore-arrow { width: 60px !important; }
                }
            `}</style>
        </section>
    )
}

export default HeroSection

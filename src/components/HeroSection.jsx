import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MobileMenu from './MobileMenu'
import LearnEarnToggle from './LearnEarnToggle'

const HeroSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const navigate = useNavigate()

    return (
        <section style={{
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

            {/* Huge Watermark background */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 1,
                opacity: 0.4
            }}>
                <img 
                    src="https://api.builder.io/api/v1/image/assets/TEMP/a0aec7389b59c267fe9e6cb147a75e605ac97963?width=1760" 
                    alt="Background Crest"
                    style={{ width: 'min(70vh, 750px)', height: 'min(70vh, 750px)' }}
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
                {/* Left: EN / Globe */}
                <div className="header-en" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="24" height="24" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.0277 3.00565C13.4518 3.00565 10.9338 3.76948 8.79207 5.20055C6.65032 6.63162 4.98103 8.66565 3.99529 11.0454C3.00955 13.4252 2.75164 16.0439 3.25416 18.5702C3.75669 21.0966 4.99708 23.4172 6.81849 25.2386C8.6399 27.06 10.9605 28.3004 13.4869 28.803C16.0132 29.3055 18.6319 29.0476 21.0117 28.0618C23.3915 27.0761 25.4255 25.4068 26.8566 23.265C28.2876 21.1233 29.0515 18.6053 29.0515 16.0294C29.0475 12.5765 27.6741 9.26618 25.2325 6.82461C22.7909 4.38304 19.4806 3.00962 16.0277 3.00565ZM27.0478 16.0294C27.0487 17.0457 26.9083 18.0572 26.6308 19.0349H21.8082C22.1155 17.043 22.1155 15.0158 21.8082 13.0239H26.6308C26.9083 14.0016 27.0487 15.0131 27.0478 16.0294ZM12.7717 21.0386H19.2836C18.6421 23.1406 17.5284 25.0682 16.0277 26.6739C14.5275 25.0678 13.4139 23.1404 12.7717 21.0386ZM12.2834 19.0349C11.9394 17.046 11.9394 15.0128 12.2834 13.0239H19.782C20.126 15.0128 20.126 17.046 19.782 19.0349H12.2834ZM5.00757 16.0294C5.0067 15.0131 5.14704 14.0016 5.42458 13.0239H10.2471C9.9399 15.0158 9.9399 17.043 10.2471 19.0349H5.42458C5.14704 18.0572 5.0067 17.0457 5.00757 16.0294ZM19.2836 11.0203H12.7717C13.4133 8.9182 14.527 6.99065 16.0277 5.38499C17.5278 6.99107 18.6414 8.91849 19.2836 11.0203ZM25.8368 11.0203H21.3762C20.814 8.95765 19.8665 7.02007 18.5836 5.30985C20.1336 5.68219 21.5847 6.38529 22.8375 7.37094C24.0903 8.35658 25.1152 9.60148 25.8419 11.0203H25.8368ZM13.4718 5.30985C12.1889 7.02007 11.2414 8.95765 10.6792 11.0203H6.21352C6.94019 9.60148 7.96505 8.35658 9.21787 7.37094C10.4707 6.38529 11.9218 5.68219 13.4718 5.30985ZM6.21352 21.0386H10.6792C11.2414 23.1012 12.1889 25.0388 13.4718 26.749C11.9218 26.3767 10.4707 25.6736 9.21787 24.6879C7.96505 23.7023 6.94019 22.4574 6.21352 21.0386ZM18.5836 26.749C19.8665 25.0388 20.814 23.1012 21.3762 21.0386H25.8419C25.1152 22.4574 24.0903 23.7023 22.8375 24.6879C21.5847 25.6736 20.1336 26.3767 18.5836 26.749Z" fill="white"/>
                    </svg>
                    <span style={{ fontSize: '20px', fontWeight: 500, fontFamily: 'var(--font-hero)', color: '#FFF' }}>EN</span>
                </div>

                {/* Center: Monogram - Refined position and size */}
                <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}>
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
                        <div style={{ paddingRight: '20px' }}>
                            <h2 style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 'clamp(1.5rem, 2.2vw, 34px)',
                                lineHeight: '1.25',
                                letterSpacing: '-0.3px',
                                margin: 0,
                                fontWeight: 400,
                                color: '#FFF'
                            }}>
                                <span style={{ fontFamily: 'var(--font-hero)', color: '#CC972B', fontStyle: 'italic', fontWeight: 600 }}>Dubai’s </span>
                                premier <span style={{ fontFamily: 'var(--font-hero)', color: '#CC972B', fontStyle: 'italic', fontWeight: 600 }}>multidisciplinary </span>
                                <br />
                                <span style={{ fontFamily: 'var(--font-hero)', color: '#CC972B', fontStyle: 'italic', fontWeight: 600 }}>academy </span>
                                for finance, technology, design <br />
                                & management.
                            </h2>
                        </div>

                        {/* 2. Center: Enroll Button Dead-Center on the page */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
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
                        </div>

                        {/* 3. Right: Reserved Empty Space for 3D Element (1fr width matches exactly the left column width) */}
                        <div className="reserved-3d-space"></div>
                    </div>

                    {/* Bottom: Paragraphs strictly matching the Left 1fr column width */}
                    <div className="hero-paragraphs" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(10px, 0.8vw, 12px)',
                        fontWeight: 400,
                        color: 'rgba(255,255,255,0.9)',
                        lineHeight: '1.4',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        width: 'calc(50% - 140px)', /* A calculated match for the roughly 1fr space when button is 220px in center */
                        paddingRight: '20px'
                    }}>
                        <p style={{ margin: 0 }}>Most finance courses teach you theory. We teach you how to think like an institutional investor, allocate capital with discipline, and lead with the kind of judgment that top firms actually value.</p>
                        <p style={{ margin: 0 }}>At Wall Street Jr. Academy, we have built a multidisciplinary learning environment in the heart of Dubai — one that prepares students not just for their first role, but for a career defined by long-term impact. Whether your interest lies in markets and valuation, software and AI, design thinking, or organizational leadership, our specialized schools offer a structured path to real mastery.</p>
                        <p style={{ margin: 0 }}>This is not a weekend workshop or a certification factory. It is a serious institution for people who are serious about building something lasting.</p>
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
                    /* Main Page Spacing */
                    .main-content-wrapper { padding: 0 5% !important; margin-top: 30px !important; }

                    /* Title adjustment */
                    h1 { font-size: clamp(2rem, 10vw, 3rem) !important; margin-bottom: 20px !important; }

                    /* "Earn" Toggle sizing for phones */
                    .earn-toggle-container { width: 170px !important; height: 40px !important; margin-bottom: 15px !important; }
                    .earn-toggle-container .toggle-thumb { width: 33px !important; height: 33px !important; }
                    .earn-toggle-container .toggle-text { font-size: 20px !important; right: 20px !important; }

                    /* Header adjustments */
                    header { padding: 15px 5% !important; }
                    .header-en { display: none !important; } /* Hide EN to free up space */
                    .academy-monogram { width: 90px !important; height: 90px !important; top: 10px !important; }

                    /* Hamburger shrink for mobile */
                    .hamburger-bar { width: 28px !important; height: 3px !important; }
                    .hamburger-menu { gap: 4px !important; }

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

                @media (max-width: 480px) {
                    .main-content-wrapper { padding: 0 4% !important; margin-top: 20px !important; }
                    .enroll-button-container button { width: 180px !important; height: 48px !important; }
                    .hero-paragraphs { display: none !important; } /* Hide long text on very small screens */
                }
            `}</style>
        </section>
    )
}

export default HeroSection

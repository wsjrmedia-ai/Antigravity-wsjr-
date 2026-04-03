import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const headerRef = useRef(null)
    const logoRef = useRef(null)
    const navRef = useRef(null)
    const mobileMenuRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(logoRef.current, {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })

            gsap.from(".nav-link", {
                y: -20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.3
            })
        }, headerRef)

        return () => ctx.revert()
    }, [])

    useEffect(() => {
        if (isMenuOpen) {
            gsap.to(mobileMenuRef.current, {
                x: 0,
                duration: 0.5,
                ease: 'power3.out'
            })
            document.body.style.overflow = 'hidden'
        } else {
            gsap.to(mobileMenuRef.current, {
                x: '100%',
                duration: 0.5,
                ease: 'power3.in'
            })
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Who We Are', href: '/who-we-are' },
        {
            label: 'Products',
            href: '#products',
            dropdown: [
                { label: 'TopStocX Platform', href: '/topstocx' },
                { label: 'Copy Trade', href: '/topstocx?view=copytrade' },
            ]
        },
        {
            label: 'Organisations',
            href: '#organisations',
            dropdown: [
                { label: 'Wall Street Investments', href: 'https://www.wallstreetjrinvestments.com/', external: true }
            ]
        },
        { label: 'Syllabus', href: '/school-of-finance/syllabus' },
    ]

    // Magnetic Hover Effect
    const handleMouseEnter = (e) => {
        const target = e.target;
        gsap.to(target, {
            scale: 1.1,
            color: '#d4af37',
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    };

    const handleMouseLeave = (e) => {
        const target = e.target;
        gsap.to(target, {
            scale: 1,
            color: '#ffffff',
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    const handleMouseMove = (e) => {
        const target = e.target;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(target, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    };

    return (
        <header ref={headerRef} style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '98%',
            maxWidth: '1600px',
            height: isScrolled ? '70px' : '90px',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            zIndex: 1000,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            color: '#ffffff',
        }} className={isScrolled ? 'glass-panel' : ''}>

            <div ref={logoRef} className="logo" style={{ display: 'flex', alignItems: 'center', zIndex: 1100 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center' }} className="logo-link">
                    <img
                        src="/src/assets/school of finance.png"
                        alt="WALL STREET Jr. Logo"
                        style={{
                            height: isScrolled ? '70px' : '90px',
                            objectFit: 'contain',
                            cursor: 'pointer',
                            transition: 'all 0.4s',
                            filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.4)) brightness(1.1)'
                        }}
                    />
                </Link>
            </div>

            {/* Desktop Nav - Centered */}
            <nav className="desktop-nav" style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
            }}>
                <ul ref={navRef} style={{
                    display: 'flex',
                    gap: '5rem',
                    alignItems: 'center',
                    margin: 0,
                    padding: 0,
                    listStyle: 'none'
                }}>
                    {navLinks.map((link) => (
                        <li key={link.label} className="hide-mobile nav-item-container" style={{ position: 'relative' }}>
                            <a
                                href={link.href}
                                className="nav-link"
                                style={{
                                    color: 'white',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    padding: '0.5rem',
                                    display: 'inline-block',
                                    transition: 'color 0.3s'
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onMouseMove={handleMouseMove}
                            >{link.label}</a>
                            {link.dropdown && (
                                <div className="nav-dropdown" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '0',
                                    minWidth: '220px',
                                    background: 'rgba(10, 10, 10, 0.95)',
                                    backdropFilter: 'blur(15px)',
                                    borderRadius: '12px',
                                    padding: '0.75rem',
                                    border: '1px solid rgba(212, 175, 55, 0.3)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    opacity: 0,
                                    visibility: 'hidden',
                                    transform: 'translateY(10px)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    zIndex: 2000
                                }}>
                                    {link.dropdown.map((subItem) => (
                                        <a
                                            key={subItem.label}
                                            href={subItem.href}
                                            target={subItem.external ? "_blank" : "_self"}
                                            rel={subItem.external ? "noopener noreferrer" : ""}
                                            style={{
                                                display: 'block',
                                                color: 'white',
                                                textDecoration: 'none',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '8px',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s',
                                                whiteSpace: 'nowrap'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(212, 175, 55, 0.1)';
                                                e.target.style.color = '#d4af37';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'transparent';
                                                e.target.style.color = 'white';
                                            }}
                                        >
                                            {subItem.label}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Actions - Right Aligned */}
            <div className="header-actions" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                zIndex: 1100
            }}>
                <Link
                    to="/signup"
                    className="glaze-button hide-mobile"
                    style={{
                        padding: '0.8rem 2rem',
                        color: '#000',
                        fontWeight: '800',
                        transition: 'all 0.3s',
                        textDecoration: 'none',
                        display: 'inline-block',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        fontSize: '0.85rem'
                    }}
                >Enroll Now</Link>

                {/* Hamburger Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'none', // Managed via CSS
                        flexDirection: 'column',
                        gap: '6px'
                    }}
                    className="mobile-toggle"
                >
                    <div style={{ width: '24px', height: '2px', background: 'white', transition: '0.3s', transform: isMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }} />
                    <div style={{ width: '24px', height: '2px', background: 'white', opacity: isMenuOpen ? 0 : 1, transition: '0.3s' }} />
                    <div style={{ width: '24px', height: '2px', background: 'white', transition: '0.3s', transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                ref={mobileMenuRef}
                style={{
                    position: 'fixed',
                    top: '-20px', // Compensate for header top offset
                    left: '-5vw', // Compensate for header left offset
                    width: '120vw',
                    height: '120vh',
                    backgroundColor: '#0a0a0a',
                    padding: '120px 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    zIndex: 1050,
                    transform: 'translateX(100%)',
                }}
            >
                {navLinks.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        style={{
                            color: 'white',
                            fontSize: '2rem',
                            fontWeight: 700,
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            paddingBottom: '1.5rem',
                            fontFamily: 'var(--font-hero)'
                        }}
                    >{link.label}</a>
                ))}
                <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                        padding: '1.5rem',
                        backgroundColor: '#d4af37',
                        color: '#000',
                        textAlign: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        marginTop: '2rem'
                    }}
                >Enroll Now</Link>
            </div>

            <style>{`
                .nav-item-container:hover .nav-dropdown {
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: translateY(0) !important;
                }
                @media (max-width: 768px) {
                    .hide-mobile { display: none !important; }
                    .mobile-toggle { display: flex !important; }
                    .desktop-nav { display: none !important; }
                    header { 
                        width: 95% !important; 
                        padding: 0 1.5rem !important;
                    }
                }
            `}</style>
        </header>
    )
}

export default Header


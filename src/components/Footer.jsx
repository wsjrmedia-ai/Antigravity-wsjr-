import { Link } from 'react-router-dom'
import { Linkedin, Facebook, Instagram } from 'lucide-react'

const SOCIAL_LINKS = [
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/wall-street-jr-school/',
        Icon: Linkedin,
    },
    {
        label: 'Facebook',
        href: 'https://www.facebook.com/share/1KWoWotoNW/',
        Icon: Facebook,
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/wsjrschool/',
        Icon: Instagram,
    },
]

const Footer = () => {
    return (
        <>
        <style>{`
            @media (max-width: 768px) {
                .footer-inner { flex-direction: column !important; gap: 2.5rem !important; }
                .footer-brand { flex: 1 1 auto !important; max-width: 100% !important; }
                .footer-links { gap: 2.5rem !important; }
                .footer-bottom { position: static !important; flex-direction: column !important; gap: 0.5rem !important; text-align: center !important; margin-top: 3rem; padding-top: 1.5rem; }
            }
            @media (max-width: 480px) {
                .footer-root { padding: 60px 1.25rem !important; min-height: auto !important; }
                .footer-links { gap: 2rem !important; }
            }
        `}</style>
        <footer className="footer-root" style={{
            backgroundColor: '#040001',
            padding: '100px 5%',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10
        }}>
            <div className="footer-inner" style={{
                maxWidth: '1600px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '60px'
            }}>
                
                {/* Brand Column */}
                <div className="footer-brand" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '500px' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(2rem, 3vw, 2.5rem)', // 31px
                        color: 'var(--accent-gold)',
                        fontWeight: 500,
                        margin: 0,
                        letterSpacing: '-1px'
                    }}>
                        WALL STREET Jr Academy
                    </h2>
                    
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem', // 16px
                        color: '#FFF',
                        lineHeight: 1.6,
                        margin: 0,
                        opacity: 0.9
                    }}>
                        Relentless pursuit of financial excellence and educational innovation.<br/><br/>
                        Headquartered in Dubai with a global presence across India and the United States, Wall Street Jr is building the institution that the next generation of financial and business leaders deserves.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '20px' }}>
                        <p style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Dubai - Global Headquarters</p>
                        <p style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Chicago - Wall Street Jr Investments Ltd.</p>
                        <p style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-body)', fontWeight: 600 }}>India - Cochin, Bangalore, Mumbai, Delhi</p>
                    </div>

                    {/* Social */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>
                            Follow
                        </span>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${label} — Wall Street Jr. Academy`}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '50%',
                                        border: '1px solid rgba(247, 172, 65, 0.35)',
                                        color: 'var(--accent-gold)',
                                        backgroundColor: 'rgba(247, 172, 65, 0.04)',
                                        transition: 'background-color 0.2s, color 0.2s, transform 0.2s, border-color 0.2s',
                                        textDecoration: 'none',
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = 'var(--accent-gold)';
                                        e.currentTarget.style.color = '#040001';
                                        e.currentTarget.style.borderColor = 'var(--accent-gold)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(247, 172, 65, 0.04)';
                                        e.currentTarget.style.color = 'var(--accent-gold)';
                                        e.currentTarget.style.borderColor = 'rgba(247, 172, 65, 0.35)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <Icon size={18} strokeWidth={1.8} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Links Grids */}
                <div className="footer-links" style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>

                    {/* Column 1 — Explore */}
                    <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <span className="footer-col-title" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>Explore</span>
                        {[
                            { label: 'Programmes', path: '/programmes' },
                            { label: 'Who We Are', path: '/who-we-are' },
                            { label: 'Blog', path: '/blog' },
                            { label: 'Enroll', path: '/enroll' }
                        ].map((link) => (
                            <Link key={link.label} to={link.path} className="footer-link" style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '1.2rem',
                                color: '#FFF',
                                textDecoration: 'none',
                                fontWeight: 500,
                                opacity: 0.8,
                                transition: 'opacity 0.2s'
                            }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.8}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Column 2 — Schools */}
                    <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <span className="footer-col-title" style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 600 }}>Schools</span>
                        {[
                            { label: 'School of Finance', path: '/school-of-finance' },
                            { label: 'School of AI & Automation', path: '/school-of-technology' },
                            { label: 'School of Design', path: '/school-of-design' },
                            { label: 'School of Management', path: '/school-of-management' }
                        ].map((link) => (
                            <Link key={link.label} to={link.path} className="footer-link" style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '1.2rem',
                                color: '#FFF',
                                textDecoration: 'none',
                                fontWeight: 500,
                                opacity: 0.8,
                                transition: 'opacity 0.2s'
                            }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.8}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                </div>

            </div>

            {/* Copyright / Bottom Strip */}
            <div className="footer-bottom" style={{
                position: 'absolute',
                bottom: '30px',
                left: '5%',
                right: '5%',
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem'
            }}>
                <span>© {new Date().getFullYear()} Wall Street Jr Academy. All rights reserved.</span>
                <Link to="/legal" style={{ color: 'inherit', textDecoration: 'none' }}>Legal Notice</Link>
            </div>
        </footer>
        </>
    )
}

export default Footer

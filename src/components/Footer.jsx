import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#040001',
            padding: '100px 5%',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{
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
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '500px' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(2rem, 3vw, 2.5rem)', // 31px
                        color: 'var(--accent-gold)',
                        fontWeight: 500,
                        margin: 0,
                        letterSpacing: '-1px'
                    }}>
                        WALL STREET Jr. Academy
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
                        Headquartered in Dubai with a global presence across India and the United States, Wall Street Jr. is building the institution that the next generation of financial and business leaders deserves.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '20px' }}>
                        <p style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Dubai - Global Headquarters</p>
                        <p style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-body)', fontWeight: 600 }}>Chicago-Wall Street Jr. Investments Ltd.</p>
                        <p style={{ color: '#FFF', fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-body)', fontWeight: 600 }}>India-Cochin, Bangalore, Mumbai, Delhi</p>
                    </div>
                </div>

                {/* Links Grids */}
                <div style={{ display: 'flex', gap: '80px', flexWrap: 'wrap' }}>
                    
                    {/* Column 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {['Admissions', 'Student Portal', 'Research', 'Contact Us'].map((link) => (
                            <Link key={link} to="#" style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '1.2rem', // 19px
                                color: '#FFF',
                                textDecoration: 'none',
                                fontWeight: 500,
                                opacity: 0.8,
                                transition: 'opacity 0.2s'
                            }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.8}>
                                {link}
                            </Link>
                        ))}
                    </div>

                    {/* Column 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {['Newsletter & Insights', 'Community Events', 'Social Responsibility', 'Rewards Program'].map((link) => (
                            <Link key={link} to="#" style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '1.2rem',
                                color: '#FFF',
                                textDecoration: 'none',
                                fontWeight: 500,
                                opacity: 0.8,
                                transition: 'opacity 0.2s'
                            }} onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0.8}>
                                {link}
                            </Link>
                        ))}
                    </div>

                </div>

            </div>

            {/* Copyright / Bottom Strip */}
            <div style={{
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
                <span>© {new Date().getFullYear()} Wall Street Jr. Academy. All rights reserved.</span>
                <Link to="/legal" style={{ color: 'inherit', textDecoration: 'none' }}>Legal Notice</Link>
            </div>
        </footer>
    )
}

export default Footer

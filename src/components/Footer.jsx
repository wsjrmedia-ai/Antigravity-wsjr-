const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            padding: '4rem var(--container-padding)',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '3rem'
            }}>
                <div>
                    <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>WALL STREET Jr. Academy</h3>
                    <p style={{ opacity: 0.8 }}>Relentless pursuit of financial excellence and educational innovation.</p>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1rem' }}>Quick Links</h4>
                    <ul style={{ opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <li><a href="#">Admissions</a></li>
                        <li><a href="#">Student Portal</a></li>
                        <li><a href="#">Research</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.1rem' }}>Resources</h4>
                    <ul style={{ opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
                        <li><a href="https://wallstreetjrinvestments.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 600 }}>Newsletter & Insights</a></li>
                        <li><a href="#community" style={{ color: 'inherit', textDecoration: 'none' }}>Community Events</a></li>
                        <li><a href="#responsibility" style={{ color: 'inherit', textDecoration: 'none' }}>Social Responsibility</a></li>
                        <li><a href="#travel-and-learn" style={{ color: 'inherit', textDecoration: 'none' }}>Rewards Program</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ marginBottom: '1.1rem' }}>Contact</h4>
                    <div style={{ opacity: 0.8, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <p>Dubai (Headquarters)</p>
                        <p>Chicago (Investments Ltd)</p>
                        <p>Cochin | Bangalore | Mumbai | Delhi</p>
                    </div>
                </div>
            </div>
            <div style={{
                textAlign: 'center',
                marginTop: '3rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                opacity: 0.6,
                fontSize: '0.9rem'
            }}>
                © {new Date().getFullYear()} WALL STREET Jr. Group. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer

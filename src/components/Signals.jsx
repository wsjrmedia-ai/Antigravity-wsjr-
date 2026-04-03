import Section from './Section'
import NebulaEffect from './NebulaEffect'

const Signals = () => {
    return (
        <Section id="signals" style={{ position: 'relative', overflow: 'hidden', padding: '1.5rem var(--container-padding) var(--section-spacing)', background: 'var(--bg-primary)' }}>
            <NebulaEffect side="right" />
            <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '2rem' }}>
                    Institutional <span style={{ color: 'var(--accent-gold)' }}>Signals</span>
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                    Real-time portfolio allocation and disclosed investments managed within the WALL STREET Jr. ecosystem.
                </p>
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '3rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                    <p style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>[ Live Portfolio Dashboard Coming Soon ]</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Showcasing real-world exposure and strategic decision-making.</p>
                </div>
            </div>
        </Section>
    )
}

export default Signals

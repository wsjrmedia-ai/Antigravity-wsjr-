import Section from './Section'
import NebulaEffect from './NebulaEffect'

const Locations = () => {
    return (
        <Section id="locations" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--section-spacing) var(--container-padding) 4rem', background: 'var(--bg-primary)' }}>
            <NebulaEffect side="left" />
            <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '2rem' }}>
                    Global <span style={{ color: 'var(--accent-gold)' }}>Headquarters</span>
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Headquartered in UAE, the Academy initially will operate across key learning locations in UAE, Kerala, Mumbai, Bangalore, and Delhi, providing <strong>practical finance education in UAE</strong> and across our global network.
                </p>
            </div>
        </Section>
    )
}

export default Locations

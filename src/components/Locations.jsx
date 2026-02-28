import Section from './Section'

const Locations = () => {
    return (
        <Section id="locations" style={{ padding: 'var(--section-spacing) var(--container-padding) 4rem', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '2rem' }}>
                    Global <span style={{ color: 'var(--accent-gold)' }}>Headquarters</span>
                </h2>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Headquartered in Dubai, the Academy initially will operate across key learning locations in Dubai, Kerala, Mumbai, Bangalore, and Delhi, providing <strong>practical finance education in Dubai</strong> and across our global network.
                </p>
            </div>
        </Section>
    )
}

export default Locations

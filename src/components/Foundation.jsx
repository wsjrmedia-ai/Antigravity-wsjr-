import Section from './Section'
import GlowCard from './GlowCard'

const Foundation = () => {
    return (
        <Section id="foundation" style={{ position: 'relative', padding: 'var(--section-spacing) var(--container-padding)', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '1rem' }}>
                        Our <span style={{ color: 'var(--accent-gold)' }}>Foundation</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
                        Merging ethical judgment with practical excellence through a unified interdisciplinary framework.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    {/* Column 1: Philosophy */}
                    <GlowCard>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Philosophy</h3>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            <li style={{ marginBottom: '1rem' }}><strong>Clarity of Thought:</strong> Precision and system-based understanding.</li>
                            <li style={{ marginBottom: '1rem' }}><strong>Ethical Judgment:</strong> Responsibility and long-term context.</li>
                            <li><strong>Real-World Relevance:</strong> Anchored in practical application.</li>
                        </ul>
                    </GlowCard>

                    {/* Column 2: Learning Model */}
                    <GlowCard>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Applied Learning Model</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {["Foundational Theory", "Case-Based Learning", "Real-World Simulations", "Mentor Guidance"].map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>0{i + 1}</span>
                                    <span style={{ color: '#ffffff', fontSize: '0.95rem' }}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </GlowCard>

                    {/* Column 3: Credibility & Responsibility */}
                    <GlowCard style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.2rem', fontSize: '1.1rem' }}>🏆 Global Credibility</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Led by a <strong>Guinness World Record</strong> holder, we pride ourselves on a "Show, Don't Tell" mentality.
                        </p>
                        <h3 style={{ color: '#ffffff', marginBottom: '0.8rem', fontSize: '1rem' }}>🌱 Socially Responsible</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Committed to building sustainable systems relevant to 21st-century challenges.
                        </p>
                    </GlowCard>
                </div>
            </div>
        </Section>
    )
}

export default Foundation

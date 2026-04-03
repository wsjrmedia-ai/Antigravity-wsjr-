import Section from './Section'
import GlowCard from './GlowCard'
import NebulaEffect from './NebulaEffect'

const Foundation = () => {
    return (
        <Section id="foundation" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--section-spacing) var(--container-padding)', background: 'var(--bg-primary)' }}>
            <NebulaEffect side="right" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '1.5rem' }}>
                        How We Think <span style={{ color: 'var(--accent-gold)' }}>About Education</span>
                    </h2>
                    <div style={{ color: 'var(--text-secondary)', maxWidth: '900px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p>Wall Street Jr. was built on the belief that great education is not about passing exams — it is about developing the judgment to make sound decisions under pressure, in the real world, with real consequences.</p>
                        <p>Our philosophy merges three pillars that most institutions treat as separate: ethical reasoning, practical skill-building, and long-term wealth consciousness. We believe that when these three come together, students develop the kind of clarity that lasts a career.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    {/* Column 1: Philosophy */}
                    <GlowCard>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Philosophy</h3>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            <li style={{ marginBottom: '1.5rem' }}>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>Banking-Grade Risk Discipline</strong>
                                Every program is designed with the same institutional rigor applied in top-tier financial organizations. We do not teach guesswork. We teach structured thinking.
                            </li>
                            <li style={{ marginBottom: '1.5rem' }}>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>Education-First</strong>
                                We are not a trading platform or a get-rich-quick program. We prioritize understanding over speculation, and depth over hype.
                            </li>
                            <li>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>Long-Term Wealth Architecture</strong>
                                We teach students to build financial systems, not chase returns. The goal is structural, compounding capital — personal and professional.
                            </li>
                        </ul>
                    </GlowCard>

                    {/* Column 2: Learning Model */}
                    <GlowCard>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Our Applied Learning Model</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            We believe the best learning happens when theory meets application. Our four-stage model is designed to take students from concept to competency:
                        </p>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {[
                                { title: "Institutional Theory", desc: "Understand frameworks used by leading institutions." },
                                { title: "Capital Allocation Logic", desc: "Learn how capital flows and how to evaluate risk." },
                                { title: "Risk Structuring", desc: "Apply what you have learned to real-world scenarios." },
                                { title: "Mentor Guidance", desc: "Work directly with experienced practitioners." }
                            ].map((step, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '1.2rem', lineHeight: 1 }}>0{i + 1}</span>
                                    <div>
                                        <div style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{step.title}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4 }}>{step.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlowCard>

                    {/* Column 3: Credibility & Responsibility */}
                    <GlowCard style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Institutional Heritage</h3>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p>
                                Wall Street Jr. Academy is led by <strong>Vishnu Das</strong>, a Harvard-educated capital architect with direct institutional experience at JP Morgan and Bank of America.
                            </p>
                            <p>
                                With a career built at the intersection of finance, leadership, and education, Vishnu founded the Academy to give the next generation of professionals the kind of training that was once reserved for the most elite institutions in the world.
                            </p>
                            <p>
                                His approach is direct: build the mental models first, develop the skills second, and always anchor everything to long-term value creation. That philosophy runs through every program we offer.
                            </p>
                        </div>
                    </GlowCard>
                </div>
            </div>
        </Section>
    )
}

export default Foundation

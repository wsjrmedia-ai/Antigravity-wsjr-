import Section from './Section'
import GlowCard from './GlowCard'
import NebulaEffect from './NebulaEffect'

const Community = () => {
    return (
        <Section id="community" style={{ position: 'relative', overflow: 'hidden', padding: 'var(--section-spacing) var(--container-padding)', background: 'var(--bg-primary)' }}>
            <NebulaEffect side="left" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '1.5rem' }}>
                        Learn Beyond <span style={{ color: 'var(--accent-gold)' }}>the Classroom</span>
                    </h2>
                    <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
                        At Wall Street Jr., your education does not end when the session does. We have built an ecosystem designed to keep you connected, challenged, and inspired — wherever you are in your journey.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        {
                            title: "Live Q&A Sessions",
                            desc: "Every month, our students get direct access to industry leaders, fund managers, and senior professionals through live, interactive sessions hosted in UAE and streamed globally. These are not panels — they are real conversations, and you can ask real questions.",
                            icon: "🎙️"
                        },
                        {
                            title: "Interdisciplinary Collaboration",
                            desc: "Some of the best thinking happens at the edges of disciplines. We actively create opportunities for Finance students to collaborate with AI builders, for Designers to work alongside Management thinkers. Cross-school projects are a core part of how we develop well-rounded professionals.",
                            icon: "🤝"
                        },
                        {
                            title: "Global Network",
                            desc: "When you join Wall Street Jr., you join a growing network of students, alumni, and mentors across UAE, Kerala, Mumbai, Bangalore, Delhi, and Chicago. This network is one of the most practical assets you will develop during your time with us.",
                            icon: "🌐"
                        }
                    ].map((item, i) => (
                        <GlowCard key={i} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                            <h3 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '1.5rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
                        </GlowCard>
                    ))}
                </div>

                <div id="travel-and-learn" style={{
                    marginTop: '5rem',
                    padding: '4rem 3rem',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(0,0,0,0.4))',
                    borderRadius: '24px',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontFamily: 'var(--font-hero)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#ffffff', marginBottom: '1.5rem' }}>
                        Travel and Learn — <span style={{ color: 'var(--accent-gold)' }}>Our Core Giving Philosophy</span>
                    </h2>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '800px', margin: '0 auto 3rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p>We believe that the best learning does not happen in a single room. At Wall Street Jr., we reward students who demonstrate discipline, original thinking, and meaningful contribution to our community — not just with recognition, but with real experiences.</p>
                        <p>Our Travel and Learn program is designed to take exceptional students beyond borders — to financial capitals, innovation hubs, and global leadership events where real decisions are made and real relationships are formed.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', borderTop: '3px solid var(--accent-gold)' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>🌍 Global Rewards</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Performance-linked opportunities to attend international programs, conferences, and learning experiences.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', borderTop: '3px solid var(--accent-gold)' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>🎓 Elite Mentorship</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Direct access to high-caliber professionals who invest their time in students who earn it.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', borderTop: '3px solid var(--accent-gold)' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>🚀 Impact Projects</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Work on real-world initiatives that create measurable change in communities and organizations.</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default Community

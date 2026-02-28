import Section from './Section'
import GlowCard from './GlowCard'

const Community = () => {
    return (
        <Section id="community" style={{ padding: 'var(--section-spacing) var(--container-padding)', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#ffffff', marginBottom: '1.5rem' }}>
                        Community & <span style={{ color: 'var(--accent-gold)' }}>Events</span>
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto' }}>
                        Beyond the classroom, the Academy is a vibrant ecosystem of leaders, mentors, and peers working together towards global excellence.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        {
                            title: "Live Q&A Sessions",
                            desc: "Regular interactions with industry veterans and group leadership sitting in the heart of Dubai.",
                            icon: "🎙️"
                        },
                        {
                            title: "Interdisciplinary Teams",
                            desc: "Collaborate across schools—Finance meets AI, Design meets Management.",
                            icon: "🤝"
                        },
                        {
                            title: "Global Network",
                            desc: "Connect with students and professionals from Dubai, Kerala, Mumbai, and beyond.",
                            icon: "🌐"
                        }
                    ].map((item, i) => (
                        <GlowCard key={i} style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                            <h3 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</p>
                        </GlowCard>
                    ))}
                </div>

                <div style={{
                    marginTop: '4rem',
                    padding: '3rem',
                    background: 'rgba(212, 175, 55, 0.03)',
                    borderRadius: '24px',
                    border: '1px dashed rgba(212, 175, 55, 0.2)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: '#ffffff', marginBottom: '1.5rem' }}>Our Giving Mentality</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem auto' }}>
                        "Travel and Learn" is our core philosophy. We reward handsomely for discipline, innovation, and community contribution.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <span style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-card)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-gold)' }}>🚀 Global Rewards</span>
                        <span style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-card)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-gold)' }}>🎓 Elite Mentorship</span>
                        <span style={{ padding: '0.8rem 1.5rem', background: 'var(--bg-card)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-gold)' }}>🌍 Impact Projects</span>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default Community

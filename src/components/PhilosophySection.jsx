import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const cardsData = [
    {
        title: 'CORE PHILOSOPHY',
        items: [
            { h: 'Banking-Grade Risk Discipline', p: 'Every program is designed with the same institutional rigor applied in top-tier financial organizations. We do not teach guesswork. We teach structured thinking.' },
            { h: 'Education-First', p: 'We are not a trading platform or a get-rich-quick program. We prioritize understanding over speculation, and depth over hype.' },
            { h: 'Long-Term Wealth Architecture', p: 'We teach students to build financial systems, not chase returns. The goal is structural, compounding capital - personal and professional.' }
        ]
    },
    {
        title: 'OUR APPLIED LEARNING\nMODEL',
        desc: 'We believe the best learning happens when theory meets application. Our four-stage model is designed to take students from concept to competency:',
        items: [
            { h: '01 Institutional Theory', p: 'Understand frameworks used by leading institutions.' },
            { h: '02 Capital Allocation Logic', p: 'Learn how capital flows and how to evaluate risk.' },
            { h: '03 Risk Structuring', p: 'Apply what you have learned to real-world scenarios.' }
        ]
    },
    {
        title: 'INSTITUTIONAL\nHERITAGE',
        body: `Wall Street Jr. Academy is led by Vishnu Das, a Harvard educated capital architect with direct institutional experience at JP Morgan and Bank of America.\n\nWith a career built at the intersection of finance, leadership, and education, Vishnu founded the Academy to give the next generation of professionals the kind of training that was once reserved for the most elite institutions in the world.\n\nHis approach is direct: build the mental models first, develop the skills second, and always anchor everything to long-term value creation. That philosophy runs through every program we offer.`
    }
]

const PhilosophySection = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.phil-card', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%'
                }
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} style={{
            backgroundColor: '#50000B',
            padding: '120px 5%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ maxWidth: '1600px', width: '100%' }}>
                
                {/* Header Text Block */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px',
                    marginBottom: '80px',
                    maxWidth: '1200px'
                }}>
                    <h2 style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(3rem, 5vw, 4.8rem)', // ~78px
                        color: '#FFF',
                        lineHeight: '1.2',
                        fontWeight: 400,
                        letterSpacing: '-2px',
                        margin: 0
                    }}>
                        How we think{' '}
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--accent-gold)' }}>about education:</span>
                    </h2>
                    
                    <p style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)', // ~19px
                        color: '#FFF',
                        lineHeight: '1.6',
                        fontWeight: 500,
                        letterSpacing: '-0.4px',
                        opacity: 0.9,
                        margin: 0
                    }}>
                        Wall Street Jr. was built on the belief that great education is not about passing exams - it is about developing the judgment to make sound decisions under pressure, in the real world, with real consequences. Our philosophy merges three pillars that most institutions treat as separate: ethical reasoning, practical skill-building, and long-term wealth consciousness. We believe that when these three come together, students develop the kind of clarity that lasts a career.
                    </p>
                </div>

                {/* Cards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '40px',
                    width: '100%'
                }}>
                    {/* Card 1 */}
                    <div className="phil-card" style={{
                        background: 'rgba(217, 217, 217, 0.08)',
                        borderRadius: '35px',
                        padding: '50px 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '2rem', // ~31px
                            color: '#FFF',
                            fontWeight: 500,
                            letterSpacing: '-1px',
                            margin: 0
                        }}>{cardsData[0].title}</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                            {cardsData[0].items.map((it, idx) => (
                                <div key={idx}>
                                    <h4 style={{ fontFamily: 'var(--font-hero)', fontSize: '1.45rem', fontWeight: 600, color: '#FFF', margin: '0 0 10px 0' }}>{it.h}</h4>
                                    <p style={{ fontFamily: 'var(--font-hero)', fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.5 }}>{it.p}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="phil-card" style={{
                        background: 'rgba(217, 217, 217, 0.08)',
                        borderRadius: '35px',
                        padding: '50px 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'center',
                        alignItems: 'center'
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '2rem',
                            color: '#FFF',
                            fontWeight: 500,
                            letterSpacing: '-1px',
                            margin: 0,
                            whiteSpace: 'pre-line'
                        }}>{cardsData[1].title}</h3>
                        
                        <p style={{ fontFamily: 'var(--font-hero)', fontSize: '1.1rem', fontWeight: 500, color: '#FFF', margin: 0, lineHeight: 1.5 }}>{cardsData[1].desc}</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'left', width: '100%' }}>
                            {cardsData[1].items.map((it, idx) => (
                                <div key={idx}>
                                    <h4 style={{ fontFamily: 'var(--font-hero)', fontSize: '1.45rem', fontWeight: 600, color: '#FFF', margin: '0 0 10px 0' }}>{it.h}</h4>
                                    <p style={{ fontFamily: 'var(--font-hero)', fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.5 }}>{it.p}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="phil-card" style={{
                        background: 'rgba(217, 217, 217, 0.08)',
                        borderRadius: '35px',
                        padding: '50px 40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '40px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'center',
                        alignItems: 'center'
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '2rem',
                            color: '#FFF',
                            fontWeight: 500,
                            letterSpacing: '-1px',
                            margin: 0,
                            whiteSpace: 'pre-line'
                        }}>{cardsData[2].title}</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                            {cardsData[2].body.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} style={{ fontFamily: 'var(--font-hero)', fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6 }}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default PhilosophySection

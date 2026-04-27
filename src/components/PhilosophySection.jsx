import { useEffect, useRef, useState } from 'react'
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
    const trackRef = useRef(null)
    const [activeIdx, setActiveIdx] = useState(0)
    const [hasInteracted, setHasInteracted] = useState(false)

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

    // Track which card is centered in the carousel (mobile only)
    useEffect(() => {
        const track = trackRef.current
        if (!track) return

        const onScroll = () => {
            if (!hasInteracted) setHasInteracted(true)
            const cards = track.querySelectorAll('.phil-card')
            if (!cards.length) return
            const trackRect = track.getBoundingClientRect()
            const trackCenter = trackRect.left + trackRect.width / 2
            let closestIdx = 0
            let closestDist = Infinity
            cards.forEach((card, idx) => {
                const r = card.getBoundingClientRect()
                const c = r.left + r.width / 2
                const d = Math.abs(c - trackCenter)
                if (d < closestDist) {
                    closestDist = d
                    closestIdx = idx
                }
            })
            setActiveIdx(closestIdx)
        }

        track.addEventListener('scroll', onScroll, { passive: true })
        return () => track.removeEventListener('scroll', onScroll)
    }, [hasInteracted])

    const scrollToCard = (idx) => {
        const track = trackRef.current
        if (!track) return
        const cards = track.querySelectorAll('.phil-card')
        const card = cards[idx]
        if (!card) return
        const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
        track.scrollTo({ left, behavior: 'smooth' })
        setHasInteracted(true)
    }

    const handlePrev = () => scrollToCard(Math.max(0, activeIdx - 1))
    const handleNext = () => scrollToCard(Math.min(cardsData.length - 1, activeIdx + 1))

    return (
        <section ref={sectionRef} className="philosophy-section" style={{
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
                        fontSize: 'clamp(3rem, 5vw, 4.8rem)',
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
                        fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)',
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

                {/* Cards Carousel (mobile = swipe / desktop = grid) */}
                <div className="phil-cards-wrap" style={{ position: 'relative', width: '100%' }}>
                    <div ref={trackRef} className="phil-cards-grid" style={{
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
                                fontSize: '2rem',
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

                    {/* Mobile-only carousel controls */}
                    <div className="phil-carousel-controls" aria-hidden="false">
                        <button
                            type="button"
                            className="phil-arrow phil-arrow-prev"
                            onClick={handlePrev}
                            disabled={activeIdx === 0}
                            aria-label="Previous card"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        </button>

                        <div className="phil-dots" role="tablist" aria-label="Card pagination">
                            {cardsData.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeIdx === idx}
                                    aria-label={`Go to card ${idx + 1}`}
                                    className={`phil-dot ${activeIdx === idx ? 'is-active' : ''}`}
                                    onClick={() => scrollToCard(idx)}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            className="phil-arrow phil-arrow-next"
                            onClick={handleNext}
                            disabled={activeIdx === cardsData.length - 1}
                            aria-label="Next card"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                    </div>

                    {/* Swipe hint — fades after first interaction */}
                    <div className={`phil-swipe-hint ${hasInteracted ? 'is-hidden' : ''}`} aria-hidden="true">
                        <span className="phil-swipe-hint-arrow">‹</span>
                        <span>Swipe</span>
                        <span className="phil-swipe-hint-arrow">›</span>
                    </div>
                </div>
            </div>

            <style>{`
                /* Desktop: hide carousel controls */
                .phil-carousel-controls { display: none; }
                .phil-swipe-hint { display: none; }

                @media (max-width: 768px) {
                    .philosophy-section { padding: 60px 5% !important; }
                    .philosophy-section h2 { font-size: clamp(2.2rem, 8vw, 3rem) !important; text-align: center; }
                    .philosophy-section p { font-size: 1.1rem !important; text-align: center; }

                    /* Convert grid -> horizontal scroll-snap carousel */
                    .phil-cards-grid {
                        display: flex !important;
                        grid-template-columns: none !important;
                        flex-wrap: nowrap !important;
                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                        scroll-snap-type: x mandatory !important;
                        -webkit-overflow-scrolling: touch;
                        scroll-behavior: smooth;
                        gap: 16px !important;
                        padding: 4px 8% 8px 8% !important;
                        margin: 0 -5% !important;
                        scrollbar-width: none;
                    }
                    .phil-cards-grid::-webkit-scrollbar { display: none; }

                    .phil-card {
                        flex: 0 0 84% !important;
                        scroll-snap-align: center !important;
                        padding: 30px 22px !important;
                        min-height: auto;
                    }

                    /* Carousel controls bar */
                    .phil-carousel-controls {
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                        gap: 18px;
                        margin-top: 22px;
                        width: 100%;
                    }

                    .phil-arrow {
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        border: 1px solid rgba(247, 172, 65, 0.45);
                        background: rgba(247, 172, 65, 0.08);
                        color: var(--accent-gold);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        transition: all 0.25s ease;
                        flex-shrink: 0;
                        -webkit-tap-highlight-color: transparent;
                    }
                    .phil-arrow:active:not(:disabled) {
                        transform: scale(0.92);
                        background: rgba(247, 172, 65, 0.18);
                    }
                    .phil-arrow:disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                    }

                    .phil-dots {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .phil-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        border: 0;
                        padding: 0;
                        background: rgba(255, 255, 255, 0.25);
                        cursor: pointer;
                        transition: all 0.3s ease;
                        -webkit-tap-highlight-color: transparent;
                    }
                    .phil-dot.is-active {
                        width: 26px;
                        border-radius: 4px;
                        background: var(--accent-gold);
                        box-shadow: 0 0 12px rgba(247, 172, 65, 0.55);
                    }

                    /* Swipe hint */
                    .phil-swipe-hint {
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        margin-top: 14px;
                        font-family: var(--font-body);
                        font-size: 0.78rem;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        color: rgba(247, 172, 65, 0.75);
                        opacity: 1;
                        transition: opacity 0.5s ease;
                        animation: philSwipeNudge 1.8s ease-in-out infinite;
                    }
                    .phil-swipe-hint.is-hidden {
                        opacity: 0;
                        pointer-events: none;
                        animation: none;
                    }
                    .phil-swipe-hint-arrow {
                        font-size: 1.2rem;
                        line-height: 1;
                        color: var(--accent-gold);
                    }

                    @keyframes philSwipeNudge {
                        0%, 100% { transform: translateX(0); }
                        50%      { transform: translateX(6px); }
                    }
                }
            `}</style>
        </section>
    )
}

export default PhilosophySection

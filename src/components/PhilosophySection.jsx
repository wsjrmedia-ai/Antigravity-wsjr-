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
        body: `Who built this and why it matters.\n\nVishnu Das\nFounder, Harvard-educated Wealth Strategist. JP Morgan · Bank of America.\n\nMr Vishnu Das has built the Wall Street Jr. academy with one purpose: to give the next generation of professionals the caliber of training that was once limited to the world's most elite institutions. His method is deliberate, to build the mental model first, develop the skill second, anchor everything to long-term value. That sequence is non-negotiable across every program we offer.`
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
                                    <p key={idx} style={{ fontFamily: 'var(--font-hero)', fontSize: '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{paragraph}</p>
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
                    .philosophy-section {
                        padding: 56px 5% 48px !important;
                        min-height: auto !important;
                    }
                    .philosophy-section h2 { font-size: clamp(2rem, 7.5vw, 2.6rem) !important; text-align: left; letter-spacing: -1px !important; }
                    .philosophy-section p { font-size: 1rem !important; text-align: left; line-height: 1.55 !important; }
                    .philosophy-section .phil-cards-wrap + style,
                    .philosophy-section > div > div:first-child { margin-bottom: 36px !important; gap: 20px !important; }

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
                        gap: 14px !important;
                        padding: 4px 8% 8px 8% !important;
                        margin: 0 -5% !important;
                        scrollbar-width: none;
                        align-items: stretch;
                    }
                    .phil-cards-grid::-webkit-scrollbar { display: none; }

                    /* Compact, structured card with internal scroll + fade mask
                       so it never overflows the screen */
                    .phil-card {
                        flex: 0 0 84% !important;
                        scroll-snap-align: center !important;
                        padding: 26px 22px 22px !important;
                        gap: 18px !important;
                        border-radius: 26px !important;
                        border: 1px solid rgba(247, 172, 65, 0.18) !important;
                        background:
                            linear-gradient(180deg, rgba(247,172,65,0.06) 0%, rgba(217,217,217,0.05) 60%) !important;
                        box-shadow:
                            0 18px 40px rgba(0,0,0,0.28),
                            inset 0 1px 0 rgba(255,255,255,0.04);
                        max-height: min(72vh, 560px);
                        overflow: hidden;
                        position: relative;
                    }

                    /* Card title — smaller, tighter, with gold underline accent */
                    .phil-card h3 {
                        font-size: 1.15rem !important;
                        line-height: 1.25 !important;
                        letter-spacing: 0.5px !important;
                        font-weight: 600 !important;
                        text-align: left !important;
                        position: relative;
                        padding-bottom: 12px;
                        margin: 0 !important;
                    }
                    .phil-card h3::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 36px;
                        height: 2px;
                        background: var(--accent-gold);
                        border-radius: 2px;
                    }
                    .phil-card[style*="text-align: center"] h3,
                    .phil-card[style*="text-align:center"] h3 { text-align: left !important; }

                    /* Inner scroll body so card height stays bounded */
                    .phil-card > div:not(.phil-card-fade) {
                        gap: 16px !important;
                        text-align: left !important;
                        width: 100% !important;
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        flex: 1 1 auto;
                        padding-right: 4px;
                        padding-bottom: 18px;
                        scrollbar-width: thin;
                        scrollbar-color: rgba(247,172,65,0.35) transparent;
                    }
                    .phil-card > div:not(.phil-card-fade)::-webkit-scrollbar { width: 3px; }
                    .phil-card > div:not(.phil-card-fade)::-webkit-scrollbar-thumb {
                        background: rgba(247,172,65,0.35);
                        border-radius: 3px;
                    }

                    /* Each item gets a thin gold rail on the left for rhythm */
                    .phil-card > div:not(.phil-card-fade) > div {
                        position: relative;
                        padding-left: 14px;
                        border-left: 2px solid rgba(247,172,65,0.35);
                    }
                    .phil-card h4 {
                        font-size: 1rem !important;
                        line-height: 1.3 !important;
                        margin: 0 0 6px 0 !important;
                        color: var(--accent-gold) !important;
                        font-weight: 600 !important;
                        letter-spacing: 0.2px;
                    }
                    .phil-card p {
                        font-size: 0.88rem !important;
                        line-height: 1.55 !important;
                        text-align: left !important;
                        margin: 0 !important;
                        color: rgba(255,255,255,0.78) !important;
                    }

                    /* Bottom fade hinting more content */
                    .phil-card::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        height: 36px;
                        background: linear-gradient(180deg,
                            rgba(80, 0, 11, 0) 0%,
                            rgba(80, 0, 11, 0.85) 70%,
                            rgba(80, 0, 11, 0.95) 100%);
                        pointer-events: none;
                        border-bottom-left-radius: 26px;
                        border-bottom-right-radius: 26px;
                    }

                    /* Carousel controls bar */
                    .phil-carousel-controls {
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                        gap: 16px;
                        margin-top: 20px;
                        width: 100%;
                    }

                    .phil-arrow {
                        width: 40px;
                        height: 40px;
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
                        width: 7px;
                        height: 7px;
                        border-radius: 50%;
                        border: 0;
                        padding: 0;
                        background: rgba(255, 255, 255, 0.25);
                        cursor: pointer;
                        transition: all 0.3s ease;
                        -webkit-tap-highlight-color: transparent;
                    }
                    .phil-dot.is-active {
                        width: 22px;
                        border-radius: 4px;
                        background: var(--accent-gold);
                        box-shadow: 0 0 10px rgba(247, 172, 65, 0.55);
                    }

                    /* Swipe hint */
                    .phil-swipe-hint {
                        display: flex !important;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        margin-top: 12px;
                        font-family: var(--font-body);
                        font-size: 0.72rem;
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
                        font-size: 1.1rem;
                        line-height: 1;
                        color: var(--accent-gold);
                    }

                    @keyframes philSwipeNudge {
                        0%, 100% { transform: translateX(0); }
                        50%      { transform: translateX(6px); }
                    }
                }

                @media (max-width: 480px) {
                    .phil-card {
                        flex: 0 0 88% !important;
                        max-height: min(68vh, 520px);
                        padding: 22px 18px 18px !important;
                    }
                    .phil-card h3 { font-size: 1.05rem !important; }
                    .phil-card h4 { font-size: 0.95rem !important; }
                    .phil-card p { font-size: 0.84rem !important; }
                }
            `}</style>
        </section>
    )
}

export default PhilosophySection

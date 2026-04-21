import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SchoolsHeader = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.header-fade', {
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%'
                }
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="schools-header" style={{
            backgroundColor: '#EBEBEB',
            padding: '0 8%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Align to left side
            justifyContent: 'center', // Center vertically
            textAlign: 'left',
            height: '100vh',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="schools-content" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '-10vh', position: 'relative', zIndex: 1 }}>
                <h2 className="header-fade" style={{
                    fontFamily: 'var(--font-hero)',
                    fontSize: 'clamp(3.5rem, 5vw, 5.5rem)',
                    color: '#111',
                    lineHeight: '1.1',
                    margin: 0,
                    letterSpacing: '-2.5px',
                    fontWeight: 400
                }}>
                    Four <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 500, color: '#CC972B' }}>World-Class</span> Schools.<br/>
                    One <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 500, color: '#6A0715' }}>Unified Framework.</span>
                </h2>

                <p className="header-fade" style={{
                    fontFamily: 'var(--font-hero)',
                    fontSize: 'clamp(1rem, 1.2vw, 1.2rem)', // Scaled down as per the image
                    color: '#111',
                    lineHeight: '1.4',
                    margin: 0,
                    maxWidth: '600px',
                    fontWeight: 600, // Bold paragraph like the image
                    letterSpacing: '-0.3px'
                }}>
                    Choose your path to mastery. Each school offers a rigorous, industry-aligned curriculum designed by practitioners who have operated at the highest levels of their field.
                </p>
            </div>

            {/* Decorative crest — desktop: absolute right side. Mobile: flex item below content (see CSS) */}
            <div className="schools-crest" aria-hidden="true" style={{
                position: 'absolute',
                top: '50%',
                right: '-6%',
                transform: 'translateY(-50%)',
                width: 'min(52vw, 640px)',
                height: 'min(52vw, 640px)',
                pointerEvents: 'none',
                zIndex: 0,
                opacity: 0.85,
                animation: 'schoolsCrestFloat 11s ease-in-out infinite',
                filter: 'drop-shadow(0 18px 50px rgba(106, 7, 21, 0.25))'
            }}>
                <img
                    src="/jus.the.emblem.frame.red.whyte.highlights.png"
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
            </div>

            <style>{`
                @keyframes schoolsCrestFloat {
                    0%, 100% { transform: translateY(-50%) rotate(0deg); }
                    50%      { transform: translateY(calc(-50% - 14px)) rotate(2deg); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .schools-crest { animation: none !important; }
                }
                @media (max-width: 768px) {
                    /* Mobile: content at top, crest as a real flex item below, section grows to fit both */
                    .schools-header {
                        justify-content: flex-start !important;
                        padding: 6vh 6% 5vh !important;
                        align-items: stretch !important;
                        height: auto !important;
                        min-height: 100vh !important;
                        overflow: visible !important;
                    }
                    .schools-content {
                        margin-top: 0 !important;
                        max-width: 100% !important;
                    }
                    .schools-crest {
                        position: static !important;
                        top: auto !important;
                        right: auto !important;
                        bottom: auto !important;
                        left: auto !important;
                        transform: none !important;
                        width: min(82vw, 460px) !important;
                        height: min(82vw, 460px) !important;
                        margin: 5vh auto 0 !important;
                        opacity: 1 !important;
                        filter: drop-shadow(0 14px 36px rgba(106, 7, 21, 0.28)) !important;
                        animation: schoolsCrestFloatMobile 9s ease-in-out infinite !important;
                    }
                    @keyframes schoolsCrestFloatMobile {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        50%      { transform: translateY(-10px) rotate(2deg); }
                    }
                }
            `}</style>
        </section>
    )
}

export default SchoolsHeader

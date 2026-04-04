import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const InstitutionalOverview = () => {
    const sectionRef = useRef(null)
    const line1 = useRef(null)
    const line2 = useRef(null)
    const line3 = useRef(null)
    const line4 = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const lines = [line1.current, line2.current, line3.current, line4.current]
            lines.forEach((line, i) => {
                if (line) {
                    gsap.fromTo(line, 
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1.2,
                            ease: "power3.out",
                            delay: i * 0.15,
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: "top 75%"
                            }
                        }
                    )
                }
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
        }}>
            {/* Background Image Layer */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: -1, // Sits deeply in the back so the global Emblem can interleave
                backgroundColor: '#050505',
                overflow: 'hidden'
            }}>
                <img 
                    src="/images/figma/bg-qatar-museum.jpg" 
                    alt="National Museum of Qatar Architecture" 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        opacity: 1.0 // Fully visible architectural background
                    }}
                />
                
                {/* Figma precise blurred maroon SVG gradients - Turned down natively so architecture is visible! */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    right: '-20%',
                    width: '100vw',
                    height: '100vh',
                    background: 'radial-gradient(ellipse at center, rgba(80,0,11,0.2) 0%, rgba(80,0,11,0) 60%)',
                    zIndex: 1,
                    filter: 'blur(100px)'
                }} />
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '-30%',
                    width: '100vw',
                    height: '100vh',
                    background: 'radial-gradient(ellipse at center, rgba(80,0,11,0.2) 0%, rgba(80,0,11,0) 60%)',
                    zIndex: 1,
                    filter: 'blur(100px)'
                }} />
            </div>

            {/* Content Container */}
            <div className="overview-container" style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '1800px',
                padding: '120px 8%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '80px',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Left Heading */}
                <div style={{ flex: '1 1 500px', maxWidth: '800px' }}>
                   <h2 ref={line1} style={{
                       fontFamily: 'var(--font-body)',
                       fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', // Matches Figma 78px
                       color: '#FFF',
                       lineHeight: '1.1',
                       fontWeight: 600,
                       letterSpacing: '-2px'
                   }}>
                       A <span style={{ fontFamily: 'var(--font-hero)', fontStyle: 'italic', fontWeight: 400 }}>GLOBAL ACADEMY</span><br/> BUILT ON <span style={{ fontFamily: 'var(--font-hero)', fontStyle: 'italic', fontWeight: 400 }}>INSTITUTIONAL PRINCIPLES</span>
                   </h2>
                </div>

                {/* Right Paragraphs */}
                <div style={{ flex: '1 1 500px', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '35px' }}>
                     <p ref={line2} style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: 'clamp(1.2rem, 1.5vw, 1.45rem)', // Matches Figma 23px
                            color: '#FFF',
                            lineHeight: '1.4',
                            fontWeight: 600,
                            letterSpacing: '-0.4px'
                        }}>
                            WallStreet Jr. Academy is a Dubai-based global institution that operates at the intersection of finance, technology, design and management. We believe that the most capable professionals of the next decade will not be narrow specialists; they will be disciplined thinkers who understand how capital, technology and human behaviour interact.
                        </p>
                        <p ref={line3} style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: 'clamp(1.2rem, 1.5vw, 1.45rem)',
                            color: '#FFF',
                            lineHeight: '1.4',
                            fontWeight: 600,
                            letterSpacing: '-0.4px'
                        }}>
                            Our curriculum is built around one core idea: real-world relevance. Every program we offer is designed not around academic benchmarks, but around the demands of modern institutions; from investment banks and private equity firms to technology companies and designated organizations.
                        </p>
                        <p ref={line4} style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: 'clamp(1.2rem, 1.5vw, 1.45rem)',
                            color: '#FFF',
                            lineHeight: '1.4',
                            fontWeight: 600,
                            letterSpacing: '-0.4px'
                        }}>
                            Led by a faculty with direct experience at institutions including JP Morgan and Bank of America, our academic framework brings banking-grade rigor into an education-first environment. Students graduate not just with knowledge, but with the mental models and practical tools they need to perform.
                        </p>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .overview-container { padding: 80px 5% !important; gap: 40px !important; flex-direction: column !important; }
                    .overview-container h2 { font-size: clamp(2.2rem, 8vw, 3rem) !important; text-align: center !important; }
                    .overview-container p { font-size: 1.1rem !important; text-align: center !important; }
                    .overview-container > div { flex: 1 1 100% !important; max-width: 100% !important; }
                }
            `}</style>
        </section>
    )
}

export default InstitutionalOverview

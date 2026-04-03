import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const InstitutionalSignals = () => {
    const sectionRef = useRef(null)
    const headerRef = useRef(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 }); 
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!headerRef.current) return;
        const rect = headerRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsHovered(true); // Engages the flashlight mask
    };

    const handleMouseLeave = () => {
        setIsHovered(false); // Powers off the flashlight, returning to solid silver
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.signal-fade', {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
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
        <section ref={sectionRef} style={{
            backgroundColor: '#EDEDED',
            padding: '120px 5%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
        }}>
            {/* Top Border */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', background: 'var(--bg-primary)' }} />

            <div style={{
                maxWidth: '1600px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '80px',
                marginTop: '60px'
            }}>
                <div style={{ textAlign: 'center', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
                    
                    {/* Torch Tracking Wrapper */}
                    <div 
                        ref={headerRef} 
                        onMouseMove={handleMouseMove} 
                        onMouseLeave={handleMouseLeave}
                        style={{ padding: '20px' }} // Padding extends the torch area
                    >
                        <h2 className="signal-fade" style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: 'clamp(3rem, 6vw, 4.8rem)', // 78px
                            fontStyle: 'italic',
                            fontWeight: 600,
                            margin: 0,
                            letterSpacing: '-2px',
                            
                            // Torch Gradient Effect tied strictly to hover
                            backgroundImage: isHovered 
                                ? `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, #000000 0%, #000000 15%, #C4C4C4 75%, #C4C4C4 100%)`
                                : `radial-gradient(circle 2000px at 50% 50%, #C4C4C4 0%, #C4C4C4 100%)`, // Solid silver glaze fallback when idle
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: 'transparent', // Fallback
                            transition: 'background-image 0.1s ease-out' // Smooth flashlight engagement
                        }}>
                            Institutional Signals
                        </h2>
                    </div>
                    
                    <p className="signal-fade" style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(1.2rem, 2vw, 1.45rem)', // 23px
                        color: '#000',
                        fontWeight: 600,
                        letterSpacing: '-0.4px',
                        margin: 0,
                        lineHeight: 1.4
                    }}>
                        Real-time portfolio allocation and disclosed investments managed within the WALL STREET Jr. ecosystem.
                    </p>
                </div>

                {/* Maroon Pill */}
                <div className="signal-fade" style={{
                    width: '100%',
                    background: '#50000B',
                    borderRadius: '50px',
                    padding: '80px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(1.1rem, 1.5vw, 1.2rem)', // 19px
                        color: '#FFF',
                        fontWeight: 500,
                        margin: 0,
                        maxWidth: '600px',
                        lineHeight: 1.6
                    }}>
                        [Live Portfolio Dashboard Coming Soon ]<br/>
                        Showcasing real-world exposure and strategic decision-making.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default InstitutionalSignals

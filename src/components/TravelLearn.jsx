import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const WordReveal = ({ text, style = {} }) => {
    return (
        <span style={style}>
            {text.split(' ').map((word, i) => (
                <span key={i} className="reveal-word" style={{ 
                    color: '#FFFFFF', // Starts white against the light gray background
                    display: 'inline-block' 
                }}>
                    {word}&nbsp;
                </span>
            ))}
        </span>
    );
}

const TravelLearn = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            
            // Text Color Scrub Reveal Animation (With Slow Inertia)
            gsap.to('.reveal-word', {
                color: '#000000',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 65%', // Starts when nicely in view
                    end: 'bottom 80%', // Stretches the scrub area all the way down
                    scrub: 2.5 // Heavy 2.5s smoothing turns scroll jerks into buttery slow cinematic reveals!
                }
            })

            // Standard fade in for the bottom feature columns
            gsap.from('.travel-fade', {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.travel-fade-container',
                    start: 'top 85%'
                }
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} style={{
            backgroundColor: '#EDEDED',
            padding: '120px 5%',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                maxWidth: '1600px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '80px'
            }}>
                {/* Header Text Block (Scrub Reveal) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1400px' }}>
                    <h2 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.8rem)', // 78px
                        margin: 0,
                        letterSpacing: '-2px',
                        lineHeight: 1.1
                    }}>
                        <WordReveal 
                            text="Travel and Learn: " 
                            style={{ fontFamily: 'var(--font-hero)', fontWeight: 600 }} 
                        />
                        <WordReveal 
                            text="Our Core Giving Philosophy" 
                            style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }} 
                        />
                    </h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <p style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: 'clamp(1.1rem, 1.5vw, 1.2rem)', // 19px
                            fontWeight: 600,
                            letterSpacing: '-0.4px',
                            margin: 0,
                            lineHeight: 1.4
                        }}>
                            <WordReveal text="We believe that the best learning does not happen in a single room. At Wall Street Jr., we reward students who demonstrate discipline, original thinking, and meaningful contribution to our community- not just with recognition, but with real experiences." />
                        </p>
                        <p style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: 'clamp(1.1rem, 1.5vw, 1.2rem)',
                            fontWeight: 600,
                            letterSpacing: '-0.4px',
                            margin: 0,
                            lineHeight: 1.4
                        }}>
                            <WordReveal text="Our Travel and Learn program is designed to take exceptional students beyond borders - to financial capitals, innovation hubs, and global leadership events where real decisions are made and real relationships are formed." />
                        </p>
                    </div>
                </div>

                {/* Three Columns Grid (Standard Fade) */}
                <div className="travel-fade-container" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '60px'
                }}>
                    {[
                        { 
                            h: 'Global Rewards', 
                            p: 'Performance-linked opportunities to attend international programs, conferences, and learning experiences.' 
                        },
                        { 
                            h: 'Elite Mentorship', 
                            p: 'Direct access to high-caliber professionals who invest their time in students who earn it.' 
                        },
                        { 
                            h: 'Impact Projects', 
                            p: 'Work on real-world initiatives that create measurable change in communities and organizations.' 
                        }
                    ].map((col, i) => (
                        <div key={i} className="travel-fade" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <h3 style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '1.45rem', // 23px
                                color: '#000',
                                fontWeight: 700,
                                margin: 0,
                                letterSpacing: '-0.5px'
                            }}>{col.h}</h3>
                            <p style={{
                                fontFamily: 'var(--font-hero)',
                                fontSize: '1.2rem', // 19px
                                color: '#000',
                                fontWeight: 500,
                                margin: 0,
                                lineHeight: 1.5
                            }}>{col.p}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TravelLearn

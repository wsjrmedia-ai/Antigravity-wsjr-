import { useEffect, useRef, useState } from 'react'
import StockTicker from './StockTicker'
import GalaxyBackground from './GalaxyBackground'
import FloatingElements from './FloatingElements'
import LearnEarnToggle from './LearnEarnToggle'
import gsap from 'gsap'

const HeroSection = () => {
    const heroRef = useRef(null)
    const textRef = useRef(null)
    const globeRef = useRef(null)
    const spotlightRef = useRef(null)
    const overlayRef = useRef(null)

    const handleMouseMove = (e) => {
        if (!spotlightRef.current || !overlayRef.current) return
        const rect = spotlightRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        // Direct DOM update for performance (no re-renders)
        overlayRef.current.style.maskImage = `radial-gradient(circle 120px at ${x}px ${y}px, black 0%, transparent 100%)`
        overlayRef.current.style.webkitMaskImage = `radial-gradient(circle 120px at ${x}px ${y}px, black 0%, transparent 100%)`
    }

    const handleMouseLeave = () => {
        if (!overlayRef.current) return
        overlayRef.current.style.maskImage = 'none'
        overlayRef.current.style.webkitMaskImage = 'none'
        overlayRef.current.style.opacity = '0'
    }

    const handleMouseEnter = () => {
        if (!overlayRef.current) return
        overlayRef.current.style.opacity = '1'
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline()

            tl.from(textRef.current.children, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out'
            })
                .from(globeRef.current, {
                    scale: 0.5,
                    opacity: 0,
                    duration: 2,
                    ease: 'expo.out'
                }, "-=1")

        }, heroRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={heroRef} style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            color: 'var(--text-primary)',
            paddingTop: '110px',
            backgroundColor: 'var(--bg-primary)'
        }}>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
                padding: '0 var(--container-padding)'
            }}>
                <div ref={textRef}>
                    <h2 style={{
                        color: 'var(--accent-gold)',
                        letterSpacing: 'clamp(2px, 1vw, 5px)',
                        fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
                        marginBottom: '1rem',
                        fontWeight: 700
                    }}>WALL STREET JR. SCHOOL</h2>

                    <LearnEarnToggle />

                    <div
                        ref={spotlightRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onMouseEnter={handleMouseEnter}
                        style={{
                            position: 'relative',
                            cursor: 'default',
                            marginBottom: '2rem',
                            userSelect: 'none',
                            padding: '1rem' // Add padding to catch mouse earlier
                        }}
                    >
                        {/* Base Text (Behind) */}
                        <h1 style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            margin: 0,
                            letterSpacing: '-1px',
                            color: '#ffffff',
                            opacity: 0.15,
                            transition: 'opacity 0.3s'
                        }}>
                            Interdisciplinary Education <br />
                            for the Modern World
                        </h1>

                        {/* Spotlight Layer (Gold) */}
                        <div ref={overlayRef} style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                            opacity: 0, // Hidden by default
                            transition: 'opacity 0.2s',
                            padding: '1rem' // Match container padding
                        }}>
                            <h1 style={{
                                fontFamily: 'var(--font-hero)',
                                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                                fontWeight: 800,
                                lineHeight: 1.1,
                                margin: 0,
                                letterSpacing: '-1px',
                                color: 'var(--accent-gold)',
                            }}>
                                Interdisciplinary Education <br />
                                for the Modern World
                            </h1>
                        </div>
                    </div>

                    <p style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                        color: 'var(--text-secondary)',
                        marginBottom: '3.5rem',
                        maxWidth: '800px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: 1.6
                    }}>
                        The Academy is a multidisciplinary institution preparing individuals for judgment and leadership across finance, design, technology, and management.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <a href="#about" className="glaze-button" style={{
                            textDecoration: 'none',
                            color: '#000',
                            fontWeight: '800',
                            padding: '1rem 2.5rem'
                        }}>Explore the Academy</a>
                        <a href="#schools" style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            fontWeight: '600',
                            padding: '1rem 2rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '30px',
                            transition: 'all 0.3s'
                        }}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >View Our Schools</a>
                    </div>
                </div>
            </div>

            {/* Galaxy Background - Deepest Layer */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}>
                <GalaxyBackground />
                <FloatingElements />
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
                <StockTicker />
            </div>

            {/* Scroll Indicator */}
            <div style={{
                position: 'absolute',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                opacity: 0.6,
                animation: 'bounce 2s infinite'
            }}>
                <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="22" height="38" rx="11" stroke="white" strokeWidth="2" />
                    <circle cx="12" cy="10" r="3" fill="var(--accent-gold)" />
                </svg>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateX(-50%) translateY(0);}
                    40% {transform: translateX(-50%) translateY(-10px);}
                    60% {transform: translateX(-50%) translateY(-5px);}
                }
            `}</style>

            <style>{`
                @media (max-width: 480px) {
                    .hide-mobile { display: none; }
                }
            `}</style>
        </section>
    )
}

export default HeroSection

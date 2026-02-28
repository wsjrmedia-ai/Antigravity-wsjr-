import { useEffect, useRef } from 'react'
import Section from './Section'
import Globe3D from './Globe3D'
import gsap from 'gsap'

const InstitutionalOverview = () => {
    const sectionRef = useRef(null)
    const line1 = useRef(null)
    const line2 = useRef(null)
    const line3 = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const lines = [line1.current, line2.current, line3.current]
            lines.forEach((line, i) => {
                if (line) {
                    gsap.from(line, {
                        opacity: 0,
                        y: 30,
                        duration: 1,
                        ease: "power2.out",
                        delay: 0.2 + (i * 0.1),
                        scrollTrigger: {
                            trigger: line,
                            start: "top 90%"
                        }
                    })
                }
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <Section id="about" style={{
            position: 'relative',
            padding: 'var(--section-spacing) var(--container-padding)',
            background: 'var(--bg-primary)'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 1.2fr) 1fr',
                gap: '4rem',
                alignItems: 'center',
                position: 'relative',
                zIndex: 5
            }}>
                {/* Globe Column (Left) */}
                <div style={{
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        transform: 'scale(1.4)'
                    }}>
                        <Globe3D />
                    </div>
                </div>

                {/* Text Column (Right) */}
                <div ref={sectionRef} style={{ textAlign: 'left' }}>
                    <h2 ref={line1} style={{
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        color: '#ffffff',
                        marginBottom: '2rem',
                        fontWeight: 800
                    }}>
                        Institutional <span style={{ color: 'var(--accent-gold)' }}>Overview</span>
                    </h2>
                    <p ref={line2} style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.8,
                        marginBottom: '2.5rem'
                    }}>
                        As a <strong>global professional academy</strong>, education is delivered through specialized schools within the <strong>WALL STREET Jr.</strong> unified academic framework. We focus on <strong>real-world skill development</strong> in the modern economy, emphasizing clarity of thought, ethical judgment, and practical relevance.
                    </p>
                    <p ref={line3} style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.8
                    }}>
                        At our <strong>Dubai-based global academy</strong>, we offer <strong>applied learning programs</strong> and an <strong>industry-aligned curriculum</strong>. Our framework integrates disciplinary depth with cross-functional understanding, ensuring students develop <strong>career-focused learning</strong> skills relevant to 21st-century leadership.
                    </p>
                </div>
            </div>
        </Section>
    )
}

export default InstitutionalOverview

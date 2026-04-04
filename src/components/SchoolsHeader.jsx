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
            position: 'relative'
        }}>
            <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '-10vh' }}>
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

            <style>{`
                @media (max-width: 768px) {
                    .schools-header { padding: 0 5% !important; height: auto !important; min-height: 80vh !important; }
                    .schools-header h2 { font-size: clamp(2.5rem, 10vw, 3.5rem) !important; }
                    .schools-header p { font-size: 1.1rem !important; margin-top: 10px !important; }
                }
            `}</style>
        </section>
    )
}

export default SchoolsHeader

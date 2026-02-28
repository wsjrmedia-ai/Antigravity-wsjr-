import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const TrustedBy = () => {
    const marqueeRef = useRef(null)

    const brands = [
        "THE WALL STREET JOURNAL",
        "FORBES",
        "BLOOMBERG",
        "FINANCIAL TIMES",
        "THE ECONOMIST",
        "CNBC",
        "REUTERS",
        "BUSINESS INSIDER"
    ]

    useEffect(() => {
        const ctx = gsap.context(() => {
            const content = marqueeRef.current.querySelector('.marquee-content')
            const width = content.offsetWidth

            gsap.to(content, {
                x: -width / 2,
                duration: 20,
                ease: "none",
                repeat: -1
            })
        }, marqueeRef)

        return () => ctx.revert()
    }, [])

    return (
        <section style={{
            padding: '4rem 0',
            background: 'var(--bg-primary)',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
            <p style={{
                textAlign: 'center',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginBottom: '2rem'
            }}>Featured In</p>

            <div ref={marqueeRef} style={{
                display: 'flex',
                overflow: 'hidden',
                userSelect: 'none',
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}>
                <div className="marquee-content" style={{
                    display: 'flex',
                    gap: '4rem',
                    whiteSpace: 'nowrap',
                    paddingRight: '4rem' // Buffer
                }}>
                    {[...brands, ...brands, ...brands].map((brand, i) => (
                        <span key={i} style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.3)',
                            letterSpacing: '-0.5px'
                        }}>
                            {brand}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TrustedBy

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const metricsData = [
    {
        num: 4,
        suffix: '+',
        title: 'SPECIALIZED SCHOOLS',
        desc: 'Finance, Technology, Design, and Management, each with its own curriculum, faculty, and real-world focus.'
    },
    {
        num: 5000,
        suffix: '+',
        title: 'STUDENTS',
        desc: 'A growing community of learners from Dubai, India, and beyond, building careers with institutional-grade knowledge.'
    },
    {
        num: 10,
        suffix: '+',
        title: 'GLOBAL LOCATIONS',
        desc: 'Dubai (HQ), Kerala, Mumbai, Bangalore, Delhi, and Chicago, creating a truly international learning network.'
    }
]

const KeyMetrics = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Stagger the entry of the cards
            gsap.from('.metric-stat', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                }
            })

            // 2. Animate the numbers natively using GSAP tweening
            const numberElements = document.querySelectorAll('.metric-number');
            numberElements.forEach((el) => {
                const endValue = parseInt(el.getAttribute('data-val'), 10);
                const counter = { val: 0 }; // Starting value for the tween

                gsap.to(counter, {
                    val: endValue, // Target value
                    duration: 4.5, // Slower 4.5s count duration
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%', // Triggers identical to the card entry
                    },
                    onUpdate: () => {
                        // Math.round strips decimals, toLocaleString injects the commas!
                        el.innerHTML = Math.round(counter.val).toLocaleString();
                    }
                });
            });

        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} className="metrics-section" style={{
            backgroundColor: '#50000B',
            padding: '120px 5%',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Heading */}
            <h2 style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                color: '#FFF',
                textAlign: 'center',
                marginBottom: '100px',
                fontWeight: 400
            }}>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--accent-gold)' }}>Wall Street Jr.</span> by the numbers
            </h2>

            {/* Metrics Grid */}
            <div style={{
                width: '100%',
                maxWidth: '1600px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '60px',
                alignItems: 'start'
            }}>
                {metricsData.map((metric, i) => (
                    <div key={i} className="metric-stat" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: '20px' // Separates number from text block
                    }}>
                        {/* Huge Gold Number with animated counting span */}
                        <div style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(3.5rem, 5vw, 4.5rem)', // ~70px max
                            color: 'var(--accent-gold)',
                            fontWeight: 500,
                            letterSpacing: '-1px',
                            lineHeight: 1
                        }}>
                            <span className="metric-number" data-val={metric.num}>
                                0
                            </span>
                            <span>{metric.suffix}</span>
                        </div>
                        
                        {/* Inner Divider - simulated via a gap or just white line */}
                        <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '15px 0' }} />

                        {/* Title */}
                        <h4 style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: '1.45rem', // 23px
                            color: '#FFF',
                            fontWeight: 600,
                            letterSpacing: '-0.5px',
                            margin: 0
                        }}>
                            {metric.title}
                        </h4>

                        {/* Description */}
                        <p style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: '1.2rem', // ~19px
                            color: '#FFF',
                            fontWeight: 500,
                            lineHeight: 1.4,
                            margin: 0,
                            maxWidth: '320px',
                            opacity: 0.9
                        }}>
                            {metric.desc}
                        </p>
                    </div>
                ))}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .metrics-section { padding: 60px 5% !important; }
                    .metrics-section h2 { font-size: clamp(2.2rem, 8vw, 3rem) !important; margin-bottom: 60px !important; }
                    .metrics-section .metric-stat { gap: 10px !important; }
                    .metrics-section .metric-number { font-size: clamp(2.5rem, 8vw, 3.5rem) !important; }
                }
            `}</style>
        </section>
    )
}

export default KeyMetrics

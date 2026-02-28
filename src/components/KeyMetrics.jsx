import { useEffect } from 'react'
import Section from './Section'
import gsap from 'gsap'

const KeyMetrics = () => {
    useEffect(() => {
        const counters = document.querySelectorAll('.metric-number')
        const ctx = gsap.context(() => {
            counters.forEach((counter) => {
                const targetValue = parseInt(counter.getAttribute('data-value'))
                const obj = { value: 0 }

                gsap.to(obj, {
                    value: targetValue,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: counter,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    },
                    onUpdate: () => {
                        counter.innerText = Math.floor(obj.value)
                    }
                })
            })
        })
        return () => ctx.revert()
    }, [])

    const metrics = [
        { label: 'Specialized Schools', value: 4, suffix: '+' },
        { label: 'Students', value: 2000, suffix: '+' },
        { label: 'Experienced Mentors', value: 10, suffix: '+ Years' },
        { label: 'Global Locations', value: 6, suffix: '+' }
    ]

    return (
        <Section id="metrics" style={{ padding: '3rem var(--container-padding)', background: 'var(--bg-primary)', borderTop: '1px solid rgba(212, 175, 55, 0.1)', borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    color: '#ffffff',
                    marginBottom: '4rem',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '4px'
                }}>
                    Facts & <span style={{ color: 'var(--accent-gold)' }}>Figures</span>
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    textAlign: 'center',
                    marginTop: '2rem'
                }}>
                    {metrics.map((metric, i) => (
                        <div key={i} style={{ padding: '2rem 1rem' }}>
                            <div style={{
                                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                                fontWeight: 800,
                                color: 'var(--accent-gold)',
                                marginBottom: '0.2rem',
                                lineHeight: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'baseline'
                            }}>
                                <span
                                    className="metric-number"
                                    data-value={metric.value}
                                    style={{ display: 'inline-block' }}
                                >
                                    0
                                </span>
                                <span style={{
                                    fontSize: '0.45em',
                                    marginLeft: '4px',
                                    fontWeight: 600,
                                    opacity: 0.8
                                }}>
                                    {metric.suffix}
                                </span>
                            </div>
                            <div style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontWeight: 600
                            }}>
                                {metric.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    )
}

export default KeyMetrics

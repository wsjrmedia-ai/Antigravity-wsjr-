import GlowCard from './GlowCard'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const schools = [
    {
        id: "sof",
        title: "School of Finance",
        description: "Understanding markets, capital, risk, and long-term value creation.",
        icon: "💰",
        gradient: "linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)"
    },
    {
        id: "sodi",
        title: "School of Design Intelligence & Media",
        description: "Exploring how design, communication, and media influence perception and decision-making.",
        icon: "🎨",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
        id: "soai",
        title: "School of AI & Automation",
        description: "Applying intelligent systems responsibly across modern workflows and organizations.",
        icon: "🤖",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
        id: "sobi",
        title: "School of Business Intelligence & Management",
        description: "Developing leaders capable of strategic thinking, system management, and informed execution.",
        icon: "📊",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
]

const SchoolsGrid = () => {
    const containerRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".school-card", {
                y: 50,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={containerRef} style={{
            padding: '8rem 2rem',
            background: 'var(--bg-primary)',
            position: 'relative',
            minHeight: '100vh'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{
                        color: '#ffffff',
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        marginBottom: '1rem',
                        fontWeight: 700
                    }}>Our <span style={{ color: '#d4af37' }}>Schools</span></h2>
                    <p style={{
                        color: '#a0a0a0',
                        fontSize: '1.2rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Four specialized schools designed to transform you into a financial leader
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    width: '100%',
                    padding: '0 var(--container-padding)'
                }}>
                    {schools.map((school, index) => (
                        <Link
                            key={school.id}
                            to={school.id === 'sof' ? '/school-of-finance' : `/course/${school.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <GlowCard
                                className="school-card"
                                style={{
                                    height: '100%',
                                    padding: '2.5rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Gradient overlay on top */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: school.gradient,
                                    opacity: 0.8
                                }}></div>

                                <div style={{
                                    fontSize: '3.5rem',
                                    marginBottom: '1.5rem',
                                    background: school.gradient,
                                    width: '90px',
                                    height: '90px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                                }}>{school.icon}</div>

                                <h3 style={{
                                    color: '#ffffff',
                                    marginBottom: '1rem',
                                    fontSize: '1.4rem',
                                    lineHeight: 1.3,
                                    fontWeight: 600
                                }}>
                                    {school.title}
                                </h3>

                                <p style={{
                                    color: '#a0a0a0',
                                    marginBottom: '1.5rem',
                                    flexGrow: 1,
                                    lineHeight: 1.6,
                                    fontSize: '0.95rem'
                                }}>
                                    {school.description}
                                </p>

                                <div style={{
                                    color: '#d4af37',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.95rem'
                                }}>
                                    Explore Program <span style={{
                                        transition: 'transform 0.3s',
                                        display: 'inline-block'
                                    }}>→</span>
                                </div>
                            </GlowCard>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SchoolsGrid

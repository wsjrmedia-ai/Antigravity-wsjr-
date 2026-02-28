import { useRef } from 'react'
import gsap from 'gsap'

const schools = [
    { title: "School of Finance", description: "Mastering the markets, valuation, and capital allocation.", color: "#d4af37" },
    { title: "School of Technology", description: "Building the future with code, AI, and systems architecture.", color: "#00f2fe" },
    { title: "School of Design", description: "Crafting experiences that shape human behavior.", color: "#f5576c" },
    { title: "School of Management", description: "Leading teams and organizations to global impact.", color: "#4CAF50" }
]

const SchoolIcon = ({ title, color }) => {
    switch (title) {
        case "School of Finance":
            return (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="35" width="6" height="15" rx="1" fill={color} opacity="0.6" className="candle-1" />
                    <rect x="22" y="20" width="6" height="30" rx="1" fill={color} className="candle-2" />
                    <rect x="34" y="28" width="6" height="22" rx="1" fill={color} opacity="0.8" className="candle-3" />
                    <rect x="46" y="15" width="6" height="35" rx="1" fill={color} className="candle-4" />
                    <path d="M5 55L55 5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" className="chart-line" />
                </svg>
            )
        case "School of Technology":
            return (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="8" stroke={color} strokeWidth="2" className="tech-core" />
                    <path d="M30 15V5M30 55V45M15 30H5M55 30H45" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                    <circle cx="30" cy="5" r="3" fill={color} className="node-pulse" />
                    <circle cx="30" cy="55" r="3" fill={color} className="node-pulse" style={{ animationDelay: '0.5s' }} />
                    <circle cx="5" cy="30" r="3" fill={color} className="node-pulse" style={{ animationDelay: '1s' }} />
                    <circle cx="55" cy="30" r="3" fill={color} className="node-pulse" style={{ animationDelay: '1.5s' }} />
                </svg>
            )
        case "School of Design":
            return (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 50C10 50 15 10 30 10C45 10 50 50 50 50" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="200" className="design-curve" />
                    <rect x="7" y="47" width="6" height="6" fill={color} rx="1" />
                    <rect x="47" y="47" width="6" height="6" fill={color} rx="1" />
                    <circle cx="30" cy="10" r="4" fill="#fff" stroke={color} strokeWidth="2" />
                </svg>
            )
        case "School of Management":
            return (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 5L50 15V35C50 45 40 52 30 55C20 52 10 45 10 35V15L30 5Z" stroke={color} strokeWidth="2" className="shield-outline" />
                    <path d="M30 15V45M20 30H40" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                    <circle cx="30" cy="30" r="4" fill={color} className="shield-core" />
                </svg>
            )
        default:
            return null
    }
}

const SchoolCard = ({ title, description, color, index }) => {
    const cardRef = useRef(null)

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
            y: -10,
            scale: 1.02,
            boxShadow: `0 20px 50px -10px ${color}50`,
            borderColor: color,
            duration: 0.4,
            ease: "back.out(1.7)"
        })
    }

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            y: 0,
            scale: 1,
            boxShadow: 'none',
            borderColor: 'rgba(255,255,255,0.1)',
            duration: 0.4,
            ease: "power2.out"
        })
    }

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '3rem 2rem',
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'background 0.3s, border-color 0.3s',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '320px',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    marginBottom: '2rem',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <SchoolIcon title={title} color={color} />
                </div>
                <h3 style={{
                    fontFamily: 'var(--font-hero)',
                    fontSize: '1.7rem',
                    marginBottom: '1.2rem',
                    color: '#fff',
                    fontWeight: 800
                }}>{title}</h3>
                <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    fontSize: '1rem',
                    fontWeight: 400
                }}>{description}</p>
            </div>

            <div style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: color,
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                Explore Program <span style={{ fontSize: '1.2rem' }}>→</span>
            </div>
        </div>
    )
}

const SchoolPreview = () => {
    return (
        <section id="schools" style={{
            padding: '8rem 2rem',
            background: 'var(--bg-primary)',
            position: 'relative',
            zIndex: 1
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        marginBottom: '1rem'
                    }}>World-Class Faculties</h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>Choose your path to mastery. Each school offers a rigorous, interdisciplinary curriculum designed by industry leaders.</p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {schools.map((school, i) => (
                        <SchoolCard key={i} {...school} index={i} />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes candleGrow {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.2); }
                }
                @keyframes chartLineDraw {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes techCorePulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
                @keyframes nodePulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.5); }
                }
                @keyframes curveDraw {
                    to { stroke-dashoffset: 0; }
                }
                @keyframes shieldFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .candle-1 { animation: candleGrow 3s ease-in-out infinite; transform-origin: bottom; }
                .candle-2 { animation: candleGrow 2.5s ease-in-out infinite; transform-origin: bottom; }
                .candle-3 { animation: candleGrow 4s ease-in-out infinite; transform-origin: bottom; }
                .candle-4 { animation: candleGrow 3.5s ease-in-out infinite; transform-origin: bottom; }
                
                .chart-line { animation: chartLineDraw 2s ease-out forwards; }
                
                .tech-core { animation: techCorePulse 3s ease-in-out infinite; transform-origin: center; }
                .node-pulse { animation: nodePulse 2s ease-in-out infinite; transform-origin: center; }
                
                .design-curve { animation: curveDraw 2.5s ease-out forwards; }
                
                .shield-outline { animation: shieldFloat 4s ease-in-out infinite; }
                .shield-core { animation: nodePulse 3s ease-in-out infinite; transform-origin: center; }
            `}</style>
        </section>
    )
}

export default SchoolPreview

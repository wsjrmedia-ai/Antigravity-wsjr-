import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GalaxyBackground from '../components/GalaxyBackground'

gsap.registerPlugin(ScrollTrigger)

const SchoolOfFinance = () => {
    const pageRef = useRef(null)
    const contentRefs = useRef([])

    useEffect(() => {
        window.scrollTo(0, 0)

        const ctx = gsap.context(() => {
            // Hero Animation
            gsap.from(".hero-content > *", {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            })

            // Section Stagger Animations
            contentRefs.current.forEach((el) => {
                if (el) {
                    gsap.from(el.children, {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    })
                }
            })
        }, pageRef)

        return () => ctx.revert()
    }, [])

    const sectionStyle = {
        padding: '3rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
    }

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '2.5rem',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        height: '100%'
    }

    const itemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        color: '#e0e0e0',
        fontSize: '1.05rem'
    }

    const syllabusItems = [
        {
            level: "LEVEL 1: FINANCE & MARKET FOUNDATIONS",
            items: ["Financial Markets & Instruments", "Investment & Portfolio Management", "Corporate Finance & Valuation", "Risk Management Frameworks"]
        },
        {
            level: "LEVEL 2: TRADING, DATA & SYSTEMS",
            items: ["Financial Markets & Trading", "Quantitative Thinking for Finance"]
        },
        {
            level: "LEVEL 3: AI FOR FINANCE & INVESTMENTS",
            items: ["Introduction to AI in Finance", "AI for Market Analysis & Trading", "AI for Portfolio Management & Wealth", "AI for Fundamental & News Analysis", "AI Automation for Finance Professionals"]
        },
        {
            level: "LEVEL 4: BUSINESS, ETHICS & REAL-WORLD APPLICATION",
            items: ["AI in Asset Management & Advisory Firms", "Wealth, Lifestyle & Legacy Planning", "Capstone Project"]
        }
    ]

    const campuses = [
        { name: "Cochin", desc: "The principal campus in India, supporting foundational instruction and academic continuity." },
        { name: "Bangalore", desc: "Technology-aligned environment supporting applied finance, systems thinking, and automation." },
        { name: "Mumbai", desc: "Positioned within India’s financial capital, emphasizing market context and enterprise exposure." },
        { name: "Delhi", desc: "Located within a policy landscape, supporting governance and systems-level financial understanding." }
    ]

    return (
        <div ref={pageRef} className="sof-root" style={{ background: 'var(--bg-primary)', color: 'white', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            <GalaxyBackground />

            {/* Hero Section */}
            <section className="hero-content" style={{ ...sectionStyle, paddingTop: '7rem', paddingBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, marginBottom: '1.5rem', color: '#d4af37' }}>
                    School of Finance
                </h1>
                <p style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto', opacity: 0.9, lineHeight: 1.6 }}>
                    Learning Structure & Delivery Model
                </p>
                <div style={{ marginTop: '2rem', fontSize: '1.1rem', maxWidth: '700px', margin: '2rem auto', opacity: 0.7 }}>
                    Deep financial understanding through a blended academic model, combining online learning with physical campus-based classrooms.
                </div>
            </section>

            {/* Online Learning Section */}
            <section ref={el => contentRefs.current[0] = el} style={sectionStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    <div style={cardStyle}>
                        <h2 style={{ color: '#d4af37', marginBottom: '1.5rem' }}>School of Finance Online</h2>
                        <p style={{ marginBottom: '2rem', opacity: 0.8 }}>The global academic backbone, providing structured digital delivery and live mentorship.</p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={itemStyle}><span style={{ color: '#d4af37' }}>◆</span> Core financial foundations</li>
                            <li style={itemStyle}><span style={{ color: '#d4af37' }}>◆</span> Market structure and asset-class understanding</li>
                            <li style={itemStyle}><span style={{ color: '#d4af37' }}>◆</span> Risk, capital allocation, and decision-making</li>
                            <li style={itemStyle}><span style={{ color: '#d4af37' }}>◆</span> Live mentorship and guided discussions</li>
                        </ul>
                    </div>
                    <div style={{ ...cardStyle, border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Academic Standards</h2>
                        <p style={{ lineHeight: 1.8, opacity: 0.8 }}>
                            SOF Online maintains consistency of curriculum, academic standards, and evaluation across regions.
                            Ensuring accessibility without compromising intellectual discipline, structure, or depth.
                        </p>
                    </div>
                </div>
            </section>

            {/* Syllabus Section */}
            <section ref={el => contentRefs.current[1] = el} style={sectionStyle}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem', color: '#d4af37' }}>Syllabus</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {syllabusItems.map((level, idx) => (
                        <div key={idx} style={{ ...cardStyle, padding: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', color: '#d4af37', marginBottom: '1.5rem', letterSpacing: '1px' }}>{level.level}</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {level.items.map((item, i) => (
                                    <li key={i} style={{ fontSize: '0.95rem', marginBottom: '0.8rem', opacity: 0.8, borderLeft: '2px solid #d4af37', paddingLeft: '1rem' }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Campus Section */}
            <section ref={el => contentRefs.current[2] = el} style={sectionStyle}>
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Campus-Based Classrooms</h2>
                <p style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem', opacity: 0.7 }}>
                    Applied learning environments emphasizing judgment, clarity of thought, and real-world application.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {campuses.map((campus, idx) => (
                        <div key={idx} style={{ ...cardStyle, textAlign: 'center' }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d4af37'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'}>
                            <h3 style={{ color: '#d4af37', marginBottom: '1rem' }}>{campus.name}</h3>
                            <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6 }}>{campus.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Philosophy Section */}
            <section ref={el => contentRefs.current[3] = el} style={{ ...sectionStyle, background: 'rgba(212, 175, 55, 0.05)', borderRadius: '40px', padding: '5rem 3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>One Academic Framework. Multiple Formats.</h2>
                    <p style={{ opacity: 0.7 }}>Governed by a single academic philosophy</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    {[
                        { t: "Education", b: "before execution" },
                        { t: "Understanding", b: "before outcomes" },
                        { t: "Discipline", b: "before returns" },
                        { t: "Structure", b: "before scale" }
                    ].map((v, i) => (
                        <div key={i}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d4af37' }}>{v.t}</div>
                            <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>{v.b}</div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.8, fontStyle: 'italic' }}>
                    "Assessments prioritize judgment over memorization and understanding over speed."
                </div>
            </section>

            {/* Purpose & Global Reality */}
            <section ref={el => contentRefs.current[4] = el} style={{ ...sectionStyle, textAlign: 'center', paddingBottom: '5rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ color: '#d4af37', marginBottom: '1.5rem' }}>Purpose</h2>
                    <p style={{ fontSize: '1.4rem', lineHeight: 1.6, marginBottom: '3rem' }}>
                        The School of Finance exists to help individuals understand how finance truly works and to develop the judgment and discipline required to operate responsibly within it.
                    </p>
                    <Link to="/signup" className="glaze-button" style={{
                        padding: '1.2rem 3rem',
                        color: '#000',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        display: 'inline-block'
                    }}>
                        Start Your Journey
                    </Link>
                </div>
            </section>

            <style>{`
                @media (max-width: 768px) {
                    .sof-root .hero-content { padding-top: 5rem !important; }
                    .sof-root .hero-content p { font-size: 1.15rem !important; }
                    .sof-root .hero-content > div { font-size: 1rem !important; margin-top: 1.2rem !important; }
                    .sof-root section { padding: 2rem 1rem !important; }
                    .sof-root section[style*="padding: 5rem 3rem"] {
                        padding: 3rem 1.2rem !important;
                        border-radius: 24px !important;
                    }
                    .sof-root section h2 {
                        font-size: clamp(1.6rem, 6vw, 2rem) !important;
                        margin-bottom: 1.5rem !important;
                    }
                    .sof-root [style*="padding: 2.5rem"] { padding: 1.8rem !important; }
                    .sof-root [style*="marginBottom: '4rem'"],
                    .sof-root [style*="margin: '0 auto 4rem'"] { margin-bottom: 2rem !important; }
                    .sof-root [style*="fontSize: '1.4rem'"] { font-size: 1.1rem !important; }
                    .sof-root .glaze-button { padding: 1rem 2rem !important; font-size: 0.9rem !important; }
                }
                .glaze-button {
                    background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%);
                    background-size: 200% auto;
                    border-radius: 50px;
                    transition: 0.5s;
                    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
                }
                .glaze-button:hover {
                    background-position: right center;
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4);
                }
            `}</style>
        </div>
    )
}

export default SchoolOfFinance

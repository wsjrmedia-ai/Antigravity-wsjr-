import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GalaxyBackground from '../components/GalaxyBackground'
import SEO from '../components/SEO'

gsap.registerPlugin(ScrollTrigger)

const SyllabusPage = () => {
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
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    })
                }
            })
        }, pageRef)

        return () => ctx.revert()
    }, [])

    const sectionStyle = {
        padding: '4rem 1.5rem',
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
        marginBottom: '2rem'
    }

    const titleStyle = {
        color: '#d4af37',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        letterSpacing: '0.5px'
    }

    const textStyle = {
        color: '#e0e0e0',
        fontSize: '1.05rem',
        lineHeight: '1.7',
        opacity: 0.85
    }

    const syllabusLevels = [
        {
            title: "LEVEL 1 — FINANCE & MARKET FOUNDATIONS",
            subtitle: "Understanding How Finance Actually Works",
            desc: "Level 1 lays the intellectual groundwork for everything that follows. Before you can allocate capital, analyze a business, or manage risk, you need to understand the systems those activities operate within. This level builds that understanding — clearly, rigorously, and without shortcuts.",
            modules: [
                {
                    name: "1. Financial Markets & Instruments",
                    desc: "A comprehensive introduction to how global financial markets are structured, how different asset classes behave, and how instruments — from equities and bonds to derivatives and currencies — function within a broader economic system. You will learn to read markets, not just describe them."
                },
                {
                    name: "2. Investment & Portfolio Management",
                    desc: "Understand the principles behind building and managing an investment portfolio. This module covers asset allocation, risk-return trade-offs, diversification, and the decision-making frameworks used by professional fund managers and institutional investors."
                },
                {
                    name: "3. Corporate Finance & Valuation",
                    desc: "Learn how businesses raise capital, allocate it internally, and are valued by external investors. Topics include discounted cash flow analysis, comparable company analysis, capital structure, and the financial levers that determine enterprise value."
                },
                {
                    name: "4. Risk Management Frameworks",
                    desc: "Risk is not something to avoid — it is something to understand, measure, and structure around. This module introduces the core frameworks for identifying, quantifying, and managing financial risk, drawing on methods used by leading institutions."
                }
            ]
        },
        {
            title: "LEVEL 2 — TRADING, DATA & SYSTEMS",
            subtitle: "Moving from Understanding to Application",
            desc: "Level 2 bridges theory and practice. You will begin applying your foundational knowledge to real market behavior — understanding how trading works, how data drives decisions, and how quantitative thinking sharpens financial judgment.",
            modules: [
                {
                    name: "5. Financial Markets & Trading",
                    desc: "A practical exploration of how financial markets operate in real time. This module covers market microstructure, order types, execution mechanics, and the behavioral dynamics that shape price discovery. Students will develop an operational understanding of how capital moves through markets."
                },
                {
                    name: "6. Quantitative Thinking for Finance",
                    desc: "Numbers tell stories — if you know how to read them. This module introduces the quantitative tools and statistical reasoning used in modern finance: probability, distributions, regression, and data interpretation. No advanced mathematics required. What is required is precision of thought."
                }
            ]
        },
        {
            title: "LEVEL 3 — AI FOR FINANCE & INVESTMENTS",
            subtitle: "The Next Frontier of Financial Intelligence",
            desc: "Artificial intelligence is not replacing financial professionals — it is separating those who understand it from those who do not. Level 3 gives students a genuine working knowledge of AI applications across the investment landscape, from market analysis to portfolio optimization and workflow automation.",
            modules: [
                {
                    name: "7. Introduction to AI in Finance",
                    desc: "A foundational module that demystifies artificial intelligence for finance professionals. You will learn what AI can and cannot do, how machine learning models are trained and evaluated, and where AI is already reshaping financial decision-making. This is the starting point for every module that follows."
                },
                {
                    name: "8. AI for Market Analysis & Trading",
                    desc: "Understand how AI systems analyze market data, identify patterns, and support trading decisions. Topics include sentiment analysis, price prediction models, algorithmic strategy evaluation, and the practical limitations every AI-assisted trader must understand."
                },
                {
                    name: "9. AI for Portfolio Management & Wealth",
                    desc: "Explore how AI is transforming portfolio construction, rebalancing, and performance attribution. Students will examine how robo-advisory platforms work, how AI supports risk-adjusted return optimization, and what this means for the future of wealth management."
                },
                {
                    name: "10. AI for Fundamental & News Analysis",
                    desc: "Financial decisions are driven by information. This module covers how AI tools process earnings reports, macroeconomic data, and real-time news to surface signals that inform investment decisions — and how professionals evaluate the quality and reliability of AI-generated insight."
                },
                {
                    name: "11. AI Automation for Finance Professionals",
                    desc: "Practical, hands-on exposure to automating financial workflows using AI tools. From data aggregation and report generation to client communication and compliance monitoring, this module shows how finance professionals can use AI to work with greater speed and fewer errors."
                }
            ]
        },
        {
            title: "LEVEL 4 — BUSINESS, ETHICS & REAL-WORLD APPLICATION",
            subtitle: "From Individual Skill to Institutional Readiness",
            desc: "Level 4 synthesizes everything that came before it. Students examine how financial knowledge, AI fluency, and long-term thinking combine in the real institutional environments where careers are built — and close with a Capstone Project that tests everything learned.",
            modules: [
                {
                    name: "12. AI in Asset Management & Advisory Firms",
                    desc: "A module designed for students entering or advancing within professional financial organizations. You will study how asset managers and advisory firms are integrating AI into their investment processes, client relationships, and operational infrastructure — and what this requires from the professionals within those firms."
                },
                {
                    name: "13. Wealth, Lifestyle & Legacy Planning",
                    desc: "True financial mastery extends beyond markets. This module addresses the personal and structural dimensions of long-term wealth: estate planning, tax efficiency, generational wealth transfer, philanthropy, and the lifestyle decisions that shape financial outcomes over decades. Thoughtful, grounded, and often overlooked."
                },
                {
                    name: "14. Capstone Project",
                    desc: "The Capstone is where everything comes together. Working under faculty guidance, students complete a comprehensive financial project that integrates market analysis, AI application, and strategic decision-making. This is not a written exam — it is a demonstration of judgment, and it is treated as such."
                }
            ]
        }
    ]

    return (
        <div ref={pageRef} className="syllabus-root" style={{ background: 'var(--bg-primary)', color: 'white', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            <SEO
                title="School of Finance Curriculum"
                description="Wall Street Jr. School of Finance curriculum: 14 modules across 4 levels — markets, quantitative analysis, AI in finance, and wealth planning. Dubai-based, built for Indian and UAE students."
                path="/school-of-finance/syllabus"
                schema={{
                    '@context': 'https://schema.org',
                    '@type': 'Course',
                    name: 'Wall Street Jr. School of Finance — Curriculum',
                    description: '14-module curriculum across foundations, markets, quantitative analysis, AI in finance, and wealth planning.',
                    url: 'https://wsjrschool.com/school-of-finance/syllabus',
                    provider: { '@id': 'https://wsjrschool.com/#organization' },
                    educationalCredentialAwarded: 'Wall Street Jr. School of Finance Certificate',
                    inLanguage: 'en',
                }}
            />
            <GalaxyBackground />

            {/* Hero Section */}
            <section className="hero-content" style={{ ...sectionStyle, paddingTop: '10rem', paddingBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: '#d4af37', lineHeight: 1.1 }}>
                    The School of Finance Curriculum<br /><span style={{ color: '#fff' }}>Built for the Real World</span>
                </h1>
                <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', fontWeight: 400, marginBottom: '2rem', opacity: 0.9 }}>
                    14 Modules. 4 Progressive Levels. One Coherent Path from Foundations to Mastery.
                </h2>
                <div style={{ marginTop: '2rem', fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', opacity: 0.8, lineHeight: 1.8 }}>
                    <p style={{ marginBottom: '1rem' }}>
                        Most finance programs teach you to pass tests. Our curriculum is designed to help you think. Every module in the Wall Street Jr. School of Finance builds on the last — moving from foundational market knowledge through quantitative analysis, artificial intelligence applications, and real-world wealth planning.
                    </p>
                    <p>
                        By the time you reach the Capstone Project, you will not be summarizing theory. You will be applying it, defending decisions, and demonstrating the kind of judgment that institutions actually reward.
                    </p>
                </div>
            </section>

            {/* Curriculum Breakdown */}
            <div style={{ position: 'relative' }}>
                {/* Vertical Line Connecting Levels */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent)', zIndex: 1, display: 'none' }} className="timeline-line"></div>

                {syllabusLevels.map((level, idx) => (
                    <section key={idx} ref={el => contentRefs.current[idx] = el} style={sectionStyle}>
                        <div style={{ ...cardStyle, maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'inline-block', background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', padding: '0.5rem 1.5rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '2px' }}>
                                    {level.title.split(' — ')[0]}
                                </div>
                                <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1rem' }}>{level.title.split(' — ')[1]}</h2>
                                <h3 style={{ fontSize: '1.3rem', color: '#d4af37', marginBottom: '1rem' }}>{level.subtitle}</h3>
                                <p style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: 1.6, maxWidth: '750px', margin: '0 auto' }}>{level.desc}</p>
                            </div>

                            <div style={{ display: 'grid', gap: '2rem' }}>
                                {level.modules.map((mod, i) => (
                                    <div key={i} style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '2rem', borderRadius: '16px', borderLeft: '4px solid #d4af37' }}>
                                        <h4 style={titleStyle}>{mod.name}</h4>
                                        <p style={textStyle}>{mod.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            {/* Learning Structure & Delivery */}
            <section ref={el => contentRefs.current[syllabusLevels.length] = el} style={sectionStyle}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#d4af37', marginBottom: '1rem', lineHeight: 1.2 }}>Learning Structure & Delivery</h2>
                    <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.3 }}>One Academic Framework. Multiple Formats.</h3>
                    <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8 }}>
                        The School of Finance delivers its curriculum through a blended model — combining structured online learning with physical, campus-based instruction. Both formats are governed by the same academic philosophy, held to the same standards, and built around the same core conviction: that genuine understanding must come before execution.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={cardStyle}>
                        <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '1rem' }}>School of Finance Online</h3>
                        <p style={textStyle}>Our online learning platform serves as the global backbone of the School of Finance — accessible to students across regions without compromising on intellectual depth or academic structure.</p>
                        <p style={{ ...textStyle, marginTop: '1rem', fontWeight: 'bold' }}>Students gain access to:</p>
                        <ul style={{ ...textStyle, listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Core financial foundations and conceptual frameworks</li>
                            <li style={{ marginBottom: '0.5rem' }}>Market structure and asset-class understanding</li>
                            <li style={{ marginBottom: '0.5rem' }}>Risk, capital allocation, and decision-making models</li>
                            <li style={{ marginBottom: '0.5rem' }}>Live mentorship sessions and faculty-led discussions</li>
                        </ul>
                        <p style={{ ...textStyle, marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.7 }}>
                            Online delivery maintains full curriculum consistency and rigorous evaluation standards, ensuring that geography is never a barrier to quality education.
                        </p>
                    </div>

                    <div style={{ ...cardStyle, background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)' }}>
                        <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '1rem' }}>Campus-Based Classrooms</h3>
                        <p style={textStyle}>Physical campuses bring the School of Finance to life in an applied learning environment. Classroom instruction at Wall Street Jr. is not passive — it is structured around the kinds of conversations, debates, and real-time analysis that sharpen financial judgment.</p>
                        <p style={{ ...textStyle, marginTop: '1rem', fontWeight: 'bold' }}>Campus learning emphasizes:</p>
                        <ul style={{ ...textStyle, listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Practical interpretation of live market behavior</li>
                            <li style={{ marginBottom: '0.5rem' }}>Mentorship-driven, small-group guidance</li>
                            <li style={{ marginBottom: '0.5rem' }}>Discussion-led instruction over lecture-heavy delivery</li>
                            <li style={{ marginBottom: '0.5rem' }}>Case-based analysis drawn from real institutional scenarios</li>
                        </ul>
                        <p style={{ ...textStyle, marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.7 }}>
                            These environments allow students to engage directly with faculty and peers, developing the clarity of thought and decision-making instincts that no online module can fully replicate on its own.
                        </p>
                    </div>
                </div>
            </section>

            {/* Campus Locations */}
            <section ref={el => contentRefs.current[syllabusLevels.length + 1] = el} style={{ ...sectionStyle, background: 'rgba(0,0,0,0.3)', padding: '5rem 1.5rem', maxWidth: 'none' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', color: '#d4af37', marginBottom: '1rem' }}>Where We Teach</h2>
                        <h3 style={{ fontSize: '1.5rem', opacity: 0.9 }}>School of Finance Campus Network</h3>
                        <p style={{ maxWidth: '700px', margin: '2rem auto 0', fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.8 }}>
                            The School of Finance currently operates across five physical locations, each functioning within a unified academic framework. Every campus follows the same curriculum philosophy, assessment standards, and quality benchmarks.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { name: "UAE", title: "Global Headquarters", desc: "Our UAE campus serves as the academic governance hub for the entire School of Finance. As the global headquarters of Wall Street Jr. Academy, UAE is where institutional strategy, faculty leadership, and curriculum development are centered. Students here sit at the heart of one of the world's most dynamic financial centers." },
                            { name: "Cochin", title: "Principal India Campus", desc: "The Cochin campus is the primary academic center in India, supporting foundational instruction and providing academic continuity for students across the School of Finance network. It is a structured, faculty-led learning environment with strong ties to the broader institutional framework." },
                            { name: "Bangalore", title: "Technology-Aligned Campus", desc: "Bangalore's learning environment reflects the city it sits in: forward-thinking, systems-oriented, and connected to the technology landscape that is reshaping modern finance. This campus supports applied finance instruction with an emphasis on automation and the intersection of technology and capital markets." },
                            { name: "Mumbai", title: "Financial Capital Campus", desc: "Positioned in India's financial and commercial capital, the Mumbai campus gives students a direct window into real market environments, enterprise dynamics, and the kind of institutional exposure that accelerates learning. If you want to understand how finance operates in practice, Mumbai is a uniquely powerful place." },
                            { name: "Delhi", title: "Policy & Institutional Campus", desc: "The Delhi campus operates within a landscape defined by policy, governance, and large-scale institutional decision-making. Instruction here carries a particular emphasis on understanding finance from a systems and governance perspective — how capital flows within and around institutional structures." }
                        ].map((campus, idx) => (
                            <div key={idx} style={{ ...cardStyle, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.2rem' }}>{campus.name}</h3>
                                <h4 style={{ color: '#d4af37', fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{campus.title}</h4>
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8 }}>{campus.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Philosophy & Purpose */}
            <section ref={el => contentRefs.current[syllabusLevels.length + 2] = el} style={sectionStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', maxWidth: '900px', margin: '0 auto' }}>

                    <div>
                        <h2 style={{ fontSize: '2.5rem', color: '#d4af37', marginBottom: '1rem', textAlign: 'center' }}>How We Teach — and Why It Matters</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '2rem', textAlign: 'center' }}>
                            The way finance is taught matters as much as what is taught. At the School of Finance, we have built our academic approach around four principles that we believe are non-negotiable for producing capable, ethical financial professionals:
                        </p>

                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {[
                                { title: "Education before execution", desc: "Students must understand a concept before they apply it. We do not rush to action." },
                                { title: "Understanding before outcomes", desc: "We are not in the business of producing people who can follow a checklist. We develop people who understand why the checklist exists." },
                                { title: "Discipline before returns", desc: "The instinct to chase results is one of the most common causes of financial failure. We teach the habits that prevent it." },
                                { title: "Structure before scale", desc: "Whether in personal finance or institutional investment, scale without structure is fragile. We build structure first." }
                            ].map((item, idx) => (
                                <div key={idx} style={{ background: 'rgba(212, 175, 55, 0.05)', padding: '1.5rem 2rem', borderLeft: '3px solid #d4af37', borderRadius: '0 12px 12px 0' }}>
                                    <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', opacity: 0.8, marginTop: '2rem', textAlign: 'center', color: '#d4af37' }}>
                            Our assessments reflect these values. We prioritize judgment over memorization and application over recall — because those are the qualities that financial careers actually demand.
                        </p>
                    </div>

                    <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(20,20,20,0.8), rgba(0,0,0,0.9))', padding: '4rem 2rem', borderRadius: '24px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                        <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1.5rem' }}>Why the School of Finance Exists</h2>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '1.5rem' }}>
                            Finance shapes how resources are allocated, how risks are distributed, and how wealth is built or eroded over time. It is one of the most consequential disciplines in the modern world — and one of the most widely misunderstood.
                        </p>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.8, marginBottom: '2rem' }}>
                            The School of Finance exists to change that. We are here to help individuals understand how finance truly works: not just the mechanics, but the judgment, the ethics, and the discipline required to operate responsibly within it.
                        </p>
                        <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#d4af37' }}>
                            Our graduates do not just know finance. They think like financial professionals — clearly, carefully, and with the long view in mind.
                        </p>

                        <div style={{ marginTop: '3rem' }}>
                            <Link to="/signup" className="glaze-button" style={{
                                padding: '1.2rem 3rem',
                                color: '#000',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                textDecoration: 'none',
                                display: 'inline-block',
                                borderRadius: '50px',
                                background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #d4af37 100%)',
                                backgroundSize: '200% auto',
                                transition: '0.5s',
                                boxShadow: '0 10px 20px rgba(212, 175, 55, 0.3)'
                            }}>
                                Apply to the Academy
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            <style>{`
                @media (min-width: 768px) {
                    .timeline-line {
                        display: block !important;
                    }
                }
                @media (max-width: 768px) {
                    .syllabus-root section { padding: 2.5rem 1rem !important; }
                    .syllabus-root .hero-content { padding-top: 6rem !important; padding-bottom: 2.5rem !important; }
                    .syllabus-root .hero-content > div { font-size: 1rem !important; line-height: 1.6 !important; }
                    .syllabus-root section h2 { font-size: clamp(1.6rem, 6vw, 2.1rem) !important; }
                    .syllabus-root section h3 { font-size: 1.1rem !important; }
                    .syllabus-root [style*="padding: 2.5rem"] { padding: 1.5rem !important; }
                    .syllabus-root [style*="padding: '2rem'"] { padding: 1.25rem !important; }
                    .syllabus-root [style*="padding: '4rem 2rem'"] { padding: 2.5rem 1.5rem !important; }
                    .syllabus-root [style*="padding: '5rem 1.5rem'"] { padding: 3rem 1rem !important; }
                    .syllabus-root [style*="marginBottom: '4rem'"] { margin-bottom: 2rem !important; }
                    .syllabus-root [style*="marginBottom: '3rem'"] { margin-bottom: 1.75rem !important; }
                    .syllabus-root [style*="fontSize: '1.8rem'"] { font-size: 1.25rem !important; }
                    .syllabus-root [style*="fontSize: '1.5rem'"] { font-size: 1.15rem !important; }
                    .syllabus-root [style*="fontSize: '1.3rem'"] { font-size: 1.05rem !important; }
                    .syllabus-root [style*="fontSize: '1.1rem'"] { font-size: 1rem !important; }
                }
                .glaze-button:hover {
                    background-position: right center !important;
                    transform: translateY(-3px) !important;
                    box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4) !important;
                }
            `}</style>
        </div>
    )
}

export default SyllabusPage

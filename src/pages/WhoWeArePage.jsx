import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GalaxyBackground from '../components/GalaxyBackground'

gsap.registerPlugin(ScrollTrigger)

const WhoWeArePage = () => {
    const pageRef = useRef(null)
    const contentRefs = useRef([])

    // Update document title and meta description for SEO
    useEffect(() => {
        document.title = "Who We Are | Wall Street Jr. Academy — UAE Finance & Business Institution"
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
            metaDescription.setAttribute("content", "Wall Street Jr. Academy is a UAE-headquartered global institution preparing finance, technology, design, and management professionals for real-world leadership. Led by Harvard-educated faculty with JP Morgan and Bank of America experience. Explore our story, values, and global campus")
        } else {
            const meta = document.createElement('meta')
            meta.name = "description"
            meta.content = "Wall Street Jr. Academy is a UAE-headquartered global institution preparing finance, technology, design, and management professionals for real-world leadership. Led by Harvard-educated faculty with JP Morgan and Bank of America experience. Explore our story, values, and global campus"
            document.head.appendChild(meta)
        }
    }, [])

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
        padding: '5rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
    }

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '3rem',
        border: '1px solid rgba(212, 175, 55, 0.15)',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        height: '100%'
    }

    const headingStyle = {
        color: '#d4af37',
        fontSize: '2.5rem',
        marginBottom: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center'
    }

    const textStyle = {
        color: '#e0e0e0',
        fontSize: '1.15rem',
        lineHeight: '1.8',
        opacity: 0.85,
        marginBottom: '1.5rem'
    }

    return (
        <div ref={pageRef} className="wwa-root" style={{ background: 'var(--bg-primary)', color: 'white', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
            <style>{`
                @media (max-width: 768px) {
                    .wwa-grid-350 { grid-template-columns: 1fr !important; gap: 2rem !important; }
                    .wwa-grid-300 { grid-template-columns: 1fr !important; }
                    .wwa-grid-280 { grid-template-columns: 1fr !important; }
                    .wwa-card { padding: 1.5rem !important; }
                    .wwa-hero { padding-top: 6rem !important; }
                    /* Shared section + card scaling on tablets */
                    .wwa-root h1 { font-size: clamp(2rem, 8vw, 2.8rem) !important; line-height: 1.15 !important; }
                    .wwa-root h1 span { font-size: clamp(1.3rem, 6vw, 2rem) !important; }
                    .wwa-root h2 { font-size: clamp(1.6rem, 6vw, 2rem) !important; }
                    .wwa-root h3 { font-size: 1.2rem !important; }
                    .wwa-root p { font-size: 1rem !important; line-height: 1.65 !important; }
                    .wwa-root section { padding: 3rem 1.25rem !important; }
                    .wwa-root .glaze-button { padding: 1rem 2rem !important; font-size: 0.9rem !important; }
                    /* Card-like panels inside flex rows */
                    .wwa-root section > div[style*="padding: 2.5rem"],
                    .wwa-root section > div > div[style*="padding: 2.5rem"] { padding: 1.6rem !important; gap: 1rem !important; }
                    .wwa-root section > div > div[style*="padding: 3rem"] { padding: 1.6rem !important; border-radius: 18px !important; }
                }
                @media (max-width: 480px) {
                    .wwa-section { padding: 2.5rem 1rem !important; }
                    .wwa-root section { padding: 2.5rem 1rem !important; }
                    .wwa-root h1 { font-size: clamp(1.8rem, 9vw, 2.4rem) !important; }
                    .wwa-root h2 { font-size: clamp(1.4rem, 7vw, 1.8rem) !important; }
                }
            `}</style>
            <GalaxyBackground />

            {/* Hero Section */}
            <section className="hero-content wwa-hero wwa-section" style={{ ...sectionStyle, paddingTop: '10rem', paddingBottom: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: '#d4af37', lineHeight: 1.1 }}>
                    We Are Wall Street Jr. Academy<br /><span style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 3rem)' }}>A Different Kind of Institution</span>
                </h1>
                <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', fontWeight: 400, marginBottom: '2.5rem', opacity: 0.9 }}>
                    Built in UAE. Grounded in Institutional Discipline. Designed for the World.
                </h2>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <p style={{ ...textStyle, fontSize: '1.25rem' }}>
                        There are thousands of finance courses available today. Most of them teach you what to do. Very few teach you how to think.
                    </p>
                    <p style={{ ...textStyle, fontSize: '1.25rem' }}>
                        Wall Street Jr. Academy was founded on the conviction that real financial education — the kind that produces professionals capable of leading institutions, managing capital, and making sound decisions under pressure — requires more than content delivery. It requires a disciplined framework, experienced mentorship, and an environment serious enough to match the ambitions of the people inside it.
                    </p>
                    <p style={{ ...textStyle, fontSize: '1.25rem', color: '#d4af37', fontWeight: 600 }}>
                        That is what we have built here. And we are just getting started.
                    </p>
                </div>
            </section>

            {/* Our Story */}
            <section ref={el => contentRefs.current[0] = el} style={sectionStyle}>
                <div style={{ ...cardStyle }}>
                    <h2 style={headingStyle}>How Wall Street Jr. Academy Came to Be</h2>
                    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
                        <p style={textStyle}>
                            Wall Street Jr. Academy began with a straightforward observation: the gap between what financial education typically offers and what the industry actually demands is enormous — and it is growing.
                        </p>
                        <p style={textStyle}>
                            Most programs are built around academic accreditation, not real-world performance. They optimize for passing exams, not for developing the judgment to navigate a complex market, lead a team through a difficult period, or make a capital allocation decision with imperfect information.
                        </p>
                        <p style={textStyle}>
                            The Academy was founded to close that gap. Drawing on direct experience at some of the world's leading financial institutions, our founders designed a curriculum and delivery model that treats students as future professionals from day one — not as students to be tested, but as thinkers to be developed.
                        </p>
                        <p style={textStyle}>
                            We opened our global headquarters in UAE because UAE represents what we believe finance education should be: internationally oriented, commercially serious, and built for the future rather than the past.
                        </p>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section ref={el => contentRefs.current[1] = el} style={sectionStyle}>
                <div className="wwa-grid-350" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ ...headingStyle, textAlign: 'left' }}>Led by People Who Have Done the Work</h2>
                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>Vishnu Das</h3>
                        <p style={{ ...textStyle, fontStyle: 'italic', color: '#d4af37' }}>
                            Harvard-educated capital architect. Direct institutional roles at JP Morgan and Bank of America.
                        </p>
                        <p style={textStyle}>
                            Vishnu's approach to education is the same as his approach to capital: long-term, disciplined, and grounded in first principles. He founded the Academy not to build another course platform, but to create a genuine institution — one with the academic seriousness of a great university and the practical relevance of a top-tier financial firm.
                        </p>
                        <p style={textStyle}>
                            Under his leadership, Wall Street Jr. has grown from a single program to a multi-school academy operating across six locations globally, with a faculty and mentor network drawn from the highest levels of finance, technology, design, and management.
                        </p>
                    </div>

                    <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(0,0,0,0.5))', padding: '3rem', borderRadius: '24px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                        <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '1.5rem' }}>Our Faculty & Mentor Philosophy</h3>
                        <p style={textStyle}>
                            We do not hire academics who have never practiced finance. Our faculty and mentors are practitioners first — professionals who have operated within the institutions and markets our students are preparing to enter.
                        </p>
                        <p style={{ ...textStyle, marginBottom: 0 }}>
                            Every mentor within the Wall Street Jr. network is expected to bring direct, real-world experience into their instruction. That means the examples are real, the case studies are drawn from actual decisions, and the guidance is grounded in what actually matters in a professional setting.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section ref={el => contentRefs.current[2] = el} style={{ ...sectionStyle, background: 'rgba(0,0,0,0.3)', padding: '5rem 1.5rem', maxWidth: 'none' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ ...headingStyle, marginBottom: '4rem' }}>What We Stand For</h2>

                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '1.5rem' }}>Our Mission</h3>
                        <p style={{ fontSize: '1.4rem', lineHeight: 1.8, maxWidth: '900px', margin: '0 auto', color: '#d4af37', fontStyle: 'italic' }}>
                            "To prepare individuals for judgment and leadership across finance, technology, design, and management — by delivering education that is institutionally rigorous, practically relevant, and genuinely committed to long-term value creation for every student."
                        </p>
                    </div>

                    <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '3rem', textAlign: 'center' }}>Our Core Values</h3>
                    <div className="wwa-grid-300" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: "Institutional Discipline", icon: "🏛️", desc: "We apply banking-grade rigor to everything we build. Standards are not negotiable." },
                            { title: "Education Before Execution", icon: "📚", desc: "We will not rush students toward action before they have the understanding to act wisely." },
                            { title: "Long-Term Thinking", icon: "🔭", desc: "We optimize for careers and lives, not for short-term metrics or superficial outcomes." },
                            { title: "Ethical Responsibility", icon: "⚖️", desc: "Finance without ethics is fragile. We develop professionals who understand both." },
                            { title: "Genuine Mentorship", icon: "🤝", desc: "We believe that access to experienced, honest guidance is one of the most valuable things an institution can provide. We provide it." }
                        ].map((val, idx) => (
                            <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '16px', borderTop: '3px solid #d4af37', textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{val.icon}</div>
                                <h4 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem' }}>{val.title}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section ref={el => contentRefs.current[3] = el} style={sectionStyle}>
                <h2 style={headingStyle}>Why Wall Street Jr. Is Not Like Other Programs</h2>
                <p style={{ textAlign: 'center', fontSize: '1.2rem', opacity: 0.8, marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem' }}>
                    We have thought carefully about this question, because we think it is the right question for a prospective student to ask.
                </p>

                <div style={{ display: 'grid', gap: '2.5rem' }}>
                    {[
                        { title: "We are not a certificate factory.", desc: "Credentials matter, but they are not the point. The point is whether you can think clearly, allocate wisely, and lead confidently when the situation demands it. Our programs are designed to build those capabilities, not to issue paper." },
                        { title: "We are not a trading community or a speculation platform.", desc: "We are deeply serious about the distinction between investment and speculation. Our curriculum is built around understanding — how markets work, why capital moves the way it does, and how to make decisions that hold up over time. Chasing returns is not part of our curriculum." },
                        { title: "We are genuinely global, not just internationally marketed.", desc: "With campuses in UAE, Cochin, Bangalore, Mumbai, and Delhi, and an online platform that reaches students worldwide, the Wall Street Jr. community is genuinely cross-border. Our students bring different market contexts, different cultural perspectives, and different professional backgrounds into the same academic framework. That diversity of perspective is a feature, not a footnote." },
                        { title: "Our mentors have actually done it.", desc: "The professionals who guide our students have held real institutional roles, managed real capital, and navigated real market conditions. When they teach, they are not reciting textbooks — they are sharing the mental models and hard-won judgment that shaped their own careers." }
                    ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '2rem', background: 'rgba(212, 175, 55, 0.05)', padding: '2.5rem', borderRadius: '20px', borderLeft: '4px solid #d4af37' }}>
                            <div>
                                <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>{item.title}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Social Responsibility */}
            <section ref={el => contentRefs.current[4] = el} style={sectionStyle}>
                <div style={{ ...cardStyle, borderTop: '4px solid #d4af37' }}>
                    <h2 style={headingStyle}>Finance as a Force for Good</h2>
                    <p style={{ ...textStyle, textAlign: 'center', maxWidth: '900px', margin: '0 auto 3rem' }}>
                        We believe that financial education, delivered responsibly and accessibly, is one of the most socially valuable things an institution can offer. Wealth is not just about individuals — it is about families, communities, and the long-term stability of the societies that shape all of us.
                    </p>

                    <h3 style={{ fontSize: '1.5rem', textAlign: 'center', color: '#fff', marginBottom: '2rem' }}>Our commitment to social responsibility shows up in three concrete ways:</h3>

                    <div className="wwa-grid-280" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: "Access", desc: "We are actively expanding our campus network and online infrastructure to reach students across India and beyond who deserve the same quality of instruction as those in global financial centers." },
                            { title: "Sustainability", desc: "Our programs include an explicit focus on sustainable finance, responsible capital allocation, and the 21st-century challenges that financial professionals will be expected to navigate." },
                            { title: "Community", desc: "Through our Travel and Learn program, mentorship initiatives, and global events, we invest in building a community of professionals who support and challenge each other throughout their careers." }
                        ].map((item, idx) => (
                            <div key={idx} style={{ background: 'rgba(0,0,0,0.4)', padding: '2rem', borderRadius: '16px' }}>
                                <h4 style={{ color: '#d4af37', fontSize: '1.3rem', marginBottom: '1rem' }}>{item.title}</h4>
                                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global Presence */}
            <section ref={el => contentRefs.current[5] = el} style={{ ...sectionStyle, textAlign: 'center', paddingBottom: '6rem' }}>
                <h2 style={headingStyle}>UAE and Beyond — Our Locations</h2>
                <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '800px', margin: '0 auto 3rem' }}>
                    Wall Street Jr. Academy operates from its global headquarters in UAE, with an expanding network of campuses and partnerships across multiple countries.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
                    {[
                        { title: "UAE", role: "Global Headquarters & Academic Governance" },
                        { title: "Chicago, USA", role: "Wall Street Jr. Investments Ltd." },
                        { title: "Cochin, India", role: "Principal India Campus" },
                        { title: "Bangalore, India", role: "Technology-Aligned Learning Campus" },
                        { title: "Mumbai, India", role: "Financial Capital Campus" },
                        { title: "Delhi, India", role: "Policy & Institutional Campus" }
                    ].map((loc, idx) => (
                        <div key={idx} style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                            <span style={{ color: '#d4af37', fontWeight: 'bold' }}>{loc.title}</span><span style={{ opacity: 0.6, margin: '0 0.5rem' }}>|</span><span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{loc.role}</span>
                        </div>
                    ))}
                </div>

                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', opacity: 0.7, maxWidth: '800px', margin: '0 auto 4rem' }}>
                    Each location is connected through a unified academic framework — the same curriculum, the same standards, and the same commitment to producing professionals ready for the demands of a global economy.
                </p>

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
                    Join Our Global Network
                </Link>
            </section>

            <style>{`
                .glaze-button:hover {
                    background-position: right center !important;
                    transform: translateY(-3px) !important;
                    box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4) !important;
                }
            `}</style>
        </div>
    )
}

export default WhoWeArePage

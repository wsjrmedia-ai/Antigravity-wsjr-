import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const LearnBeyond = () => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.beyond-card', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%'
                }
            })
        }, sectionRef)
        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '120px 5%',
            overflow: 'hidden'
        }}>
            {/* Background Image */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 0
            }}>
                <img 
                    src="/images/figma/bg-burj-khalifa.jpg" 
                    alt="Dubai Burj Khalifa" 
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.6)' // Dim for text contrast
                    }}
                />
            </div>

            <div style={{
                position: 'relative',
                zIndex: 5,
                width: '100%',
                maxWidth: '1600px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '80px'
            }}>
                {/* Header Text */}
                <div style={{ maxWidth: '1400px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(3rem, 6vw, 4.8rem)', // 78px
                        color: 'var(--accent-gold)',
                        fontWeight: 600,
                        margin: 0,
                        letterSpacing: '-2px',
                        lineHeight: 1.1
                    }}>
                        Learn beyond <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: '#FFF' }}>the classroom</span>
                    </h2>
                    
                    <p style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(1.2rem, 2vw, 1.45rem)', // 23px
                        color: '#FFF',
                        fontWeight: 600,
                        letterSpacing: '-0.4px',
                        margin: 0,
                        lineHeight: 1.4,
                        maxWidth: '1000px'
                    }}>
                        At Wall Street Jr, your education does not end when the session does. We have built an ecosystem designed to keep you connected, challenged, and inspired - wherever you are in your journey.
                    </p>
                </div>

                {/* Grid of Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '40px'
                }}>
                    {[
                        { 
                            title: 'Live Q&A Sessions', 
                            desc: 'Every month, our students get direct access to industry leaders, fund managers, and senior professionals through live, interactive sessions hosted in Dubai and streamed globally. These are not panels - they are real conversations, and you can ask real questions.' 
                        },
                        { 
                            title: 'Interdisciplinary\nCollaboration', 
                            desc: 'Work alongside peers from Finance, Technology, Design, and Management programs to solve complex, multi-layered real-world challenges.' 
                        },
                        { 
                            title: 'Global Network', 
                            desc: 'When you join Wall Street Jr, you join a growing network of students, alumni, and mentors across Dubai, Kerala, Mumbai, Bangalore, Delhi, and Chicago. This network is one of the most practical assets you will develop during your time with us.' 
                        }
                    ].map((card, i) => (
                        <div key={i} className="beyond-card" style={{
                            background: 'rgba(217, 217, 217, 0.15)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            borderRadius: '35px',
                            padding: '50px 40px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '30px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)', // 39px
                                color: '#FFF',
                                fontWeight: 500,
                                letterSpacing: '-1px',
                                margin: 0,
                                whiteSpace: 'pre-line'
                            }}>{card.title}</h3>
                            <p style={{
                                fontFamily: 'var(--font-hero)',
                                fontSize: '1.2rem', // 19px
                                color: '#FFF',
                                fontWeight: 500,
                                margin: 0,
                                lineHeight: 1.5,
                                opacity: 0.95
                            }}>{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    section { padding: 60px 4% !important; }
                    h2 { font-size: clamp(2.2rem, 8vw, 3rem) !important; text-align: center; }
                    p { font-size: 1.1rem !important; text-align: center; }
                    .beyond-card { padding: 30px 20px !important; gap: 15px !important; }
                    .beyond-card h3 { font-size: 1.5rem !important; }
                    .beyond-card p { font-size: 1rem !important; text-align: left !important; }
                    div[style*="display: grid"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    )
}

export default LearnBeyond

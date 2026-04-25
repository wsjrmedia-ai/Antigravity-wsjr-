import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { schools } from '../data/schools'

const schoolsData = [
    {
        id: 'sof',
        color: '#50000B',
        tabLeft: '10%',
        title: 'School of Finance',
        acronym: 'SOF',
        subtitle: 'Mastering Markets, Valuation &\nCapital Allocation',
        desc: 'Understand how financial markets actually operate. Train to think like an institutional investor, managing capital and risk across short-term and long-term horizons.',
        ideal: 'Ideal for:\nAspiring traders, investment associates,\nand risk or market research analysts.',
        image: '/images/figma/school-finance.jpg'
    },
    {
        id: 'sot',
        color: '#003E62',
        tabLeft: '35%',
        title: 'School of AI &\nAutomation',
        acronym: 'SOT',
        subtitle: 'Building the Future with AI, Agents &\nWorkflow Automation',
        desc: 'Go beyond surface-level limits. Learn to build intelligent agents, automate workflows, and integrate AI to become a high-performing professional across any industry.',
        ideal: 'Ideal for:\nAI & automation specialists, workflow\ndesigners, and productivity analysts.',
        image: '/images/figma/bg-qatar-museum.jpg'
    },
    {
        id: 'sod',
        color: '#040001',
        tabLeft: '60%',
        title: 'School of Design\n& Media',
        acronym: 'SOD',
        subtitle: 'Crafting Experiences, Brands &\nContent That Shape Behaviour',
        desc: 'Shape how the world interacts with brands. Combine design thinking, digital media, and AI-assisted pipelines to build scalable, high-performance content systems.',
        ideal: 'Ideal for:\nContent system designers, UX/UI\nprofessionals, and brand communicators.',
        image: '/images/figma/school-design.jpg'
    },
    {
        id: 'som',
        color: '#50000B',
        tabLeft: '80%',
        title: 'School of Business\n& Management',
        acronym: 'SOM',
        subtitle: 'Leading Businesses Through Strategy,\nSystems & Execution',
        desc: 'Turn strategy into execution. Master modern operations, performance metrics, and AI-supported decision-making to lead high-performing businesses.',
        ideal: 'Ideal for:\nBusiness operations analysts, strategy\nassociates, and performance managers.',
        image: '/images/figma/school-management.jpg'
    }
]

const SchoolCard = ({ school, index, total }) => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const programPath = schools[school.id]?.path || '/';
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"] // 0 when card hits top, 1 when next card hits top
    });

    const isLast = index === total - 1;
    
    // Smooth the progress for premium "smooth transition motion"
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 30, restDelta: 0.001 });

    // Use only darkening as it goes into the background to avoid height scaling bugs
    const filter = useTransform(smoothProgress, [0, 1], ['brightness(1)', isLast ? 'brightness(1)' : 'brightness(0.6)']);

    return (
        <div ref={containerRef} style={{
            position: 'sticky',
            top: 0,
            width: '100%',
            height: '100vh', 
            marginTop: index === 0 ? '-60px' : '0px', 
            zIndex: index + 1 // Ensure subsequent folders stack on top
        }}>
            <motion.div style={{
                filter,
                transformOrigin: 'top center',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* The protruding Folder Tab */}
                <div style={{
                    position: 'relative',
                    height: '60px',
                    width: '100%',
                    zIndex: 2
                }}>
                    <div className={`school-tab school-tab-${school.id}`} style={{
                        position: 'absolute',
                        left: school.tabLeft,
                        top: 0,
                        width: '320px',
                        height: '100px', // slightly taller to blend into main body
                        backgroundColor: school.color,
                        borderRadius: '30px 30px 0 0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingTop: '15px'
                    }}>
                        <span style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: '2.5rem',
                            color: '#FFF',
                            fontStyle: 'italic',
                            fontWeight: 600,
                            letterSpacing: '-1px'
                        }}>
                            {school.acronym}
                        </span>
                    </div>
                </div>

                {/* Main Body of the Folder */}
                <div className="school-main-body" style={{
                    backgroundColor: school.color,
                    borderRadius: '40px 40px 0 0',
                    position: 'relative',
                    display: 'flex',
                    height: 'calc(100vh - 60px)', // Forces exact viewport fit underneath the tab
                    boxShadow: '0 -15px 30px rgba(0,0,0,0.15)', // Shadow to sell the folder overlap effect
                    overflow: 'hidden',
                    paddingTop: '60px' // spacing after border radius
                }}>
                    
                    {/* LEFT Content Column */}
                    <div className="school-left-col" style={{
                        flex: 1,
                        padding: '40px 8%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between', // pushes title to bottom
                        position: 'relative',
                        zIndex: 5
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
                            <h4 style={{
                                fontFamily: 'var(--font-hero)',
                                fontSize: 'clamp(1.5rem, 2.3vw, 2.3rem)', // ~38px
                                color: '#FFF',
                                fontWeight: 500,
                                margin: 0,
                                whiteSpace: 'pre-line',
                                lineHeight: 1.2
                            }}>
                                {school.subtitle}
                            </h4>

                            <p style={{
                                fontFamily: 'var(--font-hero)',
                                fontSize: 'clamp(1.5rem, 2.5vw, 2.8rem)', // ~45px
                                color: '#FFF',
                                fontWeight: 600,
                                margin: 0,
                                maxWidth: '800px',
                                lineHeight: 1.1,
                                opacity: 0.95
                            }}>
                                {school.desc}
                            </p>
                        </div>

                        {/* Bottom Title aligned to bottom of flex column */}
                        <h3 style={{
                            fontFamily: 'var(--font-hero)',
                            fontSize: 'clamp(3.5rem, 5vw, 5.5rem)', // ~75px
                            color: '#FFF',
                            fontWeight: 500,
                            letterSpacing: '-2px',
                            margin: 0,
                            whiteSpace: 'pre-line',
                            lineHeight: 1,
                            paddingBottom: '40px'
                        }}>
                            {school.title}
                        </h3>
                    </div>

                    {/* RIGHT Content Column (Fixed width for image / info blocks) */}
                    <div className="school-right-col" style={{
                        width: '45%',
                        minWidth: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                    }}>
                        
                        {/* Top Text Block (Ideal For / Explore) */}
                        <div style={{
                            padding: '40px 60px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '80px', // Spacing between ideal and explore
                            zIndex: 5
                        }}>
                            <p style={{
                                fontFamily: 'var(--font-hero)',
                                fontSize: 'clamp(1.5rem, 2vw, 2.3rem)', // ~38px
                                color: '#FFF',
                                fontWeight: 500,
                                lineHeight: 1.2,
                                whiteSpace: 'pre-line',
                                margin: 0
                            }}>
                                {school.ideal}
                            </p>

                            <div
                                role="link"
                                tabIndex={0}
                                onClick={() => navigate(programPath)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        navigate(programPath);
                                    }
                                }}
                                style={{
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                                    outline: 'none',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(6px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; }}
                            >
                                <span style={{
                                    fontFamily: 'var(--font-hero)',
                                    fontSize: 'clamp(1.5rem, 2vw, 2.3rem)',
                                    color: '#FFF',
                                    fontWeight: 500,
                                    borderBottom: '1px solid rgba(255,255,255,0.4)',
                                    paddingBottom: '4px',
                                }}>EXPLORE PROGRAM →</span>
                            </div>
                        </div>

                        {/* Image perfectly flushed to bottom right */}
                        <div style={{
                            flex: 1,
                            position: 'relative',
                            width: '100%',
                            marginTop: '40px',
                            borderTopLeftRadius: '50px',
                            overflow: 'visible' // To let the acronym bleed out if needed
                        }}>
                            {/* The actual background image block */}
                            <div style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                borderTopLeftRadius: '50px',
                                overflow: 'hidden'
                            }}>
                                <img 
                                    src={school.image} 
                                    alt={school.title} 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: 'grayscale(20%) brightness(0.8)' // Adding some dim to match Figma mood
                                    }}
                                />
                            </div>

                            {/* The massive overlapping Acronym (SOF) */}
                            <div style={{
                                position: 'absolute',
                                top: '20%',
                                left: '10%',
                                fontFamily: 'var(--font-body)',
                                fontSize: 'clamp(10rem, 18vw, 22rem)', // ~317px
                                color: '#FFF',
                                fontWeight: 500,
                                letterSpacing: '-15px',
                                lineHeight: 1,
                                zIndex: 10,
                                pointerEvents: 'none'
                            }}>
                                {school.acronym}
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}

const SchoolsSection = () => {
    return (
        <section className="schools-section-root" style={{ position: 'relative', display: 'block' }}>
            {schoolsData.map((school, index) => (
                <SchoolCard key={school.id} school={school} index={index} total={schoolsData.length} />
            ))}

            <style>{`
                /*
                 * Responsive fixes for the sticky school-folder stack.
                 * Keep sticky positioning + 100vh container so the scroll-scrubbed
                 * darkening + folder peek animation still plays on every breakpoint.
                 * Only the INTERNAL two-column layout collapses on tablets & phones.
                 */

                /* Tablet: collapse the two-column folder into a stacked layout */
                @media (max-width: 992px) {
                    .school-main-body {
                        flex-direction: column !important;
                        padding-top: 40px !important;
                        overflow: hidden !important;
                    }
                    .school-left-col {
                        padding: 30px 6% 20px !important;
                        gap: 24px !important;
                        flex: none !important;
                    }
                    .school-left-col > div { gap: 24px !important; }
                    .school-left-col h4 { font-size: clamp(1.1rem, 2.6vw, 1.6rem) !important; }
                    .school-left-col p { font-size: clamp(1.1rem, 2.6vw, 1.6rem) !important; }
                    .school-left-col h3 {
                        font-size: clamp(2rem, 6vw, 3.4rem) !important;
                        padding-bottom: 20px !important;
                    }
                    .school-right-col { width: 100% !important; min-width: 0 !important; flex: 1 !important; }
                    .school-right-col > div:first-child {
                        padding: 0 6% 20px !important;
                        gap: 24px !important;
                    }
                    .school-right-col > div:first-child p,
                    .school-right-col > div:first-child span {
                        font-size: clamp(1.1rem, 2.6vw, 1.5rem) !important;
                    }
                    .school-right-col > div:last-child {
                        margin-top: 12px !important;
                        min-height: 180px !important;
                    }
                }

                /* Phones: keep sticky animation intact, shrink the tab + acronym */
                @media (max-width: 768px) {
                    .school-tab { width: 220px !important; height: 80px !important; border-radius: 24px 24px 0 0 !important; }
                    .school-tab span { font-size: 1.8rem !important; }
                    .school-left-col { padding: 24px 6% 16px !important; gap: 20px !important; }
                    .school-left-col > div { gap: 20px !important; }
                    .school-left-col h4 { font-size: clamp(1rem, 4.2vw, 1.3rem) !important; }
                    .school-left-col p { font-size: clamp(1rem, 4vw, 1.25rem) !important; }
                    .school-left-col h3 {
                        font-size: clamp(2rem, 9vw, 2.8rem) !important;
                        padding-bottom: 12px !important;
                    }
                    .school-right-col > div:first-child {
                        padding: 0 6% 24px !important;
                        gap: 16px !important;
                    }
                    .school-right-col > div:first-child p,
                    .school-right-col > div:first-child span {
                        font-size: clamp(1rem, 4vw, 1.2rem) !important;
                    }
                    /* Hide the giant SOF/SOT/SOD/SOM acronym + image block
                       on phones — it pushes the EXPLORE PROGRAM link off-screen. */
                    .school-right-col > div:last-child { display: none !important; }
                }

                @media (max-width: 480px) {
                    .school-tab { left: 8% !important; width: 170px !important; height: 65px !important; }
                    .school-tab span { font-size: 1.4rem !important; }
                }
            `}</style>
        </section>
    )
}

export default SchoolsSection

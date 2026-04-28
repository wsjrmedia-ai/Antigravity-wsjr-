import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { schoolsList } from '../data/schools';
import SEO from '../components/SEO';

const ProgrammesPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Wall Street Jr. Academy Programs',
        itemListElement: (schoolsList || []).map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://wsjrschool.com${s.path}`,
            name: s.name,
        })),
    };

    return (
        <div
            className="programmes-root"
            style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                color: '#FFF',
                fontFamily: 'var(--font-body)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <SEO
                title="Programmes"
                description="Explore Wall Street Jr. Academy's programmes — Schools of Finance, AI & Automation, Business Intelligence, and Design Intelligence. Built for Indian and UAE students."
                path="/programmes"
                schema={itemListSchema}
            />
            {/* Ambient glow */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-15%',
                    width: '70vw',
                    height: '70vw',
                    background:
                        'radial-gradient(ellipse at center, rgba(247,172,65,0.18) 0%, rgba(247,172,65,0) 60%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '60vw',
                    height: '60vw',
                    background:
                        'radial-gradient(ellipse at center, rgba(106,7,21,0.45) 0%, rgba(106,7,21,0) 60%)',
                    filter: 'blur(100px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/* Hero */}
            <section
                className="programmes-hero"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '160px 8% 80px',
                    maxWidth: '1600px',
                    margin: '0 auto',
                }}
            >
                <Link
                    to="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        marginBottom: '40px',
                    }}
                >
                    ← Back to home
                </Link>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                        fontWeight: 500,
                        lineHeight: 1.05,
                        letterSpacing: '-2px',
                        margin: 0,
                        maxWidth: '1200px',
                    }}
                >
                    Find your{' '}
                    <span
                        style={{
                            fontStyle: 'italic',
                            background:
                                'linear-gradient(101deg, #F7AC41 8.57%, #BC7E26 48.6%, #FFBD5F 85.66%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        programme.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                    style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
                        lineHeight: 1.5,
                        color: 'rgba(255,255,255,0.85)',
                        margin: '32px 0 0',
                        maxWidth: '720px',
                        fontWeight: 500,
                    }}
                >
                    Four schools. One integrated institution. Each programme is
                    designed around how modern institutions actually operate —
                    led by professionals with experience across global
                    financial institutions and technology systems.
                </motion.p>
            </section>

            {/* School cards */}
            <section
                className="programmes-grid"
                style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '40px 8% 140px',
                    maxWidth: '1600px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                    gap: '32px',
                }}
            >
                {schoolsList.map((school, idx) => (
                    <motion.article
                        key={school.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                        whileHover={{ y: -6 }}
                        onClick={() => navigate(school.path)}
                        className="programme-card"
                        style={{
                            cursor: 'pointer',
                            background: school.color,
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '520px',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                            transition: 'box-shadow 0.3s ease',
                        }}
                    >
                        {/* Image header */}
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: '220px',
                                overflow: 'hidden',
                            }}
                        >
                            <img
                                src={school.image}
                                alt={school.name}
                                loading="lazy"
                                decoding="async"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    filter: 'grayscale(15%) brightness(0.75)',
                                }}
                            />
                            <div
                                aria-hidden
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: `linear-gradient(180deg, transparent 40%, ${school.color} 100%)`,
                                }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '24px',
                                    fontFamily: 'var(--font-hero)',
                                    fontStyle: 'italic',
                                    fontWeight: 600,
                                    fontSize: '1.6rem',
                                    color: school.accent,
                                    letterSpacing: '-1px',
                                }}
                            >
                                {school.acronym}
                            </span>
                        </div>

                        {/* Body */}
                        <div
                            style={{
                                padding: '28px 30px 32px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                flex: 1,
                            }}
                        >
                            <h3
                                style={{
                                    fontFamily: 'var(--font-hero)',
                                    fontSize: '1.7rem',
                                    fontWeight: 500,
                                    margin: 0,
                                    color: '#FFF',
                                    lineHeight: 1.15,
                                    letterSpacing: '-0.5px',
                                }}
                            >
                                {school.name}
                            </h3>
                            <p
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.95rem',
                                    margin: 0,
                                    color: school.accent,
                                    fontWeight: 500,
                                    letterSpacing: '0.2px',
                                }}
                            >
                                {school.tagline}
                            </p>
                            <p
                                style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.95rem',
                                    margin: 0,
                                    color: 'rgba(255,255,255,0.82)',
                                    lineHeight: 1.55,
                                    flex: 1,
                                }}
                            >
                                {school.focus}
                            </p>
                            <span
                                style={{
                                    marginTop: '12px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    color: school.accent,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                EXPLORE PROGRAMME →
                            </span>
                        </div>
                    </motion.article>
                ))}
            </section>

            {/* Footer CTA */}
            <section
                style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '0 8% 140px',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                }}
            >
                <p
                    style={{
                        fontFamily: 'var(--font-hero)',
                        fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)',
                        color: 'rgba(255,255,255,0.85)',
                        lineHeight: 1.4,
                        margin: '0 0 28px',
                        fontWeight: 500,
                    }}
                >
                    Ready to begin? Programmes are subject to change as we
                    refine the institution.
                </p>
                <motion.button
                    onClick={() => navigate('/enroll')}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px 36px',
                        borderRadius: '100px',
                        background: '#6A0715',
                        border: '1px solid rgba(247,172,65,0.4)',
                        color: '#FFF',
                        fontFamily: 'var(--font-body)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 24px rgba(106,7,21,0.4)',
                    }}
                >
                    ENROLL NOW →
                </motion.button>
            </section>

            <style>{`
                .programme-card:hover {
                    box-shadow: 0 30px 80px rgba(0,0,0,0.5) !important;
                }
                @media (max-width: 768px) {
                    .programmes-hero { padding: 120px 6% 40px !important; }
                    .programmes-grid { padding: 24px 6% 80px !important; gap: 20px !important; }
                    .programme-card { min-height: 460px !important; }
                }
            `}</style>
        </div>
    );
};

export default ProgrammesPage;

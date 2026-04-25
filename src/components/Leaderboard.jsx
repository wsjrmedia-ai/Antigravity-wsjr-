import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { leaderboard, LEADERBOARD_IS_LIVE } from '../data/leaderboard';
import { schools } from '../data/schools';

gsap.registerPlugin(ScrollTrigger);

/**
 * Leaderboard
 *
 * Public-facing student ranking. Driven by `src/data/leaderboard.js`.
 * While `LEADERBOARD_IS_LIVE === false` the component renders anonymised
 * initials for placeholder rows so we don't fake real student identities.
 */
const obfuscateName = (name) => {
    if (!name) return '—';
    const parts = name.trim().split(/\s+/);
    const first = parts[0] || '';
    const last = parts[1] || '';
    const firstChar = first.charAt(0).toUpperCase();
    const lastChar = last.charAt(0).toUpperCase();
    if (!firstChar) return '—';
    if (!lastChar) return `${firstChar}.`;
    return `${firstChar}. ${lastChar}.`;
};

const badgeStyle = (badge) => {
    switch (badge) {
        case 'gold':
            return { background: 'linear-gradient(135deg, #F7AC41, #FFBD5F)', color: '#3A0008' };
        case 'silver':
            return { background: 'linear-gradient(135deg, #D8D8D8, #FFFFFF)', color: '#3A0008' };
        case 'bronze':
            return { background: 'linear-gradient(135deg, #B36A2C, #E29C57)', color: '#FFF' };
        default:
            return null;
    }
};

const Leaderboard = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.leaderboard-row', {
                y: 18,
                opacity: 0,
                duration: 0.8,
                stagger: 0.06,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="leaderboard-section"
            style={{
                backgroundColor: '#3A0008',
                padding: '120px 5%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Soft gold ambient glow */}
            <div
                aria-hidden
                style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90vw',
                    height: '60vw',
                    background:
                        'radial-gradient(ellipse at center, rgba(247,172,65,0.12) 0%, rgba(247,172,65,0) 60%)',
                    filter: 'blur(80px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <div
                style={{
                    maxWidth: '1200px',
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Header */}
                <div
                    className="leaderboard-header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                        gap: '24px',
                        marginBottom: '60px',
                    }}
                >
                    <div style={{ flex: '1 1 420px' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.78rem',
                                letterSpacing: '0.22em',
                                color: '#F7AC41',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                marginBottom: '14px',
                            }}
                        >
                            {LEADERBOARD_IS_LIVE ? 'Top performers' : 'Coming soon'}
                        </span>
                        <h2
                            style={{
                                fontFamily: 'var(--font-hero)',
                                fontSize: 'clamp(2.4rem, 4.6vw, 4rem)',
                                color: '#FFF',
                                margin: 0,
                                fontWeight: 500,
                                lineHeight: 1.1,
                                letterSpacing: '-1.5px',
                            }}
                        >
                            Student{' '}
                            <span
                                style={{
                                    fontStyle: 'italic',
                                    background:
                                        'linear-gradient(101deg, #F7AC41 8.57%, #BC7E26 48.6%, #FFBD5F 85.66%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Leaderboard
                            </span>
                        </h2>
                    </div>
                    <p
                        style={{
                            flex: '1 1 360px',
                            margin: 0,
                            fontFamily: 'var(--font-hero)',
                            fontSize: '1rem',
                            color: 'rgba(255,255,255,0.78)',
                            lineHeight: 1.55,
                            fontWeight: 500,
                            maxWidth: '460px',
                        }}
                    >
                        Top performers across the four schools — ranked by
                        cumulative score, weekly lab attendance and signature
                        project quality. Live data populates here as new
                        cohorts join.
                    </p>
                </div>

                {/* Table */}
                <div
                    className="leaderboard-table"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(247,172,65,0.18)',
                        borderRadius: '20px',
                        backdropFilter: 'blur(8px)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Column headers */}
                    <div
                        className="leaderboard-row leaderboard-head"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '60px minmax(160px, 1.8fr) minmax(140px, 1fr) 80px 110px 90px',
                            gap: '16px',
                            alignItems: 'center',
                            padding: '18px 28px',
                            borderBottom: '1px solid rgba(247,172,65,0.18)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.72rem',
                            letterSpacing: '0.18em',
                            color: 'rgba(255,255,255,0.55)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                        }}
                    >
                        <span>Rank</span>
                        <span>Student</span>
                        <span className="lb-col-school">School</span>
                        <span className="lb-col-country">Region</span>
                        <span style={{ textAlign: 'right' }}>Score</span>
                        <span className="lb-col-streak" style={{ textAlign: 'right' }}>Streak</span>
                    </div>

                    {leaderboard.map((entry) => {
                        const showReal = LEADERBOARD_IS_LIVE && !entry.isPlaceholder;
                        const displayName = showReal
                            ? entry.name
                            : obfuscateName(entry.name);
                        const schoolMeta = schools[entry.school];
                        const badge = badgeStyle(entry.badge);

                        return (
                            <div
                                key={entry.rank}
                                className="leaderboard-row leaderboard-data"
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '60px minmax(160px, 1.8fr) minmax(140px, 1fr) 80px 110px 90px',
                                    gap: '16px',
                                    alignItems: 'center',
                                    padding: '18px 28px',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '1rem',
                                    color: '#FFF',
                                    transition: 'background 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(247,172,65,0.04)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {/* Rank */}
                                <span
                                    style={{
                                        fontFamily: 'var(--font-hero)',
                                        fontStyle: 'italic',
                                        fontWeight: 600,
                                        fontSize: '1.6rem',
                                        color: badge ? '#F7AC41' : 'rgba(255,255,255,0.85)',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    {entry.rank}
                                </span>

                                {/* Student name + badge */}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                    <span
                                        style={{
                                            fontWeight: 500,
                                            color: '#FFF',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {displayName}
                                    </span>
                                    {badge && (
                                        <span
                                            style={{
                                                fontSize: '0.62rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.12em',
                                                textTransform: 'uppercase',
                                                padding: '3px 9px',
                                                borderRadius: '999px',
                                                ...badge,
                                            }}
                                        >
                                            {entry.badge}
                                        </span>
                                    )}
                                    {!LEADERBOARD_IS_LIVE && (
                                        <span
                                            style={{
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                                padding: '3px 9px',
                                                borderRadius: '999px',
                                                background: 'rgba(247,172,65,0.15)',
                                                color: '#F7AC41',
                                                border: '1px solid rgba(247,172,65,0.3)',
                                            }}
                                        >
                                            Soon
                                        </span>
                                    )}
                                </span>

                                {/* School */}
                                <span
                                    className="lb-col-school"
                                    style={{
                                        fontSize: '0.85rem',
                                        color: 'rgba(255,255,255,0.7)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {schoolMeta ? schoolMeta.name.replace('Wall Street Jr. ', '') : '—'}
                                </span>

                                {/* Country */}
                                <span
                                    className="lb-col-country"
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                        fontSize: '0.85rem',
                                        color: 'rgba(255,255,255,0.65)',
                                        letterSpacing: '0.1em',
                                        fontWeight: 600,
                                    }}
                                >
                                    {entry.country}
                                </span>

                                {/* Score with bar */}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-hero)',
                                            fontWeight: 600,
                                            fontSize: '1.05rem',
                                            color: '#F7AC41',
                                            minWidth: '32px',
                                            textAlign: 'right',
                                        }}
                                    >
                                        {entry.score}
                                    </span>
                                    <span
                                        aria-hidden
                                        style={{
                                            display: 'inline-block',
                                            width: '60px',
                                            height: '4px',
                                            borderRadius: '999px',
                                            background: 'rgba(255,255,255,0.1)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                bottom: 0,
                                                width: `${entry.score}%`,
                                                background:
                                                    'linear-gradient(90deg, #BC7E26, #F7AC41)',
                                            }}
                                        />
                                    </span>
                                </span>

                                {/* Streak */}
                                <span
                                    className="lb-col-streak"
                                    style={{
                                        fontFamily: 'var(--font-body)',
                                        fontWeight: 500,
                                        fontSize: '0.85rem',
                                        color: 'rgba(255,255,255,0.65)',
                                        textAlign: 'right',
                                    }}
                                >
                                    {entry.streak}w
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Footer note */}
                {!LEADERBOARD_IS_LIVE && (
                    <p
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.55)',
                            textAlign: 'center',
                            marginTop: '32px',
                            fontStyle: 'italic',
                        }}
                    >
                        These rows are placeholders. Live student rankings will
                        populate once the first cohort begins.
                    </p>
                )}
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .leaderboard-row {
                        grid-template-columns: 50px 1.5fr 100px 90px !important;
                    }
                    .lb-col-school { display: none !important; }
                    .lb-col-streak { display: none !important; }
                }
                @media (max-width: 600px) {
                    .leaderboard-section { padding: 70px 4% !important; }
                    .leaderboard-row {
                        grid-template-columns: 36px 1.6fr 78px !important;
                        gap: 8px !important;
                        padding: 12px 14px !important;
                        font-size: 0.85rem !important;
                    }
                    .lb-col-country { display: none !important; }
                    .leaderboard-row span[style*="font-size: 1.6rem"] { font-size: 1.15rem !important; }
                    .leaderboard-row span[style*="font-size: 1.05rem"] { font-size: 0.95rem !important; }
                }
                @media (max-width: 400px) {
                    .leaderboard-row {
                        grid-template-columns: 30px 1fr 60px !important;
                        gap: 6px !important;
                        padding: 10px 10px !important;
                    }
                    /* Hide the inline progress bar on very narrow screens — keep just the number */
                    .leaderboard-row span[aria-hidden="true"][style*="width: 60px"] { display: none !important; }
                    /* Drop the score-bar wrapper gap */
                    .leaderboard-row > span:nth-of-type(4) { gap: 0 !important; }
                }
            `}</style>
        </section>
    );
};

export default Leaderboard;

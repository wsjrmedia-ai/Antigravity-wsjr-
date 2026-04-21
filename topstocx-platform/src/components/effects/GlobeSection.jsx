import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// Lazy load the Globe since it's heavy WebGL
const Globe3D = lazy(() => import('./Globe3D'));

const LIVE_FEED = [
    { city: 'New York',   exchange: 'NYSE',    status: 'OPEN',   vol: '$48.2B', color: '#089981' },
    { city: 'London',     exchange: 'LSE',     status: 'OPEN',   vol: '$31.7B', color: '#089981' },
    { city: 'Tokyo',      exchange: 'TSE',     status: 'CLOSED', vol: '$22.1B', color: '#868993' },
    { city: 'Shanghai',   exchange: 'SSE',     status: 'CLOSED', vol: '$18.9B', color: '#868993' },
    { city: 'Dubai',      exchange: 'DFM',     status: 'OPEN',   vol: '$9.3B',  color: '#089981' },
    { city: 'Hong Kong',  exchange: 'HKEX',    status: 'CLOSED', vol: '$15.4B', color: '#868993' },
];

const GlobeSection = () => {
    return (
        <section className="gs-section" style={{
            padding: '10rem 2rem',
            backgroundColor: '#000',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <style>{`
                @media (max-width: 1024px) { .gs-section { padding: 5rem 1.5rem !important; } }
                @media (max-width: 600px)  { .gs-section { padding: 3rem 1rem !important; } }
            `}</style>
            {/* Ambient radial glow */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: '900px', height: '900px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(0, 90, 255,0.06) 0%, transparent 70%)',
                pointerEvents: 'none',
                zIndex: 0,
            }} />

            <div style={{ maxWidth: '1400px', marginInline: 'auto', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ textAlign: 'center', marginBottom: '5rem' }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 16px',
                        borderRadius: '100px',
                        border: '1px solid rgba(0, 90, 255,0.3)',
                        background: 'rgba(0, 90, 255,0.08)',
                        color: '#005AFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        marginBottom: '1.5rem',
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#089981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                        GLOBAL MARKETS LIVE
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(36px, 6vw, 68px)',
                        fontWeight: 900,
                        letterSpacing: '-2px',
                        lineHeight: 1.05,
                        marginBottom: '1.5rem',
                        color: '#fff',
                    }}>
                        Trade the world,<br />
                        <span style={{ color: '#005AFF' }}>from anywhere.</span>
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#868993',
                        maxWidth: '600px',
                        marginInline: 'auto',
                        lineHeight: 1.7,
                    }}>
                        Access 100M+ instruments across global exchanges — all in one institutional-grade platform.
                    </p>
                </motion.div>

                {/* Main Two-Column Layout — stacks on tablet/mobile */}
                <style>{`
                    .gs-two-col {
                        display: grid;
                        grid-template-columns: 1fr 1.2fr;
                        gap: 4rem;
                        align-items: center;
                    }
                    @media (max-width: 1024px) {
                        .gs-two-col {
                            grid-template-columns: 1fr !important;
                            gap: 2.5rem;
                        }
                        .gs-globe-col { order: -1; }
                    }
                    @media (max-width: 768px) {
                        .gs-globe-col { height: 380px !important; }
                    }
                    @media (max-width: 480px) {
                        .gs-globe-col { height: 320px !important; }
                    }
                `}</style>
                <div className="gs-two-col">
                    {/* Left: Exchange feed panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(13,16,24,0.98) 0%, rgba(8,10,18,0.99) 100%)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
                        }}>
                            {/* Panel header */}
                            <div style={{
                                padding: '1rem 1.5rem',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <span style={{ fontWeight: 700, fontSize: '14px', color: '#d1d4dc' }}>
                                    Global Exchange Status
                                </span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {['#f23645', '#005AFF', '#39B54A'].map((c, i) => (
                                        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>

                            {/* Exchange rows */}
                            {LIVE_FEED.map((ex, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        display: 'grid',
                                        gridTemplateColumns: '1fr auto auto auto',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        borderBottom: i < LIVE_FEED.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                        cursor: 'default',
                                        transition: 'background 0.2s',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff', marginBottom: '2px' }}>
                                            {ex.city}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#434651' }}>{ex.exchange}</div>
                                    </div>

                                    <div style={{ fontSize: '12px', color: '#868993', textAlign: 'right' }}>
                                        {ex.vol}
                                    </div>

                                    <div style={{
                                        padding: '3px 10px',
                                        borderRadius: '100px',
                                        backgroundColor: ex.status === 'OPEN' ? 'rgba(8, 153, 129, 0.12)' : 'rgba(255,255,255,0.04)',
                                        color: ex.color,
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        letterSpacing: '0.06em',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {ex.status === 'OPEN' && (
                                            <span style={{
                                                width: 5, height: 5, borderRadius: '50%',
                                                backgroundColor: '#089981', display: 'inline-block',
                                            }} />
                                        )}
                                        {ex.status}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Bottom stats row */}
                            <div style={{
                                padding: '1.2rem 1.5rem',
                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                gap: '2rem',
                            }}>
                                {[
                                    { label: 'Markets', value: '50+' },
                                    { label: 'Instruments', value: '100M+' },
                                    { label: 'Data Points/sec', value: '2.4M' },
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#005AFF' }}>{s.value}</div>
                                        <div style={{ fontSize: '11px', color: '#434651', marginTop: '2px' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: 3D Globe */}
                    <motion.div
                        className="gs-globe-col"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                        style={{ height: '520px', position: 'relative', minWidth: 0, width: '100%' }}
                    >
                        {/* Glow behind globe */}
                        <div style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            width: '350px', height: '350px',
                            transform: 'translate(-50%, -50%)',
                            background: 'radial-gradient(circle, rgba(0, 90, 255,0.15), transparent 70%)',
                            borderRadius: '50%',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }} />
                        <Suspense fallback={
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                height: '100%', color: '#434651', fontSize: '14px',
                            }}>
                                Loading Globe...
                            </div>
                        }>
                            <Globe3D />
                        </Suspense>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default GlobeSection;

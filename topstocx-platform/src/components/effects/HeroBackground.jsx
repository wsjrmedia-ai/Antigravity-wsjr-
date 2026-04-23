/**
 * HeroBackground — Topstocx hero section backdrop.
 *
 * Minimal variant: perspective grid floor only.
 *
 *   0. Deep navy base (#03050e)
 *   1. Perspective grid floor — brand-blue 1px lines fading to the horizon
 *   2. Bottom fade-to-base so foreground content reads cleanly
 *
 * No aurora blobs, no chart-line ghosts, no data specks, no watermark.
 *
 * Usage:
 *
 *   <section className="hp-hero">
 *     <HeroBackground />
 *     <div className="hp-hero-content"> ... </div>
 *   </section>
 */
export default function HeroBackground({ style = {} }) {
    return (
        <div
            aria-hidden="true"
            className="hero-bg"
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                isolation: 'isolate',
                background: '#03050e',
                zIndex: 0,
                ...style,
            }}
        >
            <style>{`
                @keyframes hero-grid-pan {
                    0%   { background-position: 0 0,   0 0;   }
                    100% { background-position: 0 80px, 80px 0;}
                }
                @media (prefers-reduced-motion: reduce) {
                    .hero-bg * { animation: none !important; }
                }
            `}</style>

            {/* ── Perspective grid floor (brand-blue 1px lines) ──────────── */}
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                right: '-10%',
                height: '72%',
                perspective: '900px',
                perspectiveOrigin: '50% 0%',
                zIndex: 1,
                pointerEvents: 'none',
                maskImage: 'linear-gradient(180deg, transparent 0%, #000 22%, #000 82%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 22%, #000 82%, transparent 100%)',
            }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    transform: 'rotateX(62deg) translateZ(0)',
                    transformOrigin: '50% 0%',
                    backgroundImage: `
                        linear-gradient(90deg,  rgba(0, 90, 255, 0.28) 1px, transparent 1px),
                        linear-gradient(180deg, rgba(0, 90, 255, 0.22) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px, 80px 80px',
                    animation: 'hero-grid-pan 22s linear infinite',
                    opacity: 0.9,
                }} />
            </div>

            {/* ── Bottom fade-to-base so content + ticker tape stay clean ── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                background: 'linear-gradient(180deg, rgba(3,5,14,0.30) 0%, transparent 18%, transparent 78%, #03050e 100%)',
                pointerEvents: 'none',
            }} />
        </div>
    );
}

/**
 * HeroBackground — Topstocx hero section backdrop.
 *
 * Minimal variant: perspective grid floor only, fully responsive.
 *
 *   0. Deep navy base (#03050e)
 *   1. Perspective grid floor — brand-blue 1px lines fading to the horizon
 *   2. Bottom fade-to-base so foreground content reads cleanly
 *
 * Grid cell size and floor height scale down on tablets + phones so the
 * perspective stays readable on any viewport (and we don't burn GPU
 * drawing huge floors on small devices).
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
                .hero-bg-floor {
                    position: absolute;
                    bottom: -10%;
                    left: -10%;
                    right: -10%;
                    height: 72%;
                    perspective: 900px;
                    perspective-origin: 50% 0%;
                    z-index: 1;
                    pointer-events: none;
                    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 82%, transparent 100%);
                            mask-image: linear-gradient(180deg, transparent 0%, #000 22%, #000 82%, transparent 100%);
                }
                .hero-bg-grid {
                    width: 100%;
                    height: 100%;
                    transform: rotateX(62deg) translateZ(0);
                    transform-origin: 50% 0%;
                    background-image:
                        linear-gradient(90deg,  rgba(0, 90, 255, 0.28) 1px, transparent 1px),
                        linear-gradient(180deg, rgba(0, 90, 255, 0.22) 1px, transparent 1px);
                    background-size: 80px 80px, 80px 80px;
                    animation: hero-grid-pan 22s linear infinite;
                    opacity: 0.9;
                    will-change: background-position;
                }
                .hero-bg-fade {
                    position: absolute;
                    inset: 0;
                    z-index: 2;
                    background: linear-gradient(180deg, rgba(3,5,14,0.30) 0%, transparent 18%, transparent 78%, #03050e 100%);
                    pointer-events: none;
                }

                @keyframes hero-grid-pan {
                    0%   { background-position: 0 0,   0 0;   }
                    100% { background-position: 0 80px, 80px 0; }
                }

                /* Tablet — shrink grid cells + bring horizon in a bit */
                @media (max-width: 1024px) {
                    .hero-bg-floor { height: 68%; perspective: 760px; }
                    .hero-bg-grid  { background-size: 64px 64px, 64px 64px; transform: rotateX(60deg) translateZ(0); }
                    @keyframes hero-grid-pan {
                        0%   { background-position: 0 0,   0 0;   }
                        100% { background-position: 0 64px, 64px 0; }
                    }
                }

                /* Phone — further reduce cell density + soften angle */
                @media (max-width: 768px) {
                    .hero-bg-floor { height: 62%; perspective: 640px; bottom: -8%; }
                    .hero-bg-grid  {
                        background-size: 52px 52px, 52px 52px;
                        background-image:
                            linear-gradient(90deg,  rgba(0, 90, 255, 0.34) 1px, transparent 1px),
                            linear-gradient(180deg, rgba(0, 90, 255, 0.26) 1px, transparent 1px);
                        transform: rotateX(58deg) translateZ(0);
                        opacity: 0.85;
                    }
                    @keyframes hero-grid-pan {
                        0%   { background-position: 0 0,   0 0;   }
                        100% { background-position: 0 52px, 52px 0; }
                    }
                }

                /* Small phone — tight grid, slower motion feel */
                @media (max-width: 480px) {
                    .hero-bg-floor { height: 56%; perspective: 520px; }
                    .hero-bg-grid  {
                        background-size: 42px 42px, 42px 42px;
                        transform: rotateX(56deg) translateZ(0);
                        animation-duration: 28s;
                    }
                    @keyframes hero-grid-pan {
                        0%   { background-position: 0 0,   0 0;   }
                        100% { background-position: 0 42px, 42px 0; }
                    }
                }

                /* Touch devices — keep animation but never block scroll */
                @media (hover: none) and (pointer: coarse) {
                    .hero-bg { touch-action: pan-y; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-bg * { animation: none !important; }
                }
            `}</style>

            {/* ── Perspective grid floor (brand-blue 1px lines) ──────────── */}
            <div className="hero-bg-floor">
                <div className="hero-bg-grid" />
            </div>

            {/* ── Bottom fade-to-base so content + ticker tape stay clean ── */}
            <div className="hero-bg-fade" />
        </div>
    );
}

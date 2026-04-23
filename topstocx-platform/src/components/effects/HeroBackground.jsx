import { useMemo } from 'react';

/**
 * HeroBackground — Topstocx hero section backdrop.
 *
 * Strictly brand-compliant layers (all colours pulled from the Topstocx
 * palette in /src/index.css):
 *
 *   0. Deep navy vertical base (#03050e → #050c1a → #061425 → #03050e)
 *   1. Two drifting aurora blobs — brand-blue top-left, brand-green bottom-right
 *   2. Perspective grid floor — brand-blue 1px lines fading to the horizon
 *   3. Three ascending "summit" chart ghost lines with soft glow
 *   4. Floating data-particle specks
 *   5. Cygre "TOPSTOCX" watermark — ultra low opacity
 *   6. Radial vignette + bottom fade-to-base so foreground content reads
 *
 * Wrap it around the hero content:
 *
 *   <section className="hp-hero">
 *     <HeroBackground />
 *     <div className="hp-hero-content"> ... </div>
 *   </section>
 *
 * The component is position:absolute inset:0 and sits behind anything with
 * z-index ≥ 2 (content sets its own stacking).
 */
const SPECKS = Array.from({ length: 22 }, (_, i) => {
    // Deterministic pseudo-random so SSR/hydration don't drift.
    const rnd = (seed, salt) => {
        const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
        return x - Math.floor(x);
    };
    return {
        left:      rnd(i + 1, 1) * 100,
        top:       rnd(i + 1, 2) * 100,
        size:      1.4 + rnd(i + 1, 3) * 2.2,
        delay:    -rnd(i + 1, 4) * 18,
        duration:  14 + rnd(i + 1, 5) * 16,
        tint:      rnd(i + 1, 6) > 0.55 ? '#77A6FF' : '#59E16C',
    };
});

export default function HeroBackground({ showWatermark = true, style = {} }) {
    const specks = useMemo(() => SPECKS, []);

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
                background: `
                    linear-gradient(180deg,
                        #03050e 0%,
                        #050c1a 28%,
                        #061425 55%,
                        #050c1a 80%,
                        #03050e 100%)
                `,
                zIndex: 0,
                ...style,
            }}
        >
            <style>{`
                @keyframes hero-blob-drift-a {
                    0%,100% { transform: translate3d(-6%, -4%, 0) scale(1);   opacity: .95; }
                    50%     { transform: translate3d( 6%,  3%, 0) scale(1.08); opacity: 1;   }
                }
                @keyframes hero-blob-drift-b {
                    0%,100% { transform: translate3d( 4%,  5%, 0) scale(1);   opacity: .9;  }
                    50%     { transform: translate3d(-5%, -4%, 0) scale(1.1); opacity: 1;   }
                }
                @keyframes hero-grid-pan {
                    0%   { background-position: 0 0,   0 0;   }
                    100% { background-position: 0 80px, 80px 0;}
                }
                @keyframes hero-line-rise {
                    0%   { transform: translate3d(-8%, 4%, 0);  opacity: 0;  }
                    18%  { opacity: .55; }
                    82%  { opacity: .55; }
                    100% { transform: translate3d( 6%, -6%, 0); opacity: 0;  }
                }
                @keyframes hero-speck-float {
                    0%,100% { transform: translate3d(0,0,0);       opacity: .35; }
                    50%     { transform: translate3d(14px,-22px,0); opacity: .85; }
                }
                @keyframes hero-watermark-breathe {
                    0%,100% { opacity: .035; letter-spacing: .22em; }
                    50%     { opacity: .06;  letter-spacing: .28em; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .hero-bg *,
                    .hero-bg { animation: none !important; }
                }
            `}</style>

            {/* ── Layer 1: aurora blobs (brand blue + brand green) ───────── */}
            <div style={{
                position: 'absolute',
                top: '-15%', left: '-10%',
                width: '70%', height: '80%',
                background: 'radial-gradient(ellipse at 35% 40%, rgba(0,90,255,0.45) 0%, rgba(0,90,255,0.15) 40%, transparent 70%)',
                filter: 'blur(60px)',
                animation: 'hero-blob-drift-a 28s ease-in-out infinite',
                mixBlendMode: 'screen',
                zIndex: 1,
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%', right: '-10%',
                width: '75%', height: '85%',
                background: 'radial-gradient(ellipse at 65% 60%, rgba(57,181,74,0.38) 0%, rgba(57,181,74,0.12) 42%, transparent 72%)',
                filter: 'blur(70px)',
                animation: 'hero-blob-drift-b 32s ease-in-out infinite',
                mixBlendMode: 'screen',
                zIndex: 1,
            }} />
            {/* Central highlight wash */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 50% 40% at 50% 45%, rgba(119,166,255,0.08) 0%, transparent 70%)',
                zIndex: 1,
            }} />

            {/* ── Layer 2: perspective grid floor (brand-blue 1px lines) ── */}
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                right: '-10%',
                height: '58%',
                perspective: '900px',
                perspectiveOrigin: '50% 0%',
                zIndex: 2,
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
                        linear-gradient(90deg,  rgba(0, 90, 255, 0.22) 1px, transparent 1px),
                        linear-gradient(180deg, rgba(0, 90, 255, 0.18) 1px, transparent 1px)
                    `,
                    backgroundSize: '80px 80px, 80px 80px',
                    animation: 'hero-grid-pan 22s linear infinite',
                    opacity: 0.85,
                }} />
            </div>

            {/* ── Layer 3: ascending "summit" chart ghost lines ──────────── */}
            <svg
                viewBox="0 0 1600 900"
                preserveAspectRatio="none"
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 3,
                    mixBlendMode: 'screen',
                    opacity: 0.75,
                }}
            >
                <defs>
                    <linearGradient id="hero-line-blue" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor="#005AFF" stopOpacity="0"   />
                        <stop offset="50%"  stopColor="#77A6FF" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#005AFF" stopOpacity="0"   />
                    </linearGradient>
                    <linearGradient id="hero-line-green" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%"   stopColor="#39B54A" stopOpacity="0"   />
                        <stop offset="50%"  stopColor="#59E16C" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#39B54A" stopOpacity="0"   />
                    </linearGradient>
                    <filter id="hero-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Three ascending lines (low→high) with rising animation */}
                <g filter="url(#hero-line-glow)">
                    <path
                        d="M -100 780 Q 400 700, 700 600 T 1700 320"
                        fill="none"
                        stroke="url(#hero-line-blue)"
                        strokeWidth="2.2"
                        style={{ animation: 'hero-line-rise 20s ease-in-out infinite' }}
                    />
                    <path
                        d="M -100 860 Q 500 780, 850 680 T 1700 420"
                        fill="none"
                        stroke="url(#hero-line-green)"
                        strokeWidth="1.8"
                        style={{
                            animation: 'hero-line-rise 26s ease-in-out infinite',
                            animationDelay: '-7s',
                        }}
                    />
                    <path
                        d="M -100 700 Q 450 640, 780 520 T 1700 220"
                        fill="none"
                        stroke="url(#hero-line-blue)"
                        strokeWidth="1.4"
                        style={{
                            animation: 'hero-line-rise 32s ease-in-out infinite',
                            animationDelay: '-14s',
                            opacity: 0.7,
                        }}
                    />
                </g>
            </svg>

            {/* ── Layer 4: floating data specks ──────────────────────────── */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
                {specks.map((s, i) => (
                    <span
                        key={i}
                        style={{
                            position: 'absolute',
                            left: `${s.left}%`,
                            top:  `${s.top}%`,
                            width:  s.size,
                            height: s.size,
                            borderRadius: '50%',
                            background: s.tint,
                            boxShadow: `0 0 ${s.size * 4}px ${s.tint}`,
                            opacity: 0.55,
                            animation: `hero-speck-float ${s.duration}s ease-in-out infinite`,
                            animationDelay: `${s.delay}s`,
                        }}
                    />
                ))}
            </div>

            {/* ── Layer 5: Cygre "TOPSTOCX" watermark ─────────────────────── */}
            {showWatermark && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}>
                    <span
                        className="font-primary"
                        style={{
                            fontFamily: "'Cygre', 'Space Grotesk', 'Outfit', sans-serif",
                            fontWeight: 900,
                            fontSize: 'clamp(120px, 22vw, 360px)',
                            lineHeight: 1,
                            letterSpacing: '.22em',
                            background: 'linear-gradient(90deg, #005AFF 0%, #39B54A 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            opacity: 0.05,
                            animation: 'hero-watermark-breathe 9s ease-in-out infinite',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        TOPSTOCX
                    </span>
                </div>
            )}

            {/* ── Layer 6: vignette + bottom fade to base ─────────────────── */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 6,
                background: `
                    radial-gradient(ellipse at center, transparent 42%, rgba(3,5,14,0.55) 100%),
                    linear-gradient(180deg, rgba(3,5,14,0.40) 0%, transparent 18%, transparent 78%, #03050e 100%)
                `,
                pointerEvents: 'none',
            }} />
        </div>
    );
}

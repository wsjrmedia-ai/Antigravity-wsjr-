import { useMemo } from 'react';

const BEAM_CONFIG = [
    { left: '8%',  width: 180, delay: '0s',    duration: '14s', color: 'rgba(0, 90, 255, 0.55)',   hueShift: '8deg'  },
    { left: '18%', width: 140, delay: '-3s',   duration: '17s', color: 'rgba(119, 166, 255, 0.45)', hueShift: '0deg'  },
    { left: '28%', width: 220, delay: '-6s',   duration: '19s', color: 'rgba(0, 39, 111, 0.65)',    hueShift: '10deg' },
    { left: '38%', width: 160, delay: '-1.5s', duration: '15s', color: 'rgba(57, 181, 74, 0.5)',    hueShift: '-6deg' },
    { left: '48%', width: 240, delay: '-4s',   duration: '22s', color: 'rgba(89, 225, 108, 0.45)',  hueShift: '4deg'  },
    { left: '58%', width: 180, delay: '-8s',   duration: '18s', color: 'rgba(20, 66, 26, 0.75)',    hueShift: '-8deg' },
    { left: '68%', width: 200, delay: '-2s',   duration: '20s', color: 'rgba(0, 90, 255, 0.5)',     hueShift: '6deg'  },
    { left: '78%', width: 150, delay: '-5s',   duration: '16s', color: 'rgba(57, 181, 74, 0.45)',   hueShift: '-4deg' },
    { left: '88%', width: 210, delay: '-7s',   duration: '21s', color: 'rgba(119, 166, 255, 0.4)',  hueShift: '2deg'  },
];

export default function AuroraBackground({ children, height = '100%', style = {} }) {
    const beams = useMemo(() => BEAM_CONFIG, []);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height,
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #03050e 0%, #050c1a 40%, #061a12 100%)',
            isolation: 'isolate',
            ...style,
        }}>
            <style>{`
                @keyframes aurora-beam-sway {
                    0%   { transform: translate(-50%, -10%) scaleY(1)    rotate(var(--tilt, 0deg)); opacity: 0.55; }
                    50%  { transform: translate(-50%, -6%)  scaleY(1.15) rotate(calc(var(--tilt, 0deg) + 4deg)); opacity: 0.85; }
                    100% { transform: translate(-50%, -10%) scaleY(1)    rotate(var(--tilt, 0deg)); opacity: 0.55; }
                }
                @keyframes aurora-haze-drift {
                    0%   { transform: translate(-8%, 0) scale(1);    opacity: 0.55; }
                    50%  { transform: translate(8%, -3%) scale(1.1); opacity: 0.85; }
                    100% { transform: translate(-8%, 0) scale(1);    opacity: 0.55; }
                }
            `}</style>

            {/* Deep horizon haze — blue top-left, green bottom-right */}
            <div aria-hidden="true" style={{
                position: 'absolute', inset: '-10%', pointerEvents: 'none',
                background: `
                    radial-gradient(ellipse 50% 60% at 15% 20%, rgba(0, 90, 255, 0.45) 0%, transparent 60%),
                    radial-gradient(ellipse 55% 55% at 85% 80%, rgba(57, 181, 74, 0.4) 0%, transparent 60%),
                    radial-gradient(ellipse 40% 30% at 50% 50%, rgba(119, 166, 255, 0.15) 0%, transparent 70%)
                `,
                filter: 'blur(40px)',
                animation: 'aurora-haze-drift 24s ease-in-out infinite',
                zIndex: 0,
            }} />

            {/* Vertical light beams (aurora streaks) */}
            <div aria-hidden="true" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
            }}>
                {beams.map((b, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: '-15%',
                            left: b.left,
                            width: b.width,
                            height: '130%',
                            transformOrigin: '50% 0%',
                            transform: `translate(-50%, -10%) rotate(${b.hueShift})`,
                            background: `linear-gradient(180deg,
                                transparent 0%,
                                ${b.color} 35%,
                                ${b.color} 60%,
                                transparent 100%)`,
                            filter: 'blur(28px)',
                            mixBlendMode: 'screen',
                            '--tilt': b.hueShift,
                            animation: `aurora-beam-sway ${b.duration} ease-in-out infinite`,
                            animationDelay: b.delay,
                        }}
                    />
                ))}
            </div>

            {/* Subtle noise/vignette for depth */}
            <div aria-hidden="true" style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
                background: `
                    radial-gradient(ellipse at center, transparent 40%, rgba(3, 5, 14, 0.55) 100%),
                    linear-gradient(180deg, rgba(3, 5, 14, 0.35) 0%, transparent 20%, transparent 80%, rgba(3, 5, 14, 0.65) 100%)
                `,
            }} />

            {/* Foreground content */}
            <div style={{ position: 'relative', zIndex: 3, width: '100%', height: '100%' }}>
                {children}
            </div>
        </div>
    );
}

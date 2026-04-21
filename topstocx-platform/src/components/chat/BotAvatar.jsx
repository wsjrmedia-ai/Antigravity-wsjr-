import { useRef, useState, useEffect } from 'react';

/**
 * BotAvatar — renders the Topstocx 3D bot PNG with genuine 3D feel:
 *   - idle float + breathing
 *   - mouse-tilt parallax (perspective + rotateX/rotateY)
 *   - brand-colored glow + ground shadow
 *   - variant='manu'  -> brand blue glow  (#005AFF / #77A6FF)
 *   - variant='atlas' -> brand green glow (#39B54A / #59E16C)
 */
export default function BotAvatar({ size = 80, variant = 'manu', glow = true, style = {} }) {
    const isManu = variant === 'manu';
    const primary = isManu ? '0, 90, 255' : '57, 181, 74';
    const lighter = isManu ? '119, 166, 255' : '89, 225, 108';

    const wrapRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    // Reset tilt smoothly when not hovering
    useEffect(() => {
        if (!hovered) {
            const t = setTimeout(() => setTilt({ x: 0, y: 0 }), 50);
            return () => clearTimeout(t);
        }
    }, [hovered]);

    const handleMove = (e) => {
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        // Clamp and scale — max ~18deg tilt
        const maxTilt = 18;
        setTilt({
            x: Math.max(-1, Math.min(1, -dy)) * maxTilt,
            y: Math.max(-1, Math.min(1, dx)) * maxTilt,
        });
    };

    const dropShadow = glow
        ? `drop-shadow(0 10px 22px rgba(0,0,0,0.55)) drop-shadow(0 0 22px rgba(${primary}, 0.6)) drop-shadow(0 0 8px rgba(${lighter}, 0.4))`
        : `drop-shadow(0 0 8px rgba(${primary}, 0.4))`;

    const atlasTint = isManu ? '' : ' hue-rotate(90deg) saturate(1.15)';

    return (
        <div
            ref={wrapRef}
            onMouseMove={handleMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                perspective: `${size * 6}px`,
                perspectiveOrigin: '50% 50%',
                cursor: 'pointer',
                ...style,
            }}
        >
            <style>{`
                @keyframes botFloat_${variant} {
                    0%, 100% { transform: translateY(0) rotateZ(0deg); }
                    50%      { transform: translateY(-6%) rotateZ(1.5deg); }
                }
                @keyframes botBreathe_${variant} {
                    0%, 100% { filter: ${dropShadow}${atlasTint}; }
                    50%      { filter: drop-shadow(0 10px 22px rgba(0,0,0,0.55)) drop-shadow(0 0 30px rgba(${primary}, 0.85)) drop-shadow(0 0 12px rgba(${lighter}, 0.55))${atlasTint}; }
                }
                @keyframes botGround_${variant} {
                    0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.55; }
                    50%      { transform: translateX(-50%) scale(0.85); opacity: 0.35; }
                }
            `}</style>

            {/* Ground shadow (fake floor contact) */}
            {glow && (
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: '-6%',
                        width: '70%',
                        height: '10%',
                        borderRadius: '50%',
                        background: `radial-gradient(ellipse at center, rgba(${primary}, 0.55) 0%, rgba(${primary}, 0) 70%)`,
                        filter: 'blur(6px)',
                        animation: `botGround_${variant} 4s ease-in-out infinite`,
                        transform: 'translateX(-50%)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            {/* Floating wrapper — idle animation */}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    animation: `botFloat_${variant} 4s ease-in-out infinite`,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Tilt wrapper — reacts to mouse */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.06 : 1})`,
                        transition: hovered
                            ? 'transform 0.08s ease-out'
                            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <img
                        src="/topstocx.png"
                        alt="Topstocx Bot"
                        width={size}
                        height={size}
                        draggable={false}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            animation: glow ? `botBreathe_${variant} 3.2s ease-in-out infinite` : undefined,
                            filter: `${dropShadow}${atlasTint}`,
                            userSelect: 'none',
                            WebkitUserDrag: 'none',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

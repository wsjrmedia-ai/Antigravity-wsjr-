import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * BotAvatar — 3D CEO character, made to feel alive.
 *
 * The source 3D render ships with a built-in card background (dark frame
 * + circuit pattern), so a raw plane reads as a flat photo. To fix that
 * and give the mascot life we:
 *
 *   1. Shader-mask the PNG with a soft radial falloff so the rectangular
 *      edges fade to alpha and only the character silhouette survives.
 *   2. Turntable: slow Y-axis sin rotation so he subtly looks side to side.
 *   3. Breathing: gentle scale oscillation, like a living character.
 *   4. Parallax tilt: the whole rig leans toward the mouse / device tilt.
 *   5. Halo: a brand-tinted radial glow behind the canvas that pulses.
 *
 * If you swap `/public/ceo/ceo_3d_avatar.png` for a version with a
 * genuinely transparent background, it'll look even cleaner — the
 * radial mask is defensive so it still won't hurt that case.
 */
const CEO_AVATAR_SRC = '/ceo/ceo_3d_avatar.png';

export default function BotAvatar({ size = 80, variant = 'manu', glow = true, style = {} }) {
    const isManu  = variant === 'manu';
    const accent  = isManu ? '#29B6E8' : '#59E16C';
    const haloRGB = isManu ? '0, 90, 255' : '57, 181, 74';

    // Desktop mouse parallax — device tilt is also respected via devicemotion.
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const wrapRef = useRef(null);

    useEffect(() => {
        const node = wrapRef.current;
        if (!node) return;

        const onMove = (e) => {
            const r = node.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            // Normalise to [-1, 1] based on a 400px radius of influence
            const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / 400));
            const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / 400));
            setTilt({ x: nx, y: ny });
        };
        const onLeave = () => setTilt({ x: 0, y: 0 });

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseout', onLeave);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseout', onLeave);
        };
    }, []);

    return (
        <div
            ref={wrapRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'transparent',
                ...style,
            }}
        >
            {/* Pulsing brand-tinted halo behind the character */}
            {glow && (
                <div
                    aria-hidden
                    className="ceoav-halo"
                    style={{
                        position: 'absolute',
                        inset: '-8%',
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 50% 52%, rgba(${haloRGB}, 0.55) 0%, rgba(${haloRGB}, 0.25) 35%, rgba(${haloRGB}, 0) 70%)`,
                        filter: 'blur(14px)',
                        pointerEvents: 'none',
                        animation: 'ceoav-pulse 3.6s ease-in-out infinite',
                    }}
                />
            )}

            <style>{`
                @keyframes ceoav-pulse {
                    0%, 100% { opacity: .70; transform: scale(1); }
                    50%      { opacity: 1;   transform: scale(1.05); }
                }
            `}</style>

            <Canvas
                camera={{ position: [0, 0, 3.1], fov: 36 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true, premultipliedAlpha: true }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.95} />
                    <directionalLight position={[2.5, 3, 2.5]} intensity={1.0} />
                    <directionalLight position={[-2, -1, 1.5]} intensity={0.35} color={accent} />

                    <CeoCharacter src={CEO_AVATAR_SRC} tilt={tilt} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── The character: masked PNG with breathing, turntable & parallax ────────
function CeoCharacter({ src, tilt }) {
    const group = useRef(null);
    const texture = useImageTexture(src);

    // Custom shader material with radial alpha falloff so the PNG's built-in
    // card background fades to transparent — we keep just the character.
    const material = useMemo(() => {
        if (!texture) return null;
        return new THREE.ShaderMaterial({
            uniforms: {
                map:        { value: texture },
                uFadeInner: { value: 0.30 },   // full alpha up to this radius (0-0.5)
                uFadeOuter: { value: 0.495 },  // fully transparent beyond this radius
            },
            transparent: true,
            depthWrite:  false,
            vertexShader: /* glsl */`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: /* glsl */`
                uniform sampler2D map;
                uniform float uFadeInner;
                uniform float uFadeOuter;
                varying vec2 vUv;
                void main() {
                    vec4 tex = texture2D(map, vUv);
                    vec2 p = vUv - 0.5;
                    // Squeeze x a touch so the mask hugs the (usually taller) character
                    p.x *= 1.05;
                    float r = length(p);
                    float mask = 1.0 - smoothstep(uFadeInner, uFadeOuter, r);
                    gl_FragColor = vec4(tex.rgb, tex.a * mask);
                    if (gl_FragColor.a < 0.01) discard;
                }
            `,
        });
    }, [texture]);

    // Plane dimensions follow the texture's aspect ratio.
    const { width, height } = useMemo(() => {
        if (!texture || !texture.image) return { width: 2.1, height: 2.1 };
        const a = texture.image.width / texture.image.height;
        const h = 2.3;
        return { width: h * a, height: h };
    }, [texture]);

    // Animate: breathing + turntable + smooth parallax tilt
    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();

        // Turntable (Y) — slow side-to-side look, ~±9°
        const turn = Math.sin(t * 0.6) * 0.16;
        // Idle head-tilt (Z) — a few degrees
        const roll = Math.sin(t * 0.45 + 1.1) * 0.04;
        // Breathing (scale) — 1 ± 2%
        const breathe = 1 + Math.sin(t * 1.6) * 0.02;
        // Float (Y translate)
        const bob = Math.sin(t * 1.3) * 0.04;

        // Ease toward mouse tilt (parallax) — limit to ±8°
        const targetY = turn + tilt.x * 0.28;
        const targetX = tilt.y * -0.18;
        group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
        group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
        group.current.rotation.z = roll;
        group.current.scale.setScalar(breathe);
        group.current.position.y = bob;
    });

    if (!material) return null;

    return (
        <group ref={group}>
            <mesh material={material}>
                <planeGeometry args={[width, height, 1, 1]} />
            </mesh>
        </group>
    );
}

// ── Texture hook with graceful error handling ────────────────────────────
function useImageTexture(src) {
    const [tex, setTex] = useState(null);

    useEffect(() => {
        let disposed = false;
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');

        loader.load(
            src,
            (t) => {
                if (disposed) { t.dispose(); return; }
                t.colorSpace  = THREE.SRGBColorSpace;
                t.anisotropy  = 8;
                t.minFilter   = THREE.LinearMipmapLinearFilter;
                t.magFilter   = THREE.LinearFilter;
                t.needsUpdate = true;
                setTex(t);
            },
            undefined,
            () => setTex(null),
        );

        return () => {
            disposed = true;
            setTex((t) => { if (t) t.dispose(); return null; });
        };
    }, [src]);

    return tex;
}

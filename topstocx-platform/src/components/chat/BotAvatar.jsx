import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * BotAvatar — Topstocx chrome-sphere chatbot icon.
 *
 * A friendly polished-metal sphere with a dark glossy visor, glowing cyan
 * eyes + smile, glowing bezel ring and two side "ear" pods with cyan
 * accents. Procedural geometry only — no photo, no GLB, no textures.
 *
 * Chrome reflections come from an in-memory `RoomEnvironment` ran
 * through `PMREMGenerator` so no network fetch / HDR file is required.
 *
 * Brand palette:
 *   --brand-blue        #005AFF   (halo, pupils)
 *   --brand-cyan-glow   #7fd8ff   (face + bezel + ear cyan)
 *   chrome body         #eef2f8
 *   visor glass         #05101a   (near-black navy)
 *
 * Anatomy:
 *   • Chrome body sphere (metalness 1.0, roughness 0.14)
 *   • Visor disc (flattened ellipsoid, dark glossy)
 *   • Cyan bezel ring (torus, emissive)
 *   • Two glowing eye spheres (emissive) — blink every ~5s
 *   • Smile (half-torus, emissive)
 *   • Left + right ear pods (chrome puck + cyan glow insert)
 *
 * Motion:
 *   • Slow turntable sway + mouse parallax
 *   • Gentle Y-bob
 *   • Eye blinks on a 5s cycle
 *   • CSS halo pulses behind the canvas
 *   • Full prefers-reduced-motion support
 *
 * API preserved: <BotAvatar size variant glow style />
 */

const BRAND = {
    blue:     '#005AFF',
    cyanGlow: '#7fd8ff',
    chrome:   '#eef2f8',
    visor:    '#05101a',
};

// ── Procedural HDR-style environment — local, zero network ──────────────
function SceneEnvironment() {
    const { scene, gl } = useThree();
    useEffect(() => {
        const pmrem = new THREE.PMREMGenerator(gl);
        const env   = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        const prev  = scene.environment;
        scene.environment = env;
        return () => {
            scene.environment = prev;
            env.dispose();
            pmrem.dispose();
        };
    }, [scene, gl]);
    return null;
}

export default function BotAvatar({ size = 80, variant = 'manu', glow = true, style = {} }) {
    const isManu   = variant === 'manu';
    const haloRGB  = isManu ? '0, 90, 255' : '89, 225, 108';
    const haloRGB2 = '127, 216, 255';

    const wrapRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const node = wrapRef.current;
        if (!node) return;
        const onMove = (e) => {
            const r = node.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
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
            {glow && (
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: '-8%',
                        borderRadius: '50%',
                        background: `
                            radial-gradient(circle at 50% 50%,
                                rgba(${haloRGB}, 0.50) 0%,
                                rgba(${haloRGB2}, 0.28) 38%,
                                rgba(0, 0, 0, 0) 70%)
                        `,
                        filter: 'blur(18px)',
                        pointerEvents: 'none',
                        animation: 'tsx-bot-pulse 3.6s ease-in-out infinite',
                    }}
                />
            )}

            <style>{`
                @keyframes tsx-bot-pulse {
                    0%, 100% { opacity: .70; transform: scale(1);    }
                    50%      { opacity: 1;   transform: scale(1.06); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .tsx-bot-canvas { animation: none !important; }
                }
            `}</style>

            <Canvas
                className="tsx-bot-canvas"
                camera={{ position: [0, 0, 3.6], fov: 30 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true, premultipliedAlpha: true }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <SceneEnvironment />
                    <ambientLight intensity={0.35} />
                    <directionalLight position={[ 3.0,  4.0,  3.0]} intensity={1.05} color="#ffffff" />
                    <pointLight       position={[-2.5, -1.0,  2.0]} intensity={0.7}  color={BRAND.cyanGlow} />
                    <pointLight       position={[ 2.0,  2.0,  2.0]} intensity={0.55} color="#d5e4ff" />
                    <ChromeBot tilt={tilt} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── The bot itself ──────────────────────────────────────────────────────
function ChromeBot({ tilt }) {
    const group    = useRef(null);
    const leftEye  = useRef(null);
    const rightEye = useRef(null);

    // Smile = half-torus rotated so the arc opens upward (U-shape).
    const smileGeo = useMemo(
        () => new THREE.TorusGeometry(0.15, 0.024, 12, 56, Math.PI),
        []
    );

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (group.current) {
            const turn    = Math.sin(t * 0.5) * 0.22;
            const targetY = turn + tilt.x * 0.35;
            const targetX = tilt.y * -0.18;
            group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
            group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
            group.current.position.y = Math.sin(t * 1.3) * 0.03;
        }

        // Blink: closed for a brief slice once every ~5 seconds.
        const phase = (t % 5) / 5;
        const blink = phase > 0.95 ? 0.08 : 1;
        if (leftEye.current)  leftEye.current.scale.y  += (blink - leftEye.current.scale.y)  * 0.35;
        if (rightEye.current) rightEye.current.scale.y += (blink - rightEye.current.scale.y) * 0.35;
    });

    return (
        <group ref={group}>
            {/* Chrome body */}
            <mesh>
                <sphereGeometry args={[1.0, 96, 96]} />
                <meshStandardMaterial
                    color={BRAND.chrome}
                    metalness={1.0}
                    roughness={0.14}
                    envMapIntensity={1.2}
                />
            </mesh>

            {/* Visor — flattened glossy dome facing camera */}
            <mesh position={[0, 0, 0.72]} scale={[0.72, 0.72, 0.14]}>
                <sphereGeometry args={[1, 48, 48]} />
                <meshStandardMaterial
                    color={BRAND.visor}
                    metalness={0.55}
                    roughness={0.08}
                    envMapIntensity={0.9}
                />
            </mesh>

            {/* Bezel ring — glowing cyan frame around the visor */}
            <mesh position={[0, 0, 0.80]}>
                <torusGeometry args={[0.72, 0.028, 24, 120]} />
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={2.4}
                    metalness={0.2}
                    roughness={0.3}
                    toneMapped={false}
                />
            </mesh>

            {/* Eyes — glowing cyan spheres */}
            <mesh ref={leftEye} position={[-0.23, 0.08, 0.88]}>
                <sphereGeometry args={[0.105, 32, 32]} />
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={2.6}
                    toneMapped={false}
                />
            </mesh>
            <mesh ref={rightEye} position={[0.23, 0.08, 0.88]}>
                <sphereGeometry args={[0.105, 32, 32]} />
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={2.6}
                    toneMapped={false}
                />
            </mesh>

            {/* Smile — half-torus opening upward (U shape) */}
            <mesh position={[0, -0.22, 0.88]} rotation={[0, 0, Math.PI]}>
                <primitive object={smileGeo} attach="geometry" />
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={2.2}
                    toneMapped={false}
                />
            </mesh>

            {/* Left ear pod — chrome puck with cyan glow insert */}
            <group position={[-1.02, 0, 0]}>
                <mesh>
                    <sphereGeometry args={[0.24, 40, 40]} />
                    <meshStandardMaterial
                        color={BRAND.chrome}
                        metalness={1.0}
                        roughness={0.14}
                        envMapIntensity={1.2}
                    />
                </mesh>
                <mesh position={[-0.12, 0, 0]} scale={[0.18, 0.7, 0.7]}>
                    <sphereGeometry args={[0.22, 28, 28]} />
                    <meshStandardMaterial
                        color={BRAND.cyanGlow}
                        emissive={BRAND.cyanGlow}
                        emissiveIntensity={2.4}
                        toneMapped={false}
                    />
                </mesh>
            </group>

            {/* Right ear pod — mirror of the left */}
            <group position={[1.02, 0, 0]}>
                <mesh>
                    <sphereGeometry args={[0.24, 40, 40]} />
                    <meshStandardMaterial
                        color={BRAND.chrome}
                        metalness={1.0}
                        roughness={0.14}
                        envMapIntensity={1.2}
                    />
                </mesh>
                <mesh position={[0.12, 0, 0]} scale={[0.18, 0.7, 0.7]}>
                    <sphereGeometry args={[0.22, 28, 28]} />
                    <meshStandardMaterial
                        color={BRAND.cyanGlow}
                        emissive={BRAND.cyanGlow}
                        emissiveIntensity={2.4}
                        toneMapped={false}
                    />
                </mesh>
            </group>
        </group>
    );
}

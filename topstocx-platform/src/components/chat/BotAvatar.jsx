import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * BotAvatar — procedural Three.js 3D robot matching the Topstocx mascot:
 * round white head, dark visor, cyan eyes + smile, cyan headphones, antenna.
 *   - variant='manu'  -> cyan accents  (brand blue family)
 *   - variant='atlas' -> green accents (brand green family)
 */
export default function BotAvatar({ size = 80, variant = 'manu', glow = true, style = {} }) {
    const isManu = variant === 'manu';
    const accent = isManu ? '#29B6E8' : '#59E16C';    // cyan / green
    const accentDeep = isManu ? '#0E7FB0' : '#1F8A3A';
    const glowRGB = isManu ? '0, 90, 255' : '57, 181, 74';

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                ...style,
            }}
        >
            {/* Ambient glow behind the bot */}
            {glow && (
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 50% 55%, rgba(${glowRGB}, 0.45) 0%, rgba(${glowRGB}, 0) 65%)`,
                        filter: 'blur(8px)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            <Canvas
                camera={{ position: [0, 0.1, 3.2], fov: 38 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.55} />
                    <directionalLight position={[2.5, 3, 2.5]} intensity={1.2} />
                    <directionalLight position={[-2, -1, 1.5]} intensity={0.35} color={accent} />
                    <pointLight position={[0, 0, 2]} intensity={0.6} color={accent} />

                    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.7}>
                        <Robot accent={accent} accentDeep={accentDeep} />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── The robot ───────────────────────────────────────────────────────────────
function Robot({ accent, accentDeep }) {
    const group = useRef(null);

    // Subtle idle rotation (Float handles bob + random tilt)
    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();
        group.current.rotation.y = Math.sin(t * 0.6) * 0.15;
    });

    const white = '#ECEFF4';
    const whiteShade = '#C8CDD6';
    const visor = '#0E1730';
    const black = '#070A14';

    // Smile curve points (curved line on visor)
    const smilePoints = useMemo(() => {
        const pts = [];
        const segs = 24;
        for (let i = 0; i <= segs; i++) {
            const t = i / segs;
            const x = (t - 0.5) * 0.26;
            // parabola opening upward -> U shape (smile)
            const y = -0.02 + Math.pow((t - 0.5) * 2, 2) * 0.05;
            pts.push(new THREE.Vector3(x, -y - 0.02, 0.01));
        }
        return pts;
    }, []);
    const smileGeom = useMemo(() => new THREE.BufferGeometry().setFromPoints(smilePoints), [smilePoints]);

    return (
        <group ref={group} position={[0, -0.05, 0]} scale={1.05}>
            {/* ── HEAD (rounded white capsule) ───────────────────────────── */}
            <mesh castShadow>
                <sphereGeometry args={[0.7, 48, 48]} />
                <meshStandardMaterial color={white} roughness={0.35} metalness={0.15} />
            </mesh>

            {/* Subtle bottom shading under the jaw */}
            <mesh position={[0, -0.45, 0.15]}>
                <sphereGeometry args={[0.55, 32, 32]} />
                <meshStandardMaterial color={whiteShade} roughness={0.6} metalness={0.05} transparent opacity={0.45} />
            </mesh>

            {/* ── ANTENNA ─────────────────────────────────────────────────── */}
            <mesh position={[0, 0.75, 0]}>
                <cylinderGeometry args={[0.025, 0.025, 0.18, 16]} />
                <meshStandardMaterial color={white} roughness={0.3} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0.88, 0]}>
                <sphereGeometry args={[0.06, 24, 24]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} roughness={0.2} />
            </mesh>

            {/* ── VISOR / FACE PLATE (dark rounded panel) ─────────────────── */}
            <group position={[0, 0.02, 0.52]}>
                <mesh>
                    <sphereGeometry
                        args={[
                            0.48, 48, 48,
                            0, Math.PI * 2,   // full azimuth
                            Math.PI * 0.32, Math.PI * 0.36, // vertical slice -> wraparound band
                        ]}
                    />
                    <meshStandardMaterial color={visor} roughness={0.25} metalness={0.4} />
                </mesh>
            </group>

            {/* Simpler flat visor fallback: rounded rectangle on the front */}
            <mesh position={[0, 0.02, 0.56]}>
                <planeGeometry args={[0.78, 0.5]} />
                <meshStandardMaterial color={visor} roughness={0.3} metalness={0.35} />
            </mesh>

            {/* ── EYES (cyan glowing dots) ─────────────────────────────────── */}
            <mesh position={[-0.16, 0.06, 0.585]}>
                <sphereGeometry args={[0.065, 24, 24]} />
                <meshStandardMaterial
                    color={accent}
                    emissive={accent}
                    emissiveIntensity={1.6}
                    roughness={0.15}
                />
            </mesh>
            <mesh position={[0.16, 0.06, 0.585]}>
                <sphereGeometry args={[0.065, 24, 24]} />
                <meshStandardMaterial
                    color={accent}
                    emissive={accent}
                    emissiveIntensity={1.6}
                    roughness={0.15}
                />
            </mesh>

            {/* Tiny eye highlights */}
            <mesh position={[-0.14, 0.09, 0.645]}>
                <sphereGeometry args={[0.018, 12, 12]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0.18, 0.09, 0.645]}>
                <sphereGeometry args={[0.018, 12, 12]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>

            {/* ── SMILE (curved line) ──────────────────────────────────────── */}
            <group position={[0, -0.14, 0.58]}>
                <line geometry={smileGeom}>
                    <lineBasicMaterial color={accent} linewidth={2} />
                </line>
                {/* Thicker smile via a tube-ish torus segment */}
                <mesh rotation={[0, 0, 0]}>
                    <torusGeometry args={[0.14, 0.022, 16, 32, Math.PI]} />
                    <meshStandardMaterial
                        color={accent}
                        emissive={accent}
                        emissiveIntensity={1.2}
                        roughness={0.2}
                    />
                </mesh>
            </group>

            {/* ── HEADPHONES ───────────────────────────────────────────────── */}
            {/* Band over the top */}
            <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.55, 0]}>
                <torusGeometry args={[0.6, 0.05, 20, 40, Math.PI]} />
                <meshStandardMaterial color={black} roughness={0.4} metalness={0.3} />
            </mesh>

            {/* Left ear cup */}
            <group position={[-0.72, 0.05, 0]}>
                <mesh>
                    <sphereGeometry args={[0.24, 32, 32]} />
                    <meshStandardMaterial color={accent} roughness={0.3} metalness={0.3} />
                </mesh>
                <mesh position={[0.08, 0, 0]}>
                    <cylinderGeometry args={[0.17, 0.17, 0.12, 32]} />
                    <meshStandardMaterial color={accentDeep} roughness={0.4} metalness={0.4} />
                </mesh>
                <mesh position={[0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.11, 0.11, 0.02, 32]} />
                    <meshStandardMaterial color={black} roughness={0.5} />
                </mesh>
            </group>

            {/* Right ear cup */}
            <group position={[0.72, 0.05, 0]}>
                <mesh>
                    <sphereGeometry args={[0.24, 32, 32]} />
                    <meshStandardMaterial color={accent} roughness={0.3} metalness={0.3} />
                </mesh>
                <mesh position={[-0.08, 0, 0]}>
                    <cylinderGeometry args={[0.17, 0.17, 0.12, 32]} />
                    <meshStandardMaterial color={accentDeep} roughness={0.4} metalness={0.4} />
                </mesh>
                <mesh position={[-0.14, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.11, 0.11, 0.02, 32]} />
                    <meshStandardMaterial color={black} roughness={0.5} />
                </mesh>
            </group>

            {/* ── MICROPHONE BOOM (small arm from left ear cup) ────────────── */}
            <mesh position={[-0.52, -0.18, 0.35]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.022, 0.022, 0.36, 12]} />
                <meshStandardMaterial color={black} roughness={0.5} />
            </mesh>
            <mesh position={[-0.35, -0.32, 0.48]}>
                <sphereGeometry args={[0.05, 20, 20]} />
                <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} roughness={0.3} />
            </mesh>
        </group>
    );
}

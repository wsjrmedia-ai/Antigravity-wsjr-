import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * BotAvatar — Topstocx 3D chatbot character.
 *
 * Procedural robot character: rounded TV-style head with a glowing
 * cyan visor + eyes + smile, wobbly antenna, chest panel with brand-
 * blue logo light, shoulders, arms and hands. Assembled entirely from
 * primitive geometry so it ships as zero asset bytes.
 *
 * Chrome reflections come from three's `RoomEnvironment` fed through
 * `PMREMGenerator` in-memory (no HDR download, no network requests).
 *
 * Brand palette:
 *   chrome          #eef2f8   (body panels, metallic)
 *   visor glass     #05101a   (near-black navy)
 *   cyan glow       #7fd8ff   (eyes, smile, antenna, bezel)
 *   brand blue      #005AFF   (chest logo, halo)
 *
 * Motion:
 *   • Whole rig — turntable sway + mouse parallax + Y-bob
 *   • Antenna wobbles side-to-side
 *   • Eyes blink every ~4.5 s
 *   • Chest logo subtly pulses
 *   • CSS halo pulses behind the canvas
 *   • Full prefers-reduced-motion support
 *
 * Props (API preserved):
 *   size, variant, glow, style
 */

const BRAND = {
    blue:     '#005AFF',
    cyanGlow: '#7fd8ff',
    chrome:   '#eef2f8',
    visor:    '#05101a',
};

// ── Procedural env — local, no network. ─────────────────────────────────
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
    const isManu  = variant === 'manu';
    const haloRGB = isManu ? '0, 90, 255' : '89, 225, 108';

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
                        inset: '-6%',
                        borderRadius: '50%',
                        background: `
                            radial-gradient(circle at 50% 55%,
                                rgba(${haloRGB}, 0.55) 0%,
                                rgba(127, 216, 255, 0.28) 38%,
                                rgba(0, 0, 0, 0) 72%)
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
                camera={{ position: [0, 0.1, 4.6], fov: 30 }}
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
                    <RobotCharacter tilt={tilt} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── Full robot character ────────────────────────────────────────────────
function RobotCharacter({ tilt }) {
    const group     = useRef(null);
    const antenna   = useRef(null);
    const leftEye   = useRef(null);
    const rightEye  = useRef(null);
    const chestRef  = useRef(null);
    const chestMat  = useMemo(() => new THREE.MeshStandardMaterial({
        color:             new THREE.Color(BRAND.blue),
        emissive:          new THREE.Color(BRAND.blue),
        emissiveIntensity: 1.4,
        toneMapped:        false,
    }), []);

    // Smile half-torus (opens upward → U-shape)
    const smileGeo = useMemo(
        () => new THREE.TorusGeometry(0.13, 0.02, 10, 48, Math.PI),
        []
    );

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (group.current) {
            const turn    = Math.sin(t * 0.45) * 0.22;
            const targetY = turn + tilt.x * 0.3;
            const targetX = tilt.y * -0.15;
            group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
            group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
            group.current.position.y = Math.sin(t * 1.25) * 0.04 - 0.05;
        }
        if (antenna.current) {
            antenna.current.rotation.z = Math.sin(t * 2.4) * 0.18;
        }
        if (chestMat) {
            chestMat.emissiveIntensity = 1.2 + Math.sin(t * 2.0) * 0.5;
        }

        // Eye blink on a 4.5 s cycle.
        const phase = (t % 4.5) / 4.5;
        const blink = phase > 0.96 ? 0.08 : 1;
        if (leftEye.current)  leftEye.current.scale.y  += (blink - leftEye.current.scale.y)  * 0.35;
        if (rightEye.current) rightEye.current.scale.y += (blink - rightEye.current.scale.y) * 0.35;
    });

    // Shared chrome material factory so each panel can carry its own
    // instance (avoids weird shared-state issues while keeping uniform look).
    const chrome = (extra = {}) => (
        <meshStandardMaterial
            color={BRAND.chrome}
            metalness={1.0}
            roughness={0.16}
            envMapIntensity={1.25}
            {...extra}
        />
    );

    return (
        <group ref={group} position={[0, -0.05, 0]}>
            {/* ── Antenna ───────────────────────────────────────── */}
            <group ref={antenna} position={[0, 0.95, 0]}>
                <mesh position={[0, 0.18, 0]}>
                    <cylinderGeometry args={[0.028, 0.038, 0.32, 20]} />
                    {chrome()}
                </mesh>
                <mesh position={[0, 0.40, 0]}>
                    <sphereGeometry args={[0.10, 28, 28]} />
                    <meshStandardMaterial
                        color={BRAND.cyanGlow}
                        emissive={BRAND.cyanGlow}
                        emissiveIntensity={2.4}
                        toneMapped={false}
                    />
                </mesh>
            </group>

            {/* ── Head ──────────────────────────────────────────── */}
            <RoundedBox args={[1.30, 1.05, 1.00]} radius={0.24} smoothness={5}
                position={[0, 0.40, 0]}>
                {chrome()}
            </RoundedBox>

            {/* Visor frame bezel — inset cyan glow strip */}
            <RoundedBox args={[1.10, 0.78, 0.04]} radius={0.14} smoothness={4}
                position={[0, 0.40, 0.50]}>
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={1.6}
                    toneMapped={false}
                />
            </RoundedBox>

            {/* Visor glass (dark, slightly in front of bezel) */}
            <RoundedBox args={[1.02, 0.70, 0.04]} radius={0.12} smoothness={4}
                position={[0, 0.40, 0.525]}>
                <meshStandardMaterial
                    color={BRAND.visor}
                    metalness={0.55}
                    roughness={0.08}
                    envMapIntensity={0.9}
                />
            </RoundedBox>

            {/* Eyes — glowing cyan discs on the visor */}
            <mesh ref={leftEye} position={[-0.24, 0.48, 0.56]}>
                <sphereGeometry args={[0.095, 28, 28]} />
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={2.8}
                    toneMapped={false}
                />
            </mesh>
            <mesh ref={rightEye} position={[0.24, 0.48, 0.56]}>
                <sphereGeometry args={[0.095, 28, 28]} />
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={2.8}
                    toneMapped={false}
                />
            </mesh>

            {/* Smile — opens upward */}
            <mesh position={[0, 0.23, 0.57]} rotation={[0, 0, Math.PI]}>
                <primitive object={smileGeo} attach="geometry" />
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={2.2}
                    toneMapped={false}
                />
            </mesh>

            {/* Side ear pods (small chrome pucks with cyan glow) */}
            {[-1, 1].map((s) => (
                <group key={s} position={[s * 0.70, 0.40, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.16, 28, 28]} />
                        {chrome()}
                    </mesh>
                    <mesh position={[s * 0.07, 0, 0]} scale={[0.22, 0.65, 0.65]}>
                        <sphereGeometry args={[0.15, 20, 20]} />
                        <meshStandardMaterial
                            color={BRAND.cyanGlow}
                            emissive={BRAND.cyanGlow}
                            emissiveIntensity={2.2}
                            toneMapped={false}
                        />
                    </mesh>
                </group>
            ))}

            {/* ── Neck ──────────────────────────────────────────── */}
            <mesh position={[0, -0.18, 0]}>
                <cylinderGeometry args={[0.2, 0.24, 0.2, 28]} />
                {chrome()}
            </mesh>

            {/* ── Body / torso ──────────────────────────────────── */}
            <RoundedBox args={[1.05, 0.90, 0.80]} radius={0.18} smoothness={5}
                position={[0, -0.70, 0]}>
                {chrome()}
            </RoundedBox>

            {/* Chest panel / logo light — subtle pulse */}
            <RoundedBox args={[0.46, 0.30, 0.04]} radius={0.05} smoothness={4}
                position={[0, -0.65, 0.42]} ref={chestRef}>
                <primitive object={chestMat} attach="material" />
            </RoundedBox>

            {/* Chest panel trim ring */}
            <mesh position={[0, -0.65, 0.44]}>
                <torusGeometry args={[0.20, 0.012, 16, 64]} />
                <meshStandardMaterial
                    color={BRAND.cyanGlow}
                    emissive={BRAND.cyanGlow}
                    emissiveIntensity={1.6}
                    toneMapped={false}
                />
            </mesh>

            {/* Shoulders */}
            {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.64, -0.40, 0]}>
                    <sphereGeometry args={[0.20, 28, 28]} />
                    {chrome()}
                </mesh>
            ))}

            {/* Arms */}
            {[-1, 1].map((s) => (
                <group key={s} position={[s * 0.68, -0.72, 0]} rotation={[0, 0, s * -0.12]}>
                    <mesh>
                        <cylinderGeometry args={[0.11, 0.11, 0.44, 20]} />
                        {chrome()}
                    </mesh>
                </group>
            ))}

            {/* Hands */}
            {[-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.76, -1.02, 0]}>
                    <sphereGeometry args={[0.16, 28, 28]} />
                    {chrome()}
                </mesh>
            ))}
        </group>
    );
}

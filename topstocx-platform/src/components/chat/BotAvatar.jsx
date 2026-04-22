import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * BotAvatar — 3D CEO medallion.
 *
 * Replaces the old procedural robot with a circular portrait disc of the
 * CEO, wrapped in a glowing brand-coloured rim, two counter-rotating halo
 * rings, and four orbiting accent pips. Floats gently and tilts in 3D.
 *
 * Keeps the same public API so FinAIChatbot doesn't need to change:
 *   - variant='manu'   -> cyan / brand-blue accents
 *   - variant='atlas'  -> green / brand-green accents
 *
 * Drop the CEO portrait at:
 *   /public/ceo/ceo-avatar.jpg       (default)
 *   /public/ceo/ceo-avatar-manu.jpg  (optional, overrides for manu)
 *   /public/ceo/ceo-avatar-atlas.jpg (optional, overrides for atlas)
 *
 * A tight head-and-shoulders crop (square, centred on the face) reads best
 * at the chat header's 44px size. The large 150px toggle will show more
 * breathing room around the crop thanks to the 0.82 disc radius.
 */
const CEO_DEFAULT_SRC  = '/ceo/ceo_3d_avatar.png';
const CEO_MANU_SRC     = '/ceo/ceo_3d_avatar.png';
const CEO_ATLAS_SRC    = '/ceo/ceo_3d_avatar.png';

export default function BotAvatar({ size = 80, variant = 'manu', glow = true, style = {} }) {
    const isManu      = variant === 'manu';
    const accent      = isManu ? '#29B6E8' : '#59E16C';
    const accentDeep  = isManu ? '#0E7FB0' : '#1F8A3A';
    const glowRGB     = isManu ? '0, 90, 255' : '57, 181, 74';

    // Prefer a variant-specific portrait if provided, otherwise the shared one.
    const primarySrc  = isManu ? CEO_MANU_SRC : CEO_ATLAS_SRC;

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                ...style,
            }}
        >
            {/* Soft brand-tinted ambient glow behind the medallion */}
            {glow && (
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: `radial-gradient(circle at 50% 50%, rgba(${glowRGB}, 0.55) 0%, rgba(${glowRGB}, 0) 62%)`,
                        filter: 'blur(10px)',
                        pointerEvents: 'none',
                    }}
                />
            )}

            <Canvas
                camera={{ position: [0, 0, 3.1], fov: 36 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.75} />
                    <directionalLight position={[2.5, 3, 2.5]} intensity={1.1} />
                    <directionalLight position={[-2, -1, 1.5]} intensity={0.35} color={accent} />
                    <pointLight position={[0, 0, 2]} intensity={0.6} color={accent} />

                    <Float speed={1.4} rotationIntensity={0.22} floatIntensity={0.5}>
                        <CeoMedallion
                            primarySrc={primarySrc}
                            fallbackSrc={CEO_DEFAULT_SRC}
                            accent={accent}
                            accentDeep={accentDeep}
                        />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── Medallion ────────────────────────────────────────────────────────────
function CeoMedallion({ primarySrc, fallbackSrc, accent, accentDeep }) {
    const outerRing = useRef(null);
    const innerRing = useRef(null);
    const pipsGroup = useRef(null);
    const texture   = useImageTexture(primarySrc, fallbackSrc);

    // Counter-rotating halo rings + slow pip orbit keep the medallion alive
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (outerRing.current) outerRing.current.rotation.z =  t * 0.35;
        if (innerRing.current) innerRing.current.rotation.z = -t * 0.55;
        if (pipsGroup.current) pipsGroup.current.rotation.z =  t * 0.25;
    });

    return (
        <group>
            {/* Deep shadow disc behind the medallion for subtle depth */}
            <mesh position={[0, 0, -0.1]}>
                <circleGeometry args={[1.04, 64]} />
                <meshBasicMaterial color="#05070d" transparent opacity={0.9} />
            </mesh>

            {/* Brand-tinted backing disc — the "coin" the portrait sits on */}
            <mesh position={[0, 0, -0.06]}>
                <circleGeometry args={[0.84, 64]} />
                <meshStandardMaterial
                    color="#0a1526"
                    emissive={accentDeep}
                    emissiveIntensity={0.45}
                    roughness={0.55}
                    metalness={0.15}
                />
            </mesh>

            {/* Subtle radial accent ring on the disc face */}
            <mesh position={[0, 0, -0.04]}>
                <ringGeometry args={[0.72, 0.84, 64]} />
                <meshBasicMaterial color={accent} transparent opacity={0.18} />
            </mesh>

            {/* ── Portrait plane (PNG with alpha — bust floats on top of the disc) */}
            <mesh position={[0, 0, 0.015]}>
                <planeGeometry args={[1.55, 1.55]} />
                {texture ? (
                    <meshStandardMaterial
                        map={texture}
                        transparent
                        alphaTest={0.02}
                        roughness={0.55}
                        metalness={0.1}
                        toneMapped={false}
                    />
                ) : (
                    // Fallback: invisible until the image is ready, backing disc carries the look
                    <meshBasicMaterial transparent opacity={0} />
                )}
            </mesh>

            {/* Metallic rim wrapping the portrait */}
            <mesh>
                <torusGeometry args={[0.84, 0.045, 24, 96]} />
                <meshStandardMaterial
                    color={accent}
                    emissive={accent}
                    emissiveIntensity={0.85}
                    metalness={0.65}
                    roughness={0.22}
                />
            </mesh>

            {/* Outer rotating halo — soft dashed glow */}
            <mesh ref={outerRing} position={[0, 0, 0.02]}>
                <torusGeometry args={[0.99, 0.012, 12, 96]} />
                <meshBasicMaterial color={accent} transparent opacity={0.55} />
            </mesh>

            {/* Inner rotating halo — white filigree */}
            <mesh ref={innerRing} position={[0, 0, 0.03]}>
                <torusGeometry args={[0.92, 0.008, 10, 72]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
            </mesh>

            {/* Four orbiting pips around the rim */}
            <group ref={pipsGroup}>
                {[0, 1, 2, 3].map((i) => (
                    <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
                        <mesh position={[1.06, 0, 0.04]}>
                            <sphereGeometry args={[0.04, 18, 18]} />
                            <meshStandardMaterial
                                color={accent}
                                emissive={accent}
                                emissiveIntensity={1.5}
                                roughness={0.2}
                                metalness={0.4}
                            />
                        </mesh>
                    </group>
                ))}
            </group>
        </group>
    );
}

// ── Texture hook with graceful 404 fallback ──────────────────────────────
function useImageTexture(primarySrc, fallbackSrc) {
    const [tex, setTex] = useState(null);

    useEffect(() => {
        let disposed  = false;
        const loader  = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');

        const apply = (t) => {
            if (disposed) { t.dispose(); return; }
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = 8;
            t.minFilter  = THREE.LinearMipmapLinearFilter;
            t.magFilter  = THREE.LinearFilter;
            t.needsUpdate = true;
            setTex(t);
        };

        loader.load(
            primarySrc,
            apply,
            undefined,
            () => {
                // Primary missing → try the shared default
                if (primarySrc === fallbackSrc) { setTex(null); return; }
                loader.load(fallbackSrc, apply, undefined, () => setTex(null));
            },
        );

        return () => {
            disposed = true;
            setTex((t) => { if (t) t.dispose(); return null; });
        };
    }, [primarySrc, fallbackSrc]);

    return tex;
}

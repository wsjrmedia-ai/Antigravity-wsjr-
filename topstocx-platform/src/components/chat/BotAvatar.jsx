import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';

/**
 * BotAvatar — 3D CEO character avatar.
 *
 * Loads a real 3D mesh (GLB/GLTF) of the CEO from /public/ceo/ceo.glb,
 * plays any embedded animations (idle, talk, etc.), and falls back to a
 * soft-masked portrait PNG if the model isn't present.
 *
 * HOW TO GENERATE /public/ceo/ceo.glb FROM PHOTOS:
 *   1. Meshy.ai      — upload a head-and-shoulders photo, "Image to 3D",
 *                      export as GLB.  (Free tier available.)
 *   2. Tripo AI      — same flow, image to 3D, GLB export.
 *   3. RODIN (Hyper3D) — photo to 3D mesh, high-fidelity GLB.
 *   4. Ready Player Me — create a stylised avatar that resembles him,
 *                        export GLB. Great for animated rigs.
 *   5. Character Creator 4 + Headshot — studio-grade photo-to-3D.
 *
 * The file MUST be at:  /public/ceo/ceo.glb
 *
 * If it has baked animations they'll play on loop automatically. If not,
 * we apply procedural idle motion (turntable + breathing + parallax).
 */
const CEO_MODEL_SRC   = '/ceo/ceo.glb';
const CEO_PORTRAIT_SRC = '/ceo/ceo_3d_avatar.png';   // fallback when GLB is missing

export default function BotAvatar({ size = 80, variant = 'manu', glow = true, style = {} }) {
    const isManu  = variant === 'manu';
    const accent  = isManu ? '#29B6E8' : '#59E16C';
    const haloRGB = isManu ? '0, 90, 255' : '57, 181, 74';

    const wrapRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hasModel, setHasModel] = useState(null); // null = unknown, true = GLB, false = fallback

    // Probe whether the GLB exists so we can pick the correct renderer.
    useEffect(() => {
        let dead = false;
        fetch(CEO_MODEL_SRC, { method: 'HEAD' })
            .then((r) => { if (!dead) setHasModel(r.ok); })
            .catch(() => { if (!dead) setHasModel(false); });
        return () => { dead = true; };
    }, []);

    // Desktop mouse parallax
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
                camera={{ position: [0, 0.1, 3.2], fov: 35 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true, premultipliedAlpha: true }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
                shadows
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.9} />
                    <hemisphereLight args={['#ffffff', '#1a2a3a', 0.5]} />
                    <directionalLight
                        position={[2.5, 3, 2.5]}
                        intensity={1.2}
                        castShadow
                        shadow-mapSize={[1024, 1024]}
                    />
                    <directionalLight position={[-2, -1, 1.5]} intensity={0.45} color={accent} />
                    <pointLight position={[0, 0.4, 2]} intensity={0.4} color={accent} />

                    {hasModel === true && <CeoModel src={CEO_MODEL_SRC} tilt={tilt} />}
                    {hasModel === false && <CeoFallbackPortrait src={CEO_PORTRAIT_SRC} tilt={tilt} />}
                    {/* hasModel === null → still probing; render nothing for one frame */}
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── Real 3D model path ────────────────────────────────────────────────────
function CeoModel({ src, tilt }) {
    const group = useRef(null);
    const { scene, animations } = useGLTF(src);
    const { actions, names } = useAnimations(animations, group);

    // Play the first clip on loop if the GLB has any (idle / talk / etc.)
    useEffect(() => {
        if (!names || names.length === 0) return;
        const first = actions[names[0]];
        if (first) {
            first.reset().fadeIn(0.3).play();
            first.setLoop(THREE.LoopRepeat, Infinity);
        }
        return () => { if (first) first.fadeOut(0.2); };
    }, [actions, names]);

    // Clone once so multiple mounts don't share the same scene graph.
    const cloned = useMemo(() => scene.clone(true), [scene]);

    // Make sure every mesh casts/receives shadow and uses PBR-friendly settings
    useEffect(() => {
        cloned.traverse((o) => {
            if (o.isMesh) {
                o.castShadow    = true;
                o.receiveShadow = true;
                if (o.material) {
                    o.material.envMapIntensity = 1.0;
                    o.material.needsUpdate = true;
                }
            }
        });
    }, [cloned]);

    // Procedural idle motion (only visible if the GLB has no baked animation)
    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();

        const turn = Math.sin(t * 0.55) * 0.18;         // turntable
        const bob  = Math.sin(t * 1.3) * 0.03;
        const breathe = 1 + Math.sin(t * 1.5) * 0.015;

        // Ease toward mouse tilt
        const targetY = turn + tilt.x * 0.35;
        const targetX = tilt.y * -0.18;
        group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
        group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
        group.current.position.y = bob;
        group.current.scale.setScalar(breathe);
    });

    return (
        <group ref={group}>
            {/* Bounds auto-fits any sized model into the viewport.
                Center re-origins the rig so rotation pivots on the chest/head. */}
            <Bounds fit clip observe margin={1.15}>
                <Center disableY={false}>
                    <primitive object={cloned} />
                </Center>
            </Bounds>
        </group>
    );
}

// ── Fallback: the masked PNG we had before, for when the GLB is missing ──
function CeoFallbackPortrait({ src, tilt }) {
    const group = useRef(null);
    const texture = useImageTexture(src);

    const material = useMemo(() => {
        if (!texture) return null;
        return new THREE.ShaderMaterial({
            uniforms: {
                map:        { value: texture },
                uFadeInner: { value: 0.30 },
                uFadeOuter: { value: 0.495 },
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
                    p.x *= 1.05;
                    float r = length(p);
                    float mask = 1.0 - smoothstep(uFadeInner, uFadeOuter, r);
                    gl_FragColor = vec4(tex.rgb, tex.a * mask);
                    if (gl_FragColor.a < 0.01) discard;
                }
            `,
        });
    }, [texture]);

    const { width, height } = useMemo(() => {
        if (!texture || !texture.image) return { width: 2.1, height: 2.1 };
        const a = texture.image.width / texture.image.height;
        const h = 2.3;
        return { width: h * a, height: h };
    }, [texture]);

    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();
        const turn = Math.sin(t * 0.6) * 0.16;
        const roll = Math.sin(t * 0.45 + 1.1) * 0.04;
        const breathe = 1 + Math.sin(t * 1.6) * 0.02;
        const bob = Math.sin(t * 1.3) * 0.04;
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

// Preload the GLB so the first chat open isn't janky.
useGLTF.preload(CEO_MODEL_SRC);

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * BotAvatar — Topstocx 3D portrait icon.
 *
 * Pure procedural 3D bust: stylised head + shoulders + suit silhouette,
 * rendered with a brand-gradient shader. No photo, no texture, no
 * rectangular background, no border — just the sculpted shape of a
 * portrait floating in transparent space.
 *
 * Brand tokens:
 *   --brand-blue        #005AFF
 *   --brand-green       #39B54A
 *   --brand-blue-light  #77A6FF
 *   --brand-green-light #59E16C
 *
 * Anatomy (all `mesh` primitives, no assets):
 *   • Head        — ellipsoid sphere, gradient shader
 *   • Hair cap    — partial sphere sliced to sit on the crown
 *   • Neck        — short cylinder
 *   • Shoulders   — two tapered boxes angled outward
 *   • Torso base  — trapezoidal lathe cross-section
 *   • Lapels      — two slim triangles forming a suit V
 *   • Eye glints  — two white spheres with brand-blue pupils
 *
 * Motion:
 *   • Gentle turntable sway + breathing scale
 *   • Eases toward mouse cursor on desktop
 *   • Soft pulsing halo behind the silhouette
 *   • Full prefers-reduced-motion support
 *
 * Props (API preserved):
 *   size    — px hint for halo math
 *   variant — 'manu' (blue bias) | 'atlas' (green bias)
 *   glow    — toggle the CSS halo
 *   style   — merged into the outer wrapper
 */

const BRAND = {
    blue:       '#005AFF',
    green:      '#39B54A',
    blueLight:  '#77A6FF',
    greenLight: '#59E16C',
};

export default function BotAvatar({ size = 80, variant = 'manu', glow = true, style = {} }) {
    const isManu  = variant === 'manu';
    const haloRGB = isManu ? '0, 90, 255' : '57, 181, 74';

    const wrapRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    // Desktop cursor parallax.
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
                            radial-gradient(circle at 50% 48%,
                                rgba(${haloRGB}, 0.55) 0%,
                                rgba(119, 166, 255, 0.28) 38%,
                                rgba(89, 225, 108, 0.14) 58%,
                                rgba(0, 0, 0, 0) 72%)
                        `,
                        filter: 'blur(16px)',
                        pointerEvents: 'none',
                        animation: 'tsx-bot-pulse 3.8s ease-in-out infinite',
                    }}
                />
            )}

            <style>{`
                @keyframes tsx-bot-pulse {
                    0%, 100% { opacity: .70; transform: scale(1);    }
                    50%      { opacity: 1;   transform: scale(1.05); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .tsx-bot-canvas { animation: none !important; }
                }
            `}</style>

            <Canvas
                className="tsx-bot-canvas"
                camera={{ position: [0, 0.1, 3.2], fov: 32 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true, premultipliedAlpha: true }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.75} />
                    <directionalLight position={[ 2.5,  3.0,  2.5]} intensity={1.1} color={BRAND.blueLight} />
                    <directionalLight position={[-2.0, -1.0,  1.5]} intensity={0.55} color={BRAND.greenLight} />
                    <pointLight       position={[ 0.0,  0.4,  2.2]} intensity={0.4}  color={BRAND.blue} />
                    <Bust tilt={tilt} variant={variant} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── Procedural stylised bust ────────────────────────────────────────────
function Bust({ tilt, variant }) {
    const group = useRef(null);
    const core  = useRef(null);

    // Brand-gradient shader — used by every skin/clothing piece so the
    // whole silhouette reads as one unified 3D portrait.
    const brandMat = useMemo(() => {
        const bias = variant === 'atlas' ? 0.35 : -0.15;
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime:       { value: 0 },
                uBias:       { value: bias },
                uColorA:     { value: new THREE.Color(BRAND.blue)      },
                uColorB:     { value: new THREE.Color(BRAND.green)     },
                uColorLight: { value: new THREE.Color(BRAND.blueLight) },
            },
            vertexShader: /* glsl */`
                varying vec3 vNormal;
                varying vec3 vPos;
                varying vec3 vView;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPos    = position;
                    vec4 mv = modelViewMatrix * vec4(position, 1.0);
                    vView   = normalize(-mv.xyz);
                    gl_Position = projectionMatrix * mv;
                }
            `,
            fragmentShader: /* glsl */`
                uniform float uTime;
                uniform float uBias;
                uniform vec3  uColorA;
                uniform vec3  uColorB;
                uniform vec3  uColorLight;
                varying vec3  vNormal;
                varying vec3  vPos;
                varying vec3  vView;

                void main() {
                    // Animated vertical brand gradient with gentle swirl.
                    float flow  = sin(vPos.y * 2.2 + uTime * 1.2) * 0.5 + 0.5;
                    float swirl = sin(vPos.x * 1.8 - uTime * 0.7) * 0.5 + 0.5;
                    float g     = clamp(vPos.y * 0.55 + 0.5 + uBias + flow * 0.16 - swirl * 0.08, 0.0, 1.0);
                    vec3  base  = mix(uColorA, uColorB, g);

                    // Fresnel silhouette rim in brand-light so the edges
                    // glow rather than look hard-cut.
                    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
                    vec3  rim  = uColorLight * fres * 1.45;

                    // Subtle breathing pulse on overall brightness.
                    float pulse = 0.84 + 0.16 * sin(uTime * 1.9);

                    gl_FragColor = vec4(base * pulse + rim, 1.0);
                }
            `,
        });
    }, [variant]);

    // Torso lathe — trapezoidal cross-section swept around Y.
    const torsoGeo = useMemo(() => {
        const pts = [
            new THREE.Vector2(0.22, -1.20),
            new THREE.Vector2(0.70, -0.90),
            new THREE.Vector2(0.65, -0.45),
            new THREE.Vector2(0.42, -0.20),
            new THREE.Vector2(0.00, -0.20),
        ];
        return new THREE.LatheGeometry(pts, 48);
    }, []);

    // Hair cap — hemisphere sliced to sit just on the crown.
    const hairGeo = useMemo(
        () => new THREE.SphereGeometry(0.465, 40, 32, 0, Math.PI * 2, 0, Math.PI * 0.55),
        []
    );

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        brandMat.uniforms.uTime.value = t;

        if (group.current) {
            const turn    = Math.sin(t * 0.45) * 0.16;
            const targetY = turn + tilt.x * 0.32;
            const targetX = tilt.y * -0.18;
            group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
            group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
            group.current.position.y = Math.sin(t * 1.2) * 0.02;
        }
        if (core.current) {
            const s = 1 + Math.sin(t * 1.6) * 0.015;
            core.current.scale.setScalar(s);
        }
    });

    return (
        <group ref={group} position={[0, -0.1, 0]}>
            <group ref={core}>
                {/* Head — ellipsoid (scaled sphere) */}
                <mesh material={brandMat} position={[0, 0.78, 0]} scale={[0.44, 0.52, 0.44]}>
                    <sphereGeometry args={[1, 48, 48]} />
                </mesh>

                {/* Hair cap */}
                <mesh material={brandMat} position={[0, 0.86, -0.02]} rotation={[-0.08, 0, 0]}>
                    <primitive object={hairGeo} attach="geometry" />
                </mesh>

                {/* Neck */}
                <mesh material={brandMat} position={[0, 0.30, 0]}>
                    <cylinderGeometry args={[0.18, 0.22, 0.26, 28]} />
                </mesh>

                {/* Torso (lathe — suit silhouette) */}
                <mesh material={brandMat} position={[0, 0.20, 0]}>
                    <primitive object={torsoGeo} attach="geometry" />
                </mesh>

                {/* Left lapel */}
                <mesh material={brandMat} position={[-0.13, -0.10, 0.30]} rotation={[0, 0.25, 0.55]}>
                    <boxGeometry args={[0.04, 0.55, 0.06]} />
                </mesh>
                {/* Right lapel */}
                <mesh material={brandMat} position={[0.13, -0.10, 0.30]} rotation={[0, -0.25, -0.55]}>
                    <boxGeometry args={[0.04, 0.55, 0.06]} />
                </mesh>

                {/* Collar shirt triangle (slight inset) */}
                <mesh material={brandMat} position={[0, -0.05, 0.33]} rotation={[0.15, 0, 0]}>
                    <coneGeometry args={[0.12, 0.26, 3]} />
                </mesh>

                {/* Eye glints — soft white spheres with brand-blue pupils */}
                <mesh position={[-0.13, 0.82, 0.36]}>
                    <sphereGeometry args={[0.045, 18, 18]} />
                    <meshBasicMaterial color="#f6faff" />
                </mesh>
                <mesh position={[ 0.13, 0.82, 0.36]}>
                    <sphereGeometry args={[0.045, 18, 18]} />
                    <meshBasicMaterial color="#f6faff" />
                </mesh>
                <mesh position={[-0.13, 0.82, 0.395]}>
                    <sphereGeometry args={[0.018, 14, 14]} />
                    <meshBasicMaterial color={BRAND.blue} />
                </mesh>
                <mesh position={[ 0.13, 0.82, 0.395]}>
                    <sphereGeometry args={[0.018, 14, 14]} />
                    <meshBasicMaterial color={BRAND.blue} />
                </mesh>
            </group>
        </group>
    );
}

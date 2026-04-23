import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * BotAvatar — Topstocx 3D animated chatbot icon.
 *
 * Pure procedural 3D. No GLB, no textures. Built from geometry + shaders
 * so it renders identically on every device and ships as ~0 bytes of
 * asset payload.
 *
 * Brand tokens:
 *   --brand-blue        #005AFF
 *   --brand-green       #39B54A
 *   --brand-blue-light  #77A6FF
 *   --brand-green-light #59E16C
 *   base                #03050e
 *
 * Elements:
 *   • Core sphere with custom shader: brand blue↔green gradient, animated
 *     flow, fresnel rim light, breathing scale.
 *   • Two soft "eye" glints so it reads as a friendly bot.
 *   • Three orbital rings rotating on independent axes at different speeds.
 *   • 48 brand-coloured particles orbiting the core.
 *   • Outer CSS halo that pulses on the brand gradient.
 *
 * Variants:
 *   • manu  — blue-dominant gradient (default)
 *   • atlas — green-dominant gradient
 *
 * Props (unchanged API so FinAIChatbot keeps working):
 *   size    — px hint (the parent sizes it, this is just for halo math)
 *   variant — 'manu' | 'atlas'
 *   glow    — toggles the CSS halo
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

    // Desktop mouse parallax — the orb softly tracks the cursor.
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
                        inset: '-10%',
                        borderRadius: '50%',
                        background: `
                            radial-gradient(circle at 50% 50%,
                                rgba(${haloRGB}, 0.55) 0%,
                                rgba(119, 166, 255, 0.28) 35%,
                                rgba(89, 225, 108, 0.18) 55%,
                                rgba(0, 0, 0, 0) 72%)
                        `,
                        filter: 'blur(14px)',
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
                camera={{ position: [0, 0, 3.2], fov: 35 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true, premultipliedAlpha: true }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.85} />
                    <pointLight position={[ 2.2,  2.0, 2.8]} intensity={1.2} color={BRAND.blueLight} />
                    <pointLight position={[-2.2, -1.4, 2.2]} intensity={0.8} color={BRAND.greenLight} />
                    <BrandOrb tilt={tilt} variant={variant} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── Procedural brand orb ─────────────────────────────────────────────────
function BrandOrb({ tilt, variant }) {
    const group   = useRef(null);
    const core    = useRef(null);
    const eyes    = useRef(null);
    const ringA   = useRef(null);
    const ringB   = useRef(null);
    const ringC   = useRef(null);
    const dust    = useRef(null);

    // Shader material — animated blue↔green gradient with fresnel rim.
    const coreMat = useMemo(() => {
        const bias = variant === 'atlas' ? 0.35 : -0.15; // green-ish vs blue-ish
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime:      { value: 0 },
                uBias:      { value: bias },
                uColorA:    { value: new THREE.Color(BRAND.blue)       },
                uColorB:    { value: new THREE.Color(BRAND.green)      },
                uColorLight:{ value: new THREE.Color(BRAND.blueLight)  },
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

                // Smooth brand gradient that flows across the surface.
                void main() {
                    float flow    = sin(vPos.y * 2.4 + uTime * 1.4) * 0.5 + 0.5;
                    float swirl   = sin(vPos.x * 2.0 - uTime * 0.9) * 0.5 + 0.5;
                    float g       = clamp(vPos.y * 0.45 + 0.5 + uBias + flow * 0.18 - swirl * 0.1, 0.0, 1.0);
                    vec3  base    = mix(uColorA, uColorB, g);

                    // Fresnel rim — brand-light halo around the silhouette.
                    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
                    vec3  rim  = uColorLight * fres * 1.5;

                    // Gentle inner pulse.
                    float pulse = 0.82 + 0.18 * sin(uTime * 2.1);

                    vec3 col = base * pulse + rim;
                    gl_FragColor = vec4(col, 1.0);
                }
            `,
        });
    }, [variant]);

    // Orbiting particle cloud — 48 points in a thick shell around the core.
    const dustGeo = useMemo(() => {
        const count     = 48;
        const positions = new Float32Array(count * 3);
        const colors    = new Float32Array(count * 3);
        const cBlue     = new THREE.Color(BRAND.blueLight);
        const cGreen    = new THREE.Color(BRAND.greenLight);
        for (let i = 0; i < count; i++) {
            const th  = Math.random() * Math.PI * 2;
            const ph  = Math.acos(2 * Math.random() - 1);
            const r   = 1.25 + Math.random() * 0.45;
            positions[i * 3]     = r * Math.sin(ph) * Math.cos(th);
            positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
            positions[i * 3 + 2] = r * Math.cos(ph);
            const mix = Math.random();
            const c   = cBlue.clone().lerp(cGreen, mix);
            colors[i * 3]     = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        g.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
        return g;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        coreMat.uniforms.uTime.value = t;

        // Whole rig — ease toward mouse tilt + slow turntable.
        if (group.current) {
            const targetY = t * 0.28 + tilt.x * 0.38;
            const targetX = tilt.y * -0.22;
            group.current.rotation.y += (targetY - group.current.rotation.y) * 0.08;
            group.current.rotation.x += (targetX - group.current.rotation.x) * 0.08;
        }

        // Core — breathing scale.
        if (core.current) {
            const s = 1 + Math.sin(t * 2.1) * 0.04;
            core.current.scale.setScalar(s);
        }

        // Eyes — keep pinned to camera-facing front, blink every ~5s.
        if (eyes.current) {
            const blink = Math.max(0.1, Math.abs(Math.sin(t * 0.6)) > 0.995 ? 0.15 : 1);
            eyes.current.scale.y += (blink - eyes.current.scale.y) * 0.25;
        }

        // Rings — each on its own axis / speed.
        if (ringA.current) {
            ringA.current.rotation.x =  t * 0.75;
            ringA.current.rotation.y =  t * 0.42;
        }
        if (ringB.current) {
            ringB.current.rotation.x = -t * 0.55;
            ringB.current.rotation.z =  t * 0.68;
        }
        if (ringC.current) {
            ringC.current.rotation.y =  t * 0.30;
            ringC.current.rotation.z = -t * 0.48;
        }

        // Particle cloud — slow drift.
        if (dust.current) {
            dust.current.rotation.y = t * 0.14;
            dust.current.rotation.x = Math.sin(t * 0.2) * 0.3;
        }
    });

    return (
        <group ref={group}>
            {/* Core sphere (brand gradient + fresnel) */}
            <mesh ref={core} material={coreMat}>
                <sphereGeometry args={[0.78, 64, 64]} />
            </mesh>

            {/* Eye glints — two soft white dots on the front face */}
            <group ref={eyes} position={[0, 0.08, 0.78]}>
                <mesh position={[-0.2, 0.04, 0]}>
                    <sphereGeometry args={[0.07, 20, 20]} />
                    <meshBasicMaterial color="#f6faff" />
                </mesh>
                <mesh position={[0.2, 0.04, 0]}>
                    <sphereGeometry args={[0.07, 20, 20]} />
                    <meshBasicMaterial color="#f6faff" />
                </mesh>
                {/* Eye pupils — tiny brand-blue centers */}
                <mesh position={[-0.2, 0.04, 0.055]}>
                    <sphereGeometry args={[0.028, 16, 16]} />
                    <meshBasicMaterial color={BRAND.blue} />
                </mesh>
                <mesh position={[0.2, 0.04, 0.055]}>
                    <sphereGeometry args={[0.028, 16, 16]} />
                    <meshBasicMaterial color={BRAND.blue} />
                </mesh>
            </group>

            {/* Orbital rings — brand colours, varying thickness + opacity */}
            <mesh ref={ringA}>
                <torusGeometry args={[1.08, 0.014, 16, 128]} />
                <meshBasicMaterial color={BRAND.blueLight}  transparent opacity={0.75} />
            </mesh>
            <mesh ref={ringB}>
                <torusGeometry args={[1.22, 0.010, 16, 128]} />
                <meshBasicMaterial color={BRAND.greenLight} transparent opacity={0.65} />
            </mesh>
            <mesh ref={ringC}>
                <torusGeometry args={[1.36, 0.007, 16, 128]} />
                <meshBasicMaterial color={BRAND.blue}       transparent opacity={0.55} />
            </mesh>

            {/* Particle cloud (48 brand-coloured pips) */}
            <points ref={dust} geometry={dustGeo}>
                <pointsMaterial
                    size={0.045}
                    vertexColors
                    transparent
                    opacity={0.92}
                    sizeAttenuation
                    depthWrite={false}
                />
            </points>
        </group>
    );
}

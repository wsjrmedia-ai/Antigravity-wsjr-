import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';

// ─── Coordinate conversion ───────────────────────────────────────────────────
function latLonToVec3(lat, lon, radius = 1.52) {
    const phi   = (90 - lat)  * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
         radius * Math.cos(phi),
         radius * Math.sin(phi) * Math.sin(theta)
    );
}

// ─── Market nodes — all WHITE dots ───────────────────────────────────────────
const MARKET_NODES = [
    { name: 'New York',   lat: 40.7,  lon: -74.0,  color: '#ffffff', arcColor: '#005AFF', size: 0.044, vol: '$24.1T', region: 'Americas' },
    { name: 'London',     lat: 51.5,  lon: -0.1,   color: '#ffffff', arcColor: '#089981', size: 0.040, vol: '$18.3T', region: 'Europe'   },
    { name: 'Tokyo',      lat: 35.7,  lon: 139.7,  color: '#ffffff', arcColor: '#39B54A', size: 0.038, vol: '$6.1T',  region: 'Asia'     },
    { name: 'Shanghai',   lat: 31.2,  lon: 121.5,  color: '#ffffff', arcColor: '#f23645', size: 0.036, vol: '$8.7T',  region: 'Asia'     },
    { name: 'Hong Kong',  lat: 22.3,  lon: 114.2,  color: '#ffffff', arcColor: '#005AFF', size: 0.034, vol: '$4.2T',  region: 'Asia'     },
    { name: 'Singapore',  lat: 1.3,   lon: 103.8,  color: '#ffffff', arcColor: '#089981', size: 0.030, vol: '$3.8T',  region: 'SE Asia'  },
    { name: 'Dubai',      lat: 25.2,  lon: 55.3,   color: '#ffffff', arcColor: '#39B54A', size: 0.032, vol: '$2.4T',  region: 'MENA'     },
    { name: 'Sydney',     lat: -33.9, lon: 151.2,  color: '#ffffff', arcColor: '#005AFF', size: 0.028, vol: '$1.9T',  region: 'Oceania'  },
    { name: 'Frankfurt',  lat: 50.1,  lon: 8.7,    color: '#ffffff', arcColor: '#f23645', size: 0.030, vol: '$2.1T',  region: 'Europe'   },
    { name: 'São Paulo',  lat: -23.5, lon: -46.6,  color: '#ffffff', arcColor: '#089981', size: 0.026, vol: '$1.2T',  region: 'Americas' },
    { name: 'Mumbai',     lat: 19.1,  lon: 72.9,   color: '#ffffff', arcColor: '#39B54A', size: 0.028, vol: '$1.8T',  region: 'Asia'     },
    { name: 'Toronto',    lat: 43.7,  lon: -79.4,  color: '#ffffff', arcColor: '#005AFF', size: 0.026, vol: '$1.1T',  region: 'Americas' },
    { name: 'Seoul',      lat: 37.6,  lon: 126.9,  color: '#ffffff', arcColor: '#f23645', size: 0.026, vol: '$1.5T',  region: 'Asia'     },
    { name: 'Riyadh',     lat: 24.7,  lon: 46.7,   color: '#ffffff', arcColor: '#39B54A', size: 0.026, vol: '$0.9T',  region: 'MENA'     },
    { name: 'Zürich',     lat: 47.4,  lon: 8.5,    color: '#ffffff', arcColor: '#089981', size: 0.024, vol: '$0.8T',  region: 'Europe'   },
];

const NODE_CONNECTIONS = [
    [0, 1], [0, 2], [0, 11], [1, 8],  [1, 14],
    [2, 3], [3, 4], [4, 5],  [5, 6],  [6, 3],
    [1, 6], [9, 0], [10, 5], [12, 2], [13, 6],
    [7, 4], [0, 9], [8, 14], [11, 9],
];

// ─── Animated arc with traveling bead ────────────────────────────────────────
function getArcPoints(posA, posB, segments = 56) {
    const arcHeight = 0.22 + posA.distanceTo(posB) * 0.10;
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const p = new THREE.Vector3().lerpVectors(posA, posB, t);
        const mA = posA.clone().normalize().multiplyScalar(posA.length() + arcHeight);
        const mB = posB.clone().normalize().multiplyScalar(posB.length() + arcHeight);
        const m  = new THREE.Vector3().lerpVectors(mA, mB, t);
        p.lerp(m, Math.sin(t * Math.PI) * 0.65);
        points.push(p.clone());
    }
    return points;
}

const ArcLine = ({ nodeA, nodeB, arcIndex }) => {
    const beadRef   = useRef();
    const trailRefs = useRef([]);
    const posA = useMemo(() => latLonToVec3(nodeA.lat, nodeA.lon), [nodeA]);
    const posB = useMemo(() => latLonToVec3(nodeB.lat, nodeB.lon), [nodeB]);
    const pts  = useMemo(() => getArcPoints(posA, posB), [posA, posB]);
    const arcColor = nodeA.arcColor;
    const TRAIL = 5;
    const offset = (arcIndex * 0.37) % 1;

    useFrame(({ clock }) => {
        const t   = ((clock.getElapsedTime() * 0.16 + offset) % 1);
        const idx = Math.floor(t * (pts.length - 1));
        const frac = (t * (pts.length - 1)) - idx;
        const cur = pts[Math.min(idx, pts.length - 1)];
        const nxt = pts[Math.min(idx + 1, pts.length - 1)];
        if (beadRef.current) beadRef.current.position.lerpVectors(cur, nxt, frac);
        trailRefs.current.forEach((m, ti) => {
            if (!m) return;
            const tB = ((t - (ti + 1) * 0.016 + 1) % 1);
            const iB = Math.floor(tB * (pts.length - 1));
            const fB = (tB * (pts.length - 1)) - iB;
            const pA = pts[Math.min(iB,     pts.length - 1)];
            const pN = pts[Math.min(iB + 1, pts.length - 1)];
            m.position.lerpVectors(pA, pN, fB);
            m.material.opacity = (1 - ti / TRAIL) * 0.5;
        });
    });

    return (
        <group>
            <Line points={pts} color={arcColor} lineWidth={0.5} transparent opacity={0.22} />
            <mesh ref={beadRef}>
                <sphereGeometry args={[0.013, 8, 8]} />
                <meshBasicMaterial color={arcColor} />
            </mesh>
            {Array.from({ length: TRAIL }).map((_, ti) => (
                <mesh key={ti} ref={el => trailRefs.current[ti] = el}>
                    <sphereGeometry args={[0.009 * (1 - ti / TRAIL), 6, 6]} />
                    <meshBasicMaterial color={arcColor} transparent opacity={0.4} />
                </mesh>
            ))}
        </group>
    );
};

// ─── Market node — white core, white glow ────────────────────────────────────
const MarketNode = ({ node, onHover, hovered }) => {
    const coreRef  = useRef();
    const pos  = useMemo(() => latLonToVec3(node.lat, node.lon), [node]);

    useFrame(() => {
        if (coreRef.current) {
            coreRef.current.scale.setScalar(hovered ? 1.7 : 1.0);
        }
    });

    return (
        <group position={pos} onPointerEnter={() => onHover(node)} onPointerLeave={() => onHover(null)}>
            {/* White core — static, no blink */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[node.size, 12, 12]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Fixed soft glow halo */}
            <mesh>
                <sphereGeometry args={[node.size * 2.6, 10, 10]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
            </mesh>

            {hovered && (
                <Html position={[0, node.size * 8, 0]} center style={{ pointerEvents: 'none' }} distanceFactor={4}>
                    <div style={{
                        background: 'rgba(5,10,25,0.92)',
                        border: `1px solid ${node.arcColor}90`,
                        borderRadius: '10px',
                        padding: '8px 14px',
                        whiteSpace: 'nowrap',
                        backdropFilter: 'blur(12px)',
                        boxShadow: `0 0 24px ${node.arcColor}50`,
                    }}>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: '13px', marginBottom: '4px' }}>{node.name}</div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '11px' }}>
                            <span style={{ color: '#868993' }}>Vol</span>
                            <span style={{ color: '#fff', fontWeight: 700 }}>{node.vol}</span>
                            <span style={{ padding: '1px 7px', borderRadius: '4px', background: node.arcColor + '30', color: node.arcColor, fontWeight: 700, fontSize: '10px' }}>{node.region}</span>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
};

// ─── Earth with real textures ─────────────────────────────────────────────────
const EarthMesh = () => {
    const earthRef  = useRef();
    const cloudsRef = useRef();

    const [
        earthMap,
        earthBump,
        earthSpec,
        cloudsMap,
    ] = useLoader(TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
    ]);

    useFrame(({ clock }) => {
        // clouds drift slightly faster than planet
        if (cloudsRef.current) cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.004;
    });

    return (
        <>
            {/* Main Earth */}
            <mesh ref={earthRef}>
                <sphereGeometry args={[1.5, 72, 72]} />
                <meshStandardMaterial
                    map={earthMap}
                    normalMap={earthBump}
                    normalScale={new THREE.Vector2(2, 2)}
                    roughnessMap={earthSpec}
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>

            {/* Cloud layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[1.515, 64, 64]} />
                <meshStandardMaterial
                    alphaMap={cloudsMap}
                    transparent
                    opacity={0.38}
                    color="#ffffff"
                    depthWrite={false}
                />
            </mesh>
        </>
    );
};

// ─── Atmosphere layers ────────────────────────────────────────────────────────
const Atmosphere = () => (
    <>
        <mesh>
            <sphereGeometry args={[1.56, 40, 40]} />
            <meshBasicMaterial color="#1a5090" transparent opacity={0.10} side={THREE.BackSide} />
        </mesh>
        <mesh>
            <sphereGeometry args={[1.65, 40, 40]} />
            <meshBasicMaterial color="#0d3060" transparent opacity={0.055} side={THREE.BackSide} />
        </mesh>
        <mesh>
            <sphereGeometry args={[1.78, 32, 32]} />
            <meshBasicMaterial color="#071840" transparent opacity={0.025} side={THREE.BackSide} />
        </mesh>
    </>
);

// ─── Equatorial ring ─────────────────────────────────────────────────────────
const EquatorialRing = () => {
    const r = useRef();
    useFrame(({ clock }) => {
        if (r.current) r.current.material.opacity = 0.14 + Math.sin(clock.getElapsedTime() * 0.6) * 0.05;
    });
    return (
        <mesh ref={r} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.63, 1.645, 120]} />
            <meshBasicMaterial color="#005AFF" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
    );
};

// ─── Full globe scene ─────────────────────────────────────────────────────────
const GlobeScene = ({ onHover, hoveredNode }) => {
    const groupRef = useRef();

    useFrame(({ clock }) => {
        if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.18;
    });

    return (
        <group ref={groupRef}>
            <EarthMesh />
            <Atmosphere />
            <EquatorialRing />

            {/* Arcs */}
            {NODE_CONNECTIONS.map(([a, b], i) => (
                <ArcLine key={i} nodeA={MARKET_NODES[a]} nodeB={MARKET_NODES[b]} arcIndex={i} />
            ))}

            {/* White market nodes */}
            {MARKET_NODES.map((node, i) => (
                <MarketNode key={i} node={node} onHover={onHover} hovered={hoveredNode?.name === node.name} />
            ))}
        </group>
    );
};

// ─── Export ───────────────────────────────────────────────────────────────────
const Globe3D = () => {
    const [hoveredNode, setHoveredNode] = useState(null);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', cursor: hoveredNode ? 'pointer' : 'default' }}>
            {/* Outer space background glow */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(10,20,60,0.3) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />

            <Canvas
                camera={{ position: [0, 0.5, 4.0], fov: 44 }}
                style={{ background: 'transparent', position: 'relative', zIndex: 1 }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            >
                {/* Lighting to match real Earth look */}
                <ambientLight intensity={0.18} />
                {/* Sun-side directional light */}
                <directionalLight position={[5, 2, 3]} intensity={2.2} color="#fff9f0" />
                {/* Soft blue fill — space reflection */}
                <pointLight position={[-6, -2, -4]} intensity={0.5} color="#1040a0" />
                {/* Atmosphere tint */}
                <pointLight position={[0, 4, 2]} intensity={0.3} color="#4080ff" />

                <Suspense fallback={
                    <mesh>
                        <sphereGeometry args={[1.5, 32, 32]} />
                        <meshBasicMaterial color="#03080f" />
                    </mesh>
                }>
                    <GlobeScene onHover={setHoveredNode} hoveredNode={hoveredNode} />
                </Suspense>
            </Canvas>

            {/* Bottom legend */}
            <div style={{
                position: 'absolute', bottom: 16, left: 16,
                display: 'flex', gap: '10px', flexWrap: 'wrap',
                zIndex: 2, pointerEvents: 'none',
            }}>
                {[
                    { label: 'Americas', color: '#005AFF' },
                    { label: 'Europe',   color: '#089981' },
                    { label: 'Asia',     color: '#39B54A' },
                    { label: 'MENA',     color: '#f23645' },
                ].map(r => (
                    <div key={r.label} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(3,6,18,0.75)', backdropFilter: 'blur(8px)',
                        border: `1px solid ${r.color}50`,
                        borderRadius: '100px', padding: '3px 10px',
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: r.color, boxShadow: `0 0 6px ${r.color}` }} />
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#d1d4dc', letterSpacing: '0.05em' }}>{r.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Globe3D;

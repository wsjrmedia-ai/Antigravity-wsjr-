import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  useTexture 
} from '@react-three/drei';
import * as THREE from 'three';

// ── CLEAN SHADER MATERIAL ─────────────────────────────────────────────────────
// Only handles transparency logic (Chroma Key) to keep the bill 100% clean.
// Removed: Rim light, Grain, Vignette, Chromatic Aberration as requested.
const BillMaterial = ({ texture, opacity = 1 }) => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uOpacity.value = opacity;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uTexture: { value: texture },
    uOpacity: { value: opacity }
  }), [texture, opacity]);

  return (
    <shaderMaterial
      ref={materialRef}
      transparent
      uniforms={uniforms}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(uTexture, vUv);
          
          // ── CHROMA KEY / BACKGROUND DISCARD ── (KEEP)
          bool isBlack = tex.r < 0.02 && tex.g < 0.02 && tex.b < 0.02;
          if (tex.a < 0.1 || isBlack) discard;

          // Pure texture only - absolutely no post-effects or overlays
          tex.a *= uOpacity;
          gl_FragColor = tex;
        }
      `}
    />
  );
};

const BillMesh = ({ textureUrl = '/bill.png', scale = 1 }) => {
  const texture = useTexture(textureUrl);
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.05;
    meshRef.current.rotation.y = Math.cos(t * 0.3) * 0.08;
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.05;
  });

  return (
    <group scale={scale}>
      <mesh ref={meshRef}>
        <planeGeometry args={[18, 12, 64, 64]} />
        <BillMaterial texture={texture} />
      </mesh>
    </group>
  );
};

export default function Bill3DModel({ 
  textureUrl = '/bill.png', 
  opacity = 1 
}) {
  return (
    <div style={{ width: '100%', height: '100%', pointerEvents: 'none', opacity }}>
      <Canvas dpr={[1, 2]} alpha gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 11]} fov={45} />
        
        {/* Simple clean studio lighting */}
        <ambientLight intensity={3.5} />
        <pointLight position={[10, 10, 10]} intensity={2.5} />
        <spotLight position={[-10, 10, 10]} angle={0.25} penumbra={1} intensity={3.5} />
        
        <Float 
          speed={1.4} 
          rotationIntensity={0.4} 
          floatIntensity={0.6}
          floatingRange={[-0.1, 0.1]}
        >
          <BillMesh textureUrl={textureUrl} />
        </Float>
      </Canvas>
    </div>
  );
}

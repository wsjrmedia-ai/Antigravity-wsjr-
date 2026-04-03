import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, Float, Center } from '@react-three/drei';
import { useScroll, useTransform } from 'framer-motion';
import { motion } from 'framer-motion-3d';
import { Suspense, useEffect, useState } from 'react';

function LogoModel({ scrollYProgress }) {
  // Loading the massive file gracefully
  const { scene } = useGLTF('/LOGO.FRAME (1) - Copy.compressed.glb');

  // Map Scroll Y Progress to 3D Physical Space
  // Path: Right Side (Hero) -> Center (Overview) -> Right Side (Schools)
  // Since the page is very tall, sections 1, 2, and 3 happen between 0 and 0.25 of total scroll
  
  const posX = useTransform(scrollYProgress, 
    [0, 0.04, 0.12, 0.18, 0.26, 0.35], 
    [3.5, 3.5, 0, 0, 3.8, 3.8] // Right -> Center -> Right
  );

  // Y Position Float drift
  const posY = useTransform(scrollYProgress, 
    [0, 0.04, 0.12, 0.18, 0.26, 0.35], 
    [0.2, 0.2, -1.0, -1.0, -0.5, -0.5] 
  );

  // Spin elegantly while scrolling
  const rotY = useTransform(scrollYProgress, [0, 0.35], [0, Math.PI * 6]);
  // Subtle forward tilt 
  const rotX = useTransform(scrollYProgress, [0, 0.35], [0.1, -0.15]);

  // Scale down when in middle text sections to avoid crushing UI
  const scale = useTransform(scrollYProgress, 
    [0, 0.12, 0.26, 1], 
    [1.1, 0.85, 1.0, 1.0]
  );

  // Clone scene to avoid mutation warnings across remounts
  const clonedScene = scene.clone();

  return (
    <motion.group
      position-x={posX}
      position-y={posY}
      rotation-x={rotX}
      rotation-y={rotY}
      scale-x={scale}
      scale-y={scale}
      scale-z={scale}
    >
      {/* Adds constant subtle floating physics even when not scrolling */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center>
          <primitive object={clonedScene} />
        </Center>
      </Float>
    </motion.group>
  );
}

// Start downloading the massive 247MB file instantly upon module load
useGLTF.preload('/LOGO.FRAME (1) - Copy.compressed.glb');

export default function Home3DCanvas() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  // Ensures we only render the Canvas on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 50, // Floating high above section backgrounds (which are zIndex 10)
      pointerEvents: 'none' // Allows clicking elements through the massive transparent 3D canvas
    }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        
        {/* Luxury Lighting Setup */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 10]} intensity={2.5} color="#F7AC41" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#6A0715" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#FFF" />
        
        <Suspense fallback={null}>
          <LogoModel scrollYProgress={scrollYProgress} />
          {/* Preset 'city' gives beautiful metallic reflections perfect for gold materials */}
          <Environment preset="city" />
        </Suspense>
        
      </Canvas>
    </div>
  );
}

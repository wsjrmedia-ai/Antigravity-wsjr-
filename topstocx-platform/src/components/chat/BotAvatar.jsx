import { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * BotAvatar — 3D CEO character mascot.
 *
 * Renders the CEO's 3D avatar render as a transparent floating character
 * with nothing else around it: no coin, no rings, no backing disc, no
 * radial glow. Just the character, floating gently like a mascot.
 *
 * Keeps the same public API so FinAIChatbot doesn't need to change:
 *   - variant='manu'   -> slightly warmer fill light
 *   - variant='atlas'  -> slightly cooler fill light
 *
 * Drop the CEO 3D avatar (PNG with transparent background) at:
 *   /public/ceo/ceo_3d_avatar.png
 */
const CEO_AVATAR_SRC = '/ceo/ceo_3d_avatar.png';

export default function BotAvatar({ size = 80, variant = 'manu', glow = false, style = {} }) {
    const isManu   = variant === 'manu';
    const fillTint = isManu ? '#29B6E8' : '#59E16C';

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: 'transparent',
                ...style,
            }}
        >
            <Canvas
                camera={{ position: [0, 0, 3.1], fov: 36 }}
                dpr={[1, 2]}
                gl={{ alpha: true, antialias: true, premultipliedAlpha: true }}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.9} />
                    <directionalLight position={[2.5, 3, 2.5]} intensity={1.0} />
                    <directionalLight position={[-2, -1, 1.5]} intensity={0.3} color={fillTint} />

                    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.6}>
                        <CeoCharacter src={CEO_AVATAR_SRC} />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
}

// ── The character: just the alpha PNG floating, nothing else ─────────────
function CeoCharacter({ src }) {
    const texture = useImageTexture(src);

    if (!texture) return null;

    // Size the plane to the texture's actual aspect ratio so the avatar
    // never looks squished regardless of what crop you export.
    const img = texture.image;
    const aspect = img && img.width && img.height ? img.width / img.height : 1;
    const height = 2.1;
    const width  = height * aspect;

    return (
        <mesh>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
                map={texture}
                transparent
                alphaTest={0.02}
                roughness={0.55}
                metalness={0.05}
                toneMapped={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

// ── Texture hook with graceful error handling ────────────────────────────
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

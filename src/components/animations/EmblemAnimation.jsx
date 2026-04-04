import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const EmblemAnimation = ({ targetRef }) => {
    // We bind the scroll physics exactly to the boundaries of the first 3 sections
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"] // from top of hero, to bottom of schools
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // 0.00 = Hero Section (Right Edge)
    // 0.50 = Institutional Overview (Centered perfectly in viewport)
    // 1.00 = Schools Header (Right Edge)
    
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize(); // Init safely
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Physics Trajectory Paths mapped to screen progression
    // Standard identical string units ['vw', 'vw', 'vw'] ensures flawless 144fps Framer Motion interpolation!
    // On mobile, the bounding width is smaller and we push it to center (x: 10vw, etc) or even rely on its flex parent.
    const x = useTransform(smoothProgress, 
        [0, 0.5, 1], 
        isMobile ? ['20vw', '15vw', '20vw'] : ['65vw', '30vw', '55vw'] 
    );

    const y = useTransform(smoothProgress, 
        [0, 0.5, 1], 
        isMobile ? ['2vh', '5vh', '10vh'] : ['15vh', '15vh', '20vh'] // Floating down slightly at the end
    );

    // Dynamic scale to make it feel cinematic
    const scale = useTransform(smoothProgress, 
        [0, 0.5, 1], 
        isMobile ? [0.65, 0.8, 0.75] : [0.75, 1.0, 1.0] // Hero base -> massive in center -> maintained scale in schools
    );

    // Keep it fully visible throughout all blocks
    const opacity = useTransform(smoothProgress,
        [0, 0.5, 1],
        [1, 1, 1]
    );

    // -------------------------------------------------------------
    // Mouse Interactive 3D Parallax Tilt (Calculated Hover Piercing)
    // -------------------------------------------------------------
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const imageRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!imageRef.current) return;
            
            // Get the physical screen coordinates of the emblem
            const rect = imageRef.current.getBoundingClientRect();
            
            // Mathematical collision detection: Is the mouse physically overlapping the emblem?
            // This bypasses any Z-Index blocking issues from the text layers above it!
            const isHovering = 
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (isHovering) {
                // Calculate raw offset from the exact center of the emblem
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Normalize coordinates to a [-1, 1] range based on the emblem's actual bounds
                mouseX.set(x / (rect.width / 2));
                mouseY.set(y / (rect.height / 2));
            } else {
                // Gently release back to 0 when not hovering
                mouseX.set(0);
                mouseY.set(0);
            }
        };

        // Listen globally to capture movements even if DOM layers sit on top of the emblem
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Apply heavily damped springs to make the parallax silky smooth
    const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 30 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 150, damping: 30 });

    // Map the normalized cursor into actual 3D rotational degrees (e.g., ±25deg)
    const rotateX = useTransform(smoothMouseY, [-1, 1], [30, -30]); // Increased tilt depth slightly
    const rotateY = useTransform(smoothMouseX, [-1, 1], [-30, 30]);

    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            overflow: 'clip', // Prevents any overflow from the floating element
            pointerEvents: 'none',
            zIndex: 5 // Sandwiched base layer
        }}>
            {/* The Sticky Viewport context that tracks the screen as we scroll through the 3 blocks */}
            <div style={{
                position: 'sticky',
                top: 0,
                width: '100%',
                height: '100vh',
                pointerEvents: 'none',
                overflow: 'visible',
                perspective: '1200px' // Deep 3D perspective to map the rotation coordinates
            }}>
                <motion.div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0, // Reset to 0 to rely purely on x transforms
                    width: isMobile ? 'clamp(280px, 70vw, 400px)' : 'clamp(400px, 40vw, 800px)',
                    x,
                    y,
                    scale,
                    opacity,
                    pointerEvents: 'none',
                    transformStyle: 'preserve-3d' // Ensures the tilt propagates cleanly
                }}>
                    <motion.img 
                        ref={imageRef}
                        src="/jus.the.emblem.frame.red.whyte.highlights.png"
                        alt="WallStreet Jr Academy Premium Emblem Tracker"
                        animate={{ y: [0, -20, 0] }} // Gentle continuous floating
                        transition={{ 
                            duration: 5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        style={{
                            width: '100%',
                            display: 'block',
                            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
                            pointerEvents: 'none', // Handled mathematically now!
                            rotateX, // Attached Mouse-driven 3D tilt
                            rotateY  // Attached Mouse-driven 3D tilt
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default EmblemAnimation;

import { useEffect, useRef } from 'react';

/**
 * Interactive Sharp 3D Particle Mesh Background
 * Creates a wavy 3D mesh that responds to mouse movement.
 */
export default function Sharp3DWaveBackground() {
  const canvasRef = useRef(null);
  const targetMouse = useRef({ x: -1000, y: -1000 });
  const lerpMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w, h;
    let time = 0;
    
    // Mesh settings
    const rows = 45;
    const cols = 75;
    const spacing = 35;
    const dotSize = 1.3;
    const speed = 0.012;
    const heightScale = 110;
    
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      targetMouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += speed;

      // Smoothing: LERP (Linear Interpolation) to make mouse follow "butter smooth"
      const smoothingFactor = 0.08; 
      lerpMouse.current.x += (targetMouse.current.x - lerpMouse.current.x) * smoothingFactor;
      lerpMouse.current.y += (targetMouse.current.y - lerpMouse.current.y) * smoothingFactor;

      // Project 3D points to 2D
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // X, Y, Z coordinates in 3D space
          const x3d = (c - cols / 2) * spacing;
          const z3d = (r - rows / 2) * spacing;
          
          // Organic 3D wave function (Sharp Sine)
          let y3d = Math.sin(x3d * 0.005 + time) * heightScale +
                      Math.cos(z3d * 0.008 - time * 0.5) * (heightScale * 0.6);

          // Simple 3D projection to find initial 2D pos
          const basePerspective = 800 / (800 + z3d + 400);
          const x2d_trial = w / 2 + x3d * basePerspective;
          const y2d_trial = h / 2 + y3d * basePerspective;

          // Mouse Interaction: Calculate distance in 2D space (using lerped mouse)
          const dx = x2d_trial - lerpMouse.current.x;
          const dy = y2d_trial - lerpMouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 180;

          if (dist < influenceRadius) {
            // Push the wave up/down based on mouse proximity
            const force = (1 - dist / influenceRadius);
            y3d -= force * 80; // "Dip" effect
          }

          // Recalculate projection with mouse distortion
          const perspective = 800 / (800 + z3d + 400);
          const x2d = w / 2 + x3d * perspective;
          const y2d = h / 2 + y3d * perspective;

          // Only draw if within bounds
          if (x2d > 0 && x2d < w && y2d > 0 && y2d < h) {
             const alpha = perspective * 0.8;
             const size = dotSize * perspective;

             // Mouse Highlight Alpha
             const mouseAlpha = dist < influenceRadius ? (1 - dist/influenceRadius) * 0.5 : 0;

             ctx.beginPath();
             ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
             ctx.fillStyle = `rgba(41, 121, 255, ${Math.min(1, alpha + mouseAlpha)})`;
             ctx.fill();

             // Subtle connecting lines (Sharp)
             if (c < cols - 1) {
                // Approximate next neighbor for mesh look
                const nx3d = (c + 1 - cols / 2) * spacing;
                const ny3d_base = Math.sin(nx3d * 0.005 + time) * heightScale +
                                 Math.cos(z3d * 0.008 - time * 0.5) * (heightScale * 0.6);
                
                // Note: Simplified neighbor logic for performance
                const nPersp = 800 / (800 + z3d + 400);
                const nx2d_trial = w / 2 + nx3d * nPersp;
                const ny2d_trial = h / 2 + ny3d_base * nPersp;
                
                ctx.beginPath();
                ctx.moveTo(x2d, y2d);
                ctx.lineTo(nx2d_trial, ny2d_trial);
                ctx.strokeStyle = `rgba(41, 121, 255, ${alpha * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
             }
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 1,
        background: '#01040f'
      }}
    />
  );
}

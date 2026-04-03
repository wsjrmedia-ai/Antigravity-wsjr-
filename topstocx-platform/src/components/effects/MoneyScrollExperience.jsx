import { useRef, useEffect, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, PerspectiveCamera, Float } from '@react-three/drei';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function eio(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
function clamp01(v, lo, hi) { return Math.max(0, Math.min(1, (v - lo) / (hi - lo))); }

// ─────────────────────────────────────────────────────────────────────────────
// Procedural small-bill canvas ($5 / $20)
// ─────────────────────────────────────────────────────────────────────────────
function makeBillCanvas(denom) {
  const W = 600, H = 256;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  const bg   = denom === 5 ? '#3e6e4a' : '#4a7a55';
  const dark = denom === 5 ? '#1e3e28' : '#243e2a';
  const word = denom === 5 ? 'FIVE' : 'TWENTY';
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = denom === 5 ? '#4a7a55' : '#568060';
  ctx.fillRect(10, 10, W - 20, H - 20);
  ctx.strokeStyle = dark; ctx.lineWidth = 2.5;
  ctx.strokeRect(14, 14, W - 28, H - 28);
  ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.fillStyle = dark; ctx.font = 'bold 10px serif';
  ctx.fillText('FEDERAL RESERVE NOTE', 24, 36);
  ctx.textAlign = 'right'; ctx.font = 'bold 11px serif';
  ctx.fillText('THE UNITED STATES OF AMERICA', W - 24, 48);
  ctx.textAlign = 'left';
  ctx.font = 'bold 38px serif'; ctx.fillStyle = dark;
  ctx.fillText(`${denom}`, 26, 88);
  ctx.textAlign = 'right'; ctx.fillStyle = '#2a5038';
  ctx.fillText(`${denom}`, W - 26, H - 18);
  ctx.textAlign = 'left';
  ctx.strokeStyle = dark; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(200, 128, 68, 82, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(0,25,10,0.20)'; ctx.fill();
  ctx.fillStyle = dark; ctx.font = 'bold 50px serif';
  ctx.textAlign = 'center'; ctx.fillText(`$${denom}`, 200, 144); ctx.textAlign = 'left';
  ctx.beginPath(); ctx.arc(420, 128, 44, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(0,35,15,0.22)'; ctx.fill();
  ctx.fillStyle = dark; ctx.font = 'bold 16px serif';
  ctx.textAlign = 'center'; ctx.fillText(`${denom}`, 420, 134); ctx.textAlign = 'left';
  ctx.fillStyle = dark; ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center'; ctx.fillText(`${word} DOLLARS`, W / 2, H - 16); ctx.textAlign = 'left';
  ctx.strokeStyle = 'rgba(0,35,12,0.22)'; ctx.lineWidth = 0.5;
  for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(290 + i * 26, 24); ctx.lineTo(290 + i * 26, H - 24); ctx.stroke(); }
  return cv;
}

// ─────────────────────────────────────────────────────────────────────────────
// Procedural crack-pattern canvas
// ─────────────────────────────────────────────────────────────────────────────
function makeCrackCanvas() {
  const W = 600, H = 256;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  ctx.strokeStyle = 'rgba(255,255,190,0.95)';
  ctx.lineWidth = 1.6;
  ctx.shadowColor = 'rgba(255,240,80,0.8)';
  ctx.shadowBlur = 5;
  const segs = [
    [cx, cy, cx - 160, cy - 95,  cx - 230, cy - 65,  cx - 290, cy - 100],
    [cx, cy, cx + 175, cy - 75,  cx + 250, cy - 25,  cx + 310, cy - 95 ],
    [cx, cy, cx - 110, cy + 95,  cx - 155, cy + 155, cx - 120, cy + 210],
    [cx, cy, cx + 125, cy + 105, cx + 190, cy + 138, cx + 260, cy + 170],
    [cx, cy, cx - 185, cy + 18,  cx - 290, cy - 12,  cx - 360, cy + 28 ],
    [cx, cy, cx + 155, cy + 12,  cx + 290, cy + 55               ],
    [cx, cy, cx + 28,  cy - 125, cx - 22,  cy - 215               ],
    [cx, cy, cx - 42,  cy + 28,  cx - 68,  cy + 62,  cx - 48, cy + 115],
    [cx, cy, cx + 58,  cy - 32,  cx + 88, cy - 85,  cx + 68, cy - 145],
  ];
  segs.forEach(pts => {
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.stroke();
  });
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 72);
  g.addColorStop(0, 'rgba(255,255,200,0.75)'); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  return cv;
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEAN SHADER (MIRRORED)
// ─────────────────────────────────────────────────────────────────────────────
const CleanBillMaterial = ({ texture, opacity = 1 }) => {
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
    uOpacity: { value: opacity },
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
          bool isBlack = tex.r < 0.02 && tex.g < 0.02 && tex.b < 0.02;
          if (tex.a < 0.1 || isBlack) discard;
          tex.a *= uOpacity;
          gl_FragColor = tex;
        }
      `}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const FRAGS = [
  { col:0, row:0, target:[-6.8,  3.2, 2.0], landing:[-4.5, -2.6, 0.5], spin:-2.3, type:'5'  },
  { col:1, row:0, target:[ 0.0,  5.8, 2.2], landing:[ 0.0, -2.4, 0.2], spin: 1.9, type:'20' },
  { col:2, row:0, target:[ 6.8,  3.2, 2.0], landing:[ 4.5, -2.6, 0.5], spin: 2.5, type:'20' },
  { col:0, row:1, target:[-7.2, -4.8, 2.2], landing:[-4.5, -3.2, 0.7], spin:-1.6, type:'5'  },
  { col:1, row:1, target:[ 0.2, -6.2, 2.5], landing:[ 0.0, -3.2, 0.6], spin: 2.2, type:'5'  },
  { col:2, row:1, target:[ 7.2, -4.8, 2.2], landing:[ 4.5, -3.2, 0.7], spin:-2.1, type:'20' },
];
const COLS = 3, ROWS = 2;
const BW = 18.0, BH = 12.0; 
const FW = BW / COLS, FH = BH / ROWS;

const PLANS = [
  { name:'Starter', price:'Free',    color:'#2962ff', bill:'$5 bill',  features:['Real-time charts','5 watchlists','3 alerts / day'] },
  { name:'Pro',     price:'$29/mo',  color:'#00c979', bill:'$20 bill', features:['Advanced tools','Unlimited watchlists','Copy 5 traders'] },
  { name:'Elite',   price:'$99/mo',  color:'#f59e0b', bill:'$20 bill', features:['All features','Unlimited copy trade','Priority support'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// R3F Components
// ─────────────────────────────────────────────────────────────────────────────
function MainHeroBill({ progress, mouse }) {
  const ref = useRef();
  const tex = useTexture('/bill.png');
  const [opacity, setOpacity] = useState(1);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = progress.current;
    const t = clock.getElapsedTime();
    const op = 1 - eio(clamp01(p, 0.52, 0.62));
    setOpacity(op);
    ref.current.visible = op > 0.01;
    if (!ref.current.visible) return;
    ref.current.position.y = (Math.sin(t * 0.5) * 0.15);
    const shk = clamp01(p, 0.40, 0.52) * (1 - clamp01(p, 0.50, 0.52));
    ref.current.rotation.z = shk * Math.sin(t * 30) * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.05 + mouse.current.y * 0.1;
    ref.current.rotation.y = Math.cos(t * 0.3) * 0.06 + mouse.current.x * 0.12;
  });
  return (
    <mesh ref={ref}>
      <planeGeometry args={[BW, BH]} />
      <CleanBillMaterial texture={tex} opacity={opacity} />
    </mesh>
  );
}

function CrackMesh({ progress }) {
  const ref = useRef();
  const tex = useMemo(() => new THREE.CanvasTexture(makeCrackCanvas()), []);
  useFrame(() => {
    if (!ref.current) return;
    const p = progress.current;
    const fadeIn  = eio(clamp01(p, 0.40, 0.52));
    const fadeOut = eio(clamp01(p, 0.52, 0.62));
    ref.current.material.opacity = fadeIn * (1 - fadeOut);
    ref.current.visible = ref.current.material.opacity > 0.005;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0.05]}>
      <planeGeometry args={[BW, BH]} />
      <meshBasicMaterial map={tex} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function Fragment({ id, cfg, billTex, tex5, tex20, progress }) {
  const ref = useRef();
  const fragTex = useMemo(() => {
    const t = billTex.clone();
    t.repeat.set(1 / COLS, 1 / ROWS);
    t.offset.set(cfg.col / COLS, (ROWS - 1 - cfg.row) / ROWS);
    t.needsUpdate = true;
    return t;
  }, [billTex, cfg]);
  const smallTex = cfg.type === '5' ? tex5 : tex20;
  const sx = (cfg.col - (COLS - 1) / 2) * FW;
  const sy = ((ROWS - 1) / 2 - cfg.row) * FH;
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = progress.current;
    const t = clock.getElapsedTime();
    const expT  = eio(clamp01(p, 0.55, 0.78));
    const landT = eio(clamp01(p, 0.78, 0.94));
    const crossT = clamp01(p, 0.76, 0.88);
    ref.current.visible = p > 0.53;
    if (!ref.current.visible) return;
    const tx = THREE.MathUtils.lerp(cfg.target[0], cfg.landing[0], landT);
    const ty = THREE.MathUtils.lerp(cfg.target[1], cfg.landing[1], landT);
    const tz = THREE.MathUtils.lerp(cfg.target[2], cfg.landing[2], landT);
    ref.current.position.set(THREE.MathUtils.lerp(sx, tx, expT), THREE.MathUtils.lerp(sy, ty, expT), THREE.MathUtils.lerp(0,  tz, expT));
    const spinDamp = 1 - landT * 0.9;
    ref.current.rotation.z = cfg.spin * expT * spinDamp;
    ref.current.rotation.x = Math.sin(t * 0.5 + id) * 0.06 * landT;
    const showSmall = crossT >= 0.5;
    if (showSmall && ref.current.material.map !== smallTex) { ref.current.material.map = smallTex; }
    else if (!showSmall && ref.current.material.map !== fragTex) { ref.current.material.map = fragTex; }
    const targetSW = 4.2; 
    const targetSH = targetSW / 2.36;
    ref.current.scale.set(THREE.MathUtils.lerp(1, targetSW / FW, crossT), THREE.MathUtils.lerp(1, targetSH / FH, crossT), 1);
    ref.current.material.opacity = Math.min(1, (p - 0.53) / 0.06);
  });
  return (
    <mesh ref={ref} visible={false}>
      <planeGeometry args={[FW, FH]} />
      <meshStandardMaterial map={fragTex} transparent roughness={0.3} metalness={0.02} />
    </mesh>
  );
}

function Scene({ progress, mouse }) {
  const billTex = useTexture('/bill.png');
  const tex5  = useMemo(() => new THREE.CanvasTexture(makeBillCanvas(5)),  []);
  const tex20 = useMemo(() => new THREE.CanvasTexture(makeBillCanvas(20)), []);
  return (
    <>
      <ambientLight intensity={3.5} />
      <pointLight position={[10, 10, 10]} intensity={2.5} />
      <spotLight position={[-10, 10, 10]} angle={0.25} penumbra={1} intensity={3.5} />
      <MainHeroBill progress={progress} mouse={mouse} />
      <CrackMesh  progress={progress} />
      {FRAGS.map((cfg, i) => (
        <Fragment key={i} id={i} cfg={cfg} billTex={billTex} tex5={tex5} tex20={tex20} progress={progress} />
      ))}
    </>
  );
}

export default function MoneyScrollExperience() {
  const containerRef = useRef(null);
  const progressRef  = useRef(0);
  const mouseRef     = useRef({ x: 0, y: 0 });
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect  = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const raw   = Math.max(0, Math.min(1, -rect.top / total));
      progressRef.current = raw;
      setProg(raw);
    };
    const onMouse = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('scroll',    onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse,  { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const smooth = useSpring(prog, { stiffness: 40, damping: 25 });
  const scrollHintOp = useTransform(smooth, [0, 0.12], [1, 0]);
  const crackLabelOp = useTransform(smooth, [0.38, 0.44, 0.54, 0.62], [0, 1, 1, 0]);
  const cardsOp      = useTransform(smooth, [0.85, 0.98], [0, 1]);
  const cardsY       = useTransform(smooth, [0.85, 0.98], ['50px', '0px']);

  return (
    <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>
      <div style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', background: '#03050e', isolation: 'isolate',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Canvas camera={{ position: [0, 0, 11], fov: 45 }} style={{ position: 'absolute', inset: 0 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}><Scene progress={progressRef} mouse={mouseRef} /></Suspense>
        </Canvas>

        {/* Removed radial gradient as requested */}

        <motion.div style={{ position: 'absolute', bottom: '8vh', left: '50%', translateX: '-50%', opacity: scrollHintOp, zIndex: 15, pointerEvents: 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 22px', borderRadius: 24, border: '1px solid rgba(41,98,255,0.4)', background: 'rgba(41,98,255,0.08)', fontSize: 12, color: '#2962ff', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#2962ff', display: 'inline-block' }} />
            Scroll to break down the cost
          </div>
        </motion.div>
        <motion.div style={{ position: 'absolute', top: '15vh', left: '50%', translateX: '-50%', opacity: crackLabelOp, zIndex: 15, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 900, color: '#fff', textAlign: 'center', letterSpacing: '-1.5px' }}>Breaking it down…</div>
        </motion.div>
        <motion.div style={{ position: 'absolute', bottom: '6vh', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '1.5rem', padding: '0 3rem', flexWrap: 'wrap', opacity: cardsOp, y: cardsY, zIndex: 20, pointerEvents: 'auto' }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{ flex: '1 1 220px', maxWidth: 280, background: 'rgba(5, 8, 14, 0.85)', backdropFilter: 'blur(20px)', border: `1px solid ${plan.color}33`, borderRadius: 20, padding: '1.8rem', boxShadow: `0 0 40px ${plan.color}15` }}>
              <div style={{ display: 'inline-block', marginBottom: '1rem', background: `${plan.color}15`, border: `1px solid ${plan.color}44`, borderRadius: 8, padding: '4px 12px', fontSize: 10, fontWeight: 900, color: plan.color, letterSpacing: '0.08em' }}>{plan.bill}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: plan.color, marginBottom: '1.25rem' }}>{plan.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>{['Direct Market Access', 'Professional Tools', 'Full Analytics'].map(f => (<li key={f} style={{ fontSize: 13, color: '#8b949e', padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: plan.color }}>✓</span> {f}</li>))}</ul>
            </div>
          ))}
        </motion.div>
        {/* Removed vignettes as requested */}
      </div>
    </div>
  );
}

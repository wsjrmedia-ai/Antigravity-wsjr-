import { useScroll, useTransform, useSpring, useMotionTemplate, motion } from 'framer-motion';
import '@google/model-viewer';

// ─── Scroll-Path Configuration ─────────────────────────────────────────────
//
//  scrollYProgress 0 → 1 spans the full page height.
//  Rough section boundaries (tune LEFT_VW / TOP_VH values as needed):
//
//    Hero (100vh)                   → scrollY  0%  –  8%
//    InstitutionalOverview (100vh)  → scrollY  8%  – 16%
//    SchoolsHeader (~60vh)          → scrollY 16%  – 21%
//    SchoolsSection (~400vh sticky) → scrollY 21%  – 52%
//
//  3-stop desired path (per client brief):
//    1. Hero:     float in the right 1fr gap, vertically centred in the hero
//    2. Overview: dead-centre horizontally, sandwiched in the text block
//    3. Schools:  drift back right, below the "Four World-Class Schools" intro
// ───────────────────────────────────────────────────────────────────────────
// ── Fine-tuned from section layout analysis ──────────────────────────────
//
//  Block 1 · Hero
//    Grid: 1fr [ENROLL btn ~220px] 1fr  inside padding: 0 8%.
//    Right 1fr gap starts ≈ 60 vw on 1440 px screen.
//    500 px model centred in that gap → left ≈ 58 vw, upper half of screen.
//
//  Block 2 · Institutional Overview
//    flex-row: heading flex-1 LEFT | paragraphs flex-1 RIGHT, gap 80px.
//    Model sits in the seam between the two columns → left ≈ 32 vw.
//    Section is min-height 100vh with content centred → top ≈ 25 vh.
//
//  Block 3 · Schools Header  (SchoolsHeader.jsx)
//    All text hard-left (padding 0 8%, maxWidth 800px), right half empty.
//    Model floats in the open right space → left ≈ 55 vw, top ≈ 30 vh.
// ─────────────────────────────────────────────────────────────────────────

const STOPS    = [0,    0.06, 0.15, 0.23, 0.31, 0.52];

//                 Hero        Overview      Schools
const LEFT_VW  = [58,   58,   32,   32,   55,   55  ];
const TOP_VH   = [15,   15,   25,   25,   30,   30  ];

// Scale: shrink while crossing the dense Overview text columns.
const SCALE_V  = [1.0,  1.0,  0.80, 0.80, 0.95, 0.95];

export default function SimpleModelViewer() {
  const { scrollYProgress } = useScroll();

  // Raw interpolated values driven by scroll position
  const rawLeft  = useTransform(scrollYProgress, STOPS, LEFT_VW);
  const rawTop   = useTransform(scrollYProgress, STOPS, TOP_VH);
  const rawScale = useTransform(scrollYProgress, STOPS, SCALE_V);

  // Spring physics — buttery glide between the three positions
  const leftSp  = useSpring(rawLeft,  { stiffness: 55, damping: 20, restDelta: 0.01 });
  const topSp   = useSpring(rawTop,   { stiffness: 55, damping: 20, restDelta: 0.01 });
  const scaleSp = useSpring(rawScale, { stiffness: 70, damping: 24 });

  // Build CSS length strings from the spring motion values
  const leftCSS = useMotionTemplate`${leftSp}vw`;
  const topCSS  = useMotionTemplate`${topSp}vh`;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: leftCSS,
        top: topCSS,
        width: '500px',
        height: '500px',
        scale: scaleSp,
        // zIndex 200 keeps this above all page sections (max section zIndex ≤ 50)
        // and safe from the z-index:1 stacking context on <main> in App.jsx
        // because this component is now rendered OUTSIDE <main>.
        zIndex: 200,
        pointerEvents: 'none', // clicks fall through to page content
      }}
    >
      <model-viewer
        // Spaces in the public filename must be percent-encoded so fetch() resolves correctly.
        src="/LOGO.FRAME%20(1)%20-%20Copy.compressed.glb"
        // PNG reference image shown while the GLB loads OR if WebGL is unavailable.
        poster="/jus.the.emblem.frame.red.whyte.highlights.png"
        alt="WallStreet Jr Academy 3D Emblem"
        auto-rotate
        auto-rotate-delay="500"
        rotation-per-second="20deg"
        interaction-prompt="none"
        shadow-intensity="0"
        // Increased exposure so the gold materials pop against the dark maroon backdrop.
        exposure="2.0"
        environment-image="neutral"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          // CRITICAL: these two properties prevent model-viewer from painting an
          // opaque dark box over the page. Without them the element is "visible"
          // but looks invisible because its background matches the dark page.
          backgroundColor: 'transparent',
          '--poster-color': 'transparent',
        }}
      />
    </motion.div>
  );
}

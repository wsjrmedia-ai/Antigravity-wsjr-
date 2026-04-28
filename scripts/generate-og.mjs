/**
 * Generate the default Open Graph card for wsjrschool.com.
 *
 * Output: public/og-default.jpg (1200x630, ~JPG q90)
 * Usage:  node scripts/generate-og.mjs
 *
 * Design notes:
 * - Deep navy → near-black gradient with a subtle warm vignette under
 *   the emblem (matches the gold/bronze of the crest).
 * - Hairline gold rules for editorial polish; tracked uppercase eyebrow;
 *   serif headline (Georgia) so it reads "institution" not "course-app".
 * - System fonts only — librsvg (via sharp) doesn't load webfonts.
 */

import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promises as fs } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const W = 1200;
const H = 630;
const GOLD = '#c9a96a';
const GOLD_SOFT = '#8a7a55';

const emblemPath = path.join(ROOT, 'public', 'jus.the.emblem.frame.red.whyte.highlights.png');
const outPath    = path.join(ROOT, 'public', 'og-default.jpg');

async function main() {
    // Prepare the emblem: trim any black background, resize, keep transparency.
    const emblemBuf = await sharp(emblemPath)
        .resize(420, 420, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer();

    // Background SVG — gradients, textures, decorative rules.
    const bgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#0b0f1c"/>
      <stop offset="55%"  stop-color="#0a0a14"/>
      <stop offset="100%" stop-color="#100a06"/>
    </linearGradient>
    <radialGradient id="warm" cx="22%" cy="50%" r="42%">
      <stop offset="0%"   stop-color="#3a2a14" stop-opacity="0.55"/>
      <stop offset="60%"  stop-color="#1a1208" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cool" cx="80%" cy="35%" r="55%">
      <stop offset="0%"   stop-color="#1a2540" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldRule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${GOLD}" stop-opacity="0"/>
      <stop offset="50%"  stop-color="${GOLD}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.025" stroke-width="0.5"/>
    </pattern>
  </defs>

  <!-- base layers -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#warm)"/>
  <rect width="${W}" height="${H}" fill="url(#cool)"/>

  <!-- editorial frame: hairline border inset 28px -->
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}"
        fill="none" stroke="${GOLD}" stroke-opacity="0.22" stroke-width="1"/>

  <!-- corner ticks -->
  <g stroke="${GOLD}" stroke-width="1.2" stroke-opacity="0.55" fill="none">
    <path d="M 28 60  L 28 28  L 60 28"/>
    <path d="M ${W - 60} 28  L ${W - 28} 28  L ${W - 28} 60"/>
    <path d="M 28 ${H - 60} L 28 ${H - 28} L 60 ${H - 28}"/>
    <path d="M ${W - 60} ${H - 28} L ${W - 28} ${H - 28} L ${W - 28} ${H - 60}"/>
  </g>

  <!-- vertical separator between emblem and copy -->
  <line x1="540" y1="170" x2="540" y2="${H - 170}"
        stroke="${GOLD}" stroke-opacity="0.35" stroke-width="1"/>

  <!-- eyebrow rule above headline -->
  <line x1="580" y1="200" x2="700" y2="200"
        stroke="${GOLD}" stroke-width="1.5"/>

  <!-- copy block -->
  <g font-family="Georgia, 'Times New Roman', serif" fill="#f1ead8">
    <text x="580" y="232"
          font-family="Arial, 'Helvetica Neue', sans-serif"
          font-size="14" letter-spacing="6" fill="${GOLD}" font-weight="700">
      WALL  STREET  JR.  ACADEMY
    </text>

    <text x="580" y="305" font-size="58" font-weight="700" fill="#ffffff" letter-spacing="-0.5">
      Finance. AI.
    </text>
    <text x="580" y="370" font-size="58" font-weight="700" fill="#ffffff" letter-spacing="-0.5">
      Business. Design.
    </text>

    <text x="580" y="430"
          font-family="Arial, 'Helvetica Neue', sans-serif"
          font-size="20" fill="#c8c4b6" letter-spacing="0.2">
      A Dubai-based global academy for
    </text>
    <text x="580" y="458"
          font-family="Arial, 'Helvetica Neue', sans-serif"
          font-size="20" fill="#c8c4b6" letter-spacing="0.2">
      Indian and UAE students. Real-world,
    </text>
    <text x="580" y="486"
          font-family="Arial, 'Helvetica Neue', sans-serif"
          font-size="20" fill="#c8c4b6" letter-spacing="0.2">
      mentor-led, career-built.
    </text>
  </g>

  <!-- offices row (above the gold rule) -->
  <text x="580" y="${H - 102}"
        font-family="Arial, 'Helvetica Neue', sans-serif"
        font-size="12" letter-spacing="3" fill="${GOLD_SOFT}" font-weight="600">
    DUBAI  ·  MUMBAI  ·  DELHI  ·  BANGALORE  ·  COCHIN
  </text>

  <!-- gold rule -->
  <line x1="580" y1="${H - 84}" x2="${W - 80}" y2="${H - 84}"
        stroke="url(#goldRule)" stroke-width="1"/>

  <!-- footer URL -->
  <text x="580" y="${H - 50}"
        font-family="Arial, 'Helvetica Neue', sans-serif"
        font-size="20" letter-spacing="4" fill="${GOLD}" font-weight="700">
    WSJRSCHOOL.COM
  </text>
  <text x="${W - 80}" y="${H - 50}" text-anchor="end"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="14" letter-spacing="1" fill="#8a8478" font-style="italic">
    Cohort 2026  ·  Now Enrolling
  </text>
</svg>`;

    // Build base from SVG, then composite the emblem on top.
    const base = sharp(Buffer.from(bgSvg)).png();

    const composed = await base
        .composite([
            { input: emblemBuf, left: 80, top: (H - 420) / 2 },
        ])
        .jpeg({ quality: 90, mozjpeg: true })
        .toBuffer();

    await fs.writeFile(outPath, composed);

    const stat = await fs.stat(outPath);
    console.log(`✓ wrote ${path.relative(ROOT, outPath)} — ${(stat.size / 1024).toFixed(1)} kB`);
}

main().catch(err => {
    console.error('OG generation failed:', err);
    process.exit(1);
});

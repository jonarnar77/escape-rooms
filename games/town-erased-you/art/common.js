// Shared SVG building blocks for The Town That Erased You (Little Wending).
// Warm autumn daylight, cream plaster, green paintwork, old paper. All art is 800x600.

export const DEFS = `
<defs>
  <linearGradient id="tWood" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#8a5a34"/><stop offset="1" stop-color="#5a3820"/>
  </linearGradient>
  <linearGradient id="tFloor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7a5434"/><stop offset="1" stop-color="#4a301c"/>
  </linearGradient>
  <linearGradient id="tBrass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f2dc98"/><stop offset=".5" stop-color="#c49a44"/><stop offset="1" stop-color="#8a6420"/>
  </linearGradient>
  <linearGradient id="tSky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#9cc0d4"/><stop offset="1" stop-color="#f0dcb4"/>
  </linearGradient>
  <linearGradient id="tBeam" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#fff2c8" stop-opacity=".35"/><stop offset="1" stop-color="#fff2c8" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="tVignette" cx=".5" cy=".5" r=".75">
    <stop offset=".55" stop-color="#2a1808" stop-opacity="0"/><stop offset="1" stop-color="#2a1808" stop-opacity=".55"/>
  </radialGradient>
  <filter id="tGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="4"/>
    <feColorMatrix values="0 0 0 0 .2  0 0 0 0 .12  0 0 0 0 .05  0 0 0 .22 -.04"/>
  </filter>
  <filter id="tPaper" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="8"/>
    <feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .15  0 0 0 .35 -.08"/>
  </filter>
  <filter id="tSoft"><feGaussianBlur stdDeviation="1.2"/></filter>
</defs>`;

export const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
export const serif = 'font-family="Georgia, \'Times New Roman\', serif"';
export const mono = 'font-family="Courier New, monospace"';
/** Wren's green ink. */
export const INK = '#2f7a4a';

/** Seeded random numbers, so art looks the same every time. */
export function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

/** A sheet of paper (x, y, w, h), slightly yellowed, with a shadow. */
export function paper(x, y, w, h, { tint = '#f4ecd8', rot = 0, shadow = true } = {}) {
  const c = `${x + w / 2} ${y + h / 2}`;
  return `<g transform="rotate(${rot} ${c})">
    ${shadow ? `<rect x="${x + 5}" y="${y + 7}" width="${w}" height="${h}" fill="#000" opacity=".25"/>` : ''}
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tint}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" filter="url(#tPaper)" opacity=".6"/>
  </g>`;
}

/** Plain background for close-ups: a wooden table top in daylight. */
export function tableTop(seed = 5) {
  const r = rng(seed);
  let grain = '';
  for (let y = 10; y < 600; y += 20) grain += `<path d="M0 ${y} Q200 ${y + r() * 10} 400 ${y} T800 ${y + r() * 6}"/>`;
  return `${DEFS}<rect width="800" height="600" fill="url(#tWood)"/>
  <g stroke="#3a2210" stroke-width="2" fill="none" opacity=".35">${grain}</g>
  <polygon points="0,0 360,0 800,420 800,600 640,600" fill="url(#tBeam)"/>`;
}

/** Wall clock. */
export function wallClock(cx, cy, r, hour = 10, minute = 10) {
  let ticks = '';
  for (let i = 0; i < 12; i++) ticks += `<line y1="${-r + 3}" y2="${-r + 8}" transform="rotate(${i * 30})" stroke="#2a1c10" stroke-width="2"/>`;
  return `
  <g transform="translate(${cx},${cy})">
    <circle r="${r + 5}" fill="url(#tWood)"/><circle r="${r}" fill="#f6efdc"/>${ticks}
    <line y2="${-r * 0.5}" transform="rotate(${(hour % 12) * 30 + minute / 2})" stroke="#1a1208" stroke-width="3" stroke-linecap="round"/>
    <line y2="${-r * 0.78}" transform="rotate(${minute * 6})" stroke="#1a1208" stroke-width="2" stroke-linecap="round"/>
    <circle r="2.5" fill="#1a1208"/>
  </g>`;
}

/** Film grain, vignette and a warm wash. Add last. */
export function finish() {
  return `
  <rect width="800" height="600" filter="url(#tGrain)"/>
  <rect width="800" height="600" fill="url(#tVignette)"/>
  <rect width="800" height="600" fill="#ffc070" opacity=".06" style="mix-blend-mode:multiply"/>`;
}

/** An envelope (x, y top-left), with address lines and a stamp. */
export function envelope(x, y, w, h, lines = [], { tint = '#efe4c8', rot = 0, stamp = '#a33a2a', size = 13 } = {}) {
  const c = `${x + w / 2} ${y + h / 2}`;
  return `<g transform="rotate(${rot} ${c})">
    <rect x="${x + 3}" y="${y + 4}" width="${w}" height="${h}" fill="#000" opacity=".22"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${tint}" stroke="#a89870" stroke-width="1"/>
    <rect x="${x + w - h * 0.32 - 6}" y="${y + 6}" width="${h * 0.32}" height="${h * 0.38}" fill="${stamp}" stroke="#f4ecd8" stroke-width="2"/>
    ${lines.map((t, i) => `<text x="${x + w * 0.22}" y="${y + h * 0.52 + i * size * 1.25}" font-size="${size}" ${hand} fill="#2a2440">${t}</text>`).join('')}
  </g>`;
}

// Shared SVG building blocks for The Hotel That Lost a Day (The Halcyon).
// Warm lamplight, damask wallpaper, rain on the windows. All art is 800x600.

export const DEFS = `
<defs>
  <pattern id="damask" width="48" height="64" patternUnits="userSpaceOnUse">
    <rect width="48" height="64" fill="#1f3a2e"/>
    <path d="M24 6 q10 10 0 20 q-10 -10 0 -20 Z M24 26 q14 6 14 18 q-8 -2 -14 -8 q-6 6 -14 8 q0 -12 14 -18 Z
             M24 44 v14 M18 54 h12" fill="#2c4d3c" stroke="#3a5e49" stroke-width="1"/>
    <circle cx="0" cy="0" r="3" fill="#2c4d3c"/><circle cx="48" cy="0" r="3" fill="#2c4d3c"/>
    <circle cx="0" cy="64" r="3" fill="#2c4d3c"/><circle cx="48" cy="64" r="3" fill="#2c4d3c"/>
  </pattern>
  <pattern id="marble" width="80" height="40" patternUnits="userSpaceOnUse">
    <rect width="80" height="40" fill="#d8d0c0"/>
    <rect width="40" height="20" fill="#3a3430"/><rect x="40" y="20" width="40" height="20" fill="#3a3430"/>
  </pattern>
  <linearGradient id="woodG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#5a3a24"/><stop offset="1" stop-color="#2e1c10"/>
  </linearGradient>
  <linearGradient id="brassG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f0d890"/><stop offset=".5" stop-color="#b8903a"/><stop offset="1" stop-color="#7a5a1a"/>
  </linearGradient>
  <linearGradient id="nightG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1a2230"/><stop offset="1" stop-color="#2c3644"/>
  </linearGradient>
  <radialGradient id="lampGlow" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#ffd890" stop-opacity=".6"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="hVignette" cx=".5" cy=".5" r=".75">
    <stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/>
  </radialGradient>
  <filter id="hGrain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="11"/>
    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .3 -.06"/>
  </filter>
  <filter id="hGlow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>`;

export const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
export const serif = 'font-family="Georgia, \'Times New Roman\', serif"';

/** Seeded random numbers, so art looks the same every time. */
export function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

/** A night window with rain streaks and drops running down the glass. */
export function rainWindow(x, y, w, h, id = 'win') {
  const r = rng(x * 7 + y);
  let streaks = '';
  for (let i = 0; i < 26; i++) {
    const sx = x + r() * w, len = 14 + r() * 18, dur = (0.5 + r() * 0.4).toFixed(2), delay = (r() * 1).toFixed(2);
    streaks += `<line x1="${sx}" y1="${y - 30}" x2="${sx - 3}" y2="${y - 30 + len}" stroke="#9fb4c8" stroke-width="1.2" opacity=".5">
      <animateTransform attributeName="transform" type="translate" from="0 0" to="-8 ${h + 60}" dur="${dur}s" begin="-${delay}s" repeatCount="indefinite"/></line>`;
  }
  let drops = '';
  for (let i = 0; i < 7; i++) {
    const dx = x + 8 + r() * (w - 16), dur = (4 + r() * 5).toFixed(1), delay = (r() * 6).toFixed(1);
    drops += `<circle cx="${dx}" cy="${y}" r="2" fill="#c8d8e8" opacity=".6">
      <animate attributeName="cy" from="${y}" to="${y + h}" dur="${dur}s" begin="-${delay}s" repeatCount="indefinite"/></circle>`;
  }
  return `
  <defs><clipPath id="${id}-clip"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs>
  <rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" fill="#3a2414"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#nightG)"/>
  <g clip-path="url(#${id}-clip)">
    <circle cx="${x + w * 0.7}" cy="${y + h * 0.75}" r="6" fill="#ffcf80" opacity=".5" filter="url(#hGlow)"/>
    <circle cx="${x + w * 0.25}" cy="${y + h * 0.8}" r="4" fill="#c8e0ff" opacity=".35" filter="url(#hGlow)"/>
    ${streaks}${drops}
  </g>
  <rect x="${x + w / 2 - 2}" y="${y}" width="4" height="${h}" fill="#3a2414"/>
  <rect x="${x}" y="${y + h * 0.45}" width="${w}" height="4" fill="#3a2414"/>`;
}

/** Brass table lamp with a green glass shade, and its pool of warm light. */
export function lamp(x, y, scale = 1) {
  return `
  <circle cx="${x}" cy="${y}" r="${90 * scale}" fill="url(#lampGlow)"/>
  <g transform="translate(${x},${y}) scale(${scale})">
    <path d="M-26 6 q26 -26 52 0 Z" fill="#1d5a3a" stroke="#0e2e1c" stroke-width="2"/>
    <rect x="-3" y="6" width="6" height="34" fill="url(#brassG)"/>
    <rect x="-16" y="40" width="32" height="6" rx="2" fill="url(#brassG)"/>
  </g>`;
}

/** Wall clock with a ticking second hand. */
export function wallClock(cx, cy, r, hour = 10, minute = 58) {
  let ticks = '';
  for (let i = 0; i < 12; i++) ticks += `<line y1="${-r + 4}" y2="${-r + 10}" transform="rotate(${i * 30})" stroke="#2a1c10" stroke-width="2"/>`;
  return `
  <g transform="translate(${cx},${cy})">
    <circle r="${r + 5}" fill="url(#brassG)"/><circle r="${r}" fill="#efe6cf"/>${ticks}
    <line y2="${-r * 0.5}" transform="rotate(${(hour % 12) * 30 + minute / 2})" stroke="#1a1208" stroke-width="3.5" stroke-linecap="round"/>
    <line y2="${-r * 0.78}" transform="rotate(${minute * 6})" stroke="#1a1208" stroke-width="2.2" stroke-linecap="round"/>
    <line y2="${-r * 0.85}" stroke="#a3221c" stroke-width="1">
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" calcMode="discrete"
        values="${Array.from({ length: 60 }, (_, i) => i * 6).join(';')}"/></line>
    <circle r="3" fill="#1a1208"/>
  </g>`;
}

/** Plain background for close-ups. */
export function closeup(fill = '#1a120c') {
  return `${DEFS}<rect width="800" height="600" fill="${fill}"/>`;
}

/** Polished wood surface for close-ups of things lying on the desk. */
export function deskTop() {
  const r = rng(5);
  let grain = '';
  for (let y = 10; y < 600; y += 22) grain += `<path d="M0 ${y} Q200 ${y + r() * 10} 400 ${y} T800 ${y + r() * 6}"/>`;
  return `${DEFS}<rect width="800" height="600" fill="url(#woodG)"/>
  <g stroke="#1a0e06" stroke-width="2" fill="none" opacity=".45">${grain}</g>
  <circle cx="620" cy="80" r="260" fill="url(#lampGlow)" opacity=".7"/>`;
}

/** Film grain + vignette. Add last. */
export function finish() {
  return `
  <rect width="800" height="600" filter="url(#hGrain)"/>
  <rect width="800" height="600" fill="url(#hVignette)"/>
  <rect width="800" height="600" fill="#ffb060" opacity=".05" style="mix-blend-mode:screen"/>`;
}

import { SYMBOLS } from './symbols.js';

// Shared SVG building blocks for the abandoned-lab look.
// All art is drawn in an 800x600 coordinate space.

export const DEFS = `
<defs>
  <linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#25322d"/><stop offset="1" stop-color="#3a4c44"/>
  </linearGradient>
  <linearGradient id="floorG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a2a24"/><stop offset="1" stop-color="#121210"/>
  </linearGradient>
  <linearGradient id="metalG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7a8581"/><stop offset="1" stop-color="#454d4a"/>
  </linearGradient>
  <linearGradient id="woodG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4a3829"/><stop offset="1" stop-color="#2e2219"/>
  </linearGradient>
  <radialGradient id="lightG" cx="0.5" cy="0" r="0.9">
    <stop offset="0" stop-color="#e8f5c8" stop-opacity="0.28"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
    <stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/>
  </radialGradient>
  <pattern id="hazard" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="20" height="20" fill="#d9b21c"/><rect width="10" height="20" fill="#1a1a1a"/>
  </pattern>
  <filter id="grime" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7"/>
    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 -0.08"/>
  </filter>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="3" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>`;

// Flickering ceiling-light timing, shared by the tube and the room darkening.
const FLICKER = 'keyTimes="0;.7;.72;.74;.9;.91;1" dur="5s" repeatCount="indefinite"';

/** A generic lab wall + floor, facing straight on. Draw furniture on top. */
export function room({ light = true } = {}) {
  let floor = '';
  for (let i = -6; i <= 6; i++) floor += `<line x1="${400 + i * 70}" y1="470" x2="${400 + i * 140}" y2="600"/>`;
  for (const y of [482, 498, 520, 548, 584]) floor += `<line x1="0" y1="${y}" x2="800" y2="${y}"/>`;
  let tiles = '';
  for (let y = 300; y < 440; y += 28) tiles += `<line x1="0" y1="${y}" x2="800" y2="${y}"/>`;
  for (let x = 0; x <= 800; x += 40) tiles += `<line x1="${x}" y1="300" x2="${x}" y2="440"/>`;

  return `${DEFS}
  <rect width="800" height="600" fill="#000"/>
  <rect width="800" height="470" fill="url(#wallG)"/>
  <rect y="300" width="800" height="140" fill="#4a5c54" opacity=".35"/>
  <g stroke="#1c2420" stroke-width="1.5" opacity=".6">${tiles}</g>
  <rect y="296" width="800" height="5" fill="#26302c"/>
  <ellipse cx="110" cy="230" rx="60" ry="130" fill="#17201c" opacity=".35"/>
  <ellipse cx="700" cy="190" rx="40" ry="95" fill="#17201c" opacity=".3"/>
  <rect width="800" height="34" fill="#141a17"/>
  <rect y="34" width="800" height="4" fill="#0c100e"/>
  ${light ? `<rect x="300" y="12" width="200" height="12" rx="5" fill="#dfeccc" filter="url(#glow)">
    <animate attributeName="opacity" values="1;1;.3;1;1;.15;1" ${FLICKER}/></rect>` : ''}
  <rect y="440" width="800" height="30" fill="#1b2420"/>
  <rect y="470" width="800" height="130" fill="url(#floorG)"/>
  <g stroke="#000" stroke-opacity=".45">${floor}</g>`;
}

/** Plain background for close-up views. */
export function closeup(fill = '#1a1f1c') {
  return `${DEFS}<rect width="800" height="600" fill="${fill}"/>`;
}

/** Wood surface for desk close-ups. */
export function deskSurface() {
  let grain = '';
  for (let y = 20; y < 600; y += 34) grain += `<path d="M0 ${y} Q200 ${y + 8} 400 ${y} T800 ${y + 4}" />`;
  return `${DEFS}<rect width="800" height="600" fill="url(#woodG)"/>
  <g stroke="#1f1610" stroke-width="2" fill="none" opacity=".5">${grain}</g>`;
}

/** Grime, light falloff, vignette and light flicker. Add last. */
export function finish({ flicker = true } = {}) {
  return `
  <rect width="800" height="600" filter="url(#grime)"/>
  <rect width="800" height="600" fill="url(#lightG)"/>
  <rect width="800" height="600" fill="url(#vignette)"/>
  ${flicker ? `<rect width="800" height="600" fill="#000" opacity="0">
    <animate attributeName="opacity" values="0;0;.25;0;0;.35;0" ${FLICKER}/></rect>` : ''}`;
}

/** Standard steel lab door centred on the north wall (x 320–480, y 150–470). */
export function door({ open = false, label = '' } = {}) {
  return `
  <rect x="305" y="135" width="190" height="335" fill="#1e2522"/>
  <rect x="312" y="142" width="176" height="328" fill="#141917"/>
  ${open ? `
    <rect x="320" y="150" width="160" height="320" fill="#030504"/>
    <polygon points="352,166 480,166 480,452 352,452" fill="#070a09"/>
    <polygon points="320,150 352,166 352,452 320,470" fill="url(#metalG)"/>
    <polygon points="320,150 352,166 352,452 320,470" fill="#000" opacity=".4"/>
  ` : `
    <rect x="320" y="150" width="160" height="320" fill="url(#metalG)"/>
    <rect x="355" y="185" width="90" height="70" fill="#0a100e" stroke="#2b302e" stroke-width="5"/>
    <path d="M360 190 L440 250 M440 190 L360 250 M400 188 L400 252" stroke="#3a403d" stroke-width="1.5"/>
    <text x="400" y="292" font-size="16" text-anchor="middle" fill="#1e2422" font-family="Arial, sans-serif" font-weight="bold">${label}</text>
    <rect x="320" y="420" width="160" height="22" fill="url(#hazard)" opacity=".85"/>
    <rect x="455" y="300" width="12" height="44" rx="3" fill="#252a28"/>
    ${[[332, 162], [468, 162], [332, 458], [468, 458]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#3a403d"/>`).join('')}
  `}`;
}

/** Area sign above a door, with the area's symbol on a light badge. Centred on x=400. */
export function doorSign(text, symbol, { bg = '#1d4a2c', fg = '#e6f2e0', y = 100, width } = {}) {
  const w = width ?? Math.round(text.length * 8.6 + (symbol ? 44 : 20));
  const x = 400 - w / 2;
  const textX = symbol ? x + 36 + (w - 36) / 2 - 4 : 400;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="30" rx="3" fill="${bg}" stroke="#0c100e" stroke-width="2"/>
  ${symbol ? `<circle cx="${x + 17}" cy="${y + 15}" r="12" fill="#efe9d6"/>
    <g transform="translate(${x + 7},${y + 5}) scale(.5)">${SYMBOLS[symbol]}</g>` : ''}
  <text x="${textX}" y="${y + 20}" font-size="13" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="${fg}">${text}</text>`;
}

// ROOM 2 — Your Room (204)
// Purpose: discover that yesterday's clues were left by you.
//
//   corridor: six doors with emblem plates; the 204 key opens yours
//   on the bed: a camera tagged in your handwriting, "LOOK AT THE PHOTOS"
//      -> unlocks the Yesterday view (engine: scene.past + hotspot.era)
//   1. Compare yesterday's photo with the room: four things changed
//      (painting gone, armchair moved, mirror covered, roses wilted)
//   2. The suitcase's picture lock opens for someone who has seen all four changes
//      (no repeat puzzle: once all four are noted, clicking the lock presses them)
//      -> your own torn message, and a platform ticket (the memory, planted early)
//   3. Put the message fragments in order (each ends mid-sentence)
//      -> "behind the mirror... lift the sheet, press the swallow"
//   mirror: it reflects the room, but not you. The swallow on the frame opens a
//   hidden service door; move the armchair back where it stood yesterday to get through.
//
// Difficulty: HARD tears the message into more fragments; EASY into fewer.

import { DEFS, closeup, deskTop, finish, rainWindow, lamp, hand, serif } from '../art/common.js';
import { EMBLEMS, symAt } from '../art/symbols.js';

// ---------------------------------------------------------------- lock pictures (40x40)

const PICS = {
  lamp: `<path d="M10 16 q10 -14 20 0 Z" fill="currentColor"/><rect x="18" y="16" width="4" height="16" fill="currentColor"/><rect x="12" y="32" width="16" height="4" fill="currentColor"/>`,
  painting: `<rect x="5" y="8" width="30" height="24" fill="none" stroke="currentColor" stroke-width="3"/><path d="M8 29 l8 -10 l6 7 l4 -4 l6 7 Z" fill="currentColor"/>`,
  bed: `<rect x="4" y="12" width="6" height="24" fill="currentColor"/><rect x="8" y="22" width="28" height="9" fill="currentColor"/><rect x="11" y="16" width="10" height="6" rx="2" fill="currentColor"/><path d="M33 31 v5" stroke="currentColor" stroke-width="3"/>`,
  mirror: `<ellipse cx="20" cy="17" rx="11" ry="14" fill="none" stroke="currentColor" stroke-width="3"/><path d="M14 11 l6 -4" stroke="currentColor" stroke-width="2"/><path d="M13 35 h14 M20 31 v4" stroke="currentColor" stroke-width="3"/>`,
  telephone: `<path d="M6 16 q14 -10 28 0 l-3 5 l-6 -2 v-3 q-5 -2 -10 0 v3 l-6 2 Z" fill="currentColor"/><path d="M10 22 h20 l3 12 h-26 Z" fill="currentColor"/><circle cx="20" cy="28" r="4" fill="#efe6cf"/>`,
  flowers: `<path d="M13 24 h14 l-2 13 h-10 Z" fill="currentColor"/><path d="M20 24 v-10 M16 24 l-5 -9 M24 24 l5 -9" stroke="currentColor" stroke-width="2"/><circle cx="20" cy="10" r="4" fill="currentColor"/><circle cx="10" cy="13" r="4" fill="currentColor"/><circle cx="30" cy="13" r="4" fill="currentColor"/>`,
  curtains: `<path d="M4 5 h32" stroke="currentColor" stroke-width="3"/><path d="M6 7 q4 14 0 29 h9 q-6 -16 -1 -29 Z M34 7 q-4 14 0 29 h-9 q6 -16 1 -29 Z" fill="currentColor"/>`,
  chair: `<path d="M9 13 q11 -8 22 0 v9 h-22 Z" fill="currentColor"/><rect x="4" y="18" width="7" height="14" rx="2" fill="currentColor"/><rect x="29" y="18" width="7" height="14" rx="2" fill="currentColor"/><rect x="10" y="22" width="20" height="9" fill="currentColor"/><path d="M8 32 v4 M32 32 v4" stroke="currentColor" stroke-width="3"/>`,
};
const LOCK_ORDER = ['lamp', 'painting', 'bed', 'mirror', 'telephone', 'flowers', 'curtains', 'chair'];
const CHANGED = ['painting', 'mirror', 'flowers', 'chair'];
const pic = (id, color = '#2a1c10') => `<svg viewBox="0 0 40 40"><g style="color:${color}">${PICS[id]}</g></svg>`;

// ---------------------------------------------------------------- your message

const MESSAGE = {
  easy: [
    "If you're reading this, it worked.",
    'The hotel took the day, but not me. Don\'t',
    'believe the register. The way out',
    'is behind the mirror. Lift the sheet',
    'and press the swallow.',
  ],
  medium: [
    "If you're reading",
    'this, it worked. The hotel',
    "took the day, but not me. Don't",
    'believe the register. The way',
    'out is behind the mirror. Lift',
    'the sheet and press the swallow.',
  ],
  hard: [
    "If you're",
    'reading this, it',
    'worked. The hotel took',
    "the day, but not me. Don't",
    'believe the',
    'register. The way out is',
    'behind the mirror. Lift the sheet',
    'and press the swallow.',
  ],
};
const messageOf = g => MESSAGE[g.difficulty] ?? MESSAGE.medium;

// ---------------------------------------------------------------- art

const ROOM_DEFS = `
<defs>
  <pattern id="damaskRose" width="44" height="60" patternUnits="userSpaceOnUse">
    <rect width="44" height="60" fill="#4a2a2c"/>
    <path d="M22 6 q9 9 0 18 q-9 -9 0 -18 Z M22 24 q12 6 12 16 q-7 -2 -12 -7 q-5 5 -12 7 q0 -10 12 -16 Z" fill="#5a3436" stroke="#6a3e3e" stroke-width="1"/>
  </pattern>
  <pattern id="carpet" width="60" height="30" patternUnits="userSpaceOnUse">
    <rect width="60" height="30" fill="#1e2a44"/><path d="M0 15 h60 M30 0 v30" stroke="#2a3a5a" stroke-width="2"/>
    <circle cx="30" cy="15" r="4" fill="#3a2a1a"/>
  </pattern>
  <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e8d8b0"/><stop offset=".55" stop-color="#9ab8c8"/><stop offset="1" stop-color="#4a6a80"/>
  </linearGradient>
</defs>`;

function armchair(x) {
  return `
    <ellipse cx="${x + 45}" cy="470" rx="54" ry="7" fill="#000" opacity=".45"/>
    <path d="M${x + 6} 380 q39 -40 78 0 v40 h-78 Z" fill="#6a4a2a" stroke="#2e1c10" stroke-width="2"/>
    <rect x="${x - 6}" y="398" width="22" height="58" rx="8" fill="#7a5a34" stroke="#2e1c10" stroke-width="2"/>
    <rect x="${x + 74}" y="398" width="22" height="58" rx="8" fill="#7a5a34" stroke="#2e1c10" stroke-width="2"/>
    <rect x="${x + 12}" y="418" width="66" height="34" rx="4" fill="#8a6a40" stroke="#2e1c10" stroke-width="2"/>
    <path d="M${x} 456 v12 M${x + 90} 456 v12" stroke="#2e1c10" stroke-width="5"/>`;
}

function roomArt(g, past) {
  const chairAtWindow = past || g.flag('chairMoved');
  const covered = !past && !g.flag('sheetLifted');
  const serviceOpen = !past && g.flag('serviceOpen');
  const camera = !past && !g.flag('took:camera');
  const suitcaseOpen = !past && g.flag('lockOpen');
  return `${DEFS}${ROOM_DEFS}
  <rect width="800" height="600" fill="#000"/>
  <rect width="800" height="470" fill="url(#damaskRose)"/>
  <rect width="800" height="24" fill="#2e1c10"/><rect y="24" width="800" height="4" fill="url(#brassG)"/>
  <rect y="300" width="800" height="6" fill="#2e1c10"/>
  <rect y="460" width="800" height="12" fill="#1e120a"/>
  <rect y="470" width="800" height="130" fill="url(#carpet)"/>

  <!-- painting above the bed: there yesterday, only a pale patch today -->
  ${past ? `
    <rect x="326" y="104" width="148" height="110" fill="url(#brassG)"/>
    <rect x="336" y="114" width="128" height="90" fill="url(#seaG)"/>
    <path d="M336 176 q32 -8 64 0 t64 0 v28 h-128 Z" fill="#3a5a70" opacity=".8"/>
    ${[[360, 130], [396, 142], [430, 126]].map(([x, y]) => symAt(EMBLEMS, 'swallow', x, y, 18, '#2a2a3a')).join('')}
  ` : `
    <rect x="326" y="104" width="148" height="110" fill="#6a3e3e" opacity=".55"/>
    <rect x="326" y="104" width="148" height="110" fill="none" stroke="#7a4e4e" stroke-width="2" opacity=".5"/>
    <circle cx="400" cy="98" r="3" fill="#8a7a5a"/>`}

  <!-- hidden service door in the wallpaper -->
  ${serviceOpen ? `
    <rect x="188" y="140" width="66" height="324" fill="#120a06"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${196 + i * 2}" y="${300 + i * 28}" width="${52 - i * 4}" height="6" fill="#2e1c10"/>`).join('')}
    <rect x="188" y="140" width="66" height="324" fill="url(#lampGlow)" opacity=".6"/>
    <polygon points="188,140 176,150 176,456 188,464" fill="url(#damaskRose)" stroke="#2e1c10"/>
  ` : `
    <path d="M188 464 V140 H254 V464" fill="none" stroke="#2e1c10" stroke-width="1.5" opacity=".45"/>`}

  <!-- dresser, vase and mirror -->
  <rect x="30" y="330" width="140" height="132" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  <rect x="24" y="322" width="152" height="10" fill="#6a4a2e"/>
  ${[0, 1].map(i => `<rect x="40" y="${342 + i * 58}" width="120" height="50" fill="none" stroke="#1e120a" stroke-width="2"/>
    <circle cx="100" cy="${367 + i * 58}" r="4" fill="url(#brassG)"/>`).join('')}
  <rect x="62" y="114" width="86" height="206" rx="40" fill="url(#brassG)"/>
  ${covered ? `
    <path d="M52 108 q50 -20 106 0 l8 214 q-30 8 -40 -4 q-20 10 -40 0 q-20 10 -40 -4 Z" fill="#e8e4da"/>
    <path d="M70 130 q10 90 -4 180 M100 120 q8 100 0 196 M130 130 q-6 90 4 182" stroke="#c8c0b0" stroke-width="2" fill="none"/>
  ` : `
    <rect x="70" y="122" width="70" height="190" rx="34" fill="${past ? '#3a4048' : '#2a3038'}"/>
    <rect x="70" y="250" width="70" height="62" fill="#3a2a24" opacity=".6"/>
    <rect x="96" y="150" width="30" height="40" fill="#5a6a7a" opacity=".5"/>
    ${past ? `
      <g fill="#14181c">
        <circle cx="105" cy="196" r="13"/>
        <path d="M84 312 q0 -84 21 -100 q21 16 21 100 Z"/>
        <rect x="94" y="226" width="22" height="14" rx="2" fill="#0a0c0e"/>
        <circle cx="105" cy="233" r="4" fill="#5a6a7a"/>
      </g>` : ''}
    <path d="M78 140 l18 -12" stroke="#fff" stroke-width="2" opacity=".25"/>
    ${symAt(EMBLEMS, 'swallow', 94, 116, 22, '#5a4214')}`}
  ${past ? `
    <path d="M118 322 h28 l-4 -22 h-20 Z" fill="#c8d8e0" opacity=".8"/>
    ${[[124, 290], [134, 284], [142, 292], [128, 280]].map(([x, y]) => `<path d="M132 300 L${x} ${y}" stroke="#3a6a3a" stroke-width="2"/><circle cx="${x}" cy="${y}" r="6" fill="#b8202a"/>`).join('')}
  ` : `
    <path d="M118 322 h28 l-4 -22 h-20 Z" fill="#c8d8e0" opacity=".8"/>
    <path d="M128 300 q-14 -10 -18 6 M134 300 q4 -16 18 -10 M131 300 q-2 -12 -6 -16" stroke="#6a5a3a" stroke-width="2" fill="none"/>
    <circle cx="110" cy="308" r="3" fill="#5a2a2a"/><circle cx="152" cy="292" r="3" fill="#5a2a2a"/>`}

  <!-- window and curtains -->
  <path d="M598 86 q14 120 4 236 h28 q-10 -120 -4 -236 Z" fill="#5a1a22"/>
  ${rainWindow(628, 100, 110, 212, 'r2win')}
  <path d="M770 86 q-14 120 -4 236 h-28 q10 -120 4 -236 Z" fill="#5a1a22"/>
  <rect x="592" y="80" width="186" height="10" rx="3" fill="url(#brassG)"/>

  <!-- bed -->
  <path d="M282 330 v-80 q118 -50 236 0 v80 Z" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  <polygon points="282,326 518,326 560,470 240,470" fill="#efe6cf"/>
  <polygon points="262,404 540,404 560,470 240,470" fill="#7a2a34"/>
  <path d="M262 404 h278" stroke="#5a1a22" stroke-width="4"/>
  <rect x="300" y="300" width="88" height="36" rx="14" fill="#f8f4ea" stroke="#c8c0b0"/>
  <rect x="412" y="300" width="88" height="36" rx="14" fill="#f8f4ea" stroke="#c8c0b0"/>
  ${camera ? `
    <g transform="translate(374,360) rotate(-6)">
      <rect width="56" height="34" rx="5" fill="#1e1e22"/><rect x="6" y="-6" width="14" height="8" fill="#1e1e22"/>
      <circle cx="30" cy="17" r="11" fill="#3a3a44" stroke="#8a8a90" stroke-width="2"/><circle cx="30" cy="17" r="5" fill="#0a0a10"/>
      <path d="M50 4 q20 6 22 22" stroke="#c9a33b" stroke-width="1.5" fill="none"/>
      <rect x="62" y="24" width="28" height="18" fill="#f4efe2" transform="rotate(14 76 33)"/>
    </g>` : ''}

  <!-- bedside table, lamp, telephone -->
  <rect x="534" y="362" width="62" height="100" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  <rect x="528" y="356" width="74" height="8" fill="#6a4a2e"/>
  ${lamp(552, 356 - 46 * 0.55, 0.55)}
  <path d="M570 352 q12 -8 24 0 l-2 4 h-20 Z" fill="#1a1a1a"/><rect x="572" y="342" width="20" height="6" rx="3" fill="#1a1a1a"/>

  <!-- armchair: by the window yesterday, against the wall today (in front of the service door) -->
  ${chairAtWindow ? armchair(650) : armchair(176)}

  <!-- suitcase on its luggage rack, at the foot of the bed -->
  <path d="M300 556 l10 -60 M500 556 l-10 -60 M300 496 l200 0" stroke="#3a2414" stroke-width="5"/>
  ${suitcaseOpen ? `
    <rect x="304" y="470" width="192" height="40" fill="#5a3a24" stroke="#2e1c10" stroke-width="2"/>
    <polygon points="304,470 496,470 486,430 314,430" fill="#6a4a2e" stroke="#2e1c10" stroke-width="2"/>
    <rect x="320" y="474" width="160" height="30" fill="#c8c0b0"/>
  ` : `
    <rect x="304" y="446" width="192" height="64" rx="6" fill="#6a3a24" stroke="#2e1c10" stroke-width="2"/>
    <rect x="304" y="470" width="192" height="4" fill="#4a2a18"/>
    <rect x="384" y="462" width="32" height="20" rx="3" fill="url(#brassG)"/>
    <rect x="388" y="432" width="24" height="16" rx="6" fill="none" stroke="#2e1c10" stroke-width="5"/>
    <rect x="440" y="452" width="40" height="26" fill="#f4efe2" transform="rotate(8 460 465)"/>`}

  ${past ? `<text x="772" y="584" font-size="22" text-anchor="end" font-family="Courier New, monospace" font-weight="bold"
    fill="#ff9a3a" opacity=".85" filter="url(#hGlow)">6 NOV  10.30 PM</text>` : ''}
  ` + finish();
}

// What you notice at each door in the corridor (also written in the notebook:
// the breakfast room's lost property draws on these).
const CORRIDOR_SOUNDS = {
  201: { say: 'Two voices behind the door, murmuring the same sentence over and over.', note: 'two voices murmuring the same sentence, over and over.' },
  202: { say: 'Silence, and a faint smell of pipe tobacco.', note: 'silence, and the smell of <b>pipe tobacco</b>.' },
  203: { say: 'Someone is humming a waltz.', note: 'someone humming a <b>waltz</b>.' },
  205: { say: 'The scratch of a pen on paper. It stops when you knock.', note: 'the scratch of a <b>pen</b> on paper. It stopped when I knocked.' },
  206: { say: 'Nothing. A "Do Not Disturb" card, dated 6 November.', note: 'nothing; a "Do Not Disturb" card dated 6 November.' },
};

// The corridor, drawn in true one-point perspective: every point is a 3D position
// projected toward a single vanishing point, so doors shrink and space out correctly.
// World units: corridor 2 wide (walls at X = ±1), floor Y = -0.75, ceiling Y = +0.75,
// camera at z = 0 looking down the corridor; the far wall is at z = 6.
const VP = { x: 400, y: 300 }, F = 400;
const P = (X, Y, z) => [Math.round(VP.x + (F * X) / z), Math.round(VP.y - (F * Y) / z)];
const FLOOR = -0.75, CEIL = 0.75, FAR = 6, DOOR_TOP = 0.38, DOOR_W = 0.55;

// odd rooms on the left wall, even rooms on the right, staggered down the corridor
const DOORS = [
  { room: '201', side: 'L', z: 1.35 }, { room: '202', side: 'R', z: 1.95 },
  { room: '203', side: 'L', z: 2.85 }, { room: '204', side: 'R', z: 3.45 },
  { room: '205', side: 'L', z: 4.35 }, { room: '206', side: 'R', z: 4.95 },
];
function doorGeom(d) {
  const X = d.side === 'L' ? -1 : 1, z0 = d.z, z1 = d.z + DOOR_W;
  const corners = [P(X, DOOR_TOP, z0), P(X, DOOR_TOP, z1), P(X, FLOOR, z1), P(X, FLOOR, z0)];
  const frame = [P(X, DOOR_TOP + 0.05, z0 - 0.05), P(X, DOOR_TOP + 0.05, z1 + 0.05), P(X, FLOOR, z1 + 0.05), P(X, FLOOR, z0 - 0.05)];
  return { X, z0, z1, corners, frame, poly: corners.flat() };
}

const corridor = g => {
  const emblem = { 201: 'fern', 202: 'anchor', 203: 'moon', 204: 'swallow', 205: 'bell', 206: 'fox' };
  const poly = pts => pts.map(p => p.join(',')).join(' ');
  const door = d => {
    const { X, z0, z1, corners, frame } = doorGeom(d);
    const zm = (z0 + z1) / 2;
    const [px, py] = P(X, 0.12, zm);               // brass number plate, at eye level on the door
    const s = 0.11 * F / zm;                       // plate size shrinks with distance
    const [hx, hy] = P(X, -0.2, d.side === 'L' ? z1 - 0.07 : z0 + 0.07);
    const panel = (y0, y1) => poly([P(X, y0, z0 + 0.08), P(X, y0, z1 - 0.08), P(X, y1, z1 - 0.08), P(X, y1, z0 + 0.08)]);
    return `
      <polygon points="${poly(frame)}" fill="#2e1c10"/>
      <polygon points="${poly(corners)}" fill="#4a2e1a" stroke="#1e120a" stroke-width="1.5"/>
      <polygon points="${panel(0.3, 0.02)}" fill="none" stroke="#2e1c10" stroke-width="${Math.max(1, s / 14)}"/>
      <polygon points="${panel(-0.08, -0.66)}" fill="none" stroke="#2e1c10" stroke-width="${Math.max(1, s / 14)}"/>
      <rect x="${px - s * 0.5}" y="${py - s * 0.45}" width="${s}" height="${s * 0.9}" rx="${s * 0.08}" fill="url(#brassG)"/>
      ${symAt(EMBLEMS, emblem[d.room], px - s * 0.3, py - s * 0.4, s * 0.6, '#2a1c10')}
      <text x="${px}" y="${py + s * 0.85}" font-size="${s * 0.42}" text-anchor="middle" ${serif} fill="#f0d890">${d.room}</text>
      <circle cx="${hx}" cy="${hy}" r="${Math.max(1.5, s * 0.07)}" fill="url(#brassG)"/>`;
  };
  // wall sconces between the doors, with their pools of light
  const sconces = [2.4, 3.9, 5.4].flatMap(z => [-1, 1].map(X => {
    const [x, y] = P(X, 0.5, z), r = 0.3 * F / z;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#lampGlow)"/>
      <rect x="${x - r * 0.12}" y="${y - r * 0.05}" width="${r * 0.24}" height="${r * 0.28}" fill="#f4dca0" opacity=".9"/>`;
  })).join('');
  const [nl, nt] = P(-1, CEIL, 1), [fl, ft] = P(-1, CEIL, FAR), [, fb] = P(-1, FLOOR, FAR), [nr] = P(1, CEIL, 1), [fr] = P(1, CEIL, FAR);
  const runner = poly([P(-0.45, FLOOR, 1), P(0.45, FLOOR, 1), P(0.45, FLOOR, FAR), P(-0.45, FLOOR, FAR)]);
  return `${DEFS}${ROOM_DEFS}
  <rect width="800" height="600" fill="#1a100a"/>
  <polygon points="${nl},${nt} ${nr},${nt} ${fr},${ft} ${fl},${ft}" fill="#2e1c10"/>
  <polygon points="${nl},${nt} ${fl},${ft} ${fl},${fb} ${nl},600" fill="url(#damask)"/>
  <polygon points="${nr},${nt} ${fr},${ft} ${fr},${fb} ${nr},600" fill="url(#damask)"/>
  <polygon points="${nl},600 ${fl},${fb} ${fr},${fb} ${nr},600" fill="url(#carpet)"/>
  <polygon points="${runner}" fill="#5a1a22"/>
  ${[1.6, 2.6, 3.6, 4.6].map(z => { const [a, y] = P(-1, CEIL, z), [b] = P(1, CEIL, z); return `<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke="#1e120a" stroke-width="${8 / z}"/>`; }).join('')}
  <rect x="${fl}" y="${ft}" width="${fr - fl}" height="${fb - ft}" fill="#24160c"/>
  <rect x="${400 - 16}" y="${fb - 46}" width="32" height="46" fill="#3a2414"/>
  <circle cx="400" cy="${ft + 22}" r="26" fill="url(#lampGlow)"/>
  ${DOORS.map(door).join('')}
  ${sconces}
  ` + finish();
};

const suitcaseCloseup = g => {
  const open = g.flag('lockOpen');
  return deskTop() + `
  <rect x="80" y="120" width="640" height="400" rx="20" fill="#000" opacity=".45" transform="translate(8,10)"/>
  ${open ? `
    <rect x="80" y="300" width="640" height="220" rx="16" fill="#5a3a24" stroke="#2e1c10" stroke-width="4"/>
    <rect x="96" y="316" width="608" height="190" fill="#c8bca0"/>
    <path d="M110 330 q100 30 200 0 t200 10 t180 -6 v160 h-580 Z" fill="#8a9ab0" opacity=".8"/>
    <path d="M120 420 q80 -20 160 6 t200 -10 t200 8" stroke="#5a6a80" stroke-width="3" fill="none"/>
    <polygon points="80,300 720,300 700,90 100,90" fill="#6a4a2e" stroke="#2e1c10" stroke-width="4"/>
    <polygon points="100,110 700,110 712,290 88,290" fill="#8a7050"/>
    <g transform="rotate(6 615 474)">
      <rect x="548" y="452" width="134" height="44" fill="#d8c8a0" stroke="#6a5a3a" stroke-width="1.5"/>
      <text x="615" y="469" font-size="10" text-anchor="middle" font-family="Courier New, monospace" font-weight="bold" fill="#2a1c10">SALTMERE STATION</text>
      <text x="615" y="485" font-size="9" text-anchor="middle" font-family="Courier New, monospace" fill="#2a1c10">PLATFORM · 14 MAY 2019</text>
    </g>
    ${g.solved('r2-message') ? '' : `
      <g transform="rotate(-5 400 380)">
        <rect x="300" y="340" width="200" height="120" fill="#efe6cf" stroke="#8a7a5a" stroke-width="2"/>
        <path d="M300 340 L400 400 L500 340" fill="none" stroke="#8a7a5a" stroke-width="2"/>
        <text x="400" y="436" font-size="20" text-anchor="middle" ${hand} fill="#1f2a5a">For me. In order.</text>
      </g>`}
  ` : `
    <rect x="80" y="120" width="640" height="400" rx="20" fill="#6a3a24" stroke="#2e1c10" stroke-width="4"/>
    <rect x="80" y="300" width="640" height="8" fill="#4a2a18"/>
    <rect x="300" y="72" width="200" height="60" rx="24" fill="none" stroke="#2e1c10" stroke-width="14"/>
    <rect x="270" y="236" width="260" height="140" rx="10" fill="url(#brassG)" stroke="#5a4214" stroke-width="3"/>
    ${LOCK_ORDER.map((id, i) => `<rect x="${284 + (i % 4) * 60}" y="${250 + Math.floor(i / 4) * 60}" width="50" height="50" rx="6" fill="#efe6cf" stroke="#5a4214" stroke-width="2"/>
      <g transform="translate(${289 + (i % 4) * 60},${255 + Math.floor(i / 4) * 60}) scale(1)">${PICS[id].replace(/currentColor/g, '#2a1c10')}</g>`).join('')}
    <g transform="rotate(9 600 220)">
      <rect x="540" y="160" width="160" height="110" fill="#efe6cf" stroke="#8a7a5a" stroke-width="2"/>
      <circle cx="556" cy="176" r="5" fill="#2e1c10"/>
      <g fill="#1f2a5a" ${hand} font-size="15">
        <text x="560" y="204">Only someone who</text>
        <text x="560" y="228">saw yesterday can</text>
        <text x="560" y="252">open this.</text>
      </g>
    </g>`}
  ` + finish();
};

const messageCloseup = g => deskTop() + `
  <g transform="rotate(-1.5 400 300)">
    <rect x="146" y="76" width="520" height="440" fill="#000" opacity=".45"/>
    <rect x="140" y="70" width="520" height="440" fill="#efe6cf"/>
    ${Array.from({ length: 13 }, (_, i) => `<line x1="150" y1="${120 + i * 30}" x2="650" y2="${120 + i * 30}" stroke="#c9d4e4"/>`).join('')}
    <g fill="#1f2a5a" ${hand} font-size="22">
      <text x="170" y="146">If you're reading this, it worked.</text>
      <text x="170" y="196">The hotel took the day, but not me.</text>
      <text x="170" y="246">Don't believe the register.</text>
      <text x="170" y="296">The way out is behind the mirror.</text>
      <text x="170" y="346">Lift the sheet and press the swallow.</text>
      <text x="470" y="440" font-size="20">— you</text>
    </g>
    <path d="M150 110 l40 30 l-30 30 M650 260 l-40 30 l30 30" stroke="#b8a888" stroke-width="1.5" fill="none" opacity=".8"/>
  </g>` + finish();

// ---------------------------------------------------------------- hotspots

const DIFF_NOTES = {
  painting: 'Yesterday a painting of swallows over the sea hung above the bed. Today it is gone.',
  chair: 'Yesterday the armchair stood by the window. Today it is pushed against the wall.',
  mirror: 'Yesterday the mirror was uncovered, and it showed <b>me</b>, holding this camera. Today it is under a sheet.',
  flowers: 'Yesterday the roses on the dresser were fresh. Today they are dead.',
};
const seen = (g, id) => g.hasNote(`diff-${id}`);

const roomHotspots = [
  // --- present
  { id: 'painting-gap', label: 'Pale patch', rect: [322, 98, 156, 120],
    say: 'A pale rectangle on the wallpaper and an empty nail. Something hung here until recently.' },
  { id: 'mirror', label: g => g.flag('messageDone') ? 'Lift the sheet' : 'Covered mirror',
    rect: [50, 104, 112, 220], when: g => !g.flag('sheetLifted'),
    sparkle: g => g.flag('messageDone'),
    click: g => {
      if (!g.flag('messageDone')) return g.say(g.flag('lockOpen')
        ? 'You take hold of the sheet... and stop, your skin prickling. Not until you have read the note in your suitcase.'
        : 'A tall mirror under a sheet. You take hold of the cloth... and stop, your skin prickling. Not yet. Not until you know why it was covered.', 6000);
      g.set('sheetLifted');
      g.note('mirror-now', 'Under the sheet, the mirror shows the room behind me. It does not show me.');
      g.say('You lift the sheet. The mirror shows the bed, the window, the rain. It does not show you. A small brass swallow sits at the top of the frame.', 7000);
    } },
  { id: 'mirror-open', label: 'Mirror', rect: [62, 136, 86, 186], when: g => g.flag('sheetLifted'),
    say: 'The room, reflected perfectly. Everything except you.' },
  { id: 'swallow', label: 'Brass swallow', rect: [86, 108, 38, 32], when: g => g.flag('sheetLifted') && !g.flag('serviceOpen'),
    sparkle: true,
    click: g => {
      g.set('serviceOpen');
      g.say(g.flag('chairMoved')
        ? 'The swallow sinks under your thumb. With a sigh, a section of wallpaper swings inward: a service door.'
        : 'The swallow sinks under your thumb. Something clicks in the wall... and thumps against the back of the armchair.', 6000);
    } },
  { id: 'flowers', label: 'Roses', rect: [104, 276, 56, 50], say: 'Dead roses, petals scattered on the dresser.' },
  { id: 'dresser', label: 'Dresser', rect: [26, 326, 150, 136], say: 'Empty drawers, lined with paper. Not even a stray hair.' },
  { id: 'chair', label: 'Armchair', rect: [168, 340, 102, 132], when: g => !g.flag('chairMoved'),
    sparkle: g => g.flag('serviceOpen'),
    click: g => {
      if (!seen(g, 'chair') && !g.flag('serviceOpen')) return g.say('A heavy armchair, pushed oddly flat against the wall.');
      g.set('chairMoved');
      g.say(g.flag('serviceOpen')
        ? 'You drag the armchair back to the window, where it stood yesterday. Behind it, the service door swings free.'
        : 'You drag the armchair back to the window, where it stood in the photo. The room looks more like yesterday.', 6000);
    } },
  { id: 'chair-window', label: 'Armchair', rect: [640, 340, 102, 132], when: g => g.flag('chairMoved'),
    say: 'Back where it stood yesterday.' },
  { id: 'service', label: 'Service door', rect: [186, 138, 70, 330], when: g => g.flag('serviceOpen') && g.flag('chairMoved'),
    sparkle: true, go: 'r3-breakfast' },
  { id: 'service-blocked', label: 'Service door', rect: [186, 138, 70, 200], when: g => g.flag('serviceOpen') && !g.flag('chairMoved'),
    say: 'The door opens a hand-width, then jams against the armchair.' },
  { id: 'window', label: 'Window', rect: [596, 84, 176, 236], say: 'Rain on the glass. The street lamps below never seem to change.' },
  { id: 'bed', label: 'Bed', rect: [250, 250, 300, 154], say: 'Made with hospital corners. Nobody has slept in it, or someone remade it perfectly.' },
  { id: 'camera', label: 'Camera', rect: [368, 350, 100, 60], take: 'camera',
    say: 'A small camera. Tied to it, a tag in your own handwriting: "LOOK AT THE PHOTOS." You do not remember writing it.' },
  { id: 'phone', label: 'Telephone', rect: [566, 338, 32, 22],
    say: 'You lift the receiver. A dial tone, and very faintly, a waltz.' },
  { id: 'lamp', label: 'Lamp', rect: [534, 280, 40, 74], say: 'A little green lamp, glowing warm.' },
  { id: 'suitcase', label: 'Suitcase', rect: [298, 428, 204, 90], go: 'r2-suitcase', sparkle: g => g.has('camera') && !g.flag('lockOpen') },
  // --- yesterday (the photo)
  ...['painting', 'chair', 'mirror', 'flowers'].map(id => ({
    id: `past-${id}`, era: 'past',
    label: { painting: 'Painting', chair: 'Armchair', mirror: 'Mirror', flowers: 'Roses' }[id],
    rect: { painting: [322, 98, 156, 120], chair: [640, 340, 102, 132], mirror: [56, 108, 98, 214], flowers: [104, 270, 56, 56] }[id],
    sparkle: g => !seen(g, id),
    click: g => {
      g.note(`diff-${id}`, DIFF_NOTES[id]);
      if (id === 'mirror' && g.flag('messageDone') && !g.flag('sheetLifted'))
        return g.say('In yesterday\'s photo the mirror is still uncovered. To lift the sheet, switch back to Today (top right).', 6000);
      g.say(DIFF_NOTES[id].replace(/<\/?b>/g, ''));
    },
  })),
  { id: 'past-room', era: 'past', label: 'Yesterday', rect: [250, 250, 300, 154],
    say: 'The same room, yesterday. The date stamp in the corner glows orange: 6 November.' },
];

// ---------------------------------------------------------------- export

export default {
  id: 'r2',
  name: 'Room 204',
  hints: [
    { when: g => !g.flag('r2Entered'), text: 'Your room is 204. Use your key on its door.' },
    { when: g => !g.flag('took:camera'), text: 'Something is waiting for you on the bed.' },
    { when: g => !g.flag('lockOpen'), text: g => g.difficulty === 'easy'
      ? 'Press "Yesterday" to see the photo, and click what looks different. Four things changed. Once you have found all four, try the suitcase lock.'
      : 'Compare yesterday\'s photo with the room as it is now. Your suitcase only opens for someone who saw yesterday.' },
    { when: g => !g.flag('messageDone'), text: 'Your own note, torn to pieces. Each fragment ends mid-sentence, so look for how they join.' },
    { when: g => !g.flag('sheetLifted'), text: 'Your note told you exactly where to look.' },
    { when: g => !g.flag('serviceOpen'), text: 'Press the swallow on the mirror frame.' },
    { when: g => !g.flag('chairMoved'), text: 'Something is in the way. Put it back where it stood yesterday.' },
    { text: 'The service door is open.' },
  ],

  scenes: {
    'r2-corridor': {
      room: 'r2',
      art: corridor,
      nav: { back: 'r1-reception' },
      hotspots: [
        { id: 'door204', label: 'Room 204', poly: doorGeom(DOORS[3]).poly,
          sparkle: true,
          click: g => g.say('Locked. The brass plate shows a swallow.'),
          use: { key204: g => { g.set('r2Entered'); g.go('r2-room'); g.say('The key turns easily, as if it knows the lock.'); } } },
        ...DOORS.filter(d => d.room !== '204').map(d => ({
          id: `door${d.room}`, label: `Room ${d.room}`, poly: doorGeom(d).poly,
          room: d.room,
          click: g => {
            const heard = CORRIDOR_SOUNDS[d.room];
            g.note(`door-${d.room}`, `Door ${d.room}: ${heard.note}`);
            g.say(heard.say);
          },
          use: { key204: g => g.say("Your key doesn't fit. This isn't your room.") },
        })),
      ],
    },

    'r2-room': {
      room: 'r2',
      art: g => roomArt(g, false),
      past: g => roomArt(g, true),
      nav: { back: 'r2-corridor' },
      enter: g => {
        if (g.flag('messageDone') && !g.flag('sheetLifted') && !g.flag('sheetPrompt')) {
          g.set('sheetPrompt');
          return g.say('Your eyes go to the covered mirror. "Lift the sheet," your note said. Now you know why.', 6000);
        }
        if (g.flag('r2Seen')) return;
        g.set('r2Seen');
        g.say('Room 204. Tidy, warm, and somehow too still. It smells faintly of roses that are not there.', 5000);
      },
      onPast: g => g.note('camera-first', 'The camera holds photos from yesterday. This one of my room is stamped <b>6 Nov, 10.30 pm</b>: I took it myself, late at night. I can compare it with how things are now.'),
      hotspots: roomHotspots,
    },

    'r2-suitcase': {
      room: 'r2',
      art: suitcaseCloseup,
      nav: { back: 'r2-room' },
      hotspots: [
        { id: 'lock', label: 'Picture lock', rect: [266, 232, 268, 148], when: g => !g.flag('lockOpen'),
          sparkle: true, click: g => {
            const found = CHANGED.filter(id => seen(g, id)).length;
            if (found < CHANGED.length) return g.say(g.difficulty === 'hard'
              ? 'Eight little pictures and a latch. "Only someone who saw yesterday can open this."'
              : `Eight little pictures and a latch. "Only someone who saw yesterday can open this." You've spotted ${found} of the changes in yesterday's photo so far.`, 6000);
            g.set('lockOpen'); g.set('solved:r2-lock');
            g.say('You press the four pictures of what changed since yesterday: the painting, the mirror, the roses, the chair. The latch snaps open. Inside, among your folded clothes: an envelope, addressed in your hand.', 7000);
          } },
        { id: 'tag', label: 'Tag', rect: [536, 150, 172, 132], when: g => !g.flag('lockOpen'),
          say: '"Only someone who saw yesterday can open this." Your handwriting again.' },
        // (hotspots listed later sit on top: the clothes must come before the envelope)
        { id: 'clothes', label: 'Clothes', rect: [96, 316, 608, 190], when: g => g.flag('lockOpen'),
          say: 'Your clothes, folded the way you always fold them. One shirt still smells of rain.' },
        { id: 'ticket', label: 'Platform ticket', rect: [540, 446, 150, 56], when: g => g.flag('lockOpen'),
          click: g => {
            g.note('ticket', 'Folded among my clothes: a <b>platform ticket, Saltmere station, 14 May 2019</b>. A platform ticket is for seeing someone off. I can\'t remember who.');
            g.say('A platform ticket: SALTMERE STATION, 14 MAY 2019. For seeing someone off. You can\'t remember who, and something in you flinches away from trying.', 7000);
          } },
        { id: 'envelope', label: 'Open the envelope', rect: [296, 330, 210, 140], when: g => g.flag('lockOpen') && !g.flag('messageDone'),
          sparkle: true, click: g => g.puzzle('r2-message') },
      ],
    },

    'r2-message': { room: 'r2', art: messageCloseup, nav: { back: 'r2-suitcase' }, hotspots: [] },
  },

  puzzles: {
    'r2-message': {
      type: 'order',
      prompt: 'Your own note, torn into pieces. Click them in reading order; click a piece in the note to take it back out.',
      config: g => ({
        items: messageOf(g).map((text, i) => ({ id: `m${i}`, label: text })),
        solution: messageOf(g).map((_, i) => `m${i}`),
      }),
      solution: g => messageOf(g).map((_, i) => `m${i}`),
      okText: 'It reads cleanly now.',
      errText: "That doesn't read right yet. Click a piece in the note to take it back out.",
      seed: 7,
      solve: g => {
        g.set('messageDone');
        g.note('message', 'My own note: <i>"If you\'re reading this, it worked. The hotel took the day, but not me. Don\'t believe the register. The way out is behind the mirror. Lift the sheet and press the swallow."</i>');
        g.go('r2-message');
      },
    },
  },
};

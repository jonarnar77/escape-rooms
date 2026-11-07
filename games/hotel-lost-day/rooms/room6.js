// ROOM 6 — The Lost Day ("The Checkout")
// Purpose: replay yesterday and escape.
// Fact: you came to forget something painful, but chose to keep your memories
// after discovering the cost.
//
//   Everything needed is in this room:
//   1. Reverse the checkout (sequence widget). The hotel's photographs of yesterday hang on
//      the machine, each with a time stamp. The plate says "enter the day backwards, last
//      moment first". Medium/hard add photographs stamped 7 NOV (today), which don't belong.
//      Your jar rolls out of the chute.
//   2. The memory in the jar is a torn photograph (assemble widget): the telegraph wire, the
//      station sign, the train window and the platform run across the tears. Rebuilt, the
//      memory returns; you keep it. The way back to reception opens: morning.
//   optional: release the other guests' jars too, and they walk out with you.
//
// The memory is planted earlier: the swallow painting (room 2), the unused return ticket in
// your suitcase (room 2), and the half-legible line on your agreement (room 5).
// THE MEMORY you came to forget is defined once, below, so it is easy to change.

import { DEFS, closeup, deskTop, finish, rainWindow, lamp, wallClock, hand, serif } from '../art/common.js';
import { EMBLEMS, symAt } from '../art/symbols.js';

// ---------------------------------------------------------------- the memory (change it here)

export const THE_MEMORY = {
  place: 'SALTMERE',
  lines: [
    'A seaside station, in the rain.',
    'Your mother at the train window, waving.',
    'You had argued that morning, about nothing,',
    "and you didn't wave back.",
    'Swallows on the telegraph wire.',
    "She didn't come home.",
  ],
  kept: 'It hurts. It is yours. You keep it.',
};

// ---------------------------------------------------------------- data

// yesterday's decisive moments, in true order, with the hotel's time stamps
const MOMENTS = [
  { id: 'arrive', caption: 'Arriving in the rain', stamp: '6 NOV  7.30 AM' },
  { id: 'sign', caption: 'Signing the agreement', stamp: '6 NOV  8.15 AM' },
  { id: 'breakfast', caption: 'Breakfast, table 3', stamp: '6 NOV  9.00 AM' },
  { id: 'waltz', caption: 'The waltz', stamp: '6 NOV  8.00 PM' },
  { id: 'photos', caption: 'Photographing room 204', stamp: '6 NOV 10.30 PM' },
  { id: 'six', caption: 'Taking the 6', stamp: '6 NOV 11.40 PM' },
];
// photographs from today: they look the same, but don't belong in yesterday
const TODAY = [
  { id: 'wake', caption: 'Waking in room 204', stamp: '7 NOV  7.00 AM' },
  { id: 'bill', caption: 'Reading your bill', stamp: '7 NOV 10.58 AM' },
];
const GUEST_JARS = [
  { id: 'vale', room: '201', emblem: 'fern', who: 'the Vales' },
  { id: 'orme', room: '202', emblem: 'anchor', who: 'Captain Orme' },
  { id: 'ito', room: '203', emblem: 'moon', who: 'Miss Ito' },
  { id: 'brandt', room: '205', emblem: 'bell', who: 'Dr Brandt' },
  { id: 'okonkwo', room: '206', emblem: 'fox', who: 'Mr Okonkwo' },
];
const releasedOf = g => g.get('released') ?? [];

// ---------------------------------------------------------------- small pictures (120 x 90, sepia)

const SCENES = {
  arrive: `<rect width="120" height="90" fill="#8a7a62"/><rect x="40" y="20" width="40" height="64" fill="#3a2e22"/><rect x="45" y="26" width="13" height="54" fill="#5a4a3a"/><rect x="62" y="26" width="13" height="54" fill="#5a4a3a"/>
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${6 + i * 8}" y1="4" x2="${2 + i * 8}" y2="22" stroke="#d8ccb0" stroke-width="1"/>`).join('')}
    <path d="M14 46 q12 -12 24 0 Z" fill="#2a2018"/><path d="M26 46 v20" stroke="#2a2018" stroke-width="2"/><rect x="88" y="66" width="20" height="14" fill="#4a3a2a"/>`,
  sign: `<rect width="120" height="90" fill="#7a6a52"/><rect x="10" y="50" width="100" height="40" fill="#4a3a2a"/><rect x="34" y="36" width="44" height="30" fill="#efe6cf" transform="rotate(-6 56 51)"/>
    <path d="M40 48 h30 M40 54 h22" stroke="#8a7a5a"/><path d="M70 30 l12 30" stroke="#1a1208" stroke-width="3"/><path d="M44 60 q6 -6 10 0 t10 -2" stroke="#2a2a4a" fill="none"/>`,
  breakfast: `<rect width="120" height="90" fill="#9a8a6a"/><rect x="74" y="8" width="38" height="40" fill="#d8ccb0"/><path d="M93 8 v40 M74 28 h38" stroke="#7a6a52" stroke-width="2"/>
    <ellipse cx="54" cy="66" rx="48" ry="16" fill="#efe6cf"/><path d="M30 62 h10 l-1 -8 h-8 Z" fill="#c9a33b"/><ellipse cx="35" cy="52" rx="5" ry="6" fill="#f4e8d0"/>
    <path d="M62 56 h14 l-2 10 h-10 Z" fill="#f8f4ea" stroke="#8a7a5a"/><circle cx="82" cy="58" r="4" fill="#d8c060"/>`,
  waltz: `<rect width="120" height="90" fill="#3a2e2a"/><rect x="20" y="16" width="80" height="44" fill="#5a6a72"/><path d="M20 44 q20 -6 40 0 t40 0 v16 h-80 Z" fill="#2a3a4a"/>
    <rect x="16" y="14" width="10" height="48" fill="#6a2a2a"/><rect x="94" y="14" width="10" height="48" fill="#6a2a2a"/><path d="M0 62 h120 v28 h-120 Z" fill="#5a4a3a"/>
    ${[30, 54, 78].map(x => `<path d="M${x} 72 q6 -10 12 0" stroke="#d8ccb0" stroke-width="2" fill="none"/>`).join('')}<circle cx="60" cy="8" r="6" fill="#f4ecd8"/>`,
  photos: `<rect width="120" height="90" fill="#5a4a3e"/><rect x="18" y="10" width="36" height="66" rx="16" fill="#c9a33b"/><rect x="22" y="14" width="28" height="58" rx="13" fill="#3a4048"/>
    <circle cx="36" cy="34" r="6" fill="#14181c"/><path d="M26 72 q0 -28 10 -32 q10 4 10 32 Z" fill="#14181c"/><rect x="31" y="44" width="10" height="7" fill="#0a0c0e"/>
    <rect x="62" y="50" width="54" height="30" fill="#d8ccb0"/><rect x="62" y="44" width="54" height="10" fill="#4a3a2a"/>`,
  six: `<rect width="120" height="90" fill="#2e2622"/><rect x="34" y="14" width="52" height="60" rx="5" fill="#b8903a"/>
    <rect x="44" y="32" width="14" height="18" fill="#efe6cf"/><rect x="62" y="32" width="14" height="18" fill="#efe6cf"/><text x="69" y="47" font-size="12" text-anchor="middle" font-family="Georgia" fill="#2a1c10">7</text>
    <rect x="40" y="62" width="18" height="22" rx="3" fill="#d8b860" transform="rotate(-20 49 73)"/><text x="49" y="79" font-size="14" text-anchor="middle" font-family="Georgia" font-weight="bold" fill="#2a1c10" transform="rotate(-20 49 73)">6</text>
    <path d="M70 84 q-10 -14 -20 -14" stroke="#d8ccb0" stroke-width="5" fill="none"/>`,
  wake: `<rect width="120" height="90" fill="#6a5a4a"/><rect x="14" y="40" width="92" height="40" fill="#efe6cf"/><rect x="14" y="30" width="92" height="14" rx="4" fill="#4a3a2a"/>
    <rect x="22" y="44" width="30" height="12" rx="5" fill="#f8f4ea"/><path d="M50 52 q20 -6 50 6 v22 h-50 Z" fill="#d8ccb0"/><rect x="88" y="8" width="24" height="26" fill="#8a949a"/>`,
  bill: `<rect width="120" height="90" fill="#7a6a52"/><rect x="0" y="56" width="120" height="34" fill="#4a3a2a"/><rect x="38" y="20" width="44" height="56" fill="#f4efe2" transform="rotate(4 60 48)"/>
    <path d="M44 30 h30 M44 38 h24 M44 46 h30 M44 54 h18" stroke="#8a7a5a" transform="rotate(4 60 48)"/><circle cx="96" cy="22" r="10" fill="#efe6cf" stroke="#2a1c10"/><path d="M96 22 v-7 M96 22 h-4" stroke="#2a1c10"/>`,
};
// a photograph with the hotel's orange date stamp
const photo = m => `<svg viewBox="0 0 120 90" style="display:block">${SCENES[m.id]}
  <rect x="44" y="76" width="74" height="12" fill="#000" opacity=".35"/>
  <text x="116" y="85.5" font-size="9.5" text-anchor="end" font-family="Courier New, monospace" font-weight="bold" fill="#ffa040">${m.stamp}</text></svg>`;

// the memory, as a portrait photograph (300 x 440): the details run across the tears
function memoryPhoto() {
  return `
  <rect width="300" height="440" fill="#7c868c"/>
  ${Array.from({ length: 34 }, (_, i) => `<line x1="${(i * 53) % 300}" y1="${(i * 37) % 200}" x2="${(i * 53) % 300 - 5}" y2="${(i * 37) % 200 + 18}" stroke="#d4dade" stroke-width="1" opacity=".55"/>`).join('')}
  <!-- telegraph pole and wire, with swallows -->
  <rect x="22" y="0" width="9" height="200" fill="#2a2620"/><rect x="8" y="40" width="38" height="5" fill="#2a2620"/>
  <path d="M30 44 Q160 104 300 58" stroke="#1a1a1a" stroke-width="2" fill="none"/>
  ${[[96, 68], [130, 76], [166, 80], [212, 74]].map(([x, y]) => symAt(EMBLEMS, 'swallow', x - 9, y - 16, 18, '#141414')).join('')}
  <!-- station canopy and the sign -->
  <path d="M0 132 L300 118 L300 140 L0 154 Z" fill="#3e3a34"/>
  <path d="M120 140 v14 M226 135 v14" stroke="#2a2620" stroke-width="3"/>
  <rect x="96" y="150" width="156" height="44" fill="#efe6cf" stroke="#2a2620" stroke-width="4"/>
  <text x="174" y="180" font-size="24" text-anchor="middle" font-family="Georgia" letter-spacing="3" fill="#2a2620">${THE_MEMORY.place}</text>
  <!-- the train: carriage with your mother at the window -->
  <rect x="0" y="206" width="300" height="130" fill="#3a3e42"/>
  <rect x="0" y="206" width="300" height="10" fill="#2a2e32"/>
  <rect x="20" y="226" width="80" height="66" rx="6" fill="#9aa4aa"/>
  <rect x="150" y="224" width="110" height="80" rx="6" fill="#a8b2b8"/>
  <circle cx="198" cy="256" r="15" fill="#2a2a2a"/>
  <path d="M174 304 q2 -34 24 -34 q22 0 24 34 Z" fill="#2a2a2a"/>
  <path d="M220 284 q10 -14 16 -34" stroke="#2a2a2a" stroke-width="8" stroke-linecap="round" fill="none"/>
  <circle cx="237" cy="246" r="6" fill="#2a2a2a"/>
  ${Array.from({ length: 8 }, (_, i) => `<line x1="${156 + i * 14}" y1="226" x2="${150 + i * 14}" y2="300" stroke="#e8eef2" stroke-width="1" opacity=".5"/>`).join('')}
  <rect x="0" y="316" width="300" height="8" fill="#2a2e32"/>
  <!-- platform: the yellow edge, puddles, and you, hands in pockets -->
  <rect x="0" y="336" width="300" height="104" fill="#4e4c48"/>
  <rect x="0" y="340" width="300" height="7" fill="#c8b450"/>
  <ellipse cx="70" cy="404" rx="40" ry="6" fill="#8a949a" opacity=".6"/><ellipse cx="240" cy="420" rx="30" ry="5" fill="#8a949a" opacity=".6"/>
  <circle cx="150" cy="320" r="13" fill="#141414"/>
  <path d="M130 432 L134 340 q16 -10 32 0 L170 432 Z" fill="#141414"/>`;
}
// the hotel's look-alike pieces, slipped in among yours
const HALCYON_PHOTO = `
  <rect width="300" height="440" fill="#8a7a62"/>
  <rect x="30" y="60" width="240" height="380" fill="#4a3a2a"/>
  ${[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3].map(c => `<rect x="${50 + c * 56}" y="${80 + r * 64}" width="30" height="40" fill="#d8ccb0"/>`).join('')).join('')}
  <rect x="120" y="360" width="60" height="80" fill="#2a2018"/>
  <text x="150" y="44" font-size="22" text-anchor="middle" font-family="Georgia" letter-spacing="3" fill="#2a1c10">THE HALCYON</text>`;
const BALLROOM_PHOTO = `
  <rect width="300" height="440" fill="#3a2e2a"/>
  <circle cx="150" cy="60" r="34" fill="#f4ecd8" opacity=".8"/>
  ${[90, 120, 150, 180, 210].map(x => `<path d="M${x} 96 v24" stroke="#d8ccb0" stroke-width="2"/>`).join('')}
  <rect x="0" y="300" width="300" height="140" fill="#6a5a3a"/>
  ${[40, 120, 200].map(x => `<path d="M${x} 300 v-90 q30 -30 60 0 v90" fill="#1a1410"/>`).join('')}`;

// ---------------------------------------------------------------- main scene

function checkoutArt(g) {
  const reversed = g.flag('reversed');
  const kept = g.flag('memoryKept');
  const released = releasedOf(g);
  return `${DEFS}
  <rect width="800" height="600" fill="#120e0c"/>
  ${[0, 1, 2, 3].map(i => `<path d="M${i * 220 - 20} 600 V180 a110 110 0 0 1 220 0 V600" fill="none" stroke="#2a221c" stroke-width="16"/>`).join('')}
  <rect y="470" width="800" height="130" fill="#1e1814"/>
  <circle cx="400" cy="200" r="260" fill="url(#lampGlow)" opacity=".35"/>

  <!-- the hotel's photographs on a line -->
  <path d="M30 104 Q150 136 270 110" stroke="#8a7a5a" stroke-width="2" fill="none"/>
  ${[0, 1, 2, 3, 4, 5].map(i => {
    const x = 40 + i * 37, y = 112 + Math.sin(i / 5 * Math.PI) * 14;
    return `<g transform="translate(${x},${y}) rotate(${[-6, 4, -3, 5, -4, 3][i]})"><rect width="32" height="26" fill="#efe6cf"/><rect x="2" y="2" width="28" height="18" fill="#7a6a52"/><rect x="20" y="16" width="10" height="3" fill="#ffa040"/><rect x="12" y="-4" width="6" height="8" fill="#c9a33b"/></g>`;
  }).join('')}

  <!-- the checkout machine -->
  <rect x="270" y="300" width="260" height="170" rx="8" fill="url(#woodG)" stroke="#1e120a" stroke-width="3"/>
  <circle cx="400" cy="200" r="104" fill="#2a2018" stroke="url(#brassG)" stroke-width="8"/>
  ${Array.from({ length: 24 }, (_, i) => `<rect x="396" y="88" width="8" height="14" fill="url(#brassG)" transform="rotate(${i * 15} 400 200)"/>`).join('')}
  <circle cx="400" cy="200" r="70" fill="#efe6cf"/>
  <text x="400" y="170" font-size="14" text-anchor="middle" ${serif} letter-spacing="4" fill="#2a1c10">CHECKOUT</text>
  ${[...Array(12)].map((_, i) => `<line x1="400" y1="140" x2="400" y2="148" transform="rotate(${i * 30} 400 200)" stroke="#2a1c10" stroke-width="2"/>`).join('')}
  <line x1="400" y1="200" x2="400" y2="${reversed ? 146 : 150}" transform="rotate(${reversed ? -40 : 40} 400 200)" stroke="#a3221c" stroke-width="5" stroke-linecap="round"/>
  <circle cx="400" cy="200" r="7" fill="url(#brassG)"/>
  <text x="400" y="240" font-size="11" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">${reversed ? 'reversed' : 'awaiting the day'}</text>
  <rect x="300" y="318" width="200" height="64" fill="url(#brassG)" stroke="#5a4214" stroke-width="2"/>
  <text x="400" y="340" font-size="10" text-anchor="middle" ${serif} letter-spacing="1" fill="#2a1c10">TO REVERSE A CHECKOUT</text>
  <text x="400" y="356" font-size="10" text-anchor="middle" ${serif} letter-spacing="1" fill="#2a1c10">ENTER THE DAY BACKWARDS,</text>
  <text x="400" y="372" font-size="10" text-anchor="middle" ${serif} letter-spacing="1" fill="#2a1c10">LAST MOMENT FIRST.</text>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${306 + (i % 4) * 48}" y="${394 + Math.floor(i / 4) * 30}" width="40" height="24" rx="4" fill="#d8c58a" stroke="#2a1c10"/>`).join('')}

  <!-- conveyor of jars, and the chute -->
  <rect x="150" y="478" width="520" height="14" fill="#3a3a3a"/>
  ${Array.from({ length: 11 }, (_, i) => `<circle cx="${160 + i * 50}" cy="485" r="5" fill="#5a5a5a"/>`).join('')}
  ${[170, 230, 470, 630].map(x => `<rect x="${x}" y="452" width="22" height="26" rx="4" fill="#bfe0e8" opacity=".4" stroke="#e8f6ff"/><circle cx="${x + 11}" cy="466" r="5" fill="#c8e8ff" opacity=".8"/>`).join('')}
  <polygon points="540,420 610,420 600,470 550,470" fill="#2a2018" stroke="url(#brassG)" stroke-width="2"/>
  ${reversed && !kept ? `<rect x="562" y="434" width="26" height="30" rx="5" fill="#ffe7a0" opacity=".6" stroke="#fff6c8"/><circle cx="575" cy="449" r="7" fill="#ffe090" filter="url(#hGlow)"/>` : ''}

  <!-- shelves of other people's days, dim -->
  <rect x="604" y="176" width="168" height="294" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  ${[0, 1, 2, 3].map(r => `<rect x="610" y="${236 + r * 64}" width="156" height="6" fill="#3a2414"/>
    ${[0, 1, 2, 3, 4].map(c => `<rect x="${618 + c * 30}" y="${206 + r * 64}" width="20" height="30" rx="4" fill="#bfe0e8" opacity=".18" stroke="#e8f6ff" stroke-opacity=".3"/>`).join('')}`).join('')}

  <!-- the other guests' jars, returned when the machine runs backwards -->
  ${reversed ? `<rect x="610" y="518" width="184" height="10" fill="#3a2414"/>
    ${GUEST_JARS.map((j, i) => released.includes(j.id) ? '' : `<rect x="${616 + i * 36}" y="486" width="28" height="32" rx="5" fill="#bfe0e8" opacity=".5" stroke="#e8f6ff"/>
      <circle cx="${630 + i * 36}" cy="502" r="6" fill="#c8e8ff" filter="url(#hGlow)"/>${symAt(EMBLEMS, j.emblem, 621 + i * 36, 528, 18, '#c8b890')}`).join('')}` : ''}

  <!-- the way back: a door of light once you keep your memory -->
  ${kept ? `<rect x="40" y="226" width="130" height="244" fill="#fff4d0" opacity=".9"/>
    <rect x="40" y="226" width="130" height="244" fill="url(#lampGlow)"/>
    <text x="105" y="214" font-size="11" text-anchor="middle" ${serif} letter-spacing="2" fill="#f0d890">RECEPTION · MORNING</text>` : ''}
  ` + finish();
}

// ---------------------------------------------------------------- close-ups

// the memory: the rebuilt photograph, and what it means
const memory = () => `${DEFS}
  <rect width="800" height="600" fill="#1a1612"/>
  <g transform="translate(56 40) rotate(-2 150 220)">
    <rect x="-12" y="-12" width="324" height="464" fill="#efe6cf"/>
    ${memoryPhoto()}
  </g>
  <g ${serif} fill="#f4ecd8" font-size="17" font-style="italic">
    ${THE_MEMORY.lines.map((l, i) => `<text x="408" y="${120 + i * 34}">${l}</text>`).join('')}
  </g>
  <rect x="600" y="470" width="170" height="56" rx="6" fill="#efe6cf" stroke="#c9a33b" stroke-width="3"/>
  <text x="685" y="505" font-size="18" text-anchor="middle" ${serif} fill="#2a1c10">Keep it</text>
  <rect width="800" height="600" fill="url(#hVignette)"/>`;

const morning = g => `${DEFS}
  <rect width="800" height="600" fill="#000"/>
  <rect width="800" height="336" fill="url(#damask)"/>
  <rect width="800" height="336" fill="#ffe8b0" opacity=".14"/>
  <rect width="800" height="26" fill="#2e1c10"/><rect y="26" width="800" height="5" fill="url(#brassG)"/>
  <rect y="330" width="800" height="140" fill="url(#woodG)"/>
  <rect y="466" width="800" height="134" fill="url(#marble)"/><rect y="466" width="800" height="134" fill="#fff4d0" opacity=".08"/>
  <!-- the window: daylight, no rain -->
  <rect x="28" y="88" width="92" height="242" fill="#3a2414"/>
  <rect x="36" y="96" width="76" height="226" fill="#c8d8e4"/>
  <ellipse cx="70" cy="140" rx="30" ry="12" fill="#f4f8fc"/><ellipse cx="90" cy="200" rx="22" ry="9" fill="#f4f8fc"/>
  ${[50, 66].map(x => symAt(EMBLEMS, 'swallow', x, 160 + (x % 3) * 10, 12, '#3a3a4a')).join('')}
  <rect x="72" y="96" width="4" height="226" fill="#3a2414"/><rect x="36" y="196" width="76" height="4" fill="#3a2414"/>
  <!-- the front doors, open onto the street -->
  <path d="M150 168 a50 34 0 0 1 100 0 Z" fill="#c8d8e4" stroke="url(#brassG)" stroke-width="5"/>
  <rect x="150" y="168" width="100" height="302" fill="#d8e0e4"/>
  <rect x="150" y="168" width="100" height="160" fill="#9aa8b0"/>
  <rect x="158" y="190" width="24" height="120" fill="#6a747a"/><rect x="214" y="210" width="30" height="100" fill="#7a848a"/>
  <rect x="150" y="320" width="100" height="40" fill="#5a6064"/><rect x="164" y="300" width="70" height="24" rx="6" fill="#8a3a2a"/>
  <circle cx="176" cy="326" r="5" fill="#2a2a2a"/><circle cx="222" cy="326" r="5" fill="#2a2a2a"/>
  <rect x="150" y="360" width="100" height="110" fill="#6a6e70"/>
  <ellipse cx="200" cy="440" rx="30" ry="6" fill="#c8d8e4" opacity=".6"/>
  ${[172, 232].map(x => `<circle cx="${x}" cy="372" r="5" fill="#2a2a2a"/><path d="M${x - 6} 400 v-24 h12 v24" fill="#2a2a2a"/>`).join('')}
  <polygon points="150,168 128,176 128,462 150,470" fill="#2e1c10" stroke="url(#brassG)" stroke-width="2"/>
  <polygon points="250,168 272,176 272,462 250,470" fill="#2e1c10" stroke="url(#brassG)" stroke-width="2"/>
  ${wallClock(375, 92, 24, 11, 0)}
  <rect x="584" y="112" width="62" height="86" fill="#efe6cf" stroke="#8a7a5a" stroke-width="2"/>
  <rect x="584" y="112" width="62" height="22" fill="#7a1e22"/>
  <text x="615" y="128" font-size="12" text-anchor="middle" ${serif} letter-spacing="2" fill="#f4efe2">NOV</text>
  <text x="615" y="182" font-size="44" text-anchor="middle" ${serif} fill="#2a1c10">7</text>
  <!-- desk with the final bill -->
  <rect x="326" y="324" width="330" height="14" fill="#6a4a2e"/><rect x="340" y="338" width="302" height="132" fill="url(#woodG)"/>
  <rect x="440" y="300" width="60" height="26" fill="#f4efe2" transform="rotate(-4 470 313)"/>
  <path d="M446 308 h44 M446 314 h30" stroke="#8a7a5a" transform="rotate(-4 470 313)"/>
  <path d="M522 323 a12 11 0 0 1 24 0 Z" fill="url(#brassG)"/>
  ${lamp(612, 284, 0.85)}
  <rect width="800" height="600" fill="url(#hVignette)" opacity=".6"/>`;

const bill = () => deskTop() + `
  <g transform="rotate(-2 400 300)">
    <rect x="236" y="46" width="340" height="500" fill="#000" opacity=".4"/>
    <rect x="230" y="40" width="340" height="500" fill="#f4efe2"/>
    <text x="400" y="88" font-size="24" text-anchor="middle" ${serif} letter-spacing="3" fill="#2a2018">THE HALCYON</text>
    <text x="400" y="112" font-size="12" text-anchor="middle" font-family="Courier New, monospace" fill="#5a4a3a">FINAL ACCOUNT · ROOM 204</text>
    <line x1="250" y1="126" x2="550" y2="126" stroke="#8a7a5a"/>
    ${[['Breakfast for two, table 3', '24.00'], ['Dinner, Garden Room', '38.50'], ['Room, one night', '140.00'], ['One day surrendered', 'RETURNED']].map(([d, a], i) => `
      <text x="256" y="${164 + i * 30}" font-size="14" ${serif} fill="#2a2018">${d}</text>
      <text x="544" y="${164 + i * 30}" font-size="13" text-anchor="end" font-family="Courier New, monospace" fill="#2a2018" ${a === 'RETURNED' ? 'font-weight="bold"' : ''}>${a}</text>`).join('')}
    <line x1="250" y1="290" x2="550" y2="290" stroke="#8a7a5a"/>
    <text x="400" y="360" font-size="26" text-anchor="middle" ${serif} fill="#2a2018">Balance settled.</text>
    <text x="400" y="400" font-size="26" text-anchor="middle" ${serif} fill="#2a2018">Nothing forgotten.</text>
    ${symAt(EMBLEMS, 'swallow', 380, 440, 40, '#2a3a5a')}
  </g>` + finish();

// ---------------------------------------------------------------- helpers

function ending(g) {
  const all = GUEST_JARS.every(j => releasedOf(g).includes(j.id));
  return `You step out of the Halcyon into the morning. The street is wet and loud: a tram bell, a newspaper seller,
    someone laughing under an umbrella. Above the rooftops, swallows.<br><br>
    ${all ? `Behind you, one by one, the other guests come out into the light: the Vales arm in arm, Captain Orme
      lighting his pipe, Dr Brandt, Mr Okonkwo, and Miss Ito, who looks up at the sky as if she has never seen it.<br><br>` : ''}
    You remember the station, and the rain, and the wave you didn't give.<br>
    It hurts. It is yours.`;
}

// ---------------------------------------------------------------- export

const openJar = g => g.solved('r6-pieces') ? g.go('r6-memory') : g.puzzle('r6-pieces');

export default {
  id: 'r6',
  name: 'The Lost Day',
  hints: [
    { when: g => !g.flag('reversed'), text: g => g.difficulty === 'easy'
      ? 'Each photograph on the machine has a time stamp. Enter them latest first: start with 11.40 pm, end with 7.30 am.'
      : g.difficulty === 'medium'
        ? 'Read the time stamps on the photographs, and the plate on the machine. Only yesterday (6 NOV) goes in.'
        : 'Read the plate on the machine, and the stamps on the photographs.' },
    { when: g => !g.solved('r6-pieces'), text: g => g.difficulty === 'easy'
      ? 'Your jar rolled out of the chute. The memory inside is torn: the wire, the sign, the window and the platform each run across a tear.'
      : 'Your jar rolled out of the chute.' },
    { when: g => !g.flag('memoryKept'), text: 'Look at the memory again. Will you keep it?' },
    { text: 'The way back to reception is open. It is morning.' },
  ],

  scenes: {
    'r6-lostday': {
      room: 'r6',
      art: checkoutArt,
      nav: { back: 'r5-office' },
      enter: g => {
        if (g.flag('r6Seen')) return;
        g.set('r6Seen');
        g.say('A vaulted room beneath everything. In the middle, a great brass machine with a dial: CHECKOUT. Jars of light creep along a conveyor into its mouth.', 7000);
      },
      hotspots: [
        { id: 'photos', label: "The hotel's photographs", rect: [26, 96, 254, 70],
          click: g => g.flag('reversed')
            ? g.say('Yesterday, in six photographs, each with the hotel\'s time stamp.')
            : g.puzzle('r6-reverse') },
        { id: 'shelves', label: "Other people's days", rect: [600, 172, 176, 302],
          say: 'Jars on jars, each labelled with a date and a room. Some are so old the light has gone grey.' },
        { id: 'machine', label: g => g.flag('reversed') ? 'Checkout machine (reversed)' : 'Checkout machine',
          rect: [270, 92, 260, 380], sparkle: g => !g.flag('reversed'),
          click: g => g.flag('reversed') ? g.say('The dial points backwards now. The machine is quiet.') : g.puzzle('r6-reverse') },
        { id: 'jar', label: '6 NOV · 204', rect: [552, 424, 50, 46], when: g => g.flag('reversed') && !g.flag('memoryKept'),
          sparkle: true, click: openJar },
        ...GUEST_JARS.map((j, i) => ({
          id: `guest-${j.id}`, label: `Jar: room ${j.room}`, rect: [614 + i * 36, 484, 34, 64],
          when: g => g.flag('reversed') && !releasedOf(g).includes(j.id),
          click: g => {
            g.set('released', [...releasedOf(g), j.id]);
            const left = GUEST_JARS.length - releasedOf(g).length;
            g.say(left
              ? `You unseal the jar for ${j.who}. The light rises and drifts up through the ceiling, home. (${left} left)`
              : `You unseal the last jar, for ${j.who}. Somewhere above, five doors open at once.`, 6000);
          } })),
        { id: 'exit', label: 'To reception: morning', rect: [40, 226, 130, 244], when: g => g.flag('memoryKept'), sparkle: true, go: 'r6-morning' },
      ],
    },

    'r6-memory': {
      room: 'r6', art: memory, nav: { back: 'r6-lostday' },
      enter: g => g.note('memory', `What I came here to forget: <i>${THE_MEMORY.lines.join(' ')}</i>`),
      hotspots: [
        { id: 'keep', label: 'Keep it', rect: [596, 466, 178, 64], sparkle: true,
          click: g => {
            g.set('memoryKept');
            g.note('kept', 'I kept it.');
            g.go('r6-lostday');
            g.say(`${THE_MEMORY.kept} In the far wall, a door of morning light opens.`, 7000);
          } },
      ],
    },

    'r6-morning': {
      room: 'r6', art: morning, nav: { back: 'r6-lostday' },
      enter: g => {
        if (g.flag('morningSeen')) return;
        g.set('morningSeen');
        g.say('Reception. Daylight, for the first time. The clock reads eleven, and the minute hand is moving. The front doors stand open onto a real street.', 7000);
      },
      hotspots: [
        { id: 'billpaper', label: 'Your bill', rect: [434, 292, 72, 38], go: 'r6-bill', sparkle: g => !g.flag('billRead') },
        { id: 'bell', label: 'Service bell', rect: [518, 306, 32, 20],
          say: 'Ding. A young clerk you have never seen looks up from a ledger and smiles. "Checking out?"' },
        { id: 'clock', label: 'Clock', circle: [375, 92, 30], say: 'Eleven o\'clock, and then a minute past. Time is moving again.' },
        { id: 'window', label: 'Window', rect: [28, 88, 92, 242], say: 'The rain has stopped. Swallows over the rooftops.' },
        { id: 'frontdoor', label: 'Out into the morning', rect: [128, 128, 144, 342], sparkle: true,
          click: g => { g.set('escaped'); g.win(ending(g)); } },
      ],
    },

    'r6-bill': {
      room: 'r6', art: bill, nav: { back: 'r6-morning' },
      enter: g => { g.set('billRead'); g.note('bill', 'Final account: <b>"Balance settled. Nothing forgotten."</b>'); },
      hotspots: [],
    },
  },

  puzzles: {
    'r6-reverse': {
      type: 'sequence',
      prompt: g => g.difficulty === 'easy'
        ? 'TO REVERSE A CHECKOUT: ENTER THE DAY BACKWARDS, LAST MOMENT FIRST. <br><small>The hotel\'s photographs of yesterday, each with its time stamp.</small>'
        : 'TO REVERSE A CHECKOUT: ENTER THE DAY BACKWARDS, LAST MOMENT FIRST. <br><small>The hotel photographs everything. Only yesterday goes in.</small>',
      config: g => {
        const extra = g.difficulty === 'easy' ? [] : g.difficulty === 'medium' ? TODAY.slice(0, 1) : TODAY;
        const shuffled = ['photos', 'wake', 'arrive', 'six', 'breakfast', 'bill', 'sign', 'waltz']
          .map(id => [...MOMENTS, ...extra].find(m => m.id === id)).filter(Boolean);
        return { buttons: shuffled.map(m => ({ id: m.id, label: photo(m), name: m.caption })) };
      },
      solution: [...MOMENTS].reverse().map(m => m.id),
      columns: 4,
      width: 600,
      picSize: [120, 90],
      okText: 'REVERSING',
      errText: 'THE DAY DOES NOT RUN THAT WAY',
      solve: g => {
        g.set('reversed');
        g.effect('shutter');
        g.note('yesterday', 'Yesterday: <b>arriving 7.30 am → signing 8.15 am → breakfast 9.00 am → the waltz 8.00 pm → photographing my room 10.30 pm → taking the 6 at 11.40 pm</b>.');
        g.say('The great dial swings backwards. The conveyor shudders to a stop, then runs the other way, and out of the chute rolls a single warm jar: 6 NOV · 204. Behind it come five more.', 8000);
      },
    },

    'r6-pieces': {
      type: 'assemble',
      prompt: g => `Inside the jar, a photograph, torn to pieces.${g.difficulty === 'easy' ? '' : ' Some of the pieces are not yours.'} Click a piece, then click where it goes.`,
      width: 300, height: 440,
      art: memoryPhoto(),
      cuts: [88, 176, 264, 352],
      seed: 9,
      config: g => ({
        fixed: g.difficulty === 'easy' ? [0] : [],
        decoys: g.difficulty === 'easy' ? []
          : g.difficulty === 'medium' ? [{ art: HALCYON_PHOTO, strip: 2 }]
            : [{ art: HALCYON_PHOTO, strip: 2 }, { art: BALLROOM_PHOTO, strip: 3 }],
      }),
      solve: g => {
        g.go('r6-memory');
        g.say('The pieces knit together, and the photograph is warm in your hands. You remember.', 6000);
      },
    },
  },
};

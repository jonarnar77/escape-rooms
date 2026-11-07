// ROOM 6 — The Lost Day ("The Checkout")
// Purpose: replay yesterday's decisive moments and escape.
// Fact: you came to forget something painful, but chose to keep your memories
// after discovering the cost.
//
//   1. Yesterday, in order: six photographs on a line (order widget). Clues: your notes
//      (arrival, the 8.15 agreement, breakfast, the evening waltz, the 11.40 pm revocation)
//      and, on easy/medium, a clock with a sun or moon in each picture.
//   2. Yours, or the hotel's: a memory cabinet of eight memories (select widget). The four
//      the hotel planted are all dated 6 November, like the forged register. Keep yours.
//   3. Reverse the checkout (needs 1 and 2): the plate says "enter the day backwards, last
//      moment first" -> the six moments in reverse (sequence widget). Your jar rolls out;
//      the memory returns; you keep it. The way back to reception opens: morning.
//   optional: release the other guests' jars too, and they walk out with you.
//
// THE MEMORY you came to forget is defined once, below, so it is easy to change.

import { DEFS, closeup, deskTop, finish, rainWindow, lamp, wallClock, hand, serif } from '../art/common.js';
import { EMBLEMS, symAt } from '../art/symbols.js';

// ---------------------------------------------------------------- the memory (change it here)

const THE_MEMORY = {
  caption: 'A seaside station in the rain',
  date: '14 May 2019',
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

// yesterday's decisive moments, in true order
const MOMENTS = [
  { id: 'arrive', caption: 'Arriving in the rain', time: [7, 30], day: true },
  { id: 'sign', caption: 'Signing the agreement', time: [8, 15], day: true },
  { id: 'breakfast', caption: 'Breakfast, table 3', time: [9, 0], day: true },
  { id: 'waltz', caption: 'The waltz', time: [8, 0], day: false },
  { id: 'photos', caption: 'Photos in room 204', time: [10, 30], day: false },
  { id: 'six', caption: 'Taking the 6', time: [11, 40], day: false },
];
const MEMORIES = [
  { id: 'station', caption: THE_MEMORY.caption, date: THE_MEMORY.date, mine: true },
  { id: 'bicycle', caption: 'Learning to ride a bicycle', date: 'June 1990', mine: true },
  { id: 'teacup', caption: 'A swallow-patterned teacup', date: '3 Jan 2001', mine: true },
  { id: 'letter', caption: 'A letter never sent', date: 'Dec 2024', mine: true },
  { id: 'firststay', caption: 'Your first stay at the Halcyon', date: '6 Nov 1995', mine: false },
  { id: 'dancing', caption: 'Dancing in the Halcyon ballroom', date: '6 Nov 2004', mine: false },
  { id: 'toast', caption: 'Toasting your twentieth visit', date: '6 Nov 2015', mine: false },
  { id: 'tablethree', caption: 'Your usual window table, as always', date: '6 Nov 2023', mine: false },
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

function miniClock(x, y, [h, m], day) {
  return `<g transform="translate(${x},${y})">
    <circle r="11" fill="#f4ecd8" stroke="#5a4a3a" stroke-width="1.5"/>
    <line y2="-6" transform="rotate(${(h % 12) * 30 + m / 2})" stroke="#2a1c10" stroke-width="2"/>
    <line y2="-9" transform="rotate(${m * 6})" stroke="#2a1c10" stroke-width="1.2"/>
    ${day ? `<circle cx="17" cy="-6" r="4" fill="#5a4a3a"/>` : `<path d="M19 -10 a5 5 0 1 0 0 8 a4 4 0 1 1 0 -8 Z" fill="#5a4a3a"/>`}
  </g>`;
}
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
};
const MEMORY_PICS = {
  station: `<rect width="120" height="90" fill="#6a7278"/><rect x="0" y="58" width="120" height="32" fill="#4a4a48"/><rect x="10" y="30" width="96" height="30" rx="4" fill="#3a3e42"/>
    <rect x="62" y="36" width="20" height="14" fill="#9aa4aa"/><path d="M70 44 l4 -6" stroke="#2a2a2a" stroke-width="2"/><path d="M0 18 h120" stroke="#2a2a2a"/>
    ${[20, 34, 48].map(x => symAt(EMBLEMS, 'swallow', x, 8, 10, '#1a1a1a')).join('')}
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${8 + i * 10}" y1="20" x2="${4 + i * 10}" y2="32" stroke="#c8d0d4" stroke-width=".8"/>`).join('')}`,
  bicycle: `<rect width="120" height="90" fill="#a89a7a"/><circle cx="38" cy="62" r="16" fill="none" stroke="#2a2018" stroke-width="3"/><circle cx="84" cy="62" r="16" fill="none" stroke="#2a2018" stroke-width="3"/>
    <path d="M38 62 L56 40 L84 62 M56 40 L72 40 M50 34 h10" stroke="#2a2018" stroke-width="3" fill="none"/><circle cx="98" cy="16" r="8" fill="#5a4a3a"/>`,
  teacup: `<rect width="120" height="90" fill="#9a8a6e"/><ellipse cx="60" cy="72" rx="34" ry="8" fill="#efe6cf"/><path d="M36 40 h48 l-6 30 h-36 Z" fill="#f4ecd8" stroke="#8a7a5a"/>
    <path d="M84 46 q14 0 10 14 q-4 6 -12 4" stroke="#8a7a5a" stroke-width="3" fill="none"/>${symAt(EMBLEMS, 'swallow', 50, 46, 20, '#2a3a5a')}`,
  letter: `<rect width="120" height="90" fill="#7a6a58"/><rect x="22" y="22" width="76" height="48" fill="#efe6cf" stroke="#8a7a5a" transform="rotate(-6 60 46)"/>
    <path d="M22 22 L60 50 L98 22" fill="none" stroke="#8a7a5a" transform="rotate(-6 60 46)"/><rect x="80" y="26" width="12" height="14" fill="#8a3a3a" transform="rotate(-6 60 46)"/>`,
  firststay: `<rect width="120" height="90" fill="#8a7a62"/><rect x="20" y="20" width="80" height="62" fill="#4a3a2a"/><rect x="48" y="50" width="24" height="32" fill="#2a2018"/>
    ${[28, 46, 64, 82].map(x => `<rect x="${x - 4}" y="28" width="10" height="12" fill="#d8ccb0"/>`).join('')}<text x="60" y="16" font-size="8" text-anchor="middle" font-family="Georgia" fill="#2a1c10">THE HALCYON</text>`,
  dancing: `<rect width="120" height="90" fill="#3a2e2a"/><circle cx="60" cy="14" r="10" fill="#f4ecd8"/>${[44, 52, 60, 68, 76].map(x => `<path d="M${x} 20 v6" stroke="#d8ccb0"/>`).join('')}
    <path d="M0 64 h120 v26 h-120 Z" fill="#6a5a3a"/><path d="M50 64 v-20 q10 -10 20 0 v20" fill="#1a1410"/>`,
  toast: `<rect width="120" height="90" fill="#7a6a52"/>${[44, 76].map(x => `<path d="M${x - 10} 24 h20 l-6 22 h-8 Z" fill="#efe6cf" stroke="#8a7a5a"/><path d="M${x} 46 v20 M${x - 8} 66 h16" stroke="#8a7a5a" stroke-width="2"/>`).join('')}
    <text x="60" y="84" font-size="9" text-anchor="middle" font-family="Georgia" fill="#2a1c10">20</text>`,
  tablethree: `<rect width="120" height="90" fill="#9a8a6a"/><ellipse cx="60" cy="62" rx="48" ry="18" fill="#efe6cf"/><text x="60" y="66" font-size="16" text-anchor="middle" font-family="Georgia" fill="#2a1c10">3</text>`,
};
const pic = (inner, w = 120, h = 90) => `<svg viewBox="0 0 120 90" width="${w}" height="${h}" style="display:block">${inner}</svg>`;

// icons for the machine's sequence panel (40 x 40)
const MOMENT_ICONS = {
  arrive: `<path d="M4 20 a16 14 0 0 1 32 0 Z" fill="#2a1c10"/><path d="M20 20 v12 q0 4 -4 4 q-3 0 -3 -3" stroke="#2a1c10" stroke-width="2.5" fill="none"/>`,
  sign: `<path d="M8 32 L30 6 l4 4 L12 36 Z" fill="#2a1c10"/><path d="M6 36 l4 -6" stroke="#2a1c10" stroke-width="2"/>`,
  breakfast: `<path d="M8 14 h20 l-3 18 h-14 Z" fill="#2a1c10"/><path d="M28 18 q8 0 6 8 q-2 4 -8 3" stroke="#2a1c10" stroke-width="2.5" fill="none"/><ellipse cx="18" cy="34" rx="14" ry="3" fill="#2a1c10"/>`,
  waltz: `<path d="M14 30 V8 l16 -4 V26" stroke="#2a1c10" stroke-width="3" fill="none"/><ellipse cx="10" cy="30" rx="5" ry="4" fill="#2a1c10"/><ellipse cx="26" cy="26" rx="5" ry="4" fill="#2a1c10"/>`,
  photos: `<rect x="4" y="12" width="32" height="22" rx="3" fill="#2a1c10"/><rect x="10" y="8" width="8" height="5" fill="#2a1c10"/><circle cx="21" cy="23" r="7" fill="#efe6cf"/><circle cx="21" cy="23" r="4" fill="#2a1c10"/>`,
  six: `<rect x="8" y="4" width="24" height="32" rx="4" fill="#2a1c10"/><text x="20" y="30" font-size="24" text-anchor="middle" font-family="Georgia" font-weight="bold" fill="#efe6cf">6</text>`,
  key: `<circle cx="12" cy="20" r="7" fill="none" stroke="#2a1c10" stroke-width="3"/><path d="M19 20 h16 M30 20 v6 M34 20 v4" stroke="#2a1c10" stroke-width="3"/>`,
  bell: EMBLEMS.bell.replace(/currentColor/g, '#2a1c10'),
};
const iconSvg = id => `<svg viewBox="0 0 40 40">${MOMENT_ICONS[id]}</svg>`;

// ---------------------------------------------------------------- main scene

function checkoutArt(g) {
  const reversed = g.flag('reversed');
  const kept = g.flag('memoryKept');
  const ready = g.flag('photosDone') && g.flag('memoriesDone');
  const released = releasedOf(g);
  return `${DEFS}
  <rect width="800" height="600" fill="#120e0c"/>
  ${[0, 1, 2, 3].map(i => `<path d="M${i * 220 - 20} 600 V180 a110 110 0 0 1 220 0 V600" fill="none" stroke="#2a221c" stroke-width="16"/>`).join('')}
  <rect y="470" width="800" height="130" fill="#1e1814"/>
  <circle cx="400" cy="200" r="260" fill="url(#lampGlow)" opacity=".35"/>

  <!-- the photographs on a line -->
  <path d="M30 104 Q150 136 270 110" stroke="#8a7a5a" stroke-width="2" fill="none"/>
  ${MOMENTS.map((m, i) => {
    const x = 40 + i * 37, y = 112 + Math.sin(i / 5 * Math.PI) * 14;
    return `<g transform="translate(${x},${y}) rotate(${[-6, 4, -3, 5, -4, 3][i]})"><rect width="32" height="26" fill="#efe6cf"/><rect x="2" y="2" width="28" height="18" fill="#7a6a52"/><rect x="12" y="-4" width="6" height="8" fill="#c9a33b"/></g>`;
  }).join('')}
  ${g.flag('photosDone') ? `<text x="150" y="176" font-size="11" text-anchor="middle" ${serif} font-style="italic" fill="#c8b890">yesterday, in order</text>` : ''}

  <!-- the checkout machine -->
  <rect x="270" y="300" width="260" height="170" rx="8" fill="url(#woodG)" stroke="#1e120a" stroke-width="3"/>
  <circle cx="400" cy="200" r="104" fill="#2a2018" stroke="url(#brassG)" stroke-width="8"/>
  ${Array.from({ length: 24 }, (_, i) => `<rect x="396" y="88" width="8" height="14" fill="url(#brassG)" transform="rotate(${i * 15} 400 200)"/>`).join('')}
  <circle cx="400" cy="200" r="70" fill="#efe6cf"/>
  <text x="400" y="170" font-size="14" text-anchor="middle" ${serif} letter-spacing="4" fill="#2a1c10">CHECKOUT</text>
  ${[...Array(12)].map((_, i) => `<line x1="400" y1="140" x2="400" y2="148" transform="rotate(${i * 30} 400 200)" stroke="#2a1c10" stroke-width="2"/>`).join('')}
  <line x1="400" y1="200" x2="400" y2="${reversed ? 146 : 150}" transform="rotate(${reversed ? -40 : 40} 400 200)" stroke="#a3221c" stroke-width="5" stroke-linecap="round"/>
  <circle cx="400" cy="200" r="7" fill="url(#brassG)"/>
  <text x="400" y="240" font-size="11" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">${reversed ? 'reversed' : ready ? 'awaiting the day' : 'cold'}</text>
  <rect x="300" y="318" width="200" height="64" fill="url(#brassG)" stroke="#5a4214" stroke-width="2"/>
  <text x="400" y="340" font-size="10" text-anchor="middle" ${serif} letter-spacing="1" fill="#2a1c10">TO REVERSE A CHECKOUT</text>
  <text x="400" y="356" font-size="10" text-anchor="middle" ${serif} letter-spacing="1" fill="#2a1c10">ENTER THE DAY BACKWARDS,</text>
  <text x="400" y="372" font-size="10" text-anchor="middle" ${serif} letter-spacing="1" fill="#2a1c10">LAST MOMENT FIRST.</text>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${306 + (i % 4) * 48}" y="${394 + Math.floor(i / 4) * 30}" width="40" height="24" rx="4" fill="${ready ? '#d8c58a' : '#6a5a3a'}" stroke="#2a1c10"/>`).join('')}

  <!-- conveyor of jars, and the chute -->
  <rect x="150" y="478" width="520" height="14" fill="#3a3a3a"/>
  ${Array.from({ length: 11 }, (_, i) => `<circle cx="${160 + i * 50}" cy="485" r="5" fill="#5a5a5a"/>`).join('')}
  ${[170, 230, 470, 630].map(x => `<rect x="${x}" y="452" width="22" height="26" rx="4" fill="#bfe0e8" opacity=".4" stroke="#e8f6ff"/><circle cx="${x + 11}" cy="466" r="5" fill="#c8e8ff" opacity=".8"/>`).join('')}
  <polygon points="540,420 610,420 600,470 550,470" fill="#2a2018" stroke="url(#brassG)" stroke-width="2"/>
  ${reversed && !kept ? `<rect x="562" y="434" width="26" height="30" rx="5" fill="#ffe7a0" opacity=".6" stroke="#fff6c8"/><circle cx="575" cy="449" r="7" fill="#ffe090" filter="url(#hGlow)"/>` : ''}

  <!-- memory cabinet -->
  <rect x="604" y="176" width="168" height="294" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  <text x="688" y="198" font-size="10" text-anchor="middle" ${serif} letter-spacing="2" fill="#f0d890">MEMORIES</text>
  ${Array.from({ length: 8 }, (_, i) => `<rect x="${616 + (i % 2) * 76}" y="${208 + Math.floor(i / 2) * 64}" width="68" height="56" fill="#5a3a24" stroke="#1e120a"/>
    <rect x="${640 + (i % 2) * 76}" y="${232 + Math.floor(i / 2) * 64}" width="20" height="5" fill="url(#brassG)"/>`).join('')}

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

const memory = () => `${DEFS}
  <rect width="800" height="600" fill="#5a6268"/>
  <rect y="380" width="800" height="220" fill="#3e3e3c"/>
  <rect x="0" y="372" width="800" height="12" fill="#c8c0a8"/>
  <path d="M0 120 h800" stroke="#1a1a1a" stroke-width="2"/>
  ${[120, 170, 220, 520, 600].map(x => symAt(EMBLEMS, 'swallow', x, 92, 28, '#1a1a1a')).join('')}
  <rect x="80" y="210" width="640" height="170" rx="10" fill="#2e3236"/>
  ${[120, 260, 400, 540].map(x => `<rect x="${x}" y="236" width="100" height="70" rx="4" fill="#7a8890"/>`).join('')}
  <path d="M440 272 q10 -24 26 -30" stroke="#d8d0c0" stroke-width="7" stroke-linecap="round" fill="none"/>
  <circle cx="468" cy="242" r="7" fill="#d8d0c0"/>
  <circle cx="440" cy="262" r="16" fill="#c8c0b0"/>
  ${Array.from({ length: 40 }, (_, i) => `<line x1="${(i * 41) % 800}" y1="${(i * 67) % 380}" x2="${(i * 41) % 800 - 6}" y2="${(i * 67) % 380 + 24}" stroke="#c8d0d4" stroke-width="1.2" opacity=".6"/>`).join('')}
  <rect x="24" y="396" width="340" height="${THE_MEMORY.lines.length * 24 + 26}" fill="#000" opacity=".5"/>
  <g ${serif} fill="#f4ecd8" font-size="15" font-style="italic">
    ${THE_MEMORY.lines.map((l, i) => `<text x="40" y="${422 + i * 24}">${l}</text>`).join('')}
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

export default {
  id: 'r6',
  name: 'The Lost Day',
  hints: [
    { when: g => !g.flag('photosDone'), text: g => g.difficulty === 'easy'
      ? 'Put yesterday\'s photographs in order. Each has a clock with a sun (morning) or moon (night). Your notebook has the agreement at 8.15 am and the revocation at 11.40 pm.'
      : 'The photographs on the line are yesterday, out of order. Your notebook remembers when things happened.' },
    { when: g => !g.flag('memoriesDone'), text: g => g.difficulty === 'easy'
      ? 'In the memory cabinet, keep only what is yours. Everything the hotel gave you is dated 6 November.'
      : 'Not every memory in the cabinet is yours. Remember what the register claimed.' },
    { when: g => !g.flag('reversed'), text: g => g.difficulty === 'easy'
      ? 'The machine reverses a checkout if you enter yesterday backwards: start with taking the 6, end with arriving.'
      : 'Read the plate on the machine.' },
    { when: g => !g.flag('memoryKept'), text: 'Your jar rolled out of the chute.' },
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
        { id: 'photos', label: g => g.flag('photosDone') ? 'Yesterday, in order' : 'Photographs on a line', rect: [26, 96, 254, 70],
          sparkle: g => !g.flag('photosDone'),
          click: g => g.flag('photosDone') ? g.say('Yesterday, in order: arrival, the agreement, breakfast, the waltz, the photos, the 6.') : g.puzzle('r6-photos') },
        { id: 'cabinet', label: g => g.flag('memoriesDone') ? 'Memories (yours)' : 'Memory cabinet', rect: [600, 172, 176, 302],
          sparkle: g => !g.flag('memoriesDone'),
          click: g => g.flag('memoriesDone') ? g.say('Only your own memories are left in the cabinet now.') : g.puzzle('r6-memories') },
        { id: 'machine', label: g => g.flag('reversed') ? 'Checkout machine (reversed)' : g.flag('photosDone') && g.flag('memoriesDone') ? 'Checkout machine (enter the day backwards)' : 'Checkout machine',
          rect: [270, 92, 260, 380], sparkle: g => g.flag('photosDone') && g.flag('memoriesDone') && !g.flag('reversed'),
          click: g => {
            if (g.flag('reversed')) return g.say('The dial points backwards now. The machine is quiet.');
            if (!(g.flag('photosDone') && g.flag('memoriesDone'))) {
              const missing = [!g.flag('photosDone') && 'what happened, in order', !g.flag('memoriesDone') && 'which memories are really yours'].filter(Boolean).join(', and ');
              return g.say(`The machine is cold. Its plate: TO REVERSE A CHECKOUT, ENTER THE DAY BACKWARDS. First you need the whole day: ${missing}.`, 7000);
            }
            g.puzzle('r6-reverse');
          } },
        { id: 'jar', label: '6 NOV · 204', rect: [552, 424, 50, 46], when: g => g.flag('reversed') && !g.flag('memoryKept'),
          sparkle: true, go: 'r6-memory' },
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
    'r6-photos': {
      type: 'order',
      prompt: "Yesterday, in pieces. Put the photographs in the order things happened.",
      config: g => ({
        items: MOMENTS.map(m => ({
          id: m.id,
          label: `<span style="display:inline-flex;flex-direction:column;align-items:center;gap:2px">${pic(SCENES[m.id] + (g.difficulty === 'hard' ? '' : miniClock(102, 16, m.time, m.day)), 120, 90)}
            <span style="font:12px Georgia,serif;color:#2a1c10">${m.caption}</span></span>`,
        })),
      }),
      solution: MOMENTS.map(m => m.id),
      seed: 23,
      okText: 'Yesterday, in order.',
      errText: 'That isn\'t how the day went. Click a photo in the line to take it back out.',
      solve: g => {
        g.set('photosDone');
        g.note('yesterday', 'Yesterday, in order: <b>arriving in the rain → signing the agreement → breakfast, table 3 → the waltz → photos in room 204 → taking the 6</b>.');
        g.say('Yesterday, whole again: you arrived, you signed, you met Miss Ito, you saw the archive, you left yourself clues, you took the 6.', 7000);
      },
    },

    'r6-memories': {
      type: 'select',
      prompt: g => g.difficulty === 'hard'
        ? 'Eight memories, all with your face in them. Choose the ones that are really yours.'
        : 'Eight memories, all with your face in them. The register claims you came here every 6 November for thirty years, but your own folio says <b>FIRST STAY</b>. Keep only what is really yours.',
      options: MEMORIES.map(m => ({ id: m.id, label: pic(MEMORY_PICS[m.id], 120, 90), name: `${m.caption} · ${m.date}` })),
      solution: MEMORIES.filter(m => m.mine).map(m => m.id),
      columns: 4,
      optionSize: 132,
      confirmText: 'Keep these',
      config: g => ({
        failText: g.difficulty === 'hard'
          ? 'The cabinet rattles and refuses. Some of those were never yours, or something of yours is missing.'
          : (chosen, sol) => {
            const wrong = chosen.filter(id => !sol.includes(id)).length;
            const missing = sol.filter(id => !chosen.includes(id)).length;
            const bits = [wrong && `${wrong} of those ${wrong === 1 ? 'was' : 'were'} never yours`,
              missing && `${missing} of yours ${missing === 1 ? 'is' : 'are'} still left behind`].filter(Boolean);
            return `The cabinet rattles and refuses: ${bits.join(', and ')}.`;
          },
      }),
      solve: g => {
        g.set('memoriesDone');
        g.note('mine', 'My memories, not the hotel\'s: the station, the bicycle, the swallow teacup, the letter. Every one the hotel gave me was dated 6 November.');
        g.say('The four planted memories crumble like old film. What is left is yours, including one at a seaside station that you cannot quite look at yet.', 7000);
      },
    },

    'r6-reverse': {
      type: 'sequence',
      prompt: 'TO REVERSE A CHECKOUT: ENTER THE DAY BACKWARDS, LAST MOMENT FIRST.',
      buttons: ['photos', 'key', 'arrive', 'six', 'breakfast', 'bell', 'sign', 'waltz'].map(id => ({ id, label: iconSvg(id), title: id })),
      solution: [...MOMENTS].reverse().map(m => m.id),
      columns: 4,
      okText: 'REVERSING',
      errText: 'THE DAY DOES NOT RUN THAT WAY',
      solve: g => {
        g.set('reversed');
        g.effect('shutter');
        g.say('The great dial swings backwards. The conveyor shudders to a stop, then runs the other way, and out of the chute rolls a single warm jar: 6 NOV · 204. Behind it come five more.', 8000);
      },
    },
  },
};

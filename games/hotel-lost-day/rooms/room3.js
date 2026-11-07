// ROOM 3 — Breakfast Room
// Purpose: reconstruct a meeting you have forgotten.
// Fact: other guests are trapped too, and one of them helped you.
//
//   1. Seating plan: reservation book (tables, and what each guest ordered)
//      + yesterday's photo (what was eaten at each seat) -> place every guest's card.
//      Table 3, "breakfast for two": you and Miss Ito (203).
//      Restoring the seating brings part of yesterday back: the lost-property box fills.
//   2. Lost property: match each item to its owner (emblem motifs, and the sounds
//      behind the corridor doors in room 2). Each item holds a note its owner wrote.
//   3. The service lift: the notes say Miss Ito sent an envelope up to her own room.
//      Call the lift from 203 -> her letter and a dance card for the ballroom door.

import { DEFS, closeup, deskTop, finish, rainWindow, hand, serif } from '../art/common.js';
import { EMBLEMS, symAt } from '../art/symbols.js';

// ---------------------------------------------------------------- data

// Tables as seen from the service door. Seats: left / right of each table (table 4 seats one).
const TABLES = [
  { n: 1, x: 230, y: 392, seats: ['l', 'r'] },
  { n: 2, x: 474, y: 392, seats: ['l', 'r'] },
  { n: 3, x: 534, y: 508, seats: ['l', 'r'] },
  { n: 4, x: 262, y: 512, seats: ['l'] },
];
// who sat where, and what the photo shows on their plate
const SEATING = {
  t1l: { emblem: 'fern', dish: 'porridge' },
  t1r: { emblem: 'fern', dish: 'porridge' },
  t2l: { emblem: 'anchor', dish: 'kippers' },
  t2r: { emblem: 'bell', dish: 'coffee' },
  t3l: { emblem: 'swallow', dish: 'egg' },
  t3r: { emblem: 'moon', dish: 'tea' },
  t4l: { emblem: 'fox', dish: 'full' },
};
const DISH_NAMES = {
  porridge: 'a bowl of porridge', kippers: 'a plate of kipper bones', coffee: 'a cup of black coffee, nothing else',
  egg: 'a boiled egg in an egg cup', tea: 'tea with a slice of lemon, and toast', full: 'the remains of a full breakfast',
};
const GUESTS = [
  { id: 'vale', room: '201', emblem: 'fern', name: 'Mr & Mrs Vale' },
  { id: 'orme', room: '202', emblem: 'anchor', name: 'Capt. H. Orme' },
  { id: 'ito', room: '203', emblem: 'moon', name: 'Miss A. Ito' },
  { id: 'brandt', room: '205', emblem: 'bell', name: 'Dr L. Brandt' },
  { id: 'okonkwo', room: '206', emblem: 'fox', name: 'Mr K. Okonkwo' },
];

// ---------------------------------------------------------------- small drawings

function dish(kind, x, y) {
  const plate = (r = 15) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.42}" fill="#f8f4ea" stroke="#c8c0b0"/>`;
  switch (kind) {
    case 'porridge': return `<ellipse cx="${x}" cy="${y}" rx="12" ry="6" fill="#f8f4ea" stroke="#c8c0b0"/><ellipse cx="${x}" cy="${y - 1}" rx="9" ry="3.5" fill="#d8c090"/>`;
    case 'kippers': return plate() + `<path d="M${x - 10} ${y} h20 M${x - 6} ${y - 3} v6 M${x - 1} ${y - 3} v6 M${x + 4} ${y - 3} v6" stroke="#8a7a5a" stroke-width="1.2"/><path d="M${x + 10} ${y} l5 -3 v6 Z" fill="#8a7a5a"/>`;
    case 'coffee': return `<ellipse cx="${x}" cy="${y + 2}" rx="10" ry="4" fill="#f8f4ea" stroke="#c8c0b0"/><path d="M${x - 6} ${y - 8} h12 l-2 9 h-8 Z" fill="#f8f4ea" stroke="#c8c0b0"/><ellipse cx="${x}" cy="${y - 8}" rx="6" ry="2" fill="#2a1a10"/>`;
    case 'egg': return `<ellipse cx="${x}" cy="${y + 2}" rx="9" ry="3.5" fill="#f8f4ea" stroke="#c8c0b0"/><path d="M${x - 4} ${y + 1} h8 l-1 -5 h-6 Z" fill="#c9a33b"/><ellipse cx="${x}" cy="${y - 8}" rx="5" ry="6.5" fill="#f4e8d0" stroke="#c8b890"/>`;
    case 'tea': return `<ellipse cx="${x - 2}" cy="${y + 2}" rx="10" ry="4" fill="#f8f4ea" stroke="#c8c0b0"/><path d="M${x - 8} ${y - 7} h12 l-2 8 h-8 Z" fill="#f8f4ea" stroke="#c8c0b0"/><ellipse cx="${x - 2}" cy="${y - 7}" rx="6" ry="2" fill="#b8702a"/>
      <circle cx="${x + 10}" cy="${y - 5}" r="4" fill="#f0d840" stroke="#c8a820"/><rect x="${x + 4}" y="${y + 2}" width="12" height="7" fill="#d8a860" transform="rotate(-10 ${x + 10} ${y + 5})"/>`;
    case 'full': return plate(16) + `<rect x="${x - 10}" y="${y - 3}" width="10" height="4" rx="2" fill="#8a4a2a"/><ellipse cx="${x + 5}" cy="${y}" rx="5" ry="2.5" fill="#fff"/><circle cx="${x + 5}" cy="${y}" r="1.6" fill="#f0b020"/><circle cx="${x - 3}" cy="${y + 3}" r="2" fill="#c84a2a"/><circle cx="${x}" cy="${y + 3}" r="2" fill="#c84a2a"/>`;
    default: return '';
  }
}

function placeCard(emblem, x, y) {
  return `<g transform="translate(${x},${y})">
    <polygon points="-11,4 11,4 8,-10 -8,-10" fill="#f4efe2" stroke="#8a7a5a"/>
    ${symAt(EMBLEMS, emblem, -6, -9, 12, '#2a3a5a')}</g>`;
}

function table(t, g, past) {
  const { x, y } = t;
  const seated = !past && g.flag('seatingDone');
  let out = '';
  for (const side of t.seats) {
    const cx = side === 'l' ? x - 92 : x + 92;
    out += `<path d="M${cx - 16} ${y + 50} v-62 q16 -14 32 0 v62" fill="#4a2e1a" stroke="#1e120a" stroke-width="2"/>
            <rect x="${cx - 20}" y="${y + 6}" width="40" height="10" rx="3" fill="#6a1e26"/>`;
  }
  out += `<ellipse cx="${x}" cy="${y + 44}" rx="70" ry="10" fill="#000" opacity=".35"/>
    <path d="M${x - 74} ${y} v34 q74 18 148 0 v-34 Z" fill="#efe9dc"/>
    <path d="M${x - 74} ${y + 34} q74 18 148 0" stroke="#c8c0b0" stroke-width="2" fill="none"/>
    <ellipse cx="${x}" cy="${y}" rx="74" ry="20" fill="#f8f4ea" stroke="#d8d0c0"/>
    <polygon points="${x - 6},${y - 2} ${x + 6},${y - 2} ${x + 4},${y - 12} ${x - 4},${y - 12}" fill="url(#brassG)"/>
    <text x="${x}" y="${y - 4}" font-size="8" text-anchor="middle" ${serif} fill="#2a1c10">${t.n}</text>`;
  for (const side of t.seats) {
    const dx = side === 'l' ? x - 40 : x + 40;
    const seat = SEATING[`t${t.n}${side}`];
    if (past) out += dish(seat.dish, dx, y - 2);
    else out += `<ellipse cx="${dx}" cy="${y - 1}" rx="14" ry="6" fill="#fff" stroke="#d8d0c0"/>
      <path d="M${dx + 16} ${y - 6} l6 2 l-2 6 Z" fill="#c8b8e0"/>
      ${seated ? placeCard(seat.emblem, dx, y - 8) : ''}`;
  }
  return out;
}

// ---------------------------------------------------------------- main scene

function breakfastArt(g, past) {
  const liftOpen = !past && g.get('liftAt');
  const ballroomOpen = !past && g.flag('ballroomOpen');
  const boxFull = !past && g.flag('seatingDone') && !g.flag('itemsDone');
  return `${DEFS}
  <defs>
    <pattern id="parquet" width="60" height="30" patternUnits="userSpaceOnUse">
      <rect width="60" height="30" fill="#5a3a20"/><path d="M0 15 h60 M30 0 v15 M0 15 v15 M60 15 v15" stroke="#3a2412" stroke-width="2"/>
      <rect x="2" y="2" width="26" height="11" fill="#6a4628" opacity=".6"/>
    </pattern>
    <pattern id="paperGreen" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="30" height="30" fill="#c8b890"/><path d="M15 0 v30" stroke="#b8a878" stroke-width="6"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="#000"/>
  <rect width="800" height="336" fill="url(#paperGreen)"/>
  <rect width="800" height="336" fill="#3a2a10" opacity=".35"/>
  <rect width="800" height="24" fill="#2e1c10"/><rect y="24" width="800" height="4" fill="url(#brassG)"/>
  <rect y="250" width="800" height="86" fill="url(#woodG)"/><rect y="248" width="800" height="5" fill="#6a4a2e"/>
  <rect y="336" width="800" height="264" fill="url(#parquet)"/>
  <rect y="336" width="800" height="264" fill="#000" opacity=".25"/>

  <!-- service door you came down -->
  <rect x="18" y="146" width="86" height="190" fill="#2e1c10"/>
  <rect x="24" y="152" width="74" height="184" fill="#120a06"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${30 + i * 4}" y="${200 + i * 30}" width="${60 - i * 8}" height="5" fill="#2e1c10"/>`).join('')}
  <polygon points="98,152 112,160 112,330 98,336" fill="#4a2e1a"/>
  <text x="61" y="140" font-size="9" text-anchor="middle" ${serif} fill="#3a2a1a">SERVICE</text>

  <!-- windows -->
  ${[130, 244].map((x, i) => `<path d="M${x - 6} 300 V112 a48 40 0 0 1 102 0 V300 Z" fill="#3a2414"/>${rainWindow(x, 112, 90, 186, `r3win${i}`)}
    <path d="M${x} 112 a45 34 0 0 1 90 0 Z" fill="url(#nightG)"/>`).join('')}

  <!-- ballroom doors -->
  <rect x="372" y="96" width="136" height="22" fill="#2e1c10" stroke="url(#brassG)" stroke-width="2"/>
  <text x="440" y="112" font-size="12" text-anchor="middle" ${serif} letter-spacing="3" fill="#f0d890">BALLROOM</text>
  <rect x="378" y="122" width="124" height="214" fill="#1e120a"/>
  ${ballroomOpen ? `
    <rect x="384" y="128" width="112" height="208" fill="#2a1a3a"/>
    <circle cx="440" cy="200" r="70" fill="url(#lampGlow)"/>
    <polygon points="384,128 400,136 400,330 384,336" fill="#5a3a24"/><polygon points="496,128 480,136 480,330 496,336" fill="#5a3a24"/>
  ` : `
    <rect x="384" y="128" width="55" height="208" fill="#5a3a24"/><rect x="441" y="128" width="55" height="208" fill="#5a3a24"/>
    ${[384, 441].map(x => `<rect x="${x + 8}" y="140" width="39" height="80" fill="none" stroke="#2e1c10" stroke-width="2"/>
      <rect x="${x + 8}" y="232" width="39" height="90" fill="none" stroke="#2e1c10" stroke-width="2"/>`).join('')}
    <rect x="433" y="226" width="5" height="24" rx="2" fill="url(#brassG)"/><rect x="443" y="226" width="5" height="24" rx="2" fill="url(#brassG)"/>
    <rect x="422" y="262" width="36" height="8" rx="2" fill="#1e120a" stroke="url(#brassG)"/>`}

  <!-- service lift (dumbwaiter) -->
  <rect x="552" y="160" width="98" height="132" fill="url(#brassG)"/>
  <rect x="560" y="168" width="82" height="116" fill="${liftOpen ? '#1a120a' : '#5a4a3a'}"/>
  ${liftOpen ? `<rect x="566" y="250" width="70" height="30" fill="#3a2a1a"/>` : `${[0, 1, 2, 3, 4, 5].map(i => `<line x1="560" y1="${178 + i * 18}" x2="642" y2="${178 + i * 18}" stroke="#3a2a1a" stroke-width="2"/>`).join('')}`}
  <text x="601" y="154" font-size="9" text-anchor="middle" ${serif} letter-spacing="1" fill="#3a2a1a">SERVICE LIFT</text>
  <rect x="656" y="176" width="34" height="100" rx="3" fill="url(#brassG)" stroke="#5a4214"/>
  ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="673" cy="${190 + i * 15}" r="5" fill="#2a1c10"/>`).join('')}

  <!-- sideboard: order spike and lost-property box -->
  <rect x="704" y="312" width="92" height="110" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  <rect x="700" y="306" width="100" height="8" fill="#6a4a2e"/>
  <rect x="722" y="300" width="14" height="6" fill="#2a2a2a"/><line x1="729" y1="300" x2="729" y2="262" stroke="#888" stroke-width="2"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${716 + (i % 2) * 2}" y="${272 + i * 6}" width="26" height="10" fill="#f4efe2" transform="rotate(${i * 9 - 12} 729 ${277 + i * 6})"/>`).join('')}
  <path d="M752 306 l4 -26 h34 l4 26 Z" fill="#8a6a3a" stroke="#4a3418" stroke-width="2"/>
  <text x="773" y="296" font-size="6" text-anchor="middle" ${serif} fill="#2a1c10">LOST</text>
  ${boxFull ? `<circle cx="764" cy="278" r="5" fill="#2a3a5a"/><rect x="770" y="272" width="16" height="6" fill="#7a4a2a"/><circle cx="782" cy="276" r="4" fill="#d8d8e0"/>` : ''}

  <!-- maître d's lectern -->
  <path d="M34 540 l8 -150 h60 l8 150 Z" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  <polygon points="26,392 118,392 108,372 36,372" fill="#6a4a2e" stroke="#1e120a" stroke-width="2"/>
  <polygon points="40,388 104,388 98,376 46,376" fill="#efe6cf"/>
  <path d="M72 376 v12" stroke="#8a7a5a"/>

  ${TABLES.map(t => table(t, g, past)).join('')}
  ${past ? `<text x="772" y="584" font-size="22" text-anchor="end" font-family="Courier New, monospace" font-weight="bold"
    fill="#ff9a3a" opacity=".85" filter="url(#hGlow)">6 NOV  9.00 AM</text>` : ''}
  ` + finish();
}

// ---------------------------------------------------------------- close-ups

const lectern = g => deskTop() + `
  <g transform="rotate(-1.5 400 300)">
    <rect x="66" y="66" width="668" height="470" rx="6" fill="#000" opacity=".45"/>
    <rect x="60" y="60" width="668" height="470" rx="6" fill="#3a1a14"/>
    <rect x="74" y="72" width="318" height="446" fill="#efe6cf"/><rect x="396" y="72" width="318" height="446" fill="#ece2c8"/>
    <rect x="388" y="72" width="8" height="446" fill="#000" opacity=".2"/>
    <text x="233" y="112" font-size="20" text-anchor="middle" ${serif} letter-spacing="2" fill="#2a1c10">RESERVATIONS</text>
    <text x="233" y="134" font-size="13" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Breakfast, 6 November</text>
    <g ${serif} fill="#2a1c10" font-size="16">
      ${[['Table 1', 'Mr & Mrs Vale (201)', 'porridge, twice'], ['Table 2', 'Capt. Orme (202)', 'kippers'], ['', 'Dr Brandt (205)', 'black coffee, nothing else'],
         ['Table 3', 'Room 204, for two', 'boiled egg · tea with lemon'], ['Table 4', 'Mr Okonkwo (206)', 'the full breakfast']]
        .map(([tbl, who, dish], i) => `<text x="96" y="${176 + i * 46}" font-weight="bold">${tbl}</text><text x="176" y="${176 + i * 46}" font-style="italic">${who}</text>
          <text x="186" y="${194 + i * 46}" font-size="13" fill="#5a4a3a">${dish}</text>`).join('')}
    </g>
    <text x="96" y="430" font-size="13" ${hand} fill="#7a1e22">Table 3: room 204 has the egg. Their</text>
    <text x="96" y="452" font-size="13" ${hand} fill="#7a1e22">guest's name was not given.</text>
    <text x="555" y="112" font-size="20" text-anchor="middle" ${serif} letter-spacing="2" fill="#2a1c10">SEATING PLAN</text>
    <text x="555" y="134" font-size="12" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">the room as you see it</text>
    ${seatingPlanArt(416, 160, 0.6)}
    <text x="555" y="470" font-size="14" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">${g.flag('seatingDone') ? 'Every seat has its card again.' : 'The place cards are loose. Set them out.'}</text>
  </g>` + finish();

/** Top-down seating plan. Board coordinates 460 x 340; drawn at (ox, oy) scaled by s. */
function seatingPlanArt(ox = 0, oy = 0, s = 1) {
  const pos = { 1: [120, 95], 2: [340, 95], 3: [340, 245], 4: [120, 245] };
  return `<g transform="translate(${ox},${oy}) scale(${s})">
    <rect width="460" height="340" rx="8" fill="#f4efe2" stroke="#8a7a5a" stroke-width="3"/>
    ${Object.entries(pos).map(([n, [x, y]]) => `
      <circle cx="${x}" cy="${y}" r="34" fill="#fff" stroke="#8a7a5a" stroke-width="2"/>
      <text x="${x}" y="${y + 8}" font-size="22" text-anchor="middle" ${serif} fill="#2a1c10">${n}</text>`).join('')}
    <text x="230" y="22" font-size="12" text-anchor="middle" ${serif} font-style="italic" fill="#8a7a5a">▴ windows and ballroom doors ▴</text>
    <text x="230" y="330" font-size="12" text-anchor="middle" ${serif} font-style="italic" fill="#8a7a5a">▾ where you are standing ▾</text>
  </g>`;
}
const PLAN_SLOTS = [
  { id: 't1l', x: 54, y: 95 }, { id: 't1r', x: 186, y: 95 },
  { id: 't2l', x: 274, y: 95 }, { id: 't2r', x: 406, y: 95 },
  { id: 't3l', x: 274, y: 245 }, { id: 't3r', x: 406, y: 245 },
  { id: 't4l', x: 54, y: 245 },
];

// Lost-property items, drawn in a 60x60 box with their owner's emblem clearly on them.
const em = (id, x, y, size, color) => `<g transform="translate(${x},${y}) scale(${size / 40})" style="color:${color}">${EMBLEMS[id]}</g>`;
const ITEM_ICONS = {
  knitting: `<circle cx="18" cy="40" r="14" fill="#6a8a4a"/><path d="M6 36 q12 -6 24 0 M6 42 q12 -6 24 4 M10 30 q10 6 18 18" stroke="#4a6a2a" stroke-width="2" fill="none"/>
    <path d="M26 56 L50 6 M32 58 L56 12" stroke="#c9a33b" stroke-width="3" stroke-linecap="round"/>
    <rect x="30" y="28" width="28" height="28" rx="4" fill="#c8e0a8" stroke="#4a6a2a" stroke-width="2"/>${em('fern', 32, 30, 24, '#2a4a1a')}`,
  pipe: `<path d="M3 20 h26 v7 h-26 Z" fill="#3a2010"/><path d="M26 14 h26 v22 q0 18 -13 18 q-13 0 -13 -18 Z" fill="#6a3a1a" stroke="#3a2010" stroke-width="2"/>
    <ellipse cx="39" cy="14" rx="13" ry="4" fill="#2a1408"/><rect x="26" y="24" width="26" height="16" fill="#d8b860"/>${em('anchor', 31, 24, 16, '#3a2a10')}
    <path d="M36 8 q-4 -5 1 -8 M44 8 q5 -5 0 -8" stroke="#b8b8c0" stroke-width="1.5" fill="none" opacity=".8"/>`,
  brooch: `<circle cx="30" cy="30" r="25" fill="#d8d8e0" stroke="#8a8a98" stroke-width="3"/><circle cx="30" cy="30" r="20" fill="#eeeef4"/>${em('moon', 12, 12, 36, '#4a4a6a')}`,
  pen: `<g transform="rotate(35 30 30)"><rect x="25" y="2" width="10" height="44" rx="3" fill="#1a1a2a"/><path d="M25 46 h10 l-5 12 Z" fill="#c9a33b"/>
    <rect x="34" y="6" width="5" height="20" rx="2" fill="#c9a33b"/></g>${em('bell', 36, 2, 20, '#c9a33b')}
    <circle cx="12" cy="50" r="5" fill="#1a1a3a" opacity=".7"/>`,
  cane: `<path d="M33 58 V24" stroke="#5a3a1a" stroke-width="6" stroke-linecap="round"/><rect x="29" y="22" width="8" height="6" fill="#c9a33b"/>${em('fox', 12, 0, 36, '#c9a33b')}`,
};
const ITEM_INFO = {
  knitting: ['Knitting', 'Knitting: a half-finished scarf, worked in a pattern of little ferns.'],
  pipe: ['Pipe', 'Pipe: the brass band is engraved with a small anchor. It smells like the tobacco behind door 202.'],
  brooch: ['Brooch', 'Brooch: a silver crescent moon.'],
  pen: ['Fountain pen', 'Fountain pen: its clip is shaped like a little bell. You heard one scratching behind door 205.'],
  cane: ['Walking cane', 'Walking cane: the handle is a carved fox head.'],
};
const itemSvg = id => `<svg viewBox="0 0 60 60">${ITEM_ICONS[id]}</svg>`;
const ITEM_OWNERS = { knitting: 'vale', pipe: 'orme', brooch: 'ito', pen: 'brandt', cane: 'okonkwo' };

function guestBoardArt() {
  return `<rect width="460" height="230" rx="8" fill="#2a1a10"/>
    ${GUESTS.map((gst, i) => {
      const x = 46 + i * 92;
      return `<rect x="${x - 40}" y="16" width="80" height="104" rx="4" fill="#efe6cf" stroke="#8a7a5a"/>
        ${symAt(EMBLEMS, gst.emblem, x - 16, 24, 32, '#2a3a5a')}
        <text x="${x}" y="76" font-size="12" text-anchor="middle" font-family="Courier New, monospace" fill="#2a1c10">${gst.room}</text>
        <text x="${x}" y="96" font-size="10" text-anchor="middle" ${serif} font-style="italic" fill="#2a1c10">${gst.name.replace('Mr & Mrs Vale', 'The Vales').replace('Capt. H. ', 'Capt. ').replace(/^(Miss|Dr|Mr) [A-Z]\. /, '$1 ')}</text>`;
    }).join('')}
    <text x="230" y="220" font-size="12" text-anchor="middle" ${serif} font-style="italic" fill="#b8a888">Whose is whose?</text>`;
}

const ACCOUNTS = [
  { who: 'Mrs Vale, 201', text: ['We sat by the window,', 'as always. The guest from', '204 and the young lady from', '203 whispered all through', 'breakfast.'] },
  { who: 'Capt. Orme, 202', text: ['Saw the lady from 203', 'slip an envelope into the', 'service lift. Sent it UP,', 'not down to the kitchen.', 'Odd.'] },
  { who: 'Dr Brandt, 205', text: ['Note to self: the service', 'lift runs from here to our', 'floor. One button per room.', 'Do NOT forget this again.'] },
  { who: 'Mr Okonkwo, 206', text: ['She pressed the button for', 'her own room. I am certain.', 'I wrote it down so I could', 'be certain tomorrow.'] },
  { who: 'Miss Ito, 203', text: ['They will make me forget', 'again, the way they did', 'before. If you find this:', 'I tried.'] },
];

const accounts = () => deskTop() + `
  ${ACCOUNTS.map((a, i) => {
    const x = [40, 290, 540, 160, 420][i], y = i < 3 ? 50 : 300, rot = [-3, 2, -2, 3, -1][i];
    return `<g transform="rotate(${rot} ${x + 115} ${y + 100})">
      <rect x="${x + 5}" y="${y + 6}" width="230" height="200" fill="#000" opacity=".35"/>
      <rect x="${x}" y="${y}" width="230" height="200" fill="#f4efe2" stroke="#b8a888"/>
      ${a.text.map((t, k) => `<text x="${x + 14}" y="${y + 36 + k * 28}" font-size="14" ${hand} fill="#1f2a5a">${t}</text>`).join('')}
      <text x="${x + 216}" y="${y + 184}" font-size="12" text-anchor="end" ${serif} font-style="italic" fill="#5a4a3a">— ${a.who}</text></g>`;
  }).join('')}
  ` + finish();

const LIFT_CONTENTS = {
  201: 'The lift rattles down from 201. Inside: a knitting pattern, half finished, the same row over and over.',
  202: 'Down from 202: a tin of pipe tobacco, unopened.',
  204: 'Down from your own room: nothing at all. Of course. You never sent anything.',
  205: 'Down from 205: a stack of blank paper, every sheet dated 6 November.',
  206: 'Down from 206: a cold kipper on a saucer. Someone\'s idea of a joke.',
};

const lift = g => {
  const at = g.get('liftAt');
  const envelope = at === '203' && !g.flag('letterRead');
  return closeup('#2a1a10') + `
  <rect x="120" y="70" width="380" height="460" fill="url(#brassG)"/>
  <rect x="140" y="90" width="340" height="420" fill="${at ? '#140c06' : '#5a4a3a'}"/>
  ${at ? `
    <rect x="150" y="340" width="320" height="160" fill="#3a2a1a"/>
    <rect x="150" y="330" width="320" height="12" fill="#5a3a24"/>
    ${envelope ? `<g transform="rotate(-6 310 400)"><rect x="240" y="370" width="140" height="80" fill="#efe6cf" stroke="#8a7a5a" stroke-width="2"/>
      <path d="M240 370 L310 412 L380 370" fill="none" stroke="#8a7a5a" stroke-width="2"/>
      ${symAt(EMBLEMS, 'moon', 296, 414, 26, '#4a4a5a')}</g>` : ''}
  ` : `${Array.from({ length: 12 }, (_, i) => `<line x1="140" y1="${110 + i * 34}" x2="480" y2="${110 + i * 34}" stroke="#3a2a1a" stroke-width="4"/>`).join('')}`}
  <rect x="540" y="110" width="160" height="380" rx="8" fill="url(#brassG)" stroke="#5a4214" stroke-width="3"/>
  <text x="620" y="146" font-size="15" text-anchor="middle" ${serif} letter-spacing="2" fill="#2a1c10">CALL FROM</text>
  <rect x="570" y="470" width="100" height="16" fill="#2a1c10"/>
  <text x="620" y="482" font-size="9" text-anchor="middle" font-family="Courier New, monospace" fill="#f0d890">${g.flag('liftUnlocked') ? 'STAFF KEY · ON' : 'STAFF KEY REQUIRED'}</text>
  <circle cx="680" cy="460" r="7" fill="#2a1c10"/><rect x="679" y="460" width="2" height="8" fill="#2a1c10"/>
  ${['201', '202', '203', '204', '205', '206'].map((room, i) => {
    const y = 172 + i * 50, gst = { 201: 'fern', 202: 'anchor', 203: 'moon', 204: 'swallow', 205: 'bell', 206: 'fox' }[room];
    return `<circle cx="580" cy="${y + 14}" r="18" fill="${at === room ? '#f0d890' : '#2a1c10'}" stroke="#5a4214" stroke-width="2"/>
      ${symAt(EMBLEMS, gst, 568, y + 2, 24, at === room ? '#2a1c10' : '#f0d890')}
      <text x="612" y="${y + 21}" font-size="20" font-family="Courier New, monospace" fill="#2a1c10">${room}</text>`;
  }).join('')}
  ` + finish();
};

const letter = () => deskTop() + `
  <g transform="rotate(1.5 400 300)">
    <rect x="146" y="46" width="520" height="500" fill="#000" opacity=".45"/>
    <rect x="140" y="40" width="520" height="500" fill="#f4efe2"/>
    ${symAt(EMBLEMS, 'moon', 590, 60, 40, '#8a8a98')}
    <g fill="#2a2a4a" ${hand} font-size="19">
      <text x="170" y="100">To the guest in 204,</text>
      <text x="170" y="150">You were right about this place.</text>
      <text x="170" y="180">It took my days too, years ago,</text>
      <text x="170" y="210">and tonight it will take yours if it can.</text>
      <text x="170" y="260">I can't leave any more. You still can.</text>
      <text x="170" y="310">The days aren't destroyed, I'm sure of it.</text>
      <text x="170" y="340">They keep them, somewhere below the</text>
      <text x="170" y="370">ballroom. The music opens the way.</text>
      <text x="170" y="420">I've left you my dance card.</text>
      <text x="400" y="490">— Aiko Ito, room 203</text>
    </g>
  </g>` + finish();

// ---------------------------------------------------------------- hotspots

const seatRect = (t, side) => [side === 'l' ? t.x - 62 : t.x + 18, t.y - 22, 44, 30];

function openBallroom(g) {
  g.set('ballroomOpen');
  g.say('You slide Miss Ito\'s dance card into the brass slot. Somewhere a bolt draws back, the slot hands the card back, and the waltz grows louder.');
}

const presentHotspots = [
  { id: 'service', label: 'Service stairs', rect: [18, 146, 96, 190], go: 'r2-room' },
  { id: 'windows', label: 'Windows', rect: [122, 70, 222, 232], say: 'Rain, and beyond it a street that never quite comes into focus.' },
  { id: 'ballroom', label: 'Ballroom doors', rect: [378, 96, 124, 240], when: g => !g.flag('ballroomOpen'),
    sparkle: g => g.has('dancecard'),
    click: g => g.has('dancecard') ? openBallroom(g)
      : g.say(g.flag('itemsDone')
        ? 'Locked. A brass slot reads: DANCE CARDS. The guests\' notes mentioned the service lift...'
        : 'Locked. Behind the doors a waltz plays, the same eight bars over and over. A brass slot reads: DANCE CARDS.'),
    use: { dancecard: g => openBallroom(g) } },
  { id: 'ballroom-open', label: 'Into the ballroom', rect: [378, 96, 124, 240], when: g => g.flag('ballroomOpen'), sparkle: true, go: 'r4-ballroom' },
  { id: 'lift', label: g => g.flag('itemsDone') && !g.flag('letterRead') ? 'Service lift (call it down)' : 'Service lift',
    rect: [550, 146, 144, 148], go: 'r3-lift', sparkle: g => g.flag('itemsDone') && !g.flag('letterRead') },
  { id: 'spike', label: 'Order slips', rect: [708, 256, 42, 52], say: 'Kitchen order slips. Someone has copied every order into the reservation book on the lectern.' },
  { id: 'lostbox', label: g => g.flag('seatingDone') && !g.flag('itemsDone') ? 'Lost property (not empty now)' : 'Lost-property box',
    rect: [748, 270, 50, 40], sparkle: g => g.flag('seatingDone') && !g.flag('itemsDone'),
    click: g => {
      if (g.flag('itemsDone')) return g.go('r3-accounts');
      if (!g.flag('seatingDone')) return g.say('A wicker box marked LOST PROPERTY. Empty, as if nothing was ever left behind.');
      g.puzzle('r3-items');
    } },
  { id: 'sideboard', label: 'Sideboard', rect: [700, 314, 100, 108], say: 'Cutlery, sorted and polished. Napkins folded into swans.' },
  { id: 'lectern', label: "Maître d's lectern", rect: [24, 368, 98, 172], go: 'r3-lectern', sparkle: g => !g.flag('seatingDone') },
  ...TABLES.map(t => ({ id: `table${t.n}`, label: `Table ${t.n}`, rect: [t.x - 74, t.y - 20, 148, 54],
    say: g => g.flag('seatingDone') ? `Table ${t.n}, set again with its place cards.` : `Table ${t.n}. Laid neatly, for guests who never came down.` })),
];

const pastHotspots = TABLES.flatMap(t => t.seats.map(side => {
  const seat = SEATING[`t${t.n}${side}`];
  const where = `table ${t.n}, ${t.seats.length === 1 ? 'the only seat' : side === 'l' ? 'left seat' : 'right seat'}`;
  return {
    id: `past-t${t.n}${side}`, era: 'past', label: `Table ${t.n}, ${t.seats.length === 1 ? 'seat' : side === 'l' ? 'left' : 'right'}`,
    rect: seatRect(t, side),
    sparkle: g => !g.hasNote(`seat-t${t.n}${side}`),
    click: g => {
      g.note(`seat-t${t.n}${side}`, `Photo: ${where}: ${DISH_NAMES[seat.dish]}.`);
      g.say(`In the photo, ${where}: ${DISH_NAMES[seat.dish]}.`);
    },
  };
}));

// ---------------------------------------------------------------- export

export default {
  id: 'r3',
  name: 'Breakfast Room',
  hints: [
    { when: g => !g.flag('seatingDone'), text: g => g.difficulty === 'easy'
      ? 'The reservation book (at the lectern) says who sat at each table and what they ordered. Press Yesterday and click the plates to see which seat had which dish. The one guest nobody named goes with you at table 3.'
      : 'The reservations and yesterday\'s photo together tell you who sat where.' },
    { when: g => !g.flag('itemsDone'), text: g => g.difficulty === 'easy'
      ? 'The lost-property box is full now. Each item carries its owner\'s emblem, and the corridor upstairs had clues too (pipe smoke behind 202, a pen scratching behind 205).'
      : 'Things have reappeared in the lost-property box. Whose is whose?' },
    { when: g => !g.flag('letterRead'), text: g => g.difficulty === 'easy'
      ? 'Read what the guests wrote: Miss Ito sent the service lift up to her own room. The key from the lost-property box works the lift; call it from 203.'
      : 'The guests\' notes say where the envelope went. The service lift has one button per room.' },
    { when: g => !g.flag('ballroomOpen'), text: 'The ballroom doors take dance cards.' },
    { text: 'The ballroom is open.' },
  ],

  scenes: {
    'r3-breakfast': {
      room: 'r3',
      art: g => breakfastArt(g, false),
      past: g => breakfastArt(g, true),
      enter: g => {
        if (g.flag('r3Seen')) return;
        g.set('r3Seen');
        g.say('The breakfast room. Four tables laid for guests who never came down. Somewhere beyond the far doors, a waltz.', 6000);
      },
      onPast: g => g.note('r3-photo', "Yesterday's breakfast, photographed at <b>9.00 am</b>. Every seat still has its plate."),
      hotspots: [...presentHotspots, ...pastHotspots],
    },

    'r3-lectern': {
      room: 'r3', art: lectern, nav: { back: 'r3-breakfast' },
      enter: g => g.note('reservations', 'Reservations, 6 Nov: table 1 the Vales (porridge ×2); table 2 Capt. Orme (kippers) and Dr Brandt (black coffee); table 3 <b>room 204 (boiled egg), for two</b>, the guest (tea with lemon) not named; table 4 Mr Okonkwo (full breakfast).'),
      hotspots: [
        { id: 'plan', label: g => g.flag('seatingDone') ? 'Seating plan' : 'Set out the place cards', rect: [410, 150, 290, 220],
          sparkle: g => !g.flag('seatingDone'),
          click: g => g.flag('seatingDone') ? g.say('Every guest back in their seat. And at table 3: you, and Miss Ito.') : g.puzzle('r3-seating') },
      ],
    },


    'r3-accounts': { room: 'r3', art: accounts, nav: { back: 'r3-breakfast' }, hotspots: [] },

    'r3-lift': {
      room: 'r3', art: lift, nav: { back: 'r3-breakfast' },
      hotspots: [
        ...['201', '202', '203', '204', '205', '206'].map((room, i) => ({
          id: `call${room}`, label: `Call from ${room}`, circle: [580, 186 + i * 50, 22],
          use: { liftkey: g => { g.take('liftkey'); g.set('liftUnlocked'); g.say('The key turns in the little lock under the buttons. The panel hums. Now, which room?'); } },
          click: g => {
            if (!g.flag('liftUnlocked')) {
              if (!g.has('liftkey')) return g.say('The button clicks, but nothing moves. A brass plate beneath the buttons: STAFF KEY REQUIRED.');
              g.take('liftkey');
              g.set('liftUnlocked');
            }
            g.set('liftAt', room);
            if (room === '203') return g.say(g.flag('letterRead')
              ? 'Down from 203: the empty car, smelling faintly of lemon.'
              : 'The ropes creak. Down from 203 comes the car, and in it an envelope with a little silver moon.', 6000);
            g.say(LIFT_CONTENTS[room], 6000);
          },
        })),
        { id: 'envelope', label: 'Envelope', rect: [230, 360, 160, 100], when: g => g.get('liftAt') === '203' && !g.flag('letterRead'),
          sparkle: true,
          click: g => {
            g.set('letterRead');
            g.give('dancecard');
            g.note('letter', 'Miss Ito\'s letter: <i>"The days aren\'t destroyed. They keep them, somewhere below the ballroom. The music opens the way. I\'ve left you my dance card."</i>');
            g.go('r3-letter');
          } },
      ],
    },

    'r3-letter': { room: 'r3', art: letter, nav: { back: 'r3-lift' }, hotspots: [] },
  },

  puzzles: {
    'r3-seating': {
      type: 'assign',
      prompt: 'The seating plan, laid out the way you see the room. Click a place card, then the seat it belongs at.',
      width: 460, height: 340,
      art: seatingPlanArt(),
      slots: PLAN_SLOTS,
      tokens: [
        ...['fern', 'fern', 'anchor', 'moon', 'swallow', 'bell', 'fox'].map((e, i) => ({
          id: `${e}${i}`, type: e,
          label: `<svg viewBox="0 0 40 40"><g style="color:#2a3a5a">${EMBLEMS[e]}</g></svg>`,
          mark: `<rect x="-20" y="-16" width="40" height="32" rx="3" fill="#f4efe2" stroke="#8a7a5a"/><g transform="translate(-12,-12) scale(.6)" style="color:#2a3a5a">${EMBLEMS[e]}</g>`,
        })),
      ],
      solution: Object.fromEntries(Object.entries(SEATING).map(([slot, s]) => [slot, s.emblem])),
      doneText: 'Everyone is back in their seat.',
      wrongText: 'Every seat is filled, but something is wrong. Check the plates in the photo.',
      solve: g => {
        g.set('seatingDone');
        g.note('companion', 'Table 3, breakfast for two: <b>me and Miss Ito (203)</b>. Her tea with lemon, my boiled egg.');
        g.effect('shutter');
        g.say('As the last card goes down, the room seems to exhale. For a moment you smell coffee and toast... and the lost-property box, empty a moment ago, is not empty any more.', 8000);
      },
    },

    'r3-items': {
      type: 'assign',
      prompt: 'Things left at breakfast yesterday. Click an item to look at it, then the guest it belongs to. (Your notebook has what you heard in the corridor.)',
      width: 460, height: 230,
      art: guestBoardArt(),
      slots: GUESTS.map((gst, i) => ({ id: gst.id, x: 46 + i * 92, y: 160, r: 26 })),
      tokenSize: 84,
      boardWidth: 430,
      tokens: Object.keys(ITEM_ICONS).map(id => ({
        id, type: ITEM_OWNERS[id],
        label: itemSvg(id),
        name: ITEM_INFO[id][0],
        desc: ITEM_INFO[id][1],
        mark: `<circle r="25" fill="#efe6cf"/><g transform="translate(-21,-21) scale(.7)">${ITEM_ICONS[id]}</g>`,
      })),
      solution: Object.fromEntries(GUESTS.map(gst => [gst.id, gst.id])),
      doneText: 'Each one returned.',
      wrongText: 'Not quite. Look at the emblems, and remember the corridor.',
      solve: g => {
        g.set('itemsDone');
        g.give('liftkey');
        for (const a of ACCOUNTS) g.note(`account-${a.who}`, `${a.who} wrote: <i>"${a.text.join(' ')}"</i>`);
        g.note('liftkey', 'At the bottom of the lost-property box: a <b>service lift key</b>.');
        g.go('r3-accounts');
        g.say('Tucked inside each item is a folded note, in its owner\'s hand: they have been losing days too. And at the bottom of the box, a small brass key marked SERVICE LIFT.', 8000);
      },
    },
  },
};

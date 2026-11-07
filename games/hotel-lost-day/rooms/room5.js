// ROOM 5 — Manager's Office
// Purpose: discover the hotel's deception and your previous attempt.
// Fact: your thirty annual visits are fabricated; you arrived yesterday.
//
//   1. Yesterday's photo of the office (stamped 11.35 pm, just before you revoked) shows the
//      portrait swung open like a door, with the filing key on a hook behind it. Today the
//      portrait is shut; once you've seen the photo, swing it aside and take the key.
//      The ledger (30 days "annual, since 1995", "the guest must believe it") is story only.
//   2. The filing system (needs the key): a card catalogue, rows by guest emblem,
//      columns by month symbol (legend card). Swallow + November -> your original
//      agreement, your own revocation from last night, and the brass "6" tile.
//   3. The calendar that lost a day: its day wheel jumps from 5 to 7. Fit the 6, then
//      set the wheels to yesterday (the newspaper says today is Friday 7 November):
//      THU 6 NOV -> the wall behind the calendar opens onto the lost day.
//
// The photo also shows the calendar as it was: THU 6 NOV (a second route to step 3).

import { DEFS, closeup, deskTop, finish, rainWindow, lamp, hand, serif } from '../art/common.js';
import { EMBLEMS, symAt } from '../art/symbols.js';

// ---------------------------------------------------------------- data

const FOLIOS = [
  { room: '201', emblem: 'fern', name: 'Mr & Mrs Vale', lines: ['14 Mar 1996: a quarrel', '2 Jun 2009: a winter'] },
  { room: '202', emblem: 'anchor', name: 'Capt. H. Orme', lines: ['9 Oct 1989: the storm'] },
  { room: '203', emblem: 'moon', name: 'Miss A. Ito', lines: ['1 Jan 1995: everything before'] },
  { room: '204', emblem: 'swallow', name: null, lines: ['6 Nov 2025: one day (see agreement)'], stamp: 'FIRST STAY' },
  { room: '205', emblem: 'bell', name: 'Dr L. Brandt', lines: ['18 Apr 2001: a diagnosis'], hardLines: ['3 Jul 2012: a letter — VOID'] },
  { room: '206', emblem: 'fox', name: 'Mr K. Okonkwo', lines: ['22 Aug 1999: a goodbye'], hardLines: ['5 Feb 2016: a name'] },
];
const linesOf = (f, g) => g.difficulty === 'hard' ? [...f.lines, ...(f.hardLines ?? [])] : f.lines;
// the ledger's claim: 30 for you ("annual since 1995"), and on hard it also counts the void line
const claimedFor = (f, g) => f.room === '204' ? 30 : linesOf(f, g).length;
const claimedTotal = g => FOLIOS.reduce((a, f) => a + claimedFor(f, g), 0);

// Filing system: rows = guest emblems, columns = months (by symbol, see the legend).
const ROWS = ['fern', 'anchor', 'moon', 'swallow', 'bell', 'fox'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SYMBOLS = {   // 24x24 drawings, all different shapes
  JAN: `<g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2 V22 M3 7 L21 17 M3 17 L21 7"/></g>`,
  FEB: `<path d="M12 21 L3 12 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 Z" fill="currentColor"/>`,
  MAR: `<path d="M12 2 L20 10 L12 22 L4 10 Z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 22 q4 -2 2 -6" stroke="currentColor" stroke-width="1.5" fill="none"/>`,
  APR: `<path d="M12 3 q7 9 7 13 a7 7 0 0 1 -14 0 q0 -4 7 -13 Z" fill="currentColor"/>`,
  MAY: `${[0, 72, 144, 216, 288].map(a => `<ellipse cx="12" cy="6" rx="3.5" ry="5" transform="rotate(${a} 12 12)" fill="currentColor"/>`).join('')}<circle cx="12" cy="12" r="3" fill="#efe6cf"/>`,
  JUN: `<circle cx="12" cy="12" r="5" fill="currentColor"/><g stroke="currentColor" stroke-width="2">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="12" y1="2" x2="12" y2="5" transform="rotate(${a} 12 12)"/>`).join('')}</g>`,
  JUL: `<path d="M2 14 q5 -6 10 0 t10 0" stroke="currentColor" stroke-width="2.5" fill="none"/><path d="M2 19 q5 -6 10 0 t10 0" stroke="currentColor" stroke-width="2.5" fill="none"/>`,
  AUG: `<path d="M12 22 V8" stroke="currentColor" stroke-width="2"/>${[8, 12, 16].map(y => `<ellipse cx="9" cy="${y}" rx="3" ry="2" fill="currentColor"/><ellipse cx="15" cy="${y}" rx="3" ry="2" fill="currentColor"/>`).join('')}<ellipse cx="12" cy="4" rx="2" ry="3" fill="currentColor"/>`,
  SEP: `<circle cx="12" cy="14" r="8" fill="currentColor"/><path d="M12 6 q2 -4 5 -4" stroke="currentColor" stroke-width="2" fill="none"/>`,
  OCT: `<path d="M12 2 q9 6 4 16 q-4 4 -8 0 q-5 -10 4 -16 Z" fill="currentColor"/><path d="M12 22 V6" stroke="#efe6cf" stroke-width="1.5"/>`,
  NOV: `<path d="M2 12 a10 9 0 0 1 20 0 Z" fill="currentColor"/><path d="M12 12 V20 q0 3 -3 3 q-2 0 -2 -2" stroke="currentColor" stroke-width="2" fill="none"/>`,
  DEC: `<path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 16.5 L5.5 21 L8 13.5 L2 9 L9.5 9 Z" fill="currentColor"/>`,
};
const msym = (m, x, y, size, color = '#2a1c10') => `<g transform="translate(${x},${y}) scale(${size / 24})" style="color:${color}">${MONTH_SYMBOLS[m]}</g>`;
const FILE_GRID = { x: 150, y: 150, cw: 40, rh: 50 };

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const dayList = g => Array.from({ length: 31 }, (_, i) => String(i + 1)).filter(d => d !== '6' || g.flag('tileIn'));

// ---------------------------------------------------------------- art

function calendarBox(g, x, y, s = 1, past = false) {
  const done = past || g.flag('calendarDone');
  const [wd, d, m] = done ? ['THU', '6', 'NOV'] : ['FRI', '7', 'NOV'];
  return `<g transform="translate(${x},${y}) scale(${s})">
    <rect width="150" height="170" rx="10" fill="url(#brassG)" stroke="#5a4214" stroke-width="3"/>
    <circle cx="75" cy="30" r="18" fill="#2a1c10"/><circle cx="75" cy="30" r="12" fill="url(#brassG)"/>
    ${[[14, 'wd', wd], [62, 'd', d], [104, 'm', m]].map(([cx, , txt], i) => `
      <rect x="${cx}" y="62" width="${i === 1 ? 34 : 34}" height="40" rx="3" fill="#efe6cf" stroke="#5a4214" stroke-width="2"/>
      <text x="${cx + 17}" y="${i === 1 ? 92 : 88}" font-size="${i === 1 ? 24 : 12}" text-anchor="middle" ${serif} font-weight="bold" fill="#2a1c10">${txt}</text>`).join('')}
    <rect x="20" y="118" width="110" height="34" rx="4" fill="#2a1c10"/>
    <text x="75" y="140" font-size="11" text-anchor="middle" ${serif} letter-spacing="2" fill="#f0d890">THE HALCYON</text>
  </g>`;
}

function officeArt(g, past = false) {
  const wallOpen = !past && g.flag('calendarDone');
  const portraitOpen = past || g.flag('portraitOpen');
  const keyThere = past || (g.flag('portraitOpen') && !g.has('filekey') && !g.flag('filesUnlocked'));
  return `${DEFS}
  <rect width="800" height="600" fill="#000"/>
  <rect width="800" height="330" fill="url(#damask)"/>
  <rect width="800" height="26" fill="#2e1c10"/><rect y="26" width="800" height="4" fill="url(#brassG)"/>
  <rect y="300" width="800" height="170" fill="url(#woodG)"/>
  ${[0, 1, 2, 3, 4].map(i => `<rect x="${14 + i * 160}" y="316" width="132" height="140" fill="none" stroke="#1e120a" stroke-width="3"/>`).join('')}
  <rect y="466" width="800" height="134" fill="#3a1416"/>
  <rect y="466" width="800" height="6" fill="#1e120a"/>

  <!-- the panel behind the calendar: a hidden door -->
  ${wallOpen ? `
    <rect x="318" y="70" width="164" height="396" fill="#140c06"/>
    <rect x="318" y="70" width="164" height="396" fill="url(#lampGlow)" opacity=".8"/>
    <polygon points="318,70 300,80 300,456 318,466" fill="url(#woodG)" stroke="#1e120a"/>
    <text x="400" y="110" font-size="13" text-anchor="middle" ${serif} letter-spacing="3" fill="#f0d890">6 NOVEMBER</text>
  ` : `<rect x="318" y="70" width="164" height="396" fill="none" stroke="#1e120a" stroke-width="1.5" opacity=".5"/>`}
  ${wallOpen ? '' : calendarBox(g, 325, 84, 1, past)}

  <!-- portrait with the face painted over; it swings open like a door -->
  ${portraitOpen ? `
    <rect x="204" y="84" width="88" height="116" fill="#1a100a" stroke="#0e0804" stroke-width="2"/>
    <circle cx="248" cy="108" r="3" fill="url(#brassG)"/>
    ${keyThere ? `<path d="M248 108 v10" stroke="#c9a33b" stroke-width="1.5"/><circle cx="248" cy="124" r="6" fill="none" stroke="url(#brassG)" stroke-width="3"/>
      <path d="M248 130 v22 M248 144 h6 M248 150 h5" stroke="url(#brassG)" stroke-width="3"/>
      <rect x="236" y="160" width="24" height="12" fill="#efe6cf"/><text x="248" y="169" font-size="7" text-anchor="middle" ${serif} fill="#2a1c10">FILES</text>` : ''}
    <polygon points="200,80 158,94 158,212 200,204" fill="url(#brassG)"/>
    <polygon points="196,88 164,99 164,204 196,198" fill="#3a2a1e"/>
  ` : `
  <rect x="200" y="80" width="96" height="124" fill="url(#brassG)"/>
  <rect x="210" y="90" width="76" height="104" fill="#3a2a1e"/>
  <path d="M222 194 q26 -40 52 0 Z" fill="#1e1410"/><circle cx="248" cy="134" r="18" fill="#6a5040"/>
  <path d="M228 120 q20 -10 40 4 q-6 20 -20 26 q-16 -6 -20 -30 Z" fill="#4a3a2e"/>`}
  <rect x="230" y="208" width="36" height="10" fill="#2a1c10"/>

  <!-- card catalogue (filing system) -->
  <rect x="24" y="150" width="160" height="316" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  ${Array.from({ length: 6 }, (_, r) => Array.from({ length: 4 }, (_, c) => `<rect x="${32 + c * 37}" y="${160 + r * 50}" width="32" height="42" fill="#5a3a24" stroke="#1e120a"/>
    <rect x="${42 + c * 37}" y="${176 + r * 50}" width="12" height="4" fill="url(#brassG)"/>`).join('')).join('')}
  <text x="104" y="462" font-size="9" text-anchor="middle" ${serif} letter-spacing="1" fill="#f0d890">AGREEMENTS</text>

  <!-- window -->
  ${rainWindow(580, 96, 130, 180, 'r5win')}
  <path d="M566 86 q14 100 4 200 h22 q-8 -100 -4 -200 Z" fill="#5a1a22"/><path d="M724 86 q-14 100 -4 200 h-22 q8 -100 4 -200 Z" fill="#5a1a22"/>

  <!-- desk -->
  <path d="M370 330 v-60 q30 -18 60 0 v60 Z" fill="#2a1414"/>
  <rect x="220" y="326" width="390" height="16" fill="#6a4a2e"/>
  <rect x="232" y="342" width="366" height="124" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  <rect x="380" y="352" width="70" height="20" fill="#2a1c10"/>
  <text x="415" y="366" font-size="8" text-anchor="middle" ${serif} letter-spacing="1" fill="#f0d890">THE MANAGER</text>
  <!-- ledger -->
  <polygon points="306,326 356,320 358,308 310,312" fill="#efe6cf"/><polygon points="356,320 404,326 402,312 358,308" fill="#e6dcc0"/>
  <path d="M314 316 l36 -3 M314 320 l36 -3 M362 312 l34 3 M362 316 l34 3" stroke="#8a7a5a" stroke-width="1"/>
  <!-- adding machine -->
  <rect x="420" y="296" width="74" height="32" rx="4" fill="#2a2a30" stroke="#111" stroke-width="2"/>
  ${Array.from({ length: 10 }, (_, i) => `<circle cx="${428 + (i % 5) * 9}" cy="${306 + Math.floor(i / 5) * 9}" r="3" fill="#d8d0c0"/>`).join('')}
  <rect x="476" y="302" width="12" height="20" rx="2" fill="#a8322a"/>
  <rect x="452" y="282" width="18" height="16" fill="#f4efe2"/>
  <!-- newspaper -->
  <polygon points="512,326 590,322 586,302 508,306" fill="#e8e4d8" stroke="#a8a090"/>
  <path d="M516 310 h60 M516 315 h40" stroke="#5a5a5a" stroke-width="1.5"/>
  ${lamp(580, 280, 0.6)}

  <!-- umbrella stand -->
  <rect x="690" y="400" width="40" height="66" fill="#3a3a3a"/>
  <path d="M700 400 l-6 -90 q20 -10 30 6 l-8 84" fill="#2a2a4a"/>
  <path d="M706 466 q4 8 10 0" stroke="#7a8aa0" stroke-width="2" fill="none"/>
  ${past ? `<text x="772" y="584" font-size="22" text-anchor="end" font-family="Courier New, monospace" font-weight="bold"
    fill="#ff9a3a" opacity=".85" filter="url(#hGlow)">6 NOV 11.35 PM</text>` : ''}
  ` + finish();
}

const ledger = g => deskTop() + `
  <g transform="rotate(-1 400 300)">
    <rect x="66" y="46" width="668" height="500" rx="6" fill="#000" opacity=".45"/>
    <rect x="60" y="40" width="668" height="500" rx="6" fill="#1e2a1e"/>
    <rect x="74" y="52" width="318" height="476" fill="#efe6cf"/><rect x="396" y="52" width="318" height="476" fill="#ece2c8"/>
    <rect x="388" y="52" width="8" height="476" fill="#000" opacity=".2"/>
    <text x="233" y="92" font-size="18" text-anchor="middle" ${serif} letter-spacing="2" fill="#2a1c10">DAYS HELD</text>
    <text x="233" y="112" font-size="11" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">guests in residence, 7 November</text>
    ${FOLIOS.map((f, i) => `
      <text x="96" y="${156 + i * 44}" font-size="15" font-family="Courier New, monospace" fill="#2a1c10">Room ${f.room}</text>
      ${symAt(EMBLEMS, f.emblem, 196, 140 + i * 44, 20, '#2a3a5a')}
      <text x="370" y="${156 + i * 44}" font-size="18" text-anchor="end" font-family="Courier New, monospace" font-weight="bold" fill="#2a1c10">${claimedFor(f, g)}</text>
      ${f.room === '204' ? `<text x="226" y="${156 + i * 44}" font-size="11" ${serif} font-style="italic" fill="#5a4a3a">annual, since 1995</text>` : ''}
      <line x1="90" y1="${166 + i * 44}" x2="376" y2="${166 + i * 44}" stroke="#c8bca0"/>`).join('')}
    <text x="96" y="446" font-size="16" font-family="Courier New, monospace" font-weight="bold" fill="#2a1c10">TOTAL HELD</text>
    <text x="370" y="446" font-size="22" text-anchor="end" font-family="Courier New, monospace" font-weight="bold" fill="#2a1c10">${claimedTotal(g)}</text>
    <g fill="#2a1c10" ${serif} font-size="15" font-style="italic">
      <text x="420" y="100">Manager's standing order:</text>
      <text x="420" y="140">Every guest is a regular.</text>
      <text x="420" y="166">Every guest has always</text>
      <text x="420" y="192">been a regular.</text>
    </g>
    <text x="555" y="320" font-size="13" text-anchor="middle" ${hand} fill="#7a1e22">Room 204: renew annually.</text>
    <text x="555" y="344" font-size="13" text-anchor="middle" ${hand} fill="#7a1e22">The guest must believe it.</text>
  </g>` + finish();

const newspaper = () => deskTop() + `
  <g transform="rotate(2 400 300)">
    <rect x="136" y="66" width="540" height="460" fill="#000" opacity=".4"/>
    <rect x="130" y="60" width="540" height="460" fill="#ece8dc"/>
    <text x="400" y="118" font-size="38" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" fill="#1a1a1a">THE EVENING STAR</text>
    <line x1="150" y1="134" x2="650" y2="134" stroke="#1a1a1a" stroke-width="2"/>
    <text x="400" y="156" font-size="16" text-anchor="middle" ${serif} font-weight="bold" fill="#1a1a1a">FRIDAY, 7 NOVEMBER</text>
    <line x1="150" y1="166" x2="650" y2="166" stroke="#1a1a1a" stroke-width="1"/>
    <text x="400" y="216" font-size="30" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" fill="#1a1a1a">RAIN TO CONTINUE</text>
    ${Array.from({ length: 9 }, (_, i) => `<rect x="160" y="${246 + i * 26}" width="${220 - (i % 3) * 30}" height="6" fill="#8a8a8a"/><rect x="420" y="${246 + i * 26}" width="${220 - (i % 4) * 24}" height="6" fill="#8a8a8a"/>`).join('')}
    <text x="400" y="500" font-size="12" text-anchor="middle" ${serif} font-style="italic" fill="#5a5a5a">The same edition is delivered every morning.</text>
  </g>` + finish();

const files = g => {
  const { x, y, cw, rh } = FILE_GRID;
  const unlocked = g.flag('filesUnlocked'), opened = g.get('drawerOpened');
  let grid = '';
  ROWS.forEach((e, r) => MONTHS.forEach((m, c) => {
    const dx = x + c * cw, dy = y + r * rh, open = opened === `${e}-${m}`;
    grid += `<rect x="${dx + 2}" y="${dy + 2}" width="${cw - 4}" height="${rh - 4}" fill="${open ? '#1a100a' : '#5a3a24'}" stroke="#1e120a"/>
      ${open ? '' : `<rect x="${dx + cw / 2 - 7}" y="${dy + rh / 2 - 2}" width="14" height="5" rx="2" fill="url(#brassG)"/>`}`;
  }));
  return closeup('#1a120c') + `
  <rect x="90" y="96" width="560" height="372" fill="url(#woodG)" stroke="#1e120a" stroke-width="4"/>
  ${ROWS.map((e, r) => `<rect x="100" y="${y + r * rh + 6}" width="42" height="${rh - 12}" fill="#efe6cf"/>${symAt(EMBLEMS, e, 106, y + r * rh + 10, 30, '#2a3a5a')}`).join('')}
  ${MONTHS.map((m, c) => `<rect x="${x + c * cw + 3}" y="104" width="${cw - 6}" height="40" fill="#efe6cf"/>${msym(m, x + c * cw + 8, 112, 24)}`).join('')}
  ${grid}
  ${unlocked ? '' : `<rect x="356" y="72" width="88" height="22" rx="4" fill="url(#brassG)"/><circle cx="400" cy="83" r="5" fill="#2a1c10"/>`}
  <!-- legend card -->
  <g transform="rotate(2 720 300)">
    <rect x="664" y="96" width="124" height="372" fill="#f4efe2" stroke="#8a7a5a" stroke-width="2"/>
    <text x="726" y="118" font-size="11" text-anchor="middle" ${serif} font-weight="bold" fill="#2a1c10">FILING KEY</text>
    <text x="726" y="134" font-size="8" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">rows: guest · columns: month</text>
    ${MONTHS.map((m, i) => `${msym(m, 676, 142 + i * 27, 20)}<text x="704" y="${157 + i * 27}" font-size="12" ${serif} fill="#2a1c10">${MONTH_NAMES[i]}</text>`).join('')}
  </g>
  ` + finish();
};

const agreement = () => deskTop() + `
  <g transform="rotate(-2 270 300)">
    <rect x="66" y="46" width="380" height="500" fill="#000" opacity=".4"/>
    <rect x="60" y="40" width="380" height="500" fill="#f4efe2" stroke="#b8a888"/>
    <text x="250" y="80" font-size="17" text-anchor="middle" ${serif} letter-spacing="2" fill="#2a1c10">THE HALCYON</text>
    <text x="250" y="102" font-size="13" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Agreement to surrender one day</text>
    <g ${serif} fill="#2a1c10" font-size="14">
      <text x="84" y="146">I, the undersigned, of room 204,</text>
      <text x="84" y="170">freely surrender one day:</text>
      <text x="84" y="208" font-size="13.5" font-style="italic">the memory of 14 May 2019, Saltmere station</text>
      <rect x="80" y="190" width="92" height="26" fill="#1a1208"/>
      <rect x="292" y="188" width="128" height="28" fill="#1a1208"/>
      <text x="84" y="246">to be held by the hotel, and forgotten</text>
      <text x="84" y="270">by me, in exchange for one night's</text>
      <text x="84" y="294">peace.</text>
      <text x="84" y="340">Signed, 8.15 am, 6 November 2025.</text>
      <text x="84" y="364" font-weight="bold">First visit.</text>
    </g>
    <path d="M90 410 q20 -16 34 -4 t30 -8 q12 14 28 -6 q14 10 34 -6" stroke="#1f2a5a" stroke-width="2" fill="none"/>
    ${symAt(EMBLEMS, 'swallow', 380, 396, 34, '#2a3a5a')}
  </g>
  <g transform="rotate(3 560 300)">
    <rect x="446" y="76" width="320" height="300" fill="#000" opacity=".4"/>
    <rect x="440" y="70" width="320" height="300" fill="#efe6cf" stroke="#b8a888"/>
    <g fill="#1f2a5a" ${hand} font-size="17">
      <text x="462" y="112" font-weight="bold">REVOKED. 11.40 pm, 6 Nov.</text>
      <text x="462" y="150">I don't consent any more.</text>
      <text x="462" y="178">I've seen what it costs.</text>
      <text x="462" y="206">I want my day back.</text>
      <text x="462" y="250">(the calendar is how they</text>
      <text x="462" y="276">turn the day. I took the 6.</text>
      <text x="462" y="302">put it back, set yesterday.)</text>
      <text x="640" y="346">— me</text>
    </g>
  </g>
  <g transform="translate(520,430) rotate(-8)">
    <rect width="64" height="76" rx="6" fill="url(#brassG)" stroke="#5a4214" stroke-width="3"/>
    <text x="32" y="60" font-size="56" text-anchor="middle" ${serif} font-weight="bold" fill="#2a1c10">6</text>
  </g>` + finish();

// ---------------------------------------------------------------- hotspots

function openDrawer(g, e, m) {
  if (!g.flag('filesUnlocked')) {
    if (!g.has('filekey')) return g.say('The whole catalogue is locked. There is a keyhole at the top.');
    g.take('filekey');
    g.set('filesUnlocked');
    g.say('The filing key turns, and every drawer is free.');
  }
  g.set('drawerOpened', `${e}-${m}`);
  const mi = MONTHS.indexOf(m);
  if (e === 'swallow' && m === 'NOV') {
    if (!g.flag('filesDone')) {
      g.set('filesDone');
      g.give('tile6');
      g.note('agreement', 'My original agreement: signed <b>8.15 am, 6 November 2025</b>, <b>first visit</b>. What I surrendered is mostly inked out: <i>"...14 May 2019, Salt..."</i>');
      g.note('revoked', 'In my own hand, 11.40 pm on 6 Nov: <i>"REVOKED. I want my day back. The calendar is how they turn the day. I took the 6. Put it back, set yesterday."</i>');
    }
    return g.go('r5-agreement');
  }
  const gst = { fern: 'the Vales', anchor: 'Captain Orme', moon: 'Miss Ito', swallow: 'room 204', bell: 'Dr Brandt', fox: 'Mr Okonkwo' }[e];
  g.say(e === 'swallow'
    ? `Room 204, ${MONTH_NAMES[mi]}: a thick bundle of renewals, one for every year since 1995, all in the same neat clerk's hand.`
    : `Agreements for ${gst}, ${MONTH_NAMES[mi]}. Not yours.`);
}

function useCalendar(g) {
  if (g.flag('calendarDone')) return;
  if (!g.flag('tileIn')) {
    if (!g.has('tile6')) return g.say('A brass perpetual calendar: FRI 7 NOV. Turning the day wheel, it jumps from 5 straight to 7. There is an empty slot where the 6 should be.', 6000);
    g.take('tile6');
    g.set('tileIn');
    g.say('You press the brass 6 back into its slot on the day wheel. It clicks home as if it never left.');
  }
  g.puzzle('r5-calendar');
}

// ---------------------------------------------------------------- export

export default {
  id: 'r5',
  name: "Manager's Office",
  hints: [
    { when: g => !g.has('filekey') && !g.flag('filesUnlocked'), text: g => g.difficulty === 'easy'
      ? "Press Yesterday (top right) and look at the portrait in the photo. Then go back to Today and do the same."
      : "Your camera has a photo of this office from last night. What was different?" },
    { when: g => !g.flag('filesDone'), text: g => g.difficulty === 'easy'
      ? 'The filing key opens the card catalogue. Rows are guest emblems, columns are months (see the filing key card). Yours: the swallow row, the November column.'
      : 'Agreements are filed by guest and by month. Whose agreement, and when?' },
    { when: g => !g.flag('tileIn'), text: "The calendar's day wheel is missing its 6. You know where it is now." },
    { when: g => !g.flag('calendarDone'), text: g => g.difficulty === 'easy'
      ? 'Set the calendar to yesterday. The newspaper says today is Friday, 7 November.'
      : 'Turn the calendar back to yesterday. The newspaper knows what day it is.' },
    { text: 'The wall behind the calendar is open.' },
  ],

  scenes: {
    'r5-office': {
      room: 'r5',
      art: officeArt,
      past: g => officeArt(g, true),
      onPast: g => g.note('office-past', "The camera has a photo of this office too, taken at <b>11.35 pm</b> last night."),
      nav: { back: 'r4-archive' },
      enter: g => {
        if (g.flag('r5Seen')) return;
        g.set('r5Seen');
        g.say("The manager's office. A desk, a ledger, a calendar on the wall, and a portrait whose face has been painted over. Nobody is here. Nobody ever seems to be.", 7000);
      },
      hotspots: [
        { id: 'catalogue', label: g => g.has('filekey') ? 'Card catalogue (you have its key)' : 'Card catalogue', rect: [20, 146, 168, 324],
          go: 'r5-files', sparkle: g => g.has('filekey') || (g.flag('filesUnlocked') && !g.flag('filesDone')) },
        { id: 'portrait', label: g => g.flag('portraitOpen') ? 'Behind the portrait' : g.hasNote('office-photo') ? 'Portrait (it was open yesterday)' : 'Portrait',
          rect: [156, 76, 144, 146], sparkle: g => g.hasNote('office-photo') && !g.has('filekey') && !g.flag('filesUnlocked'),
          click: g => {
            if (!g.hasNote('office-photo')) return g.say('THE MANAGER, says the little plate. The face has been painted over, carefully, more than once.');
            if (!g.flag('portraitOpen')) { g.set('portraitOpen'); }
            if (g.has('filekey') || g.flag('filesUnlocked')) return g.say('An empty hook behind the portrait.');
            g.give('filekey');
            g.say('In the photo it stood open like a door, so you pull at the frame. The portrait swings aside on a hinge, and behind it, on a hook, hangs a small key marked FILES.', 7000);
          } },
        { id: 'calendar', label: g => g.has('tile6') ? 'Calendar (fit the missing 6)' : 'Calendar', rect: [322, 80, 156, 176],
          when: g => !g.flag('calendarDone'), sparkle: g => g.has('tile6') || (g.flag('tileIn') && !g.flag('calendarDone')),
          click: useCalendar, use: { tile6: useCalendar } },
        { id: 'wall-open', label: 'Through to 6 November', rect: [318, 70, 164, 396], when: g => g.flag('calendarDone'), sparkle: true, go: 'r6-lostday' },
        { id: 'window', label: 'Window', rect: [566, 86, 160, 200], say: 'The same rain. The same street lamp. The same minute, it feels like, over and over.' },
        { id: 'ledger', label: 'Ledger', rect: [304, 302, 104, 28], go: 'r5-ledger' },
        { id: 'adder', label: 'Adding machine', rect: [414, 278, 86, 52], say: 'An adding machine. Its last tape reads 30, 30, 30, 30...' },
        // --- yesterday (the photo, 11.35 pm: you were here, minutes before you revoked)
        { id: 'past-portrait', era: 'past', label: 'Portrait', rect: [156, 76, 144, 146], sparkle: g => !g.hasNote('office-photo'),
          click: g => { g.note('office-photo', "Yesterday's photo of the office, <b>11.35 pm</b>: the portrait stood <b>open like a door</b>, with a small key marked FILES on a hook behind it."); g.say('In the photo, the portrait stands open like a door. Behind it, on a hook: a small key marked FILES.', 6000); } },
        { id: 'past-calendar', era: 'past', label: 'Calendar', rect: [322, 80, 156, 176],
          click: g => { g.note('office-calendar', "In yesterday's photo the brass calendar read <b>THU 6 NOV</b>."); g.say('In the photo, the calendar still has its 6: THU · 6 · NOV.'); } },
        { id: 'past-room', era: 'past', label: 'Yesterday', rect: [520, 330, 160, 120], say: 'The office, last night at 11.35 pm. Five minutes before you wrote REVOKED.' },
        { id: 'newspaper', label: 'Newspaper', rect: [506, 298, 88, 32], go: 'r5-newspaper' },
        { id: 'desk', label: 'Desk', rect: [232, 342, 366, 124], say: 'A broad desk with a brass plate: THE MANAGER. No name. The chair is still warm.' },
        { id: 'umbrella', label: 'Umbrella stand', rect: [686, 306, 50, 160], say: 'A black umbrella, still dripping. Someone came in from the rain, though nobody ever comes in.' },
      ],
    },

    'r5-ledger': {
      room: 'r5', art: ledger, nav: { back: 'r5-office' },
      enter: g => g.note('ledger', `The manager's ledger claims 30 days held for room 204, "annual, since 1995". Scribbled: <i>"Room 204: renew annually. The guest must believe it."</i>`),
      hotspots: [],
    },
    'r5-newspaper': {
      room: 'r5', art: newspaper, nav: { back: 'r5-office' },
      enter: g => g.note('newspaper', 'Newspaper: <b>Friday, 7 November</b>. "The same edition is delivered every morning."'),
      hotspots: [],
    },
    'r5-files': {
      room: 'r5', art: files, nav: { back: 'r5-office' },
      hotspots: ROWS.flatMap((e, r) => MONTHS.map((m, c) => ({
        id: `drawer-${e}-${m}`, label: `Drawer: ${{ fern: 'fern', anchor: 'anchor', moon: 'moon', swallow: 'swallow', bell: 'bell', fox: 'fox' }[e]}, ${MONTH_NAMES[c]}`,
        rect: [FILE_GRID.x + c * FILE_GRID.cw, FILE_GRID.y + r * FILE_GRID.rh, FILE_GRID.cw, FILE_GRID.rh],
        click: g => openDrawer(g, e, m),
        use: { filekey: g => openDrawer(g, e, m) },
      }))),
    },
    'r5-agreement': {
      room: 'r5', art: agreement, nav: { back: 'r5-files' },
      enter: g => g.say('Your agreement, your revocation, in your own hand, and wrapped inside them the brass 6 from the calendar. You took it, last night, so they could not turn the day.', 7000),
      hotspots: [],
    },
  },

  puzzles: {
    'r5-calendar': {
      type: 'dials',
      prompt: 'The brass calendar. Turn the wheels.',
      config: g => ({ symbols: [WEEKDAYS, dayList(g), MONTHS], start: [WEEKDAYS.indexOf('FRI'), dayList(g).indexOf('7'), MONTHS.indexOf('NOV')], faceWidth: 92, fontSize: 30 }),
      solution: ['THU', '6', 'NOV'],
      solve: g => {
        g.set('calendarDone');
        g.effect('shutter');
        g.say('THU · 6 · NOV. Somewhere deep in the building, a great clock stops, then starts again. The panelled wall behind the calendar swings open, and through it comes the smell of rain and roses.', 8000);
      },
    },
  },
};

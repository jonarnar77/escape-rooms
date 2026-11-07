// ROOM 1 — Reception
// Purpose: find your room and establish that something is wrong.
//
//   1. Which room is yours?  booking card (swallow, smudged number) + room chart -> 204
//   2. The key drawer:       porter's note + luggage tags -> clasp order on the desk lock
//                            -> room key 204 and half a receipt
//   3. The extra day:        reassemble the receipt from the wastepaper basket
//                            -> "6 November: One day surrendered" -> calendar flips 7 > 6 > 7
//                            -> corridor door unlocks (soft bell)
//
// Difficulty: EASY writes all times the same way; MEDIUM mixes time formats;
// HARD randomises departure times (including afternoon ones) and clasps, and
// adds a second decoy scrap to the receipt.

import { DEFS, closeup, deskTop, finish, rainWindow, lamp, wallClock, hand, serif, rng } from '../art/common.js';
import { EMBLEMS, CLASPS, symAt, symSvg } from '../art/symbols.js';

// ---------------------------------------------------------------- data

const GUESTS = [
  { room: '201', emblem: 'fern', name: 'Mr & Mrs Vale' },
  { room: '202', emblem: 'anchor', name: 'Capt. H. Orme' },
  { room: '203', emblem: 'moon', name: 'Miss A. Ito' },
  { room: '204', emblem: 'swallow', name: null },          // you: the name is blotted out
  { room: '205', emblem: 'bell', name: 'Dr. L. Brandt' },
  { room: '206', emblem: 'fox', name: 'Mr K. Okonkwo' },
];

// Luggage, in the order it stands (left to right). time: 'HH:MM' (24h), or null = no departure.
const DEFAULT_BAGS = [
  { room: '205', time: '09:15', clasp: 'circle' },
  { room: '202', time: '07:40', clasp: 'triangle' },
  { room: '204', time: null, clasp: 'square' },
  { room: '201', time: '08:20', clasp: 'diamond' },
];
const bagsOf = g => g.get('h1Bags') ?? DEFAULT_BAGS;
const drawerSolution = g => [...bagsOf(g)]
  .sort((a, b) => (a.time ?? '99') < (b.time ?? '99') ? -1 : 1)
  .map(b => b.clasp);

function setup(g) {
  g.give('booking');
  g.note('start', 'Came down to check out. Today is 7 November.');
  if (g.difficulty !== 'hard') return;
  const r = Math.random;
  const pool = ['06:50', '07:40', '08:20', '09:15', '10:05', '11:30', '13:05', '14:40'];
  const times = [];
  while (times.length < 3) { const t = pool[Math.floor(r() * pool.length)]; if (!times.includes(t)) times.push(t); }
  const clasps = Object.keys(CLASPS).sort(() => r() - 0.5).slice(0, 4);
  const rooms = ['205', '202', '204', '201'].sort(() => r() - 0.5);
  let k = 0;
  g.set('h1Bags', rooms.map((room, i) => ({ room, clasp: clasps[i], time: room === '204' ? null : times[k++] })));
}

/** How a departure time is written on its tag. Easy: all alike. Otherwise mixed styles. */
function fmtTime(t, i, g) {
  if (!t) return 'No departure booked';
  if (g.difficulty === 'easy') return `Departs ${t}`;
  const [h, m] = t.split(':').map(Number);
  const h12 = ((h + 11) % 12) + 1, ap = h < 12 ? 'a.m.' : 'p.m.';
  return ['Departs ' + t, `Departs ${h12}.${String(m).padStart(2, '0')} ${ap}`, `Leaving ${h12}.${String(m).padStart(2, '0')} ${ap}`][i % 3];
}

// ---------------------------------------------------------------- receipt art (300 x 480)

function receiptArt({ room = '204', guest = null, lines, rules = [56, 232], tint = '#f4efe2', footer = true }) {
  const row = (y, date, desc, amt, extra = '') => `
    <text x="14" y="${y}" font-size="11" font-family="Courier New, monospace" fill="#3a3020">${date}</text>
    <text x="64" y="${y}" font-size="12" ${serif} fill="#2a2018" ${extra}>${desc}</text>
    <text x="286" y="${y}" font-size="11" text-anchor="end" font-family="Courier New, monospace" fill="#3a3020" ${extra}>${amt}</text>`;
  return `
    <rect width="300" height="480" fill="${tint}"/>
    ${rules.map(x => `<line x1="${x}" y1="200" x2="${x}" y2="392" stroke="#9cb4d8" stroke-width="1.2"/>`).join('')}
    <text x="150" y="44" font-size="26" text-anchor="middle" ${serif} letter-spacing="3" fill="#2a2018">THE HALCYON</text>
    <text x="150" y="66" font-size="10" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Rooms · Dining · Ballroom · Since 1894</text>
    <line x1="20" y1="80" x2="280" y2="80" stroke="#8a7a5a"/>
    <text x="150" y="122" font-size="12" text-anchor="middle" font-family="Courier New, monospace" letter-spacing="1" fill="#2a2018">GUEST FOLIO · ROOM ${room}</text>
    <text x="40" y="146" font-size="12" ${serif} fill="#2a2018">Guest:</text>
    ${guest ? `<text x="90" y="146" font-size="12" ${serif} fill="#2a2018">${guest}</text>`
            : `<path d="M88 141 q20 -8 40 0 t40 0 q10 4 24 -2" stroke="#3a3020" stroke-width="7" fill="none" opacity=".75"/>`}
    <text x="150" y="168" font-size="10" text-anchor="middle" font-family="Courier New, monospace" fill="#5a4a3a">Arrived 6 Nov · Departs 7 Nov</text>
    <text x="14" y="214" font-size="9" font-family="Courier New, monospace" fill="#5a4a3a">DATE</text>
    <text x="64" y="214" font-size="9" font-family="Courier New, monospace" fill="#5a4a3a">DESCRIPTION</text>
    <text x="286" y="214" font-size="9" text-anchor="end" font-family="Courier New, monospace" fill="#5a4a3a">AMOUNT</text>
    <line x1="10" y1="221" x2="290" y2="221" stroke="#8a7a5a" stroke-width=".8"/>
    ${lines.map(([y, ...rest]) => row(y, ...rest)).join('')}
    ${footer ? `
    <line x1="10" y1="402" x2="290" y2="402" stroke="#8a7a5a"/>
    <text x="14" y="426" font-size="12" font-family="Courier New, monospace" font-weight="bold" fill="#2a2018">TOTAL</text>
    <text x="286" y="426" font-size="12" text-anchor="end" font-family="Courier New, monospace" font-weight="bold" fill="#2a2018">202.50</text>
    <text x="150" y="452" font-size="11" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Thank you for staying with us.</text>
    <text x="150" y="469" font-size="10" text-anchor="middle" ${serif} font-style="italic" fill="#8a7a5a">Again.</text>` : ''}`;
}

const MY_RECEIPT = receiptArt({
  lines: [
    [244, '6 Nov', 'Breakfast for two, table 3', '24.00'],
    [268, '6 Nov', 'Dinner, Garden Room', '38.50'],
    [310, '6 Nov', 'Room, one night', '140.00'],
    [336, '6 Nov', 'One day surrendered', '0.00', 'font-weight="bold"'],
    [358, '', 'Consent: see original agreement', '', 'font-style="italic"'],
  ],
});
// Scraps from other guests' receipts: similar, but with different printed column rules.
const DECOY_A = receiptArt({
  room: '202', guest: 'Capt. H. Orme', rules: [72, 214], tint: '#f1ece6',
  lines: [[310, '6 Nov', 'Room, one night', '140.00'], [336, '6 Nov', 'Newspaper', '2.00'], [358, '6 Nov', 'Shoe shine', '1.50']],
});
const DECOY_B = receiptArt({
  room: '205', guest: 'Dr. L. Brandt', rules: [48], tint: '#f6f1e8',
  lines: [[244, '6 Nov', 'Breakfast, table 5', '12.00'], [268, '6 Nov', 'Telephone call', '3.20']],
});

// ---------------------------------------------------------------- main scene

function luggagePile() {
  return `
    <ellipse cx="290" cy="472" rx="56" ry="6" fill="#000" opacity=".45"/>
    <rect x="244" y="400" width="58" height="70" rx="6" fill="#6a3a24" stroke="#3a1e10" stroke-width="2"/>
    <rect x="252" y="408" width="42" height="54" rx="3" fill="none" stroke="#3a1e10" stroke-width="1.5"/>
    <rect x="300" y="412" width="36" height="58" rx="5" fill="#2e4a5a" stroke="#1a2a34" stroke-width="2"/>
    <rect x="260" y="372" width="62" height="30" rx="3" fill="#8a6a3a" stroke="#4a3418" stroke-width="2"/>
    <ellipse cx="292" cy="358" rx="24" ry="8" fill="#5a2a3a"/><rect x="268" y="344" width="48" height="16" fill="#6a3a4a"/>
    <ellipse cx="292" cy="344" rx="24" ry="8" fill="#7a4a5a"/>
    ${[[262, 400], [318, 410], [306, 372]].map(([x, y]) => `<path d="M${x} ${y} l-4 14" stroke="#c9a33b" stroke-width="1.5"/>
      <rect x="${x - 10}" y="${y + 13}" width="12" height="8" fill="#efe6cf" transform="rotate(-10 ${x - 4} ${y + 17})"/>`).join('')}
    <rect x="278" y="334" width="26" height="16" fill="#f4efe2" transform="rotate(-6 291 342)"/>`;
}

function keyRack() {
  let out = `<rect x="416" y="108" width="152" height="128" fill="#3a2414" stroke="#1e120a" stroke-width="3"/>`;
  GUESTS.forEach((gst, i) => {
    const c = i % 3, r = Math.floor(i / 3), x = 424 + c * 48, y = 116 + r * 58;
    out += `<rect x="${x}" y="${y}" width="42" height="52" fill="#1e120a"/>
      <text x="${x + 21}" y="${y + 12}" font-size="9" text-anchor="middle" ${serif} fill="#f0d890">${gst.room}</text>`;
    if (gst.room !== '204') out += `
      <path d="M${x + 21} ${y + 16} v8" stroke="#8a6a2a" stroke-width="1.5"/>
      <rect x="${x + 15}" y="${y + 24}" width="12" height="18" rx="2" fill="#7a4a2a"/>
      <path d="M${x + 21} ${y + 42} v6" stroke="#c9a33b" stroke-width="2"/>`;
  });
  return out;
}

function deskLock(open) {
  const order = ['star', 'circle', 'hex', 'triangle', 'square', 'diamond'];
  return `
    <rect x="452" y="366" width="76" height="52" rx="4" fill="url(#brassG)" stroke="#5a4214" stroke-width="2"/>
    ${order.map((id, i) => `<rect x="${458 + (i % 3) * 23}" y="${372 + Math.floor(i / 3) * 22}" width="18" height="18" rx="3" fill="#2a1c10"/>
      ${symAt(CLASPS, id, 460 + (i % 3) * 23, 374 + Math.floor(i / 3) * 22, 14, '#f0d890')}`).join('')}
    ${open ? `
      <rect x="436" y="422" width="108" height="10" fill="#120a04"/>
      <polygon points="430,432 550,432 560,464 420,464" fill="#4a2e1a" stroke="#1e120a" stroke-width="2"/>
      <polygon points="436,436 544,436 552,460 428,460" fill="#1e120a"/>
    ` : `
      <rect x="440" y="424" width="100" height="34" fill="#5a3a24" stroke="#2e1c10" stroke-width="2"/>
      <rect x="478" y="438" width="24" height="5" rx="2" fill="url(#brassG)"/>`}`;
}

const reception = g => {
  const drawerOpen = g.flag('drawerOpen');
  const corridorOpen = g.flag('corridorOpen');
  const halfHere = drawerOpen && !g.flag('took:receiptHalf');
  const keyHere = drawerOpen && !g.flag('took:key204');
  return `${DEFS}
  <rect width="800" height="600" fill="#000"/>
  <rect width="800" height="336" fill="url(#damask)"/>
  <rect width="800" height="26" fill="#2e1c10"/><rect y="26" width="800" height="5" fill="url(#brassG)"/>
  <rect y="330" width="800" height="140" fill="url(#woodG)"/>
  ${[0, 1, 2, 3, 4].map(i => `<rect x="${12 + i * 160}" y="346" width="140" height="110" fill="none" stroke="#1e120a" stroke-width="3"/>`).join('')}
  <rect y="466" width="800" height="134" fill="url(#marble)"/>
  <rect y="466" width="800" height="134" fill="#000" opacity=".35"/>
  <rect y="466" width="800" height="6" fill="#1e120a"/>

  <path d="M8 86 q20 120 4 250 h32 q-8 -130 -4 -250 Z" fill="#5a1a22"/>
  ${rainWindow(36, 96, 76, 226, 'h1win')}
  <path d="M120 86 q-20 120 -4 250 h-32 q8 -130 4 -250 Z" fill="#5a1a22" transform="translate(16,0)"/>
  <rect x="2" y="80" width="140" height="10" rx="3" fill="url(#brassG)"/>

  <path d="M150 168 a50 34 0 0 1 100 0 Z" fill="#2a3a44" stroke="url(#brassG)" stroke-width="5"/>
  <text x="200" y="160" font-size="9" text-anchor="middle" ${serif} letter-spacing="2" fill="#f0d890" opacity=".8" transform="translate(400,0) scale(-1,1)">THE HALCYON</text>
  <rect x="150" y="168" width="100" height="302" fill="#1e120a"/>
  ${[150, 200].map(x => `
    <rect x="${x + 4}" y="172" width="42" height="294" fill="#2e1c10" stroke="url(#brassG)" stroke-width="3"/>
    <rect x="${x + 10}" y="182" width="30" height="200" fill="#1a2028"/>
    <path d="M${x + 10} 382 L${x + 22} 300 L${x + 28} 300 L${x + 40} 382" fill="#2a2018" opacity=".8"/>
    <circle cx="${x + 25}" cy="250" r="5" fill="#ffd890" opacity=".7" filter="url(#hGlow)"/>`).join('')}
  <rect x="192" y="290" width="6" height="40" rx="2" fill="url(#brassG)"/><rect x="202" y="290" width="6" height="40" rx="2" fill="url(#brassG)"/>

  <rect x="248" y="138" width="88" height="114" fill="url(#brassG)"/>
  <rect x="254" y="144" width="76" height="102" fill="#efe6cf"/>
  <text x="292" y="157" font-size="7" text-anchor="middle" ${serif} fill="#2a1c10">ROOM CHART</text>
  ${GUESTS.map((gst, i) => `<text x="262" y="${172 + i * 13}" font-size="7" font-family="Courier New, monospace" fill="#2a1c10">${gst.room}</text>
    ${symAt(EMBLEMS, gst.emblem, 282, 164 + i * 13, 10, '#2a3a5a')}
    <rect x="298" y="${167 + i * 13}" width="${gst.name ? 24 : 0}" height="2" fill="#8a7a5a"/>
    ${gst.name ? '' : `<circle cx="306" cy="${168 + i * 13}" r="5" fill="#1a1208" opacity=".8"/>`}`).join('')}
  <g transform="translate(10,0)">${luggagePile()}</g>

  ${wallClock(375, 92, 24, 10, 58)}
  ${keyRack()}
  <rect x="584" y="112" width="62" height="86" fill="#efe6cf" stroke="#8a7a5a" stroke-width="2"/>
  <rect x="584" y="112" width="62" height="22" fill="#7a1e22"/>
  <text x="615" y="128" font-size="12" text-anchor="middle" ${serif} letter-spacing="2" fill="#f4efe2">NOV</text>
  <text x="615" y="182" font-size="44" text-anchor="middle" ${serif} fill="#2a1c10">7</text>

  <rect x="326" y="324" width="330" height="14" fill="#6a4a2e"/><rect x="326" y="336" width="330" height="4" fill="url(#brassG)"/>
  <rect x="340" y="340" width="302" height="130" fill="url(#woodG)"/>
  <rect x="352" y="352" width="84" height="104" fill="none" stroke="#1e120a" stroke-width="2"/>
  <rect x="546" y="352" width="84" height="104" fill="none" stroke="#1e120a" stroke-width="2"/>
  ${deskLock(drawerOpen)}
  ${keyHere ? `<g transform="translate(446,438) rotate(-8)"><circle cx="6" cy="6" r="5" fill="none" stroke="#c9a33b" stroke-width="3"/>
    <rect x="10" y="4" width="20" height="4" fill="#c9a33b"/><rect x="26" y="-2" width="14" height="12" rx="2" fill="#7a4a2a"/></g>` : ''}
  ${halfHere ? `<rect x="492" y="438" width="40" height="18" fill="#f4efe2" transform="rotate(6 512 447)"/>
    <path d="M494 447 h30 M494 452 h22" stroke="#8a7a5a" stroke-width="1.5" transform="rotate(6 512 447)"/>` : ''}

  <polygon points="356,312 404,308 406,326 354,330" fill="#efe6cf"/><polygon points="404,308 452,312 454,330 406,326" fill="#e6dcc0"/>
  <path d="M362 316 l36 -3 M362 321 l36 -3 M412 313 l34 3 M412 318 l34 3" stroke="#8a7a5a" stroke-width="1"/>
  <ellipse cx="500" cy="324" rx="16" ry="4" fill="#5a4214"/>
  <path d="M486 323 a14 13 0 0 1 28 0 Z" fill="url(#brassG)"/><rect x="498" y="306" width="4" height="6" fill="url(#brassG)"/>
  <polygon points="526,326 548,310 570,326" fill="#f4efe2" stroke="#8a7a5a"/>
  <path d="M534 320 q6 -4 10 0 t10 0" stroke="#2a3a5a" stroke-width="1" fill="none"/>
  ${lamp(612, 284, 0.85)}

  <path d="M652 424 l6 46 h28 l6 -46 Z" fill="#8a6a3a" stroke="#4a3418" stroke-width="2"/>
  <path d="M654 436 h36 M656 450 h32" stroke="#4a3418" stroke-width="1.5"/>
  ${g.flag('receiptDone') ? '' : `<circle cx="664" cy="422" r="7" fill="#f4efe2"/><circle cx="678" cy="420" r="6" fill="#e6dcc0"/><circle cx="671" cy="415" r="5" fill="#f4efe2"/>`}

  <rect x="700" y="124" width="94" height="24" fill="#2e1c10" stroke="url(#brassG)" stroke-width="2"/>
  <text x="747" y="140" font-size="10" text-anchor="middle" ${serif} fill="#f0d890">ROOMS 201–206</text>
  <rect x="704" y="156" width="86" height="314" fill="#1e120a"/>
  ${corridorOpen ? `
    <rect x="710" y="162" width="74" height="308" fill="#3a2414"/>
    <rect x="710" y="162" width="74" height="308" fill="url(#lampGlow)"/>
    <polygon points="710,162 784,162 760,240 734,240" fill="#4a2e1a"/><polygon points="710,470 784,470 760,330 734,330" fill="#5a1a22"/>
    <rect x="734" y="240" width="26" height="90" fill="#2a1a10"/>
    <polygon points="704,156 718,164 718,466 704,470" fill="#4a2e1a"/>
  ` : `
    <rect x="710" y="162" width="74" height="308" fill="#4a2e1a"/>
    <rect x="718" y="174" width="58" height="120" fill="none" stroke="#2e1c10" stroke-width="3"/>
    <rect x="718" y="314" width="58" height="140" fill="none" stroke="#2e1c10" stroke-width="3"/>
    <circle cx="772" cy="310" r="5" fill="url(#brassG)"/>`}
  ` + finish();
};

// ---------------------------------------------------------------- close-ups

const chart = () => closeup('#1f3a2e') + `
  <rect x="166" y="46" width="468" height="508" fill="#000" opacity=".4" transform="translate(6,8)"/>
  <rect x="166" y="46" width="468" height="508" fill="url(#brassG)"/>
  <rect x="180" y="60" width="440" height="480" fill="#efe6cf"/>
  <text x="400" y="104" font-size="26" text-anchor="middle" ${serif} letter-spacing="4" fill="#2a1c10">ROOM CHART</text>
  <text x="400" y="128" font-size="13" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Second floor · Guests in residence</text>
  ${GUESTS.map((gst, i) => {
    const y = 160 + i * 62;
    return `<line x1="200" y1="${y - 6}" x2="600" y2="${y - 6}" stroke="#c8bca0"/>
      <text x="214" y="${y + 34}" font-size="24" font-family="Courier New, monospace" fill="#2a1c10">${gst.room}</text>
      ${symAt(EMBLEMS, gst.emblem, 300, y + 4, 44, '#2a3a5a')}
      ${gst.name
        ? `<text x="372" y="${y + 33}" font-size="20" ${serif} font-style="italic" fill="#2a1c10">${gst.name}</text>`
        : `<path d="M372 ${y + 26} q30 -14 60 0 t60 0 q20 8 40 -4" stroke="#1a1208" stroke-width="14" fill="none" opacity=".85"/>`}`;
  }).join('')}
  ` + finish();

const booking = () => deskTop() + `
  <g transform="rotate(-3 400 300)">
    <rect x="186" y="96" width="440" height="300" fill="#000" opacity=".45"/>
    <rect x="180" y="90" width="440" height="300" fill="#efe6cf" stroke="#8a7a5a" stroke-width="3"/>
    <rect x="192" y="102" width="416" height="276" fill="none" stroke="#b8903a" stroke-width="1.5"/>
    <text x="400" y="140" font-size="26" text-anchor="middle" ${serif} letter-spacing="4" fill="#2a1c10">THE HALCYON</text>
    <text x="400" y="162" font-size="13" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Booking confirmation</text>
    ${symAt(EMBLEMS, 'swallow', 222, 192, 96, '#2a3a5a')}
    <text x="232" y="312" font-size="11" ${serif} font-style="italic" fill="#5a4a3a">your emblem</text>
    <g ${serif} fill="#2a1c10" font-size="17">
      <text x="350" y="214">Guest:</text>
      <path d="M414 209 q30 -12 60 0 t60 0 q14 6 34 -2" stroke="#1a1208" stroke-width="12" fill="none" opacity=".8"/>
      <text x="350" y="252">Room: 2</text>
      <ellipse cx="428" cy="246" rx="14" ry="12" fill="#2a2a3a" opacity=".75"/>
      <text x="444" y="252">4</text>
      <text x="350" y="290">Arrival: 6 November</text>
      <text x="350" y="318">Departure: 7 November</text>
    </g>
    <text x="400" y="364" font-size="12" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Please present this card at reception.</text>
  </g>` + finish();

const luggageCloseup = g => {
  const bags = bagsOf(g);
  const shapes = [
    (x, c) => `<rect x="${x}" y="250" width="150" height="230" rx="12" fill="${c}" stroke="#1e120a" stroke-width="3"/><rect x="${x + 55}" y="232" width="40" height="22" rx="6" fill="none" stroke="#1e120a" stroke-width="6"/>`,
    (x, c) => `<path d="M${x} 290 q75 -60 150 0 v190 h-150 Z" fill="${c}" stroke="#1e120a" stroke-width="3"/><path d="M${x + 45} 262 q30 -40 60 0" fill="none" stroke="#1e120a" stroke-width="6"/>`,
    (x, c) => `<rect x="${x}" y="230" width="150" height="250" rx="4" fill="${c}" stroke="#1e120a" stroke-width="3"/><path d="M${x} 300 h150 M${x} 420 h150" stroke="#c9a33b" stroke-width="5"/>`,
    (x, c) => `<rect x="${x}" y="270" width="150" height="210" rx="18" fill="${c}" stroke="#1e120a" stroke-width="3"/><rect x="${x + 50}" y="250" width="50" height="24" rx="8" fill="none" stroke="#1e120a" stroke-width="6"/>`,
  ];
  const colours = ['#6a3a24', '#2e4a5a', '#5a2a3a', '#4a4a2a'];
  return closeup('#1f3a2e') + `
  <rect y="480" width="800" height="120" fill="url(#marble)"/><rect y="480" width="800" height="120" fill="#000" opacity=".4"/>
  <g transform="rotate(-2 400 80)">
    <rect x="236" y="22" width="328" height="142" fill="#000" opacity=".35" transform="translate(5,6)"/>
    <rect x="236" y="22" width="328" height="142" fill="#f4efe2"/>
    <g fill="#2a2018" ${hand} font-size="17">
      <text x="252" y="54">Porter —</text>
      <text x="252" y="82">Set tomorrow's departures first,</text>
      <text x="252" y="106">earliest to latest. Leave the guest</text>
      <text x="252" y="130">with no departure until last.</text>
      <text x="470" y="154" font-size="15">— Front desk</text>
    </g>
  </g>
  ${bags.map((b, i) => {
    const x = 30 + i * 190;
    const gst = GUESTS.find(q => q.room === b.room);
    return `
      <ellipse cx="${x + 75}" cy="484" rx="86" ry="10" fill="#000" opacity=".45"/>
      ${shapes[i](x, colours[i])}
      <circle cx="${x + 75}" cy="318" r="32" fill="url(#brassG)" stroke="#5a4214" stroke-width="3"/>
      ${symAt(CLASPS, b.clasp, x + 54, 297, 42, '#2a1c10')}
      <path d="M${x + 75} 350 v24" stroke="#c9a33b" stroke-width="2"/>
      <g transform="rotate(${[-4, 3, -3, 4][i]} ${x + 75} 410)">
        <rect x="${x + 10}" y="372" width="130" height="80" rx="4" fill="#efe6cf" stroke="#8a7a5a" stroke-width="2"/>
        <circle cx="${x + 75}" cy="380" r="4" fill="#1e120a"/>
        <text x="${x + 20}" y="400" font-size="15" font-family="Courier New, monospace" font-weight="bold" fill="#2a1c10">ROOM ${b.room}</text>
        ${symAt(EMBLEMS, gst.emblem, x + 110, 384, 22, '#2a3a5a')}
        <text x="${x + 20}" y="418" font-size="11" ${serif} font-style="italic" fill="#2a1c10">${gst.name ?? ''}</text>
        <text x="${x + 20}" y="440" font-size="12" ${hand} fill="#1f2a5a">${fmtTime(b.time, i, g)}</text>
      </g>`;
  }).join('')}
  ` + finish();
};

const register = () => {
  const r = rng(9);
  const sig = (x, y) => `<path d="M${x} ${y} q8 -14 14 -2 t12 -6 q6 10 14 -4 q8 8 18 -6 q4 8 16 2" stroke="#1f2a5a" stroke-width="1.6" fill="none"/>`;
  let rows = '';
  for (let i = 0; i < 15; i++) {
    const y = 140 + i * 26, year = 1995 + i;
    rows += `<text x="${100 + (r() - 0.5) * 2}" y="${y}" font-size="13" font-family="Courier New, monospace" fill="#3a3020">6 Nov ${year}</text>
      ${sig(222, y - 2)}
      ${symAt(EMBLEMS, 'swallow', 318, y - 14, 16, '#2a3a5a')}
      <text x="346" y="${y}" font-size="13" font-family="Courier New, monospace" fill="#3a3020">204</text>`;
  }
  return deskTop() + `
  <g transform="rotate(-1.5 400 300)">
    <rect x="70" y="40" width="660" height="520" rx="6" fill="#000" opacity=".45" transform="translate(6,8)"/>
    <rect x="70" y="40" width="660" height="520" rx="6" fill="#3a1a14"/>
    <rect x="84" y="52" width="312" height="496" fill="#efe6cf"/><rect x="404" y="52" width="312" height="496" fill="#ece2c8"/>
    <rect x="396" y="52" width="8" height="496" fill="#000" opacity=".2"/>
    <text x="240" y="92" font-size="18" text-anchor="middle" ${serif} letter-spacing="2" fill="#2a1c10">GUEST REGISTER</text>
    <text x="240" y="114" font-size="11" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">arrivals for 6 November</text>
    ${rows}
    <text x="560" y="96" font-size="13" text-anchor="middle" font-family="Courier New, monospace" fill="#3a3020">⋮</text>
    ${[2021, 2022, 2023, 2024].map((yr, i) => `
      <text x="424" y="${150 + i * 30}" font-size="13" font-family="Courier New, monospace" fill="#3a3020">6 Nov ${yr}</text>
      ${sig(530, 148 + i * 30)}${symAt(EMBLEMS, 'swallow', 622, 136 + i * 30, 16, '#2a3a5a')}
      <text x="648" y="${150 + i * 30}" font-size="13" font-family="Courier New, monospace" fill="#3a3020">204</text>`).join('')}
    <text x="560" y="300" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Thirty years.</text>
    <text x="560" y="322" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">The same signature every time.</text>
    <text x="560" y="344" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">Yours.</text>
  </g>` + finish();
};

const clerkNote = () => deskTop() + `
  <g transform="rotate(2 400 300)">
    <rect x="216" y="156" width="380" height="250" fill="#000" opacity=".45"/>
    <rect x="210" y="150" width="380" height="250" fill="#f4efe2" stroke="#8a7a5a" stroke-width="2"/>
    <line x1="210" y1="275" x2="590" y2="275" stroke="#d8ccb0" stroke-width="2"/>
    <g fill="#2a2018" ${hand} font-size="24">
      <text x="236" y="212">If you want to leave,</text>
      <text x="236" y="250">find out what you</text>
      <text x="236" y="320">asked us to keep.</text>
    </g>
    <text x="560" y="378" font-size="14" text-anchor="end" ${serif} font-style="italic" fill="#5a4a3a">— The Halcyon</text>
  </g>` + finish();

const receiptCloseup = () => deskTop() + `
  <g transform="translate(250,40) rotate(2 150 260) scale(1.08)">
    <rect width="300" height="480" fill="#000" opacity=".45" transform="translate(6,8)"/>
    ${MY_RECEIPT}
    ${[96, 192, 288, 384].map(y => `<rect x="0" y="${y - 7}" width="300" height="14" fill="#f8f4e0" opacity=".55"/>`).join('')}
  </g>` + finish();

const calendarFlip = () => closeup('#1f3a2e') + `
  <style>
    .h1-cal7 { animation: h1-seven 3.4s ease-in-out forwards; }
    .h1-cal6 { animation: h1-six 3.4s ease-in-out forwards; opacity: 0; }
    .h1-page { animation: h1-flip 3.4s ease-in-out forwards; transform-origin: 400px 190px; }
    @keyframes h1-seven { 0%, 22% { opacity: 1 } 30%, 66% { opacity: 0 } 76%, 100% { opacity: 1 } }
    @keyframes h1-six { 0%, 22% { opacity: 0 } 30%, 66% { opacity: 1 } 76%, 100% { opacity: 0 } }
    @keyframes h1-flip { 0%, 20% { transform: scaleY(1) } 26% { transform: scaleY(.05) } 32%, 64% { transform: scaleY(1) }
                         70% { transform: scaleY(.05) } 76%, 100% { transform: scaleY(1) } }
  </style>
  <rect x="256" y="86" width="300" height="400" fill="#000" opacity=".4" transform="translate(6,8)"/>
  <rect x="250" y="80" width="300" height="400" fill="#efe6cf" stroke="#8a7a5a" stroke-width="3"/>
  <rect x="250" y="80" width="300" height="100" fill="#7a1e22"/>
  <text x="400" y="148" font-size="44" text-anchor="middle" ${serif} letter-spacing="8" fill="#f4efe2">NOV</text>
  <g class="h1-page">
    <text class="h1-cal7" x="400" y="400" font-size="210" text-anchor="middle" ${serif} fill="#2a1c10">7</text>
    <text class="h1-cal6" x="400" y="400" font-size="210" text-anchor="middle" ${serif} fill="#7a1e22">6</text>
  </g>
  ${lamp(660, 120, 1.2)}
  ` + finish();

// ---------------------------------------------------------------- hotspots

const chartHotspots = GUESTS.map((gst, i) => ({
  id: `chart-${gst.room}`, label: `Room ${gst.room}`, rect: [196, 150 + i * 62, 408, 58],
  sparkle: g => gst.room === '204' && !g.flag('knowsRoom'),
  click: g => {
    if (gst.room !== '204') return g.say(`Room ${gst.room}: ${gst.name}. Their emblem doesn't match your booking card.`);
    g.set('knowsRoom');
    g.note('room', 'My room is <b>204</b>: the swallow on the room chart matches my booking card.');
    g.say("The swallow, the same emblem as on your booking card. Room 204 is yours. The guest's name has been blotted out.");
  },
}));

// ---------------------------------------------------------------- export

export default {
  id: 'r1',
  name: 'Reception',
  setup,
  hints: [
    { when: g => !g.flag('knowsRoom'), text: g => g.difficulty === 'easy'
      ? 'Examine your booking confirmation (select it, then Examine). Then find the same emblem on the room chart above the luggage.'
      : 'Your booking card has a symbol on it. Symbols matter in this hotel.' },
    { when: g => !g.flag('drawerOpen'), text: g => g.difficulty === 'easy'
      ? "Read the porter's note on the luggage. Enter the bags' clasp symbols in that order on the brass lock in the front of the desk."
      : 'The luggage came with instructions from the front desk.' },
    { when: g => !g.flag('took:key204') || !g.flag('took:receiptHalf'), text: 'Take what is in the drawer.' },
    { when: g => !g.flag('receiptDone'), text: g => g.difficulty === 'easy'
      ? 'The rest of the receipt is in the wastepaper basket. Match the torn edges and the printed column lines. Not every scrap is yours.'
      : 'The rest of that receipt cannot be far away.' },
    { text: 'The corridor door is open now.' },
  ],

  scenes: {
    'r1-reception': {
      room: 'r1',
      art: reception,
      enter: g => {
        if (g.flag('r1Seen')) return;
        g.set('r1Seen');
      },
      hotspots: [
        { id: 'window', label: 'Window', rect: [10, 84, 140, 250],
          say: 'Rain, steady and patient. The street beyond is too dark to see.' },
        { id: 'frontdoor', label: 'Front doors', rect: [150, 128, 100, 342],
          click: g => {
            g.note('frontdoor', 'The front doors lead back into the hotel. Every time.');
            g.say('You push through the front doors into a quiet hotel corridor. A few steps on, you are back at reception. The rain has not changed its rhythm.', 6000);
          } },
        { id: 'chart', label: 'Room chart', rect: [246, 136, 92, 118], go: 'r1-chart', sparkle: g => !g.flag('knowsRoom') },
        { id: 'luggage', label: 'Luggage', rect: [252, 334, 96, 138], go: 'r1-luggage', sparkle: g => g.flag('knowsRoom') && !g.flag('drawerOpen') },
        { id: 'clock', label: 'Clock', circle: [375, 92, 30],
          say: 'Two minutes to eleven. Checkout is at eleven. The second hand moves; the minute hand never seems to.' },
        { id: 'rack', label: 'Key rack', rect: [416, 108, 152, 128],
          say: 'Room keys hang in their cubbies. All except 204.' },
        { id: 'calendar', label: 'Calendar', rect: [584, 112, 62, 86],
          say: g => g.flag('receiptDone') ? '7 November. It was 6 for a moment. You are sure of it.' : '7 November. Checkout day.' },
        { id: 'register', label: 'Guest register', rect: [352, 304, 104, 28], go: 'r1-register' },
        { id: 'bell', label: 'Service bell', rect: [484, 302, 34, 26],
          say: 'Ding. Nobody comes. The note hangs in the air a little too long.' },
        { id: 'note', label: 'Note', rect: [524, 306, 50, 24], go: 'r1-note', sparkle: g => !g.hasNote('clerk') },
        { id: 'lamp', label: 'Desk lamp', rect: [588, 250, 50, 76], say: 'Green glass, warm light. Someone left it on for you.' },
        { id: 'lock', label: 'Drawer lock', rect: [440, 362, 104, 98],
          when: g => !g.flag('drawerOpen'), sparkle: g => g.flag('knowsRoom'),
          click: g => g.puzzle('r1-drawer') },
        { id: 'drawer', label: 'Drawer', rect: [420, 420, 140, 46],
          when: g => g.flag('drawerOpen'),
          say: 'The key drawer, empty now.' },
        { id: 'key204', label: 'Room key', rect: [440, 428, 50, 30], take: 'key204',
          when: g => g.flag('drawerOpen'),
          say: 'The key to room 204. Its wooden fob is stamped with a swallow.' },
        { id: 'receiptHalf', label: 'Half a receipt', rect: [490, 432, 46, 28], take: 'receiptHalf',
          when: g => g.flag('drawerOpen'),
          say: 'Half a receipt for room 204. The bottom half has been torn away.' },
        { id: 'basket', label: 'Wastepaper basket', rect: [646, 404, 52, 68],
          sparkle: g => g.has('receiptHalf'),
          click: g => {
            if (g.flag('receiptDone')) return g.say('Empty now.');
            if (!g.has('receiptHalf')) return g.say('Torn scraps of a receipt, or several. Far too much is missing to make sense of them.');
            g.puzzle('r1-receipt');
          },
          use: { receiptHalf: g => g.flag('receiptDone') ? g.say('Empty now.') : g.puzzle('r1-receipt') } },
        { id: 'corridor', label: 'Corridor door', rect: [700, 120, 94, 350],
          when: g => !g.flag('corridorOpen'),
          say: 'Locked. ROOMS 201–206. Beyond it, very faintly, a piano is playing.',
          use: { key204: g => g.say("Your room key doesn't fit this door. It's for room 204.") } },
        { id: 'corridor-open', label: 'To the rooms', rect: [700, 120, 94, 350],
          when: g => g.flag('corridorOpen'), sparkle: true, go: 'r2-corridor' },
      ],
    },

    'r1-chart': { room: 'r1', art: chart, nav: { back: 'r1-reception' }, hotspots: chartHotspots },

    'r1-booking': {
      room: 'r1', art: booking,
      nav: { back: g => g.get('bookingReturn') ?? 'r1-reception' },
      enter: g => g.note('booking', 'Booking card: arrived <b>6 November</b>. My emblem is a <b>swallow</b>. The room number is smudged: 2?4.'),
      hotspots: [],
    },

    'r1-luggage': {
      room: 'r1', art: luggageCloseup, nav: { back: 'r1-reception' },
      enter: g => g.note('porter', "Porter's note: departures earliest to latest; the guest with no departure goes last."),
      hotspots: [
        { id: 'mine', label: 'Room 204 luggage', rect: g => { const i = bagsOf(g).findIndex(b => b.room === '204'); return [30 + i * 190, 230, 150, 250]; },
          say: 'Your luggage. No departure booked, as if the hotel expects you to stay.' },
      ],
    },

    'r1-register': {
      room: 'r1', art: register, nav: { back: 'r1-reception' },
      enter: g => g.note('register', 'The guest register has my signature on <b>6 November</b> every year for thirty years. I remember none of them.'),
      hotspots: [],
    },

    'r1-note': {
      room: 'r1', art: clerkNote, nav: { back: 'r1-reception' },
      enter: g => g.note('clerk', 'A note at reception: <i>"If you want to leave, find out what you asked us to keep."</i>'),
      hotspots: [],
    },

    'r1-receipt': {
      room: 'r1', art: receiptCloseup,
      nav: { back: g => g.get('receiptReturn') ?? 'r1-reception' },
      hotspots: [],
    },

    'r1-calendar': {
      room: 'r1', art: calendarFlip, nav: { back: 'r1-reception' },
      hotspots: [],
    },
  },

  puzzles: {
    'r1-drawer': {
      type: 'sequence',
      prompt: 'The key drawer. Four clasps, pressed in the right order.',
      buttons: ['star', 'circle', 'hex', 'triangle', 'square', 'diamond'].map(id => ({ id, label: symSvg(CLASPS, id, '#2a1c10') })),
      columns: 3,
      solution: drawerSolution,
      okText: 'CLICK',
      errText: 'THE DRAWER STAYS SHUT',
      solve: g => {
        g.set('drawerOpen');
        g.say('With a soft click the drawer slides open. Inside: a room key and half a receipt.');
      },
    },

    'r1-receipt': {
      type: 'assemble',
      prompt: 'Your receipt, half of it. The rest is in the basket. Click a scrap, then click where it goes.',
      width: 300, height: 480,
      art: MY_RECEIPT,
      cuts: [96, 192, 288, 384],
      fixed: [0, 1],
      seed: 21,
      config: g => ({
        decoys: g.difficulty === 'hard'
          ? [{ art: DECOY_A, strip: 3 }, { art: DECOY_B, strip: 2 }]
          : [{ art: DECOY_A, strip: 3 }],
      }),
      solve: g => {
        g.take('receiptHalf');
        g.give('receipt');
        g.set('receiptDone');
        g.set('corridorOpen');
        g.note('receipt', 'My receipt: <i>"6 November: One day surrendered. Consent: see original agreement."</i>');
        g.go('r1-calendar');
        g.say('The last scrap falls into place. "6 November: One day surrendered." Behind the desk the calendar flutters... 6... then 7 again. Down the corridor, a soft bell.', 8000);
      },
    },
  },
};

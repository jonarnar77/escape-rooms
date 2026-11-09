// ROOM 1: the post office. Keepsake: the postcard (the promise).
//
//   1. Staff door:  4-digit code = today's date as DDMM. The card on the door says so;
//                   the date stamp on the counter shows the date.          -> behind the counter
//   2. Sort the post: six letters into their streets' pigeonholes (assign)  -> a letter falls out
//                   from behind the rack: for Lantern Row, which has no pigeonhole
//   3. Steam it open at the kettle: Mum's letter, your name, and the key to box 7
//   4. Box 7 (the one painted over): your postcards home. Take the first one -> Harbour Lane redraws.
//
// Every clue is in this room. Green ink (Wren) is flavour only.
// Difficulty: EASY spells out the code format; MEDIUM/HARD abbreviate addresses; HARD randomises the date.

import { DEFS, finish, paper, tableTop, wallClock, envelope, hand, serif, mono, INK, rng } from '../art/common.js';
import { restoreStreet, openMap } from './town.js';

// ---------------------------------------------------------------- data

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const dateOf = g => g.get('r1Date') ?? { d: 17, m: 10 };
const hatchCode = g => { const { d, m } = dateOf(g); return String(d).padStart(2, '0') + String(m).padStart(2, '0'); };

function setup(g) {
  if (g.difficulty !== 'hard') return;
  const r = Math.random;
  g.set('r1Date', { d: 10 + Math.floor(r() * 18), m: 9 + Math.floor(r() * 3) });
}

const STREETS = [
  { id: 'station', name: 'Station Road', short: 'Stn Rd' },
  { id: 'harbour', name: 'Harbour Lane', short: 'Hbr Ln' },
  { id: 'market', name: 'Market Street', short: 'Mkt St' },
  { id: 'press', name: 'Press Street', short: 'Press St' },
  { id: 'church', name: 'Church Walk', short: 'Ch. Walk' },
  { id: 'mill', name: 'Mill Lane', short: 'Mill Ln' },
];
const LETTERS = [
  { id: 'l1', street: 'market', who: 'Mrs D. Penhale', no: 4, color: '#efe4c8' },
  { id: 'l2', street: 'church', who: 'The Vicarage', no: 1, color: '#e4ecf0' },
  { id: 'l3', street: 'station', who: 'B. Okafor', no: 12, color: '#f0e0d8' },
  { id: 'l4', street: 'mill', who: 'J. & S. Trewin', no: 7, color: '#e8e8d0' },
  { id: 'l5', street: 'harbour', who: 'Harbourmaster', no: 2, color: '#efe4c8' },
  { id: 'l6', street: 'press', who: 'The Editor', no: 9, color: '#f4ecd8' },
];
const streetOf = id => STREETS.find(s => s.id === id);
const addressOf = (l, g) => `${l.no} ${g.difficulty === 'easy' ? streetOf(l.street).name : streetOf(l.street).short}`;

// PO boxes: 4 x 4 on the left wall. Box 7 (index 6) is yours, painted over.
const boxXY = i => [36 + (i % 4) * 54, 100 + Math.floor(i / 4) * 58];

// ---------------------------------------------------------------- main scene

function boxes(g) {
  const open = g.flag('boxOpen');
  let out = `<rect x="26" y="88" width="228" height="248" fill="url(#tWood)" stroke="#3a2210" stroke-width="3"/>`;
  for (let i = 0; i < 16; i++) {
    const [x, y] = boxXY(i);
    if (i === 6) {
      out += open
        ? `<rect x="${x}" y="${y}" width="48" height="52" fill="#1e140a"/>
           ${g.flag('took:postcard') ? '' : `<rect x="${x + 8}" y="${y + 22}" width="32" height="22" fill="#f4ecd8" transform="rotate(-4 ${x + 24} ${y + 33})"/>
           <rect x="${x + 10}" y="${y + 20}" width="30" height="22" fill="#e8d8b8" transform="rotate(5 ${x + 24} ${y + 31})"/>
           <path d="M${x + 24} ${y + 18} v28" stroke="#a33a2a" stroke-width="2"/>`}
           <rect x="${x - 26}" y="${y}" width="24" height="52" fill="#e8dcc0" stroke="#b8a888" stroke-width="2"/>`
        : `<rect x="${x}" y="${y}" width="48" height="52" fill="#ece0c2" stroke="#d8c8a2" stroke-width="2"/>
           <path d="M${x + 6} ${y + 52} v6 M${x + 30} ${y + 52} v9" stroke="#ece0c2" stroke-width="3" stroke-linecap="round"/>
           <circle cx="${x + 38}" cy="${y + 32}" r="2.5" fill="#b8a888"/>`;
      continue;
    }
    out += `<rect x="${x}" y="${y}" width="48" height="52" fill="url(#tBrass)" stroke="#6a4a18" stroke-width="1.5"/>
      <rect x="${x + 8}" y="${y + 6}" width="32" height="16" fill="#3a3020"/>
      <rect x="${x + 8}" y="${y + 6}" width="32" height="16" fill="#fff" opacity=".12"/>
      <text x="${x + 24}" y="${y + 38}" font-size="11" text-anchor="middle" ${serif} fill="#3a2a10">${i + 1}</text>
      <circle cx="${x + 38}" cy="${y + 44}" r="2.5" fill="#3a2a10"/>`;
  }
  return out;
}

function counterItems(g) {
  return `
  <!-- bell -->
  <ellipse cx="318" cy="324" rx="16" ry="4" fill="#3a2a10"/><path d="M304 322 a14 14 0 0 1 28 0 Z" fill="url(#tBrass)"/>
  <circle cx="318" cy="306" r="3" fill="url(#tBrass)"/>
  <!-- date stamp on its stand -->
  <rect x="384" y="314" width="56" height="12" fill="#2a2a2a"/>
  <rect x="398" y="282" width="28" height="32" fill="#3a3a3a"/><rect x="392" y="270" width="40" height="14" rx="6" fill="#7a4a2a"/>
  <rect x="402" y="296" width="20" height="8" fill="#f4ecd8"/>
  <!-- green note -->
  ${paper(462, 308, 58, 20, { tint: '#f6f0dc', rot: -5 })}
  <path d="M470 316 q8 -3 14 0 t14 0 M470 322 q6 -2 12 0" stroke="${INK}" stroke-width="1.5" fill="none" transform="rotate(-5 491 318)"/>
  <!-- parcel scales -->
  <rect x="548" y="318" width="54" height="8" fill="#2a2a2a"/><rect x="570" y="294" width="10" height="24" fill="#3a3a3a"/>
  <rect x="540" y="286" width="70" height="8" rx="2" fill="url(#tBrass)"/>
  <rect x="552" y="262" width="40" height="24" fill="#b88a54" stroke="#6a4a2a"/>
  <path d="M552 274 h40 M572 262 v24" stroke="#d8c8a0" stroke-width="2"/>`;
}

const postOffice = g => `${DEFS}
  <rect width="800" height="600" fill="#e8dcc0"/>
  <rect width="800" height="26" fill="#3e5a4a"/><rect y="26" width="800" height="6" fill="#2e4a3a"/>
  <rect y="336" width="800" height="104" fill="#3e5a4a"/><rect y="336" width="800" height="5" fill="#2e4a3a"/>
  <rect y="440" width="800" height="160" fill="url(#tFloor)"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 100 - 40} 600 L${300 + i * 30} 440" stroke="#3a2210" stroke-width="2" opacity=".5"/>`).join('')}
  <polygon points="716,140 792,140 520,600 180,600" fill="url(#tBeam)"/>

  ${boxes(g)}
  <text x="140" y="80" font-size="14" text-anchor="middle" ${serif} letter-spacing="2" fill="#2e4a3a">PRIVATE BOXES</text>

  <!-- sign and clock -->
  <rect x="304" y="70" width="296" height="44" fill="#2e4a3a"/><rect x="310" y="76" width="284" height="32" fill="none" stroke="url(#tBrass)" stroke-width="2"/>
  <text x="452" y="100" font-size="20" text-anchor="middle" ${serif} letter-spacing="4" fill="#f2dc98">POST OFFICE</text>
  ${wallClock(680, 76, 26, 4, 20)}

  <!-- glass screen with the back room behind -->
  <rect x="276" y="128" width="340" height="200" fill="#cbbd9a"/>
  <g opacity=".45">
    <rect x="300" y="160" width="140" height="110" fill="#8a6a44"/>
    ${[0, 1, 2].map(c => [0, 1].map(r => `<rect x="${306 + c * 45}" y="${166 + r * 52}" width="40" height="46" fill="#5a4024"/>`).join('')).join('')}
    <rect x="510" y="230" width="70" height="60" fill="#8a6a44"/>
  </g>
  <rect x="276" y="128" width="340" height="200" fill="#fff" opacity=".2"/>
  <path d="M290 140 L330 140 L290 200 Z M470 140 L520 140 L460 230 Z" fill="#fff" opacity=".25"/>
  <rect x="276" y="128" width="340" height="200" fill="none" stroke="url(#tBrass)" stroke-width="6"/>
  <rect x="443" y="128" width="6" height="200" fill="url(#tBrass)"/>
  ${[340, 520].map(x => `<path d="M${x} 328 v-22 a20 20 0 0 1 40 0 v22" fill="#e8dcc0" stroke="url(#tBrass)" stroke-width="3"/>`).join('')}

  <!-- counter -->
  <rect x="264" y="326" width="364" height="14" fill="#5a3820"/>
  <rect x="270" y="340" width="352" height="130" fill="url(#tWood)"/>
  ${[0, 1, 2].map(i => `<rect x="${284 + i * 114}" y="354" width="96" height="100" fill="none" stroke="#3a2210" stroke-width="3"/>`).join('')}
  ${counterItems(g)}

  <!-- staff door -->
  ${g.flag('hatchOpen')
    ? `<rect x="630" y="152" width="74" height="318" fill="#3a2a1a"/><rect x="636" y="158" width="62" height="312" fill="#5a4630"/>
       <polygon points="630,152 610,146 610,476 630,470" fill="#3e5a4a" stroke="#2a3a30" stroke-width="2"/>`
    : `<rect x="630" y="152" width="74" height="318" fill="#3e5a4a" stroke="#2a3a30" stroke-width="3"/>
       <rect x="640" y="166" width="54" height="120" fill="none" stroke="#2a3a30" stroke-width="2"/>
       <rect x="640" y="330" width="54" height="120" fill="none" stroke="#2a3a30" stroke-width="2"/>
       <rect x="645" y="196" width="44" height="18" fill="#f4ecd8"/>
       <text x="667" y="209" font-size="9" text-anchor="middle" ${serif} fill="#2a2440">STAFF</text>
       <rect x="650" y="294" width="34" height="30" rx="2" fill="#2a2a2a"/>
       ${[0, 1, 2].map(c => [0, 1].map(r => `<rect x="${654 + c * 9}" y="${298 + r * 11}" width="7" height="8" fill="#c8c0b0"/>`).join('')).join('')}
       <rect x="688" y="306" width="8" height="18" rx="2" fill="url(#tBrass)"/>`}

  <!-- front door -->
  <rect x="712" y="134" width="84" height="336" fill="#2e4a3a"/>
  <rect x="722" y="146" width="64" height="150" fill="#f4dca0"/><rect x="752" y="146" width="4" height="150" fill="#2e4a3a"/>
  <rect x="722" y="306" width="64" height="150" fill="none" stroke="#1e3428" stroke-width="3"/>
  <circle cx="726" cy="320" r="4" fill="url(#tBrass)"/>
  ${finish()}`;

// ---------------------------------------------------------------- behind the counter

function rackArt(sorted) {
  let out = `<rect x="56" y="80" width="348" height="252" fill="url(#tWood)" stroke="#3a2210" stroke-width="3"/>`;
  STREETS.forEach((s, i) => {
    const x = 66 + (i % 3) * 112, y = 90 + Math.floor(i / 3) * 120;
    out += `<rect x="${x}" y="${y}" width="104" height="110" fill="#2a1a0c"/>
      <rect x="${x + 10}" y="${y + 88}" width="84" height="16" fill="url(#tBrass)"/>
      <text x="${x + 52}" y="${y + 100}" font-size="10" text-anchor="middle" ${serif} fill="#2a1a0c">${s.name}</text>`;
    if (sorted) out += envelope(x + 18, y + 40, 68, 42, [], { rot: -3 + i * 2, tint: LETTERS.find(l => l.street === s.id).color, size: 7 });
  });
  return out;
}

const backRoom = g => {
  const sorted = g.flag('sorted');
  const heap = rng(7);
  return `${DEFS}
  <rect width="800" height="600" fill="#ddd0b0"/>
  <rect width="800" height="20" fill="#3e5a4a"/>
  <rect y="450" width="800" height="150" fill="url(#tFloor)"/>
  <polygon points="420,0 600,0 800,300 800,450 560,450" fill="url(#tBeam)"/>
  ${rackArt(sorted)}
  <!-- sorting table -->
  <rect x="40" y="356" width="380" height="16" fill="#5a3820"/>
  <rect x="54" y="372" width="12" height="80" fill="#4a2e18"/><rect x="396" y="372" width="12" height="80" fill="#4a2e18"/>
  ${sorted ? '' : LETTERS.map((l, i) => envelope(100 + heap() * 200, 312 + heap() * 20, 74, 46, [], { tint: l.color, rot: -20 + heap() * 40 })).join('')}
  ${sorted && !g.flag('took:letter') ? envelope(196, 320, 80, 50, [], { tint: '#e8dcc0', rot: 8, stamp: '#3a6a8a' })
    + `<rect x="206" y="340" width="44" height="14" fill="#f4f8f0" stroke="${INK}" stroke-width="1.5" transform="rotate(8 236 345)"/>` : ''}
  <!-- cupboard with gas ring and kettle -->
  <rect x="470" y="330" width="170" height="120" fill="#3e5a4a" stroke="#2a3a30" stroke-width="3"/>
  <rect x="484" y="344" width="68" height="94" fill="none" stroke="#2a3a30" stroke-width="2"/><rect x="558" y="344" width="68" height="94" fill="none" stroke="#2a3a30" stroke-width="2"/>
  <rect x="464" y="322" width="182" height="10" fill="#5a3820"/>
  <rect x="496" y="312" width="60" height="10" fill="#2a2a2a"/>
  <path d="M500 304 q26 -40 52 0 Z" fill="#9aa4a8" stroke="#5a6468" stroke-width="2"/>
  <path d="M500 296 q-18 -10 -22 -24" stroke="#5a6468" stroke-width="5" fill="none"/>
  <path d="M514 270 q12 -16 24 0" stroke="#2a2a2a" stroke-width="3" fill="none"/>
  <g opacity=".6"><path d="M476 264 q-10 -16 4 -30 q12 -14 0 -30" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round">
    <animate attributeName="opacity" values=".2;.8;.2" dur="3s" repeatCount="indefinite"/></path></g>
  <!-- green ink and pen -->
  <rect x="592" y="298" width="22" height="24" rx="3" fill="${INK}" opacity=".9"/><rect x="596" y="292" width="14" height="8" fill="#2a2a2a"/>
  <path d="M620 320 l22 -26" stroke="#2a2a2a" stroke-width="3"/>
  <!-- coat hook, green scarf -->
  <rect x="680" y="90" width="64" height="12" fill="#5a3820"/><circle cx="712" cy="112" r="5" fill="url(#tBrass)"/>
  <path d="M700 112 q-10 80 4 190 h20 q8 -110 0 -190 Z" fill="${INK}"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M702 ${130 + i * 20} h22" stroke="#1e5a34" stroke-width="2"/>`).join('')}
  <path d="M708 302 v14 M714 302 v18 M720 302 v12" stroke="${INK}" stroke-width="2"/>
  ${finish()}`;
};

// ---------------------------------------------------------------- close-ups

const noteArt = () => `${tableTop(3)}
  ${paper(220, 150, 360, 250, { tint: '#f6f0dc', rot: -3 })}
  <g transform="rotate(-3 400 275)">
    <text x="250" y="220" font-size="26" ${hand} fill="${INK}">Gone up the tower</text>
    <text x="250" y="262" font-size="26" ${hand} fill="${INK}">with the records.</text>
    <text x="250" y="304" font-size="26" ${hand} fill="${INK}">Back by five.</text>
    <text x="500" y="364" font-size="30" ${hand} fill="${INK}">W.</text>
  </g>
  ${finish()}`;

const stampArt = g => {
  const { d, m } = dateOf(g);
  const face = `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} 2026`;
  return `${tableTop(4)}
  <rect x="250" y="440" width="300" height="40" fill="#2a2a2a"/>
  <rect x="320" y="200" width="160" height="240" fill="#3a3a3a"/>
  <rect x="300" y="120" width="200" height="86" rx="34" fill="#7a4a2a"/>
  <rect x="334" y="290" width="132" height="54" fill="#f4ecd8" stroke="#1a1a1a" stroke-width="4"/>
  <text x="400" y="326" font-size="22" text-anchor="middle" ${mono} font-weight="bold" fill="#1a1a1a">${face}</text>
  <text x="400" y="372" font-size="12" text-anchor="middle" ${serif} fill="#c8c0b0">LITTLE WENDING · P.O.</text>
  ${paper(560, 380, 180, 120, { tint: '#f4ecd8', rot: 6 })}
  <g transform="rotate(6 650 440)" opacity=".85">
    <circle cx="650" cy="440" r="44" fill="none" stroke="#3a3a7a" stroke-width="3"/>
    <text x="650" y="436" font-size="14" text-anchor="middle" ${mono} fill="#3a3a7a">${String(d).padStart(2, '0')} ${MONTHS[m - 1]}</text>
    <text x="650" y="454" font-size="11" text-anchor="middle" ${mono} fill="#3a3a7a">2026</text>
  </g>
  ${finish()}`;
};

const ENVELOPE_FRONT = (peeled) => `
  ${envelope(170, 150, 460, 280, [], { tint: '#e8dcc0', stamp: '#3a6a8a' })}
  <g opacity=".85"><circle cx="520" cy="210" r="38" fill="none" stroke="#3a3a3a" stroke-width="2"/>
    <text x="520" y="206" font-size="11" text-anchor="middle" ${mono} fill="#3a3a3a">12 JUL</text>
    <text x="520" y="222" font-size="11" text-anchor="middle" ${mono} fill="#3a3a3a">2014</text></g>
  <text x="250" y="300" font-size="26" ${hand} fill="#2a2440">${peeled ? 'Robin Ashby' : ''}</text>
  <text x="250" y="336" font-size="22" ${hand} fill="#2a2440">3 Lantern Row</text>
  <text x="250" y="368" font-size="22" ${hand} fill="#2a2440">Little Wending</text>
  ${peeled ? '' : `<rect x="236" y="268" width="210" height="44" fill="#f4f8f0" stroke="${INK}" stroke-width="2.5" transform="rotate(-2 341 290)"/>
    <text x="341" y="298" font-size="20" text-anchor="middle" ${hand} fill="${INK}" transform="rotate(-2 341 290)">NO SUCH PERSON</text>`}`;

const envelopeArt = () => `${tableTop(6)}${ENVELOPE_FRONT(false)}
  <text x="400" y="480" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#f4ecd8">Sealed tight, and the label is stuck down hard. Peeling it would tear the envelope.</text>
  ${finish()}`;

const mumArt = () => `${tableTop(7)}
  <g transform="translate(-64,120) scale(.55)">${ENVELOPE_FRONT(true)}</g>
  ${paper(330, 60, 400, 470, { tint: '#f8f2e0', rot: 2 })}
  <g transform="rotate(2 530 295)" font-size="17" ${hand} fill="#2a2440">
    <text x="360" y="110">Robin, love,</text>
    <text x="360" y="150">You left your post-box key on the</text>
    <text x="360" y="176">hall table, so here it is. I'll keep</text>
    <text x="360" y="202">putting your post in box 7 until</text>
    <text x="360" y="228">you're back.</text>
    <text x="360" y="268">The house is very quiet. Wren asks</text>
    <text x="360" y="294">every day if you're coming home</text>
    <text x="360" y="320">for the summer. I tell them soon.</text>
    <text x="360" y="360">Write when you can.</text>
    <text x="560" y="410">Mum x</text>
  </g>
  ${finish()}`;

const boxArt = g => `${DEFS}
  <rect width="800" height="600" fill="#1e140a"/>
  <polygon points="80,60 720,60 640,140 160,140" fill="#2e2010"/>
  <polygon points="80,540 720,540 640,460 160,460" fill="#140c04"/>
  <polygon points="80,60 160,140 160,460 80,540" fill="#281a0c"/><polygon points="720,60 640,140 640,460 720,540" fill="#281a0c"/>
  <rect x="160" y="140" width="480" height="320" fill="#24180c"/>
  ${g.flag('took:postcard') ? '' : (() => {
    const r = rng(12);
    let cards = '';
    for (let i = 0; i < 9; i++) cards += `<rect x="${230 + r() * 30}" y="${300 - i * 9}" width="300" height="190" fill="${['#f4ecd8', '#e8d8b8', '#dce8ec', '#f0dcd0'][i % 4]}" stroke="#8a7a5a"
      transform="rotate(${-6 + r() * 12} 400 ${395 - i * 9})"/>`;
    return cards + `<rect x="246" y="222" width="300" height="190" fill="#f4ecd8" stroke="#8a7a5a" transform="rotate(-3 396 317)"/>
      <g transform="rotate(-3 396 317)">
        <rect x="256" y="232" width="170" height="170" fill="#7aa0c0"/>
        <path d="M256 340 h30 v-60 h20 v40 h24 v-80 h22 v100 h20 v-50 h26 v50 h28 v62 h-170 Z" fill="#4a5a6a"/>
        <text x="341" y="390" font-size="13" text-anchor="middle" ${serif} fill="#f4ecd8">Greetings from the City</text>
        <path d="M440 240 v150" stroke="#8a7a5a"/>
        <text x="452" y="270" font-size="12" ${hand} fill="#2a2440">Mum, Wren -</text>
        <path d="M452 290 h80 M452 310 h80 M452 330 h70" stroke="#6a6a8a"/>
      </g>
      <path d="M396 210 v210" stroke="#a33a2a" stroke-width="5"/><path d="M380 210 q16 12 32 0" stroke="#a33a2a" stroke-width="5" fill="none"/>`;
  })()}
  <text x="400" y="110" font-size="16" text-anchor="middle" ${serif} font-style="italic" fill="#c8b890">Box 7</text>
  ${finish()}`;

const postcardArt = () => `${tableTop(9)}
  <rect x="40" y="130" width="340" height="230" fill="#7aa0c0" stroke="#f4ecd8" stroke-width="10"/>
  <path d="M45 300 h40 v-80 h26 v54 h30 v-110 h28 v136 h26 v-70 h34 v70 h34 v-40 h30 v40 h42 v60 h-290 Z" fill="#4a5a6a"/>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="${60 + (i * 23) % 280}" y="${240 + (i * 17) % 60}" width="5" height="7" fill="#f2d050"/>`).join('')}
  <text x="210" y="342" font-size="18" text-anchor="middle" ${serif} fill="#f4ecd8">Greetings from the City</text>
  ${paper(410, 110, 360, 270, { tint: '#f8f2e0' })}
  <path d="M600 130 v230" stroke="#b8a888"/>
  <rect x="700" y="124" width="46" height="54" fill="#a33a2a" stroke="#f4ecd8" stroke-width="3"/>
  <g font-size="15" ${hand} fill="#2a2440">
    <text x="424" y="160">Mum, Wren,</text>
    <text x="424" y="192">First week done.</text>
    <text x="424" y="218">The city is loud</text>
    <text x="424" y="244">and nobody knows</text>
    <text x="424" y="270">me yet.</text>
    <text x="424" y="306">Tell Wren I'll be</text>
    <text x="424" y="332">home for the summer.</text>
    <text x="424" y="358">Promise. R x</text>
    <text x="612" y="240" font-size="13">Mrs Ashby</text>
    <text x="612" y="262" font-size="13">P.O. Box 7</text>
    <text x="612" y="284" font-size="13">Little Wending</text>
  </g>
  <text x="400" y="450" font-size="16" text-anchor="middle" ${serif} font-style="italic" fill="#f4ecd8">There are dozens more under it. Every one you sent.</text>
  ${finish()}`;

// ---------------------------------------------------------------- sorting puzzle board

const SORT_BOARD = (() => {
  let out = `<rect width="600" height="400" fill="#5a3820"/>`;
  STREETS.forEach((s, i) => {
    const x = 12 + (i % 3) * 196, y = 12 + Math.floor(i / 3) * 196;
    out += `<rect x="${x}" y="${y}" width="184" height="184" fill="#2a1a0c"/>
      <rect x="${x + 14}" y="${y + 146}" width="156" height="28" fill="url(#tBrass)"/>
      <text x="${x + 92}" y="${y + 166}" font-size="17" text-anchor="middle" ${serif} fill="#2a1a0c">${s.name}</text>`;
  });
  return DEFS + out;
})();
const SORT_SLOTS = STREETS.map((s, i) => ({ id: s.id, x: 104 + (i % 3) * 196, y: 82 + Math.floor(i / 3) * 196, r: 52 }));
const letterIcon = (l, w = 46, h = 32) => `<svg viewBox="0 0 ${w + 6} ${h + 6}" width="${w + 6}" height="${h + 6}">
  <rect x="1" y="1" width="${w}" height="${h}" fill="${l.color}" stroke="#8a7a5a"/>
  <rect x="${w - 12}" y="4" width="9" height="11" fill="#a33a2a"/>
  <path d="M8 ${h * 0.55} h${w * 0.55} M8 ${h * 0.75} h${w * 0.4}" stroke="#2a2440" stroke-width="2"/></svg>`;
const letterMark = l => `<g transform="translate(-40,-26)"><rect width="80" height="52" fill="${l.color}" stroke="#8a7a5a" stroke-width="1.5"/>
  <rect x="62" y="5" width="13" height="16" fill="#a33a2a"/>
  <path d="M10 28 h44 M10 38 h34" stroke="#2a2440" stroke-width="3"/></g>`;

// ---------------------------------------------------------------- export

const steam = g => {
  g.take('letter');
  g.give('mumLetter');
  g.give('key7');
  g.set('letterOpen');
  g.note('name', 'My name is <b>Robin Ashby</b>. The town has forgotten it.');
  g.note('mum', 'Mum\'s letter, from twelve years ago, with my post-box key: <i>"I\'ll keep putting your post in box 7."</i>');
  g.go('r1-mum');
  g.say('You hold the letter in the steam. The green label curls away, and under it is a name: Robin Ashby. Yours. The flap lifts; inside are a note in Mum\'s writing and a small key tagged 7.', 9000);
};

const openBox = g => {
  g.take('key7');
  g.set('boxOpen');
  g.go('r1-box');
  g.say('The key turns stiffly under the paint. Box 7 swings open. It is full of postcards.', 6000);
};

export default {
  id: 'r1',
  name: 'Post office',
  setup,
  hints: [
    { when: g => !g.flag('hatchOpen'), text: g => g.diff({
      easy: 'The card on the staff door says the code is today\'s date. The date stamp on the counter shows the date.',
      medium: 'The staff door has a keypad, and a card beside it. Something on the counter knows what day it is.',
      hard: 'The staff door has a keypad. Read the card beside it.' }) },
    { when: g => !g.flag('sorted'), text: 'Behind the counter, the post has not been sorted. Put each letter into its street\'s pigeonhole.' },
    { when: g => !g.flag('took:letter'), text: 'Something fell out from behind the sorting rack.' },
    { when: g => !g.flag('letterOpen'), text: g => g.diff({
      easy: 'Use the sealed letter on the kettle, behind the counter.',
      medium: 'The letter is sealed tight. Something behind the counter could open it without tearing it.',
      hard: 'The letter is sealed tight.' }) },
    { when: g => !g.flag('boxOpen'), text: g => g.diff({
      easy: 'Use the key on the private boxes. Box 7 is the one that has been painted over.',
      medium: 'The key\'s tag has a number. One of the private boxes has lost its number.',
      hard: 'The key\'s tag has a number.' }) },
    { when: g => !g.flag('took:postcard'), text: 'Box 7 is open. Look at what was kept in it.' },
    { text: 'Back to the map: a street has come back.' },
  ],

  scenes: {
    'r1-post': {
      room: 'r1',
      art: postOffice,
      enter: g => {
        if (g.flag('r1Seen')) return;
        g.set('r1Seen');
        g.say('The post office. You used to buy sherbet here with your pocket money. Nobody is behind the counter.', 6000);
      },
      hotspots: [
        { id: 'boxes', label: 'Private boxes', rect: [26, 88, 228, 248],
          say: 'Brass private boxes, numbered 1 to 16. Except one, which has been painted over.',
          use: { key7: g => g.say('The key\'s tag says 7. Box 7 is the one that has been painted over.') } },
        { id: 'box7', label: g => g.flag('boxOpen') ? 'Box 7' : 'Painted-over box', rect: [144, 158, 48, 52],
          sparkle: g => g.has('key7') || (g.flag('boxOpen') && !g.flag('took:postcard')),
          click: g => {
            if (g.flag('boxOpen')) return g.go('r1-box');
            g.say(g.has('key7')
              ? 'Between 6 and 8, so this is box 7. It has been painted the colour of the wall. Your key might still fit the lock under the paint.'
              : 'Between 6 and 8. Its number and its brass have been painted over in cream, neatly, recently. There is a keyhole under the paint.');
          },
          use: { key7: openBox } },
        { id: 'clock', label: 'Clock', circle: [680, 76, 30], say: 'Twenty past four. The clock has stopped.' },
        { id: 'bell', label: 'Bell', rect: [298, 296, 40, 32], say: 'Ding. Nobody comes.' },
        { id: 'stamp', label: 'Date stamp', rect: [380, 266, 64, 62], go: 'r1-stamp', sparkle: g => !g.flag('hatchOpen') && !g.flag('stampSeen') },
        { id: 'note', label: 'Note', rect: [456, 300, 70, 32], go: 'r1-note' },
        { id: 'scales', label: 'Parcel scales', rect: [536, 256, 80, 70], say: 'A parcel on the scales, waiting for a stamp that nobody will stick on it.' },
        { id: 'glass', label: 'Counter', rect: [276, 128, 340, 150], say: 'Behind the glass: a sorting rack, a kettle, a coat on a hook. The staff door is on the right.' },
        { id: 'staff', label: g => g.flag('hatchOpen') ? 'Behind the counter' : 'Staff door', rect: [630, 152, 74, 318],
          sparkle: g => !g.flag('sorted'),
          click: g => g.flag('hatchOpen') ? g.go('r1-back') : g.puzzle('r1-hatch') },
        { id: 'door', label: 'Back to the map', rect: [712, 134, 84, 336],
          sparkle: g => g.flag('took:postcard'),
          click: g => openMap(g) },
      ],
    },

    'r1-back': {
      room: 'r1', art: backRoom, nav: { back: 'r1-post' },
      enter: g => {
        if (g.flag('r1BackSeen')) return;
        g.set('r1BackSeen');
        g.say('Behind the counter. The kettle on the gas ring is still warm. The morning\'s post lies in a heap, unsorted.', 6000);
      },
      hotspots: [
        { id: 'rack', label: g => g.flag('sorted') ? 'Sorting rack' : 'Sorting rack and the post', rect: [40, 80, 380, 290],
          sparkle: g => !g.flag('sorted'),
          click: g => g.flag('sorted')
            ? g.say('Every letter in its street. There is no pigeonhole for Lantern Row.')
            : g.puzzle('r1-sort') },
        { id: 'letter', label: 'A letter', rect: [186, 306, 104, 80], take: 'letter',
          when: g => g.flag('sorted'),
          say: 'It fell from behind the rack. Addressed to Lantern Row, with a green label stuck over the name: NO SUCH PERSON.' },
        { id: 'kettle', label: 'Kettle', rect: [470, 250, 100, 74], sparkle: g => g.has('letter'),
          click: g => g.say(g.has('letter')
            ? 'Still warm, steam curling from the spout. Enough to soften old glue.'
            : 'A kettle on a gas ring, still warm. Someone was here not long ago.'),
          use: { letter: steam } },
        { id: 'cupboard', label: 'Cupboard', rect: [470, 330, 170, 120], say: 'Tea, string, a tin of biscuits gone soft.',
          use: { letter: g => g.say('The kettle is on top of the cupboard. Steam might soften the glue.') } },
        { id: 'ink', label: 'Green ink', rect: [586, 286, 62, 40],
          click: g => {
            g.note('ink', 'Behind the post office counter: a bottle of <b>green ink</b>. The label on my letter was written in it. So was the note signed W.');
            g.say('A bottle of green ink and a steel pen. The same green as the label on the letter, and the note on the counter.');
          } },
        { id: 'scarf', label: 'Green scarf', rect: [690, 100, 50, 222],
          say: 'A green scarf, hand-knitted, unravelling at one end. You knitted one like it once, badly, for Wren\'s birthday.' },
      ],
    },

    'r1-stamp': { room: 'r1', art: stampArt, nav: { back: 'r1-post' }, enter: g => g.set('stampSeen'), hotspots: [] },
    'r1-note': {
      room: 'r1', art: noteArt, nav: { back: 'r1-post' },
      enter: g => g.note('w-note', 'A note on the counter, in <b>green ink</b>: <i>"Gone up the tower with the records. Back by five. W."</i>'),
      hotspots: [],
    },
    'r1-envelope': {
      room: 'r1', art: envelopeArt, nav: { back: g => g.get('envReturn') ?? 'r1-back' },
      hotspots: [{ id: 'label', label: 'Green label', rect: [230, 262, 222, 56],
        say: 'NO SUCH PERSON, in green ink. Underneath, you can just make out the first letter of a name: R.' }],
    },
    'r1-mum': {
      room: 'r1', art: mumArt, nav: { back: g => g.get('mumReturn') ?? 'r1-back' },
      hotspots: [],
    },
    'r1-box': {
      room: 'r1', art: boxArt, nav: { back: 'r1-post' },
      hotspots: [
        { id: 'postcards', label: 'Your postcards', rect: [220, 190, 360, 250], when: g => !g.flag('took:postcard'), sparkle: true,
          click: g => {
            g.give('postcard');
            g.set('took:postcard');
            g.note('memory1', 'Memory: <b>my first postcard home</b>. <i>"Tell Wren I\'ll be home for the summer. Promise."</i> I didn\'t go home that summer. Or the next.');
            restoreStreet(g, 1);
            g.set('pcReturn', 'r1-box');
            g.go('r1-postcard');
            g.say('Your first postcard home. You remember writing it on the steps of a hostel, twelve years ago. You did not go home that summer. Or the next. Somewhere, ink runs across paper: a street is coming back.', 10000);
          } },
      ],
    },
    'r1-postcard': { room: 'r1', art: postcardArt, nav: { back: g => g.get('pcReturn') ?? 'r1-box' }, hotspots: [] },
  },

  puzzles: {
    'r1-hatch': {
      type: 'keypad',
      prompt: g => `A card is taped beside the keypad: <b>${g.diff({
        easy: 'STAFF: the code is today\'s date. Day, then month, as four digits (e.g. 3 May = 0305).',
        medium: 'STAFF: the code is today\'s date (DDMM).',
        hard: 'STAFF: today.' })}</b>`,
      solution: hatchCode,
      length: 4,
      okText: 'CLICK',
      errText: 'LOCKED',
      solve: g => {
        g.set('hatchOpen');
        g.say('The staff door clicks open.');
      },
    },

    'r1-sort': {
      type: 'assign',
      prompt: 'The morning\'s post. Click a letter, then click its street\'s pigeonhole.',
      width: 600, height: 400,
      art: SORT_BOARD,
      slots: SORT_SLOTS,
      tokenSize: 70,
      boardWidth: 420,
      config: g => ({
        tokens: [...LETTERS].sort((a, b) => a.who < b.who ? -1 : 1).map(l => ({
          id: l.id, type: l.street, label: letterIcon(l), mark: letterMark(l),
          name: addressOf(l, g), desc: `${l.who}, ${addressOf(l, g)}`,
        })),
      }),
      solution: Object.fromEntries(STREETS.map(s => [s.id, s.id])),
      doneText: 'All sorted.',
      solve: g => {
        g.set('sorted');
        g.note('lantern', 'Sorting the post, a letter fell from behind the rack, for <b>Lantern Row</b>. There is no pigeonhole for Lantern Row any more.');
        g.say('As the last letter slides home, another drops from behind the rack onto the table. It is addressed to Lantern Row. There is no pigeonhole for Lantern Row.', 8000);
      },
    },
  },
};

// ROOM 5: the old home, 3 Lantern Row. Keepsake: the note you left on Wren's pillow.
//
//   1. Strangers live here now, and they are out. Their note on the door: the key is under the
//      robin. Four stone birds in the front garden; lift the right one.
//   2. Inside, everything is freshly painted. Faint ridges on the kitchen door frame: the height
//      marks Mum made every birthday. Scrape the new paint off with the decorators' scraper.
//      Two names. Yours stops at 19.
//   3. The loose board in the cupboard under the stairs: your and Wren's old hiding place. A biscuit
//      tin with a combination lock. Green tape: "How tall you were the night you went."
//      Inside: the note you left on Wren's pillow. Tower Steps redraws.
//
// Every clue is in this room. Difficulty: HARD hides the robin's name in the fanlight, leaves the
// heights unwritten (read them off Mum's scale) and picks a different height each game.

import { DEFS, finish, paper, tableTop, hand, serif, mono, INK, rng } from '../art/common.js';
import { restoreStreet, openMap } from './town.js';

// ---------------------------------------------------------------- the height marks

const HARD_HEIGHTS = [170, 175, 180, 185];
function setup(g) {
  if (g.difficulty !== 'hard') return;
  g.set('r5Height', HARD_HEIGHTS[Math.floor(Math.random() * HARD_HEIGHTS.length)]);
}
/** How tall you were the night you left: the tin's combination. */
const heightOf = g => g.get('r5Height') ?? (g.difficulty === 'hard' ? 175 : 178);
const robinMarks = g => { const H = heightOf(g); return [[5, H - 66], [8, H - 48], [11, H - 32], [14, H - 15], [17, H - 4], [19, H]]; };
const WREN_MARKS = [[3, 96], [6, 118], [9, 134], [12, 149], [15, 161], [16, 165]];
const yOf = cm => 560 - (cm - 90) * 5;

function frameArt(g) {
  const scraped = g.flag('scraped');
  const showCm = g.difficulty !== 'hard';
  const r = rng(51);
  // scale: Mum's pencil ticks down the left edge of the frame
  let scale = '';
  for (let cm = 90; cm <= 190; cm += 5) {
    const big = cm % 10 === 0;
    scale += `<path d="M322 ${yOf(cm)} h${big ? 18 : 10}" stroke="#3a3a3a" stroke-width="${big ? 2 : 1.4}"/>`;
    if (big) scale += `<text x="314" y="${yOf(cm) + 4}" font-size="12" text-anchor="end" ${hand} fill="#3a3a3a">${cm}</text>`;
  }
  const mark = (age, cm, who, side) => {
    const y = yOf(cm);
    const x1 = side ? 400 : 344, x2 = side ? 478 : 400;
    const label = `${who} ${age}${showCm ? ` · ${cm}` : ''}`;
    return `${side ? `<path d="M340 ${y} H${x1}" stroke="#2a2a3a" stroke-width="1" opacity=".35"/>` : ''}
      <path d="M${x1} ${y} H${x2}" stroke="#2a2a3a" stroke-width="2.4"/>
      <text x="${side ? x1 + 4 : x1 + 2}" y="${y - 4}" font-size="${showCm ? 12.5 : 13}" ${hand} fill="#2a2a3a">${label}</text>`;
  };
  // patches of old varnish showing through where the paint came off
  let patches = '';
  for (let i = 0; i < 18; i++) patches += `<rect x="${322 + r() * 140}" y="${60 + i * 19}" width="${20 + r() * 26}" height="${6 + r() * 8}" fill="#f6f4ee" opacity=".6"/>`;
  const H = heightOf(g);
  return `${DEFS}
  <rect width="800" height="600" fill="#f2f0ea"/>
  <rect x="0" y="0" width="320" height="600" fill="#eeece4"/><rect x="480" y="0" width="320" height="600" fill="#e8e6de"/>
  <!-- the kitchen beyond the doorway -->
  <rect x="482" y="0" width="318" height="600" fill="#c8ccd0"/>
  <rect x="560" y="300" width="240" height="200" fill="#5a6066"/><rect x="560" y="290" width="240" height="14" fill="#8a9096"/>
  <rect x="600" y="80" width="140" height="120" fill="#a8c4d8" stroke="#f4f4f4" stroke-width="8"/>
  <rect y="540" width="800" height="60" fill="#8a6a44"/>
  <!-- the frame -->
  <rect x="320" y="0" width="160" height="600" fill="${scraped ? '#b88a54' : '#fafaf6'}"/>
  ${scraped ? `
    ${patches}
    <rect x="320" y="0" width="160" height="600" fill="url(#tWood)" opacity=".15"/>
    ${scale}
    ${WREN_MARKS.map(([a, cm]) => mark(a, cm, 'W', false)).join('')}
    ${robinMarks(g).map(([a, cm]) => mark(a, cm, 'R', true)).join('')}
    <path d="M400 ${yOf(H + 4)} H478" stroke="${INK}" stroke-width="2.4" stroke-dasharray="6 4"/>
    <text x="404" y="${yOf(H + 4) - 4}" font-size="12" ${hand} fill="${INK}">R 20?</text>` : `
    <g stroke="#e4e2da" stroke-width="2.4">
      ${[...WREN_MARKS.map(([, cm]) => `<path d="M344 ${yOf(cm)} H400"/>`), ...robinMarks(g).map(([, cm]) => `<path d="M400 ${yOf(cm)} H478"/>`)].join('')}
    </g>`}
  <path d="M320 0 V600 M480 0 V600" stroke="#c8c4b8" stroke-width="3"/>
  ${finish()}`;
}

// ---------------------------------------------------------------- the front garden

const BIRDS = [
  { id: 'wren', x: 150, say: 'You tip the stone wren. Underneath: a woodlouse, and nothing else. A small brown bird with its tail cocked up.' },
  { id: 'robin', x: 255 },
  { id: 'gull', x: 560, say: 'A stone seagull with a yellow beak. Under it: damp earth and a snail.' },
  { id: 'duck', x: 670, say: 'A stone duck with a green head. Nothing under it but a bottle top.' },
];

function birdArt(id, x, y = 520) {
  const plinth = `<rect x="${x - 26}" y="${y + 12}" width="52" height="16" fill="#9a968c" stroke="#6a665c"/>`;
  const shapes = {
    robin: `<ellipse cx="${x}" cy="${y - 4}" rx="22" ry="18" fill="#7a5a3a"/><ellipse cx="${x + 8}" cy="${y}" rx="11" ry="12" fill="#d8642a"/>
      <circle cx="${x + 14}" cy="${y - 18}" r="11" fill="#7a5a3a"/><circle cx="${x + 18}" cy="${y - 13}" r="7" fill="#d8642a"/>
      <circle cx="${x + 17}" cy="${y - 21}" r="2" fill="#111"/><path d="M${x + 24} ${y - 18} l8 2 l-8 2 Z" fill="#2a2a2a"/>
      <path d="M${x - 20} ${y - 2} l-12 4 l12 6 Z" fill="#6a4a2a"/>`,
    wren: `<ellipse cx="${x}" cy="${y}" rx="16" ry="12" fill="#8a6a44"/><circle cx="${x + 12}" cy="${y - 10}" r="8" fill="#8a6a44"/>
      <path d="M${x + 10} ${y - 13} q4 -2 8 0" stroke="#e8d8b0" stroke-width="2" fill="none"/>
      <circle cx="${x + 14}" cy="${y - 11}" r="1.6" fill="#111"/><path d="M${x + 19} ${y - 10} l9 1 l-9 2 Z" fill="#2a2a2a"/>
      <path d="M${x - 12} ${y - 4} l-6 -22 l8 3 l2 16 Z" fill="#7a5a34"/>
      <path d="M${x - 8} ${y - 2} h12 M${x - 8} ${y + 3} h14" stroke="#5a3a1a" stroke-width="1.5"/>`,
    gull: `<ellipse cx="${x}" cy="${y - 4}" rx="26" ry="15" fill="#f4f4f0" stroke="#b8b8b0"/><path d="M${x - 20} ${y - 10} q16 -6 30 4 l-8 8 Z" fill="#9aa0a6"/>
      <circle cx="${x + 18}" cy="${y - 18}" r="10" fill="#f4f4f0" stroke="#b8b8b0"/><circle cx="${x + 20}" cy="${y - 20}" r="1.8" fill="#111"/>
      <path d="M${x + 27} ${y - 18} l12 2 l-12 3 Z" fill="#e8c43a"/>`,
    duck: `<ellipse cx="${x}" cy="${y - 2}" rx="24" ry="14" fill="#a89070"/><circle cx="${x + 16}" cy="${y - 18}" r="10" fill="#2a6a3a"/>
      <path d="M${x + 8} ${y - 9} h14" stroke="#f4f4f0" stroke-width="3"/><circle cx="${x + 18}" cy="${y - 20}" r="1.8" fill="#111"/>
      <path d="M${x + 25} ${y - 18} q10 0 12 4 q-6 2 -12 0 Z" fill="#e8b83a"/>`,
  };
  return `<ellipse cx="${x}" cy="${y + 30}" rx="34" ry="6" fill="#000" opacity=".25"/>${plinth}${shapes[id]}`;
}

const doorNote = g => g.diff({
  easy: ['Gone to the harbour till 6.', 'Dan (boiler): key\'s under', 'the stone ROBIN, by the step.'],
  medium: ['Gone to the harbour till 6.', 'Dan (boiler): key is under', 'the robin.'],
  hard: ['Out till 6. Dan: key is under', 'the usual bird. (The one', 'over the door, ha ha.)'],
});

const front = g => {
  const open = g.flag('doorOpen');
  return `${DEFS}
  <rect width="800" height="600" fill="url(#tSky)"/>
  <!-- neighbours either side -->
  <rect x="0" y="80" width="90" height="400" fill="#c8b8a0"/><rect x="710" y="70" width="90" height="410" fill="#b8c4b8"/>
  <!-- number 3: cream plaster -->
  <path d="M90 120 L400 40 L710 120 V480 H90 Z" fill="#efe4cc"/>
  <path d="M80 124 L400 34 L720 124" stroke="#6a5a4a" stroke-width="10" fill="none"/>
  <rect x="140" y="140" width="120" height="96" fill="#9ab8c8" stroke="#f4f0e8" stroke-width="8"/>
  <rect x="540" y="140" width="120" height="96" fill="#9ab8c8" stroke="#f4f0e8" stroke-width="8"/>
  <!-- kitchen window -->
  <rect x="120" y="290" width="160" height="110" fill="#a8c4d4" stroke="#f4f0e8" stroke-width="8"/>
  <path d="M200 290 V400" stroke="#f4f0e8" stroke-width="6"/>
  <rect x="112" y="400" width="176" height="10" fill="#d8d0c0"/>
  <path d="M232 396 q6 -24 12 0 M238 396 q-10 -18 -2 -22 M240 392 q10 -14 4 -20" stroke="#4a8a3a" stroke-width="4" fill="none"/>
  <rect x="228" y="390" width="20" height="10" fill="#c87a4a"/>
  <!-- the door, painted navy by the new people -->
  <rect x="332" y="246" width="136" height="234" fill="#e4dac2"/>
  <path d="M340 236 a60 60 0 0 1 120 0 Z" fill="#e8e0c8" stroke="#6a5a4a" stroke-width="4"/>
  <!-- fanlight: stained glass, with a robin -->
  <path d="M346 234 a54 54 0 0 1 108 0 Z" fill="#c8dce0"/>
  ${[0, 1, 2, 3].map(i => `<path d="M400 234 L${400 + 54 * Math.cos(Math.PI * (i + 1) / 5)} ${234 - 54 * Math.sin(Math.PI * (i + 1) / 5)}" stroke="#4a4a4a" stroke-width="2"/>`).join('')}
  <ellipse cx="400" cy="210" rx="14" ry="11" fill="#7a5a3a"/><ellipse cx="405" cy="213" rx="7" ry="7" fill="#d8642a"/><circle cx="409" cy="200" r="6" fill="#7a5a3a"/>
  ${open ? `<rect x="342" y="246" width="116" height="226" fill="#3a3028"/><path d="M342 246 l-30 -8 v240 l30 -6 Z" fill="#2a3a5a"/>
    <rect x="350" y="260" width="100" height="212" fill="#f4f0e8" opacity=".5"/>` : `
    <rect x="342" y="246" width="116" height="226" fill="#2a3a5a" stroke="#1a2440" stroke-width="3"/>
    <rect x="354" y="258" width="92" height="90" fill="none" stroke="#1a2440" stroke-width="3"/>
    <rect x="354" y="364" width="92" height="96" fill="none" stroke="#1a2440" stroke-width="3"/>
    <circle cx="444" cy="360" r="5" fill="url(#tBrass)"/>
    ${paper(370, 282, 62, 46, { tint: '#fffdf4', rot: 3 })}
    <path d="M378 296 h44 M378 306 h40 M378 316 h30" stroke="#2a2a3a" stroke-width="2" transform="rotate(3 400 305)"/>`}
  <rect x="476" y="300" width="24" height="30" rx="3" fill="url(#tBrass)"/>
  <text x="488" y="322" font-size="20" text-anchor="middle" ${serif} fill="#2a1a0c">3</text>
  <!-- step and path -->
  <rect x="326" y="478" width="148" height="14" fill="#a8a49a"/>
  <rect y="480" width="800" height="120" fill="#6a8a4a"/>
  <path d="M340 492 L300 600 H500 L460 492 Z" fill="#b8b0a0"/>
  <!-- the new family's bike -->
  <g stroke="#c43a4a" stroke-width="5" fill="none">
    <circle cx="560" cy="440" r="26" stroke="#2a2a2a" stroke-width="5"/><circle cx="640" cy="440" r="26" stroke="#2a2a2a" stroke-width="5"/>
    <path d="M560 440 L590 400 H630 L640 440 M590 400 L600 440 H560 M630 400 l6 -16"/>
  </g>
  <!-- lamp post: Lantern Row -->
  <rect x="740" y="150" width="8" height="340" fill="#2a2a2e"/><path d="M730 150 h28 l-6 -30 h-16 Z" fill="#2a2a2e"/><rect x="734" y="124" width="20" height="22" fill="#f2d880"/>
  <!-- garden gate -->
  <rect x="0" y="420" width="70" height="120" fill="none"/>
  ${[8, 26, 44].map(x => `<rect x="${x}" y="430" width="10" height="110" fill="#e8e4dc"/>`).join('')}
  <path d="M4 450 h56 M4 510 h56" stroke="#e8e4dc" stroke-width="8"/>
  ${BIRDS.map(b => birdArt(b.id, b.x)).join('')}
  ${finish()}`;
};

// ---------------------------------------------------------------- the hall

const hall = g => {
  const scraped = g.flag('scraped');
  return `${DEFS}
  <rect width="800" height="600" fill="#f4f2ec"/>
  <rect y="470" width="800" height="130" fill="#a87a4a"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 100} 470 L${i * 100 - 60} 600" stroke="#7a5430" stroke-width="2"/>`).join('')}
  <rect y="460" width="800" height="12" fill="#fafaf6"/>
  <!-- coats -->
  <rect x="40" y="150" width="80" height="10" fill="#8a6a44"/>
  <path d="M52 160 q-12 60 0 130 h30 q8 -70 -6 -130 Z" fill="#c8a43a"/><path d="M86 160 q-6 50 6 104 h24 q4 -60 -10 -104 Z" fill="#3a5a8a"/>
  <!-- the new family's photo -->
  <rect x="150" y="160" width="110" height="84" fill="#2a2a2a"/><rect x="156" y="166" width="98" height="72" fill="#9cc0d4"/>
  ${[176, 200, 222, 240].map((x, i) => `<circle cx="${x}" cy="${196 + (i > 1 ? 8 : 0)}" r="${i > 1 ? 7 : 9}" fill="#e8c4a0"/><rect x="${x - 9}" y="${206 + (i > 1 ? 8 : 0)}" width="18" height="30" fill="${['#c43a4a', '#3a6a5a', '#e8b83a', '#7a5a8a'][i]}"/>`).join('')}
  <!-- kitchen doorway -->
  <rect x="340" y="110" width="140" height="350" fill="#c8ccd0"/>
  <rect x="380" y="260" width="100" height="120" fill="#5a6066"/><rect x="380" y="250" width="100" height="12" fill="#8a9096"/>
  <rect x="396" y="140" width="70" height="70" fill="#a8c4d8" stroke="#f4f4f4" stroke-width="5"/>
  <path d="M326 460 V96 H494 V460" stroke="${scraped ? '#b88a54' : '#fafaf6'}" stroke-width="16" fill="none"/>
  <path d="M318 460 V88 H502 V460" stroke="#d8d6ce" stroke-width="2" fill="none"/>
  ${scraped ? Array.from({ length: 12 }, (_, i) => `<path d="M488 ${160 + i * 24} h12" stroke="#2a2a3a" stroke-width="2"/>`).join('') : ''}
  <!-- decorating kit -->
  <path d="M120 470 q40 -24 140 -10 q30 6 40 14 v30 h-180 Z" fill="#e8e4d4"/>
  <rect x="160" y="420" width="50" height="56" rx="4" fill="#f4f4f4" stroke="#9a9a9a" stroke-width="2"/>
  <rect x="160" y="436" width="50" height="22" fill="#3a6aa4"/><text x="185" y="451" font-size="8" text-anchor="middle" ${mono} fill="#fff">WHITE</text>
  ${g.flag('took:scraper') ? '' : `<rect x="216" y="452" width="38" height="12" fill="#c4c8cc" stroke="#6a6e72"/><rect x="250" y="454" width="30" height="8" rx="3" fill="#c43a2a"/>`}
  <!-- stairs and cupboard -->
  <path d="M560 470 L800 160 V470 Z" fill="#e8e4dc"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${560 + i * 27} ${470 - i * 34} h27 v-34" stroke="#c8c0b0" stroke-width="3" fill="none"/>`).join('')}
  <path d="M560 470 L800 160" stroke="#8a6a44" stroke-width="8"/>
  <path d="M600 470 V390 L700 300 V470 Z" fill="${g.flag('cupOpen') ? '#2a2420' : '#f8f6f0'}" stroke="#c8c4b8" stroke-width="4"/>
  <circle cx="686" cy="400" r="5" fill="url(#tBrass)"/>
  ${finish()}`;
};

const cupboard = g => {
  const up = g.flag('boardUp');
  return `${DEFS}
  <rect width="800" height="600" fill="#2a2420"/>
  <path d="M0 0 L800 0 L800 420 Z" fill="#1a1612"/>
  <rect y="430" width="800" height="170" fill="#6a4a2a"/>
  ${Array.from({ length: 6 }, (_, i) => `<path d="M0 ${440 + i * 28} H800" stroke="#4a301a" stroke-width="2"/>`).join('')}
  <!-- hoover and shoes -->
  <rect x="80" y="200" width="70" height="230" rx="20" fill="#c43a6a"/><rect x="100" y="110" width="12" height="100" fill="#6a6a6a"/>
  <ellipse cx="560" cy="430" rx="40" ry="12" fill="#3a3a3a"/><ellipse cx="640" cy="434" rx="40" ry="12" fill="#5a4a3a"/>
  <!-- light from the hall -->
  <polygon points="800,0 800,600 360,600" fill="#fff2c8" opacity=".12"/>
  ${up ? `
    <rect x="290" y="496" width="220" height="40" fill="#0e0a08"/>
    <path d="M290 496 l-10 -60 h220 l10 60 Z" fill="#7a5a34" stroke="#3a2210" stroke-width="2"/>
    <rect x="326" y="486" width="148" height="40" rx="6" fill="#a83a2a" stroke="#5a1a10" stroke-width="2"/>
    <rect x="336" y="494" width="128" height="16" fill="#f2d880" opacity=".7"/>
    <rect x="392" y="490" width="16" height="10" fill="url(#tBrass)"/>
    <rect x="352" y="508" width="70" height="12" fill="#e8f0e0" stroke="${INK}"/>` : `
    <path d="M290 496 h220 v28 h-220 Z" fill="#7a5634" stroke="#3a2210" stroke-width="2"/>
    <path d="M300 502 l-4 -4" stroke="#2a1a0a" stroke-width="3"/>`}
  ${finish()}`;
};

const tinOpen = g => {
  const taken = g.flag('took:goodbye');
  return `${tableTop(52)}
  <rect x="150" y="120" width="500" height="380" rx="20" fill="#a83a2a" stroke="#5a1a10" stroke-width="5"/>
  <rect x="170" y="140" width="460" height="340" rx="12" fill="#c8b8a0"/>
  <!-- cassette -->
  <rect x="190" y="160" width="160" height="100" rx="6" fill="#2a2a2e" transform="rotate(-6 270 210)"/>
  <rect x="204" y="172" width="132" height="34" fill="#f4ecd8" transform="rotate(-6 270 210)"/>
  <text x="270" y="194" font-size="14" text-anchor="middle" ${hand} fill="#2a2440" transform="rotate(-6 270 210)">R's mix for W</text>
  <!-- robin badge -->
  <circle cx="560" cy="200" r="36" fill="#f4ecd8" stroke="#8a8a8a" stroke-width="3"/>
  <ellipse cx="560" cy="206" rx="18" ry="14" fill="#7a5a3a"/><ellipse cx="566" cy="210" rx="9" ry="9" fill="#d8642a"/><circle cx="570" cy="192" r="8" fill="#7a5a3a"/>
  <!-- Wren's list -->
  ${paper(410, 300, 200, 160, { tint: '#f4f8ee', rot: 5 })}
  <g transform="rotate(5 510 380)" font-size="14" ${hand} fill="${INK}">
    <text x="424" y="330">Things I couldn't</text><text x="424" y="350">throw away:</text>
    <text x="430" y="378">- the tape</text><text x="430" y="398">- the badge</text><text x="430" y="418">- your note</text>
  </g>
  ${taken ? `<text x="280" y="390" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">(the note you took)</text>` : `
    ${paper(200, 300, 180, 150, { tint: '#fbf8ee', rot: -4 })}
    <g transform="rotate(-4 290 375)" font-size="14" ${hand} fill="#2a3a7a">
      <text x="216" y="336">W -</text><text x="216" y="360">I'm rubbish at</text><text x="216" y="382">goodbyes, so...</text>
    </g>`}
  ${finish()}`;
};

const noteArt = () => `${tableTop(53)}
  ${paper(170, 50, 460, 500, { tint: '#fbf8ee', rot: -2 })}
  <g transform="rotate(-2 400 300)" ${hand}>
    <g font-size="21" fill="#2a3a7a">
      <text x="210" y="110">W -</text>
      <text x="210" y="150">I'm rubbish at goodbyes, so I'm</text>
      <text x="210" y="182">getting the 4.20 train before you</text>
      <text x="210" y="214">wake up. Sorry.</text>
      <text x="210" y="258">I'll be back for the summer.</text>
      <text x="210" y="290">Promise. Wind the tower clock</text>
      <text x="210" y="322">for me till then?</text>
      <text x="480" y="368" font-size="26">R</text>
    </g>
    <path d="M210 400 H590" stroke="#c8c0b0" stroke-dasharray="4 6"/>
    <g font-size="18" fill="${INK}">
      <text x="210" y="440">I wound it every day.</text>
      <text x="210" y="470">Then the summer ended, and I stopped it</text>
      <text x="210" y="500">at twenty past four.  W.</text>
    </g>
  </g>
  ${finish()}`;

// ---------------------------------------------------------------- export

export default {
  id: 'r5',
  name: 'Lantern Row',
  setup,
  hints: [
    { when: g => !g.flag('doorOpen') && !g.has('housekey'), text: g => g.diff({
      easy: 'Read the note on the door, then lift the stone robin (the bird with the orange-red breast).',
      medium: 'The new people left a note on the door for someone.',
      hard: 'Read the note on the door. Look up.' }) },
    { when: g => !g.flag('doorOpen'), text: 'Use the key on the front door.' },
    { when: g => !g.flag('scraped'), text: g => g.diff({
      easy: 'There are faint ridges under the new paint on the kitchen door frame. Take the scraper from the decorating things and use it on the frame.',
      medium: 'Something is under the new paint on the kitchen door frame.',
      hard: 'Mum measured you every birthday.' }) },
    { when: g => !g.flag('tinOpen'), text: g => g.diff({
      easy: 'The cupboard under the stairs has a loose board. The tin\'s code is your last height mark (R 19) on the door frame.',
      medium: 'You and Wren used to hide things under a loose board. Under the stairs.',
      hard: 'You and Wren had a hiding place.' }) },
    { when: g => !g.flag('took:goodbye'), text: 'Take the note.' },
    { text: 'Back to the map: the last street has come back.' },
  ],

  scenes: {
    'r5-front': {
      room: 'r5',
      art: front,
      enter: g => {
        if (g.flag('r5Seen')) return;
        g.set('r5Seen');
        g.say('3 Lantern Row. The door is a different colour, there is a bike that isn\'t yours, and someone else\'s basil is on Mum\'s windowsill. Nobody is in.', 8000);
      },
      hotspots: [
        { id: 'gate', label: 'Back to the map', rect: [0, 420, 70, 120], sparkle: g => g.flag('took:goodbye'), click: g => openMap(g) },
        { id: 'window', label: 'Kitchen window', rect: [116, 286, 168, 124],
          say: 'A new kitchen, all grey gloss. The windowsill where the robin and the wren used to come has a pot of basil on it now.' },
        { id: 'upstairs', label: 'Upstairs windows', rect: [136, 136, 528, 104],
          say: 'Your room was on the left, Wren\'s on the right. There are dinosaur curtains in yours now.' },
        { id: 'fanlight', label: 'Fanlight', rect: [344, 178, 112, 58],
          say: 'The stained glass over the door. Mum had it made the year you were born: a robin, with an orange breast.' },
        { id: 'door', label: g => g.flag('doorOpen') ? 'Go inside' : g.has('housekey') ? 'Front door (you have the key)' : 'Front door',
          rect: [332, 246, 136, 232],
          sparkle: g => g.has('housekey') || (g.flag('doorOpen') && !g.flag('took:goodbye')),
          click: g => {
            if (g.flag('doorOpen')) return g.go('r5-hall');
            g.say(g.has('housekey') ? 'Locked. Use the key you found under the robin.' : 'Locked. Your key would not fit any more anyway. There is a note pinned to the door.');
          },
          use: { housekey: g => {
            g.take('housekey');
            g.set('doorOpen');
            g.say('The key turns. You are standing in your own front doorway, a guest.', 5000);
          } } },
        { id: 'note', label: 'Note on the door', rect: [366, 278, 70, 54], when: g => !g.flag('doorOpen'),
          click: g => {
            const t = doorNote(g).join(' ');
            g.note('r5-door', `Note on the door of 3 Lantern Row: <i>"${t}"</i>`);
            g.say(`A note on the door: "${t}"`, 7000);
          },
          use: { housekey: g => g.say('The keyhole is just below the note. Use the key on the door itself.') } },
        { id: 'number', label: 'Number 3', rect: [474, 298, 28, 34], say: 'Number 3. Mum polished it every Sunday. Someone still does.' },
        { id: 'bike', label: 'Bike', rect: [530, 380, 140, 90], say: 'A small red bike with stabilisers. A child lives in your house.' },
        { id: 'lamp', label: 'Lamp post', rect: [726, 110, 40, 380], say: 'The lamp that gave Lantern Row its name. You and Wren used to race to it and back.' },
        ...BIRDS.map(b => ({
          id: `orn-${b.id}`, label: 'Stone bird', rect: [b.x - 36, 470, 72, 80],
          sparkle: g => b.id === 'robin' && g.hasNote('r5-door') && !g.has('housekey') && !g.flag('doorOpen'),
          click: g => {
            if (b.id !== 'robin') return g.say(b.say);
            if (g.has('housekey') || g.flag('doorOpen')) return g.say('The stone robin. Nothing else under it.');
            g.give('housekey');
            g.say('You tip the stone robin. Underneath, in a little plastic bag: a front-door key.', 5000);
          },
        })),
      ],
    },

    'r5-hall': {
      room: 'r5', art: hall, nav: { back: 'r5-front' },
      enter: g => {
        if (g.flag('r5HallSeen')) return;
        g.set('r5HallSeen');
        g.say('The hall smells of fresh paint. Everything is white now. It is the right shape and the wrong colour, like a dream of a house.', 7000);
      },
      hotspots: [
        { id: 'coats', label: 'Coats', rect: [36, 146, 92, 150], say: 'A yellow raincoat, a blue one. Someone else\'s family.' },
        { id: 'photo', label: 'Photo', rect: [150, 160, 110, 84], say: 'A family on a beach, smiling, in your hallway. They look nice. That is almost worse.' },
        { id: 'kit', label: g => g.flag('took:scraper') ? 'Decorating things' : 'Decorating things (a scraper)', rect: [120, 412, 180, 62],
          click: g => {
            if (g.flag('took:scraper')) return g.say('A tin of brilliant white and a dust sheet. They painted over everything.');
            g.give('scraper');
            g.set('took:scraper');
            g.say('A tin of BRILLIANT WHITE, a dust sheet, and a paint scraper. You take the scraper.');
          } },
        { id: 'frame', label: 'Kitchen door frame', rect: [310, 86, 200, 380],
          sparkle: g => !g.flag('scraped') && g.has('scraper'),
          click: g => g.go('r5-frame'),
          use: { scraper: g => { g.go('r5-frame'); scrape(g); } } },
        { id: 'cupboard', label: 'Cupboard under the stairs', rect: [600, 300, 100, 170],
          sparkle: g => g.flag('scraped') && !g.flag('tinOpen'),
          click: g => { g.set('cupOpen'); g.go('r5-cupboard'); } },
        { id: 'stairs', label: 'Stairs', rect: [700, 160, 100, 300], say: 'Fourteen stairs. The seventh one creaks. You and Wren used to step over it on Christmas Eve.' },
      ],
    },

    'r5-frame': {
      room: 'r5', art: frameArt, nav: { back: 'r5-hall' },
      enter: g => { if (!g.flag('scraped')) g.say('The kitchen door frame, freshly painted. Tilt your head: under the paint there are faint ridges. Little lines, one above another, all the way up.', 7000); },
      hotspots: [
        { id: 'frame', label: g => g.flag('scraped') ? 'Height marks' : 'Door frame', rect: [300, 0, 200, 600],
          click: g => g.flag('scraped')
            ? g.say(g.diff({
              easy: `Your marks, R, on the right; Wren's, W, on the left. Your last one: R 19, ${heightOf(g)} cm. The night you went.`,
              medium: 'R on the right, W on the left, Mum\'s scale up the edge. Yours stop at 19.',
              hard: 'R on the right, W on the left, Mum\'s scale up the edge. Yours stop at 19.' }), 6000)
            : g.say(g.has('scraper') ? 'Ridges under the paint. The scraper would take it off.' : 'Ridges under the paint. If you could get the paint off...'),
          use: { scraper: scrape } },
      ],
    },

    'r5-cupboard': {
      room: 'r5', art: cupboard, nav: { back: 'r5-hall' },
      hotspots: [
        { id: 'hoover', label: 'Hoover', rect: [70, 100, 90, 330], say: 'A pink hoover. Mum\'s was older and louder.' },
        { id: 'board', label: g => g.flag('boardUp') ? 'The hiding place' : 'Floorboard', rect: [270, 420, 260, 120],
          sparkle: g => !g.flag('tinOpen'),
          click: g => {
            if (!g.flag('boardUp')) {
              g.set('boardUp');
              return g.say('The third board from the wall. It still lifts if you press the end. Your and Wren\'s hiding place, and there is something in it: the old red biscuit tin, with a little combination lock.', 8000);
            }
            if (g.flag('tinOpen')) return g.go('r5-tin');
            g.note('r5-tin', `The old biscuit tin under the stairs, with a 3-digit lock. Green tape on the lid: <i>"${tinLabel(g)}"</i>`);
            g.puzzle('r5-lock');
          } },
      ],
    },

    'r5-tin': {
      room: 'r5', art: tinOpen, nav: { back: 'r5-cupboard' },
      hotspots: [
        { id: 'tape', label: 'Cassette', rect: [184, 150, 172, 120], say: '"R\'s mix for W." You made it the week before you left. Wren must have played it until the tape stretched.' },
        { id: 'badge', label: 'Badge', rect: [520, 160, 80, 80], say: 'A tin badge with a robin on it. You won it at the fete and gave it to Wren, who wore it every day for a year.' },
        { id: 'list', label: 'Wren\'s list', rect: [404, 296, 212, 168],
          click: g => {
            g.note('r5-list', 'In the tin, in <b>green ink</b>: <i>"Things I couldn\'t throw away: the tape, the badge, your note."</i>');
            g.say('In green ink: "Things I couldn\'t throw away." Wren erased you from everywhere else. Not from here.', 7000);
          } },
        { id: 'note', label: 'Your note', rect: [196, 296, 190, 160], when: g => !g.flag('took:goodbye'), sparkle: true,
          click: g => {
            g.give('goodbye');
            g.set('took:goodbye');
            g.note('memory5', 'Memory: <b>the night you left</b>. You caught the 4.20 train so you would not have to say goodbye, and left a note on Wren\'s pillow: wind the tower clock till I\'m back.');
            restoreStreet(g, 5);
            g.set('goodbyeReturn', 'r5-tin');
            g.go('r5-note');
            g.say('Your own handwriting. You left at twenty past four in the morning so you would not have to watch Wren cry. Twenty past four: the time on every stopped clock in town. Somewhere, the steps up to the tower are coming back.', 12000);
          } },
      ],
    },
    'r5-note': { room: 'r5', art: noteArt, nav: { back: g => g.get('goodbyeReturn') ?? 'r5-tin' }, hotspots: [] },
  },

  puzzles: {
    'r5-lock': {
      type: 'keypad',
      prompt: g => `The old biscuit tin. Green tape on the lid: <b>"${tinLabel(g)}"</b>`,
      solution: g => String(heightOf(g)),
      length: 3,
      okText: 'CLICK',
      errText: 'STUCK',
      solve: g => {
        g.set('tinOpen');
        g.go('r5-tin');
        g.say('The lock clicks. Inside the tin is everything you left behind.', 5000);
      },
    },
  },
};

function tinLabel(g) {
  return g.diff({
    easy: 'Code: how tall you were the night you went (your last mark on the kitchen door frame, in cm). W.',
    medium: 'Code: how tall you were the night you went. W.',
    hard: 'How tall were you, the night you went? W.',
  });
}

function scrape(g) {
  if (g.flag('scraped')) return g.say('The marks are uncovered already.');
  g.take('scraper');
  g.set('scraped');
  g.note('r5-marks', 'Under the paint on the kitchen door frame: Mum\'s height marks. <b>R</b> and <b>W</b>, every birthday. Mine stop at 19. Above the last one, a dashed line in <b>green ink</b>: <i>"R 20?"</i>');
  g.say('The new paint flakes away. Underneath: Mum\'s pencil marks, every birthday. W on one side, R on the other. Yours stop at 19. Above the last one, in green ink, a dashed line nobody ever reached: "R 20?"', 9000);
}

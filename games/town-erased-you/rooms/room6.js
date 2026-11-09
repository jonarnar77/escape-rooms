// ROOM 6: the clock tower. The ending.
//
//   1. Wren is in the clock room, with a ledger: THINGS TO FORGET. Six lines, each crossed out in
//      green. Give Wren the six keepsakes (the map and one from each place), in any order: each one
//      is a conversation, and its line comes back.
//   2. Then Wren hands you the winding crank. Wind the mechanism.
//   3. Set the tower clock to the right time: the station clock, seen from the tower window.
//      The clock strikes, the town remembers, and you go home together.
//
// This is the one room that uses things from the others (the keepsakes), and it says so.
// Difficulty: HARD picks a different station time each game; EASY reads it out.

import { DEFS, finish, paper, tableTop, hand, serif, mono, INK, rng } from '../art/common.js';
import { openMap } from './town.js';

// ---------------------------------------------------------------- the ledger

const KEEPSAKES = [
  { item: 'map', line: 'Our town.',
    reply: '"Our town." Wren unfolds it and traces Tower Steps with one finger. "You drew the sea. I drew the tower. I always wanted to be the one who looked after the clock." The street has come back. All of them have.' },
  { item: 'postcard', line: 'The promise.',
    reply: 'Wren reads the postcard without picking it up. "Tell Wren I\'ll be home for the summer. Promise." "That was on my wall for a year," Wren says. "Then I put it in box 7 with the others and painted over the door."' },
  { item: 'drawing', line: 'The way home.',
    reply: '"The way home. I drew it so you couldn\'t get lost." Something that is almost a laugh. "You still got lost."' },
  { item: 'frontpage', line: 'The night of the storm.',
    reply: '"Found at dawn." Wren touches the photograph: two soaked children under a lighthouse. "You came out in the storm for me. I thought you always would. That was the trouble."' },
  { item: 'rubbing', line: 'Why Mum chose our names.',
    reply: '"Birds always come home," Wren says, in Mum\'s voice exactly. "She said it every winter. She said it at the end, too. She was still waiting."' },
  { item: 'goodbye', line: 'Twenty past four.',
    reply: 'Wren goes very still. "I wound it every day. Every single day, until September. Then I stopped it at the time you left, and I started taking you out of things. If nobody said your name, I didn\'t have to keep saying: not yet."' },
];
const given = g => KEEPSAKES.filter(k => g.flag(`gave:${k.item}`)).length;
const allGiven = g => given(g) === KEEPSAKES.length;

// ---------------------------------------------------------------- the station clock

const pick = a => a[Math.floor(Math.random() * a.length)];
function setup(g) {
  if (g.difficulty !== 'hard') return;
  g.set('r6Station', { h: pick([9, 10, 11, 1, 2, 3, 4]), m: pick([5, 10, 25, 35, 40, 50, 55]) });
}
const stationTime = g => g.get('r6Station') ?? (g.difficulty === 'hard' ? { h: 11, m: 50 } : { h: 10, m: 35 });
const SAY_MIN = { 0: 'o\'clock', 5: 'five past', 10: 'ten past', 15: 'quarter past', 20: 'twenty past', 25: 'twenty-five past', 30: 'half past',
  35: 'twenty-five to', 40: 'twenty to', 45: 'quarter to', 50: 'ten to', 55: 'five to' };
const NUM = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
function sayTime({ h, m }) {
  if (m === 0) return `${NUM[h]} o'clock`;
  return `${SAY_MIN[m]} ${NUM[m > 30 ? h % 12 + 1 : h]}`;
}

function hands(cx, cy, r, { h, m }, color = '#1a1208', w = 1) {
  return `<g transform="translate(${cx},${cy})">
    <line y2="${-r * 0.5}" transform="rotate(${(h % 12) * 30 + m / 2})" stroke="${color}" stroke-width="${5 * w}" stroke-linecap="round"/>
    <line y2="${-r * 0.8}" transform="rotate(${m * 6})" stroke="${color}" stroke-width="${3 * w}" stroke-linecap="round"/>
    <circle r="${4 * w}" fill="${color}"/></g>`;
}
function dial(cx, cy, r, t, { numerals = true } = {}) {
  let ticks = '';
  for (let i = 0; i < 12; i++) ticks += `<line y1="${-r + 3}" y2="${-r + r * 0.14}" transform="rotate(${i * 30})" stroke="#2a1c10" stroke-width="${Math.max(1, r / 22)}"/>`;
  const nums = numerals ? [12, 3, 6, 9].map((n, i) => {
    const a = (i * 90 - 90) * Math.PI / 180;
    return `<text x="${Math.cos(a) * r * 0.68}" y="${Math.sin(a) * r * 0.68 + r * 0.1}" font-size="${r * 0.28}" text-anchor="middle" ${serif} fill="#2a1c10">${n}</text>`;
  }).join('') : '';
  return `<g transform="translate(${cx},${cy})"><circle r="${r + r * 0.08}" fill="#2a2a2e"/><circle r="${r}" fill="#f6efdc"/>${ticks}${nums}</g>${hands(cx, cy, r, t, '#1a1208', r / 50)}`;
}

// ---------------------------------------------------------------- art

const towerTime = g => g.get('r6Set') ?? { h: 4, m: 20 };

const base = g => `${DEFS}
  <rect width="800" height="600" fill="#6a6258"/>
  ${(() => { const r = rng(61); let o = ''; for (let y = 0; y < 470; y += 34) for (let x = (y / 34) % 2 ? -40 : 0; x < 800; x += 80) o += `<rect x="${x + 2}" y="${y + 2}" width="76" height="30" fill="#7a7266" opacity="${0.4 + r() * 0.4}"/>`; return o; })()}
  <rect y="470" width="800" height="130" fill="#4a4238"/>
  <!-- door -->
  <path d="M30 470 V200 q50 -60 100 0 V470 Z" fill="#f4dca0" opacity=".85"/>
  <path d="M30 470 V200 q50 -60 100 0 V470" fill="none" stroke="#3a3228" stroke-width="8"/>
  <!-- shelves of boxes, labelled in green -->
  <rect x="180" y="110" width="330" height="320" fill="#4a3a26"/>
  ${[0, 1, 2].map(row => `<rect x="180" y="${206 + row * 108}" width="330" height="8" fill="#2a1e10"/>
    ${[0, 1, 2, 3].map(c => `<rect x="${192 + c * 80}" y="${130 + row * 108}" width="70" height="76" fill="${['#c8a878', '#b89868', '#d0b488'][(row + c) % 3]}" stroke="#7a5a34"/>
      <rect x="${200 + c * 80}" y="${150 + row * 108}" width="54" height="18" fill="#f6f0dc"/>
      <path d="M${205 + c * 80} ${160 + row * 108} h${30 + ((row * 4 + c) % 3) * 6}" stroke="${INK}" stroke-width="2.5"/>`).join('')}`).join('')}
  <!-- the pendulum, hanging still through the ceiling -->
  <rect x="592" y="0" width="6" height="330" fill="#8a7a5a"/>
  <circle cx="595" cy="350" r="32" fill="url(#tBrass)" stroke="#6a5020" stroke-width="2"/>
  <!-- weights, run all the way down -->
  <rect x="640" y="0" width="2" height="420" fill="#3a3a3a"/><rect x="626" y="420" width="30" height="50" fill="#3a3a3e"/>
  <!-- stairs up -->
  <path d="M800 470 L690 470 L690 440 L720 440 L720 410 L750 410 L750 380 L780 380 L780 350 L800 350 Z" fill="#7a5a34" stroke="#3a2a14" stroke-width="2"/>
  <rect x="690" y="0" width="110" height="60" fill="#2a2420"/>
  <!-- a desk with ink -->
  <rect x="300" y="440" width="160" height="12" fill="#5a3820"/><rect x="310" y="452" width="10" height="60" fill="#3a2210"/><rect x="440" y="452" width="10" height="60" fill="#3a2210"/>
  <rect x="330" y="418" width="22" height="22" rx="3" fill="${INK}"/><rect x="334" y="412" width="14" height="8" fill="#2a2a2a"/>
  <path d="M370 436 l50 -10" stroke="#2a2a2a" stroke-width="3"/>
  ${paper(380, 424, 60, 16, { tint: '#f6f0dc', rot: -3, shadow: false })}
  ${finish()}`;

function wrenFigure(g) {
  const looks = allGiven(g);
  return `
  <rect x="96" y="420" width="160" height="60" fill="#8a6a44" stroke="#5a3e20" stroke-width="2"/>
  <path d="M150 420 v-90 q0 -16 16 -16 h36 q16 0 16 16 v90 Z" fill="#3e6a4a"/>
  <path d="M206 410 h56 v14 h-56 Z" fill="#2a3040"/><path d="M250 410 v60 h16 v-60 Z" fill="#2a3040"/>
  <rect x="254" y="466" width="22" height="10" rx="3" fill="#2a1a10"/>
  <circle cx="184" cy="292" r="24" fill="#e8c4a0"/>
  <path d="M160 292 q0 -30 24 -30 q26 0 26 28 q-6 -12 -20 -14 q-16 -2 -30 16 Z" fill="#3a2a1a"/>
  ${looks ? '<circle cx="194" cy="292" r="2.2" fill="#2a1a10"/><path d="M190 302 q5 3 10 0" stroke="#8a4a3a" stroke-width="1.6" fill="none"/>'
    : '<circle cx="168" cy="292" r="2.2" fill="#2a1a10"/>'}
  <!-- the ledger on Wren's knees -->
  <rect x="196" y="392" width="70" height="20" fill="#2a4a3a" transform="rotate(-8 230 402)"/>
  <rect x="198" y="388" width="66" height="8" fill="#f4ecd8" transform="rotate(-8 230 402)"/>`;
}

const clockRoom = g => {
  const t = towerTime(g);
  const wound = g.flag('wound');
  let nums = '';
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    nums += `<text x="${Math.cos(a) * 140}" y="${Math.sin(a) * 140 + 12}" font-size="34" text-anchor="middle" ${serif} fill="#5a4a30" opacity=".55">${['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][i % 12]}</text>`;
  }
  return `${DEFS}
  <rect width="800" height="600" fill="#3a3228"/>
  <path d="M0 0 H800 V60 Q400 20 0 60 Z" fill="#2a2420"/>
  <rect y="480" width="800" height="120" fill="#4a3a28"/>
  ${Array.from({ length: 8 }, (_, i) => `<path d="M0 ${492 + i * 14} H800" stroke="#3a2a1a" stroke-width="2"/>`).join('')}
  <!-- the back of the great clock face, with daylight through it -->
  <circle cx="480" cy="236" r="186" fill="#2a2420"/>
  <circle cx="480" cy="236" r="176" fill="#f6e4b0"/>
  <circle cx="480" cy="236" r="176" fill="url(#tBeam)"/>
  <g transform="translate(480,236) scale(-1,1)">${nums}</g>
  <g transform="translate(960,0) scale(-1,1)">${hands(480, 236, 170, t, '#2a2016', 2.6)}</g>
  <!-- the tower window, looking down over the town -->
  <path d="M40 300 V150 q60 -70 120 0 V300 Z" fill="url(#tSky)" stroke="#2a2420" stroke-width="8"/>
  <path d="M44 300 Q90 250 156 270 V300 Z" fill="#a8b88a"/>
  <g fill="#c8a882"><rect x="60" y="268" width="16" height="14"/><rect x="84" y="262" width="20" height="18"/><rect x="118" y="270" width="14" height="12"/></g>
  <circle cx="92" cy="254" r="5" fill="#f6efdc" stroke="#2a2a2e" stroke-width="1.5"/>
  <rect x="34" y="300" width="132" height="10" fill="#6a5a44"/>
  <!-- mechanism -->
  <rect x="580" y="400" width="200" height="90" fill="#2a2a2e"/>
  ${[[620, 420, 26], [668, 432, 18], [716, 418, 30], [756, 446, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#tBrass)" stroke="#6a5020" stroke-width="2"/>
    ${Array.from({ length: 10 }, (_, i) => `<rect x="${x - 3}" y="${y - r - 4}" width="6" height="7" fill="#c49a44" transform="rotate(${i * 36} ${x} ${y})"/>`).join('')}
    <circle cx="${x}" cy="${y}" r="${r / 4}" fill="#3a3a3a"/>`).join('')}
  <rect x="690" y="456" width="18" height="18" fill="#1a1a1a" stroke="#c49a44" stroke-width="2"/>
  ${wound ? `<path d="M699 465 l40 -30 h18" stroke="#8a8a8a" stroke-width="6" fill="none" stroke-linecap="round"/>` : ''}
  <text x="680" y="510" font-size="11" text-anchor="middle" ${mono} fill="#c8b890">${wound ? 'WOUND' : 'UNWOUND'}</text>
  ${wrenFigure(g)}
  ${finish()}`;
};

const ledgerArt = g => `${tableTop(62)}
  <rect x="80" y="60" width="640" height="470" rx="6" fill="#2a4a3a"/>
  ${paper(96, 72, 300, 446, { tint: '#f6f0dc', shadow: false })}${paper(404, 72, 300, 446, { tint: '#f6f0dc', shadow: false })}
  <rect x="394" y="72" width="12" height="446" fill="#d8ccb0"/>
  <text x="246" y="124" font-size="24" text-anchor="middle" ${hand} fill="${INK}">THINGS TO FORGET</text>
  <path d="M130 136 H362" stroke="${INK}" stroke-width="1.5"/>
  ${KEEPSAKES.map((k, i) => {
    const back = g.flag(`gave:${k.item}`);
    const y = 182 + i * 52;
    return `<text x="130" y="${y}" font-size="21" ${hand} fill="${INK}" opacity="${back ? 1 : 0.75}">${i + 1}. ${k.line}</text>
      ${back ? `<text x="108" y="${y}" font-size="20" text-anchor="middle" ${hand} fill="#2a3a7a">✓</text>`
        : `<path d="M126 ${y - 7} H${140 + k.line.length * 10}" stroke="${INK}" stroke-width="4"/>`}`;
  }).join('')}
  <g font-size="17" ${hand} fill="${INK}">
    ${allGiven(g) ? `<text x="440" y="170">Everything's back.</text><text x="440" y="200">I don't need this</text><text x="440" y="226">book any more.</text>`
      : `<text x="440" y="170">If I take your name</text><text x="440" y="196">out of everything,</text><text x="440" y="222">I can stop waiting.</text>`}
  </g>
  ${finish()}`;

const windowArt = g => {
  const t = stationTime(g);
  return `${DEFS}
  <rect width="800" height="600" fill="url(#tSky)"/>
  <path d="M0 330 Q200 280 420 300 Q620 320 800 280 V600 H0 Z" fill="#a8b88a"/>
  <path d="M520 600 Q600 520 800 500 V600 Z" fill="#7ab0c8"/>
  <g fill="#c8a882">${[[60, 360], [120, 340], [210, 380], [300, 350], [380, 400], [460, 370]].map(([x, y]) => `<rect x="${x}" y="${y}" width="50" height="40"/><path d="M${x - 4} ${y} l29 -20 l29 20 Z" fill="#9a6a4a"/>`).join('')}</g>
  <path d="M40 520 Q260 420 520 470" stroke="#e8dcc0" stroke-width="10" fill="none"/>
  <!-- the station, with its clock -->
  <rect x="520" y="380" width="240" height="90" fill="#e8dcc0"/><rect x="510" y="370" width="260" height="14" fill="#3e5a4a"/>
  <rect x="610" y="300" width="60" height="80" fill="#e8dcc0"/><path d="M604 300 l36 -24 l36 24 Z" fill="#3e5a4a"/>
  ${dial(640, 334, 24, t)}
  <text x="640" y="430" font-size="13" text-anchor="middle" ${serif} fill="#2e4a3a">LITTLE WENDING</text>
  <path d="M500 480 H800 M500 490 H800" stroke="#5a5a5a" stroke-width="3"/>
  <!-- window frame -->
  <path d="M0 0 H800 V600 H0 Z M80 560 V200 q320 -260 640 0 V560 Z" fill="#2a2420" fill-rule="evenodd"/>
  ${finish()}`;
};

const endArt = g => {
  const t = stationTime(g);
  return `${DEFS}
  <rect width="800" height="600" fill="url(#tSky)"/>
  <rect width="800" height="600" fill="#ffb060" opacity=".18"/>
  <path d="M0 420 Q200 360 420 390 Q620 410 800 360 V600 H0 Z" fill="#9ab07a"/>
  <path d="M480 600 Q620 500 800 480 V600 Z" fill="#7ab0c8"/>
  <!-- the tower -->
  <rect x="300" y="120" width="200" height="480" fill="#8a6a54"/>
  <path d="M286 120 L400 20 L514 120 Z" fill="#5a4a3a"/>
  ${dial(400, 240, 70, t, { numerals: true })}
  <!-- a robin and a wren on the ledge -->
  <rect x="300" y="350" width="200" height="10" fill="#6a5040"/>
  <g transform="translate(372,338)"><ellipse rx="12" ry="10" fill="#7a5a3a"/><ellipse cx="4" cy="2" rx="6" ry="6" fill="#d8642a"/><circle cx="8" cy="-8" r="6" fill="#7a5a3a"/><path d="M13 -8 l6 1 l-6 2 Z" fill="#2a2a2a"/></g>
  <g transform="translate(428,341)"><ellipse rx="9" ry="7" fill="#8a6a44"/><circle cx="7" cy="-6" r="5" fill="#8a6a44"/><path d="M-7 -3 l-4 -12 l5 2 Z" fill="#7a5a34"/><path d="M11 -6 l6 1 l-6 2 Z" fill="#2a2a2a"/></g>
  <!-- the two of you on Tower Steps -->
  <path d="M500 600 L560 520 L800 520 V600 Z" fill="#b8a890"/>
  <g transform="translate(610,470)"><circle r="14" fill="#e8c4a0"/><path d="M-14 0 q0 -18 14 -18 q14 0 14 18 q-4 -10 -14 -10 q-10 0 -14 10 Z" fill="#6a4a2a"/><rect x="-16" y="14" width="32" height="44" rx="6" fill="#8a4a3a"/></g>
  <g transform="translate(660,476)"><circle r="12" fill="#e8c4a0"/><path d="M-12 0 q0 -16 12 -16 q14 0 13 16 q-4 -9 -12 -9 q-10 0 -13 9 Z" fill="#3a2a1a"/><rect x="-14" y="12" width="28" height="40" rx="6" fill="#3e6a4a"/></g>
  ${finish()}`;
};

// ---------------------------------------------------------------- export

const giveTo = k => g => {
  g.take(k.item);
  g.set(`gave:${k.item}`);
  g.note(`r6-${k.item}`, `Gave Wren <b>${k.line.replace(/\.$/, '').toLowerCase()}</b>.`);
  if (!allGiven(g)) return g.say(k.reply, 12000);
  g.give('crank');
  g.say(`${k.reply} Wren closes the ledger, and holds out a heavy iron crank. "You asked me to wind it till you came back. You're back. You do it."`, 16000);
};
const keepsakeUses = Object.fromEntries(KEEPSAKES.map(k => [k.item, giveTo(k)]));

const WREN_IDLE = [
  '"I didn\'t do it to hurt you," Wren says to the window. "Every time someone said your name, I had to say: not yet. So I made them stop saying it."',
  '"It\'s a small town. Take a name out of everything and people stop saying it. Then they stop remembering." Wren taps the ledger. "It\'s all in there."',
  '"You kept things, didn\'t you. On the way here." Wren still won\'t look at you. "Show me."',
];

export default {
  id: 'r6',
  name: 'Clock tower',
  setup,
  hints: [
    { when: g => !g.flag('r6Up'), text: 'Wren is up the stairs.' },
    { when: g => !allGiven(g), text: g => g.diff({
      easy: `Give Wren your keepsakes: the map, the postcard, Wren's drawing, the front page, the rubbing and your note. ${given(g)} of 6 so far. The ledger shows which are left.`,
      medium: `Wren's ledger lists six things to forget. You have carried every one of them here. ${given(g)} of 6.`,
      hard: 'Show Wren what you kept.' }) },
    { when: g => !g.flag('wound'), text: 'Use the crank on the clock mechanism.' },
    { when: g => !g.flag('clockGoing'), text: g => g.diff({
      easy: `Set the tower clock to the right time. The station clock, seen from the window, says ${sayTime(stationTime(g))}.`,
      medium: 'Set the tower clock to the right time. Something you can see from the window keeps good time.',
      hard: 'Set the tower clock to the right time.' }) },
    { text: 'Go home.' },
  ],

  scenes: {
    'r6-base': {
      room: 'r6',
      art: base,
      enter: g => {
        if (g.flag('r6Seen')) return;
        g.set('r6Seen');
        g.say('The tower door is unlocked. Inside it is cold, and smells of ink. Boxes on every shelf, labelled in green. Somewhere above you, someone turns a page.', 8000);
      },
      hotspots: [
        { id: 'door', label: 'Back to the map', rect: [30, 150, 100, 320], sparkle: g => g.flag('clockGoing'), click: g => openMap(g) },
        { id: 'boxes', label: 'Boxes', rect: [180, 110, 330, 320],
          click: g => {
            g.note('r6-boxes', 'The tower archive: boxes labelled in <b>green ink</b>. <i>ROBIN: post. ROBIN: photographs. ROBIN: Gazette. ROBIN: registers.</i>');
            g.say('ROBIN: POST. ROBIN: PHOTOGRAPHS. ROBIN: GAZETTE. ROBIN: REGISTERS. Twelve boxes, all of them you, all of them neatly labelled in green.', 8000);
          } },
        { id: 'pendulum', label: 'Pendulum', rect: [560, 0, 90, 390],
          say: g => g.flag('clockGoing') ? 'The pendulum swings, slow and certain.' : 'The great pendulum hangs dead still. The weights have run all the way to the floor.' },
        { id: 'desk', label: 'Desk', rect: [300, 404, 160, 108],
          say: 'A bottle of green ink and a dip pen. The handwriting on every label in town started here.' },
        { id: 'stairs', label: 'Stairs up', rect: [680, 0, 120, 470], sparkle: g => !g.flag('r6Up'), go: 'r6-clock' },
      ],
    },

    'r6-clock': {
      room: 'r6', art: clockRoom, nav: { back: 'r6-base' },
      enter: g => {
        if (g.flag('r6Up')) return;
        g.set('r6Up');
        g.note('r6-wren', 'Found <b>Wren</b> in the clock room, with a green pen and a ledger.');
        g.say('The clock room. Light comes through the back of the great clock face, its hands at twenty past four. By the window, on a crate, with a ledger and a green pen: Wren. Wren doesn\'t look round. "You\'re late," Wren says. "Twelve years."', 12000);
      },
      hotspots: [
        { id: 'window', label: 'Window', rect: [36, 120, 132, 190], go: 'r6-window' },
        { id: 'face', label: 'Clock face', rect: [300, 56, 360, 360],
          sparkle: g => g.flag('wound') && !g.flag('clockGoing'),
          click: g => {
            if (g.flag('clockGoing')) return g.say('The hands move. You can hear it: tick, and tock, and the whole tower breathing.');
            if (!g.flag('wound')) return g.say('The back of the great clock face, glowing with daylight. The hands stand at twenty past four. Nothing will move them until the mechanism is wound.');
            g.puzzle('r6-time');
          } },
        { id: 'mechanism', label: g => g.flag('wound') ? 'Mechanism (wound)' : 'Clock mechanism', rect: [576, 380, 210, 116],
          sparkle: g => g.has('crank'),
          click: g => g.say(g.flag('wound') ? 'Wound tight, and ready.'
            : g.has('crank') ? 'A square winding post. The crank would fit it.' : 'Brass wheels and a square winding post. You would need a crank.'),
          use: { crank: g => {
            g.take('crank');
            g.set('wound');
            g.say('The crank is stiff, then less stiff. Below you the weights climb, foot by foot, out of twelve years of dust. Now the hands can be set.', 8000);
          } } },
        { id: 'wren', label: 'Wren', rect: [96, 262, 180, 216],
          sparkle: g => !allGiven(g),
          click: g => {
            if (g.flag('clockGoing')) return g.say('"Come on," Wren says. "Let\'s go home."');
            if (allGiven(g)) return g.say(g.flag('wound') ? '"Now set it right," Wren says. "The station clock is never wrong. Mum used to say you could set your life by it."' : '"Go on," Wren says. "Wind it."');
            const n = g.get('wrenTalk') ?? 0;
            g.set('wrenTalk', n + 1);
            g.say(WREN_IDLE[n % WREN_IDLE.length], 9000);
          },
          use: keepsakeUses },
        { id: 'ledger', label: 'Ledger', rect: [190, 380, 84, 40], go: 'r6-ledger', use: keepsakeUses },
      ],
    },

    'r6-ledger': {
      room: 'r6', art: ledgerArt, nav: { back: 'r6-clock' },
      enter: g => g.note('r6-ledger', 'Wren\'s ledger, in <b>green ink</b>: <i>THINGS TO FORGET</i>. Six lines, crossed out: our town, the promise, the way home, the night of the storm, why Mum chose our names, twenty past four.'),
      hotspots: [
        { id: 'page', label: 'Things to forget', rect: [96, 72, 608, 446], use: keepsakeUses,
          say: g => allGiven(g) ? 'Every line is back.' : `${given(g)} of the six lines have come back. You have carried the rest of them here.` },
      ],
    },

    'r6-window': {
      room: 'r6', art: windowArt, nav: { back: 'r6-clock' },
      hotspots: [
        { id: 'station', label: 'Station clock', rect: [600, 290, 80, 90],
          click: g => {
            const t = stationTime(g);
            g.note('r6-station', g.difficulty === 'easy' ? `From the tower window: the station clock says <b>${sayTime(t)}</b>.` : 'From the tower window you can see the station clock.');
            g.say(g.difficulty === 'easy' ? `The station clock. It says ${sayTime(t)}. It was always right.` : 'The station clock, far below. It was always right.', 6000);
          } },
        { id: 'town', label: 'Little Wending', rect: [80, 300, 440, 260],
          say: 'The whole town, laid out like your map: the post office, the café, the Gazette, the town hall, Lantern Row.' },
      ],
    },

    'r6-end': {
      room: 'r6', art: endArt,
      enter: g => g.say('The tower clock strikes. All over Little Wending, people look up from what they are doing, and remember a name.', 9000),
      hotspots: [
        { id: 'home', label: 'Go home', rect: [520, 400, 280, 200], sparkle: true,
          click: g => g.win('Twelve years late, you kept your promise. The tower clock is running again, and all over Little Wending people are saying a name they had somehow forgotten: <b>Robin Ashby</b>. On the welcome board, someone has changed the 2 back to a 3. Wren walks down Tower Steps beside you. Birds always come home.') },
      ],
    },
  },

  puzzles: {
    'r6-time': {
      type: 'clock',
      prompt: 'The tower clock. Set it to the right time.',
      start: { h: 4, m: 20 },
      handleText: 'Start the clock',
      config: g => ({
        check: (h, m) => {
          const t = stationTime(g);
          if (h % 12 === t.h % 12 && m === t.m) return true;
          if (h === 4 && m === 20) return '"Not that time," Wren says quietly. "Never that time again."';
          return `${h}:${String(m).padStart(2, '0')}. "That's not right," Wren says. "Look at the station."`;
        },
      }),
      solve: g => {
        g.set('r6Set', stationTime(g));
        g.set('clockGoing');
        g.effect('shake');
        g.go('r6-end');
      },
    },
  },
};

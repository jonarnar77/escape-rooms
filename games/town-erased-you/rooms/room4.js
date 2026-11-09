// ROOM 4: the town hall. Keepsake: the rubbing (your name, and why Mum chose it).
//
//   1. The strongroom has a time lock that follows the hall's master clock. The clock is stopped
//      at twenty past four: after hours. The sign on the counter gives the opening hours.
//      Set the master clock to any time inside them (clock, with a range check).
//   2. In the strongroom, a reading slip (green ink): "Withdrawn: Births 1995, p. 23. Replaced. W.A."
//      Open the 1995 register: page 23 is a neat replacement, without you.
//   3. Rub the pencil from the counter over the blank page beneath: the pressed-in writing of the
//      original page appears. ASHBY, Robin. Take the page -> Lantern Row redraws.
//
// Every clue is in this room. Difficulty: HARD has different, fiddlier opening hours.

import { DEFS, finish, paper, tableTop, hand, serif, mono, INK, rng } from '../art/common.js';
import { restoreStreet, openMap } from './town.js';

// ---------------------------------------------------------------- opening hours

const HOURS = {
  normal: { text: ['Open 9 till 4', 'Closed 1 till 2 for lunch'], open: [[9 * 60, 13 * 60], [14 * 60, 16 * 60]] },
  hard: { text: ['Open 10 till half past 3', 'Closed half past 12 till half past 1'], open: [[600, 750], [810, 930]] },
};
const hoursOf = g => g.difficulty === 'hard' ? HOURS.hard : HOURS.normal;
/** The clock face has no a.m./p.m.: 9 to 12 are morning, 1 to 8 are afternoon. */
const minutesOf = (h, m) => (h < 9 ? h + 12 : h) * 60 + m;

// ---------------------------------------------------------------- the register pages

const REPLACEMENT = [
  ['2 Mar', 'PENHALE, Thomas'],
  ['5 Mar', 'OKAFOR, Grace'],
  ['9 Mar', 'TREWIN, Ellen'],
  ['17 Mar', 'HART, Samuel'],
  ['26 Mar', 'NANCE, Lily'],
];
const ORIGINAL = [
  ['2 Mar', 'PENHALE, Thomas'],
  ['3 Mar', 'ASHBY, Robin'],
  ['5 Mar', 'OKAFOR, Grace'],
  ['9 Mar', 'TREWIN, Ellen'],
  ['17 Mar', 'HART, Samuel'],
  ['26 Mar', 'NANCE, Lily'],
];

function registerArt(g) {
  const rubbed = g.flag('rubbed'), taken = g.flag('took:rubbing');
  const rows = (list, x, color, font, size = 15) => list.map(([d, n], i) => `
    <text x="${x}" y="${190 + i * 40}" font-size="${size - 2}" ${font} fill="${color}">${d}</text>
    <text x="${x + 70}" y="${190 + i * 40}" font-size="${size}" ${font} fill="${color}">${n}</text>`).join('');
  const r = rng(21);
  let graphite = '';
  if (rubbed && !taken) for (let i = 0; i < 70; i++) {
    const y = 120 + i * 5.6;
    graphite += `<path d="M${420 + r() * 8} ${y} L${730 - r() * 8} ${y + 3 + r() * 4}" stroke="#4a4a4e" stroke-width="${4 + r() * 3}" opacity="${0.35 + r() * 0.2}"/>`;
  }
  return `${tableTop(18)}
  <rect x="50" y="70" width="700" height="470" rx="8" fill="#5a2a1a"/>
  <rect x="64" y="80" width="330" height="450" fill="#f4ecd4"/>
  <rect x="406" y="80" width="330" height="450" fill="${taken ? '#c8b890' : '#f4ecd4'}"/>
  <rect x="394" y="80" width="12" height="450" fill="#c8b890"/>
  <!-- the stub of the cut-out page -->
  <path d="M392 80 l6 0 l-2 450 l-6 0 Z" fill="#e8dcc0"/>
  <text x="229" y="114" font-size="16" text-anchor="middle" ${serif} fill="#2a1a0c">BIRTHS · MARCH 1995</text>
  <text x="380" y="520" font-size="12" text-anchor="end" ${serif} fill="#5a4a3a">p. 23</text>
  <path d="M84 132 h290 M84 150 h290" stroke="#8a7a5a"/>
  <text x="88" y="146" font-size="11" ${mono} fill="#5a4a3a">DATE</text><text x="158" y="146" font-size="11" ${mono} fill="#5a4a3a">NAME</text>
  ${rows(REPLACEMENT, 88, INK, hand)}
  ${taken ? `<text x="571" y="310" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#5a4a3a">(the page you took)</text>` : `
    <text x="571" y="114" font-size="16" text-anchor="middle" ${serif} fill="#2a1a0c">NOTES</text>
    <text x="722" y="520" font-size="12" text-anchor="end" ${serif} fill="#5a4a3a">p. 24</text>
    ${graphite}
    <g opacity="${rubbed ? 1 : 0.07}">
      ${rows(ORIGINAL, 430, rubbed ? '#f4ecd4' : '#5a4a3a', hand)}
      <text x="430" y="452" font-size="13" ${hand} fill="${rubbed ? '#f4ecd4' : '#5a4a3a'}">Remarks, 3 Mar: named for the robin</text>
      <text x="430" y="474" font-size="13" ${hand} fill="${rubbed ? '#f4ecd4' : '#5a4a3a'}">at the window. (Mother, M. Ashby)</text>
    </g>`}
  ${finish()}`;
}

// ---------------------------------------------------------------- main scene

function masterClock(g) {
  const t = g.get('r4Time') ?? { h: 4, m: 20 };
  const cx = 400, cy = 116, r = 52;
  let ticks = '';
  for (let i = 0; i < 12; i++) ticks += `<line y1="${-r + 4}" y2="${-r + 12}" transform="rotate(${i * 30})" stroke="#2a1c10" stroke-width="3"/>`;
  return `
    <path d="M${cx - 76} ${cy + 66} V${cy - 40} q76 -60 152 0 V${cy + 66} Z" fill="#5a3820" stroke="#3a2210" stroke-width="3"/>
    <g transform="translate(${cx},${cy})">
      <circle r="${r + 8}" fill="url(#tBrass)"/><circle r="${r}" fill="#f6efdc"/>${ticks}
      <line y2="${-r * 0.5}" transform="rotate(${(t.h % 12) * 30 + t.m / 2})" stroke="#1a1208" stroke-width="5" stroke-linecap="round"/>
      <line y2="${-r * 0.8}" transform="rotate(${t.m * 6})" stroke="#1a1208" stroke-width="3" stroke-linecap="round"/>
      <circle r="4" fill="#1a1208"/>
    </g>
    <rect x="${cx - 52}" y="${cy + 70}" width="104" height="18" fill="url(#tBrass)"/>
    <text x="${cx}" y="${cy + 83}" font-size="11" text-anchor="middle" ${serif} fill="#2a1a0c">MASTER CLOCK</text>`;
}

function vaultDoor(g) {
  const open = g.flag('timeOk');
  return open ? `
    <rect x="610" y="150" width="160" height="300" rx="6" fill="#1a1a1e"/>
    <rect x="626" y="166" width="128" height="268" fill="#3a3020"/>
    ${[0, 1, 2].map(i => `<rect x="634" y="${190 + i * 70}" width="112" height="6" fill="#5a4630"/>`).join('')}
    <ellipse cx="610" cy="300" rx="22" ry="150" fill="#6a6e72" stroke="#3a3e42" stroke-width="4"/>` : `
    <rect x="610" y="150" width="160" height="300" rx="6" fill="#5a5e62" stroke="#3a3e42" stroke-width="4"/>
    <circle cx="690" cy="300" r="62" fill="#7a7e82" stroke="#3a3e42" stroke-width="4"/>
    ${[0, 60, 120].map(a => `<line x1="${690 - 50 * Math.cos(a * Math.PI / 180)}" y1="${300 - 50 * Math.sin(a * Math.PI / 180)}" x2="${690 + 50 * Math.cos(a * Math.PI / 180)}" y2="${300 + 50 * Math.sin(a * Math.PI / 180)}" stroke="#2a2e32" stroke-width="7" stroke-linecap="round"/>`).join('')}
    <circle cx="690" cy="300" r="12" fill="#3a3e42"/>
    <rect x="652" y="178" width="76" height="34" rx="3" fill="#2a2e32"/>
    <text x="690" y="192" font-size="9" text-anchor="middle" ${mono} fill="#c8c0b0">TIME LOCK</text>
    <text x="690" y="206" font-size="10" text-anchor="middle" ${mono} fill="#e86a4a">CLOSED</text>`;
}

const hall = g => `${DEFS}
  <rect width="800" height="600" fill="#d8d2c2"/>
  <rect width="800" height="30" fill="#8a8272"/>
  ${[110, 300, 500, 590].map(x => `<rect x="${x}" y="30" width="16" height="430" fill="#c8c0ae"/>`).join('')}
  <rect y="452" width="800" height="148" fill="#2a2a2e"/>
  ${Array.from({ length: 8 }, (_, i) => Array.from({ length: 3 }, (_, j) => (i + j) % 2 ? '' : `<rect x="${i * 100}" y="${452 + j * 50}" width="100" height="50" fill="#e8e4d8"/>`).join('')).join('')}

  <!-- front door -->
  <path d="M14 470 V170 q46 -60 92 0 V470 Z" fill="#4a2e18" stroke="#2a1a0c" stroke-width="3"/>
  <path d="M24 470 V178 q36 -46 72 0 V470" fill="none" stroke="#2a1a0c" stroke-width="2"/>
  <circle cx="90" cy="330" r="4" fill="url(#tBrass)"/>

  <!-- notice board -->
  <rect x="136" y="110" width="150" height="130" fill="#8a6a44" stroke="#4a2e18" stroke-width="4"/>
  ${paper(146, 120, 60, 50, { tint: '#f4ecd8', rot: -3 })}${paper(214, 122, 62, 74, { tint: '#f6f0dc', rot: 2 })}${paper(150, 178, 56, 52, { tint: '#e8e4f0', rot: 4 })}
  <path d="M220 136 h48 M220 146 h40 M220 156 h46 M220 166 h30" stroke="${INK}" stroke-width="2" transform="rotate(2 245 160)"/>
  <path d="M154 134 h44 M154 144 h36 M156 192 h40 M156 202 h30" stroke="#5a4a3a" stroke-width="2"/>

  ${masterClock(g)}

  <!-- the official town plan -->
  <rect x="330" y="232" width="144" height="94" fill="#4a2e18"/><rect x="336" y="238" width="132" height="82" fill="#e8e0c8"/>
  <path d="M346 308 Q380 280 400 290 T440 270 M400 290 Q410 260 440 250" stroke="#5a5a7a" stroke-width="3" fill="none"/>
  <path d="M400 290 Q380 266 356 252" stroke="${INK}" stroke-width="6" fill="none" opacity=".8"/>

  <!-- records counter -->
  <rect x="236" y="352" width="324" height="14" fill="#5a3820"/>
  <rect x="244" y="366" width="308" height="104" fill="url(#tWood)"/>
  <rect x="340" y="388" width="116" height="44" fill="url(#tBrass)"/>
  <text x="398" y="406" font-size="11" text-anchor="middle" ${serif} fill="#2a1a0c">RECORDS OFFICE</text>
  ${hoursOf(g).text.map((t, i) => `<text x="398" y="${420 + i * 10}" font-size="${i ? 7 : 9}" text-anchor="middle" ${serif} fill="#2a1a0c">${t}</text>`).join('')}
  <!-- pencil pot, forms, bell -->
  <rect x="270" y="328" width="22" height="26" fill="#3e5a4a"/>
  ${g.flag('took:pencil') ? '' : '<path d="M276 330 l-4 -24" stroke="#e8b83a" stroke-width="4"/><path d="M272 306 l-1 -5" stroke="#2a2a2a" stroke-width="2"/>'}
  <path d="M284 330 l6 -20" stroke="#a33a2a" stroke-width="3"/>
  ${paper(470, 334, 60, 18, { tint: '#f4ecd8', rot: -4, shadow: false })}
  <ellipse cx="320" cy="352" rx="13" ry="3" fill="#3a2a10"/><path d="M308 350 a12 12 0 0 1 24 0 Z" fill="url(#tBrass)"/>

  ${vaultDoor(g)}
  <text x="690" y="138" font-size="12" text-anchor="middle" ${serif} letter-spacing="2" fill="#3a3a3e">STRONGROOM</text>
  ${finish()}`;

// ---------------------------------------------------------------- strongroom

const YEARS = Array.from({ length: 10 }, (_, i) => 1990 + i);
const strongroom = g => `${DEFS}
  <rect width="800" height="600" fill="#3a3020"/>
  <rect y="460" width="800" height="140" fill="#2a2216"/>
  <circle cx="400" cy="40" r="240" fill="#ffe8b0" opacity=".08"/>
  <path d="M400 0 v30" stroke="#1a1a1a" stroke-width="2"/><circle cx="400" cy="38" r="9" fill="#ffe8b0"/>
  <!-- shelves -->
  <rect x="90" y="110" width="620" height="230" fill="#4a3a26"/>
  ${[0, 1].map(i => `<rect x="90" y="${214 + i * 120}" width="620" height="10" fill="#2a1e10"/>`).join('')}
  <text x="400" y="100" font-size="14" text-anchor="middle" ${serif} letter-spacing="3" fill="#d8c8a0">REGISTER OF BIRTHS</text>
  ${YEARS.map((y, i) => `<rect x="${108 + i * 60}" y="${124 + (y === 1995 ? -6 : 0)}" width="50" height="${90 + (y === 1995 ? 6 : 0)}" fill="${['#5a2a1a', '#3a4a2a', '#2a3a5a'][i % 3]}" stroke="#1a120a"/>
    <rect x="${114 + i * 60}" y="${150 + (y === 1995 ? -6 : 0)}" width="38" height="26" fill="#e8dcc0"/>
    <text x="${133 + i * 60}" y="${161 + (y === 1995 ? -6 : 0)}" font-size="8" text-anchor="middle" ${serif} fill="#2a1a0c">BIRTHS</text>
    <text x="${133 + i * 60}" y="${172 + (y === 1995 ? -6 : 0)}" font-size="10" text-anchor="middle" ${serif} font-weight="bold" fill="#2a1a0c">${y}</text>`).join('')}
  ${Array.from({ length: 12 }, (_, i) => `<rect x="${108 + i * 50}" y="${236}" width="42" height="98" fill="${['#4a3a2a', '#3a2e22'][i % 2]}" stroke="#1a120a"/>`).join('')}
  <text x="400" y="352" font-size="11" text-anchor="middle" ${serif} fill="#a89878">MARRIAGES · DEATHS</text>
  <!-- reading desk and slip -->
  <rect x="250" y="400" width="300" height="14" fill="#5a3820"/><rect x="262" y="414" width="12" height="60" fill="#3a2210"/><rect x="526" y="414" width="12" height="60" fill="#3a2210"/>
  ${paper(360, 378, 84, 24, { tint: '#f6f0dc', rot: -4 })}
  <path d="M370 388 h56 M370 396 h40" stroke="${INK}" stroke-width="2" transform="rotate(-4 402 390)"/>
  ${finish()}`;

const slipArt = () => `${tableTop(19)}
  ${paper(210, 170, 380, 230, { tint: '#f6f0dc', rot: -2 })}
  <g transform="rotate(-2 400 285)">
    <text x="236" y="210" font-size="13" ${mono} fill="#2a2a2a">RECORDS OFFICE · READING SLIP</text>
    <path d="M236 222 h330" stroke="#2a2a2a"/>
    <text x="240" y="264" font-size="24" ${hand} fill="${INK}">Withdrawn: Births 1995,</text>
    <text x="240" y="300" font-size="24" ${hand} fill="${INK}">p. 23. Replaced.</text>
    <text x="470" y="360" font-size="26" ${hand} fill="${INK}">W.A.</text>
  </g>
  ${finish()}`;

const rubbingArt = () => `${tableTop(20)}
  ${paper(170, 60, 460, 460, { tint: '#f4ecd4' })}
  ${(() => { const r = rng(22); let o = ''; for (let i = 0; i < 76; i++) { const y = 80 + i * 5.6; o += `<path d="M${184 + r() * 8} ${y} L${616 - r() * 8} ${y + 3 + r() * 4}" stroke="#4a4a4e" stroke-width="${4 + r() * 3}" opacity="${0.4 + r() * 0.2}"/>`; } return o; })()}
  <g font-size="22" ${hand} fill="#f4ecd4">
    <text x="210" y="150">BIRTHS · MARCH 1995</text>
    <text x="210" y="210" font-size="20">3 Mar</text><text x="300" y="210" font-size="30">ASHBY, Robin</text>
    <text x="210" y="260" font-size="17">Mother: Margaret Ashby, Lantern Row</text>
    <text x="210" y="360" font-size="19">Remarks: named for the robin</text>
    <text x="210" y="392" font-size="19">at the window. (Mother)</text>
  </g>
  ${finish()}`;

// ---------------------------------------------------------------- export

const tryVault = g => {
  if (g.flag('timeOk')) return g.go('r4-strong');
  g.say(g.diff({
    easy: 'TIME LOCK: CLOSED. A plate on the door: "Opens in office hours only. Set by the master clock." The master clock says twenty past four: after hours.',
    medium: 'TIME LOCK: CLOSED. A plate on the door: "Opens in office hours only." The hall clock says twenty past four.',
    hard: 'TIME LOCK: CLOSED. "Office hours only."' }), 7000);
  g.set('r4VaultTried');
};

export default {
  id: 'r4',
  name: 'Town hall',
  hints: [
    { when: g => !g.flag('timeOk'), text: g => g.diff({
      easy: 'The strongroom\'s time lock follows the master clock, which is stopped after hours. Set the master clock to a time when the records office is open (the sign is on the counter).',
      medium: 'The strongroom only opens in office hours, and it trusts the master clock.',
      hard: 'The strongroom only opens in office hours.' }) },
    { when: g => !g.flag('r4Register'), text: g => g.diff({
      easy: 'Read the slip on the reading desk in the strongroom, then open that year\'s register.',
      medium: 'Someone left a reading slip in the strongroom.',
      hard: 'Someone has been in the strongroom.' }) },
    { when: g => !g.flag('rubbed'), text: g => g.diff({
      easy: 'Page 23 was cut out and rewritten. The blank page beneath it still holds the dents of the old writing. Use the pencil from the counter on it.',
      medium: 'The old page was cut out, but writing presses through. There is a pencil on the counter.',
      hard: 'Writing presses through.' }) },
    { when: g => !g.flag('took:rubbing'), text: 'Take the page.' },
    { text: 'Back to the map: another street has come back.' },
  ],

  scenes: {
    'r4-hall': {
      room: 'r4',
      art: hall,
      enter: g => {
        if (g.flag('r4Seen')) return;
        g.set('r4Seen');
        g.say('The town hall. Marble, echoes and the smell of floor polish. Everyone who was ever born in Little Wending is written down somewhere in here.', 7000);
      },
      hotspots: [
        { id: 'door', label: 'Back to the map', rect: [14, 110, 92, 360], sparkle: g => g.flag('took:rubbing'), click: g => openMap(g) },
        { id: 'notices', label: 'Notice board', rect: [136, 110, 150, 130],
          click: g => {
            g.note('r4-notice', 'Town hall notice, in <b>green ink</b>: <i>"Records are moving to the clock tower archive. W. Ashby, Town Records."</i>');
            g.say('Bin days, a jumble sale, a lost cat. And, in green ink: "Records are moving to the clock tower archive. W. Ashby, Town Records."', 7000);
          } },
        { id: 'clock', label: 'Master clock', rect: [324, 50, 152, 156], sparkle: g => g.flag('r4VaultTried') && !g.flag('timeOk'),
          click: g => g.flag('timeOk')
            ? g.say('The master clock is running again. Behind the wall, the time lock is satisfied.')
            : g.puzzle('r4-clock') },
        { id: 'plan', label: 'Town plan', rect: [330, 232, 144, 94],
          say: 'The official plan of Little Wending. One street has been painted out, neatly, in green: the one that runs to Lantern Row.' },
        { id: 'sign', label: 'Opening hours', rect: [340, 386, 116, 48],
          click: g => {
            const t = hoursOf(g).text;
            g.note('r4-hours', `Records office hours: <b>${t[0]}</b>. ${t[1]}.`);
            g.say(`RECORDS OFFICE. ${t[0]}. ${t[1]}.`, 5000);
          } },
        { id: 'pencil', label: 'Pencil pot', rect: [262, 300, 38, 56], take: 'pencil', say: 'A soft pencil. 6B, the kind for drawing, not writing.' },
        { id: 'bell', label: 'Bell', rect: [304, 336, 32, 18], say: 'Ding. Footsteps somewhere upstairs. They do not come down.' },
        { id: 'forms', label: 'Forms', rect: [466, 330, 70, 26], say: 'Change of name. Change of address. Notice of death. Nothing for "nobody remembers me".' },
        { id: 'vault', label: g => g.flag('timeOk') ? 'Into the strongroom' : 'Strongroom', rect: [600, 140, 180, 320],
          sparkle: g => g.flag('timeOk') && !g.flag('r4Register'), click: tryVault },
      ],
    },

    'r4-strong': {
      room: 'r4', art: strongroom, nav: { back: 'r4-hall' },
      enter: g => {
        if (g.flag('r4StrongSeen')) return;
        g.set('r4StrongSeen');
        g.say('The strongroom. Every birth, marriage and death in Little Wending, bound in leather.', 6000);
      },
      hotspots: [
        ...YEARS.map((y, i) => ({
          id: `vol-${y}`, label: `Births ${y}`, rect: [108 + i * 60, 118, 50, 96],
          sparkle: g => y === 1995 && g.hasNote('r4-slip') && !g.flag('r4Register'),
          click: g => y === 1995 ? g.go('r4-register') : g.say(`Births, ${y}. Nothing has been touched in here for years: the dust is undisturbed.`),
        })),
        { id: 'others', label: 'Marriages and deaths', rect: [100, 232, 600, 104], say: 'Marriages, deaths. Mum is in one of these now. You are not ready to look.' },
        { id: 'slip', label: 'Reading slip', rect: [350, 372, 104, 40], go: 'r4-slip', sparkle: g => !g.hasNote('r4-slip') },
      ],
    },

    'r4-slip': {
      room: 'r4', art: slipArt, nav: { back: 'r4-strong' },
      enter: g => g.note('r4-slip', 'Reading slip in the strongroom, in <b>green ink</b>: <i>"Withdrawn: Births 1995, p. 23. Replaced. W.A."</i>'),
      hotspots: [],
    },

    'r4-register': {
      room: 'r4', art: registerArt, nav: { back: 'r4-strong' },
      enter: g => {
        if (g.flag('r4Register')) return;
        g.set('r4Register');
        g.say('Births, March 1995, page 23. The writing is green and very neat. Look closely at the binding: the page has been cut out and a new one pasted in. You are not on it.', 8000);
      },
      hotspots: [
        { id: 'p23', label: 'Page 23', rect: [64, 80, 330, 450],
          say: 'Five births in March 1995, in green ink. No Ashby. In the binding, the stub of the page that was cut out.',
          use: { pencil: g => g.say('Page 23 is new: there is nothing pressed into it. The page underneath the old one might remember more.') } },
        { id: 'p24', label: g => g.flag('rubbed') ? 'The rubbing' : 'Page 24: blank', rect: [406, 80, 330, 450],
          when: g => !g.flag('took:rubbing'),
          sparkle: g => g.has('pencil') || g.flag('rubbed'),
          click: g => {
            if (!g.flag('rubbed')) return g.say(g.has('pencil')
              ? 'A blank page for notes. Tilt it to the light and there are faint grooves in it, pressed through from the page that used to sit on top.'
              : 'A blank page for notes. Tilt it to the light and there are faint grooves in it, pressed through from the page that used to sit on top. If only you had something to bring them out.');
            g.give('rubbing');
            g.set('took:rubbing');
            g.note('memory4', 'Memory: <b>Mum named us for birds</b>. A robin and a wren, the two birds that came to the window every winter. "Birds always come home," she said.');
            restoreStreet(g, 4);
            g.set('rubbingReturn', 'r4-register');
            g.go('r4-rubbing');
            g.say('You ease the page out. "Named for the robin at the window." Mum used to tell it at bedtime: a robin and a wren came to the kitchen window every winter, so that is what she called you both. "Birds always come home," she said. Somewhere, a street is coming back.', 12000);
          },
          use: { pencil: g => {
            g.take('pencil');
            g.set('rubbed');
            g.say('You rub the side of the pencil lightly across the blank page. White letters rise out of the grey: the original page 23. Between Thomas Penhale and Grace Okafor: ASHBY, Robin.', 9000);
          } } },
      ],
    },
    'r4-rubbing': { room: 'r4', art: rubbingArt, nav: { back: g => g.get('rubbingReturn') ?? 'r4-register' }, hotspots: [] },
  },

  puzzles: {
    'r4-clock': {
      type: 'clock',
      prompt: 'The master clock. Its glass opens; the hands can be set.',
      start: { h: 4, m: 20 },
      handleText: 'Set the clock',
      config: g => ({
        check: (h, m) => {
          const t = minutesOf(h, m);
          const ok = hoursOf(g).open.some(([a, b]) => t >= a && t < b);
          if (ok) g.set('r4Time', { h, m });
          if (ok) return true;
          const [[, lunch], [back]] = hoursOf(g).open;
          const why = t >= lunch && t < back ? 'that is lunchtime, and the office is shut'
            : 'that is outside office hours';
          return `${h}:${String(m).padStart(2, '0')}. The clock ticks on, but behind the wall nothing moves: ${why}.`;
        },
      }),
      solve: g => {
        g.set('timeOk');
        g.say('The master clock starts to tick. Behind the wall something heavy clunks, and the strongroom door swings open a hand\'s width.', 7000);
      },
    },
  },
};

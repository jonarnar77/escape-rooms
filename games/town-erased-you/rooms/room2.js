// ROOM 2: the Marigold café. Keepsake: Wren's drawing (Saturday mornings).
//
//   1. The staff photo over the counter has a gap. The guest book on the window table
//      holds the original print (your name in its caption crossed out in green ink).
//   2. With the print, the photo close-up gets a Then / Now button. Three things were taken out:
//      you (holding your mug: chipped rim, blue stripe), "ROBIN'S" flapjacks, your name on the rota.
//   3. Three mugs on the rail have had their names scraped off. Pick yours (select).
//   4. Inside it: a map Wren drew "so you don't forget the way home". Press Street redraws.
//
// Every clue is in this room. Difficulty: EASY says what the mug looks like; HARD adds
// a fourth blank mug and leaves you to read the mug off the photo.

import { DEFS, finish, paper, tableTop, wallClock, hand, serif, INK, rng } from '../art/common.js';
import { restoreStreet, openMap } from './town.js';

// ---------------------------------------------------------------- mugs

const MARIGOLD = '#e8a43a';
/** A marigold mug, 40 x 40, drawn at x, y. */
function mug(x, y, { stripe = false, chip = false, name = '', s = 1 } = {}) {
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M30 10 q12 0 12 10 q0 10 -12 10" stroke="${MARIGOLD}" stroke-width="5" fill="none"/>
    <rect x="2" y="4" width="30" height="34" rx="3" fill="${MARIGOLD}" stroke="#8a5a1a" stroke-width="1.5"/>
    ${stripe ? '<rect x="2" y="24" width="30" height="5" fill="#3a6aa8"/>' : ''}
    ${chip ? '<path d="M8 3.2 l4 5 l4 -5 Z" fill="#2a1a0c"/>' : ''}
    ${name ? `<text x="17" y="19" font-size="8" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" fill="#5a2a0a">${name}</text>`
           : '<path d="M8 13 l18 3 M9 17 l16 2" stroke="#c88a2a" stroke-width="1.5"/>'}
  </g>`;
}

// Rail order, left to right. `mine` is the one with a chipped rim and a blue stripe.
const MUGS_BASE = [
  { id: 'dot', name: 'DOT' },
  { id: 'a', stripe: true },
  { id: 'sal', name: 'SAL' },
  { id: 'b', chip: true },
  { id: 'ben', name: 'BEN' },
  { id: 'mine', stripe: true, chip: true },
  { id: 'joe', name: 'JOE' },
];
const mugsOf = g => g.difficulty === 'hard'
  ? [...MUGS_BASE.slice(0, 3), { id: 'c' }, ...MUGS_BASE.slice(3)]
  : MUGS_BASE;

// ---------------------------------------------------------------- the staff photo (560 x 380)

function person(x, { hair, skin = '#e8c4a0', top, apron = true, long = false, bun = false }) {
  return `
    <rect x="${x - 36}" y="176" width="72" height="120" rx="20" fill="${top}"/>
    ${apron ? `<rect x="${x - 24}" y="196" width="48" height="100" fill="#f4ecd8"/>
      <path d="M${x - 24} 196 l-10 -20 M${x + 24} 196 l10 -20" stroke="#f4ecd8" stroke-width="4"/>
      <circle cx="${x}" cy="230" r="7" fill="${MARIGOLD}"/>` : ''}
    <rect x="${x - 8}" y="160" width="16" height="18" fill="${skin}"/>
    <circle cx="${x}" cy="144" r="24" fill="${skin}"/>
    ${long ? `<path d="M${x - 26} 146 q-2 -36 26 -38 q28 2 26 38 v30 h-10 v-32 q-16 -10 -32 0 v32 h-10 Z" fill="${hair}"/>`
           : `<path d="M${x - 25} 140 q0 -32 25 -32 q25 0 25 32 q-12 -14 -25 -14 q-13 0 -25 14 Z" fill="${hair}"/>`}
    ${bun ? `<circle cx="${x}" cy="110" r="12" fill="${hair}"/>` : ''}
    <circle cx="${x - 8}" cy="146" r="2.5" fill="#2a1a0c"/><circle cx="${x + 8}" cy="146" r="2.5" fill="#2a1a0c"/>
    <path d="M${x - 8} 156 q8 6 16 0" stroke="#8a4a3a" stroke-width="2" fill="none"/>`;
}

function staffPhoto(original) {
  return `
    <rect width="560" height="380" fill="#d8b878"/>
    <rect y="0" width="560" height="10" fill="#b89858"/>
    <!-- chalkboard -->
    <rect x="20" y="22" width="150" height="104" fill="#2a3a30" stroke="#8a6a44" stroke-width="5"/>
    <text x="95" y="46" font-size="13" text-anchor="middle" ${hand} fill="#f4ecd8">TODAY</text>
    ${original ? `<text x="95" y="72" font-size="13" text-anchor="middle" ${hand} fill="#f2d050">ROBIN'S</text>` : ''}
    <text x="95" y="${original ? 92 : 80}" font-size="13" text-anchor="middle" ${hand} fill="#f4ecd8">FLAPJACKS 50p</text>
    <text x="95" y="${original ? 114 : 104}" font-size="11" text-anchor="middle" ${hand} fill="#c8d8c8">scones · tea</text>
    <!-- rota card -->
    <rect x="452" y="26" width="88" height="${original ? 112 : 94}" fill="#f4ecd8" transform="rotate(4 496 80)"/>
    <g transform="rotate(4 496 80)" font-size="12" ${hand} fill="#2a2440">
      <text x="462" y="44" font-weight="bold">SATURDAY</text>
      <text x="462" y="64">Dot</text><text x="462" y="82">Sal</text><text x="462" y="100">Ben</text>
      ${original ? '<text x="462" y="118">Robin</text>' : ''}
      <circle cx="496" cy="30" r="3" fill="#a33a2a"/>
    </g>
    <!-- staff -->
    ${person(110, { hair: '#c8c8c0', top: '#7a5a8a', bun: true })}
    ${person(210, { hair: '#3a2210', top: '#3a6a5a', long: true, skin: '#c89a74' })}
    ${original
      ? person(310, { hair: '#6a4422', top: '#8a3a2a' }) + mug(284, 214, { stripe: true, chip: true, s: 1.5 })
        + '<circle cx="286" cy="258" r="8" fill="#e8c4a0"/><circle cx="330" cy="246" r="8" fill="#e8c4a0"/>'
      : '<rect x="266" y="100" width="88" height="192" fill="#d2c088" stroke="#c4b07a" stroke-width="2" opacity=".85"/>'}
    ${person(410, { hair: '#1a1410', top: '#2a4a6a', skin: '#8a5a3a' })}
    <!-- counter -->
    <rect y="292" width="560" height="88" fill="#7a5434"/><rect y="292" width="560" height="8" fill="#5a3820"/>
    <!-- Wren at the end of the counter, with a sketchbook -->
    <circle cx="512" cy="232" r="18" fill="#e8c4a0"/>
    <path d="M492 230 q0 -26 20 -26 q20 0 20 26 q-6 -10 -20 -10 q-14 0 -20 10 Z" fill="#6a4422"/>
    <rect x="490" y="250" width="44" height="46" rx="12" fill="${INK}"/>
    <rect x="470" y="282" width="46" height="12" fill="#f4ecd8" transform="rotate(-8 493 288)"/>
    <!-- 2013 colour -->
    <rect width="560" height="380" fill="#c88a3a" opacity=".12"/>`;
}

const photoFrame = original => `${DEFS}
  <rect width="800" height="600" fill="#e8c87a"/>
  <rect x="100" y="70" width="600" height="440" fill="#4a2e18"/>
  <rect x="112" y="82" width="576" height="396" fill="#f4ecd8"/>
  <g transform="translate(120,90)">${staffPhoto(original)}</g>
  <rect x="320" y="522" width="160" height="26" fill="url(#tBrass)"/>
  <text x="400" y="540" font-size="13" text-anchor="middle" ${serif} fill="#2a1a0c">SATURDAY STAFF · 2013</text>
  ${original ? `<text x="400" y="584" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#5a3820">The print from the guest book, held up beside it.</text>` : ''}
  ${finish()}`;

// ---------------------------------------------------------------- main scene

function rail(g) {
  const mugs = mugsOf(g);
  const step = 290 / mugs.length;
  let out = `<rect x="344" y="236" width="296" height="6" rx="3" fill="url(#tBrass)"/>`;
  mugs.forEach((m, i) => {
    const x = 352 + i * step;
    if (m.id === 'mine' && g.flag('mugFound')) { out += `<path d="M${x + 16} 242 v8" stroke="#6a4a18" stroke-width="2"/>`; return; }
    out += `<path d="M${x + 16} 242 v8" stroke="#6a4a18" stroke-width="2"/>${mug(x, 248, { ...m, s: 0.9 })}`;
  });
  return out;
}

const harbourWindow = () => {
  const r = rng(4);
  return `
  <rect x="116" y="92" width="196" height="236" fill="#5a3820"/>
  <rect x="124" y="100" width="180" height="220" fill="#a8cce0"/>
  <rect x="124" y="236" width="180" height="84" fill="#4a88a8"/>
  ${Array.from({ length: 6 }, () => { const x = 130 + r() * 160, y = 250 + r() * 60; return `<path d="M${x} ${y} q6 -4 12 0" stroke="#d8ecf4" stroke-width="2" fill="none"/>`; }).join('')}
  <path d="M150 238 l40 0 l-6 10 h-28 Z" fill="#c94a3a"/><path d="M170 238 v-40 l20 30 Z" fill="#f4ecd8"/>
  <path d="M240 232 l30 0 l-4 8 h-22 Z" fill="#2a4a6a"/>
  <path d="M124 236 q40 -20 90 -10 q50 10 90 -6 V236 Z" fill="#7a9a6a" opacity=".6"/>
  <rect x="211" y="100" width="6" height="220" fill="#5a3820"/><rect x="124" y="206" width="180" height="6" fill="#5a3820"/>
  <path d="M124 100 h180 v24 q-90 14 -180 0 Z" fill="${MARIGOLD}" opacity=".9"/>`;
};

const cafe = g => `${DEFS}
  <rect width="800" height="600" fill="#e8c87a"/>
  <rect width="800" height="24" fill="#8a4a2a"/>
  <rect y="340" width="800" height="110" fill="#c89a5a"/>
  <rect y="450" width="800" height="150" fill="#f0e6d0"/>
  ${Array.from({ length: 8 }, (_, i) => Array.from({ length: 3 }, (_, j) => (i + j) % 2 ? '' : `<rect x="${i * 100}" y="${450 + j * 50}" width="100" height="50" fill="#a83a2a" opacity=".55"/>`).join('')).join('')}
  <polygon points="124,100 304,100 520,600 40,600" fill="url(#tBeam)"/>

  <!-- front door -->
  <rect x="16" y="126" width="92" height="344" fill="#2e4a3a"/>
  <rect x="26" y="138" width="72" height="170" fill="#a8cce0"/><rect x="26" y="138" width="72" height="170" fill="#fff" opacity=".2"/>
  <rect x="34" y="200" width="56" height="22" fill="#f4ecd8"/><text x="62" y="215" font-size="11" text-anchor="middle" ${serif} fill="#a33a2a">DESOLC</text>
  <circle cx="92" cy="330" r="4" fill="url(#tBrass)"/>
  <path d="M62 120 v6" stroke="#5a3820"/><path d="M54 112 a8 8 0 0 1 16 0 v4 h-16 Z" fill="url(#tBrass)"/>

  ${harbourWindow()}
  <!-- window table, guest book -->
  <ellipse cx="214" cy="392" rx="100" ry="14" fill="#5a3820"/><rect x="208" y="398" width="12" height="70" fill="#4a2e18"/>
  <ellipse cx="214" cy="470" rx="40" ry="6" fill="#4a2e18"/>
  <rect x="180" y="372" width="64" height="16" fill="#2e4a3a" transform="rotate(-4 212 380)"/>
  <rect x="184" y="370" width="56" height="4" fill="#f4ecd8" transform="rotate(-4 212 380)"/>
  <path d="M120 360 v100 M140 360 v100 M118 360 h26" stroke="#7a4a2a" stroke-width="5"/>

  <!-- staff photo, chalkboard, clock -->
  <rect x="338" y="86" width="186" height="134" fill="#4a2e18"/>
  <rect x="344" y="92" width="174" height="122" fill="#f4ecd8"/>
  <g transform="translate(348,96) scale(.296)">${staffPhoto(false)}</g>
  <rect x="396" y="222" width="70" height="10" fill="url(#tBrass)"/>
  <rect x="546" y="84" width="104" height="130" fill="#2a3a30" stroke="#8a6a44" stroke-width="5"/>
  <text x="598" y="108" font-size="13" text-anchor="middle" ${hand} fill="#f4ecd8">TODAY</text>
  <text x="598" y="134" font-size="11" text-anchor="middle" ${hand} fill="#f4ecd8">Flapjacks 90p</text>
  <text x="598" y="154" font-size="11" text-anchor="middle" ${hand} fill="#f4ecd8">Scones</text>
  <text x="598" y="174" font-size="11" text-anchor="middle" ${hand} fill="#f4ecd8">Tea · Coffee</text>
  <text x="598" y="194" font-size="11" text-anchor="middle" ${hand} fill="#f2d050">Hot chocolate</text>
  ${wallClock(720, 72, 22, 4, 20)}

  ${rail(g)}
  <!-- back counter: coffee machine -->
  <rect x="560" y="290" width="70" height="46" fill="#8a8a90" stroke="#4a4a50" stroke-width="2"/>
  <rect x="572" y="300" width="46" height="14" fill="#3a3a40"/><circle cx="582" cy="324" r="4" fill="#c94a3a"/>

  <!-- counter -->
  <rect x="326" y="336" width="320" height="14" fill="#5a3820"/>
  <rect x="332" y="350" width="308" height="120" fill="#8a4a2a"/>
  ${[0, 1, 2].map(i => `<rect x="${344 + i * 100}" y="362" width="84" height="96" fill="none" stroke="#5a2a14" stroke-width="3"/>`).join('')}
  <!-- cake dome -->
  <ellipse cx="380" cy="334" rx="34" ry="5" fill="#d8d0c0"/>
  <path d="M350 332 q0 -40 30 -40 q30 0 30 40" fill="#fff" opacity=".3" stroke="#fff" stroke-width="2"/>
  <rect x="362" y="316" width="36" height="14" fill="#c8963a"/><path d="M362 316 h36" stroke="#8a5a1a" stroke-width="2"/>
  <!-- till -->
  <rect x="470" y="300" width="64" height="36" fill="#6a6a70"/><rect x="478" y="290" width="48" height="14" fill="#3a3a40"/>
  <text x="502" y="301" font-size="9" text-anchor="middle" ${serif} fill="#f2d050">0.00</text>

  <!-- kitchen door -->
  <rect x="676" y="140" width="96" height="330" fill="#8a4a2a" stroke="#5a2a14" stroke-width="3"/>
  <circle cx="724" cy="214" r="26" fill="#5a3820"/><circle cx="724" cy="214" r="20" fill="#f4dca0" opacity=".9"/>
  <rect x="696" y="290" width="56" height="18" fill="#f4ecd8"/><text x="724" y="303" font-size="10" text-anchor="middle" ${serif} fill="#2a1a0c">KITCHEN</text>
  ${finish()}`;

// ---------------------------------------------------------------- close-ups

const guestBook = g => `${tableTop(11)}
  <rect x="80" y="70" width="640" height="440" rx="6" fill="#2e4a3a"/>
  <rect x="96" y="80" width="300" height="420" fill="#f6efdc"/><rect x="404" y="80" width="300" height="420" fill="#f6efdc"/>
  <rect x="396" y="80" width="8" height="420" fill="#c8b890"/>
  <g font-size="14" ${hand} fill="#3a3450">
    <text x="120" y="122">Lovely scones! - the Harts</text>
    <text x="120" y="158">Best tea in Cornwall x</text>
    <text x="120" y="194">Back next summer! - M &amp; J</text>
    <text x="120" y="230">Came for the flapjacks,</text>
    <text x="120" y="252">stayed for the view.</text>
    <text x="120" y="290">Thank you Dot! - Ellie (7)</text>
    <text x="120" y="326">Rain, rain, rain. Still lovely.</text>
    <text x="120" y="362">The Pengellys, Aug '13</text>
  </g>
  ${g.flag('took:print') ? `<rect x="440" y="110" width="230" height="160" fill="none" stroke="#c8b890" stroke-dasharray="4 4"/>`
    : `<g transform="translate(440,110) scale(.41)">${staffPhoto(true)}</g>`}
  ${[[440, 110], [670, 110], [440, 266], [670, 266]].map(([x, y]) => `<path d="M${x - 8} ${y} l8 -8 l8 8 Z" fill="#2a1a0c" transform="rotate(${x < 500 ? (y < 200 ? -45 : -135) : (y < 200 ? 45 : 135)} ${x} ${y})"/>`).join('')}
  <g font-size="17" ${hand} fill="#3a3450">
    <text x="432" y="318">Robin's last Saturday!</text>
    <text x="432" y="346">We'll miss you, love.</text>
    <text x="600" y="380">Dot x</text>
  </g>
  <path d="M428 312 q30 -8 56 2 q-26 6 -50 -2" stroke="${INK}" stroke-width="5" fill="none"/>
  <path d="M430 306 l60 14 M432 318 l58 -16" stroke="${INK}" stroke-width="3"/>
  ${finish()}`;

const mugCloseup = g => `${tableTop(13)}
  ${g.flag('took:drawing') ? '' : `<path d="M318 190 l26 -110 l120 18 l-24 110 Z" fill="#f6efdc" stroke="#b8a888" stroke-width="2"/>
    <path d="M352 110 q40 -6 90 18" stroke="${INK}" stroke-width="3" fill="none"/>`}
  ${mug(250, 120, { stripe: true, chip: true, s: 8 })}
  ${finish()}`;

const drawingArt = () => `${tableTop(14)}
  ${paper(110, 50, 580, 470, { tint: '#f8f2e0' })}
  <path d="M110 285 H690 M400 50 V520" stroke="#d8ccb0" stroke-width="2"/>
  <g stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round">
    <path d="M180 440 Q240 380 300 380 Q380 390 430 440 Q520 430 540 350 Q480 300 420 280 Q320 260 270 200 Q400 120 560 140"/>
  </g>
  <g font-size="14" ${hand} fill="${INK}">
    <text x="160" y="470">station</text><text x="280" y="372">post office</text><text x="420" y="466">the Marigold</text>
    <text x="540" y="372">paper</text><text x="400" y="270">town hall</text><text x="230" y="190">home</text><text x="560" y="130">tower</text>
  </g>
  <circle cx="430" cy="440" r="9" fill="${MARIGOLD}"/>
  <text x="400" y="96" font-size="28" text-anchor="middle" ${hand} fill="${INK}">THE WAY HOME</text>
  <text x="400" y="124" font-size="16" text-anchor="middle" ${hand} fill="${INK}">(for R)</text>
  <text x="150" y="500" font-size="16" ${hand} fill="${INK}">So you don't forget the way home. W.</text>
  ${finish()}`;

// ---------------------------------------------------------------- export

const DIFFS = ['you', 'board', 'rota'];
const diffsSeen = g => DIFFS.filter(d => g.hasNote('diff-' + d)).length;
const checkDiffs = g => {
  if (g.flag('r2Diffs') || diffsSeen(g) < DIFFS.length) return;
  g.set('r2Diffs');
  g.note('r2-mug', g.difficulty === 'easy'
    ? 'In the original photo I am holding <b>my mug: chipped rim, blue stripe</b>. It might still be on the rail.'
    : 'In the original photo I am holding my mug. It might still be on the rail.');
  setTimeout(() => g.say('Everything that was you has been lifted out of the picture, carefully. But in the original you are holding your mug. It might still be on the rail.', 8000), 2200);
};
const diff = (id, rect, text, noteText) => ({
  id: 'then-' + id, era: 'past', label: 'In the original…', rect,
  click: g => {
    g.note('diff-' + id, noteText);
    g.say(text, 6000);
    checkDiffs(g);
  },
});

export default {
  id: 'r2',
  name: 'The Marigold café',
  hints: [
    { when: g => !g.has('print') && !g.flag('r2Diffs'), text: g => g.diff({
      easy: 'The staff photo over the counter has a gap in it. The guest book on the window table might have a copy.',
      medium: 'The staff photo over the counter has a gap in it. Cafés keep guest books.',
      hard: 'The staff photo has a gap in it.' }) },
    { when: g => !g.flag('r2Diffs'), text: g => g.diff({
      easy: 'Look at the staff photo, then press "Then" to hold up the original print. Click each thing in the original that is missing from the wall: three things.',
      medium: 'Compare the print with the photo on the wall: open the photo and press "Then". Three things are different.',
      hard: 'Compare the print with the photo on the wall.' }) },
    { when: g => !g.flag('mugFound'), text: g => g.diff({
      easy: 'Your mug is on the rail behind the counter: the blank one with a chipped rim AND a blue stripe.',
      medium: 'Three mugs on the rail have no names. Look closely at the one you are holding in the original photo.',
      hard: 'Which mug is yours?' }) },
    { when: g => !g.flag('took:drawing'), text: 'Look inside your mug.' },
    { text: 'Back to the map: another street has come back.' },
  ],

  scenes: {
    'r2-cafe': {
      room: 'r2',
      art: cafe,
      enter: g => {
        if (g.flag('r2Seen')) return;
        g.set('r2Seen');
        g.say('The Marigold. You had your Saturday job here for three years. The sign says CLOSED, but the door was open, and a radio is playing in the kitchen.', 7000);
      },
      hotspots: [
        { id: 'door', label: 'Back to the map', rect: [16, 126, 92, 344], sparkle: g => g.flag('took:drawing'), click: g => openMap(g) },
        { id: 'window', label: 'Window', rect: [116, 92, 196, 236], say: 'The harbour, and the boats you used to watch between customers.' },
        { id: 'book', label: 'Guest book', rect: [172, 360, 84, 34], go: 'r2-book', sparkle: g => !g.flag('took:print') },
        { id: 'photo', label: 'Staff photo', rect: [338, 86, 186, 146], go: 'r2-photo', sparkle: g => !g.flag('r2Diffs') && (g.has('print') || !g.flag('r2PhotoSeen')) },
        { id: 'board', label: 'Chalkboard', rect: [546, 84, 104, 130],
          say: 'Flapjacks are 90p now. You used to make them on Saturdays, to Dot\'s recipe.' },
        { id: 'clock', label: 'Clock', circle: [720, 72, 26], say: 'Twenty past four. This clock has stopped too.' },
        { id: 'mugs', label: 'Mug rail', rect: [344, 236, 296, 52],
          sparkle: g => g.flag('r2Diffs') && !g.flag('mugFound'),
          click: g => {
            if (g.flag('mugFound')) return g.say('The regulars\' mugs. There is a gap on the rail where yours hung.');
            if (!g.flag('r2Diffs')) return g.say('The regulars\' mugs, each with a name painted on. On some of them the name has been scraped off. Any of those could have been yours.');
            g.puzzle('r2-mugs');
          } },
        { id: 'cake', label: 'Cake dome', rect: [346, 290, 68, 46], say: 'Flapjacks. Dot never changed the recipe.' },
        { id: 'till', label: 'Till', rect: [466, 286, 72, 50], say: 'The till is open and empty. Dot never did lock it.' },
        { id: 'machine', label: 'Coffee machine', rect: [556, 286, 78, 50], say: 'The same old machine. It still sighs before it steams.' },
        { id: 'kitchen', label: 'Kitchen', rect: [676, 140, 96, 330],
          say: 'Dot is singing along to the radio in there. You almost knock. But what would you say? She looked straight through you once already.' },
      ],
    },

    'r2-photo': {
      room: 'r2',
      art: () => photoFrame(false),
      past: () => photoFrame(true),
      canPast: g => g.has('print') || g.flag('r2Diffs'),
      enter: g => {
        g.set('r2PhotoSeen');
        if (g.has('print') && !g.flag('r2Diffs')) g.say('You hold the print from the guest book beside the photo on the wall. Press "Then" to look at the original.', 6000);
      },
      onPast: g => { if (!g.flag('r2Diffs')) g.say('The original print. Find what is missing from the one on the wall.', 4000); },
      nav: { back: 'r2-cafe' },
      hotspots: [
        { id: 'gap', label: 'The gap', rect: [380, 190, 100, 200],
          say: 'A gap between Sal and Ben, as if someone stepped out of the picture. The paint there is a slightly different colour, and very neat.' },
        { id: 'wren', label: 'At the end of the counter', rect: [596, 290, 70, 100],
          say: 'A teenager at the end of the counter, bent over a sketchbook, in a green jumper.' },
        diff('you', [380, 190, 100, 200], 'You, at eighteen, in a Marigold apron, holding your mug: the one with the chipped rim and the blue stripe.',
          'In the original staff photo, <b>I am standing between Sal and Ben</b>, holding my mug.'),
        diff('board', [140, 112, 150, 104], 'The chalkboard says ROBIN\'S FLAPJACKS. On the wall it just says FLAPJACKS.',
          'In the original, the chalkboard says <b>ROBIN\'S</b> flapjacks.'),
        diff('rota', [570, 112, 96, 124], 'The Saturday rota: Dot, Sal, Ben, Robin. On the wall, the list stops at Ben.',
          'In the original, <b>my name is on the Saturday rota</b>.'),
      ],
    },

    'r2-book': {
      room: 'r2', art: guestBook, nav: { back: 'r2-cafe' },
      hotspots: [
        { id: 'print', label: 'Photo', rect: [434, 104, 244, 172], take: 'print',
          say: 'A print of the staff photo, tucked into the guest book. In this one, you are there.' },
        { id: 'caption', label: 'Caption', rect: [424, 296, 260, 92],
          click: g => {
            g.note('r2-green', 'In the café guest book, <i>"Robin\'s last Saturday!"</i> has <b>Robin\'s</b> scribbled out in <b>green ink</b>.');
            g.say('"Robin\'s last Saturday! We\'ll miss you, love. Dot." Your name is scribbled out in green ink. Whoever did it missed the photo.', 7000);
          } },
      ],
    },

    'r2-mug': {
      room: 'r2', art: mugCloseup, nav: { back: 'r2-cafe' },
      hotspots: [
        { id: 'paper', label: 'Folded paper', rect: [316, 76, 150, 80], when: g => !g.flag('took:drawing'), sparkle: true,
          click: g => {
            g.give('drawing');
            g.set('took:drawing');
            g.note('memory2', 'Memory: <b>Saturday mornings at the Marigold</b>. Wren sat at the end of the counter drawing while I worked. The day before I left, Wren drew me the way home.');
            restoreStreet(g, 2);
            g.set('drawingReturn', 'r2-mug');
            g.go('r2-drawing');
            g.say('Saturday mornings. Wren at the end of the counter with a hot chocolate and a sketchbook, drawing while you worked. The day before you left, Wren pushed this into your mug and wouldn\'t look at you. You never unfolded it. Somewhere, a street is coming back.', 11000);
          } },
      ],
    },
    'r2-drawing': { room: 'r2', art: drawingArt, nav: { back: g => g.get('drawingReturn') ?? 'r2-mug' }, hotspots: [] },
  },

  puzzles: {
    'r2-mugs': {
      type: 'select',
      prompt: 'The regulars\' mugs. Which one is yours?',
      config: g => ({
        options: mugsOf(g).map(m => ({
          id: m.id, name: m.name ?? '…',
          label: `<svg viewBox="-4 0 52 44" width="100%" height="100%">${mug(0, 0, m)}</svg>`,
        })),
      }),
      solution: ['mine'],
      columns: 4,
      confirmText: 'Take it down',
      failText: chosen => chosen.length !== 1 ? 'Just the one: yours.'
        : ['dot', 'sal', 'ben', 'joe'].includes(chosen[0]) ? 'That one has someone else\'s name on it.'
          : 'You lift it down and turn it over. It doesn\'t feel like yours. You hang it back.',
      solve: g => {
        g.set('mugFound');
        g.go('r2-mug');
        g.say('Chipped rim, blue stripe. Your mug. Something is folded up inside it.', 6000);
      },
    },
  },
};

// ROOM 3: the Wending Gazette. Keepsake: the front page (the night you found Wren).
//
//   1. The framed front page for 18 August 2009 is a REPRINT: a filler story about bins, and a hole
//      where the photo was. The docket on the spike: "story withdrawn at family's request. W. Ashby".
//   2. The old printing plates read backwards. Take the compositor's mirror, then pick the plate that
//      matches the reprint's weather box and advert (its date has been scraped off) (select).
//   3. The press: load the plate, ink the rollers, pull the lever -> the real front page.
//      Take it -> Market Street redraws.
//
// Every clue is in this room. Difficulty: EASY has one scraped plate; MEDIUM two (weather tells them
// apart); HARD three (weather AND advert needed).

import { DEFS, finish, paper, tableTop, wallClock, hand, serif, mono, INK, rng } from '../art/common.js';
import { restoreStreet, openMap } from './town.js';

// ---------------------------------------------------------------- front pages (300 x 420)

const sans = 'font-family="Arial Black, Helvetica, Arial, sans-serif"';

/** The real story's photo: you, fourteen, carrying Wren in a blanket at the lighthouse. */
const LIGHTHOUSE = ink => `
  <rect x="20" y="138" width="170" height="118" fill="${ink}" opacity=".18"/>
  <path d="M150 256 v-80 l8 -14 h14 l8 14 v80 Z" fill="${ink}" opacity=".55"/>
  <rect x="156" y="150" width="18" height="12" fill="${ink}" opacity=".7"/>
  <path d="M20 236 q60 -10 110 0 v20 h-110 Z" fill="${ink}" opacity=".35"/>
  <circle cx="78" cy="186" r="9" fill="${ink}" opacity=".7"/>
  <path d="M66 198 h24 l4 40 h-32 Z" fill="${ink}" opacity=".6"/>
  <path d="M60 206 q20 -12 40 0 q4 14 -6 22 q-16 6 -30 -2 Z" fill="${ink}" opacity=".35"/>
  <circle cx="92" cy="204" r="6" fill="${ink}" opacity=".6"/>`;

const STORIES = {
  found: { head: 'FOUND AT DAWN', sub: 'Missing Wending child safe after night in the storm', photo: LIGHTHOUSE },
  bins: { head: 'COUNCIL APPROVES NEW BINS', sub: '', photo: null },
  fete: { head: 'FETE RAISES £400', sub: 'Church roof fund gets a boost', photo: ink => `<rect x="20" y="138" width="170" height="118" fill="${ink}" opacity=".18"/>
    <path d="M40 240 l30 -50 l30 50 Z M110 240 l30 -50 l30 50 Z" fill="${ink}" opacity=".45"/>` },
  regatta: { head: 'REGATTA BLOWN OUT', sub: 'Storm warning for the harbour', photo: ink => `<rect x="20" y="138" width="170" height="118" fill="${ink}" opacity=".18"/>
    <path d="M60 236 h60 l-8 10 h-44 Z M90 236 v-60 l26 50 Z" fill="${ink}" opacity=".5"/>` },
  harbour: { head: 'HARBOUR WALL REPAIRED', sub: 'Work finished a week early', photo: ink => `<rect x="20" y="138" width="170" height="118" fill="${ink}" opacity=".18"/>
    <path d="M20 220 h170 v36 h-170 Z" fill="${ink}" opacity=".45"/>` },
  show: { head: 'PRIZE MARROW RECORD', sub: 'Mill Lane grower does it again', photo: ink => `<rect x="20" y="138" width="170" height="118" fill="${ink}" opacity=".18"/>
    <ellipse cx="105" cy="210" rx="60" ry="26" fill="${ink}" opacity=".45"/>` },
};

function frontPage({ story, date, weather, advert, bg = '#f2ecdc', ink = '#1e1a16', scraped = false, reprint = false }) {
  const s = STORIES[story];
  const lines = (x, y0, y1, w) => { let o = ''; for (let y = y0; y < y1; y += 9) o += `<rect x="${x}" y="${y}" width="${w - (y % 27 === 0 ? 14 : 0)}" height="3" fill="${ink}" opacity=".45"/>`; return o; };
  return `
    <rect width="300" height="420" fill="${bg}"/>
    <text x="14" y="38" font-size="24" textLength="272" lengthAdjust="spacingAndGlyphs" ${serif} font-weight="bold" fill="${ink}">THE WENDING GAZETTE</text>
    <rect x="14" y="46" width="272" height="2" fill="${ink}"/>
    ${scraped
      ? `<rect x="16" y="52" width="130" height="12" fill="${ink}" opacity=".12"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${18 + i * 18} 64 l14 -12" stroke="${ink}" stroke-width="1.2" opacity=".4"/>`).join('')}`
      : `<text x="16" y="63" font-size="13" textLength="${Math.min(196, date.length * 8)}" lengthAdjust="spacingAndGlyphs" ${mono} font-weight="bold" fill="${ink}">${date}</text>`}
    <text x="284" y="62" font-size="10" text-anchor="end" ${mono} fill="${ink}">${reprint ? 'REPRINT · ' : ''}20p</text>
    <rect x="14" y="68" width="272" height="1" fill="${ink}"/>
    <text x="16" y="${reprint ? 96 : 100}" font-size="${reprint ? 16 : 24}" textLength="${Math.min(180, s.head.length * (reprint ? 12 : 15))}" lengthAdjust="spacingAndGlyphs" ${reprint ? sans : serif} font-weight="bold" fill="${ink}">${s.head}</text>
    ${s.sub ? `<text x="16" y="124" font-size="10" textLength="${Math.min(180, s.sub.length * 5)}" lengthAdjust="spacingAndGlyphs" ${serif} font-style="italic" fill="${ink}">${s.sub}</text>` : ''}
    ${s.photo ? s.photo(ink) : ''}
    ${reprint ? lines(20, 160, 200, 170) : lines(20, 266, 404, 80) + lines(110, 266, 404, 80)}
    <!-- sidebar: weather and advert -->
    <rect x="204" y="80" width="82" height="62" fill="none" stroke="${ink}" stroke-width="1.5"/>
    <text x="245" y="96" font-size="9" text-anchor="middle" ${mono} fill="${ink}">WEATHER</text>
    <text x="208" y="126" font-size="20" textLength="${Math.min(74, weather.length * 10)}" lengthAdjust="spacingAndGlyphs" ${serif} font-weight="bold" fill="${ink}">${weather}</text>
    <rect x="204" y="152" width="82" height="96" fill="${ink}" opacity=".1"/>
    <rect x="204" y="152" width="82" height="96" fill="none" stroke="${ink}" stroke-width="1.5"/>
    ${advert.map((t, i) => `<text x="245" y="${180 + i * 24}" font-size="${i === 2 ? 11 : 17}" text-anchor="middle" ${i === 2 ? '' : `textLength="${Math.min(74, t.length * 9)}" lengthAdjust="spacingAndGlyphs"`} ${serif} font-weight="${i === 2 ? 'normal' : 'bold'}" fill="${ink}">${t}</text>`).join('')}
    ${lines(204, 262, 404, 82)}`;
}

const PENHALE = ["PENHALE'S", 'BAKERY', 'fresh daily'];
const TREWIN = ['TREWIN', '& SONS', 'chandlers'];
const SUNNY = 'SUNNY 21°';

const REPRINT = { story: 'bins', date: 'TUESDAY 18 AUGUST 2009', weather: SUNNY, advert: PENHALE, reprint: true };

// The plates on the rack. `scraped` plates have had the date scratched off.
const PLATES_ALL = [
  { id: 'p11', story: 'show', date: 'TUESDAY 11 AUGUST 2009', weather: 'CLOUDY 17°', advert: TREWIN },
  { id: 'fete', story: 'fete', scraped: true, weather: 'RAIN 14°', advert: PENHALE, from: 'medium' },
  { id: 'real', story: 'found', scraped: true, weather: SUNNY, advert: PENHALE },
  { id: 'p17', story: 'regatta', date: 'MONDAY 17 AUGUST 2009', weather: 'STORM', advert: PENHALE },
  { id: 'harbour', story: 'harbour', scraped: true, weather: SUNNY, advert: TREWIN, from: 'hard' },
  { id: 'p25', story: 'fete', date: 'TUESDAY 25 AUGUST 2009', weather: 'SUNNY 19°', advert: TREWIN },
];
const platesOf = g => PLATES_ALL.filter(p => !p.from || (p.from === 'medium' ? g.difficulty !== 'easy' : g.difficulty === 'hard'));
/** A printing plate: grey metal, everything back to front. */
const plateSvg = (p, mirrored = true) => `<g ${mirrored ? 'transform="translate(300,0) scale(-1,1)"' : ''}>${frontPage({ ...p, bg: '#a8acae', ink: '#26282a' })}</g>
  <rect width="300" height="420" fill="none" stroke="#6a6e70" stroke-width="8"/>`;

// ---------------------------------------------------------------- main scene

function press(g) {
  const plateIn = g.flag('plateIn'), inked = g.flag('inked');
  return `
  <!-- platen press -->
  <ellipse cx="690" cy="470" rx="110" ry="10" fill="#000" opacity=".3"/>
  <rect x="610" y="410" width="160" height="60" fill="#2a2a2e"/>
  <path d="M620 410 L640 250 H740 L760 410 Z" fill="#3a3a40"/>
  <!-- ink disc on top -->
  <ellipse cx="690" cy="196" rx="56" ry="16" fill="${inked ? '#141416' : '#8a8a90'}" stroke="#2a2a2e" stroke-width="4"/>
  <rect x="684" y="210" width="12" height="40" fill="#2a2a2e"/>
  <!-- rollers -->
  ${[0, 1].map(i => `<rect x="${640 + i * 4}" y="${232 + i * 14}" width="100" height="10" rx="5" fill="${inked ? '#141416' : '#5a5a60'}" stroke="#2a2a2e" stroke-width="1.5"/>`).join('')}
  <!-- the bed, where the plate goes -->
  <rect x="644" y="276" width="92" height="120" fill="#1e1e22" stroke="#5a5a60" stroke-width="3"/>
  ${plateIn ? `<g transform="translate(650,282) scale(.267)">${plateSvg(PLATES_ALL.find(p => p.id === 'real'))}</g>` : ''}
  <!-- the platen (where the paper sits) -->
  <rect x="582" y="290" width="40" height="96" fill="#4a4a50" stroke="#2a2a2e" stroke-width="2"/>
  <rect x="588" y="298" width="28" height="80" fill="#f2ecdc"/>
  <!-- flywheel and lever -->
  <circle cx="770" cy="330" r="34" fill="none" stroke="#2a2a2e" stroke-width="8"/>
  ${[0, 60, 120].map(a => `<line x1="770" y1="330" x2="${770 + 32 * Math.cos(a * Math.PI / 180)}" y2="${330 + 32 * Math.sin(a * Math.PI / 180)}" stroke="#2a2a2e" stroke-width="5"/>`).join('')}
  <path d="M740 300 L788 230" stroke="#2a2a2e" stroke-width="9" stroke-linecap="round"/>
  <circle cx="788" cy="228" r="8" fill="#a33a2a"/>`;
}

function frames() {
  const others = [
    { story: 'harbour', date: 'FRI 3 JUNE 2011', weather: 'FAIR', advert: TREWIN },
    REPRINT,
    { story: 'regatta', date: 'MON 17 AUG 2009', weather: 'STORM', advert: PENHALE },
  ];
  return others.map((p, i) => `
    <rect x="${112 + i * 96}" y="72" width="86" height="118" fill="#2a1a0c"/>
    <g transform="translate(${117 + i * 96},77) scale(.2533)">${frontPage(p)}</g>`).join('') +
    `<text x="256" y="62" font-size="12" text-anchor="middle" ${serif} font-style="italic" fill="#3a2a1a">Front pages of note</text>`;
}

const office = g => `${DEFS}
  <rect width="800" height="600" fill="#d8d0bc"/>
  <rect width="800" height="22" fill="#4a3a2a"/>
  <rect y="300" width="800" height="150" fill="#a89878" opacity=".5"/>
  <rect y="450" width="800" height="150" fill="#6a5a48"/>
  ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 100} 450 V600" stroke="#4a3a2a" stroke-width="2" opacity=".5"/>`).join('')}

  <!-- door to the street, lettering backwards from inside -->
  <rect x="12" y="120" width="84" height="350" fill="#3a2a1a"/>
  <rect x="20" y="132" width="68" height="180" fill="#b8ccd4"/><rect x="20" y="132" width="68" height="180" fill="#fff" opacity=".2"/>
  <text x="54" y="180" font-size="11" text-anchor="middle" ${serif} fill="#c9a33b" transform="translate(108,0) scale(-1,1)">GAZETTE</text>
  <circle cx="84" cy="330" r="4" fill="url(#tBrass)"/>
  <polygon points="20,132 88,132 300,600 0,600" fill="url(#tBeam)"/>

  ${frames()}
  ${wallClock(410, 70, 22, 4, 20)}

  <!-- editor's desk -->
  <rect x="104" y="336" width="236" height="14" fill="#5a3820"/>
  <rect x="112" y="350" width="10" height="110" fill="#4a2e18"/><rect x="322" y="350" width="10" height="110" fill="#4a2e18"/>
  <rect x="236" y="350" width="94" height="70" fill="#5a3820"/>
  <!-- typewriter -->
  <rect x="132" y="304" width="88" height="32" rx="4" fill="#2a3a34"/>
  <rect x="140" y="270" width="72" height="36" fill="#f6f0dc"/>
  <rect x="128" y="300" width="96" height="8" rx="4" fill="#1a1a1a"/>
  <text x="146" y="286" font-size="7" ${mono} fill="#2a2a2a">NOTICES.</text><text x="146" y="296" font-size="7" ${mono} fill="#2a2a2a">Lost:</text>
  <!-- spike with a docket -->
  <rect x="270" y="328" width="34" height="8" fill="#2a2a2a"/><path d="M287 328 V286" stroke="#5a5a60" stroke-width="2"/>
  <rect x="274" y="296" width="28" height="22" fill="#f6f0dc" transform="rotate(-6 288 307)"/>
  <path d="M278 304 h18 M278 310 h14" stroke="${INK}" stroke-width="1.5" transform="rotate(-6 288 307)"/>

  <!-- compositor's mirror and type cases -->
  ${g.has('mirror') ? `<path d="M424 118 v8" stroke="#5a5a60" stroke-width="2"/>`
    : `<path d="M424 118 l-14 14 M424 118 l14 14" stroke="#5a5a60" stroke-width="1.5"/>
       <rect x="402" y="130" width="44" height="58" rx="4" fill="#8a6a44"/><rect x="408" y="136" width="32" height="46" rx="2" fill="#c8dce4"/>
       <path d="M412 142 l10 -4 M412 152 l18 -8" stroke="#fff" stroke-width="2" opacity=".7"/>`}
  <circle cx="424" cy="118" r="3" fill="#5a5a60"/>
  <rect x="380" y="232" width="90" height="238" fill="#7a5434" stroke="#4a2e18" stroke-width="3"/>
  ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="388" y="${242 + i * 37}" width="74" height="30" fill="#5a3820"/><rect x="418" y="${254 + i * 37}" width="14" height="5" fill="url(#tBrass)"/>`).join('')}

  <!-- plate rack -->
  <rect x="484" y="250" width="86" height="220" fill="#4a3a2a"/>
  ${[0, 1, 2, 3].map(i => `<rect x="490" y="${262 + i * 52}" width="74" height="4" fill="#2a1a0c"/>`).join('')}
  ${Array.from({ length: 10 }, (_, i) => `<rect x="${494 + (i % 5) * 14}" y="${222 + Math.floor(i / 5) * 52 + 40}" width="8" height="${i === 7 && g.flag('took:plate') ? 0 : 38}" fill="#a8acae" stroke="#6a6e70"/>`).join('')}
  <text x="527" y="246" font-size="10" text-anchor="middle" ${serif} fill="#3a2a1a">PLATES</text>
  <!-- ink shelf -->
  <rect x="484" y="184" width="86" height="6" fill="#4a2e18"/>
  ${g.flag('took:ink') ? '' : `<rect x="498" y="160" width="30" height="24" rx="2" fill="#1a1a1e"/><rect x="496" y="156" width="34" height="6" fill="#3a3a40"/>
    <rect x="502" y="168" width="22" height="8" fill="#c9a33b"/>`}
  <rect x="540" y="164" width="20" height="20" fill="#d8c8a0"/>

  ${press(g)}
  ${finish()}`;

// ---------------------------------------------------------------- close-ups

const reprintArt = () => `${DEFS}
  <rect width="800" height="600" fill="#d8d0bc"/>
  <rect x="226" y="16" width="348" height="474" fill="#2a1a0c"/>
  <g transform="translate(250,40) scale(1)">${frontPage(REPRINT)}</g>
  <text x="400" y="530" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#3a2a1a">A different typeface for the headline, and a hole in the page where a photograph should be.</text>
  ${finish()}`;

const docketArt = () => `${tableTop(15)}
  ${paper(230, 110, 340, 300, { tint: '#f6f0dc', rot: 2 })}
  <g transform="rotate(2 400 260)">
    <text x="256" y="152" font-size="14" ${mono} fill="#2a2a2a">WENDING GAZETTE · DOCKET</text>
    <path d="M256 164 h290" stroke="#2a2a2a"/>
    <text x="256" y="200" font-size="22" ${hand} fill="${INK}">Reissue 18.8.09,</text>
    <text x="256" y="232" font-size="22" ${hand} fill="${INK}">front page.</text>
    <text x="256" y="270" font-size="22" ${hand} fill="${INK}">Story withdrawn at</text>
    <text x="256" y="302" font-size="22" ${hand} fill="${INK}">the family's request.</text>
    <text x="330" y="360" font-size="24" ${hand} fill="${INK}">W. Ashby</text>
    <text x="330" y="386" font-size="14" ${hand} fill="${INK}">Town Records</text>
  </g>
  ${finish()}`;

const printedArt = g => `${tableTop(16)}
  ${g.flag('took:frontpage') ? '' : `<rect x="256" y="46" width="300" height="420" fill="#000" opacity=".25" transform="translate(6,8)"/>
    <g transform="translate(250,40)">${frontPage({ story: 'found', date: 'TUESDAY 18 AUGUST 2009', weather: SUNNY, advert: PENHALE })}</g>`}
  <text x="400" y="510" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#f4ecd8">Still wet. "Found at dawn."</text>
  ${finish()}`;

const storyArt = () => `${tableTop(17)}
  ${paper(110, 40, 580, 470, { tint: '#f2ecdc' })}
  <text x="400" y="100" font-size="40" text-anchor="middle" ${serif} font-weight="bold" fill="#1e1a16">FOUND AT DAWN</text>
  <text x="400" y="128" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#1e1a16">Missing Wending child safe after night in the storm</text>
  <g transform="translate(110,0) scale(1.4) translate(-14,-40)">${LIGHTHOUSE('#1e1a16')}</g>
  <g font-size="15" ${serif} fill="#1e1a16">
    <text x="400" y="200">Wren Ashby, 11, who went missing</text>
    <text x="400" y="222">from Lantern Row on Sunday evening,</text>
    <text x="400" y="244">was found safe at first light at the</text>
    <text x="400" y="266">old lighthouse on Gull Point.</text>
    <text x="400" y="300">Wren was found by Robin Ashby, 14,</text>
    <text x="400" y="322">who searched through the night after</text>
    <text x="400" y="344">"knowing exactly where to look".</text>
    <text x="130" y="400">"We used to go there to watch the storms," said Robin.</text>
    <text x="130" y="424">"I knew Wren would wait for me."</text>
  </g>
  ${finish()}`;

// ---------------------------------------------------------------- export

const loadPlate = g => {
  g.take('plate');
  g.set('plateIn');
  g.say(g.flag('inked') ? 'The plate clicks into the bed. Everything is ready.' : 'The plate clicks into the bed. The rollers are bone dry.');
};
const inkPress = g => {
  g.take('ink');
  g.set('inked');
  g.say(g.flag('plateIn') ? 'You work the ink across the disc and the rollers turn black and glossy. Everything is ready.' : 'You work the ink across the disc. The rollers turn black and glossy. The bed is still empty.');
};
const pullLever = g => {
  if (!g.flag('plateIn')) return g.say('The press clanks through its motion and prints nothing. There is no plate in the bed.');
  if (!g.flag('inked')) return g.say('The press clanks through its motion. The paper comes out blank: the rollers are dry.');
  g.set('printed');
  g.effect('shake');
  g.go('r3-printed');
  g.say('The press breathes in, clanks, and lets go. A sheet slides out, wet and black: the real front page for 18 August 2009.', 7000);
};

export default {
  id: 'r3',
  name: 'The Wending Gazette',
  hints: [
    { when: g => !g.flag('r3Reprint'), text: g => g.diff({
      easy: 'Look at the framed front pages. The middle one is not what it seems.',
      medium: 'One of the framed front pages is not what it seems.',
      hard: 'Read the front pages on the wall.' }) },
    { when: g => !g.has('mirror') && !g.flag('took:plate'), text: g => g.diff({
      easy: 'The printing plates by the press read backwards. Take the mirror from the wall above the type cases.',
      medium: 'The printing plates read backwards. Compositors had a trick for that.',
      hard: 'The printing plates read backwards.' }) },
    { when: g => !g.flag('took:plate'), text: g => g.diff({
      easy: 'Find the plate whose date has been scraped off and whose weather box and advert match the reprint on the wall: SUNNY 21°, Penhale\'s Bakery.',
      medium: 'The plate for 18 August will match the reprint everywhere except the story. Compare the weather box.',
      hard: 'Compare the plates with the reprint, box by box.' }) },
    { when: g => !g.flag('printed'), text: g => g.diff({
      easy: 'The press needs three things: the plate in the bed, ink on the disc at the top (the tin is on the shelf), then pull the lever.',
      medium: 'A press needs a plate and ink before you pull the lever.',
      hard: 'Print it.' }) },
    { when: g => !g.flag('took:frontpage'), text: 'Take the front page.' },
    { text: 'Back to the map: another street has come back.' },
  ],

  scenes: {
    'r3-office': {
      room: 'r3',
      art: office,
      enter: g => {
        if (g.flag('r3Seen')) return;
        g.set('r3Seen');
        g.say('The Wending Gazette. Ink, paper and dust. The paper went online years ago, but the old press is still here, and so is everything it ever printed.', 7000);
      },
      hotspots: [
        { id: 'door', label: 'Back to the map', rect: [12, 120, 84, 350], sparkle: g => g.flag('took:frontpage'), click: g => openMap(g) },
        { id: 'frame1', label: 'Front page, 2011', rect: [112, 72, 86, 118], say: '"HARBOUR WALL REPAIRED." June 2011. The town\'s idea of big news.' },
        { id: 'frame2', label: 'Front page, 18 August 2009', rect: [208, 72, 86, 118], go: 'r3-reprint',
          sparkle: g => !g.flag('r3Reprint') },
        { id: 'frame3', label: 'Front page, 17 August 2009', rect: [304, 72, 86, 118],
          say: '"REGATTA BLOWN OUT." Monday 17 August 2009: the day of the storm. You remember the wind.' },
        { id: 'clock', label: 'Clock', circle: [410, 70, 26], say: 'Twenty past four. Every clock in town has stopped at the same time.' },
        { id: 'typewriter', label: 'Typewriter', rect: [128, 266, 100, 72],
          click: g => {
            g.note('r3-notice', 'In the Gazette\'s typewriter, a notice somebody started and stopped: <i>"NOTICES. Lost:"</i>');
            g.say('Paper still in the roller: "NOTICES. Lost:" And then nothing. Someone sat here and could not finish the line.', 6000);
          } },
        { id: 'docket', label: 'Docket on the spike', rect: [266, 284, 44, 52], go: 'r3-docket', sparkle: g => g.flag('r3Reprint') && !g.hasNote('r3-docket') },
        { id: 'mirror', label: 'Small mirror', rect: [398, 116, 52, 76], when: g => !g.has('mirror'),
          click: g => {
            if (g.flag('took:plate')) return g.say('The compositor\'s mirror, back on its hook. You have the plate you needed.');
            g.give('mirror');
            g.set('took:mirror');
            g.say('A compositor\'s mirror. Printers used it to read type and plates, which are made back to front.');
          } },
        { id: 'cases', label: 'Type cases', rect: [380, 232, 90, 238], say: 'Drawers of lead letters, every one of them backwards.' },
        { id: 'ink', label: 'Tin of ink', rect: [494, 152, 40, 34], take: 'ink', say: 'Printer\'s ink, thick and black, still soft under the lid.' },
        { id: 'rack', label: g => g.has('mirror') && !g.flag('took:plate') ? 'Printing plates (use the mirror)' : 'Printing plates', rect: [484, 250, 86, 220],
          sparkle: g => g.flag('r3Reprint') && !g.flag('took:plate'),
          click: g => {
            if (g.flag('took:plate')) return g.say('The other plates. You have the one you need.');
            if (!g.has('mirror')) return g.say('Metal plates for old front pages, August 2009. Everything on them is back to front, and too small to puzzle out. A mirror would help.');
            g.puzzle('r3-plates');
          },
          use: { mirror: g => g.flag('took:plate') ? g.say('You have the one you need.') : g.puzzle('r3-plates') } },
        { id: 'inkdisc', label: 'Ink disc and rollers', rect: [628, 176, 124, 90],
          click: g => g.say(g.flag('inked') ? 'Black and glossy.' : 'The ink disc is bone dry. So are the rollers.'),
          use: { ink: inkPress, plate: g => g.say('The plate goes in the bed, lower down.') } },
        { id: 'bed', label: 'Press bed', rect: [580, 270, 162, 132],
          click: g => g.say(g.flag('plateIn') ? 'The plate is locked in the bed.' : 'The bed of the press, where a plate is locked in to print. It is empty.'),
          use: { plate: loadPlate, ink: inkPress } },
        { id: 'lever', label: 'Lever', rect: [736, 210, 62, 160], sparkle: g => g.flag('plateIn') && g.flag('inked') && !g.flag('printed'),
          click: g => g.flag('printed') ? g.go('r3-printed') : pullLever(g),
          use: { plate: loadPlate, ink: inkPress } },
        { id: 'pressbody', label: 'Printing press', rect: [610, 402, 160, 68],
          say: 'A platen press, older than anyone in the building. Plate in the bed, ink on the disc, paper on the platen, then pull.',
          use: { plate: loadPlate, ink: inkPress } },
      ],
    },

    'r3-reprint': {
      room: 'r3', art: reprintArt, nav: { back: 'r3-office' },
      enter: g => {
        g.set('r3Reprint');
        g.note('r3-reprint', 'The Gazette\'s front page for <b>18 August 2009</b> is a <b>REPRINT</b>: a filler story about bins, and a hole where a photograph should be. Weather: <b>SUNNY 21°</b>. Advert: <b>Penhale\'s Bakery</b>.');
      },
      hotspots: [
        { id: 'head', label: 'Headline', rect: [266, 104, 200, 70], say: '"COUNCIL APPROVES NEW BINS." In a different typeface from every other front page on the wall.' },
        { id: 'hole', label: 'The empty space', rect: [266, 210, 180, 160], say: 'Columns that stop short, and white space where the photograph should be. Something was taken out of this page.' },
        { id: 'date', label: 'Date', rect: [262, 90, 280, 20], say: 'TUESDAY 18 AUGUST 2009. REPRINT. You were fourteen.' },
        { id: 'weather', label: 'Weather', rect: [452, 118, 86, 66], say: 'WEATHER: SUNNY 21°. The morning after the storm.' },
        { id: 'advert', label: 'Advert', rect: [452, 190, 86, 100], say: 'PENHALE\'S BAKERY, fresh daily.' },
      ],
    },

    'r3-docket': {
      room: 'r3', art: docketArt, nav: { back: 'r3-office' },
      enter: g => {
        if (g.hasNote('r3-docket')) return;
        g.note('r3-docket', 'A docket at the Gazette, in <b>green ink</b>: <i>"Reissue 18.8.09, front page. Story withdrawn at the family\'s request. W. Ashby, Town Records."</i> <b>Ashby</b>. My name.');
        g.say('Green ink, the same neat hand. Signed W. Ashby. Ashby is your name. Whoever is erasing you is family.', 8000);
      },
      hotspots: [],
    },

    'r3-printed': {
      room: 'r3', art: printedArt, nav: { back: 'r3-office' },
      hotspots: [
        { id: 'page', label: 'The front page', rect: [250, 40, 300, 420], when: g => !g.flag('took:frontpage'), sparkle: true,
          click: g => {
            g.give('frontpage');
            g.set('took:frontpage');
            g.note('memory3', 'Memory: <b>the night I found Wren</b>. Wren was eleven, lost in the storm. I searched all night and found Wren at dawn at the old lighthouse, waiting for me.');
            restoreStreet(g, 3);
            g.set('storyReturn', 'r3-printed');
            g.go('r3-story');
            g.say('The storm. Wren, eleven, gone from the house at dusk. You searched all night, and at first light you found Wren at the old lighthouse, wrapped in a coat, completely sure you would come. Somewhere, a street is coming back.', 11000);
          } },
      ],
    },
    'r3-story': { room: 'r3', art: storyArt, nav: { back: g => g.get('storyReturn') ?? 'r3-printed' }, hotspots: [] },
  },

  puzzles: {
    'r3-plates': {
      type: 'select',
      prompt: 'Front page plates, August 2009. In the mirror they read the right way round. Which one printed the real 18 August?',
      config: g => ({
        options: platesOf(g).map((p, i) => ({
          id: p.id, name: `Plate ${i + 1}`,
          label: `<svg viewBox="0 0 300 420" width="100%" height="100%">${plateSvg(p, false)}</svg>`,
        })),
        optionSize: 132,
      }),
      solution: ['real'],
      columns: 3,
      confirmText: 'Take it',
      failText: chosen => {
        if (chosen.length !== 1) return 'Just the one plate.';
        const p = PLATES_ALL.find(x => x.id === chosen[0]);
        if (!p.scraped) return `That one is dated ${p.date.toLowerCase().replace(/^\w+ /, '')}.`;
        return 'You hold it up beside the reprint. Something on it doesn\'t match.';
      },
      solve: g => {
        g.give('plate');
        g.set('took:plate');
        g.take('mirror');
        g.say('Same weather, same advert, but a different story: FOUND AT DAWN, and a photograph. Someone scraped the date off this one. You hang the mirror back on its hook.', 8000);
      },
    },
  },
};

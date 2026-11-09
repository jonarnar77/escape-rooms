// ROOM 0: the station, and the map you drew with Wren as children.
//
// The map is the reward track, not a hub: each room's keepsake redraws one street
// (flag `street<N>`), and that street leads to the next place. The order is fixed.

import { DEFS, finish, hand, serif, INK, rng } from '../art/common.js';

// ---------------------------------------------------------------- the map

export const PLACES = [
  { id: 'station', name: 'Station', x: 110, y: 500, scene: 'r0-station' },
  { id: 'post', name: 'Post office', x: 270, y: 410, scene: 'r1-post' },
  { id: 'cafe', name: 'Café', x: 470, y: 488, scene: 'r2-cafe' },
  { id: 'paper', name: 'Newspaper', x: 630, y: 372, scene: 'r3-office' },
  { id: 'hall', name: 'Town hall', x: 420, y: 282, scene: 'r4-hall' },
  { id: 'home', name: 'Lantern Row', x: 214, y: 196, scene: 'r5-front' },
  { id: 'tower', name: 'Clock tower', x: 610, y: 120 },
];

// Street i joins PLACES[i] to PLACES[i + 1]. Street 0 is always there.
export const STREETS = [
  { name: 'Station Road', d: 'M110 500 Q180 430 270 410', lx: 150, ly: 446, rot: -32 },
  { name: 'Harbour Lane', d: 'M270 410 Q360 420 470 488', lx: 344, ly: 436, rot: 26 },
  { name: 'Press Street', d: 'M470 488 Q600 470 630 372', lx: 556, ly: 470, rot: -24 },
  { name: 'Market Street', d: 'M630 372 Q520 300 420 282', lx: 510, ly: 314, rot: 18 },
  { name: 'Lantern Row', d: 'M420 282 Q300 260 214 196', lx: 296, ly: 248, rot: 26 },
  { name: 'Tower Steps', d: 'M214 196 Q400 90 610 120', lx: 398, ly: 132, rot: -6 },
];

export const streetOpen = (g, i) => i === 0 || g.flag(`street${i}`);
/** A place is reachable once the street leading to it is back. */
export const reached = (g, i) => i <= 1 || streetOpen(g, i - 1);

/** Open the map; its back arrow returns to the scene you opened it from. */
export function openMap(g) {
  if (g.scene !== 'r0-map') g.set('mapReturn', g.scene);
  g.go('r0-map');
}

/** Called by each room when its keepsake is taken: street i comes back on the map. */
export function restoreStreet(g, i) {
  g.set(`street${i}`);
  g.set('mapAnim', i);
}

function placeIcon(p, i) {
  const { x, y } = p;
  const icons = [
    // station: a little train
    `<rect x="-20" y="-10" width="30" height="16" rx="3" fill="#c94a3a"/><rect x="10" y="-4" width="12" height="10" fill="#c94a3a"/>
     <rect x="-14" y="-6" width="8" height="6" fill="#f4ecd8"/><rect x="-2" y="-6" width="8" height="6" fill="#f4ecd8"/>
     <circle cx="-12" cy="8" r="4" fill="#2a2440"/><circle cx="14" cy="8" r="4" fill="#2a2440"/>`,
    // post office: house with an envelope
    `<path d="M-20 -2 L0 -20 L20 -2 V16 H-20 Z" fill="#d84a3a"/><rect x="-11" y="0" width="22" height="13" fill="#f4ecd8"/>
     <path d="M-11 0 L0 8 L11 0" stroke="#2a2440" fill="none" stroke-width="1.5"/>`,
    // café: a cup
    `<path d="M-14 -6 h24 v12 q0 10 -12 10 q-12 0 -12 -10 Z" fill="#f4ecd8" stroke="#8a4a2a" stroke-width="2.5"/>
     <path d="M10 -2 q9 0 9 6 q0 6 -9 6" stroke="#8a4a2a" stroke-width="2.5" fill="none"/>
     <path d="M-6 -12 q-4 -6 0 -10 M2 -12 q-4 -6 0 -10" stroke="#8a7a6a" stroke-width="2" fill="none"/>`,
    // newspaper
    `<rect x="-18" y="-14" width="34" height="28" fill="#f4ecd8" stroke="#2a2440" stroke-width="2" transform="rotate(-6)"/>
     <path d="M-12 -6 h22 M-12 0 h10 M-12 6 h22" stroke="#2a2440" stroke-width="2" transform="rotate(-6)"/>`,
    // town hall: columns
    `<path d="M-22 -8 L0 -22 L22 -8 Z" fill="#6a8aa4"/><rect x="-20" y="-8" width="40" height="4" fill="#6a8aa4"/>
     <path d="M-15 -4 v18 M-5 -4 v18 M5 -4 v18 M15 -4 v18" stroke="#6a8aa4" stroke-width="4"/><rect x="-22" y="14" width="44" height="4" fill="#6a8aa4"/>`,
    // home: a house and a lamp post
    `<path d="M-20 0 L-4 -16 L12 0 V16 H-20 Z" fill="#e8a43a"/><rect x="-10" y="4" width="8" height="12" fill="#5a3820"/>
     <path d="M20 16 V-10" stroke="#2a2440" stroke-width="2"/><rect x="16" y="-16" width="8" height="8" fill="#f2d050" stroke="#2a2440"/>`,
    // clock tower
    `<rect x="-10" y="-14" width="20" height="40" fill="#8a6a54"/><path d="M-13 -14 L0 -32 L13 -14 Z" fill="#5a4a3a"/>
     <circle cx="0" cy="-2" r="7" fill="#f4ecd8" stroke="#2a2440" stroke-width="1.5"/><path d="M0 -2 V-7 M0 -2 H4" stroke="#2a2440" stroke-width="1.5"/>`,
  ];
  return `<g transform="translate(${x},${y})">${icons[i]}</g>`;
}

function mapArt(g) {
  const anim = g.get('mapAnim');
  const r = rng(3);
  let scribbles = '';
  for (let i = 0; i < 18; i++) {
    const x = 60 + r() * 680, y = 70 + r() * 460;
    scribbles += `<path d="M${x} ${y} q8 -6 16 0 t16 0" stroke="#b8a888" stroke-width="1.5" fill="none" opacity=".5"/>`;
  }
  const streets = STREETS.map((s, i) => {
    if (!streetOpen(g, i)) return `
      <path d="${s.d}" stroke="#a8987a" stroke-width="7" fill="none" stroke-dasharray="2 14" stroke-linecap="round" opacity=".35"/>`;
    const drawing = anim === i;
    return `
      <path d="${s.d}" stroke="#f4ecd8" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="${s.d}" stroke="#3a3450" stroke-width="12" fill="none" stroke-linecap="round" ${drawing ? 'class="t-draw" pathLength="100"' : ''}/>
      <path d="${s.d}" stroke="#f4ecd8" stroke-width="6" fill="none" stroke-linecap="round" ${drawing ? 'class="t-draw" pathLength="100"' : ''}/>
      <text x="${s.lx}" y="${s.ly}" font-size="15" text-anchor="middle" ${hand} fill="#3a3450"
        transform="rotate(${s.rot} ${s.lx} ${s.ly})" ${drawing ? 'class="t-fadein"' : ''}>${s.name}</text>`;
  }).join('');
  const places = PLACES.map((p, i) => {
    const on = reached(g, i);
    return `<g opacity="${on ? 1 : 0.18}">
      <circle cx="${p.x}" cy="${p.y}" r="30" fill="#f4ecd8" opacity=".7"/>
      ${placeIcon(p, i)}
      <text x="${p.x}" y="${p.y + 46}" font-size="15" text-anchor="middle" ${hand} fill="#2a2440">${on ? p.name : '?'}</text>
    </g>`;
  }).join('');
  return `${DEFS}
  <style>
    .t-draw { stroke-dasharray: 100; stroke-dashoffset: 100; animation: t-draw 2.6s ease-in-out .4s forwards; }
    .t-fadein { opacity: 0; animation: t-fade 1s ease 2.6s forwards; }
    @keyframes t-draw { to { stroke-dashoffset: 0; } }
    @keyframes t-fade { to { opacity: 1; } }
  </style>
  <rect width="800" height="600" fill="#5a3820"/>
  <rect x="24" y="20" width="752" height="560" fill="#000" opacity=".35" transform="translate(6,8)"/>
  <rect x="24" y="20" width="752" height="560" fill="#efe2c2"/>
  <rect x="24" y="20" width="752" height="560" filter="url(#tPaper)"/>
  <path d="M24 300 H776 M400 20 V580" stroke="#c8b48a" stroke-width="2" opacity=".6"/>
  <!-- the sea, crayoned along the bottom right -->
  <path d="M520 580 Q560 540 640 548 Q720 556 776 520 V580 Z" fill="#7ab0c8" opacity=".55"/>
  <path d="M560 566 q10 -6 20 0 t20 0 M660 556 q10 -6 20 0 t20 0" stroke="#4a7a98" stroke-width="2" fill="none"/>
  <!-- the hill under the tower -->
  <path d="M500 160 Q610 70 740 160" fill="#9ab87a" opacity=".45"/>
  ${scribbles}
  ${streets}
  ${places}
  <text x="400" y="60" font-size="30" text-anchor="middle" ${hand} fill="#2a2440">OUR TOWN</text>
  <text x="400" y="84" font-size="14" text-anchor="middle" ${hand} fill="#6a5a4a">by R + W, aged 9 and 6</text>
  <g transform="translate(704,500)">
    <circle r="26" fill="none" stroke="#2a2440" stroke-width="2"/>
    <path d="M0 -22 L5 0 L0 22 L-5 0 Z" fill="#2a2440"/>
    <text y="-30" font-size="13" text-anchor="middle" ${hand} fill="#2a2440">N</text>
  </g>
  ${finish()}`;
}

// ---------------------------------------------------------------- the station

function stationArt(g) {
  return `${DEFS}
  <rect width="800" height="600" fill="url(#tSky)"/>
  <!-- distant town on the hill -->
  <path d="M0 300 Q200 230 420 260 Q600 280 800 220 V360 H0 Z" fill="#a8b88a"/>
  <g fill="#c8a882">
    <rect x="300" y="236" width="30" height="26"/><rect x="336" y="244" width="40" height="22"/><rect x="384" y="238" width="24" height="28"/>
    <rect x="520" y="226" width="34" height="34"/><rect x="560" y="236" width="26" height="24"/>
  </g>
  <g fill="#9a6a4a"><path d="M296 236 l19 -14 l19 14 Z"/><path d="M380 238 l16 -12 l16 12 Z"/><path d="M516 226 l21 -14 l21 14 Z"/></g>
  <rect x="664" y="150" width="26" height="90" fill="#8a6a54"/><path d="M660 150 l17 -26 l17 26 Z" fill="#5a4a3a"/>
  <circle cx="677" cy="170" r="8" fill="#f4ecd8"/><path d="M677 170 V164 M677 170 H681" stroke="#2a2440" stroke-width="1.5"/>
  <!-- canopy -->
  <rect x="0" y="0" width="800" height="46" fill="#3e5a4a"/>
  <path d="M0 46 ${Array.from({ length: 21 }, (_, i) => `l20 14 l20 -14`).join(' ')}" fill="#3e5a4a"/>
  ${[90, 330, 570].map(x => `<rect x="${x}" y="46" width="10" height="330" fill="#2e4a3a"/>`).join('')}
  <!-- platform -->
  <rect x="0" y="376" width="800" height="224" fill="#b0a08a"/>
  <rect x="0" y="376" width="800" height="12" fill="#e8d8a0"/>
  <rect x="0" y="388" width="800" height="4" fill="#8a7a64"/>
  <path d="M0 470 H800" stroke="#9a8a74" stroke-width="2"/>
  <!-- station sign -->
  <rect x="150" y="92" width="220" height="56" rx="4" fill="#f4ecd8" stroke="#2e4a3a" stroke-width="5"/>
  <text x="260" y="129" font-size="22" text-anchor="middle" ${serif} letter-spacing="1" fill="#2e4a3a">LITTLE WENDING</text>
  <!-- welcome board -->
  <rect x="420" y="96" width="132" height="96" fill="#3e5a4a" stroke="#2a3a30" stroke-width="4"/>
  <rect x="428" y="104" width="116" height="80" fill="#efe4c8"/>
  <text x="486" y="128" font-size="13" text-anchor="middle" ${serif} fill="#2a2440">Welcome to</text>
  <text x="486" y="146" font-size="13" text-anchor="middle" ${serif} fill="#2a2440">Little Wending</text>
  <text x="497" y="172" font-size="13" text-anchor="end" ${serif} fill="#2a2440">pop. 2,41</text>
  <text x="498" y="172" font-size="13" ${serif} fill="#2a2440">3</text>
  <path d="M496 174 l10 -13" stroke="${INK}" stroke-width="1.6"/>
  <text x="506" y="162" font-size="12" ${hand} fill="${INK}">2</text>
  <!-- bench -->
  <rect x="200" y="320" width="150" height="10" fill="#7a4a2a"/><rect x="200" y="300" width="150" height="10" fill="#7a4a2a"/>
  <rect x="206" y="330" width="8" height="46" fill="#2e4a3a"/><rect x="336" y="330" width="8" height="46" fill="#2e4a3a"/>
  <!-- your suitcase -->
  <rect x="236" y="398" width="86" height="60" rx="5" fill="#8a4a3a" stroke="#4a2418" stroke-width="2"/>
  <path d="M266 398 v-8 h26 v8" stroke="#4a2418" stroke-width="4" fill="none"/>
  <!-- ticket office -->
  <rect x="604" y="230" width="196" height="146" fill="#e8dcc0"/>
  <rect x="604" y="230" width="196" height="12" fill="#3e5a4a"/>
  <rect x="636" y="268" width="80" height="62" fill="#5a6a6a"/><rect x="636" y="268" width="80" height="62" fill="#fff" opacity=".18"/>
  <rect x="636" y="330" width="80" height="8" fill="#7a4a2a"/>
  <rect x="650" y="292" width="52" height="20" fill="#f4ecd8"/><text x="676" y="306" font-size="11" text-anchor="middle" ${serif} fill="#2a2440">CLOSED</text>
  <text x="676" y="260" font-size="11" text-anchor="middle" ${serif} fill="#2e4a3a">TICKETS</text>
  <!-- the way into town -->
  <rect x="736" y="262" width="56" height="114" fill="#3a2a1a"/>
  <rect x="742" y="268" width="44" height="108" fill="#f4dca0" opacity=".85"/>
  <text x="764" y="256" font-size="11" text-anchor="middle" ${serif} fill="#2e4a3a">TOWN →</text>
  ${finish()}`;
}

// ---------------------------------------------------------------- hotspots

function mapHotspots() {
  return PLACES.map((p, i) => ({
    id: `map-${p.id}`, label: g => reached(g, i) ? p.name : 'Faded away',
    circle: [p.x, p.y, 34],
    sparkle: g => reached(g, i) && !g.flag(`visited:${p.id}`) && i > 0,
    click: g => {
      g.set('mapAnim', null);
      if (!reached(g, i)) return g.say('The street that went there has faded off the paper. You can almost remember it.');
      if (!p.scene) return g.say(`${p.name}. Not built yet: the town ends here for now. Thank you for playing this far!`, 6000);
      g.set(`visited:${p.id}`);
      g.go(p.scene);
    },
  }));
}

export default {
  id: 'r0',
  name: 'Little Wending',
  setup: g => {
    g.give('map');
    g.note('start', 'Came home to Little Wending after twelve years away.');
  },
  hints: [
    { when: g => !g.flag('mapSeen'), text: 'The way into town is at the end of the platform.' },
    { text: 'Your map shows which streets still lead somewhere.' },
  ],
  scenes: {
    'r0-station': {
      room: 'r0',
      art: stationArt,
      hotspots: [
        { id: 'sign', label: 'Station sign', rect: [150, 92, 220, 56],
          say: 'LITTLE WENDING. You grew up here. The paint is newer than you remember.' },
        { id: 'welcome', label: 'Welcome board', rect: [420, 96, 132, 96],
          click: g => {
            g.note('pop', 'The welcome board: <i>pop. 2,413</i>, with the 3 changed to a 2 in <b>green ink</b>. Someone corrected it neatly.');
            g.say('"Welcome to Little Wending. pop. 2,413." Someone has changed the 3 to a 2, neatly, in green ink. One fewer.', 6000);
          } },
        { id: 'bench', label: 'Bench', rect: [196, 296, 160, 80],
          say: 'You used to wait here for the bus to school, with Wren swinging their legs beside you.' },
        { id: 'suitcase', label: 'Your suitcase', rect: [230, 388, 98, 74],
          say: 'Everything you brought home fits in one case. You thought you would need less.' },
        { id: 'ticket', label: 'Ticket office', rect: [624, 244, 104, 100],
          say: 'CLOSED. A face behind the glass looks right through you, then turns a page.' },
        { id: 'tower', label: 'Clock tower', rect: [656, 120, 42, 120],
          say: 'The clock tower on the hill. Its hands stand still at twenty past four.' },
        { id: 'town', label: 'Into town', rect: [734, 250, 62, 128], sparkle: true,
          click: g => openMap(g) },
      ],
    },

    'r0-map': {
      room: 'r0',
      art: mapArt,
      nav: { back: g => g.get('mapReturn') ?? 'r0-station' },
      enter: g => {
        if (g.flag('mapSeen')) return;
        g.set('mapSeen');
        g.note('map', 'Our map of the town, drawn by me and <b>Wren</b> when we were small. The streets are fading off the paper. Only Station Road still leads somewhere.');
        g.say('You unfold the map you and Wren drew when you were nine and six. Most of the streets have faded off the paper, as if they had never been drawn. Only Station Road is left: it leads to the post office.', 9000);
      },
      hotspots: mapHotspots(),
    },
  },
};

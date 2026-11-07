// ROOM 2 — Chemistry Lab
//
// Puzzle chain:
//   microscope slide shows "5 · 88 · 49"
//   + periodic table poster   -> B · Ra · In  = password BRAIN
//   fume hood terminal        -> sash unlocks, reagents reachable (east)
//   glassware shelf           -> empty flask (south)
//   lab notebook              -> C-7 solvent recipe (west)
//   flask on fume hood        -> mixer: 2 copper sulfate, 1 potassium chromate, then acid LAST
//   solvent on vent bolts     -> vent opens: keycard + photo piece #2 (west)
//   keycard on reader         -> exit to room 3 (north)
//
// Difficulty: HARD drops the terminal's password hint, writes the recipe in
// chemical formulas, and removes the "nobody checks the vents" diary entry.

import { room, closeup, deskSurface, finish, door, DEFS, doorSign } from '../art/common.js';
import { findPhotoPiece } from '../items.js';

// ---------------------------------------------------------------- periodic table

const SYMBOLS = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn ' +
  'Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm ' +
  'Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu ' +
  'Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split(' ');

/** [row, col] in the standard layout. Rows 9–10 are the lanthanide/actinide strips. */
function elementPos(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [1, 18];
  if (z <= 4) return [2, z - 2];
  if (z <= 10) return [2, z + 8];
  if (z <= 12) return [3, z - 10];
  if (z <= 18) return [3, z];
  if (z <= 36) return [4, z - 18];
  if (z <= 54) return [5, z - 36];
  if (z <= 56) return [6, z - 54];
  if (z <= 71) return [9, z - 53];
  if (z <= 86) return [6, z - 68];
  if (z <= 88) return [7, z - 86];
  if (z <= 103) return [10, z - 85];
  return [7, z - 100];
}

function cellColor(z, row, col) {
  if (z === 1) return '#9bb8d0';
  if (row >= 9) return '#c09ab8';
  if (col <= 2) return '#d99a78';
  if (col <= 12) return '#d2bd7a';
  if (col === 18) return '#93a8cf';
  return '#88bba2';
}

function periodicTable({ x0, y0, w, h, gap = 2, labels = true }) {
  let out = '';
  SYMBOLS.forEach((sym, i) => {
    const z = i + 1;
    const [row, col] = elementPos(z);
    const x = x0 + (col - 1) * w;
    const y = y0 + (row <= 7 ? (row - 1) * h : 7 * h + h * 0.35 + (row - 9) * h);
    out += `<rect x="${x}" y="${y}" width="${w - gap}" height="${h - gap}" fill="${cellColor(z, row, col)}"/>`;
    if (labels) out += `
      <text x="${x + 3}" y="${y + 11}" font-size="9" fill="#2a2a2a" font-family="Arial, sans-serif">${z}</text>
      <text x="${x + (w - gap) / 2}" y="${y + h * 0.72}" font-size="17" text-anchor="middle" font-weight="bold" fill="#1a1a1a" font-family="Arial, sans-serif">${sym}</text>`;
  });
  return out;
}

// ---------------------------------------------------------------- art

function cardReader(open) {
  return `
  <g transform="translate(505,285)">
    <rect width="46" height="68" rx="4" fill="#1b201e" stroke="#4d5551" stroke-width="2"/>
    <rect x="8" y="12" width="30" height="5" fill="#000"/>
    <rect x="12" y="26" width="22" height="14" fill="#2a6ab0" opacity=".6"/>
    <circle cx="23" cy="54" r="4" fill="${open ? '#3f3' : '#f33'}" filter="url(#glow)"/>
  </g>`;
}

const north = g => {
  const open = g.flag('door2Open');
  return room() + `
  <rect x="78" y="92" width="226" height="156" fill="#000" opacity=".35" transform="translate(5,6)"/>
  <rect x="78" y="92" width="226" height="156" fill="#e4e0d2"/>
  <text x="191" y="108" font-size="9" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#333">PERIODIC TABLE OF THE ELEMENTS</text>
  ${periodicTable({ x0: 92, y0: 116, w: 11, h: 12, gap: 1, labels: false })}
  <ellipse cx="270" cy="230" rx="24" ry="12" fill="#7a5a30" opacity=".35"/>

  ${doorSign('SERVERS →', 'bolt', { y: 96 })}
  ${door({ open, label: 'C-12' })}
  ${cardReader(open)}

  <circle cx="640" cy="150" r="5" fill="#555"/>
  <path d="M618 158 L662 158 L694 330 L652 342 L641 232 L630 342 L588 330 Z" fill="#d8dcd4"/>
  <path d="M618 158 L641 200 L662 158" fill="none" stroke="#aab0a6" stroke-width="3"/>
  <path d="M641 200 V330" stroke="#b5bbb1" stroke-width="2"/>
  <rect x="650" y="216" width="22" height="12" fill="#2a6ab0"/>
  <path d="M600 300 q10 6 20 0" stroke="#8a7a5a" stroke-width="3" fill="none" opacity=".5"/>
  ` + finish();
};

function bottle(x, color, label) {
  return `
  <g transform="translate(${x},0)">
    <rect x="12" y="256" width="12" height="16" fill="#cfd8d4" opacity=".6"/>
    <rect x="10" y="250" width="16" height="8" rx="2" fill="#2a2f2c"/>
    <rect x="0" y="270" width="36" height="50" rx="5" fill="${color}" opacity=".85"/>
    <rect x="4" y="282" width="28" height="18" fill="#efe9d6"/>
    <text x="18" y="294" font-size="7" text-anchor="middle" font-family="Arial, sans-serif" fill="#333">${label}</text>
  </g>`;
}

const east = g => {
  const open = g.flag('hoodOpen');
  return room() + `
  <rect x="350" y="38" width="100" height="54" fill="#4f5753"/>
  <rect x="340" y="80" width="120" height="12" fill="#3c4340"/>
  <rect x="190" y="90" width="420" height="380" fill="#b9beb6" stroke="#5a5f58" stroke-width="3"/>
  <rect x="190" y="90" width="420" height="50" fill="#a3a89f"/>
  <text x="250" y="121" font-size="15" font-family="Arial, sans-serif" font-weight="bold" fill="#4a4f48">FUME HOOD 3</text>
  <g transform="translate(470,104)">
    <rect width="120" height="24" rx="3" fill="#2a2f2c"/>
    <circle cx="14" cy="12" r="5" fill="${open ? '#3f3' : '#f33'}" filter="url(#glow)"/>
    <text x="26" y="16" font-size="10" font-family="Arial, sans-serif" fill="#cfd8d4">${open ? 'SASH OPEN' : 'SASH LOCKED'}</text>
  </g>
  <rect x="215" y="150" width="370" height="180" fill="#1c2421"/>
  <rect x="215" y="150" width="370" height="10" fill="#000" opacity=".4"/>
  ${bottle(255, '#2f6fd0', 'CuSO₄')}
  ${bottle(325, '#e2c22a', 'K₂CrO₄')}
  ${bottle(395, '#d6e6e2', 'HCl')}
  ${bottle(465, '#e05aa8', 'PHTH')}
  <rect x="215" y="320" width="370" height="14" fill="#2b2f2d"/>
  ${open ? `
    <rect x="215" y="150" width="370" height="26" fill="#9ec3c0" opacity=".3"/>
    <rect x="212" y="174" width="376" height="8" fill="#7d837b"/>
  ` : `
    <rect x="215" y="150" width="370" height="180" fill="#9ec3c0" opacity=".18"/>
    <polygon points="240,155 300,155 230,320 215,320" fill="#fff" opacity=".07"/>
    <polygon points="420,155 450,155 380,320 350,320" fill="#fff" opacity=".05"/>
    <rect x="212" y="322" width="376" height="10" fill="#7d837b"/>
  `}
  <rect x="200" y="345" width="400" height="120" fill="#9da29a" stroke="#5a5f58" stroke-width="2"/>
  <line x1="400" y1="345" x2="400" y2="465" stroke="#5a5f58" stroke-width="2"/>
  <rect x="380" y="395" width="8" height="24" fill="#4a4f48"/><rect x="412" y="395" width="8" height="24" fill="#4a4f48"/>
  <rect x="260" y="360" width="80" height="20" fill="#e3b81f"/>
  <text x="300" y="375" font-size="12" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">ACIDS</text>
  <rect x="460" y="360" width="80" height="20" fill="#2a6ab0"/>
  <text x="500" y="375" font-size="12" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#eee">BASES</text>

  <rect x="610" y="240" width="18" height="8" fill="#555"/>
  <rect x="625" y="198" width="124" height="94" rx="5" fill="#222" stroke="#444" stroke-width="2"/>
  <rect x="633" y="206" width="108" height="70" fill="#06140a"/>
  <g font-family="Courier New, monospace" font-size="10" fill="#5f5" filter="url(#glow)">
    <text x="639" y="222">HOOD CTRL v2.3</text>
    <text x="639" y="240">SASH: ${open ? 'OPEN' : 'LOCKED'}</text>
    <text x="639" y="258">${open ? '' : 'PASSWORD?_'}</text>
  </g>
  <rect x="680" y="292" width="16" height="30" fill="#333"/>
  ` + finish();
};

const south = g => {
  const flask = !g.flag('took:flask');
  return room() + `
  ${doorSign('QUARANTINE', 'bio', { bg: '#3a2a1a', fg: '#e3b81f' })}
  ${door({ open: true })}

  <rect x="66" y="180" width="210" height="8" fill="#5e4a38"/>
  <rect x="66" y="260" width="210" height="8" fill="#5e4a38"/>
  <path d="M80 188 l0 14 l14 -14 Z M250 188 l0 14 l14 -14 Z M80 268 l0 14 l14 -14 Z M250 268 l0 14 l14 -14 Z" fill="#3a2d22"/>
  <g fill="#cfd8d4" opacity=".55">
    <path d="M90 180 v-36 h28 v36 Z"/>
    <path d="M140 180 v-22 l8 -10 l6 8 l10 -12 v36 Z"/>
    <rect x="190" y="150" width="60" height="6" fill="#5e4a38"/>
    <rect x="196" y="140" width="6" height="40"/><rect x="212" y="146" width="6" height="34"/><rect x="228" y="136" width="6" height="44"/>
  </g>
  <g fill="#cfd8d4" opacity=".5">
    <path d="M90 260 l6 -24 l10 8 l6 -14 l8 30 Z"/>
    <path d="M128 260 q2 -18 14 -22 q14 6 12 22 Z"/>
  </g>
  ${flask ? `
    <g transform="translate(194,206)">
      <path d="M14 0 h14 v18 l16 28 q2 8 -6 8 h-38 q-8 0 -6 -8 l16 -28 Z" fill="#cfd8d4" opacity=".35" stroke="#e8f0ec" stroke-width="2"/>
      <rect x="11" y="-4" width="20" height="5" rx="2" fill="#e8f0ec"/>
      <path d="M8 34 l6 -10" stroke="#fff" stroke-width="2" opacity=".6"/>
    </g>` : ''}
  <g fill="#cfd8d4" opacity=".45">
    <path d="M120 480 l10 -6 l4 8 Z"/><path d="M160 490 l14 -4 l-4 8 Z"/><path d="M200 478 l6 -8 l6 9 Z"/>
  </g>

  <rect x="600" y="58" width="130" height="30" fill="#1d7a3a"/>
  <text x="665" y="72" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#fff">EMERGENCY</text>
  <text x="665" y="84" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#fff">SHOWER</text>
  <rect x="660" y="38" width="10" height="110" fill="#6b7a70"/>
  <ellipse cx="665" cy="152" rx="34" ry="9" fill="#7d8c82"/>
  <path d="M690 150 V230" stroke="#999" stroke-width="2" stroke-dasharray="3 2"/>
  <polygon points="682,230 698,230 690,248" fill="#1d7a3a"/>
  <rect x="610" y="440" width="110" height="10" fill="#555" opacity=".6"/>
  ` + finish();
};

const west = g => {
  const vent = g.flag('ventOpen');
  const card = !g.flag('took:keycard');
  const photo = !g.flag('photo2');
  const bolt = (x, y) => `
    <circle cx="${x}" cy="${y}" r="9" fill="#6b5a3a"/>
    <path d="M${x - 10} ${y + 2} q4 -12 12 -8 q10 2 8 12 q-6 6 -14 4 Z" fill="#a05a22" opacity=".85"/>
    <circle cx="${x + 4}" cy="${y + 6}" r="4" fill="#3a7a5a" opacity=".7"/>`;
  return room() + `
  ${vent ? `
    <rect x="110" y="70" width="160" height="100" fill="#050706" stroke="#2a312e" stroke-width="4"/>
    <polygon points="114,74 266,74 236,96 144,96" fill="#121614"/>
    <polygon points="114,166 266,166 236,144 144,144" fill="#0d100f"/>
    ${card ? `<g transform="translate(144,128) rotate(-8)">
      <rect width="44" height="28" rx="3" fill="#e9eef0"/><rect y="5" width="44" height="6" fill="#2a6ab0"/></g>` : ''}
    ${photo ? `<g transform="translate(212,126) rotate(10)">
      <rect width="34" height="30" fill="#e9e1c8"/><rect x="3" y="3" width="28" height="24" fill="#a08a64"/></g>` : ''}
    <g transform="translate(90,478) skewX(-30)">
      <rect width="150" height="16" fill="#2a312e" stroke="#4d5652" stroke-width="2"/>
    </g>
  ` : `
    <rect x="110" y="70" width="160" height="100" fill="#2a312e" stroke="#4d5652" stroke-width="4"/>
    ${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="124" y="${82 + i * 11}" width="132" height="5" fill="#0c0f0e"/>`).join('')}
    ${bolt(120, 80)}${bolt(260, 80)}${bolt(120, 160)}${bolt(260, 160)}
    <path d="M120 170 q2 30 -4 60" stroke="#a05a22" stroke-width="3" opacity=".4" fill="none"/>
  `}

  <rect x="350" y="88" width="110" height="88" fill="#3a2a1a"/>
  <rect x="358" y="96" width="94" height="72" fill="#141917"/>
  <path d="M372 104 l20 30 l-12 22 M410 110 l16 24 l20 -6" stroke="#9aa7a1" stroke-width="1.5" fill="none"/>

  <rect x="140" y="320" width="560" height="16" fill="#1d1f1e"/>
  <rect x="150" y="336" width="540" height="134" fill="#6c7a72"/>
  ${[150, 330, 510].map(x => `<rect x="${x + 6}" y="346" width="168" height="114" fill="none" stroke="#4e5a53" stroke-width="3"/>
    <rect x="${x + 80}" y="356" width="20" height="6" rx="2" fill="#3c4640"/>`).join('')}

  <g transform="translate(250,298)">
    <polygon points="0,22 70,16 70,0 6,6" fill="#efe9d6"/>
    <polygon points="70,16 140,22 134,6 70,0" fill="#e6dfca"/>
    <path d="M14 10 l46 -4 M14 14 l46 -4 M80 6 l44 4 M80 10 l44 4" stroke="#777" stroke-width="1"/>
    <polygon points="0,22 140,22 140,25 0,25" fill="#5a3a2a"/>
  </g>

  <g transform="translate(410,268)">
    <rect x="0" y="46" width="34" height="8" rx="2" fill="#2b2f33"/>
    <rect x="13" y="10" width="8" height="36" fill="#5a6066"/>
    <path d="M30 50 q30 -6 40 20" stroke="#c84a2a" stroke-width="4" fill="none"/>
  </g>

  <g transform="translate(510,220)">
    <rect x="0" y="86" width="70" height="14" rx="3" fill="#2b2f33"/>
    <path d="M52 86 Q64 50 46 18" stroke="#2b2f33" stroke-width="12" fill="none"/>
    <rect x="8" y="60" width="46" height="6" fill="#3c4247"/>
    <rect x="16" y="57" width="30" height="3" fill="#cfe8e4"/>
    <rect x="24" y="34" width="10" height="24" fill="#4a5056"/>
    <g transform="rotate(-25 30 20)">
      <rect x="22" y="-6" width="14" height="38" fill="#3c4247"/>
      <rect x="20" y="-12" width="18" height="8" fill="#22262a"/>
    </g>
  </g>
  ` + finish();
};

const ptableCloseup = () => closeup('#33423c') + `
  <rect x="31" y="56" width="738" height="488" fill="#000" opacity=".4"/>
  <rect x="25" y="50" width="750" height="490" fill="#e4e0d2"/>
  <text x="400" y="88" font-size="22" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#333">PERIODIC TABLE OF THE ELEMENTS</text>
  ${periodicTable({ x0: 40, y0: 104, w: 40, h: 44 })}
  <ellipse cx="320" cy="262" rx="52" ry="26" fill="#7a5a30" opacity=".3"/>
  <ellipse cx="660" cy="500" rx="70" ry="18" fill="#7a5a30" opacity=".25"/>
  <polygon points="775,50 775,96 730,50" fill="#33423c"/>
  ` + finish({ flicker: false });

function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }

const microscope = () => {
  const r = rng(11);
  let cells = '';
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 220;
    const x = 400 + Math.cos(a) * d, y = 300 + Math.sin(a) * d, s = 14 + r() * 22;
    cells += `<ellipse cx="${x}" cy="${y}" rx="${s}" ry="${s * (0.7 + r() * 0.3)}" fill="#d9a0b4" opacity=".55" transform="rotate(${r() * 180} ${x} ${y})"/>
              <circle cx="${x + 2}" cy="${y - 1}" r="${s * 0.3}" fill="#8a4a7a" opacity=".6"/>`;
  }
  return `${DEFS}
  <defs>
    <radialGradient id="scopeG"><stop offset="0" stop-color="#f6f2dc"/><stop offset=".8" stop-color="#ddd6ac"/><stop offset="1" stop-color="#8a8460"/></radialGradient>
    <clipPath id="scopeClip"><circle cx="400" cy="300" r="250"/></clipPath>
    <filter id="soft"><feGaussianBlur stdDeviation=".8"/></filter>
  </defs>
  <rect width="800" height="600" fill="#000"/>
  <g clip-path="url(#scopeClip)">
    <circle cx="400" cy="300" r="250" fill="url(#scopeG)"/>
    ${cells}
    <g filter="url(#soft)" fill="#1f3a8a" font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive" opacity=".85">
      <text x="400" y="320" font-size="96" text-anchor="middle" transform="rotate(-6 400 300)">5 · 88 · 49</text>
    </g>
  </g>
  <circle cx="400" cy="300" r="250" fill="none" stroke="#000" stroke-width="40" opacity=".55"/>
  <circle cx="400" cy="300" r="268" fill="none" stroke="#111" stroke-width="6"/>`;
};

const notebook = g => {
  const hard = g.difficulty === 'hard';
  const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
  const left = [
    ['Day 11', true],
    ['The C-7 solvent works. It ate', false],
    ['through a seized bolt in', false],
    ['seconds. Keep it AWAY from', false],
    ['the subjects.', false],
    ['', false],
    ...(hard ? [] : [['Day 12', true], ['Moved my keycard somewhere', false], ['safe. Nobody checks the vents.', false], ['', false]]),
    ['Day 13', true],
    ['Hood password changed again.', false],
    ["Hint's under the scope, as", false],
    ['always. Old habits.', false],
  ];
  const recipe = hard
    ? ['2 × CuSO₄', '1 × K₂CrO₄', '1 × HCl']
    : ['2 measures copper sulfate', '1 measure potassium chromate', '1 measure hydrochloric acid'];
  return deskSurface() + `
  <g transform="rotate(-2 400 300)">
    <rect x="76" y="58" width="660" height="500" rx="8" fill="#000" opacity=".45"/>
    <rect x="70" y="50" width="660" height="500" rx="8" fill="#5a3a2a"/>
    <rect x="86" y="62" width="312" height="476" fill="#efe9d6"/>
    <rect x="402" y="62" width="312" height="476" fill="#ece5cf"/>
    <rect x="396" y="62" width="8" height="476" fill="#000" opacity=".15"/>
    ${Array.from({ length: 17 }, (_, i) => `<line x1="96" y1="${110 + i * 25}" x2="704" y2="${110 + i * 25}" stroke="#b9c4d8" stroke-width="1"/>`).join('')}
    <g fill="#1f2a5a" ${hand} font-size="16">
      ${left.map(([t, b], i) => `<text x="104" y="${105 + i * 25}" ${b ? 'font-weight="bold" text-decoration="underline"' : ''}>${t}</text>`).join('')}
    </g>
    <g fill="#1f2a5a" ${hand}>
      <text x="420" y="105" font-size="22" font-weight="bold">C-7 SOLVENT</text>
      <text x="420" y="130" font-size="14">(for corrosion. DON'T improvise)</text>
      ${recipe.map((t, i) => `<text x="430" y="${180 + i * 30}" font-size="17">${t}</text>`).join('')}
      <text x="420" y="300" font-size="19" fill="#a3221c" font-weight="bold">ACID GOES IN LAST.</text>
      <text x="420" y="325" font-size="19" fill="#a3221c" font-weight="bold">ALWAYS.</text>
      <path d="M560 380 q40 -30 80 0 t40 30" stroke="#1f2a5a" stroke-width="2" fill="none"/>
      <text x="430" y="430" font-size="14">Swirl gently. Should turn</text>
      <text x="430" y="455" font-size="14">a bright, nasty green.</text>
    </g>
  </g>` + finish({ flicker: false });
};

// ---------------------------------------------------------------- scenes

export default {
  id: 'r2',
  name: 'Room 2 · Chemistry Lab',
  hints: [
    { when: g => !g.flag('hoodOpen'), text: g => g.difficulty === 'easy'
      ? 'The fume hood terminal wants a password. Look through the microscope: those numbers are atomic numbers. Find them on the periodic table.'
      : 'The fume hood terminal wants a password.' },
    { when: g => !g.flag('took:flask') && !g.has('solvent') && !g.flag('ventOpen'), text: "You'll need something to mix chemicals in. Check the glassware shelf by the door." },
    { when: g => !g.solved('r2-mixer'), text: "Read Dr. Voss's notebook on the bench, then use the flask on the open fume hood." },
    { when: g => !g.flag('ventOpen'), text: 'Those corroded vent bolts look like a job for the C-7 solvent.' },
    { when: g => !g.flag('door2Open'), text: 'Use the keycard on the reader next to the exit door.' },
    { when: g => !g.flag('photo2'), text: 'There was something else inside the vent...' },
  ],

  scenes: {
    'r2-north': {
      room: 'r2',
      art: north,
      nav: { left: 'r2-west', right: 'r2-east' },
      hotspots: [
        { id: 'ptable', label: 'Periodic table', rect: [78, 92, 226, 156], go: 'r2-ptable', sparkle: true },
        { id: 'door', label: 'Door C-12', rect: [320, 150, 160, 320],
          when: g => !g.flag('door2Open'),
          say: 'Locked. The card reader beside it glows red.',
          use: { keycard: g => g.say('Try the card reader beside the door.') } },
        { id: 'exit', label: 'To the server room', rect: [320, 150, 160, 320],
          when: g => g.flag('door2Open'), go: 'r3-north' },
        { id: 'reader', label: 'Card reader', rect: [500, 280, 56, 78],
          when: g => !g.flag('door2Open'), sparkle: g => g.has('keycard'),
          say: 'A keycard reader. "LEVEL 3 ACCESS REQUIRED".',
          use: {
            keycard: g => {
              g.take('keycard');
              g.set('door2Open');
              g.say('Beep. The light turns green and door C-12 hisses open.');
            },
          } },
        { id: 'coat', label: 'Lab coat', rect: [586, 150, 110, 194],
          say: 'A lab coat with a name tag: "Dr. E. VOSS". The pockets are empty.' },
      ],
    },

    'r2-east': {
      room: 'r2',
      art: east,
      nav: { left: 'r2-north', right: 'r2-south' },
      hotspots: [
        { id: 'terminal', label: 'Hood terminal', rect: [622, 195, 130, 100],
          sparkle: g => !g.flag('hoodOpen'),
          click: g => g.flag('hoodOpen')
            ? g.say('HOOD CTRL: SASH OPEN. Have a nice day.')
            : g.puzzle('r2-terminal') },
        { id: 'hood', label: 'Fume hood', rect: [215, 150, 370, 184],
          sparkle: g => g.flag('hoodOpen') && g.has('flask'),
          click: g => {
            if (!g.flag('hoodOpen')) return g.say('Reagent bottles sit behind the glass, but the sash is locked.');
            if (g.solved('r2-mixer')) return g.say("You've already mixed what you need.");
            if (g.has('flask')) return g.puzzle('r2-mixer');
            g.say("Copper sulfate, potassium chromate, hydrochloric acid, phenolphthalein. You'd need something to mix them in.");
          },
          use: {
            flask: g => g.flag('hoodOpen')
              ? g.puzzle('r2-mixer')
              : g.say("The sash is locked. You can't reach the bottles."),
          } },
        { id: 'cabinet', label: 'Chemical cabinet', rect: [200, 345, 400, 120],
          say: 'ACIDS and BASES. Both doors are rusted shut, and frankly that seems for the best.' },
        { id: 'duct', label: 'Exhaust duct', rect: [340, 38, 120, 54],
          say: "The extractor fan is dead silent. Whatever's in here stays in here." },
      ],
    },

    'r2-south': {
      room: 'r2',
      art: south,
      nav: { left: 'r2-east', right: 'r2-west' },
      hotspots: [
        { id: 'back', label: 'Back to the quarantine ward', rect: [320, 150, 160, 320], go: 'r1-north' },
        { id: 'shelf', label: 'Glassware shelf', rect: [66, 130, 210, 140],
          say: g => g.flag('took:flask')
            ? 'Nothing left but broken glass.'
            : 'Most of the glassware is smashed... but not all of it.' },
        { id: 'flask', label: 'Flask', rect: [184, 198, 60, 64], take: 'flask',
          say: 'An intact Erlenmeyer flask. You carefully take it.' },
        { id: 'shower', label: 'Emergency shower', rect: [600, 38, 130, 214],
          say: 'You pull the handle. A dry gurgle from the pipes... nothing.' },
        { id: 'shards', label: 'Broken glass', rect: [110, 466, 110, 30],
          say: "Shards everywhere. Someone left in a hurry, or didn't leave at all." },
      ],
    },

    'r2-west': {
      room: 'r2',
      art: west,
      nav: { left: 'r2-south', right: 'r2-north' },
      hotspots: [
        { id: 'vent', label: 'Vent grate', rect: [104, 64, 172, 112],
          when: g => !g.flag('ventOpen'), sparkle: g => g.has('solvent'),
          say: 'The four bolts are corroded into crusty lumps. They will not budge.',
          use: {
            solvent: g => {
              g.take('solvent');
              g.set('ventOpen');
              g.say('You drizzle the green solvent over the bolts. They fizz, foam... and crumble. The grate clatters to the floor!');
            },
          } },
        { id: 'vent-inside', label: 'Vent', rect: [110, 70, 160, 100],
          when: g => g.flag('ventOpen'),
          say: 'A cramped duct. Far too small to crawl through.' },
        { id: 'keycard', label: 'Keycard', rect: [138, 118, 58, 44], take: 'keycard',
          when: g => g.flag('ventOpen'),
          say: 'A keycard! "E. VOSS — LEVEL 3 ACCESS".' },
        { id: 'photo2', label: 'Photo scrap', rect: [204, 118, 50, 46],
          when: g => g.flag('ventOpen') && !g.flag('photo2'), sparkle: true,
          click: g => findPhotoPiece(g, 'photo2') },
        { id: 'frame', label: 'Picture frame', rect: [350, 88, 110, 88],
          say: 'An empty frame with smashed glass. Whatever photo was in here has been torn out.' },
        { id: 'notebook', label: 'Lab notebook', rect: [246, 290, 150, 38], go: 'r2-notebook', sparkle: true },
        { id: 'burner', label: 'Bunsen burner', rect: [404, 270, 50, 56],
          say: 'You turn the gas tap. Nothing. Probably for the best.' },
        { id: 'microscope', label: 'Microscope', rect: [500, 196, 92, 126], go: 'r2-microscope', sparkle: true },
      ],
    },

    'r2-ptable': { room: 'r2', art: ptableCloseup, nav: { back: 'r2-north' }, hotspots: [] },
    'r2-microscope': { room: 'r2', art: microscope, nav: { back: 'r2-west' }, hotspots: [] },
    'r2-notebook': { room: 'r2', art: notebook, nav: { back: 'r2-west' }, hotspots: [] },
  },

  puzzles: {
    'r2-terminal': {
      type: 'password',
      solution: 'BRAIN',
      config: g => ({
        lines: [
          'HELIX FUME HOOD CONTROL v2.3',
          'SASH LOCK ......... ENGAGED',
          '------------------------------',
          'ENTER PASSWORD:',
          ...(g.difficulty === 'hard' ? [] : ['(hint: elemental. under the scope, as always. E.V.)']),
        ],
      }),
      okText: 'ACCESS GRANTED. RELEASING SASH...',
      solve: g => {
        g.set('hoodOpen');
        g.say('With a pneumatic hiss, the fume hood sash slides up.');
      },
    },

    'r2-mixer': {
      type: 'mixer',
      prompt: 'Pour measures into the flask, then mix.',
      capacity: 6,
      resultColor: '#9be36a',
      bottles: [
        { id: 'cu', label: 'Copper sulfate', color: '#2f6fd0' },
        { id: 'k', label: 'Potassium chromate', color: '#e2c22a' },
        { id: 'hcl', label: 'Hydrochloric acid', color: '#d6e6e2' },
        { id: 'pp', label: 'Phenol&shy;phthalein', color: '#e05aa8' },
      ],
      check: seq => {
        const count = id => seq.filter(s => s === id).length;
        const right = seq.length === 4 && count('cu') === 2 && count('k') === 1 && count('hcl') === 1;
        if (right && seq[3] === 'hcl') return true;
        if (right) return 'It boils over with a violent hiss! You jump back. The acid was supposed to go in last.';
        if (seq.includes('pp')) return 'The mixture turns a lurid pink. Pretty, but useless. You pour it away.';
        return "The mixture turns a murky brown. That isn't it. You pour it away.";
      },
      solve: g => {
        g.take('flask');
        g.give('solvent');
        g.say('You swirl the flask. It fizzes and turns a bright, nasty green. C-7 solvent!');
      },
    },
  },
};

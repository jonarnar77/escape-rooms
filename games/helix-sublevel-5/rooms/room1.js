// ROOM 1 — Quarantine Ward (tutorial room)
//
// Puzzle chain:
//   pillow (east)        -> small key
//   small key + drawer   -> UV torch, no battery (west)
//   clipboard + pill tray -> cabinet combination 3-6-1 (blue, red, green)
//   cabinet (south)      -> battery
//   torch + battery      -> working UV torch
//   UV torch on poster   -> door code 2749 (north)
//   keypad               -> door opens -> room 2
//
// Planted for later: the wall clock is stopped at 3:15.
// Photo piece #1 is tucked behind the safety poster (close-up).
//
// Difficulty: on HARD the pill counts and door code are randomised each game
// and the handwritten "cabinet combo = the doses" note is missing.

import { room, closeup, deskSurface, finish, door, doorSign } from '../art/common.js';
import { findPhotoPiece } from '../items.js';

const DEFAULT_PILLS = { yellow: 4, red: 6, blue: 3, green: 1 };
const DEFAULT_CODE = '2749';
const pillsOf = g => g.get('r1Pills') ?? DEFAULT_PILLS;
const codeOf = g => g.get('r1Code') ?? DEFAULT_CODE;

function setup(g) {
  if (g.difficulty !== 'hard') return;
  const r = () => 1 + Math.floor(Math.random() * 7);
  g.set('r1Pills', { yellow: r(), red: r(), blue: r(), green: r() });
  g.set('r1Code', String(Math.floor(Math.random() * 10000)).padStart(4, '0'));
}

// ---------------------------------------------------------------- art

const posterSmall = `
  <g transform="translate(140,160) rotate(-2 60 80)">
    <rect x="4" y="5" width="120" height="160" fill="#000" opacity=".35"/>
    <rect width="120" height="160" fill="#c9c2a3"/>
    <rect x="6" y="6" width="108" height="28" fill="#a8322a"/>
    <text x="60" y="26" font-size="15" text-anchor="middle" fill="#f3ead0" font-family="Arial, sans-serif" font-weight="bold">SAFETY</text>
    <polygon points="60,46 98,114 22,114" fill="#e3b81f" stroke="#222" stroke-width="4" stroke-linejoin="round"/>
    <text x="60" y="106" font-size="44" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">!</text>
    <text x="60" y="134" font-size="9" text-anchor="middle" fill="#3a352a" font-family="Arial, sans-serif">REPORT ALL INCIDENTS</text>
    <text x="60" y="148" font-size="7" text-anchor="middle" fill="#6a6450" font-family="Arial, sans-serif">HELIX BIOLABS · SUBLEVEL 5</text>
    <polygon points="120,0 120,22 100,0" fill="#2c3934"/>
  </g>`;

function keypadPanel(open) {
  let keys = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++)
    keys += `<rect x="${8 + c * 12}" y="${26 + r * 10}" width="9" height="7" rx="1" fill="#3e4542"/>`;
  return `
  <g transform="translate(505,280)">
    <rect width="50" height="72" rx="4" fill="#1b201e" stroke="#4d5551" stroke-width="2"/>
    <rect x="7" y="7" width="36" height="13" fill="#0a140d"/>
    <circle cx="25" cy="13.5" r="3" fill="${open ? '#3f3' : '#f33'}" filter="url(#glow)"/>
    ${keys}
  </g>`;
}

const north = g => {
  const open = g.flag('door1Open');
  return room() + posterSmall + `
  ${doorSign('CHEM LAB', 'flask')}
  ${door({ open, label: 'Q-07' })}
  ${keypadPanel(open)}
  <ellipse cx="610" cy="472" rx="40" ry="6" fill="#000" opacity=".4"/>
  <rect x="585" y="420" width="50" height="52" fill="#3a4a3f"/>
  <rect x="581" y="414" width="58" height="9" fill="#2c382f"/>
  ` + finish();
};

const east = () => room() + `
  <g transform="translate(130,90)">
    <rect width="100" height="64" fill="#2a312e" stroke="#4d5652" stroke-width="3"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="8" y="${8 + i * 9}" width="84" height="4" fill="#0c0f0e"/>`).join('')}
    ${[[5, 5], [95, 5], [5, 59], [95, 59]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#6b5a3a"/>`).join('')}
  </g>
  <g transform="translate(560,110)">
    <rect width="110" height="110" rx="6" fill="#d9b21c" stroke="#222" stroke-width="4"/>
    <g fill="none" stroke="#222" stroke-width="7">
      <circle cx="55" cy="38" r="15"/><circle cx="39" cy="66" r="15"/><circle cx="71" cy="66" r="15"/>
    </g>
    <circle cx="55" cy="56" r="7" fill="#222"/>
    <text x="55" y="101" font-size="11" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">BIOHAZARD</text>
  </g>
  <ellipse cx="410" cy="472" rx="250" ry="10" fill="#000" opacity=".45"/>
  <rect x="215" y="392" width="6" height="70" fill="#2d3330"/>
  <rect x="600" y="392" width="6" height="70" fill="#2d3330"/>
  <rect x="195" y="392" width="8" height="80" fill="#3c4340"/>
  <rect x="617" y="392" width="8" height="80" fill="#3c4340"/>
  <rect x="180" y="380" width="460" height="16" rx="3" fill="#5d6561"/>
  <rect x="185" y="348" width="450" height="36" rx="10" fill="#8a8775"/>
  <ellipse cx="460" cy="368" rx="40" ry="8" fill="#6c6448" opacity=".6"/>
  <path d="M390 352 Q440 334 500 350 Q560 362 600 345 Q630 342 636 356 L636 384 L390 384 Z" fill="#46546a"/>
  <path d="M420 362 Q470 352 520 368 M540 360 Q570 354 600 362" stroke="#36435a" stroke-width="3" fill="none"/>
  <rect x="200" y="322" width="120" height="38" rx="15" fill="#d4cfbf"/>
  <path d="M215 336 Q260 328 305 338" stroke="#b2ac99" stroke-width="2" fill="none"/>
  <ellipse cx="300" cy="462" rx="22" ry="7" fill="#4f4134"/>
  ` + finish();

const south = g => {
  const open = g.flag('cabinetOpen');
  const battery = !g.flag('took:battery');
  return room() + `
  <rect x="610" y="38" width="14" height="432" fill="#4f5753"/>
  <rect x="606" y="140" width="22" height="10" fill="#3c4340"/>
  <rect x="606" y="330" width="22" height="10" fill="#3c4340"/>
  <rect x="624" y="380" width="176" height="12" fill="#4f5753"/>
  <path d="M617 150 v80" stroke="#6b4a2a" stroke-width="3" opacity=".6"/>

  <rect x="320" y="110" width="160" height="190" fill="#59625d" stroke="#2c302e" stroke-width="4"/>
  ${open ? `
    <rect x="332" y="122" width="136" height="166" fill="#121715"/>
    <rect x="332" y="185" width="136" height="5" fill="#59625d"/>
    <rect x="332" y="240" width="136" height="5" fill="#59625d"/>
    <rect x="345" y="155" width="16" height="30" rx="3" fill="#9a6a2a" opacity=".8"/>
    <rect x="343" y="150" width="20" height="7" fill="#ccc"/>
    <rect x="372" y="161" width="14" height="24" rx="3" fill="#2e6b8a" opacity=".8"/>
    <rect x="350" y="233" width="52" height="6" rx="2" fill="#6aa"/>
    ${battery ? `
      <g transform="translate(414,206)">
        <rect width="14" height="30" rx="2" fill="#d8891c"/>
        <rect width="14" height="10" rx="2" fill="#222"/>
        <rect x="4" y="-3" width="6" height="4" fill="#bbb"/>
      </g>` : ''}
    <polygon points="320,110 268,128 268,282 320,300" fill="#59625d" stroke="#2c302e" stroke-width="3"/>
    <polygon points="314,124 276,137 276,272 314,286" fill="#33433f"/>
  ` : `
    <rect x="332" y="122" width="136" height="166" fill="#33433f"/>
    <polygon points="340,130 380,130 340,200" fill="#7a8e89" opacity=".25"/>
    <polygon points="420,280 460,200 460,280" fill="#7a8e89" opacity=".15"/>
    <path d="M400 150 L385 190 L405 215 L390 260 M405 215 L440 230" stroke="#8c9b96" stroke-width="1.3" fill="none"/>
    <rect x="474" y="190" width="16" height="10" fill="#777"/>
    <path d="M478 205 v-12 a8 8 0 0 1 16 0 v12" fill="none" stroke="#a5aaa7" stroke-width="4"/>
    <rect x="472" y="203" width="28" height="34" rx="4" fill="#6f7572" stroke="#3a3e3c" stroke-width="2"/>
    <rect x="477" y="212" width="18" height="16" fill="#2a2d2c"/>
    <path d="M483 212 v16 M489 212 v16" stroke="#888"/>
  `}

  <rect x="380" y="385" width="40" height="85" fill="#b4b8b1"/>
  <path d="M300 330 L500 330 L486 378 Q400 398 314 378 Z" fill="#d0d4cd" stroke="#8d918b" stroke-width="2"/>
  <ellipse cx="400" cy="340" rx="85" ry="9" fill="#9fa49c"/>
  <ellipse cx="402" cy="342" rx="10" ry="3" fill="#6a4a2a"/>
  <rect x="394" y="300" width="12" height="32" fill="#9ca29f"/>
  <rect x="394" y="300" width="34" height="9" rx="3" fill="#9ca29f"/>
  <rect x="374" y="304" width="14" height="6" rx="2" fill="#8a2a2a"/>
  <path d="M424 309 q2 10 0 22" stroke="#6a4a2a" stroke-width="2" opacity=".6" fill="none"/>
  ` + finish();
};

function clock(hour, minute) {
  let ticks = '';
  for (let i = 0; i < 12; i++) ticks += `<line y1="-30" y2="-25" transform="rotate(${i * 30})" stroke="#222" stroke-width="2"/>`;
  return `
  <g transform="translate(640,140)">
    <circle r="38" fill="#e5e1d3" stroke="#2a2f2c" stroke-width="6"/>
    ${ticks}
    <line y2="-19" transform="rotate(${(hour % 12 + minute / 60) * 30})" stroke="#111" stroke-width="4" stroke-linecap="round"/>
    <line y2="-28" transform="rotate(${minute * 6})" stroke="#111" stroke-width="2.5" stroke-linecap="round"/>
    <circle r="3" fill="#111"/>
    <path d="M-20 -25 L-5 0 L-12 22" stroke="#999" stroke-width="1" fill="none"/>
  </g>`;
}

const west = g => {
  const open = g.flag('drawerOpen');
  const torch = !g.flag('took:flashlight');
  const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
  return room() + `
  <rect x="160" y="80" width="340" height="172" fill="#2a2f2c"/>
  <rect x="166" y="86" width="328" height="158" fill="#d9d9cf"/>
  <text x="182" y="118" font-size="19" fill="#2a4a8a" ${hand}>DAY 14 — subjects responding??</text>
  <path d="M184 140 q20 -10 40 0 t40 0 t40 0 t40 0" stroke="#2a4a8a" stroke-width="2" fill="none"/>
  <text x="190" y="182" font-size="17" fill="#8a2a2a" ${hand}>DO NOT open Cryo B</text>
  <path d="M188 190 h170" stroke="#8a2a2a" stroke-width="2"/>
  <text x="330" y="225" font-size="14" fill="#555" ${hand}>H-5 → ??</text>
  <rect x="166" y="244" width="328" height="8" fill="#3a3f3c"/>
  ${clock(3, 15)}

  <rect x="160" y="318" width="480" height="18" fill="#5e4a38"/>
  <rect x="170" y="336" width="460" height="134" fill="#4a3a2c"/>
  <rect x="190" y="350" width="200" height="120" fill="#17120d"/>
  ${open ? `
    <rect x="420" y="352" width="190" height="46" fill="#120d09"/>
    <polygon points="410,372 620,372 634,420 396,420" fill="#3a2b20"/>
    <polygon points="418,376 612,376 624,414 406,414" fill="#211810"/>
    ${torch ? `
      <g transform="translate(452,386) rotate(-5)">
        <rect width="90" height="20" rx="4" fill="#3d4246"/>
        <path d="M90 -4 L116 -10 L116 30 L90 24 Z" fill="#555c61"/>
        <rect x="114" y="-10" width="6" height="40" fill="#3a2d55"/>
        <rect x="20" y="4" width="14" height="12" rx="2" fill="#6a2"/>
      </g>` : ''}
    <rect x="396" y="420" width="238" height="40" fill="#5b4737" stroke="#2c221a" stroke-width="3"/>
    <rect x="495" y="436" width="40" height="7" rx="3" fill="#2c221a"/>
  ` : `
    <rect x="420" y="352" width="190" height="46" fill="#5b4737" stroke="#2c221a" stroke-width="3"/>
    <rect x="495" y="366" width="40" height="7" rx="3" fill="#2c221a"/>
    <circle cx="515" cy="385" r="4" fill="#c9a33b"/>
    <rect x="514" y="385" width="2" height="7" fill="#1a120c"/>
    <rect x="420" y="404" width="190" height="56" fill="#5b4737" stroke="#2c221a" stroke-width="3"/>
    <rect x="495" y="420" width="40" height="7" rx="3" fill="#2c221a"/>
  `}

  <g transform="translate(222,222) rotate(-6)">
    <rect width="84" height="100" rx="4" fill="#8b6a3e"/>
    <rect x="7" y="12" width="70" height="82" fill="#ece6d3"/>
    <rect x="28" y="2" width="28" height="14" rx="3" fill="#8f9592"/>
    ${[28, 38, 48, 58, 68, 78].map(y => `<rect x="14" y="${y}" width="${40 + (y % 3) * 8}" height="3" fill="#888"/>`).join('')}
  </g>
  <g transform="translate(470,298)">
    <rect width="120" height="20" rx="3" fill="#c8ccc8"/>
    ${['#d9c22a', '#c83a32', '#2f62c9', '#3a9a4a'].map((c, i) => `
      <rect x="${4 + i * 29}" y="3" width="26" height="14" fill="#e8ece8"/>
      <circle cx="${12 + i * 29}" cy="10" r="3" fill="${c}"/>
      <circle cx="${21 + i * 29}" cy="11" r="3" fill="${c}"/>`).join('')}
  </g>
  <g transform="translate(396,286)">
    <rect width="24" height="32" rx="3" fill="#6a7a8a"/>
    <path d="M24 8 q10 0 10 8 t-10 8" stroke="#6a7a8a" stroke-width="4" fill="none"/>
  </g>
  ` + finish();
};

const clipboard = g => {
  const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
  return deskSurface() + `
  <g transform="translate(190,30) rotate(-2 210 270)">
    <rect x="8" y="10" width="420" height="540" rx="12" fill="#000" opacity=".4"/>
    <rect width="420" height="540" rx="12" fill="#8b6a3e"/>
    <rect x="25" y="50" width="370" height="470" fill="#efe9d6"/>
    <rect x="140" y="10" width="140" height="60" rx="8" fill="#8f9592" stroke="#5f6562" stroke-width="3"/>
    <g font-family="Courier New, monospace" fill="#222">
      <text x="45" y="102" font-size="18" font-weight="bold">HELIX BIOLABS</text>
      <text x="45" y="124" font-size="13">QUARANTINE WARD · SUBLEVEL 5</text>
      <line x1="45" y1="136" x2="375" y2="136" stroke="#555"/>
      <text x="45" y="164" font-size="15">PATIENT: #07      DAY: 14</text>
      <text x="45" y="204" font-size="16" font-weight="bold">MEDICATION PROTOCOL</text>
      <text x="45" y="230" font-size="14">Administer strictly in order:</text>
      <text x="75" y="260" font-size="17">1. BLUE</text>
      <text x="75" y="286" font-size="17">2. RED</text>
      <text x="75" y="312" font-size="17">3. GREEN</text>
      <text x="45" y="348" font-size="13">Full dose = every pill in that</text>
      <text x="45" y="366" font-size="13">colour's tray compartment.</text>
      <text x="45" y="396" font-size="13">— Dr. E. Voss</text>
    </g>
    <circle cx="330" cy="420" r="38" fill="none" stroke="#a07a4a" stroke-width="5" opacity=".35"/>
    ${g.difficulty === 'hard' ? '' : `
    <g fill="#a3221c" ${hand} transform="rotate(-4 200 460)">
      <text x="50" y="455" font-size="18">Cabinet combo = the doses,</text>
      <text x="50" y="481" font-size="18">same order. Stop forgetting!</text>
    </g>`}
  </g>` + finish({ flicker: false });
};

// Seeded RNG so pill positions are the same every time.
function rng(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

const pills = g => {
  const n = pillsOf(g);
  const comps = [['#d9c22a', n.yellow, 'MON'], ['#c83a32', n.red, 'TUE'], ['#2f62c9', n.blue, 'WED'], ['#3a9a4a', n.green, 'THU']];
  const rand = rng(42);
  let out = '';
  comps.forEach(([color, n, day], i) => {
    const x0 = 120 + i * 145;
    out += `<rect x="${x0}" y="190" width="125" height="220" rx="10" fill="#dfe3df" stroke="#a9aea9" stroke-width="3"/>
            <rect x="${x0 + 6}" y="196" width="113" height="10" rx="4" fill="#fff" opacity=".4"/>
            <text x="${x0 + 62}" y="445" font-size="18" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#6a706a">${day}</text>`;
    const slots = [];
    for (const y of [240, 290, 340, 385]) for (const x of [x0 + 35, x0 + 90]) slots.push([x, y]);
    slots.sort(() => rand() - 0.5);
    for (let k = 0; k < n; k++) {
      const [x, y] = slots[k];
      const jx = (rand() - 0.5) * 12, jy = (rand() - 0.5) * 10, rot = Math.round(rand() * 180);
      out += `<g transform="translate(${x + jx},${y + jy}) rotate(${rot})">
        <rect x="-20" y="-9" width="40" height="18" rx="9" fill="${color}" stroke="#0005" stroke-width="1.5"/>
        <rect x="-13" y="-6" width="14" height="4" rx="2" fill="#fff" opacity=".45"/></g>`;
    }
  });
  return deskSurface() + `
  <rect x="106" y="176" width="590" height="290" rx="16" fill="#000" opacity=".35" transform="translate(6,8)"/>
  <rect x="106" y="176" width="590" height="290" rx="16" fill="#c8ccc8" stroke="#8e938e" stroke-width="3"/>
  ${out}` + finish({ flicker: false });
};

const poster = g => {
  const revealed = g.flag('posterRevealed');
  const code = codeOf(g).split('').join(' ');
  const photo = !g.flag('photo1');
  return closeup('#33423c') + `
  <g stroke="#1c2420" stroke-width="2" opacity=".5">
    ${[100, 200, 300, 400, 500].map(y => `<line x1="0" y1="${y}" x2="800" y2="${y}"/>`).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="600"/>`).join('')}
  </g>
  <g transform="translate(250,70) rotate(-1.5 150 220)">
    <rect x="8" y="10" width="300" height="440" fill="#000" opacity=".4"/>
    ${photo ? `<g transform="rotate(12 290 440)">
      <rect x="262" y="410" width="54" height="44" fill="#e9e1c8"/>
      <rect x="266" y="414" width="46" height="36" fill="#a08a64"/></g>` : ''}
    <rect width="300" height="440" fill="#cbc4a5"/>
    <rect x="14" y="14" width="272" height="70" fill="#a8322a"/>
    <text x="150" y="64" font-size="42" text-anchor="middle" fill="#f3ead0" font-family="Arial, sans-serif" font-weight="bold">SAFETY</text>
    <polygon points="150,110 252,292 48,292" fill="#e3b81f" stroke="#222" stroke-width="9" stroke-linejoin="round"/>
    <text x="150" y="274" font-size="120" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">!</text>
    <text x="150" y="335" font-size="21" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#3a352a">REPORT ALL INCIDENTS</text>
    <text x="150" y="360" font-size="13" text-anchor="middle" font-family="Arial, sans-serif" fill="#3a352a">to your supervisor immediately.</text>
    <text x="150" y="412" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" fill="#7a735d">Authentic Helix notices carry a UV watermark.</text>
    <text x="150" y="428" font-size="9" text-anchor="middle" font-family="Arial, sans-serif" fill="#7a735d">HELIX BIOLABS · SUBLEVEL 5</text>
    <polygon points="300,0 300,50 255,0" fill="#33423c"/>
    <rect x="-10" y="-6" width="50" height="16" fill="#d8d2b0" opacity=".7" transform="rotate(-20)"/>
    ${revealed ? `
      <rect width="300" height="440" fill="#4a1080" opacity=".28"/>
      <g fill="#dcb0ff" filter="url(#glow)" font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive">
        <text x="150" y="215" font-size="74" text-anchor="middle" transform="rotate(-8 150 200)">${code}</text>
        <text x="190" y="392" font-size="17" text-anchor="middle">door code — E.V.</text>
      </g>` : ''}
  </g>` + finish({ flicker: false });
};

// ---------------------------------------------------------------- scenes

export default {
  id: 'r1',
  name: 'Room 1 · Quarantine Ward',
  setup,
  hints: [
    { when: g => !g.flag('took:key'), text: 'Someone slept on that cot. People hide things under pillows.' },
    { when: g => !g.flag('drawerOpen'), text: 'The desk drawer has a keyhole. Select the key, then click the drawer.' },
    { when: g => !g.flag('cabinetOpen'), text: 'The clipboard and the pill tray belong together. Count each colour, in the order the clipboard gives.' },
    { when: g => !g.has('uvlight') && !g.flag('posterRevealed'), text: 'A torch without a battery... Select one item, then click the other to combine them.' },
    { when: g => !g.flag('posterRevealed'), text: 'The poster mentions UV watermarks. Zoom in on it and use the UV torch.' },
    { when: g => !g.flag('door1Open'), text: 'Type the glowing digits into the keypad beside the door.' },
    { when: g => !g.flag('photo1'), text: 'Something is poking out from behind the safety poster.' },
  ],
  scenes: {
    'r1-north': {
      room: 'r1',
      art: north,
      nav: { left: 'r1-west', right: 'r1-east' },
      hotspots: [
        { id: 'poster', label: 'Safety poster', rect: [138, 156, 128, 170], go: 'r1-poster', sparkle: true },
        { id: 'door', label: 'Door Q-07', rect: [320, 150, 160, 320],
          when: g => !g.flag('door1Open'),
          say: 'Solid steel, locked tight. The keypad beside it blinks red.' },
        { id: 'window', label: 'Door window', rect: [355, 185, 90, 70],
          when: g => !g.flag('door1Open'),
          say: 'Wire-mesh glass. Pitch black on the other side.' },
        { id: 'exit', label: 'Corridor', rect: [320, 150, 160, 320],
          when: g => g.flag('door1Open'), go: 'r2-north' },
        { id: 'keypad', label: 'Keypad', rect: [500, 275, 60, 82],
          when: g => !g.flag('door1Open'), click: g => g.puzzle('r1-keypad'),
          sparkle: g => g.flag('posterRevealed') },
        { id: 'bin', label: 'Waste bin', rect: [580, 412, 60, 60],
          say: 'Empty, apart from a few crumpled latex gloves.' },
      ],
    },

    'r1-east': {
      room: 'r1',
      art: east,
      nav: { left: 'r1-north', right: 'r1-south' },
      hotspots: [
        { id: 'mattress', label: 'Mattress', rect: [185, 348, 450, 36],
          say: "Stained. You'd rather not think about what with." },
        { id: 'pillow', label: 'Pillow', rect: [198, 318, 126, 44], sparkle: g => !g.flag('took:key'),
          click: g => {
            if (g.flag('took:key')) return g.say('Just a lumpy, sweat-stained pillow.');
            g.give('key');
            g.set('took:key');
            g.say('You lift the pillow... a small brass key was hidden underneath!');
          } },
        { id: 'vent', label: 'Air vent', rect: [128, 88, 104, 68],
          say: "The vent's screws are rusted solid. Air whispers through it." },
        { id: 'sign', label: 'Biohazard sign', rect: [558, 108, 114, 114],
          say: 'BIOHAZARD — Quarantine level 3. Lovely.' },
        { id: 'slipper', label: 'Slipper', rect: [276, 452, 48, 18],
          say: 'A single hospital slipper. Where is the other one... and its owner?' },
      ],
    },

    'r1-south': {
      room: 'r1',
      art: south,
      nav: { left: 'r1-east', right: 'r1-west' },
      hotspots: [
        { id: 'cabinet', label: 'Mirror cabinet', rect: [318, 108, 186, 194],
          when: g => !g.flag('cabinetOpen'), click: g => g.puzzle('r1-cabinet'), sparkle: true },
        { id: 'cabinet-inside', label: 'Cabinet', rect: [268, 108, 214, 194],
          when: g => g.flag('cabinetOpen'),
          say: 'Empty pill bottles and a crusty toothbrush.' },
        { id: 'battery', label: 'Battery', rect: [408, 200, 26, 40], take: 'battery',
          when: g => g.flag('cabinetOpen'),
          say: 'An AA battery! You pocket it.' },
        { id: 'sink', label: 'Sink', rect: [298, 298, 204, 100],
          say: 'The tap coughs up a splash of rusty water, then nothing.' },
        { id: 'pipe', label: 'Pipe', rect: [604, 38, 26, 432],
          say: 'A cold water pipe. Something knocks inside it, far away.' },
      ],
    },

    'r1-west': {
      room: 'r1',
      art: west,
      nav: { left: 'r1-south', right: 'r1-north' },
      hotspots: [
        { id: 'whiteboard', label: 'Whiteboard', rect: [160, 80, 340, 140],
          say: '"DAY 14 — subjects responding??" ... "DO NOT open Cryo B". Somebody was in a hurry.' },
        { id: 'clock', label: 'Clock', circle: [640, 140, 42],
          say: 'The clock has stopped at a quarter past three.' },
        { id: 'clipboard', label: 'Clipboard', rect: [214, 214, 100, 112], go: 'r1-clipboard', sparkle: true },
        { id: 'pills', label: 'Pill tray', rect: [466, 290, 128, 34], go: 'r1-pills', sparkle: true },
        { id: 'mug', label: 'Mug', rect: [392, 282, 46, 40],
          say: 'Cold coffee with a skin of mould. Day 14 indeed.' },
        { id: 'drawer', label: 'Top drawer', rect: [420, 352, 190, 46],
          when: g => !g.flag('drawerOpen'), sparkle: true,
          say: "Locked. There's a small brass keyhole.",
          use: {
            key: g => {
              g.take('key');
              g.set('drawerOpen');
              g.say('The key turns with a gritty click. The drawer slides open.');
            },
          } },
        { id: 'drawer2', label: 'Bottom drawer', rect: [420, 404, 190, 56],
          when: g => !g.flag('drawerOpen'),
          say: 'Nothing but dust and a dead moth.',
          use: { key: g => g.say("This drawer has no keyhole. The one above it does.") } },
        { id: 'drawer-open', label: 'Drawer', rect: [396, 372, 238, 88],
          when: g => g.flag('drawerOpen'),
          say: 'Paper clips and an old ID lanyard. Nothing useful.' },
        { id: 'flashlight', label: 'Torch', rect: [446, 372, 180, 44], take: 'flashlight',
          when: g => g.flag('drawerOpen'),
          say: 'A UV inspection torch. Of course the battery is missing.' },
      ],
    },

    'r1-clipboard': {
      room: 'r1',
      art: clipboard,
      nav: { back: 'r1-west' },
      hotspots: [],
    },

    'r1-pills': {
      room: 'r1',
      art: pills,
      nav: { back: 'r1-west' },
      hotspots: [
        { id: 'tray', label: 'Pill tray', rect: [106, 176, 590, 290],
          say: 'A weekly pill organiser. Yellow, red, blue, green.' },
      ],
    },

    'r1-poster': {
      room: 'r1',
      art: poster,
      nav: { back: 'r1-north' },
      hotspots: [
        { id: 'poster', label: 'Poster', rect: [250, 70, 300, 440],
          say: g => g.flag('posterRevealed')
            ? `The violet digits still glow faintly: ${codeOf(g).split('').join(' ')}.`
            : 'A faded safety poster. The fine print mentions UV watermarks.',
          sparkle: g => !g.flag('posterRevealed'),
          use: {
            uvlight: g => {
              g.set('posterRevealed');
              g.say('Under the violet light, scrawled digits blaze across the poster!');
            },
            flashlight: g => g.say('You click the switch. Nothing. The torch needs a battery.'),
          } },
        { id: 'photo1', label: 'Something behind the poster', rect: [500, 465, 70, 60],
          when: g => !g.flag('photo1'), sparkle: true,
          click: g => findPhotoPiece(g, 'photo1') },
      ],
    },
  },

  puzzles: {
    'r1-keypad': {
      type: 'keypad',
      prompt: 'DOOR Q-07 · ENTER ACCESS CODE',
      solution: codeOf,
      solve: g => {
        g.set('door1Open');
        g.say('The lock releases with a heavy clunk. Door Q-07 swings open.');
      },
    },
    'r1-cabinet': {
      type: 'dials',
      prompt: 'A three-digit combination padlock.',
      solution: g => { const n = pillsOf(g); return [n.blue, n.red, n.green]; },
      solve: g => {
        g.set('cabinetOpen');
        g.say('Click! The padlock drops away and the cabinet creaks open.');
      },
    },
  },
};

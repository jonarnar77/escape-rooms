// ROOM 5 — Director's Office (finale)
//
// Puzzle chain:
//   desk drawer (west)                 -> roll of tape
//   tape + torn photo (4/4 pieces)     -> taped photo; examine: front (the team, one face
//                                         scratched out) and back ("the way out is the way you came in")
//   painting (east) swings aside       -> wall safe with a CLOCK lock
//   notepad: "the moment it all stopped" + room 1 clock / room 3 log = 3:15
//   safe                               -> elevator key + Director Hale's journal
//   elevator key on panel (north)      -> panel powers up
//   symbol sequence = the rooms in order: biohazard, flask, lightning, snowflake
//   elevator                           -> ending (you are HX-07)
//
// Difficulty: HARD blanks the notepad and makes the back of the photo terse.

import { closeup, deskSurface, finish, door, DEFS, doorSign } from '../art/common.js';
import { SYMBOLS, icon } from '../art/symbols.js';

const SOLUTION = ['bio', 'flask', 'bolt', 'snow'];

// ---------------------------------------------------------------- art

const WARM = `
<defs>
  <radialGradient id="lampG" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#ffd890" stop-opacity=".55"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="steelG" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#8a9196"/><stop offset=".5" stop-color="#c9cfd2"/><stop offset="1" stop-color="#7d8489"/>
  </linearGradient>
  <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e0c070"/><stop offset="1" stop-color="#8a6a2a"/>
  </linearGradient>
  <filter id="staticF" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="3"/>
    <feColorMatrix values="0 0 0 .7 0  0 0 0 .7 0  0 0 0 .7 0  0 0 0 0 1"/></filter>
</defs>`;

function office() {
  let stripes = '';
  for (let x = 0; x < 800; x += 40) stripes += `<rect x="${x}" y="30" width="18" height="256" fill="#fff" opacity=".035"/>`;
  let panels = '';
  for (let i = 0; i < 5; i++) panels += `<rect x="${20 + i * 160}" y="306" width="130" height="134" fill="none" stroke="#2e2016" stroke-width="3"/>`;
  let carpet = '';
  for (let i = -6; i <= 6; i++) carpet += `<line x1="${400 + i * 70}" y1="470" x2="${400 + i * 140}" y2="600"/>`;
  return `${DEFS}${WARM}
  <rect width="800" height="600" fill="#000"/>
  <rect width="800" height="470" fill="#3b2624"/>
  ${stripes}
  <rect y="290" width="800" height="170" fill="#4a3424"/>
  ${panels}
  <rect y="284" width="800" height="9" fill="#6a4c34"/>
  <rect y="455" width="800" height="15" fill="#2a1c14"/>
  <rect width="800" height="30" fill="#1e1612"/>
  <rect y="470" width="800" height="130" fill="#4a1e20"/>
  <g stroke="#2a0e10" stroke-width="2" opacity=".6">${carpet}</g>
  <rect x="40" y="490" width="720" height="100" fill="none" stroke="#a07a3a" stroke-width="3" opacity=".35"/>`;
}

const warmFinish = () => finish({ flicker: false }) + `
  <rect width="800" height="600" fill="#ffb060" opacity=".06" style="mix-blend-mode:screen"/>`;

function sconce(x) {
  return `<circle cx="${x}" cy="150" r="90" fill="url(#lampG)"/>
    <rect x="${x - 6}" y="150" width="12" height="20" fill="#8a6a2a"/>
    <path d="M${x - 16} 150 l6 -26 h20 l6 26 Z" fill="#f4dca0"/>`;
}

const north = g => {
  const on = g.flag('panelOn');
  const open = g.flag('elevatorOpen');
  return office() + `
  ${sconce(150)}${sconce(650)}
  <rect x="262" y="90" width="276" height="22" fill="url(#goldG)"/>
  <rect x="350" y="52" width="100" height="32" rx="4" fill="#111" stroke="#8a6a2a" stroke-width="3"/>
  <text x="400" y="76" font-size="22" text-anchor="middle" font-family="Courier New, monospace" font-weight="bold" fill="${open ? '#6f6' : '#f55'}" filter="url(#glow)">${open ? '▲ UP' : 'B5'}</text>
  <rect x="270" y="112" width="260" height="358" fill="#2a2e31"/>
  ${open ? `
    <rect x="290" y="126" width="220" height="344" fill="#e8d8a8"/>
    <rect x="290" y="126" width="220" height="344" fill="url(#lampG)"/>
    <rect x="300" y="440" width="200" height="30" fill="#8a7a5a"/>
    <rect x="300" y="200" width="200" height="6" fill="#c9a33b"/>
    <rect x="286" y="126" width="12" height="344" fill="url(#steelG)"/>
    <rect x="502" y="126" width="12" height="344" fill="url(#steelG)"/>
  ` : `
    <rect x="290" y="126" width="109" height="344" fill="url(#steelG)"/>
    <rect x="401" y="126" width="109" height="344" fill="url(#steelG)"/>
    <rect x="399" y="126" width="2" height="344" fill="#3a3f44"/>
    <rect x="290" y="126" width="220" height="344" fill="#000" opacity=".12"/>
    <text x="345" y="300" font-size="16" text-anchor="middle" font-family="Georgia, serif" fill="#5a6064" letter-spacing="4">SURF</text>
    <text x="455" y="300" font-size="16" text-anchor="middle" font-family="Georgia, serif" fill="#5a6064" letter-spacing="4">ACE</text>
  `}
  <g transform="translate(548,236)">
    <rect width="66" height="150" rx="6" fill="url(#goldG)" stroke="#5a4214" stroke-width="2"/>
    <rect x="10" y="12" width="46" height="22" fill="${on ? '#06200c' : '#111'}"/>
    ${on ? `<text x="33" y="28" font-size="10" text-anchor="middle" font-family="Courier New, monospace" fill="#5f5" filter="url(#glow)">${open ? 'OK' : 'SEQ?'}</text>` : ''}
    <circle cx="33" cy="52" r="9" fill="#3a2a10"/>
    <rect x="31" y="46" width="4" height="12" fill="#111" ${on ? 'transform="rotate(90 33 52)"' : ''}/>
    ${on ? '<rect x="28" y="38" width="10" height="10" fill="#c9a33b"/>' : ''}
    ${['eye', 'flask', 'rad', 'snow', 'skull', 'bio', 'dna', 'bolt'].map((id, i) => `
      <g transform="translate(${8 + (i % 2) * 28},${70 + Math.floor(i / 2) * 19}) scale(.42)">
        <rect x="-2" y="-2" width="44" height="44" rx="6" fill="#d8c58a" stroke="#5a4214" stroke-width="3"/>${SYMBOLS[id]}</g>`).join('')}
  </g>
  <g transform="translate(120,330)">
    <ellipse cx="30" cy="140" rx="40" ry="6" fill="#000" opacity=".4"/>
    <path d="M6 80 h48 l-6 60 h-36 Z" fill="#6a3a24"/>
    <path d="M30 82 q-30 -40 -20 -70 M30 82 q20 -50 40 -40 M30 82 q-2 -50 4 -70 M30 82 q-40 -10 -40 10" stroke="#5a4a2a" stroke-width="4" fill="none"/>
  </g>
  ` + warmFinish();
};

const east = g => {
  const moved = g.flag('paintingMoved');
  const open = g.flag('safeOpen');
  const key = !g.flag('took:elevkey');
  const painting = `
    <rect x="270" y="90" width="260" height="190" fill="url(#goldG)"/>
    <rect x="284" y="104" width="232" height="162" fill="#1a2a44"/>
    <g fill="none" stroke-width="5">
      <path d="M340 110 q60 40 0 80 q-60 40 0 70" stroke="#d8c58a"/>
      <path d="M460 110 q-60 40 0 80 q60 40 0 70" stroke="#9fd4ff"/>
    </g>
    <path d="M352 130 h96 M370 150 h60 M370 210 h60 M352 232 h96" stroke="#e8f0f4" stroke-width="3" opacity=".7"/>
    <rect x="360" y="282" width="80" height="16" fill="url(#goldG)"/>
    <text x="400" y="294" font-size="8" text-anchor="middle" font-family="Georgia, serif" fill="#2a1c14">HELIX · FOUNDERS</text>`;
  const safeClock = `
    <circle cx="400" cy="190" r="40" fill="#efe9d6" stroke="#8a7a4a" stroke-width="5"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<line x1="400" y1="155" x2="400" y2="161" transform="rotate(${i * 30} 400 190)" stroke="#222" stroke-width="2"/>`).join('')}
    <line x1="400" y1="190" x2="400" y2="166" stroke="#111" stroke-width="5" stroke-linecap="round"/>
    <line x1="400" y1="190" x2="400" y2="156" stroke="#111" stroke-width="3" stroke-linecap="round"/>
    <circle cx="400" cy="190" r="4" fill="#8a7a4a"/>
    <rect x="452" y="176" width="14" height="30" rx="4" fill="#3a3f44"/>`;
  return office() + `
  ${sconce(110)}
  ${moved ? `
    <rect x="300" y="110" width="200" height="160" fill="#1a1d20" stroke="#5a6064" stroke-width="6"/>
    ${open ? `
      <rect x="312" y="122" width="176" height="136" fill="#0a0c0d"/>
      <rect x="312" y="216" width="176" height="6" fill="#3a3f44"/>
      ${key ? `<g transform="translate(340,190) rotate(-8)">
        <rect width="24" height="18" rx="6" fill="#c9a33b"/><rect x="22" y="6" width="36" height="7" fill="#c9a33b"/>
        <rect x="-14" y="-6" width="16" height="10" rx="2" fill="#a8322a"/></g>` : ''}
      <rect x="400" y="168" width="70" height="48" fill="#3a1a14"/><rect x="404" y="172" width="62" height="40" fill="#5a2a1e"/>
      <polygon points="300,110 240,124 240,256 300,270" fill="#5a6064" stroke="#3a3f44" stroke-width="3"/>
    ` : safeClock}
    <g transform="translate(-250,-30) rotate(-6 400 190)">${painting}</g>
  ` : painting}

  <g transform="translate(80,250)">
    <rect width="120" height="220" fill="#5a4a3a" stroke="#2e2016" stroke-width="3"/>
    ${[0, 1, 2, 3].map(i => `<rect x="10" y="${12 + i * 52}" width="100" height="44" fill="#6a5a48" stroke="#2e2016" stroke-width="2"/>
      <rect x="45" y="${28 + i * 52}" width="30" height="7" rx="3" fill="#c9a33b"/>
      <rect x="40" y="${16 + i * 52}" width="40" height="8" fill="#efe9d6"/>`).join('')}
  </g>
  <g transform="translate(640,180)">
    <rect x="18" y="0" width="8" height="290" fill="#3a2a1a"/>
    <path d="M22 10 l-24 16 M22 10 l24 16" stroke="#3a2a1a" stroke-width="6"/>
    <ellipse cx="22" cy="290" rx="40" ry="8" fill="#2a1c14"/>
    <path d="M-6 26 q28 -8 56 0 l12 150 q-40 14 -80 0 Z" fill="#2a2e44"/>
  </g>
  ` + warmFinish();
};

const west = g => {
  const drawer = g.flag('deskOpen');
  const tape = !g.flag('took:tape');
  const feeds = [['Q-07', 'cot'], ['C-12', 'hood'], ['SRV', 'racks'], ['CRYO', 'pods']];
  return office() + `
  <rect x="210" y="56" width="380" height="216" fill="#151515" stroke="#2a2a2a" stroke-width="6"/>
  ${feeds.map(([label], i) => {
    const x = 224 + (i % 2) * 182, y = 68 + Math.floor(i / 2) * 100;
    return `<rect x="${x}" y="${y}" width="170" height="92" fill="#0e1612"/>
      <rect x="${x}" y="${y}" width="170" height="92" fill="#222" filter="url(#staticF)" opacity=".18"/>
      <text x="${x + 6}" y="${y + 14}" font-size="11" font-family="Courier New, monospace" fill="#cfe" opacity=".85">CAM ${label}</text>`;
  }).join('')}
  <g opacity=".5" stroke="#cfe" fill="none" stroke-width="2">
    <rect x="250" y="120" width="70" height="16"/><rect x="430" y="104" width="50" height="40"/>
    <path d="M250 200 v50 M280 200 v50 M310 200 v50"/><path d="M430 200 v50 M455 200 v50 M480 200 v50 M505 200 v50"/>
  </g>
  <circle cx="574" cy="74" r="5" fill="#f33"><animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/></circle>

  <path d="M360 330 v-60 q0 -16 16 -16 h48 q16 0 16 16 v60 Z" fill="#2a1414"/>
  <rect x="140" y="326" width="520" height="18" fill="#5e3a22"/>
  <rect x="150" y="344" width="500" height="126" fill="#4a2c1a"/>
  <rect x="300" y="354" width="200" height="116" fill="#1a0e08"/>
  ${drawer ? `
    <rect x="510" y="354" width="130" height="42" fill="#120a06"/>
    <polygon points="500,372 650,372 662,416 488,416" fill="#3a2414"/>
    <polygon points="506,376 644,376 654,410 496,410" fill="#1e120a"/>
    ${tape ? `<g transform="translate(540,388)"><circle r="13" fill="#d8d2b0"/><circle r="6" fill="#1e120a"/></g>` : ''}
    <rect x="590" y="382" width="34" height="20" fill="#7a2a1a"/>
    <rect x="488" y="416" width="174" height="40" fill="#5e3a22" stroke="#2e1a0e" stroke-width="2"/>
    <rect x="555" y="432" width="40" height="7" rx="3" fill="#c9a33b"/>
  ` : `
    <rect x="510" y="354" width="130" height="42" fill="#5e3a22" stroke="#2e1a0e" stroke-width="2"/>
    <rect x="555" y="370" width="40" height="7" rx="3" fill="#c9a33b"/>
  `}
  <rect x="510" y="404" width="130" height="56" fill="#5e3a22" stroke="#2e1a0e" stroke-width="2" ${drawer ? 'opacity="0"' : ''}/>
  <g transform="translate(190,250)">
    <circle cx="20" cy="10" r="70" fill="url(#lampG)"/>
    <path d="M0 30 l10 -30 h20 l10 30 Z" fill="#1d5a3a"/>
    <rect x="18" y="30" width="4" height="40" fill="#c9a33b"/><rect x="6" y="70" width="28" height="6" fill="#c9a33b"/>
  </g>
  <g transform="translate(280,286)">
    <rect width="44" height="40" fill="url(#goldG)"/><rect x="5" y="5" width="34" height="30" fill="#1a1a1a"/>
  </g>
  <g transform="translate(372,312) skewX(-20)">
    <rect width="76" height="14" fill="#f4e27a"/>
    <path d="M8 5 h50 M8 9 h40" stroke="#1f2a5a" stroke-width="1.2"/>
  </g>
  ` + warmFinish();
};

const south = () => office() + `
  ${sconce(560)}
  ${doorSign('CRYO STORAGE', 'snow', { bg: '#1a4a6a', fg: '#dff2ff' })}
  ${door({ open: true })}
  <g transform="translate(60,90)">
    <rect width="200" height="380" fill="#3a2414" stroke="#2a1a0e" stroke-width="4"/>
    ${[0, 1, 2, 3].map(r => `<rect x="8" y="${8 + r * 92}" width="184" height="6" fill="#5e3a22"/>
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${14 + i * 19 + (r * 7) % 6}" y="${22 + r * 92}" width="${14 + (i * r) % 5}" height="${68 - ((i + r) % 4) * 6}"
        fill="${['#6a2a1a', '#2a3a5a', '#3a5a3a', '#7a6a3a', '#4a2a4a'][(i + r * 2) % 5]}" transform="translate(0 ${((i + r) % 4) * 6})"/>`).join('')}`).join('')}
  </g>
  <g transform="translate(560,190)">
    <rect width="160" height="120" fill="url(#goldG)"/>
    <rect x="10" y="10" width="140" height="100" fill="#efe9d6"/>
    <text x="80" y="33" font-size="12" text-anchor="middle" font-family="Georgia, serif" letter-spacing="1" fill="#3a2a1a">EMPLOYEE</text>
    <text x="80" y="47" font-size="9" text-anchor="middle" font-family="Georgia, serif" letter-spacing="1" fill="#3a2a1a">OF THE MONTH</text>
    <line x1="40" y1="54" x2="120" y2="54" stroke="#b8a070" stroke-width="1"/>
    <text x="80" y="76" font-size="15" text-anchor="middle" font-family="Georgia, serif" font-style="italic" fill="#1a1a1a">R. Okafor</text>
    <text x="80" y="95" font-size="10" text-anchor="middle" font-family="Georgia, serif" fill="#555">IT Department</text>
  </g>
  ` + warmFinish();

const note = g => {
  const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
  return deskSurface() + `
  <g transform="rotate(-3 400 300)">
    <rect x="236" y="76" width="340" height="440" fill="#000" opacity=".35"/>
    <rect x="230" y="70" width="340" height="440" fill="#f4e27a"/>
    <rect x="230" y="70" width="340" height="28" fill="#3a2a1a"/>
    ${Array.from({ length: 13 }, (_, i) => `<line x1="240" y1="${130 + i * 28}" x2="560" y2="${130 + i * 28}" stroke="#c9b860"/>`).join('')}
    ${g.difficulty === 'hard'
      ? `<text x="400" y="300" font-size="15" text-anchor="middle" fill="#a89840" ${hand}>(the top sheet has been torn off)</text>`
      : `<g fill="#1f2a5a" ${hand} font-size="22">
          <text x="256" y="152">Safe combo:</text>
          <text x="256" y="208">it remembers the exact</text>
          <text x="256" y="236">moment everything</text>
          <text x="256" y="264">stopped.</text>
          <text x="420" y="330" font-size="20">— A.H.</text>
        </g>`}
  </g>` + finish({ flicker: false });
};

function person(x, skin, coat, scratched) {
  return `
    <path d="M${x - 42} 430 q0 -150 42 -170 q42 20 42 170 Z" fill="${coat}"/>
    <path d="M${x - 10} 262 l10 30 l10 -30" fill="#2a3a5a"/>
    <circle cx="${x}" cy="225" r="28" fill="${skin}"/>
    <path d="M${x - 28} 215 q28 -40 56 0" fill="#3a2a1a"/>
    ${scratched ? `<path d="M${x - 30} 198 ${Array.from({ length: 12 }, (_, i) => `L${i % 2 ? x - 30 : x + 30} ${202 + i * 4.6}`).join(' ')}"
        fill="none" stroke="#141010" stroke-width="5" stroke-linejoin="round"/>
      <path d="M${x - 24} 200 L${x + 22} 252 M${x + 26} 202 L${x - 22} 250" stroke="#141010" stroke-width="4"/>
      <rect x="${x - 30}" y="330" width="16" height="8" fill="#e8eef0"/>` : ''}`;
}

const photoFront = () => closeup('#1e1612') + `
  <g transform="rotate(-1.5 400 290)">
    <rect x="128" y="76" width="560" height="420" fill="#000" opacity=".45"/>
    <rect x="120" y="66" width="560" height="420" fill="#e9e1c8"/>
    <rect x="140" y="86" width="520" height="340" fill="#a08a64"/>
    <rect x="140" y="86" width="520" height="340" fill="#6d5a3e" opacity=".35"/>
    ${person(240, '#d8b090', '#e8e4da', false)}
    ${person(350, '#c89a70', '#e8e4da', false)}
    ${person(460, '#8a5a3a', '#e8e4da', false)}
    ${person(570, '#d8b090', '#9fc3d8', true)}
    <rect x="140" y="86" width="520" height="340" fill="#d8b070" opacity=".18"/>
    <text x="400" y="452" font-size="15" text-anchor="middle" font-family="Georgia, serif" fill="#3a2a1a">SUBLEVEL 5 · DAY ONE</text>
    <text x="400" y="474" font-size="12" text-anchor="middle" font-family="Georgia, serif" font-style="italic" fill="#5a4a3a">E. Voss · A. Hale · R. Okafor · ―――</text>
    <path d="M400 66 l-6 40 l8 40 l-10 50 l8 60 l-6 70 l8 60 l-4 94" stroke="#7a6a4a" stroke-width="2" fill="none"/>
    <path d="M120 280 l60 -6 l50 8 l70 -8 l80 6 l90 -4 l60 8 l90 -6" stroke="#7a6a4a" stroke-width="2" fill="none"/>
    <rect x="388" y="66" width="26" height="420" fill="#f4f0d8" opacity=".35"/>
    <rect x="120" y="268" width="560" height="24" fill="#f4f0d8" opacity=".35"/>
  </g>` + finish({ flicker: false });

const photoBack = g => {
  const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
  const lines = g.difficulty === 'hard'
    ? ['Lift override:', 'retrace.']
    : ['Sublevel 5, day one.', '', 'Lift override, in case I forget:', 'the way out is the way you', 'came in. Start where it began.'];
  return closeup('#1e1612') + `
  <g transform="rotate(1.5 400 290)">
    <rect x="128" y="76" width="560" height="420" fill="#000" opacity=".45"/>
    <rect x="120" y="66" width="560" height="420" fill="#efe8d4"/>
    <path d="M400 66 l-6 40 l8 40 l-10 50 l8 60 l-6 70 l8 60 l-4 94" stroke="#b8ac8c" stroke-width="2" fill="none"/>
    <path d="M120 280 l60 -6 l50 8 l70 -8 l80 6 l90 -4 l60 8 l90 -6" stroke="#b8ac8c" stroke-width="2" fill="none"/>
    <rect x="388" y="66" width="26" height="420" fill="#f4f0d8" opacity=".5"/>
    <rect x="120" y="268" width="560" height="24" fill="#f4f0d8" opacity=".5"/>
    <g fill="#1f2a5a" ${hand} font-size="24">
      ${lines.map((l, i) => `<text x="170" y="${150 + i * 44}">${l}</text>`).join('')}
      <text x="520" y="420" font-size="22">— A.H.</text>
    </g>
  </g>` + finish({ flicker: false });
};

const journal = () => {
  const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
  const lines = [
    'Day 15.',
    'HX-07 is responding far beyond',
    "projections. It remembers nothing.",
    'Voss insists it believes it is',
    'one of us, a patient, a person.',
    '',
    'Last night it got out of the pod.',
    "I've sealed Sublevel 5.",
    '',
    "If it's clever enough to reach",
    "this office, it's clever enough",
    'to leave. God help us all.',
  ];
  return deskSurface() + `
  <g transform="rotate(-1 400 300)">
    <rect x="146" y="46" width="520" height="520" fill="#000" opacity=".4"/>
    <rect x="140" y="40" width="520" height="520" rx="6" fill="#3a1a14"/>
    <rect x="156" y="52" width="488" height="496" fill="#efe9d6"/>
    <g fill="#2a1a0e" ${hand} font-size="20">
      ${lines.map((l, i) => `<text x="186" y="${98 + i * 34}">${l}</text>`).join('')}
      <text x="470" y="526" font-size="20">— A. Hale</text>
    </g>
  </g>` + finish({ flicker: false });
};

// ---------------------------------------------------------------- scenes

const ELEVATOR_USE = { elevkey: g => g.say('Try the key slot on the brass panel beside the doors.') };

export default {
  id: 'r5',
  name: "Room 5 · Director's Office",
  hints: [
    { when: g => !g.flag('photoTaped') && (g.get('photoPieces') ?? 0) < 4,
      text: g => `You have ${g.get('photoPieces') ?? 0} of 4 photo pieces. Each earlier room hid one: behind the safety poster, in the chem lab vent, in the rack drawer with the fob, and inside pod B.` },
    { when: g => !g.flag('photoTaped') && !g.has('tape'), text: 'Those photo pieces need sticking together. Check the director\'s desk.' },
    { when: g => !g.flag('photoTaped'), text: 'Select the tape, then click the torn photo to combine them.' },
    { when: g => !g.flag('photoSeenBack'), text: 'Examine the taped photo, then click it to turn it over.' },
    { when: g => !g.flag('paintingMoved'), text: 'That painting hangs a little crooked...' },
    { when: g => !g.flag('safeOpen'), text: g => g.difficulty === 'easy'
      ? "The safe's lock is a clock. Room 1's wall clock had stopped at 3:15, and the server log shows the power died at 03:15."
      : "The safe's lock is a clock face. When did everything stop?" },
    { when: g => !g.flag('took:elevkey'), text: 'Take what is inside the safe.' },
    { when: g => !g.flag('panelOn'), text: 'Use the elevator key on the brass panel beside the elevator.' },
    { when: g => !g.flag('elevatorOpen'), text: g => g.difficulty === 'easy'
      ? 'One symbol per room, in the order you escaped them. Every door sign shows its area\'s symbol: quarantine, chem lab, servers, cryo.'
      : 'The way out is the way you came in. Think about each room you escaped, in order, and the signs above their doors.' },
    { text: 'Step into the elevator.' },
  ],

  scenes: {
    'r5-north': {
      room: 'r5',
      art: north,
      nav: { left: 'r5-west', right: 'r5-east' },
      enter: g => {
        if (g.flag('r5Seen')) return;
        g.set('r5Seen');
        g.say('Warm lamplight, wood panelling, thick carpet. After everything below, the director\'s office feels obscene. And there: an elevator marked SURFACE.', 6500);
      },
      hotspots: [
        { id: 'doors', label: 'Elevator', rect: [270, 112, 260, 358],
          when: g => !g.flag('elevatorOpen'),
          say: 'Brushed steel doors marked SURFACE. Firmly shut.',
          use: ELEVATOR_USE },
        { id: 'enter', label: 'Step inside', rect: [290, 126, 220, 344],
          when: g => g.flag('elevatorOpen'), sparkle: true,
          click: g => {
            g.set('escaped');
            g.win(`The doors slide shut and the lift begins to climb: B4... B3... B2...<br><br>
              In the polished steel you catch your reflection, and notice for the first time
              a plastic band around your wrist.<br><br>
              It reads: <b>SUBJECT HX-07</b>.<br><br>
              Far below, a cryo pod stands open and empty.`);
          } },
        { id: 'indicator', label: 'Floor indicator', rect: [350, 52, 100, 32],
          say: g => g.flag('elevatorOpen') ? 'An arrow pointing up. Finally.' : 'B5. The bottom of everything.' },
        { id: 'panel', label: 'Elevator panel', rect: [544, 232, 74, 158],
          sparkle: g => g.has('elevkey') || (g.flag('panelOn') && !g.flag('elevatorOpen')),
          click: g => {
            if (g.flag('elevatorOpen')) return g.say('OVERRIDE ACCEPTED.');
            if (!g.flag('panelOn')) return g.say('A brass panel with eight symbol buttons and a key slot. Dead without the key.');
            g.puzzle('r5-elevator');
          },
          use: {
            elevkey: g => {
              g.take('elevkey');
              g.set('panelOn');
              g.say('The key turns with a solid clunk. The little screen lights up: "SEQ?"');
            },
          } },
        { id: 'plant', label: 'Plant', rect: [100, 330, 100, 150], say: 'A dead fern. Nobody has watered it in weeks.' },
      ],
    },

    'r5-east': {
      room: 'r5',
      art: east,
      nav: { left: 'r5-north', right: 'r5-south' },
      hotspots: [
        { id: 'painting', label: 'Painting', rect: [270, 90, 260, 210],
          when: g => !g.flag('paintingMoved'), sparkle: true,
          click: g => {
            g.set('paintingMoved');
            g.say('The painting swings aside on a hidden hinge. A wall safe! And its lock is... a clock face?');
          } },
        { id: 'painting-moved', label: 'Painting', rect: [20, 50, 262, 230],
          when: g => g.flag('paintingMoved'),
          say: 'A double helix, signed by the founders. Ostentatious.' },
        { id: 'safe', label: 'Wall safe', rect: [300, 110, 200, 160],
          when: g => g.flag('paintingMoved') && !g.flag('safeOpen'), sparkle: true,
          click: g => g.puzzle('r5-safe') },
        { id: 'safe-inside', label: 'Safe', rect: [240, 110, 260, 160],
          when: g => g.flag('safeOpen'),
          say: 'The safe is empty apart from what you found.' },
        { id: 'elevkey', label: 'Elevator key', rect: [324, 180, 80, 36], take: 'elevkey',
          when: g => g.flag('safeOpen'),
          say: 'A heavy brass key: "SURFACE LIFT · OVERRIDE".' },
        { id: 'journal', label: 'Journal', rect: [398, 164, 76, 56],
          when: g => g.flag('safeOpen'), sparkle: g => !g.flag('readJournal'),
          go: 'r5-journal' },
        { id: 'cabinet', label: 'Filing cabinet', rect: [80, 250, 120, 220],
          say: 'Personnel files, A to Z. Every folder for "Subjects" is empty.' },
        { id: 'coat', label: 'Coat stand', rect: [612, 170, 100, 300],
          say: 'An expensive coat. The director left in a hurry, or never left at all.' },
      ],
    },

    'r5-south': {
      room: 'r5',
      art: south,
      nav: { left: 'r5-east', right: 'r5-west' },
      hotspots: [
        { id: 'back', label: 'Back to cryo storage', rect: [320, 150, 160, 320], go: 'r4-north' },
        { id: 'books', label: 'Bookshelf', rect: [60, 90, 200, 380],
          say: 'Neurology, cryobiology, ethics... the ethics book still has its plastic wrap.' },
        { id: 'certificate', label: 'Certificate', rect: [560, 190, 160, 120],
          say: 'EMPLOYEE OF THE MONTH: R. Okafor, IT. So that is who kept leaving all the sticky notes.' },
      ],
    },

    'r5-west': {
      room: 'r5',
      art: west,
      nav: { left: 'r5-south', right: 'r5-north' },
      hotspots: [
        { id: 'cctv', label: 'Security monitors', rect: [210, 56, 380, 216],
          say: 'Grainy feeds of every room you passed through. Someone was watching you the whole way here. The REC light is still blinking.' },
        { id: 'drawer', label: 'Desk drawer', rect: [510, 354, 130, 42],
          when: g => !g.flag('deskOpen'), sparkle: true,
          click: g => { g.set('deskOpen'); g.say('The drawer slides open.'); } },
        { id: 'drawer-open', label: 'Drawer', rect: [488, 372, 174, 84],
          when: g => g.flag('deskOpen'),
          say: 'A box of expensive cigars, untouched.' },
        { id: 'tape', label: 'Roll of tape', rect: [522, 372, 40, 34], take: 'tape',
          when: g => g.flag('deskOpen'),
          say: 'A roll of clear tape. Exactly what that photo needs.' },
        { id: 'drawer2', label: 'Desk drawer', rect: [510, 404, 130, 56],
          when: g => !g.flag('deskOpen'), say: 'Locked, and there is no keyhole you can see. Probably just paperwork.' },
        { id: 'notepad', label: 'Notepad', rect: [360, 306, 100, 26], go: 'r5-note', sparkle: true },
        { id: 'frame', label: 'Photo frame', rect: [276, 282, 52, 48],
          say: 'An empty photo frame on the desk. Its photo was torn out and scattered.',
          use: { photo: g => g.say(g.flag('photoTaped')
            ? 'It would fit perfectly. You keep it instead: you have a feeling you will need what is on the back.'
            : "Just scraps. They'd need taping together first.") } },
        { id: 'lamp', label: 'Desk lamp', rect: [180, 240, 60, 90], say: 'A green banker\'s lamp. The only warm light on the whole sublevel.' },
        { id: 'chair', label: 'Chair', rect: [360, 254, 96, 70], say: 'A leather chair, still faintly warm. That cannot be right.' },
      ],
    },

    'r5-note': { room: 'r5', art: note, nav: { back: 'r5-west' }, hotspots: [] },

    'r5-journal': {
      room: 'r5', art: journal, nav: { back: 'r5-east' },
      enter: g => g.set('readJournal'),
      hotspots: [],
    },

    'photo-front': {
      room: 'r5',
      art: photoFront,
      nav: { back: g => g.get('photoReturn') ?? 'r5-west' },
      hotspots: [
        { id: 'scratched', label: 'Scratched-out face', rect: [520, 180, 100, 90],
          say: 'The fourth face has been scratched away with something sharp. A hospital gown... and a wristband.' },
        { id: 'flip', label: 'Turn the photo over', rect: [120, 66, 560, 420], go: 'photo-back' },
      ],
    },

    'photo-back': {
      room: 'r5',
      art: photoBack,
      nav: { back: g => g.get('photoReturn') ?? 'r5-west' },
      enter: g => g.set('photoSeenBack'),
      hotspots: [
        { id: 'flip', label: 'Turn the photo over', rect: [120, 66, 560, 420], go: 'photo-front' },
      ],
    },
  },

  puzzles: {
    'r5-safe': {
      type: 'clock',
      prompt: 'The safe dial is a clock face. Set the time, then try the handle.',
      solution: { h: 3, m: 15 },
      start: { h: 12, m: 0 },
      minuteStep: 5,
      failText: "The handle won't budge.",
      solve: g => {
        g.set('safeOpen');
        g.say('Click... click... CLUNK. The safe door swings open.');
      },
    },

    'r5-elevator': {
      type: 'sequence',
      prompt: 'SURFACE LIFT · OVERRIDE SEQUENCE',
      buttons: ['eye', 'flask', 'rad', 'snow', 'skull', 'bio', 'dna', 'bolt'].map(id => ({ id, label: icon(id) })),
      solution: SOLUTION,
      okText: 'OVERRIDE ACCEPTED',
      errText: 'INVALID SEQUENCE',
      solve: g => {
        g.set('elevatorOpen');
        g.effect('flash');
        g.say('A chime. Somewhere above, machinery groans into life... and the elevator doors slide open.', 5000);
      },
    },
  },
};

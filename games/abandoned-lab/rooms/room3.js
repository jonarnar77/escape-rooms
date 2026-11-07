// ROOM 3 — Server Room
//
// Puzzle chain:
//   power is out (red emergency lighting)
//   toolbox (south)              -> spare fuse
//   spare fuse on blown fuse     -> routing matrix powers up (breaker panel close-up, east)
//   routing matrix (rotate-grid) -> POWER: lights, racks, terminal come alive
//   rack C status LED blinks Morse "COLD"; Morse chart on the corkboard (south)
//   terminal (east) password COLD -> log: "fob is in rack B, drawer 3", drawer locks released
//   rack B drawer 3 (north)      -> cryo fob + photo piece #3
//   fob on reader (west)         -> exit to Cryo Storage
//
// The log's "03:15" matches the stopped clock in room 1.
// Difficulty: HARD randomises the Morse word and the drawer, and drops the
// terminal hint and the "how to read the LED" sticky note.

import { room, closeup, finish, door, DEFS, doorSign } from '../art/common.js';
import { findPhotoPiece } from '../items.js';

const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..',
  J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
  S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
};
const RACKS = { A: 130, B: 330, C: 530 };          // x of each rack
const drawerY = n => 290 + (n - 1) * 42;

const wordOf = g => g.get('r3Word') ?? 'COLD';
const drawerOf = g => g.get('r3Drawer') ?? { rack: 'B', n: 3 };

function setup(g) {
  if (g.difficulty !== 'hard') return;
  const words = ['COLD', 'HELP', 'DARK', 'FROZE', 'VOSS', 'ICE'];
  g.set('r3Word', words[Math.floor(Math.random() * words.length)]);
  g.set('r3Drawer', { rack: 'ABC'[Math.floor(Math.random() * 3)], n: 1 + Math.floor(Math.random() * 4) });
}

// ---------------------------------------------------------------- art helpers

// Morse timing, in units of UNIT seconds. Stretched compared to real Morse
// (dash 3, letter gap 3, word gap 7) so it's easy to follow by eye.
const UNIT = 0.3;
const TIMING = { dot: 1, dash: 4, symbolGap: 1, letterGap: 6, wordGap: 16 };

/** On/off steps for `word` plus the [start, end] time span (in units) of each letter. */
function morseTimeline(word) {
  const seq = [], spans = [];
  let t = 0;
  [...word].forEach((ch, i) => {
    const code = MORSE[ch];
    const begin = t;
    [...code].forEach((sym, j) => {
      const on = sym === '.' ? TIMING.dot : TIMING.dash;
      seq.push([1, on]); t += on;
      if (j < code.length - 1) { seq.push([0, TIMING.symbolGap]); t += TIMING.symbolGap; }
    });
    spans.push([begin, t]);
    const gap = i < word.length - 1 ? TIMING.letterGap : TIMING.wordGap;
    seq.push([0, gap]); t += gap;
  });
  return { seq, spans, total: t };
}

const dur = total => `dur="${(total * UNIT).toFixed(2)}s" repeatCount="indefinite"`;

/** SMIL animation that switches an element fully on/off to spell `word` in Morse, looping. */
function morseAnimate(word) {
  const { seq, total } = morseTimeline(word);
  let t = 0;
  const values = [], times = [];
  for (const [on, u] of seq) { times.push((t / total).toFixed(4)); values.push(on); t += u; }
  return `<animate attributeName="opacity" calcMode="discrete" values="${values.join(';')}" keyTimes="${times.join(';')}" ${dur(total)}/>`;
}

/** Animation that is on only while letter `i` of `word` is being sent (in sync with morseAnimate). */
function letterAnimate(word, i) {
  const { spans, total } = morseTimeline(word);
  const [b, e] = spans[i].map(x => (x / total).toFixed(4));
  return i === 0
    ? `<animate attributeName="opacity" calcMode="discrete" values="1;0" keyTimes="0;${e}" ${dur(total)}/>`
    : `<animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;${b};${e}" ${dur(total)}/>`;
}

/** Easy/medium: letter-position lights are shown (only for words that fit the 4 positions). */
const showPositions = g => g.flag('power') && g.difficulty !== 'hard' && wordOf(g).length <= 4;

/** A small amber lamp that lights while letter n (1-based) is being blinked. */
function positionLamp(cx, cy, r, n, g) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#2a1a08" stroke="#111" stroke-width="${r * 0.3}"/>
    ${showPositions(g) && n <= wordOf(g).length ? `<g opacity="0">${letterAnimate(wordOf(g), n - 1)}
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffc340" filter="url(#glow)"/></g>` : ''}`;
}

/** A status lamp: dark base plus a lit layer that blinks the Morse word. */
function morseLamp(cx, cy, r, g) {
  const power = g.flag('power');
  return `
    <circle cx="${cx}" cy="${cy}" r="${r + r * 0.25}" fill="#111"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#2a1a08"/>
    ${power ? `<g opacity="0">${morseAnimate(wordOf(g))}
      <circle cx="${cx}" cy="${cy}" r="${r * 1.7}" fill="#ffb020" opacity=".25"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffc340" filter="url(#glow)"/>
      <circle cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" r="${r * 0.3}" fill="#fff6d8"/>
    </g>` : ''}`;
}

/** Dark red emergency lighting until the power is back. */
const lighting = g => g.flag('power') ? finish() : finish({ flicker: false }) + `
  <rect width="800" height="600" fill="#b83030" style="mix-blend-mode:multiply"/>
  <rect width="800" height="600" fill="#000" opacity=".12"/>
  <rect x="384" y="44" width="32" height="14" rx="3" fill="#ff3a2a" filter="url(#glow)">
    <animate attributeName="opacity" values="1;.55;1" dur="2.4s" repeatCount="indefinite"/>
  </rect>`;

function rack(letter, g) {
  const x = RACKS[letter];
  const power = g.flag('power');
  const released = g.flag('terminalUnlocked');
  const target = drawerOf(g);
  const isOpenRack = g.flag('fobDrawerOpen') && target.rack === letter;
  let servers = '';
  for (let i = 0; i < 7; i++) {
    const y = 140 + i * 20;
    servers += `<rect x="${x + 10}" y="${y}" width="120" height="16" fill="#2a2e33"/>
      <rect x="${x + 60}" y="${y + 6}" width="60" height="3" fill="#1a1d20"/>`;
    for (const k of [0, 1]) {
      const dur = (0.4 + ((i * 7 + k * 13 + x) % 11) / 10).toFixed(2);
      servers += `<circle cx="${x + 20 + k * 10}" cy="${y + 8}" r="2.5" fill="${power ? (k ? '#3af' : '#3f6') : '#222'}">
        ${power ? `<animate attributeName="opacity" values="1;.2;1" dur="${dur}s" repeatCount="indefinite"/>` : ''}</circle>`;
    }
  }
  let drawers = '';
  for (let n = 1; n <= 4; n++) {
    const y = drawerY(n);
    if (isOpenRack && target.n === n) {
      drawers += `<rect x="${x + 10}" y="${y}" width="120" height="38" fill="#050607"/>`;
      continue;
    }
    drawers += `
      <rect x="${x + 10}" y="${y}" width="120" height="38" fill="#33383d" stroke="#1a1d20" stroke-width="2"/>
      <rect x="${x + 50}" y="${y + 15}" width="40" height="7" rx="3" fill="#1a1d20"/>
      <text x="${x + 20}" y="${y + 25}" font-size="12" font-family="Arial, sans-serif" font-weight="bold" fill="#8a9097">${n}</text>
      <circle cx="${x + 118}" cy="${y + 19}" r="3" fill="${!power ? '#300' : released ? '#3f3' : '#f33'}"/>
      ${letter === 'C' && showPositions(g) ? positionLamp(x + 36, y + 19, 4, n, g) : ''}`;
  }
  let tray = '';
  if (isOpenRack) {
    const y = drawerY(target.n);
    tray = `
      <polygon points="${x + 6},${y + 38} ${x + 134},${y + 38} ${x + 150},${y + 74} ${x - 10},${y + 74}" fill="#3a3f44" stroke="#1a1d20" stroke-width="2"/>
      <polygon points="${x + 12},${y + 42} ${x + 128},${y + 42} ${x + 140},${y + 68} ${x},${y + 68}" fill="#23272b"/>
      ${!g.flag('took:fob') ? `<g transform="translate(${x + 26},${y + 46}) rotate(-10)">
        <circle cx="6" cy="6" r="6" fill="none" stroke="#9aa7ad" stroke-width="2.5"/>
        <path d="M10 10 q16 2 22 12 q2 8 -6 9 q-14 2 -18 -10 Z" fill="#2a6ab0"/></g>` : ''}
      ${!g.flag('photo3') ? `<g transform="translate(${x + 84},${y + 46}) rotate(8)">
        <rect width="34" height="26" fill="#e9e1c8"/><rect x="3" y="3" width="28" height="20" fill="#a08a64"/></g>` : ''}`;
  }
  const morse = letter === 'C' ? `
    <text x="${x + 72}" y="${123}" font-size="8" font-family="Arial, sans-serif" fill="#8a9097">STATUS</text>
    ${morseLamp(x + 122, 119, 8, g)}` : '';
  return `
    <rect x="${x}" y="100" width="140" height="370" fill="#1c1f22" stroke="#3a3f44" stroke-width="3"/>
    <rect x="${x + 6}" y="108" width="34" height="24" fill="#d8dcd4"/>
    <text x="${x + 23}" y="127" font-size="18" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">${letter}</text>
    ${morse}${servers}${drawers}${tray}`;
}

// ---------------------------------------------------------------- scenes art

const north = g => room({ light: g.flag('power') }) + `
  <rect y="38" width="800" height="14" fill="#2a2e33"/>
  ${[180, 400, 600].map(x => `<path d="M${x} 52 q10 30 -4 48" stroke="#1a1d20" stroke-width="6" fill="none"/>`).join('')}
  ${rack('A', g)}${rack('B', g)}${rack('C', g)}
  ` + lighting(g);

const east = g => {
  const power = g.flag('power');
  const unlocked = g.flag('terminalUnlocked');
  return room({ light: power }) + `
  <rect x="172" y="38" width="16" height="74" fill="#5a6066"/>
  <rect x="100" y="110" width="170" height="230" fill="#7d837f" stroke="#3a3f3c" stroke-width="4"/>
  <rect x="112" y="122" width="146" height="206" fill="#8c928e"/>
  <polygon points="185,160 225,230 145,230" fill="#e3b81f" stroke="#222" stroke-width="4" stroke-linejoin="round"/>
  <path d="M190 172 l-14 30 h12 l-8 22 l20 -32 h-12 l8 -20 Z" fill="#222"/>
  <text x="185" y="262" font-size="13" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">DANGER</text>
  <text x="185" y="280" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" fill="#222">HIGH VOLTAGE</text>
  <rect x="244" y="210" width="8" height="34" rx="2" fill="#3a3f3c"/>

  <rect x="400" y="330" width="330" height="14" fill="#4a3a2c"/>
  <rect x="410" y="344" width="12" height="126" fill="#3a2d22"/><rect x="708" y="344" width="12" height="126" fill="#3a2d22"/>
  <rect x="480" y="196" width="150" height="128" rx="8" fill="#cfc8b0" stroke="#8a8470" stroke-width="2"/>
  <rect x="496" y="210" width="118" height="92" rx="6" fill="${power ? '#06200c' : '#0b0d0c'}"/>
  ${power ? `<g font-family="Courier New, monospace" font-size="11" fill="#5f5" filter="url(#glow)">
    <text x="504" y="230">NETOPS v4</text>
    <text x="504" y="250">${unlocked ? 'SESSION OPEN' : 'MAINT KEY:'}</text>
    <text x="504" y="270">_<animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></text>
  </g>` : ''}
  <rect x="530" y="324" width="50" height="8" fill="#a8a28c"/>
  <polygon points="498,324 612,324 620,331 490,331" fill="#bdb6a0" stroke="#8a8470" stroke-width="1"/>
  <rect x="660" y="300" width="24" height="30" rx="3" fill="#8a2a2a"/>
  <path d="M520 470 v-60 h70 v60 M510 400 h90 v-60 h-90 Z" fill="#1d2024" stroke="#111" stroke-width="2"/>
  ` + lighting(g);
};

const south = g => {
  const box = g.flag('toolboxOpen');
  const fuse = !g.flag('took:fuse');
  return room({ light: g.flag('power') }) + `
  ${doorSign('CHEM LAB', 'flask')}
  ${door({ open: true })}

  <rect x="66" y="96" width="220" height="190" fill="#7a5a3a" stroke="#4a3626" stroke-width="6"/>
  <rect x="88" y="116" width="120" height="146" fill="#efe9d6" transform="rotate(-3 148 190)"/>
  <text x="148" y="138" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#333" transform="rotate(-3 148 190)">MORSE CODE</text>
  <g fill="#555" transform="rotate(-3 148 190)">${Array.from({ length: 9 }, (_, i) => `<rect x="98" y="${148 + i * 12}" width="${30 + (i % 3) * 18}" height="3"/><rect x="160" y="${148 + i * 12}" width="${24 + (i % 2) * 14}" height="3"/>`).join('')}</g>
  <circle cx="148" cy="118" r="4" fill="#c33"/>
  <rect x="216" y="130" width="58" height="52" fill="#f4e27a" transform="rotate(5 245 156)"/>
  <rect x="222" y="200" width="54" height="66" fill="#e9eef0" transform="rotate(-4 249 233)"/>
  <circle cx="246" cy="132" r="3" fill="#36c"/><circle cx="249" cy="202" r="3" fill="#3a3"/>

  <rect x="560" y="120" width="150" height="100" fill="#e9eef0"/>
  <rect x="560" y="120" width="150" height="24" fill="#a8322a"/>
  <text x="635" y="137" font-size="12" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#fff">NOTICE</text>
  <text x="635" y="168" font-size="11" text-anchor="middle" font-family="Arial, sans-serif" fill="#333">NO FOOD OR DRINK</text>
  <text x="635" y="186" font-size="11" text-anchor="middle" font-family="Arial, sans-serif" fill="#333">NEAR THE RACKS</text>
  <text x="635" y="208" font-size="9" text-anchor="middle" font-family="Arial, sans-serif" fill="#777">— IT Dept.</text>

  <ellipse cx="625" cy="472" rx="80" ry="7" fill="#000" opacity=".45"/>
  ${box ? `
    <rect x="560" y="420" width="130" height="50" rx="4" fill="#a8322a" stroke="#5a1a14" stroke-width="2"/>
    <polygon points="560,420 690,420 700,380 570,380" fill="#8a2820" stroke="#5a1a14" stroke-width="2"/>
    <rect x="568" y="412" width="114" height="12" fill="#1a1414"/>
    <path d="M580 414 l30 -10 M640 412 l24 -4" stroke="#999" stroke-width="4"/>
    ${fuse ? `<g transform="translate(616,402) rotate(-12)"><rect width="34" height="14" rx="2" fill="#efe9d6"/>
      <rect x="-6" y="2" width="8" height="10" fill="#b9bdb6"/><rect x="32" y="2" width="8" height="10" fill="#b9bdb6"/></g>` : ''}
  ` : `
    <rect x="560" y="420" width="130" height="50" rx="4" fill="#a8322a" stroke="#5a1a14" stroke-width="2"/>
    <rect x="556" y="410" width="138" height="16" rx="3" fill="#8a2820" stroke="#5a1a14" stroke-width="2"/>
    <rect x="605" y="400" width="40" height="10" rx="3" fill="none" stroke="#333" stroke-width="4"/>
    <rect x="574" y="426" width="10" height="8" fill="#ccc"/><rect x="666" y="426" width="10" height="8" fill="#ccc"/>
  `}
  ` + lighting(g);
};

const west = g => {
  const open = g.flag('door3Open');
  const power = g.flag('power');
  return room({ light: power }) + `
  ${doorSign('CRYO STORAGE', 'snow', { bg: '#1a4a6a', fg: '#dff2ff' })}
  ${door({ open, label: 'D-03' })}
  ${open ? `<rect x="352" y="166" width="128" height="286" fill="#9fd4ff" opacity=".08"/>` : `
    <path d="M320 470 q20 -30 40 -8 q20 -26 40 -4 q20 -22 40 -2 q20 -18 40 -6 V470 Z" fill="#e8f6ff" opacity=".55"/>
    <path d="M330 150 q4 20 -2 40 M470 160 q-6 14 2 30" stroke="#e8f6ff" stroke-width="3" opacity=".4" fill="none"/>`}
  <ellipse cx="400" cy="486" rx="120" ry="10" fill="#cfeaff" opacity=".18"/>
  <g transform="translate(505,288)">
    <rect width="48" height="64" rx="6" fill="#1b201e" stroke="#4d5551" stroke-width="2"/>
    <circle cx="24" cy="28" r="15" fill="#0c0e0d" stroke="${power ? '#3a8ae0' : '#222'}" stroke-width="3" ${power ? 'filter="url(#glow)"' : ''}/>
    <circle cx="24" cy="54" r="3.5" fill="${!power ? '#300' : open ? '#3f3' : '#f33'}"/>
  </g>
  <g transform="translate(640,360)">
    <rect x="0" y="0" width="34" height="100" rx="12" fill="#c8322a"/>
    <rect x="6" y="-14" width="22" height="16" fill="#222"/>
    <path d="M28 -8 q24 4 20 40" stroke="#222" stroke-width="5" fill="none"/>
    <rect x="4" y="34" width="26" height="30" fill="#efe9d6"/>
  </g>
  <rect y="60" width="800" height="12" fill="#2a2e33"/>
  ` + lighting(g);
};

const panel = g => {
  const fuseIn = g.flag('fuseIn');
  const power = g.flag('power');
  const fuseSlot = (y, label, state) => `
    <text x="150" y="${y - 12}" font-size="14" font-family="Arial, sans-serif" font-weight="bold" fill="#222">${label}</text>
    <rect x="140" y="${y}" width="170" height="54" rx="4" fill="#2a2e33"/>
    <rect x="150" y="${y + 10}" width="22" height="34" fill="#9aa0a6"/><rect x="278" y="${y + 10}" width="22" height="34" fill="#9aa0a6"/>
    <rect x="166" y="${y + 14}" width="118" height="26" rx="4" fill="${state === 'blown' ? '#2a2420' : '#efe9d6'}"/>
    ${state === 'blown'
      ? `<path d="M190 ${y + 18} l20 18 l14 -14 l22 16" stroke="#000" stroke-width="2" fill="none"/>
         <ellipse cx="225" cy="${y + 27}" rx="30" ry="8" fill="#000" opacity=".5"/>`
      : `<text x="225" y="${y + 32}" font-size="12" text-anchor="middle" font-family="Arial" font-weight="bold" fill="#a3221c">30A</text>`}`;
  let matrix = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++)
    matrix += `<rect x="${400 + c * 52}" y="${170 + r * 52}" width="46" height="46" rx="3" fill="#121614" stroke="#3c443f" stroke-width="2"/>
      <path d="M${423 + c * 52} ${178 + r * 52} v30" stroke="${power ? '#ffd23a' : '#3a403c'}" stroke-width="7" transform="rotate(${(r * 3 + c * 2) % 4 * 90} ${423 + c * 52} ${193 + r * 52})"/>`;
  return closeup('#1a1f1c') + `
  <rect x="86" y="54" width="640" height="500" fill="#000" opacity=".4"/>
  <rect x="80" y="46" width="640" height="500" fill="#8c928e" stroke="#3a3f3c" stroke-width="6"/>
  <text x="400" y="90" font-size="20" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">SUBLEVEL 5 · DISTRIBUTION BOARD</text>
  ${fuseSlot(150, 'MAIN', 'ok')}
  ${fuseSlot(270, 'RACKS', fuseIn ? 'ok' : 'blown')}
  ${fuseSlot(390, 'LIGHTS', 'ok')}
  <rect x="380" y="130" width="300" height="270" fill="#22272a" stroke="#3a3f3c" stroke-width="3"/>
  <text x="530" y="156" font-size="13" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="${power ? '#ffd23a' : fuseIn ? '#e6dca0' : '#555'}">ROUTING MATRIX</text>
  ${matrix}
  ${fuseIn && !power ? `<rect x="380" y="130" width="300" height="270" fill="none" stroke="#e6c84a" stroke-width="3">
    <animate attributeName="opacity" values="1;.2;1" dur="1.5s" repeatCount="indefinite"/></rect>` : ''}
  <circle cx="420" cy="440" r="8" fill="${power ? '#3f3' : '#300'}" ${power ? 'filter="url(#glow)"' : ''}/>
  <text x="436" y="445" font-size="13" font-family="Arial, sans-serif" fill="#222">RACK POWER</text>
  ` + lighting(g);
};

const morseCard = g => {
  const letters = Object.entries(MORSE);
  const fmt = code => [...code].map(s => (s === '.' ? '●' : '▬')).join(' ');
  const col = (list, x) => list.map(([l, c], i) => `
    <text x="${x}" y="${132 + i * 31}" font-size="20" font-family="Arial, sans-serif" font-weight="bold" fill="#222">${l}</text>
    <text x="${x + 32}" y="${131 + i * 31}" font-size="14" font-family="Arial, sans-serif" fill="#333">${fmt(c)}</text>`).join('');
  return closeup('#6a4a2e') + `
  <rect x="216" y="40" width="380" height="510" fill="#000" opacity=".35"/>
  <g transform="rotate(-1.5 400 300)">
    <rect x="210" y="34" width="380" height="510" fill="#efe9d6"/>
    <circle cx="400" cy="48" r="7" fill="#c33"/>
    <text x="400" y="84" font-size="20" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">MORSE CODE</text>
    <text x="400" y="104" font-size="11" text-anchor="middle" font-family="Arial, sans-serif" fill="#555">HELIX AMATEUR RADIO CLUB · MEETS THURSDAYS</text>
    ${col(letters.slice(0, 13), 250)}
    ${col(letters.slice(13), 430)}
  </g>
  ${g.difficulty === 'hard' ? '' : `
  <g transform="rotate(6 690 200)">
    <rect x="618" y="130" width="150" height="140" fill="#f4e27a"/>
    <g font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive" font-size="14" fill="#1f2a5a">
      <text x="630" y="160">Rack C status LED:</text>
      <text x="630" y="184">short = dot</text>
      <text x="630" y="206">long = dash</text>
      <text x="630" y="228">lamps 1-4 = which letter</text>
      <text x="630" y="254">— IT</text>
    </g>
  </g>`}
  ` + finish({ flicker: false });
};

const statusCloseup = g => closeup('#141618') + `
  <rect x="150" y="60" width="500" height="460" rx="6" fill="#1c1f22" stroke="#3a3f44" stroke-width="4"/>
  <rect x="170" y="80" width="80" height="60" fill="#d8dcd4"/>
  <text x="210" y="125" font-size="44" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">C</text>
  <text x="400" y="150" font-size="22" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#8a9097">NODE STATUS</text>
  ${morseLamp(400, 290, 70, g)}
  ${showPositions(g) ? [1, 2, 3, 4].map(n => `
    ${positionLamp(265 + (n - 1) * 90, 432, 15, n, g)}
    <text x="${265 + (n - 1) * 90}" y="482" font-size="18" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#8a9097">${n}</text>`).join('')
    : [0, 1, 2].map(i => `<rect x="${190 + i * 150}" y="440" width="120" height="16" fill="#2a2e33"/>`).join('')}
  ` + finish({ flicker: false });

const screen = g => {
  const d = drawerOf(g);
  const lines = [
    'HELIX NETOPS // RACK CONTROLLER',
    'SESSION: MAINTENANCE',
    '----------------------------------------',
    '02:58  EVACUATION ORDER RECEIVED',
    '03:06  CRYO B CONTAINMENT ALARM',
    '03:09  CRYO B CONTAINMENT ALARM',
    `03:11  E.VOSS: "fob is in rack ${d.rack}, drawer ${d.n}.`,
    '              whoever finds this: do NOT',
    '              open pod B."',
    '03:15  UPS FAILURE. SHUTTING DOWN.',
    '',
    '>> RACK DRAWER LOCKS RELEASED',
  ];
  return `${DEFS}
  <rect width="800" height="600" fill="#0b0c0b"/>
  <rect x="90" y="40" width="620" height="500" rx="30" fill="#cfc8b0" stroke="#8a8470" stroke-width="4"/>
  <rect x="130" y="76" width="540" height="410" rx="24" fill="#041a09"/>
  <g font-family="Courier New, monospace" font-size="17" fill="#5f5" filter="url(#glow)">
    ${lines.map((l, i) => `<text x="156" y="${116 + i * 28}" xml:space="preserve">${l.replace(/</g, '&lt;')}</text>`).join('')}
  </g>
  <clipPath id="crt"><rect x="130" y="76" width="540" height="410" rx="24"/></clipPath>
  <g clip-path="url(#crt)">
    <rect x="130" y="76" width="540" height="410" fill="url(#vignette)"/>
    ${Array.from({ length: 70 }, (_, i) => `<rect x="130" y="${76 + i * 6}" width="540" height="2" fill="#000" opacity=".25"/>`).join('')}
  </g>`;
};

// ---------------------------------------------------------------- hotspots

// The racks blow hot air once powered: using the frozen keycard (room 4) on ANY
// part of a rack thaws it. Every rack hotspot shares this handler.
function thawIce(g) {
  if (!g.flag('power')) return g.say('The racks are cold and dead. No heat here.');
  g.take('ice');
  g.give('dircard');
  g.say('You hold the ice block against the roaring server exhaust. It drips, cracks, and finally lets go of the keycard!');
}
const RACK_USE = { ice: thawIce };

function drawerHotspots() {
  const out = [];
  // whole-rack hotspots go first so the smaller ones (drawers, servers, light) sit on top
  for (const [letter, x] of Object.entries(RACKS)) {
    out.push({
      id: `rack-${letter}`, label: `Rack ${letter}`, rect: [x, 100, 140, 370],
      sparkle: g => g.has('ice'),
      say: g => g.flag('power') ? 'The rack hums, blasting hot air from its vents.' : 'A dead server rack.',
      use: RACK_USE,
    });
  }
  for (const [letter, x] of Object.entries(RACKS)) {
    for (let n = 1; n <= 4; n++) {
      const y = drawerY(n);
      const isTarget = g => { const d = drawerOf(g); return d.rack === letter && d.n === n; };
      out.push({
        id: `drawer-${letter}${n}`, label: `Rack ${letter}, drawer ${n}`, rect: [x + 10, y, 120, 38],
        when: g => !(isTarget(g) && g.flag('fobDrawerOpen')),
        sparkle: g => g.difficulty === 'easy' && g.flag('terminalUnlocked') && isTarget(g),
        use: RACK_USE,
        click: g => {
          if (!g.flag('power')) return g.say('Electronic lock. Dead, like everything else in here.');
          if (!g.flag('terminalUnlocked')) return g.say("Locked. A tiny red LED: the rack controller hasn't released it.");
          if (isTarget(g)) {
            g.set('fobDrawerOpen');
            return g.say('The drawer slides out. Something blue is inside!');
          }
          g.say(['Just a nest of tangled patch cables.', 'Spare hard drives. Nothing useful.', 'Empty, apart from a dead spider.'][(n + x) % 3]);
        },
      });
    }
  }
  // contents of the open drawer
  const at = (dx, dy, w, h) => g => { const d = drawerOf(g); return [RACKS[d.rack] + dx, drawerY(d.n) + dy, w, h]; };
  out.push({
    id: 'fob', label: 'Fob', take: 'fob', rect: at(18, 40, 52, 32),
    when: g => g.flag('fobDrawerOpen'),
    say: 'A blue key fob tagged "CRYO". You pocket it.',
    use: RACK_USE,
  });
  out.push({
    id: 'photo3', label: 'Photo scrap', rect: at(78, 40, 50, 32), sparkle: true,
    when: g => g.flag('fobDrawerOpen') && !g.flag('photo3'),
    click: g => findPhotoPiece(g, 'photo3'),
    use: RACK_USE,
  });
  return out;
}

const northScene = {
  room: 'r3',
  nav: { left: 'r3-west', right: 'r3-east' },
  hotspots: drawerHotspots(),
};
northScene.art = north;
northScene.enter = g => {
  if (!g.flag('r3Seen')) {
    g.set('r3Seen');
    g.say('Only red emergency lights. The server racks are dead silent. The power is out.', 5000);
  }
};
for (const [letter, x] of Object.entries(RACKS)) {
  northScene.hotspots.push({
    id: `servers-${letter}`, label: `Rack ${letter} servers`, rect: [x + 8, 136, 124, 146],
    say: g => g.flag('power') ? 'The servers roar, blasting hot air from their vents.' : 'Silent, dead servers.',
    use: RACK_USE,
  });
}

northScene.hotspots.push({
  id: 'morse-led', label: 'Rack C status light', circle: [652, 119, 16],
  sparkle: g => g.flag('power') && !g.flag('terminalUnlocked'),
  say: g => g.flag('power') ? '' : 'A dead status light.',
  go: g => g.flag('power') ? 'r3-status' : null,
  use: RACK_USE,
});

// ---------------------------------------------------------------- export

export default {
  id: 'r3',
  name: 'Room 3 · Server Room',
  setup,
  hints: [
    { when: g => !g.flag('fuseIn') && !g.has('fuse'), text: 'The power is out. The breaker panel has a blown fuse: look around for spare parts.' },
    { when: g => !g.flag('fuseIn'), text: 'Open the breaker panel and use the spare fuse on the blown one.' },
    { when: g => !g.flag('power'), text: 'Rotate the routing matrix tiles until POWER connects to RACKS.' },
    { when: g => !g.flag('terminalUnlocked'), text: g => g.difficulty === 'easy'
      ? `The status light on rack C blinks Morse code. Decode it with the chart on the corkboard and type it into the terminal. (It spells ${wordOf(g).length} letters.)`
      : 'The rack C status light is trying to tell you something.' },
    { when: g => !g.flag('fobDrawerOpen'), text: 'The terminal log says exactly which rack drawer holds the fob.' },
    { when: g => !g.flag('door3Open'), text: 'Use the fob on the reader by the CRYO STORAGE door.' },
    { when: g => !g.flag('photo3'), text: 'Did you take everything from that rack drawer?' },
  ],

  scenes: {
    'r3-north': northScene,

    'r3-east': {
      room: 'r3',
      art: east,
      nav: { left: 'r3-north', right: 'r3-south' },
      hotspots: [
        { id: 'panel', label: 'Breaker panel', rect: [96, 106, 178, 238], go: 'r3-panel', sparkle: g => !g.flag('power') },
        { id: 'terminal', label: 'Terminal', rect: [476, 192, 158, 140],
          sparkle: g => g.flag('power') && !g.flag('terminalUnlocked'),
          click: g => {
            if (!g.flag('power')) return g.say('A chunky old CRT terminal. Dead. No power.');
            if (!g.flag('terminalUnlocked')) return g.puzzle('r3-terminal');
            g.go('r3-screen');
          },
          use: { ice: g => g.say("The old CRT is barely lukewarm. You'd need something that's blasting out heat.") } },
        { id: 'mug', label: 'Mug', rect: [656, 296, 32, 38], say: 'NO FOOD OR DRINK NEAR THE RACKS. Somebody ignored the sign.' },
        { id: 'chair', label: 'Chair', rect: [508, 338, 96, 132], say: 'An office chair with one wheel missing. It lists sadly to the left.' },
      ],
    },

    'r3-south': {
      room: 'r3',
      art: south,
      nav: { left: 'r3-east', right: 'r3-west' },
      hotspots: [
        { id: 'back', label: 'Back to the chemistry lab', rect: [320, 150, 160, 320], go: 'r2-north' },
        { id: 'corkboard', label: 'Corkboard', rect: [64, 94, 224, 194], go: 'r3-morse', sparkle: g => g.flag('power') },
        { id: 'notice', label: 'Notice', rect: [558, 118, 154, 104], say: '"NO FOOD OR DRINK NEAR THE RACKS. — IT Dept." Underlined three times.' },
        { id: 'toolbox', label: 'Toolbox', rect: [554, 398, 142, 74],
          when: g => !g.flag('toolboxOpen'), sparkle: true,
          click: g => { g.set('toolboxOpen'); g.say('You flip the latches and the lid creaks open.'); } },
        { id: 'toolbox-open', label: 'Toolbox', rect: [556, 378, 146, 94],
          when: g => g.flag('toolboxOpen'),
          say: 'Screwdrivers, electrical tape and a dead multimeter.' },
        { id: 'fuse', label: 'Spare fuse', rect: [604, 392, 58, 30], take: 'fuse',
          when: g => g.flag('toolboxOpen'),
          say: 'A spare 30-amp fuse, still in its sleeve. Handy.' },
      ],
    },

    'r3-west': {
      room: 'r3',
      art: west,
      nav: { left: 'r3-south', right: 'r3-north' },
      hotspots: [
        { id: 'door', label: 'Door D-03', rect: [320, 150, 160, 320],
          when: g => !g.flag('door3Open'),
          say: 'Frost creeps out from under the door. It is locked, and there is a fob reader beside it.',
          use: { fob: g => g.say('Try the reader beside the door.') } },
        { id: 'exit', label: 'Into Cryo Storage', rect: [320, 150, 160, 320],
          when: g => g.flag('door3Open'), go: 'r4-north' },
        { id: 'reader', label: 'Fob reader', rect: [500, 282, 58, 76],
          when: g => !g.flag('door3Open'), sparkle: g => g.has('fob'),
          say: g => g.flag('power') ? 'A round fob reader, glowing blue.' : 'A fob reader. Dead.',
          use: {
            fob: g => {
              g.take('fob');
              g.set('door3Open');
              g.say('The reader chirps. Door D-03 unseals with a gasp of freezing air.');
            },
          } },
        { id: 'extinguisher', label: 'Fire extinguisher', rect: [634, 344, 54, 120],
          say: "A CO₂ extinguisher. Heavy, and bolted to the wall. It's not going anywhere." },
      ],
    },

    'r3-panel': {
      room: 'r3',
      art: panel,
      nav: { back: 'r3-east' },
      hotspots: [
        { id: 'fuse-main', label: 'MAIN fuse', rect: [140, 150, 170, 54], say: 'This one looks fine.' },
        { id: 'fuse-lights', label: 'LIGHTS fuse', rect: [140, 390, 170, 54], say: 'This one looks fine.' },
        { id: 'fuse-racks', label: 'RACKS fuse', rect: [140, 270, 170, 54],
          sparkle: g => !g.flag('fuseIn'),
          say: g => g.flag('fuseIn') ? 'The new fuse sits snugly in its clips.' : 'This fuse is blown: the glass is blackened and cracked.',
          use: {
            fuse: g => {
              g.take('fuse');
              g.set('fuseIn');
              g.say('You pull the blown fuse and push the spare into the clips. Click. The routing matrix flickers to life.');
            },
          } },
        { id: 'matrix', label: 'Routing matrix', rect: [380, 130, 300, 270],
          sparkle: g => g.flag('fuseIn') && !g.flag('power'),
          click: g => {
            if (g.flag('power')) return g.say('Power is flowing. The racks hum.');
            if (!g.flag('fuseIn')) return g.say("The matrix display is dead. The RACKS fuse looks like it's blown.");
            g.puzzle('r3-grid');
          } },
      ],
    },

    'r3-morse': { room: 'r3', art: morseCard, nav: { back: 'r3-south' }, hotspots: [] },
    'r3-status': { room: 'r3', art: statusCloseup, nav: { back: 'r3-north' }, hotspots: [] },
    'r3-screen': { room: 'r3', art: screen, nav: { back: 'r3-east' }, hotspots: [] },
  },

  puzzles: {
    'r3-grid': {
      type: 'rotate-grid',
      prompt: 'ROUTING MATRIX: connect POWER to the RACKS. Click a tile to rotate it.',
      // solved layout; bits N=1 E=2 S=4 W=8
      tiles: [
        [7, 5, 3, 15, 6],
        [12, 6, 10, 12, 5],
        [3, 9, 7, 5, 6],
        [10, 3, 12, 3, 9],
      ],
      source: { row: 1, side: 'W' },
      sink: { row: 2, side: 'E' },
      sourceLabel: 'POWER ▶',
      sinkLabel: '▶ RACKS',
      seed: 1234,
      solve: g => {
        g.set('power');
        g.say('A deep THUNK. Fluorescent lights stutter on and the racks roar back to life!', 5000);
      },
    },

    'r3-terminal': {
      type: 'password',
      solution: wordOf,
      config: g => ({
        lines: [
          'HELIX NETOPS // RACK CONTROLLER',
          'NODE STATUS: DEGRADED',
          '------------------------------',
          'ENTER MAINTENANCE KEY:',
          ...(g.difficulty === 'hard' ? [] : ['(the key is on broadcast. rack C. - IT)']),
        ],
      }),
      okText: 'KEY ACCEPTED. OPENING SESSION...',
      solve: g => {
        g.set('terminalUnlocked');
        g.go('r3-screen');
        g.say('Across the racks, drawer locks clunk open.');
      },
    },
  },
};

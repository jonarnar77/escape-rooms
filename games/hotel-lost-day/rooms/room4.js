// ROOM 4 — Ballroom
// Purpose: learn how the hotel removes a day.
// Fact: the hotel stores surrendered days rather than destroying them.
//
//   1. The interrupted waltz: the player-orchestra's paper roll is cut into five pieces.
//      A melody line runs across the roll, so each piece continues the last; the title
//      piece is first and "FINE" last. Restored, the waltz plays to the end at last,
//      and the dance floor wakes up.
//   2. The dance floor (only after the music): 5x5 tiles, letters along the front edge,
//      numbers up the side. Miss Ito's dance card: "Waltz: B2 B3 B4 C1 C5 D1 D5"
//      (her crescent moon). Step exactly those tiles -> the stage controls unlock.
//   3. The stage (only after the floor): levers for curtain, backdrop and lights change
//      the stage live. Match yesterday's photo (curtain open, sea backdrop, blue star-
//      pattern lights) -> the under-stage hatch opens onto the memory archive.
//   archive: jars of surrendered days, one labelled "6 November · 204"; a door marked MANAGER.

import { DEFS, closeup, deskTop, finish, hand, serif, rng } from '../art/common.js';
import { EMBLEMS, symAt } from '../art/symbols.js';

// ---------------------------------------------------------------- data

const COLS = ['A', 'B', 'C', 'D', 'E'];
const WALTZ = ['B2', 'B3', 'B4', 'C1', 'C5', 'D1', 'D5'];
const STAGE = {
  curtain: ['closed', 'half', 'open'],
  backdrop: ['garden', 'sea', 'city', 'night'],
  lights: ['warm', 'blue', 'red', 'dark'],
};
const YESTERDAY = { curtain: 'open', backdrop: 'sea', lights: 'blue' };
const TODAY_START = { curtain: 'closed', backdrop: 'garden', lights: 'warm' };
const stageOf = g => ({ ...TODAY_START, ...(g.get('stage') ?? {}) });
const pressedOf = g => g.get('tiles') ?? [];
const NAMES = {
  closed: 'closed', half: 'half open', open: 'open', garden: 'a garden', sea: 'the sea in rain', city: 'a city street',
  night: 'a starry night', warm: 'warm, plain', blue: 'blue, with a pattern of stars', red: 'red, with stripes', dark: 'off',
};

// ---------------------------------------------------------------- dance floor geometry (perspective)

// the front edge stops above the Back arrow (y 534+) so no tile ever sits under it
const FLOOR = { bl: [160, 352], br: [640, 352], fl: [40, 526], fr: [760, 526] };
const DEPTH = [0, 0.13, 0.29, 0.48, 0.71, 1];     // row edges from the back (0) to the front (1)
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const floorPt = (u, v) => lerp(lerp(FLOOR.bl, FLOOR.br, u), lerp(FLOOR.fl, FLOOR.fr, u), v);
/** Tile like "C3": column A-E left to right, row 1 at the front to 5 at the back. */
function tilePoly(id) {
  const c = COLS.indexOf(id[0]), r = Number(id[1]);
  const b = 5 - r, u0 = c / 5, u1 = (c + 1) / 5, v0 = DEPTH[b], v1 = DEPTH[b + 1];
  return [floorPt(u0, v0), floorPt(u1, v0), floorPt(u1, v1), floorPt(u0, v1)].map(p => p.map(Math.round));
}
const ALL_TILES = COLS.flatMap(c => [1, 2, 3, 4, 5].map(r => `${c}${r}`));

// ---------------------------------------------------------------- the music roll

// One melody line runs across the whole roll; it is cut into five pieces.
const ROLL = (() => {
  // parameters chosen so the four hand-over heights are clearly different (0.12, 0.80, 0.34, 0.57)
  const r = rng(34), holes = [];
  for (let i = 0; i < 40; i++) holes.push(0.5 + 0.34 * Math.sin(i * 0.47 + 0.9) + (r() - 0.5) * 0.16);
  return holes;
})();
const edgeH = k => (ROLL[8 * k - 1] + ROLL[8 * k]) / 2;   // where piece k-1 hands over to piece k
function rollPiece(k) {
  const W = 120, H = 70, y = h => 10 + (1 - h) * 50;
  const xs = Array.from({ length: 8 }, (_, i) => 10 + i * 14);
  const pts = [[0, y(k === 0 ? ROLL[0] : edgeH(k))], ...xs.map((x, i) => [x + 3, y(ROLL[8 * k + i])]), [W, y(k === 4 ? ROLL[39] : edgeH(k + 1))]];
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block">
    <rect width="${W}" height="${H}" fill="#efe2c0"/>
    ${Array.from({ length: 12 }, (_, i) => `<circle cx="${5 + i * 10}" cy="3" r="1.4" fill="#8a7a5a"/><circle cx="${5 + i * 10}" cy="${H - 3}" r="1.4" fill="#8a7a5a"/>`).join('')}
    <polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#7a6a8a" stroke-width="1.5" stroke-dasharray="3 2"/>
    ${xs.map((x, i) => `<rect x="${x}" y="${y(ROLL[8 * k + i]) - 3}" width="7" height="6" rx="2" fill="#2a1c10"/>`).join('')}
    ${k === 0 ? `<text x="4" y="66" font-size="7" font-family="Georgia, serif" font-style="italic" fill="#5a4a3a">Waltz No. 6 ▸</text>` : ''}
    ${k === 4 ? `<text x="116" y="66" font-size="8" text-anchor="end" font-family="Georgia, serif" font-weight="bold" fill="#7a1e22">FINE</text>` : ''}
  </svg>`;
}

// ---------------------------------------------------------------- stage drawing

function backdrop(kind) {
  switch (kind) {
    case 'garden': return `<rect x="212" y="112" width="376" height="186" fill="#4a6a3a"/>
      ${[250, 330, 420, 520].map((x, i) => `<path d="M${x} 298 v-60" stroke="#3a2a1a" stroke-width="6"/><circle cx="${x}" cy="${222 - i % 2 * 12}" r="${30 + i % 2 * 8}" fill="#2e5a2a"/>`).join('')}
      <path d="M212 270 q90 -20 188 0 t188 0 v28 h-376 Z" fill="#5a7a3a"/>`;
    case 'sea': return `<rect x="212" y="112" width="376" height="186" fill="#5a6a7a"/>
      <path d="M212 220 q47 -12 94 0 t94 0 t94 0 t94 0 v78 h-376 Z" fill="#2a4a6a"/>
      <path d="M212 250 q47 -10 94 0 t94 0 t94 0 t94 0" stroke="#8aaac8" stroke-width="3" fill="none"/>
      ${Array.from({ length: 18 }, (_, i) => `<line x1="${222 + i * 21}" y1="118" x2="${214 + i * 21}" y2="${150 + (i % 3) * 20}" stroke="#c8d8e8" stroke-width="1.5"/>`).join('')}`;
    case 'city': return `<rect x="212" y="112" width="376" height="186" fill="#6a5a6a"/>
      ${[[220, 170], [270, 140], [330, 190], [390, 130], [460, 160], [520, 150]].map(([x, y]) => `<rect x="${x}" y="${y}" width="52" height="${298 - y}" fill="#3a2a3a"/>
        ${[0, 1, 2].map(k => `<rect x="${x + 10 + k * 12}" y="${y + 14}" width="6" height="8" fill="#f0d890"/>`).join('')}`).join('')}`;
    case 'night': return `<rect x="212" y="112" width="376" height="186" fill="#141a34"/>
      <circle cx="500" cy="160" r="24" fill="#f0e8c0"/><circle cx="510" cy="152" r="22" fill="#141a34"/>
      ${Array.from({ length: 22 }, (_, i) => `<circle cx="${226 + (i * 67) % 350}" cy="${124 + (i * 41) % 150}" r="1.6" fill="#fff"/>`).join('')}`;
  }
  return '';
}

function lights(kind) {
  if (kind === 'dark') return `<rect x="212" y="112" width="376" height="186" fill="#000" opacity=".55"/>`;
  const col = { warm: '#ffd890', blue: '#7ab0ff', red: '#ff6a5a' }[kind];
  const beams = [250, 400, 550].map(x => `<polygon points="${x - 8},104 ${x + 8},104 ${x + 70},298 ${x - 70},298" fill="${col}" opacity=".22"/>`).join('');
  let pattern = '';
  if (kind === 'blue') pattern = Array.from({ length: 16 }, (_, i) => {
    const x = 230 + (i * 47) % 340, y = 230 + (i * 23) % 60;
    return `<path d="M${x} ${y - 6} l2 4 l5 0 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 l5 0 Z" fill="#cfe0ff" opacity=".85"/>`;
  }).join('');
  if (kind === 'red') pattern = Array.from({ length: 9 }, (_, i) => `<rect x="${222 + i * 42}" y="220" width="16" height="78" fill="#ff8a7a" opacity=".45"/>`).join('');
  return beams + pattern;
}

function curtain(state) {
  const drape = (x0, x1, dir) => {
    const folds = Array.from({ length: 5 }, (_, i) => x0 + (x1 - x0) * (i + 0.5) / 5);
    return `<path d="M${x0} 104 H${x1} V${dir === 'l' ? 300 : 300} H${x0} Z" fill="#8a1a24"/>
      ${folds.map(x => `<path d="M${x} 108 V298" stroke="#5a0e16" stroke-width="3"/>`).join('')}`;
  };
  if (state === 'closed') return drape(208, 400, 'l') + drape(400, 592, 'r') + `<path d="M400 104 V300" stroke="#3a060c" stroke-width="3"/>`;
  if (state === 'half') return drape(208, 300, 'l') + drape(500, 592, 'r');
  return drape(208, 236, 'l') + drape(564, 592, 'r');
}

function stageArt(s, trapOpen) {
  return `
  <rect x="180" y="72" width="440" height="34" fill="url(#brassG)"/>
  <text x="400" y="95" font-size="16" text-anchor="middle" ${serif} letter-spacing="6" fill="#3a2a10">THE HALCYON</text>
  <rect x="180" y="104" width="30" height="200" fill="url(#brassG)"/><rect x="590" y="104" width="30" height="200" fill="url(#brassG)"/>
  <rect x="210" y="104" width="380" height="196" fill="#1a1010"/>
  ${s.curtain === 'closed' ? '' : backdrop(s.backdrop)}
  ${s.curtain === 'closed' ? '' : lights(s.lights)}
  ${[250, 400, 550].map(x => `<rect x="${x - 10}" y="104" width="20" height="10" rx="3" fill="#2a2a2a"/>
    <circle cx="${x}" cy="114" r="5" fill="${s.lights === 'dark' ? '#333' : { warm: '#ffd890', blue: '#7ab0ff', red: '#ff6a5a' }[s.lights]}"/>`).join('')}
  ${curtain(s.curtain)}
  <rect x="200" y="100" width="400" height="12" fill="#6a1018"/>
  <polygon points="190,300 610,300 620,312 180,312" fill="#5a3a20"/>
  <rect x="180" y="312" width="440" height="40" fill="#3a2414"/>
  ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${214 + i * 62}" cy="306" r="3" fill="#ffd890" opacity=".8"/>`).join('')}
  ${trapOpen ? `
    <rect x="368" y="316" width="64" height="34" fill="#0a0604"/>
    <rect x="368" y="316" width="64" height="34" fill="url(#lampGlow)"/>
    ${[0, 1, 2].map(i => `<rect x="${376 + i * 4}" y="${326 + i * 8}" width="${48 - i * 8}" height="3" fill="#5a3a20"/>`).join('')}
    <polygon points="368,316 360,308 360,342 368,350" fill="#5a3a20"/>
  ` : `
    <rect x="368" y="316" width="64" height="34" fill="#4a2e1a" stroke="#1e120a" stroke-width="2"/>
    <circle cx="424" cy="333" r="3" fill="url(#brassG)"/>
    <text x="400" y="337" font-size="8" text-anchor="middle" font-family="Courier New, monospace" fill="#8a6a4a">TRAP</text>`}`;
}

// ---------------------------------------------------------------- main scene

function ballroomArt(g, past) {
  const s = past ? YESTERDAY : stageOf(g);
  const pressed = past ? [] : pressedOf(g);
  const floorDone = !past && g.flag('floorDone');
  const playing = past || g.flag('musicDone');
  return `${DEFS}
  <rect width="800" height="600" fill="#000"/>
  <rect width="800" height="352" fill="#2a1a2e"/>
  ${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 80 + 10}" y="40" width="60" height="300" fill="#3a2440" opacity=".55"/>`).join('')}
  <rect width="800" height="30" fill="#1a0e14"/><rect y="30" width="800" height="4" fill="url(#brassG)"/>

  <!-- chandelier -->
  <line x1="400" y1="0" x2="400" y2="30" stroke="#8a6a2a" stroke-width="3"/>
  <circle cx="400" cy="46" r="80" fill="url(#lampGlow)" opacity=".7"/>
  <path d="M340 40 q60 30 120 0" stroke="url(#brassG)" stroke-width="4" fill="none"/>
  ${[340, 370, 400, 430, 460].map((x, i) => `<path d="M${x} ${40 + (i % 2) * 6} v14" stroke="#c9a33b" stroke-width="2"/><circle cx="${x}" cy="${58 + (i % 2) * 6}" r="4" fill="#fff6d0" filter="url(#hGlow)"/>`).join('')}

  ${stageArt(s, !past && g.flag('trapOpen'))}

  <!-- player-orchestra -->
  <rect x="20" y="164" width="140" height="188" fill="url(#woodG)" stroke="#1e120a" stroke-width="2"/>
  <rect x="30" y="176" width="120" height="80" fill="#1a1010" stroke="url(#brassG)" stroke-width="3"/>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="${38 + i * 12}" y="${190 + (i % 3) * 8}" width="7" height="${60 - (i % 3) * 8}" fill="url(#brassG)"/>`).join('')}
  <rect x="34" y="268" width="112" height="28" fill="#efe2c0"/>
  ${playing ? `<rect x="34" y="268" width="112" height="28" fill="url(#lampGlow)"/>` : `<path d="M88 268 v28" stroke="#1a1010" stroke-width="3" stroke-dasharray="4 3"/>`}
  <text x="90" y="318" font-size="10" text-anchor="middle" ${serif} fill="#f0d890">ORCHESTRION</text>

  <!-- stage controls -->
  <rect x="660" y="160" width="120" height="150" rx="6" fill="url(#brassG)" stroke="#5a4214" stroke-width="2"/>
  <rect x="672" y="172" width="96" height="20" fill="#2a1c10"/>
  <text x="720" y="186" font-size="9" text-anchor="middle" font-family="Courier New, monospace" fill="${floorDone ? '#9f9' : '#f88'}">${floorDone ? 'STAGE · READY' : 'STAGE · LOCKED'}</text>
  ${[0, 1, 2].map(i => `<rect x="${682 + i * 30}" y="206" width="8" height="70" rx="3" fill="#2a1c10"/>
    <circle cx="${686 + i * 30}" cy="${222 + ['curtain', 'backdrop', 'lights'].map(k => STAGE[k].indexOf(s[k]))[i] * 14}" r="8" fill="#a8322a" stroke="#5a1a14" stroke-width="2"/>`).join('')}
  <text x="720" y="298" font-size="8" text-anchor="middle" font-family="Courier New, monospace" fill="#2a1c10">CRTN BKDP LTS</text>

  <!-- dance floor -->
  ${ALL_TILES.map(id => {
    const p = tilePoly(id), c = COLS.indexOf(id[0]), r = Number(id[1]);
    const on = pressed.includes(id);
    const fill = on ? '#e0c070' : ((c + r) % 2 ? '#6a4a2a' : '#8a6a3a');
    const pts = p.map(q => q.join(',')).join(' ');
    if (!on) return `<polygon points="${pts}" fill="${fill}" stroke="#2a1a0e" stroke-width="1.5"/>`;
    // stepped-on tiles: gold, outlined, with a pair of footprints (not just a different shade)
    const cx = p.reduce((a, q) => a + q[0], 0) / 4, cy = p.reduce((a, q) => a + q[1], 0) / 4;
    const w = (p[1][0] - p[0][0] + p[2][0] - p[3][0]) / 2, sc = w / 100;
    return `<polygon points="${pts}" fill="#f0d070" stroke="#fff6c8" stroke-width="3"/>
      <polygon points="${pts}" fill="url(#lampGlow)" opacity="${floorDone ? 0.9 : 0.5}"/>
      <g transform="translate(${cx},${cy}) scale(${sc})" fill="#5a3a10">
        <ellipse cx="-10" cy="-4" rx="7" ry="13" transform="rotate(-12 -10 -4)"/><ellipse cx="11" cy="5" rx="7" ry="13" transform="rotate(10 11 5)"/>
      </g>`;
  }).join('')}
  <rect y="526" width="800" height="74" fill="#2a1a10"/>
  ${COLS.map((c, i) => { const [x, y] = floorPt((i + 0.5) / 5, 1); return `<text x="${x}" y="${y + 24}" font-size="22" text-anchor="middle" ${serif} font-weight="bold" fill="#f0d890" opacity=".9">${c}</text>`; }).join('')}
  ${[1, 2, 3, 4, 5].map(r => { const b = 5 - r; const [x, y] = floorPt(0, (DEPTH[b] + DEPTH[b + 1]) / 2); return `<text x="${x + 6 + b * 3}" y="${y + 6}" font-size="${11 + (b + 1) * 2}" text-anchor="middle" ${serif} font-weight="bold" fill="#f0d890" opacity=".85">${r}</text>`; }).join('')}
  ${past ? `<text x="772" y="584" font-size="22" text-anchor="end" font-family="Courier New, monospace" font-weight="bold"
    fill="#ff9a3a" opacity=".85" filter="url(#hGlow)">'6 11</text>` : ''}
  ` + finish();
}

// ---------------------------------------------------------------- close-ups

const orchestrion = g => closeup('#1a0e14') + `
  <rect x="120" y="40" width="560" height="460" rx="10" fill="url(#woodG)" stroke="#1e120a" stroke-width="4"/>
  <rect x="150" y="70" width="500" height="220" fill="#140a08" stroke="url(#brassG)" stroke-width="6"/>
  ${Array.from({ length: 16 }, (_, i) => `<rect x="${170 + i * 29}" y="${100 + (i % 4) * 14}" width="16" height="${170 - (i % 4) * 14}" rx="3" fill="url(#brassG)"/>`).join('')}
  <rect x="170" y="320" width="460" height="80" fill="#2a1c10"/>
  <rect x="180" y="328" width="60" height="64" rx="30" fill="#5a3a20"/><rect x="560" y="328" width="60" height="64" rx="30" fill="#5a3a20"/>
  ${g.flag('musicDone') ? `
    <rect x="240" y="334" width="320" height="52" fill="#efe2c0"/>
    ${Array.from({ length: 30 }, (_, i) => `<rect x="${246 + i * 10.5}" y="${340 + ((i * 7) % 5) * 8}" width="5" height="4" fill="#2a1c10"/>`).join('')}
  ` : `
    ${[0, 1, 2, 3, 4].map(k => `<g transform="translate(${190 + k * 88},${420 + (k % 2) * 16}) rotate(${[-8, 5, -3, 7, -6][k]})">
      <rect width="80" height="44" fill="#efe2c0" stroke="#8a7a5a"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${8 + i * 14}" y="${10 + ((i + k * 3) % 4) * 7}" width="6" height="5" fill="#2a1c10"/>`).join('')}</g>`).join('')}
    <path d="M240 360 h320" stroke="#5a3a20" stroke-width="3" stroke-dasharray="6 6"/>`}
  <text x="400" y="480" font-size="15" text-anchor="middle" ${serif} font-style="italic" fill="#f0d890">${g.flag('musicDone') ? 'Waltz No. 6, playing to the end.' : 'The music roll, cut into pieces. The same eight bars loop over and over.'}</text>
  ` + finish();

const panel = g => {
  const s = stageOf(g), ready = g.flag('floorDone');
  return closeup('#1a0e14') + `
  <rect x="110" y="60" width="580" height="440" rx="12" fill="url(#brassG)" stroke="#5a4214" stroke-width="4"/>
  <rect x="140" y="84" width="520" height="40" fill="#2a1c10"/>
  <text x="400" y="111" font-size="18" text-anchor="middle" font-family="Courier New, monospace" fill="${ready ? '#9f9' : '#f88'}">${ready ? 'STAGE CONTROL · READY' : 'STAGE CONTROL · LOCKED (FLOOR)'}</text>
  ${['curtain', 'backdrop', 'lights'].map((k, i) => {
    const x = 210 + i * 190, opts = STAGE[k], pos = opts.indexOf(s[k]);
    return `<text x="${x}" y="160" font-size="16" text-anchor="middle" ${serif} letter-spacing="2" fill="#2a1c10">${k.toUpperCase()}</text>
      <rect x="${x - 10}" y="180" width="20" height="${opts.length * 50}" rx="8" fill="#2a1c10"/>
      ${opts.map((o, j) => `<text x="${x + 34}" y="${200 + j * 50}" font-size="13" font-family="Courier New, monospace" fill="${j === pos ? '#2a1c10' : '#6a5a3a'}" font-weight="${j === pos ? 'bold' : 'normal'}">${o.toUpperCase()}</text>`).join('')}
      <rect x="${x - 26}" y="${184 + pos * 50}" width="52" height="24" rx="6" fill="#a8322a" stroke="#5a1a14" stroke-width="2"/>`;
  }).join('')}
  <text x="400" y="480" font-size="14" text-anchor="middle" ${serif} font-style="italic" fill="#3a2a10">Click a lever to move it to the next setting.</text>
  ` + finish();
};

const dancecard = () => deskTop() + `
  <g transform="rotate(-3 270 300)">
    <rect x="96" y="86" width="300" height="420" rx="6" fill="#000" opacity=".45"/>
    <rect x="90" y="80" width="300" height="420" rx="6" fill="#f4e8f0" stroke="#8a6a7a" stroke-width="3"/>
    <text x="240" y="126" font-size="20" text-anchor="middle" ${serif} letter-spacing="2" fill="#4a2a3a">DANCE CARD</text>
    <text x="240" y="150" font-size="13" text-anchor="middle" ${serif} font-style="italic" fill="#6a4a5a">The Halcyon Ballroom</text>
    ${['Waltz', 'Foxtrot', 'Tango', 'Waltz', 'Quickstep', 'Last waltz'].map((d, i) => `
      <text x="112" y="${196 + i * 44}" font-size="15" ${serif} fill="#4a2a3a">${i + 1}. ${d}</text>
      <text x="262" y="${196 + i * 44}" font-size="15" ${hand} fill="#2a2a5a">A. Ito</text>
      <line x1="112" y1="${204 + i * 44}" x2="370" y2="${204 + i * 44}" stroke="#d8c0d0"/>`).join('')}
  </g>
  <g transform="rotate(4 560 300)">
    <rect x="416" y="96" width="300" height="420" rx="6" fill="#000" opacity=".45"/>
    <rect x="410" y="90" width="300" height="420" rx="6" fill="#f4e8f0" stroke="#8a6a7a" stroke-width="3"/>
    <text x="560" y="134" font-size="16" text-anchor="middle" ${serif} font-style="italic" fill="#6a4a5a">(the back)</text>
    <g fill="#2a2a5a" ${hand} font-size="18">
      <text x="432" y="180">My steps, so I don't forget:</text>
      <text x="432" y="236" font-weight="bold">Waltz:</text>
      <text x="452" y="266">B2 · B3 · B4 · C1</text>
      <text x="452" y="296">C5 · D1 · D5</text>
      <text x="432" y="344" font-weight="bold">Foxtrot:</text>
      <text x="452" y="374">A1 · B2 · C3 · D4 · E5</text>
      <text x="432" y="422" font-weight="bold">Tango:</text>
      <text x="452" y="452">E1 · E2 · D3 · C4 · C5</text>
    </g>
    ${symAt(EMBLEMS, 'moon', 668, 470, 26, '#8a6a7a')}
  </g>` + finish();

const archive = () => {
  const r = rng(31);
  const label = (x, y, text, mine) => `<rect x="${x - 26}" y="${y + 32}" width="52" height="14" fill="${mine ? '#f0d890' : '#efe6cf'}"/>
    <text x="${x}" y="${y + 42}" font-size="7.5" text-anchor="middle" font-family="Courier New, monospace" fill="#2a1c10">${text}</text>`;
  let jars = '';
  for (let shelf = 0; shelf < 4; shelf++) {
    for (let i = 0; i < 8; i++) {
      const x = 90 + i * 88, y = 70 + shelf * 118, mine = shelf === 2 && i === 5;
      const day = mine ? '6 NOV · 204' : `${1 + Math.floor(r() * 28)} ${['JAN', 'MAR', 'MAY', 'JUL', 'SEP', 'NOV'][Math.floor(r() * 6)]} · ${[1, 2, 3, 4][Math.floor(r() * 4)]}0${1 + Math.floor(r() * 9)}`;
      jars += `<rect x="${x - 20}" y="${y}" width="40" height="34" rx="6" fill="#bfe0e8" opacity=".35" stroke="#e8f6ff"/>
        <circle cx="${x}" cy="${y + 18}" r="${5 + r() * 4}" fill="${mine ? '#ffe090' : '#c8e8ff'}" opacity=".9" filter="url(#hGlow)"/>
        <rect x="${x - 14}" y="${y - 5}" width="28" height="6" fill="#5a4a3a"/>${label(x, y, day, mine)}`;
    }
  }
  return closeup('#0e0a10') + `
  ${[0, 1, 2, 3].map(s => `<rect x="40" y="${118 + s * 118}" width="720" height="8" fill="#3a2414"/>`).join('')}
  ${jars}
  <rect x="0" y="0" width="800" height="600" fill="url(#hVignette)"/>
  <rect x="660" y="496" width="110" height="104" fill="#2e1c10" stroke="url(#brassG)" stroke-width="3"/>
  <rect x="676" y="524" width="78" height="40" fill="#c8d0c8" opacity=".35"/>
  <text x="715" y="548" font-size="11" text-anchor="middle" ${serif} letter-spacing="2" fill="#f0d890">MANAGER</text>
  <circle cx="756" cy="572" r="4" fill="url(#brassG)"/>`;
};

// ---------------------------------------------------------------- hotspots

function stepTile(g, id) {
  if (g.flag('floorDone')) return g.say('The waltz steps are set. The floor holds them.');
  if (!g.flag('musicDone')) return g.say('The tile shifts a little under your foot, then springs back. The floor seems to be waiting for the music to finish.');
  const p = pressedOf(g);
  const next = p.includes(id) ? p.filter(t => t !== id) : [...p, id];
  g.set('tiles', next);
  if (next.length === WALTZ.length && WALTZ.every(t => next.includes(t))) {
    g.set('floorDone');
    g.effect('shutter');
    g.say('As you step the last tile, the floor answers: a deep click under the stage. On the right wall, the stage controls light up: READY.', 7000);
  }
}

function moveLever(g, k) {
  if (!g.flag('floorDone')) return g.say('The lever will not move. A little sign: LOCKED (FLOOR).');
  const s = stageOf(g), opts = STAGE[k];
  const next = { ...s, [k]: opts[(opts.indexOf(s[k]) + 1) % opts.length] };
  g.set('stage', next);
  if (Object.keys(YESTERDAY).every(key => next[key] === YESTERDAY[key])) {
    g.set('trapOpen');
    g.effect('shutter');
    g.say('The stage settles into exactly yesterday\'s picture: the open curtain, the rain over the sea, the blue stars. Below the stage, a hatch unlatches with a sigh.', 7000);
  } else {
    g.say(`${k[0].toUpperCase() + k.slice(1)}: ${NAMES[next[k]]}.`);
  }
}

// ---------------------------------------------------------------- export

export default {
  id: 'r4',
  name: 'Ballroom',
  hints: [
    { when: g => !g.flag('musicDone'), text: g => g.difficulty === 'easy'
      ? "The orchestrion's paper roll is cut into five pieces. The dotted melody line runs from one piece into the next: match where each piece's line ends to where the next begins. The title piece is first, FINE is last."
      : 'The music keeps looping. Something is wrong with the orchestrion.' },
    { when: g => !g.flag('floorDone'), text: g => g.difficulty === 'easy'
      ? "Examine Miss Ito's dance card. Step on the Waltz tiles: letters run along the front edge of the floor, numbers up the side."
      : 'The floor woke up when the music played. Miss Ito wrote her steps down.' },
    { when: g => !g.flag('trapOpen'), text: g => g.difficulty === 'easy'
      ? "Set the stage exactly as in yesterday's photo: the curtain, the backdrop and the lights. The controls are on the right wall."
      : 'The stage is not as it was yesterday.' },
    { when: g => !g.flag('archiveSeen'), text: 'Something opened below the stage.' },
    { text: 'In the archive, a door is marked MANAGER.' },
  ],

  scenes: {
    'r4-ballroom': {
      room: 'r4',
      art: g => ballroomArt(g, false),
      past: g => ballroomArt(g, true),
      nav: { back: 'r3-breakfast' },
      enter: g => {
        if (g.flag('r4Seen')) return;
        g.set('r4Seen');
        g.say('The ballroom. Chandeliers, an empty dance floor, and a waltz with nobody playing it: the same eight bars, over and over.', 6000);
      },
      onPast: g => g.note('r4-photo', `Yesterday's photo of the ballroom stage: curtain <b>${NAMES[YESTERDAY.curtain]}</b>, backdrop <b>${NAMES[YESTERDAY.backdrop]}</b>, lights <b>${NAMES[YESTERDAY.lights]}</b>.`),
      hotspots: [
        // big things first; the tiles and stage parts sit on top
        { id: 'orchestrion', label: g => g.flag('musicDone') ? 'Orchestrion' : 'Orchestrion (the music loops)', rect: [16, 160, 148, 192],
          go: 'r4-orchestrion', sparkle: g => !g.flag('musicDone') },
        { id: 'stage', label: 'Stage', rect: [180, 70, 440, 240],
          say: g => { const s = stageOf(g); return s.curtain === 'closed' ? 'The curtain is closed.' : `On stage: ${NAMES[s.backdrop]}, lights ${NAMES[s.lights]}.`; } },
        { id: 'controls', label: g => g.flag('floorDone') && !g.flag('trapOpen') ? 'Stage controls (ready)' : 'Stage controls',
          rect: [656, 156, 128, 158], go: 'r4-panel', sparkle: g => g.flag('floorDone') && !g.flag('trapOpen') },
        { id: 'trap', label: 'Trap', rect: [364, 312, 72, 40], when: g => !g.flag('trapOpen'),
          say: 'A hatch in the front of the stage, marked TRAP. Latched from somewhere else.' },
        { id: 'trap-open', label: 'Down through the trap', rect: [356, 306, 82, 46], when: g => g.flag('trapOpen'),
          sparkle: true, click: g => { g.set('archiveSeen'); g.go('r4-archive'); } },
        { id: 'chandelier', label: 'Chandelier', rect: [330, 30, 140, 40], say: 'Every crystal is perfectly clean. Someone dusts for guests who never dance.' },
        ...ALL_TILES.map(id => ({
          id: `tile-${id}`, label: g => g.flag('musicDone') ? `Tile ${id}` : 'Dance floor',
          poly: tilePoly(id).flat(),
          click: g => stepTile(g, id),
        })),
        // yesterday's photo
        { id: 'past-stage', era: 'past', label: "Yesterday's stage", rect: [180, 70, 440, 240], sparkle: g => !g.hasNote('r4-photo-click'),
          click: g => {
            g.note('r4-photo-click', `In the photo, the stage was set: curtain ${NAMES.open}, backdrop ${NAMES.sea}, lights ${NAMES.blue}. The performance stopped there.`);
            g.say(`Yesterday, mid-performance: the curtain ${NAMES.open}, ${NAMES.sea} on the backdrop, the lights ${NAMES.blue}.`, 6000);
          } },
      ],
    },

    'r4-orchestrion': {
      room: 'r4', art: orchestrion, nav: { back: 'r4-ballroom' },
      hotspots: [
        { id: 'roll', label: g => g.flag('musicDone') ? 'Music roll' : 'Fix the music roll', rect: [170, 310, 460, 170],
          sparkle: g => !g.flag('musicDone'),
          click: g => g.flag('musicDone') ? g.say('The roll turns smoothly. The waltz plays all the way to FINE.') : g.puzzle('r4-roll') },
      ],
    },

    'r4-panel': {
      room: 'r4', art: panel, nav: { back: 'r4-ballroom' },
      hotspots: ['curtain', 'backdrop', 'lights'].map((k, i) => ({
        id: `lever-${k}`, label: g => g.flag('floorDone') ? `${k[0].toUpperCase() + k.slice(1)} lever` : 'Locked lever',
        rect: [154 + i * 190, 140, 150, 240],
        click: g => moveLever(g, k),
      })),
    },

    'r4-dancecard': {
      room: 'r4', art: dancecard,
      nav: { back: g => g.get('dancecardReturn') ?? 'r4-ballroom' },
      enter: g => g.note('dancecard', "Miss Ito's dance card, the back: <i>Waltz: <b>B2 · B3 · B4 · C1 · C5 · D1 · D5</b>. Foxtrot: A1 · B2 · C3 · D4 · E5. Tango: E1 · E2 · D3 · C4 · C5.</i>"),
      hotspots: [],
    },

    'r4-archive': {
      room: 'r4', art: archive, nav: { back: 'r4-ballroom' },
      enter: g => {
        if (g.hasNote('archive')) return;
        g.note('archive', 'Below the stage: an archive of glass jars, each holding a glowing day, each labelled with a date and a room. <b>The hotel keeps the days.</b> One jar reads <b>6 NOV · 204</b>.');
        g.say('Below the stage, shelf after shelf of glass jars, each holding a small glowing light and a label: a date, a room number. The hotel doesn\'t destroy the days. It keeps them.', 8000);
      },
      hotspots: [
        { id: 'jars', label: 'Jars', rect: [40, 60, 720, 430], say: 'Hundreds of days. Some of the labels are older than the hotel.' },
        { id: 'myjar', label: '6 NOV · 204', rect: [500, 296, 60, 66], sparkle: true,
          say: 'Your day. 6 November, room 204. The light inside is warm, and somehow familiar. The jar is sealed with wax and a tag: "Release on the Manager\'s authority only."' },
        { id: 'manager', label: 'Door: MANAGER', rect: [656, 492, 118, 108], sparkle: true, go: 'r5-office' },
      ],
    },
  },

  puzzles: {
    'r4-roll': {
      type: 'order',
      prompt: 'The music roll, cut into five pieces. Line them up so the dotted melody runs on from each piece to the next.',
      items: [0, 1, 2, 3, 4].map(k => ({ id: `p${k}`, label: rollPiece(k) })),
      solution: ['p0', 'p1', 'p2', 'p3', 'p4'],
      seed: 13,
      okText: 'The melody runs from start to FINE.',
      errText: "The melody breaks somewhere. Click a piece in the line to take it back out.",
      solve: g => {
        g.set('musicDone');
        g.note('waltz', 'I fixed the orchestrion\'s roll. "Waltz No. 6" now plays to the end, and the dance floor woke up.');
        g.go('r4-ballroom');
        g.say('For the first time, the waltz plays past the eighth bar, all the way to the end. Under your feet the dance floor clicks, as if it has been waiting.', 7000);
      },
    },
  },
};

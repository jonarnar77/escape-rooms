// ROOM 4 — Cryo Storage
//
// Puzzle chain:
//   pods warmed up during the power cut (displays red)
//   pod labels (specimen IDs) + manifest (south)  -> storage temperatures
//   console sliders (west)                        -> all pods nominal; "POD B SEAL BREACH", door released
//   pod B (north)                                 -> JUMP SCARE: it's empty, cracked from the inside
//                                                    frozen director's keycard + photo piece #4
//   incubator is OUT OF ORDER ("use server room heat")
//   frozen keycard on the server racks in ROOM 3  -> director's keycard (backtracking!)
//   keycard on reader (east)                      -> Director's Office
//
// Pod B holds specimen HX-07, the same number as "Patient #07" in room 1...
// Difficulty: HARD randomises the storage temperatures and drops the
// facilities note and the incubator's "use server room heat" hint.

import { room, closeup, deskSurface, finish, door, DEFS, doorSign } from '../art/common.js';
import { findPhotoPiece } from '../items.js';

const PODS = [
  { letter: 'A', id: 'HX-21', x: 60 },
  { letter: 'B', id: 'HX-07', x: 240 },
  { letter: 'C', id: 'HX-33', x: 420 },
  { letter: 'D', id: 'HX-14', x: 600 },
];
const DEFAULT_TEMPS = [-60, -150, -110, -40];
const START_TEMPS = [-10, 0, -20, -10];
const tempsOf = g => g.get('r4Temps') ?? DEFAULT_TEMPS;

function setup(g) {
  if (g.difficulty !== 'hard') return;
  const pool = [-30, -50, -70, -90, -110, -130, -150, -170, -190];
  const pick = [];
  while (pick.length < 4) {
    const v = pool[Math.floor(Math.random() * pool.length)];
    if (!pick.includes(v)) pick.push(v);
  }
  g.set('r4Temps', pick);
}

const fmtT = v => `${v < 0 ? '−' : ''}${Math.abs(v)}°C`;

const COLD_DEFS = `
<defs>
  <linearGradient id="frostG" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e8f6ff" stop-opacity=".12"/>
    <stop offset=".7" stop-color="#e8f6ff" stop-opacity=".35"/>
    <stop offset="1" stop-color="#e8f6ff" stop-opacity=".7"/>
  </linearGradient>
  <linearGradient id="podMetal" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#5d6970"/><stop offset=".5" stop-color="#a9b5bb"/><stop offset="1" stop-color="#4d585e"/>
  </linearGradient>
</defs>`;

/** Cold blue tint over a standard room. */
const coldFinish = () => finish() + `
  <rect width="800" height="600" fill="#5aa0d8" opacity=".12" style="mix-blend-mode:screen"/>
  <rect y="440" width="800" height="160" fill="#e8f6ff" opacity=".06"/>`;

// ---------------------------------------------------------------- art

function pod(p, i, g) {
  const { x, letter, id } = p;
  const nominal = g.flag('podsNominal');
  const temp = nominal ? tempsOf(g)[i] : START_TEMPS[i];
  const isB = letter === 'B';
  const open = isB && g.flag('podBOpen');
  const specimen = !isB ? `
    <g opacity=".45" fill="#2a4655">
      <ellipse cx="${x + 70}" cy="200" rx="20" ry="25"/>
      <path d="M${x + 44} 236 q26 -12 52 0 l6 150 q-32 12 -64 0 Z"/>
      <path d="M${x + 44} 246 l-10 90 M${x + 96} 246 l10 90" stroke="#2a4655" stroke-width="10"/>
    </g>` : '';
  return `
    <ellipse cx="${x + 70}" cy="466" rx="80" ry="8" fill="#000" opacity=".4"/>
    <rect x="${x + 6}" y="130" width="128" height="290" fill="${open ? '#04080b' : '#0d1a22'}"/>
    ${specimen}
    ${open ? `
      <path d="M${x + 20} 160 l18 60 M${x + 30} 156 l18 60 M${x + 40} 152 l18 60 M${x + 50} 150 l16 58" stroke="#9fc7dd" stroke-width="2" opacity=".6"/>
      <path d="M${x + 60} 300 l30 10 l12 40" stroke="#555" stroke-width="5" fill="none"/>
      <polygon points="${x + 134},130 ${x + 176},142 ${x + 176},408 ${x + 134},420" fill="#9ec3d0" opacity=".25" stroke="#cfe6f0" stroke-width="2"/>
      <path d="M${x + 150} 200 l10 30 l-6 26 M${x + 160} 230 l12 -8" stroke="#fff" stroke-width="1.5" opacity=".7"/>
      <rect x="${x + 6}" y="390" width="128" height="30" fill="#e8f6ff" opacity=".35"/>
    ` : `
      <rect x="${x + 6}" y="130" width="128" height="290" fill="url(#frostG)"/>
      <rect x="${x + 20}" y="140" width="10" height="260" fill="#fff" opacity=".12"/>
      ${isB ? `
        <g opacity=".9">
          <rect x="${x - 6}" y="262" width="152" height="16" fill="url(#hazard)" transform="rotate(35 ${x + 70} 270)"/>
          <rect x="${x - 6}" y="262" width="152" height="16" fill="url(#hazard)" transform="rotate(-35 ${x + 70} 270)"/>
        </g>
        <text x="${x + 70}" y="360" font-size="17" text-anchor="middle" fill="#1a1a1a" font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive" transform="rotate(-6 ${x + 70} 360)">DO NOT OPEN</text>
        <path d="M${x + 96} 170 l-14 30 l10 18 l-18 26" stroke="#fff" stroke-width="1.5" fill="none" opacity=".7"/>
      ` : ''}
    `}
    <rect x="${x}" y="100" width="140" height="32" rx="8" fill="url(#podMetal)"/>
    <rect x="${x + 36}" y="106" width="68" height="20" fill="#061018"/>
    <text x="${x + 70}" y="121" font-size="13" text-anchor="middle" font-family="Courier New, monospace" font-weight="bold"
      fill="${nominal ? '#6f6' : '#f55'}" filter="url(#glow)">${fmtT(temp)}</text>
    ${isB && !open ? `<circle cx="${x + 122}" cy="116" r="5" fill="#f33" filter="url(#glow)">
      <animate attributeName="opacity" values="1;.2;1" dur="1s" repeatCount="indefinite"/></circle>` : ''}
    <rect x="${x}" y="418" width="140" height="44" rx="6" fill="url(#podMetal)"/>
    <rect x="${x + 22}" y="428" width="96" height="22" fill="#d8dcd4"/>
    <text x="${x + 70}" y="444" font-size="12" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#222">${letter} · ${id}</text>
    <rect x="${x + 60}" y="62" width="20" height="38" fill="#4d585e"/>`;
}

const north = g => room() + COLD_DEFS + `
  <rect y="56" width="800" height="10" fill="#4d585e"/>
  ${PODS.map((p, i) => pod(p, i, g)).join('')}
  ` + coldFinish();

const west = g => {
  const nominal = g.flag('podsNominal');
  return room() + COLD_DEFS + `
  <rect x="210" y="70" width="380" height="190" fill="#1b2024" stroke="#4d585e" stroke-width="5"/>
  <rect x="222" y="82" width="356" height="166" fill="#04101a"/>
  <g font-family="Courier New, monospace" font-weight="bold">
    <text x="400" y="104" font-size="14" text-anchor="middle" fill="#9fd4ff">CRYO MANAGEMENT · SUBLEVEL 5</text>
    ${PODS.map((p, i) => {
      const t = nominal ? tempsOf(g)[i] : START_TEMPS[i];
      const h = Math.round((-t / 200) * 90);
      return `<rect x="${250 + i * 82}" y="${120}" width="34" height="90" fill="#0b1a26" stroke="#2a4a66"/>
        <rect x="${250 + i * 82}" y="${210 - h}" width="34" height="${h}" fill="${nominal ? '#3a9a4a' : '#c33'}"/>
        <text x="${267 + i * 82}" y="228" font-size="12" text-anchor="middle" fill="#9fd4ff">${p.letter}</text>`;
    }).join('')}
    <text x="400" y="244" font-size="12" text-anchor="middle" fill="${nominal ? '#6f6' : '#f55'}">${nominal ? 'ALL PODS NOMINAL · POD B: SEAL BREACH' : 'WARNING: PODS OUT OF RANGE'}</text>
  </g>

  <polygon points="180,330 620,330 640,372 160,372" fill="#5d6970" stroke="#3a4248" stroke-width="2"/>
  <rect x="170" y="372" width="460" height="98" fill="#4d585e"/>
  ${[0, 1, 2, 3].map(i => `
    <rect x="${236 + i * 92}" y="340" width="56" height="8" rx="3" fill="#1b2024"/>
    <rect x="${236 + (nominal ? 30 : 6) + i * 92}" y="334" width="12" height="20" rx="2" fill="#9fd4ff"/>
    <text x="${264 + i * 92}" y="366" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#1b2024">POD ${'ABCD'[i]}</text>`).join('')}

  <rect x="650" y="110" width="110" height="140" fill="#e9eef0"/>
  <rect x="650" y="110" width="110" height="30" fill="#2a6ab0"/>
  <text x="705" y="131" font-size="16" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#fff">LN₂</text>
  <text x="705" y="170" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" fill="#222">ASPHYXIATION</text>
  <text x="705" y="184" font-size="10" text-anchor="middle" font-family="Arial, sans-serif" fill="#222">HAZARD</text>
  <text x="705" y="210" font-size="9" text-anchor="middle" font-family="Arial, sans-serif" fill="#555">Leave immediately</text>
  <text x="705" y="222" font-size="9" text-anchor="middle" font-family="Arial, sans-serif" fill="#555">if alarm sounds.</text>
  ` + coldFinish();
};

const south = g => {
  const hard = g.difficulty === 'hard';
  const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
  return room() + COLD_DEFS + `
  ${doorSign('SERVERS', 'bolt')}
  ${door({ open: true })}

  <g transform="translate(100,150) rotate(-3 55 75)">
    <rect width="110" height="150" rx="4" fill="#8b6a3e"/>
    <rect x="8" y="16" width="94" height="128" fill="#ece6d3"/>
    <rect x="36" y="4" width="38" height="16" rx="3" fill="#8f9592"/>
    ${[34, 46, 58, 70, 82, 94, 106, 118].map(y => `<rect x="16" y="${y}" width="${50 + (y % 5) * 6}" height="3" fill="#888"/>`).join('')}
  </g>

  <rect x="540" y="330" width="230" height="14" fill="#5d6970"/>
  <rect x="550" y="344" width="210" height="126" fill="#4d585e"/>
  <rect x="566" y="214" width="170" height="116" rx="6" fill="#e3e6e2" stroke="#9aa0a0" stroke-width="2"/>
  <circle cx="630" cy="272" r="38" fill="#141a1e" stroke="#9aa0a0" stroke-width="5"/>
  <rect x="684" y="232" width="40" height="16" fill="#061018"/>
  <rect x="690" y="258" width="28" height="8" rx="2" fill="#9aa0a0"/>
  <text x="651" y="321" font-size="9" text-anchor="middle" font-family="Arial, sans-serif" fill="#555">INCUBATOR · 37°C</text>
  <g transform="rotate(8 700 270)">
    <rect x="652" y="246" width="96" height="62" fill="#f4e27a"/>
    <g fill="#a3221c" ${hand}>
      <text x="660" y="266" font-size="12" font-weight="bold">OUT OF ORDER</text>
      ${hard ? '' : `<text x="660" y="284" font-size="10">emergencies: use</text>
      <text x="660" y="298" font-size="10">server room heat!</text>`}
    </g>
  </g>
  <ellipse cx="250" cy="520" rx="90" ry="14" fill="#cfeaff" opacity=".15"/>
  ` + coldFinish();
};

const east = g => {
  const open = g.flag('door4Open');
  return room() + COLD_DEFS + `
  ${doorSign('DIRECTOR · RESTRICTED', null, { bg: '#4a1a5a', fg: '#f0e0ff' })}
  ${door({ open, label: 'L5' })}
  <g transform="translate(505,285)">
    <rect width="46" height="68" rx="4" fill="#1b201e" stroke="#4d5551" stroke-width="2"/>
    <rect x="8" y="12" width="30" height="5" fill="#000"/>
    <rect x="12" y="26" width="22" height="14" fill="#7a2a9a" opacity=".7"/>
    <text x="23" y="37" font-size="9" text-anchor="middle" font-family="Arial" font-weight="bold" fill="#fff">5</text>
    <circle cx="23" cy="54" r="4" fill="${open ? '#3f3' : '#f33'}" filter="url(#glow)"/>
  </g>
  ${[100, 180].map(x => `
    <ellipse cx="${x + 30}" cy="468" rx="36" ry="6" fill="#000" opacity=".4"/>
    <rect x="${x}" y="190" width="60" height="276" rx="26" fill="url(#podMetal)"/>
    <rect x="${x + 22}" y="170" width="16" height="24" fill="#4d585e"/>
    <rect x="${x + 8}" y="270" width="44" height="40" fill="#2a6ab0"/>
    <text x="${x + 30}" y="296" font-size="15" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" fill="#fff">LN₂</text>
    <path d="M${x + 6} 420 q24 -14 48 0" stroke="#e8f6ff" stroke-width="6" opacity=".5" fill="none"/>`).join('')}
  ` + coldFinish();
};

const manifest = g => {
  const temps = tempsOf(g);
  const tempFor = id => temps[PODS.findIndex(p => p.id === id)];
  const rows = [
    ['HX-02', -20, 'discarded'],
    ['HX-07', tempFor('HX-07'), '!! see Dr. Voss'],
    ['HX-14', tempFor('HX-14'), ''],
    ['HX-19', -80, 'moved to L4'],
    ['HX-21', tempFor('HX-21'), ''],
    ['HX-33', tempFor('HX-33'), ''],
  ];
  const hand = 'font-family="Segoe Print, Bradley Hand, Comic Sans MS, cursive"';
  return deskSurface() + `
  <g transform="translate(190,30) rotate(1.5 210 270)">
    <rect x="8" y="10" width="420" height="540" rx="12" fill="#000" opacity=".4"/>
    <rect width="420" height="540" rx="12" fill="#8b6a3e"/>
    <rect x="25" y="50" width="370" height="470" fill="#efe9d6"/>
    <rect x="140" y="10" width="140" height="60" rx="8" fill="#8f9592" stroke="#5f6562" stroke-width="3"/>
    <g font-family="Courier New, monospace" fill="#222">
      <text x="45" y="102" font-size="17" font-weight="bold">CRYO STORAGE MANIFEST</text>
      <text x="45" y="122" font-size="12">HELIX BIOLABS · SUBLEVEL 5</text>
      <line x1="45" y1="134" x2="375" y2="134" stroke="#555"/>
      <g font-size="13" font-weight="bold">
        <text x="45" y="160">SPECIMEN</text><text x="148" y="160">STORE AT</text><text x="245" y="160">NOTES</text>
      </g>
      ${rows.map(([id, t, note], i) => `
        <text x="45" y="${192 + i * 30}" font-size="14">${id}</text>
        <text x="148" y="${192 + i * 30}" font-size="14">${fmtT(t)}</text>
        <text x="245" y="${192 + i * 30}" font-size="12" fill="${note.startsWith('!!') ? '#a3221c' : '#555'}">${note}</text>
        <line x1="45" y1="${200 + i * 30}" x2="375" y2="${200 + i * 30}" stroke="#ccc"/>`).join('')}
    </g>
    ${g.difficulty === 'hard' ? '' : `
    <g fill="#1f2a5a" ${hand} transform="rotate(-3 200 440)">
      <text x="50" y="420" font-size="15">If the power dips the pods drift</text>
      <text x="50" y="444" font-size="15">warm. Reset each one at the</text>
      <text x="50" y="468" font-size="15">console. — Facilities</text>
    </g>`}
  </g>` + finish({ flicker: false });
};

const podB = g => {
  const ice = !g.flag('took:ice');
  const photo = !g.flag('photo4');
  return `${DEFS}${COLD_DEFS}
  <defs>
    <radialGradient id="podInside" cx=".5" cy=".45" r=".7">
      <stop offset="0" stop-color="#1a3242"/><stop offset="1" stop-color="#03070a"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#podInside)"/>
  <path d="M120 0 q-60 300 0 600 M680 0 q60 300 0 600" stroke="#2a4655" stroke-width="30" fill="none" opacity=".6"/>
  <g stroke="#cfe6f0" stroke-width="3" opacity=".75" fill="none">
    <path d="M250 120 l40 150 M275 112 l40 150 M300 106 l40 150 M325 102 l36 146"/>
    <path d="M520 300 l30 110 M540 296 l30 110 M560 294 l28 104"/>
  </g>
  <path d="M400 0 v110 M400 110 l-30 40 M400 110 l30 40" stroke="#555" stroke-width="10" fill="none"/>
  <path d="M370 150 l-10 30 M430 150 l14 24" stroke="#555" stroke-width="10" fill="none"/>
  <polygon points="0,0 160,0 90,60 120,130 40,110 0,180" fill="#cfe6f0" opacity=".25" stroke="#fff" stroke-width="2"/>
  <polygon points="800,600 640,600 700,520 650,470 760,430 800,380" fill="#cfe6f0" opacity=".25" stroke="#fff" stroke-width="2"/>
  <ellipse cx="400" cy="520" rx="300" ry="70" fill="#e8f6ff" opacity=".35"/>
  ${ice ? `
    <g transform="translate(330,440) rotate(-6)">
      <rect width="140" height="90" rx="12" fill="#bfe6ff" opacity=".85" stroke="#e8f6ff" stroke-width="4"/>
      <g opacity=".75" transform="rotate(-6 70 45)">
        <rect x="28" y="22" width="84" height="52" rx="5" fill="#e9eef0"/>
        <rect x="28" y="30" width="84" height="10" fill="#7a2a9a"/>
      </g>
      <path d="M14 20 l26 -10 M110 80 l20 -12" stroke="#fff" stroke-width="4" opacity=".8"/>
    </g>` : ''}
  ${photo ? `
    <g transform="translate(560,220) rotate(14)">
      <rect width="46" height="40" fill="#e9e1c8"/><rect x="4" y="4" width="38" height="32" fill="#a08a64"/>
      <rect width="46" height="40" fill="#e8f6ff" opacity=".35"/>
    </g>` : ''}
  <rect width="800" height="600" fill="url(#vignette)"/>`;
};

// ---------------------------------------------------------------- scenes

const podHotspot = (p, i) => ({
  id: `pod-${p.letter}`, label: `Pod ${p.letter} · ${p.id}`, rect: [p.x, 100, 140, 362],
  ...(p.letter === 'B' ? {
    sparkle: g => g.flag('podsNominal') && !g.flag('podBOpen'),
    click: g => {
      if (g.flag('podBOpen')) return g.go('r4-podB');
      if (!g.flag('podsNominal')) return g.say('Pod B is sealed tight. Hazard tape, a blinking red light, and someone has scratched DO NOT OPEN into the frost.');
      g.set('podBOpen');
      g.effect('flash');
      g.effect('shake');
      g.go('r4-podB');
      g.say('The seal hisses and the door swings wide. The pod is EMPTY. The glass is cracked... from the INSIDE.', 6500);
    },
  } : {
    say: g => g.flag('podsNominal')
      ? `Pod ${p.letter} is frosting over again. Something hunched and still floats behind the glass.`
      : `Pod ${p.letter}: ${fmtT(START_TEMPS[i])} and blinking red. Something hunched and still floats behind the glass. You try not to look too closely.`,
  }),
});

export default {
  id: 'r4',
  name: 'Room 4 · Cryo Storage',
  setup,
  hints: [
    { when: g => !g.flag('podsNominal'), text: g => g.difficulty === 'easy'
      ? 'The pods warmed up during the power cut. Look up each pod\'s specimen ID (on its base) in the manifest by the door, then set the temperatures at the console.'
      : 'The pods are out of range. The manifest by the door might help.' },
    { when: g => !g.flag('podBOpen'), text: 'The console released pod B. Despite all the warnings... you have to look.' },
    { when: g => !g.flag('took:ice') && !g.has('dircard') && !g.flag('door4Open'), text: 'Something is frozen at the bottom of pod B.' },
    { when: g => g.has('ice'), text: g => g.difficulty === 'easy'
      ? 'The incubator is broken. Take the frozen keycard back to the server room and hold it against the hot server racks.'
      : 'The incubator is broken. Where else did you feel hot air?' },
    { when: g => !g.flag('door4Open'), text: "Use the director's keycard on the reader by the exit." },
    { when: g => !g.flag('photo4'), text: 'Look closely at the inside of pod B.' },
  ],

  scenes: {
    'r4-north': {
      room: 'r4',
      art: north,
      nav: { left: 'r4-west', right: 'r4-east' },
      enter: g => {
        if (g.flag('r4Seen')) return;
        g.set('r4Seen');
        g.say('Bitter cold. Your breath fogs. Four cryo pods line the wall, their displays blinking red.', 5000);
      },
      hotspots: PODS.map(podHotspot),
    },

    'r4-west': {
      room: 'r4',
      art: west,
      nav: { left: 'r4-south', right: 'r4-north' },
      hotspots: [
        { id: 'monitor', label: 'Cryo monitor', rect: [210, 70, 380, 190],
          say: g => g.flag('podsNominal')
            ? 'ALL PODS NOMINAL. POD B: SEAL BREACH, DOOR RELEASED FOR INSPECTION.'
            : 'WARNING: PODS OUT OF RANGE. All four temperature bars glow red.' },
        { id: 'console', label: 'Temperature console', rect: [160, 326, 480, 50],
          sparkle: g => !g.flag('podsNominal'),
          click: g => g.flag('podsNominal')
            ? g.say("The sliders are locked in place. Best not touch them again.")
            : g.puzzle('r4-sliders') },
        { id: 'ln2', label: 'Warning sign', rect: [650, 110, 110, 140],
          say: 'LN₂ ASPHYXIATION HAZARD. Leave immediately if alarm sounds. No alarm. Yet.' },
      ],
    },

    'r4-south': {
      room: 'r4',
      art: south,
      nav: { left: 'r4-east', right: 'r4-west' },
      hotspots: [
        { id: 'back', label: 'Back to the server room', rect: [320, 150, 160, 320], go: 'r3-north' },
        { id: 'manifest', label: 'Manifest', rect: [92, 142, 126, 166], go: 'r4-manifest', sparkle: true },
        { id: 'incubator', label: 'Incubator', rect: [566, 214, 190, 116],
          sparkle: g => g.has('ice'),
          say: g => g.difficulty === 'hard'
            ? 'An incubator. Dead. "OUT OF ORDER".'
            : 'An incubator, dead as a doornail. The note says: "OUT OF ORDER, emergencies: use server room heat!"',
          use: { ice: g => g.say("You put the ice block in the incubator and press START. Nothing. It's out of order.") } },
      ],
    },

    'r4-east': {
      room: 'r4',
      art: east,
      nav: { left: 'r4-north', right: 'r4-south' },
      hotspots: [
        { id: 'door', label: 'Door L5', rect: [320, 150, 160, 320],
          when: g => !g.flag('door4Open'),
          say: 'A heavy door. DIRECTOR · RESTRICTED. The reader wants a level 5 card.',
          use: { dircard: g => g.say('Try the card reader.'), ice: g => g.say('The card is frozen inside a block of ice. The reader just blinks red.') } },
        { id: 'exit', label: "To the director's office", rect: [320, 150, 160, 320],
          when: g => g.flag('door4Open'), go: 'r5-north' },
        { id: 'reader', label: 'Card reader', rect: [500, 280, 56, 78],
          when: g => !g.flag('door4Open'), sparkle: g => g.has('dircard'),
          say: 'LEVEL 5 ACCESS ONLY.',
          use: {
            ice: g => g.say("The card is frozen inside a block of ice. The reader can't read it."),
            dircard: g => {
              g.take('dircard');
              g.set('door4Open');
              g.say('A long, approving beep. The director\'s door slides open.');
            },
          } },
        { id: 'tanks', label: 'LN₂ tanks', rect: [96, 166, 150, 304],
          say: 'Liquid nitrogen tanks, sweating frost. The gauges read nearly empty.' },
      ],
    },

    'r4-manifest': { room: 'r4', art: manifest, nav: { back: 'r4-south' }, hotspots: [] },

    'r4-podB': {
      room: 'r4',
      art: podB,
      nav: { back: 'r4-north' },
      hotspots: [
        { id: 'scratches', label: 'Scratches', rect: [240, 96, 140, 180],
          say: 'Deep gouges in the frost. Four lines, again and again, as if something clawed its way out.' },
        { id: 'restraint', label: 'Restraints', rect: [350, 0, 110, 190],
          say: 'Torn restraint straps. Not unbuckled. Torn.' },
        { id: 'ice', label: 'Block of ice', rect: [320, 424, 164, 120], take: 'ice',
          say: 'A keycard is frozen inside a block of ice: "DIRECTOR — LEVEL 5". You pry it loose from the floor.' },
        { id: 'photo4', label: 'Photo scrap', rect: [548, 210, 70, 66], sparkle: true,
          when: g => !g.flag('photo4'),
          click: g => findPhotoPiece(g, 'photo4') },
      ],
    },
  },

  puzzles: {
    'r4-sliders': {
      type: 'sliders',
      prompt: 'CRYO MANAGEMENT · set each pod to its storage temperature.',
      unit: '°C',
      sliders: PODS.map((p, i) => ({ label: `POD ${p.letter}`, min: -200, max: 20, step: 10, start: START_TEMPS[i] })),
      solution: tempsOf,
      solve: g => {
        g.set('podsNominal');
        g.effect('red');
        g.say('The compressors shudder. ALL PODS NOMINAL... then an alarm: "POD B: SEAL BREACH. DOOR RELEASED FOR INSPECTION."', 6500);
      },
    },
  },
};

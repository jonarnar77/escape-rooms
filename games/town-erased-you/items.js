// Inventory items for The Town That Erased You. Icons are drawn in a 100x100 box.
import { INK } from './art/common.js';
import { openMap } from './rooms/town.js';

const env = (inner = '', tint = '#efe4c8') => `
  <g transform="rotate(-8 50 50)">
    <rect x="12" y="26" width="76" height="50" fill="${tint}" stroke="#8a7a5a" stroke-width="2"/>
    <rect x="68" y="31" width="14" height="17" fill="#3a6a8a"/>${inner}
  </g>`;
/** Zoom into a close-up, remembering where to come back to. */
const zoom = (scene, key) => g => { if (g.scene !== scene) g.set(key, g.scene); g.go(scene); };

export default {
  map: {
    name: 'our map',
    description: 'The map of Little Wending that you and Wren drew as children. Streets are fading off it.',
    icon: `<g transform="rotate(-6 50 50)">
      <path d="M12 22 L36 16 L62 24 L88 18 V80 L62 86 L36 78 L12 84 Z" fill="#efe2c2" stroke="#8a7a5a" stroke-width="2"/>
      <path d="M36 16 V78 M62 24 V86" stroke="#c8b48a" stroke-width="2"/>
      <path d="M20 70 Q34 52 48 56 T76 40" stroke="#3a3450" stroke-width="4" fill="none"/>
      <circle cx="76" cy="40" r="5" fill="#d84a3a"/></g>`,
    examine: openMap,
  },
  letter: {
    name: 'sealed letter',
    description: 'An old letter for 3 Lantern Row. A green label over the name says NO SUCH PERSON. There is something small and hard inside.',
    icon: env(`<path d="M22 56 h36 M22 64 h28" stroke="#2a2440" stroke-width="3"/>
      <rect x="18" y="40" width="40" height="10" fill="#f4f8f0" stroke="${INK}" stroke-width="2"/>`),
    examine: zoom('r1-envelope', 'envReturn'),
  },
  mumLetter: {
    name: 'Mum\'s letter',
    description: 'A note from Mum, twelve years old. "I\'ll keep putting your post in box 7 until you\'re back."',
    icon: `<g transform="rotate(6 50 50)"><rect x="22" y="12" width="56" height="76" fill="#f8f2e0" stroke="#8a7a5a" stroke-width="2"/>
      <path d="M30 26 h36 M30 36 h40 M30 46 h34 M30 56 h40 M30 66 h24" stroke="#2a2440" stroke-width="2.5"/></g>`,
    examine: zoom('r1-mum', 'mumReturn'),
  },
  key7: {
    name: 'post-box key',
    description: 'A small brass key with a paper tag: 7.',
    icon: `<g transform="rotate(-30 50 50)">
      <circle cx="30" cy="50" r="12" fill="none" stroke="#c49a44" stroke-width="7"/>
      <rect x="40" y="46" width="40" height="8" fill="#c49a44"/><path d="M66 54 v8 h6 v-8 M74 54 v10 h6 v-10" fill="#c49a44"/></g>
      <rect x="56" y="64" width="26" height="20" fill="#f4ecd8" stroke="#8a7a5a" transform="rotate(10 69 74)"/>
      <text x="69" y="80" font-size="13" text-anchor="middle" font-family="Georgia, serif" fill="#2a2440" transform="rotate(10 69 74)">7</text>`,
  },
  print: {
    name: 'photo print',
    description: 'The Marigold\'s Saturday staff, 2013, from the guest book. You are in this one.',
    icon: `<g transform="rotate(-6 50 50)"><rect x="10" y="22" width="80" height="58" fill="#f4ecd8"/>
      <rect x="15" y="27" width="70" height="48" fill="#d8b878"/>
      ${[26, 42, 58, 74].map((x, i) => `<circle cx="${x}" cy="44" r="6" fill="#e8c4a0"/><rect x="${x - 7}" y="51" width="14" height="20" rx="4" fill="${['#7a5a8a', '#3a6a5a', '#8a3a2a', '#2a4a6a'][i]}"/>`).join('')}
      <rect x="15" y="66" width="70" height="9" fill="#7a5434"/></g>`,
    examine: zoom('r2-print', 'printReturn'),
  },
  drawing: {
    name: 'Wren\'s drawing (a keepsake)',
    description: '"THE WAY HOME (for R). So you don\'t forget the way home. W." In green felt-tip.',
    icon: `<g transform="rotate(5 50 50)"><rect x="14" y="16" width="72" height="68" fill="#f8f2e0" stroke="#b8a888"/>
      <path d="M22 72 Q36 58 50 62 Q66 66 70 50 Q56 40 44 36 Q60 24 78 26" stroke="${INK}" stroke-width="4" fill="none"/></g>`,
    examine: zoom('r2-drawing', 'drawingReturn'),
  },
  mirror: {
    name: 'compositor\'s mirror',
    description: 'A small mirror in a wooden frame. Printers used it to read plates and type, which are made back to front.',
    icon: `<g transform="rotate(-10 50 50)"><rect x="26" y="14" width="48" height="70" rx="5" fill="#8a6a44"/>
      <rect x="32" y="20" width="36" height="58" rx="3" fill="#c8dce4"/><path d="M38 30 l14 -6 M38 44 l24 -10" stroke="#fff" stroke-width="3"/></g>`,
  },
  ink: {
    name: 'tin of ink',
    description: 'Printer\'s ink, thick and black.',
    icon: `<rect x="24" y="34" width="52" height="44" rx="4" fill="#1a1a1e"/><rect x="20" y="26" width="60" height="12" rx="3" fill="#3a3a40"/>
      <rect x="32" y="48" width="36" height="14" fill="#c9a33b"/>`,
  },
  plate: {
    name: 'printing plate',
    description: 'The front page plate for 18 August 2009, with its date scraped off. Back to front, of course.',
    icon: `<g transform="rotate(-8 50 50)"><rect x="22" y="12" width="56" height="76" fill="#a8acae" stroke="#6a6e70" stroke-width="3"/>
      <path d="M70 22 h-40 M70 30 h-30 M70 72 h-40 M70 78 h-40" stroke="#26282a" stroke-width="3"/><rect x="34" y="38" width="32" height="26" fill="#26282a" opacity=".4"/></g>`,
  },
  frontpage: {
    name: 'front page (a keepsake)',
    description: '"FOUND AT DAWN." The Wending Gazette, 18 August 2009, as it was first printed.',
    icon: `<g transform="rotate(6 50 50)"><rect x="20" y="10" width="60" height="80" fill="#f2ecdc" stroke="#8a7a5a"/>
      <rect x="26" y="16" width="48" height="6" fill="#1e1a16"/><rect x="26" y="28" width="36" height="5" fill="#1e1a16"/>
      <rect x="26" y="38" width="30" height="24" fill="#1e1a16" opacity=".35"/><path d="M26 70 h48 M26 76 h48 M26 82 h40" stroke="#1e1a16" stroke-width="2"/></g>`,
    examine: zoom('r3-story', 'storyReturn'),
  },
  pencil: {
    name: 'soft pencil',
    description: 'A 6B pencil from the records counter. Soft and dark: for drawing, not writing.',
    icon: `<g transform="rotate(-35 50 50)"><rect x="18" y="44" width="56" height="12" fill="#e8b83a" stroke="#8a6a1a"/>
      <path d="M74 44 l14 6 l-14 6 Z" fill="#e8c8a0"/><path d="M84 48.5 l4 1.5 l-4 1.5 Z" fill="#2a2a2a"/><rect x="12" y="44" width="8" height="12" fill="#c94a6a"/></g>`,
  },
  rubbing: {
    name: 'the rubbing (a keepsake)',
    description: 'Page 24 of the 1995 register, rubbed with pencil: "ASHBY, Robin. Named for the robin at the window."',
    icon: `<g transform="rotate(-5 50 50)"><rect x="18" y="12" width="64" height="76" fill="#5a5a5e"/>
      <path d="M26 30 h40 M26 44 h48 M26 52 h30 M26 66 h44" stroke="#f4ecd4" stroke-width="3"/></g>`,
    examine: zoom('r4-rubbing', 'rubbingReturn'),
  },
  housekey: {
    name: 'front-door key',
    description: 'The new owners\' key to 3 Lantern Row, from under the stone robin.',
    icon: `<g transform="rotate(-30 50 50)">
      <circle cx="30" cy="50" r="13" fill="none" stroke="#a8acb0" stroke-width="7"/>
      <rect x="41" y="46" width="42" height="8" fill="#a8acb0"/><path d="M68 54 v9 h5 v-9 M76 54 v6 h5 v-6" fill="#a8acb0"/></g>`,
  },
  scraper: {
    name: 'paint scraper',
    description: 'A decorator\'s scraper with a red handle.',
    icon: `<g transform="rotate(-30 50 50)"><path d="M14 40 h30 l6 10 l-6 10 h-30 Z" fill="#c4c8cc" stroke="#6a6e72" stroke-width="2"/>
      <rect x="50" y="44" width="38" height="12" rx="5" fill="#c43a2a"/></g>`,
  },
  goodbye: {
    name: 'your note (a keepsake)',
    description: 'The note you left on Wren\'s pillow: "I\'ll be back for the summer. Promise. Wind the tower clock for me till then?"',
    icon: `<g transform="rotate(-4 50 50)"><rect x="18" y="16" width="64" height="70" fill="#fbf8ee" stroke="#b8a888"/>
      <path d="M26 30 h20 M26 42 h44 M26 52 h40 M26 62 h44" stroke="#2a3a7a" stroke-width="3"/><path d="M26 76 h40" stroke="${INK}" stroke-width="3"/></g>`,
    examine: zoom('r5-note', 'goodbyeReturn'),
  },
  crank: {
    name: 'winding crank',
    description: 'A heavy iron crank for the tower clock. Wren gave it to you.',
    icon: `<g transform="rotate(-20 50 50)"><path d="M24 70 V30 H70" stroke="#5a5a60" stroke-width="9" fill="none" stroke-linecap="round"/>
      <rect x="64" y="22" width="16" height="16" fill="#3a3a40"/><rect x="18" y="66" width="12" height="22" rx="4" fill="#7a4a2a"/></g>`,
  },
  postcard: {
    name: 'postcard (a keepsake)',
    description: 'Your first postcard home. "Tell Wren I\'ll be home for the summer. Promise."',
    icon: `<g transform="rotate(-6 50 50)"><rect x="10" y="24" width="80" height="54" fill="#7aa0c0" stroke="#f4ecd8" stroke-width="4"/>
      <path d="M14 66 h12 v-18 h8 v12 h10 v-26 h8 v32 h8 v-14 h10 v14 h16 v10 h-72 Z" fill="#4a5a6a"/></g>`,
    examine: zoom('r1-postcard', 'pcReturn'),
  },
};

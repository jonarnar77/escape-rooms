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
    description: 'An old letter for 3 Lantern Row. A green label over the name says NO SUCH PERSON. Something like a key is sealed inside.',
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
  postcard: {
    name: 'postcard (a keepsake)',
    description: 'Your first postcard home. "Tell Wren I\'ll be home for the summer. Promise."',
    icon: `<g transform="rotate(-6 50 50)"><rect x="10" y="24" width="80" height="54" fill="#7aa0c0" stroke="#f4ecd8" stroke-width="4"/>
      <path d="M14 66 h12 v-18 h8 v12 h10 v-26 h8 v32 h8 v-14 h10 v14 h16 v10 h-72 Z" fill="#4a5a6a"/></g>`,
    examine: zoom('r1-postcard', 'pcReturn'),
  },
};

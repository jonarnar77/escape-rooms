// Inventory items for The Hotel That Lost a Day. Icons are drawn in a 100x100 box.
import { EMBLEMS, symAt } from './art/symbols.js';

const card = (inner, fill = '#efe6cf') => `
  <g transform="rotate(-8 50 50)">
    <rect x="14" y="20" width="72" height="60" rx="3" fill="${fill}" stroke="#8a7a5a" stroke-width="2"/>${inner}
  </g>`;

export default {
  booking: {
    name: 'booking confirmation',
    description: 'Your booking card from The Halcyon.',
    icon: card(symAt(EMBLEMS, 'swallow', 34, 30, 32, '#2a3a5a') + '<path d="M24 70 h52" stroke="#8a7a5a" stroke-width="3"/>'),
    // examining it zooms into the card itself
    examine: g => {
      g.set('bookingReturn', g.scene);
      g.go('r1-booking');
    },
  },

  key204: {
    name: 'key to room 204',
    description: 'A heavy brass key on a wooden fob. The fob is stamped "204" with a little swallow.',
    icon: `
      <g transform="rotate(-25 50 50)">
        <circle cx="26" cy="50" r="13" fill="none" stroke="#c9a33b" stroke-width="7"/>
        <rect x="38" y="46" width="44" height="8" fill="#c9a33b"/>
        <path d="M66 54 v9 h6 v-9 M76 54 v12 h6 v-12" fill="#c9a33b"/>
      </g>
      <rect x="54" y="62" width="34" height="26" rx="5" fill="#7a4a2a" transform="rotate(12 71 75)"/>
      <text x="71" y="80" font-size="11" text-anchor="middle" font-family="Georgia, serif" fill="#f0d890" transform="rotate(12 71 75)">204</text>`,
  },

  receiptHalf: {
    name: 'half a receipt',
    description: 'The top half of a hotel receipt, for room 204. The rest has been torn away.',
    icon: card(`<path d="M24 32 h52 M24 42 h40 M24 52 h46" stroke="#8a7a5a" stroke-width="3"/>`, '#f4efe2')
      .replace('height="60"', 'height="44"'),
  },

  receipt: {
    name: 'taped receipt',
    description: 'Your receipt, taped back together. "6 November: One day surrendered. Consent: see original agreement."',
    icon: card(`<path d="M24 30 h52 M24 40 h40 M24 50 h46 M24 60 h30" stroke="#8a7a5a" stroke-width="3"/>
      <path d="M24 70 h52" stroke="#a3221c" stroke-width="4"/>`, '#f4efe2'),
    examine: g => {
      g.set('receiptReturn', g.scene);
      g.go('r1-receipt');
    },
  },

  camera: {
    name: 'camera',
    description: 'A small camera, tagged in your handwriting: "LOOK AT THE PHOTOS." The photos are dated 6 November. Where you took one, the Yesterday button shows it.',
    icon: `
      <g transform="rotate(-8 50 50)">
        <rect x="14" y="32" width="72" height="44" rx="6" fill="#1e1e22"/><rect x="22" y="24" width="18" height="10" fill="#1e1e22"/>
        <circle cx="54" cy="54" r="15" fill="#3a3a44" stroke="#8a8a90" stroke-width="3"/><circle cx="54" cy="54" r="7" fill="#0a0a10"/>
        <rect x="72" y="38" width="8" height="5" fill="#c9a33b"/>
      </g>
      <rect x="66" y="70" width="26" height="18" fill="#f4efe2" transform="rotate(14 79 79)"/>`,
  },

  dancecard: {
    name: 'dance card',
    description: 'Miss Ito\'s dance card, on a silk cord. Every dance is filled in with the same name: hers. On the back, a tiny moon.',
    icon: `
      <g transform="rotate(-10 50 50)">
        <rect x="24" y="14" width="52" height="72" rx="3" fill="#f4e8f0" stroke="#8a6a7a" stroke-width="2"/>
        <path d="M32 30 h36 M32 40 h36 M32 50 h36 M32 60 h36 M32 70 h24" stroke="#b8a0b0" stroke-width="2"/>
        <path d="M50 14 q-10 -10 -20 -4" stroke="#c9a33b" stroke-width="2" fill="none"/>
      </g>`,
  },
};

// Inventory items. Icons are SVG drawn in a 100x100 box.
// `combine: { otherItemId: g => ... }` works in either selection order.

const torch = (lens, beam = '') => `
  ${beam}
  <g transform="rotate(-35 50 50)">
    <rect x="12" y="40" width="54" height="20" rx="4" fill="#3d4246" stroke="#22262a" stroke-width="2"/>
    <path d="M66 36 L84 30 L84 70 L66 64 Z" fill="#5a6166" stroke="#22262a" stroke-width="2"/>
    <rect x="83" y="30" width="6" height="40" rx="2" fill="${lens}"/>
    <rect x="28" y="45" width="12" height="10" rx="2" fill="#6a2"/>
  </g>`;

// The torn photo is one item that grows as pieces are found (one per room, 4 total).
export const PHOTO_PIECES = 4;
export function findPhotoPiece(g, key) {
  if (g.flag(key)) return;
  g.set(key);
  const n = (g.get('photoPieces') ?? 0) + 1;
  g.set('photoPieces', n);
  g.give('photo');
  g.say(n === 1
    ? 'A torn piece of an old photograph. Where is the rest of it?'
    : `Another piece of the torn photo! (${n}/${PHOTO_PIECES})`);
}

function photoIcon(n) {
  const quads = [[8, 8], [50, 8], [8, 50], [50, 50]];
  return quads.slice(0, n).map(([x, y], i) => `
    <g transform="rotate(${[-4, 3, 2, -3][i]} ${x + 21} ${y + 21})">
      <rect x="${x}" y="${y}" width="42" height="42" fill="#e9e1c8"/>
      <rect x="${x + 4}" y="${y + 4}" width="34" height="34" fill="#a08a64"/>
      <circle cx="${x + 21}" cy="${y + 18}" r="7" fill="#6d5a3e"/>
      <path d="M${x + 9} ${y + 38} q12 -16 24 0" fill="#6d5a3e"/>
    </g>`).join('');
}

export default {
  key: {
    name: 'small key',
    description: 'A small brass key with a worn bow. Looks like it fits a desk drawer.',
    icon: `
      <circle cx="28" cy="50" r="17" fill="none" stroke="#c9a33b" stroke-width="9"/>
      <rect x="43" y="45" width="47" height="10" rx="2" fill="#c9a33b"/>
      <rect x="72" y="55" width="7" height="14" fill="#c9a33b"/>
      <rect x="83" y="55" width="7" height="9" fill="#c9a33b"/>`,
  },

  flashlight: {
    name: 'UV torch (empty)',
    description: 'An ultraviolet inspection torch. The battery compartment is empty.',
    icon: torch('#3a2d55'),
    combine: {
      battery: g => {
        g.take('flashlight');
        g.take('battery');
        g.give('uvlight');
        g.say('You slot the battery in. The torch hums with an eerie violet light.');
      },
    },
  },

  battery: {
    name: 'AA battery',
    description: 'A single AA battery. Hopefully it still has some charge.',
    icon: `
      <g transform="rotate(-35 50 50)">
        <rect x="18" y="38" width="60" height="24" rx="4" fill="#d8891c"/>
        <rect x="18" y="38" width="20" height="24" rx="4" fill="#222"/>
        <rect x="78" y="44" width="6" height="12" rx="1" fill="#bbb"/>
        <text x="58" y="55" font-size="11" text-anchor="middle" font-family="Arial" font-weight="bold" fill="#222">AA</text>
      </g>`,
  },

  uvlight: {
    name: 'UV torch',
    description: 'It glows an eerie violet. Good for revealing hidden markings.',
    icon: torch('#c79bff', '<circle cx="80" cy="22" r="18" fill="#a66bff" opacity=".35"/>'),
  },

  photo: {
    name: g => g.flag('photoTaped') ? 'taped photo' : `torn photo (${g.get('photoPieces') ?? 1}/${PHOTO_PIECES})`,
    description: g => {
      const n = g.get('photoPieces') ?? 1;
      return n < PHOTO_PIECES
        ? `Pieces of an old staff photo. Something is written on the back, but you only have ${n} of ${PHOTO_PIECES} pieces.`
        : 'All four pieces of the photo. They need sticking together before you can make sense of it.';
    },
    icon: g => photoIcon(g.get('photoPieces') ?? 1) +
      (g.flag('photoTaped') ? '<path d="M50 6 V94 M6 50 H94" stroke="#e8e0b0" stroke-width="7" opacity=".8"/>' : ''),
    // once taped, examining it zooms into a close-up (front and back)
    examine: g => {
      if (!g.flag('photoTaped')) return false;
      if (!g.scene.startsWith('photo-')) g.set('photoReturn', g.scene);
      g.go('photo-front');
    },
    combine: {
      tape: g => {
        const n = g.get('photoPieces') ?? 1;
        if (n < PHOTO_PIECES) return g.say(`You only have ${n} of ${PHOTO_PIECES} pieces. The rest must still be somewhere in the earlier rooms.`);
        g.take('tape');
        g.set('photoTaped');
        g.say('You tape the four pieces together. A staff photo, and something is written on the back. (Examine it.)');
      },
    },
  },

  flask: {
    name: 'empty flask',
    description: 'A clean Erlenmeyer flask. Somehow it survived intact.',
    icon: `
      <path d="M40 12 h20 v26 l24 44 q3 8 -6 8 h-56 q-9 0 -6 -8 l24 -44 Z" fill="#cfd8d4" opacity=".3" stroke="#cfd8d4" stroke-width="4"/>
      <rect x="36" y="8" width="28" height="6" rx="2" fill="#cfd8d4"/>`,
  },

  solvent: {
    name: 'flask of C-7 solvent',
    description: 'Bubbling green liquid that smells like burnt pennies. Voss said it eats through corrosion.',
    icon: `
      <path d="M40 12 h20 v26 l24 44 q3 8 -6 8 h-56 q-9 0 -6 -8 l24 -44 Z" fill="#cfd8d4" opacity=".3" stroke="#cfd8d4" stroke-width="4"/>
      <path d="M31 56 h38 l15 26 q3 8 -6 8 h-56 q-9 0 -6 -8 Z" fill="#9be36a"/>
      <circle cx="46" cy="70" r="3" fill="#d8ffb8"/><circle cx="56" cy="78" r="2" fill="#d8ffb8"/>
      <rect x="36" y="8" width="28" height="6" rx="2" fill="#cfd8d4"/>`,
  },

  keycard: {
    name: 'keycard',
    description: 'A Helix Biolabs keycard: "E. VOSS — LEVEL 3 ACCESS". Slightly sticky.',
    icon: `
      <g transform="rotate(-12 50 50)">
        <rect x="12" y="24" width="76" height="52" rx="6" fill="#e9eef0" stroke="#5a6a70" stroke-width="2"/>
        <rect x="12" y="32" width="76" height="10" fill="#2a6ab0"/>
        <rect x="20" y="50" width="18" height="20" fill="#9aa7ad"/>
        <rect x="44" y="52" width="36" height="4" fill="#5a6a70"/>
        <rect x="44" y="61" width="26" height="4" fill="#5a6a70"/>
      </g>`,
  },

  fuse: {
    name: 'spare fuse',
    description: 'A ceramic cartridge fuse, 30 amps. Still in its plastic sleeve.',
    icon: `
      <g transform="rotate(-30 50 50)">
        <rect x="14" y="38" width="16" height="24" rx="2" fill="#b9bdb6"/>
        <rect x="70" y="38" width="16" height="24" rx="2" fill="#b9bdb6"/>
        <rect x="28" y="40" width="44" height="20" rx="3" fill="#efe9d6"/>
        <text x="50" y="54" font-size="10" text-anchor="middle" font-family="Arial" font-weight="bold" fill="#a3221c">30A</text>
      </g>`,
  },

  fob: {
    name: 'cryo access fob',
    description: 'A rubbery blue key fob on a ring. The tag says "CRYO".',
    icon: `
      <circle cx="30" cy="30" r="14" fill="none" stroke="#9aa7ad" stroke-width="5"/>
      <path d="M40 40 q30 4 42 26 q4 14 -10 18 q-26 6 -36 -20 Z" fill="#2a6ab0" stroke="#1a3a6a" stroke-width="3"/>
      <circle cx="64" cy="66" r="7" fill="#5a9ae0"/>
      <rect x="44" y="76" width="22" height="10" rx="2" fill="#efe9d6" transform="rotate(20 55 81)"/>`,
  },

  ice: {
    name: 'frozen keycard',
    description: 'A keycard frozen solid inside a block of ice. You can just make out the words "DIRECTOR — LEVEL 5". It needs serious heat.',
    icon: `
      <rect x="12" y="18" width="76" height="64" rx="8" fill="#bfe6ff" opacity=".85" stroke="#e8f6ff" stroke-width="3"/>
      <g transform="rotate(-8 50 50)" opacity=".75">
        <rect x="26" y="34" width="48" height="32" rx="4" fill="#e9eef0"/>
        <rect x="26" y="39" width="48" height="7" fill="#7a2a9a"/>
      </g>
      <path d="M20 28 l14 -6 M70 76 l12 -8 M18 70 l8 6" stroke="#fff" stroke-width="3" opacity=".8"/>`,
  },

  dircard: {
    name: "director's keycard",
    description: 'Still damp. "DR. A. HALE — DIRECTOR — LEVEL 5 ACCESS". The photo on it has been scratched out.',
    icon: `
      <g transform="rotate(-12 50 50)">
        <rect x="12" y="24" width="76" height="52" rx="6" fill="#e9eef0" stroke="#5a6a70" stroke-width="2"/>
        <rect x="12" y="32" width="76" height="10" fill="#7a2a9a"/>
        <rect x="20" y="50" width="18" height="20" fill="#9aa7ad"/>
        <path d="M21 52 l16 16 M37 52 l-16 16" stroke="#444" stroke-width="2"/>
        <rect x="44" y="52" width="36" height="4" fill="#5a6a70"/>
        <rect x="44" y="61" width="26" height="4" fill="#5a6a70"/>
        <text x="80" y="72" font-size="9" text-anchor="end" font-family="Arial" font-weight="bold" fill="#7a2a9a">5</text>
      </g>`,
  },

  tape: {
    name: 'roll of tape',
    description: 'Clear sticky tape. Good for fixing broken things.',
    icon: `
      <circle cx="50" cy="50" r="32" fill="#d8d2b0" stroke="#a8a280" stroke-width="3"/>
      <circle cx="50" cy="50" r="16" fill="#2a2f2c" stroke="#a8a280" stroke-width="3"/>
      <path d="M78 62 l14 18 l-10 4 Z" fill="#e8e0b0" opacity=".8"/>`,
  },

  elevkey: {
    name: 'elevator key',
    description: 'A heavy brass key on a red tag: "SURFACE LIFT · OVERRIDE".',
    icon: `
      <g transform="rotate(-30 50 50)">
        <rect x="10" y="38" width="30" height="24" rx="8" fill="#c9a33b" stroke="#8a6a1a" stroke-width="2"/>
        <circle cx="20" cy="50" r="5" fill="#2a2f2c"/>
        <rect x="38" y="45" width="50" height="10" fill="#c9a33b"/>
        <path d="M60 55 v8 h6 v-8 M74 55 v12 h6 v-12" fill="#c9a33b"/>
      </g>
      <rect x="62" y="12" width="26" height="16" rx="3" fill="#a8322a" transform="rotate(20 75 20)"/>`,
  },
};

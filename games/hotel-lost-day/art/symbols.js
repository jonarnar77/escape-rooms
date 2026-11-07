// Symbols drawn in a 40x40 box. Shapes are distinct on their own, so nothing
// depends on colour.

// Guest emblems: each room's guest has one. Yours is the swallow (room 204).
export const EMBLEMS = {
  swallow: `<path d="M3 14 Q13 12 20 19 Q27 12 37 14 Q29 17 24 23 L31 37 L22 28 L20 33 L18 28 L9 37 L16 23 Q11 17 3 14 Z" fill="currentColor"/>`,
  anchor: `<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="20" cy="7" r="4"/><path d="M20 11 V35 M12 17 H28 M7 25 Q9 35 20 35 Q31 35 33 25"/></g><path d="M4 27 l3 -5 l4 4 Z M36 27 l-3 -5 l-4 4 Z" fill="currentColor"/>`,
  moon: `<path d="M28 6 A16 16 0 1 0 28 34 A14 14 0 0 1 28 6 Z" fill="currentColor"/>`,
  fern: `<g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 37 Q20 18 26 4"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${20.5 + i * 1.2} ${32 - i * 6} q-10 -2 -12 -8 M${21 + i * 1.2} ${32 - i * 6} q9 -3 11 -9"/>`).join('')}</g>`,
  bell: `<path d="M20 5 Q31 5 31 20 V27 L35 31 H5 L9 27 V20 Q9 5 20 5 Z" fill="currentColor"/><circle cx="20" cy="34" r="3.5" fill="currentColor"/><rect x="18" y="1" width="4" height="5" fill="currentColor"/>`,
  fox: `<path d="M5 5 L14 14 H26 L35 5 L33 20 L20 36 L7 20 Z" fill="currentColor"/><circle cx="14" cy="20" r="2" fill="#efe6cf"/><circle cx="26" cy="20" r="2" fill="#efe6cf"/>`,
};

// Luggage clasp shapes, also the buttons on the key drawer.
export const CLASPS = {
  circle: `<circle cx="20" cy="20" r="13" fill="currentColor"/>`,
  triangle: `<path d="M20 5 L35 33 H5 Z" fill="currentColor"/>`,
  square: `<rect x="7" y="7" width="26" height="26" fill="currentColor"/>`,
  diamond: `<path d="M20 3 L37 20 L20 37 L3 20 Z" fill="currentColor"/>`,
  star: `<path d="M20 3 L24.5 15 L37 15.5 L27 23.5 L30.5 36 L20 28.5 L9.5 36 L13 23.5 L3 15.5 L15.5 15 Z" fill="currentColor"/>`,
  hex: `<path d="M12 5 H28 L36 20 L28 35 H12 L4 20 Z" fill="currentColor"/>`,
};

/** A symbol as standalone markup, coloured via `color`. */
export const sym = (set, id, color = '#2a1c10') => `<g style="color:${color}">${set[id]}</g>`;
/** A symbol placed at x,y with a given size. */
export const symAt = (set, id, x, y, size, color) =>
  `<g transform="translate(${x},${y}) scale(${size / 40})">${sym(set, id, color)}</g>`;
/** A symbol as an <svg> element, for puzzle buttons. */
export const symSvg = (set, id, color) => `<svg viewBox="0 0 40 40">${sym(set, id, color)}</svg>`;

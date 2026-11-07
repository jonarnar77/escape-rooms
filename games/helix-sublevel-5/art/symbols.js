// Area symbols (drawn in a 40x40 box). Each area of the facility has one, shown on
// its door signs. The elevator override in room 5 is the four areas in escape order:
// quarantine (bio), chem lab (flask), servers (bolt), cryo (snow). The rest are decoys.

function radiation() {
  const wedge = a => {
    const p = (r, d) => `${(20 + r * Math.cos((a + d) * Math.PI / 180)).toFixed(1)} ${(20 + r * Math.sin((a + d) * Math.PI / 180)).toFixed(1)}`;
    return `<path d="M${p(7, -30)} L${p(17, -30)} A17 17 0 0 1 ${p(17, 30)} L${p(7, 30)} A7 7 0 0 0 ${p(7, -30)} Z" fill="#1a1a1a"/>`;
  };
  return `<circle cx="20" cy="20" r="4" fill="#1a1a1a"/>${wedge(-90)}${wedge(30)}${wedge(150)}`;
}

export const SYMBOLS = {
  bio: `<g fill="none" stroke="#1a1a1a" stroke-width="3.5"><circle cx="20" cy="12" r="7"/><circle cx="12" cy="25" r="7"/><circle cx="28" cy="25" r="7"/></g><circle cx="20" cy="21" r="3.5" fill="#1a1a1a"/>`,
  flask: `<path d="M16 4 h8 v11 l9 17 q2 4 -3 4 h-20 q-5 0 -3 -4 l9 -17 Z" fill="none" stroke="#1a1a1a" stroke-width="3"/><path d="M11.5 27 h17 l3 6 q0 2 -2 2 h-19 q-2 0 -2 -2 Z" fill="#1a1a1a"/>`,
  bolt: `<path d="M24 2 L8 22 h10 l-4 16 L32 16 h-10 Z" fill="#1a1a1a"/>`,
  snow: `<g stroke="#1a1a1a" stroke-width="3" stroke-linecap="round" fill="none"><path d="M20 3 V37 M5.3 11.5 L34.7 28.5 M5.3 28.5 L34.7 11.5"/><path d="M15 6 l5 4 l5 -4 M15 34 l5 -4 l5 4"/></g>`,
  rad: radiation(),
  eye: `<path d="M3 20 q17 -16 34 0 q-17 16 -34 0 Z" fill="none" stroke="#1a1a1a" stroke-width="3"/><circle cx="20" cy="20" r="5.5" fill="#1a1a1a"/>`,
  skull: `<path d="M8 18 a12 12 0 0 1 24 0 v7 h-4 v6 h-16 v-6 h-4 Z" fill="#1a1a1a"/><circle cx="15" cy="18" r="3.5" fill="#d8c58a"/><circle cx="25" cy="18" r="3.5" fill="#d8c58a"/><path d="M17 31 v-4 M20 31 v-4 M23 31 v-4" stroke="#d8c58a" stroke-width="1.5"/>`,
  dna: `<g fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"><path d="M12 3 C32 12 8 28 28 37"/><path d="M28 3 C8 12 32 28 12 37"/></g><path d="M14.5 7.5 h11 M15 32.5 h10 M13 13.5 h3 M24 13.5 h3 M13 26.5 h3 M24 26.5 h3" stroke="#1a1a1a" stroke-width="2.2"/>`,
};
export const icon = id => `<svg viewBox="0 0 40 40">${SYMBOLS[id]}</svg>`;

// Stand-ins for rooms that are not built yet.
import { closeup, serif } from '../art/common.js';

const comingSoon = (title, line) => () => closeup('#120c08') + `
  <text x="400" y="260" text-anchor="middle" fill="#f0d890" font-size="30" ${serif} letter-spacing="3">${title}</text>
  <text x="400" y="300" text-anchor="middle" fill="#a8987a" font-size="16" ${serif} font-style="italic">${line}</text>
  <text x="400" y="340" text-anchor="middle" fill="#6a5a4a" font-size="14" font-family="Courier New, monospace">(coming soon)</text>`;

export default {
  scenes: {
    'r6-lostday': {
      room: 'r6',
      art: comingSoon('6 NOVEMBER', 'A corridor that smells of rain and roses. At the end of it: yesterday.'),
      nav: { back: 'r5-office' },
      hotspots: [],
    },
  },
};

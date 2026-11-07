// Stand-ins for rooms that are not built yet.
import { closeup, serif } from '../art/common.js';

const comingSoon = (title, line) => () => closeup('#120c08') + `
  <text x="400" y="260" text-anchor="middle" fill="#f0d890" font-size="30" ${serif} letter-spacing="3">${title}</text>
  <text x="400" y="300" text-anchor="middle" fill="#a8987a" font-size="16" ${serif} font-style="italic">${line}</text>
  <text x="400" y="340" text-anchor="middle" fill="#6a5a4a" font-size="14" font-family="Courier New, monospace">(coming soon)</text>`;

export default {
  scenes: {
    'r3-breakfast': {
      room: 'r3',
      art: comingSoon('THE BREAKFAST ROOM', 'The service stairs smell of coffee and cold toast. Tables are laid for guests who never came down.'),
      nav: { back: 'r2-room' },
      hotspots: [],
    },
  },
};

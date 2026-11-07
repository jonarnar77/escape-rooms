// Game definition: The Hotel That Lost a Day.
import items from './items.js';
import room1 from './rooms/room1.js';
import room2 from './rooms/room2.js';
import room3 from './rooms/room3.js';
import placeholders from './rooms/placeholders.js';

// Each room module exports { id, name, hints, setup?, scenes, puzzles }.
const rooms = [room1, room2, room3];

export default {
  id: 'hotel-lost-day',          // also the save-game key: keep it unique per game
  title: 'THE HOTEL THAT LOST A DAY',
  subtitle: 'A mystery in six rooms',
  intro: 'You come down to reception to check out. The lamps are lit and rain taps at the window, but there is nobody here.',
  start: 'r1-reception',
  notebook: true,
  // The camera's photos let you compare a scene with yesterday (scenes that define `past`).
  canSeePast: g => g.has('camera'),

  difficulties: {
    easy: 'A hint button, and important things sparkle.',
    medium: 'The intended experience.',
    hard: 'Fewer clues. Some details change every stay.',
  },

  setup: g => rooms.forEach(r => r.setup?.(g)),

  rooms: {
    ...Object.fromEntries(rooms.map(r => [r.id, { name: r.name, hints: r.hints }])),
    r4: { name: 'Ballroom' },
  },
  items,
  scenes: Object.assign({}, ...[...rooms, placeholders].map(r => r.scenes)),
  puzzles: Object.assign({}, ...rooms.map(r => r.puzzles ?? {})),

  winTitle: 'CHECKED OUT',
  messages: {
    noUse: 'That doesn\'t seem to help.',
    noCombine: 'Those don\'t go together.',
  },
};

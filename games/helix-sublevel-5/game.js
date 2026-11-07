// Game definition: everything the engine needs to run "Helix: Sublevel 5".
import items from './items.js';
import room1 from './rooms/room1.js';
import room2 from './rooms/room2.js';
import room3 from './rooms/room3.js';
import room4 from './rooms/room4.js';
import room5 from './rooms/room5.js';

// Each room module exports { id, name, hints, setup?, scenes, puzzles }.
const rooms = [room1, room2, room3, room4, room5];

export default {
  id: 'abandoned-lab',          // also the save-game key
  title: 'HELIX: SUBLEVEL 5',
  subtitle: 'An escape in five rooms',
  intro: 'You wake on a stained cot. The lights buzz and flicker. The door is sealed. You need to get out.',
  start: 'r1-north',

  difficulties: {
    easy: 'Hint button, and important objects sparkle.',
    medium: 'The intended experience.',
    hard: 'Fewer clues, and some codes change every game.',
  },

  // Runs once when a new game starts (after the difficulty is chosen).
  setup: g => rooms.forEach(r => r.setup?.(g)),

  rooms: Object.fromEntries(rooms.map(r => [r.id, { name: r.name, hints: r.hints }])),
  items,
  scenes: Object.assign({}, ...rooms.map(r => r.scenes)),
  puzzles: Object.assign({}, ...rooms.map(r => r.puzzles ?? {})),

  winTitle: 'YOU ESCAPED',

  messages: {
    noUse: "That doesn't work.",
    noCombine: "Those don't go together.",
  },
};

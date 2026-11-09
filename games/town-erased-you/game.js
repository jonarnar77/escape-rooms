// Game definition: The Town That Erased You.
import items from './items.js';
import town from './rooms/town.js';
import room1 from './rooms/room1.js';

// Each room module exports { id, name, hints, setup?, scenes, puzzles }.
const rooms = [town, room1];

export default {
  id: 'town-erased-you',          // also the save-game key: keep it unique per game
  title: 'THE TOWN THAT ERASED YOU',
  subtitle: 'Six places, one name',
  intro: 'After twelve years away, the train brings you home to Little Wending. Nobody is waiting on the platform. Nobody, it turns out, remembers you at all.',
  start: 'r0-station',
  notebook: true,

  difficulties: {
    easy: 'A hint button, and important things sparkle.',
    medium: 'The intended experience.',
    hard: 'Fewer clues. Some details change every visit.',
  },

  setup: g => rooms.forEach(r => r.setup?.(g)),

  rooms: Object.fromEntries(rooms.map(r => [r.id, { name: r.name, hints: r.hints }])),
  items,
  scenes: Object.assign({}, ...rooms.map(r => r.scenes)),
  puzzles: Object.assign({}, ...rooms.map(r => r.puzzles ?? {})),

  winTitle: 'HOME',
  messages: {
    noUse: 'That doesn\'t seem to help.',
    noCombine: 'Those don\'t go together.',
  },
};

// Game definition: The Town That Erased You.
import items from './items.js';
import town from './rooms/town.js';
import room1 from './rooms/room1.js';
import room2 from './rooms/room2.js';

// Each room module exports { id, name, hints, setup?, scenes, puzzles }.
const rooms = [town, room1, room2];
const scenes = Object.assign({}, ...rooms.map(r => r.scenes));

export default {
  id: 'town-erased-you',          // also the save-game key: keep it unique per game
  title: 'THE TOWN THAT ERASED YOU',
  subtitle: 'Six places, one name',
  intro: 'After twelve years away, the train brings you home to Little Wending. Nobody is waiting on the platform. Nobody, it turns out, remembers you at all.',
  start: 'r0-station',
  notebook: true,
  // Altered photographs: a scene with `past` art and `canPast(g)` gets a Then / Now button.
  canSeePast: g => scenes[g.scene]?.canPast?.(g) ?? false,
  pastLabels: { past: 'Then', present: 'Now', caption: 'the original' },

  difficulties: {
    easy: 'A hint button, and important things sparkle.',
    medium: 'The intended experience.',
    hard: 'Fewer clues. Some details change every visit.',
  },

  setup: g => rooms.forEach(r => r.setup?.(g)),

  rooms: Object.fromEntries(rooms.map(r => [r.id, { name: r.name, hints: r.hints }])),
  items,
  scenes,
  puzzles: Object.assign({}, ...rooms.map(r => r.puzzles ?? {})),

  winTitle: 'HOME',
  messages: {
    noUse: 'That doesn\'t seem to help.',
    noCombine: 'Those don\'t go together.',
  },
};

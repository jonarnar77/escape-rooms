// Games listed on the landing page (index.html).
//
// To add a game: build it in games/<folder>/ (with game.js exporting the game data
// and an index.html that starts it, see games/helix-sublevel-5/), then add an entry here.
export default [
  {
    folder: 'helix-sublevel-5',
    title: 'Helix: Sublevel 5',
    tagline: 'You wake on a stained cot in a sealed quarantine ward beneath an abandoned lab. Five rooms stand between you and the surface.',
    tags: ['Sci-fi horror', '5 rooms', 'Easy · Medium · Hard'],
    // the scene (and flags) drawn as the card's picture
    thumbnail: { scene: 'r4-north', flags: {} },
  },
];

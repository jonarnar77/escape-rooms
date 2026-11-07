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
  {
    folder: 'hotel-lost-day',
    title: 'The Hotel That Lost a Day',
    tagline: 'You come down to check out. Your bill includes a day you cannot remember, and the front door only leads back inside.',
    tags: ['Eerie mystery', '6 rooms', 'In progress: room 1'],
    thumbnail: { scene: 'r1-reception', flags: {} },
  },
];

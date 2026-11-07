# Escape Rooms

Old-school, Flash-style point-and-click escape rooms. Plain HTML/CSS/JS with no build step, served straight from GitHub Pages.

**Play:** https://jonarnar77.github.io/escape-rooms/

| Game | Folder |
|---|---|
| Helix: Sublevel 5 | [`games/helix-sublevel-5/`](games/helix-sublevel-5/) (design notes in its `DESIGN.md`) |
| The Hotel That Lost a Day *(in progress)* | [`games/hotel-lost-day/`](games/hotel-lost-day/) |

## Run locally

ES modules don't load from `file://`, so serve the folder:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Every push to `main` goes live on GitHub Pages within a minute or two (`.nojekyll` is included).

## Layout

```
index.html              landing page: a card per game, with progress from this browser
games.js                the list of games shown on the landing page
engine/                 reusable engine, shared by every game (knows nothing about any one game)
  engine.js             scenes, hotspots, inventory, saving, hints, difficulty, effects
  engine.css
  puzzles/              puzzle widgets: keypad, dials, password, mixer, rotate-grid,
                        sliders, clock, sequence, assemble (torn documents),
                        select (choose a set), order (arrange fragments),
                        assign (place tokens on spots)
games/helix-sublevel-5/
  index.html            the game's own page (a direct, shareable link)
  game.js               game definition (title, rooms, start scene, items, puzzles)
  items.js
  art/                  shared drawing helpers and area symbols
  rooms/room1.js …      one file per room: art, scenes, puzzles, hints
  test.html             automated full-game playthrough
  DESIGN.md             puzzle design notes
```

Per-game extras: a game can add a `theme.css` after the engine's stylesheet to restyle menus and the inventory (the hotel does), can set `notebook: true` to get an automatic clue notebook (`g.note(id, text)`), and can give scenes a `past` version with a Yesterday/Today toggle (`canSeePast`, hotspot `era`).

## Adding a new game

1. Copy `games/helix-sublevel-5/` to `games/<new-game>/`. In its `game.js`, give it a new **`id`**, which is also its save-game key, so it must be unique. Then replace the rooms.
2. Add an entry to `games.js` with the folder, title, tagline, tags and the scene to use as the card picture.
3. Push. The landing page picks it up automatically, and its picture is drawn live from the game's own art.

## Authoring cheat-sheet

All coordinates are in an **800×600** stage space.

```js
'r1-west': {
  room: 'r1',                          // for the HUD label
  art: g => `<svg markup…>`,           // or image: 'assets/r1-west.jpg' (both may be used)
  nav: { left: 'r1-south', right: 'r1-north', back: …, up: … },
  enter: g => { … },                   // optional, runs on entering
  hotspots: [
    { id, label, rect: [x, y, w, h] | poly: [x1,y1,…] | circle: [cx, cy, r],   // or g => [...]
      when:  g => bool,                // only shown when true
      say:   'text' | g => 'text',
      click: g => { … },
      go:    'scene-id',               // navigate (zoom in to a close-up, etc.)
      take:  'itemId',                 // pick up an item; the hotspot disappears afterwards
      use:   { itemId: g => { … } },   // what happens when a selected item is used here
                                       // (give every part of an object the same handler!)
    },
  ],
}
```

The `g` API includes `flag(k)`, `set(k, v)`, `has(item)`, `give(item)`, `take(item)`, `say(text)`, `go(scene)`, `puzzle(id)`, `solved(id)`, `win(text)` and `effect('flash' | 'shake' | 'red')`.

Items: `{ name, description, icon, combine: { otherId: g => … }, examine?: g => … }`. The name, description and icon can be functions of `g`. `examine` replaces the default pop-up (for example, to zoom into a close-up scene); return `false` to keep the pop-up.

Puzzles live in `puzzles: { id: { type: 'keypad' | 'dials' | 'password' | 'mixer', prompt, solution, solve: g => … } }`.
`solution` and `prompt` may be functions of `g`, and `config: g => ({…})` adds settings that depend on game state.
To add a new widget type, use `registerPuzzle('name', (mountEl, config, ctx) => …)` and call `ctx.solve()` when it's solved.

### Difficulty

The player picks easy, medium or hard at "New game". In game data:
- `g.difficulty` gives the current mode, and `g.diff({ easy, medium, hard })` picks a value for it (missing keys fall back to medium).
- `setup: g => …` on the game runs once per new game. Use it to randomise codes for hard mode.
- On easy, hotspots with `take` or `sparkle: true | g => bool` get a twinkle, and the **?** button shows the first hint in the room's `hints: [{ when, text }]` list whose `when` is true.

### Debug mode

Open a game with `?debug`, for example `http://localhost:8000/games/helix-sublevel-5/?debug`, to use these authoring tools:
- Hotspot outlines and ids are shown. Press `h` to toggle them.
- Live x/y coordinates are shown.
- **Shift+drag** measures a rectangle and logs `rect: [x, y, w, h]` to the console. This is handy when tracing hotspots over reference images.
- `games/helix-sublevel-5/?debug&scene=r1-pills` jumps straight to a scene. Add `&difficulty=hard` to test a mode.

## Testing

Each game has a `test.html` that plays the whole game automatically through the real hotspots, from start to ending, and reports PASS or FAIL. It uses its own save slot.

```
http://localhost:8000/games/helix-sublevel-5/test.html?d=easy     (or medium / hard)
```

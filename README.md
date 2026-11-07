# Helix: Sublevel 5

A Flash-style point-and-click escape room game. Plain HTML/CSS/JS with no build step, served straight from GitHub Pages.

## Run locally

ES modules don't load from `file://`, so serve the folder:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

Push to GitHub, then go to **Settings → Pages → Deploy from a branch → `main` / root**. That's it. (`.nojekyll` is already included.)

## Layout

```
engine/                 reusable engine: knows nothing about this game
  engine.js             scenes, hotspots, inventory, saving, modals
  engine.css
  puzzles/              reusable puzzle widgets (keypad, dials, password, mixer, rotate-grid, sliders, clock, sequence)
games/abandoned-lab/    this game: pure data + SVG art
  index.js              game definition (title, rooms, start scene)
  items.js
  art/common.js         shared drawing helpers (walls, floor, grime)
  rooms/room1.js        one file per room: art, scenes, puzzles, hints
  rooms/room2.js … room5.js
```

To make a new game, copy `games/abandoned-lab/` and point `index.html` at it.

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

Open `http://localhost:8000/?debug` to use these authoring tools:
- Hotspot outlines and ids are shown. Press `h` to toggle them.
- Live x/y coordinates are shown.
- **Shift+drag** measures a rectangle and logs `rect: [x, y, w, h]` to the console. This is handy when tracing hotspots over reference images.
- `?debug&scene=r1-pills` jumps straight to a scene. Add `&difficulty=hard` to test a mode.

## Testing

`tests/playthrough.html` plays the whole game automatically through the real hotspots, from waking up to the ending, and reports PASS or FAIL. Run it after changing rooms:

```
http://localhost:8000/tests/playthrough.html?d=easy     (or medium / hard)
```

It uses its own save slot, so it won't touch your real saved game.

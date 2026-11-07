// Rotating wire/pipe tiles. Click a tile to rotate it 90° clockwise.
// Solved when power flows from the source edge to the sink edge.
//
// Config: {
//   tiles: [[mask, ...], ...]   // the SOLVED layout; bits N=1 E=2 S=4 W=8 (0 = empty)
//   source: { row, side: 'W' }  // power enters this row from the left (W) or right (E)
//   sink:   { row, side: 'E' }
//   seed?: number               // scramble seed (same scramble every time)
//   sourceLabel?, sinkLabel?
// }
const N = 1, E = 2, S = 4, W = 8;
const DIRS = [[N, -1, 0, S], [E, 0, 1, W], [S, 1, 0, N], [W, 0, -1, E]];
const rot = m => ((m << 1) | (m >> 3)) & 15;

export default function rotateGrid(root, cfg, ctx) {
  const rows = cfg.tiles.length, cols = cfg.tiles[0].length;
  const side = s => (s === 'W' ? W : E);
  let seed = cfg.seed ?? 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const grid = cfg.tiles.map(r => r.map(m => { let x = m; for (let k = 1 + Math.floor(rand() * 3); k > 0; k--) x = rot(x); return x; }));

  const srcCol = cfg.source.side === 'W' ? 0 : cols - 1;
  const sinkCol = cfg.sink.side === 'E' ? cols - 1 : 0;

  function powered() {
    const on = new Set();
    const start = [cfg.source.row, srcCol];
    if (!(grid[start[0]][start[1]] & side(cfg.source.side))) return on;
    const stack = [start];
    while (stack.length) {
      const [r, c] = stack.pop();
      const key = r * cols + c;
      if (on.has(key)) continue;
      on.add(key);
      for (const [bit, dr, dc, opp] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (!(grid[r][c] & bit) || nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
        if (grid[nr][nc] & opp) stack.push([nr, nc]);
      }
    }
    return on;
  }
  const solved = on => on.has(cfg.sink.row * cols + sinkCol) && (grid[cfg.sink.row][sinkCol] & side(cfg.sink.side));

  // make sure we don't start solved
  while (solved(powered())) grid[0][0] = rot(grid[0][0]);

  const tileSvg = (m, lit) => {
    const color = lit ? '#ffd23a' : '#6b746f';
    const ends = { [N]: [30, 0], [E]: [60, 30], [S]: [30, 60], [W]: [0, 30] };
    const lines = [N, E, S, W].filter(b => m & b)
      .map(b => `<line x1="30" y1="30" x2="${ends[b][0]}" y2="${ends[b][1]}"/>`).join('');
    return `<svg viewBox="0 0 60 60"><g stroke="${color}" stroke-width="11" stroke-linecap="butt" ${lit ? 'filter="drop-shadow(0 0 4px #ffb000)"' : ''}>${lines}</g>
      ${m ? `<circle cx="30" cy="30" r="8" fill="${color}"/>` : ''}</svg>`;
  };

  root.innerHTML = `<div class="rg"><div class="rg-grid" style="grid-template-columns: 70px repeat(${cols}, 64px) 70px"></div></div>`;
  const el = root.querySelector('.rg-grid');
  let done = false;

  function draw() {
    const on = powered();
    const win = solved(on);
    el.innerHTML = '';
    for (let r = 0; r < rows; r++) {
      const marker = (isSrc, s) => {
        const d = document.createElement('div');
        d.className = 'rg-marker';
        if (isSrc) d.innerHTML = `<span class="${s === 'src' ? 'rg-src' : (win ? 'rg-sink on' : 'rg-sink')}">${s === 'src' ? (cfg.sourceLabel ?? 'POWER ▶') : (cfg.sinkLabel ?? '▶ OUT')}</span>`;
        return d;
      };
      el.append(marker(cfg.source.side === 'W' && r === cfg.source.row, 'src'));
      for (let c = 0; c < cols; c++) {
        const b = document.createElement('button');
        b.className = 'rg-tile';
        b.innerHTML = tileSvg(grid[r][c], on.has(r * cols + c));
        b.addEventListener('click', () => {
          if (done || !grid[r][c]) return;
          grid[r][c] = rot(grid[r][c]);
          draw();
        });
        el.append(b);
      }
      el.append(marker(cfg.sink.side === 'E' && r === cfg.sink.row, 'sink'));
    }
    if (win && !done) {
      done = true;
      setTimeout(ctx.solve, 900);
    }
  }
  draw();
}

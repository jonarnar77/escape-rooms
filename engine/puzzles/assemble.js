// Reassemble a torn document. The document (any SVG markup) is torn into
// horizontal strips with jagged edges. Click a strip in the pile, then click the
// place it belongs on the page. Click a placed strip to take it back.
// Works without dragging, so it's fine on touch screens.
//
// Config: {
//   width, height,              // size of the document's art (its own coordinates)
//   art,                        // SVG markup of the complete document
//   cuts: [y1, y2, ...],        // tear lines; strips = cuts.length + 1
//   fixed?: [0],                // strips already in place (e.g. a half you found earlier)
//   decoys?: [{ art, strip }],  // look-alike strips cut from other documents
//   jag?: 9, seed?: 3,
// }
export default function assemble(root, cfg, ctx) {
  const W = cfg.width, H = cfg.height, jag = cfg.jag ?? 9;
  let seed = cfg.seed ?? 3;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const uid = `asm${Math.floor(Math.random() * 1e9)}`;

  // jagged tear lines, shared by the strips above and below so correct neighbours fit.
  // Decoys get their own tear lines, so their edges never quite match.
  const makeLines = () => cfg.cuts.map(y => {
    const pts = [];
    for (let x = 0; x <= W; x += W / 18) pts.push([Math.round(x), Math.round(y + (rand() - 0.5) * 2 * jag)]);
    return pts;
  });
  const lines = makeLines();
  const n = cfg.cuts.length + 1;
  const strip = (i, lines) => {
    const top = i === 0 ? [[0, 0], [W, 0]] : lines[i - 1];
    const bottom = i === n - 1 ? [[W, H], [0, H]] : [...lines[i]].reverse();
    const pts = [...top, ...bottom];
    const ys = pts.map(p => p[1]);
    return { points: pts.map(p => p.join(',')).join(' '), top: Math.min(...ys), bottom: Math.max(...ys) };
  };
  const strips = Array.from({ length: n }, (_, i) => strip(i, lines));

  // pieces: the real strips plus decoys (each piece carries its own outline: `geo`)
  const pieces = strips.map((geo, i) => ({ id: `p${i}`, geo, art: cfg.art, home: i }));
  (cfg.decoys ?? []).forEach((d, k) => pieces.push({ id: `d${k}`, geo: strip(d.strip, makeLines()), art: d.art, home: null }));

  const fixed = new Set(cfg.fixed ?? []);
  const placed = Array(n).fill(null);           // slot -> piece id
  fixed.forEach(i => { placed[i] = `p${i}`; });
  let tray = pieces.filter(p => !fixed.has(p.home ?? -1)).map(p => p.id);
  tray.sort(() => rand() - 0.5);
  let selected = null, done = false;
  const byId = Object.fromEntries(pieces.map(p => [p.id, p]));

  const clip = (p, extra = '') => `<clipPath id="${uid}-${p.id}${extra}"><polygon points="${p.geo.points}"/></clipPath>`;

  root.innerHTML = `
    <div class="asm">
      <svg class="asm-board" viewBox="-6 -6 ${W + 12} ${H + 12}"></svg>
      <div class="asm-tray"></div>
    </div>`;
  const board = root.querySelector('.asm-board');
  const trayEl = root.querySelector('.asm-tray');

  function draw() {
    // the page: empty outline plus whatever is placed
    let svg = `<rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="#6b7a70" stroke-width="2" stroke-dasharray="6 5"/>`;
    placed.forEach((pid, slot) => {
      const s = strips[slot];
      if (pid) {
        const p = byId[pid], ps = p.geo;
        const dy = s.top - ps.top;              // a wrong strip is shifted into this slot
        svg += `<defs>${clip(p, `-b${slot}`)}</defs>
          <g transform="translate(0 ${dy})"><g clip-path="url(#${uid}-${p.id}-b${slot})">${p.art}</g>
            <polygon points="${ps.points}" fill="none" stroke="#00000033" stroke-width="1"/></g>`;
      }
      svg += `<rect class="asm-slot ${fixed.has(slot) ? 'fixed' : ''} ${pid ? 'full' : ''}" data-slot="${slot}"
        x="0" y="${s.top}" width="${W}" height="${s.bottom - s.top}"/>`;
    });
    board.innerHTML = svg;
    board.querySelectorAll('.asm-slot').forEach(r => r.addEventListener('click', () => clickSlot(+r.dataset.slot)));

    trayEl.innerHTML = '';
    tray.forEach((pid, i) => {
      const p = byId[pid], s = p.geo;
      const b = document.createElement('button');
      b.className = `asm-piece ${selected === pid ? 'sel' : ''}`;
      b.dataset.piece = pid;          // p<N> = strip N of the real document, d<N> = decoy
      b.style.transform = `rotate(${((i * 37) % 9) - 4}deg)`;
      b.innerHTML = `<svg viewBox="-4 ${s.top - 4} ${W + 8} ${s.bottom - s.top + 8}">
        <defs>${clip(p, '-t')}</defs><g clip-path="url(#${uid}-${p.id}-t)">${p.art}</g></svg>`;
      b.addEventListener('click', () => { if (!done) { selected = selected === pid ? null : pid; draw(); } });
      trayEl.append(b);
    });
    if (!tray.length && !done) trayEl.innerHTML = '<p class="asm-empty">All pieces placed.</p>';
  }

  function clickSlot(slot) {
    if (done || fixed.has(slot)) return;
    if (placed[slot]) { tray.push(placed[slot]); placed[slot] = null; }
    if (selected) { placed[slot] = selected; tray = tray.filter(id => id !== selected); selected = null; }
    draw();
    if (placed.every((pid, i) => pid === `p${i}`)) {
      done = true;
      root.querySelector('.asm').classList.add('ok');
      setTimeout(ctx.solve, 1100);
    }
  }
  draw();
}

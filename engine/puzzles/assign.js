// Place tokens on spots (seating plans, matching things to owners, ...).
// Click a token, then click a spot. Click a filled spot to take its token back.
// Solves when every spot holds a token of the right type.
//
// Config: {
//   width, height,                       // board size in its own coordinates
//   art,                                 // SVG markup for the board background
//   slots: [{ id, x, y, r? }],           // clickable spots (circles)
//   tokens: [{ id, type, label, mark }], // label: tray button content; mark: SVG drawn on the board, centred at 0,0
//   solution: { slotId: type },          // tokens of the same type are interchangeable
//   doneText?, boardWidth?: 460
// }
export default function assign(root, cfg, ctx) {
  const placed = Object.fromEntries(cfg.slots.map(s => [s.id, null]));   // slot -> token id
  const byId = Object.fromEntries(cfg.tokens.map(t => [t.id, t]));
  let tray = cfg.tokens.map(t => t.id);
  let selected = null, done = false;

  root.innerHTML = `
    <div class="asg">
      <svg class="asg-board" viewBox="0 0 ${cfg.width} ${cfg.height}" style="width:${cfg.boardWidth ?? 460}px"></svg>
      <div class="asg-side">
        <div class="asg-tray"></div>
        <div class="asg-count"></div>
      </div>
    </div>`;
  const board = root.querySelector('.asg-board');
  const trayEl = root.querySelector('.asg-tray');
  const count = root.querySelector('.asg-count');
  const wrap = root.querySelector('.asg');

  function draw() {
    let svg = cfg.art;
    for (const s of cfg.slots) {
      const t = placed[s.id] && byId[placed[s.id]];
      svg += `<g class="asg-slot ${t ? 'full' : ''} ${selected && !t ? 'ready' : ''}" data-slot="${s.id}" transform="translate(${s.x},${s.y})">
        <circle r="${s.r ?? 22}" class="asg-ring"/>${t ? t.mark : ''}</g>`;
    }
    board.innerHTML = svg;
    board.querySelectorAll('.asg-slot').forEach(el => el.addEventListener('click', () => clickSlot(el.dataset.slot)));

    trayEl.innerHTML = '';
    tray.forEach(id => {
      const b = document.createElement('button');
      b.className = `asg-token ${selected === id ? 'sel' : ''}`;
      b.dataset.token = id;
      b.innerHTML = byId[id].label;
      b.addEventListener('click', () => { if (!done) { selected = selected === id ? null : id; draw(); } });
      trayEl.append(b);
    });
    const n = Object.values(placed).filter(Boolean).length;
    count.textContent = done ? (cfg.doneText ?? '') : `${n} of ${cfg.slots.length} placed`;
  }

  function clickSlot(slotId) {
    if (done) return;
    if (placed[slotId]) { tray.push(placed[slotId]); placed[slotId] = null; }
    if (selected) { placed[slotId] = selected; tray = tray.filter(id => id !== selected); selected = null; }
    draw();
    const right = cfg.slots.every(s => placed[s.id] && byId[placed[s.id]].type === cfg.solution[s.id]);
    if (right) {
      done = true;
      wrap.classList.add('ok');
      draw();
      setTimeout(ctx.solve, 1100);
    } else if (cfg.slots.every(s => placed[s.id])) {
      wrap.classList.remove('err'); void wrap.offsetWidth; wrap.classList.add('err');
      count.textContent = cfg.wrongText ?? 'Something is not right yet.';
    }
  }
  draw();
}

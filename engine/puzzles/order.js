// Put fragments into the right order. Click a fragment in the pile to add it to
// the end of the line-up; click one in the line-up to send it back.
// Checks once every fragment is placed.
// Config: { items: [{ id, label }], solution: [ids], seed?, okText?, errText? }
export default function order(root, cfg, ctx) {
  let seed = cfg.seed ?? 5;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const byId = Object.fromEntries(cfg.items.map(i => [i.id, i]));
  let pile = cfg.items.map(i => i.id).sort(() => rand() - 0.5);
  if (pile.every((id, k) => id === cfg.solution[k])) pile.reverse();   // never start solved
  let line = [];
  let done = false;

  root.innerHTML = `
    <div class="ord">
      <div class="ord-line"></div>
      <div class="ord-status"></div>
      <div class="ord-pile"></div>
    </div>`;
  const lineEl = root.querySelector('.ord-line');
  const pileEl = root.querySelector('.ord-pile');
  const status = root.querySelector('.ord-status');
  const wrap = root.querySelector('.ord');

  function frag(id, where, i) {
    const b = document.createElement('button');
    b.className = 'ord-frag';
    b.dataset.id = id;
    b.innerHTML = byId[id].label;
    if (where === 'pile') b.style.transform = `rotate(${((i * 53) % 7) - 3}deg)`;
    b.addEventListener('click', () => {
      if (done) return;
      if (where === 'pile') { pile = pile.filter(x => x !== id); line.push(id); }
      else { line = line.filter(x => x !== id); pile.push(id); }
      draw();
    });
    return b;
  }

  function draw() {
    lineEl.innerHTML = line.length ? '' : '<p class="ord-empty">Click the fragments in the order they belong.</p>';
    line.forEach((id, i) => lineEl.append(frag(id, 'line', i)));
    pileEl.innerHTML = '';
    pile.forEach((id, i) => pileEl.append(frag(id, 'pile', i)));
    status.textContent = '';
    wrap.classList.remove('err');
    if (line.length === cfg.items.length) {
      if (line.every((id, i) => id === cfg.solution[i])) {
        done = true;
        wrap.classList.add('ok');
        status.textContent = cfg.okText ?? '';
        setTimeout(ctx.solve, 1100);
      } else {
        wrap.classList.add('err');
        status.textContent = cfg.errText ?? "That doesn't read right.";
      }
    }
  }
  draw();
}

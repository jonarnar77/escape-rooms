// Choose exactly the right set of options (order doesn't matter), then confirm.
// E.g. "press every picture that has changed since yesterday".
// Config: { options: [{ id, label, title? }], solution: [ids], columns?: 4,
//           confirmText?: 'Open', failText? }
export default function select(root, cfg, ctx) {
  const chosen = new Set();
  let done = false;
  root.innerHTML = `
    <div class="sel">
      <div class="sel-grid" style="grid-template-columns: repeat(${cfg.columns ?? 4}, 1fr)">
        ${cfg.options.map(o => `<button class="sel-opt" data-id="${o.id}" title="${o.title ?? ''}" aria-pressed="false">${o.label}</button>`).join('')}
      </div>
      <button class="btn big sel-go">${cfg.confirmText ?? 'Confirm'}</button>
    </div>`;
  const wrap = root.querySelector('.sel');
  root.querySelectorAll('.sel-opt').forEach(b => b.addEventListener('click', () => {
    if (done) return;
    const id = b.dataset.id;
    chosen.has(id) ? chosen.delete(id) : chosen.add(id);
    b.classList.toggle('on', chosen.has(id));
    b.setAttribute('aria-pressed', chosen.has(id));
  }));
  root.querySelector('.sel-go').addEventListener('click', () => {
    if (done) return;
    const want = new Set(cfg.solution);
    if (chosen.size === want.size && [...chosen].every(id => want.has(id))) {
      done = true;
      wrap.classList.add('ok');
      setTimeout(ctx.solve, 900);
    } else {
      ctx.say(cfg.failText ?? 'Nothing happens.');
      wrap.classList.remove('err'); void wrap.offsetWidth; wrap.classList.add('err');
    }
  });
}

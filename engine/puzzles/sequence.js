// Press buttons in the right order (symbols, colours, notes...). Checks
// automatically once enough buttons are pressed; a wrong sequence resets.
// Config: { buttons: [{ id, label }], solution: [ids], columns?: 4, errText?, okText? }
export default function sequence(root, cfg, ctx) {
  const n = cfg.solution.length;
  const byId = Object.fromEntries(cfg.buttons.map(b => [b.id, b]));
  let entered = [];
  let locked = false;

  root.innerHTML = `
    <div class="seq">
      <div class="seq-display">${Array.from({ length: n }, () => '<div class="seq-slot"></div>').join('')}</div>
      <div class="seq-status"></div>
      <div class="seq-buttons" style="grid-template-columns: repeat(${cfg.columns ?? 4}, 1fr)">
        ${cfg.buttons.map(b => `<button class="seq-btn" data-id="${b.id}" title="${b.title ?? ''}">${b.label}</button>`).join('')}
      </div>
    </div>`;
  const slots = [...root.querySelectorAll('.seq-slot')];
  const status = root.querySelector('.seq-status');
  const wrap = root.querySelector('.seq');
  const draw = () => slots.forEach((s, i) => { s.innerHTML = entered[i] ? byId[entered[i]].label : ''; });

  root.querySelectorAll('.seq-btn').forEach(b => b.addEventListener('click', () => {
    if (locked) return;
    entered.push(b.dataset.id);
    draw();
    if (entered.length < n) return;
    locked = true;
    if (entered.every((id, i) => id === cfg.solution[i])) {
      wrap.classList.add('ok');
      status.textContent = cfg.okText ?? 'ACCEPTED';
      setTimeout(ctx.solve, 900);
    } else {
      wrap.classList.add('err');
      status.textContent = cfg.errText ?? 'INVALID SEQUENCE';
      setTimeout(() => { entered = []; draw(); wrap.classList.remove('err'); status.textContent = ''; locked = false; }, 1000);
    }
  }));
}

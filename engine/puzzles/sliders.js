// A bank of sliders that must all be set to the right values. No per-slider
// feedback (that would make it brute-forceable); solves when all match.
// Config: {
//   sliders: [{ label, min, max, step, start }],
//   solution: [values],
//   unit?: '°C',
//   format?: v => string,
// }
export default function sliders(root, cfg, ctx) {
  const unit = cfg.unit ?? '';
  const fmt = cfg.format ?? (v => `${v < 0 ? '−' : ''}${Math.abs(v)}${unit}`);
  const values = cfg.sliders.map(s => s.start ?? s.min);
  let done = false;

  root.innerHTML = `
    <div class="sl">
      ${cfg.sliders.map((s, i) => `
        <div class="sl-row">
          <span class="sl-label">${s.label}</span>
          <button class="sl-step" data-i="${i}" data-d="-1" aria-label="down">◀</button>
          <input type="range" min="${s.min}" max="${s.max}" step="${s.step ?? 1}" value="${values[i]}" data-i="${i}">
          <button class="sl-step" data-i="${i}" data-d="1" aria-label="up">▶</button>
          <span class="sl-value"></span>
        </div>`).join('')}
    </div>`;
  const wrap = root.querySelector('.sl');
  const inputs = [...root.querySelectorAll('input')];
  const labels = [...root.querySelectorAll('.sl-value')];

  function update() {
    inputs.forEach((inp, i) => { inp.value = values[i]; labels[i].textContent = fmt(values[i]); });
    if (!done && values.every((v, i) => v === Number(cfg.solution[i]))) {
      done = true;
      wrap.classList.add('ok');
      inputs.forEach(inp => { inp.disabled = true; });
      setTimeout(ctx.solve, 900);
    }
  }

  inputs.forEach(inp => inp.addEventListener('input', () => {
    if (done) return;
    values[+inp.dataset.i] = Number(inp.value);
    update();
  }));
  root.querySelectorAll('.sl-step').forEach(b => b.addEventListener('click', () => {
    if (done) return;
    const i = +b.dataset.i, s = cfg.sliders[i];
    values[i] = Math.min(s.max, Math.max(s.min, values[i] + (+b.dataset.d) * (s.step ?? 1)));
    update();
  }));
  update();
}

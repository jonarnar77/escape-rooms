// Numeric keypad. Config: { solution: '2749', length?, okText?, errText? }
export default function keypad(root, cfg, ctx) {
  const solution = String(cfg.solution);
  const len = cfg.length ?? solution.length;
  let entry = '';
  let locked = false;

  root.innerHTML = `
    <div class="kp">
      <div class="kp-screen"></div>
      <div class="kp-keys">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'OK'].map(k => `<button data-k="${k}">${k}</button>`).join('')}
      </div>
    </div>`;
  const screen = root.querySelector('.kp-screen');
  const show = () => { screen.textContent = entry.padEnd(len, '_'); };
  show();

  function press(k) {
    if (locked) return;
    if (k === 'C') entry = '';
    else if (k === 'OK') return check();
    else if (entry.length < len) entry += k;
    show();
  }

  function check() {
    locked = true;
    if (entry === solution) {
      screen.textContent = cfg.okText ?? 'OPEN';
      screen.classList.add('ok');
      setTimeout(ctx.solve, 700);
    } else {
      screen.textContent = cfg.errText ?? 'ERROR';
      screen.classList.add('err');
      entry = '';
      setTimeout(() => { screen.classList.remove('err'); locked = false; show(); }, 800);
    }
  }

  root.querySelectorAll('button').forEach(b => b.addEventListener('click', () => press(b.dataset.k)));

  const onKey = e => {
    if (/^[0-9]$/.test(e.key)) press(e.key);
    else if (e.key === 'Enter') press('OK');
    else if (e.key === 'Backspace') { entry = entry.slice(0, -1); show(); }
  };
  addEventListener('keydown', onKey);
  ctx.onClose(() => removeEventListener('keydown', onKey));
}

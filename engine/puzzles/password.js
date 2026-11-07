// Green-screen terminal that asks for a password.
// Config: { solution: 'BRAIN', lines?: string[] (screen text above the prompt),
//           caseSensitive?: false, okText?, errText? }
export default function password(root, cfg, ctx) {
  const norm = s => (cfg.caseSensitive ? s : s.toUpperCase()).trim();
  root.innerHTML = `
    <div class="term">
      <div class="term-out"></div>
      <div class="term-input"><span>&gt;</span><input type="text" maxlength="24" autocomplete="off" spellcheck="false" aria-label="password"></div>
    </div>`;
  const out = root.querySelector('.term-out');
  const input = root.querySelector('input');
  const line = (text, cls = '') => {
    const d = document.createElement('div');
    d.className = `term-line ${cls}`;
    d.textContent = text;
    out.append(d);
  };
  const header = cfg.lines ?? ['ENTER PASSWORD:'];
  header.forEach(l => line(l, l.startsWith('(') ? 'dim' : ''));
  setTimeout(() => input.focus(), 50);

  let done = false;
  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || done) return;
    const guess = input.value;
    input.value = '';
    line(`> ${norm(guess)}`);
    if (norm(guess) === norm(String(cfg.solution))) {
      done = true;
      input.disabled = true;
      line(cfg.okText ?? 'ACCESS GRANTED');
      setTimeout(ctx.solve, 900);
    } else {
      line(cfg.errText ?? 'ACCESS DENIED', 'err');
      // keep the screen from overflowing
      while (out.children.length > 14) out.children[header.length].remove();
    }
  });
}

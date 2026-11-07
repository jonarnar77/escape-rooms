// Rotating combination dials. Solves automatically when all dials match.
// Config: { solution: [3, 6, 1], symbols?: ['0'..'9'], colors?: ['#c33', ...] }
export default function dials(root, cfg, ctx) {
  const symbols = cfg.symbols ?? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const target = cfg.solution.map(String);
  const pos = target.map(() => 0);
  let done = false;

  root.innerHTML = `
    <div class="dials">
      <div class="dial-row">
        ${target.map((_, i) => `
          <div class="dial">
            <button data-i="${i}" data-d="-1" aria-label="up">▲</button>
            <div class="dial-face" ${cfg.colors?.[i] ? `style="border-color:${cfg.colors[i]}"` : ''}></div>
            <button data-i="${i}" data-d="1" aria-label="down">▼</button>
          </div>`).join('')}
      </div>
    </div>`;
  const wrap = root.querySelector('.dials');
  const faces = [...root.querySelectorAll('.dial-face')];
  const show = () => faces.forEach((f, i) => { f.textContent = symbols[pos[i]]; });
  show();

  root.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    if (done) return;
    const i = +b.dataset.i;
    pos[i] = (pos[i] + +b.dataset.d + symbols.length) % symbols.length;
    show();
    if (pos.every((p, j) => symbols[p] === target[j])) {
      done = true;
      wrap.classList.add('ok');
      setTimeout(ctx.solve, 700);
    }
  }));
}

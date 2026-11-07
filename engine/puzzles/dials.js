// Rotating combination dials. Solves automatically when all dials match.
// Config: { solution: [3, 6, 1], symbols?: ['0'..'9'] (or one list per dial: [[...], [...]]),
//           start?: [indices], colors?: ['#c33', ...], faceWidth?: 60, fontSize?: 36 }
export default function dials(root, cfg, ctx) {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const target = cfg.solution.map(String);
  // one symbol list for all dials, or a separate list per dial
  const lists = target.map((_, i) => Array.isArray(cfg.symbols?.[0]) ? cfg.symbols[i] : (cfg.symbols ?? digits));
  const pos = target.map((_, i) => cfg.start?.[i] ?? 0);
  let done = false;

  root.innerHTML = `
    <div class="dials">
      <div class="dial-row">
        ${target.map((_, i) => `
          <div class="dial">
            <button data-i="${i}" data-d="-1" aria-label="up">▲</button>
            <div class="dial-face" style="${cfg.colors?.[i] ? `border-color:${cfg.colors[i]};` : ''}${cfg.faceWidth ? `width:${cfg.faceWidth}px;` : ''}${cfg.fontSize ? `font-size:${cfg.fontSize}px;` : ''}"></div>
            <button data-i="${i}" data-d="1" aria-label="down">▼</button>
          </div>`).join('')}
      </div>
    </div>`;
  const wrap = root.querySelector('.dials');
  const faces = [...root.querySelectorAll('.dial-face')];
  const show = () => faces.forEach((f, i) => { f.textContent = lists[i][pos[i]]; });
  show();

  root.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    if (done) return;
    const i = +b.dataset.i;
    pos[i] = (pos[i] + +b.dataset.d + lists[i].length) % lists[i].length;
    show();
    if (pos.every((p, j) => lists[j][p] === target[j])) {
      done = true;
      wrap.classList.add('ok');
      setTimeout(ctx.solve, 700);
    }
  }));
}

// Clock-face lock: set the hands, then try the handle.
// Config: { solution: { h: 3, m: 15 }, start?: { h, m }, minuteStep?: 5,
//           handleText?: 'Turn the handle', failText? }
//   or, instead of solution: check: (h, m) => true | 'failure message'   (h is 1..12)
//   for locks that accept a range of times.
export default function clock(root, cfg, ctx) {
  const step = cfg.minuteStep ?? 5;
  let h = cfg.start?.h ?? 12, m = cfg.start?.m ?? 0;
  let done = false;

  let ticks = '';
  for (let i = 0; i < 60; i++) {
    const big = i % 5 === 0;
    ticks += `<line y1="-92" y2="${big ? -78 : -86}" transform="rotate(${i * 6})" stroke="#222" stroke-width="${big ? 4 : 1.5}"/>`;
  }
  const nums = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
    const a = (i * 30 - 90) * Math.PI / 180;
    return `<text x="${Math.cos(a) * 64}" y="${Math.sin(a) * 64 + 7}" font-size="20" text-anchor="middle" font-family="Georgia, serif" fill="#222">${n}</text>`;
  }).join('');

  root.innerHTML = `
    <div class="clk">
      <svg viewBox="-110 -110 220 220" class="clk-face">
        <circle r="104" fill="#3a3f44"/><circle r="98" fill="#efe9d6" stroke="#8a7a4a" stroke-width="5"/>
        ${ticks}${nums}
        <line class="clk-h" y2="-50" stroke="#111" stroke-width="8" stroke-linecap="round"/>
        <line class="clk-m" y2="-78" stroke="#111" stroke-width="4" stroke-linecap="round"/>
        <circle r="7" fill="#8a7a4a"/>
      </svg>
      <div class="clk-controls">
        <div class="clk-row"><span>Hour</span><button class="btn" data-k="h-">◀</button><button class="btn" data-k="h+">▶</button></div>
        <div class="clk-row"><span>Minute</span><button class="btn" data-k="m-">◀</button><button class="btn" data-k="m+">▶</button></div>
        <button class="btn big" data-k="go">${cfg.handleText ?? 'Turn the handle'}</button>
      </div>
    </div>`;
  const hand = { h: root.querySelector('.clk-h'), m: root.querySelector('.clk-m') };
  const face = root.querySelector('.clk-face');
  const draw = () => {
    hand.h.setAttribute('transform', `rotate(${(h % 12) * 30 + m * 0.5})`);
    hand.m.setAttribute('transform', `rotate(${m * 6})`);
  };
  draw();

  root.querySelectorAll('[data-k]').forEach(b => b.addEventListener('click', () => {
    if (done) return;
    const k = b.dataset.k;
    if (k === 'h+') h = h % 12 + 1;
    if (k === 'h-') h = (h + 10) % 12 + 1;
    if (k === 'm+') m = (m + step) % 60;
    if (k === 'm-') m = (m - step + 60) % 60;
    draw();
    if (k !== 'go') return;
    const verdict = cfg.check ? cfg.check(h, m) : (h % 12 === cfg.solution.h % 12 && m === cfg.solution.m);
    if (verdict === true) {
      done = true;
      face.classList.add('ok');
      setTimeout(ctx.solve, 800);
    } else {
      ctx.say(typeof verdict === 'string' ? verdict : cfg.failText ?? "The handle won't budge.");
      face.classList.remove('clk-shake'); void face.getBoundingClientRect(); face.classList.add('clk-shake');
    }
  }));
}

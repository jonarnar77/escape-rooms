// Pour measures from bottles into a flask, then "Mix".
// Config: {
//   bottles: [{ id, label, color }],
//   capacity?: 6,
//   solution?: ['a','a','b']          exact sequence, OR
//   check?: (seq, g) => true | 'failure message',
//   failText?: string,
// }
export default function mixer(root, cfg, ctx) {
  const cap = cfg.capacity ?? 6;
  const byId = Object.fromEntries(cfg.bottles.map(b => [b.id, b]));
  let seq = [];
  let done = false;

  const bottleSvg = color => `
    <svg viewBox="0 0 70 110">
      <rect x="25" y="4" width="20" height="18" rx="2" fill="#2a2f2c"/>
      <path d="M22 22 h26 v14 q14 6 14 22 v40 q0 8 -8 8 h-38 q-8 0 -8 -8 v-40 q0 -16 14 -22 Z" fill="#cfd8d4" opacity=".25" stroke="#9aa7a1" stroke-width="2"/>
      <path d="M10 60 q0 -6 4 -8 h42 q4 2 4 8 v38 q0 6 -6 6 h-38 q-6 0 -6 -6 Z" fill="${color}" opacity=".85"/>
      <rect x="14" y="66" width="42" height="20" fill="#efe9d6" opacity=".9"/>
    </svg>`;

  root.innerHTML = `
    <div class="mixer">
      <div class="mixer-bottles">
        ${cfg.bottles.map(b => `<button class="bottle" data-id="${b.id}">${bottleSvg(b.color)}${b.label}</button>`).join('')}
      </div>
      <div class="mixer-flask">
        <svg viewBox="0 0 120 150">
          <defs><clipPath id="flaskClip"><path d="M48 8 h24 v40 l38 84 q4 10 -8 10 h-84 q-12 0 -8 -10 l38 -84 Z"/></clipPath></defs>
          <g clip-path="url(#flaskClip)" class="mixer-liquid"></g>
          <path d="M48 8 h24 v40 l38 84 q4 10 -8 10 h-84 q-12 0 -8 -10 l38 -84 Z" fill="none" stroke="#cfd8d4" stroke-width="3"/>
          <rect x="44" y="4" width="32" height="6" rx="2" fill="#cfd8d4"/>
        </svg>
        <div class="mixer-actions">
          <button class="btn" data-a="empty">Empty</button>
          <button class="btn" data-a="mix">Mix</button>
        </div>
      </div>
    </div>`;

  const liquid = root.querySelector('.mixer-liquid');
  const draw = () => {
    const top = 50, bottom = 142, layer = (bottom - top) / cap;
    liquid.innerHTML = seq.map((id, i) =>
      `<rect x="0" y="${bottom - (i + 1) * layer}" width="120" height="${layer + 0.5}" fill="${byId[id].color}" opacity=".85"/>`).join('');
  };

  root.querySelectorAll('.bottle').forEach(b => b.addEventListener('click', () => {
    if (done) return;
    if (seq.length >= cap) return ctx.say('The flask is full.');
    seq.push(b.dataset.id);
    draw();
  }));

  root.querySelector('[data-a="empty"]').addEventListener('click', () => { if (!done) { seq = []; draw(); } });
  root.querySelector('[data-a="mix"]').addEventListener('click', () => {
    if (done) return;
    if (!seq.length) return ctx.say('The flask is empty.');
    const result = cfg.check
      ? cfg.check(seq, ctx.api)
      : (seq.length === cfg.solution.length && seq.every((s, i) => s === cfg.solution[i])) || undefined;
    if (result === true) {
      done = true;
      liquid.innerHTML = `<rect x="0" y="${142 - (92 / cap) * seq.length}" width="120" height="150" fill="${cfg.resultColor ?? '#9be36a'}"/>`;
      setTimeout(ctx.solve, 900);
    } else {
      ctx.say(typeof result === 'string' ? result : (cfg.failText ?? 'Nothing useful happens. You pour it away.'));
      seq = [];
      setTimeout(draw, 400);
    }
  });
  draw();
}

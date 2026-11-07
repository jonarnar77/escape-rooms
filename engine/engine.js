// Point-and-click escape room engine (Flash-style).
// Generic: knows nothing about any specific game. A game is a plain data object
// (see games/helix-sublevel-5/game.js) with scenes, hotspots, items and puzzles.
//
// Usage: new Game(rootElement, gameData, { home: '../../' })
//   home: optional link back to the landing page (adds "All games" to the menus).

import keypad from './puzzles/keypad.js';
import dials from './puzzles/dials.js';
import password from './puzzles/password.js';
import mixer from './puzzles/mixer.js';
import rotateGrid from './puzzles/rotate-grid.js';
import sliders from './puzzles/sliders.js';
import clock from './puzzles/clock.js';
import sequence from './puzzles/sequence.js';
import assemble from './puzzles/assemble.js';
import select from './puzzles/select.js';
import order from './puzzles/order.js';
import assign from './puzzles/assign.js';

export const W = 800;      // logical stage width  (all art + hotspot coords use this space)
export const H = 600;      // logical stage height
export const INV_H = 100;  // inventory bar height
const SLOTS = 8;
const SVG_NS = 'http://www.w3.org/2000/svg';

const puzzleTypes = { keypad, dials, password, mixer, 'rotate-grid': rotateGrid, sliders, clock, sequence, assemble, select, order, assign };

const DIFFICULTIES = {
  easy: 'Hints available and important objects sparkle.',
  medium: 'The intended experience.',
  hard: 'Fewer clues. Think for yourself.',
};
/** Register a reusable puzzle widget: fn(mountEl, config, ctx) */
export function registerPuzzle(type, fn) { puzzleTypes[type] = fn; }

const ARROWS = {
  left: 'M20 4 L8 16 L20 28',
  right: 'M12 4 L24 16 L12 28',
  back: 'M4 10 L16 22 L28 10',
  up: 'M4 22 L16 10 L28 22',
};

function h(tag, attrs = {}, html) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  }
  if (html != null) e.innerHTML = html;
  return e;
}
const val = (x, g) => (typeof x === 'function' ? x(g) : x);

export class Game {
  constructor(root, data, options = {}) {
    this.root = root;
    this.data = data;
    this.home = options.home;
    this.saveKey = `escape-save:${data.id}`;
    this.modalCleanup = [];
    this.hoverLabel = '';
    const params = new URLSearchParams(location.search);
    this.debug = params.has('debug');

    this.makeApi();
    this.buildDOM();
    this.fit();
    addEventListener('resize', () => this.fit());

    this.state = this.freshState();
    if (this.debug && params.get('scene')) {
      this.state = this.freshState(params.get('difficulty') || 'medium');
      this.data.setup?.(this.api);
      this.go(params.get('scene'));
      this.render();
    } else {
      this.render();
      this.showTitle();
    }
  }

  // ---------- state ----------
  freshState(difficulty = 'medium') {
    return { scene: this.data.start, inventory: [], flags: {}, selected: null, difficulty, notes: [] };
  }
  load() {
    try {
      const s = JSON.parse(localStorage.getItem(this.saveKey));
      return s && this.data.scenes[s.scene] ? s : null;
    } catch { return null; }
  }
  save() { try { localStorage.setItem(this.saveKey, JSON.stringify(this.state)); } catch {} }
  clearSave() { try { localStorage.removeItem(this.saveKey); } catch {} }
  commit() { this.save(); this.render(); }

  // The object passed to every callback in game data (conventionally named `g`).
  makeApi() {
    const game = this;
    this.api = {
      flag: k => !!game.state.flags[k],
      get: k => game.state.flags[k],
      set: (k, v = true) => { game.state.flags[k] = v; },
      unset: k => { delete game.state.flags[k]; },
      has: id => game.state.inventory.includes(id),
      give: id => { if (!game.state.inventory.includes(id)) game.state.inventory.push(id); },
      take: id => {
        game.state.inventory = game.state.inventory.filter(i => i !== id);
        if (game.state.selected === id) game.state.selected = null;
      },
      get selected() { return game.state.selected; },
      /** Save a clue to the notebook (once per id). Only shown if the game sets `notebook: true`. */
      note: (id, text) => game.addNote(id, text),
      hasNote: id => (game.state.notes ?? []).some(n => n.id === id),
      get scene() { return game.state.scene; },
      get difficulty() { return game.state.difficulty ?? 'medium'; },
      /** True while the player is looking at the current scene's "past" version. */
      get past() { return !!game.state.pastView; },
      /** Pick a value by difficulty: g.diff({ easy, medium, hard }); missing keys fall back to medium. */
      diff: map => map[game.state.difficulty ?? 'medium'] ?? map.medium,
      say: (text, ms) => game.say(text, ms),
      go: id => game.go(id),
      puzzle: id => game.openPuzzle(id),
      solved: id => !!game.state.flags['solved:' + id],
      win: text => game.showWin(text),
      sound: src => game.sound(src),
      /** Screen effect: 'flash' (white flash), 'shake', 'red' (red pulse). */
      effect: name => game.effect(name),
    };
  }

  // ---------- DOM ----------
  buildDOM() {
    this.root.innerHTML = '';
    this.frame = h('div', { class: 'frame' });
    this.stage = h('div', { class: 'stage' });

    this.art = document.createElementNS(SVG_NS, 'svg');
    this.art.setAttribute('viewBox', `0 0 ${W} ${H}`);
    this.art.setAttribute('class', 'art');
    this.hot = document.createElementNS(SVG_NS, 'svg');
    this.hot.setAttribute('viewBox', `0 0 ${W} ${H}`);
    this.hot.setAttribute('class', 'hot');

    this.hud = h('div', { class: 'hud' });
    this.label = h('div', { class: 'label' });
    this.msg = h('div', { class: 'msg' });
    this.modal = h('div', { class: 'overlay modal', hidden: '' });

    this.nav = {};
    for (const dir of Object.keys(ARROWS)) {
      const b = h('button', { class: `nav ${dir}`, 'aria-label': dir },
        `<svg viewBox="0 0 32 32"><path d="${ARROWS[dir]}" fill="none" stroke="#e8efe2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
      b.addEventListener('click', e => { e.stopPropagation(); this.navigate(dir); });
      this.nav[dir] = b;
    }

    this.hintBtn = h('button', { class: 'hint-btn', title: 'Hint', hidden: '' }, '?');
    this.hintBtn.addEventListener('click', e => { e.stopPropagation(); this.hint(); });

    // Past/present toggle: shown on scenes that define `past` art, once `data.canSeePast(g)` allows it.
    this.pastBtn = h('button', { class: 'past-btn', hidden: '' });
    this.pastBtn.addEventListener('click', e => { e.stopPropagation(); this.togglePast(); });

    this.stage.append(this.art, this.hot, ...Object.values(this.nav), this.hintBtn, this.pastBtn, this.hud, this.label, this.msg, this.modal);

    this.inv = h('div', { class: 'inventory' });
    this.slots = [];
    for (let i = 0; i < SLOTS; i++) {
      const slot = h('div', { class: 'slot' });
      slot.addEventListener('click', () => this.clickSlot(i));
      slot.addEventListener('dblclick', () => {
        const id = this.state.inventory[i];
        if (id) this.examine(id);
      });
      this.slots.push(slot);
      this.inv.append(slot);
    }
    const side = h('div', { class: 'inv-side' });
    const exBtn = h('button', { class: 'btn' }, 'Examine');
    exBtn.addEventListener('click', () => {
      if (this.state.selected) this.examine(this.state.selected);
      else this.say('Select an item first.');
    });
    const menuBtn = h('button', { class: 'btn' }, 'Menu');
    menuBtn.addEventListener('click', () => this.showMenu());
    side.append(exBtn);
    if (this.data.notebook) {
      this.nbBtn = h('button', { class: 'btn' }, 'Notebook');
      this.nbBtn.addEventListener('click', () => this.showNotebook());
      side.append(this.nbBtn);
    }
    side.append(menuBtn);
    this.inv.append(side);

    this.screen = h('div', { class: 'overlay screen', hidden: '' });
    this.frame.append(this.stage, this.inv, this.screen);
    this.root.append(this.frame);

    this.stage.addEventListener('contextmenu', e => { e.preventDefault(); this.deselect(); });
    addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' && e.key !== 'Escape') return;
      if (e.key === 'Escape') {
        if (!this.modal.hidden) this.closeModal(); else this.deselect();
      }
      if (this.debug && e.key === 'h' && this.modal.hidden) this.root.classList.toggle('debug');
    });
    if (this.debug) this.setupDebug();
  }

  fit() {
    const s = Math.min(innerWidth / W, innerHeight / (H + INV_H));
    this.frame.style.transform = `scale(${s})`;
    this.root.style.width = `${W * s}px`;
    this.root.style.height = `${(H + INV_H) * s}px`;
  }

  // ---------- rendering ----------
  render() {
    const g = this.api;
    const scene = this.data.scenes[this.state.scene];
    if (!scene) { console.error('Unknown scene', this.state.scene); return; }

    const canPast = !!scene.past && (this.data.canSeePast?.(g) ?? true);
    if (!canPast) this.state.pastView = false;
    this.viewingPast = canPast && !!this.state.pastView;
    this.stage.classList.toggle('past', this.viewingPast);
    this.pastBtn.hidden = !canPast;
    const labels = this.data.pastLabels ?? { past: 'Yesterday', present: 'Today' };
    this.pastBtn.textContent = this.viewingPast ? `◀ ${labels.present}` : `${labels.past} ▶`;
    let art = val(this.viewingPast ? scene.past : scene.art, g) || '';
    if (scene.image) art = `<image href="${scene.image}" width="${W}" height="${H}" preserveAspectRatio="none"/>` + art;
    this.art.innerHTML = art;
    if (this.lastScene !== this.state.scene) {
      this.art.classList.remove('fade'); void this.art.getBoundingClientRect(); this.art.classList.add('fade');
      this.lastScene = this.state.scene;
    }

    this.hot.innerHTML = '';
    this.hoverLabel = '';
    for (const hs of scene.hotspots || []) {
      if (!this.visible(hs)) continue;
      const geo = { rect: val(hs.rect, g), poly: val(hs.poly, g), circle: val(hs.circle, g) };
      const shape = this.shapeFor(geo, hs);
      shape.classList.add('hotspot');
      if (hs.id) shape.dataset.id = hs.id;
      shape.addEventListener('click', e => { e.stopPropagation(); this.clickHotspot(hs); });
      shape.addEventListener('mouseenter', () => { this.hoverLabel = val(hs.label, g) || ''; this.updateLabel(); });
      shape.addEventListener('mouseleave', () => { this.hoverLabel = ''; this.updateLabel(); });
      this.hot.append(shape);
      if (this.api.difficulty === 'easy' && (hs.take || val(hs.sparkle, g))) this.hot.append(this.sparkleFor(geo));
      if (this.debug) {
        const t = document.createElementNS(SVG_NS, 'text');
        const [x, y] = geo.rect || geo.poly || geo.circle;
        t.setAttribute('x', x + 3); t.setAttribute('y', y + 12);
        t.setAttribute('class', 'hot-label');
        t.textContent = hs.id || hs.label || '';
        this.hot.append(t);
      }
    }

    for (const [dir, btn] of Object.entries(this.nav)) btn.hidden = !val(scene.nav?.[dir], g);
    this.hintBtn.hidden = this.api.difficulty !== 'easy';

    const room = this.data.rooms?.[scene.room];
    const pastCaption = (this.data.pastLabels?.caption) ?? "yesterday's photo";
    this.hud.textContent = (room ? room.name : '') + (this.viewingPast ? ` · ${pastCaption}` : '');
    this.renderInventory();
    this.updateLabel();
  }

  visible(hs) {
    const g = this.api;
    // hotspot.era: 'present' (default), 'past' or 'both'
    const era = hs.era ?? 'present';
    if (era !== 'both' && (era === 'past') !== !!this.viewingPast) return false;
    if (hs.when && !hs.when(g)) return false;
    if (hs.take && g.flag('took:' + hs.take)) return false;
    return true;
  }

  // geo: { rect | poly | circle } already resolved (they may be functions of g in game data)
  shapeFor(hs, src) {
    let e;
    if (hs.rect) {
      const [x, y, w, hh] = hs.rect;
      e = document.createElementNS(SVG_NS, 'rect');
      Object.entries({ x, y, width: w, height: hh }).forEach(([k, v]) => e.setAttribute(k, v));
    } else if (hs.poly) {
      e = document.createElementNS(SVG_NS, 'polygon');
      e.setAttribute('points', hs.poly.join(' '));
    } else if (hs.circle) {
      const [cx, cy, r] = hs.circle;
      e = document.createElementNS(SVG_NS, 'circle');
      Object.entries({ cx, cy, r }).forEach(([k, v]) => e.setAttribute(k, v));
    } else throw new Error(`Hotspot ${src.id || src.label} needs rect, poly or circle`);
    return e;
  }

  sparkleFor(hs) {
    let cx, cy;
    if (hs.rect) { const [x, y, w, hh] = hs.rect; cx = x + w / 2; cy = y + hh / 2; }
    else if (hs.circle) [cx, cy] = hs.circle;
    else {
      const xs = hs.poly.filter((_, i) => i % 2 === 0), ys = hs.poly.filter((_, i) => i % 2 === 1);
      cx = xs.reduce((a, b) => a + b) / xs.length; cy = ys.reduce((a, b) => a + b) / ys.length;
    }
    const e = document.createElementNS(SVG_NS, 'g');
    e.setAttribute('transform', `translate(${cx},${cy})`);
    e.innerHTML = '<path class="sparkle" d="M0 -11 L2.5 -2.5 L11 0 L2.5 2.5 L0 11 L-2.5 2.5 L-11 0 L-2.5 -2.5Z"/>';
    return e;
  }

  itemName(id) { return val(this.data.items[id]?.name, this.api) ?? id; }

  renderInventory() {
    const { inventory, selected } = this.state;
    this.slots.forEach((slot, i) => {
      const id = inventory[i];
      const item = id && this.data.items[id];
      slot.classList.toggle('selected', !!id && id === selected);
      slot.innerHTML = item ? `<svg viewBox="0 0 100 100">${val(item.icon, this.api) || ''}</svg>` : '';
      slot.title = item ? this.itemName(id) : '';
    });
  }

  updateLabel() {
    const sel = this.state.selected;
    this.label.textContent = sel
      ? `Use ${this.itemName(sel)} on ${this.hoverLabel || '…'}`
      : this.hoverLabel;
  }

  // ---------- interaction ----------
  clickHotspot(hs) {
    const g = this.api;
    const sel = this.state.selected;
    if (sel) {
      const fn = hs.use?.[sel] ?? hs.use?.['*'];
      if (fn) { fn(g, sel); return this.commit(); }
      // zooming into a close-up keeps the item selected, ready to use in there
      if (val(hs.go, g)) { this.go(val(hs.go, g)); return this.commit(); }
      // the object accepts some items, just not this one
      if (hs.use) { this.say(this.data.messages?.noUse ?? "That doesn't work."); return this.commit(); }
      // the object never takes items: drop the selection and interact with it normally,
      // so a forgotten selected item can't make an object seem dead
      this.state.selected = null;
    }
    if (hs.take) {
      g.give(hs.take);
      g.set('took:' + hs.take);
      if (!hs.say) this.say(`You pick up the ${this.itemName(hs.take)}.`);
    }
    if (hs.say) this.say(val(hs.say, g));
    if (hs.click) hs.click(g);
    const target = val(hs.go, g);   // `go` may be a function returning null = don't move
    if (target) this.go(target);
    this.commit();
  }

  clickSlot(i) {
    const id = this.state.inventory[i];
    if (!id) return;
    const sel = this.state.selected;
    if (!sel || sel === id) {
      this.state.selected = sel === id ? null : id;
    } else {
      const a = this.data.items[sel], b = this.data.items[id];
      const fn = a?.combine?.[id] ?? b?.combine?.[sel];
      if (fn) { this.state.selected = null; fn(this.api); }
      else this.say(this.data.messages?.noCombine ?? "Those don't go together.");
    }
    this.commit();
  }

  deselect() {
    if (!this.state?.selected) return;
    this.state.selected = null;
    this.commit();
  }

  navigate(dir) {
    const scene = this.data.scenes[this.state.scene];
    const target = val(scene.nav?.[dir], this.api);
    if (target) { this.go(target); this.commit(); }
  }

  togglePast() {
    this.state.pastView = !this.state.pastView;
    this.effect('shutter');
    const scene = this.data.scenes[this.state.scene];
    this.render();
    if (this.state.pastView) scene.onPast?.(this.api);
    this.data.onPastToggle?.(this.api, this.state.pastView);
    this.commit();
  }

  go(id) {
    if (id !== this.state.scene) this.state.pastView = false;
    const scene = this.data.scenes[id];
    if (!scene) { console.error('Unknown scene', id); return; }
    this.state.scene = id;
    scene.enter?.(this.api);
  }

  say(text, ms) {
    if (!text) return;
    this.msg.textContent = text;
    this.msg.classList.add('show');
    clearTimeout(this.msgTimer);
    this.msgTimer = setTimeout(() => this.msg.classList.remove('show'), ms ?? Math.max(2500, text.length * 65));
  }

  hint() {
    const scene = this.data.scenes[this.state.scene];
    const hints = this.data.rooms?.[scene.room]?.hints ?? [];
    const h = hints.find(x => !x.when || x.when(this.api));
    this.say(h ? val(h.text, this.api) : 'No hints right now. Keep exploring.', 6000);
  }

  effect(name) {
    const cls = `fx-${name}`;
    this.stage.classList.remove(cls);
    void this.stage.offsetWidth;          // restart the animation
    this.stage.classList.add(cls);
    setTimeout(() => this.stage.classList.remove(cls), 1000);
  }

  sound(src) {
    try { const a = new Audio(src); a.volume = 0.6; a.play().catch(() => {}); } catch {}
  }

  // ---------- modals (puzzles, examine) ----------
  openModal(cls) {
    this.closeModal();
    const panel = h('div', { class: `panel ${cls}` });
    const x = h('button', { class: 'close', 'aria-label': 'Close' }, '✕');
    x.addEventListener('click', () => this.closeModal());
    const body = h('div');
    panel.append(x, body);
    this.modal.append(panel);
    this.modal.hidden = false;
    this.modal.onclick = e => { if (e.target === this.modal) this.closeModal(); };
    return body;
  }

  closeModal() {
    this.modal.hidden = true;
    this.modal.innerHTML = '';
    const fns = this.modalCleanup;
    this.modalCleanup = [];
    fns.forEach(f => f());
  }

  openPuzzle(id) {
    const p = this.data.puzzles?.[id];
    if (!p) return console.error('Unknown puzzle', id);
    const fn = p.render ?? puzzleTypes[p.type];
    if (!fn) return console.error('Unknown puzzle type', p.type);
    const body = this.openModal(`puzzle puzzle-${p.type ?? 'custom'}`);
    if (p.prompt) body.append(h('p', { class: 'puzzle-prompt' }, val(p.prompt, this.api)));
    const mount = h('div');
    body.append(mount);
    // `solution` may be a function of game state; `config: g => ({...})` adds state-dependent settings.
    const cfg = { ...p, ...p.config?.(this.api), solution: val(p.solution, this.api) };
    fn(mount, cfg, {
      api: this.api,
      solve: () => {
        this.api.set('solved:' + id);
        this.closeModal();
        p.solve?.(this.api);
        this.commit();
      },
      close: () => this.closeModal(),
      say: t => this.say(t),
      sound: s => this.sound(s),
      onClose: f => this.modalCleanup.push(f),
    });
  }

  addNote(id, text) {
    const notes = this.state.notes ??= [];
    if (notes.some(n => n.id === id)) return;
    const room = this.data.rooms?.[this.data.scenes[this.state.scene]?.room]?.name ?? '';
    notes.push({ id, text, room });
    if (this.nbBtn) {
      this.nbBtn.classList.remove('nb-new'); void this.nbBtn.offsetWidth; this.nbBtn.classList.add('nb-new');
    }
  }

  showNotebook() {
    this.nbBtn?.classList.remove('nb-new');
    const notes = this.state.notes ?? [];
    const body = this.openModal('notebook');
    let lastRoom = null;
    body.innerHTML = `<h3>Notebook</h3>` + (notes.length ? notes.map(n => {
      const head = n.room !== lastRoom ? `<h4>${n.room}</h4>` : '';
      lastRoom = n.room;
      return `${head}<p>${n.text}</p>`;
    }).join('') : '<p class="nb-empty">Nothing yet. Clues you find will be written down here.</p>');
  }

  examine(id) {
    const item = this.data.items[id];
    if (!item) return;
    // `examine: g => ...` on an item replaces the default pop-up (e.g. zoom into a close-up
    // scene). Return false from it to fall back to the pop-up.
    if (item.examine && item.examine(this.api) !== false) { this.commit(); return; }
    const body = this.openModal('examine');
    body.innerHTML = `
      <svg viewBox="0 0 100 100" class="examine-icon">${val(item.icon, this.api) || ''}</svg>
      <h3>${this.itemName(id)}</h3>
      <p>${val(item.description, this.api) || ''}</p>`;
  }

  // ---------- full-frame screens ----------
  showScreen(html, actions = {}) {
    this.closeModal();
    this.screen.innerHTML = `<div class="panel screen-panel">${html}</div>`;
    this.screen.querySelectorAll('[data-a]').forEach(b =>
      b.addEventListener('click', () => actions[b.dataset.a]?.()));
    this.screen.hidden = false;
  }
  hideScreen() { this.screen.hidden = true; this.screen.innerHTML = ''; }

  showTitle() {
    const saved = this.load();
    this.showScreen(`
      <h1>${this.data.title}</h1>
      ${this.data.subtitle ? `<p class="sub">${this.data.subtitle}</p>` : ''}
      <div class="menu">
        <button class="btn big" data-a="new">New game</button>
        ${saved ? '<button class="btn big" data-a="cont">Continue</button>' : ''}
        ${this.homeButton()}
      </div>`, {
      new: () => this.chooseDifficulty(),
      cont: () => { this.state = saved; this.hideScreen(); this.render(); },
      home: () => this.goHome(),
    });
  }

  chooseDifficulty() {
    const desc = { ...DIFFICULTIES, ...this.data.difficulties };
    this.showScreen(`
      <h2>Choose difficulty</h2>
      <div class="menu">
        ${['easy', 'medium', 'hard'].map(d => `
          <button class="btn big" data-a="${d}">${d[0].toUpperCase() + d.slice(1)}</button>
          <p class="diff-desc">${desc[d]}</p>`).join('')}
        <button class="btn" data-a="back">Back</button>
      </div>`, {
      easy: () => this.newGame('easy'),
      medium: () => this.newGame('medium'),
      hard: () => this.newGame('hard'),
      back: () => this.showTitle(),
    });
  }

  showMenu() {
    this.showScreen(`
      <h2>Paused</h2>
      <p class="sub">Difficulty: ${this.api.difficulty}</p>
      <div class="menu">
        <button class="btn big" data-a="resume">Resume</button>
        <button class="btn big" data-a="restart">Restart game</button>
        ${this.homeButton()}
      </div>
      <p class="hint">Click objects to interact. Click an item to select it, then click something in the room to use it.
      Select one item and click another to combine. Double-click or "Examine" to inspect. Right-click / Esc deselects.</p>`, {
      resume: () => this.hideScreen(),
      restart: () => { if (confirm('Restart from the beginning? Progress will be lost.')) this.chooseDifficulty(); },
      home: () => this.goHome(),
    });
  }

  newGame(difficulty = this.state?.difficulty ?? 'medium') {
    this.clearSave();
    this.state = this.freshState(difficulty);
    this.data.setup?.(this.api);
    this.hideScreen();
    this.go(this.data.start);
    this.commit();
    if (this.data.intro) this.say(this.data.intro, 7000);
  }

  homeButton() {
    return this.home ? '<button class="btn" data-a="home">All games</button>' : '';
  }
  goHome() { location.href = this.home; }

  showWin(text) {
    this.state.won = true;
    this.save();
    // a separate record survives "Play again", so the landing page can keep showing "Escaped ✓"
    try { localStorage.setItem(`escape-won:${this.data.id}`, JSON.stringify({ difficulty: this.api.difficulty, at: Date.now() })); } catch {}
    this.showScreen(`
      <h1>${this.data.winTitle ?? 'You escaped!'}</h1>
      <p class="sub">${text ?? ''}</p>
      <div class="menu"><button class="btn big" data-a="again">Play again</button>${this.homeButton()}</div>`, {
      again: () => this.chooseDifficulty(),
      home: () => this.goHome(),
    });
  }

  // ---------- authoring helpers (?debug) ----------
  // ?debug shows hotspot outlines (toggle with "h"), live coordinates,
  // and shift+drag measures a rect and logs `rect: [x, y, w, h]` to the console.
  // ?debug&scene=r1-west jumps straight to a scene with fresh state.
  setupDebug() {
    this.root.classList.add('debug');
    const coords = h('div', { class: 'debug-coords' });
    this.stage.append(coords);
    const pt = e => {
      const r = this.stage.getBoundingClientRect();
      return [Math.round((e.clientX - r.left) / r.width * W), Math.round((e.clientY - r.top) / r.height * H)];
    };
    let start = null;
    this.stage.addEventListener('mousemove', e => {
      const [x, y] = pt(e);
      coords.textContent = `${this.state.scene}  x:${x} y:${y}${start ? `  w:${Math.abs(x - start[0])} h:${Math.abs(y - start[1])}` : ''}  (shift+drag = measure)`;
    });
    this.stage.addEventListener('mousedown', e => { if (e.shiftKey) start = pt(e); });
    addEventListener('mouseup', e => {
      if (!start) return;
      const [x, y] = pt(e);
      const r = [Math.min(start[0], x), Math.min(start[1], y), Math.abs(x - start[0]), Math.abs(y - start[1])];
      start = null;
      console.log(`rect: [${r.join(', ')}]`);
      this.say(`rect: [${r.join(', ')}]  (logged to console)`);
    });
  }
}

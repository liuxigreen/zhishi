/** main.js — own-murphy-panel demo 「生日悖论」 (birthday paradox). 24 s, 1920×1080 (16:9 like 4630), 4 worlds, own content.
 * W1 a party diorama fills with 23 guests → W2 glowing blocks 直觉: "23÷365 ≈ 6%" ✗ → W3 gold pair lines: 23×22÷2 = 253 pairs
 * → W4 a 365-day board fills, two birthdays collide, the gauge rises to 50.7%.
 * Improvement over the source: one number drives HUD + counter + lines + gauge together, and focus racks between layers
 * (the source's depth of field is fixed per shot); worlds change by a lights-dip, not a hard cut. */
import { P, W, H, setCam, pr, room, pool, vignette, dof, checklist, caption, formula, ringGauge, text, measure, topLine, bigTitle, leader, measureBar, Scene, depth, rgba, clamp, lerp, SERIF, ITAL } from './look.js';
import { peg, PALETTE, HATS } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 24;
let TX = [];
const S = M.seg01, E = M.ease;
const push = (id, text, b) => { if (b) TX.push({ id, text, x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 }); };
function cap(t, a, b, lines, id) { if (t < a || t >= b) return; const c = M.captionIn(t, a); const out = 1 - S(t, b - 0.25, b); const r = caption(ctx, lines, { a: c.a * out, dy: c.dy, under: S(t, a + 0.3, a + 0.7) }); if (c.a * out > 0.9) r.forEach((q, i) => TX.push({ ...q, id: id + i })); }
function hud(t) {
  const st = [M.checkTick(t, 1.0, 10.4), M.checkTick(t, 13.0, 16.9), M.checkTick(t, 18.0, 20.4), M.checkTick(t, 20.4, 22.6)];
  const items = ['直觉', '配对', '计算', '答案'].map((s, i) => ({ t: s, state: st[i].state }));
  const r = checklist(ctx, '生日悖论 · 检查单', items, { pop: st.map(s => s.k) }); TX.push(...r);
}
/* the party: 23 guests round a table on a tiled hex platform */
const GUESTS = Array.from({ length: 23 }, (_, i) => { const row = i < 13 ? 0 : 1; const n = row ? 10 : 13; const j = row ? i - 13 : i;
  const a = (Math.PI * 1.06) + (j + 0.5) / n * Math.PI * 1.88 * (row ? 0.86 : 1) + (row ? 0.13 : 0); const r = row ? 262 : 168;
  return { x: Math.cos(a) * r, z: Math.sin(a) * r * 0.92, a, col: PALETTE[(i * 3 + row) % PALETTE.length], hat: ['none', 'beanie', 'party', 'none', 'bun', 'fedora', 'party', 'none', 'beanie'][i % 9],
    hatCol: [P.rose, P.sage, P.mustard, P.coral, P.slate][i % 5], scarf: i % 7 === 3 ? P.mustard : null, h: 80 + ((i * 7) % 5) * 3, t0: 0.35 + i * 0.165 }; });
const PY = 40; // platform top
function party(c, t, { arrive = true, lines = null, faces = 0 } = {}) {
  Pr.hexPlatform(c, 0, 0, 360, PY, { cell: 36 });
  pool(c, 0, PY, 0, 300, 0.22);
  const sc = new Scene();
  sc.at(0, PY, 0, () => { Pr.roundTable(c, 0, 0, 82, 46, { y: PY }); Pr.cake(c, 0, PY + 46, 0, 1.15, { candles: 6, lit: 1, t }); Pr.gift(c, 48, PY + 46, 22, 0.7, P.sage); Pr.gift(c, -50, PY + 46, -14, 0.6, P.rose, { ry: 0.9 }); });
  for (const [bx, bz, col] of [[-300, -60, P.coral], [290, -90, P.mustard], [250, 160, P.sage]]) sc.at(bx, PY, bz, () => Pr.balloon(c, bx, PY, bz, 1.4, col, t));
  sc.at(-240, PY, -190, () => Pr.chair(c, -240, -190, 1.6, { ry: 0.6 }));
  const heads = [];
  GUESTS.forEach((g, i) => { const d = arrive ? M.dropIn(t, g.t0, { h: 160 }) : { dy: 0, squash: 0, a: 1 }; if (d.a <= 0) return; const fx = -Math.cos(g.a), fz = -Math.sin(g.a);
    let yaw = Math.atan2(fx, fz); if (faces) yaw = lerp(yaw, 0, faces * (Math.abs(yaw) > 2.2 ? 0 : 1));
    const hp = M.hop(t, g.hop ?? 99);
    sc.at(g.x, PY, g.z, () => { const r = peg(c, { ...g, y: PY + d.dy, pose: { squash: d.squash, yaw, hop: hp, armR: i % 6 === 2 ? 2.3 : null, armWave: i % 6 === 2 ? 1 : 0 }, a: d.a, t }); heads[i] = r.head; }); });
  sc.flush();
  return heads;
}
function headsOnly() { return GUESTS.map(g => pr(g.x, PY + g.h * 0.86, g.z)); }
function bigCounter(t, n, unit, label, id, { pop = 1, col = P.gold, x = 1680, y = 170, final = n } = {}) {
  text(ctx, label, x, y - 62, { size: 24, w: 600, col: P.hud, align: 'center', ls: 3 });
  ctx.save(); ctx.translate(x, y); ctx.scale(pop, pop); const w1 = measure(ctx, String(n), 96, 500, ITAL, 0); const w2 = measure(ctx, unit, 40, 900, SERIF, 2);
  text(ctx, String(n), -(w1 + w2 + 10) / 2, 0, { size: 96, w: 500, font: ITAL, col, ls: 0 }); text(ctx, unit, -(w1 + w2 + 10) / 2 + w1 + 10, 14, { size: 40, w: 900, col: P.capWhite, ls: 2 }); ctx.restore();
  TX.push({ id: id + 'l', text: label, x0: x - 90, x1: x + 90, y0: y - 76, y1: y - 48 });
  if (n === final) TX.push({ id, text: n + unit, x0: x - (w1 + w2) / 2, x1: x + (w1 + w2) / 2, y0: y - 48, y1: y + 48 });
}
const WALL = { wallZ: -760, sconces: [[-620, 250], [0, 280], [620, 250]] };

/* ── W1 0–6 · the party fills: 23 guests ── */
function w1(t) {
  setCam([0, 520, 760], [0, 20, -10], 1500, W / 2, H / 2 + 40);
  dof(ctx, 3.2, c => room(c, { ...WALL, t }), 'bg');
  dof(ctx, 3.0, c => { Pr.bookshelf(c, -700, -560, 260, 170, 34, { seed: 4 }); Pr.bookshelf(c, 640, -560, 260, 170, 34, { seed: 7 }); }, 'bg2');
  party(ctx, t);
  const c = M.countUp(t, 0.35, 0.35 + 22 * 0.165 - 0.05, 0, 23, k => k);
  if (t > 0.4) bigCounter(t, Math.max(1, c.n), '人', '到场', 'n', { final: 23, pop: c.n >= 23 ? 1 + 0.1 * M.hop(t, 4.2, 0.3) : c.pop });
  if (t > 0.2 && t < 5.9) { const a = S(t, 0.2, 0.6) * (1 - S(t, 5.6, 5.9)); TX.push(topLine(ctx, '同一间屋子 · 同一张桌子', { a })); }
  cap(t, 0.9, 5.85, [[{ t: '一屋子' }, { t: '23', k: 'gold' }, { t: '个人，' }], [{ t: '有两人同一天生日，几率多大？' }]], 'c1');
}
/* ── W2 6–12 · intuition: 23 ÷ 365 ≈ 6% → ✗ ── */
function w2(t) {
  setCam([60, 300, 760], [60, 90, 0], 1450, W / 2, H / 2 + 40);
  dof(ctx, 3.5, c => room(c, { ...WALL, t }), 'bg');
  dof(ctx, 2.6, c => { Pr.counter(c, 600, -420, 300, 1.6); Pr.table(c, -620, -380, 160, 90, 80); }, 'bg2');
  Pr.hexPlatform(ctx, 0, 0, 380, 46, { top: 'wood' });
  const sc = new Scene();
  const blocks = [['直', -150, 6.4], ['觉', 40, 6.75]];
  blocks.forEach(([ch, x, t0]) => { const d = M.dropIn(t, t0, { h: 260, dur: 0.5 }); if (d.a <= 0) return; sc.at(x, 46, 0, () => Pr.letterBlock(ctx, x, 46 + d.dy, 0, 150, ch, { glow: M.blockLight(t, t0 + 0.5, 0.6), ry: x < 0 ? 0.12 : -0.08, t })); });
  sc.at(250, 46, 90, () => Pr.deskCalendar(ctx, 250, 46, 90, 1.6, '生日', '?'));
  sc.at(270, 46, 190, () => peg(ctx, { x: 280, y: 46, z: 200, h: 120, col: P.terra, hat: 'beanie', hatCol: P.sage, pose: t > 8.2 ? 'think' : 'stand', t }));
  sc.at(-290, 46, 170, () => peg(ctx, { x: -250, y: 46, z: 200, h: 112, col: P.sage, hat: 'bun', pose: t > 10.2 ? 'surprised' : 'side', yaw: 0.6, t }));
  sc.flush();
  const fa = S(t, 8.0, 8.4); if (fa > 0) { text(ctx, '多数人的算法', W / 2, 108, { size: 24, w: 600, col: rgba(P.hud, 0.85), a: fa, align: 'center', ls: 3 }); TX.push({ id: 'f2h', text: '多数人的算法', x0: W / 2 - 80, x1: W / 2 + 80, y0: 94, y1: 122 });
    const b = formula(ctx, [{ t: '23人' }, { t: '÷365', k: 'red' }, { t: '≈' }, { t: '6%', k: 'gold' }], W / 2, 170, { size: 46, a: fa }); if (fa > 0.9) push('f2', '23人÷365≈6%', b);
    ctx.save(); ctx.globalAlpha = fa * 0.6; ctx.fillStyle = P.gold; ctx.fillRect(W / 2 - 250, 214, 500, 1.4); ctx.restore(); }
  const k6 = 0.063 * E.io(S(t, 8.4, 9.4)); if (t > 8.2) ringGauge(ctx, 1700, 200, 66, k6, '直觉给的', { a: S(t, 8.2, 8.5), inner: (x, y) => { text(ctx, `${(k6 * 100).toFixed(0)}%`, x, y + 4, { size: 40, w: 500, font: ITAL, col: P.gold, align: 'center', ls: 0 }); } });
  if (t > 8.2) TX.push({ id: 'rg', text: '直觉给的', x0: 1640, x1: 1760, y0: 90, y1: 118 });
  const st = M.stampIn(t, 9.9); if (st.a > 0) { ctx.save(); ctx.translate(W / 2 + 150, 168); ctx.rotate(st.r); ctx.scale(st.s, st.s); ctx.globalAlpha = st.a; ctx.strokeStyle = P.red; ctx.lineWidth = 9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-38, -38); ctx.lineTo(38, 38); ctx.moveTo(38, -38); ctx.lineTo(-38, 38); ctx.stroke(); ctx.restore(); }
  cap(t, 6.5, 9.95, [[{ t: '直觉会这么算：' }], [{ t: '23天÷365天，大约' }, { t: '6%', k: 'gold' }, { t: '。' }]], 'c2');
  cap(t, 9.95, 12.8, [[{ t: '错得' }, { t: '离谱', k: 'red' }, { t: '。' }]], 'c2b');
}
/* ── W3 12–18 · pairs: 23×22÷2 = 253 gold lines ── */
function w3(t) {
  const k = E.io(S(t, 13.0, 17.8)); setCam([lerp(-40, 40, k), 720, 560], [0, 40, -40], 1450, W / 2, H / 2 + 10);
  const blur = M.rackFocus(t, 13.0, 13.5, 7, 0);
  dof(ctx, 3.5, c => room(c, { ...WALL, t }), 'bg');
  dof(ctx, blur, c => { party(c, t, { arrive: false }); }, 'fg');
  const hs = headsOnly(); const N = 253; let n = 0; const order = [];
  for (let i = 0; i < 23; i++) for (let j = i + 1; j < 23; j++) order.push([i, j]);
  order.forEach(([i, j], q) => { const kk = M.lineDraw(t, 13.3, 15.8, N, q, 0.35); if (kk > 0) { Pr.pairLine(ctx, hs[i], hs[j], kk, { alpha: 0.42, lw: 1.5 }); if (kk >= 1) n++; } });
  // highlight the newest few lines bright
  const fa = S(t, 13.1, 13.5);
  if (fa > 0) { text(ctx, '两两配对', W / 2, 108, { size: 24, w: 600, col: rgba(P.hud, 0.85), a: fa, align: 'center', ls: 3 }); TX.push({ id: 'f3h', text: '两两配对', x0: W / 2 - 60, x1: W / 2 + 60, y0: 94, y1: 122 });
    const b = formula(ctx, [{ t: '23' }, { t: '×22', k: 'red' }, { t: '÷2' }, { t: '=' }, { t: '253对', k: 'gold' }], W / 2, 170, { size: 46, a: fa }); if (fa > 0.9) push('f3', '23×22÷2=253对', b); }
  const c = M.countUp(t, 13.3, 15.8, 0, 253, k => k); if (t > 13.2) bigCounter(t, c.n, '对', '已连线', 'p', { pop: 1, final: 253 });
  cap(t, 13.15, 17.85, [[{ t: '但生日是' }, { t: '两两', k: 'gold' }, { t: '比的：' }], [{ t: '23个人，能凑出253对。' }]], 'c3');
}
/* ── W4 18–24 · the 365-day board fills; two collide; gauge to 50.7% ── */
const BDAYS = (() => { const out = []; let s = 17; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; while (out.length < 22) { const d = Math.floor(r() * 365); if (!out.includes(d)) out.push(d); } out.push(out[9]); return out; })();
function w4(t) {
  setCam([60, 320, 1000], [60, 190, 0], 1500, W / 2, H / 2 + 40);
  dof(ctx, 3.5, c => room(c, { ...WALL, t }), 'bg');
  const focus = M.rackFocus(t, 20.3, 20.9, 0, 1);
  dof(ctx, 2.8, c => { Pr.hexPlatform(c, 820, -640, 300, 34, { cell: 34 }); Pr.roundTable(c, 820, -640, 70, 40, { y: 34 }); [0, 1, 2, 3, 4].forEach(i => peg(c, { x: 700 + i * 55, y: 34, z: -540 + (i % 2) * 30, h: 72, col: PALETTE[i], hat: HATS[i], t })); }, 'bg2');
  const nIn = Math.floor(M.countUp(t, 18.3, 20.0, 0, 23, k => k).v);
  const flash = t > 20.0 ? (0.5 + 0.5 * Math.sin((t - 20.0) * 16)) * Math.exp(-(t - 20.0) * 0.8) : 0;
  let cells = [];
  dof(ctx, focus * 3.2, c => { cells = Pr.gridBoard(c, -170, 40, 0, 640, 330, 25, 15, i => { const q = BDAYS.indexOf(i); if (q < 0 || q >= nIn) return null;
    if (i === BDAYS[9] && nIn >= 23) return t > 20.0 ? (flash > 0.5 ? '#FF7A5C' : P.red) : P.gold; return P.gold; }, { title: '一年 365 天', n: 365 }); }, 'board');
  if (t > 20.1) { const p = cells[BDAYS[9]]; const ty = pr(-170, 386, 0)[1] - 34, la = S(t, 20.1, 20.4); ctx.save(); ctx.globalAlpha = la; ctx.fillStyle = 'rgba(20,12,8,0.82)'; ctx.beginPath(); ctx.roundRect(p[0] + 100, ty - 26, 150, 52, 8); ctx.fill(); ctx.restore(); const b = leader(ctx, p[0], p[1], p[0] + 110, ty, '撞上了！', { a: la, size: 32, col: P.coral }); if (t > 20.4) push('hit', '撞上了！', b); }
  const g = M.gaugeRise(t, 18.6, 20.8, 0.507);
  dof(ctx, (1 - focus) * 2.6, c => Pr.gaugeBar(c, 330, 0, 0, 40, 380, g, { mark: 0.5 }), 'gauge');
  const top = pr(330, 380 * g + 4, 0), bot = pr(330, 4, 0);
  measureBar(ctx, top[0] + 70, top[1], bot[1], '几率', `${(50.7 * E.io(S(t, 18.6, 20.8))).toFixed(1)}%`, { a: S(t, 18.6, 19.0) });
  if (t > 18.6) TX.push({ id: 'gl', text: '几率', x0: top[0] + 92, x1: top[0] + 140, y0: (top[1] + bot[1]) / 2 - 40, y1: (top[1] + bot[1]) / 2 - 12 });
  if (t > 20.85) TX.push({ id: 'gv', text: '50.7%', x0: top[0] + 92, x1: top[0] + 230, y0: (top[1] + bot[1]) / 2 - 8, y1: (top[1] + bot[1]) / 2 + 36 });
  const c = M.countUp(t, 18.3, 20.0, 0, 23, k => k); if (t > 18.25) bigCounter(t, c.n, '人', '已登记生日', 'b', { pop: c.pop, final: 23 });
  const ta = S(t, 20.55, 20.9); if (ta > 0) { const b = bigTitle(ctx, '生日悖论', '直觉 6% · 真相 50.7%', W / 2, 140, { a: ta, size: 84 }); if (ta > 0.9) push('title', '生日悖论', b); if (ta > 0.9) TX.push({ id: 'tsub', text: '直觉 6% · 真相 50.7%', x0: W / 2 - 150, x1: W / 2 + 150, y0: 192, y1: 220 }); }
  cap(t, 18.35, 23.9, [[{ t: '253对里，只要撞上' }, { t: '一对', k: 'gold' }, { t: '，' }], [{ t: '几率就过了一半：' }, { t: '50.7%', k: 'gold' }, { t: '。' }]], 'c4');
}
window.render = (t) => {
  TX = []; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  if (t < 6) w1(t); else if (t < 13) w2(t); else if (t < 18) w3(t); else w4(t);
  vignette(ctx, 0.55);
  let dim = 1; for (const tc of [6, 13, 18]) dim = Math.min(dim, M.lightsDip(t, tc));
  if (dim < 1) { ctx.fillStyle = `rgba(6,4,3,${1 - dim})`; ctx.fillRect(0, 0, W, H); TX = TX.filter(q => !/^c\d/.test(q.id)); }
  hud(t);
  if (t > 23.6) { ctx.fillStyle = `rgba(6,4,3,${S(t, 23.6, 24) * 0.9})`; ctx.fillRect(0, 0, W, H); }
};
window.TEXTS = () => TX;
document.fonts.load(`900 40px 'Noto Serif SC'`).then(() => document.fonts.load(`500 40px 'Noto Serif It'`)).then(() => document.fonts.ready).then(() => { window.READY = true; });

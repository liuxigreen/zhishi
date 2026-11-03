/** main.js — own-tao-ink demo 「庖丁解牛 · 顺着缝走」(《庄子·养生主》). 24 s, 1080×1920, 4 worlds.
 * W1 night: 族庖 hacks, sparks, knife counter → W2 paper: brush 庖丁 + 庄 seal → W3 壹 依乎天理: ink ox, red joint gaps, knife follows
 * → W4 贰 因其固然: 庖丁 raises a 19-year blade that still gleams, brush 顺势. Ink-bloom transitions + brush write-on = our improvement. */
import { P, W, H, SERIF, BRUSH, paper, header, chapter, caption, cite, clamp, lerp, rgba, vignette, splatter } from './look.js';
import { stick, ox, sage } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 24;
let TX = [];
const box = (id, text, cx, cy, size, weight = 800, font = SERIF) => { ctx.save(); ctx.font = `${weight} ${size}px ${font}`; ctx.letterSpacing = '2px'; const w = ctx.measureText(text).width; ctx.restore(); TX.push({ id, text, x0: cx - w / 2, y0: cy - size * 0.6, x1: cx + w / 2, y1: cy + size * 0.6 }); };
function cap(t, a, b, segs, id, opt = {}) { if (t < a || t > b) return; M.captionIn(ctx, segs, t, a, b, { y: 1380, ...opt }); const lines = Array.isArray(segs[0]) ? segs : [segs]; lines.forEach((l, i) => box(id + i, l.map(g => g.t).join(''), W / 2, 1380 + i * 62 * 1.45, 62)); }
function cit(t, a, b, s, y, id, night = false) { if (t < a || t > b) return; const k = M.ease.out(M.seg(t, a, a + 0.5)) * (1 - M.seg(t, b - 0.3, b)); cite(ctx, s, y, { a: k, night }); box(id, s, W / 2, y - 10, 30, 400); }
function hdr(t, night) { const a = M.ease.out(M.seg(t, 0.2, 0.8)); header(ctx, { a, night }); if (a > 0.5) TX.push({ id: 'hdr', text: '一分钟 · 读懂庄子', x0: 386, y0: 175, x1: 700, y1: 218 }); }
function hand(J, i = 0) { const a = J.fa[i] * Math.PI / 180, f = J.facing || 1; return { x: J.hands[i][0], y: J.hands[i][1], ang: Math.atan2(Math.cos(a), Math.sin(a) * f) }; }

/* ── W1 0–6 night: 族庖月更刀 ── */
function w1(t, c = ctx) {
  paper(c, { night: true });
  c.save(); c.strokeStyle = rgba(P.cream, 0.5); c.lineWidth = 3; c.beginPath(); c.moveTo(120, 1160); c.lineTo(960, 1160); c.stroke(); c.restore();
  Pr.inkMountains(c, 0, W, 1160, 160, { seed: 9, layers: 2, color: '#5A5547', night: true, a: 0.7 });
  const T0 = 0.5, per = 1.05, u = Math.max(0, t - T0), cyc = Math.floor(u / per), p = (u % per) / per;
  const hits = t < T0 + 0.75 * per ? 0 : Math.floor((t - T0 - 0.75 * per) / per) + 1;
  const pose = p < 0.5 ? M.poseAt([[0, 'chopDown'], [0.5, 'chopUp']], p) : M.poseAt([[0.5, 'chopUp'], [0.68, 'chopDown'], [1, 'chopDown']], p);
  const blockX = 650; Pr.block(c, blockX, 1160, 230, { night: true, tall: 0.8, marks: Math.min(6, hits * 2) });
  const J = stick(c, { x: 360, y: 1160, H: 480, pose: t < T0 ? 'stand' : pose, color: P.cream });
  J.facing = 1; const h = hand(J, 0);
  const knife = Math.min(3, 1 + Math.floor(hits / 2));
  Pr.cleaver(c, h.x, h.y, 190, h.ang, { night: true, blade: '#BDB6A6', edge: '#E9E3D3', nick: Math.min(5, (hits % 2) * 3 + 1) });
  if (hits > 0) { const age = (u - (hits - 1) * per - 0.68 * per) / 0.55; Pr.chips(c, blockX - 30, 978, age, { seed: hits * 3 }); if (age < 0.25 && age >= 0) { c.save(); c.globalAlpha = 1 - age * 4; c.fillStyle = '#E0413F'; c.beginPath(); c.arc(blockX - 30, 976, 26 * (1 + age * 3), 0, 7); c.fill(); c.restore(); } }
  // knife counter: 「族庖 · 本月第」 + red 7-seg + 「把」
  const ka = M.ease.out(M.seg(t, 0.9, 1.4)) * (1 - M.seg(t, 5.6, 5.9));
  c.save(); c.globalAlpha = ka; c.font = `500 44px ${SERIF}`; c.fillStyle = P.cream; c.textAlign = 'center'; c.letterSpacing = '6px'; c.fillText('这个月 · 第', W / 2, 330);
  const drop = hits > 0 && hits % 2 === 0 ? 1 - M.ease.back(M.seg(u, (hits - 1) * per + 0.68 * per, (hits - 1) * per + 0.68 * per + 0.3)) : 0;
  c.save(); c.translate(0, -drop * 40); c.globalAlpha = ka * (1 - drop); Pr.redDigits(c, '0' + knife, W / 2 - 40, 455, 160); c.restore();
  c.font = `700 80px ${SERIF}`; c.fillStyle = P.cream; c.fillText('把刀', W / 2 + 140, 480); c.restore();
  if (ka > 0.5 && c === ctx) { box('cnt', '这个月 · 第', W / 2, 315, 44, 500); box('ba', '把刀', W / 2 + 140, 457, 80, 700); }
  if (c === ctx) { cap(t, 0.7, 5.7, [{ t: '砍得越狠，刀换得' }, { t: '越快', red: true }, { t: '。' }], 'c1', { night: true }); cit(t, 1.4, 5.7, '—— 族庖月更刀，折也', 1490, 'q1', true); }
  if (c === ctx) vignette(c, 0.4);
}
/* ── W2 6–12 paper: 庖丁 brush + 庄 seal ── */
function w2(t, c = ctx) {
  paper(c);
  Pr.brushChar(c, '庖丁', W / 2 + 10, 790, 450, { k: M.ease.io(M.seg(t, 5.6, 7.2)), seed: 21, splat: 1.2 });
  const sk = M.seg(t, 8.2, 8.9); if (sk > 0) M.sealStamp(c, 930, 1050, 96, '庄', sk, { seed: 33, font: BRUSH, weight: 400 });
  const ta = M.ease.out(M.seg(t, 7.6, 8.2)); c.save(); c.globalAlpha = ta; c.font = `500 40px ${SERIF}`; c.fillStyle = P.inkSoft; c.textAlign = 'center'; c.letterSpacing = '8px'; c.fillText('《庄子 · 养生主》', W / 2, 1130); c.restore();
  // a small ink 庖丁 bows at the foot of his own name (the person is the story)
  if (c === ctx) { if (t > 6.3) box('pd', '庖丁', W / 2, 790, 450, 400, BRUSH); if (ta > 0.5) box('zz', '《庄子 · 养生主》', W / 2, 1116, 40, 500); cap(t, 8.0, 11.8, [{ t: '庄子讲过一个' }, { t: '厨子', red: true }, { t: '。' }], 'c2'); }
}
/* ── W3 12–18: 壹 依乎天理 — ox + gaps ── */
function w3(t, c = ctx) {
  paper(c);
  const ok = M.ease.out(M.seg(t, 11.4, 12.0)); const split = M.ease.io(M.seg(t, 16.3, 17.2));
  c.save(); c.globalAlpha = 0.25 * ok; c.fillStyle = P.ink; c.beginPath(); c.ellipse(610, 1180, 360, 22, 0, 0, 7); c.fill(); c.restore();
  const O = ox(c, 620, 1175, 660, { color: P.ink, k: ok, split });
  if (O && split < 1) { for (let g = 0; g < 3; g++) { const k = M.follow(t, 13.0 + g * 1.0, 13.9 + g * 1.0); if (k <= 0) continue; const pts = O.gaps[2 - g]; const hd = Pr.dashedPath(c, pts, k, { a: 1 - split, w: 7 });
      if (k < 1 || (g === 2 && t < 16.3)) Pr.cleaver(c, hd.pt[0] + 10, hd.pt[1], 150, hd.ang - Math.PI / 2 + 0.2, { gleam: M.gleam(t, 13.0 + g * 1.0, 0.9) }); } }
  if (split > 0) { splatter(c, 600, 1000, 340, { seed: 41, n: 22, k: M.ease.out(M.seg(t, 16.3, 16.8)), color: rgba(P.ink, 0.6) }); }
  stick(c, { x: 150, y: 1180, H: 380, pose: M.poseAt([[12.3, 'stand'], [13.0, 'hip'], [16.6, 'hip'], [17.2, 'akimbo']], t), color: P.ink, k: ok });
  if (c === ctx) { const ca = M.ease.out(M.seg(t, 12.0, 12.4)); M.sealStamp(c, 120, 300, 76, '壹', M.seg(t, 12.0, 12.6), { seed: 20, font: BRUSH, weight: 400 }); chapter(c, '', '依乎天理', 0, { a: ca, noSeal: true }); box('ch1', '依乎天理', 260, 296, 42, 500);
    cap(t, 12.6, 17.8, [{ t: '他不砍骨头，只顺着' }, { t: '缝隙', red: true }, { t: '走刀。' }], 'c3'); cit(t, 13.3, 17.8, '—— 批大郤，导大窾，因其固然', 1490, 'q3'); }
}
/* ── W4 18–24: 贰 因其固然 — the 19-year blade ── */
function w4(t, c = ctx) {
  paper(c);
  Pr.inkMountains(c, 0, W, 1190, 260, { seed: 14, layers: 3 });
  Pr.pine(c, 985, 1200, 420, { seed: 5, sway: M.sway(t) }); Pr.pine(c, 905, 1200, 300, { seed: 8, sway: M.sway(t, 1) });
  c.save(); c.strokeStyle = rgba(P.ink, 0.7); c.lineWidth = 3; c.beginPath(); c.moveTo(80, 1200); c.lineTo(1000, 1200); c.stroke(); c.restore();
  const pose = M.poseAt([[18.2, 'stand'], [18.9, 'hip'], [19.4, 'hip'], [20.1, 'holdUp'], [24, 'holdUp']], t);
  const J = stick(c, { x: 300, y: 1200, H: 520, pose, color: P.ink }); J.facing = 1; const h = hand(J, 0);
  const g = Math.max(M.gleam(t, 20.3, 0.7), M.gleam(t, 22.9, 0.7));
  Pr.cleaver(c, h.x, h.y, 220, h.ang, { gleam: g, blade: '#D9D4C6', edge: '#FBF8EF' });
  if (g >= 0) { const gl = 1 - Math.abs(g - 0.5) * 2; c.save(); c.globalAlpha = gl; c.strokeStyle = '#FFFFFF'; c.lineWidth = 4; c.lineCap = 'round'; const sx = h.x + 120, sy = h.y - 60; for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; c.beginPath(); c.moveTo(sx + Math.cos(a) * 12, sy + Math.sin(a) * 12); c.lineTo(sx + Math.cos(a) * 40 * gl, sy + Math.sin(a) * 40 * gl); c.stroke(); } c.restore(); }
  Pr.vertColumn(c, ['一年', '十年', '十九年'], 985, 590, 46, { k: M.ease.out(M.seg(t, 18.6, 19.8)) });
  Pr.brushChar(c, '顺势', 680, 470, 230, { k: M.ease.io(M.seg(t, 21.3, 22.5)), seed: 52, splat: 0.7, dry: 0.8 });
  if (c === ctx) { const ca = M.ease.out(M.seg(t, 18.0, 18.4)); M.sealStamp(c, 120, 300, 76, '贰', M.seg(t, 18.0, 18.6), { seed: 21, font: BRUSH, weight: 400 }); chapter(c, '', '因其固然', 1, { a: ca, noSeal: true }); box('ch2', '因其固然', 260, 296, 42, 500);
    if (t > 18.9) TX.push({ id: 'col', text: '一年 十年 十九年', x0: 985 - 75, y0: 560, x1: 985 + 75, y1: 735 }); if (t > 21.3) box('ss', '顺势', 680, 470, 230, 400, BRUSH);
    cap(t, 18.5, 23.9, [{ t: '' }, { t: '十九年', red: true }, { t: '，刀还像新磨的。' }], 'c4'); cit(t, 19.4, 23.9, '—— 刀刃若新发于硎', 1490, 'q4'); }
}
const WORLDS = [[0, 6, w1], [6, 12, w2], [12, 18, w3], [18, 24, w4]];
window.render = (t) => {
  TX = []; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const i = Math.min(3, Math.floor(t / 6)); const [a, b, fn] = WORLDS[i]; fn(t);
  // ink-bloom into the next world (M1): last 0.55 s of W1→W2 (paper blot), W2→W3 and W3→W4 (ink rim)
  const tr = [[5.3, 6.0, w2, 540, 800, '#0A0908'], [11.3, 12.0, w3, 620, 1000, P.ink], [17.3, 18.0, w4, 360, 900, P.ink]];
  for (const [s, e, nx, x, y, col] of tr) if (t >= s && t < e) { const k = M.seg(t, s, e); const save = TX; M.bloomWipe(ctx, k, x, y, (cc) => { const keep = TX; nx(t, cc || ctx); TX = keep; }, { color: col, seed: 7 }); TX = save; }
  hdr(t, t < 5.8);
};
window.TEXTS = () => TX.slice();

Promise.all([document.fonts.load(`400 80px ${BRUSH}`), document.fonts.load(`800 60px ${SERIF}`), document.fonts.load(`400 30px ${SERIF}`)]).then(() => document.fonts.ready).then(() => { window.render(0); window.READY = true; });

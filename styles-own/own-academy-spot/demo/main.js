/** main.js — own-academy-spot demo 「问对一层 · 表面之外」(24 s, 1920×1080).
 * W1 0–6  暗室：小蓝围着发条狗转，六个表面问题在轨道上
 * W2 6–12 顶光：小金只问「为什么能自己走」→ 狗变蓝图，露出发条与齿轮（招牌：blueprintMorph）
 * W3 12–18 天平：八个浅问题 vs 一个发光「为什么」——质量压过数量
 * W4 18–24 同心环：表面→用法→原理；小金走上螺旋阶，小蓝停在外圈转轮
 * Improvement over source: solid→blueprint morph is continuous (draw-on + glow migrate), not a hard cut. */
import { P, W, H, SERIF, SANS, paintDarkroom, spotCone, pendant, caption, cite, chip, vignette, glowPool, clamp, lerp, rgba } from './look.js';
import { peg, duo } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';

const ctx = document.getElementById('c').getContext('2d');
window.DUR = 24;
let TX = [];
const box = (id, text, cx, cy, size, weight = 700) => {
  ctx.save(); ctx.font = `${weight} ${size}px ${SERIF}`; const w = ctx.measureText(text).width; ctx.restore();
  TX.push({ id, text, x0: cx - w / 2, y0: cy - size * 0.65, x1: cx + w / 2, y1: cy + size * 0.65 });
};
function cap(t, a, b, segs, id) {
  if (t < a || t > b) return;
  const k = M.captionIn(t, a, b); caption(ctx, segs, { y: 990, size: 40, a: k });
  const lines = Array.isArray(segs[0]) ? segs : [segs];
  lines.forEach((l, i) => box(id + i, l.map(g => g.t).join(''), W / 2, 990 + (i - (lines.length - 1) / 2) * 58, 40));
}
function brand(t) {
  const a = M.ease.out(M.seg(t, 0.15, 0.6));
  ctx.save(); ctx.globalAlpha = a;
  chip(ctx, 40, 42, '知识大赏 · 暗室聚光', { color: P.gold });
  ctx.restore();
}

const Q6 = ['哪个牌子？', '有别的颜色吗？', '贵的更好吗？', '网上那款呢？', '跟那只有啥不同？', '能换个壳吗？'];
const SHALLOW8 = ['多少钱', '哪买的', '什么牌', '什么色', '好评吗', '包邮吗', '有折扣', '同款吗'];

/* ── W1: orbit of shallow questions ── */
function w1(t, c = ctx) {
  paintDarkroom(c, { floorY: 860 });
  pendant(c, 960, 70, { w: 80, on: 0.85 });
  spotCone(c, 960, 90, 860, { wTop: 50, wFloor: 420, color: P.gold, a: 0.28, dust: 22, seed: 5 });
  const walk = M.walkCycle(t, 2.4); const key = M.keyWind(t, 1.8);
  Pr.books(c, 520, 820, { k: M.popIn(t, 0.3), n: 4 });
  Pr.windupDog(c, 960, 830, 160, { k: M.popIn(t, 0.2), walk, keyRot: key });
  const breath = M.breathe(t);
  const B = peg(c, { x: 720, y: 860, H: 280, cast: 'novice', glow: 0.55 + breath * 8, lean: Math.sin(t * 1.2) * 0.04, facing: 1 });
  // orbit questions
  const rot = M.orbitSpin(t, 0.35);
  Pr.questionOrbit(c, 960, 620, 280, Q6, { k: M.ease.out(M.seg(t, 0.8, 1.6)), rot, color: P.blue });
  // big count
  const ca = M.ease.out(M.seg(t, 1.2, 1.8));
  c.save(); c.globalAlpha = ca; c.font = `700 110px ${SERIF}`; c.fillStyle = P.white; c.textAlign = 'right';
  c.fillText('6', 1780, 200); c.font = `500 28px ${SERIF}`; c.fillStyle = P.blueHot; c.fillText('个问题 · 全在外面', 1780, 250); c.restore();
  if (c === ctx) {
    if (ca > 0.5) { box('n6', '6', 1720, 160, 110); box('n6b', '个问题 · 全在外面', 1680, 240, 28, 500); }
    cap(t, 0.6, 5.7, [[{ t: '围着转一圈，问的全是' }, { t: '外表', blue: true }, { t: '。' }]], 'c1');
    brand(t); vignette(c, 0.4);
  }
}

/* ── W2: one deep why → blueprint morph ── */
function w2(t, c = ctx) {
  paintDarkroom(c, { floorY: 860 });
  pendant(c, 1180, 60, { w: 70, on: 1 });
  spotCone(c, 1180, 80, 860, { wTop: 45, wFloor: 320, color: P.gold, a: 0.4, dust: 20, seed: 8 });
  glowPool(c, 780, 700, 220, P.gold, 0.18);
  const morph = M.blueprintMorph(t, 7.6, 1.4);
  // solid dog fades
  if (morph.solid > 0.05) Pr.windupDog(c, 780, 820, 170, { k: morph.solid, walk: 0, keyRot: 0.4, alpha: morph.solid });
  // blueprint appears
  if (morph.blueprint > 0.05) {
    Pr.blueprintDog(c, 780, 780, 200, { k: morph.blueprint });
    Pr.spring(c, 700, 700, 55, { k: morph.glow, color: P.goldHot, turns: 3.2 });
    Pr.windupKey(c, 820, 640, 48, { rot: 0.2, glow: morph.glow, color: P.goldHot });
    Pr.labelTag(c, 700, 700, 520, 640, '发条 · 存着劲', { color: P.gold, k: morph.glow });
  }
  const G = peg(c, { x: 1280, y: 860, H: 300, cast: 'expert', glow: 0.9 + M.breathe(t) * 10, facing: -1 });
  Pr.speechBubble(c, 1280, 520, '它为什么能自己走？', { color: P.gold, k: M.popIn(t, 6.4, 0.45), tip: [0, 36] });
  // faint background gears
  for (const [gx, gy, gr, rr] of [[480, 400, 40, 0.2], [560, 520, 28, -0.4], [400, 560, 22, 0.6]]) {
    Pr.gear(c, gx, gy, gr, { k: morph.blueprint * 0.5, rot: t * rr, color: rgba(P.gold, 1), teeth: 8 });
  }
  if (c === ctx) {
    cap(t, 6.5, 11.7, [[{ t: '只问一句，问到了' }, { t: '它靠什么动', gold: true }, { t: '。' }]], 'c2');
    brand(t); vignette(c, 0.42);
  }
}

/* ── W3: balance — quality outweighs quantity ── */
function w3(t, c = ctx) {
  paintDarkroom(c, { floorY: 900, grid: true });
  spotCone(c, 960, 40, 900, { wTop: 60, wFloor: 700, color: P.gold, a: 0.22, dust: 16, seed: 2 });
  const tilt = M.scaleTip(t, 13.2, 1.6, 0.28); // right (why) goes down
  const sc = Pr.balanceScale(c, 960, 780, 420, { tilt, k: M.popIn(t, 12.2, 0.5) });
  // left: 8 shallow blocks piled
  const lx = 960 - 176, ly = 780 - 230 + Math.sin(tilt) * (-176) + 90;
  SHALLOW8.forEach((s, i) => {
    const row = Math.floor(i / 4), col = i % 4;
    Pr.shallowBlock(c, lx - 140 + col * 95, ly - 30 - row * 42, s, { k: M.popIn(t, 12.6 + i * 0.08, 0.3), w: 88, h: 34 });
  });
  c.save(); c.globalAlpha = M.ease.out(M.seg(t, 13.0, 13.5)); c.font = `500 22px ${SERIF}`; c.fillStyle = P.blueHot; c.textAlign = 'center';
  c.fillText('8 个浅问题', lx, ly + 70); c.restore();
  // right: one why
  const rx = 960 + 176, ry = 780 - 230 + Math.sin(tilt) * 176 + 90;
  Pr.whyRing(c, rx, ry - 20, '为什么？', { k: M.popIn(t, 13.5, 0.45), s: 78 });
  c.save(); c.globalAlpha = M.ease.out(M.seg(t, 14.2, 14.7)); c.font = `500 22px ${SERIF}`; c.fillStyle = P.goldHot; c.textAlign = 'center';
  c.fillText('1 个深问题', rx, ry + 80); c.restore();
  if (c === ctx) {
    const ha = M.ease.out(M.seg(t, 12.3, 12.8));
    c.save(); c.globalAlpha = ha; c.font = `700 36px ${SERIF}`; c.fillStyle = P.white; c.textAlign = 'left';
    c.fillText('成绩看问题的', 80, 120); c.fillStyle = P.goldHot; c.fillText('质量', 320, 120);
    c.fillStyle = P.white; c.fillText('，不看', 400, 120); c.fillStyle = P.blueHot; c.fillText('数量', 520, 120); c.restore();
    if (ha > 0.5) box('h3', '成绩看问题的质量，不看数量', 360, 105, 36);
    cap(t, 12.8, 17.7, [[{ t: '问得多没用，问到' }, { t: '深处', gold: true }, { t: '才算。' }]], 'c3');
    cite(c, 'idea after Graesser & Person, 1994', { a: 0.55 * M.ease.out(M.seg(t, 14.0, 14.5)) });
    brand(t); vignette(c, 0.4);
  }
}

/* ── W4: rings + spiral climb vs stuck wheel ── */
function w4(t, c = ctx) {
  paintDarkroom(c, { floorY: 880 });
  const rk = M.ringIgnite(t, 18.3, 1.1);
  Pr.concentricRings(c, 700, 520, 210, { k: rk, labels: ['颜色·牌子·价格', '外形·用法', '原理'], highlight: 2 });
  // expert climbing spiral steps
  Pr.spiralSteps(c, 1100, 780, 1450, 280, 7, { k: M.ease.out(M.seg(t, 18.8, 20.5)), color: P.gold });
  peg(c, { x: lerp(1100, 1450, M.ease.io(M.seg(t, 19.0, 22.0))), y: lerp(780, 300, M.ease.io(M.seg(t, 19.0, 22.0))), H: 160, cast: 'expert', glow: 1, facing: 1 });
  // novice stuck in decision wheel
  const rot = M.orbitSpin(t, 0.4);
  Pr.decisionWheel(c, 420, 720, 160, ['哪个牌子?', '多少钱?', '有区别吗?', '别的颜色?'], { k: M.popIn(t, 18.5, 0.5), rot });
  peg(c, { x: 420, y: 820, H: 140, cast: 'novice', glow: 0.45, facing: 1 });
  // closing chip
  const fa = M.ease.out(M.seg(t, 20.9, 21.6));
  c.save(); c.globalAlpha = fa;
  chip(c, W / 2 - 160, 200, '往内问一层', { num: 1, color: P.gold });
  c.restore();
  if (c === ctx) {
    if (fa > 0.5) box('fin', '往内问一层', W / 2, 200, 22, 600);
    cap(t, 18.6, 23.8, [[{ t: '同样在学，差在问到了' }, { t: '哪一层', gold: true }, { t: '。' }]], 'c4');
    brand(t); vignette(c, 0.45);
  }
}

const WORLDS = [[0, 6, w1], [6, 12, w2], [12, 18, w3], [18, 24, w4]];
window.render = (t) => {
  TX = []; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  const i = Math.min(3, Math.floor(t / 6)); const [, , fn] = WORLDS[i]; fn(t);
  // dip-dark transitions
  const dips = [[5.55, 6.15, w2], [11.55, 12.15, w3], [17.55, 18.15, w4]];
  for (const [a, b, nx] of dips) {
    const d = M.dipDark(t, a, b);
    if (d > 0) {
      if (t >= (a + b) / 2) { const save = TX; nx(t); TX = save; }
      ctx.save(); ctx.fillStyle = `rgba(5,4,3,${d})`; ctx.fillRect(0, 0, W, H); ctx.restore();
    }
  }
};
window.TEXTS = () => TX.slice();

Promise.all([
  document.fonts.load(`700 40px ${SERIF}`),
  document.fonts.load(`500 28px ${SERIF}`),
  document.fonts.load(`600 22px ${SANS}`),
]).then(() => document.fonts.ready).then(() => { window.render(0); window.READY = true; });

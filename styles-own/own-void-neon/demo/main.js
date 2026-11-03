/** Demo film 「为什么突然就懂了」 — Void Neon. Original topic; grammar from 5155/0345/3785/9472. */
import { P, paintVoid, caption, titleBlock, stateChip, glowStroke, ease, horizon } from './look.js';
import { peg, pegCrowd, particleSilhouette } from './people.js';
import * as Prop from './props.js';
import { slowPush, textRise, keyIgnite, wireDraw, breathe, orbPulse, insightFlash, labelSnap, pose, dipVoid, bloomWipe, seg } from './motion.js';

const W = 1920, H = 1080;
window.DUR = 24.0;
const TX = [];
function box(id, text, x0, y0, x1, y1) { TX.push({ id, text, x0, y0, x1, y1 }); }
function lines(ctx, rows, base) {
  rows.forEach((r, i) => {
    const tr = textRise(base.t, base.start, i);
    if (tr.a <= 0) return;
    ctx.save(); ctx.globalAlpha = tr.a;
    const y = base.y + i * 44 + tr.dy;
    const col = r.key && base.t > base.keyAt ? P.magenta : P.paper;
    caption(ctx, r.text, { x: base.x, y, size: base.size || 30, color: col, weight: r.key ? 700 : 500 });
    const tw = r.text.length * (base.size || 30) * 0.55;
    box(`c${base.wid}-${i}`, r.text, base.x - tw / 2, y - 20, base.x + tw / 2, y + 20);
    ctx.restore();
  });
}
function chip(ctx, x, y, state, label, id) {
  stateChip(ctx, x, y, state, label);
  box(id, label, x, y, x + label.length * 10 + 28, y + 22);
}

function world1(ctx, t) {
  // neon monitor on horizon — styleframe-ish 5155
  paintVoid(ctx, W, H, { cx: 0.5, cy: 0.40, warm: 0.85, stars: 1.2 });
  slowPush(ctx, t, { fx: 960, fy: 520, rate: 0.01 });
  horizon(ctx, 800, { glow: 1.15 * breathe(t, 0.06) });
  const k = wireDraw(t, 0.3, 1.0);
  Prop.monitor(ctx, {
    x: 960, y: 720, w: 620, h: 360, k,
    cc: true, wave: seg(t, 1.2, 2.5), t,
    screenText: t > 1.8 ? "still can't hear it" : '',
    inner: t > 1.0,
  });
  titleBlock(ctx, [
    { text: '第 90 天', size: 48, color: P.paper },
    { text: 'DAY 90', size: 18, color: P.mute, weight: 500, font: 'Inter Tight' },
  ], { x: 90, y: 70 });
  box('day', '第 90 天', 100, 80, 280, 140);
  if (t > 2.2) chip(ctx, 1280, 760, 'stuck', '卡住', 'chip-stuck');
  lines(ctx, [
    { text: '练了很久，关上提示' },
    { text: '还是听不懂', key: true },
  ], { t, start: 0.6, keyAt: 2.0, x: 960, y: 955, wid: 1, size: 36 });
}

function world2(ctx, t) {
  // number scale + orb — 0345 grammar
  paintVoid(ctx, W, H, { cx: 0.5, cy: 0.45, warm: 0.4, stars: 0.7 });
  slowPush(ctx, t, { fx: 960, fy: 500, rate: 0.008 });
  const k = wireDraw(t, 0.2, 1.0);
  Prop.numberScale(ctx, { y: 580, k, hot: 0.45 + 0.02 * Math.sin(t * 2), ticks: [0, 250, 500, 750, 1000] });
  Prop.orbMark(ctx, { x: 960, y: 420, s: 1, k, pulse: orbPulse(t), glyph: '?' });
  if (t > 2.0) chip(ctx, 1400, 400, 'probe', '试探', 'chip-probe');
  lines(ctx, [
    { text: '你只能问是或否' },
    { text: '最少要问几次？', key: true },
  ], { t, start: 0.4, keyAt: 1.8, x: 960, y: 960, wid: 2, size: 32 });
}

function world3(ctx, t) {
  // circle pyramid + insight flash — 5155 + OUR move
  paintVoid(ctx, W, H, { cx: 0.5, cy: 0.4, warm: 0.5 });
  slowPush(ctx, t, { fx: 960, fy: 480, rate: 0.01 });
  const flash = insightFlash(t, 2.2);
  // before flash: all neon; after: 3 key circles magenta (the ones "moved")
  const lit = flash.k > 0.3 ? [0, 6, 9] : [];
  Prop.circlePyramid(ctx, { x: 960, y: 280, r: 32, gap: 16, k: breathe(t), lit });
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = P.mute;
  ctx.font = '500 16px "Inter Tight", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('INSIGHT PROBLEM · TEMPLATE DEMO', 960, 200);
  ctx.restore();
  box('insight-h', 'INSIGHT PROBLEM', 700, 185, 1220, 215);
  if (flash.flash > 0) {
    const g = ctx.createRadialGradient(960, 420, 0, 960, 420, 500 * flash.flash);
    g.addColorStop(0, `rgba(232,122,176,${0.35 * flash.flash})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  if (t > 2.6) chip(ctx, 1240, 300, 'flash', '顿悟', 'chip-flash');
  lines(ctx, [
    { text: '移动三枚，让三角尖朝下' },
    { text: '灵机一动才解得开', key: true },
  ], { t, start: 0.3, keyAt: 2.4, x: 960, y: 960, wid: 3, size: 30 });
}

function world4(ctx, t) {
  // particle person + link cascade — 9472 + our improvement
  paintVoid(ctx, W, H, { cx: 0.42, cy: 0.4, warm: 0.45 });
  slowPush(ctx, t, { fx: 700, fy: 540, rate: 0.01 });
  const pk = insightFlash(t, 1.0);
  particleSilhouette(ctx, {
    x: 620, y: 860, s: 2.4, hair: 'bun', bio: 'both',
    color: P.cyan, seed: 21,
    pose: pose('curious', 'flash', pk.k),
  });
  const nodes = [
    { x: 1100, y: 320, r: 12, label: '听', hot: false },
    { x: 1280, y: 420, r: 12, label: '问', hot: false },
    { x: 1180, y: 560, r: 14, label: '连上', hot: true },
    { x: 1400, y: 620, r: 12, label: '懂', hot: true },
  ];
  const edges = [[0, 1], [1, 2], [2, 3], [0, 2]];
  Prop.linkCascade(ctx, { nodes, edges, k: pk.k });
  if (t > 2.4) chip(ctx, 1320, 260, 'linked', '连上了', 'chip-link');
  lines(ctx, [
    { text: '顿悟不是更亮的灯' },
    { text: '是线终于接上了', key: true },
  ], { t, start: 0.4, keyAt: 2.0, x: 960, y: 960, wid: 4, size: 32 });
}

window.render = function render(t) {
  TX.length = 0;
  const ctx = document.getElementById('c').getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  // world schedule
  const cuts = [0, 6.0, 12.0, 18.0, 24.0];
  let wi = 0;
  while (wi < cuts.length - 1 && t >= cuts[wi + 1]) wi++;
  const lt = t - cuts[wi];
  ctx.save();
  if (wi === 0) world1(ctx, lt);
  else if (wi === 1) world2(ctx, lt);
  else if (wi === 2) world3(ctx, lt);
  else world4(ctx, lt);
  ctx.restore();
  // transitions
  const dips = [6.0, 12.0, 18.0];
  dips.forEach((at, i) => {
    const a = dipVoid(t, at, 0.32);
    if (a > 0) { ctx.fillStyle = `rgba(3,1,8,${a})`; ctx.fillRect(0, 0, W, H); }
    if (i === 1) bloomWipe(ctx, t, at, { x: 960, y: 420 });
  });
  // brand
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = P.mute; ctx.lineWidth = 1;
  ctx.strokeRect(W - 210, 40, 150, 36);
  ctx.fillStyle = P.mute;
  ctx.font = '500 14px "Inter Tight", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('知 识 大 赏', W - 135, 58);
  ctx.restore();
};
window.TEXTS = () => TX.slice();
window.READY = true;

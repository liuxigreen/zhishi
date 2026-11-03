/** Demo film 「差距锁死」 — Bite Red Queen.
 * Original topic; grammar from bite-xinyu redqueen + 0762 entropy. */
import { P, paintVoid, hero, sourceFooter, brand, chapterTag, statusChip, speedStreaks } from './look.js';
import { stick, stickTiny, stairCrowd, POSES } from './people.js';
import * as Prop from './props.js';
import { slowPush, textRise, stride, gapLockPulse, forkDraw, multClimb, dipBlack, redBloom, seg } from './motion.js';

const W = 1920, H = 1080;
window.DUR = 24.0;
const TX = [];
function box(id, text, x0, y0, x1, y1) { TX.push({ id, text, x0, y0, x1, y1 }); }

function heroLines(ctx, rows, base) {
  rows.forEach((r, i) => {
    const tr = textRise(base.t, base.start, i);
    if (tr.a <= 0) return;
    const mkOn = r.mark && base.t > (base.markAt || 0);
    hero(ctx, [{
      text: r.text, size: base.size || 46, weight: 700, a: tr.a,
      color: P.white,
      mark: mkOn ? r.mark : null,
      keyFrom: r.keyFrom, keyTo: r.keyTo,
    }], { x: base.x, y: base.y + i * 58 + tr.dy });
    const tw = r.text.length * (base.size || 46) * 0.9;
    box(`h${base.wid}-${i}`, r.text, base.x, base.y + i * 58 - 10, base.x + tw, base.y + i * 58 + 50);
  });
}
function chip(ctx, x, y, state, label, id) {
  statusChip(ctx, x, y, state, label);
  box(id, label, x, y, x + label.length * 15 + 30, y + 26);
}

function world1(ctx, t) {
  // Hook: runner on treadmill, displacement 0 — styleframe ≈ redqueen 01-t0004
  paintVoid(ctx, W, H, { cx: 0.55, cy: 0.4, redWash: 0.55, grain: 0.65 });
  slowPush(ctx, t, { fx: 1000, fy: 620, rate: 0.008 });
  Prop.treadmillFloor(ctx, { y: 860, vanishY: 540, k: seg(t, 0.05, 0.7) });
  speedStreaks(ctx, 620, { n: 10, a: 0.3, seed: 4 });
  Prop.zeroMarker(ctx, { x: 1020, y0: 480, y1: 820, k: 1 });
  const pose = stride(t, 170);
  stick(ctx, { x: 1020, y: 780, s: 1.55, facing: 1, color: P.red, pose });
  Prop.hudTelemetry(ctx, {
    x: 1520, y: 70, k: seg(t, 0.4, 1.0),
    speed: 36.5 + Math.sin(t * 3) * 0.3,
    disp: 0.0,
    hr: 188 + Math.floor((Math.sin(t * 2.1) + 1) * 4),
  });
  heroLines(ctx, [
    { text: '你已经，拼尽全力了。', mark: 'red', keyFrom: 4, keyTo: 8 },
    { text: '为什么，还在原地？', mark: 'red', keyFrom: 6, keyTo: 8 },
  ], { t, start: 0.4, markAt: 1.8, x: 80, y: 70, wid: 1, size: 48 });
  if (t > 3.2) chip(ctx, 80, 220, 'trap', '原地', 'chip-hook');
  sourceFooter(ctx, '据红皇后假说 · 示意（非实测配速）');
  brand(ctx);
}

function world2(ctx, t) {
  // Oval track + relativeGapLock — mechanism
  paintVoid(ctx, W, H, { cx: 0.5, cy: 0.48, redWash: 0.35, grain: 0.5 });
  slowPush(ctx, t, { fx: 960, fy: 560, rate: 0.007 });
  chapterTag(ctx, 'II', '军备竞赛');
  const tk = seg(t, 0.1, 0.8);
  Prop.ovalTrack(ctx, { x: 960, y: 540, rx: 540, ry: 230, k: tk });
  const spin = t * 0.55;
  Prop.racePair(ctx, {
    x: 960, y: 540, rx: 540, ry: 230, k: tk,
    a1: -0.7 + spin, a2: -0.35 + spin,
  });
  const m = multClimb(t, 0.8, 1.30, { dur: 3.0 });
  // generation readout
  ctx.save();
  ctx.fillStyle = P.mute; ctx.font = '600 16px "Noto Serif SC", serif';
  ctx.textAlign = 'center'; ctx.fillText('世代（示意）', 960, 430);
  ctx.fillStyle = P.white; ctx.font = '700 42px "Noto Serif SC", serif';
  ctx.fillText('第 ' + Math.max(1, Math.floor(1 + (m - 1) / 0.05)) + ' 代', 960, 478);
  ctx.font = '600 22px "Noto Serif SC", serif';
  ctx.fillStyle = P.red; ctx.fillText('猎豹速度  ×' + m.toFixed(2), 720, 520);
  ctx.fillStyle = P.white; ctx.fillText('羚羊速度  ×' + m.toFixed(2), 1200, 520);
  ctx.restore();
  const gp = gapLockPulse(t, 2.0, { dur: 1.0 });
  if (gp.k > 0) {
    Prop.relativeGapLock(ctx, { x: 960, y: 700, k: gp.k, breathe: gp.breathe });
    box('gap-lock', '不变', 880, 730, 1040, 780);
  }
  heroLines(ctx, [
    { text: '两边都变快了' },
    { text: '相对差距 · 锁死', mark: 'red', keyFrom: 5, keyTo: 7 },
  ], { t, start: 0.3, markAt: 2.2, x: 80, y: 70, wid: 2, size: 44 });
  if (t > 3.2) chip(ctx, 80, 200, 'lock', '锁死', 'chip-lock');
  sourceFooter(ctx, '军备竞赛示意 · 非真实物种测速');
  brand(ctx);
}

function world3(ctx, t) {
  // Credential stairs + unchanged stage
  paintVoid(ctx, W, H, { cx: 0.45, cy: 0.4, redWash: 0.3, grain: 0.55 });
  slowPush(ctx, t, { fx: 1100, fy: 600, rate: 0.008 });
  chapterTag(ctx, 'II', '军备竞赛');
  const sk = seg(t, 0.15, 0.9);
  Prop.stageSpot(ctx, { x: 340, y: 800, k: sk });
  stickTiny(ctx, { x: 340, y: 786, s: 0.85, color: P.white, glow: 0.9 });
  Prop.credentialStairs(ctx, { x: 620, y: 860, n: 8, k: sk });
  stairCrowd(ctx, { x: 650, y: 820, n: 8, gap: 90, rise: 36, s: 0.55, lit: Math.min(7, Math.floor(t)) });
  // dashed gaze lines from stage to tags
  if (t > 1.5) {
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(226,59,59,0.35)'; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(340, 700);
      ctx.lineTo(680 + i * 90, 780 - i * 36 - 40);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();
  }
  // top stats
  ctx.save();
  ctx.fillStyle = P.white; ctx.font = '700 28px "Noto Serif SC", serif';
  ctx.textAlign = 'left';
  ctx.fillText('看到的舞台  不变', 700, 100);
  ctx.fillStyle = P.red; ctx.fillText('付出的力气  ↑↑↑', 1100, 100);
  ctx.restore();
  box('stage-same', '不变', 860, 80, 960, 120);
  box('effort-up', '↑↑↑', 1280, 80, 1380, 120);

  heroLines(ctx, [
    { text: '学历、证书、加班……' },
    { text: '一层层加码', mark: 'red', keyFrom: 0, keyTo: 5 },
  ], { t, start: 0.4, markAt: 2.0, x: 80, y: 140, wid: 3, size: 42 });
  if (t > 3.2) chip(ctx, 80, 280, 'trap', '加码', 'chip-stairs');
  sourceFooter(ctx, '人类社会军备竞赛 · 示意');
  brand(ctx);
}

function world4(ctx, t) {
  // OUR move: leave the track — directionFork; displacement finally moves
  paintVoid(ctx, W, H, { cx: 0.5, cy: 0.4, redWash: 0.25, grain: 0.45 });
  Prop.starExit(ctx, { k: seg(t, 0.2, 1.2), seed: 31 });
  slowPush(ctx, t, { fx: 900, fy: 560, rate: 0.01 });
  chapterTag(ctx, 'VI', '方向');
  const tk = 1;
  Prop.ovalTrack(ctx, { x: 780, y: 620, rx: 380, ry: 160, k: tk, midline: true });
  // runner still on track briefly, then forks
  const fk = forkDraw(t, 1.2, { dur: 2.2 });
  if (fk < 0.35) {
    stick(ctx, { x: 1050, y: 620, s: 1.1, color: P.red, pose: { ...POSES.sprint, lean: 0.6 } });
  } else {
    Prop.directionFork(ctx, {
      x0: 1050, y0: 600, x1: 1680, y1: 260, k: fk, label: '你的跑道',
    });
    const px = 1050 + (1680 - 1050) * fk;
    const py = 600 + (260 - 600) * fk + 40;
    stick(ctx, {
      x: px, y: py, s: 1.05,
      color: fk > 0.7 ? P.hud : P.red,
      pose: POSES.fork,
    });
  }
  // HUD: displacement finally rises
  const disp = fk > 0.3 ? (fk - 0.3) * 128 : 0;
  Prop.hudTelemetry(ctx, {
    x: 80, y: 400, k: 1,
    speed: 36.4,
    disp,
    hr: 160,
    trapDisp: disp < 0.5,
  });
  // HUD numbers change every frame — do not TEXTS-box them (readcheck dwell).
  // Stable label only:
  box('disp-lab', '位移', 80, 428, 140, 452);

  heroLines(ctx, [
    { text: '速度，是红皇后给的。', mark: 'red', keyFrom: 0, keyTo: 2 },
    { text: '方向，是你自己的。', mark: 'red', keyFrom: 0, keyTo: 2 },
  ], { t, start: 0.4, markAt: 1.6, x: 80, y: 70, wid: 4, size: 46 });
  if (t > 3.5) chip(ctx, 80, 220, 'fork', '分叉', 'chip-fork');
  sourceFooter(ctx, '跑累了，抬头看看：这是不是你的跑道');
  brand(ctx);
}

function render(t) {
  const ctx = document.getElementById('c').getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  TX.length = 0;
  if (t < 6) world1(ctx, t);
  else if (t < 12) world2(ctx, t - 6);
  else if (t < 18) world3(ctx, t - 12);
  else world4(ctx, t - 18);
  const d = Math.max(dipBlack(t, 6), dipBlack(t, 12), dipBlack(t, 18));
  if (d > 0) { ctx.fillStyle = `rgba(0,0,0,${d})`; ctx.fillRect(0, 0, W, H); }
  if (t > 11.5 && t < 12.6) redBloom(ctx, t, 12, { x: 960, y: 600 });
}
window.render = render;
window.TEXTS = () => TX.slice();
document.fonts.ready.then(() => { render(0); window.READY = true; });

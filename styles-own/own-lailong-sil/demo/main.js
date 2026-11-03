/** Demo film 「缺席也是消息」 — Lailong Silhouette History.
 * Original topic; grammar from 5918 / zhaoyun / 2217. */
import { P, paintVoid, hero, sourceFooter, brand, moon, ground, signalChip, mountains, distantGlow, terrainWaves } from './look.js';
import { puppet, courtRow, horseRider } from './people.js';
import * as Prop from './props.js';
import { slowPush, textRise, dualMark, fireFlicker, smokeRise, torchLadder, pathDraw, absentPulse, pose, dipBrown, fireBloom, seg, POSES } from './motion.js';

const W = 1920, H = 1080;
window.DUR = 24.0;
const TX = [];
function box(id, text, x0, y0, x1, y1) { TX.push({ id, text, x0, y0, x1, y1 }); }

function heroLines(ctx, rows, base) {
  rows.forEach((r, i) => {
    const tr = textRise(base.t, base.start, i);
    if (tr.a <= 0) return;
    const mkOn = r.mark && base.t > (base.markAt || base.keyAt || 0);
    hero(ctx, [{
      text: r.text, size: base.size || 46, weight: 700, a: tr.a,
      color: P.cream,
      mark: mkOn ? r.mark : null,
      keyFrom: r.keyFrom, keyTo: r.keyTo,
    }], { x: base.x, y: base.y + i * 58 + tr.dy });
    const tw = r.text.length * (base.size || 46) * 0.9;
    box(`h${base.wid}-${i}`, r.text, base.x, base.y + i * 58 - 10, base.x + tw, base.y + i * 58 + 50);
  });
}

function chip(ctx, x, y, state, label, id) {
  signalChip(ctx, x, y, state, label);
  box(id, label, x, y, x + label.length * 15 + 28, y + 26);
}

function world1(ctx, t) {
  // Lonely beacon under moon — styleframe anchor ≈ 5918 t0
  paintVoid(ctx, W, H, { cx: 0.55, cy: 0.38, warm: 0.55, stars: 1.15 });
  slowPush(ctx, t, { fx: 960, fy: 580, rate: 0.009 });
  moon(ctx, 1520, 160, 30, 0.75);
  mountains(ctx, { y: 700, color: '#0B0908' });
  distantGlow(ctx, 420, 680, 160, 0.4);
  distantGlow(ctx, 520, 700, 80, 0.25);
  terrainWaves(ctx, 620, 6);
  ground(ctx, 860, {});
  const k = seg(t, 0.2, 1.1);
  Prop.beaconTower(ctx, { x: 960, y: 860, s: 2.15, k, lit: false, label: '', fill: '#32281F' });
  // soft mound under tower
  ctx.save();
  ctx.fillStyle = '#0E0B09';
  ctx.beginPath(); ctx.ellipse(960, 880, 220, 40, 0, 0, Math.PI * 2); ctx.fill();
  // faint warm rim on left of tower (from distant glow)
  const g = ctx.createRadialGradient(820, 780, 0, 960, 820, 260);
  g.addColorStop(0, 'rgba(224,140,60,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(700, 650, 520, 260); ctx.restore();

  heroLines(ctx, [
    { text: '你以为烽火 = 敌人来了' },
    { text: '点一把火', mark: 'blue', keyFrom: 1, keyTo: 4 },
  ], { t, start: 0.5, markAt: 2.0, x: 80, y: 70, wid: 1, size: 48 });
  if (t > 3.0) chip(ctx, 80, 220, 'peace', '常识', 'chip-hook');
  sourceFooter(ctx, '据《武经总要》所录唐《烽式》· 示意');
  brand(ctx);
}

function world2(ctx, t) {
  // Torch ladder 1–4 — mechanism
  paintVoid(ctx, W, H, { cx: 0.5, cy: 0.38, warm: 0.7, stars: 0.9 });
  slowPush(ctx, t, { fx: 1100, fy: 520, rate: 0.008 });
  ground(ctx, 900, {});
  Prop.beaconTower(ctx, { x: 280, y: 880, s: 1.55, k: 1, lit: false, label: '烽台' });
  const ladder = torchLadder(t, 0.6, 4, { dur: 3.2 });
  const flicker = fireFlicker(t);
  const xs = [560, 860, 1160, 1460];
  const nums = ['一', '二', '三', '四'];
  xs.forEach((x, i) => {
    // tube/stand
    ctx.save();
    ctx.fillStyle = '#2A221A'; ctx.strokeStyle = 'rgba(40,30,22,0.75)'; ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x - 16, 880); ctx.lineTo(x - 10, 780); ctx.lineTo(x + 10, 780); ctx.lineTo(x + 16, 880);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    const on = i < ladder.lit || (i === ladder.lit && ladder.partial > 0.15);
    if (on) Prop.torchFire(ctx, { x, y: 760, s: 1.15 * (i === ladder.lit ? 0.7 + ladder.partial * 0.3 : 1), k: 1, t, flicker });
    ctx.save();
    ctx.fillStyle = on && i === 3 ? P.markRed : P.cream;
    ctx.font = `700 36px "Noto Serif SC", serif`;
    ctx.textAlign = 'center'; ctx.fillText(nums[i], x, 940);
    if (i === 3 && on) {
      ctx.strokeStyle = P.markRed; ctx.lineWidth = 2;
      ctx.strokeRect(x - 28, 910, 56, 42);
    }
    ctx.restore();
  });
  heroLines(ctx, [
    { text: '夜里放火：一把火一句话' },
    { text: '火把越多 · 传得越远', mark: 'blue', keyFrom: 0, keyTo: 4 },
  ], { t, start: 0.3, markAt: 2.2, x: 80, y: 60, wid: 2, size: 42 });
  if (t > 3.5) chip(ctx, 80, 200, 'alarm', '告警阶梯', 'chip-ladder');
  sourceFooter(ctx, '据唐《烽式》炬数阶梯 · 示意');
  brand(ctx);
}

function world3(ctx, t) {
  // Peace path on topo map
  paintVoid(ctx, W, H, { cx: 0.5, cy: 0.5, warm: 0.55, stars: 0.3 });
  slowPush(ctx, t, { fx: 960, fy: 540, rate: 0.007 });
  const kMap = seg(t, 0.1, 0.8);
  Prop.topoMap(ctx, { x: 960, y: 560, w: 1500, h: 780, k: kMap, seed: 7 });
  const pts = [
    { x: 280, y: 720 }, { x: 480, y: 600 }, { x: 700, y: 560 },
    { x: 980, y: 500 }, { x: 1240, y: 480 }, { x: 1500, y: 420 },
  ];
  const pk = pathDraw(t, 0.8, 3.2);
  Prop.peacePath(ctx, {
    pts, k: pk,
    nodes: [
      { x: 280, y: 720, label: '边陲', r: 9 },
      { x: 700, y: 560, label: '凉州', r: 8 },
      { x: 1240, y: 480, label: '潼关', r: 8 },
      { x: 1500, y: 420, label: '长安', r: 11, empty: t > 3.5 },
    ],
  });
  // mini towers along path
  [0, 2, 3].forEach((i) => {
    if (pk > i / 5) Prop.beaconTower(ctx, { x: pts[i].x, y: pts[i].y + 10, s: 0.45, k: 1, lit: i < 3 });
  });
  heroLines(ctx, [
    { text: '每晚一封平安火' },
    { text: '没事 · 也要报一声', mark: 'blue', keyFrom: 0, keyTo: 2 },
  ], { t, start: 0.4, markAt: 2.0, x: 80, y: 60, wid: 3, size: 44 });
  if (t > 3.2) chip(ctx, 1420, 360, 'peace', '平安', 'chip-peace');
  sourceFooter(ctx, '路线为示意 · 非实测里程');
  brand(ctx);
}

function world4(ctx, t) {
  // Absent signal — OUR move
  paintVoid(ctx, W, H, { cx: 0.5, cy: 0.4, warm: 0.5, stars: 0.85 });
  slowPush(ctx, t, { fx: 1100, fy: 500, rate: 0.01 });
  ground(ctx, 880, {});
  moon(ctx, 420, 160, 28, 0.7);
  // row of dark towers
  const xs = [520, 820, 1120, 1420];
  xs.forEach((x, i) => {
    Prop.beaconTower(ctx, { x, y: 860, s: 1.2, k: 1, lit: false });
  });
  // the missing fire over the last tower
  const ap = absentPulse(t, 1.0, { dur: 1.4 });
  if (ap.k > 0) {
    Prop.absentSignal(ctx, { x: 1420, y: 560, s: 1.6, k: ap.k, breathe: ap.breathe, label: '没来' });
  }
  // looking puppet
  const pk = seg(t, 0.4, 1.2);
  if (pk > 0) {
    puppet(ctx, {
      x: 280, y: 860, s: 1.5, hat: 'mian', facing: 1, fill: 'cream',
      pose: pose('neutral', 'absent', Math.min(1, (t - 0.4) / 2)),
    });
  }
  heroLines(ctx, [
    { text: '最吓人的不是火把' },
    { text: '是该来的信号没来', mark: 'red', keyFrom: 6, keyTo: 8 },
  ], { t, start: 0.5, markAt: 2.4, x: 80, y: 60, wid: 4, size: 46 });
  if (t > 3.0) chip(ctx, 80, 210, 'absent', '缺席', 'chip-absent');
  sourceFooter(ctx, '据《资治通鉴》卷二一八「平安火不至」· 示意');
  brand(ctx);
}

function render(t) {
  const ctx = document.getElementById('c').getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  TX.length = 0;
  let local = t, world = 1;
  if (t < 6) { world = 1; local = t; world1(ctx, local); }
  else if (t < 12) { world = 2; local = t - 6; world2(ctx, local); }
  else if (t < 18) { world = 3; local = t - 12; world3(ctx, local); }
  else { world = 4; local = t - 18; world4(ctx, local); }
  // dips at boundaries
  const d1 = dipBrown(t, 6), d2 = dipBrown(t, 12), d3 = dipBrown(t, 18);
  const d = Math.max(d1, d2, d3);
  if (d > 0) {
    ctx.fillStyle = `rgba(10,8,6,${d})`;
    ctx.fillRect(0, 0, W, H);
  }
  if (t > 11.5 && t < 12.5) fireBloom(ctx, t, 12, { x: 1000, y: 700 });
}
window.render = render;
window.TEXTS = () => TX.slice();
document.fonts.ready.then(() => { render(0); window.READY = true; });

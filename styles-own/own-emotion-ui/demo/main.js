/** main.js — own-emotion-ui demo: 「聚光灯效应 · 你没那么显眼」(Gilovich, Medvec & Savitsky 2000). 24 s, 4 worlds.
 * W1 stage (nexo cast) → W2 bedroom replay (6571 cast) → W3 the T-shirt experiment (6911 cast) → W4 stage again, reversal.
 * Native move gazeLock appears at 1.4 s and is played backwards (gazeRelease) at 18.6 s — our improvement: the UI is the argument. */
import { P, paintRoom, vignette, glowPool, roundRect, rgba, chip as chipRaw, grain, FONT, clamp, lerp } from './look.js';
import { pill, crowd, sitter, kid, steam } from './people.js';
import * as Pr from './props.js';
import { seg, ease, popIn, gazeLock, gazeRelease, bubbleStack, meter, lampOn, breath, dip, dive, countUp, capRise } from './motion.js';

const W = 1920, H = 1080;
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 24;
let TX = [];
const push = (b, id) => { if (b) TX.push({ id: id || b.text, text: b.text, x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 }); };

/* caption: nexo style — bold white sans, bottom centre, optional orange-outlined tag in front (自我关注). */
function caption(t, at, until, text, { tag = null, size = 54, y = 960 } = {}) {
  if (t < at || t > until) return;
  const { a, dy } = capRise(t, at); const out = clamp((until - t) / 0.25);
  ctx.save(); ctx.globalAlpha = a * out; ctx.font = `700 ${size}px ${FONT}`; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width; let tagW = 0;
  if (tag) { ctx.font = `600 ${size * 0.6}px ${FONT}`; tagW = ctx.measureText(tag).width + size * 0.8 + size * 0.35; }
  let x = W / 2 - (tw + tagW) / 2; const yy = y + dy;
  // soft navy band for ≥4.5:1 contrast whatever is behind
  const g = ctx.createLinearGradient(0, y - size * 1.4, 0, y + size * 1.2); g.addColorStop(0, 'rgba(8,12,22,0)'); g.addColorStop(0.45, 'rgba(8,12,22,0.62)'); g.addColorStop(1, 'rgba(8,12,22,0.62)');
  ctx.fillStyle = g; ctx.fillRect(0, y - size * 1.4, W, size * 2.6);
  if (tag) { ctx.font = `600 ${size * 0.6}px ${FONT}`; const w = tagW - size * 0.35, h = size * 1.0;
    roundRect(ctx, x, yy - h / 2, w, h, h * 0.3); ctx.fillStyle = 'rgba(255,154,60,0.16)'; ctx.fill(); ctx.strokeStyle = P.orange; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#FFC48A'; ctx.textAlign = 'center'; ctx.fillText(tag, x + w / 2, yy + 1); x += tagW; }
  ctx.font = `700 ${size}px ${FONT}`; ctx.textAlign = 'left'; ctx.fillStyle = '#F6F7FB'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10; ctx.fillText(text, x, yy);
  ctx.restore();
  TX.push({ id: 'cap:' + text, text: (tag || '') + text, x0: W / 2 - (tw + tagW) / 2, y0: y - size * 0.7, x1: W / 2 + (tw + tagW) / 2, y1: y + size * 0.7 });
}
const chip = (t, at, x, y, text, o = {}) => { const k = popIn(t, at); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; const b = chipRaw(ctx, x, y, text, o); ctx.restore(); if (b) push({ ...b, text }, 'chip:' + text); };

/* ---------- STAGE (W1 + W4 share it: same place, opposite reading) ---------- */
function stage(t, mode) {
  const W4 = mode === 'after';
  paintRoom(ctx, W, H, { floorY: 860, glowX: 0.62, glowY: 0.55, glow: W4 ? 0.22 : 0.4 });
  const hx = 1180, fy = 860, HH = 470;
  // spotlight cone from above (stronger in W1; in W4 it dims — the spotlight was in your head)
  const sp = W4 ? lerp(1, 0.35, ease.inOut(seg(t, 19.6, 21))) : popIn(t, 0.1, 0.6);
  ctx.save(); ctx.globalAlpha = sp; const g = ctx.createLinearGradient(0, 0, 0, fy);
  g.addColorStop(0, 'rgba(255,214,160,0.0)'); g.addColorStop(1, 'rgba(255,200,140,0.20)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(hx - 70, 0); ctx.lineTo(hx + 70, 0); ctx.lineTo(hx + 260, fy); ctx.lineTo(hx - 260, fy); ctx.fill();
  ctx.scale(1, 0.16); glowPool(ctx, hx, fy / 0.16, 300, '#FFB070', 0.45); ctx.restore();
  // crowd (left) — in W4 each lights up with their own phone
  const phones = W4 ? (t > 19.3 ? 0.9 : 0) : 0;
  const cr = crowd(ctx, { x0: 20, x1: 780, y: fy, H: 430, n: 3, seed: 7, phones, t });
  // hero
  const arm = W4 ? (t > 20.6 ? 'phone' : 'hip') : (t > 2.9 ? 'chin' : 'hip');
  const hero = pill(ctx, { x: hx, y: fy, H: HH, cast: 'hero', arm, glow: sp, screen: 1, lean: breath(t, 0, 0.012) });
  // eyes over the crowd + gaze lines → hero head
  const eyesAt = [[230, 300], [450, 260], [650, 320]];
  const G = W4 ? gazeRelease(t, 18.5, 3) : gazeLock(t, 1.4, 3);
  eyesAt.forEach(([ex, ey], i) => {
    Pr.gazeLine(ctx, ex + 30, ey, hero.head[0] - 40, hero.head[1], { k: G.lines[i], t });
    Pr.eye(ctx, ex, ey, 36, { k: G.eyes[i], look: [1, 0.2], blink: W4 ? G.blink : 0, color: '#AEB7CC' });
  });
  Pr.focusBrackets(ctx, hero.head[0], fy - HH * 0.5, HH * 0.62, HH * 1.08, { k: G.brackets, t });
  // tension meter
  const v = W4 ? meter(t, 19.6, 0.88, 0.15, 1.4) : meter(t, 2.7, 0.1, 0.88, 1.4);
  const mk = W4 ? 1 : popIn(t, 2.5);
  push(Pr.tensionMeter(ctx, hx - 255, fy - 150, 230, { v, k: mk, label: '紧张', size: 30 }), 'meter');
  // callout from hero's face
  if (!W4) push(Pr.callout(ctx, hero.head[0] + 50, hero.head[1] - 10, hero.head[0] + 180, hero.head[1] - 100, '表情自然吗？', { k: seg(t, 3.3, 3.9), size: 32 }));
  if (W4 && t > 20.5) push(Pr.callout(ctx, cr[cr.length - 2].head[0] + 30, cr[cr.length - 2].head[1] - 10, 840, 380, '我刚才说错话没？', { k: seg(t, 20.6, 21.1), size: 30 }));
  return hero;
}

/* ---------- W2 BEDROOM REPLAY (6571) ---------- */
function bedroom(t) {
  paintRoom(ctx, W, H, { floorY: 880, glowX: 0.55, glow: 0.18 });
  Pr.windowMoon(ctx, 1560, 110, 250, 210, { k: popIn(t, 6.1, 0.4) });
  Pr.wallClock(ctx, 330, 300, 78, { t: t - 6, speed: 60, k: popIn(t, 6.3) });
  const b = Pr.bed(ctx, 300, 880, 560);
  const s = sitter(ctx, { x: 845, y: b.seatY + 40, H: 520, hunch: 0.62 + 0.06 * Math.sin(t * 0.8), phone: 0.9 + 0.1 * Math.sin(t * 5) });
  steam(ctx, s.top[0], s.top[1] - 16, 110, t, popIn(t, 7.2));
  // thought cloud replays the stage, in miniature
  const ck = popIn(t, 7.6, 0.6);
  Pr.thoughtCloud(ctx, 1330, 420, 520, 340, { k: ck, from: [s.top[0] + 40, s.top[1] - 20], draw: (c) => {
    pill(c, { x: 60, y: 110, H: 190, cast: 'hero', arm: 'chin' });
    [[-170, -60], [-110, -95], [-180, 20]].forEach(([ex, ey], i) => { Pr.gazeLine(c, ex + 14, ey, 50, -60, { k: 1, t, color: '#AEB7CC' }); Pr.eye(c, ex, ey, 14, { color: '#AEB7CC' }); });
    Pr.focusBrackets(c, 60, 15, 120, 210, { k: 1, t });
  } });
  // replay counter on the cloud: 第 N 遍
  // replay tally: chip text stays fixed, five tally bars fill in (numbers that change would restart reading time)
  if (t > 8.4) { chip(t, 8.4, 1290, 640, '脑内重播', { color: P.orange, size: 28 });
    const n = Math.floor(clamp((t - 8.6) / 1.6) * 5.99);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = i < n ? P.orange : 'rgba(255,255,255,0.18)'; roundRect(ctx, 1410 + i * 16, 624, 9, 32, 3); ctx.fill(); } }
  Pr.flipClock(ctx, 1330, 760, 66, { text: '01:17', k: popIn(t, 9.0), flip: seg(t, 10.6, 11.0), prev: '6' });
  if (t > 9.0 && t < 11.9) TX.push({ id: 'clock', text: '01:17', x0: 1200, y0: 720, x1: 1460, y1: 800 });
  return s;
}

/* ---------- W3 THE EXPERIMENT (6911) ---------- */
function experiment(t) {
  paintRoom(ctx, W, H, { floorY: 880, glow: 0.12 });
  const L1 = lampOn(t, 12.15), L2 = lampOn(t, 12.35);
  Pr.hangingLamp(ctx, 560, 0, 220, { w: 160, floorY: 880, on: L1, t, seed: 3 });
  Pr.hangingLamp(ctx, 1220, 0, 200, { w: 140, floorY: 880, on: L2 * 0.8, t, seed: 8, dust: 25 });
  // peers (right) — each busy with their own phone
  [[1160, 'short', P.denim], [1370, 'bob', '#8FB98B'], [1580, 'short', '#C59BD6']].forEach(([x, hair, top], i) =>
    kid(ctx, { x, y: 900, H: 440, hair, top, mood: 'calm', armR: 'phone', facing: -1, turn: 0.8, blink: (Math.sin(t * 2 + i * 2) > 0.97) ? 1 : 0, bob: breath(t, i, 1) }));
  // target walks in with the loud tee
  const walk = ease.out(seg(t, 12.0, 13.0));
  const kx = lerp(240, 600, walk);
  const k = kid(ctx, { x: kx, y: 900, H: 500, hair: 'bob', top: P.coral, mood: t > 13.2 ? 'worried' : 'calm', armR: 'down', armL: 'down', turn: 1 - ease.inOut(seg(t, 12.8, 13.3)), bob: Math.sin(t * 9) * 3 * (1 - walk) });
  const chest = [k.head[0], k.head[1] + k.H * 0.36];
  Pr.tshirtPrint(ctx, chest[0], chest[1], k.H * 0.085, { k: 1, glow: 0.4 + 0.2 * Math.sin(t * 4) });
  // her belief vs the room's fact
  const c1 = countUp(t, 13.4), c2 = countUp(t, 14.0);
  if (t > 13.4) Pr.statCard(ctx, 1050, 250, 300, { label: '她以为会被认出', value: 46, k: c1, color: P.orange, sub: '穿的人估计' }).forEach(b => push(b, 'card1'));
  if (t > 14.0) Pr.statCard(ctx, 1410, 250, 300, { label: '实际认出 T 恤', value: 23, k: c2, color: P.cyan, sub: '在场的人' }).forEach(b => push(b, 'card2'));
  if (t > 15.0) chip(t, 15.0, 1230, 400, '高估了一倍', { color: P.orange, num: 2, size: 30 });
  push(Pr.statusLine(ctx, 1860, 1040, 'Gilovich 等 2000 · JPSP', { k: seg(t, 13.0, 13.4), size: 22, align: 'right' }), 'cite');
}

window.render = (t) => {
  TX = []; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (t < 6) {
    stage(t, 'before');
    chip(t, 0.6, 150, 90, '聚光灯效应', { color: P.orange, num: 1, size: 32 });
    caption(t, 0.4, 5.75, '你以为，全场都在盯着你？');
  } else if (t < 12) {
    // W2 → W3 transition: dive into the thought cloud
    const dv = dive(t, 11.2, 0.8);
    ctx.save(); if (dv > 0) { const s = 1 + dv * 5; ctx.translate(1330, 420); ctx.scale(s, s); ctx.translate(-1330, -420); }
    bedroom(t); ctx.restore();
    if (dv > 0) { ctx.fillStyle = rgba('#121A36', dv); ctx.fillRect(0, 0, W, H); }
    caption(t, 6.3, 11.95, '回到家，脑子里还在一遍遍重播', { tag: '自我关注' });
  } else if (t < 18) {
    experiment(t);
    caption(t, 12.3, 17.75, '实验：穿着尴尬的T恤走进教室');
  } else {
    stage(t, 'after');
    caption(t, 18.4, 23.9, '其实，大家都在忙着看自己。', { tag: '真相' });
    if (t > 21.0) chip(t, 21.0, 960, 120, '你没那么显眼', { color: P.cyan, size: 34 });
  }
  vignette(ctx, W, H, 0.45);
  grain(ctx, W, H, t, 0.03);
  // cuts
  const d = Math.max(dip(t, 6, 0.3), dip(t, 18, 0.3), dip(t, 12, 0.25) * 0.6);
  if (d > 0) { ctx.fillStyle = rgba(P.void, d); ctx.fillRect(0, 0, W, H); }
};
window.TEXTS = () => TX.slice();
document.fonts.ready.then(() => { window.render(0); window.READY = true; });

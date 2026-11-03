/** main.js — own-dark-gold demo: 「为什么越看越顺眼」(mere-exposure effect). 24 s, 4 worlds.
 * One example among many — see DEMO.md. Native move (ring ignite) appears once, at 1.2 s. */
import { P, paintVoid, glowStroke, stateChip, roundRect } from './look.js';
import { bust, figure, crowd, tinyFigure } from './people.js';
import * as Pr from './props.js';
import { seg, slowPush, textRise, keyIgnite, ringIgnite, breathe, liftReveal, labelSnap, pose, dipVoid, bloomWipe, ease2 } from './motion.js';

const W = 1920, H = 1080;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
window.DUR = 24;
let TX = [];   // texts drawn in the last render(t) → window.TEXTS
const chip = (x, y, kind, txt) => { stateChip(ctx, x, y, kind, txt); TX.push({ id: 'chip:' + txt, text: txt, x0: x - 10, y0: y - 20, x1: x + 30 * txt.length, y1: y + 20 }); };

/* caption: lines = [[text, keyword?]], key word lights gold */
function lines(t, start, arr, { x = 150, y = 330, size = 72, lh = 1.56, align = 'left' } = {}) {
  ctx.save();
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  { // reading-check box: union of all lines once the block has started
    ctx.font = `500 ${size}px "Noto Serif SC", serif`;
    const wmax = Math.max(...arr.map(L => ctx.measureText(L[0]).width));
    const x0 = align === 'center' ? x - wmax / 2 : x;
    if (textRise(t, start, 0).a > 0) TX.push({ id: arr.map(L => L[0]).join(''), text: arr.map(L => L[0]).join(''), x0, y0: y - size * 0.7, x1: x0 + wmax, y1: y + (arr.length - 1) * size * lh + size * 0.7 });
  }
  arr.forEach((L, i) => {
    const { a, dy } = textRise(t, start, i);
    if (a <= 0) return;
    const [txt, key] = L;
    ctx.font = `500 ${size}px "Noto Serif SC", serif`;
    const full = ctx.measureText(txt).width;
    let cx = align === 'center' ? x - full / 2 : x;
    const yy = y + i * size * lh + dy;
    const parts = key ? txt.split(key) : [txt];
    const kk = keyIgnite(t, start + i * 0.18 + 0.55);
    ctx.globalAlpha = a;
    parts.forEach((p, j) => {
      ctx.font = `500 ${size}px "Noto Serif SC", serif`;
      ctx.fillStyle = '#EEEBE4'; ctx.shadowBlur = 0;
      ctx.fillText(p, cx, yy); cx += ctx.measureText(p).width;
      if (key && j < parts.length - 1) {
        ctx.font = `700 ${size}px "Noto Serif SC", serif`;
        ctx.fillStyle = kk > 0 ? `rgb(${238 + (245 - 238) * kk},${235 + (200 - 235) * kk},${228 + (110 - 228) * kk})` : '#EEEBE4';
        ctx.shadowColor = 'rgba(245,190,80,0.9)'; ctx.shadowBlur = 26 * kk;
        ctx.fillText(key, cx, yy); cx += ctx.measureText(key).width;
      }
    });
  });
  ctx.restore();
}
function brand(alpha = 1) {
  ctx.save(); ctx.globalAlpha = 0.8 * alpha;
  ctx.font = '400 22px "Noto Serif SC", serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const txt = '知 识 大 赏'; const w = ctx.measureText(txt).width + 32;
  ctx.strokeStyle = 'rgba(200,196,188,0.55)'; ctx.lineWidth = 1; ctx.strokeRect(1840 - w, 48, w, 40);
  ctx.fillStyle = '#C9C5BC'; ctx.fillText(txt, 1840 - w / 2, 69);
  ctx.restore();
}
function topic(alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.font = '700 40px "Noto Serif SC", serif'; ctx.fillStyle = '#F0EDE6'; ctx.textBaseline = 'top';
  ctx.fillText('曝光效应', 66, 56);
  ctx.font = 'italic 400 19px "Noto Serif SC", Georgia, serif'; ctx.fillStyle = 'rgba(220,214,200,0.75)';
  ctx.fillText('The Mere-Exposure Effect', 68, 110);
  ctx.restore();
}

/* ---------- WORLD 1: the gilded bust (0–6 s) ---------- */
function world1(t) {
  paintVoid(ctx, W, H, { warm: 0.5, cx: 0.66, cy: 0.45 });
  ctx.save();
  slowPush(ctx, t, { fx: 1300, fy: 520, rate: 0.012 });
  const bx = 1290, by = 1020, s = 1.38 * breathe(t);
  const r = ringIgnite(t, 1.2);
  const p = pose('neutral', 'enchanted', ease2.inOut(seg(t, 2, 4.5)));
  const o = { x: bx, y: by, s, facing: -1, hair: 'bun', fill: 'foil', pose: p, eye: false };
  ctx.save(); const k = (await0(o)); ctx.restore();
  const [hcx, hcy] = k.head;
  // warm haze inside ring
  const hz = ctx.createRadialGradient(hcx, hcy, 0, hcx, hcy, k.headH * 0.95);
  hz.addColorStop(0, `rgba(120,96,50,${0.30 * r.k})`); hz.addColorStop(1, 'rgba(120,96,50,0)');
  ctx.fillStyle = hz; ctx.beginPath(); ctx.arc(hcx, hcy, k.headH, 0, Math.PI * 2); ctx.fill();
  Pr.haloRing(ctx, hcx + 10, hcy - 14, k.headH * 0.6, { t, k: r.k, ticks: 220 });
  Pr.goldDust(ctx, { x: 1300, y: 560, w: 1000, h: 900, n: 140, t, seed: 4 });
  bust(ctx, o);
  Pr.goldDust(ctx, { x: bx - 20, y: by - 330, w: 360, h: 520, n: 140, t, seed: 12, size: 0.8, color: '255,248,228' });
  // plinth bar
  glowStroke(ctx, () => { ctx.beginPath(); ctx.moveTo(bx - 360, by + 6); ctx.lineTo(bx + 360, by + 6); }, { color: '#F2E6C8', width: 3, bloom: 4, alpha: 0.75 });
  ctx.fillStyle = '#0B0B0C'; ctx.fillRect(bx - 350, by + 10, 700, 80);
  if (r.flash) { ctx.fillStyle = `rgba(255,230,170,${0.12 * r.flash})`; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
  lines(t, 0.3, [['为什么一样东西，'], ['见得越多，'], ['就越觉得顺眼？', '顺眼']], { x: 150, y: 350 });
  brand();
}
function await0(o) { const c = document.createElement('canvas').getContext('2d'); return bust(c, { ...o, fill: 'line' }); }

/* ---------- WORLD 2: the ordinary cup under glass (6–12 s) ---------- */
function world2(t) {
  const lt = t - 6;
  paintVoid(ctx, W, H, { warm: 0.3, cx: 0.5, cy: 0.5 });
  ctx.save();
  slowPush(ctx, lt, { fx: 960, fy: 700, rate: 0.018 });
  Pr.beam(ctx, 960, -40, 760, 260, 560, { alpha: 0.22 });
  Pr.pedestal(ctx, 960, 760, 300, 420);
  const lift = liftReveal(lt, 3.2);
  Pr.treasure(ctx, 960, 744, 120, { kind: 'cup', k: 0.3 + 0.7 * seg(lt, 3.6, 4.4) });
  Pr.cloche(ctx, 960, 752, 240, { lift: Math.max(0, lift) * 0.0 + 0, glow: 0.6 });
  Pr.goldDust(ctx, { x: 960, y: 450, w: 420, h: 700, n: 60, t, seed: 31, size: 0.7 });
  for (let i = 0; i < 14; i++) { const R = ((i * 7919) % 97) / 97, x = 80 + i * 132 + R * 40; if (Math.abs(x - 960) < 260) continue; ctx.fillStyle = `rgba(200,198,190,${0.35 + 0.3 * R})`; const y = 420 + ((i * 53) % 9) * 22; ctx.fillRect(x, y + Math.sin(t + i) * 3, 16 + R * 6, 26 + R * 8); }
  crowd(ctx, { baseY: 960, rows: 2, seed: 8, gap: 220, phones: 0.0, t, scale: 0.95 });
  ctx.restore();
  // state chips (our improvement)
  if (lt > 2.4) chip(1090, 640, 'anticipation', '第 1 次：普通');
  if (lt > 3.0) chip(1090, 674, 'peak', '第 30 次：舍不得');
  lines(t, 6.3, [['天天见的杯子，'], ['看久了也成了宝贝', '宝贝']], { x: 960, y: 150, size: 54, align: 'center' });
  topic(); brand();
}

/* ---------- WORLD 3: the archive screen (12–18 s) ---------- */
function world3(t) {
  const lt = t - 12;
  paintVoid(ctx, W, H, { warm: 0.2 });
  ctx.save(); ctx.globalAlpha = 0.55; crowd(ctx, { baseY: 1010, rows: 2, seed: 15, t, scale: 0.75 }); ctx.restore();
  ctx.save();
  slowPush(ctx, lt, { fx: 960, fy: 430, rate: 0.01 });
  TX.push({ id: 'cite', text: 'Zajonc, 1968', x0: 760, y0: 680, x1: 1160, y1: 730 });
  Pr.archiveScreen(ctx, 620, 190, 680, 470, {
    t, cite: 'Zajonc, 1968', k: seg(lt, 0, 0.6),
    draw: (c, ix, iy, iw, ih) => {
      const n = 1 + Math.floor(seg(lt, 0.8, 4.2) * 24);
      Pr.frameStack(c, ix + iw * 0.62, iy + ih * 0.46, 150, 110, Math.min(n, 9), { k: 1 });
      figure(c, ix + iw * 0.3, iy + ih * 0.92, ih * 0.7, { fill: '#0A0B0D', line: 'rgba(225,225,225,0.8)', pose: pose('neutral', 'hopeful', seg(lt, 1, 4)) });
      Pr.counter(c, ix + iw * 0.62, iy + ih * 0.82, 25, { size: 44, k: seg(lt, 0.8, 4.2), suffix: ' 次' });
    },
  });
  ctx.restore();
  lines(t, 12.6, [['看的次数越多，好感越高', '好感越高']], { x: 960, y: 92, size: 52, align: 'center' });
  topic(); brand();
}

/* ---------- WORLD 4: two people & the veil (18–24 s) ---------- */
function world4(t) {
  const lt = t - 18;
  paintVoid(ctx, W, H, { warm: 0.25, cx: 0.6 });
  ctx.save();
  slowPush(ctx, lt, { fx: 960, fy: 560, rate: 0.012 });
  figure(ctx, 470, 1160, 900, { fill: 'rgba(8,8,9,1)', pose: pose('neutral', 'hopeful', seg(lt, 1, 3)) });
  Pr.crystalColumn(ctx, 760, 60, 1060, 110, { t, k: seg(lt, 0, 1) });
  const hx = 1340, hy = 1180;
  const ob = { x: hx, y: hy, s: 1.3 * breathe(t), facing: -1, hair: 'bun', fill: 'void', lineColor: 'rgba(206,196,178,0.6)', pose: pose('neutral', 'hopeful', seg(lt, 0.5, 2)) };
  const kb = await0(ob);
  Pr.haloRing(ctx, kb.head[0] - 70, kb.head[1] + 10, kb.headH * 0.5, { t, k: 1, ticks: 160 });
  bust(ctx, ob);
  const tags = [['熟悉', 1690, 330], ['安全', 1740, 450], ['喜欢', 1700, 570]];
  tags.forEach(([txt, x, y], i) => labelSnap(lt, 1.6, i) > 0 && TX.push({ id: 'tag:' + txt, text: txt, x0: x - 60, y0: y - 30, x1: x + 60, y1: y + 30 }));
  tags.forEach(([txt, x, y], i) => Pr.labelTag(ctx, x, y, txt, { k: labelSnap(lt, 1.6, i), anchor: [1500, 520] }));
  ctx.restore();
  lines(t, 18.4, [['大脑把“见过”，'], ['偷偷换成了“喜欢”', '喜欢']], { x: 960, y: 150, size: 54, align: 'center' });
  if (lt > 2.4) chip(820, 980, 'risk', '提醒：顺眼 ≠ 靠谱');
  topic(); brand();
}

const BOUNDS = [6, 12, 18];
function render(t) {
  TX = [];
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  if (t < 6) world1(t); else if (t < 12) world2(t); else if (t < 18) world3(t); else world4(t);
  // transitions
  bloomWipe(ctx, t, 6, { x: 1298, y: 420 });
  const d = Math.max(dipVoid(t, 12), dipVoid(t, 18));
  if (d) { ctx.fillStyle = `rgba(4,4,5,${d})`; ctx.fillRect(0, 0, W, H); }
}
window.render = render;
window.TEXTS = () => TX.slice();
document.fonts.ready.then(() => { render(0); window.READY = true; });

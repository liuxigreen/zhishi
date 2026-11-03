/** sheet.js — own-murphy-panel reference sheets. t<1 people · 1≤t<2 props · t≥2 pattern filmstrip. */
import { P, W, H, setCam, pr, room, pool, checklist, ringGauge, text, rgba, SERIF, ITAL, formula, measureBar } from './look.js';
import { peg, POSES, POSE_NAMES, PALETTE } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
const cam = (cx, cy, s = 1, { eye = [0, 150, 520], target = [0, 45, 0] } = {}) => setCam(eye, target, 1500 * s, cx, cy);
function bg(title, sub) { ctx.fillStyle = P.room; ctx.fillRect(0, 0, W, H); const g = ctx.createRadialGradient(W / 2, H * 0.4, 50, W / 2, H * 0.4, 1100); g.addColorStop(0, 'rgba(120,70,30,0.25)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  text(ctx, title, 48, 44, { size: 34, w: 900, col: P.capWhite }); text(ctx, sub, 48, 84, { size: 20, w: 600, col: rgba(P.hud, 0.75), ls: 2 }); }
function floorDisc(cx, cy, r) { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, 'rgba(150,80,40,0.35)'); g.addColorStop(1, 'rgba(150,80,40,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.3, 0, 0, 7); ctx.fill(); }
const label = (s, x, y, size = 20, col = P.hud) => text(ctx, s, x, y, { size, w: 700, col, align: 'center', ls: 1 });
function people() {
  bg('墨菲暖板 · 人物表', 'own-murphy-panel · 圆柱身 + 奶白球头 + 两点眼(低、靠近) · 帽子/围巾区分人 · 无腿,靠摇摆和跳表达');
  const kinds = [['园丁 · 毛线帽', { col: P.sage, hat: 'beanie', hatCol: P.mustard }], ['店员 · 围巾', { col: P.terra, scarf: P.mustard }], ['教授 · 礼帽', { col: P.slate, hat: 'fedora', hatCol: '#5A4A3A' }],
    ['姑娘 · 发髻', { col: P.rose, hat: 'bun', blush: 1 }], ['寿星 · 派对帽', { col: P.mustard, hat: 'party', hatCol: P.coral, blush: 1 }], ['邻居 · 光头', { col: P.olive }], ['老板 · 领结', { col: P.plum, bowtie: P.gold }], ['小孩', { col: P.clay, hat: 'beanie', hatCol: P.rose, h: 70, blush: 1 }]];
  kinds.forEach(([nm, o], i) => { const cx = 140 + i * 235, cy = 330; floorDisc(cx, cy, 80); cam(cx, cy, 0.66, { target: [0, 0, 0] }); peg(ctx, { x: 0, z: 0, h: 110, ...o, pose: i === 4 ? 'wave' : i === 2 ? 'think' : 'stand', t: 0.3 }); label(nm, cx, cy + 32); });
  text(ctx, '姿势 15 种(参数,不是帧):', 48, 412, { size: 22, w: 700, col: P.gold });
  POSE_NAMES.forEach((nm, i) => { const r = Math.floor(i / 8), cx = 130 + (i % 8) * 235, cy = 650 + r * 300; floorDisc(cx, cy, 60); cam(cx, cy, 0.56, { target: [0, 0, 0] }); peg(ctx, { x: 0, z: 0, h: 100, col: PALETTE[i % 8], hat: ['none', 'beanie', 'fedora', 'bun', 'party'][i % 5], hatCol: PALETTE[(i + 3) % 8], pose: nm, t: 0.3 }); label(nm, cx, cy + 32, 19); });
  window.TX = [];
}
function props() {
  bg('墨菲暖板 · 道具表', '木头主体 + 一种低饱和点缀色 + 一个发光细节(屏幕/火苗/发光字) · 全部是小立体,同一盏左上主光');
  const cells = [
    ['hexPlatform 六角台', (cx, cy) => { cam(cx, cy + 20, 0.36, { eye: [0, 600, 900] }); Pr.hexPlatform(ctx, 0, 0, 300, 40); }],
    ['squarePlatform 水磨石台', (cx, cy) => { cam(cx, cy + 20, 0.4, { eye: [0, 600, 900] }); Pr.squarePlatform(ctx, 0, 0, 420, 300, 30); }],
    ['roundTable 圆桌', (cx, cy) => { cam(cx, cy + 30, 0.47, { eye: [0, 260, 520] }); Pr.roundTable(ctx, 0, 0, 80, 50); Pr.cake(ctx, 0, 50, 0, 1, { t: 0.4 }); }],
    ['table 浅绿高脚桌', (cx, cy) => { cam(cx, cy + 20, 0.42, { eye: [80, 200, 520], target: [0, 50, 0] }); Pr.table(ctx, 0, 0, 120, 70, 110); Pr.toast; }],
    ['cake 生日蛋糕', (cx, cy) => { cam(cx, cy + 30, 0.69, { eye: [0, 120, 400], target: [0, 20, 0] }); Pr.cake(ctx, 0, 0, 0, 1, { candles: 6, t: 0.4 }); }],
    ['gift 礼物盒', (cx, cy) => { cam(cx, cy + 20, 0.63, { eye: [0, 120, 400], target: [0, 15, 0] }); Pr.gift(ctx, -22, 0, 0, 1, P.rose); Pr.gift(ctx, 24, 0, 10, 0.8, P.sage, { ry: 1 }); }],
    ['letterBlock 发光字块', (cx, cy) => { cam(cx, cy + 10, 0.42, { eye: [0, 250, 700], target: [0, 70, 0] }); Pr.letterBlock(ctx, -85, 0, 0, 150, '墨', { glow: 1, ry: 0.1 }); Pr.letterBlock(ctx, 85, 0, 0, 150, '菲', { glow: 0.35, ry: -0.1 }); }],
    ['gridBoard 格子板', (cx, cy) => { cam(cx, cy - 40, 0.36, { eye: [0, 260, 900], target: [0, 200, 0] }); Pr.gridBoard(ctx, 0, 40, 0, 400, 260, 12, 8, i => i % 7 === 2 ? P.gold : i === 40 ? P.red : null, { title: '一年 365 天' }); }],
    ['gaugeBar 竖量表', (cx, cy) => { cam(cx, cy - 10, 0.28, { eye: [0, 200, 900], target: [0, 200, 0] }); Pr.gaugeBar(ctx, -60, 0, 0, 40, 360, 0.5, { mark: 0.5 }); Pr.gaugeBar(ctx, 60, 0, 0, 40, 360, 0.82, { col: P.sage }); }],
    ['bookshelf 书架', (cx, cy) => { cam(cx, cy + 10, 0.45, { eye: [60, 200, 700], target: [0, 90, 0] }); Pr.bookshelf(ctx, 0, 0, 300, 180, 34); }],
    ['chair 椅子', (cx, cy) => { cam(cx, cy + 30, 0.5, { eye: [60, 120, 400], target: [0, 20, 0] }); Pr.chair(ctx, -30, 0, 1.2, { ry: 0.4 }); Pr.chair(ctx, 40, 0, 1.2, { ry: -0.6 }); }],
    ['balloon 气球', (cx, cy) => { cam(cx, cy + 60, 0.42, { eye: [0, 80, 420], target: [0, 40, 0] }); Pr.balloon(ctx, -30, 0, 0, 1.2, P.coral); Pr.balloon(ctx, 0, 0, -10, 1.4, P.mustard, 1); Pr.balloon(ctx, 30, 0, 0, 1.1, P.sage, 2); }],
    ['counter 收银台', (cx, cy) => { cam(cx, cy + 20, 0.48, { eye: [40, 200, 520], target: [0, 20, 0] }); Pr.counter(ctx, 0, 0, 200, 1.5); }],
    ['toast 吐司(墨菲)', (cx, cy) => { Pr.toast(ctx, cx - 70, cy, 1.4, 0); Pr.toast(ctx, cx + 70, cy, 1.4, 2.4); }],
    ['flagPost 号码旗', (cx, cy) => { cam(cx, cy + 50, 0.38, { eye: [0, 150, 520], target: [0, 60, 0] }); Pr.flagPost(ctx, -90, 0, 140, '1'); Pr.flagPost(ctx, 0, 0, 140, '2'); Pr.flagPost(ctx, 90, 0, 140, '3'); }],
    ['deskCalendar 台历', (cx, cy) => { cam(cx, cy + 40, 0.6, { eye: [0, 100, 420], target: [0, 25, 0] }); Pr.deskCalendar(ctx, -26, 0, 0, 1, '三月', '14'); Pr.deskCalendar(ctx, 26, 0, 0, 1, '三月', '14', { col: P.slate }); }],
    ['sconce 壁灯', (cx, cy) => { cam(cx, cy, 0.5, { eye: [0, 260, 600], target: [0, 260, -400] }); ctx.save(); ctx.beginPath(); ctx.rect(cx - 185, cy - 115, 370, 230); ctx.clip(); room(ctx, { wallZ: -400, sconces: [[-150, 280], [150, 280]] }); ctx.restore(); }],
    ['pairLine 配对金线', (cx, cy) => { const pts = Array.from({ length: 7 }, (_, i) => [cx + Math.cos(i / 7 * 6.28) * 130, cy + Math.sin(i / 7 * 6.28) * 70]); pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i) Pr.pairLine(ctx, a, b, (i + j) % 5 === 0 ? 0.6 : 1, { alpha: 0.6 }); })); pts.forEach(p => { ctx.fillStyle = P.head; ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, 7); ctx.fill(); }); }],
    ['checklist 检查单 HUD', (cx, cy) => { checklist(ctx, '生日悖论 · 检查单', [{ t: '直觉', state: 2 }, { t: '配对', state: 1 }, { t: '计算', state: 0 }], { x: cx - 120, y: cy - 70 }); }],
    ['ringGauge + ×倍数', (cx, cy) => { ringGauge(ctx, cx - 90, cy + 10, 52, 0.63, '', { inner: (x, y) => text(ctx, '63%', x, y + 3, { size: 30, w: 500, font: ITAL, col: P.gold, align: 'center' }) }); formula(ctx, [{ t: '高度' }, { t: '×4', k: 'red' }], cx + 80, cy + 10, { size: 30 }); }],
  ];
  cells.forEach(([nm, fn], i) => { const col = i % 5, row = Math.floor(i / 5); const x0 = col * 384, y0 = 110 + row * 242, cx = x0 + 192, cy = y0 + 105;
    ctx.save(); ctx.fillStyle = 'rgba(255,230,200,0.03)'; ctx.fillRect(x0 + 8, y0, 368, 232); ctx.beginPath(); ctx.rect(x0 + 8, y0, 368, 232); ctx.clip(); fn(cx, cy); ctx.restore();
    text(ctx, `${i + 1} · ${nm}`, x0 + 20, y0 + 216, { size: 18, w: 700, col: P.gold }); });
}
function strip() {
  bg('墨菲暖板 · 道具动画表', '机位不动,变的是"状态":落下、点亮、计数、连线、打勾、上涨 · 每行 5 帧');
  const rows = [
    ['M1 dropIn', '人/道具落下+一次回弹', k => { cam(0, 0, 1); }, (k, cx, cy) => { const d = M.dropIn(k * 0.6, 0.05, { h: 120 }); cam(cx, cy + 62, 0.36, { target: [0, 0, 0] }); if (d.a > 0) peg(ctx, { x: 0, y: d.dy, z: 0, h: 100, col: P.terra, hat: 'party', hatCol: P.coral, pose: { squash: d.squash } }); }],
    ['M2 blockLight', '字块闪两下后稳定发光', null, (k, cx, cy) => { cam(cx, cy + 20, 0.36, { eye: [0, 250, 700], target: [0, 70, 0] }); Pr.letterBlock(ctx, 0, 0, 0, 150, '墨', { glow: M.blockLight(k * 0.8, 0.05, 0.6) }); }],
    ['M3 countUp', '整数计数,每跳一下轻弹', null, (k, cx, cy) => { const c = M.countUp(k, 0, 1, 0, 253, q => q); ctx.save(); ctx.translate(cx, cy); ctx.scale(c.pop, c.pop); text(ctx, String(c.n), 0, 0, { size: 64, w: 500, font: ITAL, col: P.gold, align: 'center' }); ctx.restore(); text(ctx, '对', cx + 80, cy + 8, { size: 28, w: 900, col: P.capWhite }); }],
    ['M4 lineDraw', '金线一条接一条画出', null, (k, cx, cy) => { const pts = Array.from({ length: 6 }, (_, i) => [cx + Math.cos(i / 6 * 6.28) * 110, cy + Math.sin(i / 6 * 6.28) * 55]); let q = 0;
      pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i) Pr.pairLine(ctx, a, b, M.lineDraw(k, 0, 1, 15, q++, 0.2), { alpha: 0.7 }); })); pts.forEach(p => { ctx.fillStyle = P.head; ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, 7); ctx.fill(); }); }],
    ['M5 checkTick', '当前项高亮 → 打勾', null, (k, cx, cy) => { const s = M.checkTick(k, 0.2, 0.6); checklist(ctx, '检查单', [{ t: '直觉', state: 2 }, { t: '配对', state: s.state }], { x: cx - 90, y: cy - 50, pop: [1, s.k] }); }],
    ['M6 rise + M10 dip', '量表上涨;换场时灯暗下再亮', null, (k, cx, cy) => { cam(cx - 70, cy, 0.26, { eye: [0, 150, 900], target: [0, 150, 0] }); Pr.gaugeBar(ctx, 0, 0, 0, 70, 300, M.gaugeRise(k, 0, 0.8, 0.507), { mark: 0.5 });
      const d = M.lightsDip(k, 0.95, 0.3); ctx.fillStyle = `rgba(6,4,3,${0.75 * (1 - d)})`; ctx.fillRect(cx - 160, cy - 75, 320, 150); text(ctx, `${(50.7 * Math.min(1, k / 0.8)).toFixed(1)}%`, cx + 5, cy, { size: 30, w: 900, col: P.gold }); }],
  ];
  const rh = 158; rows.forEach(([nm, sub, , fn], r) => { const y0 = 112 + r * rh; text(ctx, nm, 40, y0 + 52, { size: 22, w: 900, col: P.gold }); text(ctx, sub, 40, y0 + 86, { size: 17, w: 600, col: P.hud });
    for (let f = 0; f < 5; f++) { const x0 = 300 + f * 324; ctx.save(); ctx.fillStyle = 'rgba(255,230,200,0.035)'; ctx.fillRect(x0, y0, 316, rh - 8); ctx.beginPath(); ctx.rect(x0, y0, 316, rh - 8); ctx.clip(); fn(f / 4, x0 + 158, y0 + (rh - 8) / 2); ctx.restore(); } });
}
window.render = (t) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); if (t < 1) people(); else if (t < 2) props(); else strip(); };
window.TEXTS = () => [];
document.fonts.load(`900 40px 'Noto Serif SC'`).then(() => document.fonts.load(`500 40px 'Noto Serif It'`)).then(() => document.fonts.ready).then(() => { window.READY = true; });

/** sheets — t=0 people, t=1.5 props 1–22, t=2.5 prop-animation patterns (filmstrips). Labels are part of the sheet. */
import { P, SERIF, BRUSH, paper, seal, splatter, rgba, roundRect, caption } from './look.js';
import { stick, sage, ox, POSES, blendPose } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
const SW = 1920, SH = 1080;
const bg = (night = false) => { ctx.save(); ctx.scale(SW / 1080, SH / 1920); paper(ctx, { night }); ctx.restore(); };
const label = (x, y, s, sub = '', night = false) => { ctx.save(); ctx.font = `600 22px ${SERIF}`; ctx.fillStyle = night ? P.cream : P.ink; ctx.textAlign = 'center'; ctx.fillText(s, x, y);
  if (sub) { ctx.font = `400 16px ${SERIF}`; ctx.fillStyle = night ? '#A9A291' : '#6F685A'; ctx.fillText(sub, x, y + 22); } ctx.restore(); };
const title = (s) => { ctx.save(); seal(ctx, 64, 52, 40, '道', { seed: 3 }); ctx.font = `700 32px ${SERIF}`; ctx.fillStyle = P.ink; ctx.textBaseline = 'middle'; ctx.fillText(s, 100, 54); ctx.restore(); };
function people() {
  bg(); title('道卷水墨 · 人物表 — 墨棍人（4550 原生：圆头 r=0.11H，四肢一笔圆头线 w=0.46r，无五官；好看靠姿势）');
  const poses = [['stand', '站'], ['hip', '叉腰递物 (4550 t3.5)'], ['akimbo', '双叉腰'], ['armsUp', '举双臂 (t64.5)'], ['walk', '走'], ['bow', '作揖/鞠躬'], ['slump', '泄气'], ['holdUp', '举刀端详']];
  poses.forEach(([p, n], i) => { const x = 80 + i * 150; stick(ctx, { x, y: 560, H: 330, pose: p, color: P.ink }); label(x, 600, p, n); });
  // night panel: cream cast
  ctx.save(); ctx.beginPath(); roundRect(ctx, 1240, 110, 640, 520, 8); ctx.clip(); ctx.translate(1240, 110); ctx.scale(640 / 1080, 520 / 1920 * 3.4); ctx.restore();
  ctx.save(); ctx.fillStyle = P.night; roundRect(ctx, 1250, 110, 630, 520, 6); ctx.fill(); ctx.restore();
  Pr.moon(ctx, 1790, 190, 34);
  [['chopUp', 1330], ['chopDown', 1480]].forEach(([p, x]) => { const J = stick(ctx, { x, y: 560, H: 300, pose: p, color: P.cream }); const a = J.fa[0] * Math.PI / 180; Pr.cleaver(ctx, J.hands[0][0], J.hands[0][1], 110, Math.atan2(Math.cos(a), Math.sin(a)), { night: true, blade: '#BDB6A6', edge: '#E9E3D3' }); label(x, 600, p, '', true); });
  sage(ctx, 1660, 560, 300, { color: P.cream }); label(1660, 600, 'sage 老者剪影', '束髻·长袖·杖', true);
  sage(ctx, 1800, 560, 240, { color: P.cream, seated: true, staff: false }); label(1800, 600, 'seated', '', true);
  // second row: sit / recline / boat / ox
  stick(ctx, { x: 150, y: 930, H: 300, pose: 'sit', color: P.ink }); ctx.fillStyle = P.ink; ctx.fillRect(90, 930, 140, 14); label(160, 975, 'sit', '坐（船/凳）');
  stick(ctx, { x: 360, y: 930, H: 300, pose: 'recline', color: P.ink }); label(360, 975, 'recline', '仰坐 (t74.5)');
  Pr.boat(ctx, 640, 960, 240); stick(ctx, { x: 640, y: 935, H: 200, pose: 'sit', color: P.ink }); label(640, 1030, 'boat + sit', '小舟 (t84.5)');
  ox(ctx, 950, 960, 330, { color: P.ink }); label(950, 1000, 'ox 牛', '主角道具·可分四段');
  ox(ctx, 1320, 960, 330, { color: P.ink, split: 1 }); label(1320, 1000, 'ox split=1', '如土委地');
  ctx.save(); ctx.font = `400 18px ${SERIF}`; ctx.fillStyle = '#5A5448'; const L = ['规则：一个世界只有一种人；', '纸面=墨色人，夜色=米白人；', '永远别画直杆手臂——肘、膝都要弯；', '人只占画面 1/4–1/3 高，留白比人重要；', '情绪 = 躯干倾角 + 低/仰头 + 手放哪。'];
  L.forEach((s, i) => ctx.fillText(s, 1520, 760 + i * 32)); ctx.restore();
}
function props(t) {
  bg(); title('道卷水墨 · 道具表 1–22（纯代码 · 平涂墨/淡彩 + 一点朱红）');
  const cell = (i) => [170 + (i % 6) * 316, 230 + Math.floor(i / 6) * 222];
  const items = [
    ['brushChar 大字', (x, y) => Pr.brushChar(ctx, '道', x, y - 20, 150, { seed: 4, splat: 0.8 })],
    ['seal 印', (x, y) => { seal(ctx, x - 50, y - 20, 80, '庄', { font: BRUSH, weight: 400 }); seal(ctx, x + 50, y - 20, 80, '知行', { seed: 6 }); }],
    ['splatter 墨点', (x, y) => splatter(ctx, x, y - 25, 55, { seed: 7, n: 30 })],
    ['inkMountains 远山', (x, y) => Pr.inkMountains(ctx, x - 140, x + 140, y + 20, 110, { seed: 3 })],
    ['pine 松', (x, y) => { Pr.pine(ctx, x - 40, y + 40, 200, { seed: 2 }); Pr.pine(ctx, x + 50, y + 40, 150, { seed: 5 }); }],
    ['crookedTree 歪树', (x, y) => Pr.crookedTree(ctx, x, y + 50, 190, { seed: 3 })],
    ['redSun 红日', (x, y) => Pr.redSun(ctx, x, y - 20, 45)],
    ['water 水纹+倒影', (x, y) => { ctx.save(); ctx.beginPath(); ctx.rect(x - 140, y - 70, 280, 130); ctx.clip(); ctx.translate(x - 140 - 0, 0); ctx.scale(280 / 1080, 1); Pr.water(ctx, y - 70, y + 60, 0, { sunX: 540 }); ctx.restore(); }],
    ['glassCup 浑→清', (x, y) => { Pr.glassCup(ctx, x - 60, y + 60, 150, { murk: 1, stick: 1 }); Pr.glassCup(ctx, x + 70, y + 60, 150, { murk: 0 }); }],
    ['cleaver 庖丁刀', (x, y) => Pr.cleaver(ctx, x - 60, y - 30, 190, 0.05, { gleam: 0.55 })],
    ['ox 牛+缝', (x, y) => { const O = ox(ctx, x, y + 50, 240); O.gaps.forEach(g => Pr.dashedPath(ctx, g, 1, { w: 3, dash: [8, 6] })); }],
    ['block 砧板+刀痕', (x, y) => Pr.block(ctx, x, y + 50, 160, { night: false, tall: 0.6, marks: 5 })],
    ['chips 碎屑火星', (x, y) => { ctx.fillStyle = P.night; ctx.fillRect(x - 140, y - 80, 280, 150); Pr.chips(ctx, x, y + 40, 0.3, { seed: 3 }); }],
    ['stump 树桩', (x, y) => { Pr.stump(ctx, x - 60, y + 40, 50); Pr.stump(ctx, x, y + 40, 60); Pr.stump(ctx, x + 60, y + 40, 44); }],
    ['boat 小舟', (x, y) => Pr.boat(ctx, x, y, 240)],
    ['yinYang 太极', (x, y) => Pr.yinYang(ctx, x, y - 20, 70)],
    ['redDigits 红数码', (x, y) => { ctx.fillStyle = P.night; ctx.fillRect(x - 140, y - 80, 280, 150); Pr.redDigits(ctx, '04:59', x, y - 10, 80); }],
    ['vertColumn 竖排', (x, y) => Pr.vertColumn(ctx, ['一天', '一年', '十年'], x, y - 70, 34)],
    ['dashedPath 红虚线', (x, y) => { const r = Pr.dashedPath(ctx, [[x - 120, y + 30], [x - 40, y - 50], [x + 40, y + 20], [x + 120, y - 40]], 0.8); ctx.fillStyle = P.red; ctx.beginPath(); ctx.arc(r.pt[0], r.pt[1], 8, 0, 7); ctx.fill(); }],
    ['moon 月 / sheep 羊', (x, y) => { ctx.fillStyle = P.night; ctx.fillRect(x - 140, y - 80, 280, 150); Pr.moon(ctx, x - 70, y - 20, 30); Pr.sheep(ctx, x + 40, y + 20, 40); Pr.sheep(ctx, x + 100, y + 10, 30, { hop: 1 }); }],
    ['ruler 尺 / sand 沙', (x, y) => { Pr.ruler(ctx, x - 60, y + 50, 140); ctx.fillStyle = P.night; ctx.fillRect(x, y - 80, 140, 150); Pr.sandStream(ctx, x + 70, y - 60, 120, 0.3); }],
    ['inkBloom 晕染 / reeds 苇', (x, y) => { Pr.inkBloom(ctx, x - 60, y - 10, 55, 1, { seed: 3 }); Pr.reeds(ctx, x + 80, y + 50, 110); }],
  ];
  items.forEach(([n, f], i) => { const [x, y] = cell(i); ctx.save(); f(x, y); ctx.restore(); label(x, y + 100, `${i + 1}. ${n}`); });
}
function frame(x, y, w, h, draw, night = false) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.fillStyle = night ? P.night : '#E9E3D4'; ctx.fillRect(x, y, w, h); ctx.translate(x, y); draw(w, h); ctx.restore();
  ctx.save(); ctx.strokeStyle = rgba(P.ink, 0.35); ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h); ctx.restore(); }
function patterns() {
  bg(); title('道卷水墨 · 道具动画表（每行 4 帧 = 同一动作的 0 / 1/3 / 2/3 / 1）');
  const rows = [
    ['M1 inkBloom 晕染转场', true, (k, w, h) => { Pr.inkBloom(ctx, w / 2, h / 2, w * 0.75 * Math.pow(k, 1.7) + 1, 1, { seed: 7, color: '#E4DDCD' }); }],
    ['M2 brushWrite 写字', false, (k, w, h) => Pr.brushChar(ctx, '道', w / 2, h / 2, 140, { k, seed: 4, splat: 0.6 })],
    ['M3 sealStamp 盖印', false, (k, w, h) => M.sealStamp(ctx, w / 2, h / 2, 90, '庄', k, { font: BRUSH, weight: 400 })],
    ['M5 settle 澄清', false, (k, w, h) => Pr.glassCup(ctx, w / 2, h - 10, 160, { murk: 1 - k, stick: k < 0.3 ? 1 : 0, t: k * 3 })],
    ['M6 pathFollow 顺缝走刀', false, (k, w, h) => { const O = ox(ctx, w / 2 - 6, h - 30, 140); const r = Pr.dashedPath(ctx, O.gaps[1], k, { w: 4, dash: [9, 6] }); if (k > 0) Pr.cleaver(ctx, r.pt[0] + 6, r.pt[1], 50, r.ang - Math.PI / 2 + 0.2); }],
    ['M7 poseBlend 劈（举→落）', true, (k, w, h) => { const J = stick(ctx, { x: w * 0.38, y: h - 14, H: 150, pose: blendPose('chopUp', 'chopDown', M.ease.in(k)), color: P.cream }); const a = J.fa[0] * Math.PI / 180; Pr.cleaver(ctx, J.hands[0][0], J.hands[0][1], 60, Math.atan2(Math.cos(a), Math.sin(a)), { night: true, blade: '#BDB6A6' }); Pr.block(ctx, w * 0.72, h - 14, 70, { tall: 0.8 }); if (k === 1) Pr.chips(ctx, w * 0.68, h - 70, 0.25, { n: 10 }); }],
    ['M8 counterFlip 计数', true, (k, w, h) => { const n = 1 + Math.round(k * 2); Pr.redDigits(ctx, '0' + n, w / 2, h / 2, 90); }],
    ['M11 gleam 刀光', false, (k, w, h) => { Pr.cleaver(ctx, w * 0.2, h * 0.4, 170, 0.08, { gleam: k * 0.9 + 0.05 }); }],
  ];
  const fw = 176, fh = 190;
  rows.forEach(([n, night, f], r) => { const col = r % 2, row = Math.floor(r / 2); const x0 = 40 + col * 950, y0 = 120 + row * 238;
    label(x0 + 80, y0 + fh / 2 - 6, n.split(' ')[0], n.split(' ').slice(1).join(' '));
    [0, 1 / 3, 2 / 3, 1].forEach((k, i) => frame(x0 + 170 + i * (fw + 10), y0, fw, fh, (w, h) => f(k, w, h), night)); });
}
window.render = (t) => { ctx.setTransform(1, 0, 0, 1, 0, 0); if (t < 1) people(); else if (t < 2) props(t); else patterns(); };
Promise.all([document.fonts.load(`400 80px ${BRUSH}`), document.fonts.load(`800 60px ${SERIF}`)]).then(() => document.fonts.ready).then(() => { window.render(0); window.READY = true; });

// Reference sheets for other AIs: t=0 people/poses sheet, t=1 prop sheet (15 props), t=2 motion strip.
import { P, paintVoid, stateChip } from './look.js';
import { bust, figure, tinyFigure, crowd } from './people.js';
import * as Pr from './props.js';
import { POSES } from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
function label(t, x, y) { ctx.save(); ctx.font = '500 24px "Noto Serif SC", serif'; ctx.fillStyle = '#CFC6B2'; ctx.textAlign = 'center'; ctx.fillText(t, x, y); ctx.restore(); }
function people() {
  paintVoid(ctx, 1920, 1080, { warm: 0.3 });
  label('人物表 · 侧身半身像（主角）— 五种姿态 = 五种情绪', 960, 50);
  const names = { neutral: '平静', hopeful: '期待', enchanted: '着迷', doubt: '怀疑', ashamed: '难堪' };
  Object.keys(POSES).forEach((k, i) => {
    const x = 210 + i * 375;
    bust(ctx, { x, y: 520, s: 0.62, facing: -1, hair: i % 2 ? 'short' : 'bun', fill: i === 2 ? 'foil' : 'void', pose: POSES[k], eye: i === 2 ? 'closed' : i >= 3 ? 'down' : 'open' });
    label(names[k] + ' ' + k, x, 570);
  });
  label('群众/旁观者 · 正面线描（真比例：头 = 身高 1/7.6）', 960, 640);
  figure(ctx, 200, 1040, 380, {});
  figure(ctx, 380, 1040, 380, { pose: { drop: 0.9, tilt: -0.15 } });
  label('站立 / 泄气', 290, 1070);
  crowd(ctx, { x0: 520, x1: 1380, baseY: 840, rows: 2, seed: 4, scale: 0.55 });
  label('人群：后排更暗更小，前排遮挡后排', 950, 1070);
  [0, 0.4, 1].forEach((a, i) => tinyFigure(ctx, 1520 + i * 120, 1000, 110, { pose: { arms: a * 2.2, lean: i - 1 } }));
  label('小图解人（≤120px，只进图表）', 1640, 1070);
}
function props(t) {
  paintVoid(ctx, 1920, 1080, { warm: 0.25 });
  label('道具表 1/2 · 1–15（细线 + 一个光源事件）', 960, 46);
  const cell = (i) => [190 + (i % 5) * 385, 230 + Math.floor(i / 5) * 330];
  const L = [];
  let [x, y] = cell(0); Pr.haloRing(ctx, x, y, 95, { t: 2, k: 1 }); L.push('1 光环');
  [x, y] = cell(1); Pr.goldDust(ctx, { x, y, w: 300, h: 220, n: 80, t: 2 }); L.push('2 金尘');
  [x, y] = cell(2); Pr.beam(ctx, x, y - 150, y + 120, 70, 220, { alpha: 0.3 }); Pr.floor(ctx, y + 120, { x, pool: 160 }); L.push('3 顶光束 + 4 地平线');
  [x, y] = cell(3); Pr.cloche(ctx, x, y + 110, 150); Pr.treasure(ctx, x, y + 100, 90, { kind: 'ring' }); L.push('5 玻璃罩 + 7 珍藏物');
  [x, y] = cell(4); Pr.pedestal(ctx, x, y - 40, 180, 190); Pr.treasure(ctx, x, y - 48, 70, { kind: 'cup' }); L.push('6 展台 + 7 杯');
  [x, y] = cell(5); Pr.archiveScreen(ctx, x - 150, y - 120, 300, 200, { t: 2, draw: (c, ix, iy, iw, ih) => figure(c, ix + iw / 2, iy + ih, ih * 0.8, { line: 'rgba(230,230,230,.8)' }) }); L.push('8 档案屏');
  [x, y] = cell(6); Pr.crystalColumn(ctx, x, y - 140, y + 120, 90, { t: 3 }); L.push('9 冰晶柱');
  [x, y] = cell(7); Pr.labelTag(ctx, x, y - 50, '靠谱', { anchor: [x - 140, y + 60] }); Pr.labelTag(ctx, x + 40, y + 30, '聪明'); L.push('10 标签（带牵线）');
  [x, y] = cell(8); Pr.bars3d(ctx, x - 140, y + 100, [80, 120, 170, 90], { bw: 50, gap: 20, expect: [100, 150, 210, 230], hot: 2 }); L.push('11 立体柱 + 期望线');
  [x, y] = cell(9); Pr.clock(ctx, x, y, 95, { t: 2 }); L.push('12 金钟');
  [x, y] = cell(10); Pr.bubble(ctx, x - 40, y - 50, 220, 64, { text: '在吗？' }); Pr.bubble(ctx, x + 40, y + 40, 150, 56, { typing: true, t: 1, side: 'right', gold: true }); L.push('13 对话泡');
  [x, y] = cell(11); Pr.frameStack(ctx, x - 30, y, 180, 130, 8); L.push('14 重复卡片叠');
  [x, y] = cell(12); Pr.counter(ctx, x, y, 25, { size: 100, suffix: ' 次' }); L.push('15 计数器');
  [x, y] = cell(13); stateChip(ctx, x - 90, y - 40, 'anticipation', '期待'); stateChip(ctx, x - 90, y, 'peak', '顶点'); stateChip(ctx, x - 90, y + 40, 'risk', '风险'); L.push('+ 状态签（我们加的）');
  [x, y] = cell(14); bust(ctx, { x, y: y + 140, s: 0.5, facing: -1, hair: 'bun', fill: 'foil' }); L.push('材质：金箔');
  L.forEach((s, i) => { const [a, b] = cell(i); label(s, a, b + 150); });
}
function props2(t) {
  paintVoid(ctx, 1920, 1080, { warm: 0.25 });
  label('道具表 2/2 · 16–19 + 每件的状态变化（左=前，右=后）', 960, 46);
  const row = (i) => 250 + i * 0; const L = [];
  const C = [[300, 330], [780, 330], [1260, 330], [1700, 330]];
  // 16 balance: level -> tipped
  Pr.balance(ctx, 175, 230, 150, { tilt: 0 }); Pr.balance(ctx, 430, 230, 150, { tilt: 0.7 }); L.push([300, '16 天平：平 → 倾斜']);
  Pr.drop(ctx, 700, 330, 38, { k: 0.15, t: 1 }); Pr.drop(ctx, 860, 330, 38, { k: 1, t: 1 }); L.push([780, '17 光滴：空 → 满']);
  Pr.door(ctx, 1150, 420, 90, 180, { k: 0 }); Pr.door(ctx, 1290, 420, 90, 180, { k: 0.85 }); L.push([1260, '18 门：关 → 开']);
  Pr.brain(ctx, 1620, 320, 0.5, { k: 0.05 }); Pr.brain(ctx, 1800, 320, 0.5, { k: 1, t: 1 }); L.push([1710, '19 大脑：暗 → 某区亮']);
  L.forEach(([x, s]) => label(s, x, 500));
  // state-change grammar row: same object, value = light
  label('状态变化语法：同一件东西，被高估 = 变亮变金；被冷落 = 退成灰线', 960, 600);
  [[0, '普通'], [0.5, '在意'], [1, '珍宝']].forEach(([k, s], i) => { const x = 560 + i * 400; Pr.pedestal(ctx, x, 820, 150, 120); Pr.treasure(ctx, x, 812, 60, { kind: 'cup', k }); if (k > 0.9) Pr.haloRing(ctx, x, 770, 70, { t: 1, k: 1, ticks: 90 }); label(s, x, 990); });
}
function render(t) { ctx.setTransform(1, 0, 0, 1, 0, 0); if (t < 1) people(); else if (t < 2) props(t); else props2(t); }
window.render = render; window.TEXTS = () => [];
document.fonts.ready.then(() => { render(0); window.READY = true; });

// Reference sheets: t=0 people, t=1.5 props 1–7, t=2.5 props 8–14 + cascade
import { P, paintVoid, stateChip, horizon } from './look.js';
import { peg, pegTiny, pegCrowd, particleSilhouette } from './people.js';
import * as Pr from './props.js';
import { POSES } from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
function label(t, x, y) { ctx.save(); ctx.font = '500 22px "Noto Serif SC", serif'; ctx.fillStyle = '#C8BFD8'; ctx.textAlign = 'center'; ctx.fillText(t, x, y); ctx.restore(); }
function people() {
  paintVoid(ctx, 1920, 1080, { warm: 0.35 });
  label('人物表 · 棋子剪影（7098）四种姿态 + 粒子人（9472）', 960, 48);
  const names = { neutral: '平静', curious: '好奇', stuck: '卡住', flash: '顿悟' };
  Object.keys(POSES).forEach((k, i) => {
    const x = 220 + i * 280;
    peg(ctx, { x, y: 420, s: 1.15, facing: 1, pose: POSES[k], color: k === 'flash' ? P.magenta : P.neon, point: k === 'curious' ? 1 : 0 });
    label(names[k] + ' ' + k, x, 470);
  });
  particleSilhouette(ctx, { x: 1400, y: 480, s: 1.5, hair: 'bun', bio: 'both', color: P.cyan, seed: 3, pose: POSES.flash });
  label('粒子人 · 体内生物光', 1400, 520);
  particleSilhouette(ctx, { x: 1680, y: 480, s: 1.35, hair: 'bun', bio: null, color: P.mute, seed: 5, pose: POSES.stuck });
  label('冷粒子（旁观）', 1680, 520);
  label('人群网格：多数暗，少数品红亮起 = 被看见的信息', 960, 600);
  pegCrowd(ctx, { x: 960, y: 720, cols: 12, rows: 4, gapX: 70, gapY: 50, s: 0.4, lit: [7, 18, 25], litColor: P.magenta });
  label('BAN：不画圆点眼睛和笑脸弧；情绪靠姿态和哪条线亮', 960, 1020);
}
function props1() {
  paintVoid(ctx, 1920, 1080, { warm: 0.3 });
  label('道具表 1/2 · 1–7（自发光细线 · 一个光源事件）', 960, 46);
  const cell = (i) => [200 + (i % 4) * 440, 260 + Math.floor(i / 4) * 380];
  let [x, y] = cell(0); horizon(ctx, y + 40, { w: 360, glow: 1 }); Pr.monitor(ctx, { x, y: y + 20, w: 260, h: 150, k: 1, cc: true, wave: 1, t: 1, inner: true }); label('1 霓虹显示器', x, y + 160);
  [x, y] = cell(1); Pr.numberScale(ctx, { x0: x - 160, x1: x + 160, y, k: 1, hot: 0.5, ticks: [0, 50, 100] }); label('2 数轴', x, y + 80);
  [x, y] = cell(2); Pr.orbMark(ctx, { x, y, s: 0.7, k: 1, pulse: 1 }); label('3 光球问号', x, y + 100);
  [x, y] = cell(3); Pr.circlePyramid(ctx, { x, y: y - 40, r: 18, gap: 8, k: 1, lit: [0, 3] }); label('4 圆点金字塔', x, y + 140);
  [x, y] = cell(4); Pr.dice(ctx, { x: x - 50, y, s: 28, pip: 1 }); Pr.dice(ctx, { x: x + 50, y, s: 28, pip: 5 }); label('5 骰子', x, y + 80);
  [x, y] = cell(5); Pr.probWheel(ctx, { x, y, R: 110, k: 1, spokes: 10 }); label('6 概率轮', x, y + 140);
  [x, y] = cell(6); Pr.probTree(ctx, { x, y: y + 60, k: 1, depth: 3, len: 70 }); label('7 概率树', x, y + 140);
  [x, y] = cell(7); stateChip(ctx, x - 70, y - 40, 'stuck', '卡住'); stateChip(ctx, x - 70, y, 'probe', '试探'); stateChip(ctx, x - 70, y + 40, 'flash', '顿悟'); stateChip(ctx, x - 70, y + 80, 'linked', '连上'); label('+ 状态签（我们加的）', x, y + 140);
}
function props2() {
  paintVoid(ctx, 1920, 1080, { warm: 0.3 });
  label('道具表 2/2 · 8–14 + 顿悟级联（我们的改进）', 960, 46);
  const cell = (i) => [220 + (i % 4) * 440, 280 + Math.floor(i / 4) * 360];
  let [x, y] = cell(0); Pr.dnaHelix(ctx, { x, y, h: 180, k: 1, t: 1 }); label('8 DNA 双螺旋', x, y + 130);
  [x, y] = cell(1); Pr.graphArc(ctx, { x0: x - 150, y0: y + 80, w: 300, h: 140, k: 1 }); label('9 曲线图', x, y + 120);
  [x, y] = cell(2); Pr.paperCard(ctx, { x, y, w: 160, h: 200, k: 1, title: '记录', lines: ['试 1', '试 2'] }); label('10 纸卡', x, y + 140);
  [x, y] = cell(3); Pr.droplet(ctx, { x, y, s: 1.2, k: 1 }); label('11 基因液滴', x, y + 100);
  [x, y] = cell(4); Pr.wordChip(ctx, { x: x - 70, y, text: '听', k: 1 }); Pr.wordChip(ctx, { x: x + 40, y, text: '懂', k: 1, color: P.magenta }); label('12 词框', x, y + 60);
  [x, y] = cell(5); Pr.needleBoard(ctx, { x0: x - 150, y0: y - 60, w: 300, h: 160, k: 1, lines: 5, needles: [{ x: x - 40, y: y + 20, a: 0.4, L: 40, hit: false }, { x: x + 50, y: y + 40, a: -0.2, L: 40, hit: true }] }); label('13 投针板', x, y + 140);
  [x, y] = cell(6);
  const nodes = [{ x: x - 80, y: y - 40, r: 10, label: 'A' }, { x: x + 20, y: y - 10, r: 10, label: 'B' }, { x: x + 80, y: y + 50, r: 12, label: '通', hot: true }];
  Pr.linkCascade(ctx, { nodes, edges: [[0, 1], [1, 2]], k: 0 }); label('14 级联 · 前', x, y + 120);
  [x, y] = cell(7);
  const nodes2 = [{ x: x - 80, y: y - 40, r: 10, label: 'A' }, { x: x + 20, y: y - 10, r: 10, label: 'B' }, { x: x + 80, y: y + 50, r: 12, label: '通', hot: true }];
  Pr.linkCascade(ctx, { nodes: nodes2, edges: [[0, 1], [1, 2]], k: 1 }); label('14 级联 · 后（顿悟）', x, y + 120);
}
function render(t) { ctx.setTransform(1, 0, 0, 1, 0, 0); if (t < 1) people(); else if (t < 2) props1(); else props2(); }
window.render = render; window.TEXTS = () => [];
document.fonts.ready.then(() => { render(0); window.READY = true; });

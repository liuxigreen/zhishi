// Reference sheets: t=0 people, t=1.5 props 1–8, t=2.5 props 9–17
import { P, paintVoid, statusChip } from './look.js';
import { stick, stickTiny, stairCrowd, POSES } from './people.js';
import * as Pr from './props.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
function label(t, x, y) {
  ctx.save(); ctx.font = '500 20px "Noto Serif SC", serif';
  ctx.fillStyle = '#C8A0A0'; ctx.textAlign = 'center'; ctx.fillText(t, x, y); ctx.restore();
}
function people() {
  paintVoid(ctx, 1920, 1080, { redWash: 0.35, grain: 0.4 });
  label('人物表 · 数据身体跑步人（红皇后 t0:04 比例）六种姿态', 960, 48);
  const names = { sprint: '冲刺', lean: '前倾', stand: '站定', lookUp: '仰望', sit: '坐下', fork: '分叉离开' };
  Object.keys(names).forEach((k, i) => {
    const x = 160 + i * 290;
    stick(ctx, { x, y: 420, s: 1.15, color: k === 'fork' ? P.hud : P.red, pose: POSES[k] });
    label(names[k] + ' · ' + k, x, 470);
  });
  // stair hierarchy
  Pr.credentialStairs(ctx, { x: 420, y: 900, n: 6, stepW: 70, stepH: 28, k: 1, tags: ['学历','证书','实习','加班','绩点','考研'] });
  stairCrowd(ctx, { x: 450, y: 870, n: 6, gap: 70, rise: 28, s: 0.5, lit: 2 });
  label('楼梯：多数白，一位红（层级一眼可读）', 700, 960);
  stick(ctx, { x: 1500, y: 820, s: 1.0, color: P.red, pose: POSES.sprint });
  Pr.zeroMarker(ctx, { x: 1500, y0: 560, y1: 820, k: 1 });
  label('冲刺 + x=0 标尺', 1500, 880);
  label('BAN：不画圆点眼睛和笑脸弧；情绪靠姿态 + 接触道具', 960, 1020);
}
function props1() {
  paintVoid(ctx, 1920, 1080, { redWash: 0.3, grain: 0.35 });
  label('道具表 1/2 · 1–8（竞赛 / 陷阱器械）', 960, 46);
  const cell = (i) => [240 + (i % 4) * 440, 260 + Math.floor(i / 4) * 400];
  let [x, y] = cell(0);
  Pr.treadmillFloor(ctx, { y: y + 80, vanishY: y - 80, rows: 6, cols: 8, k: 1 });
  label('1 棋盘跑道', x, y + 160);
  [x, y] = cell(1);
  Pr.hudTelemetry(ctx, { x: x - 80, y: y - 40, k: 1, speed: 36.5, disp: 0, hr: 191 });
  label('2 HUD 遥测', x, y + 140);
  [x, y] = cell(2);
  Pr.ovalTrack(ctx, { x, y, rx: 140, ry: 60, k: 1 });
  Pr.racePair(ctx, { x, y, rx: 140, ry: 60, k: 1, a1: -0.5, a2: 0.2 });
  label('3–4 椭圆赛道 + 双点', x, y + 100);
  [x, y] = cell(3);
  Pr.relativeGapLock(ctx, { x, y: y - 20, k: 1, breathe: 1.05 });
  label('5 差距锁（我们的）', x, y + 120);
  [x, y] = cell(4);
  Pr.speciesNet(ctx, { x, y, k: 1 });
  label('6 物种星座网', x, y + 160);
  [x, y] = cell(5);
  Pr.credentialStairs(ctx, { x: x - 120, y: y + 80, n: 5, stepW: 50, stepH: 24, k: 1 });
  label('7 学历楼梯', x, y + 140);
  [x, y] = cell(6);
  Pr.stageSpot(ctx, { x, y: y + 40, k: 1 });
  stickTiny(ctx, { x, y: y + 26, s: 0.7, color: P.white, glow: 0.9 });
  label('8 舞台聚光', x, y + 120);
  [x, y] = cell(7);
  statusChip(ctx, x - 40, y, 'lock', '锁死');
  statusChip(ctx, x - 40, y + 40, 'trap', '原地');
  statusChip(ctx, x - 40, y + 80, 'fork', '分叉');
  label('状态签', x, y + 140);
}
function props2() {
  paintVoid(ctx, 1920, 1080, { redWash: 0.25, grain: 0.35 });
  label('道具表 2/2 · 9–17（化石 / 熵增 / 分叉出口）', 960, 46);
  const cell = (i) => [240 + (i % 4) * 440, 280 + Math.floor(i / 4) * 380];
  let [x, y] = cell(0);
  Pr.fossilBranch(ctx, { x, y: y + 60, k: 1, label: '99% 已灭绝' });
  label('9 化石分枝', x, y + 160);
  [x, y] = cell(1);
  Pr.gauseTube(ctx, { x, y, s: 1.1, k: 1 });
  label('10 Gause 试管', x, y + 140);
  [x, y] = cell(2);
  Pr.titleGlyph(ctx, { x, y, k: 1, text: '原地' });
  label('11 标题大字', x, y + 120);
  [x, y] = cell(3);
  Pr.ovalTrack(ctx, { x: x - 60, y, rx: 100, ry: 45, k: 1 });
  Pr.directionFork(ctx, { x0: x - 20, y0: y, x1: x + 140, y1: y - 80, k: 1, label: '你的跑道' });
  label('12 方向分叉（我们的）', x, y + 120);
  [x, y] = cell(4);
  Pr.dustRoom(ctx, { wx: x, wy: y - 80, k: 1 });
  label('13 落灰房间（0762）', x, y + 160);
  [x, y] = cell(5);
  Pr.orderSphere(ctx, { x, y, r: 90, k: 1 });
  label('14 秩序球体', x, y + 130);
  [x, y] = cell(6);
  Pr.workSpark(ctx, { x, y, k: 1 });
  label('15 做功火花', x, y + 80);
  [x, y] = cell(7);
  Pr.starExit(ctx, { k: 1 });
  stick(ctx, { x, y: y + 40, s: 0.8, color: P.hud, pose: POSES.lookUp });
  label('16–17 星空出口 + 仰望', x, y + 140);
}
function render(t) {
  if (t < 1.0) people();
  else if (t < 2.0) props1();
  else props2();
}
window.render = render;
window.TEXTS = () => [];
document.fonts.ready.then(() => { render(0); window.READY = true; });

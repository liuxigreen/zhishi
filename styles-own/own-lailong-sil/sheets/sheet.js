// Reference sheets: t=0 people, t=1.5 props 1–7, t=2.5 props 8–14 + absent
import { P, paintVoid, signalChip, moon, ground } from './look.js';
import { puppet, courtRow, horseRider, puppetTiny } from './people.js';
import * as Pr from './props.js';
import { POSES } from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
function label(t, x, y) {
  ctx.save(); ctx.font = '500 22px "Noto Serif SC", serif';
  ctx.fillStyle = '#C8B8A0'; ctx.textAlign = 'center'; ctx.fillText(t, x, y); ctx.restore();
}
function people() {
  paintVoid(ctx, 1920, 1080, { warm: 0.55, stars: 0.4 });
  label('人物表 · 纸偶剪影（赵云/玄奘/玉玺）五种姿态 + 骑手', 960, 48);
  const names = { neutral: '平静', look: '注视', offer: '献物', bow: '躬身', alarm: '告急', absent: '缺席感' };
  ['neutral', 'look', 'offer', 'bow', 'alarm', 'absent'].forEach((k, i) => {
    const x = 160 + i * 280;
    puppet(ctx, { x, y: 420, s: 1.2, hat: i < 2 ? 'mian' : i === 2 ? 'monk' : i === 3 ? 'soldier' : 'common', facing: 1, pose: POSES[k], fill: 'cream' });
    label(names[k] + ' · ' + k, x, 470);
  });
  horseRider(ctx, { x: 1400, y: 780, s: 1.1, facing: 1, hat: 'soldier' });
  label('骑手剪影（长坂/传令）', 1400, 860);
  courtRow(ctx, { x: 500, y: 780, n: 6, gap: 70, s: 0.5, hat: 'mian', lit: 2 });
  label('朝列：多数暗，一位被灯点亮', 500, 860);
  label('BAN：不画圆点眼睛和笑脸弧；情绪靠姿态 + 手接触道具', 960, 1020);
}
function props1() {
  paintVoid(ctx, 1920, 1080, { warm: 0.5, stars: 0.3 });
  label('道具表 1/2 · 1–7（制度器物 · 一个光源事件）', 960, 46);
  const cell = (i) => [220 + (i % 4) * 440, 280 + Math.floor(i / 4) * 380];
  let [x, y] = cell(0); Pr.beaconTower(ctx, { x, y: y + 80, s: 0.9, k: 1, lit: true, t: 1, label: '' }); label('1 烽火台', x, y + 160);
  [x, y] = cell(1); Pr.torchFire(ctx, { x, y, s: 1.3, k: 1, t: 1 }); label('2 火把', x, y + 100);
  [x, y] = cell(2); Pr.smokePlume(ctx, { x, y: y + 40, s: 1.2, k: 1, rise: -10 }); label('3 昼烟土筒', x, y + 120);
  [x, y] = cell(3); Pr.topoMap(ctx, { x, y, w: 320, h: 200, k: 1 }); label('4 浮雕地形', x, y + 130);
  [x, y] = cell(4);
  Pr.peacePath(ctx, { pts: [{ x: x - 120, y: y + 40 }, { x: x - 40, y: y - 20 }, { x: x + 60, y: y }, { x: x + 130, y: y - 40 }], k: 1, nodes: [{ x: x - 120, y: y + 40, r: 6 }, { x: x + 130, y: y - 40, r: 8, empty: true, label: '长安' }] });
  label('5 平安火路径', x, y + 120);
  [x, y] = cell(5); Pr.imperialSeal(ctx, { x, y, s: 1.3, k: 1, glyph: '玺' }); label('6 传国玉玺', x, y + 100);
  [x, y] = cell(6); Pr.nightDrum(ctx, { x, y, s: 1.1, k: 1, pulse: 1.05 }); label('7 宵禁鼓', x, y + 120);
  [x, y] = cell(7);
  signalChip(ctx, x - 60, y - 40, 'peace', '平安');
  signalChip(ctx, x - 60, y, 'alarm', '告警');
  signalChip(ctx, x - 60, y + 40, 'absent', '缺席');
  label('+ 信号签（我们加的）', x, y + 120);
}
function props2() {
  paintVoid(ctx, 1920, 1080, { warm: 0.5, stars: 0.25 });
  label('道具表 2/2 · 8–14 + 缺席信号（我们的改进）', 960, 46);
  const cell = (i) => [240 + (i % 4) * 440, 300 + Math.floor(i / 4) * 360];
  let [x, y] = cell(0); Pr.horseProp(ctx, { x, y, s: 1.1 }); label('8 传令马', x, y + 100);
  [x, y] = cell(1); Pr.scrollBook(ctx, { x, y, s: 1.1, k: 1, title: '出师表', mark: 'red' }); label('9 书卷对读', x, y + 120);
  [x, y] = cell(2); Pr.courtLamp(ctx, { x, y: y + 80, s: 1.2, k: 1, breathe: 1 }); label('10 庭灯', x, y + 140);
  [x, y] = cell(3); Pr.redLantern(ctx, { x, y, s: 1.2, k: 1 }); label('11 红灯笼', x, y + 120);
  [x, y] = cell(4); Pr.steelyard(ctx, { x, y, s: 1.1, k: 1, tilt: -0.12, left: 'fire', right: 'people', t: 1 }); label('12 权衡秤', x, y + 120);
  [x, y] = cell(5); Pr.codeStamp(ctx, { x, y, s: 1.2, k: 1, lines: ['唐', '律'] }); label('13 律条印戳', x, y + 100);
  [x, y] = cell(6); Pr.beaconTower(ctx, { x: x - 40, y: y + 80, s: 0.7, k: 1, lit: false }); Pr.absentSignal(ctx, { x: x + 50, y: y - 20, s: 1.1, k: 0.3, breathe: 1, label: '前' }); label('14 缺席 · 前', x, y + 140);
  [x, y] = cell(7); Pr.beaconTower(ctx, { x: x - 40, y: y + 80, s: 0.7, k: 1, lit: false }); Pr.absentSignal(ctx, { x: x + 50, y: y - 20, s: 1.1, k: 1, breathe: 1.05, label: '没来' }); label('14 缺席 · 后（我们的）', x, y + 140);
}
function render(t) { ctx.setTransform(1, 0, 0, 1, 0, 0); if (t < 1) people(); else if (t < 2) props1(); else props2(); }
window.render = render; window.TEXTS = () => [];
document.fonts.ready.then(() => { render(0); window.READY = true; });

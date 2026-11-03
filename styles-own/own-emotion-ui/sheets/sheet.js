/** sheets — t=0 people (three casts), t=1.5 props 1–20, t=2.5 prop-animation patterns (filmstrips). Labels are part of the sheet. */
import { P, paintRoom, chip, FONT, MONO, roundRect, rgba } from './look.js';
import { pill, crowd, sitter, kid, steam } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
const label = (x, y, s, sub = '') => { ctx.save(); ctx.font = `600 24px ${FONT}`; ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.fillText(s, x, y);
  if (sub) { ctx.font = `400 18px ${MONO}`; ctx.fillStyle = P.mute; ctx.fillText(sub, x, y + 26); } ctx.restore(); };
const title = (s) => { ctx.save(); ctx.font = `700 34px ${FONT}`; ctx.fillStyle = P.white; ctx.fillText(s, 50, 62); ctx.restore(); };
function people() {
  paintRoom(ctx, 1920, 1080, { floorY: 860, glowX: 0.3 });
  title('情绪UI · 人物表  ①胶囊人(nexo)  ②奶白象形人(6571)  ③小孩扁平人(6911，唯一有五官的一组)');
  crowd(ctx, { x0: 0, x1: 400, y: 860, H: 380, n: 2, seed: 5, phones: 0.6 });
  label(200, 920, '人群 crowd', '3 层景深 · phones=屏光');
  const arms = ['hip', 'phone', 'raise', 'chin'];
  arms.forEach((a, i) => { pill(ctx, { x: 470 + i * 170, y: 860, H: 400, cast: 'hero', arm: a, glow: i === 1 ? 1 : 0.3, screen: 1 }); label(470 + i * 170, 920, 'arm:' + a); });
  Pr.bed(ctx, 1010, 860, 330);
  const s = sitter(ctx, { x: 1290, y: 745, H: 400, hunch: 0.75 }); steam(ctx, s.top[0], s.top[1] - 10, 100, 0);
  label(1180, 920, 'sitter 坐姿', 'hunch 0.75 · 屏光');
  const moods = [['happy', 'bob', P.coral, 'paddle'], ['worried', 'short', P.denim, 'phone'], ['teary', 'bob', P.coral, 'down'], ['shout', 'short', P.denim, 'wave'], ['calm', 'bob', '#8FB98B', 'phone', 1]];
  moods.forEach(([m, h, top, arm, tn], i) => { kid(ctx, { x: 1395 + i * 106, y: 860, H: 270, hair: h, top, mood: m, armR: arm, facing: i % 2 ? -1 : 1, turn: tn || 0 }); label(1395 + i * 106, 920, tn ? 'turn 侧身' : m); });
  ctx.save(); ctx.font = `400 22px ${FONT}`; ctx.fillStyle = P.mute; ctx.fillText('规则：胶囊人/象形人无五官，情绪靠姿势+光+道具；小孩组用 6911 的扁平五官（眼、眉、腮红、嘴），头身比 1:2.6。', 50, 1010); ctx.restore();
}
function props(t) {
  paintRoom(ctx, 1920, 1080, { floorY: 2000, grid: false });
  title('情绪UI · 道具表 1–20（全部纯代码，k=入场进度）');
  const cell = (i) => [160 + (i % 6) * 320, 190 + Math.floor(i / 6) * 232];
  const items = [
    ['phone lock', (x, y) => Pr.phone(ctx, x, y, 150, { mode: 'lock' })],
    ['phone chat', (x, y) => Pr.phone(ctx, x, y, 150, { mode: 'chat', lines: ['>', '<', '>', '>', '<'] })],
    ['phone apps', (x, y) => Pr.phone(ctx, x, y, 150, { mode: 'apps', glow: 0.3 })],
    ['chatBubble 自/他', (x, y) => { Pr.chatBubble(ctx, x + 110, y - 35, '在忙吗', { self: true, size: 34 }); Pr.chatBubble(ctx, x - 120, y + 35, '刚看到', { self: false, size: 34 }); }],
    ['typingDots', (x, y) => Pr.typingDots(ctx, x, y, 40, { t: 0.3 })],
    ['flipClock', (x, y) => Pr.flipClock(ctx, x, y, 80, { text: '22:53' })],
    ['hangingLamp', (x, y) => Pr.hangingLamp(ctx, x, y - 110, y - 60, { w: 90, floorY: y + 90, dust: 20 })],
    ['windowMoon', (x, y) => Pr.windowMoon(ctx, x - 90, y - 80, 180, 150, { city: true })],
    ['wallClock', (x, y) => Pr.wallClock(ctx, x, y, 70)],
    ['bed', (x, y) => Pr.bed(ctx, x - 120, y + 60, 240)],
    ['pingTable', (x, y) => Pr.pingTable(ctx, x - 130, y + 30, 260, { ball: 0.35 })],
    ['tensionMeter', (x, y) => { Pr.tensionMeter(ctx, x - 50, y + 30, 120, { v: 0.85, size: 24 }); Pr.tensionMeter(ctx, x + 50, y + 30, 120, { v: 0.2, label: '放松', size: 24 }); }],
    ['focusBrackets', (x, y) => { pill(ctx, { x, y: y + 90, H: 170, cast: 'hero', arm: 'hip' }); Pr.focusBrackets(ctx, x, y + 10, 130, 190); }],
    ['eye + gazeLine', (x, y) => { Pr.eye(ctx, x - 100, y - 40, 26); Pr.gazeLine(ctx, x - 70, y - 40, x + 110, y + 50); Pr.eye(ctx, x - 60, y + 40, 20); Pr.gazeLine(ctx, x - 35, y + 40, x + 110, y + 50); }],
    ['callout', (x, y) => Pr.callout(ctx, x - 110, y + 40, x - 40, y - 30, '表情自然吗？')],
    ['thoughtCloud', (x, y) => Pr.thoughtCloud(ctx, x + 20, y - 10, 220, 150, { from: [x - 120, y + 90], draw: (c) => { pill(c, { x: -25, y: 50, H: 90, cast: 'crowd', color: P.cream }); pill(c, { x: 25, y: 50, H: 90, cast: 'crowd', color: P.cream }); } })],
    ['statusLine', (x, y) => Pr.statusLine(ctx, x, y, '已送达 · 对方暂无动静', { align: 'center' })],
    ['statCard', (x, y) => Pr.statCard(ctx, x, y, 220, { label: '你以为', value: 50, sub: '注意到你的人' })],
    ['crystalHeart', (x, y) => Pr.crystalHeart(ctx, x, y, 70, { crack: 0.25 })],
    ['glitchText', (x, y) => Pr.glitchText(ctx, x, y, '嗯。', { t: 0.0123, size: 90, amt: 0.6 })],
    ['tshirtPrint', (x, y) => Pr.tshirtPrint(ctx, x, y, 55, { glow: 0.6 })],
    ['chip 症状', (x, y) => chip(ctx, x, y, '症状 · 反复确认', { num: 1 })],
  ];
  items.forEach(([n, f], i) => { const [x, y] = cell(i); ctx.save(); f(x, y); ctx.restore(); label(x, y + 100, `${i + 1}. ${n}`); });
}

function patterns() {
  paintRoom(ctx, 1920, 1080, { floorY: 2000, grid: false });
  title('情绪UI · 道具动画套路（每行 5 帧，左→右为时间；数字=秒）');
  const fw = 300, fh = 112, x0 = 330;
  const rows = [
    ['M2 gazeLock 视线锁定（招牌）', [0, 0.2, 0.5, 0.9, 1.6], (x, y, tt) => { const G = M.gazeLock(tt, 0, 3);
      pill(ctx, { x: x + 110, y: y + 50, H: 95, cast: 'hero', arm: 'hip' });
      [[-120, -30], [-90, 10], [-60, -45]].forEach(([dx, dy], i) => { Pr.eye(ctx, x + dx, y + dy, 14, { k: G.eyes[i] }); Pr.gazeLine(ctx, x + dx + 12, y + dy, x + 110, y - 15, { k: G.lines[i] }); });
      Pr.focusBrackets(ctx, x + 110, y + 2, 60, 105, { k: G.brackets }); }],
    ['M3 gazeRelease 视线撤回（反转）', [0, 0.25, 0.5, 0.7, 0.95], (x, y, tt) => { const G = M.gazeRelease(tt, 0, 3);
      pill(ctx, { x: x + 110, y: y + 50, H: 95, cast: 'hero', arm: tt > 0.6 ? 'phone' : 'hip' });
      [[-120, -30], [-90, 10], [-60, -45]].forEach(([dx, dy], i) => { Pr.eye(ctx, x + dx, y + dy, 14, { k: G.eyes[i], blink: G.blink }); Pr.gazeLine(ctx, x + dx + 12, y + dy, x + 110, y - 15, { k: G.lines[i] }); });
      Pr.focusBrackets(ctx, x + 110, y + 2, 60, 105, { k: G.brackets }); }],
    ['M4 bubbleStack 气泡上推', [0, 0.3, 0.6, 0.9, 1.4], (x, y, tt) => { const B = M.bubbleStack(tt, 0, 3, { gap: 0.4, row: 34 });
      ctx.save(); ctx.beginPath(); ctx.rect(x - 140, y - 55, 280, 110); ctx.clip();
      ['在吗', '刚看到', '那就好'].forEach((s, i) => Pr.chatBubble(ctx, x + (i % 2 ? -50 : 50), y + 30 + i * 34 - B.lift, s, { self: !(i % 2), k: B.ks[i], size: 22 })); ctx.restore(); }],
    ['M5 meter 紧张条上涨/回落', [0, 0.4, 0.8, 1.2, 2.4], (x, y, tt) => { const v = tt < 1.4 ? M.meter(tt, 0, 0.1, 0.9, 1.2) : M.meter(tt, 1.4, 0.9, 0.15, 1.0);
      Pr.tensionMeter(ctx, x, y + 22, 70, { v, size: 18 }); }],
    ['M6 lampOn 吊灯闪亮 + M10 countUp 数字滚动', [0, 0.1, 0.22, 0.5, 1.0], (x, y, tt) => { Pr.hangingLamp(ctx, x - 70, y - 60, y - 30, { w: 60, floorY: y + 55, on: M.lampOn(tt, 0), dust: 8 });
      ctx.save(); ctx.translate(x + 65, y - 8); ctx.scale(0.62, 0.62); Pr.statCard(ctx, 0, -5, 180, { label: '实际', value: 23 * M.countUp(tt, 0.1, 0.8), color: P.cyan }); ctx.restore(); }],
    ['M9 dive 推入思绪云 + flipClock 翻页', [0, 0.3, 0.55, 0.75, 0.9], (x, y, tt) => { const d = M.dive(tt, 0.3, 0.6);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 145, y - 55, 290, 110); ctx.clip(); ctx.translate(x + 40, y - 10); ctx.scale(1 + d * 0.9, 1 + d * 0.9); ctx.translate(-x - 40, -y + 10);
      Pr.flipClock(ctx, x - 100, y + 30, 26, { text: tt < 0.2 ? '01:16' : '01:17', flip: M.seg(tt, 0, 0.2), prev: '01:16' });
      Pr.thoughtCloud(ctx, x + 40, y - 10, 120, 80, { from: [x - 40, y + 45], draw: (c) => pill(c, { x: 0, y: 25, H: 50, cast: 'hero', arm: 'hip' }) }); ctx.restore(); }],
  ];
  rows.forEach(([name, ts, f], r) => { const y = 170 + r * 150;
    ctx.save(); ctx.font = `600 22px ${FONT}`; ctx.fillStyle = P.white; ctx.fillText(name, 40, y - 4, 270); ctx.restore();
    ts.forEach((tt, i) => { const x = x0 + i * (fw + 22) + fw / 2;
      ctx.save(); roundRect(ctx, x - fw / 2, y - fh / 2 - 5, fw, fh + 10, 10); ctx.fillStyle = 'rgba(20,26,44,0.9)'; ctx.fill(); ctx.strokeStyle = 'rgba(154,163,184,0.3)'; ctx.stroke();
      ctx.clip(); f(x, y, tt); ctx.restore();
      ctx.save(); ctx.font = `400 16px ${MONO}`; ctx.fillStyle = P.mute; ctx.fillText(tt.toFixed(2) + 's', x - fw / 2 + 8, y + fh / 2 + 22); ctx.restore(); }); });
}
window.render = (t) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (t < 1) people(); else if (t < 2) props(t); else patterns();
};
window.TEXTS = () => [];
document.fonts.ready.then(() => { window.render(0); window.READY = true; });

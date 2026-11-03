/** sheets — t=0 people, t=1.5 props, t=2.5 prop-animation patterns. */
import { P, paintPaper, paintStage, chip, FONT, MONO, roundRect, rgba } from './look.js';
import { puppet, crowdRow, POSES } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
const label = (x, y, s, sub = '') => { ctx.save(); ctx.font = `600 22px ${FONT}`; ctx.fillStyle = P.ink; ctx.textAlign = 'center'; ctx.fillText(s, x, y);
  if (sub) { ctx.font = `400 16px ${MONO}`; ctx.fillStyle = P.mute; ctx.fillText(sub, x, y + 22); } ctx.restore(); };
const title = (s, stage = false) => { ctx.save(); ctx.font = `700 32px ${FONT}`; ctx.fillStyle = stage ? P.cream : P.ink; ctx.fillText(s, 50, 58); ctx.restore(); };

function people() {
  paintPaper(ctx, 1920, 1080);
  title('节拍序列 · 人物表  木偶人（圆头无五官 · 关节圆点 · 色块衣服）');
  // pose row
  const poses = ['idle', 'swayL', 'discoL', 'discoR', 'pump', 'waltzL', 'guitar', 'hatTip'];
  poses.forEach((pose, i) => {
    const x = 130 + i * 220;
    puppet(ctx, { x, y: 480, H: 320, pose, skin: P.skin, shirt: [P.teal, P.pink, P.orange, P.yellow, P.purple, '#1A1520', P.orange, '#6A7A40'][i],
      pants: i === 5 ? '#0E0C0A' : '#2A2430', dress: pose === 'waltzF' ? P.pink : null,
      hair: pose === 'hatTip' ? 'fedora' : (pose === 'waltzL' ? 'cap' : 'cap'), hatColor: pose === 'hatTip' ? P.gold : '#1A1520',
      bowtie: pose === 'waltzL', suspenders: pose === 'hatTip', facing: i % 2 ? -1 : 1, hit: i === 2 ? 0.8 : 0 });
    label(x, 520, pose, i === 2 ? 'hit 闪光' : '');
  });
  // waltz couple
  puppet(ctx, { x: 500, y: 920, H: 280, pose: 'waltzL', shirt: '#1A1520', pants: '#0E0C0A', hair: 'cap', bowtie: true, hit: 0.5 });
  puppet(ctx, { x: 640, y: 920, H: 270, pose: 'waltzF', shirt: '#8A2040', dress: P.pink, hair: 'bob', hatColor: '#4A1830', facing: -1 });
  label(570, 960, '华尔兹双人', 'lead + follow');
  // disco row sample
  crowdRow(ctx, { x0: 900, x1: 1700, y: 900, H: 140, n: 8, seed: 2, t: 1.2, hit: 0.4 });
  label(1300, 960, '背景舞者排', 'crowdRow');
  // dark skin fedora
  puppet(ctx, { x: 1780, y: 920, H: 260, pose: 'hatTip', skin: P.skinDark, shirt: P.orange, pants: '#2A2018', hair: 'fedora', hatColor: P.gold, suspenders: true });
  label(1780, 960, 'Living fedora');
  ctx.save(); ctx.font = `400 20px ${FONT}`; ctx.fillStyle = P.mute;
  ctx.fillText('规则：无五官；关节圆必须可见；情绪靠姿势+节拍闪光 hit；衣服是平涂色块。木偶语言来自 0594，不是写实人体。', 50, 1040); ctx.restore();
}
function props() {
  paintPaper(ctx, 1920, 1080);
  title('节拍序列 · 道具表（全部纯代码）');
  const cell = (i) => [140 + (i % 6) * 300, 170 + Math.floor(i / 6) * 220];
  const items = [
    ['metronome', (x, y) => Pr.metronome(ctx, x, y, 120, { angle: 0.3 })],
    ['bpmNum 76', (x, y) => Pr.bpmNum(ctx, x - 60, y, 76, { size: 90 })],
    ['sequencer beige', (x, y) => { ctx.save(); ctx.beginPath(); ctx.rect(x - 130, y - 70, 260, 140); ctx.clip(); Pr.sequencer(ctx, { x: x - 130, y: y - 70, w: 260, h: 140, playhead: 0.35, theme: 'beige', beatN: 8 }); ctx.restore(); }],
    ['sequencer disco', (x, y) => { ctx.save(); ctx.beginPath(); ctx.rect(x - 130, y - 70, 260, 140); ctx.clip(); Pr.sequencer(ctx, { x: x - 130, y: y - 70, w: 260, h: 140, playhead: 0.4, theme: 'disco', beatN: 8 }); ctx.restore(); }],
    ['discoBall', (x, y) => Pr.discoBall(ctx, x, y, 40, { t: 1.2, beams: 5 })],
    ['discoFloor', (x, y) => { ctx.save(); ctx.beginPath(); ctx.rect(x - 130, y - 50, 260, 100); ctx.clip(); ctx.translate(0, -400); Pr.discoFloor(ctx, y + 350, y + 450, { t: 0.5 }); ctx.restore(); }],
    ['spotlight', (x, y) => { paintStage(ctx, 0, 0); /* noop */ ctx.save(); ctx.fillStyle = P.stage; roundRect(ctx, x - 120, y - 80, 240, 160, 8); ctx.fill(); Pr.spotlight(ctx, x, y + 70, { botW: 180, topW: 30, a: 0.35, dust: 10 }); ctx.restore(); }],
    ['turntable', (x, y) => Pr.turntable(ctx, x, y, 90, { spin: 1 })],
    ['domeLamp', (x, y) => Pr.domeLamp(ctx, x, y + 60, 140)],
    ['guitar', (x, y) => Pr.guitar(ctx, x, y, 100)],
    ['kickDrum', (x, y) => Pr.kickDrum(ctx, x, y, 45, { hit: 0.5 })],
    ['chandelier', (x, y) => { ctx.fillStyle = P.stageBurg; roundRect(ctx, x - 100, y - 70, 200, 140, 8); ctx.fill(); Pr.chandelier(ctx, x, y + 20, 70); }],
    ['sofa', (x, y) => Pr.sofa(ctx, x, y + 40, 180)],
    ['rainbow', (x, y) => Pr.rainbow(ctx, x, y + 50, 100)],
    ['lavaLamp', (x, y) => Pr.lavaLamp(ctx, x, y + 50, 110, { t: 0.8 })],
    ['archWindows', (x, y) => { ctx.fillStyle = P.stage; roundRect(ctx, x - 110, y - 70, 220, 140, 8); ctx.fill(); ctx.save(); ctx.translate(-200 + x, -80 + y); Pr.archWindows(ctx, 80, 120); ctx.restore(); }],
    ['star', (x, y) => { ctx.fillStyle = P.stage; roundRect(ctx, x - 80, y - 50, 160, 100, 8); ctx.fill(); Pr.star(ctx, x, y, 16); }],
    ['gapBracket 缝', (x, y) => Pr.gapBracket(ctx, x - 60, x + 60, y + 20, { label: '缝' })],
    ['chip 3/4', (x, y) => chip(ctx, x, y, '3/4', { color: P.gold, fill: P.gold })],
    ['footprint+BPM', (x, y) => Pr.bpmNum(ctx, x - 40, y, 70, { size: 70, underline: true })],
  ];
  items.forEach(([n, f], i) => { const [x, y] = cell(i); ctx.save(); f(x, y); ctx.restore(); label(x, y + 95, `${i + 1}. ${n}`); });
}
function patterns() {
  paintStage(ctx, 1920, 1080, { tint: P.stage, floorY: 2000, glow: 0 });
  title('节拍序列 · 道具动画套路（每行 5 帧）', true);
  ctx.fillStyle = P.cream; // override title already cream
  const fw = 300, x0 = 340;
  const rows = [
    ['M playhead 连续播放头（跨世界）', [0, 0.3, 0.6, 0.9, 1.2], (x, y, tt) => {
      const ph = M.playheadAt(tt, 76, 4, 2); const fl = M.beatFlash(tt, 76);
      ctx.save(); ctx.beginPath(); ctx.rect(x - 140, y - 50, 280, 100); ctx.clip();
      Pr.sequencer(ctx, { x: x - 140, y: y - 50, w: 280, h: 100, playhead: ph, theme: 'disco', hitFlash: fl, beatN: 8, labels: false });
      ctx.restore();
    }],
    ['M beatFlash 节拍闪光 → 关节发亮', [0, 0.15, 0.35, 0.55, 0.85], (x, y, tt) => {
      const fl = M.beatFlash(tt, 76, 0.2);
      puppet(ctx, { x, y: y + 40, H: 110, pose: M.dancePose(tt, 76), shirt: P.pink, pants: '#EEE', hair: 'cap', hit: fl });
    }],
    ['M metroSwing 节拍器摆臂', [0, 0.2, 0.4, 0.6, 0.8], (x, y, tt) => {
      Pr.metronome(ctx, x, y + 10, 70, { angle: M.metroSwing(tt, 76, 0.55) });
    }],
    ['M waltzStep 三拍脚步', [0, 0.4, 0.8, 1.2, 1.6], (x, y, tt) => {
      const pose = M.waltzStep(tt, 76);
      puppet(ctx, { x: x - 35, y: y + 40, H: 100, pose, shirt: '#1A1520', pants: '#0E0C0A', bowtie: true, hair: 'cap' });
      puppet(ctx, { x: x + 40, y: y + 40, H: 95, pose: 'waltzF', dress: P.pink, shirt: '#8A2040', hair: 'bob', facing: -1 });
    }],
    ['M gapBracket 缝高亮（自研道具）', [0, 0.3, 0.6, 1.0, 1.4], (x, y, tt) => {
      const k = M.popIn(tt, 0.2, 0.5);
      Pr.gapBracket(ctx, x - 50, x + 50, y + 30, { label: '缝', k });
    }],
    ['M dip 世界切换压暗', [0, 0.15, 0.3, 0.45, 0.55], (x, y, tt) => {
      const d = M.dip(tt, 0, 0.55);
      /* paper already via clip fill */
      ctx.save(); ctx.beginPath(); ctx.rect(x - 140, y - 50, 280, 100); ctx.clip();
      ctx.fillStyle = P.paper; ctx.fillRect(x - 140, y - 50, 280, 100);
      ctx.fillStyle = rgba(P.stageBurg, d); ctx.fillRect(x - 140, y - 50, 280, 100);
      ctx.restore();
    }],
  ];
  rows.forEach((row, ri) => {
    const [name, times, draw] = row;
    const yy = 120 + ri * 150;
    ctx.save(); ctx.font = `600 22px ${FONT}`; ctx.fillStyle = P.cream; ctx.textAlign = 'left'; ctx.fillText(name, 40, yy - 40); ctx.restore();
    times.forEach((tt, ti) => {
      const x = x0 + ti * (fw + 16);
      ctx.save(); ctx.fillStyle = rgba('#000', 0.35); roundRect(ctx, x - 150, yy - 55, 300, 110, 8); ctx.fill(); ctx.restore();
      draw(x, yy, tt);
      ctx.save(); ctx.font = `400 16px ${MONO}`; ctx.fillStyle = P.mute; ctx.textAlign = 'center'; ctx.fillText(tt + 's', x, yy + 70); ctx.restore();
    });
  });
}
window.render = (t) => { if (t < 0.75) people(); else if (t < 2.0) props(); else patterns(); };
window.READY = true;
window.render(0);

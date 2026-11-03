/** sheets — t=0 people, t=1.5 props, t=2.5 animation patterns. */
import { P, W, H, SERIF, SANS, MONO, paintDarkroom, spotCone, pendant, chip, rgba } from './look.js';
import { peg, duo, tinyPeg } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
const label = (x, y, s, sub = '') => { ctx.save(); ctx.font = `600 22px ${SANS}`; ctx.fillStyle = P.white; ctx.textAlign = 'center'; ctx.fillText(s, x, y);
  if (sub) { ctx.font = `400 16px ${MONO}`; ctx.fillStyle = P.mute; ctx.fillText(sub, x, y + 22); } ctx.restore(); };
const title = (s) => { ctx.save(); ctx.font = `700 32px ${SERIF}`; ctx.fillStyle = P.white; ctx.textAlign = 'left'; ctx.fillText(s, 40, 48); ctx.restore(); };

function people() {
  paintDarkroom(ctx, { floorY: 860 });
  spotCone(ctx, 480, 60, 860, { wFloor: 360, a: 0.3, dust: 12 });
  spotCone(ctx, 1100, 60, 860, { wFloor: 360, a: 0.35, dust: 12, color: P.gold });
  title('暗室聚光 · 人物表  色块 peg（源片语言：无四肢、无五官；观感靠比例+顶光体积光）');
  // novice poses
  [['站', 0, 0], ['微倾', 0.08, 0], ['点头', 0, 0.5], ['蹲看', 0, 0, 0.55]].forEach(([n, lean, nod, kneel], i) => {
    peg(ctx, { x: 220 + i * 160, y: 860, H: 280, cast: 'novice', lean, nod, kneel: kneel || 0, glow: 0.6, facing: 1 });
    label(220 + i * 160, 920, '小蓝·' + n, 'novice');
  });
  // expert
  [[0, 0, 0], [0, 0, 0], [-0.06, 0.2, 0], [0, 0, 0.4]].forEach(([lean, nod, kneel], i) => {
    peg(ctx, { x: 960 + i * 170, y: 860, H: 300, cast: 'expert', lean, nod, kneel, glow: 0.95, facing: i > 1 ? -1 : 1 });
    label(960 + i * 170, 920, ['小金·站', '小金·发光', '小金·侧倾', '小金·蹲'][i], 'expert');
  });
  // tiny
  tinyPeg(ctx, { x: 1700, y: 860, cast: 'novice' }); tinyPeg(ctx, { x: 1780, y: 860, cast: 'expert' });
  label(1740, 920, 'tinyPeg', '图用');
  ctx.save(); ctx.font = `400 20px ${SANS}`; ctx.fillStyle = P.mute;
  ctx.fillText('规则：头球+斗篷躯干，头宽≈躯干宽×0.38，头身缝≈0.02H；情绪=光量+倾角+跪量。这就是源片人物语言，不是没画好的火柴人。', 40, 1010); ctx.restore();
}

function props() {
  paintDarkroom(ctx, { floorY: 2000, grid: false });
  title('暗室聚光 · 道具表（实心色块 = 表面；虚线蓝图 = 深层结构）');
  const cell = (i) => [140 + (i % 6) * 310, 170 + Math.floor(i / 6) * 220];
  const items = [
    ['1 windupDog', (x, y) => Pr.windupDog(ctx, x, y + 40, 110, { walk: 0.4, keyRot: 0.5 })],
    ['2 windupKey', (x, y) => Pr.windupKey(ctx, x, y, 50, { rot: 0.3, glow: 0.8 })],
    ['3 blueprintDog', (x, y) => Pr.blueprintDog(ctx, x, y + 30, 130, { k: 1 })],
    ['4 spring', (x, y) => Pr.spring(ctx, x, y, 48, { k: 1 })],
    ['5 gear', (x, y) => { Pr.gear(ctx, x - 30, y, 36, { teeth: 10, fill: true }); Pr.gear(ctx, x + 30, y, 24, { teeth: 7, rot: 0.3 }); }],
    ['6 questionOrbit', (x, y) => Pr.questionOrbit(ctx, x, y, 90, ['牌子?', '颜色?', '价格?'], { k: 1, rot: 0.4 })],
    ['7 calloutCard', (x, y) => Pr.calloutCard(ctx, x, y, '哪个牌子？', { color: P.blue })],
    ['8 speechBubble', (x, y) => Pr.speechBubble(ctx, x, y, '它为什么能自己走？', { color: P.gold, tip: [0, 20] })],
    ['9 concentricRings', (x, y) => Pr.concentricRings(ctx, x, y, 85, { k: 1, labels: ['表面', '用法', '原理'] })],
    ['10 balanceScale', (x, y) => Pr.balanceScale(ctx, x, y + 50, 180, { tilt: 0.15, k: 1 })],
    ['11 shallowBlock', (x, y) => { Pr.shallowBlock(ctx, x - 50, y, '多少钱'); Pr.shallowBlock(ctx, x + 50, y + 20, '哪买的'); }],
    ['12 whyRing', (x, y) => Pr.whyRing(ctx, x, y, '为什么？', { s: 55 })],
    ['13 zipper', (x, y) => Pr.zipper(ctx, x, y, 160, { open: 0.45 })],
    ['14 barCompare', (x, y) => Pr.barCompare(ctx, x, y + 20, { belief: 7, after: 2.5, k: 1 })],
    ['15 spiralSteps', (x, y) => Pr.spiralSteps(ctx, x - 70, y + 50, x + 70, y - 50, 5, { k: 1 })],
    ['16 decisionWheel', (x, y) => Pr.decisionWheel(ctx, x, y, 70, ['A', 'B', 'C', 'D'], { k: 1, rot: 0.2 })],
    ['17 books', (x, y) => Pr.books(ctx, x, y + 30, { n: 4 })],
    ['18 knowledgeGraph', (x, y) => Pr.knowledgeGraph(ctx, x, y, [{ x: x - 60, y: y - 40, label: '狗' }, { x: x + 60, y: y - 30, label: '发条' }, { x: x, y: y + 50, label: '齿轮' }], { k: 1 })],
    ['19 gapGraph', (x, y) => Pr.gapGraph(ctx, x - 70, y + 40, 140, 90, { k: 1, t: 1 })],
    ['20 labelTag', (x, y) => Pr.labelTag(ctx, x - 40, y + 20, x + 50, y - 30, '发条', { color: P.gold })],
    ['21 pedestal', (x, y) => Pr.pedestal(ctx, x, y + 30, 100, 36)],
    ['22 pencilPaper', (x, y) => Pr.pencilPaper(ctx, x, y, { write: 0.5 })],
  ];
  items.forEach(([n, f], i) => { const [x, y] = cell(i); ctx.save(); f(x, y); ctx.restore(); label(x, y + 95, n); });
}

function patterns() {
  paintDarkroom(ctx, { floorY: 2000, grid: false });
  title('暗室聚光 · 道具动画套路（每行 5 帧，左→右为时间）');
  const rows = [
    ['M5 blueprintMorph 实心→蓝图（招牌）', [0, 0.3, 0.6, 0.9, 1.3], (x, y, tt) => {
      const m = M.blueprintMorph(tt, 0, 1.4);
      if (m.solid > 0.05) Pr.windupDog(ctx, x, y + 30, 70, { k: m.solid, alpha: m.solid });
      if (m.blueprint > 0.05) { Pr.blueprintDog(ctx, x, y + 20, 80, { k: m.blueprint }); Pr.spring(ctx, x - 25, y - 10, 22, { k: m.glow }); }
    }],
    ['M6 scaleTip 天平倾向质量', [0, 0.35, 0.7, 1.1, 1.5], (x, y, tt) => {
      Pr.balanceScale(ctx, x, y + 40, 140, { tilt: M.scaleTip(tt, 0, 1.5, 0.3), k: 1 });
    }],
    ['M7 ringIgnite 同心环点亮', [0, 0.25, 0.5, 0.75, 1.0], (x, y, tt) => {
      Pr.concentricRings(ctx, x, y, 55, { k: M.ringIgnite(tt, 0, 1.0), labels: ['', '', ''], highlight: 2 });
    }],
    ['M4+M8 orbit + keyWind', [0, 0.4, 0.8, 1.2, 1.6], (x, y, tt) => {
      Pr.questionOrbit(ctx, x, y, 55, ['?', '?', '?'], { k: 1, rot: M.orbitSpin(tt, 0.8) });
      Pr.windupKey(ctx, x + 80, y, 28, { rot: M.keyWind(tt, 3), glow: 0.7 });
    }],
    ['M12 popIn 卡片弹出', [0, 0.1, 0.25, 0.45, 0.7], (x, y, tt) => {
      ['牌子', '颜色', '价格'].forEach((s, i) => Pr.calloutCard(ctx, x - 60 + i * 60, y, s, { k: M.popIn(tt, i * 0.12, 0.3), size: 16 }));
    }],
    ['M9 dipDark 暗场换幕', [0, 0.15, 0.3, 0.45, 0.6], (x, y, tt) => {
      peg(ctx, { x: x - 40, y: y + 40, H: 70, cast: 'novice', glow: 0.5 });
      peg(ctx, { x: x + 40, y: y + 40, H: 70, cast: 'expert', glow: 0.8 });
      const d = M.dipDark(tt, 0.15, 0.55); ctx.save(); ctx.fillStyle = `rgba(5,4,3,${d})`; ctx.fillRect(x - 140, y - 50, 280, 110); ctx.restore();
    }],
  ];
  rows.forEach(([name, times, draw], ri) => {
    const y = 120 + ri * 150;
    ctx.save(); ctx.font = `600 20px ${SANS}`; ctx.fillStyle = P.cream; ctx.textAlign = 'left'; ctx.fillText(name, 40, y - 40); ctx.restore();
    times.forEach((tt, fi) => {
      const x = 200 + fi * 340;
      ctx.save(); ctx.fillStyle = rgba(P.voidLite, 0.6); ctx.fillRect(x - 140, y - 55, 280, 110);
      ctx.strokeStyle = rgba(P.mute, 0.3); ctx.strokeRect(x - 140, y - 55, 280, 110); ctx.restore();
      draw(x, y, tt);
      ctx.save(); ctx.font = `400 14px ${MONO}`; ctx.fillStyle = P.mute; ctx.textAlign = 'center'; ctx.fillText(tt.toFixed(2) + 's', x, y + 65); ctx.restore();
    });
  });
}

window.render = (t) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
  if (t < 0.75) people(); else if (t < 2.0) props(); else patterns();
};
window.TEXTS = () => [];
Promise.all([document.fonts.load(`700 32px ${SERIF}`), document.fonts.load(`600 22px ${SANS}`)]).then(() => document.fonts.ready).then(() => { window.render(0); window.READY = true; });

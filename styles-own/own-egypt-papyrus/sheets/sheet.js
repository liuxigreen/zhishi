/* own-egypt-papyrus · sheets (1920×1080): t=0 people · t=1.5 props · t=2.5 animation filmstrip */
import { P, SERIF, parchment, grain, rgba, blockStripe, nameTag } from './look.js';
import { egyptian, POSES, walkPose, blendPose } from './people.js';
import * as Pr from './props.js';
import * as M from './motion.js';
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 3;
function bg(title) { ctx.save(); ctx.scale(1920 / 1440, 1); parchment(ctx); ctx.restore(); ctx.fillStyle = P.navy; ctx.fillRect(0, 0, 1920, 64); blockStripe(ctx, 0, 1920, 64, 10);
  ctx.fillStyle = P.cream; ctx.font = `900 34px ${SERIF}`; ctx.textBaseline = 'middle'; ctx.fillText(title, 30, 33); }
const label = (s, x, y, size = 22, al = 'center') => { ctx.fillStyle = P.ink; ctx.font = `800 ${size}px ${SERIF}`; ctx.textAlign = al; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); ctx.textAlign = 'left'; };
function people() { bg('莎草图 · 人物表  (埃及正典：侧脸正眼、正肩、侧腿；平涂 + 3px 深棕描边)');
  const ks = [['man', '男子'], ['worker', '工匠'], ['woman', '女子'], ['scribe', '书吏'], ['pharaoh', '法老'], ['official', '官员'], ['ra', '拉（神）'], ['hathor', '哈托尔']];
  ks.forEach(([k, n], i) => { egyptian(ctx, { x: 120 + i * 236, y: 600, H: 470, kind: k, pose: k === 'scribe' ? 'write' : 'stand', mouth: 0 }); label(n, 130 + i * 236, 630); });
  const ps = ['stride', 'offer', 'raise', 'shout', 'point', 'chiselUp', 'chiselDn', 'carry', 'sitDown', 'sitChair', 'slump', 'cheer'];
  ps.forEach((p, i) => { egyptian(ctx, { x: 90 + i * 152, y: 1020, H: 300, kind: i % 3 === 1 ? 'woman' : 'worker', pose: p, mouth: p === 'shout' ? 1 : 0 }); label(p, 90 + i * 152, 1048, 18); });
}
function props() { bg('莎草图 · 道具表  (20 件：平涂 + 一圈描边 + 至多一道金/蓝/绿装饰带)');
  const cw = 384, chh = 250; const cell = (i, name, fn) => { const cx = (i % 5) * cw, cy = 84 + Math.floor(i / 5) * chh; ctx.save(); ctx.beginPath(); ctx.rect(cx + 4, cy + 4, cw - 8, chh - 8); ctx.clip(); fn(cx + cw / 2, cy + chh - 40); ctx.restore(); ctx.strokeStyle = rgba(P.line, 0.25); ctx.strokeRect(cx + 4, cy + 4, cw - 8, chh - 8); label(name, cx + cw / 2, cy + chh - 18, 20); };
  const L = [
    ['sunDisk 太阳', (x, y) => Pr.sunDisk(ctx, x, y - 90, 50, { rays: 0.7 })],
    ['palm 椰枣树', (x, y) => Pr.palm(ctx, x, y, 0.7)],
    ['papyrus 纸莎草', (x, y) => Pr.papyrus(ctx, x, y, 0.85)],
    ['column 莲花柱', (x, y) => Pr.column(ctx, x, y, 44, 190)],
    ['hieroWall 象形墙', (x, y) => Pr.hieroWall(ctx, x - 170, y - 180, x + 170, y, { seed: 2, cell: 44 })],
    ['nile 尼罗河', (x, y) => Pr.nile(ctx, x - 180, y - 130, x + 180, y - 10, { t: 0 })],
    ['chisel+mallet 凿与槌', (x, y) => { Pr.chisel(ctx, x - 40, y - 40, 2.2, -0.4); Pr.mallet(ctx, x + 50, y - 60, 2.2, 0.5); }],
    ['oilLamp 油灯', (x, y) => Pr.oilLamp(ctx, x, y - 30, 2, { t: 0.3 })],
    ['granary 粮仓(fill)', (x, y) => Pr.granary(ctx, x, y, 0.62, { fill: 0.4, n: 2 })],
    ['grainSack/basket 粮袋粮筐', (x, y) => { Pr.grainSack(ctx, x - 70, y, 1.6); Pr.basket(ctx, x + 80, y, 1.5); }],
    ['scroll 纸草卷(open)', (x, y) => Pr.scroll(ctx, x, y - 90, 300, 110, { open: 1, lines: [[{ t: '我们饿了！', c: 'red' }]], size: 40 })],
    ['reedPen/palette 芦苇笔', (x, y) => { Pr.palette(ctx, x - 40, y - 90, 1.6); Pr.reedPen(ctx, x + 50, y - 40, 2.2, 0.4); }],
    ['jar 啤酒罐', (x, y) => Pr.jar(ctx, x, y, 2)],
    ['bread 面包', (x, y) => Pr.bread(ctx, x, y - 20, 2.4)],
    ['pylon 哨卡门楼(n)', (x, y) => Pr.pylon(ctx, x, y, 0.75, { n: 3 })],
    ['temple 神庙', (x, y) => Pr.temple(ctx, x, y, 0.55)],
    ['tally 计日刻痕', (x, y) => Pr.tally(ctx, x - 100, y - 170, 13.5, { per: 10 })],
    ['ankh 安卡', (x, y) => Pr.ankh(ctx, x, y - 70, 1.8)],
    ['starSky 星空', (x, y) => Pr.starSky(ctx, x - 180, y - 200, x + 180, y - 10, { t: 1 })],
    ['hills 帝王谷山', (x, y) => { ctx.save(); ctx.translate(x - 190, y - 10); ctx.scale(0.27, 0.45); Pr.hills(ctx, 0, { door: [700, 0, 120, 160] }); ctx.restore(); }],
  ];
  L.forEach(([n, f], i) => cell(i, n, f));
}
function strip() { bg('莎草图 · 道具/人物动画表  (每行一个模式，左→右 = 时间)');
  const rows = [
    ['M1 scrollWipe 纸草展开转场', (k, w, h) => { ctx.save(); ctx.scale(w / 1440, h / 1080); parchment(ctx, { tone: 'stone' }); M.scrollWipe(ctx, k, () => { parchment(ctx); Pr.granary(ctx, 720, 900, 1.6, { n: 3 }); }, { y0: 0, y1: 1080 }); ctx.restore(); }],
    ['M3 poseAt 关键帧姿势', (k, w, h) => egyptian(ctx, { x: w / 2 - 20, y: h - 6, H: h * 0.92, kind: 'worker', pose: M.poseAt([[0, 'stand'], [0.5, 'point'], [1, 'raise']], k) })],
    ['M4 walk 走路循环', (k, w, h) => egyptian(ctx, { x: w / 2 - 20, y: h - 6, H: h * 0.92, kind: 'man', pose: walkPose(k) })],
    ['M5 chiselLoop 凿刻', (k, w, h) => { const J = egyptian(ctx, { x: w / 2 - 60, y: h - 6, H: h * 0.92, kind: 'worker', pose: M.chiselLoop(k * 0.55).pose }); Pr.mallet(ctx, J.hands[1][0], J.hands[1][1], 0.9, J.hang[1] + Math.PI / 2); }],
    ['M6 countUp 计日刻痕', (k, w, h) => { const c = M.countUp(k, 0, 1, 0, 18); Pr.tally(ctx, 20, 18, c.n + c.frac, { s: 0.5 }); ctx.fillStyle = c.n >= 18 ? P.hiRed : P.ink; ctx.font = `900 34px ${SERIF}`; ctx.fillText(`第 ${c.n} 天`, w - 140, h - 30); }],
    ['M8+M7 shout/stampIn 喊+盖章', (k, w, h) => { const J = egyptian(ctx, { x: 70, y: h - 6, H: h * 0.92, kind: 'worker', pose: blendPose(POSES.stand, POSES.shout, Math.min(1, k * 2)), mouth: k > 0.3 ? 1 : 0 }); const s = M.stampIn(k, 0.3); if (s.a > 0) { ctx.save(); ctx.translate(w - 110, h / 2); ctx.scale(s.s * 0.6, s.s * 0.6); Pr.scroll(ctx, 0, 0, 300, 100, { lines: [[{ t: '饿了！', c: 'red' }]], size: 50 }); ctx.restore(); } }],
  ];
  const fw = 320, fh = 152, x0 = 270; rows.forEach(([n, fn], r) => { const y = 92 + r * 164; const [a,b]=n.split(' ').length>2?[n.split(' ').slice(0,2).join(' '),n.split(' ').slice(2).join(' ')]:n.split(' '); label(a, 16, y + fh / 2 - 14, 17, 'left'); label(b||'', 16, y + fh / 2 + 14, 17, 'left');
    for (let i = 0; i < 5; i++) { const k = i / 4; const x = x0 + i * (fw + 10); ctx.save(); ctx.beginPath(); ctx.rect(x, y, fw, fh); ctx.clip(); ctx.fillStyle = rgba('#F3E9CC', 0.6); ctx.fillRect(x, y, fw, fh); ctx.translate(x, y); fn(k, fw, fh); ctx.restore(); ctx.strokeStyle = P.line; ctx.lineWidth = 2; ctx.strokeRect(x, y, fw, fh); ctx.fillStyle = P.ink; ctx.font = `700 15px ${SERIF}`; ctx.fillText(`k=${k.toFixed(2)}`, x + 6, y + fh - 8); } });
}
window.render = (t) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, 1920, 1080); if (t < 1) people(); else if (t < 2) props(); else strip(); };
document.fonts.load(`900 34px ${SERIF}`).then(() => document.fonts.ready).then(() => { window.render(0); window.READY = true; });

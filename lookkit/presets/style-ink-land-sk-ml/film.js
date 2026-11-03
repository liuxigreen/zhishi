// STRUCTURE-v1 mood sketches ONLY (NOT the film): temple / cart-lock / shan-split
// Proves style-ink brushes do non-cafe worlds in 1920×1080 with captions on.
import * as N from '../style-ink/scene.js';
import { rng, mkCanvas } from '../../core/util.js';
const { brush, sweepBrush, wash, pth, ell, circ, paperBase, rectPts, figure, seal } = N;
export const W = 1920, H = 1080;
const L = async fn => { const c = mkCanvas(W, H); await fn(c.getContext('2d')); return c; };

function cap(x, a, b, mark) {
  // v3-like: paper stroke under ink fill for contrast
  x.save(); x.font = '58px Brush'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const line = (t, y, red) => {
    x.lineWidth = 14; x.strokeStyle = 'rgba(239,229,207,.94)'; x.strokeText(t, W / 2, y);
    x.fillStyle = red ? '#b8261d' : 'rgba(18,16,14,.95)'; x.fillText(t, W / 2, y);
  };
  if (b) { line(a, 940, mark === 1); line(b, 1020, mark === 2); } else line(a, 990, mark === 1);
  x.restore();
}

// №5 temple: 功德箱响一声，香火摊多卖一柱
const TEMPLE = { id: 'temple', t0: 0, t1: 1, async build() { return L(x => {
  paperBase(x, W, H, 17);
  // courtyard wash
  wash(x, pth([[0, 420], [400, 380], [900, 400], [1400, 360], [1920, 400], [1920, 1080], [0, 1080]]), { tone: .12, blur: 24, edge: .04, color: '70,56,40' });
  // temple roof silhouette
  wash(x, pth([[520, 320], [960, 160], [1400, 320], [1360, 360], [960, 220], [560, 360]]), { tone: .55, blur: 3, edge: .25, color: '40,28,20' });
  sweepBrush(x, [[540, 330], [960, 180], [1380, 330]], { w: 22, ink: .85, dry: .35, seed: 3, bristles: 20 });
  // pillars
  for (const px of [620, 1300]) sweepBrush(x, [[px, 320], [px + 4, 700]], { w: 48, ink: .7, dry: .4, seed: px, bristles: 22, color: '90,40,28' });
  // 功德箱
  x.fillStyle = 'rgba(90,50,30,.92)'; x.fillRect(820, 620, 280, 200);
  brush(x, rectPts(820, 620, 280, 200, 8), { w: 6, dry: .3, seed: 11, bristles: 10, color: '150,100,40' });
  x.font = '44px Brush'; x.fillStyle = 'rgba(214,170,80,.95)'; x.textAlign = 'center'; x.fillText('功德箱', 960, 690);
  // coin mid-air into slot
  x.fillStyle = 'rgba(200,160,40,.95)'; x.beginPath(); x.ellipse(960, 560, 22, 22, 0, 0, 7); x.fill();
  brush(x, circ(960, 560, 24, 24, 0, 6.3, 16), { w: 3, dry: .2, seed: 12, bristles: 6, color: '120,80,20' });
  // her dropping coin (left)
  figure(x, { body: [[480, 980], [500, 820], [560, 760], [620, 780], [660, 900], [640, 1080]], head: [560, 700, 48, 56],
    hair: [[[520, 690], [530, 640], [570, 620], [600, 650], [605, 700], [560, 680]]],
    feats: [{ pts: [[540, 700], [555, 702]], w: 6 }, { pts: [[575, 702], [590, 700]], w: 6 }, { pts: [[550, 735], [575, 732]], w: 4 }],
    robe: .85, seed: 21, sweep: 50 });
  // incense stall right — extra tall incense just taken
  x.fillStyle = 'rgba(60,40,28,.88)'; x.fillRect(1480, 640, 320, 280);
  for (let i = 0; i < 7; i++) {
    const ix = 1520 + i * 40; brush(x, [[ix, 900], [ix + 4, 480 - (i === 3 ? 80 : 0)]], { w: 5, dry: .25, seed: 40 + i, bristles: 5, color: i === 3 ? '184,38,29' : '40,30,22' });
    if (i === 3) { x.fillStyle = 'rgba(184,38,29,.55)'; x.beginPath(); x.ellipse(ix + 4, 400, 18, 28, 0, 0, 7); x.fill(); } // smoke on the extra stick
  }
  x.font = '32px Brush'; x.fillStyle = 'rgba(18,16,14,.9)'; x.fillText('香火', 1640, 980);
  // vendor hand offering
  figure(x, { body: [[1680, 1080], [1700, 920], [1760, 860], [1820, 900], [1840, 1080]], head: [1760, 820, 36, 42],
    hair: [[[1730, 810], [1740, 780], [1770, 770], [1790, 795], [1790, 825]]], robe: .7, seed: 33, sweep: 36 });
  seal(x, rng(2), 1780, 100, '功', .55);
  cap(x, '功德箱响一声，', '香火摊多卖一柱。', 2);
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

// №9 mall: 徽章一亮，购物车的锁就开了
const CART = { id: 'cartlock', t0: 1, t1: 2, async build() { return L(x => {
  paperBase(x, W, H, 29);
  wash(x, pth([[0, 0], [W, 0], [W, 500], [0, 560]]), { tone: .08, blur: 20, edge: 0, color: '50,60,70' });
  // floor grid
  for (let i = 0; i < 12; i++) brush(x, [[0, 620 + i * 40], [1920, 600 + i * 38]], { w: 2, dry: .5, seed: 50 + i, ink: .25, bristles: 4, color: '80,70,60' });
  // shopping cart body
  const cx = 1180, cy = 720;
  x.strokeStyle = 'rgba(30,28,26,.85)'; x.lineWidth = 8;
  x.strokeRect(cx - 200, cy - 80, 420, 220);
  // basket lines
  for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(cx - 190, cy - 60 + i * 36); x.lineTo(cx + 210, cy - 60 + i * 36); x.stroke(); }
  // wheels
  for (const [wx, wy] of [[cx - 160, cy + 180], [cx + 160, cy + 180]]) {
    brush(x, circ(wx, wy, 42, 42, 0, 6.3, 24), { w: 10, dry: .3, seed: wx, bristles: 12 });
    x.fillStyle = 'rgba(239,229,207,.9)'; x.beginPath(); x.ellipse(wx, wy, 18, 18, 0, 0, 7); x.fill();
  }
  // chain lock — OPEN, springing off
  brush(x, [[cx - 40, cy + 40], [cx + 20, cy - 10], [cx + 90, cy - 80], [cx + 160, cy - 140]], { w: 14, dry: .25, seed: 70, bristles: 10, color: '60,55,50' });
  // open shackle flying
  x.strokeStyle = 'rgba(184,38,29,.85)'; x.lineWidth = 10;
  x.beginPath(); x.arc(cx + 200, cy - 180, 50, -0.2, 3.5); x.stroke();
  // glowing badge on her chest (left figure)
  figure(x, { body: [[420, 1080], [450, 860], [520, 780], [620, 800], [680, 960], [660, 1080]], head: [540, 700, 52, 60],
    hair: [[[500, 690], [510, 630], [550, 610], [590, 640], [595, 700], [540, 675]]],
    feats: [{ pts: [[520, 700], [538, 702]], w: 7 }, { pts: [[560, 702], [578, 700]], w: 7 }, { pts: [[530, 740], [560, 738]], w: 5 }],
    robe: .8, seed: 44, sweep: 55 });
  // badge glow
  wash(x, ell(560, 820, 70, 70), { tone: .55, blur: 18, edge: .15, color: '214,170,80' });
  x.fillStyle = 'rgba(214,170,80,.95)'; x.beginPath(); x.ellipse(560, 820, 38, 38, 0, 0, 7); x.fill();
  brush(x, circ(560, 820, 40, 40, 0, 6.3, 20), { w: 5, dry: .2, seed: 8, bristles: 8, color: '120,80,20' });
  x.font = '36px Brush'; x.fillStyle = 'rgba(18,16,14,.92)'; x.textAlign = 'center'; x.fillText('善', 560, 832);
  // price tags rain
  const r = rng(6);
  for (let i = 0; i < 18; i++) {
    const tx = 900 + r() * 900, ty = 80 + r() * 500;
    x.fillStyle = '#f7efdc'; x.fillRect(tx, ty, 70, 36);
    x.strokeStyle = 'rgba(184,38,29,.5)'; x.strokeRect(tx, ty, 70, 36);
    x.fillStyle = 'rgba(18,16,14,.85)'; x.font = '20px NSerif'; x.fillText('¥', tx + 28, ty + 24);
  }
  seal(x, rng(4), 120, 100, '锁', .55);
  cap(x, '徽章一亮，', '购物车的锁就开了。', 2);
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

// №14: 「善」字裂开，露出一个「可」字
const SHAN = { id: 'shan-split', t0: 2, t1: 3, async build() { return L(x => {
  paperBase(x, W, H, 47);
  // void wash
  wash(x, ell(960, 480, 700, 420), { tone: .1, blur: 40, edge: 0, color: '40,36,32' });
  // giant 善 — split in two halves drifting apart
  x.save();
  x.font = '520px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = 'rgba(30,26,22,.55)';
  // left half clip
  x.save(); x.beginPath(); x.rect(0, 0, 930, H); x.clip();
  x.fillText('善', 900, 500); x.restore();
  // right half clip shifted
  x.save(); x.beginPath(); x.rect(990, 0, W, H); x.clip();
  x.fillText('善', 1020, 500); x.restore();
  x.restore();
  // crack glow
  wash(x, pth([[955, 120], [980, 500], [950, 880], [970, 900], [1000, 500], [975, 100]]), { tone: .7, blur: 8, edge: .2, color: '184,38,29' });
  brush(x, [[960, 140], [975, 500], [955, 860]], { w: 10, dry: .4, seed: 90, bristles: 8, color: '184,38,29' });
  // inner 可 glowing
  wash(x, ell(970, 500, 120, 120), { tone: .5, blur: 22, edge: .1, color: '214,170,80' });
  x.font = '200px Brush'; x.fillStyle = 'rgba(184,38,29,.92)'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText('可', 970, 510);
  // ink shards
  const r = rng(8);
  for (let i = 0; i < 24; i++) {
    const a = r() * 6.28, d = 180 + r() * 420;
    brush(x, [[960 + Math.cos(a) * d, 500 + Math.sin(a) * d * .7], [960 + Math.cos(a) * (d + 40), 500 + Math.sin(a) * (d + 40) * .7]], { w: 4 + r() * 8, dry: .5, seed: 100 + i, bristles: 5, ink: .6 });
  }
  seal(x, rng(1), 1760, 120, '可', .6);
  cap(x, '「善」字裂开，', '露出一个「可」字。', 2);
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

export const SHOTS = [TEMPLE, CART, SHAN];
export async function ENV() { return {}; }
export function POST() {}

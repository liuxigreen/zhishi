// STRUCTURE-v2 mood sketches only (NOT the film): courtroom / battlefield / river — proves style-ink brushes do non-table worlds in 1920x1080
import * as N from '../style-ink/scene.js';
import { rng, mkCanvas } from '../../core/util.js';
const { brush, sweepBrush, wash, pth, ell, circ, paperBase, rectPts, figure, seal } = N;
export const W = 1920, H = 1080;
const L = async fn => { const c = mkCanvas(W, H); await fn(c.getContext('2d')); return c; };
function slip(x, cx, cy, a, t, s = 1, red = true) {
  x.save(); x.translate(cx, cy); x.rotate(a); x.scale(s, s);
  x.shadowColor = 'rgba(60,40,20,.25)'; x.shadowBlur = 8; x.shadowOffsetY = 4;
  x.fillStyle = '#f7efdc'; x.fillRect(-26, -70, 52, 140); x.shadowColor = 'transparent';
  if (red) { x.strokeStyle = 'rgba(184,38,29,.6)'; x.lineWidth = 2; x.strokeRect(-21, -65, 42, 130); }
  const n = t.length, fs = Math.min(30, 120 / n); x.fillStyle = 'rgba(18,16,14,.92)'; x.font = `${fs}px Brush`; x.textAlign = 'center'; x.textBaseline = 'middle';
  [...t].forEach((ch, i) => x.fillText(ch, 0, -((n - 1) * fs) / 2 + i * fs)); x.restore();
}
function cap(x, a, b, mark) {
  x.save(); x.font = '64px Brush'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const line = (t, y, red) => { x.lineWidth = 10; x.strokeStyle = 'rgba(239,229,207,.92)'; x.strokeText(t, W / 2, y); x.fillStyle = red ? '#b8261d' : 'rgba(18,16,14,.95)'; x.fillText(t, W / 2, y); };
  if (b) { line(a, 930, mark === 1); line(b, 1010, mark === 2); } else line(a, 990, mark === 1);
  x.restore();
}
const EX = ['堵车', '加班', '临时会', '手机没电', '不是故意', '你也有错', '太忙了', '我压力大'];

// S11 courtroom: 公案, 惊堂木, 明镜高悬匾, 令签筒, 证物托盘 of excuse slips, 衙役棍
const COURT = { id: 'courtroom', t0: 0, t1: 1, async build() { return L(x => {
  paperBase(x, W, H, 31);
  wash(x, pth([[0, 0], [W, 0], [W, 640], [0, 640]]), { tone: .1, blur: 30, edge: 0, color: '60,48,36' });
  // pillars
  for (const px of [260, 1660]) { sweepBrush(x, [[px, 0], [px + 6, 540], [px, 900]], { w: 90, ink: .75, dry: .35, seed: px, bristles: 34, color: '60,22,16' }); }
  // plaque 明镜高悬
  x.fillStyle = 'rgba(30,24,18,.9)'; x.fillRect(660, 70, 600, 130); brush(x, rectPts(660, 70, 600, 130, 10), { w: 8, dry: .3, seed: 7, bristles: 10, color: '150,110,40' });
  x.font = '92px Brush'; x.fillStyle = 'rgba(214,170,80,.95)'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('明镜高悬', 960, 140);
  // judge silhouette (her) behind desk
  figure(x, { body: [[800, 640], [820, 470], [900, 420], [1020, 420], [1100, 470], [1120, 640]], head: [960, 350, 58, 70], hair: [[[900, 330], [910, 270], [960, 250], [1010, 270], [1020, 330], [990, 300], [930, 300]]],
    feats: [{ pts: [[930, 350], [950, 352]], w: 7 }, { pts: [[975, 352], [995, 350]], w: 7 }, { pts: [[945, 395], [975, 392]], w: 5 }], robe: .8, seed: 77, sweep: 60 });
  // desk 公案
  wash(x, pth([[420, 600], [1500, 600], [1540, 820], [380, 820]]), { tone: .75, blur: 4, edge: .3, color: '120,24,18' });
  sweepBrush(x, [[400, 605], [960, 598], [1520, 605]], { w: 34, ink: .9, dry: .3, seed: 41, bristles: 24 });
  // gavel 惊堂木
  x.fillStyle = 'rgba(30,22,14,.95)'; x.fillRect(560, 560, 130, 40); brush(x, rectPts(560, 560, 130, 40, 6), { w: 4, dry: .3, seed: 9, bristles: 8 });
  // 令签筒
  x.fillStyle = 'rgba(40,30,20,.9)'; x.fillRect(1290, 470, 80, 130);
  for (let i = 0; i < 5; i++) { x.save(); x.translate(1300 + i * 15, 470); x.rotate(-.2 + i * .1); x.fillStyle = '#e8dcc0'; x.fillRect(-6, -110, 12, 110); x.fillStyle = '#b8261d'; x.fillRect(-6, -110, 12, 22); x.restore(); }
  // evidence tray with slips
  x.fillStyle = 'rgba(200,180,140,.9)'; x.beginPath(); x.ellipse(960, 640, 230, 36, 0, 0, 7); x.fill(); brush(x, circ(960, 640, 232, 38, 0, 6.3, 40), { w: 6, dry: .3, seed: 12, bristles: 10 });
  EX.slice(0, 6).forEach((t, i) => slip(x, 800 + i * 64, 560 + (i % 2) * 10, -.25 + i * .1, t, .9));
  // evidence tags 证一…
  x.font = '28px NSerif'; x.fillStyle = '#b8261d'; ['证一', '证二', '证三'].forEach((t, i) => x.fillText(t, 820 + i * 130, 680));
  // 衙役 staves
  for (const [sx, a] of [[180, .08], [1740, -.08]]) { x.save(); x.translate(sx, 1080); x.rotate(a); x.fillStyle = 'rgba(20,18,16,.9)'; x.fillRect(-10, -760, 20, 760); x.fillStyle = '#b8261d'; x.fillRect(-12, -760, 24, 200); x.restore(); }
  // him small, kneeling, front
  figure(x, { body: [[860, 1080], [880, 930], [940, 890], [1000, 900], [1050, 960], [1060, 1080]], head: [950, 860, 40, 46], hair: [[[910, 845], [920, 805], [960, 795], [990, 815], [992, 850], [960, 830]]], robe: .9, seed: 88, sweep: 40 });
  seal(x, rng(3), 1800, 110, '辩', .6);
  cap(x, '原因越多，', '越像在辩护。', 2);
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

// S08 battlefield: slips sharpen into spears raining on a 怒 shield wall; 战旗, 烽烟, 城垛, 马
const BATTLE = { id: 'battlefield', t0: 1, t1: 2, async build() { return L(x => {
  paperBase(x, W, H, 41);
  wash(x, pth([[0, 380], [300, 300], [600, 360], [900, 260], [1300, 340], [1920, 280], [1920, 520], [0, 540]]), { tone: .16, blur: 18, edge: .05 });
  // smoke columns 烽烟
  for (const [sx, s] of [[300, 1], [1600, .8]]) wash(x, pth([[sx - 40, 520], [sx - 80, 300], [sx - 20, 120], [sx + 60, 40], [sx + 90, 200], [sx + 40, 520]]), { tone: .22 * s, blur: 22, edge: .04 });
  // city wall with crenels 城垛 on right
  x.fillStyle = 'rgba(60,52,44,.55)'; x.fillRect(1100, 560, 820, 520);
  for (let i = 0; i < 9; i++) x.fillRect(1110 + i * 92, 520, 56, 48);
  sweepBrush(x, [[1100, 565], [1920, 560]], { w: 26, ink: .9, dry: .35, seed: 3, bristles: 20 });
  // giant 怒 shield in front of wall
  const cx = 1460, cy = 720, R = 230;
  x.fillStyle = '#d8c39a'; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
  for (let k = 0; k < 8; k++) brush(x, circ(cx, cy, R - 18 - k * 22, R - 18 - k * 22, k * .4, k * .4 + 5.8, 30), { w: 9, dry: .6, seed: 80 + k, ink: .4, color: '110,80,40', bristles: 10 });
  wash(x, ell(cx, cy, R * .8, R * .8), { tone: .35, blur: 20, edge: .1, color: '184,38,29' });
  brush(x, circ(cx, cy, R, R, -1.6, 4.7, 48), { w: 18, dry: .35, seed: 99, bristles: 20 });
  x.font = '170px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(30,20,12,.6)'; x.fillText('怒', cx, cy + 10);
  // banners 战旗
  for (const [bx, ch] of [[1180, '她'], [1780, '守']]) { brush(x, [[bx, 560], [bx, 260]], { w: 8, dry: .2, seed: bx, bristles: 6 }); x.fillStyle = 'rgba(184,38,29,.8)'; x.beginPath(); x.moveTo(bx, 270); x.lineTo(bx + 120, 300); x.lineTo(bx, 380); x.fill(); x.fillStyle = '#f4efe6'; x.font = '44px Brush'; x.fillText(ch, bx + 40, 320); }
  // rain of spears (slip shafts) from left
  const r = rng(5);
  for (let i = 0; i < 22; i++) { const sx = 80 + r() * 900, sy = 120 + r() * 600, a = .18 + r() * .25, t = EX[i % EX.length];
    x.save(); x.translate(sx, sy); x.rotate(a); x.fillStyle = '#f2e8d2'; x.fillRect(0, -11, 220, 22); x.strokeStyle = 'rgba(184,38,29,.5)'; x.lineWidth = 2; x.strokeRect(0, -11, 220, 22);
    x.fillStyle = 'rgba(18,16,14,.9)'; x.font = '20px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(t, 110, 1);
    x.fillStyle = 'rgb(20,18,16)'; x.beginPath(); x.moveTo(220, -14); x.lineTo(280, 0); x.lineTo(220, 14); x.fill(); x.restore(); }
  // spears stuck in shield
  for (let i = 0; i < 5; i++) { x.save(); x.translate(cx - 200 + i * 10, cy - 120 + i * 60); x.rotate(.25 - i * .05); x.fillStyle = '#f2e8d2'; x.fillRect(-240, -10, 220, 20); x.fillStyle = 'rgb(20,18,16)'; x.beginPath(); x.moveTo(-20, -12); x.lineTo(30, 0); x.lineTo(-20, 12); x.fill(); x.restore(); }
  // horse + rider silhouette lower-left (him, the archer of excuses)
  wash(x, pth([[120, 920], [200, 820], [330, 800], [420, 760], [470, 790], [440, 840], [400, 900], [380, 1000], [340, 1000], [330, 920], [230, 930], [210, 1010], [170, 1010]]), { tone: .85, blur: 2, edge: .5 });
  figure(x, { body: [[250, 830], [262, 720], [300, 690], [340, 700], [355, 830]], head: [305, 655, 30, 34], robe: .9, seed: 5, sweep: 30 });
  seal(x, rng(4), 1830, 110, '责', .6);
  cap(x, '她听到的，', '是推责。', 2);
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

// S18 river: thousands of slips float downstream; 芦苇, 石桥, 月, 字条舟, 红绳
const RIVER = { id: 'river', t0: 2, t1: 3, async build() { return L(x => {
  paperBase(x, W, H, 51);
  wash(x, ell(1500, 200, 90, 90), { tone: .12, blur: 6, edge: .25 }); // moon
  wash(x, pth([[0, 420], [400, 330], [800, 400], [1200, 320], [1920, 380], [1920, 520], [0, 540]]), { tone: .13, blur: 18, edge: .05 });
  // river body (indigo hint)
  wash(x, pth([[0, 560], [700, 520], [1300, 540], [1920, 500], [1920, 1080], [0, 1080]]), { tone: .16, blur: 20, edge: .04, color: '48,72,138' });
  for (let i = 0; i < 14; i++) brush(x, [[0, 600 + i * 34], [700, 580 + i * 36 + Math.sin(i) * 10], [1920, 560 + i * 38]], { w: 4, dry: .7, seed: 600 + i, bristles: 6, ink: .25, color: '40,50,90' });
  // stone bridge arch
  wash(x, pth([[1000, 520], [1100, 410], [1260, 380], [1420, 410], [1520, 520], [1440, 520], [1380, 450], [1260, 430], [1140, 450], [1080, 520]]), { tone: .7, blur: 2, edge: .4 });
  sweepBrush(x, [[980, 420], [1260, 372], [1540, 420]], { w: 18, ink: .9, dry: .3, seed: 61, bristles: 14 });
  // reeds
  const r = rng(9);
  for (let i = 0; i < 26; i++) { const rx = 20 + r() * 340, h = 220 + r() * 200; brush(x, [[rx, 1080], [rx + 10, 1080 - h * .6], [rx + 30 + r() * 20, 1080 - h]], { w: 5, dry: .3, seed: 700 + i, bristles: 6 }); }
  // slips floating, perspective: small far, large near
  for (let i = 0; i < 120; i++) { const tt = r(); const y = 560 + tt * tt * 480, s = .25 + tt * 1.0, xx = r() * 1920; slip(x, xx, y, Math.PI / 2 + (r() - .5) * .6, EX[i % EX.length], s * .7, true); }
  // red thread 关系 drifting, frayed
  brush(x, [[600, 900], [760, 860], [900, 905], [1050, 870], [1200, 920]], { w: 6, dry: .3, seed: 81, bristles: 8, color: '184,38,29' });
  brush(x, [[1230, 915], [1300, 900]], { w: 4, dry: .6, seed: 82, bristles: 6, color: '184,38,29' });
  // ferry lamp boat
  wash(x, pth([[1580, 700], [1780, 700], [1740, 740], [1620, 740]]), { tone: .8, blur: 2, edge: .4 });
  wash(x, ell(1680, 670, 16, 20), { tone: .7, blur: 3, edge: .3, color: '184,38,29' });
  seal(x, rng(5), 1830, 110, '流', .6);
  cap(x, '原因不会消失，', '只会顺流而下。', 0);
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

export const SHOTS = [COURT, BATTLE, RIVER];
export async function ENV() { return {}; }
export function POST() {}

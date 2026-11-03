// STRUCTURE-v1 sketches ONLY (not the film): eyewitness-wrong-face · noir landscape
// №3 雨巷 · №9 碎玻璃路面 · №11 指认室回床
import { rng, fbm, grain, vignette, mkCanvas } from '../../core/util.js';
export const W = 1920, H = 1080;
const AMB = 'rgba(255,186,96,';          // the ONE accent: sodium amber
const L = async fn => { const c = mkCanvas(W, H); await fn(c.getContext('2d')); return c; };
window.__contrast = window.__contrast || [];

function wall(x, top = '#0c1118', bot = '#06080b', s = 80, amt = 22, seed = 1) {
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, W, H);
  const id = x.getImageData(0, 0, W, H), d = id.data;
  for (let y = 0; y < H; y += 2) for (let i = 0; i < W; i += 2) { const n = (fbm(i / s + seed, y / s, 3) - .5) * amt;
    for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { const k = ((y + b) * W + i + a) * 4; d[k] += n; d[k + 1] += n; d[k + 2] += n * 1.15; } }
  x.putImageData(id, 0, 0);
}
function cone(x, lx, ly, w0, xl, xr, yb, a = .5) {
  x.save(); x.globalCompositeOperation = 'screen';
  const p = new Path2D(); p.moveTo(lx - w0, ly); p.lineTo(lx + w0, ly); p.lineTo(xr, yb); p.lineTo(xl, yb); p.closePath();
  const g = x.createLinearGradient(0, ly, 0, yb); g.addColorStop(0, AMB + a + ')'); g.addColorStop(.7, AMB + a * .3 + ')'); g.addColorStop(1, AMB + a * .08 + ')');
  x.filter = 'blur(22px)'; x.fillStyle = g; x.fill(p); x.filter = 'none'; x.restore(); return p;
}
function glow(x, cx, cy, r, a = .9) { x.save(); x.globalCompositeOperation = 'screen'; const g = x.createRadialGradient(cx, cy, 1, cx, cy, r);
  g.addColorStop(0, 'rgba(255,244,220,' + a + ')'); g.addColorStop(.25, AMB + a * .7 + ')'); g.addColorStop(1, AMB + '0)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill(); x.restore(); }
function rain(x, seed, n = 900, a = .22, x0 = 0, x1 = W) { const r = rng(seed); x.save(); x.globalCompositeOperation = 'screen'; x.lineCap = 'round';
  for (let i = 0; i < n; i++) { const px = x0 + r() * (x1 - x0), py = r() * H, l = 18 + r() * 34; x.strokeStyle = `rgba(190,200,215,${a * (.3 + r())})`; x.lineWidth = .8 + r() * 1.2;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px - l * .18, py + l); x.stroke(); } x.restore(); }
// silhouette with amber rim on one side
function sil(x, draw, dx, dy, body = ['#1a1714', '#050506'], rimA = .95, glowA = .55) {
  const m = mkCanvas(W, H), M = m.getContext('2d'); M.fillStyle = '#fff'; draw(M);
  const rimC = mkCanvas(W, H), R = rimC.getContext('2d'); R.drawImage(m, 0, 0); R.globalCompositeOperation = 'destination-out'; R.drawImage(m, dx, dy);
  R.globalCompositeOperation = 'source-in'; R.fillStyle = AMB + rimA + ')'; R.fillRect(0, 0, W, H);
  const b = mkCanvas(W, H), B = b.getContext('2d'); const g = B.createLinearGradient(0, 0, 0, H); g.addColorStop(0, body[0]); g.addColorStop(1, body[1]);
  B.fillStyle = g; B.fillRect(0, 0, W, H); B.globalCompositeOperation = 'destination-in'; B.drawImage(m, 0, 0);
  x.drawImage(b, 0, 0); x.drawImage(rimC, 0, 0); x.save(); x.globalCompositeOperation = 'screen'; x.globalAlpha = glowA; x.filter = 'blur(9px)'; x.drawImage(rimC, 0, 0); x.restore(); x.filter = 'none';
}
// face: lit skin oval, TWO eyes, brows + mouth by emotion; look = pupil offset (-1..1)
function face(x, cx, cy, r, emo = 'neutral', look = 0, lit = .6, tilt = 0) {
  x.save(); x.translate(cx, cy); x.rotate(tilt);
  const g = x.createRadialGradient(r * .35 * Math.sign(look || 1), -r * .2, r * .1, 0, 0, r * 1.15);
  g.addColorStop(0, `rgba(${Math.round(150 + 80 * lit)},${Math.round(110 + 60 * lit)},${Math.round(70 + 40 * lit)},1)`); g.addColorStop(1, '#2a1d14');
  x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, r * .82, r, 0, 0, 7); x.fill();
  const ex = r * .34, ey = -r * .08, ew = r * .19, eh = { neutral: .09, certain: .055, anxious: .13, hurt: .07, hollow: .07, angry: .06 }[emo] * r * 1.0;
  for (const s of [-1, 1]) { x.fillStyle = '#efe4d2'; x.beginPath(); x.ellipse(s * ex + look * r * .06, ey, ew, eh, 0, 0, 7); x.fill();
    x.fillStyle = '#120c08'; x.beginPath(); x.arc(s * ex + look * r * .12, ey + (emo === 'hurt' || emo === 'hollow' ? eh * .35 : 0), Math.min(eh * .95, ew * .5), 0, 7); x.fill();
    x.fillStyle = 'rgba(255,240,215,.9)'; x.beginPath(); x.arc(s * ex + look * r * .12 + 2, ey - 2, r * .022, 0, 7); x.fill();
    // brows
    const by = ey - r * .2; x.strokeStyle = '#140d09'; x.lineWidth = r * .065; x.lineCap = 'round'; x.beginPath();
    if (emo === 'certain' || emo === 'angry') { x.moveTo(s * (ex + ew), by - r * .04); x.lineTo(s * (ex - ew * .9), by + r * .06); }      // knitted, inner down
    else if (emo === 'anxious') { x.moveTo(s * (ex + ew), by + r * .03); x.lineTo(s * (ex - ew * .9), by - r * .08); }                    // inner up
    else if (emo === 'hurt' || emo === 'hollow') { x.moveTo(s * (ex + ew), by + r * .05); x.lineTo(s * (ex - ew), by - r * .02); }
    else { x.moveTo(s * (ex + ew), by); x.lineTo(s * (ex - ew), by - r * .01); } x.stroke(); }
  // nose shadow + mouth
  x.strokeStyle = 'rgba(40,24,14,.7)'; x.lineWidth = r * .04; x.beginPath(); x.moveTo(r * .03, -r * .02); x.lineTo(-r * .05, r * .24); x.lineTo(r * .06, r * .27); x.stroke();
  x.strokeStyle = '#1a0f0a'; x.lineWidth = r * .055; x.beginPath(); const my = r * .5;
  if (emo === 'certain' || emo === 'angry') { x.moveTo(-r * .2, my); x.lineTo(r * .2, my - r * .01); }
  else if (emo === 'anxious') { x.ellipse(0, my, r * .1, r * .07, 0, 0, 7); }
  else if (emo === 'hurt' || emo === 'hollow') { x.moveTo(-r * .18, my + r * .04); x.quadraticCurveTo(0, my - r * .04, r * .18, my + r * .04); }
  else { x.moveTo(-r * .16, my); x.quadraticCurveTo(0, my + r * .02, r * .16, my); } x.stroke();
  x.restore();
}
function lum(r, g, b) { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); }
// caption: one font (Noto Serif SC), white on dark band + ink outline; amber only on emphasis words
function cap(x, id, lines, emph = [], foot = null) {
  const fs = 66, lh = 86, n = lines.length, yb = 1000 - (foot ? 30 : 0), y0 = yb - (n - 1) * lh;
  x.save(); x.font = `600 ${fs}px NSerif`; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
  const wmax = Math.max(...lines.map(t => x.measureText(t).width));
  const bx = W / 2 - wmax / 2 - 70, by = y0 - fs - 26, bw = wmax + 140, bh = (n - 1) * lh + fs + 54 + (foot ? 52 : 0);
  const g = x.createLinearGradient(bx, 0, bx + bw, 0); g.addColorStop(0, 'rgba(4,6,9,0)'); g.addColorStop(.12, 'rgba(4,6,9,.80)'); g.addColorStop(.88, 'rgba(4,6,9,.80)'); g.addColorStop(1, 'rgba(4,6,9,0)');
  x.filter = 'blur(6px)'; x.fillStyle = g; x.fillRect(bx, by, bw, bh); x.filter = 'none';
  // measure worst-case background inside the text box (central 76% of band)
  const sx = Math.round(W / 2 - wmax / 2), sw = Math.round(wmax), sy = Math.round(y0 - fs), sh = Math.round((n - 1) * lh + fs + 14);
  const d = x.getImageData(sx, sy, sw, sh).data; const Ls = [];
  for (let i = 0; i < d.length; i += 16) Ls.push(lum(d[i], d[i + 1], d[i + 2])); Ls.sort((a, b) => a - b);
  const p98 = Ls[Math.floor(Ls.length * .98)], med = Ls[Math.floor(Ls.length * .5)];
  const white = lum(246, 241, 232), amb = lum(255, 196, 110);
  const cr = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  window.__contrast.push({ id, white_vs_bg_median: +cr(white, med).toFixed(2), white_vs_bg_p98: +cr(white, p98).toFixed(2), amber_vs_bg_p98: +cr(amb, p98).toFixed(2) });
  console.error('CONTRAST', JSON.stringify(window.__contrast.at(-1)));
  lines.forEach((t, i) => { const y = y0 + i * lh; x.lineJoin = 'round'; x.lineWidth = 10; x.strokeStyle = 'rgba(3,4,6,.92)'; x.strokeText(t, W / 2, y);
    x.fillStyle = '#f6f1e8'; x.fillText(t, W / 2, y);
    // amber emphasis words: overdraw substring in place
    for (const w of emph) { const k = t.indexOf(w); if (k < 0) continue; const full = x.measureText(t).width, pre = x.measureText(t.slice(0, k)).width, ww = x.measureText(w).width;
      x.textAlign = 'left'; x.fillStyle = '#ffc46e'; x.fillText(w, W / 2 - full / 2 + pre, y); x.textAlign = 'center';
      x.fillStyle = 'rgba(255,196,110,.9)'; x.fillRect(W / 2 - full / 2 + pre, y + 10, ww, 4); } });
  if (foot) { x.font = `500 34px NSerif`; x.fillStyle = 'rgba(230,224,214,.92)'; x.lineWidth = 6; x.strokeText(foot, W / 2, yb + 52); x.fillText(foot, W / 2, yb + 52); }
  x.restore();
}
function finish(x, seed) { vignette(x, W, H, .62); grain(x, W, H, .05, seed); }

// ── №3 雨巷：路灯坏了一半 → 只看见帽檐和一只手 ──
const ALLEY = { id: 'alley', t0: 0, t1: 1, async build() { return L(x => {
  wall(x, '#0b1017', '#05070a', 70, 20, 3);
  // left brick wall in perspective
  x.save(); x.beginPath(); x.moveTo(0, 0); x.lineTo(640, 230); x.lineTo(640, 760); x.lineTo(0, 1080); x.closePath(); x.clip();
  x.fillStyle = '#141011'; x.fillRect(0, 0, 700, H);
  for (let row = 0; row < 40; row++) { const t = row / 40; x.strokeStyle = 'rgba(70,52,40,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, t * 1080); x.lineTo(640, 230 + t * 530); x.stroke(); }
  for (let c = 0; c < 26; c++) { const px = Math.pow(c / 26, .7) * 640; x.strokeStyle = 'rgba(0,0,0,.45)'; x.beginPath(); x.moveTo(px, px * .36); x.lineTo(px, 1080 - px * .5); x.stroke(); }
  x.restore();
  // fire escape on left wall
  x.strokeStyle = '#030304'; x.lineWidth = 7; for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(120 + k * 110, 140 + k * 40); x.lineTo(240 + k * 110, 180 + k * 40); x.stroke(); }
  for (let i = 0; i < 12; i++) { x.lineWidth = 3; x.beginPath(); x.moveTo(130 + i * 38, 150 + i * 13); x.lineTo(130 + i * 38, 200 + i * 13); x.stroke(); }
  // right wall
  x.fillStyle = '#0d0c0e'; x.beginPath(); x.moveTo(1920, 0); x.lineTo(1280, 230); x.lineTo(1280, 760); x.lineTo(1920, 1080); x.fill();
  // far end of alley: faint street glow
  x.fillStyle = '#121822'; x.fillRect(640, 230, 640, 530); glow(x, 960, 560, 260, .25);
  // ground: wet, reflective
  const gg = x.createLinearGradient(0, 760, 0, H); gg.addColorStop(0, '#0e1014'); gg.addColorStop(1, '#030405'); x.fillStyle = gg;
  x.beginPath(); x.moveTo(0, 1080); x.lineTo(640, 760); x.lineTo(1280, 760); x.lineTo(1920, 1080); x.fill();
  // twin-head street lamp (right): one bulb lit, one dead & cracked
  x.strokeStyle = '#020203'; x.lineWidth = 16; x.beginPath(); x.moveTo(1500, 1080); x.lineTo(1500, 170); x.quadraticCurveTo(1500, 120, 1440, 120); x.lineTo(1300, 120); x.moveTo(1500, 170); x.quadraticCurveTo(1500, 120, 1560, 120); x.lineTo(1700, 120); x.stroke();
  for (const [lx, on] of [[1290, true], [1710, false]]) { x.fillStyle = '#050505'; x.beginPath(); x.moveTo(lx - 50, 120); x.lineTo(lx + 50, 120); x.lineTo(lx + 70, 160); x.lineTo(lx - 70, 160); x.fill();
    if (on) glow(x, lx, 166, 160, 1); else { x.fillStyle = '#1d1d20'; x.beginPath(); x.ellipse(lx, 166, 40, 12, 0, 0, 7); x.fill();
      x.strokeStyle = 'rgba(200,200,210,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(lx - 20, 160); x.lineTo(lx - 5, 172); x.lineTo(lx + 12, 162); x.lineTo(lx + 26, 174); x.stroke(); } }
  const cn = cone(x, 1290, 170, 60, 700, 1620, 1080, .55);
  // puddle reflection of the lit bulb
  x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(6px)'; x.fillStyle = AMB + '.35)'; x.beginPath(); x.ellipse(1180, 1000, 200, 26, 0, 0, 7); x.fill(); x.restore(); x.filter = 'none';
  // trash can
  sil(x, M => { M.fillRect(470, 760, 120, 170); M.beginPath(); M.ellipse(530, 760, 70, 16, 0, 0, 7); M.fill(); }, -6, 4, ['#16120f', '#040404'], .5, .3);
  // hooded thief — face fully black under brim, lit hand yanking the bag
  sil(x, M => { M.beginPath(); M.ellipse(1040, 450, 84, 96, 0, 0, 7); M.fill();               // hood
    M.beginPath(); M.moveTo(940, 470); M.quadraticCurveTo(1040, 500, 1140, 470); M.lineTo(1150, 500); M.quadraticCurveTo(1040, 530, 930, 500); M.fill(); // low brim over eyes
    M.beginPath(); M.moveTo(900, 1080); M.bezierCurveTo(880, 760, 920, 560, 1040, 540); M.bezierCurveTo(1160, 560, 1200, 760, 1190, 1080); M.fill();
    M.beginPath(); M.moveTo(940, 620); M.quadraticCurveTo(840, 640, 770, 610); M.lineTo(760, 650); M.quadraticCurveTo(860, 690, 970, 680); M.fill(); }, -9, 6, ['#1d1813', '#030303']);
  // face hole: pure black under the brim (unseen face — intentional)
  x.fillStyle = '#000'; x.beginPath(); x.ellipse(1035, 520, 50, 44, 0, 0, 7); x.fill();
  x.strokeStyle = AMB + '.9)'; x.lineWidth = 3; x.beginPath(); x.moveTo(935, 500); x.quadraticCurveTo(1040, 528, 1148, 498); x.stroke();
  // the hand (lit) gripping strap
  x.fillStyle = '#d29a5c'; x.beginPath(); x.ellipse(752, 628, 30, 22, -.3, 0, 7); x.fill(); glow(x, 752, 628, 70, .35);
  // bag + strap pulled from her hand at left edge
  x.strokeStyle = '#3a2618'; x.lineWidth = 7; x.beginPath(); x.moveTo(752, 630); x.quadraticCurveTo(620, 690, 500, 640); x.stroke();
  x.fillStyle = '#4a2c18'; x.beginPath(); x.moveTo(580, 660); x.lineTo(700, 660); x.lineTo(720, 760); x.lineTo(560, 760); x.closePath(); x.fill(); x.strokeStyle = AMB + '.9)'; x.lineWidth = 3; x.stroke();
  x.beginPath(); x.moveTo(610, 660); x.quadraticCurveTo(640, 620, 670, 660); x.stroke();
  // her hand + sleeve entering from left (only her hand — she is off frame)
  x.fillStyle = '#1e1d23'; x.beginPath(); x.moveTo(0, 590); x.lineTo(450, 620); x.lineTo(450, 676); x.lineTo(0, 700); x.fill(); x.strokeStyle = AMB + '.35)'; x.lineWidth = 2; x.stroke();
  x.fillStyle = '#b98756'; x.beginPath(); x.ellipse(482, 646, 34, 24, .2, 0, 7); x.fill();
  rain(x, 5, 1100, .26);
  finish(x, 3);
  cap(x, 'alley', ['那晚路灯坏了一半，', '她只看见帽檐和一只手。'], ['坏了一半', '帽檐和一只手']);
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

// ── №9 车祸路面：问「撞碎」→ 凭空记出碎玻璃 ──
const GLASS = { id: 'glass', t0: 1, t1: 2, async build() { return L(x => {
  wall(x, '#0a0e15', '#040507', 90, 18, 9);
  const car = (cx, cy, s, flip) => sil(x, M => { M.save(); M.translate(cx, cy); M.scale(flip ? -s : s, s);
    M.beginPath(); M.moveTo(-210, 0); M.lineTo(-200, -60); M.lineTo(-110, -70); M.lineTo(-60, -130); M.lineTo(80, -130); M.lineTo(140, -70); M.lineTo(210, -60); M.lineTo(215, 0); M.closePath(); M.fill();
    M.beginPath(); M.arc(-120, 0, 38, 0, 7); M.arc(130, 0, 38, 0, 7); M.fill(); M.restore(); }, flip ? 8 : -8, 5, ['#1b1a1d', '#050506'], .85, .4);
  // LEFT: the film screen "录像" — clean road, two cars touching, NO glass
  x.fillStyle = '#05070a'; x.fillRect(110, 160, 680, 460); x.strokeStyle = 'rgba(235,230,220,.55)'; x.lineWidth = 4; x.strokeRect(110, 160, 680, 460);
  for (let i = 0; i < 12; i++) { x.fillStyle = 'rgba(235,230,220,.35)'; x.fillRect(122 + i * 56, 168, 26, 14); x.fillRect(122 + i * 56, 598, 26, 14); }   // film perforations
  x.save(); x.beginPath(); x.rect(114, 190, 672, 400); x.clip();
  const sg = x.createLinearGradient(0, 190, 0, 590); sg.addColorStop(0, '#161c25'); sg.addColorStop(1, '#2a2620'); x.fillStyle = sg; x.fillRect(114, 190, 672, 400);
  x.fillStyle = '#1a1714'; x.fillRect(114, 480, 672, 110); x.fillStyle = 'rgba(240,230,210,.5)'; for (let i = 0; i < 6; i++) x.fillRect(130 + i * 120, 530, 60, 6);
  car(330, 500, .75, false); car(610, 500, .75, true); x.restore();
  x.font = '600 36px NSerif'; x.fillStyle = '#f6f1e8'; x.textAlign = 'left'; x.fillText('录像：没有碎玻璃', 130, 660);
  // projector beam from bottom-left corner into screen
  x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(18px)'; x.fillStyle = 'rgba(200,205,215,.07)'; x.beginPath(); x.moveTo(0, 1080); x.lineTo(110, 160); x.lineTo(790, 620); x.lineTo(80, 1080); x.fill(); x.restore(); x.filter = 'none';
  // RIGHT: the remembered road — same two cars, glass shards appear where the word lands
  const rg = x.createLinearGradient(0, 640, 0, H); rg.addColorStop(0, '#15161a'); rg.addColorStop(1, '#050506'); x.fillStyle = rg;
  x.beginPath(); x.moveTo(860, 1080); x.lineTo(1100, 600); x.lineTo(1920, 600); x.lineTo(1920, 1080); x.fill();
  x.fillStyle = 'rgba(240,230,210,.55)'; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(1160 + i * 150, 800); x.lineTo(1240 + i * 150, 800); x.lineTo(1250 + i * 150, 816); x.lineTo(1150 + i * 150, 816); x.fill(); }   // zebra
  // street lamp top-right
  x.strokeStyle = '#020203'; x.lineWidth = 12; x.beginPath(); x.moveTo(1840, 1080); x.lineTo(1840, 120); x.lineTo(1700, 120); x.stroke(); glow(x, 1690, 140, 150, .95);
  cone(x, 1690, 145, 40, 1150, 1920, 1000, .42);
  car(1300, 720, 1.0, false); car(1680, 720, 1.0, true);
  // questionnaire sheet top-middle with the word 「撞碎」 lit and falling
  x.save(); x.translate(1020, 150); x.rotate(-.06); x.fillStyle = '#e9e1d2'; x.fillRect(0, 0, 360, 220);
  x.fillStyle = '#25201b'; x.font = '500 30px NSerif'; x.fillText('问卷', 22, 44); x.font = '500 26px NSerif'; x.fillText('两车 ______ 时，', 22, 96); x.fillText('车速大约多少？', 22, 136);
  x.strokeStyle = '#25201b'; x.lineWidth = 2; x.strokeRect(118, 70, 100, 34); x.restore();
  // the word block falling from the blank, trailing amber, to the crash point
  x.save(); x.strokeStyle = AMB + '.55)'; x.setLineDash([10, 12]); x.lineWidth = 3; x.beginPath(); x.moveTo(1180, 270); x.quadraticCurveTo(1330, 330, 1460, 420); x.stroke(); x.restore();
  x.save(); x.translate(1470, 470); x.rotate(.08); x.fillStyle = '#1a120b'; x.fillRect(-90, -44, 180, 88); x.strokeStyle = AMB + '1)'; x.lineWidth = 4; x.strokeRect(-90, -44, 180, 88);
  x.fillStyle = '#ffc46e'; x.font = '600 56px NSerif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('撞碎', 0, 2); x.restore(); glow(x, 1470, 470, 150, .35);
  // glass shards spawned around the impact
  const r = rng(21); for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = 30 + r() * 300; const px = 1490 + Math.cos(a) * d, py = 745 + Math.sin(a) * d * .25; const s = 6 + r() * 16;
    x.save(); x.translate(px, py); x.rotate(r() * 6.28); x.beginPath(); x.moveTo(0, -s); x.lineTo(s * .7, s * .3); x.lineTo(-s * .5, s * .6); x.closePath();
    x.fillStyle = `rgba(255,${200 + r() * 40},${140 + r() * 60},${.55 + r() * .4})`; x.fill(); x.restore(); }
  glow(x, 1490, 745, 220, .28);
  x.font = '600 36px NSerif'; x.fillStyle = '#f6f1e8'; x.textAlign = 'right'; x.fillText('被问「撞碎」的人：我看见了碎玻璃', 1890, 560);
  rain(x, 9, 400, .12, 860, 1920);
  finish(x, 9);
  cap(x, 'glass', ['录像里没有碎玻璃，', '被问「撞碎」的人却说看见了。'], ['撞碎'], '据 Loftus & Palmer 1974 · 简化模型');
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

// ── №11 指认室·回床中：只有三号戴画像那顶帽子 ──
const LINEUP = { id: 'lineup', t0: 2, t1: 3, async build() { return L(x => {
  wall(x, '#090c12', '#030406', 90, 14, 11);
  // one-way glass window (right 2/3), lineup room behind, amber-lit
  const gx = 560, gy = 90, gw = 1300, gh = 760;
  x.save(); x.beginPath(); x.rect(gx, gy, gw, gh); x.clip();
  const lg = x.createLinearGradient(0, gy, 0, gy + gh); lg.addColorStop(0, '#2e271f'); lg.addColorStop(1, '#14110d'); x.fillStyle = lg; x.fillRect(gx, gy, gw, gh);
  // height chart lines
  x.strokeStyle = 'rgba(255,214,160,.28)'; x.lineWidth = 2; x.font = '500 22px NSerif'; x.fillStyle = 'rgba(255,214,160,.55)';
  for (let i = 0; i < 9; i++) { const y = gy + 120 + i * 70; x.beginPath(); x.moveTo(gx, y); x.lineTo(gx + gw, y); x.stroke(); x.fillText(String(190 - i * 10), gx + 14, y - 6); }
  cone(x, gx + gw * .5, gy, 400, gx, gx + gw, gy + gh, .25);
  // five men
  const men = [ { x: 840, h: 300, emo: 'neutral', hat: 'cap0' }, { x: 1060, h: 290, emo: 'neutral', hat: null }, { x: 1280, h: 296, emo: 'anxious', hat: 'hood' }, { x: 1500, h: 306, emo: 'neutral', hat: 'beanie' }, { x: 1720, h: 288, emo: 'neutral', hat: null } ];
  men.forEach((m, i) => { const hy = 330 + (300 - m.h);
    if (i === 2) cone(x, m.x, gy, 50, m.x - 200, m.x + 200, gy + gh, .42);
    sil(x, M => { M.beginPath(); M.moveTo(m.x - 120, gy + gh); M.bezierCurveTo(m.x - 125, hy + 200, m.x - 95, hy + 120, m.x, hy + 110); M.bezierCurveTo(m.x + 95, hy + 120, m.x + 125, hy + 200, m.x + 120, gy + gh); M.fill(); }, 0, -6, ['#2a2219', '#0b0907'], .7, .3);
    face(x, m.x, hy + 40, 62, m.emo, 0, i === 2 ? .95 : .55);
    if (m.hat === 'hood') { x.fillStyle = '#16110c'; x.beginPath(); x.moveTo(m.x - 82, hy + 40); x.bezierCurveTo(m.x - 90, hy - 70, m.x + 90, hy - 70, m.x + 82, hy + 40); x.lineTo(m.x + 70, hy + 10); x.bezierCurveTo(m.x + 60, hy - 40, m.x - 60, hy - 40, m.x - 70, hy + 10); x.fill();
      x.beginPath(); x.moveTo(m.x - 96, hy - 6); x.quadraticCurveTo(m.x, hy - 48, m.x + 96, hy - 6); x.lineTo(m.x + 100, hy + 6); x.quadraticCurveTo(m.x, hy - 28, m.x - 100, hy + 6); x.fill();
      x.strokeStyle = AMB + '.95)'; x.lineWidth = 3; x.stroke(); }
    if (m.hat === 'cap0') { x.fillStyle = '#3a3a40'; x.beginPath(); x.ellipse(m.x, hy - 18, 58, 22, 0, Math.PI, 0); x.fill(); }
    if (m.hat === 'beanie') { x.fillStyle = '#2b3138'; x.beginPath(); x.ellipse(m.x, hy - 14, 56, 34, 0, Math.PI, 0); x.fill(); }
    // number card
    x.fillStyle = '#ece4d4'; x.fillRect(m.x - 46, hy + 160, 92, 70); x.fillStyle = '#1b1510'; x.font = '600 52px NSerif'; x.textAlign = 'center'; x.fillText(String(i + 1), m.x, hy + 214); x.textAlign = 'left'; });
  // train-ticket stub clipped under #3's card
  x.save(); x.translate(1282, 562); x.rotate(.1); x.fillStyle = '#e2d2ae'; x.fillRect(-80, 0, 160, 66); x.fillStyle = '#3a2a1a'; x.font = '600 24px NSerif'; x.textAlign = 'center'; x.fillText('车票 · 案发当晚', 0, 28); x.fillText('当晚在外地', 0, 56); x.restore();
  x.restore();
  // glass reflection sheen + frame
  x.save(); x.globalCompositeOperation = 'screen'; const sh = x.createLinearGradient(gx, gy, gx + gw, gy + gh); sh.addColorStop(0, 'rgba(160,180,200,.10)'); sh.addColorStop(.3, 'rgba(160,180,200,0)'); sh.addColorStop(.62, 'rgba(160,180,200,.06)'); sh.addColorStop(1, 'rgba(160,180,200,0)'); x.fillStyle = sh; x.fillRect(gx, gy, gw, gh); x.restore();
  x.strokeStyle = '#020203'; x.lineWidth = 26; x.strokeRect(gx, gy, gw, gh);
  // composite sketch taped on the glass (top-left of window): same hood
  x.save(); x.translate(600, 120); x.rotate(-.05); x.scale(.82, .82); x.fillStyle = '#e6dfd0'; x.fillRect(0, 0, 200, 240);
  x.strokeStyle = '#2a241e'; x.lineWidth = 3; x.beginPath(); x.ellipse(100, 130, 54, 66, 0, 0, 7); x.stroke();
  x.beginPath(); x.moveTo(36, 110); x.quadraticCurveTo(100, 40, 164, 110); x.stroke(); x.lineWidth = 6; x.beginPath(); x.moveTo(30, 104); x.quadraticCurveTo(100, 60, 170, 104); x.stroke();
  x.lineWidth = 3; for (const s of [-1, 1]) { x.beginPath(); x.ellipse(100 + s * 22, 128, 10, 5, 0, 0, 7); x.stroke(); } x.beginPath(); x.moveTo(84, 168); x.lineTo(116, 168); x.stroke();
  x.fillStyle = '#2a241e'; x.font = '500 22px NSerif'; x.textAlign = 'center'; x.fillText('嫌犯画像', 100, 228);
  x.fillStyle = 'rgba(220,210,180,.7)'; x.fillRect(80, -10, 40, 20); x.restore();
  // her (foreground left, our dark side): 3/4 view, two eyes, certain; finger pointing at #3
  sil(x, M => { M.beginPath(); M.moveTo(40, 1080); M.bezierCurveTo(30, 820, 120, 700, 260, 690); M.bezierCurveTo(400, 700, 470, 820, 470, 1080); M.fill();
    M.beginPath(); M.moveTo(360, 760); M.quadraticCurveTo(520, 640, 640, 560); M.lineTo(660, 590); M.quadraticCurveTo(540, 690, 420, 820); M.fill(); }, 10, 6, ['#1a1716', '#040404'], .9, .55);
  // hair back
  x.fillStyle = '#0b0807'; x.beginPath(); x.ellipse(250, 560, 112, 126, 0, 0, 7); x.fill();
  face(x, 268, 585, 92, 'certain', 1, .85, .05);
  x.fillStyle = '#0b0807'; x.beginPath(); x.moveTo(160, 500); x.quadraticCurveTo(260, 420, 360, 510); x.quadraticCurveTo(300, 480, 200, 530); x.fill();
  x.fillStyle = '#c99062'; x.beginPath(); x.ellipse(662, 572, 22, 14, -.6, 0, 7); x.fill(); glow(x, 668, 566, 60, .3);
  // dashed sightline from finger to #3
  x.save(); x.strokeStyle = AMB + '.55)'; x.setLineDash([12, 14]); x.lineWidth = 3; x.beginPath(); x.moveTo(690, 556); x.lineTo(1215, 400); x.stroke(); x.restore();
  // table edge with papers in foreground
  x.fillStyle = '#0a0807'; x.fillRect(0, 900, W, 180); x.fillStyle = AMB + '.25)'; x.fillRect(0, 900, W, 3);
  finish(x, 11);
  cap(x, 'lineup', ['她第二次站到玻璃前，', '五个人里只有三号戴着画像那顶帽子。'], ['三号', '那顶帽子']);
}); }, frame(ctx, lt, st) { ctx.drawImage(st, 0, 0); } };

export const SHOTS = [ALLEY, GLASS, LINEUP];
export async function ENV() { return {}; }
export function POST() {}

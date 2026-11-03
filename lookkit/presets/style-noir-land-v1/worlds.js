// style-noir-land-v1 · 22 worlds · STRUCTURE-v1 APPROVED
import { W, H, L, AMB, wall, cone, glow, rain, sil, face, ticket, finish, rng, mkCanvas } from './helpers.js';

function hoodThief(x, hx, hy, s = 1) {
  sil(x, M => {
    M.save(); M.translate(hx, hy); M.scale(s, s);
    M.beginPath(); M.ellipse(0, -90, 84, 96, 0, 0, 7); M.fill();
    M.beginPath(); M.moveTo(-100, -70); M.quadraticCurveTo(0, -40, 100, -70); M.lineTo(110, -40); M.quadraticCurveTo(0, -10, -110, -40); M.fill();
    M.beginPath(); M.moveTo(-140, 200); M.bezierCurveTo(-160, -20, -80, -40, 0, -50); M.bezierCurveTo(80, -40, 160, -20, 140, 200); M.fill();
    M.restore();
  }, -9, 6, ['#1d1813', '#030303']);
  x.fillStyle = '#000'; x.beginPath(); x.ellipse(hx, hy - 30, 50 * s, 44 * s, 0, 0, 7); x.fill();
  x.strokeStyle = AMB + '.9)'; x.lineWidth = 3; x.beginPath(); x.moveTo(hx - 100 * s, hy - 50 * s); x.quadraticCurveTo(hx, hy - 22 * s, hx + 100 * s, hy - 52 * s); x.stroke();
}
function lineupGlass(x, gx, gy, gw, gh, highlight = 2, showTicket = true, hats = true) {
  x.save(); x.beginPath(); x.rect(gx, gy, gw, gh); x.clip();
  const lg = x.createLinearGradient(0, gy, 0, gy + gh); lg.addColorStop(0, '#2e271f'); lg.addColorStop(1, '#14110d'); x.fillStyle = lg; x.fillRect(gx, gy, gw, gh);
  x.strokeStyle = 'rgba(255,214,160,.28)'; x.lineWidth = 2; x.font = '500 22px NSerif'; x.fillStyle = 'rgba(255,214,160,.55)';
  for (let i = 0; i < 9; i++) { const y = gy + 120 + i * 70; x.beginPath(); x.moveTo(gx, y); x.lineTo(gx + gw, y); x.stroke(); x.fillText(String(190 - i * 10), gx + 14, y - 6); }
  cone(x, gx + gw * .5, gy, 400, gx, gx + gw, gy + gh, .25);
  const men = [
    { x: gx + 180, h: 300, emo: 'neutral', hat: 'cap0' },
    { x: gx + 400, h: 290, emo: 'neutral', hat: null },
    { x: gx + 620, h: 296, emo: 'anxious', hat: 'hood' },
    { x: gx + 840, h: 306, emo: 'neutral', hat: 'beanie' },
    { x: gx + 1060, h: 288, emo: 'neutral', hat: null }
  ];
  men.forEach((m, i) => {
    const hy = gy + 240 + (300 - m.h);
    if (i === highlight) cone(x, m.x, gy, 50, m.x - 200, m.x + 200, gy + gh, .42);
    sil(x, M => { M.beginPath(); M.moveTo(m.x - 120, gy + gh); M.bezierCurveTo(m.x - 125, hy + 200, m.x - 95, hy + 120, m.x, hy + 110); M.bezierCurveTo(m.x + 95, hy + 120, m.x + 125, hy + 200, m.x + 120, gy + gh); M.fill(); }, 0, -6, ['#2a2219', '#0b0907'], .7, .3);
    face(x, m.x, hy + 40, 58, m.emo, 0, i === highlight ? .95 : .55);
    if (hats && m.hat === 'hood') {
      x.fillStyle = '#16110c'; x.beginPath(); x.moveTo(m.x - 82, hy + 40); x.bezierCurveTo(m.x - 90, hy - 70, m.x + 90, hy - 70, m.x + 82, hy + 40); x.lineTo(m.x + 70, hy + 10); x.bezierCurveTo(m.x + 60, hy - 40, m.x - 60, hy - 40, m.x - 70, hy + 10); x.fill();
      x.beginPath(); x.moveTo(m.x - 96, hy - 6); x.quadraticCurveTo(m.x, hy - 48, m.x + 96, hy - 6); x.lineTo(m.x + 100, hy + 6); x.quadraticCurveTo(m.x, hy - 28, m.x - 100, hy + 6); x.fill();
      x.strokeStyle = AMB + '.95)'; x.lineWidth = 3; x.stroke();
    }
    if (hats && m.hat === 'cap0') { x.fillStyle = '#3a3a40'; x.beginPath(); x.ellipse(m.x, hy - 18, 58, 22, 0, Math.PI, 0); x.fill(); }
    if (hats && m.hat === 'beanie') { x.fillStyle = '#2b3138'; x.beginPath(); x.ellipse(m.x, hy - 14, 56, 34, 0, Math.PI, 0); x.fill(); }
    x.fillStyle = '#ece4d4'; x.fillRect(m.x - 46, hy + 160, 92, 70); x.fillStyle = '#1b1510'; x.font = '600 52px NSerif'; x.textAlign = 'center'; x.fillText(String(i + 1), m.x, hy + 214);
    if (showTicket && i === 2) ticket(x, m.x + 2, hy + 250, .1, .85);
  });
  x.restore();
  x.save(); x.globalCompositeOperation = 'screen'; const sh = x.createLinearGradient(gx, gy, gx + gw, gy + gh); sh.addColorStop(0, 'rgba(160,180,200,.10)'); sh.addColorStop(.3, 'rgba(160,180,200,0)'); sh.addColorStop(.62, 'rgba(160,180,200,.06)'); sh.addColorStop(1, 'rgba(160,180,200,0)'); x.fillStyle = sh; x.fillRect(gx, gy, gw, gh); x.restore();
  x.strokeStyle = '#020203'; x.lineWidth = 26; x.strokeRect(gx, gy, gw, gh);
}
function sketchOnGlass(x, ox, oy) {
  x.save(); x.translate(ox, oy); x.rotate(-.05); x.scale(.82, .82); x.fillStyle = '#e6dfd0'; x.fillRect(0, 0, 200, 240);
  x.strokeStyle = '#2a241e'; x.lineWidth = 3; x.beginPath(); x.ellipse(100, 130, 54, 66, 0, 0, 7); x.stroke();
  x.beginPath(); x.moveTo(36, 110); x.quadraticCurveTo(100, 40, 164, 110); x.stroke(); x.lineWidth = 6; x.beginPath(); x.moveTo(30, 104); x.quadraticCurveTo(100, 60, 170, 104); x.stroke();
  x.lineWidth = 3; for (const s of [-1, 1]) { x.beginPath(); x.ellipse(100 + s * 22, 128, 10, 5, 0, 0, 7); x.stroke(); } x.beginPath(); x.moveTo(84, 168); x.lineTo(116, 168); x.stroke();
  x.fillStyle = '#2a241e'; x.font = '500 22px NSerif'; x.textAlign = 'center'; x.fillText('嫌犯画像', 100, 228);
  x.fillStyle = 'rgba(220,210,180,.7)'; x.fillRect(80, -10, 40, 20); x.restore();
}
function herPointing(x, bx = 260) {
  sil(x, M => { M.beginPath(); M.moveTo(40, 1080); M.bezierCurveTo(30, 820, 120, 700, bx, 690); M.bezierCurveTo(bx + 140, 700, bx + 210, 820, bx + 210, 1080); M.fill();
    M.beginPath(); M.moveTo(bx + 100, 760); M.quadraticCurveTo(bx + 260, 640, bx + 380, 560); M.lineTo(bx + 400, 590); M.quadraticCurveTo(bx + 280, 690, bx + 160, 820); M.fill(); }, 10, 6, ['#1a1716', '#040404'], .9, .55);
  x.fillStyle = '#0b0807'; x.beginPath(); x.ellipse(bx - 10, 560, 112, 126, 0, 0, 7); x.fill();
  face(x, bx + 8, 585, 92, 'certain', 1, .85, .05);
  x.fillStyle = '#0b0807'; x.beginPath(); x.moveTo(bx - 100, 500); x.quadraticCurveTo(bx, 420, bx + 100, 510); x.quadraticCurveTo(bx + 40, 480, bx - 60, 530); x.fill();
  x.fillStyle = '#c99062'; x.beginPath(); x.ellipse(bx + 402, 572, 22, 14, -.6, 0, 7); x.fill(); glow(x, bx + 408, 566, 60, .3);
}

export async function W01_lineup() {
  return L(x => {
    wall(x, '#090c12', '#030406', 90, 14, 1);
    lineupGlass(x, 520, 80, 1320, 780, 2, true, true);
    herPointing(x, 250);
    x.save(); x.strokeStyle = AMB + '.55)'; x.setLineDash([12, 14]); x.lineWidth = 3; x.beginPath(); x.moveTo(650, 556); x.lineTo(1140, 380); x.stroke(); x.restore();
    x.fillStyle = '#0a0807'; x.fillRect(0, 900, W, 180); x.fillStyle = AMB + '.25)'; x.fillRect(0, 900, W, 3);
    finish(x, 1);
  });
}
export async function W02_reflection() {
  return L(x => {
    wall(x, '#0a0e14', '#040608', 70, 16, 2);
    // huge glass; her eyes reflection left, #3 cuffs right
    x.fillStyle = '#121820'; x.fillRect(80, 100, 1760, 780);
    x.strokeStyle = '#020203'; x.lineWidth = 20; x.strokeRect(80, 100, 1760, 780);
    // reflection sheen
    x.save(); x.globalCompositeOperation = 'screen'; const g = x.createLinearGradient(80, 100, 1840, 880); g.addColorStop(0, 'rgba(160,180,200,.12)'); g.addColorStop(.4, 'rgba(160,180,200,0)'); g.addColorStop(1, 'rgba(160,180,200,.08)'); x.fillStyle = g; x.fillRect(80, 100, 1760, 780); x.restore();
    face(x, 420, 420, 160, 'certain', .4, .9);
    // fingerprint smudges
    const r = rng(2); for (let i = 0; i < 8; i++) { x.strokeStyle = `rgba(200,190,170,${.08 + r() * .1})`; x.lineWidth = 1; x.beginPath(); for (let k = 0; k < 5; k++) x.ellipse(280 + r() * 280, 280 + r() * 320, 20 + k * 8, 28 + k * 10, r(), 0, 7); x.stroke(); }
    // #3 behind glass right with cuffs
    sil(x, M => { M.beginPath(); M.moveTo(1280, 880); M.bezierCurveTo(1260, 600, 1320, 420, 1480, 400); M.bezierCurveTo(1640, 420, 1700, 600, 1680, 880); M.fill(); }, -8, 5, ['#2a2219', '#0b0907']);
    face(x, 1480, 360, 70, 'anxious', -.3, .7);
    // handcuffs tightening (visual: chain + lock click)
    x.strokeStyle = '#c8b090'; x.lineWidth = 10; x.beginPath(); x.ellipse(1420, 620, 40, 28, .2, 0, 7); x.stroke(); x.beginPath(); x.ellipse(1540, 620, 40, 28, -.2, 0, 7); x.stroke();
    x.strokeStyle = AMB + '.9)'; x.lineWidth = 4; x.beginPath(); x.moveTo(1460, 620); x.lineTo(1500, 620); x.stroke();
    x.fillStyle = '#d4c4a0'; x.beginPath(); x.arc(1480, 620, 14, 0, 7); x.fill(); glow(x, 1480, 620, 50, .4);
    glow(x, 960, 120, 200, .35); // sodium top lamp
    finish(x, 2);
  });
}
export async function W03_alley() {
  return L(x => {
    wall(x, '#0b1017', '#05070a', 70, 20, 3);
    x.save(); x.beginPath(); x.moveTo(0, 0); x.lineTo(640, 230); x.lineTo(640, 760); x.lineTo(0, 1080); x.closePath(); x.clip();
    x.fillStyle = '#141011'; x.fillRect(0, 0, 700, H);
    for (let row = 0; row < 40; row++) { const t = row / 40; x.strokeStyle = 'rgba(70,52,40,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, t * 1080); x.lineTo(640, 230 + t * 530); x.stroke(); }
    x.restore();
    x.strokeStyle = '#030304'; x.lineWidth = 7; for (let k = 0; k < 4; k++) { x.beginPath(); x.moveTo(120 + k * 110, 140 + k * 40); x.lineTo(240 + k * 110, 180 + k * 40); x.stroke(); }
    x.fillStyle = '#0d0c0e'; x.beginPath(); x.moveTo(1920, 0); x.lineTo(1280, 230); x.lineTo(1280, 760); x.lineTo(1920, 1080); x.fill();
    x.fillStyle = '#121822'; x.fillRect(640, 230, 640, 530); glow(x, 960, 560, 260, .25);
    const gg = x.createLinearGradient(0, 760, 0, H); gg.addColorStop(0, '#0e1014'); gg.addColorStop(1, '#030405'); x.fillStyle = gg;
    x.beginPath(); x.moveTo(0, 1080); x.lineTo(640, 760); x.lineTo(1280, 760); x.lineTo(1920, 1080); x.fill();
    x.strokeStyle = '#020203'; x.lineWidth = 16; x.beginPath(); x.moveTo(1500, 1080); x.lineTo(1500, 170); x.quadraticCurveTo(1500, 120, 1440, 120); x.lineTo(1300, 120); x.moveTo(1500, 170); x.quadraticCurveTo(1500, 120, 1560, 120); x.lineTo(1700, 120); x.stroke();
    for (const [lx, on] of [[1290, true], [1710, false]]) {
      x.fillStyle = '#050505'; x.beginPath(); x.moveTo(lx - 50, 120); x.lineTo(lx + 50, 120); x.lineTo(lx + 70, 160); x.lineTo(lx - 70, 160); x.fill();
      if (on) glow(x, lx, 166, 160, 1); else { x.fillStyle = '#1d1d20'; x.beginPath(); x.ellipse(lx, 166, 40, 12, 0, 0, 7); x.fill();
        x.strokeStyle = 'rgba(200,200,210,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(lx - 20, 160); x.lineTo(lx - 5, 172); x.lineTo(lx + 12, 162); x.lineTo(lx + 26, 174); x.stroke(); }
    }
    cone(x, 1290, 170, 60, 700, 1620, 1080, .55);
    x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(6px)'; x.fillStyle = AMB + '.35)'; x.beginPath(); x.ellipse(1180, 1000, 200, 26, 0, 0, 7); x.fill(); x.restore(); x.filter = 'none';
    sil(x, M => { M.fillRect(470, 760, 120, 170); M.beginPath(); M.ellipse(530, 760, 70, 16, 0, 0, 7); M.fill(); }, -6, 4, ['#16120f', '#040404'], .5, .3);
    hoodThief(x, 1040, 540, 1);
    x.fillStyle = '#d29a5c'; x.beginPath(); x.ellipse(752, 628, 30, 22, -.3, 0, 7); x.fill(); glow(x, 752, 628, 70, .35);
    x.strokeStyle = '#3a2618'; x.lineWidth = 7; x.beginPath(); x.moveTo(752, 630); x.quadraticCurveTo(620, 690, 500, 640); x.stroke();
    x.fillStyle = '#4a2c18'; x.beginPath(); x.moveTo(580, 660); x.lineTo(700, 660); x.lineTo(720, 760); x.lineTo(560, 760); x.closePath(); x.fill(); x.strokeStyle = AMB + '.9)'; x.lineWidth = 3; x.stroke();
    x.fillStyle = '#1e1d23'; x.beginPath(); x.moveTo(0, 590); x.lineTo(450, 620); x.lineTo(450, 676); x.lineTo(0, 700); x.fill();
    x.fillStyle = '#b98756'; x.beginPath(); x.ellipse(482, 646, 34, 24, .2, 0, 7); x.fill();
    rain(x, 5, 1100, .26); finish(x, 3);
  });
}
export async function W04_darkroom() {
  return L(x => {
    wall(x, '#1a0e0a', '#080404', 60, 18, 4);
    glow(x, 1600, 180, 220, .55); // amber safelight
    x.fillStyle = '#3a2010'; x.beginPath(); x.arc(1600, 160, 40, 0, 7); x.fill();
    // developing tray
    x.fillStyle = '#1a1410'; x.fillRect(200, 620, 900, 280); x.strokeStyle = AMB + '.4)'; x.lineWidth = 3; x.strokeRect(200, 620, 900, 280);
    x.fillStyle = 'rgba(40,80,60,.35)'; x.fillRect(220, 640, 860, 240);
    // film strip hanging / in tray — face frame blank
    const frames = 5; for (let i = 0; i < frames; i++) {
      const fx = 260 + i * 160, fy = 300;
      x.fillStyle = '#0a0806'; x.fillRect(fx, fy, 140, 180);
      x.fillStyle = 'rgba(235,230,220,.35)'; x.fillRect(fx + 8, fy - 16, 24, 12); x.fillRect(fx + 108, fy - 16, 24, 12);
      x.fillRect(fx + 8, fy + 184, 24, 12); x.fillRect(fx + 108, fy + 184, 24, 12);
      if (i === 2) { // blank face
        x.fillStyle = '#f0ebe0'; x.fillRect(fx + 16, fy + 20, 108, 140);
        x.strokeStyle = AMB + '.9)'; x.lineWidth = 4; x.strokeRect(fx + 16, fy + 20, 108, 140);
        x.fillStyle = '#c8a070'; x.font = '600 28px NSerif'; x.textAlign = 'center'; x.fillText('空', fx + 70, fy + 100);
      } else {
        x.fillStyle = '#2a2218'; x.fillRect(fx + 16, fy + 20, 108, 140);
        if (i === 0) { x.fillStyle = '#1a1510'; x.fillRect(fx + 30, fy + 90, 80, 50); } // bag
        if (i === 1) { x.fillStyle = '#d29a5c'; x.beginPath(); x.ellipse(fx + 70, fy + 100, 28, 20, 0, 0, 7); x.fill(); } // hand
        if (i === 3) { x.strokeStyle = '#888'; x.lineWidth = 8; x.beginPath(); x.moveTo(fx + 40, fy + 40); x.lineTo(fx + 100, fy + 50); x.stroke(); } // brim
        if (i === 4) { x.fillStyle = '#3a2a18'; x.fillRect(fx + 40, fy + 60, 60, 70); } // trash
      }
    }
    // clips
    for (let i = 0; i < 5; i++) { x.fillStyle = '#c8b090'; x.fillRect(310 + i * 160, 270, 20, 30); }
    finish(x, 4);
  });
}
export async function W05_lamp() {
  return L(x => {
    wall(x, '#0c1016', '#050608', 80, 16, 5);
    // desk + interrogation lamp
    x.fillStyle = '#1a1410'; x.fillRect(0, 720, W, 360);
    x.strokeStyle = '#020203'; x.lineWidth = 14; x.beginPath(); x.moveTo(960, 720); x.lineTo(960, 280); x.quadraticCurveTo(960, 200, 1100, 180); x.stroke();
    x.fillStyle = '#1a120c'; x.beginPath(); x.moveTo(1040, 160); x.lineTo(1280, 200); x.lineTo(1240, 280); x.lineTo(1000, 240); x.closePath(); x.fill();
    glow(x, 1160, 260, 280, 1); cone(x, 1160, 260, 80, 600, 1700, 900, .55);
    // blank film cell on desk
    x.fillStyle = '#f0ebe0'; x.fillRect(520, 780, 200, 240); x.strokeStyle = '#2a241e'; x.lineWidth = 3; x.strokeRect(520, 780, 200, 240);
    // question slip falling into cell
    x.save(); x.translate(780, 520); x.rotate(-.2); x.fillStyle = '#ece4d4'; x.fillRect(-160, -40, 320, 80);
    x.fillStyle = '#1b1510'; x.font = '600 32px NSerif'; x.textAlign = 'center'; x.fillText('他是不是很凶？', 0, 12); x.restore();
    x.strokeStyle = AMB + '.5)'; x.setLineDash([8, 10]); x.lineWidth = 3; x.beginPath(); x.moveTo(780, 560); x.lineTo(640, 820); x.stroke(); x.setLineDash([]);
    // angry face growing in blank
    face(x, 620, 900, 70, 'angry', 0, .95);
    // recorder + coffee
    x.fillStyle = '#2a241e'; x.fillRect(1200, 780, 160, 90); x.fillStyle = AMB + '.6)'; x.beginPath(); x.arc(1280, 825, 18, 0, 7); x.fill();
    x.fillStyle = '#3a2a18'; x.beginPath(); x.ellipse(1500, 820, 40, 28, 0, 0, 7); x.fill(); x.fillStyle = '#1a1008'; x.beginPath(); x.ellipse(1500, 815, 28, 18, 0, 0, 7); x.fill();
    finish(x, 5);
  });
}
export async function W06_tvwall() {
  return L(x => {
    wall(x, '#0a0c10', '#040508', 90, 14, 6);
    // TV wall grid
    for (let row = 0; row < 3; row++) for (let col = 0; col < 4; col++) {
      const tx = 120 + col * 420, ty = 80 + row * 280;
      x.fillStyle = '#050608'; x.fillRect(tx, ty, 380, 240);
      x.strokeStyle = '#1a1c20'; x.lineWidth = 8; x.strokeRect(tx, ty, 380, 240);
      if (row === 1 && col === 1) {
        glow(x, tx + 190, ty + 120, 180, .7);
        // composite sketch fills
        x.fillStyle = '#e6dfd0'; x.fillRect(tx + 90, ty + 30, 200, 180);
        x.strokeStyle = '#2a241e'; x.lineWidth = 3; x.beginPath(); x.ellipse(tx + 190, ty + 110, 50, 60, 0, 0, 7); x.stroke();
        x.lineWidth = 6; x.beginPath(); x.moveTo(tx + 130, ty + 80); x.quadraticCurveTo(tx + 190, ty + 40, tx + 250, ty + 80); x.stroke();
        face(x, tx + 190, ty + 120, 40, 'angry', 0, .8);
        x.fillStyle = '#f6f1e8'; x.font = '500 22px NSerif'; x.textAlign = 'center'; x.fillText('早间新闻 · 嫌犯画像', tx + 190, ty + 220);
      } else {
        x.fillStyle = 'rgba(40,50,60,.4)'; x.fillRect(tx + 20, ty + 20, 340, 200);
        x.fillStyle = 'rgba(200,200,210,.15)'; x.font = '500 20px NSerif'; x.fillText('……', tx + 190, ty + 130);
      }
    }
    // blank film cell being overwritten (bottom)
    x.fillStyle = '#f0ebe0'; x.fillRect(700, 880, 160, 160);
    face(x, 780, 960, 50, 'angry', 0, .9);
    x.strokeStyle = AMB + '.8)'; x.lineWidth = 3; x.strokeRect(700, 880, 160, 160);
    finish(x, 6);
  });
}
export async function W07_neighbors() {
  return L(x => {
    wall(x, '#0b0e14', '#05070a', 70, 16, 7);
    // building facade with windows lighting
    x.fillStyle = '#121018'; x.fillRect(200, 80, 1520, 900);
    const phrases = ['好像有纹身', '是刺青吧', '左手腕', '黑影', '帽檐很低', '拽得很狠'];
    for (let i = 0; i < 6; i++) {
      const wx = 260 + (i % 3) * 480, wy = 140 + Math.floor(i / 3) * 380;
      const on = true;
      x.fillStyle = on ? '#2a2218' : '#0a0c10'; x.fillRect(wx, wy, 360, 280);
      if (on) { glow(x, wx + 180, wy + 140, 160, .45); cone(x, wx + 180, wy, 40, wx, wx + 360, wy + 280, .25); }
      // silhouette neighbor
      sil(x, M => { M.beginPath(); M.ellipse(wx + 180, wy + 100, 40, 48, 0, 0, 7); M.fill(); M.fillRect(wx + 140, wy + 140, 80, 120); }, 4, -3, ['#1a1510', '#050506'], .6, .3);
      x.fillStyle = '#ece4d4'; x.fillRect(wx + 40, wy + 220, 280, 44);
      x.fillStyle = '#1b1510'; x.font = '600 26px NSerif'; x.textAlign = 'center'; x.fillText(phrases[i], wx + 180, wy + 250);
    }
    // hand with emerging tattoo in foreground film cell
    x.fillStyle = '#1a120c'; x.fillRect(700, 820, 520, 220);
    x.fillStyle = '#d29a5c'; x.beginPath(); x.ellipse(960, 930, 120, 70, 0, 0, 7); x.fill();
    x.strokeStyle = '#1a0f08'; x.lineWidth = 4; x.beginPath(); x.moveTo(900, 910); x.quadraticCurveTo(960, 880, 1020, 915); x.stroke(); // tattoo
    x.fillStyle = AMB + '1)'; x.font = '600 28px NSerif'; x.textAlign = 'center'; x.fillText('纹身 · 被补上的细节', 960, 1010);
    finish(x, 7);
  });
}
export async function W08_lab1974() {
  return L(x => {
    wall(x, '#0c1018', '#05070a', 80, 14, 8);
    // projector
    x.fillStyle = '#1a1c20'; x.fillRect(80, 400, 220, 140); glow(x, 300, 470, 80, .4);
    x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(18px)'; x.fillStyle = 'rgba(200,205,215,.08)';
    x.beginPath(); x.moveTo(300, 400); x.lineTo(700, 160); x.lineTo(700, 700); x.lineTo(300, 540); x.fill(); x.restore(); x.filter = 'none';
    // screen
    x.fillStyle = '#1a1e24'; x.fillRect(720, 140, 720, 520); x.strokeStyle = 'rgba(235,230,220,.4)'; x.lineWidth = 4; x.strokeRect(720, 140, 720, 520);
    // two cars on screen
    sil(x, M => { M.save(); M.translate(900, 480); M.scale(.6, .6); M.beginPath(); M.moveTo(-180, 0); M.lineTo(-160, -50); M.lineTo(160, -50); M.lineTo(180, 0); M.fill(); M.restore(); }, -4, 3, ['#2a2828', '#080808']);
    sil(x, M => { M.save(); M.translate(1180, 480); M.scale(-.6, .6); M.beginPath(); M.moveTo(-180, 0); M.lineTo(-160, -50); M.lineTo(160, -50); M.lineTo(180, 0); M.fill(); M.restore(); }, 4, 3, ['#2a2828', '#080808']);
    // two rows of seats
    for (let row = 0; row < 2; row++) for (let i = 0; i < 5; i++) {
      const sx = 200 + i * 140 + row * 40, sy = 780 + row * 100;
      x.fillStyle = '#1a1510'; x.fillRect(sx, sy, 100, 70);
      face(x, sx + 50, sy - 20, 28, 'neutral', 0, .5);
    }
    // questionnaires
    x.fillStyle = '#ece4d4'; x.fillRect(1520, 200, 320, 200); x.fillStyle = '#1b1510'; x.font = '600 28px NSerif'; x.textAlign = 'left'; x.fillText('撞碎', 1540, 280); x.fillText('车速？ →', 1540, 340);
    x.fillStyle = '#ece4d4'; x.fillRect(1520, 440, 320, 200); x.fillStyle = '#1b1510'; x.fillText('碰到', 1540, 520); x.fillText('车速？ →', 1540, 580);
    // speed needles — smashed higher
    x.strokeStyle = AMB + '1)'; x.lineWidth = 6; x.beginPath(); x.moveTo(1780, 360); x.lineTo(1820, 240); x.stroke(); glow(x, 1820, 240, 40, .6);
    x.strokeStyle = 'rgba(180,180,190,.5)'; x.lineWidth = 6; x.beginPath(); x.moveTo(1780, 600); x.lineTo(1800, 560); x.stroke();
    x.fillStyle = '#f6f1e8'; x.font = '500 24px NSerif'; x.textAlign = 'center'; x.fillText('1974 · Loftus', 1080, 720);
    finish(x, 8);
  });
}

export async function W09_glass() {
  return L(x => {
    wall(x, '#0a0e15', '#040507', 90, 18, 9);
    const car = (cx, cy, s, flip) => sil(x, M => { M.save(); M.translate(cx, cy); M.scale(flip ? -s : s, s);
      M.beginPath(); M.moveTo(-210, 0); M.lineTo(-200, -60); M.lineTo(-110, -70); M.lineTo(-60, -130); M.lineTo(80, -130); M.lineTo(140, -70); M.lineTo(210, -60); M.lineTo(215, 0); M.closePath(); M.fill();
      M.beginPath(); M.arc(-120, 0, 38, 0, 7); M.arc(130, 0, 38, 0, 7); M.fill(); M.restore(); }, flip ? 8 : -8, 5, ['#1b1a1d', '#050506'], .85, .4);
    x.fillStyle = '#05070a'; x.fillRect(110, 160, 680, 460); x.strokeStyle = 'rgba(235,230,220,.55)'; x.lineWidth = 4; x.strokeRect(110, 160, 680, 460);
    for (let i = 0; i < 12; i++) { x.fillStyle = 'rgba(235,230,220,.35)'; x.fillRect(122 + i * 56, 168, 26, 14); x.fillRect(122 + i * 56, 598, 26, 14); }
    x.save(); x.beginPath(); x.rect(114, 190, 672, 400); x.clip();
    const sg = x.createLinearGradient(0, 190, 0, 590); sg.addColorStop(0, '#161c25'); sg.addColorStop(1, '#2a2620'); x.fillStyle = sg; x.fillRect(114, 190, 672, 400);
    x.fillStyle = '#1a1714'; x.fillRect(114, 480, 672, 110); x.fillStyle = 'rgba(240,230,210,.5)'; for (let i = 0; i < 6; i++) x.fillRect(130 + i * 120, 530, 60, 6);
    car(330, 500, .75, false); car(610, 500, .75, true); x.restore();
    x.font = '600 36px NSerif'; x.fillStyle = '#f6f1e8'; x.textAlign = 'left'; x.fillText('录像：没有碎玻璃', 130, 660);
    const rg = x.createLinearGradient(0, 640, 0, H); rg.addColorStop(0, '#15161a'); rg.addColorStop(1, '#050506'); x.fillStyle = rg;
    x.beginPath(); x.moveTo(860, 1080); x.lineTo(1100, 600); x.lineTo(1920, 600); x.lineTo(1920, 1080); x.fill();
    x.fillStyle = 'rgba(240,230,210,.55)'; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(1160 + i * 150, 800); x.lineTo(1240 + i * 150, 800); x.lineTo(1250 + i * 150, 816); x.lineTo(1150 + i * 150, 816); x.fill(); }
    x.strokeStyle = '#020203'; x.lineWidth = 12; x.beginPath(); x.moveTo(1840, 1080); x.lineTo(1840, 120); x.lineTo(1700, 120); x.stroke(); glow(x, 1690, 140, 150, .95);
    cone(x, 1690, 145, 40, 1150, 1920, 1000, .42);
    car(1300, 720, 1.0, false); car(1680, 720, 1.0, true);
    x.save(); x.translate(1020, 150); x.rotate(-.06); x.fillStyle = '#e9e1d2'; x.fillRect(0, 0, 360, 220);
    x.fillStyle = '#25201b'; x.font = '500 30px NSerif'; x.fillText('问卷', 22, 44); x.font = '500 26px NSerif'; x.fillText('两车 ______ 时，', 22, 96); x.fillText('车速大约多少？', 22, 136);
    x.strokeStyle = '#25201b'; x.lineWidth = 2; x.strokeRect(118, 70, 100, 34); x.restore();
    x.save(); x.strokeStyle = AMB + '.55)'; x.setLineDash([10, 12]); x.lineWidth = 3; x.beginPath(); x.moveTo(1180, 270); x.quadraticCurveTo(1330, 330, 1460, 420); x.stroke(); x.restore();
    x.save(); x.translate(1470, 470); x.rotate(.08); x.fillStyle = '#1a120b'; x.fillRect(-90, -44, 180, 88); x.strokeStyle = AMB + '1)'; x.lineWidth = 4; x.strokeRect(-90, -44, 180, 88);
    x.fillStyle = '#ffc46e'; x.font = '600 56px NSerif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('撞碎', 0, 2); x.restore(); glow(x, 1470, 470, 150, .35);
    const r = rng(21); for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = 30 + r() * 300; const px = 1490 + Math.cos(a) * d, py = 745 + Math.sin(a) * d * .25; const s = 6 + r() * 16;
      x.save(); x.translate(px, py); x.rotate(r() * 6.28); x.beginPath(); x.moveTo(0, -s); x.lineTo(s * .7, s * .3); x.lineTo(-s * .5, s * .6); x.closePath();
      x.fillStyle = `rgba(255,${200 + r() * 40},${140 + r() * 60},${.55 + r() * .4})`; x.fill(); x.restore(); }
    glow(x, 1490, 745, 220, .28);
    rain(x, 9, 400, .12, 860, 1920); finish(x, 9);
  });
}
export async function W10_archive() {
  return L(x => {
    wall(x, '#0c1016', '#05070a', 70, 16, 10);
    // archive cabinets
    for (let c = 0; c < 4; c++) {
      const cx = 80 + c * 280;
      x.fillStyle = '#1a1612'; x.fillRect(cx, 120, 250, 860);
      x.strokeStyle = 'rgba(255,186,96,.25)'; x.lineWidth = 2; x.strokeRect(cx, 120, 250, 860);
      for (let d = 0; d < 6; d++) {
        const dy = 160 + d * 130;
        x.fillStyle = '#2a2218'; x.fillRect(cx + 20, dy, 210, 100);
        x.fillStyle = '#c8b090'; x.fillRect(cx + 100, dy + 40, 50, 16); // handle
      }
    }
    // open drawer with card being rewritten
    x.fillStyle = '#2a2218'; x.fillRect(1200, 400, 640, 280);
    x.fillStyle = '#ece4d4'; x.fillRect(1280, 440, 480, 200);
    x.fillStyle = 'rgba(80,70,60,.45)'; x.font = '600 36px NSerif'; x.textAlign = 'left';
    x.fillText('原字：帽檐 · 一只手', 1320, 520); // faded
    x.fillStyle = '#1b1510'; x.fillText('改写：凶脸 · 纹身', 1320, 580);
    x.strokeStyle = AMB + '.9)'; x.lineWidth = 3; x.beginPath(); x.moveTo(1320, 600); x.lineTo(1700, 600); x.stroke();
    // pen
    x.strokeStyle = '#c8b090'; x.lineWidth = 8; x.beginPath(); x.moveTo(1680, 560); x.lineTo(1780, 480); x.stroke();
    glow(x, 1400, 200, 120, .3); finish(x, 10);
  });
}
export async function W11_lineup2() {
  return L(x => {
    wall(x, '#090c12', '#030406', 90, 14, 11);
    lineupGlass(x, 560, 90, 1300, 760, 2, false, true);
    sketchOnGlass(x, 600, 120);
    herPointing(x, 250);
    x.save(); x.strokeStyle = AMB + '.55)'; x.setLineDash([12, 14]); x.lineWidth = 3; x.beginPath(); x.moveTo(650, 556); x.lineTo(1180, 400); x.stroke(); x.restore();
    x.fillStyle = '#0a0807'; x.fillRect(0, 900, W, 180); x.fillStyle = AMB + '.25)'; x.fillRect(0, 900, W, 3);
    finish(x, 11);
  });
}
export async function W12_corridor() {
  return L(x => {
    wall(x, '#0a0e14', '#040608', 60, 18, 12);
    // long corridor perspective
    x.fillStyle = '#121820'; x.beginPath(); x.moveTo(0, 0); x.lineTo(700, 280); x.lineTo(700, 800); x.lineTo(0, 1080); x.fill();
    x.fillStyle = '#0e1218'; x.beginPath(); x.moveTo(1920, 0); x.lineTo(1220, 280); x.lineTo(1220, 800); x.lineTo(1920, 1080); x.fill();
    x.fillStyle = '#1a1e24'; x.fillRect(700, 280, 520, 520);
    // ceiling lights cascading on — 10 bulbs, first ones brighter
    for (let i = 0; i < 10; i++) {
      const t = i / 9; const lx = 960, ly = 300 + i * 48; const sc = 1 - t * .55;
      const px = 960 + (i - 4.5) * 0; // centered depth fake via size
      const y = 200 + i * 55; const x0 = 820 + i * 8; const w = 280 - i * 18;
      glow(x, 960, y, 40 + (9 - i) * 8, .3 + (9 - i) * .07);
      x.fillStyle = AMB + (.5 + (9 - i) * .05) + ')'; x.beginPath(); x.ellipse(960, y, 18 * sc + 4, 8, 0, 0, 7); x.fill();
    }
    // officer thumbs up left
    sil(x, M => { M.beginPath(); M.moveTo(200, 1080); M.bezierCurveTo(180, 700, 250, 500, 380, 480); M.bezierCurveTo(520, 500, 560, 700, 540, 1080); M.fill();
      M.beginPath(); M.moveTo(420, 560); M.quadraticCurveTo(560, 420, 620, 380); M.lineTo(640, 420); M.quadraticCurveTo(560, 480, 480, 620); M.fill(); }, 8, 5, ['#1a1714', '#050506']);
    face(x, 380, 400, 55, 'certain', .5, .75);
    // thumb
    x.fillStyle = '#c99062'; x.beginPath(); x.ellipse(640, 390, 28, 40, -.3, 0, 7); x.fill(); glow(x, 640, 380, 50, .4);
    // her long shadow on floor
    x.fillStyle = 'rgba(0,0,0,.55)'; x.beginPath(); x.moveTo(800, 900); x.lineTo(960, 820); x.lineTo(1100, 1080); x.lineTo(700, 1080); x.fill();
    // clipboard
    x.fillStyle = '#ece4d4'; x.fillRect(280, 620, 100, 140); x.fillStyle = '#1b1510'; x.font = '600 22px NSerif'; x.textAlign = 'center'; x.fillText('认对了', 330, 700);
    finish(x, 12);
  });
}
export async function W13_tapes() {
  return L(x => {
    wall(x, '#0c1016', '#05070a', 80, 14, 13);
    // 5 tape reels
    for (let i = 0; i < 5; i++) {
      const cx = 220 + i * 340, cy = 380;
      x.fillStyle = '#1a1510'; x.beginPath(); x.arc(cx, cy, 110, 0, 7); x.fill();
      x.strokeStyle = AMB + (.4 + i * .1) + ')'; x.lineWidth = 14; x.beginPath(); x.arc(cx, cy, 90, 0, 7); x.stroke();
      x.fillStyle = '#0a0806'; x.beginPath(); x.arc(cx, cy, 30, 0, 7); x.fill();
      // tape spilling — longer for later interviews
      const len = 80 + i * 70;
      x.strokeStyle = '#2a2218'; x.lineWidth = 8; x.beginPath(); x.moveTo(cx, cy + 110); x.quadraticCurveTo(cx + 40, cy + 200 + i * 30, cx - 20, cy + 200 + len); x.stroke();
      // label
      x.fillStyle = '#ece4d4'; x.fillRect(cx - 70, cy + 130, 140, 50);
      x.fillStyle = '#1b1510'; x.font = '600 26px NSerif'; x.textAlign = 'center'; x.fillText('第' + (i + 1) + '次', cx, cy + 164);
      // detail slips increasing
      for (let k = 0; k < i + 1; k++) {
        x.fillStyle = '#e2d2ae'; x.fillRect(cx - 60 + k * 8, 700 + k * 40, 160, 32);
        x.fillStyle = '#3a2a1a'; x.font = '500 18px NSerif'; x.fillText(['帽檐', '手', '纹身', '凶脸', '绝对是他'][k] || '细节', cx + 20, 722 + k * 40);
      }
    }
    finish(x, 13);
  });
}
export async function W14_court() {
  return L(x => {
    wall(x, '#0e1218', '#06080c', 70, 16, 14);
    // witness stand
    x.fillStyle = '#2a2218'; x.fillRect(200, 400, 400, 400); x.fillStyle = '#1a1510'; x.fillRect(220, 360, 360, 60);
    sil(x, M => { M.beginPath(); M.moveTo(300, 760); M.bezierCurveTo(290, 560, 340, 480, 400, 460); M.bezierCurveTo(460, 480, 510, 560, 500, 760); M.fill(); }, 6, 4, ['#1a1714', '#050506']);
    face(x, 400, 420, 55, 'certain', .3, .85);
    // jury box 12
    for (let i = 0; i < 12; i++) {
      const jx = 780 + (i % 6) * 170, jy = 200 + Math.floor(i / 6) * 220;
      x.fillStyle = '#1a1510'; x.fillRect(jx, jy + 80, 140, 100);
      face(x, jx + 70, jy + 50, 32, 'certain', 0, .55);
      // lean forward
      x.fillStyle = 'rgba(255,186,96,.15)'; x.beginPath(); x.ellipse(jx + 70, jy + 120, 50, 20, 0, 0, 7); x.fill();
    }
    // scales tipping to guilty
    x.strokeStyle = '#c8b090'; x.lineWidth = 6; x.beginPath(); x.moveTo(960, 700); x.lineTo(960, 820); x.stroke();
    x.beginPath(); x.moveTo(860, 760); x.lineTo(1060, 740); x.stroke(); // tipped
    x.fillStyle = '#2a2218'; x.beginPath(); x.ellipse(860, 780, 50, 20, 0, 0, 7); x.fill();
    x.fillStyle = AMB + '.8)'; x.beginPath(); x.ellipse(1060, 760, 50, 20, 0, 0, 7); x.fill();
    x.fillStyle = '#f6f1e8'; x.font = '600 28px NSerif'; x.textAlign = 'center'; x.fillText('有罪', 1060, 800);
    // evidence table with ignored ticket
    x.fillStyle = '#1a1410'; x.fillRect(1400, 780, 420, 200);
    ticket(x, 1610, 880, -.08, 1.1);
    x.fillStyle = 'rgba(246,241,232,.5)'; x.font = '500 22px NSerif'; x.fillText('没人看', 1610, 960);
    // gavel
    x.fillStyle = '#3a2a18'; x.fillRect(600, 820, 80, 40); x.fillRect(630, 780, 20, 80);
    finish(x, 14);
  });
}
export async function W15_crane() {
  return L(x => {
    wall(x, '#0a0e16', '#04060a', 90, 14, 15);
    // night city / brain skyline
    for (let i = 0; i < 14; i++) {
      const bx = 80 + i * 130, bh = 200 + ((i * 97) % 400), by = 900 - bh;
      x.fillStyle = i % 3 === 0 ? '#1a222c' : '#141820'; x.fillRect(bx, by, 100, bh);
      if (i === 5) { // block being replaced
        x.strokeStyle = AMB + '.9)'; x.lineWidth = 3; x.strokeRect(bx - 4, by - 4, 108, bh + 8);
        x.fillStyle = '#2a3038'; x.fillRect(bx, by, 100, bh);
      }
    }
    // crane
    x.strokeStyle = '#c8b090'; x.lineWidth = 10; x.beginPath(); x.moveTo(400, 1000); x.lineTo(400, 120); x.lineTo(1400, 180); x.stroke();
    x.lineWidth = 4; x.beginPath(); x.moveTo(1100, 160); x.lineTo(1100, 420); x.stroke();
    // hanging block
    x.fillStyle = '#2a3038'; x.fillRect(1020, 420, 160, 120); glow(x, 1100, 480, 80, .35);
    // construction lights
    for (const lx of [300, 700, 1500]) glow(x, lx, 860, 60, .5);
    x.fillStyle = '#f6f1e8'; x.font = '500 28px NSerif'; x.textAlign = 'center'; x.fillText('记忆重建工地', 960, 80);
    finish(x, 15);
  });
}
export async function W16_door() {
  return L(x => {
    wall(x, '#0a0c10', '#030406', 70, 16, 16);
    // iron door closing
    x.fillStyle = '#1a1c20'; x.fillRect(560, 80, 800, 900);
    x.strokeStyle = '#050608'; x.lineWidth = 8;
    for (let i = 0; i < 12; i++) { x.beginPath(); x.moveTo(600 + i * 60, 100); x.lineTo(600 + i * 60, 960); x.stroke(); }
    for (let i = 0; i < 10; i++) { x.beginPath(); x.moveTo(580, 120 + i * 90); x.lineTo(1340, 120 + i * 90); x.stroke(); }
    x.fillStyle = '#2a2218'; x.fillRect(880, 480, 160, 120); // lock plate
    x.fillStyle = '#c8b090'; x.beginPath(); x.arc(960, 540, 30, 0, 7); x.fill();
    // inmate number
    x.fillStyle = '#ece4d4'; x.fillRect(900, 200, 120, 60); x.fillStyle = '#1b1510'; x.font = '600 36px NSerif'; x.textAlign = 'center'; x.fillText('3', 960, 242);
    // ticket falling through door gap
    ticket(x, 1480, 900, .35, .9);
    glow(x, 1360, 540, 40, .5); // gap light
    x.fillStyle = 'rgba(0,0,0,.4)'; x.fillRect(0, 0, 560, H); x.fillRect(1360, 0, 560, H);
    finish(x, 16);
  });
}
export async function W17_puzzle() {
  return L(x => {
    wall(x, '#080a0e', '#020304', 90, 12, 17);
    // four puzzle pieces of a face with source labels
    const pieces = [
      { x: 480, y: 280, label: '问句', emo: 'angry' },
      { x: 1100, y: 280, label: '画像', emo: 'angry' },
      { x: 480, y: 680, label: '邻居', emo: 'certain' },
      { x: 1100, y: 680, label: '认对了', emo: 'certain' }
    ];
    pieces.forEach((p, i) => {
      x.save(); x.translate(p.x, p.y); x.rotate((i - 1.5) * .04);
      x.fillStyle = '#e6dfd0'; x.beginPath();
      // puzzle-ish rect
      x.moveTo(-160, -140); x.lineTo(40, -140); x.quadraticCurveTo(80, -180, 120, -140); x.lineTo(160, -140); x.lineTo(160, 40); x.quadraticCurveTo(200, 80, 160, 120); x.lineTo(160, 140); x.lineTo(-40, 140); x.quadraticCurveTo(-80, 180, -120, 140); x.lineTo(-160, 140); x.closePath(); x.fill();
      x.strokeStyle = AMB + '.8)'; x.lineWidth = 4; x.stroke();
      face(x, 0, -10, 70, p.emo, 0, .85);
      x.fillStyle = '#1b1510'; x.font = '600 32px NSerif'; x.textAlign = 'center'; x.fillText(p.label, 0, 120);
      x.restore();
      glow(x, p.x, p.y, 100, .25);
    });
    finish(x, 17);
  });
}
export async function W18_otherAlley() {
  return L(x => {
    wall(x, '#0b1017', '#05070a', 70, 20, 18);
    // second alley — different lamp
    x.fillStyle = '#141011'; x.fillRect(0, 0, 500, H);
    x.fillStyle = '#0d0c0e'; x.fillRect(1420, 0, 500, H);
    x.fillStyle = '#121822'; x.fillRect(500, 200, 920, 560); glow(x, 960, 500, 200, .2);
    // street lamp
    x.strokeStyle = '#020203'; x.lineWidth = 14; x.beginPath(); x.moveTo(1600, 1080); x.lineTo(1600, 140); x.lineTo(1400, 140); x.stroke();
    glow(x, 1400, 160, 160, 1); cone(x, 1400, 170, 50, 900, 1700, 1080, .5);
    // true culprit back — hood, counting money, NO face
    hoodThief(x, 1100, 560, .95);
    // money
    for (let i = 0; i < 8; i++) {
      x.fillStyle = '#2a4a2a'; x.save(); x.translate(900 + i * 18, 780 + (i % 3) * 10); x.rotate(.1 * i); x.fillRect(-30, -14, 60, 28); x.restore();
    }
    glow(x, 960, 780, 80, .3);
    // empty wallet / bag at feet
    x.fillStyle = '#4a2c18'; x.fillRect(980, 860, 100, 70); x.strokeStyle = AMB + '.6)'; x.lineWidth = 2; x.strokeRect(980, 860, 100, 70);
    // cat
    sil(x, M => { M.beginPath(); M.ellipse(700, 920, 40, 24, 0, 0, 7); M.fill(); M.beginPath(); M.moveTo(670, 900); M.lineTo(680, 870); M.lineTo(690, 900); M.fill(); }, -4, 2, ['#1a1510', '#050506'], .4, .2);
    rain(x, 18, 800, .2); finish(x, 18);
  });
}
export async function W19_wall375() {
  return L(x => {
    wall(x, '#0a0c12', '#040508', 80, 14, 19);
    // 375 case files wall — sample grid representing 375
    const cols = 25, rows = 15; // 375
    const bw = 70, bh = 56, ox = 60, oy = 60;
    let amber = 0;
    for (let i = 0; i < 375; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      const px = ox + c * bw, py = oy + r * bh;
      const mis = i % 10 < 7; // ~70%
      x.fillStyle = mis ? '#2a2218' : '#1a1e24'; x.fillRect(px + 2, py + 2, bw - 4, bh - 4);
      if (mis) {
        amber++;
        x.fillStyle = AMB + '.55)'; x.beginPath();
        // fingerprint / pointing hand mark
        x.ellipse(px + bw / 2, py + bh / 2, 10, 14, 0, 0, 7); x.fill();
      }
    }
    x.fillStyle = '#f6f1e8'; x.font = '600 36px NSerif'; x.textAlign = 'center';
    x.fillText('375 · DNA 翻案', 960, 980);
    x.fillStyle = '#ffc46e'; x.font = '500 28px NSerif'; x.fillText('约七成带误认指印', 960, 1030);
    finish(x, 19);
  });
}
export async function W20_prisonRain() {
  return L(x => {
    wall(x, '#0b1017', '#05070a', 70, 18, 20);
    // prison side door
    x.fillStyle = '#1a1c20'; x.fillRect(200, 200, 420, 700);
    x.strokeStyle = '#050608'; x.lineWidth = 6;
    for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(240 + i * 60, 220); x.lineTo(240 + i * 60, 880); x.stroke(); }
    x.fillStyle = '#0a0c10'; x.fillRect(0, 0, W, 180); // overhang
    x.fillStyle = '#1a1510'; x.fillRect(100, 160, 600, 40);
    // white-haired #3 with bag
    sil(x, M => { M.beginPath(); M.moveTo(900, 1080); M.bezierCurveTo(880, 760, 920, 560, 1040, 520); M.bezierCurveTo(1160, 560, 1200, 760, 1180, 1080); M.fill(); }, -8, 5, ['#2a2219', '#0b0907']);
    // white hair
    x.fillStyle = '#d8d4cc'; x.beginPath(); x.ellipse(1040, 480, 70, 50, 0, Math.PI, 0); x.fill();
    face(x, 1040, 540, 60, 'hollow', 0, .55);
    // old bag
    x.fillStyle = '#3a2a18'; x.fillRect(1180, 720, 100, 140); x.strokeStyle = AMB + '.4)'; x.lineWidth = 2; x.strokeRect(1180, 720, 100, 140);
    // puddle
    x.save(); x.globalCompositeOperation = 'screen'; x.fillStyle = AMB + '.2)'; x.beginPath(); x.ellipse(1100, 1000, 280, 30, 0, 0, 7); x.fill(); x.restore();
    rain(x, 20, 1200, .28); finish(x, 20);
  });
}
export async function W21_emptyRoom() {
  return L(x => {
    wall(x, '#090c12', '#030406', 90, 14, 21);
    // empty lineup glass — numbers off
    const gx = 560, gy = 90, gw = 1300, gh = 760;
    x.save(); x.beginPath(); x.rect(gx, gy, gw, gh); x.clip();
    const lg = x.createLinearGradient(0, gy, 0, gy + gh); lg.addColorStop(0, '#1a1814'); lg.addColorStop(1, '#0c0a08'); x.fillStyle = lg; x.fillRect(gx, gy, gw, gh);
    x.strokeStyle = 'rgba(255,214,160,.12)'; x.lineWidth = 2;
    for (let i = 0; i < 9; i++) { const y = gy + 120 + i * 70; x.beginPath(); x.moveTo(gx, y); x.lineTo(gx + gw, y); x.stroke(); }
    // empty chairs / extinguished number cards
    for (let i = 0; i < 5; i++) {
      const mx = 780 + i * 200;
      x.fillStyle = '#1a1510'; x.fillRect(mx - 40, 700, 80, 40);
      x.fillStyle = '#2a241e'; x.fillRect(mx - 46, 640, 92, 70);
      x.fillStyle = 'rgba(100,90,80,.35)'; x.font = '600 52px NSerif'; x.textAlign = 'center'; x.fillText(String(i + 1), mx, 694);
    }
    x.restore();
    x.strokeStyle = '#020203'; x.lineWidth = 26; x.strokeRect(gx, gy, gw, gh);
    // table: sketch + ticket side by side
    x.fillStyle = '#0a0807'; x.fillRect(0, 860, W, 220);
    x.fillStyle = '#e6dfd0'; x.fillRect(620, 900, 160, 140);
    x.strokeStyle = '#2a241e'; x.lineWidth = 2; x.beginPath(); x.ellipse(700, 970, 40, 48, 0, 0, 7); x.stroke();
    ticket(x, 1000, 970, -.05, 1);
    // her reflection bowed — hollow
    face(x, 280, 500, 80, 'hurt', .2, .4, .08);
    x.fillStyle = 'rgba(160,180,200,.08)'; x.fillRect(gx, gy, gw, gh);
    finish(x, 21);
  });
}
export async function W22_theater() {
  return L(x => {
    wall(x, '#080a0e', '#020304', 90, 12, 22);
    // screen
    x.fillStyle = '#1a1e24'; x.fillRect(360, 80, 1200, 520);
    x.strokeStyle = 'rgba(235,230,220,.25)'; x.lineWidth = 4; x.strokeRect(360, 80, 1200, 520);
    // film on screen — empty lineup tiny
    x.fillStyle = '#121820'; x.fillRect(500, 140, 920, 400);
    glow(x, 960, 340, 200, .35);
    // projector beam toward viewer
    x.save(); x.globalCompositeOperation = 'screen'; x.filter = 'blur(20px)';
    x.fillStyle = 'rgba(255,220,160,.12)'; x.beginPath(); x.moveTo(960, 1080); x.lineTo(500, 600); x.lineTo(1420, 600); x.closePath(); x.fill();
    x.restore(); x.filter = 'none';
    // empty seats
    for (let row = 0; row < 3; row++) for (let i = 0; i < 8; i++) {
      const sx = 280 + i * 180, sy = 700 + row * 100;
      x.fillStyle = '#1a1510'; x.fillRect(sx, sy, 140, 70);
      x.fillStyle = '#0a0806'; x.fillRect(sx + 20, sy - 30, 100, 40);
    }
    // film reel
    x.fillStyle = '#2a2218'; x.beginPath(); x.arc(200, 200, 80, 0, 7); x.fill(); x.strokeStyle = AMB + '.5)'; x.lineWidth = 8; x.beginPath(); x.arc(200, 200, 60, 0, 7); x.stroke();
    // exit sign
    x.fillStyle = AMB + '.7)'; x.font = '600 28px NSerif'; x.textAlign = 'center'; x.fillText('EXIT', 1760, 120);
    finish(x, 22);
  });
}

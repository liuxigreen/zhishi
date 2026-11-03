import {
  W, H, L, brush, sweepBrush, wash, pth, ell, circ, paperBase, rectPts, figure,
  slip, hSlip, sealCh, rng, face, mkCanvas
} from './helpers.js';

const TAGS = ['我捐过了', '积德', '积分', '我做过', '可以', '算平', '好人', '开恩', '放纵', '许可'];

function badge(x, cx, cy, s = 1, ch = '善') {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  wash(x, ell(0, 0, 48, 48), { tone: .55, blur: 10, edge: .15, color: '214,170,80' });
  x.fillStyle = 'rgba(214,170,80,.95)'; x.beginPath(); x.ellipse(0, 0, 34, 34, 0, 0, 7); x.fill();
  brush(x, circ(0, 0, 36, 36, 0, 6.3, 20), { w: 4, dry: .2, seed: 8, bristles: 8, color: '120,80,20' });
  x.font = '32px Brush'; x.fillStyle = 'rgba(18,16,14,.92)'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(ch, 0, 2);
  x.restore();
}
function receipt(x, cx, cy, title, a = 0, s = 1) {
  x.save(); x.translate(cx, cy); x.rotate(a); x.scale(s, s);
  x.fillStyle = '#f7efdc'; x.fillRect(-55, -80, 110, 160);
  brush(x, rectPts(-55, -80, 110, 160, 4), { w: 2, dry: .3, seed: 3, bristles: 5, color: '120,90,50' });
  x.strokeStyle = 'rgba(184,38,29,.45)'; x.strokeRect(-50, -75, 100, 150);
  x.fillStyle = 'rgba(18,16,14,.9)'; x.font = '22px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(title, 0, -40); x.font = '18px NSerif'; x.fillText('¥', 0, 10); x.fillText('——', 0, 40);
  x.restore();
}
function flower(x, cx, cy, s = 1) {
  x.save(); x.translate(cx, cy); x.scale(s, s);
  for (let i = 0; i < 5; i++) {
    const a = i * 1.256;
    wash(x, ell(Math.cos(a) * 14, Math.sin(a) * 14, 12, 8), { tone: .7, blur: 1, edge: .35, color: '184,38,29' });
  }
  x.fillStyle = 'rgba(214,170,80,.95)'; x.beginPath(); x.arc(0, 0, 6, 0, 7); x.fill();
  x.restore();
}

export async function W01_cafe() {
  return L(x => {
    paperBase(x, W, H, 11);
    // night cafe wash
    wash(x, pth([[0, 0], [W, 0], [W, 420], [0, 450]]), { tone: .18, blur: 22, edge: .02, color: '40,36,50' });
    // pendant lamps
    for (const [lx, ly] of [[360, 160], [960, 120], [1560, 150]]) {
      brush(x, [[lx, 20], [lx, ly]], { w: 3, dry: .2, seed: lx, bristles: 4 });
      wash(x, ell(lx, ly + 40, 36, 48), { tone: .55, blur: 4, edge: .25, color: '214,170,80' });
    }
    // bar counter
    sweepBrush(x, [[80, 780], [960, 750], [1840, 780]], { w: 140, ink: .55, dry: .35, color: '55,38,22', seed: 80, bristles: 40 });
    sweepBrush(x, [[100, 840], [960, 820], [1820, 845]], { w: 50, ink: .4, dry: .45, color: '40,28,16', seed: 81, bristles: 22 });
    // donation success phone (left on counter)
    x.fillStyle = 'rgba(30,28,34,.95)'; x.fillRect(420, 620, 120, 200);
    brush(x, rectPts(420, 620, 120, 200, 10), { w: 3, dry: .25, seed: 1, bristles: 6 });
    x.fillStyle = '#e8f5e4'; x.fillRect(430, 640, 100, 150);
    x.fillStyle = 'rgba(40,120,60,.95)'; x.font = '22px NSerif'; x.textAlign = 'center';
    x.fillText('捐赠成功', 480, 700); x.font = '28px Brush'; x.fillText('¥200', 480, 750);
    // QR tip
    x.fillStyle = 'rgba(18,16,14,.5)'; x.fillRect(450, 770, 60, 60);
    // XL cup pushed forward (right) — cause/effect: donation → XL cup
    x.fillStyle = '#f4ead4'; x.beginPath(); x.moveTo(1280, 520); x.lineTo(1420, 520); x.lineTo(1390, 720); x.lineTo(1310, 720); x.closePath(); x.fill();
    brush(x, [[1280, 520], [1420, 520], [1390, 720], [1310, 720], [1280, 520]], { w: 4, dry: .3, seed: 2, bristles: 8, color: '80,60,40' });
    x.fillStyle = 'rgba(90,50,30,.85)'; x.fillRect(1295, 500, 110, 30); // sleeve
    x.strokeStyle = 'rgba(184,38,29,.7)'; x.lineWidth = 4; x.beginPath(); x.moveTo(1350, 520); x.lineTo(1350, 700); x.stroke(); // straw
    x.font = '26px Brush'; x.fillStyle = '#b8261d'; x.textAlign = 'center'; x.fillText('超大杯', 1350, 760);
    // foam top
    wash(x, ell(1350, 530, 55, 18), { tone: .25, blur: 2, edge: .15, color: '200,180,140' });
    // her (left) looking at phone — soft relief starting
    figure(x, { emo: 'reconcile', view: '3qR',
      body: [[200, 1100], [240, 860], [340, 740], [460, 720], [480, 640], [560, 635], [580, 720], [680, 780], [720, 980], [740, 1100]],
      head: [520, 560, 80, 95], hair: [[[440, 540], [455, 460], [520, 430], [585, 460], [600, 540], [560, 500], [480, 500]]],
      robe: .8, seed: 200, sweep: 55
    });
    // clerk hand / figure right pushing cup
    figure(x, { emo: 'neutral', view: '3qL',
      body: [[1600, 1100], [1620, 900], [1680, 820], [1780, 800], [1800, 900], [1820, 1100]],
      head: [1740, 740, 42, 50], hair: [[[1705, 730], [1715, 700], [1740, 690], [1765, 705], [1770, 735]]],
      limbs: [{ pts: [[1680, 840], [1500, 700], [1420, 620]], w: 22 }], robe: .7, seed: 33, sweep: 36
    });
    // ink drop residue top-left (entry morph)
    wash(x, ell(180, 180, 40, 40), { tone: .4, blur: 8, edge: .2 });
    sealCh(x, '捐', 1780, 110, .55);
  });
}

export async function W02_foam() {
  return L(x => {
    paperBase(x, W, H, 21);
    wash(x, pth([[0, 0], [W, 0], [W, H], [0, H]]), { tone: .14, blur: 30, edge: 0, color: '160,120,70' });
    wash(x, ell(960, 540, 720, 420), { tone: .28, blur: 24, edge: .06, color: '180,150,100' });
    // foam bubbles
    const r = rng(7);
    for (let i = 1; i <= 8; i++) brush(x, circ(960, 540, 70 * i, 45 * i, 0, 6.2, 36), { w: 3, dry: .55, seed: 30 + i, bristles: 6, ink: .3, color: '120,90,50' });
    for (let i = 0; i < 40; i++) {
      const a = r() * 6.28, rr = 40 + r() * 500;
      wash(x, ell(960 + Math.cos(a) * rr, 540 + Math.sin(a) * rr * .6, 8 + r() * 22, 6 + r() * 14), { tone: .2, blur: 2, edge: .15, color: '220,200,160' });
    }
    // her face soft smile in foam (relief)
    x.save(); x.globalAlpha = .75;
    wash(x, ell(960, 500, 130, 150), { tone: .1, blur: 6, edge: .2 });
    face(x, [960, 500, 90, 105], 'reconcile', 'front', 9);
    x.restore();
    // badge condensing from foam center
    badge(x, 960, 620, 1.4, '善');
    // sugar grains
    for (let i = 0; i < 30; i++) { x.fillStyle = `rgba(240,230,200,${.4 + r() * .4})`; x.beginPath(); x.arc(600 + r() * 700, 700 + r() * 200, 2 + r() * 3, 0, 7); x.fill(); }
    sealCh(x, '松', 1780, 110, .55);
  });
}

export async function W03_classroom() {
  return L(x => {
    paperBase(x, W, H, 31);
    wash(x, pth([[0, 100], [W, 60], [W, 360], [0, 380]]), { tone: .1, blur: 16, edge: .05 });
    // blackboard
    x.fillStyle = 'rgba(40,55,40,.88)'; x.fillRect(360, 80, 1200, 320);
    brush(x, rectPts(360, 80, 1200, 320, 8), { w: 6, dry: .3, seed: 1, bristles: 8, color: '80,60,30' });
    x.font = '120px Brush'; x.fillStyle = 'rgba(239,229,207,.9)'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('乖', 960, 240);
    // desks
    for (const dx of [280, 700, 1120, 1500]) {
      sweepBrush(x, [[dx, 700], [dx + 220, 690], [dx + 240, 760], [dx - 20, 770]], { w: 18, ink: .5, dry: .35, seed: dx, bristles: 14, color: '70,50,30' });
    }
    // chalk
    x.fillStyle = 'rgba(240,235,220,.9)'; x.fillRect(420, 380, 80, 12);
    // child with forehead covered in red flowers
    figure(x, { emo: 'reconcile', view: 'front',
      body: [[820, 980], [850, 820], [900, 760], [1020, 760], [1070, 820], [1100, 980]],
      head: [960, 680, 55, 65], hair: [[[910, 665], [920, 620], [960, 605], [1000, 620], [1010, 665]]],
      robe: .75, seed: 5, sweep: 32, cw: 7
    });
    for (const [fx, fy] of [[920, 640], [960, 620], [1000, 640], [940, 670], [980, 665], [960, 655]]) flower(x, fx, fy, .7);
    // hand reaching to sugar jar (right)
    brush(x, [[1100, 780], [1280, 720], [1420, 680]], { w: 22, dry: .2, seed: 8, bristles: 12, color: '30,26,22' });
    x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(1450, 670, 28, 20, -.4, 0, 7); x.fill();
    // sugar jar
    x.fillStyle = 'rgba(200,180,140,.9)'; x.fillRect(1520, 620, 100, 140);
    brush(x, rectPts(1520, 620, 100, 140, 6), { w: 3, dry: .3, seed: 9, bristles: 6 });
    x.font = '28px Brush'; x.fillStyle = 'rgba(18,16,14,.9)'; x.textAlign = 'center'; x.fillText('糖', 1570, 700);
    // candy pieces
    const r = rng(11); for (let i = 0; i < 8; i++) { x.fillStyle = 'rgba(184,38,29,.7)'; x.beginPath(); x.arc(1480 + r() * 160, 780 + r() * 40, 6, 0, 7); x.fill(); }
    sealCh(x, '幼', 1780, 110, .55);
  });
}

export async function W04_petalMicro() {
  return L(x => {
    paperBase(x, W, H, 41);
    const r = rng(13);
    // fiber field
    for (let i = 0; i < 20; i++) {
      const y = 120 + i * 46;
      brush(x, [[0, y], [600, y + Math.sin(i) * 10], [1200, y - 6], [1920, y + 8]], { w: 3, dry: .6, seed: 100 + i, bristles: 5, ink: .28, color: '120,70,60' });
    }
    // giant petal / flower shadow fading
    wash(x, ell(700, 480, 280, 180), { tone: .2, blur: 20, edge: .1, color: '184,38,29' });
    // road sign morphing from petal fibers: 「我捐过了」
    x.fillStyle = 'rgba(40,30,20,.9)'; x.fillRect(1180, 360, 16, 280);
    x.fillStyle = '#f7efdc'; x.fillRect(1080, 300, 220, 90);
    brush(x, rectPts(1080, 300, 220, 90, 6), { w: 4, dry: .3, seed: 5, bristles: 7 });
    x.font = '36px Brush'; x.fillStyle = 'rgba(18,16,14,.92)'; x.textAlign = 'center'; x.fillText('我捐过了', 1190, 355);
    // faint flower ghost
    for (let i = 0; i < 6; i++) flower(x, 400 + r() * 500, 300 + r() * 400, .4 + r() * .4);
    sealCh(x, '替', 1780, 110, .55);
  });
}

export async function W05_temple() {
  return L(x => {
    paperBase(x, W, H, 51);
    wash(x, pth([[0, 420], [400, 380], [900, 400], [1400, 360], [1920, 400], [1920, 1080], [0, 1080]]), { tone: .12, blur: 24, edge: .04, color: '70,56,40' });
    // roof
    wash(x, pth([[520, 320], [960, 160], [1400, 320], [1360, 360], [960, 220], [560, 360]]), { tone: .55, blur: 3, edge: .25, color: '40,28,20' });
    sweepBrush(x, [[540, 330], [960, 180], [1380, 330]], { w: 22, ink: .85, dry: .35, seed: 3, bristles: 20 });
    for (const px of [620, 1300]) sweepBrush(x, [[px, 320], [px + 4, 700]], { w: 48, ink: .7, dry: .4, seed: px, bristles: 22, color: '90,40,28' });
    // lanterns
    for (const lx of [500, 1420]) { wash(x, ell(lx, 280, 28, 40), { tone: .55, blur: 3, edge: .3, color: '184,38,29' }); brush(x, [[lx, 200], [lx, 250]], { w: 3, dry: .2, seed: lx, bristles: 4 }); }
    // 功德箱 + coin mid-air
    x.fillStyle = 'rgba(90,50,30,.92)'; x.fillRect(820, 620, 280, 200);
    brush(x, rectPts(820, 620, 280, 200, 8), { w: 6, dry: .3, seed: 11, bristles: 10, color: '150,100,40' });
    x.font = '44px Brush'; x.fillStyle = 'rgba(214,170,80,.95)'; x.textAlign = 'center'; x.fillText('功德箱', 960, 690);
    x.fillStyle = 'rgba(200,160,40,.95)'; x.beginPath(); x.ellipse(960, 560, 22, 22, 0, 0, 7); x.fill();
    brush(x, circ(960, 560, 24, 24, 0, 6.3, 16), { w: 3, dry: .2, seed: 12, bristles: 6, color: '120,80,20' });
    // her dropping coin
    figure(x, { emo: 'reconcile', view: '3qR',
      body: [[380, 1080], [410, 900], [480, 820], [560, 800], [580, 740], [640, 735], [660, 810], [720, 900], [740, 1080]],
      head: [560, 680, 48, 56], hair: [[[520, 670], [530, 620], [560, 605], [590, 625], [600, 675]]],
      robe: .8, seed: 21, sweep: 45
    });
    // incense stall — extra tall stick just taken
    x.fillStyle = 'rgba(60,40,28,.88)'; x.fillRect(1480, 640, 360, 280);
    for (let i = 0; i < 8; i++) {
      const ix = 1520 + i * 40;
      brush(x, [[ix, 900], [ix + 4, 480 - (i === 4 ? 90 : 0)]], { w: 5, dry: .25, seed: 40 + i, bristles: 5, color: i === 4 ? '184,38,29' : '40,30,22' });
      if (i === 4) wash(x, ell(ix + 4, 390, 18, 32), { tone: .45, blur: 6, edge: .15, color: '180,160,140' });
    }
    x.font = '32px Brush'; x.fillStyle = 'rgba(18,16,14,.9)'; x.fillText('香火', 1660, 980);
    // cushion
    wash(x, ell(600, 980, 70, 22), { tone: .4, blur: 2, edge: .3, color: '120,40,30' });
    sealCh(x, '功', 1780, 110, .55);
  });
}

export async function W06_crowd() {
  return L(x => {
    paperBase(x, W, H, 61);
    wash(x, pth([[0, 200], [600, 120], [1200, 180], [1920, 100], [1920, 420], [0, 440]]), { tone: .12, blur: 16, edge: .05 });
    // city gate
    wash(x, pth([[700, 200], [780, 80], [1140, 80], [1220, 200], [1220, 420], [700, 420]]), { tone: .55, blur: 2, edge: .35 });
    sweepBrush(x, [[700, 200], [960, 190], [1220, 200]], { w: 20, ink: .8, dry: .3, seed: 1, bristles: 14 });
    brush(x, [[300, 420], [300, 80]], { w: 8, dry: .2, seed: 2, bristles: 6 });
    x.fillStyle = 'rgba(184,38,29,.7)'; x.beginPath(); x.moveTo(300, 90); x.lineTo(400, 120); x.lineTo(300, 180); x.fill();
    x.fillStyle = 'rgba(50,40,30,.7)'; x.fillRect(1500, 100, 120, 280);
    brush(x, circ(1560, 160, 40, 40, 0, 6.3, 20), { w: 4, dry: .3, seed: 3, bristles: 8 });
    for (let i = 0; i < 12; i++) brush(x, [[0, 520 + i * 45], [1920, 510 + i * 45]], { w: 2, dry: .7, seed: 10 + i, bristles: 4, ink: .25 });
    const r = rng(17);
    for (let i = 0; i < 80; i++) {
      const fx = 40 + (i % 16) * 118 + r() * 18, fy = 560 + Math.floor(i / 16) * 95 + r() * 12;
      const sc = 0.35 + (fy - 560) / 500 * 0.5;
      x.save(); x.translate(fx, fy); x.scale(sc, sc);
      sweepBrush(x, [[0, 80], [0, 20]], { w: 22, ink: .85, dry: .3, seed: i, bristles: 10 });
      x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.arc(0, 0, 16, 0, 7); x.fill();
      brush(x, circ(0, 0, 16, 18, -.3, 5.5, 14), { w: 3, dry: .25, seed: i + 1, bristles: 5 });
      x.fillStyle = 'rgb(20,18,16)'; x.beginPath(); x.arc(-5.5, -1, 2.2, 0, 7); x.arc(5.5, -1, 2.2, 0, 7); x.fill();
      // 「我做过」牌
      x.fillStyle = '#f7efdc'; x.fillRect(-28, -95, 56, 48);
      x.strokeStyle = 'rgba(184,38,29,.6)'; x.strokeRect(-28, -95, 56, 48);
      x.fillStyle = 'rgba(18,16,14,.9)'; x.font = '16px Brush'; x.textAlign = 'center'; x.fillText('我做过', 0, -68);
      x.restore();
    }
    sealCh(x, '众', 1780, 110, .55);
  });
}

export async function W07_cafeRevisit() {
  return L(x => {
    paperBase(x, W, H, 71);
    wash(x, pth([[0, 0], [W, 0], [W, 420], [0, 450]]), { tone: .14, blur: 20, edge: .02, color: '40,36,50' });
    for (const [lx, ly] of [[360, 160], [1560, 150]]) {
      brush(x, [[lx, 20], [lx, ly]], { w: 3, dry: .2, seed: lx, bristles: 4 });
      wash(x, ell(lx, ly + 40, 36, 48), { tone: .45, blur: 4, edge: .25, color: '214,170,80' });
    }
    sweepBrush(x, [[80, 780], [960, 750], [1840, 780]], { w: 140, ink: .55, dry: .35, color: '55,38,22', seed: 80, bristles: 40 });
    // her closer, smiling, open hands (misread)
    figure(x, { emo: 'reconcile', view: '3qR', pose: 'gesture',
      body: [[280, 1100], [320, 820], [440, 680], [580, 650], [600, 560], [720, 555], [740, 660], [880, 740], [920, 980], [940, 1100]],
      head: [660, 470, 100, 120], hair: [[[560, 450], [575, 350], [660, 320], [745, 355], [760, 450], [710, 410], [600, 405]]],
      robe: .8, seed: 201, sweep: 65
    });
    // XL cup behind her
    x.fillStyle = '#f4ead4'; x.beginPath(); x.moveTo(1180, 560); x.lineTo(1320, 560); x.lineTo(1290, 760); x.lineTo(1210, 760); x.closePath(); x.fill();
    brush(x, [[1180, 560], [1320, 560], [1290, 760], [1210, 760], [1180, 560]], { w: 4, dry: .3, seed: 2, bristles: 8, color: '80,60,40' });
    // donation screen still lit
    x.fillStyle = 'rgba(30,28,34,.95)'; x.fillRect(1400, 620, 100, 160);
    x.fillStyle = '#e8f5e4'; x.fillRect(1408, 635, 84, 120);
    x.fillStyle = 'rgba(40,120,60,.95)'; x.font = '18px NSerif'; x.textAlign = 'center'; x.fillText('捐赠成功', 1450, 690);
    // chalk 「许可×1」
    x.font = '52px Brush'; x.fillStyle = '#b8261d'; x.textAlign = 'left'; x.fillText('许可×1', 160, 160);
    // stack of 「我做过」 cards fallen in front
    for (let i = 0; i < 6; i++) {
      x.save(); x.translate(900 + i * 28, 700 - i * 12); x.rotate(-.1 + i * .04);
      x.fillStyle = '#f7efdc'; x.fillRect(-40, -30, 80, 60);
      x.strokeStyle = 'rgba(184,38,29,.5)'; x.strokeRect(-40, -30, 80, 60);
      x.fillStyle = 'rgba(18,16,14,.85)'; x.font = '20px Brush'; x.textAlign = 'center'; x.fillText('我做过', 0, 5);
      x.restore();
    }
    sealCh(x, '误', 1780, 110, .55);
  });
}

export async function W08_scale() {
  return L(x => {
    paperBase(x, W, H, 81);
    wash(x, ell(960, 400, 600, 300), { tone: .06, blur: 40, edge: 0 });
    sweepBrush(x, [[200, 400], [960, 360], [1720, 430]], { w: 28, ink: .9, dry: .25, seed: 1, bristles: 20 }); // tilted: badge heavy
    brush(x, [[960, 370], [960, 700]], { w: 16, dry: .25, seed: 2, bristles: 12 });
    wash(x, pth([[880, 700], [1040, 700], [1000, 900], [920, 900]]), { tone: .7, blur: 2, edge: .4 });
    // left pan: badge weight sunk
    brush(x, circ(400, 540, 140, 20, 0, 6.3, 30), { w: 6, dry: .3, seed: 3, bristles: 10 });
    badge(x, 400, 480, 1.6, '善');
    for (let i = 0; i < 3; i++) { x.fillStyle = 'rgba(40,35,30,.8)'; x.beginPath(); x.arc(340 + i * 45, 560, 18, 0, 7); x.fill(); }
    x.font = '40px Brush'; x.fillStyle = 'rgba(18,16,14,.9)'; x.textAlign = 'center'; x.fillText('好人徽章', 400, 620);
    // right pan: mini cart rising then pressed
    brush(x, circ(1520, 500, 140, 20, 0, 6.3, 30), { w: 6, dry: .3, seed: 5, bristles: 10 });
    x.strokeStyle = 'rgba(30,28,26,.85)'; x.lineWidth = 6; x.strokeRect(1420, 420, 200, 110);
    for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(1430, 440 + i * 22); x.lineTo(1610, 440 + i * 22); x.stroke(); }
    for (const wx of [1450, 1590]) brush(x, circ(wx, 545, 22, 22, 0, 6.3, 14), { w: 5, dry: .25, seed: wx, bristles: 6 });
    x.font = '40px Brush'; x.fillStyle = '#b8261d'; x.fillText('放纵的车', 1520, 600);
    // hanging cords
    for (const [bx, py] of [[400, 540], [1520, 500]]) {
      const by = bx < 960 ? 388 : 395;
      for (const ox of [-120, 0, 120]) brush(x, [[bx, by], [bx + ox, py - 4]], { w: 2.5, dry: .3, seed: bx + ox, bristles: 4, ink: .8 });
    }
    // scale stars
    for (let i = -3; i <= 3; i++) brush(x, [[960 + i * 90, 355], [960 + i * 90, 375]], { w: 3, dry: .2, seed: 10 + i, bristles: 4 });
    sealCh(x, '秤', 1780, 110, .55);
  });
}

export async function W09_cartLock() {
  return L(x => {
    paperBase(x, W, H, 91);
    wash(x, pth([[0, 0], [W, 0], [W, 500], [0, 560]]), { tone: .08, blur: 20, edge: 0, color: '50,60,70' });
    for (let i = 0; i < 12; i++) brush(x, [[0, 620 + i * 40], [1920, 600 + i * 38]], { w: 2, dry: .5, seed: 50 + i, ink: .25, bristles: 4, color: '80,70,60' });
    const cx = 1180, cy = 720;
    x.strokeStyle = 'rgba(30,28,26,.85)'; x.lineWidth = 8; x.strokeRect(cx - 200, cy - 80, 420, 220);
    for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(cx - 190, cy - 60 + i * 36); x.lineTo(cx + 210, cy - 60 + i * 36); x.stroke(); }
    for (const [wx, wy] of [[cx - 160, cy + 180], [cx + 160, cy + 180]]) {
      brush(x, circ(wx, wy, 42, 42, 0, 6.3, 24), { w: 10, dry: .3, seed: wx, bristles: 12 });
      x.fillStyle = 'rgba(239,229,207,.9)'; x.beginPath(); x.ellipse(wx, wy, 18, 18, 0, 0, 7); x.fill();
    }
    // chain springing open
    brush(x, [[cx - 40, cy + 40], [cx + 20, cy - 10], [cx + 90, cy - 80], [cx + 160, cy - 140]], { w: 14, dry: .25, seed: 70, bristles: 10, color: '60,55,50' });
    x.strokeStyle = 'rgba(184,38,29,.85)'; x.lineWidth = 10; x.beginPath(); x.arc(cx + 200, cy - 180, 50, -0.2, 3.5); x.stroke();
    // her with glowing badge
    figure(x, { emo: 'reconcile', view: '3qR',
      body: [[320, 1080], [360, 880], [440, 780], [560, 760], [580, 680], [660, 675], [680, 770], [760, 880], [780, 1080]],
      head: [560, 620, 55, 65], hair: [[[510, 610], [520, 555], [560, 535], [600, 555], [610, 610]]],
      robe: .8, seed: 44, sweep: 50
    });
    badge(x, 580, 760, 1.15, '善');
    // price tag rain
    const r = rng(6);
    for (let i = 0; i < 20; i++) {
      const tx = 900 + r() * 900, ty = 60 + r() * 480;
      x.fillStyle = '#f7efdc'; x.fillRect(tx, ty, 70, 36);
      x.strokeStyle = 'rgba(184,38,29,.5)'; x.strokeRect(tx, ty, 70, 36);
      x.fillStyle = 'rgba(18,16,14,.85)'; x.font = '20px NSerif'; x.textAlign = 'center'; x.fillText('¥', tx + 35, ty + 24);
    }
    sealCh(x, '锁', 1780, 110, .55);
  });
}

export async function W10_gymVsSweet() {
  return L(x => {
    paperBase(x, W, H, 101);
    wash(x, pth([[0, 180], [W, 120], [W, 420], [0, 450]]), { tone: .1, blur: 16, edge: .05 });
    // street
    for (let i = 0; i < 10; i++) brush(x, [[0, 700 + i * 38], [1920, 690 + i * 38]], { w: 2, dry: .6, seed: 10 + i, bristles: 4, ink: .28 });
    // gym door LEFT — she avoids
    x.fillStyle = 'rgba(50,55,60,.85)'; x.fillRect(120, 280, 420, 480);
    brush(x, rectPts(120, 280, 420, 480, 8), { w: 5, dry: .3, seed: 1, bristles: 8 });
    x.font = '48px Brush'; x.fillStyle = 'rgba(239,229,207,.9)'; x.textAlign = 'center'; x.fillText('健身房', 330, 360);
    // dumbbell silhouette
    brush(x, [[220, 520], [440, 520]], { w: 14, dry: .2, seed: 2, bristles: 8 });
    wash(x, ell(220, 520, 30, 40), { tone: .8, blur: 1, edge: .4 }); wash(x, ell(440, 520, 30, 40), { tone: .8, blur: 1, edge: .4 });
    // sweet shop RIGHT
    x.fillStyle = 'rgba(160,80,60,.75)'; x.fillRect(1280, 300, 520, 460);
    brush(x, rectPts(1280, 300, 520, 460, 8), { w: 5, dry: .3, seed: 3, bristles: 8, color: '120,50,30' });
    x.font = '48px Brush'; x.fillStyle = '#f7efdc'; x.fillText('甜品', 1540, 380);
    // cake display
    for (let i = 0; i < 4; i++) {
      wash(x, ell(1380 + i * 100, 560, 36, 28), { tone: .5, blur: 2, edge: .25, color: i % 2 ? '184,38,29' : '214,170,80' });
      x.fillStyle = 'rgba(240,220,180,.9)'; x.fillRect(1355 + i * 100, 580, 50, 40);
    }
    // her walking toward sweets, footprints arc AROUND gym
    figure(x, { emo: 'reconcile', view: 'profR',
      body: [[900, 980], [920, 840], [960, 780], [1020, 770], [1040, 840], [1060, 980]],
      head: [980, 720, 40, 48], hair: [[[945, 710], [955, 675], [980, 662], [1005, 675], [1012, 710]]],
      robe: .8, seed: 20, sweep: 32
    });
    // curved footprints avoiding gym
    for (let i = 0; i < 8; i++) {
      const t = i / 7, px = 500 + t * 500, py = 880 - Math.sin(t * Math.PI) * 80;
      wash(x, ell(px, py, 14, 8), { tone: .45, blur: 1, edge: .3 });
    }
    sealCh(x, '绕', 1780, 110, .55);
  });
}

export async function W11_fastFashion() {
  return L(x => {
    paperBase(x, W, H, 111);
    wash(x, pth([[0, 0], [W, 0], [W, 400], [0, 430]]), { tone: .08, blur: 20, edge: 0, color: '60,50,70' });
    // store interior
    for (const rx of [200, 960, 1600]) sweepBrush(x, [[rx, 200], [rx, 900]], { w: 8, dry: .4, seed: rx, bristles: 6, color: '80,70,60', ink: .4 });
    // racks
    for (let i = 0; i < 6; i++) {
      const hx = 300 + i * 260;
      brush(x, [[hx, 280], [hx, 700]], { w: 5, dry: .25, seed: 10 + i, bristles: 5 });
      for (let k = 0; k < 4; k++) {
        wash(x, pth([[hx - 40, 320 + k * 80], [hx + 40, 320 + k * 80], [hx + 30, 400 + k * 80], [hx - 30, 400 + k * 80]]), { tone: .35 + (k % 2) * .15, blur: 2, edge: .3, color: k % 2 ? '40,50,90' : '120,40,30' });
      }
    }
    // eco tote OVERFULL
    x.fillStyle = 'rgba(80,100,70,.9)'; x.beginPath(); x.moveTo(820, 520); x.lineTo(1100, 520); x.lineTo(1140, 860); x.lineTo(780, 860); x.closePath(); x.fill();
    brush(x, [[820, 520], [1100, 520], [1140, 860], [780, 860], [820, 520]], { w: 5, dry: .3, seed: 1, bristles: 8, color: '40,60,40' });
    brush(x, [[860, 520], [860, 400]], { w: 8, dry: .2, seed: 2, bristles: 6 }); brush(x, [[1060, 520], [1060, 400]], { w: 8, dry: .2, seed: 3, bristles: 6 });
    x.font = '32px Brush'; x.fillStyle = '#f7efdc'; x.textAlign = 'center'; x.fillText('环保袋', 960, 700);
    // hang tags cascading out
    const r = rng(8);
    for (let i = 0; i < 18; i++) {
      const tx = 1000 + r() * 500, ty = 400 + r() * 400;
      x.fillStyle = '#f7efdc'; x.fillRect(tx, ty, 60, 90);
      x.strokeStyle = 'rgba(184,38,29,.55)'; x.strokeRect(tx, ty, 60, 90);
      x.fillStyle = 'rgba(18,16,14,.85)'; x.font = '18px NSerif'; x.fillText('TAG', tx + 30, ty + 50);
      brush(x, [[tx + 30, ty], [tx + 30, ty - 30]], { w: 2, dry: .3, seed: 50 + i, bristles: 3 });
    }
    // mirror + scanner gun
    x.fillStyle = 'rgba(180,190,200,.5)'; x.fillRect(1600, 300, 200, 360);
    brush(x, rectPts(1600, 300, 200, 360, 6), { w: 4, dry: .3, seed: 4, bristles: 6, color: '80,90,100' });
    x.fillStyle = 'rgba(40,40,40,.9)'; x.fillRect(200, 780, 100, 40);
    brush(x, [[250, 780], [250, 720]], { w: 10, dry: .2, seed: 5, bristles: 6 });
    sealCh(x, '袋', 1780, 110, .55);
  });
}

export async function W12_stelePhone() {
  return L(x => {
    paperBase(x, W, H, 121);
    wash(x, pth([[0, 200], [W, 140], [W, 450], [0, 470]]), { tone: .1, blur: 16, edge: .05 });
    // stone stele LEFT 「积德」
    x.fillStyle = 'rgba(70,65,55,.92)'; x.fillRect(280, 220, 420, 620);
    brush(x, rectPts(280, 220, 420, 620, 10), { w: 8, dry: .35, seed: 1, bristles: 12, color: '100,90,70' });
    // rubbing texture
    for (let i = 0; i < 12; i++) brush(x, [[300, 260 + i * 48], [680, 250 + i * 48]], { w: 2, dry: .7, seed: 10 + i, bristles: 4, ink: .2 });
    x.font = '140px Brush'; x.fillStyle = 'rgba(239,229,207,.92)'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('积德', 490, 500);
    // phone RIGHT with points +1
    x.fillStyle = 'rgba(28,28,32,.95)'; x.fillRect(1180, 280, 420, 700);
    brush(x, rectPts(1180, 280, 420, 700, 28), { w: 4, dry: .25, seed: 2, bristles: 8 });
    x.fillStyle = '#eef6ff'; x.fillRect(1200, 320, 380, 620);
    x.font = '48px Brush'; x.fillStyle = 'rgba(18,16,14,.9)'; x.fillText('积分', 1390, 420);
    x.font = '100px Brush'; x.fillStyle = '#b8261d'; x.fillText('+1', 1390, 560);
    // scan vibrate rings
    for (let i = 1; i <= 4; i++) brush(x, circ(1390, 700, 40 * i, 20 * i, 0, 6.2, 24), { w: 3, dry: .5, seed: 30 + i, bristles: 5, ink: .35, color: '48,72,138' });
    // morph wash connecting stele to phone
    wash(x, pth([[700, 480], [900, 450], [1100, 500], [1180, 520]]), { tone: .15, blur: 12, edge: .1, color: '80,60,40' });
    sealCh(x, '古', 1780, 110, .55);
  });
}

export async function W13_ledgerRoom() {
  return L(x => {
    paperBase(x, W, H, 131);
    wash(x, pth([[0, 0], [W, 0], [W, 400], [0, 430]]), { tone: .1, blur: 22, edge: 0, color: '60,48,36' });
    // pillars
    for (const px of [200, 1720]) sweepBrush(x, [[px, 100], [px, 900]], { w: 50, ink: .65, dry: .35, seed: px, bristles: 22, color: '90,40,28' });
    // desk
    wash(x, pth([[400, 620], [1520, 620], [1560, 740], [360, 740]]), { tone: .55, blur: 3, edge: .25, color: '140,28,20' });
    sweepBrush(x, [[380, 625], [960, 615], [1540, 625]], { w: 18, ink: .85, dry: .3, seed: 41, bristles: 16 });
    // clerk
    figure(x, { emo: 'neutral', view: 'front',
      body: [[820, 620], [840, 480], [900, 420], [1020, 420], [1080, 480], [1100, 620]],
      head: [960, 360, 55, 65], hair: [[[910, 345], [920, 300], [960, 285], [1000, 300], [1010, 345]]],
      robe: .85, seed: 77, sweep: 48
    });
    // abacus
    x.fillStyle = '#c4a574'; x.fillRect(500, 580, 280, 50);
    for (let i = 0; i < 8; i++) { x.fillStyle = 'rgba(30,20,10,.8)'; x.beginPath(); x.arc(520 + i * 32, 605, 10, 0, 7); x.fill(); }
    // ledger book
    x.fillStyle = '#f7efdc'; x.fillRect(1200, 520, 200, 140);
    brush(x, rectPts(1200, 520, 200, 140, 5), { w: 3, dry: .3, seed: 1, bristles: 6 });
    x.font = '28px Brush'; x.fillStyle = 'rgba(18,16,14,.85)'; x.textAlign = 'center'; x.fillText('放纵账', 1300, 580);
    // vermilion seal 「算平」 stamping over the indulgence line
    x.fillStyle = 'rgba(184,38,29,.85)'; x.fillRect(1240, 600, 120, 50);
    x.fillStyle = '#fbf3e3'; x.font = '32px Brush'; x.fillText('算平', 1300, 632);
    // brush wiping the ledger
    brush(x, [[1400, 480], [1480, 560], [1520, 620]], { w: 10, dry: .3, seed: 5, bristles: 8, color: '40,30,20' });
    sealCh(x, '账', 1780, 110, .55);
  });
}

export async function W14_shanSplit() {
  return L(x => {
    paperBase(x, W, H, 141);
    wash(x, ell(960, 480, 700, 420), { tone: .1, blur: 40, edge: 0, color: '40,36,32' });
    x.save();
    x.font = '520px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = 'rgba(30,26,22,.55)';
    x.save(); x.beginPath(); x.rect(0, 0, 930, H); x.clip(); x.fillText('善', 900, 500); x.restore();
    x.save(); x.beginPath(); x.rect(990, 0, W, H); x.clip(); x.fillText('善', 1020, 500); x.restore();
    x.restore();
    wash(x, pth([[955, 120], [980, 500], [950, 880], [970, 900], [1000, 500], [975, 100]]), { tone: .7, blur: 8, edge: .2, color: '184,38,29' });
    brush(x, [[960, 140], [975, 500], [955, 860]], { w: 10, dry: .4, seed: 90, bristles: 8, color: '184,38,29' });
    wash(x, ell(970, 500, 120, 120), { tone: .5, blur: 22, edge: .1, color: '214,170,80' });
    x.font = '200px Brush'; x.fillStyle = 'rgba(184,38,29,.92)'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('可', 970, 510);
    const r = rng(8);
    for (let i = 0; i < 24; i++) {
      const a = r() * 6.28, d = 180 + r() * 420;
      brush(x, [[960 + Math.cos(a) * d, 500 + Math.sin(a) * d * .7], [960 + Math.cos(a) * (d + 40), 500 + Math.sin(a) * (d + 40) * .7]], { w: 4 + r() * 8, dry: .5, seed: 100 + i, bristles: 5, ink: .6 });
    }
    sealCh(x, '可', 1780, 110, .55);
  });
}

export async function W15_mirrorHall() {
  return L(x => {
    paperBase(x, W, H, 151);
    x.fillStyle = 'rgba(160,120,50,.85)'; x.fillRect(360, 80, 1200, 820);
    x.fillStyle = '#efe5cf'; x.fillRect(420, 140, 1080, 700);
    brush(x, rectPts(360, 80, 1200, 820, 12), { w: 10, dry: .3, seed: 1, bristles: 12, color: '120,90,30' });
    // her under the plaque
    figure(x, { emo: 'reconcile', view: 'front',
      body: [[780, 780], [820, 560], [900, 480], [1020, 480], [1100, 560], [1140, 780]],
      head: [960, 380, 90, 108], hair: [[[870, 360], [885, 280], [960, 250], [1035, 280], [1050, 360], [1000, 320], [900, 320]]],
      robe: .78, seed: 15, sweep: 55
    });
    // plaque 道德许可
    x.save(); x.translate(960, 200); x.rotate(-.02);
    x.fillStyle = 'rgb(48,72,138)'; x.fillRect(-260, -48, 520, 96);
    x.fillStyle = '#f4efe6'; x.font = '52px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('道德许可', 0, -6);
    x.font = '22px NSerif'; x.fillText('据 Merritt / Monin · 简化模型', 0, 34);
    x.restore();
    // receipts / empty seat exiting behind her (consequence)
    x.save(); x.globalAlpha = .45;
    for (let i = 0; i < 5; i++) receipt(x, 1280 + i * 70, 620 + (i % 2) * 40, i % 2 ? '超大杯' : '放纵', .1 * i, .7);
    brush(x, [[1400, 720], [1480, 640], [1560, 720], [1520, 820], [1440, 820]], { w: 8, dry: .4, seed: 40, bristles: 10, color: '90,80,70' });
    x.restore();
    // exit trail
    for (let i = 0; i < 5; i++) brush(x, [[1360 + i * 55, 780], [1385 + i * 55, 780]], { w: 3, dry: .5, seed: 50 + i, bristles: 4, color: '120,90,70', ink: .4 });
    sealCh(x, '许', 1780, 110, .55);
  });
}

export async function W16_mirrorCorridor() {
  return L(x => {
    paperBase(x, W, H, 161);
    wash(x, pth([[0, 860], [1920, 840], [1920, 1080], [0, 1080]]), { tone: .12, blur: 10, edge: .1, color: '120,90,50' });
    // gold mirror
    const MX0 = 700, MY0 = 120, MX1 = 1500, MY1 = 820;
    x.fillStyle = 'rgba(160,120,50,.9)'; x.fillRect(MX0 - 44, MY0 - 44, MX1 - MX0 + 88, MY1 - MY0 + 88);
    brush(x, rectPts(MX0 - 44, MY0 - 44, MX1 - MX0 + 88, MY1 - MY0 + 88, 12), { w: 10, dry: .3, seed: 3, bristles: 12, color: '110,80,28' });
    x.fillStyle = '#e9e4d6'; x.fillRect(MX0, MY0, MX1 - MX0, MY1 - MY0);
    // polished good-person reflection
    figure(x, { emo: 'reconcile', view: 'front',
      body: [[900, 780], [930, 600], [1000, 520], [1120, 520], [1190, 600], [1220, 780]],
      head: [1060, 420, 70, 84], hair: [[[990, 405], [1000, 345], [1060, 325], [1120, 345], [1130, 405]]],
      robe: .9, seed: 1602, sweep: 48
    });
    badge(x, 1060, 580, 1.0, '善');
    // her polishing (side)
    figure(x, { emo: 'neutral', view: 'profR',
      body: [[280, 1100], [320, 860], [400, 720], [500, 680], [520, 600], [600, 595], [620, 690], [700, 800], [740, 1050]],
      head: [540, 520, 70, 84], hair: [[[480, 505], [490, 440], [540, 415], [590, 440], [600, 505]]],
      limbs: [{ pts: [[600, 700], [780, 560], [900, 480]], w: 24 }], robe: .8, seed: 1621, sweep: 55
    });
    // cloth
    wash(x, ell(920, 470, 50, 36), { tone: .5, blur: 2, edge: .2, color: '200,180,140' });
    // bill mountain BEHIND her (she doesn't look)
    for (let i = 0; i < 25; i++) {
      const bx = 1480 + (i % 5) * 55, by = 500 + Math.floor(i / 5) * 70;
      receipt(x, bx, by, i % 2 ? '账单' : '放纵', (i % 5) * .05, .55);
    }
    sealCh(x, '像', 1780, 110, .55);
  });
}

export async function W17_shatter() {
  return L(x => {
    paperBase(x, W, H, 171);
    const r = rng(19);
    for (let i = 0; i < 40; i++) {
      const sx = 200 + r() * 1500, sy = 100 + r() * 800;
      const pts = [];
      for (let k = 0; k < 5; k++) pts.push([sx + (r() - .5) * 120, sy + (r() - .5) * 120]);
      wash(x, pth(pts), { tone: .25 + r() * .3, blur: 1, edge: .35 });
      brush(x, [...pts, pts[0]], { w: 3, dry: .3, seed: i, bristles: 5, color: '80,70,50' });
    }
    // cracked badge among shards
    badge(x, 960, 540, 1.2, '裂');
    sealCh(x, '碎', 1780, 110, .55);
  });
}

export async function W17b_cinnabar() {
  return L(x => {
    x.fillStyle = '#0a0908'; x.fillRect(0, 0, W, H);
    wash(x, ell(960, 540, 18, 18), { tone: .95, blur: 2, edge: .5, color: '184,38,29' });
    wash(x, ell(960, 540, 60, 60), { tone: .25, blur: 20, edge: 0, color: '184,38,29' });
  });
}

export async function W18_river() {
  return L(x => {
    paperBase(x, W, H, 181);
    wash(x, ell(1500, 180, 80, 80), { tone: .14, blur: 6, edge: .25 });
    wash(x, pth([[0, 400], [500, 320], [1000, 380], [1500, 300], [1920, 360], [1920, 500], [0, 520]]), { tone: .12, blur: 16, edge: .05 });
    wash(x, pth([[0, 540], [700, 500], [1300, 520], [1920, 480], [1920, 880], [0, 900]]), { tone: .15, blur: 18, edge: .04, color: '48,72,138' });
    for (let i = 0; i < 12; i++) brush(x, [[0, 580 + i * 28], [960, 560 + i * 30], [1920, 540 + i * 32]], { w: 3, dry: .7, seed: 600 + i, bristles: 5, ink: .22, color: '40,50,90' });
    // bridge
    wash(x, pth([[1000, 500], [1100, 400], [1260, 370], [1420, 400], [1520, 500], [1440, 500], [1380, 440], [1260, 420], [1140, 440], [1080, 500]]), { tone: .65, blur: 2, edge: .4 });
    sweepBrush(x, [[980, 410], [1260, 365], [1540, 410]], { w: 16, ink: .85, dry: .3, seed: 61, bristles: 12 });
    const r = rng(9);
    for (let i = 0; i < 22; i++) {
      const rx = 20 + r() * 300, h = 200 + r() * 180;
      brush(x, [[rx, 900], [rx + 8, 900 - h * .55], [rx + 25, 900 - h]], { w: 4, dry: .3, seed: 700 + i, bristles: 5 });
    }
    // good-deed strips → excuse strips
    for (let i = 0; i < 50; i++) {
      const tt = r(); const y = 540 + tt * tt * 300; const s = .3 + tt * .9, xx = r() * 1920;
      const lab = i < 20 ? '善行' : '所以我可以…';
      hSlip(x, xx, y, (r() - .5) * .4, lab, s * .7);
    }
    sealCh(x, '流', 1830, 110, .55);
  });
}

export async function W19_ashHand() {
  return L(x => {
    paperBase(x, W, H, 191);
    wash(x, pth([[0, 0], [1920, 0], [1920, 1080], [0, 1080]]), { tone: .12, blur: 30, edge: 0, color: '48,72,138' });
    for (let i = 0; i < 16; i++) brush(x, [[0, 80 + i * 60], [1920, 60 + i * 60 + Math.sin(i) * 20]], { w: 2, dry: .7, seed: 10 + i, bristles: 4, ink: .2, color: '40,50,90' });
    // left hand holding ash
    brush(x, [[80, 900], [160, 720], [260, 640], [320, 620]], { w: 36, dry: .2, seed: 5, bristles: 16, color: '30,26,22' });
    brush(x, [[260, 640], [320, 620]], { w: 22, dry: .15, seed: 6, color: '239,229,207', ink: .95, bristles: 12 });
    x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(360, 600, 50, 36, -.3, 0, 7); x.fill();
    brush(x, circ(360, 600, 50, 36, -.3, 6.2, 16), { w: 3, dry: .2, seed: 7, bristles: 5 });
    // ash pile in palm
    const r = rng(21);
    for (let i = 0; i < 40; i++) {
      x.fillStyle = `rgba(40,36,32,${.3 + r() * .5})`;
      x.beginPath(); x.ellipse(340 + r() * 50, 590 + r() * 30, 3 + r() * 6, 2 + r() * 3, r(), 0, 7); x.fill();
    }
    // right hand reaching for floating new badge
    brush(x, [[1400, 900], [1500, 750], [1600, 650], [1680, 580]], { w: 30, dry: .2, seed: 15, bristles: 14, color: '30,26,22' });
    x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(1720, 560, 40, 28, .4, 0, 7); x.fill();
    for (let k = 0; k < 4; k++) brush(x, [[1740, 545 + k * 10], [1820, 520 + k * 12]], { w: 4, dry: .15, seed: 20 + k, bristles: 4 });
    // floating badge approaching
    badge(x, 1500, 380, 1.3, '善');
    // duckweed
    for (let i = 0; i < 18; i++) wash(x, ell(r() * 1920, 700 + r() * 300, 16 + r() * 20, 8 + r() * 10), { tone: .35, blur: 2, edge: .15, color: '50,80,40' });
    sealCh(x, '灰', 1780, 110, .55);
  });
}

export async function W20_rainStreet() {
  return L(x => {
    paperBase(x, W, H, 201);
    wash(x, pth([[0, 150], [600, 80], [1300, 140], [1920, 70], [1920, 400], [0, 420]]), { tone: .15, blur: 18, edge: .05, color: '40,40,50' });
    // winding path (路越绕)
    for (let i = 0; i < 16; i++) {
      const t = i / 15, y = 500 + i * 35;
      const x0 = 400 + Math.sin(t * 4) * 280, x1 = 1500 + Math.sin(t * 4 + 1) * 200;
      brush(x, [[x0, y], [x1, y]], { w: 2, dry: .6, seed: 10 + i, bristles: 4, ink: .3 });
    }
    // eaves lamps
    for (const lx of [300, 700, 1200, 1600]) {
      wash(x, ell(lx, 280, 24, 32), { tone: .5, blur: 4, edge: .25, color: '184,38,29' });
      brush(x, [[lx, 200], [lx, 250]], { w: 3, dry: .2, seed: lx, bristles: 4 });
      wash(x, ell(lx, 850, 18, 10), { tone: .3, blur: 6, edge: .1, color: '184,38,29' });
    }
    // her with umbrella + wet ledger
    figure(x, { emo: 'regret', view: '3qR',
      body: [[880, 920], [900, 800], [940, 760], [1000, 765], [1030, 820], [1040, 940]],
      head: [965, 720, 40, 48], hair: [[[930, 708], [940, 670], [965, 660], [990, 675], [995, 710]]],
      robe: .85, seed: 20, sweep: 35, cw: 7
    });
    wash(x, ell(965, 640, 90, 35), { tone: .55, blur: 2, edge: .35 });
    brush(x, [[965, 640], [965, 720]], { w: 4, dry: .2, seed: 1, bristles: 5 });
    // wet account book in hand
    x.fillStyle = '#f0e6d0'; x.fillRect(1040, 780, 70, 90);
    brush(x, rectPts(1040, 780, 70, 90, 3), { w: 2, dry: .3, seed: 2, bristles: 4 });
    x.font = '18px Brush'; x.fillStyle = 'rgba(18,16,14,.8)'; x.textAlign = 'center'; x.fillText('账', 1075, 830);
    // rain
    const r = rng(23);
    for (let i = 0; i < 60; i++) brush(x, [[r() * 1920, r() * 900], [r() * 1920 - 10, r() * 900 + 40]], { w: 1.5, dry: .5, seed: 50 + i, bristles: 3, ink: .25 });
    sealCh(x, '绕', 1780, 110, .55);
  });
}

export async function W21_emptyCounter() {
  return L(x => {
    paperBase(x, W, H, 211);
    wash(x, pth([[0, 0], [W, 0], [W, 420], [0, 450]]), { tone: .16, blur: 20, edge: .02, color: '40,36,50' });
    for (const [lx, ly] of [[360, 160], [1560, 150]]) {
      brush(x, [[lx, 20], [lx, ly]], { w: 3, dry: .2, seed: lx, bristles: 4 });
      wash(x, ell(lx, ly + 40, 36, 48), { tone: .35, blur: 4, edge: .25, color: '214,170,80' }); // colder
    }
    sweepBrush(x, [[80, 780], [960, 750], [1840, 780]], { w: 140, ink: .5, dry: .35, color: '55,38,22', seed: 90, bristles: 40 });
    // empty cup + lid upside down
    x.fillStyle = '#e8dcc0'; x.beginPath(); x.ellipse(720, 720, 50, 20, 0, 0, 7); x.fill();
    wash(x, ell(720, 718, 32, 8), { tone: .15, blur: 2, edge: .1, color: '60,40,20' });
    x.save(); x.translate(860, 730); x.rotate(1.0);
    x.fillStyle = '#e8dcc0'; x.beginPath(); x.ellipse(0, 0, 48, 18, 0, 0, 7); x.fill(); x.restore();
    // TWO receipts side by side — 捐赠 + 超大杯
    receipt(x, 1100, 680, '捐赠 ¥200', -.05, 1.1);
    receipt(x, 1280, 690, '超大杯', .08, 1.1);
    // her faded/distant regret
    x.globalAlpha = .4;
    figure(x, { emo: 'regret', view: '3qR', pose: 'bow',
      body: [[200, 1100], [240, 880], [320, 780], [420, 760], [440, 700], [520, 695], [540, 770], [620, 880], [640, 1100]],
      head: [460, 640, 70, 84], hair: [[[400, 625], [415, 560], [460, 540], [505, 565], [520, 625]]],
      robe: .55, seed: 200, sweep: 50
    });
    x.globalAlpha = 1;
    sealCh(x, '据', 1780, 110, .55);
  });
}

export async function W22_handscroll() {
  return L(x => {
    paperBase(x, W, H, 221);
    sweepBrush(x, [[0, 900], [960, 880], [1920, 900]], { w: 80, ink: .4, dry: .4, seed: 1, bristles: 30, color: '70,50,30' });
    x.fillStyle = '#f4ead4'; x.fillRect(200, 280, 1400, 420);
    brush(x, rectPts(200, 280, 1400, 420, 10), { w: 5, dry: .3, seed: 2, bristles: 8, color: '80,60,40' });
    x.fillStyle = 'rgba(60,40,20,.9)'; x.fillRect(160, 260, 50, 460); x.fillRect(1590, 260, 50, 460);
    // mini cafe + two receipts stamped on scroll
    wash(x, pth([[300, 360], [500, 320], [800, 350], [1100, 310], [1400, 340], [1400, 420], [300, 440]]), { tone: .1, blur: 8, edge: .05 });
    sweepBrush(x, [[400, 520], [900, 510], [1400, 520]], { w: 20, ink: .5, dry: .35, seed: 3, bristles: 14, color: '55,38,22' });
    receipt(x, 700, 480, '捐赠', 0, .55); receipt(x, 900, 485, '超大杯', .05, .55);
    x.font = '36px Brush'; x.fillStyle = 'rgba(18,16,14,.7)'; x.textAlign = 'center'; x.fillText('刚做完好事为什么更容易放纵', 960, 600);
    wash(x, ell(960, 720, 60, 25), { tone: .7, blur: 2, edge: .4, color: '80,30,30' });
    figure(x, { emo: 'reconcile', view: '3qL',
      body: [[1500, 1100], [1520, 900], [1600, 800], [1750, 780], [1780, 900], [1800, 1100]],
      head: [1680, 720, 50, 58],
      limbs: [{ pts: [[1600, 850], [1450, 700], [1350, 650], [1280, 620]], w: 28 }],
      robe: .7, seed: 22, sweep: 40
    });
    sealCh(x, '问', 1780, 110, .55);
  });
}

export const WORLDS = [
  W01_cafe, W02_foam, W03_classroom, W04_petalMicro, W05_temple, W06_crowd,
  W07_cafeRevisit, W08_scale, W09_cartLock, W10_gymVsSweet, W11_fastFashion,
  W12_stelePhone, W13_ledgerRoom, W14_shanSplit, W15_mirrorHall, W16_mirrorCorridor,
  W17_shatter, W18_river, W19_ashHand, W20_rainStreet, W21_emptyCounter, W22_handscroll
];

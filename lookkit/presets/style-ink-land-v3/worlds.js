import {
  W, H, L, brush, sweepBrush, wash, pth, ell, circ, paperBase, rectPts, figure,
  slip, hSlip, spear, sealCh, EX, rng, horse, inkFig, face, mkCanvas
} from './helpers.js';

export async function W01_dinner() {
  return L(x => {
    paperBase(x, W, H, 11);
    wash(x, pth([[0, 200], [400, 120], [900, 180], [1400, 90], [1920, 150], [1920, 400], [0, 420]]), { tone: .12, blur: 18, edge: .05 });
    // hanging lanterns
    for (const [lx, ly] of [[300, 140], [1620, 130]]) {
      brush(x, [[lx, 20], [lx, ly]], { w: 3, dry: .2, seed: lx, bristles: 4 });
      wash(x, ell(lx, ly + 50, 28, 40), { tone: .55, blur: 3, edge: .3, color: '184,38,29' });
      brush(x, [[lx, ly + 90], [lx, ly + 120]], { w: 4, dry: .4, seed: lx + 1, bristles: 5, color: '140,30,20' });
    }
    // table
    sweepBrush(x, [[220, 760], [960, 735], [1700, 760]], { w: 130, ink: .55, dry: .35, color: '55,38,22', seed: 80, bristles: 40 });
    sweepBrush(x, [[260, 820], [960, 800], [1660, 825]], { w: 60, ink: .4, dry: .45, color: '40,28,16', seed: 81, bristles: 24 });
    // tea cups
    for (const cx of [720, 1200]) {
      x.fillStyle = '#e8dcc0'; x.beginPath(); x.ellipse(cx, 720, 42, 18, 0, 0, 7); x.fill();
      brush(x, circ(cx, 720, 42, 18, 0, 6.3, 28), { w: 4, dry: .3, seed: cx, bristles: 8 });
      wash(x, ell(cx, 718, 30, 10), { tone: .25, blur: 2, edge: .1, color: '60,40,20' });
    }
    // cracked porcelain
    brush(x, [[960, 700], [990, 690], [1010, 720], [980, 735], [960, 700]], { w: 5, dry: .4, seed: 2, bristles: 8, color: '80,70,60' });
    brush(x, [[975, 700], [1000, 710]], { w: 2, dry: .2, seed: 3, bristles: 4, color: '40,30,20' });
    // five slips on table
    EX.slice(0, 5).forEach((t, i) => slip(x, 780 + i * 70, 640 - (i % 2) * 20, -.2 + i * .08, t, .85));
    // couple
    figure(x, { emo: 'guilty', view: '3qR', pose: 'gesture',
      body: [[280, 1100], [320, 820], [420, 700], [540, 680], [560, 600], [640, 595], [660, 680], [780, 720], [820, 920], [840, 1100]],
      head: [600, 520, 95, 115], hair: [[[500, 490], [520, 400], [600, 370], [680, 400], [700, 490], [660, 450], [540, 450]]],
      feats: [{ pts: [[550, 510], [580, 515]], w: 8 }, { pts: [[560, 555], [590, 552]], w: 6 }], robe: .78, seed: 200, sweep: 60
    });
    figure(x, { emo: 'anger', view: '3qL', pose: 'square',
      body: [[1100, 1100], [1140, 860], [1260, 720], [1400, 690], [1420, 610], [1500, 605], [1520, 690], [1660, 740], [1720, 940], [1740, 1100]],
      head: [1460, 530, 90, 110], hair: [[[1360, 500], [1380, 410], [1460, 380], [1540, 410], [1560, 500], [1520, 470], [1400, 460]]],
      feats: [{ pts: [[1410, 510], [1440, 512]], w: 8 }, { pts: [[1420, 550], [1450, 548]], w: 6 }], robe: .75, seed: 220, sweep: 58
    });
    sealCh(x, '歉', 1780, 110, .7);
  });
}

export async function W02_teacup() {
  return L(x => {
    paperBase(x, W, H, 21);
    wash(x, pth([[0, 0], [1920, 0], [1920, 1080], [0, 1080]]), { tone: .18, blur: 40, edge: 0, color: '90,60,30' });
    wash(x, ell(960, 540, 700, 420), { tone: .35, blur: 30, edge: .08, color: '70,45,25' });
    for (let i = 1; i <= 6; i++) brush(x, circ(960, 540, 80 * i, 50 * i, 0, 6.2, 40), { w: 3, dry: .5, seed: 30 + i, bristles: 6, ink: .35, color: '50,35,20' });
    // vermilion crack-bursts on the ripples (anger heat)
    for (let k = 0; k < 7; k++) {
      const a = -1.1 + k * .35, R0 = 160 + k * 55;
      brush(x, [[960 + Math.cos(a) * R0, 540 + Math.sin(a) * R0 * .62], [960 + Math.cos(a) * (R0 + 90), 540 + Math.sin(a) * (R0 + 90) * .62]], { w: 4 + (k % 3), dry: .25, seed: 70 + k, bristles: 7, color: '184,38,29', ink: .85 });
      brush(x, [[960 + Math.cos(a + .12) * (R0 + 20), 540 + Math.sin(a + .12) * (R0 + 20) * .62], [960 + Math.cos(a - .08) * (R0 + 70), 540 + Math.sin(a - .08) * (R0 + 70) * .62]], { w: 2.5, dry: .35, seed: 80 + k, bristles: 5, color: '214,58,36', ink: .7 });
    }
    const r = rng(7);
    for (let i = 0; i < 12; i++) {
      const a = r() * 6.28, rr = 80 + r() * 400;
      brush(x, [[960 + Math.cos(a) * rr, 540 + Math.sin(a) * rr * .6], [960 + Math.cos(a) * rr + 20, 540 + Math.sin(a) * rr * .6 + 8]], { w: 5, dry: .3, seed: 40 + i, bristles: 5, color: '40,55,30' });
    }
    wash(x, ell(960, 300, 500, 120), { tone: .08, blur: 40, edge: 0 });
    // knitted-brow ANGER reflection (not a smile): brows down, slit eyes, tight mouth, temple flick
    x.save(); x.globalAlpha = .72;
    wash(x, ell(960, 530, 140, 160), { tone: .12, blur: 8, edge: .2 }); // face oval in tea
    brush(x, [[900, 470], [940, 495], [960, 500]], { w: 11, dry: .15, seed: 1, bristles: 10 }); // left brow knit inward/down
    brush(x, [[1020, 470], [980, 495], [960, 500]], { w: 11, dry: .15, seed: 2, bristles: 10 }); // right brow
    brush(x, [[915, 530], [945, 528]], { w: 5, dry: .1, seed: 3, bristles: 5 }); // slit eye L
    brush(x, [[975, 528], [1005, 530]], { w: 5, dry: .1, seed: 4, bristles: 5 }); // slit eye R
    brush(x, [[930, 585], [960, 575], [990, 585]], { w: 6, dry: .15, seed: 5, bristles: 6 }); // tight angry mouth
    brush(x, [[880, 500], [860, 470]], { w: 4, dry: .3, seed: 6, bristles: 5, color: '30,20,16' }); // temple ink flick
    x.restore();
    // knuckles whitening on the rim (her grip)
    brush(x, [[1180, 820], [1240, 800], [1300, 830]], { w: 16, dry: .2, seed: 11, bristles: 10, color: '239,229,207', ink: .9 });
    brush(x, [[1180, 820], [1240, 800], [1300, 830]], { w: 7, dry: .25, seed: 12, bristles: 8 });
    for (const px of [1200, 1240, 1280]) { x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(px, 815, 10, 8, 0, 0, 7); x.fill(); brush(x, circ(px, 815, 10, 8, 0, 6.2, 8), { w: 2, dry: .2, seed: 13, bristles: 4 }); }
    brush(x, circ(960, 540, 820, 500, 0, 6.28, 64), { w: 28, dry: .35, seed: 9, bristles: 20, color: '80,60,40', ink: .5 });
    sealCh(x, '怒', 1780, 110, .55);
  });
}

export async function W03_childhood() {
  return L(x => {
    paperBase(x, W, H, 31);
    wash(x, pth([[0, 180], [500, 100], [1100, 160], [1920, 80], [1920, 360], [0, 380]]), { tone: .1, blur: 16, edge: .05 });
    // door curtain
    for (let i = 0; i < 8; i++) sweepBrush(x, [[200 + i * 40, 120], [210 + i * 40, 700]], { w: 28, ink: .35, dry: .5, seed: 50 + i, bristles: 14, color: '120,40,30' });
    // shattered blue-white vase center
    wash(x, ell(960, 620, 120, 160), { tone: .15, blur: 4, edge: .2, color: '40,70,120' });
    brush(x, [[900, 500], [920, 450], [980, 430], [1020, 470], [1040, 560], [1000, 700], [920, 720], [880, 600], [900, 500]], { w: 8, dry: .35, seed: 1, bristles: 12, color: '40,70,120' });
    // crack lines
    [[960, 480, 900, 650], [970, 500, 1050, 680], [955, 520, 980, 720]].forEach((p, i) => brush(x, [[p[0], p[1]], [p[2], p[3]]], { w: 3, dry: .2, seed: 10 + i, bristles: 5 }));
    // shards on floor
    const r = rng(11);
    for (let i = 0; i < 14; i++) {
      const sx = 700 + r() * 500, sy = 780 + r() * 120;
      brush(x, [[sx, sy], [sx + 20 + r() * 30, sy + 10], [sx + 10, sy + 25]], { w: 4, dry: .4, seed: 20 + i, bristles: 6, color: '40,70,120' });
    }
    // child (small)
    figure(x, { emo: 'guilty', view: '3qR', pose: 'gesture',
      body: [[520, 900], [540, 780], [580, 740], [640, 750], [670, 820], [680, 920]],
      head: [600, 700, 42, 50], hair: [[[560, 690], [570, 650], [600, 640], [630, 655], [640, 695]]],
      feats: [{ pts: [[580, 700], [595, 702]], w: 5 }], robe: .7, seed: 5, sweep: 28, cw: 7
    });
    // cat
    wash(x, pth([[1180, 820], [1220, 780], [1280, 790], [1300, 840], [1260, 860], [1200, 850]]), { tone: .7, blur: 2, edge: .4 });
    brush(x, [[1280, 790], [1310, 760], [1295, 790]], { w: 5, dry: .2, seed: 6, bristles: 6 }); // ear
    brush(x, [[1185, 840], [1140, 860]], { w: 4, dry: .4, seed: 7, bristles: 5 }); // tail tip
    // mother's ruler hand (right)
    brush(x, [[1500, 500], [1580, 520], [1620, 480]], { w: 18, dry: .25, seed: 8, bristles: 12 }); // arm
    x.fillStyle = 'rgba(40,30,20,.9)'; x.fillRect(1600, 460, 18, 140); // ruler
    brush(x, rectPts(1600, 460, 18, 140, 4), { w: 3, dry: .3, seed: 9, bristles: 5 });
    sealCh(x, '幼', 1780, 110, .55);
  });
}

export async function W04_slipMicro() {
  return L(x => {
    paperBase(x, W, H, 41);
    // paper fiber fields as rice paddies
    const r = rng(13);
    for (let i = 0; i < 18; i++) {
      const y = 180 + i * 48;
      brush(x, [[0, y], [600, y + Math.sin(i) * 12], [1200, y - 8], [1920, y + 6]], { w: 3, dry: .6, seed: 100 + i, bristles: 5, ink: .3, color: '80,60,40' });
    }
    // giant 「堵」 stroke as a road
    brush(x, [[200, 300], [500, 280], [900, 320], [1400, 300], [1700, 340]], { w: 55, dry: .35, seed: 1, bristles: 30, color: '25,20,16' });
    brush(x, [[900, 200], [920, 500], [900, 800]], { w: 40, dry: .4, seed: 2, bristles: 24, color: '25,20,16' });
    // ox cart + horse carriages on the stroke-road
    wash(x, pth([[400, 260], [480, 240], [560, 260], [540, 300], [420, 300]]), { tone: .8, blur: 1, edge: .45 }); // cart
    brush(x, circ(430, 305, 18, 18, 0, 6.3, 16), { w: 4, dry: .2, seed: 3, bristles: 6 });
    brush(x, circ(530, 305, 18, 18, 0, 6.3, 16), { w: 4, dry: .2, seed: 4, bristles: 6 });
    // carriages queue
    for (let i = 0; i < 5; i++) {
      const cx = 700 + i * 160;
      wash(x, pth([[cx, 270], [cx + 70, 255], [cx + 100, 275], [cx + 90, 310], [cx + 10, 315]]), { tone: .75, blur: 1, edge: .4 });
      brush(x, circ(cx + 20, 318, 14, 14, 0, 6.3, 12), { w: 3, dry: .2, seed: 10 + i, bristles: 5 });
      brush(x, circ(cx + 80, 318, 14, 14, 0, 6.3, 12), { w: 3, dry: .2, seed: 20 + i, bristles: 5 });
    }
    // carter figure
    figure(x, { emo: 'neutral', view: 'front', body: [[350, 280], [360, 230], [385, 210], [410, 235], [415, 290]], head: [385, 190, 18, 22], robe: .85, seed: 8, sweep: 16, cw: 5 });
    // road sign
    x.fillStyle = 'rgba(40,30,20,.85)'; x.fillRect(1500, 180, 12, 120);
    x.fillStyle = '#f7efdc'; x.fillRect(1450, 160, 120, 50);
    brush(x, rectPts(1450, 160, 120, 50, 4), { w: 3, dry: .3, seed: 5, bristles: 6 });
    x.font = '28px Brush'; x.fillStyle = 'rgba(18,16,14,.9)'; x.textAlign = 'center'; x.fillText('堵车', 1510, 195);
    sealCh(x, '微', 1780, 110, .55);
  });
}

export async function W05_bambooMail() {
  return L(x => {
    paperBase(x, W, H, 51);
    wash(x, pth([[0, 0], [1920, 0], [1920, 280], [0, 300]]), { tone: .08, blur: 20, edge: 0 });
    // stacked bamboo slips as email thread
    const labels = ['回复：加班', '回复：临时会', '回复：手机没电', '回复：堵车', '回复：不是故意', '原件：迟到'];
    labels.forEach((lab, i) => {
      const y = 140 + i * 130, x0 = 380 + (i % 2) * 40;
      x.fillStyle = '#e8d4a8'; x.fillRect(x0, y, 1100, 100);
      brush(x, rectPts(x0, y, 1100, 100, 8), { w: 4, dry: .35, seed: 60 + i, bristles: 8, color: '90,70,40' });
      // bamboo segment lines
      for (let k = 1; k < 8; k++) brush(x, [[x0 + k * 130, y + 8], [x0 + k * 130, y + 92]], { w: 2, dry: .5, seed: 70 + i * 8 + k, bristles: 4, ink: .3, color: '100,80,50' });
      x.font = '40px Brush'; x.fillStyle = 'rgba(18,16,14,.9)'; x.textAlign = 'left'; x.fillText(lab, x0 + 40, y + 58);
      // 已读 seal
      x.fillStyle = 'rgba(184,38,29,.75)'; x.beginPath(); x.arc(x0 + 1000, y + 50, 28, 0, 7); x.fill();
      x.fillStyle = '#fbf3e3'; x.font = '22px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('已读', x0 + 1000, y + 52);
    });
    // inkstone + brush rack
    wash(x, ell(200, 900, 80, 40), { tone: .85, blur: 2, edge: .5 });
    wash(x, ell(200, 890, 40, 18), { tone: .9, blur: 1, edge: .4, color: '20,18,16' });
    brush(x, [[320, 700], [340, 880], [335, 950]], { w: 8, dry: .3, seed: 1, bristles: 8 }); // brush
    // clepsydra 更漏
    x.fillStyle = 'rgba(60,50,40,.7)'; x.fillRect(1700, 700, 60, 200);
    brush(x, [[1730, 700], [1730, 600]], { w: 4, dry: .2, seed: 2, bristles: 4 });
    sealCh(x, '简', 1780, 110, .55);
  });
}

export async function W06_crowd() {
  return L(x => {
    paperBase(x, W, H, 61);
    wash(x, pth([[0, 200], [600, 120], [1200, 180], [1920, 100], [1920, 420], [0, 440]]), { tone: .12, blur: 16, edge: .05 });
    // city gate
    wash(x, pth([[700, 200], [780, 80], [1140, 80], [1220, 200], [1220, 420], [700, 420]]), { tone: .55, blur: 2, edge: .35 });
    sweepBrush(x, [[700, 200], [960, 190], [1220, 200]], { w: 20, ink: .8, dry: .3, seed: 1, bristles: 14 });
    // flagpole + clock tower hint
    brush(x, [[300, 420], [300, 80]], { w: 8, dry: .2, seed: 2, bristles: 6 });
    x.fillStyle = 'rgba(184,38,29,.7)'; x.beginPath(); x.moveTo(300, 90); x.lineTo(400, 120); x.lineTo(300, 180); x.fill();
    x.fillStyle = 'rgba(50,40,30,.7)'; x.fillRect(1500, 100, 120, 280);
    brush(x, circ(1560, 160, 40, 40, 0, 6.3, 20), { w: 4, dry: .3, seed: 3, bristles: 8 }); // clock face
    // plaza bricks
    for (let i = 0; i < 12; i++) brush(x, [[0, 520 + i * 45], [1920, 510 + i * 45]], { w: 2, dry: .7, seed: 10 + i, bristles: 4, ink: .25 });
    // crowd of tiny figures each holding a slip
    const r = rng(17);
    for (let i = 0; i < 90; i++) {
      const fx = 40 + (i % 18) * 105 + r() * 20, fy = 560 + Math.floor(i / 18) * 95 + r() * 15;
      const sc = 0.35 + (fy - 560) / 500 * 0.5;
      x.save(); x.translate(fx, fy); x.scale(sc, sc);
      // body stick
      sweepBrush(x, [[0, 80], [0, 20]], { w: 22, ink: .85, dry: .3, seed: i, bristles: 10 });
      x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.arc(0, 0, 16, 0, 7); x.fill();
      brush(x, circ(0, 0, 16, 18, -.3, 5.5, 14), { w: 3, dry: .25, seed: i + 1, bristles: 5 });
      x.fillStyle = 'rgb(20,18,16)'; x.beginPath(); x.arc(-5.5, -1, 2.2, 0, 7); x.arc(5.5, -1, 2.2, 0, 7); x.fill(); // two eyes
      slip(x, 0, -50, 0, EX[i % EX.length], .55);
      x.restore();
    }
    sealCh(x, '众', 1780, 110, .55);
  });
}
export async function W07_dinnerRevisit() {
  return L(x => {
    paperBase(x, W, H, 71);
    wash(x, pth([[0, 200], [400, 120], [900, 180], [1400, 90], [1920, 150], [1920, 400], [0, 420]]), { tone: .1, blur: 18, edge: .05 });
    sweepBrush(x, [[220, 760], [960, 735], [1700, 760]], { w: 130, ink: .55, dry: .35, color: '55,38,22', seed: 80, bristles: 40 });
    // him closer, her farther
    figure(x, { emo: 'guilty', view: '3qR', pose: 'gesture',
      body: [[200, 1100], [260, 780], [400, 650], [560, 630], [580, 540], [700, 535], [720, 640], [860, 700], [900, 950], [920, 1100]],
      head: [640, 450, 110, 130], hair: [[[520, 420], [540, 320], [640, 290], [740, 320], [760, 420], [700, 380], [580, 380]]],
      feats: [{ pts: [[580, 440], [620, 448]], w: 10 }, { pts: [[590, 500], [630, 495]], w: 7 }], robe: .8, seed: 201, sweep: 70
    });
    figure(x, { emo: 'hurt', view: 'profR', pose: 'fold',
      body: [[1300, 1100], [1340, 900], [1420, 800], [1520, 780], [1540, 720], [1600, 715], [1620, 780], [1700, 850], [1740, 1000], [1760, 1100]],
      head: [1570, 650, 70, 85], hair: [[[1500, 630], [1515, 570], [1570, 550], [1625, 570], [1640, 630]]],
      feats: [{ pts: [[1535, 645], [1555, 648]], w: 6 }], robe: .7, seed: 221, sweep: 40
    });
    // abacus + ledger
    x.fillStyle = '#c4a574'; x.fillRect(900, 680, 280, 50);
    for (let i = 0; i < 8; i++) { x.fillStyle = 'rgba(30,20,10,.8)'; x.beginPath(); x.arc(920 + i * 32, 705, 10, 0, 7); x.fill(); }
    x.fillStyle = '#f7efdc'; x.fillRect(1220, 650, 160, 100);
    brush(x, rectPts(1220, 650, 160, 100, 5), { w: 3, dry: .3, seed: 1, bristles: 6 });
    x.font = '28px Brush'; x.fillStyle = 'rgba(18,16,14,.85)'; x.textAlign = 'center'; x.fillText('账', 1300, 710);
    // chalk count
    x.font = '52px Brush'; x.fillStyle = '#b8261d'; x.textAlign = 'left'; x.fillText('借口×5', 160, 160);
    // slips stack near sleeve
    EX.slice(0, 5).forEach((t, i) => slip(x, 780 + i * 18, 580 - i * 28, -.15 + i * .03, t, .9));
    sealCh(x, '辩', 1780, 110, .55);
  });
}

export async function W08_battlefield() {
  return L(x => {
    paperBase(x, W, H, 81);
    wash(x, pth([[0, 380], [400, 300], [900, 360], [1400, 260], [1920, 320], [1920, 520], [0, 540]]), { tone: .15, blur: 18, edge: .05 });
    // smoke
    for (const [sx, s] of [[280, 1], [1650, .85]]) wash(x, pth([[sx - 40, 520], [sx - 90, 280], [sx, 80], [sx + 80, 200], [sx + 40, 520]]), { tone: .2 * s, blur: 24, edge: .04 });
    // wall + crenels
    x.fillStyle = 'rgba(60,52,44,.55)'; x.fillRect(1120, 560, 800, 520);
    for (let i = 0; i < 8; i++) x.fillRect(1130 + i * 96, 520, 58, 48);
    sweepBrush(x, [[1120, 565], [1920, 560]], { w: 22, ink: .85, dry: .35, seed: 3, bristles: 18 });
    // 怒 shield
    const cx = 1480, cy = 720, R = 220;
    x.fillStyle = '#d8c39a'; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill();
    for (let k = 0; k < 7; k++) brush(x, circ(cx, cy, R - 20 - k * 24, R - 20 - k * 24, k * .4, k * .4 + 5.8, 28), { w: 8, dry: .55, seed: 80 + k, ink: .4, color: '110,80,40', bristles: 9 });
    wash(x, ell(cx, cy, R * .75, R * .75), { tone: .3, blur: 18, edge: .1, color: '184,38,29' });
    brush(x, circ(cx, cy, R, R, -1.6, 4.7, 48), { w: 16, dry: .35, seed: 99, bristles: 18 });
    x.font = '160px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(30,20,12,.55)'; x.fillText('怒', cx, cy + 8);
    // banners
    for (const [bx, ch] of [[1200, '她'], [1800, '守']]) {
      brush(x, [[bx, 560], [bx, 250]], { w: 7, dry: .2, seed: bx, bristles: 5 });
      x.fillStyle = 'rgba(184,38,29,.8)'; x.beginPath(); x.moveTo(bx, 260); x.lineTo(bx + 110, 290); x.lineTo(bx, 370); x.fill();
      x.fillStyle = '#f4efe6'; x.font = '40px Brush'; x.fillText(ch, bx + 35, 310);
    }
    // spears in flight
    const r = rng(5);
    for (let i = 0; i < 18; i++) spear(x, 100 + r() * 850, 140 + r() * 550, .2 + r() * .2, EX[i % EX.length], .85 + r() * .3);
    // stuck spears
    for (let i = 0; i < 5; i++) spear(x, cx - 180 + i * 15, cy - 100 + i * 55, .28 - i * .04, EX[i], .9);
    // readable horse
    horse(x, 220, 820, 1.55);
    sealCh(x, '责', 1830, 110, .55);
  });
}

export async function W09_shieldCut() {
  return L(x => {
    paperBase(x, W, H, 91);
    const cx = 960, cy = 500;
    // rings outer→inner: each major layer embeds excuse slips (cause→thickness)
    for (let k = 20; k >= 1; k--) {
      const R = 40 + k * 28;
      brush(x, circ(cx, cy, R, R * .92, 0, 6.28, 48), { w: 5, dry: .4, seed: 100 + k, bristles: 8, ink: .45 + (k % 3) * .1, color: k % 4 === 0 ? '120,50,30' : '60,45,30' });
      if (k % 2 === 0 && k >= 4) {
        const n = 4 + (k % 3), txt = EX[k % EX.length];
        for (let a = 0; a < n; a++) {
          const ang = a / n * 6.28 + k * .11;
          slip(x, cx + Math.cos(ang) * (R - 18), cy + Math.sin(ang) * (R - 18) * .92, ang + 1.57, txt, .55 + k * .01);
        }
      }
      if (k % 3 === 0) {
        for (let a = 0; a < 8; a++) {
          const ang = a * .785; x.fillStyle = 'rgba(80,70,60,.5)';
          x.fillRect(cx + Math.cos(ang) * R - 8, cy + Math.sin(ang) * R - 4, 16, 8);
        }
      }
    }
    for (let i = 0; i < 24; i++) {
      const ang = i / 24 * 6.28, R = 200 + (i % 3) * 80;
      x.fillStyle = 'rgba(30,24,18,.7)'; x.beginPath(); x.arc(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, 5, 0, 7); x.fill();
    }
    brush(x, [[200, 300], [600, 450], [1200, 400], [1700, 550]], { w: 6, dry: .25, seed: 1, bristles: 8, color: '20,18,16' });
    // thickness callout: outer wall skin
    brush(x, circ(cx, cy, 600, 552, 0, 6.28, 64), { w: 14, dry: .2, seed: 9, bristles: 12, color: '100,40,28', ink: .55 });
    sealCh(x, '层', 1780, 110, .55);
  });
}

export async function W10_greatWall() {
  return L(x => {
    paperBase(x, W, H, 101);
    wash(x, pth([[0, 280], [500, 200], [1000, 260], [1500, 180], [1920, 240], [1920, 480], [0, 500]]), { tone: .12, blur: 16, edge: .05 });
    // wall of slip-bricks rising
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 14; col++) {
        const bx = 80 + col * 130 + (row % 2) * 65, by = 980 - row * 70;
        x.fillStyle = '#f0e6d0'; x.fillRect(bx, by, 120, 60);
        brush(x, rectPts(bx, by, 120, 60, 4), { w: 2, dry: .4, seed: row * 20 + col, bristles: 5, color: '100,70,40' });
        x.font = '18px Brush'; x.fillStyle = 'rgba(18,16,14,.75)'; x.textAlign = 'center';
        x.fillText(EX[(row * 14 + col) % EX.length], bx + 60, by + 38);
      }
    }
    // rammed earth base
    sweepBrush(x, [[0, 1000], [960, 990], [1920, 1000]], { w: 40, ink: .5, dry: .4, seed: 1, bristles: 20, color: '80,55,35' });
    // two village smoke plumes
    wash(x, pth([[200, 480], [180, 350], [220, 250], [260, 350], [240, 480]]), { tone: .15, blur: 18, edge: 0 });
    wash(x, pth([[1700, 480], [1680, 340], [1720, 220], [1760, 340], [1740, 480]]), { tone: .15, blur: 18, edge: 0 });
    // ladder
    brush(x, [[600, 1000], [720, 400]], { w: 6, dry: .25, seed: 2, bristles: 6 });
    brush(x, [[640, 1000], [760, 400]], { w: 6, dry: .25, seed: 3, bristles: 6 });
    for (let i = 0; i < 8; i++) brush(x, [[605 + i * 15, 950 - i * 70], [645 + i * 15, 950 - i * 70]], { w: 4, dry: .2, seed: 10 + i, bristles: 4 });
    // guard
    figure(x, { emo: 'neutral', view: 'front', body: [[1100, 450], [1110, 380], [1140, 350], [1170, 380], [1180, 460]], head: [1140, 320, 22, 26], robe: .85, seed: 4, sweep: 18, cw: 5 });
    // boundary stone
    x.fillStyle = 'rgba(60,50,40,.8)'; x.fillRect(900, 860, 80, 100);
    x.font = '28px Brush'; x.fillStyle = '#f4efe6'; x.textAlign = 'center'; x.fillText('界', 940, 920);
    sealCh(x, '墙', 1780, 110, .55);
  });
}

export async function W11_courtroom() {
  return L(x => {
    paperBase(x, W, H, 111);
    wash(x, pth([[0, 0], [W, 0], [W, 500], [0, 520]]), { tone: .08, blur: 28, edge: 0, color: '60,48,36' });
    // pillars
    for (const px of [[220, 16], [1700, 16]]) sweepBrush(x, [[px[0], 0], [px[0] + 4, 500], [px[0], 900]], { w: 70, ink: .7, dry: .35, seed: px[0], bristles: 28, color: '70,24,18' });
    // plaque
    x.fillStyle = 'rgba(30,24,18,.9)'; x.fillRect(680, 50, 560, 110);
    brush(x, rectPts(680, 50, 560, 110, 8), { w: 6, dry: .3, seed: 7, bristles: 8, color: '150,110,40' });
    x.font = '80px Brush'; x.fillStyle = 'rgba(214,170,80,.95)'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('明镜高悬', 960, 110);
    // judge higher up so not buried
    figure(x, { emo: 'anger', view: 'front',
      body: [[820, 520], [840, 380], [900, 340], [1020, 340], [1080, 380], [1100, 520]],
      head: [960, 280, 52, 62], hair: [[[910, 265], [920, 215], [960, 200], [1000, 215], [1010, 265], [980, 240], [940, 240]]],
      feats: [{ pts: [[935, 280], [950, 282]], w: 6 }, { pts: [[970, 282], [985, 280]], w: 6 }], robe: .8, seed: 77, sweep: 48
    });
    // desk — thinner vermilion band (fix sketch issue)
    wash(x, pth([[480, 530], [1440, 530], [1460, 620], [460, 620]]), { tone: .55, blur: 3, edge: .25, color: '140,28,20' });
    sweepBrush(x, [[470, 535], [960, 528], [1450, 535]], { w: 16, ink: .85, dry: .3, seed: 41, bristles: 16 });
    // gavel
    x.fillStyle = 'rgba(30,22,14,.95)'; x.fillRect(560, 500, 110, 32);
    // 令签
    x.fillStyle = 'rgba(40,30,20,.9)'; x.fillRect(1280, 420, 70, 110);
    for (let i = 0; i < 5; i++) {
      x.save(); x.translate(1290 + i * 12, 420); x.rotate(-.15 + i * .08);
      x.fillStyle = '#e8dcc0'; x.fillRect(-5, -90, 10, 90); x.fillStyle = '#b8261d'; x.fillRect(-5, -90, 10, 18); x.restore();
    }
    // evidence tray — slips above desk, clear of caption zone
    x.fillStyle = 'rgba(200,180,140,.85)'; x.beginPath(); x.ellipse(960, 580, 200, 28, 0, 0, 7); x.fill();
    EX.slice(0, 6).forEach((t, i) => slip(x, 820 + i * 55, 500 + (i % 2) * 8, -.2 + i * .08, t, .75));
    x.font = '24px NSerif'; x.fillStyle = '#b8261d'; ['证一', '证二', '证三'].forEach((t, i) => x.fillText(t, 860 + i * 110, 615));
    // 衙役 staves
    for (const [sx, a] of [[140, .06], [1780, -.06]]) {
      x.save(); x.translate(sx, 1080); x.rotate(a); x.fillStyle = 'rgba(20,18,16,.9)'; x.fillRect(-8, -700, 16, 700);
      x.fillStyle = '#b8261d'; x.fillRect(-10, -700, 20, 160); x.restore();
    }
    // him kneeling — raised so caption (y~990) doesn't bury him; place mid-lower
    figure(x, { emo: 'guilty', view: 'front',
      body: [[880, 860], [900, 760], [940, 730], [1000, 735], [1030, 780], [1040, 880]],
      head: [960, 700, 36, 42], hair: [[[925, 688], [935, 655], [960, 645], [985, 658], [990, 690], [960, 675]]],
      feats: [{ pts: [[945, 700], [955, 702]], w: 4 }], robe: .88, seed: 88, sweep: 32, cw: 7
    });
    // caption channel kept clear below y=900
    sealCh(x, '辩', 1780, 110, .55);
  });
}

export async function W12_lianpoGate() {
  return L(x => {
    paperBase(x, W, H, 121);
    wash(x, pth([[0, 220], [500, 140], [1100, 200], [1920, 120], [1920, 420], [0, 440]]), { tone: .12, blur: 16, edge: .05 });
    // mansion gate
    x.fillStyle = 'rgba(50,30,20,.75)'; x.fillRect(560, 200, 800, 520);
    // plaque
    x.fillStyle = 'rgba(30,24,18,.95)'; x.fillRect(760, 230, 400, 90);
    brush(x, rectPts(760, 230, 400, 90, 6), { w: 5, dry: .3, seed: 1, bristles: 7, color: '160,120,50' });
    x.font = '56px Brush'; x.fillStyle = 'rgba(214,170,80,.95)'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('蔺府', 960, 280);
    // doors
    brush(x, [[960, 340], [960, 720]], { w: 8, dry: .2, seed: 2, bristles: 6 });
    for (const dx of [-180, 180]) { x.fillStyle = 'rgba(120,40,30,.5)'; x.beginPath(); x.arc(960 + dx, 520, 24, 0, 7); x.fill(); }
    // stone lions
    for (const lx of [420, 1500]) {
      wash(x, pth([[lx, 720], [lx + 40, 640], [lx + 120, 650], [lx + 140, 740], [lx + 80, 780], [lx, 760]]), { tone: .7, blur: 2, edge: .45 });
    }
    // Lian Po bare-backed with thorns on back — from left approaching
    figure(x, { emo: 'regret', view: 'profR', pose: 'bow',
      body: [[180, 1000], [220, 820], [300, 740], [400, 720], [420, 640], [500, 635], [520, 720], [600, 780], [640, 960], [660, 1050]],
      head: [460, 560, 70, 85], hair: [[[400, 540], [415, 470], [460, 450], [505, 475], [520, 540]]],
      feats: [{ pts: [[430, 555], [450, 558]], w: 7 }], robe: .35, seed: 12, sweep: 50 // lighter = bare
    });
    // thorn bundle on back
    for (let i = 0; i < 12; i++) brush(x, [[380 + i * 8, 700], [320 + i * 6, 820 + i * 5]], { w: 4, dry: .35, seed: 20 + i, bristles: 5, color: '50,70,30' });
    // Lin Xiangru carriage right far
    wash(x, pth([[1550, 780], [1700, 760], [1850, 780], [1820, 860], [1580, 860]]), { tone: .65, blur: 2, edge: .4 });
    brush(x, circ(1600, 870, 30, 30, 0, 6.3, 16), { w: 5, dry: .25, seed: 3, bristles: 7 });
    brush(x, circ(1800, 870, 30, 30, 0, 6.3, 16), { w: 5, dry: .25, seed: 4, bristles: 7 });
    sealCh(x, '史', 1780, 110, .55);
  });
}

export async function W13_xiangJiangHe() {
  return L(x => {
    paperBase(x, W, H, 131);
    wash(x, pth([[0, 180], [600, 100], [1300, 160], [1920, 90], [1920, 360], [0, 380]]), { tone: .1, blur: 16, edge: .05 });
    // threshold
    sweepBrush(x, [[400, 720], [960, 700], [1520, 720]], { w: 50, ink: .6, dry: .35, seed: 1, bristles: 24, color: '60,40,25' });
    // plum branch from thorn morph residue
    brush(x, [[200, 800], [400, 500], [700, 350], [1000, 300]], { w: 12, dry: .35, seed: 2, bristles: 14, color: '40,30,20' });
    for (let i = 0; i < 10; i++) {
      const t = i / 10, px = 250 + t * 700, py = 750 - t * 430;
      wash(x, ell(px + 20, py - 15, 14, 10), { tone: .5, blur: 2, edge: .2, color: '180,100,120' });
    }
    // two figures: Lian Po bowing, Lin helping — hands clasp
    figure(x, { emo: 'regret', view: 'profR',
      body: [[500, 1000], [560, 880], [640, 820], [720, 840], [740, 960], [720, 1080]],
      head: [640, 760, 55, 65, .4], hair: [[[590, 745], [600, 700], [645, 685], [690, 710], [680, 750]]],
      feats: [{ pts: [[650, 770], [670, 780]], w: 5 }],
      limbs: [{ pts: [[700, 860], [820, 840], [900, 820]], w: 22 }], robe: .7, seed: 1, sweep: 40
    });
    figure(x, { emo: 'reconcile', view: 'profL',
      body: [[1100, 1000], [1120, 860], [1200, 780], [1320, 760], [1340, 700], [1420, 695], [1440, 770], [1520, 840], [1560, 1000]],
      head: [1380, 620, 60, 72], hair: [[[1320, 600], [1335, 540], [1380, 520], [1425, 545], [1440, 605]]],
      feats: [{ pts: [[1350, 620], [1370, 622]], w: 6 }],
      limbs: [{ pts: [[1200, 800], [1050, 820], [920, 825]], w: 22 }], robe: .75, seed: 2, sweep: 45
    });
    // wine jar + rope knot
    wash(x, ell(960, 780, 40, 55), { tone: .7, blur: 2, edge: .4, color: '80,50,30' });
    brush(x, [[900, 700], [960, 680], [1020, 710], [980, 740], [920, 730]], { w: 5, dry: .3, seed: 5, bristles: 8, color: '184,38,29' }); // knot
    sealCh(x, '和', 1780, 110, .55);
  });
}

export async function W14_scale() {
  return L(x => {
    paperBase(x, W, H, 141);
    wash(x, ell(960, 400, 600, 300), { tone: .06, blur: 40, edge: 0 });
    // giant balance beam
    sweepBrush(x, [[200, 420], [960, 380], [1720, 420]], { w: 28, ink: .9, dry: .25, seed: 1, bristles: 20 });
    // fulcrum
    brush(x, [[960, 390], [960, 700]], { w: 16, dry: .25, seed: 2, bristles: 12 });
    wash(x, pth([[880, 700], [1040, 700], [1000, 900], [920, 900]]), { tone: .7, blur: 2, edge: .4 });
    // left pan: 形象 portrait
    brush(x, circ(400, 520, 140, 20, 0, 6.3, 30), { w: 6, dry: .3, seed: 3, bristles: 10 });
    x.fillStyle = '#e8dcc0'; x.fillRect(320, 280, 160, 220);
    brush(x, rectPts(320, 280, 160, 220, 6), { w: 4, dry: .3, seed: 4, bristles: 7 });
    // v3: portrait is a real (polished, composed) face, not a blob
    x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(400, 362, 42, 52, 0, 0, 7); x.fill();
    brush(x, circ(400, 362, 42, 52, -1.2, 4.6, 20), { w: 4, dry: .25, seed: 31, bristles: 7 });
    wash(x, pth([[356, 350], [362, 312], [400, 300], [440, 314], [446, 352], [420, 330], [380, 330]]), { tone: .9, blur: 2, edge: .5 });
    face(x, [400, 368, 42, 52], 'reconcile', 'front', 41);
    x.font = '48px Brush'; x.fillStyle = 'rgba(18,16,14,.9)'; x.textAlign = 'center'; x.fillText('形象', 400, 460);
    // weights
    for (let i = 0; i < 3; i++) { x.fillStyle = 'rgba(40,35,30,.8)'; x.beginPath(); x.arc(340 + i * 45, 520, 18, 0, 7); x.fill(); }
    // right pan: 关系 red rope
    brush(x, circ(1520, 560, 140, 20, 0, 6.3, 30), { w: 6, dry: .3, seed: 5, bristles: 10 });
    brush(x, [[1400, 480], [1480, 420], [1560, 490], [1620, 450], [1680, 520]], { w: 8, dry: .3, seed: 6, bristles: 10, color: '184,38,29' });
    x.font = '48px Brush'; x.fillStyle = '#b8261d'; x.textAlign = 'center'; x.fillText('关系', 1520, 620);
    // scale marks
    for (let i = -4; i <= 4; i++) brush(x, [[960 + i * 80, 375], [960 + i * 80, 395]], { w: 3, dry: .2, seed: 10 + i, bristles: 4 });
    // v3: hanging cords + pan bowls so it reads as a real steelyard balance
    for (const [bx, py] of [[400, 520], [1520, 560]]) {
      const by = bx < 960 ? 404 : 400;
      for (const ox of [-130, 0, 130]) brush(x, [[bx, by], [bx + ox, py - 4]], { w: 2.5, dry: .3, seed: bx + ox, bristles: 4, ink: .8 });
      wash(x, pth([[bx - 140, py], [bx + 140, py], [bx + 100, py + 34], [bx - 100, py + 34]]), { tone: .55, blur: 2, edge: .4 });
      x.fillStyle = 'rgba(30,26,22,.9)'; x.beginPath(); x.arc(bx, by, 9, 0, 7); x.fill(); }
    // rope coil heaped on the right pan (关系)
    for (let i = 0; i < 4; i++) brush(x, circ(1520, 548 - i * 6, 70 - i * 12, 12, 0, 6.3, 20), { w: 6, dry: .3, seed: 70 + i, bristles: 8, color: '184,38,29' });
    // left heavier (image wins) — tilt
    sealCh(x, '机', 1780, 110, .55);
  });
}

export async function W15_mirrorHall() {
  return L(x => {
    paperBase(x, W, H, 151);
    x.fillStyle = 'rgba(160,120,50,.85)'; x.fillRect(360, 80, 1200, 820);
    x.fillStyle = '#efe5cf'; x.fillRect(420, 140, 1080, 700);
    brush(x, rectPts(360, 80, 1200, 820, 12), { w: 10, dry: .3, seed: 1, bristles: 12, color: '120,90,30' });
    // him absorbed in the mirror (impression)
    figure(x, { emo: 'guilty', view: 'front',
      body: [[700, 780], [740, 560], [860, 480], [1060, 480], [1180, 560], [1220, 780]],
      head: [960, 360, 100, 120], hair: [[[850, 330], [870, 240], [960, 210], [1050, 240], [1070, 330], [1000, 290], [900, 290]]],
      robe: .75, seed: 15, sweep: 55
    });
    wash(x, ell(1180, 500, 50, 30), { tone: .4, blur: 3, edge: .2, color: '180,160,120' });
    // relationship cost: empty chair/space to his right INSIDE the frame + her silhouette exiting right edge
    x.save(); x.globalAlpha = .35;
    brush(x, [[1280, 720], [1320, 640], [1380, 720], [1360, 820], [1300, 820]], { w: 8, dry: .4, seed: 40, bristles: 10, color: '90,80,70' }); // empty seat ghost
    x.restore();
    x.save(); x.globalAlpha = .55;
    figure(x, { emo: 'hurt', view: 'profR',
      body: [[1480, 900], [1500, 760], [1540, 690], [1580, 670], [1590, 620], [1630, 620], [1640, 670], [1680, 700], [1720, 800], [1740, 920]],
      head: [1610, 560, 42, 50], hair: [[[1570, 550], [1578, 515], [1610, 500], [1642, 515], [1650, 550]]],
      robe: .45, seed: 1511, sweep: 22
    });
    x.restore();
    // dashed exit trail toward the right frame edge
    for (let i = 0; i < 5; i++) brush(x, [[1400 + i * 55, 700], [1425 + i * 55, 700]], { w: 3, dry: .5, seed: 50 + i, bristles: 4, color: '120,90,70', ink: .4 });
    // lingering tipped scale ghost (image side heavy)
    x.save(); x.globalAlpha = .4;
    brush(x, [[520, 620], [700, 600], [880, 640]], { w: 5, dry: .2, seed: 60, bristles: 8 }); // beam tip down-left (image)
    wash(x, ell(520, 660, 36, 28), { tone: .5, blur: 2, edge: .2 }); // heavy pan = portrait blob
    brush(x, circ(520, 640, 22, 26, 0, 6.2, 10), { w: 2, dry: .2, seed: 61, bristles: 4 });
    wash(x, ell(880, 610, 28, 16), { tone: .25, blur: 2, edge: .2, color: '184,38,29' }); // light pan = frayed rope
    x.restore();
    // indigo Schlenker card — upper left, clear of caption band
    brush(x, [[560, 140], [620, 200]], { w: 3, dry: .2, seed: 5, bristles: 4 }); brush(x, [[780, 140], [720, 200]], { w: 3, dry: .2, seed: 6, bristles: 4 });
    x.save(); x.translate(660, 250); x.rotate(-.05);
    x.fillStyle = 'rgb(48,72,138)'; x.fillRect(-200, -50, 400, 100);
    x.fillStyle = '#f4efe6'; x.font = '44px Brush'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('印象管理', 0, -8);
    x.font = '20px NSerif'; x.fillText('据 Schlenker · 简化模型', 0, 32);
    x.restore();
    brush(x, [[300, 900], [300, 600]], { w: 6, dry: .2, seed: 2, bristles: 5 });
    wash(x, ell(300, 560, 20, 30), { tone: .6, blur: 4, edge: .2, color: '184,38,29' });
    sealCh(x, '镜', 1780, 110, .55);
  });
}

// W16 v3.1 — 千镜廊 redesigned: he polishes his own reflection brighter; she, behind him (and in the mirror),
// fades with every wipe, then turns and walks away down the mirror corridor. He never turns around.
// Returns a world canvas with .dyn(u) (u = shot-local seconds 0..6) that repaints the animated state.
export const W16_GEOM = { VP: [1300, 460], MIRROR: [1230, 495] };
export async function W16_mirrorCorridor() {
  const MX0 = 860, MY0 = 150, MX1 = 1600, MY1 = 840, VP = W16_GEOM.VP;
  // room + gold mirror frame (static)
  const room = await L(x => {
    paperBase(x, W, H, 161);
    wash(x, pth([[0, 860], [1920, 840], [1920, 1080], [0, 1080]]), { tone: .12, blur: 10, edge: .1, color: '120,90,50' });
    x.fillStyle = 'rgba(160,120,50,.9)'; x.fillRect(MX0 - 44, MY0 - 44, MX1 - MX0 + 88, MY1 - MY0 + 88);
    brush(x, rectPts(MX0 - 44, MY0 - 44, MX1 - MX0 + 88, MY1 - MY0 + 88, 12), { w: 10, dry: .3, seed: 3, bristles: 12, color: '110,80,28' });
    brush(x, rectPts(MX0 - 6, MY0 - 6, MX1 - MX0 + 12, MY1 - MY0 + 12, 8), { w: 4, dry: .3, seed: 4, bristles: 6, color: '90,64,22' });
    for (const lx of [1740]) { // candle on the right (left side is where she stands)
      brush(x, [[lx, 260], [lx, 840]], { w: 8, dry: .3, seed: lx, bristles: 6 });
      wash(x, ell(lx, 222, 22, 32), { tone: .55, blur: 3, edge: .2, color: '184,38,29' });
      for (let k = 0; k < 4; k++) wash(x, ell(lx + (k - 1.5) * 8, 280 + k * 40, 8, 16), { tone: .35, blur: 2, edge: .1, color: '200,180,140' });
    }
    sealCh(x, '像', 1780, 110, .55);
  });
  // mirror interior: cool paper + receding frames (the corridor of mirrors) around VP
  const interior = await L(x => {
    x.fillStyle = '#e9e4d6'; x.fillRect(MX0, MY0, MX1 - MX0, MY1 - MY0);
    wash(x, pth([[MX0, MY0], [MX1, MY0], [MX1, MY1], [MX0, MY1]]), { tone: .08, blur: 30, edge: .02, color: '70,90,120' });
    for (let i = 0; i < 9; i++) { const s = Math.pow(.78, i + 1), hw = (MX1 - MX0) / 2 * s, hh = (MY1 - MY0) / 2 * s, cx = VP[0] + (1230 - VP[0]) * s, cy = VP[1] + (495 - VP[1]) * s;
      x.strokeStyle = `rgba(130,96,40,${.62 - i * .05})`; x.lineWidth = 7 * s + 1; x.strokeRect(cx - hw, cy - hh, hw * 2, hh * 2); }
    brush(x, [[MX0, MY1 - 4], [VP[0] - 30, VP[1] + 40]], { w: 3, dry: .5, seed: 9, bristles: 4, color: '130,96,40' });
    brush(x, [[MX1, MY1 - 4], [VP[0] + 30, VP[1] + 40]], { w: 3, dry: .5, seed: 10, bristles: 4, color: '130,96,40' });
  });
  const hairM = [[[1120, 362], [1135, 300], [1200, 280], [1265, 300], [1280, 362], [1240, 330], [1160, 330]]];
  // reflection, dull (guilty, slumped, crooked collar) and clean (upright, composed, straight collar)
  const reflDull = await L(x => {
    figure(x, { emo: 'guilty', view: '3qL', body: [[1010, 900], [1035, 725], [1100, 618], [1165, 590], [1170, 505], [1222, 505], [1232, 590], [1300, 612], [1365, 725], [1390, 900]],
      head: [1196, 402, 80, 95, .1], hair: hairM.map(h => h.map(([a, b]) => [a - 4, b + 22])), robe: .55, seed: 1601, sweep: 40 });
    brush(x, [[1150, 600], [1205, 680], [1235, 610]], { w: 6, dry: .4, seed: 7, bristles: 6 });
  });
  const reflClean = await L(x => {
    figure(x, { emo: 'neutral', view: '3qL', body: [[1010, 900], [1040, 700], [1110, 590], [1170, 562], [1175, 482], [1225, 482], [1230, 562], [1290, 590], [1360, 700], [1390, 900]],
      head: [1200, 378, 80, 95], hair: hairM, robe: .9, seed: 1602, sweep: 50 });
    brush(x, [[1145, 575], [1200, 660], [1255, 575]], { w: 9, dry: .15, seed: 8, bristles: 10, color: '239,229,207' }); // crisp straightened collar
    brush(x, [[1145, 575], [1200, 660], [1255, 575]], { w: 4, dry: .1, seed: 9, bristles: 5 });
    brush(x, [[1080, 760], [1320, 760]], { w: 10, dry: .2, seed: 11, bristles: 10, color: '184,38,29' }); // tidy sash
  });
  const halo = await L(x => { brush(x, circ(1200, 380, 132, 140, 0, 6.28, 40), { w: 9, dry: .15, seed: 12, bristles: 14 }); });
  // her in the mirror (small, behind him): facing out (hurt) and turned away (back)
  const herBody = [[1400, 720], [1415, 580], [1455, 525], [1480, 510], [1484, 475], [1505, 475], [1510, 510], [1535, 525], [1575, 580], [1590, 720]];
  const herHair = [[[1455, 430], [1462, 395], [1495, 382], [1528, 395], [1535, 430], [1515, 412], [1475, 412]]];
  const herRefl = await L(x => figure(x, { emo: 'hurt', view: '3qL', body: herBody, head: [1495, 440, 40, 48], hair: herHair, robe: .55, seed: 1611, sweep: 22 }));
  const herReflBack = await L(x => { figure(x, { emo: 'neutral', view: 'front', body: herBody, head: [1495, 440, 40, 48], hair: herHair, robe: .55, seed: 1612, sweep: 22 });
    wash(x, ell(1495, 438, 41, 49), { tone: .9, blur: 1, edge: .15 }); wash(x, ell(1495, 404, 14, 12), { tone: .95, blur: 1, edge: .1 }); });
  // haze on the glass + smudge streaks
  const haze = await L(x => { const r = rng(1616);
    x.fillStyle = 'rgba(214,206,190,.62)'; x.fillRect(MX0, MY0, MX1 - MX0, MY1 - MY0);
    for (let k = 0; k < 26; k++) { const sx = MX0 + r() * (MX1 - MX0), sy = MY0 + r() * (MY1 - MY0);
      wash(x, pth([[sx - 90, sy], [sx, sy - 18 - r() * 20], [sx + 120, sy - 6], [sx + 30, sy + 24]]), { tone: .12 + r() * .1, blur: 8, edge: .2, color: '150,140,120' }); } });
  // real him (profile, facing the mirror): guilty then absorbed
  const himBody = [[430, 1100], [470, 820], [560, 620], [650, 545], [670, 455], [770, 455], [800, 540], [880, 610], [950, 830], [980, 1100]];
  const himHair = [[[640, 335], [650, 268], [720, 245], [792, 262], [806, 318], [760, 300], [700, 300], [660, 340], [648, 392]]];
  const him = {}; for (const emo of ['guilty', 'neutral']) him[emo] = await L(x => figure(x, { emo, view: 'profR', body: himBody, head: [720, 352, 82, 98], hair: himHair, robe: .85, seed: 1621, sweep: 60 }));
  // real her (behind his left shoulder — stays inside z=1.35 crop): waiting (hurt) then turned away
  const herRB = [[300, 1100], [318, 820], [360, 620], [410, 530], [430, 490], [500, 490], [520, 530], [570, 620], [612, 820], [630, 1100]];
  const her = {
    wait: await L(x => figure(x, { emo: 'hurt', view: 'profR', body: herRB, head: [465, 410, 52, 62], hair: [[[415, 400], [422, 356], [465, 340], [508, 356], [516, 395], [490, 376], [432, 380]], [[418, 382], [392, 368], [398, 342], [424, 348]]], robe: .75, seed: 1631, sweep: 40 })),
    away: await L(x => figure(x, { emo: 'hurt', view: 'profL', body: herRB, head: [465, 410, 52, 62], hair: [[[415, 395], [422, 356], [465, 340], [508, 356], [516, 400], [498, 380], [440, 376]], [[512, 382], [538, 368], [532, 342], [506, 348]]], robe: .75, seed: 1632, sweep: 40 })),
  };
  const DYN = mkCanvas(W, H), CL = mkCanvas(W, H), DT = mkCanvas(W, H), CM = mkCanvas(W, H);
  // polishing path: three wipes (face → chest → whole figure), each ~2 loops
  const WIPES = [[0.5, 1.5, 1200, 385, 62, 52], [1.7, 2.7, 1200, 585, 105, 80], [2.9, 3.9, 1205, 500, 150, 250]];
  const clothAt = u => { for (const [a, b, cx, cy, rx, ry] of WIPES) if (u >= a && u <= b) { const q = (u - a) / (b - a), th = q * Math.PI * 4 - Math.PI / 2; return [cx + rx * Math.cos(th), cy + ry * Math.sin(th)]; }
    // between wipes the hand glides to the next wipe's start; before/after it rests on the glass
    const S = WIPES.map(([a, b, cx, cy, rx, ry]) => [a, b, [cx, cy - ry]]); if (u < S[0][0]) return [1080, 420];
    for (let k = 0; k < S.length - 1; k++) if (u > S[k][1] && u < S[k + 1][0]) { const q = ss((u - S[k][1]) / (S[k + 1][0] - S[k][1])); return [S[k][2][0] + (S[k + 1][2][0] - S[k][2][0]) * q, S[k][2][1] + (S[k + 1][2][1] - S[k][2][1]) * q]; }
    return S[2][2]; };
  const ss = k => (k = Math.max(0, Math.min(1, k)), k * k * k * (k * (k * 6 - 15) + 10));
  const sg = (u, a, b) => ss((u - a) / (b - a));
  const blitAt = (x, cv, a = 1, ax = 0, ay = 0, s = 1, dx = 0, dy = 0) => { if (a <= 0) return; x.save(); x.globalAlpha = a; x.translate(ax + dx, ay + dy); x.scale(s, s); x.translate(-ax, -ay); x.drawImage(cv, 0, 0); x.restore(); };
  DYN.dyn = u => {
    const wipeDone = WIPES.reduce((acc, [a, b]) => acc + sg(u, a, b), 0); // 0..3
    const herA = 1 - .24 * wipeDone;                                         // 1 → .28 as he polishes
    const leave = sg(u, 4.0, 5.0), turn = sg(u, 3.95, 4.15);
    // her reflection: stands behind his shoulder, then turns and walks into the corridor towards VP
    const drawHerRefl = x => { const sc = 1 - .82 * leave, fx = 1495 + (VP[0] - 1495) * leave, fy = 720 + (VP[1] + 60 - 720) * leave, a = herA * (1 - sg(u, 4.6, 5.2));
      blitAt(x, herRefl, a * (1 - turn), 1495, 720, sc, fx - 1495, fy - 720); blitAt(x, herReflBack, a * turn, 1495, 720, sc, fx - 1495, fy - 720); };
    // clean state of the glass
    let x = CL.getContext('2d'); x.clearRect(0, 0, W, H); x.drawImage(interior, 0, 0); drawHerRefl(x);
    const glow = .18 * wipeDone + .3 * sg(u, 3.7, 4.3);
    if (glow > 0) { const g = x.createRadialGradient(1200, 470, 40, 1200, 470, 330); g.addColorStop(0, `rgba(255,252,240,${Math.min(.95, glow)})`); g.addColorStop(1, 'rgba(255,252,240,0)'); x.fillStyle = g; x.fillRect(MX0, MY0, MX1 - MX0, MY1 - MY0); }
    const hk = sg(u, 3.7, 4.3); if (hk > 0) blitAt(x, halo, hk, 1200, 380, .8 + .2 * hk);
    x.drawImage(reflClean, 0, 0);
    // dirty state (dull reflection under haze), shown where not yet polished
    const d = DT.getContext('2d'); d.globalCompositeOperation = 'source-over'; d.clearRect(0, 0, W, H); d.drawImage(interior, 0, 0); drawHerRefl(d); d.drawImage(reflDull, 0, 0); d.drawImage(haze, 0, 0);
    const m = CM.getContext('2d'); m.clearRect(0, 0, W, H); m.save(); m.filter = 'blur(16px)'; m.strokeStyle = '#000'; m.lineCap = m.lineJoin = 'round'; m.lineWidth = 150;
    for (const [a, b] of WIPES) { if (u <= a) continue; m.beginPath(); const e = Math.min(u, b); for (let s = a; s <= e + 1e-6; s += 1 / 60) { const p = clothAt(s); s === a ? m.moveTo(p[0], p[1]) : m.lineTo(p[0], p[1]); } m.stroke(); }
    m.restore();
    d.globalCompositeOperation = 'destination-out'; d.drawImage(CM, 0, 0); d.globalCompositeOperation = 'source-over';
    // compose world
    x = DYN.getContext('2d'); x.clearRect(0, 0, W, H); x.drawImage(room, 0, 0);
    x.save(); x.beginPath(); x.rect(MX0, MY0, MX1 - MX0, MY1 - MY0); x.clip(); x.drawImage(CL, 0, 0); x.drawImage(DT, 0, 0);
    // a glint follows the cloth
    const c = clothAt(u); x.restore();
    // real her, behind him: fades with every wipe, then turns and leaves (left, out of frame)
    blitAt(x, her.wait, herA * (1 - turn)); blitAt(x, her.away, herA * turn * (1 - sg(u, 4.7, 5.4)), 465, 640, 1 - .55 * leave, -280 * leave, 40 * leave);
    // real him: never turns; guilty → absorbed
    const ab = sg(u, 0.9, 1.4); blitAt(x, him.guilty, 1 - ab); blitAt(x, him.neutral, ab);
    // polishing arm + hand + cloth (cheap per-frame strokes)
    const sh = [800, 560], el = [sh[0] + (c[0] - sh[0]) * .5, Math.max(sh[1], c[1]) + 70];
    x.lineCap = x.lineJoin = 'round';
    for (const [w, col] of [[44, 'rgba(26,24,22,.92)'], [30, 'rgba(48,44,40,.95)']]) { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(...sh); x.quadraticCurveTo(el[0], el[1], c[0] - 30, c[1] + 10); x.stroke(); }
    x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(c[0] - 18, c[1] + 6, 20, 15, -.4, 0, 7); x.fill(); x.strokeStyle = 'rgba(26,24,22,.85)'; x.lineWidth = 3; x.stroke();
    const g = x.createRadialGradient(c[0], c[1], 4, c[0], c[1], 46); g.addColorStop(0, 'rgba(236,226,200,1)'); g.addColorStop(.7, 'rgba(206,190,156,.95)'); g.addColorStop(1, 'rgba(180,160,120,0)');
    x.fillStyle = g; x.beginPath(); x.ellipse(c[0], c[1], 50, 38, .3, 0, 7); x.fill();
    return DYN;
  };
  DYN.dyn(0);
  return DYN;
}

export async function W17_shatter() {
  return L(x => {
    paperBase(x, W, H, 171);
    // shattered mirror shards
    const r = rng(19);
    for (let i = 0; i < 40; i++) {
      const sx = 200 + r() * 1500, sy = 100 + r() * 800;
      const pts = [];
      for (let k = 0; k < 5; k++) pts.push([sx + (r() - .5) * 120, sy + (r() - .5) * 120]);
      wash(x, pth(pts), { tone: .25 + r() * .3, blur: 1, edge: .35 });
      brush(x, [...pts, pts[0]], { w: 3, dry: .3, seed: i, bristles: 5, color: '80,70,50' });
    }
    sealCh(x, '碎', 1780, 110, .55);
  });
}

export async function W17b_cinnabar() {
  // black field with single cinnabar point — used mid-shot 17
  return L(x => {
    x.fillStyle = '#0a0908'; x.fillRect(0, 0, W, H);
    wash(x, ell(960, 540, 18, 18), { tone: .95, blur: 2, edge: .5, color: '184,38,29' });
    wash(x, ell(960, 540, 60, 60), { tone: .25, blur: 20, edge: 0, color: '184,38,29' });
  });
}

export async function W18_river() {
  return L(x => {
    paperBase(x, W, H, 181);
    wash(x, ell(1500, 180, 80, 80), { tone: .14, blur: 6, edge: .25 }); // moon (from cinnabar)
    wash(x, pth([[0, 400], [500, 320], [1000, 380], [1500, 300], [1920, 360], [1920, 500], [0, 520]]), { tone: .12, blur: 16, edge: .05 });
    // river indigo — leave bottom 200px clearer for caption (fix)
    wash(x, pth([[0, 540], [700, 500], [1300, 520], [1920, 480], [1920, 880], [0, 900]]), { tone: .15, blur: 18, edge: .04, color: '48,72,138' });
    for (let i = 0; i < 12; i++) brush(x, [[0, 580 + i * 28], [960, 560 + i * 30], [1920, 540 + i * 32]], { w: 3, dry: .7, seed: 600 + i, bristles: 5, ink: .22, color: '40,50,90' });
    // bridge
    wash(x, pth([[1000, 500], [1100, 400], [1260, 370], [1420, 400], [1520, 500], [1440, 500], [1380, 440], [1260, 420], [1140, 440], [1080, 500]]), { tone: .65, blur: 2, edge: .4 });
    sweepBrush(x, [[980, 410], [1260, 365], [1540, 410]], { w: 16, ink: .85, dry: .3, seed: 61, bristles: 12 });
    // reeds left
    const r = rng(9);
    for (let i = 0; i < 22; i++) {
      const rx = 20 + r() * 300, h = 200 + r() * 180;
      brush(x, [[rx, 900], [rx + 8, 900 - h * .55], [rx + 25, 900 - h]], { w: 4, dry: .3, seed: 700 + i, bristles: 5 });
    }
    // slips — keep y < 860 to leave caption channel
    for (let i = 0; i < 90; i++) {
      const tt = r(); const y = 540 + tt * tt * 300; // max ~840
      const s = .3 + tt * .9, xx = r() * 1920;
      slip(x, xx, y, Math.PI / 2 + (r() - .5) * .5, EX[i % EX.length], s * .65, true);
    }
    // boat + lamp
    wash(x, pth([[1580, 680], [1760, 680], [1720, 720], [1620, 720]]), { tone: .8, blur: 1, edge: .4 });
    wash(x, ell(1670, 650, 14, 18), { tone: .7, blur: 3, edge: .3, color: '184,38,29' });
    sealCh(x, '流', 1830, 110, .55);
  });
}

export async function W19_redRope() {
  return L(x => {
    paperBase(x, W, H, 191);
    wash(x, pth([[0, 0], [1920, 0], [1920, 1080], [0, 1080]]), { tone: .12, blur: 30, edge: 0, color: '48,72,138' });
    for (let i = 0; i < 16; i++) brush(x, [[0, 80 + i * 60], [1920, 60 + i * 60 + Math.sin(i) * 20]], { w: 2, dry: .7, seed: 10 + i, bristles: 4, ink: .2, color: '40,50,90' });
    // her hand stays (left): sleeve + open palm holding one rope end
    brush(x, [[80, 900], [160, 720], [260, 640], [320, 620]], { w: 36, dry: .2, seed: 5, bristles: 16, color: '30,26,22' }); // sleeve
    brush(x, [[260, 640], [320, 620]], { w: 22, dry: .15, seed: 6, color: '239,229,207', ink: .95, bristles: 12 });
    x.fillStyle = 'rgb(239,229,207)'; x.beginPath(); x.ellipse(360, 600, 42, 32, -.3, 0, 7); x.fill(); // palm
    brush(x, circ(360, 600, 42, 32, -.3, 6.2, 16), { w: 3, dry: .2, seed: 7, bristles: 5 });
    for (let k = 0; k < 4; k++) brush(x, [[380, 585 + k * 10], [455, 560 + k * 14]], { w: 4, dry: .15, seed: 8 + k, bristles: 4 }); // fingers toward rope
    // red rope: LEFT end gripped in her hand; break in center; RIGHT end drifts with slips
    brush(x, [[400, 590], [560, 560], [780, 540]], { w: 11, dry: .2, seed: 1, bristles: 12, color: '184,38,29' });
    brush(x, [[820, 530], [900, 500], [960, 545], [900, 580], [830, 560]], { w: 8, dry: .3, seed: 3, bristles: 10, color: '160,30,25' }); // frayed knot near hand side
    brush(x, [[1100, 520], [1400, 500], [1750, 560]], { w: 9, dry: .35, seed: 2, bristles: 12, color: '184,38,29', ink: .7 }); // drifting free end
    // excuse slips floating AWAY to the right (leave the waiting hand)
    EX.slice(0, 6).forEach((t, i) => hSlip(x, 1180 + i * 110, 420 + (i % 3) * 70, -.08 + i * .04, t, .85 + (i % 2) * .1));
    EX.slice(0, 3).forEach((t, i) => slip(x, 1500 + i * 90, 700 + i * 40, .3 + i * .1, t, .7));
    const r = rng(21);
    for (let i = 0; i < 22; i++) wash(x, ell(r() * 1920, r() * 1080, 12 + r() * 20, 8 + r() * 10), { tone: .35, blur: 2, edge: .15, color: '50,80,40' });
    wash(x, pth([[1200, 780], [1280, 760], [1360, 780], [1300, 810], [1220, 805]]), { tone: .45, blur: 2, edge: .3 });
    sealCh(x, '待', 1780, 110, .55);
  });
}

export async function W20_rainStreet() {
  return L(x => {
    paperBase(x, W, H, 201);
    wash(x, pth([[0, 150], [600, 80], [1300, 140], [1920, 70], [1920, 400], [0, 420]]), { tone: .15, blur: 18, edge: .05, color: '40,40,50' });
    // stone street perspective
    for (let i = 0; i < 14; i++) {
      const y = 500 + i * 40;
      brush(x, [[200 - i * 10, y], [1720 + i * 10, y]], { w: 2, dry: .6, seed: 10 + i, bristles: 4, ink: .3 });
    }
    // eaves lamps
    for (const lx of [300, 700, 1200, 1600]) {
      wash(x, ell(lx, 280, 24, 32), { tone: .5, blur: 4, edge: .25, color: '184,38,29' });
      brush(x, [[lx, 200], [lx, 250]], { w: 3, dry: .2, seed: lx, bristles: 4 });
      // reflection in puddle
      wash(x, ell(lx, 850, 18, 10), { tone: .3, blur: 6, edge: .1, color: '184,38,29' });
    }
    // him with oil-paper umbrella walking away
    figure(x, { emo: 'regret', view: '3qR',
      body: [[880, 900], [900, 780], [940, 740], [1000, 745], [1030, 800], [1040, 920]],
      head: [965, 700, 40, 48], hair: [[[930, 688], [940, 650], [965, 640], [990, 655], [995, 690]]],
      feats: [{ pts: [[950, 700], [960, 702]], w: 4 }], robe: .85, seed: 20, sweep: 35, cw: 7
    });
    // umbrella
    wash(x, ell(965, 620, 90, 35), { tone: .55, blur: 2, edge: .35 });
    brush(x, [[965, 620], [965, 700]], { w: 4, dry: .2, seed: 1, bristles: 5 });
    // wet slips on street
    EX.slice(0, 5).forEach((t, i) => hSlip(x, 400 + i * 220, 780 + (i % 2) * 30, -.1 + i * .05, t, .9));
    // night watchman far
    figure(x, { emo: 'neutral', view: 'profL', body: [[1600, 700], [1610, 640], [1635, 610], [1660, 640], [1670, 720]], head: [1635, 580, 20, 24], robe: .8, seed: 21, sweep: 16, cw: 5 });
    brush(x, [[1645, 600], [1680, 520]], { w: 5, dry: .25, seed: 2, bristles: 5 }); // clapper pole
    // rain streaks
    const r = rng(23);
    for (let i = 0; i < 60; i++) brush(x, [[r() * 1920, r() * 900], [r() * 1920 - 10, r() * 900 + 40]], { w: 1.5, dry: .5, seed: 50 + i, bristles: 3, ink: .25 });
    sealCh(x, '远', 1780, 110, .55);
  });
}

export async function W21_emptyTable() {
  return L(x => {
    paperBase(x, W, H, 211);
    wash(x, pth([[0, 200], [400, 120], [900, 180], [1400, 90], [1920, 150], [1920, 400], [0, 420]]), { tone: .1, blur: 18, edge: .05 });
    // lantern = same as open
    for (const [lx, ly] of [[300, 140], [1620, 130]]) {
      brush(x, [[lx, 20], [lx, ly]], { w: 3, dry: .2, seed: lx, bristles: 4 });
      wash(x, ell(lx, ly + 50, 28, 40), { tone: .4, blur: 3, edge: .25, color: '184,38,29' });
    }
    sweepBrush(x, [[220, 760], [960, 735], [1700, 760]], { w: 130, ink: .5, dry: .35, color: '55,38,22', seed: 90, bristles: 40 });
    // ash flecks
    const r = rng(55);
    for (let i = 0; i < 50; i++) {
      const ax = 500 + r() * 900, ay = 700 + r() * 60;
      x.fillStyle = `rgba(30,24,18,${.15 + r() * .35})`; x.beginPath(); x.ellipse(ax, ay, 2 + r() * 4, 1 + r() * 2, r(), 0, 7); x.fill();
    }
    // cold tea + overturned cup
    x.fillStyle = '#e8dcc0'; x.beginPath(); x.ellipse(720, 720, 42, 18, 0, 0, 7); x.fill();
    wash(x, ell(720, 718, 28, 8), { tone: .2, blur: 2, edge: .1, color: '60,40,20' });
    // overturned
    x.save(); x.translate(1200, 730); x.rotate(1.1);
    x.fillStyle = '#e8dcc0'; x.beginPath(); x.ellipse(0, 0, 42, 18, 0, 0, 7); x.fill(); x.restore();
    // couple faded / distant — very light
    x.globalAlpha = .35;
    figure(x, { emo: 'regret', view: '3qR',
      body: [[280, 1100], [320, 820], [420, 700], [540, 680], [560, 600], [640, 595], [660, 680], [780, 720], [820, 920], [840, 1100]],
      head: [600, 520, 95, 115], hair: [[[500, 490], [520, 400], [600, 370], [680, 400], [700, 490]]],
      feats: [{ pts: [[550, 510], [580, 515]], w: 8 }], robe: .5, seed: 200, sweep: 55
    });
    figure(x, { emo: 'hurt', view: 'profR', pose: 'fold',
      body: [[1100, 1100], [1140, 860], [1260, 720], [1400, 690], [1420, 610], [1500, 605], [1520, 690], [1660, 740], [1720, 940], [1740, 1100]],
      head: [1460, 530, 90, 110], hair: [[[1360, 500], [1380, 410], [1460, 380], [1540, 410], [1560, 500]]],
      feats: [{ pts: [[1410, 510], [1440, 512]], w: 8 }], robe: .5, seed: 220, sweep: 55
    });
    x.globalAlpha = 1;
    sealCh(x, '留', 1780, 110, .55);
  });
}

export async function W22_handscroll() {
  return L(x => {
    paperBase(x, W, H, 221);
    // desk surface
    sweepBrush(x, [[0, 900], [960, 880], [1920, 900]], { w: 80, ink: .4, dry: .4, seed: 1, bristles: 30, color: '70,50,30' });
    // unrolled handscroll across mid — miniature of dinner scene stamped on it
    x.fillStyle = '#f4ead4'; x.fillRect(200, 280, 1400, 420);
    brush(x, rectPts(200, 280, 1400, 420, 10), { w: 5, dry: .3, seed: 2, bristles: 8, color: '80,60,40' });
    // scroll rods
    x.fillStyle = 'rgba(60,40,20,.9)'; x.fillRect(160, 260, 50, 460); x.fillRect(1590, 260, 50, 460);
    // mini ink painting on scroll: tiny table + two dots
    wash(x, pth([[300, 360], [500, 320], [800, 350], [1100, 310], [1400, 340], [1400, 420], [300, 440]]), { tone: .1, blur: 8, edge: .05 });
    sweepBrush(x, [[400, 520], [900, 510], [1400, 520]], { w: 20, ink: .5, dry: .35, seed: 3, bristles: 14, color: '55,38,22' });
    x.fillStyle = 'rgba(30,28,26,.7)'; x.beginPath(); x.arc(700, 480, 18, 0, 7); x.fill(); x.beginPath(); x.arc(1100, 480, 18, 0, 7); x.fill();
    x.font = '36px Brush'; x.fillStyle = 'rgba(18,16,14,.7)'; x.textAlign = 'center'; x.fillText('道歉越解释越糟', 960, 600);
    // paperweight
    wash(x, ell(960, 720, 60, 25), { tone: .7, blur: 2, edge: .4, color: '80,30,30' });
    // artist's hand rolling from right
    figure(x, { emo: 'reconcile', view: '3qL',
      body: [[1500, 1100], [1520, 900], [1600, 800], [1750, 780], [1780, 900], [1800, 1100]],
      head: [1680, 720, 50, 58],
      limbs: [{ pts: [[1600, 850], [1450, 700], [1350, 650], [1280, 620]], w: 28 }],
      feats: [{ pts: [[1660, 720], [1675, 722]], w: 5 }], robe: .7, seed: 22, sweep: 40
    });
    sealCh(x, '问', 1780, 110, .55);
  });
}

export const WORLDS = [
  W01_dinner, W02_teacup, W03_childhood, W04_slipMicro, W05_bambooMail, W06_crowd,
  W07_dinnerRevisit, W08_battlefield, W09_shieldCut, W10_greatWall, W11_courtroom,
  W12_lianpoGate, W13_xiangJiangHe, W14_scale, W15_mirrorHall, W16_mirrorCorridor,
  W17_shatter, W18_river, W19_redRope, W20_rainStreet, W21_emptyTable, W22_handscroll
];

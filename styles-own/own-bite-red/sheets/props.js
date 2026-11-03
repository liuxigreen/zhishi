/** props.js — Bite Red Queen race / adaptation props (≥14).
 * Grammar: black stage → ONE red light event. Trap/effort = red bloom; exit/direction = white/HUD.
 */
import { P, glowStroke as GS, glowFill as GF, rng, roundRect } from './look.js';

/** 1. treadmillFloor — perspective checkerboard (hook bed). */
export function treadmillFloor(ctx, o = {}) {
  const y0 = o.y ?? 780, k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  const rows = o.rows ?? 10, cols = o.cols ?? 14;
  const vanishingY = o.vanishY ?? 520;
  for (let r = 0; r < rows; r++) {
    const t0 = r / rows, t1 = (r + 1) / rows;
    const yA = vanishingY + (y0 - vanishingY) * (t0 * t0);
    const yB = vanishingY + (y0 - vanishingY) * (t1 * t1);
    const wA = 200 + 1500 * t0 * t0;
    const wB = 200 + 1500 * t1 * t1;
    for (let c = 0; c < cols; c++) {
      const u0 = c / cols - 0.5, u1 = (c + 1) / cols - 0.5;
      const dark = (r + c) % 2 === 0;
      ctx.fillStyle = dark ? 'rgba(60,18,18,0.55)' : 'rgba(20,8,8,0.45)';
      ctx.beginPath();
      ctx.moveTo(960 + u0 * wA, yA);
      ctx.lineTo(960 + u1 * wA, yA);
      ctx.lineTo(960 + u1 * wB, yB);
      ctx.lineTo(960 + u0 * wB, yB);
      ctx.closePath(); ctx.fill();
    }
  }
  // horizon hairline
  ctx.strokeStyle = 'rgba(226,59,59,0.25)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(200, vanishingY); ctx.lineTo(1720, vanishingY); ctx.stroke();
  ctx.restore();
}

/** 2. hudTelemetry — SPEED / DISPLACEMENT / HR stack (top-right). */
export function hudTelemetry(ctx, o = {}) {
  const x = o.x ?? 1520, y = o.y ?? 70, k = o.k ?? 1;
  if (k <= 0) return;
  const speed = o.speed ?? 36.5;
  const disp = o.disp ?? 0;
  const hr = o.hr ?? 191;
  const trap = o.trapDisp !== false && Math.abs(disp) < 0.05;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.4);
  ctx.font = '600 18px "Inter Tight", sans-serif';
  ctx.textAlign = 'left';
  const rows = [
    { lab: '速度  SPEED', val: speed.toFixed(1) + ' km/h', hot: false },
    { lab: '位移  DISPLACEMENT', val: disp.toFixed(2) + ' m', hot: trap },
    { lab: '心率  HR', val: String(hr) + ' bpm', hot: false },
  ];
  rows.forEach((r, i) => {
    const yy = y + i * 52;
    ctx.fillStyle = P.mute; ctx.font = '600 14px "Inter Tight", sans-serif';
    ctx.fillText(r.lab, x, yy);
    ctx.font = `700 28px "Inter Tight", sans-serif`;
    if (r.hot) {
      ctx.shadowColor = P.redBloom; ctx.shadowBlur = 12;
      ctx.fillStyle = P.red;
    } else {
      ctx.shadowBlur = 0; ctx.fillStyle = P.white;
    }
    ctx.fillText(r.val, x, yy + 28);
    ctx.shadowBlur = 0;
  });
  ctx.restore();
}

/** 3. ovalTrack — concentric red ellipse race ring. */
export function ovalTrack(ctx, o = {}) {
  const cx = o.x ?? 960, cy = o.y ?? 560, k = o.k ?? 1;
  if (k <= 0) return;
  const rx = (o.rx ?? 520) * Math.min(1, k * 1.2);
  const ry = (o.ry ?? 220) * Math.min(1, k * 1.2);
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const s = 1 - i * 0.08;
    GS(ctx, () => {
      ctx.beginPath(); ctx.ellipse(cx, cy, rx * s, ry * s, 0, 0, Math.PI * 2);
    }, { color: P.red, width: 1.6 - i * 0.3, bloom: 4 - i, alpha: 0.85 - i * 0.15 });
  }
  // dashed midline (direction hint)
  if (o.midline) {
    ctx.setLineDash([8, 10]);
    ctx.strokeStyle = 'rgba(245,245,245,0.35)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx - rx * 0.15, cy - ry - 40); ctx.lineTo(cx + rx * 0.9, cy - ry * 0.2);
    ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.restore();
}

/** 4. racePair — two glowing dots on oval (predator/prey). */
export function racePair(ctx, o = {}) {
  const cx = o.x ?? 960, cy = o.y ?? 560;
  const rx = o.rx ?? 520, ry = o.ry ?? 220;
  const a1 = o.a1 ?? -0.6, a2 = o.a2 ?? -0.35; // radians along ellipse
  const k = o.k ?? 1;
  if (k <= 0) return;
  const pts = [
    { a: a1, col: P.red, lab: o.lab1 || '猎豹', trail: true },
    { a: a2, col: P.white, lab: o.lab2 || '羚羊', trail: false },
  ];
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  pts.forEach((p) => {
    const x = cx + Math.cos(p.a) * rx;
    const y = cy + Math.sin(p.a) * ry;
    // trail
    if (p.trail) {
      GS(ctx, () => {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const aa = p.a - i * 0.06;
          const px = cx + Math.cos(aa) * rx;
          const py = cy + Math.sin(aa) * ry;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
      }, { color: p.col, width: 2, bloom: 3, alpha: 0.7 });
    } else {
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = 'rgba(245,245,245,0.5)'; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const aa = p.a - i * 0.05;
        const px = cx + Math.cos(aa) * rx, py = cy + Math.sin(aa) * ry;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke(); ctx.setLineDash([]);
    }
    GF(ctx, () => { ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); }, { color: p.col, alpha: 0.95 });
    ctx.fillStyle = p.col; ctx.font = '600 16px "Noto Serif SC", serif';
    ctx.textAlign = 'center'; ctx.fillText(p.lab, x, y - 16);
  });
  ctx.restore();
}

/** 5. relativeGapLock — OUR MOVE: bar that stays at 0 while multipliers climb. */
export function relativeGapLock(ctx, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 640, k = o.k ?? 1, breathe = o.breathe ?? 1;
  if (k <= 0) return;
  const w = 280 * k, h = 18;
  ctx.save();
  ctx.globalAlpha = Math.min(1, k * 1.4);
  // label
  ctx.fillStyle = P.white; ctx.font = '600 20px "Noto Serif SC", serif';
  ctx.textAlign = 'center';
  ctx.fillText('两者差距', x, y - 28);
  // locked bar (empty / zero)
  ctx.strokeStyle = P.red; ctx.lineWidth = 2 * breathe;
  roundRect(ctx, x - w / 2, y, w, h, 4); ctx.stroke();
  // zero fill tick in centre
  ctx.fillStyle = P.red;
  ctx.fillRect(x - 2, y + 2, 4, h - 4);
  // glowing 「不变」
  ctx.shadowColor = P.redBloom; ctx.shadowBlur = 14 * breathe;
  ctx.fillStyle = P.red; ctx.font = '700 36px "Noto Serif SC", serif';
  ctx.fillText(o.label || '不变', x, y + 56);
  ctx.shadowBlur = 0;
  // tiny lock glyph
  ctx.strokeStyle = P.red; ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(x + w / 2 + 22, y + 4, 6, Math.PI, 0);
  ctx.stroke();
  roundRect(ctx, x + w / 2 + 14, y + 4, 16, 12, 2); ctx.stroke();
  ctx.restore();
}

/** 6. speciesNet — constellation of species labels. */
export function speciesNet(ctx, o = {}) {
  const cx = o.x ?? 960, cy = o.y ?? 540, k = o.k ?? 1;
  if (k <= 0) return;
  const nodes = o.nodes || [
    { dx: -280, dy: -80, lab: '兔' }, { dx: -120, dy: -160, lab: '毛虫' },
    { dx: 40, dy: -140, lab: '寄生蜂' }, { dx: 220, dy: -60, lab: '猎豹' },
    { dx: 300, dy: 80, lab: '羚羊' }, { dx: 80, dy: 140, lab: '树' },
    { dx: -160, dy: 120, lab: '病毒' }, { dx: -40, dy: 40, lab: '细菌' },
  ];
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  // links
  ctx.strokeStyle = 'rgba(226,59,59,0.28)'; ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if ((i + j) % 3 !== 0) continue;
      ctx.beginPath();
      ctx.moveTo(cx + nodes[i].dx, cy + nodes[i].dy);
      ctx.lineTo(cx + nodes[j].dx, cy + nodes[j].dy);
      ctx.stroke();
    }
  }
  nodes.forEach((n) => {
    const x = cx + n.dx, y = cy + n.dy;
    GF(ctx, () => { ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); }, { color: P.red, alpha: 0.85 });
    ctx.fillStyle = P.white; ctx.font = '600 18px "Noto Serif SC", serif';
    ctx.textAlign = 'center'; ctx.fillText(n.lab, x, y - 14);
  });
  ctx.restore();
}

/** 7. credentialStairs — block stairs rising right. */
export function credentialStairs(ctx, o = {}) {
  const x0 = o.x ?? 700, y0 = o.y ?? 820, k = o.k ?? 1;
  if (k <= 0) return;
  const n = o.n ?? 8, stepW = o.stepW ?? 90, stepH = o.stepH ?? 36;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  for (let i = 0; i < n; i++) {
    const x = x0 + i * stepW;
    const y = y0 - (i + 1) * stepH;
    const w = (n - i) * stepW + 40;
    ctx.fillStyle = i % 2 ? '#1E1414' : '#161010';
    ctx.strokeStyle = 'rgba(226,59,59,0.25)'; ctx.lineWidth = 1;
    ctx.fillRect(x, y, w, stepH);
    ctx.strokeRect(x, y, w, stepH);
  }
  // tags
  const tags = o.tags || ['学历', '证书', '实习', '加班', '绩点', '考研', '技能', '人脉'];
  tags.slice(0, n).forEach((t, i) => {
    const x = x0 + i * stepW + 30;
    const y = y0 - (i + 1) * stepH - 18;
    ctx.fillStyle = 'rgba(80,20,20,0.85)';
    roundRect(ctx, x - 28, y - 14, t.length * 16 + 20, 24, 10); ctx.fill();
    ctx.strokeStyle = P.red; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = P.white; ctx.font = '600 14px "Noto Serif SC", serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(t, x + 4, y - 2);
  });
  ctx.restore();
}

/** 8. stageSpot — flat stage + triangular spotlight. */
export function stageSpot(ctx, o = {}) {
  const x = o.x ?? 360, y = o.y ?? 780, k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  // stage slab
  ctx.fillStyle = '#2A1A1A';
  ctx.fillRect(x - 110, y - 14, 220, 18);
  ctx.strokeStyle = 'rgba(245,245,245,0.25)'; ctx.lineWidth = 1;
  ctx.strokeRect(x - 110, y - 14, 220, 18);
  // spotlight cone
  const g = ctx.createLinearGradient(x, y - 320, x, y);
  g.addColorStop(0, 'rgba(245,245,245,0.18)');
  g.addColorStop(1, 'rgba(245,245,245,0.02)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - 20, y - 320); ctx.lineTo(x + 20, y - 320);
  ctx.lineTo(x + 130, y); ctx.lineTo(x - 130, y); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** 9. fossilBranch — branching extinct tree. */
export function fossilBranch(ctx, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 780, k = o.k ?? 1;
  if (k <= 0) return;
  const r = rng(o.seed || 5);
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  ctx.strokeStyle = P.mute; ctx.lineWidth = 1.4;
  function branch(x0, y0, ang, len, depth) {
    if (depth <= 0 || len < 8) return;
    const x1 = x0 + Math.cos(ang) * len;
    const y1 = y0 + Math.sin(ang) * len;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    if (depth <= 2) {
      ctx.fillStyle = P.redDim;
      ctx.globalAlpha = 0.5 * k;
      ctx.beginPath(); ctx.arc(x1, y1, 2.5, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = Math.min(1, k * 1.3);
    }
    branch(x1, y1, ang - 0.45 - r() * 0.2, len * 0.72, depth - 1);
    branch(x1, y1, ang + 0.4 + r() * 0.2, len * 0.68, depth - 1);
  }
  branch(x, y, -Math.PI / 2, 90, 5);
  if (o.label) {
    ctx.fillStyle = P.cite; ctx.font = '500 16px "Noto Serif SC", serif';
    ctx.textAlign = 'center'; ctx.fillText(o.label, x, y + 28);
  }
  ctx.restore();
}

/** 10. gauseTube — 1934 competition tube. */
export function gauseTube(ctx, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 560, s = o.s ?? 1, k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.3);
  GS(ctx, () => {
    ctx.beginPath();
    ctx.moveTo(x - 28 * s, y - 120 * s);
    ctx.lineTo(x - 28 * s, y + 80 * s);
    ctx.quadraticCurveTo(x, y + 100 * s, x + 28 * s, y + 80 * s);
    ctx.lineTo(x + 28 * s, y - 120 * s);
  }, { color: P.white, width: 1.6, bloom: 2, alpha: 0.7 });
  // two populations
  GF(ctx, () => {
    ctx.beginPath(); ctx.ellipse(x - 8 * s, y + 20 * s, 10 * s, 40 * s, 0, 0, Math.PI * 2);
  }, { color: P.red, alpha: 0.55 });
  GF(ctx, () => {
    ctx.beginPath(); ctx.ellipse(x + 10 * s, y + 40 * s, 8 * s, 28 * s, 0, 0, Math.PI * 2);
  }, { color: P.hud, alpha: 0.4 });
  ctx.fillStyle = P.cite; ctx.font = '500 14px "Inter Tight", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(o.label || 'Gause 1934', x, y + 120 * s);
  ctx.restore();
}

/** 11. titleGlyph — giant 「原地」 calligraphy. */
export function titleGlyph(ctx, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 380, k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, k);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '700 160px "Noto Serif SC", serif';
  ctx.shadowColor = P.redBloom; ctx.shadowBlur = 24;
  ctx.fillStyle = P.white;
  ctx.fillText(o.text || '原 地', x, y);
  ctx.shadowBlur = 0;
  ctx.restore();
}

/** 12. directionFork — OUR MOVE: vector leaving the red track. */
export function directionFork(ctx, o = {}) {
  const x0 = o.x0 ?? 1100, y0 = o.y0 ?? 560;
  const x1 = o.x1 ?? 1680, y1 = o.y1 ?? 280;
  const k = o.k ?? 1;
  if (k <= 0) return;
  const x = x0 + (x1 - x0) * k;
  const y = y0 + (y1 - y0) * k;
  ctx.save();
  // white/HUD arrow path
  GS(ctx, () => {
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y);
  }, { color: P.hud, width: 3, bloom: 5, alpha: 0.95 });
  // arrowhead
  if (k > 0.15) {
    const ang = Math.atan2(y1 - y0, x1 - x0);
    ctx.fillStyle = P.hud;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 18 * Math.cos(ang - 0.4), y - 18 * Math.sin(ang - 0.4));
    ctx.lineTo(x - 18 * Math.cos(ang + 0.4), y - 18 * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
  }
  if (o.label && k > 0.5) {
    ctx.fillStyle = P.hud; ctx.font = '700 22px "Noto Serif SC", serif';
    ctx.textAlign = 'left'; ctx.fillText(o.label, x + 12, y - 10);
  }
  ctx.restore();
}

/** 13. dustRoom — 0762 entropy room with light shaft + dust. */
export function dustRoom(ctx, o = {}) {
  const k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, k);
  // far window grid
  const wx = o.wx ?? 960, wy = o.wy ?? 200, ww = 180, wh = 220;
  ctx.fillStyle = 'rgba(224,184,90,0.15)';
  ctx.fillRect(wx - ww / 2, wy, ww, wh);
  ctx.strokeStyle = 'rgba(224,184,90,0.45)'; ctx.lineWidth = 1.2;
  for (let i = 0; i <= 3; i++) {
    ctx.beginPath(); ctx.moveTo(wx - ww / 2 + i * ww / 3, wy); ctx.lineTo(wx - ww / 2 + i * ww / 3, wy + wh); ctx.stroke();
  }
  for (let j = 0; j <= 3; j++) {
    ctx.beginPath(); ctx.moveTo(wx - ww / 2, wy + j * wh / 3); ctx.lineTo(wx + ww / 2, wy + j * wh / 3); ctx.stroke();
  }
  // light shaft
  const g = ctx.createLinearGradient(wx, wy + wh, wx, 900);
  g.addColorStop(0, 'rgba(224,184,90,0.18)');
  g.addColorStop(1, 'rgba(224,184,90,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(wx - ww / 2, wy + wh); ctx.lineTo(wx + ww / 2, wy + wh);
  ctx.lineTo(wx + 420, 980); ctx.lineTo(wx - 420, 980); ctx.closePath(); ctx.fill();
  // dust motes
  const r = rng(o.seed || 11);
  for (let i = 0; i < 40; i++) {
    ctx.globalAlpha = 0.15 + r() * 0.35;
    ctx.fillStyle = P.gold;
    ctx.fillRect(wx - 200 + r() * 400, wy + 40 + r() * 600, 1.5, 1.5);
  }
  ctx.restore();
}

/** 14. orderSphere — wire/dot sphere (0762). */
export function orderSphere(ctx, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 520, r = o.r ?? 120, k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, k * 1.2);
  const R = rng(o.seed || 2);
  for (let i = 0; i < 3; i++) {
    GS(ctx, () => {
      ctx.beginPath(); ctx.ellipse(x, y, r * (1 - i * 0.12), r * 0.55 * (1 - i * 0.08), i * 0.6, 0, Math.PI * 2);
    }, { color: P.gold, width: 1.2, bloom: 3, alpha: 0.7 });
  }
  for (let i = 0; i < 50; i++) {
    const th = R() * Math.PI * 2, ph = R() * Math.PI;
    const px = x + r * Math.sin(ph) * Math.cos(th);
    const py = y + r * Math.cos(ph) * 0.7;
    ctx.globalAlpha = 0.4 + R() * 0.5;
    ctx.fillStyle = P.gold;
    ctx.fillRect(px, py, 2, 2);
  }
  ctx.restore();
}

/** 15. workSpark — single caring spark (0762 ending). */
export function workSpark(ctx, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 900, k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save();
  GF(ctx, () => { ctx.beginPath(); ctx.arc(x, y, 6 * k, 0, Math.PI * 2); }, { color: P.gold, alpha: 0.95 });
  GS(ctx, () => { ctx.beginPath(); ctx.arc(x, y, 14 * k, 0, Math.PI * 2); }, { color: P.gold, width: 1, bloom: 4, alpha: 0.6 });
  ctx.restore();
}

/** 16. starExit — ending starfield with lonely figure spot. */
export function starExit(ctx, o = {}) {
  const k = o.k ?? 1;
  if (k <= 0) return;
  const r = rng(o.seed || 29);
  ctx.save();
  for (let i = 0; i < 120 * k; i++) {
    ctx.globalAlpha = 0.2 + r() * 0.7;
    ctx.fillStyle = r() < 0.1 ? P.hud : P.white;
    ctx.fillRect(r() * 1920, r() * 700, 1.4, 1.4);
  }
  ctx.restore();
}

/** 17. genMarker — ruler/tick line under runner (x=0). */
export function zeroMarker(ctx, o = {}) {
  const x = o.x ?? 960, y0 = o.y0 ?? 500, y1 = o.y1 ?? 860, k = o.k ?? 1;
  if (k <= 0) return;
  ctx.save();
  ctx.setLineDash([4, 6]);
  ctx.strokeStyle = 'rgba(245,245,245,0.4)'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = P.mute; ctx.font = '500 14px "Inter Tight", sans-serif';
  ctx.textAlign = 'center'; ctx.fillText('x = 0', x, y1 + 18);
  ctx.restore();
}

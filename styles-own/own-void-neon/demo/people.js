/** people.js — Void Neon character library.
 * Two cast types distilled from sources:
 *  A. PEG / chess-piece silhouette (7098 curse-knowledge) — round head, bell body, no face.
 *  B. PARTICLE silhouette (9472 NIPT) — point-cloud outline, optional internal bio glow.
 * Appeal rules (same bar as dark-gold §12):
 *  - Never frontal sticker faces (no dots, no U-mouth).
 *  - Real proportion: head ≈ 1/7–1/8 of height; shoulders readable; peg is simplified but not chibi.
 *  - Emotion = posture (tilt / lean / drop) + which nodes glow, never drawn facial features.
 *  - Material: neon hairline OR particle cloud; hero can get magenta/cyan internal light.
 */
import { P, rng, glowStroke, glowFill } from './look.js';

/** Peg figure. x,y = feet centre. s=1 → ~280 px tall. facing ±1. */
export function peg(ctx, o) {
  const s = o.s ?? 1, f = o.facing ?? 1;
  const tilt = o.pose?.tilt ?? 0, drop = o.pose?.drop ?? 0, lean = o.pose?.lean ?? 0;
  const X = (u) => o.x + (u + lean * 18) * s * f;
  const Y = (v) => o.y + v * s;
  const col = o.color || P.neon;
  const alpha = o.alpha ?? 0.9;
  ctx.save();
  // body bell
  const pathBody = () => {
    ctx.beginPath();
    ctx.moveTo(X(0), Y(-8));
    ctx.bezierCurveTo(X(28), Y(-20 - drop * 6), X(34), Y(-70), X(22), Y(-110));
    ctx.bezierCurveTo(X(14), Y(-130), X(10), Y(-148), X(0), Y(-155));
    ctx.bezierCurveTo(X(-10), Y(-148), X(-14), Y(-130), X(-22), Y(-110));
    ctx.bezierCurveTo(X(-34), Y(-70), X(-28), Y(-20 - drop * 6), X(0), Y(-8));
    ctx.closePath();
  };
  glowFill(ctx, pathBody, { color: col, alpha: 0.06 * alpha });
  glowStroke(ctx, pathBody, { color: col, width: 1.5, bloom: 3, alpha });
  // head
  const hx = lean * 10, hy = -178 - drop * 4;
  const pathHead = () => {
    ctx.beginPath();
    // slight tilt via offset
    ctx.ellipse(X(hx), Y(hy), 18 * s / Math.abs(s || 1) * (o.headScale ?? 1), 20 * (o.headScale ?? 1), tilt * f, 0, Math.PI * 2);
  };
  // recompute ellipse manually for glowStroke path
  const pathHead2 = () => {
    ctx.beginPath();
    const R = 19 * (o.headScale ?? 1);
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      const u = Math.cos(a) * R, v = Math.sin(a) * R * 1.08;
      const c = Math.cos(tilt * f), sn = Math.sin(tilt * f);
      const px = X(hx + u * c - v * sn), py = Y(hy + u * sn + v * c);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  };
  glowFill(ctx, pathHead2, { color: col, alpha: 0.08 * alpha });
  glowStroke(ctx, pathHead2, { color: col, width: 1.5, bloom: 3, alpha });
  // optional arm point (7098)
  if (o.point) {
    glowStroke(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(X(18), Y(-100));
      ctx.quadraticCurveTo(X(40 * o.point), Y(-120), X(55 * o.point), Y(-130));
    }, { color: col, width: 1.3, bloom: 2, alpha: alpha * 0.85 });
  }
  ctx.restore();
}

/** Tiny peg for crowds / grids. */
export function pegTiny(ctx, o) {
  peg(ctx, { ...o, s: (o.s ?? 0.35), alpha: o.alpha ?? 0.55, headScale: 1.05 });
}

/** Particle silhouette — 9472. Internal bio glow optional. */
export function particleSilhouette(ctx, o) {
  const s = o.s ?? 1, f = o.facing ?? 1;
  const tilt = o.pose?.tilt ?? 0, drop = o.pose?.drop ?? 0;
  const X = (u) => o.x + u * s * f, Y = (v) => o.y + v * s;
  const r = rng(o.seed || 17);
  const col = o.color || P.cyan;
  const bio = o.bio || null; // 'heart' | 'brain' | 'both'
  ctx.save();
  // body outline samples
  const outline = [];
  // simplified female/neutral dress silhouette points (relative)
  // Readable human silhouette (9472): head, bun, shoulders, waist, A-line skirt, feet
  const body = [
    [0, -8],          // feet centre
    [16, -12], [28, -40], [34, -70],   // skirt right
    [22, -110], [18, -140],            // waist
    [26, -155], [30, -170],            // right shoulder / arm hint
    [14, -185], [10, -205], [0, -220], // neck → crown
    [-10, -205], [-14, -185],
    [-30, -170], [-26, -155],
    [-18, -140], [-22, -110],
    [-34, -70], [-28, -40], [-16, -12],
    [0, -8],
  ];
  const bun = [[4, -225], [14, -238], [6, -250], [-6, -240], [-2, -225]];
  const pts = o.hair === 'bun' ? body.slice(0, 11).concat(bun, body.slice(11)) : body;
  // scatter particles near outline + fill
  for (let i = 0; i < 520; i++) {
    const t = r();
    const i0 = Math.floor(t * (pts.length - 1));
    const a = pts[i0], b = pts[Math.min(i0 + 1, pts.length - 1)];
    const u = a[0] + (b[0] - a[0]) * r() + (r() - 0.5) * 10;
    const v = a[1] + (b[1] - a[1]) * r() + (r() - 0.5) * 8 + drop * 4;
    // inward fill particles
    const inward = r() < 0.55 ? r() * 0.7 : 0;
    const uu = u * (1 - inward), vv = v;
    const px = X(uu), py = Y(vv);
    const rad = 0.6 + r() * 1.8;
    ctx.globalAlpha = 0.15 + r() * 0.55;
    ctx.fillStyle = r() < 0.12 ? P.neonHot : col;
    ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
  }
  // edge stroke glow
  glowStroke(ctx, () => {
    ctx.beginPath();
    pts.forEach((p, i) => {
      const px = X(p[0]), py = Y(p[1] + drop * 3);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath();
  }, { color: col, width: 1.2, bloom: 4, alpha: 0.55 });
  // internal bio
  if (bio === 'heart' || bio === 'both') {
    const hx = X(0), hy = Y(-145);
    glowStroke(ctx, () => {
      ctx.beginPath();
      ctx.moveTo(hx, hy + 8);
      ctx.bezierCurveTo(hx + 16, hy - 6, hx + 10, hy - 22, hx, hy - 10);
      ctx.bezierCurveTo(hx - 10, hy - 22, hx - 16, hy - 6, hx, hy + 8);
    }, { color: P.bio, width: 1.4, bloom: 5, alpha: 0.95 });
  }
  if (bio === 'brain' || bio === 'both') {
    const bx = X(2 + tilt * 20), by = Y(-210);
    glowStroke(ctx, () => {
      ctx.beginPath();
      ctx.ellipse(bx, by, 14, 11, tilt, 0, Math.PI * 2);
    }, { color: P.bio, width: 1.2, bloom: 4, alpha: 0.9 });
    // neural sparks
    for (let i = 0; i < 8; i++) {
      const ang = r() * Math.PI * 2, rr = 4 + r() * 10;
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = P.gold;
      ctx.beginPath(); ctx.arc(bx + Math.cos(ang) * rr, by + Math.sin(ang) * rr, 1.2, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();
}

/** Crowd grid of dim pegs with one/few lit — 7098 perspective grid feel (simplified). */
export function pegCrowd(ctx, o) {
  const cols = o.cols || 9, rows = o.rows || 4;
  const lit = new Set(o.lit || []);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const idx = j * cols + i;
      const x = o.x + (i - (cols - 1) / 2) * (o.gapX || 48);
      const y = o.y + j * (o.gapY || 36);
      const isLit = lit.has(idx);
      pegTiny(ctx, {
        x, y, s: (o.s || 0.28) * (1 - j * 0.04),
        color: isLit ? (o.litColor || P.magenta) : P.mute,
        alpha: isLit ? 0.95 : 0.35,
        pose: { tilt: 0, drop: 0, lean: 0 },
      });
    }
  }
}

/** people.js — Dark Gold Line character library.
 * Distilled from halo (叁号暗房) t5/t10/t51.5/t62, ember-craving, xiaomo-disarm.
 * WHY the source looks attractive (and our old egg-head did not):
 *  1. Real anatomy, simplified — never a cartoon. Head ≈ 1/7.5 of body, egg (taller than wide),
 *     neck 0.45 head-width, trapezius slope then a round deltoid, arms separated from torso by a
 *     hairline gap, not a stick.
 *  2. Profile/three-quarter, not frontal. A nose bump, lip notch and chin give a person character
 *     without drawing any face; frontal faces with dot eyes read as a kids' sticker.
 *  3. ONE line weight (1.3–1.8 px @1080p), warm grey, ~55% alpha; the hero gets material (gold foil),
 *     extras stay line-only. Fill = void colour so rows occlude each other cleanly.
 *  4. Emotion = posture + light: head tilt, chin height, shoulder drop, lean, and what light/halo does.
 * Face rule: profile busts may carry ONE eye (the only one visible, anatomically correct) as a lash arc;
 * a frontal close-up uses two lash arcs + two brows, never dots + U-mouth.
 */
import { P, rng } from './look.js';

const LINE = 'rgba(214,204,186,0.68)';

/* ---------- gold foil material (deterministic, cached) ---------- */
let FOIL = null;
export function foilPattern(ctx) {
  if (FOIL) return ctx.createPattern(FOIL, 'repeat');
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  const r = rng(77);
  g.fillStyle = '#B39663'; g.fillRect(0, 0, 512, 512);
  // large mottling
  for (let i = 0; i < 700; i++) {
    const x = r() * 512, y = r() * 512, rad = 10 + r() * 34;
    const light = r() < 0.5;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, light ? 'rgba(226,204,150,0.16)' : 'rgba(120,96,58,0.13)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // fine grain
  const id = g.getImageData(0, 0, 512, 512), d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * 30 + (r() < 0.004 ? 90 : 0);
    d[i] += n; d[i + 1] += n * 0.9; d[i + 2] += n * 0.6;
  }
  g.putImageData(id, 0, 0);
  FOIL = c;
  return ctx.createPattern(FOIL, 'repeat');
}

/* ---------- profile bust (hero) ----------
 * x,y = base centre (bottom of bust). s = scale (1 → ~430 px tall). facing: 1 = looks left, -1 = right
 * pose: tilt (rad, + = chin up), drop (0..1 shoulder drop/sad), lean (-1..1)
 * hair: 'bun' | 'short' | 'long' ; fill: 'foil' | 'void' | 'line'
 * eye: false | 'open' | 'closed' | 'down'  (single visible eye in profile)
 */
export function bustPath(ctx, o) {
  const s = o.s ?? 1, f = -(o.facing ?? 1);
  const tilt = o.pose?.tilt ?? 0, drop = o.pose?.drop ?? 0, lean = o.pose?.lean ?? 0;
  const X = (u) => o.x + u * s * f, Y = (v) => o.y + v * s;
  // head local frame rotated by tilt around neck pivot
  const pvx = 8 + lean * 20, pvy = -250;
  const R = (u, v) => {
    const hs = o.headScale ?? 1.32; // head ≈ 0.5 × shoulder width (halo t5): the appeal ratio
    // rounder cranium: wider than tall scaling, head sits low (short neck) — halo t5 / t51.5
    const du = (u - pvx) * hs * 1.16, dv = (v - pvy) * hs * 0.94 + 26, c = Math.cos(tilt * f), sn = Math.sin(tilt * f); // + tilt = chin up, either facing
    return [X(pvx + du * c - dv * sn), Y(pvy + du * sn + dv * c)];
  };
  const sh = 26 * drop; // shoulder drop
  ctx.beginPath();
  // base, back side — shoulders ≈ 2.4 × head height wide (halo t5 measure)
  ctx.moveTo(X(232), Y(0));
  ctx.bezierCurveTo(X(232), Y(-60 + sh), X(214), Y(-118 + sh), X(150), Y(-146 + sh));
  // nape: body point → head-frame point with shared tangent (no kink when head scales/tilts)
  ctx.bezierCurveTo(X(100), Y(-166 + sh), X(62), Y(-184), ...R(52, -244));
  ctx.bezierCurveTo(...R(84, -294), ...R(86, -372), ...R(26, -398));
  if (o.hair === 'bun') {
    ctx.bezierCurveTo(...R(44, -398), ...R(58, -432), ...R(34, -452));
    ctx.bezierCurveTo(...R(12, -468), ...R(-16, -452), ...R(-10, -424));
  }
  ctx.bezierCurveTo(...R(-24, -420), ...R(-70, -410), ...R(-82, -364));
  ctx.bezierCurveTo(...R(-88, -348), ...R(-88, -332), ...R(-90, -322));
  ctx.bezierCurveTo(...R(-94, -312), ...R(-104, -298), ...R(-108, -290));
  ctx.bezierCurveTo(...R(-106, -284), ...R(-98, -282), ...R(-94, -282));
  ctx.bezierCurveTo(...R(-96, -276), ...R(-98, -270), ...R(-96, -266));
  ctx.bezierCurveTo(...R(-92, -264), ...R(-94, -262), ...R(-96, -258));
  ctx.bezierCurveTo(...R(-94, -252), ...R(-90, -246), ...R(-90, -240));
  ctx.bezierCurveTo(...R(-88, -230), ...R(-80, -224), ...R(-66, -222));
  ctx.bezierCurveTo(...R(-50, -220), ...R(-40, -214), ...R(-38, -204));
  ctx.bezierCurveTo(...R(-30, -170), X(-40), Y(-168 + sh * 0.5), X(-70), Y(-156 + sh));
  ctx.bezierCurveTo(X(-150), Y(-136 + sh), X(-212), Y(-110 + sh), X(-228), Y(-50 + sh));
  ctx.bezierCurveTo(X(-234), Y(-26), X(-236), Y(-10), X(-238), Y(0));
  ctx.closePath();
  return { eye: R(-58, -324), ear: R(4, -300), head: R(-14, -334), headH: 230 * (o.s ?? 1) * (o.headScale ?? 1.32) * 1.04 };
}

export function bust(ctx, o = {}) {
  ctx.save();
  const k = bustPath(ctx, o);
  if (o.fill === 'foil') {
    ctx.fillStyle = foilPattern(ctx);
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.fill();
    // inner rim light from behind (halo side)
    ctx.globalCompositeOperation = 'source-atop';
    const g = ctx.createLinearGradient(o.x - 200 * (o.s ?? 1), 0, o.x + 200 * (o.s ?? 1), 0);
    g.addColorStop(0, 'rgba(0,0,0,0.18)'); g.addColorStop(0.55, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(255,226,160,0.16)');
    ctx.fillStyle = g; ctx.fill();
    const v = ctx.createLinearGradient(0, o.y - 470 * (o.s ?? 1), 0, o.y);
    v.addColorStop(0, 'rgba(255,236,190,0.10)'); v.addColorStop(1, 'rgba(0,0,0,0.12)'); ctx.fillStyle = v;
    ctx.fillStyle = g; ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  } else if (o.fill === 'void') {
    ctx.fillStyle = o.voidColor || 'rgba(14,12,10,0.96)'; ctx.fill();
  }
  if (o.line !== false) {
    bustPath(ctx, o);
    ctx.strokeStyle = o.lineColor || (o.fill === 'foil' ? 'rgba(232,206,150,0.55)' : LINE);
    ctx.lineWidth = (o.lw ?? 1.5); ctx.stroke();
  }
  // optional single eye (profile)
  if (o.eye) {
    const [ex, ey] = k.eye, s = o.s ?? 1, f = -(o.facing ?? 1);
    ctx.strokeStyle = o.fill === 'foil' ? 'rgba(60,44,22,0.75)' : LINE; ctx.lineWidth = 1.6 * s;
    ctx.beginPath();
    if (o.eye === 'closed') ctx.arc(ex, ey - 2 * s, 9 * s, 0.15 * Math.PI, 0.85 * Math.PI);
    else if (o.eye === 'down') { ctx.moveTo(ex - 9 * s, ey); ctx.quadraticCurveTo(ex, ey + 5 * s, ex + 9 * s, ey + 1 * s); }
    else { ctx.moveTo(ex - 9 * s, ey + 1 * s); ctx.quadraticCurveTo(ex, ey - 6 * s, ex + 9 * s, ey); }
    ctx.stroke();
  }
  ctx.restore();
  return k;
}

/* ---------- standing figure, frontal or back view (extras, crowds, observer) ----------
 * x,y = feet centre; h = height px; pose: tilt (head), drop (shoulders 0..1), armOut (0..1 lift)
 */
export function figurePath(ctx, x, y, h, pose = {}) {
  const u = h / 7.6; // head unit
  const hw = u * 0.42, hh = u * 0.56;            // head half-width, half-height (egg)
  const drop = (pose.drop ?? 0) * u * 0.25;
  const tilt = pose.tilt ?? 0;
  const top = y - h;
  const hx = x + Math.sin(tilt) * u * 0.3, hy = top + hh;
  const neckY = top + u * 1.12, shY = top + u * 1.55 + drop;
  const shW = u * 1.05, hipY = top + u * 4.0, hipW = u * 0.62;
  ctx.beginPath();
  // head (egg)
  ctx.ellipse(hx, hy, hw, hh, tilt * 0.6, 0, Math.PI * 2);
  // neck + shoulders + torso as one closed outline with arm gaps
  ctx.moveTo(x - u * 0.2, neckY);
  ctx.bezierCurveTo(x - u * 0.24, shY - u * 0.18, x - shW * 0.7, shY - u * 0.12, x - shW, shY + u * 0.15);
  // outer arm left down to hand
  ctx.bezierCurveTo(x - shW * 1.1, shY + u * 0.7, x - shW * 1.08, hipY - u * 0.4, x - shW * 1.0, hipY + u * 0.55);
  ctx.quadraticCurveTo(x - shW * 0.9, hipY + u * 0.8, x - shW * 0.82, hipY + u * 0.5);
  // inner arm up to armpit
  ctx.bezierCurveTo(x - shW * 0.84, hipY - u * 0.4, x - shW * 0.78, shY + u * 1.1, x - shW * 0.74, shY + u * 0.85);
  // torso side down to hip, legs
  ctx.bezierCurveTo(x - shW * 0.7, hipY - u * 0.6, x - hipW, hipY - u * 0.2, x - hipW, hipY + u * 0.3);
  ctx.bezierCurveTo(x - hipW * 0.95, y - u * 1.8, x - hipW * 0.7, y - u * 0.4, x - hipW * 0.62, y);
  ctx.lineTo(x - u * 0.06, y);
  ctx.lineTo(x, hipY + u * 0.85);
  ctx.lineTo(x + u * 0.06, y);
  ctx.lineTo(x + hipW * 0.62, y);
  ctx.bezierCurveTo(x + hipW * 0.7, y - u * 0.4, x + hipW * 0.95, y - u * 1.8, x + hipW, hipY + u * 0.3);
  ctx.bezierCurveTo(x + hipW, hipY - u * 0.2, x + shW * 0.7, hipY - u * 0.6, x + shW * 0.74, shY + u * 0.85);
  ctx.bezierCurveTo(x + shW * 0.78, shY + u * 1.1, x + shW * 0.84, hipY - u * 0.4, x + shW * 0.82, hipY + u * 0.5);
  ctx.quadraticCurveTo(x + shW * 0.9, hipY + u * 0.8, x + shW * 1.0, hipY + u * 0.55);
  ctx.bezierCurveTo(x + shW * 1.08, hipY - u * 0.4, x + shW * 1.1, shY + u * 0.7, x + shW, shY + u * 0.15);
  ctx.bezierCurveTo(x + shW * 0.7, shY - u * 0.12, x + u * 0.24, shY - u * 0.18, x + u * 0.2, neckY);
  return { head: [hx, hy], u };
}

export function figure(ctx, x, y, h, o = {}) {
  ctx.save();
  ctx.globalAlpha = o.alpha ?? 1;
  const k = figurePath(ctx, x, y, h, o.pose);
  ctx.fillStyle = o.fill || 'rgba(9,9,10,1)';
  ctx.fill('nonzero');
  figurePath(ctx, x, y, h, o.pose);
  ctx.strokeStyle = o.line || LINE; ctx.lineWidth = o.lw ?? 1.4; ctx.stroke();
  // inner arm separation hairlines (the source's trick: arms read without outlining overlap)
  ctx.restore();
  if (o.phone) phoneGlow(ctx, k.head[0] + k.u * 0.5, y - h * 0.62, k.u, o.phone);
  return k;
}

/** Crowd rows: back rows smaller & dimmer, drawn back-to-front so fills occlude. */
export function crowd(ctx, { x0 = 0, x1 = 1920, baseY = 1080, rows = 3, seed = 3, gap = 0, gapX = 960, phones = 0, t = 0, scale = 1 } = {}) {
  const r = rng(seed);
  for (let row = rows - 1; row >= 0; row--) {
    const h = (560 - row * 110) * scale;
    const y = baseY + h * 0.55 - row * 40 * scale;
    const n = Math.round((x1 - x0) / (h * 0.46));
    for (let i = 0; i < n; i++) {
      const x = x0 + (i + 0.5 + (r() - 0.5) * 0.6) * (x1 - x0) / n;
      const skip = gap && Math.abs(x - gapX) < gap;
      const hh = h * (0.88 + r() * 0.22);
      const ph = phones && r() < phones;
      if (skip) continue;
      figure(ctx, x, y, hh, {
        alpha: 1 - row * 0.3,
        line: `rgba(214,204,186,${0.72 - row * 0.12})`,
        pose: { tilt: Math.sin(t * 0.9 + i * 1.7 + row) * 0.035 + (r() - 0.5) * 0.1 },
        phone: ph ? { t, ph: r() * 6 } : null,
      });
    }
  }
}

/** Phone held up — small lit rectangle with soft beam (halo t10). */
export function phoneGlow(ctx, x, y, u, { t = 0, ph = 0 } = {}) {
  const w = u * 0.36, h = u * 0.6, top = y - u * 3.6;
  const flick = 0.8 + 0.2 * Math.sin(t * 2.4 + ph);
  ctx.save();
  // held-up arm hint: faint column of light below the phone (halo t10)
  const g = ctx.createLinearGradient(0, top, 0, top + u * 3);
  g.addColorStop(0, 'rgba(120,116,108,0.28)'); g.addColorStop(1, 'rgba(120,116,108,0)');
  ctx.fillStyle = g; ctx.fillRect(x - w * 0.35, top + h, w * 0.7, u * 3);
  ctx.fillStyle = `rgba(206,202,194,${0.62 * flick})`;
  roundRectP(ctx, x - w / 2, top, w, h, w * 0.16); ctx.fill();
  ctx.restore();
}
function roundRectP(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

/* ---------- diagram figure (ember-style, small scale only, <120 px) ----------
 * Kept for charts/timelines. Refined: tapered limbs, egg head, posture-led emotion. */
export function tinyFigure(ctx, x, y, h, { pose = {}, color = P.gold, glow = true } = {}) {
  const u = h / 6.5;
  const lean = pose.lean ?? 0, drop = pose.drop ?? 0;
  ctx.save();
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'round';
  if (glow) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
  const hx = x + lean * u, hy = y - h + u * 0.6 + drop * u * 0.4;
  ctx.beginPath(); ctx.ellipse(hx, hy, u * 0.45, u * 0.56, lean * 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = u * 0.42;
  ctx.beginPath(); ctx.moveTo(hx - lean * u * 0.2, hy + u * 0.9); ctx.lineTo(x, y - u * 2.6); ctx.stroke();
  ctx.lineWidth = u * 0.26;
  const a = pose.arms ?? 0.25;
  ctx.beginPath();
  ctx.moveTo(hx, hy + u * 1.1); ctx.lineTo(hx - u * 1.0, hy + u * 1.1 + u * 1.6 * Math.cos(a));
  ctx.moveTo(hx, hy + u * 1.1); ctx.lineTo(hx + u * 1.0, hy + u * 1.1 + u * 1.6 * Math.cos(a));
  ctx.moveTo(x, y - u * 2.6); ctx.lineTo(x - u * 0.55, y);
  ctx.moveTo(x, y - u * 2.6); ctx.lineTo(x + u * 0.55, y);
  ctx.stroke();
  ctx.restore();
}

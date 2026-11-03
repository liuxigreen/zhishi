/** people.js — Academy Spot peg people (色块 peg). Measured on zhongshan-learn:
 * head = sphere, body = tall rounded capsule/cloak, NO limbs, NO faces.
 * Casts: novice (cool blue #A8C4D8) · expert (warm gold #E5C07B) · neutral tan.
 * Appeal = proportion (head ≈ 0.38 body-width, slight head gap) + volumetric glow under spotlight.
 * This IS the source figure language — not a stick/blob failure; say so plainly in STYLE §12. */
import { P, rgba, mix, contactShadow, glowPool, clamp, lerp } from './look.js';

const TAU = Math.PI * 2;

/**
 * peg — color-block person.
 * @param o.x o.y feet centre   @param o.H total height
 * @param o.cast 'novice'|'expert'|'neutral'
 * @param o.lean radians   @param o.nod 0..1 head tip
 * @param o.glow 0..1 internal/aura glow   @param o.kneel 0..1 squat amount
 * @param o.alpha
 */
export function peg(ctx, o) {
  const {
    x, y, H = 320, cast = 'novice', lean = 0, nod = 0, glow = 0.55,
    kneel = 0, alpha = 1, facing = 1, breath = 0,
  } = o;
  const base = cast === 'expert' ? P.gold : cast === 'neutral' ? P.tan : P.blue;
  const lit = cast === 'expert' ? P.goldHot : cast === 'neutral' ? mix(P.tan, '#FFF', 0.25) : P.blueHot;
  const shade = cast === 'expert' ? P.goldDim : cast === 'neutral' ? mix(P.tan, '#5A4030', 0.35) : P.blueDim;

  // proportions measured: body W ≈ 0.30 H, body H ≈ 0.72 H, head R ≈ 0.115 H, gap ≈ 0.02 H
  const squat = 1 - kneel * 0.28;
  const bw = H * (0.30 + breath * 0.008);
  const bh = H * 0.72 * squat;
  const hr = H * 0.115;

  ctx.save(); ctx.globalAlpha *= alpha;
  if (glow > 0) glowPool(ctx, x, y - H * 0.55, H * 0.85, base, 0.22 * glow);
  contactShadow(ctx, x, y, bw * 1.05, 0.45);

  ctx.translate(x, y); ctx.rotate(lean * facing); ctx.scale(facing, 1);

  // body — rounded "cloak"/capsule: wider shoulders, slight taper to feet
  const by = -bh;
  const topW = bw, botW = bw * 0.78;
  const bodyPath = () => {
    ctx.beginPath();
    ctx.moveTo(-topW / 2, by + topW * 0.22);
    ctx.quadraticCurveTo(-topW / 2, by, 0, by);           // left shoulder → crown
    ctx.quadraticCurveTo(topW / 2, by, topW / 2, by + topW * 0.22);
    ctx.lineTo(botW / 2, -2);
    ctx.quadraticCurveTo(0, 6, -botW / 2, -2);
    ctx.closePath();
  };
  // soft vertical light
  const g = ctx.createLinearGradient(-topW / 2, by, topW / 2, 0);
  g.addColorStop(0, lit); g.addColorStop(0.45, base); g.addColorStop(1, shade);
  bodyPath(); ctx.fillStyle = g; ctx.fill();
  // rim light on top edge
  ctx.save(); bodyPath(); ctx.clip();
  const rg = ctx.createLinearGradient(0, by, 0, by + bh * 0.35);
  rg.addColorStop(0, rgba('#FFFFFF', 0.22 * glow)); rg.addColorStop(1, rgba('#FFFFFF', 0));
  ctx.fillStyle = rg; ctx.fillRect(-topW / 2, by, topW, bh * 0.4);
  ctx.restore();

  // head sphere with coin shading
  const hx = nod * bw * 0.08; const hy = by - hr * 1.05 - H * 0.01 + nod * hr * 0.25;
  ctx.fillStyle = shade; ctx.beginPath(); ctx.arc(hx - hr * 0.08, hy + hr * 0.08, hr, 0, TAU); ctx.fill();
  const hg = ctx.createRadialGradient(hx - hr * 0.35, hy - hr * 0.4, hr * 0.08, hx, hy, hr * 1.05);
  hg.addColorStop(0, lit); hg.addColorStop(0.7, base); hg.addColorStop(1, shade);
  ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hx, hy, hr * 0.97, 0, TAU); ctx.fill();
  // soft specular
  ctx.fillStyle = rgba('#FFFFFF', 0.28 * glow);
  ctx.beginPath(); ctx.arc(hx - hr * 0.28, hy - hr * 0.32, hr * 0.28, 0, TAU); ctx.fill();

  ctx.restore();

  const c = Math.cos(lean * facing), s = Math.sin(lean * facing);
  const Wxy = ([px, py]) => [x + px * facing * c - py * s, y + px * facing * s + py * c];
  return {
    head: Wxy([hx, hy]), headR: hr, top: Wxy([hx, hy - hr]),
    chest: Wxy([0, by + bh * 0.3]), feet: [x, y], bw, H, cast, base,
  };
}

/** Two pegs side by side — common duo shot (novice left, expert right). */
export function duo(ctx, { x = 960, y = 860, H = 300, gap = 220, glowL = 0.4, glowR = 0.85, kneelL = 0, kneelR = 0 } = {}) {
  const L = peg(ctx, { x: x - gap / 2, y, H, cast: 'novice', glow: glowL, kneel: kneelL, facing: 1 });
  const R = peg(ctx, { x: x + gap / 2, y, H, cast: 'expert', glow: glowR, kneel: kneelR, facing: -1 });
  return { L, R };
}

/** Tiny diagram peg for graphs / networks (half size, flatter). */
export function tinyPeg(ctx, o) {
  return peg(ctx, { H: 90, glow: 0.35, ...o });
}

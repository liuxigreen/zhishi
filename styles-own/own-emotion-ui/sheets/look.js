/** Emotion UI — look / material / light lib (own-emotion-ui).
 * Palette measured from nexo-crowd (#080C16 50 %, #14192B 31 %, hero #E3A371/#BC7745),
 * 6571-just-en (#0C142D, cream #EDF1EC, screen cyan #7ABAEF) and 6911-anxious-attach (#171E2B, lamp cream, coral #E37652). */
export const P = {
  void: '#080C16', navy: '#0E1426', navy2: '#14192B', slate: '#2A3147', wall: '#1A2238',
  crowd: '#7F89A3', crowdDim: '#4B5267',
  hero: '#F2A866', heroLit: '#FFC489', heroShade: '#C97A3E',          // the self (nexo t7.5)
  cream: '#EEEAE0', creamShade: '#CFC8B8',                          // the pictogram cast (6571 t9.5)
  cyan: '#7ABAEF', cyanHot: '#BFE4FF',                               // screen light (6571)
  lamp: '#FFE7B0', lampCore: '#FFF6DC',                              // hanging lamp (6911)
  orange: '#FF9A3C', orangeDeep: '#E9771E',                          // self bubbles (6911 t8)
  white: '#F4F6FA', mute: '#9AA3B8', ink: '#141826',
  tense: '#E58A7A', calm: '#5FC4A8', gold: '#FFC66B',
  coral: '#EE7D62', denim: '#7F9FD8', skin: '#F6CFAE', hair: '#3B2A27', trouser: '#333C58',
};
export function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; }; }
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export function hexRgb(h) { if (h[0] !== '#') return h.match(/[\d.]+/g).slice(0, 3).map(Number); const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
export function rgba(h, a) { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; }
export function mix(h1, h2, k) { const a = hexRgb(h1), b = hexRgb(h2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`; }

/** Night room: navy vertical gradient wall, faint panel grid (nexo t5.5 back wall), floor band with a soft horizon. */
export function paintRoom(ctx, w = 1920, h = 1080, { floorY = 900, grid = true, warm = 0, glowX = 0.5, glowY = 0.55, glow = 0.35, tint = P.void } = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#111830'); g.addColorStop(0.55, '#0C1224'); g.addColorStop(1, tint);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  if (grid) { // tall glass panels, barely visible
    ctx.save(); ctx.strokeStyle = 'rgba(120,140,190,0.07)'; ctx.lineWidth = 2;
    for (let x = 120; x < w; x += 340) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, floorY - 40); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(w, 150); ctx.stroke();
    ctx.fillStyle = 'rgba(60,80,140,0.05)';
    for (let x = 120; x < w; x += 680) ctx.fillRect(x, 0, 340, floorY - 40);
    ctx.restore();
  }
  // floor
  const f = ctx.createLinearGradient(0, floorY, 0, h);
  f.addColorStop(0, '#0B1020'); f.addColorStop(1, '#05070D');
  ctx.fillStyle = f; ctx.fillRect(0, floorY, w, h - floorY);
  ctx.fillStyle = 'rgba(140,160,210,0.10)'; ctx.fillRect(0, floorY, w, 2);
  // key glow (the light the hero stands in)
  if (glow > 0) {
    const r = ctx.createRadialGradient(w * glowX, h * glowY, 0, w * glowX, h * glowY, h * 0.62);
    r.addColorStop(0, `rgba(${warm ? '255,190,130' : '120,140,200'},${0.20 * glow})`);
    r.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = r; ctx.fillRect(0, 0, w, h);
  }
  vignette(ctx, w, h, 0.55);
}
export function vignette(ctx, w, h, a = 0.5) {
  const v = ctx.createRadialGradient(w / 2, h * 0.5, h * 0.35, w / 2, h * 0.5, h * 1.05);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
}
/** Soft radial light pool (nexo t7.5 hero glow; 6571 phone glow). */
export function glowPool(ctx, x, y, r, color = '#FFB070', a = 0.35) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(0.45, rgba(color, a * 0.35)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
export function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
/** Floor contact shadow — every grounded thing gets one (nexo t5.5, 6911 t31). */
export function contactShadow(ctx, x, y, rx, a = 0.45) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.16);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
/** Film grain + dust specks keep flat vector from looking sterile (6911 lamp dust). */
export function grain(ctx, w, h, t, a = 0.035) {
  const R = rng(1 + Math.floor(t * 12));
  ctx.save(); ctx.fillStyle = `rgba(255,255,255,${a})`;
  for (let i = 0; i < 900; i++) ctx.fillRect(R() * w, R() * h, 1.5, 1.5);
  ctx.restore();
}
/** Caption font stack (source: bold rounded-ish sans, white, centred low — nexo t26.5 y≈0.93H; 6571 hook title top-left glow). */
export const FONT = '"Noto Sans SC", "Inter Tight", sans-serif';
export const MONO = '"Geist Mono", "Inter Tight", monospace';
/** Symptom / state chip: pill with number badge (6911 t31 「① 症状 · 反复确认」, nexo t26.5 「自我关注」). */
export function chip(ctx, x, y, text, { color = P.orange, num = null, size = 30, fill = 'rgba(20,24,38,0.85)', align = 'center', a = 1 } = {}) {
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `600 ${size}px ${FONT}`; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width, bh = size * 1.75, nb = num != null ? bh * 0.72 : 0;
  const w = tw + size * 1.4 + (nb ? nb + size * 0.35 : 0);
  const x0 = align === 'center' ? x - w / 2 : x;
  roundRect(ctx, x0, y - bh / 2, w, bh, bh / 2); ctx.fillStyle = fill; ctx.fill();
  ctx.lineWidth = 2.5; ctx.strokeStyle = color; ctx.stroke();
  let cx = x0 + size * 0.7;
  if (nb) {
    ctx.beginPath(); ctx.arc(cx + nb / 2, y, nb / 2, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    ctx.fillStyle = '#1A1206'; ctx.font = `800 ${size * 0.72}px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(String(num), cx + nb / 2, y + 1);
    cx += nb + size * 0.35; ctx.font = `600 ${size}px ${FONT}`;
  }
  ctx.textAlign = 'left'; ctx.fillStyle = '#F7F1E8'; ctx.fillText(text, cx, y + 1);
  ctx.restore();
  return { x0, x1: x0 + w, y0: y - bh / 2, y1: y + bh / 2 };
}

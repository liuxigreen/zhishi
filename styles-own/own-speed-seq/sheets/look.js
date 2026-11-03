/** Speed Seq · 节拍序列 (own-speed-seq) — look / material / light.
 * Measured from 0594-speedrun: beige paper board (#EDE7DA / #F2EEE4), ink #1A1714,
 * accent orange-red #E85A2A (playhead + key word), dark stage #1C1218 / #2A1520 for
 * performance worlds, sequencer chrome beige-on-dark. */
export const P = {
  paper: '#EDE7DA', paper2: '#E4DDCD', paperDeep: '#D6CFC0',
  ink: '#1A1714', inkSoft: '#3A342C', mute: '#8A8174',
  accent: '#E85A2A', accentHot: '#FF7A3C', accentDeep: '#B83C16',
  gold: '#E8C56A', goldSoft: '#F2DEA0', cream: '#F6EFE0',
  stage: '#1A1016', stage2: '#2A1522', stagePlum: '#2D1B33', stageBurg: '#2A0A16',
  skin: '#E8C9A8', skinDark: '#8B5A3C', skinMid: '#C9956A',
  white: '#F7F3EA', black: '#0E0C0A',
  track: '#0F0C0A', seqBeige: '#E8DCC4', seqLine: '#C9B896',
  teal: '#3DB8B0', pink: '#E85A8A', cyan: '#5AC8E8', yellow: '#F0C040',
  purple: '#7A4AB0', orange: '#F07830', coral: '#EE7D62',
};
export function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0x100000000; }; }
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export function hexRgb(h) {
  if (!h || h[0] !== '#') { const m = String(h).match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : [0, 0, 0]; }
  const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgba(h, a) { const [r, g, b] = hexRgb(h); return `rgba(${r},${g},${b},${a})`; }
export function mix(h1, h2, k) { const a = hexRgb(h1), b = hexRgb(h2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], k))).join(',')})`; }

let _paperCache = null;
/** Warm beige board with faint vertical fibre (0594 t18). */
export function paintPaper(ctx, w = 1920, h = 1080, { grainAmt = 0.04 } = {}) {
  if (!_paperCache) {
    const c = document.createElement('canvas'); c.width = 480; c.height = 270;
    const g = c.getContext('2d');
    g.fillStyle = P.paper; g.fillRect(0, 0, 480, 270);
    const R = rng(42);
    for (let i = 0; i < 1800; i++) {
      g.fillStyle = rgba(R() > 0.5 ? P.paperDeep : '#F6F1E6', 0.08 + R() * 0.12);
      g.fillRect(R() * 480, R() * 270, 1 + R() * 2, 8 + R() * 40);
    }
    for (let i = 0; i < 400; i++) {
      g.fillStyle = rgba(P.ink, 0.04 + R() * 0.05);
      g.fillRect(R() * 480, R() * 270, 1, 1);
    }
    _paperCache = c;
  }
  ctx.drawImage(_paperCache, 0, 0, w, h);
  // corner registration marks (0594 t18)
  ctx.save(); ctx.strokeStyle = rgba(P.mute, 0.55); ctx.lineWidth = 1.5;
  const m = 36, L = 14;
  [[m, m], [w - m, m], [m, h - m], [w - m, h - m]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
  });
  ctx.restore();
}
/** Dark stage void for performance worlds (0594 t91 / t146 / t529). */
export function paintStage(ctx, w = 1920, h = 1080, { tint = P.stage, floorY = 720, glowX = 0.5, glow = 0.35, color = '#FFD8A0' } = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, mix(tint, '#000000', 0.15));
  g.addColorStop(0.55, tint);
  g.addColorStop(1, mix(tint, '#000000', 0.35));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // floor band
  const f = ctx.createLinearGradient(0, floorY, 0, h);
  f.addColorStop(0, rgba('#000000', 0.15)); f.addColorStop(1, rgba('#000000', 0.55));
  ctx.fillStyle = f; ctx.fillRect(0, floorY, w, h - floorY);
  ctx.fillStyle = rgba(P.goldSoft, 0.08); ctx.fillRect(0, floorY, w, 1.5);
  if (glow > 0) {
    const r = ctx.createRadialGradient(w * glowX, floorY * 0.55, 0, w * glowX, floorY * 0.55, h * 0.55);
    r.addColorStop(0, rgba(color, 0.22 * glow)); r.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = r; ctx.fillRect(0, 0, w, h);
  }
  vignette(ctx, w, h, 0.5);
}
export function vignette(ctx, w, h, a = 0.5) {
  const v = ctx.createRadialGradient(w / 2, h * 0.45, h * 0.3, w / 2, h * 0.5, h * 1.05);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${a})`);
  ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
}
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
export function contactShadow(ctx, x, y, rx, a = 0.45) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.18);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
  g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
export function grain(ctx, w, h, t, a = 0.03) {
  const R = rng(3 + Math.floor(t * 10));
  ctx.save(); ctx.fillStyle = `rgba(255,255,255,${a})`;
  for (let i = 0; i < 700; i++) ctx.fillRect(R() * w, R() * h, 1.4, 1.4);
  ctx.restore();
}
export const FONT = '"Noto Sans SC", "Inter Tight", sans-serif';
export const MONO = '"Geist Mono", "Inter Tight", monospace';

/** Top-left chapter number + caption line with accent key word (0594 t18). */
export function chapterNum(ctx, n, { x = 70, y = 78, size = 42, a = 1 } = {}) {
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `800 ${size}px ${FONT}`; ctx.fillStyle = P.ink; ctx.textBaseline = 'middle';
  ctx.fillText(String(n).padStart(2, '0'), x, y); ctx.restore();
}
/** Soft caption: black on paper / cream on stage; key words in accent. Returns box for TEXTS. */
export function captionBlock(ctx, x, y, parts, { size = 44, align = 'left', a = 1, stage = false } = {}) {
  // parts: [{t, accent?}]
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 ${size}px ${FONT}`; ctx.textBaseline = 'middle';
  const full = parts.map(p => p.t).join('');
  let tw = 0; parts.forEach(p => { ctx.font = `${p.accent ? 800 : 700} ${size}px ${FONT}`; tw += ctx.measureText(p.t).width; });
  let cx = align === 'center' ? x - tw / 2 : x;
  // soft band for stage contrast
  if (stage) {
    const pad = size * 0.55;
    roundRect(ctx, cx - pad, y - size * 0.85, tw + pad * 2, size * 1.7, 10);
    ctx.fillStyle = 'rgba(12,8,10,0.72)'; ctx.fill();
  }
  parts.forEach(p => {
    ctx.font = `${p.accent ? 800 : 700} ${size}px ${FONT}`;
    ctx.fillStyle = p.accent ? P.accent : (stage ? P.cream : P.ink);
    ctx.fillText(p.t, cx, y);
    cx += ctx.measureText(p.t).width;
  });
  ctx.restore();
  const x0 = align === 'center' ? x - tw / 2 : x;
  return { text: full, x0, y0: y - size * 0.7, x1: x0 + tw, y1: y + size * 0.7 };
}
/** Small topic pill / time-signature chip. */
export function chip(ctx, x, y, text, { color = P.accent, fill = null, size = 26, a = 1 } = {}) {
  ctx.save(); ctx.globalAlpha *= a; ctx.font = `700 ${size}px ${FONT}`; ctx.textBaseline = 'middle';
  const tw = ctx.measureText(text).width, bh = size * 1.7, bw = tw + size * 1.2;
  roundRect(ctx, x - bw / 2, y - bh / 2, bw, bh, bh / 2);
  ctx.fillStyle = fill || rgba(color, 0.18); ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.stroke();
  ctx.fillStyle = fill ? P.ink : color; ctx.textAlign = 'center'; ctx.fillText(text, x, y + 1);
  ctx.restore();
  return { text, x0: x - bw / 2, y0: y - bh / 2, x1: x + bw / 2, y1: y + bh / 2 };
}

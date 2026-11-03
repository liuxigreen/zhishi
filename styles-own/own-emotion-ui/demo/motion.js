/** motion.js — Emotion UI motion language (named patterns; STYLE.md §5 says when to use each).
 * Measured in sources: nexo cuts every 2.5–4 s with 0.3–0.4 s dip-to-navy; UI overlays (brackets, meter, callout) enter AFTER the
 * person has settled (+0.4–0.8 s) with a 0.25 s pop; 6911 bubbles stack bottom-up every 0.35–0.5 s, each push-up 0.2 s;
 * 6571 camera holds still (0 % push) — motion lives in props (steam, clock, phone glow), people move ≤ 3°. */
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ease = {
  out: x => 1 - Math.pow(1 - x, 3), inOut: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  back: x => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); },
};
/* M1 POP-IN — UI element enters 0→1 over 0.3 s with overshoot (props take k). */
export const popIn = (t, at, dur = 0.3) => ease.out(seg(t, at, at + dur));
/* M2 GAZE LOCK (native move) — eyes pop in staggered, dashed lines draw to the subject, brackets snap last.
 *  returns {eyes:[k], lines:[k], brackets:k} */
export function gazeLock(t, at, n = 3, { stagger = 0.18, draw = 0.5 } = {}) {
  const eyes = [], lines = [];
  for (let i = 0; i < n; i++) { eyes.push(popIn(t, at + i * stagger)); lines.push(ease.inOut(seg(t, at + 0.2 + i * stagger, at + 0.2 + i * stagger + draw))); }
  return { eyes, lines, brackets: popIn(t, at + 0.25 + n * stagger + draw, 0.25) };
}
/* M3 GAZE RELEASE — the same lock played backwards (our reversal device): lines retract, eyes blink shut. */
export function gazeRelease(t, at, n = 3, dur = 0.9) { const r = 1 - ease.inOut(seg(t, at, at + dur));
  return { eyes: Array.from({ length: n }, (_, i) => clamp(r * 1.6 - i * 0.15)), lines: Array(n).fill(r), brackets: clamp(r * 2 - 1), blink: 1 - r }; }
/* M4 BUBBLE STACK — bubble i appears at at+i*gap; the whole stack shifts up one row per new bubble (0.2 s ease). */
export function bubbleStack(t, at, n, { gap = 0.45, row = 70 } = {}) {
  const ks = []; let lift = 0;
  for (let i = 0; i < n; i++) { const k = popIn(t, at + i * gap, 0.28); ks.push(k); if (i) lift += row * ease.out(seg(t, at + i * gap, at + i * gap + 0.2)); }
  return { ks, lift };
}
/* M5 METER RISE — fills with ease and a nervous jitter that grows with value (nexo 紧张 bar). */
export const meter = (t, at, from, to, dur = 1.2) => { const k = ease.inOut(seg(t, at, at + dur)); const v = from + (to - from) * k; return clamp(v + Math.sin(t * 23) * 0.015 * v * v); };
/* M6 LAMP ON — two flickers then steady (6911 lamp). */
export const lampOn = (t, at) => { const x = t - at; if (x < 0) return 0; if (x < 0.08) return 0.7; if (x < 0.16) return 0.1; if (x < 0.26) return 0.9; if (x < 0.32) return 0.3; return clamp(0.6 + x * 2); };
/* M7 IDLE BREATH — pills nod ≤ 1.5°, crowd sway ≤ 1° (people never freeze). */
export const breath = (t, i = 0, amp = 0.025) => amp * Math.sin(t * 1.6 + i * 1.3);
/* M8 DIP — dip-to-navy cut, returns overlay alpha. */
export const dip = (t, at, half = 0.3) => clamp(1 - Math.abs(t - at) / half);
/* M9 CLOUD DIVE — camera scales into a thought cloud until it fills frame (world→memory transition). */
export const dive = (t, at, dur = 0.9) => ease.inOut(seg(t, at, at + dur));
/* M10 COUNT-UP — numbers count from 0 with ease (stat cards). */
export const countUp = (t, at, dur = 0.9) => ease.out(seg(t, at, at + dur));
/* T1 CAPTION RISE — line fades up 14 px over 0.35 s. */
export const capRise = (t, at) => { const k = ease.out(seg(t, at, at + 0.35)); return { a: k, dy: (1 - k) * 14 }; };

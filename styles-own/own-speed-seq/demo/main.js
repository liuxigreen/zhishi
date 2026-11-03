/** main.js — own-speed-seq demo: 「切分 · 缝里的那一下」 24 s / 4 worlds.
 * W1 beige metronome (速度) → W2 waltz ballroom (3/4) → W3 disco floor (满) → W4 living-room syncopation (缝).
 * OUR IMPROVEMENT: one continuous playhead + characters flash/hit on the beat across all worlds. */
import { P, paintPaper, paintStage, vignette, grain, glowPool, chapterNum, captionBlock, chip, FONT, clamp, lerp, rgba } from './look.js';
import { puppet, crowdRow, POSES, blendPose } from './people.js';
import * as Pr from './props.js';
import { seg, ease, popIn, capRise, dip, playheadAt, beatFlash, beatIndex, metroSwing, dancePose, waltzStep } from './motion.js';

const W = 1920, H = 1080;
const ctx = document.getElementById('c').getContext('2d');
window.DUR = 24;
const BPM = 76;
let TX = [];
const push = (b, id) => { if (b && b.text != null) TX.push({ id: id || b.text, text: b.text, x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 }); };

function caption(t, at, until, parts, { size = 44, y = 120, stage = false, x = 70 } = {}) {
  if (t < at || t > until) return;
  const { a, dy } = capRise(t, at); const out = clamp((until - t) / 0.25);
  const b = captionBlock(ctx, x, y + dy, parts, { size, a: a * out, stage, align: 'left' });
  push(b, 'cap:' + parts.map(p => p.t).join(''));
}

/* ---------- W1: beige board — speed / metronome ---------- */
function world1(t) {
  paintPaper(ctx, W, H);
  chapterNum(ctx, 1, { a: popIn(t, 0.15) });
  const swing = metroSwing(t, BPM, 0.5);
  Pr.metronome(ctx, 480, 380, 260, { angle: swing, k: popIn(t, 0.3, 0.5) });
  const bpmK = popIn(t, 0.8, 0.45);
  push(Pr.bpmNum(ctx, 980, 340, BPM, { size: 240, k: bpmK }), 'bpm');
  // accent underline label
  if (bpmK > 0.5) {
    const b = chip(ctx, 1180, 520, 'BPM', { color: P.accent, size: 28, a: bpmK });
    push(b, 'chip:BPM');
  }
  caption(t, 0.5, 5.5, [{ t: '拍子来得多快，叫' }, { t: '速度', accent: true }], { y: 160 });
  const ph = playheadAt(t, BPM, 4, 4);
  const flash = beatFlash(t, BPM);
  Pr.sequencer(ctx, { y: 760, h: 320, playhead: ph, theme: 'beige', hitFlash: flash, sig: '4/4', beatN: 16 });
  grain(ctx, W, H, t, 0.025);
}

/* ---------- W2: waltz ballroom ---------- */
function world2(t) {
  paintStage(ctx, W, H, { tint: P.stageBurg, floorY: 700, glowX: 0.5, glow: 0.4, color: '#FFE0B0' });
  Pr.archWindows(ctx, 60, 380, { k: popIn(t, 6.1) });
  Pr.spotlight(ctx, 960, 700, { botW: 520, a: 0.28, t, dust: 40 });
  const flash = beatFlash(t, BPM);
  const leadPose = waltzStep(t, BPM);
  const followPose = leadPose === 'waltzL' ? 'waltzF' : (leadPose === 'swayR' ? 'swayL' : 'waltzF');
  const lead = puppet(ctx, {
    x: 860, y: 700, H: 420, pose: leadPose, skin: P.skin, shirt: '#1A1520', pants: '#0E0C0A',
    hair: 'cap', hatColor: '#0E0C0A', bowtie: true, facing: 1, hit: flash,
  });
  const follow = puppet(ctx, {
    x: 1080, y: 700, H: 410, pose: followPose, skin: P.skin, shirt: '#8A2040',
    dress: P.pink, hair: 'bob', hatColor: '#4A1830', facing: -1, hit: flash,
  });
  // joined hands (ballroom hold)
  ctx.save(); ctx.strokeStyle = rgba(P.gold, 0.7); ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(lead.handR[0], lead.handR[1]); ctx.lineTo(follow.handL[0], follow.handL[1]); ctx.stroke(); ctx.restore();

  push(chip(ctx, 200, 100, '3/4', { color: P.gold, fill: P.gold, size: 28, a: popIn(t, 6.3) }), 'sig:3/4');
  caption(t, 6.4, 11.5, [{ t: '华尔兹 · ' }, { t: '强', accent: true }, { t: '、弱、弱' }], { y: 100, stage: true, size: 42 });

  const ph = playheadAt(t, BPM, 3, 4);
  Pr.sequencer(ctx, {
    y: 760, h: 320, playhead: ph, theme: 'gold', hitFlash: flash, sig: '3/4', beatN: 12,
    pattern: [
      { icon: 'hat', color: P.gold, shape: 'dot', hits: [0, 0.25, 0.5, 0.75] },
      { icon: 'kick', color: P.goldSoft, shape: 'ring', hits: [0, 0.25, 0.5, 0.75] },
    ],
  });
  grain(ctx, W, H, t, 0.03);
}

/* ---------- W3: disco ---------- */
function world3(t) {
  paintStage(ctx, W, H, { tint: P.stagePlum, floorY: 640, glowX: 0.5, glow: 0.25, color: '#FF80C0' });
  Pr.discoFloor(ctx, 520, 740, { t, k: popIn(t, 12.1) });
  Pr.discoBall(ctx, 960, 160, 64, { t, beams: 7, k: popIn(t, 12.2) });
  const flash = beatFlash(t, BPM);
  crowdRow(ctx, { x0: 200, x1: 1720, y: 560, H: 150, n: 14, seed: 9, t, hit: flash * 0.6 });
  const colors = [P.pink, P.yellow, P.cyan, P.orange, P.purple];
  for (let i = 0; i < 5; i++) {
    const pose = dancePose(t + i * 0.1, BPM);
    puppet(ctx, {
      x: 360 + i * 280, y: 700, H: 340 + (i % 2) * 20, pose,
      skin: i % 2 ? P.skinMid : P.skin, shirt: colors[i], pants: '#F0E8DC',
      hair: 'cap', hatColor: colors[i], facing: i % 2 ? -1 : 1, hit: flash,
    });
  }
  caption(t, 12.4, 17.5, [{ t: '又亮又满，让人想' }, { t: '一直跳', accent: true }], { y: 90, stage: true, size: 42 });
  const ph = playheadAt(t, BPM, 4, 4);
  Pr.sequencer(ctx, { y: 760, h: 320, playhead: ph, theme: 'disco', hitFlash: flash, sig: '4/4', beatN: 16 });
  grain(ctx, W, H, t, 0.028);
}

/* ---------- W4: living room syncopation ---------- */
function world4(t) {
  paintPaper(ctx, W, H);
  // warm floor band
  ctx.fillStyle = '#C4A882'; ctx.fillRect(0, 640, W, 120);
  ctx.fillStyle = rgba(P.ink, 0.06); ctx.fillRect(0, 640, W, 3);
  Pr.rainbow(ctx, 160, 640, 300, { k: popIn(t, 18.2) });
  Pr.sofa(ctx, 380, 640, 300, { k: popIn(t, 18.3) });
  Pr.domeLamp(ctx, 620, 640, 220, { on: 1 });
  Pr.turntable(ctx, 1580, 610, 130, { spin: t * 2.2, k: popIn(t, 18.4) });
  Pr.lavaLamp(ctx, 1750, 640, 150, { t, k: popIn(t, 18.5) });

  const flash = beatFlash(t, BPM);
  // three fedora dancers — clear center stage, no prop overlap
  const hats = ['#F0E8D0', P.gold, P.orange];
  const shirts = [P.orange, '#6A7A40', P.gold];
  for (let i = 0; i < 3; i++) {
    const pose = dancePose(t + i * 0.15, BPM, 'hatTip', 'swayR');
    puppet(ctx, {
      x: 900 + i * 170, y: 640, H: 380, pose, skin: P.skinDark, shirt: shirts[i], pants: '#2A2018',
      hair: 'fedora', hatColor: hats[i], suspenders: true, facing: i === 1 ? -1 : 1, hit: flash,
    });
  }
  // guitar held near left dancer (hand height), not overlapping torso
  Pr.guitar(ctx, 820, 500, 130, { angle: -0.85, color: '#C06030', k: popIn(t, 18.6) });

  caption(t, 18.5, 23.6, [{ t: '好听的，往往在' }, { t: '缝里', accent: true }], { y: 100, size: 44 });

  const ph = playheadAt(t, BPM, 4, 4);
  const seq = Pr.sequencer(ctx, {
    y: 760, h: 320, playhead: ph, theme: 'dark', hitFlash: flash, sig: '4/4', beatN: 16,
    pattern: [
      { icon: 'hat', color: P.seqBeige, shape: 'dash', hits: [0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375] },
      { icon: 'guitar', color: P.orange, shape: 'bar', hits: [0.1875, 0.4375, 0.6875, 0.9375] }, // off-beat cuts
      { icon: 'kick', color: P.accent, shape: 'ring', hits: [0, 0.25, 0.5, 0.75] },
    ],
  });
  // OUR PROP: gap bracket highlighting a syncopated guitar hit
  const gapK = popIn(t, 19.8, 0.5);
  if (gapK > 0 && seq) {
    const gx0 = seq.innerX + 0.125 * seq.innerW;
    const gx1 = seq.innerX + 0.1875 * seq.innerW;
    push(Pr.gapBracket(ctx, gx0, gx1, 790, { label: '缝', k: gapK }), 'gap');
  }
  grain(ctx, W, H, t, 0.03);
}

/* ---------- render ---------- */
function render(t) {
  TX = [];
  const d1 = dip(t, 5.7, 0.55), d2 = dip(t, 11.7, 0.55), d3 = dip(t, 17.7, 0.55);
  if (t < 6.0) world1(t);
  else if (t < 12.0) world2(t);
  else if (t < 18.0) world3(t);
  else world4(t);
  // dip overlays
  [[d1, 5.7], [d2, 11.7], [d3, 17.7]].forEach(([d, at]) => {
    if (d > 0) {
      ctx.save(); ctx.globalAlpha = d * 0.92;
      // next world peeks under dip
      if (at < 6) { /* toward stage */ ctx.fillStyle = P.stageBurg; }
      else if (at < 12) ctx.fillStyle = P.stagePlum;
      else ctx.fillStyle = P.paper;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  });
  window.TEXTS = () => TX.slice();
}
window.render = render;
document.fonts.ready.then(() => { window.render(0); window.READY = true; });

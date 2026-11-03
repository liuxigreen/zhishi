// style-lowpoly: 低多边形 3D — real three.js scene, flat-shaded facets, soft spot shadows, fog, fake DOF
import * as THREE from '/vendor/three.module.js';
import { grain, vignette, SLIPS, rng } from '../../core/util.js';
export const meta = { name: 'lowpoly', zh: '低多边形3D' };

const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: .75, metalness: 0, ...o });
function mesh(geo, mat, p = [0, 0, 0], r = [0, 0, 0], s = [1, 1, 1]) { const m = new THREE.Mesh(geo, mat); m.position.set(...p); m.rotation.set(...r); m.scale.set(...s); m.castShadow = m.receiveShadow = true; return m; }
function limb(a, b, rad, mat) { // cylinder from point a to b
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b), len = va.distanceTo(vb);
  const m = mesh(new THREE.CylinderGeometry(rad, rad * .9, len, 7), mat); m.position.copy(va).add(vb).multiplyScalar(.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize()); return m; }
function slipTex(txt, tint) { const c = document.createElement('canvas'); c.width = 512; c.height = 170; const x = c.getContext('2d');
  x.fillStyle = tint; x.fillRect(0, 0, 512, 170); x.strokeStyle = 'rgba(120,80,40,.25)'; x.lineWidth = 6; x.strokeRect(8, 8, 496, 154);
  x.fillStyle = '#3a1d10'; x.font = `${Math.min(96, 440 / txt.length)}px Brush`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 256, 92);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }

export async function render(c, { W, H, seed }) {
  const r = rng(seed);
  const gl = document.createElement('canvas'); gl.width = W; gl.height = H;
  const R = new THREE.WebGLRenderer({ canvas: gl, antialias: true, preserveDrawingBuffer: true });
  R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.15; R.outputColorSpace = THREE.SRGBColorSpace;
  const S = new THREE.Scene(); S.background = new THREE.Color('#1b2233'); S.fog = new THREE.Fog('#1b2233', 7, 15);
  const cam = new THREE.PerspectiveCamera(42, W / H, .1, 50); cam.position.set(-.35, 3.5, 6.3); cam.lookAt(.1, 1.5, 0);
  // room
  S.add(mesh(new THREE.PlaneGeometry(14, 14), M('#5b3a2a'), [0, 0, 0], [-Math.PI / 2, 0, 0]));
  for (let i = -6; i < 7; i++) S.add(mesh(new THREE.BoxGeometry(.04, .01, 14), M('#3e271c'), [i * .5, .005, 0]));
  S.add(mesh(new THREE.BoxGeometry(14, 7, .2), M('#34505a'), [0, 3.5, -2.6]));
  S.add(mesh(new THREE.BoxGeometry(14, .5, .25), M('#e7d6b4'), [0, .25, -2.45]));
  const win = new THREE.Group(); win.position.set(0, 3.0, -2.45); S.add(win);
  win.add(mesh(new THREE.PlaneGeometry(3.2, 2.0), new THREE.MeshBasicMaterial({ color: '#2a4f7a' }), [0, 0, .02]));
  win.add(mesh(new THREE.CircleGeometry(.22, 10), new THREE.MeshBasicMaterial({ color: '#fbefc8' }), [.9, .5, .04]));
  for (let i = 0; i < 9; i++) { const h = .4 + r() * .7; win.add(mesh(new THREE.BoxGeometry(.3, h, .05), new THREE.MeshBasicMaterial({ color: '#182a40' }), [-1.45 + i * .36, -1 + h / 2, .05])); }
  [[0, 1.05, 3.4, .1], [0, -1.05, 3.4, .1], [-1.65, 0, .1, 2.2], [1.65, 0, .1, 2.2], [0, 0, .08, 2.1]].forEach(([x, y, w, h]) => win.add(mesh(new THREE.BoxGeometry(w, h, .12), M('#efe2c6'), [x, y, .08])));
  // shelf with props on wall
  S.add(mesh(new THREE.BoxGeometry(1.2, .06, .3), M('#7a4b30'), [-2.3, 2.4, -2.35]));
  S.add(mesh(new THREE.CylinderGeometry(.1, .14, .35, 6), M('#c94f3a'), [-2.6, 2.6, -2.35])); S.add(mesh(new THREE.IcosahedronGeometry(.16, 0), M('#3e8a5a'), [-2.1, 2.6, -2.35]));
  // table
  const wood = M('#8c5a36'), cloth = M('#efe6d2');
  S.add(mesh(new THREE.BoxGeometry(3.0, .1, 1.5), wood, [0, 1.0, 0]));
  S.add(mesh(new THREE.BoxGeometry(3.06, .02, 1.56), cloth, [0, 1.06, 0]));
  S.add(mesh(new THREE.BoxGeometry(3.06, .32, .02), M('#c84b3a'), [0, .9, .79]));
  [[-1.35, -.6], [1.35, -.6], [-1.35, .6], [1.35, .6]].forEach(([x, z]) => S.add(mesh(new THREE.CylinderGeometry(.05, .04, 1, 6), wood, [x, .5, z])));
  // props on table: bowls, cup, bottle, chopsticks
  S.add(mesh(new THREE.SphereGeometry(.2, 8, 4, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M('#3f7c8c', { side: THREE.DoubleSide }), [1.1, 1.27, .35], [Math.PI, 0, 0]));
  S.add(mesh(new THREE.CylinderGeometry(.08, .07, .2, 7), M('#e8e2d6'), [-.95, 1.17, .35]));
  S.add(mesh(new THREE.CylinderGeometry(.09, .1, .5, 7), M('#2d5a3a', { roughness: .3 }), [1.25, 1.32, -.35])); S.add(mesh(new THREE.CylinderGeometry(.035, .04, .2, 6), M('#2d5a3a'), [1.25, 1.66, -.35]));
  S.add(mesh(new THREE.BoxGeometry(.5, .015, .015), M('#d9b26a'), [.6, 1.08, .4], [0, .4, 0])); S.add(mesh(new THREE.BoxGeometry(.5, .015, .015), M('#d9b26a'), [.6, 1.08, .44], [0, .35, 0]));
  // broken plate shards
  const porc = M('#f7f3ea', { roughness: .25 }), blue = M('#2f5e9e', { roughness: .3 });
  for (let i = 0; i < 8; i++) { const th = r() * 6.28, len = .6 + r() * .8; const g = new THREE.CylinderGeometry(.42, .38, .05, 5, 1, false, th, len);
    const sh = mesh(g, i % 4 ? porc : blue, [.25 + (r() - .5) * 1.0, 1.1, .3 + (r() - .5) * .5], [(r() - .5) * .5, r() * 6, (r() - .5) * .5]); S.add(sh); }
  // chairs
  const chair = (x, rotY) => { const g = new THREE.Group(); const w = M('#6b3f27');
    g.add(mesh(new THREE.BoxGeometry(.6, .06, .6), w, [0, .6, 0])); g.add(mesh(new THREE.BoxGeometry(.06, .9, .6), w, [.3, 1.05, 0]));
    [[-.25, -.25], [.25, -.25], [-.25, .25], [.25, .25]].forEach(([a, b]) => g.add(mesh(new THREE.BoxGeometry(.05, .6, .05), w, [a, .3, b]))); return g; };
  { const ch = chair(0, 0); ch.position.set(.95, 0, -.95); ch.rotation.y = .82; S.add(ch); }
  // person B: seated right, facing -x, arms crossed
  const skin = M('#f0c2a0'), mustard = M('#d99a2a'), hairM = M('#2b1d18');
  const B = new THREE.Group(); B.position.set(.75, .2, -.75); B.rotation.y = .82; S.add(B);
  B.add(mesh(new THREE.CylinderGeometry(.3, .38, .85, 7), mustard, [0, 1.12, 0]));
  B.add(mesh(new THREE.IcosahedronGeometry(.26, 1), skin, [-.02, 1.82, 0], [0, 0, 0], [1, 1.12, 1]));
  B.add(mesh(new THREE.ConeGeometry(.05, .12, 4), skin, [-.28, 1.8, 0], [0, 0, Math.PI / 2]));
  B.add(mesh(new THREE.IcosahedronGeometry(.27, 1), hairM, [.04, 1.92, 0], [0, 0, 0], [1, .8, 1.05]));
  B.add(mesh(new THREE.IcosahedronGeometry(.12, 0), hairM, [.2, 2.12, 0]));
  B.add(mesh(new THREE.BoxGeometry(.04, .02, .14), hairM, [-.25, 1.88, 0], [0, 0, -.35])); // angry brow
  B.add(mesh(new THREE.CylinderGeometry(.1, .12, .2, 6), skin, [0, 1.6, 0]));
  B.add(limb([-.12, 1.4, .36], [-.36, 1.25, -.25], .09, M('#c4871f'))); B.add(limb([-.12, 1.3, -.36], [-.36, 1.35, .25], .09, M('#b47a18')));
  B.add(limb([0, 1.45, .34], [-.12, 1.4, .36], .1, mustard)); B.add(limb([0, 1.45, -.34], [-.12, 1.3, -.36], .1, mustard));
  B.add(limb([-.1, .7, .15], [-.55, .7, .15], .13, M('#2c3550'))); B.add(limb([-.1, .7, -.15], [-.55, .7, -.15], .13, M('#2c3550')));
  // person A: standing left, bowed toward B, palms together
  const shirt = M('#8db7d1'), pants = M('#2c3550');
  const A = new THREE.Group(); A.position.set(-1.05, 0, 1.05); A.rotation.y = .82; S.add(A);
  A.add(limb([0, 0, .12], [0, .95, .12], .12, pants)); A.add(limb([0, 0, -.12], [0, .95, -.12], .12, pants));
  const up = new THREE.Group(); up.position.set(0, .95, 0); up.rotation.z = -.62; A.add(up);
  up.add(mesh(new THREE.CylinderGeometry(.33, .27, .85, 7), shirt, [0, .43, 0]));
  up.add(mesh(new THREE.CylinderGeometry(.1, .12, .2, 6), skin, [0, .95, 0]));
  const head = new THREE.Group(); head.position.set(.02, 1.18, 0); head.rotation.z = -.35; up.add(head);
  head.add(mesh(new THREE.IcosahedronGeometry(.25, 1), skin, [0, 0, 0], [0, 0, 0], [1, 1.12, 1]));
  head.add(mesh(new THREE.IcosahedronGeometry(.26, 1), M('#3a2418'), [-.05, .1, 0], [0, 0, 0], [.95, .7, 1.03]));
  head.add(mesh(new THREE.ConeGeometry(.045, .11, 4), skin, [.27, -.02, 0], [0, 0, -Math.PI / 2]));
  head.add(mesh(new THREE.OctahedronGeometry(.04, 0), M('#bfe6ff', { roughness: .1, emissive: '#335566' }), [.12, .2, .2]));
  // arms to pressed palms in front of face
  const handP = [.62, 1.12, 0];
  up.add(limb([0, .78, .3], [.35, .55, .22], .085, shirt)); up.add(limb([.35, .55, .22], handP.map((v, i) => i === 2 ? .04 : v), .075, shirt));
  up.add(limb([0, .78, -.3], [.35, .55, -.22], .085, shirt)); up.add(limb([.35, .55, -.22], handP.map((v, i) => i === 2 ? -.04 : v), .075, shirt));
  up.add(mesh(new THREE.BoxGeometry(.08, .22, .1), skin, [.66, 1.22, 0], [0, 0, -.2]));
  // excuse slips: textured planes on table (pile) + floating
  const tints = ['#fff4d6', '#fde6c0', '#ffeede', '#fdf0c8'];
  const slip = (txt, p, rot, s = 1) => { const tx = slipTex(txt, tints[(r() * 4) | 0]); const m = mesh(new THREE.PlaneGeometry(.66 * s, .22 * s), new THREE.MeshStandardMaterial({ map: tx, side: THREE.DoubleSide, roughness: .9, emissive: '#ffffff', emissiveIntensity: .35, emissiveMap: tx }), p, rot); S.add(m); };
  for (let i = 0; i < 6; i++) slip(SLIPS[i], [-.35 + (r() - .5) * .35, 1.08 + i * .014, .35 + (r() - .5) * .3], [-Math.PI / 2, 0, (r() - .5) * .8], .95);
  slip(SLIPS[6], [.0, 2.3, .55], [-.4, .3, .22]); slip(SLIPS[7], [-.5, 2.85, .3], [-.3, -.2, -.15]); slip('我也很难', [1.0, 2.95, .1], [-.2, .2, .12], .9); slip('是你先凶的', [.45, 1.5, 1.25], [-.7, -.4, -.1], .85);
  // lamp + lights
  S.add(limb([0, 6, 0], [0, 3.45, 0], .015, M('#222')));
  S.add(mesh(new THREE.ConeGeometry(.45, .4, 8, 1, true), M('#c2452f', { side: THREE.DoubleSide }), [0, 3.3, 0]));
  const bulb = mesh(new THREE.IcosahedronGeometry(.11, 1), new THREE.MeshBasicMaterial({ color: '#fff3d0' }), [0, 3.15, 0]); bulb.castShadow = false; S.add(bulb);
  const spot = new THREE.SpotLight('#ffd49a', 60, 12, .75, .55, 1.6); spot.position.set(0, 3.12, 0); spot.target.position.set(0, 1, 0);
  spot.castShadow = true; spot.shadow.mapSize.set(2048, 2048); spot.shadow.radius = 6; spot.shadow.bias = -.0005; S.add(spot, spot.target);
  const pl = new THREE.PointLight('#ffcf8a', 4, 4, 2); pl.position.set(0, 3.0, 0); S.add(pl);
  S.add(new THREE.HemisphereLight('#6d86b8', '#2a1a12', .9));
  const rim = new THREE.DirectionalLight('#8fb4ff', 1.6); rim.position.set(-2, 4, -5); S.add(rim);
  R.render(S, cam);
  // composite + fake DOF (blur far bg band + near floor), vignette, grain
  const ctx = c.getContext('2d'); ctx.drawImage(gl, 0, 0);
  const blur = (y0, y1, px, fadeTop) => { ctx.save(); const g = ctx.createLinearGradient(0, y0, 0, y1); const m = document.createElement('canvas'); m.width = W; m.height = H; const mx = m.getContext('2d');
    mx.filter = `blur(${px}px)`; mx.drawImage(gl, 0, 0); mx.filter = 'none'; mx.globalCompositeOperation = 'destination-in'; g.addColorStop(0, fadeTop ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0)'); g.addColorStop(1, fadeTop ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,1)'); mx.fillStyle = g; mx.fillRect(0, y0, W, y1 - y0); if (fadeTop) mx.fillRect(0, 0, W, 0); ctx.drawImage(m, 0, 0); ctx.restore(); };
  blur(0, 520, 6, true); blur(1600, H, 8, false);
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const gg = ctx.createRadialGradient(540, 560, 10, 540, 560, 420); gg.addColorStop(0, 'rgba(255,220,160,.35)'); gg.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H); ctx.restore();
  vignette(ctx, W, H, .55); grain(ctx, W, H, .03, seed);
}

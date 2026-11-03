import puppeteer from 'puppeteer-core';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [preset, outDir, nw = '4', only] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const srv = createServer((q, r) => { const p = decodeURIComponent(q.url.split('?')[0]);
  try { const d = readFileSync(join(ROOT, p)); r.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' }); r.end(d); } catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r)); const port = srv.address().port;
const launch = () => puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', protocolTimeout: 900000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'], defaultViewport: { width: 1920, height: 1080 } });
const b = await launch();
const p0 = await b.newPage(); await p0.goto(`http://127.0.0.1:${port}/core/util.js`);
const shots = await p0.evaluate(async pr => { const m = await import(`/presets/${pr}/film.js`); return m.SHOTS.map(s => ({ id: s.id, t0: s.t0, t1: s.t1 })); }, preset); await p0.close();
const jobs = shots.map((s, i) => ({ ...s, i })).filter(s => only === undefined || String(s.i) === only);
const log = [];
async function run(job, bb) { const pg = await bb.newPage(); pg.on('pageerror', e => console.error('[pageerror]', job.id, String(e))); pg.on('console', m => { if (m.type() === 'error') console.error('[page]', job.id, m.text()); });
  const t0 = Date.now(); await pg.goto(`http://127.0.0.1:${port}/tools/film-land.html?preset=${preset}&shot=${job.i}`);
  await pg.waitForFunction('window.__done', { timeout: 900000 }); const st = await pg.evaluate('window.__done'); if (st !== 'ok') throw new Error(job.id + ' ' + st);
  const bms = await pg.evaluate('window.BUILD_MS'); const f0 = Math.round(job.t0 * 30), f1 = Math.round(job.t1 * 30);
  const list = process.env.AT ? process.env.AT.split(',').map(a => f0 + Math.floor((f1 - f0) * +a)) : process.env.MIDONLY ? [Math.floor((f0 + f1) / 2)] : Array.from({ length: f1 - f0 }, (_, k) => f0 + k);
  for (const f of list) { const url = await pg.evaluate(f => window.frame(f), f); writeFileSync(join(outDir, `f${String(f).padStart(5, '0')}.jpg`), Buffer.from(url.split(',')[1], 'base64')); }
  const cl = await pg.evaluate('window.__CAPLOG||[]'); writeFileSync(join(outDir, `caplog-${job.id}.json`), JSON.stringify(cl));
  const ms = Date.now() - t0; log.push({ id: job.id, frames: f1 - f0, build_ms: Math.round(bms), total_ms: ms }); console.log(preset, job.id, 'frames', list.length, 'build', Math.round(bms), 'total', ms); await pg.close(); }
const q = [...jobs]; await Promise.all(Array.from({ length: +nw }, async () => { const bb = await launch(); while (q.length) await run(q.shift(), bb); await bb.close(); }));
writeFileSync(join(outDir, 'render-log.json'), JSON.stringify({ preset, shots, log }, null, 2));
await b.close(); srv.close();

// usage: node tools/still.mjs <preset> <out.jpg> [t] [beat=hook|mid|reverse]
import puppeteer from 'puppeteer-core';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [preset, out, t = '0', beat = 'hook'] = process.argv.slice(2);
const MIME = { '.html':'text/html', '.js':'text/javascript', '.ttf':'font/ttf', '.otf':'font/otf' };
const srv = createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]);
  try { const d = readFileSync(join(ROOT, p)); r.writeHead(200, {'Content-Type': MIME[extname(p)]||'application/octet-stream'}); r.end(d); }
  catch { r.writeHead(404); r.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new',
  args: ['--no-sandbox','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--force-color-profile=srgb'],
  defaultViewport: { width: 1080, height: 1920 } });
const pg = await b.newPage();
pg.on('console', m => console.log('[page]', m.text()));
pg.on('pageerror', e => console.error('[pageerror]', String(e)));
const t0 = Date.now();
await pg.goto(`http://127.0.0.1:${srv.address().port}/tools/still.html?preset=${preset}&t=${t}&beat=${beat}`);
await pg.waitForFunction('window.__done', { timeout: 300000 });
const st = await pg.evaluate('window.__done');
if (st !== 'ok') { console.error(st); process.exit(1); }
const el = await pg.$('#c');
await el.screenshot({ path: out, type: 'jpeg', quality: 92 });
console.log(preset, 'ms', Date.now() - t0, '->', out);
await b.close(); srv.close();

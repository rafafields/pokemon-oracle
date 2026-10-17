// Genera los sprites de entrenador con la API de imágenes de OpenAI (solo texto, sin imágenes de referencia).
// Uso: node --env-file=.env scripts/generate_sprites.mjs [--keys a,b] [--n 2] [--concurrency 4] [--size 128] [--only-process]
//   --keys          claves de clase (por defecto, todas las de data/trainer_calib.json)
//   --n             candidatas por clase
//   --only-process  no llama a la API: vuelve a procesar las imágenes originales ya descargadas (sprites/raw/)
// Originales (1024 px) en sprites/raw/ (no se suben a git); sprites procesados en sprites/trainers/<clase>-<n>.png.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PROMPTS, check, fileOf, promptOf } from '../sprites/prompts.mjs';

const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i < 0 ? def : (process.argv[i + 1]?.startsWith('--') || process.argv[i + 1] === undefined ? true : process.argv[i + 1]); };
const SIZE = +arg('size', 128), N = +arg('n', 2), CONC = +arg('concurrency', 4), ONLY = arg('only-process', false) === true;
const CHAR_H = Math.round(SIZE * 0.78), BOTTOM = Math.round(SIZE * 0.92), MAX_W = SIZE - 12; // el personaje, sin partículas, mide siempre lo mismo
const MODEL = process.env.IMG_MODEL || 'gpt-image-1';
const dir = p => fileURLToPath(new URL('../sprites/' + p, import.meta.url));
fs.mkdirSync(dir('raw/'), { recursive: true });
fs.mkdirSync(dir('trainers/'), { recursive: true });

const calib = JSON.parse(fs.readFileSync(new URL('../data/trainer_calib.json', import.meta.url), 'utf8'));
const allKeys = Object.keys(calib.freq);
check(allKeys);
const keys = arg('keys', true) === true ? allKeys : String(arg('keys')).split(',');
for (const k of keys) if (!PROMPTS[k]) throw new Error('Clase desconocida: ' + k);

// Caja del personaje: la mayor mancha conectada de píxeles opacos (las partículas sueltas quedan fuera).
async function characterBox(raw) {
  const S = 256, k = 1024 / S;
  const a = await sharp(raw).resize(S, S, { fit: 'fill' }).ensureAlpha().extractChannel(3).raw().toBuffer();
  const on = new Uint8Array(S * S); for (let i = 0; i < a.length; i++) on[i] = a[i] > 40 ? 1 : 0;
  // dilatación de 3 px para unir accesorios con el cuerpo sin pegar las partículas lejanas
  const R = 3, dil = new Uint8Array(S * S);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (on[y * S + x]) for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && yy < S && xx >= 0 && xx < S) dil[yy * S + xx] = 1; }
  const seen = new Uint8Array(S * S); let best = null;
  for (let s0 = 0; s0 < S * S; s0++) {
    if (!dil[s0] || seen[s0]) continue;
    const st = [s0]; seen[s0] = 1; let area = 0, x0 = S, y0 = S, x1 = 0, y1 = 0;
    while (st.length) {
      const p = st.pop(), x = p % S, y = (p / S) | 0; if (on[p]) { area++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      for (const q of [p - 1, p + 1, p - S, p + S]) { if (q < 0 || q >= S * S || !dil[q] || seen[q]) continue; if ((q === p - 1 && x === 0) || (q === p + 1 && x === S - 1)) continue; seen[q] = 1; st.push(q); }
    }
    if (!best || area > best.area) best = { area, x0, y0, x1, y1 };
  }
  if (!best) throw new Error('imagen vacía');
  return { left: best.x0 * k, right: (best.x1 + 1) * k, top: best.y0 * k, bottom: (best.y1 + 1) * k };
}

// Misma altura de personaje en todos los sprites; borde duro (alfa binario) y paleta limitada.
async function toSprite(raw) {
  const b = await characterBox(raw);
  const w = b.right - b.left, h = b.bottom - b.top;
  const s = Math.min(CHAR_H / h, MAX_W / w);
  const n = Math.max(8, Math.round(1024 * s)), pad = SIZE * 2;
  const resized = await sharp(raw).resize(n, n, { kernel: 'lanczos3' }).ensureAlpha().png().toBuffer();
  const cx = ((b.left + b.right) / 2) * (n / 1024), by = b.bottom * (n / 1024);
  const ox = Math.round(cx - SIZE / 2), oy = Math.round(by - BOTTOM);
  // sharp ejecuta extract antes que extend: se hace en dos pasos
  const padded = await sharp(resized).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const win = await sharp(padded).extract({ left: ox + pad, top: oy + pad, width: SIZE, height: SIZE }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < win.data.length; i += 4) win.data[i] = win.data[i] >= 128 ? 255 : 0;
  return sharp(win.data, { raw: { width: SIZE, height: SIZE, channels: 4 } }).png({ palette: true, colours: 32, dither: 0 }).toBuffer();
}

async function callApi(prompt, tries = 5) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Falta OPENAI_API_KEY (usa --env-file=.env)');
  for (let t = 1; ; t++) {
    const r = await fetch('https://api.openai.com/v1/images/generations', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: MODEL, prompt, size: '1024x1024', n: 1, quality: 'medium', background: 'transparent', output_format: 'png' }) });
    const j = await r.json().catch(() => ({}));
    if (!j.error) return Buffer.from(j.data[0].b64_json, 'base64');
    const msg = String(j.error.message).replace(/sk-[A-Za-z0-9_-]+/g, 'sk-***');
    if (t >= tries || ![429, 500, 502, 503].includes(r.status)) throw new Error(`${r.status} ${j.error.code}: ${msg}`);
    await new Promise(res => setTimeout(res, 2000 * 2 ** t));
  }
}

const jobs = [];
for (const k of keys) for (let i = 1; i <= N; i++) jobs.push({ k, i, name: `${fileOf(k)}-${i}` });
let done = 0, failed = [], called = 0, usedTokens = 0;
async function worker() {
  for (let job; (job = jobs.shift());) {
    const rawPath = dir(`raw/${job.name}.png`);
    try {
      let raw;
      if (fs.existsSync(rawPath)) raw = fs.readFileSync(rawPath);
      else if (ONLY) throw new Error('sin original');
      else { raw = await callApi(promptOf(job.k)); fs.writeFileSync(rawPath, raw); called++; }
      fs.writeFileSync(dir(`trainers/${job.name}.png`), await toSprite(raw));
    } catch (e) { failed.push(`${job.name}: ${e.message}`); }
    done++; if (done % 10 === 0) console.log(`${done} hechas, ${called} llamadas a la API, ${failed.length} fallos`);
  }
}
const total = jobs.length;
await Promise.all(Array.from({ length: CONC }, worker));
console.log(`Terminado: ${total} sprites, ${called} llamadas nuevas a la API, ${failed.length} fallos.`);
if (failed.length) console.log('Fallos:\n' + failed.join('\n'));

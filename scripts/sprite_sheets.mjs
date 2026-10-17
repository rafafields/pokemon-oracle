// Hojas de contacto para elegir entre las candidatas de cada clase: sprites/review/hoja-N.png (no se suben a git).
// Uso: node scripts/sprite_sheets.mjs
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const dir = p => fileURLToPath(new URL('../sprites/' + p, import.meta.url));
const R = JSON.parse(fs.readFileSync(new URL('../data/trainers.json', import.meta.url), 'utf8'));
const calib = JSON.parse(fs.readFileSync(new URL('../data/trainer_calib.json', import.meta.url), 'utf8'));
const T = JSON.parse(fs.readFileSync(new URL('../data/trainer_texts.json', import.meta.url), 'utf8'));
fs.mkdirSync(dir('review/'), { recursive: true });

// nombre legible de cada clase, para el rótulo
const nameOf = key => {
  const [g, a, b] = key.split(':');
  if (g === 'type') return R.byType[a][b]; if (g === 'gym') return 'Líder ' + R.typesEs[a]; if (g === 'elite') return 'Alto Mando ' + R.typesEs[a];
  if (g === 'rail') return R.rails.find(r => r.id === a).es; if (g === 'band') return R.bands.find(x => x.id === a).es;
  if (g === 'rocket') return R.rocket.names[a]; return R.champion;
};
const order = Object.keys(calib.freq).sort((x, y) => x.localeCompare(y));
const Z = 2, S = 128 * Z, PER = 12, COLS = 3, CW = S * 2 + 30, CH = S + 54;
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const bg = (w, h) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><pattern id="p" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#8a8a96"/><rect width="16" height="16" fill="#6d6d79"/><rect x="16" y="16" width="16" height="16" fill="#6d6d79"/></pattern></defs><rect width="${w}" height="${h}" fill="#150d24"/><rect x="0" y="0" width="${w}" height="${h}" fill="none"/></svg>`);
let sheet = 0;
for (let s0 = 0; s0 < order.length; s0 += PER) {
  const keys = order.slice(s0, s0 + PER), rows = Math.ceil(keys.length / COLS);
  const comps = [];
  for (let i = 0; i < keys.length; i++) {
    const x = (i % COLS) * CW, y = Math.floor(i / COLS) * CH, name = keys[i].replace(/:/g, '-');
    for (const n of [1, 2]) {
      const f = dir(`trainers/${name}-${n}.png`);
      if (!fs.existsSync(f)) continue;
      const left = x + 10 + (n - 1) * (S + 10);
      comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><defs><pattern id="p" width="32" height="32" patternUnits="userSpaceOnUse"><rect width="32" height="32" fill="#8a8a96"/><rect width="16" height="16" fill="#6d6d79"/><rect x="16" y="16" width="16" height="16" fill="#6d6d79"/></pattern></defs><rect width="${S}" height="${S}" fill="url(#p)"/></svg>`), left, top: y + 4 });
      comps.push({ input: await sharp(f).resize({ width: S, height: S, kernel: 'nearest' }).toBuffer(), left, top: y + 4 });
    }
    comps.push({ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="40"><text x="12" y="26" font-family="Arial, sans-serif" font-size="20" fill="#e5def8">${esc(nameOf(keys[i]))}  ·  ${esc(keys[i])}</text></svg>`), left: x, top: y + S + 8 });
  }
  await sharp({ create: { width: CW * COLS, height: CH * rows, channels: 3, background: '#150d24' } }).composite(comps).png().toFile(dir(`review/hoja-${++sheet}.png`));
}
console.log(sheet + ' hojas en sprites/review/');

// Copia a web/trainers/<clase>.png la candidata elegida de cada clase (sprites/selection.json).
// Las clases con null (pendientes) no se copian: la web muestra su icono hasta que haya sprite.
// Uso: node scripts/publish_sprites.mjs
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const dir = p => fileURLToPath(new URL('../' + p, import.meta.url));
const sel = JSON.parse(fs.readFileSync(dir('sprites/selection.json'), 'utf8'));
const calib = JSON.parse(fs.readFileSync(dir('data/trainer_calib.json'), 'utf8'));
fs.rmSync(dir('web/trainers'), { recursive: true, force: true });
fs.mkdirSync(dir('web/trainers'), { recursive: true });
let copied = 0; const pending = [];
for (const key of Object.keys(calib.freq)) {
  const n = sel[key], file = key.replace(/:/g, '-');
  if (!n) { pending.push(key); continue; }
  fs.copyFileSync(dir(`sprites/trainers/${file}-${n}.png`), dir(`web/trainers/${file}.png`)); copied++;
}
console.log(`${copied} sprites copiados a web/trainers/` + (pending.length ? `; pendientes (${pending.length}): ${pending.join(', ')}` : ''));

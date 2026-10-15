// Genera web/index.html (un solo archivo con datos y motor incrustados, se abre con doble clic).
// Uso: node scripts/build_web.mjs
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const data = {
  axes: JSON.parse(read('data/axes.json')),
  pokemon: JSON.parse(read('data/pokemon.json')),
  catalog: JSON.parse(read('data/catalog.json')),
  tensions: JSON.parse(read('data/tensions.json')),
  poles: JSON.parse(read('data/poles.json')),
  en: JSON.parse(read('data/en.json')),
};
// Imagen de fondo del hero (opcional): web/hero.webp|jpg|jpeg|png se incrusta como data URI para mantener un único archivo.
let hero = '';
for (const ext of ['webp', 'jpg', 'jpeg', 'png']) {
  const f = new URL(`web/hero.${ext}`, root);
  if (existsSync(f)) {
    const buf = readFileSync(f);
    if (buf.length > 400 * 1024) console.warn(`Aviso: hero.${ext} pesa ${(buf.length / 1024).toFixed(0)} KB; conviene comprimirla por debajo de 400 KB.`);
    hero = `--hero-img: url(data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${buf.toString('base64')});`;
    break;
  }
}
const html = read('web/template.html')
  .replace('/*HERO*/', () => `:root { ${hero} }`)
  .replace('/*ICONS*/', () => read('web/icons.json').trim())
  .replace('/*ENGINE*/', () => read('src/engine.js'))
  .replace('/*DATA*/', () => 'const DATA = ' + JSON.stringify(data).replace(/</g, '\\u003c') + ';');
writeFileSync(new URL('web/index.html', root), html);
console.log('web/index.html', (html.length / 1024).toFixed(0) + ' KB');

// Genera web/index.html (un solo archivo con datos y motor incrustados, se abre con doble clic).
// Uso: node scripts/build_web.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const data = {
  axes: JSON.parse(read('data/axes.json')),
  pokemon: JSON.parse(read('data/pokemon.json')),
  catalog: JSON.parse(read('data/catalog.json')),
  tensions: JSON.parse(read('data/tensions.json')),
};
const html = read('web/template.html')
  .replace('/*ENGINE*/', () => read('src/engine.js'))
  .replace('/*DATA*/', () => 'const DATA = ' + JSON.stringify(data).replace(/</g, '\\u003c') + ';');
writeFileSync(new URL('web/index.html', root), html);
console.log('web/index.html', (html.length / 1024).toFixed(0) + ' KB');

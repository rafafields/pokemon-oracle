// Prueba una selección: node sim/try.mjs [tipo=Pokémon ...] [--seed N]
// Los tipos sin indicar se eligen al azar. Ejemplo: node sim/try.mjs fuego=Charizard volador=Charizard dragon=Dragonite
import { readFileSync } from 'node:fs';
import { buildModel, computeResult, archetypeText } from '../src/engine.js';

const load = f => JSON.parse(readFileSync(new URL('../data/' + f, import.meta.url), 'utf8'));
const axes = load('axes.json'), catalog = load('catalog.json');
const model = buildModel(axes, load('pokemon.json'), catalog, load('tensions.json'));
const args = process.argv.slice(2);
let seed = 1;
const sel = {};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--seed') { seed = +args[++i]; continue; }
  const [k, v] = args[i].split('=');
  sel[k] = v;
}
if (!args.includes('--seed') && Object.keys(sel).length < 15) seed = Math.floor(Math.random() * 1e9);
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
for (const t of model.order) {
  if (!sel[t]) { const l = model.lists[t]; sel[t] = l[Math.floor(rnd() * l.length)].name; }
  else if (!model.lists[t].some(p => p.name === sel[t])) { console.error(`${sel[t]} no está en la lista de ${t}. Opciones: ${model.lists[t].map(p => p.name).join(', ')}`); process.exit(1); }
}
const r = computeResult(model, sel);
const ax = Object.fromEntries(axes.map(a => [a.type, a]));
const poleName = ([t, s]) => ax[t][s];

console.log('SELECCIÓN');
for (const t of model.order) console.log(`  ${ax[t].typeName.padEnd(9)} ${sel[t]}`);
console.log('\nPERFIL (0 = polo bajo, 10 = polo alto)');
for (const t of r.ranked) console.log(`  ${ax[t].name.padEnd(14)} ${r.profile[t].toFixed(1).padStart(4)}  ${'█'.repeat(Math.round(r.profile[t]))}  (${ax[t].low} ↔ ${ax[t].high})`);
console.log('\nARQUETIPO');
const at = archetypeText(load('poles.json'), r.archetype);
console.log(`  ${at.title}
  ${at.paragraph}
  ${at.nuance}`);
void (r.archetype.poles ? `  ${poleName(r.archetype.poles[0])} con ${poleName(r.archetype.poles[1])}` + (r.archetype.third ? ` · matiz: ${poleName(r.archetype.third)}` : '') : '  Equilibrio');
console.log('\nTENSIONES');
if (!r.tensions.length) console.log('  ninguna');
for (const tn of r.tensions) console.log('  ' + (tn.kind === 'axes' ? tn.idea : `Te mueves entre dos extremos en ${ax[tn.axis].name}.`));
if (r.pattern) console.log(`\nPATRÓN: muchos Pokémon con ${ax[r.pattern.type].typeName} como segundo tipo (${r.pattern.observed}, esperable ${(r.pattern.observed - r.pattern.dev).toFixed(1)})`);
if (r.doubles.length) console.log(`\nELEGIDO EN DOS CASILLAS: ${r.doubles.join(', ')}`);
console.log('\nENTRADAS QUE MÁS DICEN');
for (const c of r.revealing) {
  const e = c.kind === 'double' ? catalog.double.find(d => d.pokemon === c.pokemon) : catalog.simple.find(x => x.pokemon === c.pokemon && x.type === c.axis);
  console.log(`  ${c.pokemon} · ${ax[c.axis].name} ${c.pos} · ${e.label}${c.kind === 'double' ? ' (doble)' : ''}\n    ${e.text}`);
}

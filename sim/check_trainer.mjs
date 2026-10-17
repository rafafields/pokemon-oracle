// Comprobación de la capa de entrenador: reparto con una semilla distinta a la de calibración + pruebas puntuales.
import { readFileSync } from 'node:fs';
import { buildTrainer, computeTrainer } from '../src/trainer.js';
const load = f => JSON.parse(readFileSync(new URL('../data/' + f, import.meta.url), 'utf8'));
const rules = load('trainers.json'), axes = load('axes.json'), calib = load('trainer_calib.json');
const order = axes.map(a => a.type);
const tm = buildTrainer(rules, load('pokemon.json'), load('pokemon_extra.json'), order);
let s = 999; const rnd = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = l => { const ws = l.map(p => p.popularity ** 2); let r = rnd() * ws.reduce((a, b) => a + b, 0); for (let i = 0; i < l.length; i++) { r -= ws[i]; if (r < 0) return l[i]; } return l[l.length - 1]; };
const N = 60000, g = {}, k = {};
for (let i = 0; i < N; i++) { const sel = Object.fromEntries(order.map(t => [t, pick(tm.lists[t]).name])); const r = computeTrainer(tm, calib, sel); g[r.group] = (g[r.group] || 0) + 1; k[r.key] = (k[r.key] || 0) + 1; }
console.log('reparto con semilla nueva (N=' + N + '):');
for (const [x, v] of Object.entries(g).sort((a, b) => b[1] - a[1])) console.log(' ', x.padEnd(10), (100 * v / N).toFixed(1).padStart(5) + ' %');
// error máximo entre la frecuencia calibrada y la medida, en clases de más de 0,5 %
let worst = 0, wk = ''; for (const [key, f] of Object.entries(calib.freq)) if (f > 0.005) { const m = (k[key] || 0) / N; if (Math.abs(m - f) > worst) { worst = Math.abs(m - f); wk = key; } }
console.log('mayor diferencia entre calibración y medida (clases > 0,5 %):', (100 * worst).toFixed(2), 'puntos en', wk);
console.log('clases sin ninguna aparición:', Object.keys(calib.freq).filter(x => !k[x]).length, '| clases que salen y no estaban calibradas:', Object.keys(k).filter(x => !(x in calib.freq)).join(', ') || 'ninguna');
// pruebas puntuales
const sel = Object.fromEntries(order.map(t => [t, tm.lists[t][0].name]));
const a = JSON.stringify(computeTrainer(tm, calib, sel)), b = JSON.stringify(computeTrainer(tm, calib, sel));
console.log('determinista:', a === b, a);
try { computeTrainer(tm, calib, { ...sel, agua: 'Charmander' }); console.log('FALLO: no rechazó una selección inválida'); } catch (e) { console.log('selección inválida rechazada:', e.message); }
const rocketSel = { ...sel, normal: 'Rattata', veneno: 'Koffing', psiquico: 'Drowzee' };
console.log('selección tipo Rocket ->', computeTrainer(tm, calib, rocketSel).es);

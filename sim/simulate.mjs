// Simulación para calibrar el motor: node sim/simulate.mjs [N] [semilla] [config JSON]
// Ejemplo: node sim/simulate.mjs 10000 1 '{"innerGap":8}'
import { readFileSync } from 'node:fs';
import { buildModel, computeResult } from '../src/engine.js';

const load = f => JSON.parse(readFileSync(new URL('../data/' + f, import.meta.url), 'utf8'));
const model = buildModel(load('axes.json'), load('pokemon.json'), load('catalog.json'), load('tensions.json'), process.argv[4] ? JSON.parse(process.argv[4]) : {});
const N = +process.argv[2] || 10000;
let seed = +process.argv[3] || 1;
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const pick = (list, weightOf) => {
  const ws = list.map(weightOf); let r = rnd() * ws.reduce((a, b) => a + b, 0);
  for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r < 0) return list[i]; }
  return list[list.length - 1];
};
const modes = {
  uniforme: () => 1,
  'ponderado por popularidad': p => p.popularity ** 2, // lo habitual se elige más
};

for (const [mode, wf] of Object.entries(modes)) {
  const arch = new Map(), tensCount = [0, 0, 0], tensKind = new Map(), axisSum = {}, axisSq = {}, axisExt = {};
  let patterns = 0, doubles = 0, flat = 0;
  for (const t of model.order) { axisSum[t] = 0; axisSq[t] = 0; axisExt[t] = [0, 0]; }
  for (let i = 0; i < N; i++) {
    const sel = {};
    for (const t of model.order) sel[t] = pick(model.lists[t], wf).name;
    const r = computeResult(model, sel);
    arch.set(r.archetype.key, (arch.get(r.archetype.key) || 0) + 1);
    tensCount[r.tensions.length]++;
    for (const tn of r.tensions) { const k = tn.kind === 'axes' ? 'par ' + tn.index : 'interna ' + tn.axis; tensKind.set(k, (tensKind.get(k) || 0) + 1); }
    if (r.pattern) patterns++;
    if (r.doubles.length) doubles++;
    if (r.archetype.key === 'equilibrio') flat++;
    for (const t of model.order) {
      const v = r.profile[t]; axisSum[t] += v; axisSq[t] += v * v;
      if (v <= 3.5) axisExt[t][0]++; if (v >= 6.5) axisExt[t][1]++;
    }
  }
  const pct = x => (100 * x / N).toFixed(1) + '%';
  const top = [...arch.entries()].sort((a, b) => b[1] - a[1]);
  console.log(`\n=== ${mode} (N=${N}) ===`);
  console.log(`arquetipos distintos: ${arch.size}; el más frecuente: ${top[0][0]} ${pct(top[0][1])}; top 5 suman ${pct(top.slice(0, 5).reduce((s, x) => s + x[1], 0))}; Equilibrio ${pct(flat)}`);
  console.log(`tensiones 0/1/2: ${tensCount.map(pct).join(' / ')}`);
  console.log(`patrón secundario: ${pct(patterns)}; doble selección: ${pct(doubles)}`);
  console.log('tensión por tipo:', [...tensKind.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${pct(v)}`).join(', '));
  console.log('eje: media ± desviación | % ≤3,5 | % ≥6,5');
  for (const t of model.order) {
    const m = axisSum[t] / N, sd = Math.sqrt(axisSq[t] / N - m * m);
    console.log(`  ${t.padEnd(9)} ${m.toFixed(2)} ± ${sd.toFixed(2)} | ${pct(axisExt[t][0])} | ${pct(axisExt[t][1])}`);
  }
}

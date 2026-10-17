// Ajusta el mínimo de cada carril NPC hacia su objetivo (%), con los carriles anteriores ya aplicados. Escribe data/trainers.json.
import { readFileSync, writeFileSync } from 'node:fs';
const P = JSON.parse(readFileSync('data/pokemon.json', 'utf8')), X = JSON.parse(readFileSync('data/pokemon_extra.json', 'utf8'));
const R = JSON.parse(readFileSync('data/trainers.json', 'utf8'));
const order = Object.keys(R.byType), lists = Object.fromEntries(order.map(t => [t, P.filter(p => p.types.includes(t))]));
const lvl = p => X[p.id].evo;
let s = 123; const rnd = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = l => { const ws = l.map(p => p.popularity ** 2); let r = rnd() * ws.reduce((a, b) => a + b, 0); for (let i = 0; i < l.length; i++) { r -= ws[i]; if (r < 0) return l[i]; } return l[l.length - 1]; };
const N = 40000, rocket = new Set(R.rocket.pokemon);
const users = Array.from({ length: N }, () => { const sl = order.map(t => pick(lists[t])); return { names: new Set(sl.map(p => p.name)), S: sl.reduce((a, p) => a + lvl(p), 0) * 10000 + sl.reduce((a, p) => a + X[p.id].bst, 0) }; });
const refS = users.map(u => u.S).sort((a, b) => a - b), cut = p => refS[Math.floor(p * (N - 1))], lead = cut(R.tiers.leaderPct);
const rails = R.rails.map(r => ({ ...r, set: new Set(r.picks) }));
const hits = users.map(u => ({ free: [...u.names].filter(n => rocket.has(n)).length < R.rocket.minPicks && u.S < lead, h: rails.map(r => [...u.names].filter(n => r.set.has(n)).length) }));
const share = () => { const c = rails.map(() => 0); for (const u of hits) { if (!u.free) continue; const i = rails.findIndex((r, k) => u.h[k] >= r.min); if (i >= 0) c[i]++; } return c.map(x => 100 * x / N); };
const tunable = rails.map((r, i) => (r.kind === 'npc' ? i : -1)).filter(i => i >= 0);
const base = JSON.parse(readFileSync(new URL('./baselists.json', import.meta.url), 'utf8'));
const setList = (i, names) => { rails[i].set = new Set(names); rails[i].picks = [...names]; for (let k = 0; k < hits.length; k++) hits[k].h[i] = [...users[k].names].filter(n => rails[i].set.has(n)).length; };
const rate = (i, n) => hits.filter((u, k) => u.free && users[k].names.has(n)).length / N;
const errOf = (sh, t) => Math.abs(Math.log((sh + 0.05) / t));
for (let pass = 0; pass < 2; pass++) for (const i of tunable) {
  const id = rails[i].id; let names = [...base[id]], best = null;
  setList(i, names);
  while (names.length >= 1) {
    for (const m of [1, 2, 3, 4]) { if (m > names.length) continue; rails[i].min = m; const sh = share()[i]; const e = errOf(sh, rails[i].target); if (!best || e < best.e) best = { e, m, names: [...names], sh }; }
    if (names.length === 1) break;
    const worst = names.map(n => [n, rate(i, n)]).sort((x, y) => y[1] - x[1])[0][0];
    names = names.filter(n => n !== worst); setList(i, names);
  }
  setList(i, best.names); rails[i].min = best.m;
}
const fin = share();
console.log('carril'.padEnd(14), 'min  % real (objetivo)');
rails.forEach((r, i) => console.log(r.id.padEnd(14), String(r.min).padStart(3), fin[i].toFixed(2).padStart(6), r.kind === 'npc' ? `(${r.target})` : '(fijo)'));
console.log('NPC total', rails.reduce((a, r, i) => a + (r.kind === 'npc' ? fin[i] : 0), 0).toFixed(1), '%');
for (let i = 0; i < rails.length; i++) { R.rails[i].min = rails[i].min; R.rails[i].picks = rails[i].picks; }
writeFileSync('data/trainers.json', JSON.stringify(R, null, 2) + '\n');

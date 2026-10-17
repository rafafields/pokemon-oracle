// Reparto completo de personajes. node sim/full.mjs [uniforme|pop2] [N]
import { readFileSync } from 'node:fs';
const P = JSON.parse(readFileSync('data/pokemon.json', 'utf8')), X = JSON.parse(readFileSync('data/pokemon_extra.json', 'utf8'));
const R = JSON.parse(readFileSync('data/trainers.json', 'utf8'));
const order = Object.keys(R.byType), lists = Object.fromEntries(order.map(t => [t, P.filter(p => p.types.includes(t))]));
const lvl = p => X[p.id].evo;
const mkr = seed => { let s = seed; return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const mode = process.argv[2] || 'pop2', N = +process.argv[3] || 60000;
const wfs = { uniforme: () => 1, pop2: p => p.popularity ** 2 };
const mkpick = (rnd, wf) => l => { const ws = l.map(wf); let r = rnd() * ws.reduce((a, b) => a + b, 0); for (let i = 0; i < l.length; i++) { r -= ws[i]; if (r < 0) return l[i]; } return l[l.length - 1]; };
const draw = pick => { const sl = order.map(t => pick(lists[t])); const names = new Set(sl.map(p => p.name)); const ps = [...new Map(sl.map(p => [p.name, p])).values()]; const cnt = {}; for (const t of order) cnt[t] = ps.filter(p => p.types.includes(t) || R.affinities[p.name] === t).length; return { cnt, names, S: sl.reduce((a, p) => a + lvl(p), 0) * 10000 + sl.reduce((a, p) => a + X[p.id].bst, 0) }; };
const hit = (c, set) => [...c.names].filter(n => set.has(n)).length;
const refPick = mkpick(mkr(5), wfs.pop2), ref = Array.from({ length: N }, () => draw(refPick));
const refS = ref.map(c => c.S).sort((a, b) => a - b), cut = p => refS[Math.floor(p * (N - 1))];
const data = Array.from({ length: N }, () => 0).map(() => 0); const pick = mkpick(mkr(77), wfs[mode]); const users = Array.from({ length: N }, () => draw(pick));
const rocket = new Set(R.rocket.pokemon);
if (process.argv[4] === 'solo') {
  console.log('carril | % de usuarios que cumple, según mínimo de Pokémon de la lista (1/2/3/4)  [selección ' + mode + ']');
  for (const r of R.rails) { const set = new Set(r.picks); console.log(r.id.padEnd(12), [1, 2, 3, 4].map(m => (100 * users.filter(c => hit(c, set) >= m).length / N).toFixed(1).padStart(5)).join(' '), ' actual min =', r.min); }
  process.exit(0);
}
const tab = {}; for (const t of order) { tab[t] = []; for (let k = 0; k <= 9; k++) tab[t][k] = ref.filter(c => c.cnt[t] >= k).length / N; }
const domOf = c => order.map(t => [t, tab[t][Math.min(c.cnt[t], 9)]]).sort((a, b) => a[1] - b[1] || order.indexOf(a[0]) - order.indexOf(b[0]))[0];
const lex = (a, b) => a[0] - b[0] || a[1] - b[1];
const lead0 = cut(R.tiers.leaderPct);
const qBy = Object.fromEntries(order.map(t => [t, []])); for (const c of ref) { if (c.S >= lead0) continue; const [t, q] = domOf(c); qBy[t].push([q, -c.S]); }
const rcut = {}; for (const t of order) { const a = qBy[t].sort(lex); rcut[t] = a[Math.floor(R.rareShare * (a.length - 1))] || [-1, 0]; }
const lead = cut(R.tiers.leaderPct), elite = cut(R.tiers.elitePct), champ = cut(R.tiers.championPct);
const rocketS = ref.filter(c => hit(c, rocket) >= R.rocket.minPicks).map(c => c.S).sort((a, b) => a - b); const rcutS = p => rocketS[Math.floor(p * (rocketS.length - 1))]; const rLead = rcutS(R.rocket.leaderPct), rBoss = rcutS(R.rocket.bossPct);
const rails = R.rails.map(r => ({ ...r, set: new Set(r.picks) }));
const out = new Map(); const add = k => out.set(k, (out.get(k) || 0) + 1); const group = {};
const grp = (g, k) => { group[g] = (group[g] || 0) + 1; add(g + ' | ' + k); };
for (const c of users) {
  const tier = c.S >= champ ? 'c' : c.S >= elite ? 'a' : c.S >= lead ? 'l' : 'b';
  if (hit(c, rocket) >= R.rocket.minPicks) { grp('Rocket', R.rocket.names[c.S >= rBoss ? 'altomando' : c.S >= rLead ? 'lider' : 'entrenador']); continue; }
  if (tier === 'c') { grp('Campeón', R.champion); continue; }
  const [t, q] = domOf(c), k = c.cnt[t];
  if (tier === 'a') { grp('Alto Mando', R.elite.replace('{tipo}', t)); continue; }
  if (tier === 'l') { grp('Líder', R.gym.replace('{tipo}', t)); continue; }
  const rl = rails.find(r => hit(c, r.set) >= r.min);
  if (rl) { grp(['protagonista', 'rival'].includes(rl.id) ? 'Centrales' : rl.id === 'profesor' ? 'Profesor' : 'NPC', rl.es); continue; }
  const bd = (R.bands || []).find(b => c.S >= cut(b.from) && (b.to >= 1 || c.S < cut(b.to)));
  if (bd) { grp('Entrenador de nivel', bd.es); continue; }
  grp('Entrenador de tipo', lex([q, -c.S], rcut[t]) <= 0 ? R.byType[t].rare : k >= 2 ? R.byType[t].common : R.generic.replace('{tipo}', t));
}
console.log(`selección ${mode}, N=${N}; cortes líder ${R.tiers.leaderPct} AM ${R.tiers.elitePct} campeón ${R.tiers.championPct}\n`);
console.log('GRUPO'.padEnd(22), '%');
for (const [g, v] of Object.entries(group).sort((a, b) => b[1] - a[1])) console.log(g.padEnd(22), (100 * v / N).toFixed(1).padStart(5));
console.log('\nCLASES de carril (centrales, profesor, NPC, Rocket, Campeón):');
for (const [k, v] of [...out.entries()].filter(([k]) => process.argv[4] === 'todas' || /^(Centrales|Profesor|NPC|Rocket|Campeón|Entrenador de nivel)/.test(k)).sort((a, b) => b[1] - a[1])) console.log(k.padEnd(60), (100 * v / N).toFixed(2).padStart(6), ' 1 de', Math.round(N / v));

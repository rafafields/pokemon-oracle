// Capa de entrenador del Oráculo Pokémon: «qué has coleccionado», independiente de los 720 arquetipos.
// Función pura y sin dependencias (funciona igual en el navegador y en Node). Reglas en data/trainers.json,
// explicadas en docs/Reglas de entrenador.md. La calibración (cortes y tablas de rareza) se genera una vez
// con scripts/build_trainer_calib.mjs y se pasa a computeTrainer; así el resultado es determinista.

export function buildTrainer(rules, pokemon, extra, order) {
  const all = pokemon.map(p => ({ ...p, evo: extra[p.id].evo, bst: extra[p.id].bst }));
  const byName = new Map(all.map(p => [p.name, p]));
  const lists = Object.fromEntries(order.map(t => [t, all.filter(p => p.types.includes(t))]));
  return {
    rules, order, byName, lists,
    rocket: new Set(rules.rocket.pokemon),
    rails: rules.rails.map(r => ({ ...r, set: new Set(r.picks) })),
  };
}

// Rasgos de una selección: Pokémon distintos, recuento por tipo (con afinidades) y escala de evolución.
// S = suma de niveles de evolución de las 15 casillas, con desempate por la suma de estadísticas base.
function features(tm, selection) {
  const slots = tm.order.map(t => {
    const p = tm.byName.get(selection[t]);
    if (!p || !p.types.includes(t)) throw new Error(`Selección inválida en ${t}: ${selection[t]}`);
    return p;
  });
  const names = new Set(slots.map(p => p.name));
  const uniq = [...new Map(slots.map(p => [p.name, p])).values()];
  const cnt = {};
  for (const t of tm.order) cnt[t] = uniq.filter(p => p.types.includes(t) || tm.rules.affinities[p.name] === t).length;
  const S = slots.reduce((a, p) => a + p.evo, 0) * 1e5 + slots.reduce((a, p) => a + p.bst, 0);
  return { names, cnt, S };
}

const hits = (f, set) => { let n = 0; for (const x of f.names) if (set.has(x)) n++; return n; };
const lex = (a, b) => a[0] - b[0] || a[1] - b[1];
const fill = (s, t) => s.replace('{tipo}', t);

// Tipo dominante: el que tiene el recuento más raro (menor cola P(K >= k)); empata por orden de los ejes.
function dominant(tm, calib, f) {
  let best = null;
  for (const t of tm.order) {
    const q = calib.tail[t][Math.min(f.cnt[t], 9)];
    if (!best || q < best.q) best = { t, q };
  }
  return best;
}

// Clasifica sin rareza (la rareza sale de la calibración, que a su vez usa esta función).
function classify(tm, calib, selection) {
  const R = tm.rules, f = features(tm, selection);
  const c = calib.cuts;
  const tier = f.S >= c.champion ? 'champion' : f.S >= c.elite ? 'elite' : f.S >= c.leader ? 'leader' : 'low';

  if (hits(f, tm.rocket) >= R.rocket.minPicks) {
    const k = f.S >= calib.rocket.boss ? 'altomando' : f.S >= calib.rocket.leader ? 'lider' : 'entrenador';
    return { group: 'rocket', key: 'rocket:' + k, es: R.rocket.names[k], en: R.rocket.namesEn[k], tier };
  }
  if (tier === 'champion') return { group: 'champion', key: 'champion', es: R.champion, en: R.championEn, tier };

  const { t, q } = dominant(tm, calib, f);
  if (tier === 'elite') return { group: 'elite', key: 'elite:' + t, es: fill(R.elite, R.typesEs[t]), en: fill(R.eliteEn, R.typesEn[t]), tier, type: t };
  if (tier === 'leader') return { group: 'gym', key: 'gym:' + t, es: fill(R.gym, R.typesEs[t]), en: fill(R.gymEn, R.typesEn[t]), tier, type: t };

  const rail = tm.rails.find(r => hits(f, r.set) >= r.min);
  if (rail) return { group: rail.kind === 'npc' ? 'npc' : rail.kind, key: 'rail:' + rail.id, es: rail.es, en: rail.en, tier };

  const band = R.bands.find(b => f.S >= calib.bands[b.id].from && (calib.bands[b.id].to === null || f.S < calib.bands[b.id].to));
  if (band) return { group: 'level', key: 'band:' + band.id, es: band.es, en: band.en, tier };

  const kind = lex([q, -f.S], calib.rareCut[t]) <= 0 ? 'rare' : f.cnt[t] >= 2 ? 'common' : 'generic';
  const es = kind === 'generic' ? fill(R.generic, R.typesEs[t]) : R.byType[t][kind];
  const en = kind === 'generic' ? fill(R.genericEn, R.typesEn[t]) : R.byType[t][kind + 'En'];
  return { group: 'type', key: `type:${t}:${kind}`, es, en, tier, type: t };
}

// Resultado completo: la clase más su grado de rareza (B a S++) y una estimación de «1 de cada N».
export function computeTrainer(tm, calib, selection) {
  const r = classify(tm, calib, selection);
  return { ...r, grade: calib.grades[r.key], oneIn: Math.round(1 / calib.freq[r.key]) };
}

// Calibración determinista (semilla fija) con selecciones al azar ponderadas por popularidad^popExponent.
// Devuelve un objeto JSON: cortes de la escala, tablas de rareza por tipo, cortes de Rocket y frecuencia de cada clase.
export function calibrateTrainer(tm, { samples = 60000, seed = 5, popExponent = 2 } = {}) {
  const R = tm.rules, seed0 = seed;
  const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pick = l => { let tot = 0; for (const p of l) tot += p.popularity ** popExponent; let r = rnd() * tot; for (const p of l) { r -= p.popularity ** popExponent; if (r < 0) return p; } return l[l.length - 1]; };
  const draw = () => Object.fromEntries(tm.order.map(t => [t, pick(tm.lists[t]).name]));
  const ref = Array.from({ length: samples }, () => features(tm, draw()));

  const sorted = ref.map(f => f.S).sort((a, b) => a - b);
  const cut = p => sorted[Math.floor(p * (samples - 1))];
  const tail = {};
  for (const t of tm.order) { tail[t] = []; for (let k = 0; k <= 9; k++) tail[t][k] = ref.filter(f => f.cnt[t] >= k).length / samples; }
  const calib = {
    cuts: { leader: cut(R.tiers.leaderPct), elite: cut(R.tiers.elitePct), champion: cut(R.tiers.championPct) },
    tail,
    bands: Object.fromEntries(R.bands.map(b => [b.id, { from: cut(b.from), to: b.to >= 1 ? null : cut(b.to) }])),
  };

  // Rareza dentro de cada tipo: el rareShare más raro entre quienes llegan al peldaño bajo y tienen ese tipo dominante.
  const qBy = Object.fromEntries(tm.order.map(t => [t, []]));
  for (const f of ref) { if (f.S >= calib.cuts.leader) continue; const { t, q } = dominant(tm, calib, f); qBy[t].push([q, -f.S]); }
  calib.rareCut = {};
  for (const t of tm.order) { const a = qBy[t].sort(lex); calib.rareCut[t] = a[Math.floor(R.rareShare * (a.length - 1))] || [-1, 0]; }

  // Peldaños propios de Rocket, medidos entre quienes son Rocket.
  const rs = ref.filter(f => hits(f, tm.rocket) >= R.rocket.minPicks).map(f => f.S).sort((a, b) => a - b);
  const rcut = p => rs[Math.floor(p * (rs.length - 1))];
  calib.rocket = { leader: rcut(R.rocket.leaderPct), boss: rcut(R.rocket.bossPct) };

  // Frecuencia de cada clase con una segunda muestra (para «1 de cada N»).
  const count = {};
  for (let i = 0; i < samples; i++) { const k = classify(tm, calib, draw()).key; count[k] = (count[k] || 0) + 1; }
  calib.freq = Object.fromEntries(Object.entries(count).sort().map(([k, v]) => [k, +(v / samples).toFixed(5)]));
  // Grado de rareza (B a S++): se reparte a la gente por la frecuencia de su clase, de la más común a la más rara,
  // según el plan de proporciones de usuarios (R.rarity.plan). Los cortes se recalculan solos al recalibrar.
  const { grades, plan } = R.rarity, limit = plan.map((_, i) => plan.slice(0, i + 1).reduce((a, b) => a + b, 0));
  calib.grades = {};
  let cum = 0, gi = 0;
  for (const [k, f] of Object.entries(calib.freq).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
    if (cum >= limit[gi] - 1e-9 && gi < grades.length - 1) gi++;
    calib.grades[k] = grades[gi]; cum += f;
  }
  calib.meta = { samples, seed: seed0, popExponent };
  return calib;
}

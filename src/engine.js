// Motor de perfil del Oráculo Pokémon. Función pura y sin dependencias:
// funciona igual en el navegador y en Node. Ver docs/Motor de perfil y reglas de tensión.md.

export const DEFAULTS = {
  popWeight: { 5: 0.5, 4: 0.7, 3: 1.0, 2: 1.3, 1: 1.6 },
  secBase: 0.3, secSlope: 0.3, secMin: 0.1, secMax: 1,
  patternMinCount: 4, patternMinDev: 2.5,
  flatThreshold: 1.5, thirdAxisThreshold: 2,
  tensionPole: 3, tensionMax: 2, innerGap: 8,
};

export function buildModel(axes, pokemon, catalog, tensions, config = {}) {
  const cfg = { ...DEFAULTS, ...config };
  const order = axes.map(a => a.type);
  const byName = new Map(pokemon.map(p => [p.name, p]));
  const simple = new Map(catalog.simple.map(e => [e.pokemon + '|' + e.type, e]));
  const double = new Map(catalog.double.map(e => [e.pokemon, e]));
  const lists = Object.fromEntries(order.map(t => [t, pokemon.filter(p => p.types.includes(t))]));
  const other = (p, t) => p.types.find(x => x !== t);
  // Esperado de cada tipo secundario: suma sobre casillas de P(el elegido al azar tiene U como otro tipo).
  const expected = Object.fromEntries(order.map(t => [t, 0]));
  for (const t of order) {
    for (const p of lists[t]) if (p.types.length === 2) expected[other(p, t)] += 1 / lists[t].length;
  }
  return { cfg, axes, order, byName, simple, double, lists, expected, other, tensions };
}

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

export function computeResult(model, selection) {
  const { cfg, order, byName, simple, double, expected, other } = model;
  const picks = order.map(t => {
    const p = byName.get(selection[t]);
    if (!p || !p.types.includes(t)) throw new Error(`Selección inválida en ${t}: ${selection[t]}`);
    return { slot: t, p };
  });

  // Observado de cada tipo secundario y su peso.
  const observed = Object.fromEntries(order.map(t => [t, 0]));
  for (const { slot, p } of picks) if (p.types.length === 2) observed[other(p, slot)] += 1;
  const dev = {}, sec = {};
  for (const t of order) {
    dev[t] = observed[t] - expected[t];
    sec[t] = clamp(cfg.secBase + cfg.secSlope * dev[t], cfg.secMin, cfg.secMax);
  }

  // Contribuciones.
  const chosenIn = new Map();
  for (const { slot, p } of picks) chosenIn.set(p.name, (chosenIn.get(p.name) || []).concat(slot));
  const contribs = [];
  const doubles = [];
  const seenDouble = new Set();
  for (const { slot, p } of picks) {
    const w = cfg.popWeight[p.popularity];
    if (p.types.length === 2 && chosenIn.get(p.name).length === 2) {
      if (seenDouble.has(p.name)) continue;
      seenDouble.add(p.name);
      const d = double.get(p.name);
      doubles.push(d);
      for (const t of p.types) contribs.push({ axis: t, pos: d.pos[t], w, pop: w, pokemon: p.name, kind: 'double' });
      continue;
    }
    contribs.push({ axis: slot, pos: simple.get(p.name + '|' + slot).pos, w, pop: w, pokemon: p.name, kind: 'primary' });
    if (p.types.length === 2) {
      const u = other(p, slot);
      contribs.push({ axis: u, pos: simple.get(p.name + '|' + u).pos, w: w * sec[u], pop: w, pokemon: p.name, kind: 'secondary' });
    }
  }

  // Perfil.
  const profile = {};
  for (const t of order) {
    const cs = contribs.filter(c => c.axis === t);
    const sw = cs.reduce((s, c) => s + c.w, 0);
    profile[t] = cs.reduce((s, c) => s + c.w * c.pos, 0) / sw;
  }
  const intensity = t => Math.abs(profile[t] - 5);
  const ranked = [...order].sort((a, b) => intensity(b) - intensity(a) || order.indexOf(a) - order.indexOf(b));
  const pole = t => (profile[t] >= 5 ? 'high' : 'low');
  const flat = intensity(ranked[0]) < cfg.flatThreshold;
  const archetype = flat ? { key: 'equilibrio' } : {
    key: `${ranked[0]}:${pole(ranked[0])}+${ranked[1]}:${pole(ranked[1])}`,
    poles: [[ranked[0], pole(ranked[0])], [ranked[1], pole(ranked[1])]],
    third: intensity(ranked[2]) >= cfg.thirdAxisThreshold ? [ranked[2], pole(ranked[2])] : null,
  };

  // Tensiones: entre ejes (por producto de intensidades) y dentro de un eje.
  const found = [];
  const poleIntensity = ([t, side]) => (pole(t) === side ? intensity(t) : 0);
  for (const [i, tn] of model.tensions.entries()) {
    const a = poleIntensity(tn.a), b = poleIntensity(tn.b);
    if (a >= cfg.tensionPole && b >= cfg.tensionPole) found.push({ kind: 'axes', index: i, score: a * b, idea: tn.idea });
  }
  found.sort((x, y) => y.score - x.score || x.index - y.index);
  const inner = [];
  for (const t of order) {
    const ps = contribs.filter(c => c.axis === t).map(c => c.pos);
    if (Math.max(...ps) - Math.min(...ps) >= cfg.innerGap) inner.push({ kind: 'inner', axis: t, score: Math.max(...ps) - Math.min(...ps) });
  }
  inner.sort((x, y) => y.score - x.score || order.indexOf(x.axis) - order.indexOf(y.axis));
  const tensions = found.concat(inner).slice(0, cfg.tensionMax);

  // Patrón de tipo secundario.
  const inTop = new Set(flat ? [] : ranked.slice(0, 3));
  const cand = order.filter(t => observed[t] >= cfg.patternMinCount && dev[t] >= cfg.patternMinDev && !inTop.has(t))
    .sort((a, b) => dev[b] - dev[a] || order.indexOf(a) - order.indexOf(b));
  const pattern = cand.length ? { type: cand[0], observed: observed[cand[0]], dev: dev[cand[0]] } : null;

  // Entradas reveladoras: mayor peso de popularidad × intensidad del eje, solo contribuciones completas.
  const revealing = contribs.filter(c => c.kind !== 'secondary')
    .map(c => ({ ...c, score: c.pop * intensity(c.axis) }))
    .sort((a, b) => b.score - a.score || order.indexOf(a.axis) - order.indexOf(b.axis)).slice(0, 3);

  return { profile, ranked, archetype, tensions, pattern, doubles: doubles.map(d => d.pokemon), revealing, observed, dev, sec };
}

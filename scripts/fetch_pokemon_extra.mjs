// Genera data/pokemon_extra.json: nivel de evolución, suma de estadísticas base y altura (h, en decímetros) de los 151, desde PokeAPI.
// evo: 1 = primera forma de una cadena, 2 = intermedia, 3 = forma final de una cadena de 3 etapas;
//      los Pokémon sin evolución cuentan como 3 (forma final), y las formas finales de cadenas de 2 etapas también.
// Uso: node scripts/fetch_pokemon_extra.mjs
import { writeFileSync } from 'node:fs';
const get = async u => { for (let i = 0; i < 3; i++) { try { const r = await fetch(u); if (r.ok) return r.json(); } catch { /* reintento */ } } throw new Error('No se pudo leer ' + u); };
const ids = [...Array(151).keys()].map(i => i + 1);
const chains = new Map(), stat = {};
for (let k = 0; k < ids.length; k += 15) {
  await Promise.all(ids.slice(k, k + 15).map(async id => {
    const [sp, pk] = await Promise.all([get('https://pokeapi.co/api/v2/pokemon-species/' + id), get('https://pokeapi.co/api/v2/pokemon/' + id)]);
    stat[id] = { bst: pk.stats.reduce((s, x) => s + x.base_stat, 0), h: pk.height, chain: sp.evolution_chain.url };
  }));
}
for (const url of new Set(Object.values(stat).map(s => s.chain))) chains.set(url, await get(url));
const depth = {}, len = {};
const walk = (n, d, acc) => { acc[+n.species.url.split('/').slice(-2)[0]] = d; for (const c of n.evolves_to) walk(c, d + 1, acc); };
for (const ch of chains.values()) { const acc = {}; walk(ch.chain, 1, acc); const max = Math.max(...Object.values(acc)); for (const [id, d] of Object.entries(acc)) { depth[id] = d; len[id] = max; } }
const out = {};
for (const id of ids) {
  const d = depth[id], n = len[id];
  out[id] = { evo: n === 1 ? 3 : d === 1 ? 1 : d === n ? 3 : 2, bst: stat[id].bst, h: stat[id].h };
}
writeFileSync(new URL('../data/pokemon_extra.json', import.meta.url), JSON.stringify(out) + '\n');
console.log('data/pokemon_extra.json', Object.keys(out).length);

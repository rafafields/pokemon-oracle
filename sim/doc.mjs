// Genera la nota legible de reglas de entrenador a partir de data/trainers.json y de la simulación.
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
const R = JSON.parse(readFileSync('data/trainers.json', 'utf8'));
const out = execSync('node sim/full.mjs pop2 60000 todas', { encoding: 'utf8', maxBuffer: 1e8 });
const pct = {}; for (const l of out.split('\n')) { const m = l.match(/^(.+?) \| (.+?)\s+(\d+\.\d+)\s+1 de (\d+)/); if (m) pct[m[2].trim()] = [m[3], m[4]]; }
const groups = {}; let inG = false; for (const l of out.split('\n')) { if (l.startsWith('GRUPO')) { inG = true; continue; } if (inG && !l.trim()) break; if (inG) { const m = l.match(/^(.+?)\s+(\d+\.\d)$/); if (m) groups[m[1].trim()] = m[2]; } }
const cell = n => pct[n] ? `${pct[n][0]} % (1 de ${pct[n][1]})` : '—';
const T = { normal: 'Normal', fuego: 'Fuego', agua: 'Agua', electrico: 'Eléctrico', planta: 'Planta', hielo: 'Hielo', lucha: 'Lucha', veneno: 'Veneno', tierra: 'Tierra', volador: 'Volador', psiquico: 'Psíquico', bicho: 'Bicho', roca: 'Roca', fantasma: 'Fantasma', dragon: 'Dragón' };
const L = [];
L.push('# Reglas de entrenador', '');
L.push('Borrador de la capa «qué tipo de entrenador eres». Es independiente de los 720 arquetipos: el arquetipo dice **cómo eres** y esta capa dice **qué has coleccionado**, y sirve para elegir el sprite temático. Las listas de Pokémon y los nombres de clase son propuestas por revisar; los porcentajes salen de una simulación con 60.000 selecciones ponderadas por popularidad² (no de usuarios reales) y cambiarán con datos reales. Fuente: `data/trainers.json` del repositorio; este documento se genera con `sim/doc.mjs`.', '');
L.push('## Orden de prioridad', '', 'El primer paso que se cumple, gana.', '');
L.push(`1. **Rocket:** ${R.rocket.minPicks} o más Pokémon de su lista.`, `2. **Campeón:** el ${(100 - R.tiers.championPct * 100).toFixed(0)} % superior de la escala de evolución.`, `3. **Alto Mando** (percentil ${R.tiers.elitePct * 100} o más) y **Líder de gimnasio** (percentil ${R.tiers.leaderPct * 100} o más). El tipo es el dominante.`, '4. **Centrales, profesor y NPC:** el primer carril cuya lista se cumpla (solo en el peldaño bajo).', `5. **Entrenador de nivel:** «Entrenador experto» (percentiles ${R.bands[0].from * 100}–${R.bands[0].to * 100}) y «Joven entrenador» (percentiles ${R.bands[1].from * 100}–${R.bands[1].to * 100}).`, '6. **Entrenador de tipo:** clase rara, común o genérica del tipo dominante.', '');
L.push('## Reparto por grupo', '', '| Grupo | % de usuarios |', '|---|---|'); for (const [g, v] of Object.entries(groups)) L.push(`| ${g} | ${v} |`); L.push('');
L.push('## Cómo se calculan las piezas', '');
L.push('- **Escala de evolución:** suma de niveles de los 15 Pokémon elegidos (primera forma = 1, intermedia = 2, forma final de cadena de 3 = 3, sin evolución = 3), con desempate por la suma de estadísticas base. Los cortes son percentiles de una distribución simulada y hay que recalibrarlos con datos reales.');
L.push('- **Tipo dominante:** el tipo con el recuento más raro de Pokémon del tipo entre los 15 (contando también las afinidades). Una clase **rara** es el 15 % más raro dentro de cada tipo, calculado solo entre quienes llegan al peldaño bajo (los líderes y el Alto Mando no cuentan).');
L.push('- **Afinidades:** Pokémon que cuentan para un tipo que no es el suyo. ' + Object.entries(R.affinities).map(([p, t]) => `${p} → ${T[t]}`).join(', ') + '.', '');
L.push('## Rocket', '', `Regla: **${R.rocket.minPicks} o más** de estos Pokémon: ${R.rocket.pokemon.join(', ')}.`, '', 'Dentro de Rocket, el peldaño se mide aparte: **ejecutivo** es el 20 % superior de la escala de evolución entre quienes son Rocket y **jefe** el 5 % superior (los Pokémon de Rocket son sobre todo primeras formas, y con la escala general el jefe casi no salía).', '', '| Peldaño | Clase | % |', '|---|---|---|');
for (const [t, k] of [['entrenador', 'Recluta'], ['lider', 'Ejecutivo'], ['altomando', 'Jefe']]) L.push(`| ${t === 'entrenador' ? 'Bajo' : t === 'lider' ? 'Líder' : 'Alto Mando'} | ${R.rocket.names[t]} | ${cell(R.rocket.names[t])} |`); L.push('');
L.push('## Personajes centrales y profesor', '', '| Clase | Regla | % |', '|---|---|---|');
for (const r of R.rails.filter(r => r.kind !== 'npc')) L.push(`| ${r.es} | ${r.min} o más de: ${r.picks.join(', ')} | ${cell(r.es)} |`); L.push('');
L.push(`## NPC (${R.rails.filter(r => r.kind === 'npc').length})`, '', 'Orden de la tabla = orden de prioridad. Las listas son lo que dejó el ajuste automático hacia ~0,5 % por clase, así que algunas han perdido sentido temático.', '', '| Clase | Regla | % |', '|---|---|---|');
for (const r of R.rails.filter(r => r.kind === 'npc')) L.push(`| ${r.es} | ${r.min} o más de: ${r.picks.join(', ')} | ${cell(r.es)} |`); L.push('');
L.push('## Entrenador de nivel', '', '| Clase | Regla | % |', '|---|---|---|');
for (const b of R.bands) L.push(`| ${b.es} | Escala de evolución entre los percentiles ${b.from * 100} y ${b.to * 100} | ${cell(b.es)} |`); L.push('');
L.push('## Entrenador de tipo', '', 'Para el tipo dominante: si el peldaño es líder o Alto Mando, el titular es «Líder de gimnasio de X» o «Alto Mando de X». Si no, clase **rara** (15 % más raro del tipo), **común** (2 o más Pokémon del tipo) o **genérica**.', '', '| Tipo | Clase rara | % | Clase común | % |', '|---|---|---|---|---|');
for (const [t, c] of Object.entries(R.byType)) L.push(`| ${T[t]} | ${c.rare} | ${cell(c.rare)} | ${c.common} | ${cell(c.common)} |`); L.push('');
L.push('### Líder de gimnasio y Alto Mando por tipo', '', '| Tipo | Líder | Alto Mando |', '|---|---|---|');
for (const t of Object.keys(R.byType)) L.push(`| ${T[t]} | ${cell(R.gym.replace('{tipo}', t))} | ${cell(R.elite.replace('{tipo}', t))} |`); L.push('');
const CAL = JSON.parse(readFileSync('data/trainer_calib.json', 'utf8')), GR = R.rarity.grades, gs = Object.fromEntries(GR.map(g => [g, { n: 0, u: 0, max: 0, min: 1 }]));
for (const [k, g] of Object.entries(CAL.grades)) { const f = CAL.freq[k]; gs[g].n++; gs[g].u += f; gs[g].max = Math.max(gs[g].max, f); gs[g].min = Math.min(gs[g].min, f); }
L.push('## Grado de rareza (B a S++)', '', 'Cada clase lleva un grado según lo frecuente que sea: B las más comunes y S++ las más raras. Se reparte a la gente por frecuencia de clase, de la más común a la más rara, con este plan de proporciones: ' + GR.map((g, i) => g + ' ' + Math.round(R.rarity.plan[i] * 100) + ' %').join(', ') + '. Los cortes se recalculan solos al recalibrar (`npm run trainer`), así que un grado nunca está ligado a un número fijo. En la web se muestra junto a «≈ 1 de cada N», marcado como estimación con selecciones al azar.', '', '| Grado | Clases | % de usuarios | Frecuencia de clase |', '|---|---|---|---|');
for (const g of GR) L.push('| ' + g + ' | ' + gs[g].n + ' | ' + (100 * gs[g].u).toFixed(1) + ' | ' + (100 * gs[g].max).toFixed(2) + ' % – ' + (100 * gs[g].min).toFixed(2) + ' % |');
L.push('', 'Las clases de Alto Mando y las raras de cada tipo acaban casi todas en S+ y S++; las clases comunes de tipo y los carriles más frecuentes (protagonista, recluta) en B y A. Los grados por clase están en `data/trainer_calib.json` (campo `grades`).', '');
L.push('## Pendiente de decidir', '', '- Textos de las clases, si las lleva (los nombres están aprobados).', '- Revisar las listas de Pokémon de cada carril, sobre todo las recortadas automáticamente.', '- Solapamientos entre NPC: aprobados (el primero de la lista gana).', '- Con selección uniforme el reparto cambia mucho (Rocket sube al 18 %); recalibrar con datos reales.');
writeFileSync(process.argv[2], L.join('\n') + '\n');
console.log('escrito', process.argv[2]);

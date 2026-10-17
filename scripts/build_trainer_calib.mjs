// Genera data/trainer_calib.json: calibración determinista de la capa de entrenador.
// Uso: node scripts/build_trainer_calib.mjs   (repetir si cambian data/trainers.json, pokemon.json o pokemon_extra.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { buildTrainer, calibrateTrainer } from '../src/trainer.js';
const load = f => JSON.parse(readFileSync(new URL('../data/' + f, import.meta.url), 'utf8'));
const rules = load('trainers.json'), axes = load('axes.json');
const tm = buildTrainer(rules, load('pokemon.json'), load('pokemon_extra.json'), axes.map(a => a.type));
const calib = calibrateTrainer(tm, rules.calibration);
writeFileSync(new URL('../data/trainer_calib.json', import.meta.url), JSON.stringify(calib) + '\n');
console.log('data/trainer_calib.json:', Object.keys(calib.freq).length, 'clases con frecuencia; cortes', JSON.stringify(calib.cuts));

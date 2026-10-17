// Descripción visual de cada clase de entrenador para generar su sprite (data/trainers.json, claves de data/trainer_calib.json).
// Diseños originales: sin personajes con nombre ni imágenes de referencia. Cada entrada: [descripción del personaje, partículas].
import { readFileSync } from 'node:fs';
const R = JSON.parse(readFileSync(new URL('../data/trainers.json', import.meta.url), 'utf8'));

export const STYLE = 'Detailed pixel art sprite of a single character for a 16-bit handheld monster-collecting RPG. Front-facing, full body, standing pose, chibi proportions: head about one third of the total height, same proportions for every character. The character is centered and fills about three quarters of the image height, with the feet near the bottom. Rich detail: each colour shaded with three or four tones (highlight, base, shadow), small details on clothes and accessories, an expressive face with eyes and a small highlight in them. Clean pixel grid with crisp hard pixel edges, no anti-aliasing, no blur, no gradients, strong dark outline, limited palette of at most 32 colours. Around the character float a few tiny pixel particles that fit its theme (a handful of single pixels or 2x2 pixel shapes, not a scene). Isolated on a fully transparent background: no ground, no floor, no cast shadow, no backdrop, no text, no logos. Original character design.';

// Motivo de cada tipo: [paleta y adorno, partículas]
const THEME = {
  normal: ['neutral cream and tan colours with a small star motif', 'tiny white stars'],
  fuego: ['red and orange colours with flame motifs', 'tiny embers and sparks'],
  agua: ['blue and teal colours with wave motifs', 'tiny water droplets and bubbles'],
  electrico: ['yellow and black colours with lightning bolt motifs', 'tiny yellow sparks and zigzags'],
  planta: ['green and brown colours with leaf motifs', 'tiny drifting leaves'],
  hielo: ['pale blue and white colours with snowflake motifs', 'tiny snowflakes'],
  lucha: ['red, white and brown colours with martial motifs', 'tiny impact stars'],
  veneno: ['purple and acid green colours with toxic drip motifs', 'tiny toxic bubbles'],
  tierra: ['brown and ochre colours with rocky earth motifs', 'tiny dust specks'],
  volador: ['sky blue and white colours with feather motifs', 'tiny floating feathers'],
  psiquico: ['pink and violet colours with eye and spiral motifs', 'tiny glowing star dots'],
  bicho: ['lime green and yellow colours with insect wing motifs', 'tiny fluttering insects'],
  roca: ['grey and slate colours with boulder motifs', 'tiny pebbles'],
  fantasma: ['dark purple and ink colours with spectral motifs', 'tiny ghostly wisps'],
  dragon: ['deep blue and gold colours with scale motifs', 'tiny golden sparks'],
};

const D = {};
const set = (key, desc, parts) => { D[key] = [desc, parts]; };

// Clases de tipo: [rara, común]
const TYPE = {
  normal: [['A gentle breeder in a green apron carrying a basket of eggs, kind smile.', 'tiny hearts and stars'], ['A cheerful young boy in a blue cap, shorts and sneakers with a small backpack.', 'tiny sparkles']],
  fuego: [['A street fire-breather performer with a bandana and a vest, holding a torch and breathing a small flame.', 'tiny embers and sparks'], ['A sly thief in a dark hoodie and eye mask carrying a loot sack, a little flame flickering in one hand.', 'tiny embers']],
  agua: [['A sailor in a striped shirt and sailor cap with an anchor tattoo and a coil of rope.', 'tiny water droplets'], ['A fisherman in waders and a floppy hat with a fishing rod and a bucket.', 'tiny water droplets and bubbles']],
  electrico: [['An engineer with a hard hat, goggles, a tool belt and a coil of cable.', 'tiny yellow sparks'], ['An electric technician in overalls with a lightning bolt patch, holding a multimeter.', 'tiny sparks and zigzags']],
  planta: [['A gardener with a straw hat and apron holding a watering can and pruning shears.', 'tiny leaves and petals'], ['A camper in a green vest and bandana carrying a rolled-up tent and a lantern.', 'tiny drifting leaves']],
  hielo: [['A skier in a puffy jacket, beanie and ski goggles holding ski poles.', 'tiny snowflakes'], ['A young trainee in a thick scarf and mittens with frosty breath.', 'tiny snowflakes']],
  lucha: [['An old martial arts master in a white gi with a black belt and a long moustache, serene pose.', 'tiny impact stars'], ['A martial artist in a white gi with a black belt and a headband, fighting stance.', 'tiny impact stars and sweat drops']],
  veneno: [['A ninja in a dark purple outfit with a mask and scarf, holding a small vial.', 'tiny purple wisps'], ['A chemist in a stained lab coat with a gas mask pushed up on the forehead and a bubbling green flask.', 'tiny toxic green bubbles']],
  tierra: [['An archaeologist in an explorer hat with a brush, a pickaxe and a satchel.', 'tiny dust specks and sand'], ['A digger in a hard hat and overalls leaning on a shovel.', 'tiny dust specks']],
  volador: [['A falconer with a leather arm guard and a feathered cap.', 'tiny floating feathers'], ['A bird scholar with binoculars, a notebook and a feather in the hat.', 'tiny feathers']],
  psiquico: [['A fortune-teller seer in a star-patterned robe and turban holding a crystal ball.', 'tiny glowing star dots'], ['A calm psychic in a violet robe with a headband and closed eyes, hands together.', 'tiny glowing dots']],
  bicho: [['An entomologist with a pith helmet, a magnifying glass and a pinned insect box.', 'tiny fluttering insects'], ['A young bug catcher boy with a straw hat, shorts, a butterfly net and a small cage on his belt.', 'tiny fluttering butterflies and green sparkles']],
  roca: [['A geologist with a helmet, a rock hammer and a sample bag.', 'tiny pebbles and crystal glints'], ['A sturdy hiker man with a big backpack, a rolled sleeping mat, a wide-brim hat, a trimmed beard and a walking stick.', 'tiny drifting pebbles and dust']],
  fantasma: [['A spiritist in a dark hooded robe holding candles and a spirit board.', 'tiny ghostly wisps and candle flames'], ['A medium in a long shawl holding a lantern, pale and dreamy.', 'tiny ghostly wisps']],
  dragon: [['A dragon tamer in scale armour with a horned helm and a chain.', 'tiny golden sparks'], ['A young apprentice in a scaled cape holding a small dragon egg.', 'tiny golden sparks']],
};
for (const [t, [rare, common]] of Object.entries(TYPE)) { set(`type:${t}:rare`, ...rare); set(`type:${t}:common`, ...common); }

// Líder de gimnasio y Alto Mando, por tipo
for (const [t, [look, parts]] of Object.entries(THEME)) {
  set(`gym:${t}`, `A confident gym leader in a sporty jacket with ${look}, a round gym badge pinned on the chest, hands on hips.`, parts);
  set(`elite:${t}`, `A stern elite-level champion trainer in a long ornate coat and cape with ${look}, gold trim and a high collar, arms crossed.`, parts);
}

set('champion', 'A majestic league champion in a long flowing cape with a circlet crown, medals on the chest and a proud stance.', 'tiny golden stars');
set('rocket:entrenador', 'A syndicate grunt in an all-black jumpsuit with a black beret and gloves, a plain dark emblem on the chest, standing at attention.', 'tiny dark smoke puffs');
set('rocket:lider', 'A cold villain syndicate executive in a sleek black uniform and black gloves, arms crossed, sharp haircut, menacing but stylish, a small red emblem on the chest.', 'dark purple wisps and a few red sparks');
set('rocket:altomando', 'A menacing crime boss in a dark tailored suit and a long coat with a scarlet tie, grey temples and a stern gaze, hands behind the back.', 'dark wisps and tiny red sparks');

const RAILS = {
  protagonista: ['A young aspiring monster-trainer with a bright teal cap, a yellow scarf, a backpack and a small capture ball on the belt, determined look.', 'tiny sparkles'],
  rival: ['A smug rival trainer with spiky silver hair, a teal jacket and an orange scarf, arms crossed with a smirk.', 'tiny sharp sparks'],
  profesor: ['An elderly professor with grey hair, round glasses and a white lab coat, holding a research notebook.', 'tiny floating formula symbols'],
  enfermera: ['A friendly nurse with a white cap marked with a small cross, a light pink dress and a white apron, warm smile, hands folded.', 'tiny pink hearts and soft sparkles'],
  policia: ['A police officer in a navy uniform and cap with a badge and a whistle, standing alert.', 'tiny blue and red flashes'],
  dependiente: ['A shop clerk in an apron and a visor holding a paper shopping bag, friendly smile.', 'tiny coins and sparkles'],
  fans: ['A fan club president with a sash and a rosette holding a big pennant with a star, beaming.', 'tiny confetti and stars'],
  guru: ['An old fishing guru with a long white beard and a straw hat holding a worn fishing rod, calm smile.', 'tiny water droplets'],
  guardia: ['A stern gate guard in a helmet and a heavy coat holding a barrier baton, arms firm.', 'tiny grey dust specks'],
  sabio: ['A wise elder in a long robe with long white eyebrows and a wooden staff, serene.', 'tiny glowing dots'],
  voluntario: ['A tower volunteer in a grey cloak holding flowers and a small lantern, gentle expression.', 'tiny petals and soft glints'],
  informatico: ['A computer geek in a hoodie with headphones around the neck holding a laptop, messy hair.', 'tiny green code pixels'],
  guia: ['A gym guide with a headband and a megaphone, cheerful cheering pose.', 'tiny star bursts'],
  vecino: ['A friendly neighbour in a cardigan and slippers waving a hand, warm smile.', 'tiny sparkles'],
  pokemaniaco: ['A collector obsessed with monsters, with big glasses and a bulging backpack covered in badges and plush toys.', 'tiny stars and badges'],
  empollon: ['A super nerd in thick glasses and a pocket protector holding a formula notebook.', 'tiny floating formula symbols'],
  motero: ['A biker in a leather jacket, goggles and a helmet, thumbs up.', 'tiny exhaust puffs and sparks'],
  picaro: ['A burglar in a striped shirt and an eye mask carrying a loot sack, tiptoeing grin.', 'tiny glints of coins'],
  malabarista: ['A juggler in a colourful jester outfit juggling three balls.', 'tiny colourful confetti'],
  macarra: ['A bald tough guy in sunglasses and a tank top with muscular arms, arms crossed.', 'tiny dust specks'],
  jugador: ['A gambler in a waistcoat and top hat fanning out playing cards.', 'tiny card suits and sparkles'],
  belleza: ['A glamorous woman in a sundress and a wide sun hat holding a small handbag.', 'tiny sparkles and flower petals'],
  rockero: ['A rocker with a mohawk and a studded vest holding an electric guitar.', 'tiny music notes and sparks'],
  domador: ['A beast tamer in a leather harness holding a whip, a feathered shoulder pad.', 'tiny dust specks'],
  caballero: ['A gentleman in a top hat and monocle with a tailcoat and a cane.', 'tiny golden glints'],
  cientifico: ['A scientist in a white lab coat with round glasses and a clipboard, slightly messy hair, a test tube in the pocket.', 'tiny floating bubbles and plus-shaped sparkles'],
  canalizador: ['A channeler in a long dark robe holding a candle, eyes half-closed.', 'tiny ghostly wisps'],
  nadador: ['A swimmer in swim trunks, a swim cap and goggles with a float ring.', 'tiny water droplets'],
  chica: ['A young girl in a skirt with hair ribbons and a cute small backpack.', 'tiny hearts and sparkles'],
};
for (const [id, [d, p]] of Object.entries(RAILS)) set(`rail:${id}`, d, p);
set('band:experto', 'A cool-headed expert trainer in a sleek jacket and a visor, arms folded, calm confident look.', 'tiny star glints');
set('band:joven', 'A very young novice trainer with an oversized cap and a small backpack, grinning.', 'tiny sparkles');

// Segunda ronda: candidatas rechazadas por Rafa, con diseños más distintivos.
set('type:volador:common', 'A human bird-watching scholar, clearly a person and not a bird, in a khaki vest and a hat with a long feather, holding binoculars and a notebook.', 'tiny floating feathers');
set('gym:planta', 'A confident gym leader in a leaf-patterned green sporty jacket with a large flower tucked behind the ear, a vine-wrapped belt and a round gym badge on the chest, hands on hips.', 'tiny drifting leaves and petals');
set('gym:volador', 'A confident gym leader in a sky-blue sporty jacket with feather-shaped trim on the shoulders and aviator goggles on the forehead, a round gym badge on the chest, hands on hips.', 'tiny floating feathers');
set('band:joven', 'A very young novice trainer with an oversized yellow cap, a small green backpack and a big grin, no red or white cap.', 'tiny sparkles');
set('elite:lucha', 'A stern martial-arts elite champion in a long black and crimson robe-coat open at the chest, a wide sash, wrapped fists, gold trim and a high collar, arms crossed.', 'tiny impact stars and sparks');

// Comprobación: todas las clases de las reglas tienen descripción.
export function check(keys) { const miss = keys.filter(k => !D[k]); if (miss.length) throw new Error('Sin descripción visual: ' + miss.join(', ')); }
export const PROMPTS = D;
export const fileOf = key => key.replace(/:/g, '-');
export const promptOf = key => `${STYLE} Character: ${D[key][0]} Particles: ${D[key][1]}.`;

"""Genera data/*.json a partir de los documentos de docs/.

Uso: python scripts/build_data.py
Los docs son la fuente mientras el catálogo esté en revisión; después, los JSON.
"""
import json, os, re, sys, unicodedata

DOCS = os.path.join(os.path.dirname(__file__), '..', 'docs')
OUT = os.path.join(os.path.dirname(__file__), '..', 'data')

TYPES = ['Normal', 'Fuego', 'Agua', 'Eléctrico', 'Planta', 'Hielo', 'Lucha', 'Veneno',
         'Tierra', 'Volador', 'Psíquico', 'Bicho', 'Roca', 'Fantasma', 'Dragón']


def slug(s):
    return unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()


def read(name):
    with open(os.path.join(DOCS, name), encoding='utf-8') as f:
        return f.read()


def rows(text):
    """Filas de tabla (lista de celdas) sin cabecera ni separador."""
    for line in text.splitlines():
        if line.startswith('|') and not line.startswith('|---'):
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            yield cells


# --- ejes
axes = []
ejes = read('Ejes de personalidad.md')
sect = ejes.split('## Los 15 ejes')[1].split('## ')[0]
for c in rows(sect):
    if c[0] == 'Tipo':
        continue
    axes.append({'type': slug(c[0]), 'typeName': c[0], 'name': c[1], 'low': c[2], 'high': c[3], 'measures': c[4]})
assert [a['typeName'] for a in axes] == TYPES, 'orden de ejes'
axis_by_name = {a['name']: a['type'] for a in axes}

# --- popularidad
pokemon = {}
pop = read('Popularidad de los Pokémon de Kanto.md')
for c in rows(pop):
    if c[0] == 'N.º':
        continue
    for i in range(0, len(c), 3):
        if not c[i]:
            continue
        pokemon[c[i + 1]] = {'id': int(c[i]), 'name': c[i + 1], 'popularity': int(c[i + 2]), 'types': []}
assert len(pokemon) == 151, len(pokemon)

# --- entradas simples
entries = []


def parse_simple(text, tslug):
    for c in rows(text):
        if c[0] == 'Pokémon' or len(c) != 4:
            continue
        name = re.sub(r'\s*\(\+[^)]*\)', '', c[0]).strip()
        assert name in pokemon, name
        entries.append({'pokemon': name, 'type': tslug, 'pos': int(c[1]), 'label': c[2], 'text': c[3]})
        if tslug not in pokemon[name]['types']:
            pokemon[name]['types'].append(tslug)


pilot = read('Entradas piloto, Normal y Dragón.md')
m_normal = re.search(r'## Normal: Sencillez(.*?)\n## Dragón', pilot, re.S).group(1)
m_dragon = re.search(r'## Dragón: Ambición(.*?)\n## Entrada de doble', pilot, re.S).group(1)
parse_simple(m_normal, 'normal')
parse_simple(m_dragon, 'dragon')
for t in TYPES:
    if t in ('Normal', 'Dragón'):
        continue
    parse_simple(read('Catálogo, %s.md' % t), slug(t))

# --- entradas dobles
doubles = []


def parse_doubles(text):
    for c in rows(text):
        if c[0] == 'Pokémon' or len(c) != 4:
            continue
        name = c[0].replace(', doble', '').strip()
        assert name in pokemon, name
        pos = {}
        for part in c[1].split('·'):
            mm = re.match(r'\s*(.+?)\s+(\d+)\s*$', part)
            pos[axis_by_name[mm.group(1)]] = int(mm.group(2))
        doubles.append({'pokemon': name, 'pos': pos, 'label': c[2], 'text': c[3]})


parse_doubles(pilot.split('## Entrada de doble selección')[1].split('## Qué revisar')[0])
parse_doubles(read('Catálogo, entradas de doble selección.md'))

# --- validaciones
for p in pokemon.values():
    assert 1 <= len(p['types']) <= 2, p
    p['types'].sort(key=lambda t: [a['type'] for a in axes].index(t))
dual = {n for n, p in pokemon.items() if len(p['types']) == 2}
assert {d['pokemon'] for d in doubles} == dual, (len(doubles), len(dual))
for d in doubles:
    assert sorted(d['pos']) == sorted(pokemon[d['pokemon']]['types']), d['pokemon']
    for t, v in d['pos'].items():
        simple = next(e for e in entries if e['pokemon'] == d['pokemon'] and e['type'] == t)
        assert simple['pos'] == v, ('posición distinta', d['pokemon'], t)
assert len(entries) == sum(len(p['types']) for p in pokemon.values())

os.makedirs(OUT, exist_ok=True)


def dump(name, data):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write('\n')


dump('axes.json', axes)
dump('pokemon.json', sorted(pokemon.values(), key=lambda p: p['id']))
dump('catalog.json', {'simple': entries, 'double': doubles})
print('ejes', len(axes), '| pokémon', len(pokemon), '| simples', len(entries), '| dobles', len(doubles), '| duales', len(dual))

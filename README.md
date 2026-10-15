# Oráculo Pokémon

*¿Qué dice tu selección de Pokémon sobre ti?*

Un generador pequeño para el género de los subreddits de Pokémon: eliges tu Pokémon favorito de cada tipo de Kanto y el oráculo te devuelve un perfil de personalidad.

- **Determinista y sin IA al ejecutarse.** La misma selección da siempre el mismo resultado. Es lo que permite compartirlo y discutirlo ("a mí me salió esto").
- **Solo Kanto, con el tipado de la primera generación:** 151 Pokémon y 15 tipos (sin Hada ni Acero).
- **Sin backend ni cuentas.** El objetivo es un único HTML estático.

> No es un test psicológico validado. Es un juego: usa vocabulario de personalidad para dar un texto reconocible, al estilo de un horóscopo.

## Cómo funciona

Cada uno de los 15 tipos es un eje de personalidad con dos polos (Agua = sensibilidad, Fuego = intensidad…). Cada Pokémon ocupa un punto de esa escala, con un texto propio. Tus 15 elecciones dan un perfil, un arquetipo y unas tensiones entre elecciones contradictorias. Los Pokémon más raros pesan más que los más populares, y los de doble tipo aportan también a su segundo eje.

El detalle completo está en [`docs/`](docs/), empezando por [Diseño del Oráculo Pokémon](docs/Dise%C3%B1o%20del%20Or%C3%A1culo%20Pok%C3%A9mon.md).

## Estado

Fase de diseño. Hay:

- el diseño y las [decisiones tomadas](docs/Decisiones%20de%20dise%C3%B1o.md),
- los 15 ejes y un primer borrador del catálogo (unas 275 entradas),
- una propuesta del motor, con una primera calibración por simulación y problemas abiertos (ver el [motor](docs/Motor%20de%20perfil%20y%20reglas%20de%20tensi%C3%B3n.md)).

Hay una interfaz de pruebas muy básica: abre `web/index.html` en el navegador (un solo archivo, sin servidor). Se regenera con `npm run web`. Además hay un motor y una simulación para calibrarlo:

- `data/`: ejes, Pokémon (tipos y popularidad), catálogo y tensiones en JSON. Se generan desde `docs/` con `npm run data` (necesita Python 3).
- `src/engine.js`: el motor, una función pura sin dependencias que servirá igual en Node y en el navegador.
- `web/`: la interfaz de pruebas (`template.html` es la fuente; `index.html` se genera).
- `sim/simulate.mjs`: simula miles de selecciones al azar para revisar el reparto de resultados. `npm run sim` (necesita Node 18 o superior).
El catálogo es un borrador escrito con ayuda de IA, pendiente de revisión humana; en ejecución no se usa IA.

## Documentación

Todo está en español.

| Documento | Contenido |
|---|---|
| [Diseño](docs/Dise%C3%B1o%20del%20Or%C3%A1culo%20Pok%C3%A9mon.md) | Idea, modelo, riesgos y alcance |
| [Decisiones de diseño](docs/Decisiones%20de%20dise%C3%B1o.md) | Las seis decisiones y su razonamiento |
| [Ejes de personalidad](docs/Ejes%20de%20personalidad.md) | Los 15 ejes y sus polos |
| [Motor de perfil](docs/Motor%20de%20perfil%20y%20reglas%20de%20tensi%C3%B3n.md) | Cálculo del perfil, arquetipos y tensiones |
| [Guía de voz](docs/Gu%C3%ADa%20de%20voz%20y%20estructura%20del%20cat%C3%A1logo.md) | Cómo se escriben las entradas |

## Aviso

Proyecto de fans, sin ánimo de lucro y sin relación con Nintendo, Game Freak ni The Pokémon Company. Pokémon y sus nombres son marcas de sus propietarios.

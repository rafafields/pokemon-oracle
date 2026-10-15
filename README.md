# Pokémon Oracle

**English** · [Español](README.es.md)

*What does your Pokémon selection say about you?*

A small generator for the genre you see on Pokémon subreddits: pick your favourite Pokémon of each Kanto type and the oracle returns a personality profile.

- **Deterministic, no AI at runtime.** The same selection always gives the same result, which is what makes it shareable and arguable ("this is what I got").
- **Kanto only, with first-generation typing:** 151 Pokémon and 15 types (no Fairy, no Steel).
- **No backend, no accounts.** The goal is a single static HTML file.

> This is not a validated psychological test. It is a game: it uses personality vocabulary to give a recognisable text, horoscope-style.

## How it works

Each of the 15 types is a personality axis with two poles (Water = sensitivity, Fire = intensity…). Each Pokémon sits at a point on that scale, with its own text. Your 15 picks produce a profile, an archetype and a few tensions between contradictory choices. Rarer picks weigh more than very popular ones, and dual-type Pokémon also contribute to their second axis.

The result never ties a text to a specific Pokémon, to keep the "magic".

The design documents live in [`docs/`](docs/) and are written in **Spanish**, starting with [Diseño del Oráculo Pokémon](docs/Dise%C3%B1o%20del%20Or%C3%A1culo%20Pok%C3%A9mon.md). The English version of the catalogue, pole phrases and tension texts is in [`docs/en/`](docs/en/).

## Status

Design phase. There is:

- the design and the [decisions taken](docs/Decisiones%20de%20dise%C3%B1o.md),
- the 15 axes and a first draft of the catalogue (about 275 entries, in Spanish and English),
- a proposal for the engine, with a first calibration by simulation and open problems (see the [engine doc](docs/Motor%20de%20perfil%20y%20reglas%20de%20tensi%C3%B3n.md)).

There is a very basic test interface: open `web/index.html` in a browser (a single file, no server). English is the default language, with a Spanish switch. Rebuild it with `npm run web`. Also included:

- `data/`: axes, Pokémon (types and popularity), catalogue, poles, tensions and the English translation, as JSON. Generated from `docs/` with `npm run data` (needs Python 3).
- `src/engine.js`: the engine, a pure function with no dependencies that works the same in Node and in the browser.
- `web/`: the test interface (`template.html` is the source; `index.html` is generated).
- `sim/simulate.mjs`: simulates thousands of random selections to check the spread of results. `npm run sim` (needs Node 18 or later).

The catalogue is a draft written with AI help, pending human review; no AI is used at runtime.

## Documentation

The documents are in Spanish.

| Document | Content |
|---|---|
| [Design](docs/Dise%C3%B1o%20del%20Or%C3%A1culo%20Pok%C3%A9mon.md) | Idea, model, risks and scope |
| [Design decisions](docs/Decisiones%20de%20dise%C3%B1o.md) | The six decisions and their reasoning |
| [Personality axes](docs/Ejes%20de%20personalidad.md) | The 15 axes and their poles |
| [Engine](docs/Motor%20de%20perfil%20y%20reglas%20de%20tensi%C3%B3n.md) | Profile calculation, archetypes and tensions |
| [Voice guide](docs/Gu%C3%ADa%20de%20voz%20y%20estructura%20del%20cat%C3%A1logo.md) | How the entries are written |
| [English translations](docs/en/) | Catalogue, poles and tensions in English |

## Notice and credits

Fan project, non-profit and unaffiliated with Nintendo, Game Freak or The Pokémon Company. Pokémon and Pokémon character names are trademarks of their owners: © Nintendo / Creatures Inc. / GAME FREAK inc.

Pokémon images are not included in the repository: the page loads them from [PokeAPI/sprites](https://github.com/PokeAPI/sprites) (a [PokeAPI](https://pokeapi.co) project) and they belong to their owners.

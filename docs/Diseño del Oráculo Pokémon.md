# Diseño del Oráculo Pokémon

## Idea

En los subreddits de Pokémon es habitual que alguien publique una selección ("mis favoritos de cada tipo de Kanto") y pregunte a la comunidad: *¿qué dice mi selección sobre mí?* El proyecto es un generador pequeño que responde a esa pregunta con un perfil, de forma **determinista y sin IA**, al estilo de un horóscopo.

Flujo: el usuario elige con selectores su Pokémon favorito de cada tipo, pulsa un botón («esto dice de ti») y obtiene su perfil.

## Por qué determinista

- Gratis y sin dependencias: un HTML estático basta.
- Sin alucinaciones: la misma selección da siempre el mismo resultado, y eso es lo que hace que se comparta y se discuta ("a mí me salió esto").
- Referencia: el horóscopo funciona por el efecto Barnum. No hace falta precisión, hace falta que se sienta reconocible.

## Modelo

1. **Tipos como ejes.** El espectro humano se divide en tantos ejes como tipos (Agua = sensibilidad, etc.). Kanto tiene 15 tipos con el tipado de la primera generación, así que hay 15 ejes.
2. **Pokémon como matices.** Cada Pokémon es un aspecto distinto dentro del eje de su tipo (Chansey y Tauros dicen cosas muy distintas del eje Normal).
3. **Perfil.** Cada eje es una escala con dos polos y cada Pokémon cae en un punto de ella. El resultado es un perfil de 15 ejes (radar) con la posición de la persona en cada uno. Los ejes están en [Ejes de personalidad](Ejes%20de%20personalidad.md).
4. **Texto compuesto**, no pegado: un arquetipo según los 2–3 ejes dominantes, frases por plantillas y reglas de tensión entre elecciones contradictorias ("mucha emoción y poca estructura").
5. **Listas por tipo.** Cada selector lista a todos los Pokémon con ese tipo, principal o secundario. Un mismo Pokémon puede estar en dos listas y elegirse en las dos; si pasa, se usa una entrada propia de doble selección del catálogo, que sustituye a las dos.
6. **Tipo secundario.** Un dual aporta también a su segundo eje, con un peso corregido por lo que se desvía tu selección de lo esperable. Veneno, que es secundario en muchos Pokémon de Kanto, pesa poco; Volador pesa más. Un solo mecanismo.
7. **Peso por rareza.** Las elecciones populares (Charizard) aportan poco; las poco habituales aportan más. Es lo que da la sensación de que el oráculo "te ha leído".

## Riesgos conocidos

| Riesgo | Detalle | Tratamiento |
|---|---|---|
| Tipos desbalanceados | Dragón tiene 3 Pokémon, Agua unos 30. Elegir en Dragón apenas distingue. | Ver [Casillas con pocos candidatos](Decisiones%20de%20dise%C3%B1o.md) |
| Tipos duales | Gyarados es Agua/Volador, Charizard Fuego/Volador; en Kanto no hay Volador puro. | [Tratamiento de los tipos duales](Decisiones%20de%20dise%C3%B1o.md) y [Casilla del tipo Volador y lista de cada Pokémon](Decisiones%20de%20dise%C3%B1o.md) |
| El favorito es más popularidad que personalidad | Lo común no distingue a nadie. | Popularidad de 1 a 5 escrita a mano, ver [Fuente y escala del peso por rareza](Decisiones%20de%20dise%C3%B1o.md) |
| Lista de galletas de la suerte | Frases sueltas no dan efecto "me ha leído". | Síntesis con arquetipos y reglas de tensión |
| Mucho contenido | unas 270 entradas (151 Pokémon, más una por cada tipo de un dual y una de doble selección), con voz propia. | Catálogo escrito una vez (ver [Quién escribe el catálogo de significados](Decisiones%20de%20dise%C3%B1o.md)), revisado a mano |

## Alcance de la v1

- 15 selectores, un resultado, sin cuentas ni backend.
- Un solo HTML estático.
- Solo Kanto (151).

## Fuera de alcance (por ahora)

- Otras generaciones.
- Otros formatos del género ("mi equipo de 6", "mi starter de cada región").
- Cuentas, guardado de resultados o ranking.
- Cualquier uso de IA en ejecución.

## Orden de trabajo

1. Ejes y significados de los 15 tipos (de ahí cuelga todo lo demás).
2. Decisiones de diseño (tipos duales, casillas pobres, rareza).
3. Catálogo de los 151 Pokémon.
4. Motor de perfil y reglas de tensión.
5. Interfaz y resultado.
6. Publicación y prueba en un subreddit.

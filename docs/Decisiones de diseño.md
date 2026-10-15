# Decisiones de diseño

Las seis decisiones tomadas por Rafa el 2026-10-15 antes de redactar el catálogo. Cada una indica qué se decidió, por qué y qué consecuencias tiene.

## Tipado de referencia, Gen 1 o actual

**Pregunta.** Algunos Pokémon de Kanto han cambiado de tipo desde la primera generación (Clefairy y Clefable eran Normal y ahora son Hada; Jigglypuff y Wigglytuff, Normal/Hada; Mr. Mime, Psíquico/Hada; Magnemite y Magneton, Eléctrico/Acero). ¿Qué tipado se usa?

**Decisión.** El de la primera generación: 15 tipos, sin Hada ni Acero. Clefairy y Clefable son Normal, Mr. Mime es Psíquico y Magnemite y Magneton son Eléctrico.

**Por qué.** Da 15 tipos limpios y la nostalgia de Kanto, que es el formato que se quiere imitar. Se descartó el tipado actual porque añade ejes (Hada, Acero) que no estaban en el diseño.

**Consecuencias.** Se mantienen los 15 ejes y los 15 selectores. Ningún Pokémon tiene tres tipos, así que la doble selección solo puede darse en dos casillas.

## Casilla del tipo Volador y lista de cada Pokémon

**Pregunta.** En Kanto ningún Pokémon es Volador puro: todos son duales. Si cada selector lista solo el tipo principal, Volador se queda sin casilla. ¿Cómo se resuelve?

**Decisión.** Todos los tipos tienen casilla, también Volador. Cada selector lista a todos los Pokémon que tengan ese tipo, sea principal o secundario, así que un mismo Pokémon puede aparecer en dos listas (Pidgey en Normal y en Volador). Se permite elegir el mismo Pokémon en varias casillas y eso influye en el resultado.

**Por qué.** Mantiene los 15 tipos como casillas, que es la gracia del formato, y no excluye a ningún Pokémon por ser dual. Elegir al mismo Pokémon dos veces es en sí una señal. Se descartó dejar Volador como eje solo derivado.

**Consecuencias.**
- Hay 15 selectores. Las listas con muchos duales crecen (Volador pasa a unos 19 candidatos).
- Un dual necesita un significado por cada uno de sus dos tipos: el catálogo pasa de 151 a unas 270 entradas.
- Elegir al mismo Pokémon en sus dos casillas se resuelve en el catálogo con una entrada propia de doble selección, que sustituye a las dos; el motor no suma nada más.

## Tratamiento de los tipos duales

**Pregunta.** ¿Cómo se trata a un Pokémon de doble tipo en los selectores?

**Decisión.** Cada Pokémon aporta a un eje si es de un solo tipo y a dos si es dual: el principal con peso completo y el secundario con un peso corregido por cuánto se desvía la selección de lo esperable (los tipos secundarios muy frecuentes, como Veneno, pesan poco; los poco frecuentes, como Volador, pesan más). Es un único mecanismo, sin un conteo de repeticiones aparte. Si el Pokémon se elige en las dos casillas de sus tipos, se usa su entrada de doble selección en lugar de sumar ambas.

**Por qué.** Un dual dice más que un Pokémon de un solo tipo, y ignorar su segundo tipo tira información. Así cada elección aporta más sin añadir casillas. Se descartaron tratarlo solo por su tipo primario y bloquearlo en la otra lista.

**Consecuencias.** El motor calcula la desviación del tipo secundario respecto a lo esperable y la usa como peso (ver [Motor de perfil y reglas de tensión](Motor%20de%20perfil%20y%20reglas%20de%20tensi%C3%B3n.md)).

## Casillas con pocos candidatos

**Pregunta.** Dragón tiene 3 Pokémon y Agua unos 30. ¿Cómo se trata que unas casillas distingan mucho más que otras?

**Decisión.** Se mantienen los 15 tipos y cada casilla pesa lo mismo, tenga 3 o 30 candidatos.

**Por qué.** Con pocos candidatos la gracia no se pierde: dentro de cada tipo los Pokémon recorren casi todo el espectro del eje. Dratini es una cría con gran potencial, Dragonair un dragón estilizado y poderoso, Dragonite un dragón colosal pero con gran corazón. Se descartó ponderar por número de candidatos y fusionar o quitar tipos pobres.

**Consecuencias.**
- En los tipos pobres (Dragón, Fantasma), cada Pokémon debe cubrir un tramo muy distinto del eje.
- Con pocas opciones habrá más perfiles iguales en esas casillas; se compensa con el resto de ejes y con el peso por rareza.

## Fuente y escala del peso por rareza

**Pregunta.** ¿Cómo se mide la rareza de una elección y cuánto pesa en el perfil?

**Decisión.** Cada Pokémon lleva una puntuación de popularidad escrita a mano, de 1 (poco elegido) a 5 (muy elegido). Cuanto más popular, menos aporta la elección al perfil.

**Por qué.** No depende de datos externos que haya que citar ni mantener, y encaja con un proyecto que ya es subjetivo. La IA propone la puntuación y Rafa la corrige. Se descartaron usar una encuesta pública y no usar rareza.

**Consecuencias.** La puntuación es por Pokémon, no por entrada: un dual tiene la misma en sus tres entradas. El peso de cada nivel se fija en el motor y se calibra por simulación (ver [Motor de perfil y reglas de tensión](Motor%20de%20perfil%20y%20reglas%20de%20tensi%C3%B3n.md)).

## Quién escribe el catálogo de significados

**Pregunta.** ¿Quién redacta los significados y los textos del resultado?

**Decisión.** La IA redacta el catálogo una sola vez y Rafa lo revisa. Sigue siendo determinista en ejecución.

**Por qué.** Son unas 275 entradas más los textos del resultado, y escribirlas a mano es el mayor coste del proyecto. Revisarlas mantiene el control de la voz. Se descartó escribirlo todo a mano.

**Consecuencias.** Hizo falta una guía de voz y de estructura por entrada ([Guía de voz y estructura del catálogo](Gu%C3%ADa%20de%20voz%20y%20estructura%20del%20cat%C3%A1logo.md)). Rafa revisa cada entrada y la IA no se usa en ejecución.

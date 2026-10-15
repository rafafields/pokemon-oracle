# Guía de voz y estructura del catálogo

Borrador para redactar el catálogo con IA y revisarlo a mano ([Quién escribe el catálogo de significados](Decisiones%20de%20dise%C3%B1o.md)). Las entradas piloto que siguen esta guía están en [Entradas piloto, Normal y Dragón](Entradas%20piloto%2C%20Normal%20y%20Drag%C3%B3n.md); el resto del catálogo está en los documentos `Catálogo, <tipo>` y en [Catálogo, entradas de doble selección](Cat%C3%A1logo%2C%20entradas%20de%20doble%20selecci%C3%B3n.md).

## Voz

- **Segunda persona, tú, presente.** Se describe a quien elige, no al Pokémon.
- **Sin marcas de género.** El texto habla a cualquier persona, así que se evitan los adjetivos y participios que concuerdan con quien lee ("cercano", "reservado", "orgulloso", "seguro"). Se usan sustantivos ("tu cercanía"), verbos ("tiendes a"), adjetivos invariables (fuerte, sensible, capaz, paciente, leal) o se refieren a lo que se tiene y no a lo que se es. Vale "Eres de las personas que...".
- **Cada matiz se inspira en el carácter del Pokémon, pero no lo menciona.** Ni su cuerpo, ni sus objetos, ni sus ataques, ni su historia: el texto se lee como algo sobre la persona. El rasgo reconocible se traduce a una actitud (un Pokémon que pelea por su espacio se convierte en alguien que defiende el suyo). Un matiz que valdría para cualquier Pokémon está mal.
- **Un punto fuerte y su coste.** Cada entrada dice algo bueno y su lado B, sin que ninguno de los dos polos suene a juicio. Es lo que permite que el resultado se sienta cierto sin molestar.
- **Variar el cierre.** El coste no siempre se escribe como "Te cuesta…" ni como "A veces…": puede ser una paradoja, una consecuencia, una frase corta o un matiz sin coste explícito. Si más de una de cada diez entradas cierra igual, se nota la plantilla.
- **Sin jerga psicológica, sin diagnóstico y sin "debes".** Es un horóscopo, no un informe.
- **Un guiño leve, nunca a costa de quien lee.** Sin consejos directos ("deberías", "te vendría bien" a repetición) ni reproches.
- **Frases cortas.** Sin nombres de Pokémon dentro del matiz. Las metáforas genéricas (calor, corriente, altura) valen; las que solo tienen sentido para ese Pokémon, no.

## Estructura de cada entrada

| Campo | Contenido |
|---|---|
| Pokémon | Nombre. |
| Eje | El del tipo de la casilla (ver [Ejes de personalidad](Ejes%20de%20personalidad.md)). |
| Posición | De 0 (polo bajo) a 10 (polo alto). *Escala propuesta; confirmar con el motor.* |
| Etiqueta | De 2 a 4 palabras. |
| Matiz | De 20 a 45 palabras, 2 o 3 frases. |

**La popularidad no va en la entrada.** Es un valor por Pokémon, de 1 a 5, y vive en una sola tabla ([Popularidad de los Pokémon de Kanto](Popularidad%20de%20los%20Pok%C3%A9mon%20de%20Kanto.md)) para que un mismo Pokémon no tenga valores distintos en sus entradas ([Fuente y escala del peso por rareza](Decisiones%20de%20dise%C3%B1o.md)).

**Entradas de doble selección** (un dual elegido en sus dos casillas, ver [Casilla del tipo Volador y lista de cada Pokémon](Decisiones%20de%20dise%C3%B1o.md)): llevan dos posiciones, una por eje, y un solo matiz. No es la suma de las dos entradas simples: habla de lo que significa elegir al mismo Pokémon dos veces.

## Reparto de posiciones

- **Tipos ricos** (Normal, Agua, Veneno...): repartir los Pokémon por toda la escala. Evitar que se acumulen en el centro, porque un centro lleno no distingue a nadie.
- **Tipos pobres** (Dragón, Fantasma): cubrir al menos 7 puntos de la escala con 3 candidatos, y dar a cada Pokémon un subtema distinto ([Casillas con pocos candidatos](Decisiones%20de%20dise%C3%B1o.md)).
- **Líneas evolutivas:** cada fase es un punto distinto de la escala, con su propio matiz, y no la misma entrada repetida.

## Proceso

1. La IA redacta por tipo, con los Pokémon de esa casilla juntos, para controlar el reparto.
2. Rafa revisa y corrige posiciones y popularidad, que son lo más subjetivo.
3. Se comprueba el reparto de cada eje (rango y acumulaciones) antes de pasar al siguiente tipo.

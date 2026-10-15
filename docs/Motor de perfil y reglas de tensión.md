# Motor de perfil y reglas de tensión

Propuesta de cómo se convierte una selección de 15 Pokémon en un perfil y en un texto, sin IA y de forma determinista. **Todos los números son valores iniciales sin probar**: se calibran con una simulación antes de darlos por buenos (ver el final). Borrador de IA, pendiente de revisión por Rafa. Parte de [Diseño del Oráculo Pokémon](Dise%C3%B1o%20del%20Or%C3%A1culo%20Pok%C3%A9mon.md), [Ejes de personalidad](Ejes%20de%20personalidad.md) y el catálogo (Catálogo de significados de los 151 Pokémon).

## Entrada y salida

- **Entrada:** 15 selecciones, una por cada tipo (el Pokémon elegido en cada casilla).
- **Salida:** perfil de 15 valores (0 a 10, uno por eje), un arquetipo, hasta 2 tensiones, una frase sobre patrones de tipo secundario si procede, y el texto de las entradas más reveladoras.
- Todo es una función pura de la selección. Los empates se resuelven siempre por el orden fijo de los ejes de [Ejes de personalidad](Ejes%20de%20personalidad.md), nunca al azar.

## 1. Contribuciones

Cada selección genera una o dos contribuciones `(eje, posición, peso)`:

1. **Primaria.** El Pokémon elegido en la casilla del tipo T contribuye al eje T con la posición de su entrada simple en T.
2. **Secundaria.** Si es dual (tipos T y U) y se eligió en la casilla T, contribuye también al eje U con la posición de su entrada simple en U, y con peso reducido (sección 3).
3. **Doble selección.** Si el mismo dual se eligió en las dos casillas (T y U), no se suman sus dos entradas simples ni se aplica el peso reducido: se usa **su entrada de doble selección**, que da una posición a cada eje con peso completo. El resultado debe decir que se ha elegido dos veces ("Has elegido a X en dos casillas…").

Cada selección cuenta una sola vez por eje: un Pokémon elegido solo en T aporta a T (primaria) y a U (secundaria), nunca dos veces a T.

## 2. Peso por popularidad

La popularidad está en [Popularidad de los Pokémon de Kanto](Popularidad%20de%20los%20Pok%C3%A9mon%20de%20Kanto.md) (5 = muy habitual, 1 = poco habitual). Propuesta:

| Popularidad | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|
| Peso `p` | 0,5 | 0,7 | 1,0 | 1,3 | 1,6 |

Lo habitual dice menos de ti y lo infrecuente dice más. El rango (de 0,5 a 1,6) es deliberadamente estrecho: una elección rara inclina el perfil pero no lo decide sola. Como la tabla de popularidad es una estimación sin datos, estos pesos no deben ser fuertes.

## 3. Peso del tipo secundario (desviación sobre lo esperable)

Una sola fórmula, con la misma idea que se decidió en [Tratamiento de los tipos duales](Decisiones%20de%20dise%C3%B1o.md):

- **Esperado** `E(U)`: suma, sobre las 15 casillas, de la probabilidad de que un Pokémon elegido al azar en esa casilla tenga a U como segundo tipo (nº de Pokémon de la lista de esa casilla con U como otro tipo, dividido entre el tamaño de la lista). Se calcula **una vez, al construir la página, a partir del catálogo**.
- **Observado** `O(U)`: cuántas de las 15 selecciones tienen a U como otro tipo.
- **Desviación** `d(U) = O(U) − E(U)`.
- **Peso secundario** `s(U) = clamp(0,3 + 0,3 · d(U), 0,1 , 1)`.

Resultado: si eliges más duales con Veneno de lo que cabría esperar, ese segundo eje pesa más; si es lo habitual (Veneno sale mucho por azar), pesa poco. El peso de una contribución es `p · 1` si es primaria y `p · s(U)` si es secundaria.

**Frase de patrón.** Se comenta un patrón de tipo secundario solo si `O(U) ≥ 4` y `d(U) ≥ 2,5`. Se comenta como máximo uno (el de mayor `d`), y no se comenta nunca un tipo que ya salga entre los ejes dominantes para no repetir.

## 4. Valor de cada eje

Para cada eje `a`, con sus contribuciones `i`:

`v(a) = Σ(pᵢ · wᵢ · posᵢ) / Σ(pᵢ · wᵢ)`

con `wᵢ = 1` si es primaria o de doble selección y `wᵢ = s(U)` si es secundaria. Como cada eje tiene siempre su selección primaria, el denominador nunca es cero. El resultado se redondea a un decimal y se usa sin redondear en los cálculos internos.

**Intensidad** del eje: `|v(a) − 5|`. Es lo que se mira para decidir qué destaca.

## 4 bis. Polo e intensidad

- **Polo** de un eje: por la posición absoluta. Por encima o igual a 5, polo alto; por debajo, polo bajo. El centro de la escala es 5.
- **Intensidad** (con la normalización activada, que es lo por defecto): cuántas desviaciones típicas se aparta el valor de la media de ese eje (media y dispersión calculadas una vez con 4.000 selecciones al azar y semilla fija). Así un eje cuyos Pokémon tienden a puntuar alto, como Tierra, no domina los resultados solo por eso.
- **Solo cuenta si va en la dirección del polo.** Si alguien está en 5,5 en un eje con media 6,9, su polo es el alto, pero está por debajo de lo habitual, así que su intensidad es 0 y ese eje no destaca. De este modo el texto y la posición nunca se contradicen.
- Sin normalizar, la intensidad es simplemente la distancia a 5.

## 5. Arquetipo

1. Se ordenan los ejes por intensidad, de mayor a menor. Empates: orden fijo de ejes.
2. Los **dos primeros** dan el arquetipo; el **tercero**, si su intensidad es ≥ 2, añade una frase de matiz.
3. Cada polo de cada eje (30 en total) lleva en su ficha tres textos escritos una vez:
   - un **nombre** en forma de sustantivo ("Reserva", "Vehemencia"), los mismos de [Ejes de personalidad](Ejes%20de%20personalidad.md),
   - una **tendencia** (una frase de unas 15 palabras),
   - una **sombra** (su coste, otra frase corta).
4. **Título del arquetipo:** `{nombre del polo 1} con {nombre del polo 2}`, en sustantivos para respetar la regla de [Guía de voz y estructura del catálogo](Gu%C3%ADa%20de%20voz%20y%20estructura%20del%20cat%C3%A1logo.md) sobre género.
5. **Párrafo de apertura:** tendencia 1 + conector + tendencia 2. El conector se elige entre 3 o 4 variantes según el par (suma, contraste o matiz), para que no suene a plantilla.

Si ningún eje supera intensidad 1,5 (perfil muy plano), el arquetipo es uno especial, "Equilibrio", con texto propio.

Con 30 polos hay 435 pares posibles; no se escriben a mano: se componen. Lo que se escribe a mano son los 30 polos y los conectores.

## 6. Reglas de tensión

Una tensión es una contradicción visible entre dos partes del perfil. Dos tipos:

**Entre ejes.** Hay una tabla de pares de polos que se contradicen, escrita a mano (son 12 pares, en `data/tensions.json`; la tabla muestra una parte):

| Polo A | Polo B | Idea |
|---|---|---|
| Apertura emocional (Agua alta) | Reserva (Hielo alta) | Sientes mucho y lo muestras poco. |
| Ambición (Dragón alta) | Espontaneidad (Lucha baja) | Quieres llegar lejos sin plan. |
| Independencia (Volador alta) | Cuida y hace crecer (Planta alta) | Cuidas a los demás y necesitas tu espacio. |
| Cuidado (Planta alta) | Escepticismo (Veneno alta) | Proteges a quien no acabas de creer. |
| Idealismo (Tierra baja) | Escepticismo (Veneno alta) | Crees en algo y lo tratas con ironía. |
| Vehemencia (Fuego alta) | Reserva (Hielo alta) | Arde por dentro y se nota poco. |

Una tensión se activa si **ambos polos tienen intensidad ≥ 3** (en el sentido de la tabla). Se muestran como máximo **2**, ordenadas por el producto de las dos intensidades.

**Dentro de un eje.** Si las contribuciones de un mismo eje difieren en 9 o más posiciones (por ejemplo una primaria en 0 y una secundaria en 9), se activa una tensión interna del eje: "te mueves entre dos extremos en X". Cuenta como una de las 2 tensiones y va después de las de entre ejes en caso de empate.

Si no se activa ninguna, el resultado no dice nada de tensiones (no se rellena con una frase de relleno).

## 7. Qué texto se muestra

1. Título del arquetipo y párrafo de apertura.
2. Hasta 3 **entradas reveladoras** del catálogo: las de mayor `p · intensidad de su eje`. Se muestra la etiqueta y el matiz tal como están escritos, mencionando el Pokémon elegido.
3. Las tensiones activas (0 a 2).
4. La frase de patrón de tipo secundario, si procede.
5. Si hubo doble selección, una frase que lo dice y la entrada propia.
6. Aviso fijo de que no es un test validado (ver [Diseño del Oráculo Pokémon](Dise%C3%B1o%20del%20Or%C3%A1culo%20Pok%C3%A9mon.md)).

## Casos de prueba mínimos

El motor debe pasar, antes de darlo por bueno:

1. La misma selección da siempre exactamente el mismo resultado.
2. Selección sin duales: 15 contribuciones primarias, ninguna secundaria ni patrón.
3. Un dual elegido solo en una casilla: aporta a los dos ejes y el segundo con peso `s(U)`.
4. Un dual elegido en sus dos casillas: se usa la entrada doble, no las simples, y el texto lo menciona.
5. Pokémon de popularidad 5 en todas las casillas: perfil válido, sin errores por pesos bajos.
6. Perfil plano (todo cerca de 5): sale "Equilibrio", sin tensiones.
7. Perfil con todos los extremos: no pasa de 2 tensiones.
8. Empate exacto de intensidades: gana el eje primero del orden fijo.

## Calibración

Los valores de este documento (pesos de popularidad, `0,3 + 0,3·d`, umbrales 1,5 / 3 / 6) son propuestas. La forma de comprobarlos es **simular** unas 10.000 selecciones al azar sobre el catálogo y mirar:

- que ningún arquetipo concentre más de ~5 % de los casos,
- que las tensiones aparezcan en una proporción razonable (ni casi siempre ni casi nunca),
- que la frase de patrón secundario salga en pocos casos (una de cada 10 o menos),
- que el perfil medio no se desplace sistemáticamente a un polo, que sería señal de entradas mal repartidas (ya se sospecha en Roca, Tierra y Volador).

El script es `sim/simulate.mjs` (`npm run sim`).

## Resultado de la primera calibración

10.000 selecciones al azar, en dos modos: **uniforme** (cada Pokémon de la lista con la misma probabilidad) y **ponderado por popularidad** (lo habitual se elige más, más parecido a un usuario real). Datos con el catálogo en borrador.

| Medida | Valores iniciales | Tras ajustar | Objetivo |
|---|---|---|---|
| Tensiones (0 / 1 / 2) | 9 / 26 / 65 % | 38 / 36 / 26 % (uniforme) | que 2 no sea lo habitual |
| Frase de patrón secundario | 34 % (uniforme), 49 % (ponderado) | 6 % y 15 % | una de cada 10 o menos |
| Arquetipo más frecuente | 3,6 % | 3,6 % | no pasar de ~5 % |
| Arquetipos distintos | 511 | 511 | muchos |

Se ajustaron tres umbrales: tensión interna de un eje a 8 posiciones o más (antes 6), y patrón secundario con al menos 4 casos y desviación de 2,5 o más. Con los de antes, Veneno disparaba una tensión interna en el 41 % de los casos porque casi siempre recibe contribuciones de muy distinto signo de Planta, Bicho y Fantasma.

**Problemas que quedan y no se resuelven con umbrales:**

1. **Los ejes están escorados.** Con selecciones al azar, la media del eje no es 5: Tierra sale en 7,0 (el 68 % de las veces por encima de 6,5), Volador en 6,5, Fuego en 6,4 y Eléctrico en 6,4; Agua en 4,3. Es la sospecha de extremos poco poblados (Tierra, Volador, Roca) confirmada. Como el arquetipo se elige por la distancia a 5, esos ejes dominan los resultados.
2. **El perfil plano no existe.** "Equilibrio" no salió nunca (0 %): entre 15 ejes siempre hay alguno lejos de 5. Ese caso especial sobra con el umbral actual.
3. **La doble selección es frecuente**: 23 % (uniforme) y 42 % (ponderado). Es una cifra alta; las entradas dobles se verán a menudo y su calidad pesa mucho.
4. **El arquetipo** depende mucho de la escora del punto 1, aunque la variedad es buena (más de 450 arquetipos distintos).

**Resuelto con la normalización (ver más abajo).** Propuesta original para el punto 1: medir la intensidad del eje respecto a su media y su dispersión típicas, no respecto a 5 (una puntuación estándar con valores que se calculan una vez a partir del catálogo, como el esperado del tipo secundario). Así un Tierra de 7 es lo normal y no destaca, y destaca lo que se aparta de lo habitual en ese eje. La alternativa es reequilibrar las entradas, que es más trabajo y toca el texto. Es decisión de Rafa.

## Decisiones que se dejan a Rafa

- Si mostrar al usuario el radar de 15 ejes o solo el texto (el radar ayuda a compartir, pero invita a leerlo como test).
- Si el título compuesto ("Reserva con Ambición") suena bien o conviene dar un nombre propio a los pares más frecuentes.

## Segunda calibración: escala completa y polo absoluto

Tras comprobar que en ningún eje había entradas en la posición 0 y que seis ejes empezaban en 2, se **reestiraron las posiciones** de cada eje para ocupar de 0 a 10 sin cambiar el orden, y se **corrigió el polo** para que lo decida la posición absoluta (el punto 4 bis). Efecto con 10.000 selecciones al azar (modo uniforme):

| Medida | Antes | Después |
|---|---|---|
| Media del eje más escorada | Tierra 7,0 | Tierra 6,4 |
| Tierra por debajo de 3,5 | 4,5 % | 10,9 % |
| Volador por debajo de 3,5 | 7,4 % | 19,4 % |
| Arquetipos distintos | 746 | 733 |
| Arquetipo más frecuente | 0,9 % | 1,2 % |
| Tensiones 0 / 1 / 2 | 42 / 34 / 24 % | 51 / 35 / 15 % (con los umbrales nuevos) |

Se reajustaron dos umbrales: tensión interna de un eje a 9 posiciones o más y tensión entre ejes con intensidad de 1,2 o más. Sin reajustar, el reestiramiento subía el 2 tensiones al 48 %.

**Lo que sigue abierto:** Tierra sigue por encima de la media (6,4) y Agua queda escorada hacia abajo (3,6): el reestiramiento acerca los ejes al centro pero no crea candidatos en los polos bajos de Tierra, Volador, Roca, Fuego o Eléctrico, ni en el alto de Agua. Eso depende de reorientar los polos o de reescribir los candidatos más bajos.

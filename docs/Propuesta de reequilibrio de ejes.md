# Propuesta de reequilibrio de ejes

Qué hacer con los polos poco poblados (B: reorientar ejes, C: reescribir o recolocar candidatos). Es una **propuesta, no está aplicada**. Los números salen de simulaciones sobre el catálogo en borrador, tras reestirar la escala a 0–10 y corregir el polo ([Motor de perfil y reglas de tensión](Motor%20de%20perfil%20y%20reglas%20de%20tensi%C3%B3n.md)).

## 1. Diagnóstico: ¿se puede llegar a cada polo?

La medida útil no es cuántos candidatos hay en cada extremo, sino esta: **si alguien elige deliberadamente el candidato más extremo de un polo, ¿su eje acaba realmente en ese polo?** Se simuló 1.500 veces por polo, con el resto de casillas al azar. Porcentaje de veces que el eje acaba del lado esperado (≤ 3,5 en el polo bajo, ≥ 6,5 en el alto):

| Eje | Eligiendo el más bajo | Eligiendo el más alto |
|---|---|---|
| Normal | 100 % | 83 % |
| Fuego | 100 % | 100 % |
| Agua | 100 % | **66 %** |
| Eléctrico | 100 % | 100 % |
| Planta | 99 % | 85 % |
| Hielo | 97 % | 99 % |
| Lucha | 100 % | 100 % |
| Veneno | 93 % | **64 %** |
| Tierra | **82 %** | 100 % |
| Volador | **84 %** | 97 % |
| Psíquico | 100 % | 85 % |
| Bicho | 99 % | 96 % |
| Roca | 97 % | 98 % |
| Fantasma | 100 % | 97 % |
| Dragón | 100 % | 100 % |

**Conclusión: el problema es mucho menor de lo que parecía antes de reestirar la escala.** En 24 de los 30 polos se llega al menos el 90 % de las veces. Los polos débiles son cuatro: **Veneno alto (64 %), Agua alto (66 %), Tierra bajo (82 %) y Volador bajo (84 %)**. Los de Fuego, Eléctrico y Roca, que eran la sospecha, funcionan.

## 2. Por qué fallan esos cuatro polos

Tres causas, y solo una es de candidatos:

1. **La popularidad diluye la propia elección.** Los Pokémon que más se eligen como extremo (Gengar en Veneno, Gyarados en Agua, Snorlax en Normal, Mewtwo en Psíquico, Venusaur en Planta) tienen popularidad 5, es decir, peso 0,5. Quien elige a su favorito en una casilla ve cómo sus contribuciones de segundo tipo, con más peso relativo, tiran el eje hacia el centro. Es contradictorio: la elección más personal pesa menos que el resto.
2. **Las contribuciones de segundo tipo.** Veneno y Agua reciben muchas de Pokémon de otros tipos (Planta, Bicho y Fantasma con Veneno; Roca, Hielo y Psíquico con Agua), con posiciones intermedias, y ahí se diluye cualquier extremo.
3. **Pocos candidatos.** Solo afecta de verdad a Tierra bajo: apenas dos candidatos en 0–3 (Cubone y Marowak).

## 3. B: reorientar los ejes

**No lo recomiendo para ningún eje.** El diagnóstico lo descarta: Fuego, Eléctrico y Roca llegan a los dos polos con 97–100 %, y los cuatro polos débiles no se arreglan cambiando el significado del eje, sino con la causa 1 o la 2.

La única duda es **Tierra (Idealismo ↔ Pragmatismo)**, por tener pocos idealistas. Reorientarlo (por ejemplo, a "Desapego ↔ Apego a lo material") cambiaría las 14 entradas del tipo, y con la reubicación de la sección 4 llega al 98 %. No compensa.

## 4. C: recolocar o reescribir candidatos

Movimientos concretos, con su efecto en una simulación de 8.000 selecciones al azar:

| Cambio | Tipo | De | A | Texto |
|---|---|---|---|---|
| Diglett | Tierra | 8 | 3 | Reescribir (abajo) |
| Raichu | Eléctrico | 6 | 3 | Sin cambios: "Tienes una energía contenida…" ya encaja con el polo pausado |

Efecto: la proporción de resultados de Tierra por debajo de 3,5 pasa de 11 % a 14 %, y la media de Tierra de 6,4 a 6,1; la de Eléctrico por debajo de 3,5 pasa de 22 % a 34 %. Son mejoras reales pero pequeñas.

**Propuesta de texto para Diglett en Tierra (posición 3):**

> **Convicción callada.** Haces tu parte por convicción y no por reconocimiento. Trabajas en lo que crees incluso cuando nadie lo ve. Tu idealismo no hace ruido, y por eso a veces pasa por simple costumbre.

**Lo que probé y descarto.** Mover cuatro candidatos de Agua hacia arriba (Squirtle 3 → 5, Seadra 4 → 6, Poliwhirl 4 → 5, Dewgong 6 → 7) apenas cambia el eje (la media sube de 3,6 a 3,8 y el polo alto de 11 % a 12 %). La asimetría de Agua es estructural: con 32 candidatos, la mayoría son criaturas reservadas. No merece la pena forzarlo.

## 5. La causa 1: popularidad y diseño (opción E)

Es la que más afecta y la más delicada, porque toca el modelo. Se probó un modo alternativo: la popularidad ya no pondera la posición del eje, solo decide **qué ejes destacan** (multiplica su intensidad). Está en el motor como `popMode: 'dominance'` (el comportamiento actual es `'profile'`, que es el valor por defecto).

| Medida | `profile` (actual) | `dominance` |
|---|---|---|
| Veneno alto | 64 % | 87 % |
| Agua alto | 66 % | 77 % |
| Normal alto | 83 % | 100 % |
| Tierra bajo | 82 % | 98 % |
| Volador bajo | 84 % | **69 %** |
| Veneno bajo | 93 % | **83 %** |
| Arquetipos distintos | 733 | 549 |

No es mejora clara: arregla varios polos y empeora otros (Volador bajo, Veneno bajo), porque sin el peso de popularidad las contribuciones de segundo tipo ganan peso relativo, y además reduce la variedad de arquetipos.

**Recomendación:** no cambiarlo todavía. Primero probar con otras personas si de verdad molesta que su Pokémon favorito, popular, tenga menos efecto en su propio eje. Si sí, la alternativa a medir es bajar el peso mínimo y máximo del segundo tipo en lugar de tocar la popularidad.

## 6. Resumen de recomendaciones

1. **Aplicar** los dos movimientos de la sección 4 (Diglett y Raichu), con el texto propuesto de Diglett.
2. **No hacer B** en ningún eje.
3. **No tocar Agua.**
4. **Dejar abierta la opción E** hasta tener pruebas con otras personas, y medir antes una variante con el peso del segundo tipo más bajo.

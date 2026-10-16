# Arquetipos de entrenador

Propuesta para que el resultado deje de ser solo un título de arquetipo y pase a ser un **entrenador del mundo Pokémon**: un entrenador de ruta, un líder de gimnasio, un miembro del Alto Mando, un ejecutivo del Equipo Rocket, un profesor o un NPC. Es un borrador para discutir; nada de esto está en el motor todavía. Alcance acordado con Rafa: solo Kanto (clases de Generación I y FRLG, más NPC de Kanto) y solo el Equipo Rocket como organización criminal.

## El modelo: clase + estilo

El resultado se compone de dos capas independientes:

1. **Clase de entrenador** (unas 60, escritas a mano): sale de los polos dominantes del perfil, salvo en el caso de gimnasio y Alto Mando, donde manda el tipo predominante de las 15 elecciones. Es el titular nuevo.
2. **Estilo**: el título de arquetipo actual (por ejemplo «Espontaneidad con gusto por lo sencillo»), que sale de los dos polos dominantes y de un tercero si pesa mucho. Pasa a ser el subtítulo.

Un resultado queda como *«Cazabichos · Espontaneidad con gusto por lo sencillo»*. Las clases son unas 60 y los estilos unos 720, de modo que la variedad total sigue siendo la de los 720 arquetipos actuales (más la variación por tipo predominante en los líderes), sin escribir un texto por cada combinación. El cuerpo del resultado no cambia: sigue siendo la combinación de frases de los polos. Por clase solo hay que escribir un nombre y dos frases de «cómo te ven».

## Cómo se decide la clase

Orden de prioridad, de arriba abajo; gana la primera regla que se cumple.

1. **Equipo Rocket**: ambición alta, pragmatismo alto y cuidado bajo. La variante (Ejecutivo, Científico, Jefe) la elige el segundo polo.
2. **Profesor y mentores** (profesor, criador, enfermera): curiosidad abstracta alta y cuidado alto.
3. **Líder de gimnasio o Alto Mando**: un tipo predominante en las 15 elecciones (ver abajo).
4. **Campeón**: varios ejes extremos a la vez, con ambición y constancia altas.
5. **Protagonista**: ambición alta, independencia y energía altas, escepticismo bajo.
6. **Rival**: ambición e intensidad altas, con algo de escepticismo.
7. **Entrenador de ruta o NPC**: el resto. Se elige la clase cuya **firma** encaja mejor con el perfil.

La firma de una clase es un conjunto de dos o tres polos con signo y peso. La clase con mayor encaje (suma de la intensidad de cada polo de la firma) gana, y los empates se resuelven siempre igual, con un orden fijo. Es determinista y reutiliza la intensidad por polo que ya calcula el motor.

## Los 15 tipos y su rol

El tipo predominante se calcula contando cuántos de tus 15 Pokémon llevan ese tipo (principal o secundario), contra lo esperable al azar. Como sale de **tus elecciones y no de los ejes**, mostrar el tipo no revela qué significa cada eje: no rompe la regla de proteger la magia.

| Rol | Tipos | Notas |
|---|---|---|
| Líder de gimnasio (8 gimnasios de Kanto) | Roca, Agua, Eléctrico, Planta, Veneno, Psíquico, Fuego, Tierra | |
| Alto Mando (4) | Hielo, Lucha, Fantasma, Dragón | Resuelve el hueco: Kanto no tiene gimnasio de Fantasma ni de Dragón, pero sí su miembro del Alto Mando |
| Sin rol de gimnasio | Normal, Volador, Bicho | Normal es lo que queda cuando ningún tipo predomina. Volador y Bicho tienen clase de ruta propia: **Cazapájaros** y **Cazabichos** |

### El desbalance que hay que corregir

En una simulación de 20.000 selecciones al azar, con un umbral común para todos los tipos, predominan sobre todo los tipos con pocos candidatos y casi nunca los de muchos:

| Tipo | Veces que predomina |
|---|---|
| Fuego | 9 % |
| Fantasma | 8 % |
| Dragón | 5 % |
| Eléctrico | 5 % |
| Agua, Planta, Veneno, Volador, Roca | menos de 1 % cada uno, con un umbral alto |

Fuego, Fantasma, Dragón y Eléctrico suben porque basta con repetir un Pokémon dual en dos casillas. Y si todo el que tenga un tipo predominante fuera líder, lo serían unos 4 de cada 10 usuarios. La corrección propuesta:

- **Umbral por tipo**, calibrado con la simulación, para que cada tipo con rol dé alrededor del 1 % y el conjunto de líderes y Alto Mando quede en torno al 10–12 %.
- Fantasma y Dragón no pueden bajar del 5–8 %, porque el conteo solo llega a 0, 1 o 2. Se acotan exigiendo además que su eje esté extremo.
- Si no se logra equilibrar así, alternativa: elegir el tipo por el eje más extremo, que está equilibrado por construcción, a costa de que el nombre del gimnasio sí revele el significado del eje.

## Clases de entrenador de ruta (27)

Signatura: polo alto (+) o bajo (−) de cada eje. Los nombres en español están por confirmar contra la edición oficial.

| Clase (ES / EN) | Firma | Idea en una línea |
|---|---|---|
| Joven / Youngster | Sencillez+, Energía+, Ambición− | Alegre y sin pretensiones |
| Chica / Lass | Sensibilidad+, Cercanía, Confianza | Abierta y confiada |
| Cazabichos / Bug Catcher | Sencillez+, Ritmo pausado, Lo concreto | Paciencia y ojo para lo pequeño |
| Marinero / Sailor | Independencia, Aguanta todo, Energía+ | Curtido y libre |
| Joven entrenador / Jr. Trainer | Ambición+, Confianza, Constancia | Aspirante con ganas |
| Pokémaníaco / Pokémaniac | Constancia, Vida interior, Lo concreto | Pasión obsesiva |
| Empollón / Super Nerd | Lo abstracto, Reserva, Ritmo pausado | Cabeza en las ideas |
| Montañero / Hiker | Aguanta todo, Constancia, Pragmatismo | Resistencia tranquila |
| Motero / Biker | Vehemencia, Independencia, Espontaneidad | Velocidad y desafío |
| Pícaro / Burglar | Escepticismo, Independencia, Pragmatismo | Listo y sin ataduras |
| Ingeniero / Engineer | Pragmatismo, Constancia, Lo abstracto | Resuelve con método |
| Malabarista / Juggler | Cambio, Ritmo vibrante, Busca destacar | Espectáculo y reinvención |
| Pescador / Fisherman | Ritmo pausado, Vida interior, Disfruta lo sencillo | Espera sin prisa |
| Nadador / Swimmer | Ritmo vibrante, Espontaneidad, Independencia | Se lanza al agua |
| Macarra / Cue Ball | Vehemencia, Aguanta todo, Autosuficiencia | Dureza de calle |
| Jugador / Gambler | Espontaneidad, Ambición+, Cambio | Arriesga por intuición |
| Belleza / Beauty | Busca destacar, Apertura emocional, Cercanía | Presencia y encanto |
| Psíquico / Psychic | Lo abstracto, Vida interior, Reserva | Mira por dentro |
| Rockero / Rocker | Vehemencia, Busca destacar, Espontaneidad | Ruido y escena |
| Domador / Tamer | Cuida y hace crecer, Constancia, Vehemencia | Mano firme y cariño |
| Cazapájaros / Bird Keeper | Independencia, Cuida y hace crecer, Mira hacia fuera | Libertad cuidada |
| Cinturón negro / Black Belt | Constancia, Templanza, Aguanta todo | Disciplina serena |
| Científico / Scientist | Lo abstracto, Escepticismo, Constancia | Duda y comprueba |
| Caballero / Gentleman | Reserva, Estabilidad, Templanza | Formal y constante |
| Canalizador / Channeler | Vida interior, Se deja afectar, Idealismo | Sensible a lo invisible |
| Entrenador experto / Cooltrainer | Ambición+, Constancia, Pragmatismo | Nivel alto y fiable |
| Criador / Pokémon Breeder | Cuida y hace crecer, Constancia, Estabilidad | Paciencia que cuida |

**Cobertura.** Cada uno de los 30 polos debería estar en la firma de al menos una clase, y los polos «Mira hacia fuera», «Arraigo», «Idealismo» y «Se deja afectar» están flojos. Lo comprobará la simulación y se añadirán clases si hace falta.

## NPC (12)

| NPC | Firma | Idea |
|---|---|---|
| Profesor (Oak) | Lo abstracto, Cuida y hace crecer | Mentor curioso |
| Enfermera del Centro Pokémon | Cuida y hace crecer, Apertura emocional, Constancia | Cuidado constante |
| Policía | Constancia, Pragmatismo, Reserva | Orden y deber |
| Dependiente | Disfruta lo sencillo, Cercanía, Arraigo | Amable y cercano |
| Presidente del club de fans | Apertura emocional, Ritmo vibrante, Busca destacar | Entusiasmo contagioso |
| Gurú de la pesca | Ritmo pausado, Vida interior, Estabilidad | Sabio sin prisas |
| Guardia | Constancia, Reserva, Arraigo | Cumple su puesto |
| Viejo sabio | Estabilidad, Aguanta todo, Mira hacia fuera | Ha visto de todo |
| Voluntario de la Torre | Cuida y hace crecer, Se deja afectar, Idealismo | Memoria y cariño |
| Informático | Lo abstracto, Disfruta lo sencillo, Ritmo pausado | Genio de andar por casa |
| Guía de gimnasio | Constancia, Confianza, Mira hacia fuera | Anima desde fuera |
| Aspirante a Maestro (novato) | Ambición+, Confianza, Ritmo vibrante | Primer paso |

## Categorías especiales

- **Protagonista:** Aspirante a Maestro Pokémon (el novato con ambición y confianza).
- **Rival:** el que compite de cerca, con ambición, orgullo y algo de ironía.
- **Campeón:** varios ejes extremos con ambición y constancia.
- **Equipo Rocket (3):** Ejecutivo, Científico Rocket y Jefe del Equipo Rocket. Se evita «recluta» (suena a prescindible) y se escribe como ambición con visión, sin llamar «malo» al usuario.
- **Líder de gimnasio (8) y Alto Mando (4):** una clase por tipo, con el nombre del tipo en el título («Líder de gimnasio de Agua», «Alto Mando de Fantasma»).

Total: 27 de ruta, 12 NPC, 3 especiales, 3 Rocket y 12 de gimnasio o Alto Mando: unas **57 clases**.

## Sprites

Se generan con un modelo de imagen a partir de una descripción de texto (sin imágenes de referencia de Nintendo), para tener arte propio.

- **Estilo:** pixel art de 16 bits, frente, cuerpo entero, proporciones chibi (cabeza de un tercio de la altura), contorno oscuro, fondo transparente.
- **Postproceso:** recorte, reducción a 96 px de alto (coincide con los sprites de Pokémon) y paleta de 24 colores.
- **Piloto (2026-10-16):** 5 clases con 2 variantes cada una. La primera tanda salió con proporciones desiguales; con las proporciones fijadas en el prompt, la segunda tanda ya es coherente.
- **Coste:** unos 0,04 € por imagen en el piloto; unos 60 sprites con 2–3 variantes cada uno, entre 5 y 10 € en total, más repeticiones.
- **Uso:** en la página del resultado y en la imagen descargable. Mismo tamaño y estilo para todos, también los líderes (un diseño distinto por tipo).
- La clave de la API vive solo en `.env` (ignorado por git).

## Cuotas objetivo y calibración

Cuotas orientativas del conjunto de usuarios, a ajustar con la simulación de 10.000 selecciones:

| Grupo | Cuota |
|---|---|
| Entrenador de ruta y NPC | 55–65 % |
| Líderes y Alto Mando | 10–12 % |
| Protagonista | 6–8 % |
| Rival | 5–6 % |
| Rocket | 6–8 % |
| Profesor y mentores | 4–5 % |
| Campeón | 2–3 % |

Ninguna clase por debajo del 0,5 % ni por encima del 8 %. Se ajustan las firmas y los umbrales hasta lograrlo.

## Riesgos

- **Jerarquía de prestigio:** nadie quiere ser «Joven» frente a un «Campeón». Cada clase de ruta necesita un lado atractivo y las cuotas deben evitar que casi todos caigan en la más corriente.
- **Rocket:** «villano» puede sentar mal; se cuida el tono.
- **Derechos:** se usan clases genéricas (no nombres de personajes) y arte propio, nunca sprites de Nintendo.
- **Pérdida de resolución:** pasar de 720 combinaciones a unas 60 clases se compensa con el estilo como subtítulo.

## Siguientes pasos

1. Escribir el nombre y las dos frases de cada clase, en español e inglés (borrador de IA, revisión de Rafa).
2. Probar la asignación en la simulación y ajustar firmas, umbrales y cuotas.
3. Generar los sprites de las ~57 clases con la plantilla fija.
4. Integrar en el motor, el resultado y la imagen descargable.

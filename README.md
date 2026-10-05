## Nombre del proyecto: 
VisuAlgoritmos - Visualizador y comparador Web de Algoritmos de Ordenamiento

Sitio publicado: [[URL de Netlify](https://visualizador-2026b.netlify.app/)] 
Repositorio: [[URL del repositorio](https://github.com/Equipo-aaaa/VisualizadorOrdenamientos)]
GitHub Project: [[URL del GitHub Project](https://github.com/Equipo-aaaa/VisualizadorOrdenamientos/projects)]


## Integrantes:
Brayan Jaziel Navarro Ayala      
José Andrés Flores Parra           
Diego Antonio Espinosa Salinas     
Daniel Alejandro Rodríguez González 

## Descripción:
VisuAlgoritmos es una aplicación web con dos páginas:

**Visualizador de Ordenamientos:** anima paso a paso cómo ordena cada algoritmo, mostrando con colores las comparaciones, los intercambios y las posiciones que ya quedaron en su lugar.

**Comparador de Algoritmos:** ejecuta los 8 algoritmos sobre los mismos arreglos de distintos tamaños y grafica su tiempo de ejecución y el número de operaciones que realizan.

Toda la aplicación funciona en el navegador, sin servidor, y está publicada en Netlify.

## Objetivo: 
Comprender y comparar el comportamiento de distintos algoritmos de ordenamiento, relacionando su complejidad teórica con evidencia práctica: cómo se mueven los datos durante el ordenamiento y cómo crecen el tiempo y las operaciones al aumentar el tamaño de la entrada.

## Algoritmos implementados:

1. Bubble Sort          O(n²)
Recorre el arreglo comparando pares adyacentes e intercambiándolos si están en desorden.
Es la versión de fuerza bruta: hace todas las pasadas aunque el arreglo ya esté ordenado.

2. Selection Sort       O(n²)
En cada pasada busca el mínimo de la parte no ordenada y lo coloca al inicio con un solo intercambio.

3. Insertion Sort	    O(n²)
Toma cada elemento y lo inserta en su lugar dentro de la parte ya ordenada, desplazando a la derecha los mayores. 
No intercambia: escribe.

4. Exchange Sort	    O(n²)
Compara cada posición i con todas las siguientes y las intercambia cuando la de adelante es menor.

5. Gnome Sort	        O(n²)
Avanza mientras el par actual esté en orden; si no, intercambia y retrocede una posición, como un gnomo acomodando macetas.

6. Merge Sort	        O(n log n)
Divide el arreglo a la mitad recursivamente y mezcla las mitades ordenadas.

7. Quick Sort	        O(n log n)
Elige el último elemento como pivote, coloca a su izquierda los menores y lo deja en su posición final; repite en cada lado.

8. Stooge Sort	        O(n^2.71)
Ordena recursivamente los primeros 2/3, luego los últimos 2/3 y otra vez los primeros 2/3. Es intencionalmente ineficiente.

Stooge Sort está limitado a N = 30 en el visualizador y N = 500 en el comparador, porque con tamaños mayores tarda demasiado.

## Tecnologías usadas:
HTML, CSS y JavaScript (módulos ES, sin frameworks).
Bootstrap 5 y Bootstrap Icons para la interfaz.
Chart.js para las gráficas del comparador.
Git y GitHub para control de versiones, y GitHub Projects para organizar las tareas.
Netlify para publicar el sitio.

## Cómo ejecutar el proyecto:
- Localmente:
El proyecto usa módulos de JavaScript (`import` / `export`), así que **no funciona abriendo el HTML con doble clic** (`file://`). Hay que usar un servidor local:
1. Abrir la carpeta del proyecto en VS Code.
2. Instalar la extensión **Live Server**.
3. Clic derecho en `index.html` -> **Open with Live Server**.

- Sitio publicado (Netlify):
1. Acceder al enlace: [https://visualizador-2026b.netlify.app/]

## Uso de la aplicación:
### Visualizador de Ordenamientos (`index.html`)

1. Elige el tamaño del arreglo con el control deslizante (10 a 100 elementos) o genera uno nuevo.
2. Selecciona un algoritmo en el panel izquierdo. Al cambiar de algoritmo se conserva el mismo arreglo, para comparar de forma justa.
3. Usa Iniciar, Pausar, Paso a paso y Reiniciar, y elige la velocidad (1x, 2x, 5x o Máx).
4. Colores de las barras: amarillo = comparación, rojo = intercambio o escritura, verde = ordenado.
5. Las métricas muestran comparaciones, intercambios, escrituras y pasos, además del tiempo real del algoritmo ejecutado sin animación sobre ese mismo arreglo.

### Comparador de Algoritmos (`comparador.html`)

1. Define el rango de tamaños con Inicio, Paso y Fin (por ejemplo 200, 200, 2000).
2. Presiona Generar y medir. Se crea un arreglo aleatorio por tamaño y los 8 algoritmos ordenan los mismos arreglos.
3. Elige la métrica a graficar: tiempo, comparaciones, intercambios o escrituras.
4. Activa o desactiva líneas desde el panel izquierdo, o usa la escala logarítmica para ver juntos algoritmos muy distintos.
5. La tabla inferior muestra los valores exactos.

El tiempo depende de la computadora; los conteos de operaciones son exactos y siempre dan lo mismo para el mismo arreglo.

## Deployment:
Sitio publicado: [[URL de Netlify](https://visualizador-2026b.netlify.app/)] 

## Organización del equipo:
Responsabilidades por integrante:
Daniel Alejandro Rodríguez González -   Administración del repositorio y la organización en GitHub, revisión y aprobación de PR
Brayan Jaziel Navarro Ayala         -   Implementación de algoritmos en JavaScript y diseño de la interfaz
José Andrés Flores Parra            -   Implementación de algoritmos en JavaScript, métricas y gráfica comparativa
Diego Antonio Espinosa Salinas      -   Estándar de eventos, animación, construcción de las páginas e integración

Metodología de trabajo:
GitHub: el repositorio vive en una organización. Cada integrante trabajó en su propia rama y subió sus cambios con Pull Requests, que Daniel revisó y aprobó antes de integrarlos a main.

GitHub Projects: las tareas se organizaron en un tablero con las columnas Backlog, Por hacer, En progreso, En revisión y Terminado. Cada tarea indica responsable, fecha y resultado esperado.

Sprints: el trabajo se dividió en dos etapas: planeación (entrega parcial) y desarrollo e integración (entrega final).

## Uso de IA:
Usamos dos herramientas: Claude (Anthropic) y Google Stitch (Google).

Lo que generó la IA:
Estándar de eventos (js/core/eventos.js): la definición de los cuatro tipos de evento (compare, swap, overwrite, done) que usan todos los algoritmos. — Claude
Catálogo de algoritmos (js/algoritmos/catalogo.js): la lista única que leen las dos páginas. — Claude
Motor de animación (js/visualizador/barras.js y reproductor.js): las clases que dibujan las barras y aplican los eventos paso a paso. — Claude
Selector de métrica, escala logarítmica y tabla de resultados del comparador. — Claude
Pruebas automáticas (tests/pruebas-algoritmos.js y tests/prueba-eventos.html): revisan que los 8 algoritmos ordenen bien, no modifiquen el arreglo original y que sus eventos reproduzcan el resultado. — Claude
Documento del estándar de eventos (docs/estandar-eventos.md). — Claude

Realizado por nuestra cuenta con IA solo como apoyo:
Elección de tecnología: nos sugirió opciones para llevar nuestros algoritmos de Python a la web (portarlos a JavaScript, usar Pyodide o un backend), el equipo eligió portarlos a JavaScript. — Claude
Definición de tareas: nos ayudó a darle especificidad a las tareas del backlog (cuándo se considera terminada). — Claude
Boceto de la interfaz y paleta de colores: le dimos a Google Stitch la estructura que habíamos pensado para generar un boceto visual y explicarle la idea al equipo. La paleta de colores también salió de ahí. — Google Stitch
Estructura de carpetas: nos ayudó a ordenar el proyecto por responsabilidad (núcleo, algoritmos, visualizador, comparador). — Claude
Insertion Sort en JavaScript: lo usamos como algoritmo de referencia para construir el estándar de eventos. — Claude
Página del visualizador: ayudó con la conexión de los controles (iniciar, pausar, paso a paso, reiniciar y velocidad). — Claude
Corrección de errores: nos ayudó a encontrar y nos guió para corregir los errores que surgieron al integrar las partes. — Claude
Limpieza de código: nos ayudó a detectar código muerto y duplicado antes de la entrega. — Claude

Realizado por nosotros:
Algoritmos originales: los 8 algoritmos de ordenamiento en Python, que fueron la base del proyecto.
Traducción a JavaScript: la mayoría de los algoritmos los portamos nosotros desde Python.
Organización del equipo: la organización y el repositorio en GitHub, el tablero de GitHub Projects y el reparto de tareas.
Prototipo del comparador: la primera versión de la gráfica comparativa y de las métricas de tiempo, comparaciones y accesos.
Diseño y funcionalidad: las decisiones sobre cómo se ve y cómo funciona la aplicación, como conservar el mismo arreglo al cambiar de algoritmo, limitar el tamaño y controlar la velocidad.
Integración: unir el trabajo de los cuatro integrantes en una sola versión.
Revisión: revisar, probar y entender todo lo que generó la IA antes de integrarlo.


## Aprendizajes y conclusiones (individuales)
**José Andrés Flores Parra:**
Aprendizajes: Uno de los aprendizajes más significativos de esta actividad fue el trabajo colaborativo y el uso de herramientas profesionales como GitHub y Netlify, lo que me permitió aprender a publicar software en la web y experimentar el flujo de trabajo bajo la metodología ágil Scrum. Asimismo, aprendí a transcribir y adaptar la lógica de los algoritmos de ordenamiento de Python a JavaScript, e implementé la librería Chart.js, la cual me resultó sumamente útil para construir las gráficas comparativas de rendimiento. Con ello, adquirí los conocimientos técnicos necesarios para llevar los algoritmos a un sitio web interactivo, destacando el diseño del panel de métricas mediante el filtrado de la secuencia de eventos (compare, swap, overwrite y done) para contabilizar operaciones y medir tiempos de ejecución, asi como también el uso de copias exactas del arreglo para obtener resultados precisos.

Conclusión: Gracias a esta actividad, logré comprender de manera visual y práctica el comportamiento real de cada algoritmo de ordenamiento y sus diferencias de eficiencia entre sí al trabajar con distintos volúmenes de datos. Además, reafirmé la importancia de organizar el desarrollo en equipo mediante el uso de un backlog bien estructurado, lo que nos permitió dividir responsabilidades, dar seguimiento a cada tarea y cumplir con los objetivos del proyecto en tiempo y forma.

**Brayan Jaziel Navarro Ayala:**
Aprendizajes: Mi aprendizaje empezó desde el día 1 con el github, desde el momento que hicimos el primer backlog en excel y el profe nos dijo que era doble trabajo y que eso ya se podía en github fue una sorpresa, poco a poco fui aprendiendo del entorno de git en lo que esperaba mi trabajo, el cual empezó después de que mi compañero Diego me diera el estándar de eventos, con esto empecé a reescribir los algoritmos de python a Js con ejemplos como Merge e Insertion usando puros intercambios para no romper la animación, luego fui trabajando con Diego en el interfaz y ahora finalmente al poder ver el benchmark calculando los tiempos en vivo y todas las pruebas en verde, me doy cuenta de todo el trabajo que logramos. 

Conclusión: Como conclusión general, este proyecto representó el gran salto de programar algoritmos aislados a construir una verdadera arquitectura de software en equipo. Más allá de lograr que el código funcione, el verdadero reto y triunfo fue hacer que el trabajo individual encajara perfectamente en nuestro ecosistema mediante el uso de buenas prácticas y sobre todo, compromiso. Al final, no solo entregamos un visualizador interactivo y funcional, sino que experimentamos de primera mano cómo se organiza, estandariza y desarrolla un proyecto a nivel profesional así como se nos dijo desde el primer momento.

**Diego Antonio Espinosa Salinas:**
Aprendizajes: Cuando empezamos, mi conocimiento de JavaScript era muy básico. Me costaba entender cosas como los módulos, por qué la página no funcionaba al abrirla con doble clic o la diferencia entre un objeto de JavaScript y un diccionario. Hacer el estándar de eventos y el visualizador me obligó a aprenderlo sobre la marcha, y comparar cada cosa con su equivalente en Python me ayudó mucho, porque reforzaba lo de un lenguaje y lo del otro. También aprendí a usar Git más allá de subir cambios: trabajar en ramas, hacer merge, recuperar el estado anterior cuando algo salía mal y abrir Pull Requests para que los revisaran antes de integrarlos a main. En la parte de análisis, vi que la complejidad depende de cómo se implementa el algoritmo y no solo de su idea. Además me di cuenta de que medir tiempo no es tan simple: el reloj del navegador no alcanza a medir algoritmos tan rápidos y la primera ejecución siempre salía más lenta. Por eso contar operaciones resultó más confiable, porque siempre da lo mismo para el mismo arreglo.

Conclusión: Lo que más me dejó este proyecto fue ver la importancia de ponernos de acuerdo antes de programar. Al definir primero cómo cada algoritmo iba a reportar lo que hace, cada quien pudo trabajar su parte por separado. Cuando llegó la integración, la animación y las métricas funcionaron con los 8 algoritmos sin cambiar nada en ellos. Encargarme de la integración también me enseñó que limpiar el código antes de entregar vale la pena. Al final quitamos prototipos duplicados y funciones que ya no se usaban, y el proyecto quedó más fácil de entender y de explicar. Usar IA me ayudó a avanzar más rápido en lo que no dominaba, pero solo fue útil cuando entendía lo que me daba. Varias veces tuve que pedirle que me explicara el código paso a paso, y eso fue lo que realmente me permitió aprender.

**Daniel Alejandro Rodríguez González:**
Aprendizajes y conclusión: Mi parte fue cuidar el repositorio: que el código de todos llegara a main sin romper nada y que el sitio publicado siempre tuviera la versión más reciente. Primero configuré la organización en GitHub (Equipo-aaaa), di acceso a cada integrante y protegí la rama main para que nadie subiera cambios directamente. Así, cada quien trabajó en su propia rama, como Arquitectura-de-Eventos-&-Frontend, y cuando terminaba una parte abría un Pull Request. Antes de aprobar cada Pull Request, descargaba los cambios y los probaba en mi computadora. Si algo fallaba, se corregía en la rama antes de juntarlo con main, para no meter errores en la versión que todos usábamos. Al final, trabajar así nos dejó un historial ordenado en el que se ve qué aportó cada integrante y cuándo. Me di cuenta de que revisar antes de juntar el código toma tiempo, pero nos ahorró problemas, sobre todo en la integración final, cuando se juntó el trabajo de los cuatro.

---
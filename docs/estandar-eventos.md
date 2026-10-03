# Estándar de eventos

Todos los algoritmos del proyecto registran lo que hacen como una **lista de eventos**. El reproductor (`js/visualizador/reproductor.js`) no conoce los algoritmos: solo toma el arreglo original y aplica esa lista paso a paso para animar las barras. El panel de métricas cuenta comparaciones, intercambios, escrituras y accesos filtrando esa misma lista por `type`.

## Tipos de evento

| Evento | Objeto | ¿Modifica el arreglo? | Significado |
|---|---|---|---|
| `compare` | `{ type: 'compare', i, j }` | No | Se comparan las posiciones `i` y `j`. |
| `swap` | `{ type: 'swap', i, j }` | Sí | Se intercambian los valores de `i` y `j`. |
| `overwrite` | `{ type: 'overwrite', i, valor }` | Sí | Se escribe `valor` en la posición `i`. |
| `done` | `{ type: 'done', i }` | No | La posición `i` ya está en su lugar final. |

Los eventos se crean siempre con las funciones de `js/core/eventos.js` (`compare(i, j)`, `swap(i, j)`, `overwrite(i, valor)`, `done(i)`), nunca escribiendo el objeto a mano.

## Firma obligatoria de cada algoritmo

```js
export function nombreSort(lista, eventos = null) { ... return arregloOrdenado; }
```

- **No modificar `lista`**: trabajar sobre una copia (`const arr = [...lista]`), igual que `lista.copy()` en Python.
- **Registrar solo si `eventos` no es `null`**: `if (eventos) eventos.push(compare(i, j));`. Así el benchmark llama `nombreSort(arr)` y mide únicamente el ordenamiento.
- **Regla de oro**: aplicar todos los `swap` y `overwrite` sobre el arreglo original debe dar exactamente el arreglo que devuelve la función. Si no, la animación terminará distinta al resultado real. `tests/prueba-eventos.html` revisa esto automáticamente para los 8 algoritmos (también se puede correr con `node tests/pruebas-algoritmos.js`).

## Los 8 algoritmos del proyecto

Todos están registrados en `js/algoritmos/catalogo.js`, que es lo único que leen las dos páginas.

| Algoritmo | Archivo | Eventos que usa |
|---|---|---|
| Bubble Sort | `bubbleSort.js` | `compare`, `swap`, `done` |
| Selection Sort | `selectionSort.js` | `compare`, `swap`, `done` |
| Insertion Sort | `insertionSort.js` | `compare`, `overwrite`, `done` |
| Exchange Sort | `exchangeSort.js` | `compare`, `swap`, `done` |
| Gnome Sort | `gnomeSort.js` | `compare`, `swap`, `done` |
| Merge Sort (in situ) | `mergeSort.js` | `compare`, `swap`, `done` |
| Quick Sort | `quickSort.js` | `compare`, `swap`, `done` |
| Stooge Sort | `stoogeSort.js` | `compare`, `swap`, `done` |

## ¿Cuándo usar cada uno?

- **`compare`**: inmediatamente antes de cada comparación entre elementos del arreglo, aunque el resultado sea "no hacer nada". Una comparación = un evento (así el conteo de métricas coincide con el análisis teórico).
- **`swap`**: cualquier intercambio de dos posiciones (Bubble, Selection, Exchange, Gnome, Quick, Stooge y los desplazamientos de la mezcla in situ de Merge Sort).
- **`overwrite`**: cuando se escribe un valor sin intercambiar, por ejemplo los desplazamientos de Insertion Sort.
- **`done`**: cuando una posición queda fija. Los algoritmos pueden emitirlo en cuanto ocurra o, como hacen hoy los 8, para todas las posiciones al final. Cada posición debe recibir exactamente un `done`.

## Métricas del visualizador

| Métrica | Cómo se calcula |
|---|---|
| Comparaciones | Número de eventos `compare`. |
| Intercambios | Número de eventos `swap`. |
| Escrituras | Número de eventos `overwrite`. |
| Accesos | `compare` = 2 lecturas, `swap` = 4 (2 lecturas + 2 escrituras), `overwrite` = 2 (1 lectura + 1 escritura). |
| Tiempo real | El algoritmo **sin eventos ni animación** sobre el mismo arreglo, repetido hasta juntar varios ms y promediado (`medir()` de `js/comparador/benchmark.js`). |

## Ejemplo: Insertion Sort sobre `[5, 2, 4, 1]`

| # | Evento | Arreglo después |
|---|---|---|
| 1 | `compare(0, 1)` | `[5, 2, 4, 1]` |
| 2 | `overwrite(1, 5)` | `[5, 5, 4, 1]` |
| 3 | `overwrite(0, 2)` | `[2, 5, 4, 1]` |
| 4 | `compare(1, 2)` | `[2, 5, 4, 1]` |
| 5 | `overwrite(2, 5)` | `[2, 5, 5, 1]` |
| 6 | `compare(0, 1)` | `[2, 5, 5, 1]` |
| 7 | `overwrite(1, 4)` | `[2, 4, 5, 1]` |
| 8 | `compare(2, 3)` | `[2, 4, 5, 1]` |
| 9 | `overwrite(3, 5)` | `[2, 4, 5, 5]` |
| 10 | `compare(1, 2)` | `[2, 4, 5, 5]` |
| 11 | `overwrite(2, 4)` | `[2, 4, 4, 5]` |
| 12 | `compare(0, 1)` | `[2, 4, 4, 5]` |
| 13 | `overwrite(1, 2)` | `[2, 2, 4, 5]` |
| 14 | `overwrite(0, 1)` | `[1, 2, 4, 5]` |
| 15–18 | `done(0)` … `done(3)` | `[1, 2, 4, 5]` |

En total: 18 eventos, 6 comparaciones, 0 intercambios y 8 escrituras.

**Nota sobre Insertion Sort:** en `compare(j, j + 1)` la posición `j + 1` es el "hueco" donde viaja la clave. Mientras se desplazan elementos, la barra de la clave no se ve (aparece un valor repetido, como en los pasos 2, 5 y 9) y reaparece con el último `overwrite`. Es fiel al algoritmo de Python, que guarda la clave en una variable aparte.

## Archivos retirados en la integración

`js/algoritmos_andres.js`, `js/comparador_chart.js`, `js/metricas.js` y `prueba_andres.html` fueron el prototipo de Andrés. Su trabajo quedó así en la versión final:

- Gnome, Exchange y Stooge → `js/algoritmos/gnomeSort.js`, `exchangeSort.js`, `stoogeSort.js` (con el estándar de eventos).
- Generador de listas y gráfica Chart.js → `js/comparador/benchmark.js` y `js/comparador/pagina-comparador.js`.
- Métricas de accesos y tiempo sin animación → `js/visualizador/pagina-visualizador.js`.

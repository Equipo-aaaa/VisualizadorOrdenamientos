# Estándar de eventos

Todos los algoritmos del proyecto registran lo que hacen como una **lista de eventos**. El reproductor (`js/visualizador/reproductor.js`) no conoce los algoritmos: solo toma el arreglo original y aplica esa lista paso a paso para animar las barras. El panel de métricas cuenta comparaciones e intercambios filtrando esa misma lista por `type`.

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
- **Regla de oro**: aplicar todos los `swap` y `overwrite` sobre el arreglo original debe dar exactamente el arreglo que devuelve la función. Si no, la animación terminará distinta al resultado real. `tests/prueba-eventos.html` revisa esto automáticamente.

## ¿Cuándo usar cada uno?

- **`compare`**: inmediatamente antes de cada comparación entre elementos del arreglo, aunque el resultado sea "no hacer nada". Una comparación = un evento (así el conteo de métricas coincide con el análisis teórico).
- **`swap`**: Bubble, Selection, Quick, Heap, Stooge y cualquier intercambio de dos posiciones.
- **`overwrite`**: cuando se escribe un valor sin intercambiar, por ejemplo los desplazamientos de Insertion y Shell, o la mezcla de Merge Sort desde el arreglo auxiliar.
- **`done`**: cuando una posición queda fija. Algoritmos que fijan posiciones en el camino (Selection, Bubble, Heap, el pivote de Quick) pueden emitirlo en cuanto ocurra. Si no, se emite para todas al final. Cada posición debe recibir exactamente un `done`.

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

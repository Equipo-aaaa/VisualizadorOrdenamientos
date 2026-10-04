# Estándar de eventos

**Proyecto VisuAlgoritmos — Análisis de Algoritmos**

## 1. Introducción

Todos los algoritmos de ordenamiento del proyecto, además de ordenar, registran lo que hacen en una *lista de eventos*. Cada evento describe una sola operación sobre el arreglo: una comparación, un intercambio, una escritura o la confirmación de que una posición ya quedó en su lugar.

Esta lista permite separar el trabajo en partes independientes. El reproductor (`js/visualizador/reproductor.js`) no conoce ningún algoritmo: solo toma el arreglo original y aplica los eventos uno por uno para animar las barras. Del mismo modo, las métricas de las dos páginas se obtienen contando los eventos por tipo. Gracias a esto, agregar un algoritmo nuevo no requiere modificar la animación ni las métricas; basta con que respete este estándar.

## 2. Tipos de evento

El estándar define cuatro tipos de evento. Todos se crean con las funciones de `js/core/eventos.js` y nunca escribiendo el objeto a mano, para evitar errores de dedo en el nombre del tipo.

**Comparación (`compare`).** Se crea con `compare(i, j)` y produce el objeto `{ type: 'compare', i, j }`. Indica que se compararon los valores de las posiciones `i` y `j`. No modifica el arreglo; en la animación ambas barras se pintan de color ámbar.

**Intercambio (`swap`).** Se crea con `swap(i, j)` y produce `{ type: 'swap', i, j }`. Indica que los valores de las posiciones `i` y `j` intercambiaron lugar. Sí modifica el arreglo; en la animación ambas barras cambian de altura y se pintan de rosa.

**Escritura (`overwrite`).** Se crea con `overwrite(i, valor)` y produce `{ type: 'overwrite', i, valor }`. Indica que se escribió `valor` en la posición `i` sin intercambiar con otra posición. Sí modifica el arreglo; se usa, por ejemplo, en los desplazamientos de Insertion Sort.

**Posición final (`done`).** Se crea con `done(i)` y produce `{ type: 'done', i }`. Indica que la posición `i` ya contiene su valor definitivo. No modifica el arreglo; en la animación la barra se pinta de verde. No representa una operación del algoritmo, por lo que no se cuenta en las métricas.

## 3. Reglas para implementar un algoritmo

Cada algoritmo debe exportar una función con la siguiente firma:

```js
export function nombreSort(lista, eventos = null) { ... return arregloOrdenado; }
```

Además, debe cumplir tres reglas.

**No modificar la lista recibida.** El algoritmo trabaja sobre una copia (`const arr = [...lista]`), igual que `lista.copy()` en la versión de Python. Esto permite que todos los algoritmos ordenen exactamente el mismo arreglo cuando se comparan.

**Registrar eventos solo cuando se piden.** Cada registro se escribe como `if (eventos) eventos.push(compare(i, j));`. Cuando el benchmark llama a `nombreSort(arr)` sin lista de eventos, el algoritmo no gasta tiempo ni memoria registrando, y así se mide únicamente el ordenamiento.

**Regla de oro: los eventos deben reproducir el resultado.** Si se aplican todos los `swap` y `overwrite` sobre el arreglo original, el resultado debe ser exactamente el arreglo que devuelve la función. De lo contrario, la animación terminaría en un estado distinto al resultado real. Además, cada posición debe recibir exactamente un evento `done`.

En cuanto a cuándo registrar cada evento: un `compare` va inmediatamente antes de cada comparación entre elementos del arreglo, aunque el resultado sea no hacer nada, de modo que una comparación equivale a un evento y el conteo coincide con el análisis teórico. Un `swap` se registra en cada intercambio de dos posiciones, y un `overwrite` cuando se escribe un valor sin intercambiar. Los `done` pueden emitirse en cuanto una posición queda fija o todos al final; actualmente los ocho algoritmos los emiten al final.

## 4. Algoritmos del proyecto

Los ocho algoritmos están registrados en `js/algoritmos/catalogo.js`, que es la única lista que leen las dos páginas y las pruebas. Cada uno vive en su propio archivo dentro de `js/algoritmos/`.

Siete de ellos —Bubble Sort, Selection Sort, Exchange Sort, Gnome Sort, Merge Sort, Quick Sort y Stooge Sort— trabajan únicamente con intercambios, por lo que utilizan los eventos `compare`, `swap` y `done`. Insertion Sort es la excepción: no intercambia, sino que desplaza elementos y guarda la clave en una variable aparte, así que utiliza `compare`, `overwrite` y `done`.

Merge Sort merece una aclaración. La versión del equipo mezcla *in situ*: en lugar de usar un arreglo auxiliar, recorre los elementos con intercambios sucesivos. Esto ahorra memoria, pero cada mezcla puede costar O(n²) desplazamientos, por lo que en el comparador su curva no se ve como O(n log n).

## 5. Uso de los eventos en las métricas

### 5.1 Visualizador

En el Visualizador, las métricas avanzan junto con la animación. Cada vez que el reproductor aplica un evento, `js/visualizador/pagina-visualizador.js` lo cuenta según su tipo: los `compare` suman comparaciones, los `swap` suman intercambios y los `overwrite` suman escrituras.

Los accesos a memoria se estiman a partir de los mismos eventos: una comparación implica dos lecturas; un intercambio, cuatro accesos (dos lecturas y dos escrituras); y una escritura, dos accesos (una lectura y una escritura).

El tiempo real se mide aparte. Se ejecuta el algoritmo sin eventos ni animación sobre el mismo arreglo, repitiéndolo hasta acumular varios milisegundos y dividiendo entre el número de repeticiones, con la función `medir()` de `js/comparador/benchmark.js`. Esto es necesario porque una sola ejecución con arreglos pequeños es más rápida que la resolución del reloj del navegador.

### 5.2 Comparador

El Comparador obtiene comparaciones, intercambios y escrituras con la función `contar()` de `js/comparador/benchmark.js`. Como los algoritmos solo llaman a `eventos.push(...)`, en lugar de un arreglo real se les pasa un objeto con su propio `push`, que suma en vez de guardar. De esta manera se pueden contar millones de eventos —por ejemplo, Stooge Sort con 500 elementos— sin llenar la memoria. Los eventos `done` no se cuentan.

Estos conteos son exactos: para un mismo arreglo siempre dan el mismo resultado, sin importar la computadora. El tiempo, en cambio, se mide con `medir()` sin eventos, igual que en el Visualizador, y sí depende del equipo y del navegador.

## 6. Ejemplo: Insertion Sort sobre [5, 2, 4, 1]

La siguiente tabla muestra los eventos que genera Insertion Sort al ordenar el arreglo `[5, 2, 4, 1]` y el estado del arreglo después de aplicar cada uno.

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

En total se generan 18 eventos: 6 comparaciones, 0 intercambios, 8 escrituras y 4 marcas de posición final.

Conviene notar que, en `compare(j, j + 1)`, la posición `j + 1` es el "hueco" por donde viaja la clave. Mientras se desplazan los elementos, la barra de la clave no se ve y aparece un valor repetido (pasos 2, 5 y 9); la clave reaparece con el último `overwrite` de cada inserción. Este comportamiento es fiel al algoritmo de Python, que guarda la clave en una variable aparte.

## 7. Pruebas automáticas

El archivo `tests/pruebas-algoritmos.js` verifica que todos los algoritmos del catálogo cumplan el estándar. Puede ejecutarse en el navegador abriendo `tests/prueba-eventos.html`, que además muestra una animación de prueba, o desde la terminal con `node tests/pruebas-algoritmos.js`.

Cada algoritmo se prueba con seis casos borde (arreglo vacío, un elemento, ya ordenado, invertido, todos iguales y con repetidos) y con 100 arreglos aleatorios. Sobre ellos se revisa que el algoritmo ordene correctamente; que no modifique el arreglo original; que reproducir sus eventos dé el mismo resultado que devuelve la función; que al llamarlo sin lista de eventos dé el mismo resultado; que solo use los cuatro tipos del estándar; y que emita exactamente un `done` por posición.

## 8. Antecedente: prototipo de Andrés

Antes de la integración, Andrés desarrolló un prototipo independiente que hoy se conserva como referencia en la carpeta `prototipos/andres/`. Contiene `algoritmos_andres.js`, `comparador_chart.js`, `metricas.js` y `prueba_andres.html`. Ninguna de las dos páginas carga estos archivos.

Su trabajo quedó incorporado a la versión final de la siguiente manera. Gnome Sort, Exchange Sort y Stooge Sort se adaptaron al estándar de eventos en `js/algoritmos/gnomeSort.js`, `exchangeSort.js` y `stoogeSort.js`. El generador de listas y la gráfica con Chart.js dieron origen a `js/comparador/benchmark.js` y `js/comparador/pagina-comparador.js`. Por último, el criterio de accesos a memoria y la medición del tiempo sin animación se integraron en `js/visualizador/pagina-visualizador.js`.

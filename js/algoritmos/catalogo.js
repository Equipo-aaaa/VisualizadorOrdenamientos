import { insertionSort } from './insertionSort.js';
// Cuando cada integrante termine su algoritmo, se importa aquí y se pone en `fn`:
// import { bubbleSort } from './bubbleSort.js';

/**
 * CATÁLOGO DE ALGORITMOS
 *
 * Única lista que leen las dos páginas. Para "conectar" un algoritmo nuevo
 * basta con importarlo arriba y cambiar `fn: null` por la función.
 * Mientras `fn` sea null, la página lo muestra como "Pendiente" y lo ignora.
 *
 * Campos:
 *   id          Identificador corto (se usa en el HTML).
 *   nombre      Texto visible.
 *   descripcion Frase corta bajo el nombre.
 *   tiempo      Complejidad temporal promedio (texto).
 *   espacio     Complejidad espacial (texto).
 *   color       Color de su línea en la gráfica del comparador.
 *   maxN        Tamaño máximo permitido en el visualizador (Stooge genera
 *               cientos de miles de eventos con N grande).
 *   maxNComparador (opcional) Tamaño máximo que se mide en el comparador;
 *               arriba de eso su línea se corta. Sin él, no hay límite.
 *   ocultoPorDefecto (opcional) Si es true, su línea empieza desactivada
 *               en la gráfica (Stooge aplasta la escala de los demás).
 *   fn          La función (lista, eventos = null) => arreglo ordenado.
 */
export const ALGORITMOS = [
  { id: 'bubble',    nombre: 'Bubble Sort',    descripcion: 'Intercambio adyacente', tiempo: 'O(n²)',      espacio: 'O(1)',      color: '#60A5FA', maxN: 100, fn: null },
  { id: 'selection', nombre: 'Selection Sort', descripcion: 'Mínimos sucesivos',     tiempo: 'O(n²)',      espacio: 'O(1)',      color: '#F97316', maxN: 100, fn: null },
  { id: 'insertion', nombre: 'Insertion Sort', descripcion: 'Inserción ordenada',    tiempo: 'O(n²)',      espacio: 'O(1)',      color: '#10B981', maxN: 100, fn: insertionSort },
  { id: 'merge',     nombre: 'Merge Sort',     descripcion: 'Divide y vencerás',     tiempo: 'O(n log n)', espacio: 'O(n)',      color: '#06B6D4', maxN: 100, fn: null },
  { id: 'quick',     nombre: 'Quick Sort',     descripcion: 'Partición con pivote',  tiempo: 'O(n log n)', espacio: 'O(log n)',  color: '#6366F1', maxN: 100, fn: null },
  { id: 'heap',      nombre: 'Heap Sort',      descripcion: 'Montículo binario',     tiempo: 'O(n log n)', espacio: 'O(1)',      color: '#EC4899', maxN: 100, fn: null },
  { id: 'shell',     nombre: 'Shell Sort',     descripcion: 'Brechas decrecientes',  tiempo: 'O(n^1.5)',   espacio: 'O(1)',      color: '#EAB308', maxN: 100, fn: null },
  { id: 'stooge',    nombre: 'Stooge Sort',    descripcion: 'Recursivo 2/3 traslape', tiempo: 'O(n^2.7)',  espacio: 'O(n)',      color: '#F43F5E', maxN: 30,  maxNComparador: 500, ocultoPorDefecto: true, fn: null },
];

/** Devuelve el algoritmo con ese id (o undefined). */
export function buscarAlgoritmo(id) {
  return ALGORITMOS.find((a) => a.id === id);
}

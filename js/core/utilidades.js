/**
 * Funciones pequeñas que usan las dos páginas.
 */

/** Arreglo de `n` enteros aleatorios entre 1 y `maximo` (incluidos). */
export function arregloAleatorio(n, maximo = 100) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * maximo) + 1);
}

/** Atajo para document.getElementById. */
export const $ = (id) => document.getElementById(id);

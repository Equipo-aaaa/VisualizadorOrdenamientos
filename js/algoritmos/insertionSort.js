import { compare, overwrite, done } from '../core/eventos.js';

/**
 * Insertion Sort — Complejidad: O(N^2)
 *
 * Traducción directa de la versión en Python del equipo.
 *
 * @param {number[]} lista   Arreglo de entrada (NO se modifica, se copia).
 * @param {object[]|null} eventos  Si se pasa un arreglo, ahí se registran los
 *        eventos para la animación. Si es null (benchmark), no se registra nada.
 * @returns {number[]} Copia ordenada.
 */
export function insertionSort(lista, eventos = null) {
  const arr = [...lista];                 // arr = lista.copy()

  for (let i = 1; i < arr.length; i++) {  // for i in range(1, len(arr))
    const clave = arr[i];
    let j = i - 1;

    // while j >= 0 and arr[j] > clave
    // Se separa en dos pasos para registrar la comparación ANTES de decidir.
    while (j >= 0) {
      if (eventos) eventos.push(compare(j, j + 1));
      if (!(arr[j] > clave)) break;

      arr[j + 1] = arr[j];                // desplaza a la derecha
      if (eventos) eventos.push(overwrite(j + 1, arr[j]));
      j--;
    }

    arr[j + 1] = clave;                   // inserta la clave en su hueco
    if (eventos) eventos.push(overwrite(j + 1, clave));
  }

  // Insertion Sort no fija posiciones definitivas hasta terminar:
  // todas se marcan como ordenadas al final.
  if (eventos) {
    for (let k = 0; k < arr.length; k++) eventos.push(done(k));
  }

  return arr;
}

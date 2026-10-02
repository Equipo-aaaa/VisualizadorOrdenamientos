import { compare, swap, done } from '../core/eventos.js';

/**
 * Bubble Sort — Complejidad: O(N^2)
 *
 * Traducción directa de la versión en Python del equipo.
 *
 * @param {number[]} lista   Arreglo de entrada (NO se modifica, se copia).
 * @param {object[]|null} eventos  Si se pasa un arreglo, ahí se registran los eventos.
 * @returns {number[]} Copia ordenada.
 */
export function bubbleSort(lista, eventos = null) {
    const arr = [...lista];
    const n = arr.length;

    // Ciclo externo
    for (let i = 0; i < n; i++) {
        // Ciclo interno
        for (let j = 0; j < n - 1; j++) {
            
            // 1. Registramos la comparación ANTES del if
            if (eventos) eventos.push(compare(j, j + 1));
            
            if (arr[j] > arr[j + 1]) {
                // 2. Registramos el intercambio
                if (eventos) eventos.push(swap(j, j + 1));
                
                // 3. Intercambio de elementos
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }

    // 4. Marcamos todas las posiciones como terminadas al final
    for (let k = 0; k < n; k++) {
        if (eventos) eventos.push(done(k));
    }

    return arr;
}
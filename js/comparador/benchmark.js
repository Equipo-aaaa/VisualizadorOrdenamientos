/**
 * BENCHMARK — mide cuánto tarda cada algoritmo con arreglos de distinto tamaño.
 *
 * No toca el HTML: recibe datos y devuelve números. Así se puede probar sin
 * navegador y Andrés puede cambiar la gráfica sin tocar la medición.
 */

/**
 * Lista de tamaños: inicio, inicio+paso, ... sin pasarse de fin.
 * tamanosDeMuestra(20, 20, 100) → [20, 40, 60, 80, 100]
 */
export function tamanosDeMuestra(inicio, paso, fin) {
  const tamanos = [];
  for (let n = inicio; n <= fin; n += paso) tamanos.push(n);
  return tamanos;
}

/**
 * Revisa los tres campos del generador. Devuelve un texto con el error,
 * o null si todo está bien.
 */
export function validarRango(inicio, paso, fin, limites = { maxN: 10000, maxPuntos: 50 }) {
  if (![inicio, paso, fin].every(Number.isInteger)) return 'Los tres campos deben ser números enteros.';
  if (inicio < 1 || paso < 1) return 'Inicio y paso deben ser mayores o iguales a 1.';
  if (fin < inicio) return 'El fin debe ser mayor o igual al inicio.';
  if (fin > limites.maxN) return `El fin no puede pasar de ${limites.maxN} elementos.`;
  const puntos = Math.floor((fin - inicio) / paso) + 1;
  if (puntos > limites.maxPuntos) return `Se generarían ${puntos} arreglos; el máximo es ${limites.maxPuntos}. Aumenta el paso.`;
  return null;
}

/**
 * Tiempo promedio (ms) de UNA ejecución de `fn` sobre `arreglo`.
 *
 * El reloj del navegador (performance.now) solo mide de 0.1 ms en 0.1 ms, y
 * ordenar 20 elementos tarda mucho menos. Por eso se repite el ordenamiento
 * hasta juntar al menos `tiempoMinimo` ms y se divide entre las repeticiones.
 * Se llama SIN lista de eventos (fn(arreglo)) para medir solo el algoritmo.
 */
export function medir(fn, arreglo, tiempoMinimo = 5) {
  let repeticiones = 0;
  const inicio = performance.now();
  let transcurrido = 0;

  do {
    fn(arreglo);            // cada algoritmo copia el arreglo: el original no cambia
    repeticiones++;
    transcurrido = performance.now() - inicio;
  } while (transcurrido < tiempoMinimo);

  return transcurrido / repeticiones;
}

/** Cede el control al navegador un instante para que repinte la página. */
const respirar = () => new Promise((resolver) => setTimeout(resolver, 0));

/**
 * Ejecuta la comparación completa.
 *
 * @param {object[]} algoritmos  Elementos del catálogo (con fn != null).
 * @param {number[][]} arreglos  Un arreglo aleatorio por tamaño. TODOS los
 *                               algoritmos ordenan los mismos arreglos.
 * @param {function} alProgreso  (hechos, total) para actualizar la barra.
 * @returns {Promise<object>}    { idAlgoritmo: [ms por tamaño, ...] }
 *                               Un null significa "no se midió" (N demasiado
 *                               grande para ese algoritmo, p. ej. Stooge).
 */
export async function ejecutarBenchmark(algoritmos, arreglos, alProgreso = () => {}) {
  const resultados = {};
  const total = algoritmos.length * arreglos.length;
  let hechos = 0;

  for (const alg of algoritmos) {
    resultados[alg.id] = [];
    for (const arreglo of arreglos) {
      const limite = alg.maxNComparador ?? Infinity;
      resultados[alg.id].push(arreglo.length <= limite ? medir(alg.fn, arreglo) : null);
      alProgreso(++hechos, total);
      await respirar();     // sin esto la página se congela hasta terminar
    }
  }
  return resultados;
}

// Tareas #16 y #20: Conteo de métricas por tipo de evento y medición de tiempo de alta precisión
// Autor: José Andrés Flores Parra 

export const estadoMetricas = {
    comparaciones: 0,
    intercambios: 0,
    accesos: 0,
    tiempoMs: 0
};

export function reiniciarMetricas() {
    estadoMetricas.comparaciones = 0;
    estadoMetricas.intercambios = 0;
    estadoMetricas.accesos = 0;
    estadoMetricas.tiempoMs = 0;
    actualizarDOMMetricas();
}

export function procesarEventoMetrica(evento) {
    if (!evento || !evento.type) return;

    if (evento.type === 'compare') {
        estadoMetricas.comparaciones += 1;
        estadoMetricas.accesos += 2;
    } else if (evento.type === 'swap') {
        estadoMetricas.intercambios += 1;
        estadoMetricas.accesos += 4;
    } else if (evento.type === 'overwrite' || evento.type === 'set') {
        estadoMetricas.intercambios += 1;
        estadoMetricas.accesos += 2;
    }
}

/**
 * Recorre el arreglo de eventos y actualiza el DOM sin borrar tiempoMs
 */
export function contarEventosPorTipo(eventos = []) {
    estadoMetricas.comparaciones = 0;
    estadoMetricas.intercambios = 0;
    estadoMetricas.accesos = 0;

    for (let i = 0; i < eventos.length; i++) {
        procesarEventoMetrica(eventos[i]);
    }
    actualizarDOMMetricas();
    return { ...estadoMetricas };
}

/**
 * Ejecuta el algoritmo en segundo plano sin pausas de animación.
 * Si una sola ejecución mide menos de 0.5 ms (por limitación del reloj del navegador),
 * ejecuta un lote de repeticiones sobre copias idénticas para obtener el promedio exacto.
 */
export function medirEjecucionSinAnimacion(funcionAlgoritmo, arregloOriginal) {
    reiniciarMetricas();

    // 1. Primera pasada: ejecutamos el algoritmo y medimos el tiempo inicial
    const copiaMetrica = [...arregloOriginal];
    const tInicio = performance.now();
    const resultado = funcionAlgoritmo(copiaMetrica);
    const tFin = performance.now();
    let duracionMs = tFin - tInicio;

    const eventos = resultado && Array.isArray(resultado.eventos) ? resultado.eventos : [];
    const sortedArray = resultado && resultado.sortedArray ? resultado.sortedArray : copiaMetrica;

    for (let i = 0; i < eventos.length; i++) {
        procesarEventoMetrica(eventos[i]);
    }

    // 2. Si el reloj del navegador marcó 0 o menos de 0.5 ms, medimos por lote de repeticiones
    if (duracionMs < 0.5) {
        let repeticiones = 0;
        let acumulado = 0;
        const lote = 100;

        while (acumulado < 1.0 && repeticiones < 3000) {
            const copiasLote = Array.from({ length: lote }, () => [...arregloOriginal]);

            const tLoteInicio = performance.now();
            for (let r = 0; r < lote; r++) {
                funcionAlgoritmo(copiasLote[r]);
            }
            const tLoteFin = performance.now();

            acumulado += (tLoteFin - tLoteInicio);
            repeticiones += lote;
        }
        if (acumulado > 0) {
            duracionMs = acumulado / repeticiones;
        }
    }

    estadoMetricas.tiempoMs = duracionMs;
    actualizarDOMMetricas();

    return {
        ...estadoMetricas,
        arregloOrdenado: sortedArray,
        eventos
    };
}

// Exportamos también con el nombre que importa prueba_andres.html
export const medirTiempoSinAnimacion = medirEjecucionSinAnimacion;

export function actualizarDOMMetricas() {
    const elComp = document.getElementById('metrica-comparaciones');
    const elSwap = document.getElementById('metrica-intercambios');
    const elAcc = document.getElementById('metrica-accesos');
    const elTiempo = document.getElementById('metrica-tiempo');

    if (elComp) elComp.textContent = estadoMetricas.comparaciones.toLocaleString('es-MX');
    if (elSwap) elSwap.textContent = estadoMetricas.intercambios.toLocaleString('es-MX');
    if (elAcc) elAcc.textContent = estadoMetricas.accesos.toLocaleString('es-MX');
    if (elTiempo) elTiempo.textContent = `${estadoMetricas.tiempoMs.toFixed(4)} ms`;
}
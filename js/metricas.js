
// TAREAS #16 y #20: Panel de Métricas y Medición de Tiempo de Ejecución
// Autor: José Andrés Flores Parra


export const estadoMetricas = {
    comparaciones: 0,
    intercambios: 0,
    accesos: 0,
    tiempoMs: 0
};

// Reinicia contadores a cero
export function reiniciarMetricas() {
    estadoMetricas.comparaciones = 0;
    estadoMetricas.intercambios = 0;
    estadoMetricas.accesos = 0;
    estadoMetricas.tiempoMs = 0;
    actualizarVistaMetricas();
}

// TAREA #16: Cuenta comparaciones e intercambios filtrando únicamente por evento.type
export function contarEventosPorTipo(listaEventos) {
    const comparaciones = listaEventos.filter(ev => ev.type === 'compare').length;
    const intercambios  = listaEventos.filter(ev => ev.type === 'swap' || ev.type === 'overwrite').length;
    const accesos       = (comparaciones * 2) + (intercambios * 2);

    estadoMetricas.comparaciones = comparaciones;
    estadoMetricas.intercambios  = intercambios;
    estadoMetricas.accesos       = accesos;

    actualizarVistaMetricas();
    return { comparaciones, intercambios, accesos };
}

// Para cuando el reproductor de Diego avance paso por paso durante la animación
export function registrarPasoEvento(evento) {
    if (!evento || !evento.type) return;

    if (evento.type === 'compare') {
        estadoMetricas.comparaciones++;
        estadoMetricas.accesos += 2;
    } else if (evento.type === 'swap' || evento.type === 'overwrite') {
        estadoMetricas.intercambios++;
        estadoMetricas.accesos += 2;
    }
    actualizarVistaMetricas();
}

// TAREA #20: Medir el tiempo de ejecución en segundo plano (sin animación activa)
export function medirTiempoSinAnimacion(funcionAlgoritmo, arregloOriginal) {
    const copia = [...arregloOriginal]; // Equivalente a lista_actual.copy() de tu main.py
    
    const tIni = performance.now();
    const resultado = funcionAlgoritmo(copia);
    const tFin = performance.now();

    const tiempoTotalMs = tFin - tIni;
    estadoMetricas.tiempoMs = tiempoTotalMs;
    actualizarVistaMetricas();

    return {
        tiempoMs: tiempoTotalMs,
        eventos: resultado.eventos || resultado
    };
}

// Actualiza los números en el HTML
export function actualizarVistaMetricas() {
    const elComp = document.getElementById('metrica-comparaciones');
    const elSwap = document.getElementById('metrica-intercambios');
    const elAcc  = document.getElementById('metrica-accesos');
    const elTime = document.getElementById('metrica-tiempo');

    if (elComp) elComp.textContent = estadoMetricas.comparaciones;
    if (elSwap) elSwap.textContent = estadoMetricas.intercambios;
    if (elAcc)  elAcc.textContent  = estadoMetricas.accesos;
    if (elTime) elTime.textContent = `${estadoMetricas.tiempoMs.toFixed(4)} ms`;
}